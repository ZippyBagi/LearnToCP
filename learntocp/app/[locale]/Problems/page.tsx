import type { Metadata } from "next";
import { requireAuth } from "@/app/utils/requireAuth";
import {
  listProblems,
  getProblemTitle,
  getProblemTopic,
  getProblemTags,
} from "@/app/judge0/problems";
import { getSolvedProblemSlugs } from "@/app/judge0/progress";
import { getAcceptanceStats } from "@/app/judge0/acceptance";
import { getProblemListMessages } from "@/translations";
import ProblemsExplorer, {
  type ProblemListItem,
} from "./_components/ProblemsExplorer";

interface ProblemsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProblemsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: getProblemListMessages(locale).title };
}

export default async function ProblemsPage({ params }: ProblemsPageProps) {
  const { locale } = await params;
  await requireAuth(locale, `/${locale}/Problems`);

  // Ordered hardest-last by display number; nulls (un-numbered) sort to the end.
  const problems = listProblems().sort((a, b) => {
    const an = a.meta.number ?? Infinity;
    const bn = b.meta.number ?? Infinity;
    if (an !== bn) return an - bn;
    return a.slug.localeCompare(b.slug);
  });

  const slugs = problems.map((p) => p.slug);

  // The signed-in user's solved set + community acceptance stats. Both are
  // independent reads, so run them concurrently.
  const [solved, acceptance] = await Promise.all([
    getSolvedProblemSlugs(),
    getAcceptanceStats(slugs),
  ]);

  const items: ProblemListItem[] = problems.map((p) => ({
    slug: p.slug,
    number: p.meta.number ?? null,
    title: getProblemTitle(p, locale),
    topic: getProblemTopic(p, locale),
    difficulty: p.meta.difficulty ?? null,
    tags: getProblemTags(p),
    solved: solved.has(p.slug),
    acceptance: acceptance.get(p.slug)?.rate ?? null,
  }));

  return <ProblemsExplorer locale={locale} problems={items} />;
}
