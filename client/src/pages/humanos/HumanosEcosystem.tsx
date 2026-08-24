/**
 * HumanOS V2.0 — Ecosystem Page
 * Light body sections matching original humanosv2 design
 */
import HumanosLayout from "./HumanosLayout";
import SEO from "@/components/SEO";

const label: React.CSSProperties = {
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
};

const MENTOR = {
  name: "David Orban",
  role: "FACULTY & ADVISOR",
  org: "Singularity University | Transhumanism Pioneer",
  img: "/api/img/david-orban_c55c3bfe.jpg",
  quote: "The future belongs to those who understand that technology and humanity are not separate forces, but co-evolving partners. Human OS 2.0 represents the conscious choice to upgrade our operating systems — not just our devices, but our minds, our societies, and our relationship with what it means to be human in an age of exponential change.",
};

const ADVISORS = [
  { name: "Will Poole", role: "CO-FOUNDER", org: "Capria Ventures (Former Microsoft Windows Leader)", img: "/api/img/will-poole_1b8880dd.png", quote: "Creating an impact economy powered by community, not billionaires — enough waiting, time to act." },
  { name: "Gary Silverman", role: "PARTNER", org: "White & Case LLP", img: "/api/img/gary-silverman_4bd3b7ee.jpg", quote: "Guiding blockchain's first use cases toward positive change — blazing the trail others will follow." },
  { name: "Alessa Berg", role: "FOUNDER", org: "Top Tier Impact, ESG360", img: "/api/img/alessa-berg-real_ebbf94ce.jpg", quote: "Aligning ecology, community, and capital to build an economy that restores, not extracts." },
  { name: "Andrew Durgee", role: "CEO", org: "Republic Crypto", img: "/api/img/andrew-durgee_a049fd1d.png", quote: "Moving blockchain past speculation into regeneration — building sustainable value for a sustainable world." },
  { name: "Pico Velasquez", role: "CO-FOUNDER AND CEO", org: "Artha Ventures", img: "/api/img/pico-velasquez_f36fd4a5.png", quote: "Rallying mass impact movements to fund sustainable change — ready to better the world together." },
  { name: "Stuart Newton", role: "CO-FOUNDER", org: "Abundant Village", img: "/api/img/stuart-newton_9bfc85c4.png", quote: "Democratizing impact — you don't need billions to create meaningful change with your work." },
  { name: "Alan Ginsberg", role: "CO-FOUNDER", org: "Ginsberg Development", img: "/api/img/alan-ginsberg_520032c0.png", quote: "Tokenizing real-world assets to unlock illiquid value and shared ownership as impact's economic engine." },
  { name: "Peta Milan", role: "CEO", org: "JET Regeneration Group", img: "/api/img/peta-milan-real_270c99c1.jpg", quote: "Igniting community-driven regenerative projects that elevate all life — shifting the needle on systemic impact." },
];

const PARTNERS = [
  { name: "Matt McKibbin", role: "FOUNDER AND CHIEF DECENTRALIZATION OFFICER", org: "DecentraNet", img: "/api/img/matt-mckibbin_09cfd3d6.jpg", quote: "Decentralization is about more than just technology; it's about shifting power back to the edges. ImpactSoul is building the infrastructure for a world where value flows freely to where it's needed most." },
  { name: "Ted Moskovitz", role: "FOUNDER", org: "DecentraNet", img: "/api/img/ted-moskovitz_d0d40d28.jpg", quote: "We are rewriting the social contract. ImpactSoul represents a practical, scalable way to align economic incentives with human flourishing." },
  { name: "Josh Kriger", role: "CO-FOUNDER & CO-HOST", org: "Edge of NFT / Edge of Company", img: "/api/img/josh_kriger_profile_87b7bd1e.webp", quote: "Our primary goal is to support, nourish, and co-create this ecosystem. ImpactSoul aligns perfectly with the mission to use Web3 for genuine social impact and human flourishing." },
];

const CLIENTS = [
  "Sony", "Nike", "Microsoft", "eBay", "Intel", "Verizon", "Hearst", "Blizzard",
  "Sega", "Nintendo", "Virgin", "Vodafone", "Yahoo", "AOL", "Fox", "NBC",
  "MTV", "Disney", "Citigroup", "Goldman Sachs", "Credit Suisse", "Merrill Lynch",
  "McKinsey", "Broadcom", "Sandisk", "PayPal", "Ticketmaster", "Expedia", "GoDaddy",
];

