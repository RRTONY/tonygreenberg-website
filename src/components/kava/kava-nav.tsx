"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, Beaker } from "lucide-react";

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

// Ported from legacy client/src/pages/kava/KavaLayout.tsx — real nav
// items/labels unchanged. "Moroccan Riad 12" palette kept as real
// `--kava-*` CSS tokens (see globals.css) instead of legacy's inline
// styles, same treatment as /attention-theft's "crusade" palette.
// "Fraunces" (loaded for this subsystem only in legacy) dropped for
// `font-heading` (Playfair Display, already loaded site-wide), same call
// made on /attention-theft.
export function KavaNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-kava-sand-muted bg-kava-sand backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-kava-ink opacity-60 hover:opacity-100">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">TonyG</span>
        </Link>

        <Link href="/kava" className="flex items-center gap-2">
          <Beaker size={20} className="text-kava-saffron" />
          <span className="font-heading text-base font-bold tracking-wide text-kava-ink">PRI KAVA</span>
        </Link>

        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-md p-2 hover:bg-black/5" aria-label="Toggle navigation">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="hidden border-t border-kava-sand-muted lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${active ? "bg-kava-saffron text-white" : "text-kava-ink/70"}`}
              >
                {item.short}
              </Link>
            );
          })}
        </div>
      </nav>

      {menuOpen && (
        <nav className="border-t border-kava-sand-muted bg-kava-sand lg:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-base font-medium ${active ? "bg-kava-saffron text-white" : "text-kava-ink"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-kava-sand-muted pt-2">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium text-kava-ink opacity-60">
                Back to TonyGreenberg.com
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function KavaFooter() {
  return (
    <footer className="border-t border-kava-sand-muted px-5 py-8 text-center">
      <p className="mb-1 font-heading text-sm font-medium text-kava-saffron">PRI Kava Framework v2.0</p>
      <p className="text-xs text-kava-ink opacity-50">
        For facilitator training and research use. Not medical advice.
        <br />
        Consult a licensed medical professional before making any changes to medications or health protocols.
      </p>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Link href="/kava" className="text-xs font-medium text-kava-ink opacity-50 underline hover:opacity-100">
          Kava Home
        </Link>
        <Link href="/psychedelic-readiness-index" className="text-xs font-medium text-kava-ink opacity-50 underline hover:opacity-100">
          Full PRI
        </Link>
        <Link href="/" className="text-xs font-medium text-kava-ink opacity-50 underline hover:opacity-100">
          TonyGreenberg.com
        </Link>
      </div>
    </footer>
  );
}
