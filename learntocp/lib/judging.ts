import "server-only";
import { STATUS, isAccepted, isFinal, type SubmissionResult } from "@/lib/judge0";

/**
 * Shared judging logic between the submit and poll API routes.
 *
 * Per-testcase results live in the `results` JSONB column of `submissions`
 * (server-side only). Users only ever see aggregates: passed/total + verdict,
 * plus compiler output on a compilation error.
 */

// ── Rate limits (tune here) ─────────────────────────────────────────────────
// Each testcase is a billable Judge0 call, so these protect the RapidAPI bill as much as the service.
export const SUBMIT_COOLDOWN_S = 30; // min seconds between two submissions
export const DAILY_SUBMISSION_LIMIT = 30; // per rolling 24 hours

export const MAX_CODE_LENGTH = 50_000;

export type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE" | "IE";

/** One entry of the `results` JSONB array. */
export interface TestResult {
  /** Testcase basename, e.g. "01" */
  name: string;
  /** Judge0 submission token */
  token: string;
  /** Judge0 status id (1 queue, 2 running, 3 AC, 4 WA, 5 TLE, 6 CE, 7+ RE/IE) */
  statusId: number;
  time: number | null; // seconds
  memory: number | null; // KB
}

export interface SubmissionRow {
  id: string;
  user_id: string;
  problem_slug: string;
  language_id: number;
  code: string;
  status: "judging" | "done" | "error";
  verdict: Verdict | null;
  passed_count: number;
  total_count: number;
  results: TestResult[];
  compile_output: string | null;
  created_at: string;
}

export function countPassed(results: TestResult[]): number {
  return results.filter((r) => isAccepted(r.statusId)).length;
}

export function allFinal(results: TestResult[]): boolean {
  return results.every((r) => isFinal(r.statusId));
}

/**
 * Aggregate verdict once every testcase is final:
 * all AC → AC · any CE → CE · otherwise the first failure in testcase order
 * (WA / TLE / RE), with Judge0-internal failures mapping to IE.
 */
export function deriveVerdict(results: TestResult[]): Verdict {
  if (results.every((r) => isAccepted(r.statusId))) return "AC";
  if (results.some((r) => r.statusId === STATUS.COMPILATION_ERROR)) return "CE";

  const firstFail = results.find(
    (r) => isFinal(r.statusId) && !isAccepted(r.statusId),
  )!;
  switch (firstFail.statusId) {
    case STATUS.WRONG_ANSWER:
      return "WA";
    case STATUS.TIME_LIMIT_EXCEEDED:
      return "TLE";
    case 13: // Internal Error
    case 14: // Exec Format Error
      return "IE";
    default:
      return "RE"; // 7–12: runtime errors
  }
}

/** Merge fresh Judge0 poll results into stored results (matched by token). */
export function mergeResults(
  stored: TestResult[],
  polled: SubmissionResult[],
): { results: TestResult[]; compileOutput: string | null } {
  const byToken = new Map(polled.map((p) => [p.token, p]));
  let compileOutput: string | null = null;

  const results = stored.map((r) => {
    const fresh = byToken.get(r.token);
    if (!fresh || !isFinal(fresh.status.id)) return r;
    if (fresh.status.id === STATUS.COMPILATION_ERROR && fresh.compile_output) {
      compileOutput = fresh.compile_output;
    }
    return {
      ...r,
      statusId: fresh.status.id,
      time: fresh.time !== null ? parseFloat(fresh.time) : null,
      memory: fresh.memory ?? null,
    };
  });

  return { results, compileOutput };
}

/** The shape sent to clients — aggregates only, never per-testcase data. */
export interface PublicSubmission {
  submissionId: string;
  problemId: string;
  /** true once every testcase has a final verdict (stop polling) */
  done: boolean;
  status: SubmissionRow["status"];
  verdict: Verdict | null;
  passed: number;
  total: number;
  /** Compiler output — only present when verdict is CE */
  compileOutput: string | null;
  createdAt: string;
}

export function toPublicSubmission(row: SubmissionRow): PublicSubmission {
  return {
    submissionId: row.id,
    problemId: row.problem_slug,
    done: row.status !== "judging",
    status: row.status,
    verdict: row.verdict,
    passed: row.passed_count,
    total: row.total_count,
    compileOutput: row.verdict === "CE" ? row.compile_output : null,
    createdAt: row.created_at,
  };
}
