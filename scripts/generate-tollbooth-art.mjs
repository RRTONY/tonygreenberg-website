// One-off (2026-10-13, owner: "you can create new image if it's broken"):
// the 5 in-body pictures for /blog/the-tollbooth-and-the-alternative. Live's
// are broken too (the old image proxy serves a dark placeholder), so these are
// drawn from scratch as line illustrations of live's alt texts, in the site's
// cream / deep-violet / gold-line style. No text. 1200x675.
//
// Same setup as generate-essay-hero-art.mjs (Playwright is not a dependency):
//   PLAYWRIGHT=/path/to/node_modules/playwright node scripts/generate-tollbooth-art.mjs <outDir>
import { createRequire } from "node:module";

const load = createRequire(import.meta.url);
const { chromium } = load(process.env.PLAYWRIGHT || "playwright");

const W = 1200, H = 675;
const GOLD = "#C9A55C", INK = "#2A2142", CREAM = "#F4ECDC", RED = "#B3362F", GREEN = "#7FA36B";
const L = (w = 2, o = 1, c = GOLD) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"`;
const bg = (split) => `<defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6EFE0"/><stop offset="1" stop-color="#E8D6B4"/></linearGradient><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E2448"/><stop offset="1" stop-color="#17112A"/></linearGradient></defs><rect width="${W}" height="${split}" fill="url(#t)"/><rect y="${split}" width="${W}" height="${H - split}" fill="url(#d)"/>`;
const person = (x, y, s = 1, c = GOLD, w = 2) => `<circle cx="${x}" cy="${y - 34 * s}" r="${8 * s}" ${L(w, 1, c)}/><path d="M${x} ${y - 26 * s} L${x} ${y} M${x - 14 * s} ${y - 16 * s} L${x} ${y - 22 * s} L${x + 14 * s} ${y - 16 * s} M${x} ${y} L${x - 10 * s} ${y + 22 * s} M${x} ${y} L${x + 10 * s} ${y + 22 * s}" ${L(w, 1, c)}/>`;

function tollbooth() {
  let g = bg(380);
  for (let i = 0; i < 6; i++) g += `<path d="M0 ${430 + i * 42} Q 150 ${420 + i * 42} 300 ${430 + i * 42} T 600 ${430 + i * 42} T 900 ${430 + i * 42} T 1200 ${430 + i * 42}" ${L(1, 0.25)}/>`;
  // booth on a pier, barrier arm down over the small-boat lane
  g += `<path d="M330 380 L330 250 L420 250 L420 380 M320 250 L375 215 L430 250 M345 280 L405 280 L405 330 L345 330 Z" ${L(2.5)}/>`;
  g += `<path d="M420 300 L700 300" ${L(5, 1, RED)}/><circle cx="420" cy="300" r="7" fill="${GOLD}"/>`;
  // queue of rowboats, each paying a coin
  for (let i = 0; i < 4; i++) { const x = 470 + i * 150; g += `<path d="M${x - 50} 440 Q ${x} 470 ${x + 50} 440 Z" ${L(2.5)}/>` + person(x, 432, 0.7) + `<path d="M${x - 40} 446 L${x - 75} 470 M${x + 40} 446 L${x + 75} 470" ${L(1.5, 0.7)}/>`; }
  for (let i = 0; i < 5; i++) g += `<circle cx="${430 + i * 18}" cy="${352 - i * 12}" r="7" ${L(2)}/>`;
  // superyacht gliding through the open lane, no barrier
  g += `<path d="M760 560 L1150 560 L1110 610 L800 610 Z M820 560 L860 510 L1050 510 L1080 560 M880 510 L900 475 L1010 475 L1030 510 M900 530 L1040 530" ${L(2.5)}/>`;
  g += `<path d="M720 585 L770 585 M700 600 L760 600" ${L(1.5, 0.6)}/>`;
  g += `<circle cx="1040" cy="150" r="60" ${L(1.5, 0.5)}/>`;
  return g;
}

