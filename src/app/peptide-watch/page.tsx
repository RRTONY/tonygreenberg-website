import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PeptideWatchFraudPatterns } from "@/components/marketing/peptide-watch-fraud-patterns";
import { PeptideWatchRoleChecklist } from "@/components/marketing/peptide-watch-role-checklist";
import { PeptideWatchScorecard } from "@/components/marketing/peptide-watch-scorecard";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import {
  HERO_STATS,
  MARKETS,
  TIMELINE,
  WALL_OF_SHAME,
  BUYER_CHECKLIST,
  WATCHDOG_PILLARS,
  REPORT_CHANNELS,
  MANUS_LAYERS,
} from "@/lib/content/peptide-watch";

// Ported from legacy client/src/pages/PeptideWatch.tsx + peptide-watch-data.ts.
// Real content, unchanged, across all 10 sections: 3 market tiers, a 2024-26
// enforcement timeline, a wall-of-shame table of 18 real named
// vendors/entities with real FDA/DOJ/FTC/ITC/state/NAD citations, 12
// recurring fraud patterns, 5 role-based checklists, a 10-question buyer
// test, a 10-category vendor scorecard, a section on Finnrick Analytics
// independent testing, the proposed PeptideWatch Foundation, whistleblower
// reporting channels, and the closing "trust chain of custody" argument.
//
// The legacy per-section hero images (CloudFront-hosted) all confirmed 403,
// same dead host as every other peptide page — dropped for plain section
// styling. The legacy page's own <footer> was dropped as a duplicate of the
// site's global SiteFooter (rendered once in layout.tsx).
export const metadata: Metadata = {
  title: "PeptideWatch — The Definitive Consumer Safety Guide",
  description:
    "12 documented fraud patterns, 30+ named enforcement actions, and a complete vendor scoring system for the peptide market. Built on FDA, DOJ, FTC, and ITC public records.",
  alternates: { canonical: "/peptide-watch" },
};

const BADGE_CLASSES: Record<string, string> = {
  fda: "bg-red-700 text-white",
  doj: "bg-amber-800 text-white",
  ftc: "bg-orange-700 text-white",
  itc: "bg-indigo-700 text-white",
  state: "bg-teal-700 text-white",
  closed: "bg-zinc-800 text-white",
  nad: "bg-purple-700 text-white",
};

const MARKET_CLASSES: Record<string, string> = {
  cobalt: "border-[#2A5AA0] bg-[#2A5AA0]/5",
  saffron: "border-[#B86A28] bg-[#B86A28]/5",
  terracotta: "border-[#C84B2A] bg-[#C84B2A]/5",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 block font-mono text-xs font-bold tracking-[0.2em] text-brand-gold uppercase">
      {children}
    </span>
  );
}

