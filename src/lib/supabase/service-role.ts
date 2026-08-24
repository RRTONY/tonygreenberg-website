import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Bypasses Row Level Security entirely — for trusted server-only writes only
// (chatbot conversation logging, admin actions). Never expose this client or
// SUPABASE_SERVICE_ROLE_KEY to the browser. No cookie/session handling
// needed since it authenticates via the service-role key directly.
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
