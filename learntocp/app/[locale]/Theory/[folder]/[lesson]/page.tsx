import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import markdownToHtml from "@/app/utils/mdToHTML";
import LessonSkeleton from "../../_components/LessonSkeleton";
import { stripOrderPrefix } from "@/app/utils/generateSidebarContainers";
import { getLessonsRoot } from "@/app/utils/getLessonRoot";

// 1. Added 'locale' to the expected Promise payload
type ParamsPromise = Promise<{ locale: string; folder: string; lesson: string }>;
interface PageProps {
  params: ParamsPromise;
}

/**
 * Enumerate every (folder, lesson) pair at build time so the route is fully
 * prerendered. `dynamicParams = false` rejects any pair not produced here.
 */
// 2. Destructure 'params' from the arguments to access the parent layout's locale
// 1. Define the exact type Next.js's validator is demanding
type StaticParamsProps = {
  params: { locale: string; folder: string; lesson: string };
};

export async function generateStaticParams({
  params,
}: StaticParamsProps): Promise<Array<{ locale: string; folder: string; lesson: string }>> {
  
  // 2. Wrap params in Promise.resolve() 
  // This satisfies TypeScript (which thinks it's a sync object) 
  // AND Next.js 15 (which passes a Promise at runtime).
  const resolvedParams = await Promise.resolve(params);
  const parentLocale = resolvedParams?.locale;

  // 3. Fallback logic remains the same
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
  // 5. Extract 'locale' from the awaited params here
  const { locale, folder, lesson } = await paramsPromise;
  const folderDecoded = safeDecode(folder);
  const lessonDecoded = safeDecode(lesson);

  // 6. Use the localized root path instead of the hardcoded process.cwd() path
  const lessonsRoot = getLessonsRoot(locale);

  // The folder on disk may have a numeric prefix (e.g. "01 Basics"). Find the
  // actual directory whose stripped name matches the URL segment.
  const allFolders = fs
    .readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
  const actualFolder =
    allFolders.find((f) => stripOrderPrefix(f) === folderDecoded) ?? folderDecoded;

  const folderPath = path.join(lessonsRoot, actualFolder);

  // The file on disk may also have a numeric prefix (e.g. "3 Vectors.md"). Find
  // the actual file whose stripped basename matches the URL segment.
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