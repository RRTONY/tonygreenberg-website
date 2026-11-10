import { ImageResponse } from "next/og";
import { DISCLAIMER_QR_PATH, DISCLAIMER_QR_URL, DISCLAIMER_QR_VIEW_BOX } from "@/components/pri/disclaimer-qr";
import { COUNCIL_REMINDER } from "@/lib/content/pri-disclaimer";

// The share card for the Psychedelic Readiness Index and its disclaimer page (2026-11-11, Tony's
// scoring review): the council reminder, and a QR code that opens the full disclaimer. Inline
// styles are how ImageResponse draws (same as src/app/icon.tsx).
export const alt = "Psychedelic Readiness Index. Talk to your psychedelic council. No medical clearance.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#1C1410", color: "#F4F0E8", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#D4B96A" }}>TONYGREENBERG.COM</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700 }}>Psychedelic Readiness Index</div>
          <div style={{ marginTop: 12, fontSize: 32, color: "rgba(244,240,232,0.7)" }}>An honest map of where you stand before you go in.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", borderTop: "2px solid rgba(184,123,249,0.4)", paddingTop: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 32 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: "#B87BF9" }}>{COUNCIL_REMINDER.title}</div>
            <div style={{ marginTop: 8, fontSize: 25, color: "rgba(244,240,232,0.75)" }}>{COUNCIL_REMINDER.body}</div>
            <div style={{ marginTop: 10, fontSize: 22, color: "#D4B96A" }}>
              {`${COUNCIL_REMINDER.link}: ${DISCLAIMER_QR_URL.replace("https://", "")}`}
            </div>
          </div>
          <svg width="150" height="150" viewBox={DISCLAIMER_QR_VIEW_BOX} style={{ background: "#FFFFFF" }}>
            <path fill="#000" d={DISCLAIMER_QR_PATH} />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
