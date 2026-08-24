import { useState } from "react";
import {
  Section,
  SectionTitle,
  Eyebrow,
  Pullquote,
  FadeIn,
  Divider,
  NextPage,
} from "@/components/Editorial";
import AutoLinkedText from "@/components/AutoLinkedText";
import SEO from "@/components/SEO";

/* ── Hawkins Map of Consciousness reference ── */
const hawkinsLabel = (score: number) => {
  if (score >= 700) return { label: "Enlightenment", color: "#D4B96A" };
  if (score >= 600) return { label: "Peace", color: "#6B8E23" };
  if (score >= 540) return { label: "Joy", color: "#2E8B57" };
  if (score >= 500) return { label: "Love", color: "#C06070" };
  if (score >= 400) return { label: "Reason", color: "#4682B4" };
  if (score >= 350) return { label: "Acceptance", color: "#5F9EA0" };
  if (score >= 310) return { label: "Willingness", color: "#6A5ACD" };
  if (score >= 250) return { label: "Neutrality", color: "#708090" };
  if (score >= 200) return { label: "Courage", color: "#B8860B" };
  return { label: "Below Integrity", color: "#8B0000" };
};

/* ── Impact Compass dimensions ── */
const compassDimensions = [
  "Trust Velocity",
  "Consciousness Expansion",
  "Regenerative Economics",
  "Sovereignty & Agency",
  "Intersection Potential",
  "Narrative Power",
  "Durability",
];

/* ── iRR Framework (Howard W. Buffett) ── */
interface IRRData {
  keyImpactIndicator: string;
  futureImpact: string;
  impactMultiplier: number;
  impactEfficiency: string;
  timeHorizon: string;
  estimatedIRR: string;
}

interface PortCo {
  name: string;
  category: string;
  description: string;
  investmentThesis: string;
  hawkinsScore: number;
  compassScores: number[];
  compositeScore: number;
  irr: IRRData;
  gates: [boolean, boolean, boolean];
  competitors: { name: string; description: string; type: "competitor" | "partner" | "adjacent" }[];
  status: "Active" | "Stealth" | "Exited";
  role: string;
}

