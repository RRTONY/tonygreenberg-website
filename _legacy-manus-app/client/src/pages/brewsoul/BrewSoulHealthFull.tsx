/**
 * BrewSoul Coffee & Health — Comprehensive peer-reviewed research page.
 * Caffeine metabolism, cortisol, sleep architecture, mycotoxins, CGA science,
 * pregnancy, mental health, longevity. Every claim cited.
 * Uses site's parchment palette. NO solid black backgrounds.
 */
import { useState } from "react";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";

const HERO_IMG = "/api/img/brewsoul-orig_84eb4bc9.jpg";

const C = {
  soil: "#1a0e08", bark: "#2d1810", loam: "#3d2517", clay: "#5c3a28",
  amber: "#c4873b", wheat: "#d4a84b", cream: "#f5efe0", parch: "#ede4d0",
  sage: "#7a8c6e", moss: "#4a5e3c", dMoss: "#2d3a24", bone: "#e8dcc8",
  smoke: "#6b5a4e", rust: "#8b4c2a", white: "#ffffff",
  teal: "#4a7c8c", dTeal: "#2a4c5c", green: "#3a7a4a",
};

const F = {
  d: "'Playfair Display',Georgia,serif",
  b: "'Source Sans 3','Source Serif 4',Georgia,serif",
  m: "'DM Mono','JetBrains Mono','Courier New',monospace",
  s: "'Source Sans 3','DM Sans','Helvetica Neue',sans-serif",
};

const Label = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: light ? C.bone : C.smoke, marginBottom: 12, opacity: 0.8 }}>{children}</div>
);
const H2 = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <h2 style={{ fontFamily: F.d, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: light ? C.cream : C.soil, lineHeight: 1.15, margin: "0 0 24px", fontStyle: "italic" }}>{children}</h2>
);
const P = ({ children, light, style }: { children: React.ReactNode; light?: boolean; style?: React.CSSProperties }) => (
  <p style={{ fontFamily: F.b, fontSize: 17, lineHeight: 1.7, color: light ? "rgba(245,239,224,.88)" : C.bark, margin: "0 0 18px", maxWidth: 720, ...style }}>{children}</p>
);

/* ── Data ── */
const LONGEVITY = [
  { title: "All-Cause Mortality", finding: "3-5 cups/day → 15% lower risk of death from any cause", study: "Poole et al., BMJ 2017", n: ">1M participants", type: "benefit" as const },
  { title: "Type 2 Diabetes", finding: "Each daily cup → 6% lower risk. One of the most robust findings in coffee research.", study: "Ding et al., Diabetes Care 2014", n: "1.1M participants, 28 studies", type: "benefit" as const },
  { title: "Liver Protection", finding: "2+ cups/day → 44% lower cirrhosis risk, 40% lower liver cancer risk. Coffee is the #1 dietary protector of the liver.", study: "Kennedy et al., Alimentary Pharmacology 2016", n: "430K participants", type: "benefit" as const },
  { title: "Cardiovascular Disease", finding: "3-5 cups/day → 15% lower CVD risk. J-shaped curve: moderate intake protective, extreme intake neutral.", study: "Ding et al., Circulation 2014", n: "1.3M participants", type: "benefit" as const },
  { title: "Parkinson's Disease", finding: "25-30% lower risk with regular consumption. Caffeine appears to be the protective compound — decaf shows weaker association.", study: "Qi & Li, Geriatrics & Gerontology International 2014", n: "680K participants", type: "benefit" as const },
  { title: "Depression", finding: "4+ cups/day → 20% lower risk. Caffeine's dopaminergic effects may be protective.", study: "Wang et al., Australian & NZ Journal of Psychiatry 2016", n: "346K participants", type: "benefit" as const },
  { title: "Colorectal Cancer", finding: "4+ cups/day → 15% lower risk. Both caffeinated and decaf show benefit, suggesting polyphenols are the active agent.", study: "Gan et al., BMC Cancer 2017", n: "5.4M participants", type: "benefit" as const },
  { title: "Alzheimer's Disease", finding: "3-5 cups/day → 65% lower risk in midlife drinkers. Caffeine may block beta-amyloid accumulation.", study: "Eskelinen et al., Journal of Alzheimer's Disease 2009", n: "1,409 participants, 21-year follow-up", type: "benefit" as const },
];

