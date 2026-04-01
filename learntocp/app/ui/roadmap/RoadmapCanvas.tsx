"use client";

import { useRef } from "react";
import type { RoadmapMatrix } from "@/app/utils/roadmap.types";
import { RoadmapNodeCard } from "./RoadmapNodeCard";
import { RoadmapModal } from "./RoadmapModal";
import { useRoadmapCanvas } from "./utils/useRoadmapCanvas";

interface RoadmapCanvasProps {
  matrix: RoadmapMatrix;
}

export function RoadmapCanvas({ matrix }: RoadmapCanvasProps) {
  const nodeRefs = useRef<(HTMLDivElement | null)[][]>(
    matrix.map((layer) => layer.map(() => null))
  );

  const {
    modal,
    setModal,
    modalNode,
    modalChecked,
    getProgress,
    isComplete,
    handleToggle,
  } = useRoadmapCanvas(matrix);

  {/*min-w-6xl minimum needed for 4 nodes per row*/}
  return (
    <div className="min-w-6xl">
      <div className="flex flex-col items-center pt-10 gap-25 w-full">
        {matrix.map((layer, li) => (
          <div
            key={li}
            className="flex flex-row flex-wrap items-stretch justify-center gap-20 w-full"
          >
            {layer.map((node, ni) => (
              <div
                key={ni}
                ref={(el) => {
                  if (!nodeRefs.current[li]) nodeRefs.current[li] = [];
                  nodeRefs.current[li][ni] = el;
                }}
              >
                <RoadmapNodeCard
                  title={node.title}
                  progress={getProgress(li, ni)}
                  isComplete={isComplete(li, ni)}
                  onClick={() => setModal({ layerIndex: li, nodeIndex: ni })}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {modal !== null && modalNode !== null && (
        <RoadmapModal
          node={modalNode}
          checked={modalChecked}
          onToggle={(itemIdx) =>
            handleToggle(modal.layerIndex, modal.nodeIndex, itemIdx)
          }
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}