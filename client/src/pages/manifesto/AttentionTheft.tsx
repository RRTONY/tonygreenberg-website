/**
 * THE ATTENTION THEFT MANIFESTO — Consolidated Mega-Page
 * One devastating scroll. Super hot. Super sexy. Super scary.
 * All 6 original pages merged into 9 sections with glamour imagery.
 */
import { useState, useRef } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";
import ManifestoLayout, {
  C,
  GlassCard,
  SectionLabel,
  SectionTitle,
  SectionIntro,
  PullQuote,
  StatCard,
  CrusadeDivider,
  HeroSection,
  EmberParticles,
  ShatteredGlass,
} from "./ManifestoLayout";
import {
  Flame,
  Shield,
  Sprout,
  Handshake,
  Globe,
  BookOpen,
  Scale,
  Swords,
  Megaphone,
  AlertTriangle,
  Target,
  Zap,
  ArrowRight,
  ArrowDown,
  Trash2,
  Mail,
  UserX,
  Clock,
  FileWarning,
  Share2,
  Star,
  ExternalLink,
  ChevronRight,
  Filter,
  FileText,
  Copy,
  CheckCircle,
  Send,
  Trophy,
  Users,
  Skull,
  TrendingUp,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   GLAMOUR IMAGES — Vogue Italia editorial style
   ═══════════════════════════════════════════════════════════════ */
const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-hero_d3ee8a5e.jpg",
  sacred: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-sacred-QNMeMG2mvDZqqvgSUsVrLM.webp",
  weapons: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-weapons_82cdd78e.jpg",
  legal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-legal_e83b2084.jpg",
  blocker: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-blocker-jHEBDsmZ33rTwcjbakiiKi.webp",
  shame: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-shame_68bf4b52.jpg",
  report: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-glamour-report_7aea41eb.jpg",
};

/* ═══════════════════════════════════════════════════════════════
   DATA — Economics Table
   ═══════════════════════════════════════════════════════════════ */
const ECONOMICS_DATA = [
  { metric: "Average emails/day (knowledge worker)", value: "121", source: "Radicati Group, 2023", highlight: false },
  { metric: "Average emails/day (executives)", value: "200+", source: "Radicati Group, 2023", highlight: false },
  { metric: "Percentage of email that is spam", value: "45\u201385%", source: "Industry composite", highlight: true },
  { metric: "Recovery time per interruption", value: "23 min 15 sec", source: "Dr. Gloria Mark, UC Irvine", highlight: true },
  { metric: "Increase in task completion time", value: "+50%", source: "Mark et al., 2008", highlight: false },
  { metric: "Increase in errors after interruption", value: "+50%", source: "Mark et al., 2008", highlight: false },
  { metric: "Percentage of workweek spent on email", value: "28%", source: "McKinsey Global Institute", highlight: true },
  { metric: "Hours/year lost to email management", value: "582 hours", source: "McKinsey, derived", highlight: false },
  { metric: "Value at $200/hr executive rate", value: "$116,400/yr stolen", source: "Per executive, per year", highlight: true },
  { metric: "Annual U.S. economic cost of interruptions", value: "$588 Billion", source: "Basex Research, 2005", highlight: false },
  { metric: "Inflation-adjusted cost (2025 estimate)", value: "$997+ Billion", source: "Basex, CPI-adjusted", highlight: true },
  { metric: "AI spam capacity per bad actor", value: "10,000+ msgs/hr", source: "Industry estimate", highlight: true },
  { metric: "Marginal cost to sender", value: "$0.00", source: "Total asymmetry", highlight: true },
  { metric: "Cost to recipient per message", value: "23 min of life", source: "Dr. Gloria Mark", highlight: false },
];

/* ═══════════════════════════════════════════════════════════════
   DATA — The 10 Weapons
   ═══════════════════════════════════════════════════════════════ */
const WEAPONS = [
  { num: "01", icon: Trash2, title: "Never Respond", subtitle: "The Zero-Engagement Protocol", desc: "Every response \u2014 even \"unsubscribe\" \u2014 validates their model. It confirms a live address, an engaged human, a potential mark. The first weapon is absolute silence.", action: "Delete without opening. Mark as spam. Move on." },
  { num: "02", icon: Shield, title: "Deploy AI Blockers", subtitle: "Fight Fire With Fire", desc: "If they\u2019re using AI to attack, use AI to defend. Tools like SaneBox, Clean Email, and Superhuman use machine learning to identify and quarantine spam before it reaches your attention.", action: "Take the Blocker Finder quiz below." },
  { num: "03", icon: Mail, title: "Use Email Aliases", subtitle: "The Disposable Identity Strategy", desc: "Services like SimpleLogin and AnonAddy let you create unlimited email aliases. Give each service a unique alias. When one gets compromised, kill it.", action: "Set up SimpleLogin or AnonAddy today." },
  { num: "04", icon: UserX, title: "Public Shame", subtitle: "Name Them. Document Them.", desc: "Spammers operate in the dark. They count on anonymity. Screenshot it, name the company, share it publicly. Make the social cost of spamming higher than the economic benefit.", action: "Use the Report form below to build the database." },
  { num: "05", icon: Clock, title: "Time-Block Your Inbox", subtitle: "Reclaim Your Attention", desc: "Check email twice a day. Not continuously. Set specific windows \u2014 10am and 3pm \u2014 and close your email client the rest of the time.", action: "Set two email windows today." },
  { num: "06", icon: FileWarning, title: "Report to Authorities", subtitle: "Make It Official", desc: "File complaints with the FTC, the FCC, and your state attorney general. Volume of complaints drives regulatory action. Be the volume.", action: "File at reportfraud.ftc.gov" },
  { num: "07", icon: Share2, title: "Share This Manifesto", subtitle: "Carry The Baton", desc: "Every person who reads this and acts reduces the ROI of spam by one more unit. Share it with your team, your company, your network.", action: "Send this page to 5 people drowning in spam." },
  { num: "08", icon: Scale, title: "Demand Better Laws", subtitle: "The Legislative Front", desc: "The CAN-SPAM Act is a joke \u2014 it doesn\u2019t even require opt-in consent. Demand legislation modeled on GDPR and CASL. Real penalties. Real enforcement.", action: "Use the letter template in Legal Arsenal below." },
  { num: "09", icon: Megaphone, title: "Organize Your Company", subtitle: "Institutional Defense", desc: "Deploy enterprise-grade spam filtering. Train your team on the economics of attention theft. Make \"inbox defense\" part of your operational culture.", action: "Propose an email hygiene policy at your next meeting." },
  { num: "10", icon: Zap, title: "Change Your Email", subtitle: "The Nuclear Option", desc: "If your current email is beyond saving, start fresh. Migrate to a new address with strict alias protocols from day one.", action: "Consider Hey.com or Proton Mail for a fresh start." },
];

/* ═══════════════════════════════════════════════════════════════
   DATA — Legal Arsenal
   ═══════════════════════════════════════════════════════════════ */
