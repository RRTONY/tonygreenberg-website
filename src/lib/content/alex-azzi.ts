// Case data for the /alex-azzi VerifiedTribe Community Protection Report,
// ported verbatim from _legacy-manus-app/client/src/pages/CheshireGrin.tsx's
// SUBJECT config and DATA section (lines ~32–365). Every figure, date, and
// quoted statement below is copied unchanged from the legacy source — see
// src/app/alex-azzi/page.tsx's top-of-file comment for what was dropped
// (backend-dependent forms, the password gate) and why.
//
// Extracted to its own module rather than kept inline in page.tsx (unlike
// /protecting-your-business, which inlines its smaller data set) because
// this case has roughly 3x the data volume — keeping it separate lets
// page.tsx stay focused on markup.

export const SUBJECT = {
  name: "Alex Azzi",
  title: "CEO, XRWorkout",
  aliases: ["Biohackers UAE Founder", "Biohack.ae"],
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

// Legacy's IMG.hero/mask/puppet/vault/vanish/protocol/redFlags/evidence/
// playbook/ledger/community/healing/glass* images are all hosted on
// d2xsxph8kpxj0f.cloudfront.net, already allowlisted in next.config.ts's
// images.remotePatterns — safe to load through next/image directly.
// Legacy's SUBJECT.photo (/api/img/cheshire-orig_9554dcb8.jpg) was
// Manus-hosted and is dropped per CONTRIBUTING's zero-Manus-dependency
// rule — see page.tsx's port note for the initials-avatar fallback used
// in its place.
export const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_5_hero_4a47a9b2.jpg",
  vault:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/cheshire-vault-69sjHYVpxTpkN5DTEThgcv.webp",
  vanish:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/cheshire-vanish-Vtq5Covu2WVFSmHZdAUX4X.webp",
  redFlags:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_2_red_flags_535c6c20.jpg",
  ledger:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_33_ledger_9aaf5507.jpg",
  glassPrinciples:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/vt-principles-glass-RnR8hiqd9XHwnfeb9S4r7G.webp",
  glassSunlight:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/vt-sunlight-protocol-htqUDx9BYR5LqsVmLjJkrD.webp",
  ogImage:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/og-alex-azzi-mUffXWA2JbGUKwZdNGbJ3h.png",
};

export const TOC = [
  { id: "case", label: "The Case" },
  { id: "protocol", label: "SunlightProtocol" },
  { id: "red-flags", label: "8 Red Flags" },
  { id: "playbook", label: "The Playbook" },
  { id: "timeline", label: "Timeline" },
  { id: "where", label: "Where in the World" },
  { id: "note", label: "Personal Note" },
  { id: "path-back", label: "Path Back" },
  { id: "evidence-collection", label: "Has This Happened to You" },
  { id: "healing", label: "Healing Framework" },
  { id: "the-work", label: "Doing The Work" },
  { id: "about", label: "About & FAQ" },
  { id: "reading", label: "Go Deeper" },
];

export const RED_FLAGS = [
  {
    flag: "They beg for help using personal connections",
    lesson:
      "Warm intros are social engineering. The trust belongs to the introducer, not the founder. Get your own due diligence.",
  },
  {
    flag: "They sign contracts but treat invoices as suggestions",
    lesson:
      "A signature means nothing if there's no enforcement plan. Build payment milestones with kill switches.",
  },
  {
    flag: "They acknowledge the debt — then redirect to a subordinate",
    lesson:
      "Acknowledgment without payment is a stalling tactic. Document every admission in writing.",
  },
  {
    flag: "They go silent when you ask for money",
    lesson:
      "Silence is a strategy, not an oversight. Set hard deadlines with consequences in the original contract.",
  },
  {
    flag: "They offer 'new work' to sidestep the old debt",
    lesson:
      "Never accept future promises as payment for past work. Settle the old invoice before discussing anything new.",
  },
  {
    flag: "They have money in the bank but claim they can't pay",
    lesson:
      "If they raised capital or have revenue and still won't pay vendors, that's a choice — not a cash flow problem.",
  },
  {
    flag: "They name-drop investors, advisors, and events constantly",
    lesson: "Social proof is not solvency. Ask for bank references, not LinkedIn connections.",
  },
  {
    flag: "They use charm and vision to make you feel guilty for collecting",
    lesson:
      "If asking for payment makes you feel like the bad guy, you're being manipulated. That's the playbook.",
  },
];

