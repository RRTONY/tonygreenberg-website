// One-off (2026-10-07): rescues live's default essay hero, the gold and violet
// sacred-geometry arch (tonygreenberg.com/og-default.jpg, really a 1200x670
// WebP) that live shows behind the title on the ~98 posts without their own
// photo, and on their cards. Uploads the asset to Sanity only (zero-Manus
// rule); no document is changed. Prints the Sanity URL to wire into
// src/lib/content/default-image.ts (DEFAULT_ESSAY_HERO).
//
// Usage: pnpm tsx scripts/rescue-2026-10-07-essay-hero.ts [--dry-run]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const SOURCE = "https://tonygreenberg.com/og-default.jpg";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  if (DRY_RUN) {
    console.log(`[dry-run] would upload ${SOURCE}`);
    return;
  }
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`${res.status} fetching ${SOURCE}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await writeClient.assets.upload("image", buffer, {
    filename: "essay-hero-default.webp",
    title: "Default essay hero: gold and violet sacred-geometry arch",
  });
  console.log(`essay-hero-default: ${asset.url} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
