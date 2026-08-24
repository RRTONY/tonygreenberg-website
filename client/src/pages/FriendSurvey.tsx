/**
 * /friend-survey/:token
 *
 * The page friends land on when they receive a Three Friends Gate invitation.
 * Flow: identity verification (contact + OTP) → 6-question survey → thank you
 */

import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #FEFCE8 0%, #FEF3C7 30%, #FDE68A 60%, #FEF9EE 100%)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "2rem 1rem 4rem",
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "16px",
    boxShadow: "0 4px 32px rgba(180,83,9,.12), 0 1px 4px rgba(180,83,9,.08)",
    border: "1px solid rgba(217,119,6,.2)",
    padding: "2.5rem 2rem",
    maxWidth: "560px",
    width: "100%",
    marginTop: "1.5rem",
  },
  logo: {
    fontSize: "11px",
    letterSpacing: ".18em",
    textTransform: "uppercase" as const,
    color: "#B45309",
    textAlign: "center" as const,
    marginBottom: "2rem",
    fontFamily: "'Georgia', serif",
  },
  h1: {
    fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
    fontWeight: 700,
    color: "#1A1208",
    marginBottom: ".5rem",
    lineHeight: 1.25,
  },
  sub: {
    fontSize: "15px",
    color: "#78350F",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#92400E",
    marginBottom: ".4rem",
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
  },
  input: {
    width: "100%",
    padding: ".7rem 1rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(217,119,6,.35)",
    background: "#FFFBF0",
    fontSize: "15px",
    color: "#1A1208",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: "1rem",
    fontFamily: "inherit",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: ".5rem",
    background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    color: "#1A1208",
    border: "none",
    borderRadius: "8px",
    padding: ".85rem 2rem",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
    letterSpacing: ".03em",
  },
  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  error: {
    background: "#FEF2F2",
    border: "1px solid #FCA5A5",
    borderRadius: "8px",
    padding: ".75rem 1rem",
    color: "#991B1B",
    fontSize: "14px",
    marginBottom: "1rem",
    lineHeight: 1.5,
  },
  progress: {
    display: "flex",
    gap: ".4rem",
    marginBottom: "1.5rem",
  },
  progressDot: (active: boolean, done: boolean) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: done ? "#D97706" : active ? "#F59E0B" : "rgba(217,119,6,.2)",
    transition: "all .3s",
  }),
  questionCard: {
    background: "linear-gradient(135deg, #FFFBF0 0%, #FEF3C7 100%)",
    border: "1px solid rgba(217,119,6,.2)",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  questionText: {
    fontSize: "17px",
    color: "#1A1208",
    fontWeight: 600,
    lineHeight: 1.5,
    marginBottom: ".5rem",
  },
  questionHint: {
    fontSize: "13px",
    color: "#92400E",
    fontStyle: "italic",
    marginBottom: "1rem",
    lineHeight: 1.5,
  },
  scaleRow: {
    display: "flex",
    gap: ".5rem",
    flexWrap: "wrap" as const,
  },
  scaleBtn: (selected: boolean) => ({
    flex: "1 1 auto",
    minWidth: "60px",
    padding: ".5rem .4rem",
    borderRadius: "8px",
    border: selected ? "2px solid #D97706" : "1.5px solid rgba(217,119,6,.25)",
    background: selected ? "#FDE68A" : "#FFFBF0",
    color: "#1A1208",
    fontSize: "12px",
    fontWeight: selected ? 700 : 400,
    cursor: "pointer",
    textAlign: "center" as const,
    transition: "all .2s",
    fontFamily: "inherit",
  }),
  verdictBtn: (selected: boolean, value: string) => ({
    display: "block",
    width: "100%",
    padding: ".85rem 1rem",
    borderRadius: "10px",
    border: selected ? "2px solid #D97706" : "1.5px solid rgba(217,119,6,.25)",
    background: selected
      ? value === "support" ? "#D1FAE5" : value === "wait" ? "#FEF3C7" : "#F3F4F6"
      : "#FFFBF0",
    color: "#1A1208",
    fontSize: "14px",
    fontWeight: selected ? 700 : 400,
    cursor: "pointer",
    textAlign: "left" as const,
    marginBottom: ".5rem",
    transition: "all .2s",
    fontFamily: "inherit",
  }),
  textarea: {
    width: "100%",
    padding: ".75rem 1rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(217,119,6,.3)",
    background: "#FFFBF0",
    fontSize: "14px",
    color: "#1A1208",
    resize: "vertical" as const,
    minHeight: "100px",
    fontFamily: "inherit",
    lineHeight: 1.6,
    boxSizing: "border-box" as const,
  },
  thankYou: {
    textAlign: "center" as const,
    padding: "1rem 0",
  },
  bigEmoji: {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

type Step = "identity" | "otp" | "survey" | "done";

export default function FriendSurvey() {
  const params = useParams<{ token: string }>();
  const token = params.token ?? "";

  const [step, setStep] = useState<Step>("identity");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const [contactValue, setContactValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [verdict, setVerdict] = useState<"support" | "wait" | "unsure" | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const slotInfoQuery = trpc.friendGate.getSlotInfo.useQuery(
    { surveyToken: token },
    { enabled: token.length === 64, retry: false }
  );

  const questionsQuery = trpc.friendGate.getSurveyQuestions.useQuery(undefined, {
    enabled: step === "survey",
  });

  const requestOtp = trpc.friendGate.requestOtp.useMutation();
  const verifyOtp = trpc.friendGate.verifyOtp.useMutation();
  const submitSurvey = trpc.friendGate.submitSurvey.useMutation();

  const slotInfo = slotInfoQuery.data;
  const questions = questionsQuery.data ?? [];

  // ── Already responded ──
  if (slotInfo?.alreadyResponded && step !== "done") {
    return (
      <div style={S.page}>
        <div style={S.logo}>Only Time Buys Trust</div>
        <div style={S.card}>
          <div style={S.thankYou}>
            <span style={S.bigEmoji}>✓</span>
            <h1 style={{ ...S.h1, textAlign: "center" }}>Already submitted</h1>
            <p style={{ ...S.sub, textAlign: "center" }}>
              You've already completed this survey. Your response has been recorded.
              Thank you for showing up for {slotInfo.seekerName}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Invalid token ──
  if (slotInfoQuery.isError && !slotInfoQuery.isLoading) {
    return (
      <div style={S.page}>
        <div style={S.logo}>Only Time Buys Trust</div>
        <div style={S.card}>
          <div style={S.error}>
            This survey link is invalid or has expired. Please check the email or message you received and try again.
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Identity verification ──
  const handleRequestOtp = async () => {
    setError("");
    if (!contactValue.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }
    setLoading(true);
    try {
      await requestOtp.mutateAsync({ surveyToken: token, contactValue: contactValue.trim(), contactType });
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step: OTP verification ──
  const handleVerifyOtp = async () => {
    setError("");
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp.mutateAsync({ surveyToken: token, otp: otpValue });
      setStep("survey");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Incorrect code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step: Survey submission ──
  const handleSubmitSurvey = async () => {
    setError("");
    if (!verdict) {
      setError("Please answer question 5 — your overall verdict.");
      return;
    }
    // Check all scale questions answered
    const scaleQs = questions.filter(q => q.type === "scale");
    for (const q of scaleQs) {
      if (responses[q.id] === undefined) {
        setError(`Please answer all questions before submitting.`);
        return;
      }
    }
    setLoading(true);
    try {
      await submitSurvey.mutateAsync({
        surveyToken: token,
        responses,
        verdict: verdict as "support" | "wait" | "unsure",
      });
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const seekerName = slotInfo?.seekerName ?? "Someone you know";
  const friendName = slotInfo?.friendName ?? "Friend";

  return (
    <div style={S.page}>
      <div style={S.logo}>Only Time Buys Trust · onlytimebuystrust.com</div>

      <div style={S.card}>

        {/* ── DONE ── */}
        {step === "done" && (
          <div style={S.thankYou}>
            <span style={S.bigEmoji}>🙏</span>
            <h1 style={{ ...S.h1, textAlign: "center" }}>Thank you, {friendName}.</h1>
            <p style={{ ...S.sub, textAlign: "center" }}>
              Your response has been recorded anonymously. {seekerName} will see a summary — not your name, not your specific answers.
            </p>
            <p style={{ fontSize: "14px", color: "#92400E", textAlign: "center", lineHeight: 1.6, fontStyle: "italic" }}>
              "You are not just you. You are an organism embedded in relationships. Those relationships deserve a vote."
            </p>
            <p style={{ fontSize: "13px", color: "rgba(26,18,8,.45)", textAlign: "center", marginTop: "1.5rem" }}>
              © 2026 Tony Greenberg · Only Time Buys Trust
            </p>
          </div>
        )}

        {/* ── IDENTITY ── */}
        {step === "identity" && (
          <>
            <h1 style={S.h1}>Your honest voice matters.</h1>
            <p style={S.sub}>
              <strong>{seekerName}</strong> is considering a significant inner journey and has asked three people who know them well to weigh in. You are one of those three.
            </p>
            <p style={{ ...S.sub, fontSize: "14px" }}>
              This is a short, private survey — six questions, five minutes. Your response is anonymous. To begin, verify your identity with a one-time code.
            </p>

            <div style={{ marginBottom: ".75rem" }}>
              <div style={{ display: "flex", gap: ".5rem", marginBottom: ".75rem" }}>
                <button
                  style={{ ...S.scaleBtn(contactType === "email"), flex: 1 }}
                  onClick={() => setContactType("email")}
                >
                  Email
                </button>
                <button
                  style={{ ...S.scaleBtn(contactType === "phone"), flex: 1 }}
                  onClick={() => setContactType("phone")}
                >
                  Phone
                </button>
              </div>
              <label style={S.label}>
                {contactType === "email" ? "Your email address" : "Your mobile number"}
              </label>
              <input
                style={S.input}
                type={contactType === "email" ? "email" : "tel"}
                placeholder={contactType === "email" ? "you@example.com" : "+1 555 000 0000"}
                value={contactValue}
                onChange={e => setContactValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRequestOtp()}
              />
            </div>

            {error && <div style={S.error}>{error}</div>}

            <button
              style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
              onClick={handleRequestOtp}
              disabled={loading}
            >
              {loading ? "Sending code…" : "Send verification code →"}
            </button>

            <p style={{ fontSize: "12px", color: "rgba(26,18,8,.4)", textAlign: "center", marginTop: "1rem", lineHeight: 1.5 }}>
              Your contact information is used only to verify your identity. It is never shared with {seekerName} or anyone else.
            </p>
          </>
        )}

        {/* ── OTP ── */}
        {step === "otp" && (
          <>
            <h1 style={S.h1}>Check your {contactType === "email" ? "inbox" : "messages"}.</h1>
            <p style={S.sub}>
              We sent a 6-digit code to <strong>{contactValue}</strong>. Enter it below to unlock the survey.
            </p>

            <label style={S.label}>Verification code</label>
            <input
              style={{ ...S.input, fontSize: "24px", letterSpacing: ".3em", textAlign: "center" }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otpValue}
              onChange={e => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
            />

            {error && <div style={S.error}>{error}</div>}

            <button
              style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify & open survey →"}
            </button>

            <p style={{ fontSize: "13px", color: "rgba(26,18,8,.45)", textAlign: "center", marginTop: "1rem" }}>
              Code expires in 15 minutes.{" "}
              <button
                style={{ background: "none", border: "none", color: "#B45309", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
                onClick={() => { setStep("identity"); setOtpValue(""); setError(""); }}
              >
                Resend
              </button>
            </p>
          </>
        )}

        {/* ── SURVEY ── */}
        {step === "survey" && (
          <>
            <h1 style={S.h1}>A few honest questions.</h1>
            <p style={S.sub}>
              These are about <strong>{seekerName}</strong>. Answer from your gut. There are no wrong answers — only honest ones.
            </p>

            {/* Progress dots */}
            <div style={S.progress}>
              {questions.map((_, i) => (
                <div key={i} style={S.progressDot(
                  i === questions.findIndex(q => responses[q.id] === undefined && q.id !== "q6"),
                  responses[questions[i].id] !== undefined
                )} />
              ))}
            </div>

            {questions.map((q, qi) => (
              <div key={q.id} style={S.questionCard}>
                <div style={{ fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#B45309", marginBottom: ".4rem" }}>
                  Question {qi + 1} of {questions.length}
                </div>
                <div style={S.questionText}>{q.question}</div>
                <div style={S.questionHint}>{q.hint}</div>

                {q.type === "scale" && (
                  <div style={S.scaleRow}>
                    {q.labels!.map((label, li) => (
                      <button
                        key={li}
                        style={S.scaleBtn(responses[q.id] === li + 1)}
                        onClick={() => setResponses(r => ({ ...r, [q.id]: li + 1 }))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "verdict" && (
                  <div>
                    {q.options!.map(opt => (
                      <button
                        key={opt.value}
                        style={S.verdictBtn(verdict === opt.value, opt.value)}
                        onClick={() => {
                          setVerdict(opt.value as "support" | "wait" | "unsure");
                          setResponses(r => ({ ...r, [q.id]: opt.value }));
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "text" && (
                  <textarea
                    style={S.textarea}
                    placeholder="Optional — write anything you want them to know…"
                    value={(responses[q.id] as string) ?? ""}
                    onChange={e => setResponses(r => ({ ...r, [q.id]: e.target.value }))}
                  />
                )}
              </div>
            ))}

            {error && <div style={S.error}>{error}</div>}

            <button
              style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
              onClick={handleSubmitSurvey}
              disabled={loading}
            >
              {loading ? "Submitting…" : "Submit my response →"}
            </button>

            <p style={{ fontSize: "12px", color: "rgba(26,18,8,.4)", textAlign: "center", marginTop: "1rem", lineHeight: 1.5 }}>
              Your response is anonymous. {seekerName} will see a summary, not your name or specific answers. Your identity is verified and permanently recorded for accountability.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
