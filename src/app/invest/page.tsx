import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/Invest.tsx ("Invest in the Thesis").
// Real content, unchanged — 6 real portfolio categories, 32 real named
// companies. The "ABIT Waitlist" section is a real outbound link to
// impactsoul.is (a separate, live site), not an email-capture form on this
// page — no backend dependency here at all.
export const metadata: Metadata = {
  title: "Invest in the Thesis — Portfolio & ABIT Waitlist",
  description:
    "35+ portfolio companies across psychedelic medicine, impact venture, Web3, blockchain, and health tech. ImpactSoul ABITs launch Q3 2026.",
  alternates: { canonical: "/invest" },
};

const CATEGORIES = [
  {
    name: "Psychedelic Medicine",
    text: "text-[#9B59B6]",
    dot: "bg-[#9B59B6]",
    companies: [
      {
        name: "MycoMedica Life Sciences",
        role: "Investor",
        note: "Paul Stamets' patent portfolio company",
      },
      { name: "AtaiBeckley", role: "Investor", note: "Formerly Beckley Psytech" },
      { name: "Wake Network", role: "Investor", note: "" },
      {
        name: "Radicle Science",
        role: "Investor",
        note: "Proof-as-a-Service CRO for natural products",
      },
      { name: "Tripp", role: "Investor", note: "XR wellness — VR meditation & breathwork" },
    ],
  },
  {
    name: "Impact Venture & Finance",
    text: "text-[#27AE60]",
    dot: "bg-[#27AE60]",
    companies: [
      {
        name: "Capria.VC",
        role: "LP",
        note: "India's top social impact fund — 1.2M people impacted",
      },
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
    text: "text-[#3498DB]",
    dot: "bg-[#3498DB]",
    companies: [
      { name: "Tea", role: "Investor", note: "Equitable open-source for Web3" },
      {
        name: "Menagerie",
        role: "Investor/Advisor",
        note: "Build clubs, DAOs, nonprofits in Web3",
      },
      { name: "Vatom", role: "Partner", note: "Brand metaverse creation" },
      { name: "DEVxDAO", role: "Former Client", note: "Capital for decentralized projects" },
    ],
  },
  {
    name: "Blockchain Infrastructure",
    text: "text-[#E67E22]",
    dot: "bg-[#E67E22]",
    companies: [
      {
        name: "Synternet",
        role: "Advisor/Investor",
        note: "Formerly NOIA Network — the Waze of internet congestion",
      },
      { name: "Block.one", role: "Investor", note: "Open-source software for transparency" },
      { name: "RAIR", role: "Investor", note: "NFT-based DRM & token-gated streaming" },
      { name: "WAX", role: "Investor", note: "High-throughput NFT & gaming chain" },
      { name: "Pynths", role: "Investor", note: "Cross-chain synthetic-asset protocol" },
      { name: "Nakji Network", role: "Investor", note: "Blockchain data indexing" },
    ],
  },
  {
    name: "Identity & Trust",
    text: "text-[#1ABC9C]",
    dot: "bg-[#1ABC9C]",
    companies: [
      {
        name: "Yoti",
        role: "Partner",
        note: "Digital ID & age verification — 55% YoY revenue growth",
      },
      { name: "Bluenumber", role: "Partner", note: "Global identity for supply chains" },
    ],
  },
  {
    name: "Health & Wellness Tech",
    text: "text-[#E74C3C]",
    dot: "bg-[#E74C3C]",
    companies: [
      {
        name: "Hiro Technologies",
        role: "Investor",
        note: "Miki Agrawal — MycoDigestible diapers",
      },
      { name: "XR Workout", role: "Investor", note: "" },
    ],
  },
];

const TOTAL_VISIBLE = CATEGORIES.reduce((acc, c) => acc + c.companies.length, 0);

export default function InvestPage() {
  return (
    <div>
      <section className="bg-linear-to-br from-background to-secondary px-6 py-16 text-center sm:px-10 dark:from-[#0A0A10] dark:via-[#111118] dark:to-[#1a1a24]">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">
            The Portfolio
          </p>
          <h1 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Invest in the Thesis
          </h1>
          <p className="mx-auto max-w-lg text-foreground/70">
            {TOTAL_VISIBLE} companies you can see. Many more you can&apos;t — yet. If you can help
            any of them, there&apos;s a door at the bottom of this page.
          </p>
        </div>
      </section>

      {CATEGORIES.map((cat, ci) => (
        <div key={cat.name}>
          <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
            <div className="mb-4 flex items-center gap-2.5">
              <span className={`size-2.5 shrink-0 rounded-full ${cat.dot}`} />
              <p className={`font-mono text-xs tracking-[0.2em] uppercase ${cat.text}`}>
                {cat.name}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.companies.map((co) => (
                <div
                  key={co.name}
                  className="rounded-md border border-brand-gold/10 bg-secondary p-4 transition-colors hover:border-brand-gold/40"
                >
                  <div className="mb-1 text-sm font-semibold text-foreground">{co.name}</div>
                  <div
                    className={`font-mono text-xs tracking-wide uppercase ${cat.text} ${co.note ? "mb-1.5" : ""}`}
                  >
                    {co.role}
                  </div>
                  {co.note && <div className="text-sm text-muted-foreground">{co.note}</div>}
                </div>
              ))}
            </div>
          </div>
          {ci < CATEGORIES.length - 1 && <hr className="border-border" />}
        </div>
      ))}

      <section className="bg-linear-to-br from-background to-secondary px-6 py-12 text-center sm:px-10 dark:from-[#0A0A10] dark:to-[#111118]">
        <div className="mx-auto max-w-lg">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">
            And Many More
          </p>
          <p className="mb-4 font-heading text-xl leading-snug font-semibold text-foreground">
            There are companies in this portfolio that can&apos;t be named yet. Stealth rounds.
            Pre-announcement partnerships. Deals in the corridor.
          </p>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            If you have capital, connections, expertise, or distribution that could accelerate any
            company on this page — or if you suspect you might be useful to the ones you can&apos;t
            see — there&apos;s one way to find out.
          </p>
          <Link
            href="/engage"
            className="inline-block rounded-sm bg-brand-gold px-10 py-3 font-mono text-sm tracking-wide text-white uppercase"
          >
            Enter the Gate <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-14 text-center sm:px-10">
        <p className="mb-4 font-mono text-xs tracking-wide text-brand-gold uppercase">
          ImpactSoul — ABITs
        </p>
        <p className="mb-3 text-lg font-semibold text-foreground">
          Asset-Backed Impact Tokens. Real assets. Real value. Tokenized.
        </p>
        <p className="mb-4 leading-relaxed text-foreground/80">
          The assets that matter most — cultural, regenerative, natural — are the ones traditional
          capital markets cannot properly price. ImpactSoul is a Certified B Corporation fixing
          that. Every ABIT is backed by a real asset, structured for impact, and designed to
          compound regeneratively.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Launching Q3 2026. Waitlist open now. No solicitation. No commitment. First position when
          the door opens.
        </p>
        <a
          href="https://impactsoul.is"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-sm bg-brand-gold px-8 py-2.5 font-mono text-xs tracking-wide text-white uppercase"
        >
          Join the Waitlist <ForwardIcon aria-hidden="true" /> ImpactSoul.is
        </a>
        <p className="mt-3 text-sm text-muted-foreground">
          <a href="mailto:tony@impactsoul.is" className="text-brand-gold">
            tony@impactsoul.is
          </a>{" "}
          for direct inquiries.
        </p>
      </div>
    </div>
  );
}
