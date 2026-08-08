import "server-only";
import { createClient } from "@supabase/supabase-js";

/**Service-role Supabase client. Bypasses RLS - server-only, used by API routes to write submissions/verdicts. 
 * 
 * Requires SUPABASE_SECRET_KEY in env 
*/
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set!");
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
