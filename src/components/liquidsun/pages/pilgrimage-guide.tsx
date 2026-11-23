import { Card, CardContent, CardHeader, CardTitle, Separator } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/PilgrimageGuide.tsx (2026-11-21). Same itinerary,
// copy and classes ("prose" classes dropped: no typography plugin in the app, so they did nothing).
// The route's arrows are part of the copy.

export const itinerary = [
  {
    title: "Day 1: The Red Earth (Arandas)",
    intro: "Drive 2 hours east of GDL to Arandas. The soil turns blood red. The air gets thinner.",
    stops: [
      ["Morning:", "Visit La Alteña (El Tesoro/Tapatio). Walk the fields. Smell the fermentation."],
      ["Lunch:", "Carnitas at the distillery (invite only) or Carnitas Jaimes in town."],
      ["Afternoon:", "Visit Vivanco (Viva México) to see classical music fermentation."],
      ["Stay:", "Hotel Cozamil in Arandas."],
    ],
  },
  {
    title: "Day 2: The Valley (Tequila)",
    intro: "Drive across the state to the town of Tequila. The volcano looms large. The soil is black.",
    stops: [
      ["Morning:", "Hike the Tequila Volcano (if you are fit)."],
      ["Lunch:", "La Capilla for a Batanga mixed by the ghost of Don Javier."],
      ["Afternoon:", "Tour Fortaleza. It is a time machine to 1900."],
      ["Stay:", "Hotel Solar de las Animas."],
    ],
  },
  {
    title: "Day 3: The Deep Cut (El Arenal)",
    intro: "The gateway to the valley. Home of the Cascahuín family.",
    stops: [
      ["Morning:", "Cascahuín. Watch the brick ovens steam. Taste the high-proof straight from the still."],
      ["Lunch:", "Street tacos in El Arenal plaza."],
      ["Afternoon:", "Return to GDL. Visit El Buho liquor store to buy everything you can't find in the US."],
    ],
  },
];

export function PilgrimageGuide() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.jimadorSunset} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-4xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              The Pilgrimage
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              It is not a vacation. It is a mission. The path to the source requires respect, stamina, and a designated driver.
            </p>
          </header>

          <div className="grid gap-12">
            <section className="rounded-xl border border-amber-500/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md md:p-12">
              <div className="space-y-8">
                <h2 className="font-serif text-3xl text-amber-400">The Golden Triangle</h2>
                <div className="max-w-none space-y-5 text-lg leading-relaxed text-slate-300">
                  <p>
                    Forget the &quot;Tequila Express&quot; train. That is for tourists. The true seeker rents a car (or hires a driver) and
                    navigates the
                    <span className="font-medium text-amber-200"> Highlands (Los Altos)</span>.
                  </p>
                  <p>
                    Your route: <span className="text-amber-200">Guadalajara → Arandas → Atotonilco → Tequila (Valley)</span>.
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-amber-500/20" />
                <h2 className="font-mono text-sm tracking-[0.2em] text-amber-500/60 uppercase">The Itinerary</h2>
                <Separator className="flex-1 bg-amber-500/20" />
              </div>

              <div className="grid gap-6">
                {itinerary.map((day) => (
                  <Card key={day.title} className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle as="h3" className="font-serif text-2xl text-amber-300">
                        {day.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300">{day.intro}</p>
                      <ul className="list-inside list-disc space-y-2 text-slate-400">
                        {day.stops.map(([when, what]) => (
                          <li key={when}>
                            <span className="text-amber-200">{when}</span> {what}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
