import SideBarButton from "@/app/ui/utils/sideBarButton"
import SidebarSection from "@/app/ui/utils/sideBarSection";

type SideBarInput = {
    toggled : boolean;
    containers : any;
};

export default function SideBar({ toggled, containers }: SideBarInput) {
  return (
    <nav
      className={`
        flex flex-col items-center bg-black/50 border-r-4 border-blue-500/50 h-full px-3 py-4 md:px-2 gap-2
        overflow-hidden transition-all duration-200 ease-in-out
        ${toggled ? 'w-3xs opacity-100' : 'w-0 px-0 opacity-0'}
      `}
    >
      <div className="border-1 border-dashed border-blue-500/50 rounded-lg w-9/10 h-auto overflow-hidden">
        <SideBarButton name="Home" href="/"></SideBarButton>
        <SideBarButton name="Roadmap" href="/roadmap"></SideBarButton>
        <SideBarButton name="About us" href="/about-us"></SideBarButton>
      </div>

      <SidebarSection containers={containers} />
    </nav>
  );
}