import LessonSkeleton from "@/app/Theory/_components/LessonSkeleton";

/**
 * Segment-level fallback for the [lesson] route. Next renders `loading.tsx`
 * during server-side work on dynamic navigations; for fully static pages it
 * may not fire, which is why the page also has an inline <Suspense> with the
 * same skeleton. Keeping both in sync prevents any shape flicker.
 */
export default function Loading() {
  return <LessonSkeleton />;
}
