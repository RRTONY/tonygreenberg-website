"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  ExternalLink,
  Filter,
  Flag,
  Globe,
  Heart,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals, type Mezcal } from "@/lib/content/soulsmoke/mezcal-data";
import { soulsmokeImages as img } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/AgaveEncyclopedia.tsx. Same data, copy (EN/ES),
// filters, scroll-in animation and expandable cards. Changes: images are next/image from Sanity,
// wouter links -> next/link, the flag emoji in the market badge -> lucide Flag/Globe icons and the
// typed "→" -> ArrowRight (rule 18), icon-only buttons got labels, and the expand control is a
// real <button> with aria-expanded. The collapsed panel's text is always in the HTML (as live).

// Complete agave data from the PDF
const agaveData = [
  {
    id: 1,
    name: "Espadín",
    scientificName: "Agave angustifolia",
    region: "Oaxaca, Guerrero, Durango",
    maturityYears: "6-8",
    rarity: "Common",
    flavorProfile: ["Smoky", "Sweet", "Herbal"],
    flavorCategory: "Balanced",
    description: "The workhorse of mezcal. Cultivated and reliable, Espadín accounts for 90% of production. But don't dismiss it—in the hands of a master mezcalero, it reveals surprising complexity.",
    image: img.agaveEspadin.src,
    color: "absolute inset-0 bg-emerald-900/30 mix-blend-multiply",
    difficulty: 2,
    difficultyReason: "Easy to cultivate, fast-growing, high sugar yield. The most forgiving agave for producers.",
  },
  {
    id: 2,
    name: "Tobalá",
    scientificName: "Agave potatorum",
    region: "Oaxaca (high altitude)",
    maturityYears: "12-15",
    rarity: "Rare",
    flavorProfile: ["Floral", "Fruity", "Complex"],
    flavorCategory: "Floral",
    description: "The 'King of Mezcals.' Wild-harvested from rocky mountainsides, Tobalá cannot be cultivated. Each plant is a gift from the land, yielding mezcal of extraordinary delicacy.",
    image: img.agaveTobala.src,
    color: "absolute inset-0 bg-purple-900/30 mix-blend-multiply",
    difficulty: 8,
    difficultyReason: "Wild-only harvest from remote mountain terrain. Small piñas yield little liquid. 12-15 year wait.",
  },
  {
    id: 3,
    name: "Tepeztate",
    scientificName: "Agave marmorata",
    region: "Oaxaca (cliff faces)",
    maturityYears: "25-35",
    rarity: "Very Rare",
    flavorProfile: ["Vegetal", "Mineral", "Intense"],
    flavorCategory: "Earthy",
    description: "The wild one. Growing on vertical cliff faces for up to 35 years, Tepeztate defies cultivation. Its mezcal is intensely vegetal, almost alien—not for beginners.",
    image: img.agaveTepeztate.src,
    color: "absolute inset-0 bg-amber-900/30 mix-blend-multiply",
    difficulty: 10,
    difficultyReason: "Grows on sheer cliff faces requiring rope harvesting. 25-35 year maturation. Cannot be cultivated. The ultimate challenge.",
  },
  {
    id: 4,
    name: "Madrecuixe",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturityYears: "12-15",
    rarity: "Uncommon",
    flavorProfile: ["Herbaceous", "Citrus", "Spicy"],
    flavorCategory: "Herbal",
    description: "Tall and slender, Madrecuixe grows in the wild valleys of Oaxaca. Its mezcal carries bright citrus notes with an herbaceous backbone and a peppery finish.",
    image: img.agaveEspadin.src,
    color: "absolute inset-0 bg-lime-900/30 mix-blend-multiply",
    difficulty: 6,
    difficultyReason: "Semi-wild, tall thin stalks make harvesting awkward. Moderate yield but requires skilled processing.",
  },
  {
    id: 5,
    name: "Arroqueño",
    scientificName: "Agave americana var. oaxacensis",
    region: "Oaxaca",
    maturityYears: "15-25",
    rarity: "Rare",
    flavorProfile: ["Chocolate", "Coffee", "Earthy"],
    flavorCategory: "Rich",
    description: "A giant among agaves, Arroqueño can weigh over 400 pounds. Its mezcal is rich and complex, with notes of dark chocolate and roasted coffee.",
    image: img.agaveTobala.src,
    color: "absolute inset-0 bg-stone-800/30 mix-blend-multiply",
    difficulty: 7,
    difficultyReason: "Massive 400lb piñas require multiple people to harvest. 15-25 year wait. High reward but logistically demanding.",
  },
  {
    id: 6,
    name: "Jabalí",
    scientificName: "Agave convallis",
    region: "Oaxaca",
    maturityYears: "10-15",
    rarity: "Very Rare",
    flavorProfile: ["Funky", "Tropical", "Wild"],
    flavorCategory: "Wild",
    description: "The rebel. Jabalí is notoriously difficult to ferment, often producing unpredictable results. When it works, it's magic—tropical, funky, utterly unique.",
    image: img.agaveTepeztate.src,
    color: "absolute inset-0 bg-orange-900/30 mix-blend-multiply",
    difficulty: 9,
    difficultyReason: "Fermentation nightmare—high failure rate. Many batches spoil. Only master mezcaleros attempt it.",
  },
  {
    id: 7,
    name: "Cuixe",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturityYears: "10-12",
    rarity: "Uncommon",
    flavorProfile: ["Mint", "Eucalyptus", "Fresh"],
    flavorCategory: "Herbal",
    description: "A variant of Karwinskii, Cuixe delivers a remarkably fresh, almost mentholated character. It's like breathing mountain air.",
    image: img.agaveEspadin.src,
    color: "absolute inset-0 bg-teal-900/30 mix-blend-multiply",
    difficulty: 5,
    difficultyReason: "Semi-cultivated Karwinskii variant. Moderate difficulty with predictable results.",
  },
  {
    id: 8,
    name: "Mexicano",
    scientificName: "Agave rhodacantha",
    region: "Oaxaca, Durango",
    maturityYears: "8-12",
    rarity: "Uncommon",
    flavorProfile: ["Fruity", "Floral", "Balanced"],
    flavorCategory: "Floral",
    description: "Versatile and expressive, Mexicano adapts to its terroir. From Oaxaca to Durango, each region produces distinctly different expressions.",
    image: img.agaveTobala.src,
    color: "absolute inset-0 bg-rose-900/30 mix-blend-multiply",
    difficulty: 4,
    difficultyReason: "Adaptable and semi-cultivated. Moderate maturation time with reliable yields.",
  },
  {
    id: 9,
    name: "Cirial",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturityYears: "12-18",
    rarity: "Rare",
    flavorProfile: ["Pine", "Resin", "Smoke"],
    flavorCategory: "Earthy",
    description: "Another Karwinskii variant, Cirial grows tall and thin like a candle (hence the name). Its mezcal carries intense pine and resinous notes.",
    image: img.agaveTepeztate.src,
    color: "absolute inset-0 bg-green-900/30 mix-blend-multiply",
    difficulty: 6,
    difficultyReason: "Tall thin stalks are fragile during harvest. Long maturation in remote areas.",
  },
  {
    id: 10,
    name: "Barril",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturityYears: "10-15",
    rarity: "Uncommon",
    flavorProfile: ["Tropical", "Mango", "Sweet"],
    flavorCategory: "Fruity",
    description: "Named for its barrel-shaped piña, Barril produces surprisingly tropical mezcal with notes of ripe mango and papaya.",
    image: img.agaveEspadin.src,
    color: "absolute inset-0 bg-yellow-900/30 mix-blend-multiply",
    difficulty: 5,
    difficultyReason: "Compact barrel shape makes processing easier. Semi-wild with moderate availability.",
  },
  {
    id: 11,
    name: "Coyote",
    scientificName: "Agave americana",
    region: "Oaxaca",
    maturityYears: "10-15",
    rarity: "Rare",
    flavorProfile: ["Caramel", "Butter", "Rich"],
    flavorCategory: "Rich",
    description: "Wild and elusive like its namesake, Coyote produces rich, buttery mezcal with caramel undertones.",
    image: img.agaveTobala.src,
    color: "absolute inset-0 bg-amber-800/30 mix-blend-multiply",
    difficulty: 7,
    difficultyReason: "Wild-only, elusive in remote terrain. Unpredictable locations require experienced foragers.",
  },
  {
    id: 12,
    name: "Sierra Negra",
    scientificName: "Agave americana var. oaxacensis",
    region: "Oaxaca (Sierra Negra mountains)",
    maturityYears: "15-20",
    rarity: "Rare",
    flavorProfile: ["Mineral", "Wet Stone", "Complex"],
    flavorCategory: "Earthy",
    description: "From the black mountains of Oaxaca, Sierra Negra captures the essence of volcanic soil—mineral, complex, profound.",
    image: img.agaveTepeztate.src,
    color: "absolute inset-0 bg-slate-800/30 mix-blend-multiply",
    difficulty: 8,
    difficultyReason: "High-altitude volcanic terrain. Remote access, long maturation, limited population.",
  },
  {
    id: 13,
    name: "Cuishe",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturityYears: "10-14",
    rarity: "Uncommon",
    flavorProfile: ["Citrus", "Herbal", "Bright"],
    flavorCategory: "Herbal",
    description: "Another Karwinskii expression, Cuishe is known for its bright, citrus-forward character with herbal undertones.",
    image: img.agaveEspadin.src,
    color: "absolute inset-0 bg-lime-800/30 mix-blend-multiply",
    difficulty: 5,
    difficultyReason: "Semi-cultivated Karwinskii. Moderate difficulty with consistent quality.",
  },
  {
    id: 14,
    name: "Largo",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturityYears: "12-18",
    rarity: "Rare",
    flavorProfile: ["Elegant", "Floral", "Refined"],
    flavorCategory: "Floral",
    description: "The aristocrat of the Karwinskii family. Largo produces elegant, refined mezcal with delicate floral notes.",
    image: img.agaveTobala.src,
    color: "absolute inset-0 bg-violet-900/30 mix-blend-multiply",
    difficulty: 7,
    difficultyReason: "Tall delicate stalks, long maturation. Requires careful handling to preserve elegance.",
  },
  {
    id: 15,
    name: "Cenizo",
    scientificName: "Agave durangensis",
    region: "Durango",
    maturityYears: "10-15",
    rarity: "Uncommon",
    flavorProfile: ["Earthy", "Mineral", "Smoky"],
    flavorCategory: "Earthy",
    description: "The signature agave of Durango. Cenizo produces distinctly earthy, mineral-driven mezcal unlike anything from Oaxaca.",
    image: img.agaveTepeztate.src,
    color: "absolute inset-0 bg-gray-800/30 mix-blend-multiply",
    difficulty: 4,
    difficultyReason: "Semi-cultivated in Durango. Different terroir but reliable production methods.",
  },
];

