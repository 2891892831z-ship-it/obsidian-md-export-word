import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
const versions = JSON.parse(fs.readFileSync("versions.json", "utf8"));
const runtime = JSON.parse(
  fs.readFileSync("runtime/runtime-manifest.json", "utf8")
);

manifest.version = packageJson.version;
runtime.version = packageJson.version;
versions[packageJson.version] = manifest.minAppVersion;

fs.writeFileSync("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync("versions.json", `${JSON.stringify(versions, null, 2)}\n`);
fs.writeFileSync(
  "runtime/runtime-manifest.json",
  `${JSON.stringify(runtime, null, 2)}\n`
);
