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
import siteSettingsSchema from "@/sanity/schemas/siteSettings";
const settings = siteSettingsSchema as unknown as Schema;

describe("siteSettings schema", () => {
  it("has the fields siteSettingsQuery selects", () => {
    expect(settings).toMatchObject({ name: "siteSettings", type: "document" });
    expect(names(settings)).toEqual(["siteTitle", "tagline", "logo", "defaultSeo", "navigation", "footerColumns", "footerText", "socialLinks"]);
    expect(field(settings, "defaultSeo")?.type).toBe("seo");
  });

  it("navigation and footer links have a label and href", () => {
    expect(names(field(settings, "navigation")!.of![0])).toEqual(["label", "href"]);
    const column = field(settings, "footerColumns")!.of![0];
    expect(names(column)).toEqual(["heading", "links"]);
    expect(names(field(column, "links")!.of![0])).toEqual(["label", "href"]);
  });

  it("social links use a url-typed field", () => {
    expect(field(settings, "socialLinks")!.of![0].fields!.map((f) => [f.name, f.type])).toEqual([
      ["platform", "string"],
      ["url", "url"],
    ]);
  });
});
