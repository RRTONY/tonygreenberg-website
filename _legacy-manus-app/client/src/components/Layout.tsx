import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Linkedin, Sun, Moon, ChevronDown } from "lucide-react";

function XLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { TonyAvatarTrigger } from "@/components/TonyAvatarTrigger";
import { NotificationBell } from "@/components/NotificationBell";
import StartHereBanner from "@/components/StartHereBanner";
import ExitIntentTony from "@/components/ExitIntentTony";
import { NavTooltip, MobileHelper, DropdownOrientationFooter } from "@/components/NavClarifiers";
import { ReadingStreakBadge } from "@/components/EngagementFeatures";
import WhereNext from "@/components/WhereNext";

/* Primary nav */
const primaryNavLinks = [
  { href: "/blog", label: "Read" },
  { href: "/find-my", label: "Fix Myself" },
  { href: "/amplifier", label: "Fix My Company" },
  { href: "/engage", label: "Build With Me" },
];

/* Categorized mega-menu groups */
const navCategories = [
  {
    title: "Find Yourself",
    items: [
      { href: "/find-my", label: "Find My" },
      { href: "/my-journey", label: "Dashboard" },
      { href: "/self-portrait", label: "Self-Portrait" },
      { href: "/ecosystem-map", label: "Ecosystem Map" },
      { href: "/humanos", label: "Human OS 2.0", foundation: "/living-declaration" },
    ],
  },
  {
    title: "Read",
    items: [
      { href: "/articles", label: "All 119 Essays" },
      { href: "/the-letter", label: "The Letter" },
      { href: "/attention-theft", label: "Attention Theft Manifesto" },
      { href: "/blog/the-restaurant-with-no-menu-prices-ai-ethics-manifesto", label: "AI Ethics Manifesto" },
      { href: "/published", label: "Published" },
      { href: "/series", label: "Series" },
      { href: "/the-nightstand", label: "The Nightstand" },
    ],
  },
  {
    title: "Explore",
    items: [
      { href: "/walk-through", label: "Walk Through" },
      { href: "/the-territory", label: "The Territory" },
      { href: "/the-index", label: "The Index" },
      { href: "/the-web", label: "The Web" },
      { href: "/framework", label: "Framework" },
      { href: "/soulscore", label: "SoulScore™" },
      { href: "/impact-dashboard", label: "Impact Dashboard" },
    ],
  },
  {
    title: "Engage",
    items: [
      { href: "/amplifier", label: "The Amplifier" },
      { href: "/diamond-cut", label: "The Diamond Cut" },
      { href: "/invest", label: "Invest (ABIT Waitlist)" },
      { href: "/shop", label: "Shop" },
      { href: "/subscribe", label: "Subscribe" },
      { href: "/engage", label: "Enter The Gate" },
      { href: "/pick-up-the-phone", label: "Connect" },
    ],
  },
  {
    title: "The Work",
    items: [
      { href: "/engine-room", label: "Engine Room" },
      { href: "/under-nda", label: "Under NDA" },
      { href: "/intel", label: "Intel" },
      { href: "/impact-dashboard", label: "Impact Dashboard" },
      { href: "/clients", label: "The Rolodex" },
      { href: "/recent-creations", label: "Built by Tony G" },
    ],
  },
  {
    title: "Body & Spirit",
    items: [
      { href: "/the-body", label: "The Body" },
      { href: "/spirits", label: "The Liquid Library" },
      { href: "/brewsoul", label: "BrewSoul (Coffee)" },
      { href: "/kava", label: "Kava Encyclopedia" },
      { href: "/journeys", label: "Journeys" },
      { href: "/fauxtony", label: "FauxTony" },
    ],
  },
  {
    title: "The Crusades",
    items: [
      { href: "/attention-theft", label: "Attention Theft" },
      { href: "/attention-theft/weapons", label: "The 10 Weapons" },
      { href: "/attention-theft/report", label: "Report A Spammer" },
      { href: "/attention-theft/legal", label: "Legal Database" },
      { href: "/attention-theft/blocker-finder", label: "AI Blocker Finder" },
    ],
  },
];

/* Flat list for mobile and active-state checks */
const secondaryNavLinks = navCategories.flatMap((c) => c.items);
const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks.filter(l => !primaryNavLinks.some(p => p.href === l.href))];

