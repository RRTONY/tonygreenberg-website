import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { useSupplierIntake } from "@/components/supplier-intake/hook/use-supplier-intake";
import { submitSupplierIntake } from "@/app/supplier-intake/actions";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
const submit = vi.mocked(submitSupplierIntake);

const ANSWERS: Record<number, Record<string, string>> = {
  1: { legal_entity_name: "Acme", state_country_of_incorporation: "Delaware", primary_contact_name: "Jane", email: "jane@acme.com" },
  2: { current_peptide_products: "BPC-157", facility_type: "White Label", number_of_employees: "1–10", chain_of_custody_capability: "Currently live", pricing_model: "Per Unit" },
  3: {
    standard_lead_time: "Under 2 weeks",
    minimum_order_quantity: "No minimum",
    independent_testing_willingness: "No",
    facility_classification: "503A",
    product_labeling_sale_restrictions: "Research-Use-Only",
    recall_capa_history: "No recalls or CAPAs",
  },
};

async function fillStep(result: { current: ReturnType<typeof useSupplierIntake> }, n: number) {
  for (const [k, v] of Object.entries(ANSWERS[n])) await act(async () => result.current.setField(k, v));
}

describe("useSupplierIntake", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true, supplierId: "SUP-42" });
  });

  it("starts on step 1 with empty answers", () => {
    const { result } = renderHook(() => useSupplierIntake(true));
    expect(result.current.step).toBe(1);
    expect(result.current.form.values.email).toBe("");
    expect(result.current.supplierId).toBeUndefined();
  });

  it("won't move on with required fields missing, and shows their errors", async () => {
    const { result } = renderHook(() => useSupplierIntake(true));
    await act(() => result.current.onNext());
    expect(result.current.step).toBe(1);
    expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields before continuing.");
    expect(result.current.errorFor("email")).toBe("Email is required");
    expect(result.current.errorFor("phone")).toBeUndefined();
  });

  it("setField clears that field's error", async () => {
    const { result } = renderHook(() => useSupplierIntake(true));
    await act(() => result.current.onNext());
    await act(async () => result.current.setField("email", "j@x.com"));
    expect(result.current.errorFor("email")).toBeUndefined();
  });

  it("onNext advances a valid step; back goes back but never below 1", async () => {
    const { result } = renderHook(() => useSupplierIntake(true));
    await fillStep(result, 1);
    await act(() => result.current.onNext());
    expect(result.current.step).toBe(2);
    act(() => result.current.back());
    act(() => result.current.back());
    expect(result.current.step).toBe(1);
  });

  it("submits every answer once all three steps are valid, then shows the reference", async () => {
    const { result } = renderHook(() => useSupplierIntake(true));
    for (const n of [1, 2]) {
      await fillStep(result, n);
      await act(() => result.current.onNext());
    }
    await fillStep(result, 3);
    await act(() => result.current.submit());
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ ...ANSWERS[1], ...ANSWERS[2], ...ANSWERS[3], phone: "", website: "", website_url: "" }));
    expect(result.current.step).toBe(4);
    expect(result.current.supplierId).toBe("SUP-42");
  });

  it("stays on the last step with a toast when the server refuses", async () => {
    submit.mockResolvedValue({ ok: false, error: "Sheet unavailable" });
    const { result } = renderHook(() => useSupplierIntake(true));
    for (const n of [1, 2]) {
      await fillStep(result, n);
      await act(() => result.current.onNext());
    }
    await fillStep(result, 3);
    await act(() => result.current.submit());
    expect(toast.error).toHaveBeenCalledWith("Submission failed: Sheet unavailable");
    expect(result.current.step).toBe(3);
  });

  it("submit with missing final fields shows the final-step message and sends nothing", async () => {
    const { result } = renderHook(() => useSupplierIntake(true));
    for (const n of [1, 2]) {
      await fillStep(result, n);
      await act(() => result.current.onNext());
    }
    await act(() => result.current.submit());
    expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields.");
    expect(submit).not.toHaveBeenCalled();
  });
});
