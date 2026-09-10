import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Iboga deep-dive icon policy", () => {
  it("uses typed Lucide data and semantic check components in active tables", () => {
    const data = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/pri-iboga-module.ts"),
      "utf8",
    );
    const page = fs.readFileSync(
      path.join(process.cwd(), "src/app/iboga-ibogaine/page.tsx"),
      "utf8",
    );

    expect(data).toContain('import type { LucideIcon } from "lucide-react"');
    expect(data).toContain("icon: LucideIcon");
    expect(data).not.toMatch(/[🧠💖🏥🌍🙏🌳💊🍄💗💉🌿🌵✓]/u);
    expect(page).toContain("function MedicineStatusValue");
    expect(page).toContain("<Check");
    expect(page).toContain("const Icon = r.icon");
  });
});
