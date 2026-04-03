'use client'
import Navbar from "@/app/ui/navbar"
import SideBar from "@/app/ui/sidebar"
import { useState } from "react";

export default function LayoutShell({ children,containers }: { children: React.ReactNode; containers: any }){

    const [sideBarActive, setSideBarActive] = useState(true);

    return (
      <div className="flex flex-col h-screen w-screen">
        <Navbar setSideBarActiveFunction={() => setSideBarActive(prev => !prev)}></Navbar>
        <div className="flex flex-1 min-h-0">
          <SideBar toggled={sideBarActive} containers={containers}></SideBar>
          <div className="p-3 flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
}