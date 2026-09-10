import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";

// Ported from legacy client/src/pages/Published.tsx. Real content kept
// as-is (30 real bylines with real external URLs across HuffPost, Medium,
// MediaVillage). Category colors expressed as Tailwind arbitrary-value
// classes (a small fixed set of 6, known at build time) instead of inline
// style, per the no-inline-style rule.

export const metadata: Metadata = {
  title: "Published Elsewhere",
  description:
    "Bylines across HuffPost, Medium, MediaVillage, and more. 28+ articles on technology, trust, blockchain, and the human condition.",
  alternates: { canonical: "/published" },
};

type Category = "tech" | "trust" | "culture" | "blockchain" | "media" | "impact";
type Article = {
  title: string;
  publication: string;
  date: string;
  url: string;
  teaser: string;
  category: Category;
};

const PUBLICATIONS = [
  {
    name: "HuffPost",
    logo: "H",
    color: "bg-[#0dbe4e]",
    count: 28,
    tagline: "Contributor, 2010–2012",
  },
  { name: "Medium", logo: "M", color: "bg-black", count: 7, tagline: "@ramprate & @tonygreenberg" },
  {
    name: "MediaVillage",
    logo: "MV",
    color: "bg-[#1a73e8]",
    count: 3,
    tagline: "Industry Analysis",
  },
  { name: "RampRate", logo: "R", color: "bg-brand-gold", count: 40, tagline: "ramprate.com/blog" },
  {
    name: "Enterprise Radio",
    logo: "ER",
    color: "bg-[#c0392b]",
    count: 2,
    tagline: "Podcast Guest",
  },
];

