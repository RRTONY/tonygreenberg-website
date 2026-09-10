import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Peptide Matrix review-content policy", () => {
  it("does not present unsupported hard-coded ratings or testimonials", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/app/peptide-matrix/page.tsx"),
      "utf8",
    );

    expect(source).toContain("<TriangleAlert");
    expect(source).not.toMatch(/[★☆]/u);
    expect(source).not.toContain("Miracle cure!");
    expect(source).not.toContain("4.8/5");
  });
});
