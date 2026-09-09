import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Ported from legacy client/src/pages/ThoughtCloud.tsx (route /the-open-door).
// One of the 3 real, previously-undocumented content gaps found during the
// Phase 12 legacy-route audit (see NEXTJS-MIGRATION-TODO.md). Real content:
// 10 "Magic Genie Prompts" (named client-pitch scenarios), 18 real client
// testimonials with score/ROI data, 8 explicitly-labeled satirical "parody"
// quotes, 2 keynote credits, and 5 podcast appearances.
//
// Overlap with /published (already shipped, ported from legacy Published.tsx):
// /published already carries the fuller HuffPost (28)/Medium/MediaVillage
// bibliography with teasers and category grouping. This page's `publications`
// array overlaps heavily with that list (same underlying bylines), so it is
// NOT re-ported here to avoid duplicating real content across two pages —
// same "reconcile, don't duplicate" call made for /assessments vs /find-my.
// What genuinely doesn't exist on /published and IS kept here: the Forbes (1)
// and Business Insider (3) bylines (neither outlet appears on /published at
// all), the Clinton Global Initiative keynote (only the Harvard/Kurzweil talk
// is on /published), and 4 of the 5 podcast appearances (only the Enterprise
// Radio one overlaps). Each section below cross-links to /published for the
// fuller bibliography rather than repeating it.
//
// Real bugs found and fixed vs. legacy:
// - Genie prompt #4 linked out to
//   https://tonygreenberg.com/psychedelics-could-become-extractive-capitalism/
//   — that essay already exists as a real post in this migration
//   (verified: /blog/psychedelics-could-become-extractive-capitalism returns
//   200), so it's relinked internally instead of pointing back at the legacy
//   domain, per this migration's "internal over external when the
//   destination already exists here" pattern (see /journeys, /find-your-me).
// - Genie prompt #7 linked to the bare https://tonygreenberg.com domain
//   (a broken self-link to legacy's own site) — remapped to "/", matching
//   the self-link fixes already made elsewhere in this migration.
// - Same internal-over-external fix applied to both keynote links: the
//   Harvard/Kurzweil talk and the Clinton Global Initiative talk both link
//   out to tonygreenberg.com essay URLs that are real posts in this
//   migration already (/blog/boiling-the-human-summit-harvard-kurzweil,
//   /blog/return-on-investment-going-green-going-green-2 — both verified
//   200), so they're relinked internally too.
// - Genie prompts #5, #6, #8 (/under-nda, /the-body, /walk-through) verified
//   against `src/app/` — all three routes exist — and kept as real
//   `next/link` Links rather than anchors.
//
// Intentionally dropped: the click-to-expand accordion state and the
// FadeIn-on-scroll wrapper around every block (legacy's `useState` toggle +
// `Editorial`'s `FadeIn`/`Section`/`SectionTitle`/`Eyebrow` components, none
// of which exist in this codebase). All 10 prompts render fully expanded as
// a Server Component instead — no client-side JS needed, nothing is hidden
// from crawlers, and this app doesn't carry framer-motion or an
// accordion-shaped scroll observer for a single page. The closing
// "Credential" box's mailto (legacy: Tony@joyandwoe.com) is dropped rather
// than carried forward — /pick-up-the-phone (this page's real next-page
// target) is this migration's canonical contact CTA and already uses a
// current address (tony@impactsoul.is); this page links onward to it
// instead of duplicating a second, possibly-stale contact email.

export const metadata: Metadata = {
  title: "The Open Door",
  description:
    "What Tony Greenberg's ecosystem can do for your company. 10 magic genie prompts, client testimonials with ROI data, and published articles across Forbes, HuffPost, and Medium.",
  alternates: { canonical: "/the-open-door" },
};

type GeniePrompt = {
  id: number;
  door: string;
  domain: string;
  clientAsk: string;
  target: string;
  title: string;
  company: string;
  whyCare: string;
  outcome: string;
  link: string;
};

