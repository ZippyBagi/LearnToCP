
export interface RoadmapItem {
  label: string;
  href: string;
}

export interface RoadmapNode {
  title: string;
  items: RoadmapItem[];
}

export type RoadmapMatrix = RoadmapNode[][];