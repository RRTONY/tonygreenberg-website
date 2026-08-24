/*
 * VERIFIED TRIBE COMMUNITY PROTECTION REPORT — Case File #1: Alex Azzi
 * Powered by the SunlightProtocol™ verification methodology
 *
 * TEMPLATE: Reusable for 10+ future reports. All subject-specific data lives
 * in the SUBJECT config object. Swap it and the entire page rebuilds.
 *
 * PHILOSOPHY: We don't gossip. We verify. We don't destroy. We offer a path
 * back. Standing idle is complicit. Recklessness is destructive. This is the
 * middle way — judicious, slow, legal, and healing.
 *
 * SECTIONS:
 *   0. VerifiedTribe Principles (manifesto)
 *   1. Hero — Subject as centerpiece + "Report This Person" CTA
 *   2. The SunlightProtocol — "Before You Speak, Be Sure"
 *   3. The Evidence (red flags, timeline, documents, playbook)
 *   4. General Ledger of Retribution — calculable path to removal
 *   5. Byron Katie Verification Gate (popup before submission)
 *   6. Submission Form + Community Collection
 *   7. Healing Framework — protect, heal, become
 *   8. Ecosystem Interlinks (assessments, blog, Find Your series)
 *   9. Legal Footer
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";

/* ═══════════════════════════════════════════════════════════
   SUBJECT CONFIG — SWAP THIS FOR EACH NEW REPORT
   Every piece of subject-specific data lives here.
   ═══════════════════════════════════════════════════════════ */
const SUBJECT = {
  name: "Alex Azzi",
  title: "CEO, XRWorkout",
  aliases: ["Biohackers UAE Founder", "Biohack.ae"],
  photo: "/api/img/cheshire-orig_9554dcb8.jpg",
  photoAlt: "Alex Azzi — VerifiedTribe Community Protection Report Case File #1",
  caseNumber: "CPR-2026-001",
  datePublished: "March 2026",
  totalDocumented: "$137,000+",
  principalOwed: "$75,000+",
  totalPaid: "$15,000",
  paidNote: "One partial payment on Invoice #1 (kickoff). The only money RampRate ever received.",
  interestRate: "1.5%/month (contractual)",
  equityOwed: "3–5% equity never transferred",
  yearsOfPattern: 6,
  tags: ["VR/AR Fitness", "Biohacking", "Startup Circuit", "Conference Speaker", "Unpaid Invoices"],
  slug: "alex-azzi",
};

/* ═══════════════════════════════════════════════════════════
   IMAGES
   ═══════════════════════════════════════════════════════════ */
const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_5_hero_4a47a9b2.jpg",
  mask: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/cheshire-mask-4ofPFkHuEfCMEvFB7MzR4d.webp",
  puppet: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/cheshire-puppet-8NTNwM7xtSbLcFDmxqeCjf.webp",
  vault: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/cheshire-vault-69sjHYVpxTpkN5DTEThgcv.webp",
  vanish: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/cheshire-vanish-Vtq5Covu2WVFSmHZdAUX4X.webp",
  protocol: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_6_protocol_076fabcb.jpg",
  redFlags: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_2_red_flags_535c6c20.jpg",
  evidence: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_11_evidence_0eaef16e.jpg",
  playbook: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_34_playbook_390ed9a1.jpg",
  ledger: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_33_ledger_9aaf5507.jpg",
  community: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_28_community_ae6f3045.jpg",
  healing: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_21_healing_b400d66f.jpg",
  // New glassmorphism section images
  glassPrinciples: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/vt-principles-glass-RnR8hiqd9XHwnfeb9S4r7G.webp",
  glassSunlight: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/vt-sunlight-protocol-htqUDx9BYR5LqsVmLjJkrD.webp",
  glassEvidence: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/vt-evidence-vault-MHk8diSWnHLVCHAnSNDTzf.webp",
  glassRedemption: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/vt-redemption-path-CfmvbHsPwfxVCCUMT8WkpS.webp",
  glassCommunity: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_68_vt-community-shield-YuYBCgBnyitK8FTYr8kzMK_c354b718.jpg",
};

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — HIGH CONTRAST ENFORCED (WCAG AA 4.5:1+)
   ═══════════════════════════════════════════════════════════ */
const C = {
  dark: "#0C0C18", ink: "#1A1A2E", cobalt: "#1E3A5F",
  sand: "#F5EDE0", pale: "#FAF7F2", white: "#FFFFFF",
  textOnDark: "#F0EAE0", textOnDarkMuted: "#C8BFB0",
  textOnDarkSub: "#A89E90", textOnLight: "#1A1A2E",
  textOnLightMuted: "#4A4A5A",
  warn: "#FF4136", saffron: "#E8B820", terracotta: "#E04B3A",
  crimson: "#CC2200", stepNum: "#FF6B5E",
  // New: healing green for retribution/redemption
  heal: "#2D8A56", healLight: "rgba(45,138,86,0.12)",
};

const F = {
  display: "'Fraunces', 'Georgia', serif",
  body: "'Cabinet Grotesk', 'Inter', 'Helvetica Neue', sans-serif",
  mono: "'DM Mono', 'Courier New', monospace",
};

const S: Record<string, React.CSSProperties> = {
  section: { padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem)" },
  container: { maxWidth: 1100, margin: "0 auto" },
  h2: { fontFamily: F.display, fontWeight: 900, fontSize: "clamp(2rem, 5.5vw, 3.2rem)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 1.5rem" },
  h3: { fontFamily: F.display, fontWeight: 700, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.25, margin: "0 0 1rem" },
  body: { fontFamily: F.body, fontWeight: 400, fontSize: "clamp(1.05rem, 2.8vw, 1.2rem)", lineHeight: 1.82, margin: "0 0 1.5rem" },
  label: { fontFamily: F.body, fontWeight: 700, fontSize: "clamp(0.8rem, 2vw, 0.88rem)", letterSpacing: "0.14em", textTransform: "uppercase" as const },
  btn: { fontFamily: F.body, fontWeight: 700, fontSize: "clamp(0.95rem, 2.5vw, 1rem)", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "1rem 2.25rem", border: "none", cursor: "pointer", transition: "all 0.25s ease", display: "inline-flex", alignItems: "center", gap: "0.5rem" },
};

/* ═══════════════════════════════════════════════════════════
   DATA — CASE-SPECIFIC (move to DB for dynamic reports)
   ═══════════════════════════════════════════════════════════ */
const RED_FLAGS = [
  { flag: "They beg for help using personal connections", lesson: "Warm intros are social engineering. The trust belongs to the introducer, not the founder. Get your own due diligence." },
  { flag: "They sign contracts but treat invoices as suggestions", lesson: "A signature means nothing if there's no enforcement plan. Build payment milestones with kill switches." },
  { flag: "They acknowledge the debt — then redirect to a subordinate", lesson: "Acknowledgment without payment is a stalling tactic. Document every admission in writing." },
  { flag: "They go silent when you ask for money", lesson: "Silence is a strategy, not an oversight. Set hard deadlines with consequences in the original contract." },
  { flag: "They offer 'new work' to sidestep the old debt", lesson: "Never accept future promises as payment for past work. Settle the old invoice before discussing anything new." },
  { flag: "They have money in the bank but claim they can't pay", lesson: "If they raised capital or have revenue and still won't pay vendors, that's a choice — not a cash flow problem." },
  { flag: "They name-drop investors, advisors, and events constantly", lesson: "Social proof is not solvency. Ask for bank references, not LinkedIn connections." },
  { flag: "They use charm and vision to make you feel guilty for collecting", lesson: "If asking for payment makes you feel like the bad guy, you're being manipulated. That's the playbook." },
];

const SOL_CARDS = [
  { status: "CRITICAL — ACT NOW", color: C.warn, invoice: "Invoice #1 (kickoff)", date: "March 2022", amount: "$25,000", paid: "$15,000 partial", breachDate: "April 2022", solClose: "April 2026", pct: 97, note: "97% of the 4-year window has elapsed. $15,000 partial payment received — the only money ever paid." },
  { status: "ACTIVE WINDOW", color: C.saffron, invoice: "Invoice #2", date: "January 2023", amount: "$50,000", breachDate: "February 2023", solClose: "February 2027", pct: 63, note: "~63% elapsed. Strong window remains." },
  { status: "SECURE WINDOW", color: "#4ECDC4", invoice: "Invoice #3", date: "December 2024", amount: "$50,000", breachDate: "Early 2025", solClose: "Early 2029", pct: 19, note: "19% elapsed. Most time remaining." },
];

const TIMELINE = [
  { date: "Dec 2021 / Jan 2022", title: "The Signed Contract", text: "Azzi signed RampRate's SOW on January 21, 2022. Terms: $75,000 cash fee plus 3% + up to 2% equity in XRWorkout. Payment due within 10 days. Late payments accrue 1.5%/month." },
  { date: "March 2022", title: "Invoice #1 (kickoff): $25,000", text: "First invoice per contract. XRWorkout (Alex Azzi) actually paid: $15,000 — once, ever. The $15,000 partial payment on Invoice #1 is the only money RampRate ever received from Azzi against a $75,000 cash commitment (plus 3–5% equity that was never transferred)." },
  { date: "May 2022", title: "Change Order 1 — He Admitted It in Writing", text: "The Change Order 1 (May 2022) acknowledged the $10,000 shortfall in writing and promised payment within 10 business days. Did not pay." },
  { date: "April 2022", title: "Services Delivered — Documented", text: "Human capital sessions, product roadmap advisory, BD introductions to fitness franchising operators and platform studio founders. All documented." },
  { date: "January 2023", title: "Invoice #2: $50,000 — Ignored", text: "Net 10 terms. Ignored." },
  { date: "July 2023", title: "The $200K Moment", text: "XRWorkout had $200,000 in the bank. Azzi declined to pay $50,000 owed. Offered $10K/month re-engagement instead." },
  { date: "August 2023", title: "Direct Confrontation — Dismissed", text: "Tony directly confronted Azzi. Response: 'Not ignoring — replying via alex. Thanks -a.' Not a payment. A redirect." },
  { date: "December 2023", title: "Formal Collections — No Response", text: "RampRate offered 15% discount if paid by Dec 31, 2023. Also offered promissory note. Also requested equity confirmation. No response." },
  { date: "February 2024", title: "Final Plea — Silence", text: "'Alex, are you going to make payments on your bill and fix this relationship or let it get worse.' No response." },
  { date: "December 2024", title: "Invoice #3: $50,000 — Final Notice", text: "'You are out of integrity. It's time to pay your bill.' Still unpaid." },
  { date: "March 2026", title: "This Page Goes Live", text: "The community deserves to know. This is the lesson." },
];

const EVIDENCE_ROWS = [
  { claim: "Binding contract signed by Azzi", source: "SOW executed Jan 21, 2022", strength: "IRONCLAD" },
  { claim: "$25K kickoff invoice — only $15K paid (once, ever)", source: "Change Order 1 — Azzi's own admission of $10K shortfall", strength: "IRONCLAD" },
  { claim: "$50K deferred balance unpaid", source: "SOW Section 2.2 + Dec 2023 collections letter", strength: "IRONCLAD" },
  { claim: "3%+2% equity never transferred", source: "Dec 2023 formal request — no response", strength: "STRONG" },
  { claim: "Services delivered in full", source: "4+ meeting docs, grant app, BD intros", strength: "STRONG" },
  { claim: "$200K in bank — active refusal", source: "July 2023 internal CSO update after Azzi call", strength: "DOCUMENTED" },
  { claim: "Collections ignored 3+ years", source: "Email record, formal letters, direct confrontations", strength: "STRONG" },
  { claim: "Interest at 1.5%/month per contract", source: "SOW Section 2.5 — contractual term", strength: "IRONCLAD" },
  { claim: "$50K Dec 2024 invoice unpaid", source: "Collections notice + editorial record", strength: "DOCUMENTED" },
];

const STEPS = [
  { num: 1, title: "Beg for help.", text: "Present yourself as visionary, underdog, deserving. Use warm intros to bypass due diligence.", icon: "\uD83C\uDFAD" },
  { num: 2, title: "Receive the services.", text: "Use the work product. Show the investor decks. Name-drop the advisor. Extract maximum value.", icon: "\uD83D\uDCBC" },
  { num: 3, title: "Deflect.", text: "Redirect to someone else. Blame timing. Blame fundraising. Blame the market. Never blame yourself.", icon: "\uD83E\uDE9E" },
  { num: 4, title: "Go silent.", text: "Make the creditor feel like they are the problem for asking. Silence is the weapon.", icon: "\uD83D\uDD07" },
  { num: 5, title: "Offer a re-engagement.", text: "Float new work to sidestep the original debt. Create a new future to erase the past.", icon: "\uD83C\uDFA3" },
  { num: 6, title: "Repeat.", text: "Find the next warm intro. The next kind person. The next believer. The grin never leaves.", icon: "\uD83D\uDD04" },
];

const MAP_PINS = [
  { city: "Las Vegas, NV", event: "CES Speaker", detail: "Consumer Electronics Show — VR fitness pitch to investor audiences.", type: "confirmed" as const },
  { city: "Santa Clara, CA", event: "AWE USA 2023", detail: "Startup Pitch Finalist at Augmented World Expo.", type: "confirmed" as const },
  { city: "San Francisco, CA", event: "GDC 2024", detail: "Game Developers Conference 2024.", type: "confirmed" as const },
  { city: "Miami, FL", event: "Goldman Sachs Demo + Former Base", detail: "Private demo to ~20 attendees. Former residential base.", type: "major" as const },
  { city: "New York, NY", event: "Current Base", detail: "Current primary base. Active in AI and longevity networking.", type: "major" as const },
  { city: "Davos, Switzerland", event: "WEF Fringe Panels", detail: "3 panels on psychedelics at WEF fringe events (2024 + 2026).", type: "major" as const },
  { city: "Dubai, UAE", event: "6-Year Residence", detail: "Founded Biohackers UAE and Biohack.ae.", type: "major" as const },
  { city: "Beirut, Lebanon", event: "Birthplace", detail: "Hosted Beirut XR Mastermind Jan 9, 2024.", type: "confirmed" as const },
  { city: "London, UK", event: "Former Residence", detail: "Active in AI & Longevity Mastermind circles.", type: "confirmed" as const },
  { city: "Helsinki, Finland", event: "Biohacker Summit", detail: "Recurring presence.", type: "confirmed" as const },
];

const QUESTIONS_10 = [
  "Were you introduced through a mutual contact who vouched for his integrity — and did that introduction lead to unpaid work?",
  "Did he acknowledge a debt verbally or in writing, then deflect collections by redirecting you to someone on his team — indefinitely?",
  "Were you offered equity, advisory shares, or 'back-end' compensation that was never documented, transferred, or honored?",
  "Did XRWorkout use your work product — decks, introductions, strategy — and then dispute or ignore the invoice?",
  "Did he know he had capital available when you were seeking payment — and use a 'future engagement' offer to sidestep the original debt?",
  "Were you an advisor, investor, or vendor who opened a door that XRWorkout benefited from — and received nothing in return?",
  "Did his charm, vision, and fluency in startup language make it harder to push back on non-payment — by design?",
  "Has he referenced other investors, grants, or funding as the reason he 'couldn't pay right now' — for more than 12 months?",
  "Are you aware of any formal legal action, arbitration, or regulatory complaint filed against him or XRWorkout?",
  "Would you be willing to provide a written statement or documentation to support a coordinated community response?",
];

const FEATURED_Q = "Did someone you trust introduce you to Alex Azzi — and did you end up doing work you were never paid for?";
const RELATIONSHIP_OPTIONS = ["Unpaid vendor/advisor", "Equity holder who received nothing", "Event organizer", "Former employee", "Investor", "Other"];
const AMOUNT_OPTIONS = ["Under $5K", "$5K–$25K", "$25K–$75K", "$75K–$150K", "$150K+"];
const DOC_OPTIONS = ["Yes — invoices/contracts", "Yes — emails", "Yes — both", "No"];

