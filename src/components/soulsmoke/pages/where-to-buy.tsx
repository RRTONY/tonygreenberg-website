import Link from "next/link";
import { AlertTriangle, ArrowLeft, ExternalLink, MapPin, Shield, Star, Truck } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/WhereToBy.tsx (/where-to-buy), 2026-11-10.
// Same retailers and copy. No state, so it stays a Server Component. The original's
// `border-opacity-30` does nothing in Tailwind v4, so cards keep the full tier border (as live).

interface Retailer {
  name: string;
  url: string;
  location: string;
  tier: 'elite' | 'excellent' | 'solid' | 'avoid';
  shipping: string;
  specialty: string;
  description: string;
  whyTrust: string;
  notableBottles: string[];
  caveats?: string;
}

const retailers: Retailer[] = [
  // ELITE TIER
  {
    name: 'Old Town Tequila',
    url: 'https://www.oldtowntequila.com',
    location: 'San Diego, CA',
    tier: 'elite',
    shipping: 'Ships to most US states',
    specialty: 'Deepest artisanal mezcal selection in the US',
    description: 'The gold standard. If it exists and it\'s good, they probably have it. Their buyers actually understand mezcal - not just moving bottles.',
    whyTrust: 'Curated by people who taste everything. They reject mass-market garbage. Relationships with importers like PM Spirits and Craft Distillers.',
    notableBottles: ['NETA', '5 Sentidos', 'Real Minero', 'Lalocura', 'Mezcalosfera'],
  },
  {
    name: 'K&L Wine Merchants',
    url: 'https://www.klwines.com',
    location: 'San Francisco & Los Angeles, CA',
    tier: 'elite',
    shipping: 'Ships to most US states',
    specialty: 'Rare allocations and exclusive imports',
    description: 'Wine-focused but their spirits team is exceptional. They get allocations others don\'t. David Driscoll\'s buying is impeccable.',
    whyTrust: 'Transparent about what they carry and why. Blog posts explain the stories. They\'ll tell you when something isn\'t worth it.',
    notableBottles: ['Fane Kantsini', 'El Jolgorio', 'Vago', 'Real Minero', 'Mezcal Vago Elote'],
  },
  {
    name: 'Astor Wines',
    url: 'https://www.astorwines.com',
    location: 'New York, NY',
    tier: 'elite',
    shipping: 'Ships to most US states',
    specialty: 'East Coast\'s best mezcal selection',
    description: 'NYC institution with serious agave knowledge. Their staff actually drinks this stuff. Excellent rare bottle access.',
    whyTrust: 'Decades of reputation. Buyers travel to Oaxaca. They won\'t stock celebrity garbage.',
    notableBottles: ['Del Maguey', 'Mezcal Vago', 'Real Minero', 'Bozal', 'Nuestra Soledad'],
  },
  
  // EXCELLENT TIER
  {
    name: 'Pogo\'s Wine & Spirits',
    url: 'https://www.pogoswine.com',
    location: 'Dallas, TX',
    tier: 'excellent',
    shipping: 'Texas only (in-store pickup available)',
    specialty: 'Texas\'s best agave selection',
    description: 'If you\'re in Texas, this is your spot. Deep selection, knowledgeable staff, fair prices.',
    whyTrust: 'Family-owned, reputation-focused. They\'ve built relationships with the right importers.',
    notableBottles: ['Fane Kantsini', 'El Jolgorio', 'Mezcal Vago', 'Real Minero'],
    caveats: 'Texas shipping only - but worth a trip if you\'re nearby',
  },
  {
    name: 'Hi-Time Wine Cellars',
    url: 'https://www.hitimewine.net',
    location: 'Costa Mesa, CA',
    tier: 'excellent',
    shipping: 'Ships to most US states',
    specialty: 'Competitive pricing on allocated bottles',
    description: 'Massive selection with surprisingly good prices. Less curated than Old Town but more inventory.',
    whyTrust: 'Volume buyer with good relationships. Prices are often below market.',
    notableBottles: ['Del Maguey', 'Ilegal', 'Montelobos', 'Bozal', 'El Silencio'],
    caveats: 'Bigger selection means some mass-market mixed in - know what you\'re looking for',
  },
  {
    name: 'Cask',
    url: 'https://www.caskstore.com',
    location: 'San Francisco, CA',
    tier: 'excellent',
    shipping: 'Ships to most US states',
    specialty: 'Craft spirits focus with excellent mezcal',
    description: 'Small but perfectly curated. Everything they carry is worth drinking.',
    whyTrust: 'Craft-focused philosophy. They taste everything. No filler.',
    notableBottles: ['Mezcal Vago', 'Del Maguey', 'Nuestra Soledad', 'Banhez'],
  },
  {
    name: 'Mezcal Reviews Shop',
    url: 'https://shop.mezcalreviews.com',
    location: 'Online',
    tier: 'excellent',
    shipping: 'Ships to most US states',
    specialty: 'Community-vetted selections',
    description: 'From the people who run the review database. They only sell what they\'d drink themselves.',
    whyTrust: 'Built on transparency and community trust. No paid placements.',
    notableBottles: ['Various small-batch releases', 'Community favorites'],
  },

  // SOLID TIER
  {
    name: 'Total Wine',
    url: 'https://www.totalwine.com',
    location: 'Nationwide',
    tier: 'solid',
    shipping: 'Ships to most US states',
    specialty: 'Accessibility and convenience',
    description: 'Big box but surprisingly decent mezcal selection in some locations. Good for entry-level bottles.',
    whyTrust: 'Consistent pricing, easy returns. Won\'t find unicorns but won\'t get ripped off.',
    notableBottles: ['Del Maguey Vida', 'Ilegal Joven', 'Montelobos', 'Banhez'],
    caveats: 'Selection varies wildly by location. Heavy on mass-market brands.',
  },
  {
    name: 'Drizly',
    url: 'https://www.drizly.com',
    location: 'Delivery App',
    tier: 'solid',
    shipping: 'Delivery in major metros',
    specialty: 'Convenience and speed',
    description: 'Aggregates local inventory. Good for finding what\'s available near you right now.',
    whyTrust: 'Transparent pricing from local shops. Compare before you buy.',
    notableBottles: ['Varies by location'],
    caveats: 'You\'re at the mercy of local inventory. Markup can be significant.',
  },
];

