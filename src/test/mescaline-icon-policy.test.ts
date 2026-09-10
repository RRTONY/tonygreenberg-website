import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Peyote and Mescaline deep-dive icon policy", () => {
  it("uses renderer-level Lucide mappings and semantic availability checks in active UI", () => {
    const data = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/pri-mescaline-module.ts"),
      "utf8",
    );
    const page = fs.readFileSync(
      path.join(process.cwd(), "src/app/peyote-mescaline/page.tsx"),
      "utf8",
    );

    expect(data).toContain('icon: "brain"');
    expect(page).toContain("function MedicineStatusValue");
    expect(page).toContain("DIMENSION_ICON_BY_KEY");
    expect(page).toContain("MEDICINE_ICON_BY_NAME");
    expect(page).toContain("<Check");
    expect(page).not.toMatch(/[🧠💖🏥🌍🙏🌵🍄💗💊🌿🌳🏔🔬✓]/u);
  });
});
