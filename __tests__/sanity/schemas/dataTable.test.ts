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
import dataTableSchema from "@/sanity/schemas/dataTable";
const table = dataTableSchema as unknown as Schema;

describe("dataTable schema", () => {
  it("is an object with rows of string cells", () => {
    expect(table).toMatchObject({ name: "dataTable", type: "object" });
    const rows = field(table, "rows");
    expect(rows?.type).toBe("array");
    expect(rows?.of?.[0]).toMatchObject({ type: "object", name: "row" });
    expect(rows?.of?.[0].fields?.[0]).toMatchObject({ name: "cells", type: "array", of: [{ type: "string" }] });
  });

  it("needs at least two rows (a header and one row)", () => {
    expect(rules(field(table, "rows"))).toEqual([["min", [2]]]);
  });

  it("preview names the header and counts the body rows", () => {
    expect(table.preview?.prepare?.({ rows: [{ cells: ["A", "B"] }, { cells: ["1", "2"] }, { cells: ["3", "4"] }] })).toEqual({
      title: "Table: A | B",
      subtitle: "2 rows",
    });
    expect(table.preview?.prepare?.({})).toEqual({ title: "Table: ", subtitle: "0 rows" });
  });
});
