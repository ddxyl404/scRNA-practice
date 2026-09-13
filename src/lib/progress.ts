import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completed: string[];
  lastSlug: string | null;
  quizScores: Record<string, number>;
  markComplete: (slug: string) => void;
  setLast: (slug: string) => void;
  setQuizScore: (id: string, score: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      lastSlug: null,
      quizScores: {},
      markComplete: (slug) => {
        const next = new Set(get().completed);
        next.add(slug);
        set({ completed: [...next], lastSlug: slug });
      },
      setLast: (slug) => set({ lastSlug: slug }),
      setQuizScore: (id, score) =>
        set({ quizScores: { ...get().quizScores, [id]: score } }),
      reset: () => set({ completed: [], lastSlug: null, quizScores: {} }),
    }),
    { name: "scrna-practice-progress", skipHydration: true },
  ),
);
