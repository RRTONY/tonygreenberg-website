import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Bypasses row-level security. Server-only (Server Actions, Route Handlers):
// used to write and read form submissions that have no public policies (see
// supabase/migrations/0001_member_features.sql). Never import from a Client
// Component.
// True only when both values the client needs are set. Code that may run
// while a page is prebuilt (or on a deploy without Supabase) checks this
// first and falls back, so a missing setting can't fail the build.
export function isServiceRoleConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function createServiceRoleClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