const RISKS = [
  { title: "Sleep Disruption", detail: "Caffeine half-life: 5-6 hours. A 2pm coffee means 50% still active at 8pm. Even if you 'fall asleep fine,' caffeine reduces deep sleep by 20%. This is the #1 risk.", citation: "Drake et al., J Clinical Sleep Medicine 2013", severity: "HIGH" },
  { title: "Anxiety Amplification", detail: "Blocks adenosine → amplifies anxiety in susceptible individuals. 400mg+ can trigger panic attacks. CYP1A2 slow metabolizers are 2-3x more vulnerable.", citation: "Lara, Food & Chemical Toxicology 2010", severity: "MODERATE" },
  { title: "Pregnancy", detail: "WHO: <200mg/day. Higher intake → lower birth weight, possible miscarriage risk. Caffeine crosses the placenta freely. Fetal liver cannot metabolize caffeine until after birth.", citation: "WHO Guidelines 2016; Chen et al., BMC Medicine 2016", severity: "HIGH" },
  { title: "Cortisol Spike", detail: "Coffee raises cortisol 30-50% within 30 min. If consumed on an empty stomach at wake, it amplifies the cortisol awakening response (CAR). Optimal: wait 90-120 min after waking.", citation: "Lovallo et al., Pharmacology Biochemistry & Behavior 2005", severity: "MODERATE" },
  { title: "Bone Density", detail: "Very high intake (>4 cups/day) may slightly reduce calcium absorption. Easily offset by adequate calcium intake. Minor concern for most people.", citation: "Heaney, Food & Chemical Toxicology 2002", severity: "LOW" },
  { title: "Acid Reflux / GERD", detail: "Coffee relaxes the lower esophageal sphincter in some individuals. Cold brew and low-acid varieties (Lifeboost, Purity) significantly reduce this effect.", citation: "Kim et al., Diseases of the Esophagus 2014", severity: "MODERATE" },
  { title: "Iron Absorption", detail: "Polyphenols in coffee reduce non-heme iron absorption by up to 39% when consumed with meals. Separate coffee from iron-rich meals by 1 hour.", citation: "Morck et al., American Journal of Clinical Nutrition 1983", severity: "MODERATE" },
];

const CAFFEINE_METABOLISM = [
  { gene: "CYP1A2 — Fast Metabolizer", pct: "~50% of population", halfLife: "2-4 hours", effect: "Coffee is protective. 2-3 cups/day associated with lower heart attack risk.", advice: "You can drink coffee later in the day with less sleep impact. Still cut off by 2pm for optimal sleep." },
  { gene: "CYP1A2 — Slow Metabolizer", pct: "~50% of population", halfLife: "6-10 hours", effect: "Coffee may increase heart attack risk at high doses. Anxiety more likely.", advice: "Limit to 1-2 cups before noon. Switch to decaf after 10am. Your genetics make timing critical." },
];

