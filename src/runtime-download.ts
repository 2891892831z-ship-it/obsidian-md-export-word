import { createHash } from "node:crypto";
import * as http from "node:http";
import * as https from "node:https";
import { open, unlink } from "node:fs/promises";
import type { FileHandle } from "node:fs/promises";

export const RUNTIME_DOWNLOAD_IDLE_TIMEOUT_MS = 90_000;
export const RUNTIME_DOWNLOAD_MAX_REDIRECTS = 5;
export const RUNTIME_CHECKSUM_MAX_BYTES = 1024 * 1024;
export const RUNTIME_DOWNLOAD_RANGE_BYTES = 4 * 1024 * 1024;
export const RUNTIME_BUFFERED_INITIAL_TIMEOUT_MS = 15 * 60 * 1000;
export const RUNTIME_BUFFERED_CHUNK_TIMEOUT_MS = 5 * 60 * 1000;

export type RuntimeDownloadErrorCode =
  | "ABORTED"
  | "IDLE_TIMEOUT"
  | "HTTP_STATUS"
  | "NETWORK_ERROR"
  | "TOO_MANY_REDIRECTS"
  | "REDIRECT_LOCATION_MISSING"
  | "UNSUPPORTED_PROTOCOL"
  | "PART_FILE_EXISTS"
  | "FILE_WRITE_ERROR"
  | "PART_CLEANUP_FAILED"
  | "CONTENT_LENGTH_MISMATCH"
  | "CHECKSUM_FORMAT_INVALID"
  | "CHECKSUM_ENTRY_MISSING"
  | "CHECKSUM_ENTRY_CONFLICT"
  | "CHECKSUM_MISMATCH"
  | "CHECKSUM_TOO_LARGE"
  | "INVALID_ARGUMENT";

export interface RuntimeDownloadErrorOptions {
  cause?: unknown;
  details?: Readonly<Record<string, unknown>>;
}

export class RuntimeDownloadError extends Error {
  readonly code: RuntimeDownloadErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: RuntimeDownloadErrorCode,
    message: string,
    options: RuntimeDownloadErrorOptions = {}
  ) {
    super(
      message,
      options.cause === undefined ? undefined : { cause: options.cause }
    );
    this.name = "RuntimeDownloadError";
    this.code = code;
    this.details = options.details;
  }
}

export interface RuntimeDownloadProgress {
  receivedBytes: number;
  totalBytes: number | null;
  percent: number | null;
  bytesPerSecond: number;
  etaSeconds: number | null;
}

export interface RuntimeBufferedRequest {
  url: string;
  headers: Readonly<Record<string, string>>;
  signal?: AbortSignal;
}

export interface RuntimeBufferedResponse {
  status: number;
  headers: Readonly<Record<string, string>>;
  body: ArrayBuffer | Uint8Array;
  finalUrl?: string;
}

export type RuntimeBufferedRequestFn = (
  request: RuntimeBufferedRequest
) => Promise<RuntimeBufferedResponse>;

export interface DownloadRuntimeAssetOptions {
  assetUrl: string | URL;
  checksumUrl: string | URL;
  assetName: string;
  partPath: string;
  signal?: AbortSignal;
  onProgress?: (progress: RuntimeDownloadProgress) => void;
  idleTimeoutMs?: number;
  maxRedirects?: number;
  bufferedRequest?: RuntimeBufferedRequestFn;
  rangeChunkBytes?: number;
  bufferedInitialTimeoutMs?: number;
  bufferedChunkTimeoutMs?: number;
}

export interface DownloadRuntimeAssetWithRetryOptions
  extends DownloadRuntimeAssetOptions {
  maxAttempts?: number;
  retryDelayMs?: number;
  onRetry?: (
    error: RuntimeDownloadError,
    nextAttempt: number,
    maxAttempts: number
  ) => void;
}

export interface DownloadRuntimeAssetResult extends RuntimeDownloadProgress {
  partPath: string;
  finalUrl: string;
  sha256: string;
  expectedSha256: string;
}

interface HttpResponseResult {
  response: http.IncomingMessage;
  finalUrl: URL;
}

interface StreamResult extends RuntimeDownloadProgress {
  sha256: string;
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function runtimeError(
  code: RuntimeDownloadErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
  cause?: unknown
): RuntimeDownloadError {
  return new RuntimeDownloadError(code, message, { cause, details });
}

function errorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function abortedError(url?: string): RuntimeDownloadError {
  return runtimeError(
    "ABORTED",
    "Runtime download was cancelled.",
    url ? { url } : undefined
  );
}

function idleTimeoutError(
  url: string,
  idleTimeoutMs: number
): RuntimeDownloadError {
  return runtimeError(
    "IDLE_TIMEOUT",
    `Runtime download received no data for ${idleTimeoutMs} ms.`,
    { url, idleTimeoutMs }
  );
}

function bufferedTimeoutError(
  url: string,
  timeoutMs: number
): RuntimeDownloadError {
  return runtimeError(
    "IDLE_TIMEOUT",
    `Runtime buffered request did not complete within ${timeoutMs} ms.`,
    { url, idleTimeoutMs: timeoutMs, bufferedRequest: true }
  );
}

function parseHttpUrl(input: string | URL, label: string): URL {
  let url: URL;
  try {
    url = new URL(input instanceof URL ? input.href : input);
  } catch (error) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      `${label} must be a valid absolute URL.`,
      { label, value: String(input) },
      error
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw runtimeError(
      "UNSUPPORTED_PROTOCOL",
      `${label} must use http: or https:.`,
      { label, protocol: url.protocol }
    );
  }
  return url;
}

