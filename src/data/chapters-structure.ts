import type { Chapter } from "./types";

export const STRUCTURE_CHAPTERS: Chapter[] = [
  {
    slug: "integration",
    no: "09",
    title: "批次整合：去掉技术，留下生物学",
    titleEn: "Integration",
    part: "structure",
    minutes: 30,
    blurb: "先画图判断要不要整合。复杂图谱用 scVI / scANVI；简单平移用 Harmony 往往就够。",
    objectives: [
      "在整合前用可视化判断批次是不是真的成问题",
      "按任务复杂度挑方法",
      "用 scIB 的两套分数看「去批次」和「保生物学」有没有打架",
    ],
    sourcePath: "cellular_structure/integration.ipynb",
    tools: ["Harmony", "scVI", "scANVI", "Scanorama", "scGen", "scIB"],
    takeaways: [
      "先看图再决定要不要校正。不必要的整合，会抹掉你真正关心的生物学。",
      "有可靠细胞标签时，优先考虑能吃标签的方法（如 scANVI）。",
      "对同一数据跑几种整合，用 scIB 挑那个两边分数都不塌的。",
    ],
    blocks: [
      {
        type: "p",
        text: "「批次」是任何不是你想研究、却能让细胞在表达空间里抱团的因素：实验日期、操作者、试剂盒、10x chemistry、测序 lane，甚至解离中心。整合的目标很贪心：让相同类型跨越批次重叠，同时让不同类型继续分开。贪心是有代价的。",
      },
      {
        type: "figure",
        fig: "book-int-schematic",
        caption: "原书把整合方法分成几代：全局模型、线性嵌入（Harmony、Scanorama）、图方法、深度学习（scVI / scANVI）。越后面的模型越能处理复杂批次，也越容易把生物学一起修掉。先看图，再决定要不要上重型。",
      },
      {
        type: "figure",
        fig: "batch",
        caption: "左边按实验日期抱成两团，往往是批次。右边同一类型叠在一起、不同类型仍分开，才像整合成功。如果疾病和日期完全绑死，你分不清自己去掉的是哪一个。",
      },
      {
        type: "h2",
        text: "先问：真的要整合吗",
      },
      {
        type: "p",
        text: "原书用 NeurIPS 2021 多供体数据演示。下面两张图是整合之前的同一张 UMAP，只是着色不同。请并排看。",
      },
      {
        type: "figure",
        fig: "book-int-before-batch",
        caption: "原书实际输出：整合前，按 site / 批次着色。同一颜色抱成一片，说明技术批次在主导邻居关系。如果只看到这一张，你会觉得「必须整合」。",
      },
      {
        type: "figure",
        fig: "book-int-before-type",
        caption: "原书实际输出：同一张 UMAP，改按细胞类型着色。类型其实已经分得开，只是被批次撕成好几片。整合要做的，是让同一颜色的碎片重叠，而不是把所有颜色搅成一锅。",
      },
      {
        type: "h2",
        text: "先问：真的要整合吗",
      },
      {
        type: "p",
        text: "如果 UMAP 上细胞类型已经按生物学分开、批次只是轻微平移，也许只需在模型里把 batch 当成协变量。如果同一类型被撕成按样本着色的几片，才需要专门的整合。处理效应（刺激 vs 对照）绝对不能当批次去掉——那是你花钱买来的信号。",
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "生物学被当成批次",
        body: "供体、性别、炎症、解剖部位经常和批次缠在一起。整太狠，疾病信号会一起消失。设计矩阵里要把「想留的」和「想去的」写明白，写给未来的自己看。",
      },
      {
        type: "h2",
        text: "按难度选（scIB 的经验）",
      },
      {
        type: "table",
        headers: ["情境", "可以先试", "备注"],
        rows: [
          ["轻度批次、同一协议", "Harmony", "快，适合探索"],
          ["复杂图谱、多种协议", "scVI、Scanorama", "生成模型或线性嵌入"],
          ["已有可靠细胞标签", "scANVI、scGen", "用标签把生物学锁住"],
          ["ATAC 窗口 / 峰值", "Harmony、LIGER", "特征空间本身更关键"],
        ],
      },
      {
        type: "p",
        text: "scANVI 能吃细胞类型标签，去批次时比较不容易把类型也修掉。没有标签时，scVI 仍是复杂任务的强基线。Harmony 在「不太难」的整合里往往足够，而且分钟级出结果——先跑它，再决定要不要上重型模型。原书网页把任务分成两档：简单批次用 Harmony / Seurat；复杂图谱用 scVI、scANVI、scGen、Scanorama。有可靠标签时优先 scANVI。",
      },
      {
        type: "callout",
        kind: "cite",
        title: "原书网页怎么选方法",
        body: "先画未整合的 UMAP 再决定要不要校正。用 scIB 同时打「去批次」和「保生物学」：kBET、ASW_label、ASW_label/batch、PCR_batch、graph connectivity、isolated label silhouette。没有一种方法通吃；在你自己的数据上跑几种，挑两边分数都不塌的。",
      },
      {
        type: "h2",
        text: "scIB 两套分数在打什么架",
      },
      {
        type: "p",
        text: "去批次的分数（iLISI、kBET、graph connectivity）奖励「不同批次拌在一起」。保生物学的分数（cLISI、silhouette、NMI/ARI 对已知类型、轨迹守恒）奖励「不同类型继续分开」。好的整合是两边都不塌。只看混合分，会选出把所有细胞揉成一球的方法——那叫过度校正，疾病信号常常一起消失。原书的建议很具体：对同一数据跑两三种方法，用 scIB 挑那个两边分数都还站得住的，再用你认得的 marker 做最后体检。",
      },
      {
        type: "code",
        lang: "python",
        caption: "Harmony：轻量、够用时就别上重型",
        code: `import scanpy.external as sce

sc.tl.pca(adata, n_comps=50)
sce.pp.harmony_integrate(adata, key="sample")
sc.pp.neighbors(adata, use_rep="X_pca_harmony")
sc.tl.umap(adata)
sc.pl.umap(adata, color=["sample", "cell_type"])`,
      },
      {
        type: "code",
        lang: "python",
        caption: "原书复杂图谱常用的 scVI 最小形状",
        code: `import scvi

scvi.model.SCVI.setup_anndata(
    adata, layer="counts", batch_key="sample"
)
model = scvi.model.SCVI(adata)
model.train()
adata.obsm["X_scVI"] = model.get_latent_representation()

sc.pp.neighbors(adata, use_rep="X_scVI")
sc.tl.umap(adata)
sc.tl.leiden(adata, resolution=0.5)`,
      },
      {
        type: "h2",
        text: "怎么知道自己没把生物学修掉",
      },
      {
        type: "figure",
        fig: "book-int-after-batch",
        caption: "原书实际输出：整合之后按批次着色。颜色应该拌在一起——同一类型的不同批次互相穿透。如果某一颜色仍独自成岛，整合还没完成，或者那个批次有独特的生物学（别硬揉）。",
      },
      {
        type: "figure",
        fig: "book-int-after-type",
        caption: "原书实际输出：整合之后按细胞类型着色。类型边界应还在。拿它和整合前的类型图对比：碎片愈合了，但 NK、T、单核该分开的仍分开。这就是 scIB 同时打「混合分」和「生物保留分」的原因。",
      },
      {
        type: "ul",
        items: [
          "看图：同一类型跨批次混合，不同类型仍分离",
          "定量：scIB 的 iLISI（混合）对 LISI（类型纯净）、kBET、silhouette、轨迹守恒",
          "生物学体检：你认得的 marker 是不是还在该在的簇上",
        ],
      },
      {
        type: "callout",
        kind: "rec",
        title: "HVG 要，盲目 scale 不要",
        body: "基准显示选高变基因通常提升整合；把基因 z-score 化则容易让方法过度去批次。默认路线：HVG →（常常不 scale）→ 整合。",
      },
    ],
  },
  {
    slug: "clustering",
    no: "10",
    title: "聚类：给连续世界画边界",
    titleEn: "Clustering",
    part: "structure",
    minutes: 24,
    blurb: "在 KNN 图上跑 Leiden。分辨率是旋钮，不是真理。簇还不是细胞类型。",
    objectives: [
      "说明为什么图聚类成了默认",
      "用多种分辨率做亚聚类",
      "把簇当成假说，而不是最终命名",
    ],
    sourcePath: "cellular_structure/clustering.ipynb",
    tools: ["Leiden", "Louvain", "KNN graph"],
    takeaways: [
      "在单细胞 KNN 图上用 Leiden 做社区发现。",
      "换分辨率做亚聚类，才能看见更细的状态。",
      "簇是表达邻域的摘要，细胞类型是生物学解释——两步不要一次做完。",
    ],
    blocks: [
      {
        type: "p",
        text: "聚类把相似的细胞收成一群，方便后面注释和统计。这里的「相似」定义在邻居图上：每个细胞连到 PCA（或整合潜空间）里最近的 k 个细胞，然后在这张图上找社区。它不是在 UMAP 那张画上用刀切蛋糕。",
      },
      {
        type: "figure",
        fig: "book-clu-schematic",
        caption: "原书示意图：从表达矩阵到 KNN 图，再到社区。Leiden 在图上切，不在二维画布上切。分辨率只是模块度里的一个旋钮。",
      },
      {
        type: "figure",
        fig: "leiden",
        caption: "点是细胞，线是邻居。颜色是 Leiden 找到的社区。换一个分辨率，边界会改；这很正常。",
      },
      {
        type: "figure",
        fig: "book-clu-leiden",
        caption: "原书实际输出：Leiden 着色的 UMAP。注意有的簇很大、有的只是一小撮。小簇先别删——先看 marker。如果小簇同时高 mt%、高 counts，再当漏网双细胞处理。",
      },
      {
        type: "h2",
        text: "为什么是 Leiden",
      },
      {
        type: "p",
        text: "Louvain 当过很久的默认，但可能给出内部并不连通的社区。Leiden 修了这一点，也更快，是 Scanpy / Seurat 现在的标准。k-means 假设簇是球形的，不太适合分叉的发育数据；数据很小的时候，层次聚类仍有人用。",
      },
      {
        type: "p",
        text: "邻居数 k 和分辨率是两个不同的旋钮。k 太小，图碎成毛边，Leiden 会切出一堆没 marker 的小簇；k 太大，近邻被远处的细胞稀释，相近类型融在一起。15 是常见起点。分辨率则是模块度公式里的 γ：γ 大，倾向更多更小的社区。不要用 silhouette 最大值当「正确分辨率」——单细胞的簇本来就不是球，silhouette 会偏向切得不够细。",
      },
      {
        type: "h2",
        text: "分辨率是旋钮",
      },
      {
        type: "p",
        text: "0.2 可能把所有 T 细胞揉成一块；1.2 可能把同一类型切成细胞周期碎片。没有「正确」的分辨率。比较稳的读法：先粗分出谱系，再在谱系里面亚聚类。用 marker 基因、而不是 silhouette 最大值，决定切到哪一层。",
      },
      {
        type: "p",
        text: "亚聚类的做法是：先在粗分辨率上认出「这是 T 细胞」，再 adata_t = adata[adata.obs.leiden_0.2 == 'T'].copy()，在这个子集上重新 neighbors + leiden。不要期望一次全局 Leiden 就把 CD4 naive、CD8 exhausted 和 Treg 都切开——细胞周期、批次、深度都会掺进来。谱系内重算邻居，等于换了一张更合适的桌子。",
      },
      {
        type: "code",
        lang: "python",
        caption: "同一张图，多拧几下旋钮，对着 marker 看",
        code: `for r in (0.2, 0.5, 1.0, 1.5):
    sc.tl.leiden(adata, resolution=r, key_added=f"leiden_{r}")

sc.pl.umap(
    adata,
    color=["leiden_0.2", "leiden_1.0", "CD3D", "MS4A1", "LYZ"],
    legend_loc="on data",
)`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "簇不是细胞类型",
        body: "一个簇可能只是「正在分裂的 T 细胞」，也可能把两个功能状态粘在一起。注释是下一章的事。聚类只提供候选边界。",
      },
      {
        type: "h2",
        text: "边界稳不稳",
      },
      {
        type: "ul",
        items: [
          "换 n_neighbors、n_pcs，这些簇还在不在",
          "已知谱系 marker 是不是落在连续区域",
          "碎得过分的簇，是不是漏网的双细胞或空液滴",
        ],
      },
    ],
  },
  {
    slug: "annotation",
    no: "11",
    title: "给细胞起名字",
    titleEn: "Cell type annotation",
    part: "structure",
    minutes: 28,
    blurb: "手动 marker 和自动参考映射不是对手。参考有多像你的数据，自动方法就有多聪明。",
    objectives: [
      "写出一套手动注释的纪律",
      "知道自动注释的天花板在哪",
      "用「谱系 → 类型 → 状态」三层来组织名字",
    ],
    sourcePath: "cellular_structure/annotation.ipynb",
    tools: ["CellTypist", "scArches", "cellmapper", "Azimuth", "marker genes"],
    takeaways: [
      "注释是给群体贴标签，后面所有故事的主角都从这里定。",
      "手动注释慢、主观，在新组织里仍然不可少。",
      "CellTypist、scArches 更快，准不准取决于参考和查询有多像。",
    ],
    blocks: [
      {
        type: "p",
        text: "注释把无监督的簇翻译成可以写进论文的名字：CD8 T、经典单核、AT2、肿瘤细胞。名字一旦贴上，组成、通讯、轨迹的主角就定了。贴错名字，后面全是错的故事。所以这一章值得慢。",
      },
      {
        type: "figure",
        fig: "book-ann-markers",
        caption: "原书实际输出：把经典 marker 涂在 UMAP 上。CD3D / IL7R 点亮 T 细胞岛，MS4A1 点亮 B 细胞，NKG7 点亮 NK。注释的纪律是：先认谱系，再认类型。一个簇同时亮起互相冲突的 marker，回去查双细胞或分辨率。",
      },
      {
        type: "figure",
        fig: "book-ann-dotplot",
        caption: "原书实际输出：dotplot。行是簇，列是基因。点的大小是「这个簇里多少细胞在表达」，颜色是平均表达。读法：一个好的类型标签，应该有一小组基因在这一行又大又深、在别的行几乎空白。一行上什么都亮，或所有行对同一个基因都亮，这个基因就不是好 marker。",
      },
      {
        type: "figure",
        fig: "book-ann-rank",
        caption: "原书实际输出：sc.tl.rank_genes_groups 的热图。每一列是一个簇相对其余细胞最上调的基因。这是找 marker 的探索图，不是处理效应。注意：用同一批基因聚类、再用它们注释，会有循环论证——至少要在方法里承认重叠，并交叉验证独立的经典 marker。",
      },
      {
        type: "figure",
        fig: "annot-tree",
        caption: "先认谱系，再认类型，最后才到状态。一口气给 40 个簇起名，是把自己逼上绝路。",
      },
      {
        type: "figure",
        fig: "book-ann-umap",
        caption: "原书实际输出：手动注释完成后的细胞类型 UMAP。每个名字背后都应该有一张证据基因表，而不是只有一个模型分数。自动方法（CellTypist、scArches）适合出初稿，终审还是 marker。",
      },
      {
        type: "h2",
        text: "手动注释的纪律",
      },
      {
        type: "ol",
        items: [
          "先画谱系 marker（EPCAM、PTPRC、COL1A1、PECAM1…），把上皮 / 免疫 / 基质 / 内皮分开",
          "在谱系里面看经典类型 marker，而不是对着 40 个簇同时空想",
          "一个簇出现互相冲突的 marker → 回去查双细胞或分辨率",
          "用文献和 CellMarker / Panglao 交叉验证，写下每个标签的证据基因",
          "允许叫做 unknown。硬起名，比留空更有害",
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "谱系这一层，四五个基因就够开门",
        code: `lineage = {
    "epithelial": ["EPCAM", "KRT8", "KRT18"],
    "immune": ["PTPRC", "CD3D", "MS4A1", "LYZ"],
    "stromal": ["COL1A1", "DCN", "LUM"],
    "endothelial": ["PECAM1", "VWF", "CLDN5"],
}
sc.pl.dotplot(adata, lineage, groupby="leiden_0.2", standard_scale="var")
sc.pl.umap(adata, color=["EPCAM", "PTPRC", "COL1A1", "PECAM1"])`,
      },
      {
        type: "h2",
        text: "自动注释：快，但会乱贴",
      },
      {
        type: "p",
        text: "CellTypist 用逻辑回归在参考上训练，适合免疫这类参考成熟的系统。原书网页的做法很具体：先把查询归一化到 10,000 counts 再 log1p（和训练时一致），选用 Immune_All_Low / Immune_All_High 这类预训练模型，打开 majority voting，再看置信度而不是只看标签。scArches / cellmapper 把查询映射到已整合的参考图谱再转移标签。Azimuth 是同一思想的 R 侧。它们快，但遇到参考里没有的细胞——肿瘤、新的过渡态——会就近乱贴。",
      },
      {
        type: "code",
        lang: "python",
        caption: "原书注释章：CellTypist 的入口（示意）",
        code: `import celltypist
from celltypist import models

# 查询要和模型训练时同一套归一化
adata_q = adata.copy()
sc.pp.normalize_total(adata_q, target_sum=1e4)
sc.pp.log1p(adata_q)

pred = celltypist.annotate(
    adata_q,
    model="Immune_All_Low.pkl",
    majority_voting=True,
)
adata.obs["celltypist"] = pred.predicted_labels["majority_voting"]
adata.obs["celltypist_conf"] = pred.probability_matrix.max(axis=1)
sc.pl.umap(adata, color=["celltypist", "celltypist_conf"])`,
      },
      {
        type: "code",
        lang: "python",
        caption: "CellTypist 出初稿，obs 里留下分数，终审还是 marker",
        code: `import celltypist
from celltypist import models

model = models.Model.load(model="Immune_All_Low.pkl")
pred = celltypist.annotate(adata, model=model, majority_voting=True)
adata.obs["celltypist"] = pred.predicted_labels["majority_voting"]
adata.obs["celltypist_conf"] = pred.probability_matrix.max(axis=1)

sc.pl.umap(adata, color=["celltypist", "celltypist_conf", "leiden"])
# 置信度低的细胞：打开 marker 点图，不要盲目接受`,
      },
      {
        type: "callout",
        kind: "rec",
        title: "比较舒服的组合",
        body: "自动方法出初稿，手动 marker 做终审。发表级别的注释，应当能指出每个标签的证据基因，而不是只报一个模型分数。",
      },
      {
        type: "table",
        headers: ["层级", "例子", "后面拿来干什么"],
        rows: [
          ["谱系 lineage", "immune / epithelial / stromal", "QC 体检、整合有没有过头"],
          ["类型 type", "CD4-T / goblet / fibroblast", "组成、DE 的主单元"],
          ["状态 state", "exhausted CD8 / cycling", "机制、轨迹、治疗反应"],
        ],
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "循环论证",
        body: "用一列基因聚类，再用同一列基因注释，然后宣布「我们发现这些 marker」。注释用的基因和发现用的差异基因要分开，至少要承认它们重叠。",
      },
    ],
  },
];
