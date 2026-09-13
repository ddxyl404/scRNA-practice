import type { Part } from "./types";

export const PARTS: Part[] = [
  {
    id: "intro",
    index: "01",
    title: "数据从哪来",
    titleEn: "Introduction",
    color: "yellow",
    summary: "为什么要做单细胞、实验怎么产生数据、FASTQ 怎样变成计数表、AnnData 怎样把一切装起来。",
  },
  {
    id: "preprocess",
    index: "02",
    title: "先把噪声压下去",
    titleEn: "Preprocessing",
    color: "pink",
    summary: "质量控制、归一化、特征选择、降维。让细胞能比，也能被看见。",
  },
  {
    id: "structure",
    index: "03",
    title: "画出细胞地图",
    titleEn: "Cellular structure",
    color: "cyan",
    summary: "批次整合、图聚类、给细胞起名字。簇还不是类型。",
  },
  {
    id: "conditions",
    index: "04",
    title: "处理之后发生了什么",
    titleEn: "Conditions",
    color: "orange",
    summary: "差异表达、组成、通路、扰动。细胞不是生物学重复。",
  },
  {
    id: "trajectories",
    index: "05",
    title: "连续的命运",
    titleEn: "Trajectories",
    color: "lime",
    summary: "拟时序、RNA 速率。假时间不是墙上的钟，箭头也可能指反。",
  },
  {
    id: "mechanisms",
    index: "06",
    title: "谁在对谁说话",
    titleEn: "Mechanisms",
    color: "yellow",
    summary: "基因调控网络与细胞通讯。从「谁在哪」走到「谁可能驱动了什么」。",
  },
  {
    id: "extensions",
    index: "07",
    title: "换一组观测",
    titleEn: "Extensions",
    color: "pink",
    summary: "空间、ATAC、CITE-seq、免疫受体。同一套脾气，换特征空间。",
  },
];

export const PART_COLOR: Record<Part["color"], string> = {
  yellow: "bg-yellow",
  pink: "bg-pink",
  cyan: "bg-cyan",
  lime: "bg-lime",
  orange: "bg-orange",
};
