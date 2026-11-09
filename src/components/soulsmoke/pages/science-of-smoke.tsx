import Link from "next/link";
import { ArrowLeft, Clock, Droplets, Flame, Mountain, Thermometer, TreePine } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/ScienceOfSmoke.tsx. Same copy and layout.
// Each smoke profile's bar color is one full class string ("h-8 w-4 rounded bg-...") instead of
// being joined from fragments at the usage site.

export const woodTypes = [
  {
    name: "Encino (Oak)",
    smokeProfile: "Deep, earthy, slightly sweet",
    burnTemp: "High and slow",
    regions: "Most common across Oaxaca",
    notes: "The workhorse of mezcal production. Creates that classic, rounded smoke character most people associate with the spirit.",
  },
  {
    name: "Mezquite (Mesquite)",
    smokeProfile: "Intense, sharp, almost bacon-like",
    burnTemp: "Very high",
    regions: "Northern Mexico, some Oaxacan producers",
    notes: "Burns hotter than oak, creating a more aggressive smoke. Some find it overwhelming, others find it transcendent.",
  },
  {
    name: "Pino (Pine)",
    smokeProfile: "Resinous, aromatic, slightly medicinal",
    burnTemp: "Medium-high",
    regions: "Highland regions",
    notes: "Adds a distinctive piney, almost mentholated quality. Used sparingly or in blends with other woods.",
  },
  {
    name: "Huizache (Acacia)",
    smokeProfile: "Mild, floral, honey-like",
    burnTemp: "Medium",
    regions: "Various",
    notes: "Creates a gentler smoke that lets the agave's natural sweetness shine through.",
  },
  {
    name: "Maguey Leaves (Pencas)",
    smokeProfile: "Vegetal, earthy, complex",
    burnTemp: "Low",
    regions: "Traditional producers",
    notes: "Some mezcaleros layer dried agave leaves with the wood, adding another dimension of terroir.",
  },
];

export const pitFactors = [
  {
    factor: "Depth",
    icon: Mountain,
    description: "Deeper pits (8-12 feet) create more even heat distribution and longer, slower roasting. Shallow pits (4-6 feet) roast faster with more direct heat contact.",
    impact: "Deeper = more caramelization, less char. Shallow = more smoke penetration, potential for bitter notes.",
  },
  {
    factor: "Stone Type",
    icon: Flame,
    description: "River stones retain heat longer and release it more evenly. Volcanic rock can impart mineral notes. The stones are heated for 24+ hours before the agave goes in.",
    impact: "Stone choice affects heat consistency and subtle mineral undertones in the final spirit.",
  },
  {
    factor: "Roasting Time",
    icon: Clock,
    description: "Traditional roasts last 3-5 days. Some producers go longer for specific agaves. The pit is sealed with earth and agave fibers to trap heat and smoke.",
    impact: "Longer roasts = deeper caramelization, more complex sugars. Shorter = brighter, more vegetal character.",
  },
  {
    factor: "Temperature Curve",
    icon: Thermometer,
    description: "The pit starts extremely hot (800°F+) and slowly cools over days. The initial blast converts starches to sugars; the slow cool develops flavor complexity.",
    impact: "Temperature management is where master mezcaleros show their skill. Too hot = burnt. Too cool = undercooked, harsh.",
  },
];

