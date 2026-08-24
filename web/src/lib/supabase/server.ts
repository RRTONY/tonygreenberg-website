import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// A fresh client per request, per Supabase's SSR guidance — never share one
// across requests. Used from Server Components, Server Actions, and Route
// Handlers. Session refresh on GET requests is handled by `proxy.ts`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component that can't set cookies — safe
            // to ignore as long as `proxy.ts` is also refreshing the
            // session, which it is.
          }
        },
      },
    },
  );
}
