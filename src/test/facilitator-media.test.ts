import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("Facilitator Index media and content policy", () => {
  it("uses the two verified live in-body visuals with accessible next/image markup", () => {
    const data = readProjectFile("src/lib/content/facilitator-index-data.ts");
    const content = readProjectFile("src/components/facilitator/facilitator-index-content.tsx");

    expect(data).toContain("https://tonygreenberg.com/api/img/facilitator-bands_93368783.jpg");
    expect(data).toContain("https://tonygreenberg.com/api/img/facilitator-compass_fb5f9a0c.jpg");
    expect(content).toContain("src={FACILITATOR_BANDS_IMAGE}");
    expect(content).toContain('alt="Twelve bands"');
    expect(content).toContain("src={FACILITATOR_COMPASS_IMAGE}");
    expect(content).toContain('alt="The five-axis map"');
    expect(content).toContain("unoptimized");
  });

  it("does not present unsupported hard-coded testimonials as user-generated evidence", () => {
    const content = readProjectFile("src/components/facilitator/facilitator-index-content.tsx");

    expect(content).not.toContain("const TESTIMONIALS");
    expect(content).not.toContain("From the field");
  });

  it("uses Lucide components rather than Unicode symbol icons in active Facilitator UI", () => {
    const data = readProjectFile("src/lib/content/facilitator-index-data.ts");
    const intake = readProjectFile("src/components/facilitator/quick-intake.tsx");
    const content = readProjectFile("src/components/facilitator/facilitator-index-content.tsx");
    const route = readProjectFile("src/app/facilitator-index/page.tsx");

    expect(data).toContain('from "lucide-react"');
    expect(intake).toContain('from "lucide-react"');
    expect(content).toContain('from "lucide-react"');
    expect(content).toContain("<ChevronDown");
    expect(data).not.toMatch(/[✦◈◎◇⬡◉]/u);
    expect(intake).not.toMatch(/[✦◈◎◇⬡◉]/u);
    expect(content).not.toMatch(/[✦◈◎◇⬡◉✓↓]/u);
    expect(route).not.toMatch(/[✦◈◎◇⬡◉✓]/u);
  });
});
