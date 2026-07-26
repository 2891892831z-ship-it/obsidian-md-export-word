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
var fs = __toESM(require("node:fs"), 1);
var path = __toESM(require("node:path"), 1);
var PLUGIN_VERSION = "1.3.0";
var RUNTIME_ASSET = "md-export-word-runtime-windows.zip";
var RUNTIME_MANIFEST = "runtime-manifest.json";
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
  margin_cm: 2.54
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
function cloneFormat(config = DEFAULT_FORMAT) {
  return { ...DEFAULT_FORMAT, ...config };
}
function formatSummary(config) {
  return `\u4E2D\u6587 ${config.east_asia_font}\uFF1B\u82F1\u6587/\u6570\u5B57 ${config.western_font}\uFF1B\u6B63\u6587 ${config.body_size_pt} pt\u3001${config.body_line_spacing} \u500D\u884C\u8DDD\u3001\u9996\u884C ${config.body_first_line_chars} \u5B57\uFF1B\u8868\u683C ${config.table_size_pt} pt\u3001${config.table_line_spacing} \u500D\u884C\u8DDD\uFF1B\u56FE\u8868\u9898 ${config.caption_size_pt} pt\uFF1B\u56FE\u8868\u6CE8 ${config.note_size_pt} pt\uFF1BA4 \u56DB\u8FB9 ${config.margin_cm} cm`;
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
var FormatSettingsModal = class extends import_obsidian.Modal {
  constructor(app, options, resolve) {
    super(app);
    this.resolve = resolve;
    this.resolved = false;
    this.presets = options.presets || {};
    this.templateFiles = options.templateFiles.length ? options.templateFiles : [DEFAULT_TEMPLATE_FILE];
    this.selectedPreset = "__default__";
    this.config = cloneFormat();
    this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE) ? DEFAULT_TEMPLATE_FILE : this.templateFiles[0];
    this.presetName = "";
  }
  usePreset(value) {
    this.selectedPreset = value;
    if (value === "__default__") {
      this.config = cloneFormat();
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
    const config = useDefault ? cloneFormat() : cloneFormat(this.config);
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
      displayName
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
      text: "\u4E0D\u4FEE\u6539\u4EFB\u4F55\u9009\u9879\u65F6\u4F7F\u7528\u5F53\u524D\u671F\u520A\u6A21\u677F\uFF08" + formatSummary(DEFAULT_FORMAT) + "\uFF09\u3002"
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
var MdExportWordSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "MD Export Word" });
    new import_obsidian.Setting(containerEl).setName("\u8FD0\u884C\u65F6\u53D1\u5E03\u4ED3\u5E93").setDesc(
      "\u901A\u5E38\u7531\u6B63\u5F0F Release \u81EA\u52A8\u5199\u5165\uFF1B\u4EC5\u5728\u81EA\u5EFA\u5206\u652F\u6216\u79C1\u6709\u4ED3\u5E93\u4E2D\u9700\u8981\u4FEE\u6539\u3002"
    ).addText(
      (text) => text.setPlaceholder("owner/obsidian-md-export-word").setValue(this.plugin.getReleaseRepository()).onChange(async (value) => {
        this.plugin.exportSettings.repository = value.trim();
        await this.plugin.saveData(this.plugin.exportSettings);
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5BFC\u51FA\u6210\u529F\u540E\u81EA\u52A8\u6253\u5F00 Word").setDesc("\u9ED8\u8BA4\u5F00\u542F\uFF1B\u53EA\u6709\u5BFC\u51FA\u548C\u81EA\u52A8\u81EA\u68C0\u5747\u6210\u529F\u65F6\u624D\u4F1A\u6253\u5F00\u751F\u6210\u7684 .docx\u3002").addToggle(
      (toggle) => toggle.setValue(this.plugin.exportSettings.autoOpen !== false).onChange(async (value) => {
        this.plugin.exportSettings.autoOpen = value;
        await this.plugin.saveData(this.plugin.exportSettings);
      })
    );
    new import_obsidian.Setting(containerEl).setName("Word \u5BFC\u51FA\u8FD0\u884C\u65F6").setDesc(this.plugin.runtimeStatusText()).addButton(
      (button) => button.setButtonText("\u5B89\u88C5\u6216\u4FEE\u590D").setCta().onClick(async () => {
        await this.plugin.installRuntime();
        this.display();
      })
    ).addButton(
      (button) => button.setButtonText("\u73AF\u5883\u81EA\u68C0").onClick(async () => {
        await this.plugin.runDoctor();
        this.display();
      })
    );
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
      name: "Export current Markdown to Word",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        const canExport = Boolean(
          file && typeof file.extension === "string" && file.extension.toLowerCase() === "md"
        );
        if (canExport && !checking) {
          void this.exportCurrentFile(file);
        }
        return canExport;
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
      true ? "" : ""
    ).trim();
    return stamped;
  }
  runtimeStatus() {
    const root = this.getRuntimeRoot();
    if (!root) {
      return { ready: false, message: "\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\u3002" };
    }
    const required = [
      path.join(root, RUNTIME_MANIFEST),
      path.join(root, "scripts", "MD\u5BFC\u51FAWord\u6A21\u677F.cmd"),
      path.join(root, "scripts", "md_export_word_template.py"),
      path.join(root, "Pandoc&pandoc-crossref", "pandoc.exe"),
      path.join(root, "Pandoc&pandoc-crossref", "pandoc-crossref.exe"),
      path.join(root, "Word-Template", DEFAULT_TEMPLATE_FILE)
    ];
    const missing = required.filter((file) => !fs.existsSync(file));
    if (missing.length) {
      return {
        ready: false,
        message: `\u672A\u5B89\u88C5\u6216\u4E0D\u5B8C\u6574\uFF08\u7F3A\u5C11 ${missing.length} \u4E2A\u6587\u4EF6\uFF09\u3002`
      };
    }
    try {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(root, RUNTIME_MANIFEST), "utf8")
      );
      if (manifest.version !== this.manifest.version) {
        return {
          ready: false,
          message: `\u8FD0\u884C\u65F6\u7248\u672C ${manifest.version || "unknown"} \u4E0E\u63D2\u4EF6\u7248\u672C ${this.manifest.version} \u4E0D\u4E00\u81F4\u3002`
        };
      }
      return {
        ready: true,
        message: `\u5DF2\u5B89\u88C5\u8FD0\u884C\u65F6 ${manifest.version || "unknown"}\u3002`
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
        "\u63D2\u4EF6\u9700\u8981\u4ECE\u540C\u7248\u672C GitHub Release \u4E0B\u8F7D Windows \u8FD0\u884C\u65F6\u3002\u7C98\u8D34\u4F60\u5728 BRAT \u4E2D\u6DFB\u52A0\u7684\u4ED3\u5E93\u5730\u5740\u3002",
        initialValue,
        resolve
      ).open();
    });
  }
  async installRuntime() {
    if (process.platform !== "win32") {
      new import_obsidian.Notice("\u5F53\u524D\u8FD0\u884C\u65F6\u53EA\u652F\u6301 Windows \u684C\u9762\u7248 Obsidian\u3002", 1e4);
      return false;
    }
    const pluginRoot = this.getPluginRoot();
    if (!pluginRoot) {
      new import_obsidian.Notice("\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u5B89\u88C5\u8FD0\u884C\u65F6\u3002");
      return false;
    }
    let repository = this.getReleaseRepository();
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
    const version = this.manifest.version || PLUGIN_VERSION;
    const url = `https://github.com/${repository}/releases/download/${version}/${RUNTIME_ASSET}`;
    const zipPath = path.join(pluginRoot, ".runtime-download.zip");
    const stagePath = path.join(pluginRoot, ".runtime-stage");
    const runtimePath = path.join(pluginRoot, "runtime");
    const backupPath = path.join(pluginRoot, ".runtime-backup");
    try {
      new import_obsidian.Notice(`\u6B63\u5728\u4E0B\u8F7D Word \u5BFC\u51FA\u8FD0\u884C\u65F6 ${version}\u2026`, 8e3);
      const response = await (0, import_obsidian.requestUrl)({ url, method: "GET" });
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP ${response.status}`);
      }
      fs.writeFileSync(zipPath, Buffer.from(response.arrayBuffer));
      const installScript = `
$ErrorActionPreference = 'Stop'
$zip = $args[0]
$plugin = $args[1]
$stage = $args[2]
$runtime = $args[3]
$backup = $args[4]
if (Test-Path -LiteralPath $stage) {
  Remove-Item -LiteralPath $stage -Recurse -Force
}
if (Test-Path -LiteralPath $backup) {
  Remove-Item -LiteralPath $backup -Recurse -Force
}
$hadRuntime = Test-Path -LiteralPath $runtime
try {
  New-Item -ItemType Directory -Path $stage -Force | Out-Null
  Expand-Archive -LiteralPath $zip -DestinationPath $stage -Force
  $payload = Join-Path $stage 'runtime'
  if (-not (Test-Path -LiteralPath (Join-Path $payload 'runtime-manifest.json'))) {
    throw '\u8FD0\u884C\u65F6\u5305\u7F3A\u5C11 runtime/runtime-manifest.json'
  }
  if ($hadRuntime) {
    Move-Item -LiteralPath $runtime -Destination $backup
  }
  Move-Item -LiteralPath $payload -Destination $runtime
  $setup = Join-Path $runtime 'scripts\\setup-runtime.ps1'
  if (Test-Path -LiteralPath $setup) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $setup
    if ($LASTEXITCODE -ne 0) {
      throw "Python \u73AF\u5883\u5B89\u88C5\u5931\u8D25\uFF1A$LASTEXITCODE"
    }
  }
  if (Test-Path -LiteralPath $backup) {
    Remove-Item -LiteralPath $backup -Recurse -Force
  }
  Remove-Item -LiteralPath $stage -Recurse -Force
  Remove-Item -LiteralPath $zip -Force
}
catch {
  if (Test-Path -LiteralPath $runtime) {
    Remove-Item -LiteralPath $runtime -Recurse -Force
  }
  if (Test-Path -LiteralPath $backup) {
    Move-Item -LiteralPath $backup -Destination $runtime
  }
  if (Test-Path -LiteralPath $stage) {
    Remove-Item -LiteralPath $stage -Recurse -Force
  }
  if (Test-Path -LiteralPath $zip) {
    Remove-Item -LiteralPath $zip -Force
  }
  throw
}
`;
      const result = await runProcess(
        "powershell.exe",
        [
          "-NoProfile",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          installScript,
          zipPath,
          pluginRoot,
          stagePath,
          runtimePath,
          backupPath
        ],
        { cwd: pluginRoot }
      );
      if (result.code !== 0) {
        throw new Error(result.output.trim() || `\u9000\u51FA\u4EE3\u7801 ${result.code}`);
      }
      const status = this.runtimeStatus();
      if (!status.ready) {
        throw new Error(status.message);
      }
      this.ensureTemplateLibrary();
      new import_obsidian.Notice(`Word \u5BFC\u51FA\u8FD0\u884C\u65F6\u5B89\u88C5\u5B8C\u6210\uFF1A${status.message}`, 1e4);
      return true;
    } catch (error) {
      new import_obsidian.Notice(
        `\u8FD0\u884C\u65F6\u5B89\u88C5\u5931\u8D25\uFF1A${error.message}\u3002\u8BF7\u67E5\u770B docs/\u6545\u969C\u6392\u67E5.md\u3002`,
        15e3
      );
      return false;
    }
  }
  async runDoctor() {
    const root = this.getRuntimeRoot();
    const status = this.runtimeStatus();
    if (!root || !status.ready) {
      new import_obsidian.Notice(`\u73AF\u5883\u81EA\u68C0\u672A\u901A\u8FC7\uFF1A${status.message}`, 12e3);
      return false;
    }
    const doctor = path.join(root, "scripts", "doctor.ps1");
    if (!fs.existsSync(doctor)) {
      new import_obsidian.Notice("\u73AF\u5883\u81EA\u68C0\u811A\u672C\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u6267\u884C\u201C\u5B89\u88C5\u6216\u4FEE\u590D\u8FD0\u884C\u65F6\u201D\u3002");
      return false;
    }
    const result = await runProcess(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", doctor],
      { cwd: root }
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
  selectFormatSettings(templateFiles) {
    return new Promise((resolve) => {
      new FormatSettingsModal(
        this.app,
        {
          presets: this.exportSettings.presets,
          templateFiles
        },
        resolve
      ).open();
    });
  }
  async exportCurrentFile(file) {
    const exportMode = await this.selectExportMode();
    if (!exportMode) {
      new import_obsidian.Notice("\u5DF2\u53D6\u6D88 Word \u5BFC\u51FA\u3002");
      return;
    }
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new import_obsidian.Notice("\u5F53\u524D\u77E5\u8BC6\u5E93\u4E0D\u662F\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u6CD5\u8C03\u7528 CMD\u3002");
      return;
    }
    const vaultPath = adapter.getBasePath();
    const markdownPath = path.join(vaultPath, file.path);
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
    const commandPath = path.join(
      pandocRoot,
      "scripts",
      "MD\u5BFC\u51FAWord\u6A21\u677F.cmd"
    );
    const templateDir = this.ensureTemplateLibrary();
    if (!templateDir) {
      new import_obsidian.Notice("\u65E0\u6CD5\u521B\u5EFA\u7528\u6237\u6A21\u677F\u76EE\u5F55\u3002");
      return;
    }
    if (!fs.existsSync(commandPath)) {
      new import_obsidian.Notice(`\u672A\u627E\u5230\u5BFC\u51FA\u7A0B\u5E8F\uFF1A${commandPath}`);
      return;
    }
    let templateFiles = [];
    try {
      templateFiles = fs.readdirSync(templateDir).filter(
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
    const formatSelection = await this.selectFormatSettings(templateFiles);
    if (!formatSelection) {
      new import_obsidian.Notice("\u5DF2\u53D6\u6D88 Word \u5BFC\u51FA\u3002");
      return;
    }
    const templatePath = path.join(
      templateDir,
      formatSelection.templateFile
    );
    if (!fs.existsSync(templatePath)) {
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
    let output = "";
    let failedToStart = false;
    const child = (0, import_node_child_process.spawn)(
      "cmd.exe",
      ["/d", "/c", "call", commandPath, markdownPath],
      {
        cwd: path.dirname(commandPath),
        env: {
          ...process.env,
          MD_EXPORT_WORD_NONINTERACTIVE: "1",
          MD_EXPORT_WORD_AUTO_OPEN: this.exportSettings.autoOpen === false ? "0" : "1",
          MD_EXPORT_WORD_MODE: exportMode,
          MD_EXPORT_WORD_TEMPLATE: templatePath,
          MD_EXPORT_WORD_FORMAT_JSON: JSON.stringify(formatSelection.config)
        },
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      }
    );
    const collectOutput = (data) => {
      output += data.toString("utf8");
      if (output.length > 12e3) {
        output = output.slice(-12e3);
      }
    };
    child.stdout.on("data", collectOutput);
    child.stderr.on("data", collectOutput);
    child.stdin.on("error", () => {
    });
    child.once("error", (error) => {
      failedToStart = true;
      new import_obsidian.Notice(`\u542F\u52A8 Word \u5BFC\u51FA\u5931\u8D25\uFF1A${error.message}`);
    });
    child.once("close", (code) => {
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch ? path.basename(wordMatch[1].trim()) : `${file.basename}-\u7F16\u8F91\u5BA1\u9605\u7A3F.docx`;
        new import_obsidian.Notice(`Word export completed: ${wordName}`, 8e3);
        return;
      }
      const details = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-4).join("\uFF1B");
      new import_obsidian.Notice(
        details ? `Word export failed (${code}): ${details}` : `Word export failed with code ${code}.`,
        12e3
      );
    });
    child.stdin.end();
    const modeLabel = exportMode === "strict" ? "\u4E25\u683C\u6A21\u5F0F" : "\u517C\u5BB9\u6A21\u5F0F";
    new import_obsidian.Notice(
      `\u6B63\u5728\u5BFC\u51FA\uFF08${modeLabel}\uFF5C${formatSelection.displayName}\uFF09\uFF1A${file.name}`
    );
  }
};
