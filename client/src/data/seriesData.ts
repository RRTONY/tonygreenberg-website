/*
 * SERIES DATA — Curated essay series that group related posts
 * into bingeable narrative arcs
 */

export interface Series {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  posts: string[]; // slugs in reading order
  category: string;
}

export const seriesData: Series[] = [
  {
    id: "blockchain-arc",
    title: "The Blockchain Papers",
    subtitle: "From history to enterprise to the DAO",
    description:
      "A five-part investigation into blockchain's real potential — from its historical roots through enterprise adoption to the philosophical implications of decentralized governance.",
    posts: [
      "a-historical-perspective-on-blockchain",
      "what-solutions-are-best-built-with-blockchain",
      "enterprise-blockchain-can-big-business-co-opt",
      "the-ball-and-blockchain-decentralization",
      "the-way-of-dao",
    ],
    category: "Systems & Innovation",
  },
  {
    id: "trust-series",
    title: "The Trust Trilogy",
    subtitle: "Why trust is the only currency that compounds",
    description:
      "Three essays exploring trust as the foundation of business, relationships, and service — from vendor negotiation to customer loyalty to the arithmetic of human connection.",
    posts: [
      "only-time-buys-trust",
      "why-good-service-is-all-about-trust",
      "the-arithmetic-of-relationships",
    ],
    category: "Culture & Communication",
  },
  {
    id: "buyer-seller",
    title: "The Buyer's Playbook",
    subtitle: "A three-part guide to smarter enterprise procurement",
    description:
      "From identifying the real challenges in IT buying to mastering vendor negotiation, this series maps the entire procurement landscape with 25 years of benchmarking data.",
    posts: [
      "it-challenges-buyers-are-ok-are-you-sure-part-1",
      "so-now-that-we-admit-we-have-a-problem-part-2",
      "fast-growth-companies-likely-to-fall-part-3",
    ],
    category: "Business & Capital",
  },
  {
    id: "honesty-dance",
    title: "The Honesty Dance",
    subtitle: "When buyers and sellers stop pretending",
    description:
      "A two-part examination of the delicate choreography between buyers and sellers — the games, the tells, and what happens when both sides decide to be honest.",
    posts: [
      "the-buyers-and-sellers-honesty-dance-1",
      "the-buyers-sellers-honesty-dance-2",
    ],
    category: "Business & Capital",
  },
  {
    id: "communication-decay",
    title: "The Decay of Communication",
    subtitle: "How we lost the ability to talk to each other",
    description:
      "From the death of professional phone calls to the erosion of clear speech, this series tracks the systematic breakdown of human communication in the digital age.",
    posts: [
      "the-decay-of-modern-day-communication",
      "the-decay-of-professional-phone-calls",
      "6-act-of-speech-speaking-as-a-tool",
      "clear-communication",
    ],
    category: "Culture & Communication",
  },
  {
    id: "transhuman",
    title: "The Transhuman Question",
    subtitle: "What happens when technology outpaces humanity",
    description:
      "From Kurzweil at Harvard to the service markets of the transhuman era — a deep dive into what happens when the machines get smarter than us, and whether that's the right question.",
    posts: [
      "boiling-the-human-summit-harvard-kurzweil",
      "greenberg-kurzweil-scientist-foundation-of-trust",
      "building-services-market-transhuman-era",
      "human-operating-system",
    ],
    category: "Systems & Innovation",
  },
  {
    id: "streaming-wars",
    title: "The Streaming Wars",
    subtitle: "Hollywood's battle with its own offspring",
    description:
      "The fight over Hulu, the death of the buggy whip, and the walled garden — three essays tracking how entertainment distribution ate itself.",
    posts: [
      "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again",
      "amazon-trumps-all-other-suitors-quest-hulu",
      "break-buggy-whip-now-tipping-for-streaming-video",
    ],
    category: "Systems & Innovation",
  },
  {
    id: "crusades",
    title: "The Crusades",
    subtitle: "When companies betray their customers",
    description:
      "Seven investigations into corporate betrayal — from fitness fraud to hidden fees to the death of customer loyalty. These are the stories companies don't want told.",
    posts: [
      "how-to-alienate-a-loyal-vegan",
      "luz-lounge-where-loyalty-goes-to-die-groupon",
      "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "dmn8-the-most-beautiful-crooked-gym-in-the-world",
      "bread-stuck-with-no-customer-service",
      "forward-health-is-a-sideway-step-at-best",
      "hiding-fees-tips-in-the-transparent-age",
    ],
    category: "The Crusades",
  },
  {
    id: "wine-journey",
    title: "The Wine Papers",
    subtitle: "Trust, taste, and the tongue",
    description:
      "Three essays on wine as a lens for understanding trust, expertise, and the courage to trust your own palate over the critics.",
    posts: [
      "trust-tongue-bottle-wine",
      "points-pointless-only-wine-expert-matters",
      "surfing-wwc-worldwide-wine-club",
    ],
    category: "Living Well",
  },
  {
    id: "ethical-economics",
    title: "The Ethics of Economics",
    subtitle: "When doing good and doing well collide",
    description:
      "From the triple bottom line to the tug-of-war between ethics and economics — four essays on whether capitalism can serve consciousness.",
    posts: [
      "the-tug-of-war-ethical-vs-economic-decisions",
      "eco-vegan-realities-seriesethical-economic",
      "return-on-investment-going-green-going-green-2",
      "triple-bottom-line-of-soul-gregory-markel",
    ],
    category: "Impact & Purpose",
  },
  {
    id: "molecule-mirror",
    title: "The Molecule as Mirror",
    subtitle: "From substance to service — an 11-part investigation",
    description:
      "What if every substance you ever reached for was a message from your future self? This series traces the arc from Freud and Jung through the new cartographers of consciousness — Maté, Lembke, van der Kolk, Carhart-Harris — to map what each molecule reveals about the life waiting on the other side.",
    posts: [
      "molecule-as-mirror-1-three-rooms-one-longing",
      "molecule-as-mirror-2-the-old-maps",
      "molecule-as-mirror-3-the-new-cartographers",
      "molecule-as-mirror-4-power-and-relief",
      "molecule-as-mirror-5-escape-and-meaning",
      "molecule-as-mirror-6-the-pause-protocol",
      "molecule-as-mirror-7-the-pathway-to-dharma",
      "molecule-as-mirror-8-resources-and-costs",
      "molecule-as-mirror-9-a-ceremony-story",
      "molecule-as-mirror-10-what-the-pioneers-know",
      "molecule-as-mirror-11-the-doorway",
    ],
    category: "Living Well",
  },
];

/* Helper: find the series a post belongs to */
export function getSeriesForPost(slug: string): {
  series: Series;
  episodeNumber: number;
  totalEpisodes: number;
} | null {
  for (const series of seriesData) {
    const idx = series.posts.indexOf(slug);
    if (idx !== -1) {
      return {
        series,
        episodeNumber: idx + 1,
        totalEpisodes: series.posts.length,
      };
    }
  }
  return null;
}
