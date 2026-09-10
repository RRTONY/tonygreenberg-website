import type { Metadata } from "next";
import { Clock, Coffee, Moon, Sun } from "lucide-react";
import { HealthRisks } from "@/components/brewsoul/health-risks";
import { HealthCompounds } from "@/components/brewsoul/health-compounds";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulHealthFull.tsx —
// the comprehensive, peer-reviewed coffee & health deep-dive (real 8
// longevity findings with real citations/participant counts, 7 real
// risks with severity ratings, CYP1A2 caffeine-metabolism genetics, a
// 6-step chronobiology timing schedule, 8 real bioactive compounds, 3
// real mycotoxin threats, and a 3-step "simplification protocol"), all
// ported unchanged and verbatim. Legacy's dead Manus hero image
// (`/api/img/brewsoul-orig_84eb4bc9.jpg`, same confirmed-404 proxy used
// throughout Phase 6) dropped for a CSS gradient. Legacy wrapped this
// page in its own `BrewSoulLayout` import — redundant here since
// `app/brewsoul/layout.tsx` already wraps every `/brewsoul/*` route in
// the real shared nav/footer/CategoryBadge, so this renders as plain page
// content. The two genuinely interactive pieces (the "show all risks"
// toggle, and per-compound click-to-expand) are split into
// `HealthRisks`/`HealthCompounds` client islands so the rest of the page
// stays a Server Component. Legacy's bespoke earthy "science" palette
// (distinct from the rest of BrewSoul's amber/gold commercial palette —
// soil/clay/sage/moss tones) is kept as a deliberate one-off sub-identity
// for this one page, same reasoning as `/attention-theft`'s own "crusade"
// palette elsewhere in this migration — not merged into the standard
// BrewSoul tokens.
export const metadata: Metadata = {
  title: "Coffee and Health — BrewSoul",
  description:
    "The complete science of coffee and health: longevity, cognition, cardiovascular effects, caffeine genetics, and mycotoxin risk. Every claim cited.",
  alternates: { canonical: "/brewsoul/health" },
};

const LONGEVITY = [
  {
    title: "All-Cause Mortality",
    finding: "3-5 cups/day → 15% lower risk of death from any cause",
    study: "Poole et al., BMJ 2017",
    n: ">1M participants",
  },
  {
    title: "Type 2 Diabetes",
    finding: "Each daily cup → 6% lower risk. One of the most robust findings in coffee research.",
    study: "Ding et al., Diabetes Care 2014",
    n: "1.1M participants, 28 studies",
  },
  {
    title: "Liver Protection",
    finding:
      "2+ cups/day → 44% lower cirrhosis risk, 40% lower liver cancer risk. Coffee is the #1 dietary protector of the liver.",
    study: "Kennedy et al., Alimentary Pharmacology 2016",
    n: "430K participants",
  },
  {
    title: "Cardiovascular Disease",
    finding:
      "3-5 cups/day → 15% lower CVD risk. J-shaped curve: moderate intake protective, extreme intake neutral.",
    study: "Ding et al., Circulation 2014",
    n: "1.3M participants",
  },
  {
    title: "Parkinson's Disease",
    finding:
      "25-30% lower risk with regular consumption. Caffeine appears to be the protective compound — decaf shows weaker association.",
    study: "Qi & Li, Geriatrics & Gerontology International 2014",
    n: "680K participants",
  },
  {
    title: "Depression",
    finding: "4+ cups/day → 20% lower risk. Caffeine's dopaminergic effects may be protective.",
    study: "Wang et al., Australian & NZ Journal of Psychiatry 2016",
    n: "346K participants",
  },
  {
    title: "Colorectal Cancer",
    finding:
      "4+ cups/day → 15% lower risk. Both caffeinated and decaf show benefit, suggesting polyphenols are the active agent.",
    study: "Gan et al., BMC Cancer 2017",
    n: "5.4M participants",
  },
  {
    title: "Alzheimer's Disease",
    finding:
      "3-5 cups/day → 65% lower risk in midlife drinkers. Caffeine may block beta-amyloid accumulation.",
    study: "Eskelinen et al., Journal of Alzheimer's Disease 2009",
    n: "1,409 participants, 21-year follow-up",
  },
];

