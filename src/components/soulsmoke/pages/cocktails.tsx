"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Flame, Leaf, Sparkles, Star } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Cocktails.tsx (2026-11-10). Same copy (the
// app had English only on this page), filters and classes. A card's recipe is always in the
// page's HTML and hidden while the card is closed (porting rule: collapsed real content stays
// crawlable); the clickable card header is a real button.

interface Cocktail {
  id: string;
  name: string;
  tagline: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  time: string;
  glass: string;
  ingredients: { amount: string; item: string; note?: string }[];
  instructions: string[];
  mezcalPairing: string;
  story: string;
  category: "Classic" | "Modern Classic" | "Esoteric" | "Refreshing";
  icon: "flame" | "star" | "sparkles" | "leaf";
}

const cocktails: Cocktail[] = [
  {
    id: "oaxaca-old-fashioned",
    name: "Oaxaca Old Fashioned",
    tagline: "The gateway drug. Where it all begins.",
    difficulty: "Easy",
    time: "3 min",
    glass: "Rocks glass",
    ingredients: [
      { amount: "1.5 oz", item: "Reposado tequila" },
      { amount: "0.5 oz", item: "Mezcal", note: "Espadín works beautifully" },
      { amount: "1 tsp", item: "Agave nectar" },
      { amount: "2 dashes", item: "Angostura bitters" },
      { amount: "1", item: "Orange peel", note: "for garnish" },
    ],
    instructions: [
      "Add tequila, mezcal, agave nectar, and bitters to a mixing glass with ice",
      "Stir for 30 seconds until well-chilled",
      "Strain into a rocks glass over a large ice cube",
      "Express orange peel over the drink and drop it in",
    ],
    mezcalPairing: "Del Maguey Vida or any smooth Espadín",
    story: "Created by Phil Ward at Death & Co in 2007, this cocktail single-handedly introduced a generation to mezcal. The smoke plays backup to the tequila, whispering rather than shouting.",
    category: "Modern Classic",
    icon: "flame",
  },
  {
    id: "division-bell",
    name: "Division Bell",
    tagline: "Bitter, smoky, and unapologetically complex.",
    difficulty: "Medium",
    time: "4 min",
    glass: "Coupe",
    ingredients: [
      { amount: "1 oz", item: "Mezcal" },
      { amount: "0.75 oz", item: "Aperol" },
      { amount: "0.5 oz", item: "Maraschino liqueur" },
      { amount: "0.75 oz", item: "Fresh lime juice" },
    ],
    instructions: [
      "Add all ingredients to a shaker with ice",
      "Shake vigorously for 15 seconds",
      "Double strain into a chilled coupe",
      "No garnish needed - let the color speak",
    ],
    mezcalPairing: "Something with moderate smoke - Banhez or El Jolgorio Espadín",
    story: "Named after the Pink Floyd album, this drink is a study in balance. The Aperol's bitterness, maraschino's sweetness, and mezcal's smoke create a harmony that shouldn't work but absolutely does.",
    category: "Modern Classic",
    icon: "star",
  },
  {
    id: "naked-and-famous",
    name: "Naked & Famous",
    tagline: "The Last Word's smoky, rebellious cousin.",
    difficulty: "Easy",
    time: "3 min",
    glass: "Coupe",
    ingredients: [
      { amount: "0.75 oz", item: "Mezcal" },
      { amount: "0.75 oz", item: "Yellow Chartreuse" },
      { amount: "0.75 oz", item: "Aperol" },
      { amount: "0.75 oz", item: "Fresh lime juice" },
    ],
    instructions: [
      "Add all ingredients to a shaker with ice",
      "Shake hard for 12 seconds",
      "Double strain into a chilled coupe",
      "Garnish with nothing - it's naked, after all",
    ],
    mezcalPairing: "Del Maguey Chichicapa for extra depth",
    story: "Created by Joaquín Simó at Death & Co, this equal-parts cocktail riffs on the Last Word but swaps gin for mezcal and green Chartreuse for yellow. The result is softer, smokier, and dangerously drinkable.",
    category: "Modern Classic",
    icon: "sparkles",
  },
  {
    id: "mezcal-negroni",
    name: "Mezcal Negroni",
    tagline: "The Italian classic gets a Oaxacan passport.",
    difficulty: "Easy",
    time: "2 min",
    glass: "Rocks glass",
    ingredients: [
      { amount: "1 oz", item: "Mezcal" },
      { amount: "1 oz", item: "Campari" },
      { amount: "1 oz", item: "Sweet vermouth" },
      { amount: "1", item: "Orange peel", note: "for garnish" },
    ],
    instructions: [
      "Add mezcal, Campari, and vermouth to a mixing glass with ice",
      "Stir for 20-30 seconds",
      "Strain into a rocks glass over a large ice cube",
      "Express orange peel and drop it in",
    ],
    mezcalPairing: "A bold, smoky Espadín like Vago Elote or Real Minero",
    story: "Some substitutions are sacrilege. This one is revelation. The mezcal's smoke cuts through the Campari's bitterness in ways gin never could, creating something simultaneously familiar and alien.",
    category: "Classic",
    icon: "flame",
  },
  {
    id: "single-village-fix",
    name: "Single Village Fix",
    tagline: "Honey, smoke, and citrus in perfect tension.",
    difficulty: "Easy",
    time: "3 min",
    glass: "Rocks glass",
    ingredients: [
      { amount: "2 oz", item: "Mezcal" },
      { amount: "0.75 oz", item: "Fresh lime juice" },
      { amount: "0.5 oz", item: "Honey syrup", note: "2:1 honey to water" },
      { amount: "1", item: "Lime wheel", note: "for garnish" },
    ],
    instructions: [
      "Add mezcal, lime juice, and honey syrup to a shaker with ice",
      "Shake until well-chilled",
      "Strain into a rocks glass filled with crushed ice",
      "Garnish with lime wheel",
    ],
    mezcalPairing: "Single-village mezcal from Del Maguey - San Luis del Rio or Chichicapa",
    story: "A Fix is a category of cocktail from the 1800s - spirit, citrus, sweetener, served over crushed ice. This version lets the mezcal's terroir shine through the honey's richness.",
    category: "Classic",
    icon: "leaf",
  },
  {
    id: "la-ultima-palabra",
    name: "La Última Palabra",
    tagline: "The Last Word, but make it existential.",
    difficulty: "Medium",
    time: "4 min",
    glass: "Coupe",
    ingredients: [
      { amount: "0.75 oz", item: "Mezcal" },
      { amount: "0.75 oz", item: "Green Chartreuse" },
      { amount: "0.75 oz", item: "Maraschino liqueur" },
      { amount: "0.75 oz", item: "Fresh lime juice" },
    ],
    instructions: [
      "Add all ingredients to a shaker with ice",
      "Shake vigorously",
      "Double strain into a chilled coupe",
      "Contemplate mortality",
    ],
    mezcalPairing: "Something wild - Tobalá or Tepeztate for extra complexity",
    story: "The original Last Word was created in Detroit during Prohibition. This mezcal version adds smoke to the herbal complexity, creating something that feels ancient and modern simultaneously.",
    category: "Modern Classic",
    icon: "sparkles",
  },
  {
    id: "smoke-signal",
    name: "Smoke Signal",
    tagline: "When you need the ancestors to hear you.",
    difficulty: "Advanced",
    time: "5 min",
    glass: "Coupe",
    ingredients: [
      { amount: "1.5 oz", item: "Mezcal", note: "preferably ancestral" },
      { amount: "0.75 oz", item: "Cynar" },
      { amount: "0.5 oz", item: "Fresh lemon juice" },
      { amount: "0.5 oz", item: "Honey syrup" },
      { amount: "2 dashes", item: "Mole bitters" },
    ],
    instructions: [
      "Add all ingredients to a shaker with ice",
      "Shake hard for 15 seconds",
      "Double strain into a chilled coupe",
      "Garnish with a thin lemon wheel floating on top",
    ],
    mezcalPairing: "Real Minero Largo or any clay-pot distilled ancestral",
    story: "The artichoke notes in Cynar find unexpected kinship with mezcal's vegetal undertones. The mole bitters tie it all back to Oaxaca. This is a drink for sitting in silence.",
    category: "Esoteric",
    icon: "flame",
  },
  {
    id: "ghost-of-oaxaca",
    name: "Ghost of Oaxaca",
    tagline: "Pechuga in a glass. Almost.",
    difficulty: "Advanced",
    time: "6 min",
    glass: "Coupe",
    ingredients: [
      { amount: "1.5 oz", item: "Pechuga mezcal", note: "or high-quality Espadín" },
      { amount: "0.75 oz", item: "Blanc vermouth" },
      { amount: "0.5 oz", item: "Pear liqueur" },
      { amount: "0.25 oz", item: "Maraschino liqueur" },
      { amount: "2 dashes", item: "Orange bitters" },
    ],
    instructions: [
      "Add all ingredients to a mixing glass with ice",
      "Stir for 40 seconds - this one needs time",
      "Strain into a chilled coupe",
      "Express a grapefruit peel over the top, discard",
    ],
    mezcalPairing: "Real Minero Pechuga or 5 Sentidos Pechuga",
    story: "Pechuga mezcals are distilled with fruits and sometimes turkey breast, creating ethereal complexity. This cocktail tries to honor that spirit without masking it.",
    category: "Esoteric",
    icon: "sparkles",
  },
  {
    id: "paloma-negra",
    name: "Paloma Negra",
    tagline: "The Paloma grew up and moved to Oaxaca.",
    difficulty: "Easy",
    time: "3 min",
    glass: "Highball",
    ingredients: [
      { amount: "2 oz", item: "Mezcal" },
      { amount: "0.75 oz", item: "Fresh lime juice" },
      { amount: "0.5 oz", item: "Agave nectar" },
      { amount: "Top", item: "Grapefruit soda", note: "Jarritos or Squirt" },
      { amount: "Pinch", item: "Sal de gusano", note: "on the rim" },
    ],
    instructions: [
      "Rim half the glass with sal de gusano",
      "Add mezcal, lime juice, and agave to a shaker with ice",
      "Shake briefly and strain into ice-filled highball",
      "Top with grapefruit soda and stir gently",
    ],
    mezcalPairing: "Nuestra Soledad or any bright, citrusy Espadín",
    story: "The Paloma is Mexico's most popular cocktail, usually made with tequila. This darker version swaps in mezcal and adds sal de gusano - salt mixed with dried agave worms and chiles.",
    category: "Refreshing",
    icon: "leaf",
  },
  {
    id: "el-diablo-verde",
    name: "El Diablo Verde",
    tagline: "Ginger, lime, and smoke walk into a bar.",
    difficulty: "Easy",
    time: "3 min",
    glass: "Highball",
    ingredients: [
      { amount: "2 oz", item: "Mezcal" },
      { amount: "0.5 oz", item: "Crème de cassis" },
      { amount: "0.75 oz", item: "Fresh lime juice" },
      { amount: "Top", item: "Ginger beer" },
    ],
    instructions: [
      "Add mezcal, cassis, and lime to a shaker with ice",
      "Shake briefly",
      "Strain into an ice-filled highball",
      "Top with ginger beer and garnish with lime",
    ],
    mezcalPairing: "Something with good smoke - Bozal Espadín or Meteoro",
    story: "El Diablo is a classic tequila cocktail from the 1940s. The mezcal version is called 'verde' because the smoke adds a whole new dimension - like the devil got an upgrade.",
    category: "Refreshing",
    icon: "flame",
  },
  {
    id: "midnight-mass",
    name: "Midnight Mass",
    tagline: "Coffee, mezcal, and questionable decisions.",
    difficulty: "Medium",
    time: "4 min",
    glass: "Rocks glass",
    ingredients: [
      { amount: "1.5 oz", item: "Mezcal" },
      { amount: "1 oz", item: "Cold brew coffee" },
      { amount: "0.75 oz", item: "Coffee liqueur", note: "Mr. Black or similar" },
      { amount: "0.25 oz", item: "Agave nectar" },
      { amount: "2 dashes", item: "Chocolate bitters" },
    ],
    instructions: [
      "Add all ingredients to a shaker with ice",
      "Shake until very cold",
      "Strain into a rocks glass over a large ice cube",
      "Garnish with three coffee beans",
    ],
    mezcalPairing: "Something earthy - Madre Cuishe or a funky Tobalá",
    story: "For when you need to stay awake but also need to forget. The coffee and mezcal are natural partners - both products of fermentation, both bitter, both transformative.",
    category: "Esoteric",
    icon: "star",
  },
  {
    id: "the-ancestor",
    name: "The Ancestor",
    tagline: "A drink for talking to the dead.",
    difficulty: "Advanced",
    time: "5 min",
    glass: "Coupe",
    ingredients: [
      { amount: "1.5 oz", item: "Ancestral mezcal", note: "clay pot distilled" },
      { amount: "0.75 oz", item: "Amontillado sherry" },
      { amount: "0.5 oz", item: "Bénédictine" },
      { amount: "2 dashes", item: "Angostura bitters" },
    ],
    instructions: [
      "Add all ingredients to a mixing glass with ice",
      "Stir for 45 seconds - patience is required",
      "Strain into a chilled coupe",
      "No garnish - let the spirits speak",
    ],
    mezcalPairing: "Real Minero Largo, Lalocura, or any ancestral expression",
    story: "This drink is meant to be sipped slowly, preferably alone, preferably after midnight. The sherry's nuttiness meets the mezcal's earthiness in a conversation that feels centuries old.",
    category: "Esoteric",
    icon: "sparkles",
  },
];

