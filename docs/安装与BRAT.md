# BRAT 安装教程

本教程用于把 MD Export Word 安装到另一台 Windows 电脑。BRAT 安装插件
界面，插件再安装导出所需的版本匹配运行时。

## 1. 安装前检查

### 必需

- Windows 10 或 Windows 11；
- Obsidian 桌面版 1.7.2 或更高；
- Python 3.10 或更高；
- 首次安装时能够访问 GitHub 和 `pypi.org`；
- 至少约 1 GB 可用磁盘空间。

### 按需安装

- Microsoft Word：打开和继续编辑 `.docx`；
- Zotero + Better BibTeX：生成并刷新 Zotero 引文；
- LibreOffice：仅用于无 Word 环境下的预览或自动渲染，不是导出的必需条件。

### 验证 Python

打开 PowerShell，执行：

```powershell
py -3 --version
```

如果 `py` 不存在，再执行：

```powershell
python --version
```

版本应为 3.10 或更高。安装 Python 时建议勾选 **Add Python to PATH**。

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
名称和 `manifest.json` 版本必须完全一致，例如都为 `1.3.0`。

## 3. 安装 Word 导出运行时

按 `Ctrl+P` 打开命令面板，搜索并执行：

```text
MD Export Word: Install or repair Word export runtime
```

插件会依次：

1. 从当前插件版本对应的 GitHub Release 下载运行时 ZIP；
2. 解压 Python 导出器、Lua 过滤器、Word 模板；
3. 安装版本匹配的 Pandoc 与 pandoc-crossref；
4. 在插件目录创建 `.venv`；
5. 在虚拟环境内安装固定版本的 `lxml`；
6. 建立不会被更新覆盖的用户模板目录。

安装期间不要关闭 Obsidian。若网络较慢，下载可能需要几分钟。

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
3. 运行 `MD Export Word: Export current Markdown to Word`；
4. 选择严格模式或兼容模式；
5. 选择模板并确认格式；
6. 等待右上角完成提示；
7. 在 Markdown 同目录查找生成的 `.docx` 和检查日志。

## 6. 更新

BRAT 更新插件后，如果插件提示运行时版本不一致，运行：

```text
MD Export Word: Install or repair Word export runtime
```

自定义模板存储在：

```text
<知识库>\.obsidian\plugins\md-export-word\templates
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
