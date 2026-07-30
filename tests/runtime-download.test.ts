import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as http from "node:http";
import * as os from "node:os";
import * as path from "node:path";
import test from "node:test";
import {
  RuntimeDownloadError,
  checksumForAsset,
  downloadRuntimeAsset,
  downloadRuntimeAssetWithRetry,
  isManuallyRetryableRuntimeDownloadError,
  parseSha256Sums,
  type RuntimeBufferedRequestFn,
  type RuntimeDownloadErrorCode,
  type RuntimeDownloadProgress
} from "../src/runtime-download";

const assetName = "runtime-test.zip";
const payloadChunks = [
  Buffer.from("PK\\u0003\\u0004runtime-"),
  Buffer.from("download-"),
  Buffer.from("fixture")
];
const payload = Buffer.concat(payloadChunks);
const digest = createHash("sha256").update(payload).digest("hex");

const bufferedFetch: RuntimeBufferedRequestFn = async ({ url, headers }) => {
  const response = await fetch(url, { headers: { ...headers } });
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.arrayBuffer(),
    finalUrl: response.url
  };
};

function rejectsWithCode(code: RuntimeDownloadErrorCode) {
  return (error: unknown): boolean => {
    assert.ok(error instanceof RuntimeDownloadError);
    assert.equal(error.code, code);
    return true;
  };
}

function sendChunks(
  response: http.ServerResponse,
  chunks: readonly Buffer[],
  delayMs: number
): void {
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const sendNext = () => {
    if (response.destroyed) {
      return;
    }
    if (index >= chunks.length) {
      response.end();
      return;
    }
    response.write(chunks[index]);
    index += 1;
    timer = setTimeout(sendNext, delayMs);
  };
  response.once("close", () => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  });
  sendNext();
}

function sendRange(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  body: Buffer
): void {
  const rangeHeader = request.headers.range || "";
  const match = /^bytes=(\d+)-(\d+)$/.exec(rangeHeader);
  if (!match) {
    response.writeHead(400);
    response.end();
    return;
  }
  const start = Number(match[1]);
  const requestedEnd = Number(match[2]);
  if (start >= body.byteLength) {
    response.writeHead(416, {
      "Content-Range": `bytes */${body.byteLength}`
    });
    response.end();
    return;
  }
  const end = Math.min(requestedEnd, body.byteLength - 1);
  const chunk = body.subarray(start, end + 1);
  response.writeHead(206, {
    "Content-Length": chunk.byteLength,
    "Content-Range": `bytes ${start}-${end}/${body.byteLength}`,
    "Content-Type": "application/zip",
    ETag: '"runtime-fixture-v1"'
  });
  response.end(chunk);
}

