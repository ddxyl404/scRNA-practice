import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "出了点问题。试着刷新页面。";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-ink">
      <span
        className="flex size-16 items-center justify-center border-3 border-ink bg-pink shadow-brutal"
        aria-hidden="true"
      >
        <TriangleAlert className="size-8" strokeWidth={2.5} />
      </span>
      <h1 className="font-display text-3xl uppercase">Something broke</h1>
      <p className="max-w-md text-base break-words text-muted">{errorMessage(error)}</p>
    </main>
  );
}
