import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock, Sprout, Star } from "lucide-react";
import { getGateStatus } from "@/lib/friend-gate";
import { AutoRefresh } from "@/components/friend-gate/auto-refresh";
import { GateFrame, gateH1, gateSub } from "@/components/friend-gate/frame";

// The seeker's private page: waiting for the three, then the summary.
// Copy from legacy FriendGate.tsx's waiting/results phases.
export const metadata: Metadata = {
  title: "Your Three Friends Gate",
  robots: { index: false, follow: false },
};

export default async function GateStatusPage({ params }: PageProps<"/friend-gate/[token]">) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();
  const gate = await getGateStatus(token);
  if (!gate) notFound();

  if (gate.status === "pending") {
    return (
      <GateFrame>
        <AutoRefresh />
        <Clock aria-hidden="true" className="mb-4 size-10 text-[#B45309]" strokeWidth={1.5} />
        <h1 className={gateH1}>Waiting for your three.</h1>
        <p className={gateSub}>Invitations have been sent. Your results unlock when all three respond — or after 72 hours, whichever comes first.</p>
        <p className="mb-4 text-sm font-semibold text-[#92400E]">
          {gate.responded} of 3 friends have responded
        </p>
        <ul className="mb-6 flex flex-col gap-2">
          {gate.friends.map((f) => (
            <li key={f.name} className="flex items-center justify-between rounded-lg border border-[#FDE68A] px-4 py-3 text-[15px] text-[#1A1208]">
              {f.name}
              <span className="inline-flex items-center gap-1.5 text-xs text-[#92400E]">
                {f.responded ? <Check aria-hidden="true" className="size-4 text-[#059669]" /> : <Clock aria-hidden="true" className="size-4" />}
                {f.responded ? "Responded" : "Invitation sent — awaiting response"}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-[#92400E]">This page checks for updates automatically. You can also bookmark it and return later.</p>
      </GateFrame>
    );
  }

  const blocked = gate.status === "blocked";
  return (
    <GateFrame>
      {blocked ? (
        <Sprout aria-hidden="true" className="mb-4 size-10 text-[#B45309]" strokeWidth={1.5} />
      ) : (
        <Star aria-hidden="true" className="mb-4 size-10 fill-[#F59E0B] text-[#F59E0B]" strokeWidth={1.5} />
      )}
      <h1 className={gateH1}>{blocked ? "Your people asked you to wait." : `${gate.support} of ${gate.responded} support you moving forward.`}</h1>
      <div className="my-6 grid grid-cols-3 gap-3 rounded-xl bg-[#FEF3C7] p-4 text-center">
        {[
          [gate.support, "Support you"],
          [gate.wait, "Asked you to wait"],
          [gate.unsure, "Were unsure"],
        ].map(([n, label]) => (
          <div key={label as string}>
            <p className="text-2xl font-bold text-[#1A1208]">{n}</p>
            <p className="text-xs text-[#92400E]">{label}</p>
          </div>
        ))}
      </div>
      {blocked && (
        <p className={gateSub}>
          Two or more of the people who know you best asked you to take more time. That&apos;s not a rejection. That&apos;s love with a longer
          view. Study more. Debrief. Optimize your biochemistry. Come back when you&apos;re ready — and they&apos;ll know when you are.
        </p>
      )}
      {!blocked && gate.support >= 2 && (
        <p className={gateSub}>
          The people who know you have spoken. You have their support. Move forward with intention, with a facilitator you trust fully, and with
          the knowledge that your ecosystem is behind you.
        </p>
      )}
      {gate.messages.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-1 text-lg font-bold text-[#1A1208]">What your friends wanted you to know</h2>
          <p className="mb-3 text-[13px] text-[#92400E]">These messages are anonymous. You will not know which friend wrote what.</p>
          {gate.messages.map((m, i) => (
            <blockquote key={i} className="mb-3 border-l-3 border-[#D97706] pl-4 text-[15px]/[1.7] text-[#1A1208] italic">
              {m}
            </blockquote>
          ))}
        </section>
      )}
    </GateFrame>
  );
}