const ARTICLES: Article[] = [
  {
    title: "Trust Us? Define Trust For Social Networks And Life!",
    publication: "HuffPost",
    date: "Nov 2011",
    url: "https://www.huffpost.com/entry/trust-us-are-you-really-m_b_569378",
    teaser: "The foundational essay on why trust is the only currency that compounds.",
    category: "trust",
  },
  {
    title: "The Triple Bottom Line of Soul > Trust + Empathy in Business + Friendship",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Before ESG was a buzzword, this was the math.",
    category: "trust",
  },
  {
    title: "The Act Of Gratitude: Show, Don't Tell",
    publication: "HuffPost",
    date: "Nov 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Gratitude as a strategic practice, not a Hallmark card.",
    category: "culture",
  },
  {
    title: "Gratitude: The Smuggest Sentiment or the World's Second Most Selfish Act?",
    publication: "HuffPost",
    date: "Nov 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The uncomfortable truth about why we say thank you.",
    category: "culture",
  },
  {
    title: "Building a Services Market for the Transhuman Era",
    publication: "HuffPost",
    date: "May 2011",
    url: "https://www.huffpost.com/entry/building-a-services-marke_b_569378",
    teaser:
      "The Harvard summit talk distilled. What happens when the market meets the singularity.",
    category: "tech",
  },
  {
    title: "Business at the Speed of Light: What Is a Millisecond Worth?",
    publication: "HuffPost",
    date: "May 2012",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Low-latency computing is turning financial markets inside out.",
    category: "tech",
  },
  {
    title: "Key Cloud Migration Decisions",
    publication: "HuffPost",
    date: "Oct 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The decisions nobody tells you about before you move to the cloud.",
    category: "tech",
  },
  {
    title: "Profiling the Public Cloud Buyer's Danger",
    publication: "HuffPost",
    date: "Oct 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Public cloud buyers are walking into traps. Here's the map.",
    category: "tech",
  },
  {
    title: "Where's My Flying Car... and an Efficient IT Market?",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "We were promised jet packs. We got vendor lock-in.",
    category: "tech",
  },
  {
    title: "Making IT Fit Like a Good Shoe",
    publication: "HuffPost",
    date: "May 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Custom-fit technology sourcing vs. off-the-rack disasters.",
    category: "tech",
  },
  {
    title: "IT Services Markets Crumble — Driving Detroit's Rut, Is the Media Business Next?",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The parallels between collapsing auto and IT markets.",
    category: "tech",
  },
  {
    title: "Why Good Service Is About Trust — Why Buy MacMall In An Apple Store World",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Trust beats convenience. Every time.",
    category: "trust",
  },
  {
    title: "Amazon to Beat All Suitors For Hulu?",
    publication: "HuffPost",
    date: "2012",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Called the streaming wars before they had a name.",
    category: "media",
  },
  {
    title: "Jumping Through Hoops With Hulu: Will Hollywood Studios Kill Their Offspring Again?",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Hollywood's pattern of eating its own children.",
    category: "media",
  },
  {
    title: "Break Out the Buggy Whips: Is This the Tipping Point for Streaming Video?",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The moment streaming stopped being optional.",
    category: "media",
  },
  {
    title: "The Google/Verizon Walled Garden Plan: No Substantive Impact on Net Neutrality",
    publication: "HuffPost",
    date: "2010",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Net neutrality theater vs. the real power play.",
    category: "media",
  },
  {
    title: "When Valuations Don't Mean Valuable",
    publication: "HuffPost",
    date: "2012",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The gap between what something costs and what it's worth.",
    category: "tech",
  },
  {
    title: "Save the Entrepreneur — Big Business Keeps Buying Startups, And Killing 'Em",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Acquisition as assassination. The startup graveyard.",
    category: "tech",
  },
  {
    title: "The Myth of the RFP for Everything at Half Price",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The peasants were getting restless. The RFP was a lie.",
    category: "tech",
  },
  {
    title: "A Cynic Predicts IT and Media in 2011",
    publication: "HuffPost",
    date: "2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Predictions from someone who'd rather be wrong.",
    category: "tech",
  },
  {
    title: "The 2011 Cynic Measures His Predictions",
    publication: "HuffPost",
    date: "2012",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The scorecard. Spoiler: the cynic was mostly right.",
    category: "tech",
  },
  {
    title: "Building a Community In a Weekend",
    publication: "HuffPost",
    date: "May 2012",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "What happens when you stop networking and start connecting.",
    category: "culture",
  },
  {
    title: "My Other Car Is a Bentley...Not (I Want My Car to Leaf Me Alone)",
    publication: "HuffPost",
    date: "2012",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The electric vehicle manifesto, before it was cool.",
    category: "culture",
  },
  {
    title: "Are You Going Green or Going for the Green?",
    publication: "HuffPost",
    date: "2010",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The uncomfortable intersection of environmentalism and profit.",
    category: "impact",
  },
  {
    title: "The Tug of War — Ethical vs. Economic 'Green' Decisions",
    publication: "HuffPost",
    date: "2010",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "When doing good and doing well pull in opposite directions.",
    category: "impact",
  },
  {
    title: "Surfing the WWC (The Worldwide Wine Club)",
    publication: "HuffPost",
    date: "2010",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Wine as a lens for understanding global community.",
    category: "culture",
  },
  {
    title: "Trust Your Tongue: The Only Wine And Spirits Critic Who Matters",
    publication: "HuffPost",
    date: "May 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "Your palate is the only authority. Trust it.",
    category: "culture",
  },
  {
    title: "Scrubbing Our Lives Clean From Dr. Bronner's to Pressure Cookers",
    publication: "HuffPost",
    date: "May 2011",
    url: "https://www.huffpost.com/author/tony-greenberg",
    teaser: "The objects that clean us tell us who we are.",
    category: "culture",
  },
  {
    title: "A Historical Perspective on Blockchain",
    publication: "Medium",
    date: "Mar 2018",
    url: "https://medium.com/coinmonks/a-historical-perspective-on-blockchain-c28ab92db0f1",
    teaser: "Blockchain isn't the first decentralization movement. What can it learn from P2P?",
    category: "blockchain",
  },
  {
    title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory",
    publication: "Medium",
    date: "2018",
    url: "https://medium.com/@ramprate",
    teaser: "The forces trying to slow down the most disruptive technology since the internet.",
    category: "blockchain",
  },
  {
    title: "From Supply Chain to the Blockchain: Heal the Body, Mind, Earth",
    publication: "Medium",
    date: "Oct 2018",
    url: "https://medium.com/@ramprate/from-supply-chain-to-the-blockchain-heal-the-body-mind-earth-4ac2a201a17c",
    teaser:
      "Firms using blockchain to reconfigure business, democratize finance, and change healthcare.",
    category: "blockchain",
  },
  {
    title: "Microsoft's Underwater Data Centers (Really?)",
    publication: "Medium",
    date: "2018",
    url: "https://medium.com/@ramprate/microsofts-underwater-data-centers-really-3c39ff010483",
    teaser: "Something about the water keeps attracting data center builders.",
    category: "tech",
  },
  {
    title: "Business At The Speed Of Light — What is a Millisecond Worth?",
    publication: "MediaVillage",
    date: "Mar 2012",
    url: "https://www.mediavillage.com/article/business-at-the-speed-of-light-what-is-millisecond-worth-tony-greenberg/",
    teaser: "Low-latency computing is turning financial markets, news, and media inside out.",
    category: "tech",
  },
  {
    title: "Clout vs. Klout",
    publication: "MediaVillage",
    date: "2012",
    url: "https://www.mediavillage.com/author/tony-greenberg/",
    teaser: "Real influence vs. algorithmic vanity metrics.",
    category: "culture",
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  tech: "Technology & Markets",
  trust: "Trust & Philosophy",
  culture: "Culture & Life",
  blockchain: "Blockchain & Web3",
  media: "Media & Entertainment",
  impact: "Impact & Sustainability",
};

// Every combination is a complete, literal class string — Tailwind's
// scanner reads source text statically, so `${border}/20` or
// `hover:${border}` built at the usage site would never be generated (that
// concatenated string never appears literally in the file). Precomposing
// each exact variant here is what makes them real, present classes.
const CATEGORY_CLASSES: Record<
  Category,
  { text: string; dot: string; sectionBorder: string; cardBorder: string; cardBorderHover: string }
> = {
  tech: {
    text: "text-[#2563eb]",
    dot: "bg-[#2563eb]",
    sectionBorder: "border-[#2563eb]/20",
    cardBorder: "border-l-[#2563eb]/30",
    cardBorderHover: "hover:border-l-[#2563eb]",
  },
  trust: {
    text: "text-brand-gold",
    dot: "bg-brand-gold",
    sectionBorder: "border-brand-gold/20",
    cardBorder: "border-l-brand-gold/30",
    cardBorderHover: "hover:border-l-brand-gold",
  },
  culture: {
    text: "text-[#7c3aed]",
    dot: "bg-[#7c3aed]",
    sectionBorder: "border-[#7c3aed]/20",
    cardBorder: "border-l-[#7c3aed]/30",
    cardBorderHover: "hover:border-l-[#7c3aed]",
  },
  blockchain: {
    text: "text-[#059669]",
    dot: "bg-[#059669]",
    sectionBorder: "border-[#059669]/20",
    cardBorder: "border-l-[#059669]/30",
    cardBorderHover: "hover:border-l-[#059669]",
  },
  media: {
    text: "text-[#dc2626]",
    dot: "bg-[#dc2626]",
    sectionBorder: "border-[#dc2626]/20",
    cardBorder: "border-l-[#dc2626]/30",
    cardBorderHover: "hover:border-l-[#dc2626]",
  },
  impact: {
    text: "text-[#0891b2]",
    dot: "bg-[#0891b2]",
    sectionBorder: "border-[#0891b2]/20",
    cardBorder: "border-l-[#0891b2]/30",
    cardBorderHover: "hover:border-l-[#0891b2]",
  },
};

const SPEAKING = [
  {
    title: '"Boiling the Human" — Harvard Summit with Ray Kurzweil',
    year: "2010",
    desc: "Co-presented on the transhuman services market at Harvard's Humanity+ summit",
  },
  {
    title: "Become An Innovator and Change The World",
    year: "2022",
    desc: "YouTube talk on impact-driven entrepreneurship and transparency",
  },
  {
    title: "Innovation Meets Impact — Enterprise Radio",
    year: "2016",
    desc: "How to think when $100M's are on the line",
  },
];

export default function PublishedPage() {
  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/" className="font-mono text-xs tracking-wide text-brand-gold uppercase">
        <ArrowLeft aria-hidden="true" className="mr-1 inline size-3.5" />
        Back to the Broadsheet
      </Link>

      <p className="mt-8 mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        The Bylines
      </p>
      <h1 className="mb-5 font-heading text-4xl font-bold text-foreground sm:text-5xl">
        Published
        <br />
        Elsewhere
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-foreground/70">
        {ARTICLES.length} articles across HuffPost, Medium, and MediaVillage. Technology, trust,
        blockchain, and the uncomfortable questions nobody else was asking at the time.
      </p>

      <div className="mb-12 flex flex-wrap gap-4">
        {PUBLICATIONS.map((pub) => (
          <div
            key={pub.name}
            className="flex items-center gap-3 rounded-md border border-border bg-card px-5 py-3"
          >
            <div
              className={`flex size-9 items-center justify-center rounded-md font-mono text-sm font-bold text-white ${pub.color}`}
            >
              {pub.name === "Enterprise Radio" ? (
                <Radio aria-hidden="true" className="size-4" />
              ) : (
                pub.logo
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{pub.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {pub.count} pieces · {pub.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>

      {categories.map((cat) => {
        const catArticles = ARTICLES.filter((a) => a.category === cat);
        if (catArticles.length === 0) return null;
        const c = CATEGORY_CLASSES[cat];
        return (
          <div key={cat} className="mb-12">
            <div className={`mb-6 flex items-center gap-3 border-b-2 pb-3 ${c.sectionBorder}`}>
              <span className={`size-2 rounded-full ${c.dot}`} />
              <h2 className={`font-mono text-sm tracking-[0.18em] uppercase ${c.text}`}>
                {CATEGORY_LABELS[cat]}
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                ({catArticles.length})
              </span>
            </div>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
            >
              {catArticles.map((article) => (
                <a
                  key={article.title}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-md border border-border bg-card p-5 transition-transform hover:translate-x-1 border-l-4 ${c.cardBorder} ${c.cardBorderHover}`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <span className={`font-mono text-xs tracking-wide uppercase ${c.text}`}>
                      {article.publication}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h3 className="mb-1.5 font-heading font-semibold text-foreground">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{article.teaser}</p>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mb-8 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-8">
        <h2 className="mb-5 font-mono text-sm tracking-[0.18em] text-brand-gold uppercase">
          Speaking &amp; Podcast
        </h2>
        <div className="flex flex-col gap-4">
          {SPEAKING.map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="min-w-13 font-mono text-xs text-brand-gold">{item.year}</span>
              <div>
                <p className="mb-0.5 font-heading font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-[#0A0A10] p-10 text-center">
        <p className="mb-3 font-heading text-xl text-brand-gold-light">
          &ldquo;The best articles are the ones that make you uncomfortable enough to act.&rdquo;
        </p>
        <p className="mb-5 font-mono text-xs tracking-wide text-white/50">
          86 more essays live on this site. Start with the ones that landed hardest.
        </p>
        <Link
          href="/"
          className="border-b border-brand-gold/30 font-mono text-sm tracking-wide text-brand-gold uppercase"
        >
          Enter the Broadsheet <ForwardIcon aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
