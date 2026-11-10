import Link from "next/link";
import { AlertTriangle, ArrowLeft, Award, Check, Crown, Meh, Skull, ThumbsDown, ThumbsUp, type LucideIcon } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/SquadRiders.tsx (/squad-riders), 2026-11-10.
// Same riders, tiers and copy. No state, so it stays a Server Component. Tier styles are full
// literal class strings; the original's `border-opacity-30` does nothing in Tailwind v4, so cards
// keep the full tier border (as live). The typed check and warning signs are lucide icons.

interface SquadRider {
  name: string;
  handle?: string;
  platform: 'instagram' | 'twitter' | 'youtube' | 'multiple';
  tier: 'legend' | 'trusted' | 'solid' | 'mixed' | 'suspect' | 'shill';
  credibility: number; // 1-10
  description: string;
  whyRanked: string;
  knownFor: string[];
  redFlags?: string[];
  greenFlags?: string[];
}

const squadRiders: SquadRider[] = [
  // LEGENDS - The Real Ones
  {
    name: 'Ulises Torrentera',
    handle: '@insaboramezcal',
    platform: 'multiple',
    tier: 'legend',
    credibility: 10,
    description: 'Author of "Mezcalaria" and founder of In Situ. The godfather of mezcal appreciation.',
    whyRanked: 'Literally wrote the book on mezcal culture. Decades of advocacy before it was trendy. Never sold out.',
    knownFor: ['In Situ mezcaleria', 'Mezcalaria book', 'Cultural preservation'],
    greenFlags: ['Academic rigor', 'Producer relationships spanning decades', 'Never promotes industrial brands'],
  },
  {
    name: 'Silvia Philion',
    handle: '@mezcalogia',
    platform: 'instagram',
    tier: 'legend',
    credibility: 10,
    description: 'Founder of Mezcalogía in Oaxaca. Educator, advocate, and fierce defender of traditional mezcal.',
    whyRanked: 'Her educational tastings have converted thousands. Refuses to carry anything that doesn\'t meet her standards.',
    knownFor: ['Mezcalogía bar', 'Educational programs', 'Quality gatekeeping'],
    greenFlags: ['Rejects paid promotions', 'Deep producer relationships', 'Calls out fakes publicly'],
  },
  {
    name: 'Erick Rodríguez',
    handle: '@faboramezcal',
    platform: 'instagram',
    tier: 'legend',
    credibility: 10,
    description: 'Mezcalero behind Fane Kantsini. Makes some of the most sought-after mezcal on earth.',
    whyRanked: 'Doesn\'t need to promote - his mezcal speaks. Refuses to scale up despite demand.',
    knownFor: ['Fane Kantsini', 'Micro-batch production', 'Uncompromising quality'],
    greenFlags: ['Production over promotion', 'Keeps batches tiny', 'Community-focused'],
  },
  
  // TRUSTED - Consistently Good
  {
    name: 'Lou Bank',
    handle: '@loubank',
    platform: 'multiple',
    tier: 'trusted',
    credibility: 9,
    description: 'Founder of SACRED (Saving Agave for Culture, Recreation, Education, and Development).',
    whyRanked: 'Puts conservation and producer welfare above everything. Non-profit approach to advocacy.',
    knownFor: ['SACRED organization', 'Agave conservation', 'Producer advocacy'],
    greenFlags: ['Non-profit focus', 'Conservation work', 'Producer-first philosophy'],
  },
  {
    name: 'Mezcal Reviews',
    handle: '@mezcalreviews',
    platform: 'multiple',
    tier: 'trusted',
    credibility: 8,
    description: 'Comprehensive database of mezcal reviews and producer information.',
    whyRanked: 'Transparent methodology, no paid placements, community-driven ratings.',
    knownFor: ['Review database', 'Producer profiles', 'Community ratings'],
    greenFlags: ['No sponsored content', 'Transparent scoring', 'Calls out bad actors'],
  },
  {
    name: 'Susan Coss',
    handle: '@mezcouting',
    platform: 'instagram',
    tier: 'trusted',
    credibility: 8,
    description: 'Mezcal educator and advocate based in the US. Runs educational events and tastings.',
    whyRanked: 'Consistent quality recommendations. Transparent about brand relationships.',
    knownFor: ['Educational events', 'Tasting notes', 'Producer stories'],
    greenFlags: ['Discloses partnerships', 'Focuses on small producers', 'Educational approach'],
  },

  // SOLID - Generally Reliable
  {
    name: 'Thirsty Agave',
    handle: '@thirstyagave',
    platform: 'instagram',
    tier: 'solid',
    credibility: 7,
    description: 'Agave spirits content creator with focus on tasting notes and education.',
    whyRanked: 'Good palate, honest reviews, but occasionally features sponsored content.',
    knownFor: ['Tasting videos', 'Bottle reviews', 'Agave education'],
    greenFlags: ['Detailed tasting notes', 'Covers small producers'],
    redFlags: ['Some sponsored posts', 'Occasionally features mass-market brands'],
  },
  {
    name: 'Mezcal PhD',
    handle: '@mezcalphd',
    platform: 'instagram',
    tier: 'solid',
    credibility: 7,
    description: 'Academic approach to mezcal with focus on production science.',
    whyRanked: 'Good technical content, though sometimes overly focused on big brands.',
    knownFor: ['Production science', 'Technical analysis', 'Fermentation deep-dives'],
    greenFlags: ['Scientific rigor', 'Educational content'],
    redFlags: ['Brand partnerships not always disclosed'],
  },

  // MIXED - Proceed with Caution
  {
    name: 'Tequila Matchmaker',
    handle: '@tikilamatchmkr',
    platform: 'multiple',
    tier: 'mixed',
    credibility: 5,
    description: 'App and content platform covering tequila and mezcal.',
    whyRanked: 'Useful database but increasingly commercial. Paid placements affect rankings.',
    knownFor: ['Tequila/mezcal app', 'Brand database', 'NOM lookup'],
    greenFlags: ['Comprehensive database', 'NOM verification'],
    redFlags: ['Paid brand placements', 'Ratings influenced by advertisers', 'Promotes industrial brands'],
  },
  {
    name: 'Various "Mezcal Influencers"',
    platform: 'instagram',
    tier: 'mixed',
    credibility: 4,
    description: 'The growing wave of lifestyle influencers who discovered mezcal is trendy.',
    whyRanked: 'Often prioritize aesthetics over authenticity. Promote whatever pays.',
    knownFor: ['Pretty photos', 'Brand deals', 'Lifestyle content'],
    redFlags: ['No production knowledge', 'Promote celebrity brands', 'Paid posts disguised as organic'],
  },

  // SUSPECT - Approach with Skepticism
  {
    name: 'Brand Ambassadors (Most)',
    platform: 'multiple',
    tier: 'suspect',
    credibility: 3,
    description: 'Paid representatives of specific mezcal brands.',
    whyRanked: 'Literally paid to promote one brand. Their job is marketing, not education.',
    knownFor: ['Brand events', 'Promotional content', 'Trade marketing'],
    redFlags: ['Financial conflict of interest', 'Only promote their brand', 'Downplay competitors'],
  },
  {
    name: 'Bartender Influencers',
    platform: 'instagram',
    tier: 'suspect',
    credibility: 3,
    description: 'Bartenders who pivoted to influencer content, often with brand deals.',
    whyRanked: 'Some are genuine, but many are pay-to-play. Hard to distinguish.',
    knownFor: ['Cocktail content', 'Bar features', 'Brand partnerships'],
    redFlags: ['Undisclosed sponsorships', 'Promote whatever pays', 'Limited production knowledge'],
  },

  // SHILLS - The Bottom of the Barrel
  {
    name: 'Celebrity Brand Promoters',
    platform: 'multiple',
    tier: 'shill',
    credibility: 1,
    description: 'Celebrities promoting their own mezcal brands or paid to promote others.',
    whyRanked: 'Zero knowledge, zero credibility. Pure marketing exploitation.',
    knownFor: ['Celebrity mezcal brands', 'Paid endorsements', 'Exploiting the category'],
    redFlags: ['No mezcal knowledge', 'Promote industrial products', 'Profit over authenticity', 'Often on Wall of Shame'],
  },
  {
    name: 'Paid Review Sites',
    platform: 'multiple',
    tier: 'shill',
    credibility: 1,
    description: 'Websites that charge for reviews or placement.',
    whyRanked: 'Pay-to-play model means reviews are advertisements.',
    knownFor: ['Sponsored "reviews"', 'Paid placements', 'SEO content farms'],
    redFlags: ['All reviews are positive', 'No disclosure of payment', 'Promote mass-market brands heavily'],
  },
];