const GENIE_PROMPTS: GeniePrompt[] = [
  {
    id: 1,
    door: "01",
    domain: "Enterprise Technology & AI",
    clientAsk:
      "I need to cut $40M from my cloud and data center spend without losing performance. Who do I call?",
    target: "Marco Argenti",
    title: "Chief Information Officer",
    company: "Goldman Sachs",
    whyCare:
      "Argenti leads a 12,000-person engineering team and is driving Goldman's entire AI strategy. He needs objective, vendor-agnostic benchmarking data — not another sales pitch. RampRate's SPY Index holds 1M+ data points on exactly the landscape he's navigating. We've benchmarked $10B+ in transactions for firms like his.",
    outcome:
      "RampRate delivers a forensic audit of your IT services contracts, identifies where you're overpaying relative to market, and renegotiates with leverage no single buyer has. Average savings: 30-60% on comparable services.",
    link: "https://ramprate.com",
  },
  {
    id: 2,
    door: "01",
    domain: "Enterprise Technology & AI",
    clientAsk:
      "Disney just did a $1B deal with OpenAI. I need to understand the AI compute procurement landscape before I commit. Who's seen inside these deals?",
    target: "Adam Smith",
    title: "Chief Product & Technology Officer, Disney Entertainment & ESPN",
    company: "The Walt Disney Company",
    whyCare:
      "Smith is overseeing Disney's massive technology transformation. RampRate has benchmarked Disney before — we know where the bodies are buried in their IT services contracts. When you're making billion-dollar AI infrastructure decisions, you need someone who's been in the room for 25 years, not 25 months.",
    outcome:
      "A complete AI compute procurement strategy: vendor landscape analysis, pricing benchmarks, contract structure recommendations, and a negotiation playbook that saves you from the mistakes everyone else is making right now.",
    link: "https://ramprate.com",
  },
  {
    id: 3,
    door: "02",
    domain: "Social Impact & Tokenization",
    clientAsk:
      "Larry Fink says every asset will be tokenized. I have a $200M real estate portfolio and I want to fund ocean cleanup with it. How?",
    target: "Carlos Domingo",
    title: "CEO",
    company: "Securitize",
    whyCare:
      "Domingo built BlackRock's tokenization infrastructure — the BUIDL fund. ImpactSoul's asset-backed impact tokens are the regenerative version of what Securitize enables. Fink publicly stated 'we're not spending enough time talking about how quickly we're going to tokenize every asset.' We're doing it — but with impact baked in.",
    outcome:
      "ImpactSoul tokenizes your real estate assets into four impact ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health). Each token community has a partner NGO and a pledged iconic asset. You grow wealth AND fund regeneration simultaneously.",
    link: "https://ramprate.com/impactsoul/",
  },
  {
    id: 4,
    door: "03",
    domain: "Psychedelic Medicine",
    clientAsk:
      "I want to invest in psychedelic therapeutics but I can't tell the science from the marketing noise. Who's actually in the lab?",
    target: "Dr. Srinivas Rao",
    title: "CEO",
    company: "atai Life Sciences (AtaiBeckley)",
    whyCare:
      "Rao took over as sole CEO in January 2025, driving FDA Breakthrough Therapy pathways for psychedelic-assisted treatments. We're already investors in atai. We're also investors in MycoMedica Life Sciences. Six active investments across the psychedelic medicine landscape. The gap between legitimate research and marketing noise is wider than the Grand Canyon. We know which side of the canyon you want to be on.",
    outcome:
      "A curated investment thesis across the psychedelic medicine landscape: which companies have real FDA pathways, which have real science, and which are just riding the wave. Plus direct introductions to the founders and researchers doing the work.",
    link: "/blog/psychedelics-could-become-extractive-capitalism",
  },
  {
    id: 5,
    door: "04",
    domain: "Payments & The Corridor",
    clientAsk:
      "I'm processing $500M annually in gaming payments and I need stablecoin settlement rails that actually work cross-border. Who holds both sides of the bridge?",
    target: "Under NDA",
    title: "The Corridor",
    company: "Four Payment Processing Companies",
    whyCare:
      "We hold relationships on both sides of the bridge between traditional card processing rails and blockchain settlement. The corridor handles transactions across gaming, healthcare, and enterprise commerce. The opportunity is measured in billions. We don't talk about it publicly — we execute it privately.",
    outcome:
      "A payments infrastructure play at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance. If you're moving serious volume and need rails that work across jurisdictions, we have the architecture and the relationships. Details require an NDA.",
    link: "/under-nda",
  },
  {
    id: 6,
    door: "05",
    domain: "Health & Longevity",
    clientAsk:
      "I'm spending $50K/year on longevity protocols and I have no idea if any of it works. Who can give me a scorecard?",
    target: "Tom Hale",
    title: "CEO",
    company: "Oura",
    whyCare:
      "Hale is expanding Oura beyond sleep tracking into clinical care partnerships, digital payments, and biometric identity. Our alt-therapy scorecards use Oura Ring biometrics with a 5-dimension evaluation: Efficacy (30%), Cost (25%), Time (20%), Safety (15%), Access (10%). We're building the measurement infrastructure that Hale's platform needs to become a clinical tool, not just a consumer gadget.",
    outcome:
      "A personalized wellness scorecard: every protocol you're running, measured against biometric data, scored on five dimensions, with provider connections across every modality we've tested. Not biohacking vanity — measurement-driven wellness with accountability built in.",
    link: "/the-body",
  },
  {
    id: 7,
    door: "06",
    domain: "Consumer Advocacy",
    clientAsk:
      "A company is using dark patterns to exploit my customers. The AG won't return my calls. Who's already filed?",
    target: "Bureau of Consumer Protection",
    title: "Federal Trade Commission",
    company: "FTC / California Attorney General",
    whyCare:
      "The FTC is actively enforcing against dark patterns — they published enforcement results in July 2024 and are on high alert. We've already filed with both the FTC and the California Attorney General. Homeaglow Exposed is the flagship example. When a satisficer finds a company that offends his principles, the crusade is the product.",
    outcome:
      "We don't write Yelp reviews. We build investigative websites, file regulatory complaints, and create public pressure campaigns with documented evidence. If a company is using dark patterns, fake reviews, or exploiting workers — we have the playbook, the regulatory relationships, and the track record.",
    link: "/",
  },
  {
    id: 8,
    door: "07",
    domain: "Decentralized Governance & Web3",
    clientAsk:
      "I need a healthcare data wallet where patients actually own their records. Zero-knowledge proof, self-sovereign, HIPAA-compliant. Does it exist?",
    target: "Riley Hughes",
    title: "CEO",
    company: "Trinsic",
    whyCare:
      "Hughes is building the leading self-sovereign identity infrastructure. Our anonymous healthcare wallet concept is exactly what Trinsic enables — but purpose-built for healthcare. Complete health file, DNA records, emergency information, prescription history, insurance data. Not 'privacy-ish.' Actual, cryptographic, zero-knowledge-proof, self-sovereign identity.",
    outcome:
      "The wallet that should have existed a decade ago: you own your data, no hospital, insurance company, or government accesses it without your explicit, granular, revocable consent. We have the architecture, the regulatory framework, and the partnerships to build it.",
    link: "/walk-through",
  },
  {
    id: 9,
    door: "02",
    domain: "Social Impact & Tokenization",
    clientAsk:
      "I run an impact fund and I need to understand how tokenization changes the game for regenerative investing. Who's actually doing it — not just talking about it?",
    target: "Amit Bouri",
    title: "CEO & Co-Founder",
    company: "The GIIN (Global Impact Investing Network)",
    whyCare:
      "Bouri runs the authority on impact investing standards globally. ImpactSoul's B Corp tokenization model — where iconic assets fund regenerative impact through community-driven token ecosystems — is the kind of innovation GIIN tracks and amplifies. We're not theorizing. We have four live token ecosystems with partner NGOs and pledged assets.",
    outcome:
      "A working model for how tokenization transforms impact investing: lower barriers to entry, community governance, transparent impact measurement, and perpetual funding engines that don't depend on annual fundraising cycles. Four live examples, not a whitepaper.",
    link: "https://ramprate.com/impactsoul/",
  },
  {
    id: 10,
    door: "01",
    domain: "Enterprise Technology & AI",
    clientAsk:
      "We're a Fortune 500 and our CIO just left. We need someone who can audit our entire IT services portfolio in 90 days and tell us where we're bleeding. Who's done this before?",
    target: "Judson Althoff",
    title: "CEO of Commercial Business",
    company: "Microsoft",
    whyCare:
      "Althoff runs the entirety of Microsoft's commercial business. RampRate's 25 years of enterprise data — 1M+ data points in the SPY Index — is the kind of intelligence that shapes how Microsoft positions against AWS and Google Cloud. When a Fortune 500 CIO leaves, the vendor sharks circle. You need someone who's been the objective lever in enterprise technology for a quarter century.",
    outcome:
      "A 90-day forensic audit of your entire IT services portfolio: pricing benchmarks against 1M+ data points, vendor performance scorecards, contract renegotiation roadmap, and a strategic sourcing plan that saves 30-60% while improving service quality. We've done this for Microsoft, Disney, Goldman Sachs, and Nike.",
    link: "https://ramprate.com",
  },
];

