import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntakeFields } from "@/components/supplier-intake/components/intake-fields";
import { useSupplierIntake } from "@/components/supplier-intake/hook/use-supplier-intake";
import { STEP_FIELDS } from "@/components/supplier-intake/data/supplier-intake.data";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

let intake: ReturnType<typeof useSupplierIntake>;
// Called from render; keeps the assignment out of the component body (react-hooks/globals).
const capture = (value: ReturnType<typeof useSupplierIntake>) => {
  intake = value;
};
function Harness({ step }: { step: number }) {
  const value = useSupplierIntake(true);
  capture(value);
  return <IntakeFields fields={STEP_FIELDS[step]} intake={value} />;
}

describe("IntakeFields", () => {
  it("labels every field, marks required ones and links the 'Optional' note", () => {
    render(<Harness step={1} />);
    const name = screen.getByLabelText(/Legal Entity Name/);
    expect(name).toHaveAttribute("aria-required", "true");
    expect(name).toHaveAttribute("placeholder", "Acme Peptides Inc.");
    const phone = screen.getByLabelText(/^Phone/);
    expect(phone).toHaveAttribute("type", "tel");
    expect(phone).not.toHaveAttribute("aria-required");
    expect(phone).toHaveAttribute("aria-describedby", "si-phone-sub");
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("autocomplete", "email");
  });

  it("typing updates the shared form values", async () => {
    render(<Harness step={1} />);
    await userEvent.type(screen.getByLabelText(/Legal Entity Name/), "Acme");
    expect(intake.form.values.legal_entity_name).toBe("Acme");
  });

  it("shows a field's error, marks it invalid and describes it", async () => {
    render(<Harness step={1} />);
    await act(() => intake.onNext());
    const email = screen.getByLabelText(/^Email/);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email.getAttribute("aria-describedby")).toContain("si-email-err");
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("renders the textarea and selects for step 2, and a select pick is stored", async () => {
    render(<Harness step={2} />);
    expect(screen.getByLabelText(/Current Peptide Products/).tagName).toBe("TEXTAREA");
    const trigger = screen.getByRole("combobox", { name: /Facility Type/ });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "White Label" }));
    expect(intake.form.values.facility_type).toBe("White Label");
    expect(screen.getByRole("combobox", { name: /Facility Type/ })).toHaveTextContent("White Label");
  });
});