const portfolio: PortCo[] = [
  {
    name: "RampRate",
    category: "Enterprise Technology & AI",
    description: "IT sourcing & benchmarking firm. $10B+ benchmarked. SPY Index holds 1M+ data points. B Corp certified.",
    investmentThesis: "Trust is the ultimate moat in enterprise procurement. After 25 years of benchmarking every major cloud, colocation, and network deal, RampRate's data advantage is compounding — not depreciating. The SPY Index is the Bloomberg Terminal of infrastructure sourcing.",
    hawkinsScore: 400,
    compassScores: [9, 5, 7, 8, 9, 7, 10],
    compositeScore: 7.9,
    irr: {
      keyImpactIndicator: "Dollars saved for clients through optimized sourcing",
      futureImpact: "85% of goal ($30B+ lifetime savings target)",
      impactMultiplier: 8.5,
      impactEfficiency: "$1 advisory spend → $47 client savings",
      timeHorizon: "25 years (ongoing)",
      estimatedIRR: "9.2x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Gartner", description: "Global research & advisory — broader but shallower in sourcing", type: "competitor" as const },
      { name: "ISG (TPI)", description: "IT services sourcing — traditional RFP-driven model", type: "competitor" as const },
      { name: "Everest Group", description: "IT services research — strong in outsourcing analytics", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Token holders actively funding regenerative projects",
      futureImpact: "40% of goal (10,000 active token holders)",
      impactMultiplier: 9.0,
      impactEfficiency: "$1 invested → $3.20 regenerative impact deployed",
      timeHorizon: "10 years",
      estimatedIRR: "8.7x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Republic", description: "Crowdfunding platform — broader but less impact-focused", type: "competitor" as const },
      { name: "Giveth", description: "Blockchain-native giving — decentralized but less structured", type: "competitor" as const },
      { name: "Flowcarbon", description: "Tokenized carbon credits — similar mechanism, different asset class", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Patients treated with mycological therapeutics",
      futureImpact: "15% of goal (1M patients by 2035)",
      impactMultiplier: 9.5,
      impactEfficiency: "$1 invested → projected $8.40 in healthcare cost reduction",
      timeHorizon: "12 years",
      estimatedIRR: "7.8x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Compass Pathways", description: "Psilocybin therapy — FDA Breakthrough, synthetic approach", type: "competitor" as const },
      { name: "MAPS/Lykos", description: "MDMA-assisted therapy — regulatory pioneer", type: "competitor" as const },
      { name: "Numinus", description: "Psychedelic-assisted therapy clinics — service model", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Patients accessing FDA-approved psychedelic therapy",
      futureImpact: "20% of goal (500K patients by 2035)",
      impactMultiplier: 8.0,
      impactEfficiency: "$1 invested → projected $12 in reduced mental health burden",
      timeHorizon: "8 years",
      estimatedIRR: "6.5x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Compass Pathways", description: "Direct competitor — synthetic psilocybin, larger market cap", type: "competitor" as const },
      { name: "MindMed", description: "LSD-based therapeutics — different molecule, similar market", type: "competitor" as const },
      { name: "Cybin", description: "Deuterated psilocybin — novel chemistry approach", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Practitioners and patients connected through the network",
      futureImpact: "25% of goal (50K active connections)",
      impactMultiplier: 7.5,
      impactEfficiency: "$1 invested → 12 meaningful practitioner-patient connections",
      timeHorizon: "6 years",
      estimatedIRR: "5.2x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Psychable", description: "Psychedelic provider directory — simpler model", type: "competitor" as const },
      { name: "Mindbloom", description: "At-home ketamine therapy — consumer-facing", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Clinical trial participants generating evidence",
      futureImpact: "35% of goal (500K participants)",
      impactMultiplier: 8.5,
      impactEfficiency: "$1 invested → 85 data points generated (vs. 3 in traditional trials)",
      timeHorizon: "8 years",
      estimatedIRR: "7.1x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Medable", description: "Decentralized clinical trials — broader pharma focus", type: "competitor" as const },
      { name: "Science 37", description: "Virtual clinical trials — similar model, different market", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Users experiencing VR-induced mindfulness sessions",
      futureImpact: "20% of goal (5M sessions annually)",
      impactMultiplier: 7.0,
      impactEfficiency: "$1 invested → 200 mindfulness sessions delivered",
      timeHorizon: "7 years",
      estimatedIRR: "4.9x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Calm", description: "Meditation app — massive user base, no VR", type: "competitor" as const },
      { name: "Headspace/XR", description: "Mindfulness + emerging XR experiments", type: "competitor" as const },
      { name: "Innerworld", description: "VR mental health support communities", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Transaction volume processed through modernized rails",
      futureImpact: "Awaiting company data",
      impactMultiplier: 6.5,
      impactEfficiency: "Awaiting company data",
      timeHorizon: "5-10 years",
      estimatedIRR: "Pending (Under NDA)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Stripe", description: "Dominant payment processor — API-first, massive scale", type: "competitor" as const },
      { name: "Circle (USDC)", description: "Stablecoin infrastructure — regulatory-first approach", type: "competitor" as const },
      { name: "Wise", description: "Cross-border payments — consumer-focused, transparent pricing", type: "competitor" as const },
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
    irr: {
      keyImpactIndicator: "Companies launched from intersection insights",
      futureImpact: "30% of goal (20 companies by 2030)",
      impactMultiplier: 8.0,
      impactEfficiency: "$1 invested → $4.50 in ecosystem value created",
      timeHorizon: "10 years",
      estimatedIRR: "6.8x (Estimated)",
    },
    gates: [true, true, true],
    competitors: [
      { name: "Idealab", description: "Bill Gross's venture studio — pioneered the model", type: "competitor" as const },
      { name: "Pioneer Square Labs", description: "Seattle-based venture studio — similar structure", type: "competitor" as const },
      { name: "Atomic", description: "Jack Abraham's venture studio — consumer-focused", type: "competitor" as const },
    ],
    status: "Active",
    role: "Co-Founder",
  },
];

