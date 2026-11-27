"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { useMember } from "@/components/liquidsun/liquidsun-providers";

// Ported from the LiquidSun app's client/src/components/GatedContent.tsx (2026-11-21). Buy links
// and panel scores stay blurred behind a free sign-in, as on the app; "premium" content needs a
// LiquidSun Premium subscription. The app sent visitors to Manus's login; this links to the site's
// own /login and comes back to the same page afterwards.

const ctaMessages = {
  buy: "Sign in free to see where to buy",
  score: "Sign in free to see panel scores",
  review: "Sign in free to read reviews",
  premium: "Upgrade to Premium for full access",
};

export type GateType = keyof typeof ctaMessages;

/** Where a locked teaser sends the visitor: /login?next=<this page>, or the Premium page. */
export function useGateHref(type: GateType) {
  const pathname = usePathname() || "/liquid-sun";
  return type === "premium" ? "/liquid-sun/premium" : `/login?next=${encodeURIComponent(pathname)}`;
}

function useUnlocked(type: GateType, forceShow: boolean) {
  const { signedIn, isPremium } = useMember();
  if (forceShow) return true;
  return type === "premium" ? isPremium : signedIn;
}

export function GatedContent({
  children,
  placeholder,
  type = "buy",
  forceShow = false,
}: {
  children: ReactNode;
  /** What to show as a teaser when content is locked */
  placeholder?: ReactNode;
  type?: GateType;
  /** Always show the content */
  forceShow?: boolean;
}) {
  const unlocked = useUnlocked(type, forceShow);
  const href = useGateHref(type);
  if (unlocked) return <>{children}</>;

  return (
    <Link href={href} className="group relative block cursor-pointer" aria-label={ctaMessages[type]}>
      <span aria-hidden="true" className="pointer-events-none block opacity-50 blur-[6px] select-none">
        {placeholder ?? children}
      </span>
      <span className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/20 backdrop-blur-[1px] transition-all group-hover:bg-black/40">
        <span className="flex items-center gap-2 rounded-full bg-amber-600/90 px-4 py-2 font-mono text-[10px] tracking-widest text-black uppercase shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-500">
          <Lock aria-hidden="true" className="size-3" />
          {ctaMessages[type]}
        </span>
      </span>
    </Link>
  );
}

/** Simpler inline gate: just blurs a single value like a price or score. */
export function GatedValue({ children, type = "score" }: { children: ReactNode; type?: "buy" | "score" }) {
  const unlocked = useUnlocked(type, false);
  const href = useGateHref(type);
  if (unlocked) return <>{children}</>;
  return (
    <Link href={href} className="group relative inline-flex cursor-pointer items-center" aria-label={ctaMessages[type]}>
      <span aria-hidden="true" className="pointer-events-none opacity-60 blur-[5px] select-none">
        {children}
      </span>
      <Lock
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-amber-500 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}
