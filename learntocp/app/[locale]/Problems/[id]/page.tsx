import { notFound } from "next/navigation";
import { requireAuth } from "@/app/utils/requireAuth";
import markdownToHtml from "@/app/utils/mdToHTML";
import {
  getProblem,
  getProblemDescription,
  getProblemTitle,
} from "@/lib/problems";
import SubmitPanel from "../_components/SubmitPanel";

interface ProblemPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ProblemPageProps) {
  const { locale, id } = await params;
  const problem = getProblem(safeDecode(id));
  if (!problem) return { title: "Problem not found" };
  return { title: getProblemTitle(problem, locale) };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { locale, id } = await params;
  await requireAuth(locale, `/${locale}/Problems/${encodeURIComponent(id)}`);

  const slug = safeDecode(id);

  // The problem exists only if content/problems/<slug>/problem.json does
  const problem = getProblem(slug);
  if (!problem) notFound();

  const title = getProblemTitle(problem, locale);
  const markdown = getProblemDescription(slug, locale);
  const htmlContent = markdown ? await markdownToHtml(markdown, title) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {htmlContent ? (
        <article
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <h1 className="text-2xl font-semibold">{title}</h1>
      )}

      <SubmitPanel problemId={slug} />
    </div>
  );
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
