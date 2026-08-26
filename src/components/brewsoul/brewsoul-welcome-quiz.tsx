"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Ported from legacy client/src/pages/brewsoul/BrewSoulWelcome.tsx — the
// 8-screen onboarding quiz that computes a "coffee identity" and gates
// entry to /brewsoul/home. Real content/logic unchanged (quiz copy,
// identity scoring, palate questions, gear recs), data + UI kept together
// in one client component matching this migration's own precedent for
// quiz-style pages (peptide-quiz.tsx, engage-audit.tsx).
//
// Two simplifications: (1) the canvas-based WarmParticles decoration is
// dropped — same "not worth the JS cost for pure decoration" call made
// repeatedly elsewhere in this migration; (2) the hero photo
// (`/api/img/brewsoul-orig_84eb4bc9.jpg`) is confirmed dead (404, same
// Manus proxy as everywhere else) — dropped for a CSS gradient, same
// pattern as the peptide pages' dead CloudFront heroes. The scroll-linked
// parallax is kept (cheap: one transform, no canvas).
const SCREENS = [
  {
    q: "Why are you here today?",
    multi: false,
    opts: [
      { emoji: "🔍", text: "I want better coffee at home", tag: "consumer" },
      { emoji: "💼", text: "I source, sell, or serve coffee professionally", tag: "b2b" },
      { emoji: "🌍", text: "I want to understand where my money goes", tag: "impact" },
      { emoji: "🧪", text: "I'm a coffee nerd and I want to go deeper", tag: "connoisseur" },
      { emoji: "🤷", text: "I'm curious — surprise me", tag: "discovery" },
    ],
  },
  {
    q: "Your current relationship with coffee — be honest:",
    multi: false,
    opts: [
      { emoji: "☕", text: "It's fuel. I need it to function. Don't romanticize it.", tag: "functional" },
      { emoji: "🎭", text: "It's a ritual. The making matters as much as the drinking.", tag: "ritual" },
      { emoji: "🔬", text: "It's a rabbit hole. I own a refractometer.", tag: "obsessed" },
      { emoji: "💰", text: "It's a business. I need intelligence, not inspiration.", tag: "professional" },
      { emoji: "🌱", text: "It's a vote. Every purchase is political.", tag: "activist" },
    ],
  },
  {
    q: "The hard questions — coffee's dark side:",
    sub: "Coffee isn't all good. We believe in full disclosure. Which concerns you most?",
    multi: false,
    opts: [
      { emoji: "😴", text: "Sleep disruption — caffeine has a 6-hour half-life", tag: "sleep" },
      { emoji: "💔", text: "Anxiety & cortisol — spikes stress hormones", tag: "anxiety" },
      { emoji: "🦴", text: "Bone density — interferes with calcium absorption", tag: "bone" },
      { emoji: "🌍", text: "Environmental cost — water, deforestation, carbon", tag: "environment" },
      { emoji: "👨‍🌾", text: "Human cost — poverty wages, child labor", tag: "human" },
      { emoji: "✅", text: "None — the benefits outweigh it for me", tag: "none" },
      { emoji: "📚", text: "All of them — show me everything", tag: "all" },
    ],
  },
  {
    q: "And the bright side — what do you love about it?",
    multi: false,
    opts: [
      { emoji: "🧠", text: "Cognitive enhancement — focus, memory, reaction time", tag: "cognitive" },
      { emoji: "🏃", text: "Physical performance — endurance improvement", tag: "physical" },
      { emoji: "❤️", text: "Longevity markers — lower all-cause mortality", tag: "longevity" },
      { emoji: "🛡️", text: "Antioxidant powerhouse — #1 source in Western diets", tag: "antioxidant" },
      { emoji: "🧬", text: "Disease risk reduction — Parkinson's, diabetes, cancer", tag: "disease" },
      { emoji: "🎨", text: "The experience — flavor complexity, ritual, community", tag: "experience" },
      { emoji: "😊", text: "It makes me happy — dopamine is underrated", tag: "happy" },
    ],
  },
  {
    q: "Quick palate check:",
    sub: "These map your flavor preferences to coffee origins and processing methods.",
    multi: false,
    type: "palate" as const,
    opts: [] as { emoji: string; text: string; tag: string }[],
  },
  {
    q: "What would make you pay MORE for coffee?",
    multi: true,
    opts: [
      { emoji: "🔍", text: "Verified farmer payment transparency", tag: "transparency" },
      { emoji: "🧫", text: "Third-party mold/mycotoxin testing", tag: "mold" },
      { emoji: "💎", text: "Rare variety (Gesha, Eugenioides, Laurina)", tag: "rare" },
      { emoji: "🧪", text: "Experimental processing (anaerobic, carbonic)", tag: "experimental" },
      { emoji: "🏆", text: "Competition winner or 90+ SCA score", tag: "competition" },
      { emoji: "💵", text: "I won't — price is price", tag: "price" },
    ],
  },
  {
    q: "The weirdness scale — how deep do you want to go?",
    multi: false,
    type: "slider" as const,
    opts: [] as { emoji: string; text: string; tag: string }[],
  },
  {
    q: "One last thing — how do you drink it?",
    multi: false,
    opts: [
      { emoji: "⚫", text: "Black, always", tag: "purist" },
      { emoji: "🥛", text: "With milk/oat milk", tag: "latte" },
      { emoji: "🧊", text: "Iced or cold brew", tag: "cold" },
      { emoji: "🎨", text: "It depends on the coffee", tag: "flexible" },
    ],
  },
];

