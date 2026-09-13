import type { Chapter } from "./types";

export const PREPROCESS_CHAPTERS: Chapter[] = [
  {
    slug: "qc",
    no: "05",
    title: "质量控制：先把不像细胞的扔掉",
    titleEn: "Quality control",
    part: "preprocess",
    minutes: 32,
    blurb: "MAD、双细胞、环境 RNA。QC 是偏见的第一道闸。闸太紧，稀有类型会先死。",
    objectives: [
      "用 n_counts、n_genes、mt% 描述一颗细胞像不像活的",
      "用 MAD 做宽松过滤，而不是背一个全球阈值",
      "知道双细胞和环境 RNA 必须分样本处理",
    ],
    sourcePath: "preprocessing_visualization/quality_control.ipynb",
    tools: ["Scanpy", "scDblFinder", "SoupX", "CellBender", "EmptyDrops"],
    takeaways: [
      "低质量细胞用中位数绝对偏差来抓，阈值从宽，避免误杀小亚群。",
      "按「基因在不在」做硬过滤，对下游帮助有限，原书不拿它当默认。",
      "双细胞用 scDblFinder 一类方法，而且绝不要在合并批次之后才跑。",
    ],
    blocks: [
      {
        type: "p",
        text: "绝大多数下游方法都默认：每个条码对应一颗完整的活细胞。液滴里的实情没这么体面——空泡、碎片、双细胞、漂着的环境 RNA，什么都有。QC 的工作是把「不太像细胞的条码」请出去，同时别把真正的小细胞当成垃圾。",
      },
      {
        type: "figure",
        fig: "book-qc-schematic",
        caption: "原书 QC 章开篇图。三种麻烦会同时出现：破细胞（线粒体和高丰度基因泄漏）、环境 RNA（空液滴和细胞液滴共享背景）、双细胞（两颗挤进一滴）。后面每一步都是在对付其中一种。",
      },
      {
        type: "callout",
        kind: "cite",
        title: "原书网页开篇四条",
        body: "Filtering of poor-quality cells should be based on MAD with lenient cutoffs；按基因做硬过滤对下游没有明显好处；双细胞用 scDblFinder 一类方法即可；双细胞检测不要在已经拼起来的多批次对象上跑。这四句是网页正文的 Key takeaways，不是我编的。",
      },
      {
        type: "p",
        text: "原书把预处理拆成固定顺序：双细胞检测 → 细胞 QC → 归一化 → 特征选择 → 降维。顺序不是随便排的。双细胞要在还没把样本拼起来时做；QC 阈值要在看差异表达之前定下来。你过滤太狠，稀有亚群会先消失；太松，注释时会对着一堆碎片发呆。很多时候，注释完还得回头再看一次 QC——这不是失败，是正常循环。",
      },
      {
        type: "figure",
        fig: "leaky-cell",
        caption: "破细胞膜的直觉：RNA 和线粒体漏进悬浮液，周围那些还完整的液滴会被这碗汤轻轻染色。",
      },
      {
        type: "h2",
        text: "先看三个数",
      },
      {
        type: "table",
        headers: ["指标", "太低像什么", "太高像什么"],
        rows: [
          ["n_counts（UMI 总数）", "空液滴、破细胞", "双细胞、大细胞、环境 RNA"],
          ["n_genes（检出基因数）", "空液滴、低复杂度", "双细胞"],
          ["mt%（线粒体比例）", "通常无妨", "膜破了的死细胞"],
        ],
      },
      {
        type: "p",
        text: "核糖体比例、血红蛋白（血液污染）、MALAT1 也可以当配角。不要把它们做成全球统一的门槛：肝细胞本来就大，某些淋巴细胞本来就小，肿瘤样本的 mt% 基线可以完全不同。",
      },
      {
        type: "code",
        lang: "python",
        caption: "原书 QC 章的起步：先把线粒体、核糖体、血红蛋白标出来",
        code: `adata.var["mt"] = adata.var_names.str.startswith("MT-")
adata.var["ribo"] = adata.var_names.str.startswith(("RPS", "RPL"))
adata.var["hb"] = adata.var_names.str.contains("^HB[^(P)]")

sc.pp.calculate_qc_metrics(
    adata,
    qc_vars=["mt", "ribo", "hb"],
    inplace=True,
    percent_top=[20],
    log1p=True,
)
sc.pl.violin(
    adata,
    ["n_genes_by_counts", "total_counts", "pct_counts_mt"],
    jitter=0.4,
    multi_panel=True,
)`,
      },
      {
        type: "figure",
        fig: "book-qc-violin",
        caption: "原书 notebook 实际输出：五把小提琴分别是检出基因数、UMI 总数、线粒体%、核糖体%、血红蛋白%。先看形状——有没有一条又长又细的尾巴？再看中位数落在哪。血红蛋白这把如果整体贴地，说明血液污染不重；如果鼓起一包，就要点名那些细胞看是不是红细胞。",
      },
      {
        type: "p",
        text: "读小提琴图有个习惯：不要只盯「最高的那个点」。最高点常常是双细胞或超大细胞。更有用的是主体鼓在哪里、有没有双峰。双峰可能意味着两种细胞大小（比如淋巴细胞和巨噬细胞），这时用同一个绝对值门槛会误杀其中一峰。",
      },
      {
        type: "figure",
        fig: "book-qc-scatter",
        caption: "原书实际输出：横轴 UMI 总数，纵轴检出基因数，颜色是线粒体比例。健康细胞大致沿一条斜线走：测得越深，看到的基因越多。左下角又浅又少基因的点，像空液滴；颜色发红（mt% 高）的点，像死细胞。斜线上方「基因特别多、UMI 也特别高」的点，要怀疑双细胞。",
      },
      {
        type: "figure",
        fig: "qc-violins",
        caption: "把同一件事画成「这份样本自己的」中位数 ± MAD。虚线不是从论文里抄来的 20%，是这批数据自己的脾气。",
      },
      {
        type: "h2",
        text: "用 MAD，别背「mt% > 20」",
      },
      {
        type: "p",
        text: "原书和多项基准的共识很朴素：看每个样本自己的分布，用中位数绝对偏差抓离群点，而且要宽松。MAD = median(|Xi − median(X)|)，再乘 1.4826 才和标准差同一量纲。原书跟 Germain 等人一样，对 counts / genes 用 5 个 MAD（很宽松），对线粒体用 3 个 MAD，并且再加一条硬顶：mt% > 8 也丢掉。为什么线粒体更严？因为死细胞的 mt% 会飙，而小淋巴细胞的 counts 本来就低，不能用同一把尺子。",
      },
      {
        type: "p",
        text: "绝对值阈值（「少于 200 个基因」「mt% > 20」）会系统性伤害小细胞和测得浅的文库。肝细胞可以很大，某些淋巴细胞可以很小，肿瘤样本的 mt% 基线可以完全不同。所以先画图，再让数据自己告诉你切在哪。",
      },
      {
        type: "code",
        lang: "python",
        caption: "原书 QC 章的 is_outlier：按 MAD 打叉，线粒体另算一档",
        code: `from scipy.stats import median_abs_deviation

def is_outlier(adata, metric: str, nmads: int):
    M = adata.obs[metric]
    return (M < np.median(M) - nmads * median_abs_deviation(M)) | (
        np.median(M) + nmads * median_abs_deviation(M) < M
    )

adata.obs["outlier"] = (
    is_outlier(adata, "log1p_total_counts", 5)
    | is_outlier(adata, "log1p_n_genes_by_counts", 5)
    | is_outlier(adata, "pct_counts_in_top_20_genes", 5)
)
adata.obs["mt_outlier"] = is_outlier(adata, "pct_counts_mt", 3) | (
    adata.obs["pct_counts_mt"] > 8
)
print(adata.obs.outlier.value_counts())
print(adata.obs.mt_outlier.value_counts())
adata = adata[(~adata.obs.outlier) & (~adata.obs.mt_outlier)].copy()`,
      },
      {
        type: "h2",
        text: "环境 RNA：汤的味道串台了",
      },
      {
        type: "figure",
        fig: "book-qc-ambient",
        caption: "原书示意图。液滴捕获时，悬浮液里漂着的 mRNA 也会被条码化。于是每个细胞都「轻微表达」一下高丰度基因——血红蛋白、胰岛素、表面活性蛋白。空液滴是这碗汤的配方，SoupX / CellBender 就是拿它来减背景。",
      },
      {
        type: "p",
        text: "破细胞把 mRNA 释放到悬浮液，随后被所有液滴共享。于是每个细胞都「轻微表达」一下高丰度基因——血红蛋白、胰岛素、表面活性蛋白。SoupX 用空液滴估计这碗汤的配方再减去；CellBender 用生成模型同时处理空液滴和背景。要不要启用，先看那些组织特异基因是不是在 UMAP 上「全图开花」。",
      },
      {
        type: "h2",
        text: "双细胞：两颗进同一滴",
      },
      {
        type: "figure",
        fig: "book-qc-doublet",
        caption: "原书示意图。检测器先随机抓两颗细胞平均出「假双细胞」，把它们和真实条码一起投影到 PCA，再看每个条码的邻居里假双细胞有多少。邻居全是假货，它自己也像双细胞。异型双细胞（T 细胞 + B 细胞）最危险，因为会假扮过渡态。",
      },
      {
        type: "p",
        text: "两个细胞进一个液滴，会制造假的中间态和假的共表达。Xi & Li 的基准里，scDblFinder 准确率和稳定性都靠前。关键约束：按样本分别跑。聚合后再检测，模型会把批次差异当成「双细胞信号」。同型双细胞（两颗 T 细胞）更难抓，但对注释的伤害也小一些。",
      },
      {
        type: "code",
        lang: "python",
        caption: "双细胞按样本跑。这里用 scrublet 演示形状；原书更常点名 scDblFinder",
        code: `import pandas as pd
import scanpy.external as sce

# 千万不要先 adata = ad.concat(...) 再跑
scores = []
for sample in adata.obs["sample"].unique():
    sub = adata[adata.obs["sample"] == sample].copy()
    sce.pp.scrublet(sub, expected_doublet_rate=0.06)
    scores.append(sub.obs[["doublet_score", "predicted_doublet"]])

adata.obs["predicted_doublet"] = pd.concat(scores).loc[adata.obs_names, "predicted_doublet"]
print(adata.obs.predicted_doublet.value_counts())
adata = adata[~adata.obs["predicted_doublet"]].copy()`,
      },
      {
        type: "h2",
        text: "滤完之后，再看一次图",
      },
      {
        type: "p",
        text: "QC 不是滤完就算。把同一张 UMI–基因散点和小提琴再画一遍：斜线是不是更干净、mt% 的长尾是不是收短了、还剩多少细胞。原书示范里，过滤前后细胞数会少一截，但主要岛应该还在。如果某种你预期存在的类型（比如浆细胞、上皮）整群消失，阈值太狠，放回去重切。注释完成之后再把 mt%、n_counts 涂到 UMAP 上——某一座岛整座发红，那是漏网的死细胞，不是新类型。",
      },
      {
        type: "callout",
        kind: "tip",
        title: "环境 RNA 什么时候值得管",
        body: "先在 UMAP 上画组织标志基因：HBB（血）、INS（胰）、SFTPC（肺）、ALB（肝）。如果这些基因在所有细胞类型上「全图开花」，而不是只亮在该亮的岛上，再上 SoupX / CellBender。没有全图开花，就不必为了流程完整而减背景——减过头会把真信号一起削掉。",
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "别为了让 p 值好看而改 QC",
        body: "阈值应当在看差异检验之前定下来。用聚类或 UMAP 回看 QC 是否合理可以；用 DE 结果倒逼 QC，不行。",
      },
      {
        type: "callout",
        kind: "rec",
        title: "基因要不要滤",
        body: "原书指出，按基因做硬过滤对下游没有明显好处。线粒体基因可以留着，也可以在 PCA 时回归，取决于你问的问题。不要默默丢掉再也不提。",
      },
    ],
  },
  {
    slug: "normalization",
    no: "06",
    title: "归一化：让细胞可以互相比较",
    titleEn: "Normalization",
    part: "preprocess",
    minutes: 28,
    blurb: "测序深度不是生物学。Shifted log、scran、Pearson 残差，各有各的下游。",
    objectives: [
      "解释为什么不能拿原始 UMI 直接算距离",
      "按后面要做的事来选归一化",
      "分清 normalize 和 scale 不是一回事",
    ],
    sourcePath: "preprocessing_visualization/normalization.ipynb",
    tools: ["shifted log1p", "scran", "Pearson residuals", "scVI", "sctransform"],
    takeaways: [
      "Shifted logarithm 对稳定方差、随后做降维很稳，是探索的默认起步。",
      "scran 的池化大小因子，在后面还要做批次校正时更顺手。",
      "解析 Pearson 残差更适合选高变基因、找稀有身份。",
    ],
    blocks: [
      {
        type: "p",
        text: "每个细胞被测到的 UMI 总数，差一个数量级很常见。不处理的话，PCA 第一主成分往往只是在说「这个细胞测得深不深」。归一化想把技术深度从生物学差异里剥开——剥得干净不干净，后面邻居图就长得不一样。",
      },
      {
        type: "h2",
        text: "三种被基准托住的做法",
      },
      {
        type: "table",
        headers: ["方法", "直觉", "更适合"],
        rows: [
          ["Shifted log（log1p CP10k）", "除以库大小，再取 log", "降维、可视化、通用探索"],
          ["scran pooling", "用细胞池估计大小因子，比较扛零", "后面还要做批次整合"],
          ["Analytic Pearson residuals", "相对负二项饱和模型的残差", "选基因、找稀有类型"],
        ],
      },
      {
        type: "p",
        text: "这不是选美冠军。Heumos 他们写得很明白：归一化要按后续任务选，没有一种变换对所有下游都最优。sctransform 是 Pearson 残差路线在 R 里的近亲；scVI 则把归一化折进生成模型，不再单独给你一张「已经归一化好的矩阵」。",
      },
      {
        type: "p",
        text: "原书用同一份数据，把三种方法的「单个基因计数分布」画出来给你对比。你会看到：shifted log 之后分布被压到右侧一截，高峰变矮；scran 形状相近，但大小因子不是简单的总 UMI；Pearson 残差可以是负数——它已经不是计数了，是「相对负二项模型多出来的那一截」。",
      },
      {
        type: "figure",
        fig: "book-norm-log1p",
        caption: "原书实际输出：shifted logarithm 之后，某个基因在所有细胞里的计数分布。高峰从零附近被推开，长尾被 log 压短。这就是「稳定方差」的样子——后面 PCA 才不会被高表达基因霸占。",
      },
      {
        type: "figure",
        fig: "book-norm-scran",
        caption: "原书实际输出：scran 池化大小因子归一化后的同一基因。和 log1p 很像，但每个细胞的缩放系数来自「一池相似细胞」的估计，对零膨胀更扛。原书把它留给后面还要做批次整合的场景。",
      },
      {
        type: "figure",
        fig: "book-norm-pearson",
        caption: "原书实际输出：analytic Pearson residuals。注意坐标可以小于 0。残差大，表示这个基因在这个细胞里比负二项饱和模型预期的更「意外」。意外，往往就是细胞类型信号。所以它适合选 HVG、找稀有类型，不适合再送给 DESeq2。",
      },
      {
        type: "code",
        lang: "python",
        caption: "原书默认的探索起步：shifted logarithm，并且不覆盖 counts",
        code: `adata.layers["counts"] = adata.X.copy()

# target_sum=None 表示按中位库大小缩放，也常用 1e4
scaled = sc.pp.normalize_total(adata, target_sum=1e4, inplace=False)
adata.layers["log1p_norm"] = sc.pp.log1p(scaled["X"], copy=True)
adata.X = adata.layers["log1p_norm"]

sc.pl.scatter(adata, x="total_counts", y="n_genes_by_counts", color="sample")`,
      },
      {
        type: "code",
        lang: "python",
        caption: "同一份数据，换 Pearson 残差（原书用于选 HVG / 稀有类型）",
        code: `from scipy.sparse import csr_matrix

pr = sc.experimental.pp.normalize_pearson_residuals(adata, inplace=False)
adata.layers["pearson_residuals"] = csr_matrix(pr["X"])

# 注意：残差可以是负数，不能再当 counts 送给 DESeq2 或 scVI`,
      },
      {
        type: "h2",
        text: "大小因子在算什么",
      },
      {
        type: "p",
        text: "最朴素的想法：每个细胞除以自己的总 UMI，再乘一个目标（常是 10,000），再 log1p。这就是 shifted log。它假设「总 UMI 就是测序深度」。这个假设在细胞大小差很多时会歪——浆细胞真的比naive B 转录更活跃，把它们压到同一个总和，等于把生物学当深度砍掉。scran 的对策是：先粗聚类，在一池相似细胞里估计大小因子，再给每个细胞一个更稳的缩放系数。所以它更扛零，也更适合后面还要做批次整合的场景。",
      },
      {
        type: "p",
        text: "Pearson 残差走另一条路。它先假定 counts 来自负二项（均值–方差挂钩），再问每个数字「相对这个模型有多意外」。残差可以是负数，已经不是计数。意外的基因，往往就是细胞类型基因。所以它适合选 HVG、找稀有身份；不适合再塞回 DESeq2。scVI 更进一步：根本不单独给一张归一化矩阵，深度当成生成模型里的一个参数。",
      },
      {
        type: "h2",
        text: "Normalize ≠ Scale",
      },
      {
        type: "p",
        text: "归一化处理的是细胞之间的深度差异。Scale（z-score）处理的是基因之间的量纲，常有人在 PCA 前随手做。过度 scale 会放大噪声基因；基准显示它常让整合方法更拼命「去批次」，把生物学也一起修掉。默认不要把 scale 当成必选项。",
      },
      {
        type: "callout",
        kind: "warn",
        title: "对数之后，就不是计数了",
        body: "DESeq2、edgeR、scVI、一部分轨迹模型要整数 counts。把 log 矩阵塞进去，模型假设当场破产。",
      },
      {
        type: "callout",
        kind: "tip",
        title: "一张图就能检验",
        body: "同一张 UMAP，分别用 raw counts、log1p、Pearson 残差去着色「总 UMI」。哪一张上深度梯度消失得最干净，哪一张就更适合拿去建邻居图。",
      },
    ],
  },
  {
    slug: "feature-selection",
    no: "07",
    title: "特征选择：留下会说话的基因",
    titleEn: "Feature selection",
    part: "preprocess",
    minutes: 22,
    blurb: "两万基因里，真正区分细胞类型的往往只有一两千。选错了，稀有类型会从地图上蒸发。",
    objectives: [
      "说明 HVG 要的是「类型之间」的变异，不是「同类型内部」的乱跳",
      "知道大概选多少、在哪一步选",
      "把特征选择和后面整合好不好联系起来",
    ],
    sourcePath: "preprocessing_visualization/feature_selection.ipynb",
    tools: ["Seurat vst", "Pearson residuals", "Scanpy highly_variable_genes"],
    takeaways: [
      "好的特征选择优先留下亚群之间在变的基因，同时不牺牲稀有亚群。",
      "高变基因通常优于拿全部基因去做整合。",
      "2000–5000 是常见工作区间，没有魔法数字。用 marker 召回做体检。",
    ],
    blocks: [
      {
        type: "p",
        text: "计数矩阵有两万列。其中大量基因在所有细胞里几乎恒定，或者只是技术噪声在跳。特征选择把矩阵压到「最有信息的那些基因」：计算更轻，模型也被迫盯生物学，而不是盯文库深度。",
      },
      {
        type: "h2",
        text: "什么叫「有信息」",
      },
      {
        type: "p",
        text: "好的 HVG 在细胞类型之间变，而不是在同一种细胞内部因为 dropout 乱跳。Fano factor、Seurat vst、Pearson 残差，都在试图把「均值越大方差越大」这件技术事实剥掉，留下超额的生物学方差。",
      },
      {
        type: "figure",
        fig: "book-hvg-schematic",
        caption: "原书示意图。灰色点是「均值-方差技术关系」上的基因，它们随表达量升高而变吵，但并不区分细胞类型。橙色点是偏离这条线的基因——细胞类型之间在变。特征选择要的是橙色，不是灰色。",
      },
      {
        type: "figure",
        fig: "book-hvg-meanvar",
        caption: "原书 notebook 实际输出。横轴平均表达，纵轴标准化方差，黑点是被挑中的高变基因。你会看到一条从左下到右上的云：技术关系。黑点是云上方那些「比预期更吵」的基因。左下角那些几乎不表达的基因，即使偶尔跳一下，也不该进 HVG。",
      },
      {
        type: "ul",
        items: [
          "选太少：相近类型融成一团，稀有类型没有标记可认",
          "选太多：噪声维度增加，UMAP 变碎，整合更别扭",
          "批次之间分别选再取并集：能留下某批次私有的生物学；取交集：更保守，更好整合",
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "原书常用：seurat_v3，按批次联合选择",
        code: `sc.pp.highly_variable_genes(
    adata,
    n_top_genes=3000,
    flavor="seurat_v3",
    layer="counts",
    batch_key="sample",
)
print(adata.var["highly_variable"].sum(), "HVGs")

adata_hvg = adata[:, adata.var["highly_variable"]].copy()
sc.pl.highly_variable_genes(adata)`,
      },
      {
        type: "p",
        text: "原书这一章用的 flavor 是 seurat_v3，它在 counts 上按均值分箱，再找每箱里方差最高的基因。batch_key='sample' 表示每个样本先各自选，再合并——某批次私有的生物学（比如只有疾病组才有的状态）不容易被丢掉。如果你写 batch_key 却取了交集思维，稀有类型的私有 marker 会先消失。Pearson 残差路线则是：先对全矩阵算残差，再按残差方差排序。两种都能用；关键是选完之后做体检。",
      },
      {
        type: "h2",
        text: "怎么知道自己选对了",
      },
      {
        type: "ol",
        items: [
          "把你认得的谱系 marker（PTPRC、EPCAM、COL1A1、CD3D、MS4A1、LYZ）列出来，看它们是否落在 HVG 里。经典 marker 大面积落选，n_top_genes 可能太小，或 batch 合并方式太狠。",
          "看均值-方差图：黑点应该是云的上沿，不是随机撒点，也不是全部堆在高表达区。",
          "细胞周期、血红蛋白、热休克如果霸占前几个 PC，它们「高变」但不是你的故事——记下，必要时回归。",
        ],
      },
      {
        type: "callout",
        kind: "rec",
        title: "这一步会改整合成绩",
        body: "scIB 基准反复显示：先选 HVG 再整合，通常优于用全基因。特征选择不是预处理小品，它会改 query mapping 的表现。",
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "细胞周期、血红蛋白、热休克",
        body: "它们常常「非常高变」，却不一定是你想讲的故事。HVG 之后看看它们是否主导了前几个 PC；必要时回归或拿掉，但要在方法里写出来。",
      },
    ],
  },
  {
    slug: "dimensionality",
    no: "08",
    title: "降维：给算法一张桌，给人一幅画",
    titleEn: "Dimensionality reduction",
    part: "preprocess",
    minutes: 26,
    blurb: "PCA 是计算用的。UMAP 是给人看的。别在那张好看的画上做统计。",
    objectives: [
      "分清线性降维（PCA）和图嵌入（UMAP / t-SNE）",
      "把邻居图建在 PCA 空间里",
      "克制把可视化距离当成生物学距离",
    ],
    sourcePath: "preprocessing_visualization/dimensionality_reduction.ipynb",
    tools: ["PCA", "UMAP", "t-SNE", "PHATE"],
    takeaways: [
      "统计分析走 PCA 或模型潜空间；UMAP / t-SNE 只负责展示。",
      "邻居图建在 PCA 上。不要在 UMAP 坐标上再聚类。",
      "选多少个 PC，看拐点或置换，而不是永远 50。",
    ],
    blocks: [
      {
        type: "p",
        text: "单细胞矩阵又高又稀。直接在两万维里量距离，噪声会把类型差异淹没。降维其实在做两件不同的事：给算法一张好用的矮桌子（PCA、scVI 潜空间），给人眼一幅能看的画（UMAP、t-SNE）。把两件事混为一谈，是这条路上最贵的概念错误。",
      },
      {
        type: "figure",
        fig: "book-dim-schematic",
        caption: "原书示意图：每个细胞是高维空间里的一个点，降维是把它们安排到人能看的平面上。安排的过程会丢信息。PCA 丢得老实（线性、可逆的那部分），UMAP 丢得好看（非线性、不可拿来量距离）。",
      },
      {
        type: "figure",
        fig: "pca-umap",
        caption: "左边叠在一起没关系，那是给邻居图用的。右边岛分开了很好看——请克制在岛与岛之间量距离。",
      },
      {
        type: "h2",
        text: "PCA：给算法坐",
      },
      {
        type: "p",
        text: "PCA 找解释方差最多的正交方向。前二三十个 PC 通常已经抓住细胞类型结构。邻居图、Leiden、Harmony、轨迹的初始化，都该发生在这组坐标上。PC 太多会把噪声放进来，太少会把相近类型压成一张饼。原书强调：先把数据放到归一化后的 X 上再做 PCA，因为原始计数极度右偏，高表达基因会霸占前几个 PC。",
      },
      {
        type: "figure",
        fig: "book-dim-pca",
        caption: "原书实际输出：前两个主成分。细胞类型往往叠在一起，这不叫失败。PCA 的任务不是给你一张发表图，是给后面的邻居图一张去过噪的桌子。真正分得开的结构，在更高的 PC 里，以及在邻居图上。",
      },
      {
        type: "h2",
        text: "t-SNE 和 UMAP：给人看",
      },
      {
        type: "p",
        text: "它们是非线性的，比较在乎局部邻域。图上相邻，大致意味表达相似；图上离得远、簇的大小、空隙有多宽，都不能严格解释。t-SNE 更强调局部簇，全局骨架不稳定，两次运行难以比较。UMAP 通常更快，全局结构稍好一点，但仍不能当距离。禁止清单：在 UMAP 上算距离、做聚类、做 p 值、说「这两群更近所以更相关」。",
      },
      {
        type: "figure",
        fig: "book-dim-tsne",
        caption: "原书实际输出：t-SNE。岛分得很开，边缘清晰。请记住：空隙宽度和岛的相对位置，换一个随机种子就会搬家。",
      },
      {
        type: "figure",
        fig: "book-dim-umap",
        caption: "原书实际输出：同一份数据的 UMAP。和 t-SNE 相比，岛之间还留着一点连续的「桥」。桥好看，不一定是生物学过渡态——也可能只是邻域图把它们轻轻连上了。",
      },
      {
        type: "figure",
        fig: "book-dim-qc-umap",
        caption: "原书实际输出：把 QC 指标涂回 UMAP。从左到右、从上到下分别是总 counts、基因数、线粒体%、核糖体%、MALAT1、血红蛋白。如果某一座岛整座都是高 mt% 或超高 counts，那座岛可能是死细胞或双细胞漏网，而不是新类型。降维之后再看一次 QC，是原书特意留下的一步。",
      },
      {
        type: "code",
        lang: "python",
        caption: "原书这一章的标准顺序：PCA → 邻居图 → 可视化 / 聚类",
        code: `sc.tl.pca(adata, n_comps=50)
sc.pl.pca_variance_ratio(adata, n_pcs=50, log=True)  # 看拐点

sc.pp.neighbors(adata, n_neighbors=15, n_pcs=30)     # 图建在 PCA
sc.tl.umap(adata)                                     # 只为了看
sc.tl.leiden(adata, resolution=0.5)                   # 聚类走邻居图

sc.pl.umap(adata, color=["leiden", "sample", "total_counts"])`,
      },
      {
        type: "figure",
        fig: "umap-islands",
        caption: "发表时你会交出这样的图。请在图注里老实写：这是可视化，结论来自 PCA / 潜空间上的统计。",
      },
      {
        type: "h2",
        text: "用几个 PC，几个邻居",
      },
      {
        type: "p",
        text: "n_pcs 不是永远 50。画 sc.pl.pca_variance_ratio，找「拐点」：解释方差开始变平的地方。血液数据常常 20–30 个就够；复杂组织、多种批次，也许要 40–50。用太多 PC 等于把噪声维度喂给邻居图，UMAP 会碎、Leiden 会切出没有 marker 的小簇。n_neighbors 控制「局部」有多局部：10–15 看细结构，30–50 更平滑、更顾大局。没有正确值，但有体检：换一组参数，主要谱系还在不在。",
      },
      {
        type: "p",
        text: "邻居图才是后面聚类、PAGA、不少轨迹方法真正坐的桌子。sc.pp.neighbors 默认在 X_pca 上算。如果你做了 Harmony 或 scVI，一定要 use_rep='X_pca_harmony' 或 'X_scVI'，否则整合白做——图还是建在未校正的 PCA 上。这是非常常见、也非常安静的事故。",
      },
      {
        type: "table",
        headers: ["方法", "请用它", "请别用它"],
        rows: [
          ["PCA", "计算、去噪、喂给下游", "当最终科学图（类型常常叠在一起）"],
          ["UMAP", "展示全局加局部", "定量距离、聚类"],
          ["t-SNE", "展示局部簇", "看全局骨架、比较两次运行"],
          ["PHATE", "展示连续轨迹", "离散分群的默认选择"],
        ],
      },
      {
        type: "callout",
        kind: "warn",
        title: "随机种子会搬家",
        body: "UMAP 每次初始化都可能把簇摆到不同角落。发表时固定 random_state，并声明「布局不能当生物学」。科学结论应来自 PCA 或潜空间，而不是某张刚好好看的二维图。",
      },
    ],
  },
];