type Agave = (typeof agaveData)[number];

const flavorCategories = ["All", "Balanced", "Floral", "Earthy", "Herbal", "Rich", "Wild", "Fruity"];
const rarityLevels = ["All", "Common", "Uncommon", "Rare", "Very Rare"];
const regions = ["All", "Oaxaca", "Guerrero", "Durango"];

// Helper to get top bottles for an agave type
export function getTopBottlesForAgave(agaveName: string): Mezcal[] {
  // Normalize agave name for matching
  const normalizedName = agaveName.toLowerCase();

  // Find all mezcals with this agave type
  const matchingMezcals = allMezcals.filter((m) => {
    const mezcalAgave = m.agave.toLowerCase();
    return mezcalAgave.includes(normalizedName) || normalizedName.includes(mezcalAgave);
  });

  // Sort by combined EVI + EEI score (prioritizing value)
  const sorted = matchingMezcals.sort((a, b) => {
    const scoreA = a.evi * 1.2 + a.eei; // Slightly weight value higher
    const scoreB = b.evi * 1.2 + b.eei;
    return scoreB - scoreA;
  });

  // Return top 3
  return sorted.slice(0, 3);
}

// Star rating component
function StarRating({ score, max = 10 }: { score: number; max?: number }) {
  const stars = Math.round((score / max) * 5);
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${stars} of 5`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i < stars ? "size-3 fill-amber-400 text-amber-400" : "size-3 text-stone-600"}
        />
      ))}
    </div>
  );
}

const RANK_CLASSES: Record<number, string> = {
  1: "flex size-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-stone-950",
  2: "flex size-6 items-center justify-center rounded-full bg-stone-400 text-xs font-bold text-stone-950",
  3: "flex size-6 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-stone-200",
};

const MARKET_BADGE: Record<Mezcal["market"], { className: string; label: string; icon: typeof Flag }> = {
  us: { className: "inline-flex items-center gap-1 rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300", label: "US", icon: Flag },
  mexico: {
    className: "inline-flex items-center gap-1 rounded-full bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-300",
    label: "MX",
    icon: Flag,
  },
  both: {
    className: "inline-flex items-center gap-1 rounded-full bg-purple-900/50 px-2 py-0.5 text-xs text-purple-300",
    label: "Both",
    icon: Globe,
  },
};

// Best bottles card component
function BestBottleCard({ mezcal, rank }: { mezcal: Mezcal; rank: number }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(mezcal.id);
  const market = MARKET_BADGE[mezcal.market];
  const MarketIcon = market.icon;

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-900/50 p-3 transition-all hover:border-lime-500/30">
      <div className={RANK_CLASSES[rank] ?? RANK_CLASSES[3]}>{rank}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-xs text-lime-400">{mezcal.brand}</p>
            <h4 className="truncate font-semibold text-stone-100">{mezcal.name}</h4>
          </div>
          <button
            type="button"
            aria-label={favorite ? `Remove ${mezcal.name} from favorites` : `Add ${mezcal.name} to favorites`}
            aria-pressed={favorite}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(mezcal.id);
            }}
            className={
              favorite
                ? "rounded-full p-1 text-red-400 transition-colors"
                : "rounded-full p-1 text-stone-400 transition-colors hover:text-red-400"
            }
          >
            <Heart aria-hidden="true" className={favorite ? "size-4 fill-current" : "size-4"} />
          </button>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-stone-400">Value:</span>
            <StarRating score={mezcal.evi} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-stone-400">Exp:</span>
            <StarRating score={mezcal.eei} />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className={market.className}>
            <MarketIcon aria-hidden="true" className="size-3" />
            {market.label}
          </span>
          <span className="text-xs text-stone-400">${mezcal.price}</span>
        </div>
      </div>
      <Link
        href={`${ss("/quadrant")}?bottle=${mezcal.id}`}
        aria-label={`See ${mezcal.name} in the Quadrant`}
        className="p-2 text-stone-400 opacity-0 transition-colors group-hover:opacity-100 hover:text-lime-400 focus-visible:opacity-100"
      >
        <ExternalLink aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

const RARITY_BADGE: Record<string, string> = {
  "Very Rare": "absolute top-4 right-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white",
  Rare: "absolute top-4 right-4 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-stone-950",
  Uncommon: "absolute top-4 right-4 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-stone-950",
  Common: "absolute top-4 right-4 rounded-full bg-stone-700/90 px-3 py-1 text-xs font-bold text-stone-200",
};

function difficultyClasses(difficulty: number) {
  if (difficulty >= 8)
    return { text: "text-xs font-bold text-red-400", bar: "h-full rounded-full bg-linear-to-r from-red-600 to-red-400 transition-all duration-500" };
  if (difficulty >= 6)
    return { text: "text-xs font-bold text-amber-400", bar: "h-full rounded-full bg-linear-to-r from-amber-600 to-amber-400 transition-all duration-500" };
  if (difficulty >= 4)
    return { text: "text-xs font-bold text-yellow-400", bar: "h-full rounded-full bg-linear-to-r from-yellow-600 to-yellow-400 transition-all duration-500" };
  return { text: "text-xs font-bold text-emerald-400", bar: "h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-all duration-500" };
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
  activeClassName,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  /** Full literal class string for the selected chip. */
  activeClassName: string;
}) {
  return (
    <div role="group" aria-label={label}>
      <span className="mb-2 block text-xs tracking-wider text-stone-400 uppercase">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
            className={
              selected === option
                ? activeClassName
                : "rounded-full bg-stone-800 px-3 py-1.5 text-sm text-stone-300 transition-all hover:bg-stone-700"
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgaveCard({
  agave,
  index,
  visible,
  expanded,
  onToggle,
  topBottles,
}: {
  agave: Agave;
  index: number;
  visible: boolean;
  expanded: boolean;
  onToggle: () => void;
  topBottles: Mezcal[];
}) {
  const hasBottles = topBottles.length > 0;
  const difficulty = difficultyClasses(agave.difficulty);

  return (
    <div
      data-id={agave.id}
      className={
        visible
          ? "group relative translate-y-0 overflow-hidden rounded-2xl border border-stone-800 opacity-100 transition-all duration-500 hover:border-lime-500/50"
          : "group relative translate-y-8 overflow-hidden rounded-2xl border border-stone-800 opacity-0 transition-all duration-500 hover:border-lime-500/50"
      }
      // Staggered entrance (runtime value).
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Image - clickable to expand */}
      <div className="relative h-72 cursor-pointer overflow-hidden" onClick={onToggle}>
        <Image
          src={agave.image}
          alt={`${agave.name} agave`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className={agave.color} />
        <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent" />

        {/* Rarity Badge */}
        <div className={RARITY_BADGE[agave.rarity]}>{agave.rarity}</div>

        {/* Best Bottles Badge */}
        {hasBottles && (
          <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-lime-500/90 px-3 py-1 text-xs font-bold text-stone-950">
            <Star aria-hidden="true" className="size-3 fill-current" />
            {topBottles.length} Top Picks
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="mb-1 font-mono text-xs tracking-wider text-lime-400">{agave.scientificName}</p>
        <h3
          className="mb-3 cursor-pointer font-serif text-2xl font-bold transition-colors group-hover:text-lime-400"
          onClick={onToggle}
        >
          {agave.name}
        </h3>

        {/* Quick Stats */}
        <div className="mb-4 flex items-center gap-4 text-sm text-stone-400">
          <span className="flex items-center gap-1">
            <Clock aria-hidden="true" className="size-4" />
            {agave.maturityYears} years
          </span>
          <span className="flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-4" />
            {agave.region.split(",")[0]}
          </span>
        </div>

        {/* Difficulty Score */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs tracking-wider text-stone-400 uppercase">Difficulty to Market</span>
            <span className={difficulty.text}>{agave.difficulty}/10</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-800">
            {/* Bar width is the agave's score (runtime value). */}
            <div className={difficulty.bar} style={{ width: `${agave.difficulty * 10}%` }} />
          </div>
          <p className="mt-1 text-xs text-stone-600 italic">{agave.difficultyReason}</p>
        </div>

        {/* Flavor Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {agave.flavorProfile.map((flavor) => (
            <span key={flavor} className="rounded bg-stone-800/50 px-2 py-1 text-xs text-stone-300">
              {flavor}
            </span>
          ))}
        </div>

        {/* Expanded Content */}
        <div
          id={`agave-${agave.id}-details`}
          className={
            expanded
              ? "max-h-150 overflow-hidden opacity-100 transition-all duration-500"
              : "max-h-0 overflow-hidden opacity-0 transition-all duration-500"
          }
        >
          <p className="mb-4 border-t border-stone-800 pt-4 text-sm leading-relaxed text-stone-300">
            {agave.description}
          </p>

          {/* Best Bottles Section */}
          {hasBottles && (
            <div className="border-t border-stone-800 pt-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-lime-400">
                <Star aria-hidden="true" className="size-4 fill-current" />
                Top {agave.name} Bottles to Hunt
              </h4>
              <div className="space-y-2">
                {topBottles.map((bottle, i) => (
                  <BestBottleCard key={bottle.id} mezcal={bottle} rank={i + 1} />
                ))}
              </div>
              <Link
                href={`${ss("/quadrant")}?agave=${encodeURIComponent(agave.name)}`}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-lime-500/30 py-2 text-sm text-lime-400 transition-colors hover:border-lime-500/50 hover:text-lime-300"
              >
                View all {agave.name} in Quadrant
                <ExternalLink aria-hidden="true" className="size-4" />
              </Link>
            </div>
          )}

          {!hasBottles && (
            <div className="border-t border-stone-800 pt-4">
              <p className="text-sm text-stone-400 italic">
                No bottles currently in our database for this agave. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Expand Indicator */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`agave-${agave.id}-details`}
          aria-label={expanded ? `Hide ${agave.name} details` : `Show ${agave.name} details`}
          className="mt-2 flex w-full cursor-pointer items-center justify-center"
          onClick={onToggle}
        >
          <Sparkles
            aria-hidden="true"
            className={expanded ? "size-4 rotate-180 text-lime-500 transition-transform" : "size-4 text-lime-500 transition-transform"}
          />
        </button>
      </div>
    </div>
  );
}

export function AgaveEncyclopedia() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [expandedAgave, setExpandedAgave] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const { language } = useLanguage();

  // Animate cards on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute("data-id") || "0");
            setVisibleCards((prev) => Array.from(new Set([...prev, id])));
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll("[data-id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selectedCategory, selectedRarity, selectedRegion]);

  const filteredAgaves = agaveData.filter((agave) => {
    const categoryMatch = selectedCategory === "All" || agave.flavorCategory === selectedCategory;
    const rarityMatch = selectedRarity === "All" || agave.rarity === selectedRarity;
    const regionMatch = selectedRegion === "All" || agave.region.includes(selectedRegion);
    return categoryMatch && rarityMatch && regionMatch;
  });

  const activeFilters = [selectedCategory, selectedRarity, selectedRegion].filter((f) => f !== "All").length;

  // Pre-compute top bottles for each agave
  const agaveBottles = useMemo(() => {
    const map: Record<string, Mezcal[]> = {};
    agaveData.forEach((agave) => {
      map[agave.name] = getTopBottlesForAgave(agave.name);
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Hero Section */}
      <section className="smoke-overlay mystical-mist relative h-[60vh] overflow-hidden">
        {/* Smoke Wisps Layer */}
        <div className="smoke-wisps" />
        <div className="absolute inset-0">
          <Image
            src={img.agaveField1.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Ethereal Glow */}
        <div className="ethereal-glow absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/60 via-stone-950/40 to-stone-950" />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16">
          <Button
            asChild
            variant="ghost"
            className="absolute top-6 left-6 text-stone-200 hover:bg-transparent hover:text-lime-400"
          >
            <Link href={ss("/")}>
              <ArrowLeft aria-hidden="true" className="mr-2 size-5" />
              {language === "es" ? "Volver" : "Back"}
            </Link>
          </Button>

          <div className="mx-auto max-w-4xl text-center">
            <p className="animate-fade-in mb-4 font-mono text-sm tracking-[0.3em] text-lime-400">
              {language === "es" ? "LA BIBLIOTECA VIVIENTE" : "THE LIVING LIBRARY"}
            </p>
            <h1 className="animate-fade-in mb-6 font-serif text-5xl font-bold md:text-7xl">
              {language === "es" ? "Enciclopedia del Agave" : "Agave Encyclopedia"}
            </h1>
            <p className="animate-fade-in mx-auto max-w-2xl text-xl text-stone-300">
              {language === "es"
                ? "15 especies. Siglos de tradición. Cada planta un universo de sabor—con las mejores botellas para probarlo."
                : "15 species. Centuries of tradition. Each plant a universe of flavor—with the best bottles to prove it."}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/95 py-4 backdrop-blur-sm">
        <div className="container">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-stone-300 transition-colors hover:text-lime-400"
            >
              <Filter aria-hidden="true" className="size-5" />
              <span>{language === "es" ? "Filtros" : "Filters"}</span>
              {activeFilters > 0 && (
                <span className="rounded-full bg-lime-500 px-2 py-0.5 text-xs font-bold text-stone-950">
                  {activeFilters}
                </span>
              )}
              <ChevronDown
                aria-hidden="true"
                className={showFilters ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"}
              />
            </button>

            <p className="text-sm text-stone-400">
              {filteredAgaves.length}{" "}
              {filteredAgaves.length === 1
                ? language === "es"
                  ? "variedad"
                  : "variety"
                : language === "es"
                  ? "variedades"
                  : "varieties"}
            </p>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="animate-fade-in mx-auto mt-6 grid max-w-7xl gap-6 md:grid-cols-3">
              <FilterGroup
                label={language === "es" ? "Perfil de Sabor" : "Flavor Profile"}
                options={flavorCategories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                activeClassName="rounded-full bg-lime-500 px-3 py-1.5 text-sm font-medium text-stone-950 transition-all"
              />
              <FilterGroup
                label={language === "es" ? "Rareza" : "Rarity"}
                options={rarityLevels}
                selected={selectedRarity}
                onSelect={setSelectedRarity}
                activeClassName="rounded-full bg-amber-500 px-3 py-1.5 text-sm font-medium text-stone-950 transition-all"
              />
              <FilterGroup
                label={language === "es" ? "Región" : "Region"}
                options={regions}
                selected={selectedRegion}
                onSelect={setSelectedRegion}
                activeClassName="rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-medium text-stone-950 transition-all"
              />
            </div>
          )}
        </div>
      </section>

      {/* Agave Grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgaves.map((agave, index) => (
              <AgaveCard
                key={agave.id}
                agave={agave}
                index={index}
                visible={visibleCards.includes(agave.id)}
                expanded={expandedAgave === agave.id}
                onToggle={() => setExpandedAgave(expandedAgave === agave.id ? null : agave.id)}
                topBottles={agaveBottles[agave.name] || []}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAgaves.length === 0 && (
            <div className="py-20 text-center">
              <p className="mb-4 text-lg text-stone-400">No agaves match your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedRarity("All");
                  setSelectedRegion("All");
                }}
                className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-stone-950"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-stone-900/50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold">Ready to taste the difference?</h2>
          <p className="mb-8 text-stone-300">Now that you know the plants, discover the bottles that honor them.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild className="bg-lime-500 px-8 py-6 text-lg text-stone-950 hover:bg-lime-400">
              <Link href={ss("/quadrant")} className="inline-flex items-center gap-1.5">
                Explore the Quadrant
                <ArrowRight aria-hidden="true" className="size-[1em]" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-stone-600 px-8 py-6 text-lg text-stone-200 hover:bg-stone-800"
            >
              <Link href={ss("/us-hunt")}>The US Hunt</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-stone-600 px-8 py-6 text-lg text-stone-200 hover:bg-stone-800"
            >
              <Link href={ss("/mexico-source")}>Mexico Source</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
