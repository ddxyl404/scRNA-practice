import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GLOSSARY } from "@/data/glossary";

export const Route = createFileRoute("/glossary")({ component: GlossaryPage });

function GlossaryPage() {
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return GLOSSARY;
    return GLOSSARY.filter(
      (g) =>
        g.term.toLowerCase().includes(s) ||
        g.en.toLowerCase().includes(s) ||
        g.def.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">Lexicon</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none md:text-6xl">
        术语表
      </h1>
      <p className="mt-4 text-lg text-muted">
        后文会反复碰到的词。英文保留，方便对照原书和论文。
      </p>
      <label className="mt-8 block">
        <span className="sr-only">搜索术语</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：UMI、伪 bulk、Leiden…"
          className="h-12 w-full border-3 border-ink bg-paper px-4 font-sans shadow-brutal-sm outline-none"
        />
      </label>
      <ul className="mt-8 divide-y-2 divide-ink border-3 border-ink bg-paper shadow-brutal">
        {items.map((g) => (
          <li key={g.en} className="grid gap-1 px-4 py-4 sm:grid-cols-[10rem_1fr]">
            <div>
              <p className="font-display text-lg uppercase leading-none">{g.term}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                {g.en}
              </p>
            </div>
            <p className="text-sm leading-6">{g.def}</p>
          </li>
        ))}
      </ul>
      {items.length === 0 ? (
        <p className="mt-6 border-3 border-ink bg-yellow p-4 font-bold">没有匹配的术语。</p>
      ) : null}
    </main>
  );
}
