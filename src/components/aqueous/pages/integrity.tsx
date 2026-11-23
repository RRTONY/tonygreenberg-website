"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Beaker,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ExternalLink,
  Eye,
  Handshake,
  Heart,
  HelpCircle,
  Lightbulb,
  Megaphone,
  Scale,
  Send,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare, ShareButton } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Integrity.tsx (2026-11-24). Same copy, data, markup
// and classes. The app's per-label colors were inline styles (`${color}15` background + color); they
// are full literal classes here (8-digit hex keeps the same 15 alpha). The transparency bar's width
// is the one runtime inline style.
// The "Why we ask" answers and each co-creator's detail card are kept in the server HTML and hidden
// with `hidden` while closed (the app mounted them only when opened), so crawlers see them.
// Fix from live: the summary table's rows were mouse-only (onClick on <tr>). The platform name is now
// a button inside the row (its click bubbles to the row), so keyboards can open the details too.

// ── Co-Creator Data with Integrity Assessments ────────────────────

interface CoCreatorIntegrity {
  id: string;
  name: string;
  url: string;
  category: string;
  revenueModel: 'ad-driven' | 'subscription' | 'affiliate' | 'nonprofit' | 'freemium' | 'mixed';
  scienceBacking: 'peer-reviewed' | 'partial' | 'opinion-based' | 'unknown';
  transparencyScore: number;
  integrityGrade: 'A' | 'B' | 'C' | 'D' | 'F' | 'Unrated';
  acknowledgments: string[];
  strengths: string[];
  invitations: string[];
  hasResponded: boolean;
  responseDate?: string;
}

