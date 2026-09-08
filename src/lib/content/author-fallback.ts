// Fallback hero image for posts with no unique heroImage in Sanity.
// Legacy (blogListingData.json) reused the same author headshot as a
// generic thumbnail for every post lacking real per-article art (~98 of
// them, all pointing at the now-dead `/api/img/tony-headshot_2d63de23.jpg`
// Manus proxy path) — this is that same real photo, already safely
// re-hosted in Sanity for the About page (src/app/about/page.tsx's
// HEADSHOT), reused here rather than left as a text placeholder or a
// second Sanity upload of the identical asset.
export const AUTHOR_FALLBACK_IMAGE =
  "https://cdn.sanity.io/images/a3q1cyqs/production/adce8df75f9f9debc9faeeb90cbcbb5a9e07881a-980x1721.webp";
