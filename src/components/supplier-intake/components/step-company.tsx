"use client";

import { STEP_FIELDS, supplierIntakeData } from "../data/supplier-intake.data";
import type { StepProps } from "../supplier-intake";
import { IntakeFields } from "./intake-fields";

// Step 1: company and contact.
export function StepCompany({ intake }: StepProps) {
  return (
    <section aria-labelledby="si-step-heading">
      <h2 id="si-step-heading" className="mb-6 border-b border-neutral-800 pb-2 font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase">
        {supplierIntakeData.stepLabels[0]}
      </h2>
      <IntakeFields fields={STEP_FIELDS[1]} intake={intake} />
    </section>
  );
}
