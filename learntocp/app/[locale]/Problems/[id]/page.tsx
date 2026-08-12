import { notFound } from "next/navigation";
import { isAuthenticated } from "@/app/utils/requireAuth";
import markdownToHtml from "@/app/utils/mdToHTML";
import {
  getProblem,
  getProblemDescription,
  getProblemNote,
  getProblemSolution,
  getProblemTitle,
  getProblemTopic,
  getProblemLimits,
} from "@/app/judge0/problems";
import { hasSolvedProblem } from "@/app/judge0/progress";
import { getProblemMessages } from "@/translations";
import { pageMetadata } from "@/app/utils/seo";
import ProblemView from "@/app/ui/problems/ProblemView";

interface ProblemPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ProblemPageProps) {
  const { locale, id } = await params;
  const slug = safeDecode(id);
  const problem = getProblem(slug);
  if (!problem) return { title: getProblemMessages(locale).notFound };

  const title = getProblemTitle(problem, locale);
  const topic = getProblemTopic(problem, locale);
  const difficulty = problem.meta.difficulty
    ? getProblemMessages(locale).difficulty[problem.meta.difficulty]
    : null;
  const descriptor = [difficulty, topic].filter(Boolean).join(" · ");

  const description =
    locale === "sr"
      ? `Reši „${title}”${descriptor ? ` (${descriptor})` : ""} - takmičarski zadatak na LearnToCP.`
      : `Solve "${title}"${descriptor ? ` (${descriptor})` : ""} - a competitive-programming problem on LearnToCP.`;

  return pageMetadata({
    locale,
    path: `Problems/${encodeURIComponent(slug)}`,
    title,
    description,
  });
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { locale, id } = await params;
  const isAuthed = await isAuthenticated();

  const slug = safeDecode(id);

  // The problem exists only if content/problems/<slug>/problem.json does
  const problem = getProblem(slug);
  if (!problem) notFound();

  const title = getProblemTitle(problem, locale);
  const { timeLimit, memoryLimit } = getProblemLimits(problem);

  const statementMd = getProblemDescription(slug, locale);
  const statementHtml = statementMd
    ? await markdownToHtml(statementMd, title, { includeTitle: false, locale })
    : null;

  const solutionMd = getProblemSolution(slug, locale);
  const solutionHtml = solutionMd
    ? await markdownToHtml(solutionMd, title, { includeTitle: false, locale })
    : null;

  const solved = isAuthed ? await hasSolvedProblem(slug) : false;

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
      locale={locale}
      meta={meta}
      statementHtml={statementHtml}
      solutionHtml={solutionHtml}
      solved={solved}
      isAuthed={isAuthed}
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
