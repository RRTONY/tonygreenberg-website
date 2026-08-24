/**
 * THE PHILOSOPHY — /the-philosophy
 * Tony Greenberg's "Diode of Perception" passage with
 * a "What This Means" interpretive section and links to all instruments.
 */

import { useEffect } from "react";
import SEO from "@/components/SEO";

const PASSAGE = [
  {
    text: "The diode of perception tethering movement to bone accelerates the other fundamental processes of life.",
    italic: false,
  },
  {
    text: "Beyond hunger, what you think of as necessity or craving is automatically fulfilled in the quickening of the senses — as spirit reaches in to taste the body.",
    italic: true,
  },
  {
    text: "Things of the past and future, things that you touch for pleasure — the pleasure is what electrical current you offer that thing.",
    italic: false,
  },
  {
    text: "If it is a living body — animal or human — it knows your love as you embrace its presence with your energetic breath: the waves of awareness stemming from that which you control your body from spirit.",
    italic: true,
  },
  {
    text: "The sharpening of will takes place as the simplicity of life — the places where your awareness cannot escape the body to forget itself in idle pastures, but remains alive in the sensation of time slowing across the curve of heartbeat weaving breath.",
    italic: false,
  },
];

const WHAT_THIS_MEANS = [
  {
    heading: "You are the instrument",
    body: "Every readiness assessment on this site begins with the same premise: the medicine does not change you. It reveals the condition of the instrument — which is you. The diode of perception is that instrument. Before any ceremony, any protocol, any facilitator conversation, the question is not \"what will this do to me?\" It is \"what is the current state of the thing being played?\"",
  },
  {
    heading: "Readiness is not a checklist",
    body: "Most people approach psychedelic preparation like a pre-flight safety card — boxes to tick, warnings to acknowledge, then buckle up. That misses the point entirely. Readiness is the quality of your attention. It is whether spirit can move through bone without getting lost. The Psychedelic Readiness Index and the Facilitator Index exist to map that quality, not to gatekeep it.",
  },
  {
    heading: "The electrical current is your intention",
    body: "\"The pleasure is what electrical current you offer that thing.\" Intention is not a wish. It is a charge. What you bring into a ceremony — the quality of your desire, the honesty of your grief, the clarity of your question — is the voltage that determines what the experience can do. A weak or dishonest intention produces a weak or confused result. A clean one produces a clean one.",
  },
  {
    heading: "Time slowing is the signal",
    body: "When time slows across the curve of heartbeat weaving breath, you are no longer in ordinary consciousness. You are in the space where integration actually happens — where the nervous system can rewire, where old patterns can be seen from outside, where the body and spirit negotiate a new agreement. That space is not created by the medicine. The medicine reveals whether you were already capable of entering it.",
  },
  {
    heading: "Why this matters for facilitation",
    body: "A facilitator who has not felt time slow in their own body cannot hold space for someone else entering that state. This is the philosophical foundation of the Facilitator Index: 108 questions designed to surface whether a practitioner has genuinely inhabited the territory they are guiding others through — or whether they are navigating from a map they have never walked.",
  },
];

const INSTRUMENTS = [
  { label: "Psychedelic Readiness Index", path: "/psychedelic-readiness-index", desc: "38 medicines. 50+ questions. Your readiness profile." },
  { label: "Facilitator Index", path: "/facilitator-index", desc: "108-item assessment for practitioners and seekers evaluating fit." },
  { label: "Medicine Sequencing", path: "/medicine-sequencing", desc: "The spectrum ladder — don't skip rungs." },
  { label: "Three Friends Gate", path: "/friend-gate", desc: "Permission from the people who know you best." },
];