function validateOptions(options: DownloadRuntimeAssetOptions): {
  idleTimeoutMs: number;
  maxRedirects: number;
  rangeChunkBytes: number;
  bufferedInitialTimeoutMs: number;
  bufferedChunkTimeoutMs: number;
} {
  if (!options || typeof options !== "object") {
    throw runtimeError("INVALID_ARGUMENT", "Download options are required.");
  }
  if (!options.assetName || typeof options.assetName !== "string") {
    throw runtimeError("INVALID_ARGUMENT", "assetName must not be empty.");
  }
  if (
    !options.partPath ||
    typeof options.partPath !== "string" ||
    !options.partPath.endsWith(".part")
  ) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "partPath must name a .part file.",
      { partPath: options.partPath }
    );
  }

  const idleTimeoutMs =
    options.idleTimeoutMs ?? RUNTIME_DOWNLOAD_IDLE_TIMEOUT_MS;
  if (!Number.isFinite(idleTimeoutMs) || idleTimeoutMs <= 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "idleTimeoutMs must be a positive finite number.",
      { idleTimeoutMs }
    );
  }

  const maxRedirects =
    options.maxRedirects ?? RUNTIME_DOWNLOAD_MAX_REDIRECTS;
  if (!Number.isInteger(maxRedirects) || maxRedirects < 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "maxRedirects must be a non-negative integer.",
      { maxRedirects }
    );
  }

  const rangeChunkBytes =
    options.rangeChunkBytes ?? RUNTIME_DOWNLOAD_RANGE_BYTES;
  if (!Number.isSafeInteger(rangeChunkBytes) || rangeChunkBytes <= 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "rangeChunkBytes must be a positive safe integer.",
      { rangeChunkBytes }
    );
  }

  const bufferedInitialTimeoutMs =
    options.bufferedInitialTimeoutMs ?? RUNTIME_BUFFERED_INITIAL_TIMEOUT_MS;
  if (
    !Number.isFinite(bufferedInitialTimeoutMs) ||
    bufferedInitialTimeoutMs <= 0
  ) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "bufferedInitialTimeoutMs must be a positive finite number.",
      { bufferedInitialTimeoutMs }
    );
  }

  const bufferedChunkTimeoutMs =
    options.bufferedChunkTimeoutMs ?? RUNTIME_BUFFERED_CHUNK_TIMEOUT_MS;
  if (
    !Number.isFinite(bufferedChunkTimeoutMs) ||
    bufferedChunkTimeoutMs <= 0
  ) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "bufferedChunkTimeoutMs must be a positive finite number.",
      { bufferedChunkTimeoutMs }
    );
  }

  return {
    idleTimeoutMs,
    maxRedirects,
    rangeChunkBytes,
    bufferedInitialTimeoutMs,
    bufferedChunkTimeoutMs
  };
}

function requestOnce(
  url: URL,
  signal: AbortSignal | undefined,
  idleTimeoutMs: number
): Promise<http.IncomingMessage> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortedError(url.href));
      return;
    }

    let settled = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const requestFactory =
      url.protocol === "https:" ? https.request : http.request;
    const request = requestFactory(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/octet-stream",
          "Accept-Encoding": "identity",
          "User-Agent": "obsidian-md-export-word-runtime-downloader"
        }
      },
      (response) => {
        if (settled) {
          response.destroy();
          return;
        }
        settled = true;
        cleanup();
        resolve(response);
      }
    );

    const cleanup = () => {
      if (idleTimer !== undefined) {
        clearTimeout(idleTimer);
        idleTimer = undefined;
      }
      signal?.removeEventListener("abort", onAbort);
    };

    const fail = (error: RuntimeDownloadError) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };

    const onAbort = () => {
      const error = abortedError(url.href);
      fail(error);
      request.destroy(error);
    };

    const resetIdleTimer = () => {
      if (idleTimer !== undefined) {
        clearTimeout(idleTimer);
      }
      idleTimer = setTimeout(() => {
        const error = idleTimeoutError(url.href, idleTimeoutMs);
        fail(error);
        request.destroy(error);
      }, idleTimeoutMs);
    };

    request.once("error", (error) => {
      if (settled) {
        return;
      }
      if (signal?.aborted) {
        fail(abortedError(url.href));
        return;
      }
      if (error instanceof RuntimeDownloadError) {
        fail(error);
        return;
      }
      fail(
        runtimeError(
          "NETWORK_ERROR",
          `Runtime download request failed: ${errorMessage(error)}`,
          { url: url.href, networkCode: errorCode(error) },
          error
        )
      );
    });

    signal?.addEventListener("abort", onAbort, { once: true });
    resetIdleTimer();
    request.end();
  });
}

