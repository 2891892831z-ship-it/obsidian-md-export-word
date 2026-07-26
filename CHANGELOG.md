# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/) 的组织方式和
[Semantic Versioning](https://semver.org/)。

## [Unreleased]

### Changed

- 导出和自动自检成功后默认自动打开生成的 Word，可在插件设置中关闭。

### Planned

- 为 macOS 和 Linux 增加独立运行时；
- 把遗留 UI 代码完全迁移为严格 TypeScript；
- 增加模板可视化预览。

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
