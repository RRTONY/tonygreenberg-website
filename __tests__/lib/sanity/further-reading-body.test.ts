import { describe, expect, it } from "vitest";
import { extractFurtherReading, readingKey } from "@/lib/sanity/further-reading-body";

type B = { _key: string; _type: string; style?: string; children?: { _type: string; text: string; marks?: string[] }[]; markDefs?: object[] };
const blk = (key: string, text: string, style = "normal"): B => ({ _key: key, _type: "block", style, children: [{ _type: "span", text }] });
const linked = (key: string, title: string, why: string, href: string): B => ({
  _key: key,
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text: title, marks: ["m"] }, { _type: "span", text: ` — ${why}` }],
  markDefs: [{ _key: "m", _type: "link", href }],
});

describe("readingKey", () => {
  it("treats the same address written different ways as one", () => {
    expect(readingKey("https://www.Example.com/a/")).toBe("example.com/a");
    expect(readingKey("example.com/a")).toBe("example.com/a");
    expect(readingKey("https://tonygreenberg.com/blog/x")).toBe("/blog/x");
  });
});

describe("extractFurtherReading", () => {
  it("returns non-arrays unchanged", () => {
    expect(extractFurtherReading(undefined)).toEqual({ body: undefined, reading: { items: [], keptInBody: false } });
  });

  it("pulls a 'Title (url) · why' section out of the body, with its intro", () => {
    const body = [
      blk("p", "Body."),
      blk("h", "Further Reading:", "h2"),
      blk("i", "Threads worth pulling:"),
      blk("1", "Five Cups (/blog/five-cups) · why coffee matters"),
      blk("2", "Moat (https://x.com/moat) — the moat essay"),
      blk("after", "After."),
    ];
    const { body: out, reading } = extractFurtherReading(body);
    expect((out as B[]).map((b) => b._key)).toEqual(["p", "after"]);
    expect(reading).toEqual({
      intro: "Threads worth pulling:",
      keptInBody: false,
      items: [
        { title: "Five Cups", url: "/blog/five-cups", why: "why coffee matters" },
        { title: "Moat", url: "https://x.com/moat", why: "the moat essay" },
      ],
    });
  });

  it("reads 'Title — why' lines with one link and de-duplicates across two sections", () => {
    const body = [
      blk("h1", "✦ Further Reading", "h2"),
      linked("a", "Heart", "why", "https://www.x.com/heart/"),
      blk("h2", "Further Reading", "h2"),
      linked("b", "Heart again", "dup", "x.com/heart"),
    ];
    const { body: out, reading } = extractFurtherReading(body);
    expect(out).toEqual([]);
    expect(reading.items).toEqual([{ title: "Heart", url: "https://www.x.com/heart/", why: "why" }]);
  });

  it("keeps a section that isn't a list of links in the body", () => {
    const body = [blk("h", "Further Reading", "h2"), blk("s", "Smith, J. (2020). A book."), blk("t", "Another source.")];
    const { body: out, reading } = extractFurtherReading(body);
    expect(out).toBe(body);
    expect(reading.keptInBody).toBe(true);
    expect(reading.items).toEqual([]);
  });

  it("keeps just one of the break marks that framed the removed section", () => {
    const body = [blk("x", "Body."), blk("b1", "⁂"), blk("h", "Further Reading", "h2"), blk("1", "A (/a) · why"), blk("b2", "⁂"), blk("y", "End.")];
    expect((extractFurtherReading(body).body as B[]).map((b) => b._key)).toEqual(["x", "b1", "y"]);
  });
});
