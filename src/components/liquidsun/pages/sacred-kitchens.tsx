import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/SacredKitchens.tsx (2026-11-21). Same copy,
// classes and layout. The CSS background image is next/image (fill + object-cover, same opacity
// and blend), the stardust texture is the rescued tile (.ls-stardust). The page renders its own
// <Navigation /> in the app; here the layout does. Card titles are h2s so the page keeps a
// heading outline (they look the same).

const kitchens = [
  {
    name: "La Alteña (Arandas)",
    tagline: "\"The Carnitas of the Gods\"",
    body: (
      <>
        Served in the courtyard under the orange trees. The pork is slow-cooked in copper cauldrons that rival the stills themselves.
        Pair with: <span className="text-amber-200">Tapatio Blanco 110 Proof</span>.
      </>
    ),
  },
  {
    name: "Fortaleza (Tequila)",
    tagline: "\"The Cave Tacos\"",
    body: (
      <>
        Deep in the limestone caves where the barrels sleep. Simple bean and cheese tacos, but the tortillas are handmade by Doña
        Maria using corn grown on the estate. Pair with: <span className="text-amber-200">Fortaleza Still Strength</span>.
      </>
    ),
  },
  {
    name: "Birria Chololo (Guadalajara)",
    tagline: "\"The Hangover Cure\"",
    body: (
      <>
        Not a distillery, but a religious site. Goat birria roasted in clay ovens. It is the only thing that can bring you back to life
        after a night of &quot;research.&quot;
      </>
    ),
  },
  {
    name: "Cantina La Fuente (Guadalajara)",
    tagline: "\"The Old Guard\"",
    body: (
      <>
        One of the oldest cantinas in GDL. No food menu, just botanas (snacks) that keep coming as long as you keep drinking. The air
        is thick with history and cigar smoke.
      </>
    ),
  },
];

export function SacredKitchens() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <div className="fixed inset-0 z-0">
        <Image
          src={liquidsunImages.alchemyDistillery.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95" />
        <div className="ls-stardust absolute inset-0 animate-pulse opacity-20" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto max-w-4xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              Sacred Kitchens
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              Where the spirit meets the soil. The best food in Jalisco isn&apos;t in restaurants—it&apos;s in the distilleries.
            </p>
          </header>

          <div className="grid gap-12">
            <section className="rounded-xl border border-amber-500/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md md:p-12">
              <div className="space-y-8">
                <h2 className="font-serif text-3xl text-amber-400">The Distillery Lunch</h2>
                <div className="max-w-none text-lg leading-relaxed text-slate-300">
                  <p>
                    If you are lucky enough to visit <span className="font-medium text-amber-200">La Alteña (Tapatio)</span> or{" "}
                    <span className="font-medium text-amber-200">Fortaleza</span>, you know the real magic happens after the tour.
                    It&apos;s the simple, soul-crushing perfection of fresh tortillas, carnitas, and salsa made from the same terroir as
                    the agave.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-8 md:grid-cols-2">
              {kitchens.map((k) => (
                <Card
                  key={k.name}
                  className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm transition-colors duration-300 hover:bg-slate-900/60"
                >
                  <CardHeader>
                    <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                      {k.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 italic">{k.tagline}</p>
                    <p className="text-slate-400">{k.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
