import { Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/AgaveGenetics.tsx (2026-11-21). Same copy and
// classes ("prose" classes dropped: the app had no typography plugin, so they did nothing).
export function AgaveGenetics() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.agaveMoonlit} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-4xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              The Clone Wars
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              Why 99% of Tequila is genetically identical, and why that&apos;s a ticking time bomb.
            </p>
          </header>

          <div className="grid gap-12">
            <section className="rounded-xl border border-amber-500/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md md:p-12">
              <div className="space-y-8">
                <h2 className="font-serif text-3xl text-amber-400">The Hijuelo Trap</h2>
                <div className="max-w-none space-y-5 text-lg leading-relaxed text-slate-300">
                  <p>
                    In the wild, agaves reproduce sexually via the <span className="font-medium text-amber-200">Quiote</span> (flower
                    stalk), which is pollinated by bats. This shuffles the genetic deck, creating resilience against disease.
                  </p>
                  <p>
                    But in the industry, we cheat. We cut the quiote to save sugar, and we propagate via{" "}
                    <span className="font-medium text-amber-200">Hijuelos</span> (pups)—genetic clones that sprout from the mother
                    plant&apos;s base.
                  </p>
                  <p>
                    The result? A monoculture of billions of identical plants, all vulnerable to the same pests and diseases. It&apos;s an
                    efficiency that risks extinction.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                    Asexual (Clonal)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-inside list-disc space-y-2 text-slate-400">
                    <li>Method: Hijuelos (Pups)</li>
                    <li>Speed: Fast (Ready to plant immediately)</li>
                    <li>Consistency: 100% Identical</li>
                    <li>Risk: Zero genetic diversity</li>
                    <li>Industry Standard: 99.9%</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                    Sexual (Seed)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-inside list-disc space-y-2 text-slate-400">
                    <li>Method: Quiote &amp; Bat Pollination</li>
                    <li>Speed: Slow (Requires flowering cycle)</li>
                    <li>Consistency: High Variation</li>
                    <li>Benefit: Genetic resilience</li>
                    <li>Industry Standard: &lt; 0.1% (Projects like Siembra Valles)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <section className="space-y-8 py-12 text-center">
              <h2 className="font-serif text-3xl text-amber-400">The Bat Friendly Project</h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                A few brave producers (Tequila Ocho, Cascahuín, Siembra Valles) are letting a percentage of their fields flower. They
                sacrifice sugar for the sake of the bat, the ecosystem, and the future of the spirit.
              </p>
              <div className="inline-block rounded-full border border-amber-500/30 px-6 py-2 font-mono text-sm tracking-widest text-amber-400 uppercase">
                Look for the Bat Hologram
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
