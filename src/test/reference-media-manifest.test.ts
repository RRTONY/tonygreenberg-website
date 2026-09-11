import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("reference media manifest", () => {
  it("assigns every legacy image declaration to an explicit source-group disposition", () => {
    const manifest = fs.readFileSync(
      path.join(process.cwd(), "docs/reference-media-manifest.md"),
      "utf8",
    );
    const inventory = manifest.split("## Image Declaration Inventory")[1] ?? "";
    const imageRows = inventory.split("\n").filter((line) => line.startsWith("| `pages/"));

    expect(manifest).toContain("## Source Group Dispositions");
    expect(manifest).toContain("## Image Declaration Inventory");
    expect(manifest).toContain("- **Distinct reference image declarations:** 171");
    expect(imageRows).toHaveLength(171);
    expect(manifest).not.toContain("| Unclassified |");
  });
});
