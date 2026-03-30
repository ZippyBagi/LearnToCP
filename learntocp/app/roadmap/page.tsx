import type { Metadata } from "next";
import { roadmapMatrix } from "@/data/roadmap";
import { RoadmapCanvas } from "@/app/ui/roadmap/RoadmapCanvas";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Track your learning path and progress through the roadmap.",
};

/**
 * /roadmap — server component.
 * Loads the static roadmap data and passes it to the client-side canvas.
 */
export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-page)] px-6 py-12">
      {/* Page header */}
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-accent)] opacity-70">
          Learning path
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-heading)] sm:text-4xl">
          Roadmap
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-primary)] opacity-60">
          Click any node to see its resources and track your progress.
          Completing all items in a node marks it as done.
        </p>
      </header>

      {/* Diagram */}
      <section aria-label="Roadmap diagram" className="mx-auto max-w-5xl overflow-x-auto">
        <RoadmapCanvas matrix={roadmapMatrix} />
      </section>
    </main>
  );
}