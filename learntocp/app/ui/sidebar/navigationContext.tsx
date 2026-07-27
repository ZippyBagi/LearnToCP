'use client';
import { createContext, useContext } from 'react';

/**
 * Navigation pending state — lets sidebar links signal the start of a route
 * transition so the layout can swap its content area for a loading skeleton
 * *before* Next's router waits for the first byte of the destination's RSC
 * stream. Without this, the old page stays visible during the entire server
 * work window (fs + markdown + Shiki + dev compile), which is the "site
 * freezes on first lesson click" behavior we want to hide.
 *
 * The provider lives in `LayoutShell`; consumers are the sidebar link
 * components.
 */
export type NavigationContextValue = {
  /** The href the user is navigating to, or null if no navigation is in flight. */
  pendingHref: string | null;
  /** Called from link onClick to mark a navigation as pending. */
  startNavigation: (href: string) => void;
};

export const NavigationContext = createContext<NavigationContextValue>({
  pendingHref: null,
  startNavigation: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}