export const coCreators: CoCreatorIntegrity[] = [
  {
    id: 'oasis',
    name: 'Oasis Health App',
    url: 'https://oasishealth.app',
    category: 'Health Rating App',
    revenueModel: 'subscription',
    scienceBacking: 'partial',
    transparencyScore: 45,
    integrityGrade: 'C',
    acknowledgments: [
      'Scoring methodology is not yet fully disclosed — an opportunity for growth',
      'Premium features behind subscription may limit access for those who need it most',
      'Source attribution for underlying data could be strengthened',
    ],
    strengths: [
      'Covers a wide range of bottled waters and health products',
      'Clean mobile-first interface that makes health data accessible',
      'Includes tap water lookup functionality — a genuine public service',
    ],
    invitations: [
      'We invite you to open-source your scoring methodology — transparency builds trust for everyone',
      'Consider making basic water safety data freely available, even within a freemium model',
      'Would you join us in supporting a unified open standard for water quality scoring?',
    ],
    hasResponded: false,
  },
  {
    id: 'ewg',
    name: 'EWG Tap Water Database',
    url: 'https://www.ewg.org/tapwater/',
    category: 'Environmental Advocacy / Water Database',
    revenueModel: 'nonprofit',
    scienceBacking: 'peer-reviewed',
    transparencyScore: 78,
    integrityGrade: 'B',
    acknowledgments: [
      'Funded partly by organic industry — worth examining for potential messaging bias',
      'Health guidelines are often stricter than EPA limits — the gap deserves clearer explanation',
    ],
    strengths: [
      'Largest open-access tap water database in the US — a monumental public service',
      'Transparent methodology with cited sources',
      'Nonprofit mission aligned with public health',
      'Regularly updated with new utility data',
    ],
    invitations: [
      'We\'d love to collaborate on balanced risk communication that empowers without alarming',
      'Would you support a unified open standard for water quality scoring across all platforms?',
    ],
    hasResponded: false,
  },
  {
    id: 'consumer-reports',
    name: 'Consumer Reports',
    url: 'https://www.consumerreports.org',
    category: 'Product Testing / Consumer Advocacy',
    revenueModel: 'subscription',
    scienceBacking: 'peer-reviewed',
    transparencyScore: 82,
    integrityGrade: 'B',
    acknowledgments: [
      'Water testing is infrequent — not yet a primary focus area',
      'Subscription model limits access for lower-income consumers who need it most',
    ],
    strengths: [
      'Independent lab testing with no advertising revenue — the gold standard',
      'Long track record of consumer advocacy spanning decades',
      'Rigorous methodology with published standards',
    ],
    invitations: [
      'Would you consider making water safety data freely available given its public health importance?',
      'We\'d welcome more frequent water testing — the data gap is real and your credibility could fill it',
    ],
    hasResponded: false,
  },
  {
    id: 'waterzen',
    name: 'WaterZen',
    url: 'https://waterzen.com',
    category: 'Water Filter Reviews / Affiliate',
    revenueModel: 'affiliate',
    scienceBacking: 'partial',
    transparencyScore: 35,
    integrityGrade: 'D',
    acknowledgments: [
      'Primary revenue from affiliate links creates a structural tension with objectivity',
      'Reviews may inadvertently favor products with higher affiliate commissions',
      'Relies on manufacturer claims rather than independent lab testing',
    ],
    strengths: [
      'Comprehensive filter comparison database — genuinely useful',
      'Educational content about water contaminants helps consumers learn',
    ],
    invitations: [
      'We invite you to disclose affiliate commission rates alongside recommendations — radical transparency builds trust',
      'Consider adding independent lab testing to complement manufacturer data',
      'Would you join us in creating an open filter performance database?',
    ],
    hasResponded: false,
  },
  {
    id: 'nsf-international',
    name: 'NSF International',
    url: 'https://www.nsf.org',
    category: 'Standards / Certification Body',
    revenueModel: 'mixed',
    scienceBacking: 'peer-reviewed',
    transparencyScore: 72,
    integrityGrade: 'B',
    acknowledgments: [
      'Revenue from certification fees creates a structural tension worth examining',
      'Standards development process could be more transparent to the public',
    ],
    strengths: [
      'Gold standard for water filter certification (NSF/ANSI 42, 53, 58)',
      'Independent testing laboratories with real scientific rigor',
      'Internationally recognized standards that protect consumers',
    ],
    invitations: [
      'Would you make full testing data publicly available, not just pass/fail results?',
      'We\'d love to collaborate on making certification data more accessible to everyday consumers',
    ],
    hasResponded: false,
  },
  {
    id: 'yuka',
    name: 'Yuka',
    url: 'https://yuka.io',
    category: 'Product Scanning / Health Rating App',
    revenueModel: 'freemium',
    scienceBacking: 'partial',
    transparencyScore: 55,
    integrityGrade: 'C',
    acknowledgments: [
      'Scoring methodology not fully transparent — an opportunity for growth',
      'Limited water-specific expertise — primarily food/cosmetics',
    ],
    strengths: [
      '50M+ users — proof that people want transparency when you make it easy',
      'Barcode scanning makes rating accessible to everyone',
      'Independent from brands being rated',
    ],
    invitations: [
      'We invite you to open-source your scoring methodology for peer review',
      'Would you consider adding water science expertise to strengthen water product ratings?',
      'Let\'s collaborate on making product transparency the norm, not the exception',
    ],
    hasResponded: false,
  },
];

// ── The 15 Invitational Questions ─────────────────────────────────

