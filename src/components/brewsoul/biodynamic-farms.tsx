"use client";

import { useState } from "react";

interface Farm {
  name: string;
  country: string;
  alt: string;
  est: string;
  cert: string[];
  varietals: string;
  process: string;
  notes: string;
  story: string;
  roasters: string[];
  co2: string;
  birds: string;
  organic: string;
}

const FARM_BORDER_CLASS = ["border-l-[#c4873b]", "border-l-[#7a8c6e]", "border-l-[#d4a84b]"];

export const FARMS: Farm[] = [
  {
    name: "La Chacra D'Dago",
    country: "Junín, Peru",
    alt: "1700m",
    est: "2005",
    cert: ["Demeter", "USDA Organic", "EcoCert", "B-Corp"],
    varietals: "Catigua, Obata, Tupi",
    process: "Washed",
    notes: "Rich chocolate, molasses, toasted hazelnut",
    story:
      "Third-generation family farm in the Peruvian Andes, El Palomar. First biodynamic farm to receive the Demeter seal. On-site beekeeping, multi-species tree cultivation, animal husbandry. B-Corp certified 2024. Supplies green beans to most biodynamic roasters worldwide.",
    roasters: ["Holistic Roasters", "Cafe Altura", "Deepvalley Coffee"],
    co2: "15-25 tons/ha/yr",
    birds: "120+ species",
    organic: "2-4 tons matter/ha/yr",
  },
  {
    name: "18 Conejo Farming Collective",
    country: "Marcala, Honduras",
    alt: "1280m",
    est: "~2010",
    cert: ["Demeter", "USDA Organic", "EcoCert"],
    varietals: "Bourbon, Typica, Lempira",
    process: "Washed",
    notes: "Rich chocolate, hazelnut, sugarcane",
    story:
      "Family-run collective by siblings Flhor and Napo Zelaya Contreras. Pioneers in organic and biodynamic farming in Honduras. Top 10 Honduras Cup of Excellence. Focus on soil health and regenerative techniques. Source for the world's first biodynamic decaf (via Swiss Water Process).",
    roasters: ["Holistic Roasters", "Primal Pastures"],
    co2: "10-20 tons/ha/yr",
    birds: "90+ species",
    organic: "2-3 tons matter/ha/yr",
  },
  {
    name: "Fazenda Camocim",
    country: "Espírito Santo, Brazil",
    alt: "~900m",
    est: "~1990s",
    cert: ["Demeter"],
    varietals: "Various (incl. Jacu Bird processed)",
    process: "Natural + Jacu Bird",
    notes: "Smooth, low-acidity, chocolate, almond, citrus (Jacu Bird variant)",
    story:
      "Located 1km from mystical Pedra Azul (Blue Rock) in Domingos Martins. Home of the legendary Jacu Bird coffee — wild jacu birds eat ripe cherries, beans collected and processed. One of the most expensive coffees in Brazil. Also produces standard biodynamic roasts at accessible prices.",
    roasters: ["Primal Pastures (Rubicon/Rise & Shine roasts)"],
    co2: "12-20 tons/ha/yr",
    birds: "150+ species (Jacu habitat)",
    organic: "3-5 tons matter/ha/yr",
  },
];

// Ported from legacy client/src/pages/brewsoul/BrewSoulBiodynamic.tsx's
// click-to-expand farm cards — real 3-farm biodynamic census, unchanged.
export function BiodynamicFarms() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      {FARMS.map((farm, i) => (
        <button
          key={farm.name}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className={`mb-5 block w-full rounded-lg border border-white/10 bg-white/5 p-7 text-left border-l-4 ${FARM_BORDER_CLASS[i]}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-heading text-2xl font-bold text-[#f5efe0] italic">
                {farm.name}
              </div>
              <div className="mt-1 text-[13px] text-[#e8dcc8]/70">
                {farm.country} · {farm.alt} · Est. {farm.est}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {farm.cert.map((c) => (
                <span
                  key={c}
                  className="rounded-sm bg-[#c4873b]/15 px-2 py-1 font-mono text-[9px] tracking-wide text-[#c4873b]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="my-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
            <div>
              <div className="font-mono text-[9px] tracking-wide text-[#6b5a4e]">
                CO₂ Sequestered
              </div>
              <div className="font-heading text-base text-[#d4a84b]">{farm.co2}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-wide text-[#6b5a4e]">Bird Species</div>
              <div className="font-heading text-base text-[#d4a84b]">{farm.birds}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-wide text-[#6b5a4e]">
                Organic Matter
              </div>
              <div className="font-heading text-base text-[#d4a84b]">{farm.organic}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-wide text-[#6b5a4e]">Varietals</div>
              <div className="text-[13px] text-[#e8dcc8]">{farm.varietals}</div>
            </div>
          </div>

          <div className="mt-2 text-sm leading-relaxed text-[#f5efe0]/65">
            <strong className="text-[#e8dcc8]">Tasting:</strong> {farm.notes} ·{" "}
            <strong className="text-[#e8dcc8]">Process:</strong> {farm.process}
          </div>

          {expanded === i && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="text-[15px] leading-relaxed text-[#e8dcc8]">{farm.story}</div>
              <div className="mt-3 font-mono text-[11px] text-[#c4873b]">
                Supplies to: {farm.roasters.join(" · ")}
              </div>
            </div>
          )}
          <div className="mt-2 font-mono text-[10px] text-[#6b5a4e]">
            {expanded === i ? "▲ Collapse" : "▼ Tap for full story"}
          </div>
        </button>
      ))}
    </>
  );
}
