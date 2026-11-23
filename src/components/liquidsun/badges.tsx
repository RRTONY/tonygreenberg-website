import { Crown, DoorOpen, Flame, Sparkles } from "lucide-react";
import type { Producer } from "@/lib/content/liquidsun/producers";

// Ported from the LiquidSun app's client/src/components/TierBadge.tsx and FeaturedBadge.tsx
// (2026-11-21), with every variant's classes written out in full (Tailwind needs literal strings).

const tierConfig = {
  Unicorn: {
    icon: Crown,
    sm: "inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-1 font-mono text-[10px] tracking-wider text-purple-300 uppercase",
    md: "inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 font-mono text-xs tracking-wider text-purple-300 uppercase",
  },
  Legend: {
    icon: Flame,
    sm: "inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 font-mono text-[10px] tracking-wider text-amber-300 uppercase",
    md: "inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 font-mono text-xs tracking-wider text-amber-300 uppercase",
  },
  Gateway: {
    icon: DoorOpen,
    sm: "inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] tracking-wider text-emerald-300 uppercase",
    md: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs tracking-wider text-emerald-300 uppercase",
  },
} as const;

export function TierBadge({ tier, size = "sm" }: { tier: Producer["tier"]; size?: "sm" | "md" }) {
  const config = tierConfig[tier];
  const Icon = config.icon;
  return (
    <span className={config[size]}>
      <Icon aria-hidden="true" className={size === "md" ? "size-3.5" : "size-3"} />
      {tier}
    </span>
  );
}

const featuredConfig = {
  featured: {
    label: "Featured",
    icon: Sparkles,
    md: "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 font-mono text-[10px] tracking-widest text-amber-400 uppercase shadow-lg shadow-amber-500/10 backdrop-blur-sm",
    iconClass: "size-3",
  },
  spotlight: {
    label: "Spotlight Partner",
    icon: Crown,
    md: "inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 font-mono text-[10px] tracking-widest text-purple-400 uppercase shadow-lg shadow-purple-500/10 backdrop-blur-sm",
    iconClass: "size-3",
  },
  altar: {
    label: "Altar Selection",
    icon: Flame,
    md: "inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 font-mono text-[10px] tracking-widest text-rose-400 uppercase shadow-lg shadow-rose-500/10 backdrop-blur-sm",
    iconClass: "size-3 animate-pulse",
  },
} as const;

/** The app only ever rendered the default "md" size. */
export function FeaturedBadge({ partnerTier }: { partnerTier?: Producer["partnerTier"] }) {
  if (!partnerTier) return null;
  const config = featuredConfig[partnerTier];
  const Icon = config.icon;
  return (
    <span className={config.md}>
      <Icon aria-hidden="true" className={config.iconClass} />
      {config.label}
    </span>
  );
}
