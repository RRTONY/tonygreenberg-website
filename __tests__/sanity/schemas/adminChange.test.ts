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
import adminChangeSchema from "@/sanity/schemas/adminChange";
const change = adminChangeSchema as unknown as Schema;

describe("adminChange schema", () => {
  it("is a read-only document", () => {
    expect(change).toMatchObject({ name: "adminChange", type: "document", readOnly: true });
  });

  it("has the history fields change-sets.ts writes", () => {
    for (const name of ["title", "status", "requestedBy", "request", "summary", "areas", "content", "beforeAfter", "createdAt", "submittedAt", "publishedAt", "publishedBy", "discardedAt", "discardedBy", "undoes", "undoneBy", "files", "key", "branch", "prNumber", "mergeSha"]) {
      expect(field(change, name), name).toBeDefined();
    }
    expect(field(change, "prNumber")?.type).toBe("number");
  });

  it("status is limited to the four known states", () => {
    expect((field(change, "status")?.options as { list: { value: string }[] }).list.map((o) => o.value)).toEqual([
      "draft",
      "ready_for_review",
      "published",
      "discarded",
    ]);
  });

  it("hides the technical before-state fields of content items", () => {
    const content = field(change, "content")!.of![0].fields!;
    expect(content.filter((f) => f.hidden).map((f) => f.name)).toEqual(["beforeJson", "publishedRev"]);
  });

  it("preview labels the status and falls back for an untitled change", () => {
    const p = change.preview!.prepare!;
    expect(p({ title: "Fix typo", status: "ready_for_review", who: "Kim" })).toEqual({ title: "Fix typo", subtitle: "Ready for review · Kim" });
    expect(p({ status: "weird" })).toEqual({ title: "Untitled change", subtitle: "weird" });
  });

  it("orders newest first", () => {
    expect(change.orderings).toEqual([{ title: "Newest first", name: "createdDesc", by: [{ field: "createdAt", direction: "desc" }] }]);
  });
});
