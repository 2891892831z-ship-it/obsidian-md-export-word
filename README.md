# MD Export Word

将 Obsidian Markdown 导出为可继续编辑的 Word 文档，保留学术写作中最费时的
格式处理：真实上下标、公式与编号、图表题、表注/图注、可刷新 Zotero 引文域、
严格/兼容引用模式，以及可保存的字体和段落方案。

> 当前版本面向 Windows 桌面版 Obsidian。项目由一个轻量 Obsidian 插件和
> 一个版本匹配的 Windows 运行时组成。

## 主要能力

- 从命令面板导出当前 Markdown，不要求文档位于固定文件夹。
- `CO₂`、`δ¹³C`、`T₈₅` 等以 Word 的真实上下标属性写入，不是替代字符或缩小字体。
- 支持 Pandoc、pandoc-crossref、公式编号、图表交叉引用和 Word 公式。
- 严格模式：Zotero 缺少 citekey 时停止；兼容模式：保留醒目占位符并继续导出。
- Zotero 引文和参考文献写成可刷新域，后续可在 Word 中执行 Zotero Refresh。
- 期刊、毕业论文等多个 `.docx` 模板可选；自定义模板不会被运行时更新覆盖。
- 正文字体、字号、行距、缩进、标题、表格、图表题、图表注、公式和页边距可配置。
- 导出后自动检查公式结构、引用域、表格、图注、空白和关键 OOXML 属性。
- Obsidian 内实时显示预检、引用、Pandoc、格式处理和自动检查进度。
- 导出和自动自检成功后默认自动打开生成的 Word，可在插件设置中关闭。
- 成功时不生成冗余日志；失败时单独生成可提交排错的 `导出失败.log.txt`。
- 运行时安装、修复与环境自检均可从 Obsidian 命令面板完成。

## 最快安装方式：BRAT

前置条件：

- Windows 10/11；
- Obsidian 1.7.2 或更高版本；
- Python 3.10 或更高版本；
- 首次安装运行时需要访问 GitHub 和 Python Package Index；
- 若要生成可刷新引用，需要 Zotero 与 Better BibTeX。

安装步骤：

1. 在 Obsidian 的“第三方插件市场”安装并启用 **BRAT**。
2. 打开 BRAT 设置，执行 **Add Beta plugin**。
3. 输入本仓库地址：`你的用户名/obsidian-md-export-word`。
4. 安装并启用 **MD Export Word**。
5. 打开命令面板，运行
   `MD Export Word: Install or repair Word export runtime`。
6. 安装完成后运行
   `MD Export Word: Check Word export runtime`。
7. 打开一篇 Markdown，运行
   `MD Export Word: Export current Markdown to Word`。

首次运行时，插件会从同版本 GitHub Release 下载
`md-export-word-runtime-windows.zip`，创建独立 Python 虚拟环境并安装
`lxml`。Pandoc 与 pandoc-crossref 使用项目固定且互相匹配的版本。

完整图文步骤见 [BRAT 安装教程](docs/安装与BRAT.md)。

## 文档

| 文档 | 适用场景 |
| --- | --- |
| [BRAT 安装教程](docs/安装与BRAT.md) | 在另一台电脑上安装、更新、卸载 |
| [用户手册](docs/用户手册.md) | 日常导出、严格/兼容模式、日志 |
| [Markdown 写法](docs/Markdown写法.md) | 引用、公式、图表、注释和上下标 |
| [格式与模板](docs/格式与模板.md) | 期刊、毕业论文、自定义模板与预设 |
| [Zotero 引用](docs/Zotero引用.md) | Better BibTeX、刷新、缺失 citekey |
| [故障排查](docs/故障排查.md) | 无 Word、运行时、图片、乱码等问题 |
| [架构说明](docs/架构说明.md) | 为什么 BRAT 与运行时分开 |
| [开发与发布](docs/开发与发布.md) | 构建、测试、GitHub Release |
| [迁移检查清单](docs/迁移检查清单.md) | 在新电脑上逐项验收 |

## 为什么需要单独的运行时

BRAT 和 Obsidian 的标准插件安装只获取 `main.js`、`manifest.json` 和可选的
`styles.css`。本项目还需要 Python 导出器、Lua 过滤器、Word 模板、Pandoc
与 pandoc-crossref，因此发布工作流会额外构建一个运行时 ZIP，插件在首次
使用时下载同版本资产。

这种设计有三个目的：

1. 插件仓库不提交 300 MB 以上的二进制文件；
2. Pandoc 与 pandoc-crossref 版本始终配对；
3. 插件升级与运行时升级使用同一版本号，可回退、可校验。

## 开发

```powershell
npm install
npm run check
npm run build
```

构建后的 `main.js`、`manifest.json`、`styles.css` 是 Obsidian/BRAT 插件资产。
Windows 运行时由 `scripts/build-runtime.ps1` 构建，不应把 `.exe` 或 ZIP
直接提交到 Git。

## 项目状态

当前是从个人科研工作流提炼出的首个可迁移版本。发布前需要把本仓库推送到
GitHub，并按 [开发与发布](docs/开发与发布.md) 创建版本号为 `1.3.0` 的
Release。Release 标签不要带 `v`。

## 许可证

插件及本仓库自有脚本使用 [MIT License](LICENSE)。运行时包含或安装的
Pandoc、pandoc-crossref、lxml 等组件使用各自许可证，详见
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
