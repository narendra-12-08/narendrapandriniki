import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client.
 *
 * USE ONLY ON THE SERVER, AND ONLY FROM ROUTES THAT NEED TO BYPASS RLS.
 * Examples:
 *   - The public /sign/[token] route, which has no Supabase auth session
 *     but must still read & update a single contract row.
 *   - Migration / seed scripts.
 *
 * Do NOT import this from any client component or any route that already
 * has an authenticated user (use /lib/supabase/server.ts createClient there).
 */
let _admin: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "createAdminClient: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    );
  }
  _admin = createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return _admin;
}
