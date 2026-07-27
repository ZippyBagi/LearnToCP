"use client";

import { useState, useCallback, useLayoutEffect, useRef, useEffect, useMemo } from "react";
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { RoadmapModal } from "./RoadmapModal";
import { useRoadmapCanvas } from "./utils/useRoadmapCanvas";
import "@xyflow/react/dist/style.css";
import { Node, Edge, NodeChange, ReactFlow, applyNodeChanges, Background, Controls, useReactFlow } from '@xyflow/react';
import { RoadmapCustomNode, RoadmapConnectorNode } from "./ReactFlowCustomNodeWrapper";
import { useRoadmapNodes } from "./utils/useRoadmapNodes";
import { useIsMobile } from "@/app/utils/useMediaQuery";
import {
  INITIAL_FIT_LAYERS,
  INITIAL_FIT_LAYERS_MOBILE,
  MIN_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM_MOBILE,
  FIT_MIN_ZOOM_MOBILE,
  FIT_MAX_ZOOM_MOBILE,
} from "./utils/roadmap.constants";

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
  const isMobile = useIsMobile();
  const { modal, setModal, modalNode, modalChecked, getProgress, isComplete, handleToggle } = useRoadmapCanvas(matrix, initialCompleted, solvedSlugs, loginUrl);
  const { nodeValues, edgeValues, fitNodeIds, entranceDuration } = useRoadmapNodes(
    matrix,
    getProgress,
    isComplete,
    setModal,
    loginUrl === null, //loginURL === null means logged in
    isMobile ? INITIAL_FIT_LAYERS_MOBILE : INITIAL_FIT_LAYERS,
  );
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

  const { getViewport, setViewport, fitView, viewportInitialized } = useReactFlow();

  // A phone can't show four layers of a 280px-wide card graph at a readable
  // size, so the fit is clamped to a zoom floor and the user pans from there.
  // Desktop keeps the untouched default fit.
  const fitViewOptions = useMemo(() => {
    const nodes = fitNodeIds.map((id) => ({ id }));
    if (!isMobile) return { nodes };
    return {
      nodes,
      padding: 0.06,
      minZoom: FIT_MIN_ZOOM_MOBILE,
      maxZoom: FIT_MAX_ZOOM_MOBILE,
    };
  }, [fitNodeIds, isMobile]);

  // Re-fit when the breakpoint flips (rotation, resize): the layer slice and
  // the zoom bounds both changed, so the old viewport is no longer meaningful.
  // Read through a ref so unrelated option changes (progress edits rebuild the
  // node list) never yank the viewport out from under the user.
  const fitOptionsRef = useRef(fitViewOptions);
  fitOptionsRef.current = fitViewOptions;

  const didFitRef = useRef(false);
  useEffect(() => {
    if (!viewportInitialized) return;
    if (!didFitRef.current) {
      didFitRef.current = true;
      return;
    }
    fitView({ ...fitOptionsRef.current, duration: 300 });
  }, [isMobile, viewportInitialized, fitView]);

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
        className={`h-full w-full overflow-hidden rounded-xl ${edgesRevealed ? "" : "edges-revealing"}`}
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
          fitViewOptions={fitViewOptions}
          minZoom={isMobile ? MIN_ZOOM_MOBILE : MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodesDraggable={!isMobile}
          panOnScroll={false}
          zoomOnDoubleClick={!isMobile}
          style={{ background: "transparent" }}
        >
          <Background
            color="rgba(124,158,248,0.35)"
            gap={isMobile ? 32 : 24}
            size={1.5}
          />
          <Controls
            className="ltcp-flow-controls"
            showInteractive={false}
            fitViewOptions={fitViewOptions}
            position={isMobile ? "bottom-right" : "bottom-left"}
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
