import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import {
  reconcileSubmission,
  toPublicSubmission,
  type SubmissionRow,
} from "@/app/judge0/judging";

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

  return NextResponse.json(toPublicSubmission(await reconcileSubmission(row)));
}
