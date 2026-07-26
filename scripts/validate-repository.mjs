import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const errors = [];

const manifest = readJson("manifest.json");
const packageJson = readJson("package.json");
const versions = readJson("versions.json");
const runtime = readJson("runtime/runtime-manifest.json");

if (manifest.version !== packageJson.version) {
  errors.push("manifest.json 与 package.json 版本不一致");
}
if (manifest.version !== runtime.version) {
  errors.push("manifest.json 与 runtime-manifest.json 版本不一致");
}
if (versions[manifest.version] !== manifest.minAppVersion) {
  errors.push("versions.json 缺少当前版本或最低 Obsidian 版本不一致");
}
if (!/^[a-z0-9-]+$/.test(manifest.id)) {
  errors.push("manifest.id 只能使用小写字母、数字和连字符");
}

const required = [
  "src/main.ts",
  "main.js",
  "manifest.json",
  "styles.css",
  "runtime/scripts/MD导出Word模板.cmd",
  "runtime/scripts/md_export_word_template.py",
  "runtime/scripts/true_scripts.lua",
  "runtime/zotero.lua",
  "runtime/Word-Template/导出格式模板.docx",
  "README.md",
  "LICENSE"
];
for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) {
    errors.push(`缺少必要文件：${relative}`);
  }
}

const portableSources = [
  "src/main.ts",
  "runtime/scripts/MD导出Word模板.cmd",
  "runtime/scripts/md_export_word_template.py"
];
const forbidden = [
  /C:\\Users\\/i,
  /OB知识宝库/i,
  /codex-runtimes/i
];
for (const relative of portableSources) {
  const content = fs.readFileSync(path.join(root, relative), "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(content)) {
      errors.push(`发现不可移植的本机路径：${relative} (${pattern})`);
    }
  }
}

const runtimePowerShell = [
  "runtime/scripts/setup-runtime.ps1",
  "runtime/scripts/doctor.ps1"
];
for (const relative of runtimePowerShell) {
  const content = fs.readFileSync(path.join(root, relative), "utf8");
  if (Array.from(content).some((character) => character.codePointAt(0) > 127)) {
    errors.push(
      `Windows PowerShell 5 运行时脚本必须保持 ASCII：${relative}`
    );
  }
}

const markdownFiles = [];
const collectMarkdown = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectMarkdown(target);
    } else if (entry.name.toLowerCase().endsWith(".md")) {
      markdownFiles.push(target);
    }
  }
};
collectMarkdown(root);
for (const file of markdownFiles) {
  const content = fs
    .readFileSync(file, "utf8")
    .replace(/```[\s\S]*?```/g, "");
  for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1].trim().replace(/^<|>$/g, "");
    if (/^(?:https?:|mailto:|#)/i.test(link)) {
      continue;
    }
    const withoutAnchor = link.split("#", 1)[0];
    const target = path.resolve(path.dirname(file), decodeURI(withoutAnchor));
    if (!fs.existsSync(target)) {
      errors.push(
        `Markdown 本地链接不存在：${path.relative(root, file)} -> ${link}`
      );
    }
  }
}

if (errors.length) {
  console.error(errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Repository validation passed for ${manifest.id} ${manifest.version}.`);
