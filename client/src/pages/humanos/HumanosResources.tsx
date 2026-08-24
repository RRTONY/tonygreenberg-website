/**
 * HumanOS V2.0 — Resources Page
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

const PLAYBOOKS = [
  { num: "01", title: "The Attention Audit", desc: "A 7-day protocol for mapping exactly where your cognitive bandwidth goes — and reclaiming it. Track every notification, every scroll, every context switch. The data will shock you.", link: "/attention-theft" },
  { num: "02", title: "The Satisficer Protocol", desc: "A decision-making framework for defining 'enough' before you start searching. Eliminates analysis paralysis and the grass-is-greener syndrome.", link: "/assessment" },
  { num: "03", title: "The Digital Sabbath", desc: "A weekly practice of intentional disconnection. Not a detox — a recalibration. 24 hours of analog living to reset your baseline.", link: null },
  { num: "04", title: "The Consciousness Scale", desc: "Map your organization's operating system from survival mode to generative leadership. Based on 25 years of enterprise advisory.", link: "/assessments/consciousness-scale" },
];

const DAILY_PRACTICES = [
  { title: "Morning Protocol", items: ["No screens for the first 60 minutes", "Journaling: 3 pages, stream of consciousness", "Movement: 20 minutes minimum, no podcasts", "Intention setting: one word for the day"] },
  { title: "Work Protocol", items: ["Time-boxing: 90-minute deep work blocks", "Single-tasking: one tab, one task, one outcome", "Communication windows: check email/messages 3x daily", "Decision journaling: record the criteria, not just the choice"] },
  { title: "Evening Protocol", items: ["Digital sunset: screens off 90 minutes before sleep", "Gratitude practice: 3 specific moments from today", "Tomorrow's MIT: identify the Most Important Thing", "Reading: 30 minutes minimum, physical books preferred"] },
];

const READING_LIST = [
  { title: "Stealing Fire", author: "Steven Kotler & Jamie Wheal", why: "The science of altered states and peak performance — the neurochemistry behind flow, mindfulness, psychedelics, and technology." },
  { title: "The Paradox of Choice", author: "Barry Schwartz", why: "The foundational text on Maximizers vs. Satisficers. Essential reading for understanding why more options make us less happy." },
  { title: "Recapture the Rapture", author: "Jamie Wheal", why: "A blueprint for meaning-making in a post-institutional world. Addresses the collapse of traditional meaning structures." },
  { title: "The Singularity Is Nearer", author: "Ray Kurzweil", why: "The updated case for exponential technology and its implications for human consciousness and capability." },
  { title: "How to Change Your Mind", author: "Michael Pollan", why: "The mainstream introduction to psychedelic science and its potential for treating depression, addiction, and existential distress." },
  { title: "Finite and Infinite Games", author: "James P. Carse", why: "The philosophical foundation for understanding the difference between playing to win and playing to keep playing." },
  { title: "The Master and His Emissary", author: "Iain McGilchrist", why: "A groundbreaking exploration of how the divided brain shapes our world — and why the left hemisphere's dominance is destroying it." },
  { title: "Sapiens", author: "Yuval Noah Harari", why: "The story of how Homo sapiens conquered the world through shared fictions — and what happens when those fictions stop serving us." },
];

export default function HumanosResources() {
  return (
    <>
    <SEO
        title="HumanOS Resources"
        description="Books, tools, practices, and research that inform the HumanOS framework."
        path="/humanos/resources"
        keywords="Tony Greenberg, HumanOS resources, books, tools, cognitive science"
        indexable={true}
      />
      <HumanosLayout>
      {/* HEADER */}
      <section style={{ padding: "5rem 1.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE RESOURCES</p>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem", color: "#1a1a2e" }}>
          Resources
        </h1>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#4a4a5a" }}>
          Practical tools, daily protocols, and essential reading for upgrading your operating system.
        </p>
      </section>

      {/* TRANSFORMATION PLAYBOOKS */}
      <section style={{ padding: "2rem 1.5rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>TRANSFORMATION PLAYBOOKS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {PLAYBOOKS.map((pb) => (
            <div
              key={pb.num}
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "8px",
                padding: "1.75rem",
                display: "flex",
                gap: "1.25rem",
                alignItems: "flex-start",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <span style={{ fontFamily: "'Special Elite', monospace", fontSize: "1.5rem", color: "#7C3AED", fontWeight: 700, flexShrink: 0, lineHeight: 1 }}>{pb.num}</span>
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "#1a1a2e", margin: "0 0 0.5rem" }}>{pb.title}</h3>
                <p style={{ fontSize: "1rem", color: "#5a5a6a", lineHeight: 1.7, margin: "0 0 0.75rem" }}>{pb.desc}</p>
                {pb.link && (
                  <Link href={pb.link} style={{ ...label, color: "#7C3AED", fontSize: "0.65rem", textDecoration: "none" }}>
                    EXPLORE →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DAILY PRACTICES */}
      <section style={{ background: "#f0fdf4", borderTop: "1px solid rgba(72,187,120,0.15)", borderBottom: "1px solid rgba(72,187,120,0.15)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#48bb78", marginBottom: "0.75rem" }}>DAILY PRACTICES</p>
          <p style={{ fontSize: "1.05rem", color: "#3a3a4a", lineHeight: 1.7, marginBottom: "2rem" }}>
            Small, consistent actions that compound into fundamental shifts. These are not suggestions — they are the operating system.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {DAILY_PRACTICES.map((dp) => (
              <div key={dp.title} style={{ background: "#fff", border: "1px solid rgba(72,187,120,0.15)", borderRadius: "8px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: "#1a1a2e", marginBottom: "1rem" }}>{dp.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {dp.items.map((item, i) => (
                    <li key={i} style={{ fontSize: "0.95rem", color: "#4a4a5a", lineHeight: 1.65, marginBottom: "0.5rem", paddingLeft: "1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#48bb78", fontSize: "0.8rem" }}>+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESSENTIAL READING */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>ESSENTIAL READING</p>
        <p style={{ fontSize: "1.05rem", color: "#4a4a5a", lineHeight: 1.7, marginBottom: "2rem" }}>
          The books that shaped this thinking. Not a comprehensive list — a curated one. Each title earned its place.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {READING_LIST.map((book) => (
            <div key={book.title} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#1a1a2e", margin: "0 0 0.25rem" }}>{book.title}</h4>
              <p style={{ ...label, fontSize: "0.6rem", color: "#7C3AED", margin: "0 0 0.5rem" }}>{book.author}</p>
              <p style={{ fontSize: "1rem", color: "#5a5a6a", lineHeight: 1.7, margin: 0 }}>{book.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section style={{ padding: "3rem 1.5rem 5rem", textAlign: "center", background: "#fafafa" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <Link href="/assessment" style={purpleBtn}>TAKE THE DIAGNOSTIC</Link>
          <Link href="/humanos/philosophy" style={ghostBtn}>THE PHILOSOPHY</Link>
        </div>
      </section>
    </HumanosLayout>
    </>);
}
