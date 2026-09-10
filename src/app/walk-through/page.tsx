import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Ported from legacy client/src/pages/WalkThrough.tsx ("The Folio"). Real
// content kept as-is. Not reproduced: AutoLinkedText's automatic entity
// hyperlinking (driven by the site-wide client/src/data/linkMap.ts) — that's
// a genuine cross-cutting feature affecting many pages/posts, not a one-off
// for this page; tracked as an open item in NEXTJS-MIGRATION-TODO.md's
// internal-cross-link-structure note rather than half-ported here. The Tony
// portrait is the recovered original served from managed storage.

export const metadata: Metadata = {
  title: "The Seven Doors",
  description:
    "Walk through Tony Greenberg's seven domains: Enterprise Technology, Social Impact, Psychedelic Medicine, Payments, Health & Longevity, Consumer Advocacy, and Web3.",
  alternates: { canonical: "/walk-through" },
};

const HERO_IMAGE = "/manus-storage/about-walkthrough-portrait_f97955e3.webp";

type DoorEntity = { name: string; role: string; note?: string; url?: string };
type Door = {
  num: string;
  title: string;
  content: string;
  entities: DoorEntity[];
  ask: string;
  deeperLink: string;
  deeperLabel: string;
};

const DOORS: Door[] = [
  {
    num: "01",
    title: "Enterprise Technology & AI",
    content: `RampRate has been the objective lever in enterprise technology for 25 years. We've benchmarked $10B+ in transactions for Microsoft, Disney, Goldman Sachs, and Nike. Our SPY Index holds 1M+ data points on pricing, performance, and vendor behavior across the IT services landscape. When everyone and their golden retriever is doing AI and data centers, you need someone who's been in the room long enough to tell you which rooms are worth entering.`,
    entities: [{ name: "RampRate", role: "Founder & CEO, 25 years", url: "https://ramprate.com" }],
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
      {
        name: "Capria.VC",
        role: "LP",
        note: "India's top social impact fund — 1.2M people impacted",
      },
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
      {
        name: "MycoMedica Life Sciences",
        role: "Investor",
        note: "Paul Stamets' patent portfolio company — mycological therapeutics",
      },
      {
        name: "AtaiBeckley",
        role: "Investor & Advisor",
        note: "FDA Breakthrough Therapy designation",
      },
      { name: "Wake Network", role: "Investor & Advisor", note: "Psychedelic wellness network" },
      {
        name: "Radicle Science",
        role: "Investor",
        note: "Decentralized clinical trials — 10x cheaper, 5x faster",
      },
      {
        name: "Tripp",
        role: "Investor & Advisor",
        note: "VR-based mindfulness and altered states",
      },
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
      {
        name: "The Corridor",
        role: "Investor & Operator",
        note: "Four companies — details under NDA",
      },
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
      {
        name: "Hiro Technologies",
        role: "Investor",
        note: "Miki Agrawal — MycoDigestible diapers",
      },
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
      {
        name: "Homeaglow Exposed",
        role: "Investigator & Publisher",
        url: "https://homeaglowexposed.com",
        note: "Filed with CA AG and FTC",
      },
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
      {
        name: "Yoti",
        role: "Partner",
        note: "Digital ID & age verification — 55% YoY revenue growth",
      },
      { name: "Bluenumber", role: "Partner", note: "Global identity for supply chains" },
      { name: "Tea", role: "Investor", note: "Equitable open-source for Web3" },
      { name: "Menagerie", role: "Co-Founder", note: "Build clubs, DAOs, nonprofits in Web3" },
      { name: "Vatom", role: "Partner", note: "Brand metaverse creation" },
      {
        name: "Synternet",
        role: "Advisor & Investor",
        note: "Formerly NOIA Network — the Waze of internet congestion",
      },
      { name: "Block.one", role: "Investor", note: "Open-source software for transparency" },
      { name: "RAIR", role: "Investor", note: "NFT-based DRM & token-gated streaming" },
      { name: "WAX", role: "Investor", note: "High-throughput NFT & gaming chain" },
      { name: "Pynths", role: "Investor", note: "Cross-chain synthetic-asset protocol" },
      { name: "Nakji Network", role: "Investor", note: "Blockchain data indexing" },
      {
        name: "DEVxDAO",
        role: "Former Client",
        note: "Capital deployment for decentralized projects",
      },
    ],
    ask: "Self-sovereign identity, decentralized governance, healthcare data ownership, Web3 infrastructure, blockchain investments",
    deeperLink: "/invest",
    deeperLabel: "See the full portfolio →",
  },
];

