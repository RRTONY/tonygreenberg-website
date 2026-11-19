// The PRI pages that now live on psychedelicreadiness.com (PR #49, 2026-11-13). One list for the
// redirect in next.config.ts and for the links that point at these pages.
//
// The redirect was a temporary 307 while psychedelicreadiness.com was hidden from Google. That
// hold was lifted on 2026-11-20 (psychedelicreadiness PR #7), so it is now permanent (308), and
// links on this site go straight to the new address (`priHref`): Search Console reported every
// link to the old address as "Page with redirect" (2026-11-20). Being absolute links to another
// site, Next's <Link> doesn't prefetch them, which also ends the CORS console errors the old
// same-site links caused (browser test 2026-11-14).

export const PRI_SITE = "https://psychedelicreadiness.com";

/** [path here, path on psychedelicreadiness.com] */
export const PRI_MOVED_PAGES: [string, string][] = [
  ["/psychedelic-readiness-index", "/"],
  ["/psychedelic-readiness-index/disclaimer", "/disclaimer"],
  ["/pri-calibration", "/pri-calibration"],
  ["/pri-efficacy", "/pri-efficacy"],
  ["/medicine-sequencing", "/medicine-sequencing"],
  ["/iboga-ibogaine", "/iboga-ibogaine"],
  ["/iboga-compass", "/iboga-compass"],
  ["/peyote-mescaline", "/peyote-mescaline"],
  ["/facilitator-index", "/facilitator-index"],
];

const MOVED = new Map(PRI_MOVED_PAGES);

/**
 * The final address for a link: a moved PRI page (relative or on tonygreenberg.com, query and
 * #hash kept) becomes its psychedelicreadiness.com address; anything else is returned unchanged.
 */
export function priHref(href: string): string {
  const local = href.replace(/^https?:\/\/(www\.)?tonygreenberg\.com(?=\/)/, "");
  const path = local.split(/[?#]/)[0];
  const destination = MOVED.get(path);
  if (destination === undefined) return href;
  return PRI_SITE + destination + local.slice(path.length);
}
