// @ts-nocheck
import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  requestUrl
} from "obsidian";
import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

declare const __GITHUB_REPOSITORY__: string;

const PLUGIN_VERSION = "1.4.5";
const RUNTIME_MANIFEST = "runtime-manifest.json";
const PROGRESS_PREFIX = "@@MD_EXPORT_PROGRESS@@";
const RUNTIME_TARGETS = Object.freeze({
  "windows-x64": {
    id: "windows-x64",
    label: "Windows x64",
    nodePlatform: "win32",
    nodeArch: "x64",
    asset: "md-export-word-runtime-windows-x64.zip",
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
    pandocFile: "pandoc",
    crossrefFile: "pandoc-crossref",
    pythonParts: [".venv", "bin", "python"]
  }
});

const DEFAULT_TEMPLATE_FILE = "导出格式模板.docx";
const DEFAULT_FORMAT = Object.freeze({
  preset_name: "当前期刊模板",
  east_asia_font: "宋体",
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

const SIZE_OPTIONS = {
  "7.5": "六号（7.5 pt）",
  "9": "小五（9 pt）",
  "10.5": "五号（10.5 pt）",
  "12": "小四（12 pt）",
  "14": "四号（14 pt）",
  "15": "小三（15 pt）",
  "16": "三号（16 pt）",
  "18": "小二（18 pt）",
  "22": "二号（22 pt）"
};

const LINE_OPTIONS = {
  "1": "单倍行距",
  "1.25": "1.25 倍行距",
  "1.5": "1.5 倍行距",
  "1.75": "1.75 倍行距",
  "2": "2 倍行距"
};

const INDENT_OPTIONS = {
  "0": "不缩进",
  "1": "首行缩进 1 字",
  "2": "首行缩进 2 字"
};

const MARGIN_OPTIONS = {
  "2": "四边 2.00 cm",
  "2.2": "四边 2.20 cm",
  "2.54": "四边 2.54 cm",
  "3": "四边 3.00 cm"
};

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

function formatSummary(config) {
  return (
    `中文 ${config.east_asia_font}；英文/数字 ${config.western_font}；` +
    `正文 ${config.body_size_pt} pt、${config.body_line_spacing} 倍行距、` +
    `首行 ${config.body_first_line_chars} 字；` +
    `表格 ${config.table_size_pt} pt、${config.table_line_spacing} 倍行距；` +
    `图表题 ${config.caption_size_pt} pt；图表注 ${config.note_size_pt} pt；` +
    `A4 四边 ${config.margin_cm} cm；` +
    `图片分页回填 ${config.figure_reflow ? "开启" : "关闭"}`
  );
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

function normalizeOutputBaseName(value) {
  const outputName = String(value || "")
    .trim()
    .replace(/\.docx$/i, "")
    .trim();
  if (!outputName) {
    return { error: "Word 文件名不能为空。" };
  }
  if ([...outputName].some(isInvalidWindowsFileNameCharacter)) {
    return {
      error: 'Word 文件名不能包含 < > : " / \\ | ? * 等字符。'
    };
  }
  if (/[. ]$/.test(outputName)) {
    return { error: "Word 文件名不能以句点或空格结尾。" };
  }
  if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(outputName)) {
    return { error: `“${outputName}”是 Windows 保留文件名，请更换。` };
  }
  return { value: outputName };
}

function safeDefaultOutputBaseName(value, fallback) {
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
  const result = normalizeOutputBaseName(clean);
  if (result.value) {
    return result.value;
  }
  const fallbackResult = normalizeOutputBaseName(fallback);
  return fallbackResult.value || "导出文档";
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
    contentEl.createEl("h2", { text: "选择 Markdown → Word 导出模式" });
    contentEl.createEl("p", {
      text: "源 Markdown 不会被修改。请选择本次对 Zotero 缺失引用的处理方式。"
    });

    new Setting(contentEl)
      .setName("严格模式")
      .setDesc("用于自己的论文：Zotero 缺少任一 citekey 就停止导出。")
      .addButton((button) =>
        button
          .setButtonText("使用严格模式")
          .setCta()
          .onClick(() => this.choose("strict"))
      );

    new Setting(contentEl)
      .setName("兼容模式")
      .setDesc(
        "用于外来 Markdown：缺失 citekey 保留为红字黄底占位符，并写入日志。"
      )
      .addButton((button) =>
        button
          .setButtonText("使用兼容模式")
          .onClick(() => this.choose("compatible"))
      );

    new Setting(contentEl).addButton((button) =>
      button.setButtonText("取消").onClick(() => this.close())
    );
  }

  onClose() {
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
}

class WordFileSelectModal extends Modal {
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
    contentEl.createEl("h2", { text: "恢复 Word 中的蓝色 Zotero 引文" });
    contentEl.createEl("p", {
      text:
        "请先在 Word 中完成 Zotero Refresh 并保存文档，最好关闭该文档。" +
        "程序会生成新副本，不覆盖源 Word；正文引文设为蓝色，文末参考文献保持黑色。"
    });

    new Setting(contentEl)
      .setName("选择 Word 文件")
      .setDesc("列出当前 Markdown 所在文件夹中的 .docx，最近修改的排在最前。")
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
          .setButtonText("生成蓝色引文副本")
          .setCta()
          .onClick(() => this.finish(this.selectedPath))
      )
      .addButton((button) =>
        button.setButtonText("取消").onClick(() => this.finish(null))
      );
  }

  onClose() {
    this.contentEl.empty();
    if (!this.resolved) {
      this.resolved = true;
      this.resolve(null);
    }
  }
}