async function openHttpResponse(
  input: string | URL,
  label: string,
  signal: AbortSignal | undefined,
  idleTimeoutMs: number,
  maxRedirects: number
): Promise<HttpResponseResult> {
  let url = parseHttpUrl(input, label);

  for (let redirectCount = 0; ; redirectCount += 1) {
    const response = await requestOnce(url, signal, idleTimeoutMs);
    if (signal?.aborted) {
      response.destroy();
      throw abortedError(url.href);
    }

    const statusCode = response.statusCode ?? 0;
    if (REDIRECT_STATUSES.has(statusCode)) {
      const location = response.headers.location;
      response.destroy();
      if (!location) {
        throw runtimeError(
          "REDIRECT_LOCATION_MISSING",
          `HTTP ${statusCode} response did not include a Location header.`,
          { url: url.href, statusCode }
        );
      }
      if (redirectCount >= maxRedirects) {
        throw runtimeError(
          "TOO_MANY_REDIRECTS",
          `Runtime download exceeded ${maxRedirects} redirects.`,
          { url: url.href, maxRedirects }
        );
      }
      let redirectUrl: URL;
      try {
        redirectUrl = new URL(location, url);
      } catch (error) {
        throw runtimeError(
          "INVALID_ARGUMENT",
          "The server returned an invalid redirect URL.",
          { url: url.href, location },
          error
        );
      }
      url = parseHttpUrl(redirectUrl, "redirect URL");
      continue;
    }

    if (statusCode < 200 || statusCode >= 300) {
      response.destroy();
      throw runtimeError(
        "HTTP_STATUS",
        `Runtime download returned HTTP ${statusCode}.`,
        { url: url.href, statusCode }
      );
    }

    return { response, finalUrl: url };
  }
}

async function readResponseText(
  response: http.IncomingMessage,
  finalUrl: URL,
  signal: AbortSignal | undefined,
  idleTimeoutMs: number,
  maxBytes: number
): Promise<string> {
  const chunks: Buffer[] = [];
  let receivedBytes = 0;
  let timeoutFailure: RuntimeDownloadError | null = null;
  let abortFailure: RuntimeDownloadError | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  const resetIdleTimer = () => {
    if (idleTimer !== undefined) {
      clearTimeout(idleTimer);
    }
    idleTimer = setTimeout(() => {
      timeoutFailure = idleTimeoutError(finalUrl.href, idleTimeoutMs);
      response.destroy(timeoutFailure);
    }, idleTimeoutMs);
  };
  const onAbort = () => {
    abortFailure = abortedError(finalUrl.href);
    response.destroy(abortFailure);
  };

  signal?.addEventListener("abort", onAbort, { once: true });
  if (signal?.aborted) {
    onAbort();
  }
  resetIdleTimer();

  try {
    for await (const value of response) {
      resetIdleTimer();
      const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
      receivedBytes += chunk.byteLength;
      if (receivedBytes > maxBytes) {
        throw runtimeError(
          "CHECKSUM_TOO_LARGE",
          `Checksum response exceeded ${maxBytes} bytes.`,
          { url: finalUrl.href, maxBytes, receivedBytes }
        );
      }
      chunks.push(chunk);
    }
  } catch (error) {
    if (abortFailure || signal?.aborted) {
      throw abortFailure ?? abortedError(finalUrl.href);
    }
    if (timeoutFailure) {
      throw timeoutFailure;
    }
    if (error instanceof RuntimeDownloadError) {
      throw error;
    }
    throw runtimeError(
      "NETWORK_ERROR",
      `Failed while reading the checksum response: ${errorMessage(error)}`,
      { url: finalUrl.href, networkCode: errorCode(error) },
      error
    );
  } finally {
    if (idleTimer !== undefined) {
      clearTimeout(idleTimer);
    }
    signal?.removeEventListener("abort", onAbort);
  }

  if (!response.complete) {
    throw runtimeError(
      "NETWORK_ERROR",
      "The checksum response ended before it was complete.",
      { url: finalUrl.href, receivedBytes }
    );
  }
  return Buffer.concat(chunks, receivedBytes).toString("utf8");
}

function bufferedHeader(
  response: RuntimeBufferedResponse,
  name: string
): string | undefined {
  const normalizedName = name.toLowerCase();
  for (const [key, value] of Object.entries(response.headers || {})) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  return undefined;
}

