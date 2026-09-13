import { createFileRoute, Link } from "@tanstack/react-router";
import { CHAPTERS } from "@/data/chapters";
import { PARTS, PART_COLOR } from "@/data/parts";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chapters/")({ component: ChaptersIndex });

function ChaptersIndex() {
  const completed = useProgress((s) => s.completed);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">Syllabus</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none md:text-6xl">
        全部章节
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {CHAPTERS.length} 章，按原书 parts 编排。点进任一章即可按顺序往前翻、往后翻。
      </p>
      <div className="mt-10 space-y-12">
        {PARTS.map((part) => {
          const chs = CHAPTERS.filter((c) => c.part === part.id);
          return (
            <section key={part.id} id={part.id}>
              <div className="mb-4 flex flex-wrap items-end gap-3">
                <span
                  className={cn(
                    "border-3 border-ink px-2 py-1 font-display text-lg",
                    PART_COLOR[part.color],
                  )}
                >
                  {part.index}
                </span>
                <h2 className="font-display text-3xl uppercase leading-none">{part.title}</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {part.titleEn}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {chs.map((ch) => {
                  const done = completed.includes(ch.slug);
                  return (
                    <Link
                      key={ch.slug}
                      to="/chapters/$slug"
                      params={{ slug: ch.slug }}
                      className={cn(
                        "flex gap-4 border-3 border-ink p-4 no-underline shadow-brutal-sm hover:-translate-y-0.5",
                        done ? "bg-ink text-paper" : "bg-paper",
                      )}
                    >
                      <span className={cn("font-display text-3xl leading-none", done ? "text-yellow" : "text-ink/20")}>
                        {ch.no}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold leading-tight">{ch.title}</span>
                        <span className="mt-1 block text-sm leading-6 opacity-80">{ch.blurb}</span>
                        <span className={cn("mt-2 block font-mono text-[10px] uppercase tracking-widest", done ? "text-yellow" : "text-muted")}>
                          {ch.minutes} min · {ch.titleEn}
                          {done ? " · done" : ""}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
