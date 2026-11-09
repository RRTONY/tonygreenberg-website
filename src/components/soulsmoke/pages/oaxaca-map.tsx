"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Factory, Utensils, Wine, X, type LucideIcon } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/OaxacaMap.tsx (2026-11-10). Same copy (the
// app had English only on this page), regions, places, filters and detail card. The app's
// Google map went through the old host's proxy; here it is an OpenStreetMap embed centered on
// Oaxaca, re-centered (with a marker) on the chosen region or place. An embed has no clickable
// markers, so the places the app showed as markers are listed under the filter buttons (the
// filter now picks which places are listed). Marker emoji are lucide icons (CONTRIBUTING rule 18).

// Oaxaca mezcal regions with their characteristics
const mezcalRegions = [
  {
    id: 'valles-centrales',
    name: 'Valles Centrales',
    description: 'The heartland of mezcal production. Home to the most famous villages like Santiago Matatlán, San Dionisio Ocotepec, and Santa Catarina Minas.',
    terroir: 'Mineral-rich soils, moderate elevation (1,500-1,800m), hot days and cool nights. Produces balanced, approachable mezcals.',
    center: { lat: 16.85, lng: -96.45 },
    color: '#D97706',
    agaves: ['Espadín', 'Tobalá', 'Madrecuishe', 'Arroqueño'],
  },
  {
    id: 'sierra-norte',
    name: 'Sierra Norte',
    description: 'High mountain villages like Santa María Ixcatlán and San Pedro Cajonos. Remote, traditional, and fiercely independent.',
    terroir: 'High altitude (2,000-2,800m), pine forests, volcanic soils. Produces complex, mineral-driven mezcals with pronounced herbal notes.',
    center: { lat: 17.45, lng: -96.35 },
    color: '#059669',
    agaves: ['Tobalá', 'Arroqueño', 'Cuishe', 'Tepeztate'],
  },
  {
    id: 'sierra-sur',
    name: 'Sierra Sur',
    description: 'Southern highlands including Miahuatlán and Ejutla. Known for wild agaves and ancestral production methods.',
    terroir: 'Steep hillsides, diverse microclimates, limestone and clay soils. Produces funky, wild mezcals with intense character.',
    center: { lat: 16.35, lng: -96.60 },
    color: '#7C3AED',
    agaves: ['Cuishe', 'Mexicano', 'Bicuishe', 'Coyote'],
  },
  {
    id: 'costa',
    name: 'Costa',
    description: 'Coastal lowlands near the Pacific. Hot, humid, and home to unique agave varieties not found elsewhere.',
    terroir: 'Low elevation, tropical climate, sandy soils. Produces fruit-forward, tropical mezcals with softer smoke.',
    center: { lat: 15.85, lng: -97.05 },
    color: '#0891B2',
    agaves: ['Rhodacantha', 'Cupreata', 'Papalote'],
  },
  {
    id: 'mixteca',
    name: 'Mixteca',
    description: 'Northwestern Oaxaca, bordering Puebla. Ancient mezcal traditions predating Spanish contact.',
    terroir: 'Arid highlands, extreme temperature swings, poor soils. Produces austere, mineral mezcals with long finishes.',
    center: { lat: 17.55, lng: -97.75 },
    color: '#DC2626',
    agaves: ['Papalote', 'Tobalá', 'Arroqueño'],
  },
];

// Notable palenques and producers
const palenques = [
  {
    id: 'real-minero',
    name: 'Real Minero',
    producer: 'Familia Ángeles',
    location: 'Santa Catarina Minas',
    position: { lat: 16.8667, lng: -96.5833 },
    region: 'valles-centrales',
    description: 'The legendary Ángeles family. Graciela Ángeles Carreño leads one of the most respected operations in all of mezcal.',
    visitInfo: 'By appointment only. Contact through official channels.',
    specialty: 'Pechuga, Minero, clay pot distillation',
  },
  {
    id: 'lalocura',
    name: 'Lalocura',
    producer: 'Eduardo "Lalo" Ángeles',
    location: 'Santa Catarina Minas',
    position: { lat: 16.8645, lng: -96.5812 },
    region: 'valles-centrales',
    description: 'Lalo\'s experimental approach pushes boundaries while honoring tradition. Wild fermentation, rare agaves.',
    visitInfo: 'Very limited visits. Relationship required.',
    specialty: 'Wild agaves, experimental batches',
  },
  {
    id: 'fane-kantsini',
    name: 'Fane Kantsini',
    producer: 'Erick Rodríguez',
    location: 'San Miguel Suchiltepec',
    position: { lat: 16.2833, lng: -96.4667 },
    region: 'sierra-sur',
    description: 'Perhaps the most exclusive mezcal in the world. Erick\'s tiny batches are legendary among collectors.',
    visitInfo: 'Extremely difficult. Must build relationship over years.',
    specialty: 'Micro-batches, wild agaves, ancestral methods',
  },
  {
    id: '5-sentidos',
    name: '5 Sentidos Collective',
    producer: 'Various Mezcaleros',
    location: 'Multiple Villages',
    position: { lat: 16.75, lng: -96.55 },
    region: 'valles-centrales',
    description: 'A collective representing small-scale producers across Oaxaca. Each batch tells a different story.',
    visitInfo: 'Contact PM Spirits for producer introductions.',
    specialty: 'Community model, diverse expressions',
  },
  {
    id: 'del-maguey-chichicapa',
    name: 'Del Maguey - Chichicapa',
    producer: 'Faustino García Vásquez',
    location: 'San Baltazar Chichicapa',
    position: { lat: 16.7833, lng: -96.6167 },
    region: 'valles-centrales',
    description: 'The village that put single-village mezcal on the map. Faustino\'s family has made mezcal for generations.',
    visitInfo: 'Tours available through Del Maguey.',
    specialty: 'Classic Oaxacan style, mineral finish',
  },
];

