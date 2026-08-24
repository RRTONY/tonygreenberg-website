/*
 * THOUGHT CLOUD — "The Open Door"
 * 10 magic genie client prompts with exact names, exact targets, exact reasons they'll care
 * Plus published articles across Forbes, HuffPost, Business Insider, Medium
 * Plus H+ Summit / Kurzweil credibility
 */

import { useState } from "react";
import {
  Section,
  SectionTitle,
  Eyebrow,
  Divider,
  Spacer,
  FadeIn,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";

/* ── MAGIC GENIE PROMPTS ── */
const geniePrompts = [
  {
    id: 1,
    door: "01",
    domain: "Enterprise Technology & AI",
    clientAsk: "I need to cut $40M from my cloud and data center spend without losing performance. Who do I call?",
    target: "Marco Argenti",
    title: "Chief Information Officer",
    company: "Goldman Sachs",
    whyCare: "Argenti leads a 12,000-person engineering team and is driving Goldman's entire AI strategy. He needs objective, vendor-agnostic benchmarking data — not another sales pitch. RampRate's SPY Index holds 1M+ data points on exactly the landscape he's navigating. We've benchmarked $10B+ in transactions for firms like his.",
    outcome: "RampRate delivers a forensic audit of your IT services contracts, identifies where you're overpaying relative to market, and renegotiates with leverage no single buyer has. Average savings: 30-60% on comparable services.",
    link: "https://ramprate.com",
  },
  {
    id: 2,
    door: "01",
    domain: "Enterprise Technology & AI",
    clientAsk: "Disney just did a $1B deal with OpenAI. I need to understand the AI compute procurement landscape before I commit. Who's seen inside these deals?",
    target: "Adam Smith",
    title: "Chief Product & Technology Officer, Disney Entertainment & ESPN",
    company: "The Walt Disney Company",
    whyCare: "Smith is overseeing Disney's massive technology transformation. RampRate has benchmarked Disney before — we know where the bodies are buried in their IT services contracts. When you're making billion-dollar AI infrastructure decisions, you need someone who's been in the room for 25 years, not 25 months.",
    outcome: "A complete AI compute procurement strategy: vendor landscape analysis, pricing benchmarks, contract structure recommendations, and a negotiation playbook that saves you from the mistakes everyone else is making right now.",
    link: "https://ramprate.com",
  },
  {
    id: 3,
    door: "02",
    domain: "Social Impact & Tokenization",
    clientAsk: "Larry Fink says every asset will be tokenized. I have a $200M real estate portfolio and I want to fund ocean cleanup with it. How?",
    target: "Carlos Domingo",
    title: "CEO",
    company: "Securitize",
    whyCare: "Domingo built BlackRock's tokenization infrastructure — the BUIDL fund. ImpactSoul's asset-backed impact tokens are the regenerative version of what Securitize enables. Fink publicly stated 'we're not spending enough time talking about how quickly we're going to tokenize every asset.' We're doing it — but with impact baked in.",
    outcome: "ImpactSoul tokenizes your real estate assets into four impact ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health). Each token community has a partner NGO and a pledged iconic asset. You grow wealth AND fund regeneration simultaneously.",
    link: "https://ramprate.com/impactsoul/",
  },
  {
    id: 4,
    door: "03",
    domain: "Psychedelic Medicine",
    clientAsk: "I want to invest in psychedelic therapeutics but I can't tell the science from the marketing noise. Who's actually in the lab?",
    target: "Dr. Srinivas Rao",
    title: "CEO",
    company: "atai Life Sciences (AtaiBeckley)",
    whyCare: "Rao took over as sole CEO in January 2025, driving FDA Breakthrough Therapy pathways for psychedelic-assisted treatments. We're already investors in atai. We're also investors in MycoMedica Life Sciences. Six active investments across the psychedelic medicine landscape. The gap between legitimate research and marketing noise is wider than the Grand Canyon. We know which side of the canyon you want to be on.",
    outcome: "A curated investment thesis across the psychedelic medicine landscape: which companies have real FDA pathways, which have real science, and which are just riding the wave. Plus direct introductions to the founders and researchers doing the work.",
    link: "https://tonygreenberg.com/psychedelics-could-become-extractive-capitalism/",
  },
  {
    id: 5,
    door: "04",
    domain: "Payments & The Corridor",
    clientAsk: "I'm processing $500M annually in gaming payments and I need stablecoin settlement rails that actually work cross-border. Who holds both sides of the bridge?",
    target: "Under NDA",
    title: "The Corridor",
    company: "Four Payment Processing Companies",
    whyCare: "We hold relationships on both sides of the bridge between traditional card processing rails and blockchain settlement. The corridor handles transactions across gaming, healthcare, and enterprise commerce. The opportunity is measured in billions. We don't talk about it publicly — we execute it privately.",
    outcome: "A payments infrastructure play at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance. If you're moving serious volume and need rails that work across jurisdictions, we have the architecture and the relationships. Details require an NDA.",
    link: "/under-nda",
  },
  {
    id: 6,
    door: "05",
    domain: "Health & Longevity",
    clientAsk: "I'm spending $50K/year on longevity protocols and I have no idea if any of it works. Who can give me a scorecard?",
    target: "Tom Hale",
    title: "CEO",
    company: "Oura",
    whyCare: "Hale is expanding Oura beyond sleep tracking into clinical care partnerships, digital payments, and biometric identity. Our alt-therapy scorecards use Oura Ring biometrics with a 5-dimension evaluation: Efficacy (30%), Cost (25%), Time (20%), Safety (15%), Access (10%). We're building the measurement infrastructure that Hale's platform needs to become a clinical tool, not just a consumer gadget.",
    outcome: "A personalized wellness scorecard: every protocol you're running, measured against biometric data, scored on five dimensions, with provider connections across every modality we've tested. Not biohacking vanity — measurement-driven wellness with accountability built in.",
    link: "/the-body",
  },
  {
    id: 7,
    door: "06",
    domain: "Consumer Advocacy",
    clientAsk: "A company is using dark patterns to exploit my customers. The AG won't return my calls. Who's already filed?",
    target: "Bureau of Consumer Protection",
    title: "Federal Trade Commission",
    company: "FTC / California Attorney General",
    whyCare: "The FTC is actively enforcing against dark patterns — they published enforcement results in July 2024 and are on high alert. We've already filed with both the FTC and the California Attorney General. Homeaglow Exposed is the flagship example. When a satisficer finds a company that offends his principles, the crusade is the product.",
    outcome: "We don't write Yelp reviews. We build investigative websites, file regulatory complaints, and create public pressure campaigns with documented evidence. If a company is using dark patterns, fake reviews, or exploiting workers — we have the playbook, the regulatory relationships, and the track record.",
    link: "https://tonygreenberg.com",
  },
  {
    id: 8,
    door: "07",
    domain: "Decentralized Governance & Web3",
    clientAsk: "I need a healthcare data wallet where patients actually own their records. Zero-knowledge proof, self-sovereign, HIPAA-compliant. Does it exist?",
    target: "Riley Hughes",
    title: "CEO",
    company: "Trinsic",
    whyCare: "Hughes is building the leading self-sovereign identity infrastructure. Our anonymous healthcare wallet concept is exactly what Trinsic enables — but purpose-built for healthcare. Complete health file, DNA records, emergency information, prescription history, insurance data. Not 'privacy-ish.' Actual, cryptographic, zero-knowledge-proof, self-sovereign identity.",
    outcome: "The wallet that should have existed a decade ago: you own your data, no hospital, insurance company, or government accesses it without your explicit, granular, revocable consent. We have the architecture, the regulatory framework, and the partnerships to build it.",
    link: "/walk-through",
  },
  {
    id: 9,
    door: "02",
    domain: "Social Impact & Tokenization",
    clientAsk: "I run an impact fund and I need to understand how tokenization changes the game for regenerative investing. Who's actually doing it — not just talking about it?",
    target: "Amit Bouri",
    title: "CEO & Co-Founder",
    company: "The GIIN (Global Impact Investing Network)",
    whyCare: "Bouri runs the authority on impact investing standards globally. ImpactSoul's B Corp tokenization model — where iconic assets fund regenerative impact through community-driven token ecosystems — is the kind of innovation GIIN tracks and amplifies. We're not theorizing. We have four live token ecosystems with partner NGOs and pledged assets.",
    outcome: "A working model for how tokenization transforms impact investing: lower barriers to entry, community governance, transparent impact measurement, and perpetual funding engines that don't depend on annual fundraising cycles. Four live examples, not a whitepaper.",
    link: "https://ramprate.com/impactsoul/",
  },
  {
    id: 10,
    door: "01",
    domain: "Enterprise Technology & AI",
    clientAsk: "We're a Fortune 500 and our CIO just left. We need someone who can audit our entire IT services portfolio in 90 days and tell us where we're bleeding. Who's done this before?",
    target: "Judson Althoff",
    title: "CEO of Commercial Business",
    company: "Microsoft",
    whyCare: "Althoff runs the entirety of Microsoft's commercial business. RampRate's 25 years of enterprise data — 1M+ data points in the SPY Index — is the kind of intelligence that shapes how Microsoft positions against AWS and Google Cloud. When a Fortune 500 CIO leaves, the vendor sharks circle. You need someone who's been the objective lever in enterprise technology for a quarter century.",
    outcome: "A 90-day forensic audit of your entire IT services portfolio: pricing benchmarks against 1M+ data points, vendor performance scorecards, contract renegotiation roadmap, and a strategic sourcing plan that saves 30-60% while improving service quality. We've done this for Microsoft, Disney, Goldman Sachs, and Nike.",
    link: "https://ramprate.com",
  },
];

/* ── PUBLISHED ARTICLES ── */
const publications = [
  {
    outlet: "Forbes",
    outletColor: "#333",
    articles: [
      { title: "Clout Vs. Klout: They're Not The Same, And Never Will Be", url: "https://www.forbes.com/sites/ciocentral/2012/04/18/clout-vs-klout-theyre-not-the-same-and-never-will-be/", date: "April 2012", note: "CIO Central Guest Post" },
    ],
  },
  {
    outlet: "Business Insider",
    outletColor: "#333",
    articles: [
      { title: "60% Of Trading In The US Is Now Filtered Through A High-Frequency Platform", url: "https://www.businessinsider.com/author/tony-greenberg", date: "February 2012", note: "" },
      { title: "When Valuations Don't Actually Mean Valuable", url: "https://www.businessinsider.com/author/tony-greenberg", date: "November 2011", note: "" },
      { title: "Amazon Should Prevail In The Race To Acquire Hulu", url: "https://www.businessinsider.com/author/tony-greenberg", date: "September 2011", note: "" },
    ],
  },
  {
    outlet: "HuffPost",
    outletColor: "#0A7B30",
    articles: [
      { title: "Building a Community In a Weekend", url: "https://www.huffpost.com/author/tony-greenberg", date: "May 2012", note: "Contributor" },
      { title: "Business at the Speed of Light: What Is a Millisecond Worth?", url: "https://www.huffpost.com/author/tony-greenberg", date: "May 2012", note: "" },
      { title: "Seeing Through the Eyes of the Tourists", url: "https://www.huffpost.com/entry/seeing-through-the-eyes-o_b_6117198", date: "November 2014", note: "" },
      { title: "Scrubbing Our Lives Clean From Dr. Bronner's to Pressure Cookers", url: "https://www.huffpost.com/entry/scrubbing-our-lives-clean_b_559712", date: "June 2010", note: "" },
      { title: "Key Cloud Migration Decisions", url: "https://www.huffpost.com/author/tony-greenberg", date: "October 2011", note: "" },
      { title: "Profiling the Public Cloud Buyer's Danger", url: "https://www.huffpost.com/author/tony-greenberg", date: "October 2011", note: "" },
      { title: "A Cynic Predicts IT and Media in 2011", url: "https://www.huffpost.com/author/tony-greenberg", date: "2011", note: "" },
      { title: "When Valuations Don't Mean Valuable", url: "https://www.huffpost.com/author/tony-greenberg", date: "2011", note: "" },
      { title: "Amazon to Beat All Suitors For Hulu?", url: "https://www.huffpost.com/author/tony-greenberg", date: "2011", note: "" },
      { title: "My Other Car Is a Bentley...Not", url: "https://www.huffpost.com/author/tony-greenberg", date: "2011", note: "" },
      { title: "Jumping Through Hoops With Hulu", url: "https://www.huffpost.com/author/tony-greenberg", date: "2011", note: "" },
      { title: "The 2011 Cynic Measures His Predictions", url: "https://www.huffpost.com/author/tony-greenberg", date: "2012", note: "" },
    ],
  },
  {
    outlet: "Medium",
    outletColor: "#333",
    articles: [
      { title: "The Right Numbers: Supplier Fit, Gross National Happiness, and Blockchain", url: "https://medium.com/@ramprate", date: "December 2018", note: "" },
      { title: "From Supply Chain to the Blockchain: Heal the Body, Mind, & Earth", url: "https://medium.com/@ramprate", date: "October 2018", note: "" },
      { title: "Enterprise Blockchain: Can Big Business Co-opt an Existential Threat?", url: "https://medium.com/@ramprate", date: "July 2018", note: "" },
      { title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory", url: "https://medium.com/@ramprate", date: "2018", note: "" },
      { title: "A Historical Perspective on Blockchain", url: "https://medium.com/@ramprate", date: "March 2018", note: "Published in Coinmonks — 154 claps" },
      { title: "What Solutions are Best Built with Blockchain or NOT", url: "https://medium.com/@ramprate", date: "March 2018", note: "Published in Crypto Currency Hub" },
      { title: "Microsoft's Underwater Data Centers", url: "https://medium.com/@ramprate/microsofts-underwater-data-centers-really-3c39ff010483", date: "2017", note: "" },
    ],
  },
  {
    outlet: "MediaVillage",
    outletColor: "#333",
    articles: [
      { title: "Clout vs. Klout: Why They Aren't the Same And Never Will Be", url: "https://www.mediavillage.com/article/clout-vs-klout-why-they-arent-the-same-and-never-will-be-tony-greenberg/", date: "April 2012", note: "Thought Leader" },
      { title: "The 2011 Cynic Measures His Predictions", url: "https://www.mediavillage.com/article/the-2011-cynic-measures-his-predictions-tony-greenberg-ramprate/", date: "January 2012", note: "" },
    ],
  },
];

/* ── SPEAKING & PODCASTS ── */
const speaking = [
  {
    event: "H+ Summit at Harvard University",
    year: "2010",
    talk: "Boiling the Human: Building a Services Market for the Transhuman Era",
    note: "Same stage as Ray Kurzweil. Co-presented with Alex Veytsel & Eric Pulier.",
    url: "https://tonygreenberg.com/building-services-market-the-human-era-2/",
    programUrl: "http://hplussummit.com/2010/east/program.html",
  },
  {
    event: "Clinton Global Initiative (CGI)",
    year: "2010s",
    talk: "Data Center Emissions: How to Cut 60% While Reducing Cost",
    note: "Presented research on how data center emissions could be chopped 60%.",
    url: "https://tonygreenberg.com/return-on-investment-going-green-going-green-2/",
  },
];

const podcasts = [
  { show: "Jeff Bullas Podcast", episode: "Exploring the Intersection Between AI and Humanity", ep: "Ep. 181", date: "June 2024", url: "https://www.jeffbullas.com/podcasts/ai-and-humanity-181/" },
  { show: "Building The Future Show", episode: "Tony Greenberg, CEO & Founder", ep: "Ep. 583", date: "February 2024", url: "https://www.youtube.com/watch?v=MfEt7jkBmOQ" },
  { show: "Edge of NFT", episode: "Can Crypto Save the World? Inside the Flying Pigs Project", ep: "", date: "February 2025", url: "https://www.youtube.com/watch?v=CqqROb_DmL4" },
  { show: "Enterprise Radio", episode: "Innovation Meets Impact with RampRate Founder and CEO", ep: "", date: "", url: "https://epodcastnetwork.com/meet-tony-greenberg-innovation-meets-impact-with-ramprate-founder-and-ceo/" },
  { show: "RampRate Podcast", episode: "How to Think When $100M's Are on the Line", ep: "Mini-Episode", date: "May 2016", url: "https://ramprate.com/mini-episode-tony-greenberg-ceo-of-ramprate/" },
];

/* ── TESTIMONIALS WITH SUCCESS SCORES ── */
const testimonials = [
  {
    name: "Paul Sams",
    title: "COO",
    company: "Blizzard Entertainment",
    score: 98,
    roi: 24,
    quote: "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast.",
    strategic: "They didn't just cut costs — they restructured our entire vendor architecture so we could scale World of Warcraft's infrastructure 3x without renegotiating a single contract.",
  },
  {
    name: "Phil Wiser",
    title: "EVP & CTO",
    company: "ViacomCBS",
    score: 97,
    roi: 22,
    quote: "They saved us millions, created agility and new budget out of thin air. They are a secret weapon in my tool box for truth, transparency and actionable direction.",
    strategic: "Over 16 years they became our strategic lens — not just sourcing, but helping us see which technology bets would define the next decade of media distribution.",
  },
  {
    name: "Dean Nelson",
    title: "VP of Global Foundation Services",
    company: "eBay",
    score: 96,
    roi: 24,
    quote: "We can count on RampRate to be precise, timely and create millions in value. They are no-nonsense, data driven and responsive to a T.",
    strategic: "They gave us a competitive intelligence layer we didn't know we needed — benchmarking our infrastructure against the entire market, not just our existing vendors.",
  },
  {
    name: "Robert Gonsalves",
    title: "Director of Production Operations",
    company: "Walt Disney Internet Group / Warner Bros.",
    score: 96,
    roi: 21,
    quote: "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney.",
    strategic: "They integrated into our product launch timeline — the infrastructure deal wasn't separate from the business strategy, it was the business strategy.",
  },
  {
    name: "Ian Rodgers",
    title: "CEO, Beats Music (acquired by Apple)",
    company: "Beats Music / Yahoo Music",
    score: 95,
    roi: 18,
    quote: "Within 30 hours of our decision-making, we were fully installed and up and running. Not only did RampRate save us an incredible amount of time, resources, and money.",
    strategic: "They accelerated our product launch by weeks. When Apple acquired us, the infrastructure was already built to scale — that clarity made the acquisition smoother.",
  },
  {
    name: "Peter Borner",
    title: "Head of IT",
    company: "Sony Music",
    score: 95,
    roi: 24,
    quote: "All in all, they made me look like a hero to my executive management. They are a secret weapon.",
    strategic: "They didn't just reduce costs on our outsourcing deals — they restructured the vendor relationships so my team could focus on digital transformation instead of contract management.",
  },
  {
    name: "Wulf Kaal",
    title: "Entrepreneur & Co-Founder",
    company: "Menagerie",
    score: 94,
    roi: 16,
    quote: "Tony Greenberg is fun to work with even in highly contentious and stressful business environments. He has a unique ability to bring out the good and turn even the worst situations around.",
    strategic: "Tony's network gave us instantaneous connectivity at the highest level — introductions that would have taken us years to build happened in days, with real yield.",
  },
  {
    name: "Andrew Robbins",
    title: "VP of New Media",
    company: "Miramax",
    score: 94,
    roi: 24,
    quote: "They work fast, saved us over 40% and months of due diligence which we just didn't have.",
    strategic: "They handled emergency decisions with the confidentiality and speed our film release schedule demanded — the infrastructure was invisible to the audience, exactly as it should be.",
  },
  {
    name: "Gary Share",
    title: "Windows Marketing and Product",
    company: "Microsoft",
    score: 93,
    roi: 19,
    quote: "RampRate is an invaluable partner for us. They helped us cut the clutter, gain insight and distill our team's thoughts for over 50 digital media, IT and product studies.",
    strategic: "They became our external brain trust — translating market complexity into actionable product strategy across 50+ studies that shaped how we positioned Windows.",
  },
  {
    name: "Kipras Kazlauskas",
    title: "Co-Founder",
    company: "Syntropy",
    score: 93,
    roi: 24,
    quote: "They paid for themselves by accelerating our growth by years and remain a vital resource for the team.",
    strategic: "From refined strategies to world-class investor introductions to preserving our equity — they gave us the credibility to capture opportunities we couldn't even access without them.",
  },
  {
    name: "Todd Miller",
    title: "CIO",
    company: "SF Chronicle — Hearst Corp",
    score: 92,
    roi: 14,
    quote: "They bring uniquely rare data and a solid practice to the table. They opened my eyes to the possibilities of outsourcing on a broader scale.",
    strategic: "They didn't just optimize our existing contracts — they showed us an entirely different way to think about our technology stack that we hadn't considered.",
  },
  {
    name: "Ryan Hughes",
    title: "Digital Operations",
    company: "National Hockey League",
    score: 92,
    roi: 24,
    quote: "RampRate did an outstanding job helping us deliver content for a breakthrough pay-per-view feature the NHL is offering hockey fans.",
    strategic: "They provided a total solution — encryption, pricing, DRM, customer service — that turned a streaming experiment into a revenue-generating product line.",
  },
  {
    name: "Charles Butler",
    title: "Director of Network Operations",
    company: "AOL",
    score: 91,
    roi: 17,
    quote: "WOW is the best I can say. They lowered overall prices between 17-36% and helped us achieve breakthrough innovative best-of-breed SLA coverage.",
    strategic: "They brought in providers we hadn't considered and forced everyone to compete — the result wasn't just savings, it was a fundamentally better architecture.",
  },
  {
    name: "Richard Titus",
    title: "EVP BBC / MD Razorfish LA",
    company: "BBC / Razorfish",
    score: 91,
    roi: 24,
    quote: "I would recommend either he or his firm unequivocally for business planning, scale or cost containment. Globally astute consummate analysts and deal pros extraordinaire.",
    strategic: "Tony understands media, IT and infrastructure like no one I've ever met — he sees the connections between industries that most people treat as separate worlds.",
  },
  {
    name: "Jay Samit",
    title: "Former EVP",
    company: "Sony Corporation of America",
    score: 90,
    roi: 12,
    quote: "In a field filled with prognosticators who claim to know the next great thing, RampRate applies sound business judgment and analytics to assist senior management in making crucial, time-sensitive decisions.",
    strategic: "They cut through the noise with data, not opinions — when you're making decisions that affect billions in market cap, that clarity is worth more than any consulting deck.",
  },
  {
    name: "Niles Triget",
    title: "Operations",
    company: "Thomson Reuters / Delphion",
    score: 90,
    roi: 24,
    quote: "RampRate was adaptable, brilliant and innovative. Their team stayed on schedule and stayed within the price. We saved millions.",
    strategic: "They mapped our entire infrastructure needs against our IP business model — the sourcing strategy was inseparable from the product strategy.",
  },
  {
    name: "Ron Vaisbort",
    title: "Executive",
    company: "Intel / Ivalua / Blackberry",
    score: 90,
    roi: 20,
    quote: "RampRate defines professionalism and they run a world-class team. They remain on the vanguard — staying on top of all the major digital media trends.",
    strategic: "Across four different companies I worked at, they delivered the same caliber of strategic insight — their institutional knowledge compounds with every engagement.",
  },
  {
    name: "Blair Harrison",
    title: "CEO",
    company: "Frequency (formerly Viacom)",
    score: 89,
    roi: 24,
    quote: "Using RampRate as a partner in these decisions is one of the smartest moves a business-minded CTO and management team can make!",
    strategic: "They reduced our monthly expenditure by over 75% while building partnerships that became the foundation of our content distribution strategy.",
  },
  {
    name: "William Quigley",
    title: "Managing Director",
    company: "WAX / Clearstone Venture Partners / Idealab",
    score: 89,
    roi: 10,
    quote: "Tony and his team are very well connected in the global high-tech community. He is also a generous giver of his time and energy to worthy causes, driving impact to become measurable and reportable.",
    strategic: "Tony doesn't just connect you to people — he connects you to the right people at the right moment, with context that makes the introduction land.",
  },
];

export default function ThoughtCloud() {
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [showAllPubs, setShowAllPubs] = useState(false);

  return (
    <div>
      <SEO title="The Open Door" description="What Tony Greenberg's ecosystem can do for your company. 10 magic genie prompts, client testimonials with ROI data, and published articles across Forbes, HuffPost, and Medium." path="/the-open-door"
        indexable={true} />
      {/* ── HERO ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A0A10 0%, #1a1a2e 50%, #0A0A10 100%)",
          padding: "clamp(4rem, 10vh, 7rem) 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(212,185,106,0.5) 60px, rgba(212,185,106,0.5) 61px),
              repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(212,185,106,0.5) 60px, rgba(212,185,106,0.5) 61px)`,
          }}
        />
        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "1.5rem",
            }}
          >
            The Open Door
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            What Happens When You{" "}
            <em style={{ fontStyle: "normal", color: "#D4B96A" }}>Walk In</em>
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            These are the real asks. Real companies. Real targets. Real reasons they'll care.
            Businesses attract capital when they are documented on the mission and the possibility — not when they are raising money.
          </p>
        </div>
      </div>

      {/* ── 10 MAGIC GENIE PROMPTS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>10 Doors You Can Open</Eyebrow>
          <SectionTitle>The Magic Genie Prompts</SectionTitle>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: "2rem", fontSize: "1.05rem" }}>
            Every client who walks through our door has a version of one of these asks. Not "raise me money" — but the kind of asks that make a company so compelling that capital chases them. Here are ten real scenarios, with exact names, exact targets, and exact reasons they'll pick up the phone.
          </p>
        </FadeIn>
      </Section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        {geniePrompts.map((prompt, i) => {
          const isExpanded = expandedPrompt === prompt.id;
          return (
            <FadeIn key={prompt.id} delay={i * 0.03}>
              <div
                style={{
                  marginBottom: "1.5rem",
                  border: isExpanded ? "1px solid rgba(139,105,20,0.3)" : "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  background: isExpanded ? "rgba(212,185,106,0.03)" : "transparent",
                }}
              >
                {/* Prompt header — the client ask */}
                <button
                  onClick={() => setExpandedPrompt(isExpanded ? null : prompt.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#D4B96A",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                      paddingTop: "0.3rem",
                      minWidth: "2.5rem",
                    }}
                  >
                    {prompt.door}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.15rem",
                        fontWeight: 600,
                        color: "#111",
                        lineHeight: 1.4,
                        marginBottom: "0.4rem",
                      }}
                    >
                      "{prompt.clientAsk}"
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        color: "#8B6914",
                      }}
                    >
                      {prompt.domain}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.2rem",
                      color: "#999",
                      flexShrink: 0,
                      transition: "transform 0.3s",
                      transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </div>
                </button>

                {/* Expanded content — target, why they'll care, outcome */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem",
                      paddingLeft: "calc(1.5rem + 3.5rem)",
                    }}
                  >
                    {/* Target */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          padding: "1rem 1.2rem",
                          background: "rgba(10,10,16,0.03)",
                          borderLeft: "3px solid #D4B96A",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.78rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase" as const,
                            color: "#8B6914",
                            marginBottom: "0.5rem",
                          }}
                        >
                          The Target
                        </div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#111",
                          }}
                        >
                          {prompt.target}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "1.05rem",
                            color: "#555",
                            marginTop: "0.2rem",
                          }}
                        >
                          {prompt.title}, {prompt.company}
                        </div>
                      </div>
                    </div>

                    {/* Why they'll care */}
                    <div style={{ marginBottom: "1.2rem" }}>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.78rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase" as const,
                          color: "#8B6914",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Why They'll Care
                      </div>
                      <p style={{ fontSize: "1rem", color: "#333", lineHeight: 1.8 }}>
                        {prompt.whyCare}
                      </p>
                    </div>

                    {/* What you get */}
                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.78rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase" as const,
                          color: "#8B6914",
                          marginBottom: "0.5rem",
                        }}
                      >
                        What You Get
                      </div>
                      <p style={{ fontSize: "1rem", color: "#333", lineHeight: 1.8 }}>
                        {prompt.outcome}
                      </p>
                    </div>

                    {/* CTA */}
                    <a
                      href={prompt.link}
                      target={prompt.link.startsWith("http") ? "_blank" : undefined}
                      rel={prompt.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        display: "inline-block",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        color: "#8B6914",
                        textDecoration: "none",
                        borderBottom: "1px solid #D4B96A",
                        paddingBottom: "2px",
                      }}
                    >
                      Learn more &rarr;
                    </a>
                  </div>
                )}
              </div>
            </FadeIn>
          );
        })}
      </div>

      <Divider />
      <Spacer />

      {/* ── KEYNOTES & SPEAKING ── */}
      <Section>
        <FadeIn>
          <Eyebrow>On Stage</Eyebrow>
          <SectionTitle>Keynotes & Speaking</SectionTitle>
        </FadeIn>

        {speaking.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div
              style={{
                padding: "1.5rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "1.05rem",
                    color: "#D4B96A",
                    flexShrink: 0,
                    paddingTop: "0.2rem",
                    minWidth: "3rem",
                  }}
                >
                  {s.year}
                </div>
                <div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "#111",
                      textDecoration: "none",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.talk}
                  </a>
                  <div
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1rem",
                      color: "#555",
                      marginTop: "0.3rem",
                    }}
                  >
                    {s.event}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#8B6914",
                      marginTop: "0.4rem",
                      
                    }}
                  >
                    {s.note}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </Section>

      <Divider />
      <Spacer />

      {/* ── PODCASTS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>On Air</Eyebrow>
          <SectionTitle>Podcasts & Interviews</SectionTitle>
        </FadeIn>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          {podcasts.map((p, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  textDecoration: "none",
                  transition: "padding-left 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "0.5rem"; }}
                onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    color: "#999",
                    flexShrink: 0,
                    minWidth: "5rem",
                  }}
                >
                  {p.date || "—"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.05rem",
                      color: "#111",
                      fontWeight: 600,
                    }}
                  >
                    {p.episode}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#8B6914",
                      marginTop: "0.15rem",
                    }}
                  >
                    {p.show} {p.ep && `— ${p.ep}`}
                  </div>
                </div>
                <div style={{ color: "#D4B96A", fontSize: "1.05rem", flexShrink: 0 }}>&#8599;</div>
              </a>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Divider />
      <Spacer />

      {/* ── PUBLISHED ARTICLES ── */}
      <Section>
        <FadeIn>
          <Eyebrow>In Print</Eyebrow>
          <SectionTitle>Published Articles</SectionTitle>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: "2rem", fontSize: "1rem" }}>
            Across Forbes, Business Insider, HuffPost, Medium, MediaVillage, and LinkedIn — writing about enterprise technology, blockchain, valuations, cloud infrastructure, and the intersection of business and humanity.
          </p>
        </FadeIn>

        {(showAllPubs ? publications : publications.slice(0, 3)).map((pub, pi) => (
          <FadeIn key={pi} delay={pi * 0.05}>
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: pub.outletColor,
                  marginBottom: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {pub.outlet}
              </div>
              {pub.articles.map((article, ai) => (
                <a
                  key={ai}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.8rem",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    textDecoration: "none",
                    transition: "padding-left 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "0.5rem"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#999",
                      flexShrink: 0,
                      minWidth: "5rem",
                    }}
                  >
                    {article.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1rem",
                      color: "#222",
                      flex: 1,
                    }}
                  >
                    {article.title}
                    {article.note && (
                      <span style={{ color: "#8B6914", fontSize: "1.05rem", marginLeft: "0.5rem" }}>
                        ({article.note})
                      </span>
                    )}
                  </span>
                </a>
              ))}
            </div>
          </FadeIn>
        ))}

        {!showAllPubs && publications.length > 3 && (
          <button
            onClick={() => setShowAllPubs(true)}
            style={{
              display: "block",
              margin: "1rem auto",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              background: "none",
              border: "1px solid rgba(139,105,20,0.3)",
              padding: "0.6rem 1.5rem",
              cursor: "pointer",
              borderRadius: "2px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,185,106,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            Show All Publications ({publications.reduce((acc, p) => acc + p.articles.length, 0)} articles)
          </button>
        )}
      </Section>

      <Divider />
      <Spacer />

      {/* ── TESTIMONIALS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>The Proof</Eyebrow>
          <SectionTitle>What They Said After</SectionTitle>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: "0.8rem", fontSize: "1rem" }}>
            Every engagement scored. Every relationship earned. These aren't marketing quotes — they're the words of CTOs, COOs, and CIOs who bet their budgets, their reputations, and their careers on the outcome.
          </p>
          <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "0.8rem", fontSize: "1.05rem" }}>
            Strategy projects are graded on one thing: <span style={{ color: "#8B6914", fontWeight: 600 }}>how effectively we sell the strategy to your delivery team and how well it gets implemented</span>. Ideas are free. Execution is everything. Our scores reflect adoption, not aspiration.
          </p>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            padding: "1rem 1.5rem",
            background: "rgba(139,105,20,0.06)",
            border: "1px solid rgba(139,105,20,0.15)",
            borderRadius: "3px",
            marginBottom: "1rem",
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914" }}>
              The Guarantee
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: "#333", lineHeight: 1.5 }}>
              We guarantee <strong>3x value</strong> on every retainer. We typically deliver <strong>10–24x</strong>. The ROI isn't theoretical — it's measured against what your team actually ships.
            </div>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div
                style={{
                  position: "relative",
                  padding: "1.8rem 2rem",
                  background: "#FAFAF7",
                  border: "1px solid rgba(139,105,20,0.12)",
                  borderRadius: "3px",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(139,105,20,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Score + ROI badges */}
                <div style={{ position: "absolute", top: "-1px", right: "1.5rem", display: "flex", gap: "0.4rem" }}>
                  <div
                    style={{
                      background: t.roi >= 20 ? "#1a3a1a" : "#1a2a3a",
                      color: "#7dcea0",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "0.35rem 0.7rem",
                      letterSpacing: "0.05em",
                      borderRadius: "0 0 4px 4px",
                    }}
                  >
                    {t.roi}x ROI
                  </div>
                  <div
                    style={{
                      background: t.score >= 96 ? "#0A0A10" : t.score >= 93 ? "#1a1a2e" : "#2a2a3e",
                      color: "#D4B96A",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "0.35rem 0.7rem",
                      letterSpacing: "0.05em",
                      borderRadius: "0 0 4px 4px",
                    }}
                  >
                    {t.score}%
                  </div>
                </div>

                {/* Quote */}
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.05rem",
                    
                    color: "#222",
                    lineHeight: 1.65,
                    marginBottom: "0.8rem",
                    paddingRight: "4rem",
                  }}
                >
                  "{t.quote}"
                </div>

                {/* Strategic value line */}
                <div
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    color: "#8B6914",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                    paddingLeft: "1rem",
                    borderLeft: "2px solid rgba(212,185,106,0.4)",
                  }}
                >
                  {t.strategic}
                </div>

                {/* Attribution */}
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#D4B96A",
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <span
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#111",
                      }}
                    >
                      {t.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        color: "#777",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {t.title}, {t.company}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Aggregate stats */}
        <FadeIn delay={0.3}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
              marginTop: "2.5rem",
              padding: "2rem",
              background: "#0A0A10",
              borderRadius: "4px",
            }}
          >
            {[
              { label: "Average Score", value: `${Math.round(testimonials.reduce((a, t) => a + t.score, 0) / testimonials.length)}%` },
              { label: "Average ROI", value: `${Math.round(testimonials.reduce((a, t) => a + t.roi, 0) / testimonials.length)}x` },
              { label: "Guarantee", value: "3x" },
              { label: "Typical Delivery", value: "10–24x" },
              { label: "Client Testimonials", value: `${testimonials.length}` },
              { label: "Benchmarked", value: "$10B+" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#D4B96A",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "0.3rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Divider />
      <Spacer />

      {/* ── PARODY QUOTES ── */}
      <Section>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <Eyebrow>CLEARLY PARODY — BUT ARE THEY WRONG?</Eyebrow>
          </div>
          <SectionTitle>What They Would Have Said</SectionTitle>
          <p style={{ color: "#666", fontSize: "1.05rem",  textAlign: "center", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            These quotes are entirely fictional. But if these people had spent an afternoon with Tony Greenberg, we're fairly confident this is what they'd walk away saying. Clearly marked as satire. Obviously.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gap: "2rem", maxWidth: "720px" }}>
          {[
            {
              name: "Henry Kissinger",
              title: "Former U.S. Secretary of State",
              quote: "I spent fifty years navigating the balance of power between nations. Greenberg does the same thing between corporations, consciousness, and dinosaur bones. The man has more active fronts than NATO.",
              note: "On strategic complexity"
            },
            {
              name: "Kara Swisher",
              title: "Tech Journalist & Podcaster",
              quote: "Most tech CEOs I interview are selling one thing. Tony walked into the room selling seven things, and somehow each one made the others more interesting. I've never seen anyone tokenize a T-Rex skeleton and make it sound like the most logical thing in the world.",
              note: "On portfolio coherence"
            },
            {
              name: "Anderson Cooper",
              title: "CNN Anchor",
              quote: "I've covered wars, hurricanes, and congressional hearings. Nothing prepared me for a man who benchmarks $10 billion in IT contracts by day and funds ocean cleanup by night. The range is genuinely unsettling.",
              note: "On range"
            },
            {
              name: "Alexandria Ocasio-Cortez",
              title: "U.S. Representative",
              quote: "We talk about stakeholder capitalism like it's a theory. This guy built four token ecosystems that actually fund the things we put in legislation. I'm not sure if he's ahead of us or just impatient.",
              note: "On impact infrastructure"
            },
            {
              name: "Marc Andreessen",
              title: "Co-founder, a16z",
              quote: "Software is eating the world. Greenberg is feeding it psychedelics and teaching it to meditate. I don't know whether to invest or schedule a therapy session.",
              note: "On consciousness tech"
            },
            {
              name: "Christiane Amanpour",
              title: "CNN Chief International Anchor",
              quote: "I've interviewed heads of state who had less strategic clarity than this man has about the intersection of payments infrastructure and mental health. It shouldn't make sense. It does.",
              note: "On cross-domain vision"
            },
            {
              name: "Elon Musk",
              title: "CEO, Tesla & SpaceX",
              quote: "He's running seven companies across seven industries and somehow none of them are on fire. I find that suspicious.",
              note: "On operational discipline"
            },
            {
              name: "Brene Brown",
              title: "Research Professor & Author",
              quote: "He calls it kintsugi — the gold in the cracks. Twenty-five years of building, breaking, and rebuilding in public. That's not a metaphor. That's a vulnerability practice most leaders can't even imagine.",
              note: "On authentic leadership"
            },
          ].map((pq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div
                style={{
                  padding: "2rem 2.5rem",
                  background: "rgba(10,10,16,0.03)",
                  borderLeft: "3px solid #D4B96A",
                  borderRadius: "0 4px 4px 0",
                  position: "relative",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1.5rem",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#ccc",
                  background: "rgba(212,185,106,0.08)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "2px",
                }}>
                  PARODY
                </div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.1rem",
                  
                  lineHeight: 1.7,
                  color: "#222",
                  marginBottom: "1.2rem",
                }}>
                  “{pq.quote}”
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#111" }}>
                      {pq.name}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#888", marginLeft: "0.8rem" }}>
                      {pq.title}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#D4B96A", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                    {pq.note}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div style={{
            textAlign: "center",
            marginTop: "2.5rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            color: "#bbb",
            letterSpacing: "0.08em",
          }}>
            * These quotes are entirely fictional and created for satirical purposes. None of these individuals have endorsed or are affiliated with Tony Greenberg or his companies.
          </div>
        </FadeIn>
      </Section>

      <Divider />
      <Spacer />

      {/* ── CREDIBILITY STRIP ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "1rem",
            }}
          >
            The Credential
          </div>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.6,
              
            }}
          >
            Speaker at the H+ Summit at Harvard University, 2010 — on the same stage as Ray Kurzweil. Author of "Boiling the Human." Twenty-five years building the infrastructure of trust. Published across Forbes, Business Insider, HuffPost, and Medium. Presented at the Clinton Global Initiative. CEO of RampRate. Chief Impact Officer of ImpactSoul.
          </p>
          <div
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.5)",
              marginTop: "1.5rem",
            }}
          >
            Tony Greenberg &bull; Santa Monica, CA &bull;{" "}
            <a
              href="mailto:Tony@joyandwoe.com"
              style={{ color: "#D4B96A", textDecoration: "none" }}
            >
              Tony@joyandwoe.com
            </a>
          </div>
        </div>
      </div>

      <NextPage href="/pick-up-the-phone" label="Pick Up the Phone" />
    </div>
  );
}
