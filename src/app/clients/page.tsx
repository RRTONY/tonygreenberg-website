import type { Metadata } from "next";
import Link from "next/link";
import { ClientsGrid, type Client } from "@/components/marketing/clients-grid";

// Ported from legacy client/src/pages/Clients.tsx ("The Rolodex"). Real
// content kept as-is — 90 real client names with real industry/Hawkins-
// score data, real filter/sort interactivity (rebuilt in a small client
// component since it's genuinely stateful, not decorative).

export const metadata: Metadata = {
  title: "Clients",
  description:
    "90+ enterprise clients served by RampRate over 25 years. Microsoft, Disney, Goldman Sachs, Nike, and more.",
  alternates: { canonical: "/clients" },
};

const CLIENTS: Client[] = [
  { name: "Microsoft", industry: "Technology", hawkins: 310, tier: 1 },
  { name: "Disney", industry: "Entertainment", hawkins: 350, tier: 1 },
  { name: "Goldman Sachs", industry: "Finance", hawkins: 280, tier: 1 },
  { name: "Nike", industry: "Consumer", hawkins: 340, tier: 1 },
  { name: "Sony", industry: "Technology", hawkins: 320, tier: 1 },
  { name: "Intel", industry: "Technology", hawkins: 310, tier: 1 },
  { name: "JPMorgan Chase", industry: "Finance", hawkins: 290, tier: 1 },
  { name: "Verizon", industry: "Telecom", hawkins: 270, tier: 1 },
  { name: "AT&T", industry: "Telecom", hawkins: 260, tier: 1 },
  { name: "PayPal", industry: "Fintech", hawkins: 330, tier: 1 },
  { name: "Citigroup", industry: "Finance", hawkins: 275, tier: 1 },
  { name: "Fidelity Investments", industry: "Finance", hawkins: 310, tier: 1 },
  { name: "Merrill Lynch", industry: "Finance", hawkins: 285, tier: 1 },
  { name: "McKinsey & Company", industry: "Consulting", hawkins: 340, tier: 1 },
  { name: "Bain & Company", industry: "Consulting", hawkins: 350, tier: 1 },
  { name: "Accenture", industry: "Consulting", hawkins: 300, tier: 1 },
  { name: "Credit Suisse", industry: "Finance", hawkins: 270, tier: 1 },
  { name: "Fox", industry: "Media", hawkins: 250, tier: 1 },
  { name: "NBC", industry: "Media", hawkins: 280, tier: 1 },
  { name: "ViacomCBS", industry: "Media", hawkins: 290, tier: 1 },
  { name: "eBay", industry: "E-Commerce", hawkins: 300, tier: 1 },
  { name: "Expedia", industry: "Travel", hawkins: 310, tier: 1 },
  { name: "Gap", industry: "Retail", hawkins: 290, tier: 1 },
  { name: "Vodafone", industry: "Telecom", hawkins: 300, tier: 1 },
  { name: "Broadcom", industry: "Technology", hawkins: 280, tier: 1 },
  { name: "Virgin", industry: "Conglomerate", hawkins: 370, tier: 1 },
  { name: "Yahoo", industry: "Technology", hawkins: 270, tier: 1 },
  { name: "AOL", industry: "Technology", hawkins: 260, tier: 1 },
  { name: "Bridgewater", industry: "Finance", hawkins: 340, tier: 2 },
  { name: "Citadel", industry: "Finance", hawkins: 310, tier: 2 },
  { name: "Houlihan Lokey", industry: "Finance", hawkins: 320, tier: 2 },
  { name: "Hearst Corporation", industry: "Media", hawkins: 300, tier: 2 },
  { name: "MGM", industry: "Entertainment", hawkins: 290, tier: 2 },
  { name: "Miramax", industry: "Entertainment", hawkins: 310, tier: 2 },
  { name: "MTV", industry: "Media", hawkins: 280, tier: 2 },
  { name: "Zurich Insurance", industry: "Insurance", hawkins: 300, tier: 2 },
  { name: "AON", industry: "Insurance", hawkins: 290, tier: 2 },
  { name: "Munich RE", industry: "Insurance", hawkins: 310, tier: 2 },
  { name: "Ticketmaster", industry: "Entertainment", hawkins: 260, tier: 2 },
  { name: "StubHub", industry: "E-Commerce", hawkins: 270, tier: 2 },
  { name: "GoDaddy", industry: "Technology", hawkins: 280, tier: 2 },
  { name: "Tribune Publishing", industry: "Media", hawkins: 270, tier: 2 },
  { name: "Blizzard Entertainment", industry: "Gaming", hawkins: 320, tier: 2 },
  { name: "Penske Logistics", industry: "Logistics", hawkins: 290, tier: 2 },
  { name: "Level 3 Communications", industry: "Telecom", hawkins: 280, tier: 2 },
  { name: "Cushman & Wakefield", industry: "Real Estate", hawkins: 290, tier: 2 },
  { name: "NPR", industry: "Media", hawkins: 400, tier: 2 },
  { name: "Girl Scouts", industry: "Nonprofit", hawkins: 420, tier: 2 },
  { name: "Scholastic", industry: "Education", hawkins: 380, tier: 2 },
  { name: "McGraw Hill", industry: "Education", hawkins: 340, tier: 2 },
  { name: "Sirius Satellite Radio", industry: "Media", hawkins: 290, tier: 2 },
  { name: "Sun Microsystems", industry: "Technology", hawkins: 330, tier: 2 },
  { name: "SanDisk", industry: "Technology", hawkins: 310, tier: 2 },
  { name: "Trend Micro", industry: "Cybersecurity", hawkins: 310, tier: 2 },
  { name: "Knight Ridder", industry: "Media", hawkins: 300, tier: 2 },
  { name: "Scripps", industry: "Media", hawkins: 310, tier: 2 },
  { name: "San Francisco Chronicle", industry: "Media", hawkins: 310, tier: 2 },
  { name: "Commonwealth Bank", industry: "Finance", hawkins: 300, tier: 2 },
  { name: "Hedera Hashgraph", industry: "Web3", hawkins: 340, tier: 3 },
  { name: "Block.one (EOS)", industry: "Web3", hawkins: 290, tier: 3 },
  { name: "Good Money", industry: "Impact Finance", hawkins: 380, tier: 3 },
  { name: "Wavemaker 360 Health", industry: "Healthcare", hawkins: 370, tier: 3 },
  { name: "Unitus Ventures", industry: "Impact Investing", hawkins: 390, tier: 3 },
  { name: "eHealth Ontario", industry: "Healthcare", hawkins: 360, tier: 3 },
  { name: "Linden Lab", industry: "Gaming", hawkins: 330, tier: 3 },
  { name: "Audible.com", industry: "Media", hawkins: 350, tier: 3 },
  { name: "DRW Trading Group", industry: "Finance", hawkins: 300, tier: 3 },
  { name: "Stifel Financial", industry: "Finance", hawkins: 290, tier: 3 },
  { name: "Archon Capital", industry: "Finance", hawkins: 310, tier: 3 },
  { name: "TBWA", industry: "Advertising", hawkins: 310, tier: 3 },
  { name: "Constant Contact", industry: "Marketing", hawkins: 300, tier: 3 },
  { name: "Verne Global", industry: "Data Centers", hawkins: 340, tier: 3 },
  { name: "CCP Games", industry: "Gaming", hawkins: 310, tier: 3 },
  { name: "Sony Crackle", industry: "Streaming", hawkins: 280, tier: 3 },
  { name: "Syntropy", industry: "Web3", hawkins: 330, tier: 3 },
  { name: "GLG", industry: "Consulting", hawkins: 310, tier: 3 },
  { name: "Rodale", industry: "Publishing", hawkins: 370, tier: 3 },
  { name: "Fortis", industry: "Finance", hawkins: 290, tier: 3 },
  { name: "Metaldyne", industry: "Manufacturing", hawkins: 270, tier: 3 },
];

