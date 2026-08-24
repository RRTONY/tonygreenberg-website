import type { Express } from "express";
import sharp from "sharp";
import { ENV } from "./env";

interface CacheEntry {
  data: Buffer;
  ts: number;
}
const CACHE = new Map<string, CacheEntry>();
const CACHE_MAX = 300;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function pruneCache() {
  if (CACHE.size <= CACHE_MAX) return;
  const now = Date.now();
  Array.from(CACHE.entries()).forEach(([k, v]) => {
    if (now - v.ts > CACHE_TTL_MS) CACHE.delete(k);
  });
  if (CACHE.size > CACHE_MAX) {
    const oldest = Array.from(CACHE.entries()).sort((a, b) => a[1].ts - b[1].ts);
    oldest.slice(0, CACHE.size - CACHE_MAX).forEach(([k]) => CACHE.delete(k));
  }
}

export function registerStorageProxy(app: Express) {
  // Use /api/img/* path so the platform doesn't intercept it
  // (the platform intercepts /manus-storage/* and does a 307 redirect
  // which mobile Safari doesn't follow for <img> tags)
  app.get("/api/img/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    // Parse optional resize params: ?w=800&q=75
    const width = req.query.w ? Math.min(parseInt(req.query.w as string, 10), 1600) : 1200;
    const quality = req.query.q ? Math.min(Math.max(parseInt(req.query.q as string, 10), 10), 90) : 75;

    const cacheKey = `${key}|${width}|${quality}`;
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
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      // Fetch the actual image bytes
      const imageResp = await fetch(url);
      if (!imageResp.ok || !imageResp.body) {
        res.status(502).send("Failed to fetch image from CDN");
        return;
      }

      const rawBuffer = Buffer.from(await imageResp.arrayBuffer());

      // Resize and convert to WebP
      const webp = await sharp(rawBuffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      pruneCache();
      CACHE.set(cacheKey, { data: webp, ts: now });

      res.set("Content-Type", "image/webp");
      res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
      res.set("Access-Control-Allow-Origin", "*");
      res.set("X-Image-Cache", "MISS");
      res.send(webp);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      if (!res.headersSent) {
        res.status(502).send("Storage proxy error");
      }
    }
  });
}