const PALATE_QUESTIONS = [
  { label: "Grapefruit:", options: ["Love it", "Tolerate it", "Hate it"], dim: "acid" },
  { label: "Dark chocolate:", options: ["55%", "72%", "85%+"], dim: "bitter" },
  { label: "Wine:", options: ["Clean whites", "Natural/funky", "Big reds", "Don't drink wine"], dim: "processing" },
  { label: "Toast:", options: ["Barely golden", "Golden brown", "Dark & crunchy"], dim: "roast" },
];

const IDENTITIES = [
  {
    id: "terroir-purist",
    name: "The Terroir Purist",
    badge: "🌿",
    desc: "You want the bean to speak. Light roasts, washed processing, single origins. Your heroes are Tim Wendelboe and George Howell. You probably own a refractometer.",
    path: ["Varieties", "Farm Passports", "QPR Best Value"],
    gear: [
      { name: "Hario V60", price: "$9" },
      { name: "Fellow Stagg EKG", price: "$165" },
      { name: "Baratza Encore ESP", price: "$170" },
    ],
  },
  {
    id: "fermentation-explorer",
    name: "The Fermentation Explorer",
    badge: "🧪",
    desc: "You want coffee that makes you question what coffee IS. Anaerobic, carbonic maceration, thermal shock, koji. You're the natural wine person of the coffee world.",
    path: ["Processing Deep-Dive", "Experimental Lots", "Weirdest Coffees"],
    gear: [
      { name: "AeroPress Clear", price: "$40" },
      { name: "Timemore C3", price: "$70" },
      { name: "Acaia Pearl", price: "$150" },
    ],
  },
  {
    id: "ritual-architect",
    name: "The Ritual Architect",
    badge: "🎭",
    desc: "The making is the meditation. Pour-over is prayer with caffeine. Every variable is intentional. Your grinder cost more than your couch.",
    path: ["Brew Guide", "Gear Recs", "Daily Rotation Builder"],
    gear: [
      { name: "Origami Dripper", price: "$38" },
      { name: "Comandante C40", price: "$280" },
      { name: "Fellow Atmos", price: "$30" },
    ],
  },
  {
    id: "impact-alchemist",
    name: "The Impact Alchemist",
    badge: "🌍",
    desc: "Where the dollar goes matters as much as what's in the cup. You want transparency, farmer equity, proof. Every purchase is a vote.",
    path: ["Follow The Dollar", "Transparency Scoreboard", "Farm Passports"],
    gear: [
      { name: "Clever Dripper", price: "$25" },
      { name: "JavaPresse", price: "$40" },
      { name: "KeepCup", price: "$20" },
    ],
  },
  {
    id: "pressure-seeker",
    name: "The Pressure Seeker",
    badge: "☕",
    desc: "Espresso is your language. Crema is your metric. Intensity, body, speed. Dialing in a new single-origin espresso is your weekend project.",
    path: ["Espresso Catalog", "Gear", "Roaster Directory"],
    gear: [
      { name: "Flair Signature", price: "$179" },
      { name: "Normcore V4", price: "$40" },
      { name: "Eureka Mignon Notte", price: "$249" },
    ],
  },
  {
    id: "the-awakening",
    name: "The Awakening",
    badge: "✨",
    desc: "You know you want better than Starbucks but don't know where to start. Perfect. That's exactly why we built this.",
    path: ["Coffee 101", "Taste Quiz", "Top 10 QPR"],
    gear: [
      { name: "AeroPress Go", price: "$35" },
      { name: "Timemore C2", price: "$55" },
      { name: "Fellow Carter", price: "$30" },
    ],
  },
];

