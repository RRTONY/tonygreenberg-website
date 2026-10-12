// One-off (2026-10-13, owner said yes): uploads the generated essay hero art
// (scripts/generate-essay-hero-art.mjs, one `<slug>.jpg` per post) to Sanity and
// sets it as the post's heroImage, as a **draft**, so nothing changes on the
// site until someone publishes in Studio. Skips any post that already has its
// own heroImage (draft or published), so real art is never replaced. Builds on
// an existing draft if there is one (same as rescue-2026-10-live-images.ts).
//
// --publish (owner said yes, 2026-10-13): publishes those drafts instead, like
// Studio's Publish button (draft copied over the published post, draft removed).
// Only drafts whose sole difference from the published post is heroImage, so no
// other unreviewed edit goes live with them.
//
// Usage: pnpm tsx scripts/upload-essay-hero-art-2026-10-13.ts <dir> [--dry-run | --publish]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLISH = process.argv.includes("--publish");
const dir = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!dir) throw new Error("Usage: upload-essay-hero-art-2026-10-13.ts <dir> [--dry-run | --publish]");

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type Post = Record<string, unknown> & { _id: string; heroImage?: { asset?: { _ref?: string } } };

const META = ["_id", "_rev", "_createdAt", "_updatedAt", "heroImage"];

async function publish(slugs: string[]) {
  const counts = { published: 0, skipped: 0 };
  for (const slug of slugs) {
    const docs = await writeClient.fetch<Post[]>(`*[_type == "post" && slug.current == $slug]`, { slug }, { perspective: "raw" });
    const draft = docs.find((d) => d._id.startsWith("drafts."));
    const live = docs.find((d) => !d._id.startsWith("drafts."));
    if (!draft || !live) {
      console.log(`skip    ${slug}: ${draft ? "no published post" : "no draft"}`);
      counts.skipped++;
      continue;
    }
    const keys = new Set([...Object.keys(draft), ...Object.keys(live)].filter((k) => !META.includes(k)));
    const other = [...keys].filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(live[k]));
    if (other.length) {
      console.log(`skip    ${slug}: draft also changes ${other.join(", ")}`);
      counts.skipped++;
      continue;
    }
    const { _rev, _createdAt, _updatedAt, ...rest } = draft;
    void _rev;
    void _createdAt;
    void _updatedAt;
    await writeClient
      .transaction()
      .createOrReplace({ ...rest, _id: live._id } as never)
      .delete(draft._id)
      .commit();
    console.log(`publish ${slug}`);
    counts.published++;
  }
  console.log(counts);
}

async function run() {
  const files = fs.readdirSync(dir!).filter((f) => f.endsWith(".jpg")).sort();
  if (PUBLISH) return publish(files.map((f) => f.replace(/\.jpg$/, "")));
  const counts = { set: 0, hasArt: 0, missing: 0 };
  for (const file of files) {
    const slug = file.replace(/\.jpg$/, "");
    const docs = await writeClient.fetch<Post[]>(`*[_type == "post" && slug.current == $slug]`, { slug }, { perspective: "raw" });
    if (!docs.length) {
      console.log(`MISSING ${slug}: no post document`);
      counts.missing++;
      continue;
    }
    const withArt = docs.find((d) => d.heroImage?.asset?._ref);
    if (withArt) {
      console.log(`skip    ${slug}: already has ${withArt.heroImage!.asset!._ref} on ${withArt._id}`);
      counts.hasArt++;
      continue;
    }
    const post = docs.find((d) => d._id.startsWith("drafts.")) ?? docs[0];
    const baseId = post._id.replace(/^drafts\./, "");
    if (DRY_RUN) {
      console.log(`[dry]   ${slug}: would set heroImage on drafts.${baseId}`);
      counts.set++;
      continue;
    }
    const asset = await writeClient.assets.upload("image", fs.readFileSync(path.join(dir!, file)), {
      filename: `essay-hero-${slug}.jpg`,
    });
    const { _rev, _createdAt, _updatedAt, ...rest } = post;
    void _rev;
    void _createdAt;
    void _updatedAt;
    await writeClient.createOrReplace({
      ...rest,
      _id: `drafts.${baseId}`,
      _type: "post",
      heroImage: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    } as never);
    console.log(`set     ${slug}: drafts.${baseId} <- ${asset._id}`);
    counts.set++;
  }
  console.log(counts);
}

run();