type PersonData = { name: string; role: string; org: string; img: string; quote: string };

function PersonCard({ person, accent = "#7C3AED" }: { person: PersonData; accent?: string }) {
  return (
<div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <img src={person.img} alt={person.name} sizes="56px" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${accent}33` }} loading="lazy" />
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>{person.name}</p>
          <p style={{ ...label, fontSize: "0.6rem", color: accent, margin: "0.2rem 0 0" }}>{person.role}</p>
          <p style={{ fontSize: "0.9rem", color: "#6a6a7a", margin: "0.15rem 0 0" }}>{person.org}</p>
        </div>
      </div>
      <blockquote style={{ margin: 0, fontStyle: "italic", fontSize: "1rem", lineHeight: 1.7, color: "#4a4a5a", borderLeft: `2px solid ${accent}44`, paddingLeft: "1rem" }}>
        "{person.quote}"
      </blockquote>
    </div>
  );
}

export default function HumanosEcosystem() {
  return (
    <HumanosLayout>
      <SEO
        title="HumanOS Ecosystem"
        description="The tools, practices, and communities that form the HumanOS ecosystem."
        path="/humanos/ecosystem"
        keywords="Tony Greenberg, HumanOS ecosystem, human upgrade tools, cognitive tools"
        indexable={true}
      />
      {/* HEADER */}
      <section style={{ padding: "5rem 1.5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE ECOSYSTEM</p>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem", color: "#1a1a2e" }}>
          The Ecosystem
        </h1>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#4a4a5a", maxWidth: "650px" }}>
          A council of architects, visionaries, and glitches united by a single purpose: to rewrite the operating system of humanity.
        </p>
      </section>

      {/* INSPIRATIONAL MENTOR */}
      <section style={{ padding: "2rem 1.5rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>INSPIRATIONAL MENTOR</p>
        <p style={{ fontSize: "1rem", color: "#5a5a6a", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          A singular visionary guiding the evolution of human consciousness in the age of exponential technology.
        </p>
        <div style={{ background: "#fff5f5", border: "1px solid rgba(229,62,62,0.12)", borderRadius: "8px", padding: "2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <img src={MENTOR.img} alt={MENTOR.name} sizes="90px" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "3px solid rgba(229,62,62,0.2)" }} loading="lazy" />
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1a1a2e", margin: "0 0 0.25rem" }}>{MENTOR.name}</h3>
            <p style={{ ...label, fontSize: "0.6rem", color: "#7C3AED", margin: "0 0 0.2rem" }}>{MENTOR.role}</p>
            <p style={{ fontSize: "0.95rem", color: "#6a6a7a", margin: "0 0 1rem" }}>{MENTOR.org}</p>
            <blockquote style={{ margin: 0, fontStyle: "italic", fontSize: "1.05rem", lineHeight: 1.7, color: "#4a4a5a", borderLeft: "3px solid rgba(229,62,62,0.3)", paddingLeft: "1rem" }}>
              "{MENTOR.quote}"
            </blockquote>
          </div>
        </div>
      </section>

      {/* IMPACTSOUL ADVISORS */}
      <section style={{ background: "#f8f8fc", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>IMPACTSOUL ADVISORS</p>
          <p style={{ fontSize: "1.05rem", color: "#5a5a6a", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "600px" }}>
            Strategic architects and visionaries who bring decades of expertise across technology, finance, impact, and regeneration.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {ADVISORS.map((a) => <PersonCard key={a.name} person={a} />)}
          </div>
        </div>
      </section>

      {/* THE PARTNERS */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE PARTNERS</p>
        <p style={{ fontSize: "1.05rem", color: "#5a5a6a", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "600px" }}>
          Strategic allies and operational powerhouses driving the execution of the vision.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {PARTNERS.map((p) => <PersonCard key={p.name} person={p} accent="#48bb78" />)}
        </div>
      </section>

      {/* THE CLIENTS */}
      <section style={{ background: "#f8f8fc", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE CLIENTS</p>
          <p style={{ fontSize: "1.05rem", color: "#5a5a6a", lineHeight: 1.7, marginBottom: "2rem" }}>
            Built on the foundation of 20+ years of sourcing and impact advisory for the world's most innovative companies.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {CLIENTS.map((c) => (
              <span key={c} style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.8rem", letterSpacing: "0.1em", color: "#4a4a5a", background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px", padding: "0.5rem 0.9rem" }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </HumanosLayout>
  );
}
