import { useAesthetic } from "@/components/sake/sake-providers";

// The "style tokens" the Sake app's tool pages (DealAlerts, SakeScanner, MenuAnalyzer, QPRRankings...)
// each declared at the top: one class per role, Kintsugi or Austere. Kept as complete literal class
// strings per look (Tailwind only sees whole strings; the app built some by string replacement, e.g.
// goldBorder.replace('border-', 'border-b-'), which never produced CSS) — `tabActive` is that one
// spelled out. Use: `const k = useToolPalette();` then `className={`p-5 border ${k.cardBorder} ${k.cardBg}`}`.

const KINTSUGI = {
  gold: "text-[#c9a227]",
  goldBg: "bg-[#c9a227]/10",
  goldBorder: "border-[#c9a227]/30",
  tabActive: "text-[#c9a227] border-b-[#c9a227]/30",
  cardBg: "bg-[#0d1321]/80",
  cardBorder: "border-[#1a2035]",
  textMain: "text-[#e8e2d6]",
  textMuted: "text-[#e8e2d6]/60",
  pageBg: "bg-[#0a0e1a]",
  inputBg: "bg-[#0d1321] border-[#1a2035]",
  hoverBg: "hover:bg-[#1a2035]",
  hoverGold: "hover:text-[#c9a227]",
  focusGold: "focus:border-[#c9a227]/50",
  ringUnread: "ring-1 ring-[#c9a227]/20",
  glow: "bg-[radial-gradient(circle_at_50%_50%,#c9a22720,transparent_70%)]",
} as const;

const AUSTERE = {
  gold: "text-red-800",
  goldBg: "bg-red-800/10",
  goldBorder: "border-red-800/30",
  tabActive: "text-red-800 border-b-red-800/30",
  cardBg: "bg-stone-100",
  cardBorder: "border-stone-300",
  textMain: "text-stone-900",
  textMuted: "text-stone-600",
  pageBg: "bg-stone-50",
  inputBg: "bg-white border-stone-300",
  hoverBg: "hover:bg-stone-200",
  hoverGold: "hover:text-red-800",
  focusGold: "focus:border-red-800/50",
  ringUnread: "ring-1 ring-red-800/20",
  glow: "bg-[radial-gradient(circle_at_50%_50%,#8B000020,transparent_70%)]",
} as const;

export type ToolPalette = { [K in keyof typeof KINTSUGI]: string } & { isAustere: boolean };

export function useToolPalette(): ToolPalette {
  const { isAustere } = useAesthetic();
  return { ...(isAustere ? AUSTERE : KINTSUGI), isAustere };
}
