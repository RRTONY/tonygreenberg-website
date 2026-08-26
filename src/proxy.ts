import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Renamed from `middleware.ts` in Next.js 16 — same purpose: refreshes the
// Supabase auth session on every matched request so Server Components (which
// can't write cookies themselves) always see a valid session. Required by
// Supabase's SSR pattern; see src/lib/supabase/server.ts.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Returning-visitor tracking for `ReturningVisitorHero` — ported from
  // legacy's `ReturningVisitorHero.tsx`, which counted visits in
  // localStorage. That's client-only, so the server can't render the
  // "welcome back" banner in the initial HTML — it always has to wait for
  // a post-hydration effect, which is exactly the flash/mismatch class of
  // bug this migration hit elsewhere (see journey-bar.tsx's own port
  // note). Cookies avoid that: incrementing here means `ReturningVisitorHero`
  // (a Server Component) can read the real count via `next/headers`
  // `cookies()` and render the correct final markup on the very first
  // response, no client JS or flash required. Only increments on `/`,
  // matching legacy mounting `<ReturningVisitorHero />` at the top of
  // `Blog.tsx` (which this app's `/` route corresponds to), not on every
  // route. Computed from the *request* cookie (stable regardless of what
  // happens to `response` below) but applied to whichever `response` is
  // actually returned — the Supabase block further down reassigns
  // `response` to a fresh `NextResponse`, which would silently drop this
  // cookie if it were set before that reassignment instead of after.
  const isHome = request.nextUrl.pathname === "/";
  const nextVisitCount = isHome ? Number(request.cookies.get("tg_visit_count")?.value ?? "0") + 1 : null;
  const applyVisitCookie = () => {
    if (nextVisitCount !== null) {
      response.cookies.set("tg_visit_count", String(nextVisitCount), {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  };

  // Supabase isn't provisioned yet (Phase 2) — don't take the whole site
  // down over auth session refresh for routes that don't need it yet.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    applyVisitCookie();
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Touches the session so expiring tokens get refreshed. Required even
  // though the result isn't used directly here.
  await supabase.auth.getUser();

  applyVisitCookie();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)"],
};
