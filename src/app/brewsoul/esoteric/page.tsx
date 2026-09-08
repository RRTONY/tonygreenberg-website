import type { Metadata } from "next";
import { ESOTERIC_COFFEES, EXPLORER_SCORES, ACQUISITION_PRIORITY, FINAL_OBSERVATION, type EsotericCoffee } from "@/lib/content/brewsoul-esoteric";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulEsoteric.tsx —
// "Where To Actually Buy The Legendary Coffees." Real 9-coffee esoteric
// index (Panama Geisha, Yemen Mokha, Liberica, Eugenioides, Wush Wush,
// Sidra, Pink Bourbon, Bourbon Aji, Sudan Rume) with real tasting notes,
// rarity scores, and real named buy sources, plus a real acquisition
// priority list and explorer scorecard, all ported unchanged and
// verbatim (see `lib/content/brewsoul-esoteric.ts`'s own port note on a
// real content gap found in the source). Legacy's redundant
// `BrewSoulLayout` wrapper dropped. Zero client-side state anywhere in
// this legacy page (the only "interactivity" was CSS-able hover, done
// here with Tailwind `hover:` classes) — ships entirely as a Server
// Component.
export const metadata: Metadata = {
  title: "Esoteric Coffee Index — BrewSoul",
  description: "Rare, unusual, and experimental coffees for the serious enthusiast — where to actually buy the legendary coffees.",
  alternates: { canonical: "/brewsoul/esoteric" },
};

function RarityDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`size-2 rounded-full ${i < score ? "bg-[#8B6914]" : "bg-[#8B6914]/15"}`} />
      ))}
      <span className="ml-1.5 font-mono text-[11px] text-[#6b5a4e]">{score}/10</span>
    </div>
  );
}

function TastingPills({ notes }: { notes: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {notes.map((note) => (
        <span key={note} className="rounded-full border border-[#8B6914]/20 bg-[#8B6914]/8 px-2.5 py-1 font-mono text-[10px] tracking-wide text-[#8B6914] uppercase">
          {note}
        </span>
      ))}
    </div>
  );
}