function bufferedBody(
  response: RuntimeBufferedResponse,
  url: URL
): Buffer {
  const { body } = response;
  if (body instanceof ArrayBuffer) {
    return Buffer.from(body);
  }
  if (ArrayBuffer.isView(body)) {
    return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  }
  throw runtimeError(
    "NETWORK_ERROR",
    "The buffered runtime response did not contain binary data.",
    { url: url.href }
  );
}

function bufferedContentLength(
  response: RuntimeBufferedResponse
): number | null {
  const header = bufferedHeader(response, "content-length");
  if (
    header === undefined ||
    !/^\d+$/.test(header) ||
    !Number.isSafeInteger(Number(header))
  ) {
    return null;
  }
  return Number(header);
}

function bufferedHttpStatusError(
  url: URL,
  statusCode: number
): RuntimeDownloadError {
  return runtimeError(
    "HTTP_STATUS",
    `Runtime download returned HTTP ${statusCode}.`,
    { url: url.href, statusCode }
  );
}

function runBufferedRequest(
  request: RuntimeBufferedRequestFn,
  url: URL,
  headers: Readonly<Record<string, string>>,
  signal: AbortSignal | undefined,
  timeoutMs: number
): Promise<RuntimeBufferedResponse> {
  // Obsidian requestUrl cannot abort its underlying IPC request. This gate
  // stops file writes and progress immediately, then ignores a late response.
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortedError(url.href));
      return;
    }

    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };
    const succeed = (response: RuntimeBufferedResponse) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve(response);
    };
    const fail = (error: RuntimeDownloadError) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };
    const onAbort = () => fail(abortedError(url.href));
    const timer = setTimeout(
      () => fail(bufferedTimeoutError(url.href, timeoutMs)),
      timeoutMs
    );

    signal?.addEventListener("abort", onAbort, { once: true });
    let pending: Promise<RuntimeBufferedResponse>;
    try {
      pending = Promise.resolve(request({ url: url.href, headers, signal }));
    } catch (error) {
      pending = Promise.reject(error);
    }
    pending.then(
      (response) => {
        if (signal?.aborted) {
          fail(abortedError(url.href));
          return;
        }
        succeed(response);
      },
      (error) => {
        if (signal?.aborted) {
          fail(abortedError(url.href));
          return;
        }
        if (error instanceof RuntimeDownloadError) {
          fail(error);
          return;
        }
        fail(
          runtimeError(
            "NETWORK_ERROR",
            `Runtime download request failed: ${errorMessage(error)}`,
            { url: url.href, networkCode: errorCode(error) },
            error
          )
        );
      }
    );
  });
}

function validateBufferedResponse(
  response: RuntimeBufferedResponse,
  url: URL
): void {
  if (
    !response ||
    !Number.isInteger(response.status) ||
    response.status < 0
  ) {
    throw runtimeError(
      "NETWORK_ERROR",
      "The buffered runtime request returned an invalid response.",
      { url: url.href }
    );
  }
}

export function parseSha256Sums(contents: string): ReadonlyMap<string, string> {
  if (typeof contents !== "string") {
    throw runtimeError(
      "CHECKSUM_FORMAT_INVALID",
      "Checksum contents must be text."
    );
  }

  const entries = new Map<string, string>();
  const lines = contents.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }
    const match = /^([A-Fa-f0-9]{64})[ \t]+\*?(.+)$/.exec(line);
    if (!match || !match[2]) {
      throw runtimeError(
        "CHECKSUM_FORMAT_INVALID",
        `Invalid SHA256SUMS entry on line ${index + 1}.`,
        { lineNumber: index + 1 }
      );
    }

    const digest = match[1].toLowerCase();
    const filename = match[2];
    const existing = entries.get(filename);
    if (existing && existing !== digest) {
      throw runtimeError(
        "CHECKSUM_ENTRY_CONFLICT",
        `Conflicting checksums were provided for ${filename}.`,
        { filename, firstSha256: existing, secondSha256: digest }
      );
    }
    entries.set(filename, digest);
  }

  if (entries.size === 0) {
    throw runtimeError(
      "CHECKSUM_FORMAT_INVALID",
      "The checksum file did not contain any SHA-256 entries."
    );
  }
  return entries;
}

export function checksumForAsset(
  entries: ReadonlyMap<string, string>,
  assetName: string
): string {
  if (!assetName || typeof assetName !== "string") {
    throw runtimeError("INVALID_ARGUMENT", "assetName must not be empty.");
  }

  const matches = [assetName, `./${assetName}`]
    .map((filename) => ({ filename, sha256: entries.get(filename) }))
    .filter(
      (entry): entry is { filename: string; sha256: string } =>
        entry.sha256 !== undefined
    );
  if (matches.length === 0) {
    throw runtimeError(
      "CHECKSUM_ENTRY_MISSING",
      `No checksum entry matched ${assetName}.`,
      { assetName }
    );
  }

  const expectedSha256 = matches[0].sha256;
  const conflict = matches.find(
    (entry) => entry.sha256 !== expectedSha256
  );
  if (conflict) {
    throw runtimeError(
      "CHECKSUM_ENTRY_CONFLICT",
      `Checksum entries for ${assetName} conflict.`,
      { assetName, matches }
    );
  }
  return expectedSha256;
}

