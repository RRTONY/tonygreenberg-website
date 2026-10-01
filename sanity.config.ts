import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

// Written only by the MCP server (src/lib/admin/change-sets.ts); shown
// read-only, newest first, at the bottom of the Studio menu.
const HISTORY_TYPE = "adminChange";

export default defineConfig({
  name: "tonygreenberg",
  title: "Tony Greenberg",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a3q1cyqs",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...S.documentTypeListItems().filter((item) => item.getId() !== HISTORY_TYPE),
            S.divider(),
            S.listItem()
              .title("Website change history")
              .id(HISTORY_TYPE)
              .child(
                S.documentTypeList(HISTORY_TYPE)
                  .title("Website change history")
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                  .canHandleIntent(() => false)
                  .initialValueTemplates([]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => t.schemaType !== HISTORY_TYPE),
  },

  document: {
    actions: (prev, context) => (context.schemaType === HISTORY_TYPE ? [] : prev),
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== HISTORY_TYPE),
  },
});