const SPEAKING = [
  {
    event: "H+ Summit at Harvard University",
    year: "2010",
    talk: "Boiling the Human: Building a Services Market for the Transhuman Era",
    note: "Same stage as Ray Kurzweil. Co-presented with Alex Veytsel & Eric Pulier.",
    href: "/blog/boiling-the-human-summit-harvard-kurzweil",
  },
  {
    event: "Clinton Global Initiative (CGI)",
    year: "2010s",
    talk: "Data Center Emissions: How to Cut 60% While Reducing Cost",
    note: "Presented research on how data center emissions could be chopped 60%.",
    href: "/blog/return-on-investment-going-green-going-green-2",
  },
];

const PODCASTS = [
  { show: "Jeff Bullas Podcast", episode: "Exploring the Intersection Between AI and Humanity", ep: "Ep. 181", date: "June 2024", url: "https://www.jeffbullas.com/podcasts/ai-and-humanity-181/" },
  { show: "Building The Future Show", episode: "Tony Greenberg, CEO & Founder", ep: "Ep. 583", date: "February 2024", url: "https://www.youtube.com/watch?v=MfEt7jkBmOQ" },
  { show: "Edge of NFT", episode: "Can Crypto Save the World? Inside the Flying Pigs Project", ep: "", date: "February 2025", url: "https://www.youtube.com/watch?v=CqqROb_DmL4" },
  { show: "Enterprise Radio", episode: "Innovation Meets Impact with RampRate Founder and CEO", ep: "", date: "", url: "https://epodcastnetwork.com/meet-tony-greenberg-innovation-meets-impact-with-ramprate-founder-and-ceo/" },
  { show: "RampRate Podcast", episode: "How to Think When $100M's Are on the Line", ep: "Mini-Episode", date: "May 2016", url: "https://ramprate.com/mini-episode-tony-greenberg-ceo-of-ramprate/" },
];

