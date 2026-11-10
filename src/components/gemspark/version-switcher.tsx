"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Globe, Zap } from "lucide-react";

// Ported from the GemSpark app's components/VersionSwitcher.tsx: Long / Short / ES pills, fixed
// top right. The app wrapped a <button> in each link; here the button's classes sit on the link
// itself (a button inside a link isn't valid HTML). Below 640px only the icons show, so each link
// also carries its label for screen readers.
const VERSIONS = [
  { href: "/gem-spark", label: "Long", icon: FileText },
  { href: "/gem-spark/short", label: "Short", icon: Zap },
  { href: "/gem-spark/es/short", label: "ES", icon: Globe },
] as const;

export function VersionSwitcher() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 rounded-full border border-[#D5D8DC] bg-white/95 p-1 shadow-lg backdrop-blur-sm">
      {VERSIONS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex items-center gap-2 rounded-full bg-[#2C3E50] px-4 py-2 text-sm font-medium text-white transition-all"
                : "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#5D6D7E] transition-all hover:bg-[#F5F5F0]"
            }
          >
            <Icon aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
