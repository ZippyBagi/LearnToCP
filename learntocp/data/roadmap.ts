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
      title: "Foundations",
      items: [
        { label: "Read the documentation", href: "https://nextjs.org/docs" },
        { label: "Set up your local environment", href: "#" },
        { label: "Understand the App Router", href: "#" },
      ],
    },
  ],

  // ── Layer 1 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Core Concepts",
      items: [
        { label: "Server vs Client Components", href: "#" },
        { label: "Data fetching patterns", href: "#" },
        { label: "Layouts & nested routes", href: "#" },
      ],
    },
    {
      title: "Styling",
      items: [
        { label: "Tailwind CSS setup", href: "#" },
        { label: "CSS variables & theming", href: "#" },
      ],
    },
    {
      title: "Tooling",
      items: [
        { label: "TypeScript configuration", href: "#" },
        { label: "ESLint & Prettier", href: "#" },
        { label: "Path aliases (@/)", href: "#" },
      ],
    },
    {
      title: "Tooling",
      items: [
        { label: "TypeScript configuration", href: "#" },
        { label: "ESLint & Prettier", href: "#" },
        { label: "Path aliases (@/)", href: "#" },
      ],
    },
  ],

  // ── Layer 2 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Build Features",
      items: [
        { label: "Authentication flow", href: "#" },
        { label: "Database integration", href: "#" },
        { label: "API route handlers", href: "#" },
      ],
    },
    {
      title: "Performance",
      items: [
        { label: "Image optimisation", href: "#" },
        { label: "Code splitting & lazy loading", href: "#" },
        { label: "Metadata & SEO", href: "#" },
      ],
    },
  ],

  // ── Layer 3 ─────────────────────────────────────────────────────────────
  [
    {
      title: "Testing",
      items: [
        { label: "Unit tests with Vitest", href: "#" },
        { label: "E2E tests with Playwright", href: "#" },
      ],
    },
    {
      title: "Deployment",
      items: [
        { label: "Vercel project setup", href: "#" },
        { label: "CI / CD pipeline", href: "#" },
        { label: "Environment variables", href: "#" },
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