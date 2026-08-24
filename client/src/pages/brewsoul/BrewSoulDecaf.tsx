/**
 * BrewSoul Decaf — Paint Stripper or Pure Water?
 * 13 clean brands (Hall of Fame), 10+ dirty brands (Wall of Shame),
 * 3 decaf processes, health science, price comparison.
 * Uses site's parchment palette. NO solid black backgrounds.
 */
import { useState, useEffect } from "react";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";

const HERO_IMG = "/api/img/brewsoul-orig_84eb4bc9.jpg";

const C = {
  soil: "#1a0e08", bark: "#2d1810", loam: "#3d2517", clay: "#5c3a28",
  amber: "#c4873b", wheat: "#d4a84b", cream: "#f5efe0", parch: "#ede4d0",
  sage: "#7a8c6e", moss: "#4a5e3c", dMoss: "#2d3a24", bone: "#e8dcc8",
  smoke: "#6b5a4e", rust: "#8b4c2a", white: "#ffffff",
  water: "#4a7c8c", dWater: "#2a4c5c", red: "#9b3030", dRed: "#5c1a1a",
  green: "#3a7a4a",
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

const FAME = [
  { name: "Holistic Roasters Biodynamic Decaf", price: "$19.95/10.6oz", perOz: "$1.88", process: "Swiss Water", cert: "Demeter + USDA Organic + EcoCert", origin: "Honduras (18 Conejo)", notes: "WORLD'S FIRST biodynamic decaf. Launched Dec 2025 in partnership with Swiss Water Process. Lab tested for mold, mycotoxins, heavy metals. SCA 85-87. The gold standard.", url: "https://biodynamic.coffee?ref=brewsoul", tier: "LEGENDARY", color: C.amber },
  { name: "Purity Coffee Calm Decaf", price: "$29/12oz", perOz: "$2.42", process: "Swiss Water", cert: "USDA Organic, Rainforest Alliance, Bird Friendly, Demeter (select)", origin: "Multi-origin", notes: "Tests for 350+ chemical compounds. Also offers 1/3-caf option. Highest CGA focus. Health-first brand. N₂-flushed bags. Smokeless roaster.", url: "https://puritycoffee.com?ref=brewsoul", tier: "PREMIUM", color: C.green },
  { name: "Lifeboost Swiss Water Decaf", price: "~$30/12oz", perOz: "$2.50", process: "Swiss Water", cert: "USDA Organic", origin: "Nicaragua (single origin, shade-grown)", notes: "Tests for 450+ toxins. Low acid. Highest-ranked SWP decaf in blind tastings (Decadent Decaf review). Berry, caramel, raisin notes. Spring-water washed.", url: "https://lifeboostcoffee.com?ref=brewsoul", tier: "PREMIUM", color: C.green },
  { name: "Cafe Altura Organic Decaf", price: "~$14.99/12oz", perOz: "$1.25", process: "Swiss Water", cert: "USDA Organic, Non-GMO, Demeter (caf lines)", origin: "Multi-origin", notes: "From the OG biodynamic company (est. 1980). Their decaf line uses SWP but isn't Demeter-certified biodynamic. Still excellent value organic SWP decaf.", url: "https://cafealtura.com?ref=brewsoul", tier: "VALUE KING", color: C.moss },
  { name: "Allegro Coffee Decaf (Whole Foods)", price: "~$12.50/12oz", perOz: "$1.04", process: "Swiss Water", cert: "USDA Organic, Fair Trade", origin: "Multi-origin", notes: "Best affordable Swiss Water decaf. Available at every Whole Foods. Italian Roast and French Roast options. Reliable daily driver. Low acidity.", url: "https://www.amazon.com/Allegro-Coffee?ref=brewsoul", tier: "BUDGET CHAMP", color: C.water },
  { name: "Caribou Coffee Decaf", price: "~$11/12oz", perOz: "$0.92", process: "Swiss Water", cert: "Rainforest Alliance", origin: "Multi-origin", notes: "Major chain using SWP. Widely available. Caribou Blend Decaf is their flagship. Smooth, accessible flavor. Good for offices.", url: "https://www.cariboucoffee.com?ref=brewsoul", tier: "MAINSTREAM", color: C.water },
  { name: "Jo Coffee 'No Fun Jo' Decaf", price: "$16.99/12oz", perOz: "$1.42", process: "Swiss Water", cert: "USDA Organic", origin: "Multi-origin", notes: "Top-rated on Amazon. Available in ground, whole bean, K-Cup, and Nespresso formats. Note: SWP now subject to 35% tariff (processed in Canada). Price rising.", url: "https://www.jocoffee.com?ref=brewsoul", tier: "CONVENIENCE", color: C.water },
  { name: "Kicking Horse Decaf", price: "~$14/10oz", perOz: "$1.40", process: "Swiss Water", cert: "Organic, Fair Trade", origin: "Multi-origin", notes: "Canadian roaster. Rich chocolate and caramel notes. Good body for a decaf. Widely available at grocery stores. One of the original SWP advocates.", url: "https://www.kickinghorsecoffee.com?ref=brewsoul", tier: "GROCERY PICK", color: C.water },
  { name: "Subtle Earth Organic Decaf", price: "~$24/2lb", perOz: "$0.75", process: "Swiss Water", cert: "CCOF Organic", origin: "Multi-origin", notes: "Best bulk value. 2lb bags. Chocolate, honey, caramel notes. Medium-dark. Beans appear darker due to SWP processing (normal). Non-GMO.", url: "https://www.amazon.com/Subtle-Earth-Organic-Decaf?ref=brewsoul", tier: "BULK VALUE", color: C.moss },
  { name: "Charleston Coffee Roasters SWP Decaf", price: "~$16/12oz", perOz: "$1.33", process: "Swiss Water", cert: "USDA Organic", origin: "Single origin", notes: "Cult following. 5-star reviews across the board. Tastes like regular single-origin. 'Best decaf I've ever had' is the most common review. Small batch.", url: "https://www.charlestoncoffeeroasters.com?ref=brewsoul", tier: "CULT FAVORITE", color: C.green },
  { name: "Blue Spruce Decaf", price: "~$18/12oz", perOz: "$1.50", process: "Swiss Water", cert: "Organic, Non-GMO", origin: "Multi-origin", notes: "Decaf-only company. Shade grown. Espresso and regular options. If a company does nothing but decaf, they'd better be great at it — they are.", url: "https://bluesprucedecaf.com?ref=brewsoul", tier: "SPECIALIST", color: C.water },
  { name: "Verena Street SWP Decaf", price: "~$14/12oz", perOz: "$1.17", process: "Swiss Water", cert: "Organic, Fair Trade, Rainforest Alliance", origin: "Multi-origin", notes: "Solar-powered roastery. Triple certified. 30-day money-back guarantee. Multiple grind options. Free shipping over $40.", url: "https://www.verenastreet.com?ref=brewsoul", tier: "SUSTAINABLE", color: C.moss },
  { name: "Peet's Coffee Decaf", price: "~$13/12oz", perOz: "$1.08", process: "Swiss Water (confirmed select lines)", cert: "Varies by line", origin: "Multi-origin", notes: "Major chain using SWP on select decaf lines. Check label — not all Peet's decaf is SWP. Their Major Dickason's Decaf is SWP. Widely available.", url: "https://www.peets.com?ref=brewsoul", tier: "CHAIN BEST", color: C.water },
];

const SHAME = [
  { name: "Dunkin' Donuts Decaf", process: "Methylene Chloride", issue: "Clean Label Project confirmed MC process. Dunkin' does not disclose decaffeination method on packaging. Pregnant women and heart patients are primary decaf consumers.", price: "~$9/12oz" },
  { name: "Amazon Fresh Decaf Colombia", process: "Methylene Chloride", issue: "Clean Label Project testing detected methylene chloride. CLP filed lawsuit against AmazonFresh for false/misleading labeling claiming 'pure' while containing MC residue.", price: "~$8/12oz" },
  { name: "Café Bustelo Decaf", process: "Methylene Chloride", issue: "CLP filed lawsuit against J.M. Smucker's (Café Bustelo parent) for methylene chloride in decaffeination process without label disclosure.", price: "~$7/12oz" },
  { name: "Maxwell House Decaf", process: "Methylene Chloride", issue: "CLP filed lawsuit against Kraft Heinz (Maxwell House parent). Testing found quantifiable MC amounts. Labeled as 'pure' despite chemical residue.", price: "~$8/12oz" },
  { name: "Kirkland Signature Decaf Dark Roast", process: "Methylene Chloride", issue: "Clean Label Project testing found MC traces. Made by Starbucks for Costco. Not disclosed on label. Signature Brand confirmed MC process.", price: "~$15/3lb" },
  { name: "Keurig Green Mountain Decaf K-Cups", process: "Methylene Chloride (most lines)", issue: "CLP filed lawsuit. Most K-Cup decaf lines use MC process. Convenience format makes it harder to check. Some specialty lines may differ.", price: "~$12/24ct" },
  { name: "Folgers Decaf", process: "Methylene Chloride", issue: "Does not disclose decaffeination method. Industry standard assumption is MC process for major commodity brands. No organic certification.", price: "~$8/12oz" },
  { name: "Starbucks Decaf (most lines)", process: "Methylene Chloride", issue: "Clean Label Project reports Starbucks uses MC for most decaf lines. The company does not disclose method on packaging. Some specialty lines may vary. Japan and Korea have banned MC in decaf coffee entirely.", price: "varies" },
  { name: "Nescafé Decaf Instant", process: "Methylene Chloride (industry standard for instant)", issue: "Virtually all instant decaf coffee globally uses MC process. Instant decaf also has higher mycotoxin levels than whole bean. Double risk.", price: "~$8/7oz" },
  { name: "Most store-brand/private label decaf", process: "Methylene Chloride (default)", issue: "If the packaging doesn't say 'Swiss Water', 'chemical-free', 'solvent-free', or 'certified organic', assume MC process. The FDA does not require method disclosure.", price: "varies" },
];

export default function BrewSoulDecaf() {
  const [showShame, setShowShame] = useState(false);
  const [expandedFame, setExpandedFame] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Swiss Water Decaf: Paint Stripper or Pure Water? | BrewSoul";
    // Add meta keywords for search engines
    let meta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'keywords';
      document.head.appendChild(meta);
    }
    meta.content = 'Swiss Water decaf, Swiss Water Process, chemical-free decaf, decaffeinated coffee, methylene chloride coffee, CO2 decaf, supercritical CO2 decaf, carbon footprint decaf, clean decaf brands, best decaf coffee, organic decaf, decaf health, decaf comparison';
    return () => { document.title = 'TonyG'; };
  }, []);

  return (
    <>
    <SEO
        title="Decaf Intelligence — BrewSoul"
        description="Swiss Water, EA, CO2: the truth about decaf processing and what it means for your cup."
        path="/brewsoul/decaf"
        keywords="Tony Greenberg, decaf coffee, Swiss Water decaf, EA decaf, CO2 decaf"
        indexable={true}
      />
      <BrewSoulLayout>
      <div style={{ background: C.cream, minHeight: "100vh", fontFamily: F.b, color: C.bark }}>

        {/* HERO */}
        <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.25) saturate(1.2)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg,rgba(42,76,92,.6) 0%,rgba(26,14,8,.7) 50%,rgba(45,24,16,.5) 100%)` }} />
          <div style={{ textAlign: "center", padding: "40px 28px", position: "relative", zIndex: 1, maxWidth: 800 }}>
            <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.water, marginBottom: 24 }}>BrewSoul · Decaf Done Right</div>
            <h1 style={{ fontFamily: F.d, fontSize: "clamp(36px,6vw,68px)", fontWeight: 700, color: C.cream, lineHeight: 1.05, margin: "0 0 20px", fontStyle: "italic" }}>
              Paint Stripper<br />or Pure Water?
            </h1>
            <p style={{ fontFamily: F.b, fontSize: "clamp(16px,2vw,20px)", color: "rgba(245,239,224,.7)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.6 }}>
              85% of the world's decaf is made with methylene chloride — a chemical the EPA banned from paint strippers in 2019. The FDA still allows it in your coffee. Here's every brand that does it right, and every brand that doesn't.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
              {[
                { n: "13", l: "Clean brands (Hall of Fame)" },
                { n: "10+", l: "Dirty brands (Wall of Shame)" },
                { n: "10", u: "ppm", l: "FDA allowed MC residue" },
                { n: "0", u: "ppm", l: "MC in Swiss Water Process" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontFamily: F.d, fontSize: 38, fontWeight: 700, color: C.wheat, lineHeight: 1 }}>{s.n}<span style={{ fontSize: 16, opacity: 0.6 }}>{s.u || ""}</span></div>
                  <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.bone, marginTop: 6, opacity: 0.7 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE 3 PROCESSES */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>How Decaf is Made</Label>
            <H2>Three Processes. Only Two Are Clean.</H2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, margin: "28px 0" }}>
              {/* MC */}
              <div style={{ background: C.white, border: `2px solid ${C.red}`, borderRadius: 8, padding: 24, position: "relative" }}>
                <div style={{ position: "absolute", top: 12, right: 12, fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: C.red, color: C.white, padding: "4px 8px", borderRadius: 3 }}>AVOID</div>
                <div style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: C.red, marginBottom: 4 }}>Methylene Chloride (MC)</div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginBottom: 12 }}>~85% OF GLOBAL DECAF</div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65 }}>
                  Chemical solvent that strips caffeine from green beans. EPA banned it from paint strippers in 2019 due to worker deaths. The FDA allows 10 ppm residue in decaf coffee. Japan and Korea have banned MC in decaf entirely. Industry uses it because it's the cheapest process. Most brands don't disclose method on packaging.
                </div>
                <div style={{ fontFamily: F.m, fontSize: 11, color: C.red, marginTop: 12, fontWeight: 600 }}>$0.35-0.90/oz · Cheapest process · Most flavor loss</div>
              </div>

              {/* SWP */}
              <div style={{ background: C.white, border: `2px solid ${C.water}`, borderRadius: 8, padding: 24, position: "relative" }}>
                <div style={{ position: "absolute", top: 12, right: 12, fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: C.water, color: C.white, padding: "4px 8px", borderRadius: 3 }}>RECOMMENDED</div>
                <div style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: C.water, marginBottom: 4 }}>Swiss Water Process (SWP)</div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginBottom: 12 }}>~10% OF GLOBAL DECAF</div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65 }}>
                  Uses only water, temperature, and time. Green beans soaked in hot water to dissolve caffeine. Water passed through carbon filters to capture caffeine while preserving flavor compounds. 99.9% caffeine removal. Zero chemical residue. Only decaffeination method certified organic worldwide. Developed in British Columbia, Canada. 2026 tariff note: now subject to 35% tariff (Canadian processing). Flavor preservation is measurably superior in blind testing.
                </div>
                <div style={{ fontFamily: F.m, fontSize: 11, color: C.water, marginTop: 12, fontWeight: 600 }}>$0.92-2.50/oz · Best flavor retention · Zero chemicals</div>
              </div>

              {/* CO2 */}
              <div style={{ background: C.white, border: `2px solid ${C.sage}`, borderRadius: 8, padding: 24, position: "relative" }}>
                <div style={{ position: "absolute", top: 12, right: 12, fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: C.sage, color: C.white, padding: "4px 8px", borderRadius: 3 }}>ALSO CLEAN</div>
                <div style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: C.moss, marginBottom: 4 }}>Supercritical CO₂ Process</div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginBottom: 12 }}>~5% OF GLOBAL DECAF</div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65 }}>
                  Carbon dioxide pressurized to supercritical state (liquid-gas hybrid) acts as selective solvent for caffeine. No chemical residue. Excellent flavor retention. CO₂ is naturally present in air and our bodies. More expensive than both MC and SWP. Less widely available in US retail. Growing in European specialty market. Some premium brands use this but labeling is inconsistent — ask directly.
                </div>
                <div style={{ fontFamily: F.m, fontSize: 11, color: C.moss, marginTop: 12, fontWeight: 600 }}>$1.50-3.00/oz · Best of science · Limited availability</div>
              </div>
            </div>

            <div style={{ background: C.soil, borderRadius: 8, padding: 24, marginTop: 20 }}>
              <div style={{ fontFamily: F.m, fontSize: 11, color: C.amber, letterSpacing: 2, marginBottom: 8 }}>THE LABEL TEST</div>
              <P light style={{ margin: 0, maxWidth: "none" }}>If the packaging doesn't explicitly say "Swiss Water Process", "chemical-free", "solvent-free", "water processed", or "certified organic" — assume methylene chloride. The FDA does not require disclosure of decaffeination method. Also: instant decaf coffee is almost universally MC-processed AND has higher mycotoxin levels than whole bean. Double risk, zero transparency.</P>
            </div>
          </div>
        </section>

        {/* HALL OF FAME */}
        <section style={{ background: C.cream, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Hall of Fame — Clean Decaf</Label>
            <H2>13 Brands That Do It Right</H2>
            <P>Every brand below uses Swiss Water Process or supercritical CO₂. Zero methylene chloride. Sorted by overall value equation: quality, certifications, transparency, and price.</P>

            {FAME.map((b, bi) => (
              <div key={b.name} style={{ background: C.white, border: "1px solid rgba(93,58,40,.08)", borderRadius: 8, padding: 20, marginBottom: 12, cursor: "pointer", borderLeft: `4px solid ${b.color}` }} onClick={() => setExpandedFame(expandedFame === bi ? null : bi)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: F.d, fontSize: 18, fontWeight: 700, color: C.soil, fontStyle: "italic" }}>{b.name}</span>
                      <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: b.color, color: C.white, padding: "3px 8px", borderRadius: 3 }}>{b.tier}</span>
                    </div>
                    <div style={{ fontFamily: F.s, fontSize: 12, color: C.smoke, marginTop: 4 }}>{b.cert}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: F.m, fontSize: 16, color: C.amber, fontWeight: 700 }}>{b.perOz}/oz</div>
                    <div style={{ fontFamily: F.s, fontSize: 12, color: C.smoke }}>{b.price}</div>
                  </div>
                </div>
                {expandedFame === bi && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(93,58,40,.06)" }}>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65, marginBottom: 10 }}>{b.notes}</div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: F.s, fontSize: 12, color: C.smoke }}>
                      <span><strong>Process:</strong> {b.process}</span>
                      <span><strong>Origin:</strong> {b.origin}</span>
                    </div>
                    <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.white, background: C.moss, padding: "8px 16px", borderRadius: 4, textDecoration: "none" }}>BUY →</a>
                  </div>
                )}
                <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginTop: 6 }}>{expandedFame === bi ? "▲" : "▼ Details & buy link"}</div>
              </div>
            ))}

            {/* Tariff callout */}
            <div style={{ background: C.soil, borderRadius: 8, padding: 24, margin: "28px 0" }}>
              <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 3, color: C.amber, marginBottom: 8 }}>2026 TARIFF ALERT</div>
              <P light style={{ margin: 0, maxWidth: "none" }}>Swiss Water Process decaf is now subject to a 35% tariff (processing facility is in Canada). This is pushing prices up across every SWP brand in 2026. The simplification play: buy in bulk now, lock in pre-escalation pricing. Subtle Earth at $0.75/oz in 2lb bags is the best hedge. Or subscribe to Holistic Roasters at 20% off for the biodynamic SWP decaf.</P>
            </div>
          </div>
        </section>

        {/* WALL OF SHAME */}
        <section style={{ background: `linear-gradient(175deg,${C.dRed} 0%,${C.soil} 100%)`, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label light>Wall of Shame — Chemical Decaf</Label>
            <H2 light>These Brands Use Paint Stripper Chemistry</H2>
            <P light>Every brand below uses methylene chloride (or doesn't disclose method, which defaults to MC). Data from Clean Label Project testing, public lawsuits, and brand disclosure research. The FDA allows 10 ppm MC residue. The EPA's preferred maximum for MC in drinking water is 0 ppb. Japan and Korea banned MC in decaf entirely.</P>

            <button onClick={() => setShowShame(!showShame)} style={{ fontFamily: F.m, fontSize: 12, letterSpacing: 2, background: "rgba(155,48,48,.3)", border: "1px solid rgba(155,48,48,.5)", color: C.bone, padding: "12px 24px", borderRadius: 4, cursor: "pointer", marginBottom: 24 }}>
              {showShame ? "HIDE WALL OF SHAME ▲" : "REVEAL WALL OF SHAME ▼"}
            </button>

            {showShame && (
              <div>
                {SHAME.map((b) => (
                  <div key={b.name} style={{ background: "rgba(155,48,48,.08)", border: "1px solid rgba(155,48,48,.2)", borderRadius: 6, padding: 20, marginBottom: 10, borderLeft: `4px solid ${C.red}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontFamily: F.s, fontSize: 16, fontWeight: 700, color: C.bone }}>{b.name}</div>
                        <div style={{ fontFamily: F.m, fontSize: 10, color: C.red, letterSpacing: 1, marginTop: 2 }}>PROCESS: {b.process}</div>
                      </div>
                      <div style={{ fontFamily: F.m, fontSize: 14, color: "rgba(245,239,224,.5)" }}>{b.price}</div>
                    </div>
                    <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.65)", lineHeight: 1.6, marginTop: 10 }}>{b.issue}</div>
                  </div>
                ))}

                <div style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 8, padding: 24, marginTop: 20 }}>
                  <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.bone, marginBottom: 8 }}>Clean Label Project Lawsuits (2020-present)</div>
                  <P light style={{ margin: 0, maxWidth: "none", fontSize: 14 }}>
                    CLP filed lawsuits in D.C. Superior Court against AmazonFresh, J.M. Smucker's (Café Bustelo), Peet's Coffee & Tea Holdco, Keurig Green Mountain, and Kraft Heinz (Maxwell House) for false and misleading advertising — labeling products as "pure" or "natural" while containing methylene chloride residue without disclosure. The Organic & Natural Health Association endorsed CLP's findings.
                  </P>
                </div>

                <div style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(245,239,224,.1)", borderRadius: 8, padding: 24, marginTop: 16 }}>
                  <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.bone, marginBottom: 8 }}>The Industry's Defense (and Why It's Weak)</div>
                  <P light style={{ margin: 0, maxWidth: "none", fontSize: 14 }}>
                    A coffee industry group wrote the FDA claiming that "true coffee aficionados in blind tastings" prefer MC-processed decaf. As STAT reporter Nick Florko noted: "which is a pretty funny claim if you consider the fact that we're talking about coffee here that's essentially rinsed in paint thinner." The FDA's risk assessment is from 1985, assumes a 5oz cup size (less than half a Starbucks tall), and hasn't been updated in 40 years.
                  </P>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CARBON FOOTPRINT COMPARISON */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Environmental Impact</Label>
            <H2>Carbon Footprint: Which Process Wins?</H2>
            <P>Decaffeination isn't just about what ends up in your cup — it's about what ends up in the atmosphere. The three processes have dramatically different energy profiles, water usage, and total carbon emissions per kilogram of decaf produced.</P>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, margin: "28px 0" }}>
              {/* SWP Carbon */}
              <div style={{ background: C.white, borderRadius: 8, padding: 24, border: "1px solid rgba(93,58,40,.08)", borderTop: `4px solid ${C.water}` }}>
                <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.water, marginBottom: 8 }}>LOWEST FOOTPRINT</div>
                <div style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: C.soil, marginBottom: 4 }}>Swiss Water Process</div>
                <div style={{ fontFamily: F.d, fontSize: 36, fontWeight: 700, color: C.water, margin: "12px 0" }}>~0.8 <span style={{ fontSize: 16 }}>kg CO₂e/kg</span></div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65 }}>
                  Closed-loop water recycling system. No chemical production chain. No high-pressure equipment. Carbon filtration is passive and low-energy. The Green Coffee Extract (GCE) is reused across batches — not discarded. Water is filtered and recirculated, not discharged. Single facility in Burnaby, BC runs on BC Hydro (95% renewable).
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(74,124,140,.08)", borderRadius: 4 }}>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: C.water }}>WHY IT WINS</div>
                  <div style={{ fontFamily: F.s, fontSize: 12, color: C.bark, marginTop: 4 }}>No chemical manufacturing upstream. No solvent disposal downstream. Water recycled in closed loop. Powered by near-100% renewable grid.</div>
                </div>
              </div>

              {/* CO2 Carbon */}
              <div style={{ background: C.white, borderRadius: 8, padding: 24, border: "1px solid rgba(93,58,40,.08)", borderTop: `4px solid ${C.sage}` }}>
                <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.sage, marginBottom: 8 }}>MODERATE FOOTPRINT</div>
                <div style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: C.soil, marginBottom: 4 }}>Supercritical CO₂</div>
                <div style={{ fontFamily: F.d, fontSize: 36, fontWeight: 700, color: C.sage, margin: "12px 0" }}>~2.5 <span style={{ fontSize: 16 }}>kg CO₂e/kg</span></div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65 }}>
                  Requires pressurizing CO₂ to 73+ atmospheres (1,070+ psi) at temperatures above 31°C. High-pressure pumps and heating systems are energy-intensive. CO₂ can be recycled between batches, but maintaining supercritical state consumes significant electricity. No chemical waste, but 3× the energy of SWP.
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(122,140,110,.08)", borderRadius: 4 }}>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: C.sage }}>THE TRADE-OFF</div>
                  <div style={{ fontFamily: F.s, fontSize: 12, color: C.bark, marginTop: 4 }}>Clean output (no residue) but energy-hungry process. Best flavor retention of any method. Premium price reflects the energy cost.</div>
                </div>
              </div>

              {/* MC Carbon */}
              <div style={{ background: C.white, borderRadius: 8, padding: 24, border: "1px solid rgba(93,58,40,.08)", borderTop: `4px solid ${C.red}` }}>
                <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.red, marginBottom: 8 }}>HIDDEN FOOTPRINT</div>
                <div style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: C.soil, marginBottom: 4 }}>Methylene Chloride</div>
                <div style={{ fontFamily: F.d, fontSize: 36, fontWeight: 700, color: C.red, margin: "12px 0" }}>~1.8 <span style={{ fontSize: 16 }}>kg CO₂e/kg</span></div>
                <div style={{ fontFamily: F.b, fontSize: 14, color: C.clay, lineHeight: 1.65 }}>
                  Process itself uses less energy (ambient pressure). But the full lifecycle tells a different story: MC production is petrochemical-derived (chlorination of methane). MC has a Global Warming Potential of ~9. Chemical disposal and wastewater treatment add hidden emissions. Worker safety infrastructure adds overhead.
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(155,48,48,.08)", borderRadius: 4 }}>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: C.red }}>THE HIDDEN COST</div>
                  <div style={{ fontFamily: F.s, fontSize: 12, color: C.bark, marginTop: 4 }}>Looks moderate on paper, but externalities (chemical production, disposal, health costs, regulatory compliance) aren't priced in. True cost is likely 2-3× higher.</div>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div style={{ background: C.soil, borderRadius: 8, padding: 28, marginTop: 24 }}>
              <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 3, color: C.amber, marginBottom: 12 }}>THE VERDICT</div>
              <div style={{ fontFamily: F.d, fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: C.cream, fontStyle: "italic", lineHeight: 1.3, marginBottom: 16 }}>Swiss Water Process wins on every environmental metric.</div>
              <P light style={{ margin: 0, maxWidth: "none" }}>
                Lowest carbon emissions. Zero chemical waste. Closed-loop water system. Powered by renewable energy. The only trade-off is capacity — there's one SWP facility on earth, in Burnaby, British Columbia. That's both the vulnerability (tariff exposure, single point of failure) and the opportunity: expanding chemical-free decaffeination infrastructure is a direct climate investment. If you care about what goes into your body AND what goes into the atmosphere, Swiss Water Process is the only answer that satisfies both.
              </P>
            </div>

            {/* Data sources */}
            <div style={{ fontFamily: F.m, fontSize: 10, color: C.smoke, marginTop: 16, letterSpacing: 1 }}>
              SOURCES: De Marco et al. 2017 (LCA of supercritical CO₂ decaffeination) · Swiss Water Decaffeinated Coffee Company sustainability reports · Christopher Montrose Coffee environmental analysis · Life Cycle Assessment of Decaffeinated Coffee Beans Production (Shofinita et al. 2025)
            </div>
          </div>
        </section>

        {/* DECAF HEALTH SCIENCE */}
        <section style={{ background: C.cream, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Decaf Health Science</Label>
            <H2>What You Keep, What You Lose</H2>
            <P>Decaf isn't nutritionally empty. The decaffeination process preserves most bioactive compounds. But there are real tradeoffs to understand — especially for those choosing decaf for sleep optimization or heart health.</P>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, margin: "24px 0" }}>
              <div style={{ background: C.white, borderRadius: 6, padding: 20, border: "1px solid rgba(93,58,40,.08)", borderTop: `3px solid ${C.green}` }}>
                <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.green, marginBottom: 8 }}>PRESERVED IN DECAF</div>
                {["Chlorogenic acid (CGA) — most retained", "Polyphenols — largely preserved", "Melanoidins — fully preserved (formed in roasting)", "Minerals (Mg, K) — fully preserved", "Trigonelline — largely preserved", "Low-acid benefit — maintained", "Antioxidant capacity — 70-80% retained"].map(i => (
                  <div key={i} style={{ fontFamily: F.s, fontSize: 13, color: C.bark, padding: "6px 0", borderBottom: "1px solid rgba(93,58,40,.04)", lineHeight: 1.5 }}>{i}</div>
                ))}
              </div>
              <div style={{ background: C.white, borderRadius: 6, padding: 20, border: "1px solid rgba(93,58,40,.08)", borderTop: `3px solid ${C.rust}` }}>
                <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.rust, marginBottom: 8 }}>REDUCED OR LOST IN DECAF</div>
                {["Caffeine — 99.9% removed (SWP)", "Neuroprotective effect — caffeinated coffee linked to lower Parkinson's risk; decaf shows weaker association", "Metabolic boost — caffeine's 3-11% metabolism increase lost", "Cognitive stimulation — adenosine receptor antagonism removed", "Some volatile aromatics — slight reduction in complexity", "Mycotoxin risk — decaf and instant coffee have HIGHER mycotoxin levels (choose mold-tested brands)"].map(i => (
                  <div key={i} style={{ fontFamily: F.s, fontSize: 13, color: C.bark, padding: "6px 0", borderBottom: "1px solid rgba(93,58,40,.04)", lineHeight: 1.5 }}>{i}</div>
                ))}
              </div>
            </div>

            <div style={{ background: C.parch, borderRadius: 8, padding: 24, borderLeft: `4px solid ${C.water}`, marginTop: 16 }}>
              <div style={{ fontFamily: F.s, fontSize: 14, fontWeight: 700, color: C.soil, marginBottom: 8 }}>The Simplification Case for Decaf</div>
              <P style={{ margin: 0, maxWidth: "none" }}>If you're drinking coffee after 2pm, switch to biodynamic SWP decaf. You keep 70-80% of the antioxidant benefit, lose the sleep disruption, and avoid the cortisol spike. One morning biodynamic caffeinated cup + one afternoon biodynamic SWP decaf = maximum nutrient density across the full day with minimal downside. This is fewer cups, better cups, right timing.</P>
            </div>
          </div>
        </section>

        {/* PRICE COMPARISON */}
        <section style={{ background: C.parch, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label>Complete Price Map</Label>
            <H2>Every Clean Decaf, Ranked by Value</H2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.s, fontSize: 13, background: C.white, borderRadius: 8 }}>
                <thead>
                  <tr>{["Brand", "$/oz", "Process", "Certs", "Tier"].map(h => (<th key={h} style={{ textAlign: "left", padding: "12px 10px", borderBottom: `2px solid ${C.amber}`, fontFamily: F.m, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: C.smoke }}>{h}</th>))}</tr>
                </thead>
                <tbody>
                  {[...FAME].sort((a, b) => parseFloat(a.perOz.replace("$", "").replace("~", "")) - parseFloat(b.perOz.replace("$", "").replace("~", ""))).map((b, i) => (
                    <tr key={b.name} style={{ background: i % 2 === 0 ? "transparent" : "rgba(245,239,224,.3)", borderLeft: b.tier === "LEGENDARY" ? `3px solid ${C.amber}` : "3px solid transparent" }}>
                      <td style={{ padding: "10px", fontWeight: 600, color: C.bark, fontSize: 14 }}>{b.name}</td>
                      <td style={{ padding: "10px", fontFamily: F.m, fontSize: 13, color: C.amber, fontWeight: 700 }}>{b.perOz}</td>
                      <td style={{ padding: "10px", color: C.clay }}>{b.process}</td>
                      <td style={{ padding: "10px", color: C.clay, fontSize: 12 }}>{b.cert}</td>
                      <td style={{ padding: "10px" }}><span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1, background: b.color, color: C.white, padding: "3px 6px", borderRadius: 3 }}>{b.tier}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section style={{ background: `linear-gradient(175deg,${C.soil},${C.bark})`, padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <Label light>The ABIT Angle</Label>
            <H2 light>Decaf as Impact Infrastructure</H2>
            <P light>The Swiss Water Process facility in British Columbia is a single point of failure for clean decaf worldwide. There is no second SWP facility. This creates both risk (tariff exposure, capacity constraints) and opportunity: a tokenized community investment in expanding chemical-free decaffeination capacity would directly serve the Great Simplification — more people drinking cleaner coffee for less systemic cost. The biodynamic farms producing beans for the world's first biodynamic decaf (18 Conejo, Honduras) are already B-Corp-adjacent, Demeter-certified, and generating verifiable impact data. The entire chain — from regenerative farm to SWP facility to conscious consumer — is a ready-made ABIT pipeline.</P>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section style={{ background: C.cream, padding: "60px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <NextSteps steps={[
              { label: "Biodynamic Coffee Census", path: "/brewsoul/biodynamic", description: "Every Demeter-certified farm and roaster on earth" },
              { label: "Coffee & Health", path: "/brewsoul/health", description: "Peer-reviewed research on what coffee does to your body" },
              { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "AI-powered personalized recommendation" },
            ]} />
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: C.soil, padding: "48px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: F.d, fontSize: 24, fontWeight: 700, color: C.cream, fontStyle: "italic", marginBottom: 8 }}>BrewSoul · Decaf</div>
          <div style={{ fontFamily: F.b, fontSize: 14, color: "rgba(245,239,224,.5)", maxWidth: 500, margin: "0 auto 16px", lineHeight: 1.6 }}>13 clean brands. 10+ dirty brands. Every decaffeination process explained. Zero compromise.</div>
          <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: "rgba(245,239,224,.3)" }}>ALL PRICES USD · CLEAN LABEL PROJECT DATA · VERIFIED FEB 2026</div>
        </footer>
      </div>
    </BrewSoulLayout>
    </>);
}
