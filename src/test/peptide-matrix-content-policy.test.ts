import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Peptide Matrix review-content policy", () => {
  it("does not present unsupported hard-coded ratings or testimonials", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/app/peptide-matrix/page.tsx"),
      "utf8",
    );
    const explorer = fs.readFileSync(
      path.join(process.cwd(), "src/components/marketing/peptide-matrix-explorer.tsx"),
      "utf8",
    );

    expect(source).toContain("<TriangleAlert");
    expect(source).not.toMatch(/[★☆]/u);
    expect(source).not.toContain("Miracle cure!");
    expect(source).not.toContain("4.8/5");
    expect(source).toContain("Public Signals");
    expect(source).not.toContain("5-Star Reviews");
    expect(source).not.toContain("Patient satisfaction");
    expect(explorer).toContain("Source Lists");
    expect(explorer).not.toMatch(/[★☆]/u);
    expect(explorer).not.toContain("${selected.reviews}★");
    expect(explorer).not.toContain("${entity.reviews}★");
  });
});
