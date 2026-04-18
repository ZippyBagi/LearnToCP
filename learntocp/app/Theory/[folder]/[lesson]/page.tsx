import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import markdownToHtml from "@/app/utils/mdToHTML";
import LessonSkeleton from "@/app/Theory/_components/LessonSkeleton";

type ParamsPromise = Promise<{ folder: string; lesson: string }>;
interface PageProps {
  params: ParamsPromise;
}

/**
 * Enumerate every (folder, lesson) pair at build time so the route is fully
 * prerendered. `dynamicParams = false` rejects any pair not produced here.
 */
export async function generateStaticParams(): Promise<
  Array<{ folder: string; lesson: string }>
> {
  const lessonsRoot = path.join(process.cwd(), "content", "LessonsMD");
  if (!fs.existsSync(lessonsRoot)) return [];

  const folders = fs
    .readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const params: Array<{ folder: string; lesson: string }> = [];
  for (const folder of folders) {
    const folderPath = path.join(lessonsRoot, folder);
    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name);

    for (const file of files) {
      params.push({ folder, lesson: path.basename(file, ".md") });
    }
  }
  return params;
}

export const dynamicParams = false;
// Pre-render once at build; never re-render at runtime.
export const revalidate = false;

export async function generateMetadata({ params }: PageProps) {
  const { folder, lesson } = await params;
  const lessonTitle = safeDecode(lesson);
  const folderTitle = safeDecode(folder);
  return {
    title: `${lessonTitle} — ${folderTitle}`,
    description: `${lessonTitle} lesson in the ${folderTitle} track.`,
  };
}

/**
 * IMPORTANT: keep this outer component SYNC — do NOT `await params` here.
 *
 * React/Next emits the RSC stream in the order the server component tree is
 * walked. If this function is async and awaits params before returning, the
 * `<Suspense>` boundary (and its fallback) aren't part of the first RSC chunk;
 * the client router waits for the first byte before committing the transition,
 * so the previous page stays on screen for the entire duration of the server's
 * fs + markdown + Shiki work. That's the "frozen before skeleton" flash the
 * user sees on a cold first-click-in-session (especially in dev, where the
 * route is also being compiled for the first time).
 *
 * By keeping the outer sync and forwarding the params promise into a child
 * async component, the Suspense boundary is in the very first chunk — the
 * client can render the skeleton as soon as it arrives.
 */
export default function LessonPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContent paramsPromise={params} />
    </Suspense>
  );
}

async function LessonContent({ paramsPromise }: { paramsPromise: ParamsPromise }) {
  const { folder, lesson } = await paramsPromise;
  const folderDecoded = safeDecode(folder);
  const lessonDecoded = safeDecode(lesson);

  const filePath = path.join(
    process.cwd(),
    "content",
    "LessonsMD",
    folderDecoded,
    `${lessonDecoded}.md`
  );
  if (!fs.existsSync(filePath)) notFound();

  const markdown = fs.readFileSync(filePath, "utf8");
  const htmlContent = await markdownToHtml(markdown, `${lessonDecoded}.md`);

  return (
    <article
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
