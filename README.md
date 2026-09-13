# scRNA Practice

把 [Single-cell best practices](https://www.sc-best-practices.org/) 写成给你读的中文站点：从 FASTQ 到细胞对话，带图、带代码、带坑。

**在线阅读（GitHub Pages）** → [https://ddxyl404.github.io/scRNA-practice/](https://ddxyl404.github.io/scRNA-practice/)

这不是原书镜像。原书负责可执行 notebook；这里负责把「为什么这样选」讲成人话。图分两类：

- **原书图**：来自 [sc-best-practices.org](https://www.sc-best-practices.org/) **网页正文**的示意图、FastQC 好/差对照，以及同一页 notebook 的真实输出（Apache 2.0）
- **概念图**：为讲解画的示意

请引用原书：Heumos, Schaar et al., *Best practices for single-cell analysis across modalities*. Nat Rev Genet (2023). [doi:10.1038/s41576-023-00586-w](https://doi.org/10.1038/s41576-023-00586-w)

## 本地预览

```bash
npm install
npm run dev
```

GitHub Pages 构建：

```bash
GITHUB_PAGES=1 npm run build:pages
```

静态文件在 `.vercel/output/static/`，`base` 为 `/scRNA-practice/`。