type Identity = (typeof IDENTITIES)[number];

function computeIdentity(answers: Record<number, string | string[]>): Identity {
  const scores: Record<string, number> = {};
  for (const i of IDENTITIES) scores[i.id] = 0;

  const a0 = answers[0] as string;
  if (a0 === "consumer") {
    scores["ritual-architect"] += 2;
    scores["the-awakening"] += 2;
  }
  if (a0 === "b2b") scores["pressure-seeker"] += 2;
  if (a0 === "impact") scores["impact-alchemist"] += 3;
  if (a0 === "connoisseur") {
    scores["terroir-purist"] += 2;
    scores["fermentation-explorer"] += 2;
  }
  if (a0 === "discovery") {
    scores["fermentation-explorer"] += 1;
    scores["the-awakening"] += 2;
  }

  const a1 = answers[1] as string;
  if (a1 === "functional") scores["the-awakening"] += 2;
  if (a1 === "ritual") scores["ritual-architect"] += 3;
  if (a1 === "obsessed") {
    scores["terroir-purist"] += 2;
    scores["fermentation-explorer"] += 2;
  }
  if (a1 === "professional") scores["pressure-seeker"] += 2;
  if (a1 === "activist") scores["impact-alchemist"] += 3;

  const a7 = answers[7] as string;
  if (a7 === "purist") scores["terroir-purist"] += 2;
  if (a7 === "latte") scores["pressure-seeker"] += 2;
  if (a7 === "cold") scores["fermentation-explorer"] += 1;
  if (a7 === "flexible") scores["ritual-architect"] += 1;

  const w = parseInt(answers[6] as string) || 5;
  if (w >= 7) scores["fermentation-explorer"] += 3;
  else if (w >= 4) scores["terroir-purist"] += 1;
  else scores["the-awakening"] += 2;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return IDENTITIES.find((i) => i.id === best) || IDENTITIES[5];
}

