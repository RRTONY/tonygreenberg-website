import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  // Studio opens on "All fields"; these tabs narrow the form.
  groups: [
    { name: "extras", title: "Essay extras" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({
      name: "pullQuote",
      title: "Pull Quote",
      type: "text",
      rows: 2,
      description: "Optional standout quote rendered prominently in the article body.",
    }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),
    defineField({
      name: "byline",
      title: "Byline override",
      type: "string",
      description: 'Shown after "By" under the title. Leave blank for Tony "WhyNot" Greenberg. Use for co-written essays.',
    }),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", validation: (r) => r.required() }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "datetime",
      description:
        'Set when the essay itself is meaningfully revised. Shows "Updated <date>" next to the published date (when it is more than a day later) and tells search engines the essay changed. Leave blank for small fixes.',
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      description: "Leave blank to compute automatically from body length at render time.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        { type: "dataTable" },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updatedBody",
      title: "Updated for today (optional second version)",
      type: "array",
      description:
        'Live\'s "Updated for today" rewrite. When filled, the essay shows an "Original post / Updated for today" switch; the original (Body) shows first.',
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }, { type: "dataTable" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
    defineField({
      name: "shortAnswer",
      title: "Short answer",
      type: "text",
      rows: 4,
      group: "seo",
      description: "Optional. A 2 to 3 sentence answer to the essay's main question, shown in a box near the top of the essay.",
    }),
    defineField({
      name: "faq",
      title: "Questions and answers",
      type: "array",
      group: "seo",
      description: "Optional. Shown as a visible Q&A section after the essay. Use only facts the essay itself states.",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
    }),

    // ── Essay extras: the blocks around the essay on its page (moved here
    // from src/lib/content/post-extras.ts, article-footers.ts and
    // reading-paths.ts on 2026-10-07 by a one-off script, values unchanged).
    // All optional; a block only shows when it has content.
    defineField({
      name: "formatTag",
      title: "Format tag",
      type: "string",
      group: "extras",
      description: 'Badge above the title, e.g. "The Reckoning", "The Systems Map", "The Crusade".',
    }),
    defineField({ name: "validityScore", title: "Validity score", type: "string", group: "extras", description: 'e.g. "87" (or "8.3").' }),
    defineField({ name: "validityLabel", title: "Validity label", type: "string", group: "extras", description: 'e.g. "Highly Relevant".' }),
    defineField({
      name: "editorsNote",
      title: "Editor's note (above the essay)",
      type: "object",
      group: "extras",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "Editor\'s note, September 2026"' }),
        defineField({ name: "text", title: "Note", type: "text", rows: 4 }),
        defineField({ name: "provenance", title: "Sources line", type: "string", description: "e.g. Endpoints News, November 13, 2024 · Fierce Healthcare, November 13, 2024" }),
      ],
    }),
    defineField({
      name: "provenanceNote",
      title: 'Show the "Provenance and corrections" note',
      type: "boolean",
      group: "extras",
      description: "For first-hand accounts and accusations: says how facts are sourced and where to send corrections.",
    }),
    defineField({
      name: "beforeYouRead",
      title: "Before you read (riddle above the essay)",
      type: "object",
      group: "extras",
      fields: [
        defineField({ name: "question", title: "Question", type: "text", rows: 2 }),
        defineField({ name: "answer", title: "Answer (shown on Reveal)", type: "text", rows: 3 }),
        defineField({ name: "hint", title: "Hint", type: "text", rows: 2 }),
      ],
    }),
    defineField({ name: "lesson", title: "The Lesson", type: "text", rows: 3, group: "extras" }),
    defineField({ name: "nextSteps", title: "Next steps", type: "array", of: [{ type: "string" }], group: "extras" }),
    defineField({
      name: "voices",
      title: "Voices in this space",
      type: "array",
      group: "extras",
      of: [
        {
          type: "object",
          name: "voice",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Role", type: "string" }),
            defineField({ name: "relevance", title: "Why they matter here", type: "string" }),
            defineField({ name: "url", title: "Link", type: "url" }),
          ],
          preview: { select: { title: "name", subtitle: "title" } },
        },
      ],
    }),
    defineField({ name: "alsoInvolves", title: "Also involves", type: "array", of: [{ type: "string" }], group: "extras", options: { layout: "tags" } }),
    defineField({
      name: "sinceWritten",
      title: "Since this was written",
      type: "object",
      group: "extras",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "source", title: "Source", type: "string" }),
        defineField({ name: "year", title: "Year or date", type: "string" }),
        defineField({ name: "url", title: "Link", type: "url" }),
        defineField({ name: "connection", title: "How it connects", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "tryThis",
      title: "Try this (exercise)",
      type: "object",
      group: "extras",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({ name: "steps", title: "Steps (optional)", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({
      name: "whereThisLeads",
      title: "Where this leads",
      type: "array",
      group: "extras",
      description: 'Starts with "Related idea:", "Go deeper:" or "Do something:" to pick the badge; anything else shows "Continue".',
      of: [
        {
          type: "object",
          name: "leadLink",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link (a path like /blog/some-essay)", type: "string", validation: (r) => r.required() }),
            defineField({ name: "reason", title: "Reason", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "videoMoment",
      title: "Video moment",
      type: "object",
      group: "extras",
      description: 'A video shown after "Did this land?" (legacy ArticleVideo).',
      fields: [
        defineField({ name: "file", title: "Video file", type: "file", options: { accept: "video/*" } }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineField({ name: "closingRiddle", title: "A riddle to carry with you", type: "text", rows: 3, group: "extras" }),
    defineField({
      name: "goDeeper",
      title: "Go deeper (reading list)",
      type: "array",
      group: "extras",
      of: [
        {
          type: "object",
          name: "goDeeperItem",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "Link", type: "url" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "readNext",
      title: "The thread continues (read next)",
      type: "array",
      group: "extras",
      description: "Up to 3 essays, each with the reason it belongs next. Empty: 3 recent essays from the same category.",
      validation: (r) => r.max(3),
      of: [
        {
          type: "object",
          name: "readNextItem",
          fields: [
            defineField({ name: "post", title: "Essay", type: "reference", to: [{ type: "post" }], validation: (r) => r.required() }),
            defineField({ name: "reason", title: "Reason", type: "string" }),
          ],
          preview: { select: { title: "post.title", subtitle: "reason" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "heroImage" },
  },
});
