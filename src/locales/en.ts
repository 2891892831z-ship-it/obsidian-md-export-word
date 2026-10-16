import type { TranslationKey } from "./zh-cn";

export const en: Record<TranslationKey, string> = {
  "common.cancel": "Cancel",
  "common.continue": "Continue",
  "common.close": "Close",
  "common.unknown": "Unknown",
  "common.enabled": "On",
  "common.disabled": "Off",
  "common.default": "Default",
  "common.savedValue": "{value} (saved value)",
  "common.errorWithMessage": "{action}: {message}",
  "duration.seconds": "{seconds} sec",
  "duration.minutesSeconds": "{minutes} min {seconds} sec",
  "command.exportKeepFigures":
    "Export current Markdown to Word (keep figure positions)",
  "command.exportReflowFigures":
    "Export current Markdown to Word (auto-fill figure page gaps)",
  "command.reapplyBlueCitations":
    "Reapply blue Zotero citations to exported Word",
  "command.installRuntime": "Install or repair Word export runtime",
  "command.checkRuntime": "Check Word export runtime",
  "settings.title": "MD Export Word",
  "settings.language.name": "Interface language / 界面语言",
  "settings.language.desc":
    "Change the language used by the plugin interface, commands, and progress messages.",
  "settings.language.system": "Follow Obsidian",
  "settings.language.zhCN": "简体中文",
  "settings.language.en": "English",
  "settings.repository.name": "Runtime release repository",
  "settings.repository.desc":
    "Normally stamped by an official release. Change this only for a fork or private repository.",
  "settings.repository.placeholder": "owner/obsidian-md-export-word",
  "settings.autoOpen.name": "Open Word after a successful export",
  "settings.autoOpen.desc":
    "Enabled by default. The generated .docx opens only after export and automatic checks both succeed.",
  "settings.runtimePlatform.name": "Runtime platform",
  "settings.runtimePlatform.desc":
    "Detected automatically. Change this only when an Apple Silicon Mac must run Intel binaries through Rosetta.",
  "settings.runtimePlatform.auto": "Auto-detect ({target})",
  "settings.runtime.name": "Word export runtime",
  "settings.runtime.installingDesc":
    "The runtime is being installed. No further action is needed until this task finishes.",
  "settings.runtime.installing": "Installing...",
  "settings.runtime.installOrRepair": "Install or repair",
  "settings.runtime.doctor": "Run diagnostics",
  "exportMode.title": "Choose a Markdown → Word export mode",
  "exportMode.desc":
    "The source Markdown will not be changed. Choose how missing Zotero citations should be handled.",
  "exportMode.strict.name": "Strict mode",
  "exportMode.strict.desc":
    "For your own manuscripts: stop the export if Zotero cannot find any citekey.",
  "exportMode.strict.action": "Use strict mode",
  "exportMode.compatible.name": "Compatible mode",
  "exportMode.compatible.desc":
    "For imported Markdown: keep missing citekeys as red, yellow-highlighted placeholders and write them to the log.",
  "exportMode.compatible.action": "Use compatible mode",
  "wordSelect.title": "Restore blue Zotero citations in Word",
  "wordSelect.desc":
    "Refresh Zotero fields in Word and save the document first, preferably with the document closed. A new copy will be created without overwriting the source. In-text citations become blue while the bibliography remains black.",
  "wordSelect.file.name": "Choose a Word file",
  "wordSelect.file.desc":
    "Lists .docx files beside the current Markdown file, with the most recently modified first.",
  "wordSelect.action": "Create blue-citation copy",
  "format.title": "Configure Word export formatting",
  "format.intro":
    "If no options are changed, the current journal template is used ({summary}).",
  "format.defaultValue": "Default: {value}",
  "format.figureFlow.name": "Figure pagination",
  "format.figureFlow.desc":
    "By default, figures and text remain in Markdown order. Auto-fill may move consecutive paragraphs from the same section ahead of a figure to reduce blank space before a page break.",
  "format.figureFlow.keep": "Keep figure positions (default)",
  "format.figureFlow.reflow": "Auto-fill page gaps",
  "format.outputName.name": "Word file name",
  "format.outputName.desc":
    "Defaults to the first-level article heading in Markdown. You can edit it without adding .docx; a timestamp is added if the name already exists.",
  "format.outputName.placeholder": "Enter a Word file name",
  "format.outputName.empty": "The Word file name cannot be empty.",
  "format.outputName.invalidCharacters":
    "The Word file name cannot contain < > : \" / \\ | ? * or control characters.",
  "format.outputName.trailingCharacter":
    "The Word file name cannot end with a period or space.",
  "format.outputName.reserved":
    "\"{name}\" is a reserved Windows file name. Choose another name.",
  "format.defaultOutputName": "Exported document",
  "format.preset.name": "Formatting preset",
  "format.preset.desc":
    "Reuse a previously saved thesis, journal, or other formatting preset.",
  "format.preset.default": "Current journal template (default)",
  "format.preset.defaultName": "Current journal template",
  "format.preset.customName": "Custom for this export",
  "format.template.name": "Reference Word template",
  "format.template.default": "Default: {file}",
  "format.section.body": "Body text and fonts",
  "format.eastAsiaFont.name": "East Asian font",
  "format.eastAsiaFont.default": "Default: {font}",
  "format.westernFont.name": "Latin and numeric font",
  "format.westernFont.default": "Default: {font}",
  "format.bodySize.name": "Body font size",
  "format.bodyLineSpacing.name": "Body line spacing",
  "format.bodyIndent.name": "Body first-line indent",
  "format.documentLanguage.name": "Manuscript language",
  "format.documentLanguage.desc": "Defaults to the note's lang. English uses a two-halfwidth-character indent (1 em) and Times New Roman; Chinese uses two fullwidth characters (2 em). Body text is justified; settings remain editable.",
  "format.documentLanguage.zhCN": "Chinese",
  "format.documentLanguage.en": "English",
  "format.section.headings": "Title and headings",
  "format.titleSize.name": "Article title size (Markdown #)",
  "format.titleLineSpacing.name": "Article title line spacing",
  "format.heading2Size.name":
    "Level 1 section heading size (Markdown ##)",
  "format.heading3Size.name":
    "Level 2 section heading size (Markdown ###)",
  "format.heading4Size.name":
    "Level 3 section heading size (Markdown ####)",
  "format.headingLineSpacing.name": "Section heading line spacing",
  "format.section.tablesCaptionsNotes": "Tables, captions, and notes",
  "format.tableSize.name": "Table font size (including formulas)",
  "format.tableLineSpacing.name": "Table line spacing",
  "format.captionSize.name": "Figure and table caption size",
  "format.captionLineSpacing.name":
    "Figure and table caption line spacing",
  "format.noteSize.name": "Figure and table note size",
  "format.noteLineSpacing.name": "Figure and table note line spacing",
  "format.formulaSize.name": "Body formula size",
  "format.section.page": "Page",
  "format.margin.name": "A4 margins",
  "format.saveName.name": "Preset name (optional)",
  "format.saveName.desc":
    "Enter a name to save these settings as a thesis, journal, or other preset.",
  "format.saveName.placeholder": "For example: Thesis",
  "format.saveName.required":
    "Enter a preset name, such as a thesis or journal name.",
  "format.action.useDefault": "Use default template",
  "format.action.saveAndExport": "Save preset and export",
  "format.action.export": "Export with current settings",
  "format.summary":
    "East Asian font {eastAsiaFont}; Latin/numeric font {westernFont}; body {bodySize} pt, {bodyLineSpacing} line spacing, {bodyIndent}-character first-line indent; tables {tableSize} pt, {tableLineSpacing} line spacing; captions {captionSize} pt; notes {noteSize} pt; A4 margins {margin} cm; figure gap fill {figureReflow}",
  "format.option.size.7_5": "7.5 pt",
  "format.option.size.9": "9 pt",
  "format.option.size.10_5": "10.5 pt",
  "format.option.size.12": "12 pt",
  "format.option.size.14": "14 pt",
  "format.option.size.15": "15 pt",
  "format.option.size.16": "16 pt",
  "format.option.size.18": "18 pt",
  "format.option.size.22": "22 pt",
  "format.option.line.1": "Single",
  "format.option.line.1_25": "1.25",
  "format.option.line.1_5": "1.5",
  "format.option.line.1_75": "1.75",
  "format.option.line.2": "Double",
  "format.option.indent.0": "No indent",
  "format.option.indent.1": "1-character first-line indent",
  "format.option.indent.2": "2-character first-line indent",
  "format.option.margin.2": "2.00 cm on all sides",
  "format.option.margin.2_2": "2.20 cm on all sides",
  "format.option.margin.2_54": "2.54 cm on all sides",
  "format.option.margin.3": "3.00 cm on all sides",
  "progressModal.export.title": "Exporting Word",
  "progressModal.export.success": "Export complete",
  "progressModal.export.failure": "Export failed",
  "progressModal.recolor.title": "Restoring Zotero citation colors",
  "progressModal.recolor.success": "Citation coloring complete",
  "progressModal.recolor.failure": "Citation coloring failed",
  "progressModal.starting": "Preparing to start the exporter...",
  "progressModal.processing": "Processing...",
  "progressModal.liveProcess": "Live process",
  "progressModal.processAria":
    "Live Word export process; text can be selected and copied",
  "progressModal.copyCurrent": "Copy current process",
  "progressModal.hide": "Hide window",
  "progressModal.noLog": "There is no process log to copy.",
  "progressModal.copyRejected": "The system rejected the copy operation",
  "progressModal.copyFailed": "Copy failed: {message}",
  "progressModal.failureLogCopied":
    "The failure log was copied to the clipboard.",
  "progressModal.processCopied":
    "The current export process was copied.",
  "progressModal.logNotFound": "The failure log file was not found.",
  "progressModal.openLogFailed":
    "Could not open the failure log: {message}",
  "progressModal.copyProcess": "Copy process",
  "progressModal.doneAndClose": "Done and close",
  "progressModal.errorLog": "Failure log: {path}",
  "progressModal.copyErrorLog": "Copy failure log",
  "progressModal.openLog": "Open log file",
  "progressModal.parseEventFailed":
    "Could not parse the progress event: {message}",
  "repositoryModal.title": "Set runtime repository",
  "repositoryModal.desc":
    "The plugin downloads the matching system runtime from the same-version GitHub Release. Enter the repository added to BRAT.",
  "repositoryModal.name": "GitHub repository",
  "repositoryModal.format": "Format: owner/repository",
  "runtime.compatibility.unsupported": "{platform}/{arch} is not supported.",
  "runtime.compatibility.platformMismatch":
    "The selected {target} runtime does not match the current system ({platform}/{arch}).",
  "runtime.compatibility.archMismatch":
    "The selected {target} runtime is incompatible with the current CPU architecture ({arch}).",
  "runtime.status.noLocalFs": "This vault is not on a local file system.",
  "runtime.status.incomplete":
    "The {target} runtime is not installed or is incomplete ({count} files missing).",
  "runtime.status.versionMismatch":
    "Runtime version {runtimeVersion} does not match plugin version {pluginVersion}.",
  "runtime.status.platformMismatch":
    "The installed runtime is {installed}; {required} is required.",
  "runtime.status.installed": "{target} runtime {version} is installed.",
  "runtime.status.manifestDamaged":
    "The runtime manifest is invalid: {message}",
  "runtime.install.duplicate":
    "The Word export runtime is already being installed. Wait for the current task; no additional click is needed.",
  "runtime.install.cannotInstall": "Cannot install the runtime: {message}",
  "runtime.install.noLocalFs":
    "The runtime cannot be installed because this vault is not on a local file system.",
  "runtime.install.cancelled": "Runtime installation was cancelled.",
  "runtime.install.invalidRepository":
    "The GitHub repository must use the owner/repository format.",
  "runtime.install.saveRepositoryFailed":
    "Could not save the runtime repository setting: {message}",
  "runtime.install.stage.prepare": "Preparing runtime installation",
  "runtime.install.stage.download":
    "Downloading the {target} Word export runtime {version}",
  "runtime.install.detail.download":
    "The package is about {size}. A slow GitHub connection may take several minutes.",
  "runtime.install.progress": "{stage}\nElapsed: {elapsed}. {detail}",
  "runtime.install.timeout":
    "The download request did not complete within {seconds} seconds and stopped. Check GitHub connectivity and retry.",
  "runtime.install.httpError":
    "GitHub Release returned HTTP {status}. Confirm that {version} is published and includes {asset}.",
  "runtime.install.stage.validateDownload": "Validating the download",
  "runtime.install.detail.validateDownload":
    "Checking the ZIP format, locally written size, and SHA-256.",
  "runtime.install.archiveMissing":
    "The runtime ZIP disappeared or changed size before extraction",
  "runtime.install.stage.extract":
    "Download complete ({size}); extracting",
  "runtime.install.detail.extract": "Keep Obsidian running.",
  "runtime.install.extractFailed": "Runtime extraction failed: {code}",
  "runtime.install.stage.validatePackage":
    "Validating the runtime package",
  "runtime.install.detail.validatePackage":
    "Checking the version and CPU platform.",
  "runtime.install.manifestMissing":
    "The runtime package is missing runtime/runtime-manifest.json",
  "runtime.install.packageMismatch":
    "Runtime package mismatch: version {version}, platform {platform}",
  "runtime.install.stage.replace": "Replacing the old runtime",
  "runtime.install.detail.replace":
    "The old runtime is backed up first and restored automatically if installation fails.",
  "runtime.install.stage.configurePython":
    "Configuring the private Python environment",
  "runtime.install.detail.configurePython":
    "Creating the virtual environment or accessing PyPI for the first time may take several minutes.",
  "runtime.install.pythonFailed":
    "Python environment setup failed: {code}",
  "runtime.install.stage.doctor":
    "Running final environment diagnostics",
  "runtime.install.detail.doctor": "Installation is almost complete.",
  "runtime.install.complete":
    "Word export runtime installation complete: {status}",
  "runtime.install.backupMissing": "The old runtime backup is missing",
  "runtime.install.restoreFailed":
    "Automatic restoration of the old runtime failed: {message}",
  "runtime.install.networkHint":
    "Confirm that a browser can open this version's GitHub Release, then retry after connectivity returns.",
  "runtime.install.retryHint":
    "Run \"Install or repair\" again. If it still fails, run diagnostics and read the troubleshooting guide.",
  "runtime.install.backupRetained":
    "The old runtime backup was retained at: {path}.",
  "runtime.install.cleanupIncomplete":
    "The failed new runtime could not be cleaned up. Quit Obsidian completely before repairing it.",
  "runtime.install.failed":
    "Runtime installation failed during {stage}: {message}. {hint}{recovery}",
  "runtime.install.cleanupFailed":
    "Runtime installation ended, but its temporary directory could not be removed: {message}",
  "runtime.install.lockCleanupFailed":
    "The runtime installation lock could not be removed: {message}",
  "runtime.install.busy":
    "Another runtime installation is still running. Wait for it to finish and try again.",
  "runtime.install.archiveEmpty":
    "The downloaded file is empty or incomplete",
  "runtime.install.archiveNotZip":
    "GitHub returned content that is not a ZIP file. A proxy or sign-in page may have replaced the download.",
  "runtime.install.archiveWriteIncomplete":
    "The runtime ZIP was not written completely: expected {expected} bytes, wrote {actual} bytes",
  "runtime.doctor.notReady": "Environment diagnostics failed: {status}",
  "runtime.doctor.missing":
    "The cross-platform diagnostics program is missing. Install or repair the runtime first.",
  "runtime.doctor.passed": "Environment diagnostics passed: {summary}",
  "runtime.doctor.failed": "Environment diagnostics failed: {summary}",
  "runtimeDownload.title": "Download Word export runtime",
  "runtimeDownload.language": "Interface language / 界面语言",
  "runtimeDownload.elapsed": "Elapsed: {elapsed}",
  "runtimeDownload.preparing": "Preparing the download",
  "runtimeDownload.checksum": "Fetching the SHA-256 checksum",
  "runtimeDownload.downloading": "Downloading {file}",
  "runtimeDownload.progressKnown":
    "{downloaded} / {total} · {percent}% · {speed} · about {eta} remaining",
  "runtimeDownload.progressKnownCalculating":
    "{downloaded} / {total} · {percent}% · {speed} · estimating remaining time",
  "runtimeDownload.progressUnknown":
    "Downloaded {downloaded} · {speed} · estimating remaining time",
  "runtimeDownload.verifying": "Verifying SHA-256",
  "runtimeDownload.cancel": "Cancel download",
  "runtimeDownload.retry": "Retry",
  "runtimeDownload.hide": "Continue in background",
  "runtimeDownload.retrying":
    "Temporary network error. Starting download attempt {attempt}/{max}…",
  "runtimeDownload.cancelled": "The download was cancelled.",
  "runtimeDownload.failed": "Download failed: {message}",
  "runtimeDownload.networkError":
    "The GitHub connection was interrupted. Check the network or proxy and retry.",
  "runtimeDownload.checksumError":
    "A valid SHA-256 checksum for this runtime asset could not be read.",
  "runtimeDownload.fileError":
    "The runtime temporary download file could not be written.",
  "runtimeDownload.partExists":
    "A temporary file from an earlier download remains. Restart Obsidian and retry.",
  "runtimeDownload.responseIncomplete":
    "The download ended before all expected bytes arrived.",
  "runtimeDownload.unknownError": "The runtime download did not complete.",
  "runtimeDownload.shaMismatch":
    "SHA-256 verification failed. The download may be incomplete or replaced.",
  "runtimeDownload.shaPassed": "SHA-256 verification passed.",
  "runtimeDownload.complete":
    "Download complete. Continuing installation.",
  "recolor.noLocalFs":
    "Word files cannot be processed because this vault is not on a local file system.",
  "recolor.runtimeUnavailable": "The runtime is still unavailable: {status}",
  "recolor.toolMissing":
    "The Zotero citation coloring tool is missing. Install or repair the runtime.",
  "recolor.readFolderFailed":
    "Could not read Word files in the current folder: {message}",
  "recolor.noFiles":
    "There are no .docx files to process beside the current Markdown file.",
  "recolor.cancelled": "Zotero citation coloring was cancelled.",
  "recolor.fileMissing":
    "The selected Word file no longer exists: {path}",
  "recolor.launchStage": "Starting citation coloring",
  "recolor.launchDetail":
    "The source Word file will not be overwritten; Zotero fields remain refreshable",
  "recolor.launchFailed": "Could not start citation coloring: {message}",
  "recolor.completed": "Zotero citations were restored to blue: {file}",
  "recolor.failedWithDetails":
    "Citation coloring failed ({code}): {details}",
  "recolor.failedWithCode":
    "Citation coloring failed with exit code {code}.",
  "recolor.running": "Creating a blue-citation copy: {file}",
  "export.cancelled": "Word export was cancelled.",
  "export.noLocalFs":
    "The local exporter cannot start because this vault is not on a local file system.",
  "export.readMarkdownFailed":
    "Could not read the current Markdown: {message}",
  "export.runtimeUnavailable":
    "The runtime is still unavailable: {status}",
  "export.templateDirectoryFailed":
    "Could not create the user template directory.",
  "export.pythonMissing":
    "The Python exporter for this system is missing. Install or repair the runtime.",
  "export.readTemplatesFailed":
    "Could not read the Word template directory: {message}",
  "export.noTemplates":
    "The Word template directory contains no .docx files: {path}",
  "export.templateMissing":
    "The selected Word template was not found: {path}",
  "export.presetSaved": "Formatting preset saved: {name}",
  "export.outputRenamed":
    "A Word file with the same name already exists and was not changed. This export was saved as: {file}",
  "export.launchStage": "Starting the exporter",
  "export.launchDetail": "{mode} · {format}",
  "export.launchFailed": "Could not start Word export: {message}",
  "export.completed": "Word export complete: {file}",
  "export.failedWithDetails": "Word export failed ({code}): {details}",
  "export.failedWithCode": "Word export failed with exit code {code}.",
  "export.running": "Exporting ({mode} | {format}): {file}",
  "export.mode.strict": "Strict mode",
  "export.mode.compatible": "Compatible mode",
  "progress.export.init": "Initializing the export environment",
  "progress.export.readMarkdown": "Reading Markdown",
  "progress.export.normalizeMarkdown": "Normalizing Markdown",
  "progress.export.normalizeMarkdownDetail":
    "Headings, images, citation spacing, and equation labels",
  "progress.export.parseDocument": "Parsing document structure",
  "progress.export.parseDocumentDetail":
    "Scanning images, tables, equations, and citations",
  "progress.export.checkResources": "Checking document resources",
  "progress.export.checkResourcesDetail":
    "Images {images}; tables {tables}; equations {equations}",
  "progress.export.checkCitations": "Checking Zotero citations",
  "progress.export.checkCitationsDetail": "citekeys {count}",
  "progress.export.preflight": "Preflight complete",
  "progress.export.preflightDetail":
    "Mode {mode}; missing citekeys {missing}",
  "progress.export.generateDraft": "Generating the Word draft",
  "progress.export.generateDraftDetail":
    "Running Pandoc and pandoc-crossref",
  "progress.export.draftReady": "Word draft generated",
  "progress.export.formatDocument": "Formatting the Word document",
  "progress.export.formatDocumentDetail":
    "Fonts, scripts, equations, figures, tables, and Zotero fields",
  "progress.export.validateDocument": "Checking the Word document",
  "progress.export.validateDocumentDetail":
    "Figure gaps filled {reflowed}; structure, numbering, citation fields, and formatting checked",
  "progress.export.verifySource": "Verifying the source file",
  "progress.export.verifySourceDetail":
    "Checking whether the Markdown changed during export",
  "progress.export.openWord": "Opening Word",
  "progress.export.complete": "Export complete",
  "progress.export.failed": "Export failed",
  "progress.export.cancelled": "Cancelled",
  "progress.export.cancelledDetail": "The user cancelled the export",
  "progress.recolor.init": "Initializing citation coloring",
  "progress.recolor.readWord": "Reading Word",
  "progress.recolor.detectFields": "Detecting Zotero fields",
  "progress.recolor.detectFieldsDetail":
    "In-text citations and the bibliography",
  "progress.recolor.checkColors": "Checking citation colors",
  "progress.recolor.checkColorsDetail":
    "In-text citation fields {citations}; bibliography fields {bibliography}",
  "progress.recolor.openWord": "Opening Word",
  "progress.recolor.complete": "Citation coloring complete",
  "progress.recolor.failed": "Citation coloring failed",
  "progress.recolor.cancelled": "Cancelled",
  "progress.recolor.cancelledDetail":
    "The user cancelled citation coloring",
  "format.citationStyle.name": "Citation style (Zotero)",
  "format.citationStyle.desc": "Read styles installed in local Zotero for this export. Refresh and style changes remain available in Word.",
  "format.citationStyle.empty": "No local Zotero styles found. Install styles and reload, or keep manuscript settings.",
  "format.citationStyle.follow": "Use manuscript settings",
  "format.citationStyle.refresh": "Reload styles",
  "format.citationStyle.parentMissing": "The local parent style is missing. Use manual Word refresh, or reinstall this style in Zotero first.",
  "format.citationDisplay.name": "Initial citation display",
  "format.citationDisplay.desc": "Both modes preserve Zotero fields. Initial rendering falls back to Word Zotero Refresh for unsupported styles.",
  "progress.export.citationFallback": "Refresh citations with Zotero in Word",
  "format.citationDisplay.manual": "Refresh manually in Word",
  "format.citationDisplay.rendered": "Render readable citations during export (default)"
};