type LawStatus = "existing" | "proposed" | "action";
const LAWS: { title: string; jurisdiction: string; status: LawStatus; summary: string; detail: string; actionUrl?: string }[] = [
  { title: "CAN-SPAM Act (2003)", jurisdiction: "United States", status: "existing", summary: "Requires opt-out mechanism, honest headers, physical address. Penalties up to $51,744 per violation.", detail: "The CAN-SPAM Act sets rules for commercial email but does NOT require prior consent (opt-in), making it one of the weakest anti-spam laws among developed nations." },
  { title: "GDPR (2018)", jurisdiction: "European Union", status: "existing", summary: "Requires explicit prior consent. Fines up to \u20AC20M or 4% of global revenue.", detail: "Requires affirmative, unambiguous consent before sending marketing communications. The gold standard \u2014 and the model the U.S. should adopt." },
  { title: "CCPA / CPRA (2020/2023)", jurisdiction: "California, USA", status: "existing", summary: "Right to know, delete, and opt-out of data sales. Fines up to $7,500 per intentional violation.", detail: "Gives consumers the right to know what data is collected, delete it, and opt out of its sale. Provides tools to cut off the data brokers who fuel spam." },
  { title: "CASL (2014)", jurisdiction: "Canada", status: "existing", summary: "Requires express consent. Penalties up to $10M per violation.", detail: "One of the strictest in the world. Requires express consent (opt-in) for commercial electronic messages with severe penalties." },
  { title: "Attention Theft Prevention Act (Proposed)", jurisdiction: "United States (Federal)", status: "proposed", summary: "Would classify unsolicited email as economic theft with damages based on recipient\u2019s hourly rate.", detail: "Damages calculated based on professional hourly rate \u00d7 23-minute recovery time. At $200/hr, each spam email = $77 liability." },
  { title: "AI Transparency in Communications Act (Proposed)", jurisdiction: "United States (Federal)", status: "proposed", summary: "Would require AI-generated emails to be labeled, with criminal penalties for AI-powered spam at scale.", detail: "Sending 1,000+ AI-generated unsolicited emails per day would constitute a federal offense. AI providers bear joint liability." },
  { title: "Contact Your Representatives", jurisdiction: "United States", status: "action", summary: "Write to your congressional representatives demanding stronger anti-spam legislation.", detail: "The CAN-SPAM Act is 20+ years old. It needs to be replaced with legislation that treats attention theft as the economic crime it is.", actionUrl: "https://www.congress.gov/members/find-your-member" },
];

const STATUS_STYLES: Record<LawStatus, { bg: string; text: string; label: string; icon: typeof Scale }> = {
  existing: { bg: "rgba(14,124,124,0.12)", text: C.teal, label: "Existing Law", icon: Scale },
  proposed: { bg: "rgba(139,105,20,0.12)", text: C.gold, label: "Proposed", icon: FileText },
  action: { bg: "rgba(200,22,26,0.06)", text: C.red, label: "Take Action", icon: Megaphone },
};

const LETTER_TEMPLATE = `Dear [Representative Name],

I am writing to urge you to support stronger federal legislation addressing unsolicited commercial email and AI-powered spam. The CAN-SPAM Act of 2003 is woefully outdated and fails to protect American workers and businesses from what has become a nearly $1 trillion annual economic theft.

Research from UC Irvine shows each email interruption costs 23 minutes of recovery time. With AI enabling bad actors to send 10,000+ personalized spam messages per hour at zero cost, the asymmetry is catastrophic. The sender pays nothing. The recipient pays with their life.

I urge you to support legislation that: (1) requires explicit opt-in consent for all commercial email, (2) mandates disclosure of AI-generated communications, (3) establishes meaningful per-violation penalties, and (4) creates a private right of action for recipients.

Respectfully,
[Your Name]`;

/* ═══════════════════════════════════════════════════════════════
   DATA — Blocker Finder Quiz
   ═══════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  { id: "platform", question: "What email platform do you primarily use?", options: [
    { label: "Gmail / Google Workspace", value: "gmail" },
    { label: "Outlook / Microsoft 365", value: "outlook" },
    { label: "Apple Mail / iCloud", value: "apple" },
    { label: "Other (ProtonMail, Fastmail, etc.)", value: "other" },
  ]},
  { id: "volume", question: "How many unwanted emails do you receive per day?", options: [
    { label: "Under 20", value: "low" },
    { label: "20\u201350", value: "medium" },
    { label: "50\u2013100", value: "high" },
    { label: "100+", value: "extreme" },
  ]},
  { id: "type", question: "What type of spam bothers you most?", options: [
    { label: "Cold outreach / sales pitches", value: "sales" },
    { label: "Newsletter subscriptions I never signed up for", value: "newsletters" },
    { label: "Phishing / scam attempts", value: "phishing" },
    { label: "All of the above equally", value: "all" },
  ]},
  { id: "tech", question: "How technical are you?", options: [
    { label: "I just want it to work", value: "basic" },
    { label: "Comfortable with settings and filters", value: "moderate" },
    { label: "I can configure DNS records and API integrations", value: "advanced" },
    { label: "I build software", value: "developer" },
  ]},
];

const TOOLS = [
  { name: "SaneBox", url: "https://www.sanebox.com", desc: "AI-powered email triage. Moves unimportant emails to a separate folder. Learns your priorities.", platforms: ["gmail","outlook","apple","other"], techLevel: ["basic","moderate","advanced","developer"], bestFor: ["sales","newsletters","all"], rating: 5, price: "$7/mo" },
  { name: "Unroll.me", url: "https://unroll.me", desc: "Mass unsubscribe from newsletters. See all subscriptions in one view and kill them.", platforms: ["gmail","outlook","apple"], techLevel: ["basic","moderate"], bestFor: ["newsletters","all"], rating: 4, price: "Free" },
  { name: "Clean Email", url: "https://clean.email", desc: "Bulk email management with smart rules. Auto-clean, unsubscribe, and organize at scale.", platforms: ["gmail","outlook","apple","other"], techLevel: ["basic","moderate","advanced"], bestFor: ["sales","newsletters","all"], rating: 4, price: "$10/mo" },
  { name: "Hey.com", url: "https://hey.com", desc: "Basecamp\u2019s radical email rethink. Screener blocks unknown senders. The Feed separates newsletters.", platforms: ["other"], techLevel: ["basic","moderate","advanced","developer"], bestFor: ["sales","newsletters","phishing","all"], rating: 5, price: "$99/yr" },
  { name: "Proton Mail", url: "https://proton.me/mail", desc: "End-to-end encrypted email. Swiss privacy laws. Built-in spam filtering with zero data harvesting.", platforms: ["other"], techLevel: ["moderate","advanced","developer"], bestFor: ["phishing","sales","all"], rating: 5, price: "Free / $4/mo" },
  { name: "MailWasher", url: "https://www.mailwasher.net", desc: "Preview and delete spam before it reaches your inbox. Bounce spam back to sender.", platforms: ["gmail","outlook","apple","other"], techLevel: ["moderate","advanced"], bestFor: ["sales","phishing","all"], rating: 3, price: "$40/yr" },
  { name: "SimpleLogin / AnonAddy", url: "https://simplelogin.io", desc: "Email alias service. Create unlimited aliases. When one gets spammed, kill it.", platforms: ["gmail","outlook","apple","other"], techLevel: ["advanced","developer"], bestFor: ["sales","newsletters","phishing","all"], rating: 5, price: "Free / $4/mo" },
  { name: "Superhuman", url: "https://superhuman.com", desc: "The fastest email experience. AI triage, split inbox, keyboard-first for high-volume professionals.", platforms: ["gmail","outlook"], techLevel: ["moderate","advanced","developer"], bestFor: ["sales","all"], rating: 4, price: "$30/mo" },
];

function scoreTools(answers: Record<string, string>) {
  return TOOLS.map((tool) => {
    let score = 0;
    if (tool.platforms.includes(answers.platform)) score += 3;
    if (tool.techLevel.includes(answers.tech)) score += 2;
    if (tool.bestFor.includes(answers.type)) score += 2;
    if (answers.volume === "extreme" && ["SaneBox","Hey.com","Superhuman"].includes(tool.name)) score += 2;
    if (answers.volume === "high" && tool.name === "Clean Email") score += 1;
    return { ...tool, score };
  }).sort((a, b) => b.score - a.score).slice(0, 5);
}

/* ═══════════════════════════════════════════════════════════════
   DATA — Related Articles
   ═══════════════════════════════════════════════════════════════ */
