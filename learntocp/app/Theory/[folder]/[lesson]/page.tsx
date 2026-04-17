import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import markdownToHtml from "@/app/utils/mdToHTML";
import LessonSkeleton from "@/app/Theory/_components/LessonSkeleton";

interface PageProps {
  params: Promise<{
    folder: string;
    lesson: string;
  }>;
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
 * Thin page shell. Wrapping `<LessonContent>` in `<Suspense>` means:
 *  1. The route's static shell streams immediately on navigation.
 *  2. The fallback (same visual as `Theory/loading.tsx`) flashes until the
 *     markdown → HTML pipeline resolves, so the user always sees a skeleton
 *     rather than a blank frame — even in dev, and even for cached pages
 *     whose RSC payload is still in flight.
 */
export default async function LessonPage({ params }: PageProps) {
  const { folder, lesson } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContent folder={folder} lesson={lesson} />
    </Suspense>
  );
}

async function LessonContent({
  folder,
  lesson,
}: {
  folder: string;
  lesson: string;
}) {
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
