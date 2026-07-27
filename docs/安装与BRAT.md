# BRAT 安装教程

本教程用于把 MD Export Word 安装到 Windows 或 macOS 电脑。BRAT 安装
插件界面，插件会识别当前操作系统与 CPU，并安装版本匹配的导出运行时。

## 1. 安装前检查

### 必需

- Windows 10/11 x64，或 Obsidian 1.7.2 支持的 macOS（Apple Silicon/Intel）；
- Obsidian 桌面版 1.7.2 或更高；
- Python 3.10 或更高；
- 首次安装时能够访问 GitHub 和 `pypi.org`；
- 至少约 1 GB 可用磁盘空间。

### 按需安装

- Microsoft Word：打开和继续编辑 `.docx`；
- Zotero + Better BibTeX：生成并刷新 Zotero 引文；
- LibreOffice：仅用于无 Word 环境下的预览或自动渲染，不是导出的必需条件。

### Windows：验证 Python

打开 PowerShell，执行：

```powershell
py -3 --version
```

如果 `py` 不存在，再执行：

```powershell
python --version
```

版本应为 3.10 或更高。安装 Python 时建议勾选 **Add Python to PATH**。

### macOS：确认芯片并验证 Python

打开“终端”，执行：

```bash
uname -m
python3 --version
```

`uname -m` 的结果对应关系：

| 结果 | 运行时 |
| --- | --- |
| `arm64` | macOS Apple Silicon |
| `x86_64` | macOS Intel |

