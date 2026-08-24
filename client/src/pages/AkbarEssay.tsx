import { useEffect, useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

// ── IMAGE URLS ──
const IMG = {
  slider1: "/api/img/slider-1_909bebcb.jpg",
  slider2: "/api/img/slider-2_a9ef7e3a.jpg",
  slider3: "/api/img/slider-3_e2fd10ab.jpg",
  slider4: "/api/img/slider-4_c13bc7f2.jpg",
  slider5: "/api/img/slider-5_6d81e0c4.jpg",
  gallery1: "/api/img/gallery-1_562d2f35.jpg",
  gallery2: "/api/img/gallery-2_77ece374.jpg",
  gallery3: "/api/img/gallery-3_b430acde.jpg",
  gallery4: "/api/img/gallery-4_9557b5a9.jpg",
  gallery5: "/api/img/gallery-5_c09ba728.jpg",
  gallery6: "/api/img/gallery-6_b0e3bcb0.jpg",
  gallery7: "/api/img/gallery-7_51581339.jpg",
  insta1: "/api/img/insta-1_d8a297a3.jpg",
  insta2: "/api/img/insta-2_093db618.jpg",
  insta3: "/api/img/insta-3_e06bb2f2.jpg",
  insta4: "/api/img/insta-4_d0a38891.jpg",
  insta5: "/api/img/insta-5_4e9d5dae.jpg",
  insta6: "/api/img/insta-6_ab214363.jpg",
  insta7: "/api/img/insta-7_07bde702.jpg",
  insta9: "/api/img/insta-9_4a8ec5c8.jpg",
  insta11: "/api/img/insta-11_1e875a76.jpg",
};

// ── WINE PAIRINGS ──
const winePairings = [
  { wine: "Turley Old Vines Zinfandel", dish: "Tandoori Prawns", note: "Eighty-year-old vines from Paso Robles. The brambly dark fruit absorbs tandoori smoke the way old leather absorbs rain. Improbable. Transcendent." },
  { wine: "Pierre Gimonnet Grower Champagne", dish: "Garlic Naan", note: "Not Moët. Not Veuve. A farmer's champagne — chalky, precise, almost austere — against butter-drenched bread still radiating clay-oven heat. The collision is sacred." },
  { wine: "Brunello di Montalcino (Biondi-Santi)", dish: "Bhartha", note: "Smoky eggplant dragged through embers meets a wine that spent five years in Slavonian oak contemplating mortality. Both taste like patience rewarded." },
  { wine: "Restrained Oregon Pinot (Cristom)", dish: "Goan Fish Curry", note: "Willamette Valley earth and coconut-tamarind broth. The pinot's forest-floor minerality catches the curry's molasses-dark bass notes mid-fall." },
  { wine: "Albariño (Do Ferreiro)", dish: "Sea Bass Tikka", note: "Galician salt spray and charred fish flesh. The Atlantic meeting the Arabian Sea through glass." },
  { wine: "Vouvray Demi-Sec (Huet)", dish: "Vegetable Samosas", note: "Loire honeyed quince against cumin-spiked potato and pea. The sweetness doesn't compete — it genuflects before the spice." },
];

// ── FOOD GRID ──
const foodGrid = [
  { img: IMG.gallery2, label: "The Kitchen" },
  { img: IMG.gallery3, label: "Tandoori Grill" },
  { img: IMG.gallery4, label: "The Bhartha" },
  { img: IMG.gallery5, label: "Memory Architecture" },
];

// ── FADE IN COMPONENT ──
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
<div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
      {children}
    </div>
  );
}

// ── FULL BLEED IMAGE ──
function FullBleedImage({ src, caption }: { src: string; caption?: string }) {
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", margin: "4rem 0", padding: "0 clamp(1rem, 3vw, 2rem)" }}>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.08)",
        padding: "6px",
      }}>
        <img
          src={src}
          alt={caption || ""}
          sizes="100vw"
          style={{
            width: "100%",
            height: "clamp(320px, 45vh, 550px)",
            objectFit: "cover",
            display: "block",
            borderRadius: "12px",
            filter: "brightness(0.75) saturate(1.3)",
            transition: "filter 0.6s ease, transform 8s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(0.9) saturate(1.5)";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(0.75) saturate(1.3)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>
      {caption && (
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.08em", color: "#9A9080", textAlign: "center", marginTop: "1rem", textTransform: "uppercase" }}>
          {caption}
        </p>
      )}
    </div>
  );
}

