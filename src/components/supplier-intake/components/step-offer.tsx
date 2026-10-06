"use client";

import { STEP_FIELDS, supplierIntakeData } from "../data/supplier-intake.data";
import type { StepProps } from "../supplier-intake";
import { IntakeFields } from "./intake-fields";

// Step 2: what you make and at what scale.
export function StepOffer({ intake }: StepProps) {
  return (
    <section aria-labelledby="si-step-heading">
      <h2 id="si-step-heading" className="mb-6 border-b border-neutral-800 pb-2 font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase">
        {supplierIntakeData.stepLabels[1]}
      </h2>
      <IntakeFields fields={STEP_FIELDS[2]} intake={intake} />
    </section>
  );
}
