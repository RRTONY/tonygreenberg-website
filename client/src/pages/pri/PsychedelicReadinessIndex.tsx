/**
 * PSYCHEDELIC READINESS INDEX
 * 26 plant medicines · 50+ readiness questions · 6 domains
 * Features: safety data, MAO-B interaction matrix, medication interactions,
 * legal disclaimer consent gate, mobile-responsive, community corrections,
 * contraindications display, substance-specific appendix.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";
import {
  MEDICINES,
  QUESTIONS,
  DIM_LABELS,
  DIM_ICONS,
  SLIDER_LABELS,
  MAOB_INTERACTIONS,
  MAOB_WASHOUT,
  MEDICATION_INTERACTIONS,
  SCORE_PROFILES,
  CRISIS_RESOURCES,
  INTEGRATION_RESOURCES,
  PATHWAY_QUESTIONS,
  type Medicine,
  type MedicineWithSafety,
  type DimKey,
} from "./data";
import { SAFETY_DATA, type MedicineSafety } from "./safety-data";
import { MEDICINE_IMAGES } from "./medicine-images";

/* ── Merge medicine + safety data ── */
function getMedicineWithSafety(m: Medicine): MedicineWithSafety {
  const safety = SAFETY_DATA[m.id] || {
    contraindications: ["Data pending ... consult a healthcare professional"],
    sideEffects: ["Data pending"],
    drugInteractions: ["Data pending"],
    safetyWarning: "Safety data is being compiled. Always consult a qualified healthcare professional.",
    legalStatus: "Varies by jurisdiction. Research local laws.",
  };
  return { ...m, ...safety };
}

/* ── Session ID helper ── */
function getSessionId(): string {
  let sid = sessionStorage.getItem("pri-session-id");
  if (!sid) {
    sid = "pri-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("pri-session-id", sid);
  }
  return sid;
}

/* ── Scoring helpers ── */

type DimScores = Record<DimKey, number>;

interface ScoredMedicine extends MedicineWithSafety {
  matchScore: number;
}

interface ReadinessLevel {
  threshold: number;
  label: string;
  description: string;
}

const READINESS_LEVELS: ReadinessLevel[] = [
  { threshold: 85, label: "Ready to Go Deep", description: "You have built something real. The high-intensity work... ayahuasca, iboga, 5-MeO... is accessible to you with the right people. Do not skip the facilitation. The container matters as much as the medicine." },
  { threshold: 70, label: "Strong Ground", description: "Most of the foundation is there. Psilocybin, MDMA therapy, San Pedro... these are honest next steps. A few dimensions are worth tending before you go further. You are closer than you think." },
  { threshold: 55, label: "Building Toward It", description: "The container is not quite ready yet. Start with lower-intensity medicines. Do the preparation work like it matters. Because it does. Every single time." },
  { threshold: 40, label: "Not Yet. And That Is Honest.", description: "The groundwork is still ahead of you. Breathwork, microdosing, somatic practice, a real integration community. These are not consolation prizes. They are the work. The actual work." },
  { threshold: 0, label: "Start Here", description: "This is where it begins. And beginning here is the right call. Cacao ceremony, breathwork, meditation, intentional cannabis. Build from the ground up. The deeper work will wait for you. It always does." },
];

