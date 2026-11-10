"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Flame, Heart, MapPin, Star, Users } from "lucide-react";
import { useFavorites } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Producers.tsx. Same producers, copy, own header
// bar and expand/collapse. Collapsed panels stay in the server HTML (hidden) so their story text
// is crawlable; favorites use the shared SoulSmoke favorites (same localStorage key as the app).

type Producer = {
  id: string;
  name: string;
  location: string;
  founder: string;
  philosophy: string;
  story: string[];
  methods: string[];
  whySpecial: string;
  howToAccess: string;
  bottleIds: string[];
};

export const producers: Producer[] = [
  {
    id: "real-minero",
    name: "Real Minero",
    location: "Santa Catarina Minas, Oaxaca",
    founder: "The Ángeles Family (Graciela Ángeles Carreño)",
    philosophy: "Four generations of unbroken tradition. No compromise. No shortcuts. The agave speaks, we listen.",
    story: [
      "In the mountains above Santa Catarina Minas, the Ángeles family has been making mezcal the same way for four generations. No electricity. No pumps. No modern conveniences. Just clay pot stills, tahona wheels pulled by horses, and the kind of patience that modern commerce has forgotten.",
      "Graciela Ángeles Carreño, the matriarch, is a living legend. She's not just preserving tradition—she's proving that the old ways produce something industrial methods can never touch. Every bottle of Real Minero is a middle finger to efficiency and a love letter to craft.",
      "The family cultivates their own agaves on ancestral lands, some plants taking 15-25 years to mature. They don't chase volume. They don't chase trends. They chase perfection, one small batch at a time.",
      "Visiting their palenque is a pilgrimage. You'll taste mezcal straight from clay pots, walk through agave fields that have fed this family for a century, and understand why some things are worth waiting for.",
    ],
    methods: [
      "Clay pot distillation (ancestral method)",
      "Tahona wheel crushed by horse",
      "Open-air fermentation in wooden vats",
      "Wild/ambient yeast fermentation",
      "No temperature control—nature decides",
      "Hand-harvested, family-cultivated agaves",
    ],
    whySpecial:
      "Real Minero represents the platonic ideal of mezcal. When experts debate what 'authentic' means, they point here. The clay pot distillation creates a texture and depth that copper stills simply cannot replicate. Every sip connects you to centuries of unbroken tradition.",
    howToAccess:
      "Real Minero is available in the US through select importers, but the best bottles—the single-village expressions, the rare agave releases—require a relationship. Visit Santa Catarina Minas, meet the family, show respect for the tradition. Allocations go to those who understand what they're buying.",
    bottleIds: ["us-1", "us-2", "mx-1", "mx-2"],
  },
  {
    id: "fane-kantsini",
    name: "Fane Kantsini",
    location: "San Baltazar Guelavila, Oaxaca",
    founder: "Erick Rodríguez",
    philosophy: "The rarest agaves deserve the most patient hands. We make mezcal for the obsessed, not the masses.",
    story: [
      "Erick Rodríguez is a hunter. Not of animals, but of agaves—the wild, rare, nearly-extinct varieties that grow in impossible places. His mezcals are made from plants most producers have never seen, let alone worked with.",
      "Fane Kantsini (Zapotec for 'place of the mezcal') produces some of the rarest bottles on Earth. The Chuparrosas expression, made from an agave so rare it's been called the 'Tasmanian Tiger of mezcal,' exists in quantities of 20-50 bottles per lot. If you've tasted it, you're in a very small club.",
      "Erick's palenque sits in a valley where wild agaves still grow as they did before the Spanish arrived. He forages, he waits, he respects the plant's timeline. A single batch might represent a decade of patience.",
      "This is not mezcal for casual drinkers. This is mezcal for the obsessed—people who understand that some experiences cannot be rushed, replicated, or scaled.",
    ],
    methods: [
      "Ancestral clay pot distillation",
      "Wild-foraged rare agave varieties",
      "Extended fermentation (up to 30 days)",
      "Single-village, single-lot production",
      "No blending—each batch is unique",
      "Micro-lots of 20-200 bottles",
    ],
    whySpecial:
      "Fane Kantsini produces mezcals that most people will never taste. The Chuparrosas, Pelon Verde, and rare Tepeztate expressions are collector's items—not because of marketing, but because the plants themselves are vanishing. Each bottle is a time capsule of a disappearing world.",
    howToAccess:
      "There is no retail channel for most Fane Kantsini releases. You either know Erick, know someone who knows Erick, or you visit San Baltazar Guelavila and hope he has something to share. Allocations are personal. Relationships are everything.",
    bottleIds: ["mx-3", "mx-4", "mx-5", "mx-6", "mx-7", "mx-8"],
  },
  {
    id: "5-sentidos",
    name: "5 Sentidos",
    location: "Multiple villages across Oaxaca",
    founder: "Community Collective",
    philosophy: "Every village has a story. Every mezcalero deserves recognition. We amplify voices, not erase them.",
    story: [
      "5 Sentidos isn't a brand in the traditional sense—it's a platform. A way for small-village mezcaleros to reach the world without losing their identity to a corporate label.",
      "Each bottle tells you exactly who made it, where, and how. The mezcalero's name is on the label. Their village is on the label. Their methods are on the label. In an industry where producers are often anonymous, 5 Sentidos insists on transparency.",
      "The collective works with families across Oaxaca, from the high mountains to the coastal valleys. They don't impose standards—they document what each family has been doing for generations and bring it to market with full attribution.",
      "This model has created some of the most interesting mezcals available. Because each producer works independently, the variation is enormous. A 5 Sentidos Tobalá from one village tastes nothing like a 5 Sentidos Tobalá from another. That's the point.",
    ],
    methods: [
      "Varies by producer (ancestral and artisanal)",
      "Full producer attribution on every bottle",
      "Village-specific terroir expression",
      "No blending across producers",
      "Traditional family methods preserved",
      "Fair trade pricing for mezcaleros",
    ],
    whySpecial:
      "5 Sentidos proves that scale and authenticity aren't mutually exclusive. By creating a platform rather than a brand, they've made village-level mezcal accessible while ensuring the people who make it get credit and fair compensation. It's a model the industry should follow.",
    howToAccess:
      "5 Sentidos has better US distribution than most artisanal producers, but the special releases—the rare agaves, the single-lot expressions—still require hunting. Follow their releases, build relationships with specialty retailers, and be ready to move fast when something special drops.",
    bottleIds: ["us-5", "us-6", "mx-9", "mx-10"],
  },
];