// Only the bylines that genuinely don't appear anywhere in /published's
// bibliography — Forbes and Business Insider aren't among that page's
// outlets at all. See the port note above for the full reconciliation.
const UNIQUE_PUBLICATIONS = [
  {
    outlet: "Forbes",
    articles: [
      { title: "Clout Vs. Klout: They're Not The Same, And Never Will Be", url: "https://www.forbes.com/sites/ciocentral/2012/04/18/clout-vs-klout-theyre-not-the-same-and-never-will-be/", date: "April 2012", note: "CIO Central Guest Post" },
    ],
  },
  {
    outlet: "Business Insider",
    articles: [
      { title: "60% Of Trading In The US Is Now Filtered Through A High-Frequency Platform", url: "https://www.businessinsider.com/author/tony-greenberg", date: "February 2012", note: "" },
      { title: "When Valuations Don't Actually Mean Valuable", url: "https://www.businessinsider.com/author/tony-greenberg", date: "November 2011", note: "" },
      { title: "Amazon Should Prevail In The Race To Acquire Hulu", url: "https://www.businessinsider.com/author/tony-greenberg", date: "September 2011", note: "" },
    ],
  },
];

type Testimonial = {
  name: string;
  title: string;
  company: string;
  score: number;
  roi: number;
  quote: string;
  strategic: string;
};

