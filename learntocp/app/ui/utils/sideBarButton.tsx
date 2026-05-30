'use client'
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

type SideBarButtonInput = {
  name: string;
  href: string;
};

// Used for top-level nav (Home / Roadmap / About Us). These routes are small
// and Next.js's own `loading.tsx` already handles them smoothly, so this
// button intentionally does NOT trigger the lesson-specific pending overlay.
export default function SideBarButton({ name, href }: SideBarButtonInput) {
  const rawPathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const pathname = rawPathname.replace(/^\/[^/]+/, "") || "/";
  const isActive = pathname === href;

  // Build a locale-prefixed href. Without the locale in the URL these links
  // resolve via the NEXT_LOCALE cookie + middleware redirect, but Next caches
  // the prefetched RSC payload by this (locale-less) href — so after switching
  // language the cache serves the previous locale until a hard refresh. Baking
  // the locale into the href gives each language a distinct cache key.
  const localizedHref = `/${locale}${href === "/" ? "" : href}`;

  return (
    <Link
      href={localizedHref}
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