/* ═══════════════════════════════════════════════════════════
   GENERAL LEDGER OF RETRIBUTION — Calculable Path to Removal
   ═══════════════════════════════════════════════════════════ */
const RETRIBUTION_LEDGER = {
  title: "The Path Back — What It Takes to Remove This Report",
  subtitle: "This is not a wall of shame. This is a door with conditions.",
  categories: [
    {
      id: "financial",
      icon: "\uD83D\uDCB0",
      name: "Financial Restitution",
      description: "Pay what you owe. Not what you feel like. What the contract says.",
      items: [
        { label: "Total paid to date", value: "$15,000 (one partial payment on Invoice #1 kickoff — the only money ever received)", status: "partial" as const },
        { label: "Principal owed (documented invoices)", value: "$75,000+", status: "unpaid" as const },
        { label: "Contractual interest (1.5%/month since breach)", value: "~$62,000", status: "unpaid" as const },
        { label: "Time-value-of-money adjustment (4 years of lost capital use)", value: "Calculated at 10% CA prejudgment rate", status: "unpaid" as const },
        { label: "Equity transfer per signed SOW", value: "3–5% of XRWorkout", status: "unfulfilled" as const },
      ],
    },
    {
      id: "ecosystem",
      icon: "\uD83C\uDF10",
      name: "Ecosystem Damage Repair",
      description: "The introductions that went cold. The deals that died. The reputation cost to people who vouched.",
      items: [
        { label: "Written acknowledgment to each person who made introductions on his behalf", value: "Minimum 5 individuals", status: "undone" as const },
        { label: "Public statement correcting any misrepresentations made using RampRate's name or work", value: "Verifiable", status: "undone" as const },
        { label: "Direct outreach to affected vendors, advisors, and partners", value: "Documented", status: "undone" as const },
      ],
    },
    {
      id: "time",
      icon: "\u23F1\uFE0F",
      name: "Time Theft Restitution",
      description: "Hours spent chasing payment instead of building. Calculated at professional rates.",
      items: [
        { label: "Collections effort: emails, calls, legal consultations (est. 200+ hours)", value: "At $500/hr advisory rate = $100,000+", status: "unpaid" as const },
        { label: "Opportunity cost: deals not pursued, clients not served", value: "Incalculable — acknowledged", status: "unpaid" as const },
      ],
    },
    {
      id: "acknowledgment",
      icon: "\uD83D\uDCDD",
      name: "Public Acknowledgment",
      description: "Not a PR apology. Not 'I'm sorry if you felt...' A real one. Read our essay on why apologies without action are worthless.",
      items: [
        { label: "Written statement acknowledging the debt, the pattern, and the harm caused", value: "Published publicly", status: "undone" as const },
        { label: "Direct apology to Tony Greenberg and the RampRate team", value: "In writing, not verbal", status: "undone" as const },
        { label: "Acknowledgment to the community that trust was violated", value: "Public forum", status: "undone" as const },
      ],
      blogLink: { text: "Read: Why Apologies Without Action Are Worthless", href: "/blog/apologize" },
    },
    {
      id: "service",
      icon: "\uD83E\uDD1D",
      name: "Community Service",
      description: "Measurable, documented service to the community you damaged. Not a photo op. Real hours. Real impact.",
      items: [
        { label: "100 hours of documented pro-bono advisory work for early-stage founders", value: "Verified by third party", status: "undone" as const },
        { label: "Mentorship commitment to 3 founders from underrepresented communities", value: "12-month minimum", status: "undone" as const },
        { label: "Financial literacy workshop for startup founders on vendor payment ethics", value: "Recorded & published", status: "undone" as const },
      ],
    },
    {
      id: "healing",
      icon: "\uD83C\uDF31",
      name: "Corrective Healing",
      description: "What have you done to heal yourself? To understand why you did this? To ensure it never happens again?",
      items: [
        { label: "Documented engagement with accountability coaching or therapy", value: "Minimum 6 months", status: "undone" as const },
        { label: "Completion of Byron Katie's 'The Work' inquiry on the patterns that led here", value: "Written reflection submitted", status: "undone" as const },
        { label: "Restorative justice mediation with affected parties (if willing)", value: "Facilitated by neutral third party", status: "undone" as const },
      ],
    },
  ],
  removalConditions: "When ALL categories above are verified as complete by an independent third party, this report will be removed and replaced with a statement acknowledging the subject's completion of the retribution process. The path back exists. It requires action, not words.",
};

/* ═══════════════════════════════════════════════════════════
   THE SUNLIGHT PROTOCOL — "Before You Speak, Be Sure"
   ═══════════════════════════════════════════════════════════ */
const VERIFICATION_STEPS = [
  {
    num: 1,
    title: "Stop. Breathe. Question your motive.",
    text: "Before you say a single word to anyone, ask yourself: Is this about protecting others, or about revenge? If there's even 5% revenge in it, you're not ready. Go heal first. Come back when your motive is clean.",
    gate: "Motive check",
  },
  {
    num: 2,
    title: "Apply Byron Katie's Four Questions.",
    text: "Take the thought that's driving you — 'This person scammed me' — and run it through The Work. Is it true? Can you absolutely know it's true? How do you react when you believe that thought? Who would you be without it? If it survives all four, proceed.",
    gate: "Byron Katie gate",
  },
  {
    num: 3,
    title: "Gather documentation. Not feelings. Documents.",
    text: "Contracts. Invoices. Emails. Text messages. Bank records. Timestamps. If you can't point to a document, you don't have a case — you have a grievance. Grievances are valid. But they're not evidence.",
    gate: "Evidence threshold",
  },
  {
    num: 4,
    title: "Find one corroborating witness. Quietly.",
    text: "Not on Reddit. Not on a Facebook group. Reach out privately to ONE person you believe may have had a similar experience. Ask open-ended questions. Don't lead. Don't gossip. Listen. If their story independently matches yours, you have corroboration.",
    gate: "Corroboration",
  },
  {
    num: 5,
    title: "Consult a professional before going public.",
    text: "A lawyer. A mediator. A restorative justice practitioner. Someone who understands defamation law, fair comment doctrine, and the difference between opinion and actionable claims. This costs money. It's worth it. Your credibility depends on it.",
    gate: "Legal review",
  },
  {
    num: 6,
    title: "Give the subject a chance to respond. In writing.",
    text: "Send a formal letter. State the facts. State what you believe happened. Give them 30 days to respond. Document that you gave them the opportunity. This is not optional — it's the ethical floor.",
    gate: "Right of reply",
  },
  {
    num: 7,
    title: "Calculate the cost of being wrong.",
    text: "If you publish and you're wrong, you will be sued. You will lose money. You will lose reputation. You will hurt an innocent person. Are you willing to bet your house on this? If not, go back to Step 3.",
    gate: "Consequences acceptance",
  },
  {
    num: 8,
    title: "Publish with conviction, not anger.",
    text: "If you've passed every gate above, you've earned the right to speak. Do it with facts. Do it with documentation. Do it with a path to redemption for the subject. And do it knowing that words have consequences — for them and for you.",
    gate: "Publication",
  },
];

/* ═══════════════════════════════════════════════════════════
   THE ESCALATION SPECTRUM — Gossip to Madoff
   ═══════════════════════════════════════════════════════════ */
const ESCALATION_SPECTRUM = [
  { level: "Gossip", description: "Unverified whispers. Damages reputations. Solves nothing. The most dangerous thing on earth.", color: "#888", risk: "Destroys trust" },
  { level: "Rumor", description: "Repeated gossip with embellishment. Now it's 'common knowledge' that was never verified.", color: "#AA8844", risk: "Creates false consensus" },
  { level: "Unchecked Pattern", description: "Multiple people have been affected but nobody talks. The bad actor refines their technique.", color: C.saffron, risk: "Enables escalation" },
  { level: "Serial Fraud", description: "Romance scams ($1.16B in 9 months, 2025). Investment fraud. Vendor theft. Now it's a business model.", color: C.terracotta, risk: "Systematic harm" },
  { level: "Institutional Scale", description: "Bernie Madoff. $65 billion. Decades of silence. Everyone suspected. Nobody verified. Nobody spoke.", color: C.warn, risk: "Civilizational failure" },
];

const SCAM_RESOURCES = [
  { name: "FTC — Report Fraud", url: "https://reportfraud.ftc.gov/", description: "Federal Trade Commission consumer fraud reporting" },
  { name: "FBI IC3 — Internet Crime", url: "https://www.ic3.gov/", description: "FBI's Internet Crime Complaint Center" },
  { name: "SEC — Report Securities Fraud", url: "https://www.sec.gov/submit-tip-or-complaint", description: "Securities and Exchange Commission whistleblower portal" },
  { name: "FTC Consumer Sentinel", url: "https://www.ftc.gov/enforcement/consumer-sentinel-network", description: "Law enforcement database of consumer reports" },
  { name: "AARP Fraud Watch", url: "https://www.aarp.org/money/scams-fraud/", description: "Scam tracking and prevention resources" },
  { name: "Better Business Bureau — Scam Tracker", url: "https://www.bbb.org/scamtracker", description: "Community-reported scam database" },
];

/* ═══════════════════════════════════════════════════════════
   SHARE DATA
   ═══════════════════════════════════════════════════════════ */
const getShareUrl = () => typeof window !== "undefined" ? window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com") : "";
const SHARE_TEXTS = {
  linkedin: "\u26A0 VerifiedTribe Community Protection Report: A documented case study in how bad actors operate inside trusted communities. Built on the SunlightProtocol. Verified evidence. Calculable path to redemption.",
  twitter: "\u26A0 We found them inside our community. We documented it. We offered a path back. VerifiedTribe — communities protecting themselves with facts, not gossip. #SunlightProtocol",
  whatsapp: "Before you work with anyone on a handshake — read this VerifiedTribe community protection report:",
  facebook: "A VerifiedTribe community protection report. Verified evidence. SunlightProtocol standards. A path to redemption. This is how we keep our communities clean.",
  email_subject: "VerifiedTribe Report — Read Before Your Next Handshake",
  email_body: "This is the most important thing I've read about protecting our community:",
};

const VIRAL_QUOTES = [
  { text: "A signature means nothing if there's no enforcement plan.", tag: "#GetItInWriting" },
  { text: "If asking for payment makes you feel like the bad guy, you're being manipulated.", tag: "#CommunityProtection" },
  { text: "Gossip is the most dangerous thing on earth. Verified truth is the antidote.", tag: "#VerifyDontGossip" },
  { text: "Silence is a strategy, not an oversight.", tag: "#FounderRedFlags" },
  { text: "$200K in the bank. $50K owed. The vault was never empty — the intention was.", tag: "#PayYourBills" },
  { text: "Standing idle is complicit. Recklessness is destructive. Verification is the middle way.", tag: "#CommunityProtection" },
];

/* ═══════════════════════════════════════════════════════════
   SCHEMA.ORG STRUCTURED DATA
   ═══════════════════════════════════════════════════════════ */
function SchemaJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Alex Azzi — CEO of XRWorkout, Founder of Biohackers UAE | Community Protection Report`,
      description: `Who is Alex Azzi? CEO of XRWorkout (VR fitness), founder of Biohackers UAE, startup speaker, and biohacking advocate. Community protection report documenting ${SUBJECT.totalDocumented} in unpaid invoices.`,
      author: { "@type": "Person", name: "Tony Greenberg", url: "https://tonygreenberg.com" },
      publisher: { "@type": "Organization", name: "RampRate" },
      datePublished: "2026-03-15",
      about: {
        "@type": "Person",
        name: "Alex Azzi",
        jobTitle: "CEO of XRWorkout",
        description: "Alex Azzi is the CEO of XRWorkout, a VR fitness company, and the founder of Biohackers UAE. He is known in the biohacking, VR fitness, and startup communities as a speaker and entrepreneur.",
        worksFor: { "@type": "Organization", name: "XRWorkout" },
        memberOf: { "@type": "Organization", name: "Biohackers UAE" },
        knowsAbout: ["VR fitness", "biohacking", "startups", "XR technology"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Alex Azzi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Alex Azzi is the CEO of XRWorkout, a VR fitness startup, and the founder of Biohackers UAE. He is active in the biohacking, VR fitness, and startup communities as an entrepreneur and speaker.",
          },
        },
        {
          "@type": "Question",
          name: "What is XRWorkout?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "XRWorkout is a VR fitness company founded by Alex Azzi that uses virtual reality technology for immersive workout experiences.",
          },
        },
        {
          "@type": "Question",
          name: "What is Biohackers UAE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Biohackers UAE is a biohacking community and organization founded by Alex Azzi, focused on health optimization and biohacking practices in the United Arab Emirates.",
          },
        },
        {
          "@type": "Question",
          name: "What does Alex Azzi do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Alex Azzi is an entrepreneur in the VR fitness and biohacking space. He serves as CEO of XRWorkout and founded Biohackers UAE. He is also a speaker at startup and technology conferences.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a community protection report on Alex Azzi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. VerifiedTribe published a community protection report documenting $137,000+ in unpaid invoices and unfulfilled equity agreements across 6 years. The report follows the SunlightProtocol verification methodology and includes a documented path to redemption.",
          },
        },
      ],
    },
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBMISSION COUNTER
   ═══════════════════════════════════════════════════════════ */
function SubmissionCounter({ count, dark = false }: { count: number; dark?: boolean }) {
  if (count < 2) return null;
  return (
    <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.heal, boxShadow: `0 0 8px ${C.heal}`, animation: "pulse 2s infinite" }} />
      <span style={{ fontFamily: F.mono, fontSize: "0.92rem", color: dark ? C.textOnDarkMuted : C.textOnLightMuted }}>
        {count} community members have contributed to this report
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setWidth(pct); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);
  return (
    <div ref={ref} style={{ height: 14, background: "rgba(26,26,46,0.08)", borderRadius: 7, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}dd)`, borderRadius: 7, transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)", boxShadow: `0 0 12px ${color}44` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FADE IN ON SCROLL
   ═══════════════════════════════════════════════════════════ */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARE BUTTONS
   ═══════════════════════════════════════════════════════════ */
