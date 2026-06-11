import "server-only";
import { createClient } from "@/app/supabase/server";

export async function getCompletedItemIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roadmap_progress")
    .select("item_id");

  if (error) {
    console.error("[getRoadmapProgress] failed to load progress:", error.message);
    return [];
  }
  return data.map((row) => row.item_id);
}
