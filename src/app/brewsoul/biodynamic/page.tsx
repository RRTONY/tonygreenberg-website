import type { Metadata } from "next";
import { BiodynamicFarms } from "@/components/brewsoul/biodynamic-farms";
import { BiodynamicRoasters } from "@/components/brewsoul/biodynamic-roasters";
import { CostCalculator } from "@/components/brewsoul/cost-calculator";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulBiodynamic.tsx —
// the complete real census of Demeter-certified biodynamic coffee: 3
// real source farms, 6 real roasters/brands with real product tables and
// pricing, real nutritional-science compounds, a real cost calculator,
// and a real impact/tokenization section, all ported unchanged and
// verbatim. Dead Manus hero image dropped for a CSS gradient. Legacy's
// redundant `BrewSoulLayout` wrapper dropped. The 3 genuinely interactive
// pieces (click-to-expand farms, click-to-expand roasters, the
// cups-per-day cost slider) are split into `BiodynamicFarms`/
// `BiodynamicRoasters`/`CostCalculator` client islands so the rest stays
// a Server Component. Same bespoke earthy "science" palette as
// `/brewsoul/health` and `/brewsoul/prescription` kept as the same
// deliberate sub-identity.
export const metadata: Metadata = {
  title: "Biodynamic Coffee — BrewSoul",
  description: "The complete census of Demeter-certified biodynamic coffee — 3 farms, 6 roasters, and the science of why it matters.",
  alternates: { canonical: "/brewsoul/biodynamic" },
};

const TIER_COMPARE = [
  { t: "Conventional", items: ["Up to 250 lbs chemicals/acre", "42 pesticides used globally", "No mold testing required", "Soil degradation over time", "No biodiversity requirements", "No supply chain transparency", "$0.40-0.60/oz"], borderClass: "border-t-[#8b4c2a]", textClass: "text-[#8b4c2a]" },
  { t: "USDA Organic", items: ["No synthetic pesticides", "Natural pesticides allowed (kill pollinators)", "No mold testing required", "Soil preservation (not regeneration)", "No shade or canopy requirements", "Supply chain audited annually", "$0.65-0.90/oz"], borderClass: "border-t-[#7a8c6e]", textClass: "text-[#7a8c6e]" },
  { t: "Demeter Biodynamic", items: ["Zero pesticides of any kind", "Pollinators fully protected", "Lab tested: mold, mycotoxins, heavy metals", "Active soil regeneration + carbon sequestration", "40%+ shade canopy, 12+ tree species", "Full origin-to-cup traceability", "$1.30-1.90/oz"], borderClass: "border-t-[#c4873b]", textClass: "text-[#c4873b]" },
];

const SCIENCE = [
  { compound: "Chlorogenic Acid (CGA)", amount: "27-121 mg/cup", effect: "Antioxidant, anti-inflammatory, lowers blood pressure via RAAS inhibition, neuroprotective. 500mg/day reduced weight 1.3kg in meta-analysis. Organic has 15-20% more CGA than conventional.", source: "Nutrients 2024; Zalewska 2025; Warsaw Univ 2020" },
  { compound: "Polyphenols (total)", amount: "200-550 mg/cup", effect: "Coffee is #1 dietary antioxidant source in Western diet. Organic coffee has 27% more polyphenols. Light roast preserves most. Anti-aging, anti-cancer mechanisms documented.", source: "Plant Foods for Human Nutrition 2011; PMC 2025" },
  { compound: "Caffeine", amount: "80-120 mg/cup", effect: "Adenosine receptor antagonist. Cognitive enhancement. Reduced Parkinson's risk (caffeinated > decaf for neurodegeneration). Stimulates metabolism 3-11%.", source: "Frontiers in Nutrition 2025" },
  { compound: "Trigonelline", amount: "40-110 mg/cup", effect: "Neuroprotective, glucose regulation, antibacterial. Converts to niacin (vitamin B3) during roasting. Higher in lighter roasts.", source: "Molecules 2023" },
  { compound: "Melanoidins", amount: "Formed in roasting", effect: "Prebiotic, antioxidant, antimicrobial. Support gut microbiome diversity. Higher in darker roasts. Complement CGA's benefits.", source: "IP J Nutr Metab 2024" },
  { compound: "Cafestol & Kahweol", amount: "Method-dependent", effect: "Diterpenes with anti-cancer and liver-protective properties. Highest in unfiltered brew (French press, Turkish, espresso). Filtered coffee has minimal amounts.", source: "Molecules 2024" },
];

