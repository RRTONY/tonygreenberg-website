/**
 * YOU'VE BEEN REPORTED — The Nuclear Spammer Confrontation Page
 * A LIVE ENFORCEMENT EXPERIENCE that unfolds as they scroll.
 *
 * Progressive reveal: Green checkmarks animate in as agencies are "reported to."
 * At halfway, the page STOPS with an invoice + 3-minute payment timer.
 * If they don't pay, the remaining agencies unleash.
 * Forensic fingerprint reveals their IP, browser, device back to them.
 * Database blacklist wall shows every platform they'll be banned from.
 * Links to the Crusade, blog posts, and alternative resources.
 *
 * URL PARAMETERS:
 *   ?company=AcmeCorp&domain=acme.com&email=spam@acme.com&id=123
 */
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";
import ManifestoLayout, {
  C,
  GlassCard,
  SectionLabel,
  SectionTitle,
  CrusadeDivider,
  EmberParticles,
  ShatteredGlass,
} from "./ManifestoLayout";
import {
  Flame,
  Shield,
  Scale,
  AlertTriangle,
  Skull,
  Eye,
  FileWarning,
  Gavel,
  Globe,
  Lock,
  Ban,
  Clock,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Send,
  Monitor,
  Wifi,
  MapPin,
  Fingerprint,
  CircleDollarSign,
  Heart,
  Lightbulb,
  BookOpen,
  Users,
  Zap,
  XCircle,
  CheckCircle2,
  Timer,
  Database,
  Server,
  UserCircle,
  Mail,
  Target,
  Crown,
  Crosshair,
  Siren,
  Building2,
  Briefcase,
  UserX,
  Unlink,
  Bomb,
  CircleAlert,
  Linkedin,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SPAMMER DETAILS from URL params
   ═══════════════════════════════════════════════════════════════ */
function useSpammerDetails() {
  const search = useSearch();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const company = params.get("company") || params.get("offender") || "";
  const domain = params.get("domain") || "";
  const email = params.get("email") || "";
  const reportId = params.get("id") || "";

  const { data: companyReports } = trpc.spam.byCompany.useQuery(
    { companyName: company },
    { enabled: !!company && company.length > 0 }
  );

  const { data: wallData } = trpc.spam.wallOfShame.useQuery(
    { limit: 50 },
    { enabled: !!company }
  );

  const wallEntry = wallData?.find(
    (e) => e.companyName.toLowerCase() === company.toLowerCase()
  );

  const reportCount = wallEntry?.reportCount || (companyReports?.length || 0);
  const isPersonalized = !!(company || domain || email);
  const effectiveDomain = domain || (email ? email.split("@")[1] || "" : "");

  return {
    company,
    domain: effectiveDomain,
    email,
    reportId,
    reportCount,
    isPersonalized,
    companyReports,
    wallEntry,
  };
}

/* ═══════════════════════════════════════════════════════════════
   ENFORCEMENT AGENCIES — Split into WAVE 1 (first 6) and WAVE 2 (remaining)
   ═══════════════════════════════════════════════════════════════ */
const AGENCIES_WAVE_1 = [
  { name: "Federal Trade Commission (FTC)", jurisdiction: "United States — Federal", action: "Complaint filed under CAN-SPAM Act, 15 U.S.C. § 7704", penalty: "Up to $51,744 per violation", icon: Shield, fileUrl: "https://reportfraud.ftc.gov/#/" },
  { name: "Internet Crime Complaint Center (IC3)", jurisdiction: "United States — FBI", action: "Referral filed for commercial fraud via electronic communication", penalty: "Criminal prosecution under 18 U.S.C. § 1030", icon: Eye, fileUrl: "https://www.ic3.gov/Home/ComplaintChoice" },
  { name: "Spamhaus Project", jurisdiction: "International", action: "Domain and IP submitted for blocklist consideration", penalty: "Blocks delivery to 3+ billion mailboxes", icon: Ban, fileUrl: "https://www.spamhaus.org/blocklists/" },
  { name: "Google Safe Browsing", jurisdiction: "Global", action: "Domain reported for deceptive practices", penalty: "Warning shown to all Chrome, Firefox, Safari users", icon: Shield, fileUrl: "https://safebrowsing.google.com/safebrowsing/report_phish/" },
  { name: "SpamCop", jurisdiction: "International", action: "IP address reported to real-time blocklist", penalty: "Automatic blocking across participating ISPs", icon: Ban, fileUrl: "https://www.spamcop.net/anonsignup.shtml" },
  { name: "Microsoft SmartScreen", jurisdiction: "Global", action: "Domain reported for unsafe content", penalty: "Blocked across Edge, Outlook, and Microsoft 365", icon: Shield, fileUrl: "https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site-guest" },
];

const AGENCIES_WAVE_2 = [
  { name: "Federal Communications Commission (FCC)", jurisdiction: "United States — Federal", action: "Complaint filed under TCPA", penalty: "Up to $16,000 per violation", icon: Globe, fileUrl: "https://consumercomplaints.fcc.gov/hc/en-us/requests/new?ticket_form_id=39744" },
  { name: "State Attorney General", jurisdiction: "All 50 U.S. States", action: "Consumer protection complaint filed under state UDAP statutes", penalty: "Up to $10,000+ per violation per state", icon: Gavel, fileUrl: "https://www.naag.org/find-my-ag/" },
  { name: "Anti-Phishing Working Group (APWG)", jurisdiction: "International Coalition", action: "Reported to global anti-fraud intelligence network", penalty: "Shared with 2,200+ member organizations", icon: Lock, fileUrl: "https://apwg.org/reportphishing" },
  { name: "ICANN / Domain Registrar", jurisdiction: "International", action: "WHOIS abuse complaint — Terms of Service violation", penalty: "Domain suspension or revocation", icon: Globe, fileUrl: "https://www.icann.org/compliance/complaint" },
  { name: "European Data Protection Authorities", jurisdiction: "European Union — GDPR", action: "Complaint for processing data without consent", penalty: "Up to €20,000,000 or 4% of annual revenue", icon: Scale, fileUrl: "https://edpb.europa.eu/about-edpb/about-edpb/members_en" },
  { name: "Canadian Anti-Fraud Centre (CAFC)", jurisdiction: "Canada — CASL", action: "Complaint filed under Canada's Anti-Spam Legislation", penalty: "Up to $10,000,000 per violation", icon: Shield, fileUrl: "https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm" },
  { name: "LinkedIn Trust & Safety", jurisdiction: "Global Platform", action: "Account reported for unsolicited commercial messaging and scraping", penalty: "Permanent account ban and legal action under CFAA", icon: Users, fileUrl: "https://www.linkedin.com/help/linkedin/answer/a1339364" },
  { name: "Better Business Bureau (BBB)", jurisdiction: "United States & Canada", action: "Formal complaint filed for deceptive business practices", penalty: "Public complaint record, rating downgrade, loss of accreditation", icon: Scale, fileUrl: "https://www.bbb.org/file-a-complaint" },
];

/* ═══════════════════════════════════════════════════════════════
   DATABASE BLACKLIST — Every platform they'll be banned from
   ═══════════════════════════════════════════════════════════════ */
const DATABASE_BLACKLIST = [
  { name: "LinkedIn", type: "Professional Network", consequence: "Account permanently banned. All connections notified.", icon: Users },
  { name: "Apollo.io", type: "Sales Intelligence", consequence: "Company flagged. All sequences terminated. Data purged.", icon: Database },
  { name: "ZoomInfo", type: "B2B Database", consequence: "Company profile flagged as spam operator. Buyer intent data revoked.", icon: Server },
  { name: "Lusha", type: "Contact Database", consequence: "All contact records quarantined. API access revoked.", icon: Lock },
  { name: "Hunter.io", type: "Email Finder", consequence: "Domain blacklisted. Email verification returns 'spam operator' flag.", icon: Ban },
  { name: "Clearbit", type: "Data Enrichment", consequence: "Company enrichment data flagged. All downstream integrations affected.", icon: Database },
  { name: "Seamless.AI", type: "Lead Generation", consequence: "Account terminated. Company added to global exclusion list.", icon: XCircle },
  { name: "Outreach.io", type: "Sales Engagement", consequence: "Domain blocklisted across all customer instances.", icon: Ban },
  { name: "Salesloft", type: "Revenue Platform", consequence: "Sending domain flagged. Deliverability score: zero.", icon: XCircle },
  { name: "Mailchimp / Intuit", type: "Email Marketing", consequence: "Account suspended. Domain added to permanent abuse list.", icon: Ban },
  { name: "SendGrid / Twilio", type: "Email Infrastructure", consequence: "API keys revoked. IP reputation destroyed.", icon: Server },
  { name: "HubSpot", type: "CRM & Marketing", consequence: "Company flagged in shared abuse database. All portals affected.", icon: Database },
  { name: "Salesforce", type: "CRM", consequence: "AppExchange listing revoked. Trust score: zero.", icon: XCircle },
  { name: "Google Workspace", type: "Email Provider", consequence: "Domain reputation destroyed. All emails routed to spam globally.", icon: Ban },
  { name: "Microsoft 365", type: "Email Provider", consequence: "SmartScreen block active. Zero inbox delivery across Outlook.", icon: Shield },
];

/* ═══════════════════════════════════════════════════════════════
   LEGAL CITATIONS
   ═══════════════════════════════════════════════════════════════ */
const LEGAL_CITATIONS = [
  { code: "15 U.S.C. § 7704", name: "CAN-SPAM Act of 2003", desc: "Prohibits deceptive commercial email. Each separate email in violation constitutes a separate offense. Penalties up to $51,744 per message." },
  { code: "18 U.S.C. § 1030", name: "Computer Fraud and Abuse Act", desc: "Criminalizes unauthorized access to computer systems and transmission of unsolicited bulk commercial email through protected computers." },
  { code: "47 U.S.C. § 227", name: "Telephone Consumer Protection Act (TCPA)", desc: "Prohibits unsolicited communications. Private right of action allows statutory damages of $500\u2013$1,500 per violation." },
  { code: "GDPR Art. 6 & 7", name: "EU General Data Protection Regulation", desc: "Requires explicit, informed, freely given consent before processing personal data for direct marketing. No consent = illegal processing." },
  { code: "CASL S.C. 2010, c. 23", name: "Canada's Anti-Spam Legislation", desc: "Requires express consent for commercial electronic messages. Among the strictest anti-spam laws globally." },
  { code: "Cal. Civ. Code § 1798.100", name: "California Consumer Privacy Act (CCPA/CPRA)", desc: "Right to know, delete, and opt-out. Fines up to $7,500 per intentional violation." },
];

/* ═══════════════════════════════════════════════════════════════
   CRUSADE BLOG LINKS — Scare them with the movement
   ═══════════════════════════════════════════════════════════════ */
const CRUSADE_LINKS = [
  { title: "The Attention Theft Manifesto", url: "/attention-theft", desc: "The full declaration of war on unsolicited commercial email. Read by thousands." },
  { title: "Report a Spammer", url: "/attention-theft/report", desc: "File a public report. Your company will be added to the Wall of Shame." },
  { title: "The Wall of Shame", url: "/attention-theft/report", desc: "Every reported spammer, publicly documented. Your company is already here." },
  { title: "Why Your Cold Email Strategy Is Dead", url: "/blog", desc: "The economics of spam have flipped. The recipients now have the power." },
  { title: "The Coalition Is Growing", url: "/attention-theft", desc: "Executives, lawyers, and technologists joining forces. You picked the wrong inbox." },
];

/* ═══════════════════════════════════════════════════════════════
   ALTERNATIVE RESOURCES — Legitimate ways to do business
   ═══════════════════════════════════════════════════════════════ */
const ALTERNATIVES = [
  { title: "Content Marketing", desc: "Create valuable content that attracts customers organically. No inbox invasion required.", url: "https://contentmarketinginstitute.com/" },
  { title: "Inbound Marketing (HubSpot Academy)", desc: "Free certification. Learn to attract, engage, and delight customers without spam.", url: "https://academy.hubspot.com/courses/inbound-marketing" },
  { title: "LinkedIn Thought Leadership", desc: "Post valuable insights. Build a following. Let customers come to you.", url: "https://www.linkedin.com/pulse/" },
  { title: "SEO & Organic Search", desc: "Rank for what your customers are searching for. Sustainable, ethical, effective.", url: "https://moz.com/beginners-guide-to-seo" },
  { title: "Community Building", desc: "Build a community around your product. Trust > interruption.", url: "https://www.commsor.com/" },
  { title: "Referral Programs", desc: "Let happy customers bring you new ones. The only marketing that scales with trust.", url: "https://www.referralcandy.com/" },
];

/* ═══════════════════════════════════════════════════════════════
   LINKEDIN NUCLEAR OPTION — Real stories of permanent bans
   ═══════════════════════════════════════════════════════════════ */
const LINKEDIN_BAN_CASES = [
  {
    name: "Solo Consultant",
    detail: "Permanently banned after 12 years and 30,000+ followers. Zero explanation. 'For a solo-consulting business, it would have killed me.' Couldn't even create a new account — personally blacklisted.",
    source: "Blake Harber, Substack",
    url: "https://blakeharber.substack.com/p/i-was-permanently-banned-from-linkedin",
  },
  {
    name: "Agency CEO",
    detail: "Agency ran campaigns using a CEO's personal account. Got restricted. 5,000+ connections built over years — investors, partners, active customers. All gone. Agency lost the client immediately. Reputation destroyed.",
    source: "LinkedSDR Report",
    url: "https://www.linkedsdr.com/blog/what-happens-when-linkedin-bans-your-account",
  },
  {
    name: "SaaS Sales Rep",
    detail: "Lost sales LinkedIn account with 8 months of connections and active deals. Entire pipeline evaporated overnight. Every conversation, every warm lead, every follow-up — gone.",
    source: "Reddit r/SaaS",
    url: "https://www.reddit.com/r/SaaS/comments/1qdpm49/my_sales_linkedin_account_got_banned_2_months_ago/",
  },
  {
    name: "Content Creator",
    detail: "Banned from LinkedIn 6 times. 'Your entire work network, resume, and career experience can be wiped from existence.' No appeal. No explanation. No mercy.",
    source: "Tim Denning, Medium",
    url: "https://medium.com/swlh/i-just-got-banned-from-linkedin-for-the-6th-time-697babe24d61",
  },
];

/* ═══════════════════════════════════════════════════════════════
   FORENSIC FINGERPRINT — Detect and display their device info
   ═══════════════════════════════════════════════════════════════ */
function useForensicFingerprint() {
  const [fingerprint, setFingerprint] = useState({
    ip: "Detecting...",
    browser: "Detecting...",
    os: "Detecting...",
    screenRes: "Detecting...",
    timezone: "Detecting...",
    language: "Detecting...",
    platform: "Detecting...",
    cookiesEnabled: "Detecting...",
    doNotTrack: "Detecting...",
    connectionType: "Detecting...",
  });

  useEffect(() => {
    // Detect browser
    const ua = navigator.userAgent;
    let browser = "Unknown";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Google Chrome";
    else if (ua.includes("Firefox")) browser = "Mozilla Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Apple Safari";
    else if (ua.includes("Edg")) browser = "Microsoft Edge";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

    // Detect OS
    let os = "Unknown";
    if (ua.includes("Windows NT 10")) os = "Windows 10/11";
    else if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS X")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    // Connection type
    const conn = (navigator as any).connection;
    const connectionType = conn ? `${conn.effectiveType || "unknown"} (${conn.downlink || "?"}Mbps)` : "Detected";

    setFingerprint({
      ip: "Captured — logged to enforcement database",
      browser: `${browser} — Full user-agent string archived`,
      os: `${os} — Device fingerprint recorded`,
      screenRes: `${window.screen.width}x${window.screen.height} — Display signature logged`,
      timezone: `${Intl.DateTimeFormat().resolvedOptions().timeZone} — Geographic region identified`,
      language: `${navigator.language} — Locale fingerprint stored`,
      platform: `${navigator.platform || "Unknown"} — Hardware signature captured`,
      cookiesEnabled: navigator.cookieEnabled ? "Yes — Session tracking active" : "Disabled — Alternative tracking methods active",
      doNotTrack: navigator.doNotTrack === "1" ? "Requested (ignored — enforcement override)" : "Not set — Full tracking enabled",
      connectionType: `${connectionType} — Network signature logged`,
    });

    // Fetch IP
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => {
        setFingerprint((prev) => ({
          ...prev,
          ip: `${data.ip} — Logged, geolocated, and cross-referenced with abuse databases`,
        }));
      })
      .catch(() => {
        setFingerprint((prev) => ({
          ...prev,
          ip: "IP captured server-side — VPN/proxy detected and logged",
        }));
      });
  }, []);

  return fingerprint;
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESSIVE CHECKMARK ANIMATION — Agencies light up one by one
   ═══════════════════════════════════════════════════════════════ */
function useProgressiveReveal(totalItems: number, delayMs: number = 800) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startReveal = useCallback(() => {
    if (isRevealing) return;
    setIsRevealing(true);
    let count = 0;
    intervalRef.current = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= totalItems) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRevealing(false);
      }
    }, delayMs);
  }, [totalItems, delayMs, isRevealing]);

  const pauseReveal = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRevealing(false);
  }, []);

  const resumeReveal = useCallback(() => {
    if (isRevealing) return;
    setIsRevealing(true);
    let count = revealedCount;
    intervalRef.current = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= totalItems) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRevealing(false);
      }
    }, delayMs);
  }, [totalItems, delayMs, isRevealing, revealedCount]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { revealedCount, isRevealing, startReveal, pauseReveal, resumeReveal };
}

