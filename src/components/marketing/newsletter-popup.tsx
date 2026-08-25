"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

// Ported from legacy client/src/components/JewelPopup.tsx + the
// QuirkyEmailPopup wrapper in Blog.tsx — a glass-card newsletter invitation
// that appears 3 minutes into a visit, once per session, never again once
// engaged with. The canvas particle field and rotating sacred-geometry SVG
// were dropped (decoration not worth the JS/canvas cost, same reasoning as
// the homepage hero's particle canvas); the prismatic border, glyph pulse,
// shimmering text, and CTA pulse are real CSS keyframes and carry over.
//
// Legacy submitted straight to a tRPC subscribe mutation — no such backend
// exists yet in this app (Supabase setup is still pending), so submitting
// opens the visitor's own email client via a pre-filled mailto: instead of
// a fake success state. The confirmation copy reflects that honestly
// ("send it and you're in") rather than claiming they're already
// subscribed.
export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("tg-popup-shown")) return;
    try {
      if (localStorage.getItem("tg_subscribed") === "true") return;
    } catch {}
    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("tg-popup-shown", "1");
    }, 180_000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (show) requestAnimationFrame(() => setMounted(true));
  }, [show]);

  if (!show) return null;

  const handleDismiss = () => setShow(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent("Subscribe me to the newsletter");
    const body = encodeURIComponent(`Please add this address to the list: ${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    try {
      localStorage.setItem("tg_subscribed", "true");
    } catch {}
    setSubmitted(true);
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
                  ◆
                </div>
                <h3
                  className="mb-3 animate-jewel-text-prismatic bg-clip-text font-heading text-[clamp(1.5rem,4vw,1.9rem)] leading-snug text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #C4841D, #F5EDE0, #B85A5A, #3D8B6E, #C4841D)",
                    backgroundSize: "300% auto",
                  }}
                >
                  Almost there.
                </h3>
                <p className="mx-auto mb-7 max-w-85 text-sm leading-relaxed text-[#F5EDE0]/50">
                  Your email app just opened with a note ready to go. Send it, and you&apos;re on
                  the list — no schedule, no algorithm, just the things I can&apos;t stop thinking
                  about.
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
                  ◆
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
                      backgroundImage: "linear-gradient(135deg, #C4841D, #F5EDE0, #B85A5A, #3D8B6E, #C4841D)",
                      backgroundSize: "300% auto",
                    }}
                  >
                    You read.
                  </span>
                </h3>
                <p className="mx-auto mb-8 max-w-90 text-center text-sm leading-relaxed text-[#F5EDE0]/45">
                  That puts you in rare company. New essays, provocations, and the occasional
                  behind-the-scenes dispatch from the front lines. Arrives when it arrives. No
                  spam. No algorithm.
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
                    className="w-full animate-jewel-cta-pulse rounded-xl py-4 font-mono text-xs font-semibold tracking-[0.18em] text-[#F5EDE0] uppercase transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #C4841D 0%, #B85A5A 50%, #3D8B6E 100%)",
                    }}
                  >
                    Email Me to Subscribe
                  </button>
                </form>

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
