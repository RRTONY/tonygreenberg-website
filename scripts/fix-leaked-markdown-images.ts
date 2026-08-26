// One-off: fixes 21 inline body-image references across 4 posts that the
// markdown->Portable-Text converter (markdown-to-portable-text.ts) never
// handled — it has no image-syntax support at all, so `![alt](url)` was
// left as literal visible paragraph text. Verified each of the 21 URLs by
// hand (see NEXTJS-MIGRATION-TODO.md's Phase 5 spot-check note): 19 are on
// dead hosts (404 — /manus-storage/, /api/img/) with nothing to recover, 2
// are still-live CloudFront URLs and get rescued into Sanity as real
// images.
//
// Usage: pnpm tsx scripts/fix-leaked-markdown-images.ts [--dry-run]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

// blockKey -> real image to rescue, for the 2 confirmed-live URLs.
const RESCUE: Record<string, { alt: string; url: string }> = {
  k6: {
    alt: "The BioFRQNCY Bus — mobile sanctuary, rolling through golden hour",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/frqncy-interior-Qnb425e6wDhZBVQyMWwoqs.webp",
  },
  k1p: {
    alt: "Community gathering — the field expanding beyond the individual",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/frqncy-community-c2MQUrHzrpiT8SbRyrzcvh.webp",
  },
};

const SLUGS = [
  "energy-is-money-money-is-memory",
  "frqncy-the-bus-that-restores-the-world",
  "is-that-a-lot-clarisse-abelarde",
  "you-are-the-moat",
];

const IMAGE_MD_RE = /!\[[^\]]*\]\([^)]+\)/;

type Span = { _key: string; _type: "span"; marks?: string[]; text: string };
type Block = {
  _key: string;
  _type: string;
  children?: Span[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  [key: string]: unknown;
};

async function rescueImage(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed (${res.status}): ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("image", buffer, { filename });
}

function usedMarkKeys(children: Span[]): Set<string> {
  const used = new Set<string>();
  for (const c of children) for (const m of c.marks || []) used.add(m);
  return used;
}

async function run() {
  for (const slug of SLUGS) {
    const post = await client.fetch<{ _id: string; body: Block[] }>(
      `*[_type=="post" && slug.current==$slug][0]{_id, body}`,
      { slug },
    );
    if (!post) {
      console.error(`MISSING POST: ${slug}`);
      continue;
    }

    const newBody: Block[] = [];
    let changed = false;

    for (const block of post.body) {
      if (block._type !== "block" || !block.children) {
        newBody.push(block);
        continue;
      }
      const imageSpanIndex = block.children.findIndex((c) => IMAGE_MD_RE.test(c.text));
      if (imageSpanIndex === -1) {
        newBody.push(block);
        continue;
      }
      changed = true;
      const imageSpan = block.children[imageSpanIndex];

      const rescue = RESCUE[block._key];
      if (rescue) {
        console.log(`[${slug}] rescuing image for block ${block._key}: ${rescue.url}`);
        if (!DRY_RUN) {
          const filename = rescue.url.split("/").pop()!;
          const asset = await rescueImage(rescue.url, filename);
          newBody.push({
            _key: `${block._key}img`,
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: rescue.alt,
          } as unknown as Block);
        } else {
          newBody.push({ _key: `${block._key}img`, _type: "image", alt: rescue.alt } as unknown as Block);
        }
        // Drop the caption spans that followed the image markdown in the
        // same block (e.g. "\n" + an italic caption) — they described the
        // now-real image inline; the image block's own `alt` carries that.
        continue;
      }

      // Dead image: strip the image span + an immediately-following
      // bare "\n" separator span, keep any real caption text after it.
      const removedKeys = new Set([imageSpan._key]);
      let spliceEnd = imageSpanIndex + 1;
      if (block.children[spliceEnd]?.text === "\n" && !block.children[spliceEnd].marks?.length) {
        removedKeys.add(block.children[spliceEnd]._key);
        spliceEnd++;
      }
      const remainingChildren = [...block.children.slice(0, imageSpanIndex), ...block.children.slice(spliceEnd)];

      if (remainingChildren.length === 0 || remainingChildren.every((c) => !c.text.trim())) {
        console.log(`[${slug}] dropping now-empty block ${block._key} (was: "${imageSpan.text.slice(0, 60)}...")`);
        continue; // drop the whole block
      }

      console.log(`[${slug}] stripping dead image markdown from block ${block._key}, caption survives`);
      const stillUsed = usedMarkKeys(remainingChildren);
      const newMarkDefs = (block.markDefs || []).filter((d) => stillUsed.has(d._key));
      newBody.push({ ...block, children: remainingChildren, markDefs: newMarkDefs });
    }

    if (!changed) continue;

    if (DRY_RUN) {
      console.log(`[${slug}] DRY RUN — would patch body (${post.body.length} -> ${newBody.length} blocks)\n`);
      continue;
    }

    await client.patch(post._id).set({ body: newBody }).commit();
    console.log(`[${slug}] patched (${post.body.length} -> ${newBody.length} blocks)\n`);
  }
}

run();
