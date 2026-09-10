import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Ported from legacy client/src/pages/TheBody.tsx ("The Folio" — Health &
// Longevity). Real content kept as-is. The recovered original hero is served
// from managed storage instead of the retired Sanity CDN.

export const metadata: Metadata = {
  title: "The Body",
  description:
    "Tony Greenberg's health protocols, biometric tracking, peptide research, and measurement-driven wellness approach with Oura Ring data.",
  alternates: { canonical: "/the-body" },
};

const HERO_IMAGE = "/manus-storage/the-body-hero_1ede8372.webp";

const SCORECARD = [
  {
    dimension: "Efficacy",
    weight: "30%",
    desc: "Does it actually work? Measured by biomarkers, not feelings.",
  },
  {
    dimension: "Cost",
    weight: "25%",
    desc: "Total cost including time, travel, and opportunity cost.",
  },
  { dimension: "Time", weight: "20%", desc: "How long before measurable results appear?" },
  { dimension: "Safety", weight: "15%", desc: "Side effects, contraindications, long-term risks." },
  {
    dimension: "Access",
    weight: "10%",
    desc: "Can you actually get it? Legal, geographic, practical barriers.",
  },
];

const CURRENT_PROTOCOLS = [
  "Peptide therapy — BPC-157, Thymosin Alpha-1, GHK-Cu",
  "Exosome therapy — regenerative medicine applications",
  "Oura Ring biometric tracking — sleep, HRV, readiness scores",
  "Breathwork — Wim Hof method, holotropic variations",
  "Cold exposure — structured cold plunge protocols",
  "Psychedelic-assisted therapy — supervised, clinical settings",
  "Functional medicine — comprehensive blood panels quarterly",
];

const PEPTIDE_TOOLS = [
  {
    href: "/peptide-supply-chain",
    label: "Supply Chain Transparency",
    desc: "Where does your peptide dollar actually go?",
  },
  {
    href: "/peptide-hall-of-shame",
    label: "Provider Assessment Audit",
    desc: "Which clinics ask the right questions?",
  },
  {
    href: "/peptide-matrix",
    label: "Review vs Evidence Matrix",
    desc: "5-star reviews ≠ FDA-approved efficacy",
  },
  {
    href: "/supplier-intake",
    label: "Become a Supply Partner",
    desc: "Join our vetted manufacturing network",
  },
];

export default function TheBodyPage() {
  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80">
        <Image
          src={HERO_IMAGE}
          alt="Wellness and longevity elements"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          Door 05 — Deep Dive
        </p>
        <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Health &amp; Longevity
        </h1>
        <p className="mb-10 text-foreground/80">
          Not biohacking vanity. Measurement-driven wellness with accountability built in. Years of
          testing every modality I can find — peptides, exosomes, regenerative medicine, breathwork,
          cold exposure, psychedelic-assisted therapy — each scored on a rigorous five-dimension
          framework.
        </p>

        <h2 className="mb-3 font-heading text-xl font-bold text-foreground">
          The Alt Therapy Scorecard
        </h2>
        <p className="mb-6 text-foreground/80">
          Every therapy I test gets scored on five dimensions, weighted by importance. Oura Ring
          biometrics provide the baseline data. Here&apos;s the framework:
        </p>
        <div className="mb-10 overflow-hidden rounded-md border border-brand-gold/15">
          {SCORECARD.map((row, i) => (
            <div
              key={row.dimension}
              className={`flex flex-wrap gap-4 border-b border-border p-5 last:border-b-0 ${
                i % 2 === 0 ? "bg-brand-gold/5" : ""
              }`}
            >
              <span className="min-w-30 font-heading font-bold text-foreground">
                {row.dimension}
              </span>
              <span>
                <span className="mr-4 font-mono text-xs font-bold text-brand-gold">
                  {row.weight}
                </span>
                <span className="text-foreground/80">{row.desc}</span>
              </span>
            </div>
          ))}
        </div>

        <blockquote className="mb-10 text-center font-heading text-xl italic text-foreground">
          Best-in-world peptide manufacturing partnerships. Provider connections across every
          modality I&apos;ve tested. Hedonic engineering applied to the body — not vanity metrics,
          but real measurement with real accountability.
        </blockquote>

        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Current Protocols</h2>
        <ul className="mb-10 divide-y divide-border">
          {CURRENT_PROTOCOLS.map((item) => (
            <li key={item} className="flex gap-3 py-3 text-foreground/80">
              <span className="font-bold text-brand-gold-light">›</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
          <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
            The Lesson
          </p>
          <p className="leading-relaxed text-foreground/80">
            The body doesn&apos;t lie, but feelings do. The only wellness protocol worth following
            is one that submits to measurement. If you can&apos;t track it, you can&apos;t trust it
            — and the gap between what feels good and what is good is where most people get lost.
          </p>
        </div>

        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          Peptide Research Tools
        </h2>
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {PEPTIDE_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-lg border border-brand-gold/15 bg-brand-gold/5 p-5 transition-colors hover:border-brand-gold/40 hover:bg-brand-gold/10"
            >
              <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                {tool.label}
              </p>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="border-t border-border py-6 text-center">
          <Link href="/the-nightstand" className="font-mono text-sm tracking-wide text-brand-gold">
            Continue to The Nightstand <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
