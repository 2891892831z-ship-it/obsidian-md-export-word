import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const start = source.indexOf("function visibleMarkdownHeading(");
const end = source.indexOf("function isInvalidWindowsFileNameCharacter(", start);
assert.ok(start >= 0 && end > start);
const context = vm.createContext({});
vm.runInContext(source.slice(start, end), context);
for (const [markdown, expected] of [
  ["---\ntitle: Thesis\n---\n# 第1章 绪论\n# 第2章 方法", "Thesis"],
  ["---\ntitle: Thesis\n---\n# Chapter I Introduction", "Thesis"],
  ["---\ntitle: Article\n---\n# Article\n# Background\n# Methods", "Article"],
  ["---\ntitle: Article\n---\n# Abstract\n# Methods", "Article"],
  ["---\ntitle: Metadata\n---\n````\n<!--\n%%\n$$\n```\n# Fake\n````\n# Actual title", "Actual title"],
  ["<!--\n```\n# Comment\n-->\n%%\n# Comment\n%%\n$$\n<!--\n# Math\n$$\n# Actual title", "Actual title"],
  ["Body only", "Fallback"],
]) {
  assert.equal(context.markdownArticleTitle(markdown, "Fallback"), expected);
}
console.log("Article and thesis default filenames: 7 cases passed.");
