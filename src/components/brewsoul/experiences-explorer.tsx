"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useState } from "react";
import type { ExperienceEntry } from "@/lib/intelligence-engine/types";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulExperiences` — real country filter buttons, extracted into a
// client island for the same reason as `ShameExplorer`.
export function ExperiencesExplorer({ experiences }: { experiences: ExperienceEntry[] }) {
  const [selected, setSelected] = useState("all");
  const countries = Array.from(new Set(experiences.map((e) => e.country)));
  const filtered =
    selected === "all" ? experiences : experiences.filter((e) => e.country === selected);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {["all", ...countries].map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`rounded-full px-4 py-2 font-mono text-[0.7rem] ${
              selected === c
                ? "border-2 border-[#6F4E37] bg-[#6F4E37]/6 text-[#6F4E37]"
                : "border border-[#6F4E37]/15 text-[#6B5B4F]"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {filtered.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-[#6F4E37]/8 bg-white p-5">
            <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#C5A23C] uppercase">
              {exp.type} · {exp.country}
            </div>
            <h3 className="mb-1 font-heading text-[1.05rem] font-bold text-[#2C1810]">
              {exp.name}
            </h3>
            <div className="mb-2 text-[0.82rem] text-[#6F4E37]">{exp.location}</div>
            <p className="text-[0.85rem] leading-relaxed text-[#6B5B4F]">{exp.description}</p>
            <div className="mt-2 flex items-center justify-between">
              {exp.price && (
                <span className="font-mono text-[0.72rem] text-[#4A7C59]">{exp.price}</span>
              )}
              {exp.url && (
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.68rem] text-[#6F4E37]"
                >
                  Visit <ForwardIcon aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
