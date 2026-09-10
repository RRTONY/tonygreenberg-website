import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { ClinicRankings, type Clinic } from "@/components/marketing/clinic-rankings";
import { CRITERIA } from "@/lib/content/peptide-criteria";

// Ported from legacy client/src/pages/PeptideHallOfShame.tsx. Real content,
// unchanged — a public-interest audit of 20 real, named peptide clinics'
// publicly available assessment tools against 6 objective clinical
// criteria, each with a real URL and specific documented weaknesses/
// strengths. This evaluates public business tools against stated criteria
// (consumer-advocacy journalism, same genre as a Consumer Reports review),
// not allegations about a private individual.
//
// The legacy hero background image (CloudFront-hosted) returns 403 — not a
// Manus asset, but currently inaccessible regardless; dropped in favor of a
// CSS gradient rather than a broken image, tracked as a real gap.
export const metadata: Metadata = {
  title: "Peptide Assessment Hall of Shame — How 20 US Clinics Score",
  description:
    "We audited 20 peptide clinics and providers across the US on 6 clinical criteria. The results are damning: average score 93/100 (where 100 is worst).",
  alternates: { canonical: "/peptide-hall-of-shame" },
};

const CLINICS: Clinic[] = [
  {
    name: "Admire Medical",
    url: "https://www.admiremedical.com/peptides",
    questions: 19,
    score: 40,
    type: "Intake form",
    contraindications: true,
    goals: true,
    personalized: false,
    evidence: false,
    medicalHistory: true,
    disclaimer: true,
    weaknesses:
      "No immediate personalized results — it's a lead-in to a paid consultation. No citation of evidence.",
    strengths:
      "Good safety screening. Asks about contraindications, medical history, and health goals. Comprehensive intake.",
  },
  {
    name: "Vitality Centers NW",
    url: "https://vitalitycentersnw.com/peptide-assessment",
    questions: 10,
    score: 90,
    type: "Lead generation form",
    contraindications: false,
    goals: true,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: true,
    weaknesses:
      "No contraindication screening, generic results, no evidence cited, no medical history questions.",
    strengths: "Asks about health goals. Has disclaimer.",
  },
  {
    name: "Elite Living & Health",
    url: "https://www.elitelivingandhealth.com",
    questions: 9,
    score: 90,
    type: "Lead generation form",
    contraindications: false,
    goals: true,
    personalized: false,
    evidence: false,
    medicalHistory: true,
    disclaimer: false,
    weaknesses:
      "No contraindication screening, no personalized results, no evidence. Basic lead gen.",
    strengths: "Asks about medical history and goals.",
  },
  {
    name: "Defy Medical",
    url: "https://www.defymedical.com/services/peptide-therapy/",
    questions: 8,
    score: 95,
    type: "Lead generation form",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: true,
    weaknesses:
      "Basic lead generation form. No screening, no goals, no personalization, no evidence.",
    strengths: "Has disclaimer.",
  },
  {
    name: "10X Health System",
    url: "https://10xhealthsystem.com",
    questions: 4,
    score: 95,
    type: "Lead generation form",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "Only 4 questions. Pure lead generation. No clinical value whatsoever.",
    strengths: "None.",
  },
  {
    name: "Renew Youth",
    url: "https://www.renewyouth.com",
    questions: 8,
    score: 95,
    type: "Lead generation form",
    contraindications: false,
    goals: true,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "Lead generation disguised as assessment. No safety screening.",
    strengths: "Asks about goals.",
  },
  {
    name: "HRTGuru",
    url: "https://www.hrtguru.com",
    questions: 5,
    score: 95,
    type: "Lead generation form",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: true,
    disclaimer: false,
    weaknesses: "Minimal questions. No personalization, no evidence, no safety screening.",
    strengths: "Asks about medical history.",
  },
  {
    name: "Evolve",
    url: "https://www.evolvehrt.com",
    questions: 5,
    score: 100,
    type: "Lead generation form",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "Pure lead generation. No clinical criteria met.",
    strengths: "None.",
  },
  {
    name: "Peptide Sciences",
    url: "https://www.peptidesciences.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment exists. Research chemical vendor.",
    strengths: "None.",
  },
  {
    name: "Lifeline Medical",
    url: "https://lifelinemed.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment exists.",
    strengths: "None.",
  },
  {
    name: "Bloom Health & Wellness",
    url: "https://bloomhealthwellness.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: true,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment. Mentions goals on marketing page but no actual tool.",
    strengths: "None.",
  },
  {
    name: "Fountain Life",
    url: "https://www.fountainlife.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment. Premium pricing with no upfront screening.",
    strengths: "None.",
  },
  {
    name: "Maximus",
    url: "https://www.maximustribe.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment. DTC peptide sales with no screening.",
    strengths: "None.",
  },
  {
    name: "Peter Attia MD",
    url: "https://peterattiamd.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: true,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment tool. Educational content only.",
    strengths: "Cites peer-reviewed evidence in articles.",
  },
  {
    name: "Biote Medical",
    url: "https://biote.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment. Hormone pellet focus, peptides secondary.",
    strengths: "None.",
  },
  {
    name: "SSRP Institute",
    url: "https://ssrpinstitute.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment exists.",
    strengths: "None.",
  },
  {
    name: "International Peptide Society",
    url: "https://peptidesociety.org",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: true,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "Professional society. No consumer-facing assessment.",
    strengths: "Publishes evidence-based guidelines.",
  },
  {
    name: "Core Med Science",
    url: "https://coremedscience.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment. Supplement vendor.",
    strengths: "None.",
  },
  {
    name: "Peptide Clinics (AU)",
    url: "https://www.peptideclinics.com.au",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: false,
    medicalHistory: false,
    disclaimer: false,
    weaknesses: "No assessment. Australian telehealth provider.",
    strengths: "None.",
  },
  {
    name: "AgelessRx",
    url: "https://www.agelessrx.com",
    questions: 0,
    score: 100,
    type: "No assessment",
    contraindications: false,
    goals: false,
    personalized: false,
    evidence: true,
    medicalHistory: true,
    disclaimer: false,
    weaknesses: "No upfront assessment. Requires paid consultation.",
    strengths: "Cites evidence. Collects medical history during consultation.",
  },
];

