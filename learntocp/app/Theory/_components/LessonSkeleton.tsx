/**
 * Skeleton fallback for lesson pages. Shared by:
 *   - `app/Theory/loading.tsx` — shown during segment navigation
 *   - the inline `<Suspense>` boundary in the lesson page — shown while the
 *     markdown → HTML pipeline resolves (dev mode, streaming).
 *
 * Lives under `_components` so the leading underscore prevents Next.js from
 * treating it as a route segment.
 */
export default function LessonSkeleton() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="h-[3rem] w-[45%] rounded-md mb-8 mx-auto animate-pulse bg-[#061a27]" />

      <div className="relative w-full min-h-[82vh] rounded-lg flex items-center justify-center animate-pulse bg-[#061a27]">
        <div
          aria-label="Loading lesson"
          role="status"
          className="absolute w-10 h-10 rounded-full border-[3px] border-transparent animate-spin"
          style={{
            borderTopColor: "rgba(124, 157, 248, 0.30)",
            borderRightColor: "rgba(124, 158, 248, 0.20)",
            animationDuration: "0.75s",
          }}
        />
      </div>
    </div>
  );
}
