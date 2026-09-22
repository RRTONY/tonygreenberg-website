import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { contentPosts } from "../drizzle/schema";
import {
  GRATITUDE_IN_ACTION_MARKDOWN,
  GRATITUDE_IN_ACTION_REVISION,
} from "../src/lib/content/gratitude-in-action-revision";
import { markdownToPortableText } from "./markdown-to-portable-text";

const SLUG = "gratitude-in-action";
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const pool = mysql.createPool(databaseUrl);
  const db = drizzle({ client: pool });

  try {
    const existing = await db
      .select({ id: contentPosts.id, publishedAt: contentPosts.publishedAt })
      .from(contentPosts)
      .where(eq(contentPosts.slug, SLUG))
      .limit(1);

    if (!existing[0]) {
      throw new Error(`The ${SLUG} editorial record was not found.`);
    }

    if (DRY_RUN) {
      console.log(
        `[dry-run] would revise ${SLUG} while preserving the original publication date: ${existing[0].publishedAt.toISOString()}.`,
      );
      return;
    }

    await db
      .update(contentPosts)
      .set({
        body: markdownToPortableText(GRATITUDE_IN_ACTION_MARKDOWN),
        excerpt: GRATITUDE_IN_ACTION_REVISION.excerpt,
        metaDescription: GRATITUDE_IN_ACTION_REVISION.metaDescription,
        metaTitle: GRATITUDE_IN_ACTION_REVISION.metaTitle,
        pullQuote: GRATITUDE_IN_ACTION_REVISION.pullQuote,
        readTime: GRATITUDE_IN_ACTION_REVISION.readTime,
        sourceUpdatedAt: new Date(),
        subtitle: GRATITUDE_IN_ACTION_REVISION.subtitle,
        title: GRATITUDE_IN_ACTION_REVISION.title,
      })
      .where(eq(contentPosts.id, existing[0].id));

    console.log(
      `Revised ${SLUG} while preserving the original publication date: ${existing[0].publishedAt.toISOString()}.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Gratitude in Action revision failed:", error);
  process.exitCode = 1;
});
