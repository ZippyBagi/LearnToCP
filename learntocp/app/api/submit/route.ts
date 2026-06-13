import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import { createAdminClient } from "@/app/supabase/admin";
import { submitBatch, DEFAULT_LANGUAGE_ID, Judge0Error } from "@/lib/judge0";
import { getProblem, getProblemLimits, getTestcases } from "@/lib/problems";
import {
  DAILY_SUBMISSION_LIMIT,
  MAX_CODE_LENGTH,
  SUBMIT_COOLDOWN_S,
  type TestResult,
} from "@/lib/judging";

/**
 * POST /api/submit  { problemId: string, code: string }
 *
 * Judges `code` (C++20) against every testcase of content/problems/<problemId>.
 * Returns { submissionId } — the client then polls GET /api/submissions/[id].
 *
 * Rate limited per user (cooldown between submissions + rolling daily cap):
 * both protect the service AND the RapidAPI bill, since every testcase is a
 * billable Judge0 call. 429 responses carry a human-readable `error` and,
 * for the cooldown, `retryAfterSec`.
 */
export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Input validation ──────────────────────────────────────────────────
  let body: { problemId?: unknown; code?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const problemId = typeof body.problemId === "string" ? body.problemId : "";
  const code = typeof body.code === "string" ? body.code : "";

  if (!problemId || !code.trim()) {
    return NextResponse.json(
      { error: "Missing problemId or code" },
      { status: 400 },
    );
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: `Code too long (max ${MAX_CODE_LENGTH} characters)` },
      { status: 400 },
    );
  }

  // ── Problem lookup (filesystem) ───────────────────────────────────────
  const problem = getProblem(problemId);
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  const testcases = getTestcases(problemId);
  if (testcases.length === 0) {
    return NextResponse.json(
      { error: "Problem has no testcases" },
      { status: 400 },
    );
  }

  // ── Rate limiting (DB-backed, works across serverless instances) ──────
  const admin = createAdminClient();

  const { data: lastRows, error: lastErr } = await admin
    .from("submissions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);
  if (lastErr) {
    console.error("submit: rate-limit lookup failed", lastErr);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if (lastRows && lastRows.length > 0) {
    const elapsedS =
      (Date.now() - new Date(lastRows[0].created_at).getTime()) / 1000;
    if (elapsedS < SUBMIT_COOLDOWN_S) {
      const retryAfterSec = Math.ceil(SUBMIT_COOLDOWN_S - elapsedS);
      return NextResponse.json(
        {
          error: `You're submitting too fast — please wait ${retryAfterSec}s before submitting again.`,
          retryAfterSec,
        },
        { status: 429 },
      );
    }
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countErr } = await admin
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  if (countErr) {
    console.error("submit: daily-limit lookup failed", countErr);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if ((count ?? 0) >= DAILY_SUBMISSION_LIMIT) {
    return NextResponse.json(
      {
        error: `Daily submission limit reached (${DAILY_SUBMISSION_LIMIT} per 24h). Try again later.`,
      },
      { status: 429 },
    );
  }

  // ── Create the submission row first ───────────────────────────────────
  // Inserting before calling Judge0 means failed Judge0 calls still count
  // toward the cooldown (prevents hammering a broken upstream), and we never
  // have billable Judge0 submissions that aren't tracked in our DB.
  const { data: inserted, error: insertErr } = await admin
    .from("submissions")
    .insert({
      user_id: userId,
      problem_slug: problemId,
      language_id: DEFAULT_LANGUAGE_ID,
      code,
      status: "judging",
      total_count: testcases.length,
      results: [],
    })
    .select("id")
    .single();
  if (insertErr || !inserted) {
    console.error("submit: insert failed", insertErr);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  // ── Send all testcases to Judge0 ───────────────────────────────────────
  // Never auto-retry submitBatch: each testcase is billable.
  const limits = getProblemLimits(problem);
  let tokens: string[];
  try {
    tokens = await submitBatch(
      testcases.map((tc) => ({
        sourceCode: code,
        stdin: tc.input,
        expectedOutput: tc.expectedOutput,
        cpuTimeLimit: limits.timeLimit,
        memoryLimit: limits.memoryLimit,
      })),
    );
  } catch (e) {
    console.error("submit: Judge0 submit failed", e);
    await admin
      .from("submissions")
      .update({ status: "error", verdict: "IE" })
      .eq("id", inserted.id);

    if (e instanceof Judge0Error && (e.httpStatus === 429 || e.httpStatus === 403)) {
      return NextResponse.json(
        { error: "The judge is at capacity right now — please try again later." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "The judge is unavailable right now — please try again later." },
      { status: 502 },
    );
  }

  // ── Store tokens for polling ───────────────────────────────────────────
  const results: TestResult[] = testcases.map((tc, i) => ({
    name: tc.name,
    token: tokens[i],
    statusId: 1, // In Queue
    time: null,
    memory: null,
  }));

  const { error: updateErr } = await admin
    .from("submissions")
    .update({ results })
    .eq("id", inserted.id);
  if (updateErr) {
    console.error("submit: token store failed", updateErr);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ submissionId: inserted.id });
}
