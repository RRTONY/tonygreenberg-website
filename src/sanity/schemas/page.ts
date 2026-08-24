import { defineField, defineType } from "sanity";

// Editorial copy for a marketing page. The page's layout/structure lives in
// the Next.js component (client/src/pages/*.tsx source of truth during
// migration) — this schema only holds the text an editor should be able to
// change without a code deploy, plus SEO metadata.
export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      description: "Path this content is rendered at, e.g. \"about\" for /about.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
