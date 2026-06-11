export function getElementPositions(n: number, gap_x: number): number[] {
  const positions: number[] = [];

  if (n % 2 === 1) {
    const mid = Math.floor(n / 2);
    for (let i = 0; i < n; i++) {
      positions.push((i - mid) * gap_x);
    }
  } else {
    const mid = n / 2;
    for (let i = 0; i < n; i++) {
      positions.push((i - mid + 0.5) * gap_x);
    }
  }

  return positions;
}