// ── DROP CAP PARAGRAPH ──
function DropCapParagraph({ children }: { children: React.ReactNode }) {
  const text = typeof children === "string" ? children : "";
  if (!text) return <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>{children}</p>;
  const firstLetter = text.charAt(0);
  const rest = text.slice(1);
  return (
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
      <span style={{
        float: "left",
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(4rem, 7vw, 5.5rem)",
        lineHeight: 0.72,
        fontWeight: 900,
        color: "#C9A84C",
        marginRight: "0.12em",
        marginTop: "0.06em",
        textShadow: "0 2px 16px rgba(201,168,76,0.25)",
      }}>{firstLetter}</span>
      {rest}
    </p>
  );
}

// ── MUGHAL ORNAMENT DIVIDER ──
function MughalDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", margin: "3rem 0" }}>
      <div style={{ width: "80px", height: "1px", background: "linear-gradient(to right, transparent, #C9A84C)" }} />
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: 0.7 }}>
        <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="none" stroke="#C9A84C" strokeWidth="0.7" />
      </svg>
      <div style={{ width: "80px", height: "1px", background: "linear-gradient(to left, transparent, #C9A84C)" }} />
    </div>
  );
}

// ── MAIN PAGE ──
export default function AkbarEssay() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.title = "Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget | Tony Greenberg";
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#0A0A0F", color: "#F4EDD8", minHeight: "100vh", fontFamily: "'Cormorant Garamond', serif", position: "relative", overflow: "hidden" }}>
      <SEO
        title="Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget"
        description="An essay on cultural memory, food, and what it means to preserve identity in a city that forgets."
        path="/essays/akbar"
        keywords="Tony Greenberg, Los Angeles, Akbar Cuisine, cultural memory, food essay"
        indexable={true}
      />
      {/* ── MUGHAL GEOMETRIC OVERLAY ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.025,
          backgroundImage: `
            repeating-linear-gradient(0deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 60px)
          `,
        }}
      />

      {/* ── FIXED NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1rem clamp(1.5rem, 4vw, 3rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrollY > 100 ? "rgba(10,10,15,0.92)" : "transparent",
          backdropFilter: scrollY > 100 ? "blur(12px)" : "none",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease",
          borderBottom: scrollY > 100 ? "1px solid rgba(201,168,76,0.15)" : "1px solid transparent",
        }}
      >
        <Link href="/blog" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "1.3rem", color: "#C9A84C" }}>TonyG</span>
        </Link>
        <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2rem)", alignItems: "center" }}>
          {["Essays", "Living Well", "ImpactSoul"].map((item) => (
            <Link
              key={item}
              href={item === "Essays" ? "/blog" : item === "ImpactSoul" ? "/ecosystem-map" : "/blog"}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9A9080",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A9080")}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        {/* Food Mosaic Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "4px",
            padding: "4px",
          }}
        >
          {[
            { src: IMG.slider1, area: "1 / 1 / 2 / 2" },
            { src: IMG.slider2, area: "1 / 2 / 3 / 3" },
            { src: IMG.slider3, area: "1 / 3 / 2 / 4" },
            { src: IMG.slider4, area: "2 / 1 / 3 / 2" },
            { src: IMG.slider5, area: "2 / 3 / 3 / 4" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                gridArea: item.area,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={item.src}
                alt=""
                sizes="(max-width: 640px) 100vw, 50vw"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.65) saturate(1.3)",
                  transition: "filter 0.6s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.85) saturate(1.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(0.65) saturate(1.3)")}
              />
            </div>
          ))}
        </div>

        {/* Mughal Arch Overlay */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(280px, 50vw, 500px)",
            height: "clamp(350px, 60vh, 600px)",
            borderRadius: "300px 300px 0 0",
            border: "1px solid rgba(201,168,76,0.2)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(260px, 46vw, 460px)",
            height: "clamp(330px, 56vh, 560px)",
            borderRadius: "280px 280px 0 0",
            border: "1px solid rgba(201,168,76,0.1)",
            pointerEvents: "none",
          }}
        />

        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.95) 100%)", pointerEvents: "none" }} />

        {/* Hero Content */}
        <div style={{ position: "absolute", bottom: "clamp(3rem, 10vh, 6rem)", left: "50%", transform: "translateX(-50%)", textAlign: "center", width: "clamp(300px, 80vw, 700px)", zIndex: 10 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.5rem" }}>
            A FIELD REPORT ON RESTORATION ECONOMICS
          </p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, color: "#F4EDD8", margin: "0 0 1.5rem 0" }}>
            Los Angeles Is Losing Its Memory —{" "}
            <span style={{ color: "#C8362A" }}>Akbar Cuisine</span>{" "}
            Refuses to Forget
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.15rem, 2vw, 1.3rem)", lineHeight: 1.8, color: "#9A9080", maxWidth: "560px", margin: "0 auto 2rem", fontStyle: "italic" }}>
            While Los Angeles optimizes itself into a content factory, one restaurant on Washington Boulevard still smells like coriander, old corks, warm naan, cardamom, smoke, and polished wood. It does not want your content. It wants your nervous system.
          </p>
          <a
            href="#essay"
            style={{
              display: "inline-block",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#0A0A0F",
              background: "#C9A84C",
              padding: "0.8rem 2rem",
              textDecoration: "none",
              transition: "background 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#E8821A"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Read the Essay
          </a>
        </div>

        {/* Scroll Indicator */}
        <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #C9A84C, transparent)", animation: "pulse 2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* ── ARTICLE INTRO ── */}
      <div id="essay" style={{ position: "relative", zIndex: 1 }}>
        <FadeIn delay={200}>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "5rem clamp(1.5rem, 5vw, 3rem) 3rem", textAlign: "center" }}>
            <MughalDivider />
            <blockquote style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)", fontWeight: 400, lineHeight: 1.7, color: "#F4EDD8", margin: "2rem 0", padding: 0, border: "none" }}>
              "Every legendary restaurant eventually develops one mythological figure quietly holding the entire organism together while pretending they are merely doing their job."
            </blockquote>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#9A9080", textTransform: "uppercase" }}>
              Tony Greenberg · May 2026 · 7 min read
            </p>
          </div>
        </FadeIn>

        {/* ── FULL BLEED BREAK 1 ── */}
        <FullBleedImage src={IMG.gallery1} caption="Akbar Cuisine of India · Washington Boulevard · Venice, Los Angeles" />

        {/* ── THE DIAGNOSIS ── */}
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 3rem)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#F4EDD8", marginBottom: "2rem", lineHeight: 1.2 }}>
              The Nervous System
            </h2>
            <DropCapParagraph>
              Restaurants do not actually run on food. They run on nervous systems. And at Akbar, the nervous system has a name: JC. He stands exactly where friction becomes hospitality — absorbing pressure from both sides before customers ever feel it. He remembers people the old way. Human memory. Not database memory.
            </DropCapParagraph>
            {/* JC Portrait */}
            <div style={{ margin: "2.5rem auto", maxWidth: "420px", borderRadius: "16px", overflow: "hidden", background: "rgba(201, 168, 76, 0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(201, 168, 76, 0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <img src="/api/img/IMG_5339_128670c2.jpeg" alt="JC — the soul of Akbar Cuisine" sizes="(max-width: 768px) 100vw, 600px" style={{ width: "100%", display: "block" }} loading="lazy" />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#C9A84C", textAlign: "center", padding: "0.75rem 1rem", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>JC — The Nervous System of Akbar</p>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
              He has quietly regulated the emotional weather of Akbar for decades. The timing of water arriving. The pacing between courses. The calm that radiates outward from his presence like heat from a clay oven. You do not notice what JC does until you eat somewhere he is not — and then you feel the absence like a missing frequency.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
              The garlic naan arrives at the precise moment your conversation pauses. It tears with exactly the right resistance — layers of technique compressed into architecture. Steam rises carrying ghee and roasted garlic. The fish tikka is not protein. It is time made edible: hours of yogurt and spice marination penetrating deep into the flesh, then the violence of the tandoor transforming patience into char. The green chutney beside it tastes photosynthetic.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
              The bhartha — velvet dragged through embers. Roasted eggplant collapsed into tomatoes and onions with a spice profile calibrated across generations. The tamarind carries molasses-dark bass notes. The rice absorbs sauce without surrendering structural integrity.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.35rem, 2.3vw, 1.6rem)", lineHeight: 1.85, color: "#C9A84C", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.01em" }}>
              JC changes flavor indirectly — through timing, through calm, through the rhythm of a room held steady.
            </p>
          </div>
        </FadeIn>

        {/* ── 2x2 FOOD GRID ── */}
        <div style={{ maxWidth: "900px", margin: "3rem auto", padding: "0 clamp(1rem, 3vw, 2rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
            {foodGrid.map((item, i) => (
              <div key={i} style={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "4/3",
                borderRadius: "14px",
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.12)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(201,168,76,0.06)",
                padding: "4px",
              }}>
                <img
                  src={item.img}
                  alt={item.label}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                    filter: "brightness(0.75) saturate(1.3)",
                    transition: "filter 0.5s ease, transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.9) saturate(1.5)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(0.75) saturate(1.3)"; e.currentTarget.style.transform = "scale(1)"; }}
                />
                <div style={{ position: "absolute", bottom: "4px", left: "4px", right: "4px", padding: "1.5rem 1rem 0.75rem", background: "linear-gradient(to top, rgba(10,10,15,0.85), transparent)", borderRadius: "0 0 10px 10px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C" }}>
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE RESTORATION ECONOMY ── */}
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 3rem)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#F4EDD8", marginBottom: "2rem", lineHeight: 1.2 }}>
              3.8 Stars and the Death of Memory
            </h2>
            <DropCapParagraph>
              Akbar has a 3.8 on Google. Let that land. A place that has been holding this neighborhood together for decades — through recessions, through fires, through the complete cultural lobotomy of Venice — and the algorithm gives it the same score as a fast-casual poke bowl.
            </DropCapParagraph>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
              Modern review systems reward stimulation instead of depth. They reward lighting, content engineering, visual seduction — the choreography of appearing interesting rather than the discipline of being nourishing. A restaurant that photographs well scores higher than one that feeds you well. A place optimized for the first visit outranks a place optimized for the thousandth.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
              Akbar does not perform for cameras. The room smells faintly of decades — cardamom embedded in the walls, ghee vapor in the ceiling tiles, the particular warmth of a space that has held ten thousand conversations. This is not something you can rate on a five-point scale.
            </p>

            {/* Reframe Terminology Block */}
            <div style={{ borderLeft: "2px solid #C9A84C", paddingLeft: "1.5rem", margin: "2.5rem 0" }}>
              {[
                { term: "Ritual over novelty.", def: "The Goan fish curry does not require a seasonal update. The menu has not changed because the menu does not need to change. It is a signal maintained across time." },
                { term: "Trust over stimulation.", def: "You do not discover Akbar. You are brought here by someone who trusts you enough to share it. The recommendation is the review." },
                { term: "Returning over arriving.", def: "The thousandth visit reveals what the first visit cannot. Emotional permanence is invisible to algorithms that only measure novelty." },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: "1.5rem" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.8, color: "#C9A84C", fontWeight: 600, marginBottom: "0.3rem" }}>
                    {item.term}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.15rem, 2vw, 1.3rem)", lineHeight: 1.85, color: "#F4EDD8", margin: 0 }}>
                    {item.def}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.35rem, 2.3vw, 1.6rem)", lineHeight: 1.85, color: "#C9A84C", fontWeight: 600, fontStyle: "italic" }}>
              Places that survive long enough to become part of people's lives do not need five stars. They need witnesses.
            </p>
          </div>
        </FadeIn>

        {/* ── FULL BLEED BREAK 2 ── */}
        <FullBleedImage src={IMG.gallery6} />

        {/* ── THE NIGHT THE EBAY DEAL ALMOST KILLED US ── */}
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 3rem)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#F4EDD8", marginBottom: "2rem", lineHeight: 1.2 }}>
              The Night the eBay Deal Almost Killed Us
            </h2>
            <DropCapParagraph>
              In 2004, I was running a technology company through one of those deals that either makes you or unmakes you. The eBay transaction. Months of legal architecture that would make a securities lawyer weep into his Macallan. The kind of stress that lives in your jaw at 3 AM and your lower back by noon.
            </DropCapParagraph>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.35rem, 2.3vw, 1.6rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "1.8rem", fontStyle: "italic" }}>
              Every Thursday night, without fail, we went to Akbar.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2rem" }}>
              Not because it was convenient. Because JC would see us walk in — shoulders up, jaws locked, cortisol radiating — and within four minutes the table would have water, warm naan, and a silence that said: you are safe here. Take your time.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "2.5rem" }}>
              The Goan fish curry would arrive and the room would smell like coconut milk reducing over low heat, tamarind darkening at the edges, curry leaves releasing their last green breath into the steam. Somewhere between the second naan and the third glass of an improbable Turley Zin, the deal would stop feeling like it might kill us. The food was not peripheral to survival. It was infrastructure.
            </p>

            {/* Pull Quote */}
            <blockquote style={{ position: "relative", margin: "3rem 0", padding: "2rem 0 2rem 2rem", borderLeft: "3px solid #E8821A" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.25rem, 2.3vw, 1.5rem)", lineHeight: 1.7, color: "#F4EDD8", margin: 0 }}>
                The deal closed. We survived. And JC never once asked what we did for a living. He just kept the room steady.
              </p>
            </blockquote>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8" }}>
              Twenty years later, the restaurant is still there. JC is still there. Still holding the organism together while pretending he is merely doing his job.
            </p>
          </div>
        </FadeIn>

        {/* ── 3-COLUMN FOOD STRIP ── */}
        <div style={{ maxWidth: "1000px", margin: "4rem auto", padding: "0 clamp(1rem, 3vw, 2rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[IMG.insta1, IMG.insta3, IMG.insta5].map((src, i) => (
              <div key={i} style={{
                overflow: "hidden",
                aspectRatio: "1",
                borderRadius: "14px",
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.12)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(201,168,76,0.06)",
                padding: "4px",
              }}>
                <img
                  src={src}
                  alt=""
                  sizes="(max-width: 640px) 50vw, 25vw"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                    filter: "brightness(0.75) saturate(1.3)",
                    transition: "filter 0.5s ease, transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.9) saturate(1.5)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(0.75) saturate(1.3)"; e.currentTarget.style.transform = "scale(1)"; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── WINE PAIRING SECTION ── */}
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 3rem)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#F4EDD8", marginBottom: "0.5rem", lineHeight: 1.2, textAlign: "center" }}>
              The Liquid Treasure Chest
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.15rem, 2vw, 1.25rem)", lineHeight: 1.8, color: "#9A9080", textAlign: "center", maxWidth: "560px", margin: "0 auto 3rem", fontStyle: "italic" }}>
              Forget the lazy "pair spicy food with Riesling" algorithm. These are improbable marriages — cult Zinfandels against tandoori smoke, grower Champagne with butter-soaked naan, Brunello contemplating mortality alongside bhartha.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              {winePairings.map((pair, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(201,168,76,0.04)",
                    border: "1px solid rgba(201,168,76,0.12)",
                    borderRadius: "14px",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(201,168,76,0.06)",
                    padding: "1.75rem",
                    transition: "background 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(201,168,76,0.04)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.3rem" }}>
                    {pair.wine}
                  </p>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 500, color: "#F4EDD8", marginBottom: "0.5rem" }}>
                    with {pair.dish}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", lineHeight: 1.7, color: "#9A9080", margin: 0 }}>
                    {pair.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── FULL BLEED BREAK 3 ── */}
        <FullBleedImage src={IMG.gallery7} />

        {/* ── IMPACTSOUL BRIDGE ── */}
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 3rem)" }}>
            <div style={{ borderLeft: "3px solid #00C9B1", paddingLeft: "1.5rem", background: "rgba(0,201,177,0.03)", padding: "2rem 1.5rem 2rem 2rem" }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "#F4EDD8", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                What Akbar Could Become
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "1.5rem" }}>
                Imagine the spice blends packaged. Not mass-produced — numbered. Small-batch runs in hand-stamped tins. The Goan fish curry base as a concentrate. The tandoori marinade in glass jars with wax seals. A quarterly subscription: four spice architectures, a card explaining the lineage of each blend, a QR code linking to JC telling the story of how each dish entered the menu.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "1.5rem" }}>
                This is not a franchise play. It is a preservation play. The knowledge inside Akbar's kitchen is irreplaceable — and currently exists only in the hands and memory of people who will not be here forever. Packaging is not commercialization. It is archiving.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#9A9080" }}>
                At ImpactSoul, we fund restoration infrastructure. Akbar is not a portfolio company. But it is proof of concept — evidence that businesses built on depth rather than extraction can survive for decades in a market that rewards the opposite.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── THE CLOSE ── */}
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "4rem clamp(1.5rem, 5vw, 3rem) 3rem", textAlign: "center" }}>
            <MughalDivider />
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "#F4EDD8", margin: "2rem 0 2rem", lineHeight: 1.2 }}>
              The Question That Remains
            </h2>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)", lineHeight: 1.7, color: "#C8362A", marginBottom: "2.5rem" }}>
              In a city that is losing its memory, who is holding yours?
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.25rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "1.5rem" }}>
              Not memory in the nostalgic sense. Memory in the cellular sense. The smell of cumin hitting hot oil. The sound of naan tearing. The specific silence of a room where no one is performing. The weight of a wine glass held by someone who has stopped checking their phone.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.25rem, 2.2vw, 1.4rem)", lineHeight: 1.85, color: "#F4EDD8", marginBottom: "1.5rem" }}>
              JC will not remember your name the first time. He will remember it the second. By the third visit, you are no longer a customer. You are someone he is holding space for. That is the difference between a restaurant and a place.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.3rem, 2.3vw, 1.5rem)", lineHeight: 1.85, color: "#C9A84C", fontWeight: 600, marginBottom: "1.5rem", letterSpacing: "0.02em" }}>
              Akbar Cuisine of India. Washington Boulevard. Venice, Los Angeles. Still there. Still restoring. JC still at the door.
            </p>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: "#F4EDD8", marginTop: "2rem" }}>
              The reservation is yours to make.
            </p>
          </div>
        </FadeIn>

        {/* ── FOOTER GALLERY ROW ── */}
        <div style={{ maxWidth: "100%", margin: "4rem 0 0", overflow: "hidden", padding: "0 clamp(0.5rem, 2vw, 1.5rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
            {[IMG.insta2, IMG.insta4, IMG.insta6, IMG.insta7, IMG.insta9, IMG.insta11].map((src, i) => (
              <div key={i} style={{
                overflow: "hidden",
                aspectRatio: "1",
                borderRadius: "10px",
                background: "rgba(201,168,76,0.03)",
                border: "1px solid rgba(201,168,76,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                padding: "3px",
              }}>
                <img
                  src={src}
                  alt=""
                  sizes="(max-width: 640px) 50vw, 25vw"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    filter: "brightness(0.5) saturate(1.2) sepia(0.15)",
                    transition: "filter 0.5s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.8) saturate(1.4)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(0.5) saturate(1.2) sepia(0.15)")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ padding: "3rem clamp(1.5rem, 5vw, 3rem)", borderTop: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "1.3rem", color: "#C9A84C", marginBottom: "1.5rem" }}>TonyG</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {[
              { label: "tonygreenberg.com", href: "/blog" },
              { label: "impactsoul.is", href: "https://impactsoul.is" },
              { label: "ramprate.com", href: "https://ramprate.com" },
              { label: "LinkedIn", href: "https://linkedin.com/in/tonygreenberg" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em", color: "#9A9080", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9A9080")}
              >
                {link.label}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
            © 2026 Tony Greenberg. All rights reserved.
          </p>
        </footer>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .akbar-body-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 2.2vw, 1.4rem);
          line-height: 1.85;
          color: #F4EDD8;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}
