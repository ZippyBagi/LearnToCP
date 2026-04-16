'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SideBarButtonInput = {
  name: string;
  href: string;
};

export default function SideBarContainerItem({ name, href }: SideBarButtonInput) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 py-2 text-sm select-none transition-all duration-150"
      style={{
        color: isActive ? "var(--color-accent)" : "rgba(200,218,240,0.6)",
        background: isActive ? "rgba(124,158,248,0.08)" : "transparent",
        borderLeft: `3px solid ${isActive ? "var(--color-accent)" : "transparent"}`,
        paddingLeft: "calc(0.875rem - 3px)",
        paddingRight: "0.875rem",
      }}
      onMouseEnter={(e) => {
        if (isActive) return;
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-heading)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,158,248,0.06)";
      }}
      onMouseLeave={(e) => {
        if (isActive) return;
        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(200,218,240,0.6)";
        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      <span
        className="w-1 h-1 rounded-full shrink-0 transition-all duration-150"
        style={{
          background: "var(--color-accent)",
          opacity: isActive ? 1 : 0.4,
        }}
      />
      <span>{name}</span>
    </Link>
  );
}