class FormatSettingsModal extends Modal {
  constructor(app, options, resolve) {
    super(app);
    this.resolve = resolve;
    this.resolved = false;
    this.presets = options.presets || {};
    this.templateFiles = options.templateFiles.length
      ? options.templateFiles
      : [DEFAULT_TEMPLATE_FILE];
    this.figureReflowDefault = options.figureReflowDefault === true;
    this.selectedPreset = "__default__";
    this.config = this.defaultCommandFormat();
    this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE)
      ? DEFAULT_TEMPLATE_FILE
      : this.templateFiles[0];
    this.presetName = "";
    this.outputName = options.outputName || "导出文档";
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
    const normalizedOutput = normalizeOutputBaseName(this.outputName);
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
    if (savePreset && !requestedName) {
      new Notice("请先填写格式方案名称，例如“毕业论文”或期刊名称。");
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
        ? DEFAULT_FORMAT.preset_name
        : this.selectedPreset !== "__default__"
          ? config.preset_name
          : differsFromDefault
            ? "本次自定义"
            : DEFAULT_FORMAT.preset_name;
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
    new Setting(container)
      .setName(name)
      .setDesc(desc)
      .addDropdown((dropdown) => {
        for (const [value, label] of Object.entries(options)) {
          dropdown.addOption(value, label);
        }
        if (!Object.prototype.hasOwnProperty.call(options, current)) {
          dropdown.addOption(current, `${current}（已保存值）`);
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
    contentEl.createEl("h2", { text: "设置 Word 导出格式" });
    contentEl.createEl("p", {
      text:
        "不修改任何选项时使用当前期刊模板（" +
        formatSummary(this.defaultCommandFormat()) +
        "）。"
    });

    const reflowEnabled = this.config.figure_reflow === true;
    new Setting(contentEl)
      .setName("图片分页方式")
      .setDesc(
        "默认保持 Markdown 中的图片位置和图文顺序；只有选择自动回填时，" +
          "才会把图片后同一小节的连续正文提前，以减少大图换页前的空白。"
      )
      .addButton((button) => {
        button
          .setButtonText("保持图片原位（默认）")
          .onClick(() => {
            this.config.figure_reflow = false;
            this.render();
          });
        if (!reflowEnabled) {
          button.setCta();
        }
      })
      .addButton((button) => {
        button.setButtonText("自动回填分页空白").onClick(() => {
          this.config.figure_reflow = true;
          this.render();
        });
        if (reflowEnabled) {
          button.setCta();
        }
      });

    new Setting(contentEl)
      .setName("Word 文件名")
      .setDesc(
        "默认读取 Markdown 的文章一级标题；可直接修改，无需输入 .docx；" +
          "同名文件自动添加时间戳。"
      )
      .addText((text) => {
        text.inputEl.style.width = "min(420px, 52vw)";
        text
          .setPlaceholder("请输入 Word 文件名")
          .setValue(this.outputName)
          .onChange((value) => {
            this.outputName = value;
          });
      });

    new Setting(contentEl)
      .setName("格式方案")
      .setDesc("可调用之前保存的毕业论文或其他期刊方案。")
      .addDropdown((dropdown) => {
        dropdown.addOption("__default__", "当前期刊模板（默认）");
        for (const [key, preset] of Object.entries(this.presets)) {
          dropdown.addOption(key, preset.name || key);
        }
        dropdown.setValue(this.selectedPreset).onChange((value) => {
          this.usePreset(value);
        });
      });

    new Setting(contentEl)
      .setName("参考 Word 模板")
      .setDesc(`默认：${DEFAULT_TEMPLATE_FILE}`)
      .addDropdown((dropdown) => {
        for (const file of this.templateFiles) {
          dropdown.addOption(file, file);
        }
        dropdown.setValue(this.templateFile).onChange((value) => {
          this.templateFile = value;
        });
      });

    contentEl.createEl("h3", { text: "正文与字体" });

    new Setting(contentEl)
      .setName("中文字体")
      .setDesc("默认：宋体")
      .addText((text) =>
        text.setValue(this.config.east_asia_font).onChange((value) => {
          this.config.east_asia_font =
            value.trim() || DEFAULT_FORMAT.east_asia_font;
        })
      );

    new Setting(contentEl)
      .setName("英文和数字字体")
      .setDesc("默认：Times New Roman")
      .addText((text) =>
        text.setValue(this.config.western_font).onChange((value) => {
          this.config.western_font =
            value.trim() || DEFAULT_FORMAT.western_font;
        })
      );

    this.addDropdown(
      contentEl,
      "正文字号",
      "默认：小四（12 pt）",
      "body_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "正文行距",
      "默认：1.5 倍行距",
      "body_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "正文首行缩进",
      "默认：首行缩进 2 字",
      "body_first_line_chars",
      INDENT_OPTIONS
    );

    contentEl.createEl("h3", { text: "题目与标题" });
    this.addDropdown(
      contentEl,
      "文章题目字号（Markdown #）",
      "默认：三号（16 pt）",
      "title_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "文章题目行距",
      "默认：1.5 倍行距",
      "title_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "一级节标题字号（Markdown ##）",
      "默认：四号（14 pt）",
      "heading2_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "二级节标题字号（Markdown ###）",
      "默认：小四（12 pt）",
      "heading3_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "节标题行距",
      "默认：1.5 倍行距",
      "heading_line_spacing",
      LINE_OPTIONS
    );

    contentEl.createEl("h3", { text: "表格、图表题与注释" });
    this.addDropdown(
      contentEl,
      "表格字号（含表内公式）",
      "默认：六号（7.5 pt）",
      "table_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "表格行距",
      "默认：单倍行距",
      "table_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "图名、表名字号",
      "默认：五号（10.5 pt）",
      "caption_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "图名、表名行距",
      "默认：单倍行距",
      "caption_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "图注、表注字号",
      "默认：六号（7.5 pt）",
      "note_size_pt",
      SIZE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "图注、表注行距",
      "默认：1.5 倍行距",
      "note_line_spacing",
      LINE_OPTIONS
    );
    this.addDropdown(
      contentEl,
      "正文公式字号",
      "默认：小四（12 pt）",
      "formula_size_pt",
      SIZE_OPTIONS
    );

    contentEl.createEl("h3", { text: "页面" });
    this.addDropdown(
      contentEl,
      "A4 页边距",
      "默认：四边 2.54 cm",
      "margin_cm",
      MARGIN_OPTIONS
    );
    new Setting(contentEl)
      .setName("方案名称（可选）")
      .setDesc("填写后可保存为“毕业论文”“某期刊”等方案。")
      .addText((text) =>
        text
          .setPlaceholder("例如：毕业论文")
          .setValue(this.presetName)
          .onChange((value) => {
            this.presetName = value;
          })
      );

    new Setting(contentEl)
      .addButton((button) =>
        button
          .setButtonText("使用默认模板")
          .onClick(() => this.finish({ useDefault: true }))
      )
      .addButton((button) =>
        button
          .setButtonText("保存方案并导出")
          .onClick(() => this.finish({ savePreset: true }))
      )
      .addButton((button) =>
        button
          .setButtonText("按当前设置导出")
          .setCta()
          .onClick(() => this.finish())
      )
      .addButton((button) =>
        button.setButtonText("取消").onClick(() => this.close())
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
}

class ExportProgressModal extends Modal {
  constructor(app, fileName, options = {}) {
    super(app);
    this.fileName = fileName;
    this.modalTitle = options.title || "正在导出 Word";
    this.successStage = options.successStage || "导出完成";
    this.failureStage = options.failureStage || "导出失败";
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
      text: "准备启动导出程序…"
    });
    this.progressEl = this.contentEl.createEl("progress", {
      cls: "md-export-word-progress",
      attr: { max: "100", value: "0" }
    });
    this.detailEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-detail",
      text: "0%"
    });
    this.contentEl.createEl("h4", { text: "实时过程" });
    this.logEl = this.contentEl.createEl("pre", {
      cls: "md-export-word-progress-log",
      attr: {
        tabindex: "0",
        "aria-label": "Word 导出实时过程，可选择并复制"
      }
    });
    this.actionsEl = this.contentEl.createDiv({
      cls: "md-export-word-progress-actions"
    });
    const actions = new Setting(this.actionsEl);
    actions.addButton((button) =>
      button
        .setButtonText("复制当前过程")
        .onClick(() => this.copyLogText())
    );
    actions.addButton((button) =>
      button.setButtonText("隐藏窗口").onClick(() => this.close())
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
      this.statusEl.setText(stage || "正在处理…");
      this.statusEl.toggleClass("is-error", level === "error");
      this.statusEl.toggleClass("is-success", level === "success");
    }
    if (this.detailEl) {
      this.detailEl.setText(
        detail ? `${safePercent}% · ${detail}` : `${safePercent}%`
      );
    }
    this.appendLog(
      `[${String(safePercent).padStart(3, " ")}%] ${stage}` +
        (detail ? ` — ${detail}` : ""),
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
        this.appendLog(`无法解析进度事件：${error.message}`, true);
      }
    }
    this.appendLog(normalized, isError);
  }

