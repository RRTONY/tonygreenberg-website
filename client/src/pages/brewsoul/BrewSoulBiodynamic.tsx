/**
 * BrewSoul Biodynamic — Complete census of Demeter-certified biodynamic coffee.
 * 3 farms, 6 roasters, nutritional science, cost calculator, tokenization angle.
 * Uses site's parchment palette + glass-morphism. NO solid black backgrounds.
 */
import { useState } from "react";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";

/* ── Colors ── */
const HERO_IMG = "/api/img/brewsoul-orig_84eb4bc9.jpg";

const C = {
  soil: "#1a0e08", bark: "#2d1810", loam: "#3d2517", clay: "#5c3a28",
  amber: "#c4873b", wheat: "#d4a84b", cream: "#f5efe0", parch: "#ede4d0",
  sage: "#7a8c6e", moss: "#4a5e3c", dMoss: "#2d3a24", bone: "#e8dcc8",
  smoke: "#6b5a4e", rust: "#8b4c2a", white: "#ffffff",
};

/* ── Typography ── */
const F = {
  d: "'Playfair Display',Georgia,serif",
  b: "'Source Sans 3','Source Serif 4',Georgia,serif",
  m: "'DM Mono','JetBrains Mono','Courier New',monospace",
  s: "'Source Sans 3','DM Sans','Helvetica Neue',sans-serif",
};

/* ── Shared components ── */
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
const FARMS = [
  {
    name: "La Chacra D'Dago", country: "Junín, Peru", alt: "1700m", est: "2005",
    cert: ["Demeter", "USDA Organic", "EcoCert", "B-Corp"],
    varietals: "Catigua, Obata, Tupi", process: "Washed",
    notes: "Rich chocolate, molasses, toasted hazelnut",
    story: "Third-generation family farm in the Peruvian Andes, El Palomar. First biodynamic farm to receive the Demeter seal. On-site beekeeping, multi-species tree cultivation, animal husbandry. B-Corp certified 2024. Supplies green beans to most biodynamic roasters worldwide.",
    roasters: ["Holistic Roasters", "Cafe Altura", "Deepvalley Coffee"],
    co2: "15-25 tons/ha/yr", birds: "120+ species", organic: "2-4 tons matter/ha/yr",
  },
  {
    name: "18 Conejo Farming Collective", country: "Marcala, Honduras", alt: "1280m", est: "~2010",
    cert: ["Demeter", "USDA Organic", "EcoCert"],
    varietals: "Bourbon, Typica, Lempira", process: "Washed",
    notes: "Rich chocolate, hazelnut, sugarcane",
    story: "Family-run collective by siblings Flhor and Napo Zelaya Contreras. Pioneers in organic and biodynamic farming in Honduras. Top 10 Honduras Cup of Excellence. Focus on soil health and regenerative techniques. Source for the world's first biodynamic decaf (via Swiss Water Process).",
    roasters: ["Holistic Roasters", "Primal Pastures"],
    co2: "10-20 tons/ha/yr", birds: "90+ species", organic: "2-3 tons matter/ha/yr",
  },
  {
    name: "Fazenda Camocim", country: "Espírito Santo, Brazil", alt: "~900m", est: "~1990s",
    cert: ["Demeter"],
    varietals: "Various (incl. Jacu Bird processed)", process: "Natural + Jacu Bird",
    notes: "Smooth, low-acidity, chocolate, almond, citrus (Jacu Bird variant)",
    story: "Located 1km from mystical Pedra Azul (Blue Rock) in Domingos Martins. Home of the legendary Jacu Bird coffee — wild jacu birds eat ripe cherries, beans collected and processed. One of the most expensive coffees in Brazil. Also produces standard biodynamic roasts at accessible prices.",
    roasters: ["Primal Pastures (Rubicon/Rise & Shine roasts)"],
    co2: "12-20 tons/ha/yr", birds: "150+ species (Jacu habitat)", organic: "3-5 tons matter/ha/yr",
  },
];

