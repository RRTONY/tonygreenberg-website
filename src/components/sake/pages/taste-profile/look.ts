// The Taste Profile's two looks (the app's `isAustere ? ... : ...` tokens in TasteProfile.tsx) as full
// class strings. The app's option hover colors were built from fragments (`hover:${goldBg}`,
// `group-hover:${gold}`), which never produced CSS; they are written out here so the hover works.

export const tasteLooks = {
  kintsugi: {
    page: "min-h-screen bg-[#0a0e1a] text-[#e8e2d6]",
    gold: "text-[#c9a227]",
    goldBorder: "border-[#c9a227]/30",
    cardBg: "bg-[#0d1321]/80",
    textMain: "text-[#e8e2d6]",
    textMuted: "text-[#e8e2d6]/60",
    heroOverlay: "absolute inset-0 bg-linear-to-b from-[#0a0e1a]/60 via-[#0a0e1a]/40 to-[#0a0e1a]",
    glass:
      "rounded-2xl p-10 md:p-14 bg-white/5 border border-white/10 backdrop-blur-[20px] backdrop-saturate-140 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
    barDone: "bg-[#c9a227]/60",
    barNow: "bg-[#c9a227]",
    barIdle: "bg-white/10",
    option:
      "w-full text-left p-5 border border-[#c9a227]/30 rounded-sm transition-all duration-300 group hover:bg-[#c9a227]/10 hover:border-[#c9a227]/60",
    optionText: "text-base text-[#e8e2d6] group-hover:text-[#c9a227] transition-colors",
    optionIcon: "size-4 text-[#e8e2d6]/60 group-hover:text-[#c9a227] transition-all group-hover:translate-x-1",
    bottle: "block border-l-2 border-[#c9a227]/30 pl-5 hover:bg-[oklch(0.78_0.12_85/0.05)] transition-colors py-2 rounded-r group",
    bottlePlain: "block border-l-2 border-[#c9a227]/30 pl-5 py-2",
  },
  austere: {
    page: "min-h-screen bg-stone-50 text-stone-900",
    gold: "text-red-800",
    goldBorder: "border-red-800/30",
    cardBg: "bg-stone-100",
    textMain: "text-stone-900",
    textMuted: "text-stone-600",
    heroOverlay: "absolute inset-0 bg-linear-to-b from-stone-50/80 via-stone-50/60 to-stone-50",
    glass:
      "rounded-2xl p-10 md:p-14 bg-stone-100/60 border border-stone-300/50 backdrop-blur-[20px] backdrop-saturate-140 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
    barDone: "bg-red-800/60",
    barNow: "bg-red-800",
    barIdle: "bg-stone-300",
    option:
      "w-full text-left p-5 border border-red-800/30 rounded-sm transition-all duration-300 group hover:bg-red-800/10 hover:border-red-800/60",
    optionText: "text-base text-stone-900 group-hover:text-red-800 transition-colors",
    optionIcon: "size-4 text-stone-600 group-hover:text-red-800 transition-all group-hover:translate-x-1",
    bottle: "block border-l-2 border-red-800/30 pl-5 hover:bg-[oklch(0.78_0.12_85/0.05)] transition-colors py-2 rounded-r group",
    bottlePlain: "block border-l-2 border-red-800/30 pl-5 py-2",
  },
} as const;

export type TasteLook = (typeof tasteLooks)[keyof typeof tasteLooks];
