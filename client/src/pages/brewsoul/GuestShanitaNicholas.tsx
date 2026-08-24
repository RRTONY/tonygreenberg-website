/**
 * Guest Series: Shanita Nicholas — Coffee Industry's Comfortable Lies
 * 10-question journalistic interrogation. Standalone + BrewSoul integrated.
 */
import { useState } from "react";
import BrewSoulLayout from "./BrewSoulLayout";
import SEO from "@/components/SEO";
import NextSteps from "./NextSteps";

const C = {
  soil: "#1a0e08", bark: "#2d1810", loam: "#3d2517", clay: "#5c3a28",
  amber: "#c4873b", wheat: "#d4a84b", cream: "#f5efe0", parch: "#ede4d0",
  sage: "#7a8c6e", moss: "#4a5e3c", dMoss: "#2d3a24", bone: "#e8dcc8",
  smoke: "#6b5a4e", rust: "#8b4c2a", white: "#ffffff", gold: "#d4af37",
};
const F = {
  d: "'Playfair Display',Georgia,serif",
  b: "'Source Sans 3','Source Serif 4',Georgia,serif",
  m: "'DM Mono','JetBrains Mono','Courier New',monospace",
};

/* ── Data ── */
const PROFILE = {
  name: "Shanita Nicholas",
  img: "/api/img/brewsoul-orig_84eb4bc9.jpg",
  title: "Director of Coffee Ecology, Quantum Seeds LLC",
  bg: "B.S. Chemical Engineering (Columbia), J.D./M.B.A. (Columbia), Certified Q Grader (2023)",
  impact: "Co-founded Sip & Sonder (2017)\u2014Black women-owned specialty coffee brand. Now scaling origin-roasting networks through Quantum Seeds to move manufacturing and profit to coffee-producing countries.",
};

interface QA {
  num: number;
  q: string;
  paras: string[];
  highlight?: string;
  data?: string;
  sources?: { label: string; url: string }[];
}

