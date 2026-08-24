import type { Metadata } from "next";
import Link from "next/link";
import { IntelPortfolio, type PortCo } from "@/components/marketing/intel-portfolio";

// Ported from legacy client/src/pages/Intel.tsx. Real content kept as-is
// (9 portfolio companies, full investment thesis / gates / compass scores /
// iRR framework / competitive landscape for each). Rebuilt the expand/
// collapse as a shadcn Accordion with forceMount — see /journeys and
// CONTRIBUTING.md for why that matters for a page this link/content-heavy.

export const metadata: Metadata = {
  title: "Intel",
  description:
    "The work — impact theses, Hawkins consciousness scores, competitive landscape, and impact metrics for the companies and causes Tony Greenberg is building.",
  alternates: { canonical: "/intel" },
};

const PORTFOLIO: PortCo[] = [
  {
    name: "RampRate",
    category: "Enterprise Technology & AI",
    description: "IT sourcing & benchmarking firm. $10B+ benchmarked. SPY Index holds 1M+ data points. B Corp certified.",
    investmentThesis: "Trust is the ultimate moat in enterprise procurement. After 25 years of benchmarking every major cloud, colocation, and network deal, RampRate's data advantage is compounding — not depreciating. The SPY Index is the Bloomberg Terminal of infrastructure sourcing.",
    hawkinsScore: 400,
    compassScores: [9, 5, 7, 8, 9, 7, 10],
    compositeScore: 7.9,
    irr: { keyImpactIndicator: "Dollars saved for clients through optimized sourcing", futureImpact: "85% of goal ($30B+ lifetime savings target)", impactMultiplier: 8.5, impactEfficiency: "$1 advisory spend → $47 client savings", timeHorizon: "25 years (ongoing)", estimatedIRR: "9.2x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Gartner", description: "Global research & advisory — broader but shallower in sourcing", type: "competitor" },
      { name: "ISG (TPI)", description: "IT services sourcing — traditional RFP-driven model", type: "competitor" },
      { name: "Everest Group", description: "IT services research — strong in outsourcing analytics", type: "competitor" },
    ],
    status: "Active",
    role: "Founder & CEO",
  },
  {
    name: "ImpactSoul",
    category: "Social Impact & Tokenization",
    description: "Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND, REX, SPACE, BEING.",
    investmentThesis: "Philanthropy is broken because it separates giving from owning. Asset-backed impact tokens let communities own a piece of the mission — a dinosaur skeleton, ocean cleanup infrastructure, digital access points. When you tokenize meaning, you create markets for things that matter.",
    hawkinsScore: 540,
    compassScores: [8, 9, 10, 9, 10, 10, 8],
    compositeScore: 9.1,
    irr: { keyImpactIndicator: "Token holders actively funding regenerative projects", futureImpact: "40% of goal (10,000 active token holders)", impactMultiplier: 9.0, impactEfficiency: "$1 invested → $3.20 regenerative impact deployed", timeHorizon: "10 years", estimatedIRR: "8.7x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Republic", description: "Crowdfunding platform — broader but less impact-focused", type: "competitor" },
      { name: "Giveth", description: "Blockchain-native giving — decentralized but less structured", type: "competitor" },
      { name: "Flowcarbon", description: "Tokenized carbon credits — similar mechanism, different asset class", type: "competitor" },
    ],
    status: "Active",
    role: "Founder & CEO",
  },
  {
    name: "MycoMedica Life Sciences",
    category: "Psychedelic Medicine",
    description: "Mycological therapeutics for mental health, neurodegeneration, and immune support.",
    investmentThesis: "Fungi are the original internet — 2.4 billion years of networked intelligence. When you pair mycological science with clinical-grade therapeutic development, you get medicine that works with biology instead of against it. This is consciousness infrastructure.",
    hawkinsScore: 600,
    compassScores: [7, 10, 9, 8, 8, 10, 9],
    compositeScore: 8.7,
    irr: { keyImpactIndicator: "Patients treated with mycological therapeutics", futureImpact: "15% of goal (1M patients by 2035)", impactMultiplier: 9.5, impactEfficiency: "$1 invested → projected $8.40 in healthcare cost reduction", timeHorizon: "12 years", estimatedIRR: "7.8x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Compass Pathways", description: "Psilocybin therapy — FDA Breakthrough, synthetic approach", type: "competitor" },
      { name: "MAPS/Lykos", description: "MDMA-assisted therapy — regulatory pioneer", type: "competitor" },
      { name: "Numinus", description: "Psychedelic-assisted therapy clinics — service model", type: "competitor" },
    ],
    status: "Active",
    role: "Investor",
  },
  {
    name: "Atai/Beckley",
    category: "Psychedelic Medicine",
    description: "FDA Breakthrough Therapy designation. Psychedelic-assisted therapy for treatment-resistant depression.",
    investmentThesis: "The FDA Breakthrough designation isn't just regulatory — it's civilizational. When the most conservative institution in medicine says 'this matters enough to fast-track,' you're watching a paradigm shift in real time. Beckley's research rigor plus Atai's capital structure creates the bridge between counterculture wisdom and clinical legitimacy.",
    hawkinsScore: 500,
    compassScores: [7, 10, 7, 7, 7, 8, 8],
    compositeScore: 7.7,
    irr: { keyImpactIndicator: "Patients accessing FDA-approved psychedelic therapy", futureImpact: "20% of goal (500K patients by 2035)", impactMultiplier: 8.0, impactEfficiency: "$1 invested → projected $12 in reduced mental health burden", timeHorizon: "8 years", estimatedIRR: "6.5x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Compass Pathways", description: "Direct competitor — synthetic psilocybin, larger market cap", type: "competitor" },
      { name: "MindMed", description: "LSD-based therapeutics — different molecule, similar market", type: "competitor" },
      { name: "Cybin", description: "Deuterated psilocybin — novel chemistry approach", type: "competitor" },
    ],
    status: "Active",
    role: "Investor & Advisor",
  },
  {
    name: "Wake Network",
    category: "Psychedelic Medicine",
    description: "Psychedelic wellness network connecting practitioners, patients, and research.",
    investmentThesis: "The psychedelic renaissance needs plumbing. Wake Network is building the connective tissue between practitioners, patients, and researchers. When an industry goes from underground to mainstream, the network layer captures disproportionate value.",
    hawkinsScore: 500,
    compassScores: [7, 9, 6, 8, 9, 8, 7],
    compositeScore: 7.7,
    irr: { keyImpactIndicator: "Practitioners and patients connected through the network", futureImpact: "25% of goal (50K active connections)", impactMultiplier: 7.5, impactEfficiency: "$1 invested → 12 meaningful practitioner-patient connections", timeHorizon: "6 years", estimatedIRR: "5.2x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Psychable", description: "Psychedelic provider directory — simpler model", type: "competitor" },
      { name: "Mindbloom", description: "At-home ketamine therapy — consumer-facing", type: "competitor" },
    ],
    status: "Active",
    role: "Investor & Advisor",
  },
  {
    name: "Radicle Science",
    category: "Psychedelic Medicine",
    description: "Large-scale clinical trials for natural products and psychedelics using decentralized trial design.",
    investmentThesis: "The biggest bottleneck in psychedelic medicine isn't the molecules — it's the evidence. Radicle Science runs the largest clinical trials ever conducted on natural products. Their decentralized trial design is 10x cheaper and 5x faster than traditional pharma trials. This is the evidence engine the entire industry needs.",
    hawkinsScore: 460,
    compassScores: [8, 7, 7, 7, 8, 7, 9],
    compositeScore: 7.6,
    irr: { keyImpactIndicator: "Clinical trial participants generating evidence", futureImpact: "35% of goal (500K participants)", impactMultiplier: 8.5, impactEfficiency: "$1 invested → 85 data points generated (vs. 3 in traditional trials)", timeHorizon: "8 years", estimatedIRR: "7.1x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Medable", description: "Decentralized clinical trials — broader pharma focus", type: "competitor" },
      { name: "Science 37", description: "Virtual clinical trials — similar model, different market", type: "competitor" },
    ],
    status: "Active",
    role: "Investor",
  },
  {
    name: "Tripp",
    category: "Psychedelic Medicine / VR",
    description: "VR-based mindfulness and psychedelic-adjacent experiences for mental wellness.",
    investmentThesis: "Not everyone is ready for a mushroom journey. Tripp meets people where they are — in a headset, in their living room, on their lunch break. VR-induced altered states are the gateway drug to consciousness expansion. When Apple ships spatial computing to a billion people, Tripp is the meditation app that actually changes your brain.",
    hawkinsScore: 460,
    compassScores: [6, 9, 5, 7, 8, 9, 7],
    compositeScore: 7.3,
    irr: { keyImpactIndicator: "Users experiencing VR-induced mindfulness sessions", futureImpact: "20% of goal (5M sessions annually)", impactMultiplier: 7.0, impactEfficiency: "$1 invested → 200 mindfulness sessions delivered", timeHorizon: "7 years", estimatedIRR: "4.9x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Calm", description: "Meditation app — massive user base, no VR", type: "competitor" },
      { name: "Headspace/XR", description: "Mindfulness + emerging XR experiments", type: "competitor" },
      { name: "Innerworld", description: "VR mental health support communities", type: "competitor" },
    ],
    status: "Active",
    role: "Investor & Advisor",
  },
  {
    name: "The Corridor (Payments)",
    category: "Payments & Stablecoin",
    description: "Four payment processing companies at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance.",
    investmentThesis: "Payments is a $2T industry built on 1970s rails. The corridor between traditional card processing and stablecoin settlement is where the next decade of value creation lives. Four companies, each holding a different piece of the pipe. Details under NDA, but the opportunity is measured in billions.",
    hawkinsScore: 350,
    compassScores: [8, 4, 6, 8, 7, 6, 8],
    compositeScore: 6.7,
    irr: { keyImpactIndicator: "Transaction volume processed through modernized rails", futureImpact: "Awaiting company data", impactMultiplier: 6.5, impactEfficiency: "Awaiting company data", timeHorizon: "5-10 years", estimatedIRR: "Pending (Under NDA)" },
    gates: [true, true, true],
    competitors: [
      { name: "Stripe", description: "Dominant payment processor — API-first, massive scale", type: "competitor" },
      { name: "Circle (USDC)", description: "Stablecoin infrastructure — regulatory-first approach", type: "competitor" },
      { name: "Wise", description: "Cross-border payments — consumer-focused, transparent pricing", type: "competitor" },
    ],
    status: "Stealth",
    role: "Investor & Operator",
  },
  {
    name: "Menagerie",
    category: "Venture Studio",
    description: "Co-founded venture studio building at the intersections of Tony's seven doors.",
    investmentThesis: "The best companies emerge at intersections that nobody else sees. Menagerie is the studio that holds all seven doors open simultaneously and builds companies in the spaces between them. It's not a fund — it's a foundry.",
    hawkinsScore: 460,
    compassScores: [8, 7, 7, 8, 10, 8, 7],
    compositeScore: 7.9,
    irr: { keyImpactIndicator: "Companies launched from intersection insights", futureImpact: "30% of goal (20 companies by 2030)", impactMultiplier: 8.0, impactEfficiency: "$1 invested → $4.50 in ecosystem value created", timeHorizon: "10 years", estimatedIRR: "6.8x (Estimated)" },
    gates: [true, true, true],
    competitors: [
      { name: "Idealab", description: "Bill Gross's venture studio — pioneered the model", type: "competitor" },
      { name: "Pioneer Square Labs", description: "Seattle-based venture studio — similar structure", type: "competitor" },
      { name: "Atomic", description: "Jack Abraham's venture studio — consumer-focused", type: "competitor" },
    ],
    status: "Active",
    role: "Co-Founder",
  },
];

