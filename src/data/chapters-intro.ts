import type { Chapter } from "./types";

export const INTRO_CHAPTERS: Chapter[] = [
  {
    slug: "how-to-read",
    no: "00",
    title: "怎么读这本书",
    titleEn: "How to read this book",
    part: "intro",
    minutes: 14,
    blurb: "这不是说明书，也不是 notebook 的中文对照。它想陪你把一条分析走通，并知道每一步为什么这样走。",
    objectives: [
      "分清这本书和 sc-best-practices 原书各管什么",
      "在脑子里有一条从 FASTQ 到细胞对话的主干",
      "习惯问一句：这个选择，我能向别人辩护吗",
    ],
    sourcePath: "preamble.html",
    tools: ["Scanpy", "AnnData", "Seurat"],
    takeaways: [
      "原书负责可执行的 notebook，这里负责把「为什么」讲成人话。",
      "章节顺序大致就是分析顺序，但下游的问题常常逼你回头改 QC。",
      "有独立基准的方法，我们会说出来；只是社区习惯的，也会标明。",
    ],
    blocks: [
      {
        type: "quote",
        text: "Each chapter corresponds to a distinct phase of a typical single-cell data analysis project.",
        cite: "Heumos, Schaar et al., Single-cell best practices",
      },
      {
        type: "p",
        text: "你手头大概有一份单细胞数据，或者马上会有。打开 Scanpy 教程，函数一个接一个，跑完 UMAP 也很漂亮——可要是有人问「为什么这里用 MAD 而不是 mt% > 20」，脑子里会空一下。这本书就是为这个空一下写的。",
      },
      {
        type: "p",
        text: "它顺着 Theislab 的 Single-cell best practices 往下走。原书网页是 jupyter-book：上面有叙述、示意图、notebook 跑出来的图。这里改成给你读的中文。每一章只做三件事：这一步到底在干什么、为什么大家常这么选、选错了数据会变成什么样。标了「原书图」的，是原书网页上的示意图或实际输出，不是装饰。",
      },
      {
        type: "h2",
        text: "这本书管什么，不管什么",
      },
      {
        type: "p",
        text: "主干是单模态 scRNA-seq：从原始读段到差异表达、轨迹和细胞对话。后面会伸到空间、染色质、表面蛋白和免疫受体。推荐优先用被基准托住、或至少被社区当成默认的方法；找不到独立基准时，我会写明「这是经验，不是法律」。",
      },
      {
        type: "ul",
        items: [
          "不管分子生物学入门。DNA、RNA、蛋白请另找 Alberts 那样的课本。",
          "不是 Python / R 语法课。循环和 data.frame 会用就行。",
          "不会把一千七百种工具做成百科。工具会过时，决策结构比较耐放。",
          "替不了你对这份数据的判断。阈值、分辨率、对照怎么设，仍是你的责任。",
        ],
      },
      {
        type: "h2",
        text: "你可以记在手背上的主干",
      },
      {
        type: "ol",
        items: [
          "原始处理：FASTQ 变成细胞 × 基因的计数表",
          "QC：空液滴、死细胞、双细胞、环境 RNA，先请出去",
          "归一化 + 选基因 + 降维：让细胞能比，也能被看见",
          "（需要时）批次整合：去掉技术，尽量留下生物学",
          "聚类 + 注释：先画边界，再给边界起名字",
          "条件比较：差异基因、谁变多了、通路、扰动",
          "轨迹与机制：假时间、RNA 速率、调控、对话",
          "扩展：空间 / ATAC / CITE / 免疫受体",
        ],
      },
      {
        type: "callout",
        kind: "rec",
        title: "第一次读，读到哪",
        body: "00 到 11 章，刚好是「从矩阵到细胞类型」。差异表达和轨迹可以第二遍再加。空间和多组学当成专题，用到再翻。",
      },
      {
        type: "h2",
        text: "出发前你需要什么",
      },
      {
        type: "ul",
        items: [
          "Python：列表、字典、Pandas、NumPy。Scanpy 见过更好，没见过也能跟。",
          "R：会摸 data.frame 就够。差异表达和一部分批次方法，至今还爱往 Bioconductor 跑。",
          "生物学：知道转录、线粒体、细胞类型这三件事，就不会在隐喻里迷路。",
        ],
      },
      {
        type: "h2",
        text: "正文里的图怎么读",
      },
      {
        type: "p",
        text: "标了「原书图」的，是 sc-best-practices notebook 跑出来的真实输出，或原书自己的插图。坐标轴、颜色、簇的形状都来自那份公开数据，不是为了好看现画的。读的时候请停下来问三句：横轴纵轴是什么、颜色编码的是什么、这张图在支持（或打脸）哪一个分析决定。生成的概念图用来建立直觉——液滴、破细胞、城市地图——它们不代替定量结果。",
      },
      {
        type: "p",
        text: "举个你会反复遇到的例子。QC 章有一张散点：横轴 UMI 总数，纵轴基因数，颜色是线粒体比例。它不是装饰。斜线是「测得越深、看到的基因越多」这条技术关系；左下角是空液滴；发红的点是死细胞。你会在自己的数据上画出几乎同一张图，然后决定切在哪。读懂原书这张图，等于提前彩排了你自己的 QC。",
      },
      {
        type: "h2",
        text: "一个可以练习的问题",
      },
      {
        type: "p",
        text: "假设有人问你：「为什么线粒体用 3 个 MAD，基因数却用 5 个？」合格的回答不是「教程这么写」。而是：死细胞的 mt% 会陡峭地飙，所以线粒体这一刀可以严一点；小淋巴细胞的 UMI 和基因数天生偏低，同一把严尺子会把它们误杀，所以 counts / genes 要宽松。后面每一章，我都会把这种「能向别人辩护」的句子写出来。你合上书之后，应该能用自己的数据把类似的句子再说一遍。",
      },
      {
        type: "callout",
        kind: "tip",
        title: "读图的时候把代码对着看",
        body: "原书图下面通常紧挨着一段可运行的代码。先看图，再看是哪一行 sc.pl / sc.tl 画出来的，再想「换我的数据，groupby 和 color 该填什么」。比先把 notebook 从头跑到尾更不容易迷路。",
      },
      {
        type: "code",
        lang: "python",
        caption: "原书几乎每一章都从这儿开始",
        code: `import scanpy as sc
import anndata as ad

sc.settings.verbosity = 3
sc.settings.set_figure_params(dpi=80, facecolor="white")

adata = sc.read_h5ad("data.h5ad")
print(adata)
# AnnData object with n_obs × n_vars
#     obs: 'sample', 'batch', ...
#     var: 'gene_ids', 'feature_types', ...`,
      },
      {
        type: "callout",
        kind: "cite",
        title: "请引用原书",
        body: "Heumos, L., Schaar, A.C., Lance, C. et al. Best practices for single-cell analysis across modalities. Nat Rev Genet (2023). doi:10.1038/s41576-023-00586-w。在线书 sc-best-practices.org，Apache 2.0。这里是教学整理，不是原书镜像。",
      },
    ],
  },
  {
    slug: "why-single-cell",
    no: "01",
    title: "为什么非做到单细胞不可",
    titleEn: "Why single-cell",
    part: "intro",
    minutes: 16,
    blurb: "Bulk 给你的是一锅汤的味道。疾病、发育、再生，往往发生在少数几桌客人身上。",
    objectives: [
      "用一句话说清 bulk 和单细胞差在哪",
      "承认分辨率变高的同时，噪声也一起变高",
      "把「工具一千多种」当成必须讲最佳实践的理由，而不是收藏癖",
    ],
    sourcePath: "preamble.html",
    tools: [],
    takeaways: [
      "细胞在形态、功能和转录谱上都不一样；打乱了，系统就会生病。",
      "scRNA-seq 把分辨率推到一颗细胞，也把 dropout、批次、双细胞推到你桌上。",
      "工具过多不是财富，是导航问题。最佳实践的意义，是少做一点任意选择。",
    ],
    blocks: [
      {
        type: "p",
        text: "把人体想成一座城市，而不是一块匀质的肉。城里住着上皮、免疫、基质、神经元，它们各干各的，也会在发育、受伤和生病时改行。bulk RNA-seq 相当于把整座街区打成浆，再测一次「平均口味」。单细胞是挨家挨户敲门。",
      },
      {
        type: "figure",
        fig: "bulk-avg",
        caption: "左边是 bulk：组织被搅成一管平均值。右边是单细胞：每一颗还留着自己的颜色。5% 的细胞如果决定了剧情，平均值经常看不见。",
      },
      {
        type: "h2",
        text: "平均值会把谁藏起来",
      },
      {
        type: "p",
        text: "假如组织里只有 5% 的细胞启动了关键通路，bulk 的火山图可能一片安静。肿瘤微环境、免疫浸润、发育里一闪而过的前体，都属于「少数派决定剧情」的场合。你真正想问的通常是：有哪些细胞、比例怎么变、谁在分化、谁在对谁说话。这些问题，平均值答不好。",
      },
      {
        type: "table",
        headers: ["你想问", "Bulk", "单细胞"],
        rows: [
          ["通路有没有上调", "能，但是平均", "能，并且知道是哪一群"],
          ["细胞类型组成", "间接，容易混", "直接（前提是注释靠谱）"],
          ["稀有细胞 / 过渡态", "几乎不能", "可以，取决于你抓得够不够"],
          ["细胞之间的对话", "找不到发送者和接收者", "可以推断，仍要验证"],
          ["代价", "便宜、稳", "贵、稀疏、怕批次"],
        ],
      },
      {
        type: "figure",
        fig: "umap-islands",
        caption: "单细胞最常见的「城市地图」：每一颗点是一个细胞，颜色是后来才贴上的名字。好看，但还不是结论。",
      },
      {
        type: "h2",
        text: "从转录组，到一颗细胞上的好几件事",
      },
      {
        type: "p",
        text: "最早，单细胞几乎等于 scRNA-seq。现在同一颗细胞还可以带上空间坐标、染色质开不开、表面有什么蛋白、TCR/BCR 是哪一条。分辨率变高，分析的岔路也变多。同一套 QC 哲学要搬到新的特征空间里。所以这本书先把 RNA 这条主干走完，再去串门。",
      },
      {
        type: "callout",
        kind: "warn",
        title: "新方法不等于更好",
        body: "只算 scRNA-seq，计算方法已经一千多种。没有基准的新模型，不该只因为「深度学习」三个字就进你的正式流程。",
      },
      {
        type: "h2",
        text: "分辨率变高，噪声也一起到桌上",
      },
      {
        type: "p",
        text: "一颗细胞里的 mRNA 分子数，往往只有几千到几万。测序还只能抓到其中一部分。于是矩阵里大量是零：有的基因真没表达，有的只是这次没抓到——这就是 dropout。再加上 PCR 偏好、捕获效率、批次、双细胞，单细胞的每一个数字都比 bulk 更抖。你换来的分辨率，是用稀疏和噪声买的。分析的全部手艺，就是在这堆抖的数字里把生物学捞出来，而不是把技术结构讲成故事。",
      },
      {
        type: "ul",
        items: [
          "稀疏：大多数基因在大多数细胞里是 0。距离、相关、PCA 都会被零牵着走，所以要归一化、要选基因、要降维。",
          "dropout ≠ 没表达：同一类型里，一个细胞有 12 个 UMI、隔壁那个是 0，经常只是抽样。",
          "批次几乎不可避免：不同天、不同操作者、不同 10x chemistry，都会让细胞在表达空间里按技术抱团。",
          "双细胞和环境 RNA：液滴物理决定的，不是你代码写错。",
        ],
      },
      {
        type: "h2",
        text: "什么时候不必上单细胞",
      },
      {
        type: "p",
        text: "如果问题是「这块组织整体的通路有没有变」，而且你不关心是谁在变，bulk 更便宜、更深、统计更老实。如果样本只有 n=2 对 n=2，单细胞也救不了重复不足——它只是把每个样本拆成了更多相关的细胞。如果主要想看蛋白，流式或 CITE 可能更直接。单细胞该上场的场合，是你明确需要细胞身份、稀有亚群、过渡态或对话这些平均值答不好的问题。",
      },
      {
        type: "p",
        text: "我们不推销「唯一正确流水线」。现代单细胞很少有一条能走遍天下的 workflow。后文按任务分组：预处理、结构、条件、轨迹、机制、扩展。你的课题决定走哪几条支路，以及要不要回头重做 QC。",
      },
    ],
  },
  {
    slug: "scrna-experiment",
    no: "02",
    title: "实验：从组织到文库",
    titleEn: "scRNA-seq experiments",
    part: "intro",
    minutes: 24,
    blurb: "分析不是从打开 h5ad 开始的。平台、UMI、解离质量，早就写进矩阵里了。",
    objectives: [
      "分得清 full-length 和 3'/5' tag-based 协议",
      "能向别人解释 UMI 如何对付 PCR 重复",
      "把实验端的选择，和后面能问的问题对上号",
    ],
    sourcePath: "introduction/scrna_seq.ipynb",
    tools: ["10x Chromium", "Smart-seq2/3", "Parse / sci-RNA-seq"],
    takeaways: [
      "液滴 / 微孔通量高、带 UMI，是细胞图谱的默认入口；Smart-seq 一类覆盖全长，适合剪接和异构体。",
      "UMI 把「分子」和「扩增产物」分开。定量，应在去重之后。",
      "解离、活力、环境 RNA、双细胞率，是实验端的 QC。计算补不齐设计。",
    ],
    blocks: [
      {
        type: "p",
        text: "单细胞测序不是把 RNA-seq 缩小到一颗细胞那么简单。你得先把组织拆开（有时只能拆到核），再给每个细胞的转录本打上条码，经过反转录、扩增、建库、测序。每一步都会在矩阵里留下指纹。后面那些「奇怪的簇」，有时只是解离时没抓到成纤维。",
      },
      {
        type: "figure",
        fig: "book-exp-quantify",
        caption: "原书示意图：组织 → 单细胞 → 反转录 / 扩增 → 测序读段 → 基因表达定量。计算分析从最右边那张表开始，但左边每一步的偏好（谁容易被解离、UMI 有没有、3' 还是全长）都已经写进表里了。",
      },
      {
        type: "figure",
        fig: "droplets",
        caption: "液滴平台的直觉：油把水滴一个个包起来，每滴理想情况下住一颗细胞，再带上一套条码。多数液滴其实是空的。",
      },
      {
        type: "h2",
        text: "两条大街，外加一条辅路",
      },
      {
        type: "table",
        headers: ["类型", "你可能见过", "读到什么", "通量", "更适合"],
        rows: [
          ["Tag-based（常是 3'）", "10x 3'、Drop-seq", "基因计数 + UMI", "高", "图谱、组成、细胞类型"],
          ["Full-length", "Smart-seq2/3、FLASH-seq", "几乎整条转录本", "低（板式）", "剪接、异构体、稀有转录本"],
          ["组合条码 / 单核", "Parse、sci-RNA-seq、snRNA-seq", "基因计数", "极高", "固体组织、冻存样本"],
        ],
      },
      {
        type: "h2",
        text: "UMI 到底在防什么",
      },
      {
        type: "p",
        text: "PCR 很勤奋，会把同一个 cDNA 分子复印出一堆。若你按读段数定量，复印工就会被误当成高表达。Unique Molecular Identifier 是反转录时接到每个分子上的随机短序列：同一分子的子孙共享同一个 UMI。定量时按「细胞条码 + UMI + 基因」去重，数的是分子，不是读段。没有 UMI 的全长数据，扩增偏差更难消，后面的归一化也要换思路。",
      },
      {
        type: "figure",
        fig: "barcodes",
        caption: "三层身份，别混。文库、细胞、分子是三张不同的名片。初学者最常见的事故，就是把它们当成一回事。",
      },
      {
        type: "code",
        lang: "text",
        caption: "一个计数是怎么来的",
        code: `cell identity     =  sample_index  +  cell_barcode
molecule identity =  cell identity +  UMI  +  gene
count[cell, gene] =  number of unique molecules

# 同一细胞、同一基因、同一 UMI 出现 40 次
# → 仍只记 1，那 39 次是 PCR 复印件`,
      },
      {
        type: "h2",
        text: "实验端已经替你决定的难题",
      },
      {
        type: "ul",
        items: [
          "解离偏好：成纤维、神经元、脂肪细胞难抓，免疫细胞好抓。组成分析会被扭曲。",
          "死细胞：膜破了，线粒体比例升高，环境 RNA 变多。",
          "双细胞：两颗细胞进同一滴，假的「过渡态」和「混合表型」就来了。",
          "单核 vs 单细胞：核 RNA 更偏 pre-mRNA，标记基因可能对不上你记忆中的那张表。",
          "测序深度：太浅加重 dropout，太深则性价比差。",
        ],
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "Harmony 救不了实验设计",
        body: "没有生物学重复、没有随机化、把处理和批次完全绑在一起——这些不是 scran 能救的。读分析的人，也得会看实验。",
      },
      {
        type: "h2",
        text: "10x 的 chemistry 不是细节",
      },
      {
        type: "p",
        text: "3' v2、v3、v3.1、v4 的条码长度、UMI 长度、接头位置都不完全一样。定量时 chemistry 填错，条码解析率会直接塌。同一项目里混了 v2 和 v3，本身就是一个批次。5' 文库还能读到 V(D)J，但基因定量的偏差和 3' 略有不同。写方法学时把 kit 版本写全，比写「用了 10x」有用得多。",
      },
      {
        type: "table",
        headers: ["你后面想问", "实验端该提前想的"],
        rows: [
          ["细胞类型图谱", "通量、解离是否公平、要不要单核"],
          ["剪接 / 异构体", "全长协议，不要用 3' tag"],
          ["RNA 速率", "定量阶段就要 spliced / unspliced，10x 3' 对内含子覆盖并不均匀"],
          ["TCR / BCR", "5' + V(D)J 富集"],
          ["空间邻域", "别解离，改做空间；或解离 + 空间各做一份互证"],
          ["处理效应", "生物学重复、处理和批次不要绑死"],
        ],
      },
    ],
  },
  {
    slug: "raw-processing",
    no: "03",
    title: "原始处理：FASTQ 变成计数表",
    titleEn: "Raw data processing",
    part: "intro",
    minutes: 26,
    blurb: "对齐还是伪对齐、参考基因组怎么选、空液滴怎么切，决定了你后面所有数字。",
    objectives: [
      "画出 FASTQ 到计数矩阵的路径",
      "比较 Cell Ranger、STARsolo、kallisto、Alevin-fry 各自的脾气",
      "解释为什么「条码在白名单里」不等于「这是一颗细胞」",
    ],
    sourcePath: "introduction/raw_data_processing.md",
    tools: ["Cell Ranger", "STARsolo", "kallisto/bustools", "Alevin-fry", "simpleaf"],
    takeaways: [
      "分析表面上从矩阵开始，矩阵质量却由比对器和参考注释共同决定。",
      "单核数据要定量到内含子；只数外显子，核 RNA 会被系统性看矮。",
      "空液滴用 Knee / EmptyDrops，不要只信白名单。",
    ],
    blocks: [
      {
        type: "p",
        text: "下机之后你拿到的是 FASTQ：读段、质量值，以及写在 read 里的细胞条码和 UMI。原始处理要把这些字母，变成一张细胞 × 基因的计数表。综述正文常常从矩阵讲起；但如果你不知道矩阵怎么来的，QC 阈值就会变成玄学。",
      },
      {
        type: "figure",
        fig: "book-raw-overview",
        caption: "原书总览：FASTQ 质控 → 比对或伪对齐 → 条码/UMI 解析 → 定量成矩阵。左边是测序仪的脾气，右边才是 Scanpy 的入口。",
      },
      {
        type: "figure",
        fig: "fastq-flow",
        caption: "四件事，顺序别反。解复用和读段 QC 看起来土，省了它们，后面会在 UMAP 上看到莫名其妙的「新类型」。",
      },
      {
        type: "figure",
        fig: "book-raw-fastqc",
        caption: "原书里的 FastQC：Per sequence quality scores。高峰应该靠右（高质量）。如果整座山往左移，文库或测序出了问题，不是后面 MAD 能救的。",
      },
      {
        type: "figure",
        fig: "book-raw-summary",
        caption: "原书网页上的 FastQC Summary 面板。这是一份「差」的文库：红灯和橙灯成排。原书专门拿好/差对照来教你读报告——不要只看 Cell Ranger 的网页摘要，独立跑一次 FastQC。",
      },
      {
        type: "figure",
        fig: "book-raw-quality",
        caption: "原书网页：Per sequence quality scores 的好（左）与差（右）。好的图是一座靠右的单峰；差的图整座山往低质量挪。这张对照来自原书正文，不是 notebook 临时输出。",
      },
      {
        type: "figure",
        fig: "book-raw-content",
        caption: "原书网页：Per base sequence content。好的文库四条碱基线在读段中后段叠在一起；开头几个碱基乱跳，常常只是随机引物，不必慌。如果整条读段都分家，可能是接头或污染。",
      },
      {
        type: "figure",
        fig: "book-raw-gc",
        caption: "原书 FastQC：Per sequence GC content。正常文库是一座以基因组 GC% 为中心的钟形。如果出现双峰，常见原因是接头二聚体、rRNA 残留、或两种来源的 DNA 混在一起。这座山歪了，先别急着定量。",
      },
      {
        type: "figure",
        fig: "book-raw-adapter",
        caption: "原书 FastQC：Adapter content。横轴是碱基位置，各条线是不同接头序列的比例。读段末端接头突然抬头，说明插入片段比读长还短，该切接头。10x 的 R1（条码+UMI）和 R2（插入）脾气不同，两张报告都要看。",
      },
      {
        type: "p",
        text: "FastQC 不是单细胞专用的，但在原始处理这一步它最有用。你会连续看三张图：质量高峰靠不靠右、GC 是不是单峰、接头有没有在末端抬头。三张都干净，才值得把计算预算砸进比对。任何一张明显异常，先回头查文库——定量器会很配合地把垃圾也定量进去。",
      },
      {
        type: "h2",
        text: "流水线其实就四步",
      },
      {
        type: "ol",
        items: [
          "解复用：按 sample index 把混在一起的文库拆开",
          "读段级 QC：适配器、低质量碱基，该切就切",
          "比对或伪对齐到参考，并解析细胞条码与 UMI",
          "定量：UMI 去重，写出 count matrix，顺手报告空液滴和多重样本",
        ],
      },
      {
        type: "h2",
        text: "常用的那几把尺子",
      },
      {
        type: "table",
        headers: ["工具", "策略", "脾气"],
        rows: [
          ["Cell Ranger", "STAR 比对 + 官方白名单", "10x 默认，报告全，慢，吃内存"],
          ["STARsolo", "STAR 的单细胞模式", "和 Cell Ranger 很像，更听你的参数"],
          ["kallisto | bustools", "伪对齐", "快，适合预实验和大规模重定量"],
          ["Salmon / Alevin-fry", "选择性比对", "对 UMI 协议友好，simpleaf 降低门槛"],
        ],
      },
      {
        type: "code",
        lang: "bash",
        caption: "STARsolo 的最小形状（示意）",
        code: `STAR --runMode alignReads \\
     --genomeDir ref/star_index \\
     --readFilesIn R2.fastq.gz R1.fastq.gz \\
     --soloType CB_UMI_Simple \\
     --soloCBwhitelist 3M-february-2018.txt \\
     --soloFeatures Gene GeneFull Velocyto \\
     --soloCellFilter EmptyDrops_CR \\
     --outFileNamePrefix sample1_

# GeneFull 对单核更公平：外显子 + 内含子都算
# Velocyto 会顺手写出 spliced / unspliced，后面速率用得上`,
      },
      {
        type: "h2",
        text: "参考注释不是细节",
      },
      {
        type: "p",
        text: "GENCODE 哪个版本、要不要内含子、伪基因留不留，都会改基因数和细胞数。单核里堆着大量还没剪接的 RNA，只定量外显子，它们会看起来像「又浅又差的细胞」。同一项目所有样本必须锁同一套参考，否则批次会从注释里自己长出来。",
      },
      {
        type: "figure",
        fig: "book-raw-align",
        caption: "原书示意图：比对（alignment）会把读段在基因组上的位置一格格排出来；伪对齐（mapping / quasi-mapping）只问「这段更像哪条转录本」。单细胞定量常常不需要完整比对，所以 kallisto / Salmon 会快很多。速率分析要 spliced/unspliced 时，还是得回到能区分内含子的比对器（STARsolo、velocyto）。",
      },
      {
        type: "figure",
        fig: "book-raw-umi",
        caption: "原书：UMI 去重。PCR 会把同一个分子复印出一堆读段，但它们共享 UMI。定量时按细胞条码 + UMI + 基因去重，数的是分子，不是读段。",
      },
      {
        type: "figure",
        fig: "book-raw-knee",
        caption: "原书 Alevin-QC：条码按 UMI 深度排序。左上高台是细胞，往右坠落的长尾是空液滴。拐点切太狠，小淋巴细胞会陪葬；切太松，噪声会冒充细胞。这张图就是 EmptyDrops / knee 要找的那个肩膀。",
      },
      {
        type: "figure",
        fig: "book-raw-alevin",
        caption: "原书 Alevin-QC 摘要表。盯几行就够：总读段、mapped 比例、能解析出条码的比例、最终细胞数。mapped 很低先查参考基因组是不是对人；条码解析很低先查 chemistry（3' v2 / v3 / v4 的条码位置不同）和白名单。细胞数如果和你预期的捕获数差一个数量级，knee 多半切错了。",
      },
      {
        type: "p",
        text: "Cell Ranger 的 web summary 讲的是同一件事，只是换了皮肤：Estimated Number of Cells、Mean Reads per Cell、Median Genes per Cell、Fraction Reads in Cells。最后这一项特别有用——低于约 70–80%，说明大量读段落在空液滴上，环境 RNA 或空泡太多。这些数字请写进方法学，不要只截一张 UMAP。",
      },
      {
        type: "code",
        lang: "text",
        caption: "一份还算像样的 10x 3' 文库，摘要大概长这样（数量级，不是标准）",
        code: `Estimated number of cells     8,000 – 12,000
Mean reads per cell           20,000 – 50,000
Median genes per cell         1,500 – 4,000   # 组织差异极大
Fraction reads in cells       > 80%
Valid barcodes                > 95%
Q30 bases in RNA read         > 85%

# 单核数据：Median genes 往往更低，GeneFull / intron 定量会好看一些
# 淋巴细胞：Median genes 可以低到 800，别用上皮的尺子去量`,
      },
      {
        type: "callout",
        kind: "rec",
        title: "空液滴怎么切",
        body: "液滴里多数没有细胞，只有环境 RNA。Knee 找拐点是经典做法；EmptyDrops 用统计把真细胞从背景里分开。切之前先看细胞大小：不是所有细胞都该有同样的 UMI 下限。",
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "别把样本先合并再判空液滴",
        body: "每个文库的环境 RNA 背景都不一样。空液滴和双细胞，都该在还没聚合的单个样本上做。",
      },
    ],
  },
  {
    slug: "anndata",
    no: "04",
    title: "AnnData：先认对象，再认函数",
    titleEn: "AnnData and Scanpy",
    part: "intro",
    minutes: 24,
    blurb: "X、obs、var、obsm、layers。单细胞分析的内存模型就这五格。认不得对象，函数调用全是碰运气。",
    objectives: [
      "默写出 AnnData 的五个核心槽",
      "解释为什么原始 counts 必须另存一层",
      "知道 Python 和 R 的对象怎么互相翻译",
    ],
    sourcePath: "introduction/fundamental_data_structures_and_frameworks.ipynb",
    tools: ["AnnData", "Scanpy", "MuData", "Seurat"],
    takeaways: [
      "AnnData 是带注释的细胞 × 基因矩阵：X 是当前工作表，原始 counts 放 layers。",
      "obs 是细胞，var 是基因，obsm 放 PCA/UMAP 这类嵌入。",
      "多模态用 MuData。跟 R 互换时，第一件事是确认 counts 还是不是整数。",
    ],
    blocks: [
      {
        type: "p",
        text: "Scanpy 把一次实验装进一个 AnnData。你可以把它想成一本有格子的实验记录：格子里是数字，页边是注释，夹页是降维结果。后面所有 sc.pp / sc.tl / sc.pl，其实都只是在改这本记录的某一页。",
      },
      {
        type: "figure",
        fig: "book-anndata",
        caption: "原书的 AnnData 结构图。X 是细胞 × 基因；obs / var 是两边的注释表；obsm 放 PCA、UMAP；layers 用来备份 counts、spliced、残差。这张图值得盯一分钟：后面每个函数都在改其中一格。",
      },
      {
        type: "figure",
        fig: "anndata",
        caption: "五个槽，够你用到注释那一章。X 会被一遍遍覆盖，所以 counts 一定要在变换之前 copy 到 layers。",
      },
      {
        type: "figure",
        fig: "book-scanpy-api",
        caption: "原书：Scanpy 的三层 API。pp = preprocessing（改 X），tl = tools（算出新结果写进 obs/obsm），pl = plot（只画不改）。记这三组前缀，读代码会快很多。",
      },
      {
        type: "h2",
        text: "五个槽，对着念一遍",
      },
      {
        type: "table",
        headers: ["槽", "形状", "通常放什么"],
        rows: [
          ["X", "细胞 × 基因", "当前分析用的矩阵，常常已经归一化"],
          ["obs", "细胞 × 注释", "批次、样本、QC、细胞类型"],
          ["var", "基因 × 注释", "高变基因、线粒体、基因符号"],
          ["obsm", "每个键一张表", "X_pca、X_umap、空间坐标"],
          ["layers", "和 X 同形", "counts、spliced、unspliced、Pearson 残差"],
        ],
      },
      {
        type: "code",
        lang: "python",
        caption: "原书的口令：变换之前先藏好 counts",
        code: `import scanpy as sc

adata = sc.read_h5ad("counts.h5ad")
adata.layers["counts"] = adata.X.copy()

adata.var["mt"] = adata.var_names.str.startswith("MT-")
sc.pp.calculate_qc_metrics(
    adata, qc_vars=["mt"], percent_top=[20], log1p=True, inplace=True
)

print(adata.obs[["n_genes_by_counts", "total_counts", "pct_counts_mt"]].head())
# 之后无论怎么 normalize / scale，都可以回到 layers["counts"]`,
      },
      {
        type: "figure",
        fig: "count-matrix",
        caption: "X 看上去像一张成绩单。零特别多：有的基因真没表达，有的只是这次没抓到。所以后面必须归一化，而不能拿原始数字直接比。",
      },
      {
        type: "figure",
        fig: "book-scanpy-pca",
        caption: "原书入门示例：sc.pl.pca 把 CST3 的表达涂在前两个 PC 上。颜色沿某个方向渐变，说明这个基因和该 PC 相关。这还不是细胞类型图——只是确认对象活着、函数通了。",
      },
      {
        type: "h2",
        text: "为什么不能只留一张 X",
      },
      {
        type: "p",
        text: "差异表达、某些拟时序模型、scVI，都要原始计数。如果你把 X 覆盖成 log1p，又没有 layers['counts']，就只能从已经变换的数字「还原」——这通常不可逆。记住一句就行：变换之前先 copy。",
      },
      {
        type: "h2",
        text: "多模态：MuData",
      },
      {
        type: "p",
        text: "CITE-seq 同时有 RNA 和蛋白，多组学 ATAC+RNA 同时有峰和基因。MuData 是若干 AnnData 的书包，细胞索引是共享的。不要把蛋白计数和 RNA 计数直接拼进同一张 X 再做 PCA，量纲完全不是一回事。",
      },
      {
        type: "callout",
        kind: "tip",
        title: "Python 和 R 之间",
        body: "anndata2ri、zellkonverter、sceasy 可以在 AnnData 与 SingleCellExperiment / Seurat 之间搬数据。搬完第一件事：counts 还是不是整数，细胞条码还齐不齐。",
      },
      {
        type: "h2",
        text: "一次分析在对象上走的路",
      },
      {
        type: "p",
        text: "把 Scanpy 的函数名翻译成「改了哪一格」，你就很少会丢 counts。典型的一条探索路径是：layers['counts'] 备份 → obs 里写入 QC → 过滤细胞（改 n_obs）→ 归一化写入 X 或另一个 layer → var['highly_variable'] → PCA 写入 obsm['X_pca'] → 邻居图写入 obsp → UMAP 写入 obsm['X_umap'] → Leiden 写入 obs。每一步都可以 print(adata) 看哪一格变了。这比记住二十个函数名更耐用。",
      },
      {
        type: "code",
        lang: "python",
        caption: "一条最小的探索路径。每一步旁边注明写进了哪一格",
        code: `adata.layers["counts"] = adata.X.copy()          # layers
sc.pp.normalize_total(adata, target_sum=1e4)     # X
sc.pp.log1p(adata)                               # X
sc.pp.highly_variable_genes(adata, n_top_genes=3000, flavor="seurat_v3")  # var
adata.raw = adata                                # 备份一份给作图
adata = adata[:, adata.var.highly_variable].copy()
sc.pp.scale(adata, max_value=10)                 # X（可选，见归一化章）
sc.tl.pca(adata, n_comps=50)                     # obsm["X_pca"]
sc.pp.neighbors(adata, n_neighbors=15, n_pcs=30) # obsp
sc.tl.umap(adata)                                # obsm["X_umap"]
sc.tl.leiden(adata, resolution=0.5)              # obs["leiden"]
print(adata)`,
      },
      {
        type: "callout",
        kind: "pitfall",
        title: "view 不是 copy",
        body: "adata[:, mask] 默认常常是 view。接着再改 X，可能改到原对象上，也可能报错。过滤之后立刻 .copy()，是原书示范里反复出现的动作，不是洁癖。",
      },
    ],
  },
];