export function Producers() {
  const [expandedProducer, setExpandedProducer] = useState<string | null>("real-minero");
  const { toggleFavorite, isFavorite } = useFavorites();

  const getProducerBottles = (bottleIds: string[]) => {
    return allMezcals.filter((m) => bottleIds.includes(m.id));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8]">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#8b4513]/20 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={ss("/")} className="font-serif text-2xl tracking-wider text-[#d4a574]">
            MEZCAL
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href={ss("/quadrant")} className="text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
              Quadrant
            </Link>
            <Link href={ss("/agave-encyclopedia")} className="text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
              Agaves
            </Link>
            <Link href={ss("/taste-quiz")} className="text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
              Find Your Mezcal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-b from-[#2a1810] to-[#1a1a1a] px-6 pt-24 pb-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href={ss("/")}
            className="mb-8 inline-flex items-center gap-2 text-lg font-medium text-[#d4a574] hover:text-[#f5f0e8]"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            Back to Home
          </Link>
          <h1 className="mb-6 font-serif text-4xl md:text-6xl">
            The <span className="text-[#d4a574]">Makers</span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-[#a0a0a0]">
            Behind every extraordinary bottle is a family, a village, a philosophy. These are the producers who define
            what mezcal can be—and the ones worth building relationships with.
          </p>
        </div>
      </section>

      {/* Producer Cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-6">
          {producers.map((producer) => {
            const isExpanded = expandedProducer === producer.id;
            const bottles = getProducerBottles(producer.bottleIds);
            const panelId = `producer-${producer.id}`;

            return (
              <div
                key={producer.id}
                className="overflow-hidden rounded-xl border border-[#333] bg-[#2a2a2a] transition-colors hover:border-[#8b4513]/50"
              >
                {/* Header - Always visible */}
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedProducer(isExpanded ? null : producer.id)}
                  className="w-full p-6 text-left md:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="mb-2 font-serif text-2xl text-[#f5f0e8] md:text-3xl">{producer.name}</h2>
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-[#a0a0a0]">
                        <span className="flex items-center gap-1">
                          <MapPin aria-hidden="true" className="size-4 text-[#d4a574]" />
                          {producer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users aria-hidden="true" className="size-4 text-[#d4a574]" />
                          {producer.founder}
                        </span>
                      </div>
                      <p className="text-lg text-[#d4a574] italic">&quot;{producer.philosophy}&quot;</p>
                    </div>
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronUp aria-hidden="true" className="size-6 text-[#d4a574]" />
                      ) : (
                        <ChevronDown aria-hidden="true" className="size-6 text-[#a0a0a0]" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content (always rendered, hidden when collapsed, so it is in the server HTML) */}
                <div
                  id={panelId}
                  hidden={!isExpanded}
                  className={isExpanded ? "border-t border-[#333] px-6 pb-8 md:px-8" : "hidden"}
                >
                  {/* Story */}
                  <div className="mb-8 pt-6">
                    <h3 className="mb-4 font-serif text-xl text-[#d4a574]">The Story</h3>
                    <div className="space-y-4 leading-relaxed text-[#c0c0c0]">
                      {producer.story.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Methods */}
                  <div className="mb-8">
                    <h3 className="mb-4 flex items-center gap-2 font-serif text-xl text-[#d4a574]">
                      <Flame aria-hidden="true" className="size-5" />
                      Production Methods
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {producer.methods.map((method, i) => (
                        <div key={i} className="flex items-center gap-2 text-[#a0a0a0]">
                          <span className="size-1.5 shrink-0 rounded-full bg-[#d4a574]" />
                          {method}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Special */}
                  <div className="mb-8 rounded-lg border border-[#8b4513]/30 bg-[#1a1a1a] p-6">
                    <h3 className="mb-3 flex items-center gap-2 font-serif text-xl text-[#d4a574]">
                      <Star aria-hidden="true" className="size-5" />
                      Why They Matter
                    </h3>
                    <p className="leading-relaxed text-[#c0c0c0]">{producer.whySpecial}</p>
                  </div>

                  {/* How to Access */}
                  <div className="mb-8 rounded-lg border border-[#8b4513]/30 bg-[#2a1810] p-6">
                    <h3 className="mb-3 font-serif text-xl text-[#d4a574]">How to Get Allocated</h3>
                    <p className="leading-relaxed text-[#c0c0c0]">{producer.howToAccess}</p>
                  </div>

                  {/* Bottles */}
                  <div>
                    <h3 className="mb-4 font-serif text-xl text-[#d4a574]">Their Bottles in Our Quadrant</h3>
                    <div className="space-y-3">
                      {bottles.map((bottle) => (
                        <div
                          key={bottle.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-[#1a1a1a] p-4 transition-colors hover:bg-[#222]"
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-[#f5f0e8]">
                              {bottle.brand} <span className="text-[#d4a574]">{bottle.name}</span>
                            </div>
                            <div className="text-sm text-[#a0a0a0]">
                              {bottle.agave} · ${bottle.price} · EVI: {bottle.evi}/10 · EEI: {bottle.eei}/10
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              aria-label={
                                isFavorite(bottle.id)
                                  ? `Remove ${bottle.brand} ${bottle.name} from favorites`
                                  : `Add ${bottle.brand} ${bottle.name} to favorites`
                              }
                              aria-pressed={isFavorite(bottle.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(bottle.id);
                              }}
                              className={
                                isFavorite(bottle.id)
                                  ? "rounded-lg bg-red-900/30 p-2 text-red-400 transition-colors"
                                  : "rounded-lg bg-[#333] p-2 text-[#a0a0a0] transition-colors hover:text-red-400"
                              }
                            >
                              <Heart
                                aria-hidden="true"
                                className={isFavorite(bottle.id) ? "size-4 fill-current" : "size-4"}
                              />
                            </button>
                            <Link
                              href={`${ss("/quadrant")}?bottle=${bottle.id}`}
                              aria-label={`See ${bottle.brand} ${bottle.name} in the Quadrant`}
                              className="rounded-lg bg-[#333] p-2 text-[#d4a574] transition-colors hover:bg-[#444]"
                            >
                              <ExternalLink aria-hidden="true" className="size-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-serif text-2xl text-[#d4a574]">Ready to Start Your Hunt?</h2>
          <p className="mb-8 text-[#a0a0a0]">
            Explore all 80 bottles in our Quadrant, or take the quiz to find your perfect matches.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ss("/quadrant")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b4513] px-8 py-3 font-medium text-[#f5f0e8] transition-colors hover:bg-[#a0522d]"
            >
              Explore the Quadrant
            </Link>
            <Link
              href={ss("/how-to-get-allocated")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8b4513] px-8 py-3 font-medium text-[#d4a574] transition-colors hover:bg-[#8b4513]/20"
            >
              How to Get Allocated
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
