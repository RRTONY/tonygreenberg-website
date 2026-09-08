import type { Metadata } from "next";
import { DecafFame } from "@/components/brewsoul/decaf-fame";
import { FAME } from "@/lib/content/brewsoul-decaf";
import { DecafShame } from "@/components/brewsoul/decaf-shame";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulDecaf.tsx —
// "Paint Stripper or Pure Water?" Real 3-process breakdown (methylene
// chloride/Swiss Water/supercritical CO₂), 13 real clean-decaf brands
// ("Hall of Fame"), 10 real methylene-chloride brands ("Wall of Shame,"
// with real Clean Label Project lawsuit citations), a real carbon
// footprint comparison, real decaf health science, and a real
// price-comparison table, all ported unchanged and verbatim. Dead Manus
// hero image dropped for a CSS gradient. Legacy's redundant
// `BrewSoulLayout` wrapper dropped. Legacy also manually mutated
// `document.title`/a `<meta keywords>` tag in a `useEffect` — a real
// anti-pattern in this migration (Next.js's `generateMetadata` already
// owns the document head) — dropped in favor of the real `metadata`
// export below. The 2 genuinely interactive pieces (click-to-expand Hall
// of Fame, reveal-toggle Wall of Shame) split into
// `components/brewsoul/decaf-{fame,shame}.tsx` client islands so the
// rest stays a Server Component. Same bespoke earthy "science" palette as
// `/brewsoul/health`/`/brewsoul/prescription`/`/brewsoul/biodynamic` kept
// as the same deliberate sub-identity.
export const metadata: Metadata = {
  title: "Swiss Water Decaf: Paint Stripper or Pure Water? — BrewSoul",
  description: "Swiss Water, EA, CO2: the truth about decaf processing and what it means for your cup. 13 clean brands, 10+ brands using methylene chloride.",
  alternates: { canonical: "/brewsoul/decaf" },
  keywords: ["Swiss Water decaf", "Swiss Water Process", "chemical-free decaf", "decaffeinated coffee", "methylene chloride coffee", "CO2 decaf", "supercritical CO2 decaf", "clean decaf brands", "best decaf coffee", "organic decaf"],
};

