"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Circle, Hexagon, Infinity as InfinityIcon, Gem, Target, Swords, RotateCcw, type LucideIcon } from "lucide-react";

// Ported from legacy client/src/pages/JourneyFinder.tsx. Real content,
// unchanged — all 5 questions with real weighted choices, all 6 journey
// archetypes with real curated article lists. Kept as one client file
// (data + component together), matching the precedent set by
// engage-audit.tsx and peptide-quiz.tsx for this shape of page.
//
// Two changes from legacy: (1) the plain Unicode glyphs used as journey
// icons (◉ ⬡ ∞ ◈ ◎ ⚔) are replaced with lucide-react icons, matching this
// migration's icon convention; (2) the "relationship" journey's external
// link (intimacyassess-tcir3hon.manus.space) is dropped — confirmed dead,
// same fully-decommissioned Manus host as everywhere else in this
// migration, not just an unlinked image. `AssessmentResultActions`'s
// backend save (Send to Tony/Keep Private) was dropped too; retake is kept
// since it's real, client-only logic.

interface Choice {
  label: string;
  weights: Record<string, number>;
}

interface Question {
  stem: string;
  prompt: string;
  choices: Choice[];
}

const QUESTIONS: Question[] = [
  {
    stem: "Show me the deepest insight about...",
    prompt: "What keeps you up at 2 a.m. — the question you can't stop circling?",
    choices: [
      { label: "Why the systems that run the world seem designed to break people", weights: { thinker: 3, operator: 1, impact: 2 } },
      { label: "How to build something that actually matters — and make it last", weights: { operator: 3, impact: 2, body: 1 } },
      { label: "Whether the person next to me really sees me — and whether I see them", weights: { relationship: 3, body: 1, thinker: 1 } },
      { label: "What's happening inside my own body and mind — and how to optimize it", weights: { body: 3, thinker: 1, relationship: 1 } },
      { label: "Why people with power keep getting away with things that offend my soul", weights: { crusade: 3, impact: 2, thinker: 1 } },
    ],
  },
  {
    stem: "I want to become someone who...",
    prompt: "When you imagine the version of yourself that makes you proud — what are they doing?",
    choices: [
      { label: "Connecting ideas that nobody else sees are related — and changing the conversation", weights: { thinker: 3, operator: 1 } },
      { label: "Running an operation so clean it makes competitors nervous and partners loyal", weights: { operator: 3, crusade: 1 } },
      { label: "Loving fearlessly — building a partnership that's both sacred and scientific", weights: { relationship: 3, body: 1 } },
      { label: "Living in a body that's a temple — sharp mind, clean blood, radiant energy", weights: { body: 3, impact: 1 } },
      { label: "Holding the powerful accountable — being the person who says what everyone's thinking", weights: { crusade: 3, impact: 1 } },
    ],
  },
  {
    stem: "The thing I wish someone had told me sooner is...",
    prompt: "Which of these would have changed everything if you'd understood it ten years ago?",
    choices: [
      { label: "That consciousness isn't woo-woo — it's the operating system underneath everything", weights: { thinker: 3, body: 2 } },
      { label: "That most businesses fail not from bad ideas but from bad vendor relationships and hidden fees", weights: { operator: 3, crusade: 2 } },
      { label: "That love has a science — attachment styles, communication patterns, the whole architecture", weights: { relationship: 3, thinker: 1 } },
      { label: "That what you eat, breathe, and absorb is literally rewriting your DNA every day", weights: { body: 3, crusade: 1 } },
      { label: "That profit and purpose were never supposed to be different departments", weights: { impact: 3, operator: 2 } },
    ],
  },
  {
    stem: "Connect me to the people who...",
    prompt: "At a dinner party of extraordinary humans, which table are you drawn to?",
    choices: [
      { label: "The philosophers arguing about whether AI has a soul — and the neuroscientist who thinks they're both wrong", weights: { thinker: 3, body: 1 } },
      { label: "The founders swapping war stories about scaling, negotiating, and the deals that got away", weights: { operator: 3, impact: 1 } },
      { label: "The couple who've been together 30 years and still look at each other like it's the first date", weights: { relationship: 3, impact: 1 } },
      { label: "The biohacker, the breathwork coach, and the sommelier debating whether wine counts as medicine", weights: { body: 3, relationship: 1 } },
      { label: "The investigative journalist, the B Corp founder, and the person who just sued their gym", weights: { crusade: 3, operator: 1 } },
    ],
  },
  {
    stem: "The legacy I'm building looks like...",
    prompt: "Fast-forward to the end. What do they say about you at the gathering?",
    choices: [
      { label: "\"They saw the pattern before anyone else — and had the courage to name it.\"", weights: { thinker: 3, impact: 1 } },
      { label: "\"They built something real — and everyone who worked with them was better for it.\"", weights: { operator: 3, relationship: 1 } },
      { label: "\"They loved deeply, and the people around them became more themselves because of it.\"", weights: { relationship: 3, body: 1 } },
      { label: "\"They treated their body like a sacred instrument — and the music showed.\"", weights: { body: 3, thinker: 1 } },
      { label: "\"They never looked away from injustice — and they made the bastards pay.\"", weights: { crusade: 3, impact: 2 } },
    ],
  },
];

