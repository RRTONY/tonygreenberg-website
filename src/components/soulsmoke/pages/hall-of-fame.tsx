"use client";

import Link from "next/link";
import { ArrowRight, Award, Clock, ExternalLink, Heart, Leaf, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/HallOfFame.tsx (2026-11-10). Same sections,
// copy (EN/ES) and classes; wouter links -> next/link (button classes moved onto the Link).

interface HeroEntry {
  name: string;
  location: string;
  category: "tequila" | "mezcal";
  virtue: string;
  virtueEs: string;
  story: string;
  storyEs: string;
  highlights: string[];
  highlightsEs: string[];
  rating: number; // 1-5 hearts
  priceRange: string;
  whyTheyMatter: string;
  whyTheyMatterEs: string;
  bottlesToTry: string;
}

const heroes: HeroEntry[] = [
  {
    name: "Real Minero",
    location: "Santa Catarina Minas, Oaxaca",
    category: "mezcal",
    virtue: "The Purists",
    virtueEs: "Los Puristas",
    story: "Four generations of the Ángeles family, making mezcal the way their great-great-grandparents did. No shortcuts. No compromises. Clay pot distillation that most producers abandoned decades ago.",
    storyEs: "Cuatro generaciones de la familia Ángeles, haciendo mezcal como lo hacían sus tatarabuelos. Sin atajos. Sin compromisos. Destilación en ollas de barro que la mayoría de los productores abandonaron hace décadas.",
    highlights: [
      "Clay pot distillation — the most ancient and labor-intensive method",
      "Single-village production, never expanded for profit",
      "Graciela Ángeles: one of mezcal's most respected maestras",
      "Every bottle tastes like the earth it came from"
    ],
    highlightsEs: [
      "Destilación en ollas de barro — el método más antiguo e intensivo",
      "Producción de un solo pueblo, nunca expandida por ganancias",
      "Graciela Ángeles: una de las maestras más respetadas del mezcal",
      "Cada botella sabe a la tierra de donde vino"
    ],
    rating: 5,
    priceRange: "$80-300",
    whyTheyMatter: "When everyone else modernized, they refused. The result is mezcal that tastes like history.",
    whyTheyMatterEs: "Cuando todos los demás se modernizaron, ellos se negaron. El resultado es mezcal que sabe a historia.",
    bottlesToTry: "Largo, Minero, Pechuga"
  },
  {
    name: "Fortaleza",
    location: "Tequila, Jalisco",
    category: "tequila",
    virtue: "The Guardians",
    virtueEs: "Los Guardianes",
    story: "Fifth-generation tequila makers. Guillermo Sauza's family helped create the tequila industry, then watched it get destroyed by corporations. He rebuilt it the old way.",
    storyEs: "Tequileros de quinta generación. La familia de Guillermo Sauza ayudó a crear la industria del tequila, luego la vio destruida por corporaciones. Él la reconstruyó a la antigua.",
    highlights: [
      "Stone tahona wheel — hand-crushed agave, not industrial shredders",
      "Copper pot stills, not column stills",
      "Additive-free certification before it was cool",
      "Family-owned, never sold out"
    ],
    highlightsEs: [
      "Rueda de tahona de piedra — agave triturado a mano, no trituradoras industriales",
      "Alambiques de cobre, no columnas",
      "Certificación sin aditivos antes de que fuera popular",
      "Propiedad familiar, nunca vendida"
    ],
    rating: 5,
    priceRange: "$45-150",
    whyTheyMatter: "Proof that you can make world-class tequila without selling your soul to Diageo.",
    whyTheyMatterEs: "Prueba de que puedes hacer tequila de clase mundial sin vender tu alma a Diageo.",
    bottlesToTry: "Blanco, Reposado, Still Strength"
  },
  {
    name: "El Tesoro",
    location: "Arandas, Jalisco (Highlands)",
    category: "tequila",
    virtue: "The Craftsmen",
    virtueEs: "Los Artesanos",
    story: "Carlos Camarena's family has been making tequila since 1937. Three generations of refusing to cut corners. The highlands terroir sings in every sip.",
    storyEs: "La familia de Carlos Camarena ha estado haciendo tequila desde 1937. Tres generaciones negándose a tomar atajos. El terroir de los altos canta en cada sorbo.",
    highlights: [
      "Highland agave — sweeter, more floral, higher altitude",
      "Tahona-crushed, brick oven roasted",
      "No additives, no diffusers, no shortcuts",
      "Master distiller Carlos Camarena: a living legend"
    ],
    highlightsEs: [
      "Agave de los altos — más dulce, más floral, mayor altitud",
      "Triturado con tahona, asado en horno de ladrillo",
      "Sin aditivos, sin difusores, sin atajos",
      "Maestro destilador Carlos Camarena: una leyenda viviente"
    ],
    rating: 5,
    priceRange: "$50-200",
    whyTheyMatter: "When you taste El Tesoro, you taste what tequila is supposed to be.",
    whyTheyMatterEs: "Cuando pruebas El Tesoro, pruebas lo que el tequila debería ser.",
    bottlesToTry: "Blanco, Añejo, Paradiso"
  },
  {
    name: "Fane Kantsini",
    location: "Miahuatlán, Oaxaca",
    category: "mezcal",
    virtue: "The Mystics",
    virtueEs: "Los Místicos",
    story: "Sosima and her family make mezcal like a meditation. Small batches, wild agaves, and a philosophy that the spirit chooses when it's ready to be shared.",
    storyEs: "Sosima y su familia hacen mezcal como una meditación. Lotes pequeños, agaves silvestres, y una filosofía de que el espíritu elige cuándo está listo para ser compartido.",
    highlights: [
      "Wild and semi-wild agave varieties most have never heard of",
      "Women-led production in a male-dominated industry",
      "Bottles arrive when they're ready, not when demanded",
      "Esoteric, bohemian, completely uninterested in trends"
    ],
    highlightsEs: [
      "Variedades de agave silvestre y semi-silvestre que la mayoría nunca ha escuchado",
      "Producción liderada por mujeres en una industria dominada por hombres",
      "Las botellas llegan cuando están listas, no cuando se demandan",
      "Esotérico, bohemio, completamente desinteresado en tendencias"
    ],
    rating: 5,
    priceRange: "$100-400",
    whyTheyMatter: "Not a brand. A way of life. The antithesis of everything celebrity mezcal represents.",
    whyTheyMatterEs: "No es una marca. Es un estilo de vida. La antítesis de todo lo que representa el mezcal de celebridades.",
    bottlesToTry: "Whatever Sosima decides to share"
  },
  {
    name: "Tapatio",
    location: "Arandas, Jalisco",
    category: "tequila",
    virtue: "The Originals",
    virtueEs: "Los Originales",
    story: "The Camarena family (same as El Tesoro) also produces Tapatio — exceptional tequila at prices that make you question why anyone pays $170 for Clase Azul.",
    storyEs: "La familia Camarena (la misma de El Tesoro) también produce Tapatio — tequila excepcional a precios que te hacen cuestionar por qué alguien paga $170 por Clase Azul.",
    highlights: [
      "Same quality as El Tesoro, different label",
      "Blanco under $30 that embarrasses $100 bottles",
      "Excelencia line rivals any ultra-premium",
      "Proof that great tequila doesn't need celebrity endorsement"
    ],
    highlightsEs: [
      "Misma calidad que El Tesoro, diferente etiqueta",
      "Blanco por menos de $30 que avergüenza botellas de $100",
      "Línea Excelencia rivaliza con cualquier ultra-premium",
      "Prueba de que el gran tequila no necesita respaldo de celebridades"
    ],
    rating: 5,
    priceRange: "$25-100",
    whyTheyMatter: "The best value in tequila. Period.",
    whyTheyMatterEs: "El mejor valor en tequila. Punto.",
    bottlesToTry: "Blanco 110, Excelencia"
  },
  {
    name: "Del Maguey",
    location: "Various villages, Oaxaca",
    category: "mezcal",
    virtue: "The Ambassadors",
    virtueEs: "Los Embajadores",
    story: "Ron Cooper (yes, that Ron Cooper) spent decades documenting village mezcal traditions before anyone cared. Single-village bottlings that preserve dying traditions.",
    storyEs: "Ron Cooper pasó décadas documentando las tradiciones del mezcal de pueblo antes de que a nadie le importara. Embotellados de un solo pueblo que preservan tradiciones moribundas.",
    highlights: [
      "Single-village expressions — each tastes completely different",
      "Fair trade relationships with palenqueros",
      "Helped legitimize mezcal as a serious spirit category",
      "Vida: the gateway drug to real mezcal"
    ],
    highlightsEs: [
      "Expresiones de un solo pueblo — cada una sabe completamente diferente",
      "Relaciones de comercio justo con palenqueros",
      "Ayudó a legitimar el mezcal como una categoría seria de destilados",
      "Vida: la droga de entrada al mezcal real"
    ],
    rating: 4,
    priceRange: "$35-300",
    whyTheyMatter: "Before Del Maguey, most Americans thought mezcal was 'tequila with a worm.'",
    whyTheyMatterEs: "Antes de Del Maguey, la mayoría de los estadounidenses pensaban que el mezcal era 'tequila con un gusano.'",
    bottlesToTry: "Chichicapa, San Luis del Rio, Pechuga"
  }
];

function HeroRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Heart
          key={i}
          aria-hidden="true"
          className={i < rating ? "size-5 text-rose-500" : "size-5 text-stone-600"}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

const CATEGORY_BADGE: Record<HeroEntry["category"], string> = {
  mezcal: "rounded bg-amber-500/20 px-2 py-1 font-mono text-xs text-amber-400",
  tequila: "rounded bg-blue-500/20 px-2 py-1 font-mono text-xs text-blue-400",
};

export function HallOfFame() {
  const { language } = useLanguage();
  const es = language === "es";

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/30 to-stone-950" />

        {/* Smoke effects */}
        <div className="smoke-layer pointer-events-none absolute inset-0" />
        <div className="smoke-wisps pointer-events-none absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2">
            <Award aria-hidden="true" className="size-5 text-emerald-500" />
            <span className="font-mono text-sm tracking-wider text-emerald-400">
              {es ? "LOS QUE LO HACEN BIEN" : "THE ONES DOING IT RIGHT"}
            </span>
          </div>

          <h1 className="mb-6 font-display text-5xl text-white md:text-7xl lg:text-8xl">
            {es ? "Salón de la" : "Hall of"}
            <br />
            <span className="text-emerald-500">{es ? "Fama" : "Fame"}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-stone-300 md:text-2xl">
            {es
              ? "Los productores que eligieron la integridad sobre las ganancias. Tradición sobre tendencias. Alma sobre escala."
              : "The producers who chose integrity over profit. Tradition over trends. Soul over scale."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <Heart aria-hidden="true" className="size-4 text-emerald-400" />
              <span>{es ? "Propiedad Familiar" : "Family-Owned"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf aria-hidden="true" className="size-4 text-emerald-400" />
              <span>{es ? "Sin Aditivos" : "Additive-Free"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock aria-hidden="true" className="size-4 text-emerald-400" />
              <span>{es ? "Métodos Tradicionales" : "Traditional Methods"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users aria-hidden="true" className="size-4 text-emerald-400" />
              <span>{es ? "Comercio Justo" : "Fair Trade"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="bg-stone-900 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-display text-3xl text-white md:text-5xl">
              {es ? "Por Qué Esto" : "Why This"}
              <br />
              <span className="text-emerald-500">{es ? "Importa" : "Matters"}</span>
            </h2>

            <div className="rounded-2xl border border-emerald-500/20 bg-linear-to-br from-stone-800 to-stone-900 p-8 md:p-12">
              <p className="mb-8 text-xl leading-relaxed text-stone-200 md:text-2xl">
                {es
                  ? "Cada vez que compras una botella, votas. Votas por el tipo de industria que quieres que exista. Votas por las familias que quieres apoyar. Votas por las tradiciones que quieres preservar."
                  : "Every time you buy a bottle, you vote. You vote for the kind of industry you want to exist. You vote for the families you want to support. You vote for the traditions you want to preserve."}
              </p>

              <div className="mb-8 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/10 p-6">
                <p className="mb-4 font-display text-2xl text-white md:text-3xl">
                  {es
                    ? "\"El dinero que gastas es un voto por el mundo que quieres.\""
                    : "\"The money you spend is a vote for the world you want.\""}
                </p>
                <p className="text-stone-300">
                  {es ? "Elige sabiamente. Bebe con intención." : "Choose wisely. Drink with intention."}
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-stone-950 p-6">
                  <h3 className="mb-3 font-display text-xl text-red-400">
                    {es ? "Lo Que Estás Financiando" : "What You're Funding"}
                  </h3>
                  <p className="text-stone-300">
                    {es
                      ? "Cuando compras de celebridades: marketing, abogados, alcohol industrial, accionistas."
                      : "When you buy celebrity: marketing, lawyers, industrial alcohol, shareholders."}
                  </p>
                </div>
                <div className="rounded-lg bg-stone-950 p-6">
                  <h3 className="mb-3 font-display text-xl text-emerald-400">
                    {es ? "Lo Que Podrías Financiar" : "What You Could Fund"}
                  </h3>
                  <p className="text-stone-300">
                    {es
                      ? "Cuando compras de estos productores: familias, tradiciones, comunidades, artesanía."
                      : "When you buy from these producers: families, traditions, communities, craft."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Heroes */}
      <section className="bg-stone-950 py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 text-center font-display text-4xl text-white md:text-5xl">
            {es ? "Los Héroes" : "The Heroes"}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-stone-300">
            {es
              ? "Productores que eligieron el camino difícil. Familias que se negaron a vender. Tradiciones que sobrevivieron."
              : "Producers who chose the hard path. Families who refused to sell out. Traditions that survived."}
          </p>

          <div className="mx-auto grid max-w-5xl gap-8">
            {heroes.map((hero) => (
              <div
                key={hero.name}
                className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900 transition-colors hover:border-emerald-500/50"
              >
                <div className="p-8">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-display text-3xl text-white">{hero.name}</h3>
                        <span className={CATEGORY_BADGE[hero.category]}>{hero.category}</span>
                      </div>
                      <p className="flex items-center gap-2 text-sm text-stone-400">
                        <Sparkles aria-hidden="true" className="size-4 text-emerald-400" />
                        {hero.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <HeroRating rating={hero.rating} />
                      <p className="mt-1 text-sm text-stone-400">{hero.priceRange}</p>
                    </div>
                  </div>

                  <div className="mb-6 inline-block rounded-lg bg-emerald-500/10 px-4 py-2">
                    <span className="font-bold text-emerald-400">{es ? hero.virtueEs : hero.virtue}</span>
                  </div>

                  <p className="mb-6 text-lg leading-relaxed text-stone-200">{es ? hero.storyEs : hero.story}</p>

                  <div className="mb-6">
                    <h4 className="mb-3 font-mono text-sm text-emerald-400">
                      {es ? "LO QUE LOS HACE ESPECIALES:" : "WHAT MAKES THEM SPECIAL:"}
                    </h4>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {(es ? hero.highlightsEs : hero.highlights).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-stone-300">
                          <span aria-hidden="true" className="mt-1 text-emerald-500">
                            ✦
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4 border-t border-stone-800 pt-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-1 font-mono text-sm text-emerald-400">
                        {es ? "POR QUÉ IMPORTAN:" : "WHY THEY MATTER:"}
                      </h4>
                      <p className="text-sm text-stone-200 italic">{es ? hero.whyTheyMatterEs : hero.whyTheyMatter}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-mono text-sm text-stone-400">
                        {es ? "BOTELLAS PARA PROBAR:" : "BOTTLES TO TRY:"}
                      </h4>
                      <p className="text-sm text-white">{hero.bottlesToTry}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-linear-to-b from-stone-900 to-stone-950 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 font-display text-3xl text-white md:text-5xl">
            {es ? "Encuentra Lo Bueno" : "Find the Good Stuff"}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-stone-300">
            {es
              ? "¿Listo para probar destilados de personas que realmente se preocupan? Explora nuestras listas curadas."
              : "Ready to try spirits from people who actually give a damn? Explore our curated lists."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ss("/us-hunt")}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 font-medium text-white transition-colors hover:bg-emerald-500"
            >
              {es ? "La Búsqueda en EE.UU." : "The US Hunt"}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href={ss("/mexico-source")}
              className="inline-flex items-center gap-2 rounded-lg bg-sage px-8 py-4 font-medium text-stone-900 transition-colors hover:bg-sage/90"
            >
              {es ? "La Fuente México" : "The Mexico Source"}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href={ss("/assholes")}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-medium text-white transition-colors hover:bg-red-500"
            >
              {es ? "El Muro de la Vergüenza" : "The Wall of Shame"}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fane Kantsini Feature */}
      <section className="border-t border-stone-800 bg-stone-900 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm text-stone-500">{es ? "DESTACADO" : "FEATURED"}</p>
            <h2 className="mb-4 font-display text-2xl text-white md:text-4xl">
              {es ? "Conoce a Fane Kantsini" : "Meet Fane Kantsini"}
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-stone-300">
              {es
                ? "La historia de cómo un maestro sommelier me llevó a una familia mezcalera que cambió todo lo que pensaba que sabía sobre los destilados."
                : "The story of how a master sommelier led me to a mezcal family that changed everything I thought I knew about spirits."}
            </p>
            <Link
              href={ss("/fane-kantsini")}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 px-6 py-3 font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10"
            >
              {es ? "Leer la Historia" : "Read the Story"}
              <ExternalLink aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