const RISKS: {
  title: string;
  detail: string;
  citation: string;
  severity: "HIGH" | "MODERATE" | "LOW";
}[] = [
  {
    title: "Sleep Disruption",
    detail:
      "Caffeine half-life: 5-6 hours. A 2pm coffee means 50% still active at 8pm. Even if you 'fall asleep fine,' caffeine reduces deep sleep by 20%. This is the #1 risk.",
    citation: "Drake et al., J Clinical Sleep Medicine 2013",
    severity: "HIGH",
  },
  {
    title: "Anxiety Amplification",
    detail:
      "Blocks adenosine → amplifies anxiety in susceptible individuals. 400mg+ can trigger panic attacks. CYP1A2 slow metabolizers are 2-3x more vulnerable.",
    citation: "Lara, Food & Chemical Toxicology 2010",
    severity: "MODERATE",
  },
  {
    title: "Pregnancy",
    detail:
      "WHO: <200mg/day. Higher intake → lower birth weight, possible miscarriage risk. Caffeine crosses the placenta freely. Fetal liver cannot metabolize caffeine until after birth.",
    citation: "WHO Guidelines 2016; Chen et al., BMC Medicine 2016",
    severity: "HIGH",
  },
  {
    title: "Cortisol Spike",
    detail:
      "Coffee raises cortisol 30-50% within 30 min. If consumed on an empty stomach at wake, it amplifies the cortisol awakening response (CAR). Optimal: wait 90-120 min after waking.",
    citation: "Lovallo et al., Pharmacology Biochemistry & Behavior 2005",
    severity: "MODERATE",
  },
  {
    title: "Bone Density",
    detail:
      "Very high intake (>4 cups/day) may slightly reduce calcium absorption. Easily offset by adequate calcium intake. Minor concern for most people.",
    citation: "Heaney, Food & Chemical Toxicology 2002",
    severity: "LOW",
  },
  {
    title: "Acid Reflux / GERD",
    detail:
      "Coffee relaxes the lower esophageal sphincter in some individuals. Cold brew and low-acid varieties (Lifeboost, Purity) significantly reduce this effect.",
    citation: "Kim et al., Diseases of the Esophagus 2014",
    severity: "MODERATE",
  },
  {
    title: "Iron Absorption",
    detail:
      "Polyphenols in coffee reduce non-heme iron absorption by up to 39% when consumed with meals. Separate coffee from iron-rich meals by 1 hour.",
    citation: "Morck et al., American Journal of Clinical Nutrition 1983",
    severity: "MODERATE",
  },
];

const CAFFEINE_METABOLISM = [
  {
    gene: "CYP1A2 — Fast Metabolizer",
    pct: "~50% of population",
    halfLife: "2-4 hours",
    effect: "Coffee is protective. 2-3 cups/day associated with lower heart attack risk.",
    advice:
      "You can drink coffee later in the day with less sleep impact. Still cut off by 2pm for optimal sleep.",
    fast: true,
  },
  {
    gene: "CYP1A2 — Slow Metabolizer",
    pct: "~50% of population",
    halfLife: "6-10 hours",
    effect: "Coffee may increase heart attack risk at high doses. Anxiety more likely.",
    advice:
      "Limit to 1-2 cups before noon. Switch to decaf after 10am. Your genetics make timing critical.",
    fast: false,
  },
];

