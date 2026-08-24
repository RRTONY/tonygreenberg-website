/**
 * Canonical domain for all shared/copied URLs.
 * Always use tonygreenberg.com regardless of which domain the user is on.
 */
const CANONICAL_ORIGIN = "https://tonygreenberg.com";

/**
 * Get the canonical URL for the current page.
 * Replaces whatever origin the browser shows with tonygreenberg.com.
 */
export function getCanonicalUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href.replace(/^https?:\/\/[^/]+/, CANONICAL_ORIGIN);
}

/**
 * Build a canonical URL from a path.
 * Use when you know the path but want the full canonical URL.
 */
export function canonicalUrl(path: string): string {
  return `${CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Get the canonical origin string.
 */
export function getCanonicalOrigin(): string {
  return CANONICAL_ORIGIN;
}