export const smokeProfiles = [
  {
    level: "Whisper",
    intensity: 1,
    description: "Barely there. The smoke is a suggestion, a ghost in the background. You taste agave first, smoke last.",
    examples: "Some Tobalás, certain clay-pot distilled expressions, high-ABV spirits where alcohol dominates",
    color: "h-8 w-4 rounded bg-gray-600",
  },
  {
    level: "Subtle",
    intensity: 2,
    description: "Present but polite. The smoke introduces itself, then steps aside to let other flavors speak.",
    examples: "Many Espadíns from Tlacolula, some wild agave expressions, copper-pot distilled mezcals",
    color: "h-8 w-4 rounded bg-amber-800",
  },
  {
    level: "Balanced",
    intensity: 3,
    description: "The sweet spot for many drinkers. Smoke and agave in conversation, neither dominating.",
    examples: "Classic Espadíns from Santiago Matatlán, most commercial artisanal mezcals",
    color: "h-8 w-4 rounded bg-amber-600",
  },
  {
    level: "Forward",
    intensity: 4,
    description: "Smoke leads the dance. It's the first thing you taste and the last thing you remember.",
    examples: "Traditional producers in Santa Catarina Minas, some ancestral expressions",
    color: "h-8 w-4 rounded bg-orange-600",
  },
  {
    level: "Intense",
    intensity: 5,
    description: "A bonfire in a glass. For smoke lovers only. The agave is there, but smoke is the star.",
    examples: "Certain ancestral mezcals, mesquite-roasted expressions, some pechugas",
    color: "h-8 w-4 rounded bg-red-600",
  },
];

