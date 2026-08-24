import { Link } from "wouter";
import ManifestoLayout, {
  C,
  GlassCard,
  SectionLabel,
  SectionTitle,
  SectionIntro,
  PullQuote,
  CrusadeDivider,
  HeroSection,
  EmberParticles,
} from "./ManifestoLayout";
import { ArrowLeft, ExternalLink, ArrowRight, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import SEO from "@/components/SEO";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-hero-economics_8ad65f9f.jpg";

const ECONOMICS_DATA = [
  { metric: "Average emails/day (knowledge worker)", value: "121", source: "Radicati Group, 2023", highlight: false },
  { metric: "Average emails/day (executives)", value: "200+", source: "Radicati Group, 2023", highlight: false },
  { metric: "Percentage of email that is spam", value: "45\u201385%", source: "Industry composite", highlight: true },
  { metric: "Recovery time per interruption", value: "23 min 15 sec", source: "Dr. Gloria Mark, UC Irvine", highlight: true },
  { metric: "Increase in task completion time after interruption", value: "+50%", source: "Mark et al., 2008", highlight: false },
  { metric: "Increase in errors after interruption", value: "+50%", source: "Mark et al., 2008", highlight: false },
  { metric: "Percentage of workweek spent managing email", value: "28%", source: "McKinsey Global Institute", highlight: true },
  { metric: "Hours/year lost to email management", value: "582 hours", source: "McKinsey, derived", highlight: false },
  { metric: "Value at $200/hr executive rate", value: "$116,400/year stolen", source: "Per executive, per year", highlight: true },
  { metric: "Annual U.S. economic cost of interruptions", value: "$588 Billion", source: "Basex Research, 2005", highlight: false },
  { metric: "Inflation-adjusted cost (2025 estimate)", value: "$997+ Billion", source: "Basex, CPI-adjusted", highlight: true },
  { metric: "Daily productivity destroyed per person", value: "65+ hours", source: "170 spam \u00d7 23 min recovery", highlight: false },
  { metric: "AI spam capacity per bad actor", value: "10,000+ unique messages/hour", source: "Industry estimate", highlight: true },
  { metric: "Marginal cost to sender", value: "$0.00", source: "Total asymmetry", highlight: true },
  { metric: "Cost to recipient per message", value: "23 minutes of life", source: "Dr. Gloria Mark", highlight: false },
];

export default function AttentionEconomics() {
  return (
    <>
    <SEO
        title="Attention Economics — The Manifesto"
        description="The numbers behind attention theft: how much human potential is stolen by spam, ads, and dark patterns."
        path="/manifesto/attention-economics"
        keywords="Tony Greenberg, attention economics, attention theft, spam, dark patterns"
        indexable={true}
      />
      <ManifestoLayout>
      {/* ═══ HERO ═══ */}
      <HeroSection
        image={HERO_IMG}
        label="The Data"
        title={<>The Economics of <span style={{ color: C.red }}>Attention Theft</span></>}
        subtitle="Every number below represents stolen human potential. This is not a nuisance problem. This is a trillion-dollar economic crime happening in plain sight."
      >
        <Link
          href="/attention-theft"
          className="inline-flex items-center gap-1.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: C.ink }}
        >
          <ArrowLeft size={16} /> Back to Manifesto
        </Link>
      </HeroSection>

      {/* ═══ DATA TABLE — WAR ROOM ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(232,54,42,0.3) 2px, rgba(232,54,42,0.3) 4px)",
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid rgba(232,54,42,0.15)` }}>
            <table className="w-full text-left" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ background: `linear-gradient(90deg, ${C.crimson}, ${C.crimson})` }}>
                  <th className="px-5 py-4 text-sm font-bold" style={{ color: C.ink, fontFamily: "'Fraunces', serif" }}>
                    Metric
                  </th>
                  <th className="px-5 py-4 text-sm font-bold text-right" style={{ color: C.ink, fontFamily: "'Fraunces', serif" }}>
                    Value
                  </th>
                  <th className="px-5 py-4 text-sm font-bold" style={{ color: C.muted }}>
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {ECONOMICS_DATA.map((row, i) => (
                  <tr
                    key={i}
                    className="transition-colors"
                    style={{
                      backgroundColor: row.highlight
                        ? "rgba(232,54,42,0.08)"
                        : i % 2 === 0
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.2)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <td className="px-5 py-4 text-base" style={{ color: C.darkBrown, lineHeight: 1.5 }}>
                      {row.highlight && <AlertTriangle size={14} className="inline mr-2 -mt-0.5" style={{ color: C.red }} />}
                      {row.metric}
                    </td>
                    <td
                      className="px-5 py-4 text-right font-bold text-lg whitespace-nowrap"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        color: row.highlight ? C.red : C.ink,
                        textShadow: row.highlight ? `0 0 15px rgba(232,54,42,0.3)` : "none",
                      }}
                    >
                      {row.value}
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: C.muted }}>
                      {row.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ AI APOCALYPSE ═══ */}
      <section
        className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${C.parchment} 0%, #1A0A08 50%, ${C.parchment} 100%)`,
        }}
      >
        <EmberParticles count={30} color={C.red} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(232,54,42,0.1) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Threat Escalation</SectionLabel>
          <SectionTitle color={C.red}>The AI Apocalypse</SectionTitle>

          <GlassCard variant="danger" glow className="mt-8">
            <div className="flex items-start gap-4">
              <Zap size={36} className="shrink-0 mt-1" style={{ color: C.red, filter: `drop-shadow(0 0 8px rgba(200,22,26,0.25))` }} />
              <div>
                <p className="text-lg leading-relaxed mb-4" style={{ color: C.ink, lineHeight: 1.8 }}>
                  Before AI, a spammer could send maybe 500 personalized emails a day. With AI, a single bad actor can generate <strong style={{ color: C.red }}>10,000+ unique, personalized spam messages per hour</strong> at zero marginal cost. The signal-to-noise ratio isn&apos;t declining &mdash; it&apos;s collapsing.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-xl p-4" style={{ background: "rgba(232,54,42,0.1)", border: "1px solid rgba(200,22,26,0.08)" }}>
                    <TrendingUp size={20} className="mb-2" style={{ color: C.ember }} />
                    <p className="text-sm font-bold" style={{ color: C.ember }}>Sender Cost</p>
                    <p className="text-3xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>$0.00</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>Total asymmetry</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "rgba(232,54,42,0.1)", border: "1px solid rgba(200,22,26,0.08)" }}>
                    <AlertTriangle size={20} className="mb-2" style={{ color: C.red }} />
                    <p className="text-sm font-bold" style={{ color: C.red }}>Recipient Cost</p>
                    <p className="text-3xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>23 min</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>Of irreplaceable life</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <PullQuote color={C.red}>
            &ldquo;If someone broke into your house and dumped garbage on your floor, you could press charges. When they do the digital equivalent, we call it &lsquo;marketing.&rsquo;&rdquo;
          </PullQuote>
        </div>
      </section>

      {/* ═══ SOURCES ═══ */}
      <section className="px-5 py-16 md:py-20" style={{ backgroundColor: C.parchment }}>
        <div className="max-w-4xl mx-auto">
          <GlassCard variant="default">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: C.teal }}>
              <ExternalLink size={14} /> Key Sources
            </h4>
            <ul className="space-y-3">
              {[
                { text: "Dr. Gloria Mark, UC Irvine \u2014 \"The Cost of Interrupted Work: More Speed and Stress\" (2008)", url: "https://www.ics.uci.edu/~gmark/chi08-mark.pdf" },
                { text: "Radicati Group \u2014 Email Statistics Report, 2023", url: "https://www.radicati.com" },
                { text: "McKinsey Global Institute \u2014 The Social Economy (2012)", url: "https://www.mckinsey.com" },
                { text: "Basex Research \u2014 Information Overload Cost Study (2005)", url: "#" },
              ].map((s) => (
                <li key={s.text} className="flex items-start gap-2">
                  <ExternalLink size={14} className="mt-1 shrink-0" style={{ color: C.teal, opacity: 0.6 }} />
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline transition-opacity hover:opacity-100"
                    style={{ color: C.muted, lineHeight: 1.5 }}
                  >
                    {s.text}
                  </a>
                </li>
              ))}
            </ul>
          </GlassCard>

          <CrusadeDivider />

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/attention-theft/blocker-finder"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{
                backgroundColor: C.teal,
                color: C.parchment,
                boxShadow: `0 0 20px rgba(14,124,124,0.15)`,
              }}
            >
              Find Your Blocker <ArrowRight size={16} />
            </Link>
            <Link
              href="/attention-theft/legal"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(0,0,0,0.04)",
                color: C.ink,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              Legal Arsenal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </ManifestoLayout>
    </>);
}
