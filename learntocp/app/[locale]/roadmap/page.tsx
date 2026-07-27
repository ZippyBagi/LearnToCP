import type { Metadata } from "next";
import { RoadmapCanvas } from "@/app/ui/roadmap/RoadmapCanvas";
import { getRoadmapMatrix } from "@/app/utils/getRoadmapMatrix";
import { isAuthenticated } from "@/app/utils/requireAuth";
import { getCompletedItemIds } from "@/app/utils/getRoadmapProgress";
import { getSolvedProblemSlugs } from "@/app/judge0/progress";
import { getHomeMessages } from "@/translations";
import { pageMetadata } from "@/app/utils/seo";

export async function generateMetadata({
  params,
}: RoadmapPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { map } = getHomeMessages(locale);
  return pageMetadata({
    locale,
    path: "roadmap",
    title: map.title,
    description: map.description,
  });
}

interface RoadmapPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { locale } = await params;
  const isAuthed = await isAuthenticated();

  const matrix = getRoadmapMatrix(locale);
  const [completedIds, solvedSlugs] = isAuthed
    ? await Promise.all([getCompletedItemIds(), getSolvedProblemSlugs()])
    : [[], new Set<string>()];

  return (
    <main className="min-h-fill bg-[var(--color-bg-page)] px-1 py-1 md:px-4 md:py-4">
      <section
        aria-label="Roadmap diagram"
        className="w-full h-[calc(100dvh-5.5rem)] md:h-[calc(100dvh-7rem)]"
      >
        <RoadmapCanvas
          matrix={matrix}
          initialCompleted={completedIds}
          solvedSlugs={[...solvedSlugs]}
          loginUrl={
            isAuthed
              ? null
              : `/${locale}/login?next=${encodeURIComponent(`/${locale}/roadmap`)}`
          }
        />
      </section>
    </main>
  );
}
