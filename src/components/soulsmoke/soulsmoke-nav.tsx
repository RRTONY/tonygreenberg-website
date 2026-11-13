"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { useLanguage, useViewMode } from "@/components/soulsmoke/soulsmoke-providers";
import { soulsmokeImages } from "@/lib/content/soulsmoke/images";
import {
  soulsmokeExploreNav,
  soulsmokeMainNav,
  soulsmokeMoreNav,
  ss,
  type SoulsmokeNavItem,
} from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/components/Navigation.tsx, ViewModeToggle.tsx and
// LanguageToggle.tsx. Same look. Differences: the Explore/More dropdowns open on hover *and*
// keyboard focus and their links are always in the HTML (hidden until opened) so crawlers see
// them; the mobile menu's links are likewise rendered and only hidden while closed.

const logo = soulsmokeImages.soulsmokeLogo;

export function ViewModeToggle() {
  const { toggleMode, isSoulSmoke } = useViewMode();
  return (
    <button
      type="button"
      onClick={toggleMode}
      className={
        isSoulSmoke
          ? "flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[rgba(132,204,22,0.3)] whitespace-nowrap bg-[rgba(132,204,22,0.1)] px-3 py-1.5 text-xs font-medium text-[#84cc16] transition-all duration-300"
          : "flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.3)] whitespace-nowrap bg-[rgba(255,255,255,0.1)] px-3 py-1.5 text-xs font-medium text-[#e5e5e5] transition-all duration-300"
      }
      title={isSoulSmoke ? "Switch to Aficionado Mode" : "Switch to SoulSmoke Mode"}
      aria-label={isSoulSmoke ? "Switch to Aficionado Mode" : "Switch to SoulSmoke Mode"}
    >
      {isSoulSmoke ? (
        <>
          <Sparkles aria-hidden="true" className="size-3.5" />
          <span className="hidden sm:inline xl:hidden 2xl:inline">SoulSmoke</span>
        </>
      ) : (
        <>
          <BookOpen aria-hidden="true" className="size-3.5" />
          <span className="hidden sm:inline xl:hidden 2xl:inline">Aficionado</span>
        </>
      )}
    </button>
  );
}

// shrink-0 + whitespace-nowrap on both switches: in a tight header row the pill was squeezed and
// "ES" spilled past its border (2026-11-10).
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "es" : "en")}
      className="group flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 whitespace-nowrap transition-all duration-300 hover:bg-cream/20"
      title={language === "en" ? "Cambiar a Español" : "Switch to English"}
      aria-label={language === "en" ? "Cambiar a Español" : "Switch to English"}
    >
      <span
        className={
          language === "en"
            ? "font-mono text-xs tracking-wide text-lime-400 transition-colors"
            : "font-mono text-xs tracking-wide text-cream/50 transition-colors"
        }
      >
        EN
      </span>
      <span className="text-cream/30">/</span>
      <span
        className={
          language === "es"
            ? "font-mono text-xs tracking-wide text-lime-400 transition-colors"
            : "font-mono text-xs tracking-wide text-cream/50 transition-colors"
        }
      >
        ES
      </span>
    </button>
  );
}

