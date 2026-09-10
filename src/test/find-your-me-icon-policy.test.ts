import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("Find Your Me icon policy", () => {
  it("stores wound-card icons as Lucide components rather than Unicode symbols", () => {
    const source = readProjectFile("src/lib/content/find-your-me.ts");

    expect(source).toContain("Icon: LucideIcon");
    expect(source).toContain('from "lucide-react"');
    expect(source).not.toMatch(/[♡✶○⚡◦☉❀⌂]/u);
  });

  it("uses Lucide components for wound cards, filters, search, and browsing controls", () => {
    const source = readProjectFile("src/components/assessments/find-your-me-quiz.tsx");

    expect(source).toContain("const WoundIcon = item.Icon");
    expect(source).toContain("const StatusIcon =");
    expect(source).toContain("<Search");
    expect(source).not.toMatch(/[▼●○⌕]/u);
  });
});
