import { redirect } from "next/navigation";
import { createClient } from "@/app/supabase/server";

/**
 * Server-side auth guard for protected pages.
 *
 * The proxy (middleware) already redirects signed-out users, but middleware
 * alone is not a sufficient auth boundary in Next.js — this page-level check
 * is the defense-in-depth layer. Redirects to the login page with a `next`
 * param so the user is returned here after signing in.
 */
export async function requireAuth(locale: string, next: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect(`/${locale}/login?next=${encodeURIComponent(next)}`);
  }
}

/**
 * Non-redirecting variant of `requireAuth()` for public pages that adapt their UI to auth
 * state (e.g. Problems/roadmap render for everyone)
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return !!data?.claims;
}
