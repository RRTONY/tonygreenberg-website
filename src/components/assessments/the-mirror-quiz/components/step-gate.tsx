"use client";

import { ThemedBackground } from "@/components/assessments/themed-background";
import { EmailGate } from "@/components/assessments/email-gate";
import type { StepProps } from "../the-mirror-quiz";

// Step 3: the same email gate every sibling assessment uses before results.
export function StepGate({ quiz }: StepProps) {
  return (
    <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
      <ThemedBackground theme="mirror" />
      <EmailGate assessmentSlug="mirror" onUnlock={quiz.unlock} />
    </div>
  );
}