test("runtime downloader streams, redirects, verifies, and cleans up", async (t) => {
  let flakyRequests = 0;
  let brokenRangeRequests = 0;
  let flakyRangeRequests = 0;
  const rangeRequests: Array<{
    path: string;
    range: string;
    ifRange: string;
  }> = [];
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");
    const recordRange = () =>
      rangeRequests.push({
        path: requestUrl.pathname,
        range: String(request.headers.range || ""),
        ifRange: String(request.headers["if-range"] || "")
      });
    switch (requestUrl.pathname) {
      case "/SHA256SUMS-test.txt": {
        const body = `${digest} *${assetName}\n`;
        response.writeHead(200, {
          "Content-Length": Buffer.byteLength(body),
          "Content-Type": "text/plain"
        });
        response.end(body);
        return;
      }
      case "/SHA256SUMS-bad.txt": {
        const body = `${"0".repeat(64)}  ${assetName}\n`;
        response.writeHead(200, {
          "Content-Length": Buffer.byteLength(body),
          "Content-Type": "text/plain"
        });
        response.end(body);
        return;
      }
      case "/redirect":
        response.writeHead(302, { Location: "/asset" });
        response.end();
        return;
      case "/asset":
      case "/bad-asset":
        response.writeHead(200, {
          "Content-Length": payload.byteLength,
          "Content-Type": "application/zip"
        });
        sendChunks(response, payloadChunks, 10);
        return;
      case "/chunked":
        response.writeHead(200, { "Content-Type": "application/zip" });
        sendChunks(response, payloadChunks, 10);
        return;
      case "/flaky":
        flakyRequests += 1;
        if (flakyRequests < 3) {
          response.writeHead(503);
          response.end();
          return;
        }
        response.writeHead(200, {
          "Content-Length": payload.byteLength,
          "Content-Type": "application/zip"
        });
        sendChunks(response, payloadChunks, 10);
        return;
      case "/range-asset":
        recordRange();
        sendRange(request, response, payload);
        return;
      case "/range-ignored":
        recordRange();
        response.writeHead(200, {
          "Content-Length": payload.byteLength,
          "Content-Type": "application/zip"
        });
        response.end(payload);
        return;
      case "/range-breaks":
        recordRange();
        brokenRangeRequests += 1;
        if (brokenRangeRequests === 2) {
          response.writeHead(200, {
            "Content-Length": payload.byteLength,
            "Content-Type": "application/zip"
          });
          response.end(payload);
          return;
        }
        sendRange(request, response, payload);
        return;
      case "/range-bad-start": {
        recordRange();
        const chunk = payload.subarray(1, 8);
        response.writeHead(206, {
          "Content-Length": chunk.byteLength,
          "Content-Range": `bytes 1-7/${payload.byteLength}`,
          "Content-Type": "application/zip"
        });
        response.end(chunk);
        return;
      }
      case "/range-flaky":
        recordRange();
        flakyRangeRequests += 1;
        if (flakyRangeRequests === 2) {
          response.writeHead(503);
          response.end();
          return;
        }
        sendRange(request, response, payload);
        return;
      case "/range-delayed":
        recordRange();
        setTimeout(() => {
          if (!response.destroyed) {
            sendRange(request, response, payload);
          }
        }, 80);
        return;
      case "/slow": {
        response.writeHead(200, {
          "Content-Length": 1024 * 1024,
          "Content-Type": "application/zip"
        });
        const chunk = Buffer.alloc(4096, 7);
        const timer = setInterval(() => {
          if (response.destroyed) {
            clearInterval(timer);
            return;
          }
          response.write(chunk);
        }, 10);
        response.once("close", () => clearInterval(timer));
        return;
      }
      case "/stall":
        response.writeHead(200, {
          "Content-Length": payload.byteLength,
          "Content-Type": "application/zip"
        });
        response.write(payload.subarray(0, 4));
        return;
      case "/redirect-loop":
        response.writeHead(302, { Location: "/redirect-loop" });
        response.end();
        return;
      default:
        response.writeHead(404);
        response.end();
    }
  });

  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), "runtime-download-test-")
  );
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const checksumUrl = `${baseUrl}/SHA256SUMS-test.txt`;

  try {
    await t.test("follows redirects and reports byte progress", async () => {
      const partPath = path.join(temporary, "success.zip.part");
      const progress: RuntimeDownloadProgress[] = [];
      const result = await downloadRuntimeAsset({
        assetUrl: `${baseUrl}/redirect`,
        checksumUrl,
        assetName,
        partPath,
        onProgress: (update) => progress.push(update)
      });

      assert.equal(result.finalUrl, `${baseUrl}/asset`);
      assert.equal(result.partPath, partPath);
      assert.equal(result.receivedBytes, payload.byteLength);
      assert.equal(result.totalBytes, payload.byteLength);
      assert.equal(result.percent, 100);
      assert.equal(result.etaSeconds, 0);
      assert.ok(result.bytesPerSecond > 0);
      assert.equal(result.sha256, digest);
      assert.equal(result.expectedSha256, digest);
      assert.deepEqual(fs.readFileSync(partPath), payload);
      assert.ok(progress.length >= payloadChunks.length + 1);
      assert.equal(progress[0].receivedBytes, 0);
      assert.equal(progress.at(-1)?.percent, 100);
      for (let index = 1; index < progress.length; index += 1) {
        assert.ok(
          progress[index].receivedBytes >= progress[index - 1].receivedBytes
        );
      }
    });

    await t.test("downloads through validated buffered byte ranges", async () => {
      const partPath = path.join(temporary, "buffered-ranges.zip.part");
      const progress: RuntimeDownloadProgress[] = [];
      const before = rangeRequests.length;
      const result = await downloadRuntimeAsset({
        assetUrl: `${baseUrl}/range-asset`,
        checksumUrl,
        assetName,
        partPath,
        bufferedRequest: bufferedFetch,
        rangeChunkBytes: 7,
        onProgress: (update) => progress.push(update)
      });

      const requests = rangeRequests.slice(before);
      const expectedRanges: string[] = [];
      for (let start = 0; start < payload.byteLength; start += 7) {
        expectedRanges.push(`bytes=${start}-${start + 6}`);
      }
      assert.deepEqual(
        requests.map((entry) => entry.range),
        expectedRanges
      );
      assert.equal(requests[0].ifRange, "");
      assert.ok(
        requests.slice(1).every(
          (entry) => entry.ifRange === '"runtime-fixture-v1"'
        )
      );
      assert.equal(result.totalBytes, payload.byteLength);
      assert.equal(result.percent, 100);
      assert.equal(result.sha256, digest);
      assert.deepEqual(fs.readFileSync(partPath), payload);
      assert.equal(progress[0].totalBytes, null);
      assert.equal(progress.at(-1)?.percent, 100);
    });

    await t.test("accepts a complete 200 response when Range is ignored", async () => {
      const partPath = path.join(temporary, "buffered-full.zip.part");
      const before = rangeRequests.length;
      const result = await downloadRuntimeAsset({
        assetUrl: `${baseUrl}/range-ignored`,
        checksumUrl,
        assetName,
        partPath,
        bufferedRequest: bufferedFetch,
        rangeChunkBytes: 7
      });

      assert.equal(rangeRequests.length, before + 1);
      assert.equal(result.receivedBytes, payload.byteLength);
      assert.equal(result.totalBytes, payload.byteLength);
      assert.deepEqual(fs.readFileSync(partPath), payload);
    });

    await t.test("rejects a server that stops honoring Range", async () => {
      brokenRangeRequests = 0;
      const partPath = path.join(temporary, "buffered-range-break.zip.part");
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/range-breaks`,
          checksumUrl,
          assetName,
          partPath,
          bufferedRequest: bufferedFetch,
          rangeChunkBytes: 7
        }),
        rejectsWithCode("CONTENT_LENGTH_MISMATCH")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("rejects an incorrect Content-Range start", async () => {
      const partPath = path.join(temporary, "buffered-bad-range.zip.part");
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/range-bad-start`,
          checksumUrl,
          assetName,
          partPath,
          bufferedRequest: bufferedFetch,
          rangeChunkBytes: 7
        }),
        rejectsWithCode("CONTENT_LENGTH_MISMATCH")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("retries buffered downloads from byte zero", async () => {
      flakyRangeRequests = 0;
      const partPath = path.join(temporary, "buffered-retry.zip.part");
      const before = rangeRequests.length;
      const result = await downloadRuntimeAssetWithRetry({
        assetUrl: `${baseUrl}/range-flaky`,
        checksumUrl,
        assetName,
        partPath,
        bufferedRequest: bufferedFetch,
        rangeChunkBytes: 7,
        maxAttempts: 2,
        retryDelayMs: 0
      });

      const requests = rangeRequests.slice(before);
      assert.deepEqual(
        requests.slice(0, 3).map((entry) => entry.range),
        ["bytes=0-6", "bytes=7-13", "bytes=0-6"]
      );
      assert.equal(result.sha256, digest);
      assert.deepEqual(fs.readFileSync(partPath), payload);
    });

    await t.test("cancels a buffered request and ignores its late response", async () => {
      const partPath = path.join(temporary, "buffered-cancelled.zip.part");
      const controller = new AbortController();
      const progress: RuntimeDownloadProgress[] = [];
      const cancellingRequest: RuntimeBufferedRequestFn = async (request) => {
        if (new URL(request.url).pathname === "/range-delayed") {
          setTimeout(() => controller.abort(), 10);
        }
        return bufferedFetch(request);
      };
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/range-delayed`,
          checksumUrl,
          assetName,
          partPath,
          bufferedRequest: cancellingRequest,
          rangeChunkBytes: 7,
          signal: controller.signal,
          onProgress: (update) => progress.push(update)
        }),
        rejectsWithCode("ABORTED")
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      assert.equal(fs.existsSync(partPath), false);
      assert.ok(progress.every((update) => update.receivedBytes === 0));
    });

    await t.test("uses a buffered total timeout instead of stream idle time", async () => {
      const partPath = path.join(temporary, "buffered-slow-active.zip.part");
      const result = await downloadRuntimeAsset({
        assetUrl: `${baseUrl}/range-delayed`,
        checksumUrl,
        assetName,
        partPath,
        bufferedRequest: bufferedFetch,
        rangeChunkBytes: payload.byteLength,
        idleTimeoutMs: 20,
        bufferedInitialTimeoutMs: 200
      });
      assert.equal(result.sha256, digest);
      assert.deepEqual(fs.readFileSync(partPath), payload);
    });

    await t.test("does not automatically retry a buffered timeout", async () => {
      const partPath = path.join(temporary, "buffered-timeout.zip.part");
      const before = rangeRequests.length;
      await assert.rejects(
        downloadRuntimeAssetWithRetry({
          assetUrl: `${baseUrl}/range-delayed`,
          checksumUrl,
          assetName,
          partPath,
          bufferedRequest: bufferedFetch,
          rangeChunkBytes: 7,
          bufferedInitialTimeoutMs: 20,
          maxAttempts: 3,
          retryDelayMs: 0
        }),
        rejectsWithCode("IDLE_TIMEOUT")
      );
      assert.equal(rangeRequests.length, before + 1);
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("honors cancellation at buffered 100 percent", async () => {
      const partPath = path.join(temporary, "buffered-final-cancel.zip.part");
      const controller = new AbortController();
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/range-asset`,
          checksumUrl,
          assetName,
          partPath,
          bufferedRequest: bufferedFetch,
          rangeChunkBytes: 7,
          signal: controller.signal,
          onProgress: (progress) => {
            if (progress.percent === 100) {
              controller.abort();
            }
          }
        }),
        rejectsWithCode("ABORTED")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("retries transient HTTP failures up to success", async () => {
      flakyRequests = 0;
      const partPath = path.join(temporary, "retry-success.zip.part");
      const retryAttempts: number[] = [];
      const result = await downloadRuntimeAssetWithRetry({
        assetUrl: `${baseUrl}/flaky`,
        checksumUrl,
        assetName,
        partPath,
        maxAttempts: 3,
        retryDelayMs: 0,
        onRetry: (_error, nextAttempt) => retryAttempts.push(nextAttempt)
      });

      assert.equal(flakyRequests, 3);
      assert.deepEqual(retryAttempts, [2, 3]);
      assert.equal(result.sha256, digest);
      assert.deepEqual(fs.readFileSync(partPath), payload);
    });

    await t.test("never retries a checksum mismatch", async () => {
      const partPath = path.join(temporary, "retry-mismatch.zip.part");
      let retryCount = 0;
      await assert.rejects(
        downloadRuntimeAssetWithRetry({
          assetUrl: `${baseUrl}/bad-asset`,
          checksumUrl: `${baseUrl}/SHA256SUMS-bad.txt`,
          assetName,
          partPath,
          maxAttempts: 3,
          retryDelayMs: 0,
          onRetry: () => {
            retryCount += 1;
          }
        }),
        rejectsWithCode("CHECKSUM_MISMATCH")
      );
      assert.equal(retryCount, 0);
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("rejects a checksum mismatch and removes its part", async () => {
      const partPath = path.join(temporary, "mismatch.zip.part");
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/bad-asset`,
          checksumUrl: `${baseUrl}/SHA256SUMS-bad.txt`,
          assetName,
          partPath
        }),
        rejectsWithCode("CHECKSUM_MISMATCH")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("keeps unknown-length progress nullable", async () => {
      const partPath = path.join(temporary, "chunked.zip.part");
      const progress: RuntimeDownloadProgress[] = [];
      const result = await downloadRuntimeAsset({
        assetUrl: `${baseUrl}/chunked`,
        checksumUrl,
        assetName,
        partPath,
        onProgress: (update) => progress.push(update)
      });

      assert.equal(result.receivedBytes, payload.byteLength);
      assert.equal(result.totalBytes, null);
      assert.equal(result.percent, null);
      assert.equal(result.etaSeconds, null);
      assert.equal(result.sha256, digest);
      assert.ok(progress.every((update) => update.totalBytes === null));
      assert.ok(progress.every((update) => update.percent === null));
    });

    await t.test("supports cancellation and removes its part", async () => {
      const partPath = path.join(temporary, "cancelled.zip.part");
      const controller = new AbortController();
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/slow`,
          checksumUrl,
          assetName,
          partPath,
          signal: controller.signal,
          onProgress: (progress) => {
            if (progress.receivedBytes > 0) {
              controller.abort();
            }
          }
        }),
        rejectsWithCode("ABORTED")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("honors cancellation at the final progress update", async () => {
      const partPath = path.join(temporary, "cancelled-at-complete.zip.part");
      const controller = new AbortController();
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/asset`,
          checksumUrl,
          assetName,
          partPath,
          signal: controller.signal,
          onProgress: (progress) => {
            if (progress.percent === 100) {
              controller.abort();
            }
          }
        }),
        rejectsWithCode("ABORTED")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("times out an idle body and removes its part", async () => {
      const partPath = path.join(temporary, "timeout.zip.part");
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/stall`,
          checksumUrl,
          assetName,
          partPath,
          idleTimeoutMs: 40
        }),
        rejectsWithCode("IDLE_TIMEOUT")
      );
      assert.equal(fs.existsSync(partPath), false);
    });

    await t.test("never deletes a pre-existing part file", async () => {
      const partPath = path.join(temporary, "owned-elsewhere.zip.part");
      fs.writeFileSync(partPath, "keep me");
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/asset`,
          checksumUrl,
          assetName,
          partPath
        }),
        rejectsWithCode("PART_FILE_EXISTS")
      );
      assert.equal(fs.readFileSync(partPath, "utf8"), "keep me");
    });

    await t.test("enforces the redirect limit and cleans up", async () => {
      const partPath = path.join(temporary, "redirect-limit.zip.part");
      await assert.rejects(
        downloadRuntimeAsset({
          assetUrl: `${baseUrl}/redirect-loop`,
          checksumUrl,
          assetName,
          partPath,
          maxRedirects: 2
        }),
        rejectsWithCode("TOO_MANY_REDIRECTS")
      );
      assert.equal(fs.existsSync(partPath), false);
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("SHA256SUMS parser selects only the exact asset", () => {
  const otherDigest = "a".repeat(64);
  const entries = parseSha256Sums(
    `${otherDigest}  prefix-${assetName}\n${digest} *./${assetName}\n`
  );
  assert.equal(checksumForAsset(entries, assetName), digest);
  assert.throws(
    () => checksumForAsset(entries, `missing-${assetName}`),
    rejectsWithCode("CHECKSUM_ENTRY_MISSING")
  );
});

test("SHA256SUMS parser rejects malformed and conflicting entries", () => {
  assert.throws(
    () => parseSha256Sums("not a checksum\n"),
    rejectsWithCode("CHECKSUM_FORMAT_INVALID")
  );
  assert.throws(
    () =>
      parseSha256Sums(
        `${"a".repeat(64)}  ${assetName}\n${"b".repeat(64)}  ${assetName}\n`
      ),
    rejectsWithCode("CHECKSUM_ENTRY_CONFLICT")
  );
  const aliases = parseSha256Sums(
    `${"a".repeat(64)}  ${assetName}\n${"b".repeat(64)}  ./${assetName}\n`
  );
  assert.throws(
    () => checksumForAsset(aliases, assetName),
    rejectsWithCode("CHECKSUM_ENTRY_CONFLICT")
  );
});

test("manual retry allows remote failures but rejects local and cancelled failures", () => {
  for (const code of [
    "NETWORK_ERROR",
    "HTTP_STATUS",
    "IDLE_TIMEOUT",
    "CHECKSUM_MISMATCH",
    "CHECKSUM_ENTRY_MISSING"
  ] as const) {
    assert.equal(
      isManuallyRetryableRuntimeDownloadError(
        new RuntimeDownloadError(code, code)
      ),
      true,
      code
    );
  }
  for (const code of [
    "ABORTED",
    "INVALID_ARGUMENT",
    "UNSUPPORTED_PROTOCOL",
    "PART_FILE_EXISTS",
    "FILE_WRITE_ERROR",
    "PART_CLEANUP_FAILED"
  ] as const) {
    assert.equal(
      isManuallyRetryableRuntimeDownloadError(
        new RuntimeDownloadError(code, code)
      ),
      false,
      code
    );
  }
});
