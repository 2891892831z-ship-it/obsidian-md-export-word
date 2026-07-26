# Third-Party Notices

本仓库自有代码采用 MIT License。Windows 运行时使用以下第三方组件：

| Component | Version | License | Upstream |
| --- | --- | --- | --- |
| Pandoc | 3.8.2.1 | GPL-2.0-or-later | <https://github.com/jgm/pandoc> |
| pandoc-crossref | 0.3.22 (release v0.3.22a) | GPL-2.0-or-later | <https://github.com/lierdakil/pandoc-crossref> |
| lxml | 6.0.2 | BSD-3-Clause | <https://github.com/lxml/lxml> |
| Better BibTeX `zotero.lua` | revision 199d652 | MIT | <https://github.com/retorquere/zotero-better-bibtex> |
| Obsidian API typings | build-time only | MIT | <https://github.com/obsidianmd/obsidian-api> |

Pandoc 与 pandoc-crossref 二进制由 GitHub Actions 从各自官方 Release 获取。
两者源码与完整许可证由上游仓库提供。`lxml` 不打包进 ZIP，由首次安装时在
本机虚拟环境中通过 `pip` 安装。

本项目随运行时分发 Better BibTeX 的 live-citations Lua filter 修改版。修改仅
移除在线版本检查，使导出过程只访问本机 `127.0.0.1` 的 Better BibTeX
JSON-RPC；其余归属和 MIT 许可证仍属于上游项目。Better BibTeX:
Copyright (c) 2016 Emiliano Heyns。

Word 模板由本项目维护者提供。发布前应检查模板内的作者属性、修订记录、
外部链接和可公开范围。