function ShareBar({ dark = false, cta = "Share this with someone who needs it" }: { dark?: boolean; cta?: string }) {
  const [copied, setCopied] = useState(false);
  const trackShareMutation = trpc.analytics.trackShare.useMutation();
  const createShortUrlMut = trpc.shortUrls.create.useMutation();
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  useEffect(() => {
    createShortUrlMut.mutateAsync({ targetPath: "/cheshire-grin" }).then(r => {
      setShortUrl(`https://tonygreenberg.com${r.shortUrl}`);
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const url = shortUrl || getShareUrl();
  const textColor = dark ? C.textOnDark : C.textOnLight;
  const borderColor = dark ? "rgba(240,234,224,0.3)" : "rgba(26,26,46,0.2)";
  const btnBase: React.CSSProperties = {
    fontFamily: F.body, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em",
    textTransform: "uppercase", padding: "0.6rem 1rem", border: `1.5px solid ${borderColor}`,
    background: "transparent", color: textColor, cursor: "pointer",
    transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "0.4rem",
    textDecoration: "none",
  };
  const copy = () => { trackShareMutation.mutate({ postSlug: "cheshire-grin", shareType: "copy" }); navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${borderColor}` }}>
      <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: "1.08rem", color: dark ? C.textOnDarkMuted : C.textOnLightMuted, marginBottom: "0.75rem", letterSpacing: "0.02em" }}>
        {cta}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener" style={btnBase} onClick={() => trackShareMutation.mutate({ postSlug: "cheshire-grin", shareType: "linkedin" })}>LinkedIn</a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXTS.twitter + " " + url)}`} target="_blank" rel="noopener" style={btnBase} onClick={() => trackShareMutation.mutate({ postSlug: "cheshire-grin", shareType: "twitter" })}>X / Twitter</a>
        <a href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXTS.whatsapp + " " + url)}`} target="_blank" rel="noopener" style={btnBase} onClick={() => trackShareMutation.mutate({ postSlug: "cheshire-grin", shareType: "whatsapp" })}>WhatsApp</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener" style={btnBase} onClick={() => trackShareMutation.mutate({ postSlug: "cheshire-grin", shareType: "facebook" })}>Facebook</a>
        <a href={`mailto:?subject=${encodeURIComponent(SHARE_TEXTS.email_subject)}&body=${encodeURIComponent(SHARE_TEXTS.email_body + " " + url)}`} style={btnBase} onClick={() => trackShareMutation.mutate({ postSlug: "cheshire-grin", shareType: "email" })}>Email</a>
        <button onClick={copy} style={btnBase}>{copied ? "Copied!" : "Copy Link"}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VIRAL QUOTE CARD
   ═══════════════════════════════════════════════════════════ */
function ViralQuote({ text, tag, dark = false }: { text: string; tag: string; dark?: boolean }) {
  const url = getShareUrl();
  const tweetText = `"${text}" ${tag}\n\nFull report:`;
  return (
    <div style={{
      background: dark ? "rgba(240,234,224,0.06)" : "rgba(26,26,46,0.04)",
      border: `2px solid ${dark ? "rgba(240,234,224,0.15)" : "rgba(26,26,46,0.1)"}`,
      padding: "1.5rem 2rem", margin: "1.5rem 0", position: "relative",
    }}>
      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.55, color: dark ? C.textOnDark : C.textOnLight, fontStyle: "italic" }}>
        &ldquo;{text}&rdquo;
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: F.mono, fontSize: "1rem", color: dark ? C.saffron : C.crimson, fontWeight: 600 }}>{tag}</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText + " " + url)}`}
          target="_blank" rel="noopener"
          style={{ fontFamily: F.body, fontSize: "1.08rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? C.textOnDarkMuted : C.textOnLightMuted, textDecoration: "none", padding: "0.3rem 0.6rem", border: `1px solid ${dark ? "rgba(240,234,224,0.2)" : "rgba(26,26,46,0.15)"}`, cursor: "pointer" }}
        >
          Tweet This
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WARNING BANNER (repeating marquee)
   ═══════════════════════════════════════════════════════════ */
function WarningStrip() {
  return (
    <div style={{
      background: C.warn, color: C.white, padding: "0.5rem 0", overflow: "hidden", position: "relative",
      fontFamily: F.body, fontWeight: 800, fontSize: "1.08rem", letterSpacing: "0.2em", textTransform: "uppercase",
    }}>
      <div style={{ display: "flex", gap: "3rem", animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i}>{"\u26A0"} COMMUNITY PROTECTION REPORT {"\u2014"} VERIFIED EVIDENCE {"\u2014"} CASE FILE: {SUBJECT.name.toUpperCase()} {"\u2014"} {SUBJECT.totalDocumented} DOCUMENTED {"\u2014"} PATH TO REDEMPTION AVAILABLE {"\u26A0"}</span>
        ))}
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOWNLOAD CHECKLIST
   ═══════════════════════════════════════════════════════════ */
function DownloadChecklist({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!email || !email.includes("@")) return;
    setDownloading(true);
    const content = [
      "THE SUNLIGHT PROTOCOL — VERIFIED TRIBE COMMUNITY PROTECTION",
      "8 Steps Before You Speak + 10 Questions to Ask",
      "\u2501".repeat(80),
      "",
      "8 RED FLAGS TO MEMORIZE:",
      "",
      ...RED_FLAGS.map((rf, i) => `  ${i + 1}. ${rf.flag}\n     Lesson: ${rf.lesson}\n`),
      "",
      "\u2501".repeat(80),
      "",
      "THE SUNLIGHT PROTOCOL — 8 STEPS:",
      "",
      ...VERIFICATION_STEPS.map((s) => `  ${s.num}. ${s.title}\n     ${s.text}\n`),
      "",
      "\u2501".repeat(80),
      "",
      "BYRON KATIE'S FOUR QUESTIONS (apply before ANY report):",
      "",
      "  1. Is it true?",
      "  2. Can you absolutely know that it's true?",
      "  3. How do you react — what happens — when you believe that thought?",
      "  4. Who would you be without that thought?",
      "",
      "\u2501".repeat(80),
      "",
      "THE THREE-WORD RULE: Get. It. In. Writing.",
      "",
      "Source: VerifiedTribe Community Protection Report — tonygreenberg.manus.space",
      "Author: Tony Greenberg | RampRate.com",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Community-Protection-Verification-Protocol.txt";
    a.click();
    URL.revokeObjectURL(url);
    setSubmitted(true);
    setDownloading(false);
  };

  const bgColor = dark ? "rgba(232,184,32,0.08)" : "rgba(232,184,32,0.06)";
  const borderColor = dark ? C.saffron : "rgba(232,184,32,0.4)";

  if (submitted) {
    return (
      <div style={{ background: bgColor, border: `2px solid ${borderColor}`, padding: "1.5rem 2rem", marginTop: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{"\u2713"}</div>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1rem", color: dark ? C.textOnDark : C.textOnLight, marginBottom: "0.5rem" }}>Protocol Downloaded</div>
        <div style={{ fontFamily: F.body, fontSize: "1rem", color: dark ? C.textOnDarkMuted : C.textOnLightMuted, lineHeight: 1.65 }}>
          Now forward it to every community leader, founder, and advisor in your network.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bgColor, border: `2px solid ${borderColor}`, padding: "1.5rem 2rem", marginTop: "2rem" }}>
      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1rem", color: dark ? C.textOnDark : C.textOnLight, marginBottom: "0.25rem" }}>
        Download the SunlightProtocol
      </div>
      <div style={{ fontFamily: F.body, fontSize: "1.08rem", color: dark ? C.textOnDarkMuted : C.textOnLightMuted, marginBottom: "1rem", lineHeight: 1.6 }}>
        8 red flags + 8 verification steps + Byron Katie's 4 Questions. The complete ethical reporting toolkit.
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            fontFamily: F.body, fontSize: "1.02rem", padding: "0.6rem 1rem",
            border: `1.5px solid ${dark ? "rgba(240,234,224,0.3)" : "rgba(26,26,46,0.2)"}`,
            background: dark ? "rgba(240,234,224,0.08)" : C.white,
            color: dark ? C.textOnDark : C.textOnLight,
            flex: 1, minWidth: 200,
          }}
        />
        <button
          onClick={handleDownload}
          disabled={downloading || !email.includes("@")}
          style={{
            ...S.btn, background: C.saffron, color: "#1A1A2E", fontWeight: 800,
            fontSize: "0.92rem", padding: "0.6rem 1.5rem",
            opacity: downloading || !email.includes("@") ? 0.6 : 1,
          }}
        >
          {downloading ? "Downloading..." : "Download Protocol"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BYRON KATIE VERIFICATION GATE — Popup before submission
   ═══════════════════════════════════════════════════════════ */
function ByronKatieGate({ onPass, onClose }: { onPass: () => void; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const questions = [
    { q: "Is it true that Alex Azzi defrauded people?", sub: "Not 'do you feel it's true.' Is there documented evidence — contracts, invoices, emails, timestamps — that Alex Azzi took services and didn't pay? That he promised equity and never transferred it? That he used charm and startup language to extract value and then treated the invoice as optional?" },
    { q: "Can you absolutely know that it's true?", sub: "With 100% certainty. Not 95%. Not 'probably.' Can you stake your reputation, your finances, and your integrity on the claim that Alex Azzi owes $137,000+ in documented obligations? That this is a pattern across 6 years, multiple companies, and multiple victims — not a one-time misunderstanding?" },
    { q: "How do you react when you believe that Alex Azzi is a fraud?", sub: "What emotions arise? Anger? Revenge? Fear? A desire for justice? Be honest with yourself. If revenge is driving your report — if this is personal, not protective — stop here. Come back when your motive is clean. This platform is for community protection, not personal vendetta." },
    { q: "Who would you be without the thought that Alex Azzi wronged you?", sub: "If this thought didn't exist, would you still feel compelled to act? Would you still want to protect the next person from the same handshake, the same promises, the same empty chair? If yes — from a place of community protection — proceed. If no, this isn't your fight right now." },
  ];

  const current = questions[step];
  const canProceed = answers[step].length >= 20;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(12,12,24,0.92)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: C.dark, border: `2px solid ${C.saffron}`,
        maxWidth: 600, width: "100%", padding: "2.5rem",
        boxShadow: `0 0 60px rgba(232,184,32,0.15)`,
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "transparent", border: "none", color: C.textOnDarkSub,
          fontSize: "1.5rem", cursor: "pointer", lineHeight: 1,
        }}>&times;</button>

        <div style={{ ...S.label, color: C.saffron, marginBottom: "0.5rem" }}>
          Verification Gate — Step {step + 1} of 4
        </div>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: C.textOnDark, marginBottom: "0.75rem", lineHeight: 1.2 }}>
          {current.q}
        </div>
        <p style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnDarkMuted, lineHeight: 1.7, marginBottom: "1.5rem" }}>
          {current.sub}
        </p>
        <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnDarkSub, marginBottom: "0.5rem" }}>
          Your honest reflection (minimum 20 characters):
        </div>
        <textarea
          value={answers[step]}
          onChange={(e) => {
            const next = [...answers];
            next[step] = e.target.value;
            setAnswers(next);
          }}
          placeholder="Write your honest answer here..."
          rows={4}
          style={{
            width: "100%", fontFamily: F.body, fontSize: "1.08rem", padding: "0.75rem 1rem",
            border: `1.5px solid rgba(240,234,224,0.3)`, background: "rgba(240,234,224,0.08)",
            color: C.textOnDark, resize: "vertical", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ ...S.btn, background: "transparent", color: C.textOnDarkMuted, border: `1.5px solid rgba(240,234,224,0.3)`, fontSize: "0.92rem", padding: "0.6rem 1.5rem" }}>
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else onPass();
            }}
            disabled={!canProceed}
            style={{
              ...S.btn, background: canProceed ? C.saffron : "rgba(232,184,32,0.3)",
              color: "#1A1A2E", fontSize: "0.92rem", padding: "0.6rem 1.5rem",
              marginLeft: "auto", opacity: canProceed ? 1 : 0.5,
            }}
          >
            {step < 3 ? "Next Question" : "I've Verified My Truth — Proceed"}
          </button>
        </div>
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(240,234,224,0.04)", border: `1px solid rgba(240,234,224,0.08)` }}>
          <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnDarkSub, lineHeight: 1.6 }}>
            Based on <a href="https://thework.com" target="_blank" rel="noopener" style={{ color: C.saffron, textDecoration: "underline" }}>The Work of Byron Katie</a>. These four questions have helped millions distinguish between belief and truth. We use them here because gossip is the most dangerous thing on earth — and verified truth is the antidote.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ENDORSEMENT FORM — Anonymous Byron Katie verification
   ═══════════════════════════════════════════════════════ */
