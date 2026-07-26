# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/) 的组织方式和
[Semantic Versioning](https://semver.org/)。

## [Unreleased]

### Planned

- 为 Linux 增加独立运行时；
- 把遗留 UI 代码完全迁移为严格 TypeScript；
- 增加模板可视化预览。

## [1.4.1] - 2026-07-27

### Fixed

- 修复严格引用模式把英文 `Fig. 1`、`Figure 1` 和 `Table 1` 图表题误判为
  不合格的问题；引用严格性不再限制图表题语言。
- 新增“严格模式 + 英文 Figure/Table”真实 Word 回归测试。

### Added

- 导出进度窗口中的实时过程支持鼠标选择和系统复制。
- 运行中和成功后可一键复制当前过程；失败后可一键复制完整错误日志。
- 失败窗口新增“打开日志文件”，Windows 与 macOS 均可直接调用默认应用。

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
