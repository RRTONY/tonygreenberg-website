import { relations } from "drizzle-orm";
import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
};

export type PortableTextMarkDef = {
  _key: string;
  _type: "link";
  href: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: "block";
  children: PortableTextSpan[];
  level?: number;
  listItem?: "bullet" | "number";
  markDefs: PortableTextMarkDef[];
  style: string;
};

export const contentAuthors = mysqlTable(
  "content_authors",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    avatarUrl: varchar("avatarUrl", { length: 2048 }),
    bio: text("bio"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("content_authors_slug_unique").on(table.slug)],
);

export const contentCategories = mysqlTable(
  "content_categories",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 191 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("content_categories_slug_unique").on(table.slug)],
);

export const contentPosts = mysqlTable(
  "content_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    slug: varchar("slug", { length: 191 }).notNull(),
    excerpt: text("excerpt"),
    pullQuote: text("pullQuote"),
    readTime: int("readTime"),
    body: json("body").$type<PortableTextBlock[]>().notNull(),
    tags: json("tags").$type<string[]>().notNull(),
    heroImageUrl: varchar("heroImageUrl", { length: 2048 }),
    heroImageAlt: text("heroImageAlt"),
    heroImageWidth: int("heroImageWidth"),
    heroImageHeight: int("heroImageHeight"),
    metaTitle: varchar("metaTitle", { length: 191 }),
    metaDescription: text("metaDescription"),
    ogImageUrl: varchar("ogImageUrl", { length: 2048 }),
    noIndex: mysqlEnum("noIndex", ["true", "false"]).default("false").notNull(),
    publishedAt: timestamp("publishedAt").notNull(),
    sourceUpdatedAt: timestamp("sourceUpdatedAt"),
    authorId: int("authorId")
      .notNull()
      .references(() => contentAuthors.id),
    categoryId: int("categoryId")
      .notNull()
      .references(() => contentCategories.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_posts_slug_unique").on(table.slug),
    index("content_posts_published_at_idx").on(table.publishedAt),
    index("content_posts_category_published_idx").on(table.categoryId, table.publishedAt),
  ],
);

export const newsletterSubscriptionStatuses = [
  "pending",
  "delivered",
  "provider_unavailable",
  "provider_failed",
] as const;

export const newsletterSubscriptions = mysqlTable(
  "newsletter_subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    firstName: varchar("firstName", { length: 191 }),
    source: varchar("source", { length: 191 }).notNull(),
    consentedAt: timestamp("consentedAt").defaultNow().notNull(),
    deliveryStatus: mysqlEnum("deliveryStatus", newsletterSubscriptionStatuses)
      .default("pending")
      .notNull(),
    deliveredAt: timestamp("deliveredAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("newsletter_subscriptions_email_unique").on(table.email)],
);

export const visitorStates = mysqlTable(
  "visitor_states",
  {
    id: int("id").autoincrement().primaryKey(),
    visitorId: varchar("visitorId", { length: 64 }).notNull(),
    namespace: varchar("namespace", { length: 64 }).notNull(),
    value: json("value").$type<Record<string, unknown>>().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("visitor_states_visitor_namespace_unique").on(table.visitorId, table.namespace),
    index("visitor_states_expires_at_idx").on(table.expiresAt),
  ],
);

export const contentAuthorsRelations = relations(contentAuthors, ({ many }) => ({
  posts: many(contentPosts),
}));

export const contentCategoriesRelations = relations(contentCategories, ({ many }) => ({
  posts: many(contentPosts),
}));

export const contentPostsRelations = relations(contentPosts, ({ one }) => ({
  author: one(contentAuthors, {
    fields: [contentPosts.authorId],
    references: [contentAuthors.id],
  }),
  category: one(contentCategories, {
    fields: [contentPosts.categoryId],
    references: [contentCategories.id],
  }),
}));
