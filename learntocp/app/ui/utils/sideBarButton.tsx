'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

type SideBarButtonInput = {
  name: string;
  href: string;
};

// Used for top-level nav (Home / Roadmap / About Us). These routes are small
// and Next.js's own `loading.tsx` already handles them smoothly, so this
// button intentionally does NOT trigger the lesson-specific pending overlay.
export default function SideBarButton({ name, href }: SideBarButtonInput) {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/^\/[^/]+/, "") || "/";
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      prefetch={true}
      className="flex w-full items-center gap-2.5 py-2.5 pr-3.5 text-sm font-medium select-none transition-all duration-150"
      style={{
        color: isActive ? "var(--color-accent)" : "rgba(200,218,240,0.7)",
        background: isActive ? "rgba(124,158,248,0.09)" : "transparent",
        borderLeft: `3px solid ${isActive ? "var(--color-accent)" : "transparent"}`,
        paddingLeft: "calc(0.875rem - 3px)",
      }}
      onMouseEnter={(e) => {
        if (isActive) return;
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-heading)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,158,248,0.07)";
      }}
      onMouseLeave={(e) => {
        if (isActive) return;
        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(200,218,240,0.7)";
        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      <span>{name}</span>
    </Link>
  );
}
