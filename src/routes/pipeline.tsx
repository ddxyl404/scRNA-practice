import { createFileRoute, Link } from "@tanstack/react-router";
import { CHAPTERS } from "@/data/chapters";
import { PARTS, PART_COLOR } from "@/data/parts";
import { PipelineMap } from "@/components/pipeline-map";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pipeline")({ component: PipelinePage });

const FLOW = [
  {
    title: "产生矩阵",
    body: "实验平台决定你有没有 UMI、是全长还是 3'、单细胞还是单核。定量工具把 FASTQ 变成细胞 × 基因计数。参考注释版本必须全项目锁定。",
    slugs: ["scrna-experiment", "raw-processing", "anndata"],
  },
  {
    title: "把噪声压下去",
    body: "MAD 过滤、双细胞、环境 RNA。归一化按下游任务选：shifted log 做降维，scran 做整合，Pearson 残差做 HVG。PCA 给算法，UMAP 给人看。",
    slugs: ["qc", "normalization", "feature-selection", "dimensionality"],
  },
  {
    title: "画出细胞地图",
    body: "先判断要不要去批次。复杂图谱用 scVI/scANVI，轻度用 Harmony。Leiden 画边界，注释把边界翻译成名字。簇 ≠ 类型。",
    slugs: ["integration", "clustering", "annotation"],
  },
  {
    title: "回答实验问题",
    body: "差异表达用伪 bulk，细胞不是生物学重复。组成数据住在单纯形上。通路是翻译层。扰动先确认刀切中了。",
    slugs: ["dge", "compositional", "gsea", "perturbation"],
  },
  {
    title: "连续命运与机制",
    body: "拟时序是排序不是时钟。RNA 速率可以指反。GRN 和通讯都是假说发生器，空间和功能实验才能打脸。",
    slugs: ["pseudotime", "velocity", "grn", "ccc"],
  },
  {
    title: "换一组观测",
    body: "空间加上坐标。ATAC 换峰空间。CITE 换蛋白噪声模型。AIR 换克隆型。配对多组学用专门模型，不要把两张 UMAP 叠在一起叫整合。",
    slugs: ["spatial", "multimodal", "outlook"],
  },
];

function PipelinePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">Map</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none md:text-6xl">
        分析流程
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-muted">
        原书按阶段分章，并不假装存在唯一 workflow。下面是可以记在手背上的主干：实线是默认顺序，支路按课题启用。
      </p>

      <div className="mt-10">
        <PipelineMap />
      </div>

      <div className="mt-12 space-y-6">
        {FLOW.map((f, i) => (
          <section key={f.title} className="border-3 border-ink bg-paper shadow-brutal">
            <header className="flex items-center gap-3 border-b-3 border-ink bg-ink px-4 py-2 text-yellow">
              <span className="font-display text-2xl">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-xl uppercase">{f.title}</h2>
            </header>
            <div className="grid gap-4 p-4 md:grid-cols-[1fr_20rem]">
              <p className="text-[15px] leading-7">{f.body}</p>
              <ul className="space-y-2">
                {f.slugs.map((slug) => {
                  const ch = CHAPTERS.find((c) => c.slug === slug)!;
                  const part = PARTS.find((p) => p.id === ch.part)!;
                  return (
                    <li key={slug}>
                      <Link
                        to="/chapters/$slug"
                        params={{ slug }}
                        className="flex items-center gap-2 border-2 border-ink bg-bg px-2 py-2 no-underline hover:bg-yellow"
                      >
                        <span className={cn("size-3 shrink-0 border border-ink", PART_COLOR[part.color])} />
                        <span className="font-mono text-[10px]">{ch.no}</span>
                        <span className="text-sm font-bold">{ch.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
