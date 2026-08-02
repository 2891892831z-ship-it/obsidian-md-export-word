# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/) 的组织方式和
[Semantic Versioning](https://semver.org/)。

## [Unreleased]

### Planned

- 为 Linux 增加独立运行时；
- 把遗留 UI 代码完全迁移为严格 TypeScript；
- 增加模板可视化预览。

## [1.5.3] - 2026-08-02

### Fixed

- English documents declared with `lang: en-US` now use the configured Western
  font in all Word font slots and inherited styles. Refreshed Zotero citation
  fields and bibliography entries therefore keep Times New Roman punctuation.
- English exports now replace inherited Chinese Zotero document preferences
  with the APA English style and normalize citation parentheses to ASCII before
  Word is written, so Zotero Refresh no longer restores full-width brackets.
- Obsidian `==highlight==` markup now becomes native yellow Word highlighting;
  inline HTML `<mark style="background-color:...">...</mark>` spans preserve
  their exact CSS background color as Word shading. Neither form leaves literal
  Markdown or HTML delimiters in the exported document.
- Chinese documents retain the configured East Asian/Western font pairing.

## [1.5.2] - 2026-07-31

### Fixed

- 修复英文所有格和缩写中的弯撇号，以及英文弯引号被错误套用中文字体的
  问题；导出器现在依据相邻文本语言选择字体，并正确处理单独位于 Word run
  中的标点，同时保留中文引号的东亚字体。

## [1.5.1] - 2026-07-30

### Added

- 新增“跟随 Obsidian”“简体中文”和 “English” 三种界面语言模式；切换后，
  设置页、运行时安装窗口和导出窗口会立即更新，无需重启 Obsidian。
- 运行时下载窗口新增实时百分比、下载速度和预计剩余时间；GitHub 未返回
  总大小时仍显示已下载大小和速度。
- 下载窗口支持“后台继续”和“取消下载”。取消仅作用于运行时 ZIP 下载阶段；
  下载完成后进入校验、解压和 Python 环境配置时不再提供取消操作。
- 临时网络错误最多自动重试 3 次，并在重试间保留已完成安装流程的安全边界。
- 安装器会读取 Release 中当前平台的 `SHA256SUMS-<平台>.txt`，在解压前验证
  运行时 ZIP 的 SHA-256；校验不一致时停止安装。

### Changed

- 运行时安装提示由阶段与累计用时通知升级为独立下载窗口；隐藏窗口不会中断
  下载，完成、取消或失败仍会给出 Obsidian 通知。

### Fixed

- 修复 Markdown `####` 三级节标题在导出 Word 时被降级为正文的问题；现在会
  保留为 Word Heading 4，并应用三级节标题格式。
- 修复运行时下载直接使用 Node HTTP 连接、无法继承 Obsidian 系统代理的问题；
  下载与 SHA-256 清单现统一通过 Obsidian 网络层请求，运行时 ZIP 默认按
  4 MB 分块下载，并严格校验每个字节范围。

## [1.4.6] - 2026-07-27

### Fixed

- 修复重复触发运行时安装时，并发流程共用并删除同一临时 ZIP，导致 macOS
  `ditto` 报 `No such file or directory` 的问题。
- 修复新运行时已经通过自检后，临时文件清理失败仍可能误触发回滚的问题。
- 每次安装改用独立临时工作区；安装失败时可靠恢复旧运行时，回滚失败则保留
  备份并在提示中显示路径。

### Changed

- 重复执行安装命令，或由导出、Zotero 引文处理同时触发安装时，复用同一个
  在途任务，不再重复下载或解压。
- 新增插件目录原子安装锁，阻止 BRAT 热重载或多个 Obsidian 窗口同时替换
  同一个运行时；进程异常退出后的陈旧锁会在下次安装时自动恢复。
- 设置页在安装期间禁用仓库、平台、安装和自检控件，并明确显示“正在安装”。
- 下载提示持续显示当前阶段、累计用时和包体积估计；下载超过 5 分钟时给出
  GitHub 网络与 Release 资产检查建议。
- 解压前新增 ZIP 响应格式、原子落盘和文件大小校验，并区分下载、解压、
  Python 环境配置与最终自检错误。
- 新增安装单任务、跨实例锁、超时、唯一工作区和异常响应校验单元测试。

## [1.4.5] - 2026-07-27

### Changed

- 普通导出默认保持 Markdown 中的图片位置，不再自动移动图片后的正文。
- 导出格式窗口顶部新增“保持图片原位（默认）”与“自动回填分页空白”按钮，
  每次导出都能直接确认或切换图片分页方式。
- 新增独立命令
  `Export current Markdown to Word (auto-fill figure page gaps)`，可在
  Obsidian 快捷键设置中单独绑定；原导出命令保留原 ID，并明确为保持图片位置。
- CMD/直接 Python 导出同样默认关闭图片回填，只有显式配置后才启用。
- 跨平台烟雾测试同时覆盖“默认不移动”和“显式启用回填”两种行为。

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