const socialLinks = [
  { href: "https://x.com/ThinkTony", icon: XLogo, label: "X" },
  { href: "https://linkedin.com/in/tonygreenberg", icon: Linkedin, label: "LinkedIn" },
];

/* ── FIND YOUR ME DROPDOWN ── */
const findYourMeExperiences = [
  {
    category: "Know Thyself",
    color: "#D4B96A",
    items: [
      { href: "/find-my", label: "Find My", badge: "Start" },
      { href: "/my-journey", label: "My Journey", badge: "Dashboard" },
      { href: "/self-portrait", label: "Self-Portrait", badge: "5+ Assessments" },
      { href: "/assessments/dharma-finder", label: "Find Your Purpose" },
      { href: "/the-mirror", label: "Find Your Mirror" },
      { href: "/assessments/consciousness-scale", label: "Find Your Level" },
      { href: "/assessments/grant-study", label: "Find Your Score" },
      { href: "/find-your-spirit", label: "Find Your Spirit" },
    ],
  },
  {
    category: "Love & Belonging",
    color: "#C97B7B",
    items: [
      { href: "https://intimacyassess-tcir3hon.manus.space", label: "Find Your Partner", ext: true },
      { href: "/community", label: "Find Your Tribe" },
      { href: "/flow-circuit", label: "Find Your Team", ext: true },
      { href: "/find-your-attachment-style", label: "Find Your Attachment Style" },
      { href: "/find-your-love-language", label: "Find Your Love Language" },
      { href: "/find-your-sexuality", label: "Find Your Sexuality" },
    ],
  },
  {
    category: "Body & Temple",
    color: "#7BC9A4",
    items: [
      { href: "https://regenhealth-4nns6jnd.manus.space", label: "Find Your Chemistry", ext: true },
      { href: "https://aqwaterqpr-wvzsc3ph.manus.space", label: "Find Your Water", ext: true },
      { href: "/find-your-diet", label: "Find Your Diet" },
      { href: "/find-your-movement", label: "Find Your Movement" },
      { href: "/find-your-sleep", label: "Find Your Sleep" },
    ],
  },
  {
    category: "Taste & Ritual",
    color: "#C9A87B",
    items: [
      { href: "https://mezcalagave-ahru9fq8.manus.space", label: "Find Your Mezcal", ext: true },
      { href: "https://tequilaazul-fxqrr3js.manus.space", label: "Find Your Tequila", ext: true },
      { href: "/find-your-sake", label: "Find Your Sake" },
      { href: "/find-your-coffee", label: "Find Your Coffee" },
      { href: "/brewsoul", label: "BrewSoul Intelligence" },
      { href: "/brewsoul/chains", label: "Chain Rankings" },
      { href: "/find-your-kitchen", label: "Find Your Kitchen" },
    ],
  },
  {
    category: "Mind & Systems",
    color: "#7BA8C9",
    items: [
      { href: "/living-declaration", label: "Find Your Blueprint" },
      { href: "https://portfoliofamilyoffice.manus.space", label: "Find Your Capital", ext: true },
      { href: "/find-your-peptide", label: "Find Your Peptide" },
      { href: "/peptide-supply-chain", label: "Peptide: Follow the $" },
      { href: "/peptide-hall-of-shame", label: "Peptide: Hall of Shame" },
      { href: "/peptide-matrix", label: "Peptide: Review vs Evidence" },
      { href: "/quiz_25q", label: "Peptide: 25-Q Literacy Quiz" },
      { href: "/peptide-watch", label: "PeptideWatch: Safety Guide" },
      { href: "/find-your-therapy", label: "Find Your Therapy" },
      { href: "/find-your-religion", label: "Find Your Religion" },
      { href: "/find-your-style", label: "Find Your Style" },
      { href: "/soulscore", label: "SoulScore™ Impact" },
    ],
  },
];

