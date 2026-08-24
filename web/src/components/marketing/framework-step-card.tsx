"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type FrameworkStep = {
  num: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
  prompt: string;
  example: string;
};

// Ported from legacy client/src/pages/LeadMagnet.tsx's `StepCard`. Uses
// `forceMount` on the collapsed example — same crawlability rule as
// /journeys and /intel: a real-world example is real content, not a
// decorative reveal, so it needs to exist in the raw SSR HTML even before a
// visitor clicks "See Real-World Example".
export function FrameworkStepCard({ step }: { step: FrameworkStep }) {
  const [open, setOpen] = useState(false);
  const Icon = step.icon;

  return (
    <div className="mb-6 rounded-lg border border-brand-gold/15 bg-card p-8 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-gold/15 to-brand-gold/25">
          <Icon size={22} className="text-brand-gold" />
        </div>
        <div className="flex-1">
          <div className="mb-1 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Step {step.num}
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">{step.title}</h3>
          <p className="mt-1 text-foreground/70">{step.subtitle}</p>
        </div>
      </div>

      <p className="mt-5 leading-relaxed text-foreground/80">{step.description}</p>

      <div className="my-4 rounded-r-md border-l-4 border-brand-gold-light bg-brand-gold/5 px-6 py-4">
        <div className="mb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
          The Question to Ask
        </div>
        <p className="font-heading text-lg text-foreground">{step.prompt}</p>
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="mt-2 flex items-center gap-1.5 py-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
          {open ? "Hide" : "See"} Real-World Example
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </CollapsibleTrigger>
        <CollapsibleContent forceMount className="data-[state=closed]:hidden">
          <div className="mt-2 rounded-md border-l-4 border-brand-gold/20 bg-secondary p-6">
            <div className="mb-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
              From the Field
            </div>
            <p className="leading-relaxed text-foreground/80">{step.example}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
