"use client";

import { useState } from "react";
import Link from "next/link";
import { BREWSOUL_CATEGORIES, CAT_COLORS, BREWSOUL_TOTAL_PAGES } from "@/lib/content/brewsoul-directory";

// Ported from legacy client/src/pages/brewsoul/BrewSoulDirectory.tsx —
// real category filter pills over the full page index, extracted into a
// client island. Card hover (translateY + shadow) converted to Tailwind
// `hover:` classes instead of JS mouse handlers.
export function DirectoryExplorer() {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter ? BREWSOUL_CATEGORIES.filter((c) => c.title === filter) : BREWSOUL_CATEGORIES;

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
              {cat.emoji} {cat.title} ({cat.pages.length})
            </button>
          );
        })}
      </div>

      {filtered.map((cat) => {
        const c = CAT_COLORS[cat.title];
        return (
          <div key={cat.title} className="mb-12">
            <div className="mb-4 flex items-center gap-3 border-b-2 pb-3" style={{ borderColor: c.border }}>
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <div className="font-heading text-xl font-bold text-[#2C1810]">{cat.title}</div>
                <div className="text-[0.85rem] text-[#6B5B4F]">{cat.desc}</div>
              </div>
            </div>

            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
              {cat.pages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="flex h-full flex-col rounded-xl border p-5 transition-transform hover:-translate-y-0.5"
                  style={{ background: c.bg, borderColor: c.border }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-[10px] bg-white/60 text-[1.75rem]">{page.icon}</span>
                    <span
                      className="rounded-sm px-2 py-1 font-mono text-[0.58rem] tracking-[0.1em] uppercase"
                      style={{ background: c.badge, color: c.badgeText }}
                    >
                      {cat.title}
                    </span>
                  </div>
                  <div className="mb-1.5 font-heading text-[1.05rem] leading-snug font-bold text-[#2C1810]">{page.label}</div>
                  <div className="flex-1 text-[0.85rem] leading-relaxed text-[#6B5B4F]">{page.desc}</div>
                  <div className="mt-3 font-mono text-xs" style={{ color: c.badge }}>
                    Explore →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
