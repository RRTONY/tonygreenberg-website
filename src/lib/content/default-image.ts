// Generic fallback hero/OG image for posts with no unique heroImage in
// Sanity. Not a photo of Tony or any real person — a brand-only card
// (dark gradient, the header's "TonyG" wordmark treatment, the header's
// own tagline) generated for this purpose and stored as a site-chrome
// asset in public/, matching CONTRIBUTING.md's rule that public/ is for
// chrome, not editorial content. Used in place of a real per-article
// photo until one is sourced (see BLOG-IMAGE-BRIEFS.md).
export const DEFAULT_OG_IMAGE = "/images/default-og.png";

// Live's default essay hero (tonygreenberg.com/og-default.jpg, a WebP: gold
// and violet sacred-geometry arch, no people, no text), which live shows
// behind the title on the ~98 posts without their own photo, and on their
// cards. Rescued into Sanity 2026-10-07 (scripts/rescue-2026-10-07-essay-hero.ts).
export const DEFAULT_ESSAY_HERO = {
  src: "https://cdn.sanity.io/images/a3q1cyqs/production/4760c4f58f4b1672f77e32335f9a68494ea1c0a1-1200x670.webp",
  width: 1200,
  height: 670,
};
