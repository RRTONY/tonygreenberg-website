/**
 * AssessmentResultActions — Shared component for all assessment result pages.
 *
 * Three actions:
 * 1. "Download PDF" — uses browser print-to-PDF on a styled result snapshot
 * 2. "Send to Tony" — saves to DB with sharedWithTony=true, triggers notifyOwner
 * 3. "Keep Private" — saves to DB with sharedWithTony=false (just for their records)
 *
 * Usage:
 *   <AssessmentResultActions
 *     assessmentType="dharma"
 *     sessionId={sessionId}
 *     answers={JSON.stringify(answers)}
 *     resultSummary={JSON.stringify(result)}
 *     totalScore={score}
 *     resultTitle="Your Dharma Profile"
 *     resultContent={<div>...rendered result...</div>}
 *   />
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Download, Send, Lock, Check, Loader2 } from "lucide-react";

type AssessmentType =
  | "dharma" | "consciousness" | "grant-study" | "mirror" | "find-your-me"
  | "therapy" | "sake" | "spirit" | "religion"
  | "diet" | "movement" | "sleep" | "coffee" | "kitchen" | "style"
  | "attachment" | "love-language" | "psychedelic-readiness"
  | "peptide" | "sexuality" | "soulscore" | "self-portrait" | "kava" | "brewsoul-quiz";

interface AssessmentResultActionsProps {
  assessmentType: AssessmentType;
  sessionId: string;
  answers: string;
  resultSummary: string;
  totalScore: number | null;
  /** The element ref or ID to capture for PDF */
  printTargetRef?: React.RefObject<HTMLElement | null>;
  /** Accent color for buttons */
  accentColor?: string;
  /** Background color for the section */
  bgColor?: string;
  /** Text color */
  textColor?: string;
  /** Called after successful save */
  onSaved?: (shared: boolean) => void;
}

export function AssessmentResultActions({
  assessmentType,
  sessionId,
  answers,
  resultSummary,
  totalScore,
  printTargetRef,
  accentColor = "#8B6914",
  bgColor = "transparent",
  textColor = "rgba(232,228,220,0.9)",
  onSaved,
}: AssessmentResultActionsProps) {
  const [shareState, setShareState] = useState<"idle" | "form" | "saving" | "saved" | "private-saved">("idle");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const submitMutation = trpc.assessments.submit.useMutation();

  const handleDownloadPDF = useCallback(() => {
    // Use browser print with a clean stylesheet
    const target = printTargetRef?.current;
    if (!target) {
      // Fallback: print the whole page
      window.print();
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    const html = target.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Assessment Results</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Source Sans 3', sans-serif;
            color: #1a1a1a;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
          }
          h1, h2, h3 { font-family: 'Playfair Display', serif; color: #0A0A10; }
          h1 { font-size: 1.8rem; margin-bottom: 1rem; }
          h2 { font-size: 1.4rem; margin-bottom: 0.75rem; }
          h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
          p { line-height: 1.6; margin-bottom: 0.75rem; }
          .print-footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #ddd;
            font-size: 0.8rem;
            color: #888;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 1.5cm; }
          }
        </style>
      </head>
      <body>
        ${html}
        <div class="print-footer">
          tonygreenberg.manus.space &middot; ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [printTargetRef]);

  const handleSave = useCallback(async (shared: boolean) => {
    setShareState("saving");
    try {
      await submitMutation.mutateAsync({
        assessmentType,
        sessionId,
        answers,
        resultSummary,
        totalScore,
        sharedWithTony: shared,
        userName: shared ? userName || undefined : undefined,
        userEmail: shared ? userEmail || undefined : undefined,
      });
      setShareState(shared ? "saved" : "private-saved");
      onSaved?.(shared);
    } catch (err) {
      console.error("Failed to save assessment:", err);
      setShareState("idle");
    }
  }, [assessmentType, sessionId, answers, resultSummary, totalScore, userName, userEmail, submitMutation, onSaved]);

  if (shareState === "saved") {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem", background: bgColor }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: accentColor, fontSize: "1.1rem", fontFamily: "'Playfair Display', serif" }}>
          <Check size={20} />
          Sent to Tony — he'll see your results.
        </div>
        <p style={{ color: textColor, opacity: 0.6, fontSize: "0.85rem", marginTop: "0.5rem", fontFamily: "'Source Sans 3', sans-serif" }}>
          Your results are saved. You can also download a PDF copy below.
        </p>
        <button
          onClick={handleDownloadPDF}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: "transparent",
            border: `1px solid ${accentColor}`,
            color: accentColor,
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.9rem",
          }}
        >
          <Download size={14} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
          Download PDF
        </button>
      </div>
    );
  }

  if (shareState === "private-saved") {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem", background: bgColor }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: textColor, fontSize: "1.1rem", fontFamily: "'Playfair Display', serif" }}>
          <Lock size={20} />
          Results saved privately.
        </div>
        <p style={{ color: textColor, opacity: 0.6, fontSize: "0.85rem", marginTop: "0.5rem", fontFamily: "'Source Sans 3', sans-serif" }}>
          Only you can see these. Download a PDF copy for your records.
        </p>
        <button
          onClick={handleDownloadPDF}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: "transparent",
            border: `1px solid ${accentColor}`,
            color: accentColor,
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.9rem",
          }}
        >
          <Download size={14} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
          Download PDF
        </button>
      </div>
    );
  }

  if (shareState === "form") {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem", background: bgColor }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: accentColor, fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          Share your results with Tony
        </h3>
        <p style={{ color: textColor, opacity: 0.7, fontSize: "0.85rem", marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>
          Optional — add your name and email so Tony knows who you are.
        </p>
        <div style={{ maxWidth: 360, margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(139,105,20,0.3)",
              borderRadius: "4px",
              color: textColor,
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          <input
            type="email"
            placeholder="Your email (optional)"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(139,105,20,0.3)",
              borderRadius: "4px",
              color: textColor,
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleSave(true); }}
              disabled={submitMutation.isPending}
              style={{
                padding: "0.6rem 1.5rem",
                background: accentColor,
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Send to Tony"}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShareState("idle"); }}
              style={{
                padding: "0.6rem 1rem",
                background: "transparent",
                border: `1px solid rgba(139,105,20,0.3)`,
                color: textColor,
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.85rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: idle state — show all 3 buttons
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem", background: bgColor }}>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.7rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: accentColor,
        marginBottom: "1rem",
      }}>
        Your Results
      </p>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        justifyContent: "center",
        maxWidth: 500,
        margin: "0 auto",
      }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDownloadPDF(); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.65rem 1.25rem",
            background: "transparent",
            border: `1px solid ${accentColor}`,
            color: accentColor,
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.9rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = accentColor; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accentColor; }}
        >
          <Download size={16} />
          Download PDF
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShareState("form"); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.65rem 1.25rem",
            background: accentColor,
            border: "none",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <Send size={16} />
          Send to Tony
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleSave(false); }}
          disabled={submitMutation.isPending}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.65rem 1.25rem",
            background: "transparent",
            border: `1px solid rgba(139,105,20,0.3)`,
            color: textColor,
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.85rem",
            transition: "all 0.2s",
          }}
        >
          <Lock size={16} />
          Keep Private
        </button>
      </div>
    </div>
  );
}

export default AssessmentResultActions;
