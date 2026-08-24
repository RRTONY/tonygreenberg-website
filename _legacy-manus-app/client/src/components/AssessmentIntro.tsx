/**
 * AssessmentIntro — Reusable onboarding/landing screen for all assessments.
 * 
 * Provides a consistent, immersive intro that explains:
 * - What the assessment is
 * - How long it takes
 * - What they'll discover
 * - A compelling "Begin Assessment" CTA
 * 
 * Usage:
 *   <AssessmentIntro
 *     title="Find Your Diet"
 *     subtitle="Your body has been trying to tell you what it needs."
 *     description="Discover your unique nutritional archetype across 6 dimensions..."
 *     stats={{ questions: 15, dimensions: 6, minutes: 5 }}
 *     whatYouGet={["Your dietary archetype", "Personalized nutrition map", "Actionable next steps"]}
 *     accentColor="#7CB342"
 *     onBegin={() => setPhase('questions')}
 *   />
 */

interface AssessmentIntroProps {
  title: string;
  subtitle: string;
  description: string;
  stats: { questions: number; dimensions: number; minutes: number };
  whatYouGet: string[];
  accentColor: string;
  onBegin: () => void;
  heroImage?: string;
}

export default function AssessmentIntro({
  title,
  subtitle,
  description,
  stats,
  whatYouGet,
  accentColor,
  onBegin,
  heroImage,
}: AssessmentIntroProps) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(5rem, 8vw, 8rem) 1.5rem 4rem",
      }}
    >
      <div style={{ maxWidth: "640px", textAlign: "center" }}>
        {/* Hero Image — glassmorphic banner with glitch hover */}
        {heroImage && (
          <div
            className="glitch-hero"
            style={{
              position: "relative",
              marginBottom: "2.5rem",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: `0 8px 40px ${accentColor}33, 0 0 80px ${accentColor}11`,
            }}
          >
            <img
              src={heroImage}
              alt=""
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                filter: "brightness(0.85) contrast(1.1)",
              }}
            />
            <div className="glitch-scanlines" />
            <div className="glitch-tear" style={{ top: "30%" }} />
            <div className="glitch-tear" style={{ top: "65%" }} />
            {/* Glassmorphic overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, transparent 40%, ${accentColor}22 100%)`,
                backdropFilter: "blur(0.5px)",
              }}
            />
          </div>
        )}

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: accentColor,
            marginBottom: "1rem",
            opacity: 0.85,
          }}
        >
          A Tony Greenberg Assessment
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 400,
            color: "#2C1810",
            lineHeight: 1.1,
            margin: "0 0 1rem",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            color: "#5C4A3A",
            fontStyle: "italic",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          {subtitle}
        </p>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem",
            color: "#6B5B4F",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: "520px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {description}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            marginBottom: "2rem",
          }}
        >
          {[
            { num: stats.questions, label: "Questions" },
            { num: stats.dimensions, label: "Dimensions" },
            { num: `~${stats.minutes}`, label: "Minutes" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  color: accentColor,
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  color: "#8B7B6B",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* What You'll Discover */}
        <div
          style={{
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${accentColor}33`,
            borderRadius: "12px",
            padding: "1.5rem 2rem",
            marginBottom: "2.5rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: "0.75rem",
            }}
          >
            What You'll Discover
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {whatYouGet.map((item, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  color: "#4A3A2E",
                  paddingLeft: "1.25rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: accentColor,
                    fontWeight: 600,
                  }}
                >
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={onBegin}
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
            color: "#FAFAF7",
            border: "none",
            padding: "16px 56px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "14px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "all 0.3s ease",
            boxShadow: `0 4px 20px ${accentColor}44`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 8px 30px ${accentColor}66`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}44`;
          }}
        >
          Begin Assessment
        </button>

        {/* Privacy note */}
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            color: "#9B8B7B",
            marginTop: "1.5rem",
            letterSpacing: "0.1em",
          }}
        >
          Results stored locally. No data shared. Ever.
        </p>
      </div>
    </div>
  );
}
