
export interface RoadmapItem {
  //from the item file's `id:` line
  id: string;
  label: string;
  href: string;
  // "theory" (default) renders a user-toggleable checkbox; "problem" renders a
  // read-only circle that turns green only when the problem is actually solved.
  type: "theory" | "problem";
  // For problem items: the problem slug used to look up solved status.
  slug?: string;
}

export interface RoadmapNode {
  //from the node dir's meta.jsoN
  id: string;
  title: string;
  items: RoadmapItem[];
}

export type RoadmapMatrix = RoadmapNode[][];

// Globally unique id for a checklist item — what `roadmap_progress.item_id` stores.
export function itemKey(nodeId: string, itemId: string): string {
  return `${nodeId}/${itemId}`;
}
