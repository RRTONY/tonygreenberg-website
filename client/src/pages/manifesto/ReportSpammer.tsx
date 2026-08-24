import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import ManifestoLayout, {
  C,
  GlassCard,
  SectionLabel,
  SectionTitle,
  PullQuote,
  CrusadeDivider,
  HeroSection,
  EmberParticles,
} from "./ManifestoLayout";
import { ArrowLeft, AlertTriangle, Send, CheckCircle, Flame, BookOpen, ArrowRight, Skull, Trophy, TrendingUp, Users, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-hero-report_d6e3a1a1.jpg";

const CRUSADE_ARTICLES = [
  { slug: "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", title: "Zuck: Fix This Now & Stop Lying to Congress" },
  { slug: "california-toll-roads-legalized-scam", title: "California Toll Roads: A Legalized Scam" },
  { slug: "the-1000-hour-hold", title: "The $1,000/Hour Hold" },
  { slug: "forward-health-is-a-sideway-step-at-best", title: "Forward Health Is a Sideway Step at Best" },
  { slug: "bread-stuck-with-no-customer-service", title: "Lodge Bread: Stuck With No Customer Service" },
  { slug: "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", title: "DMN8: Poster Child for Fitness Fraud" },
  { slug: "dmn8-the-most-beautiful-crooked-gym-in-the-world", title: "DMN8: The Most Beautiful Crooked Gym" },
  { slug: "hiding-fees-tips-in-the-transparent-age", title: "Hiding Fees & Tips in the Transparent Age" },
  { slug: "luz-lounge-where-loyalty-goes-to-die-groupon", title: "Luz Lounge: Where Loyalty Goes to Die" },
  { slug: "how-to-alienate-a-loyal-vegan", title: "How to Alienate a Loyal Vegan" },
  { slug: "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", title: "Restaurants Beware of Vegans" },
  { slug: "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine", title: "The Peptide Truth: $65M Fraud Industry" },
];

const TRUST_ARTICLES = [
  { slug: "the-decay-of-modern-day-communication", title: "The Decay of Modern Day Communication" },
  { slug: "only-time-buys-trust", title: "Only Time Buys Trust" },
  { slug: "why-good-service-is-all-about-trust", title: "Why Good Service Is All About Trust" },
  { slug: "customer-service-key-to-business-success", title: "Customer Service: Key to Business Success" },
];

type FormData = {
  companyName: string;
  senderEmail: string;
  spamType: string;
  frequency: string;
  description: string;
  yourEmail: string;
};

const INITIAL: FormData = {
  companyName: "",
  senderEmail: "",
  spamType: "",
  frequency: "",
  description: "",
  yourEmail: "",
};

const SPAM_TYPE_MAP: Record<string, "cold-outreach" | "unsolicited-newsletter" | "ai-generated-spam" | "phishing-scam"> = {
  "cold-outreach": "cold-outreach",
  "newsletter": "unsolicited-newsletter",
  "ai-generated": "ai-generated-spam",
  "phishing": "phishing-scam",
  "persistent": "cold-outreach",
  "other": "cold-outreach",
};

const FREQ_MAP: Record<string, "one-time" | "weekly" | "daily" | "multiple-daily"> = {
  "once": "one-time",
  "weekly": "weekly",
  "daily": "daily",
  "multiple-daily": "multiple-daily",
  "relentless": "multiple-daily",
};

const TYPE_LABELS: Record<string, string> = {
  "cold-outreach": "Cold Outreach",
  "unsolicited-newsletter": "Newsletter Spam",
  "ai-generated-spam": "AI-Generated",
  "phishing-scam": "Phishing / Scam",
};

const FREQ_LABELS: Record<string, string> = {
  "one-time": "One-time",
  "weekly": "Weekly",
  "daily": "Daily",
  "multiple-daily": "Multiple/Day",
};

export default function ReportSpammer() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showWall, setShowWall] = useState(false);

  const submitMutation = trpc.spam.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const { data: wallData } = trpc.spam.wallOfShame.useQuery(undefined, { enabled: showWall || submitted });
  const { data: stats } = trpc.spam.stats.useQuery();

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.senderEmail.trim() || !form.senderEmail.includes("@")) e.senderEmail = "Valid email required";
    if (!form.spamType) e.spamType = "Required";
    if (!form.frequency) e.frequency = "Required";
    if (!form.description.trim() || form.description.trim().length < 10) e.description = "At least 10 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    submitMutation.mutate({
      companyName: form.companyName.trim(),
      senderEmail: form.senderEmail.trim(),
      spamType: SPAM_TYPE_MAP[form.spamType] || "cold-outreach",
      frequency: FREQ_MAP[form.frequency] || "one-time",
      description: form.description.trim(),
      reporterEmail: form.yourEmail.trim() || undefined,
    });
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(0,0,0,0.06)",
    color: C.ink,
    borderRadius: "0.75rem",
    padding: "0.875rem 1rem",
    fontSize: "1rem",
    width: "100%",
    outline: "none",
    lineHeight: 1.5,
    backdropFilter: "blur(10px)",
  };

  const errorStyle: React.CSSProperties = { color: C.red, fontSize: "0.8rem", marginTop: "0.25rem" };

  return (
    <>
    <SEO
        title="Report a Spammer — The Manifesto"
        description="Report spammers and attention thieves using Tony Greenberg's reporting framework."
        path="/manifesto/report-spammer"
        keywords="Tony Greenberg, report spammer, spam reporting, attention theft"
        indexable={true}
      />
      <ManifestoLayout>
      {/* ═══ HERO ═══ */}
      <HeroSection
        image={HERO_IMG}
        label="Public Accountability"
        title={<>Report A <span style={{ color: C.red }}>Spammer</span></>}
        subtitle="Build the public shame database. Every report adds to the collective evidence against attention thieves. Spammers count on anonymity. We're taking it away."
      >
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/attention-theft"
            className="inline-flex items-center gap-1.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: C.ink }}
          >
            <ArrowLeft size={16} /> Back to Manifesto
          </Link>
          {stats && stats.totalReports > 0 && (
            <div className="flex items-center gap-4 text-xs font-mono" style={{ color: C.teal, opacity: 0.7 }}>
              <span>{stats.totalReports} REPORTS FILED</span>
              <span>{stats.uniqueCompanies} COMPANIES EXPOSED</span>
            </div>
          )}
        </div>
      </HeroSection>

      {/* ═══ WALL OF SHAME TOGGLE ═══ */}
      <section className="relative px-5 py-8 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => setShowWall(!showWall)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: showWall ? C.red : "rgba(232,54,42,0.1)",
                color: showWall ? "#fff" : C.red,
                border: `1px solid ${showWall ? C.red : "rgba(200,22,26,0.08)"}`,
                boxShadow: showWall ? `0 0 25px rgba(232,54,42,0.3)` : "none",
              }}
            >
              <Trophy size={16} />
              {showWall ? "Hide Wall of Shame" : "View Wall of Shame"}
            </button>
            <Link
              href="#report-form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 20px rgba(232,54,42,0.3)` }}
            >
              <Send size={16} /> File A Report
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WALL OF SHAME ═══ */}
      {showWall && (
        <section className="relative px-5 py-12 md:py-16 overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #1a0505 50%, ${C.parchment} 100%)` }}>
          <EmberParticles count={30} color={C.red} />

          <div className="max-w-5xl mx-auto relative z-10">
            <SectionLabel color={C.red}>Public Accountability Database</SectionLabel>
            <SectionTitle>
              The Wall of <span style={{ color: C.red }}>Shame</span>
            </SectionTitle>
            <p className="text-base mb-8 max-w-2xl" style={{ color: C.muted, lineHeight: 1.7 }}>
              The most-reported attention thieves, ranked by community reports. Every entry is built from real submissions. Spammers: this is your permanent record.
            </p>

            {wallData && wallData.length > 0 ? (
              <div className="space-y-3">
                {wallData.map((entry, i) => {
                  const isTop3 = i < 3;
                  const rankColors = ["#FF4136", "#FF6B35", "#FF9F1C"];
                  const borderColor = isTop3 ? rankColors[i] : "rgba(255,255,255,0.06)";
                  const bgColor = isTop3 ? `rgba(${i === 0 ? "232,54,42" : i === 1 ? "255,107,53" : "255,159,28"},0.06)` : "rgba(255,255,255,0.02)";

                  return (
                    <div
                      key={entry.companyName}
                      className="flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {/* Rank */}
                      <div
                        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black"
                        style={{
                          fontFamily: "'Fraunces', serif",
                          backgroundColor: isTop3 ? rankColors[i] : "rgba(255,255,255,0.05)",
                          color: isTop3 ? "#fff" : C.ink,
                          boxShadow: isTop3 ? `0 0 15px ${rankColors[i]}40` : "none",
                        }}
                      >
                        {i + 1}
                      </div>

                      {/* Company */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/youve-been-reported?company=${encodeURIComponent(entry.companyName)}`}
                          className="font-bold text-base truncate block hover:underline"
                          style={{ color: C.ink }}
                        >
                          {entry.companyName}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: C.muted }}>
                          <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(232,54,42,0.1)", color: C.red, border: "1px solid rgba(232,54,42,0.15)" }}>
                            {TYPE_LABELS[entry.worstType] || entry.worstType}
                          </span>
                          <span>{FREQ_LABELS[entry.worstFrequency] || entry.worstFrequency}</span>
                        </div>
                      </div>

                      {/* Report Count */}
                      <div className="shrink-0 text-right">
                        <div
                          className="text-2xl font-black"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            color: isTop3 ? rankColors[i] : C.red,
                            textShadow: isTop3 ? `0 0 10px ${rankColors[i]}40` : "none",
                          }}
                        >
                          {entry.reportCount}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.muted }}>
                          reports
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : wallData && wallData.length === 0 ? (
              <GlassCard variant="default">
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto mb-4" style={{ color: C.teal, opacity: 0.4 }} />
                  <h4 className="text-lg font-bold mb-2" style={{ color: C.ink }}>No Reports Yet</h4>
                  <p className="text-sm" style={{ color: C.muted }}>
                    Be the first to file a report and start building the public accountability database.
                  </p>
                </div>
              </GlassCard>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${C.red} transparent ${C.red} ${C.red}` }} />
              </div>
            )}

            <PullQuote color={C.red}>
              &ldquo;Every report makes the economics of spam worse for the attacker. You are the enforcement mechanism the law forgot to build.&rdquo;
            </PullQuote>
          </div>
        </section>
      )}

      {/* ═══ FORM / SUCCESS ═══ */}
      <section id="report-form" className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={20} color={C.red} />

        <div className="max-w-3xl mx-auto relative z-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Warning Banner */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl mb-6"
                style={{
                  backgroundColor: "rgba(232,54,42,0.08)",
                  border: "1px solid rgba(232,54,42,0.15)",
                }}
              >
                <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: C.red }} />
                <p className="text-sm" style={{ color: C.darkBrown, lineHeight: 1.6 }}>
                  This form creates a public record. Reports are used to build the Wall of Shame database. Only submit factual information about actual spam you have received.
                </p>
              </div>

              <GlassCard variant="default">
                <div className="space-y-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>
                      Company / Sender Name <span style={{ color: C.red }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      placeholder="e.g., Forward Medical, Apollo.io, Generic SaaS Co."
                      style={inputStyle}
                    />
                    {errors.companyName && <p style={errorStyle}>{errors.companyName}</p>}
                  </div>

                  {/* Sender Email */}
                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>
                      Sender Email Address <span style={{ color: C.red }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.senderEmail}
                      onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                      placeholder="e.g., outreach@spamcompany.com"
                      style={inputStyle}
                    />
                    {errors.senderEmail && <p style={errorStyle}>{errors.senderEmail}</p>}
                  </div>

                  {/* Spam Type */}
                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>
                      Type of Spam <span style={{ color: C.red }}>*</span>
                    </label>
                    <select
                      value={form.spamType}
                      onChange={(e) => setForm({ ...form, spamType: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">Select type...</option>
                      <option value="cold-outreach">Cold Outreach / Sales Pitch</option>
                      <option value="newsletter">Unsolicited Newsletter</option>
                      <option value="ai-generated">AI-Generated Personalized Spam</option>
                      <option value="phishing">Phishing / Scam</option>
                    </select>
                    {errors.spamType && <p style={errorStyle}>{errors.spamType}</p>}
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>
                      How Often? <span style={{ color: C.red }}>*</span>
                    </label>
                    <select
                      value={form.frequency}
                      onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">Select frequency...</option>
                      <option value="once">One-time</option>
                      <option value="weekly">Weekly</option>
                      <option value="daily">Daily</option>
                      <option value="multiple-daily">Multiple times per day</option>
                    </select>
                    {errors.frequency && <p style={errorStyle}>{errors.frequency}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>
                      What Happened? <span style={{ color: C.red }}>*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the spam. Include any notable details — did they fake personalization? Ignore unsubscribe requests? Use AI-generated content?"
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" as const }}
                    />
                    {errors.description && <p style={errorStyle}>{errors.description}</p>}
                  </div>

                  {/* Your Email */}
                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>
                      Your Email <span className="text-xs font-normal" style={{ opacity: 0.4 }}>(optional, for follow-up)</span>
                    </label>
                    <input
                      type="email"
                      value={form.yourEmail}
                      onChange={(e) => setForm({ ...form, yourEmail: e.target.value })}
                      placeholder="your@email.com"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </GlassCard>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: C.red,
                  color: "#fff",
                  boxShadow: `0 0 30px rgba(232,54,42,0.4)`,
                }}
              >
                {submitMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#fff transparent #fff #fff" }} />
                    Filing Report...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    File Charges
                  </>
                )}
              </button>

              {submitMutation.isError && (
                <p className="text-center text-sm" style={{ color: C.red }}>
                  Failed to submit report. Please try again.
                </p>
              )}
            </form>
          ) : (
            <div className="text-center">
              <GlassCard variant="teal" glow className="max-w-lg mx-auto">
                <CheckCircle size={56} className="mx-auto mb-4" style={{ color: C.teal, filter: "drop-shadow(0 0 12px rgba(42,224,224,0.4))" }} />
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
                >
                  Report Filed
                </h3>
                <p className="text-base leading-relaxed mb-6" style={{ color: C.muted, lineHeight: 1.7 }}>
                  Your report has been added to the public accountability database. Every report makes the economics of spam worse for the attacker.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setSubmitted(false); setForm(INITIAL); setErrors({}); }}
                    className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: C.teal, color: "#000" }}
                  >
                    Report Another
                  </button>
                  <button
                    onClick={() => { setShowWall(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: C.red, color: "#fff" }}
                  >
                    <Trophy size={14} className="inline mr-1" />
                    View Wall of Shame
                  </button>
                  <Link
                    href="/attention-theft/weapons"
                    className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: "rgba(0,0,0,0.04)", color: C.ink, border: "1px solid rgba(0,0,0,0.08)" }}
                  >
                    See The 10 Weapons
                  </Link>
                </div>
              </GlassCard>

              {/* Send This To A Spammer */}
              <div className="mt-8">
                <GlassCard variant="danger" glow className="max-w-lg mx-auto">
                  <ExternalLink size={24} className="mx-auto mb-3" style={{ color: C.red }} />
                  <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>
                    Send This To The Spammer
                  </h4>
                  <p className="text-sm mb-4" style={{ color: C.muted, lineHeight: 1.6 }}>
                    Copy this link and send it directly to the offender. Let them know they&apos;ve been reported.
                  </p>
                  <ShareLink companyName={form.companyName} />
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CRUSADE ARTICLES ═══ */}
      <section
        className="relative px-5 py-16 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.sand} 0%, ${C.warmWhite} 100%)` }}
      >
        <EmberParticles count={10} color={C.ember} />

        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Related Reading</SectionLabel>
          <SectionTitle>The Crusades &mdash; Corporate Accountability</SectionTitle>
          <p className="text-base mb-8 max-w-2xl" style={{ color: C.muted, lineHeight: 1.7 }}>
            Tony has been holding companies accountable for years. These essays expose the worst offenders and the systems that enable them.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {CRUSADE_ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="flex items-start gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(232,54,42,0.04)",
                  border: "1px solid rgba(232,54,42,0.08)",
                }}
              >
                <Skull size={16} className="mt-1 shrink-0" style={{ color: C.red }} />
                <p className="text-sm font-semibold" style={{ color: C.ink, lineHeight: 1.4 }}>
                  {a.title}
                </p>
              </Link>
            ))}
          </div>

          <CrusadeDivider />

          {/* Communication & Trust */}
          <SectionLabel color={C.teal}>Foundation</SectionLabel>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
          >
            Communication &amp; Trust
          </h3>
          <p className="text-base mb-6" style={{ color: C.muted, lineHeight: 1.7 }}>
            The philosophical foundation. Why communication integrity matters. Why trust is the only currency that compounds.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {TRUST_ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="flex items-start gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(42,224,224,0.04)",
                  border: "1px solid rgba(42,224,224,0.08)",
                }}
              >
                <BookOpen size={16} className="mt-1 shrink-0" style={{ color: C.teal }} />
                <p className="text-sm font-semibold" style={{ color: C.ink, lineHeight: 1.4 }}>
                  {a.title}
                </p>
              </Link>
            ))}
          </div>

          <PullQuote color={C.red}>
            &ldquo;Spammers operate in the dark. They count on anonymity. We&apos;re taking it away.&rdquo;
          </PullQuote>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/attention-theft/weapons"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 20px rgba(232,54,42,0.3)` }}
            >
              <Flame size={16} /> The 10 Weapons <ArrowRight size={16} />
            </Link>
            <Link
              href="/attention-theft"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", color: C.ink, border: "1px solid rgba(0,0,0,0.08)" }}
            >
              Read The Full Manifesto
            </Link>
          </div>
        </div>
      </section>
    </ManifestoLayout>
    </>);
}

/* ═══ SHARE LINK COMPONENT ═══ */
function ShareLink({ companyName }: { companyName: string }) {
  const [copied, setCopied] = useState(false);
  const params = new URLSearchParams();
  params.set("company", companyName);
  // Extract domain from company name if it looks like a domain
  const domainMatch = companyName.match(/[a-z0-9-]+\.[a-z]{2,}/i);
  if (domainMatch) params.set("domain", domainMatch[0]);
  const shareUrl = `https://tonygreenberg.com/youve-been-reported?${params.toString()}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-2 p-3 rounded-lg text-xs font-mono break-all"
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(232,54,42,0.15)",
          color: C.ink,
          opacity: 0.8,
        }}
      >
        {shareUrl}
      </div>
      <button
        onClick={handleCopy}
        className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
        style={{
          backgroundColor: copied ? C.teal : C.red,
          color: copied ? "#000" : "#fff",
          boxShadow: copied ? `0 0 20px rgba(14,124,124,0.15)` : `0 0 20px rgba(232,54,42,0.3)`,
        }}
      >
        {copied ? "Copied! Now send it to them." : "Copy Spammer Link"}
      </button>
    </div>
  );
}
