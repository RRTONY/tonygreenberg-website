/*
 * DESIGN: "The Folio" — 7 Doors detail page
 * Full content from the template's doors section
 * Enriched with concrete examples, named investments, and cross-links
 */

import { Link } from "wouter";
import {
  Section,
  SectionTitle,
  Eyebrow,
  HeroImage,
  NextPage,
  FadeIn,
  Divider,
  Spacer,
  InlineQuote,
} from "@/components/Editorial";
import AutoLinkedText from "@/components/AutoLinkedText";
import { ScrollQuote } from "@/components/Enhancements";
import SEO from "@/components/SEO";

const HERO_DOORS = "/api/img/tony-headshot_2d63de23.jpg";

interface DoorEntity {
  name: string;
  role: string;
  note?: string;
  url?: string;
}

interface Door {
  num: string;
  title: string;
  content: string;
  entities: DoorEntity[];
  ask: string;
  deeperLink: string;
  deeperLabel: string;
}

const doors: Door[] = [
  {
    num: "01",
    title: "Enterprise Technology & AI",
    content: `RampRate has been the objective lever in enterprise technology for 25 years. We've benchmarked $10B+ in transactions for Microsoft, Disney, Goldman Sachs, and Nike. Our SPY Index holds 1M+ data points on pricing, performance, and vendor behavior across the IT services landscape. When everyone and their golden retriever is doing AI and data centers, you need someone who's been in the room long enough to tell you which rooms are worth entering.`,
    entities: [
      { name: "RampRate", role: "Founder & CEO, 25 years", url: "https://ramprate.com" },
    ],
    ask: "Strategic sourcing, vendor negotiation, data center infrastructure, AI compute procurement",
    deeperLink: "/engine-room",
    deeperLabel: "See the full operation →",
  },
  {
    num: "02",
    title: "Social Impact & Tokenization",
    content: `ImpactSoul is a Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND (ocean & waterway cleanup), REX (paleontology research & conservation), SPACE (digital access for remote communities), and BEING (mental health treatment for underserved). Each community has a partner NGO and a pledged iconic asset. Create impact directly, or grow the asset to unlock the next donation.`,
    entities: [
      { name: "ImpactSoul", role: "Founder & CEO", url: "https://impactsoul.is" },
      { name: "Capria.VC", role: "LP", note: "India's top social impact fund — 1.2M people impacted" },
      { name: "Supernode Ventures", role: "LP", note: "Seed fund led by Laurel Touby" },
      { name: "Wavemaker Three-Sixty Health", role: "Investor", note: "Early-stage healthcare VC" },
      { name: "Belveron Partners Fund VI", role: "LP" },
      { name: "AngelsList The Fund LA I", role: "LP" },
      { name: "Tacit Capital LLC", role: "Investor", note: "PE firm — post-disruption rebuilding" },
      { name: "Akerna", role: "Advisor/Shareholder", note: "Exited" },
    ],
    ask: "Asset-backed impact tokens, community-driven philanthropy, B Corp certification, impact venture",
    deeperLink: "/invest",
    deeperLabel: "See the full portfolio →",
  },
  {
    num: "03",
    title: "Psychedelic Medicine",
    content: `Five active investments in consciousness infrastructure. Investor in MycoMedica Life Sciences, Paul Stamets' patent portfolio company — fungi are the original internet, 2.4 billion years of networked intelligence. AtaiBeckley holds FDA Breakthrough Therapy designation for treatment-resistant depression. Wake Network is the connective tissue between practitioners, patients, and researchers. Radicle Science runs the largest decentralized clinical trials ever conducted on natural products. Tripp is VR-based consciousness expansion — the gateway for people who aren't ready for a mushroom journey. The gap between legitimate research and marketing noise is wider than the Grand Canyon. I've gone deep into the science, the regulatory pathways, and the business models.`,
    entities: [
      { name: "MycoMedica Life Sciences", role: "Investor", note: "Paul Stamets' patent portfolio company — mycological therapeutics" },
      { name: "AtaiBeckley", role: "Investor & Advisor", note: "FDA Breakthrough Therapy designation" },
      { name: "Wake Network", role: "Investor & Advisor", note: "Psychedelic wellness network" },
      { name: "Radicle Science", role: "Investor", note: "Decentralized clinical trials — 10x cheaper, 5x faster" },
      { name: "Tripp", role: "Investor & Advisor", note: "VR-based mindfulness and altered states" },
    ],
    ask: "Psychedelic therapeutics, FDA pathways, consciousness research, investment opportunities",
    deeperLink: "/the-body",
    deeperLabel: "See the health protocols →",
  },
  {
    num: "04",
    title: "Payments & The Corridor",
    content: `Four payment processing companies through what we call "the corridor" — a payments infrastructure play at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance. The corridor handles transactions across gaming, healthcare, and enterprise commerce. Details under NDA. The opportunity is measured in billions. We hold the relationships on both sides of the bridge between traditional rails and blockchain settlement.`,
    entities: [
      { name: "The Corridor", role: "Investor & Operator", note: "Four companies — details under NDA" },
    ],
    ask: "Payment processing, stablecoin settlement, cross-border remittance, gaming payments",
    deeperLink: "/engine-room",
    deeperLabel: "See the engine room →",
  },
  {
    num: "05",
    title: "Health & Longevity",
    content: `Best-in-world peptide manufacturing partnerships. Exosomes & regenerative medicine research. Alt-therapy scorecards with Oura Ring biometrics using a 5-dimension evaluation: Efficacy (30%), Cost (25%), Time (20%), Safety (15%), Access (10%). Provider connections across every modality I've tested. Not biohacking vanity — measurement-driven wellness with accountability built in.`,
    entities: [
      { name: "Hiro Technologies", role: "Investor", note: "Miki Agrawal — MycoDigestible diapers" },
      { name: "XR Workout", role: "Investor", note: "VR/XR fitness" },
      { name: "Wavemaker Three-Sixty Health", role: "Investor", note: "Early-stage healthcare VC" },
    ],
    ask: "Peptides, regenerative medicine, biometric-driven wellness, alt therapy protocols",
    deeperLink: "/the-body",
    deeperLabel: "See the full health deep-dive →",
  },
  {
    num: "06",
    title: "Consumer Advocacy",
    content: `Dark patterns, fake reviews, exploited workers. When a company offends my principles, I don't write a Yelp review — I build an investigative website and file regulatory complaints. Filed with the CA Attorney General and FTC. Homeaglow Exposed is the flagship example. When a satisficer finds a company that offends his principles, the crusade is the product.`,
    entities: [
      { name: "Homeaglow Exposed", role: "Investigator & Publisher", url: "https://homeaglowexposed.com", note: "Filed with CA AG and FTC" },
    ],
    ask: "Consumer protection, dark pattern investigations, regulatory filings",
    deeperLink: "/engine-room",
    deeperLabel: "See the full operation →",
  },
  {
    num: "07",
    title: "Decentralized Governance & Web3",
    content: `The anonymous healthcare wallet is the flagship: self-sovereign identity infrastructure holding your complete health file, DNA records, emergency information, prescription history, and insurance data. Not "privacy-ish." Actual, cryptographic, zero-knowledge-proof, self-sovereign identity — where you own your data and no hospital, insurance company, or government accesses it without your explicit, granular, revocable consent. But the Web3 thesis goes deeper — a portfolio of investments across blockchain infrastructure, decentralized governance, and digital identity.`,
    entities: [
      { name: "Yoti", role: "Partner", note: "Digital ID & age verification — 55% YoY revenue growth" },
      { name: "Bluenumber", role: "Partner", note: "Global identity for supply chains" },
      { name: "Tea", role: "Investor", note: "Equitable open-source for Web3" },
      { name: "Menagerie", role: "Co-Founder", note: "Build clubs, DAOs, nonprofits in Web3" },
      { name: "Vatom", role: "Partner", note: "Brand metaverse creation" },
      { name: "Synternet", role: "Advisor & Investor", note: "Formerly NOIA Network — the Waze of internet congestion" },
      { name: "Block.one", role: "Investor", note: "Open-source software for transparency" },
      { name: "RAIR", role: "Investor", note: "NFT-based DRM & token-gated streaming" },
      { name: "WAX", role: "Investor", note: "High-throughput NFT & gaming chain" },
      { name: "Pynths", role: "Investor", note: "Cross-chain synthetic-asset protocol" },
      { name: "Nakji Network", role: "Investor", note: "Blockchain data indexing" },
      { name: "DEVxDAO", role: "Former Client", note: "Capital deployment for decentralized projects" },
    ],
    ask: "Self-sovereign identity, decentralized governance, healthcare data ownership, Web3 infrastructure, blockchain investments",
    deeperLink: "/invest",
    deeperLabel: "See the full portfolio →",
  },
];