export default function IntelPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        The Work
      </p>
      <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Where the Thinking Meets the Doing
      </h1>
      <p className="mb-10 max-w-2xl leading-relaxed text-foreground/80">
        Every company and cause here passes through three gates before it gets my time. Then it
        gets scored on seven dimensions of impact, measured against Howard W. Buffett&apos;s
        Impact Rate of Return framework, and calibrated on David Hawkins&apos; Map of
        Consciousness. This isn&apos;t a portfolio — it&apos;s an operating system for making sure
        the work goes where it actually matters.
      </p>

      <div className="mb-12 grid gap-5 sm:grid-cols-3">
        <div className="border-l-2 border-brand-gold bg-brand-gold/5 p-5">
          <p className="mb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
            Impact Compass (7 Dimensions)
          </p>
          <p className="text-sm text-muted-foreground">
            Trust Velocity, Consciousness Expansion, Regenerative Economics, Sovereignty &amp;
            Agency, Intersection Potential, Narrative Power, Durability. Each scored 1-10.
          </p>
        </div>
        <div className="border-l-2 border-[#4682B4] bg-[#4682B4]/5 p-5">
          <p className="mb-1.5 font-mono text-xs tracking-wide text-[#4682B4] uppercase">
            Impact Rate of Return (iRR)
          </p>
          <p className="text-sm text-muted-foreground">
            Howard W. Buffett&apos;s framework: calculates the <em>impact value of each dollar</em>,
            not the dollar value of impact.
          </p>
        </div>
        <div className="border-l-2 border-[#6B8E23] bg-[#6B8E23]/5 p-5">
          <p className="mb-1.5 font-mono text-xs tracking-wide text-[#6B8E23] uppercase">
            Hawkins Consciousness Score
          </p>
          <p className="text-sm text-muted-foreground">
            David Hawkins&apos; Map of Consciousness (20-1000). 200+ = integrity threshold. 500+ =
            love-driven. 700+ = enlightened.
          </p>
        </div>
      </div>

      <IntelPortfolio portfolio={PORTFOLIO} />

      <blockquote className="my-10 text-center font-heading text-xl italic text-foreground">
        Capital without consciousness is extraction. Consciousness without capital is poetry. The
        intersection is where civilizations get built.
      </blockquote>

      <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
          The Lesson
        </p>
        <p className="leading-relaxed text-foreground/80">
          Measure what matters, not what&apos;s easy to count. Howard Buffett taught us that the
          impact value of each dollar matters more than the dollar value of impact. David Hawkins
          showed us that consciousness calibrates everything. The portfolio that scores highest on
          both frameworks is the one that changes the world while generating returns. That&apos;s
          not idealism — that&apos;s the only strategy that survives the next twenty years.
        </p>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/blog" className="font-mono text-sm tracking-wide text-brand-gold">
          Read the Blog →
        </Link>
      </div>
    </div>
  );
}
