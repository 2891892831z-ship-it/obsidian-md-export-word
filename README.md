---
date modified: 2026.10.16 14:55:12
---

# MD Export Word

将 Obsidian Markdown 导出为可继续编辑的 Word 文档，保留学术写作中最费时的
格式处理：真实上下标、公式与编号、图表题、表注/图注、可刷新 Zotero 引文域、
严格/兼容引用模式，以及可保存的字体和段落方案。

> 当前版本支持 Windows x64、macOS Apple Silicon 和 macOS Intel 桌面版
> Obsidian。插件会自动识别系统与 CPU 架构，并安装同版本的对应运行时。

## 主要能力

- 从命令面板导出当前 Markdown，不要求文档位于固定文件夹。
- 插件界面可跟随 Obsidian，也可固定为简体中文或 English；切换后运行时
  安装窗口和导出窗口立即更新，无需重启。
- HTML 上下标（如 `CO<sub>2</sub>`、`δ<sup>13</sup>C`、`T<sub>85</sub>`）以 Word 的真实上下标属性写入。
- 支持 Pandoc、pandoc-crossref、公式编号、图表交叉引用和 Word 公式。
- 严格模式：Zotero 缺少 citekey 时停止；兼容模式：保留醒目占位符并继续导出。
- Zotero 引文和参考文献写成可刷新域，后续可在 Word 中执行 Zotero Refresh。
- 导出时可从本机 Zotero 已安装样式中选择，默认沿用稿件设置；默认先生成可读引文与参考文献，仍保留动态域。
- 支持中文和英文稿件格式切换，并在窗口顶部确认实际导出字体、缩进及引用样式。
- Zotero Refresh 覆盖正文引文颜色后，可从命令面板生成蓝色引文副本；
  不覆盖源 Word、不删除 Zotero 域，Windows 与 macOS 均可使用。
- 期刊、毕业论文等多个 `.docx` 模板可选；自定义模板不会被运行时更新覆盖。
- 正文字体、字号、行距、缩进、标题、表格、图表题、图表注、公式和页边距可配置。
- 普通导出默认保持 Markdown 图片位置；需要时可在导出窗口顶部选择
  “自动回填分页空白”，或调用独立命令/快捷键，用同一小节后续正文减少
  大图换页前的空白。纵向超高图片仍会等比例缩放，源 Markdown 不会被修改。
- 导出后自动检查公式结构、引用域、表格、图注、空白和关键 OOXML 属性。
- Obsidian 内实时显示预检、引用、Pandoc、格式处理和自动检查进度。
- Word 文件名默认取文章一级标题，也可在导出窗口中直接修改；同名文件自动
  添加 `YYYYMMDD-HHmmss` 时间戳，绝不覆盖已有 Word。
- 导出和自动自检成功后默认自动打开生成的 Word，可在插件设置中关闭。
- 成功时不生成冗余日志；失败时单独生成可提交排错的 `导出失败.log.txt`。
- 运行时安装、修复与环境自检均可从 Obsidian 命令面板完成；流式下载实时
  显示百分比、速度和预计剩余时间，支持后台继续、下载阶段取消和最多 3 次
  网络重试，并使用 Release `SHA256SUMS` 校验运行时 ZIP。

## 最快安装方式：BRAT

前置条件：

- Windows 10/11（x64），或 Obsidian 1.7.2 支持的 macOS
  （Apple Silicon/Intel）；
- Obsidian 1.7.2 或更高版本；
- Python 3.10 或更高版本；
- 首次安装运行时需要访问 GitHub 和 Python Package Index；
- 若要生成可刷新引用，需要 Zotero 与 Better BibTeX。
- 对含多个语言 layout 的 CSL 样式提前生成可读引用，还需要系统 PATH 中可用的 Node.js（建议 20 或更高版本）；普通 CSL 渲染与手动刷新方式不需要它。

安装步骤：

1. 在 Obsidian 的“第三方插件市场”安装并启用 **BRAT**。
2. 打开 BRAT 设置，执行 **Add Beta plugin**。
3. 输入本仓库地址：`2891892831z-ship-it/obsidian-md-export-word`。
4. 安装并启用 **MD Export Word**。
   如需固定界面语言，可在插件设置中选择“跟随 Obsidian”“简体中文”或
   “English”。
5. 打开命令面板，运行
   `MD Export Word: Install or repair Word export runtime`。
   下载包约为 34-73 MB；下载窗口会显示百分比、速度和预计剩余时间，可
   隐藏到后台继续。取消只在下载阶段可用，完成下载后会继续校验和安装。
6. 安装完成后运行
   `MD Export Word: Check Word export runtime`。
7. 打开一篇 Markdown，运行
   `MD Export Word: Export current Markdown to Word (keep figure positions)`。

如果需要自动减少大图换页前的空白，可在导出窗口顶部选择
“自动回填分页空白”，或运行
`MD Export Word: Export current Markdown to Word (auto-fill figure page gaps)`。
两个命令都可以在 Obsidian“设置 → 快捷键”中自行绑定按键。

如果 Zotero Refresh 后正文引文变黑，保存 Word，再在对应 Markdown 中运行
`MD Export Word: Reapply blue Zotero citations to exported Word`。

首次运行时，插件会从同版本 GitHub Release 自动选择并下载：

- `md-export-word-runtime-windows-x64.zip`；
- `md-export-word-runtime-macos-arm64.zip`；
- `md-export-word-runtime-macos-x64.zip`。

插件同时读取当前平台的 `SHA256SUMS-<平台>.txt`，下载完成后先验证
SHA-256，再解压和配置运行时。临时网络错误最多自动重试 3 次。

随后创建插件私有 Python 虚拟环境并安装 `lxml`。Pandoc 与
pandoc-crossref 使用项目固定且互相匹配的版本，不依赖系统 PATH。

Windows 与 macOS 的完整步骤见 [BRAT 安装教程](docs/安装与BRAT.md)。

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
Windows 运行时由 `scripts/build-runtime.ps1` 构建；macOS Apple Silicon
和 Intel 运行时由 `scripts/build-runtime.sh` 构建。不应把可执行文件或
运行时 ZIP 直接提交到 Git。

## 项目状态

`1.4.0` 起提供 Windows x64、macOS Apple Silicon 和 macOS Intel 三套
运行时；`1.4.2` 起支持在 Zotero Refresh 后生成保留动态域的蓝色引文副本；
`1.4.3` 起支持大图纵向限高和同小节正文分页回填；`1.4.4` 起会把中英文
图名和中英文图注作为一个整体处理，并自动清理 Pandoc 生成的重复图名；
`1.4.5` 起普通导出默认保持图片原位，图片回填改为窗口顶部的显式选择和
独立可绑定快捷键的命令；`1.4.6` 起运行时安装会防止重复触发，使用独立
临时工作区，并提供下载超时、落盘校验和分阶段提示；`1.5.1` 起插件界面
支持跟随 Obsidian、简体中文和 English，运行时安装改为可后台继续、代理兼容
的分块下载，并增加进度、速度、ETA、下载阶段取消、网络重试和 Release SHA-256
校验；运行时文件通过 Obsidian 网络层按 4 MB 分块请求，可继承系统代理；
Markdown `####` 会正确导出为 Word 三级节标题（Heading 4）。
发布时由 GitHub Actions 在对应系统上分别执行真实导出烟雾测试，再生成同
版本 Release 资产。Release 标签使用纯版本号，不带 `v`。

## 许可证

插件及本仓库自有脚本使用 [MIT License](LICENSE)。运行时包含或安装的
Pandoc、pandoc-crossref、lxml 等组件使用各自许可证，详见
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
