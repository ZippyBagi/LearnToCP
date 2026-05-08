"use client";

import { ReactFlowProvider } from '@xyflow/react';
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { RoadmapCanvasInner } from "./RoadmapCanvasInner";

type RoadmapCanvasProps = {
  matrix: RoadmapMatrix;
}

export function RoadmapCanvas({ matrix }: RoadmapCanvasProps) {
  return (
    <ReactFlowProvider>
      <RoadmapCanvasInner matrix={matrix} />
    </ReactFlowProvider>
  );
}