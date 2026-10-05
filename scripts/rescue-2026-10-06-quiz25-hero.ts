// One-off (2026-10-06): rescues the hero picture live shows above the title on
// /quiz_25q ("How Well Do You Actually Understand Peptides?"). It was never
// rescued: docs/ai/archive/reference-media-manifest.md listed it as
// "reference-only, route decision required". Uploads the asset to Sanity only
// (zero-Manus-dependency rule); no document is changed. Prints the Sanity URL
// to wire into the page.
//
// Usage: pnpm tsx scripts/rescue-2026-10-06-quiz25-hero.ts [--dry-run]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const SOURCE =
  "https://tonygreenberg.com/api/img/site-097-peptide-hero-quiz-7vdCSZEoxD7WaxFumSRhqx_efc672d123_294614f3.webp";

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
  const asset = await writeClient.assets.upload("image", buffer, { filename: "peptide-quiz-25q-hero.webp" });
  console.log(`peptide-quiz-25q-hero: ${asset.url} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
