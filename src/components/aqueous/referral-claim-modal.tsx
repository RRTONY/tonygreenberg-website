"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { CheckCircle, Gift, Loader2, Sparkles, X } from "lucide-react";
import { useReferral } from "@/components/aqueous/aqueous-providers";
import { Button } from "@/components/aqueous/ui";
import { claimSchema, type ClaimValues } from "@/lib/content/aqueous/forms";

// Ported from the Aqueous app's client/src/components/ReferralClaimModal.tsx (2026-11-24).
// Email capture modal for referred visitors: shows 2 seconds after someone arrives via a ?ref= link
// (remembered by AqueousProviders), captures their email to claim $5 off and credit the referrer.
// Changes from the app:
// - Formik + Yup (claimSchema) instead of useState per field; field errors under each input, the
//   server's error in the same red box as the app.
// - The app wrote "dismissed this session" to sessionStorage but never read it back, so the modal
//   came back on every page; it's read now (fix-from-live).
// - Accessible dialog: role="dialog" aria-modal, labelled by its heading, Escape closes, the first
//   field gets focus, the close button has a label.
// - framer-motion: backdrop fade = "animate-in fade-in"; the panel's spring (opacity, scale 0.9, y 20)
//   = "fade-in zoom-in-90 slide-in-from-bottom-5 duration-300"; the success check's spring scale 0→1 =
//   "zoom-in-0 duration-500". The exit fades are dropped (quick fades only).
// - The submit button keeps its label with a Loader2 spinner (house rule 7) instead of "Claiming...".

const DISMISSED_KEY = "aqueous_referral_modal_dismissed";

function wasDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

const inputClass =
  "w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-primary/30 focus:outline-none";

export function ReferralClaimModal() {
  const { isReferred, referrerCode, alreadyClaimed: claimedBefore, claimReferral } = useReferral();
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [error, setError] = useState("");
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Show after a short delay if referred, not already claimed and not closed this session.
    if (!isReferred || !referrerCode || claimedBefore || wasDismissed()) return;
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, [isReferred, referrerCode, claimedBefore]);

  const handleClose = useCallback(() => {
    setShow(false);
    // Don't show again this session.
    try {
      sessionStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Storage blocked: closing still works for this page.
    }
  }, []);

  // Escape closes; the first field gets focus when the form opens.
  useEffect(() => {
    if (!show) return;
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, handleClose]);

  async function handleSubmit(values: ClaimValues, { setSubmitting }: FormikHelpers<ClaimValues>) {
    setError("");
    try {
      const name = values.name?.trim();
      const result = await claimReferral(values.email.trim(), name || undefined);
      if (result.alreadyClaimed) setAlreadyClaimed(true);
      else setSuccess(true);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className="referral-zone fixed inset-0 z-70 flex animate-in items-center justify-center p-4 duration-200 fade-in"
      id="referral-claim-modal"
      data-shareable
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md animate-in overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl duration-300 fade-in zoom-in-90 slide-in-from-bottom-5"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/50"
        >
          <X aria-hidden="true" className="size-4" />
        </button>

        {/* Decorative top bar */}
        <div className="h-1.5 bg-linear-to-r from-[#4ECDC4] via-[#0A8754] to-[#B87333]" />

        {success ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex size-16 animate-in items-center justify-center rounded-full bg-emerald-500/10 duration-500 zoom-in-0">
              <CheckCircle aria-hidden="true" className="size-8 text-emerald-500" />
            </div>
            <h3 id={titleId} className="font-aq-display mb-2 text-2xl font-bold">
              $5 Discount Claimed!
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Your $5 discount has been applied to your account. Use it on your first personalized AWI report.
            </p>
            <p className="mb-6 text-xs text-muted-foreground">The person who referred you also earned $5 credit. Everyone wins.</p>
            <Button onClick={handleClose} className="bg-[#4ECDC4] text-[#0A3D3D] hover:bg-[#3DBDB5]">
              Start Exploring
            </Button>
          </div>
        ) : alreadyClaimed ? (
          /* Already claimed state */
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-500/10">
              <Gift aria-hidden="true" className="size-8 text-amber-500" />
            </div>
            <h3 id={titleId} className="font-aq-display mb-2 text-2xl font-bold">
              Already Claimed
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This email has already claimed a referral discount. Your $5 credit is waiting for you.
            </p>
            <Button onClick={handleClose} variant="outline">
              Continue Browsing
            </Button>
          </div>
        ) : (
          /* Claim form */
          <div className="p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-[#4ECDC4]/20 to-[#0A8754]/20">
                <Gift aria-hidden="true" className="size-6 text-[#4ECDC4]" />
              </div>
              <div>
                <h3 id={titleId} className="font-aq-display text-xl font-bold">
                  You&apos;ve Been Gifted $5
                </h3>
                <p className="text-xs text-muted-foreground">
                  From referral code <span className="font-mono font-bold text-primary">{referrerCode}</span>
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Someone who cares about your water quality shared Aqueous with you. Enter your email to claim{" "}
              <span className="font-bold text-foreground">$5 off</span> your first personalized AWI report.
            </p>

            <Formik<ClaimValues> initialValues={{ name: "", email: "" }} validationSchema={claimSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, values }) => (
                <Form noValidate className="space-y-3">
                  <div>
                    <label htmlFor={nameId} className="mb-1 block text-xs font-medium text-muted-foreground">
                      Your name (optional)
                    </label>
                    <Field
                      innerRef={nameRef}
                      id={nameId}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="How should we address you?"
                      className={inputClass}
                    />
                    <ErrorMessage name="name">{(m) => <p className="mt-1 text-xs text-red-500">{m}</p>}</ErrorMessage>
                  </div>
                  <div>
                    <label htmlFor={emailId} className="mb-1 block text-xs font-medium text-muted-foreground">
                      Email address
                    </label>
                    <Field id={emailId} name="email" type="email" autoComplete="email" placeholder="your@email.com" required className={inputClass} />
                    <ErrorMessage name="email">{(m) => <p className="mt-1 text-xs text-red-500">{m}</p>}</ErrorMessage>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-lg bg-red-500/5 px-3 py-2 text-xs text-red-500">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !values.email}
                    aria-busy={isSubmitting}
                    className="w-full gap-2 bg-[#4ECDC4] font-semibold text-[#0A3D3D] hover:bg-[#3DBDB5]"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : (
                      <Sparkles aria-hidden="true" className="size-4" />
                    )}
                    Claim My $5 Discount
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="mt-4 text-center text-[10px] leading-relaxed text-muted-foreground">
              By claiming, you agree to receive occasional updates about your water quality. Unsubscribe anytime. We never sell your data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