/* ── Compass Radar (simple CSS-based) ── */
function CompassRadar({ scores }: { scores: number[] }) {
  const max = 10;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem", fontSize: "0.78rem" }}>
      <SEO title="Intel" description="The work — impact theses, Hawkins consciousness scores, competitive landscape, and impact metrics for the companies and causes Tony Greenberg is building." path="/intel"
        indexable={true} />
      {compassDimensions.map((dim, i) => (
        <div key={dim} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ flex: "0 0 110px", color: "#555", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem" }}>
            {dim}
          </div>
          <div style={{ flex: 1, height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                width: `${(scores[i] / max) * 100}%`,
                height: "100%",
                background: scores[i] >= 9 ? "#D4B96A" : scores[i] >= 7 ? "#8B6914" : "#A0A0A0",
                borderRadius: "3px",
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#333", minWidth: "20px" }}>
            {scores[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Hawkins Badge ── */
function HawkinsBadge({ score }: { score: number }) {
  const { label, color } = hawkinsLabel(score);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {score}
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#555" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Gates Check ── */
function GatesCheck({ gates }: { gates: [boolean, boolean, boolean] }) {
  const labels = ["Phone Call Test", "Dinner Table Test", "Tombstone Test"];
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {labels.map((label, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            color: gates[i] ? "#2E8B57" : "#8B0000",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{gates[i] ? "✓" : "✗"}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

export default function Intel() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div>
      <Section>
        <FadeIn>
          <Eyebrow>The Work</Eyebrow>
          <SectionTitle>Where the Thinking Meets the Doing</SectionTitle>
          <p style={{ fontSize: "1.05rem", color: "#222", lineHeight: 1.9, maxWidth: "680px", marginBottom: "1.5rem" }}>
            Every company and cause here passes through three gates before it gets my time. Then it gets scored on seven dimensions of impact, measured against Howard W. Buffett's Impact Rate of Return framework, and calibrated on David Hawkins' Map of Consciousness. This isn't a portfolio — it's an operating system for making sure the work goes where it actually matters.
          </p>
        </FadeIn>

        {/* Framework Legend */}
        <FadeIn delay={0.1}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <div style={{ padding: "1.2rem", borderLeft: "3px solid #8B6914", background: "rgba(212,185,106,0.06)" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.4rem" }}>
                Impact Compass (7 Dimensions)
              </div>
              <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.6, margin: 0 }}>
                Trust Velocity, Consciousness Expansion, Regenerative Economics, Sovereignty & Agency, Intersection Potential, Narrative Power, Durability. Each scored 1-10.
              </p>
            </div>
            <div style={{ padding: "1.2rem", borderLeft: "3px solid #4682B4", background: "rgba(70,130,180,0.06)" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#4682B4", marginBottom: "0.4rem" }}>
                Impact Rate of Return (iRR)
              </div>
              <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.6, margin: 0 }}>
                Howard W. Buffett's framework: calculates the <em>impact value of each dollar</em>, not the dollar value of impact. Key Impact Indicator × Future Impact ÷ (Efficiency × Multiplier) over Time.
              </p>
            </div>
            <div style={{ padding: "1.2rem", borderLeft: "3px solid #6B8E23", background: "rgba(107,142,35,0.06)" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#6B8E23", marginBottom: "0.4rem" }}>
                Hawkins Consciousness Score
              </div>
              <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.6, margin: 0 }}>
                David Hawkins' Map of Consciousness (20-1000). Calibrates the energetic frequency of the organization's mission. 200+ = integrity threshold. 500+ = love-driven. 700+ = enlightened.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* Portfolio Companies */}
      <Section>
        {portfolio.map((co, idx) => (
          <FadeIn key={co.name} delay={idx * 0.03}>
            <div
              style={{
                padding: "2rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.3rem" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#111", margin: 0 }}>
                      {co.name}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "10px",
                        background: co.status === "Active" ? "rgba(46,139,87,0.1)" : co.status === "Stealth" ? "rgba(139,105,20,0.1)" : "rgba(0,0,0,0.06)",
                        color: co.status === "Active" ? "#2E8B57" : co.status === "Stealth" ? "#8B6914" : "#555",
                      }}
                    >
                      {co.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#8B6914", letterSpacing: "0.05em" }}>
                      {co.category}
                    </span>
                    {co.role && (
                      <span style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.78rem",
                        color: "#555",
                        padding: "0.1rem 0.5rem",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        background: "rgba(255,255,255,0.6)",
                      }}>
                        {co.role}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <HawkinsBadge score={co.hawkinsScore} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#8B6914" }}>
                      {co.compositeScore.toFixed(1)}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                      Compass
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "1rem", color: "#333", lineHeight: 1.7, marginBottom: "0.8rem" }}>
                <AutoLinkedText>{co.description}</AutoLinkedText>
              </p>

              {/* Expand/collapse */}
              <button
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.3rem 0",
                }}
              >
                {expandedIdx === idx ? "— Collapse" : "+ Full Analysis"}
              </button>

              {expandedIdx === idx && (
                <div style={{ marginTop: "1.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(139,105,20,0.15)" }}>
                  {/* Investment Thesis */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.4rem" }}>
                      Why This Matters
                    </div>
                    <p style={{ fontSize: "1rem", color: "#222", lineHeight: 1.8,  }}>
                      "<AutoLinkedText>{co.investmentThesis}</AutoLinkedText>"
                    </p>
                  </div>

                  {/* Three Gates */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.4rem" }}>
                      The Three Gates
                    </div>
                    <GatesCheck gates={co.gates} />
                  </div>

                  {/* Impact Compass */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.6rem" }}>
                      Impact Compass Scores
                    </div>
                    <CompassRadar scores={co.compassScores} />
                  </div>

                  {/* iRR Framework */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#4682B4", marginBottom: "0.6rem" }}>
                      Impact Rate of Return (iRR) — Howard W. Buffett Framework
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "1.05rem" }}>
                      <div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555" }}>Key Impact Indicator:</span>
                        <div style={{ color: "#222" }}>{co.irr.keyImpactIndicator}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555" }}>Future Impact:</span>
                        <div style={{ color: "#222" }}>{co.irr.futureImpact}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555" }}>Impact Multiplier:</span>
                        <div style={{ color: "#222" }}>{co.irr.impactMultiplier}x</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555" }}>Impact Efficiency:</span>
                        <div style={{ color: "#222" }}>{co.irr.impactEfficiency}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555" }}>Time Horizon:</span>
                        <div style={{ color: "#222" }}>{co.irr.timeHorizon}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#555" }}>Estimated iRR:</span>
                        <div style={{ color: "#8B6914", fontWeight: 700 }}>{co.irr.estimatedIRR}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#999", marginTop: "0.5rem",  }}>
                      * All iRR figures are estimated based on available data. Companies are invited to submit verified metrics.
                    </div>
                  </div>

                  {/* Competitors */}
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.4rem" }}>
                      Competitive Landscape
                    </div>
                    {co.competitors.map((comp) => (
                      <div key={comp.name} style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.3rem" }}>
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.78rem",
                            padding: "0.1rem 0.35rem",
                            borderRadius: "3px",
                            background: comp.type === "partner" ? "rgba(46,139,87,0.08)" : comp.type === "adjacent" ? "rgba(70,130,180,0.08)" : "rgba(139,0,0,0.08)",
                            color: comp.type === "partner" ? "#2E8B57" : comp.type === "adjacent" ? "#4682B4" : "#8B0000",
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {comp.type === "partner" ? "Partner" : comp.type === "adjacent" ? "Adjacent" : "Competitor"}
                        </span>
                        <span style={{ fontSize: "1.05rem", color: "#222", fontWeight: 600 }}>{comp.name}</span>
                        <span style={{ fontSize: "1.05rem", color: "#555" }}>— <AutoLinkedText>{comp.description}</AutoLinkedText></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </Section>

      <Section>
        <FadeIn>
          <Pullquote>
            Capital without consciousness is extraction. Consciousness without capital is poetry. The intersection is where civilizations get built.
          </Pullquote>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div
            style={{
              padding: "1.5rem",
              borderLeft: "3px solid #8B6914",
              background: "rgba(212,185,106,0.06)",
            }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem" }}>
              The Lesson
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#222" }}>
              Measure what matters, not what's easy to count. Howard Buffett taught us that the impact value of each dollar matters more than the dollar value of impact. David Hawkins showed us that consciousness calibrates everything. The portfolio that scores highest on both frameworks is the one that changes the world while generating returns. That's not idealism — that's the only strategy that survives the next twenty years.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/blog" label="Read the Blog" />
    </div>
  );
}
