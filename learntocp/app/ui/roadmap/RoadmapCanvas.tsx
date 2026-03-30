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

interface SvgContent {
  defs:  ReactNode[];
  lines: ReactNode[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storageKey(li: number, ni: number): string {
  return `roadmap:${li}:${ni}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ─── Colour constants ─────────────────────────────────────────────────────────
//
// Colour model:
//   • Every completed node emits a GREEN drop-line.
//   • When ALL nodes in a layer are done  → trunk + bars + rises are GREEN.
//   • When NO  nodes are done             → everything is BLUE_NORMAL.
//   • When some are done (mixed)          → gradient green → blue on trunk/bar/rises,
//                                           per-node colour on the top h-bar.
//
// There is intentionally no "faded" state — green flows all the way through.

const C_BLUE  = "rgba(124,158,248,0.32)";
const C_GREEN = "rgba(80,250,123,0.60)";

const SW = 1.5; // SVG stroke-width

// ─── Component ────────────────────────────────────────────────────────────────

interface RoadmapCanvasProps {
  matrix: RoadmapMatrix;
}

export function RoadmapCanvas({ matrix }: RoadmapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // nodeRefs.current[layerIdx][nodeIdx] → wrapper <div> of that card
  const nodeRefs = useRef<(HTMLDivElement | null)[][]>(
    matrix.map((layer) => layer.map(() => null))
  );

  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [modal, setModal]               = useState<ModalTarget | null>(null);
  const [svgContent, setSvgContent]     = useState<SvgContent>({ defs: [], lines: [] });
  const [svgDims, setSvgDims]           = useState({ w: 0, h: 0 });

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
  // For each pair of adjacent layers the drawing is:
  //
  //   ┌──┐   ┌──┐   ┌──┐        ← current layer nodes
  //    |       |       |          step 1: drop lines  (node colour)
  //    └───────┴───────┘          step 2: top h-bar   (gradient if mixed)
  //            |                  step 3: trunk        (same gradient)
  //    ┌───────┴───────┐          step 4: bottom h-bar (same colour)
  //    |               |          step 5: rise lines   (same colour)
  //   ┌──┐           ┌──┐        ← next layer nodes
  //
  // Lines meet exactly at the node border (no penetration, no gap).

  const computeLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cr = container.getBoundingClientRect();
    setSvgDims({ w: cr.width, h: cr.height });

    const defs:  ReactNode[] = [];
    const lines: ReactNode[] = [];

    matrix.forEach((layer, li) => {
      if (li >= matrix.length - 1) return;

      // ── Measure current layer (bottom-centre of each card wrapper) ─────────
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

      // ── Measure next layer (top-centre of each card wrapper) ──────────────
      const nextPts = matrix[li + 1]
        .map((_, ni) => {
          const el = nodeRefs.current[li + 1]?.[ni];
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 - cr.left, top: r.top - cr.top };
        })
        .filter(Boolean) as { x: number; top: number }[];

      if (!currentPts.length || !nextPts.length) return;

      // ── Layer completion counters ─────────────────────────────────────────
      const doneCount = currentPts.filter((p) => p.complete).length;
      const allDone   = doneCount === currentPts.length;
      const noneDone  = doneCount === 0;
      const doneRatio = doneCount / currentPts.length; // 0..1

      // ── Geometry ──────────────────────────────────────────────────────────
      const maxBottom   = Math.max(...currentPts.map((p) => p.bottom));
      const minTop      = Math.min(...nextPts.map((p) => p.top));
      const gap         = clamp(minTop - maxBottom, 20, 999);
      const convY       = maxBottom + gap * 0.42;
      const divY        = minTop   - gap * 0.42;

      const currentMinX = Math.min(...currentPts.map((p) => p.x));
      const currentMaxX = Math.max(...currentPts.map((p) => p.x));
      const currentCX   = (currentMinX + currentMaxX) / 2;
      const nextMinX    = Math.min(...nextPts.map((p) => p.x));
      const nextMaxX    = Math.max(...nextPts.map((p) => p.x));
      const nextCX      = (nextMinX + nextMaxX) / 2;

      const trunkX1 = currentPts.length === 1 ? currentPts[0].x : currentCX;
      const trunkX2 = nextPts.length    === 1 ? nextPts[0].x    : nextCX;

      // ── Trunk / bar / rise colour ─────────────────────────────────────────
      //
      //  allDone  → solid GREEN  (completion has flowed all the way through)
      //  noneDone → solid BLUE
      //  mixed    → vertical gradient GREEN → BLUE, transition point at doneRatio
      //
      let trunkStroke: string;

      if (allDone) {
        trunkStroke = C_GREEN;
      } else if (noneDone) {
        trunkStroke = C_BLUE;
      } else {
        const gradId   = `grad-trunk-${li}`;
        trunkStroke    = `url(#${gradId})`;
        const transEnd = Math.min(doneRatio * 100 + 12, 100);

        defs.push(
          <linearGradient
            key={gradId}
            id={gradId}
            x1={trunkX1} y1={convY}
            x2={trunkX2} y2={divY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"             stopColor={C_GREEN}                  />
            <stop offset={`${doneRatio * 100}%`} stopColor={C_GREEN} stopOpacity="0.7" />
            <stop offset={`${transEnd}%`} stopColor={C_BLUE}  stopOpacity="0.7" />
            <stop offset="100%"           stopColor={C_BLUE}                   />
          </linearGradient>
        );
      }

      // ── 1. Drop lines (current node bottom → convY) ───────────────────────
      currentPts.forEach((p, i) => {
        lines.push(
          <line
            key={`drop-${li}-${i}`}
            x1={p.x} y1={p.bottom}
            x2={p.x} y2={convY}
            stroke={p.complete ? C_GREEN : C_BLUE}
            strokeWidth={SW}
          />
        );
      });

      // ── 2. Top horizontal bar (convY across all nodes) ────────────────────
      if (currentPts.length > 1) {
        let barStroke: string;

        if (allDone) {
          barStroke = C_GREEN;
        } else if (noneDone) {
          barStroke = C_BLUE;
        } else {
          // Per-node stops so each segment matches its node's colour
          const barGradId = `grad-hbar-top-${li}`;
          barStroke       = `url(#${barGradId})`;
          const span      = currentMaxX - currentMinX || 1;

          const stops = [...currentPts]
            .sort((a, b) => a.x - b.x)
            .map((pt, idx) => (
              <stop
                key={idx}
                offset={`${((pt.x - currentMinX) / span) * 100}%`}
                stopColor={pt.complete ? C_GREEN : C_BLUE}
              />
            ));

          defs.push(
            <linearGradient
              key={barGradId}
              id={barGradId}
              x1={currentMinX} y1={convY}
              x2={currentMaxX} y2={convY}
              gradientUnits="userSpaceOnUse"
            >
              {stops}
            </linearGradient>
          );
        }

        lines.push(
          <line
            key={`hbar-top-${li}`}
            x1={currentMinX} y1={convY}
            x2={currentMaxX} y2={convY}
            stroke={barStroke}
            strokeWidth={SW}
          />
        );
      }

      // ── 3. Trunk (convY → divY) ───────────────────────────────────────────
      lines.push(
        <line
          key={`trunk-${li}`}
          x1={trunkX1} y1={convY}
          x2={trunkX2} y2={divY}
          stroke={trunkStroke}
          strokeWidth={SW}
        />
      );

      // ── 4. Bottom horizontal bar (divY across next nodes) ─────────────────
      if (nextPts.length > 1) {
        lines.push(
          <line
            key={`hbar-bot-${li}`}
            x1={nextMinX} y1={divY}
            x2={nextMaxX} y2={divY}
            stroke={trunkStroke}
            strokeWidth={SW}
          />
        );
      }

      // ── 5. Rise lines (divY → next node top) ─────────────────────────────
      nextPts.forEach((p, i) => {
        lines.push(
          <line
            key={`rise-${li}-${i}`}
            x1={p.x} y1={divY}
            x2={p.x} y2={p.top}
            stroke={trunkStroke}
            strokeWidth={SW}
          />
        );
      });
    });

    setSvgContent({ defs, lines });
  }, [matrix, isComplete]);

  // Recompute once after layout settles
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
      {/* SVG overlay — pointer-events:none so clicks reach the cards beneath */}
      {svgDims.w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={svgDims.w}
          height={svgDims.h}
          style={{ overflow: "visible" }}
        >
          {svgContent.defs.length > 0 && <defs>{svgContent.defs}</defs>}
          {svgContent.lines}
        </svg>
      )}

      {/* Layers */}
      <div className="flex flex-col items-center gap-20 py-12 pb-10">
        {matrix.map((layer, li) => (
          <div
            key={li}
            className="flex flex-row flex-wrap items-stretch justify-center gap-8"
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