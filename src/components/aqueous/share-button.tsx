"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Copy, Gift, Loader2, Mail, MessageCircle, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { useReferral } from "@/components/aqueous/aqueous-providers";
import { aq } from "@/lib/content/aqueous/nav";
import { cn } from "@/lib/utils";

// Ported from the Aqueous app's client/src/components/ShareButton.tsx (2026-11-24).
// ShareButton: the viral sharing component used across the section (copy link, X, WhatsApp, Email),
// plus FloatingShare and ReferralBanner. Shared links are this site's /aqueous URLs.
// Changes from the app:
// - The app always added ?ref=<code>, and with no code yet it shared "?ref=LOADING". Here a referral
//   code only exists for signed-in members (useReferral().stats), so links and the "Use my code"
//   line carry it only then; signed-out visitors get the plain page link and a sign-in link where the
//   app printed the code (fix-from-live: "LOADING" was shown and shared as if it were a code).
// - framer-motion: the dropdowns' AnimatePresence (opacity/scale or y:-4) are conditional renders
//   with tw-animate enter classes (the exit was only a quick fade); FloatingShare's
//   initial={{ opacity: 0, x: 20 }} transition={{ delay: 1 }} is "slide-in-from-right-5 delay-1000";
//   ReferralBanner's height 0→auto is a fade + slide from the top.

const SITE_ORIGIN = "https://tonygreenberg.com";
const noopSubscribe = () => () => {};

function useOrigin() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => SITE_ORIGIN,
  );
}

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: "icon" | "button" | "inline" | "card";
  className?: string;
}

