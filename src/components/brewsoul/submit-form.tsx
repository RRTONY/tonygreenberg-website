"use client";

import { useState } from "react";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

type SubmissionType = "submit" | "appeal";

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulSubmit`. **Real bug fixed**: legacy's own comment admitted
// "In production this would POST to a tRPC endpoint" — but in the
// meantime it wrote the submission to `localStorage` and showed
// "Received. We'll review your submission" anyway, which is actively
// misleading (nobody would ever see it). Replaced with a real mailto:
// fallback that opens the visitor's mail client pre-filled with the
// form's fields, same honest-degradation pattern already used in
// `first-sip-email-capture.tsx` — no fake success state.
export function SubmitForm() {
  const [form, setForm] = useState({ name: "", roaster: "", url: "", notes: "", type: "submit" as SubmissionType });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.type === "submit" ? `BrewSoul coffee submission: ${form.name}` : `BrewSoul score appeal: ${form.name}`);
    const body = encodeURIComponent(
      `Coffee: ${form.name}\nRoaster: ${form.roaster}\nLink: ${form.url}\n\n${form.type === "submit" ? "Why it should be added" : "What we got wrong"}:\n${form.notes}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-xl border border-[#6F4E37]/8 bg-white p-12 text-center">
        <div className="mb-2 font-heading text-[1.3rem] text-[#2C1810]">Opening your email client...</div>
        <p className="text-[0.9rem] text-[#6B5B4F]">
          Send the pre-filled message and we&apos;ll review your {form.type === "submit" ? "submission" : "appeal"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        {(["submit", "appeal"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t })}
            className={`rounded-lg px-5 py-2 font-mono text-[0.78rem] ${
              form.type === t ? "border-2 border-[#C5A23C] bg-[#C5A23C]/8 text-[#8B6914]" : "border border-[#6F4E37]/15 bg-white text-[#6B5B4F]"
            }`}
          >
            {t === "submit" ? "Submit a Coffee" : "Appeal a Score"}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Coffee name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="rounded-lg border border-[#6F4E37]/15 px-4 py-3 text-sm"
      />
      <input
        type="text"
        placeholder="Roaster"
        value={form.roaster}
        onChange={(e) => setForm({ ...form, roaster: e.target.value })}
        className="rounded-lg border border-[#6F4E37]/15 px-4 py-3 text-sm"
      />
      <input
        type="url"
        placeholder="Link (optional)"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
        className="rounded-lg border border-[#6F4E37]/15 px-4 py-3 text-sm"
      />
      <textarea
        placeholder={form.type === "submit" ? "Why should we add this coffee?" : "What did we get wrong and why?"}
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        rows={4}
        className="resize-y rounded-lg border border-[#6F4E37]/15 px-4 py-3 text-sm"
      />
      <button
        type="submit"
        className="rounded-lg bg-linear-to-br from-[#6F4E37] to-[#A68B3C] px-8 py-3.5 font-mono text-[0.85rem] tracking-[0.15em] text-white uppercase"
      >
        {form.type === "submit" ? "Submit for Review" : "File Appeal"}
      </button>
    </form>
  );
}
