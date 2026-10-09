// The "Related" block near the end of the marketing pages that otherwise link
// to almost nothing in their main content (header, footer and the site-wide
// "Keep going" strip don't count). Owner said yes 2026-10-10.
//
// Rules for editing this map:
// - Only real routes (a page under src/app, or a /blog/<slug> that exists in
//   Sanity), never an address that redirects (next.config.ts and
//   src/lib/content/*redirects*.ts).
// - `title` is the target page's own title or H1; `blurb` is one short line
//   from that page's own copy (its description or excerpt). No new claims.
// - Never link a page to itself; keep the links spread rather than all
//   pointing at the same few hubs.
//
// Every /charity-scorecard/<slug> profile shares the CHARITY_PROFILE entry.

export type RelatedPage = { href: string; title: string; blurb: string };

export const CHARITY_PROFILE_PATH = "/charity-scorecard/[slug]";

const PAGES = {
  framework: {
    href: "/framework",
    title: "How I'd Approach Your Problem",
    blurb: "A 5-step framework for diagnosing complex business problems.",
  },
  amplifier: {
    href: "/amplifier",
    title: "The Amplifier: Networked Advisory",
    blurb: "For companies already scaling who need the external layer no internal coach provides.",
  },
  diamondCut: {
    href: "/diamond-cut",
    title: "The Diamond Cut: Services to Product",
    blurb: "For services businesses not yet at product scale.",
  },
  intel: {
    href: "/intel",
    title: "Intel",
    blurb: "Impact theses, Hawkins consciousness scores and impact metrics for the companies and causes Tony is building.",
  },
  invest: {
    href: "/invest",
    title: "Invest in the Thesis",
    blurb: "35+ portfolio companies across psychedelic medicine, impact venture, Web3, blockchain, and health tech.",
  },
  engineRoom: {
    href: "/engine-room",
    title: "The Engine Room",
    blurb: "How the companies and causes connect, and the active ventures behind the work.",
  },
  impactDashboard: {
    href: "/impact-dashboard",
    title: "Impact Dashboard",
    blurb: "A target representation of the ImpactSoul operating model.",
  },
  soulscore: {
    href: "/soulscore",
    title: "SoulScore™",
    blurb: "An impact measurement engine that scores consciousness, not just carbon, across 12 weighted dimensions.",
  },
  theWeb: {
    href: "/the-web",
    title: "The Web",
    blurb: "The clients, partners, and relationships built over 25 years.",
  },
  theTerritory: {
    href: "/the-territory",
    title: "The Territory",
    blurb: "The people and ideas that shaped how Tony thinks, what he builds, and why he bothers.",
  },
  theNightstand: {
    href: "/the-nightstand",
    title: "The Nightstand",
    blurb: "The books and ideas that built Tony's operating system.",
  },
  speaking: {
    href: "/speaking",
    title: "Speaking and Conversations",
    blurb: "Keynotes, firesides, offsites, and working sessions on trust, capital, technology, and the human operating system.",
  },
  published: {
    href: "/published",
    title: "Published Elsewhere",
    blurb: "Bylines across HuffPost, Medium, MediaVillage, and more.",
  },
  humanos: {
    href: "/humanos",
    title: "Human OS V2.0",
    blurb: "Are you a Maximizer or a Satisficer? A framework for upgrading how you think, decide, and act.",
  },
} satisfies Record<string, RelatedPage>;