function contentLength(response: http.IncomingMessage): number | null {
  const header = response.headers["content-length"];
  if (
    typeof header !== "string" ||
    !/^\d+$/.test(header) ||
    !Number.isSafeInteger(Number(header))
  ) {
    return null;
  }
  return Number(header);
}

function createProgress(
  receivedBytes: number,
  totalBytes: number | null,
  startedAt: number
): RuntimeDownloadProgress {
  const elapsedSeconds = Math.max((Date.now() - startedAt) / 1000, 0.001);
  const bytesPerSecond =
    receivedBytes === 0 ? 0 : receivedBytes / elapsedSeconds;
  const percent =
    totalBytes === null
      ? null
      : totalBytes === 0
        ? receivedBytes === 0
          ? 100
          : null
        : Math.min(100, (receivedBytes / totalBytes) * 100);
  const etaSeconds =
    totalBytes === null || bytesPerSecond <= 0
      ? null
      : Math.max(0, (totalBytes - receivedBytes) / bytesPerSecond);
  return {
    receivedBytes,
    totalBytes,
    percent,
    bytesPerSecond,
    etaSeconds
  };
}

function emitProgress(
  onProgress: DownloadRuntimeAssetOptions["onProgress"],
  progress: RuntimeDownloadProgress
): void {
  try {
    onProgress?.(progress);
  } catch {
    // UI progress callbacks must not corrupt an otherwise valid download.
  }
}

async function writeChunk(file: FileHandle, chunk: Buffer): Promise<void> {
  let offset = 0;
  while (offset < chunk.byteLength) {
    try {
      const result = await file.write(
        chunk,
        offset,
        chunk.byteLength - offset,
        null
      );
      if (result.bytesWritten <= 0) {
        throw new Error("The file write completed without writing data.");
      }
      offset += result.bytesWritten;
    } catch (error) {
      if (error instanceof RuntimeDownloadError) {
        throw error;
      }
      throw runtimeError(
        "FILE_WRITE_ERROR",
        `Failed to write the runtime partial file: ${errorMessage(error)}`,
        { fileCode: errorCode(error) },
        error
      );
    }
  }
}

async function streamResponseToFile(
  response: http.IncomingMessage,
  finalUrl: URL,
  file: FileHandle,
  totalBytes: number | null,
  signal: AbortSignal | undefined,
  idleTimeoutMs: number,
  onProgress: DownloadRuntimeAssetOptions["onProgress"]
): Promise<StreamResult> {
  const hash = createHash("sha256");
  const startedAt = Date.now();
  let receivedBytes = 0;
  let timeoutFailure: RuntimeDownloadError | null = null;
  let abortFailure: RuntimeDownloadError | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  const resetIdleTimer = () => {
    if (idleTimer !== undefined) {
      clearTimeout(idleTimer);
    }
    idleTimer = setTimeout(() => {
      timeoutFailure = idleTimeoutError(finalUrl.href, idleTimeoutMs);
      response.destroy(timeoutFailure);
    }, idleTimeoutMs);
  };
  const onAbort = () => {
    abortFailure = abortedError(finalUrl.href);
    response.destroy(abortFailure);
  };

  signal?.addEventListener("abort", onAbort, { once: true });
  if (signal?.aborted) {
    onAbort();
  }
  resetIdleTimer();
  emitProgress(onProgress, createProgress(0, totalBytes, startedAt));

  try {
    for await (const value of response) {
      resetIdleTimer();
      const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
      await writeChunk(file, chunk);
      hash.update(chunk);
      receivedBytes += chunk.byteLength;
      emitProgress(
        onProgress,
        createProgress(receivedBytes, totalBytes, startedAt)
      );
    }
    if (signal?.aborted) {
      throw abortFailure ?? abortedError(finalUrl.href);
    }
  } catch (error) {
    if (abortFailure || signal?.aborted) {
      throw abortFailure ?? abortedError(finalUrl.href);
    }
    if (timeoutFailure) {
      throw timeoutFailure;
    }
    if (error instanceof RuntimeDownloadError) {
      throw error;
    }
    if (totalBytes !== null && receivedBytes !== totalBytes) {
      throw runtimeError(
        "CONTENT_LENGTH_MISMATCH",
        "The runtime response ended before Content-Length bytes arrived.",
        { url: finalUrl.href, receivedBytes, totalBytes },
        error
      );
    }
    throw runtimeError(
      "NETWORK_ERROR",
      `Runtime download stream failed: ${errorMessage(error)}`,
      {
        url: finalUrl.href,
        receivedBytes,
        networkCode: errorCode(error)
      },
      error
    );
  } finally {
    if (idleTimer !== undefined) {
      clearTimeout(idleTimer);
    }
    signal?.removeEventListener("abort", onAbort);
  }

  if (!response.complete || (totalBytes !== null && receivedBytes !== totalBytes)) {
    throw runtimeError(
      "CONTENT_LENGTH_MISMATCH",
      "The downloaded byte count did not match Content-Length.",
      { url: finalUrl.href, receivedBytes, totalBytes }
    );
  }

  const progress = createProgress(receivedBytes, totalBytes, startedAt);
  return {
    ...progress,
    sha256: hash.digest("hex")
  };
}

