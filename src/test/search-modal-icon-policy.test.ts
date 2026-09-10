import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Search modal keyboard icon policy", () => {
  it("uses Lucide icons instead of raw keyboard navigation glyphs", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/search-modal.tsx"),
      "utf8",
    );

    expect(source).toContain("<ArrowUp");
    expect(source).toContain("<ArrowDown");
    expect(source).toContain("<CornerDownLeft");
    expect(source).not.toMatch(/[↑↓↵]/u);
  });
});
