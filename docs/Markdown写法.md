# Markdown 写法

以下写法是导出器的稳定输入约定。标签必须原样保留。

## 标题

```markdown
# 文章题目

## 1 一级标题

### 1.1 二级标题
```

一篇文档只保留一个顶层题目。若 frontmatter 已有 `title`，正文又写了同样的
`# 标题`，Pandoc 可能生成两个题目。二者保留一个即可。

## Zotero 引用

```markdown
@citekey 指出……

该认识已得到验证 [@citekey]。

多篇文献 [@first; @second; @third]。
```

不要手工改变 citekey，不要把多条独立证据集中到段末统一引用。

## 公式

```markdown
$$
\Delta M_{H_2} = F_s - F_c - F_l
$$ {#eq:mass-balance}
```

引用公式：

```markdown
由 @eq:mass-balance 可知……
```

## 图片

标准 Markdown：

```markdown
![断裂—岩浆耦合模式](images/model.png){#fig:model width=90%}
```

Obsidian 嵌入：

```markdown
![[model.png]]
```

优先使用原始本地图片。剪贴板、图床或网页预览显示模糊时，应先检查图片本身
的像素尺寸，而不是通过放大 Word 显示尺寸弥补。

## 表格

```markdown
: 评价指标与权重 {#tbl:score}

| 因子 | 权重 |
| --- | ---: |
| 断裂—岩浆配置 | 0.40 |
| 构造高部位 | 0.40 |
```

公式表不要在 Markdown 中添加无意义的空列。公式编号由公式标签与导出器生成。

## 图题、表题与注释

图名和表名的编号后使用空格，不使用中文冒号：

```text
图 6 一级相对有利区带……
表 3 有利区评价结果
```

以下开头均识别为注释：

```markdown
注：……
Note: …
Notes: …
```

中英文注释都按注释样式处理。不要在注释开头添加列表符号 `-`、`*` 或 `■`。

## 上下标

数学内容优先使用 LaTeX：

```markdown
$CO_2$
$H_2$
$\delta^{13}C(CO_2)$
$T_{85}$
$^4He$
```

导出器会把它们写为 Word 的真实上标/下标属性。不要用缩小字号、升高字符
位置等视觉模拟方式。

## 图表标签保护

以下标签不可改名、删除或移动：

```text
{#fig:id}
{#tbl:id}
{#eq:id}
```

它们是 pandoc-crossref 建立编号与交叉引用的依据。