interface ParsedContentRange {
  start: number;
  end: number;
  total: number;
}

function parseContentRange(
  response: RuntimeBufferedResponse,
  url: URL
): ParsedContentRange {
  const header = bufferedHeader(response, "content-range") || "";
  const match = /^bytes\s+(\d+)-(\d+)\/(\d+)$/i.exec(header.trim());
  if (!match) {
    throw runtimeError(
      "CONTENT_LENGTH_MISMATCH",
      "A partial runtime response had an invalid Content-Range header.",
      { url: url.href, contentRange: header }
    );
  }

  const start = Number(match[1]);
  const end = Number(match[2]);
  const total = Number(match[3]);
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    !Number.isSafeInteger(total) ||
    start < 0 ||
    end < start ||
    total <= end
  ) {
    throw runtimeError(
      "CONTENT_LENGTH_MISMATCH",
      "A partial runtime response described an invalid byte range.",
      { url: url.href, contentRange: header }
    );
  }
  return { start, end, total };
}

function responseValidator(
  response: RuntimeBufferedResponse
): string | undefined {
  const etag = bufferedHeader(response, "etag")?.trim();
  if (etag && !/^W\//i.test(etag)) {
    return etag;
  }
  const lastModified = bufferedHeader(response, "last-modified")?.trim();
  return lastModified || undefined;
}

async function downloadBufferedRanges(
  assetUrl: string | URL,
  file: FileHandle,
  request: RuntimeBufferedRequestFn,
  rangeChunkBytes: number,
  initialTimeoutMs: number,
  chunkTimeoutMs: number,
  signal: AbortSignal | undefined,
  onProgress: DownloadRuntimeAssetOptions["onProgress"]
): Promise<StreamResult & { finalUrl: string }> {
  const url = parseHttpUrl(assetUrl, "assetUrl");
  const hash = createHash("sha256");
  const startedAt = Date.now();
  let receivedBytes = 0;
  let totalBytes: number | null = null;
  let validator: string | undefined;
  let finalUrl = url.href;

  emitProgress(onProgress, createProgress(0, null, startedAt));
  for (;;) {
    if (signal?.aborted) {
      throw abortedError(url.href);
    }
    const requestedEnd = Math.min(
      Number.MAX_SAFE_INTEGER,
      receivedBytes + rangeChunkBytes - 1
    );
    const headers: Record<string, string> = {
      Accept: "application/octet-stream",
      "Accept-Encoding": "identity",
      Range: `bytes=${receivedBytes}-${requestedEnd}`
    };
    if (validator) {
      headers["If-Range"] = validator;
    }

    const response = await runBufferedRequest(
      request,
      url,
      headers,
      signal,
      receivedBytes === 0 ? initialTimeoutMs : chunkTimeoutMs
    );
    validateBufferedResponse(response, url);
    if (response.finalUrl) {
      finalUrl = parseHttpUrl(response.finalUrl, "finalUrl").href;
    }
    if (response.status < 200 || response.status >= 300) {
      throw bufferedHttpStatusError(url, response.status);
    }

    const body = bufferedBody(response, url);
    const declaredLength = bufferedContentLength(response);
    if (declaredLength !== null && declaredLength !== body.byteLength) {
      throw runtimeError(
        "CONTENT_LENGTH_MISMATCH",
        "The buffered response body did not match Content-Length.",
        {
          url: url.href,
          declaredLength,
          receivedLength: body.byteLength
        }
      );
    }

    let responseCompletesDownload = false;
    if (response.status === 200) {
      if (receivedBytes !== 0) {
        throw runtimeError(
          "CONTENT_LENGTH_MISMATCH",
          "The server stopped honoring byte ranges during the runtime download.",
          { url: url.href, receivedBytes }
        );
      }
      totalBytes = body.byteLength;
      responseCompletesDownload = true;
    } else if (response.status === 206) {
      const range = parseContentRange(response, url);
      if (
        range.start !== receivedBytes ||
        range.end > requestedEnd ||
        body.byteLength !== range.end - range.start + 1 ||
        (totalBytes !== null && range.total !== totalBytes)
      ) {
        throw runtimeError(
          "CONTENT_LENGTH_MISMATCH",
          "The runtime byte range did not match the requested range.",
          {
            url: url.href,
            requestedStart: receivedBytes,
            requestedEnd,
            responseStart: range.start,
            responseEnd: range.end,
            responseTotal: range.total,
            receivedLength: body.byteLength,
            expectedTotal: totalBytes
          }
        );
      }
      totalBytes = range.total;
      validator ??= responseValidator(response);
      responseCompletesDownload = range.end + 1 === range.total;
    } else {
      throw runtimeError(
        "CONTENT_LENGTH_MISMATCH",
        "The runtime server returned neither a complete nor partial response.",
        { url: url.href, statusCode: response.status }
      );
    }

    if (signal?.aborted) {
      throw abortedError(url.href);
    }
    await writeChunk(file, body);
    hash.update(body);
    receivedBytes += body.byteLength;
    const progress = createProgress(receivedBytes, totalBytes, startedAt);
    emitProgress(onProgress, progress);
    if (signal?.aborted) {
      throw abortedError(url.href);
    }
    if (responseCompletesDownload) {
      return {
        ...progress,
        finalUrl,
        sha256: hash.digest("hex")
      };
    }
    if (body.byteLength === 0) {
      throw runtimeError(
        "CONTENT_LENGTH_MISMATCH",
        "The runtime byte range response was empty before completion.",
        { url: url.href, receivedBytes, totalBytes }
      );
    }
  }
}

