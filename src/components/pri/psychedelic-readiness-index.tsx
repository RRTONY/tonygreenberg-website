"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X, AlertTriangle, Ban, Star, FileText, CheckCircle2, Target } from "lucide-react";
import {
  MEDICINES,
  QUESTIONS,
  DIM_LABELS,
  DIM_ICONS,
  SLIDER_LABELS,
  MAOB_INTERACTIONS,
  MAOB_WASHOUT,
  MEDICATION_INTERACTIONS,
  CRISIS_RESOURCES,
  PATHWAY_QUESTIONS,
  type Medicine,
  type MedicineWithSafety,
  type DimKey,
} from "@/lib/content/pri-data";
import { MEDICINE_IMAGES } from "@/lib/content/pri-medicine-images";
import {
  getMedicineWithSafety,
  computeScores,
  TAG_CLASS,
  DEFAULT_TAG_CLASS,
} from "@/lib/content/pri-shared";
import { DisclaimerGate } from "@/components/pri/disclaimer-gate";
import { MedicineModal } from "@/components/pri/medicine-modal";
import { PriShareBar } from "@/components/pri/share-bar";
import { CinematicBand } from "@/components/pri/cinematic-band";
import { readVisitorState, writeVisitorState } from "@/lib/visitor-state-client";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

type PriVisitorState = { consented?: boolean; savedMedicineIds?: string[] };
const EMPTY_PRI_STATE: PriVisitorState = {};
const priListeners = new Set<() => void>();
let priState: PriVisitorState = EMPTY_PRI_STATE;
let priHydrated = false;

function emitPriChange() {
  priListeners.forEach((listener) => listener());
}

function hydratePriState() {
  if (priHydrated) return;
  priHydrated = true;
  void readVisitorState<PriVisitorState>("pri")
    .then((state) => {
      priState = {
        consented: state?.consented === true,
        savedMedicineIds: Array.isArray(state?.savedMedicineIds)
          ? state.savedMedicineIds.filter((id): id is string => typeof id === "string")
          : [],
      };
      emitPriChange();
    })
    .catch(() => undefined);
}

function subscribePriState(listener: () => void) {
  priListeners.add(listener);
  hydratePriState();
  return () => priListeners.delete(listener);
}

function getPriStateSnapshot() {
  return priState;
}

function persistPriState(next: PriVisitorState) {
  priState = { ...priState, ...next };
  emitPriChange();
  void writeVisitorState("pri", next).catch(() => undefined);
}

type AppState = "philosophy" | "intro" | "quiz" | "pathway" | "results";

const PHILOSOPHY_PARAGRAPHS = [
  {
    text: "The diode of perception tethering movement to bone accelerates the other fundamental processes of life.",
    italic: false,
  },
  {
    text: "Beyond hunger, what you think of as necessity or craving is automatically fulfilled in the quickening of the senses — as spirit reaches in to taste the body.",
    italic: true,
  },
  {
    text: "Things of the past and future, things that you touch for pleasure — the pleasure is what electrical current you offer that thing.",
    italic: false,
  },
  {
    text: "If it is a living body — animal or human — it knows your love as you embrace its presence with your energetic breath: the waves of awareness stemming from that which you control your body from spirit.",
    italic: true,
  },
  {
    text: "The sharpening of will takes place as the simplicity of life — the places where your awareness cannot escape the body to forget itself in idle pastures, but remains alive in the sensation of time slowing across the curve of heartbeat weaving breath.",
    italic: false,
  },
];

