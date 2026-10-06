"use client";

import { STEP_FIELDS, supplierIntakeData } from "../data/supplier-intake.data";
import type { StepProps } from "../supplier-intake";
import { IntakeFields } from "./intake-fields";

// Step 3: terms and track record.
export function StepTerms({ intake }: StepProps) {
  return (
    <section aria-labelledby="si-step-heading">
      <h2 id="si-step-heading" className="mb-2 border-b border-neutral-800 pb-2 font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase">
        {supplierIntakeData.stepLabels[2]}
      </h2>
      <p className="mb-6 text-xs text-neutral-500">{supplierIntakeData.termsNote}</p>
      <IntakeFields fields={STEP_FIELDS[3]} intake={intake} />
    </section>
  );
}