function GlassOption({
  emoji,
  text,
  selected,
  onClick,
}: {
  emoji: string;
  text: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-3.5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8B6914]/50 hover:bg-white/85 hover:shadow-lg ${
        selected ? "-translate-y-0.5 border-[#8B6914]/50 bg-white/85 shadow-lg" : "border-[#8B6914]/15 bg-white/60"
      }`}
    >
      <span className="text-xl [filter:drop-shadow(0_2px_6px_rgba(139,105,20,0.2))]">{emoji}</span>
      <span className={`font-sans text-sm ${selected ? "font-semibold text-[#8B6914]" : "text-[#2A2A2A]"}`}>{text}</span>
    </button>
  );
}

export function BrewSoulWelcomeQuiz() {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [palateAnswers, setPalateAnswers] = useState<Record<string, string>>({});
  const [weirdness, setWeirdness] = useState(5);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("brewsoul-identity")) router.push("/brewsoul/home");
  }, [router]);

  const totalScreens = SCREENS.length;
  const progress = identity ? 100 : (screen / totalScreens) * 100;

  const advance = useCallback(
    (tag: string) => {
      setFadeIn(false);
      setTimeout(() => {
        setAnswers((prev) => ({ ...prev, [screen]: tag }));
        if (screen < totalScreens - 1) {
          setScreen(screen + 1);
        } else {
          const result = computeIdentity({ ...answers, [screen]: tag });
          setIdentity(result);
          localStorage.setItem("brewsoul-identity", result.id);
        }
        setFadeIn(true);
      }, 300);
    },
    [screen, answers, totalScreens],
  );

  const advanceMulti = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [screen]: multiSelect }));
      setMultiSelect([]);
      if (screen < totalScreens - 1) setScreen(screen + 1);
      setFadeIn(true);
    }, 300);
  }, [screen, multiSelect, totalScreens]);

  const advancePalate = useCallback(() => {
    if (Object.keys(palateAnswers).length < PALATE_QUESTIONS.length) return;
    setFadeIn(false);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [screen]: JSON.stringify(palateAnswers) }));
      setScreen(screen + 1);
      setFadeIn(true);
    }, 300);
  }, [screen, palateAnswers]);

  const advanceSlider = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [screen]: String(weirdness) }));
      setScreen(screen + 1);
      setFadeIn(true);
    }, 300);
  }, [screen, weirdness]);

  const cur = SCREENS[screen];

  if (identity) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6]">
        <div className="fixed inset-x-0 top-0 z-100 h-1 bg-[#8B6914]/8">
          <div
            className="h-full bg-linear-to-r from-[#C5A23C] to-[#8B6914] shadow-[0_0_12px_rgba(197,162,60,0.4)] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-[45vh] pb-12 text-center transition-opacity duration-500"
          style={{ opacity: fadeIn ? 1 : 0 }}
        >
          <div className="max-w-md">
            <div className="mb-4 text-6xl [filter:drop-shadow(0_4px_12px_rgba(139,105,20,0.3))]">{identity.badge}</div>
            <div className="mb-3 font-mono text-[0.68rem] tracking-[0.3em] text-[#8B6914] uppercase">
              Your Coffee Identity
            </div>
            <h1 className="mb-4 font-heading text-3xl font-bold text-[#1A1A1A] sm:text-4xl">{identity.name}</h1>
            <p className="mb-8 text-base leading-relaxed text-[#4A4A4A]">{identity.desc}</p>

            <div className="mb-5 rounded-2xl border border-[#8B6914]/15 bg-white/60 p-5 backdrop-blur-xl">
              <div className="mb-3 font-mono text-[0.65rem] tracking-[0.2em] text-[#8B6914] uppercase">
                Your Recommended Path
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {identity.path.map((p, i) => (
                  <span
                    key={p}
                    className="rounded-full border border-[#8B6914]/15 bg-[#8B6914]/8 px-3 py-1.5 text-sm text-[#5A4A20]"
                  >
                    {i > 0 && "→ "}
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-[#8B6914]/15 bg-white/60 p-5 backdrop-blur-xl">
              <div className="mb-3 font-mono text-[0.65rem] tracking-[0.2em] text-[#8B6914] uppercase">Starter Gear</div>
              {identity.gear.map((g, i) => (
                <div
                  key={g.name}
                  className={`flex justify-between py-1.5 ${i < identity.gear.length - 1 ? "border-b border-[#8B6914]/8" : ""}`}
                >
                  <span className="text-sm text-[#2A2A2A]">{g.name}</span>
                  <span className="font-mono text-[0.82rem] text-[#8B6914]">{g.price}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/brewsoul/home")}
              className="rounded-md bg-linear-to-br from-[#C5A23C] to-[#8B6914] px-10 py-4 font-mono text-[0.82rem] font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_6px_24px_rgba(139,105,20,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,105,20,0.45)]"
            >
              Enter BrewSoul →
            </button>

            <button
              onClick={() => router.push("/brewsoul/quiz")}
              className="mt-2 block rounded-md border border-[#C5A23C]/30 bg-[#C5A23C]/10 px-8 py-3 font-mono text-xs tracking-wide text-[#8B6914] uppercase transition-colors hover:bg-[#C5A23C]/20"
            >
              Or: Take the Taste Quiz →
            </button>

            <button
              onClick={() => {
                setIdentity(null);
                setScreen(0);
                setAnswers({});
                localStorage.removeItem("brewsoul-identity");
              }}
              className="mx-auto mt-4 block font-mono text-[0.7rem] tracking-wide text-[#5A4A20]/40"
            >
              Retake assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6]">
      <div className="fixed inset-x-0 top-0 z-100 h-1 bg-[#8B6914]/8">
        <div
          className="h-full bg-linear-to-r from-[#C5A23C] to-[#8B6914] shadow-[0_0_12px_rgba(197,162,60,0.4)] transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {screen === 0 && (
          <div className="mx-auto max-w-2xl px-6 pt-24 pb-6 text-center">
            <div className="mb-5 font-mono text-[0.65rem] tracking-[0.35em] text-[#8B6914] uppercase">
              Before We Pour — Who Are You?
            </div>
            <h1 className="mb-5 font-heading text-2xl font-bold leading-tight text-[#1A1A1A] sm:text-3xl">
              The world&apos;s most complex legal drug.
              <br />
              <span className="text-[#8B6914]">Let&apos;s find out who you are inside it.</span>
            </h1>
            <p className="mx-auto max-w-md rounded-xl bg-[#FAFAF7]/70 p-5 text-sm leading-loose text-[#4A4A4A] backdrop-blur-md">
              1,000+ flavor compounds. $200B industry. 125 million people depend on it for survival. Your relationship
              with coffee says more about you than you think. Eight questions. No wrong answers. A path built just
              for you.
            </p>
          </div>
        )}

        <div
          className={`flex flex-1 flex-col items-center justify-center px-6 pb-8 transition-opacity duration-300 ${screen === 0 ? "pt-4" : "pt-[52vh]"}`}
          style={{ opacity: fadeIn ? 1 : 0 }}
        >
          <div className="w-full max-w-xl text-center">
            <div className="mb-6 font-mono text-[0.62rem] tracking-[0.25em] text-[#8B6914]/50 uppercase">
              {screen + 1} / {totalScreens}
            </div>

            <h2 className="mb-3 font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">{cur.q}</h2>

            {"sub" in cur && cur.sub && <p className="mb-6 text-sm text-[#6A6A6A] italic">{cur.sub}</p>}

            {cur.type === "palate" && (
              <div className="mt-4 text-left">
                {PALATE_QUESTIONS.map((pq) => (
                  <div key={pq.dim} className="mb-5">
                    <div className="mb-2 text-sm font-semibold text-[#2A2A2A]">{pq.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {pq.options.map((o) => (
                        <button
                          key={o}
                          onClick={() => setPalateAnswers((prev) => ({ ...prev, [pq.dim]: o }))}
                          className={`rounded-full border px-4 py-2 text-sm backdrop-blur-sm transition-all ${
                            palateAnswers[pq.dim] === o
                              ? "border-2 border-[#8B6914] bg-[#8B6914]/10 text-[#8B6914]"
                              : "border border-[#8B6914]/15 bg-white/60 text-[#4A4A4A]"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={advancePalate}
                  disabled={Object.keys(palateAnswers).length < PALATE_QUESTIONS.length}
                  className={`mt-4 rounded-md px-8 py-3.5 font-mono text-xs tracking-wide uppercase ${
                    Object.keys(palateAnswers).length >= PALATE_QUESTIONS.length
                      ? "bg-linear-to-br from-[#C5A23C] to-[#8B6914] font-bold text-[#FAFAF7] shadow-[0_4px_20px_rgba(139,105,20,0.3)]"
                      : "bg-[#8B6914]/6 text-[#8B6914]/30"
                  }`}
                >
                  Continue →
                </button>
              </div>
            )}

            {cur.type === "slider" && (
              <div className="mt-6">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={weirdness}
                  onChange={(e) => setWeirdness(Number(e.target.value))}
                  className="w-full accent-[#8B6914]"
                />
                <div className="mt-2 flex justify-between font-mono text-[0.6rem] text-[#5A4A20]/45">
                  <span>1 — Just give me good coffee</span>
                  <span>10 — Koji eugenioides</span>
                </div>
                <div className="my-6 font-heading text-5xl font-bold text-[#8B6914]">{weirdness}</div>
                <div className="mb-6 text-sm text-[#6A6A6A] italic">
                  {weirdness <= 2 && "Reliable, well-sourced, no surprises."}
                  {weirdness === 3 && "Single-origin, well-sourced, traceable."}
                  {weirdness === 4 && "You appreciate variety and processing differences."}
                  {weirdness === 5 && "You want to understand what makes each coffee unique."}
                  {weirdness === 6 && "Experimental processing? Yes please."}
                  {weirdness === 7 && "Anaerobic fermentation, Sidra variety, thermal shock."}
                  {weirdness === 8 && "You seek out the unusual and the boundary-pushing."}
                  {weirdness === 9 && "Koji-fermented, single-tree lots, species experiments."}
                  {weirdness === 10 && "You'll pay $150 for 100g of koji-fermented eugenioides from a single tree."}
                </div>
                <button
                  onClick={advanceSlider}
                  className="rounded-md bg-linear-to-br from-[#C5A23C] to-[#8B6914] px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_4px_20px_rgba(139,105,20,0.3)]"
                >
                  Continue →
                </button>
              </div>
            )}

            {cur.multi && !cur.type && (
              <div className="mt-4">
                <div className="flex flex-col gap-2.5">
                  {cur.opts.map((o) => (
                    <GlassOption
                      key={o.tag}
                      emoji={o.emoji}
                      text={o.text}
                      selected={multiSelect.includes(o.tag)}
                      onClick={() =>
                        setMultiSelect((prev) => (prev.includes(o.tag) ? prev.filter((t) => t !== o.tag) : [...prev, o.tag]))
                      }
                    />
                  ))}
                </div>
                <button
                  onClick={advanceMulti}
                  disabled={multiSelect.length === 0}
                  className={`mt-5 rounded-md px-8 py-3.5 font-mono text-xs tracking-wide uppercase ${
                    multiSelect.length > 0
                      ? "bg-linear-to-br from-[#C5A23C] to-[#8B6914] font-bold text-[#FAFAF7] shadow-[0_4px_20px_rgba(139,105,20,0.3)]"
                      : "bg-[#8B6914]/6 text-[#8B6914]/30"
                  }`}
                >
                  Continue →
                </button>
              </div>
            )}

            {!cur.multi && !cur.type && (
              <div className="mt-4 flex flex-col gap-2.5">
                {cur.opts.map((o) => (
                  <GlassOption key={o.tag} emoji={o.emoji} text={o.text} onClick={() => advance(o.tag)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pb-10 text-center">
          <button
            onClick={() => {
              localStorage.setItem("brewsoul-identity", "the-awakening");
              router.push("/brewsoul/home");
            }}
            className="font-mono text-[0.65rem] tracking-wide text-[#5A4A20]/25"
          >
            Skip — take me straight to the coffee →
          </button>
        </div>
      </div>
    </div>
  );
}
