import { useState } from "react";
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
import { ArrowLeft, Scale, Globe, FileText, Megaphone, Filter, ArrowRight, Copy, CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";

type LawStatus = "existing" | "proposed" | "action";

const LAWS: {
  title: string;
  jurisdiction: string;
  status: LawStatus;
  summary: string;
  detail: string;
  actionUrl?: string;
}[] = [
  {
    title: "CAN-SPAM Act (2003)",
    jurisdiction: "United States",
    status: "existing",
    summary: "Requires opt-out mechanism, honest headers, physical address. Penalties up to $51,744 per violation.",
    detail: "The CAN-SPAM Act sets rules for commercial email, establishes requirements for commercial messages, gives recipients the right to stop emails, and spells out tough penalties for violations. However, it does NOT require prior consent (opt-in), making it one of the weakest anti-spam laws among developed nations. It preempts stronger state laws.",
  },
  {
    title: "GDPR (2018)",
    jurisdiction: "European Union",
    status: "existing",
    summary: "Requires explicit prior consent for marketing emails. Fines up to \u20AC20M or 4% of global revenue.",
    detail: "The General Data Protection Regulation requires affirmative, unambiguous consent before sending marketing communications. The right to erasure (\"right to be forgotten\") applies. Data controllers must demonstrate lawful basis for processing. This is the gold standard \u2014 and the model the U.S. should adopt.",
  },
  {
    title: "CCPA / CPRA (2020/2023)",
    jurisdiction: "California, USA",
    status: "existing",
    summary: "Right to know, delete, and opt-out of data sales. Fines up to $7,500 per intentional violation.",
    detail: "The California Consumer Privacy Act and its amendment (CPRA) give consumers the right to know what data is collected, delete it, and opt out of its sale. While not spam-specific, it provides tools to cut off the data brokers who fuel spam operations.",
  },
  {
    title: "CASL (2014)",
    jurisdiction: "Canada",
    status: "existing",
    summary: "Requires express or implied consent. Penalties up to $10M per violation for organizations.",
    detail: "Canada\u2019s Anti-Spam Legislation is one of the strictest in the world. It requires express consent (opt-in) for commercial electronic messages, with limited implied consent windows. The administrative penalties are severe and enforcement is active.",
  },
  {
    title: "Attention Theft Prevention Act (Proposed)",
    jurisdiction: "United States (Federal)",
    status: "proposed",
    summary: "Would classify unsolicited commercial email as economic theft with measurable damages based on recipient\u2019s hourly rate.",
    detail: "This proposed framework would redefine spam not as a nuisance but as economic theft. Damages would be calculated based on the recipient\u2019s professional hourly rate multiplied by the 23-minute recovery time per interruption. At $200/hr, each spam email would carry a potential $77 liability. Class action provisions would make enforcement economically viable.",
  },
  {
    title: "AI Transparency in Communications Act (Proposed)",
    jurisdiction: "United States (Federal)",
    status: "proposed",
    summary: "Would require AI-generated emails to be labeled as such, with criminal penalties for AI-powered spam at scale.",
    detail: "As AI enables spam at industrial scale, this proposed legislation would require all AI-generated communications to carry mandatory disclosure. Sending more than 1,000 AI-generated unsolicited emails per day would constitute a federal offense. AI service providers would bear joint liability for enabling spam operations.",
  },
  {
    title: "Contact Your Representatives",
    jurisdiction: "United States",
    status: "action",
    summary: "Write to your congressional representatives demanding stronger anti-spam legislation with real teeth.",
    detail: "The CAN-SPAM Act is 20+ years old and was written before AI, before social media, before the attention economy. It needs to be replaced with legislation that treats attention theft as the economic crime it is.",
    actionUrl: "https://www.congress.gov/members/find-your-member",
  },
];

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-hero-legal_e053c9f8.jpg";

const FILTERS: { label: string; value: LawStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Existing Law", value: "existing" },
  { label: "Proposed", value: "proposed" },
  { label: "Take Action", value: "action" },
];

const STATUS_STYLES: Record<LawStatus, { bg: string; text: string; label: string; icon: typeof Scale }> = {
  existing: { bg: "rgba(42,224,224,0.12)", text: C.teal, label: "Existing Law", icon: Scale },
  proposed: { bg: "rgba(212,168,83,0.12)", text: C.gold, label: "Proposed", icon: FileText },
  action: { bg: "rgba(200,22,26,0.06)", text: C.red, label: "Take Action", icon: Megaphone },
};

const LETTER_TEMPLATE = `Dear [Representative Name],

I am writing to urge you to support stronger federal legislation addressing unsolicited commercial email and AI-powered spam. The CAN-SPAM Act of 2003 is woefully outdated and fails to protect American workers and businesses from what has become a nearly $1 trillion annual economic theft.

Research from UC Irvine shows each email interruption costs 23 minutes of recovery time. With AI enabling bad actors to send 10,000+ personalized spam messages per hour at zero cost, the asymmetry is catastrophic. The sender pays nothing. The recipient pays with their life.

I urge you to support legislation that: (1) requires explicit opt-in consent for all commercial email, (2) mandates disclosure of AI-generated communications, (3) establishes meaningful per-violation penalties, and (4) creates a private right of action for recipients.

Respectfully,
[Your Name]`;

export default function LegalDatabase() {
  const [filter, setFilter] = useState<LawStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = filter === "all" ? LAWS : LAWS.filter((l) => l.status === filter);

  const copyLetter = () => {
    navigator.clipboard.writeText(LETTER_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    <SEO
        title="Legal Database — Attention Theft Laws"
        description="The laws that govern spam, attention theft, and digital harassment — and how to use them."
        path="/manifesto/legal-database"
        keywords="Tony Greenberg, spam laws, CAN-SPAM, GDPR, attention theft laws"
        indexable={true}
      />
      <ManifestoLayout>
      {/* ═══ HERO ═══ */}
      <HeroSection
        image={HERO_IMG}
        label="Legal Framework"
        title={<>Legal <span style={{ color: C.gold }}>Arsenal</span></>}
        subtitle="The laws that exist, the laws we need, and how to demand them. The legal infrastructure of attention protection is decades behind the technology of attention theft."
      >
        <Link
          href="/attention-theft"
          className="inline-flex items-center gap-1.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: C.ink }}
        >
          <ArrowLeft size={16} /> Back to Manifesto
        </Link>
      </HeroSection>

      {/* ═══ FILTER + CARDS ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={12} color={C.gold} />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <Filter size={16} style={{ color: C.muted }} />
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: filter === f.value ? C.ink : "rgba(0,0,0,0.03)",
                  color: filter === f.value ? "#fff" : C.ink,
                  border: `1px solid ${filter === f.value ? C.ink : "rgba(0,0,0,0.06)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid gap-4">
            {filtered.map((law) => {
              const s = STATUS_STYLES[law.status];
              const Icon = s.icon;
              const isExpanded = expanded === law.title;
              return (
                <GlassCard key={law.title} variant={law.status === "action" ? "danger" : "default"} glow={law.status === "action"}>
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: s.bg, border: `1px solid ${s.text}30` }}
                    >
                      <Icon size={22} style={{ color: s.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.text}30` }}
                        >
                          {s.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                          <Globe size={12} />
                          {law.jurisdiction}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
                      >
                        {law.title}
                      </h3>
                      <p className="text-base leading-relaxed" style={{ color: C.muted, lineHeight: 1.7 }}>
                        {law.summary}
                      </p>

                      <button
                        onClick={() => setExpanded(isExpanded ? null : law.title)}
                        className="mt-3 text-sm font-medium hover:underline transition-colors"
                        style={{ color: s.text }}
                      >
                        {isExpanded ? "Show less" : "Read full analysis \u2192"}
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <p className="text-base leading-relaxed" style={{ color: C.darkBrown, lineHeight: 1.8 }}>
                            {law.detail}
                          </p>
                          {law.actionUrl && (
                            <a
                              href={law.actionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-4 text-sm font-bold px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                              style={{
                                backgroundColor: C.red,
                                color: "#fff",
                                boxShadow: `0 0 20px rgba(232,54,42,0.3)`,
                              }}
                            >
                              <Megaphone size={16} /> Take Action Now
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <PullQuote color={C.gold}>
            &ldquo;The CAN-SPAM Act is 20 years old. It was written before AI, before the attention economy, before spam became a trillion-dollar theft operation. It&apos;s time for legislation with real teeth.&rdquo;
          </PullQuote>
        </div>
      </section>

      {/* ═══ LETTER TEMPLATE ═══ */}
      <section
        className="relative px-5 py-16 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.sand} 0%, ${C.warmWhite} 100%)` }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Take Action</SectionLabel>
          <SectionTitle>Letter to Your Representative</SectionTitle>

          <div className="mt-6 relative">
            <button
              onClick={copyLetter}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 z-10"
              style={{
                backgroundColor: copied ? "rgba(42,224,224,0.15)" : "rgba(255,255,255,0.08)",
                color: copied ? C.teal : C.ink,
                border: `1px solid ${copied ? "rgba(14,124,124,0.15)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {copied ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
            <div
              className="rounded-2xl p-6 md:p-8 text-base leading-relaxed whitespace-pre-line"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                color: C.ink,
                opacity: 0.8,
                lineHeight: 1.8,
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.85rem",
              }}
            >
              {LETTER_TEMPLATE}
            </div>
          </div>

          <CrusadeDivider />

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/attention-theft/weapons"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 20px rgba(232,54,42,0.3)` }}
            >
              The 10 Weapons <ArrowRight size={16} />
            </Link>
            <Link
              href="/attention-theft/economics"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", color: C.ink, border: "1px solid rgba(0,0,0,0.08)" }}
            >
              Economics Table <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </ManifestoLayout>
    </>);
}
