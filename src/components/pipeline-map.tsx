import { Link } from "@tanstack/react-router";
import { CHAPTERS } from "@/data/chapters";
import { PARTS, PART_COLOR } from "@/data/parts";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const STEPS: { slug: string; short: string }[] = [
  { slug: "scrna-experiment", short: "实验" },
  { slug: "raw-processing", short: "定量" },
  { slug: "qc", short: "QC" },
  { slug: "normalization", short: "归一化" },
  { slug: "feature-selection", short: "HVG" },
  { slug: "dimensionality", short: "降维" },
  { slug: "integration", short: "整合" },
  { slug: "clustering", short: "聚类" },
  { slug: "annotation", short: "注释" },
  { slug: "dge", short: "DE" },
  { slug: "pseudotime", short: "轨迹" },
  { slug: "ccc", short: "机制" },
];

export function PipelineMap({ compact = false }: { compact?: boolean }) {
  const completed = useProgress((s) => s.completed);
  return (
    <ol className={cn("grid gap-2", compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6")}>
      {STEPS.map((step, i) => {
        const ch = CHAPTERS.find((c) => c.slug === step.slug)!;
        const part = PARTS.find((p) => p.id === ch.part)!;
        const done = completed.includes(ch.slug);
        return (
          <li key={step.slug}>
            <Link
              to="/chapters/$slug"
              params={{ slug: step.slug }}
              className={cn(
                "flex min-h-24 flex-col justify-between border-3 border-ink p-2 no-underline shadow-brutal-sm transition-transform hover:-translate-y-0.5",
                done ? "bg-ink text-yellow" : "bg-paper",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="font-display text-lg">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("size-3 border-2 border-ink", PART_COLOR[part.color])} />
              </span>
              <span>
                <span className="block font-bold leading-tight">{step.short}</span>
                <span className="block font-mono text-[10px] uppercase tracking-widest opacity-70">
                  {ch.titleEn}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
