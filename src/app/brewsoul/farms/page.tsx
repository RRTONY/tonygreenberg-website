import type { Metadata } from "next";
import Image from "next/image";
import { FARMS } from "@/lib/content/brewsoul-encyclopedia";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulFarms` — real farm passport entries (country/region/producer/
// altitude/story/varieties/certifications), unchanged. Fully static.
export const metadata: Metadata = {
  title: "Farm Passports — BrewSoul",
  description: "Meet the people who grow your coffee — verified for transparency, fair labor, and environmental stewardship.",
  alternates: { canonical: "/brewsoul/farms" },
};

export default function BrewSoulFarmsPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#4A7C59] uppercase">Origin Stories</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Farm Passports</h1>
      <p className="mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Meet the people who grow your coffee. Every farm profiled here has been verified for transparency, fair labor practices, and environmental
        stewardship.
      </p>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
        {FARMS.map((f) => (
          <div key={f.id} className="overflow-hidden rounded-xl border border-[#6F4E37]/8 bg-white">
            {f.imageUrl && (
              <div className="relative aspect-video w-full">
                <Image
                  src={f.imageUrl}
                  alt={`${f.name}, a coffee farm in ${f.region}, ${f.country}`}
                  fill
                  sizes="(min-width: 1024px) 340px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#C5A23C] uppercase">
                {f.country} · {f.region}
              </div>
              <h3 className="mb-1 font-heading text-lg font-bold text-[#2C1810]">{f.name}</h3>
              <div className="mb-3 text-[0.85rem] text-[#6F4E37]">
                {f.producer} {f.altitude ? `· ${f.altitude}` : ""}
              </div>
              <p className="mb-3 text-[0.85rem] leading-relaxed text-[#6B5B4F]">{f.story}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.varieties.map((v) => (
                  <span key={v} className="rounded-full bg-[#4A7C59]/6 px-2 py-0.5 font-mono text-[0.65rem] text-[#4A7C59]">
                    {v}
                  </span>
                ))}
              </div>
              {f.certifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {f.certifications.map((c) => (
                    <span key={c} className="rounded-full bg-[#C5A23C]/6 px-2 py-0.5 font-mono text-[0.6rem] text-[#8B6914]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <NextSteps
        steps={[
          { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", description: "Where your money goes" },
          { label: "Economics", path: "/brewsoul/economics", description: "The supply chain" },
          { label: "Browse Farm Coffees", path: "/brewsoul/browse", description: "Taste the origin" },
        ]}
      />
    </section>
  );
}
