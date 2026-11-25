"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Heart, Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { GlobalSearch } from "@/components/sake/global-search";
import { useAesthetic, useFavorites, useLanguage, useMode } from "@/components/sake/sake-providers";
import { sakeDropdowns, sakeMainLinks, sk, type SakeDropdownKey } from "@/lib/content/sake/nav";

// The Sake app's Navigation (client/src/components/Navigation.tsx): the fixed frosted bar with the
// 酒 logo, the 8 main links, the six menus, Subscribe, search (Cmd/Ctrl+K), the Kintsugi/Austere
// switch, Beginner/Connoisseur and EN/JP, plus the full-screen phone menu. Colors the app picked in
// JS per look are sake.css's --sk-* variables. framer-motion parts in CSS: the menus fade + slide
// 5px in (0.15s), the phone menu slides in from the right (0.25s), its sections open with a fade.
// Fixed from live (rule 20): menus close on Escape, the toggles have accessible names, and the
// Austere/Mode buttons that the app hid below 640px are in the phone menu (as the app also had). The
// app's one-row bar (8 links + 6 menus + controls) needs about 2,010px, so on every normal screen it
// wrapped labels and pushed the last menus and the controls off the edge: it shows from 2048px, and
// narrower screens use the app's own full menu behind the menu button (checked at 1280px, 2026-11-26).

const ACTIVE_LINK = "text-(--sk-accent) bg-(--sk-accent-soft)";
const IDLE_LINK = "text-(--sk-fg-muted) bg-transparent hover:text-(--sk-fg)";

