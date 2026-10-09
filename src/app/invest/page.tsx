import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialDivider } from "@/components/marketing/editorial-divider";
import { RelatedPages } from "@/components/marketing/related-pages";

// Ported from legacy client/src/pages/Invest.tsx ("Invest in the Thesis").
// Real content, unchanged — 6 real portfolio categories, 32 real named
// companies. The "ABIT Waitlist" section is a real outbound link to
// impactsoul.is (a separate, live site), not an email-capture form on this
// page — no backend dependency here at all.
export const metadata: Metadata = {
  title: "Invest in the Thesis — Portfolio & ABIT Waitlist",
  description:
    "35+ portfolio companies across psychedelic medicine, impact venture, Web3, blockchain, and health tech. ImpactSoul ABITs launch Q1 2027.",
  alternates: { canonical: "/invest" },
};

const CATEGORIES = [
  {
    name: "Psychedelic Medicine",
    text: "text-[#8C49A7]",
    dot: "bg-[#9B59B6]",
    companies: [
      { name: "MycoMedica Life Sciences", role: "Investor", note: "Paul Stamets' patent portfolio company" },
      { name: "AtaiBeckley", role: "Investor", note: "Formerly Beckley Psytech" },
      { name: "Wake Network", role: "Investor", note: "" },
      { name: "Radicle Science", role: "Investor", note: "Proof-as-a-Service CRO for natural products" },
      { name: "Tripp", role: "Investor", note: "XR wellness — VR meditation & breathwork" },
    ],
  },
  {
    name: "Impact Venture & Finance",
    text: "text-[#1A7440]",
    dot: "bg-[#27AE60]",
    companies: [
      { name: "Capria.VC", role: "LP", note: "India's top social impact fund — 1.2M people impacted" },
      { name: "Supernode Ventures", role: "LP", note: "Seed fund led by Laurel Touby" },
      { name: "Tacit Capital LLC", role: "Investor", note: "PE firm — post-disruption rebuilding" },
      { name: "Wavemaker Three-Sixty Health", role: "Investor", note: "Early-stage healthcare VC" },
      { name: "Belveron Partners Fund VI", role: "LP", note: "" },
      { name: "AngelsList The Fund LA I", role: "LP", note: "" },
      { name: "Akerna", role: "Advisor/Shareholder", note: "Exited" },
    ],
  },
  {
    name: "Web3, DAOs & Governance",
    text: "text-[#1D6CA1]",
    dot: "bg-[#3498DB]",
    companies: [
      { name: "Tea", role: "Investor", note: "Equitable open-source for Web3" },
      { name: "Menagerie", role: "Investor/Advisor", note: "Build clubs, DAOs, nonprofits in Web3" },
      { name: "Vatom", role: "Partner", note: "Brand metaverse creation" },
      { name: "DEVxDAO", role: "Former Client", note: "Capital for decentralized projects" },
    ],
  },
  {
    name: "Blockchain Infrastructure",
    text: "text-[#9B5212]",
    dot: "bg-[#E67E22]",
    companies: [
      { name: "Synternet", role: "Advisor/Investor", note: "Formerly NOIA Network — the Waze of internet congestion" },
      { name: "Block.one", role: "Investor", note: "Open-source software for transparency" },
      { name: "RAIR", role: "Investor", note: "NFT-based DRM & token-gated streaming" },
      { name: "WAX", role: "Investor", note: "High-throughput NFT & gaming chain" },
      { name: "Pynths", role: "Investor", note: "Cross-chain synthetic-asset protocol" },
      { name: "Nakji Network", role: "Investor", note: "Blockchain data indexing" },
    ],
  },
  {
    name: "Identity & Trust",
    text: "text-[#107461]",
    dot: "bg-[#1ABC9C]",
    companies: [
      { name: "Yoti", role: "Partner", note: "Digital ID & age verification — 55% YoY revenue growth" },
      { name: "Bluenumber", role: "Partner", note: "Global identity for supply chains" },
    ],
  },
  {
    name: "Health & Wellness Tech",
    text: "text-[#C42818]",
    dot: "bg-[#E74C3C]",
    companies: [
      { name: "Hiro Technologies", role: "Investor", note: "Miki Agrawal — MycoDigestible diapers" },
      { name: "XR Workout", role: "Investor", note: "" },
    ],
  },
];

const TOTAL_VISIBLE = CATEGORIES.reduce((acc, c) => acc + c.companies.length, 0);

