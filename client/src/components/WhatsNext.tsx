import { Link } from "wouter";

/**
 * WhatsNext — "What's Next?" CTA section at the bottom of assessment pages.
 * Supports both dark and light page backgrounds via the isDark prop.
 * Default: light background (dark text).
 */
export default function WhatsNext({ isDark = false }: { isDark?: boolean }) {
  const links = [
    { label: "Take Another Assessment", href: "/find-my", icon: "→" },
    { label: "Read Related Essays", href: "/blog", icon: "→" },
    { label: "Explore the Ecosystem", href: "/ecosystem", icon: "→" },
  ];

  const headingColor = isDark ? "#D4B96A" : "#8B6914";
  const eyebrowColor = isDark ? "#D4B96A" : "#8B6914";
  const linkTextColor = isDark ? "#D4B96A" : "#5A4510";
  const linkBg = isDark ? "rgba(212,185,106,0.08)" : "rgba(139,105,20,0.06)";
  const linkBorder = isDark ? "rgba(212,185,106,0.2)" : "rgba(139,105,20,0.25)";
  const sectionBg = isDark ? "rgba(212,185,106,0.04)" : "rgba(139,105,20,0.04)";
  const sectionBorder = isDark ? "rgba(212,185,106,0.12)" : "rgba(139,105,20,0.15)";

  return (
    <div style={{
      /* Section-level spacing: 64-96px */
      marginTop: "clamp(4rem, 6vw, 6rem)",
      padding: "clamp(3rem, 5vw, 4rem) 2rem",
      background: sectionBg,
      borderTop: `1px solid ${sectionBorder}`,
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: eyebrowColor,
        marginBottom: "1.5rem",
      }}>
        The Journey Continues
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.4rem",
        fontWeight: 400,
        color: headingColor,
        marginBottom: "2rem",
      }}>
        What's Next?
      </h3>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        alignItems: "center",
      }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: linkBg,
              border: `1px solid ${linkBorder}`,
              color: linkTextColor,
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "all 0.25s ease",
              width: "300px",
              maxWidth: "100%",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {l.icon} {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
