import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  DollarSign,
  Leaf,
  Lightbulb,
  Plane,
  Wine,
} from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/PilgrimageGuide.tsx (2026-11-10). Same copy
// (the app had English only on this page) and classes. Changes: the tip and mezcal-note emoji
// are lucide icons (CONTRIBUTING rule 18), and "Chichilorev" under Places to Avoid is plain text:
// the app linked it to a site on the old app host, which this site never links to.

const itinerary = [
  {
    day: 1,
    title: 'Arrival & Orientation',
    activities: [
      { time: 'Afternoon', activity: 'Arrive at Oaxaca International Airport (OAX)', tip: 'Book direct from Mexico City, Houston, or Dallas' },
      { time: 'Evening', activity: 'Check into hotel in Centro Histórico', tip: 'Or head directly to Casa Silencio for full immersion' },
      { time: 'Night', activity: 'Dinner at Hierba Dulce for plant-forward welcome', tip: 'Start with something light - the real feasting begins tomorrow' },
    ],
  },
  {
    day: 2,
    title: 'Mezcal Education Day',
    activities: [
      { time: 'Morning', activity: 'Visit Mezcalogía for educational tasting', tip: 'Silvia will rewire your understanding of agave' },
      { time: 'Afternoon', activity: 'Lunch at Zandunga for Isthmus cuisine', tip: 'The garnachas and tamales de cambray are transcendent' },
      { time: 'Evening', activity: 'In Situ with Ulises Torrentera', tip: 'Ask about wild agaves - he\'s the walking encyclopedia' },
    ],
  },
  {
    day: 3,
    title: 'Casa Silencio Immersion',
    activities: [
      { time: 'Morning', activity: 'Transfer to Casa Silencio (45 min from city)', tip: 'The valley reveals itself slowly - don\'t rush' },
      { time: 'Midday', activity: 'Private distillery tour and production deep-dive', tip: 'Watch the tahona in action, smell the fermentation' },
      { time: 'Afternoon', activity: 'Rare mezcal tasting with master mezcalero', tip: 'Expressions unavailable anywhere else on earth' },
      { time: 'Evening', activity: 'Farm-to-table dinner under the stars', tip: 'All-inclusive - let them guide the pairings' },
    ],
  },
  {
    day: 4,
    title: 'Santa Catarina Minas',
    activities: [
      { time: 'Morning', activity: 'Drive to Santa Catarina Minas', tip: 'Home of Real Minero and Lalocura' },
      { time: 'Midday', activity: 'Palenque visits (by appointment only)', tip: 'Arrange weeks in advance - these are working families' },
      { time: 'Afternoon', activity: 'Explore the village, meet local families', tip: 'Bring small gifts - chocolate, coffee, fruit' },
      { time: 'Evening', activity: 'Dinner at Pitiona for contemporary Oaxacan', tip: 'Chef José Manuel Baños does things with hoja santa you won\'t forget' },
    ],
  },
  {
    day: 5,
    title: 'Culture & Contemplation',
    activities: [
      { time: 'Morning', activity: 'Visit Monte Albán at sunrise', tip: 'Go before the buses arrive - the silence is part of it' },
      { time: 'Afternoon', activity: 'Lunch at Origen for tasting menu', tip: 'Rodolfo Castellanos is a poet with ingredients' },
      { time: 'Evening', activity: 'Final bottles at La Mezcalerita or Expendio Tradición', tip: 'Buy what you can\'t get at home' },
    ],
  },
  {
    day: 6,
    title: 'Departure',
    activities: [
      { time: 'Morning', activity: 'Breakfast at Boulenc for pastries and coffee', tip: 'The croissants rival Paris, the setting is pure Oaxaca' },
      { time: 'Midday', activity: 'Depart Oaxaca', tip: 'Pack bottles in checked luggage, wrapped in dirty clothes' },
    ],
  },
];

