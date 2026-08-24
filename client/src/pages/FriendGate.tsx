/**
 * /friend-gate
 *
 * The Three Friends Permission Gate — seeker-facing flow.
 * Seeker nominates 3 friends → waits for responses → sees anonymized results.
 *
 * Also exported as <FriendGateEmbed> for use inside the PRI flow.
 */

import { useState, useEffect } from "react";
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
    padding: "2rem 1rem 4rem",
  },
  logo: {
    fontSize: "11px",
    letterSpacing: ".18em",
    textTransform: "uppercase" as const,
    color: "#B45309",
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "16px",
    boxShadow: "0 4px 32px rgba(180,83,9,.12)",
    border: "1px solid rgba(217,119,6,.2)",
    padding: "2.5rem 2rem",
    maxWidth: "580px",
    width: "100%",
  },
  h1: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: 700,
    color: "#1A1208",
    marginBottom: ".5rem",
    lineHeight: 1.25,
  },
  sub: {
    fontSize: "15px",
    color: "#78350F",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#92400E",
    marginBottom: ".35rem",
    letterSpacing: ".05em",
    textTransform: "uppercase" as const,
  },
  input: {
    width: "100%",
    padding: ".65rem .9rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(217,119,6,.3)",
    background: "#FFFBF0",
    fontSize: "14px",
    color: "#1A1208",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: ".5rem",
  },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed" },
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
  friendSlot: {
    background: "linear-gradient(135deg, #FFFBF0 0%, #FEF3C7 100%)",
    border: "1px solid rgba(217,119,6,.2)",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1rem",
  },
  slotTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#B45309",
    letterSpacing: ".1em",
    textTransform: "uppercase" as const,
    marginBottom: ".75rem",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: ".5rem",
    marginBottom: ".5rem",
  },
  typeToggle: (active: boolean) => ({
    padding: ".5rem",
    borderRadius: "6px",
    border: active ? "2px solid #D97706" : "1.5px solid rgba(217,119,6,.25)",
    background: active ? "#FDE68A" : "#FFFBF0",
    color: "#1A1208",
    fontSize: "13px",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    textAlign: "center" as const,
    fontFamily: "inherit",
  }),
  waitSlot: (responded: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: ".75rem",
    padding: ".85rem 1rem",
    borderRadius: "10px",
    background: responded ? "#D1FAE5" : "#FFFBF0",
    border: `1.5px solid ${responded ? "#6EE7B7" : "rgba(217,119,6,.2)"}`,
    marginBottom: ".5rem",
    transition: "all .4s",
  }),
  waitDot: (responded: boolean) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: responded ? "#10B981" : "#FDE68A",
    border: `2px solid ${responded ? "#059669" : "#D97706"}`,
    flexShrink: 0,
    transition: "all .4s",
  }),
  resultBand: (verdict: "support" | "wait" | "unsure" | "mixed") => ({
    background: verdict === "support" ? "#D1FAE5" : verdict === "wait" ? "#FEF3C7" : "#F3F4F6",
    border: `1.5px solid ${verdict === "support" ? "#6EE7B7" : verdict === "wait" ? "#FCD34D" : "#D1D5DB"}`,
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  } as React.CSSProperties),
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface FriendSlot {
  name: string;
  contactType: "email" | "phone";
  contactValue: string;
}

