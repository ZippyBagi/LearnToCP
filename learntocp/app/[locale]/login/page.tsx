import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/supabase/server";
import { getLoginMessages } from "@/translations";
import { pageMetadata } from "@/app/utils/seo";
import LoginPanel from "../../ui/login/LoginPanel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getLoginMessages(locale);
  return pageMetadata({
    locale,
    path: "login",
    title: m.eyebrow,
    description: m.description,
    // Utility page - keep it out of search results.
    noindex: true,
  });
}

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { next } = await searchParams;

  // Already signed in: skip the login form and go straight to where the user was headed
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    const safeNext =
      next && next.startsWith("/") && !next.startsWith("//") ? next : `/${locale}`;
    redirect(safeNext);
  }

  return (
    <div className="relative -m-3 h-[calc(100%+1.5rem)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(12,36,56,0.55) 0%, transparent 60%), radial-gradient(ellipse 80% 55% at 50% 110%, rgba(12,36,56,0.55) 0%, transparent 60%), var(--color-bg-page)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(124,158,248,0.35) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 0%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 0%, transparent 90%)",
        }}
      />
      
      <div className="absolute left-1/2 top-1/2 w-[min(440px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2">
        <Suspense>
          <LoginPanel locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