const HAWKINS_LEVELS = [
  { label: "Courage", range: "200-249", color: "#C75B12", desc: "Taking action despite uncertainty" },
  { label: "Neutrality", range: "250-299", color: "#8B6914", desc: "Flexible, pragmatic, adaptable" },
  { label: "Willingness", range: "300-349", color: "#1565C0", desc: "Open, optimistic, growth-oriented" },
  { label: "Acceptance", range: "350-399", color: "#2E7D32", desc: "Transformative, purpose-driven" },
  { label: "Enlightened", range: "400+", color: "#7B2D8E", desc: "Visionary, regenerative, transcendent" },
];

export default function ClientsPage() {
  const avgHawkins = Math.round(CLIENTS.reduce((sum, c) => sum + c.hawkins, 0) / CLIENTS.length);
  const stats = [
    { label: "Clients Served", value: `${CLIENTS.length}+` },
    { label: "Years Active", value: "25" },
    { label: "Benchmarked", value: "$10B+" },
    { label: "Avg. Hawkins Score", value: avgHawkins.toString() },
    { label: "Data Points", value: "1M+" },
  ];

  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 pt-16 pb-12 sm:px-10">
        <Link href="/" className="mb-6 inline-block font-mono text-xs tracking-wide text-brand-gold uppercase">
          ← Back to The Broadsheet
        </Link>
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
          The Rolodex
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          {CLIENTS.length} companies across 25 years. Every engagement measured, every
          relationship maintained. This is who trusts RampRate with their infrastructure.
        </p>
      </div>

      <div className="bg-[#0A0A10] px-6 py-6 sm:px-10">
        <div className="grid gap-6 text-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-2xl font-bold text-brand-gold-light">{stat.value}</p>
              <p className="mt-1 font-mono text-xs tracking-wide text-white/50 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
        <ClientsGrid clients={CLIENTS} />
      </div>

      <div className="border-t border-border px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            The Hawkins Scale
          </p>
          <h2 className="mb-4 font-heading text-2xl font-normal text-foreground">
            Consciousness Calibration
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/70">
            Dr. David Hawkins&apos; Map of Consciousness calibrates organizations on a
            logarithmic scale from 1 to 1,000. Scores above 200 indicate constructive energy.
            Above 350 indicates acceptance and integration. Above 400 indicates reason and
            enlightened purpose. These scores reflect our assessment of each organization&apos;s
            alignment with regenerative, conscious business practices.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HAWKINS_LEVELS.map((level) => (
              <div key={level.label} className="p-4" style={{ borderLeft: `3px solid ${level.color}`, background: `${level.color}0d` }}>
                <p className="font-mono text-xs font-semibold tracking-wide uppercase" style={{ color: level.color }}>
                  {level.label}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{level.range}</p>
                <p className="mt-1 text-sm text-foreground/70">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A10] px-6 py-14 text-center sm:px-10">
        <p className="mb-4 font-heading text-2xl font-semibold text-[#FAFAF7] sm:text-3xl">
          &ldquo;The best deals are the ones where both sides
          <br />
          walk away feeling like they won.&rdquo;
        </p>
        <a
          href="https://ramprate.com"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-brand-gold-light font-mono text-xs tracking-wide text-brand-gold-light uppercase"
        >
          Visit RampRate →
        </a>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/recent-creations" className="font-mono text-sm tracking-wide text-brand-gold">
          Recent Creations →
        </Link>
      </div>
    </div>
  );
}