export const universalQuestions = [
  {
    id: 1,
    category: 'Intention',
    icon: Heart,
    question: 'What is the primary intention behind your platform — profit, public health, or both? We believe honesty about this ratio builds trust.',
    why: 'Intention shapes everything. Understanding it — in ourselves and others — is the first step toward integrity.',
  },
  {
    id: 2,
    category: 'Revenue',
    icon: DollarSign,
    question: 'What percentage of your revenue comes from the brands, products, or industries you rate or review?',
    why: 'Financial relationships with rated entities deserve transparency. Not because they\'re inherently wrong, but because hidden ones erode trust.',
  },
  {
    id: 3,
    category: 'Revenue',
    icon: DollarSign,
    question: 'Do you accept advertising, sponsorships, or affiliate payments from companies whose products appear in your ratings?',
    why: 'If you profit from the companies you evaluate, disclosing that relationship is a gift to your audience.',
  },
  {
    id: 4,
    category: 'Science',
    icon: Beaker,
    question: 'Are your ratings based on peer-reviewed science, editorial judgment, or a blend? How do you distinguish between them?',
    why: 'The line between opinion and information deserves care. Clarity about which is which serves everyone.',
  },
  {
    id: 5,
    category: 'Science',
    icon: Beaker,
    question: 'Do you conduct independent laboratory testing, or do you rely on manufacturer-supplied data?',
    why: 'Independent verification strengthens the entire ecosystem. We all benefit when testing is rigorous.',
  },
  {
    id: 6,
    category: 'Transparency',
    icon: Eye,
    question: 'Is your scoring methodology open-source and auditable by the public?',
    why: 'Open methodology invites improvement. Closed methodology invites suspicion. We choose open.',
  },
  {
    id: 7,
    category: 'Transparency',
    icon: Eye,
    question: 'Do you clearly label which content is editorial opinion versus empirical data?',
    why: 'This distinction matters. When we blur it, we risk misleading the people we\'re trying to help.',
  },
  {
    id: 8,
    category: 'Accountability',
    icon: Scale,
    question: 'When you make an error in a rating, what is your correction process?',
    why: 'How we handle mistakes reveals more about our integrity than how we handle successes.',
  },
  {
    id: 9,
    category: 'Accountability',
    icon: Scale,
    question: 'Would you welcome an independent third-party integrity audit of your platform?',
    why: 'Willingness to be examined is a powerful signal. We welcome it for ourselves and invite it for others.',
  },
  {
    id: 10,
    category: 'Access',
    icon: Shield,
    question: 'Is your most critical health and safety data freely accessible, or is it behind a paywall?',
    why: 'Water safety information can save lives. How we balance sustainability with access is a moral question worth examining.',
  },
  {
    id: 11,
    category: 'Access',
    icon: Shield,
    question: 'Do you make your raw data available for other researchers and platforms to verify and build upon?',
    why: 'Open data strengthens the entire ecosystem. When one platform shares, everyone benefits.',
  },
  {
    id: 12,
    category: 'Purpose',
    icon: Target,
    question: 'If your platform disappeared tomorrow, would the world lose critical public health infrastructure, or just another business?',
    why: 'This question helps us all examine whether we\'re building something essential or something extractive.',
  },
  {
    id: 13,
    category: 'Purpose',
    icon: Target,
    question: 'Do you actively work to reduce unnecessary consumption, or does your business model require ever-increasing consumption?',
    why: 'A platform aligned with health should also be aligned with sufficiency. The Great Simplification starts with us.',
  },
  {
    id: 14,
    category: 'Courage',
    icon: Megaphone,
    question: 'Have you ever given an honest negative rating to a major brand that could have been a lucrative partner?',
    why: 'Courage is the foundation of credibility. We celebrate it wherever we find it.',
  },
  {
    id: 15,
    category: 'Evolution',
    icon: Lightbulb,
    question: 'If your intention isn\'t fully aligned today, do you want it to be? What steps are you taking?',
    why: 'We don\'t demand perfection. We celebrate honesty about the journey and genuine steps toward integrity.',
  },
];

// ── Helper Functions ──────────────────────────────────────────────
// The app returned a hex `color` per label and painted it inline; these return the same colors as
// full literal classes: badge = style={{ backgroundColor: `${color}15`, color }}.

export function getRevenueLabel(model: CoCreatorIntegrity["revenueModel"]): { label: string; badge: string } {
  switch (model) {
    case "ad-driven":
      return { label: "Ad-Driven", badge: "bg-[#C75B3915] text-[#C75B39]" };
    case "subscription":
      return { label: "Subscription", badge: "bg-[#B8733315] text-[#B87333]" };
    case "affiliate":
      return { label: "Affiliate Revenue", badge: "bg-[#C75B3915] text-[#C75B39]" };
    case "nonprofit":
      return { label: "Nonprofit", badge: "bg-[#0A875415] text-[#0A8754]" };
    case "freemium":
      return { label: "Freemium", badge: "bg-[#B8733315] text-[#B87333]" };
    case "mixed":
      return { label: "Mixed Revenue", badge: "bg-[#9B233515] text-[#9B2335]" };
  }
}

