// One-off (2026-10-01): rescues images the live legacy site (tonygreenberg.com)
// gained or swapped since the 2026-09-10 pass (rescue-2026-09-blog-images.ts).
// Found by loading all 163 live non-blog pages in a headless browser plus every
// live post's `og:image`, then dropping every image the legacy source or
// docs/ai/manus-media-rescue.md already names (ignoring the live host's
// "site-NNN-"/"NN-" prefixes and "_<hash>" suffixes, which are renames only).
// Each remaining image was visually checked before being listed here.
//
// Every image is uploaded to Sanity (zero-Manus-dependency rule). Only one
// document is changed, and as a **draft**: `your-blood-lies-without-your-dna`
// gets the new live hero. Builds on an existing draft if there is one. The other
// uploads are saved assets only; their Sanity URLs are printed so a page can be
// pointed at them (see NEXTJS-MIGRATION-TODO.md Phase 13, 2026-10-01).
//
// Usage: pnpm tsx scripts/rescue-2026-10-live-images.ts [--dry-run]
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

const LIVE = "https://tonygreenberg.com/api/img/";

const RESCUES: { name: string; url: string; usedOn: string; heroForSlug?: string }[] = [
  {
    name: "your-blood-lies-without-your-dna-hero",
    url: `${LIVE}blood-dna-reading-context-2026-09_92a98742.png`,
    usedOn: "/blog/your-blood-lies-without-your-dna (replaces the older shattered-vial hero)",
    heroForSlug: "your-blood-lies-without-your-dna",
  },
  { name: "find-my-hero-2026-09", url: `${LIVE}find-my-hero-repaired-2026-09_4113a6f9.png`, usedOn: "/find-my hero" },
  {
    name: "what-quest-could-fix-hero",
    url: `${LIVE}blood-dna-precision-theater-2026-09_76a6c49a.png`,
    usedOn: "/blog/what-quest-could-fix (live-only post, not imported yet)",
  },
  {
    name: "america-unbundled-age-of-ai",
    url: `${LIVE}age-of-ai-no-party_505dae33.png`,
    usedOn: "/america-unbundled, /america-unbundled-field-guide (live-only pages, not ported yet)",
  },
  {
    name: "the-letter-healing-card",
    url: `${LIVE}healing-hero-repaired-2026-09_cdf281f8.png`,
    usedOn: "/the-letter, card for When Healing Becomes Extraction",
  },
];

async function upload(url: string, name: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await writeClient.assets.upload("image", buffer, { filename: `${name}.webp` });
  return asset;
}

async function setDraftHero(slug: string, assetId: string) {
  const docs = await writeClient.fetch<Record<string, unknown>[]>(
    `*[_type == "post" && slug.current == $slug]`,
    { slug },
    { perspective: "raw" },
  );
  const post =
    docs.find((d) => String(d._id).startsWith("drafts.")) ?? docs.find((d) => !String(d._id).startsWith("drafts."));
  if (!post) throw new Error(`${slug}: no post document`);
  const baseId = String(post._id).replace(/^drafts\./, "");
  const { _rev, _createdAt, _updatedAt, ...rest } = post;
  void _rev;
  void _createdAt;
  void _updatedAt;
  await writeClient.createOrReplace({
    ...rest,
    _id: `drafts.${baseId}`,
    _type: "post",
    heroImage: { _type: "image", asset: { _type: "reference", _ref: assetId } },
  } as never);
  console.log(`  → saved drafts.${baseId} (from ${String(post._id).startsWith("drafts.") ? "existing draft" : "published"})`);
}

async function run() {
  for (const r of RESCUES) {
    if (DRY_RUN) {
      console.log(`[dry-run] would upload ${r.url} (${r.usedOn})${r.heroForSlug ? ` and set drafts heroImage` : ""}`);
      continue;
    }
    const asset = await upload(r.url, r.name);
    console.log(`${r.name}: ${asset.url}\n  used on: ${r.usedOn}`);
    if (r.heroForSlug) await setDraftHero(r.heroForSlug, asset._id);
  }
}

run();
