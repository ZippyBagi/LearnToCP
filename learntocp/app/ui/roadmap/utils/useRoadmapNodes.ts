import { useMemo } from "react";
import type { RoadmapMatrix } from "@/app/utils/roadmap.types";
import { Node, Edge } from '@xyflow/react';
import { getElementPositions } from "./roadmap.utils";

const gap_y = 100;
const gap_x = 350;

export function useRoadmapNodes(
  matrix: RoadmapMatrix,
  getProgress: (i: number, j: number) => number,
  isComplete: (i: number, j: number) => boolean,
  setModal: (val: { layerIndex: number; nodeIndex: number } | null) => void,
) {
  return useMemo(() => {
    const nodeValues: Node[] = [];
    const edgeValues: Edge[] = [];
    let cur_y = 0;
    let next_index = 0;

    for (let i = 0; i < matrix.length; i++) {
      const positions = getElementPositions(matrix[i].length, gap_x);

      for (let j = 0; j < matrix[i].length; j++) {
        const li = i;
        const lj = j;
        nodeValues.push({
          id: next_index.toString(),
          type: 'custom',
          position: { x: positions[lj], y: cur_y },
          data: {
            label: matrix[li][lj].title,
            progress: getProgress(li, lj),
            isComplete: isComplete(li, lj),
            onClick: () => setModal({ layerIndex: li, nodeIndex: lj }),
          },
        });
        next_index++;
      }

      cur_y += gap_y;
      if (i === matrix.length - 1) continue;

      nodeValues.push({
        id: next_index.toString(),
        type: 'custom',
        position: { x: 0, y: cur_y },
        data: { label: "Question", progress: 0, isComplete: false, onClick: () => {} },
      });
      next_index++;
      cur_y += gap_y;

      for (let j = 0; j < matrix[i].length; j++) {
        edgeValues.push({
          id: `${nodeValues.length-1 - matrix[i].length + j}-${nodeValues.length - 1}`,
          source: `${nodeValues.length-1 - matrix[i].length + j}`,
          target: `${nodeValues.length - 1}`,
        });
      }
      if (i !== 0) {
        for (let j = 0; j < matrix[i].length; j++) {
          edgeValues.push({
            id: `${nodeValues.length - matrix[i].length - 2}-${nodeValues.length - 1 - matrix[i].length + j}`,
            source: `${nodeValues.length - matrix[i].length - 2}`,
            target: `${nodeValues.length - 1 - matrix[i].length + j}`,
          });
        }
      }
    }

    const i = matrix.length - 1;
    for (let j = 0; j < matrix[i].length; j++) {
      edgeValues.push({
        id: `${nodeValues.length - 1 - matrix[i].length + j}-${nodeValues.length - matrix[i].length}`,
        source: `${nodeValues.length - 1 - matrix[i].length + j}`,
        target: `${nodeValues.length - matrix[i].length}`,
      });
    }

    return { nodeValues, edgeValues };
  }, [matrix]);
}