const COMPOUNDS = [
  {
    name: "Chlorogenic Acid (CGA)",
    amount: "70-350mg per cup",
    effect:
      "Primary antioxidant. Anti-inflammatory, blood sugar regulation, neuroprotective. 15-20% higher in organic coffee. Drops dramatically with dark roasting.",
    source: "Farah & Donangelo, Brazilian Journal of Plant Physiology 2006",
    preserved: true,
  },
  {
    name: "Caffeine",
    amount: "80-200mg per cup",
    effect:
      "Adenosine receptor antagonist. Improves alertness, reaction time, endurance. Raises cortisol and adrenaline. Half-life 5-6 hours.",
    source: "McLellan et al., Neuroscience & Biobehavioral Reviews 2016",
    preserved: false,
  },
  {
    name: "Trigonelline",
    amount: "40-110mg per cup",
    effect:
      "Neuroprotective. Converts to niacin (vitamin B3) during roasting. Anti-bacterial properties. May protect against Parkinson's.",
    source: "Zhou et al., Food Chemistry 2012",
    preserved: true,
  },
  {
    name: "Melanoidins",
    amount: "Variable (formed in roasting)",
    effect:
      "Antioxidant, prebiotic, anti-inflammatory. Higher in dark roasts. Bind to heavy metals in the gut. Unique to roasted coffee.",
    source: "Moreira et al., Food & Function 2012",
    preserved: true,
  },
  {
    name: "Diterpenes (Cafestol & Kahweol)",
    amount: "1-7mg per cup (method dependent)",
    effect:
      "Anti-cancer properties but raise LDL cholesterol. Paper filters remove 95%+. French press and espresso retain them.",
    source: "Gross et al., Molecular Nutrition & Food Research 2017",
    preserved: true,
  },
  {
    name: "Polyphenols",
    amount: "200-550mg per cup",
    effect:
      "Antioxidant, anti-inflammatory, gut microbiome support. 27% higher in biodynamic/organic. Coffee is the #1 polyphenol source in Western diet.",
    source: "Vinson et al., J Agricultural & Food Chemistry 2005",
    preserved: true,
  },
  {
    name: "Magnesium",
    amount: "7-24mg per cup",
    effect:
      "Supports 300+ enzymatic reactions. Most Americans are deficient. Coffee contributes meaningfully to daily intake.",
    source: "USDA FoodData Central",
    preserved: true,
  },
  {
    name: "Potassium",
    amount: "116mg per cup",
    effect:
      "Electrolyte balance, heart rhythm, muscle function. A 3-cup habit provides ~350mg — 7% of daily needs.",
    source: "USDA FoodData Central",
    preserved: true,
  },
];

const MYCOTOXINS = [
  {
    toxin: "Ochratoxin A (OTA)",
    source: "Aspergillus & Penicillium molds",
    risk: "Kidney damage, immunosuppression, possible carcinogen (Group 2B). Found in 33-80% of commercial coffee samples.",
    solution:
      "Buy mold-tested brands. Wet-processed > natural. Light roast retains more OTA than dark.",
  },
  {
    toxin: "Aflatoxin B1",
    source: "Aspergillus flavus",
    risk: "Most potent natural carcinogen known. Liver cancer. Found primarily in improperly stored green beans.",
    solution:
      "Specialty grade coffee has lower risk. Biodynamic/organic farms with proper drying protocols are safest.",
  },
  {
    toxin: "Acrylamide",
    source: "Formed during roasting (Maillard reaction)",
    risk: "Possible carcinogen (Group 2A). Higher in light roasts. Lower in dark roasts (paradox: dark roast destroys CGA but also destroys acrylamide).",
    solution:
      "Medium roast is the optimal tradeoff. Or choose brands that test and disclose levels.",
  },
];

