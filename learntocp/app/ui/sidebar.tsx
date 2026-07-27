"use client";
import { useRef, useState } from "react";
import SideBarButton from "@/app/ui/sidebar/sideBarButton";
import SidebarSection from "@/app/ui/sidebar/sideBarSection";
import type { SidebarContainer } from "@/app/ui/sidebar/sidebar.types";
import getLocale from '@/app/utils/getLocale'

type SideBarInput = {
  toggled: boolean;
  mounted: boolean;
  isMobile: boolean;
  onClose: () => void;
  containers: SidebarContainer[];
};

const SWIPE_CLOSE_THRESHOLD = 56;
const AXIS_LOCK_THRESHOLD = 8;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3.5 pt-3 pb-1.5 text-xs font-bold tracking-widest uppercase select-none"
      style={{ color: "rgba(124,158,248,0.4)" }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-3.5 my-1.5"
      style={{ borderTop: "1px solid rgba(124,158,248,0.1)" }}
    />
  );
}

export default function SideBar({
  toggled,
  mounted,
  isMobile,
  onClose,
  containers,
}: SideBarInput) {
  const [dragX, setDragX] = useState<number | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"none" | "x" | "y">("none");

  const swipeEnabled = isMobile && toggled;

  function handleTouchStart(e: React.TouchEvent) {
    if (!swipeEnabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    axis.current = "none";
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!swipeEnabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (axis.current === "none") {
      if (Math.abs(dx) < AXIS_LOCK_THRESHOLD && Math.abs(dy) < AXIS_LOCK_THRESHOLD) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current !== "x") return;

    setDragX(Math.min(0, dx));
  }

  function handleTouchEnd() {
    if (!swipeEnabled) return;
    if (axis.current === "x" && dragX !== null && dragX <= -SWIPE_CLOSE_THRESHOLD) {
      onClose();
    }
    axis.current = "none";
    setDragX(null);
  }

  const dragging = dragX !== null;

  return (
    <nav
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`
        fixed top-[52px] bottom-0 left-0 z-40 w-56
        md:static md:top-auto md:bottom-auto md:z-auto md:h-full
        flex flex-col shrink-0
        overflow-hidden md:translate-x-0
        ${dragging ? "" : "transition-all duration-200 ease-in-out"}
        ${toggled ? "translate-x-0" : "-translate-x-full"}
        ${toggled ? "md:w-56 md:opacity-100" : "md:w-0 md:opacity-0"}
        ${mounted ? "" : "max-md:hidden"}
      `}
      style={{
        background: isMobile ? "rgba(0,8,16,0.96)" : "rgba(0,8,16,0.6)",
        borderRight: "1px solid rgba(124,158,248,0.12)",
        ...(dragging ? { transform: `translateX(${dragX}px)` } : {}),
      }}
    >
      {/* overscroll-contain: when the sidebar list hits its end, the wheel
          event must not chain up and scroll the document out from under
          the navbar. */}
      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 w-full">
        <div className="flex flex-col w-full py-2">
          <SectionLabel>{getLocale() == "en" ? "Navigation" : "Navigacija"}</SectionLabel>
          <SideBarButton name={getLocale() == "en" ? "Home" : "Početna"} href="/" />
          <SideBarButton name={getLocale() == "en" ? "Roadmap" : "Road-mapa"} href="/roadmap" />
          <SideBarButton name={getLocale() == "en" ? "Problems" : "Problemi"} href="/Problems" />
          <SideBarButton name={getLocale() == "en" ? "About Us" : "O Nama"} href="/about-us" />

          <Divider />

          <SectionLabel>{getLocale() == "en" ? "Theory" : "Teorija"}</SectionLabel>
          <SidebarSection containers={containers} />
        </div>
      </div>
    </nav>
  );
}
