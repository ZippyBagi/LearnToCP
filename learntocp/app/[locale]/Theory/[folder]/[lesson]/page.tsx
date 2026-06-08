import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import markdownToHtml from "@/app/utils/mdToHTML";
import LessonSkeleton from "../../_components/LessonSkeleton";
import { stripOrderPrefix } from "@/app/utils/generateSidebarContainers";
import { getLessonsRoot } from "@/app/utils/getLessonRoot";

type ParamsPromise = Promise<{ locale: string; folder: string; lesson: string }>;
interface PageProps {
  params: ParamsPromise;
}

type StaticParamsProps = {
  params: { locale: string; folder: string; lesson: string };
};

export async function generateStaticParams({
  params,
}: StaticParamsProps): Promise<Array<{ locale: string; folder: string; lesson: string }>> {
  // Promise.resolve satisfies TS (sync type) while Next.js 15 passes a Promise at runtime
  const resolvedParams = await Promise.resolve(params);
  const parentLocale = resolvedParams?.locale;

  const localesToGenerate = parentLocale ? [parentLocale] : ["en", "sr"];
  const paths: Array<{ locale: string; folder: string; lesson: string }> = [];

  for (const currentLocale of localesToGenerate) {
    const lessonsRoot = getLessonsRoot(currentLocale);

    if (!fs.existsSync(lessonsRoot)) continue;

    const folders = fs
      .readdirSync(lessonsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    for (const folder of folders) {
      const folderPath = path.join(lessonsRoot, folder);
      const files = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => e.name);

      const displayFolder = stripOrderPrefix(folder);
      for (const file of files) {
        const displayLesson = stripOrderPrefix(path.basename(file, ".md"));

        paths.push({
          locale: currentLocale,
          folder: displayFolder,
          lesson: displayLesson,
        });
      }
    }
  }

  return paths;
}

export const dynamicParams = false;
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

// Outer component must stay sync — awaiting params here delays the Suspense boundary,
// causing the old page to freeze on screen until the server finishes all fs+markdown work.
export default function LessonPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContent paramsPromise={params} />
    </Suspense>
  );
}

async function LessonContent({ paramsPromise }: { paramsPromise: ParamsPromise }) {
  const { locale, folder, lesson } = await paramsPromise;
  const folderDecoded = safeDecode(folder);
  const lessonDecoded = safeDecode(lesson);

  const lessonsRoot = getLessonsRoot(locale);

  // Disk folders/files may have a numeric order prefix (e.g. "01 Basics") — match by stripped name
  const allFolders = fs
    .readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
  const actualFolder =
    allFolders.find((f) => stripOrderPrefix(f) === folderDecoded) ?? folderDecoded;

  const folderPath = path.join(lessonsRoot, actualFolder);

  const allFiles = fs.existsSync(folderPath)
    ? fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => e.name)
    : [];
  const actualFile = allFiles.find(
    (f) => stripOrderPrefix(path.basename(f, ".md")) === lessonDecoded
  );

  if (!actualFile) notFound();

  const filePath = path.join(folderPath, actualFile);
  const markdown = fs.readFileSync(filePath, "utf8");
  const htmlContent = await markdownToHtml(markdown, actualFile);

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
