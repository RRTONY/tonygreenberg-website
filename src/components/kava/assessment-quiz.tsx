"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { KavaBadge, KavaCard, KavaDisclaimer, KavaHero, KavaSection, KavaSectionTitle } from "@/components/kava/kava-ui";

interface Question {
  id: string;
  text: string;
  type: "yesno" | "scale";
  points: number;
  scaleOptions?: { label: string; points: number }[];
}

interface Domain {
  id: string;
  name: string;
  maxPoints: number;
  questions: Question[];
}

const DOMAINS: Domain[] = [
  {
    id: "somatic",
    name: "Somatic Readiness",
    maxPoints: 25,
    questions: [
      { id: "s1", text: "Oura Ring or biometric baseline established?", type: "yesno", points: 3 },
      { id: "s2", text: "HRV within normal range for this individual?", type: "yesno", points: 3 },
      { id: "s3", text: "No active infection, surgery, or acute illness?", type: "yesno", points: 4 },
      { id: "s4", text: "No active liver disease or significantly elevated liver enzymes?", type: "yesno", points: 4 },
      { id: "s5", text: "Full medication review completed and cleared via Drug Interaction Checker?", type: "yesno", points: 4 },
      {
        id: "s6",
        text: "Kava response in Stage 1 diagnostic session:",
        type: "scale",
        points: 0,
        scaleOptions: [
          { label: "Grounded", points: 4 },
          { label: "Neutral", points: 2 },
          { label: "Dysregulated", points: -4 },
        ],
      },
    ],
  },
  {
    id: "psychological",
    name: "Psychological Readiness",
    maxPoints: 25,
    questions: [
      { id: "p1", text: "Intention formulated clearly and written down?", type: "yesno", points: 4 },
      { id: "p2", text: "Trauma history mapped with practitioner?", type: "yesno", points: 4 },
      { id: "p3", text: "No active psychosis, mania, or dissociative disorder?", type: "yesno", points: 5 },
      { id: "p4", text: "Previous altered state experience? (context, not scored)", type: "yesno", points: 0 },
      {
        id: "p5",
        text: "Kava session depth:",
        type: "scale",
        points: 0,
        scaleOptions: [
          { label: "Accessed genuine emotional depth", points: 8 },
          { label: "Surface engagement only", points: 3 },
          { label: "Avoidant or performative", points: -4 },
        ],
      },
    ],
  },
  {
    id: "relational",
    name: "Relational & Collective Readiness",
    maxPoints: 20,
    questions: [
      { id: "r1", text: "Journey group formed and met at least twice before ceremony?", type: "yesno", points: 4 },
      { id: "r2", text: "Facilitator rapport established over minimum 2 sessions?", type: "yesno", points: 4 },
      {
        id: "r3",
        text: "Kava circle group coherence:",
        type: "scale",
        points: 0,
        scaleOptions: [
          { label: "Achieved fully", points: 8 },
          { label: "Partial", points: 4 },
          { label: "Fragmented or anxious", points: -3 },
        ],
      },
      { id: "r4", text: "Participant willing to speak truth in group circle?", type: "yesno", points: 4 },
    ],
  },
  {
    id: "cultural",
    name: "Cultural & Ceremonial Alignment",
    maxPoints: 15,
    questions: [
      { id: "c1", text: "Participant understands Pacific Island origin of kava and its significance?", type: "yesno", points: 3 },
      { id: "c2", text: "Lineage acknowledgment demonstrated — authentic, not performative?", type: "yesno", points: 3 },
      { id: "c3", text: "Demonstrates reciprocity orientation toward plant medicines generally?", type: "yesno", points: 3 },
      {
        id: "c4",
        text: "Kava ceremony quality:",
        type: "scale",
        points: 0,
        scaleOptions: [
          { label: "Honors lineage correctly", points: 6 },
          { label: "Partially honors", points: 3 },
          { label: "Treats kava as product only", points: -2 },
        ],
      },
    ],
  },
  {
    id: "integration",
    name: "Integration Architecture",
    maxPoints: 15,
    questions: [
      { id: "i1", text: "Post-journey support structure identified before ceremony date?", type: "yesno", points: 3 },
      { id: "i2", text: "Integration circle scheduled within 7 days of journey?", type: "yesno", points: 3 },
      { id: "i3", text: "Trusted community member or therapist available for follow-up?", type: "yesno", points: 4 },
      { id: "i4", text: "Post-journey kava protocol in place?", type: "yesno", points: 5 },
    ],
  },
];

// Precomposed per-domain literal class strings — Tailwind's static scanner
// only sees complete class strings, never fragments assembled at the usage
// site (see CONTRIBUTING.md's Tailwind rules; same lesson already applied
// in `interactions-explorer.tsx`'s SEVERITY_CONFIG).
const DOMAIN_STYLES: Record<
  string,
  { text: string; tabActive: string; tabInactive: string; iconActive: string; iconInactive: string; optionActive: string; optionInactive: string; bar: string; nextButton: string }
