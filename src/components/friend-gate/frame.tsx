import type { ReactNode } from "react";
import { FRIEND_GATE_FOOTER } from "@/lib/content/friend-gate";

// Shared look for the gate and the friend survey (legacy FriendGate.tsx `S`):
// warm amber page, small brand line, one white card.
export function GateFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-linear-160 from-[#FEFCE8] via-[#FEF3C7] via-30% to-[#FEF9EE] px-4 pt-8 pb-16 font-[Georgia,serif]">
      <p className="mb-6 text-center text-[11px] tracking-[.18em] text-[#B45309] uppercase">Only Time Buys Trust · onlytimebuystrust.com</p>
      <div className="w-full max-w-145 rounded-2xl border border-[#D97706]/20 bg-white/92 px-6 py-10 shadow-[0_4px_32px_rgba(180,83,9,.12)] sm:px-8">{children}</div>
      <p className="mt-6 text-center text-xs text-[#92400E]">{FRIEND_GATE_FOOTER}</p>
    </div>
  );
}

export const gateH1 = "mb-2 text-[clamp(1.5rem,4vw,2rem)]/[1.25] font-bold text-[#1A1208]";
export const gateSub = "mb-6 text-[15px]/[1.7] text-[#78350F]";
export const gateLabel = "mb-1.5 block text-xs font-semibold text-[#92400E]";
export const gateInput =
  "w-full rounded-lg border-[1.5px] border-[#E5D9C8] bg-white px-3.5 py-2.5 text-[15px] text-[#1A1208] outline-none focus:border-[#D97706] focus-visible:ring-2 focus-visible:ring-[#D97706]/30";
export const gateButton =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-linear-135 from-[#D97706] to-[#F59E0B] px-6 text-[15px] font-bold text-[#1A1208] disabled:cursor-wait disabled:opacity-70";
export const gateQuote = "my-6 border-l-3 border-[#D97706] pl-4 text-sm/[1.6] text-[#78350F] italic";
