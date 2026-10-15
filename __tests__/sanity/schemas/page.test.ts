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
import pageSchema from "@/sanity/schemas/page";
const page = pageSchema as unknown as Schema;

describe("page schema", () => {
  it("holds title, slug, body and seo", () => {
    expect(page).toMatchObject({ name: "page", type: "document" });
    expect(names(page)).toEqual(["title", "slug", "body", "seo"]);
    expect(field(page, "seo")?.type).toBe("seo");
  });

  it("requires title and slug", () => {
    expect(ruleNames(field(page, "title"))).toEqual(["required"]);
    expect(ruleNames(field(page, "slug"))).toEqual(["required"]);
  });

  it("body allows text blocks and images", () => {
    expect(field(page, "body")?.of?.map((o) => o.type)).toEqual(["block", "image"]);
  });
});
