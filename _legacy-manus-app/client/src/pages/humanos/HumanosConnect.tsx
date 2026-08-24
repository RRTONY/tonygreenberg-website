/**
 * HumanOS V2.0 — Connect Page
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

const CHANNELS = [
  { title: "Take the Diagnostic", desc: "8 questions. 3 minutes. Discover whether you're a Maximizer or a Satisficer — and get a personalized protocol for reclaiming your agency.", href: "/assessment", cta: "START THE ASSESSMENT" },
  { title: "Read the Living Declaration", desc: "The full philosophical framework behind Human OS 2.0 — from Boiling the Human to the Conscious Satisficer protocol.", href: "/manifesto", cta: "READ NOW" },
  { title: "Explore the Ecosystem", desc: "Meet the mentors, advisors, and partners building the infrastructure for human flourishing.", href: "/humanos/ecosystem", cta: "MEET THE TEAM" },
  { title: "Pick Up the Phone", desc: "Sometimes the most radical act is a conversation. If this resonates, let's talk.", href: "/pick-up-the-phone", cta: "CONNECT" },
];

export default function HumanosConnect() {
  return (
    <>
    <SEO
        title="Connect — HumanOS"
        description="Join the HumanOS community and connect with others upgrading their operating system."
        path="/humanos/connect"
        keywords="Tony Greenberg, HumanOS community, connect, human upgrade"
        indexable={true}
      />
      <HumanosLayout>
      <section style={{ padding: "5rem 1.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>CONNECT</p>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem", color: "#1a1a2e" }}>
          Connect
        </h1>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#4a4a5a" }}>
          Human OS 2.0 is not a spectator sport. Choose your entry point.
        </p>
      </section>

      <section style={{ padding: "2rem 1.5rem 5rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {CHANNELS.map((ch) => (
            <Link
              key={ch.href}
              href={ch.href}
              style={{
                display: "block",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "8px",
                padding: "1.75rem",
                textDecoration: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#1a1a2e", marginBottom: "0.5rem" }}>{ch.title}</h3>
              <p style={{ fontSize: "1rem", color: "#5a5a6a", lineHeight: 1.7, marginBottom: "0.75rem" }}>{ch.desc}</p>
              <span style={{ ...label, color: "#7C3AED", fontSize: "0.65rem" }}>{ch.cta} →</span>
            </Link>
          ))}
        </div>
      </section>
    </HumanosLayout>
    </>);
}
