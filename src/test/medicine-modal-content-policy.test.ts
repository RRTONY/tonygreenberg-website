import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("medicine modal content policy", () => {
  it("does not display an unverified attributed practitioner quotation", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/pri/medicine-modal.tsx"),
      "utf8",
    );

    expect(source).not.toContain("Dr. Beverly Reader");
    expect(source).not.toContain("Practitioner Perspective");
  });
});