const CRUSADE_ARTICLES = [
  { slug: "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", title: "Zuck: Fix This Now & Stop Lying to Congress" },
  { slug: "california-toll-roads-legalized-scam", title: "California Toll Roads: A Legalized Scam" },
  { slug: "the-1000-hour-hold", title: "The $1,000/Hour Hold" },
  { slug: "forward-health-is-a-sideway-step-at-best", title: "Forward Health Is a Sideway Step at Best" },
  { slug: "bread-stuck-with-no-customer-service", title: "Lodge Bread: Stuck With No Customer Service" },
  { slug: "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", title: "DMN8: Poster Child for Fitness Fraud" },
  { slug: "hiding-fees-tips-in-the-transparent-age", title: "Hiding Fees & Tips in the Transparent Age" },
  { slug: "luz-lounge-where-loyalty-goes-to-die-groupon", title: "Luz Lounge: Where Loyalty Goes to Die" },
];

const TRUST_ARTICLES = [
  { slug: "the-decay-of-modern-day-communication", title: "The Decay of Modern Day Communication" },
  { slug: "only-time-buys-trust", title: "Only Time Buys Trust" },
  { slug: "why-good-service-is-all-about-trust", title: "Why Good Service Is All About Trust" },
  { slug: "customer-service-key-to-business-success", title: "Customer Service: Key to Business Success" },
];

/* ═══════════════════════════════════════════════════════════════
   SPAM REPORT TYPES
   ═══════════════════════════════════════════════════════════════ */
const SPAM_TYPE_MAP: Record<string, "cold-outreach" | "unsolicited-newsletter" | "ai-generated-spam" | "phishing-scam"> = {
  "cold-outreach": "cold-outreach", "newsletter": "unsolicited-newsletter", "ai-generated": "ai-generated-spam", "phishing": "phishing-scam",
};
const FREQ_MAP: Record<string, "one-time" | "weekly" | "daily" | "multiple-daily"> = {
  "once": "one-time", "weekly": "weekly", "daily": "daily", "multiple-daily": "multiple-daily",
};
const TYPE_LABELS: Record<string, string> = { "cold-outreach": "Cold Outreach", "unsolicited-newsletter": "Newsletter Spam", "ai-generated-spam": "AI-Generated", "phishing-scam": "Phishing / Scam" };
const FREQ_LABELS: Record<string, string> = { "one-time": "One-time", "weekly": "Weekly", "daily": "Daily", "multiple-daily": "Multiple/Day" };

type FormData = { companyName: string; senderEmail: string; spamType: string; frequency: string; description: string; yourEmail: string };
const INITIAL: FormData = { companyName: "", senderEmail: "", spamType: "", frequency: "", description: "", yourEmail: "" };

/* ═══════════════════════════════════════════════════════════════
   SECTION IMAGE DIVIDER
   ═══════════════════════════════════════════════════════════════ */
