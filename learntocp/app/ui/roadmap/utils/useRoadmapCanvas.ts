"use client";

import { useState, useEffect, useCallback } from "react";
import type { RoadmapMatrix } from "@/app/utils/roadmap.types";
import {
  type CheckedState,
  storageKey,
  loadCheckedState,
  persistCheckedItem,
} from "./roadmap.utils";

export interface ModalTarget {
  layerIndex: number;
  nodeIndex: number;
}

export function useRoadmapCanvas(matrix: RoadmapMatrix) {
  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [modal, setModal] = useState<ModalTarget | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCheckedState(loadCheckedState(matrix));
  }, [matrix]);

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

  const handleToggle = useCallback(
    (li: number, ni: number, itemIdx: number) => {
      const key = storageKey(li, ni);
      setCheckedState((prev) => {
        const current =
          prev[key] ?? new Array(matrix[li][ni].items.length).fill(false);
        const next = [...current];
        next[itemIdx] = !next[itemIdx];
        persistCheckedItem(key, next);
        return { ...prev, [key]: next };
      });
    },
    [matrix]
  );

  const modalNode =
    modal !== null ? matrix[modal.layerIndex][modal.nodeIndex] : null;
  const modalKey =
    modal !== null ? storageKey(modal.layerIndex, modal.nodeIndex) : "";
  const modalChecked = modalNode
    ? (checkedState[modalKey] ?? new Array(modalNode.items.length).fill(false))
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