interface JourneyResult {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  articles: { slug: string; title: string; why: string }[];
}

const JOURNEYS: Record<string, JourneyResult> = {
  thinker: {
    key: "thinker",
    title: "The Thinker's Thread",
    subtitle: "For the philosophically restless",
    description: "You see patterns where others see noise. Your mind moves between consciousness research, decentralized governance, and the question of what it means to be human in a century that keeps redefining the term. Start here.",
    icon: Circle,
    accent: "#6B4C8A",
    articles: [
      { slug: "boiling-the-human-summit-harvard-kurzweil", title: "Boiling the Human — H+ Summit / Harvard-Kurzweil", why: "The talk that started it all — consciousness, technology, and the question nobody wanted to ask" },
      { slug: "psychedelics-could-become-extractive-capitalism", title: "Psychedelics Could Become Extractive Capitalism", why: "What happens when Wall Street discovers consciousness expansion" },
      { slug: "the-way-of-dao", title: "The Way of DAO", why: "Decentralized governance as a mirror for decentralized selfhood" },
      { slug: "human-operating-system", title: "Human Operating System", why: "The firmware update you didn't know you needed" },
      { slug: "the-molecule-as-mirror-from-substance-to-service", title: "The Molecule as Mirror", why: "From substance to service — the psychedelic thesis" },
      { slug: "a-historical-perspective-on-blockchain", title: "A Historical Perspective on Blockchain", why: "The long arc of decentralization — and why it matters to thinkers" },
    ],
  },
  operator: {
    key: "operator",
    title: "The Operator's Playbook",
    subtitle: "For builders who need the objective lever",
    description: "You run things. You build things. You've been burned by bad vendors and worse advice. You need someone who's sat across from Microsoft, Disney, and Goldman Sachs for 25 years. This path is the business case.",
    icon: Hexagon,
    accent: "#8B6914",
    articles: [
      { slug: "customer-service-key-to-business-success", title: "Customer Service: The Key to Business Success", why: "The most-read business piece on the site — because everyone's been on the wrong end of bad service" },
      { slug: "davos-2022-world-economic-forum-here-we-come", title: "Davos 2022 — World Economic Forum", why: "What actually happens when the world's operators gather in one room" },
      { slug: "why-good-service-is-all-about-trust", title: "Why Good Service Is All About Trust", why: "The trust equation that separates operators from pretenders" },
      { slug: "profiling-the-public-cloud-buyer", title: "Profiling the Public Cloud Buyer", why: "25 years of benchmarking distilled into one framework" },
      { slug: "mastering-human-and-business-development", title: "Mastering Human & Business Development", why: "The intersection of personal growth and organizational scaling" },
      { slug: "from-supply-chain-to-the-blockchain-heal", title: "From Supply Chain to the Blockchain", why: "How infrastructure thinking applies to everything — including healing" },
    ],
  },
  relationship: {
    key: "relationship",
    title: "The Relationship Circuit",
    subtitle: "For anyone who suspects love has a science — and a sacred geometry",
    description: "A friend texted from Jerusalem asking about matchmaking. That text lit years of research on fire. This path traces the neuroscience of magnetic partnership, the arithmetic of mutual value, and the ties that bind us in a century trying to untie everything.",
    icon: InfinityIcon,
    accent: "#C4536A",
    articles: [
      { slug: "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", title: "Love as Dharma — A Science-Based Playbook", why: "The article that started with a text from Jerusalem and ended with a mirror" },
      { slug: "the-ties-that-bind-interpersonal-relationships", title: "The Ties That Bind", why: "Interpersonal relationships amended for a century that keeps trying to untie them" },
      { slug: "the-arithmetic-of-relationships", title: "The Arithmetic of Relationships", why: "The math of mutual value — because love deserves a spreadsheet too" },
      { slug: "the-decay-of-modern-day-communication", title: "The Decay of Modern Day Communication", why: "Why we stopped talking — and what it costs us" },
      { slug: "only-time-buys-trust", title: "Trust Us? Are You Really My Friend?", why: "The trust equation underneath every relationship that matters" },
      { slug: "apologize", title: "I Apologize. Nix 'I Am Sorry' From Our Lexicon", why: "The linguistics of repair — and why most apologies make things worse" },
    ],
  },
  body: {
    key: "body",
    title: "The Body Electric",
    subtitle: "For the biohacker who wants receipts",
    description: "You own an Oura Ring. You've Googled 'peptides' at 2am. You suspect your doctor knows less about your blood than you do. This path connects health investments, alt therapy scorecards, psychedelic medicine, and longevity protocols — with measurement that makes it science, not woo-woo.",
    icon: Gem,
    accent: "#2E8B57",
    articles: [
      { slug: "forever-chemicals-in-my-blood-pfas-and-microplastics", title: "Forever Chemicals in My Blood", why: "What happens when you actually test for what's inside you" },
      { slug: "elixir-of-life-device-and-journey", title: "Elixir of Life Device and Journey", why: "The longevity stack — devices, protocols, and the quest for more time" },
      { slug: "the-molecule-as-mirror-from-substance-to-service", title: "The Molecule as Mirror", why: "Psychedelic medicine as biochemistry optimization" },
      { slug: "india-my-virtual-soul-home", title: "India: My Virtual Soul & Home", why: "Where the body meets the spirit — and the food is medicine" },
      { slug: "an-ode-to-kusaki-where-plants-become-culinary-masterpieces", title: "An Ode to Kusaki", why: "When plants become culinary masterpieces — food as sacred practice" },
      { slug: "eco-vegan-realities-seriesethical-economic", title: "Eco Vegan Realities", why: "The ethical economics of what goes into your body" },
    ],
  },
  impact: {
    key: "impact",
    title: "The Impact Trail",
    subtitle: "For regenerative capitalists and reluctant optimists",
    description: "You believe profit and purpose shouldn't be different departments. You've heard about tokenization but aren't sure if it's real. This path walks through ImpactSoul's ABIT model, live token ecosystems, and why a dinosaur skeleton might fund a school in rural India.",
    icon: Target,
    accent: "#D4B96A",
    articles: [
      { slug: "return-on-investment-going-green-going-green-2", title: "Return on Investment — Going Green", why: "The most-read impact piece — because ROI and regeneration aren't mutually exclusive" },
      { slug: "energy-as-impact", title: "Energy as Impact", why: "Reframing energy from consumption to contribution" },
      { slug: "would-you-hire-someone-who-led-a-rebellion", title: "Would You Hire Someone Who Led a Rebellion?", why: "The character test for impact-driven leadership" },
      { slug: "triple-bottom-line-of-soul-gregory-markel", title: "Triple Bottom Line of Soul", why: "Trust + Empathy = Business + Future" },
      { slug: "the-tug-of-war-ethical-vs-economic-decisions", title: "The Tug of War — Ethical vs. Economic", why: "The tension that defines every meaningful business decision" },
      { slug: "powering-purpose-driven-innovation", title: "Powering Purpose-Driven Innovation", why: "The engine room of impact at breakneck speed" },
    ],
  },
  crusade: {
    key: "crusade",
    title: "The Crusade Files",
    subtitle: "For the righteously pissed off",
    description: "You've been screwed by a company with dark patterns and fake reviews. You didn't write a Yelp review — you wanted to burn the building down (metaphorically). This path is for consumer advocates, whistleblowers, and anyone who believes the crusade IS the product.",
    icon: Swords,
    accent: "#B22222",
    articles: [
      { slug: "hiding-fees-tips-in-the-transparent-age", title: "Hiding Fees & Tips in the Transparent Age", why: "The most-read crusade — because hidden fees are a moral failure" },
      { slug: "dmn8-the-most-beautiful-crooked-gym-in-the-world", title: "DMN8: The Most Beautiful Crooked Gym", why: "When aesthetics mask exploitation — the full investigation" },
      { slug: "how-to-alienate-a-loyal-vegan", title: "How to Alienate a Loyal Vegan", why: "Decades of loyalty destroyed by one act of corporate indifference" },
      { slug: "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", title: "Restaurants Beware of Vegans", why: "The deception economy in food — and why it matters" },
      { slug: "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", title: "The Butcher's Daughter — The Carbon Toll", why: "When your favorite restaurant is secretly destroying the planet" },
      { slug: "forward-health-is-a-sideway-step-at-best", title: "Forward Health Is a Sideways Step", why: "Healthcare disruption that disrupts nothing" },
    ],
  },
};

