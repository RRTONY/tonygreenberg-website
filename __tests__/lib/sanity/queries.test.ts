import { describe, expect, it } from "vitest";
import * as q from "@/lib/sanity/queries";

const queries = Object.entries(q).filter((e): e is [string, string] => typeof e[1] === "string");

describe("GROQ queries", () => {
  it("every exported query is a non-empty string with balanced brackets", () => {
    expect(queries.length).toBeGreaterThan(20);
    for (const [name, text] of queries) {
      expect(text.trim(), name).not.toBe("");
      for (const [open, close] of [["{", "}"], ["[", "]"], ["(", ")"]]) {
        expect(text.split(open).length, `${name} ${open}${close}`).toBe(text.split(close).length);
      }
    }
  });

  it("only queries the document types that exist in the schema", () => {
    const known = new Set(["post", "category", "author", "siteSettings", "pageSeo", "page", "redirect"]);
    for (const [name, text] of queries) {
      for (const m of text.matchAll(/_type == "([a-zA-Z]+)"/g)) expect(known.has(m[1]), `${name}: ${m[1]}`).toBe(true);
    }
  });

  it("post-by-slug and SEO queries take the right parameters", () => {
    expect(q.postBySlugQuery).toContain("slug.current == $slug");
    expect(q.pageSeoQuery).toContain("route == $route");
    expect(q.postsQuery).toContain("[$start...$end]");
    expect(q.postsByCategoryQuery).toContain("$categorySlug");
    expect(q.searchPostsQuery).toContain("$q");
  });

  it("the post query selects the fields the essay page renders", () => {
    for (const field of ["body", "updatedBody", "seo", "faq", "readNext", "_createdAt", "category->", "author->"]) {
      expect(q.postBySlugQuery).toContain(field);
    }
  });

  it("related and recent posts exclude the current post and cap at three", () => {
    for (const text of [q.relatedPostsQuery, q.recentPostsQuery]) {
      expect(text).toContain("slug.current != $slug");
      expect(text).toContain("[0...3]");
    }
  });

  it("redirects select source, destination and permanent", () => {
    expect(q.allRedirectsQuery).toMatch(/source, destination, permanent/);
  });

  it("thin categories are noindexed below 3 posts", () => {
    expect(q.MIN_INDEXABLE_CATEGORY_POSTS).toBe(3);
  });
});