function FindYourMeDropdown({ isDark, location }: { isDark: boolean; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = location === "/find-my" || location === "/find-your-me" || location.startsWith("/find-your-") || location.startsWith("/find-my");

  return (
    <li ref={ref} className="relative m-0 p-0">
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.78rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          color: isActive ? "#D4B96A" : (isDark ? "#bbb" : "#555"),
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.2rem",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#8B6914")}
        onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#D4B96A" : (isDark ? "#bbb" : "#555"))}
      >
        Fix Myself <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: "50%",
            transform: "translateX(-50%)",
            background: isDark ? "#1a1a22" : "#fff",
            border: "1px solid rgba(74, 29, 107,0.15)",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            padding: "1.25rem",
            zIndex: 200,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "0.25rem 1rem",
            minWidth: "680px",
          }}
        >
          {findYourMeExperiences.map((cat) => (
            <div key={cat.category} style={{ padding: "0.25rem 0" }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: cat.color,
                  marginBottom: "0.4rem",
                  paddingBottom: "0.3rem",
                  borderBottom: `1px solid ${cat.color}33`,
                }}
              >
                {cat.category}
              </div>
              {cat.items.map((link) => {
                const isExt = 'ext' in link && link.ext;
                const Tag = isExt ? 'a' : Link;
                const props = isExt
                  ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: link.href };
                return (
                  <Tag
                    key={link.href}
                    {...(props as any)}
                    onClick={() => setOpen(false)}
                    className="no-underline block"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase" as const,
                      color: location === link.href ? "#D4B96A" : (isDark ? "#ccc" : "#555"),
                      textDecoration: "none",
                      padding: "0.25rem 0",
                      transition: "color 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    {link.label}
                    {'badge' in link && link.badge && (
                      <span style={{
                        fontSize: "0.45rem",
                        background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                        color: "#0A0A10",
                        padding: "1px 4px",
                        borderRadius: "3px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                      }}>
                        {link.badge}
                      </span>
                    )}
                    {isExt && (
                      <span style={{ fontSize: "0.5rem", opacity: 0.4 }}>↗</span>
                    )}
                  </Tag>
                );
              })}
            </div>
          ))}
          {/* Sitemap link at bottom */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid rgba(74, 29, 107,0.1)", paddingTop: "0.5rem", marginTop: "0.25rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "center" }}>
            <Link
              href="/find-my"
              onClick={() => setOpen(false)}
              className="no-underline"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                textDecoration: "none",
              }}
            >
              View All Assessments →
            </Link>
            <Link
              href="/walk-through"
              onClick={() => setOpen(false)}
              className="no-underline"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: isDark ? "#888" : "#999",
                textDecoration: "none",
              }}
            >
              Start Here → 90-second orientation
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