export function ScienceOfSmoke() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-linear-to-b from-orange-950/40 to-earth" />
        <div className="relative z-10 container">
          <Link
            href={ss("/")}
            className="mb-8 inline-flex cursor-pointer items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>

          <h1 className="mb-4 font-serif text-3xl text-amber-400 sm:text-4xl md:text-5xl lg:text-6xl">
            The Science of Smoke
          </h1>
          <p className="max-w-2xl px-4 text-base text-white/90 sm:text-lg md:text-xl">
            Smoke is mezcal&apos;s signature. But it&apos;s not an accident—it&apos;s the result of deliberate choices
            about wood, pit design, and roasting time. Understanding smoke is understanding mezcal.
          </p>
        </div>
      </section>

      {/* The Process Overview */}
      <section className="border-b border-white/10 py-12 md:py-16">
        <div className="container px-4">
          <h2 className="mb-6 font-serif text-2xl text-amber-400 md:mb-8 md:text-3xl">Where Smoke Comes From</h2>
          <div className="prose max-w-none prose-invert">
            <p className="mb-6 text-base leading-relaxed text-white/90 md:text-lg">
              Unlike tequila, which steam-cooks its agave in industrial autoclaves, mezcal roasts its piñas in
              underground pits lined with volcanic rock. Wood is burned to heat the stones, then the agave is layered
              on top and buried for days. The smoke from the wood permeates the cooking agave, infusing it with
              character that carries through fermentation and distillation.
            </p>
            <p className="text-base leading-relaxed text-white/90 md:text-lg">
              This isn&apos;t just tradition—it&apos;s chemistry. The Maillard reaction and caramelization that occur
              during roasting create hundreds of flavor compounds. The smoke adds phenols, guaiacols, and other
              aromatic molecules. The result is a spirit with depth that steam-cooking simply cannot achieve.
            </p>
          </div>
        </div>
      </section>

      {/* Wood Types */}
      <section className="border-b border-white/10 py-12 md:py-16">
        <div className="container px-4">
          <div className="mb-8 flex items-center gap-3">
            <TreePine aria-hidden="true" className="size-8 shrink-0 text-amber-400" />
            <h2 className="font-serif text-3xl text-amber-400">Wood Types &amp; Their Character</h2>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-white/90 md:mb-8 md:text-base">
            The wood a mezcalero chooses shapes the smoke profile of the final spirit. Most use what grows locally,
            creating regional signatures.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {woodTypes.map((wood) => (
              <div key={wood.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-serif text-xl text-white">{wood.name}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-amber-400">Smoke Profile:</span>
                    <span className="ml-2 text-gray-200">{wood.smokeProfile}</span>
                  </div>
                  <div>
                    <span className="text-amber-400">Burn Temp:</span>
                    <span className="ml-2 text-gray-200">{wood.burnTemp}</span>
                  </div>
                  <div>
                    <span className="text-amber-400">Regions:</span>
                    <span className="ml-2 text-gray-200">{wood.regions}</span>
                  </div>
                  <p className="border-t border-white/10 pt-2 text-gray-200">{wood.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pit Factors */}
      <section className="border-b border-white/10 py-16">
        <div className="container">
          <div className="mb-8 flex items-center gap-3">
            <Flame aria-hidden="true" className="size-8 shrink-0 text-amber-400" />
            <h2 className="font-serif text-3xl text-amber-400">The Pit: Where Alchemy Happens</h2>
          </div>
          <p className="mb-8 max-w-2xl text-gray-200">
            The earthen pit (horno) is where raw agave becomes something magical. Every aspect of its construction and
            operation affects the final flavor.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {pitFactors.map((item) => (
              <div key={item.factor} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-amber-900/30 p-2">
                    <item.icon aria-hidden="true" className="size-6 text-amber-400" />
                  </div>
                  <h3 className="font-serif text-xl text-white">{item.factor}</h3>
                </div>
                <p className="mb-4 text-gray-200">{item.description}</p>
                <div className="rounded-lg bg-amber-950/30 p-3">
                  <span className="text-sm font-medium text-amber-400">Impact: </span>
                  <span className="text-sm text-gray-200">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smoke Intensity Scale */}
      <section className="border-b border-white/10 py-16">
        <div className="container">
          <h2 className="mb-8 font-serif text-3xl text-amber-400">The Smoke Intensity Scale</h2>
          <p className="mb-8 max-w-2xl text-gray-200">
            Not all mezcals are smoke bombs. The spectrum ranges from barely-there to bonfire. Here&apos;s how to
            understand what you&apos;re tasting.
          </p>

          <div className="space-y-4">
            {smokeProfiles.map((profile) => (
              <div key={profile.level} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-6">
                  <div className="shrink-0">
                    <div className="mb-2 flex gap-1" role="img" aria-label={`${profile.intensity} of 5`}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={i <= profile.intensity ? profile.color : "h-8 w-4 rounded bg-gray-800"} />
                      ))}
                    </div>
                    <span className="font-medium text-white">{profile.level}</span>
                  </div>
                  <div className="flex-1">
                    <p className="mb-3 text-gray-200">{profile.description}</p>
                    <div className="text-sm">
                      <span className="text-amber-400">Examples: </span>
                      <span className="text-gray-200">{profile.examples}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Variables */}
      <section className="border-b border-white/10 py-16">
        <div className="container">
          <h2 className="mb-8 font-serif text-3xl text-amber-400">Other Variables That Affect Smoke</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Droplets aria-hidden="true" className="mb-4 size-8 text-amber-400" />
              <h3 className="mb-3 font-serif text-xl text-white">Distillation Method</h3>
              <p className="text-sm text-gray-200">
                Clay pot distillation tends to preserve more smoke character than copper. The porous clay absorbs and
                releases compounds differently, often resulting in earthier, smokier spirits.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Thermometer aria-hidden="true" className="mb-4 size-8 text-amber-400" />
              <h3 className="mb-3 font-serif text-xl text-white">Cut Points</h3>
              <p className="text-sm text-gray-200">
                Where the mezcalero makes the cuts during distillation affects smoke perception. Heads carry more
                volatile compounds; tails carry heavier ones. The heart is where balance lives.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Mountain aria-hidden="true" className="mb-4 size-8 text-amber-400" />
              <h3 className="mb-3 font-serif text-xl text-white">Agave Species</h3>
              <p className="text-sm text-gray-200">
                Different agaves interact with smoke differently. Espadín tends to carry smoke well; Tobalá often shows
                it more subtly. Wild agaves can have such intense flavors that smoke becomes secondary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-3xl text-amber-400">The Art Behind the Science</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-200">
            Understanding the science of smoke doesn&apos;t diminish the magic—it deepens it. Every bottle represents
            thousands of decisions: which wood to burn, how deep to dig, how long to roast, when to seal the pit, when
            to open it.
          </p>
          <p className="text-gray-200">
            The mezcalero isn&apos;t following a recipe. They&apos;re reading the fire, feeling the heat, listening to
            the agave. Science gives us the vocabulary to describe what they do. But what they do is art.
          </p>
        </div>
      </section>
    </div>
  );
}
