import type { Metadata } from "next";
import { JourneysAccordion, type Journey } from "@/components/marketing/journeys-accordion";

// Ported from legacy client/src/pages/Journeys.tsx. Real content kept as-is,
// with two link fixes: (1) stops that pointed at "/" meant the legacy
// homepage (Home.tsx) — remapped to "/the-letter" since "/" is now the blog
// index in this app; (2) three "Crusade Files" stops pointed at the generic
// "/blog" placeholder instead of the specific post being described, same
// class of bug fixed on the homepage's "Most Read" list — corrected to the
// real migrated post slugs.

export const metadata: Metadata = {
  title: "Journeys",
  description:
    "Guided paths through Tony Greenberg's site — curated routes for a particular kind of curiosity.",
  alternates: { canonical: "/journeys" },
};

const JOURNEYS: Journey[] = [
  {
    id: "the-thinker",
    icon: "thinker",
    title: "The Thinker's Thread",
    subtitle: "For the philosophically restless",
    description:
      "You read Harari on the plane and Rushkoff in the bath. You suspect that the collapse in Meaning is structural, not psychological. This path connects the dots between consciousness research, decentralized governance, and why a guy who benchmarks data centers also invests in psychedelic medicine.",
    duration: "~20 min read",
    mood: "Contemplative. Occasionally unsettling.",
    stops: [
      {
        page: "The Letter",
        href: "/the-letter",
        section: "Why Now?",
        teaser: "The collapse in Meaning — and why this document exists",
      },
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 03: Psychedelic Medicine",
        teaser: "Six investments in consciousness infrastructure",
      },
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 07: Decentralized Governance",
        teaser: "The anonymous healthcare wallet and self-sovereign identity",
      },
      {
        page: "The Nightstand",
        href: "/the-nightstand",
        section: "The 'How Did We Get Here' Shelf",
        teaser: "Nexus, The Great Simplification, Recapture the Rapture",
      },
      {
        page: "The Nightstand",
        href: "/the-nightstand",
        section: "The 'How Do I Not Lose My Mind' Shelf",
        teaser: "Sand Talk, The Immortality Key, Team Human",
      },
      {
        page: "The Territory",
        href: "/the-territory",
        section: "The Most Important Thing I've Learned",
        teaser: "What being of service really means — and why it took embarrassingly long",
      },
    ],
  },
  {
    id: "the-operator",
    icon: "operator",
    title: "The Operator's Playbook",
    subtitle: "For builders who need the objective lever",
    description:
      "You run a company. You're bleeding on vendor contracts. You need someone who's sat across the table from Microsoft, Disney, and Goldman Sachs for 25 years and can tell you which rooms are worth entering. This path is the business case — RampRate, the SPY Index, the advisory board, and the data center elephant in the room.",
    duration: "~15 min read",
    mood: "Sharp. Practical. Occasionally profane.",
    stops: [
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 01: Enterprise Technology & AI",
        teaser: "$10B+ benchmarked. 1M+ data points. The objective lever.",
      },
      {
        page: "Engine Room",
        href: "/engine-room",
        section: "The Advisory Board",
        teaser: "Not advisors — co-conspirators. Voltron assembled.",
      },
      {
        page: "Engine Room",
        href: "/engine-room",
        section: "The Elephant Not in the Room",
        teaser: "Data centers, Dean Nelson, and the positions that pay the mortgage",
      },
      {
        page: "Under NDA",
        href: "/under-nda",
        section: "The Corridor",
        teaser: "Four payment companies. $5B-$15B annually. Under NDA.",
      },
      {
        page: "The Nightstand",
        href: "/the-nightstand",
        section: "AI Alignment Prompts",
        teaser: "Paste these into your AI and find where our worlds overlap",
      },
      {
        page: "Pick Up the Phone",
        href: "/pick-up-the-phone",
        section: "Contact",
        teaser: "Reach out. He actually responds.",
      },
    ],
  },
  {
    id: "the-impact-soul",
    icon: "impact",
    title: "The Impact Trail",
    subtitle: "For regenerative capitalists and reluctant optimists",
    description:
      "You believe profit and purpose shouldn't be different departments. You've heard about tokenization but you're not sure if it's real or just crypto bros in Patagonia vests. This path walks you through ImpactSoul's ABIT model, the live token ecosystems, the grants engine, and why a dinosaur skeleton might fund a school in rural India.",
    duration: "~18 min read",
    mood: "Hopeful. Structurally rigorous. Weird in the best way.",
    stops: [
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 02: Social Impact & Tokenization",
        teaser: "ImpactSoul — Certified B Corp. Four live ecosystems.",
      },
      {
        page: "Engine Room",
        href: "/engine-room",
        section: "What ImpactSoul Is Actually Building",
        teaser: "Join a community. Drive impact. See & be seen.",
      },
      {
        page: "Engine Room",
        href: "/engine-room",
        section: "The Grants & Capital Deployment Engine",
        teaser: "Not grant brokers — deployment partners.",
      },
      {
        page: "Engine Room",
        href: "/engine-room",
        section: "Live Token Ecosystems",
        teaser: "BEYOND, REX, SPACE, BEING — each with a partner NGO",
      },
      {
        page: "Under NDA",
        href: "/under-nda",
        section: "Plot Twist: I'm Raising Money Now",
        teaser: "The weird stuff: dinosaurs, satellites, ocean cleanup, sacred springs",
      },
      {
        page: "The Web",
        href: "/the-web",
        section: "The Full Ecosystem",
        teaser: "Every site, every project, all linked",
      },
    ],
  },
  {
    id: "the-body-electric",
    icon: "body",
    title: "The Body Electric",
    subtitle: "For the biohacker who wants receipts",
    description:
      "You own an Oura Ring. You've Googled 'peptides' at 2am. You suspect your doctor knows less about your blood than you do. This path connects the health investments, the alt therapy scorecard, the psychedelic medicine portfolio, and the longevity protocols — with the measurement framework that makes it science, not woo-woo.",
    duration: "~12 min read",
    mood: "Clinical. Personal. Occasionally evangelical.",
    stops: [
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 05: Health & Longevity",
        teaser: "Peptides, exosomes, and the 5-dimension evaluation framework",
      },
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 03: Psychedelic Medicine",
        teaser: "MycoMedica, AtaiBeckley, and four more",
      },
      {
        page: "The Body",
        href: "/the-body",
        section: "Why I Now Know More About Your Blood Than Your Doctor",
        teaser: "The full health deep-dive — peptides to psychedelics",
      },
      {
        page: "The Territory",
        href: "/the-territory",
        section: "Life Between the Deals",
        teaser: "Antarctica, grief, and why the body is the engine",
      },
      {
        page: "The Nightstand",
        href: "/the-nightstand",
        section: "The 'How Do I Not Lose My Mind' Shelf",
        teaser: "The Immortality Key, Stealing Fire",
      },
    ],
  },
  {
    id: "the-crusade",
    icon: "crusade",
    title: "The Crusade Files",
    subtitle: "For the righteously pissed off",
    description:
      "You've been screwed by a company with dark patterns and fake reviews. You didn't write a Yelp review — you wanted to burn the building down (metaphorically). This path is for the consumer advocates, the whistleblowers, and anyone who believes that when a company offends your principles, the crusade IS the product.",
    duration: "~10 min read",
    mood: "Furious. Documented. Legally airtight.",
    stops: [
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "Door 06: Consumer Advocacy",
        teaser: "Dark patterns, fake reviews, exploited workers. Filed with FTC.",
      },
      {
        page: "The Web",
        href: "/the-web",
        section: "Homeaglow Exposed",
        teaser: "The flagship crusade — investigative site, regulatory complaints",
      },
      {
        page: "Blog",
        href: "/blog/trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
        section: "DMN8 Gym Exposé",
        teaser: "The most beautiful (crooked) gym in the world",
      },
      {
        page: "Blog",
        href: "/blog/luz-lounge-where-loyalty-goes-to-die-groupon",
        section: "Luz Lounge",
        teaser: "Where loyalty goes to die — and Groupon deals are lipstick on a pig",
      },
      {
        page: "Blog",
        href: "/blog/hiding-fees-tips-in-the-transparent-age",
        section: "Hiding Fees & Tips",
        teaser: "Bad business in the transparent age",
      },
    ],
  },
  {
    id: "the-relationship-circuit",
    icon: "relationship",
    title: "The Relationship Circuit",
    subtitle: "For anyone who suspects love has a science — and a sacred geometry",
    description:
      "A friend texted from Jerusalem: 'Do you know any Jewish men in their 50s who'd want to marry my friend?' That text was the spark that lit years of accumulated research on fire. This path traces the full arc — from the neuroscience of magnetic partnership, through the arithmetic of mutual value, the decay of modern communication, and the ties that bind us in a century that keeps trying to untie everything.",
    duration: "~25 min read",
    mood: "Intimate. Scientific. Occasionally devastating.",
    stops: [
      {
        page: "Blog",
        href: "/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
        section: "Love as Dharma",
        teaser:
          "Applied neuroscience for magnetic partnership — attachment theory, polyvagal safety, and the signal your nervous system sends",
      },
      {
        page: "Blog",
        href: "/blog/the-ties-that-bind-interpersonal-relationships",
        section: "The Ties That Bind",
        teaser: "The full anatomy of modern interpersonal connection — and where it fractures",
      },
      {
        page: "Blog",
        href: "/blog/the-arithmetic-of-relationships",
        section: "The Arithmetic of Relationships",
        teaser:
          "What if we treated relationships with the rigor we apply to business? The ledger of mutual value.",
      },
      {
        page: "Blog",
        href: "/blog/the-decay-of-modern-day-communication",
        section: "The Decay of Communication",
        teaser:
          "When the tools we built to bring us closer become instruments of avoidance and emotional cowardice",
      },
      {
        page: "The Flow Circuit",
        href: "/flow-circuit",
        section: "Flow States & Team Coherence",
        teaser:
          "The same circuitry that makes teams perform makes partnerships thrive — mapped and measured",
      },
      {
        page: "Recent Creations",
        href: "/recent-creations",
        section: "The Full Portfolio",
        teaser: "Every site built as a measurement of something worth understanding",
      },
    ],
  },
  {
    id: "the-whole-catastrophe",
    icon: "all",
    title: "The Whole Catastrophe",
    subtitle: "Read everything. Miss nothing.",
    description:
      "You have time. You have curiosity. You want the full Zorba — catharsis and communion, the cracking open that lets the light in. This is the linear path through every page, in the order it was meant to be read.",
    duration: "~60 min read",
    mood: "Everything. All of it. The beautiful mess.",
    stops: [
      {
        page: "The Letter",
        href: "/the-letter",
        section: "Start Here",
        teaser: "I have something to show you.",
      },
      {
        page: "Walk Through",
        href: "/walk-through",
        section: "The Seven Doors",
        teaser: "Seven worlds. The magic happens at the intersections.",
      },
      {
        page: "The Territory",
        href: "/the-territory",
        section: "Life Between the Deals",
        teaser: "The business is the exhaust. The life is the engine.",
      },
      {
        page: "Engine Room",
        href: "/engine-room",
        section: "ImpactSoul + Advisors",
        teaser: "What we're actually building — and who's building it",
      },
      {
        page: "Under NDA",
        href: "/under-nda",
        section: "The Corridor + Capital",
        teaser: "The parts under NDA and the parts that keep me up at night",
      },
      {
        page: "The Body",
        href: "/the-body",
        section: "Health & Longevity",
        teaser: "Peptides, psychedelics, and measurement-driven wellness",
      },
      {
        page: "The Nightstand",
        href: "/the-nightstand",
        section: "Reading + AI Prompts",
        teaser: "The books, the travel, and three prompts to find alignment",
      },
      {
        page: "The Web",
        href: "/the-web",
        section: "Full Ecosystem",
        teaser: "Every site, every project, the complete digital footprint",
      },
      {
        page: "Pick Up the Phone",
        href: "/pick-up-the-phone",
        section: "Contact",
        teaser: "With a full heart and an open door",
      },
    ],
  },
];

export default function JourneysPage() {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto mb-10 max-w-3xl">
        <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          Choose Your Own Adventure
        </p>
        <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Guided Journeys
        </h1>
        <p className="mb-3 text-foreground/80">
          This site has a lot of rooms. You could wander — and wandering is beautiful. But if you
          know what you&apos;re looking for, or if you want to be surprised in a specific direction,
          pick a path. Each journey threads sections from across the site into a coherent experience
          built for a particular kind of curiosity.
        </p>
        <p className="text-muted-foreground">
          Think of these as curated playlists for your attention. Some are short. One is everything.
        </p>
      </div>

      <JourneysAccordion journeys={JOURNEYS} />
    </div>
  );
}
