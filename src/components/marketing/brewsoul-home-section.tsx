import Image from "next/image";
import Link from "next/link";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

// Ported from legacy client/src/components/BrewSoulHero.tsx — the full-width
// "The Intelligence Engine" BrewSoul band legacy's homepage (Blog.tsx) shows
// between Core Themes and the archive. Real copy, unchanged. The background
// photo was rescued from the Manus /api/img/ proxy into Sanity on 2026-09-29
// (docs/ai/manus-media-rescue.md). Kept: the photo, aurora gradients, the
// slowly rotating sacred-geometry watermark (same keyframes the newsletter
// popup already uses), the glass stat cards, CTAs and tagline. Dropped, per
// this migration's pattern: the canvas particle loop and the JS count-up
// (numbers render final in the server HTML instead), and the hover effects
// done with JS style mutation (now Tailwind `hover:`). Stats use live data
// counts, same as /brewsoul/home, not legacy's hardcoded 103.
const HERO_IMAGE =
  "https://cdn.sanity.io/images/a3q1cyqs/production/1c8cf85cb4a89e17203b371252c9e86ccecff53a-1200x670.webp";

const STATS = [
  { value: BREWSOUL_COFFEES.length, label: "Coffees Scored" },
  { value: CHAIN_RANKINGS.length, label: "Chains Ranked" },
  { value: 6, label: "Soul Archetypes" },
];

export function BrewSoulHomeSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D0B0A] px-6 py-24 text-center sm:py-28">
      <Image src={HERO_IMAGE} alt="Steaming glass cup of coffee surrounded by coffee beans" fill sizes="100vw" className="-z-30 object-cover opacity-45" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_25%_30%,rgba(196,132,29,0.15)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(111,78,55,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(61,139,110,0.06)_0%,transparent_60%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden opacity-60">
        <div className="absolute -inset-1/2 animate-jewel-aurora-rotate bg-[conic-gradient(from_0deg_at_50%_50%,#C4841D15,#6F4E3715,#3D8B6E15,#C4841D15,#D4B96A15,#C4841D15)] blur-[60px]" />
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        fill="none"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-150 animate-jewel-geo-rotate opacity-8"
      >
        <circle cx="100" cy="100" r="90" stroke="url(#bshGrad)" strokeWidth="0.4" />
        <circle cx="100" cy="55" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
        <circle cx="100" cy="145" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
        <circle cx="61" cy="77" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
        <circle cx="139" cy="77" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
        <circle cx="61" cy="123" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
        <circle cx="139" cy="123" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
        <polygon points="100,10 177.3,55 177.3,145 100,190 22.7,145 22.7,55" stroke="url(#bshGrad)" strokeWidth="0.3" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="url(#bshGrad)" strokeWidth="0.15" />
        <line x1="22.7" y1="55" x2="177.3" y2="145" stroke="url(#bshGrad)" strokeWidth="0.15" />
        <line x1="22.7" y1="145" x2="177.3" y2="55" stroke="url(#bshGrad)" strokeWidth="0.15" />
        <defs>
          <linearGradient id="bshGrad" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#C4841D" />
            <stop offset="50%" stopColor="#D4B96A" />
            <stop offset="100%" stopColor="#C4841D" />
          </linearGradient>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-[#C4841D]/40 to-transparent"
      />

      <div className="mx-auto max-w-4xl">
        <p className="mb-8 font-mono text-[0.7rem] tracking-[0.3em] text-[#C4841D] uppercase">The Intelligence Engine</p>
        <h2 className="font-heading text-6xl leading-none text-[#F5EDE0]/95 sm:text-7xl">BrewSoul</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.75] text-[#F5EDE0]/55 sm:text-lg">
          Coffee is the most consumed psychoactive substance on earth, yet most people have no idea what they&apos;re
          actually drinking. BrewSoul is an intelligence engine that objectively scores every coffee and chain on value,
          sourcing ethics, and experience — then matches you to your identity through what you drink.
        </p>
        <p className="mt-5 font-mono text-xs tracking-wide text-[#D4B96A]/80">
          Take the quiz. Browse the scores. Find your soul.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[#F5EDE0]/6 bg-linear-165 from-[#F5EDE0]/6 to-[#0D0B0A]/60 px-2 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(245,237,224,0.05)] backdrop-blur-md transition-all duration-300 hover:border-[#C4841D]/25 hover:shadow-[0_12px_40px_rgba(196,132,29,0.15),inset_0_1px_0_rgba(245,237,224,0.1)] sm:py-7"
            >
              <div className="bg-linear-135 from-[#C4841D] via-[#F5EDE0] to-[#D4B96A] bg-clip-text font-mono text-4xl font-bold text-transparent sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-3 font-mono text-[0.6rem] tracking-[0.18em] text-[#F5EDE0]/40 uppercase sm:text-[0.65rem]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link
            href="/brewsoul"
            className="rounded-lg bg-linear-135 from-[#C4841D] via-[#6F4E37] to-[#D4B96A] px-8 py-4 font-mono text-xs tracking-[0.18em] text-[#F5EDE0] uppercase shadow-[0_8px_30px_rgba(196,132,29,0.25),0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_45px_rgba(196,132,29,0.35),0_4px_15px_rgba(0,0,0,0.25)]"
          >
            Discover Your Identity
          </Link>
          <Link
            href="/brewsoul/browse"
            className="rounded-lg border border-[#C4841D]/25 bg-[#F5EDE0]/4 px-8 py-4 font-mono text-xs tracking-[0.18em] text-[#D4B96A]/80 uppercase backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C4841D]/50 hover:bg-[#C4841D]/10"
          >
            Browse Top QPR →
          </Link>
          <Link
            href="/brewsoul/chains"
            className="rounded-lg border border-[#6F4E37]/20 bg-[#F5EDE0]/4 px-8 py-4 font-mono text-xs tracking-[0.18em] text-[#F5EDE0]/50 uppercase backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6F4E37]/40 hover:bg-[#6F4E37]/10 hover:text-[#F5EDE0]/70"
          >
            Chain Rankings →
          </Link>
        </div>

        <p className="mt-14 text-sm text-[#F5EDE0]/60 italic">
          &ldquo;The cup doesn&apos;t lie. It just waits for you to listen.&rdquo;
        </p>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-b from-transparent to-background" />
    </section>
  );
}
