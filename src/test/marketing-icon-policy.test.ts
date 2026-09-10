import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const completedSources = [
  "src/components/marketing/abit-waitlist-form.tsx",
  "src/components/marketing/biochain-cta.tsx",
  "src/components/marketing/clinic-rankings.tsx",
  "src/components/blog/article-footer.tsx",
];

describe("marketing interface icon policy", () => {
  it("uses existing icon components instead of Unicode status, CTA, and list-marker symbols", () => {
    for (const relativePath of completedSources) {
      const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

      expect(source, relativePath).not.toMatch(/[◆◇✓✗↗]/u);
    }

    expect(fs.readFileSync(path.join(process.cwd(), completedSources[0]), "utf8")).toContain(
      "<Check",
    );
    expect(fs.readFileSync(path.join(process.cwd(), completedSources[1]), "utf8")).toContain(
      "<ForwardIcon",
    );
    expect(fs.readFileSync(path.join(process.cwd(), completedSources[2]), "utf8")).toContain("<X");
    expect(fs.readFileSync(path.join(process.cwd(), completedSources[3]), "utf8")).toContain(
      "<Check",
    );
  });
});