export const RELATED_PAGES: Record<string, [RelatedPage, RelatedPage, RelatedPage]> = {
  "/akbar": [
    {
      href: "/blog/origen-restaurant",
      title: "Origen Restaurant: Oaxaca's Humble Servant of the Terroir",
      blurb: "A dinner at Origen in Oaxaca: the chef's story, the dishes, and a cooking class.",
    },
    {
      href: "/blog/an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      title: "An Ode to Kusaki: Where Plants Become Culinary Masterpieces",
      blurb: "A vegan restaurant in Santa Monica, now closed. Only the good die young.",
    },
    {
      href: "/spirits",
      title: "Wine, Sake, Spirits & Mezcal",
      blurb: "Deep dives, curated collections, and the philosophy behind what we drink.",
    },
  ],
  "/amplifier": [PAGES.diamondCut, PAGES.theTerritory, PAGES.theWeb],
  "/diamond-cut": [
    PAGES.amplifier,
    PAGES.framework,
    {
      href: "/blog/mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      title: "Mastering BD: The Art of the No That Opens the Real Door",
      blurb: "Why the most powerful move in business development is not a perfect pitch.",
    },
  ],
  "/ecosystem": [
    {
      href: "/ecosystem-map",
      title: "The Ecosystem Map",
      blurb: "Companies, people, and movements building what comes after extraction.",
    },
    {
      href: "/blog/conscious-capital-partnership-ecosystem",
      title: "The Alliance That Doesn't Require a Press Release",
      blurb: "How the most consequential partnerships are built in the quiet, not the noise.",
    },
    PAGES.theWeb,
  ],
  "/engage": [PAGES.framework, PAGES.amplifier, PAGES.diamondCut],
  "/engine-room": [
    PAGES.invest,
    PAGES.intel,
    {
      href: "/blog/powering-purpose-driven-innovation",
      title: "Powering Purpose-Driven Innovation",
      blurb: "How RampRate uses its data and network to advise and invest.",
    },
  ],
  "/intel": [
    {
      href: "/consciousness-scale",
      title: "Consciousness Scale",
      blurb: "25 questions that show where you actually operate on the Hawkins Map of Consciousness.",
    },
    PAGES.soulscore,
    {
      href: "/charity-scorecard",
      title: "The Grand Impact Accountability Index",
      blurb: "Eight existing charity scorecards unified. Where does your donation dollar actually go?",
    },
  ],
  "/invest": [PAGES.intel, PAGES.impactDashboard, PAGES.engineRoom],
  "/pick-up-the-phone": [
    PAGES.speaking,
    PAGES.framework,
    {
      href: "/blog/the-decay-of-professional-phone-calls",
      title: "The Decay of Professional Phone Calls",
      blurb: "What happened to call quality, and how to make calls clear again.",
    },
  ],
  "/published": [
    PAGES.speaking,
    {
      href: "/series",
      title: "Essay Series",
      blurb: "Multi-part investigations into blockchain, trust, communication, and the future of business.",
    },
    {
      href: "/start-here",
      title: "Start Here",
      blurb: "Five essays that define the worldview.",
    },
  ],
  "/speaking": [
    PAGES.published,
    {
      href: "/blog/boiling-the-human-summit-harvard-kurzweil",
      title: "“Boiling the Human”: H+ Summit Transcript",
      blurb: "Tony's talk at the H+ Summit at Harvard on business models that “boil the human.”",
    },
    PAGES.humanos,
  ],
  "/the-nightstand": [
    PAGES.theTerritory,
    PAGES.humanos,
    {
      href: "/blog/transforming-tony-2-books-mountain-life-strife",
      title: "2 Great Books on a Mountain Saved My Life and Strife",
      blurb: "Two books, a health crisis, and a new way of eating.",
    },
  ],
  "/the-territory": [
    PAGES.theNightstand,
    {
      href: "/amplifier",
      title: "The Amplifier",
      blurb: "Matt builds the CEO. I expand the arena the CEO gets to play in.",
    },
    {
      href: "/blog/is-that-a-lot-clarisse-abelarde",
      title: "Is That A Lot? On Clarisse Abelarde's Magnificent Painting",
      blurb: "975,900 views in three days. Meta made $11,500 from her work. Clarisse made $0.",
    },
  ],
  "/the-web": [
    {
      href: "/clients",
      title: "Clients",
      blurb: "90+ enterprise clients served by RampRate over 25 years.",
    },
    {
      href: "/blog/only-time-buys-trust",
      title: "Trust Us? Are You Really My Friend?",
      blurb: "What trust means in the digital age, and why it needs a better system.",
    },
    {
      href: "/ecosystem",
      title: "The Ecosystem",
      blurb: "A curated network for people building what replaces what's broken.",
    },
  ],
  "/under-nda": [
    PAGES.engineRoom,
    {
      href: "/walk-through",
      title: "The Seven Doors",
      blurb: "Enterprise Technology, Social Impact, Psychedelic Medicine, Payments, Health & Longevity, Consumer Advocacy, and Web3.",
    },
    {
      href: "/blog/what-solutions-are-best-built-with-blockchain",
      title: "What Solutions Are Best Built with Blockchain, or Not",
      blurb: "Which problems blockchain fits, from the practical to the moonshots.",
    },
  ],
  "/pri-calibration": [
    {
      href: "/psychedelic-readiness-index",
      title: "Psychedelic Readiness Index",
      blurb: "39 plant medicines, 50+ readiness questions, 6 domains.",
    },
    {
      href: "/pri-efficacy",
      title: "PRI Efficacy Report",
      blurb: "The Monte Carlo simulation and psychometric evidence behind the Index.",
    },
    {
      href: "/facilitator-index",
      title: "The Facilitator Index",
      blurb: "A philosophy-first instrument for practitioners. Companion to the Psychedelic Readiness Index.",
    },
  ],
  "/charity-scorecard": [
    PAGES.soulscore,
    PAGES.impactDashboard,
    {
      href: "/blog/when-valuations-dont-mean-valuable",
      title: "When Valuations Don't Mean Valuable",
      blurb: "Why high valuations often miss true value, and why transparency matters.",
    },
  ],
  // Ready for these two pages; the <RelatedPages> line itself is added there
  // separately (their forms were being edited at the time).
  "/protecting-your-business": [
    {
      href: "/attention-theft",
      title: "Attention Theft: The Manifesto",
      blurb: "Why your inbox is a crime scene and what to do about it.",
    },
    {
      href: "/blog/trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      title: "Fitness Fraud Trap: How DMN8 Gym Became a Poster Child for Deceptive Billing",
      blurb: "A Santa Monica gym and its deceptive billing practices, from personal experience.",
    },
    {
      href: "/blog/why-good-service-is-all-about-trust",
      title: "Why Good Service Is All About Trust",
      blurb: "How good service builds trust, with personal anecdotes and examples.",
    },
  ],
  "/alex-azzi": [
    {
      href: "/protecting-your-business",
      title: "She Had Two Theft Convictions. I Hired Her Anyway.",
      blurb: "A documented case file: $46,795 stolen through 11 unauthorized invoices.",
    },
    {
      href: "/attention-theft",
      title: "Attention Theft: The Manifesto",
      blurb: "Why your inbox is a crime scene and what to do about it.",
    },
    {
      href: "/blog/only-time-buys-trust",
      title: "Trust Us? Are You Really My Friend?",
      blurb: "What trust means in the digital age, and why it needs a better system.",
    },
  ],
  [CHARITY_PROFILE_PATH]: [PAGES.soulscore, PAGES.intel, PAGES.impactDashboard],
};