// Recommended mezcalerias in Oaxaca City
const mezcalerias = [
  {
    id: 'mezcalogia',
    name: 'Mezcalogía',
    type: 'mezcaleria',
    position: { lat: 17.0614, lng: -96.7256 },
    address: 'Reforma 506, Centro',
    description: 'The temple of mezcal education. Silvia Philion\'s legendary bar offers flights and deep knowledge.',
    mustTry: 'Ask for the rare agave flight',
    hours: 'Mon-Sat 1pm-11pm',
  },
  {
    id: 'in-situ',
    name: 'In Situ',
    type: 'mezcaleria',
    position: { lat: 17.0628, lng: -96.7248 },
    address: 'Morelos 511, Centro',
    description: 'Ulises Torrentera\'s iconic bar. The godfather of mezcal appreciation in Oaxaca.',
    mustTry: 'Whatever Ulises recommends',
    hours: 'Daily 2pm-2am',
  },
  {
    id: 'la-mezcalerita',
    name: 'La Mezcalerita',
    type: 'mezcaleria',
    position: { lat: 17.0589, lng: -96.7234 },
    address: 'Mina 302, Centro',
    description: 'Intimate neighborhood bar with excellent selection and knowledgeable staff.',
    mustTry: 'Local producer specials',
    hours: 'Tue-Sun 6pm-1am',
  },
];

// Recommended restaurants
const restaurants = [
  {
    id: 'origen',
    name: 'Origen',
    type: 'restaurant',
    position: { lat: 17.0622, lng: -96.7201 },
    address: 'Hidalgo 820, Centro',
    description: 'Chef Rodolfo Castellanos\' temple to Oaxacan cuisine. Mezcal pairings available.',
    mustTry: 'Tasting menu with mezcal pairing',
    priceRange: '$$$$',
  },
  {
    id: 'los-danzantes',
    name: 'Los Danzantes',
    type: 'restaurant',
    position: { lat: 17.0631, lng: -96.7245 },
    address: 'Macedonio Alcalá 403, Centro',
    description: 'Beautiful courtyard setting. Excellent mezcal selection and contemporary Oaxacan food.',
    mustTry: 'Mezcal cocktails and mole negro',
    priceRange: '$$$',
  },
  {
    id: 'criollo',
    name: 'Criollo',
    type: 'restaurant',
    position: { lat: 17.0598, lng: -96.7189 },
    address: 'Libres 212, Centro',
    description: 'Farm-to-table Oaxacan cuisine. Thoughtful mezcal list.',
    mustTry: 'Seasonal tasting menu',
    priceRange: '$$$',
  },
];

type LocationType = "all" | "palenques" | "mezcalerias" | "restaurants";

type Palenque = (typeof palenques)[number] & { type: "palenque" };
type Mezcaleria = (typeof mezcalerias)[number] & { type: "mezcaleria" };
type Restaurant = (typeof restaurants)[number] & { type: "restaurant" };
type SelectedLocation = Palenque | Mezcaleria | Restaurant;

type MapView = { lat: number; lng: number; zoom: number; marker: boolean };

const DEFAULT_VIEW: MapView = { lat: 16.9, lng: -96.7, zoom: 8, marker: false };

const PLACE_ICON: Record<SelectedLocation["type"], LucideIcon> = {
  palenque: Factory,
  mezcaleria: Wine,
  restaurant: Utensils,
};

