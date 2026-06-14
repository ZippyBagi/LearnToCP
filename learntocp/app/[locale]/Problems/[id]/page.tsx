import { notFound } from "next/navigation";
import { requireAuth } from "@/app/utils/requireAuth";
import markdownToHtml from "@/app/utils/mdToHTML";
import {
  getProblem,
  getProblemDescription,
  getProblemNote,
  getProblemSolution,
  getProblemTitle,
  getProblemLimits,
} from "@/app/judge0/problems";
import ProblemView from "../_components/ProblemView";

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
  const { timeLimit, memoryLimit } = getProblemLimits(problem);

  const statementMd = getProblemDescription(slug, locale);
  const statementHtml = statementMd
    ? await markdownToHtml(statementMd, title, { includeTitle: false })
    : null;

  const solutionMd = getProblemSolution(slug, locale);
  const solutionHtml = solutionMd
    ? await markdownToHtml(solutionMd, title, { includeTitle: false })
    : null;

  const meta = {
    title,
    difficulty: problem.meta.difficulty ?? null,
    number: problem.meta.number ?? null,
    note: getProblemNote(problem, locale),
    timeLimitLabel: formatTime(timeLimit),
    memoryLabel: formatMemory(memoryLimit),
    inputSource: problem.meta.inputSource ?? "stdin",
    outputSource: problem.meta.outputSource ?? "stdout",
  };

  return (
    <ProblemView
      problemId={slug}
      meta={meta}
      statementHtml={statementHtml}
      solutionHtml={solutionHtml}
    />
  );
}

function formatTime(seconds: number): string {
  // Trim trailing zeros: 1.0 → "1 s", 2.5 → "2.5 s"
  return `${parseFloat(String(seconds))} s`;
}

function formatMemory(kb: number): string {
  const mb = kb / 1024;
  return `${Number.isInteger(mb) ? mb : mb.toFixed(0)} MB`;
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
