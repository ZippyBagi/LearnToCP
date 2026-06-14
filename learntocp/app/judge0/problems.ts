import "server-only";
import fs from "fs";
import path from "path";

/**
 * File-based problem store.
 *
 * Each problem is a folder under content/problems/:
 *
 *   content/problems/<slug>/
 *   ├── problem.json        ← metadata (see ProblemMeta)
 *   ├── description-en.md   ← statement (English)
 *   ├── description-sr.md   ← statement (Serbian)
 *   └── tests/
 *       ├── 01.in           ← stdin for testcase "01"
 *       ├── 01.out          ← expected stdout for testcase "01"
 *       ├── 02.in
 *       └── 02.out
 *
 * The folder name is the public problem id used in URLs
 * (/​[locale]/Problems/<slug>) and stored on submissions (problem_slug).
 *
 * Testcases never leave the server: they are read here, sent to Judge0,
 * and only aggregate pass counts are exposed to clients.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ProblemMeta {
  title: Record<string, string>;
  timeLimit?: number;
  memoryLimit?: number; // in KB
  /** Shown as the difficulty badge in the header. */
  difficulty?: Difficulty;
  /** Display-only problem number, e.g. 20 → "Problem #20". */
  number?: number;
  /** I/O source labels for the metadata table. Default stdin/stdout. */
  inputSource?: string;
  outputSource?: string;
  /** Optional italic intro line shown under the metadata table. */
  note?: Record<string, string> | string;
}

export interface Testcase {
  // Basename shared by the .in/.out pair, e.g. "01"
  name: string;
  input: string;
  expectedOutput: string;
}

export interface Problem {
  slug: string;
  meta: ProblemMeta;
}

export const DEFAULT_TIME_LIMIT_S = 2.0;
export const DEFAULT_MEMORY_LIMIT_KB = 262144;

const PROBLEMS_ROOT = path.join(process.cwd(), "content", "problems");

// True if the slug is safe to use as a folder name (no path traversal).
function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(slug) && !slug.includes("..");
}

function problemDir(slug: string): string {
  return path.join(PROBLEMS_ROOT, slug);
}

// All problem slugs, sorted. A folder counts if it has a problem.json.
export function listProblemSlugs(): string[] {
  if (!fs.existsSync(PROBLEMS_ROOT)) return [];
  return fs
    .readdirSync(PROBLEMS_ROOT, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        fs.existsSync(path.join(PROBLEMS_ROOT, e.name, "problem.json")),
    )
    .map((e) => e.name)
    .sort();
}

// Problem metadata, or null if the problem doesn't exist.
export function getProblem(slug: string): Problem | null {
  if (!isValidSlug(slug)) return null;
  const metaPath = path.join(problemDir(slug), "problem.json");
  if (!fs.existsSync(metaPath)) return null;

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ProblemMeta;
    if (!meta.title || typeof meta.title !== "object") return null;
    return { slug, meta };
  } catch {
    return null; // malformed problem.json — treat as missing
  }
}

// All problems (for the problem list page). 
export function listProblems(): Problem[] {
  return listProblemSlugs()
    .map((slug) => getProblem(slug))
    .filter((p): p is Problem => p !== null);
}

export function getProblemTitle(problem: Problem, locale: string): string {
  return problem.meta.title[locale] ?? problem.meta.title.en ?? problem.slug;
}

export function getProblemDescription(
  slug: string,
  locale: string,
): string | null {
  if (!isValidSlug(slug)) return null;
  const dir = problemDir(slug);
  for (const loc of [locale, "en"]) {
    const p = path.join(dir, `description-${loc}.md`);
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
  }
  return null;
}

/**
 * Editorial / solution write-up for a problem, or null if none exists.
 * Looks for solution-<locale>.md, falling back to solution-en.md.
 */
export function getProblemSolution(
  slug: string,
  locale: string,
): string | null {
  if (!isValidSlug(slug)) return null;
  const dir = problemDir(slug);
  for (const loc of [locale, "en"]) {
    const p = path.join(dir, `solution-${loc}.md`);
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
  }
  return null;
}

/** Localized intro note (italic line under the metadata table), or null. */
export function getProblemNote(
  problem: Problem,
  locale: string,
): string | null {
  const note = problem.meta.note;
  if (!note) return null;
  if (typeof note === "string") return note;
  return note[locale] ?? note.en ?? null;
}

/**
 * Testcases for a problem, ordered by filename. Server-only — never send
 * these to the client. A testcase is any NN.in with a matching NN.out.
 */
export function getTestcases(slug: string): Testcase[] {
  if (!isValidSlug(slug)) return [];
  const testsDir = path.join(problemDir(slug), "tests");
  if (!fs.existsSync(testsDir)) return [];

  return fs
    .readdirSync(testsDir)
    .filter((f) => f.endsWith(".in"))
    .map((f) => f.slice(0, -".in".length))
    .filter((name) => fs.existsSync(path.join(testsDir, `${name}.out`)))
    .sort()
    .map((name) => ({
      name,
      input: fs.readFileSync(path.join(testsDir, `${name}.in`), "utf-8"),
      expectedOutput: fs.readFileSync(path.join(testsDir, `${name}.out`), "utf-8"),
    }));
}

// Effective Judge0 limits for a problem (meta values or defaults).
export function getProblemLimits(problem: Problem): {
  timeLimit: number;
  memoryLimit: number;
} {
  return {
    timeLimit: problem.meta.timeLimit ?? DEFAULT_TIME_LIMIT_S,
    memoryLimit: problem.meta.memoryLimit ?? DEFAULT_MEMORY_LIMIT_KB,
  };
}
