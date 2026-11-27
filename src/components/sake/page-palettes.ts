// Two color sets the Sake app's pages picked in JS with `isAustere ? austere : kintsugi`, as full
// literal Tailwind class strings (never assembled from fragments, so Tailwind sees every class).
//
// - `guidePalette`: the "Kintsugi Noir / Austere adaptive" guide pages (Ceremony, Retailers, Value
//   Matrix, Food Pairing...): gold #c9a227 on deep navy, or red-800 on stone in Austere.
// - `ritualPalette`: the pages that used inline hex styles (Longevity Recipes, Your Sake Profile):
//   gold #c9a227 / vermillion #c53d43, navy #0d1321 / paper #f5f0e8.

export type GuidePalette = {
  page: string;
  gold: string;
  goldBorder: string;
  goldBg: string;
  card: string;
  textMain: string;
  textMuted: string;
  /** Selected pill/tab: border, text and wash. */
  activePill: string;
  /** Unselected pill/tab. */
  idlePill: string;
  /** A soft inner panel (Food Pairing temperature/avoid boxes). */
  innerPanel: string;
  /** A meter's empty track. */
  track: string;
  /** A meter's filled bar. */
  bar: string;
};

const GUIDE_KINTSUGI: GuidePalette = {
  page: "bg-[#0a0e1a] text-[#e8e2d6]",
  gold: "text-[#c9a227]",
  goldBorder: "border-[#c9a227]/30",
  goldBg: "bg-[#c9a227]/10",
  card: "bg-[#0d1321]/80",
  textMain: "text-[#e8e2d6]",
  textMuted: "text-[#e8e2d6]/60",
  activePill: "border-[#c9a227]/30 text-[#c9a227] bg-[#c9a227]/10",
  idlePill: "border-transparent text-[#e8e2d6]/60 hover:text-[#c9a227]",
  innerPanel: "bg-white/5",
  track: "bg-white/10",
  bar: "bg-[oklch(0.78_0.12_85)]",
};

const GUIDE_AUSTERE: GuidePalette = {
  page: "bg-stone-50 text-stone-900",
  gold: "text-red-800",
  goldBorder: "border-red-800/30",
  goldBg: "bg-red-800/10",
  card: "bg-stone-100",
  textMain: "text-stone-900",
  textMuted: "text-stone-600",
  activePill: "border-red-800/30 text-red-800 bg-red-800/10",
  idlePill: "border-transparent text-stone-600 hover:text-red-800",
  innerPanel: "bg-stone-200/50",
  track: "bg-stone-300",
  bar: "bg-[oklch(0.52_0.19_30)]",
};

export function guidePalette(isAustere: boolean): GuidePalette {
  return isAustere ? GUIDE_AUSTERE : GUIDE_KINTSUGI;
}

export type RitualPalette = {
  page: string;
  gold: string;
  goldBg: string;
  goldBorder: string;
  /** rgba(201,162,39,0.15) wash (the app's goldDim). */
  goldDimBg: string;
  goldDimBorder: string;
  /** rgba(201,162,39,0.3) border (the app's goldMid). */
  goldMidBorder: string;
  /** Text on a solid gold fill. */
  onGold: string;
  muted: string;
  softText: string;
  faint: string;
  panel: string;
  panelBorder: string;
  /** Darker note box (Longevity "Science Note"). */
  noteBg: string;
  track: string;
};

const RITUAL_KINTSUGI: RitualPalette = {
  page: "bg-[#0d1321] text-[#e8e0d0]",
  gold: "text-[#c9a227]",
  goldBg: "bg-[#c9a227]",
  goldBorder: "border-[#c9a227]",
  goldDimBg: "bg-[rgba(201,162,39,0.15)]",
  goldDimBorder: "border-[rgba(201,162,39,0.15)]",
  goldMidBorder: "border-[rgba(201,162,39,0.3)]",
  onGold: "text-[#0d1321]",
  muted: "text-[#8a8070]",
  softText: "text-[#c0b8a8]",
  faint: "text-[#666]",
  panel: "bg-white/3",
  panelBorder: "border-white/6",
  noteBg: "bg-black/30",
  track: "bg-white/6",
};

const RITUAL_AUSTERE: RitualPalette = {
  page: "bg-[#f5f0e8] text-[#2c2c2c]",
  gold: "text-[#c53d43]",
  goldBg: "bg-[#c53d43]",
  goldBorder: "border-[#c53d43]",
  goldDimBg: "bg-[rgba(197,61,67,0.15)]",
  goldDimBorder: "border-[rgba(197,61,67,0.15)]",
  goldMidBorder: "border-[rgba(197,61,67,0.3)]",
  onGold: "text-[#f5f0e8]",
  muted: "text-[#666]",
  softText: "text-[#555]",
  faint: "text-[#888]",
  panel: "bg-black/3",
  panelBorder: "border-black/6",
  noteBg: "bg-black/4",
  track: "bg-black/6",
};

export function ritualPalette(isAustere: boolean): RitualPalette {
  return isAustere ? RITUAL_AUSTERE : RITUAL_KINTSUGI;
}
