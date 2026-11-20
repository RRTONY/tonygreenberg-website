import { Cherry, Citrus, GlassWater, Slice, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";

// Ported from the LiquidSun app's client/src/pages/Cocktails.tsx (route /cocktails, H1 "The Altar"
// as in the app, 2026-11-21). Same drinks and copy; each fades up as it scrolls in (y 20, delay
// index * 0.1, once). The glass art was a giant emoji (🔪 🍋 🍊 🍅 🥃); it is a lucide icon at the
// same size and opacity (CONTRIBUTING rule 18): knife, lime, grapefruit/orange, tomato, rocks glass.

type Cocktail = { name: string; origin: string; description: string; ingredients: string[]; method: string; icon: LucideIcon };

export const cocktails: Cocktail[] = [
  {
    name: "The Batanga",
    origin: "La Capilla, Tequila, Jalisco",
    description:
      "Created by Don Javier Delgado Corona. It must be stirred with a knife. The salt rim represents the sweat of the jimador.",
    ingredients: ["2 oz Tequila Blanco (Highlands)", "0.5 oz Fresh Lime Juice", "Coca-Cola (Mexican, cane sugar)", "Salt rim", "Knife for stirring"],
    method: "Rim a tall glass with salt. Fill with ice. Add tequila and lime. Top with Coke. Stir with a knife. Do not use a spoon.",
    icon: Slice,
  },
  {
    name: "Tommy's Margarita",
    origin: "Tommy's Mexican Restaurant, San Francisco",
    description:
      "Julio Bermejo's masterpiece. He removed the orange liqueur (Triple Sec) to let the agave shine. The modern standard.",
    ingredients: ["2 oz Tequila Reposado", "1 oz Fresh Lime Juice", "0.5 oz Agave Nectar (diluted 1:1 with water)"],
    method: "Shake hard with ice. Strain into a rocks glass over fresh ice. No salt rim (unless requested). Garnish with a lime wheel.",
    icon: Citrus,
  },
  {
    name: "The Paloma",
    origin: "Unknown (The People's Drink)",
    description: "More popular in Mexico than the Margarita. Simple, refreshing, and perfect for the heat of the distillery.",
    ingredients: ["2 oz Tequila Blanco", "0.5 oz Fresh Lime Juice", "Grapefruit Soda (Squirt or Jarritos)", "Pinch of salt"],
    method: "Build in a highball glass with ice. Add tequila, lime, and salt. Top with grapefruit soda. Stir gently.",
    icon: Citrus,
  },
  {
    name: "Tequila & Sangrita",
    origin: "Traditional Service",
    description: "Not a cocktail, but a ritual. A shot of tequila served alongside a shot of spicy, citrusy tomato juice (Sangrita).",
    ingredients: ["1.5 oz Tequila Blanco (sipping)", "1.5 oz Sangrita (Tomato, Orange, Lime, Grenadine, Hot Sauce)"],
    method: "Sip the tequila. Sip the sangrita. Repeat. Do not shoot.",
    icon: Cherry,
  },
  {
    name: "Oaxacan Old Fashioned",
    origin: "Death & Co, NYC",
    description: "A bridge between worlds. The smoke of mezcal meets the structure of reposado tequila.",
    ingredients: ["1.5 oz Tequila Reposado", "0.5 oz Mezcal Espadin", "1 tsp Agave Nectar", "2 dashes Angostura Bitters"],
    method: "Stir with ice. Strain into a rocks glass over a large cube. Garnish with a flamed orange peel.",
    icon: GlassWater,
  },
];

export function Cocktails() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The Altar</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">We do not mask the spirit. We elevate it. These are the vessels.</p>
        </div>

        <div className="grid gap-16">
          {cocktails.map((drink, index) => {
            const Icon = drink.icon;
            return (
              <Reveal
                key={drink.name}
                margin="0px"
                delay={index * 0.1}
                enter="animate-in fade-in fill-mode-both slide-in-from-bottom-5"
                className="grid items-center gap-8 border-b border-border/30 pb-12 last:border-0 md:grid-cols-2"
              >
                <div className="order-2 md:order-1">
                  <span className="mb-2 block font-mono text-xs tracking-widest text-accent uppercase">{drink.origin}</span>
                  <h2 className="mb-4 font-display text-4xl text-foreground">{drink.name}</h2>
                  <p className="mb-6 leading-relaxed text-muted-foreground">{drink.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-bold tracking-wider text-primary uppercase">The Build</h3>
                      <ul className="space-y-1">
                        {drink.ingredients.map((ing) => (
                          <li key={ing} className="border-l-2 border-primary/20 pl-3 font-mono text-sm text-foreground/80">
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-bold tracking-wider text-primary uppercase">The Ritual</h3>
                      <p className="text-sm text-foreground/80 italic">{drink.method}</p>
                    </div>
                  </div>
                </div>

                <div className="order-1 flex justify-center md:order-2">
                  <div className="group relative flex h-80 w-64 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-50 transition-opacity group-hover:opacity-80" />
                    <Icon aria-hidden="true" className="size-32 opacity-20 transition-transform duration-500 group-hover:scale-110" strokeWidth={1} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
