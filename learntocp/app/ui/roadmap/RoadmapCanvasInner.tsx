"use client";

import { useState, useCallback, useLayoutEffect, useRef, useEffect } from "react";
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { RoadmapModal } from "./RoadmapModal";
import { useRoadmapCanvas } from "./utils/useRoadmapCanvas";
import "@xyflow/react/dist/style.css";
import { Node, Edge, NodeChange, ReactFlow, applyNodeChanges, Background, useReactFlow } from '@xyflow/react';
import { RoadmapCustomNode, RoadmapConnectorNode } from "./ReactFlowCustomNodeWrapper";
import { useRoadmapNodes } from "./utils/useRoadmapNodes";

type RoadmapCanvasInnerProps = {
  matrix: RoadmapMatrix;
  initialCompleted: string[];
  solvedSlugs: string[];
  loginUrl: string | null;
}

const nodeTypes = {
  custom: RoadmapCustomNode,
  connector: RoadmapConnectorNode,
};

export function RoadmapCanvasInner({ matrix, initialCompleted, solvedSlugs, loginUrl }: RoadmapCanvasInnerProps) {
  const { modal, setModal, modalNode, modalChecked, getProgress, isComplete, handleToggle } = useRoadmapCanvas(matrix, initialCompleted, solvedSlugs, loginUrl);
  const { nodeValues, edgeValues, fitNodeIds, entranceDuration } = useRoadmapNodes(matrix, getProgress, isComplete, setModal, loginUrl === null); //loginURL === null means logged in
  const [nodes, setNodes] = useState<Node[]>(nodeValues);
  const [edges, setEdges] = useState<Edge[]>(edgeValues);

  // The entrance starts at the layer above the initial viewport, so its length
  // depends on how far down the graph the user's progress placed that viewport.
  const [edgesRevealed, setEdgesRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEdgesRevealed(true), entranceDuration);
    return () => clearTimeout(t);
  }, [entranceDuration]);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevWidthRef = useRef<number | null>(null);

  useEffect(() => {
    setNodes(nodeValues);
  }, [nodeValues]);

  const { getViewport, setViewport, viewportInitialized } = useReactFlow();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || !viewportInitialized) return;

    prevWidthRef.current = el.getBoundingClientRect().width;

    const ro = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      const prevWidth = prevWidthRef.current ?? nextWidth;
      const delta = nextWidth - prevWidth;
      prevWidthRef.current = nextWidth;

      if (!delta) return;

      const { x, y, zoom } = getViewport();
      setViewport({ x: x + (delta / 2) / zoom, y, zoom }, { duration: 0 });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [getViewport, setViewport, viewportInitialized]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot: Node[]) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  return (
    <div ref={containerRef} className="-m-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]">
      <div
        className={`h-full w-full rounded-xl overflow-hidden ${edgesRevealed ? "" : "edges-revealing"}`}
        style={{
          border: "1px solid var(--color-accent-border)",
          background: "var(--color-bg-page)",
          boxShadow: "inset 0 0 80px rgba(124,158,248,0.03)",
        }}
      >
        <ReactFlow
          proOptions={{ hideAttribution: false }}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ nodes: fitNodeIds.map((id) => ({ id })) }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          style={{ background: "transparent" }}
        >
          <Background
            color="rgba(124,158,248,0.35)"
            gap={24}
            size={1.5}
          />
        </ReactFlow>
      </div>
      {modal !== null && modalNode !== null && (
        <RoadmapModal
          node={modalNode}
          checked={modalChecked}
          onToggle={(itemIdx) => handleToggle(modal.layerIndex, modal.nodeIndex, itemIdx)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
