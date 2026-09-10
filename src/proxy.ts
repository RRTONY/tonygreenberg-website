import { NextResponse, type NextRequest } from "next/server";

// Renamed from `middleware.ts` in Next.js 16. The public site only uses this
// boundary to issue a bounded, server-managed returning-visitor counter; it
// does not depend on any external authentication service.
export function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

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
  // route. The request cookie is the sole input, and the response is the
  // sole writer, keeping browser persistence server-managed.
  const isHome = request.nextUrl.pathname === "/";
  if (isHome) {
    const currentCount = Number(request.cookies.get("tg_visit_count")?.value ?? "0");
    const nextVisitCount = Number.isFinite(currentCount) ? Math.min(currentCount + 1, 9999) : 1;
    response.cookies.set("tg_visit_count", String(nextVisitCount), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)"],
};
