// One-off: rescues real, unique hero images that appeared on the still-live
// legacy site (tonygreenberg.com, back up as of this pass after an earlier
// pass recorded it as permanently down) for posts that were migrated into
// Sanity (Phase 5) without one. Found by diffing every BLOG-IMAGE-BRIEFS.md
// slug's live `og:image` against the shared generic fallback
// (tony-headshot_2d63de23.jpg) — these 7 are the ones that came back with
// real, unique, on-theme art instead of the fallback (visually verified
// before writing this list; one 8th candidate, `tony-og-default-repaired-*`
// on `the-molecule-as-mirror-from-substance-to-service`, was a generic
// branded template image unrelated to that post's actual content and was
// deliberately excluded rather than mis-assigned as unique hero art).
//
// Two of the four Manus-hosted URLs are `/api/img/` (rescued here per the
// zero-Manus-dependency rule — download once, host in Sanity, never
// reference the Manus URL from code/content); the 3 Unsplash + 1 CloudFront
// URLs aren't Manus, but this repo's own rule is that every content image
// lives in Sanity, not hotlinked from a third party, so all 7 are uploaded
// the same way.
//
// Usage: pnpm tsx scripts/rescue-2026-09-blog-images.ts [--dry-run]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const RESCUES: { slug: string; url: string }[] = [
  { slug: "california-toll-roads-legalized-scam", url: "https://tonygreenberg.com/api/img/tollbooth-hero-repaired-2026-09_7ba40434.png" },
  { slug: "the-1000-hour-hold", url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80" },
  { slug: "conscious-capital-partnership-ecosystem", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80" },
  { slug: "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine", url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200" },
  { slug: "clear-communication", url: "https://tonygreenberg.com/api/img/clear-communication-hero-2026-09_31df950f.png" },
  { slug: "building-services-market-transhuman-era", url: "https://tonygreenberg.com/api/img/transhuman-services-market-hero-2026-09_013fa3d8.png" },
  {
    slug: "heart-protocol-addendum",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/when-healing-hero-FEiKS3iCJcSfUDNrR6wwXm.webp",
  },
];

async function uploadHeroImage(url: string, slug: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = `${slug}${path.extname(new URL(url).pathname) || ".jpg"}`;
  const asset = await writeClient.assets.upload("image", buffer, { filename });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

async function run() {
  for (const { slug, url } of RESCUES) {
    const docId = `post-${slug}`;
    const existing = await writeClient.fetch<{ _id: string; heroImage?: unknown } | null>(
      `*[_id == $id][0]{_id, heroImage}`,
      { id: docId },
    );
    if (!existing) {
      console.error(`${slug}: no post document at ${docId} — skipping`);
      continue;
    }
    if (existing.heroImage) {
      console.log(`${slug}: already has a heroImage — skipping`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[dry-run] would upload ${url} -> ${docId}.heroImage`);
      continue;
    }
    const heroImage = await uploadHeroImage(url, slug);
    await writeClient.patch(docId).set({ heroImage }).commit();
    console.log(`${slug}: heroImage set (${heroImage.asset._ref})`);
  }
}

run();
