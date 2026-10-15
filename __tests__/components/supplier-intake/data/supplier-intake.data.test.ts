import { describe, expect, it } from "vitest";
import { EMPTY_VALUES, STEP_FIELDS, TOTAL_FORM_STEPS, supplierIntakeData } from "@/components/supplier-intake/data/supplier-intake.data";

describe("supplier intake data", () => {
  const all = [1, 2, 3].flatMap((n) => STEP_FIELDS[n]);

  it("has three form steps with a label each", () => {
    expect(TOTAL_FORM_STEPS).toBe(3);
    expect(supplierIntakeData.stepLabels).toEqual(["Company & Contact", "Offer & Scale", "Terms & Track Record"]);
    expect(supplierIntakeData.stepOf(2)).toBe("Step 2 of 3");
  });

  it("every field name is unique and has an empty starting value", () => {
    const names = all.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
    names.forEach((n) => expect(EMPTY_VALUES[n]).toBe(""));
    expect(EMPTY_VALUES.website_url).toBe("");
  });

  it("every select has options and every field has a label and placeholder", () => {
    all.forEach((f) => {
      expect(f.label).not.toBe("");
      expect(f.placeholder).not.toBe("");
      if (f.kind === "select") expect(f.options?.length).toBeGreaterThan(1);
    });
  });

  it("only phone, website and capacity are optional", () => {
    expect(all.filter((f) => !f.required).map((f) => f.name)).toEqual(["phone", "website", "monthly_production_capacity"]);
  });

  it("hands off to RampRate over https and has no Manus links", () => {
    expect(supplierIntakeData.handoff.href).toBe("https://ramprate.com/biochain/supplier-intake");
    expect(JSON.stringify({ STEP_FIELDS, supplierIntakeData })).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
  });
});