Python 应为 3.10 或更高。若系统没有合适版本，请安装
[python.org 的 macOS 64-bit universal2 安装包](https://www.python.org/downloads/macos/)。
插件会把依赖装进自身的 `.venv`，不会修改系统 Python 包。

## 2. 用 BRAT 安装插件

1. Obsidian → **设置** → **第三方插件**。
2. 关闭安全模式（如仍开启）。
3. 在插件市场搜索并安装 **BRAT**。
4. 启用 BRAT。
5. 打开 BRAT 设置，选择 **Add Beta plugin**。
6. 输入：

   ```text
   GitHub用户名/obsidian-md-export-word
   ```

7. 选择跟踪 **Latest release**。
8. 回到“已安装插件”，启用 **MD Export Word**。

BRAT 1.1.0 及以后以 GitHub Release 为主要安装源。项目 Release 的标签、
名称和 `manifest.json` 版本必须完全一致，例如都为 `1.4.0`。

## 3. 安装 Word 导出运行时

按 `Ctrl+P` 打开命令面板，搜索并执行：

```text
MD Export Word: Install or repair Word export runtime
```

插件会依次：

1. 识别当前系统和 CPU 架构；
2. 从当前插件版本对应的 GitHub Release 下载唯一匹配的运行时 ZIP；
3. 校验运行时版本与平台清单；
4. 解压 Python 导出器、Lua 过滤器、Word 模板；
5. 安装版本匹配的 Pandoc 与 pandoc-crossref；
6. 在插件目录创建 `.venv`；
7. 在虚拟环境内安装固定版本的 `lxml`；
8. 建立不会被更新覆盖的用户模板目录。

自动选择规则：

| 当前电脑 | 下载的 Release 资产 |
| --- | --- |
| Windows x64 | `md-export-word-runtime-windows-x64.zip` |
| Apple Silicon Mac | `md-export-word-runtime-macos-arm64.zip` |
| Intel Mac | `md-export-word-runtime-macos-x64.zip` |

正常使用时不需要手工下载运行时，也不需要把 Pandoc、pandoc-crossref 或
LibreOffice 加入 PATH。

### Apple Silicon 上的 Intel 兼容模式

Obsidian 原生运行时会自动选择 `macos-arm64`。只有明确使用 Intel 版
Obsidian，或必须通过 Rosetta 运行 Intel 二进制时，才进入：

```text
设置 → MD Export Word → 运行时平台 → macOS Intel
```

选择后重新执行“Install or repair Word export runtime”。其余情况保持
“自动检测”即可。

插件安装运行时的完整步骤为：

1. 在插件目录创建本次安装专属的临时工作区；
2. 下载运行时 ZIP，并校验响应格式和落盘大小；
3. 解压到本次安装的临时目录；
4. 检查 `runtime-manifest.json` 的版本和平台；
5. 备份旧运行时；
6. 安装新运行时并建立私有 Python 环境；
7. 成功后清理临时工作区；失败则恢复旧运行时。

因此升级失败不会覆盖用户模板，也不会留下半套运行时。

从 `1.4.6` 开始，重复点击、重复执行命令或导出时自动触发安装，都会复用
当前安装任务。设置页会显示“正在安装”并暂时禁用相关控件；右上角提示持续
显示当前阶段和累计用时。插件目录中的原子安装锁还会阻止 BRAT 热重载或
多个窗口同时替换运行时。运行时 ZIP 约为 34-73 MB，若网络较慢，下载可能
需要几分钟；超过 5 分钟会停止本次安装等待并给出 GitHub 网络检查建议。
安装期间不要关闭 Obsidian，也无需重复点击。

## 4. 执行环境自检

运行：

```text
MD Export Word: Check Word export runtime
```

自检会检查：

- Python 虚拟环境；
- `lxml`；
- Pandoc；
- pandoc-crossref；
- Python/Lua 导出脚本；
- 默认 Word 模板；
- 运行时清单。

只有全部通过后再开始正式导出。

## 5. 第一次导出

1. 在 Obsidian 中打开一个 `.md` 文件；
2. `Ctrl+P`；
3. 运行
   `MD Export Word: Export current Markdown to Word (keep figure positions)`；
4. 选择严格模式或兼容模式；
5. 在窗口顶部选择保持图片原位或自动回填分页空白，再选择模板并确认格式；
6. 等待右上角完成提示；
7. 成功后 Word 自动打开，并保存在 Markdown 同目录；
8. 只有失败时才会在同目录生成 `导出失败.log.txt`。

## 6. 更新

BRAT 更新插件后，如果插件提示运行时版本不一致，运行：

```text
MD Export Word: Install or repair Word export runtime
```

自定义模板存储在：

Windows：

```text
<知识库>\.obsidian\plugins\md-export-word\templates
```

macOS：

```text
<知识库>/.obsidian/plugins/md-export-word/templates
```

运行时更新不会覆盖该目录。

## 7. 私有仓库

BRAT 访问私有 GitHub 仓库需要只读 Token。为安全起见：

- 创建 fine-grained personal access token；
- 只允许目标仓库；
- Contents 权限只给 Read-only；
- 不要把 Token 写入 Markdown、截图或仓库文件；
- 在 BRAT 设置中保存 Token。

## 8. 手动安装备用方案

如果不用 BRAT：

1. 从 GitHub Release 下载 `main.js`、`manifest.json`、`styles.css`；
2. 复制到：

   ```text
   <知识库>\.obsidian\plugins\md-export-word
   ```

3. 重启 Obsidian并启用插件；
4. 执行“Install or repair Word export runtime”。

不要只复制仓库源代码中的 `src/`；Obsidian 加载的是编译后的 `main.js`。

## 9. macOS 首次运行的安全提示

正常通过插件下载的运行时会自动设置执行权限。如果 macOS 仍提示程序无法
打开或权限不足：

1. 先在 Obsidian 中执行“Install or repair Word export runtime”；
2. 再执行“Check Word export runtime”；
3. 不要双击 Release ZIP 内的 `pandoc`；
4. 如果系统明确提示已阻止，在“系统设置 → 隐私与安全性”核对被阻止的程序；
5. 仍失败时保存自检输出和 `导出失败.log.txt`，按故障排查文档处理。

不要用 `sudo` 启动 Obsidian，也不要把整个知识库设置为全盘可写。
