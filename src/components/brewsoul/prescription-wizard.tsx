"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bug,
  Brain,
  Coffee,
  Dna,
  HeartPulse,
  Microscope,
  Moon,
  Scale,
  ShieldCheck,
  Sparkles,
  Sun,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

// Ported from legacy client/src/pages/brewsoul/BrewSoulPrescriptionFull.tsx
// — the real 5-step questionnaire (genetics/timing/health/flavor/budget)
// generating a real, deterministic personalized coffee prescription
// (`generatePrescription`, a pure function — real roast/cup-count/brand/
// pricing/warning logic, unchanged). Legacy's `trpc.coffeePrescription
// .generate` AI-enhancement mutation doesn't exist in this migration —
// dropped along with its "AI ANALYSIS LOADING..." block, which otherwise
// would spin forever and never resolve (worse than not having the
// feature at all); the real prescription itself never depended on that
// call, it's already fully computed client-side. Legacy's bespoke earthy
// "science" palette kept as the same deliberate one-off sub-identity used
// on `/brewsoul/health`.
type Step = "genetics" | "timing" | "health" | "flavor" | "budget" | "result";

interface Answers {
  caffeineSensitivity: "fast" | "slow" | "unknown";
  wakeTime: string;
  sleepGoal: "optimize" | "normal" | "not-priority";
  pregnant: boolean;
  healthGoals: string[];
  flavorPref: string[];
  budget: "value" | "mid" | "premium" | "no-limit";
  cupsPerDay: number;
}

const HEALTH_OPTIONS = [
  { id: "longevity", label: "Longevity / anti-aging" },
  { id: "liver", label: "Liver protection" },
  { id: "brain", label: "Brain health / focus" },
  { id: "gut", label: "Gut health / digestion" },
  { id: "weight", label: "Weight management" },
  { id: "mood", label: "Mood / depression prevention" },
  { id: "sleep", label: "Sleep optimization" },
  { id: "anxiety", label: "Reduce anxiety" },
  { id: "antioxidant", label: "Maximum antioxidants" },
  { id: "mold-free", label: "Mold/mycotoxin avoidance" },
];

const HEALTH_OPTION_ICONS: Record<string, LucideIcon> = {
  longevity: Dna,
  liver: HeartPulse,
  brain: Brain,
  gut: Bug,
  weight: Scale,
  mood: Sun,
  sleep: Moon,
  anxiety: Sparkles,
  antioxidant: ShieldCheck,
  "mold-free": Microscope,
};

const FLAVOR_OPTIONS = [
  { id: "chocolate", label: "Chocolate / nutty" },
  { id: "fruity", label: "Fruity / berry" },
  { id: "floral", label: "Floral / tea-like" },
  { id: "caramel", label: "Caramel / sweet" },
  { id: "earthy", label: "Earthy / smoky" },
  { id: "clean", label: "Clean / bright" },
  { id: "bold", label: "Bold / full-body" },
  { id: "smooth", label: "Smooth / low-acid" },
];

const DEFAULT_ANSWERS: Answers = {
  caffeineSensitivity: "unknown",
  wakeTime: "7:00",
  sleepGoal: "optimize",
  pregnant: false,
  healthGoals: [],
  flavorPref: [],
  budget: "mid",
  cupsPerDay: 3,
};

