"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EVIDENCE_CRITERIA, REVIEW_SOURCES } from "@/lib/content/peptide-matrix";

// forceMount — same crawlability rule as framework-step-card.tsx: the
// scoring methodology is real content an appeals reviewer or researcher
// needs to find, not a decorative reveal.
export function PeptideMatrixMethodology() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-12">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Evidence Scoring Methodology
        </CollapsibleTrigger>
        <CollapsibleContent forceMount className="data-[state=closed]:hidden">
          <div className="mt-4 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-mono text-xs tracking-wide text-brand-gold uppercase">
                Evidence Score Criteria
              </h3>
              {EVIDENCE_CRITERIA.map((c) => (
                <div key={c.label} className="flex justify-between border-b border-border py-2">
                  <span className="text-sm text-foreground/80">{c.label}</span>
                  <span
                    className={`font-mono text-sm font-bold ${
                      c.positive === true
                        ? "text-[#2E8B57]"
                        : c.positive === false
                          ? "text-[#C0392B]"
                          : "text-muted-foreground"
                    }`}
                  >
                    {c.points}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="mb-3 font-mono text-xs tracking-wide text-brand-gold uppercase">
                Review Data Sources
              </h3>
              {REVIEW_SOURCES.map((s) => (
                <div key={s} className="border-b border-border py-1.5">
                  <span className="text-sm text-foreground/80">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
