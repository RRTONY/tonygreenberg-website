import Link from "next/link";
import { ArrowRight, ChefHat, ExternalLink, MapPin, Quote, Star, Utensils } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Restaurants.tsx (route /sacred-kitchens). Same
// restaurants, copy and layout. The hero's faint diamond pattern was an inline-style SVG data URI
// (50px tiles); it is the same SVG drawn as an inline <pattern> so no style={} is needed.
// Headings use text-foreground instead of live's text-earth: on SoulSmoke's dark background the
// near-black text-earth headings were unreadable (CONTRIBUTING rule 20); Aficionado mode stays dark-on-light.

type Restaurant = {
  id: string;
  name: string;
  subtitle?: string;
  chef?: string;
  neighborhood: string;
  cuisine: string;
  priceRange: string;
  description: string;
  whyWeLoveIt: string;
  signature?: string;
  michelinStatus?: string;
  website?: string;
  reviewLink?: string;
  reviewNote?: string;
  rating: "extraordinary" | "excellent" | "avoid";
};

export const restaurants: Restaurant[] = [
  {
    id: "origen",
    name: "Origen",
    subtitle: "Where Oaxacan Cuisine Finds Its Voice",
    chef: "Rodolfo Castellanos",
    neighborhood: "Centro Histórico",
    cuisine: "Contemporary Oaxacan",
    priceRange: "$$$",
    description:
      "A spectacular colonial house just steps from the historic center, Origen emerges as the definitive statement of modern Oaxacan cuisine. Chef Rodolfo Castellanos channels the markets and pueblos of Oaxaca into dishes that honor tradition while pushing boundaries.",
    whyWeLoveIt:
      "This is where the origin of Oaxacan cuisine reveals itself. Rodolfo doesn't just cook—he translates generations of wisdom into plates that make you understand why this region is considered one of the world's great culinary treasures.",
    signature: "The tasting menu that changes with the seasons and the mercado",
    michelinStatus: "Michelin Recommended",
    website: "https://www.origenoaxaca.com",
    reviewLink: "", // Placeholder for user's review
    reviewNote: "Read our full review (coming soon)",
    rating: "extraordinary",
  },
  {
    id: "alfonsina",
    name: "Alfonsina",
    subtitle: "An Invitation Into Someone's Home",
    chef: "Jorge León",
    neighborhood: "San Juan Bautista la Raya",
    cuisine: "Traditional Oaxacan",
    priceRange: "$$",
    description:
      "A half hour's drive south of Oaxaca city, down bumpy dirt roads, this reservation-only destination is as close to an invitation into someone's home as fine dining gets. No menu—just trust. Jorge León's tribute to traditional Oaxacan cuisine unfolds across five courses of seasonal, local produce.",
    whyWeLoveIt:
      "This is not a restaurant. It's a pilgrimage. The journey there is part of the experience—you leave the city, the pavement, and your expectations behind. What you find is pure, unfiltered Oaxaca.",
    signature: "The ever-changing prix fixe menu made from whatever the land provides",
    michelinStatus: "Michelin Selected",
    website: "https://www.alfonsina.mx",
    rating: "extraordinary",
  },
  {
    id: "crudo",
    name: "Crudo",
    subtitle: "Where Japan Meets Oaxaca",
    chef: "Ricardo Arellano",
    neighborhood: "Centro",
    cuisine: "Japanese-Oaxacan Fusion",
    priceRange: "$$$",
    description:
      "Chef Ricardo Arellano has crafted a creative omakase that fuses Japanese precision with Oaxacan soul. Local ingredients meet Japanese preparations in ways that shouldn't work but absolutely do.",
    whyWeLoveIt:
      "The audacity. To take two of the world's most revered culinary traditions and weave them together requires either genius or madness. Arellano has both.",
    signature: "The omakase—surrender to the chef's vision",
    michelinStatus: "Michelin Selected",
    rating: "extraordinary",
  },
  {
    id: "levadura",
    name: "Levadura de Olla",
    subtitle: "Memory Made Edible",
    chef: "Thalía Barrios García",
    neighborhood: "Centro (García Vigil)",
    cuisine: "Traditional Oaxacan",
    priceRange: "$$",
    description:
      "Colorful and creative, Chef Thalía Barrios García channels traditional Oaxacan recipes as well as memories from her hometown of San Mateo Yucutindoo. Every dish is a story from the pueblos.",
    whyWeLoveIt:
      "Thalía cooks with her grandmother's hands and her own vision. The result is food that tastes like memory—familiar yet revelatory.",
    signature: "Dishes that change with the chef's memories and the market's offerings",
    michelinStatus: "Michelin Selected",
    website: "https://levaduradeolla.mx",
    rating: "extraordinary",
  },
  {
    id: "sanzin",
    name: "Sanzin",
    subtitle: "Three Tables, Infinite Possibilities",
    chef: "Various",
    neighborhood: "Centro",
    cuisine: "Japanese-Oaxacan",
    priceRange: "$$",
    description:
      "With only three tables and a daily-changing menu, Sanzin is the kind of place you stumble upon and never forget. Japanese technique meets Oaxacan ingredients in an intimate setting that feels like a secret.",
    whyWeLoveIt:
      "The scarcity is part of the magic. Three tables means you're not a customer—you're a guest. The daily menu means every visit is a first visit.",
    rating: "excellent",
  },
  {
    id: "tikaya",
    name: "Tika'aya",
    subtitle: "Indigenous Roots, Modern Expression",
    chef: "Antonio García",
    neighborhood: "Near Mercado de La Merced",
    cuisine: "Indigenous Mixtecan",
    priceRange: "$$",
    description:
      "A tiny nook of a restaurant that's a surprise in every way. Young chef Antonio García brings refined flair to indigenous Mixtecan dishes. No menu—just trust the kitchen.",
    whyWeLoveIt:
      "This is the future of Oaxacan cuisine: young cooks reclaiming their indigenous heritage and presenting it with pride and precision. Michelin noticed. You should too.",
    signature: "The five-course tasting menu that changes daily",
    michelinStatus: "Michelin Selected",
    rating: "extraordinary",
  },
];

