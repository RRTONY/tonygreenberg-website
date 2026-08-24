import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Wine, Flame, Droplets, Sparkles, type LucideIcon } from "lucide-react";

// Ported from legacy client/src/pages/Spirits.tsx ("The Liquid Library").
// Real content, unchanged. Two of the five external companion sites
// (SoulSmoke for mezcal, LiquidSun for tequila) were hosted on
// *.manus.space — confirmed dead (503) along with the rest of the Manus
// infrastructure, not just at risk. Rather than link out to a broken page,
// those two site cards render as non-linked, explicitly marked "no longer
// live" — the description is real content worth keeping, the link isn't.
export const metadata: Metadata = {
  title: "Wine, Sake, Spirits & Mezcal",
  description:
    "Tony's liquid obsessions — mezcal, tequila, sake, and wine. Deep dives, curated collections, and the philosophy behind what we drink and why it matters.",
  alternates: { canonical: "/spirits" },
};

type CompanionSite = {
  title: string;
  tagline: string;
  url: string;
  description: string;
  offline?: boolean;
};

type DigestItem = { tag: string; title: string; body: string };

type Category = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  philosophy: string;
  obsessions: string[];
  site: CompanionSite | null;
  pullquote: string;
  digest?: { source: string; items: DigestItem[] };
  comingSoon?: string;
};

// Precomposed literal classes, one per category — see CONTRIBUTING.md's
// rule on dynamic Tailwind classes; a small fixed set gets full literal
// strings rather than fragment-assembled `text-[${hex}]`.
const CATEGORY_CLASSES: Record<string, { text: string; iconBg: string; dashedBorder: string; dashedBg: string }> = {
  mezcal: { text: "text-[#92400E]", iconBg: "bg-[#92400E]/15", dashedBorder: "border-[#92400E]/30", dashedBg: "bg-[#92400E]/5" },
  tequila: { text: "text-[#B45309]", iconBg: "bg-[#B45309]/15", dashedBorder: "border-[#B45309]/30", dashedBg: "bg-[#B45309]/5" },
  sake: { text: "text-[#4338CA]", iconBg: "bg-[#4338CA]/15", dashedBorder: "border-[#4338CA]/30", dashedBg: "bg-[#4338CA]/5" },
  coffee: { text: "text-[#78350F]", iconBg: "bg-[#78350F]/15", dashedBorder: "border-[#78350F]/30", dashedBg: "bg-[#78350F]/5" },
  wine: { text: "text-[#7F1D1D]", iconBg: "bg-[#7F1D1D]/15", dashedBorder: "border-[#7F1D1D]/30", dashedBg: "bg-[#7F1D1D]/5" },
};

