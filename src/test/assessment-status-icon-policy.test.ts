import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("assessment status icon policy", () => {
  it("uses semantic icons rather than warning or share-control glyphs", () => {
    const peptide = fs.readFileSync(
      path.join(process.cwd(), "src/components/assessments/find-your-peptide-quiz.tsx"),
      "utf8",
    );
    const therapy = fs.readFileSync(
      path.join(process.cwd(), "src/components/assessments/find-your-therapy-quiz.tsx"),
      "utf8",
    );

    expect(peptide).toContain("<TriangleAlert");
    expect(peptide).not.toContain("⚠️ Contraindications");
    expect(peptide).not.toContain("• {flag}");
    expect(therapy).toContain("icon: Share2");
    expect(therapy).toContain("icon: Link2");
    expect(therapy).toContain("icon: Mail");
    expect(therapy).toContain("icon: Copy");
    expect(therapy).not.toMatch(/[𝕏✉⎘]/u);
  });
});
