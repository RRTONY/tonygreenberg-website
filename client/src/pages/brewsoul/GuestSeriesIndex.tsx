import BrewSoulLayout from "./BrewSoulLayout";
import { Link } from "wouter";
import SEO from "@/components/SEO";

const C = { soil: "#3B2F1E", cream: "#FAF8F2", gold: "#8B6914", rust: "#A0522D", bark: "#5C4A32", white: "#FFFFFF", dMoss: "#2E4A3A" };
const F = { d: "'Playfair Display',serif", b: "'Source Sans 3',sans-serif", m: "'DM Mono',monospace" };

const GUESTS = [
  {
    name: "Shanita Nicholas",
    title: "Director of Coffee Ecology, Quantum Seeds LLC",
    img: "/api/img/brewsoul-orig_84eb4bc9.jpg",
    slug: "/brewsoul/guest/shanita-nicholas",
    headline: "Breaks the Coffee Industry's Comfortable Lies",
    teaser: "Fair Trade theater, roasting mythology, the C Market trap, and why origin-roasting is the only structural fix. A 10-question interrogation with one of coffee's most important truth-tellers.",
    tags: ["Fair Trade", "Supply Chain", "Origin Roasting", "Regenerative Economics"],
  },
];

export default function GuestSeriesIndex() {
  return (
    <>
    <SEO
        title="Guest Series — BrewSoul"
        description="Expert voices in specialty coffee: farmers, roasters, scientists, and educators."
        path="/brewsoul/guest-series"
        keywords="Tony Greenberg, coffee guest series, coffee experts, specialty coffee voices"
        indexable={true}
      />
      <BrewSoulLayout>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.soil} 0%, ${C.dMoss} 100%)`, padding: "clamp(48px,8vw,80px) 24px 48px", textAlign: "center", borderBottom: `3px solid ${C.rust}` }}>
        <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 4, color: C.gold, marginBottom: 16 }}>TONY G GUEST SERIES</div>
        <h1 style={{ fontFamily: F.d, fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, color: C.cream, lineHeight: 1.2, margin: "0 auto 16px", maxWidth: 700, fontStyle: "italic" }}>
          The People Reshaping Coffee
        </h1>
        <p style={{ fontFamily: F.b, fontSize: "clamp(14px,2vw,18px)", color: "rgba(245,239,224,.8)", maxWidth: 560, margin: "0 auto" }}>
          Long-form interviews with the scientists, farmers, lawyers, and builders who refuse to let the industry stay comfortable.
        </p>
      </section>

      {/* Guest Cards */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        {GUESTS.map((g) => (
          <Link key={g.slug} href={g.slug} style={{ textDecoration: "none", display: "block", marginBottom: 32 }}>
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,.08)", overflow: "hidden", display: "flex", flexDirection: "row", transition: "transform .2s, box-shadow .2s", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,.08)"; }}
            >
              <img src={g.img} alt={g.name} sizes="(max-width: 640px) 120px, 25vw" style={{ width: "clamp(120px,25vw,200px)", objectFit: "cover", flexShrink: 0 }} loading="lazy" />
              <div style={{ padding: "clamp(16px,3vw,32px)", flex: 1 }}>
                <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.rust, marginBottom: 8 }}>GUEST INTERVIEW</div>
                <h2 style={{ fontFamily: F.d, fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, color: C.soil, lineHeight: 1.25, margin: "0 0 4px" }}>{g.name}</h2>
                <p style={{ fontFamily: F.d, fontSize: "clamp(14px,2vw,18px)", color: C.gold, fontStyle: "italic", margin: "0 0 12px" }}>{g.headline}</p>
                <p style={{ fontFamily: F.b, fontSize: 14, lineHeight: 1.7, color: C.bark, margin: "0 0 12px" }}>{g.teaser}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {g.tags.map(t => (
                    <span key={t} style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, padding: "3px 8px", background: "#f5f1e8", color: C.bark, borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Coming Soon */}
        <div style={{ border: `2px dashed ${C.gold}33`, borderRadius: 12, padding: "40px 24px", textAlign: "center", marginTop: 16 }}>
          <div style={{ fontFamily: F.d, fontSize: 20, color: C.bark, fontStyle: "italic", marginBottom: 8 }}>More guests coming soon</div>
          <p style={{ fontFamily: F.b, fontSize: 14, color: C.bark, opacity: 0.6 }}>
            Farmers, roasters, scientists, and builders who are changing how coffee works.
          </p>
        </div>
      </section>
    </BrewSoulLayout>
    </>);
}
