import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import { createAdminClient } from "@/app/supabase/admin";
import { pollBatch, isFinal } from "@/lib/judge0";
import {
  allFinal,
  countPassed,
  deriveVerdict,
  mergeResults,
  toPublicSubmission,
  type SubmissionRow,
} from "@/lib/judging";

/**
 * GET /api/submissions/[id]
 *
 * Returns the aggregate verdict of one submission (passed/total, verdict,
 * compiler output on CE). While testcases are still running on Judge0 this
 * polls them, persists any final results, and returns the updated counts —
 * the client keeps calling until `done: true`.
 *
 * Reads use the user-scoped client, so RLS guarantees users can only see
 * their own submissions; verdict writes go through the service-role client.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // ── Auth ──────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Fetch own submission (RLS enforces ownership) ─────────────────────
  const { data: row, error } = await supabase
    .from("submissions")
    .select(
      "id, user_id, problem_slug, language_id, code, status, verdict, passed_count, total_count, results, compile_output, created_at",
    )
    .eq("id", id)
    .maybeSingle<SubmissionRow>();

  if (error) {
    console.error("submissions/[id]: fetch failed", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.status !== "judging") {
    return NextResponse.json(toPublicSubmission(row));
  }

  // ── Poll Judge0 for testcases still in flight ─────────────────────────
  const pending = row.results.filter((r) => !isFinal(r.statusId));
  if (pending.length === 0 && row.results.length === 0) {
    // Tokens not stored yet (submit still running) — report as judging.
    return NextResponse.json(toPublicSubmission(row));
  }

  try {
    const polled = await pollBatch(pending.map((r) => r.token));
    const { results, compileOutput } = mergeResults(row.results, polled);

    const done = allFinal(results);
    const updated: Partial<SubmissionRow> = {
      results,
      passed_count: countPassed(results),
      ...(compileOutput !== null && { compile_output: compileOutput }),
      ...(done && { status: "done" as const, verdict: deriveVerdict(results) }),
    };

    const admin = createAdminClient();
    const { error: updateErr } = await admin
      .from("submissions")
      .update(updated)
      .eq("id", row.id);
    if (updateErr) {
      console.error("submissions/[id]: verdict update failed", updateErr);
      // Still return what we know — next poll will retry the write.
    }

    return NextResponse.json(toPublicSubmission({ ...row, ...updated }));
  } catch (e) {
    // Judge0 hiccup (rate limit / transient 5xx): degrade gracefully by
    // returning the current state — the client will simply poll again.
    console.error("submissions/[id]: Judge0 poll failed", e);
    return NextResponse.json(toPublicSubmission(row));
  }
}
