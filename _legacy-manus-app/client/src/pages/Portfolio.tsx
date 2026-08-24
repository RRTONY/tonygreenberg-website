/*
 * DESIGN: The Folio — Editorial Broadsheet
 * Portfolio / "Things I've Built" page
 * Showcases sites built by Tony — warm, inviting, clickable
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Zap, BookOpen, Shield, Beaker, Wine, Droplets, Heart, Briefcase, Gamepad2 } from "lucide-react";
import SEO from "@/components/SEO";

const projects = [
  {
    title: "Human OS V2.0",
    tagline: "Are you a Maximizer or a Satisficer?",
    description:
      "An interactive diagnostic that maps your decision-making operating system. Take the quiz, get your profile, understand how you process the world.",
    url: "/humanos",
    category: "Interactive Diagnostic",
    accent: "#059669",
    icon: Gamepad2,
  },
  {
    title: "Find Your Team (The Flow Circuit)",
    tagline: "Team performance, decoded.",
    description:
      "A framework for understanding how high-performing teams actually work. Maps the invisible circuitry of collaboration, conflict, and creative output.",
    url: "/flow-circuit",
    category: "Find Your ___ Ecosystem",
    accent: "#4A90D9",
    icon: Zap,
  },
  {
    title: "The Gem Spark",
    tagline: "When serendipity meets synchronicity.",
    description:
      "A long-form narrative essay exploring the intersection of chance encounters and meaningful coincidence. The kind of piece that makes you reconsider every accident in your life.",
    url: "https://serensynch-2agjfwhe.manus.space",
    category: "Narrative Essay",
    accent: "#D97706",
    icon: BookOpen,
  },
  {
    title: "FusionRamp / STRATUM",
    tagline: "The Alloy of Vision and Velocity.",
    description:
      "Web3 adoption infrastructure — bridging the gap between blockchain's promise and enterprise reality. Built to accelerate the transition from proof-of-concept to production.",
    url: "/humanos",
    category: "Web3 Infrastructure",
    accent: "#DC2626",
    icon: Globe,
  },
  {
    title: "Homeaglow Exposed",
    tagline: "When the cleaning service gets dirty.",
    description:
      "A consumer crusade documenting deceptive practices in the home cleaning industry. Investigative journalism meets personal advocacy.",
    url: "/homeaglow-the-anatomy-of-a-consumer-fraud",
    category: "Consumer Crusade",
    accent: "#B91C1C",
    icon: Shield,
  },
  {
    title: "SoulSmoke",
    tagline: "The Alchemy of Agave.",
    description:
      "A deep dive into mezcal — not the drink, the culture. From the jimador's machete to the copper still, from the terroir of Oaxaca to the ritual of the copita.",
    url: "https://mezcalagave-ahru9fq8.manus.space",
    category: "Agave Education",
    accent: "#92400E",
    icon: Wine,
  },
  {
    title: "LiquidSun",
    tagline: "Tequila, illuminated.",
    description:
      "A visual guide to tequila that treats the spirit with the reverence it deserves. From highland agave fields to the barrel. Not a buying guide. A love letter.",
    url: "https://tequilaazul-fxqrr3js.manus.space",
    category: "Tequila Guide",
    accent: "#B45309",
    icon: Wine,
  },
  {
    title: "Aqueous",
    tagline: "Know what flows through your life.",
    description:
      "The world's first personalized water rating. The AWI scores every bottled water on Quality, Purity, and Resonance — weighted to your priorities. Tap water lookup, Wall of Shame, and a filter guide that actually helps.",
    url: "https://aqwaterqpr-wvzsc3ph.manus.space",
    category: "Water Intelligence",
    accent: "#0369A1",
    icon: Droplets,
  },
  {
    title: "Regenerative Protocol",
    tagline: "The body knows how to heal. You just forgot.",
    description:
      "A restricted-access portal for regenerative health protocols — biohacking meets ancient wisdom. Serious science behind a password.",
    url: "https://regenhealth-4nns6jnd.manus.space",
    category: "Regenerative Health",
    accent: "#047857",
    icon: Heart,
  },
  {
    title: "Vancefolio",
    tagline: "Family office intelligence, enforced.",
    description:
      "A password-protected portfolio enforcement dashboard built for a family office. Tiered access controls, session management, and confidential analytics.",
    url: "https://portfoliofamilyoffice.manus.space",
    category: "Family Office / DD",
    accent: "#7C3AED",
    icon: Briefcase,
  },
  {
    title: "Intimacy Intelligence (UIIA)",
    tagline: "The science of sacred partnership.",
    description:
      "A 15-question assessment mapping your intimacy intelligence across five dimensions — presence, vulnerability, attunement, repair, and sacred play. Built from the research behind Love as Dharma.",
    url: "https://intimacyassess-tcir3hon.manus.space",
    category: "Relationship Assessment",
    accent: "#C4536A",
    icon: Heart,
  },
];

export default function Portfolio() {
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="Built by Tony G | Tony Greenberg"
        description="A living portfolio of digital creation. Eleven sites, eleven ideas that needed a home."
        path="/recent-creations"
        indexable={true}
      />

      {/* ── HERO — compact, warm, no dark block ── */}
      <section
        className="px-8 pt-12 pb-8"
        style={{
          background: "linear-gradient(180deg, #F5F0E6 0%, #FAFAF7 100%)",
          borderBottom: "1px solid rgba(139,105,20,0.12)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/">
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  color: "#8B6914",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                ← Back to The Broadsheet
              </span>
            </Link>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                fontWeight: 700,
                color: "#0A0A10",
                lineHeight: 1.15,
                marginTop: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Built by Tony G
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.1rem",
                color: "#555",
                maxWidth: "540px",
                lineHeight: 1.7,
              }}
            >
              Eleven ideas that needed a home. Each one built in days,
              not months. Click any card to explore.
            </p>

            {/* ─── CONTEXTUAL INTRO ─── */}
            <div style={{
              background: "rgba(139,105,20,0.04)",
              border: "1px solid rgba(139,105,20,0.12)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              maxWidth: "540px",
              marginTop: "1.25rem",
            }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, marginBottom: "0.6rem" }}>
                <strong style={{ color: "#8B6914" }}>What you're looking at:</strong> A living portfolio of digital products Tony has designed and shipped — interactive diagnostics, educational platforms, consumer investigations, and intelligence engines. Each one is a standalone site you can use right now.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, marginBottom: "0.6rem" }}>
                <strong style={{ color: "#8B6914" }}>Why it matters:</strong> These aren't mockups or pitch decks. Every card links to a working product. They demonstrate a specific thesis: that meaningful software can be built in days when the thinking has been done in decades.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, margin: 0 }}>
                <strong style={{ color: "#8B6914" }}>What to do:</strong> Click any card to open the live site. Categories range from health diagnostics to agave education to consumer advocacy. Start with whatever catches your eye.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => {
              const Icon = project.icon;
              return (
                <motion.a
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline group"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div
                    className="relative overflow-hidden transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* ── Top bar with icon + category ── */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        background: `linear-gradient(135deg, ${project.accent}08 0%, transparent 100%)`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "6px",
                            background: `${project.accent}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={16} style={{ color: project.accent }} />
                        </div>
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.72rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: project.accent,
                          }}
                        >
                          {project.category}
                        </span>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="opacity-30 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: project.accent }}
                      />
                    </div>

                    {/* ── Content ── */}
                    <div style={{ padding: "1.5rem" }}>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          color: "#111",
                          marginBottom: "0.4rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {project.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.78rem",
                          color: project.accent,
                          marginBottom: "0.8rem",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {project.tagline}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.95rem",
                          color: "#666",
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
                        {project.description}
                      </p>

                      {/* ── Visit prompt ── */}
                      <div
                        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          color: project.accent,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        VISIT SITE <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA — warm, not dark ── */}
      <section
        className="py-10 px-8 text-center"
        style={{
          background: "linear-gradient(180deg, #FAFAF7 0%, #F5F0E6 100%)",
          borderTop: "1px solid rgba(139,105,20,0.1)",
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.15rem",
            color: "#333",
            marginBottom: "1rem",
            maxWidth: "480px",
            margin: "0 auto 1rem",
          }}
        >
          "The best way to understand someone is to see what they build."
        </p>
        <Link
          href="/"
          className="inline-block no-underline px-6 py-2.5 transition-all duration-200 hover:scale-105"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "#8B6914",
            color: "#fff",
            borderRadius: "4px",
          }}
        >
          Back to The Broadsheet
        </Link>
      </section>
    </div>
  );
}
