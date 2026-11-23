"use client";

import { useState } from "react";
import { Droplets, MapPin, Mountain, X } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";

// Ported from the LiquidSun app's client/src/pages/Pilgrimage.tsx (2026-11-21). The app drew a
// dark Google Map through Manus's map proxy with four glowing pins; like SoulSmoke's Oaxaca map
// (src/components/soulsmoke/pages/oaxaca-map.tsx) it is now an OpenStreetMap embed, and the four
// pins are buttons over the map in the same colors. Choosing one zooms the map to that town
// (the app: panTo + zoom 13) and shows the app's zone card, which rises 50px into place as in the
// app (framer-motion initial y 50 / opacity 0). Same heading, zones, copy and bottles.

type Zone = {
  id: string;
  name: string;
  region: string;
  coords: { lat: number; lng: number };
  description: string;
  bottles: string[];
  /** The app's marker colors, as full class strings (Tailwind needs literals). */
  pinClass: string;
};

export const sacredZones: Zone[] = [
  {
    id: "el-arenal",
    name: "El Arenal",
    region: "Valley (Valles)",
    coords: { lat: 20.775, lng: -103.693 },
    description:
      "The gateway to the Tequila Valley. Home to Cascahuín and Fortaleza. Known for mineral-rich volcanic soil that produces spicy, earthy spirits.",
    bottles: ["Cascahuín Tahona", "Fortaleza Blanco"],
    pinClass:
      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#10b981] bg-black/80 text-[#10b981] shadow-[0_0_15px_#10b981] transition-transform group-hover:scale-125",
  },
  {
    id: "atotonilco",
    name: "Atotonilco El Alto",
    region: "Highlands (Los Altos)",
    coords: { lat: 20.55, lng: -102.507 },
    description:
      "The 'Garden of Eden' of agave. High altitude (2000m+), iron-rich red clay soil. Produces the most floral, fruity, and sweet tequilas.",
    bottles: ["Siete Leguas", "Don Fulano", "Patrón (Traditional)"],
    pinClass:
      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#f59e0b] bg-black/80 text-[#f59e0b] shadow-[0_0_15px_#f59e0b] transition-transform group-hover:scale-125",
  },
  {
    id: "arandas",
    name: "Arandas",
    region: "Highlands (Los Altos)",
    coords: { lat: 20.705, lng: -102.346 },
    description:
      "The heart of the Highlands. Home to El Tesoro and Ocho. Famous for its deep red soil and cooler climate, stressing agaves for higher sugar content.",
    bottles: ["El Tesoro", "Tequila Ocho", "G4"],
    pinClass:
      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#f43f5e] bg-black/80 text-[#f43f5e] shadow-[0_0_15px_#f43f5e] transition-transform group-hover:scale-125",
  },
  {
    id: "tequila",
    name: "Tequila",
    region: "Valley (Valles)",
    coords: { lat: 20.885, lng: -103.836 },
    description:
      "The namesake town. Dominated by the volcano. A mix of history and industrialization, but hidden gems like La Rojeña (Cuervo's old distillery) remain.",
    bottles: ["Jose Cuervo Reserva de la Familia", "Arette"],
    pinClass:
      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#64748b] bg-black/80 text-[#64748b] shadow-[0_0_15px_#64748b] transition-transform group-hover:scale-125",
  },
];

/** The app's starting view: centered between Valley and Highlands. */
const OVERVIEW = { lat: 20.65, lng: -103.0, zoom: 9 };

/** OpenStreetMap embed URL for a center and zoom (bbox sized for a wide frame), with an optional marker. */
export function osmEmbedUrl({ lat, lng, zoom, marker }: { lat: number; lng: number; zoom: number; marker?: boolean }) {
  const halfLng = (360 / 2 ** zoom) * 1.5;
  const halfLat = halfLng * 0.6;
  const bbox = [lng - halfLng, lat - halfLat, lng + halfLng, lat + halfLat].map((n) => n.toFixed(4)).join(",");
  const markerParam = marker ? `&marker=${lat.toFixed(4)},${lng.toFixed(4)}` : "";
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markerParam}`;
}

export function Pilgrimage() {
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const view = activeZone ? { ...activeZone.coords, zoom: 13, marker: true } : OVERVIEW;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-sans text-white">
      <AudioController />

      {/* Header */}
      <div className="pointer-events-none absolute top-24 left-4 z-20">
        <h1 className="font-serif text-4xl text-amber-50 drop-shadow-lg md:text-6xl">The Pilgrimage</h1>
        <p className="mt-2 max-w-md font-serif font-light text-slate-400 italic drop-shadow-md">
          &quot;The soil speaks. Listen to the difference between the red clay of the Highlands and the volcanic ash of the
          Valley.&quot;
        </p>
      </div>

      {/* Zone pins (the app's map markers) */}
      <div className="absolute top-60 left-4 z-20 flex flex-col gap-2 md:top-72">
        {sacredZones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            aria-pressed={activeZone?.id === zone.id}
            onClick={() => setActiveZone(zone)}
            className="group flex min-h-11 items-center gap-2 rounded-full bg-black/60 py-1 pr-4 pl-1 font-mono text-xs tracking-widest text-slate-200 uppercase backdrop-blur-md"
          >
            <span className={zone.pinClass}>
              <MapPin aria-hidden="true" className="size-4" />
            </span>
            {zone.name}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <iframe
          key={activeZone?.id ?? "overview"}
          title={activeZone ? `Map of ${activeZone.name}, Jalisco` : "Map of the tequila regions of Jalisco"}
          src={osmEmbedUrl(view)}
          className="size-full border-0 brightness-75 contrast-125 grayscale-[0.4]"
          loading="lazy"
        />
      </div>

      {/* Zone Info Card */}
      {activeZone && (
        <div
          key={activeZone.id}
          className="absolute right-4 bottom-8 left-4 z-30 animate-in rounded-xl border border-amber-500/30 bg-black/90 p-6 shadow-2xl backdrop-blur-xl duration-300 fade-in slide-in-from-bottom-[50px] md:right-8 md:left-auto md:w-96"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-serif text-2xl text-white">{activeZone.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                {activeZone.region.includes("Highlands") ? (
                  <Mountain aria-hidden="true" className="size-4 text-amber-500" />
                ) : (
                  <Droplets aria-hidden="true" className="size-4 text-emerald-500" />
                )}
                <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">{activeZone.region}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveZone(null)}
              aria-label={`Close ${activeZone.name}`}
              className="flex size-11 items-center justify-center text-slate-500 hover:text-white"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <p className="mb-6 text-sm leading-relaxed font-light text-slate-300">{activeZone.description}</p>

          <div>
            <h3 className="mb-2 font-mono text-xs tracking-widest text-amber-500 uppercase">Key Bottles</h3>
            <div className="flex flex-wrap gap-2">
              {activeZone.bottles.map((bottle) => (
                <span key={bottle} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {bottle}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
