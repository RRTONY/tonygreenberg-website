// Precomposed classes for the five carbon-tier colors in supply-chain-engine.ts `carbonTiers`
// (the app painted them with style={{ color: tier.color }}). Literal strings so Tailwind generates
// them; an unknown color falls back to the "Medium" amber. Used by the Ordering Guide, Supply Chain
// page and Dollar Map.

export type TierClasses = { text: string; bg: string; border: string; soft: string; bar: string };

const TIERS: Record<string, TierClasses> = {
  "#22c55e": {
    text: "text-[#22c55e]",
    bg: "bg-[#22c55e]",
    border: "border-[#22c55e]",
    soft: "bg-[#22c55e]/10 border-[#22c55e]/40",
    bar: "bg-[#22c55e]",
  },
  "#84cc16": {
    text: "text-[#84cc16]",
    bg: "bg-[#84cc16]",
    border: "border-[#84cc16]",
    soft: "bg-[#84cc16]/10 border-[#84cc16]/40",
    bar: "bg-[#84cc16]",
  },
  "#eab308": {
    text: "text-[#eab308]",
    bg: "bg-[#eab308]",
    border: "border-[#eab308]",
    soft: "bg-[#eab308]/10 border-[#eab308]/40",
    bar: "bg-[#eab308]",
  },
  "#f97316": {
    text: "text-[#f97316]",
    bg: "bg-[#f97316]",
    border: "border-[#f97316]",
    soft: "bg-[#f97316]/10 border-[#f97316]/40",
    bar: "bg-[#f97316]",
  },
  "#ef4444": {
    text: "text-[#ef4444]",
    bg: "bg-[#ef4444]",
    border: "border-[#ef4444]",
    soft: "bg-[#ef4444]/10 border-[#ef4444]/40",
    bar: "bg-[#ef4444]",
  },
};

export function tierClasses(color: string): TierClasses {
  return TIERS[color.toLowerCase()] ?? TIERS["#eab308"];
}