const QAS: QA[] = [
  {
    num: 1,
    q: "If Fair Trade worked since 1988, why are farmers still broke?",
    paras: [
      "Because Fair Trade was designed to make consumers feel better, not make farmers wealthy. Farmers pay $0.03/lb just to be eligible. Of the $0.30 premium paid, only $0.03 reaches individual growers\u2014the rest funds cooperative administration. Research found less than 12% of Fair Trade premiums actually reached farmers.",
    ],
    highlight: "Fair Trade USA makes 70% of its $10M budget from licensing fees. The system exists to market Fair Trade, not protect farmers. Non-certified farmers often earn more per pound than Fair Trade farmers.",
    data: "The Math: Farmers capture $0.03 of every dollar premium paid for Fair Trade coffee. Retailers, certification bodies, and cooperatives capture $0.97.",
    sources: [
      { label: "Stanford Social Innovation Review", url: "https://ssir.org/articles/entry/the_problem_with_fair_trade_coffee" },
      { label: "Camano Island Coffee", url: "https://camanoislandcoffee.com/fair-trade-coffee-problems/" },
    ],
  },
  {
    num: 2,
    q: "What made you leave law to expose coffee\u2019s supply chain as rigged?",
    paras: [
      "I was drafting supply chain contracts\u2014I understood leverage. Farmers are 12 layers removed from roasters. Zero bargaining power. Payment terms demand 180\u2013270 days to pay, forcing farmers into predatory loans. Fair Trade just prettified the same extractive structure.",
      "I realized: the system doesn\u2019t just underpay farmers\u2014it extracts financially, contractually, informationally. That\u2019s why I built Quantum Seeds: roasting happens at origin, farmers control the roast profile, the supply chain is transparent because it\u2019s short.",
    ],
    sources: [
      { label: "Fair World Project", url: "https://fairworldproject.org/low-prices-and-exploitation-recurring-themes-in-coffee/" },
      { label: "Coffee Intelligence", url: "https://intelligence.coffee/2025/02/high-coffee-prices-and-cash-flow/" },
    ],
  },
  {
    num: 3,
    q: "Producing countries earned 38% of retail coffee revenue in 1940. By 2017, it\u2019s 10%. How did that happen?",
    paras: [
      "Industry consolidation. Mega-buyers (Nestl\u00e9, JDE Peet\u2019s, Starbucks) used scale as a weapon. They demand lower prices from exporters, who demand lower prices from farmers. Consolidation cascades as price pressure down the chain.",
    ],
    data: "By 2017: Producing countries captured less than 10% of the $200B global coffee industry revenue, despite growing 95% of the world\u2019s coffee.",
    sources: [
      { label: "Science Direct", url: "https://www.sciencedirect.com/science/article/abs/pii/S0305750X25001883" },
      { label: "Specialty Coffee Association", url: "https://sca.coffee/pricecrisis" },
    ],
  },
  {
    num: 4,
    q: "How much roasting \u201ccraft\u201d is science versus mythology?",
    paras: [
      "It\u2019s actual chemistry masquerading as art. Heat transfers, water evaporates, Maillard reactions create flavor. But 90% of roasting follows the same curve. The difference between 85-point and 90-point coffee isn\u2019t craft\u2014it\u2019s batch consistency.",
      "The mythology? Language like \u201clight floral notes\u201d and \u201cblueberry hints\u201d are real sensory experiences but market-created meanings. What actually makes coffee taste different: the origin. Altitude, soil, fermentation, processing. That\u2019s where flavor complexity lives, not the roaster\u2019s curve.",
      "Origin roasting matters because farmers control the roast profile for their specific bean\u2019s chemistry\u2014not forcing a generic profile onto wildly different beans.",
    ],
    sources: [
      { label: "42 Days Coffee", url: "https://www.42dayscoffee.com/blogs/news/understanding-the-differences-between-specialty-coffee-and-commodity-coffee" },
      { label: "Union Hand-Roasted", url: "https://unionroasted.com/pages/speciality-vs-commodity-coffee" },
    ],
  },
  {
    num: 5,
    q: "Explain the C Market to specialty roasters pretending they\u2019re isolated from it.",
    paras: [
      "The C Market (New York Intercontinental Exchange futures) sets commodity prices. Specialty roasters operate in its shadow whether they admit it or not. When C Market spikes, specialty roasters can\u2019t afford premiums, so they blend lower-grade coffee. This gives mega-buyers leverage to play origins off each other and bid prices down.",
    ],
    highlight: "The C Market doesn\u2019t price specialty coffee\u2014it establishes the baseline anxiety that forces specialty roasters to compromise. Recent volatility? Speculation by commodity traders with zero relation to harvest reality.",
    sources: [
      { label: "Perfect Daily Grind", url: "https://perfectdailygrind.com/2025/07/high-coffee-prices-divide-between-specialty-and-commercial/" },
      { label: "Coffee Intelligence", url: "https://intelligence.coffee/2024/04/specialty-coffee-buyers-and-c-market/" },
    ],
  },
  {
    num: 6,
    q: "Why is specialty coffee collapsing from a cash flow crisis?",
    paras: [
      "There\u2019s a $2.5 trillion global trade finance gap. Smaller roasters are locked out. Larger firms? They absorb the shock and keep buying. Consolidation accelerates. Some roasters are now exploring blockchain-based financing\u2014selling pieces of coffee lots to investors for capital.",
    ],
    data: "Irony: For years, producers struggled to access pre-harvest financing. Now traders and roasters are in the same position.",
    sources: [
      { label: "Coffee Intelligence", url: "https://intelligence.coffee/2025/02/high-coffee-prices-and-cash-flow/" },
    ],
  },
  {
    num: 7,
    q: "Regenerative vs. sustainable\u2014what\u2019s the difference and why should consumers care?",
    paras: [
      "Sustainable = do less harm (defensive). Regenerative = heal (offensive).",
      "A sustainable farm avoids pesticides but the farmer still receives commodity prices and can\u2019t afford soil regeneration. Regenerative means: roasting happens at origin, profit stays at origin, the farmer isn\u2019t selling raw beans\u2014they\u2019re processing and roasting, capturing 40\u201350% more value. They invest in soil regeneration because they can afford to.",
    ],
    highlight: "Sustainability is what brands use to charge premiums. Regeneration actually changes systems.",
  },
  {
    num: 8,
    q: "Concrete example: Quantum Seeds origin roasting vs. Fair Trade economics?",
    paras: [
      "Fair Trade Model: 100kg specialty coffee \u2192 farmer nets $304 after certification fees. Cooperative takes the $0.20 premium for \u201ccommunity development.\u201d",
      "Origin Roasting Model: 100kg roasted at origin \u2192 $1,100 at retail (specialty grade). Farmer captures 40% = $440.",
      "That $130+ extra per bag, multiplied across 10\u201320 bags/year, fundamentally changes farm economics. The farmer becomes a processor and craftsperson controlling the roast profile, competing on quality and storytelling\u2014not price.",
    ],
    data: "This is economic empowerment, not charity.",
    sources: [
      { label: "Coffee Intelligence Pricing Data", url: "https://intelligence.coffee/2024/04/specialty-coffee-buyers-and-c-market/" },
    ],
  },
  {
    num: 9,
    q: "Blockchain in coffee supply chains: real infrastructure or crypto theater?",
    paras: [
      "Blockchain by itself is theater. What matters is what you\u2019re tracking. Blockchain creates immutable records\u2014every transaction, roast profile, quality score gets recorded on-chain. That\u2019s useful for traceability.",
      "Real innovation: tokenizing origin-roasted coffee. Each batch becomes an NFT with the bean\u2019s thermodynamic profile, roast curve, harvest date, cupping score, farmer\u2019s name, village, processing method. Token holders include the farmer and community. When coffee sells, token holders capture value.",
    ],
    highlight: "That\u2019s financial architecture for regeneration\u2014not blockchain on an extractive supply chain.",
    sources: [
      { label: "Tony Greenberg", url: "https://tonygreenberg.com/what-solutions-are-best-built-with-blockchain/" },
    ],
  },
  {
    num: 10,
    q: "One thing a specialty roaster can do immediately to stop being extractive?",
    paras: [
      "Offer pre-harvest financing. Pay farmers now for harvest 6\u20138 months ahead\u2014at full price, not as a discount. Farmers typically need cash 6\u20138 months before harvest but take loans at 20\u201340% interest. Offer pre-financing at fair prices and eliminate that debt trap.",
      "You secure supply at predictable prices. Farmers aren\u2019t desperate. They can invest in soil health, not extraction. You can market this transparently: \u201cThis coffee is pre-financed directly to the farmer at $X. No middlemen. No speculation.\u201d",
      "Will it cut margins 5\u201310%? Yes. But margins built on farmer desperation aren\u2019t sustainable.",
    ],
    highlight: "That single change\u2014pre-harvest financing\u2014proves you\u2019re serious about regeneration, not marketing it.",
    sources: [
      { label: "Fair World Project", url: "https://fairworldproject.org/low-prices-and-exploitation-recurring-themes-in-coffee/" },
    ],
  },
];

