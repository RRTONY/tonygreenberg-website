"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { MedicineWithSafety } from "@/lib/content/pri-data";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

const FIELD_OPTIONS = [
  { value: "overview", label: "Overview" },
  { value: "therapeutic", label: "Therapeutic Applications" },
  { value: "tradition", label: "Tradition" },
  { value: "contraindications", label: "Contraindications" },
  { value: "sideEffects", label: "Side Effects" },
  { value: "drugInteractions", label: "Drug Interactions" },
  { value: "safetyWarning", label: "Safety Warning" },
  { value: "legalStatus", label: "Legal Status" },
  { value: "pricing", label: "Pricing / Access" },
  { value: "providers", label: "Providers" },
];

// Ported from legacy's `CorrectionForm` — the real community-correction
// intake for a medicine's data, unchanged. Legacy posted to
// `trpc.pri.submitCorrection` (no backend built for this migration) and its
// own error path showed a fake "Thank You" success even when the mutation
// failed ("Still show success for UX") — the exact fake-success anti-pattern
// this migration avoids everywhere else. Replaced with a real `mailto:` to
// Tony carrying the same fields, so "submitted" only shows once the user's
// mail client actually opens.
export function CorrectionForm({
  medicine,
  onClose,
}: {
  medicine: MedicineWithSafety;
  onClose: () => void;
}) {
  const [fieldName, setFieldName] = useState("overview");
  const [suggestedContent, setSuggestedContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!suggestedContent.trim()) return;
    const fieldLabel = FIELD_OPTIONS.find((f) => f.value === fieldName)?.label ?? fieldName;
    const subject = encodeURIComponent(`PRI Correction — ${medicine.name}`);
    const bodyLines = [
      `Medicine: ${medicine.name} (${medicine.id})`,
      `Section: ${fieldLabel}`,
      "",
      "Suggested correction:",
      suggestedContent.trim(),
      "",
      sourceUrl.trim() ? `Source: ${sourceUrl.trim()}` : "",
      submitterName.trim() ? `From: ${submitterName.trim()}` : "",
      submitterEmail.trim() ? `Reply to: ${submitterEmail.trim()}` : "",
    ].filter(Boolean);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 size-9 text-[#3D6B44]" />
        <h3 className="mb-2 font-heading text-[1.3rem] font-extrabold text-pri-ink">Thank You</h3>
        <p className="text-[.9rem] text-pri-tan">
          Your email client should be open with the correction pre-filled — send it and Tony will
          review it.
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-pri-ink px-8 py-3 font-mono text-sm font-bold tracking-wide text-pri-cream uppercase"
        >
          Close
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full border border-pri-border bg-pri-parchment px-3.5 py-2.5 font-body text-[.88rem] text-pri-ink outline-none";

  return (
    <div className="py-6">
      <h3 className="mb-1 font-heading text-[1.2rem] font-extrabold text-pri-ink">
        Suggest a Correction for {medicine.name}
      </h3>
      <p className="mb-5 text-[.82rem] leading-[1.6] text-pri-tan">
        Help us keep this data accurate. If you have clinical experience, published research, or
        verified information that improves our data, please share it below.
      </p>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-pri-tan uppercase">
          Which Section?
        </label>
        <select
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          {FIELD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-pri-tan uppercase">
          Your Suggested Correction *
        </label>
        <textarea
          value={suggestedContent}
          onChange={(e) => setSuggestedContent(e.target.value)}
          placeholder="Describe what should be changed and why..."
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-pri-tan uppercase">
          Source / Citation (optional)
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
          className={inputClass}
        />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-pri-tan uppercase">
            Your Name (optional)
          </label>
          <input
            type="text"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            placeholder="Name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-pri-tan uppercase">
            Email (optional)
          </label>
          <input
            type="email"
            value={submitterEmail}
            onChange={(e) => setSubmitterEmail(e.target.value)}
            placeholder="email@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 border-[1.5px] border-pri-border px-6 py-3 font-mono text-sm font-bold tracking-wide text-pri-tan uppercase"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!suggestedContent.trim()}
          className={`flex-[2] justify-center px-6 py-3 font-mono text-sm font-bold tracking-wide uppercase ${suggestedContent.trim() ? "bg-pri-purple text-pri-cream" : "bg-pri-border text-pri-tan"}`}
        >
          Submit Correction
        </button>
      </div>
    </div>
  );
}