  async copyText(text, successMessage) {
    const value = String(text || "").trim();
    if (!value) {
      new Notice("当前没有可复制的日志内容。");
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
          throw new Error("系统拒绝复制操作");
        }
      }
      new Notice(successMessage);
      return true;
    } catch (error) {
      new Notice(`复制失败：${error.message}`, 10000);
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
      logPath ? "错误日志已复制到剪贴板。" : "当前导出过程已复制。"
    );
  }

  openLogFile(logPath) {
    if (!logPath || !fs.existsSync(logPath)) {
      new Notice("未找到错误日志文件。", 10000);
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
        new Notice(`无法打开错误日志：${error.message}`, 10000);
      });
      child.unref();
    } catch (error) {
      new Notice(`无法打开错误日志：${error.message}`, 10000);
    }
  }

  complete(wordName) {
    this.updateProgress(100, this.successStage, wordName, "success");
    if (!this.actionsEl) {
      return;
    }
    this.actionsEl.empty();
    const actions = new Setting(this.actionsEl);
    actions.addButton((button) =>
      button.setButtonText("复制过程").onClick(() => this.copyLogText())
    );
    actions.addButton((button) =>
      button
        .setButtonText("完成并关闭")
        .setCta()
        .onClick(() => this.close())
    );
  }

  fail(summary, logPath) {
    this.updateProgress(
      100,
      this.failureStage,
      logPath ? `错误日志：${logPath}` : summary,
      "error"
    );
    if (summary) {
      this.appendLog(summary, true);
    }
    if (!this.actionsEl) {
      return;
    }
    this.actionsEl.empty();
    const actions = new Setting(this.actionsEl);
    actions.addButton((button) =>
      button
        .setButtonText("复制错误日志")
        .setCta()
        .onClick(() => this.copyLogText(logPath))
    );
    if (logPath) {
      actions.addButton((button) =>
        button
          .setButtonText("打开日志文件")
          .onClick(() => this.openLogFile(logPath))
      );
    }
    actions.addButton((button) =>
      button
        .setButtonText("关闭")
        .setWarning()
        .onClick(() => this.close())
    );
  }

  onClose() {
    this.closedByUser = true;
  }
}

