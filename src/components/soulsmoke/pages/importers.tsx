import Link from "next/link";
import { AlertTriangle, ArrowLeft, Award, ExternalLink, Globe, Mail, MapPin, Phone, Shield, Skull, Star, type LucideIcon } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Importers.tsx (/importers, "The Gatekeepers"),
// 2026-11-10. Same importers, tiers and copy. No state, so it stays a Server Component. Tier
// styles are full literal class strings (Tailwind only generates classes it can see in source).

interface Importer {
  name: string;
  founder?: string;
  founded?: string;
  location: string;
  brands: string[];
  philosophy: string;
  website?: string;
  email?: string;
  phone?: string;
  tier: 'guardian' | 'solid' | 'commercial' | 'shame';
  shameReason?: string;
}

const importers: Importer[] = [
  // TIER 1: THE GUARDIANS
  {
    name: 'PM Spirits',
    founder: 'Nicolas Palazzi',
    location: 'Brooklyn, NY',
    brands: ['NETA', 'Cinco Sentidos (5 Sentidos)', 'Ixcateco'],
    philosophy: 'No additives, single-cask bottlings, true essence of origins. Each bottle tells a story of its origin, the craft, and the passion of its makers.',
    website: 'https://pmspirits.com',
    email: 'meryl@pmspirits.com',
    phone: '(646) 247-2009',
    tier: 'guardian'
  },
  {
    name: 'Del Maguey Single Village Mezcal',
    founder: 'Ron Cooper (1995)',
    location: 'Oaxaca / Los Angeles',
    brands: ['Del Maguey Chichicapa', 'Del Maguey Vida', 'Del Maguey Pechuga', 'Del Maguey Minero', 'Del Maguey Tobala'],
    philosophy: 'The pioneer who started it all. Single-village sourcing, direct producer relationships, education-first approach. Ron Cooper brought mezcal to America and changed everything.',
    website: 'https://delmaguey.com',
    email: 'info@delmaguey.com',
    tier: 'guardian'
  },
  {
    name: 'Bad Hombre Imports',
    founder: 'Fred Sanchez (2014)',
    location: 'United States',
    brands: ['Agua del Sol', 'Oaxacan Whiskies'],
    philosophy: 'Education-first approach, community impact focus. Works exclusively with small, independent brands that have positive impact on their communities. Specializes in on-premise customers.',
    website: 'https://badhombreimports.com',
    tier: 'guardian'
  },
  {
    name: 'Baron François',
    founded: '1982',
    location: 'New York, NY',
    brands: ['Mezcal Matra Silvestre-Tobalá', 'Mezcal Matra Joven-Espadín'],
    philosophy: 'Bridging tradition and modernity since 1982. Artisanal mezcals that blend traditional production methods with innovative approaches while respecting Mexico\'s distilling heritage.',
    website: 'https://baronfrancois.com',
    tier: 'guardian'
  },
  {
    name: 'Erstwhile Mezcal',
    location: 'United States',
    brands: ['Erstwhile Arroqueño', 'Erstwhile Tobalá', 'Erstwhile Espadín'],
    philosophy: 'Direct relationships with producers, transparency in sourcing, commitment to preserving traditional methods and supporting mezcalero families.',
    website: 'https://erstwhilemezcal.com',
    tier: 'guardian'
  },
  {
    name: 'Noble Coyote',
    location: 'United States',
    brands: ['Noble Coyote Artisanal Mezcal'],
    philosophy: 'Artisanal mezcal handcrafted in Oaxaca with focus on traditional methods and authentic expression of terroir.',
    website: 'https://coyotemezcals.com',
    email: 'sales@noblecoyote.com',
    phone: '(571) 278-3366',
    tier: 'guardian'
  },

  // TIER 2: SOLID CHOICES
  {
    name: 'Mara Imports',
    founder: 'Maricela Martinez (2017)',
    location: 'United States',
    brands: ['30-30', 'Antigua Cruz', 'Tierra Zafiro', 'Tres Aromas'],
    philosophy: 'Family-owned with 80+ years combined industry experience. Focus on authenticity, heritage, and long-term relationships with producers.',
    website: 'https://maraimports.com',
    tier: 'solid'
  },
  {
    name: 'Pacific Edge Wine & Spirits',
    location: 'California',
    brands: ['4 Copas', 'Campo Azul', 'Dos Armadillos', 'KAH', 'Rooster Rojo', 'Zapopan'],
    philosophy: 'Innovative approach with exclusive brand experiences. Avoids brand overlap to provide distinctive portfolio for on-premise partners.',
    website: 'https://pacificedgewine.com',
    tier: 'solid'
  },
  {
    name: 'Double Eagle Imports',
    location: 'United States',
    brands: ['Arrogante', 'Espanita', 'Rudo', 'Tecnico'],
    philosophy: 'Focus on artisanal promotion through storytelling, creative marketing, and retail activations. Emphasizes high-quality sipping tequilas.',
    website: 'https://doubleeagleimports.com',
    tier: 'solid'
  },
  {
    name: 'Lizarraga Company',
    location: 'United States',
    brands: ['Various Tequila, Mezcal, Sotol'],
    philosophy: 'Imports from Durango, Oaxaca, Chihuahua, and Guanajuato. Mezcal for everyone, everywhere.',
    website: 'https://lizarragacompany.com',
    tier: 'solid'
  },

  // TIER 3: COMMERCIAL/MASS MARKET
  {
    name: 'Freshie Imports',
    location: 'United States',
    brands: ['Authentico Organic Tequila'],
    philosophy: 'Focus on organic certification and mainstream appeal. Solar-powered, carbon-neutral production.',
    tier: 'commercial'
  },

  // TIER 4: WALL OF SHAME
  {
    name: 'Diageo',
    location: 'Global',
    brands: ['Casamigos', 'Don Julio'],
    philosophy: 'Massive corporate conglomerate prioritizing volume over authenticity.',
    tier: 'shame',
    shameReason: 'Casamigos lawsuit alleged only 33% agave content. Industrial production methods. Celebrity marketing over substance.'
  },
  {
    name: 'Proximo Spirits',
    location: 'Global',
    brands: ['Jose Cuervo', '1800', 'Maestro Dobel'],
    philosophy: 'Industrial scale production with mainstream focus.',
    tier: 'shame',
    shameReason: 'Mass production, diffuser methods suspected, prioritizes volume over craft.'
  },
  {
    name: 'Celebrity Brand Distributors',
    location: 'Various',
    brands: ['Dos Hombres (Cranston/Paul)', '818 (Kendall Jenner)', 'Cincoro (Michael Jordan)'],
    philosophy: 'Celebrity names over mezcal quality.',
    tier: 'shame',
    shameReason: 'Dos Hombres: Lowest rated on mezcalreviews.com. 818: Red flag celebrity brand. These prioritize marketing spend over liquid quality.'
  },
  {
    name: 'Clase Azul Importers',
    location: 'Various',
    brands: ['Clase Azul'],
    philosophy: 'Beautiful bottles, questionable contents.',
    tier: 'shame',
    shameReason: 'Known for additives including vanilla, artificial sweeteners, glycerin, and caramel coloring. The bottle costs more than the liquid inside.'
  },
  {
    name: 'Industrial Mezcal Importers',
    location: 'Various',
    brands: ['Gusano Rojo', 'Monte Alban', 'Zignum', 'Scorpion Mezcal'],
    philosophy: 'Mass production for uninformed consumers.',
    tier: 'shame',
    shameReason: 'Worm gimmicks, industrial production, diffuser methods. These brands set mezcal back decades and perpetuate stereotypes.'
  }
];