const TIMING = [
  {
    time: "5:00-7:00 AM",
    label: "Wake",
    advice:
      "Don't drink coffee yet. Cortisol is naturally peaking (CAR). Coffee amplifies cortisol unnecessarily and builds tolerance faster.",
    icon: Sun,
  },
  {
    time: "7:30-9:30 AM",
    label: "Optimal Window 1",
    advice:
      "Cortisol dips. This is the ideal first cup. Maximum alertness benefit, minimum cortisol interference.",
    icon: Coffee,
  },
  {
    time: "9:30-11:30 AM",
    label: "Cortisol Dip 2",
    advice:
      "Second cup if needed. Still within the safe window for sleep. CYP1A2 fast metabolizers can push to 11:30.",
    icon: Coffee,
  },
  {
    time: "12:00-2:00 PM",
    label: "Last Call",
    advice:
      "Absolute last caffeinated cup for slow metabolizers. Fast metabolizers can push to 2pm. After this, switch to decaf.",
    icon: Clock,
  },
  {
    time: "2:00-5:00 PM",
    label: "Decaf Only",
    advice:
      "Switch to Swiss Water Process decaf. You keep 70-80% of antioxidants, zero sleep disruption. Biodynamic SWP decaf is the optimal afternoon choice.",
    icon: Coffee,
  },
  {
    time: "5:00 PM+",
    label: "No Coffee",
    advice:
      "Even decaf has 2-7mg caffeine. Herbal tea or water only. Adenosine needs to accumulate for quality sleep.",
    icon: Moon,
  },
];

const PROTOCOL = [
  {
    n: "1",
    title: "Morning: 1-2 Biodynamic Cups",
    detail:
      "Light or medium roast. Wait 90 min after waking. Maximum CGA, polyphenols, and caffeine benefit. Mold-tested. Zero pesticides.",
    colorClass: "border-t-[#c4873b]",
    textClass: "text-[#c4873b]",
  },
  {
    n: "2",
    title: "Afternoon: 1 SWP Decaf Cup",
    detail:
      "Swiss Water Process biodynamic decaf. 70-80% of antioxidants retained. Zero sleep disruption. Zero methylene chloride.",
    colorClass: "border-t-[#4a7c8c]",
    textClass: "text-[#4a7c8c]",
  },
  {
    n: "3",
    title: "Evening: Nothing",
    detail:
      "Let adenosine accumulate. Even decaf has 2-7mg caffeine. Herbal tea or water only after 5pm. Protect deep sleep.",
    colorClass: "border-t-[#7a8c6e]",
    textClass: "text-[#7a8c6e]",
  },
];

