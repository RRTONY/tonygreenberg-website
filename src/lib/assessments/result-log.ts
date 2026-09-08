// Real cookie, not localStorage — same call already made for
// `tg_last_blog_slug`/`tg_last_blog_title` (see `track-last-blog-visit.tsx`
// and `returning-visitor-hero.tsx`'s port note): a cookie is visible to the
// server on the very next request, so `/self-portrait` can read it via
// `next/headers` and render the real list in the initial HTML — no client
// hydration step, no flash of an empty state. Only `slug` + `completedAt`
// are stored (not title/summary/href) to keep the cookie small regardless
// of how many assessments exist; `/self-portrait` resolves display copy by
// looking the slug up in the real ecosystem directory
// (`lib/content/find-your-me.ts`'s `ECOSYSTEM_CATEGORIES`).
export const RESULT_LOG_COOKIE = "tg_assessment_results";
const RESULT_LOG_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, matches the blog-visit cookies

export interface CompletedAssessment {
  slug: string;
  completedAt: string;
}

export function parseResultLogCookie(raw: string | undefined | null): CompletedAssessment[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is CompletedAssessment =>
        typeof e === "object" && e !== null && typeof (e as CompletedAssessment).slug === "string" && typeof (e as CompletedAssessment).completedAt === "string",
    );
  } catch {
    return [];
  }
}

// Client-only — call from a "use client" component's effect (see
// AssessmentResultActions). A retake overwrites its slug's entry rather
// than duplicating it.
export function saveAssessmentResult(slug: string): void {
  const match = document.cookie.match(/(?:^|; )tg_assessment_results=([^;]*)/);
  const existing = parseResultLogCookie(match ? decodeURIComponent(match[1]) : null);
  const next = [...existing.filter((e) => e.slug !== slug), { slug, completedAt: new Date().toISOString() }];
  document.cookie = `${RESULT_LOG_COOKIE}=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=${RESULT_LOG_MAX_AGE}; SameSite=Lax`;
}