const CATEGORIES: Category[] = [
  {
    id: "mezcal",
    title: "Mezcal",
    subtitle: "The Alchemy of Agave",
    icon: Flame,
    philosophy:
      "Mezcal is not a drink. It's a conversation between fire, earth, and the hands that refuse to let either be ordinary. Every bottle is a biography of a specific agave, a specific mezcalero, a specific patch of Oaxacan soil. We don't care about brands. We care about whether a copita made you close your eyes.",
    obsessions: [
      "Wild agave varieties — Tobalá, Tepeztate, Jabalí, Cuishe",
      "Clay pot distillation vs. copper — the taste of tradition",
      "The Extraordinary Value Index (EVI) — maximum soul per dollar",
      "The Extraordinary Experience Index (EEI) — bottles that stop time",
      "Ancestral process — six stages, centuries of wisdom",
    ],
    site: {
      title: "SoulSmoke",
      tagline: "The Miracle of Mezcal",
      url: "https://mezcalagave-ahru9fq8.manus.space",
      description:
        "A deep-dive education site with 25 US bottles, 25 Mexico legends, a scent-to-agave flavor finder, an agave encyclopedia covering 27 species, and a scroll-driven journey through the ancestral distillation process.",
      offline: true,
    },
    pullquote:
      "We're here for the bottles that give your palate an existential crisis, tell stories you wouldn't believe, and feel like a rupture in the matrix of mass-produced spirits.",
  },
  {
    id: "tequila",
    title: "Tequila",
    subtitle: "Liquid Sun",
    icon: Sparkles,
    philosophy:
      "Tequila has been kidnapped by marketing departments and returned to us wearing a sombrero and a lime wedge. The real story is about highland vs. lowland agave, about the difference between an autoclave and a traditional brick oven, about why a tequila aged in French oak tells a completely different story than one in American white oak. We're taking it back.",
    obsessions: [
      "Highland vs. Lowland agave terroir — altitude changes everything",
      "Brick oven vs. autoclave vs. diffuser — the integrity spectrum",
      "Additive-free certification — what's really in your bottle",
      "Cristalino controversy — innovation or sacrilege?",
      "The jimador's craft — 7 years to learn, a lifetime to master",
    ],
    site: {
      title: "LiquidSun",
      tagline: "Tequila, Illuminated",
      url: "https://tequilaazul-fxqrr3js.manus.space",
      description:
        "A visual guide that treats tequila with the reverence it deserves. From highland agave fields to the barrel room. Not a buying guide — a love letter to the spirit and the people who make it.",
      offline: true,
    },
    pullquote:
      "The difference between good tequila and transcendent tequila is the same as the difference between a photograph and a memory.",
    digest: {
      source: "Agave Matchmaker",
      items: [
        {
          tag: "Blind Tasting",
          title: "How New Tequila Brands Are Defining Their Own Style",
          body: "22 panelists blind-tasted new blancos you probably haven't tried. Standouts: Rimari Blanco (highest total score, NOM 1414), El Patriarca (best value, \"rustic and real\"), Doce Casas (100% tahona crushed), Felicente (tahona + wine barrel rested), and Point Blank (bright citrus, easiest drinker). Key takeaway: agave spirits are incredibly diverse.",
        },
        {
          tag: "Events",
          title: "The Tahona Tour — May 2025",
          body: "Four craft brands (Fortaleza, Volcan, Alto Canto, Trujillo) on the road to talk about what makes a tequila craft. San Diego May 17 · LA May 18 · Emeryville May 20. $30/ticket, small groups only.",
        },
        {
          tag: "Tequila of the Month",
          title: "Tierra de Ensueño Reposado (Batch 2)",
          body: "Better barrel integration as casks get reused. Caramel, cinnamon, vanilla balanced with citrus, earthiness, and black pepper. Nice viscosity — great neat or in a spirit-forward cocktail. $69.99 at Old Town Tequila.",
        },
        {
          tag: "Education",
          title: "Maestros del Agave — Tequila School",
          body: "Flaviar is reopening registration for a 6-session educational series. Class 1: fermentation. Class 2: high-proof tequilas. Class 3: barrel-rested blancos. Earn badges on Agave Matchmaker. Graduate all 6 for the Maestros badge.",
        },
        {
          tag: "Industry",
          title: "California Agave Spirits — The Future",
          body: "250 growers, distillers, and enthusiasts gathered at the annual California Agave Symposium in Santa Barbara to plot a path forward for this budding domestic agave industry.",
        },
      ],
    },
  },
  {
    id: "sake",
    title: "Sake",
    subtitle: "The Grain That Dreams",
    icon: Droplets,
    philosophy:
      "Sake is the most misunderstood spirit on earth. Most Americans think it's that warm stuff in a ceramic cup at a sushi restaurant. They have no idea that sake is the most technically complex fermented beverage ever created — a triple parallel fermentation that wine and beer can only dream about. They don't know that a toji in Niigata has been waking up at 3am for 40 years to check on koji by touch.",
    obsessions: [
      "Yamadanishiki, Omachi, Gohyakumangoku — the rice varieties that define flavor",
      "Polishing ratios — what happens when you shave a grain to 1% of itself",
      "Kimoto and Yamahai — ancient starter methods, wild complexity",
      "Koshu (aged sake) — the forgotten dimension of time",
      "The toji guild system — master brewers as living national treasures",
    ],
    site: null,
    pullquote:
      "If your sake doesn't have a story that makes you want to fly to Niigata and bow to someone, we're not interested.",
    comingSoon: "KUCHIKAMI — a sake education site — is in development. The mouth that chews the gods.",
  },
  {
    id: "coffee",
    title: "Coffee",
    subtitle: "The Bean That Wakes the World",
    icon: Flame,
    philosophy:
      "Coffee is the most consumed psychoactive substance on earth, and almost nobody drinks it well. The distance between a $4 gas station cup and a $18 Gesha from Ninety Plus is not just price — it's the distance between noise and signal. Between commodity and craft. Between a plant that was strip-harvested by machine and one that was hand-picked at 2,000 meters by someone who knows each tree by name.",
    obsessions: [
      "Single origin terroir — altitude, soil, microclimate, and the farmer's hands",
      "Processing methods — washed, natural, honey, anaerobic, carbonic maceration",
      "The QPR Index — maximum transcendence per dollar spent",
      "Variety genetics — Gesha, SL-28, Bourbon, Typica, Ethiopian landraces",
      "The Wall of Shame — who's lying about quality, sourcing, and freshness",
    ],
    site: {
      title: "BrewSoul",
      tagline: "Coffee Intelligence for the Obsessed",
      url: "/brewsoul",
      description:
        "100+ coffees scored and ranked. Variety encyclopedia, roaster directory, farm passports, processing deep-dives, chain rankings, metro guides, and a Wall of Shame for the brands that deserve it. The most opinionated coffee site on the internet.",
    },
    pullquote:
      "If your coffee doesn't have a story that starts with soil and ends with silence after the first sip, we're not interested.",
  },
  {
    id: "wine",
    title: "Wine",
    subtitle: "The Oldest Conversation",
    icon: Wine,
    philosophy:
      "Wine is the original technology of consciousness alteration — 8,000 years of humans figuring out that crushed grapes plus time equals something that makes dinner into communion. I'm not a sommelier. I'm a systems thinker who happens to believe that terroir is the most elegant proof that place matters, that soil has memory, and that patience is the most undervalued ingredient in any endeavor.",
    obsessions: [
      "Natural wine — minimal intervention, maximum honesty",
      "Old World vs. New World philosophies — tradition vs. innovation",
      "Orange wine and skin-contact whites — the ancient future",
      "Biodynamic farming — Rudolf Steiner meets the vineyard",
      "The second-glass test — does it get more interesting or less?",
    ],
    site: null,
    pullquote:
      "The best wines are the ones that make you stop talking. Not because they're expensive — because they're honest.",
  },
];

