"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { RoadmapMatrix } from "@/app/utils/roadmap.types";
import { RoadmapNodeCard } from "./RoadmapNodeCard";
import { RoadmapModal } from "./RoadmapModal";

// ─── Internal types ───────────────────────────────────────────────────────────

interface ModalTarget {
  layerIndex: number;
  nodeIndex: number;
}

type CheckedState = Record<string, boolean[]>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storageKey(li: number, ni: number): string {
  return `roadmap:${li}:${ni}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RoadmapCanvasProps {
  matrix: RoadmapMatrix;
}

export function RoadmapCanvas({ matrix }: RoadmapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // nodeRefs.current[layerIdx][nodeIdx] → the wrapper <div> for that card
  const nodeRefs = useRef<(HTMLDivElement | null)[][]>(
    matrix.map((layer) => layer.map(() => null))
  );

  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [modal, setModal] = useState<ModalTarget | null>(null);
  const [svgLines, setSvgLines] = useState<ReactNode[]>([]);
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });

  // ── localStorage persistence ─────────────────────────────────────────────────

  useEffect(() => {
    const loaded: CheckedState = {};
    matrix.forEach((layer, li) => {
      layer.forEach((node, ni) => {
        const key = storageKey(li, ni);
        try {
          const raw = localStorage.getItem(key);
          loaded[key] = raw
            ? (JSON.parse(raw) as boolean[])
            : new Array(node.items.length).fill(false);
        } catch {
          loaded[key] = new Array(node.items.length).fill(false);
        }
      });
    });
    setCheckedState(loaded);
  }, [matrix]);

  // ── Progress helpers ─────────────────────────────────────────────────────────

  const getProgress = useCallback(
    (li: number, ni: number): number => {
      const state = checkedState[storageKey(li, ni)];
      if (!state || state.length === 0) return 0;
      return state.filter(Boolean).length / state.length;
    },
    [checkedState]
  );

  const isComplete = useCallback(
    (li: number, ni: number): boolean => getProgress(li, ni) === 1,
    [getProgress]
  );

  // ── Checkbox toggle ──────────────────────────────────────────────────────────

  const handleToggle = useCallback(
    (li: number, ni: number, itemIdx: number) => {
      const key = storageKey(li, ni);
      setCheckedState((prev) => {
        const current =
          prev[key] ?? new Array(matrix[li][ni].items.length).fill(false);
        const next = [...current];
        next[itemIdx] = !next[itemIdx];
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // storage unavailable — in-memory state still updates correctly
        }
        return { ...prev, [key]: next };
      });
    },
    [matrix]
  );

  // ── SVG connector lines ───────────────────────────────────────────────────────
  //
  // For each pair of adjacent layers the algorithm draws:
  //   1.  Vertical drop lines from every node-bottom  →  convergence Y
  //   2.  Horizontal bar at convergence Y             (if layer has > 1 node)
  //   3.  Vertical trunk line from convergence Y      →  divergence Y
  //   4.  Horizontal bar at divergence Y              (if next layer has > 1 node)
  //   5.  Vertical rise lines from divergence Y       →  every next-node-top

  const computeLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cr = container.getBoundingClientRect();
    setSvgDims({ w: cr.width, h: cr.height });

    const SW = 1.5;
    const COLOR_NORMAL   = "rgba(124,158,248,0.28)";
    const COLOR_FADED    = "rgba(124,158,248,0.10)";
    const COLOR_DONE     = "rgba(80,250,123,0.35)";

    const lines: ReactNode[] = [];

    matrix.forEach((layer, li) => {
      if (li >= matrix.length - 1) return;

      // Measure current layer
      const currentPts = layer
        .map((_, ni) => {
          const el = nodeRefs.current[li]?.[ni];
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x:        r.left + r.width / 2 - cr.left,
            bottom:   r.bottom - cr.top,
            complete: isComplete(li, ni),
          };
        })
        .filter(Boolean) as { x: number; bottom: number; complete: boolean }[];

      // Measure next layer
      const nextPts = matrix[li + 1]
        .map((_, ni) => {
          const el = nodeRefs.current[li + 1]?.[ni];
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 - cr.left, top: r.top - cr.top };
        })
        .filter(Boolean) as { x: number; top: number }[];

      if (!currentPts.length || !nextPts.length) return;

      const maxBottom = Math.max(...currentPts.map((p) => p.bottom));
      const minTop    = Math.min(...nextPts.map((p)    => p.top));
      const gap       = clamp(minTop - maxBottom, 20, 999);

      const convY = maxBottom + gap * 0.42;
      const divY  = minTop   - gap * 0.42;

      const allDone    = currentPts.every((p) => p.complete);
      const trunkColor = allDone ? COLOR_FADED : COLOR_NORMAL;

      // 1. Drop lines
      currentPts.forEach((p, i) => {
        lines.push(
          <line
            key={`drop-${li}-${i}`}
            x1={p.x} y1={p.bottom}
            x2={p.x} y2={convY}
            stroke={p.complete ? COLOR_DONE : COLOR_NORMAL}
            strokeWidth={SW}
          />
        );
      });

      const currentMinX = Math.min(...currentPts.map((p) => p.x));
      const currentMaxX = Math.max(...currentPts.map((p) => p.x));
      const currentCX   = (currentMinX + currentMaxX) / 2;

      // 2. Top horizontal bar
      if (currentPts.length > 1) {
        lines.push(
          <line
            key={`hbar-top-${li}`}
            x1={currentMinX} y1={convY}
            x2={currentMaxX} y2={convY}
            stroke={trunkColor} strokeWidth={SW}
          />
        );
      }

      // 3. Trunk
      const nextMinX = Math.min(...nextPts.map((p) => p.x));
      const nextMaxX = Math.max(...nextPts.map((p) => p.x));
      const nextCX   = (nextMinX + nextMaxX) / 2;

      const trunkX1 = currentPts.length === 1 ? currentPts[0].x      : currentCX;
      const trunkY1 = currentPts.length === 1 ? currentPts[0].bottom  : convY;
      const trunkX2 = nextPts.length    === 1 ? nextPts[0].x          : nextCX;
      const trunkY2 = nextPts.length    === 1 ? nextPts[0].top        : divY;

      lines.push(
        <line
          key={`trunk-${li}`}
          x1={trunkX1} y1={trunkY1}
          x2={trunkX2} y2={trunkY2}
          stroke={trunkColor} strokeWidth={SW}
        />
      );

      // 4. Bottom horizontal bar
      if (nextPts.length > 1) {
        lines.push(
          <line
            key={`hbar-bot-${li}`}
            x1={nextMinX} y1={divY}
            x2={nextMaxX} y2={divY}
            stroke={trunkColor} strokeWidth={SW}
          />
        );

        // 5. Rise lines
        nextPts.forEach((p, i) => {
          lines.push(
            <line
              key={`rise-${li}-${i}`}
              x1={p.x} y1={divY}
              x2={p.x} y2={p.top}
              stroke={trunkColor} strokeWidth={SW}
            />
          );
        });
      }
    });

    setSvgLines(lines);
  }, [matrix, isComplete]);

  // Recompute after layout settles
  useEffect(() => {
    const id = requestAnimationFrame(computeLines);
    return () => cancelAnimationFrame(id);
  }, [computeLines]);

  // Recompute on container resize
  useEffect(() => {
    const observer = new ResizeObserver(() => requestAnimationFrame(computeLines));
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeLines]);

  // ── Derive modal props ───────────────────────────────────────────────────────

  const modalNode =
    modal !== null ? matrix[modal.layerIndex][modal.nodeIndex] : null;
  const modalStorageKey =
    modal !== null ? storageKey(modal.layerIndex, modal.nodeIndex) : "";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative w-full">
      {/* SVG overlay — pointer-events:none lets clicks reach the cards beneath */}
      {svgDims.w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={svgDims.w}
          height={svgDims.h}
          style={{ overflow: "visible" }}
        >
          {svgLines}
        </svg>
      )}

      {/* Layers */}
      <div className="flex flex-col items-center gap-16 py-12 pb-16">
        {matrix.map((layer, li) => (
          <div
            key={li}
            className="flex flex-row flex-wrap items-stretch justify-center gap-6"
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

      {/* Modal */}
      {modal !== null && modalNode !== null && (
        <RoadmapModal
          node={modalNode}
          checked={
            checkedState[modalStorageKey] ??
            new Array(modalNode.items.length).fill(false)
          }
          onToggle={(itemIdx) =>
            handleToggle(modal.layerIndex, modal.nodeIndex, itemIdx)
          }
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}