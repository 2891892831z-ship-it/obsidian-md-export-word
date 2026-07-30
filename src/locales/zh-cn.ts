export const zhCN = {
  "common.cancel": "取消",
  "common.continue": "继续",
  "common.close": "关闭",
  "common.unknown": "未知",
  "common.enabled": "开启",
  "common.disabled": "关闭",
  "common.default": "默认",
  "common.savedValue": "{value}（已保存值）",
  "common.errorWithMessage": "{action}：{message}",
  "duration.seconds": "{seconds} 秒",
  "duration.minutesSeconds": "{minutes} 分 {seconds} 秒",
  "command.exportKeepFigures": "导出当前 Markdown 到 Word（保持图片位置）",
  "command.exportReflowFigures":
    "导出当前 Markdown 到 Word（自动回填图片分页空白）",
  "command.reapplyBlueCitations": "恢复导出 Word 中的蓝色 Zotero 引文",
  "command.installRuntime": "安装或修复 Word 导出运行时",
  "command.checkRuntime": "检查 Word 导出运行时",
  "settings.title": "MD Export Word",
  "settings.language.name": "界面语言 / Interface language",
  "settings.language.desc": "切换插件界面、命令和进度提示的语言。",
  "settings.language.system": "跟随 Obsidian",
  "settings.language.zhCN": "简体中文",
  "settings.language.en": "English",
  "settings.repository.name": "运行时发布仓库",
  "settings.repository.desc":
    "通常由正式 Release 自动写入；仅在自建分支或私有仓库中需要修改。",
  "settings.repository.placeholder": "owner/obsidian-md-export-word",
  "settings.autoOpen.name": "导出成功后自动打开 Word",
  "settings.autoOpen.desc":
    "默认开启；只有导出和自动自检均成功时才会打开生成的 .docx。",
  "settings.runtimePlatform.name": "运行时平台",
  "settings.runtimePlatform.desc":
    "默认自动识别；仅在 Apple Silicon Mac 需要用 Rosetta 运行 Intel 二进制时手动调整。",
  "settings.runtimePlatform.auto": "自动检测（{target}）",
  "settings.runtime.name": "Word 导出运行时",
  "settings.runtime.installingDesc":
    "正在安装运行时。当前任务完成前无需重复操作。",
  "settings.runtime.installing": "正在安装...",
  "settings.runtime.installOrRepair": "安装或修复",
  "settings.runtime.doctor": "环境自检",
  "exportMode.title": "选择 Markdown → Word 导出模式",
  "exportMode.desc":
    "源 Markdown 不会被修改。请选择本次对 Zotero 缺失引用的处理方式。",
  "exportMode.strict.name": "严格模式",
  "exportMode.strict.desc":
    "用于自己的论文：Zotero 缺少任一 citekey 就停止导出。",
  "exportMode.strict.action": "使用严格模式",
  "exportMode.compatible.name": "兼容模式",
  "exportMode.compatible.desc":
    "用于外来 Markdown：缺失 citekey 保留为红字黄底占位符，并写入日志。",
  "exportMode.compatible.action": "使用兼容模式",
  "wordSelect.title": "恢复 Word 中的蓝色 Zotero 引文",
  "wordSelect.desc":
    "请先在 Word 中完成 Zotero Refresh 并保存文档，最好关闭该文档。程序会生成新副本，不覆盖源 Word；正文引文设为蓝色，文末参考文献保持黑色。",
  "wordSelect.file.name": "选择 Word 文件",
  "wordSelect.file.desc":
    "列出当前 Markdown 所在文件夹中的 .docx，最近修改的排在最前。",
  "wordSelect.action": "生成蓝色引文副本",
  "format.title": "设置 Word 导出格式",
  "format.intro": "不修改任何选项时使用当前期刊模板（{summary}）。",
  "format.defaultValue": "默认：{value}",
  "format.figureFlow.name": "图片分页方式",
  "format.figureFlow.desc":
    "默认保持 Markdown 中的图片位置和图文顺序；只有选择自动回填时，才会把图片后同一小节的连续正文提前，以减少大图换页前的空白。",
  "format.figureFlow.keep": "保持图片原位（默认）",
  "format.figureFlow.reflow": "自动回填分页空白",
  "format.outputName.name": "Word 文件名",
  "format.outputName.desc":
    "默认读取 Markdown 的文章一级标题；可直接修改，无需输入 .docx；同名文件自动添加时间戳。",
  "format.outputName.placeholder": "请输入 Word 文件名",
  "format.outputName.empty": "Word 文件名不能为空。",
  "format.outputName.invalidCharacters":
    "Word 文件名不能包含 < > : \" / \\ | ? * 等字符。",
  "format.outputName.trailingCharacter":
    "Word 文件名不能以句点或空格结尾。",
  "format.outputName.reserved": "“{name}”是 Windows 保留文件名，请更换。",
  "format.defaultOutputName": "导出文档",
  "format.preset.name": "格式方案",
  "format.preset.desc": "可调用之前保存的毕业论文或其他期刊方案。",
  "format.preset.default": "当前期刊模板（默认）",
  "format.preset.defaultName": "当前期刊模板",
  "format.preset.customName": "本次自定义",
  "format.template.name": "参考 Word 模板",
  "format.template.default": "默认：{file}",
  "format.section.body": "正文与字体",
  "format.eastAsiaFont.name": "中文字体",
  "format.eastAsiaFont.default": "默认：{font}",
  "format.westernFont.name": "英文和数字字体",
  "format.westernFont.default": "默认：{font}",
  "format.bodySize.name": "正文字号",
  "format.bodyLineSpacing.name": "正文行距",
  "format.bodyIndent.name": "正文首行缩进",
  "format.section.headings": "题目与标题",
  "format.titleSize.name": "文章题目字号（Markdown #）",
  "format.titleLineSpacing.name": "文章题目行距",
  "format.heading2Size.name": "一级节标题字号（Markdown ##）",
  "format.heading3Size.name": "二级节标题字号（Markdown ###）",
  "format.heading4Size.name": "三级节标题字号（Markdown ####）",
  "format.headingLineSpacing.name": "节标题行距",
  "format.section.tablesCaptionsNotes": "表格、图表题与注释",
  "format.tableSize.name": "表格字号（含表内公式）",
  "format.tableLineSpacing.name": "表格行距",
  "format.captionSize.name": "图名、表名字号",
  "format.captionLineSpacing.name": "图名、表名行距",
  "format.noteSize.name": "图注、表注字号",
  "format.noteLineSpacing.name": "图注、表注行距",
  "format.formulaSize.name": "正文公式字号",
  "format.section.page": "页面",
  "format.margin.name": "A4 页边距",
  "format.saveName.name": "方案名称（可选）",
  "format.saveName.desc":
    "填写后可保存为“毕业论文”“某期刊”等方案。",
  "format.saveName.placeholder": "例如：毕业论文",
  "format.saveName.required":
    "请先填写格式方案名称，例如“毕业论文”或期刊名称。",
  "format.action.useDefault": "使用默认模板",
  "format.action.saveAndExport": "保存方案并导出",
  "format.action.export": "按当前设置导出",
  "format.summary":
    "中文 {eastAsiaFont}；英文/数字 {westernFont}；正文 {bodySize} pt、{bodyLineSpacing} 倍行距、首行 {bodyIndent} 字；表格 {tableSize} pt、{tableLineSpacing} 倍行距；图表题 {captionSize} pt；图表注 {noteSize} pt；A4 四边 {margin} cm；图片分页回填 {figureReflow}",
  "format.option.size.7_5": "六号（7.5 pt）",
  "format.option.size.9": "小五（9 pt）",
  "format.option.size.10_5": "五号（10.5 pt）",
  "format.option.size.12": "小四（12 pt）",
  "format.option.size.14": "四号（14 pt）",
  "format.option.size.15": "小三（15 pt）",
  "format.option.size.16": "三号（16 pt）",
  "format.option.size.18": "小二（18 pt）",
  "format.option.size.22": "二号（22 pt）",
  "format.option.line.1": "单倍行距",
  "format.option.line.1_25": "1.25 倍行距",
  "format.option.line.1_5": "1.5 倍行距",
  "format.option.line.1_75": "1.75 倍行距",
  "format.option.line.2": "2 倍行距",
  "format.option.indent.0": "不缩进",
  "format.option.indent.1": "首行缩进 1 字",
  "format.option.indent.2": "首行缩进 2 字",
  "format.option.margin.2": "四边 2.00 cm",
  "format.option.margin.2_2": "四边 2.20 cm",
  "format.option.margin.2_54": "四边 2.54 cm",
  "format.option.margin.3": "四边 3.00 cm",
  "progressModal.export.title": "正在导出 Word",
  "progressModal.export.success": "导出完成",
  "progressModal.export.failure": "导出失败",
  "progressModal.recolor.title": "正在恢复 Zotero 引文颜色",
  "progressModal.recolor.success": "引文着色完成",
  "progressModal.recolor.failure": "引文着色失败",
  "progressModal.starting": "准备启动导出程序…",
  "progressModal.processing": "正在处理…",
  "progressModal.liveProcess": "实时过程",
  "progressModal.processAria": "Word 导出实时过程，可选择并复制",
  "progressModal.copyCurrent": "复制当前过程",
  "progressModal.hide": "隐藏窗口",
  "progressModal.noLog": "当前没有可复制的日志内容。",
  "progressModal.copyRejected": "系统拒绝复制操作",
  "progressModal.copyFailed": "复制失败：{message}",
  "progressModal.failureLogCopied": "错误日志已复制到剪贴板。",
  "progressModal.processCopied": "当前导出过程已复制。",
  "progressModal.logNotFound": "未找到错误日志文件。",
  "progressModal.openLogFailed": "无法打开错误日志：{message}",
  "progressModal.copyProcess": "复制过程",
  "progressModal.doneAndClose": "完成并关闭",
  "progressModal.errorLog": "错误日志：{path}",
  "progressModal.copyErrorLog": "复制错误日志",
  "progressModal.openLog": "打开日志文件",
  "progressModal.parseEventFailed": "无法解析进度事件：{message}",
  "repositoryModal.title": "设置运行时仓库",
  "repositoryModal.desc":
    "插件需要从同版本 GitHub Release 下载当前系统运行时。粘贴你在 BRAT 中添加的仓库地址。",
  "repositoryModal.name": "GitHub 仓库",
  "repositoryModal.format": "格式：owner/repository",
  "runtime.compatibility.unsupported": "尚不支持 {platform}/{arch}。",
  "runtime.compatibility.platformMismatch":
    "所选 {target} 与当前系统 {platform}/{arch} 不一致。",
  "runtime.compatibility.archMismatch":
    "所选 {target} 与当前 CPU 架构 {arch} 不兼容。",
  "runtime.status.noLocalFs": "当前知识库不是本地文件系统。",
  "runtime.status.incomplete":
    "{target} 运行时未安装或不完整（缺少 {count} 个文件）。",
  "runtime.status.versionMismatch":
    "运行时版本 {runtimeVersion} 与插件版本 {pluginVersion} 不一致。",
  "runtime.status.platformMismatch":
    "已安装运行时为 {installed}，当前需要 {required}。",
  "runtime.status.installed": "已安装 {target} 运行时 {version}。",
  "runtime.status.manifestDamaged": "运行时清单损坏：{message}",
  "runtime.install.duplicate":
    "Word 导出运行时正在安装，请等待当前任务完成，无需重复点击。",
  "runtime.install.cannotInstall": "无法安装运行时：{message}",
  "runtime.install.noLocalFs":
    "当前知识库不是本地文件系统，无法安装运行时。",
  "runtime.install.cancelled": "已取消运行时安装。",
  "runtime.install.invalidRepository":
    "GitHub 仓库格式不正确，应为 owner/repository。",
  "runtime.install.saveRepositoryFailed":
    "无法保存运行时仓库设置：{message}",
  "runtime.install.stage.prepare": "准备安装运行时",
  "runtime.install.stage.download":
    "正在下载 {target} Word 导出运行时 {version}",
  "runtime.install.detail.download":
    "安装包约 {size}，GitHub 网络较慢时可能需要数分钟。",
  "runtime.install.progress": "{stage}\n已用时 {elapsed}。{detail}",
  "runtime.install.timeout":
    "下载请求未在 {seconds} 秒内完成，已停止等待。请检查 GitHub 网络后重试。",
  "runtime.install.httpError":
    "GitHub Release 返回 HTTP {status}，请确认 {version} 已发布且包含 {asset}",
  "runtime.install.stage.validateDownload": "正在校验下载内容",
  "runtime.install.detail.validateDownload":
    "正在确认 ZIP 格式、本地写入大小和 SHA-256。",
  "runtime.install.archiveMissing":
    "运行时 ZIP 在解压前丢失或大小发生变化",
  "runtime.install.stage.extract": "下载完成（{size}），正在解压",
  "runtime.install.detail.extract": "请保持 Obsidian 运行。",
  "runtime.install.extractFailed": "解压运行时失败：{code}",
  "runtime.install.stage.validatePackage": "正在校验运行时包",
  "runtime.install.detail.validatePackage":
    "正在检查版本和 CPU 平台。",
  "runtime.install.manifestMissing":
    "运行时包缺少 runtime/runtime-manifest.json",
  "runtime.install.packageMismatch":
    "运行时包不匹配：版本 {version}，平台 {platform}",
  "runtime.install.stage.replace": "正在替换旧运行时",
  "runtime.install.detail.replace":
    "原运行时会先备份，失败时自动恢复。",
  "runtime.install.stage.configurePython": "正在配置私有 Python 环境",
  "runtime.install.detail.configurePython":
    "首次创建虚拟环境或访问 PyPI 时可能需要几分钟。",
  "runtime.install.pythonFailed": "Python 环境安装失败：{code}",
  "runtime.install.stage.doctor": "正在执行最终环境自检",
  "runtime.install.detail.doctor": "即将完成安装。",
  "runtime.install.complete": "Word 导出运行时安装完成：{status}",
  "runtime.install.backupMissing": "旧运行时备份不存在",
  "runtime.install.restoreFailed":
    "自动恢复旧运行时失败：{message}",
  "runtime.install.networkHint":
    "请确认浏览器能打开该版本的 GitHub Release，网络恢复后重试。",
  "runtime.install.retryHint":
    "请重新执行“安装或修复”；若仍失败，运行环境自检并查看故障排查文档。",
  "runtime.install.backupRetained": "旧运行时备份保留在：{path}。",
  "runtime.install.cleanupIncomplete":
    "自动清理失败的新运行时未完成，请完全退出 Obsidian 后再修复。",
  "runtime.install.failed":
    "运行时安装失败（{stage}）：{message}。{hint}{recovery}",
  "runtime.install.cleanupFailed":
    "运行时安装已结束，但临时目录清理失败：{message}",
  "runtime.install.lockCleanupFailed":
    "运行时安装锁清理失败：{message}",
  "runtime.install.busy":
    "检测到另一个运行时安装任务仍在执行，请等待其完成后再试",
  "runtime.install.archiveEmpty": "下载文件为空或不完整",
  "runtime.install.archiveNotZip":
    "GitHub 返回的内容不是 ZIP，可能被网络代理或登录页面替换",
  "runtime.install.archiveWriteIncomplete":
    "运行时 ZIP 写入不完整：应为 {expected} 字节，实际为 {actual} 字节",
  "runtime.doctor.notReady": "环境自检未通过：{status}",
  "runtime.doctor.missing":
    "跨平台环境自检程序不存在，请先安装或修复运行时。",
  "runtime.doctor.passed": "环境自检通过：{summary}",
  "runtime.doctor.failed": "环境自检失败：{summary}",
  "runtimeDownload.title": "下载 Word 导出运行时",
  "runtimeDownload.language": "界面语言 / Interface language",
  "runtimeDownload.elapsed": "已用时 {elapsed}",
  "runtimeDownload.preparing": "正在准备下载",
  "runtimeDownload.checksum": "正在获取 SHA-256 校验值",
  "runtimeDownload.downloading": "正在下载 {file}",
  "runtimeDownload.progressKnown":
    "{downloaded} / {total} · {percent}% · {speed} · 预计剩余 {eta}",
  "runtimeDownload.progressKnownCalculating":
    "{downloaded} / {total} · {percent}% · {speed} · 正在估算剩余时间",
  "runtimeDownload.progressUnknown":
    "已下载 {downloaded} · {speed} · 正在估算剩余时间",
  "runtimeDownload.verifying": "正在验证 SHA-256",
  "runtimeDownload.cancel": "取消下载",
  "runtimeDownload.retry": "重试",
  "runtimeDownload.hide": "后台继续",
  "runtimeDownload.retrying":
    "临时网络错误，正在进行第 {attempt}/{max} 次下载尝试…",
  "runtimeDownload.cancelled": "下载已取消。",
  "runtimeDownload.failed": "下载失败：{message}",
  "runtimeDownload.networkError":
    "与 GitHub 的连接中断，请检查网络或代理后重试。",
  "runtimeDownload.checksumError":
    "无法读取当前运行时资产的有效 SHA-256 校验值。",
  "runtimeDownload.fileError": "无法写入运行时临时下载文件。",
  "runtimeDownload.partExists":
    "检测到上次遗留的临时下载文件，请重启 Obsidian 后重试。",
  "runtimeDownload.responseIncomplete": "下载提前结束，收到的字节数不完整。",
  "runtimeDownload.unknownError": "运行时下载未完成。",
  "runtimeDownload.shaMismatch":
    "SHA-256 校验失败，下载内容可能不完整或已被替换。",
  "runtimeDownload.shaPassed": "SHA-256 校验通过。",
  "runtimeDownload.complete": "下载完成，正在继续安装。",
  "recolor.noLocalFs": "当前知识库不是本地文件系统，无法处理 Word。",
  "recolor.runtimeUnavailable": "运行时仍不可用：{status}",
  "recolor.toolMissing":
    "未找到 Zotero 引文着色程序，请安装或修复运行时。",
  "recolor.readFolderFailed": "无法读取当前文件夹中的 Word：{message}",
  "recolor.noFiles":
    "当前 Markdown 所在文件夹中没有可处理的 .docx 文件。",
  "recolor.cancelled": "已取消 Zotero 引文着色。",
  "recolor.fileMissing": "所选 Word 已不存在：{path}",
  "recolor.launchStage": "启动引文着色程序",
  "recolor.launchDetail": "源 Word 不覆盖；Zotero 域保持可刷新",
  "recolor.launchFailed": "启动引文着色失败：{message}",
  "recolor.completed": "Zotero 引文已恢复为蓝色：{file}",
  "recolor.failedWithDetails": "引文着色失败（{code}）：{details}",
  "recolor.failedWithCode": "引文着色失败，退出代码 {code}。",
  "recolor.running": "正在生成蓝色引文副本：{file}",
  "export.cancelled": "已取消 Word 导出。",
  "export.noLocalFs":
    "当前知识库不是本地文件系统，无法启动本地导出程序。",
  "export.readMarkdownFailed": "无法读取当前 Markdown：{message}",
  "export.runtimeUnavailable": "运行时仍不可用：{status}",
  "export.templateDirectoryFailed": "无法创建用户模板目录。",
  "export.pythonMissing":
    "未找到当前系统的 Python 导出程序，请安装或修复运行时。",
  "export.readTemplatesFailed": "无法读取 Word 模板目录：{message}",
  "export.noTemplates": "Word 模板目录中没有 .docx 文件：{path}",
  "export.templateMissing": "未找到所选 Word 模板：{path}",
  "export.presetSaved": "已保存格式方案：{name}",
  "export.outputRenamed":
    "同名 Word 已存在，原文件保持不变；本次另存为：{file}",
  "export.launchStage": "启动导出程序",
  "export.launchDetail": "{mode} · {format}",
  "export.launchFailed": "启动 Word 导出失败：{message}",
  "export.completed": "Word 导出完成：{file}",
  "export.failedWithDetails": "Word 导出失败（{code}）：{details}",
  "export.failedWithCode": "Word 导出失败，退出代码 {code}。",
  "export.running": "正在导出（{mode}｜{format}）：{file}",
  "export.mode.strict": "严格模式",
  "export.mode.compatible": "兼容模式",
  "progress.export.init": "初始化导出环境",
  "progress.export.readMarkdown": "读取 Markdown",
  "progress.export.normalizeMarkdown": "规范化 Markdown",
  "progress.export.normalizeMarkdownDetail":
    "标题、图片、引用间距与公式标签",
  "progress.export.parseDocument": "解析文档结构",
  "progress.export.parseDocumentDetail":
    "扫描图片、表格、公式和引用",
  "progress.export.checkResources": "检查文档资源",
  "progress.export.checkResourcesDetail":
    "图片 {images}；表格 {tables}；公式 {equations}",
  "progress.export.checkCitations": "检查 Zotero 引用",
  "progress.export.checkCitationsDetail": "citekey {count}",
  "progress.export.preflight": "预检完成",
  "progress.export.preflightDetail":
    "模式 {mode}；缺失 citekey {missing}",
  "progress.export.generateDraft": "生成 Word 初稿",
  "progress.export.generateDraftDetail":
    "运行 Pandoc 与 pandoc-crossref",
  "progress.export.draftReady": "Word 初稿已生成",
  "progress.export.formatDocument": "处理 Word 格式",
  "progress.export.formatDocumentDetail":
    "字体、上下标、公式、图表和 Zotero 域",
  "progress.export.validateDocument": "自动检查 Word",
  "progress.export.validateDocumentDetail":
    "图片分页回填 {reflowed} 处；结构、编号、引用域与格式均已检查",
  "progress.export.verifySource": "确认源文件",
  "progress.export.verifySourceDetail":
    "检查导出期间 Markdown 是否发生变化",
  "progress.export.openWord": "正在打开 Word",
  "progress.export.complete": "导出完成",
  "progress.export.failed": "导出失败",
  "progress.export.cancelled": "已取消",
  "progress.export.cancelledDetail": "用户中止导出",
  "progress.recolor.init": "初始化引文着色",
  "progress.recolor.readWord": "读取 Word",
  "progress.recolor.detectFields": "识别 Zotero 域",
  "progress.recolor.detectFieldsDetail": "正文引文与文末参考文献",
  "progress.recolor.checkColors": "检查引文颜色",
  "progress.recolor.checkColorsDetail":
    "正文引文域 {citations}；参考文献域 {bibliography}",
  "progress.recolor.openWord": "正在打开 Word",
  "progress.recolor.complete": "引文着色完成",
  "progress.recolor.failed": "引文着色失败",
  "progress.recolor.cancelled": "已取消",
  "progress.recolor.cancelledDetail": "用户中止引文着色"
} as const;

export type TranslationKey = keyof typeof zhCN;
