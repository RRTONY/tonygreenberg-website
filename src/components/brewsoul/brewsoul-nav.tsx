"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Menu, X } from "lucide-react";
import { BREWSOUL_ECOSYSTEM } from "@/lib/content/brewsoul-config";
import { BREWSOUL_TOTAL_PAGES } from "@/lib/content/brewsoul-directory";

const NAV_SECTIONS = [
  { label: "Home", path: "/brewsoul" },
  { label: "All Pages", path: "/brewsoul/directory", icon: ClipboardList },
  { label: "The First Sip", path: "/brewsoul/first-sip" },
  { label: "Quiz", path: "/brewsoul/quiz" },
  { label: "Catalog", path: "/brewsoul/browse" },
  { label: "Esoteric Index", path: "/brewsoul/esoteric" },
  { label: "Biodynamic", path: "/brewsoul/biodynamic" },
  { label: "Decaf Guide", path: "/brewsoul/decaf" },
  { label: "Health", path: "/brewsoul/health" },
  { label: "Prescription", path: "/brewsoul/prescription" },
  { label: "Varieties", path: "/brewsoul/varieties" },
  { label: "Processing", path: "/brewsoul/processing" },
  { label: "Roasters", path: "/brewsoul/roasters" },
  { label: "Farms", path: "/brewsoul/farms" },
  { label: "Mold-Free", path: "/brewsoul/mold-free" },
  { label: "Wall of Shame", path: "/brewsoul/wall-of-shame" },
  { label: "Follow $", path: "/brewsoul/follow-the-dollar" },
  { label: "Experiences", path: "/brewsoul/experiences" },
  { label: "Compare", path: "/brewsoul/compare" },
  { label: "Blend Builder", path: "/brewsoul/blend-builder" },
  { label: "Drops", path: "/brewsoul/drops" },
  { label: "Pairings", path: "/brewsoul/pairings" },
  { label: "Economics", path: "/brewsoul/economics" },
  { label: "Glossary", path: "/brewsoul/glossary" },
  { label: "Chain Rankings", path: "/brewsoul/chains" },
  { label: "City Rankings", path: "/brewsoul/cities" },
  { label: "Guest: Shanita Nicholas", path: "/brewsoul/guest/shanita-nicholas" },
  { label: "My Collection", path: "/brewsoul/my-coffees" },
];

// Ported from legacy client/src/pages/brewsoul/BrewSoulLayout.tsx's nav +
// footer. Real content/structure, unchanged, except: `TonyAvatarTrigger`
// (the FauxTony chatbot widget) is dropped — it's a Phase 10 feature that
// needs a real Claude API backend not built yet in this app, same
// "backend feature doesn't exist, don't fake it" call already made
// elsewhere in this migration. Revisit once Phase 10 ships. BrewSoul is a
// self-contained sub-site with its own coffee-brown/gold palette (see
// lib/content/brewsoul-config.ts) — deliberately not the main site's
// design tokens, so colors here are literal arbitrary-value Tailwind
// classes rather than brand-gold/etc.
export function BrewSoulNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (p: string) => (p === "/brewsoul" ? pathname === p : pathname.startsWith(p));

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[9999] flex h-13 items-center justify-between px-4 backdrop-blur-md transition-all sm:px-8 ${
          scrolled
            ? "border-b border-[#6F4E37]/10 bg-[#FAFAF7]/95"
            : "border-b border-transparent bg-[#FAFAF7]/80"
        }`}
      >
        <Link href="/brewsoul" className="flex items-center gap-2">
          <span className="font-heading text-[1.15rem] font-bold text-[#6F4E37]">BrewSoul</span>
          <span className="font-mono text-[0.6rem] tracking-widest text-[#C5A23C] uppercase opacity-80">
            Coffee Intelligence
          </span>
        </Link>

        <div className="hidden max-w-[50vw] gap-1 overflow-auto md:flex [scrollbar-width:none]">
          {NAV_SECTIONS.slice(0, 8).map((s) =>
            (() => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.path}
                  href={s.path}
                  className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1.5 font-sans text-[0.78rem] whitespace-nowrap ${
                    isActive(s.path)
                      ? "bg-[#6F4E37]/8 font-semibold text-[#6F4E37]"
                      : "text-[#6B5B4F]"
                  }`}
                >
                  {Icon && <Icon aria-hidden="true" className="size-3" />}
                  {s.label}
                </Link>
              );
            })(),
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-2.5 py-1.5 font-mono text-[0.72rem] text-[#C5A23C]"
          >
            More +
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1 font-mono text-[0.6rem] tracking-wide text-[#999] uppercase opacity-70 lg:flex"
          >
            Part of Find Your Me
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-xl text-[#6F4E37] md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-x-0 top-13 bottom-0 z-[9998] overflow-y-auto bg-[#FAFAF7]/98 p-6 backdrop-blur-2xl">
          <div className="mx-auto max-w-[600px]">
            <div className="mb-4 font-mono text-[0.68rem] tracking-[0.2em] text-[#C5A23C] uppercase">
              Navigate
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NAV_SECTIONS.map((s) => (
                <Link
                  key={s.path}
                  href={s.path}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md border border-[#6F4E37]/8 px-4 py-3 font-sans text-sm ${
                    isActive(s.path)
                      ? "bg-[#6F4E37]/10 font-semibold text-[#6F4E37]"
                      : "bg-[#6F4E37]/3 text-[#2C1810]"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 border-t border-[#6F4E37]/10 pt-6">
              <div className="mb-3 font-mono text-[0.68rem] tracking-[0.2em] text-[#C5A23C] uppercase">
                Ecosystem
              </div>
              {BREWSOUL_ECOSYSTEM.map((e) => (
                <a key={e.url} href={e.url} className="block py-2 font-sans text-sm text-[#6B5B4F]">
                  {e.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BrewSoulFooter() {
  return (
    <footer className="border-t border-[#6F4E37]/10 bg-[#F5F0E6] px-6 py-12 pb-8 text-center">
      <div className="mb-2 font-heading text-[1.1rem] text-[#6F4E37]">
        BrewSoul — The Coffee Intelligence Engine
      </div>
      <div className="mb-6 font-mono text-[0.68rem] tracking-[0.15em] text-[#999] uppercase">
        Every Cup Is a Vote
      </div>
      <Link
        href="/brewsoul/directory"
        className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#6F4E37]/20 bg-[#6F4E37]/4 px-6 py-2.5 font-mono text-[0.72rem] tracking-wide text-[#6F4E37] uppercase"
      >
        <ClipboardList aria-hidden="true" className="size-3.5" />
        See All {BREWSOUL_TOTAL_PAGES} Pages
      </Link>
      <div className="mb-6 flex flex-wrap justify-center gap-6">
        {BREWSOUL_ECOSYSTEM.map((e) => (
          <a
            key={e.url}
            href={e.url}
            className="font-mono text-[0.7rem] tracking-wide text-[#6F4E37] uppercase"
          >
            {e.label}
          </a>
        ))}
      </div>
      <div className="font-mono text-[0.62rem] tracking-wide text-[#BBB]">
        Original content. No copying from Cup of Excellence/ACE/third parties. All prices USD.
      </div>
    </footer>
  );
}