> = {
  somatic: {
    text: "text-[#3B82F6]",
    tabActive: "border-[#3B82F6] bg-[#3B82F6] text-white",
    tabInactive: "border-kava-sand-muted bg-transparent text-kava-ink/50",
    iconActive: "bg-white/30 text-white",
    iconInactive: "bg-[#3B82F6]/20 text-[#3B82F6]",
    optionActive: "border-[#3B82F6] bg-[#3B82F6] text-white",
    optionInactive: "border-kava-sand-muted bg-white text-kava-ink",
    bar: "bg-[#3B82F6]",
    nextButton: "bg-[#3B82F6]",
  },
  psychological: {
    text: "text-[#8B5CF6]",
    tabActive: "border-[#8B5CF6] bg-[#8B5CF6] text-white",
    tabInactive: "border-kava-sand-muted bg-transparent text-kava-ink/50",
    iconActive: "bg-white/30 text-white",
    iconInactive: "bg-[#8B5CF6]/20 text-[#8B5CF6]",
    optionActive: "border-[#8B5CF6] bg-[#8B5CF6] text-white",
    optionInactive: "border-kava-sand-muted bg-white text-kava-ink",
    bar: "bg-[#8B5CF6]",
    nextButton: "bg-[#8B5CF6]",
  },
  relational: {
    text: "text-[#10B981]",
    tabActive: "border-[#10B981] bg-[#10B981] text-white",
    tabInactive: "border-kava-sand-muted bg-transparent text-kava-ink/50",
    iconActive: "bg-white/30 text-white",
    iconInactive: "bg-[#10B981]/20 text-[#10B981]",
    optionActive: "border-[#10B981] bg-[#10B981] text-white",
    optionInactive: "border-kava-sand-muted bg-white text-kava-ink",
    bar: "bg-[#10B981]",
    nextButton: "bg-[#10B981]",
  },
  cultural: {
    text: "text-kava-saffron",
    tabActive: "border-kava-saffron bg-kava-saffron text-white",
    tabInactive: "border-kava-sand-muted bg-transparent text-kava-ink/50",
    iconActive: "bg-white/30 text-white",
    iconInactive: "bg-kava-saffron/20 text-kava-saffron",
    optionActive: "border-kava-saffron bg-kava-saffron text-white",
    optionInactive: "border-kava-sand-muted bg-white text-kava-ink",
    bar: "bg-kava-saffron",
    nextButton: "bg-kava-saffron",
  },
  integration: {
    text: "text-kava-terracotta",
    tabActive: "border-kava-terracotta bg-kava-terracotta text-white",
    tabInactive: "border-kava-sand-muted bg-transparent text-kava-ink/50",
    iconActive: "bg-white/30 text-white",
    iconInactive: "bg-kava-terracotta/20 text-kava-terracotta",
    optionActive: "border-kava-terracotta bg-kava-terracotta text-white",
    optionInactive: "border-kava-sand-muted bg-white text-kava-ink",
    bar: "bg-kava-terracotta",
    nextButton: "bg-kava-terracotta",
  },
};

type Recommendation = "CLEARED" | "CONDITIONAL" | "DEFER" | "NOT READY";

const RECOMMENDATION_STYLES: Record<Recommendation, { text: string; ring: string; softBg: string; desc: string }> = {
  CLEARED: { text: "text-[#16a34a]", ring: "border-[#16a34a]", softBg: "bg-[#16a34a]/10", desc: "Proceed to journey." },
  CONDITIONAL: { text: "text-[#d97706]", ring: "border-[#d97706]", softBg: "bg-[#d97706]/10", desc: "Address flagged domains; re-assess within 2 weeks." },
  DEFER: { text: "text-[#ea580c]", ring: "border-[#ea580c]", softBg: "bg-[#ea580c]/10", desc: "Additional preparation work required; 30-day minimum before re-assessment." },
  "NOT READY": { text: "text-[#dc2626]", ring: "border-[#dc2626]", softBg: "bg-[#dc2626]/10", desc: "Significant support intervention needed before PRI pathway continues." },
};

function getRecommendation(score: number): Recommendation {
  if (score >= 85) return "CLEARED";
  if (score >= 70) return "CONDITIONAL";
  if (score >= 50) return "DEFER";
  return "NOT READY";
}

type Answers = Record<string, number>;

