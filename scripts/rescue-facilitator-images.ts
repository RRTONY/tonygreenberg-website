// One-off: rescues /facilitator-index's two in-body diagrams (the twelve
// bands, the facilitator compass) from the still-live legacy site (Manus
// /api/img/ proxy) before it's decommissioned, uploading each to Sanity as a
// plain asset. Same pattern as rescue-homepage-images.ts — the page isn't
// Sanity-backed content, so this prints the CDN URLs to hardcode.
// Filenames came from the legacy FacilitatorIndex.tsx image references.
// Usage: pnpm tsx scripts/rescue-facilitator-images.ts
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
  bands: "facilitator-bands_93368783.jpg",
  compass: "facilitator-compass_fb5f9a0c.jpg",
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
    // The proxy serves WebP bytes under a .jpg name — upload under the
    // truthful extension so Sanity records the right format.
    const asset = await client.assets.upload("image", buffer, { filename: filename.replace(/\.jpg$/, ".webp") });
    console.log(`${key}: ${asset.url}`);
  }
}

run();
