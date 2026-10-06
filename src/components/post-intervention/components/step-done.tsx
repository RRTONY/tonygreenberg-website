"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import { Card, Frame, outlineButton, primaryButton } from "./frame";
import { postInterventionData } from "../data/post-intervention.data";
import type { StepProps } from "../post-intervention";

// Step 4: thank-you, with the next check-in day.
export function StepDone({ flow }: StepProps) {
  const day = flow.state.day;
  const nextDay = day === 1 ? 3 : day === 3 ? 7 : 30;
  return (
    <Frame
      done
      eyebrow="Assessment Complete"
      title="Thank You for Your Honesty"
      sub="Your response has been received anonymously. It goes directly to the facilitator network. This is how we make the next experience better."
    >
      <Card className="text-center">
        <Sprout aria-hidden="true" className="mx-auto mb-4 size-12 text-[#059669]" strokeWidth={1.5} />
        <p className="mb-3 text-lg/[1.7] text-[#1A1208]">Day {day} complete.</p>
        <p className="mb-6 text-sm/[1.8] text-[#78350F]">
          Integration is not a destination. It is a practice. Come back at Day {nextDay} if you want to track how things continue to shift.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className={outlineButton} onClick={flow.reset}>
            Take Another Assessment
          </button>
          <Link href="/" className={primaryButton}>
            Return Home
          </Link>
        </div>
      </Card>
      <p className="mt-6 text-center font-mono text-xs tracking-[0.05em] text-[#92400E]">{postInterventionData.copyright}</p>
    </Frame>
  );
}
