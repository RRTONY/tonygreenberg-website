"use client";

import { createBrowserClient } from "@supabase/ssr";

// Single browser client, safe to import from any Client Component.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
