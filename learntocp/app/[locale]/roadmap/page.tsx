import type { Metadata } from "next";
import { RoadmapCanvas } from "@/app/ui/roadmap/RoadmapCanvas";
import { getRoadmapMatrix } from "@/app/utils/getRoadmapMatrix";
import { requireAuth } from "@/app/utils/requireAuth";
import { getCompletedItemIds } from "@/app/utils/getRoadmapProgress";
import { getSolvedProblemSlugs } from "@/app/judge0/progress";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Track your learning path and progress through the roadmap.",
};

interface RoadmapPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {

  const {locale} = await params
  await requireAuth(locale, `/${locale}/roadmap`);

  const matrix = getRoadmapMatrix(locale);
  // Theory progress (user-toggled) and solved problems (read-only) are
  // independent reads — fetch concurrently.
  const [completedIds, solvedSlugs] = await Promise.all([
    getCompletedItemIds(),
    getSolvedProblemSlugs(),
  ]);

  return (
    <main className="min-h-fill bg-[var(--color-bg-page)] px-4 py-4">
      <section aria-label="Roadmap diagram" className="w-full h-[calc(100vh-7rem)]">
        <RoadmapCanvas
          matrix={matrix}
          initialCompleted={completedIds}
          solvedSlugs={[...solvedSlugs]}
        />
      </section>
    </main>
  );
}