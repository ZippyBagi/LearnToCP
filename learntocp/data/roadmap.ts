// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP DATA  —  edit this file to update the roadmap diagram
// ─────────────────────────────────────────────────────────────────────────────
//
// Structure
// ─────────
//   roadmapMatrix   outer array  →  each entry is a "layer" (horizontal row)
//   layer           inner array  →  each entry is a RoadmapNode (card)
//
// RoadmapNode shape
//   title   string               shown in the card header and the modal
//   items   { label, href }[]    rendered as checkbox + clickable link
//
// Tips
//   • Add a new layer   →  add a new [...] array inside roadmapMatrix
//   • Add a node        →  add a { title, items } object to an existing layer
//   • Use href: "#"     →  placeholder for links not yet written
// ─────────────────────────────────────────────────────────────────────────────

import type { RoadmapMatrix } from "@/app/utils/roadmap.types";

export const roadmapMatrix: RoadmapMatrix = [
  // ── Layer 0 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Basics",
      items: [
    
      ],
    },
  ],

  // ── Layer 1 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Concepts I",
      items: [
      ],
    },
    {
      title: "Sorting",
      items: [
      ],
    },
    {
      title: "Binary Numbers I",
      items: [
        { label: "TypeScript configuration", href: "#" },
      ],
    },
  ],

  // ── Layer 2 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Prefix Sum",
      items: [
      ],
    },
    {
      title: "Two Pointers",
      items: [
      ],
    },
    {
      title: "Binary Search",
      items: [
      ],
    },
  ],

  // ── Layer 3 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Math I",
      items: [
      ],
    },
    {
      title: "Greedy",
      items: [
      ],
    },
    {
      title: "Data Structures I",
      items: [
      ],
    },
  ],

  // ── Layer 4 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Ship It 🚀",
      items: [
        { label: "Production checklist", href: "#" },
        { label: "Monitoring & error tracking", href: "#" },
        { label: "Analytics setup", href: "#" },
      ],
    },
  ],
];