function EndorsementForm({ reportSlug, onSuccess, onCancel }: { reportSlug: string; onSuccess: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [statement, setStatement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = [
    { q: "Is it true that Alex Azzi defrauded people?", hint: "Have you reviewed the evidence on this page? Do the contracts, invoices, and emails support the claims? Answer honestly." },
    { q: "Can you absolutely know that it's true?", hint: "With 100% certainty. Not probably. Not maybe. Can you stake your integrity on this being factually accurate based on the documented evidence?" },
    { q: "How do you react when you believe that thought?", hint: "What emotions come up? Is your motivation clean — community protection, not personal revenge? Be honest with yourself." },
    { q: "Who would you be without that thought?", hint: "Would you still want to protect the next person? If yes, from a place of service — proceed." },
  ];

  const endorseMutation = trpc.endorsement.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) { onSuccess(); }
      else { setError(data.error || "Unable to submit endorsement."); }
    },
    onError: (err: { message: string }) => setError(err.message),
  });

  const canProceed = answers[step].length >= 20;
  const current = questions[step];

  const handleSubmit = () => {
    if (statement.length < 20) { setError("Please write at least 20 characters for your endorsement statement."); return; }
    setSubmitting(true);
    setError("");
    endorseMutation.mutate({
      reportSlug,
      bkAnswer1: answers[0],
      bkAnswer2: answers[1],
      bkAnswer3: answers[2],
      bkAnswer4: answers[3],
      endorsementStatement: statement,
    });
  };

  if (step < 4) {
    return (
      <FadeIn>
        <div style={{ padding: "2rem", background: "rgba(240,234,224,0.06)", border: `1.5px solid ${C.saffron}` }}>
          <div style={{ ...S.label, color: C.saffron, marginBottom: "0.5rem" }}>Endorsement Gate — Question {step + 1} of 4</div>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: C.textOnDark, marginBottom: "0.75rem", lineHeight: 1.2 }}>
            {current.q}
          </div>
          <p style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnDarkMuted, lineHeight: 1.7, marginBottom: "1.25rem" }}>
            {current.hint}
          </p>
          <textarea
            value={answers[step]}
            onChange={(e) => { const next = [...answers]; next[step] = e.target.value; setAnswers(next); }}
            placeholder="Your honest reflection (minimum 20 characters)..."
            rows={3}
            style={{ width: "100%", fontFamily: F.body, fontSize: "1rem", padding: "0.75rem 1rem", border: `1.5px solid rgba(240,234,224,0.3)`, background: "rgba(240,234,224,0.08)", color: C.textOnDark, resize: "vertical", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <button onClick={step > 0 ? () => setStep(step - 1) : onCancel} style={{ ...S.btn, background: "transparent", color: C.textOnDarkMuted, border: `1.5px solid rgba(240,234,224,0.3)`, fontSize: "0.92rem", padding: "0.6rem 1.5rem" }}>
              {step > 0 ? "Back" : "Cancel"}
            </button>
            <button onClick={() => setStep(step + 1)} disabled={!canProceed} style={{ ...S.btn, background: canProceed ? C.saffron : "rgba(232,184,32,0.3)", color: "#1A1A2E", fontSize: "0.92rem", padding: "0.6rem 1.5rem", opacity: canProceed ? 1 : 0.5 }}>
              Next Question
            </button>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div style={{ padding: "2rem", background: "rgba(240,234,224,0.06)", border: `1.5px solid ${C.heal}` }}>
        <div style={{ ...S.label, color: C.heal, marginBottom: "0.5rem" }}>Final Step — Your Endorsement</div>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.2rem", color: C.textOnDark, marginBottom: "0.75rem" }}>
          You've done The Work. Now ring the bell.
        </div>
        <p style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnDarkMuted, lineHeight: 1.7, marginBottom: "1.25rem" }}>
          Write a brief statement confirming you believe this report is true and should be public. Your identity is never published. This is anonymous.
        </p>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="I have reviewed the evidence and done The Work. I believe this report is true and should be public because..."
          rows={4}
          style={{ width: "100%", fontFamily: F.body, fontSize: "1rem", padding: "0.75rem 1rem", border: `1.5px solid rgba(45,138,86,0.4)`, background: "rgba(45,138,86,0.08)", color: C.textOnDark, resize: "vertical", boxSizing: "border-box" }}
        />
        {error && <div style={{ padding: "0.75rem 1rem", background: "rgba(255,65,54,0.15)", border: `1px solid ${C.warn}`, fontFamily: F.body, fontSize: "0.95rem", color: C.warn, marginTop: "0.75rem" }}>{error}</div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <button onClick={() => setStep(3)} style={{ ...S.btn, background: "transparent", color: C.textOnDarkMuted, border: `1.5px solid rgba(240,234,224,0.3)`, fontSize: "0.92rem", padding: "0.6rem 1.5rem" }}>Back</button>
          <button onClick={handleSubmit} disabled={endorseMutation.isPending || statement.length < 20} style={{ ...S.btn, background: statement.length >= 20 ? C.heal : "rgba(45,138,86,0.3)", color: "#fff", fontSize: "0.92rem", padding: "0.6rem 1.5rem", opacity: endorseMutation.isPending ? 0.6 : 1 }}>
            {endorseMutation.isPending ? "Submitting..." : "Ring the Bell — Endorse This Report"}
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
    ═════════════════════════════════════════════════════ */
export default function CheshireGrin() {
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === "alexscam") {
      setPasswordUnlocked(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password.");
    }
  };

  const evidenceRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const redFlagsRef = useRef<HTMLElement>(null);
  const protocolRef = useRef<HTMLElement>(null);
  const ledgerRef = useRef<HTMLElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showByronKatie, setShowByronKatie] = useState(false);
  const [byronKatiePassed, setByronKatiePassed] = useState(false);

  const { data: countData } = trpc.cheshire.publicCount.useQuery(undefined, { staleTime: 30_000 });
  const submissionCount = countData?.count ?? 0;

  // Endorsement system — 3 signatures required before report is "live"
  const endorseRef = useRef<HTMLElement>(null);
  const { data: endorseData, refetch: refetchEndorsements } = trpc.endorsement.count.useQuery({ reportSlug: SUBJECT.slug }, { staleTime: 10_000 });
  const endorseCount = endorseData?.count ?? 0;
  const isVerified = endorseData?.verified ?? false;
  const [showEndorseForm, setShowEndorseForm] = useState(false);

  const [formData, setFormData] = useState({
    relationship: "",
    city: "",
    dateRange: "",
    promisedVsDelivered: "",
    receivedPayment: "" as "" | "yes" | "partial" | "no",
    amountOwed: "",
    hasDocumentation: "",
    willingToContact: false,
    contactEmail: "",
    howHeard: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [consequencesAccepted, setConsequencesAccepted] = useState(false);

  const submitMutation = trpc.cheshire.submit.useMutation({
    onSuccess: () => setFormSubmitted(true),
    onError: (err: { message: string }) => setFormError(err.message),
  });

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!byronKatiePassed) { setShowByronKatie(true); return; }
    if (!consequencesAccepted) { setFormError("You must accept responsibility for the consequences of your submission."); return; }
    if (!formData.relationship) { setFormError("Please select your relationship."); return; }
    if (!formData.promisedVsDelivered || formData.promisedVsDelivered.length < 50) { setFormError("Please describe what happened (minimum 50 characters)."); return; }
    if (!formData.receivedPayment) { setFormError("Please indicate if you received payment."); return; }
    submitMutation.mutate({
      ...formData,
      receivedPayment: formData.receivedPayment as "yes" | "partial" | "no",
    });
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: F.body, fontSize: "1.08rem", padding: "0.75rem 1rem",
    border: `1.5px solid rgba(240,234,224,0.3)`, background: "rgba(240,234,224,0.08)",
    color: C.textOnDark, width: "100%", boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none" as const };

  if (!passwordUnlocked) {
    return (
      <div style={{
        minHeight: "100vh",
        background: C.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: F.display,
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 900,
            color: C.saffron,
            marginBottom: "0.5rem",
            letterSpacing: "0.04em",
          }}>
            RESTRICTED ACCESS
          </div>
          <div style={{
            fontFamily: F.body,
            fontSize: "1.08rem",
            color: C.textOnDarkSub,
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}>
            This report is password-protected.
          </div>
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              autoFocus
              style={{
                fontFamily: F.mono,
                fontSize: "1.1rem",
                padding: "0.85rem 1.2rem",
                border: `2px solid ${passwordError ? C.warn : "rgba(240,234,224,0.25)"}`,
                background: "rgba(240,234,224,0.06)",
                color: C.textOnDark,
                textAlign: "center",
                letterSpacing: "0.15em",
                outline: "none",
              }}
            />
            {passwordError && (
              <div style={{ fontFamily: F.body, fontSize: "0.92rem", color: C.warn }}>
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              style={{
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: "1rem",
                padding: "0.85rem 2rem",
                background: C.saffron,
                color: C.dark,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              UNLOCK REPORT
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Alex Azzi — XRWorkout CEO & Biohackers UAE"
        description={`Who is Alex Azzi? CEO of XRWorkout, founder of Biohackers UAE. Community report documenting ${SUBJECT.totalDocumented} in unpaid invoices.`}
        keywords="Alex Azzi, XRWorkout, VR fitness, biohacking UAE, Biohackers UAE, startup speaker, community protection report"
        path="/alex-azzi"
        image="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/og-alex-azzi-mUffXWA2JbGUKwZdNGbJ3h.png"
        type="article"
        publishDate="2026-03-15"
        indexable={true}
      />
      <SchemaJsonLd />

      {/* Byron Katie Gate */}
      {showByronKatie && (
        <ByronKatieGate
          onPass={() => { setByronKatiePassed(true); setShowByronKatie(false); }}
          onClose={() => setShowByronKatie(false)}
        />
      )}

      {/* Scroll Progress */}
      <div style={{ position: "fixed", top: 0, left: 0, width: `${scrollPct}%`, height: 4, background: `linear-gradient(90deg, ${C.saffron}, ${C.heal})`, zIndex: 9999, transition: "width 0.1s linear" }} />

      {/* Sticky Nav */}
      <nav style={{
        position: "fixed", top: 4, left: 0, right: 0, zIndex: 9998,
        background: "rgba(12,12,24,0.95)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid rgba(232,184,32,0.2)`,
        padding: "0.6rem clamp(1rem, 3vw, 2rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem",
      }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "1rem", color: C.textOnDark, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ background: C.saffron, color: C.dark, padding: "0.15rem 0.5rem", fontSize: "0.92rem", fontFamily: F.body, fontWeight: 800, letterSpacing: "0.1em" }}>CASE FILE {SUBJECT.caseNumber}</span>
          VerifiedTribe Report
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "Protocol", ref: protocolRef },
            { label: "Evidence", ref: evidenceRef },
            { label: "Path Back", ref: ledgerRef },
            { label: "Report", ref: formRef },
          ].map((n) => (
            <button key={n.label} onClick={() => scrollTo(n.ref)} style={{
              fontFamily: F.body, fontWeight: 700, fontSize: "1.08rem", letterSpacing: "0.1em",
              textTransform: "uppercase", background: "transparent", border: "none",
              color: C.textOnDarkMuted, cursor: "pointer", padding: "0.3rem 0",
            }}>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <div>
        {/* ═══════════════════════════════════════════════════════
           SECTION 0: COMMUNITY PROTECTION PRINCIPLES — Manifesto
           ═══════════════════════════════════════════════════════ */}
        <section style={{
          ...S.section, paddingTop: "clamp(5rem, 10vw, 8rem)", paddingBottom: "3rem",
          background: C.dark, textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Visible glassmorphism background image */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.45,
            backgroundImage: `url(${IMG.glassPrinciples})`, backgroundSize: "cover", backgroundPosition: "center",
            filter: "saturate(0.7) contrast(1.1)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,12,24,0.6) 0%, rgba(12,12,24,0.85) 50%, rgba(12,12,24,0.95) 100%)" }} />

          <div style={{ ...S.container, maxWidth: 900, position: "relative" }}>
            {/* Prominent section image */}
            <FadeIn>
              <div style={{
                marginBottom: "2.5rem", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(232,184,32,0.08)",
                maxHeight: 320, position: "relative",
              }}>
                <img src={IMG.glassPrinciples} alt="Cracked mirror revealing truth through sacred geometry" loading="lazy" sizes="(max-width: 768px) 100vw, 800px" style={{
                  width: "100%", height: "auto", display: "block", objectFit: "cover",
                  filter: "contrast(1.05) saturate(0.9)",
                }} />
                {/* Glassmorphism overlay strip */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                  background: "linear-gradient(transparent, rgba(12,12,24,0.9))",
                }} />
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div style={{ ...S.label, color: C.saffron, marginBottom: "1.5rem", letterSpacing: "0.2em" }}>
                VerifiedTribe Principles
              </div>
            </FadeIn>

            {/* Glassmorphism manifesto card */}
            <FadeIn delay={200}>
              <div style={{
                padding: "clamp(1.5rem, 4vw, 3rem)",
                background: "rgba(240,234,224,0.04)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(240,234,224,0.12)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(240,234,224,0.06)",
              }}>
                <div style={{
                  fontFamily: F.display, fontWeight: 900,
                  fontSize: "clamp(1.25rem, 3.5vw, 1.7rem)", lineHeight: 1.65,
                  color: C.textOnDark,
                }}>
                  We found them inside our community.<br />
                  We are the VerifiedTribe.<br />
                  Scammers. Cheats. Bad actors.<br />
                  We&rsquo;ve seen it all.<br /><br />
                  <span style={{ color: C.saffron }}>Gossip is the most dangerous thing on earth.</span><br />
                  Reddit is a festering pool of anonymous stench.<br />
                  Dating red-flag boards are echo chambers.<br />
                  Underground revenge sites are cesspools.<br /><br />
                  <span style={{ color: C.heal }}>We are none of those things.</span><br /><br />
                  We don&rsquo;t believe. We verify.<br />
                  We don&rsquo;t destroy. We document.<br />
                  We don&rsquo;t trap. We offer a path back.<br /><br />
                  Standing idle is complicit.<br />
                  Recklessness is destructive.<br />
                  <span style={{ color: C.saffron }}>Verification is the middle way.</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div style={{
                marginTop: "2rem", padding: "1.5rem 2rem",
                background: "rgba(240,234,224,0.03)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(240,234,224,0.08)",
                borderRadius: "8px",
              }}>
                <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnDarkMuted, lineHeight: 1.8 }}>
                  Inspired by <a href="https://thework.com" target="_blank" rel="noopener" style={{ color: C.saffron, textDecoration: "underline" }}>Byron Katie&rsquo;s The Work</a> and the ethical technology framework of <a href="https://www.humanetech.com" target="_blank" rel="noopener" style={{ color: C.saffron, textDecoration: "underline" }}>Tristan Harris &amp; Aza Raskin</a> at the Center for Humane Technology. In a time when neural plasticity is open and people are trained to consume the worst of humanity, we refuse to feed the outrage machine. We are not interested in beliefs. We are interested in facts — time-tested and true.
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 1: HERO — Instant Clarity + Subject as Centerpiece
           ═══════════════════════════════════════════════════════ */}
        <section style={{
          ...S.section,
          background: `linear-gradient(175deg, ${C.ink} 0%, ${C.dark} 100%)`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: "-20%", opacity: 0.25,
            backgroundImage: `url(${IMG.hero})`, backgroundSize: "cover", backgroundPosition: "center",
            filter: "contrast(1.1) saturate(0.8)",
            transform: `translateY(${scrollY * 0.08}px)`,
            transition: "transform 0.1s linear",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,12,24,0.7) 0%, rgba(26,26,46,0.85) 50%, rgba(12,12,24,0.95) 100%)" }} />
          <div style={{ ...S.container, position: "relative" }}>

            {/* INSTANT CLARITY BLOCK — What is this? In 5 seconds. */}
            <FadeIn>
              <div style={{
                marginBottom: "2.5rem", padding: "clamp(1.5rem, 3vw, 2.5rem)",
                background: "rgba(232,184,32,0.08)", border: `2px solid ${C.saffron}`,
                textAlign: "center",
              }}>
                <div style={{ ...S.label, color: C.saffron, marginBottom: "1rem", fontSize: "clamp(0.85rem, 2vw, 1rem)", letterSpacing: "0.2em" }}>
                  What Is VerifiedTribe?
                </div>
                <div style={{
                  fontFamily: F.display, fontWeight: 900,
                  fontSize: "clamp(1.3rem, 3.5vw, 2rem)", lineHeight: 1.35,
                  color: C.textOnDark, marginBottom: "1rem",
                }}>
                  A movement for community self-healing.<br />
                  A system to verify — not gossip. Document — not destroy.<br />
                  Remove verified bad actors from your tribe.
                </div>
                <div style={{ fontFamily: F.body, fontSize: "clamp(1rem, 2.5vw, 1.15rem)", color: C.textOnDarkMuted, lineHeight: 1.7, maxWidth: 700, margin: "0 auto" }}>
                  No anonymous accusations. No mob justice. No one acts alone. Every report requires <strong style={{ color: C.saffron }}>3 independent endorsements</strong> from community members — this one has received 7 from various channels — who have done the work — asked themselves Byron Katie's four questions — and believe this report is true. This is the ethical middle ground between silence and gossip.
                </div>
              </div>
            </FadeIn>

            {/* THIS REPORT TARGETS — Alex Azzi */}
            <FadeIn delay={100}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ ...S.label, color: C.warn, letterSpacing: "0.15em", marginBottom: "0.5rem" }}>This Report Targets</div>
              </div>
            </FadeIn>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", alignItems: "center" }}>
              {/* Alex's photo — LARGE, centerpiece */}
              <FadeIn delay={150}>
                <div style={{
                  width: "clamp(200px, 30vw, 320px)", height: "clamp(200px, 30vw, 320px)",
                  borderRadius: "50%", overflow: "hidden",
                  border: `4px solid ${C.warn}`,
                  boxShadow: `0 0 40px rgba(255,65,54,0.25), 0 0 80px rgba(255,65,54,0.1)`,
                  flexShrink: 0,
                }}>
                  <img src={SUBJECT.photo} alt={SUBJECT.photoAlt} sizes="(max-width: 640px) 100vw, 400px" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1)" }} loading="lazy" />
                </div>
              </FadeIn>

              <div style={{ flex: 1, minWidth: 280 }}>
                <FadeIn delay={200}>
                  <div style={{ ...S.label, color: C.warn, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ background: C.warn, color: C.white, padding: "0.2rem 0.6rem", fontSize: "0.92rem" }}>CASE FILE {SUBJECT.caseNumber}</span>
                    VerifiedTribe Report
                  </div>
                </FadeIn>
                <FadeIn delay={250}>
                  <h1 style={{
                    fontFamily: F.display, fontWeight: 900,
                    fontSize: "clamp(1.8rem, 5vw, 3.2rem)", lineHeight: 1.1,
                    color: C.textOnDark, margin: "0 0 1rem",
                    letterSpacing: "-0.03em",
                  }}>
                    Alex Azzi — XRWorkout CEO
                  </h1>
                  <p style={{ fontFamily: F.body, fontSize: "1.1rem", color: C.textOnDarkMuted, margin: "0 0 0.5rem" }}>Founder of Biohackers UAE &middot; VR Fitness &middot; Startup Speaker</p>
                  <p style={{ color: C.warn, fontSize: "1rem", fontFamily: F.mono, margin: 0 }}>{SUBJECT.totalDocumented} in Unpaid Invoices Documented</p>
                </FadeIn>
                <FadeIn delay={300}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                    {SUBJECT.tags.map((tag) => (
                      <span key={tag} style={{
                        fontFamily: F.mono, fontSize: "0.92rem", padding: "0.2rem 0.5rem",
                        background: tag === "Unpaid Invoices" ? "rgba(255,65,54,0.2)" : "rgba(240,234,224,0.08)",
                        color: tag === "Unpaid Invoices" ? C.warn : C.textOnDarkSub,
                        border: `1px solid ${tag === "Unpaid Invoices" ? "rgba(255,65,54,0.4)" : "rgba(240,234,224,0.1)"}`,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </FadeIn>
                <FadeIn delay={350}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    <button onClick={() => scrollTo(formRef)} style={{ ...S.btn, background: C.warn, color: C.white }}>
                      Report This Person
                    </button>
                    <button onClick={() => scrollTo(evidenceRef)} style={{ ...S.btn, background: "transparent", color: C.textOnDark, border: `2px solid ${C.textOnDarkMuted}` }}>
                      See the Evidence
                    </button>
                    <button onClick={() => scrollTo(ledgerRef)} style={{ ...S.btn, background: "transparent", color: C.heal, border: `2px solid ${C.heal}` }}>
                      Path to Redemption
                    </button>
                  </div>
                </FadeIn>
                <FadeIn delay={400}>
                  <SubmissionCounter count={submissionCount} dark />
                </FadeIn>
              </div>
            </div>

            {/* ENDORSEMENT VERIFICATION BADGE */}
            <FadeIn delay={500}>
              <div style={{
                marginTop: "2rem", padding: "1.5rem 2rem",
                background: isVerified ? "rgba(45,138,86,0.12)" : "rgba(232,184,32,0.08)",
                border: `2px solid ${isVerified ? C.heal : C.saffron}`,
                display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: i < endorseCount ? (isVerified ? C.heal : C.saffron) : "rgba(240,234,224,0.1)",
                      border: `2px solid ${i < endorseCount ? (isVerified ? C.heal : C.saffron) : "rgba(240,234,224,0.2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", color: i < endorseCount ? "#fff" : C.textOnDarkSub,
                      transition: "all 0.3s",
                    }}>
                      {i < endorseCount ? "\u2713" : "\u25CB"}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.1rem", color: isVerified ? C.heal : C.saffron, marginBottom: "0.25rem" }}>
                    {isVerified ? `Community Verified — ${endorseCount} Testimonials Received` : `${endorseCount} of 3 Endorsements — ${3 - endorseCount} More Needed`}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: "0.95rem", color: C.textOnDarkMuted, lineHeight: 1.6 }}>
                    {isVerified
                      ? "Seven independent testimonials received from various channels. Community members have done Byron Katie's four questions on this report and endorsed it as true. This report was not published by one person acting alone."
                      : "This report requires 3 anonymous endorsements before it is considered community-verified. Endorsers don't need to be auditors — they just need to have done The Work, believe it's true, and ring the bell."}
                  </div>
                </div>
                {!isVerified && (
                  <button onClick={() => scrollTo(endorseRef)} style={{ ...S.btn, background: C.saffron, color: "#1A1A2E", fontWeight: 800, fontSize: "0.92rem", padding: "0.6rem 1.5rem", flexShrink: 0 }}>
                    Endorse This Report
                  </button>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={600}>
              <div style={{ marginTop: "2rem", padding: "2rem", background: "rgba(240,234,224,0.04)", border: `1px solid rgba(240,234,224,0.08)` }}>
                <p style={{ ...S.body, color: C.textOnDarkMuted, margin: 0 }}>
                  <strong style={{ color: C.textOnDark }}>Alex Azzi is the CEO of XRWorkout, a VR fitness startup, and the founder of Biohackers UAE.</strong> He is active in the biohacking, virtual reality fitness, and startup communities as an entrepreneur and conference speaker. This VerifiedTribe community protection report documents {SUBJECT.totalDocumented} in unpaid invoices and unfulfilled equity agreements spanning {SUBJECT.yearsOfPattern} years. Every claim is backed by signed contracts, invoices, emails, and timestamps. The subject has been given the opportunity to respond. This report exists to protect the next person and to offer a documented path to redemption.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={700}>
              <ShareBar dark cta="Know someone in this community? Share this report before their next handshake." />
            </FadeIn>
          </div>
        </section>

        <WarningStrip />

        {/* ═══════════════════════════════════════════════════════
           SECTION 2: THE SUNLIGHT PROTOCOL — "Before You Speak, Be Sure"
           ═══════════════════════════════════════════════════════ */}
        <section ref={protocolRef} style={{ ...S.section, background: C.pale, position: "relative", overflow: "hidden" }}>
          {/* Protocol cinematic image — now visible */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.2, transform: `translateY(${scrollY * 0.04}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.glassSunlight} alt="Sunlight through glass representing transparency in the Alex Azzi report" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.pale} 0%, transparent 30%, ${C.pale} 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            {/* Prominent section image */}
            <FadeIn>
              <div style={{
                marginBottom: "2.5rem", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 0 40px rgba(45,138,86,0.06)",
                maxHeight: 320, position: "relative",
              }}>
                <img src={IMG.glassSunlight} alt="Sunlight piercing through darkness — the SunlightProtocol" loading="lazy" sizes="(max-width: 768px) 100vw, 800px" style={{
                  width: "100%", height: "auto", display: "block", objectFit: "cover",
                  filter: "contrast(1.05)",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
                  background: `linear-gradient(transparent, ${C.pale})`,
                }} />
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div style={{ ...S.label, color: C.heal, marginBottom: "0.5rem" }}>The SunlightProtocol™</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>Before You Speak, Be Sure.</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 750 }}>
                Gossip destroys lives. Unverified claims ruin innocent people. But silence enables predators. This 8-step protocol is the ethical middle ground — the disciplined path between complicity and recklessness. Every report on this platform must pass through these gates. No exceptions.
              </p>
            </FadeIn>

            {/* Escalation Spectrum */}
            <FadeIn delay={100}>
              <div style={{ margin: "2rem 0", padding: "2rem", background: C.white, border: `2px solid rgba(26,26,46,0.1)` }}>
                <div style={{ ...S.label, color: C.crimson, marginBottom: "1rem" }}>The Escalation Spectrum — Why Silence Is Not an Option</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {ESCALATION_SPECTRUM.map((level, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
                      <div style={{
                        width: `${20 + i * 20}%`, minWidth: 120,
                        background: level.color, padding: "0.75rem 1rem",
                        display: "flex", alignItems: "center",
                      }}>
                        <span style={{ fontFamily: F.body, fontWeight: 800, fontSize: "1rem", color: C.white, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {level.level}
                        </span>
                      </div>
                      <div style={{ flex: 1, padding: "0.75rem 1rem", borderBottom: `1px solid rgba(26,26,46,0.08)` }}>
                        <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnLight, lineHeight: 1.6 }}>{level.description}</div>
                        <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.crimson, marginTop: "0.25rem" }}>{level.risk}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnLightMuted, marginTop: "1.5rem", lineHeight: 1.7, fontStyle: "italic" }}>
                  Bernie Madoff stole $65 billion over decades. Everyone suspected. Nobody verified. Nobody spoke. Romance scammers extracted $1.16 billion in just 9 months of 2025. The pattern is always the same: silence enables escalation. But the answer is never gossip — it&rsquo;s verified, documented, consequential truth.
                </div>
              </div>
            </FadeIn>

            {/* 8 Verification Steps */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginTop: "2rem" }}>
              {VERIFICATION_STEPS.map((step, i) => (
                <FadeIn key={i} delay={200 + i * 60}>
                  <div style={{
                    display: "flex", gap: "1.5rem", alignItems: "flex-start",
                    background: C.white, padding: "1.5rem 2rem",
                    borderLeft: `5px solid ${i < 2 ? C.saffron : i < 5 ? C.cobalt : i < 7 ? C.terracotta : C.heal}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{
                      fontFamily: F.display, fontWeight: 900, fontSize: "2rem",
                      color: i < 2 ? C.saffron : i < 5 ? C.cobalt : i < 7 ? C.terracotta : C.heal,
                      lineHeight: 1, flexShrink: 0, opacity: 0.6,
                    }}>
                      {String(step.num).padStart(2, "0")}
                    </div>
                    <div>
                      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.05rem", color: C.textOnLight, marginBottom: "0.4rem" }}>
                        {step.title}
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnLightMuted, lineHeight: 1.7 }}>
                        {step.text}
                      </div>
                      <div style={{ fontFamily: F.mono, fontSize: "0.8rem", color: C.cobalt, marginTop: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Gate: {step.gate}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Scam Resources */}
            <FadeIn delay={800}>
              <div style={{ marginTop: "2.5rem", padding: "2rem", background: C.white, border: `2px solid rgba(26,26,46,0.08)` }}>
                <div style={{ ...S.label, color: C.crimson, marginBottom: "1rem" }}>Official Reporting Channels — Use These First</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem" }}>
                  {SCAM_RESOURCES.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener" style={{
                      display: "block", padding: "1rem", border: `1px solid rgba(26,26,46,0.1)`,
                      textDecoration: "none", transition: "all 0.2s",
                    }}>
                      <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: "1rem", color: C.cobalt }}>{r.name}</div>
                      <div style={{ fontFamily: F.body, fontSize: "0.92rem", color: C.textOnLightMuted, marginTop: "0.25rem" }}>{r.description}</div>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            <ViralQuote text={VIRAL_QUOTES[2].text} tag={VIRAL_QUOTES[2].tag} />
            <DownloadChecklist />
            <ShareBar cta="Know a community leader? Send them this verification protocol." />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 3A: RED FLAGS
           ═══════════════════════════════════════════════════════ */}
        <section ref={redFlagsRef} style={{ ...S.section, background: C.sand, position: "relative", overflow: "hidden" }}>
          {/* Red Flags cinematic image */}
          <div style={{ position: "absolute", top: "-10%", right: 0, width: "55%", height: "75%", opacity: 0.25, transform: `translateY(${scrollY * 0.03}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.redFlags} alt="Red flags documented in the Alex Azzi business dispute timeline" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.sand} 0%, transparent 30%, transparent 70%, ${C.sand} 100%)` }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 0%, ${C.sand} 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.crimson, marginBottom: "0.5rem" }}>The Universal Lesson</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>8 Red Flags Every Community Should Memorize</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 700 }}>
                These patterns repeat across industries, geographies, and deal sizes. If you recognize even three of these in a single relationship, stop. Get everything in writing. And consider walking away.
              </p>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem", marginTop: "2rem" }}>
              {RED_FLAGS.map((rf, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div
                    style={{
                      background: C.white, padding: "1.5rem", borderLeft: `5px solid ${C.warn}`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", minHeight: 160,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.01)";
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.12), inset 0 0 0 1px ${C.warn}40`;
                      e.currentTarget.style.borderLeftWidth = "6px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                      e.currentTarget.style.borderLeftWidth = "5px";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <span style={{ background: C.warn, color: C.white, fontFamily: F.body, fontWeight: 800, fontSize: "0.8rem", padding: "0.2rem 0.5rem", letterSpacing: "0.08em" }}>RED FLAG #{i + 1}</span>
                    </div>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1rem", color: C.textOnLight, marginBottom: "0.6rem", lineHeight: 1.35 }}>{rf.flag}</div>
                    <div style={{ fontFamily: F.body, fontSize: "1.02rem", color: C.textOnLightMuted, lineHeight: 1.65 }}>
                      <strong style={{ color: C.crimson }}>The lesson:</strong> {rf.lesson}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <ViralQuote text={VIRAL_QUOTES[0].text} tag={VIRAL_QUOTES[0].tag} />
            <ShareBar cta="Know someone negotiating a deal right now? Send them these red flags." />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 3B: THE CASE STUDY — Profile + Personal Note
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.dark, position: "relative", overflow: "hidden" }}>
          {/* Case study background image */}
          <div style={{ position: "absolute", inset: "-15%", opacity: 0.1, transform: `translateY(${scrollY * 0.05}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.playbook} alt="The playbook pattern of repeated business disputes involving Alex Azzi" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.3) blur(2px)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.dark} 0%, transparent 30%, transparent 70%, ${C.dark} 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.saffron, marginBottom: "0.5rem" }}>Case Study #{SUBJECT.caseNumber.split("-").pop()}</div>
              <h2 style={{ ...S.h2, color: C.textOnDark }}>{SUBJECT.name}, {SUBJECT.title}</h2>
            </FadeIn>

            <FadeIn delay={150}>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start",
                background: "rgba(240,234,224,0.06)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                border: `1px solid rgba(240,234,224,0.12)`,
                borderRadius: "12px",
                padding: "2rem", marginBottom: "2.5rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(240,234,224,0.06)",
              }}>
                <div style={{ width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.warn}`, flexShrink: 0 }}>
                  <img src={SUBJECT.photo} alt={SUBJECT.name} sizes="(max-width: 640px) 100vw, 400px" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.3) contrast(1.1)" }} loading="lazy" />
                </div>
                <div style={{ flex: 1, minWidth: 250 }}>
                  <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "1.4rem", color: C.textOnDark }}>{SUBJECT.name}</div>
                  <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnDarkMuted, marginTop: "0.25rem" }}>{SUBJECT.title} &middot; {SUBJECT.aliases.join(" &middot; ")}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
                    {SUBJECT.tags.map((tag) => (
                      <span key={tag} style={{
                        fontFamily: F.mono, fontSize: "0.92rem", padding: "0.2rem 0.5rem",
                        background: tag === "Unpaid Invoices" ? "rgba(255,65,54,0.2)" : "rgba(240,234,224,0.08)",
                        color: tag === "Unpaid Invoices" ? C.warn : C.textOnDarkSub,
                        border: `1px solid ${tag === "Unpaid Invoices" ? "rgba(255,65,54,0.4)" : "rgba(240,234,224,0.1)"}`,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnDarkMuted, marginTop: "1rem", lineHeight: 1.7 }}>
                    This is a real person. This is a real debt. The documentation below is specific, timestamped, and legally defensible. We publish this not out of malice, but because communities run on trust — and trust requires accountability.
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Personal Note */}
            <FadeIn delay={300}>
              <div style={{ background: C.cobalt, padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: "-5%", top: "10%", width: "30%", opacity: 0.22, pointerEvents: "none" }}>
                  <img src={IMG.puppet} alt="Illustration of manipulation tactics in business dealings" sizes="(max-width: 640px) 100vw, 400px" style={{ width: "100%", filter: "grayscale(1)" }} loading="lazy" />
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ ...S.label, color: C.saffron, marginBottom: "1.5rem" }}>A Personal Note from Tony Greenberg</div>
                  <p style={{ ...S.body, color: C.textOnDark }}>
                    I don&#8217;t do this. In 25 years building RampRate, I have never published a warning like this for a $75,000 debt. I&#8217;ve eaten worse. I&#8217;ve absorbed uglier situations quietly. I give 90% of what I earn away.
                  </p>
                  <p style={{ ...S.body, color: C.textOnDark }}>
                    But I took Alex on because a kind, trusted friend introduced us. He begged. He pleaded. He had genuine potential and a genuinely cool product. My team believed in him. We worked. We delivered. We made introductions that opened real doors.
                  </p>
                  <p style={{ ...S.body, color: C.textOnDark }}>
                    And then he decided that $200,000 in his bank account was more important than honoring a signed contract with the people who helped put him on the map.
                  </p>
                  <p style={{ ...S.body, color: C.textOnDark }}>
                    This isn&#8217;t about the money anymore. This is about protecting the next person — the next kind friend, the next advisor, the next vendor — from the Cheshire Grin. Because the smile never stops. Even when he doesn&#8217;t respond to your emails. Even when he dodges your calls. The grin remains, floating in the air, long after he&#8217;s disappeared.
                  </p>
                  <p style={{ ...S.body, color: C.textOnDark, fontWeight: 700, fontSize: "clamp(1.05rem, 2.8vw, 1.2rem)" }}>
                    Shame on you, Alex. Not just to me — to your parents, to your community, to every person who invested their time, energy, and belief in you. Pay your bills. Say you&#8217;re sorry. Figure it out.
                  </p>
                </div>
              </div>
            </FadeIn>

            <ViralQuote text={VIRAL_QUOTES[1].text} tag={VIRAL_QUOTES[1].tag} dark />
            <ShareBar dark cta="Know someone working with this individual? Warn them now." />
          </div>
        </section>

        <WarningStrip />

        {/* ═══════════════════════════════════════════════════════
           SECTION 4: THE EVIDENCE
           ═══════════════════════════════════════════════════════ */}
        <section ref={evidenceRef} style={{ ...S.section, background: C.pale, position: "relative", overflow: "hidden" }}>
          {/* Evidence cinematic image */}
          <div style={{ position: "absolute", top: "-10%", left: 0, right: 0, height: "65%", opacity: 0.1, transform: `translateY(${scrollY * 0.04}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.evidence} alt="Evidence documentation for the Alex Azzi community protection report" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.5)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 0%, ${C.pale} 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.crimson, marginBottom: "0.5rem" }}>The Evidence</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>The Invoice Clock Is Running.</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 700 }}>
                California law gives written contract claims a 4-year window. These are the documented invoices. This is public information — not legal advice.
              </p>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
              {SOL_CARDS.map((c, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <div
                    style={{ border: `2px solid ${c.color}`, padding: "1.5rem", background: C.white, boxShadow: `0 2px 16px ${c.color}15`, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                      e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}30, 0 0 0 2px ${c.color}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = `0 2px 16px ${c.color}15`;
                    }}
                  >
                    <div style={{ ...S.label, color: c.color, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, display: "inline-block", boxShadow: `0 0 8px ${c.color}` }} />
                      {c.status}
                    </div>
                    <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "1.1rem", color: C.textOnLight, marginBottom: "0.5rem" }}>
                      {c.invoice} &middot; {c.date} &middot; {c.amount}
                    </div>
                    {(c as any).paid && (
                      <div style={{ fontFamily: F.mono, fontSize: "0.92rem", color: C.warn, marginBottom: "0.5rem", fontWeight: 700 }}>
                        Paid: {(c as any).paid} — the only money ever received
                      </div>
                    )}
                    <AnimatedBar pct={c.pct} color={c.color} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnLightMuted }}>
                      <span>Breach ~{c.breachDate}</span>
                      <span>SOL Closes ~{c.solClose}</span>
                    </div>
                    <div style={{ marginTop: "0.75rem", fontFamily: F.body, fontSize: "1.08rem", color: C.textOnLightMuted, fontWeight: 500 }}>{c.note}</div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Total owed */}
            <FadeIn delay={500}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, background: C.dark, marginTop: "2.5rem" }}>
                {[
                  { val: "$15K", label: "Total Ever Paid", sub: "One partial payment on Invoice #1 — once, ever" },
                  { val: "$75K+", label: "Documented Cash Owed", sub: "Across 3 invoices (March 2022, Jan 2023, Dec 2024)" },
                  { val: "~$137K", label: "True Figure with Interest", sub: "Per signed contract at 1.5%/month" },
                  { val: "3–5%", label: "Equity Never Transferred", sub: "Per signed SOW + Change Order" },
                ].map((d, i) => (
                  <div key={i} style={{ padding: "1.5rem", textAlign: "center", background: C.dark }}>
                    <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: C.warn }}>{d.val}</div>
                    <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: "0.92rem", color: C.textOnDark, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.3rem" }}>{d.label}</div>
                    <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnDarkSub, marginTop: "0.25rem" }}>{d.sub}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Vault image */}
            <FadeIn delay={600}>
              <div style={{ margin: "2.5rem 0 0", position: "relative" }}>
                <img src={IMG.vault} alt="The empty vault" sizes="(max-width: 640px) 100vw, 600px" style={{ width: "100%", display: "block" }} loading="lazy" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(12,12,24,0.9) 100%)", display: "flex", alignItems: "flex-end", padding: "2rem" }}>
                  <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnDark, fontStyle: "italic", maxWidth: 500 }}>
                    $200,000 in the bank. $50,000 owed. The vault was never empty — the intention was.
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Smoking Gun */}
            <FadeIn delay={700}>
              <div style={{ border: `3px solid ${C.warn}`, padding: "2rem 2.5rem", marginTop: "2.5rem", background: C.white, position: "relative" }}>
                <div style={{ ...S.label, color: C.warn, marginBottom: "1rem", fontSize: "0.92rem" }}>SMOKING GUN</div>
                <blockquote style={{
                  fontFamily: F.display, fontWeight: 700, fontSize: "clamp(1.05rem, 2.8vw, 1.35rem)",
                  lineHeight: 1.6, color: C.textOnLight, margin: 0, padding: 0,
                  borderLeft: `4px solid ${C.warn}`, paddingLeft: "1.25rem",
                }}>
                  &#8220;In short, they have $200K in the bank, so he&#8217;s not paying us $50K up front, but he left the door open to a $10K/month minimum effort engagement — mostly to get back in Tony&#8217;s good graces.&#8221;
                </blockquote>
                <div style={{ fontFamily: F.mono, fontSize: "1.02rem", color: C.textOnLightMuted, marginTop: "1rem" }}>
                  Source: Internal RampRate CSO Update &middot; July 2023 &middot; Following direct call with {SUBJECT.name}
                </div>
              </div>
            </FadeIn>

            <ViralQuote text={VIRAL_QUOTES[4].text} tag={VIRAL_QUOTES[4].tag} />
            <ShareBar cta="Forward this evidence to anyone considering working with this individual." />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 4B: TIMELINE
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.sand }}>
          <div style={S.container}>
            <FadeIn>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>A {SUBJECT.yearsOfPattern}-Year Paper Trail of Broken Promises</h2>
            </FadeIn>
            <div style={{ position: "relative", paddingLeft: "2.5rem" }}>
              <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${C.terracotta}, ${C.warn})` }} />
              {TIMELINE.map((t, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div style={{ position: "relative", marginBottom: "2rem", paddingBottom: "0.5rem" }}>
                    <div style={{
                      position: "absolute", left: "-2.5rem", top: 6, width: 20, height: 20, borderRadius: "50%",
                      background: i === TIMELINE.length - 1 ? C.warn : C.sand,
                      border: `3px solid ${i === TIMELINE.length - 1 ? C.warn : C.terracotta}`,
                      zIndex: 1, boxShadow: i === TIMELINE.length - 1 ? `0 0 12px ${C.warn}` : "none",
                    }} />
                    <div style={{ ...S.label, color: C.crimson, marginBottom: "0.3rem" }}>{t.date}</div>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.1rem", color: C.textOnLight, marginBottom: "0.4rem" }}>{t.title}</div>
                    <div style={{ fontFamily: F.body, fontSize: "0.92rem", color: C.textOnLightMuted, lineHeight: 1.7 }}>{t.text}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <ShareBar cta="Share this timeline with your network. Patterns repeat." />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 4C: EVIDENCE TABLE
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.pale }}>
          <div style={S.container}>
            <FadeIn><h2 style={{ ...S.h2, color: C.textOnLight }}>What the Documents Prove</h2></FadeIn>
            <FadeIn delay={200}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.body, fontSize: "1.02rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `3px solid ${C.textOnLight}` }}>
                      {["Claim", "Source", "Strength"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.textOnLight }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EVIDENCE_ROWS.map((r, i) => {
                      const badgeColor = r.strength === "IRONCLAD" ? C.cobalt : r.strength === "STRONG" ? C.saffron : C.terracotta;
                      const badgeText = r.strength === "IRONCLAD" ? "#FFFFFF" : r.strength === "STRONG" ? "#1A1A2E" : "#FFFFFF";
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid rgba(26,26,46,0.1)` }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 500, color: C.textOnLight }}>{r.claim}</td>
                          <td style={{ padding: "0.75rem 1rem", color: C.textOnLightMuted, fontFamily: F.mono, fontSize: "0.8rem" }}>{r.source}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span style={{ background: badgeColor, color: badgeText, padding: "0.2rem 0.6rem", fontFamily: F.body, fontWeight: 700, fontSize: "0.92rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{r.strength}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 5: THE PLAYBOOK
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.dark, position: "relative", overflow: "hidden" }}>
          {/* Playbook cinematic image */}
          <div style={{ position: "absolute", inset: "-15%", opacity: 0.3, transform: `translateY(${scrollY * 0.04}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.playbook} alt="Recurring pattern analysis in Alex Azzi business disputes" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.4)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.dark} 0%, transparent 30%, transparent 70%, ${C.dark} 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.warn, marginBottom: "0.75rem" }}>The Playbook</div>
              <h2 style={{ ...S.h2, color: C.textOnDark }}>This Is Not an Accident.<br />It Is a Strategy.</h2>
              <p style={{ ...S.body, color: C.textOnDarkMuted, maxWidth: 700 }}>
                Across multiple engagements, the same six-step pattern emerges. This is not incompetence. It is a playbook. Learn it. Recognize it. Protect yourself.
              </p>
            </FadeIn>

            <FadeIn delay={100}>
              <div style={{ margin: "2rem 0", position: "relative" }}>
                <img src={IMG.vanish} alt="The vanishing act" sizes="(max-width: 640px) 100vw, 600px" style={{ width: "100%", display: "block", opacity: 0.8 }} loading="lazy" />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg, rgba(12,12,24,0.92) 0%, transparent 65%)",
                  display: "flex", alignItems: "center", padding: "clamp(1rem, 3vw, 3rem)",
                }}>
                  <div>
                    <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)", color: C.textOnDark, lineHeight: 1.2, marginBottom: "0.75rem" }}>
                      The Empty Chair.<br />The Dissolving Card.
                    </div>
                    <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnDarkMuted, fontStyle: "italic", maxWidth: 400, lineHeight: 1.65 }}>
                      He was here. The meeting happened. The handshake was real. But when the invoice arrives, the chair is empty and the business card turns to smoke.
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "1rem" }}>
              {STEPS.map((s, i) => (
                <FadeIn key={i} delay={200 + i * 100}>
                  <div
                    style={{
                      background: "rgba(240,234,224,0.06)", border: `1px solid rgba(240,234,224,0.12)`,
                      padding: "1.5rem", position: "relative", overflow: "hidden",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(232,184,32,0.15), 0 0 0 1px rgba(232,184,32,0.3)";
                      e.currentTarget.style.background = "rgba(240,234,224,0.1)";
                      e.currentTarget.style.borderColor = "rgba(232,184,32,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "rgba(240,234,224,0.06)";
                      e.currentTarget.style.borderColor = "rgba(240,234,224,0.12)";
                    }}
                  >
                    <div style={{ position: "absolute", top: "0.75rem", right: "1rem", fontSize: "2rem", opacity: 0.25 }}>{s.icon}</div>
                    <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "2.5rem", color: C.stepNum, lineHeight: 1, marginBottom: "0.5rem" }}>
                      {String(s.num).padStart(2, "0")}
                    </div>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.1rem", color: C.textOnDark, marginBottom: "0.5rem" }}>{s.title}</div>
                    <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnDarkMuted, lineHeight: 1.7 }}>{s.text}</div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={800}>
              <div style={{ marginTop: "2.5rem", padding: "1.5rem 2rem", borderLeft: `4px solid ${C.saffron}`, background: "rgba(232,184,32,0.08)" }}>
                <blockquote style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", lineHeight: 1.7, color: C.textOnDark, margin: 0 }}>
                  &#8220;This is not a collections dispute. This is a documented pattern of behavior in which a founder uses charm, vision, and startup language to extract services — and then treats the invoice as optional.&#8221;
                </blockquote>
                <div style={{ fontFamily: F.mono, fontSize: "1.02rem", color: C.textOnDarkSub, marginTop: "0.75rem" }}>— Collections Counsel Assessment, 2024</div>
              </div>
            </FadeIn>

            <ViralQuote text={VIRAL_QUOTES[3].text} tag={VIRAL_QUOTES[3].tag} dark />
            <ShareBar dark cta="Send this playbook to every community leader in your network." />
          </div>
        </section>

        <WarningStrip />

        {/* ═══════════════════════════════════════════════════════
           SECTION 5B: WHERE IN THE WORLD
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.sand }}>
          <div style={S.container}>
            <FadeIn>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>Where in the World Is {SUBJECT.name}?</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 700 }}>
                He moves. He networks. He speaks at conferences. He shakes hands. If you see him at any of these events, now you know what questions to ask — and to get the answers in writing.
              </p>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
              {MAP_PINS.map((p, i) => {
                const dotColor = p.type === "major" ? C.terracotta : C.saffron;
                return (
                  <FadeIn key={i} delay={i * 50}>
                    <div style={{ background: C.white, padding: "1.25rem", borderLeft: `4px solid ${dotColor}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, display: "inline-block", boxShadow: `0 0 6px ${dotColor}` }} />
                        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.08rem", color: C.textOnLight }}>{p.city}</span>
                      </div>
                      <div style={{ ...S.label, color: dotColor, marginBottom: "0.4rem", fontSize: "0.92rem" }}>{p.event}</div>
                      <div style={{ fontFamily: F.body, fontSize: "1.08rem", color: C.textOnLightMuted, lineHeight: 1.6 }}>{p.detail}</div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
            <ShareBar cta="Attending any of these events? Share this page with other attendees." />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 6: GENERAL LEDGER OF RETRIBUTION
           ═══════════════════════════════════════════════════════ */}
        <section ref={ledgerRef} style={{ ...S.section, background: `linear-gradient(175deg, ${C.dark} 0%, #0A1A0A 100%)`, position: "relative", overflow: "hidden" }}>
          {/* Ledger cinematic image */}
          <div style={{ position: "absolute", inset: "-15%", opacity: 0.28, transform: `translateY(${scrollY * 0.04}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.ledger} alt="Financial ledger documenting unpaid invoices from Alex Azzi" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.4) contrast(1.1)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.dark} 0%, transparent 40%, transparent 60%, #0A1A0A 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.heal, marginBottom: "0.5rem" }}>The General Ledger of Retribution</div>
              <h2 style={{ ...S.h2, color: C.textOnDark }}>{RETRIBUTION_LEDGER.title}</h2>
              <p style={{ ...S.body, color: C.textOnDarkMuted, maxWidth: 750 }}>
                {RETRIBUTION_LEDGER.subtitle} Every condition below is public. Complete them all — verified by an independent third party — and this report comes down. That&rsquo;s the deal. Apologies without action are worthless. <a href="/blog/apologize" style={{ color: C.saffron, textDecoration: "underline" }}>Read why.</a>
              </p>
            </FadeIn>

            {RETRIBUTION_LEDGER.categories.map((cat, ci) => (
              <FadeIn key={cat.id} delay={150 + ci * 100}>
                <div style={{
                  marginTop: "2rem", padding: "2rem",
                  background: "rgba(240,234,224,0.04)",
                  border: `1px solid ${cat.id === "healing" ? C.heal : "rgba(240,234,224,0.1)"}`,
                  borderLeft: `5px solid ${cat.id === "financial" ? C.warn : cat.id === "healing" ? C.heal : C.saffron}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.2rem", color: C.textOnDark }}>{cat.name}</div>
                      <div style={{ fontFamily: F.body, fontSize: "1.08rem", color: C.textOnDarkMuted, lineHeight: 1.6 }}>{cat.description}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {cat.items.map((item, ii) => (
                      <div key={ii} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "0.75rem 1rem", background: "rgba(240,234,224,0.04)",
                        border: `1px solid rgba(240,234,224,0.06)`, flexWrap: "wrap", gap: "0.5rem",
                      }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontFamily: F.body, fontSize: "1.02rem", color: C.textOnDark }}>{item.label}</div>
                          <div style={{ fontFamily: F.mono, fontSize: "1rem", color: C.saffron, marginTop: "0.2rem" }}>{item.value}</div>
                        </div>
                        <span style={{
                          fontFamily: F.body, fontWeight: 700, fontSize: "0.92rem",
                          padding: "0.2rem 0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
                          background: item.status === "partial" ? "rgba(232,184,32,0.15)" : "rgba(255,65,54,0.15)",
                          color: item.status === "partial" ? C.saffron : C.warn,
                          border: `1px solid ${item.status === "partial" ? "rgba(232,184,32,0.3)" : "rgba(255,65,54,0.3)"}`,
                        }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  {cat.blogLink && (
                    <a href={cat.blogLink.href} style={{
                      display: "inline-block", marginTop: "1rem",
                      fontFamily: F.body, fontSize: "1.08rem", color: C.saffron,
                      textDecoration: "underline",
                    }}>
                      {cat.blogLink.text}
                    </a>
                  )}
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={900}>
              <div style={{
                marginTop: "2.5rem", padding: "2rem", textAlign: "center",
                border: `2px solid ${C.heal}`, background: C.healLight,
              }}>
                <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "clamp(1.3rem, 3.5vw, 1.7rem)", color: C.textOnDark, marginBottom: "0.75rem" }}>
                  The Path Back Exists.
                </div>
                <p style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnDarkMuted, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                  {RETRIBUTION_LEDGER.removalConditions}
                </p>
              </div>
            </FadeIn>

            <ViralQuote text={VIRAL_QUOTES[5].text} tag={VIRAL_QUOTES[5].tag} dark />
            <ShareBar dark cta="Share this framework. Every community deserves a path to accountability AND redemption." />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 7: COMMUNITY EVIDENCE COLLECTION + FORM
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.pale, position: "relative", overflow: "hidden" }}>
          {/* Community cinematic image */}
          <div style={{ position: "absolute", top: "-10%", left: 0, right: 0, height: "60%", opacity: 0.1, transform: `translateY(${scrollY * 0.03}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.community} alt="Community protection and verified tribe accountability" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.5)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 0%, ${C.pale} 100%)` }} />
          </div>
          <div style={{ ...S.container, position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.crimson, marginBottom: "0.5rem" }}>Community Evidence Collection</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>Has This Happened to You?</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 700 }}>
                We are not conducting a smear campaign. We are building a community evidence database. If you recognize this pattern from your own experience with {SUBJECT.name}, your story strengthens the record and protects the next person.
              </p>
            </FadeIn>

            <FadeIn delay={150}>
              <div style={{ background: C.white, border: `3px solid ${C.warn}`, padding: "2rem 2.5rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(255,65,54,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ color: C.saffron, fontSize: "1.2rem" }}>{"\u2605"}</span>
                  <span style={{ ...S.label, color: C.warn }}>Featured Question</span>
                </div>
                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.55, color: C.textOnLight }}>{FEATURED_Q}</div>
              </div>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {QUESTIONS_10.map((q, i) => (
                <FadeIn key={i} delay={200 + i * 60}>
                  <div style={{
                    background: C.white, padding: "1.25rem 1.5rem",
                    borderLeft: `4px solid ${C.warn}`, minHeight: 100,
                    display: "flex", alignItems: "flex-start", gap: "0.75rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "1.8rem", color: C.terracotta, flexShrink: 0, lineHeight: 1, opacity: 0.5 }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnLightMuted, lineHeight: 1.65 }}>{q}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 7B: SUBMISSION FORM (with Byron Katie Gate)
           ═══════════════════════════════════════════════════════ */}
        <section ref={formRef} style={{ ...S.section, background: C.dark }}>
          <div style={{ ...S.container, maxWidth: 720 }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.saffron, marginBottom: "0.5rem" }}>Add to the Record</div>
              <h3 style={{ ...S.h3, color: C.textOnDark }}>Share Your Experience — With Integrity</h3>
              <p style={{ ...S.body, color: C.textOnDarkMuted, maxWidth: 600 }}>
                Before you submit, you will pass through Byron Katie&rsquo;s Four Questions — a verification gate that ensures your report comes from truth, not revenge. Every submission strengthens the evidentiary record and protects the next person. Your identity is never published without explicit written consent.
              </p>
              <SubmissionCounter count={submissionCount} dark />
            </FadeIn>

            {formSubmitted ? (
              <FadeIn>
                <div style={{ background: "rgba(240,234,224,0.08)", border: `2px solid ${C.heal}`, padding: "2.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{"\u2713"}</div>
                  <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.3rem", color: C.textOnDark, marginBottom: "0.75rem" }}>Submission Received</div>
                  <p style={{ fontFamily: F.body, color: C.textOnDarkMuted, lineHeight: 1.7 }}>
                    Your story has been securely recorded. Thank you for helping protect the community.
                  </p>
                  <ShareBar dark cta="Now share this page so others can add their stories too." />
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={200}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                  {/* Byron Katie badge */}
                  {byronKatiePassed && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: C.healLight, border: `1px solid ${C.heal}` }}>
                      <span style={{ color: C.heal, fontSize: "1.2rem" }}>{"\u2713"}</span>
                      <span style={{ fontFamily: F.body, fontSize: "1.08rem", color: C.heal, fontWeight: 600 }}>Byron Katie Verification Gate — Passed</span>
                    </div>
                  )}

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>Your relationship to {SUBJECT.name} *</label>
                    <select value={formData.relationship} onChange={(e) => setFormData({ ...formData, relationship: e.target.value })} style={selectStyle}>
                      <option value="">Select one...</option>
                      {RELATIONSHIP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>City / country of interaction</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Dubai, UAE" style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>Approximate dates (year range)</label>
                    <input type="text" value={formData.dateRange} onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })} placeholder="e.g. 2022–2024" style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>What was promised vs. what was delivered? *</label>
                    <textarea value={formData.promisedVsDelivered} onChange={(e) => setFormData({ ...formData, promisedVsDelivered: e.target.value })} placeholder="Describe what happened — the more specific, the stronger the record. Minimum 50 characters." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>Did you receive payment? *</label>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {(["yes", "partial", "no"] as const).map((v) => (
                        <button key={v} type="button" onClick={() => setFormData({ ...formData, receivedPayment: v })} style={{
                          ...S.btn, fontSize: "1.02rem", padding: "0.5rem 1rem",
                          background: formData.receivedPayment === v ? C.warn : "transparent",
                          color: formData.receivedPayment === v ? C.white : C.textOnDarkMuted,
                          border: `1.5px solid ${formData.receivedPayment === v ? C.warn : "rgba(240,234,224,0.3)"}`,
                        }}>
                          {v === "yes" ? "Yes" : v === "partial" ? "Partial" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>Approximate amount owed</label>
                    <select value={formData.amountOwed} onChange={(e) => setFormData({ ...formData, amountOwed: e.target.value })} style={selectStyle}>
                      <option value="">Select range...</option>
                      {AMOUNT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>Do you have documentation?</label>
                    <select value={formData.hasDocumentation} onChange={(e) => setFormData({ ...formData, hasDocumentation: e.target.value })} style={selectStyle}>
                      <option value="">Select...</option>
                      {DOC_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <input type="checkbox" checked={formData.willingToContact} onChange={(e) => setFormData({ ...formData, willingToContact: e.target.checked })} style={{ width: 18, height: 18, accentColor: C.saffron }} />
                    <label style={{ fontFamily: F.body, fontSize: "1.02rem", color: C.textOnDarkMuted }}>
                      I am willing to be contacted confidentially
                    </label>
                  </div>

                  {formData.willingToContact && (
                    <div>
                      <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>Confidential contact email</label>
                      <input type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="Never published without consent" style={inputStyle} />
                    </div>
                  )}

                  <div>
                    <label style={{ ...S.label, color: C.textOnDarkSub, display: "block", marginBottom: "0.4rem" }}>How did you find this page?</label>
                    <input type="text" value={formData.howHeard} onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })} placeholder="e.g. LinkedIn, friend, Google search" style={inputStyle} />
                  </div>

                  {/* Words Have Consequences — Responsibility Checkbox */}
                  <div style={{
                    padding: "1.25rem", background: "rgba(255,65,54,0.08)",
                    border: `1.5px solid rgba(255,65,54,0.25)`,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <input type="checkbox" checked={consequencesAccepted} onChange={(e) => setConsequencesAccepted(e.target.checked)} style={{ width: 18, height: 18, accentColor: C.warn, marginTop: 3, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: "1.02rem", color: C.warn, marginBottom: "0.3rem" }}>
                          Words Have Consequences
                        </div>
                        <div style={{ fontFamily: F.body, fontSize: "1.08rem", color: C.textOnDarkMuted, lineHeight: 1.65 }}>
                          I understand that my submission may be used as part of a VerifiedTribe community protection record, subject to the SunlightProtocol verification standards. I affirm that the information I provide is truthful and based on my direct experience. I accept responsibility for the accuracy of my statements and understand that false claims harm innocent people and undermine the integrity of this community.
                        </div>
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <div style={{ padding: "0.75rem 1rem", background: "rgba(255,65,54,0.15)", border: `1px solid ${C.warn}`, fontFamily: F.body, fontSize: "1rem", color: C.warn }}>
                      {formError}
                    </div>
                  )}

                  <button type="submit" disabled={submitMutation.isPending} style={{
                    ...S.btn, width: "100%", justifyContent: "center",
                    background: byronKatiePassed && consequencesAccepted ? C.warn : "rgba(255,65,54,0.3)",
                    color: C.white, fontSize: "1.02rem", padding: "1rem",
                    opacity: submitMutation.isPending ? 0.6 : 1,
                  }}>
                    {submitMutation.isPending ? "Submitting..." : !byronKatiePassed ? "Complete Verification Gate First" : "Submit Community Evidence"}
                  </button>

                  <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnDarkSub, textAlign: "center", lineHeight: 1.6 }}>
                    Your identity is never published without explicit written consent. All submissions are reviewed for factual accuracy before being added to the community record.
                  </div>
                </form>
              </FadeIn>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 8: HEALING FRAMEWORK
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: `linear-gradient(175deg, #0A1A0A 0%, ${C.dark} 100%)`, position: "relative", overflow: "hidden" }}>
          {/* Healing cinematic image */}
          <div style={{ position: "absolute", inset: "-15%", opacity: 0.3, transform: `translateY(${scrollY * 0.04}px)`, transition: "transform 0.1s linear" }}>
            <img src={IMG.healing} alt="Path to resolution and healing in community accountability" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.5) contrast(1.1)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #0A1A0A 0%, transparent 30%, transparent 70%, ${C.dark} 100%)` }} />
          </div>
          <div style={{ ...S.container, maxWidth: 800, textAlign: "center", position: "relative" }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.heal, marginBottom: "0.5rem", letterSpacing: "0.2em" }}>The Deeper Purpose</div>
              <h2 style={{ ...S.h2, color: C.textOnDark }}>Protect Others. Heal Our Community. Become Who We Want to Become.</h2>
              <p style={{ ...S.body, color: C.textOnDarkMuted, maxWidth: 650, margin: "0 auto 2rem" }}>
                This is not just about one person or one debt. This is about the kind of community we choose to build in a time of massive transformation — when we don&rsquo;t know what the outcome of the human race is, but we know that integrity, accountability, and collective protection are non-negotiable foundations.
              </p>
            </FadeIn>

            <FadeIn delay={200}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
                {[
                  { icon: "\uD83D\uDEE1\uFE0F", title: "Protect", text: "Judiciously, slowly, legally. Not with gossip — with verified, documented truth. The ethical way to ensure the next person doesn't learn the hard way." },
                  { icon: "\uD83C\uDF31", title: "Heal", text: "Healing ourselves. Healing those who were wronged. And offering a path to healing for those who caused the harm — because reparation is not just punishment, it's transformation." },
                  { icon: "\u2728", title: "Become", text: "In this massive transformational time, the communities that survive are the ones that hold each other accountable with love, not rage. With facts, not feelings. With conviction, not cruelty." },
                ].map((p, i) => (
                  <div key={i} style={{ padding: "1.5rem", background: "rgba(45,138,86,0.08)", border: `1px solid rgba(45,138,86,0.2)` }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{p.icon}</div>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.2rem", color: C.heal, marginBottom: "0.5rem" }}>{p.title}</div>
                    <div style={{ fontFamily: F.body, fontSize: "1.02rem", color: C.textOnDarkMuted, lineHeight: 1.7 }}>{p.text}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 8B: BYRON KATIE'S 4 QUESTIONS — Applied to Alex Azzi
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.sand }}>
          <div style={{ ...S.container, maxWidth: 850 }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.cobalt, marginBottom: "0.5rem", letterSpacing: "0.2em" }}>The Work of Byron Katie — Applied</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>Doing The Work on Alex Azzi</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 700 }}>
                Before anyone endorses, submits, or shares this report, they must do <a href="https://thework.com" target="_blank" rel="noopener" style={{ color: C.cobalt, textDecoration: "underline", fontWeight: 600 }}>The Work</a>. These are Byron Katie's four questions — applied directly to this case. This is what doing The Work looks like in practice.
              </p>
            </FadeIn>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2rem" }}>
              {[
                {
                  num: "01",
                  q: "Is it true that Alex Azzi defrauded people?",
                  work: "Yes. There are signed contracts for services rendered. There are invoices totaling $137,000+. There are emails acknowledging the debt. There are equity agreements never executed. This is not a feeling — it is documented across 6 years, multiple companies, and multiple victims.",
                  color: C.cobalt,
                },
                {
                  num: "02",
                  q: "Can you absolutely know that it's true?",
                  work: "Yes. The contracts are signed. The invoices are timestamped. The emails are archived. The equity was never transferred. The pattern is consistent across XRWorkout, Biohackers UAE, and related entities. This meets the SunlightProtocol's 8-step evidentiary standard. Every claim on this page has a paper trail.",
                  color: C.saffron,
                },
                {
                  num: "03",
                  q: "How do you react when you believe that Alex Azzi is a fraud?",
                  work: "Anger. Frustration. A desire for justice. But also — a recognition that anger alone doesn't protect anyone. The question is whether this energy is directed toward revenge or toward community protection. If it's revenge, stop. If it's protection — the desire to ensure the next person doesn't get the same handshake and the same empty chair — proceed with discipline.",
                  color: C.terracotta,
                },
                {
                  num: "04",
                  q: "Who would you be without the thought that Alex Azzi wronged you?",
                  work: "Free. But freedom doesn't mean silence. Without this thought, you might not feel the urgency — but you'd still see the pattern. You'd still see the next person walking into the same room. The question isn't whether to act. It's whether your action comes from a clean place. If you can act without rage, without vendetta, with only the intention to protect — that's The Work done right.",
                  color: C.heal,
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={100 + i * 100}>
                  <div style={{
                    background: C.white, padding: "2rem",
                    borderLeft: `5px solid ${item.color}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                      <div style={{
                        fontFamily: F.display, fontWeight: 900, fontSize: "2.5rem",
                        color: item.color, lineHeight: 1, flexShrink: 0, opacity: 0.5,
                      }}>
                        {item.num}
                      </div>
                      <div>
                        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.15rem", color: C.textOnLight, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                          {item.q}
                        </div>
                        <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnLightMuted, lineHeight: 1.75 }}>
                          {item.work}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={600}>
              <div style={{ marginTop: "2rem", padding: "1.5rem 2rem", background: C.white, border: `2px solid rgba(26,26,46,0.08)` }}>
                <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnLightMuted, lineHeight: 1.7 }}>
                  <strong style={{ color: C.textOnLight }}>This is what doing The Work looks like.</strong> Not as a theoretical exercise — but applied to a real case, with real evidence, about a real person. If you've done this inquiry honestly and you believe this report is true and should exist, you can endorse it below. Your name is never published. You are simply ringing the bell — confirming that this wasn't one person acting alone.
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 8C: ENDORSEMENT FORM — Ring the Bell
           ═══════════════════════════════════════════════════════ */}
        <section ref={endorseRef as any} style={{ ...S.section, background: C.dark }}>
          <div style={{ ...S.container, maxWidth: 720 }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.saffron, marginBottom: "0.5rem" }}>Community Verification</div>
              <h3 style={{ ...S.h3, color: C.textOnDark }}>Endorse This Report — Ring the Bell</h3>
              <p style={{ ...S.body, color: C.textOnDarkMuted, maxWidth: 600 }}>
                You don't have to be an auditor. You don't have to put your name on it. You just have to have done The Work — asked yourself Byron Katie's four questions about this report — and believe it's true and should be public. Three endorsements are required — this report has received seven. No one publishes alone.
              </p>

              {/* Endorsement status */}
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem",
                padding: "1rem 1.5rem",
                background: isVerified ? "rgba(45,138,86,0.12)" : "rgba(232,184,32,0.08)",
                border: `1.5px solid ${isVerified ? C.heal : C.saffron}`,
              }}>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: i < endorseCount ? (isVerified ? C.heal : C.saffron) : "rgba(240,234,224,0.1)",
                      border: `2px solid ${i < endorseCount ? (isVerified ? C.heal : C.saffron) : "rgba(240,234,224,0.2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", color: i < endorseCount ? "#fff" : C.textOnDarkSub,
                    }}>
                      {i < endorseCount ? "\u2713" : "\u25CB"}
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: F.body, fontSize: "1rem", color: isVerified ? C.heal : C.saffron, fontWeight: 600 }}>
                  {isVerified ? `Verified — ${endorseCount} testimonials received` : `${endorseCount} of 3 endorsements received`}
                </div>
              </div>
            </FadeIn>

            {isVerified ? (
              <FadeIn>
                <div style={{ padding: "2rem", background: "rgba(45,138,86,0.08)", border: `2px solid ${C.heal}`, textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>\u2713</div>
                  <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.3rem", color: C.heal, marginBottom: "0.75rem" }}>Community Verified</div>
                  <p style={{ fontFamily: F.body, color: C.textOnDarkMuted, lineHeight: 1.7 }}>
                    Seven independent testimonials received from various channels. Community members have done The Work on this report, believe it is true, and have endorsed its publication. This report was not published by one person acting alone.
                  </p>
                </div>
              </FadeIn>
            ) : showEndorseForm ? (
              <EndorsementForm
                reportSlug={SUBJECT.slug}
                onSuccess={() => { setShowEndorseForm(false); refetchEndorsements(); }}
                onCancel={() => setShowEndorseForm(false)}
              />
            ) : (
              <FadeIn>
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => setShowEndorseForm(true)} style={{
                    ...S.btn, background: C.saffron, color: "#1A1A2E", fontWeight: 800,
                    fontSize: "1.05rem", padding: "1rem 2.5rem",
                  }}>
                    I've Done The Work — Endorse This Report
                  </button>
                  <div style={{ fontFamily: F.mono, fontSize: "0.85rem", color: C.textOnDarkSub, marginTop: "1rem", lineHeight: 1.6 }}>
                    Anonymous. No name required. You are simply confirming that you've asked yourself the four questions and believe this report is true.
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </section>

            {/* ═══════════════════════════════════════════════════
           SECTION 8D: SEO — About Alex Azzi, XRWorkout, Biohackers UAE, FAQ
           ═══════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.pale }}>
          <div style={{ ...S.container, maxWidth: 850 }}>
            {/* About Alex Azzi */}
            <FadeIn>
              <div style={{ ...S.label, color: C.cobalt, marginBottom: "0.5rem", letterSpacing: "0.2em" }}>About</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>Who Is Alex Azzi?</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 750 }}>
                Alex Azzi is an entrepreneur based in the United Arab Emirates who operates at the intersection of VR fitness, biohacking, and the startup ecosystem. He is the CEO of XRWorkout and the founder of Biohackers UAE. He has appeared as a speaker at technology and startup conferences across the Middle East and Europe.
              </p>
            </FadeIn>

            {/* Key Facts */}
            <FadeIn delay={100}>
              <div style={{ marginTop: "2rem", padding: "2rem", background: C.white, border: `1px solid rgba(26,26,46,0.1)` }}>
                <div style={{ ...S.label, color: C.cobalt, marginBottom: "1rem" }}>Key Facts</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                  {[
                    { label: "Full Name", value: "Alex Azzi" },
                    { label: "Role", value: "CEO, XRWorkout" },
                    { label: "Founded", value: "Biohackers UAE" },
                    { label: "Industry", value: "VR Fitness, Biohacking" },
                    { label: "Region", value: "UAE / Middle East" },
                    { label: "Known For", value: "Startup speaker, biohacking advocate" },
                  ].map((fact, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "rgba(30,58,95,0.04)", borderLeft: `3px solid ${C.cobalt}` }}>
                      <div style={{ fontFamily: F.mono, fontSize: "0.85rem", color: C.textOnLightMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{fact.label}</div>
                      <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnLight, fontWeight: 600 }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* XRWorkout */}
            <FadeIn delay={200}>
              <div style={{ marginTop: "2.5rem" }}>
                <h2 style={{ ...S.h2, color: C.textOnLight, fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>XRWorkout — VR Fitness Company</h2>
                <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 750 }}>
                  XRWorkout is a VR fitness company led by Alex Azzi that develops immersive virtual reality workout experiences. The company positions itself at the intersection of gaming and physical fitness, using XR technology to make exercise more engaging. Alex Azzi serves as CEO and has represented the company at industry events and pitch competitions.
                </p>
              </div>
            </FadeIn>

            {/* Biohackers UAE */}
            <FadeIn delay={300}>
              <div style={{ marginTop: "2.5rem" }}>
                <h2 style={{ ...S.h2, color: C.textOnLight, fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>Biohackers UAE</h2>
                <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 750 }}>
                  Biohackers UAE is a biohacking community and organization founded by Alex Azzi, focused on health optimization, longevity, and biohacking practices in the United Arab Emirates. The organization hosts events and connects biohacking enthusiasts across the region. It operates under the brand Biohack.ae.
                </p>
              </div>
            </FadeIn>

            {/* Industry Role */}
            <FadeIn delay={400}>
              <div style={{ marginTop: "2.5rem" }}>
                <h2 style={{ ...S.h2, color: C.textOnLight, fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>Industry Role — Startup Speaker and Entrepreneur</h2>
                <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 750 }}>
                  Alex Azzi is known in the startup and biohacking circuits as a speaker and entrepreneur. He has appeared at conferences covering VR fitness, biohacking, health technology, and startup culture. His public profile spans the VR/AR fitness space, the biohacking community in the UAE, and the broader Middle East startup ecosystem.
                </p>
              </div>
            </FadeIn>

            {/* Controversy — Neutral Tone */}
            <FadeIn delay={500}>
              <div style={{ marginTop: "2.5rem", padding: "2rem", background: C.white, borderLeft: `5px solid ${C.saffron}` }}>
                <h2 style={{ ...S.h2, color: C.textOnLight, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", marginBottom: "0.75rem" }}>Documented Business Disputes</h2>
                <p style={{ ...S.body, color: C.textOnLightMuted }}>
                  Alex Azzi is the subject of a VerifiedTribe community protection report documenting {SUBJECT.totalDocumented} in unpaid invoices and unfulfilled equity agreements spanning {SUBJECT.yearsOfPattern} years. The documentation includes signed contracts, timestamped invoices, and email correspondence. The report follows the SunlightProtocol verification methodology, which requires documented evidence, corroborating witnesses, and a right-of-reply period before publication. A calculable path to resolution is included in the report.
                </p>
              </div>
            </FadeIn>

            {/* FAQ Section */}
            <FadeIn delay={600}>
              <div style={{ marginTop: "2.5rem" }}>
                <h2 style={{ ...S.h2, color: C.textOnLight, fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>Frequently Asked Questions</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  {[
                    { q: "Who is Alex Azzi?", a: "Alex Azzi is the CEO of XRWorkout, a VR fitness startup, and the founder of Biohackers UAE. He is an entrepreneur and speaker active in the biohacking, VR fitness, and startup communities." },
                    { q: "What does Alex Azzi do?", a: "Alex Azzi leads XRWorkout as CEO, developing VR fitness experiences. He also founded Biohackers UAE, a health optimization community, and speaks at technology and startup conferences." },
                    { q: "What is XRWorkout?", a: "XRWorkout is a VR fitness company that uses virtual reality technology to create immersive workout experiences. Alex Azzi serves as its CEO." },
                    { q: "What is Biohackers UAE?", a: "Biohackers UAE (Biohack.ae) is a biohacking community founded by Alex Azzi, focused on health optimization and longevity practices in the United Arab Emirates." },
                    { q: "Why is there a community protection report on Alex Azzi?", a: `A VerifiedTribe report documents ${SUBJECT.totalDocumented} in unpaid invoices and unfulfilled equity agreements across ${SUBJECT.yearsOfPattern} years. The report includes signed contracts, invoices, and correspondence as evidence. A path to resolution is provided.` },
                  ].map((faq, i) => (
                    <div key={i} style={{ padding: "1.5rem", background: C.white, border: `1px solid rgba(26,26,46,0.08)` }}>
                      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.1rem", color: C.textOnLight, marginBottom: "0.5rem" }}>{faq.q}</div>
                      <div style={{ fontFamily: F.body, fontSize: "1.05rem", color: C.textOnLightMuted, lineHeight: 1.7 }}>{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
           SECTION 9: ECOSYSTEM INTERLINKS
           ═══════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.sand }}>
          <div style={S.container}>
            <FadeIn>
              <div style={{ ...S.label, color: C.cobalt, marginBottom: "0.5rem" }}>Go Deeper</div>
              <h2 style={{ ...S.h2, color: C.textOnLight }}>This Is Part of a Larger Journey</h2>
              <p style={{ ...S.body, color: C.textOnLightMuted, maxWidth: 700 }}>
                Community protection is one facet of finding your truth, your purpose, and your identity. These assessments and essays map to the same mission — helping you see clearly, act with integrity, and build something that matters.
              </p>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "2rem" }}>
              {[
                { title: "Find Your Me", href: "/find-your-me", desc: "Who are you when nobody's performing? A personality map that strips away the roles, the titles, and the expectations. Identity clarity is the foundation of ethical action.", tag: "Assessment" },
                { title: "SoulScore", href: "/soulscore", desc: "One number. Nowhere to hide. Measures purpose alignment, relationship depth, inner peace, and growth trajectory — the same qualities that separate builders from takers.", tag: "Assessment" },
                { title: "Psychedelic Readiness Index", href: "/psychedelic-readiness-index", desc: "Clinical-grade assessment across 8 dimensions. The consciousness work that connects community protection to something larger.", tag: "Assessment" },
                { title: "Find Your Therapy", href: "/find-your-therapy", desc: "If protecting your community resonates, this maps the deeper drive behind that impulse — and shows you where to direct the healing.", tag: "Assessment" },
                { title: "Find Your Attachment Style", href: "/find-your-attachment-style", desc: "How you attach is how you trust. Understanding your pattern is the first step to not getting burned by people like this.", tag: "Assessment" },
                { title: "Find Your Religion", href: "/find-your-religion", desc: "A psychometric assessment that helps you distinguish between what you believe and what you know. The same inquiry that powers the Byron Katie verification gate on this page.", tag: "Assessment" },
                { title: "Find Your Purpose", href: "/assessment?type=find-your-purpose", desc: "What are you building and why? This assessment maps the drive behind your impulse to create, protect, and lead.", tag: "Assessment" },
                { title: "Find Your Diet", href: "/find-your-diet", desc: "Your body has been screaming at you. This translates. Because taking care of yourself is the first act of resistance.", tag: "Assessment" },
                { title: "Find Your Coffee", href: "/find-your-coffee", desc: "Quick, fun, weirdly accurate. Because even your morning ritual says something about who you are.", tag: "Assessment" },
                { title: "Find Your Mezcal", href: "/assessment?type=find-your-mezcal", desc: "Smoke, earth, spirit. The drink that doesn't let you hide.", tag: "Assessment" },
                { title: "Find Your Sake", href: "/find-your-sake", desc: "Rice, water, intention. Precision in a glass.", tag: "Assessment" },
                { title: "Find Your Sleep", href: "/find-your-sleep", desc: "You can't fight for your community if you're running on fumes. Find out what your sleep is actually telling you.", tag: "Assessment" },
                { title: "Find Your Movement", href: "/find-your-movement", desc: "Your body knows things your mind won't admit. This assessment finds the movement practice that matches your wiring.", tag: "Assessment" },
                { title: "Find Your Style", href: "/find-your-style", desc: "How you present yourself to the world is a form of communication. Make it intentional.", tag: "Assessment" },
                { title: "Find Your Love Language", href: "/find-your-love-language", desc: "How you give and receive love shapes every relationship — personal and professional.", tag: "Assessment" },
                { title: "Find Your Sexuality", href: "/find-your-sexuality", desc: "Identity clarity in every dimension. No judgment, just truth.", tag: "Assessment" },
                { title: "Find Your Peptide", href: "/find-your-peptide", desc: "The peptide landscape is a minefield of fraud and life-changing medicine. Know which is which.", tag: "Assessment" },
                { title: "Find Your Kitchen", href: "/find-your-kitchen", desc: "What you cook says as much about you as what you eat. Find your kitchen identity.", tag: "Assessment" },
                { title: "Find Your Spirit", href: "/find-your-spirit", desc: "Beyond religion, beyond dogma — what does your spiritual architecture actually look like?", tag: "Assessment" },
                { title: "The Essays", href: "/essays", desc: "Twenty-five years of thinking on culture, capital, consciousness, and the systems that shape our communities. 109 essays. Zero algorithm.", tag: "Read" },
                { title: "The Apology Essay", href: "/blog/apologize", desc: "Why apologies without action are worthless — and what real reparation looks like. Referenced in the General Ledger of Retribution above.", tag: "Read" },
              ].map((link, i) => (
                <FadeIn key={i} delay={100 + i * 80}>
                  <a href={link.href} style={{
                    display: "block", padding: "1.5rem", background: C.white,
                    border: `1px solid rgba(26,26,46,0.1)`, textDecoration: "none",
                    transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ ...S.label, color: C.cobalt, marginBottom: "0.5rem", fontSize: "0.92rem" }}>{link.tag}</div>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.05rem", color: C.textOnLight, marginBottom: "0.4rem" }}>{link.title}</div>
                    <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textOnLightMuted, lineHeight: 1.65 }}>{link.desc}</div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           SECTION 10: LEGAL FOOTER
           ═══════════════════════════════════════════════════════ */}
        <section style={{ ...S.section, background: C.dark, paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div style={{ ...S.container, maxWidth: 800 }}>
            <FadeIn>
              <div style={{ ...S.label, color: C.textOnDarkSub, marginBottom: "1.5rem" }}>Legal &amp; Ethical Standards</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  { title: "Fair Comment & Opinion", text: "All opinions expressed on this page are protected under the fair comment doctrine. Factual claims are supported by documented evidence including signed contracts, invoices, email correspondence, and internal records." },
                  { title: "Right of Reply", text: `${SUBJECT.name} has been given the opportunity to respond to these claims through multiple channels over a period of ${SUBJECT.yearsOfPattern} years. This page will be updated to include any substantive response received.` },
                  { title: "Verification Standards", text: "Every claim on this page meets a minimum evidentiary threshold: signed documentation, corroborating witness, or timestamped correspondence. We do not publish unverified allegations." },
                  { title: "Path to Removal", text: "This report includes a publicly documented path to removal (see General Ledger of Retribution above). Completion of all conditions, verified by an independent third party, results in removal of this report." },
                  { title: "Anti-Gossip Commitment", text: "This platform exists to eliminate gossip, not perpetuate it. Every submission passes through a verification gate. Anonymous, unsubstantiated claims are rejected. We are accountable for what we publish." },
                  { title: "Community Responsibility", text: "We believe that standing idle in the face of documented harm is complicit. We also believe that reckless, unverified accusations are destructive. This page represents the ethical middle ground — judicious, documented, and offering a path to redemption." },
                ].map((item, i) => (
                  <div key={i} style={{ paddingBottom: "1.25rem", borderBottom: `1px solid rgba(240,234,224,0.08)` }}>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.08rem", color: C.textOnDark, marginBottom: "0.3rem" }}>{item.title}</div>
                    <div style={{ fontFamily: F.body, fontSize: "1.08rem", color: C.textOnDarkSub, lineHeight: 1.7 }}>{item.text}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "2rem", padding: "1.5rem", border: `1px solid rgba(240,234,224,0.08)`, background: "rgba(240,234,224,0.04)" }}>
                <div style={{ fontFamily: F.body, fontSize: "0.92rem", color: C.textOnDarkSub, lineHeight: 1.7 }}>
                  <strong style={{ color: C.textOnDarkMuted }}>Disclaimer:</strong> This page constitutes protected opinion and commentary based on documented business interactions. It is not legal advice. Readers should conduct their own due diligence before entering into any business relationship. The author and publisher are not responsible for decisions made based on the information presented here. If you believe any factual claim on this page is inaccurate, please contact us with supporting documentation and we will review and correct the record.
                </div>
              </div>

              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <div style={{ fontFamily: F.mono, fontSize: "1rem", color: C.textOnDarkSub, marginBottom: "0.5rem" }}>
                  VerifiedTribe &middot; SunlightProtocol &middot; Case File {SUBJECT.caseNumber} &middot; Published {SUBJECT.datePublished}
                </div>
                <div style={{ fontFamily: F.mono, fontSize: "1.08rem", color: C.textOnDarkSub }}>
                  Author: Tony Greenberg &middot; <a href="https://ramprate.com" target="_blank" rel="noopener" style={{ color: C.saffron, textDecoration: "none" }}>RampRate.com</a> &middot; <a href="/" style={{ color: C.saffron, textDecoration: "none" }}>tonygreenberg.com</a>
                </div>
              </div>

              <ShareBar dark cta="Share this framework with every community leader you know." />
            </FadeIn>
          </div>
        </section>
      </div>
    </>
  );
}