export function SakeNav() {
  const { lang, toggleLang, t } = useLanguage();
  const { mode, toggleMode } = useMode();
  const { isAustere, toggleAesthetic } = useAesthetic();
  const { count: favCount } = useFavorites();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<SakeDropdownKey | null>(null);
  const [mobileSection, setMobileSection] = useState<SakeDropdownKey | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    // A new page: close the menus (adjusting state during render, CONTRIBUTING "What NOT to Do").
    setPrevPath(pathname);
    setMobileOpen(false);
    setMobileSection(null);
    setOpenDropdown(null);
  }

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isActive = (href: string) => pathname === sk(href);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 bg-(--sk-nav-bg) border-(--sk-border)">
        <div className="max-w-350 min-[2048px]:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16" ref={navRef}>
            {/* Logo */}
            <Link href={sk("/")} className="flex items-center gap-2.5 group shrink-0">
              <span className="font-sk-display text-2xl font-bold tracking-wider transition-colors text-(--sk-accent)">酒</span>
              <span className="font-sk-display hidden sm:block text-sm tracking-[0.12em] uppercase transition-colors text-(--sk-fg) font-semibold [.sake-austere_&]:font-light">
                {isAustere ? "酒のための酒" : "Sake for Sake's Sake"}
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden min-[2048px]:flex items-center gap-1">
              {sakeMainLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={sk(link.href)}
                    aria-current={active ? "page" : undefined}
                    className={`px-2.5 py-2 text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300 flex items-center gap-1.5 rounded-sm ${active ? ACTIVE_LINK : IDLE_LINK}`}
                  >
                    {link.href === "/favorites" && (
                      <Heart
                        aria-hidden="true"
                        size={12}
                        className={favCount > 0 ? "fill-(--sk-accent) stroke-(--sk-accent)" : "fill-none stroke-(--sk-accent)"}
                      />
                    )}
                    {t(link.en, link.ja)}
                    {link.href === "/favorites" && favCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-(--sk-accent-faint) text-(--sk-accent)">{favCount}</span>
                    )}
                  </Link>
                );
              })}

              {sakeDropdowns.map((dd) => {
                const active = dd.links.some((l) => isActive(l.href));
                const open = openDropdown === dd.key;
                return (
                  <div key={dd.key} className="relative">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenDropdown(open ? null : dd.key)}
                      className={`flex items-center gap-1 px-2.5 py-2 text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300 rounded-sm ${active ? ACTIVE_LINK : IDLE_LINK}`}
                    >
                      {t(dd.en, dd.ja)}
                      <ChevronDown aria-hidden="true" size={12} className={open ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                    </button>
                    {open && (
                      <div className="absolute top-full left-0 mt-1 py-2 min-w-50 border backdrop-blur-xl shadow-xl rounded-md bg-(--sk-drop-bg) border-(--sk-border) animate-in fade-in slide-in-from-top-1 duration-150">
                        {dd.links.map((link) => (
                          <Link
                            key={link.href}
                            href={sk(link.href)}
                            onClick={() => setOpenDropdown(null)}
                            aria-current={isActive(link.href) ? "page" : undefined}
                            className={`flex items-center px-4 py-2.5 text-xs tracking-[0.06em] uppercase transition-colors rounded-sm mx-1 ${isActive(link.href) ? ACTIVE_LINK : IDLE_LINK}`}
                          >
                            {t(link.en, link.ja)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={sk("/subscription")}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold tracking-[0.12em] uppercase transition-all duration-300 hover:scale-105 bg-linear-135 from-(--sk-accent-gradient-from) to-(--sk-accent-gradient-to) text-(--sk-on-accent) shadow-[0_2px_12px_var(--sk-accent-shadow)]"
              >
                <Sparkles aria-hidden="true" size={12} />
                Subscribe
              </Link>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={t("Search", "検索")}
                title="Search (⌘K)"
                className="flex items-center justify-center p-2 rounded-md border transition-all duration-300 border-(--sk-border) text-(--sk-fg-muted)"
              >
                <Search aria-hidden="true" size={16} />
              </button>
              <button
                type="button"
                onClick={toggleAesthetic}
                aria-pressed={isAustere}
                title={isAustere ? "Switch to Kintsugi Noir" : "Switch to Austere (枯山水)"}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md border transition-all duration-300 border-(--sk-border) text-(--sk-accent)"
              >
                {isAustere ? <Moon aria-hidden="true" size={14} /> : <Sun aria-hidden="true" size={14} />}
                <span className="text-[10px] tracking-widest uppercase font-medium">{isAustere ? "金継" : "枯山水"}</span>
              </button>
              <button
                type="button"
                onClick={toggleMode}
                aria-pressed={mode === "connoisseur"}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md border text-[10px] font-medium tracking-widest uppercase transition-all duration-300 border-(--sk-border) text-(--sk-fg-soft)"
              >
                <span
                  aria-hidden="true"
                  className={mode === "connoisseur" ? "size-2 rounded-full transition-colors bg-(--sk-accent)" : "size-2 rounded-full transition-colors bg-(--sk-dot-off)"}
                />
                <span>{t(mode === "beginner" ? "Beginner" : "Connoisseur", mode === "beginner" ? "初心者" : "通")}</span>
              </button>
              <button
                type="button"
                onClick={toggleLang}
                aria-label={lang === "en" ? "日本語に切り替え" : "Switch to English"}
                className="px-3 py-2 text-[10px] font-medium tracking-widest uppercase border rounded-md transition-all duration-300 border-(--sk-border)"
              >
                <span className={lang === "en" ? "text-(--sk-accent)" : "text-(--sk-fg-muted)"}>EN</span>
                <span className="mx-1 text-(--sk-fg-faint)">/</span>
                <span className={lang === "ja" ? "text-(--sk-accent)" : "text-(--sk-fg-muted)"}>JP</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? t("Close menu", "メニューを閉じる") : t("Open menu", "メニューを開く")}
                className="min-[2048px]:hidden flex items-center justify-center p-3 rounded-md text-(--sk-fg)"
              >
                {mobileOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Phone menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16 min-[2048px]:hidden overflow-y-auto bg-(--sk-mobile-bg) animate-in fade-in slide-in-from-right duration-250 ease-out">
          <div className="flex flex-col px-5 pt-4 pb-28">
            <div className="space-y-1">
              {sakeMainLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={sk(link.href)}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "font-sk-display flex items-center justify-between px-4 py-4 rounded-lg transition-colors text-lg font-semibold [.sake-austere_&]:font-normal text-(--sk-accent) bg-(--sk-accent-wash)"
                        : "font-sk-display flex items-center justify-between px-4 py-4 rounded-lg transition-colors text-lg font-semibold [.sake-austere_&]:font-normal text-(--sk-fg) bg-transparent"
                    }
                  >
                    <span className="flex items-center gap-3">
                      {link.href === "/favorites" && (
                        <Heart
                          aria-hidden="true"
                          size={18}
                          className={favCount > 0 ? "fill-(--sk-accent) stroke-(--sk-accent)" : "fill-none stroke-(--sk-accent)"}
                        />
                      )}
                      {t(link.en, link.ja)}
                    </span>
                    <ChevronRight aria-hidden="true" size={16} className="text-(--sk-fg-muted) opacity-50" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 space-y-1">
              {sakeDropdowns.map((dd) => {
                const open = mobileSection === dd.key;
                return (
                  <div key={dd.key}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setMobileSection(open ? null : dd.key)}
                      className={
                        open
                          ? "flex items-center justify-between w-full px-4 py-4 rounded-lg transition-colors text-(--sk-accent) bg-(--sk-accent-wash)"
                          : "flex items-center justify-between w-full px-4 py-4 rounded-lg transition-colors text-(--sk-accent) bg-transparent"
                      }
                    >
                      <span className="text-xs font-bold tracking-[0.2em] uppercase">{t(dd.en, dd.ja)}</span>
                      <ChevronDown aria-hidden="true" size={18} className={open ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                    </button>
                    {open && (
                      <div className="pl-4 pb-2 space-y-0.5 animate-in fade-in duration-200">
                        {dd.links.map((link) => {
                          const active = isActive(link.href);
                          return (
                            <Link
                              key={link.href}
                              href={sk(link.href)}
                              aria-current={active ? "page" : undefined}
                              className={
                                active
                                  ? "font-sans flex items-center px-4 py-3.5 rounded-lg text-base transition-colors text-(--sk-accent) bg-(--sk-accent-wash)"
                                  : "font-sans flex items-center px-4 py-3.5 rounded-lg text-base transition-colors text-(--sk-fg-muted) bg-transparent"
                              }
                            >
                              {t(link.en, link.ja)}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 px-4">
              <Link
                href={sk("/subscription")}
                className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-lg text-sm font-bold tracking-[0.12em] uppercase transition-all duration-300 bg-linear-135 from-(--sk-accent-gradient-from) to-(--sk-accent-gradient-to) text-(--sk-on-accent)"
              >
                <Sparkles aria-hidden="true" size={16} />
                {t("Subscribe — Monthly Sake Box", "定期便 — 月替わり酒箱")}
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 px-4">
              <button
                type="button"
                onClick={toggleAesthetic}
                aria-pressed={isAustere}
                className="flex-1 px-4 py-3.5 border rounded-lg text-sm tracking-[0.08em] font-medium transition-colors border-(--sk-border) text-(--sk-accent)"
              >
                {isAustere ? "金継ぎモード" : "枯山水モード"}
              </button>
              <button
                type="button"
                onClick={toggleMode}
                aria-pressed={mode === "connoisseur"}
                className="flex-1 px-4 py-3.5 border rounded-lg text-sm tracking-[0.08em] font-medium transition-colors border-(--sk-border) text-(--sk-fg-muted)"
              >
                {t(
                  mode === "beginner" ? "Switch to Connoisseur" : "Switch to Beginner",
                  mode === "beginner" ? "通モードへ" : "初心者モードへ",
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
