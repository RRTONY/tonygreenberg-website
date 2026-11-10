import Link from "next/link";
import { AlertTriangle, ArrowLeft, Clock, Dna, Leaf, Mountain, Sparkles } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/AgaveGenetics.tsx (2026-11-10). Same copy and
// layout; no state, so it stays a Server Component.

const agaveSpecies = [
  {
    name: "Espadín",
    scientificName: "Agave angustifolia",
    maturity: "6-8 years",
    cultivation: "Cultivated",
    flavor: "Sweet, herbal, clean smoke",
    abundance: "Most common (90%+ of production)",
    story: "The workhorse of mezcal. Domesticated for centuries, Espadín is reliable, relatively fast-growing, and produces consistent yields. Some dismiss it as 'basic,' but in the hands of a master mezcalero, Espadín can be transcendent.",
  },
  {
    name: "Tobalá",
    scientificName: "Agave potatorum",
    maturity: "12-15 years",
    cultivation: "Wild / Semi-wild",
    flavor: "Floral, tropical fruit, delicate smoke",
    abundance: "Rare",
    story: "The 'king of mezcals.' Tobalá grows wild in the shade of oak forests at high altitudes. Its small piñas yield precious little liquid, making every bottle a treasure. The flavor is ethereal—flowers, tropical fruit, a whisper of smoke.",
  },
  {
    name: "Tepeztate",
    scientificName: "Agave marmorata",
    maturity: "25-35 years",
    cultivation: "Wild",
    flavor: "Vegetal, green pepper, intense minerality",
    abundance: "Very rare",
    story: "A quarter-century to maturity. Tepeztate grows on rocky cliffsides, its roots gripping stone. The flavor is unlike anything else—green, vegetal, almost savory. Some bottles taste like the earth itself.",
  },
  {
    name: "Madrecuixe",
    scientificName: "Agave karwinskii",
    maturity: "12-15 years",
    cultivation: "Wild / Semi-cultivated",
    flavor: "Citrus, herbs, black pepper",
    abundance: "Uncommon",
    story: "Part of the Karwinskii family, Madrecuixe produces mezcals with bright, citrusy notes and a distinctive peppery finish. It's become a favorite among collectors seeking complexity.",
  },
  {
    name: "Arroqueño",
    scientificName: "Agave americana var. oaxacensis",
    maturity: "15-25 years",
    cultivation: "Wild / Semi-wild",
    flavor: "Chocolate, coffee, earthy sweetness",
    abundance: "Rare",
    story: "Massive piñas that can weigh 400+ pounds. Arroqueño produces rich, chocolatey mezcals with deep earthy notes. The long maturation develops complex sugars that translate to remarkable depth.",
  },
  {
    name: "Cuishe",
    scientificName: "Agave karwinskii",
    maturity: "10-12 years",
    cultivation: "Wild / Semi-cultivated",
    flavor: "Mint, eucalyptus, bright citrus",
    abundance: "Uncommon",
    story: "Another Karwinskii variety, Cuishe is known for its distinctive minty, almost mentholated quality. It's often blended with other agaves to add brightness and complexity.",
  },
  {
    name: "Jabalí",
    scientificName: "Agave convallis",
    maturity: "12-15 years",
    cultivation: "Wild",
    flavor: "Funky, cheese-like, tropical",
    abundance: "Very rare",
    story: "The wild boar of agaves. Jabalí is notoriously difficult to ferment—it produces so much foam that it can overflow the tanks. The resulting mezcal is polarizing: funky, cheesy, unlike anything else.",
  },
  {
    name: "Coyote",
    scientificName: "Agave americana",
    maturity: "10-15 years",
    cultivation: "Wild",
    flavor: "Tropical fruit, honey, balanced smoke",
    abundance: "Rare",
    story: "Named for its wild, untamed nature. Coyote produces mezcals with beautiful tropical fruit notes balanced by honey sweetness. It's becoming increasingly sought-after.",
  },
];

const terroirFactors = [
  {
    factor: "Altitude",
    icon: Mountain,
    description: "Agaves grown at higher altitudes (2000m+) develop more slowly, concentrating sugars and developing more complex flavor compounds. Highland mezcals often show more minerality and brightness.",
  },
  {
    factor: "Soil Composition",
    icon: Leaf,
    description: "Volcanic soil, limestone, clay—each imparts different minerals to the agave. Some producers can taste the difference between agaves grown on opposite sides of the same hill.",
  },
  {
    factor: "Microclimate",
    icon: Sparkles,
    description: "Sun exposure, rainfall, temperature swings—all affect how the agave develops. Agaves that experience stress (drought, cold nights) often develop more intense flavors.",
  },
  {
    factor: "Age at Harvest",
    icon: Clock,
    description: "Harvesting too early yields thin, vegetal mezcal. Too late, and the agave may have flowered, losing its sugars. The mezcalero must read the plant to know when it's ready.",
  },
];

