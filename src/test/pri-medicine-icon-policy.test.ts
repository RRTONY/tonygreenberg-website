import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("PRI medicine icon policy", () => {
  it("renders medicine visuals with shared Lucide icons and keeps generated reports text-only", () => {
    const readiness = fs.readFileSync(
      path.join(process.cwd(), "src/components/pri/psychedelic-readiness-index.tsx"),
      "utf8",
    );
    const modal = fs.readFileSync(
      path.join(process.cwd(), "src/components/pri/medicine-modal.tsx"),
      "utf8",
    );
    const icon = fs.readFileSync(
      path.join(process.cwd(), "src/components/pri/medicine-icon.tsx"),
      "utf8",
    );
    const medicineData = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/pri-data.ts"),
      "utf8",
    );
    const scoreData = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/pri-shared.ts"),
      "utf8",
    );

    expect(readiness).toContain("<MedicineIcon medicineId={m.id}");
    expect(readiness).not.toMatch(/\{m\.icon\}|\$\{m\.icon\}|\{s\.icon\}|\$\{s\.icon\}/u);
    expect(modal).toContain("<MedicineIcon medicineId={medicine.id}");
    expect(modal).not.toContain("{medicine.icon}");
    expect(icon).toContain("MEDICINE_ICON_BY_ID");
    expect(icon).toContain("type LucideIcon");
    expect(medicineData).not.toMatch(/^\s*icon:\s*/mu);
    expect(scoreData).not.toContain("sequence: { icon:");
    expect(scoreData).not.toMatch(/^\s*icon:\s*/mu);
  });
});
