/**
 * Responsive image utilities for tonygreenberg.com
 *
 * All external images are routed through /api/img-ext?url=...&w=...&q=...
 * which resizes them server-side to WebP via Sharp, cutting load from ~5MB to ~80-150KB.
 *
 * Internal /api/img/* (manus-storage) images are also proxied through Sharp.
 *
 * Unsplash images use their native ?w= param for srcset (no proxy needed).
 */

/** Widths to generate for srcset */
const SRCSET_WIDTHS = [400, 800, 1200, 1600] as const;

/** Card images only need smaller sizes */
const CARD_WIDTHS = [300, 600, 900] as const;

/**
 * Build a proxy URL for an external image.
 * /api/img-ext?url=<encoded>&w=<width>&q=<quality>
 */
function proxyUrl(src: string, width: number, quality = 75): string {
  return `/api/img?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Build a srcset string routing through the image proxy.
 */
function proxySrcSet(src: string, widths: readonly number[], quality = 75): string {
  return widths.map((w) => `${proxyUrl(src, w, quality)} ${w}w`).join(", ");
}

/**
 * Build a srcset string for Unsplash images (native resize support).
 */
function unsplashSrcSet(url: string): string {
  const base = url.replace(/[?&]w=\d+/, "").replace(/\?&/, "?").replace(/&&/, "&");
  const separator = base.includes("?") ? "&" : "?";
  return SRCSET_WIDTHS.map((w) => `${base}${separator}w=${w} ${w}w`).join(", ");
}

/**
 * Return the appropriate sizes attribute for a given image role.
 */
export type ImageRole = "hero" | "section" | "card" | "thumbnail" | "avatar";

export function imageSizes(role: ImageRole): string {
  switch (role) {
    case "hero":
      return "100vw";
    case "section":
      return "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px";
    case "card":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    case "thumbnail":
      return "(max-width: 640px) 72px, 80px";
    case "avatar":
      return "36px";
  }
}

/**
 * Returns srcSet and sizes props for an image, routing through the resize proxy.
 *
 * - Unsplash: native ?w= srcset, no proxy
 * - /api/img/* (manus-storage): already proxied, just add sizes
 * - All other external URLs: route through /api/img-ext proxy with full srcset
 */
export function responsiveImageProps(
  src: string,
  role: ImageRole,
  quality = 75,
): { src?: string; srcSet?: string; sizes: string } {
  if (!src) return { sizes: imageSizes(role) };

  const sizes = imageSizes(role);
  const widths = role === "card" ? CARD_WIDTHS : SRCSET_WIDTHS;

  // Unsplash — use native resize
  if (src.includes("unsplash.com")) {
    const srcSet = unsplashSrcSet(src);
    return srcSet ? { srcSet, sizes } : { sizes };
  }

  // Already a manus-storage proxy path — add resize params to the src
  if (src.startsWith("/api/img/")) {
    const defaultWidth = role === "hero" ? 1200 : role === "card" ? 600 : 900;
    const proxied = `${src}?w=${defaultWidth}&q=${quality}`;
    // Build srcset by appending different w params
    const srcSet = widths
      .map((w) => `${src}?w=${w}&q=${quality} ${w}w`)
      .join(", ");
    return { src: proxied, srcSet, sizes };
  }

  // Local /manus-storage/ path — route through /api/img/* proxy
  if (src.startsWith("/manus-storage/")) {
    const key = src.replace("/manus-storage/", "");
    const apiBase = `/api/img/${key}`;
    const defaultWidth = role === "hero" ? 1200 : role === "card" ? 600 : 900;
    const proxied = `${apiBase}?w=${defaultWidth}&q=${quality}`;
    const srcSet = widths
      .map((w) => `${apiBase}?w=${w}&q=${quality} ${w}w`)
      .join(", ");
    return { src: proxied, srcSet, sizes };
  }

  // External URLs (manuscdn, cloudfront, etc.) — route through proxy
  if (src.startsWith("http")) {
    const defaultWidth = role === "hero" ? 1200 : role === "card" ? 600 : 900;
    const proxied = proxyUrl(src, defaultWidth, quality);
    const srcSet = proxySrcSet(src, widths, quality);
    return { src: proxied, srcSet, sizes };
  }

  // Fallback — return as-is
  return { sizes };
}
