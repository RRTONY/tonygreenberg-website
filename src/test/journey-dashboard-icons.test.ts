import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Journey Dashboard icon policy", () => {
  it("uses Lucide components for category, state, view, and action icons", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/assessments/my-journey-dashboard.tsx"),
      "utf8",
    );

    expect(source).toContain('from "lucide-react"');
    expect(source).toContain("Icon: LucideIcon");
    expect(source).toContain("<CategoryIcon");
    expect(source).toContain("<Check");
    expect(source).toContain("<ExternalLink");
    expect(source).toContain("<Grid2X2");
    expect(source).toContain("<ListTree");
    expect(source).toContain("<Sparkles");
  });

  it("does not use Unicode symbols as Journey Dashboard interface icons", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/assessments/my-journey-dashboard.tsx"),
      "utf8",
    );

    expect(source).not.toMatch(/[◎♡⌘◈⬡✓↗→◫⊞]/u);
  });
});
