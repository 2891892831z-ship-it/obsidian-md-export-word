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

const PLUGIN_VERSION = "1.3.0";
const RUNTIME_ASSET = "md-export-word-runtime-windows.zip";
const RUNTIME_MANIFEST = "runtime-manifest.json";

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
  margin_cm: 2.54
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
    `A4 四边 ${config.margin_cm} cm`
  );
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

class FormatSettingsModal extends Modal {
  constructor(app, options, resolve) {
    super(app);
    this.resolve = resolve;
    this.resolved = false;
    this.presets = options.presets || {};
    this.templateFiles = options.templateFiles.length
      ? options.templateFiles
      : [DEFAULT_TEMPLATE_FILE];
    this.selectedPreset = "__default__";
    this.config = cloneFormat();
    this.templateFile = this.templateFiles.includes(DEFAULT_TEMPLATE_FILE)
      ? DEFAULT_TEMPLATE_FILE
      : this.templateFiles[0];
    this.presetName = "";
  }

  usePreset(value) {
    this.selectedPreset = value;
    if (value === "__default__") {
      this.config = cloneFormat();
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
    const config = useDefault ? cloneFormat() : cloneFormat(this.config);
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
      displayName
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
        formatSummary(DEFAULT_FORMAT) +
        "）。"
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
      name: "Export current Markdown to Word",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        const canExport = Boolean(
          file &&
          typeof file.extension === "string" &&
          file.extension.toLowerCase() === "md"
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
    const required = [
      path.join(root, RUNTIME_MANIFEST),
      path.join(root, "scripts", "MD导出Word模板.cmd"),
      path.join(root, "scripts", "md_export_word_template.py"),
      path.join(root, "Pandoc&pandoc-crossref", "pandoc.exe"),
      path.join(root, "Pandoc&pandoc-crossref", "pandoc-crossref.exe"),
      path.join(root, "Word-Template", DEFAULT_TEMPLATE_FILE)
    ];
    const missing = required.filter((file) => !fs.existsSync(file));
    if (missing.length) {
      return {
        ready: false,
        message: `未安装或不完整（缺少 ${missing.length} 个文件）。`
      };
    }
    try {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(root, RUNTIME_MANIFEST), "utf8")
      );
      if (manifest.version !== this.manifest.version) {
        return {
          ready: false,
          message:
            `运行时版本 ${manifest.version || "unknown"} 与插件版本 ` +
            `${this.manifest.version} 不一致。`
        };
      }
      return {
        ready: true,
        message: `已安装运行时 ${manifest.version || "unknown"}。`
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
        "插件需要从同版本 GitHub Release 下载 Windows 运行时。粘贴你在 BRAT 中添加的仓库地址。",
        initialValue,
        resolve
      ).open();
    });
  }

  async installRuntime() {
    if (process.platform !== "win32") {
      new Notice("当前运行时只支持 Windows 桌面版 Obsidian。", 10000);
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
      `${version}/${RUNTIME_ASSET}`;
    const zipPath = path.join(pluginRoot, ".runtime-download.zip");
    const stagePath = path.join(pluginRoot, ".runtime-stage");
    const runtimePath = path.join(pluginRoot, "runtime");
    const backupPath = path.join(pluginRoot, ".runtime-backup");

    try {
      new Notice(`正在下载 Word 导出运行时 ${version}…`, 8000);
      const response = await requestUrl({ url, method: "GET" });
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
    throw '运行时包缺少 runtime/runtime-manifest.json'
  }
  if ($hadRuntime) {
    Move-Item -LiteralPath $runtime -Destination $backup
  }
  Move-Item -LiteralPath $payload -Destination $runtime
  $setup = Join-Path $runtime 'scripts\\setup-runtime.ps1'
  if (Test-Path -LiteralPath $setup) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $setup
    if ($LASTEXITCODE -ne 0) {
      throw "Python 环境安装失败：$LASTEXITCODE"
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
        throw new Error(result.output.trim() || `退出代码 ${result.code}`);
      }
      const status = this.runtimeStatus();
      if (!status.ready) {
        throw new Error(status.message);
      }
      this.ensureTemplateLibrary();
      new Notice(`Word 导出运行时安装完成：${status.message}`, 10000);
      return true;
    } catch (error) {
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
    const doctor = path.join(root, "scripts", "doctor.ps1");
    if (!fs.existsSync(doctor)) {
      new Notice("环境自检脚本不存在，请先执行“安装或修复运行时”。");
      return false;
    }
    const result = await runProcess(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", doctor],
      { cwd: root }
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
      new Notice("已取消 Word 导出。");
      return;
    }

    const adapter = this.app.vault.adapter;
    if (typeof adapter.getBasePath !== "function") {
      new Notice("当前知识库不是本地文件系统，无法调用 CMD。");
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
        new Notice(`运行时仍不可用：${runtimeStatus.message}`, 12000);
        return;
      }
    }

    const pandocRoot = this.getRuntimeRoot();
    const commandPath = path.join(
      pandocRoot,
      "scripts",
      "MD导出Word模板.cmd"
    );
    const templateDir = this.ensureTemplateLibrary();
    if (!templateDir) {
      new Notice("无法创建用户模板目录。");
      return;
    }

    if (!fs.existsSync(commandPath)) {
      new Notice(`未找到导出程序：${commandPath}`);
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

    const formatSelection = await this.selectFormatSettings(templateFiles);
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

    let output = "";
    let failedToStart = false;
    const child = spawn(
      "cmd.exe",
      ["/d", "/c", "call", commandPath, markdownPath],
      {
        cwd: path.dirname(commandPath),
        env: {
          ...process.env,
          MD_EXPORT_WORD_NONINTERACTIVE: "1",
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
      if (output.length > 12000) {
        output = output.slice(-12000);
      }
    };
    child.stdout.on("data", collectOutput);
    child.stderr.on("data", collectOutput);
    child.stdin.on("error", () => {});
    child.once("error", (error) => {
      failedToStart = true;
      new Notice(`启动 Word 导出失败：${error.message}`);
    });
    child.once("close", (code) => {
      if (failedToStart) {
        return;
      }
      if (code === 0) {
        const wordMatch = output.match(/Word：([^\r\n]+)/);
        const wordName = wordMatch
          ? path.basename(wordMatch[1].trim())
          : `${file.basename}-编辑审阅稿.docx`;
        new Notice(`Word export completed: ${wordName}`, 8000);
        return;
      }

      const details = output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(-4)
        .join("；");
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
      `正在导出（${modeLabel}｜${formatSelection.displayName}）：${file.name}`
    );
  }
};
