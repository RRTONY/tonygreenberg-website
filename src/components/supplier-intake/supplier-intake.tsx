"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepCompany } from "./components/step-company";
import { StepOffer } from "./components/step-offer";
import { StepReceived } from "./components/step-received";
import { StepTerms } from "./components/step-terms";
import { TOTAL_FORM_STEPS, supplierIntakeData as copy } from "./data/supplier-intake.data";
import { useSupplierIntake, type SupplierIntake } from "./hook/use-supplier-intake";

// Stage 1 supplier intake (/supplier-intake), ported from legacy
// SupplierIntakeForm.tsx as a step registry: this parent holds only the
// registry and the shared chrome (step indicator, Back/Continue bar); the one
// shared state lives in useSupplierIntake; each step is its own component;
// fields and copy are in data/.
export type StepProps = { intake: SupplierIntake };

const STEPS: Record<number, (props: StepProps) => React.ReactNode> = {
  1: StepCompany,
  2: StepOffer,
  3: StepTerms,
  4: StepReceived,
};

const btnPrimary =
  "inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D4B96A] px-8 font-semibold text-[#0A0A10] hover:bg-[#C4A95A]";

export function SupplierIntakeForm({ canSubmit }: { canSubmit: boolean }) {
  const intake = useSupplierIntake(canSubmit);
  const { step, form } = intake;
  const Step = STEPS[step] ?? StepCompany;

  if (step > TOTAL_FORM_STEPS) return <Step intake={intake} />;

  const isLast = step === TOTAL_FORM_STEPS;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast && canSubmit) void intake.submit();
        else if (!isLast) void intake.onNext();
      }}
    >
      <ol className="mb-8 flex items-center gap-2" aria-label="Form progress">
        {copy.stepLabels.map((label, i) => {
          const n = i + 1;
          return (
            <li key={label} className="flex items-center gap-2" aria-current={n === step ? "step" : undefined}>
              <span
                className={
                  n < step
                    ? "flex size-7 items-center justify-center rounded-full bg-[#D4B96A] font-mono text-xs font-bold text-[#0A0A10]"
                    : n === step
                      ? "flex size-7 items-center justify-center rounded-full border border-[#D4B96A] bg-[#D4B96A]/20 font-mono text-xs font-bold text-[#D4B96A]"
                      : "flex size-7 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 font-mono text-xs font-bold text-neutral-500"
                }
              >
                {n < step ? <Check aria-hidden="true" className="size-3.5" /> : n}
              </span>
              <span className={n === step ? "hidden font-mono text-xs text-[#D4B96A] sm:inline" : "hidden font-mono text-xs text-neutral-500 sm:inline"}>
                {label}
              </span>
              {n < TOTAL_FORM_STEPS && <span aria-hidden="true" className="mx-1 h-px w-6 bg-neutral-700" />}
            </li>
          );
        })}
      </ol>

      <Step intake={intake} />

      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website_url"
          value={form.values.website_url}
          onChange={(e) => intake.setField("website_url", e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row sm:items-center">
        <div>
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={intake.back}
              className="min-h-11 gap-2 border-neutral-700 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {copy.back}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-neutral-500">{copy.stepOf(step)}</p>
          {!isLast ? (
            <Button type="submit" className={btnPrimary}>
              {copy.continue}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ) : canSubmit ? (
            <Button type="submit" disabled={form.isSubmitting} className={`${btnPrimary} shrink-0`}>
              {form.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
              {copy.submit}
              {!form.isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
            </Button>
          ) : (
            <a href={copy.handoff.href} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} shrink-0 text-sm`}>
              {copy.handoff.cta}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>
      {isLast && <p className="mt-3 text-xs text-neutral-500">{canSubmit ? copy.privacy : copy.handoff.text}</p>}
    </form>
  );
}