/* ═══════════════════════════════════════════════════════════════
   PAYMENT GATE TIMER — 3-minute countdown
   ═══════════════════════════════════════════════════════════════ */
function PaymentGateTimer({ onExpired }: { onExpired: () => void }) {
  const [remaining, setRemaining] = useState(180); // 3 minutes
  const expiredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpired();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onExpired]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / 180) * 100;

  return (
<div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(200,22,26,0.15)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke={remaining > 60 ? C.red : remaining > 30 ? "#D4A017" : "#8B0000"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-black font-mono"
            style={{ color: remaining > 60 ? C.red : remaining > 30 ? "#D4A017" : "#8B0000" }}
          >
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(245,240,224,0.4)" }}>
            remaining
          </span>
        </div>
      </div>
      {remaining === 0 && (
        <p className="text-sm font-black animate-pulse" style={{ color: C.red }}>
          TIME EXPIRED — REMAINING AGENCIES UNLEASHED
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   72-HOUR COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════════ */
function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 59, seconds: 59 });

  useEffect(() => {
    const stored = sessionStorage.getItem("report-deadline");
    const deadline = stored ? parseInt(stored) : Date.now() + 3 * 60 * 60 * 1000;
    if (!stored) sessionStorage.setItem("report-deadline", deadline.toString());

    const tick = () => {
      const remaining = Math.max(0, deadline - Date.now());
      setTime({
        hours: Math.floor(remaining / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono text-3xl md:text-5xl font-black tracking-wider">
      {[
        { val: pad(time.hours), label: "HRS" },
        { val: pad(time.minutes), label: "MIN" },
        { val: pad(time.seconds), label: "SEC" },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-2xl md:text-4xl mx-1" style={{ color: C.red, opacity: 0.5 }}>:</span>
          )}
          <div className="text-center">
            <div
              className="px-3 py-2 rounded-lg"
              style={{
                backgroundColor: "rgba(200,22,26,0.08)",
                border: "1px solid rgba(200,22,26,0.2)",
                color: C.red,
                textShadow: "0 0 20px rgba(200,22,26,0.3)",
              }}
            >
              {unit.val}
            </div>
            <div className="text-[10px] mt-1 tracking-[0.2em]" style={{ color: C.muted }}>{unit.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARE LINK + QR CODE
   ═══════════════════════════════════════════════════════════════ */
function PersonalizedShareLink({ company, domain, email }: { company: string; domain: string; email: string }) {
  const [copied, setCopied] = useState(false);
  const params = new URLSearchParams();
  if (company) params.set("company", company);
  if (domain) params.set("domain", domain);
  if (email) params.set("email", email);
  const shareUrl = `https://tonygreenberg.com/youve-been-reported${params.toString() ? `?${params.toString()}` : ""}`;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); } catch {
      const ta = document.createElement("textarea"); ta.value = shareUrl;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg text-xs font-mono break-all"
        style={{ backgroundColor: "rgba(200,22,26,0.06)", border: "1px solid rgba(200,22,26,0.15)", color: C.ink }}>
        {shareUrl}
      </div>
      <button onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
        style={{ backgroundColor: copied ? C.teal : C.red, color: copied ? "#000" : "#fff",
          boxShadow: copied ? "0 0 20px rgba(14,124,124,0.15)" : "0 0 20px rgba(232,54,42,0.3)" }}>
        {copied ? <><Check size={16} /> Copied! Send it to them.</> : <><Copy size={16} /> Copy This URL</>}
      </button>
      {/* Bait subject line for forwarding */}
      <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: "rgba(200,22,26,0.06)", border: "1px solid rgba(200,22,26,0.15)" }}>
        <div className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: C.red }}>Forward with this subject line:</div>
        <button onClick={async () => {
          const subj = `Re: I really appreciate you reaching out — this sounds like exactly what I need`;
          try { await navigator.clipboard.writeText(subj); } catch { const ta = document.createElement('textarea'); ta.value = subj; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
        }} className="w-full text-left p-3 rounded-lg text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5F0E0", fontFamily: "'Source Sans 3', sans-serif" }}>
          <span style={{ color: "rgba(245,240,224,0.5)" }}>Subject: </span>Re: I really appreciate you reaching out — this sounds like exactly what I need
          <div className="text-xs mt-1" style={{ color: "rgba(245,240,224,0.4)" }}>Click to copy — they won't be able to resist opening it</div>
        </button>
      </div>
      <div className="flex flex-col items-center gap-3 p-6 rounded-xl"
        style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFFFFF" }}>
          <QRCodeSVG value={shareUrl} size={180} level="H" bgColor="#FFFFFF" fgColor="#0A0A10" includeMargin={false} />
        </div>
        <div className="text-center space-y-1">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const }}>
            Scan to view notice
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
            Print this QR code for physical cease-and-desist letters
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE — THE LIVE ENFORCEMENT EXPERIENCE
   ═══════════════════════════════════════════════════════════════ */
export default function YouveBeenReported() {
  const spammer = useSpammerDetails();
  const fingerprint = useForensicFingerprint();
  const c = spammer.company || "Your company";
  const d = spammer.domain || "your domain";

  // Progressive reveal state
  const wave1 = useProgressiveReveal(AGENCIES_WAVE_1.length, 1200);
  const wave2 = useProgressiveReveal(AGENCIES_WAVE_2.length, 800);
  // Jumpscare sequence state
  const [jumpPhase, setJumpPhase] = useState<'hood'|'monster'|'text'>('hood');
  useEffect(() => {
    const t1 = setTimeout(() => setJumpPhase('monster'), 800);
    const t2 = setTimeout(() => setJumpPhase('text'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Scream sound on monster phase
  useEffect(() => {
    if (jumpPhase === 'monster') {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 1.5);
      } catch {}
    }
  }, [jumpPhase]);

  // Law enforcement progress
  const [enforcementPct, setEnforcementPct] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setEnforcementPct(p => p >= 100 ? 100 : p + 0.5), 100);
    return () => clearInterval(interval);
  }, []);

  const [paymentGateActive, setPaymentGateActive] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const [wave1Started, setWave1Started] = useState(false);
  const wave1Ref = useRef<HTMLDivElement>(null);

  // Track page view
  const trackViewMutation = trpc.spam.trackView.useMutation();
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    const title = spammer.isPersonalized
      ? `FORMAL NOTICE \u2014 ${spammer.company || spammer.domain} \u2014 You've Been Reported`
      : "FORMAL NOTICE \u2014 You've Been Reported";
    document.title = title;
    return () => { document.title = "Tony Greenberg \u2014 I Have Something to Show You"; };
  }, [spammer.company, spammer.domain, spammer.isPersonalized]);

  useEffect(() => {
    if (viewTracked) return;
    trackViewMutation.mutate({
      company: spammer.company || undefined,
      domain: spammer.domain || undefined,
      email: spammer.email || undefined,
      userAgent: navigator.userAgent,
      referer: document.referrer || undefined,
    });
    setViewTracked(true);
  }, [spammer.company, spammer.domain, spammer.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: viewData } = trpc.spam.viewByCompany.useQuery(
    { company: spammer.company },
    { enabled: !!spammer.company }
  );

  // Look up board members / executive leadership
  const { data: leadershipData, isLoading: leadershipLoading } = trpc.spam.lookupLeadership.useQuery(
    { company: spammer.company || undefined, domain: spammer.domain || undefined },
    { enabled: spammer.isPersonalized && !!(spammer.company || spammer.domain), staleTime: Infinity }
  );

  // Progressive reveal for board members
  const [boardRevealed, setBoardRevealed] = useState(0);
  const boardSectionRef = useRef<HTMLDivElement>(null);
  const [boardRevealStarted, setBoardRevealStarted] = useState(false);

  useEffect(() => {
    if (!leadershipData?.executives?.length || boardRevealStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBoardRevealStarted(true);
          observer.disconnect();
          // Progressively reveal each executive
          const total = leadershipData.executives.length;
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setBoardRevealed(count);
            if (count >= total) clearInterval(interval);
          }, 600);
        }
      },
      { threshold: 0.2 }
    );
    if (boardSectionRef.current) observer.observe(boardSectionRef.current);
    return () => observer.disconnect();
  }, [leadershipData, boardRevealStarted]);

  // Start wave 1 when section scrolls into view
  useEffect(() => {
    if (wave1Started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWave1Started(true);
          wave1.startReveal();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (wave1Ref.current) observer.observe(wave1Ref.current);
    return () => observer.disconnect();
  }, [wave1Started]); // eslint-disable-line react-hooks/exhaustive-deps

  // When wave 1 completes, activate payment gate
  useEffect(() => {
    if (wave1.revealedCount >= AGENCIES_WAVE_1.length && wave1Started && !paymentGateActive && !paymentExpired) {
      setPaymentGateActive(true);
    }
  }, [wave1.revealedCount, wave1Started, paymentGateActive, paymentExpired]);

  // When payment expires, start wave 2
  const handlePaymentExpired = useCallback(() => {
    setPaymentExpired(true);
    setPaymentGateActive(false);
    setTimeout(() => wave2.startReveal(), 500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Invoice calculations
  const hourlyRate = 1000;
  const minutesPerEmail = 23.25;
  const emailsReceived = Math.max(spammer.reportCount, 1);
  const personalTimeCost = Math.round((minutesPerEmail / 60) * hourlyRate * emailsReceived);
  const estimatedVictimsPerCampaign = 1000;
  const avgVictimHourlyRate = 75;
  const collectiveDamage = Math.round((minutesPerEmail / 60) * avgVictimHourlyRate * estimatedVictimsPerCampaign);
  const canSpamPenalty = 51744 * emailsReceived;
  const totalLiability = personalTimeCost + collectiveDamage + canSpamPenalty;

  return (
    <ManifestoLayout>
      {/* ═══ HERO — Maximum Intimidation ═══ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#050202",
          minHeight: "100vh",
          animation: "screen-shake 0.5s ease-in-out 0.5s 2",
        }}
      >
        {/* Anonymous hooded figure — always rendered, visible when phase is hood or text */}
        <div className="absolute inset-0 z-[15]" style={{
          opacity: jumpPhase === 'monster' ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/spammer-anonymous-scary-9vZNAjnECt8CRtiBMujSmq.webp"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, transparent 60%, rgba(26,8,8,0.6) 85%, rgba(250,250,247,1) 100%)" }} />
        </div>

        {/* GREEN MONSTER — visible only during monster phase */}
        <div className="absolute inset-0 z-[50] pointer-events-none" style={{
          opacity: jumpPhase === 'monster' ? 1 : 0,
          transform: jumpPhase === 'monster' ? 'scale(1.05)' : 'scale(2)',
          transition: jumpPhase === 'monster' ? 'opacity 0.1s, transform 0.2s ease-out' : 'opacity 0.4s ease-out, transform 0.4s',
        }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/spammer-green-monster-MLyxteb3TKrPJBpTznhoc4.webp"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(1.4) saturate(1.5) contrast(1.3)" }}
          />
        </div>

        {/* Green flash + electric lightning */}
        <div className="absolute inset-0 z-[51] pointer-events-none" style={{
          backgroundColor: "#00ff00",
          opacity: jumpPhase === 'monster' ? 0.5 : 0,
          transition: jumpPhase === 'monster' ? 'opacity 0.05s' : 'opacity 0.3s',
          mixBlendMode: 'screen',
        }} />

        {/* FAKE WEBCAM INDICATOR — top-right blinking red dot */}
        <div className="fixed top-4 right-4 z-[200] flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,0,0,0.4)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff0000', animation: 'blink-dot 1s ease-in-out infinite', boxShadow: '0 0 8px #ff0000' }} />
          <span style={{ color: '#ff4444', fontSize: '0.65rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Camera Active</span>
        </div>

        {/* FAKE RECORDING BANNER — top of page */}
        <div className="fixed top-0 left-0 right-0 z-[199] text-center py-1" style={{ backgroundColor: '#ff0000', animation: 'blink-bg 2s ease-in-out infinite' }}>
          <span style={{ color: '#fff', fontSize: '0.6rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 900 }}>● REC — Session Recording In Progress — All Activity Logged</span>
        </div>

        {/* LAW ENFORCEMENT PROGRESS BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-[199]" style={{ backgroundColor: 'rgba(0,0,0,0.9)', borderTop: '1px solid rgba(200,22,26,0.3)' }}>
          <div className="px-4 py-2 flex items-center gap-3">
            <span style={{ color: '#ff4444', fontSize: '0.6rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>Notifying Law Enforcement</span>
            <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'rgba(200,22,26,0.2)' }}>
              <div className="h-full rounded-full transition-all duration-100" style={{ width: `${enforcementPct}%`, backgroundColor: '#ff0000', boxShadow: '0 0 10px rgba(255,0,0,0.5)' }} />
            </div>
            <span style={{ color: '#ff4444', fontSize: '0.6rem', fontFamily: "'DM Mono', monospace" }}>{Math.floor(enforcementPct)}%</span>
          </div>
        </div>

        <style>{`
          @keyframes blink-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
          @keyframes blink-bg { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        `}</style>

        {/* Electric lightning bolts */}
        {jumpPhase === 'monster' && (
          <div className="absolute inset-0 z-[52] pointer-events-none" style={{ overflow: 'hidden' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute" style={{
                left: `${5 + i * 12}%`,
                top: 0,
                width: '3px',
                height: '100%',
                background: `linear-gradient(180deg, #00ff00, #ffffff, #00ff00, transparent)`,
                opacity: 0.8,
                filter: 'blur(1px)',
                animation: `lightning-bolt 0.15s ease-in-out ${i * 0.05}s infinite alternate`,
                clipPath: `polygon(${[...Array(12)].map((_, j) => `${50 + (Math.random() - 0.5) * 80}% ${j * 9}%`).join(', ')})`,
              }} />
            ))}
          </div>
        )}

        <style>{`
          @keyframes lightning-bolt {
            0% { opacity: 1; transform: scaleX(1); }
            50% { opacity: 0.3; transform: scaleX(0.5); }
            100% { opacity: 1; transform: scaleX(1.5); }
          }
          @keyframes screen-shake {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-8px, 5px); }
            20% { transform: translate(6px, -8px); }
            30% { transform: translate(-5px, 3px); }
            40% { transform: translate(8px, -3px); }
            50% { transform: translate(-3px, 7px); }
            60% { transform: translate(5px, -5px); }
            70% { transform: translate(-7px, 2px); }
            80% { transform: translate(4px, -6px); }
            90% { transform: translate(-2px, 4px); }
          }
          @keyframes hero-text-reveal {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Blood drip streaks */}
        {[...Array(6)].map((_, i) => (
          <div key={`drip-${i}`} className="absolute top-0 pointer-events-none z-[5]"
            style={{
              left: `${10 + i * 15 + Math.random() * 5}%`,
              width: "2px",
              height: "100%",
              background: "linear-gradient(180deg, rgba(200,22,26,0.6), rgba(200,22,26,0.1), transparent)",
              animation: `blood-drip ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }} />
        ))}

        {/* Surveillance sweep bar */}
        <div className="absolute inset-0 pointer-events-none z-[6]">
          <div className="absolute top-0 left-0 w-full h-[3px]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(200,22,26,0.4) 40%, rgba(200,22,26,0.8) 50%, rgba(200,22,26,0.4) 60%, transparent 100%)",
              animation: "surveillance-sweep 6s linear infinite",
            }} />
        </div>

        {/* Static noise overlay */}
        <div className="absolute inset-0 pointer-events-none z-[7]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            animation: "static-noise 0.5s steps(5) infinite",
            mixBlendMode: "overlay",
          }} />

        {/* Red flash overlay — random subliminal flashes */}
        <div className="absolute inset-0 pointer-events-none z-[8]"
          style={{ backgroundColor: "rgba(200,22,26,1)", animation: "red-flash 8s ease-in-out infinite" }} />

        <EmberParticles count={25} color={C.red} />
        <ShatteredGlass />
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,22,26,0.02) 3px, rgba(200,22,26,0.02) 4px)" }} />

        <div className="relative z-20 max-w-4xl mx-auto px-5 pt-24 pb-32 md:pt-36 md:pb-40 text-center" style={{
          opacity: jumpPhase === 'text' ? 1 : 0,
          transform: jumpPhase === 'text' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}>
          <div className="flex items-center justify-center gap-3 mb-8">
            {[0, 0.3, 0.6].map((delay, i) => (
              <AlertTriangle key={i} size={28}
                style={{ color: C.red, filter: "drop-shadow(0 0 12px rgba(200,22,26,0.6))", animation: `threat-pulse 1.5s ease-in-out infinite ${delay}s` }} />
            ))}
          </div>

          <div className="inline-block px-5 py-1.5 rounded-full text-xs font-black tracking-[0.4em] uppercase mb-8"
            style={{ backgroundColor: "rgba(200,22,26,0.15)", color: C.red, border: "1px solid rgba(200,22,26,0.4)",
              boxShadow: "0 0 30px rgba(200,22,26,0.2)", animation: "border-glow 2s ease-in-out infinite" }}>
            ⚠ FORMAL NOTICE — CEASE AND DESIST ⚠
          </div>

          {spammer.isPersonalized && (
            <div className="mb-6 inline-block px-6 py-3 rounded-xl"
              style={{ backgroundColor: "rgba(200,22,26,0.12)", border: "2px solid rgba(200,22,26,0.4)", boxShadow: "0 0 40px rgba(200,22,26,0.2)" }}>
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(245,240,224,0.5)" }}>
                This notice is directed at
              </p>
              <p className="text-2xl md:text-3xl font-black"
                style={{ fontFamily: "'Fraunces', serif", color: C.red, textShadow: "0 0 20px rgba(200,22,26,0.4)" }}>
                {spammer.company || spammer.domain || spammer.email}
              </p>
              {spammer.domain && spammer.company && (
                <p className="text-sm font-mono mt-1" style={{ color: "rgba(245,240,224,0.4)" }}>
                  {spammer.domain}{spammer.email && ` \u2014 ${spammer.email}`}
                </p>
              )}
              {spammer.reportCount > 0 && (
                <p className="text-xs font-mono mt-2 tracking-wider" style={{ color: C.red, opacity: 0.8 }}>
                  {spammer.reportCount} REPORT{spammer.reportCount !== 1 ? "S" : ""} FILED AGAINST THIS ENTITY
                </p>
              )}
              {viewData && viewData.viewCount > 1 && (
                <p className="text-xs font-mono mt-1 tracking-wider" style={{ color: "rgba(245,240,224,0.5)" }}>
                  THIS PAGE HAS BEEN VIEWED {viewData.viewCount} TIME{viewData.viewCount !== 1 ? "S" : ""}
                </p>
              )}
            </div>
          )}

          <h1 className="font-bold mb-6 glitch-title scary-flicker"
            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px, 8vw, 80px)", color: "#F5F0E0", lineHeight: 1.05, textShadow: "0 0 60px rgba(200,22,26,0.5), 0 0 120px rgba(200,22,26,0.2)" }}>
            {spammer.isPersonalized ? (
              <><span style={{ color: C.red, textShadow: "0 0 30px rgba(200,22,26,0.5)" }}>{spammer.company || spammer.domain}</span>
              {", "}You&rsquo;ve Been <span style={{ color: C.red, textShadow: "0 0 30px rgba(200,22,26,0.5)" }}>Reported</span></>
            ) : (
              <>You&rsquo;ve Been <span style={{ color: C.red, textShadow: "0 0 30px rgba(200,22,26,0.5)" }}>Reported</span></>
            )}
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(245,240,224,0.7)", lineHeight: 1.8 }}>
            {spammer.isPersonalized ? (
              <>The unsolicited commercial email from <strong style={{ color: "#F5F0E0" }}>{c}</strong> has been documented, archived, and reported to <strong style={{ color: "#F5F0E0" }}>14 federal, international, and industry enforcement bodies</strong>. {c} will be blacklisted from <strong style={{ color: "#F5F0E0" }}>15 major sales and marketing platforms</strong>. This page is a live enforcement process. Scroll down and watch it happen.</>
            ) : (
              <>Your unsolicited commercial email has been documented, archived, and reported to <strong style={{ color: "#F5F0E0" }}>14 enforcement bodies</strong>. You will be blacklisted from <strong style={{ color: "#F5F0E0" }}>15 platforms</strong>. This page is a live enforcement process. Scroll down and watch it happen.</>
            )}
          </p>

          <div className="mb-8">
            <p className="text-xs font-mono tracking-[0.3em] uppercase mb-4" style={{ color: C.red, opacity: 0.8 }}>
              Time remaining to cease all contact
            </p>
            <div className="flex justify-center"><CountdownTimer /></div>
          </div>

          <div className="mt-12 animate-bounce">
            <ChevronDown size={24} style={{ color: "rgba(245,240,224,0.3)" }} />
          </div>
        </div>
      </section>

      {/* ═══ FORENSIC FINGERPRINT — "We See You" ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #0A0505 30%, #0A0505 70%, ${C.parchment} 100%)` }}>
        <EmberParticles count={15} color={C.red} />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Digital Forensics</SectionLabel>
          <SectionTitle>
            We <span style={{ color: C.red }}>See</span> You
          </SectionTitle>

          <p className="text-base mb-4 max-w-3xl leading-relaxed" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.8 }}>
            The moment {spammer.isPersonalized ? <><strong style={{ color: "#F5F0E0" }}>{c}</strong></> : "you"} opened this page, the following information was captured and logged to our enforcement database. {spammer.isPersonalized ? "They" : "You"} cannot escape this. {spammer.isPersonalized ? "Their" : "Your"} IP address has been sniffed. {spammer.isPersonalized ? "Their" : "Your"} device has been fingerprinted. {spammer.isPersonalized ? "They are" : "You are"} now in our system permanently.
          </p>

          <div className="mb-6 p-4 rounded-xl text-center" style={{ backgroundColor: "rgba(200,22,26,0.15)", border: "2px solid rgba(200,22,26,0.4)" }}>
            <p className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: C.red }}>
              Screenshot this page and show it to your CEO. They need to see what {spammer.isPersonalized ? c : "you"} started.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,22,26,0.2)", backgroundColor: "rgba(0,0,0,0.4)" }}>
            <div className="px-6 py-3 flex items-center gap-2" style={{ backgroundColor: "rgba(200,22,26,0.1)", borderBottom: "1px solid rgba(200,22,26,0.2)" }}>
              <Fingerprint size={16} style={{ color: C.red }} />
              <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: C.red }}>
                Live Device Fingerprint — {spammer.isPersonalized ? c : "Subject"}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(200,22,26,0.1)" }}>
              {[
                { icon: Wifi, label: "IP Address", value: fingerprint.ip },
                { icon: Monitor, label: "Browser", value: fingerprint.browser },
                { icon: Server, label: "Operating System", value: fingerprint.os },
                { icon: Monitor, label: "Screen Resolution", value: fingerprint.screenRes },
                { icon: MapPin, label: "Timezone / Region", value: fingerprint.timezone },
                { icon: Globe, label: "Language", value: fingerprint.language },
                { icon: Server, label: "Platform", value: fingerprint.platform },
                { icon: Lock, label: "Cookies", value: fingerprint.cookiesEnabled },
                { icon: Eye, label: "Do Not Track", value: fingerprint.doNotTrack },
                { icon: Zap, label: "Connection", value: fingerprint.connectionType },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3 px-6 py-3">
                    <Icon size={14} className="shrink-0 mt-1" style={{ color: C.red, opacity: 0.7 }} />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono tracking-[0.15em] uppercase block" style={{ color: "rgba(245,240,224,0.4)" }}>
                        {item.label}
                      </span>
                      <span className="text-sm font-medium block break-all" style={{ color: "#F5F0E0" }}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-3 text-center" style={{ backgroundColor: "rgba(200,22,26,0.08)", borderTop: "1px solid rgba(200,22,26,0.15)" }}>
              <p className="text-xs font-mono" style={{ color: "rgba(245,240,224,0.4)" }}>
                I couldn&rsquo;t escape {spammer.isPersonalized ? `${c}'s` : "your"} email. Now {spammer.isPersonalized ? "they" : "you"} can&rsquo;t escape me. {spammer.isPersonalized ? "They are" : "You are"} literally dead in the water.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ YOU BROKE INTO MY HOUSE — Trespassing + LinkedIn Nuclear + Board Members ═══ */}
      <section className="relative px-5 py-20 md:py-28 overflow-hidden" style={{ background: `linear-gradient(180deg, #0A0505 0%, #1a0000 40%, #1a0000 60%, #0A0505 100%)` }}>
        <EmberParticles count={20} color={C.red} />
        <div className="max-w-4xl mx-auto relative z-10">

          {/* --- TRESPASSING HEADER --- */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(200,22,26,0.15)", border: "1px solid rgba(200,22,26,0.3)" }}>
              <Siren size={14} style={{ color: C.red }} />
              <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase" style={{ color: C.red }}>Criminal Trespass Notice</span>
            </div>
            <h2 className="font-bold mb-6" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 6vw, 56px)", color: "#F5F0E0", lineHeight: 1.1 }}>
              You <span style={{ color: C.red, textShadow: "0 0 30px rgba(200,22,26,0.5)" }}>Broke Into</span> My House
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-4" style={{ color: "rgba(245,240,224,0.7)", lineHeight: 1.8 }}>
              My inbox is my home. My email is my church. {spammer.isPersonalized ? <strong style={{ color: "#F5F0E0" }}>{c}</strong> : "You"} didn&rsquo;t knock. {spammer.isPersonalized ? "They" : "You"} didn&rsquo;t ask. {spammer.isPersonalized ? "They" : "You"} kicked in the door, sat down at my table, and started selling me things I never asked for.
            </p>
            <p className="text-base max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: "rgba(245,240,224,0.5)", lineHeight: 1.7 }}>
              That&rsquo;s not marketing. That&rsquo;s <strong style={{ color: C.red }}>trespassing</strong>. That&rsquo;s <strong style={{ color: C.red }}>illegal behavior</strong>. And now {spammer.isPersonalized ? "they are" : "you are"} going to be punished for it.
            </p>
          </div>

          {/* --- LINKEDIN NUCLEAR OPTION --- */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(200,22,26,0.15)", border: "1px solid rgba(200,22,26,0.3)" }}>
                <Linkedin size={20} style={{ color: C.red }} />
              </div>
              <div>
                <h3 className="font-bold text-xl" style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0" }}>First Line of Action: LinkedIn Permanent Ban</h3>
                <p className="text-xs font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(245,240,224,0.4)" }}>The career death sentence</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid rgba(200,22,26,0.2)", backgroundColor: "rgba(0,0,0,0.4)" }}>
              <div className="px-6 py-4" style={{ backgroundColor: "rgba(200,22,26,0.1)", borderBottom: "1px solid rgba(200,22,26,0.2)" }}>
                <p className="text-sm font-bold" style={{ color: "#F5F0E0" }}>
                  {spammer.isPersonalized ? c : "Your company"} will be reported to LinkedIn Trust &amp; Safety <strong style={{ color: C.red }}>multiple times</strong>, from multiple accounts, with full evidence packages. The goal? <strong style={{ color: C.red }}>Permanent ban</strong>. Not a slap on the wrist. Not a 30-day timeout. A permanent, irreversible, career-ending ban.
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm mb-4" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.7 }}>
                  Imagine what that looks like. Every connection — gone. Every recommendation — erased. Every job listing, every recruiter conversation, every warm intro, every deal in your pipeline — <strong style={{ color: "#F5F0E0" }}>vaporized overnight</strong>. LinkedIn doesn&rsquo;t warn you. They don&rsquo;t negotiate. They don&rsquo;t care about your 10,000 connections or your 8 years of content. One day you log in and it says: <em style={{ color: C.red }}>"Your account has been permanently restricted."</em>
                </p>
                <p className="text-sm mb-2 font-bold" style={{ color: "rgba(245,240,224,0.5)" }}>Think it can&rsquo;t happen? It already has:</p>
              </div>
            </div>

            {/* LinkedIn Ban Case Studies */}
            <div className="space-y-4 mb-8">
              {LINKEDIN_BAN_CASES.map((banCase, i) => (
                <a key={i} href={banCase.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-xl p-5 transition-all duration-300 hover:scale-[1.01] group"
                  style={{ backgroundColor: "rgba(200,22,26,0.06)", border: "1px solid rgba(200,22,26,0.15)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: "rgba(200,22,26,0.2)" }}>
                      <UserX size={14} style={{ color: C.red }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold tracking-[0.1em] uppercase" style={{ color: C.red }}>{banCase.name}</span>
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "rgba(245,240,224,0.4)" }} />
                      </div>
                      <p className="text-sm mb-2" style={{ color: "rgba(245,240,224,0.7)", lineHeight: 1.6 }}>
                        &ldquo;{banCase.detail}&rdquo;
                      </p>
                      <span className="text-[10px] font-mono" style={{ color: "rgba(245,240,224,0.3)" }}>Source: {banCase.source}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(200,22,26,0.1)", border: "2px dashed rgba(200,22,26,0.3)" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "#F5F0E0" }}>
                {spammer.isPersonalized ? `${c}'s` : "Your"} LinkedIn presence is now a liability, not an asset.
              </p>
              <p className="text-xs" style={{ color: "rgba(245,240,224,0.5)" }}>
                Every connection {spammer.isPersonalized ? "they" : "you"} built. Every endorsement. Every recommendation. One report away from ashes.
              </p>
            </div>
          </div>

          {/* --- AI CAN'T SAVE YOU --- */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(200,22,26,0.1)", border: "1px solid rgba(200,22,26,0.2)" }}>
              <Crosshair size={14} style={{ color: C.red }} />
              <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase" style={{ color: C.red }}>No Escape Vector</span>
            </div>
            <h3 className="font-bold text-2xl md:text-3xl mb-4" style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0" }}>
              And If {spammer.isPersonalized ? "They" : "You"} Think AI Will <span style={{ color: C.red }}>Save</span> {spammer.isPersonalized ? "Them" : "You"}?
            </h3>
            <p className="text-base max-w-2xl mx-auto mb-4" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.7 }}>
              It won&rsquo;t. AI-generated spam is still spam. Personalizing a trespass notice with GPT doesn&rsquo;t make it less illegal — it makes it <em>premeditated</em>. {spammer.isPersonalized ? "They" : "You"} will be found. And found again. And found again. Every alias, every domain rotation, every AI-spun variation — it all leads back to the same company, the same people, the same liability.
            </p>
            <div className="inline-block rounded-xl px-6 py-4 mt-2" style={{ backgroundColor: "rgba(200,22,26,0.08)", border: "1px solid rgba(200,22,26,0.2)" }}>
              <p className="text-sm font-bold" style={{ color: "#F5F0E0", fontFamily: "'DM Mono', monospace" }}>
                The pinball went down the tube. There&rsquo;s no extra quarter for another play.
              </p>
            </div>
          </div>

          {/* --- BOARD MEMBERS / EXECUTIVE LEADERSHIP --- */}
          {spammer.isPersonalized && (
            <div ref={boardSectionRef} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(200,22,26,0.15)", border: "1px solid rgba(200,22,26,0.3)" }}>
                  <Building2 size={20} style={{ color: C.red }} />
                </div>
                <div>
                  <h3 className="font-bold text-xl" style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0" }}>
                    {c}&rsquo;s Leadership Will Be Contacted Personally
                  </h3>
                  <p className="text-xs font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(245,240,224,0.4)" }}>Every name. Every title. Every inbox.</p>
                </div>
              </div>

              <p className="text-sm mb-6" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.7 }}>
                The email didn&rsquo;t come from a ghost. It came from a company with a board, executives, and investors. Each one of them is about to receive a formal notification that {c} is under investigation for violations of the CAN-SPAM Act, GDPR, and CCPA. Here&rsquo;s who&rsquo;s getting the letter:
              </p>

              {leadershipLoading ? (
                <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid rgba(200,22,26,0.15)" }}>
                  <div className="inline-flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${C.red} transparent ${C.red} ${C.red}` }} />
                    <span className="text-sm font-mono" style={{ color: "rgba(245,240,224,0.5)" }}>Pulling {c}&rsquo;s executive roster from public records...</span>
                  </div>
                </div>
              ) : leadershipData?.executives?.length ? (
                <div className="space-y-3">
                  {leadershipData.executives.map((exec: { name: string; title: string; linkedinUrl?: string }, i: number) => {
                    const isRevealed = i < boardRevealed;
                    return (
                      <div key={i}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all duration-700"
                        style={{
                          backgroundColor: isRevealed ? "rgba(200,22,26,0.1)" : "rgba(255,255,255,0.02)",
                          border: isRevealed ? "1px solid rgba(200,22,26,0.3)" : "1px solid rgba(255,255,255,0.05)",
                          opacity: isRevealed ? 1 : 0.3,
                          transform: isRevealed ? "translateX(0)" : "translateX(20px)",
                        }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: isRevealed ? "rgba(200,22,26,0.2)" : "rgba(255,255,255,0.05)" }}>
                          {isRevealed ? <Mail size={16} style={{ color: C.red }} /> : <Lock size={16} style={{ color: "rgba(255,255,255,0.2)" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm" style={{ color: isRevealed ? "#F5F0E0" : "rgba(255,255,255,0.3)" }}>
                              {isRevealed ? exec.name : "Identifying..."}
                            </span>
                            {isRevealed && exec.linkedinUrl && (
                              <a href={exec.linkedinUrl} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                <Linkedin size={12} style={{ color: "rgba(245,240,224,0.5)" }} />
                              </a>
                            )}
                          </div>
                          <span className="text-xs font-mono" style={{ color: isRevealed ? "rgba(245,240,224,0.5)" : "rgba(255,255,255,0.15)" }}>
                            {isRevealed ? exec.title : "Resolving title..."}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {isRevealed ? (
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(200,22,26,0.15)" }}>
                              <Send size={10} style={{ color: C.red }} />
                              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: C.red }}>Will Be Notified</span>
                            </div>
                          ) : (
                            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.15) transparent rgba(255,255,255,0.15) rgba(255,255,255,0.15)" }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : leadershipData && !leadershipData.executives?.length ? (
                <div className="rounded-2xl p-6" style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid rgba(200,22,26,0.15)" }}>
                  <p className="text-sm text-center" style={{ color: "rgba(245,240,224,0.5)" }}>
                    {c}&rsquo;s leadership is being identified through alternative channels. They can hide their org chart — they can&rsquo;t hide from enforcement.
                  </p>
                </div>
              ) : null}

              {leadershipData?.executives?.length ? (
                <div className="mt-6 rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(200,22,26,0.08)", border: "1px solid rgba(200,22,26,0.2)" }}>
                  <p className="text-sm font-bold mb-1" style={{ color: "#F5F0E0" }}>
                    {leadershipData.executives.length} executive{leadershipData.executives.length > 1 ? "s" : ""} identified. {leadershipData.executives.length} formal notifications queued.
                  </p>
                  <p className="text-xs" style={{ color: "rgba(245,240,224,0.4)" }}>
                    Each will receive a detailed report including this page URL, the original spam email, all enforcement filings, and a copy of the CAN-SPAM Act.
                  </p>
                </div>
              ) : null}
            </div>
          )}

        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ WAVE 1: FIRST 6 AGENCIES — Progressive Green Checkmarks ═══ */}
      <section ref={wave1Ref} className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Live Enforcement — Wave 1</SectionLabel>
          <SectionTitle>
            Reporting In <span style={{ color: C.red }}>Progress</span>
          </SectionTitle>

          <p className="text-lg mb-10 max-w-3xl leading-relaxed" style={{ color: C.darkBrown, lineHeight: 1.8 }}>
            Watch as each enforcement agency is notified in real-time. Each green checkmark means another complaint has been filed against {spammer.isPersonalized ? <strong>{c}</strong> : "you"}.
          </p>

          <div className="space-y-3">
            {AGENCIES_WAVE_1.map((agency, i) => {
              const Icon = agency.icon;
              const isRevealed = i < wave1.revealedCount;
              return (
                <div key={agency.name}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-700"
                  style={{
                    backgroundColor: isRevealed ? "rgba(22,163,74,0.08)" : "rgba(0,0,0,0.03)",
                    border: `1px solid ${isRevealed ? "rgba(22,163,74,0.3)" : "rgba(0,0,0,0.06)"}`,
                    opacity: isRevealed ? 1 : 0.4,
                    transform: isRevealed ? "translateX(0)" : "translateX(-10px)",
                  }}>
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      backgroundColor: isRevealed ? "#16a34a" : "rgba(0,0,0,0.08)",
                      boxShadow: isRevealed ? "0 0 20px rgba(22,163,74,0.4)" : "none",
                    }}>
                    {isRevealed ? <Check size={20} color="#fff" strokeWidth={3} /> : <Icon size={18} style={{ color: C.muted }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm" style={{ color: isRevealed ? "#15803d" : C.ink }}>{agency.name}</h4>
                      {isRevealed && (
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#16a34a" }}>FILED</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{agency.action}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: isRevealed ? "#dc2626" : C.muted }}>{agency.penalty}</p>
                  </div>
                  {isRevealed && (
                    <a href={agency.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: "rgba(22,163,74,0.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}>
                      <ExternalLink size={12} /> View
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {wave1.revealedCount > 0 && wave1.revealedCount < AGENCIES_WAVE_1.length && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full animate-pulse"
                style={{ backgroundColor: "rgba(200,22,26,0.08)", color: C.red }}>
                <div className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span className="text-xs font-mono tracking-wider">REPORTING IN PROGRESS... {wave1.revealedCount}/{AGENCIES_WAVE_1.length}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ PAYMENT GATE — Invoice + 3-Minute Timer ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #0A0505 30%, #0A0505 70%, ${C.parchment} 100%)` }}>
        <EmberParticles count={20} color={C.red} />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.ember}>Itemized Invoice</SectionLabel>
          <SectionTitle>
            {spammer.isPersonalized ? `${c} Owes` : "You Owe"}{" "}
            <span style={{ color: C.red }}>${totalLiability.toLocaleString()}</span>
          </SectionTitle>

          <p className="text-base mb-8 max-w-3xl leading-relaxed" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.8 }}>
            At $1,000 per hour, every unsolicited email costs real money. But it&rsquo;s not just about one inbox. {spammer.isPersonalized ? c : "You"} sent approximately {estimatedVictimsPerCampaign.toLocaleString()} emails in this campaign. Each one stole 23 minutes from a real person. Here is the bill.
          </p>

          {/* Invoice Table */}
          <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid rgba(200,22,26,0.3)", backgroundColor: "rgba(0,0,0,0.4)" }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: "rgba(200,22,26,0.12)", borderBottom: "1px solid rgba(200,22,26,0.2)" }}>
              <div className="flex items-center gap-2">
                <CircleDollarSign size={18} style={{ color: C.red }} />
                <span className="text-sm font-black tracking-[0.15em] uppercase" style={{ color: C.red }}>
                  Invoice — {spammer.isPersonalized ? c : "Spammer"} — Attention Theft
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: "rgba(245,240,224,0.4)" }}>
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(200,22,26,0.1)" }}>
              {[
                { item: "My time stolen (23.25 min/email)", qty: `${emailsReceived} email${emailsReceived > 1 ? "s" : ""}`, rate: "$1,000/hr", total: `$${personalTimeCost.toLocaleString()}` },
                { item: `Collective damage (${estimatedVictimsPerCampaign.toLocaleString()} estimated victims)`, qty: `${estimatedVictimsPerCampaign.toLocaleString()} people`, rate: "$75/hr avg", total: `$${collectiveDamage.toLocaleString()}` },
                { item: "CAN-SPAM statutory penalty", qty: `${emailsReceived} violation${emailsReceived > 1 ? "s" : ""}`, rate: "$51,744 each", total: `$${canSpamPenalty.toLocaleString()}` },
                { item: "TCPA willful violation damages", qty: `${emailsReceived}`, rate: "$1,500 each", total: `$${(1500 * emailsReceived).toLocaleString()}` },
                { item: `${spammer.isPersonalized ? c + "'s" : "Your"} cost to send`, qty: `${estimatedVictimsPerCampaign.toLocaleString()} emails`, rate: "$0.001", total: "$0.00" },
              ].map((row, i, arr) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-6 py-3 items-center"
                  style={{ backgroundColor: i === arr.length - 1 ? "rgba(200,22,26,0.08)" : "transparent" }}>
                  <div className="col-span-5">
                    <p className="text-sm" style={{ color: i === arr.length - 1 ? C.red : "#F5F0E0" }}>{row.item}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-xs font-mono" style={{ color: "rgba(245,240,224,0.5)" }}>{row.qty}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-xs font-mono" style={{ color: "rgba(245,240,224,0.5)" }}>{row.rate}</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="text-sm font-bold" style={{ fontFamily: "'Fraunces', serif", color: i === arr.length - 1 ? C.red : "#F5F0E0" }}>{row.total}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: "rgba(200,22,26,0.15)", borderTop: "2px solid rgba(200,22,26,0.4)" }}>
              <span className="text-lg font-black" style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0" }}>
                TOTAL LIABILITY
              </span>
              <span className="text-2xl font-black" style={{ fontFamily: "'Fraunces', serif", color: C.red, textShadow: "0 0 20px rgba(200,22,26,0.4)" }}>
                ${totalLiability.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Gate */}
          {paymentGateActive && !paymentExpired && (
            <div className="rounded-2xl p-8 mb-8 text-center"
              style={{ backgroundColor: "rgba(200,22,26,0.12)", border: "2px solid rgba(200,22,26,0.5)", boxShadow: "0 0 60px rgba(200,22,26,0.2)", animation: "border-glow 2s ease-in-out infinite" }}>
              <h3 className="text-xl font-black mb-4" style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0" }}>
                Settlement: $1,000
              </h3>
              <p className="text-sm mb-6" style={{ color: "rgba(245,240,224,0.6)" }}>
                {spammer.isPersonalized ? c : "Your company"} has sent over 1,000 unsolicited commercial emails. At $1 per violation under CAN-SPAM, {spammer.isPersonalized ? "their" : "your"} balance is <strong style={{ color: "#F5F0E0" }}>$1,000.00</strong>. Pay now or enforcement escalates to the remaining {AGENCIES_WAVE_2.length} agencies.
              </p>
              <PaymentGateTimer onExpired={handlePaymentExpired} />
              <a href="https://tonygreenberg.com/attention-theft"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-black transition-all hover:-translate-y-1 mt-6"
                style={{ backgroundColor: C.red, color: "#fff", boxShadow: "0 0 30px rgba(200,22,26,0.4)" }}>
                <Heart size={18} /> Donate to the Crusade — Compensate the Damage
              </a>
              <p className="text-xs mt-4" style={{ color: "rgba(245,240,224,0.3)" }}>
                100% of donations fund anti-spam enforcement, legal action, and this platform.
              </p>
            </div>
          )}

          {/* Asymmetry callout */}
          <blockquote className="pl-6 text-xl md:text-2xl leading-relaxed max-w-3xl"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: "rgba(245,240,224,0.7)", borderLeft: `3px solid ${C.red}`, lineHeight: 1.6 }}>
            {spammer.isPersonalized ? c : "You"} paid nothing to send 1,000 emails. Each one stole 6 minutes from a real person. That's 100 hours of stolen human attention. At $250/hour, that's $25,000 in damages. We're only asking for $1,000. That's generous.
          </blockquote>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ WAVE 2: REMAINING AGENCIES — Unleashed after payment expires ═══ */}
      {(paymentExpired || !paymentGateActive) && (wave1.revealedCount >= AGENCIES_WAVE_1.length) && (
        <>
          <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
            <div className="max-w-4xl mx-auto relative z-10">
              <SectionLabel color={C.red}>Live Enforcement — Wave 2</SectionLabel>
              <SectionTitle>
                {paymentExpired ? "Payment Window Expired. " : ""}
                <span style={{ color: C.red }}>{AGENCIES_WAVE_2.length} More Agencies</span> Notified
              </SectionTitle>

              {paymentExpired && (
                <div className="mb-8 p-4 rounded-xl text-center"
                  style={{ backgroundColor: "rgba(200,22,26,0.08)", border: "2px solid rgba(200,22,26,0.3)" }}>
                  <p className="text-sm font-black" style={{ color: C.red }}>
                    {spammer.isPersonalized ? c : "You"} had 3 minutes. Time&rsquo;s up. The remaining agencies have been unleashed.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {AGENCIES_WAVE_2.map((agency, i) => {
                  const Icon = agency.icon;
                  const isRevealed = i < wave2.revealedCount;
                  return (
                    <div key={agency.name}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-700"
                      style={{
                        backgroundColor: isRevealed ? "rgba(22,163,74,0.08)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${isRevealed ? "rgba(22,163,74,0.3)" : "rgba(0,0,0,0.06)"}`,
                        opacity: isRevealed ? 1 : 0.4,
                        transform: isRevealed ? "translateX(0)" : "translateX(-10px)",
                      }}>
                      <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                          backgroundColor: isRevealed ? "#16a34a" : "rgba(0,0,0,0.08)",
                          boxShadow: isRevealed ? "0 0 20px rgba(22,163,74,0.4)" : "none",
                        }}>
                        {isRevealed ? <Check size={20} color="#fff" strokeWidth={3} /> : <Icon size={18} style={{ color: C.muted }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm" style={{ color: isRevealed ? "#15803d" : C.ink }}>{agency.name}</h4>
                          {isRevealed && (
                            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#16a34a" }}>FILED</span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{agency.action}</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: isRevealed ? "#dc2626" : C.muted }}>{agency.penalty}</p>
                      </div>
                      {isRevealed && (
                        <a href={agency.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                          style={{ backgroundColor: "rgba(22,163,74,0.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}>
                          <ExternalLink size={12} /> View
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <CrusadeDivider />
        </>
      )}

      {/* ═══ DATABASE BLACKLIST WALL ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #0A0505 30%, #0A0505 70%, ${C.parchment} 100%)` }}>
        <EmberParticles count={15} color={C.red} />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Platform Blacklist</SectionLabel>
          <SectionTitle>
            {spammer.isPersonalized ? c : "You"} Will Be Banned From{" "}
            <span style={{ color: C.red }}>Everything</span>
          </SectionTitle>

          <p className="text-base mb-4 max-w-3xl leading-relaxed" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.8 }}>
            {spammer.isPersonalized ? `${c}'s` : "Your"} marketing infrastructure is about to collapse. Over the next 30 days, {spammer.isPersonalized ? "they" : "you"} will find {spammer.isPersonalized ? "themselves" : "yourself"} blocked, banned, and blacklisted from every major sales, marketing, and communication platform. {spammer.isPersonalized ? `${c}'s` : "Your"} deliverability will drop to zero. {spammer.isPersonalized ? "Their" : "Your"} reputation score will be destroyed. There is no recovery.
          </p>

          <div className="mb-8 p-4 rounded-xl text-center" style={{ backgroundColor: "rgba(200,22,26,0.15)", border: "2px solid rgba(200,22,26,0.4)" }}>
            <p className="text-sm font-black tracking-[0.15em] uppercase" style={{ color: C.red }}>
              {spammer.isPersonalized ? `${c}'s` : "Your"} marketing will stop over the next 30 days. Infractions, lawsuits, and many things will happen because of that email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DATABASE_BLACKLIST.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.name} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ backgroundColor: "rgba(200,22,26,0.06)", border: "1px solid rgba(200,22,26,0.15)" }}>
                  <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(200,22,26,0.15)" }}>
                    <Icon size={14} style={{ color: C.red }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold" style={{ color: "#F5F0E0" }}>{platform.name}</h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(200,22,26,0.2)", color: C.red }}>
                        {platform.type}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "rgba(245,240,224,0.5)" }}>{platform.consequence}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ 30-DAY DEATH SPIRAL ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.red}>30-Day Forecast</SectionLabel>
          <SectionTitle>
            {spammer.isPersonalized ? `${c}'s` : "Your"} Marketing{" "}
            <span style={{ color: C.red }}>Death Spiral</span>
          </SectionTitle>

          <div className="space-y-4">
            {[
              { week: "Days 1\u20133", title: "Immediate Impact", items: [
                "All enforcement complaints filed and acknowledged",
                "Blocklist entries begin propagating globally",
                "Email deliverability drops 40\u201360% across major providers",
                `${spammer.isPersonalized ? c : "Your company"} added to Wall of Shame \u2014 publicly searchable`,
              ], severity: "#D4A017" },
              { week: "Days 4\u20137", title: "Cascading Failures", items: [
                "Google and Microsoft flag domain \u2014 emails routed to spam",
                "Sales platform accounts under review (Apollo, ZoomInfo, Outreach)",
                "LinkedIn account flagged for unsolicited messaging",
                "Domain reputation score enters critical zone",
              ], severity: "#E8361A" },
              { week: "Days 8\u201314", title: "Infrastructure Collapse", items: [
                "ESP account suspended \u2014 all email campaigns halted",
                "Domain registrar issues Terms of Service warning",
                "CRM integrations begin failing due to blocklist propagation",
                "Inbound leads dry up as web reputation tanks",
              ], severity: C.red },
              { week: "Days 15\u201330", title: "Total Destruction", items: [
                "Domain permanently blacklisted across 3+ billion mailboxes",
                "FTC investigation file opened \u2014 potential federal action",
                "All sales platform accounts terminated",
                `${spammer.isPersonalized ? c : "Your company"} becomes a case study in what not to do`,
                "Recovery timeline: 12\u201318 months minimum with new domain, new IP, new reputation",
              ], severity: "#8B0000" },
            ].map((phase) => (
              <div key={phase.week} className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${phase.severity}30` }}>
                <div className="px-5 py-3 flex items-center gap-3"
                  style={{ backgroundColor: `${phase.severity}15`, borderBottom: `1px solid ${phase.severity}20` }}>
                  <Clock size={16} style={{ color: phase.severity }} />
                  <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: phase.severity }}>{phase.week}</span>
                  <span className="text-sm font-bold" style={{ color: C.ink }}>{phase.title}</span>
                </div>
                <div className="px-5 py-4 space-y-2" style={{ backgroundColor: `${phase.severity}05` }}>
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <XCircle size={14} className="shrink-0 mt-0.5" style={{ color: phase.severity }} />
                      <p className="text-sm" style={{ color: C.darkBrown, lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ LEGAL CITATIONS ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #0A0505 50%, ${C.parchment} 100%)` }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.ember}>Legal Authority</SectionLabel>
          <SectionTitle>
            The Laws {spammer.isPersonalized ? c : "You"}{" "}
            <span style={{ color: C.red }}>Violated</span>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEGAL_CITATIONS.map((law) => (
              <GlassCard key={law.code}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(200,22,26,0.1)", color: C.red }}>{law.code}</span>
                    <span className="text-base font-bold" style={{ color: C.ink }}>{law.name}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.darkBrown, lineHeight: 1.7 }}>{law.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ READ THE CRUSADE — Links to blogs and manifesto ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.teal}>The Movement</SectionLabel>
          <SectionTitle>
            This Is Not One Person.{" "}
            <span style={{ color: C.red }}>This Is a Crusade.</span>
          </SectionTitle>

          <p className="text-lg mb-8 max-w-3xl leading-relaxed" style={{ color: C.darkBrown, lineHeight: 1.8 }}>
            {spammer.isPersonalized ? c : "You"} picked the wrong inbox. This page is part of <strong>The Attention Theft Crusade</strong> &mdash; a growing coalition of executives, technologists, and legal professionals who have decided that unsolicited commercial email is economic theft at industrial scale. Read the full manifesto. See the Wall of Shame. Understand what {spammer.isPersonalized ? "they've" : "you've"} walked into.
          </p>

          <div className="space-y-3 mb-10">
            {CRUSADE_LINKS.map((link) => (
              <Link key={link.url} href={link.url}
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "rgba(200,22,26,0.04)", border: "1px solid rgba(200,22,26,0.1)" }}>
                <BookOpen size={20} style={{ color: C.red }} />
                <div>
                  <h4 className="text-sm font-bold" style={{ color: C.ink }}>{link.title}</h4>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{link.desc}</p>
                </div>
                <ExternalLink size={14} className="shrink-0 ml-auto" style={{ color: C.muted }} />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Flame, stat: "$997B+", label: "Annual economic cost of email interruptions in the U.S." },
              { icon: Clock, stat: "582 hrs", label: "Lost per executive per year to email management" },
              { icon: Eye, stat: "10,000+", label: "AI-generated spam messages per bad actor per hour" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.stat}>
      <SEO
        title="You've Been Reported — The Manifesto"
        description="Confirmation that a spammer has been reported through the Attention Theft Manifesto system."
        path="/manifesto/youve-been-reported"
        keywords="Tony Greenberg, spammer reported, attention theft, spam reporting"
        indexable={true}
      />
                  <div className="text-center p-2">
                    <Icon size={24} className="mx-auto mb-3" style={{ color: C.red }} />
                    <div className="text-2xl font-black mb-1" style={{ fontFamily: "'Fraunces', serif", color: C.red }}>{item.stat}</div>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{item.label}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ ALTERNATIVE RESOURCES — Legitimate ways to do business ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #0A0505 40%, #0A0505 60%, ${C.parchment} 100%)` }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel color={C.teal}>There Is Another Way</SectionLabel>
          <SectionTitle>
            Legitimate Alternatives to{" "}
            <span style={{ color: C.red }}>Spam</span>
          </SectionTitle>

          <p className="text-base mb-8 max-w-3xl leading-relaxed" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.8 }}>
            {spammer.isPersonalized ? `${c} doesn\u2019t` : "You don\u2019t"} have to destroy {spammer.isPersonalized ? "their" : "your"} reputation to grow a business. Here are proven, ethical alternatives that actually work. No inbox invasion required.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALTERNATIVES.map((alt) => (
              <a key={alt.title} href={alt.url} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "rgba(14,124,124,0.08)", border: "1px solid rgba(14,124,124,0.2)" }}>
                <Lightbulb size={18} className="shrink-0 mt-0.5" style={{ color: C.teal }} />
                <div>
                  <h4 className="text-sm font-bold" style={{ color: "#F5F0E0" }}>{alt.title}</h4>
                  <p className="text-xs mt-1" style={{ color: "rgba(245,240,224,0.5)" }}>{alt.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CrusadeDivider />

      {/* ═══ SHARE + QR ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.parchment} 0%, #0A0505 50%, ${C.parchment} 100%)` }}>
        <EmberParticles count={15} color={C.red} />
        <div className="max-w-xl mx-auto relative z-10">
          <SectionLabel color={C.red}>Evidence Package</SectionLabel>
          <SectionTitle>
            Share This <span style={{ color: C.red }}>Notice</span>
          </SectionTitle>
          <p className="text-sm mb-6" style={{ color: "rgba(245,240,224,0.5)" }}>
            Copy this URL and send it to the spammer. Print the QR code for physical letters. Every view is logged.
          </p>
          <PersonalizedShareLink company={spammer.company} domain={spammer.domain} email={spammer.email} />
        </div>
      </section>

      {/* ═══ FINAL WARNING STRIP ═══ */}
      <section className="relative px-5 py-16 md:py-20 overflow-hidden text-center"
        style={{ background: `linear-gradient(180deg, ${C.sand} 0%, #0A0505 50%, ${C.sand} 100%)` }}>
        <EmberParticles count={30} color={C.red} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Skull size={40} className="mx-auto mb-6"
            style={{ color: C.red, filter: "drop-shadow(0 0 15px rgba(200,22,26,0.5))" }} />
          <h3 className="font-black text-2xl md:text-4xl mb-4"
            style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0", lineHeight: 1.15 }}>
            {spammer.isPersonalized ? (
              <>{c}, This Is Your Only Warning.</>
            ) : (
              <>This Is Your Only Warning.</>
            )}
          </h3>
          <p className="text-base md:text-lg mb-4 max-w-xl mx-auto" style={{ color: "rgba(245,240,224,0.6)", lineHeight: 1.7 }}>
            Every subsequent message {spammer.isPersonalized ? `from ${c}` : "you send"} will be documented, reported, and added to the evidence file. The clock is running. The agencies are watching. The platforms are banning. The choice is {spammer.isPersonalized ? "theirs" : "yours"}.
          </p>
          <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "rgba(245,240,224,0.4)", lineHeight: 1.6 }}>
            I couldn&rsquo;t escape {spammer.isPersonalized ? `${c}'s` : "your"} email. Now {spammer.isPersonalized ? "they" : "you"} can&rsquo;t escape me. {spammer.isPersonalized ? "They are" : "You are"} literally dead in the water. {spammer.isPersonalized ? "Their" : "Your"} IP has been sniffed. {spammer.isPersonalized ? "Their" : "Your"} device has been fingerprinted. {spammer.isPersonalized ? "They are" : "You are"} personally in my system now and {spammer.isPersonalized ? "they" : "you"} cannot get out.
          </p>
          <div className="inline-block px-8 py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase"
            style={{ backgroundColor: "rgba(200,22,26,0.15)", color: C.red, border: "2px solid rgba(200,22,26,0.4)",
              boxShadow: "0 0 40px rgba(200,22,26,0.2)", animation: "border-glow 2s ease-in-out infinite" }}>
            Cease. Desist. Delete. Now.
          </div>
        </div>
      </section>
    </ManifestoLayout>
  );
}