const TESTIMONIALS: Testimonial[] = [
  { name: "Paul Sams", title: "COO", company: "Blizzard Entertainment", score: 98, roi: 24, quote: "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast.", strategic: "They didn't just cut costs — they restructured our entire vendor architecture so we could scale World of Warcraft's infrastructure 3x without renegotiating a single contract." },
  { name: "Phil Wiser", title: "EVP & CTO", company: "ViacomCBS", score: 97, roi: 22, quote: "They saved us millions, created agility and new budget out of thin air. They are a secret weapon in my tool box for truth, transparency and actionable direction.", strategic: "Over 16 years they became our strategic lens — not just sourcing, but helping us see which technology bets would define the next decade of media distribution." },
  { name: "Dean Nelson", title: "VP of Global Foundation Services", company: "eBay", score: 96, roi: 24, quote: "We can count on RampRate to be precise, timely and create millions in value. They are no-nonsense, data driven and responsive to a T.", strategic: "They gave us a competitive intelligence layer we didn't know we needed — benchmarking our infrastructure against the entire market, not just our existing vendors." },
  { name: "Robert Gonsalves", title: "Director of Production Operations", company: "Walt Disney Internet Group / Warner Bros.", score: 96, roi: 21, quote: "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney.", strategic: "They integrated into our product launch timeline — the infrastructure deal wasn't separate from the business strategy, it was the business strategy." },
  { name: "Ian Rodgers", title: "CEO, Beats Music (acquired by Apple)", company: "Beats Music / Yahoo Music", score: 95, roi: 18, quote: "Within 30 hours of our decision-making, we were fully installed and up and running. Not only did RampRate save us an incredible amount of time, resources, and money.", strategic: "They accelerated our product launch by weeks. When Apple acquired us, the infrastructure was already built to scale — that clarity made the acquisition smoother." },
  { name: "Peter Borner", title: "Head of IT", company: "Sony Music", score: 95, roi: 24, quote: "All in all, they made me look like a hero to my executive management. They are a secret weapon.", strategic: "They didn't just reduce costs on our outsourcing deals — they restructured the vendor relationships so my team could focus on digital transformation instead of contract management." },
  { name: "Wulf Kaal", title: "Entrepreneur & Co-Founder", company: "Menagerie", score: 94, roi: 16, quote: "Tony Greenberg is fun to work with even in highly contentious and stressful business environments. He has a unique ability to bring out the good and turn even the worst situations around.", strategic: "Tony's network gave us instantaneous connectivity at the highest level — introductions that would have taken us years to build happened in days, with real yield." },
  { name: "Andrew Robbins", title: "VP of New Media", company: "Miramax", score: 94, roi: 24, quote: "They work fast, saved us over 40% and months of due diligence which we just didn't have.", strategic: "They handled emergency decisions with the confidentiality and speed our film release schedule demanded — the infrastructure was invisible to the audience, exactly as it should be." },
  { name: "Gary Share", title: "Windows Marketing and Product", company: "Microsoft", score: 93, roi: 19, quote: "RampRate is an invaluable partner for us. They helped us cut the clutter, gain insight and distill our team's thoughts for over 50 digital media, IT and product studies.", strategic: "They became our external brain trust — translating market complexity into actionable product strategy across 50+ studies that shaped how we positioned Windows." },
  { name: "Kipras Kazlauskas", title: "Co-Founder", company: "Syntropy", score: 93, roi: 24, quote: "They paid for themselves by accelerating our growth by years and remain a vital resource for the team.", strategic: "From refined strategies to world-class investor introductions to preserving our equity — they gave us the credibility to capture opportunities we couldn't even access without them." },
  { name: "Todd Miller", title: "CIO", company: "SF Chronicle — Hearst Corp", score: 92, roi: 14, quote: "They bring uniquely rare data and a solid practice to the table. They opened my eyes to the possibilities of outsourcing on a broader scale.", strategic: "They didn't just optimize our existing contracts — they showed us an entirely different way to think about our technology stack that we hadn't considered." },
  { name: "Ryan Hughes", title: "Digital Operations", company: "National Hockey League", score: 92, roi: 24, quote: "RampRate did an outstanding job helping us deliver content for a breakthrough pay-per-view feature the NHL is offering hockey fans.", strategic: "They provided a total solution — encryption, pricing, DRM, customer service — that turned a streaming experiment into a revenue-generating product line." },
  { name: "Charles Butler", title: "Director of Network Operations", company: "AOL", score: 91, roi: 17, quote: "WOW is the best I can say. They lowered overall prices between 17-36% and helped us achieve breakthrough innovative best-of-breed SLA coverage.", strategic: "They brought in providers we hadn't considered and forced everyone to compete — the result wasn't just savings, it was a fundamentally better architecture." },
  { name: "Richard Titus", title: "EVP BBC / MD Razorfish LA", company: "BBC / Razorfish", score: 91, roi: 24, quote: "I would recommend either he or his firm unequivocally for business planning, scale or cost containment. Globally astute consummate analysts and deal pros extraordinaire.", strategic: "Tony understands media, IT and infrastructure like no one I've ever met — he sees the connections between industries that most people treat as separate worlds." },
  { name: "Jay Samit", title: "Former EVP", company: "Sony Corporation of America", score: 90, roi: 12, quote: "In a field filled with prognosticators who claim to know the next great thing, RampRate applies sound business judgment and analytics to assist senior management in making crucial, time-sensitive decisions.", strategic: "They cut through the noise with data, not opinions — when you're making decisions that affect billions in market cap, that clarity is worth more than any consulting deck." },
  { name: "Niles Triget", title: "Operations", company: "Thomson Reuters / Delphion", score: 90, roi: 24, quote: "RampRate was adaptable, brilliant and innovative. Their team stayed on schedule and stayed within the price. We saved millions.", strategic: "They mapped our entire infrastructure needs against our IP business model — the sourcing strategy was inseparable from the product strategy." },
  { name: "Ron Vaisbort", title: "Executive", company: "Intel / Ivalua / Blackberry", score: 90, roi: 20, quote: "RampRate defines professionalism and they run a world-class team. They remain on the vanguard — staying on top of all the major digital media trends.", strategic: "Across four different companies I worked at, they delivered the same caliber of strategic insight — their institutional knowledge compounds with every engagement." },
  { name: "Blair Harrison", title: "CEO", company: "Frequency (formerly Viacom)", score: 89, roi: 24, quote: "Using RampRate as a partner in these decisions is one of the smartest moves a business-minded CTO and management team can make!", strategic: "They reduced our monthly expenditure by over 75% while building partnerships that became the foundation of our content distribution strategy." },
  { name: "William Quigley", title: "Managing Director", company: "WAX / Clearstone Venture Partners / Idealab", score: 89, roi: 10, quote: "Tony and his team are very well connected in the global high-tech community. He is also a generous giver of his time and energy to worthy causes, driving impact to become measurable and reportable.", strategic: "Tony doesn't just connect you to people — he connects you to the right people at the right moment, with context that makes the introduction land." },
];

