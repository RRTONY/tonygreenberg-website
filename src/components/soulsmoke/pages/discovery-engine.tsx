"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  Globe,
  Heart,
  Mountain,
  Package,
  Search,
  Sparkles,
  Timer,
  UtensilsCrossed,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useFavorites, useLanguage, useViewMode } from "@/components/soulsmoke/soulsmoke-providers";
import { WantBottleModal } from "@/components/soulsmoke/want-bottle-modal";
import {
  getAllEnrichedMezcals,
  getAllFoodPairingCategories,
  type MezcalEnriched,
} from "@/lib/content/soulsmoke/mezcal-enriched";
import {
  getQPRBreakdown,
  getQPRLabel,
  getRarityLabel,
  getTimeToGlassLabel,
} from "@/lib/content/soulsmoke/qpr-engine";

// Ported from the SoulSmoke app's client/src/pages/DiscoveryEngine.tsx. Same filters, sorting,
// cards and copy (EN/ES). Changes: emoji used as icons are lucide icons; the QPR colors are
// precomposed classes (one literal string per QPR band) instead of inline styles; the filter
// panel stacks above the results below 1024px (on live it sat beside them and pushed the cards
// off-screen at 375px, rule 20). The unused QPRBadge helper was not carried over.

interface Filters {
  search: string;
  priceMin: number;
  priceMax: number;
  qprMin: number;
  qprMax: number;
  eviMin: number;
  eviMax: number;
  eeiMin: number;
  eeiMax: number;
  availability: string[];
  timeToGlass: string[];
  rarity: string[];
  repeatability: string[];
  method: string[];
  market: string[];
  agave: string[];
  foodPairings: string[];
  complexityMin: number;
  complexityMax: number;
  sortBy: SortOption;
  sortDir: "asc" | "desc";
}

type SortOption = "qpr" | "price" | "evi" | "eei" | "name" | "rarity" | "availability";

const defaultFilters: Filters = {
  search: "",
  priceMin: 0,
  priceMax: 500,
  qprMin: 0,
  qprMax: 10,
  eviMin: 0,
  eviMax: 10,
  eeiMin: 0,
  eeiMax: 10,
  availability: [],
  timeToGlass: [],
  rarity: [],
  repeatability: [],
  method: [],
  market: [],
  agave: [],
  foodPairings: [],
  complexityMin: 0,
  complexityMax: 10,
  sortBy: "qpr",
  sortDir: "desc",
};

const t = {
  en: {
    title: "Discovery Engine",
    subtitle: "Find your perfect mezcal across every dimension that matters",
    results: "results",
    noResults: "No bottles match your criteria. Try loosening some filters.",
    resetAll: "Reset All Filters",
    search: "Search by name, brand, or agave...",
    filters: "Filters",
    sort: "Sort By",
    price: "Price",
    qpr: "QPR Index",
    evi: "Value Index (EVI)",
    eei: "Experience Index (EEI)",
    complexity: "Complexity",
    availability: "Availability",
    timeToGlass: "Time to Glass",
    rarity: "Rarity",
    repeatability: "Repeatability",
    method: "Production Method",
    market: "Market",
    agave: "Agave Type",
    foodPairings: "Food Pairings",
    showMore: "Show more",
    showLess: "Show less",
    activeFilters: "active filters",
    clearFilter: "Clear",
    viewDetails: "View Details",
    addToHunt: "Add to Hunt List",
    removeFromHunt: "Remove from Hunt List",
    sortOptions: {
      qpr: "QPR Score",
      price: "Price",
      evi: "Value Index",
      eei: "Experience Index",
      name: "Name",
      rarity: "Rarity",
      availability: "Availability",
    },
  },
  es: {
    title: "Motor de Descubrimiento",
    subtitle: "Encuentra tu mezcal perfecto en cada dimensión que importa",
    results: "resultados",
    noResults: "Ninguna botella coincide con tus criterios. Intenta aflojar algunos filtros.",
    resetAll: "Restablecer Todos los Filtros",
    search: "Buscar por nombre, marca o agave...",
    filters: "Filtros",
    sort: "Ordenar Por",
    price: "Precio",
    qpr: "Índice QPR",
    evi: "Índice de Valor (EVI)",
    eei: "Índice de Experiencia (EEI)",
    complexity: "Complejidad",
    availability: "Disponibilidad",
    timeToGlass: "Tiempo al Vaso",
    rarity: "Rareza",
    repeatability: "Repetibilidad",
    method: "Método de Producción",
    market: "Mercado",
    agave: "Tipo de Agave",
    foodPairings: "Maridaje",
    showMore: "Mostrar más",
    showLess: "Mostrar menos",
    activeFilters: "filtros activos",
    clearFilter: "Limpiar",
    viewDetails: "Ver Detalles",
    addToHunt: "Agregar a Lista",
    removeFromHunt: "Quitar de Lista",
    sortOptions: {
      qpr: "Puntuación QPR",
      price: "Precio",
      evi: "Índice de Valor",
      eei: "Índice de Experiencia",
      name: "Nombre",
      rarity: "Rareza",
      availability: "Disponibilidad",
    },
  },
};

