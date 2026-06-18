/**
 * Canonical difficulty ladder for problems — the single source of truth shared
 * by the server problem store and the client Problems list.
 *
 * Kept in its own module (no "server-only") so client components can import the
 * ordered list at runtime, while `problems.ts` re-exports it for convenience.
 * Order is easiest → hardest and drives badge styling + filter order.
 */
export const DIFFICULTIES = [
  "Super Easy",
  "Easy",
  "Medium",
  "Hard",
  "Olympiad Level",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
