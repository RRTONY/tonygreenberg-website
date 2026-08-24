import { describe, it, expect, vi } from "vitest";

// Mock global fetch to prevent real HTTP calls during tests (e.g., Apps Script POST)
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

// Mock the notification module before importing routers
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock db module — replaces old single-stage helpers with new two-stage helpers
vi.mock("./db", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    createVendorIntakeStage1: vi.fn().mockResolvedValue({
      id: 1,
      supplierId: "test-uuid-1234",
      stage2Token: "tok_abc123",
    }),
    getVendorIntakeBySupplierId: vi.fn().mockResolvedValue({
      id: 1,
      supplierId: "test-uuid-1234",
      stage2Token: "tok_abc123",
      stage: "stage1_submitted",
      adminStatus: "new",
      legal_entity_name: "Acme Peptides Inc.",
      email: "jane@acmepeptides.com",
    }),
    getVendorIntakeByToken: vi.fn().mockResolvedValue({
      id: 1,
      supplierId: "test-uuid-1234",
      stage2Token: "tok_abc123",
      stage: "stage2_invited",
      adminStatus: "pursue",
      legal_entity_name: "Acme Peptides Inc.",
      email: "jane@acmepeptides.com",
    }),
    getVendorIntakeByStage2Token: vi.fn().mockResolvedValue({
      id: 1,
      supplierId: "test-uuid-1234",
      stage2Token: "tok_abc123",
      stage: "stage2_invited",
      adminStatus: "pursue",
      legal_entity_name: "Acme Peptides Inc.",
      email: "jane@acmepeptides.com",
    }),
    updateVendorIntakeStage2: vi.fn().mockResolvedValue({ id: 1 }),
    getVendorIntakeList: vi.fn().mockResolvedValue([]),
    activateVendorStage2: vi.fn().mockResolvedValue({ stage2Token: "tok_abc123" }),
  };
});

import { appRouter } from "./routers";

const validStage1Submission = {
  legal_entity_name: "Acme Peptides Inc.",
  state_country_of_incorporation: "Delaware, USA",
  primary_contact_name: "Jane Smith",
  email: "jane@acmepeptides.com",
  phone: "+1 (302) 555-0100",
  website: "https://acmepeptides.com",
  current_peptide_products: "BPC-157, TB-500, Semaglutide",
  facility_type: "Own Manufacturing",
  number_of_employees: "51–200",
  monthly_production_capacity: "500kg",
  facility_classification: "FDA Registered",
  chain_of_custody_capability: "Currently live",
  pricing_model: "Tiered Volume Pricing",
  standard_lead_time: "2–4 weeks",
  minimum_order_quantity: "Small (under $5K)",
  independent_testing_willingness: "Yes, ongoing",
  product_labeling_sale_restrictions: "Research-Use-Only",
  recall_capa_history: "No recalls or CAPAs",
  source_site: "tonygreenberg",
};

describe("Vendor Intake — Stage 1", () => {
  it("vendor.submitStage1 procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("vendor.submitStage1");
  });

  it("vendor.submitStage1 accepts a valid Stage 1 submission", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.vendor.submitStage1(validStage1Submission);
    expect(result).toMatchObject({ success: true, supplierId: expect.any(String) });
  });

  it("vendor.submitStage1 rejects missing legal_entity_name", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.vendor.submitStage1({ ...validStage1Submission, legal_entity_name: "" })
    ).rejects.toThrow();
  });

  it("vendor.submitStage1 rejects invalid email", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.vendor.submitStage1({ ...validStage1Submission, email: "not-an-email" })
    ).rejects.toThrow();
  });

  it("vendor.submitStage1 rejects missing primary_contact_name", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.vendor.submitStage1({ ...validStage1Submission, primary_contact_name: "" })
    ).rejects.toThrow();
  });

  it("vendor.submitStage1 accepts submission without optional phone/website/capacity", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const { phone, website, monthly_production_capacity, ...minimal } = validStage1Submission;
    const result = await caller.vendor.submitStage1(minimal);
    expect(result).toMatchObject({ success: true });
  });
});

describe("Vendor Intake — Stage 2", () => {
  it("vendor.getStage2Form procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("vendor.getStage2Form");
  });

  it("vendor.saveStage2Progress procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("vendor.saveStage2Progress");
  });

  it("vendor.submitStage2 procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("vendor.submitStage2");
  });

  it("vendor.getStage2Form returns supplier data for valid token", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.vendor.getStage2Form({ token: "tok_abc123" });
    expect(result).toMatchObject({ supplierId: "test-uuid-1234" });
  });
});

describe("Vendor Intake — Admin", () => {
  it("vendor.list procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("vendor.list");
  });

  it("vendor.activateStage2 procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("vendor.activateStage2");
  });
});