async function fetchExpectedSha256(
  checksumUrl: string | URL,
  assetName: string,
  signal: AbortSignal | undefined,
  idleTimeoutMs: number,
  maxRedirects: number,
  bufferedRequest: RuntimeBufferedRequestFn | undefined
): Promise<string> {
  if (bufferedRequest) {
    const url = parseHttpUrl(checksumUrl, "checksumUrl");
    const response = await runBufferedRequest(
      bufferedRequest,
      url,
      {
        Accept: "text/plain, application/octet-stream",
        "Accept-Encoding": "identity"
      },
      signal,
      idleTimeoutMs
    );
    validateBufferedResponse(response, url);
    if (response.status < 200 || response.status >= 300) {
      throw bufferedHttpStatusError(url, response.status);
    }
    const body = bufferedBody(response, url);
    if (body.byteLength > RUNTIME_CHECKSUM_MAX_BYTES) {
      throw runtimeError(
        "CHECKSUM_TOO_LARGE",
        `Checksum response exceeded ${RUNTIME_CHECKSUM_MAX_BYTES} bytes.`,
        {
          url: url.href,
          maxBytes: RUNTIME_CHECKSUM_MAX_BYTES,
          receivedBytes: body.byteLength
        }
      );
    }
    if (signal?.aborted) {
      throw abortedError(url.href);
    }
    return checksumForAsset(
      parseSha256Sums(body.toString("utf8")),
      assetName
    );
  }

  const { response, finalUrl } = await openHttpResponse(
    checksumUrl,
    "checksumUrl",
    signal,
    idleTimeoutMs,
    maxRedirects
  );
  const contents = await readResponseText(
    response,
    finalUrl,
    signal,
    idleTimeoutMs,
    RUNTIME_CHECKSUM_MAX_BYTES
  );
  return checksumForAsset(parseSha256Sums(contents), assetName);
}

function mapPartOpenError(error: unknown, partPath: string): RuntimeDownloadError {
  if (errorCode(error) === "EEXIST") {
    return runtimeError(
      "PART_FILE_EXISTS",
      "The runtime partial file already exists.",
      { partPath },
      error
    );
  }
  return runtimeError(
    "FILE_WRITE_ERROR",
    `Could not create the runtime partial file: ${errorMessage(error)}`,
    { partPath, fileCode: errorCode(error) },
    error
  );
}

async function removeOwnedPart(
  partPath: string,
  originalError: RuntimeDownloadError
): Promise<void> {
  try {
    await unlink(partPath);
  } catch (cleanupError) {
    if (errorCode(cleanupError) === "ENOENT") {
      return;
    }
    throw runtimeError(
      "PART_CLEANUP_FAILED",
      `Could not remove the failed runtime partial file: ${errorMessage(cleanupError)}`,
      {
        partPath,
        originalCode: originalError.code,
        cleanupCode: errorCode(cleanupError)
      },
      cleanupError
    );
  }
}

