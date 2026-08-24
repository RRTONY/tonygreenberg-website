/**
 * BrewSoul Coffee Prescription — AI-powered personalized recommendation.
 * Multi-step questionnaire: genetics, timing, health goals, flavor, budget.
 * Generates a personalized daily protocol with specific brand recommendations.
 */
import { useState, useMemo, useEffect } from "react";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";

const C = {
  soil: "#1a0e08", bark: "#2d1810", loam: "#3d2517", clay: "#5c3a28",
  amber: "#c4873b", wheat: "#d4a84b", cream: "#f5efe0", parch: "#ede4d0",
  sage: "#7a8c6e", moss: "#4a5e3c", dMoss: "#2d3a24", bone: "#e8dcc8",
  smoke: "#6b5a4e", rust: "#8b4c2a", white: "#ffffff",
  teal: "#4a7c8c", green: "#3a7a4a", gold: "#c5a23c",
};
const F = {
  d: "'Playfair Display',Georgia,serif",
  b: "'Source Sans 3','Source Serif 4',Georgia,serif",
  m: "'DM Mono','JetBrains Mono','Courier New',monospace",
  s: "'Source Sans 3','DM Sans','Helvetica Neue',sans-serif",
};

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
  { id: "longevity", label: "Longevity / anti-aging", icon: "🧬" },
  { id: "liver", label: "Liver protection", icon: "🫀" },
  { id: "brain", label: "Brain health / focus", icon: "🧠" },
  { id: "gut", label: "Gut health / digestion", icon: "🦠" },
  { id: "weight", label: "Weight management", icon: "⚖️" },
  { id: "mood", label: "Mood / depression prevention", icon: "☀️" },
  { id: "sleep", label: "Sleep optimization", icon: "💤" },
  { id: "anxiety", label: "Reduce anxiety", icon: "🧘" },
  { id: "antioxidant", label: "Maximum antioxidants", icon: "🛡️" },
  { id: "mold-free", label: "Mold/mycotoxin avoidance", icon: "🔬" },
];

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

const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} style={{
    fontFamily: F.s, fontSize: 14, padding: "10px 18px", borderRadius: 8, cursor: "pointer",
    border: selected ? `2px solid ${C.amber}` : "1px solid rgba(93,58,40,.12)",
    background: selected ? "rgba(196,135,59,.08)" : C.white,
    color: selected ? C.soil : C.clay, fontWeight: selected ? 600 : 400,
    transition: "all .2s",
  }}>{children}</button>
);