export default function SpiritsPage() {
  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 py-24 text-center sm:px-10 dark:from-[#1A0E08] dark:to-background">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          The Liquid Library
        </p>
        <h1 className="mx-auto mb-5 max-w-2xl font-heading text-4xl leading-tight font-bold text-foreground sm:text-5xl">
          Wine, Sake, Spirits
          <br />
          <span className="text-brand-gold italic">&amp; Mezcal</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg text-foreground/70">
          What enters the mouth must speak to the mind and stay with the heart. These are the
          bottles, the brewers, the distillers, and the philosophies that earned a permanent place
          at the table.
        </p>
      </div>

      {CATEGORIES.map((cat, idx) => {
        const Icon = cat.icon;
        const c = CATEGORY_CLASSES[cat.id];
        const isEven = idx % 2 === 0;
        return (
          <section
            key={cat.id}
            className={`border-b border-brand-gold/10 ${isEven ? "bg-background" : "bg-secondary"}`}
          >
            <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 md:py-20">
              <div className="mb-8 flex items-start gap-4">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
                  <Icon size={24} className={c.text} />
                </div>
                <div>
                  <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                    {cat.subtitle}
                  </p>
                  <h2 className="font-heading text-3xl leading-tight font-bold text-foreground sm:text-4xl">
                    {cat.title}
                  </h2>
                </div>
              </div>

              <p className="mb-8 leading-relaxed text-foreground/80">{cat.philosophy}</p>

              <div className="mb-8 rounded-lg border border-border bg-card px-8 py-6">
                <div className={`mb-4 font-mono text-xs tracking-wide uppercase ${c.text}`}>
                  Current Obsessions
                </div>
                <ul className="m-0 list-none p-0">
                  {cat.obsessions.map((obs, i) => (
                    <li
                      key={obs}
                      className={`flex items-baseline gap-2.5 py-1.5 text-sm text-foreground/70 ${
                        i < cat.obsessions.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <span className={`text-xs ${c.text}`}>&#9670;</span>
                      {obs}
                    </li>
                  ))}
                </ul>
              </div>

              <blockquote className="mb-8 border-l-4 border-brand-gold-light pl-6 font-heading text-lg text-foreground/80 italic">
                {cat.pullquote}
              </blockquote>

              {cat.site &&
                (cat.site.offline ? (
                  <div className="mb-6 rounded-lg border border-dashed border-border bg-secondary px-8 py-6">
                    <div className="mb-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                      Companion Site — No Longer Live
                    </div>
                    <h3 className="mb-1 font-heading text-2xl font-bold text-foreground">
                      {cat.site.title}
                    </h3>
                    <div className={`mb-3 font-heading text-base italic ${c.text}`}>
                      {cat.site.tagline}
                    </div>
                    <p className="m-0 leading-relaxed text-muted-foreground">
                      {cat.site.description}
                    </p>
                  </div>
                ) : (
                  <a
                    href={cat.site.url}
                    {...(cat.site.url.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="group mb-6 block rounded-lg bg-[#0A0A10] p-8"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className={`font-mono text-xs tracking-wide uppercase ${c.text}`}>
                        Explore the Site →
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="text-brand-gold-light opacity-40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </div>
                    <h3 className="mb-1 font-heading text-2xl font-bold text-[#F0E8D8]">
                      {cat.site.title}
                    </h3>
                    <div className="mb-4 font-heading text-base text-brand-gold-light italic">
                      {cat.site.tagline}
                    </div>
                    <p className="m-0 leading-relaxed text-white/60">{cat.site.description}</p>
                  </a>
                ))}

              {cat.digest && (
                <div className="mb-6 rounded-lg border border-border bg-card px-8 py-6">
                  <div className={`mb-5 font-mono text-xs tracking-wide uppercase ${c.text}`}>
                    Latest from {cat.digest.source}
                  </div>
                  {cat.digest.items.map((item, di) => (
                    <div
                      key={item.title}
                      className={`py-3 ${di < cat.digest!.items.length - 1 ? "border-b border-border/50" : ""}`}
                    >
                      <div className={`mb-1 font-mono text-[0.65rem] tracking-wide uppercase ${c.text}`}>
                        {item.tag}
                      </div>
                      <div className="mb-1 font-heading text-base leading-tight font-semibold text-foreground">
                        {item.title}
                      </div>
                      <p className="m-0 text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {cat.comingSoon && (
                <div className={`mb-6 rounded-lg border border-dashed px-6 py-5 ${c.dashedBorder} ${c.dashedBg}`}>
                  <div className={`mb-1.5 font-mono text-xs tracking-wide uppercase ${c.text}`}>
                    Coming Soon
                  </div>
                  <p className="m-0 text-sm leading-relaxed text-muted-foreground italic">
                    {cat.comingSoon}
                  </p>
                </div>
              )}

              {idx < CATEGORIES.length - 1 && <hr className="border-border/50" />}
            </div>
          </section>
        );
      })}

      <section className="bg-[#0A0A10] px-6 py-20 text-center sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            The Throughline
          </p>
          <h2 className="mb-5 font-heading text-2xl leading-snug font-bold text-[#F0E8D8] sm:text-3xl">
            Every great bottle is a trust document.
          </h2>
          <p className="mx-auto mb-8 max-w-lg leading-relaxed text-white/60">
            A mezcalero who tends an agave for 25 years before harvest. A toji who checks koji by
            touch at 3am. A winemaker who lets the grapes speak instead of the marketing
            department. The common thread isn&apos;t the liquid — it&apos;s the refusal to cut
            corners. Same principle that drives everything else I do.
          </p>
          <Link
            href="/the-letter"
            className="inline-block rounded-md bg-brand-gold px-8 py-3 font-mono text-xs tracking-wide text-white uppercase"
          >
            Read the Letter →
          </Link>
        </div>
      </section>

      <div className="border-t border-border py-6 text-center">
        <Link href="/recent-creations" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to Recent Creations →
        </Link>
      </div>
    </div>
  );
}
