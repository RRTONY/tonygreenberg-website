// The PRI pages that 307 to psychedelicreadiness.com (PR #49, 2026-11-13: temporary on purpose,
// that site is still on hold and noindex). One list for the redirect in next.config.ts and for
// the links that point at these pages.
//
// The links keep their tonygreenberg.com addresses so the move stays easy to undo. Next's <Link>
// prefetches a page in the background when the link scrolls into view; for these pages that
// request is redirected to another site, which the browser refuses (a CORS error in the console,
// found by the browser test 2026-11-14). Clicking still works. `priPrefetch` turns the prefetch
// off for exactly these links.

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

const MOVED = new Set(PRI_MOVED_PAGES.map(([path]) => path));

/** True when a link (query and #hash allowed) points at one of the moved PRI pages. */
export function isMovedPriHref(href: string): boolean {
  return MOVED.has(href.split(/[?#]/)[0]);
}

/** For `<Link prefetch={priPrefetch(href)}>`: off for moved PRI pages, Next's default otherwise. */
export function priPrefetch(href: string): false | undefined {
  return isMovedPriHref(href) ? false : undefined;
}
