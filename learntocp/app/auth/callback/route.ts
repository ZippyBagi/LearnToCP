import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/supabase/server";

const NEXT_COOKIE = "ltcp-auth-next";

/**
 * OAuth callback - Supabase redirects here after the provider sign-in.
 * Exchanges the auth code for a session (sets cookies), then redirects
 * the user to the target page.
 *
 * The target is carried in a short-lived cookie set by LoginPanel right
 * before the OAuth flow starts, NOT in a query param on the callback URL:
 * Supabase matches `redirectTo` against the redirect-URL allow list
 * including the query string, so `?next=...` can silently fail the match
 * and fall back to the Site URL. The `next` query param is still read as
 * a fallback for any older links.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = "/";
  const cookieNext = request.cookies.get(NEXT_COOKIE)?.value;
  if (cookieNext) {
    try {
      next = decodeURIComponent(cookieNext);
    } catch {
      next = "/";
    }
  } else {
    next = searchParams.get("next") ?? "/";
  }
  // Only allow same-origin relative redirect targets to prevent open-redirect attacks. "//evil.com" is protocol-relative and would leave the site.
  if (!next.startsWith("/") || next.startsWith("//")) next = "/";

  // Clear the one-shot cookie on whichever redirect we end up sending.
  function redirectTo(url: string) {
    const res = NextResponse.redirect(url);
    res.cookies.set(NEXT_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Behind Vercel's load balancer `origin` is internal - prefer the original host the browser actually used.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return redirectTo(`${origin}${next}`);
      }
      if (forwardedHost) {
        return redirectTo(`https://${forwardedHost}${next}`);
      }
      return redirectTo(`${origin}${next}`);
    }
  }

  return redirectTo(`${origin}/login?error=auth-code-error`);
}