type Tier = Importer["tier"];

const tierInfo: Record<
  Tier,
  { label: string; description: string; color: string; card: string; title: string; heading: string; icon: LucideIcon }
> = {
  guardian: {
    label: "THE GUARDIANS",
    description:
      "These importers are the true champions of mezcal culture. They prioritize authenticity, direct relationships with mezcaleros, and education over profit.",
    color: "text-emerald-400",
    card: "rounded-xl border border-emerald-700/50 bg-emerald-950/50 p-6 transition-all hover:scale-[1.02]",
    title: "font-serif text-2xl text-emerald-400",
    heading: "font-serif text-3xl text-emerald-400",
    icon: Shield,
  },
  solid: {
    label: "SOLID CHOICES",
    description:
      "Reputable importers with good portfolios. They bring quality products to market with reasonable business practices.",
    color: "text-amber-400",
    card: "rounded-xl border border-amber-700/50 bg-amber-950/50 p-6 transition-all hover:scale-[1.02]",
    title: "font-serif text-2xl text-amber-400",
    heading: "font-serif text-3xl text-amber-400",
    icon: Award,
  },
  commercial: {
    label: "COMMERCIAL",
    description:
      "Mass-market focused importers. Not necessarily bad, but prioritize volume and mainstream appeal over artisanal craft.",
    color: "text-gray-300",
    card: "rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 transition-all hover:scale-[1.02]",
    title: "font-serif text-2xl text-gray-300",
    heading: "font-serif text-3xl text-gray-300",
    icon: Star,
  },
  shame: {
    label: "WALL OF SHAME",
    description:
      "These importers bring products that undermine mezcal culture through industrial methods, additives, celebrity marketing, or outright deception.",
    color: "text-red-400",
    card: "rounded-xl border border-red-700/50 bg-red-950/50 p-6 transition-all hover:scale-[1.02]",
    title: "font-serif text-2xl text-red-400",
    heading: "font-serif text-3xl text-red-400",
    icon: Skull,
  },
};

