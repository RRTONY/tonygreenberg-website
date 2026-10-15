import { describe, expect, it, vi } from "vitest";

vi.mock("sanity", () => ({ defineType: <T,>(x: T) => x, defineField: <T,>(x: T) => x }));

import { schemaTypes } from "@/sanity/schemas";

describe("schemaTypes", () => {
  it("registers every schema exactly once", () => {
    const names = schemaTypes.map((s) => s.name);
    expect(names).toEqual(["siteSettings", "seo", "page", "pageSeo", "redirect", "author", "category", "dataTable", "post", "adminChange"]);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every type a field uses by name is registered (or built in)", () => {
    const builtIn = new Set(["string", "text", "number", "boolean", "datetime", "url", "slug", "image", "file", "reference", "array", "object", "block"]);
    const registered = new Set<string>(schemaTypes.map((s) => s.name));
    const used = new Set<string>();
    const walk = (fields: { type: string; fields?: unknown[]; of?: { type: string; fields?: unknown[] }[] }[] = []) => {
      for (const f of fields) {
        used.add(f.type);
        walk(f.fields as never);
        for (const o of f.of ?? []) {
          used.add(o.type);
          walk(o.fields as never);
        }
      }
    };
    for (const s of schemaTypes) walk((s as unknown as { fields: never }).fields);
    for (const t of used) expect(builtIn.has(t) || registered.has(t), t).toBe(true);
  });
});
