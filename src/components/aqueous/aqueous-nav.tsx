"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Droplets, Menu, X } from "lucide-react";
import { aq, aqueousMainLinks, aqueousMoreLinks } from "@/lib/content/aqueous/nav";

// The Aqueous app's Navigation (client/src/components/Navigation.tsx): frosted-glass bar, the 8 main
// links, the "More" dropdown and the mobile menu, same classes. framer-motion parts in CSS: the
// active link's underline (layoutId spring) fades in under the link; the dropdown and mobile menu
// enter with the app's fade + 4px/8px slide (0.15s / 0.2s). Fixed from live (rule 20): "More" also
// opens on keyboard focus and tap (it was hover-only), Escape closes it, and the mobile menu scrolls
// when it's taller than the screen.

const allLinks = [...aqueousMainLinks, ...aqueousMoreLinks];

export function AqueousNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    // A new page: close both menus (adjusting state during render, CONTRIBUTING "What NOT to Do").
    setPrevPath(pathname);
    setMobileOpen(false);
    setMoreOpen(false);
  }

  const isActive = (href: string) => pathname === aq(href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-border/40">
        <div className="container flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href={aq("/")} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Droplets aria-hidden="true" className="w-5 h-5 text-primary" />
            </div>
            <span className="font-aq-display text-xl font-semibold tracking-tight">Aqueous</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {aqueousMainLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={aq(link.href)}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors text-primary"
                      : "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full animate-in fade-in duration-300" />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
              onFocus={() => setMoreOpen(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMoreOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMoreOpen(false);
              }}
            >
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((o) => !o)}
                className={
                  aqueousMoreLinks.some((l) => isActive(l.href))
                    ? "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-primary"
                    : "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              >
                More{" "}
                <ChevronDown aria-hidden="true" className={moreOpen ? "w-3.5 h-3.5 transition-transform rotate-180" : "w-3.5 h-3.5 transition-transform"} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 py-2 rounded-xl glass-card border border-border/40 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  {aqueousMoreLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={aq(link.href)}
                        aria-current={active ? "page" : undefined}
                        className={
                          active
                            ? "block px-4 py-2 text-sm font-medium transition-colors text-primary bg-primary/5"
                            : "block px-4 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden glass-card border-b border-border/40 max-h-[calc(100dvh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container py-3 flex flex-col gap-1">
            {allLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={aq(link.href)}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-primary/10 text-primary"
                      : "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
