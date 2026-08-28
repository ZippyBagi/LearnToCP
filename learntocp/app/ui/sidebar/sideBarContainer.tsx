'use client'
import SideBarContainerItem from '@/app/ui/sidebar/sideBarContainerItem';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from "lucide-react";

type SideBarContainerInput = {
  name: string;
  hrefs: string[];
  names: string[];
  standalone?: boolean;
};

export default function SidebarContainer({ name, hrefs, names, standalone }: SideBarContainerInput) {
  const pathname = usePathname();
  const hasActiveChild = hrefs.some((href) => pathname === href);

  const [open, setOpen] = useState(hasActiveChild);
  const isStandalone = standalone ?? true;

  return (
    <div
      className={isStandalone ? "w-full overflow-hidden rounded-xl" : "w-full overflow-hidden"}
      style={isStandalone ? { border: "1px solid rgba(124,158,248,0.14)", background: "rgba(13,33,55,0.5)" } : {}}
    >
      <div
        className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer select-none transition-all duration-150"
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "rgba(124,158,248,0.07)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <span
          className="text-sm font-semibold transition-colors duration-150"
          style={{ color: open || hasActiveChild ? "var(--color-accent)" : "rgba(200,218,240,0.85)" }}
        >
          {name}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`}
          style={{ color: open || hasActiveChild ? "var(--color-accent)" : "rgba(124,158,248,0.4)" }}
        />
      </div>

      <div
        className={`grid transition-all duration-150 ease-in-out ${
          open && hrefs.length > 0
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div style={{ borderTop: "1px solid rgba(124,158,248,0.1)" }}>
            {hrefs.map((href, i) => (
              <SideBarContainerItem key={href} name={names[i]} href={href} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
