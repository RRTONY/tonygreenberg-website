import { describe, expect, it } from "vitest";
import { LEGACY_IMPORT_CUTOFF, legacyBodyLayout } from "@/lib/sanity/legacy-body";

const OLD = "2026-09-01T00:00:00Z";
const NEW = "2026-11-01T00:00:00Z";
type B = { _key: string; _type: string; style?: string; listItem?: string; children: { _key: string; _type: string; text: string; marks?: string[] }[] };
const p = (text: string, key = "b", marks: string[] = []): B => ({ _key: key, _type: "block", style: "normal", children: [{ _key: `${key}s`, _type: "span", text, marks }] });
const run = (blocks: B[], createdAt?: string, title?: string) => legacyBodyLayout(blocks, createdAt, title) as B[];

describe("legacyBodyLayout", () => {
  it("the cutoff is 2026-10-02", () => {
    expect(LEGACY_IMPORT_CUTOFF).toBe("2026-10-02T00:00:00Z");
  });

  it("returns non-arrays unchanged", () => {
    expect(legacyBodyLayout(undefined, OLD)).toBeUndefined();
  });

  it("splits a multi-line block into one block per line, skipping blank lines", () => {
    const out = run([p("First line here.\n\nSecond line.  ")], NEW);
    expect(out.map((b) => b.children.map((s) => s.text).join(""))).toEqual(["First line here.", "Second line."]);
    expect(out.map((b) => b._key)).toEqual(["b", "b-1"]);
  });

  // legacy-body.ts:49-50: when a line is one span, first === last, and the
  // trailing-trim line rebuilds the span from the untrimmed `last.text`,
  // undoing the leading trim from the line above.
  it.fails("BUG: a one-span line keeps its leading whitespace (trailing trim overwrites the leading trim)", () => {
    const out = run([p("First.\n  Second line.")], NEW);
    expect(out[1].children[0].text).toBe("Second line.");
  });

  it("turns short title-like lines of imported posts into h2s", () => {
    const out = run([p("The Real Problem\nThis is a sentence.")], OLD);
    expect(out.map((b) => b.style)).toEqual(["h2", "normal"]);
  });

  it("leaves headings alone for posts written after the cutoff", () => {
    expect(run([p("The Real Problem")], NEW)[0].style).toBe("normal");
  });

  it("never makes a heading from a line with a URL, a mark, closing punctuation or a number list", () => {
    const out = run([p("Visit www.example.com", "a"), p("Bold Start", "b", ["strong"]), p("Is This It?", "c"), p("1. First Thing", "d")], OLD);
    expect(out.map((b) => b.style)).toEqual(["normal", "normal", "normal", "normal"]);
  });

  it("treats lines starting with a diamond or star marker as headings whatever their punctuation", () => {
    expect(run([p("◆ this one ends with a period.")], OLD)[0].style).toBe("h2");
  });

  it("drops a first block that repeats the title, ignoring curly quotes and case", () => {
    const out = run([p("Tony’s “Big” Idea", "t"), p("Body text.", "x")], NEW, "tony's \"big\" idea");
    expect(out.map((b) => b._key)).toEqual(["x"]);
  });

  it("passes list items, headings and non-blocks through untouched", () => {
    const list = { ...p("Item\nTwo"), listItem: "bullet" };
    const h = { ...p("Heading\nTwo"), style: "h3" };
    const img = { _key: "i", _type: "image", children: [] };
    const out = run([list, h, img], OLD);
    expect(out).toEqual([list, h, img]);
  });
});
