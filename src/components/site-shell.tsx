import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CHAPTERS } from "@/data/chapters";
import { PARTS, PART_COLOR } from "@/data/parts";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "首页" },
  { to: "/pipeline", label: "流程" },
  { to: "/chapters", label: "章节" },
  { to: "/glossary", label: "术语" },
  { to: "/quiz", label: "测验" },
  { to: "/about", label: "关于" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const completed = useProgress((s) => s.completed);
  const pct = Math.round((completed.length / CHAPTERS.length) * 100);

  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-3 focus:border-ink focus:bg-yellow focus:px-4 focus:py-2"
      >
        跳到正文
      </a>
      <header className="sticky top-0 z-40 border-b-3 border-ink bg-yellow">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="flex size-10 items-center justify-center border-3 border-ink bg-ink text-yellow shadow-brutal-sm">
              <BookOpen className="size-5" strokeWidth={2.5} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg uppercase tracking-tight">
                scRNA
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-widest">
                Practice
              </span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "border-3 border-ink px-3 py-1.5 text-sm font-bold no-underline shadow-brutal-sm transition-transform",
                    active ? "bg-ink text-yellow" : "bg-paper hover:translate-x-px hover:translate-y-px",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="ml-auto flex size-11 items-center justify-center border-3 border-ink bg-paper shadow-brutal-sm md:hidden"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <div className="h-2 border-t-3 border-ink bg-paper">
          <div
            className="h-full bg-pink transition-[width] duration-300"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </div>
        {open ? (
          <div className="border-t-3 border-ink bg-paper p-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-3 border-ink bg-yellow px-3 py-3 text-center text-sm font-bold no-underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <div id="main">{children}</div>
      <footer className="mt-16 border-t-3 border-ink bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl uppercase">scRNA Practice</p>
            <p className="mt-2 text-sm text-yellow">
              单细胞分析 · 一本读完的流程
            </p>
          </div>
          <div className="text-sm leading-relaxed">
            <p>内容梳理自 Theislab《Single-cell best practices》。</p>
            <p className="mt-2">
              请引用 Heumos et al. Nat Rev Genet 2023。本站是教学整理，不是原书镜像。
            </p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-xs uppercase">
            <a
              className="text-yellow underline-offset-4 hover:underline"
              href="https://www.sc-best-practices.org/"
              target="_blank"
              rel="noreferrer"
            >
              sc-best-practices.org
            </a>
            <a
              className="text-yellow underline-offset-4 hover:underline"
              href="https://github.com/theislab/single-cell-best-practices"
              target="_blank"
              rel="noreferrer"
            >
              原书 GitHub
            </a>
            <a
              className="text-yellow underline-offset-4 hover:underline"
              href="https://github.com/ddxyl404/scRNA-practice"
              target="_blank"
              rel="noreferrer"
            >
              ddxyl404/scRNA-practice
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PartStamp({ partId }: { partId: string }) {
  const part = PARTS.find((p) => p.id === partId);
  if (!part) return null;
  return (
    <span
      className={cn(
        "inline-flex border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest",
        PART_COLOR[part.color],
      )}
    >
      {part.index} · {part.title}
    </span>
  );
}
