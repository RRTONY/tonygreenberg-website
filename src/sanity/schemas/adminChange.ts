import { defineField, defineType } from "sanity";

// Website change history, written only by the MCP admin server
// (src/lib/admin/change-sets.ts): one record per request made through
// ChatGPT/Claude, with who asked, what changed and whether it was
// published, discarded or undone. Read-only here: sanity.config.ts removes
// every document action for this type, so nobody can edit or delete
// history from Studio. The records use dotted ids (adminChange.<key>), so
// they are never readable without a login, even though the dataset is
// public.
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  ready_for_review: "Ready for review",
  published: "Published",
  discarded: "Discarded",
};

export default defineType({
  name: "adminChange",
  title: "Website change history",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "title", title: "Change", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: Object.entries(STATUS_LABELS).map(([value, title]) => ({
          value,
          title,
        })),
      },
    }),
    defineField({
      name: "requestedBy",
      title: "Requested by",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
    }),
    defineField({
      name: "request",
      title: "What they asked for",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "summary",
      title: "Summary of the change",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "areas",
      title: "Pages and parts of the site changed",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "content",
      title: "Content changed",
      type: "array",
      of: [
        {
          type: "object",
          name: "changeContent",
          fields: [
            defineField({ name: "title", title: "Item", type: "string" }),
            defineField({ name: "type", title: "Type", type: "string" }),
            defineField({ name: "id", title: "Document id", type: "string" }),
            defineField({ name: "action", title: "Action", type: "string" }),
            defineField({ name: "beforeJson", type: "text", hidden: true }),
            defineField({ name: "publishedRev", type: "string", hidden: true }),
          ],
          preview: { select: { title: "title", subtitle: "type" } },
        },
      ],
    }),
    defineField({
      name: "beforeAfter",
      title: "Before and after",
      type: "array",
      of: [
        {
          type: "object",
          name: "changeBeforeAfter",
          fields: [
            defineField({ name: "label", title: "What", type: "string" }),
            defineField({
              name: "before",
              title: "Before",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "after",
              title: "After",
              type: "text",
              rows: 2,
            }),
          ],
          preview: { select: { title: "label", subtitle: "after" } },
        },
      ],
    }),
    defineField({ name: "createdAt", title: "Started", type: "datetime" }),
    defineField({
      name: "submittedAt",
      title: "Ready for review",
      type: "datetime",
    }),
    defineField({ name: "publishedAt", title: "Published", type: "datetime" }),
    defineField({ name: "publishedBy", title: "Published by", type: "string" }),
    defineField({ name: "discardedAt", title: "Discarded", type: "datetime" }),
    defineField({ name: "discardedBy", title: "Discarded by", type: "string" }),
    defineField({ name: "undoes", title: "Undoes change", type: "string" }),
    defineField({
      name: "undoneBy",
      title: "Undone by change",
      type: "string",
    }),
    defineField({
      name: "publishNote",
      title: "Problem while publishing",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "files",
      title: "Files (technical)",
      type: "array",
      of: [
        {
          type: "object",
          name: "changeFile",
          fields: [
            defineField({ name: "path", title: "File", type: "string" }),
            defineField({ name: "status", title: "Change", type: "string" }),
          ],
          preview: { select: { title: "path", subtitle: "status" } },
        },
      ],
    }),
    defineField({ name: "key", title: "Change id", type: "string" }),
    defineField({
      name: "branch",
      title: "Branch (technical)",
      type: "string",
    }),
    defineField({
      name: "prNumber",
      title: "GitHub pull request",
      type: "number",
    }),
    defineField({
      name: "mergeSha",
      title: "Merge commit (technical)",
      type: "string",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      who: "requestedBy.name",
      createdAt: "createdAt",
    },
    prepare({ title, status, who, createdAt }) {
      const when = createdAt ? new Date(createdAt).toLocaleDateString() : "";
      return {
        title: title || "Untitled change",
        subtitle: [STATUS_LABELS[status] ?? status, who, when]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
