"use client";

import { useState, useCallback, useMemo } from "react";
import {
  itemKey,
  type RoadmapItem,
  type RoadmapMatrix,
  type RoadmapNode,
} from "@/app/[locale]/roadmap/roadmap.types";
import { createClient } from "@/app/supabase/client";

export interface ModalTarget {
  layerIndex: number;
  nodeIndex: number;
}

export function useRoadmapCanvas(
  matrix: RoadmapMatrix,
  initialCompleted: string[],
  solvedSlugs: string[],
) {
  const supabase = useMemo(() => createClient(), []);
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(initialCompleted),
  );
  // Solved problems are read-only — sourced from judged submissions, never toggled here.
  const solved = useMemo(() => new Set(solvedSlugs), [solvedSlugs]);
  const [modal, setModal] = useState<ModalTarget | null>(null);

  // A theory item is "done" when the user has checked it; a problem item is
  // "done" only when its slug appears in the solved set.
  const isItemDone = useCallback(
    (node: RoadmapNode, item: RoadmapItem): boolean =>
      item.type === "problem"
        ? !!item.slug && solved.has(item.slug)
        : completed.has(itemKey(node.id, item.id)),
    [completed, solved],
  );

  const getProgress = useCallback(
    (li: number, ni: number): number => {
      const node = matrix[li]?.[ni];
      if (!node || node.items.length === 0) return 0;
      const done = node.items.filter((item) => isItemDone(node, item)).length;
      return done / node.items.length;
    },
    [matrix, isItemDone],
  );

  const isComplete = useCallback(
    (li: number, ni: number): boolean => getProgress(li, ni) === 1,
    [getProgress],
  );

  const handleToggle = useCallback(
    (li: number, ni: number, itemIdx: number) => {
      const node = matrix[li]?.[ni];
      const item = node?.items[itemIdx];
      if (!node || !item) return;
      // Problems are completed by solving them, not by toggling — ignore.
      if (item.type === "problem") return;

      const key = itemKey(node.id, item.id);
      const checking = !completed.has(key);

      // Optimistic update
      setCompleted((prev) => {
        const next = new Set(prev);
        if (checking) next.add(key);
        else next.delete(key);
        return next;
      });

      const op = checking
        ? supabase.from("roadmap_progress").insert({ item_id: key })
        : supabase.from("roadmap_progress").delete().eq("item_id", key);

      op.then(({ error }) => {
        // 23505 = already inserted (double click / second tab) — already in desired state
        if (error && error.code !== "23505") {
          console.error("[roadmap] failed to save progress:", error.message);
          setCompleted((prev) => {
            const reverted = new Set(prev);
            if (checking) reverted.delete(key);
            else reverted.add(key);
            return reverted;
          });
        }
      });
    },
    [matrix, completed, supabase],
  );

  const modalNode =
    modal !== null ? matrix[modal.layerIndex][modal.nodeIndex] : null;
  const modalChecked = modalNode
    ? modalNode.items.map((item) => isItemDone(modalNode, item))
    : [];

  return {
    modal,
    setModal,
    modalNode,
    modalChecked,
    getProgress,
    isComplete,
    handleToggle,
  };
}
