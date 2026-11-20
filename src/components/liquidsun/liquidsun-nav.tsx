"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";
import { liquidsunMenu, ls, type LiquidsunNavItem, type LiquidsunNavSection } from "@/lib/content/liquidsun/nav";

// Ported from the LiquidSun app's client/src/components/Navigation.tsx and LanguageToggle.tsx
// (2026-11-21): same four dropdowns, Premium pill and EN/ES switch. Rendered once by the layout
// (the app's Home also rendered it a second time, stacking two fixed bars; not repeated here).
// Fixed from live (rule 20): the dropdowns also open on keyboard focus and click, not only
// mouse hover; the hamburger has a label; links close the phone menu.

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "es" : "en")}
      className="flex min-h-9 items-center gap-1.5 rounded-none border border-primary/30 bg-background/50 px-3 py-1.5 transition-colors hover:bg-primary/10"
      title={language === "en" ? "Cambiar a Español" : "Switch to English"}
      aria-label={language === "en" ? "Cambiar a Español" : "Switch to English"}
    >
      <span
        className={
          language === "en"
            ? "font-mono text-xs font-bold tracking-wide text-primary transition-colors"
            : "font-mono text-xs tracking-wide text-muted-foreground transition-colors"
        }
      >
        EN
      </span>
      <span className="text-muted-foreground/30">/</span>
      <span
        className={
          language === "es"
            ? "font-mono text-xs font-bold tracking-wide text-primary transition-colors"
            : "font-mono text-xs tracking-wide text-muted-foreground transition-colors"
        }
      >
        ES
      </span>
    </button>
  );
}

export function LiquidsunNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { language } = useLanguage();

  // A new page closes the menus (adjusting state during render, not in an effect).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }

  const getLabel = (item: LiquidsunNavItem) => (language === "es" ? item.labelEs : item.label);
  const getTitle = (section: LiquidsunNavSection) => (language === "es" ? section.titleEs : section.title);
  const isActive = (path: string) => pathname === ls(path);

  return (
    <>
      {/* Desktop Navigation */}
      <nav aria-label="LiquidSun" className="fixed top-0 right-0 left-0 z-50 hidden lg:block">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={ls("/")} className="flex shrink-0 cursor-pointer items-center gap-3 transition-opacity hover:opacity-80">
              <span className="font-serif text-2xl tracking-widest text-amber-500 uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                LiquidSun
              </span>
            </Link>

            <div className="flex items-center gap-8">
              {liquidsunMenu.map((section) => {
                const open = activeDropdown === section.title;
                return (
                  <div
                    key={section.title}
                    className="group relative"
                    onMouseEnter={() => setActiveDropdown(section.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onFocus={() => setActiveDropdown(section.title)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActiveDropdown(null);
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      // Click only opens: on a touch screen at lg+ a tap fires mouseenter (open) and
                      // then click, so a toggle here would shut the menu at once. It closes on
                      // mouse leave, focus leaving it, or Escape.
                      onClick={() => setActiveDropdown(section.title)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setActiveDropdown(null);
                      }}
                      className={
                        open
                          ? "flex items-center gap-1 px-2 py-1 font-sans text-sm tracking-widest text-amber-400 uppercase transition-colors"
                          : "flex items-center gap-1 px-2 py-1 font-sans text-sm tracking-widest text-slate-300 uppercase transition-colors hover:text-amber-400"
                      }
                    >
                      {getTitle(section)}
                      <ChevronDown
                        aria-hidden="true"
                        className={open ? "size-3 rotate-180 transition-transform" : "size-3 transition-transform"}
                      />
                    </button>

                    <div
                      className={
                        open
                          ? "visible absolute top-full left-1/2 mt-2 w-56 origin-top -translate-x-1/2 scale-100 rounded-sm border border-amber-500/20 bg-slate-900/95 py-4 opacity-100 shadow-2xl backdrop-blur-xl transition-all duration-200"
                          : "invisible absolute top-full left-1/2 mt-2 w-56 origin-top -translate-x-1/2 scale-95 rounded-sm border border-amber-500/20 bg-slate-900/95 py-4 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200"
                      }
                    >
                      <div className="absolute top-0 left-1/2 -mt-2 size-4 -translate-x-1/2 rotate-45 border-t border-l border-amber-500/20 bg-slate-900" />
                      <div className="relative flex flex-col gap-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.path}
                            href={ls(item.path)}
                            aria-current={isActive(item.path) ? "page" : undefined}
                            className={
                              isActive(item.path)
                                ? "block cursor-pointer border-l-2 border-amber-500 bg-amber-500/10 px-6 py-2 text-sm font-light tracking-wide text-amber-400 transition-all"
                                : "block cursor-pointer border-l-2 border-transparent px-6 py-2 text-sm font-light tracking-wide text-slate-400 transition-all hover:bg-white/5 hover:text-amber-200"
                            }
                          >
                            {getLabel(item)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link
                href={ls("/premium")}
                className="ml-2 cursor-pointer rounded-full bg-amber-600/90 px-4 py-1.5 font-mono text-[10px] tracking-widest text-black uppercase shadow-lg shadow-amber-500/10 transition-all hover:bg-amber-500 hover:shadow-amber-500/20"
              >
                Premium
              </Link>

              <div className="ml-4 border-l border-slate-700 pl-4">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav aria-label="LiquidSun" className="fixed top-0 right-0 left-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={ls("/")} className="font-serif text-xl tracking-widest text-amber-500 uppercase">
            LiquidSun
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center text-amber-100"
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 flex max-h-[80vh] flex-col gap-6 overflow-y-auto border-b border-slate-800 bg-slate-950 p-4 shadow-2xl">
            {liquidsunMenu.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="mb-2 border-b border-slate-800 pb-2 text-xs font-bold tracking-[0.2em] text-amber-500 uppercase">
                  {getTitle(section)}
                </h3>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      href={ls(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={isActive(item.path) ? "block text-base font-light text-amber-200" : "block text-base font-light text-slate-400"}
                    >
                      {getLabel(item)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href={ls("/premium")}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 block w-full rounded-sm bg-amber-600 py-3 text-center font-mono text-xs tracking-widest text-black uppercase"
            >
              Go Premium
            </Link>
            <div className="mt-4 border-t border-slate-800 pt-4">
              <LanguageToggle />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