function GlamourDivider({ src, alt, height = "h-48 md:h-72" }: { src: string; alt: string; height?: string }) {
  return (
<div className={`relative ${height} overflow-hidden`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" sizes="100vw" style={{ filter: "brightness(0.8) saturate(1.3) contrast(1.1)" }} loading="lazy" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, transparent 15%, transparent 85%, ${C.parchment} 100%)` }} />
      <EmberParticles count={8} color={C.red} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AttentionTheft() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const offender = params.get("offender");
  const [showOffenderBanner, setShowOffenderBanner] = useState(!!offender);

  /* Blocker Finder state */
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<ReturnType<typeof scoreTools> | null>(null);

  /* Legal filter */
  const [lawFilter, setLawFilter] = useState<LawStatus | "all">("all");
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null);
  const [letterCopied, setLetterCopied] = useState(false);

  /* Report form state */
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [showWall, setShowWall] = useState(false);

  /* tRPC */
  const submitMutation = trpc.spam.submit.useMutation({ onSuccess: () => setSubmitted(true) });
  const { data: wallData } = trpc.spam.wallOfShame.useQuery(undefined, { enabled: showWall || submitted });
  const { data: spamStats } = trpc.spam.stats.useQuery();

  /* Refs for scroll-to */
  const weaponsRef = useRef<HTMLElement>(null);
  const legalRef = useRef<HTMLElement>(null);
  const blockerRef = useRef<HTMLElement>(null);
  const shameRef = useRef<HTMLElement>(null);
  const reportRef = useRef<HTMLElement>(null);

  /* Blocker quiz handlers */
  const handleQuizAnswer = (qId: string, value: string) => {
    const next = { ...quizAnswers, [qId]: value };
    setQuizAnswers(next);
    if (quizStep < QUESTIONS.length - 1) setQuizStep(quizStep + 1);
    else setQuizResults(scoreTools(next));
  };
  const resetQuiz = () => { setQuizStep(0); setQuizAnswers({}); setQuizResults(null); };
  const getThreatLevel = () => {
    const vol = quizAnswers.volume;
    if (vol === "extreme") return { label: "CRITICAL", color: C.red, desc: "Your inbox has been overrun. Immediate action required." };
    if (vol === "high") return { label: "HIGH", color: C.ember, desc: "Your inbox is actively under siege." };
    return { label: "MODERATE", color: C.gold, desc: "Your inbox is under pressure but manageable." };
  };

  /* Report form handlers */
  const validateForm = () => {
    const e: Partial<FormData> = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.senderEmail.trim() || !form.senderEmail.includes("@")) e.senderEmail = "Valid email required";
    if (!form.spamType) e.spamType = "Required";
    if (!form.frequency) e.frequency = "Required";
    if (!form.description.trim() || form.description.trim().length < 10) e.description = "At least 10 characters";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    submitMutation.mutate({
      companyName: form.companyName.trim(),
      senderEmail: form.senderEmail.trim(),
      spamType: SPAM_TYPE_MAP[form.spamType] || "cold-outreach",
      frequency: FREQ_MAP[form.frequency] || "one-time",
      description: form.description.trim(),
      reporterEmail: form.yourEmail.trim() || undefined,
    });
  };

  const copyLetter = () => { navigator.clipboard.writeText(LETTER_TEMPLATE); setLetterCopied(true); setTimeout(() => setLetterCopied(false), 2000); };

  const filteredLaws = lawFilter === "all" ? LAWS : LAWS.filter((l) => l.status === lawFilter);

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.1)", color: C.ink,
    borderRadius: "0.75rem", padding: "0.875rem 1rem", fontSize: "1rem", width: "100%", outline: "none", lineHeight: 1.5,
  };
  const errorStyle: React.CSSProperties = { color: C.red, fontSize: "0.8rem", marginTop: "0.25rem" };

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <ManifestoLayout>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO — Vogue Cathedral
          ═══════════════════════════════════════════════════════════ */}
      <HeroSection
        image={IMG.hero}
        label="A Manifesto by Tony Greenberg"
        title={<>Defend The Cathedral.<br /><span style={{ color: C.red }}>Burn The Heresy.</span></>}
        subtitle="Email is sacred infrastructure. They're desecrating it. We're stopping them."
      >
        <div
          className="rounded-xl px-6 py-5 backdrop-blur-xl mb-6 max-w-3xl"
          style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(200,22,26,0.15)", boxShadow: "0 4px 24px rgba(200,22,26,0.08)" }}
        >
          <p className="text-base md:text-lg leading-relaxed" style={{ color: C.ink, lineHeight: 1.8 }}>
            This is not a rant. This is a <strong style={{ color: C.red }}>crusade</strong>. Email is the church of modern commerce &mdash; the infrastructure that enables human abundance to flow. Spammers are committing heresy against it. We don&apos;t just complain. We organize. We build weapons. We collapse their economics. <strong style={{ color: C.crimson }}>We win.</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => scrollTo(weaponsRef)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-1"
            style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 25px rgba(200,22,26,0.35), 0 8px 24px rgba(0,0,0,0.15)` }}
          >
            <Swords size={20} /> Arm Yourself <ArrowDown size={18} />
          </button>
          <button
            onClick={() => scrollTo(reportRef)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-1"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", color: C.ink, border: "1px solid rgba(0,0,0,0.12)", backdropFilter: "blur(12px)" }}
          >
            <Target size={20} /> Report A Spammer
          </button>
        </div>
      </HeroSection>

      {/* ═══ OFFENDER BANNER ═══ */}
      {showOffenderBanner && offender && (
        <section
          className="relative px-5 py-8 overflow-hidden"
          style={{ background: `linear-gradient(90deg, rgba(200,22,26,0.06) 0%, ${C.parchment} 50%, rgba(200,22,26,0.06) 100%)`, borderTop: `2px solid ${C.red}`, borderBottom: `2px solid ${C.red}` }}
        >
          <EmberParticles count={10} color={C.red} />
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <AlertTriangle size={28} style={{ color: C.red }} />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider" style={{ fontFamily: "'Fraunces', serif", color: C.red }}>
                {offender}
              </h2>
              <AlertTriangle size={28} style={{ color: C.red }} />
            </div>
            <p className="text-base md:text-lg mb-4" style={{ color: C.ink, lineHeight: 1.7 }}>
              Someone sent you this link because <strong style={{ color: C.red }}>{offender}</strong> has been reported for attention theft. Your company is being publicly documented in our accountability database.
            </p>
            <p className="text-sm mb-4" style={{ color: C.muted }}>
              This page is part of a growing movement against unsolicited commercial email. Read below to understand why what you&apos;re doing is destroying the most important communication infrastructure in human history.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => scrollTo(shameRef)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 15px rgba(200,22,26,0.25)` }}
              >
                <Target size={16} /> View Reports
              </button>
              <button onClick={() => setShowOffenderBanner(false)} className="text-xs underline opacity-50 hover:opacity-80 transition-opacity" style={{ color: C.muted }}>
                Dismiss
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: THE SACRED — Cathedral Interior
          ═══════════════════════════════════════════════════════════ */}
      <GlamourDivider src={IMG.sacred} alt="Sacred cathedral interior with golden light" />

      <section className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: C.warmWhite }}>
        <ShatteredGlass />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color={C.gold}>The Sacred</SectionLabel>
          <SectionTitle>What Email Actually Is</SectionTitle>
          <SectionIntro>
            Before we talk about the war, let&apos;s be clear about what we&apos;re protecting. Email isn&apos;t just a tool. It&apos;s one of the most profound inventions in human history.
          </SectionIntro>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              { icon: Shield, title: "The Church of Commerce", text: "The sacred space where trust is built, deals are made, relationships are formed, and human abundance flows between strangers who become partners.", color: C.gold },
              { icon: Sprout, title: "The Garden of Opportunity", text: "Where job offers arrive. Where clients say yes. Where old friends reconnect. Where mentors share wisdom. Where lives change direction.", color: C.teal },
              { icon: Handshake, title: "The Portal to Abundance", text: "Every legitimate email represents someone choosing to invest their attention in another person \u2014 an act of trust and genuine human connection.", color: C.ember },
            ].map((card) => (
              <GlassCard key={card.title} variant="default">
                <card.icon size={36} className="mb-4" style={{ color: card.color }} />
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>{card.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: C.muted, lineHeight: 1.7 }}>{card.text}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard variant="teal" className="mt-12">
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
              <Globe size={80} style={{ color: C.teal, opacity: 0.7 }} />
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Fraunces', serif", color: C.teal }}>The Great Equalizer</h3>
                <p className="text-base leading-relaxed mb-3" style={{ color: C.muted, lineHeight: 1.8 }}>
                  A person in a village in India can reach a CEO in New York &mdash; instantly, for free, with no gatekeeper. A startup founder can pitch a hundred investors in a day.
                </p>
                <p className="text-base leading-relaxed" style={{ color: C.darkBrown, lineHeight: 1.8 }}>
                  Before email, communication at scale required money. Email made reach infinite and cost zero. <strong style={{ color: C.teal }}>The kid with an idea had the same inbox as the billionaire.</strong>
                </p>
              </div>
            </div>
          </GlassCard>

          <PullQuote color={C.gold}>
            &ldquo;Email democratized access. It&apos;s the infrastructure that lets strangers become partners, ideas become companies, and individuals become movements.&rdquo;
          </PullQuote>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: THE HERESY — Economics & Data
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative px-5 py-20 md:py-28 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.sand} 0%, rgba(200,22,26,0.04) 50%, ${C.sand} 100%)` }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(200,22,26,0.06) 0%, transparent 60%)" }} />
        <EmberParticles count={20} color={C.red} />

        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color={C.red}>The Heresy</SectionLabel>
          <SectionTitle color={C.red}>What They&apos;re Doing To Our Cathedral</SectionTitle>
          <SectionIntro>
            Every morning I wake up to an inbox that has been violated. Not by colleagues. Not by partners. By strangers who decided their need to sell is more important than my need to think, to work, to live.
          </SectionIntro>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <StatCard number="$997B" label="Annual Economic Theft" source="Basex Research, inflation-adjusted" />
            <StatCard number="23 min" label="Recovery Per Interruption" source="UC Irvine, Dr. Gloria Mark" />
            <StatCard number="65+ hrs" label="Daily Productivity Destroyed" source="170 spam \u00d7 23 min recovery" />
            <StatCard number="45-85%" label="Of All Email Is Spam" source="Industry research composite" />
          </div>

          <PullQuote color={C.red}>
            &ldquo;AI didn&apos;t just give spammers a bigger megaphone. It gave them an industrial-scale desecration machine pointed directly at our sacred space.&rdquo;
          </PullQuote>

          {/* AI Apocalypse Card */}
          <GlassCard variant="danger" glow className="mt-6">
            <div className="flex items-start gap-4">
              <Zap size={32} className="shrink-0 mt-1" style={{ color: C.red }} />
              <div>
                <p className="text-lg leading-relaxed mb-4" style={{ color: C.ink, lineHeight: 1.8 }}>
                  Before AI, a spammer could send maybe 500 personalized emails a day. With AI, a single bad actor can generate <strong style={{ color: C.red }}>10,000+ unique, personalized spam messages per hour</strong> at zero marginal cost.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-xl p-4" style={{ background: "rgba(212,133,10,0.08)", border: "1px solid rgba(212,133,10,0.15)" }}>
                    <TrendingUp size={20} className="mb-2" style={{ color: C.ember }} />
                    <p className="text-sm font-bold" style={{ color: C.ember }}>Sender Cost</p>
                    <p className="text-3xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>$0.00</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>Total asymmetry</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "rgba(200,22,26,0.06)", border: "1px solid rgba(200,22,26,0.12)" }}>
                    <AlertTriangle size={20} className="mb-2" style={{ color: C.red }} />
                    <p className="text-sm font-bold" style={{ color: C.red }}>Recipient Cost</p>
                    <p className="text-3xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>23 min</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>Of irreplaceable life</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Full Economics Table */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>
              <Scale size={20} style={{ color: C.red }} /> Full Economics Breakdown
            </h3>
            <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid rgba(200,22,26,0.15)` }}>
              <table className="w-full text-left" style={{ minWidth: 640 }}>
                <thead>
                  <tr style={{ background: "rgba(200,22,26,0.08)" }}>
                    <th className="px-5 py-3 text-sm font-bold" style={{ color: C.ink, fontFamily: "'Fraunces', serif" }}>Metric</th>
                    <th className="px-5 py-3 text-sm font-bold text-right" style={{ color: C.ink, fontFamily: "'Fraunces', serif" }}>Value</th>
                    <th className="px-5 py-3 text-sm font-bold" style={{ color: C.muted }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {ECONOMICS_DATA.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: row.highlight ? "rgba(200,22,26,0.05)" : i % 2 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td className="px-5 py-3 text-base" style={{ color: C.darkBrown, lineHeight: 1.5 }}>
                        {row.highlight && <AlertTriangle size={14} className="inline mr-2 -mt-0.5" style={{ color: C.red }} />}
                        {row.metric}
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-lg whitespace-nowrap" style={{ fontFamily: "'Fraunces', serif", color: row.highlight ? C.red : C.ink }}>
                        {row.value}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: C.muted }}>{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sources */}
          <GlassCard variant="default" className="mt-8">
            <h4 className="text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2" style={{ color: C.teal }}>
              <ExternalLink size={14} /> Key Sources
            </h4>
            <ul className="space-y-2">
              {[
                { text: "Dr. Gloria Mark, UC Irvine \u2014 \"The Cost of Interrupted Work\" (2008)", url: "https://www.ics.uci.edu/~gmark/chi08-mark.pdf" },
                { text: "Radicati Group \u2014 Email Statistics Report, 2023", url: "https://www.radicati.com" },
                { text: "McKinsey Global Institute \u2014 The Social Economy (2012)", url: "https://www.mckinsey.com" },
                { text: "Basex Research \u2014 Information Overload Cost Study (2005)", url: "#" },
              ].map((s) => (
                <li key={s.text} className="flex items-start gap-2">
                  <ExternalLink size={14} className="mt-1 shrink-0" style={{ color: C.teal, opacity: 0.6 }} />
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: C.muted, lineHeight: 1.5 }}>{s.text}</a>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: THE 10 WEAPONS — Gilded Arsenal
          ═══════════════════════════════════════════════════════════ */}
      <GlamourDivider src={IMG.weapons} alt="Gilded weapons arsenal on marble table" />

      <section ref={weaponsRef} id="weapons" className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={25} color={C.red} />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Your Arsenal</SectionLabel>
          <SectionTitle>The 10 <span style={{ color: C.red }}>Weapons</span></SectionTitle>
          <SectionIntro>
            You don&apos;t need to do all ten. But every weapon you deploy makes the economics of spam worse for the attacker and better for you. Pick three. Start today.
          </SectionIntro>

          <div className="grid gap-5 mt-10">
            {WEAPONS.map((w, idx) => (
              <GlassCard key={w.num} variant={idx < 3 ? "danger" : "default"} glow={idx === 0} className="relative overflow-hidden">
                <div className="absolute top-0 right-4 font-bold pointer-events-none select-none" style={{ fontFamily: "'Fraunces', serif", fontSize: "7rem", color: idx < 3 ? C.red : C.ink, opacity: idx < 3 ? 0.06 : 0.03, lineHeight: 1 }}>
                  {w.num}
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: idx < 3 ? "rgba(200,22,26,0.12)" : "rgba(0,0,0,0.03)", border: `1px solid ${idx < 3 ? "rgba(200,22,26,0.2)" : "rgba(0,0,0,0.06)"}` }}>
                    <w.icon size={26} style={{ color: idx < 3 ? C.red : C.ink }} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: idx < 3 ? "rgba(200,22,26,0.1)" : "rgba(0,0,0,0.03)", color: idx < 3 ? C.red : C.muted, border: `1px solid ${idx < 3 ? "rgba(200,22,26,0.15)" : "rgba(0,0,0,0.06)"}` }}>
                      Weapon {w.num}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-0.5" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>{w.title}</h3>
                    <p className="text-sm font-medium mb-3" style={{ color: C.teal }}>{w.subtitle}</p>
                    <p className="text-base leading-relaxed mb-4" style={{ color: C.muted, lineHeight: 1.8 }}>{w.desc}</p>
                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: "rgba(200,22,26,0.04)", border: "1px solid rgba(200,22,26,0.08)" }}>
                      <Flame size={16} className="mt-0.5 shrink-0" style={{ color: C.ember }} />
                      <p className="text-sm font-semibold" style={{ color: C.ink }}>{w.action}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <PullQuote color={C.red}>
            &ldquo;You don&apos;t have to win the war in a day. You just have to make their economics worse every day until the system collapses.&rdquo;
          </PullQuote>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: LEGAL ARSENAL — Courtroom
          ═══════════════════════════════════════════════════════════ */}
      <GlamourDivider src={IMG.legal} alt="Courtroom with scales of justice" />

      <section ref={legalRef} id="legal" className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: C.warmWhite }}>
        <EmberParticles count={12} color={C.gold} />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color={C.gold}>Legal Framework</SectionLabel>
          <SectionTitle>Legal <span style={{ color: C.gold }}>Arsenal</span></SectionTitle>
          <SectionIntro>
            The laws that exist, the laws we need, and how to demand them. The legal infrastructure of attention protection is decades behind the technology of attention theft.
          </SectionIntro>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-8 mb-6 flex-wrap">
            <Filter size={16} style={{ color: C.muted }} />
            {([{ label: "All", value: "all" as const }, { label: "Existing Law", value: "existing" as const }, { label: "Proposed", value: "proposed" as const }, { label: "Take Action", value: "action" as const }]).map((f) => (
              <button key={f.value} onClick={() => setLawFilter(f.value)} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: lawFilter === f.value ? C.ink : "rgba(0,0,0,0.03)", color: lawFilter === f.value ? "#fff" : C.ink, border: `1px solid ${lawFilter === f.value ? C.ink : "rgba(0,0,0,0.06)"}` }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Law Cards */}
          <div className="grid gap-4">
            {filteredLaws.map((law) => {
              const s = STATUS_STYLES[law.status];
              const Icon = s.icon;
              const isExpanded = expandedLaw === law.title;
              return (
                <GlassCard key={law.title} variant={law.status === "action" ? "danger" : "default"} glow={law.status === "action"}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg, border: `1px solid ${s.text}30` }}>
                      <Icon size={22} style={{ color: s.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.text}30` }}>{s.label}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}><Globe size={12} />{law.jurisdiction}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>{law.title}</h3>
                      <p className="text-base leading-relaxed" style={{ color: C.muted, lineHeight: 1.7 }}>{law.summary}</p>
                      <button onClick={() => setExpandedLaw(isExpanded ? null : law.title)} className="mt-3 text-sm font-medium hover:underline" style={{ color: s.text }}>
                        {isExpanded ? "Show less" : "Read full analysis \u2192"}
                      </button>
                      {isExpanded && (
                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                          <p className="text-base leading-relaxed" style={{ color: C.darkBrown, lineHeight: 1.8 }}>{law.detail}</p>
                          {law.actionUrl && (
                            <a href={law.actionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm font-bold px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5" style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 20px rgba(200,22,26,0.3)` }}>
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

          {/* Letter Template */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif", color: C.red }}>
              <Megaphone size={20} /> Letter to Your Representative
            </h3>
            <div className="relative">
              <button onClick={copyLetter} className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 z-10" style={{ backgroundColor: letterCopied ? "rgba(14,124,124,0.15)" : "rgba(0,0,0,0.04)", color: letterCopied ? C.teal : C.ink, border: `1px solid ${letterCopied ? "rgba(14,124,124,0.15)" : "rgba(0,0,0,0.08)"}` }}>
                {letterCopied ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <div className="rounded-2xl p-6 md:p-8 text-base leading-relaxed whitespace-pre-line" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.06)", color: C.ink, lineHeight: 1.8, fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                {LETTER_TEMPLATE}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: AI BLOCKER FINDER — Command Center
          ═══════════════════════════════════════════════════════════ */}
      <GlamourDivider src={IMG.blocker} alt="High-tech command center with threat detection screens" />

      <section ref={blockerRef} id="blocker-finder" className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={15} color={C.teal} />
        <div className="max-w-3xl mx-auto relative z-10">
          <SectionLabel color={C.teal}>Defense Systems</SectionLabel>
          <SectionTitle>AI Blocker <span style={{ color: C.teal }}>Finder</span></SectionTitle>
          <SectionIntro>
            Four questions. Personalized arsenal. Find the right weapons to defend your inbox.
          </SectionIntro>

          <div className="mt-10">
            {!quizResults ? (
              <>
                <div className="flex items-center gap-2 mb-8">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: i <= quizStep ? C.teal : "rgba(0,0,0,0.06)", boxShadow: i <= quizStep ? `0 0 8px ${C.teal}40` : "none" }} />
                  ))}
                </div>
                <div className="text-center mb-2">
                  <span className="text-xs font-bold tracking-wider uppercase" style={{ color: C.teal, opacity: 0.6 }}>Question {quizStep + 1} of {QUESTIONS.length}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>{QUESTIONS[quizStep].question}</h3>
                <div className="grid gap-3">
                  {QUESTIONS[quizStep].options.map((opt) => (
                    <button key={opt.value} onClick={() => handleQuizAnswer(QUESTIONS[quizStep].id, opt.value)} className="w-full text-left p-5 rounded-xl transition-all hover:-translate-y-0.5 group" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <span className="flex items-center justify-between">
                        <span className="text-base font-medium" style={{ color: C.darkBrown }}>{opt.label}</span>
                        <ChevronRight size={18} style={{ color: C.teal, opacity: 0.4 }} />
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <SectionLabel color={C.red}>Threat Assessment Complete</SectionLabel>
                  <div className="inline-block px-6 py-2 rounded-full text-xl font-bold mb-4" style={{ backgroundColor: `${getThreatLevel().color}20`, color: getThreatLevel().color, border: `2px solid ${getThreatLevel().color}`, boxShadow: `0 0 30px ${getThreatLevel().color}30` }}>
                    THREAT LEVEL: {getThreatLevel().label}
                  </div>
                  <p className="text-lg" style={{ color: C.muted }}>{getThreatLevel().desc}</p>
                </div>
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>Your Personalized Arsenal</h3>
                <div className="grid gap-4">
                  {quizResults.map((tool, i) => (
                    <GlassCard key={tool.name} variant={i === 0 ? "danger" : "teal"} glow={i === 0}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ backgroundColor: i === 0 ? "rgba(200,22,26,0.1)" : "rgba(14,124,124,0.1)", color: i === 0 ? C.red : C.teal, border: `1px solid ${i === 0 ? "rgba(200,22,26,0.2)" : "rgba(14,124,124,0.15)"}` }}>
                              {i === 0 ? "TOP PICK" : `#${i + 1}`}
                            </span>
                            <span className="text-sm font-medium" style={{ color: C.muted }}>{tool.price}</span>
                          </div>
                          <h4 className="text-xl font-bold mb-1" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>{tool.name}</h4>
                          <p className="text-base leading-relaxed mb-2" style={{ color: C.muted, lineHeight: 1.7 }}>{tool.desc}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star key={s} size={16} fill={s < tool.rating ? C.gold : "transparent"} style={{ color: s < tool.rating ? C.gold : "rgba(0,0,0,0.1)" }} />
                            ))}
                          </div>
                        </div>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-3 rounded-xl transition-all hover:scale-105" style={{ backgroundColor: "rgba(14,124,124,0.1)", border: "1px solid rgba(14,124,124,0.2)" }}>
                          <ExternalLink size={18} style={{ color: C.teal }} />
                        </a>
                      </div>
                    </GlassCard>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button onClick={resetQuiz} className="text-sm font-medium hover:underline" style={{ color: C.teal, opacity: 0.6 }}>Retake Assessment</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: WALL OF SHAME — Interrogation Room
          ═══════════════════════════════════════════════════════════ */}
      <GlamourDivider src={IMG.shame} alt="Interrogation room with spotlight on empty chair" height="h-56 md:h-80" />

      <section ref={shameRef} id="wall-of-shame" className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.sand} 0%, rgba(200,22,26,0.04) 50%, ${C.sand} 100%)` }}>
        <EmberParticles count={20} color={C.red} />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Public Accountability</SectionLabel>
          <SectionTitle>The Wall of <span style={{ color: C.red }}>Shame</span></SectionTitle>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <p className="text-base max-w-2xl" style={{ color: C.muted, lineHeight: 1.7 }}>
              The most-reported attention thieves, ranked by community reports. Every entry is built from real submissions. <strong style={{ color: C.red }}>Spammers: this is your permanent record.</strong>
            </p>
            {spamStats && spamStats.totalReports > 0 && (
              <div className="flex items-center gap-4 text-xs font-mono" style={{ color: C.teal }}>
                <span>{spamStats.totalReports} REPORTS</span>
                <span>{spamStats.uniqueCompanies} COMPANIES</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowWall(!showWall)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 mb-6"
            style={{ backgroundColor: showWall ? C.red : "rgba(200,22,26,0.1)", color: showWall ? "#fff" : C.red, border: `1px solid ${showWall ? C.red : "rgba(200,22,26,0.15)"}`, boxShadow: showWall ? `0 0 25px rgba(200,22,26,0.3)` : "none" }}
          >
            <Trophy size={16} /> {showWall ? "Hide Wall of Shame" : "Reveal Wall of Shame"}
          </button>

          {showWall && (
            <div className="space-y-3 mt-4">
              {wallData && wallData.length > 0 ? wallData.map((entry, i) => {
                const isTop3 = i < 3;
                const rankColors = ["#C8161A", "#D4850A", "#8B6914"];
                const borderColor = isTop3 ? rankColors[i] : "rgba(0,0,0,0.06)";
                return (
                  <div key={entry.companyName} className="flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all hover:-translate-y-0.5" style={{ background: isTop3 ? `rgba(200,22,26,0.04)` : "rgba(255,255,255,0.6)", border: `1px solid ${borderColor}` }}>
                    <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black" style={{ fontFamily: "'Fraunces', serif", backgroundColor: isTop3 ? rankColors[i] : "rgba(0,0,0,0.04)", color: isTop3 ? "#fff" : C.ink }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base truncate" style={{ color: C.ink }}>{entry.companyName}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: C.muted }}>
                        <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(200,22,26,0.08)", color: C.red, border: "1px solid rgba(200,22,26,0.12)" }}>
                          {TYPE_LABELS[entry.worstType] || entry.worstType}
                        </span>
                        <span>{FREQ_LABELS[entry.worstFrequency] || entry.worstFrequency}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-2xl font-black" style={{ fontFamily: "'Fraunces', serif", color: isTop3 ? rankColors[i] : C.red }}>{entry.reportCount}</div>
                      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.muted }}>reports</div>
                    </div>
                  </div>
                );
              }) : wallData && wallData.length === 0 ? (
                <GlassCard variant="default">
                  <div className="text-center py-8">
                    <Users size={40} className="mx-auto mb-4" style={{ color: C.teal, opacity: 0.4 }} />
                    <h4 className="text-lg font-bold mb-2" style={{ color: C.ink }}>No Reports Yet</h4>
                    <p className="text-sm" style={{ color: C.muted }}>Be the first to file a report below.</p>
                  </div>
                </GlassCard>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${C.red} transparent ${C.red} ${C.red}` }} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: REPORT A SPAMMER — Brass Button
          ═══════════════════════════════════════════════════════════ */}
      <GlamourDivider src={IMG.report} alt="Finger pressing brass bell with sparks flying" />

      <section ref={reportRef} id="report" className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={20} color={C.red} />
        <div className="max-w-3xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Public Accountability</SectionLabel>
          <SectionTitle>Report A <span style={{ color: C.red }}>Spammer</span></SectionTitle>
          <SectionIntro>
            Build the public shame database. Every report adds to the collective evidence. Spammers count on anonymity. We&apos;re taking it away.
          </SectionIntro>

          <div className="mt-10">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(200,22,26,0.06)", border: "1px solid rgba(200,22,26,0.12)" }}>
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: C.red }} />
                  <p className="text-sm" style={{ color: C.darkBrown, lineHeight: 1.6 }}>
                    This form creates a public record. Reports build the Wall of Shame database. Only submit factual information about actual spam you have received.
                  </p>
                </div>

                <GlassCard variant="default">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>Company / Sender Name <span style={{ color: C.red }}>*</span></label>
                      <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="e.g., Forward Medical, Apollo.io" style={inputStyle} />
                      {formErrors.companyName && <p style={errorStyle}>{formErrors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>Sender Email Address <span style={{ color: C.red }}>*</span></label>
                      <input type="email" value={form.senderEmail} onChange={(e) => setForm({ ...form, senderEmail: e.target.value })} placeholder="e.g., outreach@spamcompany.com" style={inputStyle} />
                      {formErrors.senderEmail && <p style={errorStyle}>{formErrors.senderEmail}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>Type of Spam <span style={{ color: C.red }}>*</span></label>
                      <select value={form.spamType} onChange={(e) => setForm({ ...form, spamType: e.target.value })} style={inputStyle}>
                        <option value="">Select type...</option>
                        <option value="cold-outreach">Cold Outreach / Sales Pitch</option>
                        <option value="newsletter">Unsolicited Newsletter</option>
                        <option value="ai-generated">AI-Generated Personalized Spam</option>
                        <option value="phishing">Phishing / Scam</option>
                      </select>
                      {formErrors.spamType && <p style={errorStyle}>{formErrors.spamType}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>How Often? <span style={{ color: C.red }}>*</span></label>
                      <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} style={inputStyle}>
                        <option value="">Select frequency...</option>
                        <option value="once">One-time</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                        <option value="multiple-daily">Multiple times per day</option>
                      </select>
                      {formErrors.frequency && <p style={errorStyle}>{formErrors.frequency}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>What Happened? <span style={{ color: C.red }}>*</span></label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the spam. Include notable details \u2014 fake personalization? Ignored unsubscribe? AI-generated?" rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                      {formErrors.description && <p style={errorStyle}>{formErrors.description}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: C.ink }}>Your Email <span className="text-xs font-normal" style={{ opacity: 0.4 }}>(optional)</span></label>
                      <input type="email" value={form.yourEmail} onChange={(e) => setForm({ ...form, yourEmail: e.target.value })} placeholder="your@email.com" style={inputStyle} />
                    </div>
                  </div>
                </GlassCard>

                <button type="submit" disabled={submitMutation.isPending} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: C.red, color: "#fff", boxShadow: `0 0 30px rgba(200,22,26,0.4)` }}>
                  {submitMutation.isPending ? (
                    <><div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#fff transparent #fff #fff" }} /> Filing Report...</>
                  ) : (
                    <><Send size={20} /> File Charges</>
                  )}
                </button>
                {submitMutation.isError && <p className="text-center text-sm" style={{ color: C.red }}>Failed to submit. Please try again.</p>}
              </form>
            ) : (
              <div className="text-center">
                <GlassCard variant="teal" glow className="max-w-lg mx-auto">
                  <CheckCircle size={56} className="mx-auto mb-4" style={{ color: C.teal, filter: "drop-shadow(0 0 12px rgba(14,124,124,0.4))" }} />
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>Report Filed</h3>
                  <p className="text-base leading-relaxed mb-6" style={{ color: C.muted, lineHeight: 1.7 }}>
                    Your report has been added to the public accountability database. Every report makes the economics of spam worse for the attacker.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => { setSubmitted(false); setForm(INITIAL); setFormErrors({}); }} className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5" style={{ backgroundColor: C.teal, color: "#000" }}>Report Another</button>
                    <button onClick={() => { setShowWall(true); scrollTo(shameRef); }} className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5" style={{ backgroundColor: "rgba(200,22,26,0.1)", color: C.red, border: "1px solid rgba(200,22,26,0.15)" }}>
                      <Trophy size={14} className="inline mr-1" /> View Wall of Shame
                    </button>
                  </div>
                </GlassCard>

                {/* Send to spammer */}
                <div className="mt-8">
                  <GlassCard variant="danger" glow className="max-w-lg mx-auto">
                    <ExternalLink size={24} className="mx-auto mb-3" style={{ color: C.red }} />
                    <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: C.ink }}>Send This To The Spammer</h4>
                    <p className="text-sm mb-4" style={{ color: C.muted, lineHeight: 1.6 }}>Copy this link and send it directly to the offender. Let them know they&apos;ve been reported.</p>
                    <ShareLink companyName={form.companyName} />
                  </GlassCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9: JOIN THE CRUSADE — CTA + Related Reading
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.sand} 0%, rgba(200,22,26,0.08) 40%, rgba(200,22,26,0.04) 100%)` }}>
        <EmberParticles count={30} />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* The Vow */}
          <div className="text-center mb-12">
            <Flame size={72} className="mx-auto mb-6" style={{ color: C.red, filter: "drop-shadow(0 0 20px rgba(200,22,26,0.3))" }} />
            <h2 className="font-bold mb-4" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 6vw, 3.5rem)", color: C.ink, lineHeight: 1.15 }}>
              Carry The Baton. <span style={{ color: C.red }}>Burn The Heresy.</span>
            </h2>
            <p className="text-lg mb-10" style={{ fontFamily: "'Fraunces', serif", color: C.muted }}>
              This isn&apos;t about shaming individuals. It&apos;s about collapsing a system.
            </p>
          </div>

          <GlassCard variant="default" className="text-left max-w-2xl mx-auto mb-12">
            {[
              "I will not respond.",
              "I will not pick up.",
              "I will make their \u201cmarketing\u201d irrelevant.",
              "I will change my email to escape their sewage.",
              "I will send this document to every person who violates my attention.",
              "And I will not stop until the economics of spam collapse entirely.",
            ].map((vow) => (
              <p key={vow} className="text-lg mb-3 last:mb-0 flex items-start gap-3" style={{ fontFamily: "'Fraunces', serif", color: C.ink, lineHeight: 1.7 }}>
                <Flame size={16} className="shrink-0 mt-1.5" style={{ color: C.red, opacity: 0.6 }} />
                <strong>{vow}</strong>
              </p>
            ))}
          </GlassCard>

          <CrusadeDivider />

          {/* Related Reading */}
          <div className="mt-12">
            <SectionLabel color={C.gold}>Intelligence Dossier</SectionLabel>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif", color: C.red }}>
              <Target size={20} /> The Crusades &mdash; Corporate Accountability
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {CRUSADE_ARTICLES.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="flex items-start gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style={{ backgroundColor: "rgba(200,22,26,0.04)", border: "1px solid rgba(200,22,26,0.1)" }}>
                  <Skull size={16} className="mt-1 shrink-0" style={{ color: C.red }} />
                  <p className="text-sm font-semibold" style={{ color: C.ink, lineHeight: 1.4 }}>{a.title}</p>
                </Link>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif", color: C.teal }}>
              <BookOpen size={20} /> Communication &amp; Trust
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {TRUST_ARTICLES.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="flex items-start gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style={{ backgroundColor: "rgba(14,124,124,0.04)", border: "1px solid rgba(14,124,124,0.08)" }}>
                  <BookOpen size={16} className="mt-1 shrink-0" style={{ color: C.teal }} />
                  <p className="text-sm font-semibold" style={{ color: C.ink, lineHeight: 1.4 }}>{a.title}</p>
                </Link>
              ))}
            </div>
          </div>

          <PullQuote color={C.red}>
            &ldquo;Every report makes the economics of spam worse for the attacker. You are the enforcement mechanism the law forgot to build.&rdquo;
          </PullQuote>
        </div>
      </section>
    </ManifestoLayout>
  );
}

/* ═══ SHARE LINK COMPONENT ═══ */
function ShareLink({ companyName }: { companyName: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://tonygreenberg.com/attention-theft?offender=${encodeURIComponent(companyName)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
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
      <SEO
        title="Attention Theft — The Manifesto"
        description="The case against attention theft: why your inbox is a crime scene and what to do about it."
        path="/manifesto/attention-theft"
        keywords="Tony Greenberg, attention theft, inbox, spam, attention economy"
        indexable={true}
      />
      <div className="flex items-center gap-2 p-3 rounded-lg text-xs font-mono break-all" style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(200,22,26,0.12)", color: C.ink }}>
        {shareUrl}
      </div>
      <button onClick={handleCopy} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5" style={{ backgroundColor: copied ? C.teal : C.red, color: copied ? "#000" : "#fff", boxShadow: copied ? `0 0 20px rgba(14,124,124,0.15)` : `0 0 20px rgba(200,22,26,0.3)` }}>
        {copied ? "Copied! Now send it to them." : "Copy Spammer Link"}
      </button>
    </div>
  );
}
