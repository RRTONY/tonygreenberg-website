import { describe, expect, it, vi } from "vitest";

vi.mock("sanity", () => ({ defineType: <T,>(x: T) => x, defineField: <T,>(x: T) => x }));

type Field = { name: string; type: string; validation?: (r: unknown) => unknown; fields?: Field[]; of?: { type: string; name?: string; fields?: Field[] }[]; [k: string]: unknown };
type Schema = { name: string; type: string; fields: Field[]; preview?: { prepare?: (v: Record<string, unknown>) => { title?: string; subtitle?: string } }; [k: string]: unknown };

// Runs a field's validation against a recording rule and returns the calls.
function rules(field: Field | undefined): [string, unknown[]][] {
  const calls: [string, unknown[]][] = [];
  const rule: unknown = new Proxy({}, { get: (_t, key) => (...args: unknown[]) => (calls.push([String(key), args]), rule) });
  field?.validation?.(rule);
  return calls;
}
const ruleNames = (f: Field | undefined) => rules(f).map(([n]) => n);
const custom = (f: Field | undefined) => rules(f).find(([n]) => n === "custom")?.[1][0] as (v: unknown) => unknown;
const field = (s: { fields?: Field[] }, name: string) => s.fields?.find((f) => f.name === name);
const names = (s: { fields?: Field[] }) => (s.fields ?? []).map((f) => f.name);
void custom; void ruleNames; void names; void rules;
import postSchema from "@/sanity/schemas/post";
const post = postSchema as unknown as Schema;
const inner = (f: Field | undefined, i = 0) => f?.of?.[i] as unknown as { fields: Field[]; name: string };

describe("post schema", () => {
  it("is the blog post document with SEO and extras groups", () => {
    expect(post).toMatchObject({ name: "post", type: "document" });
    expect((post.groups as { name: string }[]).map((g) => g.name)).toEqual(["extras", "seo"]);
  });

  it("requires title, slug, hero image, publishedAt and body", () => {
    const required = post.fields.filter((f) => ruleNames(f).includes("required")).map((f) => f.name);
    expect(required).toEqual(["title", "slug", "heroImage", "publishedAt", "body"]);
  });

  it("has every field postBySlugQuery selects", () => {
    for (const name of ["subtitle", "excerpt", "pullQuote", "author", "byline", "category", "tags", "lastUpdated", "readTime", "updatedBody", "seo", "shortAnswer", "faq", "formatTag", "validityScore", "validityLabel", "editorsNote", "provenanceNote", "beforeYouRead", "lesson", "nextSteps", "voices", "alsoInvolves", "sinceWritten", "tryThis", "whereThisLeads", "videoMoment", "closingRiddle", "goDeeper", "readNext"]) {
      expect(field(post, name), name).toBeDefined();
    }
  });

  it("references point at author, category and post", () => {
    expect(field(post, "author")).toMatchObject({ type: "reference", to: [{ type: "author" }] });
    expect(field(post, "category")).toMatchObject({ type: "reference", to: [{ type: "category" }] });
    expect(inner(field(post, "readNext")).fields[0]).toMatchObject({ name: "post", type: "reference", to: [{ type: "post" }] });
  });

  it("both bodies allow blocks, images and tables", () => {
    for (const name of ["body", "updatedBody"]) expect(field(post, name)?.of?.map((o) => o.type)).toEqual(["block", "image", "dataTable"]);
  });

  it("readNext is capped at three and each item needs a post", () => {
    expect(rules(field(post, "readNext"))).toEqual([["max", [3]]]);
    expect(ruleNames(inner(field(post, "readNext")).fields[0])).toEqual(["required"]);
  });

  it("FAQ items need a question and an answer; lead links need a title and href", () => {
    expect(inner(field(post, "faq")).fields.map((f) => [f.name, ruleNames(f)])).toEqual([
      ["question", ["required"]],
      ["answer", ["required"]],
    ]);
    const lead = inner(field(post, "whereThisLeads")).fields;
    expect(lead.filter((f) => ruleNames(f).includes("required")).map((f) => f.name)).toEqual(["title", "href"]);
  });

  it("SEO fields sit in the seo group", () => {
    expect(["seo", "shortAnswer", "faq"].map((n) => field(post, n)?.group)).toEqual(["seo", "seo", "seo"]);
  });
});

describe("post schema: voices and reading list need their key field", () => {
  it("a voice needs a name; other voice fields are optional", () => {
    const voice = inner(field(post, "voices"));
    expect(voice.name).toBe("voice");
    expect(voice.fields.map((f) => [f.name, ruleNames(f)])).toEqual([
      ["name", ["required"]],
      ["title", []],
      ["relevance", []],
      ["url", []],
    ]);
  });

  it("a go-deeper item needs a title; link and description are optional", () => {
    const item = inner(field(post, "goDeeper"));
    expect(item.name).toBe("goDeeperItem");
    expect(item.fields.map((f) => [f.name, ruleNames(f)])).toEqual([
      ["title", ["required"]],
      ["url", []],
      ["description", []],
    ]);
  });
});
