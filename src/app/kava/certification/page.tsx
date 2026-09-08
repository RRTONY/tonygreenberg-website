import type { Metadata } from "next";
import Link from "next/link";
import { KavaBadge, KavaCard, KavaDisclaimer, KavaDivider, KavaHero, KavaSection, KavaSectionTitle } from "@/components/kava/kava-ui";

interface Module {
  num: number;
  title: string;
  hours: string;
  desc: string;
  deliverable: string;
}

const MODULES: Module[] = [
  { num: 1, title: "Kava Botany and Taxonomy", hours: "4 hrs", desc: "Piper methysticum classification, noble vs. tudei identification, cultivar recognition, chemotype reading.", deliverable: "Cultivar identification test (visual + chemotype)" },
  { num: 2, title: "Island Origins and Cultural Protocols", hours: "6 hrs", desc: "Deep study of Vanuatu, Fiji, Tonga, Samoa, Hawaii, and Pohnpei traditions. Sevusevu protocol. Royal kava lineage.", deliverable: "Cultural competency assessment" },
  { num: 3, title: "Kavalactone Pharmacology", hours: "8 hrs", desc: "All 6 major kavalactones: mechanisms, receptor targets, synergies. CYP450 inhibition profile. Reverse tolerance.", deliverable: "Pharmacology exam (written + practical)" },
  { num: 4, title: "Drug Interaction Screening", hours: "6 hrs", desc: "24-substance interaction database mastery. Hard stop identification. Physician referral protocols.", deliverable: "Interaction screening simulation (10 case studies)" },
  { num: 5, title: "Preparation Methods", hours: "4 hrs (practical)", desc: "Traditional aqueous preparation, straining techniques, dosing calculations, fresh vs. dried protocols.", deliverable: "Practical preparation exam (observed)" },
  { num: 6, title: "PRI Assessment Administration", hours: "6 hrs", desc: "5-domain scoring system, intake interview technique, red flag identification, scoring interpretation.", deliverable: "Administer 3 supervised assessments" },
  { num: 7, title: "Ceremony Design and Facilitation", hours: "8 hrs", desc: "Circle setup, opening protocols, shell service order, intention setting, group coherence techniques.", deliverable: "Lead 2 supervised ceremonies" },
  { num: 8, title: "Safety and Crisis Response", hours: "6 hrs", desc: "Adverse reaction identification, vasovagal response management, emotional crisis de-escalation, emergency protocols.", deliverable: "Crisis response simulation" },
  { num: 9, title: "The Threshold Doctrine", hours: "4 hrs", desc: "Kava as preparation medicine for psychedelic engagement. Sacred Masculine Triad sequencing. MAO-B priming theory.", deliverable: "Written essay: threshold philosophy" },
  { num: 10, title: "Hawaii ICE Crisis Context", hours: "4 hrs", desc: "Meth crisis history, harm reduction principles, cultural recovery through 'awa, community facilitator role.", deliverable: "Community context assessment" },
  { num: 11, title: "Business and Compliance", hours: "4 hrs", desc: "Legal status by jurisdiction, FDA/GRAS framework, liability considerations, insurance, record-keeping.", deliverable: "Compliance checklist completion" },
  { num: 12, title: "Practicum and Certification", hours: "20 hrs", desc: "Supervised facilitation of 5 complete ceremonies with post-session debriefs and mentor evaluation.", deliverable: "Mentor sign-off + portfolio submission" },
];

const TOTAL_HOURS = MODULES.reduce((sum, m) => sum + parseInt(m.hours), 0);

const TIERS = [
  {
    name: "Level 1 — Kava Practitioner",
    modules: "Modules 1-6",
    hours: "34 hrs",
    scope: "Prepare and serve kava in group settings; administer PRI assessments; screen for drug interactions.",
    borderClass: "border-kava-cobalt",
    bgClass: "bg-kava-cobalt/8",
    textClass: "text-kava-cobalt",
  },
  {
    name: "Level 2 — Threshold Facilitator",
    modules: "Modules 1-9",
    hours: "52 hrs",
    scope: "All Level 1 + design and lead threshold ceremonies; implement Sacred Masculine Triad sequencing; mentor Level 1 practitioners.",
    borderClass: "border-kava-saffron",
    bgClass: "bg-kava-saffron/8",
    textClass: "text-kava-saffron",
  },
  {
    name: "Level 3 — Master Facilitator",
    modules: "All 12 Modules",
    hours: `${TOTAL_HOURS} hrs`,
    scope: "All Level 2 + community harm reduction programs; Hawaii ICE crisis context work; train and certify Level 1 and 2 practitioners; contribute to PRI research.",
    borderClass: "border-kava-terracotta",
    bgClass: "bg-kava-terracotta/8",
    textClass: "text-kava-terracotta",
  },
];