export function Importers() {
  const guardians = importers.filter(i => i.tier === 'guardian');
  const solid = importers.filter(i => i.tier === 'solid');
  const commercial = importers.filter(i => i.tier === 'commercial');
  const shame = importers.filter(i => i.tier === 'shame');

  const renderImporterCard = (importer: Importer) => {
    const info = tierInfo[importer.tier];

    return (
      <div key={importer.name} className={info.card}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={info.title}>{importer.name}</h3>
            {importer.founder && (
              <p className="text-gray-300 text-sm mt-1">Founded by {importer.founder}</p>
            )}
            {importer.founded && !importer.founder && (
              <p className="text-gray-300 text-sm mt-1">Est. {importer.founded}</p>
            )}
          </div>
          <info.icon aria-hidden="true" className={`size-6 ${info.color}`} />
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <MapPin aria-hidden="true" className="size-4" />
          <span>{importer.location}</span>
        </div>

        <p className="text-gray-200 mb-4 leading-relaxed">{importer.philosophy}</p>

        {importer.shameReason && (
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle aria-hidden="true" className="size-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{importer.shameReason}</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Brands</p>
          <div className="flex flex-wrap gap-2">
            {importer.brands.map(brand => (
              <span 
                key={brand}
                className={`px-2 py-1 rounded text-xs ${
                  importer.tier === 'shame' 
                    ? 'bg-red-900/50 text-red-300' 
                    : 'bg-white/10 text-gray-200'
                }`}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {(importer.website || importer.email || importer.phone) && (
          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Contact</p>
            <div className="flex flex-wrap gap-3">
              {importer.website && (
                <a 
                  href={importer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Globe aria-hidden="true" className="size-4" />
                  Website
                  <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              )}
              {importer.email && (
                <a 
                  href={`mailto:${importer.email}`}
                  className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Mail aria-hidden="true" className="size-4" />
                  {importer.email}
                </a>
              )}
              {importer.phone && (
                <a 
                  href={`tel:${importer.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {importer.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTierSection = (tierImporters: Importer[], tier: Tier) => {
    const info = tierInfo[tier];

    return (
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <info.icon aria-hidden="true" className={`size-8 ${info.color}`} />
          <div>
            <h2 className={info.heading}>{info.label}</h2>
            <p className="text-gray-300 mt-1">{info.description}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {tierImporters.map(renderImporterCard)}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-black py-16 border-b border-amber-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <Link href={ss("/")} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6 transition-colors">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-5xl md:text-6xl text-amber-400 mb-4">
            The Gatekeepers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-6">
            A ranked guide to US mezcal importers. Who&apos;s bringing the real stuff, and who&apos;s flooding the market with industrial swill and celebrity cash-grabs.
          </p>
          
          <div className="bg-amber-950/40 border border-amber-700/50 rounded-lg p-4 max-w-3xl">
            <p className="text-gray-200 text-sm leading-relaxed">
              <strong className="text-amber-400">Why this matters:</strong> The importer you buy from determines whether your money supports traditional mezcalero families or corporate shareholders. 
              The Guardians work directly with producers, pay fair prices, and educate consumers. The Wall of Shame prioritizes marketing over quality and often uses additives or industrial methods.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {renderTierSection(guardians, 'guardian')}
        {renderTierSection(solid, 'solid')}
        {renderTierSection(commercial, 'commercial')}
        {renderTierSection(shame, 'shame')}

        {/* How to Use This Guide */}
        <section className="mt-16 bg-linear-to-br from-amber-950/30 to-transparent border border-amber-900/30 rounded-2xl p-8">
          <h2 className="font-serif text-3xl text-amber-400 mb-6">How to Use This Guide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">For Consumers</h3>
              <p className="text-gray-300 leading-relaxed">
                Check who imports the mezcal before you buy. If it comes from a Guardian, you&apos;re supporting traditional production and fair trade. 
                If it&apos;s from the Wall of Shame, your money goes to marketing departments and corporate profits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">For Bars & Restaurants</h3>
              <p className="text-gray-300 leading-relaxed">
                Partner with Guardian importers for your mezcal program. They offer education, staff training, and authentic stories that elevate your menu. 
                PM Spirits and Bad Hombre specialize in on-premise relationships.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