function EntityPill({ entity }: { entity: DoorEntity }) {
  const pill = (
    <span className="inline-flex items-baseline gap-1.5 rounded-sm border border-brand-gold/10 bg-brand-gold/5 px-2.5 py-1.5 text-sm text-foreground transition-colors hover:border-brand-gold/30 hover:bg-brand-gold/10">
      <strong className="font-semibold text-foreground">{entity.name}</strong>
      <span className="font-mono text-xs text-brand-gold">{entity.role}</span>
      {entity.note && <span className="text-xs text-muted-foreground">— {entity.note}</span>}
    </span>
  );
  if (!entity.url) return pill;
  return (
    <a href={entity.url} target="_blank" rel="noopener noreferrer">
      {pill}
    </a>
  );
}

export default function WalkThroughPage() {
  return (
    <div>
      <div className="relative h-72 overflow-hidden sm:h-96">
        <Image
          src={HERO_IMAGE}
          alt="Tony Greenberg"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          The Framework
        </p>
        <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          The Seven Doors
        </h1>
        <p className="mb-4 text-foreground/80">
          Every person who walks through my door — physical or digital — is walking into one of
          seven worlds. Some people walk through one door. Some walk through all seven. The magic
          happens at the intersections. Here&apos;s what&apos;s behind each one.
        </p>
      </div>

      <div className="mx-auto max-w-3xl divide-y divide-border px-6">
        {DOORS.map((door) => (
          <div key={door.num} className="flex gap-6 py-10">
            <div className="shrink-0 font-heading text-5xl font-bold text-brand-gold-light/40">
              {door.num}
            </div>
            <div className="flex-1">
              <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">{door.title}</h2>
              <p className="mb-4 leading-relaxed text-foreground/80">{door.content}</p>
              {door.entities.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {door.entities.map((entity) => (
                    <EntityPill key={entity.name} entity={entity} />
                  ))}
                </div>
              )}
              <p className="mb-3 border-l-2 border-brand-gold-light/30 pl-4 text-brand-gold">
                <strong>Ask me about:</strong> {door.ask}
              </p>
              <Link
                href={door.deeperLink}
                className="inline-block border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold"
              >
                {door.deeperLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <blockquote className="mx-auto max-w-2xl px-6 py-10 text-center font-heading text-xl italic text-foreground">
        &ldquo;Seven doors sounds like chaos. It&apos;s not. It&apos;s a system — each door
        reinforces the others. The enterprise data informs the tokenization models. The health
        protocols inform the psychedelic investments.&rdquo;
        <footer className="mt-3 font-mono text-xs text-muted-foreground">— TG</footer>
      </blockquote>

      <div className="mx-auto max-w-2xl px-6 pb-6">
        <blockquote className="border-l-2 border-brand-gold pl-5 text-foreground/80 italic">
          &ldquo;Every one of my companies is on a rolling close. We never stop building. We never
          stop connecting. Tell me what you&apos;re trying to achieve and my biz dev team will get
          you connected to the good stuff. That&apos;s not a pitch — that&apos;s how we
          operate.&rdquo;
          <footer className="mt-2 font-mono text-xs text-muted-foreground not-italic">— TG</footer>
        </blockquote>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-16">
        <div className="rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
          <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
            The Lesson
          </p>
          <p className="leading-relaxed text-foreground/80">
            Seven doors sounds like chaos. It&apos;s not. It&apos;s a system — each door reinforces
            the others. The enterprise data informs the tokenization models. The health protocols
            inform the psychedelic investments. The consumer advocacy sharpens the ethics across
            everything. The lesson: depth in multiple domains isn&apos;t distraction. It&apos;s
            architecture.
          </p>
        </div>
      </div>

      <div className="border-t border-border py-8 text-center">
        <Link href="/the-territory" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to The Territory <ForwardIcon aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
