import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Charity evaluator badge policy", () => {
  it("uses accessible text rather than raw star glyphs for external evaluator scores", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/marketing/charity-badges.tsx"),
      "utf8",
    );

    expect(source).toContain("value: `${charity.cnStars} / 4`");
    expect(source).not.toMatch(/[★☆]/u);
  });
});
