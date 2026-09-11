import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("medicine modal content policy", () => {
  it("does not display an unverified attributed practitioner quotation", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/pri/medicine-modal.tsx"),
      "utf8",
    );
    const medicineData = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/pri-data.ts"),
      "utf8",
    );

    expect(source).not.toContain("Dr. Beverly Reader");
    expect(source).not.toContain("Practitioner Perspective");
    expect(source).toContain("p.isWarning && <AlertTriangle");
    expect(medicineData).toContain("isWarning?: boolean");
    expect(medicineData).toContain(
      'amount: "Warning", label: "Do not seek this out", isWarning: true',
    );
    expect(medicineData).not.toContain('amount: "⚠️ WARNING"');
    expect(medicineData).not.toContain('amount: "☠️ WARNING"');
  });
});