function CoffeeCard({ coffee }: { coffee: EsotericCoffee }) {
  return (
    <div className="mb-5 rounded-xl border border-[#8B6914]/12 bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,105,20,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-[clamp(22px,3vw,30px)] leading-[1.2] font-bold text-[#0A0A10]">{coffee.name}</h3>
          {coffee.origin && <span className="font-mono text-[11px] tracking-[0.1em] text-[#6b5a4e] uppercase">{coffee.origin}</span>}
        </div>
        <div className="font-mono text-lg font-bold whitespace-nowrap text-[#8B6914]">{coffee.typicalCost}</div>
      </div>

      <p className="my-3.5 text-base leading-relaxed text-[#2d1810] italic">{coffee.whyItMatters}</p>

      <TastingPills notes={coffee.tastingNotes} />

      <div className="mt-4">
        <span className="font-mono text-[10px] tracking-[0.1em] text-[#6b5a4e] uppercase">Rarity</span>
        <RarityDots score={coffee.rarity} />
      </div>

      {coffee.buySources.length > 0 && (
        <div className="mt-4.5">
          <span className="mb-2 block font-mono text-[10px] tracking-[0.1em] text-[#6b5a4e] uppercase">Where to Buy</span>
          <div className="flex flex-wrap gap-2">
            {coffee.buySources.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#0A0A10] px-3.5 py-1.5 font-mono text-[11px] text-[#D4B96A] hover:bg-[#8B6914] hover:text-white"
              >
                {src.name} {src.note ? `(${src.note})` : ""} →
              </a>
            ))}
          </div>
        </div>
      )}

      {coffee.additionalSources && coffee.additionalSources.length > 0 && (
        <div className="mt-3">
          <span className="mb-1.5 block font-mono text-[10px] tracking-[0.1em] text-[#6b5a4e] uppercase">Additional Sources</span>
          <div className="flex flex-wrap gap-1.5">
            {coffee.additionalSources.map((src) => (
              <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-[#8B6914] underline underline-offset-3">
                {src.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {coffee.note && <p className="mt-3 text-[13px] text-[#6b5a4e] italic opacity-80">⚠ {coffee.note}</p>}
      {coffee.references && <p className="mt-2.5 border-t border-black/5 pt-2.5 text-xs leading-snug text-[#6b5a4e]">{coffee.references}</p>}
    </div>
  );
}

export default function BrewSoulEsotericPage() {
  const tier1 = ESOTERIC_COFFEES.filter((c) => c.tier === 1);
  const tier2 = ESOTERIC_COFFEES.filter((c) => c.tier === 2);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <section className="mx-auto max-w-225 px-5 pt-[clamp(60px,10vw,120px)] pb-15 text-center">
        <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e] uppercase opacity-80">BrewSoul Intelligence</div>
        <h1 className="mb-4 font-heading text-[clamp(32px,5vw,56px)] leading-[1.1] font-bold text-[#0A0A10]">Esoteric Coffee Index</h1>
        <p className="mb-6 font-heading text-[clamp(18px,2.5vw,24px)] text-[#8B6914] italic">Where To Actually Buy The Legendary Coffees</p>
        <p className="mx-auto max-w-150 text-base leading-relaxed text-[#6b5a4e]">
          Most coffee drinkers never encounter these. Not because they&apos;re hidden — but because nobody tells you where to find them. Until now.
        </p>
        <div className="mt-6 font-mono text-[10px] tracking-[0.1em] text-[#6b5a4e] opacity-60 uppercase">Last Updated: May 2026</div>
      </section>

      <section className="mx-auto max-w-215 px-5 pb-15">
        <div className="mb-8 border-b-2 border-[#8B6914] pb-3">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e] uppercase opacity-80">Tier 1</div>
          <h2 className="font-heading text-[clamp(26px,4vw,40px)] leading-[1.15] font-bold text-[#0A0A10]">The Holy Grail Coffees</h2>
          <p className="mt-2 text-sm text-[#6b5a4e]">Rarity 9–10. Genetic unicorns. The coffees that changed what coffee means.</p>
        </div>
        {tier1.map((coffee) => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </section>

      <section className="mx-auto max-w-215 px-5 pb-15">
        <div className="mb-8 border-b-2 border-[#8b4c2a] pb-3">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e] uppercase opacity-80">Tier 2</div>
          <h2 className="font-heading text-[clamp(26px,4vw,40px)] leading-[1.15] font-bold text-[#0A0A10]">Competition Monsters</h2>
          <p className="mt-2 text-sm text-[#6b5a4e]">The varieties winning World Barista Championships and fetching auction records.</p>
        </div>
        {tier2.map((coffee) => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </section>

      <section className="mx-auto max-w-215 px-5 pb-15">
        <div className="rounded-2xl bg-[#0A0A10] px-9 py-10 text-[#f5efe0]">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8] uppercase opacity-80">BrewSoul</div>
          <h2 className="mb-6 font-heading text-[clamp(24px,3.5vw,36px)] leading-[1.15] font-bold text-[#D4B96A]">Top 10 Acquisition Priority</h2>
          <ol className="m-0 list-none pl-0 text-[17px] leading-[2.2] text-[#e8dcc8]">
            {ACQUISITION_PRIORITY.map((name, i) => (
              <li key={name} className={i < 9 ? "border-b border-[#D4B96A]/10" : ""}>
                <span className="mr-3 font-mono text-xs text-[#D4B96A]">{String(i + 1).padStart(2, "0")}</span>
                {name}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-215 px-5 pb-15">
        <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e] uppercase opacity-80">Coffee Explorer Score</div>
        <h2 className="mb-6 font-heading text-[clamp(24px,3.5vw,36px)] leading-[1.15] font-bold text-[#0A0A10]">The Scorecard</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#8B6914]">
                <th className="p-4 text-left font-mono text-[10px] tracking-[0.1em] text-[#6b5a4e] uppercase">Coffee</th>
                <th className="p-3 text-center font-mono text-[10px] tracking-wide text-[#6b5a4e] uppercase">Taste Shock</th>
                <th className="p-3 text-center font-mono text-[10px] tracking-wide text-[#6b5a4e] uppercase">Rarity</th>
                <th className="p-3 text-center font-mono text-[10px] tracking-wide text-[#6b5a4e] uppercase">Story</th>
                <th className="p-3 text-center font-mono text-[10px] tracking-wide text-[#6b5a4e] uppercase">Worth Buying</th>
              </tr>
            </thead>
            <tbody>
              {EXPLORER_SCORES.map((row, i) => (
                <tr key={row.coffee} className={`border-b border-black/6 ${i % 2 === 1 ? "bg-[#8B6914]/2" : ""}`}>
                  <td className="p-3 pl-4 font-semibold text-[#0A0A10]">{row.coffee}</td>
                  <td className={`p-3 text-center ${row.tasteShock >= 9 ? "font-bold text-[#8B6914]" : "text-[#2d1810]"}`}>{row.tasteShock}</td>
                  <td className={`p-3 text-center ${row.rarity >= 9 ? "font-bold text-[#8B6914]" : "text-[#2d1810]"}`}>{row.rarity}</td>
                  <td className={`p-3 text-center ${row.story >= 9 ? "font-bold text-[#8B6914]" : "text-[#2d1810]"}`}>{row.story}</td>
                  <td className={`p-3 text-center ${row.worthBuying >= 9 ? "font-bold text-[#8B6914]" : "text-[#2d1810]"}`}>{row.worthBuying}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-215 px-5 pb-20">
        <div className="my-10 border-l-4 border-[#8B6914] pl-7">
          {FINAL_OBSERVATION.split("\n").map((line, i) => (
            <p key={line} className={`mb-2 font-heading leading-relaxed text-[#0A0A10] italic ${i === 0 ? "text-xl" : "text-[17px]"}`}>
              {line}
            </p>
          ))}
        </div>
      </section>

      <NextSteps
        steps={[
          { label: "Browse All Coffees", path: "/brewsoul/browse", description: "Explore the full catalog" },
          { label: "Coffee Varieties", path: "/brewsoul/varieties", description: "Deep dive into genetics" },
          { label: "BrewSoul Home", path: "/brewsoul/home", description: "Return to intelligence hub" },
        ]}
      />
    </div>
  );
}
