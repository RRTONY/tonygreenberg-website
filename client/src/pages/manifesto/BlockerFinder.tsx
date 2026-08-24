import { useState } from "react";
import { Link } from "wouter";
import ManifestoLayout, {
  C,
  GlassCard,
  SectionLabel,
  SectionTitle,
  CrusadeDivider,
  HeroSection,
  EmberParticles,
} from "./ManifestoLayout";
import { ArrowLeft, Shield, ArrowRight, Star, ExternalLink, Zap, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-hero-blocker_477922f5.jpg";

/* ── Quiz Questions ── */
const QUESTIONS = [
  {
    id: "platform",
    question: "What email platform do you primarily use?",
    options: [
      { label: "Gmail / Google Workspace", value: "gmail" },
      { label: "Outlook / Microsoft 365", value: "outlook" },
      { label: "Apple Mail / iCloud", value: "apple" },
      { label: "Other (ProtonMail, Fastmail, etc.)", value: "other" },
    ],
  },
  {
    id: "volume",
    question: "How many unwanted emails do you receive per day?",
    options: [
      { label: "Under 20", value: "low" },
      { label: "20\u201350", value: "medium" },
      { label: "50\u2013100", value: "high" },
      { label: "100+", value: "extreme" },
    ],
  },
  {
    id: "type",
    question: "What type of spam bothers you most?",
    options: [
      { label: "Cold outreach / sales pitches", value: "sales" },
      { label: "Newsletter subscriptions I never signed up for", value: "newsletters" },
      { label: "Phishing / scam attempts", value: "phishing" },
      { label: "All of the above equally", value: "all" },
    ],
  },
  {
    id: "tech",
    question: "How technical are you?",
    options: [
      { label: "I just want it to work", value: "basic" },
      { label: "Comfortable with settings and filters", value: "moderate" },
      { label: "I can configure DNS records and API integrations", value: "advanced" },
      { label: "I build software", value: "developer" },
    ],
  },
];

/* ── Tools Database ── */
const TOOLS = [
  { name: "SaneBox", url: "https://www.sanebox.com", desc: "AI-powered email triage. Moves unimportant emails to a separate folder. Learns your priorities over time.", platforms: ["gmail", "outlook", "apple", "other"], techLevel: ["basic", "moderate", "advanced", "developer"], bestFor: ["sales", "newsletters", "all"], rating: 5, price: "$7/mo" },
  { name: "Unroll.me", url: "https://unroll.me", desc: "Mass unsubscribe from newsletters. See all your subscriptions in one view and kill them with one click.", platforms: ["gmail", "outlook", "apple"], techLevel: ["basic", "moderate"], bestFor: ["newsletters", "all"], rating: 4, price: "Free" },
  { name: "Clean Email", url: "https://clean.email", desc: "Bulk email management with smart rules. Auto-clean, unsubscribe, and organize at scale.", platforms: ["gmail", "outlook", "apple", "other"], techLevel: ["basic", "moderate", "advanced"], bestFor: ["sales", "newsletters", "all"], rating: 4, price: "$10/mo" },
  { name: "Hey.com", url: "https://hey.com", desc: "Basecamp\u2019s radical email rethink. Screener blocks unknown senders. The Feed separates newsletters. The Paper Trail hides receipts.", platforms: ["other"], techLevel: ["basic", "moderate", "advanced", "developer"], bestFor: ["sales", "newsletters", "phishing", "all"], rating: 5, price: "$99/yr" },
  { name: "Proton Mail", url: "https://proton.me/mail", desc: "End-to-end encrypted email. Swiss privacy laws. Built-in spam filtering with zero data harvesting.", platforms: ["other"], techLevel: ["moderate", "advanced", "developer"], bestFor: ["phishing", "sales", "all"], rating: 5, price: "Free / $4/mo" },
  { name: "MailWasher", url: "https://www.mailwasher.net", desc: "Preview and delete spam before it reaches your inbox. Bounce spam back to sender.", platforms: ["gmail", "outlook", "apple", "other"], techLevel: ["moderate", "advanced"], bestFor: ["sales", "phishing", "all"], rating: 3, price: "$40/yr" },
  { name: "SimpleLogin / AnonAddy", url: "https://simplelogin.io", desc: "Email alias service. Create unlimited aliases. When one gets spammed, kill it. Your real address stays clean.", platforms: ["gmail", "outlook", "apple", "other"], techLevel: ["advanced", "developer"], bestFor: ["sales", "newsletters", "phishing", "all"], rating: 5, price: "Free / $4/mo" },
  { name: "Superhuman", url: "https://superhuman.com", desc: "The fastest email experience. AI triage, split inbox, keyboard-first. Built for high-volume professionals.", platforms: ["gmail", "outlook"], techLevel: ["moderate", "advanced", "developer"], bestFor: ["sales", "all"], rating: 4, price: "$30/mo" },
];

function scoreTools(answers: Record<string, string>) {
  return TOOLS.map((tool) => {
    let score = 0;
    if (tool.platforms.includes(answers.platform)) score += 3;
    if (tool.techLevel.includes(answers.tech)) score += 2;
    if (tool.bestFor.includes(answers.type)) score += 2;
    if (answers.volume === "extreme" && (tool.name === "SaneBox" || tool.name === "Hey.com" || tool.name === "Superhuman")) score += 2;
    if (answers.volume === "high" && tool.name === "Clean Email") score += 1;
    return { ...tool, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export default function BlockerFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ReturnType<typeof scoreTools> | null>(null);

  const handleAnswer = (qId: string, value: string) => {
    const next = { ...answers, [qId]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResults(scoreTools(next));
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResults(null); };

  const getThreatLevel = () => {
    const vol = answers.volume;
    if (vol === "extreme") return { label: "CRITICAL", color: C.red, desc: "Your inbox has been overrun. Immediate action required." };
    if (vol === "high") return { label: "HIGH", color: C.ember, desc: "Your inbox is actively under siege." };
    return { label: "MODERATE", color: C.gold, desc: "Your inbox is under pressure but manageable." };
  };

  return (
    <>
    <SEO
        title="Blocker Finder — The Manifesto"
        description="Find the right tools to defend your attention and reclaim your inbox."
        path="/manifesto/blocker-finder"
        keywords="Tony Greenberg, email blocker, spam blocker, attention defense, inbox tools"
        indexable={true}
      />
      <ManifestoLayout>
      {/* ═══ HERO ═══ */}
      <HeroSection
        image={HERO_IMG}
        label="Defense Systems"
        title={<>AI Blocker <span style={{ color: C.teal }}>Finder</span></>}
        subtitle="Four questions. Personalized arsenal. Find the right weapons to defend your inbox."
      >
        <Link
          href="/attention-theft"
          className="inline-flex items-center gap-1.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: C.ink }}
        >
          <ArrowLeft size={16} /> Back to Manifesto
        </Link>
      </HeroSection>

      {/* ═══ QUIZ / RESULTS ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={15} color={C.teal} />

        <div className="max-w-3xl mx-auto relative z-10">
          {!results ? (
            <>
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: i <= step ? C.teal : "rgba(255,255,255,0.08)",
                      boxShadow: i <= step ? `0 0 8px ${C.teal}40` : "none",
                    }}
                  />
                ))}
              </div>

              <div className="text-center mb-2">
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: C.teal, opacity: 0.6 }}>
                  Question {step + 1} of {QUESTIONS.length}
                </span>
              </div>

              <h2
                className="text-2xl md:text-3xl font-bold text-center mb-8"
                style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
              >
                {QUESTIONS[step].question}
              </h2>

              <div className="grid gap-3">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(QUESTIONS[step].id, opt.value)}
                    className="w-full text-left p-5 rounded-xl transition-all hover:-translate-y-0.5 group"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-base font-medium group-hover:text-white transition-colors" style={{ color: C.darkBrown }}>
                        {opt.label}
                      </span>
                      <ChevronRight size={18} style={{ color: C.teal, opacity: 0.4 }} />
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Threat Level Badge */}
              <div className="text-center mb-8">
                <SectionLabel color={C.red}>Threat Assessment Complete</SectionLabel>
                <div
                  className="inline-block px-6 py-2 rounded-full text-xl font-bold mb-4"
                  style={{
                    backgroundColor: `${getThreatLevel().color}20`,
                    color: getThreatLevel().color,
                    border: `2px solid ${getThreatLevel().color}`,
                    boxShadow: `0 0 30px ${getThreatLevel().color}30`,
                  }}
                >
                  THREAT LEVEL: {getThreatLevel().label}
                </div>
                <p className="text-lg" style={{ color: C.muted }}>
                  {getThreatLevel().desc}
                </p>
              </div>

              <SectionTitle>Your Personalized Arsenal</SectionTitle>

              <div className="grid gap-4 mt-6">
                {results.map((tool, i) => (
                  <GlassCard key={tool.name} variant={i === 0 ? "danger" : "teal"} glow={i === 0}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: i === 0 ? `${C.red}25` : "rgba(42,224,224,0.15)",
                              color: i === 0 ? C.red : C.teal,
                              border: `1px solid ${i === 0 ? `${C.red}40` : "rgba(14,124,124,0.15)"}`,
                            }}
                          >
                            {i === 0 ? "TOP PICK" : `#${i + 1}`}
                          </span>
                          <span className="text-sm font-medium" style={{ color: C.muted }}>
                            {tool.price}
                          </span>
                        </div>
                        <h4
                          className="text-xl font-bold mb-1"
                          style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
                        >
                          {tool.name}
                        </h4>
                        <p className="text-base leading-relaxed mb-2" style={{ color: C.muted, lineHeight: 1.7 }}>
                          {tool.desc}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={s < tool.rating ? C.gold : "transparent"}
                              style={{ color: s < tool.rating ? C.gold : "rgba(255,255,255,0.15)" }}
                            />
                          ))}
                        </div>
                      </div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-3 rounded-xl transition-all hover:scale-105"
                        style={{
                          backgroundColor: "rgba(42,224,224,0.1)",
                          border: "1px solid rgba(42,224,224,0.2)",
                        }}
                      >
                        <ExternalLink size={18} style={{ color: C.teal }} />
                      </a>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Full Arsenal */}
              <CrusadeDivider />
              <SectionLabel color={C.gold}>Full Arsenal</SectionLabel>
              <h3
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
              >
                All Available Weapons
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={14} style={{ color: C.teal }} />
                      <span className="text-base font-bold" style={{ color: C.ink }}>{tool.name}</span>
                      <ExternalLink size={10} style={{ color: C.teal, opacity: 0.4 }} />
                    </div>
                    <p className="text-xs" style={{ color: C.muted }}>{tool.price}</p>
                  </a>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button onClick={reset} className="text-sm font-medium hover:underline" style={{ color: C.teal, opacity: 0.6 }}>
                  Retake Assessment
                </button>
              </div>
            </>
          )}

          <CrusadeDivider />

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/attention-theft/weapons"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 20px rgba(232,54,42,0.3)` }}
            >
              <Zap size={16} /> The 10 Weapons <ArrowRight size={16} />
            </Link>
            <Link
              href="/attention-theft/report"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", color: C.ink, border: "1px solid rgba(0,0,0,0.08)" }}
            >
              Report A Spammer <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </ManifestoLayout>
    </>);
}