export default function PeptideWatchPage() {
  return (
    <div>
      <div className="bg-[#C84B2A] px-4 py-3 text-center text-sm font-semibold tracking-wide text-white">
        BREAKING: Peptide Sciences — the largest U.S. research peptide vendor — voluntarily shut
        down March 6, 2026. The gray-market era is ending.
      </div>

      <section className="bg-[#0A0A10] px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 font-mono text-xs font-bold tracking-[0.25em] text-[#C84B2A] uppercase">
            The Definitive Supply Chain Safety Guide
          </p>
          <h1 className="mb-6 font-heading text-4xl leading-tight font-black text-white md:text-6xl">
            The Peptide <em className="text-brand-gold not-italic">Watchdog</em> Manual
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#A09880]">
            12 documented fraud patterns. 30+ named enforcement actions. A complete vendor scoring
            system. A new consumer organization to stop criminals in their tracks. Built on FDA,
            DOJ, FTC, and ITC public records.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-3xl font-black text-brand-gold md:text-4xl">
                  {s.num}
                </div>
                <div className="mt-1 max-w-30 font-mono text-xs tracking-wide text-[#A09880] uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-brand-gold/20 bg-[#0A0A10] px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3 text-xs">
          {[
            { href: "/find-your-peptide", label: "Find My Peptide" },
            { href: "/peptide-supply-chain", label: "Supply Chain Guide" },
            { href: "/peptide-hall-of-shame", label: "Hall of Shame" },
            { href: "/peptide-matrix", label: "Peptide Matrix" },
            { href: "/quiz_25q", label: "Peptide Quiz" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded bg-brand-gold/10 px-3 py-1.5 text-brand-gold transition-colors hover:bg-brand-gold/20"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className="mb-20">
          <SectionLabel>The Landscape</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            Three Markets, One Syringe
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            The peptide market is not one market. It is three stacked on top of each other — and
            only one of them is safe.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {MARKETS.map((m) => (
              <div key={m.num} className={`rounded-r border-l-4 p-6 ${MARKET_CLASSES[m.color]}`}>
                <div className="mb-1 font-mono text-xs font-bold tracking-widest text-muted-foreground">
                  {m.num}
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold text-foreground">{m.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/80">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionLabel>The Record</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            Enforcement Timeline: 2024–2026
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            This is not speculation. The criminal and regulatory docket has receipts.
          </p>
          <div className="ml-4 border-l-2 border-brand-gold/30">
            {TIMELINE.map((ev, i) => (
              <div key={i} className="relative pb-8 pl-8">
                <div className="absolute top-1 left-[-7px] size-3 rounded-full border-2 border-background bg-brand-gold" />
                <div className="mb-1 font-mono text-xs font-bold tracking-widest text-brand-gold uppercase">
                  {ev.date}
                </div>
                <h3 className="mb-1 text-base font-bold text-foreground">{ev.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/80">{ev.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionLabel>Documented Enforcement</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            The Wall of Shame
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            Every entry below is sourced from FDA warning letters, DOJ press releases, ITC
            proceedings, FTC actions, or state attorney general enforcement. No rumor. No Reddit
            smoke.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0A0A10] text-left text-white">
                  <th className="p-3 font-bold">Vendor / Entity</th>
                  <th className="p-3 font-bold">Agency</th>
                  <th className="p-3 font-bold">Core Violation</th>
                  <th className="p-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {WALL_OF_SHAME.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-brand-gold/5" : "bg-card"}>
                    <td className="p-3 font-bold whitespace-nowrap">{row.vendor}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {row.badges.map((b, j) => (
                          <span
                            key={j}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${BADGE_CLASSES[b.type]}`}
                          >
                            {b.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="max-w-md p-3 text-foreground/80">{row.violation}</td>
                    <td className="p-3 text-xs font-semibold whitespace-nowrap">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground italic">
            See also:{" "}
            <Link href="/peptide-hall-of-shame" className="text-brand-gold underline">
              Full Hall of Shame
            </Link>{" "}
            for additional vendor analysis.
          </p>
        </section>

        <section className="mb-20">
          <SectionLabel>The Playbook</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            12 Recurring Fraud Patterns
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            These are not theories. They are the tricks that keep appearing in warning letters,
            criminal indictments, and enforcement actions. Memorize them.
          </p>
          <PeptideWatchFraudPatterns />
        </section>

        <section className="mb-20">
          <SectionLabel>Your Role, Your Checklist</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            Pick Your Checklist
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            Different stakeholders face different risks. Select your role below to get the checklist
            built specifically for your position in the peptide supply chain.
          </p>
          <PeptideWatchRoleChecklist />
        </section>

        <section className="mb-20">
          <SectionLabel>Your Hard-Core Checklist</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            The 10-Question Supply Chain Test
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            Use this every single time before accepting any peptide from any source — including a
            beloved doctor, influencer, concierge clinic, or luxury telehealth platform.
          </p>
          <div className="flex flex-col gap-4">
            {BUYER_CHECKLIST.map((item) => (
              <div key={item.num} className="rounded-md border border-brand-gold/20 bg-card p-5">
                <div className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A10] text-sm font-bold text-brand-gold">
                    {item.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-base font-bold text-foreground">{item.question}</h3>
                    <p className="mb-1 text-sm text-[#2D7D46]">
                      <strong>Want:</strong> {item.want}
                    </p>
                    <p className="text-sm text-[#C84B2A]">
                      <strong>{item.fail}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionLabel>Scoring System</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            The Vendor Scorecard: 10 Categories, 50 Points
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            Score each supplier 0–5 per category. Minimum acceptable: 35. Under 25 is a walk-away.
          </p>
          <PeptideWatchScorecard />
        </section>

        <section className="mb-20">
          <SectionLabel>Independent Testing</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            Finnrick Analytics: The Only Real Scoreboard
          </h2>
          <p className="mb-6 leading-relaxed text-foreground/80">
            The most important tool in the buyer&apos;s verification stack is not a COA. It is
            Finnrick Analytics, the independent testing platform that has exposed the reality behind
            vendor claims.
          </p>
          <div className="mb-6 rounded-r border-l-4 border-[#B86A28] bg-[#B86A28]/8 p-6">
            <h3 className="mb-3 text-lg font-bold text-foreground">What Finnrick Is</h3>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Finnrick tests peptide samples from consumers and their own procurement — 5,930
              samples from 196 vendors across 15 products as of March 2026. Tests run in commercial
              labs for purity and quantity. Results are published publicly. Vendors are rated A
              through E. The platform accepts free mail-in samples from U.S. researchers and has
              recently added optional endotoxin contamination testing.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              <strong>Website:</strong>{" "}
              <a
                href="https://www.finnrick.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold underline"
              >
                finnrick.com
              </a>{" "}
              — check it before buying anything.
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              <strong>Key findings:</strong> BPC-157 quantity divergence of up to plus or minus 80%
              vs. advertised value at the 95th percentile. Retatrutide counterfeit detection flagged
              across Peptide Sciences samples in November 2025. Tirzepatide average score of 7.0
              across 1,477 samples from 121 vendors. Best-rated vendors for key compounds: Aavant
              Research (tirzepatide, A rating) and Peptide Partners (BPC-157, A rating).
            </p>
          </div>
          <div className="rounded-md border border-[#2A5AA0]/20 bg-[#2A5AA0]/5 p-5 text-sm leading-relaxed text-foreground/80">
            <strong className="text-[#2A5AA0]">On blockchain and QR authentication:</strong>{" "}
            FDA&apos;s DSCSA pilot program demonstrated feasibility of blockchain-based
            package-level tracing using MediLedger and 2D Data Matrix barcodes. That is real pharma
            infrastructure. Most peptide vendor &quot;QR codes&quot; are glorified hyperlinks — they
            open a webpage, not a tamper-resistant provenance ledger. If the QR does not tie the
            physical package to a serialized lot history that cannot be casually rewritten, it is
            mostly decor. Do not mistake it for verification.
          </div>
        </section>

        <section className="mb-20">
          <SectionLabel>The New Architecture</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            PeptideWatch: The Consumer Organization This Market Needs
          </h2>
          <p className="mb-6 leading-relaxed text-foreground/80">
            The enforcement wave is accelerating. The gray market is fragmenting. The window that
            allowed Peptide Sciences and vendors like it to operate openly is closing. What does not
            yet exist — and what would stop criminals fastest — is an organized, funded, independent
            consumer intelligence body with teeth.
          </p>
          <div className="rounded-md bg-[#2A5AA0] p-8 text-white">
            <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
              PeptideWatch Foundation
            </p>
            <h3 className="mb-3 font-heading text-2xl font-black md:text-3xl">
              Mission: Stop Criminals at the Source
            </h3>
            <p className="mb-6 leading-relaxed text-white/85">
              A non-profit consumer safety intelligence organization operating at the intersection
              of independent testing, regulatory coordination, and public transparency — with the
              explicit purpose of cutting off fraudulent peptide and compounded drug supply chains
              before they reach patients.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WATCHDOG_PILLARS.map((p) => (
                <div key={p.title} className="rounded-md bg-white/10 p-4">
                  <h4 className="mb-1 text-sm font-bold text-white">{p.title}</h4>
                  <p className="text-xs leading-relaxed text-white/75">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20">
          <SectionLabel>Taking Action</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            How to Become a Whistleblower
          </h2>
          <p className="mb-4 leading-relaxed text-foreground/80">
            If you find fraud, do not rant first. Build a file. Then report it through every
            available channel simultaneously.
          </p>
          <h3 className="mb-3 text-lg font-bold text-foreground">
            What to Collect Before Reporting
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-foreground/80">
            Product photos, outer packaging, lot numbers, COAs, screenshots of claims, purchase
            receipts, shipping labels, emails or texts, adverse-event notes, names of prescribers,
            sellers, and entities involved, any communication from the seller about sourcing or
            ingredients.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_CHANNELS.map((ch) => (
              <div
                key={ch.agency}
                className="rounded-md border-2 border-foreground p-5 text-center"
              >
                <h4 className="mb-2 font-heading text-lg font-black text-foreground">
                  {ch.agency}
                </h4>
                <p className="mb-3 text-xs leading-relaxed text-foreground/80">{ch.desc}</p>
                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded bg-foreground px-4 py-2 font-mono text-xs font-bold tracking-wide text-background uppercase"
                >
                  {ch.label}
                  <ExternalLink className="size-3" />
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionLabel>Operational Intelligence</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            The Manus-Optimized Protocol
          </h2>
          <p className="mb-6 leading-relaxed text-foreground/80">
            This guide is architected as a high-efficiency, low-token-use knowledge model for Manus
            AI deployment. Here is how each component maps to an automated workflow layer.
          </p>
          <div className="flex flex-col gap-3">
            {MANUS_LAYERS.map((layer) => (
              <div
                key={layer.num}
                className="rounded-md border border-[#2A5AA0]/20 bg-[#2A5AA0]/5 p-4 text-sm"
              >
                <strong className="text-[#2A5AA0]">
                  Layer {layer.num} — {layer.title}:
                </strong>{" "}
                <span className="text-foreground/80">{layer.body}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-20 rounded-md bg-[#C84B2A] p-8 text-white">
          <p className="font-heading text-lg leading-relaxed font-bold md:text-xl">
            &quot;This market has more room for monsters than for magic because the incentives are
            bent the wrong way. Demand is huge. Margins are huge. Verification is weak. Most buyers
            outsource skepticism to charisma. Bad idea.&quot;
          </p>
        </div>

        <section className="mb-20">
          <SectionLabel>The Rule</SectionLabel>
          <h2 className="mb-4 font-heading text-3xl font-black text-foreground md:text-4xl">
            What You Do Not Know May Not Just Waste Your Money
          </h2>
          <p className="mb-4 leading-relaxed text-foreground/80">
            A great doctor can still be wrong. A sincere clinic can still be wrong. A telehealth
            brand with 10,000 happy comments can still be wrong.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/80">
            Why? Because trust travels socially, while contamination travels physically. One
            physician trusts a distributor. The distributor trusts an importer. The importer trusts
            a broker. The broker trusts a Chinese manufacturer. The buyer trusts the physician. By
            the time the vial hits your hand, everybody feels reassured and nobody has actually
            verified the chain.
          </p>
          <p className="mb-4 text-lg font-bold text-foreground">
            Never trust reputation. Never trust branding. Never trust a white coat. Never trust a QR
            code that only opens a webpage. Trust chain of custody, batch data, and independent
            verification.
          </p>
          <p className="mb-2 leading-relaxed text-foreground/80">
            What you do not know in this market may not just waste your money.
          </p>
          <p className="text-xl font-bold text-[#C84B2A]">It may poison you.</p>
        </section>

        <BioChainCTA
          variant="both"
          context="Verified sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />

        <section className="mb-16">
          <h3 className="mb-4 text-center font-heading text-xl font-bold text-foreground">
            Explore the Full Peptide Intelligence Suite
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/find-your-peptide",
                title: "Find My Peptide",
                desc: "Interactive peptide finder with use-case matching",
              },
              {
                href: "/peptide-supply-chain",
                title: "Supply Chain Guide",
                desc: "Deep dive into peptide sourcing and verification",
              },
              {
                href: "/peptide-hall-of-shame",
                title: "Hall of Shame",
                desc: "Documented vendor enforcement actions",
              },
              {
                href: "/peptide-matrix",
                title: "Peptide Matrix",
                desc: "Comprehensive peptide comparison tool",
              },
              {
                href: "/quiz_25q",
                title: "Peptide Knowledge Quiz",
                desc: "Test your peptide safety knowledge",
              },
              {
                href: "/whats-legal",
                title: "What's Legal",
                desc: "Regulatory status for 17 real compounds",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md border border-brand-gold/20 bg-card p-4 transition-colors hover:border-brand-gold/50"
              >
                <h4 className="text-sm font-bold text-foreground">{link.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