export const SOL_CARDS = [
  {
    status: "CRITICAL — ACT NOW",
    colorClass: "red-800" as const,
    invoice: "Invoice #1 (kickoff)",
    date: "March 2022",
    amount: "$25,000",
    paid: "$15,000 partial",
    breachDate: "April 2022",
    solClose: "April 2026",
    pct: 97,
    note: "97% of the 4-year window has elapsed. $15,000 partial payment received — the only money ever paid.",
  },
  {
    status: "ACTIVE WINDOW",
    colorClass: "amber-700" as const,
    invoice: "Invoice #2",
    date: "January 2023",
    amount: "$50,000",
    breachDate: "February 2023",
    solClose: "February 2027",
    pct: 63,
    note: "~63% elapsed. Strong window remains.",
  },
  {
    status: "SECURE WINDOW",
    colorClass: "green-700" as const,
    invoice: "Invoice #3",
    date: "December 2024",
    amount: "$50,000",
    breachDate: "Early 2025",
    solClose: "Early 2029",
    pct: 19,
    note: "19% elapsed. Most time remaining.",
  },
];

export const EVIDENCE_TOTALS = [
  { val: "$15K", label: "Total Ever Paid", sub: "One partial payment on Invoice #1 — once, ever" },
  {
    val: "$75K+",
    label: "Documented Cash Owed",
    sub: "Across 3 invoices (March 2022, Jan 2023, Dec 2024)",
  },
  { val: "~$137K", label: "True Figure with Interest", sub: "Per signed contract at 1.5%/month" },
  { val: "3–5%", label: "Equity Never Transferred", sub: "Per signed SOW + Change Order" },
];

export const TIMELINE = [
  {
    date: "Dec 2021 / Jan 2022",
    title: "The Signed Contract",
    text: "Azzi signed RampRate's SOW on January 21, 2022. Terms: $75,000 cash fee plus 3% + up to 2% equity in XRWorkout. Payment due within 10 days. Late payments accrue 1.5%/month.",
  },
  {
    date: "March 2022",
    title: "Invoice #1 (kickoff): $25,000",
    text: "First invoice per contract. XRWorkout (Alex Azzi) actually paid: $15,000 — once, ever. The $15,000 partial payment on Invoice #1 is the only money RampRate ever received from Azzi against a $75,000 cash commitment (plus 3–5% equity that was never transferred).",
  },
  {
    date: "May 2022",
    title: "Change Order 1 — He Admitted It in Writing",
    text: "The Change Order 1 (May 2022) acknowledged the $10,000 shortfall in writing and promised payment within 10 business days. Did not pay.",
  },
  {
    date: "April 2022",
    title: "Services Delivered — Documented",
    text: "Human capital sessions, product roadmap advisory, BD introductions to fitness franchising operators and platform studio founders. All documented.",
  },
  {
    date: "January 2023",
    title: "Invoice #2: $50,000 — Ignored",
    text: "Net 10 terms. Ignored.",
  },
  {
    date: "July 2023",
    title: "The $200K Moment",
    text: "XRWorkout had $200,000 in the bank. Azzi declined to pay $50,000 owed. Offered $10K/month re-engagement instead.",
  },
  {
    date: "August 2023",
    title: "Direct Confrontation — Dismissed",
    text: "Tony directly confronted Azzi. Response: ‘Not ignoring — replying via alex. Thanks -a.’ Not a payment. A redirect.",
  },
  {
    date: "December 2023",
    title: "Formal Collections — No Response",
    text: "RampRate offered 15% discount if paid by Dec 31, 2023. Also offered promissory note. Also requested equity confirmation. No response.",
  },
  {
    date: "February 2024",
    title: "Final Plea — Silence",
    text: "‘Alex, are you going to make payments on your bill and fix this relationship or let it get worse.’ No response.",
  },
  {
    date: "December 2024",
    title: "Invoice #3: $50,000 — Final Notice",
    text: "‘You are out of integrity. It's time to pay your bill.’ Still unpaid.",
  },
  {
    date: "March 2026",
    title: "This Page Goes Live",
    text: "The community deserves to know. This is the lesson.",
  },
];

