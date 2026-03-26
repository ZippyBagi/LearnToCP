'use client'
import SideBarContainerItem from './sideBarContainerItem';
import { useState } from 'react';
import { ChevronDown } from "lucide-react";


type SideBarContainerInput = {
    name: string;
    hrefs: string[];
    names: string[];
    standalone?: boolean;
};

export default function SidebarContainer(input: SideBarContainerInput) {
    const [open, setOpen] = useState(false);
    const standalone = input.standalone ?? true;

    return (
        <div className={standalone ? "border border-dashed border-blue-500/50 rounded-lg w-9/10 overflow-hidden" : "w-full overflow-hidden"}>
            <div
                className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none transition-colors duration-150 group"
                onClick={() => setOpen(!open)}
            >
                <span className="text-lg font-bold text-white group-hover:text-[var(--color-accent)] transition-colors duration-150">
                    {input.name}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-white/40 group-hover:text-[var(--color-accent)] transition-all duration-300 ${open ? "rotate-180" : "rotate-0"}`}
                />
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-blue-500/50">
                    {input.hrefs.map((href, i) => (
                        <SideBarContainerItem key={href} name={input.names[i]} href={href} />
                    ))}
                </div>
            </div>
        </div>
    );
}