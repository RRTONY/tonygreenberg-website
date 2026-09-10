import type { Metadata } from "next";
import { ShanitaInterview, ShareRow } from "@/components/brewsoul/shanita-interview";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/GuestShanitaNicholas.tsx
// — the real Tony G Guest Series interview with Shanita Nicholas (Fair
// Trade economics, roasting mythology, the C Market, regenerative vs.
// sustainable, origin-roasting economics, blockchain traceability, and
// pre-harvest financing), all real content ported unchanged and
// verbatim — see `components/brewsoul/shanita-interview.tsx` for the 10
// real Q&A entries with real citations. Legacy's `PROFILE.img` was the
// same dead Manus proxy confirmed 404 throughout this migration —
// dropped for a plain initial avatar. Legacy's redundant `BrewSoulLayout`
// wrapper dropped. Per-question expand/collapse, "Expand/Collapse All",
// and the real Twitter/LinkedIn/copy-link share row are genuinely
// interactive, split into client islands so the rest of the page stays
// server-rendered.
export const metadata: Metadata = {
  title: "Shanita Nicholas Breaks the Coffee Industry's Comfortable Lies",
  description:
    "Fair Trade theater, roasting mythology, the C Market trap, and origin-roasting as structural fix. A Tony G Guest Series interview.",
  alternates: { canonical: "/brewsoul/guest/shanita-nicholas" },
};

export default function ShanitaNicholasPage() {
  return (
    <div>
      <section className="border-b-3 border-[#8b4c2a] bg-linear-to-br from-[#1a0e08] to-[#2d3a24] px-6 py-[clamp(48px,8vw,80px)] pb-12 text-center">
        <div className="mb-4 font-mono text-[11px] tracking-[0.2em] text-[#D4AF37]">
          Tony G Guest Series
        </div>
        <h1 className="mx-auto mb-4 max-w-200 font-heading text-[clamp(28px,5vw,48px)] leading-[1.15] font-bold text-[#f5efe0] italic">
          Shanita Nicholas Breaks the Coffee Industry&apos;s Comfortable Lies
        </h1>
        <p className="mx-auto max-w-160 text-[clamp(14px,2vw,18px)] text-[#f5efe0]/80">
          A journalistic interrogation of fair trade theater, roasting deception, and what
          regeneration actually costs
        </p>
      </section>

      <section className="mx-auto max-w-200 px-6 pt-12">
        <div className="mb-10 rounded-lg border-l-4 border-l-[#8b4c2a] bg-linear-to-br from-[#f5efe0] to-[#f9f1e6] p-[clamp(24px,4vw,36px)]">
          <h2 className="mb-4 font-heading text-[clamp(18px,3vw,24px)] text-[#8b4c2a] italic">
            Why We&apos;re Profiling Shanita Nicholas
          </h2>
          <p className="mb-3.5 text-base leading-[1.8] text-[#2d1810]">
            The coffee industry has plenty of storytellers. It has very few truth-tellers. Shanita
            Nicholas is one of the rare people who holds degrees from Columbia in both chemical
            engineering and law, co-founded a nationally recognized Black women-owned specialty
            brand (Sip &amp; Sonder), earned her Q Grader certification, and then walked away from
            the comfortable narrative to ask the question nobody in specialty coffee wants to
            answer: <em>Why are the people who grow this still broke?</em>
          </p>
          <p className="mb-3.5 text-base leading-[1.8] text-[#2d1810]">
            She is one of the heartbeats of the coffee industry because she operates at the
            intersection where science, justice, and commerce collide. Through Quantum Seeds,
            she&apos;s building origin-roasting infrastructure that moves manufacturing profit back
            to producing countries — not as charity, but as economic architecture. She doesn&apos;t
            just critique the system. She&apos;s building the replacement.
          </p>
          <p className="text-base leading-[1.8] text-[#2d1810]">
            This interview is uncomfortable by design. If you buy specialty coffee and believe the
            story on the bag, you need to read this.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-200 px-6">
        <div className="mb-10 flex flex-col items-center gap-5 rounded-lg bg-white p-[clamp(24px,4vw,40px)] text-center shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
          <div className="flex size-35 items-center justify-center rounded-lg bg-[#3B2F1E] font-heading text-5xl text-[#D4AF37] shadow-[0_4px_12px_rgba(139,69,19,0.2)]">
            SN
          </div>
          <div className="min-w-55 flex-1">
            <h2 className="mb-2.5 font-heading text-xl text-[#8b4c2a]">Shanita Nicholas</h2>
            <p className="my-1.5 text-sm leading-relaxed text-[#6b5a4e]">
              <strong>Title:</strong> Director of Coffee Ecology, Quantum Seeds LLC
            </p>
            <p className="my-1.5 text-sm leading-relaxed text-[#6b5a4e]">
              <strong>Background:</strong> B.S. Chemical Engineering (Columbia), J.D./M.B.A.
              (Columbia), Certified Q Grader (2023)
            </p>
            <p className="my-1.5 text-sm leading-relaxed text-[#6b5a4e]">
              <strong>Impact:</strong> Co-founded Sip &amp; Sonder (2017)—Black women-owned
              specialty coffee brand. Now scaling origin-roasting networks through Quantum Seeds to
              move manufacturing and profit to coffee-producing countries.
            </p>
          </div>
        </div>

        <ShanitaInterview />

        <div className="mt-12 rounded-lg border-t-3 border-t-[#8b4c2a] bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="mb-3 font-heading text-xl text-[#8b4c2a] italic">Tony G Guest Series</h3>
          <p className="mx-auto mb-4 max-w-140 text-sm leading-relaxed text-[#6b5a4e]">
            Journalistic interrogation of industry systems. Each month: a different thought leader
            examining what regeneration actually requires. Coffee. Sake. Mezcal. Tequila. Same
            format. Same rigor. Zero marketing.
          </p>
          <p className="font-mono text-[11px] text-[#999]">
            All sources verified &amp; linked. All pricing in USD.
          </p>
        </div>
      </section>

      <ShareRow />

      <div className="mx-auto max-w-200 px-6 pt-8 pb-12">
        <NextSteps
          steps={[
            {
              label: "Biodynamic Census",
              path: "/brewsoul/biodynamic",
              description: "Every certified farm and roaster",
            },
            {
              label: "Decaf Done Right",
              path: "/brewsoul/decaf",
              description: "Clean process, clean brands",
            },
            {
              label: "Coffee Economics",
              path: "/brewsoul/economics",
              description: "Where your dollar actually goes",
            },
            {
              label: "All BrewSoul Pages",
              path: "/brewsoul/directory",
              description: "Complete intelligence index",
            },
          ]}
        />
      </div>
    </div>
  );
}
