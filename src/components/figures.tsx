import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

type DiagramProps = { className?: string };

function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-3 border-ink bg-paper",
        className,
      )}
    >
      {children}
    </div>
  );
}

function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Dots({
  n,
  cx,
  cy,
  rx,
  ry,
  fill,
  seed,
}: {
  n: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  seed: number;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = rand(seed + i) * Math.PI * 2;
        const r = Math.sqrt(rand(seed + i + 99));
        const x = cx + Math.cos(a) * rx * r;
        const y = cy + Math.sin(a) * ry * r;
        return <circle key={i} cx={x} cy={y} r={2.2} fill={fill} />;
      })}
    </>
  );
}

function BarcodesDiagram({ className }: DiagramProps) {
  const layers = [
    { k: "Sample index", v: "这条文库是谁的", bg: "bg-yellow" },
    { k: "Cell barcode", v: "这个液滴是哪颗细胞", bg: "bg-cyan" },
    { k: "UMI", v: "这是哪一个 mRNA 分子", bg: "bg-pink" },
  ];
  return (
    <Frame className={className}>
      <div className="grid gap-2 p-4 sm:grid-cols-3">
        {layers.map((l, i) => (
          <div key={l.k} className={cn("border-3 border-ink p-3", l.bg)}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
              0{i + 1} · {l.k}
            </p>
            <p className="mt-2 font-display text-lg uppercase leading-none">{l.v}</p>
          </div>
        ))}
      </div>
      <p className="border-t-3 border-ink bg-ink px-4 py-2 font-mono text-[11px] text-yellow">
        count[cell, gene] = unique(barcode + UMI + gene)
      </p>
    </Frame>
  );
}

function AnndataDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="grid gap-0 md:grid-cols-[1fr_9rem]">
        <div className="border-b-3 border-ink p-4 md:border-b-0 md:border-r-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
            adata.X · n_obs × n_vars
          </p>
          <div className="mt-3 grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-7 border-2 border-ink",
                  i % 7 === 0 ? "bg-yellow" : i % 5 === 0 ? "bg-cyan" : "bg-bg",
                )}
              />
            ))}
          </div>
          <p className="mt-3 text-sm leading-6">
            当前工作矩阵。可能是 counts，也可能已经被 log 过——所以原始计数要另藏一层。
          </p>
        </div>
        <div className="grid grid-rows-4">
          {[
            ["obs", "细胞注释"],
            ["var", "基因注释"],
            ["obsm", "PCA / UMAP"],
            ["layers", "counts 备份"],
          ].map(([k, v]) => (
            <div key={k} className="border-b-3 border-ink px-3 py-2 last:border-b-0">
              <p className="font-display text-sm uppercase leading-none">{k}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                {v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function KneeDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <svg viewBox="0 0 560 220" className="h-auto w-full" role="img" aria-label="Knee plot">
        <rect width="560" height="220" fill="#fff8ec" />
        <text x="28" y="28" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#111">
          UMI 总数（log）
        </text>
        <text x="390" y="210" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#111">
          条码按深度排序 →
        </text>
        <path
          d="M40 40 C 90 42, 160 48, 210 70 C 250 90, 270 120, 290 150 C 330 190, 400 200, 530 205"
          fill="none"
          stroke="#111"
          strokeWidth="3"
        />
        <circle cx="268" cy="118" r="7" fill="#ffe500" stroke="#111" strokeWidth="3" />
        <line x1="268" y1="118" x2="268" y2="200" stroke="#111" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="48" y="150" width="110" height="36" fill="#c8ff3d" stroke="#111" strokeWidth="2" />
        <text x="58" y="172" fontFamily="Space Grotesk, sans-serif" fontSize="12" fill="#111">
          真正的细胞
        </text>
        <rect x="330" y="70" width="130" height="36" fill="#ff5a8a" stroke="#111" strokeWidth="2" />
        <text x="342" y="92" fontFamily="Space Grotesk, sans-serif" fontSize="12" fill="#111">
          空液滴长尾
        </text>
      </svg>
    </Frame>
  );
}

function QcViolins({ className }: DiagramProps) {
  const paths = [
    { label: "n_counts", d: "M40 170 C40 90, 70 40, 80 40 C90 40, 120 90, 120 170 Z", fill: "#00c2b2" },
    { label: "n_genes", d: "M40 170 C45 110, 70 55, 80 55 C90 55, 115 110, 120 170 Z", fill: "#ffe500" },
    { label: "mt %", d: "M50 170 C50 140, 70 80, 80 30 C90 80, 110 140, 110 170 Z", fill: "#ff5a8a" },
  ];
  return (
    <Frame className={className}>
      <div className="grid grid-cols-3">
        {paths.map((p) => (
          <div key={p.label} className="border-r-3 border-ink last:border-r-0">
            <p className="border-b-3 border-ink px-2 py-1 text-center font-mono text-[10px] font-bold uppercase">
              {p.label}
            </p>
            <svg viewBox="0 0 160 200" className="h-40 w-full">
              <line x1="20" y1="48" x2="140" y2="48" stroke="#111" strokeDasharray="5 4" strokeWidth="2" />
              <line x1="20" y1="160" x2="140" y2="160" stroke="#111" strokeDasharray="5 4" strokeWidth="2" />
              <path d={p.d} fill={p.fill} stroke="#111" strokeWidth="3" />
            </svg>
          </div>
        ))}
      </div>
      <p className="border-t-3 border-ink bg-yellow px-3 py-1 font-mono text-[11px]">
        虚线 = 中位数 ± 若干 MAD。卡在线外、且多项同时异常，才考虑丢掉。
      </p>
    </Frame>
  );
}

function PcaUmap({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="grid sm:grid-cols-2">
        <div className="border-b-3 border-ink p-3 sm:border-b-0 sm:border-r-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">PCA · 给算法</p>
          <svg viewBox="0 0 240 160" className="mt-2 h-auto w-full">
            <Dots n={40} cx={90} cy={80} rx={55} ry={40} fill="#00c2b2" seed={1} />
            <Dots n={40} cx={130} cy={85} rx={50} ry={38} fill="#ff5a8a" seed={2} />
            <Dots n={24} cx={110} cy={70} rx={30} ry={24} fill="#ffe500" seed={3} />
          </svg>
          <p className="text-sm">类型叠在一起没关系，邻居关系还在。</p>
        </div>
        <div className="p-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">UMAP · 给人看</p>
          <svg viewBox="0 0 240 160" className="mt-2 h-auto w-full">
            <Dots n={36} cx={70} cy={50} rx={28} ry={22} fill="#00c2b2" seed={4} />
            <Dots n={36} cx={170} cy={55} rx={26} ry={20} fill="#ff5a8a" seed={5} />
            <Dots n={28} cx={120} cy={120} rx={32} ry={18} fill="#ffe500" seed={6} />
          </svg>
          <p className="text-sm">岛好看，岛与岛的距离不能当证据。</p>
        </div>
      </div>
    </Frame>
  );
}

function BatchDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="grid sm:grid-cols-2">
        <div className="border-b-3 border-ink p-3 sm:border-b-0 sm:border-r-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">整合前 · 按批次抱团</p>
          <svg viewBox="0 0 240 150" className="mt-2 h-auto w-full">
            <Dots n={30} cx={70} cy={70} rx={28} ry={28} fill="#ff5a8a" seed={7} />
            <Dots n={30} cx={170} cy={80} rx={28} ry={28} fill="#00c2b2" seed={8} />
          </svg>
        </div>
        <div className="p-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">整合后 · 类型重叠、批次散开</p>
          <svg viewBox="0 0 240 150" className="mt-2 h-auto w-full">
            <Dots n={18} cx={80} cy={55} rx={22} ry={18} fill="#ff5a8a" seed={9} />
            <Dots n={18} cx={88} cy={58} rx={22} ry={18} fill="#00c2b2" seed={10} />
            <Dots n={18} cx={165} cy={100} rx={22} ry={18} fill="#ff5a8a" seed={11} />
            <Dots n={18} cx={172} cy={96} rx={22} ry={18} fill="#00c2b2" seed={12} />
          </svg>
        </div>
      </div>
    </Frame>
  );
}