const mexicoRetailers = [
  {
    name: 'Mezcalia',
    location: 'Mexico City (Roma Norte)',
    url: 'https://mezcalia.com',
    description: 'The real deal in CDMX. Bottles you cannot get in the US. Worth the trip.',
    specialty: 'Fane Kantsini, small-batch producers, ancestral expressions',
  },
  {
    name: 'La Clandestina',
    location: 'Oaxaca City',
    url: 'https://laclandestina.mx',
    description: 'Mezcaleria and shop. Taste before you buy. The staff knows everything.',
    specialty: 'Local producers, rare agaves, educational tastings',
  },
  {
    name: 'In Situ',
    location: 'Oaxaca City',
    url: null,
    description: 'Ulises Torrentera\'s legendary mezcaleria. Buy what he recommends.',
    specialty: 'Curated by the godfather of mezcal appreciation',
  },
  {
    name: 'Mezcalogía',
    location: 'Oaxaca City',
    url: null,
    description: 'Silvia\'s bar and shop. Education first, sales second.',
    specialty: 'Traditional producers, proper context',
  },
];

const avoidList = [
  {
    name: 'Amazon',
    reason: 'Counterfeit risk, no temperature control, supporting the wrong ecosystem',
  },
  {
    name: 'Most airport duty-free',
    reason: 'Marked up mass-market garbage. The only mezcal worth buying at an airport is the one you\'re carrying on.',
  },
  {
    name: 'Generic liquor stores',
    reason: 'If they don\'t know what ancestral means, walk out.',
  },
  {
    name: 'Celebrity brand websites',
    reason: 'You know which ones. Don\'t give them your money.',
  },
];

// Full literal class strings per tier (Tailwind only generates classes it can see in source).
const tierInfo = {
  elite: {
    label: "ELITE",
    heading: "mb-4 flex items-center gap-3 text-amber-400",
    badge: "rounded bg-amber-500 px-3 py-1 text-xs font-bold text-white",
    card: "rounded-xl border border-amber-500 bg-white/5 p-6",
  },
  excellent: {
    label: "EXCELLENT",
    heading: "mb-4 flex items-center gap-3 text-emerald-400",
    badge: "rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white",
    card: "rounded-xl border border-emerald-600 bg-white/5 p-6",
  },
  solid: {
    label: "SOLID",
    heading: "mb-4 flex items-center gap-3 text-blue-400",
    badge: "rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white",
    card: "rounded-xl border border-blue-600 bg-white/5 p-6",
  },
} as const;