function computeScores(answers: number[]): {
  dimScores: DimScores;
  overall: number;
  level: ReadinessLevel;
  topMatches: ScoredMedicine[];
  sequence: { icon: string; name: string; time: string; why: string; cost: string }[];
} {
  const dims: Record<DimKey, number[]> = { medical: [], pharmacological: [], psychological: [], intention: [], setting: [], integration: [] };
  QUESTIONS.forEach((q, i) => dims[q.dim].push(answers[i]));

  const dimScores = {} as DimScores;
  (Object.keys(dims) as DimKey[]).forEach((d) => {
    dimScores[d] = dims[d].length > 0 ? Math.round((dims[d].reduce((a, b) => a + b, 0) / dims[d].length) * 10) : 50;
  });

  const dimKeys = Object.keys(dims) as DimKey[];
  const overall = Math.round(Object.values(dimScores).reduce((a, b) => a + b, 0) / dimKeys.length);
  const level = READINESS_LEVELS.find((l) => overall >= l.threshold) || READINESS_LEVELS[READINESS_LEVELS.length - 1];

  const allMeds = MEDICINES.map(getMedicineWithSafety);
  const scored: ScoredMedicine[] = allMeds.map((m) => {
    let s = 0;
    (Object.keys(dimScores) as DimKey[]).forEach((d) => {
      const req = (m.dims[d] || 0.5) * 100;
      const r = dimScores[d];
      const delta = r - req;
      s += delta > 0 ? 10 - Math.min(delta / 10, 5) : Math.max(10 + delta / 3, 0);
    });
    return { ...m, matchScore: Math.max(0, Math.min(100, Math.round(s / 5))) };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const top = scored[0];
  const sequence =
    overall >= 75
      ? [
          { icon: "\u{1F344}", name: "Psilocybin (Facilitated Ceremony)", time: "Now \u2014 within 3 months", why: "Your readiness supports deep ceremonial work. Begin here to calibrate the psychedelic space and build your integration practice before going further.", cost: "$400\u2013$2,000" },
          { icon: top.icon, name: top.name, time: "3\u20136 months after first session", why: "Your highest-alignment medicine. Come to it after integrating your first psilocybin experience with committed practice. Do not rush this one.", cost: top.pricing[1]?.amount || "$500\u2013$3,000" },
          { icon: "\u{1F33F}", name: "Ayahuasca (Multi-night retreat)", time: "6\u201318 months in", why: "The vine rewards those who have built an integration foundation. After two or more psilocybin sessions, you are ready for deeper ancestral work.", cost: "$2,000\u2013$6,000" },
          { icon: "\u{1F497}", name: "MDMA (Trauma-focused)", time: "Parallel track \u2014 any time", why: "If trauma is underneath your healing goals, MDMA runs as a parallel track. It reaches places other medicines cannot.", cost: "$500\u2013$8,000" },
        ]
      : overall >= 55
        ? [
            { icon: "\u{1F9D8}", name: "Holotropic Breathwork", time: "Start now \u2014 no substances", why: "Build capacity to navigate altered states before medicine work. 3\u20136 sessions create the container and skills.", cost: "$100\u2013$400" },
            { icon: "\u{1F52C}", name: "Microdosing Protocol (30 days)", time: "Month 1\u20133", why: "Psilocybin microdosing with the Fadiman protocol and lion's mane stack builds neuroplasticity and helps you track your baseline safely.", cost: "$100\u2013$300/mo" },
            { icon: "\u{1F344}", name: "Psilocybin (Low dose, guided)", time: "Month 3\u20136", why: "Facilitated low-dose experience (1\u20132g) in trusted setting. Calibrates your nervous system for deeper work.", cost: "$400\u2013$1,500" },
            { icon: top.icon, name: top.name + " (Full dose)", time: "Month 6\u201312", why: "Your optimal medicine once the foundation is established. Meaningful potential here with proper preparation and real integration support.", cost: top.pricing[1]?.amount || "$1,000\u2013$4,000" },
          ]
        : [
            { icon: "\u{1F36B}", name: "Ceremonial Cacao + Intention", time: "Start immediately", why: "Build a heart relationship with plant medicines in the safest container available. This cultivates the receptivity that all deeper work requires.", cost: "$50\u2013$200" },
            { icon: "\u{1F9D8}", name: "Breathwork (Wim Hof / Holotropic)", time: "Month 1\u20133", why: "The most important preparation you can do is learning to ride altered states. Six or more sessions before any medicine work changes outcomes dramatically.", cost: "$50\u2013$200" },
            { icon: "\u{1F52C}", name: "Microdosing Psilocybin", time: "Month 2\u20134", why: "Sub-perceptual doses build your relationship with the medicine, improve your baseline, and prepare your nervous system. The best starting point in the whole spectrum.", cost: "$100\u2013$300/mo" },
            { icon: "\u{1F48A}", name: "Ketamine-Assisted Therapy", time: "If acute need \u2014 any time", why: "The only currently legal psychedelic-adjacent therapy in the US. Rapid relief with professional oversight. If there is an acute need, this is where to start.", cost: "$400\u2013$800/session" },
          ];

  return { dimScores, overall, level, topMatches: scored.slice(0, 6), sequence };
}

/* ── Tag styles ── */
function tagStyle(tag: string): React.CSSProperties {
  const map: Record<string, string> = {
    ceremony: "#C9A84C",
    clinical: "#2A7A7A",
    micro: "#6B8F71",
    intense: "#6B21A8",
    gentle: "#6B8F71",
  };
  return { borderColor: map[tag] || "#E0D8CC", color: map[tag] || "#7A6A5A" };
}

/* ── Shared styles ── */
const S = {
  eyebrow: { fontSize: ".75rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#6B21A8", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" } as React.CSSProperties,
  eyebrowDash: { width: "1.5rem", height: 2, background: "#6B21A8", display: "block" } as React.CSSProperties,
  heading: { fontFamily: "'Playfair Display', 'Fraunces', Georgia, serif", fontWeight: 800, letterSpacing: "-.02em" } as React.CSSProperties,
  label: { fontSize: ".7rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#6B21A8", margin: "1.25rem 0 .4rem" } as React.CSSProperties,
  body: { fontSize: ".9rem", color: "#4A3F35", lineHeight: 1.7 } as React.CSSProperties,
  btn: { display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".9rem 2rem", fontFamily: "'DM Sans', sans-serif", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" as const, cursor: "pointer", borderWidth: 0, borderStyle: "none", borderColor: "transparent" } as React.CSSProperties,
  warningBox: { background: "#FFF3E0", borderLeftWidth: 4, borderLeftStyle: "solid" as const, borderLeftColor: "#E65100", padding: "1rem 1.25rem", margin: "1rem 0" } as React.CSSProperties,
  dangerBox: { background: "#F3E8FF", borderLeftWidth: 4, borderLeftStyle: "solid" as const, borderLeftColor: "#6B21A8", padding: "1rem 1.25rem", margin: "1rem 0" } as React.CSSProperties,
};

/* ── DISCLAIMER COMPONENT ── */
function DisclaimerGate({ onConsent }: { onConsent: () => void }) {
  const [initials, setInitials] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const sessionId = useMemo(() => getSessionId(), []);
  const consentMutation = trpc.pri.submitConsent.useMutation();

  const handleConsent = async () => {
    if (initials.length < 2 || !agreed) return;
    setSubmitting(true);
    try {
      await consentMutation.mutateAsync({ initials, sessionId });
    } catch {
      // Still allow access even if DB save fails
    }
    sessionStorage.setItem("pri-consent", "true");
    setSubmitting(false);
    onConsent();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,20,16,.92)", backdropFilter: "blur(12px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", overflowY: "auto" }}>
      <div style={{ background: "#FAF7F2", maxWidth: 640, width: "100%", maxHeight: "92vh", overflowY: "auto", padding: "2.5rem 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>&#x26A0;&#xFE0F;</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: ".5rem" }}>
            Before You Go In
          </h2>
          <div style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B21A8" }}>
            Read this. Actually read it.
          </div>
        </div>

        {/* Disclaimer Text */}
        <div style={{ ...S.body, fontSize: ".88rem", lineHeight: 1.8 }}>
          {/* Tony's Personal Note */}
          <div style={{ background: "rgba(139,105,20,0.06)", border: "1px solid rgba(139,105,20,0.2)", borderLeft: "4px solid #8B6914", padding: "1rem 1.25rem", marginBottom: "1.5rem", borderRadius: "2px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: ".5rem" }}>A Note from Tony Greenberg</div>
            <p style={{ margin: 0, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: ".95rem", color: "#3D2E1E", lineHeight: 1.8, fontStyle: "italic" }}>
              "Here is what I want you to know before you go one click further. Most of these medicines I have never touched. Some of them I probably never will. What I have done is spent the better part of three decades watching this field from the inside... the researchers, the healers, the disasters, the quiet miracles that never made the news. This index is a synthesis of all of that. It exists because I have seen what happens when someone walks into a ceremony with no map and no container and no one who actually knows what they are doing. This is the map. Where you go from here is completely and entirely up to you."
            </p>
            <p style={{ margin: ".75rem 0 0", fontFamily: "'DM Mono', monospace", fontSize: ".7rem", color: "#8B6914", letterSpacing: ".08em" }}>... Tony Greenberg, Impact Futurist &amp; Investor in Consciousness Medicine</p>
          </div>
          <div style={{ ...S.dangerBox, marginBottom: "1.25rem" }}>
            <div style={{ fontWeight: 800, color: "#6B21A8", marginBottom: ".5rem", fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".08em" }}>              Not a Doctor. Not a Dealer. Not Reddit.
            </div>
            <p style={{ margin: 0, color: "#4A3F35", lineHeight: 1.7 }}>
              The Psychedelic Readiness Index is built from decades of research, clinical literature, harm reduction work, and conversations with people who have actually been in the room. It is <strong>not medical advice</strong>, not a prescription, and not a substitute for a real conversation with a real healthcare professional who knows your history.
            </p>
          </div>

          <div style={{ ...S.warningBox, marginBottom: "1.25rem" }}>
            <div style={{ fontWeight: 800, color: "#E65100", marginBottom: ".5rem", fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
              What This Is ... And What It Is Not
            </div>
            <ul style={{ margin: ".5rem 0", paddingLeft: "1.25rem", lineHeight: 2 }}>
              <li>Not a doctor. Not a therapist. Not a shaman. We are none of those things and we are not pretending to be.</li>
              <li>Not anonymous internet advice. Every data point in here has been cross-referenced against clinical trials, harm reduction databases, and people who have actually sat with these medicines professionally.</li>
              <li>Not a recommendation. Nothing in here says you should do anything. It says here is what is known, here is what the research shows, here is what experienced practitioners report.</li>
              <li>A synthesis. Built from clinical literature, DanceSafe, Zendo Project, MAPS, ethnobotanical research, and the kind of conversations that happen when people stop performing and start being honest.</li>
              <li>A starting point. Not a finish line. Use this to have better conversations with qualified professionals, not to skip them.</li>
            </ul>
          </div>

          <div style={{ background: "#F4F0E8", padding: "1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ fontWeight: 800, color: "#1C1410", marginBottom: ".5rem", fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
              You Acknowledge &amp; Accept
            </div>
            <ol style={{ margin: ".5rem 0", paddingLeft: "1.25rem", lineHeight: 2 }}>
              <li>This is for education and harm reduction only. Full stop.</li>
              <li>Nothing listed here is an endorsement. Not a medicine, not a provider, not a protocol. We are not sending you anywhere.</li>
              <li>You will talk to a real healthcare professional before you do anything. That is not optional.</li>
              <li>You own your decisions. Every single one of them. We do not.</li>
              <li>The people who built this tool assume zero liability for what you do with it. Zero.</li>
              <li>Safety data evolves. What is true today may be updated tomorrow. Always verify with current clinical sources.</li>
              <li>A lot of what is covered here is illegal in a lot of places. You are responsible for knowing your laws. We are not your lawyer.</li>
            </ol>
          </div>

          <p style={{ fontStyle: "italic", color: "#7A6A5A", marginBottom: "1.5rem" }}>
            This tool exists because the alternative is people going in blind. And that is worse. But information without responsibility is just noise. You have to show up for your own safety.
          </p>
        </div>

        {/* Consent Form */}
        <div style={{ borderTopWidth: 2, borderTopStyle: "solid", borderTopColor: "#E0D8CC", paddingTop: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", cursor: "pointer", marginBottom: "1.25rem" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: ".25rem", width: 20, height: 20, accentColor: "#6B21A8", cursor: "pointer" }}
            />
            <span style={{ fontSize: ".88rem", color: "#1C1410", lineHeight: 1.6 }}>
              Yes, I read it. I understand this is synthesized information, not medical advice. Whatever happens next is on me.
            </span>
          </label>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginBottom: ".5rem" }}>
              Type Your Initials to Confirm
            </label>
            <input
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 5))}
              placeholder="e.g. TG"
              maxLength={5}
              style={{
                width: "100%", maxWidth: 160, padding: ".75rem 1rem",
                fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 700,
                textAlign: "center", letterSpacing: ".15em",
                borderWidth: 2, borderStyle: "solid",
                borderColor: initials.length >= 2 ? "#6B21A8" : "#E0D8CC",
                background: "#FAF7F2", color: "#1C1410",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={handleConsent}
            disabled={initials.length < 2 || !agreed || submitting}
            style={{
              ...S.btn,
              width: "100%", justifyContent: "center",
              background: (initials.length >= 2 && agreed) ? "#6B21A8" : "#E0D8CC",
              color: (initials.length >= 2 && agreed) ? "#F4F0E8" : "#7A6A5A",
              opacity: submitting ? 0.6 : 1,
              transition: "background .2s, color .2s",
            }}
          >
            {submitting ? "Recording..." : "I Understand \u2014 Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SAFETY TAB in Medicine Modal ── */
function SafetySection({ medicine }: { medicine: MedicineWithSafety }) {
  return (
    <div>
      {/* Safety Warning */}
      <div className="pri-danger-glow" style={S.dangerBox}>        <div style={{ fontWeight: 800, color: "#6B21A8", marginBottom: ".4rem", fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em" }}>
          Safety Warning
        </div>
        <div style={{ fontSize: ".88rem", color: "#4A3F35", lineHeight: 1.7 }}>{medicine.safetyWarning}</div>
      </div>

      {/* Contraindications */}
      <div style={S.label}>Contraindications ... Do Not Use If</div>
      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {medicine.contraindications.map((c, i) => (
          <li key={i} style={{ fontSize: ".88rem", color: "#4A3F35", lineHeight: 1.8, marginBottom: ".25rem" }}>
            {c}
          </li>
        ))}
      </ul>

      {/* Drug Interactions */}
      <div style={{ ...S.label, color: "#E65100" }}>Drug Interactions</div>
      <div style={S.warningBox}>
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {medicine.drugInteractions.map((d, i) => (
            <li key={i} style={{ fontSize: ".85rem", color: "#4A3F35", lineHeight: 1.8, marginBottom: ".3rem" }}>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Side Effects */}
      <div style={S.label}>Known Side Effects</div>
      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {medicine.sideEffects.map((s, i) => (
          <li key={i} style={{ fontSize: ".85rem", color: "#4A3F35", lineHeight: 1.8, marginBottom: ".2rem" }}>
            {s}
          </li>
        ))}
      </ul>

      {/* Legal Status */}
      <div style={S.label}>Legal Status</div>
      <div style={{ background: "#F4F0E8", padding: "1rem 1.25rem", fontSize: ".88rem", color: "#4A3F35", lineHeight: 1.7 }}>
        {medicine.legalStatus}
      </div>
    </div>
  );
}

/* ── COMMUNITY CORRECTION FORM ── */
function CorrectionForm({ medicine, onClose }: { medicine: MedicineWithSafety; onClose: () => void }) {
  const [fieldName, setFieldName] = useState("overview");
  const [suggestedContent, setSuggestedContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sessionId = useMemo(() => getSessionId(), []);
  const correctionMutation = trpc.pri.submitCorrection.useMutation();

  const fieldOptions = [
    { value: "overview", label: "Overview" },
    { value: "therapeutic", label: "Therapeutic Applications" },
    { value: "tradition", label: "Tradition" },
    { value: "contraindications", label: "Contraindications" },
    { value: "sideEffects", label: "Side Effects" },
    { value: "drugInteractions", label: "Drug Interactions" },
    { value: "safetyWarning", label: "Safety Warning" },
    { value: "legalStatus", label: "Legal Status" },
    { value: "pricing", label: "Pricing / Access" },
    { value: "providers", label: "Providers" },
  ];

  const handleSubmit = async () => {
    if (!suggestedContent.trim()) return;
    try {
      await correctionMutation.mutateAsync({
        medicineId: medicine.id,
        fieldName,
        currentContent: String((medicine as any)[fieldName] || ""),
        suggestedContent: suggestedContent.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        submitterName: submitterName.trim() || undefined,
        submitterEmail: submitterEmail.trim() || undefined,
        sessionId,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Still show success for UX
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>&#x2705;</div>
        <h3 style={{ ...S.heading, fontSize: "1.3rem", marginBottom: ".5rem" }}>Thank You</h3>
        <p style={{ ...S.body, color: "#7A6A5A" }}>
          Your correction has been submitted for review. Tony and the community team will review it and update the data if appropriate.
        </p>
        <button onClick={onClose} style={{ ...S.btn, background: "#1C1410", color: "#F4F0E8", marginTop: "1rem" }}>
          Close
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: ".65rem .9rem", fontSize: ".88rem",
    borderWidth: 1, borderStyle: "solid", borderColor: "#E0D8CC",
    background: "#FAF7F2", color: "#1C1410", fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <h3 style={{ ...S.heading, fontSize: "1.2rem", marginBottom: ".25rem" }}>
        Suggest a Correction for {medicine.name}
      </h3>
      <p style={{ fontSize: ".82rem", color: "#7A6A5A", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        Help us keep this data accurate. If you have clinical experience, published research, or verified information that improves our data, please share it below.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginBottom: ".35rem" }}>
          Which Section?
        </label>
        <select value={fieldName} onChange={(e) => setFieldName(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
          {fieldOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginBottom: ".35rem" }}>
          Your Suggested Correction *
        </label>
        <textarea
          value={suggestedContent}
          onChange={(e) => setSuggestedContent(e.target.value)}
          placeholder="Describe what should be changed and why..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical" as const }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginBottom: ".35rem" }}>
          Source / Citation (optional)
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
          style={inputStyle}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginBottom: ".35rem" }}>
            Your Name (optional)
          </label>
          <input type="text" value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} placeholder="Name" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginBottom: ".35rem" }}>
            Email (optional)
          </label>
          <input type="email" value={submitterEmail} onChange={(e) => setSubmitterEmail(e.target.value)} placeholder="email@example.com" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "flex", gap: ".75rem" }}>
        <button onClick={onClose} style={{ ...S.btn, background: "transparent", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#E0D8CC", color: "#7A6A5A", flex: 1 }}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!suggestedContent.trim() || correctionMutation.isPending}
          style={{
            ...S.btn, flex: 2, justifyContent: "center",
            background: suggestedContent.trim() ? "#6B21A8" : "#E0D8CC",
            color: suggestedContent.trim() ? "#F4F0E8" : "#7A6A5A",
          }}
        >
          {correctionMutation.isPending ? "Submitting..." : "Submit Correction"}
        </button>
      </div>
    </div>
  );
}

/* ── MEDICINE MODAL ── */
function MedicineModal({ medicine, onClose, isSaved, onToggleSaved }: { medicine: MedicineWithSafety; onClose: () => void; isSaved?: boolean; onToggleSaved?: (id: string) => void }) {
  const [tab, setTab] = useState<"info" | "safety" | "correct">("info");

  const tabs = [
    { key: "info" as const, label: "Overview" },
    { key: "safety" as const, label: "Safety & Risks" },
    { key: "correct" as const, label: "Suggest Correction" },
  ];

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(28,20,16,.88)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
    >
      <div style={{ background: "#FAF7F2", maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative", borderRadius: 0 }}>
        {/* Close + Bookmark buttons */}
        <div style={{ position: "absolute", top: ".75rem", right: ".75rem", display: "flex", gap: ".4rem", zIndex: 10 }}>
          {onToggleSaved && (
            <button onClick={() => onToggleSaved(medicine.id)} title={isSaved ? "Remove from saved" : "Save medicine"} style={{ background: isSaved ? "#6B21A8" : "rgba(28,20,16,.6)", borderWidth: 0, borderStyle: "none", borderColor: "transparent", fontSize: "1rem", cursor: "pointer", color: "#FAF7F2", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isSaved ? "\u2665" : "\u2661"}
            </button>
          )}
          <button onClick={onClose} style={{ background: "rgba(28,20,16,.6)", borderWidth: 0, borderStyle: "none", borderColor: "transparent", fontSize: "1.2rem", cursor: "pointer", color: "#FAF7F2", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            &#x2715;
          </button>
        </div>

        {/* Cinematic Hero Image */}
        {MEDICINE_IMAGES[medicine.id] && (
          <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
            <img
              src={MEDICINE_IMAGES[medicine.id]}
              alt=""
              sizes="(max-width: 640px) 100vw, 600px"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, transparent 40%, #FAF7F2 100%)" }} />
            {/* Glitch scanline overlay */}
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(28,20,16,.03) 2px, rgba(28,20,16,.03) 4px)", pointerEvents: "none" }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: MEDICINE_IMAGES[medicine.id] ? "0 2rem 0" : "2rem 2rem 0", marginTop: MEDICINE_IMAGES[medicine.id] ? "-2rem" : 0, position: "relative" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>{medicine.icon}</div>
          <div style={{ ...S.heading, fontSize: "clamp(1.4rem, 4vw, 1.8rem)" }}>{medicine.name}</div>
          <div style={{ fontSize: ".82rem", color: "#7A6A5A", marginBottom: "1rem" }}>{medicine.latin}</div>

          {/* Intensity bar */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#7A6A5A", minWidth: 55 }}>Intensity</div>
            <div style={{ flex: 1, height: 4, background: "#E0D8CC" }}>
              <div style={{ height: "100%", background: medicine.intensity > 0.8 ? "#6B21A8" : medicine.intensity > 0.5 ? "#9333EA" : "#6B8F71", width: `${medicine.intensity * 100}%` }} />
            </div>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#1C1410" }}>{Math.round(medicine.intensity * 100)}%</div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {medicine.tags.map((t) => (
              <span key={t} style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: ".15rem .4rem", borderWidth: 1, borderStyle: "solid", ...tagStyle(t) }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: "#E0D8CC", padding: "0 2rem" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: "none", borderWidth: 0, borderStyle: "none", borderColor: "transparent",
                padding: ".75rem 1rem", fontSize: ".75rem", fontWeight: 700,
                letterSpacing: ".06em", textTransform: "uppercase",
                color: tab === t.key ? "#6B21A8" : "#7A6A5A",
                borderBottomWidth: 2, borderBottomStyle: "solid",
                borderBottomColor: tab === t.key ? "#6B21A8" : "transparent",
                cursor: "pointer", marginBottom: -2,
                transition: "color .2s",
              }}
            >
              {t.key === "safety" && "\u26A0\uFE0F "}{t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "1.5rem 2rem 2rem" }}>
          {tab === "info" && (
            <>
              <div style={S.label}>Overview</div>
              <div style={S.body}>{medicine.overview}</div>

              <div style={S.label}>Therapeutic Applications</div>
              <div style={S.body}>{medicine.therapeutic}</div>

              <div style={S.label}>Tradition</div>
              <div style={S.body}>{medicine.tradition}</div>

              <div style={S.label}>Readiness Requirements</div>
              <div style={S.body}>{medicine.readiness}</div>

              <div style={S.label}>Cost &amp; Access (USD)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 1, background: "#E0D8CC", marginTop: ".5rem" }}>
                {medicine.pricing.map((p, i) => (
                  <div key={i} style={{ background: "#F4F0E8", padding: ".9rem", textAlign: "center" }}>
                    <div style={{ ...S.heading, fontSize: "1rem" }}>{p.amount}</div>
                    <div style={{ fontSize: ".62rem", color: "#7A6A5A", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{p.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: ".75rem", fontSize: ".78rem", color: "#7A6A5A" }}>{medicine.providers}</div>

              {/* Deep Dive links */}
              {(medicine.id === "iboga" || medicine.id === "ibogaine") && (
                <div style={{ background: "#1C1410", padding: "1.25rem 1.5rem", marginTop: "1.5rem" }}>
                  <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B21A8", marginBottom: ".4rem" }}>
                    Deep Dive Available
                  </div>
                  <div style={{ fontSize: ".85rem", color: "rgba(244,240,232,.6)", marginBottom: ".75rem", lineHeight: 1.6 }}>
                    The Plant vs The Isolate. Full alkaloid profiles, receptor pharmacology, Bwiti tradition vs clinical protocol, outcomes data, pharma alternatives, supplement stacks, and medicine selector.
                  </div>
                  <Link href="/iboga-ibogaine" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".6rem 1.25rem", background: "#6B21A8", color: "#F4F0E8", textDecoration: "none", fontSize: ".78rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>
                    Iboga vs Ibogaine Deep Dive &rarr;
                  </Link>
                  <Link href="/iboga-compass" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".6rem 1.25rem", background: "linear-gradient(135deg, #6B21A8, #9333EA)", color: "#F4F0E8", textDecoration: "none", fontSize: ".78rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginLeft: ".75rem" }}>
                    Take the Compass &rarr;
                  </Link>
                </div>
              )}
              {medicine.id === "mescaline" && (
                <div style={{ background: "#1C1410", padding: "1.25rem 1.5rem", marginTop: "1.5rem" }}>
                  <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B21A8", marginBottom: ".4rem" }}>
                    Deep Dive Available
                  </div>
                  <div style={{ fontSize: ".85rem", color: "rgba(244,240,232,.6)", marginBottom: ".75rem", lineHeight: 1.6 }}>
                    Full pharmacology, Latuda mirror comparison, outcomes data (n=452), pharma-to-plant alternatives table, supplement stacks, and medicine selector.
                  </div>
                  <Link href="/peyote-mescaline" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".6rem 1.25rem", background: "#6B21A8", color: "#F4F0E8", textDecoration: "none", fontSize: ".78rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>
                    Explore Full Module &rarr;
                  </Link>
                </div>
              )}
              {medicine.id === "ketamine" && (
                <div style={{ background: "#1C1410", padding: "1.25rem 1.5rem", marginTop: "1.5rem" }}>
                  <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B21A8", marginBottom: ".5rem" }}>
                    Practitioner Perspective ... Dr. Beverly Reader, MD
                  </div>
                  <div style={{ borderLeft: "3px solid #6B21A8", paddingLeft: "1rem", marginBottom: "1rem" }}>
                    <p style={{ fontSize: ".85rem", color: "rgba(244,240,232,.8)", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 .75rem" }}>
                      &ldquo;Ketamine softens the protective walls we\u2019ve built over a lifetime. In that window, IFS allows us to meet the wounded parts of ourselves with compassion rather than fear ... and that\u2019s where real healing begins.&rdquo;
                    </p>
                    <p style={{ fontSize: ".85rem", color: "rgba(244,240,232,.8)", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 .75rem" }}>
                      &ldquo;There is nothing pathologic about protective parts. They developed in response to life experience. Our work is not to eliminate them but to release the burdens they carry.&rdquo;
                    </p>
                    <p style={{ fontSize: ".85rem", color: "rgba(244,240,232,.8)", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
                      &ldquo;The neuroplasticity window after ketamine is not just a clinical concept ... it\u2019s a lived experience. Patients describe feeling like the grooves of old patterns have been smoothed, and for the first time they can choose a different path.&rdquo;
                    </p>
                  </div>
                  <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.45)", marginTop: ".5rem" }}>
                    Dr. Beverly Reader, MD ... IFS + Ketamine-Assisted Psychotherapy ... Los Angeles ... 424-532-1552
                  </div>
                </div>
              )}

              {/* Quick safety callout on info tab */}
              <div style={{ ...S.warningBox, marginTop: "1.5rem" }}>
                <div style={{ fontWeight: 800, color: "#E65100", marginBottom: ".3rem", fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  &#x26A0;&#xFE0F; Review Safety Data Before Proceeding
                </div>
                <p style={{ margin: 0, fontSize: ".82rem", color: "#4A3F35" }}>
                  This medicine has {medicine.contraindications.length} contraindications and {medicine.drugInteractions.length} known drug interactions.{" "}
                  <button onClick={() => setTab("safety")} style={{ background: "none", borderWidth: 0, borderStyle: "none", borderColor: "transparent", color: "#6B21A8", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontSize: ".82rem", padding: 0 }}>
                    View Safety &amp; Risks tab &rarr;
                  </button>
                </p>
              </div>
            </>
          )}

          {tab === "safety" && <SafetySection medicine={medicine} />}

          {tab === "correct" && <CorrectionForm medicine={medicine} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

/* ── PriShareBar ── */
function PriShareBar() {
  const [copied, setCopied] = useState(false);
  const url = "https://onlytimebuystrust.com/psychedelic-readiness-index";
  const text = "The Psychedelic Readiness Index ... find your medicine match. 26 substances, 6 domains, hard-stop screening, medication interaction matrix.";

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const btnStyle: React.CSSProperties = {
    background: "rgba(107,33,168,.12)",
    color: "#F4F0E8",
    border: "1px solid rgba(168,85,247,.3)",
    borderRadius: 8,
    padding: ".5rem 1.1rem",
    fontSize: ".82rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: ".4rem",
    transition: "all .2s",
    textDecoration: "none",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#A855F7", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: ".75rem" }}>Share This Instrument</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", justifyContent: "center" }}>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          𝕏 Share on X
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          in Share on LinkedIn
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          f Share on Facebook
        </a>
        <a href={`mailto:?subject=${encodeURIComponent("The Psychedelic Readiness Index")}&body=${encodeURIComponent(text + "\n\n" + url)}`} style={btnStyle}>
          ✉ Send by Email
        </a>
        <button onClick={copyLink} style={btnStyle}>
          {copied ? "✓ Copied" : "⧉ Copy Link"}
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ── */

type AppState = "philosophy" | "intro" | "quiz" | "pathway" | "results";

export default function PsychedelicReadinessIndex() {
  const [state, setState] = useState<AppState>("philosophy");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => new Array(QUESTIONS.length).fill(5));
  const [pathwayAnswers, setPathwayAnswers] = useState<Record<string, number>>(() =>
    Object.fromEntries(PATHWAY_QUESTIONS.map((q) => [q.id, 5]))
  );
  const [currentPathwayQ, setCurrentPathwayQ] = useState(0);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineWithSafety | null>(null);
  const [hasConsent, setHasConsent] = useState(() => sessionStorage.getItem("pri-consent") === "true");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [savedMeds, setSavedMeds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("pri-saved-medicines") || "[]"); } catch { return []; }
  });
  const [referralConsent, setReferralConsent] = useState(false);
  const [referralName, setReferralName] = useState("");
  const [referralEmail, setReferralEmail] = useState("");
  const [referralRegion, setReferralRegion] = useState("");
  const [referralSent, setReferralSent] = useState(false);
  const [referralSending, setReferralSending] = useState(false);
  const referralMutation = trpc.assessments.submit.useMutation();

  const toggleSaved = useCallback((id: string) => {
    setSavedMeds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("pri-saved-medicines", JSON.stringify(next));
      return next;
    });
  }, []);

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
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const dimRows = (Object.keys(results.dimScores) as DimKey[]).map((d) => {
      const score = results.dimScores[d];
      const barColor = score >= 75 ? "#2E7D32" : score >= 50 ? "#9333EA" : "#6B21A8";
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;font-weight:700;width:40%">${DIM_ICONS[d]} ${DIM_LABELS[d]}</td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;width:40%"><div style="background:#F0EBE3;height:8px;border-radius:4px;overflow:hidden"><div style="height:100%;width:${score}%;background:${barColor};border-radius:4px"></div></div></td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;text-align:center;font-size:1.1rem;font-weight:900;width:20%">${score}<small style='font-size:.7rem;color:#7A6A5A'>/100</small></td></tr>`;
    }).join("");
    const matchRows = results.topMatches.map((m, i) => {
      const barColor = m.matchScore >= 80 ? "#2E7D32" : m.matchScore >= 60 ? "#9333EA" : "#6B21A8";
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;font-weight:800;color:#6B21A8;width:8%">#${i + 1}</td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;font-weight:700;width:32%">${m.icon} ${m.name}</td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;width:40%"><div style="background:#F0EBE3;height:8px;border-radius:4px;overflow:hidden"><div style="height:100%;width:${m.matchScore}%;background:${barColor};border-radius:4px"></div></div></td><td style="padding:10px 14px;border-bottom:1px solid #E8E0D6;text-align:center;font-weight:800;width:20%">${m.matchScore}%</td></tr>`;
    }).join("");
    const seqRows = results.sequence.map((s, i) =>
      `<tr><td style="padding:12px 14px;border-bottom:1px solid #E8E0D6"><div style="display:flex;align-items:center;gap:8px"><span style="background:#6B21A8;color:#fff;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-size:.7rem;font-weight:900;flex-shrink:0">${i + 1}</span><strong>${s.icon} ${s.name}</strong></div><div style="font-size:.82rem;color:#7A6A5A;margin-top:4px;padding-left:32px">${s.why}</div></td><td style="padding:12px 14px;border-bottom:1px solid #E8E0D6;font-size:.85rem;color:#4A3F35;white-space:nowrap;vertical-align:top">${s.time}</td><td style="padding:12px 14px;border-bottom:1px solid #E8E0D6;font-weight:700;white-space:nowrap;vertical-align:top">${s.cost}</td></tr>`
    ).join("");
    const savedSection = savedMeds.length > 0 ? `<h2>My Saved Medicines</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin:1rem 0">${savedMeds.map((id) => {
      const m = MEDICINES.find((med) => med.id === id);
      return m ? `<div style="background:#F8F5F0;border:1px solid #E8E0D6;padding:10px 14px;display:flex;align-items:center;gap:8px"><span style="font-size:1.3rem">${m.icon}</span><div><div style="font-weight:700;font-size:.9rem">${m.name}</div><div style="font-size:.75rem;color:#7A6A5A;text-transform:uppercase;letter-spacing:.04em">${m.src}</div></div></div>` : "";
    }).join("")}</div>` : "";
    w.document.write(`<!DOCTYPE html><html><head><title>Psychedelic Readiness Index ... Personal Report</title><style>
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
      <div class="footer">Generated at tonygreenberg.com/pri ... ${dateStr}</div>
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
    [currentQ]
  );

  const nextQuestion = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // After readiness questions, go to Pathway & Access
      setState("pathway");
      setCurrentPathwayQ(0);
      setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [currentQ]);

  const nextPathwayQuestion = useCallback(() => {
    if (currentPathwayQ < PATHWAY_QUESTIONS.length - 1) {
      setCurrentPathwayQ((q) => q + 1);
    } else {
      // All pathway questions done ... show disclaimer or results
      if (!hasConsent) {
        setShowDisclaimer(true);
      } else {
        setState("results");
        setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [currentPathwayQ, hasConsent]);

  const prevPathwayQuestion = useCallback(() => {
    if (currentPathwayQ > 0) {
      setCurrentPathwayQ((q) => q - 1);
    } else {
      // Go back to last readiness question
      setState("quiz");
      setCurrentQ(QUESTIONS.length - 1);
    }
  }, [currentPathwayQ]);

  const handleConsentComplete = useCallback(() => {
    setHasConsent(true);
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

  // Medicine click handler ... requires consent for full details
  const handleMedicineClick = useCallback((m: Medicine) => {
    const mws = getMedicineWithSafety(m);
    if (!hasConsent) {
      setShowDisclaimer(true);
      // After consent, we'll open the medicine
      sessionStorage.setItem("pri-pending-medicine", m.id);
    } else {
      setSelectedMedicine(mws);
    }
  }, [hasConsent]);

  // After consent, check if there was a pending medicine
  useEffect(() => {
    if (hasConsent) {
      const pendingId = sessionStorage.getItem("pri-pending-medicine");
      if (pendingId) {
        sessionStorage.removeItem("pri-pending-medicine");
        const m = MEDICINES.find((med) => med.id === pendingId);
        if (m) setSelectedMedicine(getMedicineWithSafety(m));
      }
    }
  }, [hasConsent]);

  // Deep-link: auto-open medicine modal from ?m= query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mId = params.get("m");
    if (mId) {
      const m = MEDICINES.find((med) => med.id === mId);
      if (m) {
        if (hasConsent) {
          setSelectedMedicine(getMedicineWithSafety(m));
        } else {
          sessionStorage.setItem("pri-pending-medicine", m.id);
          setShowDisclaimer(true);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SEO
        title="Psychedelic Readiness Index \u2014 Find Your Medicine"
        description="26 plant medicines. 50+ readiness questions. 6 domains. MAO-B interaction matrix. An honest map of where you stand ... before you walk into territory that rewards preparation."
        path="/psychedelic-readiness-index"
        indexable={true}
      />

      <style>{`
        @keyframes purpleShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes purpleGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(107,33,168,0.0), 0 0 20px rgba(107,33,168,0.0); }
          50% { box-shadow: 0 0 12px rgba(107,33,168,0.25), 0 0 30px rgba(107,33,168,0.1); }
        }
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .pri-btn-purple {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .pri-btn-purple:hover {
          background: linear-gradient(135deg, #6B21A8 0%, #4338CA 50%, #6B21A8 100%) !important;
          box-shadow: 0 0 20px rgba(107,33,168,0.4), 0 0 40px rgba(67,56,202,0.15);
          transform: translateY(-1px);
        }
        .pri-btn-purple::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s ease;
        }
        .pri-btn-purple:hover::after {
          left: 150%;
        }
        .pri-card-glow {
          transition: all 0.3s ease;
        }
        .pri-card-glow:hover {
          box-shadow: 0 4px 24px rgba(107,33,168,0.15), 0 0 40px rgba(107,33,168,0.08);
          border-color: rgba(107,33,168,0.3) !important;
        }
        .pri-eyebrow-shimmer {
          background: linear-gradient(90deg, #6B21A8 0%, #4338CA 25%, #7C3AED 50%, #4338CA 75%, #6B21A8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s linear infinite;
        }
        .pri-danger-glow {
          transition: all 0.3s ease;
        }
        .pri-danger-glow:hover {
          box-shadow: 0 0 16px rgba(107,33,168,0.2), inset 0 0 8px rgba(107,33,168,0.05);
        }
      `}</style>

      <div ref={topRef} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F4F0E8", color: "#1C1410", lineHeight: 1.7 }}>

        {/* ── HERO ── */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "90px 1.25rem 4rem", maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Cinematic hero background ... ceremonial bowl with neural smoke */}
          <div className="glitch-hero" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.3, zIndex: 0, overflow: "hidden" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/pri-hero-v2-mSDTNiwzeoV4EwNs4reHC8.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", filter: "brightness(0.85) contrast(1.1) saturate(1.2)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(244,240,232,0.85) 0%, rgba(244,240,232,0.5) 50%, rgba(244,240,232,0.2) 100%)" }} />
            <div className="glitch-scanlines" />
            <div className="glitch-tear" style={{ top: "35%" }} />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ ...S.eyebrow, marginBottom: "1rem" }}>
            <span style={S.eyebrowDash} />
            Psychedelic Readiness Index
          </div>
          <h1 style={{ ...S.heading, fontSize: "clamp(2.5rem, 8vw, 6rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-.03em", marginBottom: "1.5rem" }}>
            Find My<br /><em style={{ fontStyle: "normal", color: "#6B21A8" }}>Medicine</em>
          </h1>
          <p style={{ fontSize: "clamp(.95rem, 2.5vw, 1.1rem)", color: "#4A3F35", maxWidth: 560, marginBottom: "1rem" }}>
            26 plant medicines. 50+ readiness questions. 6 domains. MAO-B interaction matrix. An honest map of where you stand ... before you walk into territory that rewards preparation.
          </p>

          {/* Disclaimer notice in hero */}
          <div style={{ background: "#FAF7F2", borderLeftWidth: 3, borderLeftStyle: "solid", borderLeftColor: "#6B21A8", padding: ".75rem 1rem", marginBottom: "1.5rem", maxWidth: 560 }}>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#6B21A8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".2rem" }}>
              Community-Aggregated Information
            </div>
            <div style={{ fontSize: ".82rem", color: "#7A6A5A", lineHeight: 1.6 }}>
              This is not medical advice. Not a doctor. Not Reddit. Not gossip. Curated from clinical research, harm reduction organizations, and experienced practitioners. You proceed at your own risk.
            </div>
          </div>

          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <button onClick={startQuiz} className="pri-btn-purple" style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8" }}>
              Begin Assessment &rarr;
            </button>
            <a href="#medicines" style={{ ...S.btn, borderWidth: "1.5px", borderStyle: "solid", borderColor: "#1C1410", background: "transparent", color: "#1C1410", textDecoration: "none" }}>
              Explore Medicines
            </a>
          </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "#E0D8CC", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#E0D8CC", margin: "0 1.25rem" }}>
          {[
            { n: "26", l: "Plant Medicines" },
            { n: "50+", l: "Quiz Questions" },
            { n: "6", l: "Domains" },
            { n: "\u221E", l: "Healing Paths" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "1.5rem 1rem", borderRightWidth: 1, borderRightStyle: "solid", borderRightColor: "#E0D8CC" }}>
              <div style={{ ...S.heading, fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 900, lineHeight: 1, color: "#6B21A8" }}>{s.n}</div>
              <div style={{ fontSize: ".7rem", fontWeight: 600, color: "#7A6A5A", letterSpacing: ".06em", textTransform: "uppercase", marginTop: ".25rem" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── MEDICINE GRID ── */}
        <div id="medicines" style={{ padding: "4rem 1.25rem", maxWidth: 1200, margin: "0 auto" }}>
          {/* Cinematic pharmacopoeia image ... botanical specimens on stone tiles */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(200px, 30vw, 360px)", overflow: "hidden", marginBottom: "2rem", position: "relative" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_14_1_Ay780tKhHUlRIDgLEPEyF6_1773615910924_na1fn_L2hvbWUvdWJ1bnR1L3BoYXJtYWNvcG9laWE_7a2f5a05.jpg" alt="26 sacred plant medicines arranged on stone tiles" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #F4F0E8 100%)" }} />
            <div className="glitch-scanlines" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#E0D8CC", flexWrap: "wrap", gap: ".75rem" }}>
            <div>
              <div style={S.eyebrow}>
                <span style={S.eyebrowDash} />
                The Pharmacopoeia
              </div>
              <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.8rem)" }}>26 Sacred Medicines</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <button
                onClick={() => { setCompareMode(!compareMode); if (compareMode) setCompareList([]); }}
                style={{
                  background: compareMode ? "#6B21A8" : "transparent",
                  color: compareMode ? "#F4F0E8" : "#7A6A5A",
                  borderWidth: 1, borderStyle: "solid",
                  borderColor: compareMode ? "#6B21A8" : "#C8B89A",
                  padding: ".45rem 1rem", fontSize: ".75rem", fontWeight: 700,
                  letterSpacing: ".06em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all .3s",
                }}
              >
                {compareMode ? `Compare (${compareList.length}/3)` : "Compare Medicines"}
              </button>
              {!compareMode && <div style={{ fontSize: ".78rem", color: "#7A6A5A", textAlign: "right" }}>Click any card<br />to explore</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 1, background: "#E0D8CC", borderWidth: 1, borderStyle: "solid", borderColor: "#E0D8CC" }}>
            {MEDICINES.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: (idx % 6) * 0.08, ease: "easeOut" }}
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
                style={{
                  background: compareMode && compareList.includes(m.id) ? "#F0E8D8" : "#FAF7F2",
                  padding: 0, cursor: "pointer", transition: "all .3s", position: "relative", overflow: "hidden",
                  outline: compareMode && compareList.includes(m.id) ? "3px solid #6B21A8" : "none",
                  outlineOffset: "-3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F4F0E8";
                  const img = e.currentTarget.querySelector('.med-thumb') as HTMLElement;
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FAF7F2";
                  const img = e.currentTarget.querySelector('.med-thumb') as HTMLElement;
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Compare selection badge */}
                {compareMode && compareList.includes(m.id) && (
                  <div style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, background: "#6B21A8", color: "#F4F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", fontWeight: 900, zIndex: 5, borderRadius: "50%" }}>
                    {compareList.indexOf(m.id) + 1}
                  </div>
                )}
                {/* Bookmark heart */}
                {!compareMode && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSaved(m.id); }}
                    title={savedMeds.includes(m.id) ? "Remove from saved" : "Save medicine"}
                    style={{
                      position: "absolute", top: 6, right: 6, width: 26, height: 26,
                      background: savedMeds.includes(m.id) ? "#6B21A8" : "rgba(28,20,16,.45)",
                      borderWidth: 0, borderStyle: "none", borderColor: "transparent",
                      color: "#FAF7F2", fontSize: ".82rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%", zIndex: 5, transition: "all .2s",
                      opacity: savedMeds.includes(m.id) ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { if (!savedMeds.includes(m.id)) e.currentTarget.style.opacity = "0.6"; }}
                  >
                    {savedMeds.includes(m.id) ? "\u2665" : "\u2661"}
                  </button>
                )}
                {/* Thumbnail image */}
                {MEDICINE_IMAGES[m.id] && (
                  <div style={{ width: "100%", height: 80, overflow: "hidden", position: "relative" }}>
                    <img className="med-thumb" src={MEDICINE_IMAGES[m.id]} alt="" sizes="(max-width: 640px) 25vw, 120px" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", transition: "transform .4s ease" }} loading="lazy" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 20%, #FAF7F2 100%)" }} />
                  </div>
                )}
                <div style={{ padding: "0.75rem 1rem 1.25rem" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: ".5rem" }}>{m.icon}</div>
                <div style={{ height: 3, background: "#E0D8CC", marginBottom: ".6rem" }}>
                  <div style={{ height: "100%", background: m.intensity > 0.8 ? "#C62828" : m.intensity > 0.5 ? "#E65100" : "#6B8F71", width: `${m.intensity * 100}%` }} />
                </div>
                <div style={{ ...S.heading, fontSize: "clamp(.82rem, 2vw, .95rem)", fontWeight: 700, marginBottom: ".15rem", lineHeight: 1.3 }}>{m.name}</div>
                <div style={{ fontSize: ".75rem", color: "#7A6A5A", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".5rem" }}>{m.src}</div>
                <div style={{ display: "flex", gap: ".25rem", flexWrap: "wrap" }}>
                  {m.tags.map((t) => (
                    <span key={t} style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: ".1rem .3rem", borderWidth: 1, borderStyle: "solid", ...tagStyle(t) }}>{t}</span>
                  ))}
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── MY SAVED MEDICINES PANEL ── */}
        {savedMeds.length > 0 && !compareMode && (
          <div data-saved-panel style={{ background: "#F4F0E8", padding: "2rem 1.25rem", borderTopWidth: 3, borderTopStyle: "solid", borderTopColor: "#6B21A8" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".5rem" }}>
                <div>
                  <div style={S.eyebrow}>
                    <span style={S.eyebrowDash} />
                    Your Shortlist
                  </div>
                  <h3 style={{ ...S.heading, fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                    My Saved Medicines <span style={{ fontSize: ".85rem", color: "#6B21A8", fontWeight: 800 }}>({savedMeds.length})</span>
                  </h3>
                </div>
                <button
                  onClick={() => { if (confirm("Clear all saved medicines?")) { setSavedMeds([]); localStorage.removeItem("pri-saved-medicines"); } }}
                  style={{ background: "transparent", borderWidth: 1, borderStyle: "solid", borderColor: "#C8B89A", color: "#7A6A5A", padding: ".4rem .8rem", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Clear All
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 1, background: "#E0D8CC", borderWidth: 1, borderStyle: "solid", borderColor: "#E0D8CC" }}>
                {savedMeds.map((id) => {
                  const m = MEDICINES.find((med) => med.id === id);
                  if (!m) return null;
                  return (
                    <div key={id} style={{ background: "#FAF7F2", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", transition: "background .2s" }}
                      onClick={() => handleMedicineClick(m)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F0E8D8"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#FAF7F2"; }}
                    >
                      {MEDICINE_IMAGES[id] && (
                        <div style={{ width: 50, height: 50, flexShrink: 0, overflow: "hidden", borderRadius: "50%" }}>
                          <img src={MEDICINE_IMAGES[id]} alt="" sizes="(max-width: 640px) 25vw, 120px" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                          <span style={{ fontSize: "1.2rem" }}>{m.icon}</span>
                          <span style={{ ...S.heading, fontSize: ".9rem", fontWeight: 700 }}>{m.name}</span>
                        </div>
                        <div style={{ fontSize: ".75rem", color: "#7A6A5A", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{m.src}</div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaved(id); }}
                        title="Remove from saved"
                        style={{ background: "rgba(200,54,42,.1)", borderWidth: 0, borderStyle: "none", borderColor: "transparent", color: "#6B21A8", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: ".85rem", borderRadius: "50%", flexShrink: 0 }}
                      >
                        {"\u2715"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: "1rem", fontSize: ".78rem", color: "#7A6A5A", lineHeight: 1.6 }}>
                Your saved medicines are stored locally in your browser. They will persist across visits but are not synced across devices.
              </div>
            </div>
          </div>
        )}

        {/* ── COMPARE PANEL ── */}
        {compareMode && compareList.length >= 2 && (
          <div style={{ background: "#1C1410", padding: "3rem 1.25rem", color: "#F4F0E8" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", paddingBottom: "1rem", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.1)" }}>
                <div>
                  <div style={{ ...S.eyebrow, color: "#6B21A8" }}><span style={S.eyebrowDash} />Side-by-Side</div>
                  <h2 style={{ ...S.heading, fontSize: "clamp(1.3rem, 3.5vw, 2rem)", color: "#F4F0E8" }}>Medicine Comparison</h2>
                </div>
                <button onClick={() => { setCompareMode(false); setCompareList([]); }} style={{ background: "transparent", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.2)", color: "#F4F0E8", padding: ".4rem .8rem", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" }}>Close</button>
              </div>

              {/* Comparison Grid */}
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${compareList.length}, 1fr)`, gap: "1px", background: "rgba(244,240,232,.08)" }}>
                {compareList.map((id) => {
                  const m = MEDICINES.find((med) => med.id === id)!;
                  const ms = getMedicineWithSafety(m);
                  return (
                    <div key={id} style={{ background: "#1C1410", padding: "1.5rem 1rem" }}>
                      {/* Header */}
                      {MEDICINE_IMAGES[id] && (
                        <div style={{ height: 100, overflow: "hidden", marginBottom: ".75rem", position: "relative" }}>
                          <img src={MEDICINE_IMAGES[id]} alt="" sizes="(max-width: 640px) 25vw, 120px" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} loading="lazy" />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, #1C1410 100%)" }} />
                        </div>
                      )}
                      <div style={{ fontSize: "1.8rem", marginBottom: ".25rem" }}>{m.icon}</div>
                      <div style={{ ...S.heading, fontSize: ".95rem", color: "#F4F0E8", marginBottom: ".15rem" }}>{m.name}</div>
                      <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "1rem" }}>{m.src}</div>

                      {/* Intensity */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(244,240,232,.4)", marginBottom: ".3rem" }}>Intensity</div>
                        <div style={{ height: 4, background: "rgba(244,240,232,.1)" }}>
                          <div style={{ height: "100%", background: m.intensity > 0.8 ? "#6B21A8" : m.intensity > 0.5 ? "#9333EA" : "#6B8F71", width: `${m.intensity * 100}%`, transition: "width .5s" }} />
                        </div>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#F4F0E8", marginTop: ".2rem" }}>{Math.round(m.intensity * 100)}%</div>
                      </div>

                      {/* 6 Dimension Scores */}
                      <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(244,240,232,.4)", marginBottom: ".5rem" }}>Dimension Scores</div>
                      {(Object.keys(DIM_LABELS) as DimKey[]).map((d) => (
                        <div key={d} style={{ display: "flex", alignItems: "center", gap: ".4rem", marginBottom: ".35rem" }}>
                          <div style={{ width: 50, fontSize: ".75rem", color: "rgba(244,240,232,.5)", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>{DIM_LABELS[d].split(" ")[0]}</div>
                          <div style={{ flex: 1, height: 3, background: "rgba(244,240,232,.08)" }}>
                            <div style={{ height: "100%", background: "#6B21A8", width: `${(m.dims[d] / 10) * 100}%`, transition: "width .5s" }} />
                          </div>
                          <div style={{ fontSize: ".7rem", fontWeight: 700, color: "#F4F0E8", width: 20, textAlign: "right" }}>{m.dims[d]}</div>
                        </div>
                      ))}

                      {/* Tags */}
                      <div style={{ display: "flex", gap: ".2rem", flexWrap: "wrap", marginTop: "1rem" }}>
                        {m.tags.map((t) => (
                          <span key={t} style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: ".1rem .25rem", borderWidth: 1, borderStyle: "solid", ...tagStyle(t) }}>{t}</span>
                        ))}
                      </div>

                      {/* Safety Summary */}
                      <div style={{ marginTop: "1rem", paddingTop: ".75rem", borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "rgba(244,240,232,.08)" }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(244,240,232,.4)", marginBottom: ".3rem" }}>Safety</div>
                        <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.6)", lineHeight: 1.5 }}>
                          {ms.contraindications.length} contraindications<br />
                          {ms.drugInteractions.length} drug interactions
                        </div>
                      </div>

                      {/* View Full Details */}
                      <button
                        onClick={() => { setCompareMode(false); setCompareList([]); setSelectedMedicine(ms); }}
                        style={{ width: "100%", marginTop: "1rem", background: "rgba(200,54,42,.15)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(200,54,42,.3)", color: "#6B21A8", padding: ".5rem", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" }}
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
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(28,20,16,.95)", backdropFilter: "blur(12px)", padding: "1rem 1.25rem", zIndex: 100, borderTopWidth: 2, borderTopStyle: "solid", borderTopColor: "#6B21A8", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <span style={{ fontSize: ".78rem", color: "rgba(244,240,232,.6)" }}>Select {2 - compareList.length} more medicine{compareList.length === 0 ? "s" : ""} to compare</span>
          </div>
        )}
        {compareMode && compareList.length >= 2 && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(28,20,16,.95)", backdropFilter: "blur(12px)", padding: "1rem 1.25rem", zIndex: 100, borderTopWidth: 2, borderTopStyle: "solid", borderTopColor: "#6B21A8", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <span style={{ fontSize: ".78rem", color: "#F4F0E8", fontWeight: 700 }}>{compareList.length} medicines selected</span>
            <a href="#compare-panel" onClick={(e) => { e.preventDefault(); document.querySelector('[style*="Side-by-Side"]')?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: "#6B21A8", color: "#F4F0E8", padding: ".5rem 1.25rem", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", cursor: "pointer" }}>View Comparison ↓</a>
            <button onClick={() => { setCompareMode(false); setCompareList([]); }} style={{ background: "transparent", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.2)", color: "rgba(244,240,232,.6)", padding: ".4rem .8rem", fontSize: ".75rem", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        )}

        {/* ── MAO-B INTERACTION MATRIX ── */}
        <section id="mao-b" style={{ background: "#1C1410", color: "#F4F0E8", padding: "0 0 4rem" }}>
          {/* Cinematic MAO-B image ... two liquids colliding, molecular structures */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 320px)", overflow: "hidden", position: "relative" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_42_2_cyf5h67593DZPHr3augAvg_1773615904853_na1fn_L2hvbWUvdWJ1bnR1L21hb2JfaW50ZXJhY3Rpb25fbWF0cml4_beb3e8b0.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6) contrast(1.2)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1C1410 100%)" }} />
            <div className="glitch-scanlines" />
          </div>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1.25rem" }}>
            <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.08)" }}>
              <div style={{ ...S.eyebrow, color: "#6B21A8" }}>
                <span style={S.eyebrowDash} />
                Pharmacological Safety
              </div>
              <h2 id="mao-b" style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.8rem)", color: "#F4F0E8" }}>MAO-B Interaction Matrix</h2>
              <p style={{ color: "rgba(244,240,232,.55)", maxWidth: 700, marginTop: ".75rem", fontSize: ".9rem", lineHeight: 1.7 }}>
                MAO-B inhibitors (selegiline, rasagiline, safinamide) are prescribed for Parkinson's disease and sometimes depression. At therapeutic doses, they selectively inhibit MAO-B ... but selectivity is dose-dependent and can be lost. This matrix maps the interaction risk with each psychedelic compound.
              </p>
            </div>

            {/* Risk level legend */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {[
                { label: "Hard Stop", color: "#ef4444", desc: "Do not combine under any circumstances" },
                { label: "Caution ... MD Consult", color: "#f97316", desc: "Requires physician evaluation" },
                { label: "Data Limited", color: "#eab308", desc: "Insufficient clinical data" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <div style={{ width: 12, height: 12, background: l.color, flexShrink: 0 }} />
                  <span style={{ fontSize: ".75rem", fontWeight: 700, color: "rgba(244,240,232,.6)", textTransform: "uppercase", letterSpacing: ".04em" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Interaction table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
                <thead>
                  <tr style={{ borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.15)" }}>
                    <th style={{ textAlign: "left", padding: ".75rem 1rem", fontSize: ".7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#6B21A8" }}>Compound</th>
                    <th style={{ textAlign: "left", padding: ".75rem 1rem", fontSize: ".7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#6B21A8" }}>Interaction</th>
                    <th style={{ textAlign: "center", padding: ".75rem 1rem", fontSize: ".7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#6B21A8" }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {MAOB_INTERACTIONS.map((row, i) => (
                    <tr key={i} style={{ borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.06)" }}>
                      <td style={{ padding: ".75rem 1rem", fontWeight: 700, color: "#F4F0E8", whiteSpace: "nowrap" }}>{row.compound}</td>
                      <td style={{ padding: ".75rem 1rem", color: "rgba(244,240,232,.6)", lineHeight: 1.5 }}>{row.interaction}</td>
                      <td style={{ padding: ".75rem 1rem", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: ".2rem .6rem", fontSize: ".75rem", fontWeight: 800,
                          textTransform: "uppercase", letterSpacing: ".04em",
                          background: row.riskLevel === "hard_stop" ? "rgba(239,68,68,.15)" : row.riskLevel === "caution_md" ? "rgba(249,115,22,.15)" : "rgba(234,179,8,.15)",
                          color: row.riskLevel === "hard_stop" ? "#ef4444" : row.riskLevel === "caution_md" ? "#f97316" : "#eab308",
                        }}>{row.riskLabel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Wash-out guidance */}
            <div style={{ marginTop: "2rem" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#6B21A8", marginBottom: "1rem" }}>MAO-B Inhibitor Wash-Out Guidance</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 1, background: "rgba(244,240,232,.06)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.08)" }}>
                {Object.entries(MAOB_WASHOUT).map(([drug, info]) => (
                  <div key={drug} style={{ background: "rgba(10,15,30,.4)", padding: "1.25rem" }}>
                    <div style={{ fontWeight: 800, color: "#F4F0E8", textTransform: "capitalize", marginBottom: ".4rem" }}>{drug}</div>
                    <div style={{ fontSize: ".78rem", color: "rgba(244,240,232,.5)", marginBottom: ".2rem" }}>Half-life: {info.halfLife}</div>
                    <div style={{ fontSize: ".78rem", color: "rgba(244,240,232,.5)", marginBottom: ".4rem" }}>Recovery: {info.recoveryTime}</div>
                    <div style={{ fontSize: ".78rem", color: "#f97316", lineHeight: 1.5 }}>{info.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MEDICATION INTERACTIONS ── */}
        <section style={{ background: "#F4F0E8", padding: "0 0 4rem" }}>
          {/* Cinematic medication interaction image ... hand navigating warning threads */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 320px)", overflow: "hidden", position: "relative" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_24_3_CDtc8wRbaTczuIl5ODhL7E_1773615908910_na1fn_L2hvbWUvdWJ1bnR1L21lZGljYXRpb25faW50ZXJhY3Rpb25fZ3VpZGU_1fb2633f.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #F4F0E8 100%)" }} />
            <div className="glitch-scanlines" />
          </div>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1.25rem" }}>
            <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#E0D8CC" }}>
              <div style={S.eyebrow}>
                <span style={S.eyebrowDash} />
                Critical Safety Reference
              </div>
              <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}>Medication Interaction Guide</h2>
              <p style={{ color: "#4A3F35", maxWidth: 700, marginTop: ".75rem", fontSize: ".9rem", lineHeight: 1.7 }}>
                If you take any of these medications, review the guidance carefully before considering any psychedelic experience. This is not exhaustive ... always consult your prescribing physician.
              </p>
            </div>

            <div style={{ display: "grid", gap: 1, background: "#E0D8CC", borderWidth: 1, borderStyle: "solid", borderColor: "#E0D8CC" }}>
              {MEDICATION_INTERACTIONS.map((med, i) => (
                <div key={i} style={{ background: "#FAF7F2", padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".5rem", marginBottom: ".5rem" }}>
                    <div style={{ ...S.heading, fontSize: "1rem", fontWeight: 800 }}>{med.category}</div>
                    <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#6B21A8", textTransform: "uppercase", letterSpacing: ".04em" }}>{med.risk.includes("LIFE-THREATENING") || med.risk.includes("ABSOLUTE") || med.risk.includes("Seizure") ? "\u26D4 Hard Stop" : "\u26A0\uFE0F Caution"}</div>
                  </div>
                  <div style={{ fontSize: ".78rem", color: "#7A6A5A", marginBottom: ".4rem" }}>{med.medications}</div>
                  <div style={{ fontSize: ".85rem", color: "#4A3F35", marginBottom: ".4rem", lineHeight: 1.6 }}><strong>Risk:</strong> {med.risk}</div>
                  <div style={{ fontSize: ".85rem", color: "#4A3F35", lineHeight: 1.6 }}><strong>Guidance:</strong> {med.guidance}</div>
                </div>
              ))}
            </div>

            {/* Crisis resources */}
            <div style={{ marginTop: "2rem", background: "#1C1410", padding: "0", overflow: "hidden" }}>
              {/* Cinematic crisis image ... lighthouse beam through storm */}
              <div className="glitch-hero" style={{ width: "100%", height: "clamp(120px, 18vw, 200px)", overflow: "hidden", position: "relative" }}>
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_9_5_VRn9xtScv1qYQMN2Aj1zNP_1773615893129_na1fn_L2hvbWUvdWJ1bnR1L2NyaXNpc19yZXNvdXJjZXNfbGlnaHRob3VzZQ_a3d95833.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) contrast(1.2)" }} loading="lazy" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #1C1410 100%)" }} />
              </div>
            <div style={{ padding: "1.5rem 2rem" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#6B21A8", marginBottom: "1rem" }}>Crisis Resources</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {CRISIS_RESOURCES.map((r, i) => (
                  <div key={i}>
                    <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#F4F0E8", marginBottom: ".2rem" }}>{r.name}</div>
                    <div style={{ fontSize: ".9rem", color: "#6B21A8", fontWeight: 800 }}>{r.contact}</div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </section>
        {/* ── ASSESSMENT SECTION ── */}
        <section ref={assessmentRef} style={{ background: "#1C1410", color: "#F4F0E8", padding: "0 0 4rem" }}>
          {/* Cinematic assessment image ... person at canyon edge, layered earth */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(200px, 28vw, 360px)", overflow: "hidden", position: "relative" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_3_4_WErEguPyxSRODIYK82xMyu_1773615891673_na1fn_L2hvbWUvdWJ1bnR1L2Fzc2Vzc21lbnRfaW1hZ2U_8a8c3b82.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", filter: "brightness(0.55) contrast(1.15)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1C1410 100%)" }} />
            <div className="glitch-scanlines" />
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.08)", flexWrap: "wrap", gap: ".75rem" }}>
              <div>
                <div style={{ ...S.eyebrow, color: "#6B21A8" }}>
                  <span style={S.eyebrowDash} />
                  Consciousness-Aligned Assessment
                </div>
                <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.8rem)", color: "#F4F0E8" }}>Readiness Index</h2>
              </div>
              <div style={{ fontSize: ".78rem", color: "rgba(244,240,232,.4)", textAlign: "right" }}>{QUESTIONS.length} Questions &middot; 6 Domains</div>
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* PHILOSOPHY OPENING */}
            {state === "philosophy" && (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: "#c9a84c", fontFamily: "sans-serif", marginBottom: "2rem", textTransform: "uppercase" }}>
                  Tony Greenberg &middot; The Diode of Perception
                </div>
                <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "left" }}>
                  {[
                    { text: "The diode of perception tethering movement to bone accelerates the other fundamental processes of life.", italic: false },
                    { text: "Beyond hunger, what you think of as necessity or craving is automatically fulfilled in the quickening of the senses \u2014 as spirit reaches in to taste the body.", italic: true },
                    { text: "Things of the past and future, things that you touch for pleasure \u2014 the pleasure is what electrical current you offer that thing.", italic: false },
                    { text: "If it is a living body \u2014 animal or human \u2014 it knows your love as you embrace its presence with your energetic breath: the waves of awareness stemming from that which you control your body from spirit.", italic: true },
                    { text: "The sharpening of will takes place as the simplicity of life \u2014 the places where your awareness cannot escape the body to forget itself in idle pastures, but remains alive in the sensation of time slowing across the curve of heartbeat weaving breath.", italic: false },
                  ].map((para, i) => (
                    <p key={i} style={{ fontSize: "clamp(1rem, 2.8vw, 1.2rem)", lineHeight: 1.85, marginBottom: "1.5rem", color: `rgba(244,240,232,${0.92 - i * 0.05})`, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: para.italic ? "italic" : "normal" }}>
                      {i === 0 && <span style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", lineHeight: 1, float: "left", marginRight: "0.12em", marginTop: "0.05em", color: "#c9a84c" }}>T</span>}
                      {i === 0 ? para.text.slice(1) : para.text}
                    </p>
                  ))}
                </div>
                <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)", margin: "2rem 0" }} />
                <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", padding: "1.5rem", marginBottom: "2rem", textAlign: "left", maxWidth: 560, margin: "0 auto 2rem" }}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#c9a84c", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "0.75rem" }}>What the Numbers Are Saying</div>
                  <p style={{ fontSize: "clamp(0.85rem, 2.2vw, 0.95rem)", lineHeight: 1.8, color: "rgba(244,240,232,0.7)", fontFamily: "sans-serif", margin: 0 }}>
                    You are the instrument. Every medicine, every ceremony, every facilitator conversation begins with one question: what is the current condition of the thing being played? This assessment exists to answer that \u2014 not to gatekeep, but to give you an honest map before you walk into territory that rewards preparation and punishes shortcuts.
                  </p>
                </div>
                <button
                  onClick={() => setState("intro")}
                  style={{ ...S.btn, background: "linear-gradient(135deg, #b45309, #d97706)", color: "#fff", fontSize: "clamp(1rem, 2.5vw, 1.1rem)", padding: "1rem 2.5rem" }}
                >
                  See Where You Actually Stand &#x2192;
                </button>
                <div style={{ marginTop: "1.5rem" }}>
                  <a href="/the-philosophy" style={{ color: "#c9a84c", fontSize: "0.75rem", fontFamily: "sans-serif", letterSpacing: "0.1em", textDecoration: "none" }}>
                    Read the full philosophy &#x2192;
                  </a>
                </div>
              </div>
            )}

            {/* INTRO STATE */}
            {state === "intro" && (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{"\u{1F31F}"}</div>
                <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "1rem", color: "#F4F0E8" }}>Your Readiness Assessment</h2>
                <p style={{ color: "rgba(244,240,232,.65)", maxWidth: 520, margin: "0 auto 2rem", fontSize: "clamp(.88rem, 2.5vw, 1rem)" }}>
                  Most people walk into these experiences with a plan. Very few walk in with a map. This is the map ... 25 questions across 7 dimensions. No right answers. What you get at the end is the honest picture of where you actually are, not where you wish you were.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 1, background: "rgba(244,240,232,.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.1)", margin: "1.5rem 0" }}>
                  {(Object.keys(DIM_LABELS) as DimKey[]).map((d) => (
                    <div key={d} style={{ background: "rgba(10,15,30,.4)", padding: ".75rem .4rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.2rem", marginBottom: ".2rem" }}>{DIM_ICONS[d]}</div>
                      <div style={{ fontSize: ".58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(244,240,232,.4)" }}>{DIM_LABELS[d]}</div>
                    </div>
                  ))}
                </div>
                <button onClick={startQuiz} style={{ ...S.btn, background: "#1C1410", color: "#F4F0E8", outline: "1px solid rgba(244,240,232,.2)" }}>
                  Begin {QUESTIONS.length}-Question Assessment &rarr;
                </button>
              </div>
            )}

            {/* QUIZ STATE */}
            {state === "quiz" && (
              <div>
                {/* Progress */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <div style={{ flex: 1, height: 3, background: "rgba(244,240,232,.1)" }}>
                    <div style={{ height: "100%", background: "#6B21A8", transition: "width .4s ease", width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                  </div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, color: "rgba(244,240,232,.45)", whiteSpace: "nowrap", letterSpacing: ".06em" }}>
                    {currentQ + 1} / {QUESTIONS.length}
                  </div>
                </div>

                {/* Question Card */}
                <div style={{ background: "rgba(244,240,232,.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.08)", padding: "clamp(1.5rem, 4vw, 2.25rem)" }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#6B21A8", marginBottom: ".75rem" }}>
                    {QUESTIONS[currentQ].category}
                  </div>
                  <div style={{ ...S.heading, fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: 600, color: "#F4F0E8", lineHeight: 1.45, marginBottom: QUESTIONS[currentQ].facilitatedNote ? "1rem" : "2rem" }}>
                    {QUESTIONS[currentQ].text}{QUESTIONS[currentQ].facilitatedNote && <span style={{ color: "#A855F7", marginLeft: ".25rem" }}>*</span>}
                  </div>
                  {QUESTIONS[currentQ].facilitatedNote && (
                    <div style={{ background: "rgba(107,33,168,.12)", border: "1px solid rgba(107,33,168,.3)", borderRadius: 4, padding: ".6rem .9rem", marginBottom: "1.5rem", fontSize: ".78rem", color: "rgba(244,240,232,.65)", lineHeight: 1.5 }}>
                      <span style={{ color: "#A855F7", fontWeight: 700 }}>* Facilitated setting: </span>{QUESTIONS[currentQ].facilitatedNote} Score 10 if you are working with a licensed facility.
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
                    <span style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(244,240,232,.35)" }}>Least Likely</span>
                    <span style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(244,240,232,.35)" }}>Most Likely</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={answers[currentQ]}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#6B21A8", cursor: "pointer", height: 28 }}
                  />
                  <div style={{ textAlign: "center", marginTop: ".75rem", fontSize: "clamp(.82rem, 2.5vw, .9rem)", fontWeight: 600, color: "rgba(244,240,232,.5)" }}>
                    <span style={{ color: "#6B21A8" }}>{answers[currentQ]}/10</span> ... {sliderLabel}
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", justifyContent: "space-between" }}>
                  <button
                    onClick={prevQuestion}
                    style={{ ...S.btn, background: "transparent", borderWidth: "1.5px", borderStyle: "solid", borderColor: currentQ === 0 ? "rgba(244,240,232,.1)" : "rgba(244,240,232,.2)", color: currentQ === 0 ? "rgba(244,240,232,.3)" : "#F4F0E8", opacity: currentQ === 0 ? 0.3 : 1, padding: ".75rem 1.25rem" }}
                    disabled={currentQ === 0}
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="pri-btn-purple" style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8", padding: ".75rem 1.5rem", flex: 1, maxWidth: 240, justifyContent: "center" }}
                  >
                    {currentQ === QUESTIONS.length - 1 ? "A Few More Questions \u2192" : "Next \u2192"}
                  </button>
                </div>
              </div>
            )}

            {/* PATHWAY & ACCESS STATE */}
            {state === "pathway" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#A855F7", marginBottom: ".5rem" }}>Part 2 of 2</div>
                  <h3 style={{ ...S.heading, fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "#F4F0E8", marginBottom: ".5rem" }}>How You Want to Go</h3>
                  <p style={{ fontSize: ".85rem", color: "rgba(244,240,232,.5)", maxWidth: 480, margin: "0 auto" }}>Eight questions about what matters to you ... not what you should want. These don't change your readiness score. They help point you somewhere real.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <div style={{ flex: 1, height: 3, background: "rgba(244,240,232,.1)" }}>
                    <div style={{ height: "100%", background: "#A855F7", transition: "width .4s ease", width: `${((currentPathwayQ + 1) / PATHWAY_QUESTIONS.length) * 100}%` }} />
                  </div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, color: "rgba(244,240,232,.45)", whiteSpace: "nowrap", letterSpacing: ".06em" }}>
                    {currentPathwayQ + 1} / {PATHWAY_QUESTIONS.length}
                  </div>
                </div>
                <div style={{ background: "rgba(244,240,232,.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(168,85,247,.15)", padding: "clamp(1.5rem, 4vw, 2.25rem)" }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#A855F7", marginBottom: ".75rem" }}>What Matters to You</div>
                  <div style={{ ...S.heading, fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: 600, color: "#F4F0E8", lineHeight: 1.45, marginBottom: PATHWAY_QUESTIONS[currentPathwayQ].note ? "1rem" : "2rem" }}>
                    {PATHWAY_QUESTIONS[currentPathwayQ].text}
                  </div>
                  {PATHWAY_QUESTIONS[currentPathwayQ].note && (
                    <div style={{ fontSize: ".78rem", color: "rgba(244,240,232,.45)", marginBottom: "1.5rem", fontStyle: "italic" }}>
                      {PATHWAY_QUESTIONS[currentPathwayQ].note}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
                    <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".04em", color: "rgba(244,240,232,.35)", maxWidth: "45%" }}>{PATHWAY_QUESTIONS[currentPathwayQ].lowLabel}</span>
                    <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".04em", color: "rgba(244,240,232,.35)", maxWidth: "45%", textAlign: "right" }}>{PATHWAY_QUESTIONS[currentPathwayQ].highLabel}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={pathwayAnswers[PATHWAY_QUESTIONS[currentPathwayQ].id] ?? 5}
                    onChange={(e) => setPathwayAnswers((prev) => ({ ...prev, [PATHWAY_QUESTIONS[currentPathwayQ].id]: parseInt(e.target.value) }))}
                    style={{ width: "100%", accentColor: "#A855F7", cursor: "pointer", height: 28 }}
                  />
                  <div style={{ textAlign: "center", marginTop: ".75rem", fontSize: "clamp(.82rem, 2.5vw, .9rem)", fontWeight: 600, color: "rgba(244,240,232,.5)" }}>
                    <span style={{ color: "#A855F7" }}>{pathwayAnswers[PATHWAY_QUESTIONS[currentPathwayQ].id] ?? 5}/10</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", justifyContent: "space-between" }}>
                  <button
                    onClick={prevPathwayQuestion}
                    style={{ ...S.btn, background: "transparent", borderWidth: "1.5px", borderStyle: "solid", borderColor: "rgba(244,240,232,.2)", color: "#F4F0E8", padding: ".75rem 1.25rem" }}
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={nextPathwayQuestion}
                    style={{ ...S.btn, background: "#A855F7", color: "#F4F0E8", padding: ".75rem 1.5rem", flex: 1, maxWidth: 240, justifyContent: "center" }}
                  >
                    {currentPathwayQ === PATHWAY_QUESTIONS.length - 1 ? "See My Results \u2192" : "Next \u2192"}
                  </button>
                </div>
              </div>
            )}

            {/* RESULTS STATE */}
            {state === "results" && results && (
              <div>
                {/* Score Header */}
                <div style={{ textAlign: "center", padding: "2rem 0 2.5rem", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.08)", marginBottom: "2rem" }}>
                  <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#6B21A8" }}>Where You Stand</div>
                  <div style={{ ...S.heading, fontSize: "clamp(4rem, 12vw, 6rem)", fontWeight: 900, color: "#6B21A8", lineHeight: 1, margin: ".5rem 0" }}>{results.overall}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F4F0E8", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>{results.level.label}</div>
                  <div style={{ fontSize: "clamp(.82rem, 2.5vw, .9rem)", color: "rgba(244,240,232,.55)", maxWidth: 440, margin: "0 auto" }}>{results.level.description}</div>
                </div>

                {/* Dimension Breakdown */}
                <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#6B21A8", marginBottom: "1rem" }}>Six Dimensions</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 1, background: "rgba(244,240,232,.06)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.08)", marginBottom: "2rem" }}>
                  {(Object.keys(results.dimScores) as DimKey[]).map((d) => (
                    <div key={d} style={{ background: "rgba(10,15,30,.4)", padding: "1rem .5rem", textAlign: "center" }}>
                      <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(244,240,232,.4)", marginBottom: ".3rem" }}>
                        {DIM_ICONS[d]} {DIM_LABELS[d]}
                      </div>
                      <div style={{ ...S.heading, fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 900, color: "#F4F0E8" }}>
                        {results.dimScores[d]}<small style={{ fontSize: ".8rem", color: "#6B21A8" }}>/100</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Matches */}
                <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#6B21A8", marginBottom: "1rem" }}>Where Your Profile Points</div>

                {/* Safety reminder before matches */}
                <div style={{ background: "rgba(200,54,42,.1)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(200,54,42,.3)", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
                  <div style={{ fontSize: ".75rem", fontWeight: 800, color: "#6B21A8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".3rem" }}>
                    &#x26A0;&#xFE0F; Review Safety Data Before Trying Any Medicine
                  </div>
                  <div style={{ fontSize: ".82rem", color: "rgba(244,240,232,.6)", lineHeight: 1.6 }}>
                    Click any medicine below to view its full contraindications, drug interactions, and side effects. This information is essential before making any decisions.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, background: "rgba(244,240,232,.06)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.08)", marginBottom: "2rem" }}>
                  {results.topMatches.map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMedicine(m)}
                      style={{ background: "rgba(10,15,30,.4)", padding: "1.5rem 1rem", textAlign: "center", position: "relative", cursor: "pointer", transition: "background .2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,15,30,.6)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10,15,30,.4)")}
                    >
                      <div style={{ position: "absolute", top: ".5rem", left: ".5rem", fontSize: ".75rem", fontWeight: 800, color: "#6B21A8", letterSpacing: ".1em" }}>#{i + 1}</div>
                      <div style={{ fontSize: "1.8rem", marginBottom: ".4rem" }}>{m.icon}</div>
                      <div style={{ ...S.heading, fontSize: "clamp(.82rem, 2vw, 1rem)", fontWeight: 700, color: "#F4F0E8", marginBottom: ".4rem", lineHeight: 1.3 }}>{m.name}</div>
                      <div style={{ height: 2, background: "rgba(244,240,232,.08)", margin: ".4rem 0" }}>
                        <div style={{ height: "100%", background: "#6B21A8", width: `${m.matchScore}%`, transition: "width 1.2s ease" }} />
                      </div>
                      <div style={{ fontSize: ".62rem", color: "rgba(244,240,232,.4)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{m.matchScore >= 80 ? "this one knows you" : m.matchScore >= 60 ? "worth a real look" : "keep it on the radar"}</div>
                    </div>
                  ))}
                </div>

                {/* Healing Sequence */}
                {/* Cinematic healing image ... spiral staircase ascending through clouds */}
                <div className="glitch-hero" style={{ width: "100%", height: "clamp(140px, 20vw, 240px)", overflow: "hidden", position: "relative", marginBottom: "1.5rem" }}>
                  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_36_6_V2zHpGt6IKEgb2XpfKmsCJ_1773615895415_na1fn_L2hvbWUvdWJ1bnR1L2hlYWxpbmdfc2VxdWVuY2U_4c245fba.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) contrast(1.15)" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1C1410 100%)" }} />
                  <div className="glitch-scanlines" />
                </div>
                <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#6B21A8", marginBottom: "1rem" }}>Where This Could Go</div>
                {results.sequence.map((s, i) => (
                  <div key={i} style={{ background: "rgba(244,240,232,.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.08)", padding: "clamp(1.25rem, 3vw, 1.75rem)", marginBottom: ".75rem", display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ ...S.heading, fontSize: "2rem", fontWeight: 900, color: "rgba(244,240,232,.07)", lineHeight: 1, minWidth: "2rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ ...S.heading, fontSize: "clamp(.95rem, 2.5vw, 1.1rem)", fontWeight: 700, color: "#F4F0E8", marginBottom: ".2rem" }}>
                        {s.icon} {s.name}
                      </div>
                      <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#6B21A8", marginBottom: ".4rem" }}>{s.time}</div>
                      <div style={{ fontSize: "clamp(.8rem, 2vw, .85rem)", color: "rgba(244,240,232,.5)", lineHeight: 1.55 }}>{s.why}</div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 100 }}>
                      <div style={{ ...S.heading, fontSize: "clamp(.88rem, 2vw, 1rem)", fontWeight: 700, color: "#F4F0E8" }}>{s.cost}</div>
                      <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.3)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Est. entry cost</div>
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "2rem", display: "flex", flexWrap: "wrap", gap: ".75rem", justifyContent: "center" }}>
                  <button onClick={exportPDF} className="pri-btn-purple" style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8" }}>
                    {"\uD83D\uDCC4"} Save My Results
                  </button>
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
            assessmentType="psychedelic-readiness"
            sessionId={getSessionId()}
            answers={JSON.stringify(answers)}
            resultSummary={JSON.stringify({ topMatches: results?.topMatches?.map(m => m.name) })}
            totalScore={results?.overall ?? null}
            />
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(107,33,168,.1)", borderRadius: "8px", border: "1px solid rgba(107,33,168,.3)" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer", fontSize: ".85rem", color: "rgba(244,240,232,.7)" }}>
                      <input type="checkbox" id="pri-research-optin" style={{ accentColor: "#6B21A8", width: 18, height: 18 }} />
                      <span>Add my results to the research pool. Anonymized. No personal data. Just the patterns.</span>
                    </label>
                  </div>

                  {/* Referral opt-in card */}
                  {!referralSent ? (
                    <div style={{ marginTop: "1rem", padding: "1.25rem", background: "rgba(168,85,247,.08)", borderRadius: "8px", border: "1px solid rgba(168,85,247,.25)", width: "100%", textAlign: "left" }}>
                      <div style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#A855F7", marginBottom: ".5rem" }}>Want a personal introduction?</div>
                      <p style={{ fontSize: ".82rem", color: "rgba(244,240,232,.6)", lineHeight: 1.55, marginBottom: "1rem" }}>
                        Tony reviews these himself. If you'd like him to connect you with a vetted facility in your region ... no spam, no lead gen, just a personal introduction ... check the box below.
                      </p>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", cursor: "pointer", fontSize: ".82rem", color: "rgba(244,240,232,.75)", marginBottom: referralConsent ? "1rem" : "0" }}>
                        <input
                          type="checkbox"
                          checked={referralConsent}
                          onChange={(e) => setReferralConsent(e.target.checked)}
                          style={{ accentColor: "#A855F7", width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
                        />
                        <span>Yes, I'd like Tony to connect me with a vetted facility in my region.</span>
                      </label>
                      {referralConsent && (
                        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={referralName}
                            onChange={(e) => setReferralName(e.target.value)}
                            style={{ background: "rgba(244,240,232,.06)", border: "1px solid rgba(168,85,247,.3)", borderRadius: 4, padding: ".6rem .8rem", color: "#F4F0E8", fontSize: ".82rem", outline: "none" }}
                          />
                          <input
                            type="email"
                            placeholder="Your email"
                            value={referralEmail}
                            onChange={(e) => setReferralEmail(e.target.value)}
                            style={{ background: "rgba(244,240,232,.06)", border: "1px solid rgba(168,85,247,.3)", borderRadius: 4, padding: ".6rem .8rem", color: "#F4F0E8", fontSize: ".82rem", outline: "none" }}
                          />
                          <input
                            type="text"
                            placeholder="Your region (e.g. New York, London, Sydney)"
                            value={referralRegion}
                            onChange={(e) => setReferralRegion(e.target.value)}
                            style={{ background: "rgba(244,240,232,.06)", border: "1px solid rgba(168,85,247,.3)", borderRadius: 4, padding: ".6rem .8rem", color: "#F4F0E8", fontSize: ".82rem", outline: "none" }}
                          />
                          <button
                            disabled={referralSending || !referralEmail || !referralRegion}
                            onClick={async () => {
                              setReferralSending(true);
                              try {
                                await referralMutation.mutateAsync({
                                  assessmentType: "psychedelic-readiness",
                                  sessionId: getSessionId(),
                                  answers: JSON.stringify({ readiness: answers, pathway: pathwayAnswers }),
                                  resultSummary: JSON.stringify({ topMatches: results?.topMatches?.map(m => m.name) }),
                                  totalScore: results?.overall ?? null,
                                  sharedWithTony: true,
                                  userName: referralName || undefined,
                                  userEmail: referralEmail,
                                  referralConsent: true,
                                  referralRegion,
                                });
                                setReferralSent(true);
                              } catch (e) {
                                console.error(e);
                                setReferralSending(false);
                              }
                            }}
                            style={{ ...S.btn, background: referralSending ? "rgba(168,85,247,.4)" : "#A855F7", color: "#F4F0E8", fontSize: ".8rem", padding: ".6rem 1.25rem", alignSelf: "flex-start", opacity: (!referralEmail || !referralRegion) ? 0.5 : 1 }}
                          >
                            {referralSending ? "Sending..." : "Send Introduction Request"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginTop: "1rem", padding: "1.25rem", background: "rgba(168,85,247,.08)", borderRadius: "8px", border: "1px solid rgba(168,85,247,.25)", textAlign: "center" }}>
                      <div style={{ fontSize: "1.4rem", marginBottom: ".4rem" }}>✓</div>
                      <div style={{ fontSize: ".85rem", color: "#A855F7", fontWeight: 700 }}>Tony received your request.</div>
                      <div style={{ fontSize: ".78rem", color: "rgba(244,240,232,.5)", marginTop: ".3rem" }}>He'll reach out personally when he has a match in your region.</div>
                    </div>
                  )}
                  <a href="/pri-calibration" style={{ textDecoration: "none" }}><button style={{ ...S.btn, background: "linear-gradient(135deg, #6B21A8, #A855F7)", color: "#F4F0E8", border: "none" }}>🎯 Calibrate My Results</button></a>

                  <button onClick={resetQuiz} style={{ ...S.btn, background: "transparent", borderWidth: "1.5px", borderStyle: "solid", borderColor: "rgba(244,240,232,.2)", color: "#F4F0E8" }}>

                    Retake Assessment
                  </button>
                  {savedMeds.length > 0 && (
                    <button onClick={() => document.querySelector('[data-saved-panel]')?.scrollIntoView({ behavior: 'smooth' })} style={{ ...S.btn, background: "transparent", borderWidth: "1.5px", borderStyle: "solid", borderColor: "rgba(200,54,42,.4)", color: "#6B21A8" }}>
                      \u2665 View Saved ({savedMeds.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SHARE BAR ── */}
        <section style={{ background: "rgba(107,33,168,.06)", padding: "2rem 1.25rem", borderTop: "1px solid rgba(107,33,168,.15)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <PriShareBar />
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ background: "rgba(10,15,30,.6)", padding: "4rem 1.25rem", borderTop: "1px solid rgba(107,33,168,.12)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(244,240,232,.35)", textAlign: "center", marginBottom: "2.5rem" }}>
              From people who took it
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {[
                {
                  quote: "I'd been planning a ceremony for two years. The PRI told me I wasn't ready ... specifically why. I was annoyed. Then I did the prep work it pointed to. Six months later I went in and it was completely different. The score was right.",
                  name: "M.T.",
                  context: "Brooklyn, NY · Psilocybin"
                },
                {
                  quote: "The medication interaction section stopped me cold. I'd been on an SSRI for four years and had no idea what that meant for ayahuasca. My doctor didn't know either. I'm glad I read it before I booked the retreat.",
                  name: "R.K.",
                  context: "Austin, TX · Ayahuasca"
                },
                {
                  quote: "I scored 'Not Yet ... And That's Honest.' That phrase hit harder than anything else on the page. I printed the results and brought them to my therapist. We worked through every yellow flag over the next four months.",
                  name: "S.W.",
                  context: "London, UK · MDMA Therapy"
                },
                {
                  quote: "I've done this work for fifteen years. I still use the PRI with every new client before we talk about medicine. It gives us a shared language for the conversation that used to take three sessions to get to.",
                  name: "J.A.",
                  context: "Integration Therapist · Portland, OR"
                },
                {
                  quote: "The ketamine section is the most honest thing I've read about KAP. I'd been to two providers who never mentioned half of what's in there. I switched providers after reading it.",
                  name: "D.F.",
                  context: "San Francisco, CA · Ketamine"
                },
                {
                  quote: "I scored 87 and felt proud of myself for about five minutes. Then I read the description ... 'Don't skip the facilitation.' That line kept me from going alone. Good call.",
                  name: "C.M.",
                  context: "Amsterdam · 5-MeO-DMT"
                },
              ].map((t, i) => (
                <div key={i} style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.07)", borderRadius: 8, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ margin: 0, fontSize: "clamp(.88rem, 2.2vw, .95rem)", lineHeight: 1.75, color: "rgba(244,240,232,.72)", fontStyle: "italic", fontFamily: "'Playfair Display', Georgia, serif" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: "1px solid rgba(244,240,232,.08)", paddingTop: ".75rem" }}>
                    <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#A855F7", letterSpacing: ".04em" }}>{t.name}</div>
                    <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.35)", marginTop: ".2rem", letterSpacing: ".03em" }}>{t.context}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMPACTSOUL SCORE CTA ── */}
        <section style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)", padding: "4rem 1.25rem", textAlign: "center", borderTop: "1px solid rgba(107,33,168,.3)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#9b59b6", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: "1rem" }}>Next Step</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#F4F0E8", lineHeight: 1.25, marginBottom: "1rem" }}>
              Your ImpactSoul Score<br /><span style={{ color: "#9b59b6" }}>measures what this can't.</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(244,240,232,.7)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520, margin: "0 auto 2rem" }}>
              The PRI tells you which medicine fits your biology. The ImpactSoul Score tells you where you are in your evolution ... and what kind of capital, community, and consciousness work you're actually ready for.
            </p>
            <a
              href="https://impactsoul.is"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: "linear-gradient(135deg, #6B21A8, #9b59b6)", color: "#F4F0E8", padding: "1rem 2.5rem", borderRadius: 4, fontWeight: 700, fontSize: ".85rem", textTransform: "uppercase", letterSpacing: ".1em", textDecoration: "none", boxShadow: "0 4px 24px rgba(107,33,168,.4)" }}
            >
              Get Your ImpactSoul Score →
            </a>
            <div style={{ marginTop: "1.25rem", fontSize: ".75rem", color: "rgba(244,240,232,.35)", letterSpacing: ".04em" }}>
              Free · 8 minutes · No account required
            </div>
          </div>
        </section>
        {/* ── FOOTER ── */}
        <footer style={{ background: "#1C1410", color: "rgba(244,240,232,.4)", padding: 0, textAlign: "center", position: "relative" }}>
          {/* Cinematic footer image ... intertwined trees forming a bridge */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_10_7_izBDVpysTtokCeVbU0sNp6_1773615912434_na1fn_L2hvbWUvdWJ1bnR1L2Zvb3Rlcl9pbWFnZQ_2a2c6369.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.2) contrast(1.1)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #1C1410 0%, transparent 30%, transparent 70%, #1C1410 100%)" }} />
          </div>
          <div style={{ position: "relative", zIndex: 1, padding: "3rem 1.25rem" }}>
          <div style={{ ...S.heading, fontSize: "1.3rem", color: "#F4F0E8", marginBottom: ".4rem" }}>
            ImpactSoul <span style={{ color: "#6B21A8" }}>&times;</span> Find My Medicine
          </div>
          <div style={{ fontSize: ".78rem", marginBottom: ".75rem" }}>A consciousness-aligned capital initiative</div>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", margin: "1rem 0", flexWrap: "wrap" }}>
            <Link href="/" style={{ fontSize: ".75rem", color: "rgba(244,240,232,.35)", textDecoration: "none", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>TonyGreenberg.com</Link>
            <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" style={{ fontSize: ".75rem", color: "rgba(244,240,232,.35)", textDecoration: "none", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>ImpactSoul.is</a>
          </div>

          {/* Full disclaimer in footer */}
          <div style={{ maxWidth: 600, margin: "1.5rem auto 0", borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "rgba(244,240,232,.06)", paddingTop: "1.25rem" }}>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#6B21A8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".5rem" }}>
              Legal Disclaimer
            </div>
            <div style={{ fontSize: ".7rem", lineHeight: 1.8, color: "rgba(244,240,232,.35)" }}>
              The Psychedelic Readiness Index is community-aggregated information compiled for educational and harm reduction purposes only. It does not constitute medical advice, diagnosis, or treatment. No medicine, provider, or protocol listed here constitutes an endorsement or recommendation. Always consult qualified healthcare professionals before engaging with any psychedelic substance. You proceed entirely at your own risk. The creators, contributors, and operators of this tool assume no liability for any outcomes. Many substances discussed are illegal in various jurisdictions. You are responsible for knowing and following the laws where you live.
            </div>
          </div>
          </div>
        </footer>
      </div>

      {/* ── DISCLAIMER GATE ── */}
      {showDisclaimer && !hasConsent && (
        <DisclaimerGate onConsent={handleConsentComplete} />
      )}

      {/* ── MEDICINE MODAL ── */}
      {selectedMedicine && (
        <MedicineModal
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          isSaved={savedMeds.includes(selectedMedicine.id)}
          onToggleSaved={toggleSaved}
        />
      )}
    </>
  );
}
