var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MdExportWordPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");
var import_node_child_process = require("node:child_process");
var fs3 = __toESM(require("node:fs"), 1);
var path3 = __toESM(require("node:path"), 1);

// src/runtime-install.ts
var fs = __toESM(require("node:fs"), 1);
var path = __toESM(require("node:path"), 1);
var RUNTIME_DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1e3;
var RUNTIME_INSTALL_LOCK_INITIALIZATION_GRACE_MS = 10 * 1e3;
function runSingleFlight(owner, key, task, onDuplicate) {
  const current = owner[key];
  if (current) {
    onDuplicate?.();
    return current;
  }
  const work = Promise.resolve().then(task);
  const tracked = work.finally(() => {
    if (owner[key] === tracked) {
      owner[key] = null;
    }
  });
  owner[key] = tracked;
  return tracked;
}
var RuntimeInstallBusyError = class extends Error {
  constructor() {
    super(
      "\u68C0\u6D4B\u5230\u53E6\u4E00\u4E2A\u8FD0\u884C\u65F6\u5B89\u88C5\u4EFB\u52A1\u4ECD\u5728\u6267\u884C\uFF0C\u8BF7\u7B49\u5F85\u5176\u5B8C\u6210\u540E\u518D\u8BD5"
    );
    this.name = "RuntimeInstallBusyError";
  }
};
function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error instanceof Error && "code" in error && error.code !== "ESRCH";
  }
}
function acquireRuntimeInstallLock(pluginRoot, now = Date.now(), isProcessAlive = processIsAlive) {
  const lockPath = path.join(pluginRoot, ".runtime-install.lock");
  const token = `${process.pid}-${now}-` + Math.random().toString(36).slice(2);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const descriptor = fs.openSync(lockPath, "wx");
      let writeError = null;
      try {
        fs.writeFileSync(
          descriptor,
          JSON.stringify({
            token,
            pid: process.pid,
            createdAt: now
          }),
          "utf8"
        );
      } catch (error) {
        writeError = error;
      } finally {
        fs.closeSync(descriptor);
      }
      if (writeError) {
        try {
          fs.rmSync(lockPath, { force: true });
        } catch {
        }
        throw writeError;
      }
      return { path: lockPath, token };
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "EEXIST") {
        throw error;
      }
      let stale = false;
      try {
        const existing = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        stale = !isProcessAlive(Number(existing.pid));
      } catch {
        try {
          const age = Math.max(0, now - fs.statSync(lockPath).mtimeMs);
          stale = age > RUNTIME_INSTALL_LOCK_INITIALIZATION_GRACE_MS;
        } catch (statError) {
          if (statError instanceof Error && "code" in statError && statError.code === "ENOENT") {
            continue;
          }
          throw new RuntimeInstallBusyError();
        }
      }
      if (!stale || attempt > 0) {
        throw new RuntimeInstallBusyError();
      }
      const stalePath = `${lockPath}.stale-${token}`;
      try {
        fs.renameSync(lockPath, stalePath);
        fs.rmSync(stalePath, { force: true });
      } catch (cleanupError) {
        if (cleanupError instanceof Error && "code" in cleanupError && cleanupError.code === "ENOENT") {
          continue;
        }
        throw new RuntimeInstallBusyError();
      }
    }
  }
  throw new RuntimeInstallBusyError();
}
function releaseRuntimeInstallLock(lock) {
  if (!lock) {
    return null;
  }
  try {
    const existing = JSON.parse(fs.readFileSync(lock.path, "utf8"));
    if (existing.token === lock.token) {
      fs.rmSync(lock.path, { force: true });
    }
    return null;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
function createRuntimeInstallWorkspace(pluginRoot, targetId, assetName) {
  const safeTarget = targetId.replace(/[^A-Za-z0-9_.-]/g, "-");
  const root = fs.mkdtempSync(
    path.join(pluginRoot, `.runtime-install-${safeTarget}-`)
  );
  const zipPath = path.join(root, path.basename(assetName));
  return {
    root,
    zipPath,
    partialZipPath: `${zipPath}.part`,
    stagePath: path.join(root, "stage"),
    backupPath: path.join(root, "backup")
  };
}
function removeTreeBestEffort(target) {
  if (!target) {
    return null;
  }
  try {
    fs.rmSync(target, { recursive: true, force: true });
    return null;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}
function formatMegabytes(bytes) {
  return `${(bytes / 1e6).toFixed(1)} MB`;
}

// src/runtime-download.ts
var import_node_crypto = require("node:crypto");
var http = __toESM(require("node:http"), 1);
var https = __toESM(require("node:https"), 1);
var import_promises = require("node:fs/promises");
var RUNTIME_DOWNLOAD_IDLE_TIMEOUT_MS = 9e4;
var RUNTIME_DOWNLOAD_MAX_REDIRECTS = 5;
var RUNTIME_CHECKSUM_MAX_BYTES = 1024 * 1024;
var RUNTIME_DOWNLOAD_RANGE_BYTES = 4 * 1024 * 1024;
var RUNTIME_BUFFERED_INITIAL_TIMEOUT_MS = 15 * 60 * 1e3;
var RUNTIME_BUFFERED_CHUNK_TIMEOUT_MS = 5 * 60 * 1e3;
var RuntimeDownloadError = class extends Error {
  code;
  details;
  constructor(code, message, options = {}) {
    super(
      message,
      options.cause === void 0 ? void 0 : { cause: options.cause }
    );
    this.name = "RuntimeDownloadError";
    this.code = code;
    this.details = options.details;
  }
};
var REDIRECT_STATUSES = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function runtimeError(code, message, details, cause) {
  return new RuntimeDownloadError(code, message, { cause, details });
}
function errorCode(error) {
  if (error && typeof error === "object" && "code" in error) {
    const code = error.code;
    return typeof code === "string" ? code : void 0;
  }
  return void 0;
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function abortedError(url) {
  return runtimeError(
    "ABORTED",
    "Runtime download was cancelled.",
    url ? { url } : void 0
  );
}
function idleTimeoutError(url, idleTimeoutMs) {
  return runtimeError(
    "IDLE_TIMEOUT",
    `Runtime download received no data for ${idleTimeoutMs} ms.`,
    { url, idleTimeoutMs }
  );
}
function bufferedTimeoutError(url, timeoutMs) {
  return runtimeError(
    "IDLE_TIMEOUT",
    `Runtime buffered request did not complete within ${timeoutMs} ms.`,
    { url, idleTimeoutMs: timeoutMs, bufferedRequest: true }
  );
}
function parseHttpUrl(input, label) {
  let url;
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
function validateOptions(options) {
  if (!options || typeof options !== "object") {
    throw runtimeError("INVALID_ARGUMENT", "Download options are required.");
  }
  if (!options.assetName || typeof options.assetName !== "string") {
    throw runtimeError("INVALID_ARGUMENT", "assetName must not be empty.");
  }
  if (!options.partPath || typeof options.partPath !== "string" || !options.partPath.endsWith(".part")) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "partPath must name a .part file.",
      { partPath: options.partPath }
    );
  }
  const idleTimeoutMs = options.idleTimeoutMs ?? RUNTIME_DOWNLOAD_IDLE_TIMEOUT_MS;
  if (!Number.isFinite(idleTimeoutMs) || idleTimeoutMs <= 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "idleTimeoutMs must be a positive finite number.",
      { idleTimeoutMs }
    );
  }
  const maxRedirects = options.maxRedirects ?? RUNTIME_DOWNLOAD_MAX_REDIRECTS;
  if (!Number.isInteger(maxRedirects) || maxRedirects < 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "maxRedirects must be a non-negative integer.",
      { maxRedirects }
    );
  }
  const rangeChunkBytes = options.rangeChunkBytes ?? RUNTIME_DOWNLOAD_RANGE_BYTES;
  if (!Number.isSafeInteger(rangeChunkBytes) || rangeChunkBytes <= 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "rangeChunkBytes must be a positive safe integer.",
      { rangeChunkBytes }
    );
  }
  const bufferedInitialTimeoutMs = options.bufferedInitialTimeoutMs ?? RUNTIME_BUFFERED_INITIAL_TIMEOUT_MS;
  if (!Number.isFinite(bufferedInitialTimeoutMs) || bufferedInitialTimeoutMs <= 0) {
    throw runtimeError(
      "INVALID_ARGUMENT",
      "bufferedInitialTimeoutMs must be a positive finite number.",
      { bufferedInitialTimeoutMs }
    );
  }
  const bufferedChunkTimeoutMs = options.bufferedChunkTimeoutMs ?? RUNTIME_BUFFERED_CHUNK_TIMEOUT_MS;
  if (!Number.isFinite(bufferedChunkTimeoutMs) || bufferedChunkTimeoutMs <= 0) {
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
function requestOnce(url, signal, idleTimeoutMs) {
  return new Promise((resolve2, reject) => {
    if (signal?.aborted) {
      reject(abortedError(url.href));
      return;
    }
    let settled = false;
    let idleTimer;
    const requestFactory = url.protocol === "https:" ? https.request : http.request;
    const request3 = requestFactory(
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
        resolve2(response);
      }
    );
    const cleanup = () => {
      if (idleTimer !== void 0) {
        clearTimeout(idleTimer);
        idleTimer = void 0;
      }
      signal?.removeEventListener("abort", onAbort);
    };
    const fail = (error) => {
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
      request3.destroy(error);
    };
    const resetIdleTimer = () => {
      if (idleTimer !== void 0) {
        clearTimeout(idleTimer);
      }
      idleTimer = setTimeout(() => {
        const error = idleTimeoutError(url.href, idleTimeoutMs);
        fail(error);
        request3.destroy(error);
      }, idleTimeoutMs);
    };
    request3.once("error", (error) => {
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
    request3.end();
  });
}
async function openHttpResponse(input, label, signal, idleTimeoutMs, maxRedirects) {
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
      let redirectUrl;
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
async function readResponseText(response, finalUrl, signal, idleTimeoutMs, maxBytes) {
  const chunks = [];
  let receivedBytes = 0;
  let timeoutFailure = null;
  let abortFailure = null;
  let idleTimer;
  const resetIdleTimer = () => {
    if (idleTimer !== void 0) {
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
    if (idleTimer !== void 0) {
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
function bufferedHeader(response, name) {
  const normalizedName = name.toLowerCase();
  for (const [key, value] of Object.entries(response.headers || {})) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  return void 0;
}
function bufferedBody(response, url) {
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
function bufferedContentLength(response) {
  const header = bufferedHeader(response, "content-length");
  if (header === void 0 || !/^\d+$/.test(header) || !Number.isSafeInteger(Number(header))) {
    return null;
  }
  return Number(header);
}
function bufferedHttpStatusError(url, statusCode) {
  return runtimeError(
    "HTTP_STATUS",
    `Runtime download returned HTTP ${statusCode}.`,
    { url: url.href, statusCode }
  );
}
function runBufferedRequest(request3, url, headers, signal, timeoutMs) {
  return new Promise((resolve2, reject) => {
    if (signal?.aborted) {
      reject(abortedError(url.href));
      return;
    }
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };
    const succeed = (response) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve2(response);
    };
    const fail = (error) => {
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
    let pending;
    try {
      pending = Promise.resolve(request3({ url: url.href, headers, signal }));
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
function validateBufferedResponse(response, url) {
  if (!response || !Number.isInteger(response.status) || response.status < 0) {
    throw runtimeError(
      "NETWORK_ERROR",
      "The buffered runtime request returned an invalid response.",
      { url: url.href }
    );
  }
}
function parseSha256Sums(contents) {
  if (typeof contents !== "string") {
    throw runtimeError(
      "CHECKSUM_FORMAT_INVALID",
      "Checksum contents must be text."
    );
  }
  const entries = /* @__PURE__ */ new Map();
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
function checksumForAsset(entries, assetName) {
  if (!assetName || typeof assetName !== "string") {
    throw runtimeError("INVALID_ARGUMENT", "assetName must not be empty.");
  }
  const matches = [assetName, `./${assetName}`].map((filename) => ({ filename, sha256: entries.get(filename) })).filter(
    (entry) => entry.sha256 !== void 0
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
function contentLength(response) {
  const header = response.headers["content-length"];
  if (typeof header !== "string" || !/^\d+$/.test(header) || !Number.isSafeInteger(Number(header))) {
    return null;
  }
  return Number(header);
}
function createProgress(receivedBytes, totalBytes, startedAt) {
  const elapsedSeconds = Math.max((Date.now() - startedAt) / 1e3, 1e-3);
  const bytesPerSecond = receivedBytes === 0 ? 0 : receivedBytes / elapsedSeconds;
  const percent = totalBytes === null ? null : totalBytes === 0 ? receivedBytes === 0 ? 100 : null : Math.min(100, receivedBytes / totalBytes * 100);
  const etaSeconds = totalBytes === null || bytesPerSecond <= 0 ? null : Math.max(0, (totalBytes - receivedBytes) / bytesPerSecond);
  return {
    receivedBytes,
    totalBytes,
    percent,
    bytesPerSecond,
    etaSeconds
  };
}
function emitProgress(onProgress, progress) {
  try {
    onProgress?.(progress);
  } catch {
  }
}
async function writeChunk(file, chunk) {
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
async function streamResponseToFile(response, finalUrl, file, totalBytes, signal, idleTimeoutMs, onProgress) {
  const hash = (0, import_node_crypto.createHash)("sha256");
  const startedAt = Date.now();
  let receivedBytes = 0;
  let timeoutFailure = null;
  let abortFailure = null;
  let idleTimer;
  const resetIdleTimer = () => {
    if (idleTimer !== void 0) {
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
    if (idleTimer !== void 0) {
      clearTimeout(idleTimer);
    }
    signal?.removeEventListener("abort", onAbort);
  }
  if (!response.complete || totalBytes !== null && receivedBytes !== totalBytes) {
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
function parseContentRange(response, url) {
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
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || !Number.isSafeInteger(total) || start < 0 || end < start || total <= end) {
    throw runtimeError(
      "CONTENT_LENGTH_MISMATCH",
      "A partial runtime response described an invalid byte range.",
      { url: url.href, contentRange: header }
    );
  }
  return { start, end, total };
}
function responseValidator(response) {
  const etag = bufferedHeader(response, "etag")?.trim();
  if (etag && !/^W\//i.test(etag)) {
    return etag;
  }
  const lastModified = bufferedHeader(response, "last-modified")?.trim();
  return lastModified || void 0;
}
async function downloadBufferedRanges(assetUrl, file, request3, rangeChunkBytes, initialTimeoutMs, chunkTimeoutMs, signal, onProgress) {
  const url = parseHttpUrl(assetUrl, "assetUrl");
  const hash = (0, import_node_crypto.createHash)("sha256");
  const startedAt = Date.now();
  let receivedBytes = 0;
  let totalBytes = null;
  let validator;
  let finalUrl = url.href;
  emitProgress(onProgress, createProgress(0, null, startedAt));
  for (; ; ) {
    if (signal?.aborted) {
      throw abortedError(url.href);
    }
    const requestedEnd = Math.min(
      Number.MAX_SAFE_INTEGER,
      receivedBytes + rangeChunkBytes - 1
    );
    const headers = {
      Accept: "application/octet-stream",
      "Accept-Encoding": "identity",
      Range: `bytes=${receivedBytes}-${requestedEnd}`
    };
    if (validator) {
      headers["If-Range"] = validator;
    }
    const response = await runBufferedRequest(
      request3,
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
      if (range.start !== receivedBytes || range.end > requestedEnd || body.byteLength !== range.end - range.start + 1 || totalBytes !== null && range.total !== totalBytes) {
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
async function fetchExpectedSha256(checksumUrl, assetName, signal, idleTimeoutMs, maxRedirects, bufferedRequest) {
  if (bufferedRequest) {
    const url = parseHttpUrl(checksumUrl, "checksumUrl");
    const response2 = await runBufferedRequest(
      bufferedRequest,
      url,
      {
        Accept: "text/plain, application/octet-stream",
        "Accept-Encoding": "identity"
      },
      signal,
      idleTimeoutMs
    );
    validateBufferedResponse(response2, url);
    if (response2.status < 200 || response2.status >= 300) {
      throw bufferedHttpStatusError(url, response2.status);
    }
    const body = bufferedBody(response2, url);
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
function mapPartOpenError(error, partPath) {
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
async function removeOwnedPart(partPath, originalError) {
  try {
    await (0, import_promises.unlink)(partPath);
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
async function downloadRuntimeAsset(options) {
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
  let partFile;
  try {
    partFile = await (0, import_promises.open)(options.partPath, "wx");
  } catch (error) {
    throw mapPartOpenError(error, options.partPath);
  }
  let failure = null;
  try {
    let streamed;
    let finalUrl;
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
    failure = error instanceof RuntimeDownloadError ? error : runtimeError(
      "NETWORK_ERROR",
      `Runtime download failed: ${errorMessage(error)}`,
      { assetName: options.assetName },
      error
    );
    try {
      await partFile.close();
    } catch {
    }
    await removeOwnedPart(options.partPath, failure);
    throw failure;
  }
}
function isRetryableRuntimeDownloadError(error) {
  if (!(error instanceof RuntimeDownloadError)) {
    return false;
  }
  if (error.code === "IDLE_TIMEOUT") {
    return error.details?.bufferedRequest !== true;
  }
  if (error.code === "NETWORK_ERROR" || error.code === "CONTENT_LENGTH_MISMATCH") {
    return true;
  }
  if (error.code !== "HTTP_STATUS") {
    return false;
  }
  const statusCode = Number(error.details?.statusCode);
  return statusCode === 408 || statusCode === 425 || statusCode === 429 || statusCode >= 500 && statusCode <= 599;
}
function isManuallyRetryableRuntimeDownloadError(error) {
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
function waitForRetryDelay(delayMs, signal) {
  if (signal?.aborted) {
    return Promise.reject(abortedError());
  }
  if (delayMs <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve2, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve2();
    }, delayMs);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortedError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
async function downloadRuntimeAssetWithRetry(options) {
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
      if (attempt >= maxAttempts || !isRetryableRuntimeDownloadError(error)) {
        throw error;
      }
      try {
        onRetry?.(error, attempt + 1, maxAttempts);
      } catch {
      }
      await waitForRetryDelay(retryDelayMs * attempt, options.signal);
    }
  }
}

// src/locales/en.ts
var en = {
  "common.cancel": "Cancel",
  "common.continue": "Continue",
  "common.close": "Close",
  "common.unknown": "Unknown",
  "common.enabled": "On",
  "common.disabled": "Off",
  "common.default": "Default",
  "common.savedValue": "{value} (saved value)",
  "common.errorWithMessage": "{action}: {message}",
  "duration.seconds": "{seconds} sec",
  "duration.minutesSeconds": "{minutes} min {seconds} sec",
  "command.exportKeepFigures": "Export current Markdown to Word (keep figure positions)",
  "command.exportReflowFigures": "Export current Markdown to Word (auto-fill figure page gaps)",
  "command.reapplyBlueCitations": "Reapply blue Zotero citations to exported Word",
  "command.installRuntime": "Install or repair Word export runtime",
  "command.checkRuntime": "Check Word export runtime",
  "settings.title": "MD Export Word",
  "settings.language.name": "Interface language / \u754C\u9762\u8BED\u8A00",
  "settings.language.desc": "Change the language used by the plugin interface, commands, and progress messages.",
  "settings.language.system": "Follow Obsidian",
  "settings.language.zhCN": "\u7B80\u4F53\u4E2D\u6587",
  "settings.language.en": "English",
  "settings.repository.name": "Runtime release repository",
  "settings.repository.desc": "Normally stamped by an official release. Change this only for a fork or private repository.",
  "settings.repository.placeholder": "owner/obsidian-md-export-word",
  "settings.autoOpen.name": "Open Word after a successful export",
  "settings.autoOpen.desc": "Enabled by default. The generated .docx opens only after export and automatic checks both succeed.",
  "settings.runtimePlatform.name": "Runtime platform",
  "settings.runtimePlatform.desc": "Detected automatically. Change this only when an Apple Silicon Mac must run Intel binaries through Rosetta.",
  "settings.runtimePlatform.auto": "Auto-detect ({target})",
  "settings.runtime.name": "Word export runtime",
  "settings.runtime.installingDesc": "The runtime is being installed. No further action is needed until this task finishes.",
  "settings.runtime.installing": "Installing...",
  "settings.runtime.installOrRepair": "Install or repair",
  "settings.runtime.doctor": "Run diagnostics",
  "exportMode.title": "Choose a Markdown \u2192 Word export mode",
  "exportMode.desc": "The source Markdown will not be changed. Choose how missing Zotero citations should be handled.",
  "exportMode.strict.name": "Strict mode",
  "exportMode.strict.desc": "For your own manuscripts: stop the export if Zotero cannot find any citekey.",
  "exportMode.strict.action": "Use strict mode",
  "exportMode.compatible.name": "Compatible mode",
  "exportMode.compatible.desc": "For imported Markdown: keep missing citekeys as red, yellow-highlighted placeholders and write them to the log.",
  "exportMode.compatible.action": "Use compatible mode",
  "wordSelect.title": "Restore blue Zotero citations in Word",
  "wordSelect.desc": "Refresh Zotero fields in Word and save the document first, preferably with the document closed. A new copy will be created without overwriting the source. In-text citations become blue while the bibliography remains black.",
  "wordSelect.file.name": "Choose a Word file",
  "wordSelect.file.desc": "Lists .docx files beside the current Markdown file, with the most recently modified first.",
  "wordSelect.action": "Create blue-citation copy",
  "format.title": "Configure Word export formatting",
  "format.intro": "If no options are changed, the current journal template is used ({summary}).",
  "format.defaultValue": "Default: {value}",
  "format.figureFlow.name": "Figure pagination",
  "format.figureFlow.desc": "By default, figures and text remain in Markdown order. Auto-fill may move consecutive paragraphs from the same section ahead of a figure to reduce blank space before a page break.",
  "format.figureFlow.keep": "Keep figure positions (default)",
  "format.figureFlow.reflow": "Auto-fill page gaps",
  "format.outputName.name": "Word file name",
  "format.outputName.desc": "Defaults to the first-level article heading in Markdown. You can edit it without adding .docx; a timestamp is added if the name already exists.",
  "format.outputName.placeholder": "Enter a Word file name",
  "format.outputName.empty": "The Word file name cannot be empty.",
  "format.outputName.invalidCharacters": 'The Word file name cannot contain < > : " / \\ | ? * or control characters.',
  "format.outputName.trailingCharacter": "The Word file name cannot end with a period or space.",
  "format.outputName.reserved": '"{name}" is a reserved Windows file name. Choose another name.',
  "format.defaultOutputName": "Exported document",
  "format.preset.name": "Formatting preset",
  "format.preset.desc": "Reuse a previously saved thesis, journal, or other formatting preset.",
  "format.preset.default": "Current journal template (default)",
  "format.preset.defaultName": "Current journal template",
  "format.preset.customName": "Custom for this export",
  "format.template.name": "Reference Word template",
  "format.template.default": "Default: {file}",
  "format.section.body": "Body text and fonts",
  "format.eastAsiaFont.name": "East Asian font",
  "format.eastAsiaFont.default": "Default: {font}",
  "format.westernFont.name": "Latin and numeric font",
  "format.westernFont.default": "Default: {font}",
  "format.bodySize.name": "Body font size",
  "format.bodyLineSpacing.name": "Body line spacing",
  "format.bodyIndent.name": "Body first-line indent",
  "format.documentLanguage.name": "Manuscript language",
  "format.documentLanguage.desc": "Defaults to the note's lang. English uses a two-halfwidth-character indent (1 em) and Times New Roman; Chinese uses two fullwidth characters (2 em). Body text is justified; settings remain editable.",
  "format.documentLanguage.zhCN": "Chinese",
  "format.documentLanguage.en": "English",
  "format.section.headings": "Title and headings",
  "format.titleSize.name": "Article title size (Markdown #)",
  "format.titleLineSpacing.name": "Article title line spacing",
  "format.heading2Size.name": "Level 1 section heading size (Markdown ##)",
  "format.heading3Size.name": "Level 2 section heading size (Markdown ###)",
  "format.heading4Size.name": "Level 3 section heading size (Markdown ####)",
  "format.headingLineSpacing.name": "Section heading line spacing",
  "format.section.tablesCaptionsNotes": "Tables, captions, and notes",
  "format.tableSize.name": "Table font size (including formulas)",
  "format.tableLineSpacing.name": "Table line spacing",
  "format.captionSize.name": "Figure and table caption size",
  "format.captionLineSpacing.name": "Figure and table caption line spacing",
  "format.noteSize.name": "Figure and table note size",
  "format.noteLineSpacing.name": "Figure and table note line spacing",
  "format.formulaSize.name": "Body formula size",
  "format.section.page": "Page",
  "format.margin.name": "A4 margins",
  "format.saveName.name": "Preset name (optional)",
  "format.saveName.desc": "Enter a name to save these settings as a thesis, journal, or other preset.",
  "format.saveName.placeholder": "For example: Thesis",
  "format.saveName.required": "Enter a preset name, such as a thesis or journal name.",
  "format.action.useDefault": "Use default template",
  "format.action.saveAndExport": "Save preset and export",
  "format.action.export": "Export with current settings",
  "format.summary": "East Asian font {eastAsiaFont}; Latin/numeric font {westernFont}; body {bodySize} pt, {bodyLineSpacing} line spacing, {bodyIndent}-character first-line indent; tables {tableSize} pt, {tableLineSpacing} line spacing; captions {captionSize} pt; notes {noteSize} pt; A4 margins {margin} cm; figure gap fill {figureReflow}",
  "format.option.size.7_5": "7.5 pt",
  "format.option.size.9": "9 pt",
  "format.option.size.10_5": "10.5 pt",
  "format.option.size.12": "12 pt",
  "format.option.size.14": "14 pt",
  "format.option.size.15": "15 pt",
  "format.option.size.16": "16 pt",
  "format.option.size.18": "18 pt",
  "format.option.size.22": "22 pt",
  "format.option.line.1": "Single",
  "format.option.line.1_25": "1.25",
  "format.option.line.1_5": "1.5",
  "format.option.line.1_75": "1.75",
  "format.option.line.2": "Double",
  "format.option.indent.0": "No indent",
  "format.option.indent.1": "1-character first-line indent",
  "format.option.indent.2": "2-character first-line indent",
  "format.option.margin.2": "2.00 cm on all sides",
  "format.option.margin.2_2": "2.20 cm on all sides",
  "format.option.margin.2_54": "2.54 cm on all sides",
  "format.option.margin.3": "3.00 cm on all sides",
  "progressModal.export.title": "Exporting Word",
  "progressModal.export.success": "Export complete",
  "progressModal.export.failure": "Export failed",
  "progressModal.recolor.title": "Restoring Zotero citation colors",
  "progressModal.recolor.success": "Citation coloring complete",
  "progressModal.recolor.failure": "Citation coloring failed",
  "progressModal.starting": "Preparing to start the exporter...",
  "progressModal.processing": "Processing...",
  "progressModal.liveProcess": "Live process",
  "progressModal.processAria": "Live Word export process; text can be selected and copied",
  "progressModal.copyCurrent": "Copy current process",
  "progressModal.hide": "Hide window",
  "progressModal.noLog": "There is no process log to copy.",
  "progressModal.copyRejected": "The system rejected the copy operation",
  "progressModal.copyFailed": "Copy failed: {message}",
  "progressModal.failureLogCopied": "The failure log was copied to the clipboard.",
  "progressModal.processCopied": "The current export process was copied.",
  "progressModal.logNotFound": "The failure log file was not found.",
  "progressModal.openLogFailed": "Could not open the failure log: {message}",
  "progressModal.copyProcess": "Copy process",
  "progressModal.doneAndClose": "Done and close",
  "progressModal.errorLog": "Failure log: {path}",
  "progressModal.copyErrorLog": "Copy failure log",
  "progressModal.openLog": "Open log file",
  "progressModal.parseEventFailed": "Could not parse the progress event: {message}",
  "repositoryModal.title": "Set runtime repository",
  "repositoryModal.desc": "The plugin downloads the matching system runtime from the same-version GitHub Release. Enter the repository added to BRAT.",
  "repositoryModal.name": "GitHub repository",
  "repositoryModal.format": "Format: owner/repository",
  "runtime.compatibility.unsupported": "{platform}/{arch} is not supported.",
  "runtime.compatibility.platformMismatch": "The selected {target} runtime does not match the current system ({platform}/{arch}).",
  "runtime.compatibility.archMismatch": "The selected {target} runtime is incompatible with the current CPU architecture ({arch}).",
  "runtime.status.noLocalFs": "This vault is not on a local file system.",
  "runtime.status.incomplete": "The {target} runtime is not installed or is incomplete ({count} files missing).",
  "runtime.status.versionMismatch": "Runtime version {runtimeVersion} does not match plugin version {pluginVersion}.",
  "runtime.status.platformMismatch": "The installed runtime is {installed}; {required} is required.",
  "runtime.status.installed": "{target} runtime {version} is installed.",
  "runtime.status.manifestDamaged": "The runtime manifest is invalid: {message}",
  "runtime.install.duplicate": "The Word export runtime is already being installed. Wait for the current task; no additional click is needed.",
  "runtime.install.cannotInstall": "Cannot install the runtime: {message}",
  "runtime.install.noLocalFs": "The runtime cannot be installed because this vault is not on a local file system.",
  "runtime.install.cancelled": "Runtime installation was cancelled.",
  "runtime.install.invalidRepository": "The GitHub repository must use the owner/repository format.",
  "runtime.install.saveRepositoryFailed": "Could not save the runtime repository setting: {message}",
  "runtime.install.stage.prepare": "Preparing runtime installation",
  "runtime.install.stage.download": "Downloading the {target} Word export runtime {version}",
  "runtime.install.detail.download": "The package is about {size}. A slow GitHub connection may take several minutes.",
  "runtime.install.progress": "{stage}\nElapsed: {elapsed}. {detail}",
  "runtime.install.timeout": "The download request did not complete within {seconds} seconds and stopped. Check GitHub connectivity and retry.",
  "runtime.install.httpError": "GitHub Release returned HTTP {status}. Confirm that {version} is published and includes {asset}.",
  "runtime.install.stage.validateDownload": "Validating the download",
  "runtime.install.detail.validateDownload": "Checking the ZIP format, locally written size, and SHA-256.",
  "runtime.install.archiveMissing": "The runtime ZIP disappeared or changed size before extraction",
  "runtime.install.stage.extract": "Download complete ({size}); extracting",
  "runtime.install.detail.extract": "Keep Obsidian running.",
  "runtime.install.extractFailed": "Runtime extraction failed: {code}",
  "runtime.install.stage.validatePackage": "Validating the runtime package",
  "runtime.install.detail.validatePackage": "Checking the version and CPU platform.",
  "runtime.install.manifestMissing": "The runtime package is missing runtime/runtime-manifest.json",
  "runtime.install.packageMismatch": "Runtime package mismatch: version {version}, platform {platform}",
  "runtime.install.stage.replace": "Replacing the old runtime",
  "runtime.install.detail.replace": "The old runtime is backed up first and restored automatically if installation fails.",
  "runtime.install.stage.configurePython": "Configuring the private Python environment",
  "runtime.install.detail.configurePython": "Creating the virtual environment or accessing PyPI for the first time may take several minutes.",
  "runtime.install.pythonFailed": "Python environment setup failed: {code}",
  "runtime.install.stage.doctor": "Running final environment diagnostics",
  "runtime.install.detail.doctor": "Installation is almost complete.",
  "runtime.install.complete": "Word export runtime installation complete: {status}",
  "runtime.install.backupMissing": "The old runtime backup is missing",
  "runtime.install.restoreFailed": "Automatic restoration of the old runtime failed: {message}",
  "runtime.install.networkHint": "Confirm that a browser can open this version's GitHub Release, then retry after connectivity returns.",
  "runtime.install.retryHint": 'Run "Install or repair" again. If it still fails, run diagnostics and read the troubleshooting guide.',
  "runtime.install.backupRetained": "The old runtime backup was retained at: {path}.",
  "runtime.install.cleanupIncomplete": "The failed new runtime could not be cleaned up. Quit Obsidian completely before repairing it.",
  "runtime.install.failed": "Runtime installation failed during {stage}: {message}. {hint}{recovery}",
  "runtime.install.cleanupFailed": "Runtime installation ended, but its temporary directory could not be removed: {message}",
  "runtime.install.lockCleanupFailed": "The runtime installation lock could not be removed: {message}",
  "runtime.install.busy": "Another runtime installation is still running. Wait for it to finish and try again.",
  "runtime.install.archiveEmpty": "The downloaded file is empty or incomplete",
  "runtime.install.archiveNotZip": "GitHub returned content that is not a ZIP file. A proxy or sign-in page may have replaced the download.",
  "runtime.install.archiveWriteIncomplete": "The runtime ZIP was not written completely: expected {expected} bytes, wrote {actual} bytes",
  "runtime.doctor.notReady": "Environment diagnostics failed: {status}",
  "runtime.doctor.missing": "The cross-platform diagnostics program is missing. Install or repair the runtime first.",
  "runtime.doctor.passed": "Environment diagnostics passed: {summary}",
  "runtime.doctor.failed": "Environment diagnostics failed: {summary}",
  "runtimeDownload.title": "Download Word export runtime",
  "runtimeDownload.language": "Interface language / \u754C\u9762\u8BED\u8A00",
  "runtimeDownload.elapsed": "Elapsed: {elapsed}",
  "runtimeDownload.preparing": "Preparing the download",
  "runtimeDownload.checksum": "Fetching the SHA-256 checksum",
  "runtimeDownload.downloading": "Downloading {file}",
  "runtimeDownload.progressKnown": "{downloaded} / {total} \xB7 {percent}% \xB7 {speed} \xB7 about {eta} remaining",
  "runtimeDownload.progressKnownCalculating": "{downloaded} / {total} \xB7 {percent}% \xB7 {speed} \xB7 estimating remaining time",
  "runtimeDownload.progressUnknown": "Downloaded {downloaded} \xB7 {speed} \xB7 estimating remaining time",
  "runtimeDownload.verifying": "Verifying SHA-256",
  "runtimeDownload.cancel": "Cancel download",
  "runtimeDownload.retry": "Retry",
  "runtimeDownload.hide": "Continue in background",
  "runtimeDownload.retrying": "Temporary network error. Starting download attempt {attempt}/{max}\u2026",
  "runtimeDownload.cancelled": "The download was cancelled.",
  "runtimeDownload.failed": "Download failed: {message}",
  "runtimeDownload.networkError": "The GitHub connection was interrupted. Check the network or proxy and retry.",
  "runtimeDownload.checksumError": "A valid SHA-256 checksum for this runtime asset could not be read.",
  "runtimeDownload.fileError": "The runtime temporary download file could not be written.",
  "runtimeDownload.partExists": "A temporary file from an earlier download remains. Restart Obsidian and retry.",
  "runtimeDownload.responseIncomplete": "The download ended before all expected bytes arrived.",
  "runtimeDownload.unknownError": "The runtime download did not complete.",
  "runtimeDownload.shaMismatch": "SHA-256 verification failed. The download may be incomplete or replaced.",
  "runtimeDownload.shaPassed": "SHA-256 verification passed.",
  "runtimeDownload.complete": "Download complete. Continuing installation.",
  "recolor.noLocalFs": "Word files cannot be processed because this vault is not on a local file system.",
  "recolor.runtimeUnavailable": "The runtime is still unavailable: {status}",
  "recolor.toolMissing": "The Zotero citation coloring tool is missing. Install or repair the runtime.",
  "recolor.readFolderFailed": "Could not read Word files in the current folder: {message}",
  "recolor.noFiles": "There are no .docx files to process beside the current Markdown file.",
  "recolor.cancelled": "Zotero citation coloring was cancelled.",
  "recolor.fileMissing": "The selected Word file no longer exists: {path}",
  "recolor.launchStage": "Starting citation coloring",
  "recolor.launchDetail": "The source Word file will not be overwritten; Zotero fields remain refreshable",
  "recolor.launchFailed": "Could not start citation coloring: {message}",
  "recolor.completed": "Zotero citations were restored to blue: {file}",
  "recolor.failedWithDetails": "Citation coloring failed ({code}): {details}",
  "recolor.failedWithCode": "Citation coloring failed with exit code {code}.",
  "recolor.running": "Creating a blue-citation copy: {file}",
  "export.cancelled": "Word export was cancelled.",
  "export.noLocalFs": "The local exporter cannot start because this vault is not on a local file system.",
  "export.readMarkdownFailed": "Could not read the current Markdown: {message}",
  "export.runtimeUnavailable": "The runtime is still unavailable: {status}",
  "export.templateDirectoryFailed": "Could not create the user template directory.",
  "export.pythonMissing": "The Python exporter for this system is missing. Install or repair the runtime.",
  "export.readTemplatesFailed": "Could not read the Word template directory: {message}",
  "export.noTemplates": "The Word template directory contains no .docx files: {path}",
  "export.templateMissing": "The selected Word template was not found: {path}",
  "export.presetSaved": "Formatting preset saved: {name}",
  "export.outputRenamed": "A Word file with the same name already exists and was not changed. This export was saved as: {file}",
  "export.launchStage": "Starting the exporter",
  "export.launchDetail": "{mode} \xB7 {format}",
  "export.launchFailed": "Could not start Word export: {message}",
  "export.completed": "Word export complete: {file}",
  "export.failedWithDetails": "Word export failed ({code}): {details}",
  "export.failedWithCode": "Word export failed with exit code {code}.",
  "export.running": "Exporting ({mode} | {format}): {file}",
  "export.mode.strict": "Strict mode",
  "export.mode.compatible": "Compatible mode",
  "progress.export.init": "Initializing the export environment",
  "progress.export.readMarkdown": "Reading Markdown",
  "progress.export.normalizeMarkdown": "Normalizing Markdown",
  "progress.export.normalizeMarkdownDetail": "Headings, images, citation spacing, and equation labels",
  "progress.export.parseDocument": "Parsing document structure",
  "progress.export.parseDocumentDetail": "Scanning images, tables, equations, and citations",
  "progress.export.checkResources": "Checking document resources",
  "progress.export.checkResourcesDetail": "Images {images}; tables {tables}; equations {equations}",
  "progress.export.checkCitations": "Checking Zotero citations",
  "progress.export.checkCitationsDetail": "citekeys {count}",
  "progress.export.preflight": "Preflight complete",
  "progress.export.preflightDetail": "Mode {mode}; missing citekeys {missing}",
  "progress.export.generateDraft": "Generating the Word draft",
  "progress.export.generateDraftDetail": "Running Pandoc and pandoc-crossref",
  "progress.export.draftReady": "Word draft generated",
  "progress.export.formatDocument": "Formatting the Word document",
  "progress.export.formatDocumentDetail": "Fonts, scripts, equations, figures, tables, and Zotero fields",
  "progress.export.validateDocument": "Checking the Word document",
  "progress.export.validateDocumentDetail": "Figure gaps filled {reflowed}; structure, numbering, citation fields, and formatting checked",
  "progress.export.verifySource": "Verifying the source file",
  "progress.export.verifySourceDetail": "Checking whether the Markdown changed during export",
  "progress.export.openWord": "Opening Word",
  "progress.export.complete": "Export complete",
  "progress.export.failed": "Export failed",
  "progress.export.cancelled": "Cancelled",
  "progress.export.cancelledDetail": "The user cancelled the export",
  "progress.recolor.init": "Initializing citation coloring",
  "progress.recolor.readWord": "Reading Word",
  "progress.recolor.detectFields": "Detecting Zotero fields",
  "progress.recolor.detectFieldsDetail": "In-text citations and the bibliography",
  "progress.recolor.checkColors": "Checking citation colors",
  "progress.recolor.checkColorsDetail": "In-text citation fields {citations}; bibliography fields {bibliography}",
  "progress.recolor.openWord": "Opening Word",
  "progress.recolor.complete": "Citation coloring complete",
  "progress.recolor.failed": "Citation coloring failed",
  "progress.recolor.cancelled": "Cancelled",
  "progress.recolor.cancelledDetail": "The user cancelled citation coloring",
  "format.citationStyle.name": "Citation style (Zotero)",
  "format.citationStyle.desc": "Read styles installed in local Zotero for this export. Refresh and style changes remain available in Word.",
  "format.citationStyle.empty": "No local Zotero styles found. Install styles and reload, or keep manuscript settings.",
  "format.citationStyle.follow": "Use manuscript settings",
  "format.citationStyle.refresh": "Reload styles",
  "format.citationStyle.parentMissing": "The local parent style is missing. Use manual Word refresh, or reinstall this style in Zotero first.",
  "format.citationDisplay.name": "Initial citation display",
  "format.citationDisplay.desc": "Both modes preserve Zotero fields. Initial rendering falls back to Word Zotero Refresh for unsupported styles.",
  "progress.export.citationFallback": "Refresh citations with Zotero in Word",
  "format.citationDisplay.manual": "Refresh manually in Word",
  "format.citationDisplay.rendered": "Render readable citations during export (default)"
};

// src/locales/zh-cn.ts
var zhCN = {
  "common.cancel": "\u53D6\u6D88",
  "common.continue": "\u7EE7\u7EED",
  "common.close": "\u5173\u95ED",
  "common.unknown": "\u672A\u77E5",
  "common.enabled": "\u5F00\u542F",
  "common.disabled": "\u5173\u95ED",
  "common.default": "\u9ED8\u8BA4",
  "common.savedValue": "{value}\uFF08\u5DF2\u4FDD\u5B58\u503C\uFF09",
  "common.errorWithMessage": "{action}\uFF1A{message}",
  "duration.seconds": "{seconds} \u79D2",
  "duration.minutesSeconds": "{minutes} \u5206 {seconds} \u79D2",
  "command.exportKeepFigures": "\u5BFC\u51FA\u5F53\u524D Markdown \u5230 Word\uFF08\u4FDD\u6301\u56FE\u7247\u4F4D\u7F6E\uFF09",
  "command.exportReflowFigures": "\u5BFC\u51FA\u5F53\u524D Markdown \u5230 Word\uFF08\u81EA\u52A8\u56DE\u586B\u56FE\u7247\u5206\u9875\u7A7A\u767D\uFF09",
  "command.reapplyBlueCitations": "\u6062\u590D\u5BFC\u51FA Word \u4E2D\u7684\u84DD\u8272 Zotero \u5F15\u6587",
  "command.installRuntime": "\u5B89\u88C5\u6216\u4FEE\u590D Word \u5BFC\u51FA\u8FD0\u884C\u65F6",
  "command.checkRuntime": "\u68C0\u67E5 Word \u5BFC\u51FA\u8FD0\u884C\u65F6",
  "settings.title": "MD Export Word",
  "settings.language.name": "\u754C\u9762\u8BED\u8A00 / Interface language",
  "settings.language.desc": "\u5207\u6362\u63D2\u4EF6\u754C\u9762\u3001\u547D\u4EE4\u548C\u8FDB\u5EA6\u63D0\u793A\u7684\u8BED\u8A00\u3002",
  "settings.language.system": "\u8DDF\u968F Obsidian",
  "settings.language.zhCN": "\u7B80\u4F53\u4E2D\u6587",
  "settings.language.en": "English",
  "settings.repository.name": "\u8FD0\u884C\u65F6\u53D1\u5E03\u4ED3\u5E93",
  "settings.repository.desc": "\u901A\u5E38\u7531\u6B63\u5F0F Release \u81EA\u52A8\u5199\u5165\uFF1B\u4EC5\u5728\u81EA\u5EFA\u5206\u652F\u6216\u79C1\u6709\u4ED3\u5E93\u4E2D\u9700\u8981\u4FEE\u6539\u3002",
  "settings.repository.placeholder": "owner/obsidian-md-export-word",
  "settings.autoOpen.name": "\u5BFC\u51FA\u6210\u529F\u540E\u81EA\u52A8\u6253\u5F00 Word",
  "settings.autoOpen.desc": "\u9ED8\u8BA4\u5F00\u542F\uFF1B\u53EA\u6709\u5BFC\u51FA\u548C\u81EA\u52A8\u81EA\u68C0\u5747\u6210\u529F\u65F6\u624D\u4F1A\u6253\u5F00\u751F\u6210\u7684 .docx\u3002",
  "settings.runtimePlatform.name": "\u8FD0\u884C\u65F6\u5E73\u53F0",
  "settings.runtimePlatform.desc": "\u9ED8\u8BA4\u81EA\u52A8\u8BC6\u522B\uFF1B\u4EC5\u5728 Apple Silicon Mac \u9700\u8981\u7528 Rosetta \u8FD0\u884C Intel \u4E8C\u8FDB\u5236\u65F6\u624B\u52A8\u8C03\u6574\u3002",
  "settings.runtimePlatform.auto": "\u81EA\u52A8\u68C0\u6D4B\uFF08{target}\uFF09",
  "settings.runtime.name": "Word \u5BFC\u51FA\u8FD0\u884C\u65F6",
  "settings.runtime.installingDesc": "\u6B63\u5728\u5B89\u88C5\u8FD0\u884C\u65F6\u3002\u5F53\u524D\u4EFB\u52A1\u5B8C\u6210\u524D\u65E0\u9700\u91CD\u590D\u64CD\u4F5C\u3002",
  "settings.runtime.installing": "\u6B63\u5728\u5B89\u88C5...",
  "settings.runtime.installOrRepair": "\u5B89\u88C5\u6216\u4FEE\u590D",
  "settings.runtime.doctor": "\u73AF\u5883\u81EA\u68C0",
  "exportMode.title": "\u9009\u62E9 Markdown \u2192 Word \u5BFC\u51FA\u6A21\u5F0F",
  "exportMode.desc": "\u6E90 Markdown \u4E0D\u4F1A\u88AB\u4FEE\u6539\u3002\u8BF7\u9009\u62E9\u672C\u6B21\u5BF9 Zotero \u7F3A\u5931\u5F15\u7528\u7684\u5904\u7406\u65B9\u5F0F\u3002",
  "exportMode.strict.name": "\u4E25\u683C\u6A21\u5F0F",
  "exportMode.strict.desc": "\u7528\u4E8E\u81EA\u5DF1\u7684\u8BBA\u6587\uFF1AZotero \u7F3A\u5C11\u4EFB\u4E00 citekey \u5C31\u505C\u6B62\u5BFC\u51FA\u3002",
  "exportMode.strict.action": "\u4F7F\u7528\u4E25\u683C\u6A21\u5F0F",
  "exportMode.compatible.name": "\u517C\u5BB9\u6A21\u5F0F",
  "exportMode.compatible.desc": "\u7528\u4E8E\u5916\u6765 Markdown\uFF1A\u7F3A\u5931 citekey \u4FDD\u7559\u4E3A\u7EA2\u5B57\u9EC4\u5E95\u5360\u4F4D\u7B26\uFF0C\u5E76\u5199\u5165\u65E5\u5FD7\u3002",
  "exportMode.compatible.action": "\u4F7F\u7528\u517C\u5BB9\u6A21\u5F0F",
  "wordSelect.title": "\u6062\u590D Word \u4E2D\u7684\u84DD\u8272 Zotero \u5F15\u6587",
  "wordSelect.desc": "\u8BF7\u5148\u5728 Word \u4E2D\u5B8C\u6210 Zotero Refresh \u5E76\u4FDD\u5B58\u6587\u6863\uFF0C\u6700\u597D\u5173\u95ED\u8BE5\u6587\u6863\u3002\u7A0B\u5E8F\u4F1A\u751F\u6210\u65B0\u526F\u672C\uFF0C\u4E0D\u8986\u76D6\u6E90 Word\uFF1B\u6B63\u6587\u5F15\u6587\u8BBE\u4E3A\u84DD\u8272\uFF0C\u6587\u672B\u53C2\u8003\u6587\u732E\u4FDD\u6301\u9ED1\u8272\u3002",
  "wordSelect.file.name": "\u9009\u62E9 Word \u6587\u4EF6",
  "wordSelect.file.desc": "\u5217\u51FA\u5F53\u524D Markdown \u6240\u5728\u6587\u4EF6\u5939\u4E2D\u7684 .docx\uFF0C\u6700\u8FD1\u4FEE\u6539\u7684\u6392\u5728\u6700\u524D\u3002",
  "wordSelect.action": "\u751F\u6210\u84DD\u8272\u5F15\u6587\u526F\u672C",
  "format.title": "\u8BBE\u7F6E Word \u5BFC\u51FA\u683C\u5F0F",
  "format.intro": "\u4E0D\u4FEE\u6539\u4EFB\u4F55\u9009\u9879\u65F6\u4F7F\u7528\u5F53\u524D\u671F\u520A\u6A21\u677F\uFF08{summary}\uFF09\u3002",
  "format.defaultValue": "\u9ED8\u8BA4\uFF1A{value}",
  "format.figureFlow.name": "\u56FE\u7247\u5206\u9875\u65B9\u5F0F",
  "format.figureFlow.desc": "\u9ED8\u8BA4\u4FDD\u6301 Markdown \u4E2D\u7684\u56FE\u7247\u4F4D\u7F6E\u548C\u56FE\u6587\u987A\u5E8F\uFF1B\u53EA\u6709\u9009\u62E9\u81EA\u52A8\u56DE\u586B\u65F6\uFF0C\u624D\u4F1A\u628A\u56FE\u7247\u540E\u540C\u4E00\u5C0F\u8282\u7684\u8FDE\u7EED\u6B63\u6587\u63D0\u524D\uFF0C\u4EE5\u51CF\u5C11\u5927\u56FE\u6362\u9875\u524D\u7684\u7A7A\u767D\u3002",
  "format.figureFlow.keep": "\u4FDD\u6301\u56FE\u7247\u539F\u4F4D\uFF08\u9ED8\u8BA4\uFF09",
  "format.figureFlow.reflow": "\u81EA\u52A8\u56DE\u586B\u5206\u9875\u7A7A\u767D",
  "format.outputName.name": "Word \u6587\u4EF6\u540D",
  "format.outputName.desc": "\u9ED8\u8BA4\u8BFB\u53D6 Markdown \u7684\u6587\u7AE0\u4E00\u7EA7\u6807\u9898\uFF1B\u53EF\u76F4\u63A5\u4FEE\u6539\uFF0C\u65E0\u9700\u8F93\u5165 .docx\uFF1B\u540C\u540D\u6587\u4EF6\u81EA\u52A8\u6DFB\u52A0\u65F6\u95F4\u6233\u3002",
  "format.outputName.placeholder": "\u8BF7\u8F93\u5165 Word \u6587\u4EF6\u540D",
  "format.outputName.empty": "Word \u6587\u4EF6\u540D\u4E0D\u80FD\u4E3A\u7A7A\u3002",
  "format.outputName.invalidCharacters": 'Word \u6587\u4EF6\u540D\u4E0D\u80FD\u5305\u542B < > : " / \\ | ? * \u7B49\u5B57\u7B26\u3002',
  "format.outputName.trailingCharacter": "Word \u6587\u4EF6\u540D\u4E0D\u80FD\u4EE5\u53E5\u70B9\u6216\u7A7A\u683C\u7ED3\u5C3E\u3002",
  "format.outputName.reserved": "\u201C{name}\u201D\u662F Windows \u4FDD\u7559\u6587\u4EF6\u540D\uFF0C\u8BF7\u66F4\u6362\u3002",
  "format.defaultOutputName": "\u5BFC\u51FA\u6587\u6863",
  "format.preset.name": "\u683C\u5F0F\u65B9\u6848",
  "format.preset.desc": "\u53EF\u8C03\u7528\u4E4B\u524D\u4FDD\u5B58\u7684\u6BD5\u4E1A\u8BBA\u6587\u6216\u5176\u4ED6\u671F\u520A\u65B9\u6848\u3002",
  "format.preset.default": "\u5F53\u524D\u671F\u520A\u6A21\u677F\uFF08\u9ED8\u8BA4\uFF09",
  "format.preset.defaultName": "\u5F53\u524D\u671F\u520A\u6A21\u677F",
  "format.preset.customName": "\u672C\u6B21\u81EA\u5B9A\u4E49",
  "format.template.name": "\u53C2\u8003 Word \u6A21\u677F",
  "format.template.default": "\u9ED8\u8BA4\uFF1A{file}",
  "format.section.body": "\u6B63\u6587\u4E0E\u5B57\u4F53",
  "format.eastAsiaFont.name": "\u4E2D\u6587\u5B57\u4F53",
  "format.eastAsiaFont.default": "\u9ED8\u8BA4\uFF1A{font}",
  "format.westernFont.name": "\u82F1\u6587\u548C\u6570\u5B57\u5B57\u4F53",
  "format.westernFont.default": "\u9ED8\u8BA4\uFF1A{font}",
  "format.bodySize.name": "\u6B63\u6587\u5B57\u53F7",
  "format.bodyLineSpacing.name": "\u6B63\u6587\u884C\u8DDD",
  "format.bodyIndent.name": "\u6B63\u6587\u9996\u884C\u7F29\u8FDB",
  "format.documentLanguage.name": "\u7A3F\u4EF6\u8BED\u8A00",
  "format.documentLanguage.desc": "\u9ED8\u8BA4\u6CBF\u7528\u7B14\u8BB0 lang\uFF1B\u82F1\u6587\u7A3F\u9996\u884C\u7F29\u8FDB\u4E24\u4E2A\u534A\u89D2\u5B57\u7B26\u5BBD\uFF081 em\uFF09\u3001\u5168\u5B57\u4F53\u65B0\u7F57\u9A6C\uFF0C\u4E2D\u6587\u7A3F\u9996\u884C\u7F29\u8FDB\u4E24\u4E2A\u5168\u89D2\u5B57\u5BBD\uFF082 em\uFF09\u3002\u6B63\u6587\u5747\u4E24\u7AEF\u5BF9\u9F50\uFF0C\u53EF\u7EE7\u7EED\u8C03\u6574\u3002",
  "format.documentLanguage.zhCN": "\u4E2D\u6587\u7A3F",
  "format.documentLanguage.en": "\u82F1\u6587\u7A3F",
  "format.section.headings": "\u9898\u76EE\u4E0E\u6807\u9898",
  "format.titleSize.name": "\u6587\u7AE0\u9898\u76EE\u5B57\u53F7\uFF08Markdown #\uFF09",
  "format.titleLineSpacing.name": "\u6587\u7AE0\u9898\u76EE\u884C\u8DDD",
  "format.heading2Size.name": "\u4E00\u7EA7\u8282\u6807\u9898\u5B57\u53F7\uFF08Markdown ##\uFF09",
  "format.heading3Size.name": "\u4E8C\u7EA7\u8282\u6807\u9898\u5B57\u53F7\uFF08Markdown ###\uFF09",
  "format.heading4Size.name": "\u4E09\u7EA7\u8282\u6807\u9898\u5B57\u53F7\uFF08Markdown ####\uFF09",
  "format.headingLineSpacing.name": "\u8282\u6807\u9898\u884C\u8DDD",
  "format.section.tablesCaptionsNotes": "\u8868\u683C\u3001\u56FE\u8868\u9898\u4E0E\u6CE8\u91CA",
  "format.tableSize.name": "\u8868\u683C\u5B57\u53F7\uFF08\u542B\u8868\u5185\u516C\u5F0F\uFF09",
  "format.tableLineSpacing.name": "\u8868\u683C\u884C\u8DDD",
  "format.captionSize.name": "\u56FE\u540D\u3001\u8868\u540D\u5B57\u53F7",
  "format.captionLineSpacing.name": "\u56FE\u540D\u3001\u8868\u540D\u884C\u8DDD",
  "format.noteSize.name": "\u56FE\u6CE8\u3001\u8868\u6CE8\u5B57\u53F7",
  "format.noteLineSpacing.name": "\u56FE\u6CE8\u3001\u8868\u6CE8\u884C\u8DDD",
  "format.formulaSize.name": "\u6B63\u6587\u516C\u5F0F\u5B57\u53F7",
  "format.section.page": "\u9875\u9762",
  "format.margin.name": "A4 \u9875\u8FB9\u8DDD",
  "format.saveName.name": "\u65B9\u6848\u540D\u79F0\uFF08\u53EF\u9009\uFF09",
  "format.saveName.desc": "\u586B\u5199\u540E\u53EF\u4FDD\u5B58\u4E3A\u201C\u6BD5\u4E1A\u8BBA\u6587\u201D\u201C\u67D0\u671F\u520A\u201D\u7B49\u65B9\u6848\u3002",
  "format.saveName.placeholder": "\u4F8B\u5982\uFF1A\u6BD5\u4E1A\u8BBA\u6587",
  "format.saveName.required": "\u8BF7\u5148\u586B\u5199\u683C\u5F0F\u65B9\u6848\u540D\u79F0\uFF0C\u4F8B\u5982\u201C\u6BD5\u4E1A\u8BBA\u6587\u201D\u6216\u671F\u520A\u540D\u79F0\u3002",
  "format.action.useDefault": "\u4F7F\u7528\u9ED8\u8BA4\u6A21\u677F",
  "format.action.saveAndExport": "\u4FDD\u5B58\u65B9\u6848\u5E76\u5BFC\u51FA",
  "format.action.export": "\u6309\u5F53\u524D\u8BBE\u7F6E\u5BFC\u51FA",
  "format.summary": "\u4E2D\u6587 {eastAsiaFont}\uFF1B\u82F1\u6587/\u6570\u5B57 {westernFont}\uFF1B\u6B63\u6587 {bodySize} pt\u3001{bodyLineSpacing} \u500D\u884C\u8DDD\u3001\u9996\u884C {bodyIndent} \u5B57\uFF1B\u8868\u683C {tableSize} pt\u3001{tableLineSpacing} \u500D\u884C\u8DDD\uFF1B\u56FE\u8868\u9898 {captionSize} pt\uFF1B\u56FE\u8868\u6CE8 {noteSize} pt\uFF1BA4 \u56DB\u8FB9 {margin} cm\uFF1B\u56FE\u7247\u5206\u9875\u56DE\u586B {figureReflow}",
  "format.option.size.7_5": "\u516D\u53F7\uFF087.5 pt\uFF09",
  "format.option.size.9": "\u5C0F\u4E94\uFF089 pt\uFF09",
  "format.option.size.10_5": "\u4E94\u53F7\uFF0810.5 pt\uFF09",
  "format.option.size.12": "\u5C0F\u56DB\uFF0812 pt\uFF09",
  "format.option.size.14": "\u56DB\u53F7\uFF0814 pt\uFF09",
  "format.option.size.15": "\u5C0F\u4E09\uFF0815 pt\uFF09",
  "format.option.size.16": "\u4E09\u53F7\uFF0816 pt\uFF09",
  "format.option.size.18": "\u5C0F\u4E8C\uFF0818 pt\uFF09",
  "format.option.size.22": "\u4E8C\u53F7\uFF0822 pt\uFF09",
  "format.option.line.1": "\u5355\u500D\u884C\u8DDD",
  "format.option.line.1_25": "1.25 \u500D\u884C\u8DDD",
  "format.option.line.1_5": "1.5 \u500D\u884C\u8DDD",
  "format.option.line.1_75": "1.75 \u500D\u884C\u8DDD",
  "format.option.line.2": "2 \u500D\u884C\u8DDD",
  "format.option.indent.0": "\u4E0D\u7F29\u8FDB",
  "format.option.indent.1": "\u9996\u884C\u7F29\u8FDB 1 \u5B57",
  "format.option.indent.2": "\u9996\u884C\u7F29\u8FDB 2 \u5B57",
  "format.option.margin.2": "\u56DB\u8FB9 2.00 cm",
  "format.option.margin.2_2": "\u56DB\u8FB9 2.20 cm",
  "format.option.margin.2_54": "\u56DB\u8FB9 2.54 cm",
  "format.option.margin.3": "\u56DB\u8FB9 3.00 cm",
  "progressModal.export.title": "\u6B63\u5728\u5BFC\u51FA Word",
  "progressModal.export.success": "\u5BFC\u51FA\u5B8C\u6210",
  "progressModal.export.failure": "\u5BFC\u51FA\u5931\u8D25",
  "progressModal.recolor.title": "\u6B63\u5728\u6062\u590D Zotero \u5F15\u6587\u989C\u8272",
  "progressModal.recolor.success": "\u5F15\u6587\u7740\u8272\u5B8C\u6210",
  "progressModal.recolor.failure": "\u5F15\u6587\u7740\u8272\u5931\u8D25",
  "progressModal.starting": "\u51C6\u5907\u542F\u52A8\u5BFC\u51FA\u7A0B\u5E8F\u2026",
  "progressModal.processing": "\u6B63\u5728\u5904\u7406\u2026",
  "progressModal.liveProcess": "\u5B9E\u65F6\u8FC7\u7A0B",
  "progressModal.processAria": "Word \u5BFC\u51FA\u5B9E\u65F6\u8FC7\u7A0B\uFF0C\u53EF\u9009\u62E9\u5E76\u590D\u5236",
  "progressModal.copyCurrent": "\u590D\u5236\u5F53\u524D\u8FC7\u7A0B",
  "progressModal.hide": "\u9690\u85CF\u7A97\u53E3",
  "progressModal.noLog": "\u5F53\u524D\u6CA1\u6709\u53EF\u590D\u5236\u7684\u65E5\u5FD7\u5185\u5BB9\u3002",
  "progressModal.copyRejected": "\u7CFB\u7EDF\u62D2\u7EDD\u590D\u5236\u64CD\u4F5C",
  "progressModal.copyFailed": "\u590D\u5236\u5931\u8D25\uFF1A{message}",
  "progressModal.failureLogCopied": "\u9519\u8BEF\u65E5\u5FD7\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\u3002",
  "progressModal.processCopied": "\u5F53\u524D\u5BFC\u51FA\u8FC7\u7A0B\u5DF2\u590D\u5236\u3002",
  "progressModal.logNotFound": "\u672A\u627E\u5230\u9519\u8BEF\u65E5\u5FD7\u6587\u4EF6\u3002",
  "progressModal.openLogFailed": "\u65E0\u6CD5\u6253\u5F00\u9519\u8BEF\u65E5\u5FD7\uFF1A{message}",
  "progressModal.copyProcess": "\u590D\u5236\u8FC7\u7A0B",
  "progressModal.doneAndClose": "\u5B8C\u6210\u5E76\u5173\u95ED",
  "progressModal.errorLog": "\u9519\u8BEF\u65E5\u5FD7\uFF1A{path}",
  "progressModal.copyErrorLog": "\u590D\u5236\u9519\u8BEF\u65E5\u5FD7",
  "progressModal.openLog": "\u6253\u5F00\u65E5\u5FD7\u6587\u4EF6",
  "progressModal.parseEventFailed": "\u65E0\u6CD5\u89E3\u6790\u8FDB\u5EA6\u4E8B\u4EF6\uFF1A{message}",
  "repositoryModal.title": "\u8BBE\u7F6E\u8FD0\u884C\u65F6\u4ED3\u5E93",
  "repositoryModal.desc": "\u63D2\u4EF6\u9700\u8981\u4ECE\u540C\u7248\u672C GitHub Release \u4E0B\u8F7D\u5F53\u524D\u7CFB\u7EDF\u8FD0\u884C\u65F6\u3002\u7C98\u8D34\u4F60\u5728 BRAT \u4E2D\u6DFB\u52A0\u7684\u4ED3\u5E93\u5730\u5740\u3002",
  "repositoryModal.name": "GitHub \u4ED3\u5E93",
  "repositoryModal.format": "\u683C\u5F0F\uFF1Aowner/repository",
  "runtime.compatibility.unsupported": "\u5C1A\u4E0D\u652F\u6301 {platform}/{arch}\u3002",
  "runtime.compatibility.platformMismatch": "\u6240\u9009 {target} \u4E0E\u5F53\u524D\u7CFB\u7EDF {platform}/{arch} \u4E0D\u4E00\u81F4\u3002",
  "runtime.compatibility.archMismatch": "\u6240\u9009 {target} \u4E0E\u5F53\u524D CPU \u67B6\u6784 {arch} \u4E0D\u517C\u5BB9\u3002",
  "runtime.status.noLocalFs": "\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\u3002",
  "runtime.status.incomplete": "{target} \u8FD0\u884C\u65F6\u672A\u5B89\u88C5\u6216\u4E0D\u5B8C\u6574\uFF08\u7F3A\u5C11 {count} \u4E2A\u6587\u4EF6\uFF09\u3002",
  "runtime.status.versionMismatch": "\u8FD0\u884C\u65F6\u7248\u672C {runtimeVersion} \u4E0E\u63D2\u4EF6\u7248\u672C {pluginVersion} \u4E0D\u4E00\u81F4\u3002",
  "runtime.status.platformMismatch": "\u5DF2\u5B89\u88C5\u8FD0\u884C\u65F6\u4E3A {installed}\uFF0C\u5F53\u524D\u9700\u8981 {required}\u3002",
  "runtime.status.installed": "\u5DF2\u5B89\u88C5 {target} \u8FD0\u884C\u65F6 {version}\u3002",
  "runtime.status.manifestDamaged": "\u8FD0\u884C\u65F6\u6E05\u5355\u635F\u574F\uFF1A{message}",
  "runtime.install.duplicate": "Word \u5BFC\u51FA\u8FD0\u884C\u65F6\u6B63\u5728\u5B89\u88C5\uFF0C\u8BF7\u7B49\u5F85\u5F53\u524D\u4EFB\u52A1\u5B8C\u6210\uFF0C\u65E0\u9700\u91CD\u590D\u70B9\u51FB\u3002",
  "runtime.install.cannotInstall": "\u65E0\u6CD5\u5B89\u88C5\u8FD0\u884C\u65F6\uFF1A{message}",
  "runtime.install.noLocalFs": "\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u5B89\u88C5\u8FD0\u884C\u65F6\u3002",
  "runtime.install.cancelled": "\u5DF2\u53D6\u6D88\u8FD0\u884C\u65F6\u5B89\u88C5\u3002",
  "runtime.install.invalidRepository": "GitHub \u4ED3\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5E94\u4E3A owner/repository\u3002",
  "runtime.install.saveRepositoryFailed": "\u65E0\u6CD5\u4FDD\u5B58\u8FD0\u884C\u65F6\u4ED3\u5E93\u8BBE\u7F6E\uFF1A{message}",
  "runtime.install.stage.prepare": "\u51C6\u5907\u5B89\u88C5\u8FD0\u884C\u65F6",
  "runtime.install.stage.download": "\u6B63\u5728\u4E0B\u8F7D {target} Word \u5BFC\u51FA\u8FD0\u884C\u65F6 {version}",
  "runtime.install.detail.download": "\u5B89\u88C5\u5305\u7EA6 {size}\uFF0CGitHub \u7F51\u7EDC\u8F83\u6162\u65F6\u53EF\u80FD\u9700\u8981\u6570\u5206\u949F\u3002",
  "runtime.install.progress": "{stage}\n\u5DF2\u7528\u65F6 {elapsed}\u3002{detail}",
  "runtime.install.timeout": "\u4E0B\u8F7D\u8BF7\u6C42\u672A\u5728 {seconds} \u79D2\u5185\u5B8C\u6210\uFF0C\u5DF2\u505C\u6B62\u7B49\u5F85\u3002\u8BF7\u68C0\u67E5 GitHub \u7F51\u7EDC\u540E\u91CD\u8BD5\u3002",
  "runtime.install.httpError": "GitHub Release \u8FD4\u56DE HTTP {status}\uFF0C\u8BF7\u786E\u8BA4 {version} \u5DF2\u53D1\u5E03\u4E14\u5305\u542B {asset}",
  "runtime.install.stage.validateDownload": "\u6B63\u5728\u6821\u9A8C\u4E0B\u8F7D\u5185\u5BB9",
  "runtime.install.detail.validateDownload": "\u6B63\u5728\u786E\u8BA4 ZIP \u683C\u5F0F\u3001\u672C\u5730\u5199\u5165\u5927\u5C0F\u548C SHA-256\u3002",
  "runtime.install.archiveMissing": "\u8FD0\u884C\u65F6 ZIP \u5728\u89E3\u538B\u524D\u4E22\u5931\u6216\u5927\u5C0F\u53D1\u751F\u53D8\u5316",
  "runtime.install.stage.extract": "\u4E0B\u8F7D\u5B8C\u6210\uFF08{size}\uFF09\uFF0C\u6B63\u5728\u89E3\u538B",
  "runtime.install.detail.extract": "\u8BF7\u4FDD\u6301 Obsidian \u8FD0\u884C\u3002",
  "runtime.install.extractFailed": "\u89E3\u538B\u8FD0\u884C\u65F6\u5931\u8D25\uFF1A{code}",
  "runtime.install.stage.validatePackage": "\u6B63\u5728\u6821\u9A8C\u8FD0\u884C\u65F6\u5305",
  "runtime.install.detail.validatePackage": "\u6B63\u5728\u68C0\u67E5\u7248\u672C\u548C CPU \u5E73\u53F0\u3002",
  "runtime.install.manifestMissing": "\u8FD0\u884C\u65F6\u5305\u7F3A\u5C11 runtime/runtime-manifest.json",
  "runtime.install.packageMismatch": "\u8FD0\u884C\u65F6\u5305\u4E0D\u5339\u914D\uFF1A\u7248\u672C {version}\uFF0C\u5E73\u53F0 {platform}",
  "runtime.install.stage.replace": "\u6B63\u5728\u66FF\u6362\u65E7\u8FD0\u884C\u65F6",
  "runtime.install.detail.replace": "\u539F\u8FD0\u884C\u65F6\u4F1A\u5148\u5907\u4EFD\uFF0C\u5931\u8D25\u65F6\u81EA\u52A8\u6062\u590D\u3002",
  "runtime.install.stage.configurePython": "\u6B63\u5728\u914D\u7F6E\u79C1\u6709 Python \u73AF\u5883",
  "runtime.install.detail.configurePython": "\u9996\u6B21\u521B\u5EFA\u865A\u62DF\u73AF\u5883\u6216\u8BBF\u95EE PyPI \u65F6\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F\u3002",
  "runtime.install.pythonFailed": "Python \u73AF\u5883\u5B89\u88C5\u5931\u8D25\uFF1A{code}",
  "runtime.install.stage.doctor": "\u6B63\u5728\u6267\u884C\u6700\u7EC8\u73AF\u5883\u81EA\u68C0",
  "runtime.install.detail.doctor": "\u5373\u5C06\u5B8C\u6210\u5B89\u88C5\u3002",
  "runtime.install.complete": "Word \u5BFC\u51FA\u8FD0\u884C\u65F6\u5B89\u88C5\u5B8C\u6210\uFF1A{status}",
  "runtime.install.backupMissing": "\u65E7\u8FD0\u884C\u65F6\u5907\u4EFD\u4E0D\u5B58\u5728",
  "runtime.install.restoreFailed": "\u81EA\u52A8\u6062\u590D\u65E7\u8FD0\u884C\u65F6\u5931\u8D25\uFF1A{message}",
  "runtime.install.networkHint": "\u8BF7\u786E\u8BA4\u6D4F\u89C8\u5668\u80FD\u6253\u5F00\u8BE5\u7248\u672C\u7684 GitHub Release\uFF0C\u7F51\u7EDC\u6062\u590D\u540E\u91CD\u8BD5\u3002",
  "runtime.install.retryHint": "\u8BF7\u91CD\u65B0\u6267\u884C\u201C\u5B89\u88C5\u6216\u4FEE\u590D\u201D\uFF1B\u82E5\u4ECD\u5931\u8D25\uFF0C\u8FD0\u884C\u73AF\u5883\u81EA\u68C0\u5E76\u67E5\u770B\u6545\u969C\u6392\u67E5\u6587\u6863\u3002",
  "runtime.install.backupRetained": "\u65E7\u8FD0\u884C\u65F6\u5907\u4EFD\u4FDD\u7559\u5728\uFF1A{path}\u3002",
  "runtime.install.cleanupIncomplete": "\u81EA\u52A8\u6E05\u7406\u5931\u8D25\u7684\u65B0\u8FD0\u884C\u65F6\u672A\u5B8C\u6210\uFF0C\u8BF7\u5B8C\u5168\u9000\u51FA Obsidian \u540E\u518D\u4FEE\u590D\u3002",
  "runtime.install.failed": "\u8FD0\u884C\u65F6\u5B89\u88C5\u5931\u8D25\uFF08{stage}\uFF09\uFF1A{message}\u3002{hint}{recovery}",
  "runtime.install.cleanupFailed": "\u8FD0\u884C\u65F6\u5B89\u88C5\u5DF2\u7ED3\u675F\uFF0C\u4F46\u4E34\u65F6\u76EE\u5F55\u6E05\u7406\u5931\u8D25\uFF1A{message}",
  "runtime.install.lockCleanupFailed": "\u8FD0\u884C\u65F6\u5B89\u88C5\u9501\u6E05\u7406\u5931\u8D25\uFF1A{message}",
  "runtime.install.busy": "\u68C0\u6D4B\u5230\u53E6\u4E00\u4E2A\u8FD0\u884C\u65F6\u5B89\u88C5\u4EFB\u52A1\u4ECD\u5728\u6267\u884C\uFF0C\u8BF7\u7B49\u5F85\u5176\u5B8C\u6210\u540E\u518D\u8BD5",
  "runtime.install.archiveEmpty": "\u4E0B\u8F7D\u6587\u4EF6\u4E3A\u7A7A\u6216\u4E0D\u5B8C\u6574",
  "runtime.install.archiveNotZip": "GitHub \u8FD4\u56DE\u7684\u5185\u5BB9\u4E0D\u662F ZIP\uFF0C\u53EF\u80FD\u88AB\u7F51\u7EDC\u4EE3\u7406\u6216\u767B\u5F55\u9875\u9762\u66FF\u6362",
  "runtime.install.archiveWriteIncomplete": "\u8FD0\u884C\u65F6 ZIP \u5199\u5165\u4E0D\u5B8C\u6574\uFF1A\u5E94\u4E3A {expected} \u5B57\u8282\uFF0C\u5B9E\u9645\u4E3A {actual} \u5B57\u8282",
  "runtime.doctor.notReady": "\u73AF\u5883\u81EA\u68C0\u672A\u901A\u8FC7\uFF1A{status}",
  "runtime.doctor.missing": "\u8DE8\u5E73\u53F0\u73AF\u5883\u81EA\u68C0\u7A0B\u5E8F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u3002",
  "runtime.doctor.passed": "\u73AF\u5883\u81EA\u68C0\u901A\u8FC7\uFF1A{summary}",
  "runtime.doctor.failed": "\u73AF\u5883\u81EA\u68C0\u5931\u8D25\uFF1A{summary}",
  "runtimeDownload.title": "\u4E0B\u8F7D Word \u5BFC\u51FA\u8FD0\u884C\u65F6",
  "runtimeDownload.language": "\u754C\u9762\u8BED\u8A00 / Interface language",
  "runtimeDownload.elapsed": "\u5DF2\u7528\u65F6 {elapsed}",
  "runtimeDownload.preparing": "\u6B63\u5728\u51C6\u5907\u4E0B\u8F7D",
  "runtimeDownload.checksum": "\u6B63\u5728\u83B7\u53D6 SHA-256 \u6821\u9A8C\u503C",
  "runtimeDownload.downloading": "\u6B63\u5728\u4E0B\u8F7D {file}",
  "runtimeDownload.progressKnown": "{downloaded} / {total} \xB7 {percent}% \xB7 {speed} \xB7 \u9884\u8BA1\u5269\u4F59 {eta}",
  "runtimeDownload.progressKnownCalculating": "{downloaded} / {total} \xB7 {percent}% \xB7 {speed} \xB7 \u6B63\u5728\u4F30\u7B97\u5269\u4F59\u65F6\u95F4",
  "runtimeDownload.progressUnknown": "\u5DF2\u4E0B\u8F7D {downloaded} \xB7 {speed} \xB7 \u6B63\u5728\u4F30\u7B97\u5269\u4F59\u65F6\u95F4",
  "runtimeDownload.verifying": "\u6B63\u5728\u9A8C\u8BC1 SHA-256",
  "runtimeDownload.cancel": "\u53D6\u6D88\u4E0B\u8F7D",
  "runtimeDownload.retry": "\u91CD\u8BD5",
  "runtimeDownload.hide": "\u540E\u53F0\u7EE7\u7EED",
  "runtimeDownload.retrying": "\u4E34\u65F6\u7F51\u7EDC\u9519\u8BEF\uFF0C\u6B63\u5728\u8FDB\u884C\u7B2C {attempt}/{max} \u6B21\u4E0B\u8F7D\u5C1D\u8BD5\u2026",
  "runtimeDownload.cancelled": "\u4E0B\u8F7D\u5DF2\u53D6\u6D88\u3002",
  "runtimeDownload.failed": "\u4E0B\u8F7D\u5931\u8D25\uFF1A{message}",
  "runtimeDownload.networkError": "\u4E0E GitHub \u7684\u8FDE\u63A5\u4E2D\u65AD\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u4EE3\u7406\u540E\u91CD\u8BD5\u3002",
  "runtimeDownload.checksumError": "\u65E0\u6CD5\u8BFB\u53D6\u5F53\u524D\u8FD0\u884C\u65F6\u8D44\u4EA7\u7684\u6709\u6548 SHA-256 \u6821\u9A8C\u503C\u3002",
  "runtimeDownload.fileError": "\u65E0\u6CD5\u5199\u5165\u8FD0\u884C\u65F6\u4E34\u65F6\u4E0B\u8F7D\u6587\u4EF6\u3002",
  "runtimeDownload.partExists": "\u68C0\u6D4B\u5230\u4E0A\u6B21\u9057\u7559\u7684\u4E34\u65F6\u4E0B\u8F7D\u6587\u4EF6\uFF0C\u8BF7\u91CD\u542F Obsidian \u540E\u91CD\u8BD5\u3002",
  "runtimeDownload.responseIncomplete": "\u4E0B\u8F7D\u63D0\u524D\u7ED3\u675F\uFF0C\u6536\u5230\u7684\u5B57\u8282\u6570\u4E0D\u5B8C\u6574\u3002",
  "runtimeDownload.unknownError": "\u8FD0\u884C\u65F6\u4E0B\u8F7D\u672A\u5B8C\u6210\u3002",
  "runtimeDownload.shaMismatch": "SHA-256 \u6821\u9A8C\u5931\u8D25\uFF0C\u4E0B\u8F7D\u5185\u5BB9\u53EF\u80FD\u4E0D\u5B8C\u6574\u6216\u5DF2\u88AB\u66FF\u6362\u3002",
  "runtimeDownload.shaPassed": "SHA-256 \u6821\u9A8C\u901A\u8FC7\u3002",
  "runtimeDownload.complete": "\u4E0B\u8F7D\u5B8C\u6210\uFF0C\u6B63\u5728\u7EE7\u7EED\u5B89\u88C5\u3002",
  "recolor.noLocalFs": "\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u5904\u7406 Word\u3002",
  "recolor.runtimeUnavailable": "\u8FD0\u884C\u65F6\u4ECD\u4E0D\u53EF\u7528\uFF1A{status}",
  "recolor.toolMissing": "\u672A\u627E\u5230 Zotero \u5F15\u6587\u7740\u8272\u7A0B\u5E8F\uFF0C\u8BF7\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u3002",
  "recolor.readFolderFailed": "\u65E0\u6CD5\u8BFB\u53D6\u5F53\u524D\u6587\u4EF6\u5939\u4E2D\u7684 Word\uFF1A{message}",
  "recolor.noFiles": "\u5F53\u524D Markdown \u6240\u5728\u6587\u4EF6\u5939\u4E2D\u6CA1\u6709\u53EF\u5904\u7406\u7684 .docx \u6587\u4EF6\u3002",
  "recolor.cancelled": "\u5DF2\u53D6\u6D88 Zotero \u5F15\u6587\u7740\u8272\u3002",
  "recolor.fileMissing": "\u6240\u9009 Word \u5DF2\u4E0D\u5B58\u5728\uFF1A{path}",
  "recolor.launchStage": "\u542F\u52A8\u5F15\u6587\u7740\u8272\u7A0B\u5E8F",
  "recolor.launchDetail": "\u6E90 Word \u4E0D\u8986\u76D6\uFF1BZotero \u57DF\u4FDD\u6301\u53EF\u5237\u65B0",
  "recolor.launchFailed": "\u542F\u52A8\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF1A{message}",
  "recolor.completed": "Zotero \u5F15\u6587\u5DF2\u6062\u590D\u4E3A\u84DD\u8272\uFF1A{file}",
  "recolor.failedWithDetails": "\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF08{code}\uFF09\uFF1A{details}",
  "recolor.failedWithCode": "\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF0C\u9000\u51FA\u4EE3\u7801 {code}\u3002",
  "recolor.running": "\u6B63\u5728\u751F\u6210\u84DD\u8272\u5F15\u6587\u526F\u672C\uFF1A{file}",
  "export.cancelled": "\u5DF2\u53D6\u6D88 Word \u5BFC\u51FA\u3002",
  "export.noLocalFs": "\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u542F\u52A8\u672C\u5730\u5BFC\u51FA\u7A0B\u5E8F\u3002",
  "export.readMarkdownFailed": "\u65E0\u6CD5\u8BFB\u53D6\u5F53\u524D Markdown\uFF1A{message}",
  "export.runtimeUnavailable": "\u8FD0\u884C\u65F6\u4ECD\u4E0D\u53EF\u7528\uFF1A{status}",
  "export.templateDirectoryFailed": "\u65E0\u6CD5\u521B\u5EFA\u7528\u6237\u6A21\u677F\u76EE\u5F55\u3002",
  "export.pythonMissing": "\u672A\u627E\u5230\u5F53\u524D\u7CFB\u7EDF\u7684 Python \u5BFC\u51FA\u7A0B\u5E8F\uFF0C\u8BF7\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u3002",
  "export.readTemplatesFailed": "\u65E0\u6CD5\u8BFB\u53D6 Word \u6A21\u677F\u76EE\u5F55\uFF1A{message}",
  "export.noTemplates": "Word \u6A21\u677F\u76EE\u5F55\u4E2D\u6CA1\u6709 .docx \u6587\u4EF6\uFF1A{path}",
  "export.templateMissing": "\u672A\u627E\u5230\u6240\u9009 Word \u6A21\u677F\uFF1A{path}",
  "export.presetSaved": "\u5DF2\u4FDD\u5B58\u683C\u5F0F\u65B9\u6848\uFF1A{name}",
  "export.outputRenamed": "\u540C\u540D Word \u5DF2\u5B58\u5728\uFF0C\u539F\u6587\u4EF6\u4FDD\u6301\u4E0D\u53D8\uFF1B\u672C\u6B21\u53E6\u5B58\u4E3A\uFF1A{file}",
  "export.launchStage": "\u542F\u52A8\u5BFC\u51FA\u7A0B\u5E8F",
  "export.launchDetail": "{mode} \xB7 {format}",
  "export.launchFailed": "\u542F\u52A8 Word \u5BFC\u51FA\u5931\u8D25\uFF1A{message}",
  "export.completed": "Word \u5BFC\u51FA\u5B8C\u6210\uFF1A{file}",
  "export.failedWithDetails": "Word \u5BFC\u51FA\u5931\u8D25\uFF08{code}\uFF09\uFF1A{details}",
  "export.failedWithCode": "Word \u5BFC\u51FA\u5931\u8D25\uFF0C\u9000\u51FA\u4EE3\u7801 {code}\u3002",
  "export.running": "\u6B63\u5728\u5BFC\u51FA\uFF08{mode}\uFF5C{format}\uFF09\uFF1A{file}",
  "export.mode.strict": "\u4E25\u683C\u6A21\u5F0F",
  "export.mode.compatible": "\u517C\u5BB9\u6A21\u5F0F",
  "progress.export.init": "\u521D\u59CB\u5316\u5BFC\u51FA\u73AF\u5883",
  "progress.export.readMarkdown": "\u8BFB\u53D6 Markdown",
  "progress.export.normalizeMarkdown": "\u89C4\u8303\u5316 Markdown",
  "progress.export.normalizeMarkdownDetail": "\u6807\u9898\u3001\u56FE\u7247\u3001\u5F15\u7528\u95F4\u8DDD\u4E0E\u516C\u5F0F\u6807\u7B7E",
  "progress.export.parseDocument": "\u89E3\u6790\u6587\u6863\u7ED3\u6784",
  "progress.export.parseDocumentDetail": "\u626B\u63CF\u56FE\u7247\u3001\u8868\u683C\u3001\u516C\u5F0F\u548C\u5F15\u7528",
  "progress.export.checkResources": "\u68C0\u67E5\u6587\u6863\u8D44\u6E90",
  "progress.export.checkResourcesDetail": "\u56FE\u7247 {images}\uFF1B\u8868\u683C {tables}\uFF1B\u516C\u5F0F {equations}",
  "progress.export.checkCitations": "\u68C0\u67E5 Zotero \u5F15\u7528",
  "progress.export.checkCitationsDetail": "citekey {count}",
  "progress.export.preflight": "\u9884\u68C0\u5B8C\u6210",
  "progress.export.preflightDetail": "\u6A21\u5F0F {mode}\uFF1B\u7F3A\u5931 citekey {missing}",
  "progress.export.generateDraft": "\u751F\u6210 Word \u521D\u7A3F",
  "progress.export.generateDraftDetail": "\u8FD0\u884C Pandoc \u4E0E pandoc-crossref",
  "progress.export.draftReady": "Word \u521D\u7A3F\u5DF2\u751F\u6210",
  "progress.export.formatDocument": "\u5904\u7406 Word \u683C\u5F0F",
  "progress.export.formatDocumentDetail": "\u5B57\u4F53\u3001\u4E0A\u4E0B\u6807\u3001\u516C\u5F0F\u3001\u56FE\u8868\u548C Zotero \u57DF",
  "progress.export.validateDocument": "\u81EA\u52A8\u68C0\u67E5 Word",
  "progress.export.validateDocumentDetail": "\u56FE\u7247\u5206\u9875\u56DE\u586B {reflowed} \u5904\uFF1B\u7ED3\u6784\u3001\u7F16\u53F7\u3001\u5F15\u7528\u57DF\u4E0E\u683C\u5F0F\u5747\u5DF2\u68C0\u67E5",
  "progress.export.verifySource": "\u786E\u8BA4\u6E90\u6587\u4EF6",
  "progress.export.verifySourceDetail": "\u68C0\u67E5\u5BFC\u51FA\u671F\u95F4 Markdown \u662F\u5426\u53D1\u751F\u53D8\u5316",
  "progress.export.openWord": "\u6B63\u5728\u6253\u5F00 Word",
  "progress.export.complete": "\u5BFC\u51FA\u5B8C\u6210",
  "progress.export.failed": "\u5BFC\u51FA\u5931\u8D25",
  "progress.export.cancelled": "\u5DF2\u53D6\u6D88",
  "progress.export.cancelledDetail": "\u7528\u6237\u4E2D\u6B62\u5BFC\u51FA",
  "progress.recolor.init": "\u521D\u59CB\u5316\u5F15\u6587\u7740\u8272",
  "progress.recolor.readWord": "\u8BFB\u53D6 Word",
  "progress.recolor.detectFields": "\u8BC6\u522B Zotero \u57DF",
  "progress.recolor.detectFieldsDetail": "\u6B63\u6587\u5F15\u6587\u4E0E\u6587\u672B\u53C2\u8003\u6587\u732E",
  "progress.recolor.checkColors": "\u68C0\u67E5\u5F15\u6587\u989C\u8272",
  "progress.recolor.checkColorsDetail": "\u6B63\u6587\u5F15\u6587\u57DF {citations}\uFF1B\u53C2\u8003\u6587\u732E\u57DF {bibliography}",
  "progress.recolor.openWord": "\u6B63\u5728\u6253\u5F00 Word",
  "progress.recolor.complete": "\u5F15\u6587\u7740\u8272\u5B8C\u6210",
  "progress.recolor.failed": "\u5F15\u6587\u7740\u8272\u5931\u8D25",
  "progress.recolor.cancelled": "\u5DF2\u53D6\u6D88",
  "progress.recolor.cancelledDetail": "\u7528\u6237\u4E2D\u6B62\u5F15\u6587\u7740\u8272",
  "format.citationStyle.name": "\u5F15\u7528\u6837\u5F0F\uFF08Zotero\uFF09",
  "format.citationStyle.desc": "\u8BFB\u53D6\u672C\u673A Zotero \u5DF2\u5B89\u88C5\u6837\u5F0F\uFF0C\u4EC5\u7528\u4E8E\u672C\u6B21\u5BFC\u51FA\uFF1BWord \u4E2D\u4ECD\u53EF\u5237\u65B0\u548C\u66F4\u6362\u6837\u5F0F\u3002",
  "format.citationStyle.empty": "\u672A\u627E\u5230\u672C\u673A Zotero \u6837\u5F0F\uFF1B\u53EF\u5B89\u88C5\u6837\u5F0F\u540E\u91CD\u65B0\u8BFB\u53D6\uFF0C\u6216\u6CBF\u7528\u7A3F\u4EF6\u8BBE\u7F6E\u3002",
  "format.citationStyle.follow": "\u6CBF\u7528\u7A3F\u4EF6\u8BBE\u7F6E",
  "format.citationStyle.refresh": "\u91CD\u65B0\u8BFB\u53D6",
  "format.citationStyle.parentMissing": "\u6B64\u6837\u5F0F\u7F3A\u5C11\u672C\u673A\u7236\u6837\u5F0F\u3002\u8BF7\u6539\u7528 Word \u624B\u52A8\u5237\u65B0\uFF0C\u6216\u5148\u5728 Zotero \u4E2D\u91CD\u88C5\u8BE5\u6837\u5F0F\u3002",
  "format.citationDisplay.name": "\u5F15\u7528\u521D\u59CB\u663E\u793A",
  "format.citationDisplay.desc": "\u4E24\u79CD\u65B9\u5F0F\u5747\u4FDD\u7559 Zotero \u5F15\u7528\u57DF\u3002\u63D0\u524D\u751F\u6210\u53EA\u586B\u5145\u521D\u59CB\u663E\u793A\uFF1B\u4E0D\u517C\u5BB9\u7684\u6837\u5F0F\u5C06\u4FDD\u7559\u63D0\u793A\uFF0C\u4EA4\u7531 Word \u4E2D\u7684 Zotero \u5237\u65B0\u3002",
  "progress.export.citationFallback": "\u5F15\u7528\u6539\u7531 Word \u4E2D\u7684 Zotero \u5237\u65B0",
  "format.citationDisplay.manual": "\u5728 Word \u4E2D\u624B\u52A8\u5237\u65B0",
  "format.citationDisplay.rendered": "\u5BFC\u51FA\u65F6\u5148\u751F\u6210\u53EF\u8BFB\u5F15\u7528\uFF08\u9ED8\u8BA4\uFF09"
};

// src/i18n.ts
var DEFAULT_LANGUAGE = "zh-CN";
var dictionaries = {
  "zh-CN": zhCN,
  en
};
function callDetector(detector) {
  if (!detector) {
    return null;
  }
  try {
    const value = detector();
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}
function normalizeLocaleMode(value) {
  return value === "system" || value === "zh-CN" || value === "en" ? value : "system";
}
function normalizeLanguage(value) {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().replace(/_/g, "-").toLowerCase();
  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }
  if (normalized === "zh" || normalized.startsWith("zh-")) {
    return "zh-CN";
  }
  return null;
}
function resolveLanguage(mode = "system", detectors = {}) {
  if (mode === "zh-CN" || mode === "en") {
    return mode;
  }
  const publicLanguage = normalizeLanguage(
    callDetector(detectors.getLanguage)
  );
  if (publicLanguage) {
    return publicLanguage;
  }
  const momentLanguage = normalizeLanguage(
    callDetector(detectors.getMomentLocale)
  );
  return momentLanguage || DEFAULT_LANGUAGE;
}
function hasTranslationKey(key) {
  return Object.prototype.hasOwnProperty.call(zhCN, key);
}
function interpolate(template, params = {}) {
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9_]*)\}/g,
    (match, name) => {
      if (!Object.prototype.hasOwnProperty.call(params, name)) {
        return match;
      }
      const value = params[name];
      return value === null || value === void 0 ? "" : String(value);
    }
  );
}
function translate(language, key, params) {
  const template = dictionaries[language][key] || zhCN[key] || key;
  return interpolate(template, params);
}
function translateDynamic(language, key, params) {
  if (!hasTranslationKey(key)) {
    return key;
  }
  return translate(language, key, params);
}
function createTranslator(language) {
  return (key, params) => translate(language, key, params);
}

// src/obsidian-buffered-request.ts
var import_obsidian = require("obsidian");
var obsidianBufferedRequest = async ({
  url,
  headers
}) => {
  const response = await (0, import_obsidian.requestUrl)({
    url,
    method: "GET",
    headers: { ...headers },
    throw: false
  });
  const normalizedHeaders = {};
  for (const [key, value] of Object.entries(response.headers || {})) {
    const rawValue = value;
    normalizedHeaders[key.toLowerCase()] = Array.isArray(rawValue) ? rawValue.join(", ") : String(rawValue ?? "");
  }
  return {
    status: response.status,
    headers: normalizedHeaders,
    body: response.arrayBuffer
  };
};

// src/zotero-styles.ts
var fs2 = __toESM(require("node:fs/promises"), 1);
var path2 = __toESM(require("node:path"), 1);
var os = __toESM(require("node:os"), 1);
function xmlText(value) {
  return value.replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos);/gi, (_, number, name) => {
    if (number) return String.fromCodePoint(number[0].toLowerCase() === "x" ? parseInt(number.slice(1), 16) : Number(number));
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[name.toLowerCase()];
  });
}
function styleMetadata(xml, file) {
  const info = xml.replace(/<!--[\s\S]*?-->/g, "").match(/<info\b[^>]*>([\s\S]*?)<\/info>/)?.[1];
  if (!info) return null;
  const id = xmlText(info.match(/<id\b[^>]*>([^<]+)<\/id>/)?.[1]?.trim() || "");
  const title = xmlText(info.match(/<title\b[^>]*>([^<]+)<\/title>/)?.[1]?.trim() || "");
  if (!/^https?:\/\/\S+$/.test(id) || !title) return null;
  const parentLink = [...info.matchAll(/<link\b([^>]+)\/?\s*>/g)].find((match) => /\brel\s*=\s*["']independent-parent["']/.test(match[1]));
  const parent = parentLink ? xmlText(parentLink[1].match(/\bhref\s*=\s*["']([^"']+)["']/)?.[1] || "") : "";
  const locale = xml.match(/<style\b[^>]*\bdefault-locale\s*=\s*["']([^"']+)["']/)?.[1] || "";
  return { id, title, path: file, parent, locale };
}
async function discoverZoteroStyles(home = os.homedir(), environment = process.env) {
  const profiles = [path2.join(home, ".zotero", "zotero"), path2.join(home, "Library", "Application Support", "Zotero")];
  if (environment.APPDATA) profiles.unshift(path2.join(environment.APPDATA, "Zotero", "Zotero"));
  const directories = /* @__PURE__ */ new Set([path2.join(home, "Zotero", "styles")]);
  for (const base of profiles) {
    try {
      const ini = await fs2.readFile(path2.join(base, "profiles.ini"), "utf8");
      for (const section of ini.split(/\r?\n\s*\[/)) {
        const profile = section.match(/^Path=(.+)$/m)?.[1]?.trim();
        if (!profile) continue;
        const absolute = /^IsRelative=0\s*$/m.test(section) ? profile : path2.resolve(base, profile);
        const prefs = await fs2.readFile(path2.join(absolute, "prefs.js"), "utf8");
        const raw = prefs.match(/user_pref\("extensions\.zotero\.dataDir",\s*("(?:\\.|[^"\\])*")\s*\)/)?.[1];
        if (raw && !/user_pref\("extensions\.zotero\.useDataDir",\s*false\s*\)/.test(prefs)) directories.add(path2.join(JSON.parse(raw), "styles"));
      }
    } catch {
    }
  }
  const records = [];
  const scanned = [];
  for (const directory of directories) {
    for (const folder of [directory, path2.join(directory, "hidden")]) {
      try {
        const files = (await fs2.readdir(folder)).filter((file) => file.toLowerCase().endsWith(".csl"));
        scanned.push(folder);
        const results = await Promise.all(files.map(async (file) => {
          try {
            const full = path2.join(folder, file);
            return styleMetadata(await fs2.readFile(full, "utf8"), full);
          } catch {
            return null;
          }
        }));
        records.push(...results.filter(Boolean).map((record) => ({ ...record, hidden: folder !== directory })));
      } catch {
      }
    }
  }
  const byId = new Map(records.map((record) => [record.id, record]));
  const styles = records.filter((record) => !record.hidden).map((record) => {
    let resolved = record;
    const seen = /* @__PURE__ */ new Set([record.id]);
    while (resolved.parent && byId.has(resolved.parent) && !seen.has(resolved.parent)) {
      seen.add(resolved.parent);
      resolved = byId.get(resolved.parent);
    }
    return { ...record, renderPath: resolved.parent ? "" : resolved.path };
  });
  return { styles: [...new Map(styles.map((style) => [style.id, style])).values()].sort((a, b) => a.title.localeCompare(b.title)), directories: scanned };
}

// src/main.ts
var PLUGIN_VERSION = "1.6.0";
var RUNTIME_MANIFEST = "runtime-manifest.json";
var PROGRESS_PREFIX = "@@MD_EXPORT_PROGRESS@@";
var RUNTIME_DOWNLOAD_MAX_ATTEMPTS = 3;
var RUNTIME_INSTALL_REGISTRY_KEY = Symbol.for(
  "md-export-word.runtime-install-registry"
);
var LOCALIZED_COMMAND_IDS = Object.freeze([
  "export-current-markdown-to-word",
  "export-current-markdown-to-word-with-figure-reflow",
  "reapply-blue-zotero-citations",
  "install-or-repair-runtime",
  "check-runtime"
]);
var RUNTIME_TARGETS = Object.freeze({
  "windows-x64": {
    id: "windows-x64",
    label: "Windows x64",
    nodePlatform: "win32",
    nodeArch: "x64",
    asset: "md-export-word-runtime-windows-x64.zip",
    sizeHint: "64 MB",
    pandocFile: "pandoc.exe",
    crossrefFile: "pandoc-crossref.exe",
    pythonParts: [".venv", "Scripts", "python.exe"]
  },
  "macos-arm64": {
    id: "macos-arm64",
    label: "macOS Apple Silicon",
    nodePlatform: "darwin",
    nodeArch: "arm64",
    asset: "md-export-word-runtime-macos-arm64.zip",
    sizeHint: "73 MB",
    pandocFile: "pandoc",
    crossrefFile: "pandoc-crossref",
    pythonParts: [".venv", "bin", "python"]
  },
  "macos-x64": {
    id: "macos-x64",
    label: "macOS Intel",
    nodePlatform: "darwin",
    nodeArch: "x64",
    asset: "md-export-word-runtime-macos-x64.zip",
    sizeHint: "34 MB",
    pandocFile: "pandoc",
    crossrefFile: "pandoc-crossref",
    pythonParts: [".venv", "bin", "python"]
  }
});
var DEFAULT_TEMPLATE_FILE = "\u5BFC\u51FA\u683C\u5F0F\u6A21\u677F.docx";
var DEFAULT_FORMAT = Object.freeze({
  preset_name: "\u5F53\u524D\u671F\u520A\u6A21\u677F",
  document_language: "zh-CN",
  east_asia_font: "\u5B8B\u4F53",
  western_font: "Times New Roman",
  body_size_pt: 12,
  body_line_spacing: 1.5,
  body_first_line_chars: 2,
  title_size_pt: 16,
  title_line_spacing: 1.5,
  heading2_size_pt: 14,
  heading3_size_pt: 12,
  heading4_size_pt: 12,
  heading_line_spacing: 1.5,
  table_size_pt: 7.5,
  table_line_spacing: 1,
  caption_size_pt: 10.5,
  caption_line_spacing: 1,
  note_size_pt: 7.5,
  note_line_spacing: 1,
  formula_size_pt: 12,
  margin_cm: 2.54,
  figure_reflow: false
});
var DEFAULT_TRANSLATOR = createTranslator("zh-CN");
function localizedFormatOptions(t) {
  return {
    sizes: {
      "7.5": t("format.option.size.7_5"),
      "9": t("format.option.size.9"),
      "10.5": t("format.option.size.10_5"),
      "12": t("format.option.size.12"),
      "14": t("format.option.size.14"),
      "15": t("format.option.size.15"),
      "16": t("format.option.size.16"),
      "18": t("format.option.size.18"),
      "22": t("format.option.size.22")
    },
    lines: {
      "1": t("format.option.line.1"),
      "1.25": t("format.option.line.1_25"),
      "1.5": t("format.option.line.1_5"),
      "1.75": t("format.option.line.1_75"),
      "2": t("format.option.line.2")
    },
    indents: {
      "0": t("format.option.indent.0"),
      "1": t("format.option.indent.1"),
      "2": t("format.option.indent.2")
    },
    margins: {
      "2": t("format.option.margin.2"),
      "2.2": t("format.option.margin.2_2"),
      "2.54": t("format.option.margin.2_54"),
      "3": t("format.option.margin.3")
    }
  };
}
function addLanguageSetting(container, plugin, onChanged = null) {
  const t = plugin.t.bind(plugin);
  new import_obsidian2.Setting(container).setName(t("settings.language.name")).setDesc(t("settings.language.desc")).addDropdown((dropdown) => {
    dropdown.addOption("system", t("settings.language.system")).addOption("zh-CN", t("settings.language.zhCN")).addOption("en", t("settings.language.en")).setValue(plugin.getLocaleMode()).onChange(async (value) => {
      await plugin.setLocaleMode(value);
      onChanged?.();
    });
  });
}
function errorMessage2(error) {
  return error instanceof Error ? error.message : String(error);
}
function formatDurationSeconds(seconds, t, roundUp = true) {
  const normalized = Math.max(
    0,
    roundUp ? Math.ceil(Number(seconds) || 0) : Math.floor(Number(seconds) || 0)
  );
  const minutes = Math.floor(normalized / 60);
  const remainingSeconds = normalized % 60;
  return minutes > 0 ? t("duration.minutesSeconds", {
    minutes,
    seconds: remainingSeconds
  }) : t("duration.seconds", { seconds: remainingSeconds });
}
function formatBytes(bytes) {
  const value = Math.max(0, Number(bytes) || 0);
  if (value < 1024) {
    return `${Math.round(value)} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  if (value < 1024 * 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function localizedProgressParams(plugin, params = {}) {
  const localized = { ...params };
  if (localized.mode === "strict" || localized.mode === "compatible") {
    localized.mode = plugin.t(`export.mode.${localized.mode}`);
  }
  return localized;
}
function localizedRuntimeDownloadError(plugin, error, version, asset) {
  const t = plugin.t.bind(plugin);
  if (!(error instanceof RuntimeDownloadError)) {
    return errorMessage2(error) || t("runtimeDownload.unknownError");
  }
  switch (error.code) {
    case "ABORTED":
      return t("runtimeDownload.cancelled");
    case "IDLE_TIMEOUT":
      return t("runtime.install.timeout", {
        seconds: Math.max(
          1,
          Math.round(Number(error.details?.idleTimeoutMs || 9e4) / 1e3)
        )
      });
    case "HTTP_STATUS":
      return t("runtime.install.httpError", {
        status: error.details?.statusCode || t("common.unknown"),
        version,
        asset
      });
    case "CHECKSUM_MISMATCH":
      return t("runtimeDownload.shaMismatch");
    case "CHECKSUM_FORMAT_INVALID":
    case "CHECKSUM_ENTRY_MISSING":
    case "CHECKSUM_ENTRY_CONFLICT":
    case "CHECKSUM_TOO_LARGE":
      return t("runtimeDownload.checksumError");
    case "PART_FILE_EXISTS":
      return t("runtimeDownload.partExists");
    case "FILE_WRITE_ERROR":
    case "PART_CLEANUP_FAILED":
      return t("runtimeDownload.fileError");
    case "CONTENT_LENGTH_MISMATCH":
      return t("runtimeDownload.responseIncomplete");
    case "NETWORK_ERROR":
    case "TOO_MANY_REDIRECTS":
    case "REDIRECT_LOCATION_MISSING":
    case "UNSUPPORTED_PROTOCOL":
      return t("runtimeDownload.networkError");
    default:
      return t("runtimeDownload.unknownError");
  }
}
function finalizeDownloadedArchive(workspace, expectedSize, t) {
  let descriptor = null;
  try {
    const partialSize = fs3.statSync(workspace.partialZipPath).size;
    if (partialSize !== expectedSize) {
      throw new Error(t("runtime.install.archiveMissing"));
    }
    descriptor = fs3.openSync(workspace.partialZipPath, "r");
    const header = Buffer.alloc(4);
    const bytesRead = fs3.readSync(descriptor, header, 0, header.length, 0);
    if (bytesRead < 4) {
      throw new Error(t("runtime.install.archiveEmpty"));
    }
    const signature = header.readUInt32LE(0);
    if (![67324752, 101010256, 134695760].includes(signature)) {
      throw new Error(t("runtime.install.archiveNotZip"));
    }
  } finally {
    if (descriptor !== null) {
      fs3.closeSync(descriptor);
    }
  }
  fs3.renameSync(workspace.partialZipPath, workspace.zipPath);
  if (fs3.statSync(workspace.zipPath).size !== expectedSize) {
    throw new Error(t("runtime.install.archiveMissing"));
  }
  return expectedSize;
}
function runtimeInstallRegistry() {
  if (!globalThis[RUNTIME_INSTALL_REGISTRY_KEY]) {
    globalThis[RUNTIME_INSTALL_REGISTRY_KEY] = /* @__PURE__ */ Object.create(null);
  }
  return globalThis[RUNTIME_INSTALL_REGISTRY_KEY];
}
function detectedRuntimeTargetId() {
  const exact = Object.values(RUNTIME_TARGETS).find(
    (target) => target.nodePlatform === process.platform && target.nodeArch === process.arch
  );
  return exact?.id || null;
}
function cloneFormat(config = DEFAULT_FORMAT) {
  return { ...DEFAULT_FORMAT, ...config };
}
function formatSummary(config, t = DEFAULT_TRANSLATOR) {
  return t("format.summary", {
    documentLanguage: config.document_language === "en-US" ? "English" : "\u4E2D\u6587",
    eastAsiaFont: config.east_asia_font,
    westernFont: config.western_font,
    bodySize: config.body_size_pt,
    bodyLineSpacing: config.body_line_spacing,
    bodyIndent: config.body_first_line_chars,
    tableSize: config.table_size_pt,
    tableLineSpacing: config.table_line_spacing,
    captionSize: config.caption_size_pt,
    noteSize: config.note_size_pt,
    margin: config.margin_cm,
    figureReflow: config.figure_reflow ? t("common.enabled") : t("common.disabled")
  });
}
function visibleMarkdownHeading(text) {
  return String(text || "").trim().replace(/\s+#+\s*$/, "").replace(/[*_`~]/g, "").trim();
}
function markdownArticleTitle(source, fallback) {
  const lines = String(source || "").split(/\r?\n/);
  let bodyStart = 0;
  let metadataTitle = "";
  if (lines[0]?.trim() === "---") {
    const frontmatterEnd = lines.slice(1).findIndex((line) => line.trim() === "---");
    if (frontmatterEnd >= 0) {
      bodyStart = frontmatterEnd + 2;
      for (const line of lines.slice(1, bodyStart - 1)) {
        const match = line.match(/^\s*title\s*:\s*(.*?)\s*$/i);
        if (match && !["", "|", ">", "|-", ">-"].includes(match[1].trim())) {
          metadataTitle = match[1].trim().replace(/^["']|["']$/g, "");
          break;
        }
      }
    }
  }
  for (const line of lines.slice(bodyStart)) {
    const match = line.match(/^\s*#\s+(.+?)\s*$/);
    if (match) {
      const title = visibleMarkdownHeading(match[1]);
      if (title) {
        return title;
      }
    }
  }
  return metadataTitle || String(fallback || "").trim();
}
function isInvalidWindowsFileNameCharacter(character) {
  return character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character);
}
function normalizeOutputBaseName(value, t = DEFAULT_TRANSLATOR) {
  const outputName = String(value || "").trim().replace(/\.docx$/i, "").trim();
  if (!outputName) {
    return { error: t("format.outputName.empty") };
  }
  if ([...outputName].some(isInvalidWindowsFileNameCharacter)) {
    return {
      error: t("format.outputName.invalidCharacters")
    };
  }
  if (/[. ]$/.test(outputName)) {
    return { error: t("format.outputName.trailingCharacter") };
  }
  if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(outputName)) {
    return {
      error: t("format.outputName.reserved", { name: outputName })
    };
  }
  return { value: outputName };
}
function safeDefaultOutputBaseName(value, fallback, t = DEFAULT_TRANSLATOR) {
  const clean = String(value || "").trim().replace(/\.docx$/i, "").split("").map(
    (character) => isInvalidWindowsFileNameCharacter(character) ? "-" : character
  ).join("").replace(/[. ]+$/g, "").trim();
  const result = normalizeOutputBaseName(clean, t);
  if (result.value) {
    return result.value;
  }
  const fallbackResult = normalizeOutputBaseName(fallback, t);
  return fallbackResult.value || t("format.defaultOutputName");
}
function fileTimestamp(date = /* @__PURE__ */ new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
function uniqueOutputPath(requestedPath) {
  if (!fs3.existsSync(requestedPath)) {
    return requestedPath;
  }
  const directory = path3.dirname(requestedPath);
  const extension = path3.extname(requestedPath) || ".docx";
  const stem = path3.basename(requestedPath, extension);
  const stampedStem = `${stem}-${fileTimestamp()}`;
  let candidate = path3.join(directory, `${stampedStem}${extension}`);
  let sequence = 2;
  while (fs3.existsSync(candidate)) {
    candidate = path3.join(
      directory,
      `${stampedStem}-${sequence}${extension}`
    );
    sequence += 1;
  }
  return candidate;
}
var ExportModeModal = class extends import_obsidian2.Modal {
  constructor(plugin, resolve2) {
    super(plugin.app);
    this.plugin = plugin;
    this.resolve = resolve2;
    this.resolved = false;
  }
  choose(mode) {
    this.resolved = true;
    this.close();
    this.resolve(mode);
  }
  render() {
    const { contentEl } = this;
    const t = this.plugin.t.bind(this.plugin);
    contentEl.empty();
    contentEl.createEl("h2", { text: t("exportMode.title") });
    addLanguageSetting(contentEl, this.plugin);
    contentEl.createEl("p", {
      text: t("exportMode.desc")
    });
    new import_obsidian2.Setting(contentEl).setName(t("exportMode.strict.name")).setDesc(t("exportMode.strict.desc")).addButton(
      (button) => button.setButtonText(t("exportMode.strict.action")).setCta().onClick(() => this.choose("strict"))
    );
    new import_obsidian2.Setting(contentEl).setName(t("exportMode.compatible.name")).setDesc(t("exportMode.compatible.desc")).addButton(
      (button) => button.setButtonText(t("exportMode.compatible.action")).onClick(() => this.choose("compatible"))
    );
    new import_obsidian2.Setting(contentEl).addButton(
      (button) => button.setButtonText(t("common.cancel")).onClick(() => this.close())
    );
  }
  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(
      () => this.render()
    );
    this.render();
  }
  onClose() {
    this.removeLanguageListener?.();
    this.removeLanguageListener = null;
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
var WordFileSelectModal = class extends import_obsidian2.Modal {
  constructor(plugin, files, resolve2) {
    super(plugin.app);
    this.plugin = plugin;
    this.files = files;
    this.resolve = resolve2;
    this.resolved = false;
    this.selectedPath = files[0]?.path || "";
  }
  finish(value) {
    if (this.resolved) {
      return;
    }
    this.resolved = true;
    this.resolve(value);
    this.close();
  }
  render() {
    const { contentEl } = this;
    const t = this.plugin.t.bind(this.plugin);
    contentEl.empty();
    contentEl.createEl("h2", { text: t("wordSelect.title") });
    addLanguageSetting(contentEl, this.plugin);
    contentEl.createEl("p", {
      text: t("wordSelect.desc")
    });
    new import_obsidian2.Setting(contentEl).setName(t("wordSelect.file.name")).setDesc(t("wordSelect.file.desc")).addDropdown((dropdown) => {
      for (const file of this.files) {
        dropdown.addOption(file.path, file.label);
      }
      dropdown.setValue(this.selectedPath).onChange((value) => {
        this.selectedPath = value;
      });
    });
    new import_obsidian2.Setting(contentEl).addButton(
      (button) => button.setButtonText(t("wordSelect.action")).setCta().onClick(() => this.finish(this.selectedPath))
    ).addButton(
      (button) => button.setButtonText(t("common.cancel")).onClick(() => this.finish(null))
    );
  }
  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(
      () => this.render()
    );
    this.render();
  }
  onClose() {
    this.removeLanguageListener?.();
    this.removeLanguageListener = null;
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
var FormatSettingsModal = class extends import_obsidian2.Modal {
  constructor(plugin, options, resolve2) {
    super(plugin.app);
    this.plugin = plugin;
    this.resolve = resolve2;
    this.resolved = false;
    this.presets = options.presets || {};
    this.templateFiles = options.templateFiles.length ? options.templateFiles : [DEFAULT_TEMPLATE_FILE];
    this.figureReflowDefault = options.figureReflowDefault === true;
    this.documentLanguage = /^en(?:[-_]|$)/i.test(String(options.documentLanguage || "")) ? "en-US" : "zh-CN";
    this.citationReport = options.citationReport || {};
    this.zoteroStyles = options.zoteroStyles || { styles: [], directories: [] };
    const defaultCitationStyleId = plugin.exportSettings?.defaultCitationStyleId || "";
    this.citationStyleId = this.zoteroStyles.styles.some((style) => style.id === defaultCitationStyleId) ? defaultCitationStyleId : "";
    this.citationDisplay = "rendered";
    this.selectedPreset = "__default__";
    this.config = this.defaultCommandFormat();
    this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE) ? DEFAULT_TEMPLATE_FILE : this.templateFiles[0];
    this.presetName = "";
    this.outputName = options.outputName || plugin.t("format.defaultOutputName");
  }
  defaultCommandFormat() {
    return cloneFormat({
      document_language: this.documentLanguage,
      ...this.documentLanguage === "en-US" ? { body_first_line_chars: 2, east_asia_font: "Times New Roman" } : {},
      figure_reflow: this.figureReflowDefault
    });
  }
  usePreset(value) {
    this.selectedPreset = value;
    if (value === "__default__") {
      this.config = this.defaultCommandFormat();
      this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE) ? DEFAULT_TEMPLATE_FILE : this.templateFiles[0];
      this.presetName = "";
    } else {
      const preset = this.presets[value];
      this.config = cloneFormat(preset?.config);
      this.config.preset_name = preset?.name || value;
      this.templateFile = preset?.templateFile && this.templateFiles.includes(preset.templateFile) ? preset.templateFile : this.templateFile;
      this.presetName = preset?.name || value;
    }
    this.render();
  }
  finish({ useDefault = false, savePreset = false } = {}) {
    const t = this.plugin.t.bind(this.plugin);
    const normalizedOutput = normalizeOutputBaseName(this.outputName, t);
    if (!normalizedOutput.value) {
      new import_obsidian2.Notice(normalizedOutput.error);
      return;
    }
    const config = useDefault ? this.defaultCommandFormat() : cloneFormat(this.config);
    const templateFile = useDefault ? this.templateFiles.includes(DEFAULT_TEMPLATE_FILE) ? DEFAULT_TEMPLATE_FILE : this.templateFiles[0] : this.templateFile;
    const requestedName = this.presetName.trim();
    const chosenStyle = this.zoteroStyles.styles.find((style) => style.id === this.citationStyleId);
    if (this.citationDisplay === "rendered" && chosenStyle && !chosenStyle.renderPath) {
      new import_obsidian2.Notice(t("format.citationStyle.parentMissing"));
      return;
    }
    if (savePreset && !requestedName) {
      new import_obsidian2.Notice(t("format.saveName.required"));
      return;
    }
    const differsFromDefault = Object.keys(DEFAULT_FORMAT).some(
      (key) => key !== "preset_name" && config[key] !== DEFAULT_FORMAT[key]
    ) || templateFile !== DEFAULT_TEMPLATE_FILE;
    const displayName = savePreset ? requestedName : useDefault ? t("format.preset.defaultName") : this.selectedPreset !== "__default__" ? config.preset_name : differsFromDefault ? t("format.preset.customName") : t("format.preset.defaultName");
    config.preset_name = displayName;
    this.resolved = true;
    this.close();
    this.resolve({
      config,
      templateFile,
      savePreset,
      presetName: requestedName,
      displayName,
      outputName: normalizedOutput.value,
      citationStyle: this.zoteroStyles.styles.find((style) => style.id === this.citationStyleId) || null,
      citationDisplay: this.citationDisplay
    });
  }
  addDropdown(container, name, desc, key, options) {
    const t = this.plugin.t.bind(this.plugin);
    const current = String(this.config[key]);
    new import_obsidian2.Setting(container).setName(name).setDesc(desc).addDropdown((dropdown) => {
      for (const [value, label] of Object.entries(options)) {
        dropdown.addOption(value, label);
      }
      if (!Object.prototype.hasOwnProperty.call(options, current)) {
        dropdown.addOption(
          current,
          t("common.savedValue", { value: current })
        );
      }
      dropdown.setValue(current).onChange((value) => {
        this.config[key] = Number(value);
      });
    });
  }
  render() {
    const { contentEl } = this;
    const t = this.plugin.t.bind(this.plugin);
    const formatOptions = localizedFormatOptions(t);
    contentEl.empty();
    this.modalEl.style.width = "min(760px, 92vw)";
    contentEl.style.maxHeight = "80vh";
    contentEl.style.overflowY = "auto";
    contentEl.createEl("h2", { text: t("format.title") });
    const summary = contentEl.createDiv({ cls: "md-export-format-summary" });
    summary.style.cssText = "position:sticky;top:0;z-index:2;padding:12px;background:var(--background-secondary);border:1px solid var(--background-modifier-border);border-radius:8px;white-space:pre-wrap;";
    const updateSummary = () => {
      const selectedStyle = this.zoteroStyles.styles.find((style) => style.id === this.citationStyleId);
      const styleLabel = selectedStyle?.title || this.citationReport.style;
      const english = this.config.document_language === "en-US", uiEnglish = this.plugin.getLanguage() === "en";
      const indent = Number(this.config.body_first_line_chars) * (english ? 0.5 : 1);
      const lines = uiEnglish ? ["Current export format", `Manuscript: ${english ? "English" : "Chinese"}`, `Font: ${english ? this.config.western_font : this.config.east_asia_font + " / " + this.config.western_font}`, `Body: ${this.config.body_size_pt} pt; line spacing ${this.config.body_line_spacing}`, `First-line indent: ${indent} em; alignment: justified`, `CSL: ${this.citationReport.style || "Global/default citation style"}`] : ["\u672C\u6B21\u5B9E\u9645\u5BFC\u51FA\u683C\u5F0F", `\u7A3F\u4EF6\uFF1A${english ? "\u82F1\u6587" : "\u4E2D\u6587"}`, `\u5B57\u4F53\uFF1A${english ? this.config.western_font : this.config.east_asia_font + " / " + this.config.western_font}`, `\u6B63\u6587\uFF1A${this.config.body_size_pt} pt\uFF1B\u884C\u8DDD ${this.config.body_line_spacing} \u500D`, `\u9996\u884C\u7F29\u8FDB\uFF1A${indent} em\uFF1B\u6B63\u6587\u4E24\u7AEF\u5BF9\u9F50`, `\u5F15\u7528\u6837\u5F0F\uFF1A${this.citationReport.style || "\u5168\u5C40\uFF0F\u9ED8\u8BA4 CSL"}`];
      lines[lines.length - 1] = (uiEnglish ? "Citation style: " : "\u5F15\u7528\u6837\u5F0F\uFF1A") + (styleLabel || t("format.citationStyle.follow"));
      if (!selectedStyle && this.citationReport.issues?.length) lines.push((uiEnglish ? "Check: " : "\u9700\u6838\u5B9E\uFF1A") + this.citationReport.issues.join("\n"));
      summary.setText(lines.join("\n"));
    };
    updateSummary();
    contentEl.oninput = () => queueMicrotask(updateSummary);
    contentEl.onchange = () => queueMicrotask(updateSummary);
    addLanguageSetting(contentEl, this.plugin);
    new import_obsidian2.Setting(contentEl).setName(t("format.citationStyle.name")).setDesc(t(this.zoteroStyles.styles.length ? "format.citationStyle.desc" : "format.citationStyle.empty")).addDropdown((dropdown) => {
      dropdown.addOption("", t("format.citationStyle.follow"));
      for (const style of this.zoteroStyles.styles) dropdown.addOption(style.id, style.title);
      dropdown.setValue(this.citationStyleId).onChange((value) => {
        this.citationStyleId = value;
        updateSummary();
      });
      dropdown.selectEl.style.maxWidth = "360px";
    }).addButton((button) => button.setButtonText(t("format.citationStyle.refresh")).onClick(async () => {
      button.setDisabled(true);
      try {
        this.zoteroStyles = await discoverZoteroStyles();
        if (!this.zoteroStyles.styles.some((style) => style.id === this.citationStyleId)) this.citationStyleId = "";
        this.render();
      } finally {
        button.setDisabled(false);
      }
    }));
    new import_obsidian2.Setting(contentEl).setName(t("format.citationDisplay.name")).setDesc(t("format.citationDisplay.desc")).addDropdown((dropdown) => dropdown.addOption("manual", t("format.citationDisplay.manual")).addOption("rendered", t("format.citationDisplay.rendered")).setValue(this.citationDisplay).onChange((value) => {
      this.citationDisplay = value;
    }));
    new import_obsidian2.Setting(contentEl).setName(t("format.documentLanguage.name")).setDesc(t("format.documentLanguage.desc")).addButton((button) => {
      button.setButtonText(t("format.documentLanguage.zhCN")).onClick(() => {
        this.config.document_language = "zh-CN";
        this.config.body_first_line_chars = 2;
        this.config.east_asia_font = "\u5B8B\u4F53";
        this.render();
      });
      if (this.config.document_language !== "en-US") button.setCta();
    }).addButton((button) => {
      button.setButtonText(t("format.documentLanguage.en")).onClick(() => {
        this.config.document_language = "en-US";
        this.config.body_first_line_chars = 2;
        this.config.east_asia_font = this.config.western_font;
        this.render();
      });
      if (this.config.document_language === "en-US") button.setCta();
    });
    contentEl.createEl("p", {
      text: t("format.intro", {
        summary: formatSummary(this.defaultCommandFormat(), t)
      })
    });
    const reflowEnabled = this.config.figure_reflow === true;
    new import_obsidian2.Setting(contentEl).setName(t("format.figureFlow.name")).setDesc(t("format.figureFlow.desc")).addButton((button) => {
      button.setButtonText(t("format.figureFlow.keep")).onClick(() => {
        this.config.figure_reflow = false;
        this.render();
      });
      if (!reflowEnabled) {
        button.setCta();
      }
    }).addButton((button) => {
      button.setButtonText(t("format.figureFlow.reflow")).onClick(() => {
        this.config.figure_reflow = true;
        this.render();
      });
      if (reflowEnabled) {
        button.setCta();
      }
    });
    new import_obsidian2.Setting(contentEl).setName(t("format.outputName.name")).setDesc(t("format.outputName.desc")).addText((text) => {
      text.inputEl.style.width = "min(420px, 52vw)";
      text.setPlaceholder(t("format.outputName.placeholder")).setValue(this.outputName).onChange((value) => {
        this.outputName = value;
      });
    });
    new import_obsidian2.Setting(contentEl).setName(t("format.preset.name")).setDesc(t("format.preset.desc")).addDropdown((dropdown) => {
      dropdown.addOption("__default__", t("format.preset.default"));
      for (const [key, preset] of Object.entries(this.presets)) {
        dropdown.addOption(key, preset.name || key);
      }
      dropdown.setValue(this.selectedPreset).onChange((value) => {
        this.usePreset(value);
      });
    });
    new import_obsidian2.Setting(contentEl).setName(t("format.template.name")).setDesc(
      t("format.template.default", { file: DEFAULT_TEMPLATE_FILE })
    ).addDropdown((dropdown) => {
      for (const file of this.templateFiles) {
        dropdown.addOption(file, file);
      }
      dropdown.setValue(this.templateFile).onChange((value) => {
        this.templateFile = value;
      });
    });
    contentEl.createEl("h3", { text: t("format.section.body") });
    new import_obsidian2.Setting(contentEl).setName(t("format.eastAsiaFont.name")).setDesc(
      t("format.eastAsiaFont.default", {
        font: DEFAULT_FORMAT.east_asia_font
      })
    ).addText(
      (text) => text.setValue(this.config.east_asia_font).onChange((value) => {
        this.config.east_asia_font = value.trim() || DEFAULT_FORMAT.east_asia_font;
      })
    );
    new import_obsidian2.Setting(contentEl).setName(t("format.westernFont.name")).setDesc(
      t("format.westernFont.default", {
        font: DEFAULT_FORMAT.western_font
      })
    ).addText(
      (text) => text.setValue(this.config.western_font).onChange((value) => {
        this.config.western_font = value.trim() || DEFAULT_FORMAT.western_font;
      })
    );
    this.addDropdown(
      contentEl,
      t("format.bodySize.name"),
      t("format.defaultValue", { value: formatOptions.sizes["12"] }),
      "body_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.bodyLineSpacing.name"),
      t("format.defaultValue", { value: formatOptions.lines["1.5"] }),
      "body_line_spacing",
      formatOptions.lines
    );
    this.addDropdown(
      contentEl,
      t("format.bodyIndent.name"),
      t("format.defaultValue", { value: formatOptions.indents["2"] }),
      "body_first_line_chars",
      formatOptions.indents
    );
    contentEl.createEl("h3", { text: t("format.section.headings") });
    this.addDropdown(
      contentEl,
      t("format.titleSize.name"),
      t("format.defaultValue", { value: formatOptions.sizes["16"] }),
      "title_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.titleLineSpacing.name"),
      t("format.defaultValue", { value: formatOptions.lines["1.5"] }),
      "title_line_spacing",
      formatOptions.lines
    );
    this.addDropdown(
      contentEl,
      t("format.heading2Size.name"),
      t("format.defaultValue", { value: formatOptions.sizes["14"] }),
      "heading2_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.heading3Size.name"),
      t("format.defaultValue", { value: formatOptions.sizes["12"] }),
      "heading3_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.heading4Size.name"),
      t("format.defaultValue", { value: formatOptions.sizes["12"] }),
      "heading4_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.headingLineSpacing.name"),
      t("format.defaultValue", { value: formatOptions.lines["1.5"] }),
      "heading_line_spacing",
      formatOptions.lines
    );
    contentEl.createEl("h3", {
      text: t("format.section.tablesCaptionsNotes")
    });
    this.addDropdown(
      contentEl,
      t("format.tableSize.name"),
      t("format.defaultValue", { value: formatOptions.sizes["7.5"] }),
      "table_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.tableLineSpacing.name"),
      t("format.defaultValue", { value: formatOptions.lines["1"] }),
      "table_line_spacing",
      formatOptions.lines
    );
    this.addDropdown(
      contentEl,
      t("format.captionSize.name"),
      t("format.defaultValue", { value: formatOptions.sizes["10.5"] }),
      "caption_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.captionLineSpacing.name"),
      t("format.defaultValue", { value: formatOptions.lines["1"] }),
      "caption_line_spacing",
      formatOptions.lines
    );
    this.addDropdown(
      contentEl,
      t("format.noteSize.name"),
      t("format.defaultValue", { value: formatOptions.sizes["7.5"] }),
      "note_size_pt",
      formatOptions.sizes
    );
    this.addDropdown(
      contentEl,
      t("format.noteLineSpacing.name"),
      t("format.defaultValue", { value: formatOptions.lines["1.0"] }),
      "note_line_spacing",
      formatOptions.lines
    );
    this.addDropdown(
      contentEl,
      t("format.formulaSize.name"),
      t("format.defaultValue", { value: formatOptions.sizes["12"] }),
      "formula_size_pt",
      formatOptions.sizes
    );
    contentEl.createEl("h3", { text: t("format.section.page") });
    this.addDropdown(
      contentEl,
      t("format.margin.name"),
      t("format.defaultValue", { value: formatOptions.margins["2.54"] }),
      "margin_cm",
      formatOptions.margins
    );
    new import_obsidian2.Setting(contentEl).setName(t("format.saveName.name")).setDesc(t("format.saveName.desc")).addText(
      (text) => text.setPlaceholder(t("format.saveName.placeholder")).setValue(this.presetName).onChange((value) => {
        this.presetName = value;
      })
    );
    new import_obsidian2.Setting(contentEl).addButton(
      (button) => button.setButtonText(t("format.action.useDefault")).onClick(() => this.finish({ useDefault: true }))
    ).addButton(
      (button) => button.setButtonText(t("format.action.saveAndExport")).onClick(() => this.finish({ savePreset: true }))
    ).addButton(
      (button) => button.setButtonText(t("format.action.export")).setCta().onClick(() => this.finish())
    ).addButton(
      (button) => button.setButtonText(t("common.cancel")).onClick(() => this.close())
    );
  }
  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(
      () => this.render()
    );
    this.render();
  }
  onClose() {
    this.removeLanguageListener?.();
    this.removeLanguageListener = null;
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
var RuntimeDownloadModal = class extends import_obsidian2.Modal {
  constructor(plugin, target, version) {
    super(plugin.app);
    this.plugin = plugin;
    this.target = target;
    this.version = version;
    this.startedAt = Date.now();
    this.stageKey = "runtimeDownload.preparing";
    this.stageParams = {};
    this.detailKey = "";
    this.detailParams = {};
    this.progress = null;
    this.actionState = "running";
    this.downloadActive = false;
    this.controller = null;
    this.failureError = null;
    this.failureKey = "runtimeDownload.failed";
    this.retryResolver = null;
    this.closed = false;
    this.elapsedTimer = null;
    this.lastProgressRenderAt = 0;
    this.removeLanguageListener = null;
  }
  onOpen() {
    this.closed = false;
    this.contentEl.addClass("md-export-word-runtime-download-modal");
    this.removeLanguageListener = this.plugin.onLanguageChange(
      () => this.render()
    );
    this.elapsedTimer = window.setInterval(() => this.refreshText(), 1e3);
    this.render();
  }
  render() {
    const t = this.plugin.t.bind(this.plugin);
    this.titleEl.setText(t("runtimeDownload.title"));
    this.contentEl.empty();
    addLanguageSetting(this.contentEl, this.plugin);
    this.contentEl.createDiv({
      cls: "md-export-word-progress-file",
      text: `${this.target.label} \xB7 ${this.version}`
    });
    this.statusEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-status"
    });
    this.progressEl = this.contentEl.createEl("progress", {
      cls: "md-export-word-progress",
      attr: { max: "100" }
    });
    this.detailEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-detail"
    });
    this.elapsedEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-detail"
    });
    this.actionsEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-actions"
    });
    this.refreshText();
    this.renderActions();
  }
  currentStageText() {
    const t = this.plugin.t.bind(this.plugin);
    if (this.failureError) {
      return t(this.failureKey, {
        message: localizedRuntimeDownloadError(
          this.plugin,
          this.failureError,
          this.version,
          this.target.asset
        )
      });
    }
    return t(this.stageKey, this.stageParams);
  }
  currentDetailText() {
    const t = this.plugin.t.bind(this.plugin);
    if (this.progress) {
      const speed = `${formatBytes(this.progress.bytesPerSecond)}/s`;
      if (this.progress.totalBytes !== null) {
        const params = {
          downloaded: formatBytes(this.progress.receivedBytes),
          total: formatBytes(this.progress.totalBytes),
          percent: Math.min(100, Math.floor(this.progress.percent || 0)),
          speed
        };
        if (this.progress.etaSeconds === null) {
          return t("runtimeDownload.progressKnownCalculating", params);
        }
        return t("runtimeDownload.progressKnown", {
          ...params,
          eta: formatDurationSeconds(this.progress.etaSeconds, t)
        });
      }
      return t("runtimeDownload.progressUnknown", {
        downloaded: formatBytes(this.progress.receivedBytes),
        speed
      });
    }
    return this.detailKey ? t(this.detailKey, this.detailParams) : "";
  }
  refreshText() {
    if (this.closed || !this.statusEl) {
      return;
    }
    const t = this.plugin.t.bind(this.plugin);
    this.statusEl.setText(this.currentStageText());
    this.statusEl.toggleClass(
      "is-error",
      this.actionState === "failed" || this.actionState === "waiting-retry"
    );
    this.statusEl.toggleClass("is-success", this.actionState === "complete");
    this.detailEl?.setText(this.currentDetailText());
    this.elapsedEl?.setText(
      t("runtimeDownload.elapsed", {
        elapsed: formatDurationSeconds(
          (Date.now() - this.startedAt) / 1e3,
          t,
          false
        )
      })
    );
    if (this.progressEl) {
      this.progressEl.toggleAttribute("hidden", !this.progress);
      if (this.progress?.percent === null) {
        this.progressEl.removeAttribute("value");
      } else if (this.progress) {
        this.progressEl.value = Math.max(
          0,
          Math.min(100, this.progress.percent || 0)
        );
      }
    }
  }
  renderActions() {
    if (this.closed || !this.actionsEl) {
      return;
    }
    const t = this.plugin.t.bind(this.plugin);
    this.actionsEl.empty();
    const actions = new import_obsidian2.Setting(this.actionsEl);
    if (this.actionState === "waiting-retry") {
      actions.addButton(
        (button) => button.setButtonText(t("runtimeDownload.retry")).setCta().onClick(() => this.resolveRetry(true))
      ).addButton(
        (button) => button.setButtonText(t("common.close")).setWarning().onClick(() => {
          this.resolveRetry(false);
          this.close();
        })
      );
      return;
    }
    if (this.actionState === "running" && this.controller) {
      actions.addButton(
        (button) => button.setButtonText(t("runtimeDownload.cancel")).setWarning().onClick(() => this.controller?.abort())
      );
    }
    actions.addButton((button) => {
      button.setButtonText(
        this.actionState === "running" ? t("runtimeDownload.hide") : t("common.close")
      ).onClick(() => this.close());
      if (this.actionState === "complete") {
        button.setCta();
      }
    });
  }
  setController(controller) {
    this.controller = controller;
    this.renderActions();
  }
  setStage(stageKey, detailKey = "", params = {}) {
    this.stageKey = stageKey;
    this.stageParams = params;
    this.detailKey = detailKey;
    this.detailParams = params;
    this.progress = null;
    this.failureError = null;
    this.failureKey = "runtimeDownload.failed";
    this.downloadActive = false;
    this.actionState = "running";
    this.refreshText();
    this.renderActions();
  }
  updateDownloadProgress(progress) {
    this.stageKey = "runtimeDownload.downloading";
    this.stageParams = { file: this.target.asset };
    this.detailKey = "";
    this.progress = progress;
    this.failureError = null;
    this.downloadActive = progress.percent === null || progress.percent < 100;
    this.actionState = "running";
    const now = Date.now();
    if (progress.receivedBytes === 0 || progress.percent === 100 || now - this.lastProgressRenderAt >= 100) {
      this.lastProgressRenderAt = now;
      this.refreshText();
    }
  }
  setRetrying(attempt, max) {
    this.setStage("runtimeDownload.downloading", "runtimeDownload.retrying", {
      file: this.target.asset,
      attempt,
      max
    });
  }
  setDownloadComplete() {
    this.stageKey = "runtimeDownload.complete";
    this.stageParams = {};
    this.detailKey = "runtimeDownload.shaPassed";
    this.detailParams = {};
    this.progress = null;
    this.failureError = null;
    this.downloadActive = false;
    this.actionState = "running";
    this.refreshText();
    this.renderActions();
  }
  setCancelled() {
    this.stageKey = "runtimeDownload.cancelled";
    this.stageParams = {};
    this.detailKey = "";
    this.progress = null;
    this.failureError = null;
    this.downloadActive = false;
    this.actionState = "cancelled";
    this.refreshText();
    this.renderActions();
  }
  fail(error, failureKey = "runtimeDownload.failed") {
    this.failureError = error;
    this.failureKey = failureKey;
    this.progress = null;
    this.downloadActive = false;
    this.actionState = "failed";
    this.refreshText();
    this.renderActions();
  }
  requestRetry(error) {
    if (this.closed) {
      return Promise.resolve(false);
    }
    this.failureError = error;
    this.failureKey = "runtimeDownload.failed";
    this.progress = null;
    this.downloadActive = false;
    this.actionState = "waiting-retry";
    this.refreshText();
    this.renderActions();
    return new Promise((resolve2) => {
      this.retryResolver = resolve2;
    });
  }
  resolveRetry(value) {
    const resolve2 = this.retryResolver;
    this.retryResolver = null;
    if (resolve2) {
      resolve2(value);
    }
  }
  completeInstall() {
    this.stageKey = "runtime.status.installed";
    this.stageParams = {
      target: this.target.label,
      version: this.version
    };
    this.detailKey = "runtimeDownload.shaPassed";
    this.detailParams = {};
    this.progress = null;
    this.failureError = null;
    this.downloadActive = false;
    this.actionState = "complete";
    this.refreshText();
    this.renderActions();
  }
  onClose() {
    this.closed = true;
    this.resolveRetry(false);
    if (this.elapsedTimer !== null) {
      window.clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
    this.removeLanguageListener?.();
    this.removeLanguageListener = null;
  }
};
var ExportProgressModal = class extends import_obsidian2.Modal {
  constructor(plugin, fileName, options = {}) {
    super(plugin.app);
    this.plugin = plugin;
    this.fileName = fileName;
    this.titleKey = options.titleKey || "progressModal.export.title";
    this.successKey = options.successKey || "progressModal.export.success";
    this.failureKey = options.failureKey || "progressModal.export.failure";
    this.logLines = [];
    this.lastPercent = 0;
    this.closedByUser = false;
    this.actionState = "running";
    this.currentEvent = null;
    this.failureLogPath = "";
  }
  onOpen() {
    this.contentEl.addClass("md-export-word-progress-modal");
    this.removeLanguageListener = this.plugin.onLanguageChange(
      () => this.render()
    );
    this.render();
  }
  render() {
    const t = this.plugin.t.bind(this.plugin);
    this.titleEl.setText(t(this.titleKey));
    this.contentEl.empty();
    addLanguageSetting(this.contentEl, this.plugin);
    this.contentEl.createDiv({
      cls: "md-export-word-progress-file",
      text: this.fileName
    });
    this.statusEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-status",
      text: this.currentEvent ? this.localizedEventText().stage : t("progressModal.starting")
    });
    this.progressEl = this.contentEl.createEl("progress", {
      cls: "md-export-word-progress",
      attr: { max: "100", value: String(this.lastPercent) }
    });
    this.detailEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-detail",
      text: `${this.lastPercent}%`
    });
    this.liveHeadingEl = this.contentEl.createEl("h4", {
      text: t("progressModal.liveProcess")
    });
    this.logEl = this.contentEl.createEl("pre", {
      cls: "md-export-word-progress-log",
      attr: {
        tabindex: "0",
        "aria-label": t("progressModal.processAria")
      }
    });
    this.logEl.setText(this.logLines.join("\n"));
    if (this.currentEvent) {
      const { stage, detail } = this.localizedEventText();
      this.setProgressText(stage, detail, this.currentEvent.level);
    }
    this.actionsEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-actions"
    });
    this.renderActions();
  }
  localizedEventText(event = this.currentEvent) {
    if (!event) {
      return {
        stage: this.plugin.t("progressModal.processing"),
        detail: ""
      };
    }
    const params = localizedProgressParams(this.plugin, event.params || {});
    const stage = event.stageKey && hasTranslationKey(event.stageKey) ? translateDynamic(this.plugin.getLanguage(), event.stageKey, params) : event.stage;
    const detail = event.detailKey && hasTranslationKey(event.detailKey) ? translateDynamic(this.plugin.getLanguage(), event.detailKey, params) : event.detail;
    return { stage, detail };
  }
  refreshLocalizedText() {
    const t = this.plugin.t.bind(this.plugin);
    this.titleEl.setText(t(this.titleKey));
    this.liveHeadingEl?.setText(t("progressModal.liveProcess"));
    this.logEl?.setAttr("aria-label", t("progressModal.processAria"));
    if (this.currentEvent) {
      const { stage, detail } = this.localizedEventText();
      this.setProgressText(stage, detail, this.currentEvent.level);
    }
    this.renderActions();
  }
  renderActions() {
    if (!this.actionsEl) {
      return;
    }
    const t = this.plugin.t.bind(this.plugin);
    this.actionsEl.empty();
    const actions = new import_obsidian2.Setting(this.actionsEl);
    if (this.actionState === "failed") {
      actions.addButton(
        (button) => button.setButtonText(t("progressModal.copyErrorLog")).setCta().onClick(() => this.copyLogText(this.failureLogPath))
      );
      if (this.failureLogPath) {
        actions.addButton(
          (button) => button.setButtonText(t("progressModal.openLog")).onClick(() => this.openLogFile(this.failureLogPath))
        );
      }
      actions.addButton(
        (button) => button.setButtonText(t("common.close")).setWarning().onClick(() => this.close())
      );
      return;
    }
    actions.addButton(
      (button) => button.setButtonText(
        this.actionState === "complete" ? t("progressModal.copyProcess") : t("progressModal.copyCurrent")
      ).onClick(() => this.copyLogText())
    );
    actions.addButton((button) => {
      button.setButtonText(
        this.actionState === "complete" ? t("progressModal.doneAndClose") : t("progressModal.hide")
      ).onClick(() => this.close());
      if (this.actionState === "complete") {
        button.setCta();
      }
    });
  }
  updateProgress(percent, stage, detail = "", level = "info", event = {}) {
    const safePercent = Math.max(
      this.lastPercent,
      Math.min(100, Number(percent) || 0)
    );
    this.lastPercent = safePercent;
    this.currentEvent = {
      stage,
      detail,
      level,
      stageKey: event.stageKey || "",
      detailKey: event.detailKey || "",
      params: event.params || {}
    };
    if (this.progressEl) {
      this.progressEl.value = safePercent;
    }
    const localized = this.localizedEventText(this.currentEvent);
    this.setProgressText(localized.stage, localized.detail, level);
    const logStage = event.stage || stage || localized.stage;
    const logDetail = event.detail || detail || localized.detail;
    this.appendLog(
      `[${String(safePercent).padStart(3, " ")}%] ${logStage}` + (logDetail ? ` \u2014 ${logDetail}` : ""),
      level === "error"
    );
  }
  setProgressText(stage, detail = "", level = "info") {
    if (this.statusEl) {
      this.statusEl.setText(
        stage || this.plugin.t("progressModal.processing")
      );
      this.statusEl.toggleClass("is-error", level === "error");
      this.statusEl.toggleClass("is-success", level === "success");
    }
    if (this.detailEl) {
      this.detailEl.setText(
        detail ? `${this.lastPercent}% \xB7 ${detail}` : `${this.lastPercent}%`
      );
    }
  }
  appendLog(line, isError = false) {
    const normalized = String(line || "").trim();
    if (!normalized) {
      return;
    }
    this.logLines.push(isError ? `ERROR ${normalized}` : normalized);
    if (this.logLines.length > 120) {
      this.logLines.splice(0, this.logLines.length - 120);
    }
    if (this.logEl) {
      this.logEl.setText(this.logLines.join("\n"));
      this.logEl.scrollTop = this.logEl.scrollHeight;
    }
  }
  consumeLine(line, isError = false) {
    const normalized = String(line || "").trim();
    if (!normalized) {
      return;
    }
    if (normalized.startsWith(PROGRESS_PREFIX)) {
      try {
        const payload = JSON.parse(normalized.slice(PROGRESS_PREFIX.length));
        this.updateProgress(
          payload.percent,
          payload.stage,
          payload.detail,
          payload.level,
          payload
        );
        return;
      } catch (error) {
        this.appendLog(
          this.plugin.t("progressModal.parseEventFailed", {
            message: error.message
          }),
          true
        );
      }
    }
    this.appendLog(normalized, isError);
  }
  async copyText(text, successMessage) {
    const value = String(text || "").trim();
    if (!value) {
      new import_obsidian2.Notice(this.plugin.t("progressModal.noLog"));
      return false;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) {
          throw new Error(this.plugin.t("progressModal.copyRejected"));
        }
      }
      new import_obsidian2.Notice(successMessage);
      return true;
    } catch (error) {
      new import_obsidian2.Notice(
        this.plugin.t("progressModal.copyFailed", {
          message: error.message
        }),
        1e4
      );
      return false;
    }
  }
  async copyLogText(logPath = "") {
    let text = this.logLines.join("\n");
    if (logPath && fs3.existsSync(logPath)) {
      try {
        text = fs3.readFileSync(logPath, "utf8");
      } catch {
      }
    }
    return await this.copyText(
      text,
      logPath ? this.plugin.t("progressModal.failureLogCopied") : this.plugin.t("progressModal.processCopied")
    );
  }
  openLogFile(logPath) {
    if (!logPath || !fs3.existsSync(logPath)) {
      new import_obsidian2.Notice(this.plugin.t("progressModal.logNotFound"), 1e4);
      return;
    }
    const executable = process.platform === "darwin" ? "/usr/bin/open" : "powershell.exe";
    const args = process.platform === "darwin" ? [logPath] : [
      "-NoProfile",
      "-Command",
      "Start-Process -FilePath $args[0]",
      logPath
    ];
    try {
      const child = (0, import_node_child_process.spawn)(executable, args, {
        detached: true,
        stdio: "ignore",
        windowsHide: true
      });
      child.once("error", (error) => {
        new import_obsidian2.Notice(
          this.plugin.t("progressModal.openLogFailed", {
            message: error.message
          }),
          1e4
        );
      });
      child.unref();
    } catch (error) {
      new import_obsidian2.Notice(
        this.plugin.t("progressModal.openLogFailed", {
          message: error.message
        }),
        1e4
      );
    }
  }
  complete(wordName) {
    this.actionState = "complete";
    this.updateProgress(
      100,
      this.plugin.t(this.successKey),
      wordName,
      "success",
      { stageKey: this.successKey }
    );
    this.renderActions();
  }
  fail(summary, logPath) {
    this.actionState = "failed";
    this.failureLogPath = logPath || "";
    this.updateProgress(
      100,
      this.plugin.t(this.failureKey),
      logPath ? this.plugin.t("progressModal.errorLog", { path: logPath }) : summary,
      "error",
      {
        stageKey: this.failureKey,
        detailKey: logPath ? "progressModal.errorLog" : "",
        params: logPath ? { path: logPath } : {}
      }
    );
    if (summary) {
      this.appendLog(summary, true);
    }
    this.renderActions();
  }
  onClose() {
    this.closedByUser = true;
    this.removeLanguageListener?.();
    this.removeLanguageListener = null;
  }
};
var TextInputModal = class extends import_obsidian2.Modal {
  constructor(plugin, titleKey, descriptionKey, initialValue, resolve2) {
    super(plugin.app);
    this.plugin = plugin;
    this.titleKey = titleKey;
    this.descriptionKey = descriptionKey;
    this.value = initialValue || "";
    this.resolve = resolve2;
    this.resolved = false;
  }
  finish(value) {
    if (this.resolved) {
      return;
    }
    this.resolved = true;
    this.resolve(value);
    this.close();
  }
  render() {
    const t = this.plugin.t.bind(this.plugin);
    this.contentEl.empty();
    this.titleEl.setText(t(this.titleKey));
    addLanguageSetting(this.contentEl, this.plugin);
    this.contentEl.createEl("p", { text: t(this.descriptionKey) });
    new import_obsidian2.Setting(this.contentEl).setName(t("repositoryModal.name")).setDesc(t("repositoryModal.format")).addText(
      (text) => text.setPlaceholder(t("settings.repository.placeholder")).setValue(this.value).onChange((value) => {
        this.value = value.trim();
      })
    );
    new import_obsidian2.Setting(this.contentEl).addButton(
      (button) => button.setButtonText(t("common.continue")).setCta().onClick(() => this.finish(this.value))
    ).addButton(
      (button) => button.setButtonText(t("common.cancel")).onClick(() => this.finish(null))
    );
  }
  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(
      () => this.render()
    );
    this.render();
  }
  onClose() {
    this.removeLanguageListener?.();
    this.removeLanguageListener = null;
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
function runProcess(executable, args, options = {}) {
  return new Promise((resolve2, reject) => {
    let output = "";
    const child = (0, import_node_child_process.spawn)(executable, args, {
      windowsHide: true,
      ...options,
      stdio: ["ignore", "pipe", "pipe"]
    });
    const collect = (chunk) => {
      output += chunk.toString("utf8");
      if (output.length > 3e4) {
        output = output.slice(-3e4);
      }
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    child.once("error", reject);
    child.once("close", (code) => resolve2({ code, output }));
  });
}
function humanizeProcessOutput(output, language = "zh-CN") {
  const t = createTranslator(language);
  return String(output || "").split(/\r?\n/).map((line) => {
    const normalized = line.trim();
    if (!normalized.startsWith(PROGRESS_PREFIX)) {
      return line;
    }
    try {
      const event = JSON.parse(normalized.slice(PROGRESS_PREFIX.length));
      const params = { ...event.params || {} };
      if (params.mode === "strict" || params.mode === "compatible") {
        params.mode = t(`export.mode.${params.mode}`);
      }
      const stage = event.stageKey && hasTranslationKey(event.stageKey) ? translateDynamic(language, event.stageKey, params) : event.stage;
      const detail = event.detailKey && hasTranslationKey(event.detailKey) ? translateDynamic(language, event.detailKey, params) : event.detail;
      return `[${event.percent}%] ${stage}` + (detail ? ` \u2014 ${detail}` : "");
    } catch {
      return line;
    }
  }).join("\n").trim();
}
function appendFailureProcessOutput(logPath, output, language = "zh-CN") {
  const humanOutput = humanizeProcessOutput(output, language);
  if (!humanOutput) {
    return;
  }
  const section = "\nObsidian captured process output\n--------------------------------\n" + humanOutput + "\n";
  if (fs3.existsSync(logPath)) {
    fs3.appendFileSync(logPath, section, "utf8");
  } else {
    fs3.writeFileSync(
      logPath,
      "MD Export Word failure report\n" + section,
      "utf8"
    );
  }
}
var MdExportWordSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const runtimeInstalling = this.plugin.isRuntimeInstalling();
    const t = this.plugin.t.bind(this.plugin);
    containerEl.empty();
    containerEl.createEl("h2", { text: t("settings.title") });
    addLanguageSetting(containerEl, this.plugin, () => this.display());
    new import_obsidian2.Setting(containerEl).setName(t("settings.repository.name")).setDesc(t("settings.repository.desc")).addText((text) => {
      text.setPlaceholder(t("settings.repository.placeholder")).setValue(this.plugin.getReleaseRepository()).setDisabled(runtimeInstalling).onChange(async (value) => {
        this.plugin.exportSettings.repository = value.trim();
        await this.plugin.saveData(this.plugin.exportSettings);
      });
    });
    new import_obsidian2.Setting(containerEl).setName(t("settings.autoOpen.name")).setDesc(t("settings.autoOpen.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.exportSettings.autoOpen !== false).onChange(async (value) => {
        this.plugin.exportSettings.autoOpen = value;
        await this.plugin.saveData(this.plugin.exportSettings);
      })
    );
    const detectedTarget = detectedRuntimeTargetId();
    new import_obsidian2.Setting(containerEl).setName(t("settings.runtimePlatform.name")).setDesc(t("settings.runtimePlatform.desc")).addDropdown((dropdown) => {
      dropdown.addOption(
        "auto",
        t("settings.runtimePlatform.auto", {
          target: detectedTarget ? RUNTIME_TARGETS[detectedTarget].label : `${process.platform}/${process.arch}`
        })
      );
      for (const target of Object.values(RUNTIME_TARGETS)) {
        dropdown.addOption(target.id, target.label);
      }
      dropdown.setValue(this.plugin.exportSettings.runtimePlatform || "auto").setDisabled(runtimeInstalling).onChange(async (value) => {
        this.plugin.exportSettings.runtimePlatform = value;
        await this.plugin.saveData(this.plugin.exportSettings);
        this.display();
      });
    });
    new import_obsidian2.Setting(containerEl).setName(t("settings.runtime.name")).setDesc(
      runtimeInstalling ? t("settings.runtime.installingDesc") : this.plugin.runtimeStatusText()
    ).addButton((button) => {
      button.setButtonText(
        runtimeInstalling ? t("settings.runtime.installing") : t("settings.runtime.installOrRepair")
      ).setCta().setDisabled(runtimeInstalling).onClick(async () => {
        const installPromise = this.plugin.installRuntime();
        this.display();
        try {
          await installPromise;
        } finally {
          this.display();
        }
      });
    }).addButton((button) => {
      button.setButtonText(t("settings.runtime.doctor")).setDisabled(runtimeInstalling).onClick(async () => {
        await this.plugin.runDoctor();
        this.display();
      });
    });
  }
};
var MdExportWordPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    const loadedSettings = await this.loadData() || {};
    this.exportSettings = {
      ...loadedSettings,
      settingsVersion: 1,
      language: normalizeLocaleMode(loadedSettings.language),
      presets: loadedSettings.presets || {}
    };
    this.languageListeners = /* @__PURE__ */ new Set();
    this.commandsRegistered = false;
    this.activeRuntimeDownloadController = null;
    this.activeRuntimeDownloadModal = null;
    this.settingTab = new MdExportWordSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);
    this.registerLocalizedCommands();
  }
  onunload() {
    this.activeRuntimeDownloadController?.abort();
    this.activeRuntimeDownloadModal?.resolveRetry(false);
    this.activeRuntimeDownloadModal?.close();
    this.activeRuntimeDownloadController = null;
    this.activeRuntimeDownloadModal = null;
  }
  getLocaleMode() {
    return normalizeLocaleMode(this.exportSettings?.language);
  }
  getLanguage() {
    return resolveLanguage(this.getLocaleMode(), {
      getLanguage: () => typeof import_obsidian2.getLanguage === "function" ? (0, import_obsidian2.getLanguage)() : null,
      getMomentLocale: () => import_obsidian2.moment.locale()
    });
  }
  t(key, params = {}) {
    return createTranslator(this.getLanguage())(key, params);
  }
  onLanguageChange(listener) {
    this.languageListeners.add(listener);
    return () => this.languageListeners.delete(listener);
  }
  async setLocaleMode(value) {
    const mode = normalizeLocaleMode(value);
    if (mode === this.getLocaleMode()) {
      return;
    }
    this.exportSettings.language = mode;
    this.exportSettings.settingsVersion = 1;
    await this.saveData(this.exportSettings);
    this.registerLocalizedCommands();
    for (const listener of this.languageListeners) {
      try {
        listener(this.getLanguage());
      } catch (error) {
        console.warn("Language listener failed:", error);
      }
    }
    this.settingTab?.display();
  }
  registerLocalizedCommands() {
    if (this.commandsRegistered) {
      for (const commandId of LOCALIZED_COMMAND_IDS) {
        this.removeCommand(commandId);
      }
    }
    const t = this.t.bind(this);
    this.addCommand({
      id: "export-current-markdown-to-word",
      name: t("command.exportKeepFigures"),
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        const canExport = Boolean(
          file && typeof file.extension === "string" && file.extension.toLowerCase() === "md"
        );
        if (canExport && !checking) {
          void this.exportCurrentFile(file, {
            figureReflowDefault: false
          });
        }
        return canExport;
      }
    });
    this.addCommand({
      id: "export-current-markdown-to-word-with-figure-reflow",
      name: t("command.exportReflowFigures"),
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        const canExport = Boolean(
          file && typeof file.extension === "string" && file.extension.toLowerCase() === "md"
        );
        if (canExport && !checking) {
          void this.exportCurrentFile(file, {
            figureReflowDefault: true
          });
        }
        return canExport;
      }
    });
    this.addCommand({
      id: "reapply-blue-zotero-citations",
      name: t("command.reapplyBlueCitations"),
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        const canRecolor = Boolean(
          file && typeof file.extension === "string" && file.extension.toLowerCase() === "md"
        );
        if (canRecolor && !checking) {
          void this.recolorWordCitationsForCurrentFile(file);
        }
        return canRecolor;
      }
    });
    this.addCommand({
      id: "install-or-repair-runtime",
      name: t("command.installRuntime"),
      callback: () => {
        void this.installRuntime();
      }
    });
    this.addCommand({
      id: "check-runtime",
      name: t("command.checkRuntime"),
      callback: () => {
        void this.runDoctor();
      }
    });
    this.commandsRegistered = true;
  }
  getPluginRoot() {
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      return null;
    }
    return path3.join(
      adapter.getBasePath(),
      this.app.vault.configDir,
      "plugins",
      this.manifest.id
    );
  }
  getRuntimeRoot() {
    const pluginRoot = this.getPluginRoot();
    return pluginRoot ? path3.join(pluginRoot, "runtime") : null;
  }
  getTemplateRoot() {
    const pluginRoot = this.getPluginRoot();
    return pluginRoot ? path3.join(pluginRoot, "templates") : null;
  }
  getRuntimeTarget() {
    const selected = String(
      this.exportSettings?.runtimePlatform || "auto"
    ).trim();
    if (selected !== "auto" && RUNTIME_TARGETS[selected]) {
      return RUNTIME_TARGETS[selected];
    }
    const detected = detectedRuntimeTargetId();
    return detected ? RUNTIME_TARGETS[detected] : null;
  }
  runtimeCompatibilityError(target) {
    const t = this.t.bind(this);
    if (!target) {
      return t("runtime.compatibility.unsupported", {
        platform: process.platform,
        arch: process.arch
      });
    }
    if (target.nodePlatform !== process.platform) {
      return t("runtime.compatibility.platformMismatch", {
        target: target.label,
        platform: process.platform,
        arch: process.arch
      });
    }
    if (target.nodeArch !== process.arch && !(process.platform === "darwin" && process.arch === "arm64" && target.nodeArch === "x64")) {
      return t("runtime.compatibility.archMismatch", {
        target: target.label,
        arch: process.arch
      });
    }
    return "";
  }
  runtimePaths(root = this.getRuntimeRoot(), target = this.getRuntimeTarget()) {
    if (!root || !target) {
      return null;
    }
    const binaryRoot = path3.join(root, "Pandoc&pandoc-crossref");
    return {
      root,
      target,
      manifest: path3.join(root, RUNTIME_MANIFEST),
      exporter: path3.join(root, "scripts", "md_export_word_template.py"),
      recolor: path3.join(root, "scripts", "recolor_zotero_citations.py"),
      doctor: path3.join(root, "scripts", "doctor.py"),
      pandoc: path3.join(binaryRoot, target.pandocFile),
      crossref: path3.join(binaryRoot, target.crossrefFile),
      python: path3.join(root, ...target.pythonParts),
      template: path3.join(root, "Word-Template", DEFAULT_TEMPLATE_FILE)
    };
  }
  ensureTemplateLibrary() {
    const runtimeRoot = this.getRuntimeRoot();
    const templateRoot = this.getTemplateRoot();
    if (!runtimeRoot || !templateRoot) {
      return null;
    }
    const bundled = path3.join(runtimeRoot, "Word-Template");
    fs3.mkdirSync(templateRoot, { recursive: true });
    for (const name of fs3.readdirSync(bundled)) {
      if (name.startsWith("~$") || !name.toLowerCase().endsWith(".docx")) {
        continue;
      }
      const source = path3.join(bundled, name);
      const destination = path3.join(templateRoot, name);
      if (!fs3.existsSync(destination)) {
        fs3.copyFileSync(source, destination);
      }
    }
    return templateRoot;
  }
  getReleaseRepository() {
    const saved = String(this.exportSettings?.repository || "").trim();
    if (saved) {
      return saved;
    }
    const stamped = String(
      true ? "" : ""
    ).trim();
    return stamped;
  }
  runtimeStatus(target = this.getRuntimeTarget(), expectedVersion = this.manifest.version) {
    const root = this.getRuntimeRoot();
    if (!root) {
      return {
        ready: false,
        message: this.t("runtime.status.noLocalFs")
      };
    }
    const compatibilityError = this.runtimeCompatibilityError(target);
    if (compatibilityError) {
      return { ready: false, message: compatibilityError };
    }
    const runtimePaths = this.runtimePaths(root, target);
    const required = [
      runtimePaths.manifest,
      runtimePaths.exporter,
      runtimePaths.recolor,
      runtimePaths.doctor,
      runtimePaths.pandoc,
      runtimePaths.crossref,
      runtimePaths.python,
      runtimePaths.template
    ];
    const missing = required.filter((file) => !fs3.existsSync(file));
    if (missing.length) {
      return {
        ready: false,
        message: this.t("runtime.status.incomplete", {
          target: target.label,
          count: missing.length
        })
      };
    }
    try {
      const manifest = JSON.parse(
        fs3.readFileSync(runtimePaths.manifest, "utf8")
      );
      if (manifest.version !== expectedVersion) {
        return {
          ready: false,
          message: this.t("runtime.status.versionMismatch", {
            runtimeVersion: manifest.version || this.t("common.unknown"),
            pluginVersion: expectedVersion
          })
        };
      }
      if (manifest.platform !== target.id) {
        return {
          ready: false,
          message: this.t("runtime.status.platformMismatch", {
            installed: manifest.platform || this.t("common.unknown"),
            required: target.id
          })
        };
      }
      return {
        ready: true,
        message: this.t("runtime.status.installed", {
          target: target.label,
          version: manifest.version || this.t("common.unknown")
        })
      };
    } catch (error) {
      return {
        ready: false,
        message: this.t("runtime.status.manifestDamaged", {
          message: errorMessage2(error)
        })
      };
    }
  }
  runtimeStatusText() {
    return this.runtimeStatus().message;
  }
  async askRepository(initialValue = "") {
    return await new Promise((resolve2) => {
      new TextInputModal(
        this,
        "repositoryModal.title",
        "repositoryModal.desc",
        initialValue,
        resolve2
      ).open();
    });
  }
  isRuntimeInstalling() {
    const key = this.getPluginRoot() || this.manifest.id;
    return Boolean(runtimeInstallRegistry()[key]);
  }
  installRuntime() {
    const key = this.getPluginRoot() || this.manifest.id;
    return runSingleFlight(
      runtimeInstallRegistry(),
      key,
      () => this.installRuntimeOnce(),
      () => {
        new import_obsidian2.Notice(this.t("runtime.install.duplicate"), 8e3);
      }
    );
  }
  async installRuntimeOnce() {
    const t = this.t.bind(this);
    const target = this.getRuntimeTarget();
    const compatibilityError = this.runtimeCompatibilityError(target);
    if (compatibilityError) {
      new import_obsidian2.Notice(t("runtime.install.cannotInstall", {
        message: compatibilityError
      }), 12e3);
      return false;
    }
    const pluginRoot = this.getPluginRoot();
    if (!pluginRoot) {
      new import_obsidian2.Notice(t("runtime.install.noLocalFs"));
      return false;
    }
    let repository = this.getReleaseRepository();
    try {
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
        repository = await this.askRepository(repository);
        if (!repository) {
          new import_obsidian2.Notice(t("runtime.install.cancelled"));
          return false;
        }
        if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
          new import_obsidian2.Notice(t("runtime.install.invalidRepository"), 1e4);
          return false;
        }
        this.exportSettings.repository = repository;
        await this.saveData(this.exportSettings);
      }
    } catch (error) {
      new import_obsidian2.Notice(t("runtime.install.saveRepositoryFailed", {
        message: errorMessage2(error)
      }), 12e3);
      return false;
    }
    const version = this.manifest.version || PLUGIN_VERSION;
    const assetUrl = `https://github.com/${repository}/releases/download/${version}/${target.asset}`;
    const checksumUrl = `https://github.com/${repository}/releases/download/${version}/SHA256SUMS-${target.id}.txt`;
    const runtimePath = path3.join(pluginRoot, "runtime");
    let workspace = null;
    let installLock = null;
    let progressStageCode = "prepare";
    let progressStage = t("runtime.install.stage.prepare");
    let progressDetail = "";
    let downloadModal = null;
    let downloadController = null;
    let oldRuntimeBackedUp = false;
    let newRuntimeActivated = false;
    let committed = false;
    let rollbackSucceeded = false;
    const setProgress = (stageCode, stageKey, detailKey = "", params = {}) => {
      progressStageCode = stageCode;
      progressStage = t(stageKey, params);
      progressDetail = detailKey ? t(detailKey, params) : "";
      downloadModal?.setStage(stageKey, detailKey, params);
    };
    try {
      installLock = acquireRuntimeInstallLock(pluginRoot);
      workspace = createRuntimeInstallWorkspace(
        pluginRoot,
        target.id,
        target.asset
      );
      downloadModal = new RuntimeDownloadModal(this, target, version);
      this.activeRuntimeDownloadModal = downloadModal;
      downloadModal.open();
      setProgress("checksum", "runtimeDownload.checksum");
      let downloadResult;
      for (; ; ) {
        downloadController = new AbortController();
        this.activeRuntimeDownloadController = downloadController;
        downloadModal.setController(downloadController);
        try {
          downloadResult = await downloadRuntimeAssetWithRetry({
            assetUrl,
            checksumUrl,
            assetName: target.asset,
            partPath: workspace.partialZipPath,
            bufferedRequest: obsidianBufferedRequest,
            signal: downloadController.signal,
            maxAttempts: RUNTIME_DOWNLOAD_MAX_ATTEMPTS,
            onProgress: (progress) => {
              if (progressStageCode !== "download") {
                setProgress(
                  "download",
                  "runtime.install.stage.download",
                  "runtime.install.detail.download",
                  {
                    target: target.label,
                    version,
                    size: target.sizeHint
                  }
                );
              }
              downloadModal?.updateDownloadProgress(progress);
            },
            onRetry: (_error, nextAttempt, maxAttempts) => {
              downloadModal?.setRetrying(nextAttempt, maxAttempts);
            }
          });
          break;
        } catch (error) {
          if (isManuallyRetryableRuntimeDownloadError(error) && !downloadModal.closed) {
            const retry = await downloadModal.requestRetry(error);
            if (retry) {
              setProgress("checksum", "runtimeDownload.checksum");
              continue;
            }
          }
          throw error;
        } finally {
          downloadController = null;
          this.activeRuntimeDownloadController = null;
          downloadModal.setController(null);
        }
      }
      downloadModal.setDownloadComplete();
      setProgress(
        "validate-download",
        "runtime.install.stage.validateDownload",
        "runtime.install.detail.validateDownload"
      );
      const archiveSize = finalizeDownloadedArchive(
        workspace,
        downloadResult.receivedBytes,
        t
      );
      fs3.mkdirSync(workspace.stagePath, { recursive: true });
      setProgress(
        "extract",
        "runtime.install.stage.extract",
        "runtime.install.detail.extract",
        { size: formatMegabytes(archiveSize) }
      );
      const extractResult = process.platform === "win32" ? await runProcess(
        "powershell.exe",
        [
          "-NoProfile",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          "Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force",
          workspace.zipPath,
          workspace.stagePath
        ],
        { cwd: pluginRoot }
      ) : await runProcess(
        "/usr/bin/ditto",
        ["-x", "-k", workspace.zipPath, workspace.stagePath],
        { cwd: pluginRoot }
      );
      if (extractResult.code !== 0) {
        throw new Error(
          extractResult.output.trim() || t("runtime.install.extractFailed", { code: extractResult.code })
        );
      }
      setProgress(
        "validate-package",
        "runtime.install.stage.validatePackage",
        "runtime.install.detail.validatePackage"
      );
      const payloadPath = path3.join(workspace.stagePath, "runtime");
      const payloadManifestPath = path3.join(
        payloadPath,
        RUNTIME_MANIFEST
      );
      if (!fs3.existsSync(payloadManifestPath)) {
        throw new Error(t("runtime.install.manifestMissing"));
      }
      const payloadManifest = JSON.parse(
        fs3.readFileSync(payloadManifestPath, "utf8")
      );
      if (payloadManifest.version !== version || payloadManifest.platform !== target.id) {
        throw new Error(
          t("runtime.install.packageMismatch", {
            version: payloadManifest.version || t("common.unknown"),
            platform: payloadManifest.platform || t("common.unknown")
          })
        );
      }
      setProgress(
        "activate",
        "runtime.install.stage.replace",
        "runtime.install.detail.replace"
      );
      if (fs3.existsSync(runtimePath)) {
        fs3.renameSync(runtimePath, workspace.backupPath);
        oldRuntimeBackedUp = true;
      }
      fs3.renameSync(payloadPath, runtimePath);
      newRuntimeActivated = true;
      setProgress(
        "setup",
        "runtime.install.stage.configurePython",
        "runtime.install.detail.configurePython"
      );
      let setupResult;
      if (process.platform === "win32") {
        const setupPath = path3.join(
          runtimePath,
          "scripts",
          "setup-runtime.ps1"
        );
        setupResult = await runProcess(
          "powershell.exe",
          [
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            setupPath
          ],
          { cwd: runtimePath }
        );
      } else {
        const executablePaths = [
          path3.join(runtimePath, "scripts", "setup-runtime.sh"),
          path3.join(runtimePath, "scripts", "doctor.sh"),
          path3.join(runtimePath, "scripts", "MD\u5BFC\u51FAWord\u6A21\u677F.command"),
          path3.join(
            runtimePath,
            "Pandoc&pandoc-crossref",
            target.pandocFile
          ),
          path3.join(
            runtimePath,
            "Pandoc&pandoc-crossref",
            target.crossrefFile
          )
        ];
        for (const executablePath of executablePaths) {
          if (fs3.existsSync(executablePath)) {
            fs3.chmodSync(executablePath, 493);
          }
        }
        setupResult = await runProcess(
          "/bin/bash",
          [path3.join(runtimePath, "scripts", "setup-runtime.sh")],
          { cwd: runtimePath }
        );
      }
      if (setupResult.code !== 0) {
        throw new Error(
          setupResult.output.trim() || t("runtime.install.pythonFailed", { code: setupResult.code })
        );
      }
      setProgress(
        "doctor",
        "runtime.install.stage.doctor",
        "runtime.install.detail.doctor"
      );
      const status = this.runtimeStatus(target, version);
      if (!status.ready) {
        throw new Error(status.message);
      }
      this.ensureTemplateLibrary();
      committed = true;
      downloadModal?.completeInstall();
      new import_obsidian2.Notice(t("runtime.install.complete", { status: status.message }), 1e4);
      return true;
    } catch (error) {
      if (committed) {
        console.warn("\u8FD0\u884C\u65F6\u5DF2\u5B89\u88C5\uFF0C\u4F46\u5B8C\u6210\u63D0\u793A\u5931\u8D25\uFF1A", error);
        return true;
      }
      if (error instanceof RuntimeDownloadError && error.code === "ABORTED") {
        downloadModal?.setCancelled();
        new import_obsidian2.Notice(t("runtimeDownload.cancelled"), 1e4);
      }
      const failureMessage = error instanceof RuntimeDownloadError ? localizedRuntimeDownloadError(this, error, version, target.asset) : errorMessage2(error);
      let recoveryMessage = "";
      try {
        if (newRuntimeActivated && fs3.existsSync(runtimePath)) {
          fs3.rmSync(runtimePath, { recursive: true, force: true });
        }
        if (oldRuntimeBackedUp) {
          if (!workspace || !fs3.existsSync(workspace.backupPath)) {
            throw new Error(t("runtime.install.backupMissing"));
          }
          if (fs3.existsSync(runtimePath)) {
            fs3.rmSync(runtimePath, { recursive: true, force: true });
          }
          fs3.renameSync(workspace.backupPath, runtimePath);
        }
        rollbackSucceeded = true;
      } catch (rollbackError) {
        recoveryMessage = t("runtime.install.restoreFailed", {
          message: errorMessage2(rollbackError)
        });
      }
      if (error instanceof RuntimeInstallBusyError) {
        new import_obsidian2.Notice(t("runtime.install.busy"), 1e4);
        return false;
      }
      if (error instanceof RuntimeDownloadError && error.code === "ABORTED") {
        return false;
      }
      const downloadFailure = ["checksum", "download", "validate-download"].includes(progressStageCode);
      const retryHint = downloadFailure ? t("runtime.install.networkHint") : t("runtime.install.retryHint");
      const backupAvailable = !rollbackSucceeded && oldRuntimeBackedUp && workspace && fs3.existsSync(workspace.backupPath);
      const backupHint = backupAvailable ? t("runtime.install.backupRetained", { path: workspace.backupPath }) : !rollbackSucceeded ? t("runtime.install.cleanupIncomplete") : "";
      if (!(error instanceof RuntimeDownloadError && error.code === "ABORTED")) {
        downloadModal?.fail(
          error,
          downloadFailure ? "runtimeDownload.failed" : "runtime.install.cannotInstall"
        );
      }
      new import_obsidian2.Notice(
        t("runtime.install.failed", {
          stage: progressStage,
          message: failureMessage,
          hint: `${retryHint}${backupHint}`,
          recovery: recoveryMessage
        }),
        2e4
      );
      return false;
    } finally {
      this.activeRuntimeDownloadController = null;
      if (this.activeRuntimeDownloadModal === downloadModal) {
        this.activeRuntimeDownloadModal = null;
      }
      if (committed || rollbackSucceeded || !oldRuntimeBackedUp) {
        const cleanupError = removeTreeBestEffort(workspace?.root || null);
        if (cleanupError) {
          console.warn(t("runtime.install.cleanupFailed", {
            message: errorMessage2(cleanupError)
          }));
        }
      }
      const lockError = releaseRuntimeInstallLock(installLock);
      if (lockError) {
        console.warn(t("runtime.install.lockCleanupFailed", {
          message: errorMessage2(lockError)
        }));
      }
    }
  }
  async runDoctor() {
    const t = this.t.bind(this);
    const root = this.getRuntimeRoot();
    const status = this.runtimeStatus();
    if (!root || !status.ready) {
      new import_obsidian2.Notice(t("runtime.doctor.notReady", { status: status.message }), 12e3);
      return false;
    }
    const runtimePaths = this.runtimePaths(root);
    if (!runtimePaths || !fs3.existsSync(runtimePaths.doctor) || !fs3.existsSync(runtimePaths.python)) {
      new import_obsidian2.Notice(t("runtime.doctor.missing"));
      return false;
    }
    const result = await runProcess(
      runtimePaths.python,
      ["-B", runtimePaths.doctor],
      {
        cwd: root,
        env: {
          ...process.env,
          PYTHONUTF8: "1",
          PYTHONDONTWRITEBYTECODE: "1"
        }
      }
    );
    const summary = result.output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-6).join("\uFF1B");
    new import_obsidian2.Notice(
      result.code === 0 ? t("runtime.doctor.passed", { summary }) : t("runtime.doctor.failed", { summary }),
      15e3
    );
    return result.code === 0;
  }
  selectExportMode() {
    return new Promise((resolve2) => {
      new ExportModeModal(this, resolve2).open();
    });
  }
  async selectFormatSettings(templateFiles, outputName, options = {}) {
    const zoteroStyles = options.zoteroStyles || await discoverZoteroStyles();
    return new Promise((resolve2) => {
      new FormatSettingsModal(
        this,
        {
          presets: this.exportSettings.presets,
          templateFiles,
          outputName,
          figureReflowDefault: options.figureReflowDefault === true,
          documentLanguage: options.documentLanguage,
          citationReport: options.citationReport,
          zoteroStyles
        },
        resolve2
      ).open();
    });
  }
  selectWordFile(files) {
    return new Promise((resolve2) => {
      new WordFileSelectModal(this, files, resolve2).open();
    });
  }
  async recolorWordCitationsForCurrentFile(file) {
    const t = this.t.bind(this);
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new import_obsidian2.Notice(t("recolor.noLocalFs"));
      return;
    }
    let runtimeStatus = this.runtimeStatus();
    if (!runtimeStatus.ready) {
      const installed = await this.installRuntime();
      if (!installed) {
        return;
      }
      runtimeStatus = this.runtimeStatus();
      if (!runtimeStatus.ready) {
        new import_obsidian2.Notice(
          t("recolor.runtimeUnavailable", { status: runtimeStatus.message }),
          12e3
        );
        return;
      }
    }
    const runtimePaths = this.runtimePaths(this.getRuntimeRoot());
    if (!runtimePaths || !fs3.existsSync(runtimePaths.python) || !fs3.existsSync(runtimePaths.recolor)) {
      new import_obsidian2.Notice(t("recolor.toolMissing"));
      return;
    }
    const markdownPath = path3.join(adapter.getBasePath(), file.path);
    const directory = path3.dirname(markdownPath);
    let wordFiles = [];
    try {
      wordFiles = fs3.readdirSync(directory, { withFileTypes: true }).filter(
        (entry) => entry.isFile() && !entry.name.startsWith("~$") && entry.name.toLowerCase().endsWith(".docx")
      ).map((entry) => {
        const wordPath = path3.join(directory, entry.name);
        const modified = fs3.statSync(wordPath).mtime;
        return {
          path: wordPath,
          modified,
          label: `${entry.name} \xB7 ` + modified.toLocaleString(
            this.getLanguage() === "en" ? "en-US" : "zh-CN",
            { hour12: false }
          )
        };
      }).sort((a, b) => b.modified.getTime() - a.modified.getTime());
    } catch (error) {
      new import_obsidian2.Notice(
        t("recolor.readFolderFailed", { message: errorMessage2(error) }),
        1e4
      );
      return;
    }
    if (!wordFiles.length) {
      new import_obsidian2.Notice(t("recolor.noFiles"));
      return;
    }
    const selectedPath = await this.selectWordFile(wordFiles);
    if (!selectedPath) {
      new import_obsidian2.Notice(t("recolor.cancelled"));
      return;
    }
    if (!fs3.existsSync(selectedPath)) {
      new import_obsidian2.Notice(t("recolor.fileMissing", { path: selectedPath }), 1e4);
      return;
    }
    const requestedOutput = path3.join(
      path3.dirname(selectedPath),
      `${path3.basename(selectedPath, path3.extname(selectedPath))}-\u5F15\u6587\u84DD\u8272.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutput);
    const failureLogPath = path3.join(
      path3.dirname(selectedPath),
      `${path3.basename(selectedPath, path3.extname(selectedPath))}-\u5F15\u6587\u7740\u8272\u5931\u8D25.log.txt`
    );
    if (fs3.existsSync(failureLogPath)) {
      try {
        fs3.unlinkSync(failureLogPath);
      } catch {
      }
    }
    const progressModal = new ExportProgressModal(
      this,
      path3.basename(selectedPath),
      {
        titleKey: "progressModal.recolor.title",
        successKey: "progressModal.recolor.success",
        failureKey: "progressModal.recolor.failure"
      }
    );
    progressModal.open();
    progressModal.updateProgress(
      1,
      t("recolor.launchStage"),
      t("recolor.launchDetail"),
      "info",
      {
        stageKey: "recolor.launchStage",
        detailKey: "recolor.launchDetail"
      }
    );
    const recolorArgs = [
      "-B",
      runtimePaths.recolor,
      selectedPath,
      "--output",
      outputPath
    ];
    if (this.exportSettings.autoOpen === false) {
      recolorArgs.push("--no-open");
    }
    let output = "";
    let failedToStart = false;
    const child = (0, import_node_child_process.spawn)(runtimePaths.python, recolorArgs, {
      cwd: path3.dirname(runtimePaths.recolor),
      env: {
        ...process.env,
        PYTHONUTF8: "1",
        PYTHONDONTWRITEBYTECODE: "1",
        PYTHONUNBUFFERED: "1",
        MD_EXPORT_WORD_FAILURE_LOG: failureLogPath
      },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });
    const lineBuffers = { stdout: "", stderr: "" };
    const collectOutput = (data, streamName) => {
      const text = data.toString("utf8");
      output += text;
      if (output.length > 12e3) {
        output = output.slice(-12e3);
      }
      lineBuffers[streamName] += text;
      const lines = lineBuffers[streamName].split(/\r?\n/);
      lineBuffers[streamName] = lines.pop() || "";
      for (const line of lines) {
        progressModal.consumeLine(line, streamName === "stderr");
      }
    };
    const flushLineBuffers = () => {
      for (const streamName of ["stdout", "stderr"]) {
        if (lineBuffers[streamName]) {
          progressModal.consumeLine(
            lineBuffers[streamName],
            streamName === "stderr"
          );
          lineBuffers[streamName] = "";
        }
      }
    };
    child.stdout.on("data", (data) => collectOutput(data, "stdout"));
    child.stderr.on("data", (data) => collectOutput(data, "stderr"));
    child.once("error", (error) => {
      failedToStart = true;
      const launchError = t("recolor.launchFailed", {
        message: errorMessage2(error)
      });
      output += `
${launchError}
`;
      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
      }
      progressModal.fail(launchError, failureLogPath);
      new import_obsidian2.Notice(launchError, 1e4);
    });
    child.once("close", (code) => {
      flushLineBuffers();
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch ? path3.basename(wordMatch[1].trim()) : path3.basename(outputPath);
        if (fs3.existsSync(failureLogPath)) {
          try {
            fs3.unlinkSync(failureLogPath);
          } catch {
          }
        }
        progressModal.complete(wordName);
        new import_obsidian2.Notice(t("recolor.completed", { file: wordName }), 1e4);
        return;
      }
      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
      }
      const details = humanizeProcessOutput(output, this.getLanguage()).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-4).join(this.getLanguage() === "en" ? "; " : "\uFF1B");
      const failure = details ? t("recolor.failedWithDetails", { code, details }) : t("recolor.failedWithCode", { code });
      progressModal.fail(
        failure,
        failureLogPath
      );
      new import_obsidian2.Notice(failure, 12e3);
    });
    new import_obsidian2.Notice(t("recolor.running", { file: path3.basename(outputPath) }), 8e3);
  }
  async exportCurrentFile(file, options = {}) {
    const t = this.t.bind(this);
    const exportMode = await this.selectExportMode();
    if (!exportMode) {
      new import_obsidian2.Notice(t("export.cancelled"));
      return;
    }
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new import_obsidian2.Notice(t("export.noLocalFs"));
      return;
    }
    const vaultPath = adapter.getBasePath();
    const markdownPath = path3.join(vaultPath, file.path);
    let markdownSource = "";
    try {
      markdownSource = await this.app.vault.cachedRead(file);
    } catch (error) {
      new import_obsidian2.Notice(
        t("export.readMarkdownFailed", { message: errorMessage2(error) })
      );
      return;
    }
    const defaultOutputName = safeDefaultOutputBaseName(
      markdownArticleTitle(markdownSource, file.basename),
      file.basename,
      t
    );
    let runtimeStatus = this.runtimeStatus();
    if (!runtimeStatus.ready) {
      const installed = await this.installRuntime();
      if (!installed) {
        return;
      }
      runtimeStatus = this.runtimeStatus();
      if (!runtimeStatus.ready) {
        new import_obsidian2.Notice(
          t("export.runtimeUnavailable", { status: runtimeStatus.message }),
          12e3
        );
        return;
      }
    }
    const pandocRoot = this.getRuntimeRoot();
    const runtimePaths = this.runtimePaths(pandocRoot);
    const templateDir = this.ensureTemplateLibrary();
    if (!templateDir) {
      new import_obsidian2.Notice(t("export.templateDirectoryFailed"));
      return;
    }
    if (!runtimePaths || !fs3.existsSync(runtimePaths.python) || !fs3.existsSync(runtimePaths.exporter)) {
      new import_obsidian2.Notice(t("export.pythonMissing"));
      return;
    }
    let templateFiles = [];
    try {
      templateFiles = fs3.readdirSync(templateDir).filter(
        (name) => !name.startsWith("~$") && name.toLowerCase().endsWith(".docx")
      ).sort((a, b) => a.localeCompare(b, "zh-CN"));
    } catch (error) {
      new import_obsidian2.Notice(
        t("export.readTemplatesFailed", { message: errorMessage2(error) })
      );
      return;
    }
    if (!templateFiles.length) {
      new import_obsidian2.Notice(t("export.noTemplates", { path: templateDir }));
      return;
    }
    const citationViewPlugin = this.app.plugins.plugins["paper-caption-preview"];
    const citationSource = fs3.readFileSync(markdownPath, "utf8");
    const citationReport = citationViewPlugin?.citationLanguageReport ? await citationViewPlugin.citationLanguageReport(file, citationSource) : { style: this.app.metadataCache.getFileCache(file)?.frontmatter?.csl || this.app.plugins.plugins["obsidian-pandoc-reference-list"]?.settings?.cslStylePath || "" };
    const formatSelection = await this.selectFormatSettings(
      templateFiles,
      defaultOutputName,
      {
        figureReflowDefault: options.figureReflowDefault === true,
        citationReport,
        documentLanguage: (() => {
          const source = fs3.readFileSync(markdownPath, "utf8");
          const viewPlugin = this.app.plugins.plugins["paper-caption-preview"];
          if (viewPlugin?.languageFor) return viewPlugin.languageFor(file, source) === "en" ? "en-US" : "zh-CN";
          const fm = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
          if (fm.lang) return fm.lang;
          if (fm.cssclasses?.includes("en-doc")) return "en-US";
          const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "").replace(/!\[[^\r\n]*|\[@[^\]]*\]|https?:\/\/\S+|<[^>]*>/g, "").slice(0, 3e4);
          const han = (body.match(/[\p{Script=Han}]/gu) || []).length, latin = (body.match(/[A-Za-z]/g) || []).length;
          return latin >= 40 && han / (han + latin) < 0.15 ? "en-US" : "zh-CN";
        })()
      }
    );
    if (!formatSelection) {
      new import_obsidian2.Notice(t("export.cancelled"));
      return;
    }
    const templatePath = path3.join(
      templateDir,
      formatSelection.templateFile
    );
    if (!fs3.existsSync(templatePath)) {
      new import_obsidian2.Notice(t("export.templateMissing", { path: templatePath }));
      return;
    }
    if (formatSelection.savePreset) {
      this.exportSettings.presets[formatSelection.presetName] = {
        name: formatSelection.presetName,
        config: formatSelection.config,
        templateFile: formatSelection.templateFile
      };
      await this.saveData(this.exportSettings);
      new import_obsidian2.Notice(
        t("export.presetSaved", { name: formatSelection.presetName })
      );
    }
    const requestedOutputPath = path3.join(
      path3.dirname(markdownPath),
      `${formatSelection.outputName}.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutputPath);
    if (outputPath !== requestedOutputPath) {
      new import_obsidian2.Notice(
        t("export.outputRenamed", { file: path3.basename(outputPath) }),
        1e4
      );
    }
    let output = "";
    let failedToStart = false;
    const failureLogPath = path3.join(
      path3.dirname(markdownPath),
      `${file.basename}-\u5BFC\u51FA\u5931\u8D25.log.txt`
    );
    if (fs3.existsSync(failureLogPath)) {
      try {
        fs3.unlinkSync(failureLogPath);
      } catch {
      }
    }
    const progressModal = new ExportProgressModal(this, file.name);
    progressModal.open();
    const modeLabel = t(`export.mode.${exportMode}`);
    progressModal.updateProgress(
      1,
      t("export.launchStage"),
      t("export.launchDetail", {
        mode: modeLabel,
        format: formatSelection.displayName
      }),
      "info",
      {
        stageKey: "export.launchStage",
        detailKey: "export.launchDetail",
        params: {
          mode: exportMode,
          format: formatSelection.displayName
        }
      }
    );
    const exporterArgs = [
      "-B",
      runtimePaths.exporter,
      markdownPath,
      "--yes",
      "--mode",
      exportMode
    ];
    if (this.exportSettings.autoOpen === false) {
      exporterArgs.push("--no-open");
    }
    const child = (0, import_node_child_process.spawn)(
      runtimePaths.python,
      exporterArgs,
      {
        cwd: path3.dirname(runtimePaths.exporter),
        env: {
          ...process.env,
          PYTHONUTF8: "1",
          PYTHONDONTWRITEBYTECODE: "1",
          PYTHONUNBUFFERED: "1",
          MD_EXPORT_WORD_FAILURE_LOG: failureLogPath,
          MD_EXPORT_WORD_OUTPUT: outputPath,
          MD_EXPORT_WORD_MODE: exportMode,
          MD_EXPORT_WORD_TEMPLATE: templatePath,
          MD_EXPORT_WORD_FORMAT_JSON: JSON.stringify(formatSelection.config),
          MD_EXPORT_WORD_CSL: formatSelection.citationStyle?.path || "",
          MD_EXPORT_WORD_CSL_RENDER: formatSelection.citationStyle?.renderPath || "",
          MD_EXPORT_WORD_CITATION_DISPLAY: formatSelection.citationDisplay,
          MD_EXPORT_WORD_PANDOC: runtimePaths.pandoc,
          MD_EXPORT_WORD_CROSSREF: runtimePaths.crossref
        },
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      }
    );
    const lineBuffers = { stdout: "", stderr: "" };
    const collectOutput = (data, streamName) => {
      const text = data.toString("utf8");
      output += text;
      if (output.length > 12e3) {
        output = output.slice(-12e3);
      }
      lineBuffers[streamName] += text;
      const lines = lineBuffers[streamName].split(/\r?\n/);
      lineBuffers[streamName] = lines.pop() || "";
      for (const line of lines) {
        progressModal.consumeLine(line, streamName === "stderr");
      }
    };
    const flushLineBuffers = () => {
      for (const streamName of ["stdout", "stderr"]) {
        if (lineBuffers[streamName]) {
          progressModal.consumeLine(
            lineBuffers[streamName],
            streamName === "stderr"
          );
          lineBuffers[streamName] = "";
        }
      }
    };
    child.stdout.on("data", (data) => collectOutput(data, "stdout"));
    child.stderr.on("data", (data) => collectOutput(data, "stderr"));
    child.stdin.on("error", () => {
    });
    child.once("error", (error) => {
      failedToStart = true;
      const launchError = t("export.launchFailed", {
        message: errorMessage2(error)
      });
      output += `
${launchError}
`;
      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
      }
      progressModal.fail(launchError, failureLogPath);
      new import_obsidian2.Notice(launchError);
    });
    child.once("close", (code) => {
      flushLineBuffers();
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch ? path3.basename(wordMatch[1].trim()) : path3.basename(outputPath);
        if (fs3.existsSync(failureLogPath)) {
          try {
            fs3.unlinkSync(failureLogPath);
          } catch {
          }
        }
        progressModal.complete(wordName);
        new import_obsidian2.Notice(t("export.completed", { file: wordName }), 8e3);
        return;
      }
      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
      }
      const details = humanizeProcessOutput(output, this.getLanguage()).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-4).join(this.getLanguage() === "en" ? "; " : "\uFF1B");
      const failure = details ? t("export.failedWithDetails", { code, details }) : t("export.failedWithCode", { code });
      progressModal.fail(
        failure,
        failureLogPath
      );
      new import_obsidian2.Notice(failure, 12e3);
    });
    child.stdin.end();
    new import_obsidian2.Notice(
      t("export.running", {
        mode: modeLabel,
        format: formatSelection.displayName,
        file: path3.basename(outputPath)
      })
    );
  }
};
