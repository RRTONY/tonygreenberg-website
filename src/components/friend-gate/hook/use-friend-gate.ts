"use client";

import { useState } from "react";

// The gate's ONE shared state (CONTRIBUTING rule 19): step 1 intro, 2 nominate.
// After sending, the seeker moves to /friend-gate/[token] (waiting/results).
export function useFriendGate() {
  const [step, setStep] = useState(1);
  return { step, onNext: (s?: number) => setStep((prev) => s ?? prev + 1) };
}