function score(answers: Record<number, number>) {
  const scores: Record<string, number> = {};
  Object.entries(answers).forEach(([qIdxStr, choiceIdx]) => {
    const q = QUESTIONS[parseInt(qIdxStr, 10)];
    const choice = q?.choices[choiceIdx];
    if (!choice) return;
    Object.entries(choice.weights).forEach(([key, weight]) => {
      scores[key] = (scores[key] ?? 0) + weight;
    });
  });
  return Object.entries(JOURNEYS)
    .map(([key, journey]) => ({ key, score: scores[key] ?? 0, journey }))
    .sort((a, b) => b.score - a.score);
}

export function JourneyFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const totalQuestions = QUESTIONS.length;

  const handleNext = () => {
    if (selectedChoice === null) return;
    setAnswers((prev) => ({ ...prev, [step]: selectedChoice }));
    setSelectedChoice(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step <= 1) return;
    setSelectedChoice(answers[step - 1] ?? null);
    setStep(step - 1);
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers({});
    setSelectedChoice(null);
  };

  if (step === 0) {
    return (
      <div className="bg-[#0A0A10]">
        <div className="px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 font-mono text-xs tracking-[0.35em] text-brand-gold uppercase">
              5 Questions. Your Path.
            </p>
            <h1 className="mb-6 max-w-2xl font-heading text-4xl leading-tight font-normal text-[#FAFAF7] sm:text-6xl">
              Not what you <em className="text-brand-gold-light italic">should</em> read.
              <br />
              What you <em className="text-brand-gold-light italic">can&apos;t stop</em> thinking
              about.
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-[#999]">
              Ninety-one essays. Six territories. One question: where does your mind go when
              nobody&apos;s watching? Answer five questions — honestly, not aspirationally — and
              we&apos;ll map you to the reading journey that matches where you actually are. Not
              where you think you should be.
            </p>
            <div className="mb-12 flex flex-wrap gap-4">
              {["2 minutes", "5 questions", "Your path"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-brand-gold/30 px-3 py-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="rounded-sm bg-brand-gold px-10 py-4 font-mono text-sm tracking-wide text-[#0A0A10] uppercase transition-transform hover:-translate-y-0.5 hover:bg-brand-gold-light"
            >
              Begin →
            </button>
          </div>
        </div>

        <div className="border-t border-brand-gold/15 px-6 py-12 sm:px-10">
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
            {[
              { num: "01", label: "Answer honestly", desc: "Not who you want to be. Who you are at 2 a.m." },
              { num: "02", label: "Get your map", desc: "We score across six territories and find your primary path." },
              { num: "03", label: "Start reading", desc: "Six curated articles — the ones that'll hit hardest for you." },
            ].map((s) => (
              <div key={s.num}>
                <span className="font-mono text-xs tracking-[0.15em] text-brand-gold">{s.num}</span>
                <h3 className="mt-1.5 mb-1 font-heading text-lg font-normal text-[#FAFAF7]">{s.label}</h3>
                <p className="text-sm leading-relaxed text-[#777]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step >= 1 && step <= totalQuestions) {
    const q = QUESTIONS[step - 1];
    const progress = (step / totalQuestions) * 100;

    return (
      <div className="bg-[#0A0A10]">
        <div className="fixed top-0 right-0 left-0 z-50 h-[3px] bg-brand-gold/15">
          <div className="h-full bg-brand-gold transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">{q.stem}</span>
              <span className="font-mono text-xs text-[#555]">
                {step} / {totalQuestions}
              </span>
            </div>

            <h2 className="mb-10 font-heading text-2xl leading-tight font-normal text-[#FAFAF7] sm:text-4xl">
              {q.prompt}
            </h2>

            <div className="mb-10 flex flex-col gap-3">
              {q.choices.map((choice, i) => {
                const isSelected = selectedChoice === i;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedChoice(i)}
                    className={`flex items-start gap-4 rounded-sm border p-5 text-left transition-colors ${
                      isSelected
                        ? "border-brand-gold/50 bg-brand-gold/10"
                        : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${
                        isSelected ? "border-brand-gold text-brand-gold" : "border-[#333] text-[#555]"
                      }`}
                    >
                      {isSelected ? <Check className="size-3.5" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className={`leading-relaxed ${isSelected ? "text-[#FAFAF7]" : "text-[#AAA]"}`}>
                      {choice.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`font-mono text-xs tracking-wide uppercase ${step > 1 ? "text-[#777]" : "invisible"}`}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedChoice === null}
                className={`rounded-sm px-8 py-3 font-mono text-xs tracking-wide uppercase transition-colors ${
                  selectedChoice !== null
                    ? "bg-brand-gold text-[#0A0A10]"
                    : "cursor-not-allowed bg-white/5 text-[#555]"
                }`}
              >
                {step === totalQuestions ? "See My Path →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allScores = score(answers);
  const result = allScores[0]?.journey ?? JOURNEYS.thinker;
  const maxScore = allScores[0]?.score || 1;
  const ResultIcon = result.icon;

  return (
    <div className="bg-[#0A0A10]">
      <div className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 font-mono text-xs tracking-wide text-brand-gold uppercase">
            Your Path Has Been Mapped
          </p>
          <div className="mb-3 flex items-center gap-4">
            <ResultIcon className="size-9" style={{ color: result.accent }} />
            <h1 className="font-heading text-3xl leading-tight font-normal text-[#FAFAF7] sm:text-5xl">
              {result.title}
            </h1>
          </div>
          <p className="mb-5 font-mono text-xs tracking-wide uppercase" style={{ color: result.accent }}>
            {result.subtitle}
          </p>
          <p className="max-w-xl text-lg leading-relaxed text-[#999]">{result.description}</p>
        </div>
      </div>

      <div className="border-t border-brand-gold/10 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <h3 className="mb-6 font-mono text-xs tracking-wide text-brand-gold uppercase">Your Territory Map</h3>
          <div className="flex max-w-md flex-col gap-3">
            {allScores.map(({ journey, score: s }) => {
              const Icon = journey.icon;
              return (
                <div key={journey.key} className="flex items-center gap-4">
                  <span
                    className={`flex w-35 shrink-0 items-center gap-1.5 text-sm ${
                      s === maxScore ? "text-[#FAFAF7]" : "text-[#666]"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {journey.title.replace("The ", "")}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-[width] duration-1000"
                      style={{ width: `${maxScore > 0 ? (s / maxScore) * 100 : 0}%`, background: journey.accent }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-xs text-[#555]">{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto h-px max-w-2xl bg-linear-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <h3 className="mb-8 font-mono text-xs tracking-wide text-brand-gold uppercase">
            Your Reading Path — Start Here
          </h3>
          <div className="flex flex-col gap-5">
            {result.articles.map((article, i) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="grid grid-cols-[2rem_1fr] gap-4 rounded-sm border border-white/6 bg-white/2 p-5 transition-colors hover:border-brand-gold/20 hover:bg-brand-gold/6"
              >
                <span className="mt-0.5 font-mono text-xs" style={{ color: result.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="mb-1 font-heading text-base font-normal text-[#FAFAF7]">{article.title}</h4>
                  <p className="text-sm leading-relaxed text-[#777]">{article.why}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-brand-gold/10 px-6 py-14 text-center sm:px-10">
        <div className="mx-auto max-w-xl">
          <h3 className="mb-4 font-heading text-2xl font-normal text-[#FAFAF7]">
            Curious about the other paths?
          </h3>
          <p className="mb-8 text-[#777]">
            Your secondary scores suggest you&apos;d also resonate with{" "}
            <strong style={{ color: allScores[1]?.journey.accent }}>{allScores[1]?.journey.title}</strong>
            {(allScores[2]?.score ?? 0) > 0 && (
              <>
                {" "}
                and <strong style={{ color: allScores[2]?.journey.accent }}>{allScores[2]?.journey.title}</strong>
              </>
            )}
            .
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/journeys"
              className="rounded-sm border border-brand-gold/30 px-6 py-3 font-mono text-xs tracking-wide text-brand-gold uppercase"
            >
              Explore All Journeys
            </Link>
            <Link
              href="/living-declaration"
              className="rounded-sm border border-white/10 px-6 py-3 font-mono text-xs tracking-wide text-[#999] uppercase"
            >
              Read the Manifesto
            </Link>
            <Link
              href="/community"
              className="rounded-sm border border-white/10 px-6 py-3 font-mono text-xs tracking-wide text-[#999] uppercase"
            >
              Join the Community
            </Link>
          </div>

          <button
            onClick={handleRetake}
            className="mx-auto flex items-center gap-1.5 font-mono text-xs tracking-wide text-[#555] uppercase"
          >
            <RotateCcw className="size-3.5" />
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
