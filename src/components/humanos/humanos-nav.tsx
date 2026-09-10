"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X } from "lucide-react";
import { HUMANOS_NAV_ITEMS } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosLayout.tsx's nav.
// Real nav items/labels unchanged. Legacy's logo was an `/api/img/`
// Manus-hosted image (CONTRIBUTING.md rule 12 — never referenced); dropped
// for a text/icon wordmark instead, same treatment KavaNav gives its own
// logo. "Space Grotesk"/"Special Elite" (loaded only for this legacy
// subsystem) dropped for `font-heading`/`font-mono`, already loaded
// site-wide — same call already made on /kava and /attention-theft. Uses
// the render-time `prevPathname` comparison (not a `useEffect`) to close
// the mobile menu on navigation, per CONTRIBUTING.md's state-during-render
// rule.
export function HumanosNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/humanos" className="flex items-center gap-2 text-white">
          <Cpu size={22} className="text-violet-400" />
          <span className="font-heading text-base font-bold tracking-wide">Human OS</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {HUMANOS_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-xs tracking-[0.12em] uppercase transition-colors ${
                pathname === item.href ? "text-violet-400" : "text-white/75 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/living-declaration"
            className="rounded-sm bg-violet-600 px-5 py-2 font-mono text-xs tracking-[0.12em] text-white uppercase hover:bg-violet-500"
          >
            Manifesto
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex size-10 items-center justify-center rounded-lg bg-violet-600 text-white lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-neutral-950/98 px-6 py-4 lg:hidden">
          {HUMANOS_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block border-b border-white/5 py-2.5 font-mono text-sm tracking-[0.1em] uppercase ${
                pathname === item.href ? "text-violet-400" : "text-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/living-declaration"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 font-mono text-sm tracking-[0.1em] text-violet-400 uppercase"
          >
            Manifesto
          </Link>
        </nav>
      )}
    </header>
  );
}
