"use client";

import { useState, useCallback, useMemo} from "react";
import type { RoadmapMatrix } from "@/app/utils/roadmap.types";
import { RoadmapModal } from "./RoadmapModal";
import { useRoadmapCanvas} from "./utils/useRoadmapCanvas";
import '@xyflow/react/dist/style.css';
import { Node, Edge, NodeChange, EdgeChange,Connection, 
  ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge,
  Background } from '@xyflow/react';
import RoadmapCustomNode from "./utils/ReactFlowCustomNodeWrapper";
import { useRoadmapNodes } from "./utils/useRoadmapNodes";

type RoadmapCanvasProps = {
  matrix: RoadmapMatrix;
}

const nodeTypes = {
  custom: RoadmapCustomNode,
};

const gap_y = 100;
const gap_x = 350;

export function RoadmapCanvas({ matrix }: RoadmapCanvasProps) {
  const {
    modal,
    setModal,
    modalNode,
    modalChecked,
    getProgress,
    isComplete,
    handleToggle,
  } = useRoadmapCanvas(matrix);
  
  const { nodeValues, edgeValues } = useRoadmapNodes(matrix, getProgress, isComplete, setModal);

  const [nodes, setNodes] = useState<Node[]>(nodeValues);
  const [edges, setEdges] = useState<Edge[]>(edgeValues);
 
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot: Node[]) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  return (
    
    <div className="-m-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]">
      <div className="h-full w-full border-1 rounded-xl p-3 border-white/50">
        <ReactFlow proOptions={{ hideAttribution: true }} nodeTypes={nodeTypes} fitView nodes={nodes} edges={edges} onNodesChange={onNodesChange}>
          <Background />
        </ReactFlow>
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