const PREREQUISITES = [
  "Minimum 10 personal kava sessions documented",
  "Clean drug interaction screening (no hard stops)",
  "Completed PRI self-assessment with score of 70+",
  "Letter of intent describing motivation and community context",
  "Background check clearance",
  "First aid / CPR certification current",
];

function moduleBadgeClass(num: number) {
  if (num <= 6) return "bg-kava-cobalt";
  if (num <= 9) return "bg-kava-saffron";
  return "bg-kava-terracotta";
}

// Ported from legacy client/src/pages/kava/KavaCertification.tsx — the
// real 12-module, 80-hour facilitator curriculum, real 3-tier
// certification structure (Practitioner/Threshold Facilitator/Master
// Facilitator), and real prerequisites list, all ported unchanged and
// verbatim. Fully static — no interactive state — so this stays a plain
// Server Component. Legacy's `wouter` cross-links replaced with
// `next/link`.
export const metadata: Metadata = {
  title: "Kava Facilitator Certification",
  description: "A 12-module, 80-hour certification program for PRI Threshold Facilitators, across three tiers from Kava Practitioner to Master Facilitator.",
  alternates: { canonical: "/kava/certification" },
};

export default function KavaCertificationPage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 10"
        title="Facilitator Certification"
        subtitle={`12-module, ${TOTAL_HOURS}-hour certification program for PRI Threshold Facilitators. Three certification tiers from Kava Practitioner to Master Facilitator.`}
      />

      <KavaSection>
        <KavaSectionTitle>Certification Tiers</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`rounded-xl border-2 p-6 ${tier.borderClass} ${tier.bgClass}`}>
              <h3 className={`mb-2 font-heading text-lg font-bold ${tier.textClass}`}>{tier.name}</h3>
              <div className="mb-3 flex gap-2">
                <KavaBadge color="saffron">{tier.modules}</KavaBadge>
                <KavaBadge color="cobalt">{tier.hours}</KavaBadge>
              </div>
              <p className="text-sm leading-[1.75] text-kava-ink/70">{tier.scope}</p>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      <KavaSection bg="sand">
        <KavaSectionTitle>Full Curriculum — 12 Modules</KavaSectionTitle>
        <div className="space-y-4">
          {MODULES.map((mod) => (
            <KavaCard key={mod.num}>
              <div className="flex items-start gap-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${moduleBadgeClass(mod.num)}`}>
                  {mod.num}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h4 className="font-heading text-base font-bold text-kava-ink">{mod.title}</h4>
                    <KavaBadge color="saffron">{mod.hours}</KavaBadge>
                  </div>
                  <p className="mb-2 text-sm leading-[1.75] text-kava-ink/70">{mod.desc}</p>
                  <div className="rounded-lg border-l-3 border-kava-saffron bg-kava-saffron/10 p-2.5 text-sm">
                    <strong className="text-kava-saffron">Deliverable:</strong> <span className="text-kava-ink">{mod.deliverable}</span>
                  </div>
                </div>
              </div>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaSection>
        <KavaSectionTitle>Prerequisites</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PREREQUISITES.map((req) => (
            <div key={req} className="flex gap-3 rounded-lg border border-kava-sand-muted bg-white p-3">
              <div className="mt-2 size-2 shrink-0 rounded-full bg-kava-saffron" />
              <p className="text-sm leading-[1.75] text-kava-ink">{req}</p>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaSection bg="sand">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium text-kava-ink/60">Explore the full Kava Encyclopedia</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/kava" className="rounded-lg bg-kava-saffron px-4 py-2 text-sm font-semibold text-white">
              Kava Home
            </Link>
            <Link href="/kava/assessment" className="rounded-lg border border-kava-sand-muted bg-white px-4 py-2 text-sm font-semibold text-kava-ink">
              Take Assessment
            </Link>
            <Link href="/kava/interactions" className="rounded-lg border border-kava-sand-muted bg-white px-4 py-2 text-sm font-semibold text-kava-ink">
              Drug Interactions
            </Link>
          </div>
        </div>
      </KavaSection>

      <div className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <KavaDisclaimer />
        </div>
      </div>
    </>
  );
}
