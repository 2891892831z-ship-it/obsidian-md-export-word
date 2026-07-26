# 运行时第三方组件

本目录随运行时包一起发布，用于说明二进制组件来源与许可证。

| 组件 | 固定版本 | 许可证 | 官方来源 |
| --- | --- | --- | --- |
| Pandoc | 3.8.2.1 | GPL-2.0-or-later | <https://github.com/jgm/pandoc> |
| pandoc-crossref | 0.3.22 | GPL-2.0-or-later | <https://github.com/lierdakil/pandoc-crossref> |
| lxml | 6.0.2 | BSD-3-Clause | <https://github.com/lxml/lxml> |
| Better BibTeX `zotero.lua` | revision 199d652 | MIT | <https://github.com/retorquere/zotero-better-bibtex> |

发布工作流从上游 GitHub Release 下载与 Pandoc 版本匹配的 Windows x64、
macOS arm64 和 macOS x64 二进制文件，不把这些大型二进制提交到本仓库。
对应源码和完整许可证可由上表的官方仓库获得。`lxml` 由用户本机的 `pip`
安装，不包含在发布的运行时 ZIP 中。

Better BibTeX Copyright (c) 2016 Emiliano Heyns。
