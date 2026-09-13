import type { Chapter } from "./types";

export const DOWNSTREAM_CHAPTERS: Chapter[] = [
  {
    slug: "dge",
    no: "12",
    title: "差异表达：细胞不是生物学重复",
    titleEn: "Differential expression",
    part: "conditions",
    minutes: 30,
    blurb: "伪 bulk + edgeR / DESeq2，是目前更站得住的默认。把细胞当重复，p 值会假得发光。",
    objectives: [
      "分清 cell-level 和 sample-level 两种问法",
      "写出包含批次和供体的 design matrix",
      "按细胞类型分别过滤低表达基因",
    ],
    sourcePath: "conditions/differential_gene_expression.ipynb",
    tools: ["pyDESeq2", "edgeR", "DESeq2", "pseudobulk"],
    takeaways: [
      "两种视角：细胞级和样本级。对 scRNA-seq，样本级被证明更稳。",
      "按供体 × 细胞类型把 counts 加总成伪 bulk，再交给 edgeR / DESeq2。",
      "建模前先对伪 bulk 做 PCA，把看见的变异源写进 design。",
    ],
    blocks: [
      {
        type: "p",
        text: "「哪些基因在疾病里变了」听起来像单细胞的本职工作，却是最容易在统计上翻车的一步。经典错误：把每个细胞当成独立重复。于是 8000 个 T 细胞对 8000 个 T 细胞，p 值全部小于 10⁻⁵⁰。真正的重复，其实只有 4 个病人。",
      },
      {
        type: "callout",
        kind: "cite",
        title: "原书网页 Key takeaways",
        body: "差异表达有两种视角：细胞级和样本级。对 scRNA-seq，样本级被证明更稳。按供体 × 细胞类型把 counts 加总成伪 bulk，再交给 edgeR / DESeq2。建模前先对伪 bulk 做 PCA，把看见的变异源写进 design。低表达基因要按细胞类型分别过滤。网页还点名：单细胞专用方法更容易把高表达基因误判成差异基因；Wilcoxon / 默认 Seurat 若不处理供体结构，就是伪重复。",
      },
      {
        type: "figure",
        fig: "book-dge-schematic",
        caption: "原书示意图。左边是细胞级检验（每个点是一个细胞），右边是样本级伪 bulk（每个点是一个供体 × 细胞类型）。原书的结论很硬：问处理效应时，走右边。",
      },
      {
        type: "figure",
        fig: "pseudobulk",
        caption: "颜色代表供体，不是细胞。加总之后，你才回到「样本」这个该有的重复单元。",
      },
      {
        type: "figure",
        fig: "book-dge-pca",
        caption: "原书实际输出：伪 bulk 表做完 PCA。每个点是一个（供体 × 条件）样本，不再是细胞。你要在这张图上看：批次、性别、供体有没有盖过处理。看见的变异源，必须写进 design matrix。",
      },
      {
        type: "h2",
        text: "样本级：把细胞收成伪 bulk",
      },
      {
        type: "p",
        text: "对每个（供体 × 细胞类型）把原始计数求和，得到一张看起来像 bulk RNA-seq 的表。然后用为 bulk 设计的负二项模型（edgeR、DESeq2、pyDESeq2）。生物学重复是供体、小鼠、培养皿，不是细胞。",
      },
      {
        type: "ol",
        items: [
          "确认每个伪 bulk 里有足够细胞，太瘦的组合丢掉或合并",
          "按细胞类型分别去掉低表达基因——不同类型的表达目录本来就不一样",
          "对伪 bulk 做 PCA：批次、性别、供体有没有盖过处理",
          "design 写全：~ batch + sex + condition，再用 contrast 去测你真正关心的比较",
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "伪 bulk 的形状：一行是一个（供体, 类型）",
        code: `import pandas as pd

counts = adata.to_df(layer="counts")
counts["donor"] = adata.obs["donor"].values
counts["cell_type"] = adata.obs["cell_type"].values

pseudo = counts.groupby(["donor", "cell_type"]).sum()
print(pseudo.shape)
# 例如 6 个供体 × 8 种类型 → 最多 48 行，而不是 30,000 行细胞`,
      },
      {
        type: "h2",
        text: "细胞级什么时候还能用",
      },
      {
        type: "p",
        text: "找簇内 marker（这一簇 vs 其余）时，细胞级 Wilcoxon / t-test 仍是好用的探索工具。它回答的是「这簇长什么样」，不是「处理造成了什么」。把 marker 检验的 p 值写进疾病机制，属于偷换假设。",
      },
      {
        type: "code",
        lang: "python",
        caption: "找 marker 可以；把结果写成处理效应不行",
        code: `sc.tl.rank_genes_groups(adata, groupby="leiden", method="wilcoxon")
sc.pl.rank_genes_groups_dotplot(adata, n_genes=5)

# 这张图很适合注释。
# 若问的是「疾病 vs 对照」，请回到伪 bulk。`,
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "伪重复",
        body: "同一供体的数千细胞高度相关。忽略供体结构，等于把有效样本量从 N=6 假装成 N=30000。这是单细胞统计里被抓得最多的错误。",
      },
      {
        type: "callout",
        kind: "rec",
        title: "先看图，再写公式",
        body: "原书强调：先对伪 bulk 做 PCA，再决定 design 里要哪些协变量。看见的变异源不写进公式，公式就会把它们误当成处理效应。",
      },
      {
        type: "figure",
        fig: "book-dge-volcano",
        caption: "原书实际输出：pyDESeq2 火山图。横轴 log2 倍数，纵轴 −log10 p。两侧飞出去的点才是差异基因。如果整张图像烟花——几乎每个基因都显著——回头查是不是还在用细胞当重复。这张图干净，是因为重复单元已经回到了样本。",
      },
      {
        type: "figure",
        fig: "book-dge-ma",
        caption: "原书实际输出：MA 图。横轴是平均表达（log mean），纵轴是 log2 倍数。火山图强调显著性，MA 图强调「这个差异是不是只发生在几乎不表达的基因上」。两侧低表达区飞出去的点，先当噪声；真正要讲的故事，多半在中等到高表达、同时 log2FC 也够大的那一截。",
      },
      {
        type: "code",
        lang: "python",
        caption: "pyDESeq2 的最小形状：伪 bulk → design → 火山图 / MA 图",
        code: `from pydeseq2.dds import DeseqDataSet
from pydeseq2.ds import DeseqStats

# pseudo: 行是 sample_id，列是基因，值是整数 counts
# meta: 同一行顺序的 condition / donor / batch
dds = DeseqDataSet(counts=pseudo, metadata=meta, design_factors="condition")
dds.deseq2()
stat = DeseqStats(dds, contrast=["condition", "stim", "ctrl"])
stat.summary()
res = stat.results_df.sort_values("padj")
print(res.head(15)[["log2FoldChange", "padj"]])`,
      },
    ],
  },
  {
    slug: "compositional",
    no: "13",
    title: "组成分析：谁变多了，谁变少了",
    titleEn: "Compositional analysis",
    part: "conditions",
    minutes: 18,
    blurb: "细胞比例住在三角形里。不要对原始百分比做普通 t 检验。",
    objectives: [
      "理解组成数据的定和约束",
      "知道 Dirichlet / scCODA 一类模型在管什么",
      "把解离偏差当成组成分析的死敌",
    ],
    sourcePath: "conditions/compositional.ipynb",
    tools: ["scCODA", "Dirichlet models", "propeller"],
    takeaways: [
      "一类细胞变多，其余类型的百分比必然被挤——这是组成数据，不是一串独立比例。",
      "用专门的组成模型，并且纳入供体重复。",
      "解离偏好会假装成疾病组成变化。实验设计比模型更早介入。",
    ],
    blocks: [
      {
        type: "p",
        text: "单细胞论文里最显眼的条形图，往往是「疾病组巨噬细胞从 8% 涨到 22%」。百分比有一个讨厌的脾气：它们加起来必须是 1。一种细胞上涨，其他细胞的份额被自动挤下去，哪怕绝对数量没变。普通 t 检验把各类型当成独立变量，会制造一串假阳性。",
      },
      {
        type: "callout",
        kind: "cite",
        title: "原书网页想让你记住的",
        body: "组成数据住在单纯形上：一类涨，其余被挤。分析单位是样本，不是细胞。专门的 Dirichlet / scCODA / propeller 把定和约束写进模型；对原始百分比做 t 检验，等于假装各类型互相独立。解离偏好会假装成疾病浸润——实验设计比模型更早介入。",
      },
      {
        type: "figure",
        fig: "book-comp-schematic",
        caption: "原书示意图。组成数据住在单纯形上：一类涨，其余被挤。分析单位是样本，不是细胞。",
      },
      {
        type: "figure",
        fig: "simplex",
        caption: "三种细胞的比例住在三角形的内部，不能独立乱跑。统计时要把这个约束写进模型。",
      },
      {
        type: "figure",
        fig: "book-comp-box",
        caption: "原书实际输出：各细胞类型在不同条件下的比例。看的是箱线（样本间变异），不是每个细胞的条形图。箱线重叠很大时，即使均值有差，也先别写「显著浸润」。",
      },
      {
        type: "h2",
        text: "比较站得住的姿势",
      },
      {
        type: "p",
        text: "scCODA 用 Hamiltonian Monte Carlo 拟合层次 Dirichlet-多项式模型，并选一个相对稳定的参考细胞类型。propeller（speckle）走经验贝叶斯，中等样本更快。无论哪一种，重复单元仍是样本，不是细胞。",
      },
      {
        type: "p",
        text: "参考细胞类型这件事值得停一下。组成模型必须指定「谁被当成尺子」：这一类的绝对数量假定不太随条件变，其他类型相对它涨跌。选错参考（比如把你真正关心的巨噬细胞当成参考），效应会被吞掉。原书的建议是挑一种相对稳定、数量不太少的类型——常常是某种基质或一种不太响应处理的淋巴细胞。事先登记你关心的类型，避免对 40 个簇做无校正的全面比较。",
      },
      {
        type: "code",
        lang: "python",
        caption: "先把每个样本的类型计数表拿出来",
        code: `comp = (
    adata.obs.groupby(["donor", "condition", "cell_type"])
    .size()
    .unstack("cell_type")
    .fillna(0)
)
print(comp.head())
# 每一行是一个供体，每一列是一种细胞的个数
# 把这张表交给 scCODA / propeller，而不是对百分比做 t 检验`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "解离在说谎",
        body: "成纤维难抓，免疫细胞好抓。疾病组织若更容易解离出免疫细胞，组成变化可能是实验假象。单核、核计数、空间验证是补救，不是事后把 p 值调小。",
      },
      {
        type: "ul",
        items: [
          "报告每个样本的细胞数，过浅的文库不要进组成检验",
          "预先登记你关心的类型，避免对 40 个簇做无校正的全面比较",
          "能做配对（治疗前后同一供体）就做配对",
        ],
      },
    ],
  },
  {
    slug: "gsea",
    no: "14",
    title: "通路：把基因表翻译成句子",
    titleEn: "GSEA and pathways",
    part: "conditions",
    minutes: 22,
    blurb: "列表之后要讲人话。富集是翻译层，不是新的实验证据。",
    objectives: [
      "分清 ORA 和 GSEA / 活性推断",
      "避免用细胞级 DE 的基因列表去做富集",
      "把结果读成假设发生器，而不是机制证明",
    ],
    sourcePath: "conditions/gsea_pathway.ipynb",
    tools: ["decoupler", "GSEA", "ORA", "AUCell"],
    takeaways: [
      "ORA 吃被阈值切过的基因列表；GSEA / decoupler 吃整条排序或表达矩阵，通常更稳。",
      "输入必须来自合理的 DE（优先伪 bulk），否则是对伪重复的二次放大。",
      "通路名字是注释。实验验证之前，不要写成机制结论。",
    ],
    blocks: [
      {
        type: "p",
        text: "差异表达给你一张基因表。通路分析把它翻译成「干扰素响应」「氧化磷酸化」「EMT」。翻译得不好，就会出现「癌症通路」这种正确但没用的句子。它能帮你说话，不能替你做实验。",
      },
      {
        type: "table",
        headers: ["家族", "吃什么", "代表"],
        rows: [
          ["ORA", "显著基因列表", "David、Enrichr"],
          ["GSEA 类", "排序后的全部基因", "fgsea、GSEApy"],
          ["活性推断", "表达矩阵 + 先验网络", "decoupler、AUCell、DoRothEA"],
        ],
      },
      {
        type: "p",
        text: "decoupler 是原书生态里比较舒服的入口：同一套 API 可以跑富集、转录因子活性和通路活性。先验网络（PROGENy、DoRothEA、CollecTRI、MSigDB）的质量，就是你结果的天花板。",
      },
      {
        type: "h2",
        text: "细胞级打分：先看这张 UMAP",
      },
      {
        type: "figure",
        fig: "book-gsea-aucell",
        caption: "原书实际输出：把 Reactome 干扰素通路的 AUCell 分数涂在 UMAP 上。刺激组的单核、DC 应该亮，巨核不应该。读图时问两句：高分是不是落在你预期的细胞类型？对照和刺激有没有分开？所有细胞一起亮，更像批次或深度，不像通路。",
      },
      {
        type: "p",
        text: "AUCell 的直觉很朴素：把每个细胞的基因按表达排序，看某个基因集有没有挤在最前面。它给每个细胞一个分数，所以你可以像画 CD3D 那样把通路画在 UMAP 上。这是探索。要比较「刺激 vs 对照」，还是应该回到伪 bulk 的排序基因，再跑 GSEA。",
      },
      {
        type: "h2",
        text: "群体对比：看这张条形图",
      },
      {
        type: "figure",
        fig: "book-gsea-bar",
        caption: "原书实际输出：对单核的 stim vs ctrl 做 GSEA。横轴是符号富集分数，正值上调、负值下调。干扰素通路整齐地排在最右边——这就是「翻译成人话」该有的样子。如果排在最前的是「癌症」「代谢」这种大而无当的集合，多半是基因集没过滤，或输入的排序来自伪重复。",
      },
      {
        type: "p",
        text: "GSEA 吃的是全部基因的排序（t 值、Wald 统计量），不是被 p 值切过的短名单。ORA（超几何 / Fisher）才吃短名单，而且对阈值很敏感。原书更偏向 GSEA / fgsea / decoupler 这一支。基因集先按大小过滤：少于 15 个或多于 500 个的集合方差太大或太泛，去掉。",
      },
      {
        type: "h2",
        text: "沿轨迹的转录因子",
      },
      {
        type: "figure",
        fig: "book-gsea-tf-ptime",
        caption: "原书实际输出：用 CollecTRI 推断 TF 活性，再沿 Palantir 拟时序着色。FOSB、HIVEP2 这类因子在后期亮起，LEF1 在淋巴前体。这张图把「通路」从静态的条形图，变成了「谁在这条分化路上依次上场」。读的时候核对：早期应该亮的谱系 TF 是不是真的在左边。",
      },
      {
        type: "code",
        lang: "python",
        caption: "decoupler 的最小形状（示意）",
        code: `import decoupler as dc

net = dc.get_progeny(organism="human")
dc.run_mlm(mat=adata.to_df(), net=net, source="source", target="target", weight="weight")
acts = dc.get_acts(adata, obsm_key="mlm_estimate")
sc.pl.umap(adata, color=["JAK-STAT", "Trail"], cmap="coolwarm")`,
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "背景基因弄错了",
        body: "ORA 的宇宙应该是你真正检测过的基因，不是整个基因组。用全基因组当背景，组织特异基因会被系统性判成「富集」。",
      },
    ],
  },
  {
    slug: "perturbation",
    no: "15",
    title: "扰动：确认这一刀切中了",
    titleEn: "Perturbation modeling",
    part: "conditions",
    minutes: 20,
    blurb: "CRISPRi、药物、细胞因子。对照、多重感染和模型假设，要比那张网络图更先讲。",
    objectives: [
      "把扰动实验还原成「干预 + 读出」",
      "知道 pertpy 在原书里的位置",
      "警惕把相关当成干预效应",
    ],
    sourcePath: "conditions/perturbation_modeling.ipynb",
    tools: ["pertpy", "mixscape", "scGen", "augur"],
    takeaways: [
      "第一件事：确认扰动真的发生了（guide 赋值、靶基因下调）。",
      "Mixscape 一类方法会把「处理组里其实没被切到的细胞」拿掉，避免把效应稀释。",
      "生成模型能预测没见过的组合扰动，但外推必须用湿实验打脸。",
    ],
    blocks: [
      {
        type: "p",
        text: "Perturb-seq 以及各种药物 / 细胞因子处理，把单细胞从观察推进到干预。分析目标不再只是「有哪些细胞」，而是「这一刀切下去，转录组往哪走」。刀有没有切中，比后面的网络图重要得多。",
      },
      {
        type: "figure",
        fig: "crispr-cut",
        caption: "扰动实验的直觉：处理组里并不是每一颗细胞都被切中。有的 guide 没表达，有的编辑失败。分析的第一件事是把「真正被扰动的细胞」和「名义上在处理组里的细胞」分开。",
      },
      {
        type: "figure",
        fig: "book-pert-eccite",
        caption: "原书：ECCITE 一类实验把 CRISPR 扰动、抗体蛋白和转录组接到同一颗细胞上。分析的第一件事仍是确认 guide 赋值和靶基因下调，而不是直接画漂亮的网络。",
      },
      {
        type: "figure",
        fig: "book-tumor-tracing",
        caption: "原书网页（谱系示踪章）的示意图：CRISPR 把随机条码写进基因组，子细胞带着同一串疤。肿瘤里的克隆扩张、治疗抗性，靠的是这条「写进 DNA 的时间线」，不是 UMAP 上的距离。扰动实验和谱系示踪经常做在同一套数据上——网页把它们分开讲，是怕你把「切了一刀」和「谁是谁的后代」混成一张图。",
      },
      {
        type: "h2",
        text: "先确认刀切中了",
      },
      {
        type: "ul",
        items: [
          "sgRNA / barcode 的赋值质量、多重感染率",
          "靶基因是否真的下降（CRISPRi）或编辑成功",
          "对照 guide、非靶向对照，是否还和野生型重叠",
        ],
      },
      {
        type: "p",
        text: "Mixscape 会显式建模「处理组里其实没被扰动到的细胞」，并把它们从效应估计里拿掉。忽略这一点，剂量会被严重低估。它先用 k 近邻对照细胞减掉局部背景（批次、细胞周期），再把每个靶基因的细胞拟合成 KO / NP（non-perturbed）混合分布。后验概率 > 0.5 的才算切中。",
      },
      {
        type: "figure",
        fig: "book-pert-violin",
        caption: "原书实际输出：IFNGR2 的 Mixscape 扰动分数。NT（非靶向对照）是一包靠近 0 的分布；KO 类被推到右侧；NP 类还留在对照附近——这些细胞名义上带 IFNGR2 guide，其实没切中。如果跳过分类，把 NP 和 KO 平均在一起，效应会被稀释成「IFNGR2 没什么用」。",
      },
      {
        type: "figure",
        fig: "book-pert-lda",
        caption: "原书实际输出：Mixscape 之后的 LDA 嵌入。每个点是一颗被判定为 KO 的细胞，颜色是靶基因。STAT1、IFNGR1、IFNGR2 这些落在同一条通路上的 KO 靠在一起，是好现象——说明分类抓住的是生物学，不是随机噪声。LDA 只是可视化，不要在这张图上量距离。",
      },
      {
        type: "code",
        lang: "python",
        caption: "pertpy 的入口形状（示意）",
        code: `import pertpy as pt

ms = pt.tl.Mixscape()
ms.mixscape(adata=adata, control="NT", labels="gene_target")
ms.plot_perturbscore(adata=adata, target_gene="IFNGR2", layer="X_pert")`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "组合会爆炸",
        body: "双基因扰动空间随基因数平方增长。模型预测很迷人，预测不等于测量。把预测当发现之前，先抽一组去做湿实验。",
      },
    ],
  },
  {
    slug: "pseudotime",
    no: "16",
    title: "拟时序：给细胞排一条假时间",
    titleEn: "Pseudotime",
    part: "trajectories",
    minutes: 22,
    blurb: "PAGA、Slingshot、Palantir。拓扑决定方法，起点必须有生物学理由。",
    objectives: [
      "把拟时序和墙上的时钟区分开",
      "按轨迹拓扑选方法",
      "把起点 / 终点写成可辩护的选择",
    ],
    sourcePath: "trajectories/pseudotemporal.ipynb",
    tools: ["PAGA", "Slingshot", "Palantir", "CellRank", "dynverse"],
    takeaways: [
      "拟时序是表达相似性上的排序，不是真实时间。",
      "方法选择主要取决于数据规模和轨迹拓扑（线性、分叉、周期）。",
      "dynverse 基准里 PAGA、Slingshot、SCOEPIUS 总体稳健；Monocle 经典，但不是全面冠军。",
    ],
    blocks: [
      {
        type: "p",
        text: "发育、分化、损伤修复里的细胞，常常形成连续光谱，而不是几个孤岛。拟时序在表达空间里给每个细胞一个「沿轨迹的位置」。它看起来像时间，其实只是距离。起点选错，整条故事会倒着讲。",
      },
      {
        type: "figure",
        fig: "trajectory",
        caption: "先问会不会分叉，再给每个细胞一个位置。黑色的起点，应当来自干细胞 marker 或最早的实验时间，而不是 UMAP 的左下角。",
      },
      {
        type: "figure",
        fig: "book-ptime-umap",
        caption: "原书实际输出：拟时序着色的 UMAP。颜色从起点慢慢过渡到终点。读这张图时核对三件事：方向是否符合已知生物学、分叉处有没有低质量细胞冒充过渡态、沿轨迹变化的基因是不是早期 TF 在前、效应分子在后。",
      },
      {
        type: "figure",
        fig: "book-ptime-paga",
        caption: "原书实际输出：PAGA 把簇收成一张粗图。这是造血：HSC 连向各类前体，再分到 B、单核、红系、巨核。线的粗细是连通性。先看这张骨架，再决定要不要在某条边上算拟时序。两个簇之间没有边，就不要强行连成一条分化故事。",
      },
      {
        type: "p",
        text: "PAGA 的价值是让你先看见拓扑：线性、分叉、还是几个断开的岛。骨架对了，再在边上排序。Slingshot 适合线性或少量分叉，主曲线很干净。Palantir 用扩散和熵描述「这个细胞还有多少命运可选」——终点附近熵低，分叉口熵高。",
      },
      {
        type: "figure",
        fig: "book-ptime-fate",
        caption: "原书实际输出：Palantir 的命运概率。左图是走向 B 细胞的概率，右图是走向单核的概率。同一颗细胞在两张图上的颜色互补——概率加起来接近 1。分叉口的细胞两边都是中间色，这才是「尚未决定」；如果一种终点的高概率细胞散落在另一条分支上，起点或终点设错了。",
      },
      {
        type: "h2",
        text: "先画骨架，再排序",
      },
      {
        type: "p",
        text: "PAGA 先把簇抽象成图，判断连通和分叉，再在这张粗图上算位置——适合复杂拓扑，也适合你先看清骨架。Slingshot 在降维空间里拟合主曲线，线性或少量分叉时很干净。Palantir 用扩散和熵描述命运潜能。CellRank 把命运概率建在马尔可夫链上，可以和 RNA 速率结合。",
      },
      {
        type: "code",
        lang: "python",
        caption: "PAGA：先看簇与簇通不通",
        code: `sc.tl.paga(adata, groups="leiden")
sc.pl.paga(adata, color="leiden", fontoutline=2)

sc.tl.umap(adata, init_pos="paga")
sc.pl.umap(adata, color=["leiden", "dpt_pseudotime"])

# 起点：已知的 naive / 干细胞群体，写进方法学
adata.uns["iroot"] = np.flatnonzero(adata.obs["leiden"] == "HSC")[0]
sc.tl.dpt(adata)`,
      },
      {
        type: "callout",
        kind: "rec",
        title: "起点从哪来",
        body: "干细胞 marker、已知的 naive 群体、实验时间最早的样本，或细胞周期评分最低的静息态。不要用 UMAP 左下角当起点。",
      },
      {
        type: "h2",
        text: "读结果时的三条纪律",
      },
      {
        type: "ol",
        items: [
          "轨迹必须与已知生物学同向：造血不能从单核走向 HSC",
          "沿拟时序变化的基因要能讲出阶段（早期 TF → 效应分子）",
          "分叉处的细胞，不要被低质量细胞或双细胞冒充成过渡态",
        ],
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "在已经断开的数据上强行连线",
        body: "如果 Leiden 切出来的是几个完全断开的谱系，拟时序会在空隙上编故事。先用 PAGA 看连通性；不连通，就不要连。",
      },
    ],
  },
  {
    slug: "velocity",
    no: "17",
    title: "RNA 速率：从剪接读方向",
    titleEn: "RNA velocity",
    part: "trajectories",
    minutes: 20,
    blurb: "未剪接 / 已剪接的比值不是万能指南针。假设不成立时，箭头会指反。",
    objectives: [
      "解释 spliced / unspliced 计数从哪来",
      "知道 velocyto / scVelo / dynamo 各自管什么",
      "把速率当成假说，用生物学去打脸",
    ],
    sourcePath: "trajectories/rna_velocity.ipynb",
    tools: ["velocyto", "scVelo", "dynamo", "CellRank"],
    takeaways: [
      "RNA 速率用未剪接和已剪接 mRNA 的比值，估计转录的近期变化方向。",
      "稳态假设经常不成立；dynamical 模型更灵活，但对 3' 数据仍然脆弱。",
      "箭头必须与拟时序、时间标签或已知分化方向一致，否则优先怀疑模型。",
    ],
    blocks: [
      {
        type: "p",
        text: "新转录的 RNA 先带着内含子（unspliced），成熟后变成 spliced。如果某个基因正在被打开，细胞里会暂时堆着更多未剪接分子。速率方法试图从这种失衡估计「下一步表达会往哪走」，然后在 UMAP 上画成箭头。好看，但不保证对。",
      },
      {
        type: "figure",
        fig: "velocity",
        caption: "转录、剪接、降解是三种不同的速度。模型要把它们从一堆稀疏计数里拆出来——这比画箭头难得多。",
      },
      {
        type: "figure",
        fig: "book-velo-stream",
        caption: "原书实际输出：scVelo 把速率嵌进 UMAP 的流场。箭头好看，不保证对。多个研究显示，在某些系统里箭头会指向分化的反方向。没有独立证据（拟时序、时间标签、已知 marker 顺序）时，不要把箭头写成命运决定。",
      },
      {
        type: "figure",
        fig: "book-velo-phase",
        caption: "原书实际输出：scVelo 的基因相位图。横轴是 spliced，纵轴是 unspliced，紫色曲线是拟合出的动力学。细胞沿曲线走：上沿是正在被打开的基因（unspliced 先堆起来），下沿是正在关闭。如果一个基因的点云完全不贴这条曲线，它不该被用来推断方向——速率分析不是每个基因都合格。",
      },
      {
        type: "p",
        text: "相位图才是速率方法的心脏，流场图只是投影。原书示范里会挑几个基因把相位画出来：贴合好的基因，才有资格投票决定箭头。10x 3' 数据对内含子覆盖不均匀，大量基因的相位会很烂。这不是你参数没调好，是硬件限制。动态模型（scVelo dynamical、dynamo）比稳态假设灵活，但对 3' 数据仍然脆弱。",
      },
      {
        type: "h2",
        text: "数据从哪来",
      },
      {
        type: "p",
        text: "你需要在定量阶段分别计数 spliced 和 unspliced（velocyto、STARsolo、kb-python 的 nac 模式）。普通只定量外显子的矩阵不够。10x 3' 数据对内含子的覆盖并不均匀，这是速率分析最大的硬件限制。",
      },
      {
        type: "code",
        lang: "python",
        caption: "scVelo 的 dynamical 模式（示意）",
        code: `import scvelo as scv

scv.pp.filter_and_normalize(adata, min_shared_counts=20, n_top_genes=2000)
scv.pp.moments(adata, n_pcs=30, n_neighbors=30)
scv.tl.recover_dynamics(adata)
scv.tl.velocity(adata, mode="dynamical")
scv.tl.velocity_graph(adata)
scv.pl.velocity_embedding_stream(adata, basis="umap", color="leiden")`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "箭头可以是错的",
        body: "多个研究显示，在某些系统里速率会指向分化的反方向。原因包括稳态假设失败、基因特异的剪接动力学、3' 偏差。没有独立证据时，不要把箭头写成命运决定。",
      },
      {
        type: "p",
        text: "scVelo 的 dynamical 模式估计每个基因的转录 / 剪接 / 降解速率。dynamo 走更完整的动力学。CellRank 不把箭头当成终点，而是把方向吸收进命运概率——这通常比「好看的流场图」更经得起问。",
      },
    ],
  },
  {
    slug: "grn",
    no: "18",
    title: "基因调控网络：共表达还不是调控",
    titleEn: "Gene regulatory networks",
    part: "mechanisms",
    minutes: 22,
    blurb: "共表达会把间接效应和批次一起连成边。ATAC 和 TF 先验能把边从相关里捞出来一点。",
    objectives: [
      "说明只靠 scRNA 重建 GRN 的上限",
      "认识 SCENIC 家族和回归类方法",
      "把 GRN 结果当假说，不当证明",
    ],
    sourcePath: "mechanisms/gene_regulatory_networks.ipynb",
    tools: ["SCENIC+", "GRNBoost", "CellOracle", "FigR"],
    takeaways: [
      "转录组共表达会把共调控、间接效应和批次一起连成边。",
      "加入 TF motif、ATAC 峰和伪时间，能明显提高边的可解释性。",
      "GRN 适合提出「谁可能驱动这一段轨迹」，不适合单独当机制证明。",
    ],
    blocks: [
      {
        type: "p",
        text: "如果我们能画出「哪些转录因子在哪些细胞里打开哪些靶基因」，分化故事就从描述变成机制。现实是：单细胞 RNA 只能看到靶基因的 mRNA，看不到结合事件。网络推断是一道欠定题，答案可以有很多。",
      },
      {
        type: "figure",
        fig: "grn-switch",
        caption: "调控的直觉：一个转录因子像开关面板，同时打开或关掉一排靶基因。scRNA-seq 只能看见灯亮不亮（mRNA），看不见手指有没有按下去（结合）。所以共表达会把「一起亮」的灯连成边，其中很多只是间接效应或批次。",
      },
      {
        type: "p",
        text: "SCENIC 的思路比较老实，分三步。第一步 GRNBoost：用回归找 TF–靶的共表达，输出一张重要性表。第二步 cis-regulatory 剪枝：拿 motif 数据库，只留下序列上说得通的边。第三步 AUCell：给每个细胞打 regulon 活性。SCENIC+ 把 ATAC 加进来。CellOracle 用 GRN 做扰动模拟。",
      },
      {
        type: "figure",
        fig: "book-grn-importance",
        caption: "原书实际输出：GRNBoost 得到的 TF–基因重要性（log10）分布。这是单峰、右尾很长的样子——大多数边很弱，真正有用的在右尾。阈值切太松，网络会变成毛线团；切太紧，已知的轴（GATA1–红系）也会被剪掉。没有金标准，所以下一步必须用 motif 剪枝，不能只靠这一张直方图。",
      },
      {
        type: "figure",
        fig: "book-grn-aucell",
        caption: "原书实际输出：用 regulon 活性矩阵重新做的 UMAP。如果细胞类型在这张图上分得开，说明推断出的 regulon 至少抓住了身份信息。这比展示 2000 条新边更有说服力。接着用 matrixplot 核对：GATA1 regulon 是不是在红系亮、PAX5 是不是在 B 细胞亮。找不回来，就先别讲新边。",
      },
      {
        type: "code",
        lang: "python",
        caption: "读结果时先做的体检：已知轴还在不在",
        code: `# 不要一上来展示 2000 条新边。
# 先问：GATA1 在红系、PAX5 在 B 细胞，网络找不找得到？
#
# scenicplus / pyscenic 的输出通常是：
#   - regulon 列表（TF + 靶基因）
#   - 每个细胞的 AUCell 活性
sc.pl.umap(adata, color=["GATA1", "GATA1_regulon"])`,
      },
      {
        type: "callout",
        kind: "tip",
        title: "先找回已知的轴",
        body: "选一条你确定的轴（比如 GATA1 在红系），看推断网络能不能把它找回来。找不回来，就先别展示那 2000 条新边。",
      },
    ],
  },
  {
    slug: "ccc",
    no: "19",
    title: "细胞通讯：测量的是 mRNA，不是对话",
    titleEn: "Cell–cell communication",
    part: "mechanisms",
    minutes: 20,
    blurb: "配体–受体是推断，不是拍照。空间数据能打脸，也能救命。",
    objectives: [
      "解释配体–受体推断的数据假设",
      "知道 LIANA 作为统一入口的意义",
      "列出通讯分析的硬限制",
    ],
    sourcePath: "mechanisms/cell_cell_communication.ipynb",
    tools: ["LIANA", "CellPhoneDB", "NicheNet", "CellChat", "OmniPath"],
    takeaways: [
      "通讯方法把簇平均表达对到配体–受体数据库上，得到可能的相互作用。",
      "LIANA 把多种方法的结果汇总，避免只信某一个数据库的偏见。",
      "没有空间邻近、没有蛋白、没有功能验证时，结果只是候选清单。",
    ],
    blocks: [
      {
        type: "p",
        text: "细胞通过配体和受体说话。scRNA-seq 并不测量分泌，也不测量结合，它只测量编码配体和受体的 mRNA。通讯分析的全部勇气和全部风险，都在这句里。",
      },
      {
        type: "figure",
        fig: "book-ccc-schematic",
        caption: "原书示意图：发送者表达配体，接收者表达受体，数据库把它们配对打分。测量的始终是 mRNA。",
      },
      {
        type: "callout",
        kind: "cite",
        title: "原书网页把限制画成一张图",
        body: "网页正文的 limitations 图（下面那张）不是装饰：忽略空间邻近、忽略多亚基受体、忽略翻译后修饰、忽略一对多。LIANA 把 CellPhoneDB / CellChat / NicheNet 等汇总，是为了少信一家数据库的偏见，不是为了让弦图更粗。",
      },
      {
        type: "figure",
        fig: "talking-cells",
        caption: "图上画得很亲热。数据里只有两边的 mRNA。它们是不是真的挨着、蛋白在不在、受体能不能工作，图都不知道。",
      },
      {
        type: "figure",
        fig: "book-ccc-chord",
        caption: "原书实际输出：弦图。弧是细胞类型，弦是推断出的相互作用。弦的粗细是分数，不是分子数。读法：先找你有生物学理由的那几条（巨噬细胞 → T 细胞的细胞因子），再看有没有「全图开花」的发送者——后者常常是高表达配体被所有受体捞走，不是真的在广播。",
      },
      {
        type: "figure",
        fig: "book-ccc-dotplot",
        caption: "原书实际输出：LIANA 点图。行是配体–受体对，列是发送者–接收者。颜色是 magnitude，点大小是 specificity。比弦图更适合写进论文：你能指着某一个点说「我们重点看这一对」。把热图上的粗边写成「我们证明了旁分泌」之前，先问空间上它们挨不挨着。",
      },
      {
        type: "figure",
        fig: "book-ccc-limits",
        caption: "原书强调的限制：忽略空间邻近、忽略多亚基受体、忽略翻译后调控、忽略一种配体多种受体。把热图上的粗边写成「我们证明了旁分泌」，审稿人有权翻脸。",
      },
      {
        type: "h2",
        text: "典型流水线",
      },
      {
        type: "ol",
        items: [
          "可靠的细胞类型标签（贴错名字 = 找错对话者）",
          "选数据库：CellPhoneDB、CellChatDB、OmniPath…",
          "对每对发送者–接收者打分（表达量、特异性、下游靶）",
          "用 LIANA 汇总多种方法，看哪些相互作用被反复提名",
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "LIANA：不要只信一家数据库",
        code: `import liana as li

li.mt.rank_aggregate(
    adata,
    groupby="cell_type",
    resource_name="consensus",
    expr_prop=0.1,
    verbose=True,
)
li.pl.dotplot(
    adata,
    colour="magnitude_rank",
    size="specificity_rank",
    source_labels=["macrophage"],
    target_labels=["T", "endothelial"],
)`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "原书不厌其烦写过的限制",
        body: "忽略空间：远处的细胞被画成在对话。忽略多亚基受体：一条链高表达不等于受体能工作。忽略翻译后调控。忽略一种配体多种受体。把热图上的粗边写成「我们证明了旁分泌」，审稿人有权翻脸。",
      },
      {
        type: "p",
        text: "NicheNet 多走一步：问「发送者的配体能否解释接收者观察到的下游表达变化」，比单纯 L–R 共表达更接近功能。空间转录组或成像能提供「它们是否真的挨着」的约束，应当优先用来验证你最在乎的那几条边。",
      },
    ],
  },
  {
    slug: "spatial",
    no: "20",
    title: "空间组学：坐标变成一等公民",
    titleEn: "Spatial omics",
    part: "extensions",
    minutes: 20,
    blurb: "邻域、空间域、空间可变基因、空间反卷积。解离型单细胞把组织搅成汤，这里把地址留住。",
    objectives: [
      "分清成像原位和空间条码两类技术",
      "列出空间分析的核心任务",
      "把单细胞参考用于点状数据的反卷积",
    ],
    sourcePath: "spatial/introduction.ipynb",
    tools: ["Squidpy", "SpatialData", "cell2location", "Tangram", "BayesSpace"],
    takeaways: [
      "空间数据给每个观测加上坐标，邻域和组织结构变成一等公民。",
      "核心任务：邻域富集、空间域、空间可变基因、（多细胞点的）反卷积与基因插补。",
      "SpatialData / Squidpy 是 scverse 的空间入口；反卷积需要一张好的单细胞参考。",
    ],
    blocks: [
      {
        type: "p",
        text: "解离型 scRNA-seq 把组织搅成汤。空间组学把坐标留住：有的技术在切片上条码化捕获（Visium、Slide-seq，一个点可能是好几个细胞），有的在原位成像数千个基因（Xenium、MERFISH、CosMx，分辨率到细胞甚至亚细胞）。",
      },
      {
        type: "figure",
        fig: "book-spatial-intro",
        caption: "原书开篇：空间技术按分辨率和基因覆盖排成谱。点状捕获覆盖全转录组但一个点可能混多种细胞；成像原位分辨率高但基因数有限。分析任务跟着技术走：点状几乎一定要反卷积。这张图在网页正文里，不在 notebook 输出里。",
      },
      {
        type: "figure",
        fig: "spatial-slice",
        caption: "格子是捕获点，底下是真正的组织。一个点盖住几种细胞时，你看到的是混合物——所以需要反卷积。",
      },
      {
        type: "h2",
        text: "这一章你通常在问什么",
      },
      {
        type: "table",
        headers: ["任务", "问题", "工具线索"],
        rows: [
          ["邻域", "谁经常坐在谁旁边", "Squidpy neighborhood"],
          ["空间域", "组织怎么分区（像病理区域）", "BayesSpace、GraphST"],
          ["空间可变基因", "哪些基因呈空间图案", "SPARK、SpatialDE"],
          ["反卷积", "一个点里有哪些细胞类型", "cell2location、RCTD、Tangram"],
          ["插补", "把单细胞基因补到空间", "Tangram、gimVI"],
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "Squidpy：邻域这一问的入口",
        code: `import squidpy as sq

sq.gr.spatial_neighbors(adata)
sq.gr.nhood_enrichment(adata, cluster_key="cell_type")
sq.pl.nhood_enrichment(adata, cluster_key="cell_type")
sq.pl.spatial_scatter(adata, color="cell_type")`,
      },
      {
        type: "p",
        text: "点状（spot）数据几乎一定要反卷积：用解离单细胞参考去估计每个点的细胞类型比例。参考的注释质量，直接决定空间图好不好看。细胞级成像则更接近普通 scRNA-seq，外加一张坐标表——QC 还要多看分割有没有把两个核粘在一起。",
      },
      {
        type: "h2",
        text: "空间分析多出来的脾气",
      },
      {
        type: "ul",
        items: [
          "邻域富集：某两类细胞是否比随机更常坐在一起。这是通讯分析最想要的约束。",
          "空间域：组织怎么分区。有点像病理上的区域，不是 Leiden 簇。",
          "空间可变基因：表达呈空间图案的基因，可能和结构或损伤有关。",
          "反卷积 / 插补：把单细胞参考的类型或基因，投射到点或成像细胞上。",
        ],
      },
      {
        type: "p",
        text: "技术选择会改任务。Visium 一个点盖 1–10 个细胞，几乎必须反卷积；Xenium / MERFISH 到细胞级，更像带坐标的 scRNA-seq，但基因数有限，注释要靠那几百个探针。不要把 Visium 的点直接当成细胞去做 Leiden，再报告「我们发现了一种新类型」。",
      },
      {
        type: "callout",
        kind: "rec",
        title: "对象模型",
        body: "SpatialData 把图像、点、形状、表格放进一个容器。你可以把它想成「AnnData 外加一张地图」。",
      },
    ],
  },
  {
    slug: "multimodal",
    no: "21",
    title: "多组学：同一套脾气，换一组观测",
    titleEn: "Multimodal extensions",
    part: "extensions",
    minutes: 22,
    blurb: "ATAC、蛋白、免疫受体。配对整合优于事后把两张 UMAP 叠在一起。",
    objectives: [
      "指出 scATAC、CITE-seq、AIRR 各自的关键 QC",
      "分清 paired 和 unpaired 整合",
      "知道什么时候值得上多模态",
    ],
    sourcePath: "multimodal_integration/paired_integration.ipynb",
    tools: ["muon", "Signac", "totalVI", "scArches", "scirpy"],
    takeaways: [
      "ATAC 的特征是峰或基因活性，QC 看 FRiP、TSS、双细胞（AMULET）。",
      "CITE-seq 的 ADT 有另一套噪声（背景抗体、桥接），不能当 RNA 来归一化。",
      "配对多组学优先用专门模型（totalVI、MultiVI）。事后叠两张 UMAP 不叫整合。",
    ],
    blocks: [
      {
        type: "h2",
        text: "染色质可及性（scATAC-seq）",
      },
      {
        type: "figure",
        fig: "multi-layers",
        caption: "同一颗细胞可以同时被测到 RNA、开放染色质和表面蛋白。它们不是三份独立的实验，而是三层观测。整合的意思是让这三层互相解释，而不是把三张 UMAP 叠在一起。",
      },
      {
        type: "p",
        text: "ATAC 测量开放染色质。特征空间是峰值或 tiling window，比基因更稀疏。QC 看 TSS enrichment、FRiP、片段长度有没有核小体周期。双细胞用 AMULET 这类针对二倍体基因组的方法。下游可以算基因活性分数，再用类似 RNA 的聚类；真正的调控分析，还是要回到峰–TF–基因。",
      },
      {
        type: "h2",
        text: "表面蛋白（CITE-seq）",
      },
      {
        type: "p",
        text: "抗体衍生标签（ADT）把流式的蛋白信息接到同一个细胞条码上。蛋白的噪声是背景染色和桥接，不是 dropout。归一化常用 dsb 或 centered log-ratio，而不是 log1p CP10k。蛋白对免疫分型极强，常能切开 RNA 看起来一样的亚群。totalVI 同时建模 RNA 与 ADT。",
      },
      {
        type: "code",
        lang: "python",
        caption: "muon / totalVI：RNA 和 ADT 请分开放",
        code: `import muon as mu
from muon import prot as pt

mdata = mu.read_10x_h5("filtered_feature_bc_matrix.h5")
pt.pp.dsb(mdata["prot"], mdata["rna"])   # 蛋白走 dsb，不是 log1p
mu.pp.intersect(mdata)
# 之后交给 totalVI，而不是把两张表拼进同一个 PCA`,
      },
      {
        type: "h2",
        text: "适应性免疫受体（TCR / BCR）",
      },
      {
        type: "p",
        text: "V(D)J 重组让每个克隆有独特的受体序列。scirpy 一类工具做克隆型定义、扩增、以及和转录组状态的交叉。记住：克隆型不是细胞类型。同一个克隆可以处于多种效应状态。",
      },
      {
        type: "h2",
        text: "怎么整合才算整合",
      },
      {
        type: "p",
        text: "配对（同一细胞测到两种模态）和事后对齐（两个实验各测一种）是完全不同的题。配对有 totalVI（RNA+ADT）、MultiVI（RNA+ATAC）、WNN（Seurat）。事后对齐要靠共享的细胞类型结构，难得多，也更容易把生物学扭曲。把两张 UMAP 用 Photoshop 叠在一起，不叫整合。",
      },
      {
        type: "ul",
        items: [
          "Paired：同一细胞测到两种模态 → MultiVI / totalVI / WNN（Seurat）",
          "Unpaired：两个实验各测一种 → 对角整合，更难，需要共享的细胞类型结构",
          "查询映射：把新样本投到已有多模态图谱（scArches）",
        ],
      },
      {
        type: "callout",
        kind: "cite",
        title: "原书对应的那些章",
        body: "Chromatin Accessibility、Surface protein、Adaptive immune receptor repertoire、Multimodal integration、Deconvolution。这里收成一章讲给你听，细节仍应回到原书 notebook。",
      },
    ],
  },
  {
    slug: "outlook",
    no: "22",
    title: "收束：可重复，比漂亮更要紧",
    titleEn: "Outlook",
    part: "extensions",
    minutes: 14,
    blurb: "锁参考、锁随机种子、写下阈值的理由。最佳实践是过程，不是一张流程图。",
    objectives: [
      "列出一套最小可重复清单",
      "知道什么时候该停手，不要再拧旋钮",
      "把原书当成会生长的活文档",
    ],
    sourcePath: "outlook.md",
    tools: ["scverse", "scIB", "lamindb"],
    takeaways: [
      "可重复：同一参考基因组、同一软件版本、记下所有阈值和随机种子。",
      "可辩护：每一步能指出基准或生物学理由，而不是「教程默认」。",
      "原书会更新。方法过时是正常的。记录「为何当时那样选」，比锁死工具名更重要。",
    ],
    blocks: [
      {
        type: "p",
        text: "单细胞领域的半衰期很短。这本书想锁住的是决策结构，不是某年某月的默认软件。你交给别人（或六个月后的自己）的，应当是一条能被追问的推理链，而不是一串「当时点了 Run All」。",
      },
      {
        type: "h2",
        text: "把整本书收成一张清单",
      },
      {
        type: "ol",
        items: [
          "原始处理：参考版本锁死，knee / EmptyDrops 按文库切，单核定量到内含子",
          "QC：MAD 宽松切 counts/genes，mt 稍严；双细胞按样本；环境 RNA 先看全图开花再减",
          "归一化：探索用 shifted log，整合前考虑 scran，选基因考虑 Pearson 残差；counts 另存",
          "HVG：2000–5000，按批次联合选，用经典 marker 体检",
          "降维：PCA 给算法，UMAP 给人看；邻居图建在 PCA 或潜空间，use_rep 别写错",
          "整合：先看图再决定；Harmony 够用就别上重型；scIB 两套分数一起看",
          "聚类：Leiden 在图上切，多分辨率，谱系内亚聚类",
          "注释：谱系 → 类型 → 状态；自动方法出初稿，marker 终审",
          "DE：伪 bulk + 负二项，细胞不是重复；先看伪 bulk PCA 再写 design",
          "组成 / 通路 / 扰动 / 轨迹 / 通讯：各自的假设写进方法学，结果当假说",
        ],
      },
      {
        type: "h2",
        text: "最小可重复清单",
      },
      {
        type: "ol",
        items: [
          "参考基因组和注释版本",
          "定量、QC、整合、聚类的软件版本和关键参数",
          "过滤阈值及其统计定义（MAD 倍数，而不是「看起来不错」）",
          "随机种子（UMAP、Leiden、模型初始化）",
          "细胞类型标签的证据表",
          "DE 的 design matrix 和重复单元",
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "把「当时怎么跑的」写进对象自己身上",
        code: `adata.uns["analysis"] = {
    "ref": "GENCODE v44 + intron",
    "quant": "STARsolo 2.7.11",
    "qc": "MAD n=5 on log1p counts/genes; mt MAD n=3",
    "hvg": "seurat_v3, 3000, batch_key=sample",
    "neighbors": "n_neighbors=15, n_pcs=30, random_state=0",
    "leiden": "resolution=0.5, random_state=0",
}
adata.write("processed.h5ad")`,
      },
      {
        type: "h2",
        text: "什么时候停",
      },
      {
        type: "p",
        text: "当主要细胞类型稳定、已知 marker 各就各位、整合指标不再单方面崩掉、结论在合理的分辨率范围内不变——停。继续拧旋钮直到出现你想要的簇，那叫 p-hacking，不叫探索。",
      },
      {
        type: "callout",
        kind: "cite",
        title: "读完之后去哪",
        body: "在线书 https://www.sc-best-practices.org 和综述 Heumos et al., Nat Rev Genet 2023。遇到新模态，先找有没有独立基准，再决定是否放进正式流程。",
      },
    ],
  },
];