export const EVIDENCE_ROWS = [
  {
    claim: "Binding contract signed by Azzi",
    source: "SOW executed Jan 21, 2022",
    strength: "IRONCLAD" as const,
  },
  {
    claim: "$25K kickoff invoice — only $15K paid (once, ever)",
    source: "Change Order 1 — Azzi's own admission of $10K shortfall",
    strength: "IRONCLAD" as const,
  },
  {
    claim: "$50K deferred balance unpaid",
    source: "SOW Section 2.2 + Dec 2023 collections letter",
    strength: "IRONCLAD" as const,
  },
  {
    claim: "3%+2% equity never transferred",
    source: "Dec 2023 formal request — no response",
    strength: "STRONG" as const,
  },
  {
    claim: "Services delivered in full",
    source: "4+ meeting docs, grant app, BD intros",
    strength: "STRONG" as const,
  },
  {
    claim: "$200K in bank — active refusal",
    source: "July 2023 internal CSO update after Azzi call",
    strength: "DOCUMENTED" as const,
  },
  {
    claim: "Collections ignored 3+ years",
    source: "Email record, formal letters, direct confrontations",
    strength: "STRONG" as const,
  },
  {
    claim: "Interest at 1.5%/month per contract",
    source: "SOW Section 2.5 — contractual term",
    strength: "IRONCLAD" as const,
  },
  {
    claim: "$50K Dec 2024 invoice unpaid",
    source: "Collections notice + editorial record",
    strength: "DOCUMENTED" as const,
  },
];

export const SMOKING_GUN = {
  quote:
    "In short, they have $200K in the bank, so he's not paying us $50K up front, but he left the door open to a $10K/month minimum effort engagement — mostly to get back in Tony's good graces.",
  source: "Internal RampRate CSO Update · July 2023 · Following direct call with Alex Azzi",
};

export const PLAYBOOK_STEPS = [
  {
    num: 1,
    title: "Beg for help.",
    text: "Present yourself as visionary, underdog, deserving. Use warm intros to bypass due diligence.",
  },
  {
    num: 2,
    title: "Receive the services.",
    text: "Use the work product. Show the investor decks. Name-drop the advisor. Extract maximum value.",
  },
  {
    num: 3,
    title: "Deflect.",
    text: "Redirect to someone else. Blame timing. Blame fundraising. Blame the market. Never blame yourself.",
  },
  {
    num: 4,
    title: "Go silent.",
    text: "Make the creditor feel like they are the problem for asking. Silence is the weapon.",
  },
  {
    num: 5,
    title: "Offer a re-engagement.",
    text: "Float new work to sidestep the original debt. Create a new future to erase the past.",
  },
  {
    num: 6,
    title: "Repeat.",
    text: "Find the next warm intro. The next kind person. The next believer. The grin never leaves.",
  },
];

export const PLAYBOOK_QUOTE = {
  text: "This is not a collections dispute. This is a documented pattern of behavior in which a founder uses charm, vision, and startup language to extract services — and then treats the invoice as optional.",
  attribution: "Collections Counsel Assessment, 2024",
};

export const MAP_PINS = [
  {
    city: "Las Vegas, NV",
    event: "CES Speaker",
    detail: "Consumer Electronics Show — VR fitness pitch to investor audiences.",
  },
  {
    city: "Santa Clara, CA",
    event: "AWE USA 2023",
    detail: "Startup Pitch Finalist at Augmented World Expo.",
  },
  { city: "San Francisco, CA", event: "GDC 2024", detail: "Game Developers Conference 2024." },
  {
    city: "Miami, FL",
    event: "Goldman Sachs Demo + Former Base",
    detail: "Private demo to ~20 attendees. Former residential base.",
  },
  {
    city: "New York, NY",
    event: "Current Base",
    detail: "Current primary base. Active in AI and longevity networking.",
  },
  {
    city: "Davos, Switzerland",
    event: "WEF Fringe Panels",
    detail: "3 panels on psychedelics at WEF fringe events (2024 + 2026).",
  },
  {
    city: "Dubai, UAE",
    event: "6-Year Residence",
    detail: "Founded Biohackers UAE and Biohack.ae.",
  },
  {
    city: "Beirut, Lebanon",
    event: "Birthplace",
    detail: "Hosted Beirut XR Mastermind Jan 9, 2024.",
  },
  {
    city: "London, UK",
    event: "Former Residence",
    detail: "Active in AI & Longevity Mastermind circles.",
  },
  { city: "Helsinki, Finland", event: "Biohacker Summit", detail: "Recurring presence." },
];