function LeidenDiagram({ className }: DiagramProps) {
  const nodes = [
    [40, 40], [70, 30], [90, 55], [55, 70], [110, 40],
    [160, 90], [190, 80], [210, 110], [170, 120], [200, 140],
    [60, 140], [90, 130], [40, 160], [80, 170], [110, 155],
  ];
  const colors = ["#00c2b2", "#00c2b2", "#00c2b2", "#00c2b2", "#00c2b2", "#ff5a8a", "#ff5a8a", "#ff5a8a", "#ff5a8a", "#ff5a8a", "#ffe500", "#ffe500", "#ffe500", "#ffe500", "#ffe500"];
  return (
    <Frame className={className}>
      <svg viewBox="0 0 250 200" className="h-48 w-full">
        <line x1="90" y1="55" x2="160" y2="90" stroke="#111" strokeWidth="1.5" />
        <line x1="110" y1="155" x2="170" y2="120" stroke="#111" strokeWidth="1.5" />
        {nodes.map(([x, y], i) =>
          nodes.slice(i + 1).map(([x2, y2], j) => {
            const d = Math.hypot(x - x2, y - y2);
            if (d > 55) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={x}
                y1={y}
                x2={x2}
                y2={y2}
                stroke="#111"
                strokeWidth="1.5"
              />
            );
          }),
        )}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="8" fill={colors[i]} stroke="#111" strokeWidth="2" />
        ))}
      </svg>
      <p className="border-t-3 border-ink px-3 py-2 text-sm">
        每个点是一个细胞，线是 PCA 空间里的邻居。Leiden 在这张图上切社区，不在 UMAP 上切蛋糕。
      </p>
    </Frame>
  );
}

function AnnotTree({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="space-y-2 p-4">
        <div className="border-3 border-ink bg-yellow px-3 py-2 font-display uppercase">
          谱系 · immune / epithelial / stromal
        </div>
        <div className="ml-6 grid gap-2 sm:grid-cols-3">
          {["CD4 T", "Goblet", "Fibroblast"].map((t) => (
            <div key={t} className="border-3 border-ink bg-cyan px-3 py-2 text-sm font-bold">
              类型 · {t}
            </div>
          ))}
        </div>
        <div className="ml-12 grid gap-2 sm:grid-cols-2">
          {["naive", "exhausted", "cycling"].map((t) => (
            <div key={t} className="border-3 border-ink bg-pink px-3 py-2 text-sm">
              状态 · {t}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function PseudobulkDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="grid gap-3 p-4 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
            三千个 T 细胞 ≠ 三千次重复
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {Array.from({ length: 36 }, (_, i) => (
              <span
                key={i}
                className="size-4 border-2 border-ink"
                style={{ background: i < 18 ? "#00c2b2" : "#ff5a8a" }}
              />
            ))}
          </div>
          <p className="mt-2 text-sm leading-6">青块来自 3 个对照供体，粉块来自 3 个病人。</p>
        </div>
        <div className="border-3 border-ink bg-bg p-3">
          <p className="font-mono text-[10px] font-bold uppercase">伪 bulk 之后</p>
          <ul className="mt-2 space-y-1 font-display text-lg uppercase">
            <li>6 行样本</li>
            <li>1 种细胞类型</li>
            <li>交给 DESeq2</li>
          </ul>
        </div>
      </div>
    </Frame>
  );
}

function SimplexDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="grid items-center gap-4 p-4 sm:grid-cols-2">
        <svg viewBox="0 0 220 190" className="h-44 w-full">
          <polygon points="110,18 200,170 20,170" fill="#fff8ec" stroke="#111" strokeWidth="3" />
          <circle cx="110" cy="110" r="8" fill="#ffe500" stroke="#111" strokeWidth="2" />
          <text x="96" y="14" fontSize="11" fontFamily="IBM Plex Mono, monospace">T</text>
          <text x="204" y="180" fontSize="11" fontFamily="IBM Plex Mono, monospace">B</text>
          <text x="2" y="180" fontSize="11" fontFamily="IBM Plex Mono, monospace">Mac</text>
        </svg>
        <p className="text-sm leading-6">
          三种细胞的比例必须加起来等于 1，所以它们住在三角形里，而不是三条独立的数轴上。一边涨，另外两边会被挤。
        </p>
      </div>
    </Frame>
  );
}

function TrajectoryDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <svg viewBox="0 0 520 180" className="h-auto w-full">
        <path d="M30 90 C 140 90, 180 90, 250 90" fill="none" stroke="#111" strokeWidth="4" />
        <path d="M250 90 C 320 90, 360 40, 490 28" fill="none" stroke="#111" strokeWidth="4" />
        <path d="M250 90 C 320 90, 360 140, 490 155" fill="none" stroke="#111" strokeWidth="4" />
        <Dots n={18} cx={80} cy={90} rx={28} ry={16} fill="#00c2b2" seed={20} />
        <Dots n={14} cx={250} cy={90} rx={20} ry={14} fill="#ffe500" seed={21} />
        <Dots n={20} cx={430} cy={36} rx={32} ry={16} fill="#ff5a8a" seed={22} />
        <Dots n={20} cx={430} cy={150} rx={32} ry={16} fill="#c8ff3d" seed={23} />
        <circle cx="40" cy="90" r="7" fill="#111" />
        <text x="20" y="78" fontSize="11" fontFamily="IBM Plex Mono, monospace">start</text>
      </svg>
      <p className="border-t-3 border-ink px-3 py-2 text-sm">
        先有骨架（会不会分叉），再给每个细胞一个位置。起点必须有生物学理由，不能是「图的左边」。
      </p>
    </Frame>
  );
}

