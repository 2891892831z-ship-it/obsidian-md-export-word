---
date modified: 2026.10.16 14:55:12
---

# Zotero 引用

## 工作方式

导出器通过 Better BibTeX 的本地 JSON-RPC 接口解析 Markdown citekey，再把
引文写成 Word 中可由 Zotero 刷新的域。默认接口为：

```text
http://127.0.0.1:23119/better-bibtex/json-rpc
```

该接口只访问当前电脑的本地 Zotero，不会把文献库上传到项目服务器。

## 安装要求

1. 安装 Zotero；
2. 安装 Better BibTeX for Zotero；
3. 启动 Zotero；
4. 等待 Zotero 与文献库同步完成；
5. 再执行导出。

## 选择样式与初始显示

导出窗口中的“引用样式（Zotero）”读取当前电脑 Zotero 已安装的 CSL，支持
默认及自定义数据目录。新增样式后可点击“重新读取”。新安装默认“沿用稿件设置”，
不会预设维护者的个人样式，也不会修改 Zotero 全局偏好或 Markdown 的 `csl`。

“引用初始显示”默认“导出时先生成可读引用”。导出器填写引文与参考文献的
显示结果，并保留 Zotero 域、文献标识及所选样式设置；打开 Word 后仍能 Refresh，
也可以在 Zotero 文档首选项中更换样式。此步骤不自动操作 Word 中的 Zotero。

也可选择“在 Word 中手动刷新”，导出后在 Word 中生成最终引文。
含多个语言 layout 的 CSL 使用内置 citeproc-js 兼容渲染，需要系统 PATH 中的
Node.js（建议 20 或更新版本）。普通 CSL 由 Pandoc 渲染。若渲染失败，导出过程
明确提示并回退为可刷新的提示文本，不悄悄改用其他样式。依赖样式缺少父样式时，
需在 Zotero 安装对应父样式，或选择手动刷新。

Obsidian 内的引文显示由其引用插件负责；其全局默认和笔记的 `csl` 属性独立于
本次 Word 导出选择。笔记显式指定的 `csl` 优先于全局默认。

## 严格模式

严格模式用于自己的论文：

- citekey 必须存在；
- 重复 citekey 必须能安全解析到同一文献；
- 缺失或歧义会阻断导出；
- 不会用标题相似文献自动替换。

## 兼容模式

兼容模式用于别人提供的 Markdown：

- 当前 Zotero 中存在的 citekey 正常导出；
- 不存在的 citekey 原样保留；
- Word 中用醒目占位符提示；
- 日志生成缺失清单。

这保证内容仍可阅读，同时避免错误匹配。

## 在 Word 中刷新

1. 用 Microsoft Word 打开导出的 `.docx`；
2. 确保 Zotero 正在运行；
3. 打开 Word 的 Zotero 选项卡；
4. 点击 **Refresh**；
5. 检查文中引文和参考文献表。

如果 Word 弹出“文档包含可能引用其他文件的域”，通常是普通 Word 外部域
或旧模板遗留字段，不是导出 Zotero 引文本身的必要提示。应先在模板中清理
外部链接，再重新导出。

## Refresh 后恢复正文引文蓝色

导出器会把正文 `ZOTERO_ITEM` 引文设为蓝色，并把文末
`ZOTERO_BIBL` 参考文献保持为黑色。Zotero 的 **Refresh** 会重新生成域的
显示文本，因此可能覆盖 Word 中原有的直接颜色格式。这是 Zotero 更新动态
引文的工作方式，静态 `.docx` 无法在保留可刷新域的同时拦截这次重写。

本插件提供无宏、跨平台的恢复命令：

1. 在 Word 中执行 Zotero **Refresh**；
2. 保存 Word，最好关闭当前文档；
3. 回到对应 Markdown，打开 Obsidian 命令面板；
4. 执行 **Reapply blue Zotero citations to exported Word**；
5. 从当前 Markdown 所在文件夹中选择刚保存的 `.docx`；
6. 插件生成新的 `-引文蓝色.docx`；同名时自动添加年月日时间戳。

该操作不会覆盖源 Word，也不会解除或删除 Zotero 域。生成的新副本仍可继续
刷新；如果再次 Refresh，颜色再次被 Zotero 重写，只需在保存后重新执行该
命令。文末参考文献不会被设为蓝色。

## 常见错误

### 无法连接 Better BibTeX

- Zotero 未启动；
- Better BibTeX 未安装或被禁用；
- 本地端口被安全软件阻止；
- Zotero 正在升级或尚未完成启动。

### 缺失 citekey

先在 Zotero/Better BibTeX 中搜索完全相同的 citekey。不要仅凭作者和年份
手工改成另一个 citekey。

### 引文前出现空格

Markdown 中中文与引用之间的排版空格和 Word 域边界容易叠加。导出器会做
结构化清理并自检；如果仍出现，保留日志和最小 Markdown 示例提交问题。
