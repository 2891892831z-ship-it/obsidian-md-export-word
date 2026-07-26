# 贡献指南

感谢参与 MD Export Word。该工具处理论文格式与引用，任何改动都应优先保证
可复现和不破坏已有文档。

## 提交问题

请先：

1. 更新到最新 Release；
2. 运行环境自检；
3. 阅读故障排查；
4. 用最小 Markdown 复现；
5. 删除未公开论文、个人路径和 Token。

使用 Bug Report 模板，并附插件版本、自检输出、导出日志和预期/实际结果。

## 提交代码

1. Fork 仓库并建立功能分支；
2. 不直接修改发布分支；
3. 保持改动范围单一；
4. 对格式问题增加最小回归样例；
5. 运行：

   ```powershell
   npm install
   npm run check
   npm run build
   ```

6. 按 PR 模板逐项确认；
7. 不提交 `node_modules`、`.venv`、`.exe`、ZIP 或真实论文数据。

## 学术内容保护

- 不新增虚构 citekey；
- 不自动替换现有 citekey；
- 不删除或移动 `{#fig:id}`、`{#tbl:id}`、`{#eq:id}`；
- 兼容模式保留缺失引用占位符；
- 插件不得写入 Zotero 数据库；
- 任何自动修复都应有日志和可测试规则。

## 提交消息

推荐使用简洁的 Conventional Commits：

```text
fix: remove spaces before Zotero fields
feat: add thesis template preset
docs: clarify BRAT runtime installation
test: cover two-column equation layout
```

## 版本与发布

普通贡献者不要修改版本号。维护者在发布时统一更新 `package.json`、
`manifest.json`、`versions.json`、运行时清单和 CHANGELOG。
