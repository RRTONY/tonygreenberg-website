import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Peptide Hall of Shame icon policy", () => {
  it("uses a semantic Lucide check for feature-list markers", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/app/peptide-hall-of-shame/page.tsx"),
      "utf8",
    );

    expect(source).toContain('import { Check } from "lucide-react"');
    expect(source).toContain("<Check");
    expect(source).not.toContain("✓ {f}");
  });
});
