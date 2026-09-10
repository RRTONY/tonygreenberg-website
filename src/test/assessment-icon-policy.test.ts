import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("assessment icon policy", () => {
  it("uses Lucide components for Assessments Hub cards and the disclosure control", () => {
    const data = readProjectFile("src/lib/content/assessments-hub.ts");
    const page = readProjectFile("src/app/assessments/page.tsx");

    expect(data).toContain('from "lucide-react"');
    expect(data).toContain("Icon: LucideIcon");
    expect(page).toContain("const Icon = a.Icon");
    expect(page).toContain("<ArrowDown");
    expect(data).not.toMatch(/[◎△♡]/u);
    expect(page).not.toContain("See the Instruments ↓");
  });

  it("uses Lucide components for Grant Study factor labels and result cards", () => {
    const source = readProjectFile("src/components/assessments/grant-study-quiz.tsx");

    expect(source).toContain('from "lucide-react"');
    expect(source).toContain("Icon: LucideIcon");
    expect(source).toContain("<CurrentFactorIcon");
    expect(source).toContain("<FactorIcon");
    expect(source).toContain("<StrongestIcon");
    expect(source).toContain("<GrowthEdgeIcon");
    expect(source).not.toMatch(/[♡◈❋△○]/u);
  });
});