const ROASTERS = [
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
    products: [
      { roast: "Various Organic roasts", origin: "Peru/Honduras", oz: "10.6oz", price: "~$17.95", perOz: "~$1.69" },
    ],
    sub: "Organic (not biodynamic) line from same roaster. Lower price entry point.",
    testing: "Same lab testing standards as Holistic Roasters biodynamic line.",
    unique: "Entry-level product from the Holistic Roasters family. Same quality roasting (Scott Rao trained), same farms, just organic certification instead of full Demeter biodynamic. Good stepping stone.",
    rating: "★★★☆☆ Best entry point",
  },
];

const SCIENCE = [
  { compound: "Chlorogenic Acid (CGA)", amount: "27-121 mg/cup", effect: "Antioxidant, anti-inflammatory, lowers blood pressure via RAAS inhibition, neuroprotective. 500mg/day reduced weight 1.3kg in meta-analysis. Organic has 15-20% more CGA than conventional.", source: "Nutrients 2024; Zalewska 2025; Warsaw Univ 2020" },
  { compound: "Polyphenols (total)", amount: "200-550 mg/cup", effect: "Coffee is #1 dietary antioxidant source in Western diet. Organic coffee has 27% more polyphenols. Light roast preserves most. Anti-aging, anti-cancer mechanisms documented.", source: "Plant Foods for Human Nutrition 2011; PMC 2025" },
  { compound: "Caffeine", amount: "80-120 mg/cup", effect: "Adenosine receptor antagonist. Cognitive enhancement. Reduced Parkinson's risk (caffeinated > decaf for neurodegeneration). Stimulates metabolism 3-11%.", source: "Frontiers in Nutrition 2025" },
  { compound: "Trigonelline", amount: "40-110 mg/cup", effect: "Neuroprotective, glucose regulation, antibacterial. Converts to niacin (vitamin B3) during roasting. Higher in lighter roasts.", source: "Molecules 2023" },
  { compound: "Melanoidins", amount: "Formed in roasting", effect: "Prebiotic, antioxidant, antimicrobial. Support gut microbiome diversity. Higher in darker roasts. Complement CGA's benefits.", source: "IP J Nutr Metab 2024" },
  { compound: "Cafestol & Kahweol", amount: "Method-dependent", effect: "Diterpenes with anti-cancer and liver-protective properties. Highest in unfiltered brew (French press, Turkish, espresso). Filtered coffee has minimal amounts.", source: "Molecules 2024" },
];

const FARM_COLORS = [C.amber, C.sage, C.wheat];
const ROASTER_COLORS = [C.amber, C.moss, C.sage, C.clay, C.wheat, C.smoke];