export function getScienceLabel(backing: CoCreatorIntegrity["scienceBacking"]): { label: string; badge: string } {
  switch (backing) {
    case "peer-reviewed":
      return { label: "Peer-Reviewed", badge: "bg-[#0A875415] text-[#0A8754]" };
    case "partial":
      return { label: "Partially Backed", badge: "bg-[#B8733315] text-[#B87333]" };
    case "opinion-based":
      return { label: "Opinion-Based", badge: "bg-[#C75B3915] text-[#C75B39]" };
    case "unknown":
      return { label: "Unknown", badge: "bg-[#9B233515] text-[#9B2335]" };
  }
}

/** The grade letter's color (was getGradeColor → style={{ color }}). */
export function getGradeClass(grade: string): string {
  switch (grade) {
    case "A":
      return "text-[#0A8754]";
    case "B":
      return "text-[#4ECDC4]";
    case "C":
      return "text-[#B87333]";
    case "D":
      return "text-[#C75B39]";
    case "F":
      return "text-[#9B2335]";
    default:
      return "text-[#888]";
  }
}

/** The transparency bar's fill (was backgroundColor: >= 70 green, >= 50 copper, else rust). */
export function getBarClass(score: number): string {
  if (score >= 70) return "h-full rounded-full bg-[#0A8754] transition-[width]";
  if (score >= 50) return "h-full rounded-full bg-[#B87333] transition-[width]";
  return "h-full rounded-full bg-[#C75B39] transition-[width]";
}

const categories = ["all", "Intention", "Revenue", "Science", "Transparency", "Accountability", "Access", "Purpose", "Courage", "Evolution"];

// ── Main Component ────────────────────────────────────────────────

