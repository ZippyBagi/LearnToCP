'use client'
import Link from "next/link";
import { usePathname, useParams, useSearchParams } from "next/navigation";

type SideBarButtonInput = {
  name: string;
  href: string;
};

function withoutLocale(path: string): string {
  return path.replace(/^\/[^/]+/, "") || "/";
}

export default function SideBarButton({ name, href }: SideBarButtonInput) {
  const rawPathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  let pathname = withoutLocale(rawPathname);

  // On the login page, highlight the page the user was trying to reach (carried in the `next` redirect param) instead of nothing.
  const next = searchParams.get("next");
  if (
    pathname === "/login" &&
    next &&
    next.startsWith("/") &&
    !next.startsWith("//")
  ) {
    pathname = withoutLocale(next.split("?")[0]);
  }

  // Exact match, or a subpage (e.g. /Problems/two-sum highlights Problems).
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
    
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