/* ── Cost Calculator ── */
function CostCalc() {
  const [cups, setCups] = useState(2);
  const conv = cups * 365 * 0.12;
  const org = cups * 365 * 0.22;
  const bio = cups * 365 * 0.38;
  return (
<div style={{ background: C.parch, borderRadius: 8, padding: 28, margin: "28px 0", border: "1px solid rgba(93,58,40,.1)" }}>
      <Label>Annual Cost Calculator</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontFamily: F.b, fontSize: 15, color: C.bark }}>I drink</span>
        <input type="range" min={1} max={6} value={cups} onChange={e => setCups(+e.target.value)} style={{ width: 120, accentColor: C.amber }} />
        <span style={{ fontFamily: F.d, fontSize: 24, fontWeight: 700, color: C.amber }}>{cups}</span>
        <span style={{ fontFamily: F.b, fontSize: 15, color: C.bark }}>cups per day</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        {[
          { l: "Conventional", c: conv, d: "Pesticides, mold risk, soil depletion", h: false },
          { l: "Organic", c: org, d: "No synthetics, some natural pesticides allowed", h: false },
          { l: "Biodynamic", c: bio, d: "Zero pesticides, regenerative, mold-tested", h: true },
        ].map(t => (
          <div key={t.l} style={{ background: t.h ? C.soil : "rgba(255,255,255,.7)", borderRadius: 6, padding: 16, textAlign: "center", border: t.h ? "none" : "1px solid rgba(93,58,40,.08)" }}>
            <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: t.h ? C.bone : C.smoke, marginBottom: 8 }}>{t.l}</div>
            <div style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: t.h ? C.wheat : C.bark }}>${Math.round(t.c)}</div>
            <div style={{ fontFamily: F.s, fontSize: 11, color: t.h ? "rgba(245,239,224,.6)" : C.smoke, marginTop: 6, lineHeight: 1.4 }}>{t.d}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, marginTop: 16, textAlign: "center", fontStyle: "italic" }}>
        The biodynamic premium is <strong>${Math.round(bio - conv)}/year</strong> — about ${((bio - conv) / 365).toFixed(2)}/day for zero pesticides, carbon sequestration, and verified purity.
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function BrewSoulBiodynamic() {
  const [expandedFarm, setExpandedFarm] = useState<number | null>(null);
  const [expandedRoaster, setExpandedRoaster] = useState<number | null>(null);

  return (
    <BrewSoulLayout>
      <SEO
        title="Biodynamic Coffee — BrewSoul"
        description="The science and philosophy of biodynamic coffee farming and why it matters."
        path="/brewsoul/biodynamic"
        keywords="Tony Greenberg, biodynamic coffee, regenerative farming, coffee sustainability"
        indexable={true}
      />
      <div style={{ background: C.cream, minHeight: "100vh", fontFamily: F.b, color: C.bark }}>

        {/* HERO */}
        <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.3) saturate(1.3)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg,rgba(26,14,8,.7) 0%,rgba(45,24,16,.6) 40%,rgba(45,62,36,.5) 100%)` }} />
          <div style={{ textAlign: "center", padding: "40px 28px", position: "relative", zIndex: 1, maxWidth: 800 }}>
            <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.sage, marginBottom: 24 }}>BrewSoul · Biodynamic Coffee</div>
            <h1 style={{ fontFamily: F.d, fontSize: "clamp(36px,6vw,68px)", fontWeight: 700, color: C.cream, lineHeight: 1.05, margin: "0 0 20px", fontStyle: "italic" }}>
              Every Farm on Earth<br />That Grows It Right
            </h1>
            <p style={{ fontFamily: F.b, fontSize: "clamp(16px,2vw,20px)", color: "rgba(245,239,224,.7)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.6 }}>
              The complete census of Demeter-certified biodynamic coffee. Three farms. Six roasters. Zero pesticides. This is the entire market — and it's all you need.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
              {[
                { n: "3", l: "Certified farms worldwide" },
                { n: "6", l: "Roasters / brands" },
                { n: "0", l: "Pesticides of any kind" },
                { n: "1924", l: "Year biodynamic farming began" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontFamily: F.d, fontSize: 38, fontWeight: 700, color: C.wheat, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.bone, marginTop: 6, opacity: 0.7 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>The Great Simplification</Label>
            <H2>Less Coffee. Better Coffee. Better Planet.</H2>
            <P>The biodynamic market is small on purpose. Only three farms in the world carry Demeter certification for coffee. Only six roasters process and sell it. This isn't a limitation — it's proof that regenerative agriculture can't be faked at scale. You're not choosing between 200 brands competing on marketing. You're choosing between a handful of families who've dedicated decades to treating soil as a living system.</P>
            <P>Organic coffee contains 15-20% more chlorogenic acid and 27% more polyphenols than conventional (Warsaw University of Life Sciences, 2020). Biodynamic goes further: zero pesticides of any kind (organic still allows rotenone, ryania, sabadilla — all pollinator killers), third-party mold and heavy metal testing, and active carbon sequestration. One biodynamic cup does what 2-3 conventional cups attempt nutritionally.</P>

            <div style={{ background: C.soil, borderRadius: 8, padding: 32, margin: "32px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
              {[
                { t: "Conventional", items: ["Up to 250 lbs chemicals/acre", "42 pesticides used globally", "No mold testing required", "Soil degradation over time", "No biodiversity requirements", "No supply chain transparency", "$0.40-0.60/oz"], color: C.rust },
                { t: "USDA Organic", items: ["No synthetic pesticides", "Natural pesticides allowed (kill pollinators)", "No mold testing required", "Soil preservation (not regeneration)", "No shade or canopy requirements", "Supply chain audited annually", "$0.65-0.90/oz"], color: C.sage },
                { t: "Demeter Biodynamic", items: ["Zero pesticides of any kind", "Pollinators fully protected", "Lab tested: mold, mycotoxins, heavy metals", "Active soil regeneration + carbon sequestration", "40%+ shade canopy, 12+ tree species", "Full origin-to-cup traceability", "$1.30-1.90/oz"], color: C.amber },
              ].map(t => (
                <div key={t.t} style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 6, padding: 24, borderTop: `3px solid ${t.color}` }}>
                  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: t.color, marginBottom: 16, fontWeight: 600 }}>{t.t}</div>
                  {t.items.map((item, i) => (
                    <div key={i} style={{ fontFamily: F.s, fontSize: 13, color: C.bone, padding: "8px 0", borderBottom: i < t.items.length - 1 ? "1px solid rgba(245,239,224,.06)" : "none", lineHeight: 1.5 }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE 3 FARMS */}
        <section style={{ background: `linear-gradient(175deg,${C.dMoss} 0%,${C.soil} 100%)`, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label light>Source Farms — Complete Global Census</Label>
            <H2 light>3 Farms. That's the Entire World Supply.</H2>
            <P light>Every Demeter-certified biodynamic coffee bean on earth comes from one of these three farms. There are no others. This radical scarcity is intentional — Demeter certification takes years to achieve and demands the farm operate as a complete living organism with on-site composting, animal integration, and zero external chemical inputs.</P>

            {FARMS.map((farm, fi) => (
              <div key={farm.name} style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 8, padding: 28, marginBottom: 20, cursor: "pointer", borderLeft: `4px solid ${FARM_COLORS[fi]}` }} onClick={() => setExpandedFarm(expandedFarm === fi ? null : fi)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: F.d, fontSize: 24, fontWeight: 700, color: C.cream, fontStyle: "italic" }}>{farm.name}</div>
                    <div style={{ fontFamily: F.s, fontSize: 13, color: C.bone, marginTop: 4, opacity: 0.7 }}>{farm.country} · {farm.alt} · Est. {farm.est}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {farm.cert.map(c => (<span key={c} style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: "rgba(196,135,59,.15)", color: C.amber, padding: "4px 8px", borderRadius: 3 }}>{c}</span>))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, margin: "16px 0" }}>
                  <div><div style={{ fontFamily: F.m, fontSize: 9, color: C.smoke, letterSpacing: 1 }}>CO₂ SEQUESTERED</div><div style={{ fontFamily: F.d, fontSize: 16, color: C.wheat }}>{farm.co2}</div></div>
                  <div><div style={{ fontFamily: F.m, fontSize: 9, color: C.smoke, letterSpacing: 1 }}>BIRD SPECIES</div><div style={{ fontFamily: F.d, fontSize: 16, color: C.wheat }}>{farm.birds}</div></div>
                  <div><div style={{ fontFamily: F.m, fontSize: 9, color: C.smoke, letterSpacing: 1 }}>ORGANIC MATTER</div><div style={{ fontFamily: F.d, fontSize: 16, color: C.wheat }}>{farm.organic}</div></div>
                  <div><div style={{ fontFamily: F.m, fontSize: 9, color: C.smoke, letterSpacing: 1 }}>VARIETALS</div><div style={{ fontFamily: F.s, fontSize: 13, color: C.bone }}>{farm.varietals}</div></div>
                </div>

                <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.65)", lineHeight: 1.6, marginTop: 8 }}>
                  <strong style={{ color: C.bone }}>Tasting:</strong> {farm.notes} · <strong style={{ color: C.bone }}>Process:</strong> {farm.process}
                </div>

                {expandedFarm === fi && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(245,239,224,.1)" }}>
                    <div style={{ fontFamily: F.b, fontSize: 15, color: C.bone, lineHeight: 1.7 }}>{farm.story}</div>
                    <div style={{ marginTop: 12, fontFamily: F.m, fontSize: 11, color: C.amber }}>
                      Supplies to: {farm.roasters.join(" · ")}
                    </div>
                  </div>
                )}
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginTop: 8 }}>{expandedFarm === fi ? "▲ Collapse" : "▼ Tap for full story"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ALL ROASTERS */}
        <section style={{ background: C.cream, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>All Roasters & Brands — Complete Market</Label>
            <H2>6 Ways to Buy Biodynamic Coffee</H2>
            <P>Every roaster below sources from the same 3 farms. The differences are in roasting expertise, testing transparency, packaging, price, and availability. Ranked by overall value equation.</P>

            {ROASTERS.map((r, ri) => (
              <div key={r.name} style={{ background: C.white, border: "1px solid rgba(93,58,40,.08)", borderRadius: 8, padding: 24, marginBottom: 16, cursor: "pointer", borderLeft: `4px solid ${ROASTER_COLORS[ri]}` }} onClick={() => setExpandedRoaster(expandedRoaster === ri ? null : ri)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: F.d, fontSize: 20, fontWeight: 700, color: C.soil, fontStyle: "italic" }}>{r.name}</div>
                    <div style={{ fontFamily: F.s, fontSize: 13, color: C.smoke, marginTop: 2 }}>{r.loc}</div>
                  </div>
                  <div style={{ fontFamily: F.d, fontSize: 16, color: C.amber, fontWeight: 700 }}>{r.rating}</div>
                </div>

                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, marginTop: 10, lineHeight: 1.6 }}>{r.unique}</div>

                {/* Products table */}
                <div style={{ overflowX: "auto", margin: "16px 0" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.s, fontSize: 13 }}>
                    <thead>
                      <tr>{["Product", "Origin", "Size", "Price", "$/oz"].map(h => (<th key={h} style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid rgba(93,58,40,.1)", fontFamily: F.m, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: C.smoke }}>{h}</th>))}</tr>
                    </thead>
                    <tbody>
                      {r.products.map((p, pi) => (
                        <tr key={pi} style={{ background: pi % 2 === 0 ? "transparent" : "rgba(245,239,224,.3)" }}>
                          <td style={{ padding: "10px", fontWeight: 600, color: C.bark }}>{p.roast}</td>
                          <td style={{ padding: "10px", color: C.clay }}>{p.origin}</td>
                          <td style={{ padding: "10px", color: C.clay }}>{p.oz}</td>
                          <td style={{ padding: "10px", color: C.bark, fontWeight: 600 }}>{p.price}</td>
                          <td style={{ padding: "10px", fontFamily: F.m, fontSize: 12, color: C.amber, fontWeight: 600 }}>{p.perOz}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {expandedRoaster === ri && (
                  <div style={{ paddingTop: 12, borderTop: "1px solid rgba(93,58,40,.06)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                      <div><div style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, color: C.smoke, marginBottom: 4 }}>CERTIFICATIONS</div><div style={{ fontFamily: F.s, fontSize: 13, color: C.bark }}>{r.cert.join(" · ")}</div></div>
                      <div><div style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, color: C.smoke, marginBottom: 4 }}>SOURCE FARMS</div><div style={{ fontFamily: F.s, fontSize: 13, color: C.bark }}>{r.source.join(" · ")}</div></div>
                    </div>
                    <div style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, color: C.smoke, marginBottom: 4 }}>TESTING & QA</div>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.6, marginBottom: 8 }}>{r.testing}</div>
                    {r.sub && <div style={{ fontFamily: F.s, fontSize: 12, color: C.moss, fontStyle: "italic" }}>{r.sub}</div>}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.white, background: C.moss, padding: "10px 20px", borderRadius: 4, textDecoration: "none" }}>BUY DIRECT →</a>
                  </div>
                )}
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginTop: 8 }}>{expandedRoaster === ri ? "▲ Collapse" : "▼ Tap for details, certs & buy link"}</div>
              </div>
            ))}

            <CostCalc />
          </div>
        </section>

        {/* SCIENCE */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Nutritional Science</Label>
            <H2>What's Actually in a Biodynamic Cup</H2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
              {SCIENCE.map(c => (
                <div key={c.compound} style={{ background: C.white, borderRadius: 6, padding: 20, border: "1px solid rgba(93,58,40,.08)" }}>
                  <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil }}>{c.compound}</div>
                  <div style={{ fontFamily: F.m, fontSize: 12, color: C.amber, fontWeight: 600, margin: "4px 0 10px" }}>{c.amount}</div>
                  <div style={{ fontFamily: F.b, fontSize: 13, color: C.clay, lineHeight: 1.55, marginBottom: 8 }}>{c.effect}</div>
                  <div style={{ fontFamily: F.m, fontSize: 9, color: C.smoke }}>{c.source}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.white, borderRadius: 8, padding: 24, borderLeft: `4px solid ${C.moss}`, marginTop: 24 }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil, marginBottom: 8 }}>The Light Roast Advantage for Biodynamic</div>
              <P style={{ margin: 0, maxWidth: "none" }}>CGA drops dramatically with roast level. If you're drinking biodynamic for maximum health value, choose light or medium roast. Light roast biodynamic is the highest-density nutritional cup per dollar — fewer cups needed, more active compounds per sip. Dark roast trades CGA for melanoidins (different benefit profile). The simplification principle: light roast biodynamic = maximum nutrient density = fewer cups = less consumption for more benefit.</P>
            </div>
          </div>
        </section>

        {/* IMPACT / TOKENIZATION */}
        <section style={{ background: `linear-gradient(175deg,${C.soil} 0%,${C.bark} 100%)`, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label light>Tokenizable Impact</Label>
            <H2 light>From Cup to Community: The ABIT Connection</H2>
            <P light>Biodynamic coffee farms generate measurable, verifiable environmental outcomes that map directly to Asset-Backed Impact Tokens. Every hectare produces quantifiable data: CO₂ sequestered, species supported, soil carbon content, water filtration. These farms are B-Corp certified, regenerative, and produce both revenue (coffee sales) and verified impact (carbon credits, biodiversity metrics). A community of retail token holders becomes the demand engine — co-investment as co-creation.</P>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, margin: "32px 0" }}>
              {[
                { n: "15-25", u: "tons CO₂/ha/yr", d: "Mature shade canopy carbon sequestration — on-chain verifiable via soil carbon analysis" },
                { n: "120+", u: "bird species", d: "Smithsonian Bird Friendly metrics — biodiversity data as impact credits" },
                { n: "2-4", u: "tons organic matter/ha/yr", d: "Soil regeneration via natural mulching — measurable soil health improvement" },
                { n: "$0.38", u: "per cup impact", d: "Every biodynamic cup is a micro-investment in ecosystem restoration" },
              ].map(m => (
                <div key={m.n} style={{ background: "rgba(245,239,224,.04)", border: "1px solid rgba(245,239,224,.08)", borderRadius: 6, padding: 20 }}>
                  <div style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.wheat, lineHeight: 1.1 }}>{m.n}</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: C.amber, letterSpacing: 1, marginBottom: 10 }}>{m.u}</div>
                  <div style={{ fontFamily: F.b, fontSize: 13, color: "rgba(245,239,224,.6)", lineHeight: 1.55 }}>{m.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section style={{ background: C.cream, padding: "60px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <NextSteps steps={[
              { label: "Decaf Done Right", path: "/brewsoul/decaf", description: "Swiss Water vs. paint stripper — the complete decaf guide" },
              { label: "Coffee & Health", path: "/brewsoul/health", description: "Peer-reviewed research on what coffee does to your body" },
              { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "AI-powered personalized recommendation" },
            ]} />
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: C.soil, padding: "48px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: F.d, fontSize: 24, fontWeight: 700, color: C.cream, fontStyle: "italic", marginBottom: 8 }}>BrewSoul · Biodynamic</div>
          <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.5)", maxWidth: 500, margin: "0 auto 16px", lineHeight: 1.6 }}>Complete census of every Demeter-certified biodynamic coffee on earth. 3 farms. 6 roasters. Zero compromise.</div>
          <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: "rgba(245,239,224,.3)" }}>ALL PRICES USD · DATA VERIFIED FEB 2026 · PEER-REVIEWED SOURCES</div>
        </footer>
      </div>
    </BrewSoulLayout>
  );
}