/* ── Entity pill component ── */
function EntityPill({ entity }: { entity: DoorEntity }) {
  const inner = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.4rem",
        padding: "0.3rem 0.7rem",
        background: "rgba(139,105,20,0.06)",
        border: "1px solid rgba(139,105,20,0.12)",
        borderRadius: "4px",
        fontSize: "0.85rem",
        lineHeight: 1.5,
        color: "#222",
        transition: "all 0.15s ease",
      }}
    >
      <strong style={{ color: "#111", fontWeight: 600 }}>{entity.name}</strong>
      <span style={{ color: "#8B6914", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem" }}>
        {entity.role}
      </span>
      {entity.note && (
        <span style={{ color: "#666", fontSize: "0.78rem" }}>— {entity.note}</span>
      )}
    </span>
  );

  if (entity.url) {
    return (
      <a
        href={entity.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        onMouseEnter={(e) => {
          const span = e.currentTarget.querySelector("span") as HTMLElement;
          if (span) {
            span.style.borderColor = "rgba(139,105,20,0.3)";
            span.style.background = "rgba(139,105,20,0.1)";
          }
        }}
        onMouseLeave={(e) => {
          const span = e.currentTarget.querySelector("span") as HTMLElement;
          if (span) {
            span.style.borderColor = "rgba(139,105,20,0.12)";
            span.style.background = "rgba(139,105,20,0.06)";
          }
        }}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

export default function WalkThrough() {
  return (
    <div>
      <SEO title="The Seven Doors" description="Walk through Tony Greenberg's seven domains: Enterprise Technology, Social Impact, Psychedelic Medicine, Payments, Health & Longevity, Consumer Advocacy, and Web3." path="/walk-through"
        indexable={true} />
      <HeroImage src={HERO_DOORS} alt="Seven ornate doors with golden light" />

      <Section>
        <FadeIn>
          <Eyebrow>The Framework</Eyebrow>
          <SectionTitle>The Seven Doors</SectionTitle>
          <p style={{ color: "#222", marginBottom: "1.2rem" }}>
            Every person who walks through my door — physical or digital — is walking into one of seven worlds. Some people walk through one door. Some walk through all seven. The magic happens at the intersections. Here's what's behind each one.
          </p>
        </FadeIn>
      </Section>

      {doors.map((door, i) => (
        <div key={door.num}>
          {i > 0 && (
            <>
              <Divider />
              <Spacer />
            </>
          )}
          <Section>
            <FadeIn>
              <div className="flex items-start gap-6">
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "4rem",
                    fontWeight: 700,
                    color: "#D4B96A",
                    lineHeight: 1,
                    opacity: 0.35,
                    flexShrink: 0,
                  }}
                >
                  {door.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "#111",
                      marginBottom: "1rem",
                    }}
                  >
                    {door.title}
                  </h3>
                  <p style={{ color: "#222", lineHeight: 1.85, marginBottom: "1rem" }}>
                    <AutoLinkedText>{door.content}</AutoLinkedText>
                  </p>

                  {/* Named entities / investments */}
                  {door.entities.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {door.entities.map((entity) => (
                        <EntityPill key={entity.name} entity={entity} />
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: "1.05rem",
                      color: "#8B6914",
                      paddingLeft: "1rem",
                      borderLeft: "2px solid #E8DFC4",
                      marginBottom: "0.8rem",
                    }}
                  >
                    <strong>Ask me about:</strong> {door.ask}
                  </div>

                  {/* Cross-link to deeper page */}
                  <Link
                    href={door.deeperLink}
                    style={{
                      display: "inline-block",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      letterSpacing: "0.04em",
                      color: "#8B6914",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(139,105,20,0.3)",
                      paddingBottom: "1px",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {door.deeperLabel}
                  </Link>
                </div>
              </div>
            </FadeIn>
          </Section>
        </div>
      ))}

      <ScrollQuote
        quote="Seven doors sounds like chaos. It's not. It's a system — each door reinforces the others. The enterprise data informs the tokenization models. The health protocols inform the psychedelic investments."
        attribution="— TG"
      />

      <Section>
        <FadeIn>
          <InlineQuote attr="— TG">
            "Every one of my companies is on a rolling close. We never stop building. We never stop connecting. Tell me what you're trying to achieve and my biz dev team will get you connected to the good stuff. That's not a pitch — that's how we operate."
          </InlineQuote>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div
            style={{
              padding: "1.5rem",
              borderLeft: "3px solid #8B6914",
              background: "rgba(212,185,106,0.06)",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.5rem",
              }}
            >
              The Lesson
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#222" }}>
              Seven doors sounds like chaos. It's not. It's a system — each door reinforces the others. The enterprise data informs the tokenization models. The health protocols inform the psychedelic investments. The consumer advocacy sharpens the ethics across everything. The lesson: depth in multiple domains isn't distraction. It's architecture.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/the-territory" label="Continue to The Territory" />
    </div>
  );
}