const categoryColors: Record<Cocktail["category"], string> = {
  Classic: "rounded-full border border-amber-700/50 bg-amber-900/30 px-3 py-1 text-xs text-amber-400",
  "Modern Classic":
    "rounded-full border border-emerald-700/50 bg-emerald-900/30 px-3 py-1 text-xs text-emerald-400",
  Esoteric: "rounded-full border border-purple-700/50 bg-purple-900/30 px-3 py-1 text-xs text-purple-400",
  Refreshing: "rounded-full border border-cyan-700/50 bg-cyan-900/30 px-3 py-1 text-xs text-cyan-400",
};

const difficultyColors: Record<Cocktail["difficulty"], string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Advanced: "text-red-400",
};

const ICONS = { flame: Flame, star: Star, sparkles: Sparkles, leaf: Leaf };

const categories = ["All", "Classic", "Modern Classic", "Esoteric", "Refreshing"];

export function Cocktails() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedCocktail, setExpandedCocktail] = useState<string | null>(null);

  const filteredCocktails =
    selectedCategory === "All" ? cocktails : cocktails.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-linear-to-b from-amber-950/20 to-background" />
        <div className="relative z-10 container">
          <Link
            href={ss("/")}
            className="mb-8 inline-flex cursor-pointer items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>

          <h1 className="mb-4 font-serif text-5xl text-amber-400 md:text-6xl">The Cocktail Codex</h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Twelve cocktails that respect the spirit. No smoky margaritas. No mezcal mules. Just drinks that let mezcal
            be mezcal.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-white/10 py-8">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={
                  selectedCategory === category
                    ? "rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-all"
                    : "rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cocktails Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCocktails.map((cocktail) => {
              const expanded = expandedCocktail === cocktail.id;
              const Icon = ICONS[cocktail.icon];
              return (
                <div
                  key={cocktail.id}
                  className={
                    expanded
                      ? "overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 md:col-span-2"
                      : "overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300"
                  }
                >
                  {/* Header */}
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`cocktail-${cocktail.id}`}
                    className="block w-full cursor-pointer p-6 text-left transition-colors hover:bg-white/5"
                    onClick={() => setExpandedCocktail(expanded ? null : cocktail.id)}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-900/30 p-2 text-amber-400">
                          <Icon aria-hidden="true" className="size-5" />
                        </div>
                        <div>
                          <h2 className="font-serif text-2xl text-white">{cocktail.name}</h2>
                          <p className="text-sm text-gray-300 italic">{cocktail.tagline}</p>
                        </div>
                      </div>
                      <span className={categoryColors[cocktail.category]}>{cocktail.category}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className={difficultyColors[cocktail.difficulty]}>{cocktail.difficulty}</span>
                      <span className="flex items-center gap-1">
                        <Clock aria-hidden="true" className="size-4" />
                        {cocktail.time}
                      </span>
                      <span>{cocktail.glass}</span>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <div
                    id={`cocktail-${cocktail.id}`}
                    hidden={!expanded}
                    className="border-t border-white/10 px-6 pt-6 pb-6"
                  >
                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Ingredients */}
                      <div>
                        <h3 className="mb-4 font-medium text-amber-400">Ingredients</h3>
                        <ul className="space-y-2">
                          {cocktail.ingredients.map((ing) => (
                            <li key={ing.item} className="flex items-start gap-3 text-gray-200">
                              <span className="w-16 shrink-0 font-mono text-sm text-amber-400">{ing.amount}</span>
                              <span>
                                {ing.item}
                                {ing.note && <span className="text-sm text-gray-400"> ({ing.note})</span>}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h3 className="mb-4 font-medium text-amber-400">Method</h3>
                        <ol className="space-y-3">
                          {cocktail.instructions.map((step, i) => (
                            <li key={step} className="flex items-start gap-3 text-gray-200">
                              <span className="font-mono text-sm text-amber-400">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Mezcal Pairing & Story */}
                    <div className="mt-6 border-t border-white/10 pt-6">
                      <div className="mb-4 rounded-xl bg-amber-950/20 p-4">
                        <h3 className="mb-2 font-medium text-amber-400">Mezcal Pairing</h3>
                        <p className="text-gray-200">{cocktail.mezcalPairing}</p>
                      </div>
                      <p className="text-gray-300 italic">{cocktail.story}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-linear-to-b from-transparent to-amber-950/10 py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-3xl text-amber-400">The Philosophy</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-200">
            A great mezcal cocktail doesn&apos;t hide the spirit - it frames it. The smoke should dance with the other
            ingredients, not dominate them. These recipes are starting points, not commandments. Adjust to your mezcal,
            your palate, your moment.
          </p>
          <p className="text-gray-300">
            And remember: the best mezcal is often best served neat, with nothing but time and attention.
          </p>
        </div>
      </section>
    </div>
  );
}
