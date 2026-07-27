import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { RoadmapMatrix } from "@/app/ui/roadmap/roadmap.types";
import { Node, Edge } from '@xyflow/react';
import { getElementPositions } from "./roadmap.utils";
import { NODE_WIDTH, CONNECTOR_X, INITIAL_FIT_LAYERS } from "./roadmap.constants";

const gap_y = 100;
const gap_x = 350;

/* Entrance animation timing.
   Sequence: node layers pop in top-to-bottom (connectors stay hidden), then a
   chain runs down the graph: edges draw into a connector, the connector pops
   the moment the stroke reaches it, and the edges below continue on. */
export const POP_DURATION = 420;        // matches .pop-in in globals.css
export const LAYER_STAGGER = 60;         // delay between node layers popping in (synced with home/problems 60ms stagger)
export const EDGE_DRAW_DURATION = 300;  // matches ltcp-edge-draw in globals.css
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

const EDGE_DASH = 400;

/**
 * The dash has to cover the whole path or it repeats and the edge draws as
 * broken segments — the outer edges of a 4-wide layer run past 400px. Duration
 * grows with the dash so every stroke keeps the same speed, just more ground
 * to cover. `dx` is the horizontal run, the only part that varies.
 */
function edgeStyle(delay: number, dx: number): CSSProperties {
  const dash = Math.max(Math.abs(dx) + 80, EDGE_DASH);
  return {
    animationDelay: `${delay}ms`,
    animationDuration: `${EDGE_DRAW_DURATION * (dash / EDGE_DASH)}ms`,
    ["--ltcp-edge-len" as string]: `${dash}px`,
  } as CSSProperties;
}

/** When the whole entrance (incl. the last edge row) has finished. */
export function entranceDoneAt(layerCount: number) {
  return EDGE_START_DELAY + Math.max(layerCount - 1, 0) * EDGE_CYCLE + EDGE_DRAW_DURATION;
}

export function useRoadmapNodes(
  matrix: RoadmapMatrix,
  getProgress: (i: number, j: number) => number,
  isComplete: (i: number, j: number) => boolean,
  setModal: (val: { layerIndex: number; nodeIndex: number } | null) => void,
  loggedIn: boolean = false,
  fitLayers: number = INITIAL_FIT_LAYERS,
) {
  return useMemo(() => {
    const nodeValues: Node[] = [];
    const edgeValues: Edge[] = [];
    const fitNodeIds: string[] = [];
    let fitStart = 0;
    if (loggedIn) {
      for (let i = 0; i < matrix.length; i++) {
        const layerComplete = matrix[i].every((_, j) => isComplete(i, j));
        if (!layerComplete) break;
        fitStart = i;
      }
    }
    fitStart = Math.max(0, Math.min(fitStart, matrix.length - fitLayers));
    const fitEnd = fitStart + fitLayers; // exclusive

    // The chain starts one layer above the initial viewport, so it drops into
    // view instead of having already finished offscreen. Logged out
    // (fitStart === 0) that is the top of the graph, as before.
    const animStart = Math.max(fitStart - 1, 0);
    const rel = (i: number) => Math.max(i - animStart, 0);

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
            popDelay: rel(i) * LAYER_STAGGER,
          },
        });
        if (i >= fitStart && i < fitEnd) fitNodeIds.push(next_index.toString());
        next_index++;
      }

      cur_y += gap_y;
      if (i === matrix.length - 1) continue;

      nodeValues.push({
        id: next_index.toString(),
        type: 'connector',
        position: { x: CONNECTOR_X, y: cur_y + 20 },
        data: { label: "Question", progress: 0, isComplete: false, onClick: () => {}, hideBottomNode: false, hideTopNode: false, popDelay: edgeBase + rel(i) * EDGE_CYCLE + EDGE_HIT_TIME },
      });
      // Connector between layer i and i+1 — in view only if both layers are.
      if (i >= fitStart && i + 1 < fitEnd) fitNodeIds.push(next_index.toString());
      next_index++;
      cur_y += gap_y;

      for (let j = 0; j < matrix[i].length; j++) {
        edgeValues.push({
          id: `${nodeValues.length-1 - matrix[i].length + j}-${nodeValues.length - 1}`,
          source: `${nodeValues.length-1 - matrix[i].length + j}`,
          target: `${nodeValues.length - 1}`,
          selectable: false,
          style: edgeStyle(edgeBase + rel(i) * EDGE_CYCLE, positions[j]),
        });
      }
      if (i !== 0) {
        for (let j = 0; j < matrix[i].length; j++) {
          edgeValues.push({
            id: `${nodeValues.length - matrix[i].length - 2}-${nodeValues.length - 1 - matrix[i].length + j}`,
            source: `${nodeValues.length - matrix[i].length - 2}`,
            target: `${nodeValues.length - 1 - matrix[i].length + j}`,
            selectable: false,
            style: edgeStyle(edgeBase + rel(i - 1) * EDGE_CYCLE + EDGE_STEP, positions[j]),
          });
        }
      }
    }

    const i = matrix.length - 1;
    const lastPositions = getElementPositions(matrix[i].length, gap_x);
    for (let j = 0; j < matrix[i].length; j++) {
      edgeValues.push({
        id: `${nodeValues.length - 1 - matrix[i].length + j}-${nodeValues.length - matrix[i].length}`,
        source: `${nodeValues.length - 1 - matrix[i].length + j}`,
        target: `${nodeValues.length - matrix[i].length}`,
        selectable: false,
        style: edgeStyle(edgeBase + rel(Math.max(i - 1, 0)) * EDGE_CYCLE + EDGE_STEP, lastPositions[j]),
      });
    }

    nodeValues[0].data.hideTopNode = true;
    nodeValues[nodeValues.length-1].data.hideBottomNode = true;

    return { nodeValues, edgeValues, fitNodeIds, entranceDuration: entranceDoneAt(matrix.length - animStart) };
  }, [matrix, getProgress, isComplete, setModal, loggedIn, fitLayers]);
}
