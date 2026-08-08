import "server-only";
import { createAdminClient } from "@/app/supabase/admin";

export interface AcceptanceStat {
  accepted: number;
  total: number;
  rate: number | null;
}

export type AcceptanceStats = Map<string, AcceptanceStat>;

type StatRow = { problem_slug: string; accepted: number; total: number };

export async function getAcceptanceStats(
  slugs: string[],
): Promise<AcceptanceStats> {
  
  const stats: AcceptanceStats = new Map(
    slugs.map((s) => [s, { accepted: 0, total: 0, rate: null }]),
  );
  if (slugs.length === 0) return stats;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("get_acceptance_stats", { slugs });
    if (error || !data) return stats;

    for (const row of data as StatRow[]) {
      const stat = stats.get(row.problem_slug);
      if (!stat) continue; // slug not in the requested set
      stat.accepted = Number(row.accepted);
      stat.total = Number(row.total);
      stat.rate = stat.total > 0 ? stat.accepted / stat.total : null;
    }
  } catch {
    return stats;
  }

  return stats;
}
