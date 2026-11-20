import { Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/TheMasters.tsx (2026-11-21). Same six masters,
// copy and classes, including the app's grey image placeholders (no portraits existed).

export const masters = [
  {
    name: "Carlos Camarena",
    house: "El Tesoro / Tequila Ocho",
    bio: "The godfather of terroir. He proved that where the agave grows changes everything. A purist who refuses to compromise, even as the industry rushes to cut corners.",
  },
  {
    name: "Felipe Camarena",
    house: "G4 / Terralta / Volans",
    bio: 'The mad scientist. He turned a steamroller into a tahona ("Frankenstein") and uses rainwater, spring water, and deep well water to create distinct flavor profiles from the same agave.',
  },
  {
    name: "Guillermo Sauza",
    house: "Fortaleza",
    bio: "The revivalist. He brought back the old ways—stone crushing, small copper pots, open-air fermentation—when everyone else said it was inefficient. He saved the soul of tequila.",
  },
  {
    name: "Sophie Decobecq",
    house: "Calle 23",
    bio: 'The biochemist with a poet\'s heart. Her "Criollo" project is legendary—using only small, intense blue agaves to create a spirit that is both scientifically perfect and wildly emotional.',
  },
  {
    name: "Enrique Fonseca",
    house: "Fuenteseca / Cimarron",
    bio: "The architect of aging. He has the deepest cellar in the industry, aging tequila like fine cognac in French oak, American oak, and sherry casks for decades.",
  },
  {
    name: "Chava Rosales",
    house: "Cascahuín",
    bio: 'The bridge between tradition and the future. His "11 Brix" and "Tahona" releases are masterclasses in fermentation control and high-proof excellence.',
  },
];

export function TheMasters() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.agaveFieldMoon} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              The Masters
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              The hands that touch the earth, the hearts that honor the plant. These are the guardians of the spirit.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {masters.map((m) => (
              <Card
                key={m.name}
                className="group border-amber-500/10 bg-slate-900/40 backdrop-blur-sm transition-colors duration-300 hover:bg-slate-900/60"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-slate-900 to-transparent" />
                  <div className="size-full bg-slate-800 transition-transform duration-700 group-hover:scale-105" />
                </div>
                <CardHeader>
                  <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                    {m.name}
                  </CardTitle>
                  <p className="font-mono text-xs tracking-widest text-amber-500/60 uppercase">{m.house}</p>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-slate-300">{m.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
