import SideBarButton from "@/app/ui/utils/sideBarButton"
import SidebarSection from "@/app/ui/utils/sideBarSection";


type SideBarInput = {
    toggled : boolean;
};

export default function SideBar({toggled} : SideBarInput){

    if(!toggled){
        return <div></div>
    }

    return <nav className="flex flex-col items-center w-3xs bg-black/50 border-r-4 border-blue-500/50 h-full px-3 py-4 md:px-2 gap-2">
        
        <div className="border-1 border-dashed border-blue-500/50 rounded-lg w-9/10 h-auto overflow-hidden">
            <SideBarButton name="Home" href="/"></SideBarButton>
            <SideBarButton name="Roadmap" href="/roadmap"></SideBarButton>
            <SideBarButton name="About us" href="/about-us"></SideBarButton>
        </div>

        <SidebarSection containers={[
        { name: "Sorting", hrefs: ["/theory/bubble", "/theory/merge"], names: ["Bubble Sort", "Merge Sort"] },
        { name: "Graphs", hrefs: ["/theory/bfs", "/theory/dfs"], names: ["BFS", "DFS"] },
        ]} />
        
    </nav>
}