class TextInputModal extends Modal {
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
    new Setting(this.contentEl)
      .setName("GitHub 仓库")
      .setDesc("格式：owner/repository")
      .addText((text) =>
        text
          .setPlaceholder("owner/obsidian-md-export-word")
          .setValue(this.value)
          .onChange((value) => {
            this.value = value.trim();
          })
      );
    new Setting(this.contentEl)
      .addButton((button) =>
        button
          .setButtonText("继续")
          .setCta()
          .onClick(() => this.finish(this.value))
      )
      .addButton((button) =>
        button.setButtonText("取消").onClick(() => this.finish(null))
      );
  }

  onClose() {
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

function humanizeProcessOutput(output) {
  return String(output || "")
    .split(/\r?\n/)
    .map((line) => {
      const normalized = line.trim();
      if (!normalized.startsWith(PROGRESS_PREFIX)) {
        return line;
      }
      try {
        const event = JSON.parse(normalized.slice(PROGRESS_PREFIX.length));
        return (
          `[${event.percent}%] ${event.stage}` +
          (event.detail ? ` — ${event.detail}` : "")
        );
      } catch {
        return line;
      }
    })
    .join("\n")
    .trim();
}

function appendFailureProcessOutput(logPath, output) {
  const humanOutput = humanizeProcessOutput(output);
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
    containerEl.empty();
    containerEl.createEl("h2", { text: "MD Export Word" });

    new Setting(containerEl)
      .setName("运行时发布仓库")
      .setDesc(
        "通常由正式 Release 自动写入；仅在自建分支或私有仓库中需要修改。"
      )
      .addText((text) =>
        text
          .setPlaceholder("owner/obsidian-md-export-word")
          .setValue(this.plugin.getReleaseRepository())
          .onChange(async (value) => {
            this.plugin.exportSettings.repository = value.trim();
            await this.plugin.saveData(this.plugin.exportSettings);
          })
      );

    new Setting(containerEl)
      .setName("导出成功后自动打开 Word")
      .setDesc("默认开启；只有导出和自动自检均成功时才会打开生成的 .docx。")
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
      .setName("运行时平台")
      .setDesc(
        "默认自动识别；仅在 Apple Silicon Mac 需要用 Rosetta 运行 Intel " +
          "二进制时手动调整。"
      )
      .addDropdown((dropdown) => {
        dropdown.addOption(
          "auto",
          `自动检测（${
            detectedTarget
              ? RUNTIME_TARGETS[detectedTarget].label
              : `${process.platform}/${process.arch}`
          }）`
        );
        for (const target of Object.values(RUNTIME_TARGETS)) {
          dropdown.addOption(target.id, target.label);
        }
        dropdown
          .setValue(this.plugin.exportSettings.runtimePlatform || "auto")
          .onChange(async (value) => {
            this.plugin.exportSettings.runtimePlatform = value;
            await this.plugin.saveData(this.plugin.exportSettings);
            this.display();
          });
      });

    new Setting(containerEl)
      .setName("Word 导出运行时")
      .setDesc(this.plugin.runtimeStatusText())
      .addButton((button) =>
        button
          .setButtonText("安装或修复")
          .setCta()
          .onClick(async () => {
            await this.plugin.installRuntime();
            this.display();
          })
      )
      .addButton((button) =>
        button.setButtonText("环境自检").onClick(async () => {
          await this.plugin.runDoctor();
          this.display();
        })
      );
  }
}

