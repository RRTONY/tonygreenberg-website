import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepCompany } from "@/components/supplier-intake/components/step-company";
import { useSupplierIntake } from "@/components/supplier-intake/hook/use-supplier-intake";
import { STEP_FIELDS, supplierIntakeData } from "@/components/supplier-intake/data/supplier-intake.data";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

function Harness() {
  const intake = useSupplierIntake(true);
  return <StepCompany intake={intake} />;
}

describe("StepCompany", () => {
  it("is a section named by its step heading", () => {
    render(<Harness />);
    expect(screen.getByRole("region", { name: supplierIntakeData.stepLabels[0] })).toBeInTheDocument();
  });

  it("shows exactly this step's fields", () => {
    render(<Harness />);
    for (const f of STEP_FIELDS[1]) expect(document.getElementById(`si-${f.name}`)).not.toBeNull();
    const others = [1, 2, 3].filter((s) => s !== 1).flatMap((s) => STEP_FIELDS[s]);
    for (const f of others) expect(document.getElementById(`si-${f.name}`)).toBeNull();
  });

  it("asks for the company and contact basics", () => {
    render(<Harness />);
    expect(screen.getByLabelText(/Legal Entity Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Contact Name/)).toBeInTheDocument();
  });
});