export default function PeptideHallOfShamePage() {
  const avgScore = Math.round(CLINICS.reduce((s, c) => s + c.score, 0) / CLINICS.length);
  const withAssessment = CLINICS.filter((c) => c.questions > 0).length;
  const withContraindications = CLINICS.filter((c) => c.contraindications).length;
  const withEvidence = CLINICS.filter((c) => c.evidence).length;

  const stats = [
    { value: `${avgScore}/100`, label: "Average Score", sub: "(100 = worst)" },
    { value: `${withAssessment}/20`, label: "Have Any Assessment", sub: "" },
    { value: `${withContraindications}/20`, label: "Screen Contraindications", sub: "" },
    { value: `${withEvidence}/20`, label: "Cite Evidence", sub: "" },
  ];

  return (
    <div>
      <PeptideShutdownBanner />

      <div className="border-b border-brand-gold/15 bg-[#0A0A10] px-6 py-2.5 text-center">
        <p className="font-mono text-xs tracking-wide text-brand-gold/60 uppercase">
          Mirror of the Market · Fair Comment · Public Interest · Not Medical Advice ·{" "}
          <Link href="/peptide-matrix#appeals" className="text-brand-gold underline">
            Appeals Process
          </Link>
        </p>
      </div>

      <section className="bg-linear-to-br from-[#0A0A10] to-[#1a1a2e] px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold/50 uppercase">
            Peptide Assessment Audit · 20 US Providers
          </p>
          <h1 className="mb-6 font-heading text-4xl leading-tight text-[#E8E4DC] sm:text-5xl">
            The Peptide Assessment
            <br />
            <span className="text-[#B22222]">Hall of Shame</span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg leading-relaxed text-[#E8E4DC]/60">
            We audited every peptide questionnaire we could find across the United States. Most
            aren&apos;t assessments at all — they&apos;re lead generation forms wearing a lab coat.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-30">
                <div className="font-heading text-3xl font-bold text-brand-gold">{stat.value}</div>
                <div className="font-mono text-xs tracking-wide text-[#E8E4DC]/40 uppercase">
                  {stat.label}
                </div>
                {stat.sub && <div className="text-xs text-[#E8E4DC]/30">{stat.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          Scoring Methodology
        </h2>
        <p className="mb-6 leading-relaxed text-foreground/80">
          Each provider was evaluated on 6 clinical criteria that any responsible peptide assessment
          should include. A score of 1 represents a perfect assessment; 100 represents the worst
          possible outcome — no assessment at all, or a lead generation form with zero clinical
          value. The criteria are weighted by clinical importance:
        </p>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <div key={c.key} className="rounded-md border border-brand-gold/10 bg-card p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">{c.label}</span>
                <span className="font-mono text-xs text-brand-gold">{c.weight}%</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-12 rounded-xl border-2 border-emerald-700/20 bg-emerald-700/5 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="mb-1 font-heading text-xl font-bold text-foreground">
                For Comparison: The Peptide Clarity Index™
              </h3>
              <p className="text-sm text-muted-foreground">
                Our assessment scores <strong className="text-foreground">5/100</strong> — meeting
                all 6 clinical criteria with 7 scoring axes and 16 personalized archetypes.
              </p>
            </div>
            <Link
              href="/find-your-peptide"
              className="rounded-md bg-emerald-700 px-6 py-2.5 font-mono text-xs tracking-wide whitespace-nowrap text-white uppercase"
            >
              Take the Assessment <ForwardIcon aria-hidden="true" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Contraindication Screening",
              "Medical History",
              "Personalized Results",
              "Evidence Citations",
              "Health Goals",
              "Medical Disclaimer",
              "7 Clinical Axes",
              "16 Archetypes",
            ].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 rounded bg-emerald-700/10 px-2 py-1 font-mono text-xs text-emerald-700"
              >
                <Check aria-hidden="true" className="size-3" /> {f}
              </span>
            ))}
          </div>
        </div>

        <ClinicRankings clinics={CLINICS} />

        <div className="mt-12 rounded-2xl bg-linear-to-br from-[#0A0A10] to-[#1a1a2e] px-6 py-16 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-[#E8E4DC]">
            Take an Assessment That Actually Works
          </h2>
          <p className="mx-auto mb-8 max-w-md leading-relaxed text-[#E8E4DC]/60">
            10 questions. 7 clinical axes. 16 personalized archetypes. Contraindication screening.
            Evidence citations. No lead generation tricks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/find-your-peptide"
              className="rounded-lg bg-linear-to-br from-brand-gold to-brand-gold-light px-6 py-3 font-mono text-xs font-bold tracking-wide text-[#0A0A10] uppercase"
            >
              Take the Assessment <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/peptide-supply-chain"
              className="rounded-lg border border-brand-gold/30 px-6 py-3 font-mono text-xs font-bold tracking-wide text-brand-gold uppercase"
            >
              Where Does Your $ Go? <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/peptide-matrix"
              className="rounded-lg border border-brand-gold/30 px-6 py-3 font-mono text-xs font-bold tracking-wide text-brand-gold uppercase"
            >
              Review vs Evidence Matrix <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/quiz_25q"
              className="rounded-lg border border-brand-gold/30 px-6 py-3 font-mono text-xs font-bold tracking-wide text-brand-gold uppercase"
            >
              25-Question Quiz <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/peptide-watch"
              className="rounded-lg border border-[#C84B2A]/40 px-6 py-3 font-mono text-xs font-bold tracking-wide text-[#C84B2A] uppercase"
            >
              PeptideWatch Safety Guide <ForwardIcon aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-brand-gold/25 bg-linear-to-br from-brand-gold/8 to-brand-gold/2 p-8 text-center">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
            For Manufacturers &amp; Suppliers
          </p>
          <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">
            Join Our Vetted Supply Network
          </h3>
          <p className="mx-auto mb-6 max-w-lg leading-relaxed text-muted-foreground">
            We are onboarding 400+ naturopathic clinics and selectively expanding our approved
            vendor base. If your manufacturing meets our transparency and quality standards, we want
            to hear from you.
          </p>
          <Link
            href="/supplier-intake"
            className="inline-block rounded-lg bg-brand-gold px-8 py-3 font-mono text-xs font-bold tracking-wide text-white uppercase"
          >
            Become a Supply Partner <ForwardIcon aria-hidden="true" />
          </Link>
        </div>

        <BioChainCTA
          variant="supplier"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier applications at RampRate."
        />

        <div className="mt-12 rounded-md bg-brand-gold/5 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Methodology Note:</strong> This audit was conducted
            in February 2026 by visiting each provider&apos;s website and evaluating their publicly
            available peptide assessment or questionnaire tools. Scores reflect the quality of the
            consumer-facing assessment tool only — not the quality of clinical care provided.
            Providers without a public assessment tool received the maximum weakness score (100).
            This page is for educational purposes only and does not constitute medical advice.
            Rankings may change as providers update their tools.
          </p>
        </div>
      </div>
    </div>
  );
}
