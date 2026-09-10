"use client";

import { useEffect, useState } from "react";
import { Gem, Loader2, X } from "lucide-react";
import { readVisitorState, writeVisitorState } from "@/lib/visitor-state-client";

type NewsletterState = {
  popupShown?: boolean;
  subscribed?: boolean;
};

// Ported from legacy client/src/components/JewelPopup.tsx + the
// QuirkyEmailPopup wrapper in Blog.tsx — a glass-card newsletter invitation
// that appears 3 minutes into a visit, once per session, never again once
// engaged with. Only the canvas-based dust-mote particle field (a 60-particle
// requestAnimationFrame loop) is dropped — decoration not worth the JS/canvas
// cost, same reasoning as the homepage hero's particle canvas. The rotating
// aurora-nebula backdrop and sacred-geometry SVG are pure CSS/SVG with no JS
// loop — a real, visible part of this popup's identity that an earlier pass
// wrongly bundled in with the canvas drop; restored after comparing against
// a screenshot of the live popup. The prismatic border, glyph pulse,
// shimmering text, and CTA pulse are also real CSS keyframes and carry over.
// **Real button-copy bug also fixed**: this port previously read "Email Me
// to Subscribe" — legacy's actual button says "JOIN THE CONVERSATION".
//
// Legacy submitted straight to a tRPC subscribe mutation that (among other
// things) forwarded to Kit (ConvertKit). That real Kit forwarding now
// exists at /api/subscribe (see app/api/subscribe/route.ts) — submitting
// tries that first. A configuration or delivery failure stays visible to the
// visitor; the component never claims a subscription succeeded without a
// server-confirmed response.
export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    void readVisitorState<NewsletterState>("newsletter")
      .then((state) => {
        if (cancelled || state?.subscribed || state?.popupShown) return;
        timer = setTimeout(() => {
          setShow(true);
          void writeVisitorState("newsletter", { popupShown: true }).catch(() => undefined);
        }, 180_000);
      })
      .catch(() => {
        if (cancelled) return;
        timer = setTimeout(() => setShow(true), 180_000);
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (show) requestAnimationFrame(() => setMounted(true));
  }, [show]);

  if (!show) return null;

  const handleDismiss = () => setShow(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = (await res.json()) as { message?: string; success?: boolean };
      if (!res.ok || !data.success) throw new Error(data.message || "Newsletter service error");
      await writeVisitorState("newsletter", { popupShown: true, subscribed: true });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not complete your subscription. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center [perspective:1200px]"
      onClick={handleDismiss}
    >
      <div
        className={`absolute inset-0 bg-[#0D0B0A] transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 20%, rgba(61,139,110,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(184,90,90,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(196,132,29,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Aurora nebula layer — rotating conic-gradient blur, pure CSS */}
      <div
        className={`absolute inset-0 overflow-hidden transition-opacity duration-1500 ${mounted ? "opacity-40" : "opacity-0"}`}
      >
        <div
          className="absolute -inset-1/2 animate-jewel-aurora-rotate blur-[80px]"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg at 50% 50%, #C4841D22, #B85A5A22, #3D8B6E22, #C4841D22, #F5EDE022, #C4841D22)",
          }}
        />
      </div>

      {/* Sacred geometry — faint rotating SVG line drawing, pure CSS/SVG */}
      <div className={`transition-opacity duration-2000 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="animate-jewel-geo-rotate pointer-events-none absolute top-1/2 left-1/2 z-1 size-85 opacity-6"
        >
          <circle cx="100" cy="100" r="90" stroke="url(#jwlGrad)" strokeWidth="0.5" />
          <circle cx="100" cy="55" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
          <circle cx="100" cy="145" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
          <circle cx="61" cy="77" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
          <circle cx="139" cy="77" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
          <circle cx="61" cy="123" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
          <circle cx="139" cy="123" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
          <polygon
            points="100,10 177.3,55 177.3,145 100,190 22.7,145 22.7,55"
            stroke="url(#jwlGrad)"
            strokeWidth="0.4"
          />
          <polygon
            points="100,30 163,60 163,140 100,170 37,140 37,60"
            stroke="url(#jwlGrad)"
            strokeWidth="0.3"
          />
          <line x1="100" y1="10" x2="100" y2="190" stroke="url(#jwlGrad)" strokeWidth="0.2" />
          <line x1="22.7" y1="55" x2="177.3" y2="145" stroke="url(#jwlGrad)" strokeWidth="0.2" />
          <line x1="22.7" y1="145" x2="177.3" y2="55" stroke="url(#jwlGrad)" strokeWidth="0.2" />
          <defs>
            <linearGradient id="jwlGrad" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#C4841D" />
              <stop offset="33%" stopColor="#B85A5A" />
              <stop offset="66%" stopColor="#3D8B6E" />
              <stop offset="100%" stopColor="#C4841D" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-[90%] max-w-110 transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          mounted
            ? "translate-y-0 scale-100 opacity-100 [transform:translateY(0)_rotateX(0deg)]"
            : "translate-y-10 scale-95 opacity-0 [transform:translateY(40px)_rotateX(4deg)]"
        }`}
      >
        <div
          className="absolute -inset-0.5 animate-jewel-prismatic-shift rounded-3xl opacity-70 blur-[1px]"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, #C4841D88, #B85A5A66, #3D8B6E88, #C4841D44, #F5EDE066, #B85A5A88, #C4841D88)",
            backgroundSize: "200% 200%",
          }}
        />

        <div
          className="relative overflow-hidden rounded-[22px] border border-[#F5EDE0]/10 shadow-[0_40px_100px_rgba(0,0,0,0.5),0_15px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
          style={{
            backgroundImage:
              "linear-gradient(165deg, rgba(245,237,224,0.1) 0%, rgba(13,11,10,0.85) 30%, rgba(13,11,10,0.9) 70%, rgba(245,237,224,0.08) 100%)",
          }}
        >
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="absolute top-4 right-4 z-10 text-[#F5EDE0]/25 transition-colors hover:text-[#F5EDE0]/60"
          >
            <X className="size-4" />
          </button>

          <div className="relative z-10 px-9 pt-11 pb-9">
            {submitted ? (
              <div className="animate-jewel-content-fade text-center">
                <div className="mb-5 animate-jewel-glyph-pulse text-2xl text-[#C4841D] drop-shadow-[0_0_15px_rgba(196,132,29,0.5)]">
                  <Gem aria-hidden="true" className="mx-auto size-7" />
                </div>
                <h3
                  className="mb-3 animate-jewel-text-prismatic bg-clip-text font-heading text-[clamp(1.5rem,4vw,1.9rem)] leading-snug text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #C4841D, #F5EDE0, #B85A5A, #3D8B6E, #C4841D)",
                    backgroundSize: "300% auto",
                  }}
                >
                  You&apos;re in.
                </h3>
                <p className="mx-auto mb-7 max-w-85 text-sm leading-relaxed text-[#F5EDE0]/50">
                  You&apos;re on the list — no schedule, no algorithm, just the things I can&apos;t
                  stop thinking about.
                </p>
                <div
                  className="mx-auto mb-6 h-px max-w-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, transparent, #C4841D55, #B85A5A44, #3D8B6E55, transparent)",
                  }}
                />
                <button
                  onClick={handleDismiss}
                  className="rounded-[10px] border border-[#F5EDE0]/15 px-10 py-2.5 text-sm text-[#F5EDE0]/60 italic transition-all hover:border-[#C4841D]/40 hover:text-[#F5EDE0]/90"
                >
                  keep exploring
                </button>
              </div>
            ) : (
              <div className="animate-jewel-content-fade">
                <div className="mb-4 text-center text-2xl animate-jewel-glyph-pulse text-[#C4841D] drop-shadow-[0_0_12px_rgba(196,132,29,0.4)]">
                  <Gem aria-hidden="true" className="mx-auto size-7" />
                </div>
                <div className="mb-4 text-center font-mono text-xs tracking-[0.25em] text-[#C4841D]/50 uppercase">
                  Still here? Good.
                </div>
                <h3 className="mb-2 text-center font-heading text-[clamp(1.5rem,4vw,1.85rem)] leading-snug text-[#F5EDE0]/90">
                  Most people scroll past.
                  <br />
                  <span
                    className="animate-jewel-text-prismatic bg-clip-text text-transparent italic"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #C4841D, #F5EDE0, #B85A5A, #3D8B6E, #C4841D)",
                      backgroundSize: "300% auto",
                    }}
                  >
                    You read.
                  </span>
                </h3>
                <p className="mx-auto mb-8 max-w-90 text-center text-sm leading-relaxed text-[#F5EDE0]/45">
                  That puts you in rare company. New essays, provocations, and the occasional
                  behind-the-scenes dispatch from the front lines. Arrives when it arrives. No spam.
                  No algorithm.
                </p>

                <form onSubmit={handleSubmit} className="mx-auto max-w-90">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mb-3.5 w-full rounded-xl border border-[#F5EDE0]/10 bg-[#F5EDE0]/4 px-5 py-4 text-[#F5EDE0] outline-none transition-colors focus:border-[#C4841D]/30 focus:bg-[#F5EDE0]/8"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full animate-jewel-cta-pulse rounded-xl py-4 font-mono text-xs font-semibold tracking-[0.18em] text-[#F5EDE0] uppercase transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #C4841D 0%, #B85A5A 50%, #3D8B6E 100%)",
                    }}
                  >
                    {isSubmitting && (
                      <Loader2 aria-hidden="true" className="mr-2 inline size-4 animate-spin" />
                    )}
                    Join the Conversation
                  </button>
                </form>

                {error && (
                  <p role="alert" className="mt-3 text-center text-sm text-red-300">
                    {error}
                  </p>
                )}

                <p className="mt-4 text-center text-xs text-[#F5EDE0]/20 italic">
                  Unsubscribe anytime. I&apos;ll survive.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
