import { defineField, defineType } from "sanity";

// Lightweight, route-keyed SEO override — for the ~150 code-driven routes
// (BrewSoul, PRI/Kava, assessments, etc.) that don't have a full `page`
// document. Not a route picklist (unlike ramprate-ui's pageSeo) because this
// site has far more routes and they're still being ported.
export default defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    defineField({
      name: "route",
      title: "Route",
      type: "string",
      description: 'Exact path this overrides, e.g. "/brewsoul/quiz". Must start with "/".',
      validation: (r) =>
        r.required().custom((value) =>
          value && !value.startsWith("/") ? 'Route must start with "/"' : true,
        ),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "route", subtitle: "seo.metaTitle" } },
});