const PARODY_QUOTES = [
  { name: "Henry Kissinger", title: "Former U.S. Secretary of State", quote: "I spent fifty years navigating the balance of power between nations. Greenberg does the same thing between corporations, consciousness, and dinosaur bones. The man has more active fronts than NATO.", note: "On strategic complexity" },
  { name: "Kara Swisher", title: "Tech Journalist & Podcaster", quote: "Most tech CEOs I interview are selling one thing. Tony walked into the room selling seven things, and somehow each one made the others more interesting. I've never seen anyone tokenize a T-Rex skeleton and make it sound like the most logical thing in the world.", note: "On portfolio coherence" },
  { name: "Anderson Cooper", title: "CNN Anchor", quote: "I've covered wars, hurricanes, and congressional hearings. Nothing prepared me for a man who benchmarks $10 billion in IT contracts by day and funds ocean cleanup by night. The range is genuinely unsettling.", note: "On range" },
  { name: "Alexandria Ocasio-Cortez", title: "U.S. Representative", quote: "We talk about stakeholder capitalism like it's a theory. This guy built four token ecosystems that actually fund the things we put in legislation. I'm not sure if he's ahead of us or just impatient.", note: "On impact infrastructure" },
  { name: "Marc Andreessen", title: "Co-founder, a16z", quote: "Software is eating the world. Greenberg is feeding it psychedelics and teaching it to meditate. I don't know whether to invest or schedule a therapy session.", note: "On consciousness tech" },
  { name: "Christiane Amanpour", title: "CNN Chief International Anchor", quote: "I've interviewed heads of state who had less strategic clarity than this man has about the intersection of payments infrastructure and mental health. It shouldn't make sense. It does.", note: "On cross-domain vision" },
  { name: "Elon Musk", title: "CEO, Tesla & SpaceX", quote: "He's running seven companies across seven industries and somehow none of them are on fire. I find that suspicious.", note: "On operational discipline" },
  { name: "Brene Brown", title: "Research Professor & Author", quote: "He calls it kintsugi — the gold in the cracks. Twenty-five years of building, breaking, and rebuilding in public. That's not a metaphor. That's a vulnerability practice most leaders can't even imagine.", note: "On authentic leadership" },
];

const STATS = [
  { label: "Average Score", value: `${Math.round(TESTIMONIALS.reduce((a, t) => a + t.score, 0) / TESTIMONIALS.length)}%` },
  { label: "Average ROI", value: `${Math.round(TESTIMONIALS.reduce((a, t) => a + t.roi, 0) / TESTIMONIALS.length)}x` },
  { label: "Guarantee", value: "3x" },
  { label: "Typical Delivery", value: "10–24x" },
  { label: "Client Testimonials", value: `${TESTIMONIALS.length}` },
  { label: "Benchmarked", value: "$10B+" },
];

