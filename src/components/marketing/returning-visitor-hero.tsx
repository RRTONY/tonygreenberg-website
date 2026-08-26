import { cookies } from "next/headers";
import Link from "next/link";

// Ported from legacy client/src/components/ReturningVisitorHero.tsx — the
// "Welcome back" strip shown to returning visitors (2+ visits) with a
// link back to whatever essay they last read. Real copy/gating logic
// unchanged (`visitCount < 2` → render nothing). Rebuilt as a Server
// Component reading real cookies (`tg_visit_count` incremented in
// `proxy.ts`, `tg_last_blog_slug`/`tg_last_blog_title` written by
// `components/blog/track-last-blog-visit.tsx`) instead of legacy's
// localStorage + client effect — a cookie is visible to the server on the
// very next request, so this renders the correct final markup in the
// initial HTML with no client JS and no post-hydration flash. Legacy's
// `assessmentCount` CTA branch ("N done → Continue") depended on a
// separate `AssessmentProgress` localStorage store this migration hasn't
// ported (a different tracker than `journey-tracker.tsx`'s) — rather than
// build a second, unrelated completed-assessments store just for this one
// CTA label, this always shows the real fallback copy legacy itself used
// when nothing was completed yet ("Pick up where you left off →"), which
// is also the honest state for every visitor migrating from the old site.
export async function ReturningVisitorHero() {
  const cookieStore = await cookies();
  const visitCount = Number(cookieStore.get("tg_visit_count")?.value ?? "0");
  if (visitCount < 2) return null;

  const lastSlug = cookieStore.get("tg_last_blog_slug")?.value;
  const lastTitle = cookieStore.get("tg_last_blog_title")?.value;
  const truncTitle = lastTitle && lastTitle.length > 30 ? `${lastTitle.slice(0, 30)}…` : lastTitle;

  return (
    <div className="border-b border-brand-gold-light/10 bg-brand-gold-light/4 px-3 py-1.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <span className="shrink-0 font-heading text-[0.82rem] text-brand-gold-light">Welcome back.</span>
          {lastSlug && truncTitle && (
            <Link
              href={`/blog/${lastSlug}`}
              className="truncate border-b border-brand-gold-light/15 pb-px font-mono text-[0.6rem] tracking-[0.04em] text-brand-gold-light/55"
            >
              Continue: {truncTitle}
            </Link>
          )}
        </div>
        <Link
          href="/find-my"
          className="shrink-0 rounded-sm bg-brand-gold-light/10 px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.06em] text-brand-gold-light uppercase"
        >
          Pick up where you left off →
        </Link>
      </div>
    </div>
  );
}