const hotels = [
  {
    name: 'Casa Silencio',
    category: 'The Ultimate',
    price: '$1,000+/night',
    description: 'A design-forward distillery and luxury retreat in the valley near Mitla. Six suites, all-inclusive, adults only. This is the mezcal pilgrimage distilled into architecture.',
    location: '45 min from Oaxaca City',
    mezcalNote: 'Private tastings of expressions that exist nowhere else. You sleep where the magic is made.',
    featured: true,
    includes: ['All meals', 'Distillery tours', 'Rare tastings', 'Transportation'],
    website: 'casasilencio.com',
  },
  {
    name: 'Casa Oaxaca',
    category: 'Luxury Centro',
    price: '$400-600/night',
    description: 'Boutique perfection in the historic center. Rooftop bar, exceptional service, and a mezcal collection curated by people who understand.',
    location: 'Centro Histórico',
    mezcalNote: 'Walking distance to everything. The rooftop at sunset is mandatory.',
    featured: false,
  },
  {
    name: 'Hotel Escondido',
    category: 'Boutique',
    price: '$200-350/night',
    description: 'Hidden courtyard, authentic atmosphere, no pretense. For those who want to feel like they live here.',
    location: 'Near Santo Domingo',
    mezcalNote: 'Steps from In Situ and Mezcalogía',
    featured: false,
  },
];

const restaurants = [
  {
    name: 'Hierba Dulce',
    category: 'Vegan Fine Dining',
    vibe: 'Plant alchemy in a colonial courtyard',
    mustTry: 'The tasting menu - each course is a meditation',
    price: '$$',
    why: 'Proof that Oaxacan cuisine doesn\'t need meat to be profound. The mole negro made with mushrooms will haunt you.',
  },
  {
    name: 'Pitiona',
    category: 'Contemporary Oaxacan',
    vibe: 'Rooftop elegance with mountain views',
    mustTry: 'Anything with hoja santa or chicatanas (ant season)',
    price: '$$$',
    why: 'Chef José Manuel Baños treats local ingredients like sacred objects. This is not fusion - it\'s evolution.',
  },
  {
    name: 'Origen',
    category: 'Tasting Menu',
    vibe: 'Intimate, ingredient-obsessed',
    mustTry: 'The full tasting menu with mezcal pairings',
    price: '$$$',
    why: 'Rodolfo Castellanos forages, ferments, and transforms. Each plate tells a story of place.',
  },
  {
    name: 'Zandunga',
    category: 'Isthmus Cuisine',
    vibe: 'Matriarchal cooking from Tehuantepec',
    mustTry: 'Garnachas, tamales de cambray, totopos',
    price: '$',
    why: 'The women of the Isthmus cook differently. This is the real Oaxaca that tourists miss.',
  },
  {
    name: 'Los Muchitos',
    category: 'Vegan Street Food',
    vibe: 'Casual, affordable, zero compromise',
    mustTry: 'Vegan tacos and tlayudas',
    price: '$',
    why: 'Proof that plant-based Mexican food can be cheap, fast, and absolutely delicious.',
  },
  {
    name: 'Boulenc',
    category: 'Bakery & Breakfast',
    vibe: 'French technique, Oaxacan soul',
    mustTry: 'Croissants, pan de yema, single-origin coffee',
    price: '$',
    why: 'The best pastries in Mexico. Fight me.',
  },
  {
    name: 'Criollo',
    category: 'Farm-to-Table',
    vibe: 'Seasonal, local, no menu - trust the chef',
    mustTry: 'Whatever they\'re serving that day',
    price: '$$',
    why: 'Enrique Olvera\'s influence without the pretense. Ingredients from the morning market.',
  },
  {
    name: 'Expendio Tradición',
    category: 'Mezcaleria with Food',
    vibe: 'Serious mezcal, serious snacks',
    mustTry: 'Tasajo, quesillo, whatever pairs with what you\'re drinking',
    price: '$$',
    why: 'The mezcal selection is impeccable. The food exists to keep you vertical.',
  },
];