const STEPS: { key: Step; label: string; n: number }[] = [
  { key: "genetics", label: "Genetics", n: 1 },
  { key: "timing", label: "Timing", n: 2 },
  { key: "health", label: "Health", n: 3 },
  { key: "flavor", label: "Flavor", n: 4 },
  { key: "budget", label: "Budget", n: 5 },
  { key: "result", label: "Prescription", n: 6 },
];

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4.5 py-2.5 text-sm transition-all ${
        selected
          ? "border-2 border-[#c4873b] bg-[#c4873b]/8 font-semibold text-[#1a0e08]"
          : "border border-[#5d3a28]/12 bg-white text-[#5c3a28]"
      }`}
    >
      {children}
    </button>
  );
}

function generatePrescription(a: Answers) {
  const wakeHour = parseInt(a.wakeTime.split(":")[0]);
  const firstCupTime = `${wakeHour + 1}:30-${wakeHour + 2}:30 AM`;
  const lastCafTime =
    a.caffeineSensitivity === "slow"
      ? `${Math.min(wakeHour + 5, 12)}:00`
      : `${Math.min(wakeHour + 7, 14)}:00`;
  const isSlow = a.caffeineSensitivity === "slow";
  const wantsMoldFree = a.healthGoals.includes("mold-free");
  const wantsAnxietyRelief = a.healthGoals.includes("anxiety");
  const wantsMaxAntioxidant = a.healthGoals.includes("antioxidant");

  let roast = "Medium";
  let roastReason = "Best tradeoff: retains CGA + polyphenols while reducing acrylamide.";
  if (wantsMaxAntioxidant) {
    roast = "Light-Medium";
    roastReason = "Maximum chlorogenic acid and polyphenol retention for antioxidant goals.";
  }
  if (a.flavorPref.includes("bold") || a.flavorPref.includes("earthy")) {
    roast = "Medium-Dark";
    roastReason = "Full body with melanoidins (prebiotic) while retaining moderate CGA.";
  }

  let cafCups = a.pregnant ? 1 : isSlow ? Math.min(a.cupsPerDay, 2) : Math.min(a.cupsPerDay, 3);
  let decafCups = Math.max(0, a.cupsPerDay - cafCups);
  if (wantsAnxietyRelief) {
    cafCups = Math.min(cafCups, 1);
    decafCups = Math.max(decafCups, 1);
  }
  if (a.sleepGoal === "optimize" && cafCups > 2) {
    cafCups = 2;
    decafCups = Math.max(1, a.cupsPerDay - 2);
  }

  type Brand = { name: string; why: string; price: string; link: string; tier: string };
  const brands: Brand[] = [];
  if (wantsMoldFree || wantsMaxAntioxidant) {
    brands.push({
      name: "Purity Coffee",
      why: "350+ compound testing. Highest CGA focus. Mold-free verified.",
      price: "$2.42/oz",
      link: "/brewsoul/biodynamic",
      tier: "PREMIUM",
    });
  }
  if (a.budget !== "value") {
    brands.push({
      name: "Holistic Roasters",
      why: "World's first Demeter biodynamic. Zero pesticides. Compostable packaging.",
      price: "$1.88/oz",
      link: "/brewsoul/biodynamic",
      tier: "BEST-IN-CLASS",
    });
  }
  brands.push({
    name: "Cafe Altura",
    why: "44+ years biodynamic. Best price-to-value. Ships day after roast.",
    price: "$1.42/oz",
    link: "/brewsoul/biodynamic",
    tier: "BEST VALUE",
  });
  if (a.budget === "value") {
    brands.push({
      name: "Subtle Earth Organic",
      why: "CCOF Organic. Best bulk value. 2lb bags.",
      price: "$0.75/oz",
      link: "/brewsoul/decaf",
      tier: "BUDGET",
    });
  }

  let decafBrand: Brand = {
    name: "Holistic Roasters Biodynamic Decaf",
    why: "World's only Demeter-certified SWP decaf. Zero chemicals.",
    price: "$1.88/oz",
    link: "/brewsoul/decaf",
    tier: "LEGENDARY",
  };
  if (a.budget === "value") {
    decafBrand = {
      name: "Allegro Coffee Decaf",
      why: "Swiss Water Process. USDA Organic. Available at Whole Foods.",
      price: "$1.04/oz",
      link: "/brewsoul/decaf",
      tier: "BUDGET CHAMP",
    };
  }

  const avgCafPrice =
    a.budget === "premium" || a.budget === "no-limit" ? 1.88 : a.budget === "mid" ? 1.42 : 0.75;
  const avgDecafPrice = a.budget === "value" ? 1.04 : 1.88;
  const dailyCost = (cafCups * avgCafPrice * 0.7 + decafCups * avgDecafPrice * 0.7).toFixed(2);

  const warnings: string[] = [];
  if (a.pregnant)
    warnings.push(
      "WHO recommends <200mg caffeine/day during pregnancy. Your prescription limits to 1 caffeinated cup.",
    );
  if (isSlow && a.cupsPerDay > 2)
    warnings.push(
      "As a slow metabolizer, more than 2 caffeinated cups may increase cardiovascular risk. We've adjusted your prescription.",
    );
  if (wantsAnxietyRelief)
    warnings.push(
      "Caffeine amplifies anxiety in susceptible individuals. We've reduced caffeinated cups and added decaf.",
    );

  return {
    firstCupTime,
    lastCafTime,
    roast,
    roastReason,
    cafCups,
    decafCups,
    brands,
    decafBrand,
    dailyCost,
    warnings,
  };
}

export function PrescriptionWizard() {
  const [step, setStep] = useState<Step>("genetics");
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);

  const update = (partial: Partial<Answers>) => setAnswers((prev) => ({ ...prev, ...partial }));
  const toggleList = (key: "healthGoals" | "flavorPref", val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val],
    }));
  };

  const rx = useMemo(
    () => (step === "result" ? generatePrescription(answers) : null),
    [step, answers],
  );

  const stepIdx = STEPS.findIndex((s) => s.key === step);
  const canNext = () => {
    if (step === "health") return answers.healthGoals.length > 0;
    if (step === "flavor") return answers.flavorPref.length > 0;
    return step !== "result";
  };
  const next = () => {
    if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1].key);
  };
  const prev = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1].key);
  };

  return (
    <div className="bg-[#f5efe0] text-[#2d1810]">
      <section className="bg-linear-to-br from-[#1a0e08] via-[#2d1810] to-[#3d2517] px-7 pt-24 pb-16 text-center">
        <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[#c5a23c] uppercase">
          BrewSoul · Personalized Intelligence
        </div>
        <h1 className="mb-4 font-heading text-[clamp(32px,5vw,56px)] leading-[1.1] font-bold text-[#f5efe0] italic">
          Your Coffee Prescription
        </h1>
        <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-[#f5efe0]/65">
          Answer 5 questions. Get a personalized daily protocol based on your genetics, timing,
          health goals, and taste — with specific brand recommendations and pricing.
        </p>
      </section>

      <div className="border-b border-[#5d3a28]/8 bg-[#ede4d0] px-7 py-4">
        <div className="mx-auto flex max-w-3xl gap-1">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`h-1 flex-1 rounded-full ${i <= stepIdx ? "bg-[#c4873b]" : "bg-[#5d3a28]/10"}`}
            />
          ))}
        </div>
        <div className="mx-auto mt-2 flex max-w-3xl justify-between">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`font-mono text-[9px] tracking-wide ${i <= stepIdx ? "text-[#c4873b]" : "text-[#6b5a4e]/50"}`}
            >
              {s.n}. {s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-175 px-7 pt-12 pb-20">
        {step === "genetics" && (
          <div>
            <h2 className="mb-2 font-heading text-[28px] font-bold text-[#1a0e08] italic">
              How does caffeine affect you?
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-[#5c3a28]">
              This determines your CYP1A2 metabolizer type — the single most important factor in
              your coffee prescription.
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  val: "fast" as const,
                  label: "I can drink espresso after dinner and sleep fine",
                  sub: "Likely fast metabolizer (CYP1A2 AA)",
                },
                {
                  val: "slow" as const,
                  label: "One cup makes me jittery or anxious",
                  sub: "Likely slow metabolizer (CYP1A2 AC/CC)",
                },
                {
                  val: "unknown" as const,
                  label: "I'm not sure / somewhere in between",
                  sub: "We'll use moderate defaults",
                },
              ].map((o) => (
                <button
                  key={o.val}
                  onClick={() => update({ caffeineSensitivity: o.val })}
                  className={`rounded-lg p-5 text-left ${
                    answers.caffeineSensitivity === o.val
                      ? "border-2 border-[#c4873b] bg-[#c4873b]/6"
                      : "border border-[#5d3a28]/10 bg-white"
                  }`}
                >
                  <div className="text-[15px] font-semibold text-[#1a0e08]">{o.label}</div>
                  <div className="mt-1 font-mono text-[11px] text-[#6b5a4e]">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "timing" && (
          <div>
            <h2 className="mb-2 font-heading text-[28px] font-bold text-[#1a0e08] italic">
              When do you wake up?
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-[#5c3a28]">
              Your cortisol awakening response (CAR) peaks 30-45 min after waking. We&apos;ll time
              your first cup to the dip.
            </p>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {["5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"].map((t) => (
                <Chip
                  key={t}
                  selected={answers.wakeTime === t}
                  onClick={() => update({ wakeTime: t })}
                >
                  {t} AM
                </Chip>
              ))}
            </div>
            <h3 className="mb-2 font-heading text-[22px] font-bold text-[#1a0e08] italic">
              How many cups per day?
            </h3>
            <div className="mb-8 flex gap-2.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Chip
                  key={n}
                  selected={answers.cupsPerDay === n}
                  onClick={() => update({ cupsPerDay: n })}
                >
                  {n}
                </Chip>
              ))}
            </div>
            <h3 className="mb-2 font-heading text-[22px] font-bold text-[#1a0e08] italic">
              Sleep optimization priority?
            </h3>
            <div className="mb-4 flex flex-wrap gap-2.5">
              {[
                { val: "optimize" as const, label: "High priority — protect deep sleep" },
                { val: "normal" as const, label: "Normal — reasonable cutoff" },
                { val: "not-priority" as const, label: "Not a concern" },
              ].map((o) => (
                <Chip
                  key={o.val}
                  selected={answers.sleepGoal === o.val}
                  onClick={() => update({ sleepGoal: o.val })}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-[#5c3a28]">
              <input
                type="checkbox"
                checked={answers.pregnant}
                onChange={(e) => update({ pregnant: e.target.checked })}
                className="size-4.5"
              />
              Currently pregnant or breastfeeding
            </label>
          </div>
        )}

        {step === "health" && (
          <div>
            <h2 className="mb-2 font-heading text-[28px] font-bold text-[#1a0e08] italic">
              What are your health goals?
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-[#5c3a28]">
              Select all that apply. We&apos;ll optimize roast level, brand, and timing for your
              specific goals.
            </p>
            <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
              {HEALTH_OPTIONS.map((h) => {
                const Icon = HEALTH_OPTION_ICONS[h.id];
                return (
                  <Chip
                    key={h.id}
                    selected={answers.healthGoals.includes(h.id)}
                    onClick={() => toggleList("healthGoals", h.id)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon aria-hidden="true" className="size-3.5" />
                      {h.label}
                    </span>
                  </Chip>
                );
              })}
            </div>
          </div>
        )}

        {step === "flavor" && (
          <div>
            <h2 className="mb-2 font-heading text-[28px] font-bold text-[#1a0e08] italic">
              What flavors do you love?
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-[#5c3a28]">
              Select all that appeal to you. This shapes roast and origin recommendations.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {FLAVOR_OPTIONS.map((f) => (
                <Chip
                  key={f.id}
                  selected={answers.flavorPref.includes(f.id)}
                  onClick={() => toggleList("flavorPref", f.id)}
                >
                  {f.label}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === "budget" && (
          <div>
            <h2 className="mb-2 font-heading text-[28px] font-bold text-[#1a0e08] italic">
              What&apos;s your budget?
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-[#5c3a28]">
              Better coffee often costs less than daily Starbucks. We&apos;ll find the best value
              for your tier.
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  val: "value" as const,
                  label: "Value — under $1/oz",
                  sub: "$0.50-0.90/cup · Organic, mold-tested",
                },
                {
                  val: "mid" as const,
                  label: "Mid-range — $1-2/oz",
                  sub: "$0.70-1.40/cup · Biodynamic, Demeter-certified",
                },
                {
                  val: "premium" as const,
                  label: "Premium — $2-3/oz",
                  sub: "$1.40-2.10/cup · Health-optimized, maximum testing",
                },
                {
                  val: "no-limit" as const,
                  label: "No limit — best available",
                  sub: "Whatever the science says is optimal",
                },
              ].map((o) => (
                <button
                  key={o.val}
                  onClick={() => update({ budget: o.val })}
                  className={`rounded-lg p-5 text-left ${answers.budget === o.val ? "border-2 border-[#c4873b] bg-[#c4873b]/6" : "border border-[#5d3a28]/10 bg-white"}`}
                >
                  <div className="text-[15px] font-semibold text-[#1a0e08]">{o.label}</div>
                  <div className="mt-1 font-mono text-[11px] text-[#6b5a4e]">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "result" && rx && (
          <div>
            <div className="mb-10 text-center">
              <div className="mb-2 font-mono text-[11px] tracking-[0.2em] text-[#c5a23c]">
                Your Prescription
              </div>
              <h2 className="font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] font-bold text-[#1a0e08] italic">
                {rx.cafCups} Caf + {rx.decafCups} Decaf · {rx.roast} Roast
              </h2>
              <div className="mt-2 font-mono text-[13px] text-[#c4873b]">~${rx.dailyCost}/day</div>
            </div>

            {rx.warnings.length > 0 && (
              <div className="mb-7">
                {rx.warnings.map((w) => (
                  <div
                    key={w}
                    className="mb-2 rounded-lg border border-[#9B3030]/15 bg-[#9B3030]/6 p-4 text-sm leading-relaxed text-[#8b4c2a]"
                  >
                    <TriangleAlert aria-hidden="true" className="mr-2 inline size-4" />
                    {w}
                  </div>
                ))}
              </div>
            )}

            <div className="mb-5 rounded-lg border border-[#5d3a28]/8 bg-white p-6">
              <div className="mb-4 font-mono text-[11px] tracking-wide text-[#c5a23c]">
                Daily Schedule
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Coffee aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#c4873b]" />
                  <div>
                    <div className="text-sm font-bold text-[#1a0e08]">
                      First cup: {rx.firstCupTime}
                    </div>
                    <div className="text-[13px] text-[#5c3a28]">
                      Wait 90 min after waking for cortisol dip.{" "}
                      {rx.cafCups > 1
                        ? `${rx.cafCups - 1} more caffeinated cup(s) before ${rx.lastCafTime}.`
                        : ""}
                    </div>
                  </div>
                </div>
                {rx.decafCups > 0 && (
                  <div className="flex items-start gap-3">
                    <Coffee aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#c4873b]" />
                    <div>
                      <div className="text-sm font-bold text-[#1a0e08]">
                        Decaf: After {rx.lastCafTime}
                      </div>
                      <div className="text-[13px] text-[#5c3a28]">
                        {rx.decafCups} Swiss Water Process decaf cup(s). 70-80% antioxidants, zero
                        sleep disruption.
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Moon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#c4873b]" />
                  <div>
                    <div className="text-sm font-bold text-[#1a0e08]">No coffee after 5:00 PM</div>
                    <div className="text-[13px] text-[#5c3a28]">
                      Even decaf has 2-7mg caffeine. Herbal tea or water only.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5 rounded-lg border border-[#5d3a28]/8 border-l-4 border-l-[#c4873b] bg-white p-6">
              <div className="mb-2 font-mono text-[11px] tracking-wide text-[#c5a23c]">
                Recommended Roast
              </div>
              <div className="mb-1.5 font-heading text-[22px] font-bold text-[#1a0e08] italic">
                {rx.roast}
              </div>
              <div className="text-sm leading-relaxed text-[#5c3a28]">{rx.roastReason}</div>
            </div>

            <div className="mt-8 mb-3 font-mono text-[11px] tracking-wide text-[#c5a23c]">
              Caffeinated Picks
            </div>
            {rx.brands.map((b) => (
              <Link
                key={b.name}
                href={b.link}
                className="mb-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#5d3a28]/8 bg-white p-5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1a0e08]">{b.name}</span>
                    <span className="rounded-sm bg-[#3a7a4a] px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-white">
                      {b.tier}
                    </span>
                  </div>
                  <div className="mt-1 text-[13px] text-[#5c3a28]">{b.why}</div>
                </div>
                <div className="font-mono text-sm font-semibold text-[#c4873b]">{b.price}</div>
              </Link>
            ))}

            {rx.decafCups > 0 && (
              <>
                <div className="mt-6 mb-3 font-mono text-[11px] tracking-wide text-[#4a7c8c]">
                  Decaf Pick
                </div>
                <Link
                  href={rx.decafBrand.link}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#5d3a28]/8 border-l-4 border-l-[#4a7c8c] bg-white p-5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-[#1a0e08]">
                        {rx.decafBrand.name}
                      </span>
                      <span className="rounded-sm bg-[#4a7c8c] px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-white">
                        {rx.decafBrand.tier}
                      </span>
                    </div>
                    <div className="mt-1 text-[13px] text-[#5c3a28]">{rx.decafBrand.why}</div>
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#4a7c8c]">
                    {rx.decafBrand.price}
                  </div>
                </Link>
              </>
            )}

            <div className="mt-8 rounded-lg bg-[#1a0e08] p-7">
              <div className="mb-3 font-mono text-[11px] tracking-wide text-[#c5a23c]">
                The Simplification
              </div>
              <div className="mb-3 font-heading text-xl font-bold text-[#f5efe0] italic">
                Fewer cups. Better cups. Right timing.
              </div>
              <div className="text-sm leading-relaxed text-[#f5efe0]/70">
                Your prescription: {rx.cafCups} caffeinated + {rx.decafCups} decaf per day,{" "}
                {rx.roast.toLowerCase()} roast, first cup at {rx.firstCupTime}, last caf by{" "}
                {rx.lastCafTime}. Estimated daily cost: ${rx.dailyCost} — less than a single
                Starbucks latte. Maximum bioactive compounds. Zero pesticides. Zero mycotoxins.
                Protected sleep.
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setStep("genetics");
                  setAnswers(DEFAULT_ANSWERS);
                }}
                className="rounded-md border border-[#5d3a28]/15 px-7 py-3 font-mono text-xs tracking-wide text-[#6b5a4e]"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {step !== "result" && (
          <div className="mt-10 flex justify-between">
            {stepIdx > 0 ? (
              <button
                onClick={prev}
                className="rounded-md border border-[#5d3a28]/15 px-6 py-3 font-mono text-xs tracking-wide text-[#6b5a4e]"
              >
                <BackIcon aria-hidden="true" /> Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={next}
              disabled={!canNext()}
              className={`rounded-md px-7 py-3 font-mono text-xs tracking-wide ${
                canNext()
                  ? "bg-linear-to-br from-[#c4873b] to-[#c5a23c] text-white"
                  : "cursor-not-allowed bg-[#5d3a28]/10 text-[#6b5a4e] opacity-50"
              }`}
            >
              {stepIdx === STEPS.length - 2 ? (
                <>
                  Get Prescription <ForwardIcon aria-hidden="true" />
                </>
              ) : (
                <>
                  Next <ForwardIcon aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
