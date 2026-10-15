import { describe, expect, it } from "vitest";
import { EDITOR_PICK_SLUGS } from "@/lib/content/editor-picks";
import { POST_ORDER } from "@/lib/content/post-order";

describe("editor-picks", () => {
  it("has Tony's 5 hand-picked essays in order", () => {
    expect(EDITOR_PICK_SLUGS).toEqual([
      "when-healing-becomes-extraction",
      "five-cups",
      "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
      "is-that-a-lot-clarisse-abelarde",
      "only-time-buys-trust",
    ]);
  });

  it("only picks real, unique essays", () => {
    expect(new Set(EDITOR_PICK_SLUGS).size).toBe(EDITOR_PICK_SLUGS.length);
    for (const s of EDITOR_PICK_SLUGS) expect(POST_ORDER).toContain(s);
  });
});
