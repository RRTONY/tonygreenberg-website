/**
 * HumanOS V2.0 — Path to Here Page
 * Light body sections matching original humanosv2 design
 */
import { Link } from "wouter";
import HumanosLayout from "./HumanosLayout";
import SEO from "@/components/SEO";

const label: React.CSSProperties = {
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
};

const purpleBtn: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.9rem",
  letterSpacing: "0.15em",
  background: "#7C3AED",
  color: "#fff",
  padding: "1rem 2.5rem",
  textDecoration: "none",
  borderRadius: "2px",
};

const TIMELINE = [
  { year: "2010", title: "The H+ Summit", desc: "Harvard University. Shared the stage with Ray Kurzweil. Delivered 'Boiling the Human' — the first public articulation of how technology was outpacing our biological evolution. The audience was transhumanists, futurists, and AI researchers. The message was simple: we are the frog in the pot." },
  { year: "2011–2015", title: "The Enterprise Years", desc: "Built RampRate into a $24B+ benchmarking powerhouse. Advised Microsoft, Disney, Goldman Sachs, Nike. Created the SPY Index — 1M+ data points on enterprise technology. Learned that even the most sophisticated organizations were running on outdated human operating systems." },
  { year: "2016–2018", title: "The Psychedelic Turn", desc: "Six investments in psychedelic medicine: MycoMedica Life Sciences (co-founded with Paul Stamets), AtaiBeckley, Wake Network, Radicle Science, and Tripp. Consciousness expansion shifted from philosophy to infrastructure." },
  { year: "2019–2021", title: "ImpactSoul & Tokenization", desc: "Founded ImpactSoul as a Certified B Corp. Launched four token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health). Proved that tokenization could fund regenerative impact at scale." },
  { year: "2022–2024", title: "The Payments Corridor", desc: "Four payment processing companies through 'the corridor' — a payments infrastructure play at the intersection of traditional finance and Web3. The bridge between old money and new impact." },
  { year: "2025", title: "Human OS 2.0", desc: "Everything converges. The enterprise advisory, the psychedelic research, the impact tokenization, the payments infrastructure — all feeding into a single operating system for conscious human evolution. The machine is perfect. Be the glitch." },
];

export default function HumanosPathToHere() {
  return (
    <>
    <SEO
        title="Path to Here — HumanOS"
        description="The intellectual and experiential path that led to HumanOS."
        path="/humanos/path-to-here"
        keywords="Tony Greenberg, HumanOS history, Tony Greenberg path, H+ Summit"
        indexable={true}
      />
      <HumanosLayout>
      <section style={{ padding: "5rem 1.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE PATH TO HERE</p>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem", color: "#1a1a2e" }}>
          Path to Here
        </h1>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#4a4a5a" }}>
          From the 2010 H+ Summit to today — the architect's journey through enterprise technology, psychedelic medicine, impact tokenization, and the birth of a new operating system.
        </p>
      </section>

      {/* Bio note */}
      <section style={{ padding: "0 1.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ background: "#fff5f5", border: "1px solid rgba(229,62,62,0.12)", borderRadius: "8px", padding: "1.5rem" }}>
          <p style={{ fontSize: "1rem", color: "#4a4a5a", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#1a1a2e" }}>Tony Greenberg</strong> — author of <em>Boy in the Human</em>, speaker alongside Kurzweil at the 2010 H+ Summit, founder of RampRate and ImpactSoul. Twenty-five years building at the intersection of technology, consciousness, and impact.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "2rem 1.5rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ borderLeft: "2px solid rgba(229,62,62,0.25)", paddingLeft: "2rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {TIMELINE.map((t) => (
            <div key={t.year} style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "-2.55rem", top: "0.25rem", width: 12, height: 12, borderRadius: "50%", background: "#7C3AED" }} />
              <p style={{ ...label, color: "#7C3AED", marginBottom: "0.4rem", fontSize: "0.8rem" }}>{t.year}</p>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#1a1a2e", marginBottom: "0.5rem" }}>{t.title}</h3>
              <p style={{ fontSize: "1.05rem", color: "#4a4a5a", lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "2rem 1.5rem 5rem", textAlign: "center", background: "#fafafa" }}>
        <Link href="/assessment" style={purpleBtn}>TAKE THE DIAGNOSTIC</Link>
      </section>
    </HumanosLayout>
    </>);
}