/* ── Sub-components ── */
const QABlock = ({ qa, isOpen, toggle }: { qa: QA; isOpen: boolean; toggle: () => void }) => (
  <div style={{ background: C.white, borderRadius: 8, marginBottom: 20, borderTop: `4px solid ${C.gold}`, boxShadow: "0 2px 10px rgba(0,0,0,.05)", overflow: "hidden" }}>
    <button
      onClick={toggle}
      style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 16, padding: "24px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
    >
      <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: C.rust, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.m, fontSize: 14, fontWeight: 700 }}>
        {qa.num}
      </span>
      <span style={{ fontFamily: F.d, fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 600, color: C.soil, lineHeight: 1.4, flex: 1 }}>
        {qa.q}
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .25s" }}><path d="M4 6l4 4 4-4" stroke={C.smoke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    {isOpen && (
      <div style={{ padding: "0 28px 28px", paddingLeft: 80 }}>
        {qa.paras.map((p, i) => (
          <p key={i} style={{ fontFamily: F.b, fontSize: 16, lineHeight: 1.75, color: C.bark, margin: "0 0 14px" }}>{p}</p>
        ))}
        {qa.highlight && (
          <p style={{ fontFamily: F.b, fontSize: 16, lineHeight: 1.75, color: C.rust, fontWeight: 600, margin: "14px 0" }}>{qa.highlight}</p>
        )}
        {qa.data && (
          <div style={{ background: "#f9f1e6", borderLeft: `3px solid ${C.gold}`, padding: "12px 16px", margin: "14px 0", fontFamily: F.b, fontSize: 14, fontWeight: 500, color: C.dMoss, borderRadius: 4 }}>
            {qa.data}
          </div>
        )}
        {qa.sources && qa.sources.length > 0 && (
          <div style={{ background: "#f5f1e8", borderLeft: `3px solid ${C.rust}`, padding: "12px 16px", marginTop: 16, borderRadius: 4 }}>
            <strong style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 2, color: C.rust, display: "block", marginBottom: 6 }}>SOURCES</strong>
            {qa.sources.map((s, i) => (
              <div key={i} style={{ fontFamily: F.b, fontSize: 13, margin: "4px 0", paddingLeft: 16, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: C.rust, fontWeight: 700 }}>→</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.dMoss, textDecoration: "none" }}>{s.label}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

/* ── Main ── */
export default function GuestShanitaNicholas() {
  const [openQs, setOpenQs] = useState<Set<number>>(new Set([1]));
  const toggle = (n: number) => setOpenQs(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s; });
  const allOpen = openQs.size === QAS.length;
  const toggleAll = () => setOpenQs(allOpen ? new Set() : new Set(QAS.map(q => q.num)));

  return (
    <BrewSoulLayout>
      <SEO
        title="Shanita Nicholas Breaks the Coffee Industry's Comfortable Lies"
        description="Fair Trade theater, roasting mythology, the C Market trap, and origin-roasting as structural fix. A Tony G Guest Series interview."
        path="/brewsoul/guest/shanita-nicholas"
        image={PROFILE.img}
        type="article"
        publishDate="2026-02-26"
        author="Tony Greenberg"
        category="Tony G Guest Series"
        indexable={true}
      />
      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.soil} 0%, ${C.dMoss} 100%)`, padding: "clamp(48px,8vw,80px) 24px 48px", textAlign: "center", borderBottom: `3px solid ${C.rust}` }}>
        <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 4, color: C.gold, marginBottom: 16 }}>TONY G GUEST SERIES</div>
        <h1 style={{ fontFamily: F.d, fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, color: C.cream, lineHeight: 1.15, margin: "0 auto 16px", maxWidth: 800, fontStyle: "italic" }}>
          Shanita Nicholas Breaks the Coffee Industry's Comfortable Lies
        </h1>
        <p style={{ fontFamily: F.b, fontSize: "clamp(14px,2vw,18px)", color: "rgba(245,239,224,.8)", maxWidth: 640, margin: "0 auto 16px" }}>
          A journalistic interrogation of fair trade theater, roasting deception, and what regeneration actually costs
        </p>
      </section>

      {/* ── Editorial Intro: Why Shanita ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.cream} 0%, #f9f1e6 100%)`, borderLeft: `4px solid ${C.rust}`, borderRadius: 8, padding: "clamp(24px,4vw,36px)", marginBottom: 40 }}>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(18px,3vw,24px)", color: C.rust, margin: "0 0 16px", fontStyle: "italic" }}>Why We're Profiling Shanita Nicholas</h2>
          <p style={{ fontFamily: F.b, fontSize: 16, lineHeight: 1.8, color: C.bark, margin: "0 0 14px" }}>
            The coffee industry has plenty of storytellers. It has very few truth-tellers. Shanita Nicholas is one of the rare people who holds degrees from Columbia in both chemical engineering and law, co-founded a nationally recognized Black women-owned specialty brand (Sip & Sonder), earned her Q Grader certification, and then walked away from the comfortable narrative to ask the question nobody in specialty coffee wants to answer: <em>Why are the people who grow this still broke?</em>
          </p>
          <p style={{ fontFamily: F.b, fontSize: 16, lineHeight: 1.8, color: C.bark, margin: "0 0 14px" }}>
            She is one of the heartbeats of the coffee industry because she operates at the intersection where science, justice, and commerce collide. Through Quantum Seeds, she's building origin-roasting infrastructure that moves manufacturing profit back to producing countries—not as charity, but as economic architecture. She doesn't just critique the system. She's building the replacement.
          </p>
          <p style={{ fontFamily: F.b, fontSize: 16, lineHeight: 1.8, color: C.bark, margin: 0 }}>
            This interview is uncomfortable by design. If you buy specialty coffee and believe the story on the bag, you need to read this.
          </p>
        </div>
      </section>

      {/* ── Profile Card ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 0" }}>
      <div style={{ background: C.white, borderRadius: 8, boxShadow: "0 4px 15px rgba(0,0,0,.08)", padding: "clamp(24px,4vw,40px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" as const, gap: 20, marginBottom: 40 }}>
          <img
            src={PROFILE.img}
            alt={PROFILE.name}
            style={{ width: 140, height: 140, borderRadius: 8, objectFit: "cover", boxShadow: `0 4px 12px rgba(139,69,19,.2)` }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ fontFamily: F.d, fontSize: 22, color: C.rust, margin: "0 0 10px" }}>{PROFILE.name}</h2>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.smoke, margin: "6px 0", lineHeight: 1.5 }}><strong>Title:</strong> {PROFILE.title}</p>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.smoke, margin: "6px 0", lineHeight: 1.5 }}><strong>Background:</strong> {PROFILE.bg}</p>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.smoke, margin: "6px 0", lineHeight: 1.5 }}><strong>Impact:</strong> {PROFILE.impact}</p>
          </div>
        </div>

        {/* ── Expand/Collapse All ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={toggleAll}
            style={{ fontFamily: F.m, fontSize: 12, letterSpacing: 1, color: C.rust, background: "none", border: `1px solid ${C.rust}`, borderRadius: 4, padding: "6px 14px", cursor: "pointer" }}
          >
            {allOpen ? "COLLAPSE ALL" : "EXPAND ALL 10"}
          </button>
        </div>

        {/* ── Q&A Blocks ── */}
        {QAS.map(qa => (
          <QABlock key={qa.num} qa={qa} isOpen={openQs.has(qa.num)} toggle={() => toggle(qa.num)} />
        ))}

        {/* ── Series Footer ── */}
        <div style={{ background: C.white, borderTop: `3px solid ${C.rust}`, padding: "32px 28px", textAlign: "center", borderRadius: 8, marginTop: 48, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <h3 style={{ fontFamily: F.d, fontSize: 20, color: C.rust, margin: "0 0 12px", fontStyle: "italic" }}>Tony G Guest Series</h3>
          <p style={{ fontFamily: F.b, fontSize: 14, color: C.smoke, maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.6 }}>
            Journalistic interrogation of industry systems. Each month: a different thought leader examining what regeneration actually requires. Coffee. Sake. Mezcal. Tequila. Same format. Same rigor. Zero marketing.
          </p>
          <p style={{ fontFamily: F.m, fontSize: 11, color: "#999" }}>All sources verified & linked. All pricing in USD.</p>
        </div>
      </section>

      {/* ── Share ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 0", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { label: "Share on X", icon: "𝕏", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent("Shanita Nicholas breaks the coffee industry's comfortable lies \u2014 Tony G Guest Series")}` + `&url=${encodeURIComponent(typeof window !== "undefined" ? "https://tonygreenberg.com/brewsoul/guest/shanita-nicholas" : "")}` },
          { label: "Share on LinkedIn", icon: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? "https://tonygreenberg.com/brewsoul/guest/shanita-nicholas" : "")}` },
          { label: "Copy Link", icon: "🔗", href: "#" },
        ].map(s => (
          <a key={s.label} href={s.href} target={s.href === "#" ? undefined : "_blank"} rel="noopener noreferrer"
            onClick={s.href === "#" ? (e) => { e.preventDefault(); navigator.clipboard.writeText("https://tonygreenberg.com/brewsoul/guest/shanita-nicholas"); (e.currentTarget as HTMLElement).textContent = "\u2713 Copied!"; setTimeout(() => { (e.currentTarget as HTMLElement).textContent = `${s.icon} ${s.label}`; }, 2000); } : undefined}
            style={{ fontFamily: F.m, fontSize: 12, letterSpacing: 1, padding: "8px 16px", border: `1px solid ${C.gold}44`, borderRadius: 6, color: C.bark, textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f5f1e8")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >{s.icon} {s.label}</a>
        ))}
      </div>

      {/* ── Next Steps ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 48px" }}>
        <NextSteps
          steps={[
            { label: "Biodynamic Census", path: "/brewsoul/biodynamic", description: "Every certified farm and roaster" },
            { label: "Decaf Done Right", path: "/brewsoul/decaf", description: "Clean process, clean brands" },
            { label: "Coffee Economics", path: "/brewsoul/economics", description: "Where your dollar actually goes" },
            { label: "All BrewSoul Pages", path: "/brewsoul/directory", description: "Complete intelligence index" },
          ]}
        />
      </div>
    </BrewSoulLayout>
  );
}
