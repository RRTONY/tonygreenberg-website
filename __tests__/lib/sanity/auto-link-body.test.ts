import { describe, expect, it, vi } from "vitest";
import { autoLinkBody } from "@/lib/sanity/auto-link-body";

vi.mock("@/lib/content/link-map", () => ({
  autoLinkSegments: (text: string) => {
    const i = text.indexOf("RampRate");
    if (i === -1) return [text];
    return [text.slice(0, i), { text: "RampRate", href: "/ramprate" }, text.slice(i + 8)];
  },
}));

const block = (children: object[], markDefs: object[] = []) => ({ _key: "b1", _type: "block", style: "normal", markDefs, children });

describe("autoLinkBody", () => {
  it("returns non-arrays unchanged", () => {
    expect(autoLinkBody(null)).toBeNull();
    expect(autoLinkBody("text")).toBe("text");
  });

  it("splits a plain span around a known name and adds a link markDef", () => {
    const [out] = autoLinkBody([block([{ _key: "s1", _type: "span", marks: [], text: "I founded RampRate in 2001." }])]) as never as {
      children: { text: string; marks: string[] }[];
      markDefs: { _key: string; _type: string; href: string }[];
    }[];
    expect(out.children.map((c) => c.text)).toEqual(["I founded ", "RampRate", " in 2001."]);
    expect(out.markDefs).toEqual([{ _key: out.children[1].marks[0], _type: "link", href: "/ramprate" }]);
    expect(out.children[0].marks).toEqual([]);
  });

  it("leaves spans with marks (bold, links) alone", () => {
    const input = [block([{ _key: "s1", _type: "span", marks: ["strong"], text: "RampRate" }])];
    expect(autoLinkBody(input)[0]).toBe(input[0]);
  });

  it("skips a block that already has a real link", () => {
    const input = [block([{ _key: "s1", _type: "span", marks: [], text: "RampRate" }], [{ _key: "m", _type: "link", href: "https://x.com" }])];
    expect(autoLinkBody(input)[0]).toBe(input[0]);
  });

  it("returns the same block when nothing matches, and skips non-text blocks", () => {
    const plain = block([{ _key: "s1", _type: "span", marks: [], text: "Nothing here" }]);
    const image = { _key: "i", _type: "image" };
    const out = autoLinkBody([plain, image]);
    expect(out[0]).toBe(plain);
    expect(out[1]).toBe(image);
  });

  it("keeps the trailing segment out when it's empty", () => {
    const [out] = autoLinkBody([block([{ _key: "s1", _type: "span", marks: [], text: "Go RampRate" }])]) as never as { children: { text: string }[] }[];
    expect(out.children.map((c) => c.text)).toEqual(["Go ", "RampRate"]);
  });
});
