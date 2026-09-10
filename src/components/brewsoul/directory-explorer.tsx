"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Banknote,
  BookOpen,
  Building2,
  CircleDot,
  Coffee,
  Dna,
  Flag,
  Flame,
  FlaskConical,
  Leaf,
  Map,
  Mic,
  Microscope,
  Mountain,
  NotebookPen,
  NotebookText,
  Palette,
  Pill,
  Rocket,
  Scale,
  ScrollText,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Target,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  BREWSOUL_CATEGORIES,
  CAT_COLORS,
  BREWSOUL_TOTAL_PAGES,
} from "@/lib/content/brewsoul-directory";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Start Here": Rocket,
  "The Intelligence Engine": BarChart3,
  "Deep Research": Microscope,
  "Reference Library": BookOpen,
  "Tools & Discovery": Wrench,
  "Guest Series": Mic,
};

const PAGE_ICONS: Record<string, LucideIcon> = {
  "/brewsoul/first-sip": ScrollText,
  "/brewsoul/quiz": Target,
  "/brewsoul/prescription": Pill,
  "/brewsoul/browse": Coffee,
  "/brewsoul/chains": Store,
  "/brewsoul/cities": Building2,
  "/brewsoul/compare": Scale,
  "/brewsoul/economics": Banknote,
  "/brewsoul/health": Dna,
  "/brewsoul/biodynamic": Sprout,
  "/brewsoul/decaf": FlaskConical,
  "/brewsoul/mold-free": ShieldCheck,
  "/brewsoul/follow-the-dollar": Banknote,
  "/brewsoul/wall-of-shame": Flag,
  "/brewsoul/varieties": Leaf,
  "/brewsoul/processing": Settings2,
  "/brewsoul/roasters": Flame,
  "/brewsoul/farms": Mountain,
  "/brewsoul/glossary": NotebookPen,
  "/brewsoul/pairings": UtensilsCrossed,
  "/brewsoul/blend-builder": Palette,
  "/brewsoul/drops": Sparkles,
  "/brewsoul/experiences": Map,
  "/brewsoul/collection": NotebookText,
  "/brewsoul/guest/shanita-nicholas": Coffee,
};

// Ported from legacy client/src/pages/brewsoul/BrewSoulDirectory.tsx —
// real category filter pills over the full page index, extracted into a
// client island. Card hover (translateY + shadow) converted to Tailwind
// `hover:` classes instead of JS mouse handlers.
export function DirectoryExplorer() {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter
    ? BREWSOUL_CATEGORIES.filter((c) => c.title === filter)
    : BREWSOUL_CATEGORIES;

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-full border border-[#6F4E37]/15 px-4 py-1.5 font-mono text-[0.68rem] tracking-[0.1em] uppercase ${
            !filter ? "bg-[#6F4E37] text-[#FAFAF7]" : "text-[#6F4E37]"
          }`}
        >
          All ({BREWSOUL_TOTAL_PAGES})
        </button>
        {BREWSOUL_CATEGORIES.map((cat) => {
          const active = filter === cat.title;
          const CategoryIcon = CATEGORY_ICONS[cat.title] ?? CircleDot;
          return (
            <button
              key={cat.title}
              onClick={() => setFilter(active ? null : cat.title)}
              className="rounded-full border px-4 py-1.5 font-mono text-[0.68rem] tracking-[0.1em] uppercase"
              style={{
                borderColor: CAT_COLORS[cat.title].border,
                background: active ? CAT_COLORS[cat.title].badge : "transparent",
                color: active ? CAT_COLORS[cat.title].badgeText : CAT_COLORS[cat.title].badge,
              }}
            >
              <CategoryIcon
                aria-hidden="true"
                className="mr-1 inline-block size-3.5 align-text-bottom"
              />
              {cat.title} ({cat.pages.length})
            </button>
          );
        })}
      </div>

      {filtered.map((cat) => {
        const c = CAT_COLORS[cat.title];
        const CategoryIcon = CATEGORY_ICONS[cat.title] ?? CircleDot;
        return (
          <div key={cat.title} className="mb-12">
            <div
              className="mb-4 flex items-center gap-3 border-b-2 pb-3"
              style={{ borderColor: c.border }}
            >
              <CategoryIcon aria-hidden="true" className="size-6" style={{ color: c.badge }} />
              <div>
                <div className="font-heading text-xl font-bold text-[#2C1810]">{cat.title}</div>
                <div className="text-[0.85rem] text-[#6B5B4F]">{cat.desc}</div>
              </div>
            </div>

            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
              {cat.pages.map((page) => {
                const PageIcon = PAGE_ICONS[page.path] ?? CircleDot;

                return (
                  <Link
                    key={page.path}
                    href={page.path}
                    className="flex h-full flex-col rounded-xl border p-5 transition-transform hover:-translate-y-0.5"
                    style={{ background: c.bg, borderColor: c.border }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-[10px] bg-white/60">
                        <PageIcon
                          aria-hidden="true"
                          className="size-6"
                          style={{ color: c.badge }}
                        />
                      </span>
                      <span
                        className="rounded-sm px-2 py-1 font-mono text-[0.58rem] tracking-[0.1em] uppercase"
                        style={{ background: c.badge, color: c.badgeText }}
                      >
                        {cat.title}
                      </span>
                    </div>
                    <div className="mb-1.5 font-heading text-[1.05rem] leading-snug font-bold text-[#2C1810]">
                      {page.label}
                    </div>
                    <div className="flex-1 text-[0.85rem] leading-relaxed text-[#6B5B4F]">
                      {page.desc}
                    </div>
                    <div className="mt-3 font-mono text-xs" style={{ color: c.badge }}>
                      Explore <ForwardIcon aria-hidden="true" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
