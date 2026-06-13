import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import { toPublicSubmission, type SubmissionRow } from "@/lib/judging";

const HISTORY_PAGE_SIZE = 50;

/**
 * GET /api/submissions?problemId=<slug>
 *
 * The current user's submission history for one problem, newest first
 * (aggregate verdicts + the submitted code). RLS scopes the query to the
 * caller's own rows.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const problemId = req.nextUrl.searchParams.get("problemId");
  if (!problemId) {
    return NextResponse.json({ error: "Missing problemId" }, { status: 400 });
  }

  const { data: rows, error } = await supabase
    .from("submissions")
    .select(
      "id, user_id, problem_slug, language_id, code, status, verdict, passed_count, total_count, results, compile_output, created_at",
    )
    .eq("problem_slug", problemId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_PAGE_SIZE);

  if (error) {
    console.error("submissions: history fetch failed", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({
    submissions: (rows as SubmissionRow[]).map((row) => ({
      ...toPublicSubmission(row),
      code: row.code,
    })),
  });
}