const essentialTips = [
  {
    category: 'Before You Go',
    tips: [
      'Learn basic Spanish - it opens doors that money can\'t',
      'Arrange palenque visits 2-4 weeks ahead',
      'Bring cash (pesos) for small producers',
      'Pack light - you\'ll fill your luggage with bottles',
    ],
  },
  {
    category: 'At Palenques',
    tips: [
      'Never refuse a taste offered by the mezcalero',
      'Ask permission before taking photos',
      'Bring small gifts (chocolate, coffee, fruit)',
      'Listen more than you talk',
      'Buy directly when possible - it helps families',
    ],
  },
  {
    category: 'Tasting Etiquette',
    tips: [
      'Sip, don\'t shoot - this isn\'t tequila',
      'Rub a drop between your palms, smell it',
      'Kiss the mezcal (touch to lips, breathe in)',
      'Pace yourself - these are 45-55% ABV',
      'Eat between tastings',
    ],
  },
  {
    category: 'Bringing Bottles Home',
    tips: [
      'US allows 1 liter duty-free per person',
      'Pack in checked luggage, wrapped in clothes',
      'Keep receipts for customs',
      'Consider shipping for large quantities',
    ],
  },
];

export function PilgrimageGuide() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 text-white">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-black py-12">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href={ss("/")}
            className="mb-6 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="mb-4 font-serif text-4xl text-amber-400 md:text-5xl">The Pilgrimage Guide</h1>
          <p className="max-w-2xl text-xl text-gray-300">
            Your complete guide to visiting Oaxaca as a mezcal devotee. Where to stay, what to eat, and how to connect
            with the people who make the magic.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Quick Facts */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <Plane aria-hidden="true" className="mx-auto mb-2 size-6 text-amber-400" />
            <p className="text-sm text-gray-300">Best Time</p>
            <p className="font-medium text-white">Oct-Apr</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <Calendar aria-hidden="true" className="mx-auto mb-2 size-6 text-amber-400" />
            <p className="text-sm text-gray-300">Ideal Duration</p>
            <p className="font-medium text-white">5-7 Days</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <DollarSign aria-hidden="true" className="mx-auto mb-2 size-6 text-amber-400" />
            <p className="text-sm text-gray-300">Daily Budget</p>
            <p className="font-medium text-white">$150-1000+</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <Clock aria-hidden="true" className="mx-auto mb-2 size-6 text-amber-400" />
            <p className="text-sm text-gray-300">Flight Time</p>
            <p className="font-medium text-white">4-6 hrs</p>
          </div>
        </div>

        {/* Featured: Casa Silencio */}
        <section className="mb-16">
          <div className="overflow-hidden rounded-2xl border border-amber-600/50 bg-linear-to-br from-amber-950/50 to-amber-900/20">
            <div className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <Crown aria-hidden="true" className="size-6 text-amber-400" />
                <span className="text-sm font-medium tracking-wider text-amber-400 uppercase">
                  The Ultimate Experience
                </span>
              </div>
              <h2 className="mb-4 font-serif text-3xl text-white">Casa Silencio</h2>
              <p className="mb-6 max-w-2xl text-lg text-gray-200">
                A design-forward distillery and luxury retreat in the valley near Mitla. Six suites, all-inclusive,
                adults only. This is the mezcal pilgrimage distilled into architecture. You don&apos;t just visit -
                you inhabit the process.
              </p>

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-amber-400">What&apos;s Included</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• All meals (farm-to-table, locally sourced)</li>
                    <li>• Private distillery tours with master mezcalero</li>
                    <li>• Tastings of rare, exclusive expressions</li>
                    <li>• Transportation from Oaxaca City</li>
                    <li>• Sunset mezcal rituals</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-amber-400">The Experience</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Watch the tahona crush agave at dawn</li>
                    <li>• Smell fermentation in the open air</li>
                    <li>• Taste mezcals that exist nowhere else</li>
                    <li>• Sleep surrounded by agave fields</li>
                    <li>• Leave transformed</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="font-serif text-2xl text-amber-400">$1,000+/night</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">45 min from Oaxaca City</span>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.casasilencio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  casasilencio.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Day-by-Day Itinerary */}
        <section className="mb-16">
          <h2 className="mb-6 font-serif text-3xl text-amber-400">6-Day Itinerary</h2>
          <div className="space-y-6">
            {itinerary.map((day) => (
              <div key={day.day} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="border-b border-amber-900/50 bg-amber-900/30 px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-600 text-sm font-bold">
                      {day.day}
                    </span>
                    <h3 className="font-serif text-xl text-white">{day.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((item) => (
                      <div key={item.activity} className="flex gap-4">
                        <div className="w-24 shrink-0">
                          <span className="font-mono text-sm text-amber-400">{item.time}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{item.activity}</p>
                          <p className="mt-1 text-sm text-gray-400">
                            <Lightbulb aria-hidden="true" className="mr-1 inline size-[1em] align-[-0.125em] text-amber-400" />
                            {item.tip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Where to Stay */}
        <section className="mb-16">
          <h2 className="mb-6 font-serif text-3xl text-amber-400">Where to Stay</h2>
          <div className="space-y-4">
            {hotels
              .filter((h) => !h.featured)
              .map((hotel) => (
                <div key={hotel.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{hotel.name}</h3>
                      <p className="text-sm text-gray-400">{hotel.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-400">{hotel.price}</span>
                      <p className="text-xs text-gray-400">{hotel.category}</p>
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">{hotel.description}</p>
                  <p className="text-xs text-amber-400/70">
                    <Wine aria-hidden="true" className="mr-1 inline size-[1em] align-[-0.125em]" />
                    {hotel.mezcalNote}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* Where to Eat */}
        <section className="mb-16">
          <h2 className="mb-2 font-serif text-3xl text-amber-400">Where to Eat</h2>
          <p className="mb-6 text-gray-400">No tourist traps. No TripAdvisor top 10. These are the places that matter.</p>

          <div className="grid gap-4 md:grid-cols-2">
            {restaurants.map((restaurant) => (
              <div key={restaurant.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-medium text-white">
                      {restaurant.name}
                      {restaurant.category.includes("Vegan") && (
                        <Leaf aria-hidden="true" className="size-4 text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-sm text-amber-400/70">{restaurant.category}</p>
                  </div>
                  <span className="text-sm text-gray-400">{restaurant.price}</span>
                </div>
                <p className="mb-2 text-sm text-gray-400 italic">{restaurant.vibe}</p>
                <p className="mb-2 text-sm text-gray-300">{restaurant.why}</p>
                <p className="text-xs text-amber-400">Must try: {restaurant.mustTry}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Essential Tips */}
        <section className="mb-16">
          <h2 className="mb-6 font-serif text-3xl text-amber-400">Essential Tips</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {essentialTips.map((section) => (
              <div key={section.category} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-medium text-white">
                  <CheckCircle aria-hidden="true" className="size-5 text-emerald-400" />
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-gray-300">
                      <span aria-hidden="true" className="text-amber-400">
                        •
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Warning */}
        <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle aria-hidden="true" className="size-6 shrink-0 text-red-400" />
            <div>
              <h3 className="mb-2 font-medium text-red-400">Important Warnings</h3>
              <ul className="space-y-1 text-sm text-red-300/80">
                <li>• Never show up at a palenque unannounced - always arrange visits in advance</li>
                <li>• Don&apos;t haggle aggressively - these are family livelihoods, not tourist markets</li>
                <li>• Altitude in Oaxaca (1,550m) intensifies alcohol effects - pace yourself</li>
                <li>• Avoid driving after tastings - hire a driver or use taxis</li>
                <li>• Some roads to remote villages are unpaved - plan accordingly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Places to Avoid */}
        <div className="mb-12 rounded-2xl border-2 border-red-600/50 bg-red-950/50 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle aria-hidden="true" className="size-6 shrink-0 text-red-500" />
            <div>
              <h3 className="mb-2 font-medium text-red-500">Places to Avoid</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-red-400">Chichilorev</p>
                  <p className="mt-1 text-sm text-red-300/70">
                    The worst experience we had in Oaxaca. Save yourself the disappointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-amber-900/30 bg-linear-to-br from-amber-950/30 to-transparent p-8 text-center">
          <h2 className="mb-2 font-serif text-2xl text-amber-400">Ready to Plan Your Trip?</h2>
          <p className="mb-6 text-gray-300">Explore our interactive map to see palenque locations and mezcalerias.</p>
          <Link
            href={ss("/oaxaca-map")}
            className="inline-block rounded-lg bg-amber-600 px-6 py-3 transition-colors hover:bg-amber-500"
          >
            View Oaxaca Map
          </Link>
        </div>
      </div>
    </div>
  );
}