// The region's dot color (the app set it inline from region.color; same hex values).
const REGION_DOT: Record<string, string> = {
  "valles-centrales": "size-3 rounded-full bg-[#D97706]",
  "sierra-norte": "size-3 rounded-full bg-[#059669]",
  "sierra-sur": "size-3 rounded-full bg-[#7C3AED]",
  costa: "size-3 rounded-full bg-[#0891B2]",
  mixteca: "size-3 rounded-full bg-[#DC2626]",
};

/** OpenStreetMap embed URL for a center and zoom level (bbox sized for a ~800x600 frame). */
export function osmEmbedUrl({ lat, lng, zoom, marker }: MapView) {
  const halfLng = (360 / 2 ** zoom) * 1.5;
  const halfLat = halfLng * 0.75;
  const bbox = [lng - halfLng, lat - halfLat, lng + halfLng, lat + halfLat].map((n) => n.toFixed(4)).join(",");
  const markerParam = marker ? `&marker=${lat.toFixed(4)},${lng.toFixed(4)}` : "";
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markerParam}`;
}

function filterButtonClass(active: boolean, withIcon: boolean) {
  if (withIcon) {
    return active
      ? "flex items-center justify-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-sm text-white transition-colors"
      : "flex items-center justify-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/20";
  }
  return active
    ? "rounded-lg bg-amber-600 px-3 py-2 text-sm text-white transition-colors"
    : "rounded-lg bg-white/10 px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/20";
}

export function OaxacaMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [locationType, setLocationType] = useState<LocationType>("all");
  const [view, setView] = useState<MapView>(DEFAULT_VIEW);

  const places: SelectedLocation[] = [
    ...(locationType === "all" || locationType === "palenques"
      ? palenques.map((p) => ({ ...p, type: "palenque" as const }))
      : []),
    ...(locationType === "all" || locationType === "mezcalerias"
      ? mezcalerias.map((b) => ({ ...b, type: "mezcaleria" as const }))
      : []),
    ...(locationType === "all" || locationType === "restaurants"
      ? restaurants.map((r) => ({ ...r, type: "restaurant" as const }))
      : []),
  ];

  const selectLocation = (place: SelectedLocation) => {
    setSelectedLocation(place);
    setView({ ...place.position, zoom: 14, marker: true });
  };

  const focusRegion = (region: (typeof mezcalRegions)[number]) => {
    setView({ ...region.center, zoom: 10, marker: false });
    setSelectedRegion(region.id);
  };

  const resetView = () => {
    setView(DEFAULT_VIEW);
    setSelectedRegion(null);
    setSelectedLocation(null);
  };

  const SelectedIcon = selectedLocation ? PLACE_ICON[selectedLocation.type] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-black py-8">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href={ss("/")}
            className="mb-4 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="mb-2 font-serif text-4xl text-amber-400 md:text-5xl">The Sacred Geography</h1>
          <p className="max-w-2xl text-gray-300">
            Navigate the mezcal regions of Oaxaca. From the high mountains of Sierra Norte to the coastal lowlands,
            each terroir produces distinct spirits.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Filter Buttons */}
            <div className="rounded-xl bg-white/5 p-4">
              <p className="mb-3 font-mono text-sm text-gray-300">SHOW ON MAP</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={locationType === "all"}
                  onClick={() => setLocationType("all")}
                  className={filterButtonClass(locationType === "all", false)}
                >
                  All
                </button>
                <button
                  type="button"
                  aria-pressed={locationType === "palenques"}
                  onClick={() => setLocationType("palenques")}
                  className={filterButtonClass(locationType === "palenques", true)}
                >
                  <Factory aria-hidden="true" className="size-4" /> Palenques
                </button>
                <button
                  type="button"
                  aria-pressed={locationType === "mezcalerias"}
                  onClick={() => setLocationType("mezcalerias")}
                  className={filterButtonClass(locationType === "mezcalerias", true)}
                >
                  <Wine aria-hidden="true" className="size-4" /> Bars
                </button>
                <button
                  type="button"
                  aria-pressed={locationType === "restaurants"}
                  onClick={() => setLocationType("restaurants")}
                  className={filterButtonClass(locationType === "restaurants", true)}
                >
                  <Utensils aria-hidden="true" className="size-4" /> Food
                </button>
              </div>

              {/* The places (the app's map markers) */}
              <ul className="mt-4 space-y-1">
                {places.map((place) => {
                  const Icon = PLACE_ICON[place.type];
                  const active = selectedLocation?.id === place.id;
                  return (
                    <li key={place.id}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => selectLocation(place)}
                        className={
                          active
                            ? "flex w-full items-center gap-2 rounded-lg border border-amber-700 bg-amber-900/50 px-3 py-2 text-left text-sm text-white transition-colors"
                            : "flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-white/10"
                        }
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0 text-amber-400" />
                        <span className="min-w-0">
                          <span className="block font-medium">{place.name}</span>
                          <span className="block text-xs text-gray-400">
                            {"location" in place ? place.location : place.address}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Regions */}
            <div className="rounded-xl bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-sm text-gray-300">MEZCAL REGIONS</p>
                {selectedRegion && (
                  <button type="button" onClick={resetView} className="text-xs text-amber-400 hover:text-amber-300">
                    Reset View
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {mezcalRegions.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    aria-pressed={selectedRegion === region.id}
                    onClick={() => focusRegion(region)}
                    className={
                      selectedRegion === region.id
                        ? "w-full rounded-lg border border-amber-700 bg-amber-900/50 p-3 text-left transition-all"
                        : "w-full rounded-lg border border-transparent bg-white/5 p-3 text-left transition-all hover:bg-white/10"
                    }
                  >
                    <span className="flex items-center gap-2">
                      <span className={REGION_DOT[region.id]} />
                      <span className="font-medium text-white">{region.name}</span>
                    </span>
                    {selectedRegion === region.id && (
                      <span className="mt-2 block text-sm text-gray-300">
                        <span className="mb-2 block">{region.description}</span>
                        <span className="mb-1 block text-xs text-gray-400">TERROIR</span>
                        <span className="block text-xs text-gray-300">{region.terroir}</span>
                        <span className="mt-2 flex flex-wrap gap-1">
                          {region.agaves.map((agave) => (
                            <span key={agave} className="rounded bg-white/10 px-2 py-0.5 text-xs">
                              {agave}
                            </span>
                          ))}
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-xl bg-white/5 p-4">
              <p className="mb-3 font-mono text-sm text-gray-300">LEGEND</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Factory aria-hidden="true" className="size-5 text-amber-400" />
                  <span className="text-gray-200">Palenque / Producer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wine aria-hidden="true" className="size-5 text-amber-400" />
                  <span className="text-gray-200">Mezcaleria / Bar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils aria-hidden="true" className="size-5 text-amber-400" />
                  <span className="text-gray-200">Restaurant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-xl border border-amber-900/30">
              <iframe
                title={
                  selectedLocation ? `Map of Oaxaca: ${selectedLocation.name}` : "Map of the mezcal regions of Oaxaca"
                }
                src={osmEmbedUrl(view)}
                loading="lazy"
                className="block h-[600px] w-full border-0"
              />

              {/* Location Detail Overlay */}
              {selectedLocation && SelectedIcon && (
                <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-amber-900/50 bg-black/95 p-4 backdrop-blur-sm">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setSelectedLocation(null)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </button>

                  <div className="flex items-start gap-3">
                    <SelectedIcon aria-hidden="true" className="size-6 shrink-0 text-amber-400" />
                    <div className="flex-1 pr-6">
                      <h2 className="font-serif text-xl text-amber-400">{selectedLocation.name}</h2>
                      {"producer" in selectedLocation && (
                        <p className="text-sm text-gray-300">{selectedLocation.producer}</p>
                      )}
                      {"location" in selectedLocation && (
                        <p className="text-sm text-gray-400">{selectedLocation.location}</p>
                      )}
                      {"address" in selectedLocation && (
                        <p className="text-sm text-gray-400">{selectedLocation.address}</p>
                      )}
                      <p className="mt-2 text-sm text-gray-200">{selectedLocation.description}</p>

                      {"mustTry" in selectedLocation && (
                        <div className="mt-2 rounded bg-amber-900/30 p-2">
                          <p className="text-xs text-amber-400">MUST TRY</p>
                          <p className="text-sm text-gray-200">{selectedLocation.mustTry}</p>
                        </div>
                      )}

                      {"visitInfo" in selectedLocation && (
                        <div className="mt-2 rounded bg-white/5 p-2">
                          <p className="text-xs text-gray-400">VISITING</p>
                          <p className="text-sm text-gray-300">{selectedLocation.visitInfo}</p>
                        </div>
                      )}

                      {"hours" in selectedLocation && (
                        <p className="mt-2 text-xs text-gray-400">Hours: {selectedLocation.hours}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="font-serif text-2xl text-amber-400">{palenques.length}</p>
                <p className="text-xs text-gray-400">Palenques</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="font-serif text-2xl text-amber-400">{mezcalerias.length}</p>
                <p className="text-xs text-gray-400">Mezcalerias</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="font-serif text-2xl text-amber-400">{restaurants.length}</p>
                <p className="text-xs text-gray-400">Restaurants</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
