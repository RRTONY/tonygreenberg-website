"use client";

import { useState } from "react";

interface Product {
  roast: string;
  origin: string;
  oz: string;
  price: string;
  perOz: string;
}

interface Roaster {
  name: string;
  loc: string;
  url: string;
  source: string[];
  cert: string[];
  products: Product[];
  sub?: string;
  testing: string;
  unique: string;
  rating: string;
}

const ROASTER_BORDER_CLASS = ["border-l-[#c4873b]", "border-l-[#4a5e3c]", "border-l-[#7a8c6e]", "border-l-[#5c3a28]", "border-l-[#d4a84b]", "border-l-[#6b5a4e]"];

const ROASTERS: Roaster[] = [
  {
    name: "Holistic Roasters (Biodynamic Coffee)", loc: "Montreal, Canada",
    url: "https://biodynamic.coffee?ref=brewsoul",
    source: ["La Chacra D'Dago (Peru)", "18 Conejo (Honduras)"],
    cert: ["Demeter end-to-end", "USDA Organic", "EcoCert"],
    products: [
      { roast: "Light (Rubicon)", origin: "Brazil (Camocim)", oz: "10.6oz", price: "$19.95", perOz: "$1.88" },
      { roast: "Medium (Rise & Shine)", origin: "Peru (La Chacra D'Dago)", oz: "10.6oz", price: "$19.95", perOz: "$1.88" },
      { roast: "French Roast", origin: "Peru/Honduras blend", oz: "10.6oz", price: "$19.95", perOz: "$1.88" },
      { roast: "Biodynamic Decaf (SWP)", origin: "Honduras (18 Conejo)", oz: "10.6oz", price: "$19.95", perOz: "$1.88" },
      { roast: "Green Beans (raw)", origin: "Peru (La Chacra D'Dago)", oz: "32oz (2lb)", price: "$57.95", perOz: "$1.81" },
    ],
    sub: "Subscribe & save up to 20%",
    testing: "3rd party lab tested: mold, mycotoxins, heavy metals. Results on website. SCA score 85-87.",
    unique: "World's first Demeter-certified biodynamic decaf. Roasted in-house (not outsourced). Ships within 1 week of roast date. 9 grind options. Compostable packaging. Forbes featured. Available at Erewhon.",
    rating: "★★★★★ Best-in-class",
  },
  {
    name: "Cafe Altura", loc: "Ventura, CA (est. 1980)",
    url: "https://cafealtura.com?ref=brewsoul",
    source: ["La Chacra D'Dago (Peru)", "Historical: Chiapas, Mexico"],
    cert: ["Demeter", "USDA Organic", "Non-GMO"],
    products: [
      { roast: "Biodynamic Medium Roast", origin: "Peru (La Chacra D'Dago)", oz: "12oz", price: "$16.99", perOz: "$1.42" },
      { roast: "Biodynamic Dark Roast", origin: "Peru", oz: "12oz", price: "$16.99", perOz: "$1.42" },
    ],
    sub: "Available on their website store",
    testing: "Demeter certified supply chain. No independent mold testing published.",
    unique: "The OG — Chris Shepherd traveled to Chiapas in 1980 seeking chemical-free coffee. 44+ years continuous biodynamic. Best price-to-value biodynamic on market. Roasts day 1, ships day 2.",
    rating: "★★★★☆ Best value",
  },
  {
    name: "Deepvalley Coffee", loc: "USA",
    url: "https://deepvalleycoffee.com?ref=brewsoul",
    source: ["Undisclosed Demeter-certified farms"],
    cert: ["Demeter"],
    products: [
      { roast: "Light Roast", origin: "Various", oz: "12oz", price: "~$18.95", perOz: "~$1.58" },
      { roast: "Medium Roast", origin: "Various", oz: "12oz", price: "~$18.95", perOz: "~$1.58" },
      { roast: "Dark Roast", origin: "Various", oz: "12oz", price: "~$18.95", perOz: "~$1.58" },
    ],
    sub: "6 blends available. Ground and whole bean.",
    testing: "Demeter certified. No independent lab testing published on site.",
    unique: "Also offers Regenerative certified line (separate from biodynamic). 6 blend variety is widest selection. Light/Medium/Dark all available.",
    rating: "★★★★☆ Best variety",
  },
  {
    name: "Primal Pastures", loc: "Temecula, CA",
    url: "https://primalpastures.com/products/biodynamic-coffee?ref=brewsoul",
    source: ["18 Conejo (Honduras)", "Fazenda Camocim (Brazil)"],
    cert: ["Demeter end-to-end", "USDA Organic", "EcoCert"],
    products: [
      { roast: "Medium (18 Conejo)", origin: "Honduras", oz: "12oz", price: "~$22.00", perOz: "~$1.83" },
      { roast: "Light (Rubicon / Camocim)", origin: "Brazil", oz: "12oz", price: "~$22.00", perOz: "~$1.83" },
      { roast: "Medium (Rise & Shine / Camocim)", origin: "Brazil", oz: "12oz", price: "~$22.00", perOz: "~$1.83" },
    ],
    sub: "Ships Mon-Wed. All packaging compostable.",
    testing: "End-to-end Demeter certification covers sourcing, shipping, warehousing, roasting.",
    unique: "Regenerative livestock farm that added biodynamic coffee. Whole bean only. Compostable packaging. Sources from both Honduras and Brazil biodynamic farms.",
    rating: "★★★★☆ Most transparent supply chain",
  },
  {
    name: "Purity Coffee", loc: "Greenville, SC",
    url: "https://puritycoffee.com?ref=brewsoul",
    source: ["Multiple certified farms (Nicaragua, Honduras, Colombia)"],
    cert: ["USDA Organic", "Rainforest Alliance", "Smithsonian Bird Friendly", "Demeter Biodynamic (select lines)"],
    products: [
      { roast: "Protect (Light-Medium)", origin: "Multi-origin", oz: "12oz", price: "$29.00", perOz: "$2.42" },
      { roast: "Flow (Medium)", origin: "Multi-origin", oz: "12oz", price: "$29.00", perOz: "$2.42" },
      { roast: "Ease (Dark)", origin: "Multi-origin", oz: "12oz", price: "$29.00", perOz: "$2.42" },
      { roast: "Calm Decaf (SWP, 1/3 caf option)", origin: "Multi-origin", oz: "12oz", price: "$29.00", perOz: "$2.42" },
    ],
    sub: "Subscribe: $23/bag (20% off). Smokeless roaster. N₂-flushed bags.",
    testing: "Tests for 350+ chemical compounds. Lab results available on request. Mold-free verified.",
    unique: "Health-first brand. Highest CGA (chlorogenic acid) focus. Demeter-certified on some lines. Smithsonian Bird Friendly (only 1% of global coffee). Most certifications stacked. Premium price reflects testing depth.",
    rating: "★★★★★ Most health-optimized",
  },
  {
    name: "Melk Organics", loc: "Montreal, Canada (sister brand of Holistic Roasters)",
    url: "https://biodynamic.coffee/collections/melk-organic-specialty-coffee?ref=brewsoul",
    source: ["La Chacra D'Dago (Peru)", "18 Conejo (Honduras)"],
    cert: ["USDA Organic", "EcoCert"],
    products: [{ roast: "Various Organic roasts", origin: "Peru/Honduras", oz: "10.6oz", price: "~$17.95", perOz: "~$1.69" }],
    sub: "Organic (not biodynamic) line from same roaster. Lower price entry point.",
    testing: "Same lab testing standards as Holistic Roasters biodynamic line.",
    unique: "Entry-level product from the Holistic Roasters family. Same quality roasting (Scott Rao trained), same farms, just organic certification instead of full Demeter biodynamic. Good stepping stone.",
    rating: "★★★☆☆ Best entry point",
  },
];