const IMPACT_METRICS = [
  { n: "15-25", u: "tons CO₂/ha/yr", d: "Mature shade canopy carbon sequestration — on-chain verifiable via soil carbon analysis" },
  { n: "120+", u: "bird species", d: "Smithsonian Bird Friendly metrics — biodiversity data as impact credits" },
  { n: "2-4", u: "tons organic matter/ha/yr", d: "Soil regeneration via natural mulching — measurable soil health improvement" },
  { n: "$0.38", u: "per cup impact", d: "Every biodynamic cup is a micro-investment in ecosystem restoration" },
];

export default function BrewSoulBiodynamicPage() {
  return (
    <div className="bg-[#f5efe0] text-[#2d1810]">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-linear-to-br from-[#1a0e08] via-[#2d1810] to-[#2d3a24] px-7 py-20 text-center">
        <div className="relative z-1 max-w-3xl">
          <div className="mb-6 font-mono text-[11px] tracking-[0.3em] text-[#7a8c6e] uppercase">BrewSoul · Biodynamic Coffee</div>
          <h1 className="mb-5 font-heading text-[clamp(36px,6vw,68px)] leading-[1.05] font-bold text-[#f5efe0] italic">
            Every Farm on Earth
            <br />
            That Grows It Right
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-[clamp(16px,2vw,20px)] leading-relaxed text-[#f5efe0]/70">
            The complete census of Demeter-certified biodynamic coffee. Three farms. Six roasters. Zero pesticides. This is the entire market — and it&apos;s
            all you need.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { n: "3", l: "Certified farms worldwide" },
              { n: "6", l: "Roasters / brands" },
              { n: "0", l: "Pesticides of any kind" },
              { n: "1924", l: "Year biodynamic farming began" },
            ].map((s) => (
              <div key={s.l} className="px-2 py-3 text-center">
                <div className="font-heading text-4xl leading-none font-bold text-[#d4a84b]">{s.n}</div>
                <div className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-[#e8dcc8]/70 uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">The Great Simplification</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">
            Less Coffee. Better Coffee. Better Planet.
          </h2>
          <p className="mb-4.5 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            The biodynamic market is small on purpose. Only three farms in the world carry Demeter certification for coffee. Only six roasters process and
            sell it. This isn&apos;t a limitation — it&apos;s proof that regenerative agriculture can&apos;t be faked at scale. You&apos;re not choosing
            between 200 brands competing on marketing. You&apos;re choosing between a handful of families who&apos;ve dedicated decades to treating soil as
            a living system.
          </p>
          <p className="max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Organic coffee contains 15-20% more chlorogenic acid and 27% more polyphenols than conventional (Warsaw University of Life Sciences, 2020).
            Biodynamic goes further: zero pesticides of any kind (organic still allows rotenone, ryania, sabadilla — all pollinator killers), third-party
            mold and heavy metal testing, and active carbon sequestration. One biodynamic cup does what 2-3 conventional cups attempt nutritionally.
          </p>

          <div className="my-8 grid gap-6 rounded-lg bg-[#1a0e08] p-8 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {TIER_COMPARE.map((t) => (
              <div key={t.t} className={`rounded-md border border-white/10 bg-white/5 p-6 border-t-3 ${t.borderClass}`}>
                <div className={`mb-4 font-mono text-[11px] font-semibold tracking-[0.15em] uppercase ${t.textClass}`}>{t.t}</div>
                {t.items.map((item, i) => (
                  <div key={item} className={`py-2 text-[13px] leading-snug text-[#e8dcc8] ${i < t.items.length - 1 ? "border-b border-white/6" : ""}`}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-[#2d3a24] to-[#1a0e08] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8]/80 uppercase">Source Farms — Complete Global Census</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#f5efe0] italic">
            3 Farms. That&apos;s the Entire World Supply.
          </h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#f5efe0]/88">
            Every Demeter-certified biodynamic coffee bean on earth comes from one of these three farms. There are no others. This radical scarcity is
            intentional — Demeter certification takes years to achieve and demands the farm operate as a complete living organism with on-site composting,
            animal integration, and zero external chemical inputs.
          </p>
          <BiodynamicFarms />
        </div>
      </section>

      <section className="bg-[#f5efe0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">All Roasters & Brands — Complete Market</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">6 Ways to Buy Biodynamic Coffee</h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Every roaster below sources from the same 3 farms. The differences are in roasting expertise, testing transparency, packaging, price, and
            availability. Ranked by overall value equation.
          </p>
          <BiodynamicRoasters />
          <CostCalculator />
        </div>
      </section>

      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">Nutritional Science</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">What&apos;s Actually in a Biodynamic Cup</h2>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {SCIENCE.map((c) => (
              <div key={c.compound} className="rounded-md border border-[#5d3a28]/8 bg-white p-5">
                <div className="text-sm font-bold text-[#1a0e08]">{c.compound}</div>
                <div className="my-1 font-mono text-xs font-semibold text-[#c4873b]">{c.amount}</div>
                <div className="mb-2 text-[13px] leading-snug text-[#5c3a28]">{c.effect}</div>
                <div className="font-mono text-[9px] text-[#6b5a4e]">{c.source}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border-l-4 border-l-[#4a5e3c] bg-white p-6">
            <div className="mb-2 text-sm font-bold text-[#1a0e08]">The Light Roast Advantage for Biodynamic</div>
            <p className="text-[17px] leading-[1.7] text-[#2d1810]">
              CGA drops dramatically with roast level. If you&apos;re drinking biodynamic for maximum health value, choose light or medium roast. Light
              roast biodynamic is the highest-density nutritional cup per dollar — fewer cups needed, more active compounds per sip. Dark roast trades CGA
              for melanoidins (different benefit profile). The simplification principle: light roast biodynamic = maximum nutrient density = fewer cups =
              less consumption for more benefit.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-[#1a0e08] to-[#2d1810] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8]/80 uppercase">Tokenizable Impact</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#f5efe0] italic">From Cup to Community: The ABIT Connection</h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#f5efe0]/88">
            Biodynamic coffee farms generate measurable, verifiable environmental outcomes that map directly to Asset-Backed Impact Tokens. Every hectare
            produces quantifiable data: CO₂ sequestered, species supported, soil carbon content, water filtration. These farms are B-Corp certified,
            regenerative, and produce both revenue (coffee sales) and verified impact (carbon credits, biodiversity metrics). A community of retail token
            holders becomes the demand engine — co-investment as co-creation.
          </p>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            {IMPACT_METRICS.map((m) => (
              <div key={m.u} className="rounded-md border border-white/8 bg-white/4 p-5">
                <div className="font-heading text-[28px] leading-[1.1] font-bold text-[#d4a84b]">{m.n}</div>
                <div className="mb-2.5 font-mono text-[10px] tracking-wide text-[#c4873b]">{m.u}</div>
                <div className="text-[13px] leading-snug text-[#f5efe0]/60">{m.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe0] px-7 py-14">
        <div className="mx-auto max-w-275">
          <NextSteps
            steps={[
              { label: "Decaf Done Right", path: "/brewsoul/decaf", description: "Swiss Water vs. paint stripper — the complete decaf guide" },
              { label: "Coffee & Health", path: "/brewsoul/health", description: "Peer-reviewed research on what coffee does to your body" },
              { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "AI-powered personalized recommendation" },
            ]}
          />
        </div>
      </section>

      <footer className="bg-[#1a0e08] px-7 py-12 text-center">
        <div className="mb-2 font-heading text-2xl font-bold text-[#f5efe0] italic">BrewSoul · Biodynamic</div>
        <div className="mx-auto mb-4 max-w-125 text-sm leading-relaxed text-[#f5efe0]/50">
          Complete census of every Demeter-certified biodynamic coffee on earth. 3 farms. 6 roasters. Zero compromise.
        </div>
        <div className="font-mono text-[10px] tracking-wide text-[#f5efe0]/30">All prices USD · Data verified Feb 2026 · Peer-reviewed sources</div>
      </footer>
    </div>
  );
}
