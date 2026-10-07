"use client";

// Site-wide next/image loader (next.config.ts `images.loaderFile`). Every content image is on
// Sanity's image CDN (and a few BrewSoul city photos on Unsplash); both resize and pick WebP/AVIF
// themselves, so we ask them for the exact width instead of routing through /_next/image. On
// Netlify that route resized each image on first request, which cost up to 2 s on a hero
// (Lighthouse, 2026-10-08). Anything else (none today) is returned unchanged.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  const q = String(quality ?? 75);

  if (url.hostname === "cdn.sanity.io") {
    // urlFor() crops (rect + w + h) keep their aspect ratio at the new width.
    const w0 = Number(url.searchParams.get("w"));
    const h0 = Number(url.searchParams.get("h"));
    if (w0 > 0 && h0 > 0) url.searchParams.set("h", String(Math.round((width * h0) / w0)));
    // Width-only requests never upscale past the original (fit=max); crops keep their own fit.
    else if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", q);
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", q);
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  return src;
}
