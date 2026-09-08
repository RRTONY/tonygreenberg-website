"use client";

import { Printer } from "lucide-react";
import { FACILITATOR_BANDS } from "@/lib/content/facilitator-index-data";

// Ported from legacy's `printFacilitatorQuestions()` — real print/PDF
// export of all 108 items as a fillable questionnaire. **Real bug fixed**:
// legacy's print export was a second, hand-written copy of the item text
// that had drifted from the on-page version (different item numbers, band
// groupings, and missing the on-page "Twenty-Five Traditions and
// Protocols" band entirely) — this generates the print HTML directly from
// `FACILITATOR_BANDS`, the same data the page itself renders, so the two
// can never diverge again.
function buildPrintHtml(): string {
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const bandsHtml = FACILITATOR_BANDS.map((band) => {
    const tradRows = band.traditions
      ? band.traditions.map((t) => `<div class="item"><span class="item-num">T${t.n}.</span><span class="item-text">${t.text}</span></div>`).join("")
      : "";
    const itemRows = band.items.map((item) => `<div class="item"><span class="item-num">${item.n}.</span><span class="item-text">${item.text}<span class="answer-line-long"></span></span></div>`).join("");
    return `
<div class="band-header">
  <span class="band-label">${band.label}</span>
  <div class="band-title">${band.title}</div>
  ${band.note ? `<div class="band-note">${band.note}</div>` : ""}
</div>
${tradRows}
${itemRows}
<hr class="divider" />`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>The Facilitator Index — Question Set v1.0</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: letter; margin: 1.1in 1in 1in 1in; }
  body { font-family: Georgia, serif; font-size: 10.5pt; color: #1A1208; line-height: 1.65; background: #fff; }
  .cover { text-align: center; padding: 2.5rem 0 2rem; border-bottom: 2px solid #B45309; margin-bottom: 1.5rem; page-break-after: avoid; }
  .cover-eyebrow { font-size: 7.5pt; letter-spacing: .18em; text-transform: uppercase; color: #B45309; margin-bottom: .5rem; }
  .cover-title { font-size: 22pt; font-weight: 700; color: #1A1208; margin-bottom: .3rem; }
  .cover-sub { font-size: 9.5pt; color: rgba(26,18,8,.55); margin-bottom: .5rem; }
  .cover-copy { font-size: 7.5pt; color: rgba(26,18,8,.4); letter-spacing: .04em; }
  .band-header { margin-top: 1.4rem; margin-bottom: .2rem; page-break-after: avoid; }
  .band-label { font-size: 7pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #B45309; display: block; }
  .band-title { font-size: 13pt; font-weight: 700; color: #1A1208; }
  .band-note { font-size: 8.5pt; color: rgba(26,18,8,.45); font-style: italic; margin-top: .15rem; }
  .item { display: flex; gap: .55rem; align-items: flex-start; padding: .45rem 0; border-bottom: 1px solid rgba(26,18,8,.07); page-break-inside: avoid; }
  .item-num { font-size: 7.5pt; font-weight: 700; color: #B45309; min-width: 2rem; padding-top: .15rem; flex-shrink: 0; }
  .item-text { font-size: 10pt; color: #1A1208; flex: 1; }
  .answer-line-long { display: block; margin-top: .4rem; border-bottom: 1px solid rgba(26,18,8,.15); height: 1.1rem; margin-bottom: .25rem; }
  hr.divider { border: none; border-top: 1px solid rgba(26,18,8,.12); margin: 1.2rem 0 .8rem; }
  .footer-note { margin-top: 2rem; padding-top: 1rem; border-top: 2px solid #B45309; font-size: 7.5pt; color: rgba(26,18,8,.45); text-align: center; line-height: 1.7; }
  .scale-note { font-size: 7.5pt; color: rgba(26,18,8,.4); font-style: italic; margin-bottom: .15rem; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="cover">
  <div class="cover-eyebrow">Companion to the Psychedelic Readiness Index · v1.0 Pilot · Invitation Only</div>
  <div class="cover-title">The Facilitator Index</div>
  <div class="cover-sub">Know Who You Go With — 108 Items Across Twelve Bands</div>
  <div class="cover-sub">A philosophy-first instrument for practitioners who hold non-ordinary states</div>
  <div class="cover-copy">© 2026 Tony Greenberg · All Rights Reserved · Patent Pending · tonygreenberg.com</div>
</div>
<div class="scale-note">Unless otherwise noted, items are open-ended. Write as much or as little as you need. There are no right answers — only honest ones.</div>
<hr class="divider" />
${bandsHtml}
<div class="footer-note">
  The Facilitator Index · v1.0 Pilot · © 2026 Tony Greenberg · All Rights Reserved · Patent Pending<br />
  This document is for personal professional self-assessment only. Not for reproduction, distribution, or derivative use without written license.<br />
  tonygreenberg.com/facilitator-index · Printed: ${dateStr}
</div>
</body>
</html>`;
}

function printFacilitatorQuestions() {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(buildPrintHtml());
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

export function PrintQuestionsButton({ label }: { label: string }) {
  return (
    <button onClick={printFacilitatorQuestions} className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-br from-facilitator-amber-deep to-facilitator-amber-light px-6 py-2.5 text-[.82rem] font-bold tracking-[0.06em] text-facilitator-ink">
      <Printer className="size-4" /> {label}
    </button>
  );
}