interface Props {
  /** When used as embed inside PRI, called when gate opens with support */
  onGateOpen?: () => void;
  /** When used as embed, called when gate blocks */
  onGateBlocked?: () => void;
  /** Seeker name pre-filled from PRI */
  seekerName?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FriendGateEmbed({ onGateOpen, onGateBlocked, seekerName: prefilledName }: Props) {
  const [step, setStep] = useState<"intro" | "nominate" | "waiting" | "results">("intro");
  const [seekerName, setSeekerName] = useState(prefilledName ?? "");
  const [friends, setFriends] = useState<FriendSlot[]>([
    { name: "", contactType: "email", contactValue: "" },
    { name: "", contactType: "email", contactValue: "" },
    { name: "", contactType: "email", contactValue: "" },
  ]);
  const [seekerToken, setSeekerToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createSession = trpc.friendGate.createSession.useMutation();

  const statusQuery = trpc.friendGate.getStatus.useQuery(
    { seekerToken },
    {
      enabled: step === "waiting" && seekerToken.length === 64,
      refetchInterval: 8000, // poll every 8 seconds
      retry: false,
    }
  );

  const resultsQuery = trpc.friendGate.getResults.useQuery(
    { seekerToken },
    {
      enabled: step === "results" && seekerToken.length === 64,
      retry: false,
    }
  );

  // Auto-advance from waiting to results when gate opens
  useEffect(() => {
    const status = statusQuery.data?.status;
    if (status === "open" || status === "blocked") {
      setStep("results");
      if (status === "open") onGateOpen?.();
      if (status === "blocked") onGateBlocked?.();
    }
  }, [statusQuery.data?.status]);

  const updateFriend = (i: number, field: keyof FriendSlot, value: string) => {
    setFriends(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  };

  const handleNominate = async () => {
    setError("");
    if (!seekerName.trim()) { setError("Please enter your first name."); return; }
    for (let i = 0; i < 3; i++) {
      const f = friends[i];
      if (!f.name.trim()) { setError(`Please enter a name for Friend ${i + 1}.`); return; }
      if (!f.contactValue.trim()) { setError(`Please enter contact info for ${f.name}.`); return; }
    }
    setLoading(true);
    try {
      const result = await createSession.mutateAsync({
        seekerName: seekerName.trim(),
        friends: friends.map(f => ({
          name: f.name.trim(),
          contactType: f.contactType,
          contactValue: f.contactValue.trim(),
        })),
      });
      setSeekerToken(result.seekerToken);
      // Persist token in localStorage so they can return
      localStorage.setItem("friendGateToken", result.seekerToken);
      setStep("waiting");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── INTRO ──
  if (step === "intro") {
    return (
      <div style={S.card}>
        <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>🌿</div>
        <h1 style={S.h1}>Before you see your results.</h1>
        <p style={S.sub}>
          What you're considering — any intervention that reshapes how your nervous system moves through the world — is not a solo decision. You are not just you. You are an organism embedded in relationships. Those relationships deserve a vote.
        </p>
        <p style={{ ...S.sub, fontSize: "14px" }}>
          Three people who know you well will each receive a short, anonymous survey. When all three respond, your results unlock. If someone who loves you asks you to wait — that's not a door closing. That's time being on your side.
        </p>
        <blockquote style={{ borderLeft: "3px solid #D97706", paddingLeft: "1rem", margin: "1.5rem 0", fontStyle: "italic", color: "#78350F", fontSize: "14px", lineHeight: 1.6 }}>
          "Better safe than sorry is a start. Better safest than safe is wisdom. Better nothing than disaster is love."
        </blockquote>
        <button style={S.btn} onClick={() => setStep("nominate")}>
          Nominate my three friends →
        </button>
      </div>
    );
  }

  // ── NOMINATE ──
  if (step === "nominate") {
    return (
      <div style={S.card}>
        <h1 style={S.h1}>Who are your three?</h1>
        <p style={S.sub}>
          Choose people who know you well and will be honest. Not cheerleaders — witnesses.
        </p>

        {!prefilledName && (
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={S.label}>Your first name</label>
            <input
              style={S.input}
              type="text"
              placeholder="Your name"
              value={seekerName}
              onChange={e => setSeekerName(e.target.value)}
            />
          </div>
        )}

        {friends.map((friend, i) => (
          <div key={i} style={S.friendSlot}>
            <div style={S.slotTitle}>Friend {i + 1}</div>
            <div style={S.row}>
              <div>
                <label style={S.label}>Name</label>
                <input
                  style={S.input}
                  type="text"
                  placeholder="Their name"
                  value={friend.name}
                  onChange={e => updateFriend(i, "name", e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>Contact via</label>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <button style={S.typeToggle(friend.contactType === "email")} onClick={() => updateFriend(i, "contactType", "email")}>Email</button>
                  <button style={S.typeToggle(friend.contactType === "phone")} onClick={() => updateFriend(i, "contactType", "phone")}>Phone</button>
                </div>
              </div>
            </div>
            <label style={S.label}>{friend.contactType === "email" ? "Email address" : "Mobile number"}</label>
            <input
              style={S.input}
              type={friend.contactType === "email" ? "email" : "tel"}
              placeholder={friend.contactType === "email" ? "friend@example.com" : "+1 555 000 0000"}
              value={friend.contactValue}
              onChange={e => updateFriend(i, "contactValue", e.target.value)}
            />
          </div>
        ))}

        {error && <div style={S.error}>{error}</div>}

        <button
          style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
          onClick={handleNominate}
          disabled={loading}
        >
          {loading ? "Sending invitations…" : "Send invitations to all three →"}
        </button>

        <p style={{ fontSize: "12px", color: "rgba(26,18,8,.4)", textAlign: "center", marginTop: "1rem", lineHeight: 1.5 }}>
          Each friend receives a unique, one-time link. They verify their identity with a code before responding. Their answers are anonymous — you'll see a summary, not their names or specific responses.
        </p>
      </div>
    );
  }

  // ── WAITING ──
  if (step === "waiting") {
    const status = statusQuery.data;
    const respondedCount = status?.respondedCount ?? 0;
    const slots = status?.slots ?? [
      { index: 0, friendName: friends[0].name, responded: false },
      { index: 1, friendName: friends[1].name, responded: false },
      { index: 2, friendName: friends[2].name, responded: false },
    ];

    return (
      <div style={S.card}>
        <div style={{ fontSize: "2rem", textAlign: "center", marginBottom: "1rem" }}>⏳</div>
        <h1 style={S.h1}>Waiting for your three.</h1>
        <p style={S.sub}>
          Invitations have been sent. Your results unlock when all three respond — or after 72 hours, whichever comes first.
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          {slots.map((slot, i) => (
            <div key={i} style={S.waitSlot(slot.responded)}>
              <div style={S.waitDot(slot.responded)} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#1A1208" }}>
                  {slot.friendName ?? `Friend ${i + 1}`}
                </div>
                <div style={{ fontSize: "12px", color: slot.responded ? "#059669" : "#92400E" }}>
                  {slot.responded ? "Responded ✓" : "Invitation sent — awaiting response"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFFBF0", border: "1px solid rgba(217,119,6,.2)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#D97706" }}>{respondedCount} / 3</div>
          <div style={{ fontSize: "13px", color: "#92400E" }}>friends have responded</div>
        </div>

        <p style={{ fontSize: "13px", color: "rgba(26,18,8,.45)", textAlign: "center", marginTop: "1.25rem", lineHeight: 1.5 }}>
          This page checks for updates automatically. You can also bookmark it and return later.
        </p>
      </div>
    );
  }

  // ── RESULTS ──
  if (step === "results") {
    const results = resultsQuery.data;
    if (!results) {
      return (
        <div style={S.card}>
          <div style={{ textAlign: "center", color: "#92400E", padding: "2rem" }}>Loading your results…</div>
        </div>
      );
    }

    const { supportCount, waitCount, unsureCount, respondedCount, messages, status } = results;
    const isBlocked = status === "blocked";
    const isOpen = status === "open";

    return (
      <div style={S.card}>
        <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>
          {isBlocked ? "🌱" : "🌟"}
        </div>
        <h1 style={{ ...S.h1, textAlign: "center" }}>
          {isBlocked ? "Your people asked you to wait." : `${supportCount} of ${respondedCount} support you moving forward.`}
        </h1>

        <div style={S.resultBand((isBlocked ? "wait" : supportCount >= 2 ? "support" : "wait") as "support" | "wait" | "unsure" | "mixed")}>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#059669" }}>{supportCount}</div>
              <div style={{ fontSize: "12px", color: "#065F46" }}>Support you</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#D97706" }}>{waitCount}</div>
              <div style={{ fontSize: "12px", color: "#92400E" }}>Asked you to wait</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#6B7280" }}>{unsureCount}</div>
              <div style={{ fontSize: "12px", color: "#374151" }}>Were unsure</div>
            </div>
          </div>
        </div>

        {isBlocked && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "15px", color: "#78350F", lineHeight: 1.7, margin: 0 }}>
              Two or more of the people who know you best asked you to take more time. That's not a rejection. That's love with a longer view. Study more. Debrief. Optimize your biochemistry. Come back when you're ready — and they'll know when you are.
            </p>
          </div>
        )}

        {isOpen && supportCount >= 2 && (
          <div style={{ background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "15px", color: "#065F46", lineHeight: 1.7, margin: 0 }}>
              The people who know you have spoken. You have their support. Move forward with intention, with a facilitator you trust fully, and with the knowledge that your ecosystem is behind you.
            </p>
          </div>
        )}

        {messages.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#B45309", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".75rem" }}>
              What your friends wanted you to know
            </div>
            {messages.map((msg, i) => (
              <div key={i} style={{ background: "#FFFBF0", border: "1px solid rgba(217,119,6,.2)", borderRadius: "10px", padding: "1rem", marginBottom: ".5rem", fontSize: "14px", color: "#1A1208", lineHeight: 1.6, fontStyle: "italic" }}>
                "{msg}"
              </div>
            ))}
            <p style={{ fontSize: "12px", color: "rgba(26,18,8,.4)", marginTop: ".5rem" }}>
              These messages are anonymous. You will not know which friend wrote what.
            </p>
          </div>
        )}

        <p style={{ fontSize: "13px", color: "rgba(26,18,8,.4)", textAlign: "center", lineHeight: 1.5 }}>
          © 2026 Tony Greenberg · Only Time Buys Trust · onlytimebuystrust.com
        </p>
      </div>
    );
  }

  return null;
}

// ── Standalone page ───────────────────────────────────────────────────────────

export default function FriendGatePage() {
  return (
    <div style={S.page}>
      <div style={S.logo}>Only Time Buys Trust · onlytimebuystrust.com</div>
      <FriendGateEmbed />
    </div>
  );
}
