import { defineField, defineType } from "sanity";

// A plain table inside a post body. Added 2026-10-01: 18 legacy posts had
// markdown tables that the migration's markdown converter dropped (it had no
// table case), and live still shows them. Cells are plain text; the first row
// is the header row. No plugin, so no new dependency.
export default defineType({
  name: "dataTable",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "rows",
      title: "Rows",
      description: "The first row is the header.",
      type: "array",
      of: [
        {
          type: "object",
          name: "row",
          fields: [defineField({ name: "cells", title: "Cells", type: "array", of: [{ type: "string" }] })],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }: { cells?: string[] }) => ({ title: (cells ?? []).join(" | ") }),
          },
        },
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { rows: "rows" },
    prepare: ({ rows }: { rows?: { cells?: string[] }[] }) => ({
      title: `Table: ${(rows?.[0]?.cells ?? []).join(" | ")}`,
      subtitle: `${Math.max((rows?.length ?? 1) - 1, 0)} rows`,
    }),
  },
});
