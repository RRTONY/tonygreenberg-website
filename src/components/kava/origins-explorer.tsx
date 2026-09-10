"use client";

import { useState } from "react";
import { KavaCard, KavaBadge } from "@/components/kava/kava-ui";

interface Island {
  id: string;
  name: string;
  localName: string;
  colorHex: string;
  colorClass: string;
  bgClass: string;
  activeBgClass: string;
  year: string;
  facts: string[];
  ceremony: string;
  cultivar?: { name: string; note: string };
  safety?: string;
}

// Ported from legacy client/src/pages/kava/KavaOrigins.tsx's real
// 6-island selector (Vanuatu/Fiji/Tonga/Samoa/Hawaii/Pohnpei), each with
// real facts/ceremony/cultivar/safety-note content, unchanged. Click to
// expand extracted into this client island.
export const ISLANDS: Island[] = [
  {
    id: "vanuatu",
    name: "Vanuatu",
    localName: "Origin Nation",
    colorHex: "#C84B2A",
    colorClass: "text-kava-terracotta",
    bgClass: "bg-kava-terracotta",
    activeBgClass: "bg-kava-terracotta",
    year: "~3000 BCE",
    facts: [
      "Domesticated ~3,000 years ago on island of Maewo from wild Piper wichmannii",
      "80+ named cultivars — most diversity of any nation on earth",
      "Port Vila: 45,000 people, 250+ nakamals (kava bars) — 1 per 180 people",
      "Fresh root ground same-day — most potent expression globally, described as close to narcotic in intensity",
      "Prince Charles inaugurated as honorary high chief with kava ceremony 2018",
    ],
    ceremony:
      "Traditionally men-only nakamals; kava opens Parliament sessions, welcomes foreign ambassadors, celebrates independence day.",
    safety:
      "Non-noble (tudei) cultivars originate here — always specify noble-only sourcing from Vanuatu suppliers.",
  },
  {
    id: "fiji",
    name: "Fiji",
    localName: "Yaqona — National Drink",
    colorHex: "#2A5AA0",
    colorClass: "text-kava-cobalt",
    bgClass: "bg-kava-cobalt",
    activeBgClass: "bg-kava-cobalt",
    year: "~2500 BCE",
    facts: [
      "Called yaqona — appears on Fijian currency (tanoa bowl on coins)",
      "Sevusevu: mandatory kava gifting ceremony when entering any Fijian village — without it you are not a guest, with it you are family",
      "BULA = long life and good health — group ceremonial response",
      "Both men and women welcome (unlike many other island traditions)",
      "Market value: $561M USD (2021) — largest producer and exporter",
    ],
    ceremony:
      "Sevusevu gifting ceremony is the gateway to Fijian hospitality. The tanoa bowl is a national symbol.",
    cultivar: { name: "Loa Waka", note: "Strongest Fijian kava, powerful mind-body relaxation" },
  },
  {
    id: "tonga",
    name: "Tonga",
    localName: "Royal Constitutional Kava",
    colorHex: "#B86A28",
    colorClass: "text-kava-saffron",
    bgClass: "bg-kava-saffron",
    activeBgClass: "bg-kava-saffron",
    year: "~2000 BCE",
    facts: [
      "The word 'kava' comes from Tongan and Marquesan — means bitter",
      "No Tongan king is constitutionally installed without kava ceremony — this is law",
      "Royal Kava: reserved for extraordinary occasions — last served to Duke of Edinburgh 1974, then Prince Charles 2018",
      "Seating, pouring order, and who receives first shell carry political and social weight",
    ],
    ceremony:
      "Origin legend: daughter named Kava was sacrificed to honor a king; two plants grew on her grave — kava and sugar cane. Kava offered to kings of Tonga ever since.",
  },
  {
    id: "samoa",
    name: "Samoa",
    localName: "'Ava — Chiefly System",
    colorHex: "#6B7280",
    colorClass: "text-[#6B7280]",
    bgClass: "bg-[#6B7280]",
    activeBgClass: "bg-[#6B7280]",
    year: "~1500 BCE",
    facts: [
      "Every gathering of chiefs (matai system) begins with 'ava ceremony",
      "Serving order reflects social hierarchy — a political act as much as a beverage ritual",
      "'Ava appears on Western Samoa two-tala currency as a plastic inset",
    ],
    ceremony:
      "Kava represents respect for elders and chiefs, continuity of ancestral tradition, and chiefly sovereignty.",
  },
  {
    id: "hawaii",
    name: "Hawaii",
    localName: "'Awa — Sacred to Chiefs",
    colorHex: "#059669",
    colorClass: "text-[#059669]",
    bgClass: "bg-[#059669]",
    activeBgClass: "bg-[#059669]",
    year: "~1000 CE",
    facts: [
      "Sacred drink of chiefs, priests, and medicine men (kahunas)",
      "13+ unique cultivars on the islands",
      "GRAS status granted in Hawaii 2024",
      "Commercial kava bars statewide, seven days a week, men and women welcome",
      "ICE crisis context: the 'awa bowl as a way home for communities devastated by meth",
    ],
    ceremony:
      "'Awa is good for the farmer when he is weary and sore after laboring day and night, and for the fisherman who has been diving, rowing, pulling and bending.",
    cultivar: {
      name: "Mo'i",
      note: "Royal cultivar — finest Hawaiian 'awa, cleanest heady profile, PRI ceremony grade",
    },
  },
  {
    id: "pohnpei",
    name: "Pohnpei / FSM",
    localName: "Sakau — World's Strongest",
    colorHex: "#7C3AED",
    colorClass: "text-[#7C3AED]",
    bgClass: "bg-[#7C3AED]",
    activeBgClass: "bg-[#7C3AED]",
    year: "~1000 BCE",
    facts: [
      "Called sakau — prepared fresh on flat basalt stone called pwehl",
      "Kavalactone profile uniquely intense — fastest onset, most pronounced physical effects of any kava tradition",
      "Strictly structured ceremony: designated roles for pounders, strainers, and servers",
      "Not widely exported — must be experienced in Micronesia for authentic expression",
    ],
    ceremony:
      "Outside of Vanuatu, Solomon Islands, and Papua New Guinea, there are no indigenous varieties with heavy kavalactones — Pohnpei is the exception.",
  },
];

