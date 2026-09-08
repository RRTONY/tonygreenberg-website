"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

// Ported from legacy's `SubmissionForm` — the real "paste your completed
// 108-item responses" intake, including the optional referral-consent
// fields, unchanged. Legacy posted to `trpc.facilitatorIndex.submit` (no
// backend built for this migration) — replaced with a real `mailto:` to
// Tony carrying the same fields, same honest-degradation pattern used
// throughout this migration, rather than reproducing a submit call with
// nothing behind it.
export function SubmissionForm() {
  const [codedIdentity, setCodedIdentity] = useState("");
  const [responses, setResponses] = useState("");
  const [referralConsent, setReferralConsent] = useState(false);
  const [referralRegion, setReferralRegion] = useState("");
  const [referralContact, setReferralContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!responses.trim()) return;
    const bodyLines = [
      codedIdentity.trim() ? `Code: ${codedIdentity.trim()}` : "",
      referralConsent ? "Referral introduction requested: yes" : "",
      referralRegion.trim() ? `Region: ${referralRegion.trim()}` : "",
      referralContact.trim() ? `Contact: ${referralContact.trim()}` : "",
      "",
      "RESPONSES",
      "",
      responses.trim(),
    ].filter(Boolean);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Facilitator Index Submission")}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-facilitator-amber-light/35 bg-facilitator-amber-light/12 p-6 text-center text-facilitator-amber">
        <CheckCircle2 className="mx-auto mb-2 size-7" />
        <div className="mb-1.5 font-bold">Ready to send.</div>
        <div className="text-[.88rem] text-facilitator-ink/60">Your email client should be open with your responses pre-filled — send it and they&apos;re logged under your code.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-facilitator-ink/60 uppercase">Your Code (optional)</label>
        <input
          type="text"
          placeholder="e.g. CEDAR-001"
          value={codedIdentity}
          onChange={(e) => setCodedIdentity(e.target.value)}
          className="mb-5 w-full rounded-md border border-facilitator-amber-light/35 bg-white/85 px-3.5 py-2.5 text-[.92rem] text-facilitator-ink outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-facilitator-ink/60 uppercase">Your Responses — paste all 108 items with your answers</label>
        <textarea
          placeholder="Paste your completed responses here. Format: item number, your answer. One item per line or however you've organized them."
          value={responses}
          onChange={(e) => setResponses(e.target.value)}
          required
          className="mb-5 min-h-60 w-full resize-y rounded-md border border-facilitator-amber-light/35 bg-white/85 px-3.5 py-2.5 text-[.92rem] text-facilitator-ink outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={referralConsent} onChange={(e) => setReferralConsent(e.target.checked)} className="mt-0.5 accent-facilitator-amber-light" />
          <span className="text-[.88rem] leading-[1.55] text-facilitator-ink/70">
            I&apos;d like Tony to make a personal introduction to a vetted practitioner or facility in my region when relevant. This is not a
            lead-generation list. Tony reviews these himself.
          </span>
        </label>
      </div>

      {referralConsent && (
        <>
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-facilitator-ink/60 uppercase">Your Region</label>
            <input
              type="text"
              placeholder="e.g. Pacific Northwest, Western Europe, Southeast Asia"
              value={referralRegion}
              onChange={(e) => setReferralRegion(e.target.value)}
              className="mb-5 w-full rounded-md border border-facilitator-amber-light/35 bg-white/85 px-3.5 py-2.5 text-[.92rem] text-facilitator-ink outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-facilitator-ink/60 uppercase">How to reach you (email or Signal)</label>
            <input
              type="text"
              placeholder="Contact info for Tony only — never published"
              value={referralContact}
              onChange={(e) => setReferralContact(e.target.value)}
              className="mb-5 w-full rounded-md border border-facilitator-amber-light/35 bg-white/85 px-3.5 py-2.5 text-[.92rem] text-facilitator-ink outline-none"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={!responses.trim()}
        className="rounded-lg bg-linear-to-br from-facilitator-amber-deep to-facilitator-amber-light px-10 py-3.5 text-sm font-bold tracking-[0.06em] text-facilitator-ink uppercase disabled:opacity-50"
      >
        Submit to the Index
      </button>
    </form>
  );
}