export default class MdExportWordPlugin extends Plugin {
  async onload() {
    this.exportSettings = (await this.loadData()) || {};
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
      name: "Export current Markdown to Word (auto-fill figure page gaps)",
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
      name: "Reapply blue Zotero citations to exported Word",
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
    if (!target) {
      return `尚不支持 ${process.platform}/${process.arch}。`;
    }
    if (target.nodePlatform !== process.platform) {
      return (
        `所选 ${target.label} 与当前系统 ${process.platform}/${process.arch} ` +
        "不一致。"
      );
    }
    if (
      target.nodeArch !== process.arch &&
      !(
        process.platform === "darwin" &&
        process.arch === "arm64" &&
        target.nodeArch === "x64"
      )
    ) {
      return (
        `所选 ${target.label} 与当前 CPU 架构 ${process.arch} 不兼容。`
      );
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

  runtimeStatus() {
    const root = this.getRuntimeRoot();
    if (!root) {
      return { ready: false, message: "当前知识库不是本地文件系统。" };
    }
    const target = this.getRuntimeTarget();
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
        message:
          `${target.label} 运行时未安装或不完整` +
          `（缺少 ${missing.length} 个文件）。`
      };
    }
    try {
      const manifest = JSON.parse(
        fs.readFileSync(runtimePaths.manifest, "utf8")
      );
      if (manifest.version !== this.manifest.version) {
        return {
          ready: false,
          message:
            `运行时版本 ${manifest.version || "unknown"} 与插件版本 ` +
            `${this.manifest.version} 不一致。`
        };
      }
      if (manifest.platform !== target.id) {
        return {
          ready: false,
          message:
            `已安装运行时为 ${manifest.platform || "unknown"}，当前需要 ` +
            `${target.id}。`
        };
      }
      return {
        ready: true,
        message:
          `已安装 ${target.label} 运行时 ` +
          `${manifest.version || "unknown"}。`
      };
    } catch (error) {
      return { ready: false, message: `运行时清单损坏：${error.message}` };
    }
  }

