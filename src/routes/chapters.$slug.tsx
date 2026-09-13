import { createFileRoute, notFound } from "@tanstack/react-router";
import { chapterBySlug } from "@/data/chapters";
import { ChapterBody } from "@/components/chapter-body";

export const Route = createFileRoute("/chapters/$slug")({
  loader: ({ params }) => {
    const chapter = chapterBySlug(params.slug);
    if (!chapter) throw notFound();
    return { chapter };
  },
  component: ChapterPage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-display text-6xl">404</p>
      <p className="mt-2 text-lg">这一章不存在。</p>
    </main>
  ),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.chapter.no} ${loaderData.chapter.title} · scRNA Practice`
          : "scRNA Practice",
      },
    ],
  }),
});

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  return <ChapterBody chapter={chapter} />;
}
