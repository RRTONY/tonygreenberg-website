// One-off: puts back the in-body images the blog migration dropped. The
// legacy markdown referenced them on the Manus host (`/api/img/`,
// `/manus-storage/`), so `migrate-blog-posts.ts` couldn't carry them over;
// `rescue-manus-media.ts` has since copied every one into Sanity
// (docs/ai/manus-media-rescue.md). For each image in a post's legacy
// markdown, this finds the paragraph that came right before it, matches
// that paragraph to a block in the Sanity body by its text, and inserts an
// image block after it with legacy's alt text.
//
// Writes **drafts only** (`drafts.<post id>`), never the published post, so
// nothing reaches the site until someone publishes the drafts in Studio.
// Re-running is safe: it always starts from the published body.
//
// Usage:
//   pnpm tsx scripts/restore-blog-body-images.ts          (dry run, prints the plan)
//   pnpm tsx scripts/restore-blog-body-images.ts --write  (creates the drafts)
import fs from "node:fs";
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

const WRITE = process.argv.includes("--write");
const SLUGS = [
  "is-that-a-lot-clarisse-abelarde",
  "you-are-the-moat",
  "frqncy-the-bus-that-restores-the-world",
  "energy-is-money-money-is-memory",
];

type Block = { _key: string; _type: string; children?: { text?: string }[]; asset?: { _ref: string } };
type LegacyPost = { slug: string; originalContent?: string; updatedContent?: string };

// Legacy file name → Sanity asset ref, read from the rescue manifest.
function loadAssetMap(): Map<string, string> {
  const manifest = fs.readFileSync(path.join(__dirname, "../docs/ai/manus-media-rescue.md"), "utf8");
  const map = new Map<string, string>();
  for (const line of manifest.split("\n")) {
    const legacy = line.match(/^\| `([^`]+)`/)?.[1];
    const url = line.match(/https:\/\/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([a-f0-9]+-\d+x\d+)\.(\w+)/);
    if (legacy && url) map.set(legacy.split("/").pop()!, `image-${url[1]}-${url[2]}`);
  }
  return map;
}

// Plain text of a markdown line, close enough to Portable Text's text to match on.
function plain(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*(#+|>|[-*]|\d+\.)\s+/, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const norm = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
const blockText = (b: Block) => (b.children ?? []).map((c) => c.text ?? "").join("");

type Planned = { file: string; alt: string; ref: string; afterKey: string; afterText: string };

async function run() {
  const assets = loadAssetMap();
  const legacy = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../_legacy-manus-app/client/src/data/blogData.json"), "utf8"),
  ) as LegacyPost[];

  for (const slug of SLUGS) {
    const post = await client.fetch<{ _id: string; body: Block[] } & Record<string, unknown>>(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
      { slug },
    );
    const source = legacy.find((p) => p.slug === slug);
    if (!post || !source) {
      console.error(`${slug}: missing in ${post ? "legacy data" : "Sanity"}, skipped`);
      continue;
    }

    const md = (source.originalContent || source.updatedContent || "").split("\n");
    const existing = new Set(post.body.filter((b) => b._type === "image").map((b) => b.asset?._ref));
    const planned: Planned[] = [];
    const problems: string[] = [];

    md.forEach((line, i) => {
      const img = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (!img) return;
      const [, alt, src] = img;
      if (!/\/api\/img\/|\/manus-storage\//.test(src)) return; // already migrated (e.g. CloudFront)
      const file = src.split("/").pop()!;
      const ref = assets.get(file);
      if (!ref) return problems.push(`${file}: not in the rescue manifest`);
      if (existing.has(ref)) return; // already in the body

      // Nearest earlier line that has real text (skipping rules and other images).
      let anchor = "";
      for (let j = i - 1; j >= 0 && !anchor; j--) {
        const t = plain(md[j]);
        if (t && t !== "---") anchor = t;
      }
      const probe = norm(anchor).slice(0, 60);
      const match = post.body.find((b) => b._type === "block" && probe && norm(blockText(b)).startsWith(probe));
      if (!match) return problems.push(`${file}: no Sanity block starts with "${anchor.slice(0, 60)}"`);
      planned.push({ file, alt, ref, afterKey: match._key, afterText: blockText(match).slice(0, 60) });
    });

    console.log(`\n${slug}: ${planned.length} to insert${problems.length ? `, ${problems.length} problem(s)` : ""}`);
    for (const p of planned) console.log(`  + ${p.file}  after "${p.afterText}"`);
    for (const p of problems) console.log(`  ! ${p}`);
    if (!WRITE || planned.length === 0) continue;

    const body: Block[] = [];
    for (const b of post.body) {
      body.push(b);
      for (const p of planned.filter((x) => x.afterKey === b._key)) {
        body.push({ _key: `rimg${body.length}${p.ref.slice(6, 12)}`, _type: "image", alt: p.alt, asset: { _type: "reference", _ref: p.ref } } as Block);
      }
    }
    const { _rev, _updatedAt, _createdAt, ...rest } = post as Record<string, unknown>;
    void _rev;
    void _updatedAt;
    void _createdAt;
    await client.createOrReplace({ ...rest, _id: `drafts.${post._id}`, _type: "post", body } as never);
    console.log(`  → saved drafts.${post._id}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
