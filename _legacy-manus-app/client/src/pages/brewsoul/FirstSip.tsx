/**
 * THE FIRST SIP IS A VOTE — Coffee Manifesto & Journey Hub
 *
 * Uses the existing BrewSoul visual language:
 * - Parchment gradient backgrounds (#FAFAF7 → #F0E8D8 → #E8DCC8)
 * - Glass-morphism cards with backdrop-blur
 * - Gold accents (#8B6914, #C5A23C)
 * - Playfair Display / Source Sans 3 / DM Mono typography
 * - BrewSoul hero image for cinematic depth
 * - NO solid black backgrounds
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";

const HERO_IMG = "/api/img/brewsoul-orig_84eb4bc9.jpg";

/* ── Floating coffee dust particles ── */
function CoffeeDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2); };
    resize();
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const ps: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 30; i++) ps.push({ x: Math.random() * W(), y: Math.random() * H(), vx: (Math.random() - 0.5) * 0.2, vy: -Math.random() * 0.25 - 0.03, r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.4 + 0.1 });
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H() + 5; p.x = Math.random() * W(); }
        if (p.x < -5 || p.x > W() + 5) p.x = Math.random() * W();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197,162,60,${p.a})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ── Typography shortcuts ── */
const P = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const S = { fontFamily: "'Source Sans 3', sans-serif" } as const;
const M = { fontFamily: "'DM Mono', monospace" } as const;

/* ── Journey tool cards data ── */
const TOOLS = [
  { num: "01", icon: "💊", title: "Coffee Prescription", desc: "AI-powered, personalized recommendations based on your biology, sensitivity, habits, and goals. Start here if you want to know what coffee should be doing for you — and what it shouldn't.", cta: "Personalized analysis", path: "/brewsoul/prescription" },
  { num: "02", icon: "🔬", title: "Coffee & Health", desc: "Peer-reviewed research on caffeine metabolism, cortisol, sleep architecture, mycotoxin risk, and long-term health outcomes. The science behind the ritual.", cta: "Research library", path: "/brewsoul/health" },
  { num: "03", icon: "🍰", title: "Coffee Pairings", desc: "How food changes coffee's impact on your body and palate. Absorption rates, acidity interactions, nutrient synergies — where food meets pharmacology.", cta: "Pairing guide", path: "/brewsoul/pairings" },
  { num: "04", icon: "📉", title: "Coffee Economics", desc: "Where your dollar actually goes. Farmgate-to-shelf breakdowns, margin analysis, ad-spend-to-origin ratios, and the structural math the label never shows you.", cta: "Value chain breakdown", path: "/brewsoul/economics" },
  { num: "05", icon: "⚖️", title: "Compare Coffees", desc: "Side-by-side brand comparisons on sourcing transparency, certification rigor, pricing structure, contaminant testing, and value-to-farmer ratios. The Consumer Reports of coffee — without the ad revenue bias.", cta: "Head-to-head comparison engine", path: "/brewsoul/compare", full: true },
];

/* ── Related essays ── */
const RELATED = [
  { title: "The Butcher's Daughter, the Carbon Toll, and the Cheese That Ate the Planet", slug: "/blog/the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", tag: "Crusade" },
  { title: "Restaurants Beware of Vegans and Vegans Beware of Lying Restaurants", slug: "/blog/restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", tag: "Crusade" },
  { title: "How to Alienate a Loyal Vegan Desperately Trying to Buy Your Product", slug: "/blog/how-to-alienate-a-loyal-vegan", tag: "Crusade" },
  { title: "Forever Chemicals in My Blood: What I Learned Testing for PFAS and Microplastics", slug: "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics", tag: "Field Report" },
  { title: "Return on Investment — Are You Going Green?", slug: "/blog/return-on-investment-going-green-going-green-2", tag: "Systems Map" },
  { title: '"Boiling the Human" — H+ Summit / Harvard-Kurzweil', slug: "/blog/boiling-the-human-summit-harvard-kurzweil", tag: "Reckoning" },
];

