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
import seoSchema from "@/sanity/schemas/seo";
const seo = seoSchema as unknown as Schema;

describe("seo schema", () => {
  it("is an object type with the fields withSeoOverrides reads", () => {
    expect(seo).toMatchObject({ name: "seo", type: "object" });
    expect(names(seo)).toEqual(["metaTitle", "metaDescription", "keywords", "ogImage", "noIndex"]);
  });

  it("field types are right and nothing is required", () => {
    expect(seo.fields.map((f) => f.type)).toEqual(["string", "text", "array", "image", "boolean"]);
    expect(seo.fields.every((f) => ruleNames(f).length === 0)).toBe(true);
  });

  it("noIndex defaults to off", () => {
    expect(field(seo, "noIndex")?.initialValue).toBe(false);
  });
});
