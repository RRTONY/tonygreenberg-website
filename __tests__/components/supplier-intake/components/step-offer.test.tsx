import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepOffer } from "@/components/supplier-intake/components/step-offer";
import { useSupplierIntake } from "@/components/supplier-intake/hook/use-supplier-intake";
import { STEP_FIELDS, supplierIntakeData } from "@/components/supplier-intake/data/supplier-intake.data";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

function Harness() {
  const intake = useSupplierIntake(true);
  return <StepOffer intake={intake} />;
}

describe("StepOffer", () => {
  it("is a section named by its step heading", () => {
    render(<Harness />);
    expect(screen.getByRole("region", { name: supplierIntakeData.stepLabels[1] })).toBeInTheDocument();
  });

  it("shows exactly this step's fields", () => {
    render(<Harness />);
    for (const f of STEP_FIELDS[2]) expect(document.getElementById(`si-${f.name}`)).not.toBeNull();
    const others = [1, 2, 3].filter((s) => s !== 2).flatMap((s) => STEP_FIELDS[s]);
    for (const f of others) expect(document.getElementById(`si-${f.name}`)).toBeNull();
  });

  it("explains what to list under products", () => {
    render(<Harness />);
    expect(screen.getByText(/List the peptides you currently manufacture or supply/)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Pricing Model/ })).toBeInTheDocument();
  });
});
