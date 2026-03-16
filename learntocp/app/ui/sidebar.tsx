import SideBarButton from "@/app/ui/utils/sideBarButton"

export default function SideBar(){
    return <nav className="flex flex-col align-center items-center h-screen w-3xs bg-black/50 border-r-4 border-blue-500/50 fixed ">

        <SideBarButton name="Home" href="/"></SideBarButton>
        <SideBarButton name="Roadmap" href=""></SideBarButton>
        <SideBarButton name="About us" href="/about-us"></SideBarButton>
        
        
        
        
    </nav>
}