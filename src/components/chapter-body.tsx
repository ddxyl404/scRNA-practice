import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Chapter, ContentBlock } from "@/data/types";
import { bookPageUrl } from "@/lib/asset";
import { adjacentChapters, partOf } from "@/data/chapters";
import { PART_COLOR } from "@/data/parts";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { ChapterFigure } from "./figures";
import { PartStamp } from "./site-shell";

const CALLOUT_STYLE = {
  tip: { label: "小提示", bg: "bg-cyan" },
  warn: { label: "先停一下", bg: "bg-yellow" },
  rec: { label: "可以这样做", bg: "bg-lime" },
  pitfall: { label: "常见翻车", bg: "bg-pink" },
  cite: { label: "出处", bg: "bg-paper" },
} as const;

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-base leading-8 text-ink">{block.text}</p>;
    case "h2":
      return (
        <h2 className="mt-10 border-l-8 border-ink pl-3 font-display text-2xl uppercase tracking-tight md:text-3xl">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-6 font-display text-xl uppercase tracking-tight">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="space-y-2 border-3 border-ink bg-paper p-4 shadow-brutal-sm">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-7">
              <span className="mt-2 size-2 shrink-0 bg-ink" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-[15px] leading-7">
              <span className="flex size-7 shrink-0 items-center justify-center border-2 border-ink bg-yellow font-display text-sm">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "callout": {
      const meta = CALLOUT_STYLE[block.kind];
      return (
        <aside className="border-3 border-ink bg-paper shadow-brutal">
          <div
            className={cn(
              "border-b-3 border-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest",
              meta.bg,
            )}
          >
            {meta.label} · {block.title}
          </div>
          <p className="px-4 py-3 text-[15px] leading-7">{block.body}</p>
        </aside>
      );
    }
    case "code":
      return (
        <figure className="max-w-full overflow-hidden border-3 border-ink bg-ink shadow-brutal-sm">
          <figcaption className="flex items-center justify-between gap-2 border-b-3 border-ink bg-yellow px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
            <span className="min-w-0 truncate">{block.caption ?? "代码"}</span>
            <span className="shrink-0 opacity-70">{block.lang}</span>
          </figcaption>
          <pre className="max-w-full overflow-x-auto p-4 font-mono text-[13px] leading-6 text-lime">
            <code>{block.code}</code>
          </pre>
        </figure>
      );
    case "table":
      return (
        <div className="max-w-full overflow-x-auto border-3 border-ink bg-paper shadow-brutal-sm">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-ink text-yellow">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-r-2 border-yellow/30 px-3 py-2 font-display text-xs uppercase last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t-2 border-ink even:bg-bg">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="break-words border-r-2 border-ink/10 px-3 py-2 align-top last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-3 border-ink bg-yellow p-5 shadow-brutal">
          <p className="font-display text-xl leading-snug md:text-2xl">{block.text}</p>
          {block.cite ? (
            <footer className="mt-3 font-mono text-xs uppercase tracking-widest">
              — {block.cite}
            </footer>
          ) : null}
        </blockquote>
      );
    case "figure":
      return <ChapterFigure fig={block.fig} caption={block.caption} />;
    default:
      return null;
  }
}

export function ChapterBody({ chapter }: { chapter: Chapter }) {
  const { prev, next } = adjacentChapters(chapter.slug);
  const part = partOf(chapter);
  const completed = useProgress((s) => s.completed.includes(chapter.slug));
  const mark = useProgress((s) => s.markComplete);
  const setLast = useProgress((s) => s.setLast);

  return (
    <article className="mx-auto w-full min-w-0 max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <PartStamp partId={chapter.part} />
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          {chapter.minutes} min · {chapter.titleEn}
        </span>
      </div>
      <p className="font-display text-6xl leading-none text-ink/15">{chapter.no}</p>
      <h1 className="-mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl">
        {chapter.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{chapter.blurb}</p>

      <section className="mt-8 border-3 border-ink bg-paper p-5 shadow-brutal">
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest">
          读完，你大概能
        </h2>
        <ul className="mt-3 space-y-2">
          {chapter.objectives.map((o) => (
            <li key={o} className="flex gap-2 text-sm leading-7">
              <span className={cn("mt-1.5 size-3 shrink-0 border-2 border-ink", PART_COLOR[part.color])} />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 space-y-6">
        {chapter.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      <section className="mt-12 border-3 border-ink bg-lime p-5 shadow-brutal">
        <h2 className="font-display text-2xl uppercase">合上这一章之前</h2>
        <ol className="mt-3 space-y-2">
          {chapter.takeaways.map((t, i) => (
            <li key={t} className="flex gap-3 text-sm leading-7">
              <span className="font-display">{i + 1}.</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>

      {chapter.tools.length ? (
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
          会碰到的工具 · {chapter.tools.join(" / ")}
        </p>
      ) : null}

      <p className="mt-2 break-words text-sm leading-7">
        想对着原书网页和 notebook 看？这一节在{" "}
        <a
          className="font-bold underline decoration-2 underline-offset-4"
          href={bookPageUrl(chapter.sourcePath)}
          target="_blank"
          rel="noreferrer"
        >
          {bookPageUrl(chapter.sourcePath).replace("https://", "")}
        </a>
        。文里标了「原书图」的，来自那一页的示意图或实际输出。
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            mark(chapter.slug);
            setLast(chapter.slug);
          }}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 border-3 border-ink px-4 font-bold shadow-brutal-sm",
            completed ? "bg-ink text-lime" : "bg-pink",
          )}
        >
          <Check className="size-4" strokeWidth={3} />
          {completed ? "这章读过了" : "我读完了"}
        </button>
      </div>

      <nav className="mt-12 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/chapters/$slug"
            params={{ slug: prev.slug }}
            className="flex min-h-20 items-center gap-3 border-3 border-ink bg-paper p-4 no-underline shadow-brutal-sm"
          >
            <ChevronLeft className="size-5 shrink-0" />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
                上一章
              </span>
              <span className="font-bold">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/chapters/$slug"
            params={{ slug: next.slug }}
            className="flex min-h-20 items-center justify-end gap-3 border-3 border-ink bg-yellow p-4 text-right no-underline shadow-brutal-sm"
          >
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-widest">
                下一章
              </span>
              <span className="font-bold">{next.title}</span>
            </span>
            <ChevronRight className="size-5 shrink-0" />
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
