/*
 * THE GATE — Pre-qualification engagement audit.
 * 7 out of 10 don't qualify. Only qualified leads see the Calendly link.
 * Design: "The Folio" editorial style — dark hero, gold accents, serious tone.
 */

import { useState, useCallback } from "react";
import { Section, FadeIn, Eyebrow, Divider } from "@/components/Editorial";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/* ── Scoring thresholds ── */
const QUALIFIED_THRESHOLD = 65;
const NOT_READY_THRESHOLD = 35;

/* ── Question definitions ── */
const QUESTIONS = [
  {
    id: "impactInitiative",
    number: "01",
    label: "THE INITIATIVE",
    question: "What is the specific impact initiative you're building?",
    subtext: "Not 'making a difference.' Not 'exploring options.' What is the concrete thing you are creating, launching, or scaling? Be specific — sector, mechanism, target population.",
    placeholder: "Describe the specific initiative, its mechanism, and who it serves...",
    scoringHint: "Specificity, clarity, and actionability",
  },
  {
    id: "impactOutcomes",
    number: "02",
    label: "THE OUTCOMES",
    question: "What are the intended impact outcomes — and how will you measure them?",
    subtext: "If you can't articulate what success looks like in measurable terms, you're not ready for this conversation. What changes? For whom? By when? How do you know?",
    placeholder: "Define success metrics, timeline, and who benefits...",
    scoringHint: "Measurability, timeline, and beneficiary clarity",
  },
  {
    id: "whyTony",
    number: "03",
    label: "THE FIT",
    question: "Why Tony Greenberg, RampRate, or ImpactSoul — specifically?",
    subtext: "You've read the essays. You've seen the ecosystem. What specifically about this body of work makes you believe this is the right partnership? Generic flattery doesn't count.",
    placeholder: "Reference specific work, frameworks, or capabilities that align with your needs...",
    scoringHint: "Specificity of reference, alignment with actual capabilities",
  },
  {
    id: "priorAction",
    number: "04",
    label: "THE PROOF",
    question: "What have you already done — with your own hands and resources?",
    subtext: "Ideas are free. Execution costs everything. What have you built, tested, failed at, or shipped before asking for someone else's time? Dreamers need not apply.",
    placeholder: "Describe concrete actions taken, resources deployed, lessons learned...",
    scoringHint: "Evidence of action, not just intention",
  },
  {
    id: "resourcesCommitted",
    number: "05",
    label: "THE COMMITMENT",
    question: "What resources are committed — budget, team, timeline?",
    subtext: "Engagement is bespoke — structured around your situation, not a menu. What budget is allocated? Who's on the team? What's the timeline? Serious inquiries only.",
    placeholder: "Budget range, team composition, and timeline for execution...",
    scoringHint: "Concrete resource commitment, not aspirational",
  },
] as const;

/* ── Scoring logic ── */
function scoreAnswer(answer: string): number {
  const trimmed = answer.trim();
  if (trimmed.length === 0) return 0;
  
  const wordCount = trimmed.split(/\s+/).length;
  const hasSpecifics = /\d|%|\$|timeline|budget|team|measure|metric|quarter|month|year/i.test(trimmed);
  const hasConcreteAction = /built|launched|tested|shipped|deployed|created|established|funded|raised|hired/i.test(trimmed);
  const isGeneric = /make a difference|explore|interested in|passionate about|love your work|big fan/i.test(trimmed);
  
  let score = 0;
  
  // Length/depth scoring (0-8)
  if (wordCount >= 80) score += 8;
  else if (wordCount >= 50) score += 6;
  else if (wordCount >= 30) score += 4;
  else if (wordCount >= 15) score += 2;
  else score += 1;
  
  // Specificity bonus (0-6)
  if (hasSpecifics) score += 4;
  if (hasConcreteAction) score += 2;
  
  // Generic penalty
  if (isGeneric) score -= 3;
  
  // Thoughtfulness bonus — sentences, punctuation, structure
  const sentenceCount = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 5).length;
  if (sentenceCount >= 4) score += 4;
  else if (sentenceCount >= 2) score += 2;
  
  return Math.max(0, Math.min(20, score));
}

function calculateOutcome(totalScore: number): "qualified" | "not-ready" | "wrong-fit" {
  if (totalScore >= QUALIFIED_THRESHOLD) return "qualified";
  if (totalScore >= NOT_READY_THRESHOLD) return "not-ready";
  return "wrong-fit";
}

