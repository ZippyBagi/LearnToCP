export function storageKey(li: number, ni: number): string {
  return `roadmap:${li}:${ni}`;
}

export type CheckedState = Record<string, boolean[]>;

export function loadCheckedState(matrix: { items: unknown[] }[][]): CheckedState {
  const result: CheckedState = {};
  matrix.forEach((layer, li) => {
    layer.forEach((node, ni) => {
      const key = storageKey(li, ni);
      try {
        const raw = localStorage.getItem(key);
        result[key] = raw
          ? (JSON.parse(raw) as boolean[])
          : new Array(node.items.length).fill(false);
      } catch {
        result[key] = new Array(node.items.length).fill(false);
      }
    });
  });
  return result;
}

export function persistCheckedItem(key: string, next: boolean[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // storage unavailable — in-memory state still updates correctly
  }
}