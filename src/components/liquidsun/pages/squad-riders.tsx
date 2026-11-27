import { Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/SquadRiders.tsx (2026-11-21). Same copy and
// classes. "Enlist Now" did nothing in the app; it stays inert on purpose (owner decision pending).
export function SquadRiders() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.jimadorSunset} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-4xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              Squad Riders
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              The few. The proud. The ones who know that &quot;smooth&quot; is an insult.
            </p>
          </header>

          <div className="grid gap-8">
            <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                  Join the Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-slate-300">
                  We are not a fan club. We are a resistance movement against the industrialization of spirit. Squad Riders get access to:
                </p>
                <ul className="list-inside list-disc space-y-2 text-slate-400">
                  <li>Early access to single-barrel picks.</li>
                  <li>Invites to &quot;Sacred Kitchen&quot; dinners in Jalisco.</li>
                  <li>The right to wear the &quot;No Diffuser&quot; patch.</li>
                </ul>
                <div className="pt-6">
                  {/* Inert, as on the app. */}
                  <button
                    type="button"
                    className="rounded-sm bg-amber-600 px-8 py-3 text-sm font-bold tracking-widest text-slate-950 uppercase transition-colors hover:bg-amber-500"
                  >
                    Enlist Now
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
