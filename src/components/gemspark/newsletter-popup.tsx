"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Loader2, Mail, Sparkles, X } from "lucide-react";

// Ported from the GemSpark app's components/NewsletterPopup.tsx (short version only). Same copy,
// triggers and localStorage keys: it opens after `delaySeconds` or at `scrollTriggerPercent`
// scroll, once, and never again after a signup or a dismissal. Signups go to Kit through
// /api/subscribe with the app's source "short-form-popup" (tag "GemSpark: Newsletter"), like every
// other signup on this site. framer-motion's fade/spring became tw-animate-css classes.

interface NewsletterPopupProps {
  /** Delay in seconds before showing popup (default: 30) */
  delaySeconds?: number;
  /** Scroll percentage (0-100) to trigger popup (default: 50) */
  scrollTriggerPercent?: number;
  /** Enable time-based trigger (default: true) */
  enableTimeDelay?: boolean;
  /** Enable scroll-based trigger (default: true) */
  enableScrollTrigger?: boolean;
}

const SUBSCRIBED_KEY = "newsletter_subscribed";
const DISMISSED_KEY = "newsletter_dismissed";

function readFlag(key: string): boolean {
  try {
    return Boolean(window.localStorage.getItem(key));
  } catch {
    return false;
  }
}

function writeFlag(key: string) {
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    // Private mode or blocked storage: the popup may show again next visit, nothing else breaks.
  }
}

export function NewsletterPopup({
  delaySeconds = 30,
  scrollTriggerPercent = 50,
  enableTimeDelay = true,
  enableScrollTrigger = true,
}: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasTriggered, setHasTriggered] = useState(false);

  // Check if popup should be shown
  const shouldShowPopup = useCallback(
    () => !readFlag(SUBSCRIBED_KEY) && !readFlag(DISMISSED_KEY) && !hasTriggered,
    [hasTriggered],
  );

  // Trigger the popup
  const triggerPopup = useCallback(() => {
    if (shouldShowPopup()) {
      setIsVisible(true);
      setHasTriggered(true);
    }
  }, [shouldShowPopup]);

  // Time-based trigger
  useEffect(() => {
    if (!enableTimeDelay || !shouldShowPopup()) return;
    const timer = setTimeout(triggerPopup, delaySeconds * 1000);
    return () => clearTimeout(timer);
  }, [delaySeconds, enableTimeDelay, shouldShowPopup, triggerPopup]);

  // Scroll-based trigger
  useEffect(() => {
    if (!enableScrollTrigger || !shouldShowPopup()) return;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      if (scrollPercent >= scrollTriggerPercent) triggerPopup();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollTriggerPercent, enableScrollTrigger, shouldShowPopup, triggerPopup]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    writeFlag(DISMISSED_KEY);
  }, []);

  // Escape closes it like the close button (keyboard users had no way out on the app).
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, handleClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "short-form-popup" }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus("success");
        // Store in localStorage to prevent showing again
        writeFlag(SUBSCRIBED_KEY);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gemspark-newsletter-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#95A5A6] transition-colors hover:text-[#2C3E50]"
            aria-label="Close"
          >
            <X aria-hidden="true" className="size-6" />
          </button>

          {status === "success" ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                <Sparkles aria-hidden="true" className="size-8 text-green-600" />
              </div>
              <h3 id="gemspark-newsletter-title" className="mb-2 font-serif text-2xl text-[#2C3E50] italic">
                You&apos;re In!
              </h3>
              <p className="font-light text-[#5D6D7E]">
                Thanks for joining. Look out for the next spark in your inbox.
              </p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#D4E6F1]">
                <Sparkles aria-hidden="true" className="size-8 text-[#2C3E50]" />
              </div>

              {/* Content */}
              <h3 id="gemspark-newsletter-title" className="mb-2 text-center font-serif text-2xl text-[#2C3E50] italic">
                Catch the Next Spark
              </h3>
              <p className="mb-6 text-center font-light text-[#5D6D7E]">
                Join the newsletter for more stories about serendipity, synchronicity, and the patterns hiding in
                plain sight.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#95A5A6]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="w-full rounded-xl border-none bg-[#F8F9F9] py-3 pr-4 pl-12 text-[#2C3E50] transition-all placeholder:text-[#95A5A6] focus:ring-2 focus:ring-[#D4E6F1]"
                    required
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="text-center text-sm text-red-500">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C3E50] py-3 font-medium text-white transition-colors hover:bg-[#1A252F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" && <Loader2 aria-hidden="true" className="size-5 animate-spin" />}
                  <span>Subscribe</span>
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-[#95A5A6]">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