const ratingStyles = {
  extraordinary: {
    badge: "rounded-full bg-terracotta px-3 py-1 font-mono text-xs tracking-wider text-white",
    label: "Extraordinary",
  },
  excellent: {
    badge: "rounded-full bg-sage px-3 py-1 font-mono text-xs tracking-wider text-white",
    label: "Excellent",
  },
  avoid: {
    badge: "rounded-full bg-red-600 px-3 py-1 font-mono text-xs tracking-wider text-white",
    label: "Avoid",
  },
};

export function SacredKitchens() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 opacity-5">
          <svg aria-hidden="true" className="absolute inset-0 size-full">
            <defs>
              <pattern
                id="ss-kitchens-diamonds"
                width="50"
                height="50"
                viewBox="0 0 100 100"
                patternUnits="userSpaceOnUse"
              >
                <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#000" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ss-kitchens-diamonds)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-2">
            <Utensils aria-hidden="true" className="size-5 text-terracotta" />
            <span className="font-mono text-sm tracking-wider text-terracotta">SACRED KITCHENS</span>
          </div>

          <h1 className="mb-6 font-display text-5xl text-foreground md:text-7xl">
            Sacred
            <br />
            <span className="text-terracotta">Kitchens</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Mezcal is only half the story. These are the kitchens where the spirit of Oaxaca lives on the plate— the
            food experiences that touch the mind and touch the heart.
          </p>
        </div>
      </section>

      {/* Restaurant Cards */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl space-y-12">
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:border-terracotta/30 hover:shadow-xl"
            >
              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-3xl text-foreground transition-colors group-hover:text-terracotta md:text-4xl">
                        {restaurant.name}
                      </h2>
                      <span className={ratingStyles[restaurant.rating].badge}>
                        {ratingStyles[restaurant.rating].label.toUpperCase()}
                      </span>
                    </div>
                    {restaurant.subtitle && <p className="text-lg text-muted-foreground italic">{restaurant.subtitle}</p>}
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-2xl text-terracotta">{restaurant.priceRange}</span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {restaurant.chef && (
                    <div className="flex items-center gap-2">
                      <ChefHat aria-hidden="true" className="size-4" />
                      <span>Chef {restaurant.chef}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-4" />
                    <span>{restaurant.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils aria-hidden="true" className="size-4" />
                    <span>{restaurant.cuisine}</span>
                  </div>
                  {restaurant.michelinStatus && (
                    <div className="flex items-center gap-2">
                      <Star aria-hidden="true" className="size-4 text-terracotta" />
                      <span className="text-terracotta">{restaurant.michelinStatus}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mb-6 leading-relaxed text-foreground/80">{restaurant.description}</p>

                {/* Why We Love It */}
                <div className="mb-6 rounded-lg border-l-4 border-terracotta bg-terracotta/5 p-5">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-terracotta">
                    <Quote aria-hidden="true" className="size-4" />
                    Why We Love It
                  </p>
                  <p className="leading-relaxed text-foreground/90 italic">{restaurant.whyWeLoveIt}</p>
                </div>

                {/* Signature Dish */}
                {restaurant.signature && (
                  <p className="mb-6 text-sm text-muted-foreground">
                    <strong className="text-foreground">Don&apos;t Miss:</strong> {restaurant.signature}
                  </p>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4 border-t border-border/50 pt-4">
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-coral"
                    >
                      Visit Website
                      <ExternalLink aria-hidden="true" className="size-4" />
                    </a>
                  )}
                  {restaurant.reviewLink !== undefined && (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      {restaurant.reviewNote || "Full review coming soon"}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-display text-2xl text-foreground md:text-3xl">More Reviews Coming</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Including the ones that didn&apos;t make the cut. Because knowing where <em>not</em> to eat is just as
            valuable as knowing where to go.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-earth px-4 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-display text-3xl md:text-4xl">Complete the Experience</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80">
            Great food deserves great mezcal. Find the bottles that will elevate your meal.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ss("/scent-finder")}
              className="flex items-center justify-center gap-2 rounded-lg bg-terracotta px-8 py-4 font-medium text-white transition-colors hover:bg-coral"
            >
              Find Your Mezcal by Scent
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href={ss("/mexico-source")}
              className="rounded-lg border-2 border-white/30 bg-transparent px-8 py-4 font-medium text-white transition-colors hover:border-white"
            >
              Explore Mexico&apos;s Finest Bottles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
