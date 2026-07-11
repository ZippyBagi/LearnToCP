"use client";

import { ReactFlowProvider } from '@xyflow/react';
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { RoadmapCanvasInner } from "./RoadmapCanvasInner";

type RoadmapCanvasProps = {
  matrix: RoadmapMatrix;
  initialCompleted: string[];
  solvedSlugs: string[];
  loginUrl: string | null;
}

export function RoadmapCanvas({ matrix, initialCompleted, solvedSlugs, loginUrl }: RoadmapCanvasProps) {
  return (
    <ReactFlowProvider>
      <RoadmapCanvasInner
        matrix={matrix}
        initialCompleted={initialCompleted}
        solvedSlugs={solvedSlugs}
        loginUrl={loginUrl}
      />
    </ReactFlowProvider>
  );
}
