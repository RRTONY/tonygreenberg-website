// The Sommelier Card's two looks: the app's `isAustere ? ... : ...` style tokens
// (SommelierCard.tsx "Style tokens"), as full class strings.

export const sommelierLooks = {
  kintsugi: {
    gold: "text-[#c9a227]",
    goldBg: "bg-[#c9a227]/10",
    goldBorder: "border-[#c9a227]/30",
    goldCorner: "border-[#c9a227]",
    goldBar: "bg-[#c9a227]",
    idleBar: "bg-[#1a2035]",
    cardBg: "bg-[#0d1321]/80",
    cardBorder: "border-[#1a2035]",
    textMain: "text-[#e8e2d6]",
    textMuted: "text-[#e8e2d6]/60",
    page: "min-h-screen bg-[#0a0e1a] text-[#e8e2d6]",
    input: "bg-[#0d1321] border-[#1a2035]",
    h1: "font-sk-display text-5xl sm:text-6xl lg:text-7xl font-bold",
    shimmer: "text-[#c9a227] gold-shimmer",
    card: "relative overflow-hidden border-2 border-[#c9a227]/30 bg-linear-135 from-[#0d1321] via-[#1a2035] to-[#0d1321]",
  },
  austere: {
    gold: "text-red-800",
    goldBg: "bg-red-800/10",
    goldBorder: "border-red-800/30",
    goldCorner: "border-[#8B0000]",
    goldBar: "bg-red-800",
    idleBar: "bg-stone-300",
    cardBg: "bg-stone-100",
    cardBorder: "border-stone-300",
    textMain: "text-stone-900",
    textMuted: "text-stone-600",
    page: "min-h-screen bg-stone-50 text-stone-900",
    input: "bg-white border-stone-300",
    h1: "font-sk-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-wider",
    shimmer: "text-red-800",
    card: "relative overflow-hidden border-2 border-red-800/30 bg-[#f5f0e8]",
  },
} as const;

export type SommelierLook = (typeof sommelierLooks)[keyof typeof sommelierLooks];
