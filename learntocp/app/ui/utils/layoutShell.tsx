'use client'
import Navbar from "@/app/ui/navbar"
import SideBar from "@/app/ui/sidebar"
import { useState } from "react";

export default function LayoutShell({ children }: { children: React.ReactNode }){

    const [sideBarActive, setSideBarActive] = useState(true);

    function setSideBarActiveFunction(){
        setSideBarActive(!sideBarActive);
    }

    return (
        <div className="flex flex-col h-screen w-screen">
          <Navbar setSideBarActiveFunction={setSideBarActiveFunction}></Navbar>
          <div className="flex w-full h-full">
            <SideBar toggled={sideBarActive}></SideBar>
            <div className="p-3">{children}</div>
          </div>
        </div>);


}