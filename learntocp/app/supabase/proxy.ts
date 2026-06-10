import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session inside the proxy (middleware).
 *
 * Server Components can't write cookies, so the proxy is responsible for
 * refreshing expired auth tokens and passing them to both the server
 * (via request.cookies) and the browser (via response.cookies).
 *
 * Returns the response (carrying any refreshed cookies) and the verified
 * JWT claims (null when not logged in). `getClaims()` validates the JWT
 * signature, unlike `getSession()`, so it is safe to trust here.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // IMPORTANT: don't run code between createServerClient and getClaims() 
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  return { supabaseResponse, claims };
}