export async function downloadRuntimeAsset(
  options: DownloadRuntimeAssetOptions
): Promise<DownloadRuntimeAssetResult> {
  const {
    idleTimeoutMs,
    maxRedirects,
    rangeChunkBytes,
    bufferedInitialTimeoutMs,
    bufferedChunkTimeoutMs
  } = validateOptions(options);
  parseHttpUrl(options.assetUrl, "assetUrl");
  parseHttpUrl(options.checksumUrl, "checksumUrl");
  if (options.signal?.aborted) {
    throw abortedError();
  }

  const expectedSha256 = await fetchExpectedSha256(
    options.checksumUrl,
    options.assetName,
    options.signal,
    idleTimeoutMs,
    maxRedirects,
    options.bufferedRequest
  );
  if (options.signal?.aborted) {
    throw abortedError();
  }

  let partFile: FileHandle;
  try {
    partFile = await open(options.partPath, "wx");
  } catch (error) {
    throw mapPartOpenError(error, options.partPath);
  }

  let failure: RuntimeDownloadError | null = null;
  try {
    let streamed: StreamResult;
    let finalUrl: URL;
    if (options.bufferedRequest) {
      const buffered = await downloadBufferedRanges(
        options.assetUrl,
        partFile,
        options.bufferedRequest,
        rangeChunkBytes,
        bufferedInitialTimeoutMs,
        bufferedChunkTimeoutMs,
        options.signal,
        options.onProgress
      );
      streamed = buffered;
      finalUrl = parseHttpUrl(buffered.finalUrl, "finalUrl");
    } else {
      const opened = await openHttpResponse(
        options.assetUrl,
        "assetUrl",
        options.signal,
        idleTimeoutMs,
        maxRedirects
      );
      finalUrl = opened.finalUrl;
      const totalBytes = contentLength(opened.response);
      streamed = await streamResponseToFile(
        opened.response,
        finalUrl,
        partFile,
        totalBytes,
        options.signal,
        idleTimeoutMs,
        options.onProgress
      );
    }

    try {
      await partFile.close();
    } catch (error) {
      throw runtimeError(
        "FILE_WRITE_ERROR",
        `Could not close the runtime partial file: ${errorMessage(error)}`,
        { partPath: options.partPath, fileCode: errorCode(error) },
        error
      );
    }

    if (options.signal?.aborted) {
      throw abortedError(finalUrl.href);
    }

    if (streamed.sha256 !== expectedSha256) {
      throw runtimeError(
        "CHECKSUM_MISMATCH",
        "The downloaded runtime SHA-256 did not match SHA256SUMS.",
        {
          assetName: options.assetName,
          expectedSha256,
          actualSha256: streamed.sha256
        }
      );
    }

    return {
      ...streamed,
      partPath: options.partPath,
      finalUrl: finalUrl.href,
      expectedSha256
    };
  } catch (error) {
    failure =
      error instanceof RuntimeDownloadError
        ? error
        : runtimeError(
            "NETWORK_ERROR",
            `Runtime download failed: ${errorMessage(error)}`,
            { assetName: options.assetName },
            error
          );
    try {
      await partFile.close();
    } catch {
      // Cleanup below is authoritative; a closed handle can also reject here.
    }
    await removeOwnedPart(options.partPath, failure);
    throw failure;
  }
}

export function isRetryableRuntimeDownloadError(error: unknown): boolean {
  if (!(error instanceof RuntimeDownloadError)) {
    return false;
  }
  if (error.code === "IDLE_TIMEOUT") {
    // An automatic retry would overlap the still-running requestUrl call.
    return error.details?.bufferedRequest !== true;
  }
  if (
    error.code === "NETWORK_ERROR" ||
    error.code === "CONTENT_LENGTH_MISMATCH"
  ) {
    return true;
  }
  if (error.code !== "HTTP_STATUS") {
    return false;
  }
  const statusCode = Number(error.details?.statusCode);
  return (
    statusCode === 408 ||
    statusCode === 425 ||
    statusCode === 429 ||
    (statusCode >= 500 && statusCode <= 599)
  );
}

export function isManuallyRetryableRuntimeDownloadError(
  error: unknown
): boolean {
  if (!(error instanceof RuntimeDownloadError)) {
    return false;
  }
  return ![
    "ABORTED",
    "INVALID_ARGUMENT",
    "UNSUPPORTED_PROTOCOL",
    "PART_FILE_EXISTS",
    "FILE_WRITE_ERROR",
    "PART_CLEANUP_FAILED"
  ].includes(error.code);
}

function waitForRetryDelay(
  delayMs: number,
  signal: AbortSignal | undefined
): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(abortedError());
  }
  if (delayMs <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortedError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function downloadRuntimeAssetWithRetry(
  options: DownloadRuntimeAssetWithRetryOptions
): Promise<DownloadRuntimeAssetResult> {
  const {
    maxAttempts = 3,
    retryDelayMs = 750,
    onRetry,
    ...downloadOptions
  } = options;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "maxAttempts must be a positive integer.",
      { maxAttempts }
    );
  }
  if (!Number.isFinite(retryDelayMs) || retryDelayMs < 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "retryDelayMs must be a non-negative finite number.",
      { retryDelayMs }
    );
  }

  for (let attempt = 1; ; attempt += 1) {
    try {
      return await downloadRuntimeAsset(downloadOptions);
    } catch (error) {
      if (
        attempt >= maxAttempts ||
        !isRetryableRuntimeDownloadError(error)
      ) {
        throw error;
      }
      try {
        onRetry?.(error as RuntimeDownloadError, attempt + 1, maxAttempts);
      } catch {
        // UI retry callbacks must not change downloader behavior.
      }
      await waitForRetryDelay(retryDelayMs * attempt, options.signal);
    }
  }
}
