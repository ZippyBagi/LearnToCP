import SideBarButton from "@/app/ui/utils/sideBarButton";
import SidebarSection from "@/app/ui/utils/sideBarSection";

type SideBarInput = {
  toggled: boolean;
  containers: any;
};

export default function SideBar({ toggled, containers }: SideBarInput) {
  return (
    <nav
      className={`
        flex flex-col items-center h-full py-3 gap-2.5 shrink-0
        overflow-hidden transition-all duration-200 ease-in-out
        ${toggled ? "w-56 px-2.5 opacity-100" : "w-0 px-0 opacity-0"}
      `}
      style={{
        background: "rgba(0,8,16,0.6)",
        borderRight: "1px solid rgba(124,158,248,0.12)",
      }}
    >
      {/* Nav links */}
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          border: "1px solid rgba(124,158,248,0.14)",
          background: "rgba(13,33,55,0.5)",
        }}
      >
        <SideBarButton name="Home" href="/" />
        <SideBarButton name="Roadmap" href="/roadmap" />
        <SideBarButton name="About Us" href="/about-us" />
      </div>

      {/* Lesson sections */}
      <SidebarSection containers={containers} />
    </nav>
  );
}
