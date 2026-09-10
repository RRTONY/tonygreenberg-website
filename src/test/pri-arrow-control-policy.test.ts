import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const sources = [
  "src/components/pri/pharma-table.tsx",
  "src/components/pri/psychedelic-readiness-index.tsx",
  "src/components/pri/calibration-assessment.tsx",
  "src/components/pri/iboga-compass-assessment.tsx",
  "src/app/peyote-mescaline/page.tsx",
];

describe("PRI arrow control policy", () => {
  it("uses semantic icon components instead of raw arrows in active controls", () => {
    for (const relativePath of sources) {
      const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

      expect(source, relativePath).not.toMatch(/[↑↓▲▼]/u);
    }

    expect(fs.readFileSync(path.join(process.cwd(), sources[0]), "utf8")).toContain("<ChevronDown");
    expect(fs.readFileSync(path.join(process.cwd(), sources[1]), "utf8")).toContain("<ForwardIcon");
    expect(fs.readFileSync(path.join(process.cwd(), sources[2]), "utf8")).toContain("<ChevronUp");
    expect(fs.readFileSync(path.join(process.cwd(), sources[3]), "utf8")).toContain("<ChevronDown");
    expect(fs.readFileSync(path.join(process.cwd(), sources[4]), "utf8")).toContain("<ChevronDown");
  });
});
