/**
 * Image proxy — fetches remote images, resizes them, converts to WebP, and caches in memory.
 * Route: GET /api/img?url=<encoded>&w=<width>&q=<quality>
 *
 * Defaults: w=1200, q=75
 * Max width: 1600px (prevents abuse)
 * Cache: in-memory LRU-style map, max 200 entries, 1h TTL
 */

import { Router, Request, Response } from "express";
import sharp from "sharp";

interface CacheEntry {
  data: Buffer;
  contentType: string;
  ts: number;
}

const CACHE = new Map<string, CacheEntry>();
const CACHE_MAX = 200;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function pruneCache() {
  if (CACHE.size <= CACHE_MAX) return;
  const now = Date.now();
  // Remove expired first
  Array.from(CACHE.entries()).forEach(([k, v]) => {
    if (now - v.ts > CACHE_TTL_MS) CACHE.delete(k);
  });
  // If still over limit, remove oldest
  if (CACHE.size > CACHE_MAX) {
    const oldest = Array.from(CACHE.entries()).sort((a, b) => a[1].ts - b[1].ts);
    for (const [k] of oldest.slice(0, CACHE.size - CACHE_MAX)) {
      CACHE.delete(k);
    }
  }
}

/** Allowed origins — prevents open-proxy abuse */
const ALLOWED_ORIGINS = [
  "files.manuscdn.com",
  "d2xsxph8kpxj0f.cloudfront.net",
  "private-us-east-1.manuscdn.com",
  "images.unsplash.com",
  "manuscdn.com",
];

function isAllowedOrigin(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_ORIGINS.some((o) => hostname === o || hostname.endsWith("." + o));
  } catch {
    return false;
  }
}

export const imageProxyRouter = Router();

imageProxyRouter.get("/img", async (req: Request, res: Response) => {
  const rawUrl = req.query.url as string;
  const width = Math.min(parseInt((req.query.w as string) || "1200", 10), 1600);
  const quality = Math.min(Math.max(parseInt((req.query.q as string) || "75", 10), 10), 90);

  if (!rawUrl) {
    res.status(400).json({ error: "Missing url param" });
    return;
  }

  let url: string;
  try {
    url = decodeURIComponent(rawUrl);
    new URL(url); // validate
  } catch {
    res.status(400).json({ error: "Invalid url" });
    return;
  }

  if (!isAllowedOrigin(url)) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }

  const cacheKey = `${url}|${width}|${quality}`;
  const now = Date.now();

  const cached = CACHE.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    res.set("Content-Type", "image/webp");
    res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    res.set("X-Image-Cache", "HIT");
    res.send(cached.data);
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const upstream = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TonyGreenberg-ImageProxy/1.0" },
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream ${upstream.status}` });
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());

    const webp = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    pruneCache();
    CACHE.set(cacheKey, { data: webp, contentType: "image/webp", ts: now });

    res.set("Content-Type", "image/webp");
    res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    res.set("X-Image-Cache", "MISS");
    res.send(webp);
  } catch (err: any) {
    console.error("[ImageProxy] Error:", err?.message);
    res.status(502).json({ error: "Failed to fetch or process image" });
  }
});