export function ShareButton({
  title = "Aqueous — Know Your Water",
  text = "Discover the truth about your water. Get your personalized AWI score — where 1 is perfection.",
  url,
  variant = "button",
  className = "",
}: ShareButtonProps) {
  const { stats, trackShare, loading } = useReferral();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const pathname = usePathname() || aq("/");

  const code = stats?.code ?? null;
  // A relative url ("/aqueous/x") is made absolute so the shared link works off-site.
  const base = url ? (url.startsWith("/") ? `${origin}${url}` : url) : `${origin}${pathname}`;
  const shareUrl = code ? `${base}${base.includes("?") ? "&" : "?"}ref=${code}` : base;
  const shareText = code ? `${text}\n\nUse my code ${code} for $5 off your first report.` : text;
  const signInHref = `/login?next=${encodeURIComponent(pathname)}`;

  const codeLabel = code ? (
    <span className="font-mono font-bold text-primary">{code}</span>
  ) : loading ? (
    <Loader2 aria-label="Loading your code" className="inline size-3 animate-spin text-primary" />
  ) : (
    <Link href={signInHref} className="font-bold text-primary underline-offset-2 hover:underline">
      sign in to get yours
    </Link>
  );

  function copyLink(message: string) {
    void navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    toast.success(message);
    trackShare();
    setTimeout(() => setCopied(false), 2000);
  }

  const platforms = [
    {
      name: "X / Twitter",
      icon: <X aria-hidden="true" className="size-4" />,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        trackShare();
      },
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle aria-hidden="true" className="size-4" />,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, "_blank");
        trackShare();
      },
    },
    {
      name: "Email",
      icon: <Mail aria-hidden="true" className="size-4" />,
      action: () => {
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, "_blank");
        trackShare();
      },
    },
    {
      name: "Copy Link",
      icon: copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />,
      action: () => copyLink(code ? "Link copied with your referral code!" : "Link copied!"),
    },
  ];

  if (variant === "icon") {
    return (
      <div className={cn("share-zone relative", className)} data-shareable>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label="Share"
          aria-expanded={open}
        >
          <Share2 aria-hidden="true" className="size-4" />
        </button>
        {open && (
          <div className="glass-card absolute top-full right-0 z-50 mt-2 min-w-40 animate-in rounded-xl border border-border/40 p-2 shadow-lg duration-200 fade-in zoom-in-90">
            {platforms.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  p.action();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
              >
                {p.icon}
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("share-zone flex items-center gap-1", className)} data-shareable>
        {platforms.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={p.action}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
            title={p.name}
            aria-label={p.name}
          >
            {p.icon}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("glass-card share-zone rounded-2xl border border-border/40 p-6", className)} data-shareable>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Share2 aria-hidden="true" className="size-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Share the Flow</h4>
            <p className="text-xs text-muted-foreground">Your code: {codeLabel}</p>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Every friend who signs up gets <span className="font-bold text-foreground">$5 off</span>. You earn{" "}
          <span className="font-bold text-foreground">$5 credit</span>. Refer 10 who sign up and unlock a{" "}
          <span className="font-bold text-primary">free personalized report</span>.
        </p>
        <div className="mb-3 flex items-center gap-2">
          <input
            readOnly
            value={shareUrl}
            aria-label="Your share link"
            className="min-w-0 flex-1 truncate rounded-lg border border-border/40 bg-muted/30 px-3 py-2 font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => copyLink("Link copied!")}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {platforms
            .filter((p) => p.name !== "Copy Link")
            .map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={p.action}
                aria-label={p.name}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/40 py-2 text-xs font-medium transition-colors hover:bg-muted/50"
              >
                {p.icon}
                <span className="hidden sm:inline">{p.name.split(" ")[0]}</span>
              </button>
            ))}
        </div>
        {stats && stats.shares > 0 && (
          <div className="mt-3 border-t border-border/30 pt-3 text-center text-xs text-muted-foreground">
            You&apos;ve shared {stats.shares} time{stats.shares !== 1 ? "s" : ""} · {stats.signups}/10 sign-ups toward free report
          </div>
        )}
        {stats?.freeReportUnlocked && (
          <div className="mt-3 flex items-center justify-center gap-2 border-t border-emerald-500/30 pt-3 text-sm font-semibold text-emerald-600">
            <Gift aria-hidden="true" className="size-4" />
            Free report unlocked!
          </div>
        )}
      </div>
    );
  }

  // Default: button variant
  return (
    <div className={cn("share-zone relative", className)} data-shareable>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <Share2 aria-hidden="true" className="size-4" />
        Share & Earn $5
      </button>
      {open && (
        <div className="glass-card absolute top-full right-0 z-50 mt-2 min-w-55 animate-in rounded-xl border border-border/40 p-3 shadow-lg duration-200 fade-in slide-in-from-top-1">
          <p className="mb-2 px-1 text-xs text-muted-foreground">Your code: {codeLabel}</p>
          {platforms.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                p.action();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
            >
              {p.icon}
              <span>{p.name}</span>
            </button>
          ))}
          <div className="mt-2 border-t border-border/30 px-1 pt-2">
            <p className="text-[10px] text-muted-foreground">Friends get $5 off · You earn $5 · 10 sign-ups = free report</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Floating share widget for pages.
// The app's floating button opened its menu downward (top-full) from the bottom-right corner, off
// screen; it is the same ShareButton, so the menu placement stays as the app had it.
export function FloatingShare() {
  return (
    <div
      className="share-zone fixed right-6 bottom-6 z-40 animate-in delay-1000 duration-500 fill-mode-both fade-in slide-in-from-right-5"
      id="floating-share"
      data-shareable
    >
      <ShareButton variant="button" />
    </div>
  );
}

// Referral banner for the top of pages: shows when a visitor arrives via a ?ref= link and hasn't claimed.
export function ReferralBanner() {
  const { isReferred, referrerCode, alreadyClaimed } = useReferral();
  const [dismissed, setDismissed] = useState(false);

  if (!isReferred || dismissed || alreadyClaimed) return null;

  return (
    <div
      className="referral-zone fixed top-0 right-0 left-0 z-60 animate-in bg-primary px-4 py-2 text-center text-sm text-primary-foreground duration-500 fade-in slide-in-from-top-2"
      id="referral-banner"
      data-shareable
    >
      <span className="font-medium">Welcome!</span> You were referred by code <span className="font-mono font-bold">{referrerCode}</span> —
      enjoy <span className="font-bold">$5 off</span> your first personalized report.
      <button type="button" onClick={() => setDismissed(true)} className="ml-3 text-xs underline opacity-80 hover:opacity-100">
        Dismiss
      </button>
    </div>
  );
}
