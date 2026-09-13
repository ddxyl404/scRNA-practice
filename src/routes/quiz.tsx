import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QUESTIONS } from "@/data/quiz";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({ component: QuizPage });

function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const setScore = useProgress((s) => s.setQuizScore);

  const score = useMemo(() => {
    return QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0);
  }, [answers]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">Check</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none md:text-6xl">
        读完测测
      </h1>
      <p className="mt-4 text-lg text-muted">
        10 道概念题，覆盖 QC、归一化、降维、整合、DE 与机制。提交后会告诉你为什么。
      </p>

      <ol className="mt-10 space-y-6">
        {QUESTIONS.map((q, i) => {
          const picked = answers[q.id];
          return (
            <li key={q.id} className="border-3 border-ink bg-paper shadow-brutal-sm">
              <div className="border-b-3 border-ink bg-yellow px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest">
                Q{i + 1} · {q.chapter}
              </div>
              <p className="px-4 pt-4 font-bold leading-6">{q.prompt}</p>
              <div className="grid gap-2 p-4">
                {q.options.map((opt, oi) => {
                  const chosen = picked === oi;
                  let tone = "bg-bg hover:bg-yellow/40";
                  if (submitted) {
                    if (oi === q.answer) tone = "bg-lime";
                    else if (chosen) tone = "bg-pink";
                  } else if (chosen) {
                    tone = "bg-yellow";
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cn(
                        "min-h-12 border-2 border-ink px-3 py-2 text-left text-sm leading-6",
                        tone,
                      )}
                    >
                      <span className="mr-2 font-display">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted ? (
                <p className="border-t-3 border-ink bg-bg px-4 py-3 text-sm leading-6">
                  {q.explain}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="min-h-12 border-3 border-ink bg-pink px-6 font-bold shadow-brutal"
          onClick={() => {
            setSubmitted(true);
            setScore("main", score);
          }}
        >
          提交
        </button>
        {submitted ? (
          <p className="font-display text-2xl uppercase">
            {score} / {QUESTIONS.length}
          </p>
        ) : null}
        {submitted ? (
          <Link to="/chapters" className="font-bold underline decoration-2 underline-offset-4">
            回到章节补漏
          </Link>
        ) : null}
      </div>
    </main>
  );
}