export const ESCALATION_SPECTRUM = [
  {
    level: "Gossip",
    description:
      "Unverified whispers. Damages reputations. Solves nothing. The most dangerous thing on earth.",
    risk: "Destroys trust",
  },
  {
    level: "Rumor",
    description:
      "Repeated gossip with embellishment. Now it's 'common knowledge' that was never verified.",
    risk: "Creates false consensus",
  },
  {
    level: "Unchecked Pattern",
    description:
      "Multiple people have been affected but nobody talks. The bad actor refines their technique.",
    risk: "Enables escalation",
  },
  {
    level: "Serial Fraud",
    description:
      "Romance scams ($1.16B in 9 months, 2025). Investment fraud. Vendor theft. Now it's a business model.",
    risk: "Systematic harm",
  },
  {
    level: "Institutional Scale",
    description:
      "Bernie Madoff. $65 billion. Decades of silence. Everyone suspected. Nobody verified. Nobody spoke.",
    risk: "Civilizational failure",
  },
];

export const VERIFICATION_STEPS = [
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

export const SCAM_RESOURCES = [
  {
    name: "FTC — Report Fraud",
    url: "https://reportfraud.ftc.gov/",
    description: "Federal Trade Commission consumer fraud reporting",
  },
  {
    name: "FBI IC3 — Internet Crime",
    url: "https://www.ic3.gov/",
    description: "FBI's Internet Crime Complaint Center",
  },
  {
    name: "SEC — Report Securities Fraud",
    url: "https://www.sec.gov/submit-tip-or-complaint",
    description: "Securities and Exchange Commission whistleblower portal",
  },
  {
    name: "FTC Consumer Sentinel",
    url: "https://www.ftc.gov/enforcement/consumer-sentinel-network",
    description: "Law enforcement database of consumer reports",
  },
  {
    name: "AARP Fraud Watch",
    url: "https://www.aarp.org/money/scams-fraud/",
    description: "Scam tracking and prevention resources",
  },
  {
    name: "Better Business Bureau — Scam Tracker",
    url: "https://www.bbb.org/scamtracker",
    description: "Community-reported scam database",
  },
];

export const RETRIBUTION_LEDGER = {
  title: "The Path Back — What It Takes to Remove This Report",
  subtitle: "This is not a wall of shame. This is a door with conditions.",
  categories: [
    {
      id: "financial",
      name: "Financial Restitution",
      description: "Pay what you owe. Not what you feel like. What the contract says.",
      items: [
        {
          label: "Total paid to date",
          value:
            "$15,000 (one partial payment on Invoice #1 kickoff — the only money ever received)",
          status: "partial" as const,
        },
        {
          label: "Principal owed (documented invoices)",
          value: "$75,000+",
          status: "unpaid" as const,
        },
        {
          label: "Contractual interest (1.5%/month since breach)",
          value: "~$62,000",
          status: "unpaid" as const,
        },
        {
          label: "Time-value-of-money adjustment (4 years of lost capital use)",
          value: "Calculated at 10% CA prejudgment rate",
          status: "unpaid" as const,
        },
        {
          label: "Equity transfer per signed SOW",
          value: "3–5% of XRWorkout",
          status: "unfulfilled" as const,
        },
      ],
    },
    {
      id: "ecosystem",
      name: "Ecosystem Damage Repair",
      description:
        "The introductions that went cold. The deals that died. The reputation cost to people who vouched.",
      items: [
        {
          label: "Written acknowledgment to each person who made introductions on his behalf",
          value: "Minimum 5 individuals",
          status: "undone" as const,
        },
        {
          label:
            "Public statement correcting any misrepresentations made using RampRate's name or work",
          value: "Verifiable",
          status: "undone" as const,
        },
        {
          label: "Direct outreach to affected vendors, advisors, and partners",
          value: "Documented",
          status: "undone" as const,
        },
      ],
    },
    {
      id: "time",
      name: "Time Theft Restitution",
      description:
        "Hours spent chasing payment instead of building. Calculated at professional rates.",
      items: [
        {
          label: "Collections effort: emails, calls, legal consultations (est. 200+ hours)",
          value: "At $500/hr advisory rate = $100,000+",
          status: "unpaid" as const,
        },
        {
          label: "Opportunity cost: deals not pursued, clients not served",
          value: "Incalculable — acknowledged",
          status: "unpaid" as const,
        },
      ],
    },
    {
      id: "acknowledgment",
      name: "Public Acknowledgment",
      description: "Not a PR apology. Not 'I'm sorry if you felt...' A real one.",
      items: [
        {
          label: "Written statement acknowledging the debt, the pattern, and the harm caused",
          value: "Published publicly",
          status: "undone" as const,
        },
        {
          label: "Direct apology to Tony Greenberg and the RampRate team",
          value: "In writing, not verbal",
          status: "undone" as const,
        },
        {
          label: "Acknowledgment to the community that trust was violated",
          value: "Public forum",
          status: "undone" as const,
        },
      ],
      blogLink: {
        text: "Read: Why Apologies Without Action Are Worthless",
        href: "/blog/apologize",
      },
    },
    {
      id: "service",
      name: "Community Service",
      description:
        "Measurable, documented service to the community you damaged. Not a photo op. Real hours. Real impact.",
      items: [
        {
          label: "100 hours of documented pro-bono advisory work for early-stage founders",
          value: "Verified by third party",
          status: "undone" as const,
        },
        {
          label: "Mentorship commitment to 3 founders from underrepresented communities",
          value: "12-month minimum",
          status: "undone" as const,
        },
        {
          label: "Financial literacy workshop for startup founders on vendor payment ethics",
          value: "Recorded & published",
          status: "undone" as const,
        },
      ],
    },
    {
      id: "healing",
      name: "Corrective Healing",
      description:
        "What have you done to heal yourself? To understand why you did this? To ensure it never happens again?",
      items: [
        {
          label: "Documented engagement with accountability coaching or therapy",
          value: "Minimum 6 months",
          status: "undone" as const,
        },
        {
          label: "Completion of Byron Katie's 'The Work' inquiry on the patterns that led here",
          value: "Written reflection submitted",
          status: "undone" as const,
        },
        {
          label: "Restorative justice mediation with affected parties (if willing)",
          value: "Facilitated by neutral third party",
          status: "undone" as const,
        },
      ],
    },
  ],
  removalConditions:
    "When ALL categories above are verified as complete by an independent third party, this report will be removed and replaced with a statement acknowledging the subject's completion of the retribution process. The path back exists. It requires action, not words.",
};

export const FEATURED_Q =
  "Did someone you trust introduce you to Alex Azzi — and did you end up doing work you were never paid for?";

export const QUESTIONS_10 = [
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

export const HEALING_FRAMEWORK = [
  {
    title: "Protect",
    text: "Judiciously, slowly, legally. Not with gossip — with verified, documented truth. The ethical way to ensure the next person doesn't learn the hard way.",
  },
  {
    title: "Heal",
    text: "Healing ourselves. Healing those who were wronged. And offering a path to healing for those who caused the harm — because reparation is not just punishment, it's transformation.",
  },
  {
    title: "Become",
    text: "In this massive transformational time, the communities that survive are the ones that hold each other accountable with love, not rage. With facts, not feelings. With conviction, not cruelty.",
  },
];

export const BYRON_KATIE_APPLIED = [
  {
    num: "01",
    q: "Is it true that Alex Azzi defrauded people?",
    work: "Yes. There are signed contracts for services rendered. There are invoices totaling $137,000+. There are emails acknowledging the debt. There are equity agreements never executed. This is not a feeling — it is documented across 6 years, multiple companies, and multiple victims.",
  },
  {
    num: "02",
    q: "Can you absolutely know that it's true?",
    work: "Yes. The contracts are signed. The invoices are timestamped. The emails are archived. The equity was never transferred. The pattern is consistent across XRWorkout, Biohackers UAE, and related entities. This meets the SunlightProtocol's 8-step evidentiary standard. Every claim on this page has a paper trail.",
  },
  {
    num: "03",
    q: "How do you react when you believe that Alex Azzi is a fraud?",
    work: "Anger. Frustration. A desire for justice. But also — a recognition that anger alone doesn't protect anyone. The question is whether this energy is directed toward revenge or toward community protection. If it's revenge, stop. If it's protection — the desire to ensure the next person doesn't get the same handshake and the same empty chair — proceed with discipline.",
  },
  {
    num: "04",
    q: "Who would you be without the thought that Alex Azzi wronged you?",
    work: "Free. But freedom doesn't mean silence. Without this thought, you might not feel the urgency — but you'd still see the pattern. You'd still see the next person walking into the same room. The question isn't whether to act. It's whether your action comes from a clean place. If you can act without rage, without vendetta, with only the intention to protect — that's The Work done right.",
  },
];

export const KEY_FACTS = [
  { label: "Full Name", value: "Alex Azzi" },
  { label: "Role", value: "CEO, XRWorkout" },
  { label: "Founded", value: "Biohackers UAE" },
  { label: "Industry", value: "VR Fitness, Biohacking" },
  { label: "Region", value: "UAE / Middle East" },
  { label: "Known For", value: "Startup speaker, biohacking advocate" },
];

export const FAQ = [
  {
    q: "Who is Alex Azzi?",
    a: "Alex Azzi is the CEO of XRWorkout, a VR fitness startup, and the founder of Biohackers UAE. He is an entrepreneur and speaker active in the biohacking, VR fitness, and startup communities.",
  },
  {
    q: "What does Alex Azzi do?",
    a: "Alex Azzi leads XRWorkout as CEO, developing VR fitness experiences. He also founded Biohackers UAE, a health optimization community, and speaks at technology and startup conferences.",
  },
  {
    q: "What is XRWorkout?",
    a: "XRWorkout is a VR fitness company that uses virtual reality technology to create immersive workout experiences. Alex Azzi serves as its CEO.",
  },
  {
    q: "What is Biohackers UAE?",
    a: "Biohackers UAE (Biohack.ae) is a biohacking community founded by Alex Azzi, focused on health optimization and longevity practices in the United Arab Emirates.",
  },
  {
    q: "Why is there a community protection report on Alex Azzi?",
    a: "A VerifiedTribe report documents $137,000+ in unpaid invoices and unfulfilled equity agreements across 6 years. The report includes signed contracts, invoices, and correspondence as evidence. A path to resolution is provided.",
  },
];

// Legacy's Ecosystem Interlinks section (20 cards) linked to 2 routes this
// migration never built: /assessment?type=find-your-purpose and
// /assessment?type=find-your-mezcal. This repo's real /assessment page
// (src/components/assessments/assessment-quiz.tsx) is the ported
// Builder/Crusader/Investor archetype quiz — it doesn't read a `type`
// query param, so those two legacy links would silently render the wrong
// assessment instead of 404ing. Dropped per this migration's own dead-link
// audit convention (see NEXTJS-MIGRATION-TODO.md Phase 9) rather than
// linking somewhere misleading.
export const ECOSYSTEM_LINKS = [
  {
    title: "Find Your Me",
    href: "/find-your-me",
    desc: "Who are you when nobody's performing? A personality map that strips away the roles, the titles, and the expectations. Identity clarity is the foundation of ethical action.",
    tag: "Assessment",
  },
  {
    title: "SoulScore",
    href: "/soulscore",
    desc: "One number. Nowhere to hide. Measures purpose alignment, relationship depth, inner peace, and growth trajectory — the same qualities that separate builders from takers.",
    tag: "Assessment",
  },
  {
    title: "Psychedelic Readiness Index",
    href: "/psychedelic-readiness-index",
    desc: "Clinical-grade assessment across 8 dimensions. The consciousness work that connects community protection to something larger.",
    tag: "Assessment",
  },
  {
    title: "Find Your Therapy",
    href: "/find-your-therapy",
    desc: "If protecting your community resonates, this maps the deeper drive behind that impulse — and shows you where to direct the healing.",
    tag: "Assessment",
  },
  {
    title: "Find Your Attachment Style",
    href: "/find-your-attachment-style",
    desc: "How you attach is how you trust. Understanding your pattern is the first step to not getting burned by people like this.",
    tag: "Assessment",
  },
  {
    title: "Find Your Religion",
    href: "/find-your-religion",
    desc: "A psychometric assessment that helps you distinguish between what you believe and what you know. The same inquiry that powers the Byron Katie verification gate on this page.",
    tag: "Assessment",
  },
  {
    title: "Find Your Diet",
    href: "/find-your-diet",
    desc: "Your body has been screaming at you. This translates. Because taking care of yourself is the first act of resistance.",
    tag: "Assessment",
  },
  {
    title: "Find Your Coffee",
    href: "/find-your-coffee",
    desc: "Quick, fun, weirdly accurate. Because even your morning ritual says something about who you are.",
    tag: "Assessment",
  },
  {
    title: "Find Your Sake",
    href: "/find-your-sake",
    desc: "Rice, water, intention. Precision in a glass.",
    tag: "Assessment",
  },
  {
    title: "Find Your Sleep",
    href: "/find-your-sleep",
    desc: "You can't fight for your community if you're running on fumes. Find out what your sleep is actually telling you.",
    tag: "Assessment",
  },
  {
    title: "Find Your Movement",
    href: "/find-your-movement",
    desc: "Your body knows things your mind won't admit. This assessment finds the movement practice that matches your wiring.",
    tag: "Assessment",
  },
  {
    title: "Find Your Style",
    href: "/find-your-style",
    desc: "How you present yourself to the world is a form of communication. Make it intentional.",
    tag: "Assessment",
  },
  {
    title: "Find Your Love Language",
    href: "/find-your-love-language",
    desc: "How you give and receive love shapes every relationship — personal and professional.",
    tag: "Assessment",
  },
  {
    title: "Find Your Sexuality",
    href: "/find-your-sexuality",
    desc: "Identity clarity in every dimension. No judgment, just truth.",
    tag: "Assessment",
  },
  {
    title: "Find Your Peptide",
    href: "/find-your-peptide",
    desc: "The peptide landscape is a minefield of fraud and life-changing medicine. Know which is which.",
    tag: "Assessment",
  },
  {
    title: "Find Your Kitchen",
    href: "/find-your-kitchen",
    desc: "What you cook says as much about you as what you eat. Find your kitchen identity.",
    tag: "Assessment",
  },
  {
    title: "Find Your Spirit",
    href: "/find-your-spirit",
    desc: "Beyond religion, beyond dogma — what does your spiritual architecture actually look like?",
    tag: "Assessment",
  },
  {
    title: "The Essays",
    href: "/essays",
    desc: "Twenty-five years of thinking on culture, capital, consciousness, and the systems that shape our communities. 109 essays. Zero algorithm.",
    tag: "Read",
  },
  {
    title: "The Apology Essay",
    href: "/blog/apologize",
    desc: "Why apologies without action are worthless — and what real reparation looks like. Referenced in the General Ledger of Retribution above.",
    tag: "Read",
  },
];

export const LEGAL_NOTICES = [
  {
    title: "Fair Comment & Opinion",
    text: "All opinions expressed on this page are protected under the fair comment doctrine. Factual claims are supported by documented evidence including signed contracts, invoices, email correspondence, and internal records.",
  },
  {
    title: "Right of Reply",
    text: "Alex Azzi has been given the opportunity to respond to these claims through multiple channels over a period of 6 years. This page will be updated to include any substantive response received.",
  },
  {
    title: "Verification Standards",
    text: "Every claim on this page meets a minimum evidentiary threshold: signed documentation, corroborating witness, or timestamped correspondence. We do not publish unverified allegations.",
  },
  {
    title: "Path to Removal",
    text: "This report includes a publicly documented path to removal (see the General Ledger of Retribution above). Completion of all conditions, verified by an independent third party, results in removal of this report.",
  },
  {
    title: "Anti-Gossip Commitment",
    text: "This platform exists to eliminate gossip, not perpetuate it. Every claim passes through a verification standard before publication. Anonymous, unsubstantiated claims are rejected. We are accountable for what we publish.",
  },
  {
    title: "Community Responsibility",
    text: "We believe that standing idle in the face of documented harm is complicit. We also believe that reckless, unverified accusations are destructive. This page represents the ethical middle ground — judicious, documented, and offering a path to redemption.",
  },
];
