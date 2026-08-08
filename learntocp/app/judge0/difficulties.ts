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

/** Badge class per difficulty, e.g. "Super Hard" → "difficulty-super-hard". */
export const DIFFICULTY_CLASS = Object.fromEntries(
  DIFFICULTIES.map((d) => [d, `difficulty-${d.toLowerCase().replace(/\s+/g, "-")}`]),
) as Record<Difficulty, string>;

/** Difficulty labels for a locale; keys stay English, values may be overridden. */
export function difficultyLabels(
  overrides: Partial<Record<Difficulty, string>> = {},
): Record<Difficulty, string> {
  return Object.fromEntries(
    DIFFICULTIES.map((d) => [d, overrides[d] ?? d]),
  ) as Record<Difficulty, string>;
}
