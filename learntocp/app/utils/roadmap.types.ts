// ─────────────────────────────────────────────────────────────────────────────
// Roadmap types
// ─────────────────────────────────────────────────────────────────────────────

/** A single resource row rendered as a checkbox + link inside the modal. */
export interface RoadmapItem {
  /** Text shown next to the checkbox and used as the anchor label. */
  label: string;
  /** URL the label links to – use "#" as a placeholder. */
  href: string;
}

/**
 * One node (card) in the roadmap diagram.
 * Each node has a title and a list of checkbox / link pairs.
 */
export interface RoadmapNode {
  title: string;
  items: RoadmapItem[];
}

/**
 * The full roadmap data structure.
 * An array of "layers" – each layer is an array of nodes rendered as a
 * horizontal row in the diagram.
 */
export type RoadmapMatrix = RoadmapNode[][];