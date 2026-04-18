"use client";
import Navbar from "@/app/ui/navbar";
import SideBar from "@/app/ui/sidebar";
import LessonSkeleton from "@/app/Theory/_components/LessonSkeleton";
import { NavigationContext } from "@/app/ui/utils/navigationContext";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SidebarContainer } from "@/app/utils/sidebar.types";

type LayoutShellProps = {
  children: React.ReactNode;
  containers: SidebarContainer[];
};

export default function LayoutShell({ children, containers }: LayoutShellProps) {
  const pathname = usePathname();
  const [sideBarActive, setSideBarActive] = useState(true);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Any pathname change means the navigation resolved (success OR user clicked
  // something else / hit back). Clearing on any change avoids a stuck skeleton
  // if the URL-encoded pathname doesn't exactly match the link's href.
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const startNavigation = useCallback(
    (href: string) => {
      if (href === pathname) return;
      setPendingHref(href);
    },
    [pathname],
  );

  const contextValue = useMemo(
    () => ({ pendingHref, startNavigation }),
    [pendingHref, startNavigation],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen w-screen">
        <Navbar setSideBarActiveFunction={() => setSideBarActive((prev) => !prev)} />
        <div className="flex flex-1 min-h-0">
          <SideBar toggled={sideBarActive} containers={containers} />
          <div className="p-3 flex-1 overflow-auto">
            {pendingHref ? <PendingView href={pendingHref} /> : children}
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

/**
 * Picks the right loading view for the destination so the skeleton shape
 * matches what will replace it. Theory routes use the lesson skeleton; every
 * other route falls back to a centered spinner that matches `app/loading.tsx`.
 */
function PendingView({ href }: { href: string }): ReactNode {
  if (href.startsWith("/Theory/")) return <LessonSkeleton />;
  return (
    <div
      className="flex min-h-full items-center justify-center"
      style={{ background: "var(--color-bg-page)" }}
    >
      <div
        aria-label="Loading"
        role="status"
        className="h-10 w-10 rounded-full border-[3px] border-transparent animate-spin"
        style={{
          borderTopColor: "rgba(124, 158, 248, 0.45)",
          borderRightColor: "rgba(124, 158, 248, 0.25)",
          animationDuration: "0.75s",
        }}
      />
    </div>
  );
}
