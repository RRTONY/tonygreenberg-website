import { getDb } from "./db";
import { articleDrafts } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function getArticleDraft(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(articleDrafts)
    .where(eq(articleDrafts.articleSlug, slug))
    .orderBy(desc(articleDrafts.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllArticleDrafts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articleDrafts)
    .orderBy(desc(articleDrafts.updatedAt));
}

export async function upsertArticleDraft(
  slug: string,
  title: string,
  fields: Partial<typeof articleDrafts.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getArticleDraft(slug);
  if (existing) {
    await db
      .update(articleDrafts)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(articleDrafts.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(articleDrafts).values({
      articleSlug: slug,
      originalTitle: title,
      ...fields,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return (result as any).insertId as number;
  }
}

export async function setArticleDraftStatus(id: number, status: "approved" | "published" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(articleDrafts)
    .set({
      status,
      updatedAt: new Date(),
      ...(status === "published" ? { publishedAt: new Date() } : {}),
    })
    .where(eq(articleDrafts.id, id));
}
