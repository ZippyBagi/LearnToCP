import Link from "next/link";
import { requireAuth } from "@/app/utils/requireAuth";
import { listProblems, getProblemTitle } from "@/app/judge0/problems";
import { getSolvedProblemSlugs } from "@/app/judge0/progress";

interface ProblemsPageProps {
  params: Promise<{ locale: string }>;
}
export default async function ProblemsPage({ params }: ProblemsPageProps) {
  const { locale } = await params;
  await requireAuth(locale, `/${locale}/Problems`);

  const problems = listProblems();
  const solved = await getSolvedProblemSlugs();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Problems</h1>

      {problems.length === 0 ? (
        <p>No problems yet.</p>
      ) : (
        <ul className="space-y-2">
          {problems.map((p) => (
            <li key={p.slug} className="flex items-center gap-3">
              <span aria-hidden className="w-5 text-green-600">
                {solved.has(p.slug) ? "✓" : ""}
              </span>
              <Link
                href={`/${locale}/Problems/${encodeURIComponent(p.slug)}`}
                className="underline underline-offset-2"
              >
                {getProblemTitle(p, locale)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
