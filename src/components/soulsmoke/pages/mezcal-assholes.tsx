"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Beaker,
  DollarSign,
  Skull,
  Sparkles,
  Star,
  ThumbsDown,
  Users,
} from "lucide-react";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/MezcalAssholes.tsx. Same sections, copy
// (EN/ES) and styling. Changes: wouter links -> next/link (the wrapped <button>s' classes moved
// onto the Link), the typed "→" in the source links -> lucide ArrowRight (rule 18).

interface AssholeEntry {
  name: string;
  celebrity?: string;
  category: "tequila" | "mezcal";
  crime: string;
  evidence: string[];
  rating: number; // 1-5 assholes
  price: string;
  whatYouGet: string;
  alternative: string;
}

const assholes: AssholeEntry[] = [
  {
    name: "Casamigos",
    celebrity: "George Clooney (sold for $1B)",
    category: "tequila",
    crime: "Industrial Alcohol Filler",
    evidence: [
      "2025 lawsuit: Blanco contains only 33% agave-derived ethanol (Mezcalistas)",
      "Reposado allegedly only 42% agave-derived — rest is industrial alcohol",
      "Carbon isotope testing proves non-agave alcohol content (court filing)",
      "Beau du Bois (VP Puesto restaurants): 'Removed Casamigos from the menu'",
      "Sold to Diageo for $1 billion — then quality allegedly tanked",
      "Tequila Matchmaker: 'At least 70% of tequilas contain undisclosed additives'",
    ],
    rating: 5,
    price: "$45-55",
    whatYouGet: "Celebrity marketing, 67% mystery alcohol, a lawsuit",
    alternative: "Fortaleza, G4, Pasote - real 100% agave, no additives",
  },
  {
    name: "Clase Azul",
    celebrity: "None (just expensive bottles)",
    category: "tequila",
    crime: "Additive-Laden Luxury Theater",
    evidence: [
      "Confirmed additives: vanilla, glycerin, artificial sweeteners, caramel coloring",
      "Beau du Bois (VP Puesto): 'Removed Clase Azul from the menu'",
      "PUNCH Magazine: 'Tastes like sticky birthday cake' after additive demo",
      "Tequila Hombre YouTube: Additive test confirms glycerin and sweeteners",
      "$170+ for what costs pennies to adulterate — the bottle is the product",
      "Reddit consensus: 'Garbage. For the college and Wall Street crowd.'",
    ],
    rating: 5,
    price: "$170+",
    whatYouGet: "A decorative bottle, a sugar bomb, Instagram clout",
    alternative: "El Tesoro, Tapatio, Siete Leguas - tradition, not theater",
  },
  {
    name: "Dos Hombres",
    celebrity: "Bryan Cranston & Aaron Paul",
    category: "mezcal",
    crime: "Celebrity Cash Grab",
    evidence: [
      "MezcalReviews.com: 2.5/5 rating — among the lowest rated mezcals",
      "User review: 'Literally the worst alcoholic beverage I have ever tasted'",
      "User review: 'Tastes like hand sanitizer'",
      "User review: 'Hard to find a worse drink for half the price'",
      "User review: 'Watered down, burnt rubber, flat'",
      "Sin Gusano: 'Celebrities flying in to make a lifestyle brand... water it down'",
      "Sold minority stake to Constellation Brands — the corporate machine",
    ],
    rating: 4,
    price: "$40-50",
    whatYouGet: "Breaking Bad nostalgia, hand sanitizer notes, regret",
    alternative: "Del Maguey Vida, Banhez, El Jolgorio - actual craft",
  },
  {
    name: "818 Tequila",
    celebrity: "Kendall Jenner",
    category: "tequila",
    crime: "Influencer Exploitation",
    evidence: [
      "Red flagged by tequila community",
      "Sustainability claims questioned",
      "Instagram followers ≠ distilling knowledge",
      "Accused of cultural appropriation in marketing",
      "Mass-market product with premium pricing",
    ],
    rating: 4,
    price: "$40-60",
    whatYouGet: "Instagram clout, mediocre tequila",
    alternative: "Olmeca Altos, Cimarron, Arette - honest value",
  },
  {
    name: "Cincoro",
    celebrity: "Michael Jordan & NBA owners",
    category: "tequila",
    crime: "Billionaire Vanity Project",
    evidence: [
      "Extra Añejo priced at $1,600+",
      "Basketball greatness ≠ tequila greatness",
      "Overpriced relative to quality",
      "More about status than substance",
      "The 'I have money so I made tequila' approach",
    ],
    rating: 3,
    price: "$70-1,600",
    whatYouGet: "Jordan branding, inflated price tag",
    alternative: "Ocho, Terralta, Cascahuin - quality at fair prices",
  },
  {
    name: "Jose Cuervo Especial",
    celebrity: "None (just industrial)",
    category: "tequila",
    crime: "The Original Sin",
    evidence: [
      "Mixto tequila - only 51% agave required",
      "Diffuser production method",
      "Responsible for tequila's bad reputation",
      "The hangover factory",
      "What people think tequila tastes like (it shouldn't)",
    ],
    rating: 5,
    price: "$15-25",
    whatYouGet: "A headache and regret",
    alternative: "Literally any 100% agave tequila",
  },
  {
    name: "Don Julio",
    celebrity: "None (Diageo owned)",
    category: "tequila",
    crime: "Corporate Dilution",
    evidence: [
      "2025 lawsuit: Blanco allegedly only 42% agave-derived alcohol",
      "2025 lawsuit: 1942 Añejo allegedly only 33% agave-derived",
      "Carbon isotope testing proves non-agave alcohol (court filing)",
      "Beau du Bois (VP Puesto): 'Don Julio will get the ax next'",
      "Once respected, now a Diageo cash cow with questionable integrity",
      "Premium price ($150+ for 1942), corporate production, lawsuit pending",
    ],
    rating: 4,
    price: "$50-150",
    whatYouGet: "A brand that used to mean something, now means lawsuits",
    alternative: "Fortaleza, El Tesoro, Tequila Ocho - still family-owned",
  },
  {
    name: "Sauza",
    celebrity: "None (industrial)",
    category: "tequila",
    crime: "Artificial Everything",
    evidence: [
      "Known for artificial sweetness",
      "Harsh alcohol profile",
      "Both mixto and 100% agave lines criticized",
      "Diffuser production",
      "Quantity over quality business model",
    ],
    rating: 4,
    price: "$15-40",
    whatYouGet: "Chemical aftertaste and disappointment",
    alternative: "Espolòn, Olmeca Altos - better at same price",
  },
];

function AssholeRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} of 5`}>
      {[...Array(5)].map((_, i) => (
        <Skull
          key={i}
          aria-hidden="true"
          className={i < rating ? "size-5 text-red-500" : "size-5 text-stone-200"}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export function MezcalAssholes() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-red-950/30 to-stone-950" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2">
            <AlertTriangle aria-hidden="true" className="size-5 text-red-500" />
            <span className="font-mono text-sm tracking-wider text-red-400">
              {language === "es" ? "CUIDADO COMPRADOR" : "BUYER BEWARE"}
            </span>
          </div>

          <h1 className="mb-6 font-display text-5xl text-white md:text-7xl lg:text-8xl">
            {language === "es" ? "Los" : "Mezcal"}
            <br />
            <span className="text-red-500">{language === "es" ? "Cabrones" : "Assholes"}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-stone-300 md:text-2xl">
            {language === "es"
              ? "Las marcas donde la celebridad, el marketing y las ganancias importan más que lo que realmente hay en la botella. Nombres nombrados. Recibos proporcionados."
              : "The brands where celebrity, marketing, and profit matter more than what's actually in the bottle. Names named. Receipts provided."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <DollarSign aria-hidden="true" className="size-4 text-red-400" />
              <span>{language === "es" ? "Sobrepreciado" : "Overpriced"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Beaker aria-hidden="true" className="size-4 text-red-400" />
              <span>{language === "es" ? "Aditivos" : "Additives"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users aria-hidden="true" className="size-4 text-red-400" />
              <span>{language === "es" ? "Celebridades Codiciosas" : "Celebrity Cash Grabs"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown aria-hidden="true" className="size-4 text-red-400" />
              <span>{language === "es" ? "Marketing Sobre Calidad" : "Marketing Over Quality"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Brand Stupidity Section */}
      <section className="bg-stone-900 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-display text-3xl text-white md:text-5xl">
              {language === "es" ? "La Estupidez de" : "The Stupidity of"}
              <br />
              <span className="text-red-500">
                {language === "es" ? "Destruir Tu Propia Marca" : "Destroying Your Own Brand"}
              </span>
            </h2>

            <div className="rounded-2xl border border-red-500/20 bg-linear-to-br from-stone-800 to-stone-900 p-8 md:p-12">
              <p className="mb-8 text-xl leading-relaxed text-stone-200 md:text-2xl">
                Imagine you own a <strong className="text-white">three-Michelin-star restaurant</strong>. You&apos;ve
                spent decades building a reputation for excellence. Chefs dream of working in your kitchen. Food
                critics write love letters about your tasting menu.
              </p>

              <p className="mb-8 text-xl leading-relaxed text-stone-200 md:text-2xl">
                Then one day, you decide to license your name to a{" "}
                <strong className="text-red-400">frozen food company</strong>. Your signature dishes—now
                microwaveable. Your legacy—now in the freezer aisle next to Hot Pockets.
              </p>

              <div className="mb-8 rounded-xl border-l-4 border-red-500 bg-red-500/10 p-6">
                <p className="mb-4 font-display text-2xl text-white md:text-3xl">
                  &quot;Is money more important than your brand?
                  <br />
                  Is money more important than truth?&quot;
                </p>
                <p className="text-stone-300">
                  These are questions every celebrity tequila owner should ask themselves at 3am.
                </p>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-stone-300">
                When you sell a billion-dollar brand to a conglomerate, you&apos;re not just cashing out—you&apos;re
                handing over your reputation. When that conglomerate allegedly fills your &quot;premium&quot; tequila
                with industrial alcohol, <strong className="text-red-400">your name is on the bottle</strong>.
              </p>

              <p className="mb-6 text-lg leading-relaxed text-stone-300">
                When you charge $170 for a pretty ceramic bottle filled with sweeteners and glycerin, you&apos;re not
                building a luxury brand—you&apos;re running a <strong className="text-red-400">confidence game</strong>{" "}
                on people who trust you.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-stone-950 p-6">
                  <h4 className="mb-3 font-display text-xl text-red-400">The Short Game</h4>
                  <p className="text-stone-300">
                    Cash out. Cut corners. Hope nobody notices. Pray the lawsuits settle quietly.
                  </p>
                </div>
                <div className="rounded-lg bg-stone-950 p-6">
                  <h4 className="mb-3 font-display text-xl text-sage">The Long Game</h4>
                  <p className="text-stone-300">
                    Build something real. Protect your name. Let quality speak. Leave a legacy worth having.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-stone-400">Some chose the short game. Here&apos;s who they are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Dirty Truth Section */}
      <section className="bg-stone-900 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center font-display text-3xl text-white md:text-4xl">
              The Dirty Truth About &quot;100% Agave&quot;
            </h2>

            <div className="rounded-xl border border-red-500/20 bg-stone-800 p-8">
              <p className="mb-6 text-lg text-stone-200">
                Here&apos;s what they don&apos;t want you to know:{" "}
                <strong className="text-red-400">even &quot;100% agave&quot; tequila can legally contain additives</strong>.
                Up to 1% of the total volume can be:
              </p>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-stone-900 p-4">
                  <h4 className="mb-2 font-bold text-red-400">Sweeteners</h4>
                  <p className="text-sm text-stone-300">
                    Sugar syrups, agave nectar, artificial sweeteners to mask harsh flavors
                  </p>
                </div>
                <div className="rounded-lg bg-stone-900 p-4">
                  <h4 className="mb-2 font-bold text-red-400">Glycerin</h4>
                  <p className="text-sm text-stone-300">Adds artificial &quot;legs&quot; and mouthfeel to cheap product</p>
                </div>
                <div className="rounded-lg bg-stone-900 p-4">
                  <h4 className="mb-2 font-bold text-red-400">Caramel Coloring</h4>
                  <p className="text-sm text-stone-300">Makes young tequila look aged and premium</p>
                </div>
                <div className="rounded-lg bg-stone-900 p-4">
                  <h4 className="mb-2 font-bold text-red-400">Oak Extract</h4>
                  <p className="text-sm text-stone-300">Fake barrel aging flavor without the time investment</p>
                </div>
              </div>

              <p className="text-sm text-stone-300 italic">
                The CRT (Consejo Regulador del Tequila) allows all of this. The &quot;additive-free&quot; label some
                brands use? It&apos;s voluntary and unregulated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Diffuser Problem */}
      <section className="bg-stone-950 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center font-display text-3xl text-white md:text-4xl">The Diffuser Shortcut</h2>

            <div className="rounded-xl bg-linear-to-br from-stone-900 to-stone-800 p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-red-400">
                    <ThumbsDown aria-hidden="true" className="size-5" />
                    Diffuser Method (Industrial)
                  </h3>
                  <ul className="space-y-2 text-sm text-stone-300">
                    <li>• Raw, uncooked agave shredded</li>
                    <li>• Chemicals extract sugars</li>
                    <li>• No caramelization, no complexity</li>
                    <li>• 24 hours vs 3+ days traditional</li>
                    <li>• Requires additives to taste acceptable</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-sage">
                    <Sparkles aria-hidden="true" className="size-5" />
                    Traditional Method (Craft)
                  </h3>
                  <ul className="space-y-2 text-sm text-stone-300">
                    <li>• Agave slow-roasted in ovens</li>
                    <li>• Natural caramelization of sugars</li>
                    <li>• Complex flavors develop naturally</li>
                    <li>• Takes days, not hours</li>
                    <li>• No additives needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Wall of Shame */}
      <section className="bg-stone-900 py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 text-center font-display text-4xl text-white md:text-5xl">
            {language === "es" ? "El Muro de la Vergüenza" : "The Wall of Shame"}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-stone-300">
            {language === "es"
              ? "Estas marcas priorizan las ganancias sobre la autenticidad. Nombres nombrados. Evidencia proporcionada. Mejores alternativas sugeridas."
              : "These brands prioritize profit over authenticity. Names named. Evidence provided. Better alternatives suggested."}
          </p>

          <div className="mx-auto grid max-w-4xl gap-6">
            {assholes.map((brand) => (
              <div
                key={brand.name}
                className="overflow-hidden rounded-xl border border-stone-700 bg-stone-800 transition-colors hover:border-red-500/50"
              >
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-display text-2xl text-white">{brand.name}</h3>
                        <span
                          className={
                            brand.category === "mezcal"
                              ? "rounded bg-amber-500/20 px-2 py-1 font-mono text-xs text-amber-400"
                              : "rounded bg-blue-500/20 px-2 py-1 font-mono text-xs text-blue-400"
                          }
                        >
                          {brand.category}
                        </span>
                      </div>
                      {brand.celebrity && (
                        <p className="flex items-center gap-2 text-sm text-stone-400">
                          <Star aria-hidden="true" className="size-4" />
                          {brand.celebrity}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <AssholeRating rating={brand.rating} />
                      <p className="mt-1 text-sm text-stone-400">{brand.price}</p>
                    </div>
                  </div>

                  <div className="mb-4 inline-block rounded-lg bg-red-500/10 px-4 py-2">
                    <span className="font-bold text-red-400">{brand.crime}</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 font-mono text-sm text-stone-300">
                      {language === "es" ? "LA EVIDENCIA:" : "THE EVIDENCE:"}
                    </h4>
                    <ul className="space-y-1">
                      {brand.evidence.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-200">
                          <span className="mt-1 text-red-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4 border-t border-stone-700 pt-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-1 font-mono text-sm text-red-400">
                        {language === "es" ? "LO QUE OBTIENES:" : "WHAT YOU GET:"}
                      </h4>
                      <p className="text-sm text-stone-300">{brand.whatYouGet}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-mono text-sm text-sage">
                        {language === "es" ? "BEBE ESTO EN SU LUGAR:" : "DRINK THIS INSTEAD:"}
                      </h4>
                      <p className="text-sm text-stone-200">{brand.alternative}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Voices */}
      <section className="bg-stone-950 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 text-center font-display text-3xl text-white md:text-5xl">
            {language === "es" ? "Los Expertos Han Hablado" : "The Experts Have Spoken"}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-stone-400">
            {language === "es"
              ? "No nos creas. Esto es lo que dicen las personas que realmente conocen el tequila y el mezcal."
              : "Don't take our word for it. Here's what the people who actually know tequila and mezcal are saying."}
          </p>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {/* Grover Sanschagrin */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
              <blockquote className="mb-4 text-lg text-stone-200 italic">
                &quot;At least 70 percent of all tequilas sold contain additives. These producers are essentially
                making a neutral product, stripping away all the natural agave flavor. That is why they have to add
                flavor back in after the fact.&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/20">
                  <span className="font-bold text-terracotta">GS</span>
                </div>
                <div>
                  <p className="font-medium text-white">Grover Sanschagrin</p>
                  <p className="text-sm text-stone-400">Founder, Tequila Matchmaker</p>
                </div>
              </div>
              <a
                href="https://punchdrink.com/articles/additive-free-tequila-brands-agave-spirits/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-terracotta hover:underline"
              >
                Source: PUNCH Magazine
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>

            {/* Sin Gusano */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
              <blockquote className="mb-4 text-lg text-stone-200 italic">
                &quot;We have celebrities and conglomerates flying in to make a &apos;lifestyle brand&apos;. They find a
                producer, ask them to increase production and of course the forces of capitalism dictate that they
                water it down.&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-sage/20">
                  <span className="font-bold text-sage">SG</span>
                </div>
                <div>
                  <p className="font-medium text-white">Sin Gusano</p>
                  <p className="text-sm text-stone-400">Mezcal Appreciation Society</p>
                </div>
              </div>
              <a
                href="https://singusano.com/blogs/the-sin-gusano-project-blog/capitalism-celebrity-and-the-death-of-mezcal"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-sage hover:underline"
              >
                Source: Sin Gusano Blog
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>

            {/* Beau du Bois */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
              <blockquote className="mb-4 text-lg text-stone-200 italic">
                &quot;I&apos;ve removed Clase Azul and Casamigos from the menu. Don Julio will get the ax next. Do you
                know if your favorite tequila is artificially flavored or not?&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/20">
                  <span className="font-bold text-amber-400">BD</span>
                </div>
                <div>
                  <p className="font-medium text-white">Beau du Bois</p>
                  <p className="text-sm text-stone-400">VP of Bar &amp; Spirits, Puesto Restaurants</p>
                </div>
              </div>
              <a
                href="https://punchdrink.com/articles/additive-free-tequila-brands-agave-spirits/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-amber-400 hover:underline"
              >
                Source: PUNCH Magazine
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>

            {/* Mezcalistas */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-6">
              <blockquote className="mb-4 text-lg text-stone-200 italic">
                &quot;Carbon isotope ratio analysis proves that Casamigos and Don Julio products contain substantial
                quantities of alcohol that is not actually tequila.&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-red-500/20">
                  <span className="font-bold text-red-400">ML</span>
                </div>
                <div>
                  <p className="font-medium text-white">Mezcalistas</p>
                  <p className="text-sm text-stone-400">Reporting on 2025 Class Action Lawsuit</p>
                </div>
              </div>
              <a
                href="https://www.mezcalistas.com/casamigos-lawsuit/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-red-400 hover:underline"
              >
                Source: Mezcalistas
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="mx-auto max-w-2xl text-sm text-stone-500">
              &quot;Mezcal isn&apos;t a lifestyle brand, it&apos;s a way of life that we should all pay more attention to
              protecting.&quot;
              <span className="mt-2 block text-stone-400">— Sin Gusano</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Antidote */}
      <section className="bg-linear-to-b from-stone-900 to-stone-950 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 font-display text-3xl text-white md:text-5xl">
            {language === "es" ? "El Antídoto" : "The Antidote"}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-stone-300">
            {language === "es"
              ? "¿Quieres beber destilados hechos por personas que realmente se preocupan? Explora nuestras listas curadas de productores auténticos."
              : "Want to drink spirits made by people who give a damn? Explore our curated lists of authentic producers."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ss("/us-hunt")}
              className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-8 py-4 font-medium text-white transition-colors hover:bg-terracotta/90"
            >
              The US Hunt
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href={ss("/mexico-source")}
              className="inline-flex items-center gap-2 rounded-lg bg-sage px-8 py-4 font-medium text-stone-900 transition-colors hover:bg-sage/90"
            >
              The Mexico Source
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-stone-800 bg-stone-950 py-8">
        <div className="container mx-auto px-6">
          <p className="mx-auto max-w-3xl text-center text-sm text-stone-600">
            <strong>{language === "es" ? "Descargo de responsabilidad:" : "Disclaimer:"}</strong>{" "}
            {language === "es"
              ? "Esta página presenta información públicamente disponible, documentos judiciales y consenso de la comunidad. Algunas acusaciones provienen de demandas en curso y no han sido probadas en los tribunales. Animamos a los lectores a investigar por su cuenta y tomar decisiones informadas. Nuestro objetivo es la educación, no la difamación."
              : "This page presents publicly available information, court filings, and community consensus. Some allegations are from ongoing lawsuits and have not been proven in court. We encourage readers to do their own research and make informed decisions. Our goal is education, not defamation."}
          </p>
        </div>
      </section>
    </div>
  );
}
