import { describe, expect, it } from "vitest";
import { essayBody } from "@/lib/sanity/essay-body";

type B = { _key: string; _type: string; style?: string; listItem?: string; children?: { _type: string; text: string }[]; [k: string]: unknown };
const blk = (key: string, text: string, style = "normal"): B => ({ _key: key, _type: "block", style, children: [{ _type: "span", text }] });
const LONG = "This is a sentence that is easily longer than forty characters in total.";

describe("essayBody", () => {
  it("returns non-arrays with an empty contents list", () => {
    expect(essayBody(null)).toEqual({ body: null, toc: [] });
  });

  it("gives headings unique anchor ids and builds the contents list", () => {
    const { body, toc } = essayBody([blk("a", "◆ The Start", "h2"), blk("b", "Short."), blk("c", "The Start", "h2"), blk("d", "Detail", "h3")]);
    expect(toc).toEqual([
      { id: "the-start", text: "The Start", level: 2 },
      { id: "the-start-2", text: "The Start", level: 2 },
      { id: "detail", text: "Detail", level: 3 },
    ]);
    expect((body as B[])[0].anchorId).toBe("the-start");
  });

  it("adds the id prefix for the second version", () => {
    expect(essayBody([blk("a", "Intro", "h2")], "today-").toc[0].id).toBe("today-intro");
  });

  it("promotes h3s to h2s when a post has no h2s", () => {
    const { toc } = essayBody([blk("a", "Only Sub", "h3")]);
    expect(toc[0].level).toBe(2);
  });

  it("makes the first 40-200 char paragraph among 3 to 8 the pull quote", () => {
    const { body } = essayBody([blk("1", LONG), blk("2", LONG), blk("3", "short"), blk("4", LONG), blk("5", "end")]);
    const out = body as B[];
    expect(out[3]).toEqual({ _key: "4", _type: "essayPullQuote", text: LONG });
    expect(out.filter((b) => b._type === "essayPullQuote")).toHaveLength(1);
  });

  it("never makes the last block a pull quote", () => {
    const { body } = essayBody([blk("1", "a"), blk("2", "b"), blk("3", LONG)]);
    expect((body as B[]).some((b) => b._type === "essayPullQuote")).toBe(false);
  });

  it("turns break marks into section breaks", () => {
    const { body } = essayBody([blk("x", "∴"), blk("y", "* * *")]);
    expect(body).toEqual([{ _key: "x", _type: "sectionBreak" }, { _key: "y", _type: "sectionBreak" }]);
  });

  it("gathers a GemSpark section's paragraphs into one card up to the next heading", () => {
    const { body, toc } = essayBody([
      blk("g", "✦ GemSpark of the Day — Trust Compounds", "h2"),
      blk("p1", "One."),
      blk("br", "---"),
      blk("p2", "Two."),
      blk("n", "Next", "h2"),
    ]);
    const out = body as B[];
    expect(out[0]).toMatchObject({ _type: "gemSpark", anchorId: toc[0].id, subtitle: "Trust Compounds" });
    expect((out[0].paragraphs as B[]).map((p) => p._key)).toEqual(["p1", "p2"]);
    expect(out[1]._key).toBe("n");
  });
});