export function OriginsExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = ISLANDS.find((i) => i.id === selected);

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ISLANDS.map((island) => {
          const isActive = selected === island.id;
          return (
            <button
              key={island.id}
              onClick={() => setSelected(isActive ? null : island.id)}
              className={`rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                isActive
                  ? `${island.activeBgClass} border-transparent text-white`
                  : "border-kava-sand-muted bg-white text-kava-ink"
              }`}
            >
              <p className="font-heading text-sm font-bold">{island.name}</p>
              <p className="mt-0.5 text-xs opacity-70">{island.year}</p>
            </button>
          );
        })}
      </div>

      {active && (
        <KavaCard>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className={`font-heading text-2xl font-bold ${active.colorClass}`}>
                {active.name}
              </h3>
              <p className="text-sm font-medium text-kava-ink/60">{active.localName}</p>
            </div>
            <KavaBadge color="saffron">{active.year}</KavaBadge>
          </div>

          <div className="mb-6 space-y-3">
            {active.facts.map((f) => (
              <div key={f} className="flex gap-3">
                <div className={`mt-2 size-1.5 shrink-0 rounded-full ${active.bgClass}`} />
                <p className="text-base leading-[1.75] text-kava-ink">{f}</p>
              </div>
            ))}
          </div>

          <div
            className="mb-4 rounded-lg p-4"
            style={{
              backgroundColor: `${active.colorHex}10`,
              borderLeft: `3px solid ${active.colorHex}`,
            }}
          >
            <p className={`mb-1 text-xs font-bold tracking-wide uppercase ${active.colorClass}`}>
              Ceremony
            </p>
            <p className="text-sm leading-[1.75] text-kava-ink">{active.ceremony}</p>
          </div>

          {active.cultivar && (
            <div className="mb-4 rounded-lg border-l-3 border-l-kava-saffron bg-kava-saffron/10 p-4">
              <p className="mb-1 text-xs font-bold tracking-wide text-kava-saffron uppercase">
                Key Cultivar: {active.cultivar.name}
              </p>
              <p className="text-sm leading-[1.75] text-kava-ink">{active.cultivar.note}</p>
            </div>
          )}

          {active.safety && (
            <div className="rounded-lg border-l-3 border-l-kava-terracotta bg-kava-terracotta/10 p-4">
              <p className="mb-1 text-xs font-bold tracking-wide text-kava-terracotta uppercase">
                Safety Note
              </p>
              <p className="text-sm leading-[1.75] text-kava-ink">{active.safety}</p>
            </div>
          )}
        </KavaCard>
      )}
    </>
  );
}
