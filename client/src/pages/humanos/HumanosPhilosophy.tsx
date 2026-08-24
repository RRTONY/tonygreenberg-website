/**
 * HumanOS V2.0 — Philosophy Page
 * Light body sections matching original humanosv2 design
 */
import { Link } from "wouter";
import HumanosLayout from "./HumanosLayout";
import SEO from "@/components/SEO";

const DAVID_ORBAN_IMG = "/api/img/david-orban_c55c3bfe.jpg";
const CONSCIOUSNESS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/consciousness-scale-HjPE8waC75o6fHtrhXiBKu.webp";

const label: React.CSSProperties = {
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
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

const ghostBtn: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.9rem",
  letterSpacing: "0.15em",
  background: "transparent",
  color: "#7C3AED",
  padding: "1rem 2.5rem",
  textDecoration: "none",
  border: "1px solid rgba(229,62,62,0.4)",
  borderRadius: "2px",
};

export default function HumanosPhilosophy() {
  return (
    <>
    <SEO
        title="HumanOS Philosophy"
        description="The philosophical foundations of HumanOS: consciousness, agency, and human potential."
        path="/humanos/philosophy"
        keywords="Tony Greenberg, HumanOS philosophy, consciousness, human potential, agency"
        indexable={true}
      />
      <HumanosLayout>
      {/* ═══════ HERO ═══════ */}
      <section style={{ padding: "5rem 1.5rem 3rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE PHILOSOPHY</p>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            color: "#1a1a2e",
          }}
        >
          The Philosophy
        </h1>
        <blockquote
          style={{
            borderLeft: "3px solid #7C3AED",
            paddingLeft: "1.5rem",
            margin: "0 0 2rem",
            fontStyle: "italic",
            fontSize: "1.2rem",
            lineHeight: 1.7,
            color: "#4a4a5a",
          }}
        >
          "In a world designed to maximize everything, the revolutionary act is to choose enough."
        </blockquote>
      </section>

      {/* ═══════ BOILING THE HUMAN ═══════ */}
      <section style={{ padding: "0 1.5rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>BOILING THE HUMAN</p>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "1.5rem" }}>
          We are like frogs in a pot of water that is slowly heating up. The changes in our environment — the speed of information, the demand for attention, the erosion of privacy — have happened so gradually that we haven't noticed we are boiling alive.
        </p>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "2rem" }}>
          This presentation, delivered at the H+ Summit, was the first warning shot. It outlines exactly how technology is outpacing our biological evolution and what we must do to survive it.
        </p>

        {/* David Orban Quote */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <img
            src={DAVID_ORBAN_IMG}
            alt="David Orban"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            loading="lazy"
          />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <blockquote style={{ margin: 0, fontStyle: "italic", fontSize: "1.05rem", lineHeight: 1.7, color: "#4a4a5a" }}>
              "You are a transhuman. The very definition of the human condition is the necessity to adapt to change. Through technology, we now live in an intrinsically transhumanist era."
            </blockquote>
            <p style={{ ...label, marginTop: "0.75rem", fontSize: "0.65rem", color: "#7C3AED" }}>
              — DAVID ORBAN, ADVISOR TO SINGULARITY UNIVERSITY, FORMER CHAIRMAN OF HUMANITY+
            </p>
            <p style={{ fontSize: "1rem", color: "#5a5a6a", lineHeight: 1.7, marginTop: "0.75rem" }}>
              David's philosophy — that we are all transhumans, defined by our ability to adapt and overcome limitations through technology — was the catalyst for Human OS 2.0. At the 2010 H+ Summit, his mentorship helped crystallize the core insight: technology must fit humans like a glove, not a cast.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ THE MAXIMIZER TRAP ═══════ */}
      <section
        style={{
          background: "#fff5f5",
          borderTop: "1px solid rgba(229,62,62,0.1)",
          borderBottom: "1px solid rgba(229,62,62,0.1)",
          padding: "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE MAXIMIZER TRAP</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.5rem", color: "#1a1a2e" }}>
            The Maximizer Trap
          </h2>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "1.5rem" }}>
            The Maximizer is driven by the relentless pursuit of "the best." Every decision is an optimization problem. Every outcome must be perfect.
          </p>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#5a5a6a", marginBottom: "1.5rem" }}>
            This operating system leads to:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {["Analysis Paralysis", "Chronic Dissatisfaction", "Decision Fatigue", "The \"Grass is Greener\" Syndrome"].map((item) => (
              <div
                key={item}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(229,62,62,0.15)",
                  borderRadius: "6px",
                  padding: "1rem",
                  fontSize: "1rem",
                  color: "#1a1a2e",
                  fontWeight: 500,
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#5a5a6a" }}>
            The Maximizer is a slave to the algorithm, constantly seeking an external validation of perfection that does not exist.
          </p>
        </div>
      </section>

      {/* ═══════ THE CONSCIOUS SATISFICER ═══════ */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#48bb78", marginBottom: "0.75rem" }}>THE CONSCIOUS SATISFICER</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.5rem", color: "#1a1a2e" }}>
          The Conscious Satisficer
        </h2>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "1.5rem" }}>
          The Satisficer is not about "settling." It is about strategic selection. It is the ability to define your own criteria for success and stop when they are met.
        </p>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#5a5a6a", marginBottom: "1.5rem" }}>
          This operating system unlocks:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {["Radical Agency", "Deep Focus", "Joy in the Present", "Sustainable Growth"].map((item) => (
            <div
              key={item}
              style={{
                background: "#f0fdf4",
                border: "1px solid rgba(72,187,120,0.2)",
                borderRadius: "6px",
                padding: "1rem",
                fontSize: "1rem",
                color: "#1a1a2e",
                fontWeight: 500,
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#5a5a6a" }}>
          The Conscious Satisficer reclaims their cognitive bandwidth for what truly matters: creation, connection, and impact.
        </p>

        {/* Consciousness Scale image */}
        <div style={{ margin: "2.5rem 0", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <img
            src={CONSCIOUSNESS_IMG}
            alt="Corporate Consciousness Scale"
            style={{ width: "100%", display: "block" }}
            loading="lazy"
          />
        </div>
      </section>

      {/* ═══════ THE SHIFT ═══════ */}
      <section
        style={{
          background: "#f8f8fc",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE SHIFT</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.5rem", color: "#1a1a2e" }}>
            The Shift
          </h2>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "2rem" }}>
            Human OS 2.0 is not just a mindset. It is a protocol for living. It requires a hard reset of your values, your habits, and your definitions of success.
          </p>

          {/* FROM → TO grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { from: "External Validation", to: "Internal Resonance" },
              { from: "Endless Consumption", to: "Intentional Creation" },
              { from: "Fear of Missing Out", to: "Joy of Missing Out" },
            ].map((row) => (
              <div
                key={row.from}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: "1rem",
                  alignItems: "center",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div>
                  <p style={{ ...label, fontSize: "0.6rem", marginBottom: "0.3rem", color: "rgba(229,62,62,0.7)" }}>FROM</p>
                  <p style={{ fontSize: "1.05rem", color: "#5a5a6a", margin: 0 }}>{row.from}</p>
                </div>
                <span style={{ color: "#7C3AED", fontSize: "1.2rem", fontWeight: 700 }}>→</span>
                <div>
                  <p style={{ ...label, fontSize: "0.6rem", marginBottom: "0.3rem", color: "rgba(72,187,120,0.7)" }}>TO</p>
                  <p style={{ fontSize: "1.05rem", color: "#1a1a2e", margin: 0, fontWeight: 600 }}>{row.to}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTAs ═══════ */}
      <section style={{ padding: "4rem 1.5rem", textAlign: "center", background: "#fafafa" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <Link href="/living-declaration" style={purpleBtn}>READ THE LIVING DECLARATION</Link>
          <Link href="/humanos/path-to-here" style={ghostBtn}>HOW I GOT HERE</Link>
        </div>
      </section>
    </HumanosLayout>
    </>);
}
