import type { Metadata } from "next";
import { isAuthenticated } from "@/app/utils/requireAuth";
import {
  listProblems,
  getProblemTitle,
  getProblemTopic,
  getProblemTags,
} from "@/app/judge0/problems";
import { getSolvedProblemSlugs } from "@/app/judge0/progress";
import { getAcceptanceStats } from "@/app/judge0/acceptance";
import { getProblemListMessages } from "@/translations";
import { pageMetadata } from "@/app/utils/seo";
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
  const total = listProblems().length;
  const messages = getProblemListMessages(locale);
  return pageMetadata({
    locale,
    path: "Problems",
    title: messages.title,
    description: messages.subtitle(total, 0),
  });
}

export default async function ProblemsPage({ params }: ProblemsPageProps) {
  const { locale } = await params;
  const isAuthed = await isAuthenticated();

  // Ordered hardest-last by display number; nulls (un-numbered) sort to the end.
  const problems = listProblems().sort((a, b) => {
    const an = a.meta.number ?? Infinity;
    const bn = b.meta.number ?? Infinity;
    if (an !== bn) return an - bn;
    return a.slug.localeCompare(b.slug);
  });

  const slugs = problems.map((p) => p.slug);

  const [solved, acceptance] = await Promise.all([
    isAuthed ? getSolvedProblemSlugs() : Promise.resolve(new Set<string>()),
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

  return <ProblemsExplorer locale={locale} problems={items} isAuthed={isAuthed} />;
}
