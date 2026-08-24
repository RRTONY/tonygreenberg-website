/**
 * IBOGA COMPASS — Interactive Assessment
 * Multi-section question flow with progress tracking,
 * priority rank drag-sort, and results display.
 */

import { useState, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";
import {
  ChevronRight,
  ChevronLeft,
  GripVertical,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Heart,
  Leaf,
  Brain,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import {
  type CompassAnswers,
  type DimensionKey,
  DIMENSION_KEYS,
  DIMENSION_LABELS,
  scoreAllFacilities,
  getInitialRankOrder,
  type FacilityResult,
} from "./iboga-compass-engine";

/* ─── Question Data ─── */

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: "single" | "multi";
  options: string[];
  warning?: string; // shown if certain option selected
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: Question[];
}

const SECTIONS: Section[] = [
  {
    id: "outcome",
    title: "What You're Seeking",
    icon: <Heart className="w-5 h-5" />,
    questions: [
      {
        id: "Q1",
        text: "What is your primary reason for seeking iboga/ibogaine?",
        type: "single",
        options: [
          "Substance dependency (opioids, alcohol, stimulants, etc.)",
          "PTSD, trauma, or treatment-resistant depression",
          "Neurodegenerative condition (TBI, Parkinson's, etc.)",
          "Spiritual exploration or Bwiti initiation",
          "Cognitive optimization or personal growth",
          "Process addiction (gambling, sex, food, screens)",
        ],
      },
      {
        id: "Q2",
        text: "How urgent is your timeline?",
        subtext: "This affects which facilities can accommodate you.",
        type: "single",
        options: [
          "Within 30 days — I need help now",
          "1–3 months — planning ahead",
          "3–6 months — researching options",
          "No rush — finding the right fit matters most",
        ],
      },
      {
        id: "Q3",
        text: "Which substances are you currently using or withdrawing from?",
        subtext: "Select all that apply. This directly routes you to specialized providers.",
        type: "multi",
        options: [
          "Opioids (heroin, fentanyl, oxy, morphine)",
          "Opioid replacement (Suboxone, methadone)",
          "Alcohol",
          "Cocaine / crack",
          "Methamphetamine",
          "Cannabis",
          "Nicotine",
          "Prescription stimulants (Adderall, Ritalin)",
          "Benzodiazepines (Xanax, Klonopin, Valium)",
          "Ketamine",
          "MDMA / ecstasy",
          "Polydrug (multiple substances daily)",
          "Process addiction (no substance)",
          "None — spiritual or optimization focus",
        ],
      },
    ],
  },
  {
    id: "medical",
    title: "Medical Safety",
    icon: <Shield className="w-5 h-5" />,
    questions: [
      {
        id: "Q4",
        text: "Do you have any personal cardiac history?",
        subtext: "Ibogaine affects the QT interval. Honest answers save lives.",
        type: "single",
        options: [
          "No known cardiac issues",
          "Minor — palpitations, mild murmur, managed hypertension",
          "Significant — arrhythmia, prolonged QT, prior cardiac event",
          "Unsure — have not had recent cardiac screening",
        ],
        warning: "If you selected 'Significant,' only the highest-safety facilities will be shown. Consider a full cardiac workup before proceeding.",
      },
      {
        id: "Q5",
        text: "Any family history of sudden cardiac death or Long QT Syndrome?",
        type: "single",
        options: [
          "No family cardiac history",
          "Yes — first-degree relative (parent, sibling)",
          "Yes — sudden cardiac death in family",
          "Unsure",
        ],
      },
      {
        id: "Q6",
        text: "Liver or kidney function?",
        subtext: "Ibogaine is metabolized by the liver (CYP2D6).",
        type: "single",
        options: [
          "Normal — no known issues",
          "Hepatitis C (active or cleared)",
          "Cirrhosis or significant liver damage",
          "Elevated enzymes or fatty liver",
          "Kidney concerns",
        ],
      },
      {
        id: "Q7",
        text: "Mental health history?",
        type: "single",
        options: [
          "No significant mental health history",
          "Depression or anxiety (managed)",
          "Bipolar disorder",
          "Psychosis or schizophrenia history",
          "Complex PTSD or dissociative disorders",
        ],
        warning: "Bipolar and psychosis history require specialized clinical oversight. Results will be filtered accordingly.",
      },
      {
        id: "Q8",
        text: "Current medications that interact with ibogaine?",
        subtext: "Many medications must be tapered before ibogaine. Select the most relevant.",
        type: "single",
        options: [
          "SSRIs or SNRIs",
          "Benzodiazepines",
          "Antipsychotics",
          "Methadone or Suboxone",
          "MAOIs",
          "None of the above",
        ],
      },
      {
        id: "Q9",
        text: "Are you pregnant or breastfeeding?",
        type: "single",
        options: [
          "No",
          "Yes — pregnant",
          "Yes — breastfeeding",
        ],
        warning: "Ibogaine is absolutely contraindicated during pregnancy and breastfeeding. No facility will be recommended.",
      },
    ],
  },
  {
    id: "approach",
    title: "Approach & Tradition",
    icon: <Leaf className="w-5 h-5" />,
    questions: [
      {
        id: "Q10",
        text: "Where do you fall on the medicine-ceremony spectrum?",
        type: "single",
        options: [
          "Full medical — hospital-grade monitoring, clinical setting",
          "Medical primary — clinical safety with some spiritual elements",
          "Balanced — equal weight to medical and ceremonial",
          "Ceremony primary — traditional setting with medical backup",
          "Pure Bwiti — traditional initiation, minimal Western medical overlay",
        ],
      },
      {
        id: "Q11",
        text: "How important is Bwiti lineage and cultural authenticity?",
        type: "single",
        options: [
          "Essential — I want trained Bwiti practitioners only",
          "Important — prefer lineage-trained facilitators",
          "Neutral — open to either approach",
          "Not important — clinical expertise matters more",
          "Prefer no ceremonial elements",
        ],
      },
      {
        id: "Q12",
        text: "How important is Nagoya Protocol reciprocity to you?",
        subtext: "Does the provider give back to Gabonese communities and sustainable iboga stewardship?",
        type: "single",
        options: [
          "Very important — I want to support indigenous stewardship",
          "Somewhat important — a factor in my decision",
          "Neutral",
          "Not a deciding factor",
        ],
      },
    ],
  },
  {
    id: "logistics",
    title: "Budget & Logistics",
    icon: <DollarSign className="w-5 h-5" />,
    questions: [
      {
        id: "Q13",
        text: "What is your total budget for treatment?",
        subtext: "Include travel, treatment, and aftercare.",
        type: "single",
        options: [
          "Under $5,000",
          "$5,000 – $10,000",
          "$10,000 – $20,000",
          "$20,000 – $50,000",
          "Open budget — best fit matters more than cost",
        ],
      },
      {
        id: "Q14",
        text: "How long can you be away?",
        type: "single",
        options: [
          "Up to 5 days",
          "5–10 days",
          "2–3 weeks",
          "1–2 months",
          "As long as it takes",
        ],
      },
    ],
  },
  {
    id: "geography",
    title: "Location & Access",
    icon: <MapPin className="w-5 h-5" />,
    questions: [
      {
        id: "Q16",
        text: "How far are you willing to travel?",
        type: "single",
        options: [
          "Anywhere in the world",
          "Western hemisphere + Europe",
          "North America only (Mexico, USA, Bahamas)",
          "Drive distance from US border only",
        ],
      },
      {
        id: "Q17",
        text: "Language requirements?",
        type: "single",
        options: [
          "English only",
          "English preferred, some Spanish OK",
          "Bilingual English/Spanish",
          "French or Portuguese acceptable",
          "Language is not a barrier",
        ],
      },
    ],
  },
  {
    id: "personal",
    title: "Personal Factors",
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        id: "Q19",
        text: "Are you a military veteran or first responder?",
        type: "single",
        options: [
          "Yes — active duty or veteran",
          "Yes — first responder (fire, EMS, police)",
          "No",
        ],
      },
      {
        id: "Q21",
        text: "How important is privacy and discretion?",
        type: "single",
        options: [
          "Critical — I'm a public figure or professional",
          "Very important — I don't want anyone to know",
          "Somewhat important",
          "Not a concern",
        ],
      },
      {
        id: "Q23",
        text: "Facility expectations?",
        type: "single",
        options: [
          "Luxury — private suite, gourmet food, spa amenities",
          "Comfortable — clean, private room, good food",
          "Simple — basic but clean and safe",
          "Rustic — I'm here for the medicine, not the hotel",
        ],
      },
      {
        id: "Q24",
        text: "Dietary requirements?",
        type: "single",
        options: [
          "Strict vegan",
          "Vegetarian",
          "No restrictions",
          "Other (will discuss with facility)",
        ],
      },
      {
        id: "Q25",
        text: "Will family or a partner accompany you?",
        type: "single",
        options: [
          "Yes — I need a family program",
          "Maybe — it would be nice",
          "No — solo journey",
        ],
      },
    ],
  },
  {
    id: "aftercare",
    title: "Integration & Aftercare",
    icon: <Brain className="w-5 h-5" />,
    questions: [
      {
        id: "Q26",
        text: "How much aftercare support do you want?",
        type: "single",
        options: [
          "Lifetime — ongoing community and check-ins",
          "6+ months of structured integration",
          "3 months of follow-up",
          "Minimal — I have my own support system",
        ],
      },
      {
        id: "Q27",
        text: "Risk tolerance?",
        subtext: "Some facilities prioritize safety above all; others offer deeper but less medically supervised experiences.",
        type: "single",
        options: [
          "Lowest risk possible — maximum medical oversight",
          "Balanced — reasonable safety with meaningful depth",
          "Higher risk acceptable — depth and authenticity over medical infrastructure",
        ],
      },
      {
        id: "Q28",
        text: "What matters most in your decision?",
        subtext: "This helps calibrate the final ranking.",
        type: "single",
        options: [
          "Track record — proven results with people like me",
          "Safety — the most medically rigorous option",
          "Authenticity — real Bwiti tradition and indigenous connection",
          "Value — best outcome for my budget",
          "Speed — fastest intake and treatment",
          "Comfort — the best physical experience",
        ],
      },
    ],
  },
];

