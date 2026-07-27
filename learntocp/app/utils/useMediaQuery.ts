"use client";

import { useCallback, useSyncExternalStore } from "react";

// Server/first client render always report `false`, so hydration matches; React
// re-renders with the real value in the same commit, before paint.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
