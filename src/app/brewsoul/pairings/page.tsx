import type { Metadata } from "next";
import Link from "next/link";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { PAIRINGS, FLIGHTS } from "@/lib/content/brewsoul-encyclopedia";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulPairings` — real food/drink pairings by origin and 3 real
// curated tasting flights (each linking to real coffees in the
// catalog), unchanged. Fully static.
export const metadata: Metadata = {
  title: "Coffee Pairings — BrewSoul",
  description:
    "What you eat with your coffee matters — pairings based on flavor chemistry, not vibes, plus curated tasting flights.",
  alternates: { canonical: "/brewsoul/pairings" },
};

export default function BrewSoulPairingsPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">
        The Perfect Match
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Coffee Pairings
      </h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        What you eat with your coffee matters. These pairings are based on flavor chemistry, not
        vibes.
      </p>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
        {PAIRINGS.map((p) => (
          <div key={p.origin} className="rounded-xl border border-[#6F4E37]/8 bg-white p-6">
            <h3 className="mb-2 font-heading text-[1.1rem] font-bold text-[#2C1810]">{p.origin}</h3>
            <div className="mb-2">
              <div className="mb-1 font-mono text-[0.72rem] font-bold text-[#4A7C59]">
                Pairs well with:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.foods.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-[#4A7C59]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#4A7C59]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            {p.drinks && p.drinks.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 font-mono text-[0.72rem] font-bold text-[#6F4E37]">
                  Drink pairings:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.drinks.map((d) => (
                    <span
                      key={d}
                      className="rounded-full bg-[#6F4E37]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#6F4E37]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {p.antiPairings && p.antiPairings.length > 0 && (
              <div>
                <div className="mb-1 font-mono text-[0.72rem] font-bold text-[#8B2500]">Avoid:</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.antiPairings.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-[#8B2500]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#8B2500]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-12 mb-4 font-heading text-2xl font-bold text-[#2C1810]">Curated Flights</h2>
      <p className="mb-6 text-[0.9rem] leading-relaxed text-[#6B5B4F]">
        Three-coffee tasting progressions designed to teach your palate something new.
      </p>
      <div className="flex flex-col gap-5">
        {FLIGHTS.map((f) => (
          <div
            key={f.id}
            className="rounded-xl border border-[#6F4E37]/8 border-l-4 border-l-[#C5A23C] bg-white p-6"
          >
            <h3 className="mb-1 font-heading text-[1.1rem] font-bold text-[#2C1810]">{f.name}</h3>
            <p className="mb-2 text-[0.85rem] leading-relaxed text-[#6B5B4F]">{f.description}</p>
            <div className="flex flex-wrap gap-2">
              {f.coffeeIds.map((cid, i) => {
                const coffee = BREWSOUL_COFFEES.find((c) => c.id === cid);
                return coffee ? (
                  <Link
                    key={cid}
                    href={`/brewsoul/coffee/${cid}`}
                    className="rounded-full bg-[#C5A23C]/8 px-3 py-1.5 font-mono text-[0.72rem] text-[#8B6914]"
                  >
                    {i + 1}. {coffee.name}
                  </Link>
                ) : (
                  <span
                    key={cid}
                    className="rounded-full bg-[#999]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#999]"
                  >
                    {cid}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <NextSteps
        steps={[
          { label: "Experiences", path: "/brewsoul/experiences", description: "Coffee moments" },
          {
            label: "Blend Builder",
            path: "/brewsoul/blend-builder",
            description: "Create your own",
          },
          { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find the pairing" },
        ]}
      />
    </section>
  );
}