type Tier = SquadRider["tier"];

const tierInfo: Record<
  Tier,
  { label: string; icon: LucideIcon; legend: string; legendHeading: string; heading: string; card: string; score: string; description: string }
> = {
  legend: {
    label: "LEGEND",
    icon: Crown,
    legend: "rounded-lg border border-amber-500 bg-black/50 p-3",
    legendHeading: "mb-1 flex items-center gap-2 text-amber-400",
    heading: "mb-6 flex items-center gap-3 text-amber-400",
    card: "rounded-xl border border-amber-500 bg-white/5 p-6",
    score: "flex size-16 items-center justify-center rounded-xl bg-linear-to-r from-amber-500 to-yellow-400",
    description: "The untouchables. Decades of credibility. Would never sell out.",
  },
  trusted: {
    label: "TRUSTED",
    icon: Award,
    legend: "rounded-lg border border-emerald-600 bg-black/50 p-3",
    legendHeading: "mb-1 flex items-center gap-2 text-emerald-400",
    heading: "mb-6 flex items-center gap-3 text-emerald-400",
    card: "rounded-xl border border-emerald-600 bg-white/5 p-6",
    score: "flex size-16 items-center justify-center rounded-xl bg-emerald-600",
    description: "Consistently reliable. Transparent about any conflicts.",
  },
  solid: {
    label: "SOLID",
    icon: ThumbsUp,
    legend: "rounded-lg border border-blue-600 bg-black/50 p-3",
    legendHeading: "mb-1 flex items-center gap-2 text-blue-400",
    heading: "mb-6 flex items-center gap-3 text-blue-400",
    card: "rounded-xl border border-blue-600 bg-white/5 p-6",
    score: "flex size-16 items-center justify-center rounded-xl bg-blue-600",
    description: "Generally good, but verify their recommendations.",
  },
  mixed: {
    label: "MIXED",
    icon: Meh,
    legend: "rounded-lg border border-yellow-600 bg-black/50 p-3",
    legendHeading: "mb-1 flex items-center gap-2 text-yellow-400",
    heading: "mb-6 flex items-center gap-3 text-yellow-400",
    card: "rounded-xl border border-yellow-600 bg-white/5 p-6",
    score: "flex size-16 items-center justify-center rounded-xl bg-yellow-600",
    description: "Some good content, but commercial interests cloud judgment.",
  },
  suspect: {
    label: "SUSPECT",
    icon: ThumbsDown,
    legend: "rounded-lg border border-orange-600 bg-black/50 p-3",
    legendHeading: "mb-1 flex items-center gap-2 text-orange-400",
    heading: "mb-6 flex items-center gap-3 text-orange-400",
    card: "rounded-xl border border-orange-600 bg-white/5 p-6",
    score: "flex size-16 items-center justify-center rounded-xl bg-orange-600",
    description: "Approach with skepticism. Financial conflicts likely.",
  },
  shill: {
    label: "SHILL",
    icon: Skull,
    legend: "rounded-lg border border-red-600 bg-black/50 p-3",
    legendHeading: "mb-1 flex items-center gap-2 text-red-400",
    heading: "mb-6 flex items-center gap-3 text-red-400",
    card: "rounded-xl border border-red-600 bg-white/5 p-6",
    score: "flex size-16 items-center justify-center rounded-xl bg-red-600",
    description: "Pure marketing. Zero credibility. Ignore completely.",
  },
};

