import { LEGACY_POST_REDIRECTS } from "@/lib/content/legacy-post-redirects";
import { priHref } from "@/lib/content/pri-moved";

// Posts whose /blog address redirects to a full page (next.config.ts). Lists link straight to
// the destination so readers and crawlers skip the redirect hop.
export const POST_REDIRECTS: Record<string, string> = {
  "akbar-cuisine-restoration-economics": "/akbar",
};

export function postHref(slug: string): string {
  return POST_REDIRECTS[slug] ?? `/blog/${slug}`;
}

// Older on-site addresses that only redirect (next.config.ts), as found in Sanity-stored links
// (essay text, "Where This Leads"): return the final address so links skip the hop.
const OLD_ASSESSMENT_PATH = /^\/assessments\/(dharma-finder|consciousness-scale|grant-study)(?=$|[?#])/;

// WordPress-era post addresses (`/find-my-ev/`, also written in full on tonygreenberg.com) →
// their /blog page, so essay links skip the slash + legacy redirect chain (Search Console
// "Page with redirect", 2026-11-20).
const LEGACY_POSTS = new Map(LEGACY_POST_REDIRECTS);
const SITE_PREFIX = /^https?:\/\/(www\.)?tonygreenberg\.com(?=\/)/;

export function resolveInternalHref(href: string): string {
  const legacy = href.replace(SITE_PREFIX, "").match(/^(\/[^/?#]+)\/?(?=$|[?#])/);
  if (legacy && LEGACY_POSTS.has(legacy[1])) {
    href = `/blog/${LEGACY_POSTS.get(legacy[1])}` + href.replace(SITE_PREFIX, "").slice(legacy[0].length);
  }
  const post = href.match(/^\/blog\/([^/?#]+)(?=$|[?#])/);
  if (post && POST_REDIRECTS[post[1]]) return POST_REDIRECTS[post[1]] + href.slice(post[0].length);
  return priHref(href.replace(OLD_ASSESSMENT_PATH, "/$1"));
}