function generatePrescription(a: Answers) {
  const wakeHour = parseInt(a.wakeTime.split(":")[0]);
  const firstCupTime = `${wakeHour + 1}:30-${wakeHour + 2}:30 AM`;
  const lastCafTime = a.caffeineSensitivity === "slow" ? `${Math.min(wakeHour + 5, 12)}:00` : `${Math.min(wakeHour + 7, 14)}:00`;
  const isSlow = a.caffeineSensitivity === "slow";
  const wantsSleep = a.sleepGoal === "optimize";
  const wantsMoldFree = a.healthGoals.includes("mold-free");
  const wantsAnxietyRelief = a.healthGoals.includes("anxiety");
  const wantsMaxAntioxidant = a.healthGoals.includes("antioxidant");
  const wantsBrain = a.healthGoals.includes("brain");
  const wantsLiver = a.healthGoals.includes("liver");

  // Roast recommendation
  let roast = "Medium";
  let roastReason = "Best tradeoff: retains CGA + polyphenols while reducing acrylamide.";
  if (wantsMaxAntioxidant) { roast = "Light-Medium"; roastReason = "Maximum chlorogenic acid and polyphenol retention for antioxidant goals."; }
  if (a.flavorPref.includes("bold") || a.flavorPref.includes("earthy")) { roast = "Medium-Dark"; roastReason = "Full body with melanoidins (prebiotic) while retaining moderate CGA."; }

  // Cups recommendation
  let cafCups = a.pregnant ? 1 : (isSlow ? Math.min(a.cupsPerDay, 2) : Math.min(a.cupsPerDay, 3));
  let decafCups = Math.max(0, a.cupsPerDay - cafCups);
  if (wantsAnxietyRelief) { cafCups = Math.min(cafCups, 1); decafCups = Math.max(decafCups, 1); }
  if (wantsSleep && cafCups > 2) { cafCups = 2; decafCups = Math.max(1, a.cupsPerDay - 2); }

  // Brand recommendations
  type Brand = { name: string; why: string; price: string; link: string; tier: string };
  const brands: Brand[] = [];

  if (wantsMoldFree || wantsMaxAntioxidant) {
    brands.push({ name: "Purity Coffee", why: "350+ compound testing. Highest CGA focus. Mold-free verified.", price: "$2.42/oz", link: "/brewsoul/biodynamic", tier: "PREMIUM" });
  }
  if (a.budget !== "value") {
    brands.push({ name: "Holistic Roasters", why: "World's first Demeter biodynamic. Zero pesticides. Compostable packaging.", price: "$1.88/oz", link: "/brewsoul/biodynamic", tier: "BEST-IN-CLASS" });
  }
  brands.push({ name: "Cafe Altura", why: "44+ years biodynamic. Best price-to-value. Ships day after roast.", price: "$1.42/oz", link: "/brewsoul/biodynamic", tier: "BEST VALUE" });
  if (a.budget === "value") {
    brands.push({ name: "Subtle Earth Organic", why: "CCOF Organic. Best bulk value. 2lb bags.", price: "$0.75/oz", link: "/brewsoul/decaf", tier: "BUDGET" });
  }

  // Decaf brand
  let decafBrand: Brand = { name: "Holistic Roasters Biodynamic Decaf", why: "World's only Demeter-certified SWP decaf. Zero chemicals.", price: "$1.88/oz", link: "/brewsoul/decaf", tier: "LEGENDARY" };
  if (a.budget === "value") {
    decafBrand = { name: "Allegro Coffee Decaf", why: "Swiss Water Process. USDA Organic. Available at Whole Foods.", price: "$1.04/oz", link: "/brewsoul/decaf", tier: "BUDGET CHAMP" };
  }

  // Daily cost
  const avgCafPrice = a.budget === "premium" || a.budget === "no-limit" ? 1.88 : a.budget === "mid" ? 1.42 : 0.75;
  const avgDecafPrice = a.budget === "value" ? 1.04 : 1.88;
  const dailyCost = ((cafCups * avgCafPrice * 0.7) + (decafCups * avgDecafPrice * 0.7)).toFixed(2);

  // Warnings
  const warnings: string[] = [];
  if (a.pregnant) warnings.push("WHO recommends <200mg caffeine/day during pregnancy. Your prescription limits to 1 caffeinated cup.");
  if (isSlow && a.cupsPerDay > 2) warnings.push("As a slow metabolizer, more than 2 caffeinated cups may increase cardiovascular risk. We've adjusted your prescription.");
  if (wantsAnxietyRelief) warnings.push("Caffeine amplifies anxiety in susceptible individuals. We've reduced caffeinated cups and added decaf.");

  return {
    firstCupTime, lastCafTime, roast, roastReason,
    cafCups, decafCups, brands, decafBrand,
    dailyCost, warnings,
    isSlow, wantsSleep, wantsMoldFree,
  };
}

