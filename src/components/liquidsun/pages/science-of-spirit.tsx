import { Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/ScienceOfSpirit.tsx (2026-11-21). Same copy and
// classes ("prose" classes dropped: the app had no typography plugin, so they did nothing).
export function ScienceOfSpirit() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.alchemyDistillery} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-4xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              Science of Spirit
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              It&apos;s not magic. It&apos;s biochemistry. And if you cheat the chemistry, you cheat the soul.
            </p>
          </header>

          <div className="grid gap-12">
            <section className="rounded-xl border border-amber-500/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md md:p-12">
              <div className="space-y-8">
                <h2 className="font-serif text-3xl text-amber-400">Hydrolysis: The Break</h2>
                <div className="max-w-none space-y-5 text-lg leading-relaxed text-slate-300">
                  <p>
                    Agave is full of <span className="font-medium text-amber-200">Inulin</span> (complex carbohydrates). Yeast can&apos;t
                    eat inulin. We must break it down into fructose.
                  </p>
                  <p>
                    <span className="font-medium text-amber-200">The Right Way:</span> Slow cooking in brick ovens (48-72 hours). This
                    caramelizes the sugars and creates complexity.
                  </p>
                  <p>
                    <span className="font-medium text-red-400">The Wrong Way:</span> Acid hydrolysis (Diffuser). Using hydrochloric acid
                    to strip the sugars instantly. It&apos;s fast, cheap, and tastes like medicinal cleaner.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                    Methanol
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    A byproduct of pectin breakdown. In small amounts, it adds texture. In large amounts, it blinds you.
                  </p>
                  <p className="text-sm text-slate-400">
                    Master distillers make &quot;cuts&quot; (Heads/Tails) to remove it. Industrial producers just filter it out (along with
                    the flavor).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                    Congeners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">The flavor compounds: Esters (fruit), Aldehydes (grass), Terpenes (floral).</p>
                  <p className="text-sm text-slate-400">
                    These are created during fermentation. Open-air fermentation allows wild yeast to add unique congeners (the
                    &quot;funk&quot;). Closed stainless steel tanks create a sterile, uniform profile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