export default function TheOpenDoorPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* ── HERO ── */}
      <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        The Open Door
      </p>
      <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        What Happens When You <span className="text-brand-gold">Walk In</span>
      </h1>
      <p className="mb-10 max-w-2xl text-foreground/80">
        These are the real asks. Real companies. Real targets. Real reasons they&apos;ll care.
        Businesses attract capital when they are documented on the mission and the possibility —
        not when they are raising money.
      </p>

      {/* ── MAGIC GENIE PROMPTS ── */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        10 Doors You Can Open
      </p>
      <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
        The Magic Genie Prompts
      </h2>
      <p className="mb-8 text-foreground/80">
        Every client who walks through our door has a version of one of these asks. Not
        &ldquo;raise me money&rdquo; — but the kind of asks that make a company so compelling
        that capital chases them. Here are ten real scenarios, with exact names, exact targets,
        and exact reasons they&apos;ll pick up the phone.
      </p>

      <div className="mb-12 space-y-6">
        {GENIE_PROMPTS.map((prompt) => {
          const isInternal = prompt.link.startsWith("/");
          return (
            <div key={prompt.id} className="rounded-md border border-border bg-card p-6">
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-brand-gold">{prompt.door}</span>
                <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {prompt.domain}
                </span>
              </div>
              <p className="mb-4 font-heading text-lg font-semibold text-foreground">
                &ldquo;{prompt.clientAsk}&rdquo;
              </p>

              <div className="mb-4 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-4">
                <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                  The Target
                </p>
                <p className="font-heading font-bold text-foreground">{prompt.target}</p>
                <p className="text-sm text-muted-foreground">
                  {prompt.title}, {prompt.company}
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                  Why They&apos;ll Care
                </p>
                <p className="leading-relaxed text-foreground/80">{prompt.whyCare}</p>
              </div>

              <div className="mb-4">
                <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                  What You Get
                </p>
                <p className="leading-relaxed text-foreground/80">{prompt.outcome}</p>
              </div>

              {isInternal ? (
                <Link
                  href={prompt.link}
                  className="border-b border-brand-gold font-mono text-xs tracking-wide text-brand-gold uppercase"
                >
                  Learn more →
                </Link>
              ) : (
                <a
                  href={prompt.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-brand-gold font-mono text-xs tracking-wide text-brand-gold uppercase"
                >
                  Learn more →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* ── KEYNOTES & SPEAKING ── */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        On Stage
      </p>
      <h2 className="mb-5 font-heading text-2xl font-bold text-foreground">
        Keynotes & Speaking
      </h2>
      <div className="mb-10 divide-y divide-border">
        {SPEAKING.map((s) => (
          <div key={s.event} className="py-5">
            <div className="mb-1 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm text-brand-gold">{s.year}</span>
              <Link href={s.href} className="font-heading text-lg font-semibold text-foreground">
                {s.talk}
              </Link>
            </div>
            <p className="text-foreground/80">{s.event}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      {/* ── PODCASTS ── */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        On Air
      </p>
      <h2 className="mb-5 font-heading text-2xl font-bold text-foreground">
        Podcasts & Interviews
      </h2>
      <div className="mb-10 divide-y divide-border">
        {PODCASTS.map((p) => (
          <a
            key={p.show + p.episode}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 py-4"
          >
            <span className="min-w-20 font-mono text-xs text-muted-foreground">
              {p.date || "—"}
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-foreground">{p.episode}</span>
              <span className="font-mono text-xs text-brand-gold">
                {p.show} {p.ep && `— ${p.ep}`}
              </span>
            </span>
            <span className="text-brand-gold">↗</span>
          </a>
        ))}
      </div>

      {/* ── ALSO IN PRINT (content unique to this page vs. /published) ── */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        In Print
      </p>
      <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">
        Also Published
      </h2>
      <p className="mb-6 text-foreground/80">
        The fuller bibliography — 28+ HuffPost bylines, Medium, MediaVillage — lives on{" "}
        <Link href="/published" className="text-brand-gold">
          /published
        </Link>
        . Two outlets from that run don&apos;t appear there at all:
      </p>
      <div className="mb-10 space-y-6">
        {UNIQUE_PUBLICATIONS.map((pub) => (
          <div key={pub.outlet}>
            <p className="mb-2 font-mono text-xs font-bold tracking-[0.12em] text-brand-gold uppercase">
              {pub.outlet}
            </p>
            <div className="divide-y divide-border">
              {pub.articles.map((article) => (
                <a
                  key={article.title}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-baseline gap-3 py-3"
                >
                  <span className="min-w-20 font-mono text-xs text-muted-foreground">
                    {article.date}
                  </span>
                  <span className="flex-1 text-foreground">
                    {article.title}
                    {article.note && (
                      <span className="ml-2 font-mono text-xs text-brand-gold">
                        ({article.note})
                      </span>
                    )}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── TESTIMONIALS ── */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        The Proof
      </p>
      <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
        What They Said After
      </h2>
      <p className="mb-3 text-foreground/80">
        Every engagement scored. Every relationship earned. These aren&apos;t marketing quotes —
        they&apos;re the words of CTOs, COOs, and CIOs who bet their budgets, their reputations,
        and their careers on the outcome.
      </p>
      <p className="mb-6 text-foreground/80">
        Strategy projects are graded on one thing:{" "}
        <span className="font-semibold text-brand-gold">
          how effectively we sell the strategy to your delivery team and how well it gets
          implemented
        </span>
        . Ideas are free. Execution is everything. Our scores reflect adoption, not aspiration.
      </p>
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-md border border-brand-gold/15 bg-brand-gold/5 p-5">
        <p className="font-mono text-xs tracking-[0.1em] text-brand-gold uppercase">
          The Guarantee
        </p>
        <p className="text-foreground/80">
          We guarantee <strong className="text-foreground">3x value</strong> on every retainer. We
          typically deliver <strong className="text-foreground">10–24x</strong>. The ROI
          isn&apos;t theoretical — it&apos;s measured against what your team actually ships.
        </p>
      </div>

      <div className="mb-8 space-y-5">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-md border border-border bg-card p-6">
            <div className="mb-3 flex gap-2">
              <Badge variant="outline" className="border-brand-gold/40 text-brand-gold">
                {t.roi}x ROI
              </Badge>
              <Badge className="bg-foreground text-background">{t.score}%</Badge>
            </div>
            <p className="mb-3 font-heading text-base text-foreground italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="mb-4 border-l-2 border-brand-gold/40 pl-4 text-brand-gold">
              {t.strategic}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-foreground">{t.name}</span>{" "}
              <span className="font-mono text-xs text-muted-foreground">
                {t.title}, {t.company}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="mb-12 grid grid-cols-2 gap-6 rounded-md bg-[#0A0A10] p-8 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-heading text-2xl font-bold text-brand-gold-light">{stat.value}</p>
            <p className="mt-1 font-mono text-xs tracking-[0.1em] text-white/60 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── PARODY QUOTES (explicitly labeled satire, not real endorsements) ── */}
      <p className="mb-1 text-center font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        Clearly Parody — But Are They Wrong?
      </p>
      <h2 className="mb-4 text-center font-heading text-2xl font-bold text-foreground">
        What They Would Have Said
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-center text-foreground/70">
        These quotes are entirely fictional. But if these people had spent an afternoon with Tony
        Greenberg, we&apos;re fairly confident this is what they&apos;d walk away saying. Clearly
        marked as satire. Obviously.
      </p>

      <div className="mb-6 space-y-6">
        {PARODY_QUOTES.map((pq) => (
          <div
            key={pq.name}
            className="relative rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6"
          >
            <Badge
              variant="outline"
              className="absolute top-4 right-4 text-muted-foreground uppercase"
            >
              Parody
            </Badge>
            <p className="mb-4 pr-16 font-heading text-foreground italic">
              &ldquo;{pq.quote}&rdquo;
            </p>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p>
                <span className="font-semibold text-foreground">{pq.name}</span>{" "}
                <span className="font-mono text-xs text-muted-foreground">{pq.title}</span>
              </p>
              <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">
                {pq.note}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mb-12 text-center font-mono text-xs text-muted-foreground">
        * These quotes are entirely fictional and created for satirical purposes. None of these
        individuals have endorsed or are affiliated with Tony Greenberg or his companies.
      </p>

      {/* ── CREDIBILITY SUMMARY ── */}
      <div className="mb-10 rounded-md bg-[#0A0A10] p-8 text-center">
        <p className="mb-3 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          The Credential
        </p>
        <p className="font-heading text-lg leading-relaxed text-white/90">
          Speaker at the H+ Summit at Harvard University, 2010 — on the same stage as Ray
          Kurzweil. Author of &ldquo;Boiling the Human.&rdquo; Twenty-five years building the
          infrastructure of trust. Published across Forbes, Business Insider, HuffPost, and
          Medium. Presented at the Clinton Global Initiative. CEO of RampRate. Chief Impact
          Officer of ImpactSoul.
        </p>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/pick-up-the-phone" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to Pick Up the Phone →
        </Link>
      </div>
    </div>
  );
}
