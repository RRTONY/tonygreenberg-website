"use client";

import { useState } from "react";

interface QA {
  num: number;
  q: string;
  paras: string[];
  highlight?: string;
  data?: string;
  sources?: { label: string; url: string }[];
}

// Ported from legacy client/src/pages/brewsoul/GuestShanitaNicholas.tsx
// — the real 10-question interview (real substantive answers, real
// citations), unchanged. Per-question expand/collapse + "Expand/Collapse
// All" extracted into this client island.
const QAS: QA[] = [
  {
    num: 1,
    q: "If Fair Trade worked since 1988, why are farmers still broke?",
    paras: [
      "Because Fair Trade was designed to make consumers feel better, not make farmers wealthy. Farmers pay $0.03/lb just to be eligible. Of the $0.30 premium paid, only $0.03 reaches individual growers—the rest funds cooperative administration. Research found less than 12% of Fair Trade premiums actually reached farmers.",
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
    q: "What made you leave law to expose coffee's supply chain as rigged?",
    paras: [
      "I was drafting supply chain contracts—I understood leverage. Farmers are 12 layers removed from roasters. Zero bargaining power. Payment terms demand 180–270 days to pay, forcing farmers into predatory loans. Fair Trade just prettified the same extractive structure.",
      "I realized: the system doesn't just underpay farmers—it extracts financially, contractually, informationally. That's why I built Quantum Seeds: roasting happens at origin, farmers control the roast profile, the supply chain is transparent because it's short.",
    ],
    sources: [
      { label: "Fair World Project", url: "https://fairworldproject.org/low-prices-and-exploitation-recurring-themes-in-coffee/" },
      { label: "Coffee Intelligence", url: "https://intelligence.coffee/2025/02/high-coffee-prices-and-cash-flow/" },
    ],
  },
  {
    num: 3,
    q: "Producing countries earned 38% of retail coffee revenue in 1940. By 2017, it's 10%. How did that happen?",
    paras: [
      "Industry consolidation. Mega-buyers (Nestlé, JDE Peet's, Starbucks) used scale as a weapon. They demand lower prices from exporters, who demand lower prices from farmers. Consolidation cascades as price pressure down the chain.",
    ],
    data: "By 2017: Producing countries captured less than 10% of the $200B global coffee industry revenue, despite growing 95% of the world's coffee.",
    sources: [
      { label: "Science Direct", url: "https://www.sciencedirect.com/science/article/abs/pii/S0305750X25001883" },
      { label: "Specialty Coffee Association", url: "https://sca.coffee/pricecrisis" },
    ],
  },
  {
    num: 4,
    q: "How much roasting “craft” is science versus mythology?",
    paras: [
      "It's actual chemistry masquerading as art. Heat transfers, water evaporates, Maillard reactions create flavor. But 90% of roasting follows the same curve. The difference between 85-point and 90-point coffee isn't craft—it's batch consistency.",
      "The mythology? Language like “light floral notes” and “blueberry hints” are real sensory experiences but market-created meanings. What actually makes coffee taste different: the origin. Altitude, soil, fermentation, processing. That's where flavor complexity lives, not the roaster's curve.",
      "Origin roasting matters because farmers control the roast profile for their specific bean's chemistry—not forcing a generic profile onto wildly different beans.",
    ],
    sources: [
      { label: "42 Days Coffee", url: "https://www.42dayscoffee.com/blogs/news/understanding-the-differences-between-specialty-coffee-and-commodity-coffee" },
      { label: "Union Hand-Roasted", url: "https://unionroasted.com/pages/speciality-vs-commodity-coffee" },
    ],
  },
  {
    num: 5,
    q: "Explain the C Market to specialty roasters pretending they're isolated from it.",
    paras: [
      "The C Market (New York Intercontinental Exchange futures) sets commodity prices. Specialty roasters operate in its shadow whether they admit it or not. When C Market spikes, specialty roasters can't afford premiums, so they blend lower-grade coffee. This gives mega-buyers leverage to play origins off each other and bid prices down.",
    ],
    highlight: "The C Market doesn't price specialty coffee—it establishes the baseline anxiety that forces specialty roasters to compromise. Recent volatility? Speculation by commodity traders with zero relation to harvest reality.",
    sources: [
      { label: "Perfect Daily Grind", url: "https://perfectdailygrind.com/2025/07/high-coffee-prices-divide-between-specialty-and-commercial/" },
      { label: "Coffee Intelligence", url: "https://intelligence.coffee/2024/04/specialty-coffee-buyers-and-c-market/" },
    ],
  },
  {
    num: 6,
    q: "Why is specialty coffee collapsing from a cash flow crisis?",
    paras: [
      "There's a $2.5 trillion global trade finance gap. Smaller roasters are locked out. Larger firms? They absorb the shock and keep buying. Consolidation accelerates. Some roasters are now exploring blockchain-based financing—selling pieces of coffee lots to investors for capital.",
    ],
    data: "Irony: For years, producers struggled to access pre-harvest financing. Now traders and roasters are in the same position.",
    sources: [{ label: "Coffee Intelligence", url: "https://intelligence.coffee/2025/02/high-coffee-prices-and-cash-flow/" }],
  },
  {
    num: 7,
    q: "Regenerative vs. sustainable—what's the difference and why should consumers care?",
    paras: [
      "Sustainable = do less harm (defensive). Regenerative = heal (offensive).",
      "A sustainable farm avoids pesticides but the farmer still receives commodity prices and can't afford soil regeneration. Regenerative means: roasting happens at origin, profit stays at origin, the farmer isn't selling raw beans—they're processing and roasting, capturing 40–50% more value. They invest in soil regeneration because they can afford to.",
    ],
    highlight: "Sustainability is what brands use to charge premiums. Regeneration actually changes systems.",
  },
  {
    num: 8,
    q: "Concrete example: Quantum Seeds origin roasting vs. Fair Trade economics?",
    paras: [
      "Fair Trade Model: 100kg specialty coffee → farmer nets $304 after certification fees. Cooperative takes the $0.20 premium for “community development.”",
      "Origin Roasting Model: 100kg roasted at origin → $1,100 at retail (specialty grade). Farmer captures 40% = $440.",
      "That $130+ extra per bag, multiplied across 10–20 bags/year, fundamentally changes farm economics. The farmer becomes a processor and craftsperson controlling the roast profile, competing on quality and storytelling—not price.",
    ],
    data: "This is economic empowerment, not charity.",
    sources: [{ label: "Coffee Intelligence Pricing Data", url: "https://intelligence.coffee/2024/04/specialty-coffee-buyers-and-c-market/" }],
  },
  {
    num: 9,
    q: "Blockchain in coffee supply chains: real infrastructure or crypto theater?",
    paras: [
      "Blockchain by itself is theater. What matters is what you're tracking. Blockchain creates immutable records—every transaction, roast profile, quality score gets recorded on-chain. That's useful for traceability.",
      "Real innovation: tokenizing origin-roasted coffee. Each batch becomes an NFT with the bean's thermodynamic profile, roast curve, harvest date, cupping score, farmer's name, village, processing method. Token holders include the farmer and community. When coffee sells, token holders capture value.",
    ],
    highlight: "That's financial architecture for regeneration—not blockchain on an extractive supply chain.",
    sources: [{ label: "Tony Greenberg", url: "https://tonygreenberg.com/what-solutions-are-best-built-with-blockchain/" }],
  },
  {
    num: 10,
    q: "One thing a specialty roaster can do immediately to stop being extractive?",
    paras: [
      "Offer pre-harvest financing. Pay farmers now for harvest 6–8 months ahead—at full price, not as a discount. Farmers typically need cash 6–8 months before harvest but take loans at 20–40% interest. Offer pre-financing at fair prices and eliminate that debt trap.",
      "You secure supply at predictable prices. Farmers aren't desperate. They can invest in soil health, not extraction. You can market this transparently: “This coffee is pre-financed directly to the farmer at $X. No middlemen. No speculation.”",
      "Will it cut margins 5–10%? Yes. But margins built on farmer desperation aren't sustainable.",
    ],
    highlight: "That single change—pre-harvest financing—proves you're serious about regeneration, not marketing it.",
    sources: [{ label: "Fair World Project", url: "https://fairworldproject.org/low-prices-and-exploitation-recurring-themes-in-coffee/" }],
  },
];

function QABlock({ qa, isOpen, toggle }: { qa: QA; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="mb-5 overflow-hidden rounded-lg border-t-4 border-t-[#D4AF37] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <button onClick={toggle} className="flex w-full items-start gap-4 px-7 py-6 text-left">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#8b4c2a] font-mono text-sm font-bold text-white">{qa.num}</span>
        <span className="flex-1 font-heading text-[clamp(16px,2.5vw,20px)] leading-snug font-semibold text-[#1a0e08]">{qa.q}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`mt-1.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <path d="M4 6l4 4 4-4" stroke="#6b5a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-7 pb-7 pl-20">
          {qa.paras.map((p) => (
            <p key={p} className="mb-3.5 text-base leading-[1.75] text-[#2d1810]">
              {p}
            </p>
          ))}
          {qa.highlight && <p className="my-3.5 text-base leading-[1.75] font-semibold text-[#8b4c2a]">{qa.highlight}</p>}
          {qa.data && <div className="my-3.5 rounded-sm border-l-3 border-l-[#D4AF37] bg-[#f9f1e6] px-4 py-3 text-sm font-medium text-[#2d3a24]">{qa.data}</div>}
          {qa.sources && qa.sources.length > 0 && (
            <div className="mt-4 rounded-sm border-l-3 border-l-[#8b4c2a] bg-[#f5f1e8] px-4 py-3">
              <strong className="mb-1.5 block font-mono text-[11px] tracking-[0.1em] text-[#8b4c2a]">Sources</strong>
              {qa.sources.map((s) => (
                <div key={s.url} className="relative my-1 pl-4 text-[13px]">
                  <span className="absolute left-0 font-bold text-[#8b4c2a]">→</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#2d3a24]">
                    {s.label}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ShanitaInterview() {
  const [openQs, setOpenQs] = useState<Set<number>>(new Set([1]));
  const toggle = (n: number) =>
    setOpenQs((prev) => {
      const s = new Set(prev);
      if (s.has(n)) s.delete(n);
      else s.add(n);
      return s;
    });
  const allOpen = openQs.size === QAS.length;
  const toggleAll = () => setOpenQs(allOpen ? new Set() : new Set(QAS.map((q) => q.num)));

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button onClick={toggleAll} className="rounded-sm border border-[#8b4c2a] px-3.5 py-1.5 font-mono text-xs tracking-wide text-[#8b4c2a]">
          {allOpen ? "Collapse All" : "Expand All 10"}
        </button>
      </div>

      {QAS.map((qa) => (
        <QABlock key={qa.num} qa={qa} isOpen={openQs.has(qa.num)} toggle={() => toggle(qa.num)} />
      ))}
    </>
  );
}

export function ShareRow() {
  const [copied, setCopied] = useState(false);
  const url = "https://tonygreenberg.com/brewsoul/guest/shanita-nicholas";
  const text = "Shanita Nicholas breaks the coffee industry's comfortable lies — Tony G Guest Series";

  return (
    <div className="mx-auto flex max-w-200 flex-wrap justify-center gap-3 px-6 pt-6">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-[#D4AF37]/25 px-4 py-2 font-mono text-xs tracking-wide text-[#2d1810]"
      >
        𝕏 Share on X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-[#D4AF37]/25 px-4 py-2 font-mono text-xs tracking-wide text-[#2d1810]"
      >
        in Share on LinkedIn
      </a>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="rounded-md border border-[#D4AF37]/25 px-4 py-2 font-mono text-xs tracking-wide text-[#2d1810]"
      >
        {copied ? "✓ Copied!" : "🔗 Copy Link"}
      </button>
    </div>
  );
}
