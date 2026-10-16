// @ts-nocheck
import {
  getLanguage as getObsidianLanguage,
  Modal,
  moment,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting
} from "obsidian";
import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  RuntimeInstallBusyError,
  acquireRuntimeInstallLock,
  createRuntimeInstallWorkspace,
  formatMegabytes,
  releaseRuntimeInstallLock,
  removeTreeBestEffort,
  runSingleFlight
} from "./runtime-install";
import {
  RuntimeDownloadError,
  downloadRuntimeAssetWithRetry,
  isManuallyRetryableRuntimeDownloadError
} from "./runtime-download";
import {
  createTranslator,
  hasTranslationKey,
  normalizeLocaleMode,
  resolveLanguage,
  translateDynamic
} from "./i18n";
import { obsidianBufferedRequest } from "./obsidian-buffered-request";
import { discoverZoteroStyles } from "./zotero-styles";

declare const __GITHUB_REPOSITORY__: string;

const PLUGIN_VERSION = "1.6.1";
const RUNTIME_MANIFEST = "runtime-manifest.json";
const PROGRESS_PREFIX = "@@MD_EXPORT_PROGRESS@@";
const RUNTIME_DOWNLOAD_MAX_ATTEMPTS = 3;
const RUNTIME_INSTALL_REGISTRY_KEY = Symbol.for(
  "md-export-word.runtime-install-registry"
);
const LOCALIZED_COMMAND_IDS = Object.freeze([
  "export-current-markdown-to-word",
  "export-current-markdown-to-word-with-figure-reflow",
  "reapply-blue-zotero-citations",
  "install-or-repair-runtime",
  "check-runtime"
]);

