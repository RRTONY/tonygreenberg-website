/**
 * BioChainCTA — routes business inquiries to ramprate.com/biochain
 * Used on every peptide, biohacking, and bio-sourcing page on tonygreenberg.com.
 * Per The Model: tonygreenberg.com = content engine. ramprate.com = business operations.
 */

interface BioChainCTAProps {
  variant?: "supplier" | "buyer" | "both";
  context?: string; // short sentence describing the page context
}

export function BioChainCTA({ variant = "both", context }: BioChainCTAProps) {
  return (
    <div
      style={{
        margin: "3rem 0",
        padding: "2.5rem 2rem",
        background: "linear-gradient(135deg, #F5F0E8 0%, #EDE4CC 100%)",
        borderLeft: "4px solid #8B5A2B",
        borderRadius: "2px",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "#8B5A2B",
          marginBottom: "0.6rem",
        }}
      >
        ✦ Verified Bio-Sourcing — BioChain by RampRate
      </div>
      <div
        style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: "1.4rem",
          fontStyle: "italic",
          color: "#2C1810",
          marginBottom: "0.75rem",
          lineHeight: 1.35,
        }}
      >
        {context
          ? context
          : "Supplier and buyer intake for peptides, stem cells, and exosomes lives at RampRate."}
      </div>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#4A2E1A",
          marginBottom: "1.5rem",
          lineHeight: 1.65,
          maxWidth: "600px",
        }}
      >
        This site is where you read and learn. Business engagement — supplier applications,
        buyer onboarding, CoA verification, and distribution partnerships — happens at
        ramprate.com/biochain.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
        {(variant === "supplier" || variant === "both") && (
          <a
            href="https://ramprate.com/biochain/supplier-intake"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#2C1810",
              color: "#F5F0E8",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              borderRadius: "2px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Supplier Application →
          </a>
        )}
        {(variant === "buyer" || variant === "both") && (
          <a
            href="https://ramprate.com/biochain/buyer-intake"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "transparent",
              color: "#2C1810",
              border: "1.5px solid #8B5A2B",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              borderRadius: "2px",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#EDE4CC")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Buyer / Distribution Partner →
          </a>
        )}
        <a
          href="https://ramprate.com/biochain"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "transparent",
            color: "#8B5A2B",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            textDecoration: "none",
            borderRadius: "2px",
          }}
        >
          BioChain Overview ↗
        </a>
      </div>
    </div>
  );
}
