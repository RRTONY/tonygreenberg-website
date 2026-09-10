import type { Metadata } from "next";
import Link from "next/link";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulMoldFree` — real verified/claims/untested split over the full
// catalog by `moldTestStatus`, unchanged. Fully static, computed directly
// from `BREWSOUL_COFFEES` at render time.
export const metadata: Metadata = {
  title: "Mold-Free Verified — BrewSoul",
  description:
    "Mycotoxin contamination is real but overhyped by wellness marketers — here's what the science says, and which coffees are independently tested.",
  alternates: { canonical: "/brewsoul/mold-free" },
};

export default function BrewSoulMoldFreePage() {
  const verified = BREWSOUL_COFFEES.filter((c) => c.moldTestStatus === "verified");
  const claims = BREWSOUL_COFFEES.filter((c) => c.moldTestStatus === "claims");
  const untested = BREWSOUL_COFFEES.filter(
    (c) => !c.moldTestStatus || c.moldTestStatus === "untested",
  );

  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#4A7C59] uppercase">
        Clean Coffee
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Mold-Free Verified
      </h1>
      <p className="mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Mycotoxin contamination is real but overhyped by wellness marketers. Here&apos;s what the
        science actually says, and which coffees have been independently tested.
      </p>

      <div className="mb-10 grid grid-cols-3 gap-4">
        {[
          { n: verified.length, label: "Verified Clean", className: "text-[#4A7C59]" },
          { n: claims.length, label: "Claims Clean", className: "text-[#C5A23C]" },
          { n: untested.length, label: "Untested", className: "text-[#999]" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-[#6F4E37]/3 p-5 text-center">
            <div className={`font-mono text-3xl font-bold ${s.className}`}>{s.n}</div>
            <div className="font-mono text-[0.72rem] text-[#6B5B4F]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">
        ✓ Independently Verified
      </h2>
      <div className="mb-10 flex flex-col gap-3">
        {verified.length === 0 && (
          <p className="text-[0.88rem] text-[#999]">No verified coffees yet.</p>
        )}
        {verified.map((c) => (
          <Link
            key={c.id}
            href={`/brewsoul/coffee/${c.id}`}
            className="flex items-center justify-between rounded-lg border border-[#4A7C59]/15 bg-white px-4 py-3.5"
          >
            <div>
              <div className="font-heading text-[0.95rem] font-bold text-[#2C1810]">{c.name}</div>
              <div className="font-mono text-[0.68rem] text-[#6F4E37]">{c.producer}</div>
            </div>
            <div className="font-mono text-[0.68rem] text-[#4A7C59]">
              {c.moldTestSource || "Third-party tested"}
            </div>
          </Link>
        ))}
      </div>

      {claims.length > 0 && (
        <>
          <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">
            ⚠ Claims Clean (Unverified)
          </h2>
          <div className="flex flex-col gap-3">
            {claims.map((c) => (
              <Link
                key={c.id}
                href={`/brewsoul/coffee/${c.id}`}
                className="flex items-center justify-between rounded-lg border border-[#C5A23C]/15 bg-white px-4 py-3.5"
              >
                <div>
                  <div className="font-heading text-[0.95rem] font-bold text-[#2C1810]">
                    {c.name}
                  </div>
                  <div className="font-mono text-[0.68rem] text-[#6F4E37]">{c.producer}</div>
                </div>
                <div className="font-mono text-[0.68rem] text-[#C5A23C]">Self-reported</div>
              </Link>
            ))}
          </div>
        </>
      )}

      <NextSteps
        steps={[
          { label: "Health Claims", path: "/brewsoul/health", description: "What science says" },
          { label: "Wall of Shame", path: "/brewsoul/wall-of-shame", description: "Who's failing" },
          {
            label: "Browse Clean Coffees",
            path: "/brewsoul/browse",
            description: "Find verified options",
          },
        ]}
      />
    </section>
  );
}
