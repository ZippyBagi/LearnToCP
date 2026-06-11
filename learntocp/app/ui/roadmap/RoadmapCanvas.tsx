"use client";

import { ReactFlowProvider } from '@xyflow/react';
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { RoadmapCanvasInner } from "./RoadmapCanvasInner";

type RoadmapCanvasProps = {
  matrix: RoadmapMatrix;
  // Completed item keys (`<node-id>/<item-id>`) loaded server-side for the current user.
  initialCompleted: string[];
}

export function RoadmapCanvas({ matrix, initialCompleted }: RoadmapCanvasProps) {
  return (
    <ReactFlowProvider>
      <RoadmapCanvasInner matrix={matrix} initialCompleted={initialCompleted} />
    </ReactFlowProvider>
  );
}