export default function BrewSoulHealthPage() {
  return (
    <div className="bg-[#f5efe0] text-[#2d1810]">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-linear-to-br from-[#2a4c5c] via-[#1a0e08] to-[#3a7a4a] px-7 py-20 text-center">
        <div className="relative z-1 max-w-3xl">
          <div className="mb-6 font-mono text-[11px] tracking-[0.3em] text-[#7a8c6e] uppercase">
            BrewSoul · Science, Not Marketing
          </div>
          <h1 className="mb-5 font-heading text-[clamp(36px,6vw,68px)] leading-[1.05] font-bold text-[#f5efe0] italic">
            What Coffee
            <br />
            Actually Does to You
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-[clamp(16px,2vw,20px)] leading-relaxed text-[#f5efe0]/70">
            Every claim peer-reviewed. Every citation linked. Caffeine metabolism, cortisol timing,
            mycotoxin risk, compound science, and the longevity data that changes how you drink.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { n: "8", l: "Longevity benefits (cited)" },
              { n: "7", l: "Real risks to manage" },
              { n: "8", l: "Bioactive compounds" },
              { n: "3", l: "Mycotoxin threats" },
            ].map((s) => (
              <div key={s.l} className="px-2 py-3 text-center">
                <div className="font-heading text-4xl leading-none font-bold text-[#d4a84b]">
                  {s.n}
                </div>
                <div className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-[#e8dcc8]/70 uppercase">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Longevity */}
      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">
            The Longevity Evidence
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">
            What 10+ Million Participants Tell Us
          </h2>
          <p className="mb-4.5 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Coffee is the single most studied beverage in nutritional science. The data is
            overwhelming: moderate consumption (3-5 cups/day) is associated with lower risk of death
            from virtually every major disease. These aren&apos;t wellness blog claims —
            they&apos;re meta-analyses of millions of participants published in the world&apos;s top
            medical journals.
          </p>

          <div className="my-7 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {LONGEVITY.map((l) => (
              <div
                key={l.title}
                className="rounded-lg border border-[#5d3a28]/8 border-l-4 border-l-[#3a7a4a] bg-white p-5"
              >
                <div className="mb-1.5 text-base font-bold text-[#1a0e08]">{l.title}</div>
                <div className="mb-2.5 text-sm leading-relaxed text-[#5c3a28]">{l.finding}</div>
                <div className="font-mono text-[10px] text-[#6b5a4e]">{l.study}</div>
                <div className="mt-0.5 font-mono text-[10px] text-[#7a8c6e]">n = {l.n}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border-l-4 border-l-[#c4873b] bg-white p-6">
            <div className="mb-2 text-sm font-bold text-[#1a0e08]">The Dose-Response Curve</div>
            <p className="text-[17px] leading-[1.7] text-[#2d1810]">
              Nearly all benefits follow a J-shaped or U-shaped curve. The sweet spot is 3-5
              cups/day for most outcomes. Below 3 cups, benefits are present but smaller. Above 5-6
              cups, benefits plateau and some risks increase. The simplification principle: 3 cups
              of high-quality coffee beats 6 cups of commodity coffee for every measured outcome.
            </p>
          </div>
        </div>
      </section>

      {/* Risks */}
      <section className="bg-linear-to-b from-[#1a0e08] to-[#2d1810] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8]/80 uppercase">
            The Real Risks
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#f5efe0] italic">
            What the Science Says You Should Manage
          </h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#f5efe0]/88">
            Coffee isn&apos;t universally beneficial. These are the evidence-based risks — not
            wellness panic, not coffee-industry denial. Manage these and coffee becomes net positive
            for almost everyone.
          </p>
          <HealthRisks risks={RISKS} />
        </div>
      </section>

      {/* Caffeine metabolism */}
      <section className="bg-[#f5efe0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">
            Your Genetics Matter
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">
            CYP1A2: The Coffee Gene
          </h2>
          <p className="mb-4.5 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Half the population metabolizes caffeine fast. Half metabolizes it slowly. This single
            gene variant (CYP1A2) determines whether coffee is a longevity tool or a cardiovascular
            risk. Most people don&apos;t know which they are — but your body gives clear signals.
          </p>

          <div className="my-7 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {CAFFEINE_METABOLISM.map((m) => (
              <div
                key={m.gene}
                className={`rounded-lg border border-[#5d3a28]/8 bg-white p-6 border-t-3 ${m.fast ? "border-t-[#3a7a4a]" : "border-t-[#8b4c2a]"}`}
              >
                <div
                  className={`mb-3 font-mono text-[11px] font-semibold tracking-wide ${m.fast ? "text-[#3a7a4a]" : "text-[#8b4c2a]"}`}
                >
                  {m.gene}
                </div>
                <div className="mb-3 text-[13px] text-[#6b5a4e]">
                  {m.pct} · Half-life: {m.halfLife}
                </div>
                <div className="mb-3 text-sm leading-relaxed text-[#5c3a28]">{m.effect}</div>
                <div className="rounded-md bg-[#ede4d0] p-3">
                  <div className="mb-1 font-mono text-[9px] tracking-wide text-[#6b5a4e]">
                    Recommendation
                  </div>
                  <div className="text-[13px] leading-snug text-[#2d1810]">{m.advice}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border-l-4 border-l-[#4a7c8c] bg-[#ede4d0] p-6">
            <div className="mb-2 text-sm font-bold text-[#1a0e08]">How to Know Your Type</div>
            <p className="text-[17px] leading-[1.7] text-[#2d1810]">
              If you can drink espresso after dinner and sleep fine, you&apos;re likely a fast
              metabolizer. If a single cup makes you jittery or anxious, you&apos;re likely slow.
              Genetic testing (23andMe, AncestryDNA) can confirm via the CYP1A2 SNP rs762551. But
              your body&apos;s signals are usually sufficient.
            </p>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section className="bg-[#ede4d0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">
            Chronobiology
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">
            The Optimal Coffee Schedule
          </h2>
          <p className="mb-4.5 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            When you drink coffee matters as much as what you drink. Cortisol follows a circadian
            rhythm. Caffeine has a 5-6 hour half-life. Adenosine accumulation drives sleep pressure.
            Here&apos;s the science-backed schedule.
          </p>

          <div className="my-7 flex flex-col gap-3">
            {TIMING.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.time}
                  className="flex items-start gap-4 rounded-lg border border-[#5d3a28]/8 bg-white p-5"
                >
                  <Icon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-[#c4873b]" />
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-3">
                      <div className="font-mono text-[13px] font-semibold text-[#c4873b]">
                        {t.time}
                      </div>
                      <div className="text-sm font-bold text-[#1a0e08]">{t.label}</div>
                    </div>
                    <div className="text-sm leading-relaxed text-[#5c3a28]">{t.advice}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compounds */}
      <section className="bg-[#f5efe0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">
            Compound Science
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">
            What&apos;s Actually in Your Cup
          </h2>
          <p className="mb-4.5 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            Coffee contains 1,000+ bioactive compounds. These eight are the most studied and most
            impactful. Understanding them changes how you choose roast level, brew method, and
            whether organic/biodynamic matters.
          </p>

          <HealthCompounds compounds={COMPOUNDS} />

          <div className="mt-5 rounded-lg border-l-4 border-l-[#4a5e3c] bg-white p-6">
            <div className="mb-2 text-sm font-bold text-[#1a0e08]">The Roast Level Tradeoff</div>
            <p className="text-[17px] leading-[1.7] text-[#2d1810]">
              Light roast = maximum CGA, trigonelline, and caffeine. Dark roast = maximum
              melanoidins, minimum acrylamide, lower caffeine. Medium roast is the optimal tradeoff
              for most health goals. If you&apos;re drinking biodynamic for maximum nutritional
              value, choose light or medium roast — you&apos;re paying a premium for compounds that
              dark roasting destroys.
            </p>
          </div>
        </div>
      </section>

      {/* Mycotoxins */}
      <section className="bg-linear-to-b from-[#2d3a24] to-[#1a0e08] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#e8dcc8]/80 uppercase">
            The Hidden Threat
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#f5efe0] italic">
            Mycotoxins, Mold & What They Don&apos;t Tell You
          </h2>
          <p className="mb-6 max-w-180 text-[17px] leading-[1.7] text-[#f5efe0]/88">
            Coffee is one of the most mycotoxin-prone crops on earth. Improper drying, storage, and
            processing create conditions for mold growth. Most commercial coffee is never tested.
            The brands that test and disclose are the ones worth buying.
          </p>

          <div className="my-7 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {MYCOTOXINS.map((m) => (
              <div
                key={m.toxin}
                className="rounded-lg border border-white/10 border-t-3 border-t-[#8b4c2a] bg-white/5 p-6"
              >
                <div className="mb-2 font-mono text-[11px] font-semibold tracking-wide text-[#8b4c2a]">
                  {m.toxin}
                </div>
                <div className="mb-3 text-xs text-[#f5efe0]/50">Source: {m.source}</div>
                <div className="mb-3 text-sm leading-relaxed text-[#f5efe0]/75">{m.risk}</div>
                <div className="rounded-md bg-[#3a7a4a]/15 p-3">
                  <div className="mb-1 font-mono text-[9px] tracking-wide text-[#7a8c6e]">
                    Solution
                  </div>
                  <div className="text-[13px] leading-snug text-[#e8dcc8]">{m.solution}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-sm font-bold text-[#e8dcc8]">Brands That Test & Disclose</div>
            <p className="text-[17px] leading-[1.7] text-[#f5efe0]/88">
              Purity Coffee (350+ compounds), Lifeboost (450+ toxins), Holistic Roasters (mold,
              mycotoxins, heavy metals, pesticides). These three brands publish their testing
              protocols. Most specialty roasters don&apos;t test at all — they rely on SCA grading,
              which doesn&apos;t include mycotoxin screening. &ldquo;Specialty grade&rdquo; ≠
              &ldquo;mold-free.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Simplification protocol */}
      <section className="bg-[#f5efe0] px-7 py-20">
        <div className="mx-auto max-w-275">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[#6b5a4e]/80 uppercase">
            The Protocol
          </div>
          <h2 className="mb-6 font-heading text-[clamp(28px,4vw,44px)] leading-[1.15] font-bold text-[#1a0e08] italic">
            The Great Simplification — Applied to Coffee
          </h2>
          <p className="mb-4.5 max-w-180 text-[17px] leading-[1.7] text-[#2d1810]">
            All of this research points to the same conclusion: fewer cups, better cups, right
            timing. Here&apos;s the evidence-based protocol that maximizes benefit and minimizes
            risk.
          </p>

          <div className="my-7 rounded-lg bg-[#1a0e08] p-8">
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {PROTOCOL.map((p) => (
                <div
                  key={p.n}
                  className={`rounded-md border border-white/10 bg-white/5 p-6 border-t-3 ${p.colorClass}`}
                >
                  <div className={`mb-2 font-heading text-3xl font-bold ${p.textClass}`}>{p.n}</div>
                  <div className="mb-2 text-[15px] font-bold text-[#f5efe0]">{p.title}</div>
                  <div className="text-sm leading-relaxed text-[#f5efe0]/65">{p.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-l-[#c4873b] bg-[#ede4d0] p-6">
            <div className="mb-2 text-sm font-bold text-[#1a0e08]">The Math</div>
            <p className="text-[17px] leading-[1.7] text-[#2d1810]">
              2-3 cups of biodynamic coffee per day (1-2 caf + 1 decaf) costs ~$1.50-2.50/day. The
              average American spends $5.40/day on coffee (NCA 2024). You spend less, get more
              bioactive compounds per cup, avoid mycotoxins and pesticides, protect your sleep, and
              fund regenerative agriculture. Fewer cups. Better cups. Lower cost. Higher impact.
              That&apos;s simplification.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#ede4d0] px-7 py-14">
        <div className="mx-auto max-w-275">
          <NextSteps
            steps={[
              {
                label: "Biodynamic Census",
                path: "/brewsoul/biodynamic",
                description: "Every Demeter-certified farm and roaster on earth",
              },
              {
                label: "Decaf Done Right",
                path: "/brewsoul/decaf",
                description: "Swiss Water vs. paint stripper — the complete guide",
              },
              {
                label: "Coffee Prescription",
                path: "/brewsoul/prescription",
                description: "AI-powered personalized recommendation",
              },
            ]}
          />
        </div>
      </section>

      <footer className="bg-[#1a0e08] px-7 py-12 text-center">
        <div className="mb-2 font-heading text-2xl font-bold text-[#f5efe0] italic">
          BrewSoul · Coffee & Health
        </div>
        <div className="mx-auto mb-4 max-w-125 text-sm leading-relaxed text-[#f5efe0]/50">
          Peer-reviewed research on every claim. 8 longevity benefits. 7 real risks. 8 bioactive
          compounds. Zero wellness marketing.
        </div>
        <div className="font-mono text-[10px] tracking-wide text-[#f5efe0]/30">
          All citations peer-reviewed · Data verified Feb 2026
        </div>
      </footer>
    </div>
  );
}
