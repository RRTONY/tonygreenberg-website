import { describe, expect, it } from "vitest";
import { FULL_SCHEMA, STEP_SCHEMAS } from "@/components/supplier-intake/data/supplier-intake.schema";
import { EMPTY_VALUES, STEP_FIELDS } from "@/components/supplier-intake/data/supplier-intake.data";

const step1 = { legal_entity_name: "Acme", state_country_of_incorporation: "Delaware", primary_contact_name: "Jane", email: "jane@acme.com", phone: "", website: "" };
const errorsOf = async (n: number, v: object) => {
  try {
    await STEP_SCHEMAS[n].validate(v, { abortEarly: false });
    return [];
  } catch (e) {
    return (e as { errors: string[] }).errors;
  }
};

describe("supplier intake schema", () => {
  it("step 1 passes with optional phone and website left empty", async () => {
    expect(await errorsOf(1, step1)).toEqual([]);
  });

  it("step 1 lists every missing required field", async () => {
    const errs = await errorsOf(1, { ...EMPTY_VALUES });
    expect(errs).toEqual(
      expect.arrayContaining(["Legal entity name is required", "State country of incorporation is required", "Primary contact name is required", "Email is required"]),
    );
  });

  it("checks email, phone and website formats when filled", async () => {
    const errs = await errorsOf(1, { ...step1, email: "nope", phone: "abc", website: "not a site" });
    expect(errs).toEqual(
      expect.arrayContaining(["Invalid email address", "Enter a valid phone number (e.g., +1 555-000-0000)", "Enter a valid website (e.g., example.com or https://example.com)"]),
    );
    expect(await errorsOf(1, { ...step1, phone: "+1 (302) 555-0100", website: "https://acme.com" })).toEqual([]);
  });

  it("step 2 needs a number in capacity only when filled", async () => {
    const v = { current_peptide_products: "BPC-157", facility_type: "White Label", number_of_employees: "1–10", chain_of_custody_capability: "Currently live", pricing_model: "Per Unit" };
    expect(await errorsOf(2, { ...v, monthly_production_capacity: "" })).toEqual([]);
    expect(await errorsOf(2, { ...v, monthly_production_capacity: "lots" })).toEqual(["Enter a quantity with a number (e.g., 500 kg/month)"]);
  });

  it("every required field in the data has a rule in its step's schema", () => {
    for (const n of [1, 2, 3]) {
      const keys = Object.keys(STEP_SCHEMAS[n].fields);
      STEP_FIELDS[n].forEach((f) => expect(keys).toContain(f.name));
    }
    expect(Object.keys(FULL_SCHEMA.fields)).toHaveLength(18);
  });
});
