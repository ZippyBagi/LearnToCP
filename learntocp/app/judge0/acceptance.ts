import "server-only";
import { createAdminClient } from "@/app/supabase/admin";

/**
 * Community acceptance-rate stats for the Problems list.
 *
 * "Acceptance" is the standard competitive-programming metric: the share of
 * *judged* submissions that were Accepted, aggregated across ALL users
 * (`accepted / total`). Because per-user RLS would hide everyone else's
 * submissions, this runs through the service-role admin client.
 *
 * Optimization: a single round-trip fetches just the two columns we need
 * (`problem_slug`, `verdict`) for the requested slugs and buckets them in one
 * pass — O(submissions) work, one query — instead of the naive 2·N count
 * queries (one total + one AC per problem). Only finished submissions count
 * (verdict IS NOT NULL), so in-flight judging never skews the rate.
 *
 * If the submissions table ever grows large enough that streaming rows back
 * becomes the bottleneck, swap the body for a `group by` Postgres RPC /
 * materialized view returning (problem_slug, total, accepted) — the public
 * shape below stays identical.
 */

export interface AcceptanceStat {
  /** Judged submissions with an AC verdict. */
  accepted: number;
  /** Judged submissions total (any final verdict). */
  total: number;
  /** accepted / total in [0, 1], or null when there are no judged submissions. */
  rate: number | null;
}

export type AcceptanceStats = Map<string, AcceptanceStat>;

const EMPTY: AcceptanceStat = { accepted: 0, total: 0, rate: null };

/** Per-slug acceptance stats for the given problems. Missing slugs → zeroed. */
export async function getAcceptanceStats(
  slugs: string[],
): Promise<AcceptanceStats> {
  const stats: AcceptanceStats = new Map(
    slugs.map((s) => [s, { ...EMPTY }]),
  );
  if (slugs.length === 0) return stats;

  // Acceptance is a nice-to-have stat — if the admin key is missing or the
  // query fails, degrade gracefully (rates stay null) instead of breaking the
  // whole Problems list.
  let data: Array<{ problem_slug: string; verdict: string }> | null = null;
  try {
    const supabase = createAdminClient();
    const res = await supabase
      .from("submissions")
      .select("problem_slug, verdict")
      .in("problem_slug", slugs)
      .not("verdict", "is", null);
    if (res.error) return stats;
    data = res.data as typeof data;
  } catch {
    return stats;
  }
  if (!data) return stats;

  for (const row of data) {
    const stat = stats.get(row.problem_slug);
    if (!stat) continue; // slug not in the requested set
    stat.total += 1;
    if (row.verdict === "AC") stat.accepted += 1;
  }

  for (const stat of stats.values()) {
    stat.rate = stat.total > 0 ? stat.accepted / stat.total : null;
  }

  return stats;
}
