// One-time migration: client/src/data/blogData.json (121 legacy posts) ->
// Sanity `post` documents. Idempotent — re-running skips any post whose
// deterministic _id already exists, so it's safe to run again for newly
// added posts without touching ones already edited in Studio.
//
// Usage (from web/):
//   pnpm migrate:blog            # writes to Sanity
//   pnpm migrate:blog --dry-run  # prints what would happen, writes nothing
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

// Not importing src/lib/sanity/write-client.ts here on purpose: it's guarded
// with `import "server-only"`, which throws unconditionally outside of
// Next.js's bundler (this script runs under plain Node via tsx). A script-
// local client keeps that guard meaningful for actual app code.
import { createClient } from "next-sanity";
import { markdownToPortableText } from "./markdown-to-portable-text";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

function assertWriteClientConfigured() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is not set in web/.env.local");
  }
}

type LegacyPost = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  summary?: string;
  image?: string;
  originalContent?: string;
  updatedContent?: string;
  readTime?: string;
  keywords?: string[];
};

const LEGACY_SITE_ORIGIN = "https://tonygreenberg.com";
const AUTHOR_ID = "author-tony-greenberg";
const DRY_RUN = process.argv.includes("--dry-run");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseReadTime(raw?: string): number | undefined {
  const match = raw?.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function parsePublishedAt(raw: string): string {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    console.warn(`  ! unparseable date "${raw}", using now`);
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

// Resolves a legacy `image` field to a fetchable absolute URL, or null if
// it's the generic og-default fallback (no real image exists — Phase 13).
function resolveImageUrl(raw?: string): string | null {
  if (!raw) return null;
  if (raw.includes("og-default.jpg")) return null;
  if (raw.startsWith("/api/img/") || raw.startsWith("/manus-storage/")) {
    return `${LEGACY_SITE_ORIGIN}${raw}`;
  }
  if (/^https?:\/\//.test(raw)) return raw;
  return null;
}

async function uploadHeroImage(url: string, slug: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = `${slug}${path.extname(new URL(url).pathname) || ".jpg"}`;
  const asset = await writeClient.assets.upload("image", buffer, { filename });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

async function ensureAuthor(): Promise<string> {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{_id}`,
    { id: AUTHOR_ID },
  );
  if (existing) return existing._id;
  if (DRY_RUN) {
    console.log(`[dry-run] would create author "${AUTHOR_ID}"`);
    return AUTHOR_ID;
  }
  await writeClient.createIfNotExists({
    _id: AUTHOR_ID,
    _type: "author",
    name: "Tony Greenberg",
    slug: { _type: "slug", current: "tony-greenberg" },
  });
  return AUTHOR_ID;
}

const categoryCache = new Map<string, string>();

async function ensureCategory(title: string): Promise<string> {
  if (categoryCache.has(title)) return categoryCache.get(title)!;
  const id = `category-${slugify(title)}`;
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{_id}`,
    { id },
  );
  if (!existing && !DRY_RUN) {
    await writeClient.createIfNotExists({
      _id: id,
      _type: "category",
      title,
      slug: { _type: "slug", current: slugify(title) },
    });
  } else if (!existing) {
    console.log(`[dry-run] would create category "${title}" (${id})`);
  }
  categoryCache.set(title, id);
  return id;
}

async function migrate() {
  assertWriteClientConfigured();

  const dataPath = path.join(__dirname, "../../client/src/data/blogData.json");
  const posts: LegacyPost[] = JSON.parse(await readFile(dataPath, "utf8"));

  console.log(`Loaded ${posts.length} legacy posts from blogData.json${DRY_RUN ? " (dry run)" : ""}`);

  const authorId = await ensureAuthor();

  let created = 0;
  let skipped = 0;
  let missingImage = 0;
  const errors: string[] = [];

  for (const post of posts) {
    const docId = `post-${post.slug}`;
    try {
      const existing = await writeClient.fetch<{ _id: string } | null>(
        `*[_id == $id][0]{_id}`,
        { id: docId },
      );
      if (existing) {
        skipped += 1;
        console.log(`- ${post.slug}: already exists, skipping`);
        continue;
      }

      const categoryId = await ensureCategory(post.category || "Uncategorized");
      const imageUrl = resolveImageUrl(post.image);
      let heroImage: Awaited<ReturnType<typeof uploadHeroImage>> | undefined;
      if (imageUrl) {
        try {
          if (!DRY_RUN) heroImage = await uploadHeroImage(imageUrl, post.slug);
        } catch (err) {
          console.warn(`  ! image upload failed for ${post.slug}: ${(err as Error).message}`);
        }
      } else {
        missingImage += 1;
      }

      const doc = {
        _id: docId,
        _type: "post",
        title: post.title,
        slug: { _type: "slug", current: post.slug },
        subtitle: post.subtitle,
        excerpt: post.summary,
        author: { _type: "reference", _ref: authorId },
        category: { _type: "reference", _ref: categoryId },
        tags: post.keywords ?? [],
        publishedAt: parsePublishedAt(post.date),
        readTime: parseReadTime(post.readTime),
        body: markdownToPortableText(post.originalContent || post.updatedContent || ""),
        ...(heroImage ? { heroImage } : {}),
      };

      const imageNote = imageUrl ? "" : " (no hero image — needs sourcing)";
      if (DRY_RUN) {
        console.log(`[dry-run] would create ${docId}${imageNote}`);
      } else {
        await writeClient.create(doc);
        console.log(`+ ${post.slug}: created${imageNote}`);
      }
      created += 1;
    } catch (err) {
      const message = `${post.slug}: ${(err as Error).message}`;
      errors.push(message);
      console.error(`  ✗ ${message}`);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`created: ${created}, skipped (already existed): ${skipped}, missing hero image: ${missingImage}`);
  if (errors.length) {
    console.log(`errors: ${errors.length}`);
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exitCode = 1;
  }
}

migrate();
