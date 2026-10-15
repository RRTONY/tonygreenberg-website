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
import pageSeoSchema from "@/sanity/schemas/pageSeo";
const pageSeo = pageSeoSchema as unknown as Schema;

describe("pageSeo schema", () => {
  it("is keyed by route and holds an seo object", () => {
    expect(pageSeo).toMatchObject({ name: "pageSeo", type: "document" });
    expect(names(pageSeo)).toEqual(["route", "seo"]);
    expect(field(pageSeo, "seo")?.type).toBe("seo");
  });

  it("route is required and must start with /", () => {
    const route = field(pageSeo, "route");
    expect(ruleNames(route)).toEqual(["required", "custom"]);
    const check = custom(route);
    expect(check("/brewsoul/quiz")).toBe(true);
    expect(check("brewsoul")).toBe('Route must start with "/"');
    expect(check(undefined)).toBe(true);
  });
});
