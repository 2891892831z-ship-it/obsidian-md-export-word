# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/) 的组织方式和
[Semantic Versioning](https://semver.org/)。

## [Unreleased]

### Planned

- 为 Linux 增加独立运行时；
- 把遗留 UI 代码完全迁移为严格 TypeScript；
- 增加模板可视化预览。

## [1.4.4] - 2026-07-27

### Fixed

- 修复大图分页回填时把中文图名、英文图名误当正文提前到图片前的问题。
- 中英文图名、图注和跨引用书签现在作为同一图块处理，不会被分页回填拆散。
- Markdown 同时包含图片替代文字和显式中英文图名时，自动清理 Pandoc
  生成的重复图名；只修改导出副本，不修改源 Markdown。
- 新增双语图名、双语图注与跨引用书签组合的回归测试。

## [1.4.3] - 2026-07-27

### Added

- 新增“图片换页自动回填”，默认开启。较大图片在当前页放不下时，
  导出器会把图片后同一小节的连续正文提前到图片前，填补原本的大段空白；
  不跨越标题、表格、公式、图注或另一张图片，也不修改源 Markdown。
- 纵向超高图片会按版心建议高度等比例缩放，为图题和短图注保留空间。
- 导出进度和成功摘要新增纵向缩放图片数、回填图片数及提前正文段数。
- 新增大图分页跨平台回归测试，校验正文回填、章节边界、纵向高度上限和
  Markdown 哈希不变。

## [1.4.2] - 2026-07-27

### Added

- 新增命令 “Reapply blue Zotero citations to exported Word”。Zotero Refresh
  后可选择当前 Markdown 同目录的 Word，一键生成时间戳副本；正文
  `ZOTERO_ITEM` 引文恢复为蓝色，文末 `ZOTERO_BIBL` 参考文献保持黑色。
- 引文着色只修改 DOCX 中的显示格式，不删除 Zotero 域，也不覆盖源 Word；
  Windows 与 macOS 使用同一套 OOXML 处理和自动校验。

## [1.4.1] - 2026-07-27

### Fixed

- 严格模式不再把合法的英文 `Fig.`、`Figure` 和 `Table` 图表题误判为
  中文格式错误。
- 图表题校验不再与 Zotero 严格/兼容模式绑定，并会读取 Markdown
  `figureTitle`、`tableTitle` 元数据中的自定义题名前缀。
- 新增“严格模式 + 英文 Figure/Table”真实 Word 回归测试。

### Added

- 导出进度窗口中的实时过程支持鼠标选择和系统复制。
- 运行中和成功后可一键复制当前过程；失败后可一键复制完整错误日志。
- 失败窗口新增“打开日志文件”，Windows 与 macOS 均可直接调用默认应用。

### Changed

- 图表题校验失败时，日志会同时列出实际题名与本次允许的题名前缀。
- 跨平台运行时烟雾测试新增严格模式英文表题回归场景。

## [1.4.0] - 2026-07-26

### Added

- 新增 macOS Apple Silicon（arm64）与 macOS Intel（x64）独立运行时。
- 插件自动识别 Windows/macOS 与 CPU 架构，也可在设置中手动选择运行时。
- 新增跨平台 Python 环境自检、macOS 安装脚本和 Finder 双击导出入口。
- GitHub Actions 在 Windows x64、macOS arm64、macOS x64 三个平台执行
  真实导出烟雾测试并分别构建运行时。

### Changed

- 插件直接调用私有 Python 导出器，不再把 Windows CMD 作为必经入口。
- 自动打开 Word 在 Windows 使用系统文件关联，在 macOS 使用 `open`。
- 运行时资产名称包含操作系统与 CPU 架构，避免用户下载错误版本。
- 运行时安装采用临时目录、平台清单校验和失败回滚。

## [1.3.1] - 2026-07-26

### Changed

- 导出和自动自检成功后默认自动打开生成的 Word，可在插件设置中关闭。
- 导出过程改为 Obsidian 实时进度窗口，成功时不再生成日志文件。

### Added

- 失败时生成独立 `导出失败.log.txt`，包含异常信息和插件捕获的进程输出。
- 发布流程同时验证成功导出和预期失败两条路径，并保留 CI 的 Obsidian 库根标记。
- Word 文件名默认使用 Markdown 文章一级标题，并可在导出窗口中直接修改。
- 同名 Word 自动添加年月日与时间戳另存，保留已有文件不被覆盖。

## [1.3.0] - 2026-07-26

### Added

- 可由 BRAT 安装的标准 Obsidian 插件资产；
- 同版本 Windows 运行时 Release 资产；
- 插件内运行时安装、修复和环境自检；
- 独立用户模板目录；
- 严格/兼容 Zotero 模式；
- 可保存的格式预设；
- GitHub CI、Release、Issue 和 PR 模板；
- 完整中文安装、使用、迁移和故障排查文档。

### Changed

- 所有运行路径改为插件相对路径；
- Python 改为插件私有虚拟环境优先；
- 不再依赖个人 Obsidian 库目录或 Codex 运行时。