  runtimeStatusText() {
    return this.runtimeStatus().message;
  }

  async askRepository(initialValue = "") {
    return await new Promise((resolve) => {
      new TextInputModal(
        this.app,
        "设置运行时仓库",
        "插件需要从同版本 GitHub Release 下载当前系统运行时。粘贴你在 BRAT 中添加的仓库地址。",
        initialValue,
        resolve
      ).open();
    });
  }

  async installRuntime() {
    const target = this.getRuntimeTarget();
    const compatibilityError = this.runtimeCompatibilityError(target);
    if (compatibilityError) {
      new Notice(`无法安装运行时：${compatibilityError}`, 12000);
      return false;
    }
    const pluginRoot = this.getPluginRoot();
    if (!pluginRoot) {
      new Notice("当前知识库不是本地文件系统，无法安装运行时。");
      return false;
    }

    let repository = this.getReleaseRepository();
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
      repository = await this.askRepository(repository);
      if (!repository) {
        new Notice("已取消运行时安装。");
        return false;
      }
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
        new Notice("GitHub 仓库格式不正确，应为 owner/repository。", 10000);
        return false;
      }
      this.exportSettings.repository = repository;
      await this.saveData(this.exportSettings);
    }

    const version = this.manifest.version || PLUGIN_VERSION;
    const url =
      `https://github.com/${repository}/releases/download/` +
      `${version}/${target.asset}`;
    const zipPath = path.join(
      pluginRoot,
      `.runtime-download-${target.id}.zip`
    );
    const stagePath = path.join(pluginRoot, ".runtime-stage");
    const runtimePath = path.join(pluginRoot, "runtime");
    const backupPath = path.join(pluginRoot, ".runtime-backup");
    let newRuntimeInstalled = false;

    try {
      new Notice(
        `正在下载 ${target.label} Word 导出运行时 ${version}…`,
        8000
      );
      const response = await requestUrl({ url, method: "GET" });
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP ${response.status}`);
      }
      fs.writeFileSync(zipPath, Buffer.from(response.arrayBuffer));

      fs.rmSync(stagePath, { recursive: true, force: true });
      fs.rmSync(backupPath, { recursive: true, force: true });
      fs.mkdirSync(stagePath, { recursive: true });

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
                zipPath,
                stagePath
              ],
              { cwd: pluginRoot }
            )
          : await runProcess(
              "/usr/bin/ditto",
              ["-x", "-k", zipPath, stagePath],
              { cwd: pluginRoot }
            );
      if (extractResult.code !== 0) {
        throw new Error(
          extractResult.output.trim() ||
            `解压运行时失败：${extractResult.code}`
        );
      }

      const payloadPath = path.join(stagePath, "runtime");
      const payloadManifestPath = path.join(
        payloadPath,
        RUNTIME_MANIFEST
      );
      if (!fs.existsSync(payloadManifestPath)) {
        throw new Error("运行时包缺少 runtime/runtime-manifest.json");
      }
      const payloadManifest = JSON.parse(
        fs.readFileSync(payloadManifestPath, "utf8")
      );
      if (
        payloadManifest.version !== version ||
        payloadManifest.platform !== target.id
      ) {
        throw new Error(
          `运行时包不匹配：版本 ${payloadManifest.version || "unknown"}，` +
            `平台 ${payloadManifest.platform || "unknown"}`
        );
      }

      if (fs.existsSync(runtimePath)) {
        fs.renameSync(runtimePath, backupPath);
      }
      fs.renameSync(payloadPath, runtimePath);
      newRuntimeInstalled = true;

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
            `Python 环境安装失败：${setupResult.code}`
        );
      }

      const status = this.runtimeStatus();
      if (!status.ready) {
        throw new Error(status.message);
      }
      this.ensureTemplateLibrary();
      fs.rmSync(backupPath, { recursive: true, force: true });
      fs.rmSync(stagePath, { recursive: true, force: true });
      fs.rmSync(zipPath, { force: true });
      new Notice(`Word 导出运行时安装完成：${status.message}`, 10000);
      return true;
    } catch (error) {
      if (newRuntimeInstalled) {
        fs.rmSync(runtimePath, { recursive: true, force: true });
      }
      if (fs.existsSync(backupPath)) {
        fs.renameSync(backupPath, runtimePath);
      }
      fs.rmSync(stagePath, { recursive: true, force: true });
      fs.rmSync(zipPath, { force: true });
      new Notice(
        `运行时安装失败：${error.message}。请查看 docs/故障排查.md。`,
        15000
      );
      return false;
    }
  }

  async runDoctor() {
    const root = this.getRuntimeRoot();
    const status = this.runtimeStatus();
    if (!root || !status.ready) {
      new Notice(`环境自检未通过：${status.message}`, 12000);
      return false;
    }
    const runtimePaths = this.runtimePaths(root);
    if (
      !runtimePaths ||
      !fs.existsSync(runtimePaths.doctor) ||
      !fs.existsSync(runtimePaths.python)
    ) {
      new Notice("跨平台环境自检程序不存在，请先安装或修复运行时。");
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
        ? `环境自检通过：${summary}`
        : `环境自检失败：${summary}`,
      15000
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
      new Notice("当前知识库不是本地文件系统，无法处理 Word。");
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
        new Notice(`运行时仍不可用：${runtimeStatus.message}`, 12000);
        return;
      }
    }

    const runtimePaths = this.runtimePaths(this.getRuntimeRoot());
    if (
      !runtimePaths ||
      !fs.existsSync(runtimePaths.python) ||
      !fs.existsSync(runtimePaths.recolor)
    ) {
      new Notice("未找到 Zotero 引文着色程序，请安装或修复运行时。");
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
              modified.toLocaleString("zh-CN", { hour12: false })
          };
        })
        .sort((a, b) => b.modified.getTime() - a.modified.getTime());
    } catch (error) {
      new Notice(`无法读取当前文件夹中的 Word：${error.message}`, 10000);
      return;
    }
    if (!wordFiles.length) {
      new Notice("当前 Markdown 所在文件夹中没有可处理的 .docx 文件。");
      return;
    }

    const selectedPath = await this.selectWordFile(wordFiles);
    if (!selectedPath) {
      new Notice("已取消 Zotero 引文着色。");
      return;
    }
    if (!fs.existsSync(selectedPath)) {
      new Notice(`所选 Word 已不存在：${selectedPath}`, 10000);
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
      this.app,
      path.basename(selectedPath),
      {
        title: "正在恢复 Zotero 引文颜色",
        successStage: "引文着色完成",
        failureStage: "引文着色失败"
      }
    );
    progressModal.open();
    progressModal.updateProgress(
      1,
      "启动引文着色程序",
      "源 Word 不覆盖；Zotero 域保持可刷新"
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
      const launchError = `启动引文着色失败：${error.message}`;
      output += `\n${launchError}\n`;
      try {
        appendFailureProcessOutput(failureLogPath, output);
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
        new Notice(`Zotero 引文已恢复为蓝色：${wordName}`, 10000);
        return;
      }

      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
        // Python already attempted to write its own failure report.
      }
      const details = humanizeProcessOutput(output)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(-4)
        .join("；");
      progressModal.fail(
        details || `引文着色失败，退出代码 ${code}。`,
        failureLogPath
      );
      new Notice(
        details
          ? `引文着色失败（${code}）：${details}`
          : `引文着色失败，退出代码 ${code}。`,
        12000
      );
    });

    new Notice(
      `正在生成蓝色引文副本：${path.basename(outputPath)}`,
      8000
    );
  }

  async exportCurrentFile(file, options = {}) {
    const exportMode = await this.selectExportMode();
    if (!exportMode) {
      new Notice("已取消 Word 导出。");
      return;
    }

    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new Notice("当前知识库不是本地文件系统，无法启动本地导出程序。");
      return;
    }

    const vaultPath = adapter.getBasePath();
    const markdownPath = path.join(vaultPath, file.path);
    let markdownSource = "";
    try {
      markdownSource = await this.app.vault.cachedRead(file);
    } catch (error) {
      new Notice(`无法读取当前 Markdown：${error.message}`);
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
        new Notice(`运行时仍不可用：${runtimeStatus.message}`, 12000);
        return;
      }
    }

    const pandocRoot = this.getRuntimeRoot();
    const runtimePaths = this.runtimePaths(pandocRoot);
    const templateDir = this.ensureTemplateLibrary();
    if (!templateDir) {
      new Notice("无法创建用户模板目录。");
      return;
    }

    if (
      !runtimePaths ||
      !fs.existsSync(runtimePaths.python) ||
      !fs.existsSync(runtimePaths.exporter)
    ) {
      new Notice("未找到当前系统的 Python 导出程序，请安装或修复运行时。");
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
      new Notice(`无法读取 Word 模板目录：${error.message}`);
      return;
    }
    if (!templateFiles.length) {
      new Notice(`Word 模板目录中没有 .docx 文件：${templateDir}`);
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
      new Notice("已取消 Word 导出。");
      return;
    }

    const templatePath = path.join(
      templateDir,
      formatSelection.templateFile
    );
    if (!fs.existsSync(templatePath)) {
      new Notice(`未找到所选 Word 模板：${templatePath}`);
      return;
    }

    if (formatSelection.savePreset) {
      this.exportSettings.presets[formatSelection.presetName] = {
        name: formatSelection.presetName,
        config: formatSelection.config,
        templateFile: formatSelection.templateFile
      };
      await this.saveData(this.exportSettings);
      new Notice(`已保存格式方案：${formatSelection.presetName}`);
    }

    const requestedOutputPath = path.join(
      path.dirname(markdownPath),
      `${formatSelection.outputName}.docx`
    );
    const outputPath = uniqueOutputPath(requestedOutputPath);
    if (outputPath !== requestedOutputPath) {
      new Notice(
        `同名 Word 已存在，原文件保持不变；本次另存为：` +
          path.basename(outputPath),
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
    const progressModal = new ExportProgressModal(this.app, file.name);
    progressModal.open();
    progressModal.updateProgress(
      1,
      "启动导出程序",
      `${exportMode === "strict" ? "严格模式" : "兼容模式"} · ` +
        formatSelection.displayName
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
      const launchError = `启动 Word 导出失败：${error.message}`;
      output += `\n${launchError}\n`;
      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
        // The launch error is still visible in the modal and Notice.
      }
      progressModal.fail(launchError, failureLogPath);
      new Notice(`启动 Word 导出失败：${error.message}`);
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
        new Notice(`Word export completed: ${wordName}`, 8000);
        return;
      }

      try {
        appendFailureProcessOutput(failureLogPath, output);
      } catch {
        // Python already attempted to write its own failure report.
      }
      const details = humanizeProcessOutput(output)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(-4)
        .join("；");
      progressModal.fail(
        details || `Word export failed with code ${code}.`,
        failureLogPath
      );
      new Notice(
        details
          ? `Word export failed (${code}): ${details}`
          : `Word export failed with code ${code}.`,
        12000
      );
    });
    child.stdin.end();

    const modeLabel = exportMode === "strict" ? "严格模式" : "兼容模式";
    new Notice(
      `正在导出（${modeLabel}｜${formatSelection.displayName}）：` +
        path.basename(outputPath)
    );
  }
};