/* ── MEGA MENU DROPDOWN ── */
function MegaMenu({ isDark, location }: { isDark: boolean; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = secondaryNavLinks.some((l) => location === l.href);

  return (
    <li ref={ref} className="relative m-0 p-0">
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.78rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          color: isActive ? "#D4B96A" : (isDark ? "#bbb" : "#555"),
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.2rem",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#8B6914")}
        onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#D4B96A" : (isDark ? "#bbb" : "#555"))}
      >
        Explore <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            background: isDark ? "#1a1a22" : "#fff",
            border: "1px solid rgba(74, 29, 107,0.15)",
            borderRadius: "8px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            padding: "1rem",
            zIndex: 200,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.25rem 1.5rem",
            minWidth: "540px",
          }}
        >
          {navCategories.map((cat) => (
            <div key={cat.title} style={{ padding: "0.5rem 0" }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  marginBottom: "0.4rem",
                  paddingBottom: "0.3rem",
                  borderBottom: "1px solid rgba(74, 29, 107,0.15)",
                }}
              >
                {cat.title}
              </div>
              {cat.items.map((link) => (
                <NavTooltip key={link.href} href={link.href} isDark={isDark}>
                <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="no-underline block"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase" as const,
                    color: location === link.href ? "#D4B96A" : (isDark ? "#ccc" : "#555"),
                    textDecoration: "none",
                    padding: "0.3rem 0",
                    transition: "color 0.15s",
                    display: "block",
                  }}
                >
                  {link.label}
                </Link>
                {'foundation' in link && link.foundation && (
                  <div style={{ display: "flex", alignItems: "stretch", marginTop: "0.1rem", marginBottom: "0.1rem" }}>
                    <div style={{ width: "1px", background: "rgba(139,105,20,0.3)", marginLeft: "0.4rem", marginRight: "0.5rem", flexShrink: 0 }} />
                    <Link
                      href={link.foundation as string}
                      onClick={() => setOpen(false)}
                      className="no-underline block"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.03em",
                        textTransform: "uppercase" as const,
                        color: location === link.foundation ? "#D4B96A" : (isDark ? "#aaa" : "#777"),
                        textDecoration: "none",
                        padding: "0.2rem 0",
                        transition: "color 0.15s",
                        display: "block",
                      }}
                    >
                      ↳ A Living Declaration
                    </Link>
                  </div>
                )}
                </div>
                </NavTooltip>
              ))}
            </div>
          ))}
          <DropdownOrientationFooter isDark={isDark} onClose={() => setOpen(false)} />
        </div>
      )}
    </li>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Standalone pages: no header/footer chrome
  const standaloneRoutes = ["/find-your-me", "/find-my", "/discover"];
  const isStandalone = standaloneRoutes.some(r => location === r || location.startsWith(r + "/"));

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen" style={{ background: isDark ? "#0A0A10" : "#FAFAF7", transition: "background-color 0.5s ease", overflowX: "hidden" as const }}>
      <StartHereBanner />
      <ExitIntentTony />

      {/* Skip to content - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-[#8B6914] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Subtle grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* NAV + mobile menu — hidden on standalone pages */}
      {!isStandalone && (<><nav
        className="sticky z-[100] flex items-center justify-between transition-all duration-300"
        style={{
          top: "var(--start-banner-h, 0px)",
          background: scrolled
            ? (isDark ? "rgba(10,10,16,0.95)" : "rgba(250,250,247,0.95)")
            : (isDark ? "rgba(10,10,16,0.88)" : "rgba(250,250,247,0.88)"),
          backdropFilter: "blur(20px) saturate(1.8)",
          WebkitBackdropFilter: "blur(20px) saturate(1.8)",
          borderBottom: "1px solid rgba(74, 29, 107,0.15)",
          padding: scrolled ? "0.4rem 1rem" : "0.6rem 1rem",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.04)" : "none",
          minHeight: 56,
          gap: "0.5rem",
        }}
      >
        {/* Logo — shrinks on mobile, never wraps */}
        <Link
          href="/"
          className="no-underline flex items-center gap-2 flex-shrink-0"
          style={{ textDecoration: "none", minWidth: 0 }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.15rem",
              color: isDark ? "#F5F0E0" : "#111",
              whiteSpace: "nowrap",
            }}
          >
            Tony<span style={{ color: "#8B6914" }}>G</span>
          </span>
          <span
            className="hidden lg:inline xl:hidden 2xl:inline"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#999",
              borderLeft: "1px solid rgba(74, 29, 107,0.3)",
              paddingLeft: "0.6rem",
              marginLeft: "0.3rem",
              whiteSpace: "nowrap",
            }}
          >
            Only Time Buys Trust
          </span>
        </Link>
        {/* Streak badge — desktop only in center, on mobile it moves to right group */}
        <span className="hidden xl:inline-flex flex-shrink-0">
          <ReadingStreakBadge />
        </span>

        {/* Desktop nav */}
        <ul className="hidden xl:flex list-none gap-4 items-center m-0 p-0">
          {primaryNavLinks.map((link: { href: string; label: string }) => {
            // Replace the plain Find Your Me link with the dropdown
            if (link.href === "/find-my") {
              return <FindYourMeDropdown key={link.href} isDark={isDark} location={location} />;
            }
            return (
              <li key={link.href} className="m-0 p-0">
                <NavTooltip href={link.href} isDark={isDark}>
                <Link
                  href={link.href}
                  className="no-underline transition-colors duration-200"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    color: location === link.href ? "#D4B96A" : (isDark ? "#bbb" : "#555"),
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#8B6914")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      location === link.href ? "#8B6914" : "#555")
                  }
                >
                  {link.label}
                </Link>
                </NavTooltip>
              </li>
            );
          })}
          {/* More dropdown for secondary pages */}
          <MegaMenu isDark={isDark} location={location} />
          {/* Search + Social icons in desktop nav */}
          <li className="flex items-center gap-2 ml-2 border-l border-[rgba(74, 29, 107,0.2)] pl-3">
            <TonyAvatarTrigger isDark={isDark} />
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: isDark ? "#aaa" : "#999" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4B96A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? "#aaa" : "#999")}
              >
                <s.icon size={14} />
              </a>
            ))}
            {/* Notification bell */}
            <NotificationBell isDark={isDark} />
            {/* Dark mode toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="transition-all duration-300"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: isDark ? "#D4B96A" : "#999",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4B96A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? "#D4B96A" : "#999")}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
          </li>
        </ul>

        {/* Mobile search + hamburger */}
        <div className="xl:hidden flex items-center gap-1 flex-shrink-0 relative z-[102]">
          <span className="flex-shrink-0">
            <ReadingStreakBadge />
          </span>
          <TonyAvatarTrigger isDark={isDark} />
          <NotificationBell isDark={isDark} />
          <button
            className="flex items-center justify-center flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              color: isDark ? "#F5F0E0" : "#111",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 44,
              height: 44,
              padding: 0,
              minWidth: 44,
            }}
          >
            {mobileOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden fixed inset-0 z-[101]"
            style={{
              background: isDark ? "rgba(10,10,16,0.98)" : "rgba(250,250,247,0.98)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          >
            <div
              className="flex flex-col items-center justify-center h-full"
              style={{ paddingTop: "60px" }}
            >
              {/* Primary nav links */}
              <div className="w-full max-w-sm overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)", paddingBottom: "1rem" }}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.3 }}
                  className="mb-5"
                >
                  {primaryNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="no-underline block py-2.5 px-4 text-center transition-all duration-200"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "1rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase" as const,
                        fontWeight: 700,
                        color: location === link.href ? "#D4B96A" : (isDark ? "#F5F0E0" : "#222"),
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(74, 29, 107,0.08)",
                      }}
                    >
                      {link.label}
                      <MobileHelper href={link.href} />
                    </Link>
                  ))}
                </motion.div>

                <div style={{ borderTop: "1px solid rgba(74, 29, 107,0.15)", marginBottom: "1rem" }} />

                {/* Categorized nav links */}
                {navCategories.map((cat, ci) => (
                  <motion.div
                    key={cat.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.08, duration: 0.3 }}
                    className="mb-4"
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "#8B6914",
                        textAlign: "center",
                        padding: "0.5rem 1rem 0.25rem",
                      }}
                    >
                      {cat.title}
                    </div>
                    {cat.items.map((link) => (
                      <div key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="no-underline block py-2 px-4 text-center transition-all duration-200"
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.9rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase" as const,
                          color: location === link.href ? "#D4B96A" : (isDark ? "#ddd" : "#333"),
                          textDecoration: "none",
                          borderBottom: 'foundation' in link && link.foundation ? "none" : "1px solid rgba(74, 29, 107,0.05)",
                        }}
                      >
                        {link.label}
                        <MobileHelper href={link.href} />
                      </Link>
                      {'foundation' in link && link.foundation && (
                        <Link
                          href={link.foundation as string}
                          onClick={() => setMobileOpen(false)}
                          className="no-underline block py-1.5 text-center transition-all duration-200"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.72rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase" as const,
                            color: location === link.foundation ? "#D4B96A" : (isDark ? "#aaa" : "#888"),
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(74, 29, 107,0.05)",
                            paddingLeft: "2rem",
                          }}
                        >
                          ↳ A Living Declaration
                        </Link>
                      )}
                      </div>
                    ))}
                  </motion.div>
                ))}
                {/* Mobile orientation footer */}
                <div style={{ textAlign: "center", padding: "1rem 0 0.5rem", borderTop: "1px solid rgba(74, 29, 107,0.1)", marginTop: "0.5rem" }}>
                  <Link
                    href="/walk-through"
                    onClick={() => setMobileOpen(false)}
                    className="no-underline"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: "#999",
                      textDecoration: "none",
                    }}
                  >
                    Start Here → 90-second orientation
                  </Link>
                </div>
              </div>

              {/* Social links in mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mt-8"
              >
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 no-underline"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#8B6914",
                    }}
                  >
                    <s.icon size={18} />
                    {s.label}
                  </a>
                ))}
              </motion.div>

              {/* Trust motif */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  
                  fontSize: "0.85rem",
                  color: "#999",
                }}
              >
                Only time buys trust.
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>)}

      {/* Page content */}
      <main id="main-content" role="main">{children}</main>

      {/* Where Next — contextual navigation suggestions */}
      {!isStandalone && <WhereNext isDark={isDark} />}

      {/* Footer — hidden on standalone pages */}
      {!isStandalone && <footer
        className="text-center py-8 px-6"
        style={{
          background: isDark ? "linear-gradient(180deg, #0A0A10 0%, #111118 100%)" : "linear-gradient(180deg, #FAFAF7 0%, #F0ECE0 100%)",
          borderTop: "1px solid rgba(74, 29, 107,0.15)",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            
            fontSize: "1.1rem",
            color: isDark ? "#F5F0E0" : "#111",
            marginBottom: "1rem",
          }}
        >
          Only time buys trust. The gold is in the cracks.
          <br />
          <strong style={{ fontStyle: "normal" }}>
            — Tony "WhyNot" Greenberg
          </strong>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.82rem",
            color: "#555",
            marginBottom: "1rem",
          }}
        >
          t@ramprate.com
          <br />
          Santa Monica, CA
        </div>
        {/* BioChain routing note */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            color: isDark ? "rgba(212,185,106,0.6)" : "#8B5A2B",
            marginBottom: "1.5rem",
            padding: "0.6rem 1rem",
            border: isDark ? "1px solid rgba(212,185,106,0.15)" : "1px solid rgba(139,90,43,0.2)",
            borderRadius: "2px",
            display: "inline-block",
          }}
        >
          Supplier &amp; buyer intake &rarr;{" "}
          <a
            href="https://ramprate.com/biochain"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: isDark ? "#D4B96A" : "#8B5A2B", textDecoration: "underline" }}
          >
            ramprate.com/biochain
          </a>
        </div>

        {/* Social links in footer */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://x.com/ThinkTony"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 no-underline transition-all duration-200 hover:scale-105"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#8B6914",
            }}
          >
            <XLogo size={20} />
          </a>
          <a
            href="https://linkedin.com/in/tonygreenberg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 no-underline transition-all duration-200 hover:scale-105"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#8B6914",
            }}
          >
            <Linkedin size={20} />
          </a>
        </div>

        <div className="flex justify-center gap-3 flex-wrap mb-6">
          <a
            href="https://linktr.ee/TonyG2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-sm font-semibold no-underline transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8B6914 0%, #6B3D99 100%)",
              color: "#fff",
              borderRadius: "24px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              boxShadow: "0 2px 10px rgba(74, 29, 107,0.2)",
            }}
          >
            Book Time with Me
          </a>
          <a
            href="https://impactsoul.is"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-sm no-underline transition-all duration-200 hover:scale-105"
            style={{
              border: "1.5px solid #8B6914",
              color: "#8B6914",
              borderRadius: "24px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            Explore ImpactSoul
          </a>
          <a
            href="https://ramprate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-sm no-underline transition-all duration-200 hover:scale-105"
            style={{
              border: "1.5px solid #8B6914",
              color: "#8B6914",
              borderRadius: "24px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            RampRate
          </a>
        </div>
        <div
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.8rem",
            color: "#777",
          }}
        >
          CEO,{" "}
          <a href="https://ramprate.com" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>RampRate</a>
          {" "}&bull;{" "}Founder,{" "}
          <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>ImpactSoul</a>
          {" "}&bull; Co-Founder, Menagerie
          <br />
          <a href="https://linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>LinkedIn</a>
          {" "}&bull;{" "}
          <a href="https://x.com/ThinkTony" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>X</a>
          {" "}&bull;{" "}
          <a href="https://linkedin.com/company/ramprate" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>RampRate LinkedIn</a>
          {" "}&bull;{" "}
          <a href="https://linkedin.com/company/impactsoul" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>ImpactSoul LinkedIn</a>
          {" "}&bull; Certified B Corporation
        </div>

        {/* ── COPYRIGHT & LEGAL ── */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.2rem",
            borderTop: "1px solid rgba(74, 29, 107,0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.08em",
              color: "#888",
              lineHeight: 1.8,
            }}
          >
            &copy; {new Date().getFullYear()} Tony Greenberg. All rights reserved.
            <br />
            All content, essays, frameworks, assessments, and intellectual property
            on this site are the exclusive property of Tony Greenberg and/or RampRate, Inc.
            <br />
            Unauthorized reproduction, scraping, mirroring, or redistribution is
            strictly prohibited and subject to legal action under the DMCA and applicable law.
            <br />
            <span style={{ color: "#666", marginTop: "0.3rem", display: "inline-block" }}>
              Protected by automated content monitoring. Violations are logged and reported.
            </span>
          </div>
        </div>
      </footer>}
    </div>
  );
}