const tiers: Tier[] = ["legend", "trusted", "solid", "mixed", "suspect", "shill"];

export function SquadRiders() {
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
            The Squad Riders
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Who to trust in the mezcal world. From the legends who built the culture to the shills who exploit it.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Methodology */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <h2 className="font-serif text-xl text-amber-400 mb-3">How We Rank</h2>
          <p className="text-gray-300 mb-4">
            Our credibility score (1-10) considers: depth of production knowledge, transparency about brand relationships, 
            consistency of recommendations, willingness to criticize bad actors, and years of genuine advocacy before mezcal became trendy.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tiers.map((tier) => {
              const info = tierInfo[tier];
              return (
                <div key={tier} className={info.legend}>
                  <div className={info.legendHeading}>
                    <info.icon aria-hidden="true" className="size-5 shrink-0" />
                    <span className="font-bold text-sm">{info.label}</span>
                  </div>
                  <p className="text-xs text-gray-400">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Riders by Tier */}
        {tiers.map(tier => {
          const tierRiders = squadRiders.filter(r => r.tier === tier);
          if (tierRiders.length === 0) return null;
          
          const info = tierInfo[tier];

          return (
            <section key={tier} className="mb-12">
              <div className={info.heading}>
                <info.icon aria-hidden="true" className="size-5" />
                <h2 className="font-serif text-2xl">{info.label}</h2>
                <div className="flex-1 h-px bg-current opacity-30" />
              </div>
              
              <div className="space-y-4">
                {tierRiders.map((rider) => (
                  <div key={rider.name} className={info.card}>
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Credibility Score */}
                      <div className="shrink-0">
                        <div className={info.score}>
                          <span className="text-2xl font-bold text-white">{rider.credibility}</span>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-1">out of 10</p>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-serif text-xl text-white">{rider.name}</h3>
                          {rider.handle && (
                            <span className="text-sm text-gray-400">{rider.handle}</span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 mb-3">{rider.description}</p>
                        
                        <div className="bg-black/30 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-400 mb-1">WHY THIS RANKING</p>
                          <p className="text-gray-200 text-sm">{rider.whyRanked}</p>
                        </div>
                        
                        {/* Known For */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {rider.knownFor.map((item) => (
                            <span key={item} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                              {item}
                            </span>
                          ))}
                        </div>
                        
                        {/* Flags */}
                        <div className="grid md:grid-cols-2 gap-3">
                          {rider.greenFlags && rider.greenFlags.length > 0 && (
                            <div>
                              <p className="mb-1 flex items-center gap-1 text-xs text-emerald-400">
                                <Check aria-hidden="true" className="size-3" />
                                GREEN FLAGS
                              </p>
                              <ul className="text-xs text-gray-400 space-y-0.5">
                                {rider.greenFlags.map((flag) => (
                                  <li key={flag}>• {flag}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {rider.redFlags && rider.redFlags.length > 0 && (
                            <div>
                              <p className="mb-1 flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle aria-hidden="true" className="size-3" />
                                RED FLAGS
                              </p>
                              <ul className="text-xs text-gray-400 space-y-0.5">
                                {rider.redFlags.map((flag) => (
                                  <li key={flag}>• {flag}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Disclaimer */}
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-6 mt-12">
          <h3 className="font-serif text-lg text-amber-400 mb-2">A Note on This List</h3>
          <p className="text-gray-300 text-sm">
            Rankings are based on observable behavior, disclosed relationships, and consistency over time. 
            We welcome corrections and updates. The mezcal world is small - reputations are earned through years of 
            genuine advocacy, not bought through marketing budgets. If you think we&apos;ve missed someone or misjudged, 
            reach out with evidence.
          </p>
        </div>
      </div>
    </div>
  );
}
