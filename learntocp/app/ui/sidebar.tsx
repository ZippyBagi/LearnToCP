import SideBarButton from "@/app/ui/utils/sideBarButton";
import SidebarSection from "@/app/ui/utils/sideBarSection";
import type { SidebarContainer } from "@/app/ui/utils/sidebar.types";
import getLocale from '@/app/utils/getLocale'

type SideBarInput = {
  toggled: boolean;
  containers: SidebarContainer[];
};

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

export default function SideBar({ toggled, containers }: SideBarInput) {
  return (
    <nav
      className={`
        flex flex-col h-full shrink-0
        overflow-hidden transition-all duration-200 ease-in-out
        ${toggled ? "w-56 opacity-100" : "w-0 opacity-0"}
      `}
      style={{
        background: "rgba(0,8,16,0.6)",
        borderRight: "1px solid rgba(124,158,248,0.12)",
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
