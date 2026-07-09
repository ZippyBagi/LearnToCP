import { useMemo } from "react";
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { Node, Edge } from '@xyflow/react';
import { getElementPositions } from "./roadmap.utils";
import { NODE_WIDTH, CONNECTOR_X } from "./roadmap.constants";

const gap_y = 100;
const gap_x = 350;

/* Entrance animation timing.
   Sequence: node layers pop in top-to-bottom (connectors stay hidden), then a
   chain runs down the graph: edges draw into a connector, the connector pops
   the moment the stroke reaches it, and the edges below continue on. */
export const POP_DURATION = 420;        // matches .pop-in in globals.css
export const LAYER_STAGGER = 60;         // delay between node layers popping in (synced with home/problems 60ms stagger)
export const EDGE_DRAW_DURATION = 150;  // matches ltcp-edge-draw in globals.css
// The stroke visually reaches its target well before the animation ends:
// the dash (400) is longer than the paths and ease-out front-loads the draw.
export const EDGE_HIT_TIME = 140;       // when the stroke visually lands
export const EDGE_CONTINUE_DELAY = 0;  // beat after the hit before edges continue
// Time between row starts, and one full step down the chain (in + out)
export const EDGE_STEP = EDGE_HIT_TIME + EDGE_CONTINUE_DELAY;
export const EDGE_CYCLE = 2.5 * EDGE_STEP;

// Edges start alongside the node pops — just after the first layer has
// mostly settled — and the chain races down while later layers are
// still popping in (the pops easily outpace the 400ms-per-level chain).
export const EDGE_START_DELAY = 250;

/** When the whole entrance (incl. the last edge row) has finished. */
export function entranceDoneAt(layerCount: number) {
  return EDGE_START_DELAY + Math.max(layerCount - 1, 0) * EDGE_CYCLE + EDGE_DRAW_DURATION;
}

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

    const edgeBase = EDGE_START_DELAY;

    for (let i = 0; i < matrix.length; i++) {
      const positions = getElementPositions(matrix[i].length, gap_x);

      for (let j = 0; j < matrix[i].length; j++) {
        const li = i;
        const lj = j;
        nodeValues.push({
          id: next_index.toString(),
          type: 'custom',
          position: { x: positions[lj], y: cur_y },
          width: NODE_WIDTH,
          data: {
            label: matrix[li][lj].title,
            progress: getProgress(li, lj),
            isComplete: isComplete(li, lj),
            onClick: () => setModal({ layerIndex: li, nodeIndex: lj }),
            hideBottomNode: false,
            hideTopNode : false,
            popDelay: i * LAYER_STAGGER,
          },
        });
        next_index++;
      }

      cur_y += gap_y;
      if (i === matrix.length - 1) continue;

      nodeValues.push({
        id: next_index.toString(),
        type: 'connector',
        position: { x: CONNECTOR_X, y: cur_y + 20 },
        data: { label: "Question", progress: 0, isComplete: false, onClick: () => {}, hideBottomNode: false, hideTopNode: false, popDelay: edgeBase + i * EDGE_CYCLE + EDGE_HIT_TIME },
      });
      next_index++;
      cur_y += gap_y;

      for (let j = 0; j < matrix[i].length; j++) {
        edgeValues.push({
          id: `${nodeValues.length-1 - matrix[i].length + j}-${nodeValues.length - 1}`,
          source: `${nodeValues.length-1 - matrix[i].length + j}`,
          target: `${nodeValues.length - 1}`,
          selectable: false,
          style: { animationDelay: `${edgeBase + i * EDGE_CYCLE}ms` },
        });
      }
      if (i !== 0) {
        for (let j = 0; j < matrix[i].length; j++) {
          edgeValues.push({
            id: `${nodeValues.length - matrix[i].length - 2}-${nodeValues.length - 1 - matrix[i].length + j}`,
            source: `${nodeValues.length - matrix[i].length - 2}`,
            target: `${nodeValues.length - 1 - matrix[i].length + j}`,
            selectable: false,
            style: { animationDelay: `${edgeBase + (i - 1) * EDGE_CYCLE + EDGE_STEP}ms` },
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
        selectable: false,
        style: { animationDelay: `${edgeBase + Math.max(i - 1, 0) * EDGE_CYCLE + EDGE_STEP}ms` },
      });
    }
    
    nodeValues[0].data.hideTopNode = true;
    nodeValues[nodeValues.length-1].data.hideBottomNode = true;

    return { nodeValues, edgeValues };
  }, [matrix, getProgress, isComplete]);
}