/**
 * Canonical difficulty ladder for problems
 */
export const DIFFICULTIES = [
  "Super Easy",
  "Easy",
  "Medium",
  "Hard",
  "Super Hard",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
