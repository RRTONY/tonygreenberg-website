import { Mic, Play } from "lucide-react";
import { Card, CardContent, Separator } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/Voices.tsx (2026-11-21). Same episodes, copy and
// classes, including the grey image placeholders the app had. The Play and "Record Now" buttons
// did nothing in the app (no audio was ever attached); they stay inert here on purpose (owner
// decision pending: attach real episodes or drop the buttons). Each gets a label for screen readers.

export const recentEpisodes = [
  { title: "The Additive Free Revolution", subtitle: "with Grover Sanschagrin" },
  { title: "Highlands vs. Valley", subtitle: "Terroir Talk with Sophie Decobecq" },
  { title: "The Lost Art of Fermentation", subtitle: "Wood vs. Stainless Steel" },
];

export function Voices() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.candleCellar} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              The Voices
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              Listen to the stories of the land, told by those who have dedicated their lives to the spirit.
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Card className="group overflow-hidden border-amber-500/20 bg-slate-900/60 backdrop-blur-md transition-all duration-500 hover:border-amber-500/40">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 bg-slate-800 md:h-auto">
                    <div className="absolute inset-0 z-10 bg-linear-to-r from-slate-900/80 to-transparent" />
                    <div className="size-full bg-slate-700 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="rounded bg-amber-600 px-2 py-1 text-xs font-bold tracking-widest text-slate-950 uppercase">New Episode</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-6 p-8">
                    <div>
                      <h2 className="mb-2 font-serif text-3xl text-amber-100">The Soul of the Tahona</h2>
                      <p className="font-light text-slate-400">
                        A deep dive into the ancient method of crushing agave with a volcanic stone wheel. Featuring Carlos Camarena and the
                        team at El Tesoro.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Inert, as on the app. */}
                      <button
                        type="button"
                        aria-label="Play The Soul of the Tahona"
                        className="flex size-12 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400"
                      >
                        <Play aria-hidden="true" className="ml-1 size-5" />
                      </button>
                      <div className="flex-1">
                        <div className="h-1 overflow-hidden rounded-full bg-slate-700">
                          <div className="h-full w-1/3 rounded-full bg-amber-500" />
                        </div>
                        <div className="mt-1 flex justify-between font-mono text-xs text-slate-500">
                          <span>12:45</span>
                          <span>45:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-2xl text-amber-200">Recent Conversations</h2>
                <Separator className="flex-1 bg-amber-500/20" />
              </div>

              {recentEpisodes.map((ep) => (
                <Card key={ep.title} className="group cursor-pointer border-amber-500/10 bg-slate-900/40 transition-colors hover:bg-slate-900/60">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <div className="absolute inset-0 bg-amber-500/10 transition-colors group-hover:bg-amber-500/0" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-amber-100 transition-colors group-hover:text-amber-400">{ep.title}</h3>
                      <p className="text-sm text-slate-500">{ep.subtitle}</p>
                    </div>
                    {/* Inert, as on the app. */}
                    <button type="button" aria-label={`Play ${ep.title}`} className="text-slate-500 transition-colors hover:text-amber-400">
                      <Play aria-hidden="true" className="size-5" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-2xl text-amber-200">Join the Circle</h2>
                <Separator className="flex-1 bg-amber-500/20" />
              </div>

              <Card className="space-y-4 border-amber-500/20 bg-linear-to-br from-amber-900/20 to-slate-900 p-6 text-center">
                <Mic aria-hidden="true" className="mx-auto size-12 text-amber-500 opacity-80" />
                <h3 className="font-serif text-xl text-amber-100">Submit Your Story</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Have you found a unicorn in the wild? Or visited a distillery that changed your life? Record a 3-minute voice note and
                  submit it to be featured on the show.
                </p>
                {/* Inert, as on the app. */}
                <button
                  type="button"
                  className="w-full rounded bg-amber-600 py-3 font-bold text-slate-950 shadow-lg shadow-amber-600/20 transition-colors hover:bg-amber-500"
                >
                  Record Now
                </button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
