import SideBarButton from "@/app/ui/utils/sideBarButton"

export default function SideBar(){
    return <nav className="flex flex-col align-center items-center w-3xs bg-black/50 border-r-4 border-blue-500/50 h-full px-3 py-4 md:px-2">

        <div className="border-1 border-dashed border-blue-500/50 rounded-lg w-9/10 h-auto overflow-hidden">
            <SideBarButton name="Home" href="/"></SideBarButton>
            <SideBarButton name="Roadmap" href="/roadmap"></SideBarButton>
            <SideBarButton name="About us" href="/about-us"></SideBarButton>
        </div>

        <div className="border-1 border-dashed border-blue-500/50 rounded-lg w-9/10 h-auto mt-5 overflow-hidden">
            <SideBarButton name="Theory" href=""></SideBarButton>
            <SideBarButton name="Theory2" href=""></SideBarButton>
            <SideBarButton name="Theory3" href=""></SideBarButton>
            <SideBarButton name="Theory4" href=""></SideBarButton>
            <SideBarButton name="Theory5" href=""></SideBarButton>
            <SideBarButton name="Theory6" href=""></SideBarButton>
        </div>
        
        
    </nav>
}