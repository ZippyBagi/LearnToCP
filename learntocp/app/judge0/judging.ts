import "server-only";
import {
  STATUS,
  isAccepted,
  isFinal,
  pollBatch,
  type SubmissionResult,
} from "@/app/judge0/judge0";
import { createAdminClient } from "@/app/supabase/admin";

/**
 * Shared judging logic between the submit and poll API routes.
 */

// ==== Rate limits ======
export const SUBMIT_COOLDOWN_S = 30; // min seconds between two submissions
export const DAILY_SUBMISSION_LIMIT = 30; // per rolling 24 hours

export const MAX_CODE_LENGTH = 50_000;

/** After this long a still-judging submission is given up on (Judge0 lost it / submit died). */
export const JUDGING_TIMEOUT_MS = 5 * 60 * 1000;

export type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE" | "IE";

/** One entry of the `results` JSONB array. */
export interface TestResult {
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

/**
 * Bring one submission up to date: poll the testcases still in flight, persist
 * whatever became final, and close the row out once every testcase is done.
 *
 * A row that never finishes (Judge0 dropped the tokens, or `submit` died before
 * storing them) would otherwise stay "judging" forever, so past
 * JUDGING_TIMEOUT_MS it is closed as a judge error instead.
 *
 * Safe to call on any row - non-judging rows are returned untouched, and a
 * Judge0 outage degrades to "no change" rather than throwing.
 */
export async function reconcileSubmission(
  row: SubmissionRow,
): Promise<SubmissionRow> {
  if (row.status !== "judging") return row;

  const pending = row.results.filter((r) => !isFinal(r.statusId));
  let results = row.results;
  let compileOutput: string | null = null;

  if (pending.length > 0) {
    try {
      const polled = await pollBatch(pending.map((r) => r.token));
      ({ results, compileOutput } = mergeResults(row.results, polled));
    } catch (e) {
      console.error("reconcile: Judge0 poll failed", e);
    }
  }

  const done = results.length > 0 && allFinal(results);
  const timedOut =
    !done && Date.now() - new Date(row.created_at).getTime() > JUDGING_TIMEOUT_MS;
  const changed = JSON.stringify(results) !== JSON.stringify(row.results);
  if (!changed && !timedOut) return row;

  const updated: Partial<SubmissionRow> = {
    results,
    passed_count: countPassed(results),
    ...(compileOutput !== null && { compile_output: compileOutput }),
    ...(done && { status: "done" as const, verdict: deriveVerdict(results) }),
    ...(timedOut && { status: "error" as const, verdict: "IE" as const }),
  };

  const admin = createAdminClient();
  const { error } = await admin
    .from("submissions")
    .update(updated)
    .eq("id", row.id);
  if (error) {
    console.error("reconcile: verdict update failed", error);
  }

  return { ...row, ...updated };
}

/** The shape sent to clients - aggregates only, never per-testcase data. */
export interface PublicSubmission {
  submissionId: string;
  problemId: string;
  /** true once every testcase has a final verdict (stop polling) */
  done: boolean;
  status: SubmissionRow["status"];
  verdict: Verdict | null;
  passed: number;
  total: number;
  /** Compiler output - only present when verdict is CE */
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
