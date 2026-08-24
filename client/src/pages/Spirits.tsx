/*
 * DESIGN: "The Folio" — Editorial Broadsheet
 * Wine, Sake, Spirits & Mezcal — Tony's liquid obsessions
 * References the Manus-built sites: SoulSmoke (mezcal), LiquidSun (tequila)
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, Wine, Flame, Droplets, Sparkles } from "lucide-react";
import {
  Section,
  SectionTitle,
  Eyebrow,
  Pullquote,
  Divider,
  Spacer,
  FadeIn,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";

const categories = [
  {
    id: "mezcal",
    title: "Mezcal",
    subtitle: "The Alchemy of Agave",
    icon: Flame,
    accent: "#92400E",
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
    },
    pullquote:
      "We're here for the bottles that give your palate an existential crisis, tell stories you wouldn't believe, and feel like a rupture in the matrix of mass-produced spirits.",
  },
  {
    id: "tequila",
    title: "Tequila",
    subtitle: "Liquid Sun",
    icon: Sparkles,
    accent: "#B45309",
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
    },
    pullquote:
      "The difference between good tequila and transcendent tequila is the same as the difference between a photograph and a memory.",
    digest: {
      source: "Agave Matchmaker",
      items: [
        {
          tag: "BLIND TASTING",
          title: "How New Tequila Brands Are Defining Their Own Style",
          body: "22 panelists blind-tasted new blancos you probably haven't tried. Standouts: Rimari Blanco (highest total score, NOM 1414), El Patriarca (best value, \"rustic and real\"), Doce Casas (100% tahona crushed), Felicente (tahona + wine barrel rested), and Point Blank (bright citrus, easiest drinker). Key takeaway: agave spirits are incredibly diverse.",
        },
        {
          tag: "EVENTS",
          title: "The Tahona Tour — May 2025",
          body: "Four craft brands (Fortaleza, Volcan, Alto Canto, Trujillo) on the road to talk about what makes a tequila craft. San Diego May 17 · LA May 18 · Emeryville May 20. $30/ticket, small groups only.",
        },
        {
          tag: "TEQUILA OF THE MONTH",
          title: "Tierra de Ensueño Reposado (Batch 2)",
          body: "Better barrel integration as casks get reused. Caramel, cinnamon, vanilla balanced with citrus, earthiness, and black pepper. Nice viscosity — great neat or in a spirit-forward cocktail. $69.99 at Old Town Tequila.",
        },
        {
          tag: "EDUCATION",
          title: "Maestros del Agave — Tequila School",
          body: "Flaviar is reopening registration for a 6-session educational series. Class 1: fermentation. Class 2: high-proof tequilas. Class 3: barrel-rested blancos. Earn badges on Agave Matchmaker. Graduate all 6 for the Maestros badge.",
        },
        {
          tag: "INDUSTRY",
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
    accent: "#4338CA",
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
    accent: "#78350F",
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
    accent: "#7F1D1D",
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

export default function Spirits() {
  return (
    <div>
      <SEO
        title="Wine, Sake, Spirits & Mezcal | Tony Greenberg"
        description="Tony's liquid obsessions — mezcal, tequila, sake, and wine. Deep dives, curated collections, and the philosophy behind what we drink and why it matters."
        path="/spirits"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1A0E08 0%, #0A0A10 40%, #0A0A10 100%)",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 2rem 4rem",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(146,64,14,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(67,56,202,0.3) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                color: "#C5A23C",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              The Liquid Library
            </div>
            <h1
              className="gold-shimmer"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 700,
                color: "#F0E8D8",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              Wine, Sake, Spirits
              <br />
              <span style={{ fontStyle: "italic", color: "#C5A23C" }}>&amp; Mezcal</span>
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.15rem",
                color: "#999",
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              What enters the mouth must speak to the mind and stay with the heart.
              These are the bottles, the brewers, the distillers, and the philosophies
              that earned a permanent place at the table.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        const isEven = idx % 2 === 0;
        return (
          <section
            key={cat.id}
            style={{
              background: isEven ? "#FAFAF7" : "#F5F0E6",
              borderBottom: "1px solid rgba(139,105,20,0.08)",
            }}
          >
            <div
              className="max-w-4xl mx-auto px-6 py-16 md:py-20"
            >
              <FadeIn>
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: `${cat.accent}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} style={{ color: cat.accent }} />
                  </div>
                  <div>
                    <Eyebrow>{cat.subtitle}</Eyebrow>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                        fontWeight: 700,
                        color: "#0A0A10",
                        lineHeight: 1.15,
                        marginTop: "0.3rem",
                      }}
                    >
                      {cat.title}
                    </h2>
                  </div>
                </div>

                {/* Philosophy */}
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.1rem",
                    color: "#444",
                    lineHeight: 1.8,
                    marginBottom: "2rem",
                  }}
                >
                  {cat.philosophy}
                </p>

                {/* Obsessions */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "8px",
                    padding: "1.5rem 2rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: cat.accent,
                      marginBottom: "1rem",
                    }}
                  >
                    Current Obsessions
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {cat.obsessions.map((obs, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.95rem",
                          color: "#555",
                          lineHeight: 1.6,
                          padding: "0.4rem 0",
                          borderBottom:
                            i < cat.obsessions.length - 1
                              ? "1px solid rgba(0,0,0,0.04)"
                              : "none",
                          display: "flex",
                          alignItems: "baseline",
                          gap: "0.6rem",
                        }}
                      >
                        <span style={{ color: cat.accent, fontSize: "0.7rem" }}>◆</span>
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pullquote */}
                <Pullquote>{cat.pullquote}</Pullquote>

                <Spacer />

                {/* Site card — if exists */}
                {cat.site && (
                  <motion.a
                    href={cat.site.url}
                    {...(cat.site.url.startsWith('/') ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="block no-underline group card-lift"
                    whileHover={{ y: -2 }}
                    style={{
                      background: "#0A0A10",
                      borderRadius: "10px",
                      overflow: "hidden",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div style={{ padding: "2rem" }}>
                      <div
                        className="flex items-center justify-between mb-3"
                      >
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: cat.accent,
                          }}
                        >
                          Explore the Site →
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: "#C5A23C" }}
                        />
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          color: "#F0E8D8",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {cat.site.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1rem",
                          fontStyle: "italic",
                          color: "#C5A23C",
                          marginBottom: "1rem",
                        }}
                      >
                        {cat.site.tagline}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.95rem",
                          color: "#999",
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {cat.site.description}
                      </p>
                    </div>
                  </motion.a>
                )}

                {/* Newsletter digest — if exists */}
                {cat.digest && (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "8px",
                      padding: "1.5rem 2rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: cat.accent,
                        marginBottom: "1.2rem",
                      }}
                    >
                      Latest from {cat.digest.source}
                    </div>
                    {cat.digest.items.map((item: any, di: number) => (
                      <div
                        key={di}
                        style={{
                          padding: "0.8rem 0",
                          borderBottom:
                            di < cat.digest.items.length - 1
                              ? "1px solid rgba(0,0,0,0.04)"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.65rem",
                            letterSpacing: "0.1em",
                            color: cat.accent,
                            marginBottom: "0.3rem",
                          }}
                        >
                          {item.tag}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.05rem",
                            fontWeight: 600,
                            color: "#0A0A10",
                            marginBottom: "0.3rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </div>
                        <p
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.9rem",
                            color: "#666",
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Coming soon note */}
                {cat.comingSoon && (
                  <div
                    style={{
                      background: `${cat.accent}08`,
                      border: `1px dashed ${cat.accent}30`,
                      borderRadius: "8px",
                      padding: "1.2rem 1.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: cat.accent,
                        marginBottom: "0.4rem",
                      }}
                    >
                      Coming Soon
                    </div>
                    <p
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.95rem",
                        color: "#666",
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      {cat.comingSoon}
                    </p>
                  </div>
                )}

                {idx < categories.length - 1 && <Divider />}
              </FadeIn>
            </div>
          </section>
        );
      })}

      {/* ── CLOSING PHILOSOPHY ── */}
      <section
        style={{
          background: "#0A0A10",
          padding: "5rem 2rem",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <Eyebrow>The Throughline</Eyebrow>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                fontWeight: 700,
                color: "#F0E8D8",
                lineHeight: 1.3,
                marginTop: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              Every great bottle is a trust document.
            </h2>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.05rem",
                color: "#999",
                lineHeight: 1.8,
                maxWidth: "560px",
                margin: "0 auto 2.5rem",
              }}
            >
              A mezcalero who tends an agave for 25 years before harvest. A toji who
              checks koji by touch at 3am. A winemaker who lets the grapes speak instead
              of the marketing department. The common thread isn't the liquid — it's the
              refusal to cut corners. Same principle that drives everything else I do.
            </p>
            <Link
              href="/the-letter"
              className="inline-block no-underline cta-glow"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.8rem 2rem",
                background: "#8B6914",
                color: "#fff",
                borderRadius: "4px",
                transition: "all 0.2s",
              }}
            >
              Read the Letter →
            </Link>
          </FadeIn>
        </div>
      </section>

      <NextPage href="/recent-creations" label="Recent Creations" />
    </div>
  );
}
