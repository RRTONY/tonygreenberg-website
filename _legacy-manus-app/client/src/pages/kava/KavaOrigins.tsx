import { useState } from "react";
import SEO from "@/components/SEO";
import KavaLayout, {
  KAVA,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaBadge,
  KavaDivider,
  KavaDisclaimer,
} from "./KavaLayout";

interface Island {
  id: string;
  name: string;
  localName: string;
  color: string;
  year: string;
  facts: string[];
  ceremony: string;
  cultivar?: { name: string; note: string };
  safety?: string;
}

const ISLANDS: Island[] = [
  {
    id: "vanuatu",
    name: "Vanuatu",
    localName: "Origin Nation",
    color: KAVA.terracotta,
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
    color: KAVA.cobalt,
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
    cultivar: {
      name: "Loa Waka",
      note: "Strongest Fijian kava, powerful mind-body relaxation",
    },
  },
  {
    id: "tonga",
    name: "Tonga",
    localName: "Royal Constitutional Kava",
    color: KAVA.saffron,
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
    color: "#6B7280",
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
    color: "#059669",
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
    color: "#7C3AED",
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

const TIMELINE = [
  { year: "~3000 BCE", place: "Vanuatu", note: "Domestication from wild Piper wichmannii" },
  { year: "~2500 BCE", place: "Fiji", note: "Yaqona becomes national drink" },
  { year: "~2000 BCE", place: "Tonga", note: "Constitutional role in kingship" },
  { year: "~1500 BCE", place: "Samoa", note: "Chiefly 'ava system established" },
  { year: "~1000 BCE", place: "Pohnpei", note: "Sakau tradition develops independently" },
  { year: "~1000 CE", place: "Hawaii", note: "'Awa sacred to chiefs and kahunas" },
];

export default function KavaOrigins() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = ISLANDS.find((i) => i.id === selected);

  return (
    <>
    <SEO
        title="Kava Origins — Pacific Island Traditions"
        description="The cultural and botanical origins of kava across the Pacific Islands."
        path="/kava/origins"
        keywords="Tony Greenberg, kava origins, Pacific kava, kava culture, kava traditions"
        indexable={true}
      />
      <KavaLayout>
      <KavaHero
        eyebrow="Module 2"
        title="Island Origins"
        subtitle="3,000 years of kava culture across the Pacific — from Vanuatu's nakamals to Hawaii's sacred 'awa ceremonies."
      />

      {/* ── Migration Timeline ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Migration Timeline</KavaSectionTitle>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: KAVA.saffron + "40" }}
          />
          {TIMELINE.map((t, i) => (
            <div
              key={t.year}
              className={`relative flex items-start gap-4 mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="hidden md:block md:w-1/2" />
              <div
                className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-1.5 z-10"
                style={{ backgroundColor: KAVA.saffron }}
              />
              <div className="ml-10 md:ml-0 md:w-1/2 md:px-6">
                <p className="text-xs font-bold tracking-wide" style={{ color: KAVA.saffron }}>
                  {t.year}
                </p>
                <p className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}>
                  {t.place}
                </p>
                <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.6, lineHeight: 1.75 }}>
                  {t.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </KavaSection>

      {/* ── Island Selector ── */}
      <KavaSection>
        <KavaSectionTitle>Explore Each Nation</KavaSectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {ISLANDS.map((island) => (
            <button
              key={island.id}
              onClick={() => setSelected(selected === island.id ? null : island.id)}
              className="rounded-xl p-4 text-center transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: selected === island.id ? island.color : "#fff",
                color: selected === island.id ? "#fff" : KAVA.ink,
                border: `2px solid ${selected === island.id ? island.color : KAVA.sandMuted}`,
              }}
            >
              <p className="font-bold text-sm" style={{ fontFamily: "'Fraunces', serif" }}>
                {island.name}
              </p>
              <p className="text-xs mt-0.5 opacity-70">{island.year}</p>
            </button>
          ))}
        </div>

        {/* ── Detail Panel ── */}
        {active && (
          <KavaCard className="animate-in fade-in duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="font-bold text-2xl"
                  style={{ fontFamily: "'Fraunces', serif", color: active.color }}
                >
                  {active.name}
                </h3>
                <p className="text-sm font-medium" style={{ color: KAVA.ink, opacity: 0.6 }}>
                  {active.localName}
                </p>
              </div>
              <KavaBadge color="saffron">{active.year}</KavaBadge>
            </div>

            <div className="space-y-3 mb-6">
              {active.facts.map((f, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: active.color }}
                  />
                  <p className="text-base" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                    {f}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="rounded-lg p-4 mb-4"
              style={{ backgroundColor: active.color + "10", borderLeft: `3px solid ${active.color}` }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: active.color }}>
                Ceremony
              </p>
              <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                {active.ceremony}
              </p>
            </div>

            {active.cultivar && (
              <div
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: KAVA.saffron + "10", borderLeft: `3px solid ${KAVA.saffron}` }}
              >
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: KAVA.saffron }}>
                  Key Cultivar: {active.cultivar.name}
                </p>
                <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                  {active.cultivar.note}
                </p>
              </div>
            )}

            {active.safety && (
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: KAVA.terracotta + "10", borderLeft: `3px solid ${KAVA.terracotta}` }}
              >
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: KAVA.terracotta }}>
                  Safety Note
                </p>
                <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                  {active.safety}
                </p>
              </div>
            )}
          </KavaCard>
        )}
      </KavaSection>

      {/* ── Noble vs Tudei ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Noble vs. Tudei — The Critical Safety Divide</KavaSectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KavaCard>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#16a34a" }} />
              <h4 className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: "#16a34a" }}>
                Noble Cultivars
              </h4>
            </div>
            <div className="space-y-2 text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
              <p>Favorable kavalactone composition with more pleasant effects.</p>
              <p>Lower adverse event potential.</p>
              <p>Used by Polynesians for regular consumption for 3,000 years.</p>
              <p>Spread across all Pacific nations by navigators — for good reason.</p>
              <p className="font-bold" style={{ color: "#16a34a" }}>
                The only appropriate choice for PRI ceremonial use.
              </p>
            </div>
          </KavaCard>
          <KavaCard>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: KAVA.terracotta }} />
              <h4 className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: KAVA.terracotta }}>
                Tudei (Two-Day) Cultivars
              </h4>
            </div>
            <div className="space-y-2 text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
              <p>Effects last 48 hours — hence the name "two-day."</p>
              <p>Adverse event potential significantly higher.</p>
              <p>Linked to European hepatotoxicity crisis of 2002.</p>
              <p>Contains non-noble kavalactones including flavokavain B.</p>
              <p>Limited to Vanuatu and Papua New Guinea origin.</p>
              <p className="font-bold" style={{ color: KAVA.terracotta }}>
                Never spread by Polynesian navigators — for a reason.
              </p>
            </div>
          </KavaCard>
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
    </>);
}