// One full class string per QPR band color (getQPRLabel's five colors), so Tailwind sees them.
const QPR_CLASSES: Record<string, { ring: string; bar: string; strip: string }> = {
  "#22c55e": { ring: "border-[#22c55e] text-[#22c55e]", bar: "bg-[#22c55e]", strip: "bg-[#22c55e10] text-[#22c55e]" },
  "#84cc16": { ring: "border-[#84cc16] text-[#84cc16]", bar: "bg-[#84cc16]", strip: "bg-[#84cc1610] text-[#84cc16]" },
  "#eab308": { ring: "border-[#eab308] text-[#eab308]", bar: "bg-[#eab308]", strip: "bg-[#eab30810] text-[#eab308]" },
  "#f97316": { ring: "border-[#f97316] text-[#f97316]", bar: "bg-[#f97316]", strip: "bg-[#f9731610] text-[#f97316]" },
  "#ef4444": { ring: "border-[#ef4444] text-[#ef4444]", bar: "bg-[#ef4444]", strip: "bg-[#ef444410] text-[#ef4444]" },
};

function qprClasses(value: number) {
  return QPR_CLASSES[getQPRLabel(value).color] ?? QPR_CLASSES["#ef4444"];
}

type Option = { value: string; label: string; icon?: LucideIcon };

function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  label,
  prefix = "",
  suffix = "",
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {prefix}
          {valueMin}
          {suffix} – {prefix}
          {valueMax}
          {suffix}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          aria-label={`${label} min`}
          min={min}
          max={max}
          step={max <= 10 ? 0.5 : 10}
          value={valueMin}
          onChange={(e) => onChange(Math.min(Number(e.target.value), valueMax), valueMax)}
          className="h-1.5 w-full accent-lime-500"
        />
        <input
          type="range"
          aria-label={`${label} max`}
          min={min}
          max={max}
          step={max <= 10 ? 0.5 : 10}
          value={valueMax}
          onChange={(e) => onChange(valueMin, Math.max(Number(e.target.value), valueMin))}
          className="h-1.5 w-full accent-lime-500"
        />
      </div>
    </div>
  );
}