function maze() {
  let g = `<rect width="${W}" height="${H}" fill="#F3EAD8"/>`;
  const iso = (x, y) => [600 + (x - y) * 52, 120 + (x + y) * 30];
  const walls = [[0,0,6,0],[0,0,0,6],[6,0,6,4],[0,6,4,6],[1,1,4,1],[1,1,1,4],[2,2,5,2],[5,2,5,5],[2,3,2,5],[3,3,4,3],[3,4,3,6],[4,4,6,4],[1,5,2,5]];
  for (const [x1, y1, x2, y2] of walls) {
    const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let k = 0; k < n; k++) {
      const x = x1 + (x2 - x1) / n * k, y = y1 + (y2 - y1) / n * k, [a, b] = iso(x, y), [c, d] = iso(x + (x2 - x1) / n, y + (y2 - y1) / n), h = 70;
      g += `<path d="M${a} ${b} L${c} ${d} L${c} ${d - h} L${a} ${b - h} Z" fill="#FBF6EC" ${L(2, 0.95, INK)}/>`;
      for (let j = 1; j < 3; j++) g += `<path d="M${a} ${b - h * j / 3} L${c} ${d - h * j / 3}" ${L(1.2, 0.6, INK)}/>`;
      const mx = (a + c) / 2, my = (b + d) / 2; g += `<path d="M${mx - 6} ${my - 52} L${mx + 6} ${my - 52 + (d - b) / (c - a || 1) * 12}" ${L(2, 0.8, GOLD)}/>`;
    }
  }
  // the one red door, far corner
  const [dx, dy] = iso(6, 4.5); g += `<path d="M${dx - 4} ${dy + 18} L${dx - 4} ${dy - 50} L${dx + 26} ${dy - 68} L${dx + 26} ${dy} Z" fill="${RED}" ${L(2, 1, INK)}/><circle cx="${dx + 18}" cy="${dy - 30}" r="3" fill="${GOLD}"/>`;
  const [px, py] = iso(1.5, 2.6); g += person(px, py, 0.9, INK, 2.5) + `<path d="M${px + 20} ${py - 50} q 8 -10 0 -18 q -6 -6 2 -12" ${L(2, 0.8, INK)}/>`;
  return g;
}

function unbanked() {
  let g = bg(0);
  const blobs = [[240,250,140,90],[300,420,70,110],[560,230,90,70],[600,380,80,120],[790,260,170,110],[930,450,70,50]];
  const people = [];
  let seed = 7; const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (const [cx, cy, rx, ry] of blobs) for (let i = 0; i < Math.round(rx * ry / 260); i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); people.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d]); }
  const chair = [1080, 520];
  people.forEach(([x, y], i) => { if (i % 7 === 0) g += `<path d="M${x} ${y} Q ${(x + chair[0]) / 2} ${Math.min(y, chair[1]) - 120} ${chair[0]} ${chair[1] - 40}" ${L(0.8, 0.28)}/>`; });
  for (const [x, y] of people) g += `<circle cx="${x}" cy="${y - 7}" r="3" fill="${GOLD}" opacity="0.9"/><path d="M${x - 4} ${y + 6} Q ${x} ${y - 4} ${x + 4} ${y + 6}" ${L(1.6, 0.9)}/>`;
  const [cx, cy] = chair;
  g += `<path d="M${cx - 30} ${cy} L${cx + 30} ${cy} M${cx - 30} ${cy} L${cx - 30} ${cy + 55} M${cx + 30} ${cy} L${cx + 30} ${cy + 55} M${cx + 30} ${cy} L${cx + 30} ${cy - 70} M${cx - 30} ${cy} L${cx - 22} ${cy - 70} L${cx + 30} ${cy - 70}" ${L(3, 1, CREAM)}/>`;
  g += `<ellipse cx="${cx}" cy="${cy + 60}" rx="70" ry="10" fill="${GOLD}" opacity="0.18"/>`;
  return g;
}

