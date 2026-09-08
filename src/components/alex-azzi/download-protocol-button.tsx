"use client";

import { Download } from "lucide-react";
import { RED_FLAGS, VERIFICATION_STEPS } from "@/lib/content/alex-azzi";

// Ported from legacy CheshireGrin.tsx's `DownloadChecklist` — the actual
// download (a client-side text blob, no server call) is real and kept.
// Legacy gated it behind an email field that was never submitted anywhere
// (no trpc call in the original handler either — it only unlocked a local
// `submitted` state), so entering an email implied it was being collected
// when it wasn't. Dropped the fake email gate; the download itself needs
// no email and never did.
export function DownloadProtocolButton() {
  const handleDownload = () => {
    const content = [
      "THE SUNLIGHT PROTOCOL — VERIFIED TRIBE COMMUNITY PROTECTION",
      "8 Steps Before You Speak + 8 Red Flags to Memorize",
      "━".repeat(80),
      "",
      "8 RED FLAGS TO MEMORIZE:",
      "",
      ...RED_FLAGS.map((rf, i) => `  ${i + 1}. ${rf.flag}\n     Lesson: ${rf.lesson}\n`),
      "",
      "━".repeat(80),
      "",
      "THE SUNLIGHT PROTOCOL — 8 STEPS:",
      "",
      ...VERIFICATION_STEPS.map((s) => `  ${s.num}. ${s.title}\n     ${s.text}\n`),
      "",
      "━".repeat(80),
      "",
      "BYRON KATIE'S FOUR QUESTIONS (apply before ANY report):",
      "",
      "  1. Is it true?",
      "  2. Can you absolutely know that it's true?",
      "  3. How do you react — what happens — when you believe that thought?",
      "  4. Who would you be without that thought?",
      "",
      "━".repeat(80),
      "",
      "THE THREE-WORD RULE: Get. It. In. Writing.",
      "",
      "Source: VerifiedTribe Community Protection Report — tonygreenberg.com/alex-azzi",
      "Author: Tony Greenberg | RampRate.com",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Community-Protection-Verification-Protocol.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-md border border-amber-700/40 bg-amber-700/10 px-5 py-2.5 font-mono text-xs font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-300"
    >
      <Download className="size-4" />
      Download the SunlightProtocol
    </button>
  );
}
