import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import test from "node:test";
import {
  RuntimeInstallBusyError,
  acquireRuntimeInstallLock,
  createRuntimeInstallWorkspace,
  formatElapsed,
  releaseRuntimeInstallLock,
  runSingleFlight,
  validateRuntimeArchive,
  withTimeout,
  writeRuntimeArchive
} from "../src/runtime-install";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

test("runSingleFlight reuses one in-flight operation", async () => {
  const owner: Record<string, Promise<unknown> | null> = {
    installPromise: null
  };
  const gate = deferred<boolean>();
  let calls = 0;
  let duplicates = 0;
  const task = () => {
    calls += 1;
    return gate.promise;
  };

  const first = runSingleFlight(owner, "installPromise", task);
  const second = runSingleFlight(
    owner,
    "installPromise",
    task,
    () => {
      duplicates += 1;
    }
  );
  assert.equal(first, second);
  await Promise.resolve();
  assert.equal(calls, 1);
  assert.equal(duplicates, 1);

  gate.resolve(true);
  assert.equal(await first, true);
  assert.equal(owner.installPromise, null);
});

test("runSingleFlight unlocks after failure", async () => {
  const owner: Record<string, Promise<unknown> | null> = {
    installPromise: null
  };
  let calls = 0;
  await assert.rejects(
    runSingleFlight(owner, "installPromise", async () => {
      calls += 1;
      throw new Error("expected");
    }),
    /expected/
  );
  assert.equal(owner.installPromise, null);

  assert.equal(
    await runSingleFlight(owner, "installPromise", async () => {
      calls += 1;
      return true;
    }),
    true
  );
  assert.equal(calls, 2);
});

test("withTimeout rejects a stalled request and clears its timer", async () => {
  const gate = deferred<string>();
  let timeoutCallback: (() => void) | null = null;
  let cleared = false;
  const timers = {
    setTimeout(callback: () => void) {
      timeoutCallback = callback;
      return 1;
    },
    clearTimeout() {
      cleared = true;
    }
  } as unknown as Pick<typeof globalThis, "setTimeout" | "clearTimeout">;

  const result = withTimeout(
    gate.promise,
    300000,
    () => new Error("download timeout"),
    timers
  );
  assert.ok(timeoutCallback);
  timeoutCallback();
  await assert.rejects(result, /download timeout/);
  assert.equal(cleared, true);

  gate.resolve("late response");
  await Promise.resolve();
});

test("runtime workspaces and archive files are unique", () => {
  const parent = fs.mkdtempSync(
    path.join(os.tmpdir(), "md-export-word-install-test-")
  );
  try {
    const first = createRuntimeInstallWorkspace(
      parent,
      "macos-x64",
      "runtime.zip"
    );
    const second = createRuntimeInstallWorkspace(
      parent,
      "macos-x64",
      "runtime.zip"
    );
    assert.notEqual(first.root, second.root);
    assert.equal(path.dirname(first.zipPath), first.root);
    assert.equal(path.dirname(first.stagePath), first.root);
    assert.equal(path.dirname(first.backupPath), first.root);

    const archive = validateRuntimeArchive(
      Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x01])
    );
    assert.equal(writeRuntimeArchive(first, archive), archive.byteLength);
    assert.equal(fs.statSync(first.zipPath).size, archive.byteLength);
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test("runtime install lock blocks a second process and releases by token", () => {
  const parent = fs.mkdtempSync(
    path.join(os.tmpdir(), "md-export-word-lock-test-")
  );
  try {
    const first = acquireRuntimeInstallLock(parent, Date.now(), () => true);
    assert.throws(
      () => acquireRuntimeInstallLock(parent, Date.now(), () => true),
      RuntimeInstallBusyError
    );
    assert.equal(releaseRuntimeInstallLock(first), null);

    const second = acquireRuntimeInstallLock(parent, Date.now(), () => true);
    assert.equal(releaseRuntimeInstallLock(second), null);
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test("runtime install lock replaces a stale owner", () => {
  const parent = fs.mkdtempSync(
    path.join(os.tmpdir(), "md-export-word-stale-lock-test-")
  );
  try {
    const first = acquireRuntimeInstallLock(parent, Date.now(), () => true);
    const replacement = acquireRuntimeInstallLock(
      parent,
      Date.now(),
      () => false
    );
    assert.notEqual(first.token, replacement.token);
    assert.equal(releaseRuntimeInstallLock(replacement), null);
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test("runtime install lock never steals a fresh partial lock", () => {
  const parent = fs.mkdtempSync(
    path.join(os.tmpdir(), "md-export-word-partial-lock-test-")
  );
  try {
    fs.writeFileSync(path.join(parent, ".runtime-install.lock"), "");
    assert.throws(
      () => acquireRuntimeInstallLock(parent, Date.now(), () => false),
      RuntimeInstallBusyError
    );
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test("runtime install lock replaces an abandoned partial lock", () => {
  const parent = fs.mkdtempSync(
    path.join(os.tmpdir(), "md-export-word-old-partial-lock-test-")
  );
  try {
    const lockPath = path.join(parent, ".runtime-install.lock");
    fs.writeFileSync(lockPath, "");
    const oldTime = new Date(Date.now() - 60_000);
    fs.utimesSync(lockPath, oldTime, oldTime);

    const replacement = acquireRuntimeInstallLock(
      parent,
      Date.now(),
      () => false
    );
    assert.equal(releaseRuntimeInstallLock(replacement), null);
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test("runtime archive validation rejects an HTML response", () => {
  assert.throws(
    () => validateRuntimeArchive(Buffer.from("<!doctype html>")),
    /不是 ZIP/
  );
});

test("elapsed time remains explicit while no byte progress is available", () => {
  assert.equal(formatElapsed(12_900), "12 秒");
  assert.equal(formatElapsed(125_000), "2 分 5 秒");
});
