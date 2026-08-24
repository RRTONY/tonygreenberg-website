import { useState, useMemo } from "react";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";
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
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import SEO from "@/components/SEO";

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
  color: string;
  questions: Question[];
}

const DOMAINS: Domain[] = [
  {
    id: "somatic",
    name: "Somatic Readiness",
    maxPoints: 25,
    color: "#3B82F6",
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
    color: "#8B5CF6",
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
    color: "#10B981",
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
    color: KAVA.saffron,
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
    color: KAVA.terracotta,
    questions: [
      { id: "i1", text: "Post-journey support structure identified before ceremony date?", type: "yesno", points: 3 },
      { id: "i2", text: "Integration circle scheduled within 7 days of journey?", type: "yesno", points: 3 },
      { id: "i3", text: "Trusted community member or therapist available for follow-up?", type: "yesno", points: 4 },
      { id: "i4", text: "Post-journey kava protocol in place?", type: "yesno", points: 5 },
    ],
  },
];

type Answers = Record<string, number>;

function getRecommendation(score: number) {
  if (score >= 85) return { label: "CLEARED", color: "#16a34a", desc: "Proceed to journey." };
  if (score >= 70) return { label: "CONDITIONAL", color: "#d97706", desc: "Address flagged domains; re-assess within 2 weeks." };
  if (score >= 50) return { label: "DEFER", color: "#ea580c", desc: "Additional preparation work required; 30-day minimum before re-assessment." };
  return { label: "NOT READY", color: "#dc2626", desc: "Significant support intervention needed before PRI pathway continues." };
}

export default function KavaAssessment() {
  const [currentDomain, setCurrentDomain] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const domain = DOMAINS[currentDomain];

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
  }, [answers]);

  const recommendation = getRecommendation(totalScore);

  const allAnswered = DOMAINS.every((d) =>
    d.questions.every((q) => q.points === 0 && q.type === "yesno" ? true : answers[q.id] !== undefined)
  );

  const reset = () => {
    setAnswers({});
    setCurrentDomain(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
    <>
    <SEO
        title="Kava Assessment — Find Your Kava"
        description="A personalized kava assessment to find the right variety and preparation for your needs."
        path="/kava/assessment"
        keywords="Tony Greenberg, kava assessment, find my kava, kava quiz"
        indexable={true}
      />
      <KavaLayout>
        <KavaHero eyebrow="PRI Assessment" title="Your Results" />
        <KavaSection>
          {/* Score Circle */}
          <div className="text-center mb-8">
            <div
              className="w-40 h-40 rounded-full mx-auto flex flex-col items-center justify-center mb-4"
              style={{ border: `6px solid ${recommendation.color}`, backgroundColor: recommendation.color + "10" }}
            >
              <p className="text-5xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: recommendation.color }}>
                {totalScore}
              </p>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: recommendation.color }}>
                / 100
              </p>
            </div>
            <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: recommendation.color }}>
              {recommendation.label}
            </p>
            <p className="text-base" style={{ color: KAVA.ink, opacity: 0.7, lineHeight: 1.75 }}>
              {recommendation.desc}
            </p>
          </div>

          {/* Domain Breakdown */}
          <KavaSectionTitle>Domain Breakdown</KavaSectionTitle>
          <div className="space-y-4 mb-8">
            {DOMAINS.map((d) => {
              const score = domainScore(d);
              const pct = Math.round((score / d.maxPoints) * 100);
              return (
                <KavaCard key={d.id}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-base" style={{ fontFamily: "'Fraunces', serif" }}>
                      {d.name}
                    </h4>
                    <span className="font-bold" style={{ color: d.color }}>
                      {score} / {d.maxPoints}
                    </span>
                  </div>
                  <div className="h-3 rounded-full" style={{ backgroundColor: KAVA.sandMuted }}>
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </KavaCard>
              );
            })}
          </div>

          <div className="flex justify-center">
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="kava"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ recommendation: recommendation?.label, totalScore })}
              totalScore={null}
            />

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: KAVA.saffron }}
            >
              <RotateCcw size={16} />

              Start Over
            </button>
          </div>
        </KavaSection>
        <KavaDisclaimer />
      </KavaLayout>
    </>);
  }

  return (
    <KavaLayout>
      <KavaHero
        eyebrow="Module 5"
        title="PRI Assessment"
        subtitle="Five-domain readiness scoring producing a PRI score of 0 to 100 with a recommendation for ceremony clearance."
      />

      <KavaSection>
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {DOMAINS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setCurrentDomain(i)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
              style={{
                backgroundColor: i === currentDomain ? d.color : "transparent",
                color: i === currentDomain ? "#fff" : KAVA.ink,
                opacity: i === currentDomain ? 1 : 0.5,
                border: `1px solid ${i === currentDomain ? d.color : KAVA.sandMuted}`,
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: i === currentDomain ? "rgba(255,255,255,0.3)" : d.color + "20",
                  color: i === currentDomain ? "#fff" : d.color,
                }}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{d.name}</span>
            </button>
          ))}
        </div>

        {/* Domain Header */}
        <div className="mb-6">
          <KavaBadge color="saffron">
            Domain {currentDomain + 1} of {DOMAINS.length}
          </KavaBadge>
          <h2
            className="font-bold text-2xl mt-2"
            style={{ fontFamily: "'Fraunces', serif", color: domain.color }}
          >
            {domain.name}
          </h2>
          <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.5 }}>
            Maximum {domain.maxPoints} points
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-8">
          {domain.questions.map((q) => (
            <KavaCard key={q.id}>
              <p className="font-medium text-base mb-3" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                {q.text}
              </p>
              {q.type === "yesno" ? (
                <div className="flex gap-3">
                  {[
                    { label: "Yes", pts: q.points },
                    { label: "No", pts: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAnswer(q.id, opt.pts)}
                      className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{
                        backgroundColor: answers[q.id] === opt.pts ? domain.color : "#fff",
                        color: answers[q.id] === opt.pts ? "#fff" : KAVA.ink,
                        border: `2px solid ${answers[q.id] === opt.pts ? domain.color : KAVA.sandMuted}`,
                      }}
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
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all"
                      style={{
                        backgroundColor: answers[q.id] === opt.points ? domain.color : "#fff",
                        color: answers[q.id] === opt.points ? "#fff" : KAVA.ink,
                        border: `2px solid ${answers[q.id] === opt.points ? domain.color : KAVA.sandMuted}`,
                      }}
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

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDomain(Math.max(0, currentDomain - 1))}
            disabled={currentDomain === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-opacity disabled:opacity-30"
            style={{ color: KAVA.ink }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {currentDomain < DOMAINS.length - 1 ? (
            <button
              onClick={() => setCurrentDomain(currentDomain + 1)}
              className="flex items-center gap-1 px-6 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: domain.color }}
            >
              Next Domain
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => setShowResults(true)}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: KAVA.saffron }}
            >
              View Results
            </button>
          )}
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
  );
}
