"use client";

import { useEffect } from "react";

// Writes the real post slug/title to cookies so `ReturningVisitorHero`
// (a Server Component reading via `next/headers`) can render a "Continue
// reading" link on the visitor's next request — see that component's own
// port note for why cookies instead of legacy's localStorage. Renders
// nothing; a one-time write on mount is the only job here.
export function TrackLastBlogVisit({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `tg_last_blog_slug=${encodeURIComponent(slug)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `tg_last_blog_title=${encodeURIComponent(title)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, [slug, title]);

  return null;
}
