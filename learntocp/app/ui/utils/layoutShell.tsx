"use client";
import Navbar from "@/app/ui/navbar";
import SideBar from "@/app/ui/sidebar";
import { useState } from "react";
import type { SidebarContainer } from "@/app/utils/sidebar.types";

type LayoutShellProps = {
  children: React.ReactNode;
  containers: SidebarContainer[];
};

export default function LayoutShell({ children, containers }: LayoutShellProps) {
  const [sideBarActive, setSideBarActive] = useState(true);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar setSideBarActiveFunction={() => setSideBarActive((prev) => !prev)} />
      <div className="flex flex-1 min-h-0">
        <SideBar toggled={sideBarActive} containers={containers} />
        <div className="p-3 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