/* ── Couplets ── */
const COUPLETS = [
  { a: "Profit is not bad.", b: "Hidden profit is corrosive." },
  { a: "Distribution is necessary.", b: "Ethical distribution is transformative." },
  { a: "Advertising is not evil.", b: "But if the ad budget outruns the origin premium, your dollar walked down the wrong branch." },
];

/* ── Disclosure demands ── */
const DEMANDS = [
  "Harvest date", "Farmgate price paid", "Export price", "Premium above commodity reference",
  "% of retail retained in origin country", "Moisture control protocols", "Third-party quality verification", "Contaminant testing approach",
];

export default function FirstSip() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribeMutation = trpc.subscribe.add.useMutation({
    onSuccess: () => setSubscribed(true),
  });
  const handleSubscribe = () => {
    if (!email || subscribed) return;
    subscribeMutation.mutate({ email, source: "first-sip" });
  };
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Mark visited for JourneyBar
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("brewsoul-visited-first-sip", "1");
  }, []);

  return (
    <>
    <SEO
        title="First Sip — BrewSoul"
        description="Your first cup with BrewSoul: a guided introduction to specialty coffee."
        path="/brewsoul/first-sip"
        keywords="Tony Greenberg, first sip, specialty coffee introduction, BrewSoul"
        indexable={true}
      />
      <BrewSoulLayout>
      {/* ═══════════ HERO ═══════════ */}
      <section style={{
        position: "relative", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Cinematic background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover", backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.15}px)`,
          filter: "brightness(0.35) saturate(1.2)",
        }} />
        {/* Warm overlay instead of solid black */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(44,24,16,0.6) 0%, rgba(44,24,16,0.75) 50%, rgba(250,250,247,0.95) 100%)",
        }} />
        <CoffeeDust />
        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "680px", padding: "0 1.5rem" }}>
          <div style={{ ...M, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4B96A", marginBottom: "1rem" }}>
            Your Start Page for Coffee
          </div>
          <h1 style={{
            ...P, fontSize: "clamp(2.4rem, 7vw, 4.2rem)", fontWeight: 900,
            color: "#F5F0E6", lineHeight: 1.05, marginBottom: "1.25rem",
          }}>
            The First Sip<br />Is a <em style={{ fontStyle: "italic", color: "#D4B96A" }}>Vote</em>
          </h1>
          <p style={{
            ...S, fontSize: "clamp(1rem, 2.5vw, 1.15rem)", fontWeight: 300,
            color: "rgba(245,240,230,0.85)", lineHeight: 1.65, maxWidth: "560px", margin: "0 auto 1.5rem",
          }}>
            A manifesto on coffee, capital, and consciousness — and your guided entry point into the tools, economics, health science, and comparisons that live inside this site.
          </p>
          <div style={{ ...M, fontSize: "0.75rem", color: "rgba(212,185,106,0.7)", letterSpacing: "0.05em" }}>
            By Tony Greenberg <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>·</span> Only Time Buys Trust
          </div>
        </div>
      </section>

      {/* ═══════════ ARTICLE BODY ═══════════ */}
      <section style={{
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 30%, #E8DCC8 60%, #F5F0E6 100%)",
        padding: "4rem 1.5rem",
      }}>
        <article style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* Opening paragraphs */}
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            There are revolutions that start with marches in the streets. And there are revolutions that begin in kitchens — in the quiet moment when a hand reaches for a cup.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Before markets open. Before the news scroll begins. Before anyone decides what to be outraged about today.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem", fontWeight: 600 }}>
            Two billion people perform the same ritual. They lift a cup.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Coffee is the most universal ceremony of modern civilization. Presidents drink it. Artists drink it. Entrepreneurs drink it. Bus drivers drink it. Entire economies lean on it. And yet it remains astonishingly misunderstood — especially by the people who consume it every day.
          </p>

          {/* ── The Arithmetic Behind the Label ── */}
          <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "1rem", borderBottom: "2px solid rgba(197,162,60,0.3)", paddingBottom: "0.5rem" }}>
            The Arithmetic Behind the Label
          </h2>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Coffee is a $100-plus-billion global industry. Roughly 170 to 180 million 60-kilogram bags of beans are produced annually. Millions of smallholder farmers depend on it for survival. Entire national identities are intertwined with it.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            And still, most consumers know only the poetry on the label — never the arithmetic behind the price. If you want to see that arithmetic laid bare, the{" "}
            <Link href="/brewsoul/economics" style={{ color: "#8B6914", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>Coffee Economics</Link>{" "}
            tool on this site breaks down exactly where your dollar goes — farmgate to shelf — for every brand we've analyzed.
          </p>

          {/* Pullquote */}
          <div style={{
            margin: "2rem 0", padding: "1.5rem 2rem",
            borderLeft: "3px solid #C5A23C",
            background: "rgba(197,162,60,0.06)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ ...P, fontSize: "1.15rem", fontWeight: 600, fontStyle: "italic", color: "#5A4A20", lineHeight: 1.5, margin: 0 }}>
              The system captures value closest to the cup and pushes risk and volatility closest to the soil.
            </p>
          </div>

          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            In past commodity crises, producing countries' share of final retail value has been documented at single digits — sometimes below ten percent. Less than ten cents of every dollar you spend ends up with the people who grew the beans. The rest flows into roasting, marketing, branding, rent, equipment, and giant advertising budgets.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            No one actor is malicious. But the structure is asymmetrical. A $7 latte in Los Angeles may contain well under a dollar's worth of green coffee. That is not a conspiracy — it is a system, and the system was knowingly designed that way.
          </p>

          {/* ── Voices from the Soil ── */}
          <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "1rem", borderBottom: "2px solid rgba(197,162,60,0.3)", paddingBottom: "0.5rem" }}>
            Voices from the Soil
          </h2>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Tadesse Meskela spent decades on the ground with farmers in Ethiopia, organizing cooperatives and fighting for fairer prices. He helped build unions that returned millions of dollars directly to farming communities — funding schools, water systems, and clinics. His work proved something fundamental: when farmers get fairer shares, everyone benefits.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            But farming is still hard. Reports from rural supply chains in Uganda and Rwanda show that more than a third of coffee growers reported no profit for the previous season. Nearly half had no savings to handle emergencies. Financial vulnerability is not an abstract number — it is a lived reality for families whose work fuels your morning brew.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            And climate change is tightening the vise. Arabica thrives in a narrow range of temperatures and rainfall. When those patterns shift, farmers are forced into expensive irrigation or lose harvests entirely — while the global price system bounces around benchmarks that have little to do with the true cost of living, planting, and harvesting.
          </p>

          {/* ── The Language Problem ── */}
          <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "1rem", borderBottom: "2px solid rgba(197,162,60,0.3)", paddingBottom: "0.5rem" }}>
            The Language Problem
          </h2>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Most stories on Instagram and marketing pages speak in flavors and adjectives — notes of jasmine, dark chocolate, "ethical sourcing," "direct trade," "regenerative." These words are seductive. They make us feel good.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            But most of them are unregulated branding terms. "Direct trade" sounds righteous. It often is. But it lacks an independent certification framework, so its meaning varies from producer to producer, roaster to roaster. Even established certification systems like Fair Trade and Rainforest Alliance are not magic. They provide stability and price floors, but they often fail to capture the full economic reality for farmers — and sometimes pay premiums that never fully reach the farm.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            This is where the{" "}
            <Link href="/brewsoul/compare" style={{ color: "#8B6914", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>Compare Coffees</Link>{" "}
            tool earns its place. It puts brands side by side not on flavor poetry, but on sourcing transparency, pricing structure, and certification rigor — the data behind the label.
          </p>

          {/* Pullquote */}
          <div style={{
            margin: "2rem 0", padding: "1.5rem 2rem",
            borderLeft: "3px solid #C5A23C",
            background: "rgba(197,162,60,0.06)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ ...P, fontSize: "1.15rem", fontWeight: 600, fontStyle: "italic", color: "#5A4A20", lineHeight: 1.5, margin: 0 }}>
              Good intentions collide with structural complexity. It does not mean coffee is evil. It means coffee deserves deeper respect — which includes real transparency.
            </p>
          </div>

          {/* ── The Conversation Inside Your Body ── */}
          <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "1rem", borderBottom: "2px solid rgba(197,162,60,0.3)", paddingBottom: "0.5rem" }}>
            The Conversation Inside Your Body
          </h2>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Caffeine is one of the most widely consumed psychoactive compounds on Earth. It blocks adenosine receptors, delays fatigue, sharpens focus, and for many people, awakens mood and productivity. Epidemiological research often shows neutral or even positive associations with moderate consumption — reduced risk of certain diseases, improved cognitive outcomes in long-term cohorts.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            But it also elevates cortisol, disrupts sleep architecture, increases heart rate, and raises anxiety in susceptible individuals. The "morning fog" we treat with caffeine is often the residue of yesterday's dependency.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Dave Asprey argues the real problem is not coffee itself but the quality of what's in the cup — pointing to mold exposure, poor storage, and mycotoxins. Critics say the risk levels vary and can be overstated. Both sides agree: transparency and quality control matter. Without them, consumers are drinking poetry without seeing the spreadsheet.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            That's what the{" "}
            <Link href="/brewsoul/health" style={{ color: "#8B6914", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>Coffee &amp; Health</Link>{" "}
            section is built for — peer-reviewed research on caffeine metabolism, cortisol impact, sleep disruption, and real contaminant risks, organized so you can decide based on your biology, not someone's branding budget. And if you want a personalized read on how coffee interacts with your body and habits, the{" "}
            <Link href="/brewsoul/prescription" style={{ color: "#8B6914", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>Coffee Prescription</Link>{" "}
            tool will walk you through it.
          </p>

          {/* ── Why This Exists ── */}
          <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "1rem", borderBottom: "2px solid rgba(197,162,60,0.3)", paddingBottom: "0.5rem" }}>
            Why This Exists
          </h2>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            We are not here to abolish coffee. We are here to outgrow extractive capitalism — starting with the first sip of the day.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2rem" }}>
            If you pay $22 or $25 for a bag, then "extraordinary" must mean something measurable — not just a pretty word on a label. If the majority of your money funds Instagram ads rather than farm resilience, you are not drinking craft — you are subsidizing artistry without accountability.
          </p>

          {/* Couplets */}
          <div style={{ margin: "2rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {COUPLETS.map((c, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", gap: "0.25rem",
                padding: "1rem 1.5rem", borderRadius: "8px",
                background: "rgba(250,250,247,0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(197,162,60,0.15)",
              }}>
                <span style={{ ...S, fontSize: "1rem", fontWeight: 600, color: "#2C1810" }}>{c.a}</span>
                <span style={{ ...S, fontSize: "1rem", fontWeight: 400, fontStyle: "italic", color: "#6B5B4F" }}>{c.b}</span>
              </div>
            ))}
          </div>

          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2rem" }}>
            Coffee can be the most regenerative daily transaction on Earth — if we make it so. Two billion daily sips. Two billion opportunities to choose transparency over mystique. Two billion chances to reward soil health, fair pricing, and supply chain integrity.
          </p>

          {/* Disclosure demands */}
          <div style={{
            margin: "2rem 0", padding: "1.5rem 2rem",
            background: "rgba(250,250,247,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(197,162,60,0.2)",
            borderRadius: "10px",
          }}>
            <h3 style={{ ...M, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "1rem" }}>
              What Every Bag Should Disclose
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
              {DEMANDS.map(d => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#C5A23C", fontSize: "0.85rem" }}>→</span>
                  <span style={{ ...S, fontSize: "0.92rem", color: "#2C1810" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            This is not purity cultism. It is visibility. Because opaque systems favor extraction. Transparent systems favor regeneration.
          </p>

          {/* ── Alignment, Not Abstinence ── */}
          <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "1rem", borderBottom: "2px solid rgba(197,162,60,0.3)", paddingBottom: "0.5rem" }}>
            Alignment, Not Abstinence
          </h2>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            If coffee supports you, use it intentionally. If it disrupts your sleep or nervous system, respect that too. And if you want to understand how what you eat alongside coffee changes the experience entirely — absorption, acidity, nutrient interaction — the{" "}
            <Link href="/brewsoul/pairings" style={{ color: "#8B6914", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>Coffee Pairings</Link>{" "}
            guide is where food meets pharmacology.
          </p>
          <p style={{ ...S, fontSize: "1.05rem", color: "#2C1810", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            This is not a manifesto about abstinence or indulgence. This is about alignment — between your spend and fairness, between your biology and choice, between story and spreadsheet.
          </p>

          {/* Pullquote */}
          <div style={{
            margin: "2rem 0", padding: "1.5rem 2rem",
            borderLeft: "3px solid #C5A23C",
            background: "rgba(197,162,60,0.06)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ ...P, fontSize: "1.15rem", fontWeight: 600, fontStyle: "italic", color: "#5A4A20", lineHeight: 1.5, margin: 0 }}>
              Extractive systems thrive on unconscious repetition. Regenerative systems begin with intentional gestures.
            </p>
          </div>
        </article>
      </section>

      {/* ═══════════ JOURNEY MAP — Five Tools ═══════════ */}
      <section style={{
        background: "linear-gradient(170deg, #F5F0E6 0%, #E8DCC8 50%, #F0E8D8 100%)",
        padding: "4rem 1.5rem 5rem",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ ...M, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.5rem" }}>
              Your Coffee Journey Starts Here
            </div>
            <h2 style={{ ...P, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.75rem" }}>
              Five Tools. One Mission.
            </h2>
            <p style={{ ...S, fontSize: "1rem", color: "#6B5B4F", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
              This essay is the why. Below are the how — five interactive tools built to replace marketing poetry with measurable transparency.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}>
            {TOOLS.map(tool => (
              <Link key={tool.num} href={tool.path} style={{ textDecoration: "none", gridColumn: tool.full ? "1 / -1" : undefined }}>
                <div style={{
                  padding: "1.75rem", borderRadius: "12px",
                  background: "rgba(250,250,247,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(197,162,60,0.15)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(250,250,247,0.9)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,162,60,0.35)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(139,105,20,0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(250,250,247,0.7)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,162,60,0.15)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ ...M, fontSize: "0.7rem", color: "#C5A23C", letterSpacing: "0.1em" }}>{tool.num}</span>
                    <span style={{ fontSize: "1.3rem" }}>{tool.icon}</span>
                  </div>
                  <h3 style={{ ...P, fontSize: "1.15rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>{tool.title}</h3>
                  <p style={{ ...S, fontSize: "0.9rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "1rem" }}>{tool.desc}</p>
                  <div style={{ ...M, fontSize: "0.72rem", color: "#8B6914", fontWeight: 600 }}>
                    {tool.cta} <span style={{ marginLeft: "0.25rem" }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ RELATED ESSAYS ═══════════ */}
      <section style={{
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 50%, #F5F0E6 100%)",
        padding: "3.5rem 1.5rem 4rem",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ ...M, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.5rem" }}>
              Related Reading
            </div>
            <h2 style={{ ...P, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              The Deeper Dives
            </h2>
            <p style={{ ...S, fontSize: "0.95rem", color: "#6B5B4F" }}>
              Context, crusades, and accountability from across the archive.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {RELATED.map((essay, i) => (
              <Link key={i} href={essay.slug} style={{
                display: "flex", gap: "1rem", alignItems: "center",
                padding: "1.1rem 0",
                borderBottom: i < RELATED.length - 1 ? "1px solid rgba(111,78,55,0.1)" : "none",
                textDecoration: "none", color: "#6B5B4F",
                transition: "all 0.2s",
              }}>
                <span style={{ color: "#C5A23C", fontSize: "0.7rem", flexShrink: 0 }}>✦</span>
                <span style={{ ...S, fontWeight: 500, fontSize: "0.95rem", flex: 1, color: "#2C1810" }}>{essay.title}</span>
                <span style={{
                  ...M, fontSize: "0.68rem", color: "#6B5B4F", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0,
                  padding: "0.25rem 0.6rem", border: "1px solid rgba(111,78,55,0.12)", borderRadius: "3px",
                }}>{essay.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CLOSING ═══════════ */}
      <section style={{
        background: "linear-gradient(170deg, #3D2B1F 0%, #2C1810 100%)",
        padding: "5rem 1.5rem 3rem",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 10%, rgba(197,162,60,0.4) 50%, transparent 90%)",
        }} />
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ ...S, color: "rgba(245,240,230,0.7)", marginBottom: "0.6rem", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.7 }}>
            Tomorrow morning, you will lift a cup. So will two billion other people.
          </p>
          <p style={{ ...S, color: "rgba(245,240,230,0.7)", marginBottom: "0.6rem", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.7 }}>
            The revolution will not be televised. It will be brewed.
          </p>
          <p style={{ ...S, color: "rgba(245,240,230,0.7)", marginBottom: "1.5rem", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.7 }}>
            And it begins with a quiet question:
          </p>
          <p style={{ ...P, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, color: "#D4B96A", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Who gets paid when I wake up?
          </p>
          <p style={{
            ...M, fontSize: "0.85rem", color: "#F5F0E6", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1.5rem",
          }}>
            Choose well.
          </p>
        </div>

        {/* Citations */}
        <div style={{
          maxWidth: "700px", margin: "3rem auto 0",
          borderTop: "1px solid rgba(197,162,60,0.15)", paddingTop: "2rem",
        }}>
          <h3 style={{ ...M, fontSize: "0.68rem", fontWeight: 700, color: "rgba(245,240,230,0.5)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Sources
          </h3>
          {[
            "[1] Farmer wellbeing index — profitability challenges across coffee-growing regions in Uganda and Rwanda.",
            "[2] Fair Trade engagement and limitations — premium distribution gaps in coffee economics.",
            "[3] Tadesse Meskela — Ethiopian coffee cooperative work, documented in Black Gold.",
            "[4] Dave Asprey — mycotoxin risk and quality control, The Bulletproof Diet.",
          ].map((c, i) => (
            <p key={i} style={{ ...S, fontSize: "0.82rem", color: "rgba(245,240,230,0.5)", lineHeight: 1.65, marginBottom: "0.4rem", fontWeight: 300 }}>
              {c}
            </p>
          ))}
        </div>
      </section>

      {/* ═══════════ EMAIL CAPTURE ═══════════ */}
      <section style={{
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 50%, #F5F0E6 100%)",
        padding: "3rem 1.5rem 1rem",
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...M, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.5rem" }}>
            Stay Informed
          </p>
          <p style={{ ...S, fontSize: "1rem", color: "#2C1810", marginBottom: "1rem", lineHeight: 1.6 }}>
            Get coffee intelligence, crusade updates,
            and new tool releases delivered weekly.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1, padding: "10px 14px",
                border: "1px solid rgba(111,78,55,0.2)", borderRadius: 4,
                ...S, fontSize: 15, background: "#fff", color: "#2C1810",
              }}
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribeMutation.isPending || subscribed || !email}
              style={{
                background: subscribed ? "#2D5A27" : "#8B6914",
                color: "#fff", border: "none", borderRadius: 4,
                padding: "10px 20px", ...M, fontSize: 12,
                letterSpacing: "0.1em",
                cursor: subscribed ? "default" : "pointer",
                opacity: subscribeMutation.isPending ? 0.7 : 1,
              }}
            >
              {subscribed ? "Subscribed \u2713" : subscribeMutation.isPending ? "..." : "Subscribe"}
            </button>
          </div>
        </div>
      </section>

      {/* NextSteps CTA */}
      <section style={{
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 50%, #F5F0E6 100%)",
        padding: "2rem 1.5rem 4rem",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <NextSteps steps={[
            { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "Get your personalized coffee analysis" },
            { label: "Compare Coffees", path: "/brewsoul/compare", description: "Side-by-side brand transparency" },
            { label: "Browse the Catalog", path: "/brewsoul/browse", description: "Explore every coffee we've reviewed" },
          ]} title="Start Your Journey" />
        </div>
      </section>
    </BrewSoulLayout>
    </>);
}
