"use client";
import Navbar from "@/app/ui/navbar";
import SideBar from "@/app/ui/sidebar";
import LessonSkeleton from "../ui/theory/LessonSkeleton";
import { NavigationContext } from "@/app/ui/sidebar/navigationContext";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { SidebarContainer } from "@/app/ui/sidebar/sidebar.types";

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
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // The sidebar starts collapsed on small screens, so a refresh never lands
  // on a drawer covering the page.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const apply = (matches: boolean) => {
      setIsMobile(matches);
      setSideBarActive(!matches);
    };

    apply(query.matches);
    setMounted(true);

    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Clear pending on any navigation — covers success, redirect, and back
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  useEffect(() => {
    if (isMobile) setSideBarActive(false);
  }, [pathname, isMobile]);

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
      {/* overflow-hidden pins the shell: the document itself can never
          scroll, so the navbar/sidebar always stay in view — all scrolling
          happens inside the content pane below. */}
      <div className="flex h-dvh w-screen flex-col overflow-hidden">
        <Navbar setSideBarActiveFunction={() => setSideBarActive((prev) => !prev)} />
        <div className="relative flex min-h-0 flex-1">
          {/* Suspense: SideBarButton reads useSearchParams (for the login
              `next` highlight), which requires a boundary during prerender. */}
          <Suspense fallback={null}>
            <SideBar
              toggled={sideBarActive}
              mounted={mounted}
              isMobile={isMobile}
              onClose={() => setSideBarActive(false)}
              containers={containers}
            />
          </Suspense>
          {isMobile && sideBarActive && (
            <div
              onClick={() => setSideBarActive(false)}
              className="fixed inset-x-0 bottom-0 top-[52px] z-30 bg-black/50 md:hidden"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1 overflow-auto overscroll-contain p-3">
            {showingLessonSkeleton ? <LessonSkeleton /> : children}
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}
