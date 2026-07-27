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
var import_obsidian = require("obsidian");
var import_node_child_process = require("node:child_process");
var fs2 = __toESM(require("node:fs"), 1);
var path2 = __toESM(require("node:path"), 1);

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
function withTimeout(promise, timeoutMs, createError, timers = globalThis) {
  let timeoutId;
  const timeout = new Promise((_resolve, reject) => {
    timeoutId = timers.setTimeout(() => reject(createError()), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== void 0) {
      timers.clearTimeout(timeoutId);
    }
  });
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
function validateRuntimeArchive(input) {
  const archive = input instanceof ArrayBuffer ? Buffer.from(input) : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  if (archive.byteLength < 4) {
    throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u4E3A\u7A7A\u6216\u4E0D\u5B8C\u6574");
  }
  const signature = archive.readUInt32LE(0);
  const zipSignatures = /* @__PURE__ */ new Set([67324752, 101010256, 134695760]);
  if (!zipSignatures.has(signature)) {
    throw new Error(
      "GitHub \u8FD4\u56DE\u7684\u5185\u5BB9\u4E0D\u662F ZIP\uFF0C\u53EF\u80FD\u88AB\u7F51\u7EDC\u4EE3\u7406\u6216\u767B\u5F55\u9875\u9762\u66FF\u6362"
    );
  }
  return archive;
}
function writeRuntimeArchive(workspace, archive) {
  fs.writeFileSync(workspace.partialZipPath, archive, { flag: "wx" });
  const partialSize = fs.statSync(workspace.partialZipPath).size;
  if (partialSize !== archive.byteLength) {
    throw new Error(
      `\u8FD0\u884C\u65F6 ZIP \u5199\u5165\u4E0D\u5B8C\u6574\uFF1A\u5E94\u4E3A ${archive.byteLength} \u5B57\u8282\uFF0C\u5B9E\u9645\u4E3A ${partialSize} \u5B57\u8282`
    );
  }
  fs.renameSync(workspace.partialZipPath, workspace.zipPath);
  const finalSize = fs.statSync(workspace.zipPath).size;
  if (finalSize !== archive.byteLength) {
    throw new Error("\u8FD0\u884C\u65F6 ZIP \u5728\u89E3\u538B\u524D\u4E22\u5931\u6216\u5927\u5C0F\u53D1\u751F\u53D8\u5316");
  }
  return finalSize;
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
function formatElapsed(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1e3));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} \u5206 ${seconds} \u79D2` : `${seconds} \u79D2`;
}
function formatMegabytes(bytes) {
  return `${(bytes / 1e6).toFixed(1)} MB`;
}

// src/main.ts
var PLUGIN_VERSION = "1.4.6";
var RUNTIME_MANIFEST = "runtime-manifest.json";
var PROGRESS_PREFIX = "@@MD_EXPORT_PROGRESS@@";
var RUNTIME_INSTALL_REGISTRY_KEY = Symbol.for(
  "md-export-word.runtime-install-registry"
);
var RUNTIME_TARGETS = Object.freeze({
  "windows-x64": {
    id: "windows-x64",
    label: "Windows x64",
    nodePlatform: "win32",
    nodeArch: "x64",
    asset: "md-export-word-runtime-windows-x64.zip",
    sizeHint: "\u7EA6 64 MB",
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
    sizeHint: "\u7EA6 73 MB",
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
    sizeHint: "\u7EA6 34 MB",
    pandocFile: "pandoc",
    crossrefFile: "pandoc-crossref",
    pythonParts: [".venv", "bin", "python"]
  }
});
var DEFAULT_TEMPLATE_FILE = "\u5BFC\u51FA\u683C\u5F0F\u6A21\u677F.docx";
var DEFAULT_FORMAT = Object.freeze({
  preset_name: "\u5F53\u524D\u671F\u520A\u6A21\u677F",
  east_asia_font: "\u5B8B\u4F53",
  western_font: "Times New Roman",
  body_size_pt: 12,
  body_line_spacing: 1.5,
  body_first_line_chars: 2,
  title_size_pt: 16,
  title_line_spacing: 1.5,
  heading2_size_pt: 14,
  heading3_size_pt: 12,
  heading_line_spacing: 1.5,
  table_size_pt: 7.5,
  table_line_spacing: 1,
  caption_size_pt: 10.5,
  caption_line_spacing: 1,
  note_size_pt: 7.5,
  note_line_spacing: 1.5,
  formula_size_pt: 12,
  margin_cm: 2.54,
  figure_reflow: false
});
var SIZE_OPTIONS = {
  "7.5": "\u516D\u53F7\uFF087.5 pt\uFF09",
  "9": "\u5C0F\u4E94\uFF089 pt\uFF09",
  "10.5": "\u4E94\u53F7\uFF0810.5 pt\uFF09",
  "12": "\u5C0F\u56DB\uFF0812 pt\uFF09",
  "14": "\u56DB\u53F7\uFF0814 pt\uFF09",
  "15": "\u5C0F\u4E09\uFF0815 pt\uFF09",
  "16": "\u4E09\u53F7\uFF0816 pt\uFF09",
  "18": "\u5C0F\u4E8C\uFF0818 pt\uFF09",
  "22": "\u4E8C\u53F7\uFF0822 pt\uFF09"
};
var LINE_OPTIONS = {
  "1": "\u5355\u500D\u884C\u8DDD",
  "1.25": "1.25 \u500D\u884C\u8DDD",
  "1.5": "1.5 \u500D\u884C\u8DDD",
  "1.75": "1.75 \u500D\u884C\u8DDD",
  "2": "2 \u500D\u884C\u8DDD"
};
var INDENT_OPTIONS = {
  "0": "\u4E0D\u7F29\u8FDB",
  "1": "\u9996\u884C\u7F29\u8FDB 1 \u5B57",
  "2": "\u9996\u884C\u7F29\u8FDB 2 \u5B57"
};
var MARGIN_OPTIONS = {
  "2": "\u56DB\u8FB9 2.00 cm",
  "2.2": "\u56DB\u8FB9 2.20 cm",
  "2.54": "\u56DB\u8FB9 2.54 cm",
  "3": "\u56DB\u8FB9 3.00 cm"
};
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
function formatSummary(config) {
  return `\u4E2D\u6587 ${config.east_asia_font}\uFF1B\u82F1\u6587/\u6570\u5B57 ${config.western_font}\uFF1B\u6B63\u6587 ${config.body_size_pt} pt\u3001${config.body_line_spacing} \u500D\u884C\u8DDD\u3001\u9996\u884C ${config.body_first_line_chars} \u5B57\uFF1B\u8868\u683C ${config.table_size_pt} pt\u3001${config.table_line_spacing} \u500D\u884C\u8DDD\uFF1B\u56FE\u8868\u9898 ${config.caption_size_pt} pt\uFF1B\u56FE\u8868\u6CE8 ${config.note_size_pt} pt\uFF1BA4 \u56DB\u8FB9 ${config.margin_cm} cm\uFF1B\u56FE\u7247\u5206\u9875\u56DE\u586B ${config.figure_reflow ? "\u5F00\u542F" : "\u5173\u95ED"}`;
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
function normalizeOutputBaseName(value) {
  const outputName = String(value || "").trim().replace(/\.docx$/i, "").trim();
  if (!outputName) {
    return { error: "Word \u6587\u4EF6\u540D\u4E0D\u80FD\u4E3A\u7A7A\u3002" };
  }
  if ([...outputName].some(isInvalidWindowsFileNameCharacter)) {
    return {
      error: 'Word \u6587\u4EF6\u540D\u4E0D\u80FD\u5305\u542B < > : " / \\ | ? * \u7B49\u5B57\u7B26\u3002'
    };
  }
  if (/[. ]$/.test(outputName)) {
    return { error: "Word \u6587\u4EF6\u540D\u4E0D\u80FD\u4EE5\u53E5\u70B9\u6216\u7A7A\u683C\u7ED3\u5C3E\u3002" };
  }
  if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(outputName)) {
    return { error: `\u201C${outputName}\u201D\u662F Windows \u4FDD\u7559\u6587\u4EF6\u540D\uFF0C\u8BF7\u66F4\u6362\u3002` };
  }
  return { value: outputName };
}
function safeDefaultOutputBaseName(value, fallback) {
  const clean = String(value || "").trim().replace(/\.docx$/i, "").split("").map(
    (character) => isInvalidWindowsFileNameCharacter(character) ? "-" : character
  ).join("").replace(/[. ]+$/g, "").trim();
  const result = normalizeOutputBaseName(clean);
  if (result.value) {
    return result.value;
  }
  const fallbackResult = normalizeOutputBaseName(fallback);
  return fallbackResult.value || "\u5BFC\u51FA\u6587\u6863";
}
function fileTimestamp(date = /* @__PURE__ */ new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
function uniqueOutputPath(requestedPath) {
  if (!fs2.existsSync(requestedPath)) {
    return requestedPath;
  }
  const directory = path2.dirname(requestedPath);
  const extension = path2.extname(requestedPath) || ".docx";
  const stem = path2.basename(requestedPath, extension);
  const stampedStem = `${stem}-${fileTimestamp()}`;
  let candidate = path2.join(directory, `${stampedStem}${extension}`);
  let sequence = 2;
  while (fs2.existsSync(candidate)) {
    candidate = path2.join(
      directory,
      `${stampedStem}-${sequence}${extension}`
    );
    sequence += 1;
  }
  return candidate;
}
var ExportModeModal = class extends import_obsidian.Modal {
  constructor(app, resolve) {
    super(app);
    this.resolve = resolve;
    this.resolved = false;
  }
  choose(mode) {
    this.resolved = true;
    this.close();
    this.resolve(mode);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "\u9009\u62E9 Markdown \u2192 Word \u5BFC\u51FA\u6A21\u5F0F" });
    contentEl.createEl("p", {
      text: "\u6E90 Markdown \u4E0D\u4F1A\u88AB\u4FEE\u6539\u3002\u8BF7\u9009\u62E9\u672C\u6B21\u5BF9 Zotero \u7F3A\u5931\u5F15\u7528\u7684\u5904\u7406\u65B9\u5F0F\u3002"
    });
    new import_obsidian.Setting(contentEl).setName("\u4E25\u683C\u6A21\u5F0F").setDesc("\u7528\u4E8E\u81EA\u5DF1\u7684\u8BBA\u6587\uFF1AZotero \u7F3A\u5C11\u4EFB\u4E00 citekey \u5C31\u505C\u6B62\u5BFC\u51FA\u3002").addButton(
      (button) => button.setButtonText("\u4F7F\u7528\u4E25\u683C\u6A21\u5F0F").setCta().onClick(() => this.choose("strict"))
    );
    new import_obsidian.Setting(contentEl).setName("\u517C\u5BB9\u6A21\u5F0F").setDesc(
      "\u7528\u4E8E\u5916\u6765 Markdown\uFF1A\u7F3A\u5931 citekey \u4FDD\u7559\u4E3A\u7EA2\u5B57\u9EC4\u5E95\u5360\u4F4D\u7B26\uFF0C\u5E76\u5199\u5165\u65E5\u5FD7\u3002"
    ).addButton(
      (button) => button.setButtonText("\u4F7F\u7528\u517C\u5BB9\u6A21\u5F0F").onClick(() => this.choose("compatible"))
    );
    new import_obsidian.Setting(contentEl).addButton(
      (button) => button.setButtonText("\u53D6\u6D88").onClick(() => this.close())
    );
  }
  onClose() {
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
var WordFileSelectModal = class extends import_obsidian.Modal {
  constructor(app, files, resolve) {
    super(app);
    this.files = files;
    this.resolve = resolve;
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
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "\u6062\u590D Word \u4E2D\u7684\u84DD\u8272 Zotero \u5F15\u6587" });
    contentEl.createEl("p", {
      text: "\u8BF7\u5148\u5728 Word \u4E2D\u5B8C\u6210 Zotero Refresh \u5E76\u4FDD\u5B58\u6587\u6863\uFF0C\u6700\u597D\u5173\u95ED\u8BE5\u6587\u6863\u3002\u7A0B\u5E8F\u4F1A\u751F\u6210\u65B0\u526F\u672C\uFF0C\u4E0D\u8986\u76D6\u6E90 Word\uFF1B\u6B63\u6587\u5F15\u6587\u8BBE\u4E3A\u84DD\u8272\uFF0C\u6587\u672B\u53C2\u8003\u6587\u732E\u4FDD\u6301\u9ED1\u8272\u3002"
    });
    new import_obsidian.Setting(contentEl).setName("\u9009\u62E9 Word \u6587\u4EF6").setDesc("\u5217\u51FA\u5F53\u524D Markdown \u6240\u5728\u6587\u4EF6\u5939\u4E2D\u7684 .docx\uFF0C\u6700\u8FD1\u4FEE\u6539\u7684\u6392\u5728\u6700\u524D\u3002").addDropdown((dropdown) => {
      for (const file of this.files) {
        dropdown.addOption(file.path, file.label);
      }
      dropdown.setValue(this.selectedPath).onChange((value) => {
        this.selectedPath = value;
      });
    });
    new import_obsidian.Setting(contentEl).addButton(
      (button) => button.setButtonText("\u751F\u6210\u84DD\u8272\u5F15\u6587\u526F\u672C").setCta().onClick(() => this.finish(this.selectedPath))
    ).addButton(
      (button) => button.setButtonText("\u53D6\u6D88").onClick(() => this.finish(null))
    );
  }
  onClose() {
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
var FormatSettingsModal = class extends import_obsidian.Modal {
  constructor(app, options, resolve) {
    super(app);
    this.resolve = resolve;
    this.resolved = false;
    this.presets = options.presets || {};
    this.templateFiles = options.templateFiles.length ? options.templateFiles : [DEFAULT_TEMPLATE_FILE];
    this.figureReflowDefault = options.figureReflowDefault === true;
    this.selectedPreset = "__default__";
    this.config = this.defaultCommandFormat();
    this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE) ? DEFAULT_TEMPLATE_FILE : this.templateFiles[0];
    this.presetName = "";
    this.outputName = options.outputName || "\u5BFC\u51FA\u6587\u6863";
  }
  defaultCommandFormat() {
    return cloneFormat({
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
    const normalizedOutput = normalizeOutputBaseName(this.outputName);
    if (!normalizedOutput.value) {
      new import_obsidian.Notice(normalizedOutput.error);
      return;
    }
    const config = useDefault ? this.defaultCommandFormat() : cloneFormat(this.config);
    const templateFile = useDefault ? this.templateFiles.includes(DEFAULT_TEMPLATE_FILE) ? DEFAULT_TEMPLATE_FILE : this.templateFiles[0] : this.templateFile;
    const requestedName = this.presetName.trim();
    if (savePreset && !requestedName) {
      new import_obsidian.Notice("\u8BF7\u5148\u586B\u5199\u683C\u5F0F\u65B9\u6848\u540D\u79F0\uFF0C\u4F8B\u5982\u201C\u6BD5\u4E1A\u8BBA\u6587\u201D\u6216\u671F\u520A\u540D\u79F0\u3002");
      return;
    }
    const differsFromDefault = Object.keys(DEFAULT_FORMAT).some(
      (key) => key !== "preset_name" && config[key] !== DEFAULT_FORMAT[key]
    ) || templateFile !== DEFAULT_TEMPLATE_FILE;
    const displayName = savePreset ? requestedName : useDefault ? DEFAULT_FORMAT.preset_name : this.selectedPreset !== "__default__" ? config.preset_name : differsFromDefault ? "\u672C\u6B21\u81EA\u5B9A\u4E49" : DEFAULT_FORMAT.preset_name;
    config.preset_name = displayName;
    this.resolved = true;
    this.close();
    this.resolve({
      config,
      templateFile,
      savePreset,
      presetName: requestedName,
      displayName,
      outputName: normalizedOutput.value
    });
  }
  addDropdown(container, name, desc, key, options) {
    const current = String(this.config[key]);
    new import_obsidian.Setting(container).setName(name).setDesc(desc).addDropdown((dropdown) => {
      for (const [value, label] of Object.entries(options)) {
        dropdown.addOption(value, label);
      }
      if (!Object.prototype.hasOwnProperty.call(options, current)) {
        dropdown.addOption(current, `${current}\uFF08\u5DF2\u4FDD\u5B58\u503C\uFF09`);
      }
      dropdown.setValue(current).onChange((value) => {
        this.config[key] = Number(value);
      });
    });
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.style.width = "min(760px, 92vw)";
    contentEl.style.maxHeight = "80vh";
    contentEl.style.overflowY = "auto";
    contentEl.createEl("h2", { text: "\u8BBE\u7F6E Word \u5BFC\u51FA\u683C\u5F0F" });
    contentEl.createEl("p", {
      text: "\u4E0D\u4FEE\u6539\u4EFB\u4F55\u9009\u9879\u65F6\u4F7F\u7528\u5F53\u524D\u671F\u520A\u6A21\u677F\uFF08" + formatSummary(this.defaultCommandFormat()) + "\uFF09\u3002"
    });
    const reflowEnabled = this.config.figure_reflow === true;
    new import_obsidian.Setting(contentEl).setName("\u56FE\u7247\u5206\u9875\u65B9\u5F0F").setDesc(
      "\u9ED8\u8BA4\u4FDD\u6301 Markdown \u4E2D\u7684\u56FE\u7247\u4F4D\u7F6E\u548C\u56FE\u6587\u987A\u5E8F\uFF1B\u53EA\u6709\u9009\u62E9\u81EA\u52A8\u56DE\u586B\u65F6\uFF0C\u624D\u4F1A\u628A\u56FE\u7247\u540E\u540C\u4E00\u5C0F\u8282\u7684\u8FDE\u7EED\u6B63\u6587\u63D0\u524D\uFF0C\u4EE5\u51CF\u5C11\u5927\u56FE\u6362\u9875\u524D\u7684\u7A7A\u767D\u3002"
    ).addButton((button) => {
      button.setButtonText("\u4FDD\u6301\u56FE\u7247\u539F\u4F4D\uFF08\u9ED8\u8BA4\uFF09").onClick(() => {
        this.config.figure_reflow = false;
        this.render();
      });
      if (!reflowEnabled) {
        button.setCta();
      }
    }).addButton((button) => {
      button.setButtonText("\u81EA\u52A8\u56DE\u586B\u5206\u9875\u7A7A\u767D").onClick(() => {
        this.config.figure_reflow = true;
        this.render();
      });
      if (reflowEnabled) {
        button.setCta();
      }
    });
    new import_obsidian.Setting(contentEl).setName("Word \u6587\u4EF6\u540D").setDesc(
      "\u9ED8\u8BA4\u8BFB\u53D6 Markdown \u7684\u6587\u7AE0\u4E00\u7EA7\u6807\u9898\uFF1B\u53EF\u76F4\u63A5\u4FEE\u6539\uFF0C\u65E0\u9700\u8F93\u5165 .docx\uFF1B\u540C\u540D\u6587\u4EF6\u81EA\u52A8\u6DFB\u52A0\u65F6\u95F4\u6233\u3002"
    ).addText((text) => {
      text.inputEl.style.width = "min(420px, 52vw)";
      text.setPlaceholder("\u8BF7\u8F93\u5165 Word \u6587\u4EF6\u540D").setValue(this.outputName).onChange((value) => {
        this.outputName = value;
      });
    });
    new import_obsidian.Setting(contentEl).setName("\u683C\u5F0F\u65B9\u6848").setDesc("\u53EF\u8C03\u7528\u4E4B\u524D\u4FDD\u5B58\u7684\u6BD5\u4E1A\u8BBA\u6587\u6216\u5176\u4ED6\u671F\u520A\u65B9\u6848\u3002").addDropdown((dropdown) => {
      dropdown.addOption("__default__", "\u5F53\u524D\u671F\u520A\u6A21\u677F\uFF08\u9ED8\u8BA4\uFF09");
      for (const [key, preset] of Object.entries(this.presets)) {
        dropdown.addOption(key, preset.name || key);
      }
      dropdown.setValue(this.selectedPreset).onChange((value) => {
        this.usePreset(value);
      });
    });
    new import_obsidian.Setting(contentEl).setName("\u53C2\u8003 Word \u6A21\u677F").setDesc(`\u9ED8\u8BA4\uFF1A${DEFAULT_TEMPLATE_FILE}`).addDropdown((dropdown) => {
      for (const file of this.templateFiles) {
        dropdown.addOption(file, file);
      }
      dropdown.setValue(this.templateFile).onChange((value) => {
        this.templateFile = value;
      });
    });
    contentEl.createEl("h3", { text: "\u6B63\u6587\u4E0E\u5B57\u4F53" });
    new import_obsidian.Setting(contentEl).setName("\u4E2D\u6587\u5B57\u4F53").setDesc("\u9ED8\u8BA4\uFF1A\u5B8B\u4F53").addText(
      (text) => text.setValue(this.config.east_asia_font).onChange((value) => {
        this.config.east_asia_font = value.trim() || DEFAULT_FORMAT.east_asia_font;
      })
    );
    new import_obsidian.Setting(contentEl).setName("\u82F1\u6587\u548C\u6570\u5B57\u5B57\u4F53").setDesc("\u9ED8\u8BA4\uFF1ATimes New Roman").addText(
      (text) => text.setValue(this.config.western_font).onChange((value) => {
        this.config.western_font = value.trim() || DEFAULT_FORMAT.western_font;
      })
    );
    this.addDropdown(
      contentEl,
      "\u6B63\u6587\u5B57\u53F7",
      "\u9ED8\u8BA4\uFF1A\u5C0F\u56DB\uFF0812 pt\uFF09",
      "body_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u6B63\u6587\u884C\u8DDD",
      "\u9ED8\u8BA4\uFF1A1.5 \u500D\u884C\u8DDD",
      "body_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u6B63\u6587\u9996\u884C\u7F29\u8FDB",
      "\u9ED8\u8BA4\uFF1A\u9996\u884C\u7F29\u8FDB 2 \u5B57",
      "body_first_line_chars",
      INDENT_OPTIONS
    );
    contentEl.createEl("h3", { text: "\u9898\u76EE\u4E0E\u6807\u9898" });
    this.addDropdown(
      contentEl,
      "\u6587\u7AE0\u9898\u76EE\u5B57\u53F7\uFF08Markdown #\uFF09",
      "\u9ED8\u8BA4\uFF1A\u4E09\u53F7\uFF0816 pt\uFF09",
      "title_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u6587\u7AE0\u9898\u76EE\u884C\u8DDD",
      "\u9ED8\u8BA4\uFF1A1.5 \u500D\u884C\u8DDD",
      "title_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u4E00\u7EA7\u8282\u6807\u9898\u5B57\u53F7\uFF08Markdown ##\uFF09",
      "\u9ED8\u8BA4\uFF1A\u56DB\u53F7\uFF0814 pt\uFF09",
      "heading2_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u4E8C\u7EA7\u8282\u6807\u9898\u5B57\u53F7\uFF08Markdown ###\uFF09",
      "\u9ED8\u8BA4\uFF1A\u5C0F\u56DB\uFF0812 pt\uFF09",
      "heading3_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u8282\u6807\u9898\u884C\u8DDD",
      "\u9ED8\u8BA4\uFF1A1.5 \u500D\u884C\u8DDD",
      "heading_line_spacing",
      LINE_OPTIONS
    );
    contentEl.createEl("h3", { text: "\u8868\u683C\u3001\u56FE\u8868\u9898\u4E0E\u6CE8\u91CA" });
    this.addDropdown(
      contentEl,
      "\u8868\u683C\u5B57\u53F7\uFF08\u542B\u8868\u5185\u516C\u5F0F\uFF09",
      "\u9ED8\u8BA4\uFF1A\u516D\u53F7\uFF087.5 pt\uFF09",
      "table_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u8868\u683C\u884C\u8DDD",
      "\u9ED8\u8BA4\uFF1A\u5355\u500D\u884C\u8DDD",
      "table_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u56FE\u540D\u3001\u8868\u540D\u5B57\u53F7",
      "\u9ED8\u8BA4\uFF1A\u4E94\u53F7\uFF0810.5 pt\uFF09",
      "caption_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u56FE\u540D\u3001\u8868\u540D\u884C\u8DDD",
      "\u9ED8\u8BA4\uFF1A\u5355\u500D\u884C\u8DDD",
      "caption_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u56FE\u6CE8\u3001\u8868\u6CE8\u5B57\u53F7",
      "\u9ED8\u8BA4\uFF1A\u516D\u53F7\uFF087.5 pt\uFF09",
      "note_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u56FE\u6CE8\u3001\u8868\u6CE8\u884C\u8DDD",
      "\u9ED8\u8BA4\uFF1A1.5 \u500D\u884C\u8DDD",
      "note_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "\u6B63\u6587\u516C\u5F0F\u5B57\u53F7",
      "\u9ED8\u8BA4\uFF1A\u5C0F\u56DB\uFF0812 pt\uFF09",
      "formula_size_pt",
      SIZE_OPTIONS
    );
    contentEl.createEl("h3", { text: "\u9875\u9762" });
    this.addDropdown(
      contentEl,
      "A4 \u9875\u8FB9\u8DDD",
      "\u9ED8\u8BA4\uFF1A\u56DB\u8FB9 2.54 cm",
      "margin_cm",
      MARGIN_OPTIONS
    );
    new import_obsidian.Setting(contentEl).setName("\u65B9\u6848\u540D\u79F0\uFF08\u53EF\u9009\uFF09").setDesc("\u586B\u5199\u540E\u53EF\u4FDD\u5B58\u4E3A\u201C\u6BD5\u4E1A\u8BBA\u6587\u201D\u201C\u67D0\u671F\u520A\u201D\u7B49\u65B9\u6848\u3002").addText(
      (text) => text.setPlaceholder("\u4F8B\u5982\uFF1A\u6BD5\u4E1A\u8BBA\u6587").setValue(this.presetName).onChange((value) => {
        this.presetName = value;
      })
    );
    new import_obsidian.Setting(contentEl).addButton(
      (button) => button.setButtonText("\u4F7F\u7528\u9ED8\u8BA4\u6A21\u677F").onClick(() => this.finish({ useDefault: true }))
    ).addButton(
      (button) => button.setButtonText("\u4FDD\u5B58\u65B9\u6848\u5E76\u5BFC\u51FA").onClick(() => this.finish({ savePreset: true }))
    ).addButton(
      (button) => button.setButtonText("\u6309\u5F53\u524D\u8BBE\u7F6E\u5BFC\u51FA").setCta().onClick(() => this.finish())
    ).addButton(
      (button) => button.setButtonText("\u53D6\u6D88").onClick(() => this.close())
    );
  }
  onOpen() {
    this.render();
  }
  onClose() {
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
var ExportProgressModal = class extends import_obsidian.Modal {
  constructor(app, fileName, options = {}) {
    super(app);
    this.fileName = fileName;
    this.modalTitle = options.title || "\u6B63\u5728\u5BFC\u51FA Word";
    this.successStage = options.successStage || "\u5BFC\u51FA\u5B8C\u6210";
    this.failureStage = options.failureStage || "\u5BFC\u51FA\u5931\u8D25";
    this.logLines = [];
    this.lastPercent = 0;
    this.closedByUser = false;
  }
  onOpen() {
    this.titleEl.setText(this.modalTitle);
    this.contentEl.addClass("md-export-word-progress-modal");
    this.contentEl.createDiv({
      cls: "md-export-word-progress-file",
      text: this.fileName
    });
    this.statusEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-status",
      text: "\u51C6\u5907\u542F\u52A8\u5BFC\u51FA\u7A0B\u5E8F\u2026"
    });
    this.progressEl = this.contentEl.createEl("progress", {
      cls: "md-export-word-progress",
      attr: { max: "100", value: "0" }
    });
    this.detailEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-detail",
      text: "0%"
    });
    this.contentEl.createEl("h4", { text: "\u5B9E\u65F6\u8FC7\u7A0B" });
    this.logEl = this.contentEl.createEl("pre", {
      cls: "md-export-word-progress-log",
      attr: {
        tabindex: "0",
        "aria-label": "Word \u5BFC\u51FA\u5B9E\u65F6\u8FC7\u7A0B\uFF0C\u53EF\u9009\u62E9\u5E76\u590D\u5236"
      }
    });
    this.actionsEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-actions"
    });
    const actions = new import_obsidian.Setting(this.actionsEl);
    actions.addButton(
      (button) => button.setButtonText("\u590D\u5236\u5F53\u524D\u8FC7\u7A0B").onClick(() => this.copyLogText())
    );
    actions.addButton(
      (button) => button.setButtonText("\u9690\u85CF\u7A97\u53E3").onClick(() => this.close())
    );
  }
  updateProgress(percent, stage, detail = "", level = "info") {
    const safePercent = Math.max(
      this.lastPercent,
      Math.min(100, Number(percent) || 0)
    );
    this.lastPercent = safePercent;
    if (this.progressEl) {
      this.progressEl.value = safePercent;
    }
    if (this.statusEl) {
      this.statusEl.setText(stage || "\u6B63\u5728\u5904\u7406\u2026");
      this.statusEl.toggleClass("is-error", level === "error");
      this.statusEl.toggleClass("is-success", level === "success");
    }
    if (this.detailEl) {
      this.detailEl.setText(
        detail ? `${safePercent}% \xB7 ${detail}` : `${safePercent}%`
      );
    }
    this.appendLog(
      `[${String(safePercent).padStart(3, " ")}%] ${stage}` + (detail ? ` \u2014 ${detail}` : ""),
      level === "error"
    );
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
          payload.level
        );
        return;
      } catch (error) {
        this.appendLog(`\u65E0\u6CD5\u89E3\u6790\u8FDB\u5EA6\u4E8B\u4EF6\uFF1A${error.message}`, true);
      }
    }
    this.appendLog(normalized, isError);
  }
  async copyText(text, successMessage) {
    const value = String(text || "").trim();
    if (!value) {
      new import_obsidian.Notice("\u5F53\u524D\u6CA1\u6709\u53EF\u590D\u5236\u7684\u65E5\u5FD7\u5185\u5BB9\u3002");
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
          throw new Error("\u7CFB\u7EDF\u62D2\u7EDD\u590D\u5236\u64CD\u4F5C");
        }
      }
      new import_obsidian.Notice(successMessage);
      return true;
    } catch (error) {
      new import_obsidian.Notice(`\u590D\u5236\u5931\u8D25\uFF1A${error.message}`, 1e4);
      return false;
    }
  }
  async copyLogText(logPath = "") {
    let text = this.logLines.join("\n");
    if (logPath && fs2.existsSync(logPath)) {
      try {
        text = fs2.readFileSync(logPath, "utf8");
      } catch {
      }
    }
    return await this.copyText(
      text,
      logPath ? "\u9519\u8BEF\u65E5\u5FD7\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\u3002" : "\u5F53\u524D\u5BFC\u51FA\u8FC7\u7A0B\u5DF2\u590D\u5236\u3002"
    );
  }
  openLogFile(logPath) {
    if (!logPath || !fs2.existsSync(logPath)) {
      new import_obsidian.Notice("\u672A\u627E\u5230\u9519\u8BEF\u65E5\u5FD7\u6587\u4EF6\u3002", 1e4);
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
        new import_obsidian.Notice(`\u65E0\u6CD5\u6253\u5F00\u9519\u8BEF\u65E5\u5FD7\uFF1A${error.message}`, 1e4);
      });
      child.unref();
    } catch (error) {
      new import_obsidian.Notice(`\u65E0\u6CD5\u6253\u5F00\u9519\u8BEF\u65E5\u5FD7\uFF1A${error.message}`, 1e4);
    }
  }
  complete(wordName) {
    this.updateProgress(100, this.successStage, wordName, "success");
    if (!this.actionsEl) {
      return;
    }
    this.actionsEl.empty();
    const actions = new import_obsidian.Setting(this.actionsEl);
    actions.addButton(
      (button) => button.setButtonText("\u590D\u5236\u8FC7\u7A0B").onClick(() => this.copyLogText())
    );
    actions.addButton(
      (button) => button.setButtonText("\u5B8C\u6210\u5E76\u5173\u95ED").setCta().onClick(() => this.close())
    );
  }
  fail(summary, logPath) {
    this.updateProgress(
      100,
      this.failureStage,
      logPath ? `\u9519\u8BEF\u65E5\u5FD7\uFF1A${logPath}` : summary,
      "error"
    );
    if (summary) {
      this.appendLog(summary, true);
    }
    if (!this.actionsEl) {
      return;
    }
    this.actionsEl.empty();
    const actions = new import_obsidian.Setting(this.actionsEl);
    actions.addButton(
      (button) => button.setButtonText("\u590D\u5236\u9519\u8BEF\u65E5\u5FD7").setCta().onClick(() => this.copyLogText(logPath))
    );
    if (logPath) {
      actions.addButton(
        (button) => button.setButtonText("\u6253\u5F00\u65E5\u5FD7\u6587\u4EF6").onClick(() => this.openLogFile(logPath))
      );
    }
    actions.addButton(
      (button) => button.setButtonText("\u5173\u95ED").setWarning().onClick(() => this.close())
    );
  }
  onClose() {
    this.closedByUser = true;
  }
};
var TextInputModal = class extends import_obsidian.Modal {
  constructor(app, title, description, initialValue, resolve) {
    super(app);
    this.modalTitle = title;
    this.description = description;
    this.value = initialValue || "";
    this.resolve = resolve;
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
  onOpen() {
    this.titleEl.setText(this.modalTitle);
    this.contentEl.createEl("p", { text: this.description });
    new import_obsidian.Setting(this.contentEl).setName("GitHub \u4ED3\u5E93").setDesc("\u683C\u5F0F\uFF1Aowner/repository").addText(
      (text) => text.setPlaceholder("owner/obsidian-md-export-word").setValue(this.value).onChange((value) => {
        this.value = value.trim();
      })
    );
    new import_obsidian.Setting(this.contentEl).addButton(
      (button) => button.setButtonText("\u7EE7\u7EED").setCta().onClick(() => this.finish(this.value))
    ).addButton(
      (button) => button.setButtonText("\u53D6\u6D88").onClick(() => this.finish(null))
    );
  }
  onClose() {
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
};
function runProcess(executable, args, options = {}) {
  return new Promise((resolve, reject) => {
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
    child.once("close", (code) => resolve({ code, output }));
  });
}
function humanizeProcessOutput(output) {
  return String(output || "").split(/\r?\n/).map((line) => {
    const normalized = line.trim();
    if (!normalized.startsWith(PROGRESS_PREFIX)) {
      return line;
    }
    try {
      const event = JSON.parse(normalized.slice(PROGRESS_PREFIX.length));
      return `[${event.percent}%] ${event.stage}` + (event.detail ? ` \u2014 ${event.detail}` : "");
    } catch {
      return line;
    }
  }).join("\n").trim();
}
function appendFailureProcessOutput(logPath, output) {
  const humanOutput = humanizeProcessOutput(output);
  if (!humanOutput) {
    return;
  }
  const section = "\nObsidian captured process output\n--------------------------------\n" + humanOutput + "\n";
  if (fs2.existsSync(logPath)) {
    fs2.appendFileSync(logPath, section, "utf8");
  } else {
    fs2.writeFileSync(
      logPath,
      "MD Export Word failure report\n" + section,
      "utf8"
    );
  }
}
var MdExportWordSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const runtimeInstalling = this.plugin.isRuntimeInstalling();
    containerEl.empty();
    containerEl.createEl("h2", { text: "MD Export Word" });
    new import_obsidian.Setting(containerEl).setName("\u8FD0\u884C\u65F6\u53D1\u5E03\u4ED3\u5E93").setDesc(
      "\u901A\u5E38\u7531\u6B63\u5F0F Release \u81EA\u52A8\u5199\u5165\uFF1B\u4EC5\u5728\u81EA\u5EFA\u5206\u652F\u6216\u79C1\u6709\u4ED3\u5E93\u4E2D\u9700\u8981\u4FEE\u6539\u3002"
    ).addText((text) => {
      text.setPlaceholder("owner/obsidian-md-export-word").setValue(this.plugin.getReleaseRepository()).setDisabled(runtimeInstalling).onChange(async (value) => {
        this.plugin.exportSettings.repository = value.trim();
        await this.plugin.saveData(this.plugin.exportSettings);
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u5BFC\u51FA\u6210\u529F\u540E\u81EA\u52A8\u6253\u5F00 Word").setDesc("\u9ED8\u8BA4\u5F00\u542F\uFF1B\u53EA\u6709\u5BFC\u51FA\u548C\u81EA\u52A8\u81EA\u68C0\u5747\u6210\u529F\u65F6\u624D\u4F1A\u6253\u5F00\u751F\u6210\u7684 .docx\u3002").addToggle(
      (toggle) => toggle.setValue(this.plugin.exportSettings.autoOpen !== false).onChange(async (value) => {
        this.plugin.exportSettings.autoOpen = value;
        await this.plugin.saveData(this.plugin.exportSettings);
      })
    );
    const detectedTarget = detectedRuntimeTargetId();
    new import_obsidian.Setting(containerEl).setName("\u8FD0\u884C\u65F6\u5E73\u53F0").setDesc(
      "\u9ED8\u8BA4\u81EA\u52A8\u8BC6\u522B\uFF1B\u4EC5\u5728 Apple Silicon Mac \u9700\u8981\u7528 Rosetta \u8FD0\u884C Intel \u4E8C\u8FDB\u5236\u65F6\u624B\u52A8\u8C03\u6574\u3002"
    ).addDropdown((dropdown) => {
      dropdown.addOption(
        "auto",
        `\u81EA\u52A8\u68C0\u6D4B\uFF08${detectedTarget ? RUNTIME_TARGETS[detectedTarget].label : `${process.platform}/${process.arch}`}\uFF09`
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
    new import_obsidian.Setting(containerEl).setName("Word \u5BFC\u51FA\u8FD0\u884C\u65F6").setDesc(
      runtimeInstalling ? "\u6B63\u5728\u5B89\u88C5\u8FD0\u884C\u65F6\u3002\u5F53\u524D\u4EFB\u52A1\u5B8C\u6210\u524D\u65E0\u9700\u91CD\u590D\u64CD\u4F5C\u3002" : this.plugin.runtimeStatusText()
    ).addButton((button) => {
      button.setButtonText(runtimeInstalling ? "\u6B63\u5728\u5B89\u88C5..." : "\u5B89\u88C5\u6216\u4FEE\u590D").setCta().setDisabled(runtimeInstalling).onClick(async () => {
        const installPromise = this.plugin.installRuntime();
        this.display();
        try {
          await installPromise;
        } finally {
          this.display();
        }
      });
    }).addButton((button) => {
      button.setButtonText("\u73AF\u5883\u81EA\u68C0").setDisabled(runtimeInstalling).onClick(async () => {
        await this.plugin.runDoctor();
        this.display();
      });
    });
  }
};
var MdExportWordPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.exportSettings = await this.loadData() || {};
    if (!this.exportSettings.presets) {
      this.exportSettings.presets = {};
    }
    this.addSettingTab(new MdExportWordSettingTab(this.app, this));
    this.addCommand({
      id: "export-current-markdown-to-word",
      name: "Export current Markdown to Word (keep figure positions)",
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
      name: "Export current Markdown to Word (auto-fill figure page gaps)",
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
      name: "Reapply blue Zotero citations to exported Word",
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
      name: "Install or repair Word export runtime",
      callback: () => {
        void this.installRuntime();
      }
    });
    this.addCommand({
      id: "check-runtime",
      name: "Check Word export runtime",
      callback: () => {
        void this.runDoctor();
      }
    });
  }
  getPluginRoot() {
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      return null;
    }
    return path2.join(
      adapter.getBasePath(),
      this.app.vault.configDir,
      "plugins",
      this.manifest.id
    );
  }
  getRuntimeRoot() {
    const pluginRoot = this.getPluginRoot();
    return pluginRoot ? path2.join(pluginRoot, "runtime") : null;
  }
  getTemplateRoot() {
    const pluginRoot = this.getPluginRoot();
    return pluginRoot ? path2.join(pluginRoot, "templates") : null;
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
    if (!target) {
      return `\u5C1A\u4E0D\u652F\u6301 ${process.platform}/${process.arch}\u3002`;
    }
    if (target.nodePlatform !== process.platform) {
      return `\u6240\u9009 ${target.label} \u4E0E\u5F53\u524D\u7CFB\u7EDF ${process.platform}/${process.arch} \u4E0D\u4E00\u81F4\u3002`;
    }
    if (target.nodeArch !== process.arch && !(process.platform === "darwin" && process.arch === "arm64" && target.nodeArch === "x64")) {
      return `\u6240\u9009 ${target.label} \u4E0E\u5F53\u524D CPU \u67B6\u6784 ${process.arch} \u4E0D\u517C\u5BB9\u3002`;
    }
    return "";
  }
  runtimePaths(root = this.getRuntimeRoot(), target = this.getRuntimeTarget()) {
    if (!root || !target) {
      return null;
    }
    const binaryRoot = path2.join(root, "Pandoc&pandoc-crossref");
    return {
      root,
      target,
      manifest: path2.join(root, RUNTIME_MANIFEST),
      exporter: path2.join(root, "scripts", "md_export_word_template.py"),
      recolor: path2.join(root, "scripts", "recolor_zotero_citations.py"),
      doctor: path2.join(root, "scripts", "doctor.py"),
      pandoc: path2.join(binaryRoot, target.pandocFile),
      crossref: path2.join(binaryRoot, target.crossrefFile),
      python: path2.join(root, ...target.pythonParts),
      template: path2.join(root, "Word-Template", DEFAULT_TEMPLATE_FILE)
    };
  }
  ensureTemplateLibrary() {
    const runtimeRoot = this.getRuntimeRoot();
    const templateRoot = this.getTemplateRoot();
    if (!runtimeRoot || !templateRoot) {
      return null;
    }
    const bundled = path2.join(runtimeRoot, "Word-Template");
    fs2.mkdirSync(templateRoot, { recursive: true });
    for (const name of fs2.readdirSync(bundled)) {
      if (name.startsWith("~$") || !name.toLowerCase().endsWith(".docx")) {
        continue;
      }
      const source = path2.join(bundled, name);
      const destination = path2.join(templateRoot, name);
      if (!fs2.existsSync(destination)) {
        fs2.copyFileSync(source, destination);
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
      true ? "2891892831z-ship-it/obsidian-md-export-word" : ""
    ).trim();
    return stamped;
  }
  runtimeStatus(target = this.getRuntimeTarget(), expectedVersion = this.manifest.version) {
    const root = this.getRuntimeRoot();
    if (!root) {
      return { ready: false, message: "\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\u3002" };
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
    const missing = required.filter((file) => !fs2.existsSync(file));
    if (missing.length) {
      return {
        ready: false,
        message: `${target.label} \u8FD0\u884C\u65F6\u672A\u5B89\u88C5\u6216\u4E0D\u5B8C\u6574\uFF08\u7F3A\u5C11 ${missing.length} \u4E2A\u6587\u4EF6\uFF09\u3002`
      };
    }
    try {
      const manifest = JSON.parse(
        fs2.readFileSync(runtimePaths.manifest, "utf8")
      );
      if (manifest.version !== expectedVersion) {
        return {
          ready: false,
          message: `\u8FD0\u884C\u65F6\u7248\u672C ${manifest.version || "unknown"} \u4E0E\u63D2\u4EF6\u7248\u672C ${expectedVersion} \u4E0D\u4E00\u81F4\u3002`
        };
      }
      if (manifest.platform !== target.id) {
        return {
          ready: false,
          message: `\u5DF2\u5B89\u88C5\u8FD0\u884C\u65F6\u4E3A ${manifest.platform || "unknown"}\uFF0C\u5F53\u524D\u9700\u8981 ${target.id}\u3002`
        };
      }
      return {
        ready: true,
        message: `\u5DF2\u5B89\u88C5 ${target.label} \u8FD0\u884C\u65F6 ${manifest.version || "unknown"}\u3002`
      };
    } catch (error) {
      return { ready: false, message: `\u8FD0\u884C\u65F6\u6E05\u5355\u635F\u574F\uFF1A${error.message}` };
    }
  }
  runtimeStatusText() {
    return this.runtimeStatus().message;
  }
  async askRepository(initialValue = "") {
    return await new Promise((resolve) => {
      new TextInputModal(
        this.app,
        "\u8BBE\u7F6E\u8FD0\u884C\u65F6\u4ED3\u5E93",
        "\u63D2\u4EF6\u9700\u8981\u4ECE\u540C\u7248\u672C GitHub Release \u4E0B\u8F7D\u5F53\u524D\u7CFB\u7EDF\u8FD0\u884C\u65F6\u3002\u7C98\u8D34\u4F60\u5728 BRAT \u4E2D\u6DFB\u52A0\u7684\u4ED3\u5E93\u5730\u5740\u3002",
        initialValue,
        resolve
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
        new import_obsidian.Notice(
          "Word \u5BFC\u51FA\u8FD0\u884C\u65F6\u6B63\u5728\u5B89\u88C5\uFF0C\u8BF7\u7B49\u5F85\u5F53\u524D\u4EFB\u52A1\u5B8C\u6210\uFF0C\u65E0\u9700\u91CD\u590D\u70B9\u51FB\u3002",
          8e3
        );
      }
    );
  }
  async installRuntimeOnce() {
    const target = this.getRuntimeTarget();
    const compatibilityError = this.runtimeCompatibilityError(target);
    if (compatibilityError) {
      new import_obsidian.Notice(`\u65E0\u6CD5\u5B89\u88C5\u8FD0\u884C\u65F6\uFF1A${compatibilityError}`, 12e3);
      return false;
    }
    const pluginRoot = this.getPluginRoot();
    if (!pluginRoot) {
      new import_obsidian.Notice("\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u5B89\u88C5\u8FD0\u884C\u65F6\u3002");
      return false;
    }
    let repository = this.getReleaseRepository();
    try {
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
        repository = await this.askRepository(repository);
        if (!repository) {
          new import_obsidian.Notice("\u5DF2\u53D6\u6D88\u8FD0\u884C\u65F6\u5B89\u88C5\u3002");
          return false;
        }
        if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
          new import_obsidian.Notice("GitHub \u4ED3\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5E94\u4E3A owner/repository\u3002", 1e4);
          return false;
        }
        this.exportSettings.repository = repository;
        await this.saveData(this.exportSettings);
      }
    } catch (error) {
      new import_obsidian.Notice(`\u65E0\u6CD5\u4FDD\u5B58\u8FD0\u884C\u65F6\u4ED3\u5E93\u8BBE\u7F6E\uFF1A${error.message}`, 12e3);
      return false;
    }
    const version = this.manifest.version || PLUGIN_VERSION;
    const url = `https://github.com/${repository}/releases/download/${version}/${target.asset}`;
    const runtimePath = path2.join(pluginRoot, "runtime");
    let workspace = null;
    let installLock = null;
    let progressNotice = null;
    let progressTimer = null;
    let progressStageCode = "prepare";
    let progressStage = "\u51C6\u5907\u5B89\u88C5\u8FD0\u884C\u65F6";
    let progressDetail = "";
    const startedAt = Date.now();
    let oldRuntimeBackedUp = false;
    let newRuntimeActivated = false;
    let committed = false;
    let rollbackSucceeded = false;
    const refreshProgress = () => {
      if (!progressNotice) {
        return;
      }
      const elapsed = formatElapsed(Date.now() - startedAt);
      progressNotice.setMessage(
        `${progressStage}
\u5DF2\u7528\u65F6 ${elapsed}\u3002${progressDetail}`
      );
    };
    const setProgress = (stageCode, stage, detail = "") => {
      progressStageCode = stageCode;
      progressStage = stage;
      progressDetail = detail;
      refreshProgress();
    };
    try {
      installLock = acquireRuntimeInstallLock(pluginRoot);
      workspace = createRuntimeInstallWorkspace(
        pluginRoot,
        target.id,
        target.asset
      );
      progressNotice = new import_obsidian.Notice("", 0);
      setProgress(
        "download",
        `\u6B63\u5728\u4E0B\u8F7D ${target.label} Word \u5BFC\u51FA\u8FD0\u884C\u65F6 ${version}`,
        `\u5B89\u88C5\u5305${target.sizeHint}\uFF0CGitHub \u7F51\u7EDC\u8F83\u6162\u65F6\u53EF\u80FD\u9700\u8981\u6570\u5206\u949F\uFF1B\u8BF7\u52FF\u91CD\u590D\u70B9\u51FB\u3002`
      );
      progressTimer = window.setInterval(refreshProgress, 5e3);
      this.registerInterval(progressTimer);
      const response = await withTimeout(
        (0, import_obsidian.requestUrl)({
          url,
          method: "GET",
          throw: false
        }),
        RUNTIME_DOWNLOAD_TIMEOUT_MS,
        () => new Error(
          "\u4E0B\u8F7D\u8D85\u8FC7 5 \u5206\u949F\uFF0C\u63D2\u4EF6\u5DF2\u505C\u6B62\u7B49\u5F85\u3002\u8BF7\u68C0\u67E5 GitHub \u7F51\u7EDC\u540E\u91CD\u8BD5"
        )
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `GitHub Release \u8FD4\u56DE HTTP ${response.status}\uFF0C\u8BF7\u786E\u8BA4 ${version} \u5DF2\u53D1\u5E03\u4E14\u5305\u542B ${target.asset}`
        );
      }
      setProgress(
        "validate-download",
        "\u6B63\u5728\u6821\u9A8C\u4E0B\u8F7D\u5185\u5BB9",
        "\u6B63\u5728\u786E\u8BA4 ZIP \u683C\u5F0F\u548C\u672C\u5730\u5199\u5165\u5927\u5C0F\u3002"
      );
      const archive = validateRuntimeArchive(response.arrayBuffer);
      const archiveSize = writeRuntimeArchive(workspace, archive);
      if (!fs2.existsSync(workspace.zipPath) || fs2.statSync(workspace.zipPath).size !== archiveSize) {
        throw new Error("\u8FD0\u884C\u65F6 ZIP \u5728\u89E3\u538B\u524D\u4E22\u5931\u6216\u5927\u5C0F\u53D1\u751F\u53D8\u5316");
      }
      fs2.mkdirSync(workspace.stagePath, { recursive: true });
      setProgress(
        "extract",
        `\u4E0B\u8F7D\u5B8C\u6210\uFF08${formatMegabytes(archiveSize)}\uFF09\uFF0C\u6B63\u5728\u89E3\u538B`,
        "\u8BF7\u4FDD\u6301 Obsidian \u8FD0\u884C\u3002"
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
          extractResult.output.trim() || `\u89E3\u538B\u8FD0\u884C\u65F6\u5931\u8D25\uFF1A${extractResult.code}`
        );
      }
      setProgress(
        "validate-package",
        "\u6B63\u5728\u6821\u9A8C\u8FD0\u884C\u65F6\u5305",
        "\u6B63\u5728\u68C0\u67E5\u7248\u672C\u548C CPU \u5E73\u53F0\u3002"
      );
      const payloadPath = path2.join(workspace.stagePath, "runtime");
      const payloadManifestPath = path2.join(
        payloadPath,
        RUNTIME_MANIFEST
      );
      if (!fs2.existsSync(payloadManifestPath)) {
        throw new Error("\u8FD0\u884C\u65F6\u5305\u7F3A\u5C11 runtime/runtime-manifest.json");
      }
      const payloadManifest = JSON.parse(
        fs2.readFileSync(payloadManifestPath, "utf8")
      );
      if (payloadManifest.version !== version || payloadManifest.platform !== target.id) {
        throw new Error(
          `\u8FD0\u884C\u65F6\u5305\u4E0D\u5339\u914D\uFF1A\u7248\u672C ${payloadManifest.version || "unknown"}\uFF0C\u5E73\u53F0 ${payloadManifest.platform || "unknown"}`
        );
      }
      setProgress(
        "activate",
        "\u6B63\u5728\u66FF\u6362\u65E7\u8FD0\u884C\u65F6",
        "\u539F\u8FD0\u884C\u65F6\u4F1A\u5148\u5907\u4EFD\uFF0C\u5931\u8D25\u65F6\u81EA\u52A8\u6062\u590D\u3002"
      );
      if (fs2.existsSync(runtimePath)) {
        fs2.renameSync(runtimePath, workspace.backupPath);
        oldRuntimeBackedUp = true;
      }
      fs2.renameSync(payloadPath, runtimePath);
      newRuntimeActivated = true;
      setProgress(
        "setup",
        "\u6B63\u5728\u914D\u7F6E\u79C1\u6709 Python \u73AF\u5883",
        "\u9996\u6B21\u521B\u5EFA\u865A\u62DF\u73AF\u5883\u6216\u8BBF\u95EE PyPI \u65F6\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F\u3002"
      );
      let setupResult;
      if (process.platform === "win32") {
        const setupPath = path2.join(
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
          path2.join(runtimePath, "scripts", "setup-runtime.sh"),
          path2.join(runtimePath, "scripts", "doctor.sh"),
          path2.join(runtimePath, "scripts", "MD\u5BFC\u51FAWord\u6A21\u677F.command"),
          path2.join(
            runtimePath,
            "Pandoc&pandoc-crossref",
            target.pandocFile
          ),
          path2.join(
            runtimePath,
            "Pandoc&pandoc-crossref",
            target.crossrefFile
          )
        ];
        for (const executablePath of executablePaths) {
          if (fs2.existsSync(executablePath)) {
            fs2.chmodSync(executablePath, 493);
          }
        }
        setupResult = await runProcess(
          "/bin/bash",
          [path2.join(runtimePath, "scripts", "setup-runtime.sh")],
          { cwd: runtimePath }
        );
      }
      if (setupResult.code !== 0) {
        throw new Error(
          setupResult.output.trim() || `Python \u73AF\u5883\u5B89\u88C5\u5931\u8D25\uFF1A${setupResult.code}`
        );
      }
      setProgress("doctor", "\u6B63\u5728\u6267\u884C\u6700\u7EC8\u73AF\u5883\u81EA\u68C0", "\u5373\u5C06\u5B8C\u6210\u5B89\u88C5\u3002");
      const status = this.runtimeStatus(target, version);
      if (!status.ready) {
        throw new Error(status.message);
      }
      this.ensureTemplateLibrary();
      committed = true;
      new import_obsidian.Notice(`Word \u5BFC\u51FA\u8FD0\u884C\u65F6\u5B89\u88C5\u5B8C\u6210\uFF1A${status.message}`, 1e4);
      return true;
    } catch (error) {
      if (committed) {
        console.warn("\u8FD0\u884C\u65F6\u5DF2\u5B89\u88C5\uFF0C\u4F46\u5B8C\u6210\u63D0\u793A\u5931\u8D25\uFF1A", error);
        return true;
      }
      let failureMessage = error instanceof Error ? error.message : String(error);
      try {
        if (newRuntimeActivated && fs2.existsSync(runtimePath)) {
          fs2.rmSync(runtimePath, { recursive: true, force: true });
        }
        if (oldRuntimeBackedUp) {
          if (!workspace || !fs2.existsSync(workspace.backupPath)) {
            throw new Error("\u65E7\u8FD0\u884C\u65F6\u5907\u4EFD\u4E0D\u5B58\u5728");
          }
          if (fs2.existsSync(runtimePath)) {
            fs2.rmSync(runtimePath, { recursive: true, force: true });
          }
          fs2.renameSync(workspace.backupPath, runtimePath);
        }
        rollbackSucceeded = true;
      } catch (rollbackError) {
        failureMessage += "\uFF1B\u81EA\u52A8\u6062\u590D\u65E7\u8FD0\u884C\u65F6\u5931\u8D25\uFF1A" + (rollbackError instanceof Error ? rollbackError.message : String(rollbackError));
      }
      if (error instanceof RuntimeInstallBusyError) {
        new import_obsidian.Notice(error.message, 1e4);
        return false;
      }
      const downloadFailure = [
        "download",
        "validate-download"
      ].includes(progressStageCode);
      const retryHint = downloadFailure ? "\u8BF7\u786E\u8BA4\u6D4F\u89C8\u5668\u80FD\u6253\u5F00\u8BE5\u7248\u672C\u7684 GitHub Release\uFF0C\u7F51\u7EDC\u6062\u590D\u540E\u53EA\u91CD\u8BD5\u4E00\u6B21\u3002" : "\u8BF7\u91CD\u65B0\u6267\u884C\u201C\u5B89\u88C5\u6216\u4FEE\u590D\u201D\uFF1B\u82E5\u4ECD\u5931\u8D25\uFF0C\u8FD0\u884C\u73AF\u5883\u81EA\u68C0\u5E76\u67E5\u770B\u6545\u969C\u6392\u67E5\u6587\u6863\u3002";
      const backupAvailable = !rollbackSucceeded && oldRuntimeBackedUp && workspace && fs2.existsSync(workspace.backupPath);
      const backupHint = backupAvailable ? ` \u65E7\u8FD0\u884C\u65F6\u5907\u4EFD\u4FDD\u7559\u5728\uFF1A${workspace.backupPath}\u3002` : !rollbackSucceeded ? " \u81EA\u52A8\u6E05\u7406\u5931\u8D25\u7684\u65B0\u8FD0\u884C\u65F6\u672A\u5B8C\u6210\uFF0C\u8BF7\u5B8C\u5168\u9000\u51FA Obsidian \u540E\u518D\u4FEE\u590D\u3002" : "";
      new import_obsidian.Notice(
        `\u8FD0\u884C\u65F6\u5B89\u88C5\u5931\u8D25\uFF08${progressStage}\uFF09\uFF1A${failureMessage}\u3002${retryHint}${backupHint}`,
        2e4
      );
      return false;
    } finally {
      if (progressTimer !== null) {
        window.clearInterval(progressTimer);
      }
      progressNotice?.hide();
      if (committed || rollbackSucceeded) {
        const cleanupError = removeTreeBestEffort(workspace?.root || null);
        if (cleanupError) {
          console.warn(
            "\u8FD0\u884C\u65F6\u5B89\u88C5\u5DF2\u7ED3\u675F\uFF0C\u4F46\u4E34\u65F6\u76EE\u5F55\u6E05\u7406\u5931\u8D25\uFF1A",
            cleanupError
          );
        }
      }
      const lockError = releaseRuntimeInstallLock(installLock);
      if (lockError) {
        console.warn("\u8FD0\u884C\u65F6\u5B89\u88C5\u9501\u6E05\u7406\u5931\u8D25\uFF1A", lockError);
      }
    }
  }
  async runDoctor() {
    const root = this.getRuntimeRoot();
    const status = this.runtimeStatus();
    if (!root || !status.ready) {
      new import_obsidian.Notice(`\u73AF\u5883\u81EA\u68C0\u672A\u901A\u8FC7\uFF1A${status.message}`, 12e3);
      return false;
    }
    const runtimePaths = this.runtimePaths(root);
    if (!runtimePaths || !fs2.existsSync(runtimePaths.doctor) || !fs2.existsSync(runtimePaths.python)) {
      new import_obsidian.Notice("\u8DE8\u5E73\u53F0\u73AF\u5883\u81EA\u68C0\u7A0B\u5E8F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u3002");
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
    new import_obsidian.Notice(
      result.code === 0 ? `\u73AF\u5883\u81EA\u68C0\u901A\u8FC7\uFF1A${summary}` : `\u73AF\u5883\u81EA\u68C0\u5931\u8D25\uFF1A${summary}`,
      15e3
    );
    return result.code === 0;
  }
  selectExportMode() {
    return new Promise((resolve) => {
      new ExportModeModal(this.app, resolve).open();
    });
  }
  selectFormatSettings(templateFiles, outputName, options = {}) {
    return new Promise((resolve) => {
      new FormatSettingsModal(
        this.app,
        {
          presets: this.exportSettings.presets,
          templateFiles,
          outputName,
          figureReflowDefault: options.figureReflowDefault === true
        },
        resolve
      ).open();
    });
  }
  selectWordFile(files) {
    return new Promise((resolve) => {
      new WordFileSelectModal(this.app, files, resolve).open();
    });
  }
  async recolorWordCitationsForCurrentFile(file) {
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new import_obsidian.Notice("\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u5904\u7406 Word\u3002");
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
        new import_obsidian.Notice(`\u8FD0\u884C\u65F6\u4ECD\u4E0D\u53EF\u7528\uFF1A${runtimeStatus.message}`, 12e3);
        return;
      }
    }
    const runtimePaths = this.runtimePaths(this.getRuntimeRoot());
    if (!runtimePaths || !fs2.existsSync(runtimePaths.python) || !fs2.existsSync(runtimePaths.recolor)) {
      new import_obsidian.Notice("\u672A\u627E\u5230 Zotero \u5F15\u6587\u7740\u8272\u7A0B\u5E8F\uFF0C\u8BF7\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u3002");
      return;
    }
    const markdownPath = path2.join(adapter.getBasePath(), file.path);
    const directory = path2.dirname(markdownPath);
    let wordFiles = [];
    try {
      wordFiles = fs2.readdirSync(directory, { withFileTypes: true }).filter(
        (entry) => entry.isFile() && !entry.name.startsWith("~$") && entry.name.toLowerCase().endsWith(".docx")
      ).map((entry) => {
        const wordPath = path2.join(directory, entry.name);
        const modified = fs2.statSync(wordPath).mtime;
        return {
          path: wordPath,
          modified,
          label: `${entry.name} \xB7 ` + modified.toLocaleString("zh-CN", { hour12: false })
        };
      }).sort((a, b) => b.modified.getTime() - a.modified.getTime());
    } catch (error) {
      new import_obsidian.Notice(`\u65E0\u6CD5\u8BFB\u53D6\u5F53\u524D\u6587\u4EF6\u5939\u4E2D\u7684 Word\uFF1A${error.message}`, 1e4);
      return;
    }
    if (!wordFiles.length) {
      new import_obsidian.Notice("\u5F53\u524D Markdown \u6240\u5728\u6587\u4EF6\u5939\u4E2D\u6CA1\u6709\u53EF\u5904\u7406\u7684 .docx \u6587\u4EF6\u3002");
      return;
    }
    const selectedPath = await this.selectWordFile(wordFiles);
    if (!selectedPath) {
      new import_obsidian.Notice("\u5DF2\u53D6\u6D88 Zotero \u5F15\u6587\u7740\u8272\u3002");
      return;
    }
    if (!fs2.existsSync(selectedPath)) {
      new import_obsidian.Notice(`\u6240\u9009 Word \u5DF2\u4E0D\u5B58\u5728\uFF1A${selectedPath}`, 1e4);
      return;
    }
    const requestedOutput = path2.join(
      path2.dirname(selectedPath),
      `${path2.basename(selectedPath, path2.extname(selectedPath))}-\u5F15\u6587\u84DD\u8272.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutput);
    const failureLogPath = path2.join(
      path2.dirname(selectedPath),
      `${path2.basename(selectedPath, path2.extname(selectedPath))}-\u5F15\u6587\u7740\u8272\u5931\u8D25.log.txt`
    );
    if (fs2.existsSync(failureLogPath)) {
      try {
        fs2.unlinkSync(failureLogPath);
      } catch {
      }
    }
    const progressModal = new ExportProgressModal(
      this.app,
      path2.basename(selectedPath),
      {
        title: "\u6B63\u5728\u6062\u590D Zotero \u5F15\u6587\u989C\u8272",
        successStage: "\u5F15\u6587\u7740\u8272\u5B8C\u6210",
        failureStage: "\u5F15\u6587\u7740\u8272\u5931\u8D25"
      }
    );
    progressModal.open();
    progressModal.updateProgress(
      1,
      "\u542F\u52A8\u5F15\u6587\u7740\u8272\u7A0B\u5E8F",
      "\u6E90 Word \u4E0D\u8986\u76D6\uFF1BZotero \u57DF\u4FDD\u6301\u53EF\u5237\u65B0"
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
      cwd: path2.dirname(runtimePaths.recolor),
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
      const launchError = `\u542F\u52A8\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF1A${error.message}`;
      output += `
${launchError}
`;
      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
      }
      progressModal.fail(launchError, failureLogPath);
      new import_obsidian.Notice(launchError, 1e4);
    });
    child.once("close", (code) => {
      flushLineBuffers();
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch ? path2.basename(wordMatch[1].trim()) : path2.basename(outputPath);
        if (fs2.existsSync(failureLogPath)) {
          try {
            fs2.unlinkSync(failureLogPath);
          } catch {
          }
        }
        progressModal.complete(wordName);
        new import_obsidian.Notice(`Zotero \u5F15\u6587\u5DF2\u6062\u590D\u4E3A\u84DD\u8272\uFF1A${wordName}`, 1e4);
        return;
      }
      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
      }
      const details = humanizeProcessOutput(output).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-4).join("\uFF1B");
      progressModal.fail(
        details || `\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF0C\u9000\u51FA\u4EE3\u7801 ${code}\u3002`,
        failureLogPath
      );
      new import_obsidian.Notice(
        details ? `\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF08${code}\uFF09\uFF1A${details}` : `\u5F15\u6587\u7740\u8272\u5931\u8D25\uFF0C\u9000\u51FA\u4EE3\u7801 ${code}\u3002`,
        12e3
      );
    });
    new import_obsidian.Notice(
      `\u6B63\u5728\u751F\u6210\u84DD\u8272\u5F15\u6587\u526F\u672C\uFF1A${path2.basename(outputPath)}`,
      8e3
    );
  }
  async exportCurrentFile(file, options = {}) {
    const exportMode = await this.selectExportMode();
    if (!exportMode) {
      new import_obsidian.Notice("\u5DF2\u53D6\u6D88 Word \u5BFC\u51FA\u3002");
      return;
    }
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new import_obsidian.Notice("\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u542F\u52A8\u672C\u5730\u5BFC\u51FA\u7A0B\u5E8F\u3002");
      return;
    }
    const vaultPath = adapter.getBasePath();
    const markdownPath = path2.join(vaultPath, file.path);
    let markdownSource = "";
    try {
      markdownSource = await this.app.vault.cachedRead(file);
    } catch (error) {
      new import_obsidian.Notice(`\u65E0\u6CD5\u8BFB\u53D6\u5F53\u524D Markdown\uFF1A${error.message}`);
      return;
    }
    const defaultOutputName = safeDefaultOutputBaseName(
      markdownArticleTitle(markdownSource, file.basename),
      file.basename
    );
    let runtimeStatus = this.runtimeStatus();
    if (!runtimeStatus.ready) {
      const installed = await this.installRuntime();
      if (!installed) {
        return;
      }
      runtimeStatus = this.runtimeStatus();
      if (!runtimeStatus.ready) {
        new import_obsidian.Notice(`\u8FD0\u884C\u65F6\u4ECD\u4E0D\u53EF\u7528\uFF1A${runtimeStatus.message}`, 12e3);
        return;
      }
    }
    const pandocRoot = this.getRuntimeRoot();
    const runtimePaths = this.runtimePaths(pandocRoot);
    const templateDir = this.ensureTemplateLibrary();
    if (!templateDir) {
      new import_obsidian.Notice("\u65E0\u6CD5\u521B\u5EFA\u7528\u6237\u6A21\u677F\u76EE\u5F55\u3002");
      return;
    }
    if (!runtimePaths || !fs2.existsSync(runtimePaths.python) || !fs2.existsSync(runtimePaths.exporter)) {
      new import_obsidian.Notice("\u672A\u627E\u5230\u5F53\u524D\u7CFB\u7EDF\u7684 Python \u5BFC\u51FA\u7A0B\u5E8F\uFF0C\u8BF7\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u3002");
      return;
    }
    let templateFiles = [];
    try {
      templateFiles = fs2.readdirSync(templateDir).filter(
        (name) => !name.startsWith("~$") && name.toLowerCase().endsWith(".docx")
      ).sort((a, b) => a.localeCompare(b, "zh-CN"));
    } catch (error) {
      new import_obsidian.Notice(`\u65E0\u6CD5\u8BFB\u53D6 Word \u6A21\u677F\u76EE\u5F55\uFF1A${error.message}`);
      return;
    }
    if (!templateFiles.length) {
      new import_obsidian.Notice(`Word \u6A21\u677F\u76EE\u5F55\u4E2D\u6CA1\u6709 .docx \u6587\u4EF6\uFF1A${templateDir}`);
      return;
    }
    const formatSelection = await this.selectFormatSettings(
      templateFiles,
      defaultOutputName,
      {
        figureReflowDefault: options.figureReflowDefault === true
      }
    );
    if (!formatSelection) {
      new import_obsidian.Notice("\u5DF2\u53D6\u6D88 Word \u5BFC\u51FA\u3002");
      return;
    }
    const templatePath = path2.join(
      templateDir,
      formatSelection.templateFile
    );
    if (!fs2.existsSync(templatePath)) {
      new import_obsidian.Notice(`\u672A\u627E\u5230\u6240\u9009 Word \u6A21\u677F\uFF1A${templatePath}`);
      return;
    }
    if (formatSelection.savePreset) {
      this.exportSettings.presets[formatSelection.presetName] = {
        name: formatSelection.presetName,
        config: formatSelection.config,
        templateFile: formatSelection.templateFile
      };
      await this.saveData(this.exportSettings);
      new import_obsidian.Notice(`\u5DF2\u4FDD\u5B58\u683C\u5F0F\u65B9\u6848\uFF1A${formatSelection.presetName}`);
    }
    const requestedOutputPath = path2.join(
      path2.dirname(markdownPath),
      `${formatSelection.outputName}.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutputPath);
    if (outputPath !== requestedOutputPath) {
      new import_obsidian.Notice(
        `\u540C\u540D Word \u5DF2\u5B58\u5728\uFF0C\u539F\u6587\u4EF6\u4FDD\u6301\u4E0D\u53D8\uFF1B\u672C\u6B21\u53E6\u5B58\u4E3A\uFF1A` + path2.basename(outputPath),
        1e4
      );
    }
    let output = "";
    let failedToStart = false;
    const failureLogPath = path2.join(
      path2.dirname(markdownPath),
      `${file.basename}-\u5BFC\u51FA\u5931\u8D25.log.txt`
    );
    if (fs2.existsSync(failureLogPath)) {
      try {
        fs2.unlinkSync(failureLogPath);
      } catch {
      }
    }
    const progressModal = new ExportProgressModal(this.app, file.name);
    progressModal.open();
    progressModal.updateProgress(
      1,
      "\u542F\u52A8\u5BFC\u51FA\u7A0B\u5E8F",
      `${exportMode === "strict" ? "\u4E25\u683C\u6A21\u5F0F" : "\u517C\u5BB9\u6A21\u5F0F"} \xB7 ` + formatSelection.displayName
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
        cwd: path2.dirname(runtimePaths.exporter),
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
      const launchError = `\u542F\u52A8 Word \u5BFC\u51FA\u5931\u8D25\uFF1A${error.message}`;
      output += `
${launchError}
`;
      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
      }
      progressModal.fail(launchError, failureLogPath);
      new import_obsidian.Notice(`\u542F\u52A8 Word \u5BFC\u51FA\u5931\u8D25\uFF1A${error.message}`);
    });
    child.once("close", (code) => {
      flushLineBuffers();
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch ? path2.basename(wordMatch[1].trim()) : path2.basename(outputPath);
        if (fs2.existsSync(failureLogPath)) {
          try {
            fs2.unlinkSync(failureLogPath);
          } catch {
          }
        }
        progressModal.complete(wordName);
        new import_obsidian.Notice(`Word export completed: ${wordName}`, 8e3);
        return;
      }
      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
      }
      const details = humanizeProcessOutput(output).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-4).join("\uFF1B");
      progressModal.fail(
        details || `Word export failed with code ${code}.`,
        failureLogPath
      );
      new import_obsidian.Notice(
        details ? `Word export failed (${code}): ${details}` : `Word export failed with code ${code}.`,
        12e3
      );
    });
    child.stdin.end();
    const modeLabel = exportMode === "strict" ? "\u4E25\u683C\u6A21\u5F0F" : "\u517C\u5BB9\u6A21\u5F0F";
    new import_obsidian.Notice(
      `\u6B63\u5728\u5BFC\u51FA\uFF08${modeLabel}\uFF5C${formatSelection.displayName}\uFF09\uFF1A` + path2.basename(outputPath)
    );
  }
};