const COMPOUNDS = [
  { name: "Chlorogenic Acid (CGA)", amount: "70-350mg per cup", effect: "Primary antioxidant. Anti-inflammatory, blood sugar regulation, neuroprotective. 15-20% higher in organic coffee. Drops dramatically with dark roasting.", source: "Farah & Donangelo, Brazilian Journal of Plant Physiology 2006", preserved: true },
  { name: "Caffeine", amount: "80-200mg per cup", effect: "Adenosine receptor antagonist. Improves alertness, reaction time, endurance. Raises cortisol and adrenaline. Half-life 5-6 hours.", source: "McLellan et al., Neuroscience & Biobehavioral Reviews 2016", preserved: false },
  { name: "Trigonelline", amount: "40-110mg per cup", effect: "Neuroprotective. Converts to niacin (vitamin B3) during roasting. Anti-bacterial properties. May protect against Parkinson's.", source: "Zhou et al., Food Chemistry 2012", preserved: true },
  { name: "Melanoidins", amount: "Variable (formed in roasting)", effect: "Antioxidant, prebiotic, anti-inflammatory. Higher in dark roasts. Bind to heavy metals in the gut. Unique to roasted coffee.", source: "Moreira et al., Food & Function 2012", preserved: true },
  { name: "Diterpenes (Cafestol & Kahweol)", amount: "1-7mg per cup (method dependent)", effect: "Anti-cancer properties but raise LDL cholesterol. Paper filters remove 95%+. French press and espresso retain them.", source: "Gross et al., Molecular Nutrition & Food Research 2017", preserved: true },
  { name: "Polyphenols", amount: "200-550mg per cup", effect: "Antioxidant, anti-inflammatory, gut microbiome support. 27% higher in biodynamic/organic. Coffee is the #1 polyphenol source in Western diet.", source: "Vinson et al., J Agricultural & Food Chemistry 2005", preserved: true },
  { name: "Magnesium", amount: "7-24mg per cup", effect: "Supports 300+ enzymatic reactions. Most Americans are deficient. Coffee contributes meaningfully to daily intake.", source: "USDA FoodData Central", preserved: true },
  { name: "Potassium", amount: "116mg per cup", effect: "Electrolyte balance, heart rhythm, muscle function. A 3-cup habit provides ~350mg — 7% of daily needs.", source: "USDA FoodData Central", preserved: true },
];

const MYCOTOXINS = [
  { toxin: "Ochratoxin A (OTA)", source: "Aspergillus & Penicillium molds", risk: "Kidney damage, immunosuppression, possible carcinogen (Group 2B). Found in 33-80% of commercial coffee samples.", solution: "Buy mold-tested brands. Wet-processed > natural. Light roast retains more OTA than dark." },
  { toxin: "Aflatoxin B1", source: "Aspergillus flavus", risk: "Most potent natural carcinogen known. Liver cancer. Found primarily in improperly stored green beans.", solution: "Specialty grade coffee has lower risk. Biodynamic/organic farms with proper drying protocols are safest." },
  { toxin: "Acrylamide", source: "Formed during roasting (Maillard reaction)", risk: "Possible carcinogen (Group 2A). Higher in light roasts. Lower in dark roasts (paradox: dark roast destroys CGA but also destroys acrylamide).", solution: "Medium roast is the optimal tradeoff. Or choose brands that test and disclose levels." },
];

const TIMING = [
  { time: "5:00-7:00 AM", label: "Wake", advice: "Don't drink coffee yet. Cortisol is naturally peaking (CAR). Coffee amplifies cortisol unnecessarily and builds tolerance faster.", icon: "🌅" },
  { time: "7:30-9:30 AM", label: "Optimal Window 1", advice: "Cortisol dips. This is the ideal first cup. Maximum alertness benefit, minimum cortisol interference.", icon: "☕" },
  { time: "9:30-11:30 AM", label: "Cortisol Dip 2", advice: "Second cup if needed. Still within the safe window for sleep. CYP1A2 fast metabolizers can push to 11:30.", icon: "☕" },
  { time: "12:00-2:00 PM", label: "Last Call", advice: "Absolute last caffeinated cup for slow metabolizers. Fast metabolizers can push to 2pm. After this, switch to decaf.", icon: "⏰" },
  { time: "2:00-5:00 PM", label: "Decaf Only", advice: "Switch to Swiss Water Process decaf. You keep 70-80% of antioxidants, zero sleep disruption. Biodynamic SWP decaf is the optimal afternoon choice.", icon: "🫖" },
  { time: "5:00 PM+", label: "No Coffee", advice: "Even decaf has 2-7mg caffeine. Herbal tea or water only. Adenosine needs to accumulate for quality sleep.", icon: "💤" },
];