export function AgaveGenetics() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-green-950/40 to-earth" />
        <div className="container relative z-10">
          <Link
            href={ss("/")}
            className="mb-8 inline-flex cursor-pointer items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          
          <h1 className="font-serif text-5xl md:text-6xl text-amber-400 mb-4">
            Agave Genetics
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Over 200 species of agave exist. Fewer than 50 are used for mezcal. Each one is a universe 
            of flavor waiting to be explored.
          </p>
        </div>
      </section>

      {/* Wild vs Cultivated */}
      <section className="py-16 border-b border-white/10">
        <div className="container">
          <h2 className="font-serif text-3xl text-amber-400 mb-8">The Wild vs. Cultivated Debate</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-950/40 border border-green-900/50 rounded-xl p-6">
              <h3 className="font-serif text-2xl text-green-400 mb-4">Wild Agave</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Grows naturally in forests, hillsides, and rocky terrain</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Develops unique flavors from its specific microenvironment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Often takes 15-35 years to mature</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Limited supply, higher prices, sustainability concerns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Each batch is unique—true terroir expression</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-6">
              <h3 className="font-serif text-2xl text-amber-400 mb-4">Cultivated Agave</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Planted and tended by farmers in organized fields</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>More consistent flavor profiles batch to batch</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Typically 6-12 years to maturity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Sustainable, scalable, more affordable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Can still express terroir if grown thoughtfully</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 bg-white/5 border border-white/20 rounded-xl p-6">
            <p className="text-white/90 text-lg leading-relaxed">
              <span className="text-amber-400 font-medium">The truth:</span> Neither is inherently better. 
              A well-made Espadín from a skilled mezcalero can be more interesting than a poorly-made wild 
              agave mezcal. What matters is the care taken at every step—from cultivation or foraging, 
              through roasting, fermentation, and distillation.
            </p>
          </div>
        </div>
      </section>

      {/* Species Guide */}
      <section className="py-16 border-b border-white/10">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Dna aria-hidden="true" className="size-8 text-amber-400" />
            <h2 className="font-serif text-3xl text-amber-400">Species Guide</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {agaveSpecies.map((agave) => (
              <div key={agave.name} className="bg-white/5 border border-white/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-white">{agave.name}</h3>
                    <p className="text-gray-300 italic text-sm">{agave.scientificName}</p>
                  </div>
                  <span
                    className={
                      agave.cultivation === "Wild"
                        ? "rounded-full border border-green-700/50 bg-green-900/30 px-3 py-1 text-xs text-green-400"
                        : agave.cultivation === "Cultivated"
                          ? "rounded-full border border-amber-700/50 bg-amber-900/30 px-3 py-1 text-xs text-amber-400"
                          : "rounded-full border border-blue-700/50 bg-blue-900/30 px-3 py-1 text-xs text-blue-400"
                    }
                  >
                    {agave.cultivation}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-white/80">Maturity</span>
                    <div className="text-white/90">{agave.maturity}</div>
                  </div>
                  <div>
                    <span className="text-white/80">Abundance</span>
                    <div className="text-white/90">{agave.abundance}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-white/80 text-sm">Flavor Profile</span>
                  <div className="text-amber-400">{agave.flavor}</div>
                </div>
                
                <p className="text-white/90 text-sm border-t border-white/10 pt-4">
                  {agave.story}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terroir */}
      <section className="py-16 border-b border-white/10">
        <div className="container">
          <h2 className="font-serif text-3xl text-amber-400 mb-4">Terroir: Why Location Matters</h2>
          <p className="text-white/90 mb-8 max-w-2xl">
            The same agave species grown in different regions will taste different. This is terroir—the 
            complete natural environment in which the plant grows.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {terroirFactors.map((item) => (
              <div key={item.factor} className="bg-white/5 border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-900/30 rounded-lg">
                    <item.icon aria-hidden="true" className="size-6 text-amber-400" />
                  </div>
                  <h3 className="font-serif text-xl text-white">{item.factor}</h3>
                </div>
                <p className="text-white/90">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation */}
      <section className="py-16 border-b border-white/10">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle aria-hidden="true" className="size-8 text-red-400" />
            <h2 className="font-serif text-3xl text-amber-400">The Conservation Crisis</h2>
          </div>
          
          <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-6 mb-8">
            <p className="text-white/90 text-lg leading-relaxed mb-4">
              The mezcal boom has a dark side. Wild agave populations are being depleted faster than they 
              can regenerate. Some species that take 25+ years to mature are being harvested at unsustainable 
              rates to meet global demand.
            </p>
            <p className="text-white/90 text-lg leading-relaxed">
              Responsible producers are responding with cultivation programs, seed banks, and sustainable 
              harvesting practices. As consumers, we can support these efforts by choosing producers who 
              prioritize conservation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/20 rounded-xl p-6">
              <h3 className="font-serif text-lg text-white mb-3">What Producers Are Doing</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li>• Planting 10 agaves for every 1 harvested</li>
                <li>• Creating nurseries for rare species</li>
                <li>• Allowing agaves to flower and seed before harvest</li>
                <li>• Documenting genetic diversity</li>
              </ul>
            </div>
            
            <div className="bg-white/5 border border-white/20 rounded-xl p-6">
              <h3 className="font-serif text-lg text-white mb-3">What You Can Do</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li>• Ask about sustainability practices</li>
                <li>• Support producers with conservation programs</li>
                <li>• Don&apos;t demand only wild agave mezcals</li>
                <li>• Appreciate cultivated agave expressions</li>
              </ul>
            </div>
            
            <div className="bg-white/5 border border-white/20 rounded-xl p-6">
              <h3 className="font-serif text-lg text-white mb-3">Brands Leading the Way</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li>• Real Minero (extensive cultivation)</li>
                <li>• 5 Sentidos (community-based model)</li>
                <li>• Mezcal Vago (transparency initiatives)</li>
                <li>• NETA (wild agave documentation)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-amber-400 mb-6">Every Bottle Tells a Story</h2>
          <p className="text-white/90 text-lg leading-relaxed mb-6">
            When you drink a Tepeztate, you&apos;re tasting 30 years of sun, rain, and rocky soil. When you 
            sip a Tobalá, you&apos;re experiencing the shade of an oak forest. The genetics of the agave are 
            just the beginning—the rest is written by time and place.
          </p>
          <p className="text-white/90">
            Understanding agave genetics isn&apos;t about becoming a snob. It&apos;s about deepening your appreciation 
            for what&apos;s in your glass—and making choices that ensure these plants will still exist for 
            future generations to enjoy.
          </p>
        </div>
      </section>
    </div>
  );
}
