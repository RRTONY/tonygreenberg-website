import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ChevronLeft, Beaker } from "lucide-react";

/* ── Moroccan Riad 12 Design Tokens ── */
export const KAVA = {
  sand: "#F5EDD8",
  ink: "#1A1008",
  saffron: "#B86A28",
  cobalt: "#2A5AA0",
  terracotta: "#C84B2A",
  sandDark: "#1A1008",
  sandMuted: "#E8DCC4",
  saffronLight: "#D4923E",
  cobaltLight: "#4A7AC0",
} as const;

const NAV_ITEMS = [
  { path: "/kava", label: "Home", short: "Home" },
  { path: "/kava/origins", label: "Island Origins", short: "Origins" },
  { path: "/kava/interactions", label: "Drug Interactions", short: "Interactions" },
  { path: "/kava/science", label: "Kavalactone Science", short: "Science" },
  { path: "/kava/assessment", label: "PRI Assessment", short: "Assessment" },
  { path: "/kava/hawaii", label: "Hawaii ICE Crisis", short: "Hawaii" },
  { path: "/kava/myths", label: "Myths Debunked", short: "Myths" },
  { path: "/kava/caffeine", label: "Caffeine Interactions", short: "Caffeine" },
  { path: "/kava/products", label: "Product Index", short: "Products" },
  { path: "/kava/certification", label: "Facilitator Certification", short: "Certification" },
];

export default function KavaLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: KAVA.sand,
        color: KAVA.ink,
        fontFamily: "'DM Sans', 'Source Sans 3', sans-serif",
      }}
    >
      {/* ── Top Bar ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: KAVA.sand,
          borderColor: KAVA.sandMuted,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-14">
          {/* Back to main site */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: KAVA.ink }}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">TonyG</span>
          </Link>

          {/* Center brand */}
          <Link href="/kava" className="flex items-center gap-2">
            <Beaker size={20} style={{ color: KAVA.saffron }} />
            <span
              className="text-base font-bold tracking-wide"
              style={{
                fontFamily: "'Fraunces', serif",
                color: KAVA.ink,
              }}
            >
              PRI KAVA
            </span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop nav row */}
        <nav className="hidden lg:block border-t" style={{ borderColor: KAVA.sandMuted }}>
          <div className="max-w-7xl mx-auto px-5 flex items-center gap-1 overflow-x-auto py-1">
            {NAV_ITEMS.map((item) => {
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: active ? KAVA.saffron : "transparent",
                    color: active ? "#fff" : KAVA.ink,
                    opacity: active ? 1 : 0.7,
                  }}
                >
                  {item.short}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="lg:hidden border-t"
            style={{ borderColor: KAVA.sandMuted, backgroundColor: KAVA.sand }}
          >
            <div className="px-5 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = location === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-md text-base font-medium transition-colors"
                    style={{
                      backgroundColor: active ? KAVA.saffron : "transparent",
                      color: active ? "#fff" : KAVA.ink,
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t" style={{ borderColor: KAVA.sandMuted }}>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm font-medium opacity-60"
                  style={{ color: KAVA.ink }}
                >
                  Back to TonyGreenberg.com
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* ── Content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-8 px-5 text-center"
        style={{ borderColor: KAVA.sandMuted }}
      >
        <p
          className="text-sm font-medium mb-1"
          style={{ fontFamily: "'Fraunces', serif", color: KAVA.saffron }}
        >
          PRI Kava Framework v2.0
        </p>
        <p className="text-xs opacity-50" style={{ color: KAVA.ink }}>
          For facilitator training and research use. Not medical advice.
          <br />
          Consult a licensed medical professional before making any changes to medications or health protocols.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link
            href="/kava"
            className="text-xs font-medium underline opacity-50 hover:opacity-100"
            style={{ color: KAVA.ink }}
          >
            Kava Home
          </Link>
          <Link
            href="/pri"
            className="text-xs font-medium underline opacity-50 hover:opacity-100"
            style={{ color: KAVA.ink }}
          >
            Full PRI
          </Link>
          <Link
            href="/"
            className="text-xs font-medium underline opacity-50 hover:opacity-100"
            style={{ color: KAVA.ink }}
          >
            TonyGreenberg.com
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ── Shared UI primitives for Kava pages ── */

export function KavaHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="py-16 md:py-24 px-5">
      <div className="max-w-3xl mx-auto text-center">
        {eyebrow && (
          <p
            className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
            style={{ color: KAVA.saffron }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="font-bold leading-tight mb-4"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(36px, 8vw, 88px)",
            color: KAVA.ink,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: KAVA.ink, opacity: 0.7, lineHeight: 1.75 }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function KavaSection({
  children,
  className = "",
  bg,
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}) {
  return (
    <section
      className={`py-12 md:py-16 px-5 ${className}`}
      style={{ backgroundColor: bg || "transparent" }}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

export function KavaSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-bold mb-6"
      style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(24px, 4vw, 40px)",
        color: KAVA.ink,
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

export function KavaCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`rounded-xl p-6 transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5" : ""} ${className}`}
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${KAVA.sandMuted}`,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function KavaBadge({
  children,
  color = "saffron",
}: {
  children: React.ReactNode;
  color?: "saffron" | "cobalt" | "terracotta" | "green" | "red" | "amber" | "purple" | "teal";
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    saffron: { bg: "#B86A2820", text: KAVA.saffron },
    cobalt: { bg: "#2A5AA020", text: KAVA.cobalt },
    terracotta: { bg: "#C84B2A20", text: KAVA.terracotta },
    green: { bg: "#16a34a20", text: "#16a34a" },
    red: { bg: "#dc262620", text: "#dc2626" },
    amber: { bg: "#d9770620", text: "#d97706" },
    purple: { bg: "#7c3aed20", text: "#7c3aed" },
    teal: { bg: "#0d948820", text: "#0d9488" },
  };
  const c = colors[color] || colors.saffron;
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
}

export function KavaDivider() {
  return (
    <div
      className="my-8 mx-auto"
      style={{
        height: "2px",
        maxWidth: "120px",
        background: `linear-gradient(90deg, transparent, ${KAVA.saffron}, transparent)`,
      }}
    />
  );
}

export function KavaDisclaimer() {
  return (
    <div
      className="rounded-lg p-4 text-sm leading-relaxed mt-8"
      style={{
        backgroundColor: KAVA.sandMuted,
        color: KAVA.ink,
        opacity: 0.8,
        lineHeight: 1.75,
      }}
    >
      <strong>Disclaimer:</strong> For educational and harm reduction purposes.
      Consult a licensed medical professional before making any changes to
      medications or health protocols.
    </div>
  );
}
