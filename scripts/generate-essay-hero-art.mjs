// One-off (2026-10-13, owner said yes): text-free hero art for the essays that
// only had live's shared default arch (BLOG-IMAGE-BRIEFS.md). Same family as
// that arch: cream over a deep colour, fine gold line geometry. Colour and motif
// follow the category; the layout is seeded by the slug, so each essay differs
// and a re-run draws the same design. Generated from scratch here (no stock or
// AI imagery, nothing to license). No text: the essay title sits over the hero.
//
// Playwright renders the SVG to JPEG. It is not a project dependency (rule 16),
// so point PLAYWRIGHT at any installed copy, e.g. one from `npx playwright`:
//   PLAYWRIGHT=/path/to/node_modules/playwright node scripts/generate-essay-hero-art.mjs <outDir> "<slug>::<Category>" ...
// The script that uploaded the 92 to Sanity (2026-10-13) is in git history.
import { createRequire } from "node:module";

const load = createRequire(import.meta.url);
const { chromium } = load(process.env.PLAYWRIGHT || "playwright");
const W = 1200, H = 670;
function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
const PAL = {
  "The Crusades": { top: ["#F3E2CF", "#E2B999"], low: ["#3A1420", "#1E0E16"], line: "#D9A35F" },
  "Living Well": { top: ["#F1ECDA", "#D9D2A8"], low: ["#1F2E2A", "#141C1B"], line: "#C9AE6A" },
  "Business & Capital": { top: ["#F4E9D2", "#E2C994"], low: ["#1A1E33", "#10121F"], line: "#D4AF5F" },
  "Culture & Communication": { top: ["#F2E4E0", "#DDB9B3"], low: ["#2E1838", "#1A0F22"], line: "#D2A274" },
  "Systems & Innovation": { top: ["#E6ECF0", "#B9CAD6"], low: ["#13233A", "#0B1424"], line: "#C6A96A" },
  "Impact & Purpose": { top: ["#F4EAD0", "#E6CF8E"], low: ["#2A1F3D", "#161024"], line: "#D8B25C" },
};
const DEF = { top: ["#F4EAD6", "#E3C99C"], low: ["#2A2142", "#151022"], line: "#CFAE6B" };
function motif(cat, r, cx, cy, s, line) {
  const o = `fill="none" stroke="${line}" stroke-width="1.2" opacity="0.75"`;
  let g = "";
  if (cat === "Living Well") for (let i = 0; i < 7; i++) { const a = (i / 6) * Math.PI * 2; const x = i ? cx + Math.cos(a) * s * 0.5 : cx, y = i ? cy + Math.sin(a) * s * 0.5 : cy; g += `<circle cx="${x}" cy="${y}" r="${s * 0.5}" ${o}/>`; }
  else if (cat === "Business & Capital") { let w = s * 1.6, x = cx - w / 2, y = cy - w / 3.236; for (let i = 0; i < 6; i++) { const h = w / 1.618; g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${o}/>`; x += h; w = w - h; } g += `<path d="${spiral(cx, cy, s * 0.9)}" ${o}/>`; }
  else if (cat === "Systems & Innovation") { const pts = Array.from({ length: 11 }, () => [cx + (r() - 0.5) * s * 2.2, cy + (r() - 0.5) * s * 1.6]); pts.forEach((p, i) => pts.slice(i + 1).forEach(q => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < s * 0.9) g += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" ${o}/>`; })); pts.forEach(p => g += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${line}" opacity="0.9"/>`); }
  else if (cat === "Culture & Communication") for (let i = 0; i < 9; i++) { const y = cy - s * 0.6 + i * s * 0.15, amp = s * (0.08 + r() * 0.12), f = 2 + r() * 2; let d = ""; for (let x = 0; x <= 60; x++) d += `${x ? " L" : "M"}${cx - s * 1.3 + (x / 60) * s * 2.6} ${y + Math.sin((x / 60) * Math.PI * f + i * 0.6) * amp}`; g += `<path d="${d}" ${o}/>`; }
  else if (cat === "Impact & Purpose") { for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2; g += `<line x1="${cx + Math.cos(a) * s * 0.25}" y1="${cy + Math.sin(a) * s * 0.25}" x2="${cx + Math.cos(a) * s * (0.7 + (i % 3) * 0.15)}" y2="${cy + Math.sin(a) * s * (0.7 + (i % 3) * 0.15)}" ${o}/>`; } g += `<circle cx="${cx}" cy="${cy}" r="${s * 0.25}" ${o}/>`; }
  else if (cat === "The Crusades") { for (let i = 0; i < 4; i++) { const k = s * (0.35 + i * 0.22); g += `<path d="M${cx} ${cy - k} L${cx + k * 0.87} ${cy + k * 0.5} L${cx - k * 0.87} ${cy + k * 0.5} Z" ${o}/>`; } g += `<line x1="${cx}" y1="${cy - s}" x2="${cx}" y2="${cy + s * 0.7}" ${o}/>`; }
  else { g += `<circle cx="${cx}" cy="${cy}" r="${s * 0.6}" ${o}/><path d="${spiral(cx, cy, s)}" ${o}/>`; }
  return g;
}
function spiral(cx, cy, s) { let d = ""; for (let t = 0; t < 4 * Math.PI; t += 0.08) { const rr = s * 0.04 * Math.exp(0.306 * t); d += (d ? " L" : "M") + (cx + Math.cos(t) * rr) + " " + (cy + Math.sin(t) * rr); } return d; }
function svg(slug, cat) {
  const r = rng(slug), p = PAL[cat] || DEF;
  const split = H * (0.42 + r() * 0.16), side = r() < 0.5;
  const mx = side ? W * (0.18 + r() * 0.14) : W * (0.68 + r() * 0.14), my = H * (0.38 + r() * 0.24), ms = 150 + r() * 70;
  const sx = side ? W * (0.78 + r() * 0.1) : W * (0.12 + r() * 0.1), sy = H * (0.3 + r() * 0.4);
  const arcs = Array.from({ length: 3 }, (_, i) => `<circle cx="${W * r()}" cy="${H * r()}" r="${120 + r() * 380}" fill="none" stroke="${p.line}" stroke-width="0.8" opacity="${0.25 + i * 0.1}"/>`).join("");
  const glow = `<ellipse cx="${W * (0.3 + r() * 0.4)}" cy="${split}" rx="${260 + r() * 200}" ry="40" fill="#FFF4DC" opacity="0.28" filter="url(#b)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.top[0]}"/><stop offset="1" stop-color="${p.top[1]}"/></linearGradient>
<linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.low[0]}"/><stop offset="1" stop-color="${p.low[1]}"/></linearGradient>
<filter id="b" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="30"/></filter></defs>
<rect width="${W}" height="${split}" fill="url(#t)"/><rect y="${split}" width="${W}" height="${H - split}" fill="url(#l)"/>${glow}${arcs}
<g>${motif(cat, r, mx, my, ms, p.line)}</g><path d="${spiral(sx, sy, 120 + r() * 80)}" fill="none" stroke="${p.line}" stroke-width="1" opacity="0.55"/></svg>`;
}
(async () => {
  const [out, ...items] = process.argv.slice(2); // items: slug::category
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const it of items) { const [slug, cat] = it.split("::"); await pg.setContent(`<body style="margin:0">${svg(slug, cat)}</body>`); await pg.screenshot({ path: `${out}/${slug}.jpg`, type: "jpeg", quality: 90 }); console.log("ok", slug); }
  await b.close();
})();
