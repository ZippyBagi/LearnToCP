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
    <div className="flex h-full items-center justify-center">
      <Suspense>
        <LoginPanel locale={locale} />
      </Suspense>
    </div>
  );
}
