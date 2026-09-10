"use client";

import { useCallback, useEffect } from "react";
import { Download } from "lucide-react";
import { saveAssessmentResult } from "@/lib/assessments/result-log";

// Simplified from legacy client/src/components/AssessmentResultActions.tsx
// — a shared "Your Results" action bar used across several assessment
// result pages. Legacy had 3 actions: "Download PDF" (real, backend-free
// — browser print-to-PDF of a target element), "Send to Tony" and "Keep
// Private" (both posted to `trpc.assessments.submit`, a backend this
// migration hasn't built). Only the real, backend-free action is ported;
// the other two aren't reproduced as fake buttons that go nowhere, same
// honest-degradation pattern used throughout this migration. `sessionId`/
// answer-serialization props existed only to feed that dropped submit
// call, so this version's API is simpler: just the element to print.
// `resultSlug` is optional — pages built before /self-portrait existed
// (the original 15 "Find Your X" quizzes) can keep calling this without it
// and nothing breaks; they just won't show up in /self-portrait's log
// until someone threads it through. Every quiz built from Phase 9's back
// half onward passes its own slug (matching lib/content/find-your-me.ts's
// `ECOSYSTEM_CATEGORIES` url, minus the leading slash).
export function AssessmentResultActions({
  printTargetRef,
  accentColor = "#8B6914",
  resultSlug,
}: {
  printTargetRef?: React.RefObject<HTMLElement | null>;
  accentColor?: string;
  resultSlug?: string;
}) {
  // Logging a completion is a real one-time side effect (not derived render
  // state), so an effect is the right tool here — this isn't the
  // effect-mirrors-a-prop anti-pattern CONTRIBUTING.md warns about.
  useEffect(() => {
    if (resultSlug) saveAssessmentResult(resultSlug);
  }, [resultSlug]);

  const handleDownloadPDF = useCallback(() => {
    const target = printTargetRef?.current;
    if (!target) {
      window.print();
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Assessment Results</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Source Sans 3', sans-serif; color: #1a1a1a; padding: 2rem; max-width: 800px; margin: 0 auto; background: #fff; }
          h1, h2, h3 { font-family: 'Playfair Display', serif; color: #0A0A10; }
          h1 { font-size: 1.8rem; margin-bottom: 1rem; }
          h2 { font-size: 1.4rem; margin-bottom: 0.75rem; }
          h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
          p { line-height: 1.6; margin-bottom: 0.75rem; }
          .print-footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.8rem; color: #888; text-align: center; }
          @media print { body { padding: 0; } @page { margin: 1.5cm; } }
        </style>
      </head>
      <body>
        ${target.innerHTML}
        <div class="print-footer">tonygreenberg.com &middot; ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }, [printTargetRef]);

  return (
    <div className="py-8 text-center">
      <button
        type="button"
        onClick={handleDownloadPDF}
        className="inline-flex items-center gap-1.5 rounded-md border px-5 py-2.5 text-sm transition-colors"
        style={{ borderColor: accentColor, color: accentColor }}
      >
        <Download size={16} />
        Download PDF
      </button>
    </div>
  );
}