const tiers = ["elite", "excellent", "solid"] as const;

export function WhereToBuy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-black py-12 border-b border-amber-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <Link href={ss("/")} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6 transition-colors">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-amber-400 mb-4">
            Where to Buy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Trusted retailers with excellent selections and fair prices. No rip-offs, no mass-market garbage, no celebrity brands.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Philosophy */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <h2 className="font-serif text-xl text-amber-400 mb-3">Our Criteria</h2>
          <p className="text-gray-300 mb-4">
            We only recommend retailers who understand what they&apos;re selling. That means buyers who travel to Oaxaca, 
            staff who can explain the difference between espadín and tobalá, and a commitment to artisanal producers 
            over industrial brands. If they stock Casamigos, they&apos;re not on this list.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield aria-hidden="true" className="size-4" />
              <span>Curated Selection</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Star aria-hidden="true" className="size-4" />
              <span>Fair Pricing</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Truck aria-hidden="true" className="size-4" />
              <span>Reliable Shipping</span>
            </div>
          </div>
        </div>

        {/* US Retailers by Tier */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-amber-400 mb-6">US Online Retailers</h2>
          
          {tiers.map((tier) => {
            const tierRetailers = retailers.filter((r) => r.tier === tier);
            const info = tierInfo[tier];

            return (
              <div key={tier} className="mb-8">
                <div className={info.heading}>
                  <span className={info.badge}>{info.label}</span>
                  <div className="flex-1 h-px bg-current opacity-30" />
                </div>
                
                <div className="space-y-4">
                  {tierRetailers.map((retailer) => (
                    <div key={retailer.name} className={info.card}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-serif text-xl text-white mb-1">{retailer.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin aria-hidden="true" className="size-3" />
                              {retailer.location}
                            </span>
                            <span>•</span>
                            <span>{retailer.shipping}</span>
                          </div>
                        </div>
                        <a 
                          href={retailer.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors text-sm whitespace-nowrap"
                        >
                          Visit Store
                          <ExternalLink aria-hidden="true" className="size-4" />
                        </a>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{retailer.description}</p>
                      
                      <div className="bg-black/30 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-400 mb-1">WHY WE TRUST THEM</p>
                        <p className="text-gray-200 text-sm">{retailer.whyTrust}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {retailer.notableBottles.map((bottle) => (
                          <span key={bottle} className="px-2 py-1 bg-amber-900/30 rounded text-xs text-amber-400">
                            {bottle}
                          </span>
                        ))}
                      </div>
                      
                      {retailer.caveats && (
                        <p className="mt-2 flex items-start gap-1.5 text-xs text-yellow-500/70">
                          <AlertTriangle aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                          {retailer.caveats}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Mexico */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-amber-400 mb-2">In Mexico</h2>
          <p className="text-gray-400 mb-6">The bottles you can&apos;t get at home. Worth the trip.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {mexicoRetailers.map((retailer) => (
              <div key={retailer.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="font-medium text-white mb-1">{retailer.name}</h3>
                <p className="text-sm text-amber-400/70 mb-2">{retailer.location}</p>
                <p className="text-gray-300 text-sm mb-2">{retailer.description}</p>
                <p className="text-xs text-gray-400">Specialty: {retailer.specialty}</p>
                {retailer.url && (
                  <a 
                    href={retailer.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm mt-2"
                  >
                    Visit <ExternalLink aria-hidden="true" className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Where NOT to Buy */}
        <section className="mb-12">
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle aria-hidden="true" className="size-6 text-red-400 shrink-0" />
              <div>
                <h3 className="font-serif text-xl text-red-400 mb-4">Where NOT to Buy</h3>
                <div className="space-y-3">
                  {avoidList.map((item) => (
                    <div key={item.name}>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-red-300/70 text-sm">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-linear-to-br from-amber-950/30 to-transparent border border-amber-900/30 rounded-2xl p-8 text-center">
          <h3 className="font-serif text-2xl text-amber-400 mb-2">Not Sure What to Buy?</h3>
          <p className="text-gray-300 mb-6">Use our Quadrant to find bottles that match your taste and budget.</p>
          <Link
            href={ss("/quadrant")}
            className="inline-block rounded-lg bg-amber-600 px-6 py-3 transition-colors hover:bg-amber-500"
          >
            Explore the Quadrant
          </Link>
        </div>
      </div>
    </div>
  );
}
