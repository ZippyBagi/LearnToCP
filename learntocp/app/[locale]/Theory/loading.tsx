import LessonSkeleton from "./_components/LessonSkeleton";

// Segment-level fallback rendered by Next.js for any `/Theory/*` route that
// suspends during navigation.
export default function Loading() {
  return <LessonSkeleton />;
}
