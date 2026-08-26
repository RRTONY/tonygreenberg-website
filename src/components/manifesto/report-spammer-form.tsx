"use client";

import { useState } from "react";
import { AlertTriangle, Send, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/manifesto/manifesto-ui";

// Ported from legacy client/src/pages/manifesto/AttentionTheft.tsx's
// "Report A Spammer" form. Legacy submitted to `trpc.spam.submit`, which
// wrote into a public "Wall of Shame" database (`trpc.spam.wallOfShame`,
// `trpc.spam.stats`) that this migration doesn't build — the spam-tracking
// system is explicitly deferred (NEXTJS-MIGRATION-TODO.md's "Explicitly
// deferred" list: "/youve-been-reported, /spamtoast, admin spam tooling").
// Rather than fake a public database with no real backend, or drop
// reporting entirely, this composes a `mailto:` to Tony with the same
// fields legacy collected — same honest non-fake-success pattern already
// used in `newsletter-popup.tsx` and on `/protecting-your-business`'s
// "Submit Your Story" form. Real field set and validation rules
// unchanged; the wall-of-shame reveal/ranked-list UI (nothing to show
// without a real backend) isn't reproduced.
const CONTACT_EMAIL = "tony@tonygreenberg.com";

const SPAM_TYPES = [
  { value: "cold-outreach", label: "Cold Outreach / Sales Pitch" },
  { value: "newsletter", label: "Unsolicited Newsletter" },
  { value: "ai-generated", label: "AI-Generated Personalized Spam" },
  { value: "phishing", label: "Phishing / Scam" },
];

const FREQUENCIES = [
  { value: "once", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
  { value: "multiple-daily", label: "Multiple times per day" },
];

type FormData = { companyName: string; senderEmail: string; spamType: string; frequency: string; description: string; yourEmail: string };
const INITIAL: FormData = { companyName: "", senderEmail: "", spamType: "", frequency: "", description: "", yourEmail: "" };

const inputClass = "w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3.5 text-base text-crusade-ink outline-none";

export function ReportSpammerForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.senderEmail.trim() || !form.senderEmail.includes("@")) e.senderEmail = "Valid email required";
    if (!form.spamType) e.spamType = "Required";
    if (!form.frequency) e.frequency = "Required";
    if (!form.description.trim() || form.description.trim().length < 10) e.description = "At least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const spamTypeLabel = SPAM_TYPES.find((t) => t.value === form.spamType)?.label ?? form.spamType;
    const freqLabel = FREQUENCIES.find((f) => f.value === form.frequency)?.label ?? form.frequency;
    const subject = encodeURIComponent(`Spam report: ${form.companyName}`);
    const body = encodeURIComponent(
      `Company / sender: ${form.companyName}\nSender email: ${form.senderEmail}\nType: ${spamTypeLabel}\nFrequency: ${freqLabel}\n\nWhat happened:\n${form.description}\n\nReporter email: ${form.yourEmail || "(not provided)"}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <GlassCard variant="teal" glow className="mx-auto max-w-lg text-center">
        <CheckCircle size={56} className="mx-auto mb-4 text-crusade-teal" />
        <h3 className="mb-2 font-heading text-2xl font-bold text-crusade-ink">Almost There</h3>
        <p className="mb-6 text-base leading-relaxed text-crusade-muted">
          Your email app just opened with your report ready to send. Send it, and it goes straight to Tony — there&apos;s
          no public database yet, so this is reviewed by hand for now.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm(INITIAL);
            setErrors({});
          }}
          className="rounded-xl bg-crusade-teal px-5 py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
        >
          Report Another
        </button>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-crusade-red/12 bg-crusade-red/6 p-4">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-crusade-red" />
        <p className="text-sm leading-relaxed text-crusade-brown">
          This opens your email app with a report addressed to Tony directly — only submit factual information about
          actual spam you have received.
        </p>
      </div>

      <GlassCard>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-crusade-ink">
              Company / Sender Name <span className="text-crusade-red">*</span>
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="e.g., Forward Medical, Apollo.io"
              className={inputClass}
            />
            {errors.companyName && <p className="mt-1 text-[0.8rem] text-crusade-red">{errors.companyName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-crusade-ink">
              Sender Email Address <span className="text-crusade-red">*</span>
            </label>
            <input
              type="email"
              value={form.senderEmail}
              onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
              placeholder="e.g., outreach@spamcompany.com"
              className={inputClass}
            />
            {errors.senderEmail && <p className="mt-1 text-[0.8rem] text-crusade-red">{errors.senderEmail}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-crusade-ink">
              Type of Spam <span className="text-crusade-red">*</span>
            </label>
            <select value={form.spamType} onChange={(e) => setForm({ ...form, spamType: e.target.value })} className={inputClass}>
              <option value="">Select type...</option>
              {SPAM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.spamType && <p className="mt-1 text-[0.8rem] text-crusade-red">{errors.spamType}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-crusade-ink">
              How Often? <span className="text-crusade-red">*</span>
            </label>
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className={inputClass}>
              <option value="">Select frequency...</option>
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            {errors.frequency && <p className="mt-1 text-[0.8rem] text-crusade-red">{errors.frequency}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-crusade-ink">
              What Happened? <span className="text-crusade-red">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the spam. Include notable details — fake personalization? Ignored unsubscribe? AI-generated?"
              rows={4}
              className={`${inputClass} resize-y`}
            />
            {errors.description && <p className="mt-1 text-[0.8rem] text-crusade-red">{errors.description}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-crusade-ink">
              Your Email <span className="text-xs font-normal opacity-40">(optional)</span>
            </label>
            <input
              type="email"
              value={form.yourEmail}
              onChange={(e) => setForm({ ...form, yourEmail: e.target.value })}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>
        </div>
      </GlassCard>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-crusade-red px-6 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(200,22,26,0.4)] transition-transform hover:-translate-y-1"
      >
        <Send size={20} /> File Charges
      </button>
    </form>
  );
}