// Ported from legacy client/src/pages/pri/PsychedelicReadinessIndex.tsx —
// the real 39-medicine pharmacopoeia, real 50+ question / 6-domain
// assessment, real MAO-B interaction matrix, real medication interaction
// guide, real compare/save/PDF-export tooling, all
// unchanged and verbatim. Kept as a single client island since one state
// machine (`state`) drives which section renders — same call already made
// for other large multi-step assessments this migration.
//
// Real simplifications from legacy, each an honest-degradation call
// consistent with the rest of this migration:
// - `trpc.pri.submitConsent` / `trpc.pri.submitCorrection` /
//   `trpc.assessments.submit` (three backend mutations never built) are all
//   dropped. Consent and saved medicines use the managed, cookie-backed
//   visitor-state service. The correction form and
//   referral form use real `mailto:` fallbacks instead (see
//   `correction-form.tsx` and this file's referral card) rather than
//   reproducing a submit call with nothing behind it — legacy's correction
//   form's error path was a real fake-success bug ("still show success for
//   UX" even when the mutation threw), not reproduced here.
// - The inert "Add my results to the research pool" checkbox (no handler,
//   no effect, in legacy too) is dropped rather than shipped as a checkbox
//   that does nothing.
// - The legacy `<style>` block's shimmer/glow/scanline `@keyframes` and the
//   `glitch-scanlines`/`glitch-tear` decorative overlay divs are dropped —
//   same "decoration not worth the cost" call made throughout this
//   migration (the real hero photography underneath is kept, via
//   `cinematic-band.tsx`).
// - Legacy's duplicate "download results" affordance (a custom `exportPDF`
//   button immediately followed by a second, differently-behaved
//   `<AssessmentResultActions>` component) is collapsed to just the real,
//   fully-featured custom PDF export — it already covers dimension scores,
//   top matches, the healing sequence, and saved medicines; the second
//   button offered a plainer print with none of that.
// - Framer-motion's staggered grid-entrance animation on the medicine grid
//   is dropped (`no framer-motion` — CONTRIBUTING.md rule 5); the grid
//   renders directly.
// - Real stale-count bug found and fixed: the `MEDICINES` dataset has grown
//   to 39 entries, but every hardcoded "26" in legacy's copy (hero subhead,
//   grid heading, stats bar, alt text) was never updated to match — same
//   class of bug as BrewSoul's stale "103 Coffees" label fixed earlier in
//   this migration. Replaced with `MEDICINES.length` everywhere so it can't
//   drift again.
export function PsychedelicReadinessIndex() {
  const [state, setState] = useState<AppState>("philosophy");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => new Array(QUESTIONS.length).fill(5));
  const [pathwayAnswers, setPathwayAnswers] = useState<Record<string, number>>(() =>
    Object.fromEntries(PATHWAY_QUESTIONS.map((q) => [q.id, 5])),
  );
  const [currentPathwayQ, setCurrentPathwayQ] = useState(0);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineWithSafety | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [referralConsent, setReferralConsent] = useState(false);
  const [referralName, setReferralName] = useState("");
  const [referralEmail, setReferralEmail] = useState("");
  const [referralRegion, setReferralRegion] = useState("");
  const [referralSent, setReferralSent] = useState(false);
  const [pendingMedicineId, setPendingMedicineId] = useState<string | null>(null);

  const visitorState = useSyncExternalStore(
    subscribePriState,
    getPriStateSnapshot,
    () => EMPTY_PRI_STATE,
  );
  const hasConsent = visitorState.consented === true;
  const savedMeds = useMemo(
    () => visitorState.savedMedicineIds ?? [],
    [visitorState.savedMedicineIds],
  );

  const toggleSaved = useCallback(
    (id: string) => {
      const next = savedMeds.includes(id)
        ? savedMeds.filter((savedId) => savedId !== id)
        : [...savedMeds, id];
      persistPriState({ savedMedicineIds: next });
    },
    [savedMeds],
  );

  const assessmentRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (state !== "results") return null;
    return computeScores(answers);
  }, [state, answers]);

  const exportPDF = useCallback(() => {
    if (!results) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dimRows = (Object.keys(results.dimScores) as DimKey[])
      .map((d) => {
        const score = results.dimScores[d];
        const barColor = score >= 75 ? "#2E7D32" : score >= 50 ? "#9333EA" : "#6B21A8";
        return `<tr><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;font-weight:700;width:40%">${DIM_ICONS[d]} ${DIM_LABELS[d]}</td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;width:40%"><div style="background:#F0EBE3;height:8px;border-radius:4px;overflow:hidden"><div style="height:100%;width:${score}%;background:${barColor};border-radius:4px"></div></div></td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;text-align:center;font-size:1.1rem;font-weight:900;width:20%">${score}<small style='font-size:.7rem;color:#7A6A5A'>/100</small></td></tr>`;
      })
      .join("");
    const matchRows = results.topMatches
      .map((m, i) => {
        const barColor =
          m.matchScore >= 80 ? "#2E7D32" : m.matchScore >= 60 ? "#9333EA" : "#6B21A8";
        return `<tr><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;font-weight:800;color:#6B21A8;width:8%">#${i + 1}</td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;font-weight:700;width:32%">${m.icon} ${m.name}</td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;width:40%"><div style="background:#F0EBE3;height:8px;border-radius:4px;overflow:hidden"><div style="height:100%;width:${m.matchScore}%;background:${barColor};border-radius:4px"></div></div></td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;text-align:center;font-weight:800;width:20%">${m.matchScore}%</td></tr>`;
      })
      .join("");
    const seqRows = results.sequence
      .map(
        (s, i) =>
          `<tr><td style="padding:12px 14px;border-bottom:1px solid #E8E0D6"><div style="display:flex;align-items:center;gap:8px"><span style="background:#6B21A8;color:#fff;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-size:.7rem;font-weight:900;flex-shrink:0">${i + 1}</span><strong>${s.icon} ${s.name}</strong></div><div style="font-size:.82rem;color:#7A6A5A;margin-top:4px;padding-left:32px">${s.why}</div></td><td style="padding:12px 14px;border-bottom:1px solid #E8E0D6;font-size:.85rem;color:#4A3F35;white-space:nowrap;vertical-align:top">${s.time}</td><td style="padding:12px 14px;border-bottom:1px solid #E8E0D6;font-weight:700;white-space:nowrap;vertical-align:top">${s.cost}</td></tr>`,
      )
      .join("");
    const savedSection =
      savedMeds.length > 0
        ? `<h2>My Saved Medicines</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin:1rem 0">${savedMeds
            .map((id) => {
              const m = MEDICINES.find((med) => med.id === id);
              return m
                ? `<div style="background:#F8F5F0;border:1px solid #E8E0D6;padding:10px 14px;display:flex;align-items:center;gap:8px"><span style="font-size:1.3rem">${m.icon}</span><div><div style="font-weight:700;font-size:.9rem">${m.name}</div><div style="font-size:.75rem;color:#7A6A5A;text-transform:uppercase;letter-spacing:.04em">${m.src}</div></div></div>`
                : "";
            })
            .join("")}</div>`
        : "";
    w.document
      .write(`<!DOCTYPE html><html><head><title>Psychedelic Readiness Index ... Personal Report</title><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Georgia,'Times New Roman',serif;max-width:780px;margin:0 auto;padding:40px 30px;color:#1C1410;background:#fff}
      h1{font-size:1.6rem;font-weight:900;letter-spacing:-.02em;margin-bottom:4px}
      h2{font-size:.85rem;color:#6B21A8;margin-top:2.5rem;margin-bottom:1rem;text-transform:uppercase;letter-spacing:.12em;font-weight:800;padding-bottom:6px;border-bottom:2px solid #6B21A8}
      table{width:100%;border-collapse:collapse;margin:.5rem 0}
      .header{text-align:center;padding-bottom:1.5rem;border-bottom:3px solid #1C1410;margin-bottom:2rem}
      .header .brand{font-size:.7rem;text-transform:uppercase;letter-spacing:.2em;color:#6B21A8;font-weight:800;margin-bottom:8px}
      .header .title{font-size:1.8rem;font-weight:900;letter-spacing:-.02em}
      .header .date{font-size:.8rem;color:#7A6A5A;margin-top:6px}
      .score-block{text-align:center;margin:2rem 0;padding:2rem;background:#FAF7F2;border:1px solid #E8E0D6}
      .score-block .number{font-size:4.5rem;font-weight:900;color:#6B21A8;line-height:1}
      .score-block .label{font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-top:.3rem}
      .score-block .desc{font-size:.85rem;color:#7A6A5A;max-width:480px;margin:.75rem auto 0;line-height:1.6}
      .disclaimer{background:#FFF8E1;border:1px solid #E8E0D6;padding:16px 20px;font-size:.78rem;margin-top:2.5rem;line-height:1.7;color:#5D4E3C}
      .disclaimer strong{color:#6B21A8}
      .footer{text-align:center;margin-top:2rem;padding-top:1rem;border-top:1px solid #E8E0D6;font-size:.75rem;color:#A09080}
      @media print{body{margin:0;padding:20px;font-size:11pt}h2{page-break-after:avoid}.score-block{page-break-inside:avoid}}
    </style></head><body>
      <div class="header">
        <div class="brand">ImpactSoul &times; TonyGreenberg.com</div>
        <div class="title">Psychedelic Readiness Index</div>
        <div class="date">Personal Report ... ${dateStr}</div>
      </div>
      <div class="score-block">
        <div class="number">${results.overall}</div>
        <div class="label">${results.level.label}</div>
        <div class="desc">${results.level.description}</div>
      </div>
      <h2>Dimension Breakdown</h2>
      <table>${dimRows}</table>
      <h2>Top Medicine Matches</h2>
      <table>${matchRows}</table>
      <h2>Recommended Healing Sequence</h2>
      <table><tr><th style="text-align:left;padding:8px 14px;border-bottom:2px solid #1C1410;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em">Step &amp; Rationale</th><th style="text-align:left;padding:8px 14px;border-bottom:2px solid #1C1410;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em">Timing</th><th style="text-align:left;padding:8px 14px;border-bottom:2px solid #1C1410;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em">Est. Cost</th></tr>${seqRows}</table>
      ${savedSection}
      <div class="disclaimer"><strong>Disclaimer:</strong> This is not medical advice. The Psychedelic Readiness Index is a community-aggregated educational tool. It does not constitute medical advice, diagnosis, or treatment. No medicine, provider, or protocol listed here constitutes an endorsement or recommendation. Always consult qualified healthcare professionals before engaging with any psychedelic substance. You proceed entirely at your own risk. Many substances discussed are illegal in various jurisdictions. You are responsible for knowing and following the laws where you live.</div>
      <div class="footer">Generated at tonygreenberg.com/psychedelic-readiness-index ... ${dateStr}</div>
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }, [results, savedMeds]);

  const handleSliderChange = useCallback(
    (value: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQ] = value;
        return next;
      });
    },
    [currentQ],
  );

  const nextQuestion = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setState("pathway");
      setCurrentPathwayQ(0);
      setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [currentQ]);

  const nextPathwayQuestion = useCallback(() => {
    if (currentPathwayQ < PATHWAY_QUESTIONS.length - 1) {
      setCurrentPathwayQ((q) => q + 1);
    } else if (!hasConsent) {
      setShowDisclaimer(true);
    } else {
      setState("results");
      setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [currentPathwayQ, hasConsent]);

  const prevPathwayQuestion = useCallback(() => {
    if (currentPathwayQ > 0) {
      setCurrentPathwayQ((q) => q - 1);
    } else {
      setState("quiz");
      setCurrentQ(QUESTIONS.length - 1);
    }
  }, [currentPathwayQ]);

  const handleConsentComplete = useCallback(() => {
    persistPriState({ consented: true });
    setShowDisclaimer(false);
    setState("results");
    setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const prevQuestion = useCallback(() => {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  }, [currentQ]);

  const startQuiz = useCallback(() => {
    setState("quiz");
    setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQ(0);
    setAnswers(new Array(QUESTIONS.length).fill(5));
    setCurrentPathwayQ(0);
    setPathwayAnswers(Object.fromEntries(PATHWAY_QUESTIONS.map((q) => [q.id, 5])));
    setState("intro");
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const sliderLabel = useMemo(() => {
    const v = answers[currentQ];
    const idx = Math.round(((v - 1) / 9) * 4);
    return SLIDER_LABELS[idx];
  }, [answers, currentQ]);

  const handleMedicineClick = useCallback(
    (m: Medicine) => {
      const mws = getMedicineWithSafety(m);
      if (!hasConsent) {
        setShowDisclaimer(true);
        setPendingMedicineId(m.id);
      } else {
        setSelectedMedicine(mws);
      }
    },
    [hasConsent],
  );

  // Both of the checks below react to an external event (consent being
  // granted; a one-time `?m=` deep link) rather than to a prop/state change
  // that should reset something — the "adjust state during render instead
  // of useEffect+setState" pattern CONTRIBUTING.md's own example table
  // prescribes for exactly this shape, and the one already used for
  // `nav-mobile-menu`'s pathname reset. `react-hooks/set-state-in-effect`
  // would otherwise flag a `useEffect`+`setState` version of either.
  if (hasConsent && pendingMedicineId) {
    setPendingMedicineId(null);
    const medicine = MEDICINES.find((candidate) => candidate.id === pendingMedicineId);
    if (medicine) {
      setSelectedMedicine(getMedicineWithSafety(medicine));
    }
  }

  const [consumedDeepLink, setConsumedDeepLink] = useState(false);
  if (!consumedDeepLink && typeof window !== "undefined") {
    setConsumedDeepLink(true);
    const mId = new URLSearchParams(window.location.search).get("m");
    if (mId) {
      const m = MEDICINES.find((med) => med.id === mId);
      if (m) {
        if (hasConsent) {
          setSelectedMedicine(getMedicineWithSafety(m));
        } else {
          setPendingMedicineId(m.id);
          setShowDisclaimer(true);
        }
      }
    }
  }

  const handleReferralSubmit = useCallback(() => {
    if (!referralEmail || !referralRegion) return;
    const subject = encodeURIComponent("PRI Facility Introduction Request");
    const bodyLines = [
      `Name: ${referralName || "(not provided)"}`,
      `Email: ${referralEmail}`,
      `Region: ${referralRegion}`,
      "",
      results ? `PRI score: ${results.overall} (${results.level.label})` : "",
      results ? `Top matches: ${results.topMatches.map((m) => m.name).join(", ")}` : "",
    ].filter(Boolean);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    setReferralSent(true);
  }, [referralEmail, referralRegion, referralName, results]);

  const domain = QUESTIONS[currentQ];
  const pathwayQ = PATHWAY_QUESTIONS[currentPathwayQ];

  return (
    <div ref={topRef} className="bg-pri-cream font-body text-pri-ink leading-[1.7]">
      {/* ── HERO ── */}
      <section className="relative mx-auto flex min-h-screen max-w-225 flex-col justify-center overflow-hidden px-5 pt-22 pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <Image
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/pri-hero-v2-mSDTNiwzeoV4EwNs4reHC8.webp"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_35%] brightness-85 contrast-110 saturate-120"
          />
          <div className="absolute inset-0 bg-linear-to-br from-pri-cream/85 via-pri-cream/50 to-pri-cream/20" />
        </div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple uppercase">
            <span className="block h-0.5 w-6 bg-pri-purple" />
            Psychedelic Readiness Index
          </div>
          <h1 className="mb-6 font-heading text-[clamp(2.5rem,8vw,6rem)] leading-[1] font-black tracking-[-0.03em] text-pri-ink">
            Find My
            <br />
            <em className="text-pri-purple not-italic">Medicine</em>
          </h1>
          <p className="mb-4 max-w-140 text-[clamp(.95rem,2.5vw,1.1rem)] text-pri-brown">
            {MEDICINES.length} plant medicines. 50+ readiness questions. 6 domains. MAO-B
            interaction matrix. An honest map of where you stand ... before you walk into territory
            that rewards preparation.
          </p>

          <div className="mb-6 max-w-140 border-l-3 border-pri-purple bg-pri-parchment px-4 py-3">
            <div className="mb-0.5 text-xs font-bold tracking-[0.06em] text-pri-purple uppercase">
              Community-Aggregated Information
            </div>
            <div className="text-[.82rem] leading-[1.6] text-pri-tan">
              This is not medical advice. Not a doctor. Not Reddit. Not gossip. Curated from
              clinical research, harm reduction organizations, and experienced practitioners. You
              proceed at your own risk.
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={startQuiz}
              className="bg-pri-purple px-8 py-3.5 font-mono text-sm font-bold tracking-[0.05em] text-pri-cream uppercase transition-colors hover:bg-pri-purple-mid"
            >
              Begin Assessment <ForwardIcon aria-hidden="true" />
            </button>
            <a
              href="#medicines"
              className="border-[1.5px] border-pri-ink px-8 py-3.5 font-mono text-sm font-bold tracking-[0.05em] text-pri-ink uppercase"
            >
              Explore Medicines
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="mx-5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] border-y border-pri-border">
        {[
          { n: String(MEDICINES.length), l: "Plant Medicines" },
          { n: "50+", l: "Quiz Questions" },
          { n: "6", l: "Domains" },
          { n: "∞", l: "Healing Paths" },
        ].map((s) => (
          <div key={s.l} className="border-r border-pri-border px-4 py-6">
            <div className="font-heading text-[clamp(2rem,5vw,2.8rem)] leading-none font-black text-pri-purple">
              {s.n}
            </div>
            <div className="mt-1 text-[.7rem] font-semibold tracking-[0.06em] text-pri-tan uppercase">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* ── MEDICINE GRID ── */}
      <div id="medicines" className="mx-auto max-w-300 px-5 py-16">
        <CinematicBand
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_14_1_Ay780tKhHUlRIDgLEPEyF6_1773615910924_na1fn_L2hvbWUvdWJ1bnR1L3BoYXJtYWNvcG9laWE_7a2f5a05.jpg"
          alt={`${MEDICINES.length} sacred plant medicines arranged on stone tiles`}
          fadeTo="cream"
          heightClass="h-[clamp(200px,30vw,360px)] mb-8"
        />
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-pri-border pb-5">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple uppercase">
              <span className="block h-0.5 w-6 bg-pri-purple" />
              The Pharmacopoeia
            </div>
            <h2 className="font-heading text-[clamp(1.5rem,4vw,2.8rem)] text-pri-ink">
              {MEDICINES.length} Sacred Medicines
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) setCompareList([]);
              }}
              className={`border px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors ${compareMode ? "border-pri-purple bg-pri-purple text-pri-cream" : "border-[#C8B89A] bg-transparent text-pri-tan"}`}
            >
              {compareMode ? `Compare (${compareList.length}/3)` : "Compare Medicines"}
            </button>
            {!compareMode && (
              <div className="text-right text-[.78rem] text-pri-tan">Click any card to explore</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-px border border-pri-border bg-pri-border">
          {MEDICINES.map((m) => {
            const inCompare = compareMode && compareList.includes(m.id);
            const isSaved = savedMeds.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (compareMode) {
                    setCompareList((prev) => {
                      if (prev.includes(m.id)) return prev.filter((id) => id !== m.id);
                      if (prev.length >= 3) return prev;
                      return [...prev, m.id];
                    });
                  } else {
                    handleMedicineClick(m);
                  }
                }}
                className={`group relative cursor-pointer overflow-hidden transition-colors ${inCompare ? "bg-[#F0E8D8] outline-3 -outline-offset-3 outline-pri-purple" : "bg-pri-parchment hover:bg-pri-cream"}`}
              >
                {inCompare && (
                  <div className="absolute top-1.5 right-1.5 z-5 flex size-6 items-center justify-center rounded-full bg-pri-purple text-[.7rem] font-black text-pri-cream">
                    {compareList.indexOf(m.id) + 1}
                  </div>
                )}
                {!compareMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(m.id);
                    }}
                    title={isSaved ? "Remove from saved" : "Save medicine"}
                    className={`absolute top-1.5 right-1.5 z-5 flex size-6.5 items-center justify-center rounded-full text-[.82rem] text-pri-cream transition-opacity ${isSaved ? "bg-pri-purple opacity-100" : "bg-pri-ink/45 opacity-60 hover:opacity-100"}`}
                  >
                    <Heart className="size-3.5" fill={isSaved ? "currentColor" : "none"} />
                  </button>
                )}
                {MEDICINE_IMAGES[m.id] && (
                  <div className="relative h-20 w-full overflow-hidden">
                    <Image
                      src={MEDICINE_IMAGES[m.id]}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 25vw, 120px"
                      className="object-cover object-[center_30%] transition-transform duration-400 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent from-20% to-pri-parchment" />
                  </div>
                )}
                <div className="px-4 pt-3 pb-5">
                  <div className="mb-2 text-[1.6rem]">{m.icon}</div>
                  <div className="mb-1.5 h-0.75 bg-pri-border">
                    <div
                      className={`h-full ${m.intensity > 0.8 ? "bg-[#C62828]" : m.intensity > 0.5 ? "bg-[#E65100]" : "bg-[#6B8F71]"}`}
                      style={{ width: `${m.intensity * 100}%` }}
                    />
                  </div>
                  <div className="mb-0.5 font-heading text-[clamp(.82rem,2vw,.95rem)] leading-[1.3] font-bold text-pri-ink">
                    {m.name}
                  </div>
                  <div className="mb-2 text-[.75rem] font-semibold tracking-[0.05em] text-pri-tan uppercase">
                    {m.src}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className={`border px-1 py-0.5 text-xs font-bold tracking-[0.06em] uppercase ${TAG_CLASS[t] ?? DEFAULT_TAG_CLASS}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SAVED MEDICINES PANEL ── */}
      {savedMeds.length > 0 && !compareMode && (
        <div data-saved-panel className="border-t-3 border-pri-purple bg-pri-cream px-5 py-8">
          <div className="mx-auto max-w-300">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple uppercase">
                  <span className="block h-0.5 w-6 bg-pri-purple" />
                  Your Shortlist
                </div>
                <h3 className="font-heading text-[clamp(1.2rem,3vw,1.8rem)] text-pri-ink">
                  My Saved Medicines{" "}
                  <span className="text-[.85rem] font-extrabold text-pri-purple">
                    ({savedMeds.length})
                  </span>
                </h3>
              </div>
              <button
                onClick={() => {
                  if (confirm("Clear all saved medicines?"))
                    persistPriState({ savedMedicineIds: [] });
                }}
                className="border border-[#C8B89A] px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-pri-tan uppercase"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-px border border-pri-border bg-pri-border">
              {savedMeds.map((id) => {
                const m = MEDICINES.find((med) => med.id === id);
                if (!m) return null;
                return (
                  <div
                    key={id}
                    onClick={() => handleMedicineClick(m)}
                    className="flex cursor-pointer items-center gap-4 bg-pri-parchment px-5 py-4 transition-colors hover:bg-[#F0E8D8]"
                  >
                    {MEDICINE_IMAGES[id] && (
                      <div className="relative size-12.5 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={MEDICINE_IMAGES[id]}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 25vw, 120px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{m.icon}</span>
                        <span className="font-heading text-sm font-bold text-pri-ink">
                          {m.name}
                        </span>
                      </div>
                      <div className="text-[.75rem] font-semibold tracking-[0.04em] text-pri-tan uppercase">
                        {m.src}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(id);
                      }}
                      title="Remove from saved"
                      className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-pri-purple/10 text-[.85rem] text-pri-purple"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-[.78rem] text-pri-tan">
              Your saved medicines use a secure, server-managed visitor state for this browser. They
              persist across visits but are not synced across devices.
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARE PANEL ── */}
      {compareMode && compareList.length >= 2 && (
        <div id="compare-panel" className="bg-pri-ink px-5 py-12 text-pri-cream">
          <div className="mx-auto max-w-300">
            <div className="mb-8 flex items-end justify-between border-b border-pri-cream/10 pb-4">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple-light uppercase">
                  <span className="block h-0.5 w-6 bg-pri-purple-light" />
                  Side-by-Side
                </div>
                <h2 className="font-heading text-[clamp(1.3rem,3.5vw,2rem)] text-pri-cream">
                  Medicine Comparison
                </h2>
              </div>
              <button
                onClick={() => {
                  setCompareMode(false);
                  setCompareList([]);
                }}
                className="border border-pri-cream/20 px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-pri-cream uppercase"
              >
                Close
              </button>
            </div>

            <div
              className="grid gap-px bg-pri-cream/8"
              style={{ gridTemplateColumns: `repeat(${compareList.length}, 1fr)` }}
            >
              {compareList.map((id) => {
                const m = MEDICINES.find((med) => med.id === id)!;
                const ms = getMedicineWithSafety(m);
                return (
                  <div key={id} className="bg-pri-ink p-6">
                    {MEDICINE_IMAGES[id] && (
                      <div className="relative mb-3 h-25 overflow-hidden">
                        <Image
                          src={MEDICINE_IMAGES[id]}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 25vw, 120px"
                          className="object-cover brightness-70"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-pri-ink" />
                      </div>
                    )}
                    <div className="mb-1 text-[1.8rem]">{m.icon}</div>
                    <div className="mb-0.5 font-heading text-sm text-pri-cream">{m.name}</div>
                    <div className="mb-4 text-[.75rem] font-semibold tracking-[0.05em] text-pri-cream/40 uppercase">
                      {m.src}
                    </div>

                    <div className="mb-5">
                      <div className="mb-1 text-[.75rem] font-bold tracking-[0.06em] text-pri-cream/40 uppercase">
                        Intensity
                      </div>
                      <div className="h-1 bg-pri-cream/10">
                        <div
                          className={`h-full ${m.intensity > 0.8 ? "bg-pri-purple" : m.intensity > 0.5 ? "bg-pri-purple-mid" : "bg-[#6B8F71]"}`}
                          style={{ width: `${m.intensity * 100}%` }}
                        />
                      </div>
                      <div className="mt-0.5 text-[.75rem] font-bold text-pri-cream">
                        {Math.round(m.intensity * 100)}%
                      </div>
                    </div>

                    <div className="mb-2 text-[.75rem] font-bold tracking-[0.06em] text-pri-cream/40 uppercase">
                      Dimension Scores
                    </div>
                    {(Object.keys(DIM_LABELS) as DimKey[]).map((d) => (
                      <div key={d} className="mb-1.5 flex items-center gap-1.5">
                        <div className="w-12.5 shrink-0 text-[.75rem] text-pri-cream/50 uppercase">
                          {DIM_LABELS[d].split(" ")[0]}
                        </div>
                        <div className="h-0.75 flex-1 bg-pri-cream/8">
                          <div
                            className="h-full bg-pri-purple"
                            style={{ width: `${(m.dims[d] / 10) * 100}%` }}
                          />
                        </div>
                        <div className="w-5 text-right text-[.7rem] font-bold text-pri-cream">
                          {m.dims[d]}
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 flex flex-wrap gap-1">
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          className={`border px-1 py-0.5 text-xs font-bold tracking-[0.06em] uppercase ${TAG_CLASS[t] ?? DEFAULT_TAG_CLASS}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-pri-cream/8 pt-3">
                      <div className="mb-1 text-[.75rem] font-bold tracking-[0.06em] text-pri-cream/40 uppercase">
                        Safety
                      </div>
                      <div className="text-[.75rem] leading-[1.5] text-pri-cream/60">
                        {ms.contraindications.length} contraindications
                        <br />
                        {ms.drugInteractions.length} drug interactions
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCompareMode(false);
                        setCompareList([]);
                        setSelectedMedicine(ms);
                      }}
                      className="mt-4 w-full border border-pri-purple/30 bg-pri-purple/15 py-2 text-[.75rem] font-bold tracking-[0.06em] text-pri-purple-light uppercase"
                    >
                      Full Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING COMPARE BAR ── */}
      {compareMode && compareList.length >= 1 && compareList.length < 2 && (
        <div className="fixed inset-x-0 bottom-0 z-100 flex items-center justify-center gap-4 border-t-2 border-pri-purple bg-pri-ink/95 px-5 py-4 backdrop-blur-md">
          <span className="text-[.78rem] text-pri-cream/60">
            Select {2 - compareList.length} more medicine{compareList.length === 0 ? "s" : ""} to
            compare
          </span>
        </div>
      )}
      {compareMode && compareList.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 z-100 flex items-center justify-center gap-4 border-t-2 border-pri-purple bg-pri-ink/95 px-5 py-4 backdrop-blur-md">
          <span className="text-[.78rem] font-bold text-pri-cream">
            {compareList.length} medicines selected
          </span>
          <a
            href="#compare-panel"
            className="bg-pri-purple px-5 py-2 text-[.7rem] font-bold tracking-[0.06em] text-pri-cream uppercase"
          >
            <span className="inline-flex items-center gap-1.5">
              View Comparison <ForwardIcon aria-hidden="true" />
            </span>
          </a>
          <button
            onClick={() => {
              setCompareMode(false);
              setCompareList([]);
            }}
            className="border border-pri-cream/20 px-3 py-1.5 text-xs font-bold text-pri-cream/60"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── MAO-B INTERACTION MATRIX ── */}
      <section id="mao-b" className="bg-pri-ink pb-16 text-pri-cream">
        <CinematicBand
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_42_2_cyf5h67593DZPHr3augAvg_1773615904853_na1fn_L2hvbWUvdWJ1bnR1L21hb2JfaW50ZXJhY3Rpb25fbWF0cml4_beb3e8b0.jpg"
          alt=""
          fadeTo="ink"
          objectPosition="object-center"
          className="brightness-60 contrast-120"
        />
        <div className="mx-auto max-w-250 px-5">
          <div className="mb-8 border-b border-pri-cream/8 pb-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple uppercase">
              <span className="block h-0.5 w-6 bg-pri-purple" />
              Pharmacological Safety
            </div>
            <h2 className="font-heading text-[clamp(1.5rem,4vw,2.8rem)] text-pri-cream">
              MAO-B Interaction Matrix
            </h2>
            <p className="mt-3 max-w-175 text-[.9rem] leading-[1.7] text-pri-cream/55">
              MAO-B inhibitors (selegiline, rasagiline, safinamide) are prescribed for
              Parkinson&apos;s disease and sometimes depression. At therapeutic doses, they
              selectively inhibit MAO-B ... but selectivity is dose-dependent and can be lost. This
              matrix maps the interaction risk with each psychedelic compound.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            {[
              { label: "Hard Stop", color: "bg-[#ef4444]" },
              { label: "Caution ... MD Consult", color: "bg-[#f97316]" },
              { label: "Data Limited", color: "bg-[#eab308]" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`size-3 shrink-0 ${l.color}`} />
                <span className="text-[.75rem] font-bold tracking-[0.04em] text-pri-cream/60 uppercase">
                  {l.label}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[.85rem]">
              <thead>
                <tr className="border-b-2 border-pri-cream/15">
                  <th className="px-4 py-3 text-left text-[.7rem] font-extrabold tracking-[0.08em] text-pri-purple uppercase">
                    Compound
                  </th>
                  <th className="px-4 py-3 text-left text-[.7rem] font-extrabold tracking-[0.08em] text-pri-purple uppercase">
                    Interaction
                  </th>
                  <th className="px-4 py-3 text-center text-[.7rem] font-extrabold tracking-[0.08em] text-pri-purple uppercase">
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {MAOB_INTERACTIONS.map((row) => (
                  <tr key={row.compound} className="border-b border-pri-cream/6">
                    <td className="px-4 py-3 font-bold whitespace-nowrap text-pri-cream">
                      {row.compound}
                    </td>
                    <td className="px-4 py-3 leading-[1.5] text-pri-cream/60">{row.interaction}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-extrabold tracking-[0.04em] uppercase ${
                          row.riskLevel === "hard_stop"
                            ? "bg-[#ef4444]/15 text-[#ef4444]"
                            : row.riskLevel === "caution_md"
                              ? "bg-[#f97316]/15 text-[#f97316]"
                              : "bg-[#eab308]/15 text-[#eab308]"
                        }`}
                      >
                        {row.riskLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <div className="mb-4 text-xs font-extrabold tracking-[0.12em] text-pri-purple uppercase">
              MAO-B Inhibitor Wash-Out Guidance
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-px border border-pri-cream/8 bg-pri-cream/6">
              {Object.entries(MAOB_WASHOUT).map(([drug, info]) => (
                <div key={drug} className="bg-[#0A0F1E]/40 p-5">
                  <div className="mb-1 font-extrabold text-pri-cream capitalize">{drug}</div>
                  <div className="mb-0.5 text-[.78rem] text-pri-cream/50">
                    Half-life: {info.halfLife}
                  </div>
                  <div className="mb-1.5 text-[.78rem] text-pri-cream/50">
                    Recovery: {info.recoveryTime}
                  </div>
                  <div className="text-[.78rem] leading-[1.5] text-[#f97316]">{info.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MEDICATION INTERACTIONS ── */}
      <section className="bg-pri-cream pb-16">
        <CinematicBand
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_24_3_CDtc8wRbaTczuIl5ODhL7E_1773615908910_na1fn_L2hvbWUvdWJ1bnR1L21lZGljYXRpb25faW50ZXJhY3Rpb25fZ3VpZGU_1fb2633f.jpg"
          alt=""
          fadeTo="cream"
          className="brightness-85 contrast-110"
        />
        <div className="mx-auto max-w-250 px-5">
          <div className="mb-8 border-b border-pri-border pb-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple uppercase">
              <span className="block h-0.5 w-6 bg-pri-purple" />
              Critical Safety Reference
            </div>
            <h2 className="font-heading text-[clamp(1.5rem,4vw,2.4rem)] text-pri-ink">
              Medication Interaction Guide
            </h2>
            <p className="mt-3 max-w-175 text-[.9rem] leading-[1.7] text-pri-brown">
              If you take any of these medications, review the guidance carefully before considering
              any psychedelic experience. This is not exhaustive ... always consult your prescribing
              physician.
            </p>
          </div>

          <div className="grid gap-px border border-pri-border bg-pri-border">
            {MEDICATION_INTERACTIONS.map((med) => {
              const isHardStop =
                med.risk.includes("LIFE-THREATENING") ||
                med.risk.includes("ABSOLUTE") ||
                med.risk.includes("Seizure");
              return (
                <div key={med.category} className="bg-pri-parchment px-6 py-5">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div className="font-heading text-base font-extrabold text-pri-ink">
                      {med.category}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold tracking-[0.04em] text-pri-purple uppercase">
                      {isHardStop ? (
                        <>
                          <Ban className="size-3.5" /> Hard Stop
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="size-3.5" /> Caution
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mb-1.5 text-[.78rem] text-pri-tan">{med.medications}</div>
                  <div className="mb-1.5 text-[.85rem] leading-[1.6] text-pri-brown">
                    <strong>Risk:</strong> {med.risk}
                  </div>
                  <div className="text-[.85rem] leading-[1.6] text-pri-brown">
                    <strong>Guidance:</strong> {med.guidance}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 overflow-hidden bg-pri-ink">
            <CinematicBand
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_9_5_VRn9xtScv1qYQMN2Aj1zNP_1773615893129_na1fn_L2hvbWUvdWJ1bnR1L2NyaXNpc19yZXNvdXJjZXNfbGlnaHRob3VzZQ_a3d95833.jpg"
              alt=""
              fadeTo="ink"
              heightClass="h-[clamp(120px,18vw,200px)]"
              className="brightness-50 contrast-120"
            />
            <div className="px-8 py-6">
              <div className="mb-4 text-xs font-extrabold tracking-[0.12em] text-pri-purple uppercase">
                Crisis Resources
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {CRISIS_RESOURCES.map((r) => (
                  <div key={r.name}>
                    <div className="mb-0.5 text-[.82rem] font-bold text-pri-cream">{r.name}</div>
                    <div className="text-[.9rem] font-extrabold text-pri-purple-light">
                      {r.contact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ASSESSMENT SECTION ── */}
      <section ref={assessmentRef} className="bg-pri-ink pb-16 text-pri-cream">
        <CinematicBand
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_3_4_WErEguPyxSRODIYK82xMyu_1773615891673_na1fn_L2hvbWUvdWJ1bnR1L2Fzc2Vzc21lbnRfaW1hZ2U_8a8c3b82.jpg"
          alt=""
          fadeTo="ink"
          heightClass="h-[clamp(200px,28vw,360px)]"
          objectPosition="object-[center_60%]"
          className="brightness-55 contrast-115"
        />
        <div className="mx-auto max-w-300 px-5 py-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-pri-cream/8 pb-5">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-pri-purple uppercase">
                <span className="block h-0.5 w-6 bg-pri-purple" />
                Consciousness-Aligned Assessment
              </div>
              <h2 className="font-heading text-[clamp(1.5rem,4vw,2.8rem)] text-pri-cream">
                Readiness Index
              </h2>
            </div>
            <div className="text-right text-[.78rem] text-pri-cream/40">
              {QUESTIONS.length} Questions · 6 Domains
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-180">
          {/* PHILOSOPHY */}
          {state === "philosophy" && (
            <div className="px-5 py-6 text-center">
              <div className="mb-8 text-[.6rem] tracking-[0.28em] text-brand-gold uppercase">
                Tony Greenberg · The Diode of Perception
              </div>
              <div className="mx-auto max-w-160 text-left">
                {PHILOSOPHY_PARAGRAPHS.map((para, i) => (
                  <p
                    key={para.text.slice(0, 20)}
                    className={`mb-6 font-heading text-[clamp(1rem,2.8vw,1.2rem)] leading-[1.85] ${para.italic ? "italic" : ""}`}
                    style={{ color: `rgba(244,240,232,${0.92 - i * 0.05})` }}
                  >
                    {i === 0 && (
                      <span className="float-left mt-1 mr-1 font-heading text-[clamp(2rem,5vw,2.8rem)] leading-none text-brand-gold">
                        T
                      </span>
                    )}
                    {i === 0 ? para.text.slice(1) : para.text}
                  </p>
                ))}
              </div>
              <div className="my-8 h-px bg-linear-to-r from-transparent via-brand-gold/30 to-transparent" />
              <div className="mx-auto mb-8 max-w-140 border border-brand-gold/20 bg-brand-gold/7 p-6 text-left">
                <div className="mb-3 text-[.6rem] tracking-[0.2em] text-brand-gold uppercase">
                  What the Numbers Are Saying
                </div>
                <p className="m-0 text-[clamp(.85rem,2.2vw,.95rem)] leading-[1.8] text-pri-cream/70">
                  You are the instrument. Every medicine, every ceremony, every facilitator
                  conversation begins with one question: what is the current condition of the thing
                  being played? This assessment exists to answer that — not to gatekeep, but to give
                  you an honest map before you walk into territory that rewards preparation and
                  punishes shortcuts.
                </p>
              </div>
              <button
                onClick={() => setState("intro")}
                className="bg-linear-to-br from-[#b45309] to-[#d97706] px-10 py-4 text-[clamp(1rem,2.5vw,1.1rem)] font-bold text-white uppercase"
              >
                See Where You Actually Stand <ForwardIcon aria-hidden="true" />
              </button>
              <div className="mt-6">
                <Link
                  href="/the-philosophy"
                  className="text-[.75rem] tracking-[0.1em] text-brand-gold"
                >
                  Read the full philosophy <ForwardIcon aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* INTRO */}
          {state === "intro" && (
            <div className="px-5 py-8 text-center">
              <Star className="mx-auto mb-4 size-11 text-brand-gold" fill="currentColor" />
              <h2 className="mb-4 font-heading text-[clamp(1.5rem,4vw,2rem)] text-pri-cream">
                Your Readiness Assessment
              </h2>
              <p className="mx-auto mb-8 max-w-130 text-[clamp(.88rem,2.5vw,1rem)] text-pri-cream/65">
                Most people walk into these experiences with a plan. Very few walk in with a map.
                This is the map ... {QUESTIONS.length} questions across 6 dimensions. No right
                answers. What you get at the end is the honest picture of where you actually are,
                not where you wish you were.
              </p>
              <div className="my-6 grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-px border border-pri-cream/10 bg-pri-cream/8">
                {(Object.keys(DIM_LABELS) as DimKey[]).map((d) => (
                  <div key={d} className="bg-[#0A0F1E]/40 px-1.5 py-3 text-center">
                    <div className="mb-0.5 text-xl">{DIM_ICONS[d]}</div>
                    <div className="text-[.58rem] font-bold tracking-[0.06em] text-pri-cream/40 uppercase">
                      {DIM_LABELS[d]}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={startQuiz}
                className="bg-pri-ink px-8 py-3.5 text-sm font-bold tracking-wide text-pri-cream uppercase ring-1 ring-pri-cream/20"
              >
                Begin {QUESTIONS.length}-Question Assessment <ForwardIcon aria-hidden="true" />
              </button>
            </div>
          )}

          {/* QUIZ */}
          {state === "quiz" && (
            <div className="px-5">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-0.75 flex-1 bg-pri-cream/10">
                  <div
                    className="h-full bg-pri-purple transition-[width] duration-400"
                    style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <div className="text-[.78rem] font-bold whitespace-nowrap text-pri-cream/45">
                  {currentQ + 1} / {QUESTIONS.length}
                </div>
              </div>

              <div className="border border-pri-cream/8 bg-pri-cream/4 p-[clamp(1.5rem,4vw,2.25rem)]">
                <div className="mb-3 text-xs font-bold tracking-[0.14em] text-pri-purple uppercase">
                  {domain.category}
                </div>
                <div
                  className={`font-heading text-[clamp(1rem,3vw,1.2rem)] leading-[1.45] font-semibold text-pri-cream ${domain.facilitatedNote ? "mb-4" : "mb-8"}`}
                >
                  {domain.text}
                  {domain.facilitatedNote && <span className="ml-1 text-pri-purple-light">*</span>}
                </div>
                {domain.facilitatedNote && (
                  <div className="mb-6 rounded bg-pri-purple/12 p-3.5 text-[.78rem] leading-[1.5] text-pri-cream/65 ring-1 ring-pri-purple/30">
                    <span className="font-bold text-pri-purple-light">* Facilitated setting: </span>
                    {domain.facilitatedNote} Score 10 if you are working with a licensed facility.
                  </div>
                )}
                <div className="mb-2.5 flex justify-between">
                  <span className="text-xs font-bold tracking-[0.06em] text-pri-cream/35 uppercase">
                    Least Likely
                  </span>
                  <span className="text-xs font-bold tracking-[0.06em] text-pri-cream/35 uppercase">
                    Most Likely
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={answers[currentQ]}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="h-7 w-full accent-pri-purple"
                />
                <div className="mt-3 text-center text-[clamp(.82rem,2.5vw,.9rem)] font-semibold text-pri-cream/50">
                  <span className="text-pri-purple-light">{answers[currentQ]}/10</span> ...{" "}
                  {sliderLabel}
                </div>
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button
                  onClick={prevQuestion}
                  disabled={currentQ === 0}
                  className={`border-[1.5px] px-5 py-3 text-sm font-bold ${currentQ === 0 ? "border-pri-cream/10 text-pri-cream/30" : "border-pri-cream/20 text-pri-cream"}`}
                >
                  <BackIcon aria-hidden="true" /> Back
                </button>
                <button
                  onClick={nextQuestion}
                  className="max-w-60 flex-1 justify-center bg-pri-purple px-6 py-3 text-sm font-bold text-pri-cream"
                >
                  {currentQ === QUESTIONS.length - 1 ? (
                    <>
                      A Few More Questions <ForwardIcon aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Next <ForwardIcon aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* PATHWAY */}
          {state === "pathway" && pathwayQ && (
            <div className="px-5">
              <div className="mb-8 text-center">
                <div className="mb-2 text-xs font-bold tracking-[0.14em] text-pri-purple-light uppercase">
                  Part 2 of 2
                </div>
                <h3 className="mb-2 font-heading text-[clamp(1.2rem,3vw,1.6rem)] text-pri-cream">
                  How You Want to Go
                </h3>
                <p className="mx-auto max-w-120 text-[.85rem] text-pri-cream/50">
                  Eight questions about what matters to you ... not what you should want. These
                  don&apos;t change your readiness score. They help point you somewhere real.
                </p>
              </div>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-0.75 flex-1 bg-pri-cream/10">
                  <div
                    className="h-full bg-pri-purple-light transition-[width] duration-400"
                    style={{
                      width: `${((currentPathwayQ + 1) / PATHWAY_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-[.78rem] font-bold whitespace-nowrap text-pri-cream/45">
                  {currentPathwayQ + 1} / {PATHWAY_QUESTIONS.length}
                </div>
              </div>
              <div className="border border-pri-purple-light/15 bg-pri-cream/4 p-[clamp(1.5rem,4vw,2.25rem)]">
                <div className="mb-3 text-xs font-bold tracking-[0.14em] text-pri-purple-light uppercase">
                  What Matters to You
                </div>
                <div
                  className={`font-heading text-[clamp(1rem,3vw,1.2rem)] leading-[1.45] font-semibold text-pri-cream ${pathwayQ.note ? "mb-4" : "mb-8"}`}
                >
                  {pathwayQ.text}
                </div>
                {pathwayQ.note && (
                  <div className="mb-6 text-[.78rem] text-pri-cream/45 italic">{pathwayQ.note}</div>
                )}
                <div className="mb-2.5 flex justify-between">
                  <span className="max-w-[45%] text-[.72rem] font-bold text-pri-cream/35">
                    {pathwayQ.lowLabel}
                  </span>
                  <span className="max-w-[45%] text-right text-[.72rem] font-bold text-pri-cream/35">
                    {pathwayQ.highLabel}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={pathwayAnswers[pathwayQ.id] ?? 5}
                  onChange={(e) =>
                    setPathwayAnswers((prev) => ({
                      ...prev,
                      [pathwayQ.id]: parseInt(e.target.value),
                    }))
                  }
                  className="h-7 w-full accent-pri-purple-light"
                />
                <div className="mt-3 text-center text-[clamp(.82rem,2.5vw,.9rem)] font-semibold text-pri-cream/50">
                  <span className="text-pri-purple-light">
                    {pathwayAnswers[pathwayQ.id] ?? 5}/10
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button
                  onClick={prevPathwayQuestion}
                  className="border-[1.5px] border-pri-cream/20 px-5 py-3 text-sm font-bold text-pri-cream"
                >
                  <BackIcon aria-hidden="true" /> Back
                </button>
                <button
                  onClick={nextPathwayQuestion}
                  className="max-w-60 flex-1 justify-center bg-pri-purple-light px-6 py-3 text-sm font-bold text-pri-cream"
                >
                  {currentPathwayQ === PATHWAY_QUESTIONS.length - 1 ? (
                    <>
                      See My Results <ForwardIcon aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Next <ForwardIcon aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {state === "results" && results && (
            <div className="px-5">
              <div className="mb-8 border-b border-pri-cream/8 pt-8 pb-10 text-center">
                <div className="text-xs font-extrabold tracking-[0.14em] text-pri-purple uppercase">
                  Where You Stand
                </div>
                <div className="my-2 font-heading text-[clamp(4rem,12vw,6rem)] leading-none font-black text-pri-purple">
                  {results.overall}
                </div>
                <div className="mb-2 text-base font-bold tracking-[0.08em] text-pri-cream uppercase">
                  {results.level.label}
                </div>
                <div className="mx-auto max-w-110 text-[clamp(.82rem,2.5vw,.9rem)] text-pri-cream/55">
                  {results.level.description}
                </div>
              </div>

              <div className="mb-4 text-xs font-extrabold tracking-[0.14em] text-pri-purple uppercase">
                Six Dimensions
              </div>
              <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-px border border-pri-cream/8 bg-pri-cream/6">
                {(Object.keys(results.dimScores) as DimKey[]).map((d) => (
                  <div key={d} className="bg-[#0A0F1E]/40 px-2 py-4 text-center">
                    <div className="mb-1 text-[.75rem] font-bold tracking-[0.08em] text-pri-cream/40 uppercase">
                      {DIM_ICONS[d]} {DIM_LABELS[d]}
                    </div>
                    <div className="font-heading text-[clamp(1.4rem,4vw,1.9rem)] font-black text-pri-cream">
                      {results.dimScores[d]}
                      <small className="text-[.8rem] text-pri-purple">/100</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4 text-xs font-extrabold tracking-[0.14em] text-pri-purple uppercase">
                Where Your Profile Points
              </div>
              <div className="mb-4 border border-pri-purple/30 bg-pri-purple/10 px-5 py-4">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-extrabold tracking-[0.06em] text-pri-purple uppercase">
                  <AlertTriangle className="size-3.5" />
                  Review Safety Data Before Trying Any Medicine
                </div>
                <div className="text-[.82rem] leading-[1.6] text-pri-cream/60">
                  Click any medicine below to view its full contraindications, drug interactions,
                  and side effects. This information is essential before making any decisions.
                </div>
              </div>

              <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px border border-pri-cream/8 bg-pri-cream/6">
                {results.topMatches.map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMedicine(m)}
                    className="relative cursor-pointer bg-[#0A0F1E]/40 px-4 py-6 text-center transition-colors hover:bg-[#0A0F1E]/60"
                  >
                    <div className="absolute top-2 left-2 text-xs font-extrabold tracking-[0.1em] text-pri-purple">
                      #{i + 1}
                    </div>
                    <div className="mb-1.5 text-[1.8rem]">{m.icon}</div>
                    <div className="mb-1.5 font-heading text-[clamp(.82rem,2vw,1rem)] leading-[1.3] font-bold text-pri-cream">
                      {m.name}
                    </div>
                    <div className="my-1.5 h-0.5 bg-pri-cream/8">
                      <div
                        className="h-full bg-pri-purple transition-[width] duration-1000"
                        style={{ width: `${m.matchScore}%` }}
                      />
                    </div>
                    <div className="text-[.62rem] font-semibold tracking-[0.06em] text-pri-cream/40 uppercase">
                      {m.matchScore >= 80
                        ? "this one knows you"
                        : m.matchScore >= 60
                          ? "worth a real look"
                          : "keep it on the radar"}
                    </div>
                  </div>
                ))}
              </div>

              <CinematicBand
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_36_6_V2zHpGt6IKEgb2XpfKmsCJ_1773615895415_na1fn_L2hvbWUvdWJ1bnR1L2hlYWxpbmdfc2VxdWVuY2U_4c245fba.jpg"
                alt=""
                fadeTo="ink"
                heightClass="h-[clamp(140px,20vw,240px)] mb-6"
                className="brightness-50 contrast-115"
              />
              <div className="mb-4 text-xs font-extrabold tracking-[0.14em] text-pri-purple uppercase">
                Where This Could Go
              </div>
              {results.sequence.map((s, i) => (
                <div
                  key={s.name}
                  className="mb-3 flex flex-wrap items-start gap-4 border border-pri-cream/8 bg-pri-cream/4 p-[clamp(1.25rem,3vw,1.75rem)]"
                >
                  <div className="min-w-8 font-heading text-2xl leading-none font-black text-pri-cream/7">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-50 flex-1">
                    <div className="mb-0.5 font-heading text-[clamp(.95rem,2.5vw,1.1rem)] font-bold text-pri-cream">
                      {s.icon} {s.name}
                    </div>
                    <div className="mb-1.5 text-[.7rem] font-bold tracking-[0.08em] text-pri-purple uppercase">
                      {s.time}
                    </div>
                    <div className="text-[clamp(.8rem,2vw,.85rem)] leading-[1.55] text-pri-cream/50">
                      {s.why}
                    </div>
                  </div>
                  <div className="min-w-25 text-right">
                    <div className="font-heading text-[clamp(.88rem,2vw,1rem)] font-bold text-pri-cream">
                      {s.cost}
                    </div>
                    <div className="text-[.75rem] font-semibold tracking-[0.06em] text-pri-cream/30 uppercase">
                      Est. entry cost
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 flex flex-wrap justify-center gap-3 pb-8 text-center">
                <button
                  onClick={exportPDF}
                  className="flex items-center justify-center gap-2 bg-pri-purple px-8 py-3.5 font-mono text-sm font-bold tracking-[0.05em] text-pri-cream uppercase"
                >
                  <FileText className="size-4" />
                  Save My Results
                </button>

                {!referralSent ? (
                  <div className="mt-4 w-full border border-pri-purple-light/25 bg-pri-purple-light/8 p-5 text-left">
                    <div className="mb-2 text-xs font-bold tracking-[0.1em] text-pri-purple-light uppercase">
                      Want a personal introduction?
                    </div>
                    <p className="mb-4 text-[.82rem] leading-[1.55] text-pri-cream/60">
                      Tony reviews these himself. If you&apos;d like him to connect you with a
                      vetted facility in your region ... no spam, no lead gen, just a personal
                      introduction ... check the box below.
                    </p>
                    <label
                      className={`flex cursor-pointer items-start gap-2.5 text-[.82rem] text-pri-cream/75 ${referralConsent ? "mb-4" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={referralConsent}
                        onChange={(e) => setReferralConsent(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-pri-purple-light"
                      />
                      <span>
                        Yes, I&apos;d like Tony to connect me with a vetted facility in my region.
                      </span>
                    </label>
                    {referralConsent && (
                      <div className="flex flex-col gap-2.5">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={referralName}
                          onChange={(e) => setReferralName(e.target.value)}
                          className="rounded border border-pri-purple-light/30 bg-pri-cream/6 px-3.5 py-2.5 text-[.82rem] text-pri-cream outline-none"
                        />
                        <input
                          type="email"
                          placeholder="Your email"
                          value={referralEmail}
                          onChange={(e) => setReferralEmail(e.target.value)}
                          className="rounded border border-pri-purple-light/30 bg-pri-cream/6 px-3.5 py-2.5 text-[.82rem] text-pri-cream outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Your region (e.g. New York, London, Sydney)"
                          value={referralRegion}
                          onChange={(e) => setReferralRegion(e.target.value)}
                          className="rounded border border-pri-purple-light/30 bg-pri-cream/6 px-3.5 py-2.5 text-[.82rem] text-pri-cream outline-none"
                        />
                        <button
                          disabled={!referralEmail || !referralRegion}
                          onClick={handleReferralSubmit}
                          className={`self-start bg-pri-purple-light px-5 py-2.5 text-[.8rem] font-bold text-pri-cream ${!referralEmail || !referralRegion ? "opacity-50" : ""}`}
                        >
                          Send Introduction Request
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 w-full border border-pri-purple-light/25 bg-pri-purple-light/8 p-5 text-center">
                    <CheckCircle2 className="mx-auto mb-1 size-6 text-pri-purple-light" />
                    <div className="text-[.85rem] font-bold text-pri-purple-light">
                      Your email client should be open.
                    </div>
                    <div className="mt-1 text-[.78rem] text-pri-cream/50">
                      Send it and Tony will reach out personally when he has a match in your region.
                    </div>
                  </div>
                )}

                <Link
                  href="/pri-calibration"
                  className="flex items-center justify-center gap-2 bg-linear-to-br from-pri-purple to-pri-purple-light px-6 py-3 text-sm font-bold text-pri-cream uppercase"
                >
                  <Target className="size-4" />
                  Calibrate My Results
                </Link>

                <button
                  onClick={resetQuiz}
                  className="border-[1.5px] border-pri-cream/20 px-6 py-3 text-sm font-bold text-pri-cream uppercase"
                >
                  Retake Assessment
                </button>
                {savedMeds.length > 0 && (
                  <button
                    onClick={() =>
                      document
                        .querySelector("[data-saved-panel]")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="flex items-center justify-center gap-2 border-[1.5px] border-pri-purple/40 px-6 py-3 text-sm font-bold text-pri-purple uppercase"
                  >
                    <Heart className="size-4" fill="currentColor" />
                    View Saved ({savedMeds.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SHARE BAR ── */}
      <section className="border-t border-pri-purple/15 bg-pri-purple/6 px-5 py-8">
        <div className="mx-auto max-w-160">
          <PriShareBar />
        </div>
      </section>

      {/* ── IMPACTSOUL CTA ── */}
      <section className="border-t border-pri-purple/30 bg-linear-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] px-5 py-16 text-center">
        <div className="mx-auto max-w-160">
          <div className="mb-4 text-xs font-bold tracking-[0.12em] text-[#9b59b6] uppercase">
            Next Step
          </div>
          <h2 className="mb-4 font-heading text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.25] font-bold text-pri-cream">
            Your ImpactSoul Score
            <br />
            <span className="text-[#9b59b6]">measures what this can&apos;t.</span>
          </h2>
          <p className="mx-auto mb-8 max-w-130 text-base leading-[1.7] text-pri-cream/70">
            The PRI tells you which medicine fits your biology. The ImpactSoul Score tells you where
            you are in your evolution ... and what kind of capital, community, and consciousness
            work you&apos;re actually ready for.
          </p>
          <a
            href="https://impactsoul.is"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded bg-linear-to-br from-pri-purple to-[#9b59b6] px-10 py-4 text-[.85rem] font-bold tracking-[0.1em] text-pri-cream uppercase shadow-[0_4px_24px_rgba(107,33,168,0.4)]"
          >
            Get Your ImpactSoul Score <ForwardIcon aria-hidden="true" />
          </a>
          <div className="mt-5 text-xs tracking-[0.04em] text-pri-cream/35">
            Free · 8 minutes · No account required
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative bg-pri-ink py-12 text-center text-pri-cream/40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_10_7_izBDVpysTtokCeVbU0sNp6_1773615912434_na1fn_L2hvbWUvdWJ1bnR1L2Zvb3Rlcl9pbWFnZQ_2a2c6369.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover brightness-20 contrast-110"
          />
          <div className="absolute inset-0 bg-linear-to-b from-pri-ink via-transparent to-pri-ink" />
        </div>
        <div className="relative z-10 px-5">
          <div className="mb-1 font-heading text-[1.3rem] text-pri-cream">
            ImpactSoul <span className="text-pri-purple">×</span> Find My Medicine
          </div>
          <div className="mb-3 text-[.78rem]">A consciousness-aligned capital initiative</div>
          <div className="my-4 flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-[.75rem] font-semibold tracking-[0.06em] text-pri-cream/35 uppercase"
            >
              TonyGreenberg.com
            </Link>
            <a
              href="https://impactsoul.is"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[.75rem] font-semibold tracking-[0.06em] text-pri-cream/35 uppercase"
            >
              ImpactSoul.is
            </a>
          </div>

          <div className="mx-auto mt-6 max-w-150 border-t border-pri-cream/6 pt-5">
            <div className="mb-2 text-xs font-bold tracking-[0.08em] text-pri-purple uppercase">
              Legal Disclaimer
            </div>
            <div className="text-[.7rem] leading-[1.8] text-pri-cream/35">
              The Psychedelic Readiness Index is community-aggregated information compiled for
              educational and harm reduction purposes only. It does not constitute medical advice,
              diagnosis, or treatment. No medicine, provider, or protocol listed here constitutes an
              endorsement or recommendation. Always consult qualified healthcare professionals
              before engaging with any psychedelic substance. You proceed entirely at your own risk.
              The creators, contributors, and operators of this tool assume no liability for any
              outcomes. Many substances discussed are illegal in various jurisdictions. You are
              responsible for knowing and following the laws where you live.
            </div>
          </div>
        </div>
      </footer>

      {showDisclaimer && !hasConsent && <DisclaimerGate onConsent={handleConsentComplete} />}

      {selectedMedicine && (
        <MedicineModal
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          isSaved={savedMeds.includes(selectedMedicine.id)}
          onToggleSaved={toggleSaved}
        />
      )}
    </div>
  );
}