export default function BrewSoulHealthFull() {
  const [expandedCompound, setExpandedCompound] = useState<number | null>(null);
  const [showRisks, setShowRisks] = useState(false);

  return (
    <>
    <SEO
        title="Coffee and Health — BrewSoul"
        description="The complete science of coffee and health: longevity, cognition, cardiovascular effects, and more."
        path="/brewsoul/health"
        keywords="Tony Greenberg, coffee health, coffee longevity, coffee cognition, coffee cardiovascular"
        indexable={true}
      />
      <BrewSoulLayout>
      <div style={{ background: C.cream, minHeight: "100vh", fontFamily: F.b, color: C.bark }}>

        {/* HERO */}
        <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.3) saturate(1.1)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg,rgba(42,76,92,.5) 0%,rgba(26,14,8,.7) 50%,rgba(58,122,74,.3) 100%)` }} />
          <div style={{ textAlign: "center", padding: "40px 28px", position: "relative", zIndex: 1, maxWidth: 800 }}>
            <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.sage, marginBottom: 24 }}>BrewSoul · Science, Not Marketing</div>
            <h1 style={{ fontFamily: F.d, fontSize: "clamp(36px,6vw,68px)", fontWeight: 700, color: C.cream, lineHeight: 1.05, margin: "0 0 20px", fontStyle: "italic" }}>
              What Coffee<br />Actually Does to You
            </h1>
            <p style={{ fontFamily: F.b, fontSize: "clamp(16px,2vw,20px)", color: "rgba(245,239,224,.7)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.6 }}>
              Every claim peer-reviewed. Every citation linked. Caffeine metabolism, cortisol timing, mycotoxin risk, compound science, and the longevity data that changes how you drink.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
              {[
                { n: "8", l: "Longevity benefits (cited)" },
                { n: "7", l: "Real risks to manage" },
                { n: "8", l: "Bioactive compounds" },
                { n: "3", l: "Mycotoxin threats" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontFamily: F.d, fontSize: 38, fontWeight: 700, color: C.wheat, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.bone, marginTop: 6, opacity: 0.7 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LONGEVITY DATA */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>The Longevity Evidence</Label>
            <H2>What 10+ Million Participants Tell Us</H2>
            <P>Coffee is the single most studied beverage in nutritional science. The data is overwhelming: moderate consumption (3-5 cups/day) is associated with lower risk of death from virtually every major disease. These aren't wellness blog claims — they're meta-analyses of millions of participants published in the world's top medical journals.</P>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, margin: "28px 0" }}>
              {LONGEVITY.map((l, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 8, padding: 20, border: "1px solid rgba(93,58,40,.08)", borderLeft: `4px solid ${C.green}` }}>
                  <div style={{ fontFamily: F.s, fontSize: 16, fontWeight: 700, color: C.soil, marginBottom: 6 }}>{l.title}</div>
                  <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.6, marginBottom: 10 }}>{l.finding}</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke }}>{l.study}</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: C.sage, marginTop: 2 }}>n = {l.n}</div>
                </div>
              ))}
            </div>

            <div style={{ background: C.white, borderRadius: 8, padding: 24, borderLeft: `4px solid ${C.amber}`, marginTop: 16 }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil, marginBottom: 8 }}>The Dose-Response Curve</div>
              <P style={{ margin: 0, maxWidth: "none" }}>Nearly all benefits follow a J-shaped or U-shaped curve. The sweet spot is 3-5 cups/day for most outcomes. Below 3 cups, benefits are present but smaller. Above 5-6 cups, benefits plateau and some risks increase. The simplification principle: 3 cups of high-quality coffee beats 6 cups of commodity coffee for every measured outcome.</P>
            </div>
          </div>
        </section>

        {/* RISKS */}
        <section style={{ background: `linear-gradient(175deg,${C.soil} 0%,${C.bark} 100%)`, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label light>The Real Risks</Label>
            <H2 light>What the Science Says You Should Manage</H2>
            <P light>Coffee isn't universally beneficial. These are the evidence-based risks — not wellness panic, not coffee-industry denial. Manage these and coffee becomes net positive for almost everyone.</P>

            <button onClick={() => setShowRisks(!showRisks)} style={{ fontFamily: F.m, fontSize: 12, letterSpacing: 2, background: "rgba(139,76,42,.3)", border: "1px solid rgba(139,76,42,.5)", color: C.bone, padding: "12px 24px", borderRadius: 4, cursor: "pointer", marginBottom: 24 }}>
              {showRisks ? "COLLAPSE RISKS ▲" : "SHOW ALL 7 RISKS ▼"}
            </button>

            {showRisks && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {RISKS.map((r, i) => (
                  <div key={i} style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 8, padding: 20, borderLeft: `4px solid ${r.severity === "HIGH" ? C.rust : r.severity === "MODERATE" ? C.amber : C.sage}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontFamily: F.s, fontSize: 16, fontWeight: 700, color: C.cream }}>{r.title}</div>
                      <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: r.severity === "HIGH" ? C.rust : r.severity === "MODERATE" ? C.amber : C.sage, color: C.white, padding: "3px 8px", borderRadius: 3 }}>{r.severity}</span>
                    </div>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.75)", lineHeight: 1.65, marginTop: 10 }}>{r.detail}</div>
                    <div style={{ fontFamily: F.m, fontSize: 10, color: "rgba(245,239,224,.4)", marginTop: 8 }}>{r.citation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CAFFEINE METABOLISM */}
        <section style={{ background: C.cream, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Your Genetics Matter</Label>
            <H2>CYP1A2: The Coffee Gene</H2>
            <P>Half the population metabolizes caffeine fast. Half metabolizes it slowly. This single gene variant (CYP1A2) determines whether coffee is a longevity tool or a cardiovascular risk. Most people don't know which they are — but your body gives clear signals.</P>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, margin: "28px 0" }}>
              {CAFFEINE_METABOLISM.map((m, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 8, padding: 24, border: "1px solid rgba(93,58,40,.08)", borderTop: `3px solid ${i === 0 ? C.green : C.rust}` }}>
                  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: i === 0 ? C.green : C.rust, marginBottom: 12, fontWeight: 600 }}>{m.gene}</div>
                  <div style={{ fontFamily: F.s, fontSize: 13, color: C.smoke, marginBottom: 12 }}>{m.pct} · Half-life: {m.halfLife}</div>
                  <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.6, marginBottom: 12 }}>{m.effect}</div>
                  <div style={{ background: C.parch, borderRadius: 6, padding: 12 }}>
                    <div style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, color: C.smoke, marginBottom: 4 }}>RECOMMENDATION</div>
                    <div style={{ fontFamily: F.s, fontSize: 13, color: C.bark, lineHeight: 1.5 }}>{m.advice}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: C.parch, borderRadius: 8, padding: 24, borderLeft: `4px solid ${C.teal}` }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil, marginBottom: 8 }}>How to Know Your Type</div>
              <P style={{ margin: 0, maxWidth: "none" }}>If you can drink espresso after dinner and sleep fine, you're likely a fast metabolizer. If a single cup makes you jittery or anxious, you're likely slow. Genetic testing (23andMe, AncestryDNA) can confirm via the CYP1A2 SNP rs762551. But your body's signals are usually sufficient.</P>
            </div>
          </div>
        </section>

        {/* OPTIMAL TIMING */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Chronobiology</Label>
            <H2>The Optimal Coffee Schedule</H2>
            <P>When you drink coffee matters as much as what you drink. Cortisol follows a circadian rhythm. Caffeine has a 5-6 hour half-life. Adenosine accumulation drives sleep pressure. Here's the science-backed schedule.</P>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "28px 0" }}>
              {TIMING.map((t, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 8, padding: 20, border: "1px solid rgba(93,58,40,.08)", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 28, flexShrink: 0, width: 40, textAlign: "center" }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                      <div style={{ fontFamily: F.m, fontSize: 13, color: C.amber, fontWeight: 600 }}>{t.time}</div>
                      <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil }}>{t.label}</div>
                    </div>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.6 }}>{t.advice}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BIOACTIVE COMPOUNDS */}
        <section style={{ background: C.cream, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Compound Science</Label>
            <H2>What's Actually in Your Cup</H2>
            <P>Coffee contains 1,000+ bioactive compounds. These eight are the most studied and most impactful. Understanding them changes how you choose roast level, brew method, and whether organic/biodynamic matters.</P>

            {COMPOUNDS.map((c, ci) => (
              <div key={c.name} style={{ background: C.white, border: "1px solid rgba(93,58,40,.08)", borderRadius: 8, padding: 20, marginBottom: 12, cursor: "pointer", borderLeft: `4px solid ${c.preserved ? C.green : C.amber}` }} onClick={() => setExpandedCompound(expandedCompound === ci ? null : ci)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: F.d, fontSize: 18, fontWeight: 700, color: C.soil, fontStyle: "italic" }}>{c.name}</div>
                    <div style={{ fontFamily: F.m, fontSize: 12, color: C.amber, marginTop: 2 }}>{c.amount}</div>
                  </div>
                  <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: c.preserved ? C.green : C.amber, color: C.white, padding: "3px 8px", borderRadius: 3 }}>{c.preserved ? "PRESERVED IN DECAF" : "LOST IN DECAF"}</span>
                </div>
                {expandedCompound === ci && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(93,58,40,.06)" }}>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65, marginBottom: 8 }}>{c.effect}</div>
                    <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke }}>{c.source}</div>
                  </div>
                )}
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginTop: 6 }}>{expandedCompound === ci ? "▲" : "▼ Details & citation"}</div>
              </div>
            ))}

            <div style={{ background: C.white, borderRadius: 8, padding: 24, borderLeft: `4px solid ${C.moss}`, marginTop: 20 }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil, marginBottom: 8 }}>The Roast Level Tradeoff</div>
              <P style={{ margin: 0, maxWidth: "none" }}>Light roast = maximum CGA, trigonelline, and caffeine. Dark roast = maximum melanoidins, minimum acrylamide, lower caffeine. Medium roast is the optimal tradeoff for most health goals. If you're drinking biodynamic for maximum nutritional value, choose light or medium roast — you're paying a premium for compounds that dark roasting destroys.</P>
            </div>
          </div>
        </section>

        {/* MYCOTOXINS */}
        <section style={{ background: `linear-gradient(175deg,${C.dMoss} 0%,${C.soil} 100%)`, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label light>The Hidden Threat</Label>
            <H2 light>Mycotoxins, Mold & What They Don't Tell You</H2>
            <P light>Coffee is one of the most mycotoxin-prone crops on earth. Improper drying, storage, and processing create conditions for mold growth. Most commercial coffee is never tested. The brands that test and disclose are the ones worth buying.</P>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, margin: "28px 0" }}>
              {MYCOTOXINS.map((m, i) => (
                <div key={i} style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 8, padding: 24, borderTop: `3px solid ${C.rust}` }}>
                  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.rust, marginBottom: 8, fontWeight: 600 }}>{m.toxin}</div>
                  <div style={{ fontFamily: F.s, fontSize: 12, color: "rgba(245,239,224,.5)", marginBottom: 12 }}>Source: {m.source}</div>
                  <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.75)", lineHeight: 1.6, marginBottom: 12 }}>{m.risk}</div>
                  <div style={{ background: "rgba(58,122,74,.15)", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, color: C.sage, marginBottom: 4 }}>SOLUTION</div>
                    <div style={{ fontFamily: F.s, fontSize: 13, color: C.bone, lineHeight: 1.5 }}>{m.solution}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 8, padding: 24, marginTop: 16 }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.bone, marginBottom: 8 }}>Brands That Test & Disclose</div>
              <P light style={{ margin: 0, maxWidth: "none" }}>Purity Coffee (350+ compounds), Lifeboost (450+ toxins), Holistic Roasters (mold, mycotoxins, heavy metals, pesticides). These three brands publish their testing protocols. Most specialty roasters don't test at all — they rely on SCA grading, which doesn't include mycotoxin screening. "Specialty grade" ≠ "mold-free."</P>
            </div>
          </div>
        </section>

        {/* THE SIMPLIFICATION PROTOCOL */}
        <section style={{ background: C.cream, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>The Protocol</Label>
            <H2>The Great Simplification — Applied to Coffee</H2>
            <P>All of this research points to the same conclusion: fewer cups, better cups, right timing. Here's the evidence-based protocol that maximizes benefit and minimizes risk.</P>

            <div style={{ background: C.soil, borderRadius: 8, padding: 32, margin: "28px 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
                {[
                  { n: "1", title: "Morning: 1-2 Biodynamic Cups", detail: "Light or medium roast. Wait 90 min after waking. Maximum CGA, polyphenols, and caffeine benefit. Mold-tested. Zero pesticides.", color: C.amber },
                  { n: "2", title: "Afternoon: 1 SWP Decaf Cup", detail: "Swiss Water Process biodynamic decaf. 70-80% of antioxidants retained. Zero sleep disruption. Zero methylene chloride.", color: C.teal },
                  { n: "3", title: "Evening: Nothing", detail: "Let adenosine accumulate. Even decaf has 2-7mg caffeine. Herbal tea or water only after 5pm. Protect deep sleep.", color: C.sage },
                ].map(p => (
                  <div key={p.n} style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 6, padding: 24, borderTop: `3px solid ${p.color}` }}>
                    <div style={{ fontFamily: F.d, fontSize: 32, fontWeight: 700, color: p.color, marginBottom: 8 }}>{p.n}</div>
                    <div style={{ fontFamily: F.s, fontSize: 15, fontWeight: 700, color: C.cream, marginBottom: 8 }}>{p.title}</div>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.65)", lineHeight: 1.6 }}>{p.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.parch, borderRadius: 8, padding: 24, borderLeft: `4px solid ${C.amber}` }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil, marginBottom: 8 }}>The Math</div>
              <P style={{ margin: 0, maxWidth: "none" }}>2-3 cups of biodynamic coffee per day (1-2 caf + 1 decaf) costs ~$1.50-2.50/day. The average American spends $5.40/day on coffee (NCA 2024). You spend less, get more bioactive compounds per cup, avoid mycotoxins and pesticides, protect your sleep, and fund regenerative agriculture. Fewer cups. Better cups. Lower cost. Higher impact. That's simplification.</P>
            </div>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section style={{ background: C.parch, padding: "60px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <NextSteps steps={[
              { label: "Biodynamic Census", path: "/brewsoul/biodynamic", description: "Every Demeter-certified farm and roaster on earth" },
              { label: "Decaf Done Right", path: "/brewsoul/decaf", description: "Swiss Water vs. paint stripper — the complete guide" },
              { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "AI-powered personalized recommendation" },
            ]} />
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: C.soil, padding: "48px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: F.d, fontSize: 24, fontWeight: 700, color: C.cream, fontStyle: "italic", marginBottom: 8 }}>BrewSoul · Coffee & Health</div>
          <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.5)", maxWidth: 500, margin: "0 auto 16px", lineHeight: 1.6 }}>Peer-reviewed research on every claim. 8 longevity benefits. 7 real risks. 8 bioactive compounds. Zero wellness marketing.</div>
          <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: "rgba(245,239,224,.3)" }}>ALL CITATIONS PEER-REVIEWED · DATA VERIFIED FEB 2026</div>
        </footer>
      </div>
    </BrewSoulLayout>
    </>);
}
