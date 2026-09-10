import { execFileSync } from "node:child_process";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import {
  contentAuthors,
  contentCategories,
  contentPosts,
  type PortableTextBlock,
} from "../drizzle/schema";
import { markdownToPortableText } from "./markdown-to-portable-text";

const LEGACY_DATA_REF = "3ca12cbf2f80d9c862a47e7cd4571cd60b159f0c";
const LEGACY_DATA_PATH = "client/src/data/blogData.json";
const LEGACY_SITE_ORIGIN = "https://tonygreenberg.com";
const DRY_RUN = process.argv.includes("--dry-run");
const REFRESH_EXISTING = process.argv.includes("--refresh-existing");

type LegacyPost = {
  category?: string;
  date: string;
  image?: string;
  keywords?: string[];
  originalContent?: string;
  readTime?: string;
  slug: string;
  subtitle?: string;
  summary?: string;
  title: string;
  updatedContent?: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseReadTime(value?: string): number | undefined {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function parsePublishedAt(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Post has an invalid publication date: ${value}`);
  }
  return parsed;
}

function resolveLegacyImageUrl(value?: string): string | undefined {
  if (!value || value.includes("og-default.jpg")) return undefined;
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("/api/img/")) return `${LEGACY_SITE_ORIGIN}${value}`;
  return undefined;
}

function readLegacyPosts(): LegacyPost[] {
  const raw = execFileSync("git", ["show", `${LEGACY_DATA_REF}:${LEGACY_DATA_PATH}`], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(raw) as LegacyPost[];
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const posts = readLegacyPosts();
  const pool = mysql.createPool(databaseUrl);
  const db = drizzle({ client: pool });
  console.log(`Loaded ${posts.length} historic posts${DRY_RUN ? " (dry run)" : ""}.`);

  try {
    const authorSlug = "tony-greenberg";
    const existingAuthor = await db
      .select({ id: contentAuthors.id })
      .from(contentAuthors)
      .where(eq(contentAuthors.slug, authorSlug))
      .limit(1);

    let authorId = existingAuthor[0]?.id;
    if (!authorId && !DRY_RUN) {
      const createdAuthor = await db.insert(contentAuthors).values({
        name: "Tony Greenberg",
        slug: authorSlug,
      });
      authorId = Number(createdAuthor[0].insertId);
    }

    if (!authorId) {
      console.log("[dry-run] would create author Tony Greenberg.");
      authorId = 1;
    }

    const categoryIds = new Map<string, number>();
    let inserted = 0;
    let skipped = 0;
    let refreshed = 0;

    for (const post of posts) {
      if (!post.slug || !post.title) {
        console.warn("Skipping an invalid source record without a title or slug.");
        continue;
      }

      const categoryTitle = post.category || "Uncategorized";
      const categorySlug = slugify(categoryTitle);
      let categoryId = categoryIds.get(categorySlug);

      if (!categoryId) {
        const existingCategory = await db
          .select({ id: contentCategories.id })
          .from(contentCategories)
          .where(eq(contentCategories.slug, categorySlug))
          .limit(1);
        categoryId = existingCategory[0]?.id;

        if (!categoryId && !DRY_RUN) {
          const createdCategory = await db.insert(contentCategories).values({
            title: categoryTitle,
            slug: categorySlug,
          });
          categoryId = Number(createdCategory[0].insertId);
        }

        if (!categoryId) categoryId = 1;
        categoryIds.set(categorySlug, categoryId);
      }

      const existingPost = await db
        .select({ id: contentPosts.id })
        .from(contentPosts)
        .where(eq(contentPosts.slug, post.slug))
        .limit(1);

      if (existingPost[0]) {
        if (REFRESH_EXISTING && !DRY_RUN) {
          await db
            .update(contentPosts)
            .set({ readTime: parseReadTime(post.readTime) ?? null })
            .where(eq(contentPosts.id, existingPost[0].id));
          refreshed += 1;
          continue;
        }
        skipped += 1;
        continue;
      }

      const imageUrl = resolveLegacyImageUrl(post.image);
      const body = markdownToPortableText(
        post.originalContent || post.updatedContent || "",
      ) as PortableTextBlock[];

      if (DRY_RUN) {
        inserted += 1;
        continue;
      }

      await db.insert(contentPosts).values({
        title: post.title,
        subtitle: post.subtitle,
        slug: post.slug,
        excerpt: post.summary,
        body,
        tags: post.keywords ?? [],
        heroImageUrl: imageUrl,
        heroImageAlt: imageUrl ? post.title : undefined,
        metaTitle: post.title,
        metaDescription: post.summary,
        ogImageUrl: imageUrl,
        publishedAt: parsePublishedAt(post.date),
        readTime: parseReadTime(post.readTime),
        authorId,
        categoryId,
      });
      inserted += 1;
    }

    console.log(
      `Import complete. Inserted: ${inserted}; refreshed: ${refreshed}; skipped: ${skipped}; categories: ${categoryIds.size}.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Managed content import failed:", error);
  process.exitCode = 1;
});
