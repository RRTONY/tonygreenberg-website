import { defineField, defineType } from "sanity";

// Backs the Manus → Next.js 301 redirect map (NEXTJS-MIGRATION-TODO.md, Phase 12).
// Read at build/request time to generate next.config.ts-style redirects without
// a code deploy for every URL change.
export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "source",
      title: "From path",
      type: "string",
      description: 'e.g. "/old-page". Must start with "/".',
      validation: (r) =>
        r.required().custom((value) =>
          value && !value.startsWith("/") ? 'Path must start with "/"' : true,
        ),
    }),
    defineField({
      name: "destination",
      title: "To path or URL",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      initialValue: true,
      description: "Off = temporary (307/302) redirect.",
    }),
  ],
  preview: {
    select: { source: "source", destination: "destination" },
    prepare({ source, destination }) {
      return { title: source, subtitle: `→ ${destination}` };
    },
  },
});
