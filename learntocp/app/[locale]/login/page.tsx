import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/supabase/server";
import LoginPanel from "./components/LoginPanel";

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to LearnToCP to track your progress.",
};

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  // Redirect if signed in
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect(`/${locale}`);
  }

  return (
    // -m-3 cancels the p-3 on the layout content wrapper so the background is full-bleed with no surrounding gap.
    <div className="relative -m-3 flex min-h-[calc(100%+1.5rem)] items-center justify-center overflow-hidden">
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

      <div className="relative">
        <Suspense>
          <LoginPanel locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