function dials() {
  let g = bg(H);
  for (let i = 0; i < 14; i++) { const y = 80 + i * 40; g += `<path d="M60 ${y} L${260 + (i % 4) * 60} ${y} L${300 + (i % 4) * 60} ${y + 30} L${700 + (i % 3) * 80} ${y + 30}" ${L(1, 0.3)}/><circle cx="${700 + (i % 3) * 80}" cy="${y + 30}" r="4" ${L(1, 0.5)}/>`; }
  g += `<rect x="200" y="150" width="620" height="380" rx="18" fill="#221A38" ${L(2.5)}/>`;
  const ds = [[330, 270], [510, 270], [690, 270], [330, 430], [510, 430], [690, 430]];
  ds.forEach(([x, y], i) => { g += `<circle cx="${x}" cy="${y}" r="56" ${L(2)}/><circle cx="${x}" cy="${y}" r="40" ${L(1, 0.5)}/>`; for (let t = 0; t < 12; t++) { const a = (t / 12) * Math.PI * 1.5 + Math.PI * 0.75; g += `<path d="M${x + Math.cos(a) * 60} ${y + Math.sin(a) * 60} L${x + Math.cos(a) * 68} ${y + Math.sin(a) * 68}" ${L(1.5, 0.7)}/>`; } const a = Math.PI * 0.75 + ((i * 0.37) % 1) * Math.PI * 1.5; g += `<path d="M${x} ${y} L${x + Math.cos(a) * 36} ${y + Math.sin(a) * 36}" ${L(3, 1, i === 2 ? "#E8C878" : GOLD)}/>`; });
  // a hand reaching in from the right to turn one dial
  g += `<path d="M1200 360 C 1050 350 960 330 900 300 C 860 280 820 270 790 268 C 770 267 760 285 778 292 L 860 305 M 900 300 C 870 300 830 305 800 312 C 780 316 782 334 800 334 L 880 330 M 960 340 C 920 350 860 360 830 366 C 812 370 816 388 834 386 L 930 376 M 1000 372 C 960 390 910 400 880 404 C 864 406 868 422 884 420 L 990 405 M 1000 372 C 1060 400 1140 410 1200 410" fill="#F4ECDC" ${L(2.5)}/>`;
  return g;
}

function openRails() {
  let g = `<defs><linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2448"/><stop offset="1" stop-color="#17112A"/></linearGradient><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6EFE0"/><stop offset="1" stop-color="#DCE6C8"/></linearGradient></defs><rect width="600" height="${H}" fill="url(#l)"/><rect x="600" width="600" height="${H}" fill="url(#r)"/>`;
  g += `<path d="M300 675 C 120 600 480 540 300 470 C 140 410 460 360 300 300 C 180 255 380 215 300 170" ${L(36, 0.18)}/><path d="M300 675 C 120 600 480 540 300 470 C 140 410 460 360 300 300 C 180 255 380 215 300 170" ${L(2, 0.8)}/>`;
  for (const [x, y] of [[300, 470], [300, 300], [300, 170], [215, 590]]) g += `<path d="M${x - 50} ${y} L${x + 50} ${y}" ${L(7, 1, RED)}/><path d="M${x - 50} ${y} L${x - 50} ${y + 30} M${x + 50} ${y} L${x + 50} ${y + 30}" ${L(2)}/>`;
  g += person(380, 620, 1.1, CREAM, 2.5);
  g += `<path d="M600 0 L600 ${H}" ${L(1.5, 0.6)}/>`;
  g += `<path d="M600 520 Q 800 480 1200 510" ${L(2, 0.6, GREEN)}/><path d="M600 580 Q 850 550 1200 575" ${L(1.5, 0.45, GREEN)}/>`;
  for (let i = 0; i < 22; i++) { const x = 630 + i * 26, y = 545 + (i % 3) * 12; g += `<path d="M${x} ${y} l -5 -14 M${x} ${y} l 4 -16 M${x} ${y} l 9 -11" ${L(1.4, 0.6, GREEN)}/>`; }
  g += `<circle cx="1010" cy="170" r="54" fill="#F1D58E" opacity="0.6"/><circle cx="1010" cy="170" r="54" ${L(2)}/>`;
  g += person(840, 480, 1.2, INK, 2.5) + person(960, 480, 1.2, INK, 2.5) + `<path d="M857 456 Q 900 438 943 456" ${L(2.5, 1, INK)}/>`;
  return g;
}

const ART = { "tollbooth-1-tollbooth": tollbooth, "tollbooth-2-maze": maze, "tollbooth-3-unbanked": unbanked, "tollbooth-4-dials": dials, "tollbooth-5-open-rails": openRails };

(async () => {
  const out = process.argv[2];
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const [name, fn] of Object.entries(ART)) {
    await pg.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${fn()}</svg></body>`);
    await pg.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 90 });
    console.log("ok", name);
  }
  await b.close();
})();
