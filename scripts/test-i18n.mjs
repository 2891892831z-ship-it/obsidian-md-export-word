import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import esbuild from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const temporary = fs.mkdtempSync(
  path.join(os.tmpdir(), "md-export-word-i18n-tests-")
);
const output = path.join(temporary, "i18n.test.mjs");

try {
  await esbuild.build({
    entryPoints: [path.join(root, "tests", "i18n.test.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    outfile: output,
    logLevel: "silent"
  });
  const result = spawnSync(process.execPath, ["--test", output], {
    cwd: root,
    stdio: "inherit"
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exitCode = result.status || 1;
  }
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
