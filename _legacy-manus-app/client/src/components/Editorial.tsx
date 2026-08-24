import { motion } from "framer-motion";

export function Divider() {
  return (
    <div
      className="mx-auto divider-glow"
      style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent, #C5A23C, transparent)",
      }}
    />
  );
}

export function Spacer() {
  return <div style={{ height: "1.5rem" }} />;
}

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={className}
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
        fontWeight: 400,
        lineHeight: 1.25,
        color: "#111",
        marginBottom: "1rem",
      }}
    >
      {children}
    </h2>
  );
}

export function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.45rem",
        fontWeight: 700,
        color: "#111",
        margin: "2.5rem 0 1rem",
      }}
    >
      {children}
    </h3>
  );
}

export function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.28rem",
        fontStyle: "normal",
        lineHeight: 1.75,
        color: "#111",
        padding: "2.2rem 2.8rem",
        borderLeft: "4px solid #C5A23C",
        background: "linear-gradient(135deg, #F7F3EA 0%, #F0ECE0 100%)",
        margin: "2.5rem 0",
        borderRadius: "0 6px 6px 0",
        boxShadow: "0 2px 20px rgba(139,105,20,0.06)",
      }}
    >
      {children}
    </blockquote>
  );
}

export function InlineQuote({
  children,
  attr,
}: {
  children: React.ReactNode;
  attr?: string;
}) {
  return (
    <div
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.15rem",
        
        lineHeight: 1.7,
        color: "#111",
        padding: "1.5rem 2rem",
        borderLeft: "3px solid #D4B96A",
        background: "linear-gradient(135deg, #F7F3EA 0%, #F0ECE0 100%)",
        margin: "2rem 0",
        borderRadius: "0 6px 6px 0",
      }}
    >
      {children}
      {attr && (
        <span
          style={{
            display: "block",
            fontStyle: "normal",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            color: "#8B6914",
            marginTop: "0.5rem",
            textTransform: "uppercase",
          }}
        >
          {attr}
        </span>
      )}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.78rem",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "#8B6914",
        marginBottom: "1.5rem",
      }}
    >
      {children}
    </div>
  );
}

export function NextPage({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div className="text-center py-8">
      <a
        href={href}
        className="no-underline inline-block transition-all duration-250"
        style={{
          color: "#8B6914",
          border: "1px solid rgba(139,105,20,0.3)",
          padding: "0.6rem 1.5rem",
          borderRadius: "24px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.88rem",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#8B6914";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#8B6914";
        }}
      >
        {label} &rarr;
      </a>
    </div>
  );
}

export function HeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="relative overflow-hidden" style={{ height: "clamp(280px, 45vh, 420px)" }}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full block"
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
      />
      {/* Top gradient for nav readability */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "120px",
          background: "linear-gradient(180deg, rgba(250,250,247,0.7) 0%, rgba(250,250,247,0.3) 50%, transparent 100%)",
        }}
      />
      {/* Bottom gradient for content transition */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "80px",
          background: "linear-gradient(0deg, #FAFAF7 0%, transparent 100%)",
        }}
      />
      {/* Trust watermark */}
      <div
        className="absolute bottom-6 right-8"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
          color: "rgba(139,105,20,0.5)",
        }}
      >
        Est. 2003 &bull; Only Time Buys Trust
      </div>
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function AdageStrip({
  adages,
}: {
  adages: { text: string; attr: string }[];
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0A0A10 0%, #111118 100%)",
        padding: "2rem 1.5rem",
        margin: "1.5rem 0",
        borderTop: "1px solid rgba(212,185,106,0.15)",
        borderBottom: "1px solid rgba(212,185,106,0.15)",
      }}
    >
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        {adages.map((adage, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "normal",
              fontSize: "1.28rem",
              color: "#F5F0E0",
              lineHeight: 1.65,
              padding: "1.2rem 0",
              borderBottom:
                i < adages.length - 1
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "none",
            }}
          >
            {adage.text}
            <span
              style={{
                display: "block",
                fontStyle: "normal",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                color: "#D4B96A",
                marginTop: "0.4rem",
                textTransform: "uppercase",
              }}
            >
              {adage.attr}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