export default function BrewSoulPrescriptionFull() {
  const [step, setStep] = useState<Step>("genetics");
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const aiMutation = trpc.coffeePrescription.generate.useMutation();

  const update = (partial: Partial<Answers>) => setAnswers(prev => ({ ...prev, ...partial }));
  const toggleList = (key: "healthGoals" | "flavorPref", val: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }));
  };

  const rx = useMemo(() => step === "result" ? generatePrescription(answers) : null, [step, answers]);

  // Fire LLM call when entering result step
  useEffect(() => {
    if (step === "result" && !aiResult && !aiLoading) {
      setAiLoading(true);
      aiMutation.mutateAsync(answers)
        .then(res => { if (res.success && res.prescription) setAiResult(res.prescription); })
        .catch(() => {})
        .finally(() => setAiLoading(false));
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const STEPS: { key: Step; label: string; n: number }[] = [
    { key: "genetics", label: "Genetics", n: 1 },
    { key: "timing", label: "Timing", n: 2 },
    { key: "health", label: "Health", n: 3 },
    { key: "flavor", label: "Flavor", n: 4 },
    { key: "budget", label: "Budget", n: 5 },
    { key: "result", label: "Prescription", n: 6 },
  ];

  const stepIdx = STEPS.findIndex(s => s.key === step);
  const canNext = () => {
    if (step === "genetics") return true;
    if (step === "timing") return true;
    if (step === "health") return answers.healthGoals.length > 0;
    if (step === "flavor") return answers.flavorPref.length > 0;
    if (step === "budget") return true;
    return false;
  };
  const next = () => { if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1].key); };
  const prev = () => { if (stepIdx > 0) setStep(STEPS[stepIdx - 1].key); };

  return (
    <>
    <SEO
        title="Coffee Prescription — BrewSoul"
        description="Your personalized coffee prescription based on your health goals, taste preferences, and lifestyle."
        path="/brewsoul/prescription"
        keywords="Tony Greenberg, coffee prescription, personalized coffee, coffee health goals"
        indexable={true}
      />
      <BrewSoulLayout>
      <div style={{ background: C.cream, minHeight: "100vh", fontFamily: F.b, color: C.bark }}>

        {/* HERO */}
        <section style={{ background: `linear-gradient(160deg,${C.soil} 0%,${C.bark} 50%,${C.loam} 100%)`, padding: "120px 28px 60px", textAlign: "center" }}>
          <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>BrewSoul · Personalized Intelligence</div>
          <h1 style={{ fontFamily: F.d, fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: C.cream, lineHeight: 1.1, margin: "0 0 16px", fontStyle: "italic" }}>Your Coffee Prescription</h1>
          <p style={{ fontFamily: F.b, fontSize: 17, color: "rgba(245,239,224,.65)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            Answer 5 questions. Get a personalized daily protocol based on your genetics, timing, health goals, and taste — with specific brand recommendations and pricing.
          </p>
        </section>

        {/* PROGRESS */}
        <div style={{ background: C.parch, padding: "16px 28px", borderBottom: "1px solid rgba(93,58,40,.08)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 4 }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= stepIdx ? C.amber : "rgba(93,58,40,.1)", transition: "all .3s" }} />
            ))}
          </div>
          <div style={{ maxWidth: 800, margin: "8px auto 0", display: "flex", justifyContent: "space-between" }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, color: i <= stepIdx ? C.amber : C.smoke, opacity: i <= stepIdx ? 1 : 0.5 }}>{s.n}. {s.label}</div>
            ))}
          </div>
        </div>

        {/* QUESTIONNAIRE */}
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 28px 80px" }}>

          {step === "genetics" && (
            <div>
              <h2 style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>How does caffeine affect you?</h2>
              <p style={{ fontFamily: F.b, fontSize: 15, color: C.clay, lineHeight: 1.6, marginBottom: 28 }}>This determines your CYP1A2 metabolizer type — the single most important factor in your coffee prescription.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { val: "fast" as const, label: "I can drink espresso after dinner and sleep fine", sub: "Likely fast metabolizer (CYP1A2 AA)" },
                  { val: "slow" as const, label: "One cup makes me jittery or anxious", sub: "Likely slow metabolizer (CYP1A2 AC/CC)" },
                  { val: "unknown" as const, label: "I'm not sure / somewhere in between", sub: "We'll use moderate defaults" },
                ].map(o => (
                  <button key={o.val} onClick={() => update({ caffeineSensitivity: o.val })} style={{
                    textAlign: "left", padding: 20, borderRadius: 8, cursor: "pointer",
                    border: answers.caffeineSensitivity === o.val ? `2px solid ${C.amber}` : "1px solid rgba(93,58,40,.1)",
                    background: answers.caffeineSensitivity === o.val ? "rgba(196,135,59,.06)" : C.white,
                  }}>
                    <div style={{ fontFamily: F.s, fontSize: 15, fontWeight: 600, color: C.soil }}>{o.label}</div>
                    <div style={{ fontFamily: F.m, fontSize: 11, color: C.smoke, marginTop: 4 }}>{o.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "timing" && (
            <div>
              <h2 style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>When do you wake up?</h2>
              <p style={{ fontFamily: F.b, fontSize: 15, color: C.clay, lineHeight: 1.6, marginBottom: 28 }}>Your cortisol awakening response (CAR) peaks 30-45 min after waking. We'll time your first cup to the dip.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                {["5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"].map(t => (
                  <Chip key={t} selected={answers.wakeTime === t} onClick={() => update({ wakeTime: t })}>{t} AM</Chip>
                ))}
              </div>
              <h3 style={{ fontFamily: F.d, fontSize: 22, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>How many cups per day?</h3>
              <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Chip key={n} selected={answers.cupsPerDay === n} onClick={() => update({ cupsPerDay: n })}>{n}</Chip>
                ))}
              </div>
              <h3 style={{ fontFamily: F.d, fontSize: 22, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>Sleep optimization priority?</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                {[
                  { val: "optimize" as const, label: "High priority — protect deep sleep" },
                  { val: "normal" as const, label: "Normal — reasonable cutoff" },
                  { val: "not-priority" as const, label: "Not a concern" },
                ].map(o => (
                  <Chip key={o.val} selected={answers.sleepGoal === o.val} onClick={() => update({ sleepGoal: o.val })}>{o.label}</Chip>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.s, fontSize: 14, color: C.clay, marginTop: 16, cursor: "pointer" }}>
                <input type="checkbox" checked={answers.pregnant} onChange={e => update({ pregnant: e.target.checked })} style={{ width: 18, height: 18 }} />
                Currently pregnant or breastfeeding
              </label>
            </div>
          )}

          {step === "health" && (
            <div>
              <h2 style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>What are your health goals?</h2>
              <p style={{ fontFamily: F.b, fontSize: 15, color: C.clay, lineHeight: 1.6, marginBottom: 28 }}>Select all that apply. We'll optimize roast level, brand, and timing for your specific goals.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                {HEALTH_OPTIONS.map(h => (
                  <Chip key={h.id} selected={answers.healthGoals.includes(h.id)} onClick={() => toggleList("healthGoals", h.id)}>
                    {h.icon} {h.label}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === "flavor" && (
            <div>
              <h2 style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>What flavors do you love?</h2>
              <p style={{ fontFamily: F.b, fontSize: 15, color: C.clay, lineHeight: 1.6, marginBottom: 28 }}>Select all that appeal to you. This shapes roast and origin recommendations.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {FLAVOR_OPTIONS.map(f => (
                  <Chip key={f.id} selected={answers.flavorPref.includes(f.id)} onClick={() => toggleList("flavorPref", f.id)}>
                    {f.label}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === "budget" && (
            <div>
              <h2 style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 8 }}>What's your budget?</h2>
              <p style={{ fontFamily: F.b, fontSize: 15, color: C.clay, lineHeight: 1.6, marginBottom: 28 }}>Better coffee often costs less than daily Starbucks. We'll find the best value for your tier.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { val: "value" as const, label: "Value — under $1/oz", sub: "$0.50-0.90/cup · Organic, mold-tested" },
                  { val: "mid" as const, label: "Mid-range — $1-2/oz", sub: "$0.70-1.40/cup · Biodynamic, Demeter-certified" },
                  { val: "premium" as const, label: "Premium — $2-3/oz", sub: "$1.40-2.10/cup · Health-optimized, maximum testing" },
                  { val: "no-limit" as const, label: "No limit — best available", sub: "Whatever the science says is optimal" },
                ].map(o => (
                  <button key={o.val} onClick={() => update({ budget: o.val })} style={{
                    textAlign: "left", padding: 20, borderRadius: 8, cursor: "pointer",
                    border: answers.budget === o.val ? `2px solid ${C.amber}` : "1px solid rgba(93,58,40,.1)",
                    background: answers.budget === o.val ? "rgba(196,135,59,.06)" : C.white,
                  }}>
                    <div style={{ fontFamily: F.s, fontSize: 15, fontWeight: 600, color: C.soil }}>{o.label}</div>
                    <div style={{ fontFamily: F.m, fontSize: 11, color: C.smoke, marginTop: 4 }}>{o.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESULT */}
          {step === "result" && rx && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 4, color: C.gold, marginBottom: 8 }}>YOUR PRESCRIPTION</div>
                <h2 style={{ fontFamily: F.d, fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: C.soil, fontStyle: "italic", lineHeight: 1.15 }}>
                  {rx.cafCups} Caf + {rx.decafCups} Decaf · {rx.roast} Roast
                </h2>
                <div style={{ fontFamily: F.m, fontSize: 13, color: C.amber, marginTop: 8 }}>~${rx.dailyCost}/day</div>
              </div>

              {/* Warnings */}
              {rx.warnings.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  {rx.warnings.map((w, i) => (
                    <div key={i} style={{ background: "rgba(155,48,48,.06)", border: "1px solid rgba(155,48,48,.15)", borderRadius: 8, padding: 16, marginBottom: 8, fontFamily: F.b, fontSize: 14, color: C.rust, lineHeight: 1.6 }}>⚠️ {w}</div>
                  ))}
                </div>
              )}

              {/* Daily Schedule */}
              <div style={{ background: C.white, borderRadius: 8, padding: 24, border: "1px solid rgba(93,58,40,.08)", marginBottom: 20 }}>
                <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.gold, marginBottom: 16 }}>DAILY SCHEDULE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>☕</span>
                    <div>
                      <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil }}>First cup: {rx.firstCupTime}</div>
                      <div style={{ fontFamily: F.b, fontSize: 13, color: C.clay }}>Wait 90 min after waking for cortisol dip. {rx.cafCups > 1 ? `${rx.cafCups - 1} more caffeinated cup(s) before ${rx.lastCafTime}.` : ""}</div>
                    </div>
                  </div>
                  {rx.decafCups > 0 && (
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>🫖</span>
                      <div>
                        <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil }}>Decaf: After {rx.lastCafTime}</div>
                        <div style={{ fontFamily: F.b, fontSize: 13, color: C.clay }}>{rx.decafCups} Swiss Water Process decaf cup(s). 70-80% antioxidants, zero sleep disruption.</div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>💤</span>
                    <div>
                      <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil }}>No coffee after 5:00 PM</div>
                      <div style={{ fontFamily: F.b, fontSize: 13, color: C.clay }}>Even decaf has 2-7mg caffeine. Herbal tea or water only.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roast */}
              <div style={{ background: C.white, borderRadius: 8, padding: 24, border: "1px solid rgba(93,58,40,.08)", borderLeft: `4px solid ${C.amber}`, marginBottom: 20 }}>
                <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.gold, marginBottom: 8 }}>RECOMMENDED ROAST</div>
                <div style={{ fontFamily: F.d, fontSize: 22, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 6 }}>{rx.roast}</div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.6 }}>{rx.roastReason}</div>
              </div>

              {/* Brands */}
              <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.gold, marginBottom: 12, marginTop: 32 }}>CAFFEINATED PICKS</div>
              {rx.brands.map(b => (
                <Link key={b.name} href={b.link} style={{ textDecoration: "none" }}>
                  <div style={{ background: C.white, borderRadius: 8, padding: 20, border: "1px solid rgba(93,58,40,.08)", marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontFamily: F.s, fontSize: 15, fontWeight: 700, color: C.soil }}>{b.name}</span>
                        <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: C.green, color: C.white, padding: "2px 6px", borderRadius: 3 }}>{b.tier}</span>
                      </div>
                      <div style={{ fontFamily: F.b, fontSize: 13, color: C.clay, marginTop: 4 }}>{b.why}</div>
                    </div>
                    <div style={{ fontFamily: F.m, fontSize: 14, color: C.amber, fontWeight: 600 }}>{b.price}</div>
                  </div>
                </Link>
              ))}

              {rx.decafCups > 0 && (
                <>
                  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.teal, marginBottom: 12, marginTop: 24 }}>DECAF PICK</div>
                  <Link href={rx.decafBrand.link} style={{ textDecoration: "none" }}>
                    <div style={{ background: C.white, borderRadius: 8, padding: 20, border: "1px solid rgba(93,58,40,.08)", borderLeft: `4px solid ${C.teal}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontFamily: F.s, fontSize: 15, fontWeight: 700, color: C.soil }}>{rx.decafBrand.name}</span>
                          <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: C.teal, color: C.white, padding: "2px 6px", borderRadius: 3 }}>{rx.decafBrand.tier}</span>
                        </div>
                        <div style={{ fontFamily: F.b, fontSize: 13, color: C.clay, marginTop: 4 }}>{rx.decafBrand.why}</div>
                      </div>
                      <div style={{ fontFamily: F.m, fontSize: 14, color: C.teal, fontWeight: 600 }}>{rx.decafBrand.price}</div>
                    </div>
                  </Link>
                </>
              )}

              {/* Summary card */}
              <div style={{ background: C.soil, borderRadius: 8, padding: 28, marginTop: 32 }}>
                <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.gold, marginBottom: 12 }}>THE SIMPLIFICATION</div>
                <div style={{ fontFamily: F.d, fontSize: 20, fontWeight: 700, color: C.cream, fontStyle: "italic", marginBottom: 12 }}>Fewer cups. Better cups. Right timing.</div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.7)", lineHeight: 1.6 }}>
                  Your prescription: {rx.cafCups} caffeinated + {rx.decafCups} decaf per day, {rx.roast.toLowerCase()} roast, first cup at {rx.firstCupTime}, last caf by {rx.lastCafTime}. Estimated daily cost: ${rx.dailyCost} — less than a single Starbucks latte. Maximum bioactive compounds. Zero pesticides. Zero mycotoxins. Protected sleep.
                </div>
              </div>

              {/* AI Insight */}
              {aiLoading && (
                <div style={{ background: "rgba(196,135,59,.06)", border: `1px dashed ${C.amber}`, borderRadius: 8, padding: 24, marginTop: 24, textAlign: "center" }}>
                  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.amber, marginBottom: 8 }}>AI ANALYSIS LOADING...</div>
                  <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay }}>Our coffee scientist is reviewing your profile...</div>
                </div>
              )}
              {aiResult && (
                <div style={{ background: "rgba(196,135,59,.04)", border: `1px solid rgba(196,135,59,.2)`, borderRadius: 8, padding: 24, marginTop: 24 }}>
                  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.gold, marginBottom: 12 }}>AI COFFEE SCIENTIST</div>
                  {aiResult.summary && <div style={{ fontFamily: F.d, fontSize: 18, fontWeight: 700, color: C.soil, fontStyle: "italic", marginBottom: 12, lineHeight: 1.3 }}>{aiResult.summary}</div>}
                  {aiResult.scienceNote && <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.6, marginBottom: 12 }}>{aiResult.scienceNote}</div>}
                  {aiResult.dailyProtocol && <div style={{ fontFamily: F.b, fontSize: 13, color: C.smoke, lineHeight: 1.6, padding: "12px 16px", background: C.white, borderRadius: 6 }}>{aiResult.dailyProtocol}</div>}
                </div>
              )}

              {/* Restart */}
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button onClick={() => { setStep("genetics"); setAnswers(DEFAULT_ANSWERS); setAiResult(null); }} style={{
                  fontFamily: F.m, fontSize: 12, letterSpacing: 2, padding: "12px 28px", borderRadius: 6,
                  border: "1px solid rgba(93,58,40,.15)", background: "transparent", color: C.smoke, cursor: "pointer",
                }}>START OVER</button>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          {step !== "result" && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
              {stepIdx > 0 ? (
                <button onClick={prev} style={{ fontFamily: F.m, fontSize: 12, letterSpacing: 2, padding: "12px 24px", borderRadius: 6, border: "1px solid rgba(93,58,40,.15)", background: "transparent", color: C.smoke, cursor: "pointer" }}>← BACK</button>
              ) : <div />}
              <button onClick={next} disabled={!canNext()} style={{
                fontFamily: F.m, fontSize: 12, letterSpacing: 2, padding: "12px 28px", borderRadius: 6,
                border: "none", cursor: canNext() ? "pointer" : "not-allowed",
                background: canNext() ? `linear-gradient(135deg,${C.amber},${C.gold})` : "rgba(93,58,40,.1)",
                color: canNext() ? C.white : C.smoke, opacity: canNext() ? 1 : 0.5,
              }}>{stepIdx === STEPS.length - 2 ? "GET PRESCRIPTION →" : "NEXT →"}</button>
            </div>
          )}
        </div>

        {/* NEXT STEPS */}
        <section style={{ background: C.parch, padding: "60px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <NextSteps steps={[
              { label: "Biodynamic Census", path: "/brewsoul/biodynamic", description: "Every Demeter-certified farm and roaster" },
              { label: "Decaf Done Right", path: "/brewsoul/decaf", description: "Swiss Water vs. paint stripper" },
              { label: "Coffee & Health", path: "/brewsoul/health", description: "Peer-reviewed research on every claim" },
            ]} />
          </div>
        </section>
      </div>
    </BrewSoulLayout>
    </>);
}
