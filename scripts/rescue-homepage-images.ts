// One-off: rescues the homepage's hero + Four Doors images from the still-live
// legacy site (Manus /api/img/ proxy) before it's decommissioned, uploading
// each to Sanity as a plain asset. No dedicated schema slot for these yet —
// the homepage isn't Sanity-backed content (see page.tsx's own note on why) —
// so this just prints the resulting CDN URLs to hardcode into the page.
// Usage: pnpm tsx scripts/rescue-homepage-images.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const IMAGES = {
  hero: "homepage-hero-original_d3e7447d.jpg",
  door01: "door01_634cd4d4.webp",
  door02: "door02_8abcc1e9.webp",
  door03: "door03_ac43a96c.webp",
  door04: "door04_f682151b.webp",
};

async function run() {
  for (const [key, filename] of Object.entries(IMAGES)) {
    const url = `https://tonygreenberg.com/api/img/${filename}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`${key}: fetch failed (${res.status})`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename });
    console.log(`${key}: ${asset.url}`);
  }
}

run();
