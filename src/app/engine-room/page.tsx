import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/EngineRoom.tsx ("The Folio" —
// Projects & Ventures). Real content kept as-is.

export const metadata: Metadata = {
  title: "The Engine Room",
  description:
    "The operational infrastructure behind Tony Greenberg's work. How the companies and causes connect, the team that runs them, and the systems that make it work.",
  alternates: { canonical: "/engine-room" },
};

const VENTURES = [
  {
    name: "RampRate",
    role: "CEO & Founder",
    years: "2000–Present",
    desc: "Enterprise technology advisory. $10B+ benchmarked. SPY Index with 1M+ data points. Microsoft, Disney, Goldman Sachs, Nike. The objective lever in enterprise IT procurement.",
    url: "https://ramprate.com",
  },
  {
    name: "ImpactSoul",
    role: "Founder",
    years: "2021–Present",
    desc: "Certified B Corp. Tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND, REX, SPACE, BEING.",
    url: "https://impactsoul.is",
  },
  {
    name: "Menagerie",
    role: "Co-Founder",
    years: "2023–Present",
    desc: "Creative studio and venture builder. Where the weird ideas get built — the cross-pollination engine for everything else.",
  },
  {
    name: "MycoMedica Life Sciences",
    role: "Investor",
    years: "2019–Present",
    desc: "Psychedelic medicine research and development. Psilocybin therapeutics and mycological science.",
  },
  {
    name: "The Corridor (Payments)",
    role: "Strategic Advisor",
    years: "2022–Present",
    desc: "Four payment processing companies at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance. Details under NDA.",
  },
  {
    name: "Homeaglow Exposed",
    role: "Investigator & Publisher",
    years: "2023–Present",
    desc: "Consumer advocacy investigation. Dark patterns, fake reviews, exploited workers. Filed with CA Attorney General and FTC.",
    url: "https://homeaglowexposed.com",
  },
];

const INVESTMENTS = [
  {
    name: "AtaiBeckley",
    sector: "Psychedelic Medicine",
    note: "FDA Breakthrough Therapy designation",
  },
  { name: "Wake Network", sector: "Psychedelic Medicine", note: "Psychedelic wellness network" },
  { name: "Radicle Science", sector: "Clinical Research", note: "Decentralized clinical trials" },
  { name: "Tripp", sector: "Digital Therapeutics", note: "VR-based psychedelic experiences" },
];

export default function EngineRoomPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">The Work</p>
      <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Projects &amp; Ventures
      </h1>
      <p className="mb-10 text-foreground/80">
        Every company and cause I&apos;m involved with gets my network, my time, and my obsessive
        attention to detail. Here&apos;s what&apos;s currently active.
      </p>

      <h2 className="mb-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        Active Ventures
      </h2>
      <div className="mb-10 divide-y divide-border">
        {VENTURES.map((v) => (
          <div key={v.name} className="py-6">
            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <h3 className="font-heading text-lg font-bold text-foreground">
                {v.url ? (
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-brand-gold-light text-foreground"
                  >
                    {v.name}
                  </a>
                ) : (
                  v.name
                )}
              </h3>
              <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">
                {v.role}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{v.years}</span>
            </div>
            <p className="leading-relaxed text-foreground/80">{v.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        Active Engagements
      </h2>
      <div className="mb-10 divide-y divide-border">
        {INVESTMENTS.map((inv) => (
          <div key={inv.name} className="flex flex-wrap items-baseline gap-4 py-4">
            <span className="min-w-40 font-heading font-bold text-foreground">{inv.name}</span>
            <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">
              {inv.sector}
            </span>
            <span className="text-foreground/80">{inv.note}</span>
          </div>
        ))}
      </div>

      <blockquote className="mb-10 border-l-2 border-brand-gold pl-5 text-foreground/80 italic">
        &ldquo;We never stop building. The work connects — enterprise technology informs the impact
        models, the consciousness research sharpens the ethics, and the consumer advocacy keeps
        everyone honest.&rdquo;
        <footer className="mt-2 font-mono text-xs text-muted-foreground not-italic">— TG</footer>
      </blockquote>

      <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">The Lesson</p>
        <p className="leading-relaxed text-foreground/80">
          The work isn&apos;t a collection of bets. It&apos;s a system. The ventures that survive
          are the ones where network, attention, and conviction are non-negotiable inputs — not
          optional extras.
        </p>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/under-nda" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to Under NDA <ForwardIcon aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
