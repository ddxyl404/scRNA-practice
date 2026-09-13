import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { CHAPTERS, TOTAL_MINUTES } from "@/data/chapters";
import { PARTS, PART_COLOR } from "@/data/parts";
import { PipelineMap } from "@/components/pipeline-map";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const completed = useProgress((s) => s.completed);
  const lastSlug = useProgress((s) => s.lastSlug);
  const last = CHAPTERS.find((c) => c.slug === lastSlug) ?? CHAPTERS[0]!;
  const resumeSlug = lastSlug ?? CHAPTERS[0]!.slug;

  return (
    <main>
      <section className="border-b-3 border-ink bg-bg">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.3fr_0.7fr] lg:py-16">
          <div>
            <p className="inline-block border-3 border-ink bg-pink px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-brutal-sm">
              一本读完的分析流程
            </p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
              单细胞分析
              <br />
              写给你读
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8">
              顺着{" "}
              <a
                className="font-bold underline decoration-2 underline-offset-4"
                href="https://www.sc-best-practices.org/"
                target="_blank"
                rel="noreferrer"
              >
                sc-best-practices.org
              </a>{" "}
              往下走：每一步在干什么、为什么这样选、选错了会怎样。图和代码都放在正文里，不必先对着 notebook 才能跟下来。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/chapters/$slug"
                params={{ slug: resumeSlug }}
                className="inline-flex min-h-12 items-center gap-2 border-3 border-ink bg-yellow px-5 font-bold no-underline shadow-brutal hover:-translate-y-0.5"
              >
                {lastSlug ? "接着读" : "从怎么读开始"}
                <ArrowRight className="size-4" strokeWidth={3} />
              </Link>
              <Link
                to="/pipeline"
                className="inline-flex min-h-12 items-center gap-2 border-3 border-ink bg-paper px-5 font-bold no-underline shadow-brutal-sm"
              >
                看完整流程
              </Link>
            </div>
          </div>
          <aside className="flex flex-col justify-end gap-3">
            <StatCard icon={<GraduationCap className="size-5" />} k={String(CHAPTERS.length)} v="章" />
            <StatCard icon={<Clock className="size-5" />} k={`~${TOTAL_MINUTES}`} v="分钟可读完" />
            <StatCard
              icon={<span className="font-display text-lg">{completed.length}</span>}
              k={`${Math.round((completed.length / CHAPTERS.length) * 100)}%`}
              v="本机阅读进度"
            />
          </aside>
        </div>
      </section>

      <section className="border-b-3 border-ink bg-cyan/40">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl uppercase md:text-4xl">主干 12 步</h2>
            <Link to="/pipeline" className="font-mono text-xs font-bold uppercase tracking-widest">
              展开全部 →
            </Link>
          </div>
          <PipelineMap compact />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-3xl uppercase md:text-4xl">七个单元</h2>
        <p className="mt-2 max-w-2xl text-muted">
          对应原书的 parts。可以顺着读，也可以按课题只抽后面几章。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PARTS.map((part) => {
            const chs = CHAPTERS.filter((c) => c.part === part.id);
            const done = chs.filter((c) => completed.includes(c.slug)).length;
            return (
              <Link
                key={part.id}
                to="/chapters"
                hash={part.id}
                className="group border-3 border-ink bg-paper p-5 no-underline shadow-brutal transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold",
                      PART_COLOR[part.color],
                    )}
                  >
                    UNIT {part.index}
                  </span>
                  <span className="font-mono text-xs">
                    {done}/{chs.length}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase leading-none">{part.title}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                  {part.titleEn}
                </p>
                <p className="mt-3 text-sm leading-6">{part.summary}</p>
                <p className="mt-4 font-bold text-sm group-hover:underline">
                  {chs.map((c) => c.title).join(" · ")}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t-3 border-ink bg-yellow">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="font-display text-3xl uppercase">怎么用这本书</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["顺着读", "00–11 章刚好走完「从矩阵到细胞类型」。差异表达和轨迹，第二遍再加。"],
              ["对着图和代码读", "每章有比喻、原书风格的代码、示意和坑。卡住了去术语表，读完去做测验。"],
              ["想动手时回原书", "每章底部连到 sc-best-practices 对应 notebook。完整可执行代码，仍以原书为准。"],
            ].map(([t, b]) => (
              <div key={t} className="border-3 border-ink bg-paper p-5 shadow-brutal-sm">
                <h3 className="font-display text-xl uppercase">{t}</h3>
                <p className="mt-2 text-sm leading-6">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm">
            最近阅读：
            <Link
              to="/chapters/$slug"
              params={{ slug: last.slug }}
              className="ml-2 font-bold underline decoration-2 underline-offset-4"
            >
              {last.no} {last.title}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  k,
  v,
}: {
  icon: React.ReactNode;
  k: string;
  v: string;
}) {
  return (
    <div className="flex items-center gap-4 border-3 border-ink bg-paper p-4 shadow-brutal-sm">
      <span className="flex size-12 items-center justify-center border-2 border-ink bg-yellow">
        {icon}
      </span>
      <span>
        <span className="block font-display text-3xl leading-none">{k}</span>
        <span className="font-mono text-[11px] uppercase tracking-widest">{v}</span>
      </span>
    </div>
  );
}
