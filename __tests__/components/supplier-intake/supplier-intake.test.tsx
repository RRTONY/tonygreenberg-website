import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { SupplierIntakeForm } from "@/components/supplier-intake/supplier-intake";
import { submitSupplierIntake } from "@/app/supplier-intake/actions";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
const submit = vi.mocked(submitSupplierIntake);

type User = ReturnType<typeof userEvent.setup>;
async function pick(user: User, label: RegExp, option: string) {
  await user.click(screen.getByRole("combobox", { name: label }));
  await user.click(await screen.findByRole("option", { name: option }));
}
const cont = () => screen.getByRole("button", { name: /Continue/ });

async function fillToLastStep(user: User) {
  await user.type(screen.getByLabelText(/Legal Entity Name/), "Acme");
  await user.type(screen.getByLabelText(/State \/ Country/), "Delaware");
  await user.type(screen.getByLabelText(/Primary Contact Name/), "Jane");
  await user.type(screen.getByLabelText(/^Email/), "jane@acme.com");
  await user.click(cont());
  await screen.findByRole("region", { name: "Offer & Scale" });
  await user.type(screen.getByLabelText(/Current Peptide Products/), "BPC-157");
  await pick(user, /Facility Type/, "White Label");
  await pick(user, /Number of Employees/, "1–10");
  await pick(user, /Chain-of-Custody/, "Currently live");
  await pick(user, /Pricing Model/, "Per Unit");
  await user.click(cont());
  await screen.findByRole("region", { name: "Terms & Track Record" });
}
async function fillLast(user: User) {
  await pick(user, /Standard Lead Time/, "Under 2 weeks");
  await pick(user, /Minimum Order Quantity/, "No minimum");
  await pick(user, /Independent Testing/, "No");
  await pick(user, /Facility Classification/, "503A");
  await pick(user, /Product Labeling/, "Research-Use-Only");
  await pick(user, /Recall \/ CAPA/, "No recalls or CAPAs");
}

describe("SupplierIntakeForm", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true, supplierId: "SUP-1" });
  });

  it("shows step 1 of 3 with progress and no Back button", () => {
    render(<SupplierIntakeForm canSubmit />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
    const steps = screen.getByRole("list", { name: "Form progress" }).querySelectorAll("li");
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveAttribute("aria-current", "step");
    expect(screen.queryByRole("button", { name: /Back/ })).not.toBeInTheDocument();
  });

  it("blocks Continue on an empty step with the field errors", async () => {
    const user = userEvent.setup();
    render(<SupplierIntakeForm canSubmit />);
    await user.click(cont());
    expect(await screen.findByText("Legal entity name is required")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields before continuing.");
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("walks all three steps (optional fields empty) and sends exactly the answers", async () => {
    const user = userEvent.setup();
    render(<SupplierIntakeForm canSubmit />);
    await fillToLastStep(user);
    expect(screen.getByText(/We do not share your information/)).toBeInTheDocument();
    await fillLast(user);
    await user.click(screen.getByRole("button", { name: /Submit Application/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("Application Received");
    expect(screen.getByText("Reference: SUP-1")).toBeInTheDocument();
    expect(submit).toHaveBeenCalledWith({
      legal_entity_name: "Acme",
      state_country_of_incorporation: "Delaware",
      primary_contact_name: "Jane",
      email: "jane@acme.com",
      phone: "",
      website: "",
      current_peptide_products: "BPC-157",
      facility_type: "White Label",
      number_of_employees: "1–10",
      monthly_production_capacity: "",
      chain_of_custody_capability: "Currently live",
      pricing_model: "Per Unit",
      standard_lead_time: "Under 2 weeks",
      minimum_order_quantity: "No minimum",
      independent_testing_willingness: "No",
      facility_classification: "503A",
      product_labeling_sale_restrictions: "Research-Use-Only",
      recall_capa_history: "No recalls or CAPAs",
      website_url: "",
    });
  });

  it("Back keeps the earlier answers", async () => {
    const user = userEvent.setup();
    render(<SupplierIntakeForm canSubmit />);
    await fillToLastStep(user);
    await user.click(screen.getByRole("button", { name: /Back/ }));
    await user.click(screen.getByRole("button", { name: /Back/ }));
    expect(screen.getByLabelText(/Legal Entity Name/)).toHaveValue("Acme");
  });

  it("without a submission destination, the last step links to RampRate instead of pretending to send", async () => {
    const user = userEvent.setup();
    render(<SupplierIntakeForm canSubmit={false} />);
    await fillToLastStep(user);
    expect(screen.queryByRole("button", { name: /Submit Application/ })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Continue at ramprate.com\/biochain/ });
    expect(link).toHaveAttribute("href", "https://ramprate.com/biochain/supplier-intake");
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText(/Online submission from this page is paused/)).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });
  it("shows a spinner on Submit while sending", async () => {
    let finish: (v: { ok: true; supplierId?: string }) => void = () => {};
    submit.mockImplementation(() => new Promise((r) => (finish = r)));
    const user = userEvent.setup();
    render(<SupplierIntakeForm canSubmit />);
    await fillToLastStep(user);
    await fillLast(user);
    await user.click(screen.getByRole("button", { name: /Submit Application/ }));
    const btn = screen.getByRole("button", { name: /Submit Application/ });
    await vi.waitFor(() => expect(btn).toBeDisabled());
    expect(btn.querySelector(".animate-spin")).not.toBeNull();
    finish({ ok: true });
    expect(await screen.findByRole("status")).toHaveTextContent("Application Received");
  });
});
