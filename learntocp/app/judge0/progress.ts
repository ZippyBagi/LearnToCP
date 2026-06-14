import "server-only";
import { createClient } from "@/app/supabase/server";

/**
 * Solved-status helpers for the signed-in user. Server components only.
 * Reads go through the user-scoped client, so RLS limits them to the
 * caller's own submissions. Returns empty results when signed out.
 */

/** Slugs of every problem the current user has fully solved (verdict AC). */
export async function getSolvedProblemSlugs(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("problem_slug")
    .eq("verdict", "AC");

  if (error || !data) return new Set();
  return new Set(data.map((r: { problem_slug: string }) => r.problem_slug));
}

/** Whether the current user has solved one specific problem. */
export async function hasSolvedProblem(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("problem_slug", slug)
    .eq("verdict", "AC");

  return !error && (count ?? 0) > 0;
}
