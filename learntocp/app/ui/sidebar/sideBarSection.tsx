"use client";
import SidebarContainer from "@/app/ui/sidebar/sideBarContainer";
import type { SidebarContainer as SidebarContainerType } from "@/app/ui/sidebar/sidebar.types";

type SidebarSectionInput = {
  containers: SidebarContainerType[];
};

export default function SidebarSection({ containers }: SidebarSectionInput) {
  return (
    <div className="w-full">
      {containers.map((container, i) => (
        <div key={container.name}>
          {i > 0 && (
            <div style={{ borderTop: "1px solid rgba(124,158,248,0.1)" }} />
          )}
          <SidebarContainer {...container} standalone={false} />
        </div>
      ))}
    </div>
  );
}
