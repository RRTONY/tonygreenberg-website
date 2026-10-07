"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { postHref } from "@/lib/content/post-redirects";

// Ported from legacy client/src/components/ReturningVisitorHero.tsx — the
// "Welcome back" strip shown to returning visitors with a link back to the
// essay they last read. Cookies: `tg_visit_count` (incremented on `/` in
// `proxy.ts`), `tg_last_blog_slug`/`tg_last_blog_title` (written by
// `components/blog/track-last-blog-visit.tsx`). Legacy's `assessmentCount`
// CTA branch isn't ported (see git history); the fallback copy is shown.
//
// Read in the browser, not on the server (2026-10-08): reading cookies on the
// server made `/` render on every request (no CDN cache), the biggest cost in
// the homepage's Lighthouse score. The server renders nothing; the strip
// appears after hydration for returning visitors only. The browser sees the
// count *after* proxy.ts incremented it, so "2+ earlier visits" is >= 3 here.

function readCookie(name: string): string | undefined {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

// Cookies don't change while the page is open in a way this strip cares about.
const subscribe = () => () => {};
const getSnapshot = () => document.cookie;
const getServerSnapshot = () => "";

export function ReturningVisitorHero() {
  const cookieString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!cookieString) return null;

  const visitCount = Number(readCookie("tg_visit_count") ?? "0");
  if (visitCount < 3) return null;

  const lastSlug = readCookie("tg_last_blog_slug");
  const lastTitle = readCookie("tg_last_blog_title");
  const truncTitle = lastTitle && lastTitle.length > 30 ? `${lastTitle.slice(0, 30)}…` : lastTitle;

  return (
    <div className="border-b border-brand-gold-light/10 bg-brand-gold-light/4 px-3 py-1.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <span className="shrink-0 font-heading text-[0.82rem] text-brand-gold dark:text-brand-gold-light">Welcome back.</span>
          {lastSlug && truncTitle && (
            <Link
              href={postHref(lastSlug)}
              className="truncate border-b border-brand-gold-light/15 pb-px font-mono text-[0.6rem] tracking-[0.04em] text-brand-gold dark:text-brand-gold-light/55"
            >
              Continue: {truncTitle}
            </Link>
          )}
        </div>
        <Link
          href="/find-my"
          className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-brand-gold-light/10 px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.06em] text-brand-gold uppercase dark:text-brand-gold-light"
        >
          Pick up where you left off <ArrowRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
    </div>
  );
}