function VelocityDiagram({ className }: DiagramProps) {
  return (
    <Frame className={className}>
      <div className="grid sm:grid-cols-3">
        {[
          { t: "转录", d: "基因被打开，新生 RNA 带着内含子", bg: "bg-yellow" },
          { t: "剪接", d: "unspliced → spliced，内含子被剪掉", bg: "bg-cyan" },
          { t: "降解", d: "成熟 mRNA 被拆掉，计数慢慢掉", bg: "bg-pink" },
        ].map((s, i) => (
          <div
            key={s.t}
            className={cn(
              "border-b-3 border-ink p-4 sm:border-b-0 sm:border-r-3 last:border-r-0",
              s.bg,
            )}
          >
            <p className="font-mono text-[10px] font-bold uppercase">0{i + 1}</p>
            <p className="mt-1 font-display text-xl uppercase">{s.t}</p>
            <p className="mt-2 text-sm leading-6">{s.d}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function FastqFlow({ className }: DiagramProps) {
  const steps = ["FASTQ", "比对 / 伪对齐", "UMI 去重", "count matrix"];
  return (
    <Frame className={className}>
      <ol className="grid gap-0 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li
            key={s}
            className="border-b-3 border-ink p-4 last:border-b-0 sm:border-b-0 sm:border-r-3 sm:last:border-r-0"
          >
            <p className="font-display text-3xl leading-none text-ink/20">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 font-display text-lg uppercase leading-none">{s}</p>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

function CountMatrix({ className }: DiagramProps) {
  const genes = ["CD3D", "MS4A1", "LYZ", "EPCAM", "COL1A1"];
  const cells = ["AAAC", "AAAG", "AAAT", "AACA"];
  const vals = [
    [12, 0, 1, 0],
    [0, 18, 0, 0],
    [2, 0, 40, 1],
    [0, 0, 0, 22],
    [0, 1, 0, 0],
  ];
  return (
    <Frame className={className}>
      <div className="overflow-x-auto p-3">
        <table className="w-full text-center font-mono text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left">gene \\ cell</th>
              {cells.map((c) => (
                <th key={c} className="p-2">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {genes.map((g, ri) => (
              <tr key={g} className="border-t-2 border-ink">
                <td className="p-2 text-left font-bold">{g}</td>
                {vals[ri]!.map((v, ci) => (
                  <td key={ci} className={cn("p-2", v === 0 ? "text-muted" : "bg-lime")}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t-3 border-ink px-3 py-2 text-sm">
        大量零不是「这个基因不存在」，经常只是没抓到。这就是 dropout。
      </p>
    </Frame>
  );
}

const IMAGES: Record<string, { src: string; alt: string }> = {
  "bulk-avg": { src: "/figures/bulk-vs-single.jpg", alt: "左边组织被搅成平均浆液，右边一颗颗细胞保持各自颜色" },
  droplets: { src: "/figures/droplets.jpg", alt: "微流控通道里，油包水的液滴各自捕获一颗细胞" },
  "umap-islands": { src: "/figures/umap-islands.jpg", alt: "单细胞 UMAP：不同颜色的细胞聚成若干小岛" },
  "talking-cells": { src: "/figures/talking-cells.jpg", alt: "一颗细胞释放配体，另一颗细胞用受体接住" },
  "spatial-slice": { src: "/figures/spatial-slice.jpg", alt: "组织切片上叠着规则的空间捕获点" },
  "leaky-cell": { src: "/figures/leaky-cell.jpg", alt: "破损细胞把 RNA 和线粒体漏进周围液滴" },
  "book-qc-schematic": { src: "/figures/book/qc-schematic.jpg", alt: "原书：低质量细胞、环境 RNA 与双细胞示意图" },
  "book-qc-violin": { src: "/figures/book/qc-violin.png", alt: "原书：QC 指标小提琴图" },
  "book-qc-scatter": { src: "/figures/book/qc-scatter.png", alt: "原书：UMI 对基因数散点，按线粒体比例着色" },
  "book-qc-ambient": { src: "/figures/book/qc-ambient.jpg", alt: "原书：环境 RNA 如何进入液滴" },
  "book-qc-doublet": { src: "/figures/book/qc-doublet.jpg", alt: "原书：人工双细胞检测示意图" },
  "book-norm-log1p": { src: "/figures/book/norm-log1p.png", alt: "原书：shifted log 归一化后的基因计数分布" },
  "book-norm-scran": { src: "/figures/book/norm-scran.png", alt: "原书：scran 归一化后的基因计数分布" },
  "book-norm-pearson": { src: "/figures/book/norm-pearson.png", alt: "原书：Pearson 残差分布" },
  "book-hvg-schematic": { src: "/figures/book/hvg-schematic.jpg", alt: "原书：特征选择在均值-方差平面上的示意" },
  "book-hvg-meanvar": { src: "/figures/book/hvg-meanvar.png", alt: "原书：高变基因均值-方差图" },
  "book-dim-schematic": { src: "/figures/book/dim-schematic.jpg", alt: "原书：高维细胞嵌入到低维空间" },
  "book-dim-pca": { src: "/figures/book/dim-pca.png", alt: "原书：PCA 二维图" },
  "book-dim-tsne": { src: "/figures/book/dim-tsne.png", alt: "原书：t-SNE 图" },
  "book-dim-umap": { src: "/figures/book/dim-umap.png", alt: "原书：UMAP 图" },
  "book-dim-qc-umap": { src: "/figures/book/dim-qc-umap.png", alt: "原书：在 UMAP 上检查 QC 指标" },
  "book-int-schematic": { src: "/figures/book/int-schematic.jpg", alt: "原书：整合方法家族示意图" },
  "book-int-before-batch": { src: "/figures/book/int-before-batch.png", alt: "原书：整合前按批次着色的 UMAP" },
  "book-int-before-type": { src: "/figures/book/int-before-type.png", alt: "原书：整合前按细胞类型着色的 UMAP" },
  "book-int-after-batch": { src: "/figures/book/int-after-batch.png", alt: "原书：整合后按批次着色的 UMAP" },
  "book-int-after-type": { src: "/figures/book/int-after-type.png", alt: "原书：整合后按细胞类型着色的 UMAP" },
  "book-clu-schematic": { src: "/figures/book/clu-schematic.jpg", alt: "原书：图聚类示意图" },
  "book-clu-leiden": { src: "/figures/book/clu-leiden.png", alt: "原书：Leiden 聚类 UMAP" },
  "book-ann-markers": { src: "/figures/book/ann-markers.png", alt: "原书：marker 基因在 UMAP 上的表达" },
  "book-ann-umap": { src: "/figures/book/ann-umap.png", alt: "原书：注释后的细胞类型 UMAP" },
  "book-anndata": { src: "/figures/book/anndata.jpg", alt: "原书：AnnData 对象结构" },
  "book-scanpy-api": { src: "/figures/book/scanpy-api.png", alt: "原书：Scanpy API 分层" },
  "book-scanpy-pca": { src: "/figures/book/scanpy-pca.png", alt: "原书：Scanpy PCA 示例图" },
  "book-raw-overview": { src: "/figures/book/raw-overview.jpg", alt: "原书：原始数据处理总览" },
  "book-raw-fastqc": { src: "/figures/book/raw-fastqc.jpg", alt: "原书：FastQC per-read quality" },
  "book-raw-align": { src: "/figures/book/raw-align.png", alt: "原书：比对与伪对齐的差别" },
  "book-raw-umi": { src: "/figures/book/raw-umi.png", alt: "原书：UMI 去重示意" },
  "book-raw-knee": { src: "/figures/book/raw-knee.png", alt: "原书：Alevin knee / barcode 排序图" },
  "book-exp-quantify": { src: "/figures/book/exp-quantify.png", alt: "原书：从组织到基因表达定量" },
  "book-dge-schematic": { src: "/figures/book/dge-schematic.jpg", alt: "原书：差异表达两种视角" },
  "book-dge-pca": { src: "/figures/book/dge-pca.png", alt: "原书：伪 bulk 样本 PCA" },
  "book-dge-volcano": { src: "/figures/book/dge-volcano.png", alt: "原书：pyDESeq2 火山图" },
  "book-comp-schematic": { src: "/figures/book/comp-schematic.jpg", alt: "原书：组成分析示意图" },
  "book-comp-box": { src: "/figures/book/comp-boxplot.png", alt: "原书：细胞类型比例箱线图" },
  "book-gsea-heat": { src: "/figures/book/gsea-heatmap.png", alt: "原书：通路活性热图" },
  "book-ccc-schematic": { src: "/figures/book/ccc-schematic.png", alt: "原书：配体受体通讯示意" },
  "book-ccc-limits": { src: "/figures/book/ccc-limits.png", alt: "原书：细胞通讯推断的限制" },
  "book-ptime-umap": { src: "/figures/book/ptime-umap.png", alt: "原书：拟时序着色的 UMAP" },
  "book-velo-stream": { src: "/figures/book/velo-stream.png", alt: "原书：RNA 速率流场" },
  "book-spatial-intro": { src: "/figures/book/spatial-intro.jpg", alt: "原书：空间转录组技术总览" },
  "book-pert-eccite": { src: "/figures/book/pert-eccite.png", alt: "原书：ECCITE 扰动实验示意" },
  "book-gsea-bar": { src: "/figures/book/gsea-bar.png", alt: "原书：GSEA 符号富集分数条形图" },
  "book-gsea-aucell": { src: "/figures/book/gsea-aucell.png", alt: "原书：干扰素通路 AUCell 分数画在 UMAP 上" },
  "book-gsea-tf-ptime": { src: "/figures/book/gsea-tf-ptime.png", alt: "原书：转录因子活性沿拟时序变化" },
  "book-pert-lda": { src: "/figures/book/pert-lda.png", alt: "原书：Mixscape LDA 把不同 KO 分开" },
  "book-pert-violin": { src: "/figures/book/pert-violin.png", alt: "原书：Mixscape 扰动分数小提琴图" },
  "book-ccc-dotplot": { src: "/figures/book/ccc-dotplot.png", alt: "原书：LIANA 配体-受体点图" },
  "book-ccc-chord": { src: "/figures/book/ccc-chord.png", alt: "原书：细胞通讯弦图" },
  "book-ptime-fate": { src: "/figures/book/ptime-fate.png", alt: "原书：Palantir 命运概率" },
  "book-ptime-paga": { src: "/figures/book/ptime-paga.png", alt: "原书：PAGA 造血分化骨架" },
  "book-velo-phase": { src: "/figures/book/velo-phase.png", alt: "原书：scVelo 基因相位图" },
  "book-ann-dotplot": { src: "/figures/book/ann-dotplot.png", alt: "原书：marker 基因点图" },
  "book-ann-rank": { src: "/figures/book/ann-rank.png", alt: "原书：rank_genes_groups 热图" },
  "book-grn-importance": { src: "/figures/book/grn-importance.png", alt: "原书：GRNBoost TF–基因重要性分布" },
  "book-grn-aucell": { src: "/figures/book/grn-aucell.png", alt: "原书：regulon 活性嵌入的 UMAP" },
  "book-raw-gc": { src: "/figures/book/raw-gc.jpg", alt: "原书：FastQC per-sequence GC content" },
  "book-raw-alevin": { src: "/figures/book/raw-alevin.png", alt: "原书：Alevin-QC 定量摘要" },
  "book-raw-summary": { src: "/figures/book/raw-summary.jpg", alt: "原书：FastQC 总览（差文库示例）" },
  "book-raw-quality": { src: "/figures/book/raw-quality.jpg", alt: "原书：FastQC per-sequence quality scores，好与差对照" },
  "book-raw-content": { src: "/figures/book/raw-content.jpg", alt: "原书：FastQC per-base sequence content，好与差对照" },
  "book-dge-ma": { src: "/figures/book/dge-ma.png", alt: "原书：pyDESeq2 MA 图" },
  "grn-switch": { src: "/figures/grn-switch.jpg", alt: "转录因子像开关面板，同时打开或关掉一排靶基因" },
  "crispr-cut": { src: "/figures/crispr-cut.jpg", alt: "一颗细胞被 CRISPR 剪刀精准剪开，周围对照细胞完好" },
  "multi-layers": { src: "/figures/multi-layers.jpg", alt: "同一颗细胞叠着 RNA、染色质、表面蛋白三层观测" },
};

const DIAGRAMS: Record<string, (p: DiagramProps) => ReactNode> = {
  barcodes: (p) => <BarcodesDiagram {...p} />,
  anndata: (p) => <AnndataDiagram {...p} />,
  knee: (p) => <KneeDiagram {...p} />,
  "qc-violins": (p) => <QcViolins {...p} />,
  "pca-umap": (p) => <PcaUmap {...p} />,
  batch: (p) => <BatchDiagram {...p} />,
  leiden: (p) => <LeidenDiagram {...p} />,
  "annot-tree": (p) => <AnnotTree {...p} />,
  pseudobulk: (p) => <PseudobulkDiagram {...p} />,
  simplex: (p) => <SimplexDiagram {...p} />,
  trajectory: (p) => <TrajectoryDiagram {...p} />,
  velocity: (p) => <VelocityDiagram {...p} />,
  "fastq-flow": (p) => <FastqFlow {...p} />,
  "count-matrix": (p) => <CountMatrix {...p} />,
};

export function ChapterFigure({ fig, caption }: { fig: string; caption: string }) {
  const image = IMAGES[fig];
  const Diagram = DIAGRAMS[fig];
  return (
    <figure className="max-w-full overflow-hidden border-3 border-ink bg-paper shadow-brutal">
      {image ? (
        <img
          src={asset(image.src)}
          alt={image.alt}
          className="max-h-[40rem] w-full bg-paper object-contain"
        />
      ) : Diagram ? (
        <Diagram />
      ) : (
        <p className="p-4 text-sm">（图未找到：{fig}）</p>
      )}
      <figcaption className="border-t-3 border-ink bg-yellow px-4 py-2 text-sm leading-6">
        <span className="mr-2 font-mono text-[10px] font-bold uppercase tracking-widest">
          {fig.startsWith("book-") ? "原书图" : "Fig"}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}