// Ported from legacy client/src/pages/kava/KavaAssessment.tsx — the real
// 5-domain, 20-question PRI readiness assessment (somatic/psychological/
// relational/cultural/integration), real scoring weights, and real
// recommendation bands, unchanged. Legacy's `AssessmentResultActions` took
// sessionId/answers props that fed a `trpc.assessments.submit` mutation
// this migration never built; this version uses the already-simplified
// print-only `AssessmentResultActions` (see result-actions.tsx) instead of
// reproducing a submit call with no backend.
export function AssessmentQuiz() {
  const [currentDomain, setCurrentDomain] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const domain = DOMAINS[currentDomain];
  const domainStyle = DOMAIN_STYLES[domain.id];

  const setAnswer = (qId: string, pts: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: pts }));
  };

  const domainScore = (d: Domain) => {
    let score = 0;
    d.questions.forEach((q) => {
      if (answers[q.id] !== undefined) score += answers[q.id];
    });
    return Math.max(0, score);
  };

  const totalScore = useMemo(() => {
    let total = 0;
    DOMAINS.forEach((d) => {
      total += domainScore(d);
    });
    return Math.min(100, Math.max(0, total));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const recommendation = getRecommendation(totalScore);
  const recStyle = RECOMMENDATION_STYLES[recommendation];

  const reset = () => {
    setAnswers({});
    setCurrentDomain(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <>
        <KavaHero eyebrow="PRI Assessment" title="Your Results" />
        <KavaSection>
          <div ref={resultsRef}>
            <div className="mb-8 text-center">
              <div className={`mx-auto mb-4 flex h-40 w-40 flex-col items-center justify-center rounded-full border-[6px] ${recStyle.ring} ${recStyle.softBg}`}>
                <p className={`font-heading text-5xl font-bold ${recStyle.text}`}>{totalScore}</p>
                <p className={`text-xs font-bold tracking-wide uppercase ${recStyle.text}`}>/ 100</p>
              </div>
              <p className={`mb-2 font-heading text-2xl font-bold ${recStyle.text}`}>{recommendation}</p>
              <p className="text-base leading-[1.75] text-kava-ink/70">{recStyle.desc}</p>
            </div>

            <KavaSectionTitle>Domain Breakdown</KavaSectionTitle>
            <div className="mb-8 space-y-4">
              {DOMAINS.map((d) => {
                const score = domainScore(d);
                const pct = Math.round((score / d.maxPoints) * 100);
                const style = DOMAIN_STYLES[d.id];
                return (
                  <KavaCard key={d.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-heading text-base font-bold text-kava-ink">{d.name}</h4>
                      <span className={`font-bold ${style.text}`}>
                        {score} / {d.maxPoints}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-kava-sand-muted">
                      <div className={`h-3 rounded-full transition-all duration-500 ${style.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </KavaCard>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <AssessmentResultActions printTargetRef={resultsRef} accentColor="#b86a28" />
            <button onClick={reset} className="flex items-center gap-2 rounded-lg bg-kava-saffron px-6 py-3 text-sm font-bold text-white">
              <RotateCcw size={16} />
              Start Over
            </button>
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

  return (
    <>
      <KavaHero
        eyebrow="Module 5"
        title="PRI Assessment"
        subtitle="Five-domain readiness scoring producing a PRI score of 0 to 100 with a recommendation for ceremony clearance."
      />

      <KavaSection>
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {DOMAINS.map((d, i) => {
            const style = DOMAIN_STYLES[d.id];
            const active = i === currentDomain;
            return (
              <button
                key={d.id}
                onClick={() => setCurrentDomain(i)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold whitespace-nowrap transition-all ${active ? `${style.tabActive} opacity-100` : `${style.tabInactive} opacity-50`}`}
              >
                <span className={`flex size-5 items-center justify-center rounded-full text-xs ${active ? style.iconActive : style.iconInactive}`}>{i + 1}</span>
                <span className="hidden sm:inline">{d.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <KavaBadge color="saffron">
            Domain {currentDomain + 1} of {DOMAINS.length}
          </KavaBadge>
          <h2 className={`mt-2 font-heading text-2xl font-bold ${domainStyle.text}`}>{domain.name}</h2>
          <p className="text-sm text-kava-ink/50">Maximum {domain.maxPoints} points</p>
        </div>

        <div className="mb-8 space-y-4">
          {domain.questions.map((q) => (
            <KavaCard key={q.id}>
              <p className="mb-3 text-base leading-[1.75] font-medium text-kava-ink">{q.text}</p>
              {q.type === "yesno" ? (
                <div className="flex gap-3">
                  {[
                    { label: "Yes", pts: q.points },
                    { label: "No", pts: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAnswer(q.id, opt.pts)}
                      className={`rounded-lg border-2 px-5 py-2 text-sm font-bold transition-all ${answers[q.id] === opt.pts ? domainStyle.optionActive : domainStyle.optionInactive}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {q.scaleOptions?.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAnswer(q.id, opt.points)}
                      className={`rounded-lg border-2 px-4 py-2.5 text-left text-sm font-medium transition-all ${answers[q.id] === opt.points ? domainStyle.optionActive : domainStyle.optionInactive}`}
                    >
                      {opt.label}
                      <span className="ml-2 opacity-60">
                        ({opt.points > 0 ? "+" : ""}
                        {opt.points} pts)
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </KavaCard>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDomain(Math.max(0, currentDomain - 1))}
            disabled={currentDomain === 0}
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-bold text-kava-ink transition-opacity disabled:opacity-30"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {currentDomain < DOMAINS.length - 1 ? (
            <button
              onClick={() => setCurrentDomain(currentDomain + 1)}
              className={`flex items-center gap-1 rounded-lg px-6 py-2.5 text-sm font-bold text-white ${domainStyle.nextButton}`}
            >
              Next Domain
              <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={() => setShowResults(true)} className="rounded-lg bg-kava-saffron px-6 py-2.5 text-sm font-bold text-white">
              View Results
            </button>
          )}
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
