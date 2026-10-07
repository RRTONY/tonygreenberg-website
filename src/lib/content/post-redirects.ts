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

export function resolveInternalHref(href: string): string {
  const post = href.match(/^\/blog\/([^/?#]+)(?=$|[?#])/);
  if (post && POST_REDIRECTS[post[1]]) return POST_REDIRECTS[post[1]] + href.slice(post[0].length);
  return href.replace(OLD_ASSESSMENT_PATH, "/$1");
}
