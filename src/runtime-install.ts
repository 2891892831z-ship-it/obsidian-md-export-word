import * as fs from "node:fs";
import * as path from "node:path";

export const RUNTIME_DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1000;
const RUNTIME_INSTALL_LOCK_INITIALIZATION_GRACE_MS = 10 * 1000;

type PromiseOwner = Record<string, Promise<unknown> | null | undefined>;

export function runSingleFlight<T>(
  owner: PromiseOwner,
  key: string,
  task: () => Promise<T> | T,
  onDuplicate?: () => void
): Promise<T> {
  const current = owner[key] as Promise<T> | null | undefined;
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

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  createError: () => Error,
  timers: Pick<typeof globalThis, "setTimeout" | "clearTimeout"> = globalThis
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutId = timers.setTimeout(() => reject(createError()), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== undefined) {
      timers.clearTimeout(timeoutId);
    }
  });
}

export interface RuntimeInstallWorkspace {
  root: string;
  zipPath: string;
  partialZipPath: string;
  stagePath: string;
  backupPath: string;
}

export interface RuntimeInstallLock {
  path: string;
  token: string;
}

export class RuntimeInstallBusyError extends Error {
  constructor() {
    super(
      "检测到另一个运行时安装任务仍在执行，请等待其完成后再试"
    );
    this.name = "RuntimeInstallBusyError";
  }
}

function processIsAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (
      error instanceof Error &&
      "code" in error &&
      error.code !== "ESRCH"
    );
  }
}

export function acquireRuntimeInstallLock(
  pluginRoot: string,
  now = Date.now(),
  isProcessAlive: (pid: number) => boolean = processIsAlive
): RuntimeInstallLock {
  const lockPath = path.join(pluginRoot, ".runtime-install.lock");
  const token =
    `${process.pid}-${now}-` +
    Math.random().toString(36).slice(2);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const descriptor = fs.openSync(lockPath, "wx");
      let writeError: unknown = null;
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
          // A malformed lock is treated as stale on the next attempt.
        }
        throw writeError;
      }
      return { path: lockPath, token };
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        error.code !== "EEXIST"
      ) {
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
          if (
            statError instanceof Error &&
            "code" in statError &&
            statError.code === "ENOENT"
          ) {
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
        if (
          cleanupError instanceof Error &&
          "code" in cleanupError &&
          cleanupError.code === "ENOENT"
        ) {
          continue;
        }
        throw new RuntimeInstallBusyError();
      }
    }
  }

  throw new RuntimeInstallBusyError();
}

export function releaseRuntimeInstallLock(
  lock: RuntimeInstallLock | null
): Error | null {
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
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}

export function createRuntimeInstallWorkspace(
  pluginRoot: string,
  targetId: string,
  assetName: string
): RuntimeInstallWorkspace {
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

export function validateRuntimeArchive(
  input: ArrayBuffer | Uint8Array
): Buffer {
  const archive =
    input instanceof ArrayBuffer
      ? Buffer.from(input)
      : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  if (archive.byteLength < 4) {
    throw new Error("下载文件为空或不完整");
  }

  const signature = archive.readUInt32LE(0);
  const zipSignatures = new Set([0x04034b50, 0x06054b50, 0x08074b50]);
  if (!zipSignatures.has(signature)) {
    throw new Error(
      "GitHub 返回的内容不是 ZIP，可能被网络代理或登录页面替换"
    );
  }
  return archive;
}

export function writeRuntimeArchive(
  workspace: RuntimeInstallWorkspace,
  archive: Buffer
): number {
  fs.writeFileSync(workspace.partialZipPath, archive, { flag: "wx" });
  const partialSize = fs.statSync(workspace.partialZipPath).size;
  if (partialSize !== archive.byteLength) {
    throw new Error(
      `运行时 ZIP 写入不完整：应为 ${archive.byteLength} 字节，` +
        `实际为 ${partialSize} 字节`
    );
  }

  fs.renameSync(workspace.partialZipPath, workspace.zipPath);
  const finalSize = fs.statSync(workspace.zipPath).size;
  if (finalSize !== archive.byteLength) {
    throw new Error("运行时 ZIP 在解压前丢失或大小发生变化");
  }
  return finalSize;
}

export function removeTreeBestEffort(target: string | null): Error | null {
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

export function formatElapsed(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} 分 ${seconds} 秒` : `${seconds} 秒`;
}

export function formatMegabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
