import {
  Swords,
  Brain,
  Lock,
  Eye,
  Building2,
  Sparkles,
  Palette,
  type LucideIcon,
} from "lucide-react";

// The homepage sidebar's own curated-journeys widget, ported verbatim from
// legacy client/src/pages/Blog.tsx's `curatedJourneys`. This is a distinct,
// smaller curation from the one on the full /journeys page (different
// titles/icons) — legacy links every entry generically to "/journeys"
// rather than a specific journey, so this widget is real content (title,
// icon, post count) with one shared destination, exactly as before. Legacy
// used an emoji per entry; this app uses lucide-react for icons.
export type CuratedJourney = {
  id: string;
  title: string;
  icon: LucideIcon;
  postSlugs: string[];
};

export const CURATED_JOURNEYS: CuratedJourney[] = [
  {
    id: "crusades",
    title: "The Crusade Files",
    icon: Swords,
    postSlugs: [
      "how-to-alienate-a-loyal-vegan",
      "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "dmn8-the-most-beautiful-crooked-gym-in-the-world",
      "bread-stuck-with-no-customer-service",
      "hiding-fees-tips-in-the-transparent-age",
    ],
  },
  {
    id: "consciousness",
    title: "Consciousness & Technology",
    icon: Brain,
    postSlugs: [
      "boiling-the-human-summit-harvard-kurzweil",
      "psychedelics-could-become-extractive-capitalism",
      "the-way-of-dao",
      "building-services-market-transhuman-era",
    ],
  },
  {
    id: "trust",
    title: "The Trust Economy",
    icon: Lock,
    postSlugs: [
      "only-time-buys-trust",
      "why-good-service-is-all-about-trust",
      "customer-service-key-to-business-success",
      "the-buyers-sellers-honesty-dance-2",
    ],
  },
  {
    id: "personal",
    title: "Personal Provocations",
    icon: Eye,
    postSlugs: [
      "grateful-smuggest-sentiment-or-selfish-act",
      "apologize",
      "human-operating-system",
      "the-arithmetic-of-relationships",
    ],
  },
  {
    id: "systems",
    title: "Systems Architecture",
    icon: Building2,
    postSlugs: [
      "the-ball-and-blockchain-decentralization",
      "enterprise-blockchain-can-big-business-co-opt",
      "key-cloud-migration-decisions",
      "profiling-the-public-cloud-buyer",
    ],
  },
  {
    id: "relationships",
    title: "The Relationship Circuit",
    icon: Sparkles,
    postSlugs: [
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "the-ties-that-bind-interpersonal-relationships",
      "the-arithmetic-of-relationships",
      "the-decay-of-modern-day-communication",
    ],
  },
  {
    id: "culture",
    title: "Culture & Communication",
    icon: Palette,
    postSlugs: [
      "is-that-a-lot-clarisse-abelarde",
      "the-decay-of-modern-day-communication",
      "grateful-smuggest-sentiment-or-selfish-act",
      "apologize",
    ],
  },
];
