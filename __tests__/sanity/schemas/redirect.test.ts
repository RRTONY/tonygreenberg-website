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
import redirectSchema from "@/sanity/schemas/redirect";
const redirect = redirectSchema as unknown as Schema;

describe("redirect schema", () => {
  it("has source, destination and permanent (default on)", () => {
    expect(redirect).toMatchObject({ name: "redirect", type: "document" });
    expect(names(redirect)).toEqual(["source", "destination", "permanent"]);
    expect(field(redirect, "permanent")).toMatchObject({ type: "boolean", initialValue: true });
  });

  it("source is required and must be a path", () => {
    const source = field(redirect, "source");
    expect(ruleNames(source)).toEqual(["required", "custom"]);
    expect(custom(source)("/old")).toBe(true);
    expect(custom(source)("https://x.com/old")).toBe('Path must start with "/"');
  });

  it("destination is required", () => {
    expect(ruleNames(field(redirect, "destination"))).toEqual(["required"]);
  });

  it("preview shows from and to", () => {
    expect(redirect.preview?.prepare?.({ source: "/a", destination: "/b" })).toEqual({ title: "/a", subtitle: "→ /b" });
  });
});