/* ─── Component ─── */

type Phase = "questions" | "rank" | "gate" | "results";

export default function IbogaCompassAssessment() {
  const [phase, setPhase] = useState<Phase>("questions");
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<CompassAnswers>({});
  const [rankOrder, setRankOrder] = useState<DimensionKey[]>([...DIMENSION_KEYS]);
  const [results, setResults] = useState<FacilityResult[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const totalQuestions = useMemo(
    () => SECTIONS.reduce((acc, s) => acc + s.questions.length, 0),
    []
  );

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const section = SECTIONS[currentSection];

  const handleSingleAnswer = useCallback((questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  }, []);

  const handleMultiAnswer = useCallback((questionId: string, optionIdx: number) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as number[]) || [];
      const next = current.includes(optionIdx)
        ? current.filter((i) => i !== optionIdx)
        : [...current, optionIdx];
      return { ...prev, [questionId]: next };
    });
  }, []);

  const goNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection((s) => s + 1);
    } else {
      // Move to rank phase
      const initialRank = getInitialRankOrder(answers);
      setRankOrder(initialRank);
      setPhase("rank");
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
    }
  };

  const computeResults = () => {
    const scored = scoreAllFacilities(answers, rankOrder);
    setResults(scored);
    setPhase("gate"); // show lead-capture gate before results
  };

  const resetAssessment = () => {
    setPhase("questions");
    setCurrentSection(0);
    setAnswers({});
    setRankOrder([...DIMENSION_KEYS]);
    setResults([]);
  };

  /* ─── Drag & Drop for Rank ─── */
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newOrder = [...rankOrder];
    const [removed] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(idx, 0, removed);
    setRankOrder(newOrder);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const moveRankItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= DIMENSION_KEYS.length) return;
    const newOrder = [...rankOrder];
    const [removed] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, removed);
    setRankOrder(newOrder);
  };

  /* ─── Gate form state ─── */
  const [gateName, setGateName] = useState("");
  const [gateEmail, setGateEmail] = useState("");
  const [gateSituation, setGateSituation] = useState("");
  const [gateConsent, setGateConsent] = useState(false);
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [gateError, setGateError] = useState("");
  const sessionIdRef = useRef(`iboga-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const submitMutation = trpc.assessments.submit.useMutation();

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateName.trim() || !gateEmail.trim() || !gateSituation.trim() || !gateConsent) return;
    setGateSubmitting(true);
    setGateError("");
    try {
      // Build structured answers array for the notification
      const QUESTION_TEXTS: Record<string, string> = {
        Q1: "Primary reason", Q2: "Timeline", Q3: "Substances", Q4: "Cardiac history",
        Q5: "Family cardiac history", Q6: "Liver/kidney", Q7: "Mental health", Q8: "Medications",
        Q9: "Pregnant/breastfeeding", Q10: "Medicine-ceremony spectrum", Q11: "Bwiti lineage importance",
        Q12: "Nagoya reciprocity", Q13: "Budget", Q14: "Time away", Q16: "Travel distance",
        Q17: "Language", Q19: "Veteran/first responder", Q21: "Privacy importance",
        Q23: "Facility expectations", Q24: "Dietary requirements", Q25: "Family accompanying",
        Q26: "Aftercare support", Q27: "Risk tolerance", Q28: "Decision priority",
      };
      const Q1_OPTIONS = ["Substance dependency","PTSD/trauma/depression","Neurodegenerative","Spiritual/Bwiti","Cognitive optimization","Process addiction"];
      const Q13_OPTIONS = ["Under $5,000","$5,000–$8,000","$8,000–$15,000","$15,000–$25,000","$25,000+","Cost is secondary"];
      const answersArr = Object.entries(answers).map(([qId, val]) => ({
        questionId: QUESTION_TEXTS[qId] || qId,
        answer: Array.isArray(val) ? val.map(String) : String(val),
      }));
      const eligible = results.filter(r => !r.eliminated);
      const top3 = eligible.slice(0, 3).map(r => ({ name: r.facility.name, score: r.matchPercent, reason: r.whyMatched }));
      const primaryGoalIdx = typeof answers["Q1"] === "number" ? answers["Q1"] as number : -1;
      const budgetIdx = typeof answers["Q13"] === "number" ? answers["Q13"] as number : -1;
      const resultSummary = JSON.stringify({
        topMatches: top3,
        primaryGoal: primaryGoalIdx >= 0 ? Q1_OPTIONS[primaryGoalIdx] : "Unknown",
        budgetRange: budgetIdx >= 0 ? Q13_OPTIONS[budgetIdx] : "Unknown",
        eligibleCount: eligible.length,
      });
      await submitMutation.mutateAsync({
        assessmentType: "iboga-compass",
        sessionId: sessionIdRef.current,
        answers: JSON.stringify(answersArr),
        resultSummary,
        totalScore: eligible.length > 0 ? eligible[0].matchPercent : 0,
        sharedWithTony: true,
        userName: gateName.trim(),
        userEmail: gateEmail.trim(),
        situation: gateSituation.trim(),
      });
      setPhase("results");
    } catch (err) {
      setGateError("Something went wrong. Please try again.");
    } finally {
      setGateSubmitting(false);
    }
  };

  /* ─── Render ─── */

  if (phase === "results") {
    return <ResultsView results={results} onReset={resetAssessment} />;
  }

  if (phase === "gate") {
    return (
    <>
    <SEO
        title="Iboga Compass Assessment — PRI"
        description="A personalized assessment to determine your readiness and fit for iboga or ibogaine therapy."
        path="/psychedelic-readiness-index/iboga-compass"
        keywords="Tony Greenberg, iboga assessment, ibogaine readiness, iboga compass, psychedelic readiness"
        indexable={true}
      />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "#f5f0e8" }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: "#8B6914" }} />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl mb-3" style={{ color: "#1a1a1a" }}>
            Your matches are ready.
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed max-w-lg mx-auto">
            Before I show you which facilities match your profile — and why — I want to be direct about how this works.
          </p>
        </div>

        <Card className="p-6 mb-6" style={{ borderColor: "#e8e0d0", background: "#fdfbf7" }}>
          <p className="text-base text-neutral-700 leading-relaxed mb-4">
            I review every submission personally. I've sat with this medicine. I know these facilities. When I send an introduction, it means I believe it's the right match for your situation. No cold leads. No automated referrals. A human connection from someone who has done the work.
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Your assessment profile — goals, medical flags, timeline, budget, values — travels with your submission so I have context before I reach out.
          </p>
        </Card>

        <form onSubmit={handleGateSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={gateName}
              onChange={e => setGateName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": "#8B6914" } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={gateEmail}
              onChange={e => setGateEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              In one sentence, what are you seeking? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={gateSituation}
              onChange={e => setGateSituation(e.target.value)}
              placeholder="e.g. I'm a veteran with treatment-resistant PTSD looking for a real path forward."
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            />
            <p className="text-xs text-neutral-400 mt-1">{gateSituation.length}/200</p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: "#f5f0e8" }}>
            <input
              type="checkbox"
              id="gate-consent"
              required
              checked={gateConsent}
              onChange={e => setGateConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: "#8B6914" }}
            />
            <label htmlFor="gate-consent" className="text-sm text-neutral-700 leading-relaxed cursor-pointer">
              I consent to Tony Greenberg reviewing my assessment and making an introduction to relevant facilities.
            </label>
          </div>

          {gateError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{gateError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={gateSubmitting || !gateName.trim() || !gateEmail.trim() || !gateSituation.trim() || !gateConsent}
            className="w-full py-4 text-base font-semibold"
            style={{ backgroundColor: gateSubmitting ? "#a08040" : "#8B6914", color: "#fff" }}
          >
            {gateSubmitting ? "Submitting..." : "Show My Matches →"}
          </Button>

          <p className="text-xs text-neutral-400 text-center leading-relaxed">
            Your information is not shared with any facility until Tony reviews your submission and makes a personal introduction.
            You will receive your matches immediately after submitting.
          </p>
        </form>
      </div>
    </>);
  }

  if (phase === "rank") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2
            className="font-serif text-2xl md:text-3xl mb-3"
            style={{ color: "#1a1a1a" }}
          >
            Priority Rank
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            Drag to reorder what matters most to you. The top dimension gets 2x
            weight; the bottom gets 0.5x. This is the final calibration before
            your results.
          </p>
        </div>

        <div className="space-y-2 mb-8">
          {rankOrder.map((key, idx) => (
            <div
              key={key}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                draggedIdx === idx
                  ? "border-amber-500 bg-amber-50 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
              <span
                className="text-sm font-mono w-6 text-center shrink-0"
                style={{ color: "#8B6914" }}
              >
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-neutral-800 flex-1">
                {DIMENSION_LABELS[key]}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {(
                  [2.0, 1.7, 1.4, 1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5][idx] ?? 0.5
                ).toFixed(1)}x
              </span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveRankItem(idx, idx - 1)}
                  disabled={idx === 0}
                  className="text-neutral-400 hover:text-neutral-700 disabled:opacity-20 p-0.5"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveRankItem(idx, idx + 1)}
                  disabled={idx === DIMENSION_KEYS.length - 1}
                  className="text-neutral-400 hover:text-neutral-700 disabled:opacity-20 p-0.5"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setPhase("questions");
              setCurrentSection(SECTIONS.length - 1);
            }}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Questions
          </Button>
          <Button
            onClick={computeResults}
            className="flex-1"
            style={{ backgroundColor: "#8B6914" }}
          >
            Show My Matches <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  /* ─── Questions Phase ─── */
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Section {currentSection + 1} of {SECTIONS.length}
          </span>
          <span className="text-xs font-mono text-neutral-500">
            {progress}% complete
          </span>
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: "#8B6914",
            }}
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#f5f0e8" }}
        >
          {section.icon}
        </div>
        <h2
          className="font-serif text-xl md:text-2xl"
          style={{ color: "#1a1a1a" }}
        >
          {section.title}
        </h2>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {section.questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            answer={answers[q.id]}
            onSingleAnswer={handleSingleAnswer}
            onMultiAnswer={handleMultiAnswer}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-10 pt-6 border-t border-neutral-100">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentSection === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <Button
          onClick={goNext}
          className="flex-1"
          style={{ backgroundColor: "#8B6914" }}
        >
          {currentSection === SECTIONS.length - 1 ? "Rank Priorities" : "Next"}{" "}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Question Card ─── */

function QuestionCard({
  question,
  answer,
  onSingleAnswer,
  onMultiAnswer,
}: {
  question: Question;
  answer: number | number[] | undefined;
  onSingleAnswer: (qId: string, idx: number) => void;
  onMultiAnswer: (qId: string, idx: number) => void;
}) {
  const selectedSingle = typeof answer === "number" ? answer : -1;
  const selectedMulti = Array.isArray(answer) ? answer : [];

  const showWarning =
    question.warning &&
    ((question.id === "Q4" && selectedSingle === 2) ||
      (question.id === "Q7" && (selectedSingle === 2 || selectedSingle === 3)) ||
      (question.id === "Q9" && (selectedSingle === 1 || selectedSingle === 2)));

  return (
    <div>
      <p className="text-base font-medium text-neutral-800 mb-1">
        {question.text}
      </p>
      {question.subtext && (
        <p className="text-sm text-neutral-500 mb-3">{question.subtext}</p>
      )}

      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const isSelected =
            question.type === "single"
              ? selectedSingle === idx
              : selectedMulti.includes(idx);

          return (
            <button
              key={idx}
              onClick={() =>
                question.type === "single"
                  ? onSingleAnswer(question.id, idx)
                  : onMultiAnswer(question.id, idx)
              }
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                isSelected
                  ? "border-amber-600 bg-amber-50 text-neutral-900"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-${question.type === "single" ? "full" : "sm"} border-2 shrink-0 flex items-center justify-center ${
                    isSelected ? "border-amber-600" : "border-neutral-300"
                  }`}
                >
                  {isSelected && (
                    <span
                      className={`w-2 h-2 rounded-${question.type === "single" ? "full" : "sm"}`}
                      style={{ backgroundColor: "#8B6914" }}
                    />
                  )}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {showWarning && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{question.warning}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Results View ─── */

function ResultsView({
  results,
  onReset,
}: {
  results: FacilityResult[];
  onReset: () => void;
}) {
  const eligible = results.filter((r) => !r.eliminated);
  const eliminated = results.filter((r) => r.eliminated);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h2
          className="font-serif text-2xl md:text-3xl mb-3"
          style={{ color: "#1a1a1a" }}
        >
          Your Compass Results
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed">
          {eligible.length} facilities matched your profile.{" "}
          {eliminated.length > 0 &&
            `${eliminated.length} were filtered out by your medical or logistical requirements.`}
        </p>
      </div>

      {eligible.length === 0 ? (
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Facilities Match</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Your medical profile or filters eliminated all options. This may
            indicate ibogaine is contraindicated for you, or your requirements
            are too restrictive.
          </p>
          <Button onClick={onReset} variant="outline">
            Retake Assessment
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {eligible.slice(0, 5).map((result, idx) => (
            <FacilityCard key={result.facility.id} result={result} rank={idx + 1} />
          ))}
        </div>
      )}

      {/* Eliminated */}
      {eliminated.length > 0 && (
        <div className="mt-12">
          <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 mb-4">
            Filtered Out ({eliminated.length})
          </h3>
          <div className="space-y-3">
            {eliminated.slice(0, 5).map((result) => (
              <div
                key={result.facility.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100"
              >
                <div>
                  <span className="text-sm font-medium text-neutral-500 line-through">
                    {result.facility.name}
                  </span>
                  <span className="text-xs text-neutral-400 ml-2">
                    {result.facility.location}
                  </span>
                </div>
                <span className="text-xs text-red-500">
                  {result.eliminationReason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <strong>Disclaimer:</strong> The Iboga Compass is an informational
          tool, not medical advice. Scores are based on publicly available
          information and the Compass v2 methodology. Always conduct your own
          due diligence, verify facility credentials, and consult with a
          physician before undergoing ibogaine treatment. Facility scores may
          change as new information becomes available.
        </p>
      </div>

      {/* Reset */}
      <div className="mt-8 text-center">
        <Button onClick={onReset} variant="outline">
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}

/* ─── Facility Card ─── */

function FacilityCard({ result, rank }: { result: FacilityResult; rank: number }) {
  const { facility, score, matchPercent, topDimensions, whyMatched } = result;

  const medalColors: Record<number, string> = {
    1: "#D4B96A",
    2: "#A0A0A0",
    3: "#CD7F32",
  };
  const medalColor = medalColors[rank] || "#666";

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: medalColor }}
            >
              #{rank}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {facility.name}
              </h3>
              <p className="text-sm text-neutral-500">{facility.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-bold"
              style={{ color: "#8B6914" }}
            >
              {matchPercent}%
            </div>
            <div className="text-xs text-neutral-400">match</div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-neutral-600 mb-4 italic">
          {facility.tagline}
        </p>

        {/* Why Matched */}
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wider">
              Why This Matched
            </span>
          </div>
          <p className="text-sm text-amber-900">{whyMatched}</p>
        </div>

        {/* Top Dimensions */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {topDimensions.map((dim) => (
            <div
              key={dim.key}
              className="text-center p-2 rounded bg-neutral-50"
            >
              <div className="text-xs text-neutral-500 mb-1">{dim.label}</div>
              <div className="text-sm font-bold text-neutral-800">
                {(facility[dim.key as keyof typeof facility] as number)}/10
              </div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
            {facility.priceRange}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
            {facility.durationDays[0]}–{facility.durationDays[1]} days
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 capitalize">
            {facility.approach}
          </span>
          {facility.veteranFocus && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              Veteran Focus
            </span>
          )}
        </div>

        {/* Highlights */}
        <ul className="space-y-1">
          {facility.highlights.map((h, i) => (
            <li key={i} className="text-xs text-neutral-600 flex items-start gap-2">
              <Star className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
              {h}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <a
            href={facility.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
            style={{ color: "#8B6914" }}
          >
            Visit {facility.shortName} →
          </a>
        </div>
      </div>
    </Card>
  );
}
