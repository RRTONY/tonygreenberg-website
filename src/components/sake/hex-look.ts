// The hex palette a few Sake app pages (SpiritualRealms.tsx, SpeakingGuide.tsx...) picked in JS per
// look, `isAustere ? austere : kintsugi`. Each pair is one literal class string here, the Austere
// value behind `[.sake-austere_&]:` (the section wrapper carries .sake-austere), so pages need no
// inline styles and no JS branching for color.

export const HEX = {
  gold: "text-[#c9a227] [.sake-austere_&]:text-red-800",
  goldHover: "hover:text-[#c9a227] [.sake-austere_&]:hover:text-red-800",
  goldBorder: "border-[#c9a227]/30 [.sake-austere_&]:border-red-800/30",
  goldWash: "bg-[#c9a227]/10 [.sake-austere_&]:bg-red-800/10",
  cardBg: "bg-[#0d1321]/80 [.sake-austere_&]:bg-stone-100",
  panelBg: "bg-white/5 [.sake-austere_&]:bg-stone-200/50",
  textMain: "text-[#e8e2d6] [.sake-austere_&]:text-stone-900",
  textMuted: "text-[#e8e2d6]/60 [.sake-austere_&]:text-stone-600",
  pageBg: "bg-[#0a0e1a] [.sake-austere_&]:bg-stone-50",
} as const;
