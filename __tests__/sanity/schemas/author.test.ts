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
import authorSchema from "@/sanity/schemas/author";
const author = authorSchema as unknown as Schema;

describe("author schema", () => {
  it("is a document with name, slug, avatar and bio", () => {
    expect(author).toMatchObject({ name: "author", type: "document" });
    expect(names(author)).toEqual(["name", "slug", "avatar", "bio"]);
    expect(field(author, "avatar")?.type).toBe("image");
    expect(field(author, "bio")?.type).toBe("text");
  });

  it("requires name and slug, slug generated from the name", () => {
    expect(ruleNames(field(author, "name"))).toEqual(["required"]);
    expect(ruleNames(field(author, "slug"))).toEqual(["required"]);
    expect(field(author, "slug")).toMatchObject({ type: "slug", options: { source: "name" } });
    expect(ruleNames(field(author, "avatar"))).toEqual([]);
  });
});
