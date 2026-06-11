import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";

/**
 * OAuth callback — Supabase redirects here after the provider sign-in.
 * Exchanges the auth code for a session (sets cookies), then redirects
 * the user to `next` (defaults to the site root).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Only allow same-origin relative redirect targets to prevent open-redirect attacks. "//evil.com" is protocol-relative and would leave the site.
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/") || next.startsWith("//")) next = "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Behind Vercel's load balancer `origin` is internal — prefer theoriginal host the browser actually used.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
