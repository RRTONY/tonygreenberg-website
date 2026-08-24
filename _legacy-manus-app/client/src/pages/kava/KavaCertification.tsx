import KavaLayout, {
  KAVA,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaBadge,
  KavaDivider,
  KavaDisclaimer,
} from "./KavaLayout";
import { Link } from "wouter";
import SEO from "@/components/SEO";

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
  { name: "Level 1 — Kava Practitioner", modules: "Modules 1-6", hours: "34 hrs", scope: "Prepare and serve kava in group settings; administer PRI assessments; screen for drug interactions.", color: KAVA.cobalt },
  { name: "Level 2 — Threshold Facilitator", modules: "Modules 1-9", hours: "52 hrs", scope: "All Level 1 + design and lead threshold ceremonies; implement Sacred Masculine Triad sequencing; mentor Level 1 practitioners.", color: KAVA.saffron },
  { name: "Level 3 — Master Facilitator", modules: "All 12 Modules", hours: `${TOTAL_HOURS} hrs`, scope: "All Level 2 + community harm reduction programs; Hawaii ICE crisis context work; train and certify Level 1 and 2 practitioners; contribute to PRI research.", color: KAVA.terracotta },
];

export default function KavaCertification() {
  return (
    <>
    <SEO
        title="Kava Certification — Quality Standards"
        description="Understanding kava certification, quality standards, and how to identify noble kava."
        path="/kava/certification"
        keywords="Tony Greenberg, kava certification, noble kava, kava quality, kava standards"
        indexable={true}
      />
      <KavaLayout>
      <KavaHero
        eyebrow="Module 10"
        title="Facilitator Certification"
        subtitle={`12-module, ${TOTAL_HOURS}-hour certification program for PRI Threshold Facilitators. Three certification tiers from Kava Practitioner to Master Facilitator.`}
      />

      {/* ── Certification Tiers ── */}
      <KavaSection>
        <KavaSectionTitle>Certification Tiers</KavaSectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl p-6"
              style={{ border: `2px solid ${tier.color}`, backgroundColor: tier.color + "08" }}
            >
              <h3
                className="font-bold text-lg mb-2"
                style={{ fontFamily: "'Fraunces', serif", color: tier.color }}
              >
                {tier.name}
              </h3>
              <div className="flex gap-2 mb-3">
                <KavaBadge color="saffron">{tier.modules}</KavaBadge>
                <KavaBadge color="cobalt">{tier.hours}</KavaBadge>
              </div>
              <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
                {tier.scope}
              </p>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Module Curriculum ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Full Curriculum — 12 Modules</KavaSectionTitle>
        <div className="space-y-4">
          {MODULES.map((mod) => (
            <KavaCard key={mod.num}>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{
                    backgroundColor:
                      mod.num <= 6
                        ? KAVA.cobalt
                        : mod.num <= 9
                          ? KAVA.saffron
                          : KAVA.terracotta,
                  }}
                >
                  {mod.num}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4
                      className="font-bold text-base"
                      style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}
                    >
                      {mod.title}
                    </h4>
                    <KavaBadge color="saffron">{mod.hours}</KavaBadge>
                  </div>
                  <p className="text-sm mb-2" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
                    {mod.desc}
                  </p>
                  <div
                    className="rounded-lg p-2.5 text-sm"
                    style={{ backgroundColor: KAVA.saffron + "10", borderLeft: `3px solid ${KAVA.saffron}` }}
                  >
                    <strong style={{ color: KAVA.saffron }}>Deliverable:</strong>{" "}
                    <span style={{ color: KAVA.ink }}>{mod.deliverable}</span>
                  </div>
                </div>
              </div>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      {/* ── Prerequisites ── */}
      <KavaSection>
        <KavaSectionTitle>Prerequisites</KavaSectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Minimum 10 personal kava sessions documented",
            "Clean drug interaction screening (no hard stops)",
            "Completed PRI self-assessment with score of 70+",
            "Letter of intent describing motivation and community context",
            "Background check clearance",
            "First aid / CPR certification current",
          ].map((req, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg p-3"
              style={{ backgroundColor: "#fff", border: `1px solid ${KAVA.sandMuted}` }}
            >
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: KAVA.saffron }}
              />
              <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                {req}
              </p>
            </div>
          ))}
        </div>
      </KavaSection>

      {/* ── Cross-links ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <div className="text-center">
          <p className="text-sm font-medium mb-3" style={{ color: KAVA.ink, opacity: 0.6 }}>
            Explore the full Kava Encyclopedia
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kava"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: KAVA.saffron }}
            >
              Kava Home
            </Link>
            <Link
              href="/kava/assessment"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: "#fff", color: KAVA.ink, border: `1px solid ${KAVA.sandMuted}` }}
            >
              Take Assessment
            </Link>
            <Link
              href="/kava/interactions"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: "#fff", color: KAVA.ink, border: `1px solid ${KAVA.sandMuted}` }}
            >
              Drug Interactions
            </Link>
          </div>
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
    </>);
}
