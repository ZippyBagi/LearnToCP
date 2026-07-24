import "server-only";
import { createAdminClient } from "@/app/supabase/admin";

/**
 * Community solved-rate stats for the Problems list.
 *
 * This is a *per-user* metric: the share of distinct users who attempted a
 * problem that went on to solve it (`solvers / attempters`), aggregated across
 * ALL users. A single user counts once no matter how many times they submitted,
 * so spamming attempts can't skew the rate. Because per-user RLS would hide
 * everyone else's submissions, this runs through the service-role admin client.
 *
 * Optimization: a single round-trip fetches just the three columns we need
 * (`problem_slug`, `verdict`, `user_id`) for the requested slugs and buckets
 * them in one pass — O(submissions) work, one query. Only finished submissions
 * count (verdict IS NOT NULL), so in-flight judging never skews the rate.
 *
 * If the submissions table ever grows large enough that streaming rows back
 * becomes the bottleneck, swap the body for a Postgres RPC returning
 * (problem_slug, count(distinct user_id), count(distinct user_id) filter
 * (where verdict = 'AC')) — the public shape below stays identical.
 */

export interface AcceptanceStat {
  /** Distinct users who solved the problem (≥1 AC submission). */
  accepted: number;
  /** Distinct users who attempted the problem (≥1 judged submission). */
  total: number;
  /** solvers / attempters in [0, 1], or null when nobody has attempted. */
  rate: number | null;
}

export type AcceptanceStats = Map<string, AcceptanceStat>;

/** Per-slug solved-rate stats for the given problems. Missing slugs → zeroed. */
export async function getAcceptanceStats(
  slugs: string[],
): Promise<AcceptanceStats> {
  const stats: AcceptanceStats = new Map(
    slugs.map((s) => [s, { accepted: 0, total: 0, rate: null }]),
  );
  if (slugs.length === 0) return stats;

  // Solved rate is a nice-to-have stat — if the admin key is missing or the
  // query fails, degrade gracefully (rates stay null) instead of breaking the
  // whole Problems list.
  let data:
    | Array<{ problem_slug: string; verdict: string; user_id: string }>
    | null = null;
  try {
    const supabase = createAdminClient();
    const res = await supabase
      .from("submissions")
      .select("problem_slug, verdict, user_id")
      .in("problem_slug", slugs)
      .not("verdict", "is", null);
    if (res.error) return stats;
    data = res.data as Array<{
      problem_slug: string;
      verdict: string;
      user_id: string;
    }>;
  } catch {
    return stats;
  }
  if (!data) return stats;

  // Track distinct users per slug: everyone who attempted, and everyone who
  // solved. A user can be in both; solvers ⊆ attempters, so rate ≤ 1.
  const attempters = new Map<string, Set<string>>(
    slugs.map((s) => [s, new Set<string>()]),
  );
  const solvers = new Map<string, Set<string>>(
    slugs.map((s) => [s, new Set<string>()]),
  );

  for (const row of data) {
    const attempted = attempters.get(row.problem_slug);
    if (!attempted) continue; // slug not in the requested set
    attempted.add(row.user_id);
    if (row.verdict === "AC") solvers.get(row.problem_slug)!.add(row.user_id);
  }

  for (const [slug, stat] of stats) {
    stat.total = attempters.get(slug)!.size;
    stat.accepted = solvers.get(slug)!.size;
    stat.rate = stat.total > 0 ? stat.accepted / stat.total : null;
  }

  return stats;
}