const RUNTIME_TARGETS = Object.freeze({
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

const DEFAULT_TEMPLATE_FILE = "导出格式模板.docx";
const DEFAULT_FORMAT = Object.freeze({
  preset_name: "当前期刊模板",
  document_language: "zh-CN",
  include_english_captions: true,
  east_asia_font: "宋体",
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

const DEFAULT_TRANSLATOR = createTranslator("zh-CN");

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
  new Setting(container)
    .setName(t("settings.language.name"))
    .setDesc(t("settings.language.desc"))
    .addDropdown((dropdown) => {
      dropdown
        .addOption("system", t("settings.language.system"))
        .addOption("zh-CN", t("settings.language.zhCN"))
        .addOption("en", t("settings.language.en"))
        .setValue(plugin.getLocaleMode())
        .onChange(async (value) => {
          await plugin.setLocaleMode(value);
          onChanged?.();
        });
    });
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function formatDurationSeconds(seconds, t, roundUp = true) {
  const normalized = Math.max(
    0,
    roundUp ? Math.ceil(Number(seconds) || 0) : Math.floor(Number(seconds) || 0)
  );
  const minutes = Math.floor(normalized / 60);
  const remainingSeconds = normalized % 60;
  return minutes > 0
    ? t("duration.minutesSeconds", {
        minutes,
        seconds: remainingSeconds
      })
    : t("duration.seconds", { seconds: remainingSeconds });
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
    return errorMessage(error) || t("runtimeDownload.unknownError");
  }
  switch (error.code) {
    case "ABORTED":
      return t("runtimeDownload.cancelled");
    case "IDLE_TIMEOUT":
      return t("runtime.install.timeout", {
        seconds: Math.max(
          1,
          Math.round(Number(error.details?.idleTimeoutMs || 90000) / 1000)
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
    const partialSize = fs.statSync(workspace.partialZipPath).size;
    if (partialSize !== expectedSize) {
      throw new Error(t("runtime.install.archiveMissing"));
    }
    descriptor = fs.openSync(workspace.partialZipPath, "r");
    const header = Buffer.alloc(4);
    const bytesRead = fs.readSync(descriptor, header, 0, header.length, 0);
    if (bytesRead < 4) {
      throw new Error(t("runtime.install.archiveEmpty"));
    }
    const signature = header.readUInt32LE(0);
    if (![0x04034b50, 0x06054b50, 0x08074b50].includes(signature)) {
      throw new Error(t("runtime.install.archiveNotZip"));
    }
  } finally {
    if (descriptor !== null) {
      fs.closeSync(descriptor);
    }
  }

  fs.renameSync(workspace.partialZipPath, workspace.zipPath);
  if (fs.statSync(workspace.zipPath).size !== expectedSize) {
    throw new Error(t("runtime.install.archiveMissing"));
  }
  return expectedSize;
}

function runtimeInstallRegistry() {
  if (!globalThis[RUNTIME_INSTALL_REGISTRY_KEY]) {
    globalThis[RUNTIME_INSTALL_REGISTRY_KEY] = Object.create(null);
  }
  return globalThis[RUNTIME_INSTALL_REGISTRY_KEY];
}

function detectedRuntimeTargetId() {
  const exact = Object.values(RUNTIME_TARGETS).find(
    (target) =>
      target.nodePlatform === process.platform &&
      target.nodeArch === process.arch
  );
  return exact?.id || null;
}

function cloneFormat(config = DEFAULT_FORMAT) {
  return { ...DEFAULT_FORMAT, ...config };
}

function formatSummary(config, t = DEFAULT_TRANSLATOR) {
  return t("format.summary", {
    documentLanguage: config.document_language === "en-US" ? "English" : "中文",
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
    figureReflow: config.figure_reflow
      ? t("common.enabled")
      : t("common.disabled")
  });
}

function visibleMarkdownHeading(text) {
  return String(text || "")
    .trim()
    .replace(/\s+#+\s*$/, "")
    .replace(/[*_`~]/g, "")
    .trim();
}

function markdownArticleTitle(source, fallback) {
  const lines = String(source || "").split(/\r?\n/);
  let bodyStart = 0;
  let metadataTitle = "";
  if (lines[0]?.trim() === "---") {
    const frontmatterEnd = lines
      .slice(1)
      .findIndex((line) => line.trim() === "---");
    if (frontmatterEnd >= 0) {
      bodyStart = frontmatterEnd + 2;
      for (const line of lines.slice(1, bodyStart - 1)) {
        const match = line.match(/^\s*title\s*:\s*(.*?)\s*$/i);
        if (
          match &&
          !["", "|", ">", "|-", ">-"].includes(match[1].trim())
        ) {
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
  return (
    character.charCodeAt(0) < 32 ||
    '<>:"/\\|?*'.includes(character)
  );
}

function normalizeOutputBaseName(value, t = DEFAULT_TRANSLATOR) {
  const outputName = String(value || "")
    .trim()
    .replace(/\.docx$/i, "")
    .trim();
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

function safeDefaultOutputBaseName(
  value,
  fallback,
  t = DEFAULT_TRANSLATOR
) {
  const clean = String(value || "")
    .trim()
    .replace(/\.docx$/i, "")
    .split("")
    .map((character) =>
      isInvalidWindowsFileNameCharacter(character) ? "-" : character
    )
    .join("")
    .replace(/[. ]+$/g, "")
    .trim();
  const result = normalizeOutputBaseName(clean, t);
  if (result.value) {
    return result.value;
  }
  const fallbackResult = normalizeOutputBaseName(fallback, t);
  return fallbackResult.value || t("format.defaultOutputName");
}

function fileTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-` +
    `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function uniqueOutputPath(requestedPath) {
  if (!fs.existsSync(requestedPath)) {
    return requestedPath;
  }
  const directory = path.dirname(requestedPath);
  const extension = path.extname(requestedPath) || ".docx";
  const stem = path.basename(requestedPath, extension);
  const stampedStem = `${stem}-${fileTimestamp()}`;
  let candidate = path.join(directory, `${stampedStem}${extension}`);
  let sequence = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(
      directory,
      `${stampedStem}-${sequence}${extension}`
    );
    sequence += 1;
  }
  return candidate;
}

class ExportModeModal extends Modal {
  constructor(plugin, resolve) {
    super(plugin.app);
    this.plugin = plugin;
    this.resolve = resolve;
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

    new Setting(contentEl)
      .setName(t("exportMode.strict.name"))
      .setDesc(t("exportMode.strict.desc"))
      .addButton((button) =>
        button
          .setButtonText(t("exportMode.strict.action"))
          .setCta()
          .onClick(() => this.choose("strict"))
      );

    new Setting(contentEl)
      .setName(t("exportMode.compatible.name"))
      .setDesc(t("exportMode.compatible.desc"))
      .addButton((button) =>
        button
          .setButtonText(t("exportMode.compatible.action"))
          .onClick(() => this.choose("compatible"))
      );

    new Setting(contentEl).addButton((button) =>
      button.setButtonText(t("common.cancel")).onClick(() => this.close())
    );
  }

  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(() =>
      this.render()
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
}

class WordFileSelectModal extends Modal {
  constructor(plugin, files, resolve) {
    super(plugin.app);
    this.plugin = plugin;
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

  render() {
    const { contentEl } = this;
    const t = this.plugin.t.bind(this.plugin);
    contentEl.empty();
    contentEl.createEl("h2", { text: t("wordSelect.title") });
    addLanguageSetting(contentEl, this.plugin);
    contentEl.createEl("p", {
      text: t("wordSelect.desc")
    });

    new Setting(contentEl)
      .setName(t("wordSelect.file.name"))
      .setDesc(t("wordSelect.file.desc"))
      .addDropdown((dropdown) => {
        for (const file of this.files) {
          dropdown.addOption(file.path, file.label);
        }
        dropdown.setValue(this.selectedPath).onChange((value) => {
          this.selectedPath = value;
        });
      });

    new Setting(contentEl)
      .addButton((button) =>
        button
          .setButtonText(t("wordSelect.action"))
          .setCta()
          .onClick(() => this.finish(this.selectedPath))
      )
      .addButton((button) =>
        button
          .setButtonText(t("common.cancel"))
          .onClick(() => this.finish(null))
      );
  }

  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(() =>
      this.render()
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
}

class FormatSettingsModal extends Modal {
  constructor(plugin, options, resolve) {
    super(plugin.app);
    this.plugin = plugin;
    this.resolve = resolve;
    this.resolved = false;
    this.presets = options.presets || {};
    this.templateFiles = options.templateFiles.length
      ? options.templateFiles
      : [DEFAULT_TEMPLATE_FILE];
    this.figureReflowDefault = options.figureReflowDefault === true;
    this.documentLanguage = /^en(?:[-_]|$)/i.test(String(options.documentLanguage || "")) ? "en-US" : "zh-CN";
    this.citationReport=options.citationReport || {};
    this.zoteroStyles=options.zoteroStyles || {styles:[],directories:[]};
    const defaultCitationStyleId=plugin.exportSettings?.defaultCitationStyleId || "";
    this.citationStyleId=this.zoteroStyles.styles.some(style=>style.id===defaultCitationStyleId) ? defaultCitationStyleId : "";
    this.citationDisplay="rendered";
    this.selectedPreset = "__default__";
    this.config = this.defaultCommandFormat();
    this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE)
      ? DEFAULT_TEMPLATE_FILE
      : this.templateFiles[0];
    this.presetName = "";
    this.outputName =
      options.outputName || plugin.t("format.defaultOutputName");
  }

  defaultCommandFormat() {
    return cloneFormat({
      document_language: this.documentLanguage,
      ...(this.documentLanguage === "en-US" ? {body_first_line_chars: 2, east_asia_font: "Times New Roman"} : {}),
      figure_reflow: this.figureReflowDefault
    });
  }

  usePreset(value) {
    this.selectedPreset = value;
    if (value === "__default__") {
      this.config = this.defaultCommandFormat();
      this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE)
        ? DEFAULT_TEMPLATE_FILE
        : this.templateFiles[0];
      this.presetName = "";
    } else {
      const preset = this.presets[value];
      this.config = cloneFormat(preset?.config);
      this.config.preset_name = preset?.name || value;
      this.templateFile =
        preset?.templateFile && this.templateFiles.includes(preset.templateFile)
          ? preset.templateFile
          : this.templateFile;
      this.presetName = preset?.name || value;
    }
    this.render();
  }

  finish({ useDefault = false, savePreset = false } = {}) {
    const t = this.plugin.t.bind(this.plugin);
    const normalizedOutput = normalizeOutputBaseName(this.outputName, t);
    if (!normalizedOutput.value) {
      new Notice(normalizedOutput.error);
      return;
    }
    const config = useDefault
      ? this.defaultCommandFormat()
      : cloneFormat(this.config);
    const templateFile = useDefault
      ? this.templateFiles.includes(DEFAULT_TEMPLATE_FILE)
        ? DEFAULT_TEMPLATE_FILE
        : this.templateFiles[0]
      : this.templateFile;
    const requestedName = this.presetName.trim();
    const chosenStyle=this.zoteroStyles.styles.find(style=>style.id===this.citationStyleId);
    if(this.citationDisplay==="rendered" && chosenStyle && !chosenStyle.renderPath) {
      new Notice(t("format.citationStyle.parentMissing"));
      return;
    }
    if (savePreset && !requestedName) {
      new Notice(t("format.saveName.required"));
      return;
    }
    const differsFromDefault =
      Object.keys(DEFAULT_FORMAT).some(
        (key) =>
          key !== "preset_name" && config[key] !== DEFAULT_FORMAT[key]
      ) || templateFile !== DEFAULT_TEMPLATE_FILE;
    const displayName = savePreset
      ? requestedName
      : useDefault
        ? t("format.preset.defaultName")
        : this.selectedPreset !== "__default__"
          ? config.preset_name
          : differsFromDefault
            ? t("format.preset.customName")
            : t("format.preset.defaultName");
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
      citationStyle: this.zoteroStyles.styles.find(style=>style.id===this.citationStyleId) || null,
      citationDisplay: this.citationDisplay
    });
  }

  addDropdown(container, name, desc, key, options) {
    const t = this.plugin.t.bind(this.plugin);
    const current = String(this.config[key]);
    new Setting(container)
      .setName(name)
      .setDesc(desc)
      .addDropdown((dropdown) => {
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
    new Setting(contentEl)
      .setClass("md-export-output-name")
      .setName(t("format.outputName.name"))
      .setDesc(t("format.outputName.desc"))
      .addText((text) => {
        text
          .setPlaceholder(t("format.outputName.placeholder"))
          .setValue(this.outputName)
          .onChange((value) => {
            this.outputName = value;
          });
      });
    const summary=contentEl.createDiv({cls:"md-export-format-summary"});
    summary.style.cssText="position:sticky;top:0;z-index:2;padding:12px;background:var(--background-secondary);border:1px solid var(--background-modifier-border);border-radius:8px;white-space:pre-wrap;";
    const updateSummary=()=>{
      const selectedStyle=this.zoteroStyles.styles.find(style=>style.id===this.citationStyleId);
      const styleLabel=selectedStyle?.title || this.citationReport.style;
      const english=this.config.document_language==="en-US",uiEnglish=this.plugin.getLanguage()==="en";
      const indent=Number(this.config.body_first_line_chars)*(english?0.5:1);
      const lines=uiEnglish ? ["Current export format",`Manuscript: ${english?"English":"Chinese"}`,`Font: ${english?this.config.western_font:this.config.east_asia_font+" / "+this.config.western_font}`,`Body: ${this.config.body_size_pt} pt; line spacing ${this.config.body_line_spacing}`,`First-line indent: ${indent} em; alignment: justified`,`CSL: ${this.citationReport.style || "Global/default citation style"}`] :
        ["本次实际导出格式",`稿件：${english?"英文":"中文"}`,`字体：${english?this.config.western_font:this.config.east_asia_font+" / "+this.config.western_font}`,`正文：${this.config.body_size_pt} pt；行距 ${this.config.body_line_spacing} 倍`,`首行缩进：${indent} em；正文两端对齐`,`引用样式：${this.citationReport.style || "全局／默认 CSL"}`];
      lines[lines.length-1]=(uiEnglish?"Citation style: ":"引用样式：")+(styleLabel || t("format.citationStyle.follow"));
      if(!selectedStyle && this.citationReport.issues?.length)lines.push((uiEnglish?"Check: ":"需核实：")+this.citationReport.issues.join("\n"));
      summary.setText(lines.join("\n"));
    };
    updateSummary();
    contentEl.oninput=()=>queueMicrotask(updateSummary);
    contentEl.onchange=()=>queueMicrotask(updateSummary);
    addLanguageSetting(contentEl, this.plugin);
    new Setting(contentEl)
      .setName(t("format.citationStyle.name"))
      .setDesc(t(this.zoteroStyles.styles.length ? "format.citationStyle.desc" : "format.citationStyle.empty"))
      .addDropdown(dropdown=>{
        dropdown.addOption("",t("format.citationStyle.follow"));
        for(const style of this.zoteroStyles.styles) dropdown.addOption(style.id,style.title);
        dropdown.setValue(this.citationStyleId).onChange(value=>{this.citationStyleId=value;updateSummary();});
        dropdown.selectEl.style.maxWidth="360px";
      })
      .addButton(button=>button.setButtonText(t("format.citationStyle.refresh")).onClick(async()=>{
        button.setDisabled(true);
        try {
          this.zoteroStyles=await discoverZoteroStyles();
          if(!this.zoteroStyles.styles.some(style=>style.id===this.citationStyleId))this.citationStyleId="";
          this.render();
        } finally {button.setDisabled(false);}
      }));
    new Setting(contentEl)
      .setName(t("format.citationDisplay.name"))
      .setDesc(t("format.citationDisplay.desc"))
      .addDropdown(dropdown=>dropdown
        .addOption("manual",t("format.citationDisplay.manual"))
        .addOption("rendered",t("format.citationDisplay.rendered"))
        .setValue(this.citationDisplay).onChange(value=>{this.citationDisplay=value;}));
    new Setting(contentEl)
      .setName(t("format.documentLanguage.name"))
      .setDesc(t("format.documentLanguage.desc"))
      .addButton((button) => {
        button
          .setButtonText(t("format.documentLanguage.zhCN"))
          .onClick(() => {
            this.config.document_language = "zh-CN";
            this.config.body_first_line_chars = 2;
            this.config.east_asia_font = "宋体";
            this.render();
          });
        if (this.config.document_language !== "en-US") button.setCta();
      })
      .addButton((button) => {
        button
          .setButtonText(t("format.documentLanguage.en"))
          .onClick(() => {
            this.config.document_language = "en-US";
            this.config.body_first_line_chars = 2;
            this.config.east_asia_font = this.config.western_font;
            this.render();
          });
        if (this.config.document_language === "en-US") button.setCta();
      });
    if (this.config.document_language !== "en-US") new Setting(contentEl)
      .setName(t("format.englishCaptions.name"))
      .setDesc(t("format.englishCaptions.desc"))
      .addToggle(toggle=>toggle.setValue(this.config.include_english_captions !== false)
        .onChange(value=>{this.config.include_english_captions=value;}));
    contentEl.createEl("p", {
      text: t("format.intro", {
        summary: formatSummary(this.defaultCommandFormat(), t)
      })
    });

    const reflowEnabled = this.config.figure_reflow === true;
    new Setting(contentEl)
      .setName(t("format.figureFlow.name"))
      .setDesc(t("format.figureFlow.desc"))
      .addButton((button) => {
        button
          .setButtonText(t("format.figureFlow.keep"))
          .onClick(() => {
            this.config.figure_reflow = false;
            this.render();
          });
        if (!reflowEnabled) {
          button.setCta();
        }
      })
      .addButton((button) => {
        button.setButtonText(t("format.figureFlow.reflow")).onClick(() => {
          this.config.figure_reflow = true;
          this.render();
        });
        if (reflowEnabled) {
          button.setCta();
        }
      });

    new Setting(contentEl)
      .setName(t("format.preset.name"))
      .setDesc(t("format.preset.desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("__default__", t("format.preset.default"));
        for (const [key, preset] of Object.entries(this.presets)) {
          dropdown.addOption(key, preset.name || key);
        }
        dropdown.setValue(this.selectedPreset).onChange((value) => {
          this.usePreset(value);
        });
      });

    new Setting(contentEl)
      .setName(t("format.template.name"))
      .setDesc(
        t("format.template.default", { file: DEFAULT_TEMPLATE_FILE })
      )
      .addDropdown((dropdown) => {
        for (const file of this.templateFiles) {
          dropdown.addOption(file, file);
        }
        dropdown.setValue(this.templateFile).onChange((value) => {
          this.templateFile = value;
        });
      });

    contentEl.createEl("h3", { text: t("format.section.body") });

    new Setting(contentEl)
      .setName(t("format.eastAsiaFont.name"))
      .setDesc(
        t("format.eastAsiaFont.default", {
          font: DEFAULT_FORMAT.east_asia_font
        })
      )
      .addText((text) =>
        text.setValue(this.config.east_asia_font).onChange((value) => {
          this.config.east_asia_font =
            value.trim() || DEFAULT_FORMAT.east_asia_font;
        })
      );

    new Setting(contentEl)
      .setName(t("format.westernFont.name"))
      .setDesc(
        t("format.westernFont.default", {
          font: DEFAULT_FORMAT.western_font
        })
      )
      .addText((text) =>
        text.setValue(this.config.western_font).onChange((value) => {
          this.config.western_font =
            value.trim() || DEFAULT_FORMAT.western_font;
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
    new Setting(contentEl)
      .setName(t("format.saveName.name"))
      .setDesc(t("format.saveName.desc"))
      .addText((text) =>
        text
          .setPlaceholder(t("format.saveName.placeholder"))
          .setValue(this.presetName)
          .onChange((value) => {
            this.presetName = value;
          })
      );

    new Setting(contentEl)
      .addButton((button) =>
        button
          .setButtonText(t("format.action.useDefault"))
          .onClick(() => this.finish({ useDefault: true }))
      )
      .addButton((button) =>
        button
          .setButtonText(t("format.action.saveAndExport"))
          .onClick(() => this.finish({ savePreset: true }))
      )
      .addButton((button) =>
        button
          .setButtonText(t("format.action.export"))
          .setCta()
          .onClick(() => this.finish())
      )
      .addButton((button) =>
        button
          .setButtonText(t("common.cancel"))
          .onClick(() => this.close())
      );
  }

  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(() =>
      this.render()
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
}

class RuntimeDownloadModal extends Modal {
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
    this.removeLanguageListener = this.plugin.onLanguageChange(() =>
      this.render()
    );
    this.elapsedTimer = window.setInterval(() => this.refreshText(), 1000);
    this.render();
  }

  render() {
    const t = this.plugin.t.bind(this.plugin);
    this.titleEl.setText(t("runtimeDownload.title"));
    this.contentEl.empty();
    addLanguageSetting(this.contentEl, this.plugin);
    this.contentEl.createDiv({
      cls: "md-export-word-progress-file",
      text: `${this.target.label} · ${this.version}`
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
          (Date.now() - this.startedAt) / 1000,
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
    const actions = new Setting(this.actionsEl);
    if (this.actionState === "waiting-retry") {
      actions
        .addButton((button) =>
          button
            .setButtonText(t("runtimeDownload.retry"))
            .setCta()
            .onClick(() => this.resolveRetry(true))
        )
        .addButton((button) =>
          button
            .setButtonText(t("common.close"))
            .setWarning()
            .onClick(() => {
              this.resolveRetry(false);
              this.close();
            })
        );
      return;
    }
    if (this.actionState === "running" && this.controller) {
      actions.addButton((button) =>
        button
          .setButtonText(t("runtimeDownload.cancel"))
          .setWarning()
          .onClick(() => this.controller?.abort())
      );
    }
    actions.addButton((button) => {
      button
        .setButtonText(
          this.actionState === "running"
            ? t("runtimeDownload.hide")
            : t("common.close")
        )
        .onClick(() => this.close());
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
    if (
      progress.receivedBytes === 0 ||
      progress.percent === 100 ||
      now - this.lastProgressRenderAt >= 100
    ) {
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
    return new Promise((resolve) => {
      this.retryResolver = resolve;
    });
  }

  resolveRetry(value) {
    const resolve = this.retryResolver;
    this.retryResolver = null;
    if (resolve) {
      resolve(value);
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
}

class ExportProgressModal extends Modal {
  constructor(plugin, fileName, options = {}) {
    super(plugin.app);
    this.plugin = plugin;
    this.fileName = fileName;
    this.titleKey =
      options.titleKey || "progressModal.export.title";
    this.successKey =
      options.successKey || "progressModal.export.success";
    this.failureKey =
      options.failureKey || "progressModal.export.failure";
    this.logLines = [];
    this.lastPercent = 0;
    this.closedByUser = false;
    this.actionState = "running";
    this.currentEvent = null;
    this.failureLogPath = "";
  }

  onOpen() {
    this.contentEl.addClass("md-export-word-progress-modal");
    this.removeLanguageListener = this.plugin.onLanguageChange(() =>
      this.render()
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
      text: this.currentEvent
        ? this.localizedEventText().stage
        : t("progressModal.starting")
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
    const stage =
      event.stageKey && hasTranslationKey(event.stageKey)
        ? translateDynamic(this.plugin.getLanguage(), event.stageKey, params)
        : event.stage;
    const detail =
      event.detailKey && hasTranslationKey(event.detailKey)
        ? translateDynamic(this.plugin.getLanguage(), event.detailKey, params)
        : event.detail;
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
    const actions = new Setting(this.actionsEl);
    if (this.actionState === "failed") {
      actions.addButton((button) =>
        button
          .setButtonText(t("progressModal.copyErrorLog"))
          .setCta()
          .onClick(() => this.copyLogText(this.failureLogPath))
      );
      if (this.failureLogPath) {
        actions.addButton((button) =>
          button
            .setButtonText(t("progressModal.openLog"))
            .onClick(() => this.openLogFile(this.failureLogPath))
        );
      }
      actions.addButton((button) =>
        button
          .setButtonText(t("common.close"))
          .setWarning()
          .onClick(() => this.close())
      );
      return;
    }
    actions.addButton((button) =>
      button
        .setButtonText(
          this.actionState === "complete"
            ? t("progressModal.copyProcess")
            : t("progressModal.copyCurrent")
        )
        .onClick(() => this.copyLogText())
    );
    actions.addButton((button) => {
      button
        .setButtonText(
          this.actionState === "complete"
            ? t("progressModal.doneAndClose")
            : t("progressModal.hide")
        )
        .onClick(() => this.close());
      if (this.actionState === "complete") {
        button.setCta();
      }
    });
  }

  updateProgress(
    percent,
    stage,
    detail = "",
    level = "info",
    event = {}
  ) {
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
      `[${String(safePercent).padStart(3, " ")}%] ${logStage}` +
        (logDetail ? ` — ${logDetail}` : ""),
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
        detail
          ? `${this.lastPercent}% · ${detail}`
          : `${this.lastPercent}%`
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
      new Notice(this.plugin.t("progressModal.noLog"));
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
      new Notice(successMessage);
      return true;
    } catch (error) {
      new Notice(
        this.plugin.t("progressModal.copyFailed", {
          message: error.message
        }),
        10000
      );
      return false;
    }
  }

  async copyLogText(logPath = "") {
    let text = this.logLines.join("\n");
    if (logPath && fs.existsSync(logPath)) {
      try {
        text = fs.readFileSync(logPath, "utf8");
      } catch {
        // Fall back to the process text already visible in the modal.
      }
    }
    return await this.copyText(
      text,
      logPath
        ? this.plugin.t("progressModal.failureLogCopied")
        : this.plugin.t("progressModal.processCopied")
    );
  }

  openLogFile(logPath) {
    if (!logPath || !fs.existsSync(logPath)) {
      new Notice(this.plugin.t("progressModal.logNotFound"), 10000);
      return;
    }
    const executable =
      process.platform === "darwin" ? "/usr/bin/open" : "powershell.exe";
    const args =
      process.platform === "darwin"
        ? [logPath]
        : [
            "-NoProfile",
            "-Command",
            "Start-Process -FilePath $args[0]",
            logPath
          ];
    try {
      const child = spawn(executable, args, {
        detached: true,
        stdio: "ignore",
        windowsHide: true
      });
      child.once("error", (error) => {
        new Notice(
          this.plugin.t("progressModal.openLogFailed", {
            message: error.message
          }),
          10000
        );
      });
      child.unref();
    } catch (error) {
      new Notice(
        this.plugin.t("progressModal.openLogFailed", {
          message: error.message
        }),
        10000
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
      logPath
        ? this.plugin.t("progressModal.errorLog", { path: logPath })
        : summary,
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
}

class TextInputModal extends Modal {
  constructor(plugin, titleKey, descriptionKey, initialValue, resolve) {
    super(plugin.app);
    this.plugin = plugin;
    this.titleKey = titleKey;
    this.descriptionKey = descriptionKey;
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

  render() {
    const t = this.plugin.t.bind(this.plugin);
    this.contentEl.empty();
    this.titleEl.setText(t(this.titleKey));
    addLanguageSetting(this.contentEl, this.plugin);
    this.contentEl.createEl("p", { text: t(this.descriptionKey) });
    new Setting(this.contentEl)
      .setName(t("repositoryModal.name"))
      .setDesc(t("repositoryModal.format"))
      .addText((text) =>
        text
          .setPlaceholder(t("settings.repository.placeholder"))
          .setValue(this.value)
          .onChange((value) => {
            this.value = value.trim();
          })
      );
    new Setting(this.contentEl)
      .addButton((button) =>
        button
          .setButtonText(t("common.continue"))
          .setCta()
          .onClick(() => this.finish(this.value))
      )
      .addButton((button) =>
        button
          .setButtonText(t("common.cancel"))
          .onClick(() => this.finish(null))
      );
  }

  onOpen() {
    this.removeLanguageListener = this.plugin.onLanguageChange(() =>
      this.render()
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
}

function runProcess(executable, args, options = {}) {
  return new Promise((resolve, reject) => {
    let output = "";
    const child = spawn(executable, args, {
      windowsHide: true,
      ...options,
      stdio: ["ignore", "pipe", "pipe"]
    });
    const collect = (chunk) => {
      output += chunk.toString("utf8");
      if (output.length > 30000) {
        output = output.slice(-30000);
      }
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    child.once("error", reject);
    child.once("close", (code) => resolve({ code, output }));
  });
}

function humanizeProcessOutput(output, language = "zh-CN") {
  const t = createTranslator(language);
  return String(output || "")
    .split(/\r?\n/)
    .map((line) => {
      const normalized = line.trim();
      if (!normalized.startsWith(PROGRESS_PREFIX)) {
        return line;
      }
      try {
        const event = JSON.parse(normalized.slice(PROGRESS_PREFIX.length));
        const params = { ...(event.params || {}) };
        if (params.mode === "strict" || params.mode === "compatible") {
          params.mode = t(`export.mode.${params.mode}`);
        }
        const stage =
          event.stageKey && hasTranslationKey(event.stageKey)
            ? translateDynamic(language, event.stageKey, params)
            : event.stage;
        const detail =
          event.detailKey && hasTranslationKey(event.detailKey)
            ? translateDynamic(language, event.detailKey, params)
            : event.detail;
        return (
          `[${event.percent}%] ${stage}` +
          (detail ? ` — ${detail}` : "")
        );
      } catch {
        return line;
      }
    })
    .join("\n")
    .trim();
}

function appendFailureProcessOutput(logPath, output, language = "zh-CN") {
  const humanOutput = humanizeProcessOutput(output, language);
  if (!humanOutput) {
    return;
  }
  const section =
    "\nObsidian captured process output\n" +
    "--------------------------------\n" +
    humanOutput +
    "\n";
  if (fs.existsSync(logPath)) {
    fs.appendFileSync(logPath, section, "utf8");
  } else {
    fs.writeFileSync(
      logPath,
      "MD Export Word failure report\n" + section,
      "utf8"
    );
  }
}

class MdExportWordSettingTab extends PluginSettingTab {
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

    new Setting(containerEl)
      .setName(t("settings.repository.name"))
      .setDesc(t("settings.repository.desc"))
      .addText((text) => {
        text
          .setPlaceholder(t("settings.repository.placeholder"))
          .setValue(this.plugin.getReleaseRepository())
          .setDisabled(runtimeInstalling)
          .onChange(async (value) => {
            this.plugin.exportSettings.repository = value.trim();
            await this.plugin.saveData(this.plugin.exportSettings);
          });
      });

    new Setting(containerEl)
      .setName(t("settings.autoOpen.name"))
      .setDesc(t("settings.autoOpen.desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.exportSettings.autoOpen !== false)
          .onChange(async (value) => {
            this.plugin.exportSettings.autoOpen = value;
            await this.plugin.saveData(this.plugin.exportSettings);
          })
      );

    const detectedTarget = detectedRuntimeTargetId();
    new Setting(containerEl)
      .setName(t("settings.runtimePlatform.name"))
      .setDesc(t("settings.runtimePlatform.desc"))
      .addDropdown((dropdown) => {
        dropdown.addOption(
          "auto",
          t("settings.runtimePlatform.auto", {
            target: detectedTarget
              ? RUNTIME_TARGETS[detectedTarget].label
              : `${process.platform}/${process.arch}`
          })
        );
        for (const target of Object.values(RUNTIME_TARGETS)) {
          dropdown.addOption(target.id, target.label);
        }
        dropdown
          .setValue(this.plugin.exportSettings.runtimePlatform || "auto")
          .setDisabled(runtimeInstalling)
          .onChange(async (value) => {
            this.plugin.exportSettings.runtimePlatform = value;
            await this.plugin.saveData(this.plugin.exportSettings);
            this.display();
          });
      });

    new Setting(containerEl)
      .setName(t("settings.runtime.name"))
      .setDesc(
        runtimeInstalling
          ? t("settings.runtime.installingDesc")
          : this.plugin.runtimeStatusText()
      )
      .addButton((button) => {
        button
          .setButtonText(
            runtimeInstalling
              ? t("settings.runtime.installing")
              : t("settings.runtime.installOrRepair")
          )
          .setCta()
          .setDisabled(runtimeInstalling)
          .onClick(async () => {
            const installPromise = this.plugin.installRuntime();
            this.display();
            try {
              await installPromise;
            } finally {
              this.display();
            }
          });
      })
      .addButton((button) => {
        button
          .setButtonText(t("settings.runtime.doctor"))
          .setDisabled(runtimeInstalling)
          .onClick(async () => {
            await this.plugin.runDoctor();
            this.display();
          });
      });
  }
}

export default class MdExportWordPlugin extends Plugin {
  async onload() {
    const loadedSettings = (await this.loadData()) || {};
    this.exportSettings = {
      ...loadedSettings,
      settingsVersion: 1,
      language: normalizeLocaleMode(loadedSettings.language),
      presets: loadedSettings.presets || {}
    };
    this.languageListeners = new Set();
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
      getLanguage: () =>
        typeof getObsidianLanguage === "function"
          ? getObsidianLanguage()
          : null,
      getMomentLocale: () => moment.locale()
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
          file &&
          typeof file.extension === "string" &&
          file.extension.toLowerCase() === "md"
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
          file &&
          typeof file.extension === "string" &&
          file.extension.toLowerCase() === "md"
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
          file &&
          typeof file.extension === "string" &&
          file.extension.toLowerCase() === "md"
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
    return path.join(
      adapter.getBasePath(),
      this.app.vault.configDir,
      "plugins",
      this.manifest.id
    );
  }

  getRuntimeRoot() {
    const pluginRoot = this.getPluginRoot();
    return pluginRoot ? path.join(pluginRoot, "runtime") : null;
  }

  getTemplateRoot() {
    const pluginRoot = this.getPluginRoot();
    return pluginRoot ? path.join(pluginRoot, "templates") : null;
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
    if (
      target.nodeArch !== process.arch &&
      !(
        process.platform === "darwin" &&
        process.arch === "arm64" &&
        target.nodeArch === "x64"
      )
    ) {
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
    const binaryRoot = path.join(root, "Pandoc&pandoc-crossref");
    return {
      root,
      target,
      manifest: path.join(root, RUNTIME_MANIFEST),
      exporter: path.join(root, "scripts", "md_export_word_template.py"),
      recolor: path.join(root, "scripts", "recolor_zotero_citations.py"),
      doctor: path.join(root, "scripts", "doctor.py"),
      pandoc: path.join(binaryRoot, target.pandocFile),
      crossref: path.join(binaryRoot, target.crossrefFile),
      python: path.join(root, ...target.pythonParts),
      template: path.join(root, "Word-Template", DEFAULT_TEMPLATE_FILE)
    };
  }

  ensureTemplateLibrary() {
    const runtimeRoot = this.getRuntimeRoot();
    const templateRoot = this.getTemplateRoot();
    if (!runtimeRoot || !templateRoot) {
      return null;
    }
    const bundled = path.join(runtimeRoot, "Word-Template");
    fs.mkdirSync(templateRoot, { recursive: true });
    for (const name of fs.readdirSync(bundled)) {
      if (name.startsWith("~$") || !name.toLowerCase().endsWith(".docx")) {
        continue;
      }
      const source = path.join(bundled, name);
      const destination = path.join(templateRoot, name);
      if (!fs.existsSync(destination)) {
        fs.copyFileSync(source, destination);
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
      typeof __GITHUB_REPOSITORY__ === "string"
        ? __GITHUB_REPOSITORY__
        : ""
    ).trim();
    return stamped;
  }

  runtimeStatus(
    target = this.getRuntimeTarget(),
    expectedVersion = this.manifest.version
  ) {
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
    const missing = required.filter((file) => !fs.existsSync(file));
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
        fs.readFileSync(runtimePaths.manifest, "utf8")
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
          message: errorMessage(error)
        })
      };
    }
  }

  runtimeStatusText() {
    return this.runtimeStatus().message;
  }

  async askRepository(initialValue = "") {
    return await new Promise((resolve) => {
      new TextInputModal(
        this,
        "repositoryModal.title",
        "repositoryModal.desc",
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
        new Notice(this.t("runtime.install.duplicate"), 8000);
      }
    );
  }

  async installRuntimeOnce() {
    const t = this.t.bind(this);
    const target = this.getRuntimeTarget();
    const compatibilityError = this.runtimeCompatibilityError(target);
    if (compatibilityError) {
      new Notice(t("runtime.install.cannotInstall", {
        message: compatibilityError
      }), 12000);
      return false;
    }
    const pluginRoot = this.getPluginRoot();
    if (!pluginRoot) {
      new Notice(t("runtime.install.noLocalFs"));
      return false;
    }

    let repository = this.getReleaseRepository();
    try {
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
        repository = await this.askRepository(repository);
        if (!repository) {
          new Notice(t("runtime.install.cancelled"));
          return false;
        }
        if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
          new Notice(t("runtime.install.invalidRepository"), 10000);
          return false;
        }
        this.exportSettings.repository = repository;
        await this.saveData(this.exportSettings);
      }
    } catch (error) {
      new Notice(t("runtime.install.saveRepositoryFailed", {
        message: errorMessage(error)
      }), 12000);
      return false;
    }

    const version = this.manifest.version || PLUGIN_VERSION;
    const assetUrl =
      `https://github.com/${repository}/releases/download/` +
      `${version}/${target.asset}`;
    const checksumUrl =
      `https://github.com/${repository}/releases/download/` +
      `${version}/SHA256SUMS-${target.id}.txt`;
    const runtimePath = path.join(pluginRoot, "runtime");
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

    const setProgress = (
      stageCode,
      stageKey,
      detailKey = "",
      params = {}
    ) => {
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
      for (;;) {
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
          if (
            isManuallyRetryableRuntimeDownloadError(error) &&
            !downloadModal.closed
          ) {
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

      fs.mkdirSync(workspace.stagePath, { recursive: true });
      setProgress(
        "extract",
        "runtime.install.stage.extract",
        "runtime.install.detail.extract",
        { size: formatMegabytes(archiveSize) }
      );
      const extractResult =
        process.platform === "win32"
          ? await runProcess(
              "powershell.exe",
              [
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-Command",
                "Expand-Archive -LiteralPath $args[0] " +
                  "-DestinationPath $args[1] -Force",
                workspace.zipPath,
                workspace.stagePath
              ],
              { cwd: pluginRoot }
            )
          : await runProcess(
              "/usr/bin/ditto",
              ["-x", "-k", workspace.zipPath, workspace.stagePath],
              { cwd: pluginRoot }
            );
      if (extractResult.code !== 0) {
        throw new Error(
          extractResult.output.trim() ||
            t("runtime.install.extractFailed", { code: extractResult.code })
        );
      }

      setProgress(
        "validate-package",
        "runtime.install.stage.validatePackage",
        "runtime.install.detail.validatePackage"
      );
      const payloadPath = path.join(workspace.stagePath, "runtime");
      const payloadManifestPath = path.join(
        payloadPath,
        RUNTIME_MANIFEST
      );
      if (!fs.existsSync(payloadManifestPath)) {
        throw new Error(t("runtime.install.manifestMissing"));
      }
      const payloadManifest = JSON.parse(
        fs.readFileSync(payloadManifestPath, "utf8")
      );
      if (
        payloadManifest.version !== version ||
        payloadManifest.platform !== target.id
      ) {
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
      if (fs.existsSync(runtimePath)) {
        fs.renameSync(runtimePath, workspace.backupPath);
        oldRuntimeBackedUp = true;
      }
      fs.renameSync(payloadPath, runtimePath);
      newRuntimeActivated = true;

      setProgress(
        "setup",
        "runtime.install.stage.configurePython",
        "runtime.install.detail.configurePython"
      );
      let setupResult;
      if (process.platform === "win32") {
        const setupPath = path.join(
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
          path.join(runtimePath, "scripts", "setup-runtime.sh"),
          path.join(runtimePath, "scripts", "doctor.sh"),
          path.join(runtimePath, "scripts", "MD导出Word模板.command"),
          path.join(
            runtimePath,
            "Pandoc&pandoc-crossref",
            target.pandocFile
          ),
          path.join(
            runtimePath,
            "Pandoc&pandoc-crossref",
            target.crossrefFile
          )
        ];
        for (const executablePath of executablePaths) {
          if (fs.existsSync(executablePath)) {
            fs.chmodSync(executablePath, 0o755);
          }
        }
        setupResult = await runProcess(
          "/bin/bash",
          [path.join(runtimePath, "scripts", "setup-runtime.sh")],
          { cwd: runtimePath }
        );
      }
      if (setupResult.code !== 0) {
        throw new Error(
          setupResult.output.trim() ||
            t("runtime.install.pythonFailed", { code: setupResult.code })
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
      new Notice(t("runtime.install.complete", { status: status.message }), 10000);
      return true;
    } catch (error) {
      if (committed) {
        console.warn("运行时已安装，但完成提示失败：", error);
        return true;
      }

      if (error instanceof RuntimeDownloadError && error.code === "ABORTED") {
        downloadModal?.setCancelled();
        new Notice(t("runtimeDownload.cancelled"), 10000);
      }

      const failureMessage = error instanceof RuntimeDownloadError
        ? localizedRuntimeDownloadError(this, error, version, target.asset)
        : errorMessage(error);
      let recoveryMessage = "";
      try {
        if (newRuntimeActivated && fs.existsSync(runtimePath)) {
          fs.rmSync(runtimePath, { recursive: true, force: true });
        }
        if (oldRuntimeBackedUp) {
          if (!workspace || !fs.existsSync(workspace.backupPath)) {
            throw new Error(t("runtime.install.backupMissing"));
          }
          if (fs.existsSync(runtimePath)) {
            fs.rmSync(runtimePath, { recursive: true, force: true });
          }
          fs.renameSync(workspace.backupPath, runtimePath);
        }
        rollbackSucceeded = true;
      } catch (rollbackError) {
        recoveryMessage = t("runtime.install.restoreFailed", {
          message: errorMessage(rollbackError)
        });
      }

      if (error instanceof RuntimeInstallBusyError) {
        new Notice(t("runtime.install.busy"), 10000);
        return false;
      }
      if (error instanceof RuntimeDownloadError && error.code === "ABORTED") {
        return false;
      }

      const downloadFailure = ["checksum", "download", "validate-download"]
        .includes(progressStageCode);
      const retryHint = downloadFailure
        ? t("runtime.install.networkHint")
        : t("runtime.install.retryHint");
      const backupAvailable =
        !rollbackSucceeded &&
        oldRuntimeBackedUp &&
        workspace &&
        fs.existsSync(workspace.backupPath);
      const backupHint = backupAvailable
        ? t("runtime.install.backupRetained", { path: workspace.backupPath })
        : !rollbackSucceeded
          ? t("runtime.install.cleanupIncomplete")
          : "";
      if (!(error instanceof RuntimeDownloadError && error.code === "ABORTED")) {
        downloadModal?.fail(
          error,
          downloadFailure
            ? "runtimeDownload.failed"
            : "runtime.install.cannotInstall"
        );
      }
      new Notice(
        t("runtime.install.failed", {
          stage: progressStage,
          message: failureMessage,
          hint: `${retryHint}${backupHint}`,
          recovery: recoveryMessage
        }),
        20000
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
            message: errorMessage(cleanupError)
          }));
        }
      }
      const lockError = releaseRuntimeInstallLock(installLock);
      if (lockError) {
        console.warn(t("runtime.install.lockCleanupFailed", {
          message: errorMessage(lockError)
        }));
      }
    }
  }

  async runDoctor() {
    const t = this.t.bind(this);
    const root = this.getRuntimeRoot();
    const status = this.runtimeStatus();
    if (!root || !status.ready) {
      new Notice(t("runtime.doctor.notReady", { status: status.message }), 12000);
      return false;
    }
    const runtimePaths = this.runtimePaths(root);
    if (
      !runtimePaths ||
      !fs.existsSync(runtimePaths.doctor) ||
      !fs.existsSync(runtimePaths.python)
    ) {
      new Notice(t("runtime.doctor.missing"));
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
    const summary = result.output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-6)
      .join("；");
    new Notice(
      result.code === 0
        ? t("runtime.doctor.passed", { summary })
        : t("runtime.doctor.failed", { summary }),
      15000
    );
    return result.code === 0;
  }

  selectExportMode() {
    return new Promise((resolve) => {
      new ExportModeModal(this, resolve).open();
    });
  }

  async selectFormatSettings(templateFiles, outputName, options = {}) {
    const zoteroStyles=options.zoteroStyles || await discoverZoteroStyles();
    return new Promise((resolve) => {
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
        resolve
      ).open();
    });
  }

  selectWordFile(files) {
    return new Promise((resolve) => {
      new WordFileSelectModal(this, files, resolve).open();
    });
  }

  async recolorWordCitationsForCurrentFile(file) {
    const t = this.t.bind(this);
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new Notice(t("recolor.noLocalFs"));
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
        new Notice(
          t("recolor.runtimeUnavailable", { status: runtimeStatus.message }),
          12000
        );
        return;
      }
    }

    const runtimePaths = this.runtimePaths(this.getRuntimeRoot());
    if (
      !runtimePaths ||
      !fs.existsSync(runtimePaths.python) ||
      !fs.existsSync(runtimePaths.recolor)
    ) {
      new Notice(t("recolor.toolMissing"));
      return;
    }

    const markdownPath = path.join(adapter.getBasePath(), file.path);
    const directory = path.dirname(markdownPath);
    let wordFiles = [];
    try {
      wordFiles = fs
        .readdirSync(directory, { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isFile() &&
            !entry.name.startsWith("~$") &&
            entry.name.toLowerCase().endsWith(".docx")
        )
        .map((entry) => {
          const wordPath = path.join(directory, entry.name);
          const modified = fs.statSync(wordPath).mtime;
          return {
            path: wordPath,
            modified,
            label:
              `${entry.name} · ` +
              modified.toLocaleString(
                this.getLanguage() === "en" ? "en-US" : "zh-CN",
                { hour12: false }
              )
          };
        })
        .sort((a, b) => b.modified.getTime() - a.modified.getTime());
    } catch (error) {
      new Notice(
        t("recolor.readFolderFailed", { message: errorMessage(error) }),
        10000
      );
      return;
    }
    if (!wordFiles.length) {
      new Notice(t("recolor.noFiles"));
      return;
    }

    const selectedPath = await this.selectWordFile(wordFiles);
    if (!selectedPath) {
      new Notice(t("recolor.cancelled"));
      return;
    }
    if (!fs.existsSync(selectedPath)) {
      new Notice(t("recolor.fileMissing", { path: selectedPath }), 10000);
      return;
    }

    const requestedOutput = path.join(
      path.dirname(selectedPath),
      `${path.basename(selectedPath, path.extname(selectedPath))}-引文蓝色.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutput);
    const failureLogPath = path.join(
      path.dirname(selectedPath),
      `${path.basename(selectedPath, path.extname(selectedPath))}-引文着色失败.log.txt`
    );
    if (fs.existsSync(failureLogPath)) {
      try {
        fs.unlinkSync(failureLogPath);
      } catch {
        // A stale diagnostic can remain open without blocking the new run.
      }
    }

    const progressModal = new ExportProgressModal(
      this,
      path.basename(selectedPath),
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
    const child = spawn(runtimePaths.python, recolorArgs, {
      cwd: path.dirname(runtimePaths.recolor),
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
      if (output.length > 12000) {
        output = output.slice(-12000);
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
        message: errorMessage(error)
      });
      output += `\n${launchError}\n`;
      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
        // The launch error is still visible in the modal and Notice.
      }
      progressModal.fail(launchError, failureLogPath);
      new Notice(launchError, 10000);
    });
    child.once("close", (code) => {
      flushLineBuffers();
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch
          ? path.basename(wordMatch[1].trim())
          : path.basename(outputPath);
        if (fs.existsSync(failureLogPath)) {
          try {
            fs.unlinkSync(failureLogPath);
          } catch {
            // Do not turn successful recoloring into a failure.
          }
        }
        progressModal.complete(wordName);
        new Notice(t("recolor.completed", { file: wordName }), 10000);
        return;
      }

      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
        // Python already attempted to write its own failure report.
      }
      const details = humanizeProcessOutput(output, this.getLanguage())
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(-4)
        .join(this.getLanguage() === "en" ? "; " : "；");
      const failure = details
        ? t("recolor.failedWithDetails", { code, details })
        : t("recolor.failedWithCode", { code });
      progressModal.fail(
        failure,
        failureLogPath
      );
      new Notice(failure, 12000);
    });

    new Notice(t("recolor.running", { file: path.basename(outputPath) }), 8000);
  }

  async exportCurrentFile(file, options = {}) {
    const t = this.t.bind(this);
    const exportMode = await this.selectExportMode();
    if (!exportMode) {
      new Notice(t("export.cancelled"));
      return;
    }

    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new Notice(t("export.noLocalFs"));
      return;
    }

    const vaultPath = adapter.getBasePath();
    const markdownPath = path.join(vaultPath, file.path);
    let markdownSource = "";
    try {
      markdownSource = await this.app.vault.cachedRead(file);
    } catch (error) {
      new Notice(
        t("export.readMarkdownFailed", { message: errorMessage(error) })
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
        new Notice(
          t("export.runtimeUnavailable", { status: runtimeStatus.message }),
          12000
        );
        return;
      }
    }

    const pandocRoot = this.getRuntimeRoot();
    const runtimePaths = this.runtimePaths(pandocRoot);
    const templateDir = this.ensureTemplateLibrary();
    if (!templateDir) {
      new Notice(t("export.templateDirectoryFailed"));
      return;
    }

    if (
      !runtimePaths ||
      !fs.existsSync(runtimePaths.python) ||
      !fs.existsSync(runtimePaths.exporter)
    ) {
      new Notice(t("export.pythonMissing"));
      return;
    }

    let templateFiles = [];
    try {
      templateFiles = fs
        .readdirSync(templateDir)
        .filter(
          (name) =>
            !name.startsWith("~$") && name.toLowerCase().endsWith(".docx")
        )
        .sort((a, b) => a.localeCompare(b, "zh-CN"));
    } catch (error) {
      new Notice(
        t("export.readTemplatesFailed", { message: errorMessage(error) })
      );
      return;
    }
    if (!templateFiles.length) {
      new Notice(t("export.noTemplates", { path: templateDir }));
      return;
    }

    const citationViewPlugin=this.app.plugins.plugins["paper-caption-preview"];
    const citationSource=fs.readFileSync(markdownPath,"utf8");
    const citationReport=citationViewPlugin?.citationLanguageReport ? await citationViewPlugin.citationLanguageReport(file,citationSource) :
      {style:this.app.metadataCache.getFileCache(file)?.frontmatter?.csl || this.app.plugins.plugins["obsidian-pandoc-reference-list"]?.settings?.cslStylePath || ""};
    const formatSelection = await this.selectFormatSettings(
      templateFiles,
      defaultOutputName,
      {
        figureReflowDefault: options.figureReflowDefault === true,
        citationReport,
        documentLanguage: (() => {
          const source=fs.readFileSync(markdownPath,"utf8");
          const viewPlugin=this.app.plugins.plugins["paper-caption-preview"];
          if(viewPlugin?.languageFor)return viewPlugin.languageFor(file,source)==="en"?"en-US":"zh-CN";
          const fm=this.app.metadataCache.getFileCache(file)?.frontmatter || {};
          if(fm.lang)return fm.lang;
          if(fm.cssclasses?.includes("en-doc"))return "en-US";
          const body=source.replace(/^---\r?\n[\s\S]*?\r?\n---/,"").replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g,"")
            .replace(/!\[[^\r\n]*|\[@[^\]]*\]|https?:\/\/\S+|<[^>]*>/g,"").slice(0,30000);
          const han=(body.match(/[\p{Script=Han}]/gu)||[]).length,latin=(body.match(/[A-Za-z]/g)||[]).length;
          return latin>=40 && han/(han+latin)<0.15?"en-US":"zh-CN";
        })()
      }
    );
    if (!formatSelection) {
      new Notice(t("export.cancelled"));
      return;
    }

    const templatePath = path.join(
      templateDir,
      formatSelection.templateFile
    );
    if (!fs.existsSync(templatePath)) {
      new Notice(t("export.templateMissing", { path: templatePath }));
      return;
    }

    if (formatSelection.savePreset) {
      this.exportSettings.presets[formatSelection.presetName] = {
        name: formatSelection.presetName,
        config: formatSelection.config,
        templateFile: formatSelection.templateFile
      };
      await this.saveData(this.exportSettings);
      new Notice(
        t("export.presetSaved", { name: formatSelection.presetName })
      );
    }

    const requestedOutputPath = path.join(
      path.dirname(markdownPath),
      `${formatSelection.outputName}.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutputPath);
    if (outputPath !== requestedOutputPath) {
      new Notice(
        t("export.outputRenamed", { file: path.basename(outputPath) }),
        10000
      );
    }

    let output = "";
    let failedToStart = false;
    const failureLogPath = path.join(
      path.dirname(markdownPath),
      `${file.basename}-导出失败.log.txt`
    );
    if (fs.existsSync(failureLogPath)) {
      try {
        fs.unlinkSync(failureLogPath);
      } catch {
        // A stale diagnostic may be open in another program; export can continue.
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
    const child = spawn(
      runtimePaths.python,
      exporterArgs,
      {
        cwd: path.dirname(runtimePaths.exporter),
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
      if (output.length > 12000) {
        output = output.slice(-12000);
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
    child.stdin.on("error", () => {});
    child.once("error", (error) => {
      failedToStart = true;
      const launchError = t("export.launchFailed", {
        message: errorMessage(error)
      });
      output += `\n${launchError}\n`;
      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
        // The launch error is still visible in the modal and Notice.
      }
      progressModal.fail(launchError, failureLogPath);
      new Notice(launchError);
    });
    child.once("close", (code) => {
      flushLineBuffers();
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch
          ? path.basename(wordMatch[1].trim())
          : path.basename(outputPath);
        if (fs.existsSync(failureLogPath)) {
          try {
            fs.unlinkSync(failureLogPath);
          } catch {
            // Do not turn a successful export into a failure over stale log cleanup.
          }
        }
        progressModal.complete(wordName);
        new Notice(t("export.completed", { file: wordName }), 8000);
        return;
      }

      try {
        appendFailureProcessOutput(
          failureLogPath,
          output,
          this.getLanguage()
        );
      } catch {
        // Python already attempted to write its own failure report.
      }
      const details = humanizeProcessOutput(output, this.getLanguage())
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(-4)
        .join(this.getLanguage() === "en" ? "; " : "；");
      const failure = details
        ? t("export.failedWithDetails", { code, details })
        : t("export.failedWithCode", { code });
      progressModal.fail(
        failure,
        failureLogPath
      );
      new Notice(failure, 12000);
    });
    child.stdin.end();

    new Notice(
      t("export.running", {
        mode: modeLabel,
        format: formatSelection.displayName,
        file: path.basename(outputPath)
      })
    );
  }
};
