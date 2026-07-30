---
title: 运行时烟雾测试
figureTitle: Fig.
tableTitle: Table
figPrefix: Fig.
tblPrefix: Table
---

## 1 正文与上下标

天然气中的 $CO_2$、$H_2$、$\delta^{13}C(CO_2)$ 和 $^4He$ 用于验证真实
上下标、英文字体与数字字体。

### 1.1 二级节标题

该段用于验证 Markdown `###` 保留为 Word 二级节标题。

#### 1.1.1 三级节标题

该段用于验证 Markdown `####` 保留为 Word 三级节标题，而不是降级为正文。

## 2 公式

$$
\Delta M_{H_2} = F_s - F_c - F_l
$$
{#eq:mass-balance}

由 @eq:mass-balance 可知，导出后公式编号应正确显示；源码中的标签独占一行。

## 3 表格

: 烟雾测试表 {#tbl:smoke}

| 因子 | 权重 |
| --- | ---: |
| 断裂—岩浆配置 | 0.40 |
| 构造高部位 | 0.40 |

注：该表仅用于自动回归测试。

Note: This note is used only by the automated smoke test.

## 4 English captions in strict mode

![English figure caption](smoke-figure.svg){#fig:smoke}