export default function InvestPage() {
  return (
    <div>
      <section className="bg-linear-170 from-[#0A0A10] via-[#111118] via-60% to-[#1A1A24] px-6 pt-16 pb-12 text-center">
        <div className="mx-auto max-w-[42.5rem]">
          <p className="mb-[1.2rem] font-mono text-[0.72rem]/[1.85] tracking-[0.25em] text-brand-gold-light uppercase">
            The Portfolio
          </p>
          <h1 className="mb-[1.2rem] font-heading text-[2rem]/[1.15] font-bold text-[#F5F0E0] sm:text-[3.2rem]/[1.15]">
            Invest in the Thesis
          </h1>
          <p className="mx-auto max-w-[32.5rem] text-[1.05rem]/[1.7] text-[#F5F0E0]/65">
            {TOTAL_VISIBLE} companies you can see. Many more you can&apos;t — yet. If you can help
            any of them, there&apos;s a door at the bottom of this page.
          </p>
        </div>
      </section>

      {CATEGORIES.map((cat, ci) => (
        <div key={cat.name}>
          <section className="mx-auto max-w-[39rem] px-6 py-8 sm:px-10">
            <div className="mb-6 flex items-center gap-2.5">
              <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${cat.dot}`} />
              <h2 className="font-mono text-[0.78rem] font-normal tracking-[0.35em] text-brand-gold uppercase">
                {cat.name}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cat.companies.map((co) => (
                <div
                  key={co.name}
                  className="rounded-md border border-brand-gold/15 bg-background px-[1.2rem] py-4 transition-colors hover:border-brand-gold/40"
                >
                  <div className="mb-1 text-[0.95rem] font-semibold text-foreground">{co.name}</div>
                  <div
                    className={`font-mono text-[0.68rem] tracking-[0.1em] uppercase ${cat.text} ${co.note ? "mb-1.5" : ""}`}
                  >
                    {co.role}
                  </div>
                  {co.note && (
                    <div className="text-[0.82rem]/normal text-muted-foreground">{co.note}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
          {ci < CATEGORIES.length - 1 && (
            <EditorialDivider />
          )}
        </div>
      ))}

      <section className="mt-6 bg-linear-170 from-[#0A0A10] to-[#111118] px-6 py-10 text-center">
        <div className="mx-auto max-w-[37.5rem]">
          <p className="mb-4 font-mono text-[0.72rem]/[1.85] tracking-[0.25em] text-brand-gold-light uppercase">
            And Many More
          </p>
          <p className="mb-4 font-heading text-[1.5rem]/[1.35] font-semibold text-[#F5F0E0] sm:text-[1.8rem]/[1.35]">
            There are companies in this portfolio that can&apos;t be named yet. Stealth rounds.
            Pre-announcement partnerships. Deals in the corridor.
          </p>
          <p className="mb-6 text-[0.95rem]/[1.7] text-[#F5F0E0]/60">
            If you have capital, connections, expertise, or distribution that could accelerate any
            company on this page — or if you suspect you might be useful to the ones you
            can&apos;t see — there&apos;s one way to find out.
          </p>
          <Link
            href="/engage"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-brand-gold-light px-12 py-3.5 font-mono text-[0.85rem] tracking-[0.15em] text-[#0A0A10] uppercase transition-opacity hover:opacity-90"
          >
            Enter the Gate
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-[39rem] px-6 py-8 sm:px-10">
        <h2 className="mb-6 font-mono text-[0.78rem] font-normal tracking-[0.35em] text-brand-gold uppercase">
          ImpactSoul — ABITs
        </h2>
        <p className="mb-3 text-[1.15rem] font-semibold text-foreground">
          Asset-Backed Impact Tokens. Real assets. Real value. Tokenized.
        </p>
        <p className="mb-4 text-[1.05rem]/[1.75] text-foreground/85">
          The assets that matter most, cultural, regenerative, and natural, are the ones
          traditional capital markets cannot properly price. ImpactSoul is a RampRate company
          working on that problem. Every ABIT is backed by a real asset, structured for impact,
          and designed to compound regeneratively.
        </p>
        <p className="mb-4 text-[0.95rem]/[1.7] text-muted-foreground">
          Launching Q1 2027. Waitlist open now. No solicitation. No commitment. First position
          when the door opens.
        </p>
        <div className="text-center">
          <a
            href="https://impactsoul.is"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-brand-gold-light px-10 py-3 font-mono text-[0.82rem] tracking-[0.15em] text-[#0A0A10] uppercase transition-opacity hover:opacity-90"
          >
            Join the Waitlist
            <ArrowRight aria-hidden="true" className="size-3.5" />
            ImpactSoul.is
          </a>
          <p className="mt-3 text-[0.85rem] text-muted-foreground">
            <a href="mailto:tony@impactsoul.is" className="text-brand-gold underline underline-offset-2">
              tony@impactsoul.is
            </a>{" "}
            for direct inquiries.
          </p>
        </div>
      </section>

      <RelatedPages path="/invest" tone="light" />
    </div>
  );
}