export default function ThePhilosophy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="The Philosophy — Tony Greenberg"
        description="The Diode of Perception: Tony Greenberg's philosophical foundation for psychedelic readiness, facilitation, and consciousness work."
        path="/the-philosophy"
        indexable={true}
      />

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0A0C14 0%, #0F0A1A 40%, #0D1008 100%)",
          color: "#F4F0E8",
          fontFamily: "'Playfair Display', Georgia, serif",
          padding: "0 0 6rem",
        }}
      >
        {/* ── Hero ── */}
        <div
          style={{
            position: "relative",
            padding: "6rem 1.5rem 4rem",
            textAlign: "center",
            borderBottom: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 300,
              background: "radial-gradient(ellipse at center, rgba(107,33,168,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "#c9a84c",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: "1.5rem",
            }}
          >
            Tony Greenberg
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: "1rem",
              color: "#F4F0E8",
            }}
          >
            The Diode of Perception
          </h1>
          <p
            style={{
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              color: "rgba(244,240,232,0.45)",
              fontFamily: "sans-serif",
              letterSpacing: "0.06em",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            The philosophical foundation of every readiness instrument on this site.
          </p>
        </div>

        {/* ── Passage ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "4rem 1.5rem 0" }}>
          {PASSAGE.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: "clamp(1.05rem, 2.8vw, 1.25rem)",
                lineHeight: 1.9,
                marginBottom: "1.75rem",
                color: `rgba(244,240,232,${0.95 - i * 0.04})`,
                fontStyle: para.italic ? "italic" : "normal",
                position: "relative",
              }}
            >
              {i === 0 && (
                <span
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 3.2rem)",
                    lineHeight: 0.85,
                    float: "left",
                    marginRight: "0.1em",
                    marginTop: "0.08em",
                    color: "#c9a84c",
                    fontWeight: 800,
                  }}
                >
                  T
                </span>
              )}
              {i === 0 ? para.text.slice(1) : para.text}
            </p>
          ))}

          {/* Attribution */}
          <div
            style={{
              textAlign: "right",
              fontSize: "0.75rem",
              color: "rgba(244,240,232,0.35)",
              fontFamily: "sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: "0.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            — Tony Greenberg
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            maxWidth: 680,
            margin: "4rem auto",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)",
          }}
        />

        {/* ── What This Means ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              color: "#c9a84c",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: "0.75rem",
            }}
          >
            Interpretation
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#F4F0E8",
              marginBottom: "3rem",
              lineHeight: 1.2,
            }}
          >
            What This Means
          </h2>

          {WHAT_THIS_MEANS.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: "2.75rem",
                paddingLeft: "1.25rem",
                borderLeft: "2px solid rgba(201,168,76,0.3)",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                  fontWeight: 700,
                  color: "#c9a84c",
                  marginBottom: "0.6rem",
                  letterSpacing: "0.01em",
                }}
              >
                {item.heading}
              </h3>
              <p
                style={{
                  fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
                  lineHeight: 1.85,
                  color: "rgba(244,240,232,0.75)",
                  fontFamily: "'DM Sans', sans-serif",
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            maxWidth: 680,
            margin: "3rem auto",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)",
          }}
        />

        {/* ── Instruments ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              color: "#c9a84c",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: "0.75rem",
            }}
          >
            The Instruments
          </div>
          <h2
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
              fontWeight: 800,
              color: "#F4F0E8",
              marginBottom: "1.75rem",
              letterSpacing: "-0.01em",
            }}
          >
            Put the philosophy to work
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {INSTRUMENTS.map((inst) => (
              <a
                key={inst.path}
                href={inst.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.1rem 1.25rem",
                  background: "rgba(244,240,232,0.04)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  textDecoration: "none",
                  transition: "background 0.2s, border-color 0.2s",
                  gap: "1rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,168,76,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(244,240,232,0.04)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.15)";
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                      fontWeight: 700,
                      color: "#F4F0E8",
                      fontFamily: "sans-serif",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {inst.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(244,240,232,0.45)",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {inst.desc}
                  </div>
                </div>
                <span style={{ color: "#c9a84c", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            maxWidth: 680,
            margin: "5rem auto 0",
            padding: "0 1.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "rgba(244,240,232,0.25)",
              fontFamily: "sans-serif",
              letterSpacing: "0.08em",
              lineHeight: 1.8,
            }}
          >
            © 2026 Tony Greenberg. All rights reserved.
            <br />
            tonygreenberg.com/the-philosophy
          </div>
        </div>
      </div>
    </>
  );
}
