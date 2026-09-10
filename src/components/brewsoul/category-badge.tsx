"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { PAGE_CATEGORY_MAP } from "@/lib/content/brewsoul-directory";

// One literal class per category — a small, known-at-build-time set of
// variants (matches CAT_COLORS' own 6 categories in brewsoul-directory.ts),
// precomposed rather than built from the raw hex + inline style so
// Tailwind's scanner actually sees the class.
const BADGE_CLASS: Record<string, string> = {
  "Start Here": "bg-[#C5A23C]",
  "The Intelligence Engine": "bg-[#3B82F6]",
  "Deep Research": "bg-[#8B5CF6]",
  "Reference Library": "bg-[#10B981]",
  "Tools & Discovery": "bg-[#F97316]",
  "Guest Series": "bg-[#8B4513]",
};

// Ported from legacy client/src/pages/brewsoul/CategoryBadge.tsx — a small
// colored badge shown at the top of any BrewSoul page, auto-detected from
// the current path via PAGE_CATEGORY_MAP, linking back to the directory
// filtered to that category (filter param wired up once /brewsoul/directory
// itself is built). Real content/behavior, unchanged.
export function CategoryBadge() {
  const pathname = usePathname();
  const info = PAGE_CATEGORY_MAP[pathname];
  if (!info) return null;

  return (
    <div className="flex justify-center pt-4">
      <Link
        href="/brewsoul/directory"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.6rem] tracking-wide text-white uppercase transition-opacity hover:opacity-85 ${
          BADGE_CLASS[info.category] ?? "bg-[#6F4E37]"
        }`}
      >
        <ClipboardList aria-hidden="true" className="size-3" />
        {info.category}
      </Link>
    </div>
  );
}