function Dropdown({
  label,
  items,
  active,
  align,
  isActive,
  getLabel,
}: {
  label: string;
  items: SoulsmokeNavItem[];
  active: boolean;
  align: "left" | "right";
  isActive: (path: string) => boolean;
  getLabel: (item: SoulsmokeNavItem) => string;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={
          active
            ? "flex items-center gap-1 px-2 py-2 font-heading text-sm tracking-wide 2xl:px-3 whitespace-nowrap text-terracotta transition-all duration-300"
            : "flex items-center gap-1 px-2 py-2 font-heading text-sm tracking-wide 2xl:px-3 whitespace-nowrap text-cream/80 transition-all duration-300 hover:text-cream"
        }
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
        />
      </button>
      <div
        className={
          align === "left"
            ? "invisible absolute top-full left-0 mt-1 min-w-[180px] rounded-lg border border-cream/10 bg-earth/95 py-2 opacity-0 shadow-xl backdrop-blur-sm group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
            : "invisible absolute top-full right-0 mt-1 min-w-[180px] rounded-lg border border-cream/10 bg-earth/95 py-2 opacity-0 shadow-xl backdrop-blur-sm group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        }
      >
        {items.map((item) => (
          <Link
            key={item.path}
            href={ss(item.path)}
            className={
              isActive(item.path)
                ? "block cursor-pointer bg-cream/5 px-4 py-2 font-heading text-sm tracking-wide text-terracotta transition-colors"
                : "block cursor-pointer px-4 py-2 font-heading text-sm tracking-wide text-cream/80 transition-colors hover:bg-cream/5 hover:text-cream"
            }
          >
            {getLabel(item)}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({
  heading,
  items,
  isActive,
  getLabel,
  onNavigate,
}: {
  heading: string;
  items: SoulsmokeNavItem[];
  isActive: (path: string) => boolean;
  getLabel: (item: SoulsmokeNavItem) => string;
  onNavigate: () => void;
}) {
  return (
    <div className="py-2">
      <div className="px-4 py-2 font-mono text-xs tracking-wider text-cream/40">{heading}</div>
      {items.map((item) => (
        <Link
          key={item.path}
          href={ss(item.path)}
          onClick={onNavigate}
          className={
            isActive(item.path)
              ? "block cursor-pointer border-b border-cream/5 bg-cream/5 px-6 py-3 font-heading text-sm tracking-wide text-terracotta"
              : "block cursor-pointer border-b border-cream/5 px-6 py-3 font-heading text-sm tracking-wide text-cream/80"
          }
        >
          {getLabel(item)}
        </Link>
      ))}
    </div>
  );
}

export function SoulsmokeNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { language } = useLanguage();

  // Close the mobile menu after navigating (adjust state during render, not in an effect).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const getLabel = (item: SoulsmokeNavItem) => (language === "es" ? item.labelEs : item.label);
  const isActive = (path: string) => pathname === ss(path);
  const isInExplore = soulsmokeExploreNav.some((item) => isActive(item.path));
  const isInMore = soulsmokeMoreNav.some((item) => isActive(item.path));

  return (
    <>
      {/* Desktop Navigation */}
      <nav aria-label="SoulSmoke" className="fixed top-0 right-0 left-0 z-50 hidden xl:block">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-earth/90 via-earth/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4 2xl:gap-6">
            {/* shrink-0: the flex row squeezed the logo link narrower than "SOULSMOKE", so the wordmark ran over the menu (2026-11-10). */}
            <Link href={ss("/")} className="flex shrink-0 cursor-pointer items-center gap-3 transition-opacity hover:opacity-80">
              <Image src={logo.src} alt="" width={40} height={40} className="size-10" priority />
              <span className="font-display text-xl tracking-wider whitespace-nowrap text-cream 2xl:text-2xl">SOULSMOKE</span>
            </Link>

            <div className="flex items-center gap-1">
              {soulsmokeMainNav.map((item) => (
                <Link
                  key={item.path}
                  href={ss(item.path)}
                  className={
                    isActive(item.path)
                      ? "relative cursor-pointer px-2 py-2 font-heading text-sm tracking-wide 2xl:px-3 whitespace-nowrap text-terracotta transition-all duration-300"
                      : "relative cursor-pointer px-2 py-2 font-heading text-sm tracking-wide 2xl:px-3 whitespace-nowrap text-cream/80 transition-all duration-300 hover:text-cream"
                  }
                >
                  {getLabel(item)}
                  {isActive(item.path) && <span className="absolute right-2 bottom-0 left-2 h-px bg-terracotta 2xl:right-3 2xl:left-3" />}
                </Link>
              ))}

              <Dropdown
                label={language === "es" ? "Explorar" : "Explore"}
                items={soulsmokeExploreNav}
                active={isInExplore}
                align="left"
                isActive={isActive}
                getLabel={getLabel}
              />
              <Dropdown
                label={language === "es" ? "Más" : "More"}
                items={soulsmokeMoreNav}
                active={isInMore}
                align="right"
                isActive={isActive}
                getLabel={getLabel}
              />

              <div className="ml-2 shrink-0">
                <ViewModeToggle />
              </div>
              <div className="ml-2 shrink-0">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav aria-label="SoulSmoke mobile" className="fixed top-0 right-0 left-0 z-50 xl:hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-earth/95 to-earth/80" />
        <div className="relative flex items-center justify-between gap-3 px-4 py-3">
          <Link href={ss("/")} className="flex shrink-0 items-center gap-2">
            <Image src={logo.src} alt="" width={32} height={32} className="size-8" priority />
            <span className="font-display text-lg tracking-wider whitespace-nowrap text-cream sm:text-xl">SOULSMOKE</span>
          </Link>
          {/* Below 640px the two switches live at the top of the opened menu: in the bar they ran
              over the menu button (2026-11-10). */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <ViewModeToggle />
              <LanguageToggle />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex size-11 items-center justify-center text-cream"
              aria-expanded={mobileMenuOpen}
              aria-controls="soulsmoke-mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
            </button>
          </div>
        </div>

        <div
          id="soulsmoke-mobile-menu"
          className={
            mobileMenuOpen
              ? "absolute top-full right-0 left-0 max-h-[80vh] overflow-y-auto border-t border-cream/10 bg-earth/98"
              : "hidden"
          }
        >
          <div className="flex items-center gap-2 border-b border-cream/10 px-4 py-3 sm:hidden">
            <ViewModeToggle />
            <LanguageToggle />
          </div>
          <MobileGroup
            heading={language === "es" ? "EL VIAJE" : "THE JOURNEY"}
            items={soulsmokeMainNav}
            isActive={isActive}
            getLabel={getLabel}
            onNavigate={() => setMobileMenuOpen(false)}
          />
          <MobileGroup
            heading={language === "es" ? "EXPLORAR" : "EXPLORE"}
            items={soulsmokeExploreNav}
            isActive={isActive}
            getLabel={getLabel}
            onNavigate={() => setMobileMenuOpen(false)}
          />
          <MobileGroup
            heading={language === "es" ? "REFERENCIA" : "REFERENCE"}
            items={soulsmokeMoreNav}
            isActive={isActive}
            getLabel={getLabel}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </div>
      </nav>
    </>
  );
}
