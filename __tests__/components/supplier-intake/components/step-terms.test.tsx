import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepTerms } from "@/components/supplier-intake/components/step-terms";
import { useSupplierIntake } from "@/components/supplier-intake/hook/use-supplier-intake";
import { STEP_FIELDS, supplierIntakeData } from "@/components/supplier-intake/data/supplier-intake.data";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

function Harness() {
  const intake = useSupplierIntake(true);
  return <StepTerms intake={intake} />;
}

describe("StepTerms", () => {
  it("is a section named by its step heading", () => {
    render(<Harness />);
    expect(screen.getByRole("region", { name: supplierIntakeData.stepLabels[2] })).toBeInTheDocument();
  });

  it("shows exactly this step's fields", () => {
    render(<Harness />);
    for (const f of STEP_FIELDS[3]) expect(document.getElementById(`si-${f.name}`)).not.toBeNull();
    const others = [1, 2, 3].filter((s) => s !== 3).flatMap((s) => STEP_FIELDS[s]);
    for (const f of others) expect(document.getElementById(`si-${f.name}`)).toBeNull();
  });

  it("shows the 'not aspirational' note", () => {
    render(<Harness />);
    expect(screen.getByText(supplierIntakeData.termsNote)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(6);
  });
});
