import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const completedSources = [
  "src/components/brewsoul/biodynamic-roasters.tsx",
  "src/components/brewsoul/biodynamic-farms.tsx",
  "src/components/brewsoul/city-detail-tabs.tsx",
  "src/components/brewsoul/decaf-fame.tsx",
  "src/components/brewsoul/decaf-shame.tsx",
  "src/components/brewsoul/health-compounds.tsx",
  "src/components/brewsoul/health-risks.tsx",
  "src/components/brewsoul/coffee-card.tsx",
  "src/components/brewsoul/first-sip-email-capture.tsx",
  "src/components/brewsoul/chains-explorer.tsx",
  "src/app/brewsoul/first-sip/page.tsx",
];

describe("BrewSoul interface icon policy", () => {
  it("uses existing Lucide components for completed UI symbol replacements", () => {
    for (const relativePath of completedSources) {
      const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

      expect(source, relativePath).toContain('from "lucide-react"');
      expect(source, relativePath).not.toMatch(/[✦★✓▲▼]/u);
    }
  });
});