function MultiSelect({
  options,
  selected,
  onChange,
  label,
}: {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleOptions = expanded ? options : options.slice(0, 6);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {visibleOptions.map((opt) => {
          const Icon = opt.icon;
          const isOn = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isOn}
              onClick={() => {
                if (isOn) {
                  onChange(selected.filter((s) => s !== opt.value));
                } else {
                  onChange([...selected, opt.value]);
                }
              }}
              className={
                isOn
                  ? "inline-flex items-center gap-1 rounded-full border border-lime-500 bg-lime-500 px-2.5 py-1 text-xs font-semibold text-black transition-all"
                  : "inline-flex items-center gap-1 rounded-full border border-border bg-transparent px-2.5 py-1 text-xs text-muted-foreground transition-all hover:border-lime-500/50 hover:text-foreground"
              }
            >
              {Icon && <Icon aria-hidden="true" className="size-3" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      {options.length > 6 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs text-lime-500 transition-colors hover:text-lime-400"
        >
          {expanded ? (
            <>
              <ChevronUp aria-hidden="true" className="size-3" /> Show less
            </>
          ) : (
            <>
              <ChevronDown aria-hidden="true" className="size-3" /> +{options.length - 6} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

function BottleCard({
  bottle,
  allBottles,
  labels,
}: {
  bottle: MezcalEnriched;
  allBottles: MezcalEnriched[];
  labels: (typeof t)["en"];
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showWantModal, setShowWantModal] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(bottle.id);
  const breakdown = getQPRBreakdown(bottle, allBottles, "us");
  const rarityInfo = getRarityLabel(bottle.rarity);
  const qprInfo = getQPRLabel(bottle.qpr);
  const qprClass = qprClasses(bottle.qpr);
  const closeWantModal = useCallback(() => setShowWantModal(false), []);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-lime-500/40">
      {/* QPR Badge - top right */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className={`flex size-11 items-center justify-center rounded-full border-2 bg-black/60 text-sm font-bold backdrop-blur-sm ${qprClass.ring}`}
        >
          {bottle.qpr.toFixed(1)}
        </div>
      </div>

      {/* Favorite button - top left */}
      <button
        type="button"
        onClick={() => toggleFavorite(bottle.id)}
        aria-label={isFavorite ? labels.removeFromHunt : labels.addToHunt}
        aria-pressed={isFavorite}
        className="absolute top-3 left-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110"
      >
        {isFavorite ? (
          <Heart aria-hidden="true" className="size-4 fill-red-500 text-red-500" />
        ) : (
          <Heart aria-hidden="true" className="size-4 text-white/50" />
        )}
      </button>

      {/* Card Content */}
      <div className="p-5 pt-14">
        <div className="mb-3">
          <h3 className="text-lg leading-tight font-bold text-foreground">{bottle.brand}</h3>
          <p className="text-sm text-muted-foreground">{bottle.name}</p>
        </div>

        {/* Key Metrics Row */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted/30 p-2 text-center">
            <div className="text-xs text-muted-foreground">EVI</div>
            <div className="text-sm font-bold text-foreground">{bottle.evi}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2 text-center">
            <div className="text-xs text-muted-foreground">EEI</div>
            <div className="text-sm font-bold text-foreground">{bottle.eei}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2 text-center">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="text-sm font-bold text-foreground">${bottle.price}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          <span className="rounded-full border border-lime-500/20 bg-lime-500/10 px-2 py-0.5 text-[10px] text-lime-500">
            {bottle.agave}
          </span>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-500">
            {bottle.method}
          </span>
          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-400">
            {rarityInfo.icon} {rarityInfo.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
            <Timer aria-hidden="true" className="size-2.5" /> {getTimeToGlassLabel(bottle.timeToGlass)}
          </span>
        </div>

        {/* Food Pairings */}
        {bottle.foodPairings.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {bottle.foodPairings.slice(0, 3).map((fp) => (
              <span
                key={fp.category}
                className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-400"
              >
                <UtensilsCrossed aria-hidden="true" className="size-2.5" /> {fp.category}
              </span>
            ))}
            {bottle.foodPairings.length > 3 && (
              <span className="rounded-full bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                +{bottle.foodPairings.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Expand/Collapse Details */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
          className="inline-flex w-full items-center justify-center gap-1 py-1 text-xs text-lime-500 transition-colors hover:text-lime-400"
        >
          {showDetails ? (
            <>
              <ChevronUp aria-hidden="true" className="size-3" /> Hide QPR Breakdown
            </>
          ) : (
            <>
              <ChevronDown aria-hidden="true" className="size-3" /> Show QPR Breakdown
            </>
          )}
        </button>

        {/* Rendered always (hidden when closed) so the tasting notes are in the server HTML. */}
        <div className={showDetails ? "mt-3 space-y-2 border-t border-border pt-3" : "hidden"}>
          {[
            { label: "Experience", value: breakdown.experience, weight: "35%" },
            { label: "Price Fairness", value: breakdown.priceFairness, weight: "25%" },
            { label: "Availability", value: breakdown.availability, weight: "15%" },
            { label: "Integrity", value: breakdown.integrity, weight: "15%" },
            { label: "Repeatability", value: breakdown.repeatability, weight: "10%" },
          ].map((comp) => (
            <div key={comp.label}>
              <div className="mb-0.5 flex justify-between text-[10px]">
                <span className="text-muted-foreground">
                  {comp.label} ({comp.weight})
                </span>
                <span className="font-medium text-foreground">{comp.value.toFixed(1)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${qprClasses(comp.value).bar}`}
                  // Bar length is the score (runtime value).
                  style={{ width: `${(comp.value / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}

          <p className="mt-2 text-xs text-muted-foreground italic">&quot;{bottle.tastingNotes}&quot;</p>

          {bottle.whereToBuy && bottle.whereToBuy.length > 0 && (
            <div className="mt-2 flex gap-2">
              {bottle.whereToBuy.slice(0, 2).map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded bg-lime-500/10 px-2 py-1 text-[10px] text-lime-500 transition-colors hover:bg-lime-500/20"
                >
                  Buy <ArrowRight aria-hidden="true" className="size-[1em]" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* I Want This Bottle Button */}
      <div className="px-5 pb-3">
        <button
          type="button"
          onClick={() => setShowWantModal(true)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-bold text-amber-500 transition-all hover:bg-amber-500/20"
        >
          <Wine aria-hidden="true" className="size-3.5" /> I Want This Bottle
        </button>
      </div>

      {/* Bottom QPR Label Bar */}
      <div className={`border-t border-border px-5 py-2 text-center text-[10px] font-semibold ${qprClass.strip}`}>
        {qprInfo.label} — {qprInfo.description}
      </div>

      <WantBottleModal
        isOpen={showWantModal}
        onClose={closeWantModal}
        bottleId={bottle.id}
        bottleName={`${bottle.brand} ${bottle.name}`}
      />
    </div>
  );
}

export function DiscoveryEngine() {
  const { language } = useLanguage();
  const { mode } = useViewMode();
  const labels = t[language] || t.en;
  const allBottles = useMemo(() => getAllEnrichedMezcals(), []);
  const allFoodCategories = useMemo(() => getAllFoodPairingCategories(), []);

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);

  const uniqueAgaves = useMemo(() => Array.from(new Set(allBottles.map((b) => b.agave))).sort(), [allBottles]);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priceMin > 0 || filters.priceMax < 500) count++;
    if (filters.qprMin > 0 || filters.qprMax < 10) count++;
    if (filters.eviMin > 0 || filters.eviMax < 10) count++;
    if (filters.eeiMin > 0 || filters.eeiMax < 10) count++;
    if (filters.complexityMin > 0 || filters.complexityMax < 10) count++;
    if (filters.availability.length) count++;
    if (filters.timeToGlass.length) count++;
    if (filters.rarity.length) count++;
    if (filters.repeatability.length) count++;
    if (filters.method.length) count++;
    if (filters.market.length) count++;
    if (filters.agave.length) count++;
    if (filters.foodPairings.length) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let results = [...allBottles];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.brand.toLowerCase().includes(q) ||
          b.agave.toLowerCase().includes(q) ||
          b.producer.toLowerCase().includes(q) ||
          b.region.toLowerCase().includes(q),
      );
    }

    results = results.filter((b) => b.price >= filters.priceMin && b.price <= filters.priceMax);
    results = results.filter((b) => b.qpr >= filters.qprMin && b.qpr <= filters.qprMax);
    results = results.filter((b) => b.evi >= filters.eviMin && b.evi <= filters.eviMax);
    results = results.filter((b) => b.eei >= filters.eeiMin && b.eei <= filters.eeiMax);
    results = results.filter(
      (b) => b.flavor.complexity >= filters.complexityMin && b.flavor.complexity <= filters.complexityMax,
    );

    if (filters.availability.length) results = results.filter((b) => filters.availability.includes(b.availability));
    if (filters.timeToGlass.length) results = results.filter((b) => filters.timeToGlass.includes(b.timeToGlass));
    if (filters.rarity.length) results = results.filter((b) => filters.rarity.includes(b.rarity));
    if (filters.repeatability.length) results = results.filter((b) => filters.repeatability.includes(b.repeatability));
    if (filters.method.length) results = results.filter((b) => filters.method.includes(b.method));
    if (filters.market.length) results = results.filter((b) => filters.market.includes(b.market));
    if (filters.agave.length) results = results.filter((b) => filters.agave.includes(b.agave));
    if (filters.foodPairings.length) {
      results = results.filter((b) => b.foodPairings.some((fp) => filters.foodPairings.includes(fp.category)));
    }

    const dir = filters.sortDir === "asc" ? 1 : -1;
    const rarityOrder: Record<string, number> = { common: 1, uncommon: 2, rare: 3, "very-rare": 4, legendary: 5 };
    const availOrder: Record<string, number> = { easy: 1, moderate: 2, hard: 3, rare: 4, unicorn: 5 };
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case "qpr":
          return (a.qpr - b.qpr) * dir;
        case "price":
          return (a.price - b.price) * dir;
        case "evi":
          return (a.evi - b.evi) * dir;
        case "eei":
          return (a.eei - b.eei) * dir;
        case "name":
          return a.brand.localeCompare(b.brand) * dir;
        case "rarity":
          return ((rarityOrder[a.rarity] ?? 0) - (rarityOrder[b.rarity] ?? 0)) * dir;
        case "availability":
          return ((availOrder[a.availability] ?? 0) - (availOrder[b.availability] ?? 0)) * dir;
        default:
          return 0;
      }
    });

    return results;
  }, [allBottles, filters]);

  const isAficionado = mode === "aficionado";

  return (
    <div className={isAficionado ? "min-h-screen bg-white text-zinc-900" : "min-h-screen bg-zinc-950 text-white"}>
      {/* Hero */}
      <div
        className={
          isAficionado ? "relative bg-stone-100 px-4 py-16" : "relative bg-linear-to-b from-zinc-900 to-zinc-950 px-4 py-16"
        }
      >
        <div className="mx-auto max-w-7xl text-center">
          <h1
            className={
              isAficionado
                ? "mb-4 font-sans text-4xl font-bold text-zinc-900 md:text-5xl"
                : "mb-4 font-display text-4xl font-bold text-white md:text-5xl"
            }
          >
            {labels.title}
          </h1>
          <p className={isAficionado ? "mx-auto max-w-2xl text-lg text-zinc-600" : "mx-auto max-w-2xl text-lg text-zinc-400"}>
            {labels.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                aria-label={labels.search}
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder={labels.search}
                className={
                  isAficionado
                    ? "w-full rounded-xl border border-stone-300 bg-white px-5 py-3.5 pr-11 text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-lime-500/50 focus:outline-none"
                    : "w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-3.5 pr-11 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-lime-500/50 focus:outline-none"
                }
              />
              <Search aria-hidden="true" className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Result Count & Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className={isAficionado ? "text-sm text-zinc-600" : "text-sm text-zinc-400"}>
              <strong className={isAficionado ? "text-zinc-900" : "text-white"}>{filtered.length}</strong> {labels.results}
              {activeFilterCount > 0 && (
                <span className="ml-2 text-lime-500">
                  ({activeFilterCount} {labels.activeFilters})
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={
                showFilters
                  ? "inline-flex items-center gap-1 rounded-full border border-lime-500 bg-lime-500 px-4 py-1.5 text-xs text-black transition-colors"
                  : isAficionado
                    ? "inline-flex items-center gap-1 rounded-full border border-stone-300 px-4 py-1.5 text-xs text-zinc-600 transition-colors hover:border-lime-500"
                    : "inline-flex items-center gap-1 rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-lime-500"
              }
            >
              {labels.filters}
              {showFilters ? (
                <ChevronUp aria-hidden="true" className="size-3" />
              ) : (
                <ChevronDown aria-hidden="true" className="size-3" />
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-red-500/30 px-4 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
              >
                {labels.resetAll}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter Sidebar */}
          {showFilters && (
            <div
              className={
                isAficionado
                  ? "h-fit w-full shrink-0 space-y-6 rounded-xl border border-stone-200 bg-stone-50 p-5 lg:sticky lg:top-24 lg:w-72"
                  : "h-fit w-full shrink-0 space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 lg:sticky lg:top-24 lg:w-72"
              }
            >
              {/* Sort */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">{labels.sort}</span>
                <div className="flex gap-1">
                  <select
                    aria-label={labels.sort}
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value as SortOption)}
                    className={
                      isAficionado
                        ? "flex-1 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-xs text-zinc-900"
                        : "flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white"
                    }
                  >
                    {(Object.keys(labels.sortOptions) as SortOption[]).map((key) => (
                      <option key={key} value={key}>
                        {labels.sortOptions[key]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    aria-label={filters.sortDir === "asc" ? "Ascending" : "Descending"}
                    onClick={() => updateFilter("sortDir", filters.sortDir === "asc" ? "desc" : "asc")}
                    className={
                      isAficionado
                        ? "rounded-lg border border-stone-300 px-2 py-1.5 text-xs text-zinc-600"
                        : "rounded-lg border border-zinc-700 px-2 py-1.5 text-xs text-zinc-400"
                    }
                  >
                    {filters.sortDir === "asc" ? (
                      <ArrowUp aria-hidden="true" className="size-3.5" />
                    ) : (
                      <ArrowDown aria-hidden="true" className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <RangeSlider
                min={0}
                max={500}
                valueMin={filters.priceMin}
                valueMax={filters.priceMax}
                onChange={(min, max) => {
                  updateFilter("priceMin", min);
                  updateFilter("priceMax", max);
                }}
                label={labels.price}
                prefix="$"
              />
              <RangeSlider
                min={0}
                max={10}
                valueMin={filters.qprMin}
                valueMax={filters.qprMax}
                onChange={(min, max) => {
                  updateFilter("qprMin", min);
                  updateFilter("qprMax", max);
                }}
                label={labels.qpr}
              />
              <RangeSlider
                min={0}
                max={10}
                valueMin={filters.eviMin}
                valueMax={filters.eviMax}
                onChange={(min, max) => {
                  updateFilter("eviMin", min);
                  updateFilter("eviMax", max);
                }}
                label={labels.evi}
              />
              <RangeSlider
                min={0}
                max={10}
                valueMin={filters.eeiMin}
                valueMax={filters.eeiMax}
                onChange={(min, max) => {
                  updateFilter("eeiMin", min);
                  updateFilter("eeiMax", max);
                }}
                label={labels.eei}
              />
              <RangeSlider
                min={0}
                max={10}
                valueMin={filters.complexityMin}
                valueMax={filters.complexityMax}
                onChange={(min, max) => {
                  updateFilter("complexityMin", min);
                  updateFilter("complexityMax", max);
                }}
                label={labels.complexity}
              />

              <MultiSelect
                label={labels.availability}
                options={[
                  { value: "easy", label: "Easy" },
                  { value: "moderate", label: "Moderate" },
                  { value: "hard", label: "Hard" },
                  { value: "rare", label: "Rare" },
                  { value: "unicorn", label: "Unicorn", icon: Sparkles },
                ]}
                selected={filters.availability}
                onChange={(v) => updateFilter("availability", v)}
              />
              <MultiSelect
                label={labels.timeToGlass}
                options={[
                  { value: "same-day", label: "Same Day", icon: Zap },
                  { value: "1-2-weeks", label: "1-2 Weeks", icon: Package },
                  { value: "1-3-months", label: "1-3 Months", icon: Clock },
                  { value: "3-plus-months", label: "3+ Months", icon: Mountain },
                ]}
                selected={filters.timeToGlass}
                onChange={(v) => updateFilter("timeToGlass", v)}
              />
              <MultiSelect
                label={labels.rarity}
                options={[
                  { value: "common", label: "● Common" },
                  { value: "uncommon", label: "◆ Uncommon" },
                  { value: "rare", label: "★ Rare" },
                  { value: "very-rare", label: "✦ Very Rare" },
                  { value: "legendary", label: "♛ Legendary" },
                ]}
                selected={filters.rarity}
                onChange={(v) => updateFilter("rarity", v)}
              />
              <MultiSelect
                label={labels.repeatability}
                options={[
                  { value: "continuous", label: "Continuous" },
                  { value: "seasonal", label: "Seasonal" },
                  { value: "batch", label: "Batch" },
                  { value: "one-off", label: "One-Off" },
                  { value: "extinct", label: "Extinct" },
                ]}
                selected={filters.repeatability}
                onChange={(v) => updateFilter("repeatability", v)}
              />
              <MultiSelect
                label={labels.method}
                options={[
                  { value: "ancestral", label: "Ancestral" },
                  { value: "artisanal", label: "Artisanal" },
                  { value: "industrial", label: "Industrial" },
                ]}
                selected={filters.method}
                onChange={(v) => updateFilter("method", v)}
              />
              <MultiSelect
                label={labels.market}
                options={[
                  { value: "us", label: "US", icon: Flag },
                  { value: "mexico", label: "Mexico", icon: Flag },
                  { value: "both", label: "Both", icon: Globe },
                ]}
                selected={filters.market}
                onChange={(v) => updateFilter("market", v)}
              />
              <MultiSelect
                label={labels.agave}
                options={uniqueAgaves.map((a) => ({ value: a, label: a }))}
                selected={filters.agave}
                onChange={(v) => updateFilter("agave", v)}
              />
              <MultiSelect
                label={labels.foodPairings}
                options={allFoodCategories.map((c) => ({ value: c, label: c }))}
                selected={filters.foodPairings}
                onChange={(v) => updateFilter("foodPairings", v)}
              />
            </div>
          )}

          {/* Results Grid */}
          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="mb-4 text-xl text-muted-foreground">{labels.noResults}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg bg-lime-500 px-6 py-2 font-semibold text-black transition-colors hover:bg-lime-400"
                >
                  {labels.resetAll}
                </button>
              </div>
            ) : (
              <div
                className={
                  showFilters
                    ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                    : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }
              >
                {filtered.map((bottle) => (
                  <BottleCard key={bottle.id} bottle={bottle} allBottles={allBottles} labels={labels} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
