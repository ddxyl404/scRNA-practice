import { DOWNSTREAM_CHAPTERS } from "./chapters-downstream";
import { INTRO_CHAPTERS } from "./chapters-intro";
import { PREPROCESS_CHAPTERS } from "./chapters-preprocess";
import { STRUCTURE_CHAPTERS } from "./chapters-structure";
import { PARTS } from "./parts";
import type { Chapter, PartId } from "./types";

export const CHAPTERS: Chapter[] = [
  ...INTRO_CHAPTERS,
  ...PREPROCESS_CHAPTERS,
  ...STRUCTURE_CHAPTERS,
  ...DOWNSTREAM_CHAPTERS,
];

export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function chaptersInPart(part: PartId): Chapter[] {
  return CHAPTERS.filter((c) => c.part === part);
}

export function adjacentChapters(slug: string): {
  prev: Chapter | null;
  next: Chapter | null;
} {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? CHAPTERS[i - 1]! : null,
    next: i < CHAPTERS.length - 1 ? CHAPTERS[i + 1]! : null,
  };
}

export function partOf(chapter: Chapter) {
  return PARTS.find((p) => p.id === chapter.part)!;
}

export const TOTAL_MINUTES = CHAPTERS.reduce((s, c) => s + c.minutes, 0);