export function Integrity() {
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredQuestions =
    activeCategory === "all" ? universalQuestions : universalQuestions.filter((q) => q.category === activeCategory);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero — Invitational, not adversarial */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="sacred-geo-bg absolute inset-0 opacity-3" />
        <div className="relative container">
          {/* was motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} */}
          <div className="mx-auto max-w-3xl animate-in fill-mode-both text-center duration-500 fade-in slide-in-from-bottom-5">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Handshake aria-hidden="true" className="size-4" />
              An Invitation, Not an Indictment
            </div>
            <h1 className="mb-6 font-aq-display text-4xl font-bold tracking-tight md:text-5xl">
              The Open <span className="text-primary">Integrity Protocol</span>
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground">
              Every platform that rates water, health products, or consumer goods owes the public radical transparency
              about their motives, their science, and their integrity. We start by asking these questions of ourselves
              — then we invite every co-creator in this space to the same table.
            </p>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground/70 italic">
              &quot;We don&apos;t demand perfection. We celebrate honesty about the journey and genuine steps toward
              integrity.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Aqueous Self-Assessment — We Go First */}
      <section className="border-b border-border/30 py-12">
        <div className="container max-w-4xl">
          {/* was motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <h2 className="mb-6 text-center font-aq-display text-2xl font-bold">We Go First: Aqueous Self-Assessment</h2>
            <div className="glass-card rounded-xl border-l-4 border-l-green-600 p-6">
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Revenue Model</p>
                  <p className="text-sm font-semibold text-green-600">Open Source / None</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Science Backing</p>
                  <p className="text-sm font-semibold text-green-600">EPA / EWG / USGS</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Transparency</p>
                  <p className="text-sm font-semibold text-green-600">100% Open</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Integrity Grade</p>
                  <p className="font-aq-display text-2xl font-bold text-green-600">A</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Intention:</strong> 100% public health. Zero advertising revenue.
                  Zero brand partnerships. Zero affiliate conflicts with rated products.
                </p>
                <p>
                  <strong className="text-foreground">Methodology:</strong> Fully open-source AWI engine. Every data
                  source cited. Every weight explained. Anyone can audit, fork, or improve.
                </p>
                <p>
                  <strong className="text-foreground">Funding:</strong> Built as a public good. Future revenue from
                  personalized reports flows to indigenous water stewards and regenerative futures.
                </p>
                <p>
                  <strong className="text-foreground">Bias Disclosure:</strong> We advocate for reverse osmosis
                  filtration and glass packaging based on the science. This is a stated position, not a hidden one.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The 15 Questions — Invitational Framing */}
      <section className="border-b border-border/30 py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-2 text-center font-aq-display text-2xl font-bold">15 Questions for the Collective</h2>
          <p className="mx-auto mb-6 max-w-xl text-center text-sm text-muted-foreground">
            These questions are not accusations — they&apos;re invitations. We ask them of ourselves first, then extend
            them to every co-creator in this space. Answering builds trust. Silence is noted, not judged.
          </p>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-all"
                    : "rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted/80"
                }
              >
                {cat === "all" ? "All Questions" : cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q, i) => {
              const Icon = q.icon;
              const isExpanded = expandedQuestion === q.id;
              return (
                // was motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                <Reveal key={q.id} enter="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both" delay={i * 0.03}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="glass-card w-full rounded-xl border border-border/40 p-5 text-left transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-4" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{q.category}</span>
                          <span className="text-xs text-muted-foreground">Q{q.id}</span>
                        </div>
                        <p className="text-sm font-medium">{q.question}</p>
                        {/* was AnimatePresence height 0 → auto; kept in the DOM (hidden) so the answer is crawlable */}
                        <div
                          className={
                            isExpanded
                              ? "animate-in overflow-hidden duration-300 fade-in slide-in-from-top-2"
                              : "hidden overflow-hidden"
                          }
                        >
                          <p className="mt-3 border-t border-border/30 pt-3 text-xs text-muted-foreground italic">
                            <strong>Why we ask:</strong> {q.why}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Co-Creator Integrity Index */}
      <section className="border-b border-border/30 py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-2 text-center font-aq-display text-2xl font-bold">Co-Creator Integrity Index</h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted-foreground">
            Every co-creator is assessed on revenue model, science backing, and transparency. We celebrate strengths,
            acknowledge growth areas, and extend invitations to collaborate.
          </p>

          {/* Summary Table */}
          <div className="glass-card mb-8 overflow-hidden rounded-xl border border-border/40">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="p-4 text-left text-xs font-medium text-muted-foreground">Platform</th>
                    <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground sm:table-cell">Revenue</th>
                    <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground md:table-cell">Science</th>
                    <th className="p-4 text-left text-xs font-medium text-muted-foreground">Transparency</th>
                    <th className="p-4 text-left text-xs font-medium text-muted-foreground">Grade</th>
                    <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground sm:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coCreators.map((c) => {
                    const rev = getRevenueLabel(c.revenueModel);
                    const sci = getScienceLabel(c.scienceBacking);
                    return (
                      <tr
                        key={c.id}
                        className="cursor-pointer border-b border-border/20 transition-colors last:border-0 hover:bg-muted/20"
                        onClick={() => setExpandedCreator(expandedCreator === c.id ? null : c.id)}
                      >
                        <td className="p-4 text-sm font-medium">
                          {/* No handler of its own: the click (or Enter/Space) bubbles to the row. */}
                          <button
                            type="button"
                            aria-expanded={expandedCreator === c.id}
                            aria-controls={`integrity-${c.id}`}
                            className="cursor-pointer text-left font-medium"
                          >
                            {c.name}
                          </button>
                        </td>
                        <td className="hidden p-4 sm:table-cell">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${rev.badge}`}>{rev.label}</span>
                        </td>
                        <td className="hidden p-4 md:table-cell">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${sci.badge}`}>{sci.label}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div className={getBarClass(c.transparencyScore)} style={{ width: `${c.transparencyScore}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{c.transparencyScore}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`font-aq-display text-lg font-bold ${getGradeClass(c.integrityGrade)}`}>
                            {c.integrityGrade}
                          </span>
                        </td>
                        <td className="hidden p-4 sm:table-cell">
                          {c.hasResponded ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle aria-hidden="true" className="size-3" /> Responded
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <HelpCircle aria-hidden="true" className="size-3" /> Invited
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded Co-Creator Details. Was AnimatePresence height 0 → auto showing only the open one;
              every card is in the DOM, the closed ones hidden. */}
          {coCreators.map((c) => (
            <div
              key={c.id}
              id={`integrity-${c.id}`}
              className={
                expandedCreator === c.id
                  ? "animate-in overflow-hidden duration-300 fade-in slide-in-from-top-2"
                  : "hidden overflow-hidden"
              }
            >
              <div className="glass-card mb-6 rounded-xl border border-border/40 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-aq-display text-lg font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.category}</p>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Visit <ExternalLink aria-hidden="true" className="size-3" />
                  </a>
                </div>

                {/* Strengths First — Lead with what's good */}
                <div className="mb-4">
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-700">
                    <CheckCircle aria-hidden="true" className="size-4" /> What They Do Well
                  </h4>
                  <ul className="space-y-1.5">
                    {c.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-green-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth Areas — Softer framing */}
                <div className="mb-4">
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                    <Eye aria-hidden="true" className="size-4" /> Areas for Growth
                  </h4>
                  <ul className="space-y-1.5">
                    {c.acknowledgments.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full border border-amber-400 text-[8px] text-amber-500"
                        >
                          !
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Invitations — Not demands */}
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <Handshake aria-hidden="true" className="size-4" /> Our Invitation
                  </h4>
                  <ul className="space-y-2">
                    {c.invitations.map((inv) => (
                      <li key={inv} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ArrowRight aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-primary" />
                        {inv}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg border border-border/30 bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground italic">
                      {c.hasResponded
                        ? `Response received on ${c.responseDate}. View full response below.`
                        : "Invitation extended. We welcome a response at any time — the table is always open."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Invitation */}
      <section className="py-16">
        <div className="container max-w-3xl text-center">
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h2 className="mb-4 font-aq-display text-3xl font-bold">The Table Is Open</h2>
            <p className="mx-auto mb-6 max-w-xl leading-relaxed text-muted-foreground">
              We believe every organization in the water information space wants to do good. Some are further along the
              journey than others. This protocol isn&apos;t about drawing lines — it&apos;s about building bridges. If
              your intention is to serve the public, take your place at the table. The collective consciousness rises
              when we rise together.
            </p>
            <p className="mx-auto mb-8 max-w-lg text-sm text-muted-foreground italic">
              &quot;We don&apos;t demand perfection. We celebrate honesty about imperfection and genuine steps toward
              integrity.&quot;
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" asChild>
                <Link href={aq("/manifesto")}>Read Our Manifesto</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={aq("/landscape")}>Collective Consciousness Map</Link>
              </Button>
              <Button asChild>
                <Link href={aq("/methodology")}>
                  <Eye aria-hidden="true" className="mr-2 size-4" /> Audit Our Methodology
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Submit Response */}
      <section className="border-t border-border/30 bg-primary/3 py-12">
        <div className="container max-w-2xl text-center">
          <Users aria-hidden="true" className="mx-auto mb-4 size-8 text-primary" />
          <h3 className="mb-3 font-aq-display text-xl font-bold">Are You a Co-Creator?</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            If your organization appears in our index, we warmly invite you to respond to the 15 Questions. Your
            response will be published in full, unedited. Share your journey, acknowledge your growth areas, and
            demonstrate your commitment to the collective.
          </p>
          <Button onClick={() => toast("Response portal coming soon — thank you for your willingness!")}>
            <Send aria-hidden="true" className="mr-2 size-4" /> Submit Your Response
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Responses are published verbatim. We do not edit, filter, or curate submitted responses.
          </p>
          <div className="mt-6">
            <ShareButton variant="inline" className="justify-center" />
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
