# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| Latest release | Yes |
| Older releases | Best effort |

## Reporting a vulnerability

请不要公开提交包含以下内容的 Issue：

- 任意 Token、API Key 或 Cookie；
- 私有 GitHub 仓库地址；
- 未公开论文全文或原始数据；
- 可识别个人身份的本机路径；
- Zotero 数据库副本。

优先使用 GitHub 的 **Private vulnerability reporting**。若仓库尚未启用该功能，
请联系维护者并只提供最小复现信息。

## Runtime trust model

插件只应从配置的 GitHub 仓库、与插件完全同版本的 Release 下载运行时。
发布资产提供 SHA-256；维护者发布前必须在干净环境重建并核对资产来源。

项目不要求管理员权限，不修改系统 PATH，不上传 Markdown 或 Zotero 文献库。
