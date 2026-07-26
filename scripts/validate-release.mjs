import fs from "node:fs";

const tag = process.argv[2] || process.env.GITHUB_REF_NAME || "";
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

if (!tag) {
  console.error("Missing release tag.");
  process.exit(1);
}
if (tag !== manifest.version) {
  console.error(
    `Release tag (${tag}) must exactly match manifest version (${manifest.version}); do not add a v prefix.`
  );
  process.exit(1);
}
console.log(`Release tag validated: ${tag}`);