// Ported from legacy client/src/pages/brewsoul/BrewSoulBiodynamic.tsx's
// click-to-expand roaster cards — real 6-roaster market census with real
// product tables/pricing, unchanged.
export function BiodynamicRoasters() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      {ROASTERS.map((r, i) => (
        <div key={r.name} onClick={() => setExpanded(expanded === i ? null : i)} className={`mb-4 cursor-pointer rounded-lg border border-[#5d3a28]/8 bg-white p-6 border-l-4 ${ROASTER_BORDER_CLASS[i]}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-heading text-xl font-bold text-[#1a0e08] italic">{r.name}</div>
              <div className="mt-0.5 text-[13px] text-[#6b5a4e]">{r.loc}</div>
            </div>
            <div className="font-heading text-base font-bold text-[#c4873b]">{r.rating}</div>
          </div>

          <div className="mt-2.5 text-sm leading-relaxed text-[#5c3a28]">{r.unique}</div>

          <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {["Product", "Origin", "Size", "Price", "$/oz"].map((h) => (
                    <th key={h} className="border-b border-[#5d3a28]/10 px-2.5 py-2 text-left font-mono text-[9px] tracking-wide text-[#6b5a4e] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.products.map((p, pi) => (
                  <tr key={p.roast} className={pi % 2 === 1 ? "bg-[#f5efe0]/30" : ""}>
                    <td className="p-2.5 font-semibold text-[#2d1810]">{p.roast}</td>
                    <td className="p-2.5 text-[#5c3a28]">{p.origin}</td>
                    <td className="p-2.5 text-[#5c3a28]">{p.oz}</td>
                    <td className="p-2.5 font-semibold text-[#2d1810]">{p.price}</td>
                    <td className="p-2.5 font-mono text-xs font-semibold text-[#c4873b]">{p.perOz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {expanded === i && (
            <div className="border-t border-[#5d3a28]/6 pt-3">
              <div className="mb-3 grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1 font-mono text-[9px] tracking-wide text-[#6b5a4e]">Certifications</div>
                  <div className="text-[13px] text-[#2d1810]">{r.cert.join(" · ")}</div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-[9px] tracking-wide text-[#6b5a4e]">Source Farms</div>
                  <div className="text-[13px] text-[#2d1810]">{r.source.join(" · ")}</div>
                </div>
              </div>
              <div className="mb-1 font-mono text-[9px] tracking-wide text-[#6b5a4e]">Testing & QA</div>
              <div className="mb-2 text-sm leading-relaxed text-[#5c3a28]">{r.testing}</div>
              {r.sub && <div className="text-xs text-[#4a5e3c] italic">{r.sub}</div>}
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 inline-block rounded-sm bg-[#4a5e3c] px-5 py-2.5 font-mono text-[11px] tracking-wide text-white"
              >
                Buy Direct →
              </a>
            </div>
          )}
          <div className="mt-2 font-mono text-[10px] text-[#6b5a4e]">{expanded === i ? "▲ Collapse" : "▼ Tap for details, certs & buy link"}</div>
        </div>
      ))}
    </>
  );
}