export default function BrewSoulDecafPage() {
  const sortedByPrice = [...FAME].sort((a, b) => parseFloat(a.perOz.replace("$", "").replace("~", "")) - parseFloat(b.perOz.replace("$", "").replace("~", "")));

  return (
    <div className="bg-[#f5efe0] text-[#2d1810]">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-linear-to-br from-[#2a4c5c] via-[#1a0e08] to-[#2d1810] px-7 py-20 text-center">
        <div className="relative z-1 max-w-3xl">
          <div className="mb-6 font-mono text-[11px] tracking-[0.3em] text-[#4a7c8c] uppercase">BrewSoul · Decaf Done Right</div>
          <h1 className="mb-5 font-heading text-[clamp(36px,6vw,68px)] leading-[1.05] font-bold text-[#f5efe0] italic">
            Paint Stripper
            <br />
            or Pure Water?
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-[clamp(16px,2vw,20px)] leading-relaxed text-[#f5efe0]/70">
            85% of the world&apos;s decaf is made with methylene chloride — a chemical the EPA banned from paint strippers in 2019. The FDA still allows it
            in your coffee. Here&apos;s every brand that does it right, and every brand that doesn&apos;t.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { n: "13", u: "", l: "Clean brands (Hall of Fame)" },
              { n: "10+", u: "", l: "Dirty brands (Wall of Shame)" },
              { n: "10", u: " ppm", l: "FDA allowed MC residue" },
              { n: "0", u: " ppm", l: "MC in Swiss Water Process" },
            ].map((s) => (
              <div key={s.l} className="px-2 py-3 text-center">
                <div className="font-heading text-4xl leading-none font-bold text-[#d4a84b]">
                  {s.n}
                  <span className="text-base opacity-60">{s.u}</span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-[#e8dcc8]/70 uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">How Decaf is Made</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">Three Processes. Only Two Are Clean.</h2>

          <div className="my-7 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="relative rounded-lg border-2 border-[#9b3030] bg-white p-6">
              <div className="absolute top-3 right-3 rounded-sm bg-[#9b3030] px-2 py-1 font-mono text-[9px] tracking-wide text-white">AVOID</div>
              <div className="mb-1 text-lg font-bold text-[#9b3030]">Methylene Chloride (MC)</div>
              <div className="mb-3 font-mono text-[10px] text-[#6b5a4e]">~85% of Global Decaf</div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">
                Chemical solvent that strips caffeine from green beans. EPA banned it from paint strippers in 2019 due to worker deaths. The FDA allows 10
                ppm residue in decaf coffee. Japan and Korea have banned MC in decaf entirely. Industry uses it because it&apos;s the cheapest process. Most
                brands don&apos;t disclose method on packaging.
              </div>
              <div className="mt-3 font-mono text-[11px] font-semibold text-[#9b3030]">$0.35-0.90/oz · Cheapest process · Most flavor loss</div>
            </div>

            <div className="relative rounded-lg border-2 border-[#4a7c8c] bg-white p-6">
              <div className="absolute top-3 right-3 rounded-sm bg-[#4a7c8c] px-2 py-1 font-mono text-[9px] tracking-wide text-white">RECOMMENDED</div>
              <div className="mb-1 text-lg font-bold text-[#4a7c8c]">Swiss Water Process (SWP)</div>
              <div className="mb-3 font-mono text-[10px] text-[#6b5a4e]">~10% of Global Decaf</div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">
                Uses only water, temperature, and time. Green beans soaked in hot water to dissolve caffeine. Water passed through carbon filters to
                capture caffeine while preserving flavor compounds. 99.9% caffeine removal. Zero chemical residue. Only decaffeination method certified
                organic worldwide. Developed in British Columbia, Canada. 2026 tariff note: now subject to 35% tariff (Canadian processing). Flavor
                preservation is measurably superior in blind testing.
              </div>
              <div className="mt-3 font-mono text-[11px] font-semibold text-[#4a7c8c]">$0.92-2.50/oz · Best flavor retention · Zero chemicals</div>
            </div>

            <div className="relative rounded-lg border-2 border-[#7a8c6e] bg-white p-6">
              <div className="absolute top-3 right-3 rounded-sm bg-[#7a8c6e] px-2 py-1 font-mono text-[9px] tracking-wide text-white">ALSO CLEAN</div>
              <div className="mb-1 text-lg font-bold text-[#4a5e3c]">Supercritical CO₂ Process</div>
              <div className="mb-3 font-mono text-[10px] text-[#6b5a4e]">~5% of Global Decaf</div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">
                Carbon dioxide pressurized to supercritical state (liquid-gas hybrid) acts as selective solvent for caffeine. No chemical residue.
                Excellent flavor retention. CO₂ is naturally present in air and our bodies. More expensive than both MC and SWP. Less widely available in
                US retail. Growing in European specialty market. Some premium brands use this but labeling is inconsistent — ask directly.
              </div>
              <div className="mt-3 font-mono text-[11px] font-semibold text-[#4a5e3c]">$1.50-3.00/oz · Best of science · Limited availability</div>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-[#1a0e08] p-6">
            <div className="mb-2 font-mono text-[11px] tracking-wide text-[#c4873b]">The Label Test</div>
            <p className="text-[17px] leading-[1.7] text-[#f5efe0]/88">
              If the packaging doesn&apos;t explicitly say &ldquo;Swiss Water Process&rdquo;, &ldquo;chemical-free&rdquo;, &ldquo;solvent-free&rdquo;,
              &ldquo;water processed&rdquo;, or &ldquo;certified organic&rdquo; — assume methylene chloride. The FDA does not require disclosure of
              decaffeination method. Also: instant decaf coffee is almost universally MC-processed AND has higher mycotoxin levels than whole bean. Double
              risk, zero transparency.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">Hall of Fame — Clean Decaf</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">13 Brands That Do It Right</h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Every brand below uses Swiss Water Process or supercritical CO₂. Zero methylene chloride. Sorted by overall value equation: quality,
            certifications, transparency, and price.
          </p>

          <DecafFame />

          <div className="my-7 rounded-lg bg-[#1a0e08] p-6">
            <div className="mb-2 font-mono text-[11px] tracking-[0.15em] text-[#c4873b]">2026 Tariff Alert</div>
            <p className="text-[17px] leading-[1.7] text-[#f5efe0]/88">
              Swiss Water Process decaf is now subject to a 35% tariff (processing facility is in Canada). This is pushing prices up across every SWP brand
              in 2026. The simplification play: buy in bulk now, lock in pre-escalation pricing. Subtle Earth at $0.75/oz in 2lb bags is the best hedge. Or
              subscribe to Holistic Roasters at 20% off for the biodynamic SWP decaf.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-[#5c1a1a] to-[#1a0e08] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8]/80 uppercase">Wall of Shame — Chemical Decaf</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#f5efe0] italic">These Brands Use Paint Stripper Chemistry</h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#f5efe0]/88">
            Every brand below uses methylene chloride (or doesn&apos;t disclose method, which defaults to MC). Data from Clean Label Project testing, public
            lawsuits, and brand disclosure research. The FDA allows 10 ppm MC residue. The EPA&apos;s preferred maximum for MC in drinking water is 0 ppb.
            Japan and Korea banned MC in decaf entirely.
          </p>
          <DecafShame />
        </div>
      </section>

      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">Environmental Impact</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">Carbon Footprint: Which Process Wins?</h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Decaffeination isn&apos;t just about what ends up in your cup — it&apos;s about what ends up in the atmosphere. The three processes have
            dramatically different energy profiles, water usage, and total carbon emissions per kilogram of decaf produced.
          </p>

          <div className="my-7 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="rounded-lg border border-[#5d3a28]/8 border-t-4 border-t-[#4a7c8c] bg-white p-6">
              <div className="mb-2 font-mono text-[10px] tracking-wide text-[#4a7c8c]">Lowest Footprint</div>
              <div className="mb-1 text-lg font-bold text-[#1a0e08]">Swiss Water Process</div>
              <div className="my-3 font-heading text-[36px] font-bold text-[#4a7c8c]">
                ~0.8 <span className="text-base">kg CO₂e/kg</span>
              </div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">
                Closed-loop water recycling system. No chemical production chain. No high-pressure equipment. Carbon filtration is passive and low-energy.
                The Green Coffee Extract (GCE) is reused across batches — not discarded. Water is filtered and recirculated, not discharged. Single facility
                in Burnaby, BC runs on BC Hydro (95% renewable).
              </div>
              <div className="mt-3 rounded-sm bg-[#4a7c8c]/8 px-3.5 py-2.5">
                <div className="font-mono text-[10px] text-[#4a7c8c]">Why It Wins</div>
                <div className="mt-1 text-xs text-[#2d1810]">
                  No chemical manufacturing upstream. No solvent disposal downstream. Water recycled in closed loop. Powered by near-100% renewable grid.
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#5d3a28]/8 border-t-4 border-t-[#7a8c6e] bg-white p-6">
              <div className="mb-2 font-mono text-[10px] tracking-wide text-[#7a8c6e]">Moderate Footprint</div>
              <div className="mb-1 text-lg font-bold text-[#1a0e08]">Supercritical CO₂</div>
              <div className="my-3 font-heading text-[36px] font-bold text-[#7a8c6e]">
                ~2.5 <span className="text-base">kg CO₂e/kg</span>
              </div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">
                Requires pressurizing CO₂ to 73+ atmospheres (1,070+ psi) at temperatures above 31°C. High-pressure pumps and heating systems are
                energy-intensive. CO₂ can be recycled between batches, but maintaining supercritical state consumes significant electricity. No chemical
                waste, but 3× the energy of SWP.
              </div>
              <div className="mt-3 rounded-sm bg-[#7a8c6e]/8 px-3.5 py-2.5">
                <div className="font-mono text-[10px] text-[#7a8c6e]">The Trade-Off</div>
                <div className="mt-1 text-xs text-[#2d1810]">Clean output (no residue) but energy-hungry process. Best flavor retention of any method. Premium price reflects the energy cost.</div>
              </div>
            </div>

            <div className="rounded-lg border border-[#5d3a28]/8 border-t-4 border-t-[#9b3030] bg-white p-6">
              <div className="mb-2 font-mono text-[10px] tracking-wide text-[#9b3030]">Hidden Footprint</div>
              <div className="mb-1 text-lg font-bold text-[#1a0e08]">Methylene Chloride</div>
              <div className="my-3 font-heading text-[36px] font-bold text-[#9b3030]">
                ~1.8 <span className="text-base">kg CO₂e/kg</span>
              </div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">
                Process itself uses less energy (ambient pressure). But the full lifecycle tells a different story: MC production is petrochemical-derived
                (chlorination of methane). MC has a Global Warming Potential of ~9. Chemical disposal and wastewater treatment add hidden emissions. Worker
                safety infrastructure adds overhead.
              </div>
              <div className="mt-3 rounded-sm bg-[#9b3030]/8 px-3.5 py-2.5">
                <div className="font-mono text-[10px] text-[#9b3030]">The Hidden Cost</div>
                <div className="mt-1 text-xs text-[#2d1810]">
                  Looks moderate on paper, but externalities (chemical production, disposal, health costs, regulatory compliance) aren&apos;t priced in.
                  True cost is likely 2-3× higher.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-[#1a0e08] p-7">
            <div className="mb-3 font-mono text-[11px] tracking-[0.15em] text-[#c4873b]">The Verdict</div>
            <div className="mb-4 font-heading text-[clamp(20px,3vw,28px)] leading-[1.3] font-bold text-[#f5efe0] italic">
              Swiss Water Process wins on every environmental metric.
            </div>
            <p className="text-[17px] leading-[1.7] text-[#f5efe0]/88">
              Lowest carbon emissions. Zero chemical waste. Closed-loop water system. Powered by renewable energy. The only trade-off is capacity —
              there&apos;s one SWP facility on earth, in Burnaby, British Columbia. That&apos;s both the vulnerability (tariff exposure, single point of
              failure) and the opportunity: expanding chemical-free decaffeination infrastructure is a direct climate investment. If you care about what
              goes into your body AND what goes into the atmosphere, Swiss Water Process is the only answer that satisfies both.
            </p>
          </div>

          <div className="mt-4 font-mono text-[10px] tracking-wide text-[#6b5a4e]">
            Sources: De Marco et al. 2017 (LCA of supercritical CO₂ decaffeination) · Swiss Water Decaffeinated Coffee Company sustainability reports ·
            Christopher Montrose Coffee environmental analysis · Life Cycle Assessment of Decaffeinated Coffee Beans Production (Shofinita et al. 2025)
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">Decaf Health Science</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">What You Keep, What You Lose</h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Decaf isn&apos;t nutritionally empty. The decaffeination process preserves most bioactive compounds. But there are real tradeoffs to
            understand — especially for those choosing decaf for sleep optimization or heart health.
          </p>

          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            <div className="rounded-md border border-[#5d3a28]/8 border-t-3 border-t-[#3a7a4a] bg-white p-5">
              <div className="mb-2 font-mono text-[10px] tracking-wide text-[#3a7a4a]">Preserved in Decaf</div>
              {["Chlorogenic acid (CGA) — most retained", "Polyphenols — largely preserved", "Melanoidins — fully preserved (formed in roasting)", "Minerals (Mg, K) — fully preserved", "Trigonelline — largely preserved", "Low-acid benefit — maintained", "Antioxidant capacity — 70-80% retained"].map((item, i, arr) => (
                <div key={item} className={`py-1.5 text-[13px] leading-snug text-[#2d1810] ${i < arr.length - 1 ? "border-b border-[#5d3a28]/4" : ""}`}>
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-md border border-[#5d3a28]/8 border-t-3 border-t-[#8b4c2a] bg-white p-5">
              <div className="mb-2 font-mono text-[10px] tracking-wide text-[#8b4c2a]">Reduced or Lost in Decaf</div>
              {["Caffeine — 99.9% removed (SWP)", "Neuroprotective effect — caffeinated coffee linked to lower Parkinson's risk; decaf shows weaker association", "Metabolic boost — caffeine's 3-11% metabolism increase lost", "Cognitive stimulation — adenosine receptor antagonism removed", "Some volatile aromatics — slight reduction in complexity", "Mycotoxin risk — decaf and instant coffee have HIGHER mycotoxin levels (choose mold-tested brands)"].map((item, i, arr) => (
                <div key={item} className={`py-1.5 text-[13px] leading-snug text-[#2d1810] ${i < arr.length - 1 ? "border-b border-[#5d3a28]/4" : ""}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border-l-4 border-l-[#4a7c8c] bg-[#ede4d0] p-6">
            <div className="mb-2 text-sm font-bold text-[#1a0e08]">The Simplification Case for Decaf</div>
            <p className="text-[17px] leading-[1.7] text-[#2d1810]">
              If you&apos;re drinking coffee after 2pm, switch to biodynamic SWP decaf. You keep 70-80% of the antioxidant benefit, lose the sleep
              disruption, and avoid the cortisol spike. One morning biodynamic caffeinated cup + one afternoon biodynamic SWP decaf = maximum nutrient
              density across the full day with minimal downside. This is fewer cups, better cups, right timing.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">Complete Price Map</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">Every Clean Decaf, Ranked by Value</h2>
          <div className="overflow-x-auto rounded-lg bg-white">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {["Brand", "$/oz", "Process", "Certs", "Tier"].map((h) => (
                    <th key={h} className="border-b-2 border-[#c4873b] px-2.5 py-3 text-left font-mono text-[9px] tracking-wide text-[#6b5a4e] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedByPrice.map((b, i) => (
                  <tr key={b.name} className={`${i % 2 === 1 ? "bg-[#f5efe0]/30" : ""} ${b.tier === "LEGENDARY" ? "border-l-3 border-l-[#c4873b]" : ""}`}>
                    <td className="p-2.5 text-sm font-semibold text-[#2d1810]">{b.name}</td>
                    <td className="p-2.5 font-mono text-[13px] font-bold text-[#c4873b]">{b.perOz}</td>
                    <td className="p-2.5 text-[#5c3a28]">{b.process}</td>
                    <td className="p-2.5 text-xs text-[#5c3a28]">{b.cert}</td>
                    <td className="p-2.5">
                      <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-white ${b.colorClass}`}>{b.tier}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-[#1a0e08] to-[#2d1810] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8]/80 uppercase">The ABIT Angle</div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#f5efe0] italic">Decaf as Impact Infrastructure</h2>
          <p className="max-w-180 text-[17px] leading-[1.7] text-[#f5efe0]/88">
            The Swiss Water Process facility in British Columbia is a single point of failure for clean decaf worldwide. There is no second SWP facility.
            This creates both risk (tariff exposure, capacity constraints) and opportunity: a tokenized community investment in expanding chemical-free
            decaffeination capacity would directly serve the Great Simplification — more people drinking cleaner coffee for less systemic cost. The
            biodynamic farms producing beans for the world&apos;s first biodynamic decaf (18 Conejo, Honduras) are already B-Corp-adjacent,
            Demeter-certified, and generating verifiable impact data. The entire chain — from regenerative farm to SWP facility to conscious consumer — is
            a ready-made ABIT pipeline.
          </p>
        </div>
      </section>

      <section className="bg-[#f5efe0] px-7 py-14">
        <div className="mx-auto max-w-275">
          <NextSteps
            steps={[
              { label: "Biodynamic Coffee Census", path: "/brewsoul/biodynamic", description: "Every Demeter-certified farm and roaster on earth" },
              { label: "Coffee & Health", path: "/brewsoul/health", description: "Peer-reviewed research on what coffee does to your body" },
              { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "AI-powered personalized recommendation" },
            ]}
          />
        </div>
      </section>

      <footer className="bg-[#1a0e08] px-7 py-12 text-center">
        <div className="mb-2 font-heading text-2xl font-bold text-[#f5efe0] italic">BrewSoul · Decaf</div>
        <div className="mx-auto mb-4 max-w-125 text-sm leading-relaxed text-[#f5efe0]/50">13 clean brands. 10+ dirty brands. Every decaffeination process explained. Zero compromise.</div>
        <div className="font-mono text-[10px] tracking-wide text-[#f5efe0]/30">All prices USD · Clean Label Project data · Verified Feb 2026</div>
      </footer>
    </div>
  );
}