/* ── Component ── */
export default function Engage() {
  const [step, setStep] = useState<"intro" | "audit" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<"qualified" | "not-ready" | "wrong-fit" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submitAudit = trpc.engage.submit.useMutation();

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      // Score each answer
      const scores = QUESTIONS.map(q => scoreAnswer(answers[q.id] || ""));
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const result = calculateOutcome(totalScore);
      
      await submitAudit.mutateAsync({
        name,
        email,
        organization: organization || undefined,
        impactInitiative: answers.impactInitiative || "",
        impactOutcomes: answers.impactOutcomes || "",
        whyTony: answers.whyTony || "",
        priorAction: answers.priorAction || "",
        resourcesCommitted: answers.resourcesCommitted || "",
        totalScore,
        outcome: result,
      });
      
      setOutcome(result);
      setStep("result");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, name, email, organization, submitAudit]);

  const currentAnswer = answers[QUESTIONS[currentQ]?.id] || "";
  const allAnswered = QUESTIONS.every(q => (answers[q.id] || "").trim().length > 0);

  return (
    <div>
      <SEO
        title="The Gate — Engagement Audit"
        description="Seven out of ten inquiries don't qualify. Before you book a meeting with Tony Greenberg, prove you're ready."
        path="/engage"
        indexable={true}
      />

      {/* ── HERO ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A0A10 0%, #111118 60%, #1a1a24 100%)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          borderBottom: "1px solid rgba(212,185,106,0.15)",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "1.2rem",
            }}
          >
            THE GATE
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#F5F0E0",
              lineHeight: 1.2,
              marginBottom: "1rem",
              maxWidth: "700px",
              margin: "0 auto 1rem",
            }}
          >
            Not everyone gets a meeting.
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.1rem",
              color: "rgba(245,240,224,0.65)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Seven out of ten inquiries don't qualify. This isn't gatekeeping — it's respect for your time and mine. If your initiative is real, your outcomes are clear, and you've already started — we should talk.
          </p>
        </FadeIn>
      </div>

      {/* ── INTRO SCREEN ── */}
      {step === "intro" && (
        <Section>
          <FadeIn>
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              <Eyebrow>Before You Book</Eyebrow>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "1rem",
                }}
              >
                The Engagement Audit
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#333", marginBottom: "1.5rem" }}>
                Five questions. No right answers — but there are wrong ones. Vague aspirations, generic flattery, and "exploring options" won't get you through. What will: specificity, evidence of action, and clarity about what you're building and why it matters.
              </p>

              <div
                style={{
                  background: "rgba(212,185,106,0.06)",
                  borderLeft: "3px solid #8B6914",
                  padding: "1.2rem 1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#8B6914", marginBottom: "0.5rem", textTransform: "uppercase" as const }}>
                  THE PROCESS
                </div>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#444" }}>
                  <strong>Pass the audit</strong> → Calendly link unlocks → Book a strategy session (engagement terms discussed directly) → Send preparation doc to tony@impactsoul.is 48hrs before → Session recorded via Fireflies → <strong>30-day review gate</strong> → Demonstrate action → Stage 2 unlocks.
                </div>
              </div>

              <div
                style={{
                  background: "#0A0A10",
                  borderRadius: "6px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em", color: "#D4B96A", marginBottom: "1rem", textTransform: "uppercase" as const }}>
                  YOUR INFORMATION
                </div>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "rgba(245,240,224,0.5)", letterSpacing: "0.08em", display: "block", marginBottom: "0.3rem" }}>
                      NAME *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full name"
                      style={{
                        width: "100%",
                        padding: "0.7rem 1rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,185,106,0.2)",
                        borderRadius: "4px",
                        color: "#F5F0E0",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "rgba(245,240,224,0.5)", letterSpacing: "0.08em", display: "block", marginBottom: "0.3rem" }}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        width: "100%",
                        padding: "0.7rem 1rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,185,106,0.2)",
                        borderRadius: "4px",
                        color: "#F5F0E0",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "rgba(245,240,224,0.5)", letterSpacing: "0.08em", display: "block", marginBottom: "0.3rem" }}>
                      ORGANIZATION
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      placeholder="Company or initiative name (optional)"
                      style={{
                        width: "100%",
                        padding: "0.7rem 1rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,185,106,0.2)",
                        borderRadius: "4px",
                        color: "#F5F0E0",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!name.trim() || !email.trim()) {
                    toast.error("Name and email are required.");
                    return;
                  }
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    toast.error("Please enter a valid email address.");
                    return;
                  }
                  setStep("audit");
                }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "#F5F0E0",
                  background: "#0A0A10",
                  padding: "0.9rem 2.5rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  borderRadius: "3px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "block",
                  margin: "0 auto",
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#D4B96A"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "rgba(212,185,106,0.3)"; }}
              >
                BEGIN THE AUDIT →
              </button>
            </div>
          </FadeIn>
        </Section>
      )}

      {/* ── AUDIT QUESTIONS ── */}
      {step === "audit" && (
        <Section>
          <FadeIn key={currentQ}>
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              {/* Progress */}
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem" }}>
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "3px",
                      background: i <= currentQ ? "#D4B96A" : "rgba(0,0,0,0.08)",
                      borderRadius: "2px",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>

              {/* Question */}
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  color: "#D4B96A",
                  marginBottom: "0.5rem",
                }}
              >
                {QUESTIONS[currentQ].number} — {QUESTIONS[currentQ].label}
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "0.8rem",
                  lineHeight: 1.3,
                }}
              >
                {QUESTIONS[currentQ].question}
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "#666",
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                {QUESTIONS[currentQ].subtext}
              </p>

              <textarea
                value={currentAnswer}
                onChange={e => setAnswers(prev => ({ ...prev, [QUESTIONS[currentQ].id]: e.target.value }))}
                placeholder={QUESTIONS[currentQ].placeholder}
                rows={6}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "#FAFAF7",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "#222",
                  resize: "vertical",
                  outline: "none",
                  marginBottom: "0.5rem",
                }}
              />
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  color: "#999",
                  letterSpacing: "0.05em",
                  marginBottom: "1.5rem",
                  textAlign: "right",
                }}
              >
                {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    color: currentQ > 0 ? "#8B6914" : "#ccc",
                    background: "none",
                    border: "none",
                    cursor: currentQ > 0 ? "pointer" : "default",
                    padding: "0.5rem 0",
                  }}
                >
                  ← PREVIOUS
                </button>

                {currentQ < QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => {
                      if (!currentAnswer.trim()) {
                        toast.error("Please answer this question before continuing.");
                        return;
                      }
                      setCurrentQ(currentQ + 1);
                    }}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.82rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "#F5F0E0",
                      background: "#0A0A10",
                      padding: "0.7rem 2rem",
                      border: "1px solid rgba(212,185,106,0.3)",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    NEXT →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitting}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.82rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: allAnswered ? "#0A0A10" : "#999",
                      background: allAnswered ? "#D4B96A" : "rgba(0,0,0,0.05)",
                      padding: "0.7rem 2rem",
                      border: "none",
                      borderRadius: "3px",
                      cursor: allAnswered ? "pointer" : "default",
                      opacity: submitting ? 0.6 : 1,
                    }}
                  >
                    {submitting ? "EVALUATING..." : "SUBMIT AUDIT"}
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        </Section>
      )}

      {/* ── RESULTS ── */}
      {step === "result" && outcome === "qualified" && (
        <Section>
          <FadeIn>
            <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(212,185,106,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.8rem",
                }}
              >
                ✦
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "1rem",
                }}
              >
                You've passed The Gate.
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#444", marginBottom: "2rem" }}>
                Your initiative is specific, your outcomes are measurable, and you've already started. That puts you in the top 30%. Here's what happens next.
              </p>

              <Divider />

              <div style={{ textAlign: "left", marginTop: "1.5rem" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    color: "#D4B96A",
                    marginBottom: "1rem",
                    textTransform: "uppercase" as const,
                  }}
                >
                  YOUR NEXT STEPS
                </div>

                <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", color: "#D4B96A", fontWeight: 700, flexShrink: 0 }}>01</span>
                    <div>
                      <strong style={{ color: "#0A0A10" }}>Book the session</strong>
                      <p style={{ fontSize: "0.95rem", color: "#666", margin: "0.2rem 0 0" }}>Strategy session. Engagement terms are bespoke — discussed directly, not listed. Recorded via Fireflies.</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", color: "#D4B96A", fontWeight: 700, flexShrink: 0 }}>02</span>
                    <div>
                      <strong style={{ color: "#0A0A10" }}>Send your preparation document</strong>
                      <p style={{ fontSize: "0.95rem", color: "#666", margin: "0.2rem 0 0" }}>Email to <a href="mailto:tony@impactsoul.is" style={{ color: "#8B6914" }}>tony@impactsoul.is</a> — due 48 hours before session.</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", color: "#D4B96A", fontWeight: 700, flexShrink: 0 }}>03</span>
                    <div>
                      <strong style={{ color: "#0A0A10" }}>30-day review</strong>
                      <p style={{ fontSize: "0.95rem", color: "#666", margin: "0.2rem 0 0" }}>Demonstrate action. Show what you've done. Stage 2 unlocks only after proof of execution.</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://calendly.com/tonyg/10-minute-1-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.88rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "#0A0A10",
                    background: "#D4B96A",
                    padding: "1rem 2.5rem",
                    borderRadius: "3px",
                    textDecoration: "none",
                    marginBottom: "1rem",
                    transition: "all 0.2s",
                  }}
                >
                  BOOK YOUR SESSION →
                </a>
                <div style={{ textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#999", letterSpacing: "0.05em" }}>
                  All sessions scheduled via Calendly · Recorded via Fireflies
                </div>

                {/* 2x Money-Back Guarantee */}
                <div style={{
                  marginTop: "1.5rem",
                  padding: "1.2rem 1.5rem",
                  background: "rgba(212,185,106,0.06)",
                  border: "1px solid rgba(212,185,106,0.2)",
                  borderRadius: "6px",
                }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}>
                    THE 2× GUARANTEE
                  </div>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    color: "#555",
                    textAlign: "center",
                    margin: 0,
                  }}>
                    Do the work we specify. Document it. If after 30 days you can demonstrate full execution with zero results, we refund your fee — <strong style={{ color: "#333" }}>times two</strong>. That's how confident we are in what happens when the right people take the right action.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </Section>
      )}

      {step === "result" && outcome === "not-ready" && (
        <Section>
          <FadeIn>
            <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.8rem",
                }}
              >
                ◇
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "1rem",
                }}
              >
                Not yet. But close.
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#444", marginBottom: "1.5rem" }}>
                Your initiative has potential, but the specifics aren't clear enough yet. That's not a rejection — it's a redirect. Here's what to sharpen before you come back.
              </p>

              <div
                style={{
                  textAlign: "left",
                  background: "rgba(212,185,106,0.06)",
                  borderLeft: "3px solid #8B6914",
                  padding: "1.2rem 1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", color: "#8B6914", marginBottom: "0.8rem", textTransform: "uppercase" as const }}>
                  BEFORE YOU RETURN
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
                  <li style={{ fontSize: "0.95rem", color: "#444", paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#D4B96A" }}>›</span>
                    Define your impact outcomes in measurable terms — numbers, timelines, beneficiaries
                  </li>
                  <li style={{ fontSize: "0.95rem", color: "#444", paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#D4B96A" }}>›</span>
                    Take one concrete action — build a prototype, run a pilot, commit a budget
                  </li>
                  <li style={{ fontSize: "0.95rem", color: "#444", paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#D4B96A" }}>›</span>
                    Read the essays that align with your initiative — then reference them specifically
                  </li>
                </ul>
              </div>

              <a
                href="/blog"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(139,105,20,0.3)",
                  paddingBottom: "0.2rem",
                }}
              >
                READ THE ESSAYS →
              </a>
            </div>
          </FadeIn>
        </Section>
      )}

      {step === "result" && outcome === "wrong-fit" && (
        <Section>
          <FadeIn>
            <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.8rem",
                  color: "#999",
                }}
              >
                ○
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "1rem",
                }}
              >
                This isn't the right door.
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#444", marginBottom: "1.5rem" }}>
                Based on your responses, this doesn't look like the right fit — and that's okay. Not every partnership should happen. The best ones are mutual, specific, and urgent. If yours becomes that, come back.
              </p>

              <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "2rem" }}>
                In the meantime, the essays are free. The assessments are free. The frameworks are free. Take what's useful.
              </p>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="/blog"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "#F5F0E0",
                    background: "#0A0A10",
                    padding: "0.7rem 1.8rem",
                    textDecoration: "none",
                    borderRadius: "2px",
                  }}
                >
                  READ THE ESSAYS
                </a>
                <a
                  href="/assessments"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "#0A0A10",
                    border: "1px solid rgba(0,0,0,0.15)",
                    padding: "0.7rem 1.8rem",
                    textDecoration: "none",
                    borderRadius: "2px",
                  }}
                >
                  FIND YOUR FIT
                </a>
              </div>
            </div>
          </FadeIn>
        </Section>
      )}

      {/* ── ENTICE OPTION (always visible at bottom) ── */}
      {step === "result" && outcome !== "qualified" && (
        <Section>
          <FadeIn>
            <div
              style={{
                maxWidth: "680px",
                margin: "0 auto",
                padding: "1.5rem",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.92rem", color: "#888", fontStyle: "italic", marginBottom: "0.5rem" }}>
                Think we got it wrong? Have something that would change our mind?
              </p>
              <a
                href="mailto:tony@impactsoul.is?subject=Re: Engagement Audit — I'd like to make my case"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  color: "#8B6914",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(139,105,20,0.3)",
                }}
              >
                ENTICE ME →
              </a>
            </div>
          </FadeIn>
        </Section>
      )}
    </div>
  );
}
