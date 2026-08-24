/**
 * PostIntervention.tsx
 * Anonymous post-ceremony/session assessment.
 * Choose Day 1, Day 3, or Day 7. Answer 12 questions. Submit anonymously.
 * Results go directly to tony@tonygreenberg.com.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";

type DayChoice = 1 | 3 | 7;
type InterventionType = "psychedelic" | "meditation" | "breathwork" | "ceremony" | "other";
type RecommendChoice = "yes" | "no" | "unsure";

const DAY_OPTIONS: { value: DayChoice; label: string; subtitle: string }[] = [
  { value: 1, label: "Day 1", subtitle: "Still in the glow. Raw and immediate." },
  { value: 3, label: "Day 3", subtitle: "The dust is settling. What's emerging?" },
  { value: 7, label: "Day 7", subtitle: "One week out. What actually changed?" },
];

const INTERVENTION_TYPES: { value: InterventionType; label: string }[] = [
  { value: "psychedelic", label: "Psychedelic Medicine" },
  { value: "ceremony", label: "Ceremony / Ritual" },
  { value: "meditation", label: "Meditation / Retreat" },
  { value: "breathwork", label: "Breathwork" },
  { value: "other", label: "Other" },
];

const SCALE_LABELS: Record<number, string> = {
  1: "Very low",
  2: "Low",
  3: "Below average",
  4: "Slightly below",
  5: "Neutral",
  6: "Slightly above",
  7: "Good",
  8: "Strong",
  9: "Very strong",
  10: "Exceptional",
};

function ScaleSelector({
  label,
  value,
  onChange,
  color = "#D97706",
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  color?: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#1A1208", marginBottom: 10, fontWeight: 600 }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              border: value === n ? `2px solid ${color}` : "1.5px solid #E5D9C8",
              background: value === n ? color : "#FFFDF7",
              color: value === n ? "#fff" : "#78350F",
              fontFamily: "DM Mono, monospace",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            title={SCALE_LABELS[n]}
          >
            {n}
          </button>
        ))}
      </div>
      {value !== null && (
        <p style={{ fontSize: 12, color: "#92400E", marginTop: 4, fontFamily: "DM Mono, monospace" }}>
          {value} — {SCALE_LABELS[value]}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#1A1208", marginBottom: 8, fontWeight: 600 }}>
        {label}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1.5px solid #E5D9C8",
          background: "#FFFDF7",
          fontFamily: "Georgia, serif",
          fontSize: 14,
          color: "#1A1208",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          lineHeight: 1.7,
        }}
        onFocus={(e) => { e.target.style.borderColor = "#D97706"; }}
        onBlur={(e) => { e.target.style.borderColor = "#E5D9C8"; }}
      />
    </div>
  );
}

export default function PostIntervention() {
  const [step, setStep] = useState<"day" | "type" | "survey" | "done">("day");
  const [dayChoice, setDayChoice] = useState<DayChoice | null>(null);
  const [interventionType, setInterventionType] = useState<InterventionType>("psychedelic");
  const [facilitatorRef, setFacilitatorRef] = useState("");

  // Scores
  const [integrationScore, setIntegrationScore] = useState<number | null>(null);
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<RecommendChoice | null>(null);

  // Open text
  const [wentWell, setWentWell] = useState("");
  const [couldImprove, setCouldImprove] = useState("");
  const [messageToFacilitator, setMessageToFacilitator] = useState("");

  const submitMutation = trpc.postIntervention.submit.useMutation({
    onSuccess: () => setStep("done"),
  });

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFFDF7 0%, #FEF3C7 30%, #FFF7ED 60%, #F5F0FF 100%)",
      fontFamily: "Georgia, serif",
      padding: "0 0 80px",
    } as React.CSSProperties,
    header: {
      background: "linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)",
      padding: "48px 24px 40px",
      textAlign: "center" as const,
    },
    headerEyebrow: {
      fontFamily: "DM Mono, monospace",
      fontSize: 11,
      letterSpacing: "0.2em",
      textTransform: "uppercase" as const,
      color: "#FDE68A",
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: "clamp(26px, 5vw, 40px)",
      fontWeight: 400,
      color: "#FFFDF7",
      margin: "0 0 12px",
      lineHeight: 1.2,
    },
    headerSub: {
      fontSize: 15,
      color: "#FDE68A",
      maxWidth: 520,
      margin: "0 auto",
      lineHeight: 1.6,
    },
    container: {
      maxWidth: 640,
      margin: "0 auto",
      padding: "40px 24px",
    },
    card: {
      background: "rgba(255,253,247,0.95)",
      borderRadius: 16,
      border: "1.5px solid #FDE68A",
      padding: "28px 28px",
      marginBottom: 20,
      boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
    },
    sectionTitle: {
      fontFamily: "DM Mono, monospace",
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase" as const,
      color: "#B45309",
      marginBottom: 16,
    },
    btn: {
      display: "inline-block",
      padding: "14px 32px",
      borderRadius: 10,
      background: "linear-gradient(135deg, #B45309, #D97706)",
      color: "#fff",
      fontFamily: "DM Mono, monospace",
      fontSize: 13,
      letterSpacing: "0.08em",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
      textTransform: "uppercase" as const,
    } as React.CSSProperties,
    btnOutline: {
      display: "inline-block",
      padding: "12px 28px",
      borderRadius: 10,
      background: "transparent",
      color: "#B45309",
      fontFamily: "DM Mono, monospace",
      fontSize: 13,
      letterSpacing: "0.08em",
      fontWeight: 700,
      border: "2px solid #D97706",
      cursor: "pointer",
      textTransform: "uppercase" as const,
    } as React.CSSProperties,
  };

  // ── Step: Choose Day ──
  if (step === "day") {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <p style={styles.headerEyebrow}>Post-Intervention Assessment</p>
          <h1 style={styles.headerTitle}>How Are You, Really?</h1>
          <p style={styles.headerSub}>
            Anonymous. Honest. Sent directly to the facilitator network.
            Your experience shapes how we guide the next person.
          </p>
        </div>
        <div style={styles.container}>
          <div style={styles.card}>
            <p style={styles.sectionTitle}>When are you taking this?</p>
            <p style={{ fontSize: 14, color: "#78350F", marginBottom: 20, lineHeight: 1.7 }}>
              Choose the window that best matches where you are in your integration.
              There is no wrong answer — each day reveals something different.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DAY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDayChoice(opt.value); setStep("type"); }}
                  style={{
                    padding: "18px 20px",
                    borderRadius: 12,
                    border: "2px solid #FDE68A",
                    background: "#FFFDF7",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#FEF3C7";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#D97706";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#FFFDF7";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#FDE68A";
                  }}
                >
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: 18, fontWeight: 700, color: "#B45309" }}>
                    {opt.label}
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#78350F", marginTop: 4 }}>
                    {opt.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#92400E", textAlign: "center", fontFamily: "DM Mono, monospace", letterSpacing: "0.05em" }}>
            Anonymous · No account required · Results go to tony@tonygreenberg.com
          </p>
        </div>
      </div>
    );
  }

  // ── Step: Intervention Type ──
  if (step === "type") {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <p style={styles.headerEyebrow}>Day {dayChoice} Assessment</p>
          <h1 style={styles.headerTitle}>What Did You Go Through?</h1>
          <p style={styles.headerSub}>Help us understand the context so we can read your responses correctly.</p>
        </div>
        <div style={styles.container}>
          <div style={styles.card}>
            <p style={styles.sectionTitle}>Type of intervention</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {INTERVENTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setInterventionType(t.value)}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 10,
                    border: interventionType === t.value ? "2px solid #D97706" : "1.5px solid #E5D9C8",
                    background: interventionType === t.value ? "#FEF3C7" : "#FFFDF7",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "Georgia, serif",
                    fontSize: 14,
                    color: "#1A1208",
                    fontWeight: interventionType === t.value ? 700 : 400,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#1A1208", marginBottom: 8, fontWeight: 600 }}>
                Facilitator name or code <span style={{ fontWeight: 400, color: "#92400E" }}>(optional)</span>
              </p>
              <input
                type="text"
                value={facilitatorRef}
                onChange={(e) => setFacilitatorRef(e.target.value)}
                placeholder="First name, initials, or a code word"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E5D9C8",
                  background: "#FFFDF7",
                  fontFamily: "Georgia, serif",
                  fontSize: 14,
                  color: "#1A1208",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#D97706"; }}
                onBlur={(e) => { e.target.style.borderColor = "#E5D9C8"; }}
              />
              <p style={{ fontSize: 12, color: "#92400E", marginTop: 6, fontFamily: "DM Mono, monospace" }}>
                This helps route your feedback. Your identity remains anonymous.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button style={styles.btnOutline} onClick={() => setStep("day")}>Back</button>
              <button style={styles.btn} onClick={() => setStep("survey")}>Continue →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Survey ──
  if (step === "survey") {
    const canSubmit = integrationScore !== null && safetyScore !== null && trustScore !== null && wouldRecommend !== null;

    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <p style={styles.headerEyebrow}>Day {dayChoice} · {INTERVENTION_TYPES.find(t => t.value === interventionType)?.label}</p>
          <h1 style={styles.headerTitle}>Your Honest Assessment</h1>
          <p style={styles.headerSub}>
            No one can see your name. No one can see your email. This is between you and the work.
          </p>
        </div>
        <div style={styles.container}>
          <div style={styles.card}>
            <p style={styles.sectionTitle}>Scores — Day {dayChoice}</p>
            <ScaleSelector
              label="How well are you integrating the experience? (1 = struggling, 10 = deeply integrated)"
              value={integrationScore}
              onChange={setIntegrationScore}
              color="#059669"
            />
            <ScaleSelector
              label="How safe did you feel throughout the experience? (1 = unsafe, 10 = completely held)"
              value={safetyScore}
              onChange={setSafetyScore}
              color="#2563EB"
            />
            <ScaleSelector
              label="How much did you trust your facilitator? (1 = not at all, 10 = completely)"
              value={trustScore}
              onChange={setTrustScore}
              color="#D97706"
            />
          </div>

          <div style={styles.card}>
            <p style={styles.sectionTitle}>Recommendation</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#1A1208", marginBottom: 12, fontWeight: 600 }}>
              Would you recommend this facilitator to someone you love?
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              {(["yes", "no", "unsure"] as RecommendChoice[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setWouldRecommend(opt)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: wouldRecommend === opt ? "2px solid #D97706" : "1.5px solid #E5D9C8",
                    background: wouldRecommend === opt ? "#FEF3C7" : "#FFFDF7",
                    cursor: "pointer",
                    fontFamily: "DM Mono, monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    color: wouldRecommend === opt ? "#B45309" : "#78350F",
                    textTransform: "capitalize",
                  }}
                >
                  {opt === "yes" ? "Yes" : opt === "no" ? "No" : "Not sure"}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <p style={styles.sectionTitle}>In your own words</p>
            <TextArea
              label="What went well?"
              placeholder="What felt right, held, or transformative..."
              value={wentWell}
              onChange={setWentWell}
            />
            <TextArea
              label="What could have been better?"
              placeholder="What felt off, rushed, or unresolved..."
              value={couldImprove}
              onChange={setCouldImprove}
            />
            <TextArea
              label="A message to your facilitator (anonymous)"
              placeholder="Something you want them to know but couldn't say in the room..."
              value={messageToFacilitator}
              onChange={setMessageToFacilitator}
              rows={5}
            />
          </div>

          {!canSubmit && (
            <p style={{ fontSize: 13, color: "#92400E", fontFamily: "DM Mono, monospace", marginBottom: 16, textAlign: "center" }}>
              Please rate integration, safety, trust, and recommendation to continue.
            </p>
          )}

          {submitMutation.error && (
            <p style={{ fontSize: 13, color: "#DC2626", fontFamily: "DM Mono, monospace", marginBottom: 16, textAlign: "center" }}>
              Something went wrong. Please try again.
            </p>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button style={styles.btnOutline} onClick={() => setStep("type")}>Back</button>
            <button
              style={{ ...styles.btn, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}
              disabled={!canSubmit || submitMutation.isPending}
              onClick={() => {
                if (!canSubmit || !dayChoice) return;
                submitMutation.mutate({
                  dayChoice,
                  interventionType,
                  facilitatorRef: facilitatorRef || undefined,
                  integrationScore: integrationScore ?? undefined,
                  safetyScore: safetyScore ?? undefined,
                  trustScore: trustScore ?? undefined,
                  wouldRecommend: wouldRecommend ?? undefined,
                  wentWell: wentWell || undefined,
                  couldImprove: couldImprove || undefined,
                  messageToFacilitator: messageToFacilitator || undefined,
                });
              }}
            >
              {submitMutation.isPending ? "Sending..." : "Submit Anonymously →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Done ──
  return (
    <div style={styles.page}>
      <div style={{ ...styles.header, background: "linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)" }}>
        <p style={{ ...styles.headerEyebrow, color: "#A7F3D0" }}>Assessment Complete</p>
        <h1 style={styles.headerTitle}>Thank You for Your Honesty</h1>
        <p style={styles.headerSub}>
          Your response has been received anonymously. It goes directly to the facilitator network.
          This is how we make the next experience better.
        </p>
      </div>
      <div style={styles.container}>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#1A1208", marginBottom: 12, lineHeight: 1.7 }}>
            Day {dayChoice} complete.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#78350F", lineHeight: 1.8, marginBottom: 24 }}>
            Integration is not a destination. It is a practice.
            Come back at Day {dayChoice === 1 ? 3 : dayChoice === 3 ? 7 : 30} if you want to track how things continue to shift.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={styles.btnOutline} onClick={() => {
              setStep("day");
              setDayChoice(null);
              setIntegrationScore(null);
              setSafetyScore(null);
              setTrustScore(null);
              setWouldRecommend(null);
              setWentWell("");
              setCouldImprove("");
              setMessageToFacilitator("");
            }}>
              Take Another Assessment
            </button>
            <a href="/" style={{ ...styles.btn, textDecoration: "none" }}>Return Home</a>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#92400E", textAlign: "center", fontFamily: "DM Mono, monospace", letterSpacing: "0.05em", marginTop: 24 }}>
          © 2026 Tony Greenberg · Only Time Buys Trust · onlytimebuystrust.com
        </p>
      </div>
    </div>
  );
}
