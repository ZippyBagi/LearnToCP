"use client";
import Navbar from "@/app/ui/navbar";
import SideBar from "@/app/ui/sidebar";
import LessonSkeleton from "./Theory/_components/LessonSkeleton";
import { NavigationContext } from "@/app/ui/utils/navigationContext";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SidebarContainer } from "@/app/ui/utils/sidebar.types";

type LayoutShellProps = {
  children: React.ReactNode;
  containers: SidebarContainer[];
};

// Only lesson routes need the pending overlay — other pages use loading.tsx
function isLessonHref(href: string): boolean {
  return /^\/[^/]+\/Theory\//.test(href);
}

export default function LayoutShell({ children, containers }: LayoutShellProps) {
  const pathname = usePathname();
  const [sideBarActive, setSideBarActive] = useState(true);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear pending on any navigation — covers success, redirect, and back
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const startNavigation = useCallback(
    (href: string) => {
      if (!isLessonHref(href)) return;
      if (href === pathname) return;
      setPendingHref(href);
    },
    [pathname],
  );

  const contextValue = useMemo(
    () => ({ pendingHref, startNavigation }),
    [pendingHref, startNavigation],
  );

  const showingLessonSkeleton = pendingHref !== null;

  return (
    <NavigationContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen w-screen">
        <Navbar setSideBarActiveFunction={() => setSideBarActive((prev) => !prev)} />
        <div className="flex flex-1 min-h-0">
          <SideBar toggled={sideBarActive} containers={containers} />
          <div className="p-3 flex-1 overflow-auto">
            {showingLessonSkeleton ? <LessonSkeleton /> : children}
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}
