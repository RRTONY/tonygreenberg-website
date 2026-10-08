import { Activity, Briefcase, Heart, Shield, Sprout, type LucideIcon } from "lucide-react";

// Data for /grant-study. Ported from legacy client/src/pages/GrantStudy.tsx — "Find Your Score,"
// a real 25-question (5 per factor) life-satisfaction assessment built on
// the Harvard Grant Study, the longest-running study of human happiness
// (724 men followed from 1938 across 85+ years). Real 5 factors (Warm
// Relationships, Adaptive Coping, Generativity, Career Satisfaction,
// Physical Vitality), every question, every per-factor/per-tier insight
// (grounded in real named findings — Vaillant's "mature defenses,"
// Erikson's generativity, Waldinger's "good relationships keep us happier
// and healthier"), and the real closing "Tony's Note" (the Vaillant/
// Waldinger quotes) all ported unchanged and verbatim.
//
// **Real nested-interactive-element bug found and fixed**: legacy's JSX
// rendered `<AssessmentResultActions>` (which renders its own `<button>`)
// literally inside the "Retake Assessment" `<button>` element — invalid
// HTML, same bug class already caught and fixed on `/find-your-religion`
// and `/find-your-sake`. Rendered as a sibling instead.
//
// **Real normalization**: unlike every other assessment in this ecosystem
// (which all gate results behind `EmailGate`), legacy's Grant Study skipped
// the gate entirely and went straight from the last question to results —
// added here for consistency with every sibling "Find Your X" page (same
// kind of cross-page consistency fix already made for `/find-your-therapy`'s
// accent color). One real dead-link fix in the "Journey Continues" grid:
// legacy pointed "Find Your Spirit" at a dead external
// `findmyassess-9eekxcob.manus.space` stub even though this migration has a
// real, fully-built `/find-your-spirit` — repointed internally, same fix
// pattern already applied on `/find-your-therapy`. "Find Your Partner" is
// kept pointing at its real external sibling site (already the same URL
// `journey-tracker.tsx`'s `JOURNEY_MAP` uses for that entry). `SEO`/`trpc`
// submit call and the redundant `localStorage` results cache dropped — no
// tRPC backend exists in this Next.js app, and `AssessmentResultActions`'s
// `resultSlug` cookie already gives `/self-portrait` a real completion
// record.
export type FactorKey = "relationships" | "coping" | "generativity" | "career" | "health";

export interface Factor {
  key: FactorKey;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const FACTORS: Factor[] = [
  { key: "relationships", name: "Warm Relationships", icon: Heart, description: "The single strongest predictor of life satisfaction. Not quantity — quality. The depth of your connections." },
  { key: "coping", name: "Adaptive Coping", icon: Shield, description: "How you metabolize difficulty. Mature defenses (humor, altruism, sublimation) vs. immature ones (denial, projection, passive aggression)." },
  { key: "generativity", name: "Generativity", icon: Sprout, description: "Erikson's concept: the concern for establishing and guiding the next generation. Mentoring, creating, contributing beyond self." },
  { key: "career", name: "Career Satisfaction", icon: Briefcase, description: "Not status or income — the sense that your work matters, uses your gifts, and aligns with your values." },
  { key: "health", name: "Physical Vitality", icon: Activity, description: "Not the absence of disease — the active cultivation of the body as an instrument of consciousness." },
];

interface Question {
  id: number;
  factor: FactorKey;
  text: string;
  options: { text: string; score: number }[];
}

export const QUESTIONS: Question[] = [
  // Relationships (5)
  { id: 1, factor: "relationships", text: "How many people in your life could you call at 3am in a genuine crisis — and they would answer?", options: [
    { text: "None that I can think of", score: 1 },
    { text: "Maybe one person", score: 3 },
    { text: "Two or three people", score: 5 },
    { text: "A small circle I trust completely", score: 7 },
    { text: "Several — and I'd answer for them too", score: 10 },
  ]},
  { id: 2, factor: "relationships", text: "In your closest relationship, how often do you feel truly seen — not just heard, but understood at a level beyond words?", options: [
    { text: "Rarely or never", score: 1 },
    { text: "Occasionally, in good moments", score: 3 },
    { text: "Sometimes — it comes and goes", score: 5 },
    { text: "Regularly — we've built that depth", score: 7 },
    { text: "It's the foundation of how we relate", score: 10 },
  ]},
  { id: 3, factor: "relationships", text: "When was the last time you were genuinely vulnerable with someone — shared something that scared you to say?", options: [
    { text: "I can't remember", score: 1 },
    { text: "More than a year ago", score: 3 },
    { text: "Within the past few months", score: 5 },
    { text: "Within the past few weeks", score: 7 },
    { text: "This is how I live — vulnerability is my practice", score: 10 },
  ]},
  { id: 4, factor: "relationships", text: "How would you describe the quality of your family relationships (chosen or biological)?", options: [
    { text: "Estranged or deeply painful", score: 1 },
    { text: "Functional but surface-level", score: 3 },
    { text: "Good, with some unresolved tensions", score: 5 },
    { text: "Strong — we show up for each other", score: 7 },
    { text: "Deeply nourishing — they're my root system", score: 10 },
  ]},
  { id: 5, factor: "relationships", text: "Do you have a community — a group of people who share your values and hold you accountable?", options: [
    { text: "No — I'm mostly on my own", score: 1 },
    { text: "I have acquaintances but no real community", score: 3 },
    { text: "I'm part of a group but not deeply embedded", score: 5 },
    { text: "Yes — I have a tribe that knows me", score: 7 },
    { text: "Multiple overlapping communities that sustain me", score: 10 },
  ]},

  // Adaptive Coping (5)
  { id: 6, factor: "coping", text: "When life hits you with something unexpected and painful, your first response is usually:", options: [
    { text: "Shut down, numb out, or escape", score: 1 },
    { text: "Blame someone or something", score: 3 },
    { text: "Feel the pain, then start problem-solving", score: 5 },
    { text: "Reach out to someone I trust", score: 7 },
    { text: "Allow the experience fully, knowing it's teaching me something", score: 10 },
  ]},
  { id: 7, factor: "coping", text: "How do you relate to your own anger?", options: [
    { text: "I suppress it until it explodes", score: 1 },
    { text: "I express it but often regret how", score: 3 },
    { text: "I acknowledge it and try to channel it", score: 5 },
    { text: "I use it as information about my boundaries", score: 7 },
    { text: "I can hold anger with compassion — for myself and others", score: 10 },
  ]},
  { id: 8, factor: "coping", text: "When you fail at something important, your inner narrative sounds like:", options: [
    { text: "I'm a failure — this proves it", score: 1 },
    { text: "The system is rigged against me", score: 3 },
    { text: "That didn't work — what can I learn?", score: 5 },
    { text: "Failure is data — let me adjust and try again", score: 7 },
    { text: "Every failure is composting into something I can't see yet", score: 10 },
  ]},
  { id: 9, factor: "coping", text: "How often do you use humor to process difficult situations?", options: [
    { text: "Rarely — nothing feels funny when things are hard", score: 1 },
    { text: "Sometimes, but it feels forced", score: 3 },
    { text: "Often — it helps me gain perspective", score: 5 },
    { text: "Humor is one of my primary coping tools", score: 7 },
    { text: "I can find the absurd beauty in almost anything", score: 10 },
  ]},
  { id: 10, factor: "coping", text: "Do you have practices (therapy, meditation, journaling, movement) that help you process emotions?", options: [
    { text: "No — I just push through", score: 1 },
    { text: "I've tried things but nothing sticks", score: 3 },
    { text: "I have one or two practices I do sometimes", score: 5 },
    { text: "I have a consistent practice that grounds me", score: 7 },
    { text: "Multiple integrated practices — they're non-negotiable", score: 10 },
  ]},

  // Generativity (5)
  { id: 11, factor: "generativity", text: "Are you actively mentoring or guiding someone younger or less experienced?", options: [
    { text: "No — I'm still figuring things out myself", score: 1 },
    { text: "Informally, when asked", score: 3 },
    { text: "I mentor one or two people", score: 5 },
    { text: "Mentoring is a regular part of my life", score: 7 },
    { text: "I see everything I do as mentoring — modeling a way of being", score: 10 },
  ]},
  { id: 12, factor: "generativity", text: "Are you creating something that will outlast you?", options: [
    { text: "I haven't thought about legacy", score: 1 },
    { text: "I'd like to, but haven't started", score: 3 },
    { text: "I'm working on something that matters", score: 5 },
    { text: "Yes — a body of work, a family, an institution", score: 7 },
    { text: "My life itself is the creation — every interaction is a seed", score: 10 },
  ]},
  { id: 13, factor: "generativity", text: "How much of your energy goes toward things that benefit people beyond yourself?", options: [
    { text: "Almost none — I'm in survival mode", score: 1 },
    { text: "Some, when I have extra to give", score: 3 },
    { text: "A meaningful portion — I volunteer or contribute regularly", score: 5 },
    { text: "It's central to how I spend my time", score: 7 },
    { text: "The distinction between self and other has dissolved — it's all service", score: 10 },
  ]},
  { id: 14, factor: "generativity", text: "Do you feel that the world is better because you're in it?", options: [
    { text: "Honestly, I'm not sure", score: 1 },
    { text: "I hope so, but I can't point to evidence", score: 3 },
    { text: "In small ways, yes", score: 5 },
    { text: "Yes — I can see the ripple effects", score: 7 },
    { text: "I don't need to see it — I trust the impact of living with integrity", score: 10 },
  ]},
  { id: 15, factor: "generativity", text: "What's your relationship to the next generation?", options: [
    { text: "Disconnected — I don't think about it", score: 1 },
    { text: "Concerned but not actively engaged", score: 3 },
    { text: "I try to contribute through my work or community", score: 5 },
    { text: "I'm actively investing in younger people's growth", score: 7 },
    { text: "I feel a sacred responsibility to leave the world more conscious than I found it", score: 10 },
  ]},

  // Career Satisfaction (5)
  { id: 16, factor: "career", text: "Does your work feel like an expression of who you are?", options: [
    { text: "No — it's just a paycheck", score: 1 },
    { text: "Partially — some parts align, others don't", score: 3 },
    { text: "Mostly — I've found work that fits", score: 5 },
    { text: "Yes — my work and my identity are deeply connected", score: 7 },
    { text: "My work is my dharma — I can't imagine not doing it", score: 10 },
  ]},
  { id: 17, factor: "career", text: "Do you feel that your unique gifts are being used in your work?", options: [
    { text: "Not at all — I'm underutilized", score: 1 },
    { text: "Somewhat — but there's so much more I could offer", score: 3 },
    { text: "Mostly — I'm in the right zone", score: 5 },
    { text: "Yes — I'm operating in my zone of genius", score: 7 },
    { text: "My gifts and my work are indistinguishable", score: 10 },
  ]},
  { id: 18, factor: "career", text: "When you think about your professional trajectory, you feel:", options: [
    { text: "Stuck or trapped", score: 1 },
    { text: "Uncertain — I don't know where this is going", score: 3 },
    { text: "On track — moving in a good direction", score: 5 },
    { text: "Excited — the best work is ahead of me", score: 7 },
    { text: "Grateful — the journey itself is the destination", score: 10 },
  ]},
  { id: 19, factor: "career", text: "How often does your work put you in a state of flow — where time disappears?", options: [
    { text: "Never — I watch the clock", score: 1 },
    { text: "Rarely — maybe a few times a year", score: 3 },
    { text: "Sometimes — when I'm on the right project", score: 5 },
    { text: "Often — several times a week", score: 7 },
    { text: "Daily — flow is my default working state", score: 10 },
  ]},
  { id: 20, factor: "career", text: "If money were no object, would you still do what you do?", options: [
    { text: "Absolutely not", score: 1 },
    { text: "Parts of it, maybe", score: 3 },
    { text: "I'd do a version of it", score: 5 },
    { text: "Yes — I'd do more of it", score: 7 },
    { text: "I'd do exactly this — I already am", score: 10 },
  ]},

  // Physical Vitality (5)
  { id: 21, factor: "health", text: "How would you describe your relationship to your body?", options: [
    { text: "Adversarial — it's a source of frustration", score: 1 },
    { text: "Neglectful — I don't pay much attention", score: 3 },
    { text: "Functional — I take care of the basics", score: 5 },
    { text: "Respectful — I invest in my physical health", score: 7 },
    { text: "Sacred — my body is an instrument of consciousness", score: 10 },
  ]},
  { id: 22, factor: "health", text: "How often do you move your body with intention (exercise, yoga, dance, martial arts)?", options: [
    { text: "Rarely or never", score: 1 },
    { text: "Sporadically — when motivation strikes", score: 3 },
    { text: "A few times a week", score: 5 },
    { text: "Daily — it's part of my routine", score: 7 },
    { text: "Movement is a spiritual practice, not just exercise", score: 10 },
  ]},
  { id: 23, factor: "health", text: "How is your sleep?", options: [
    { text: "Terrible — I'm chronically exhausted", score: 1 },
    { text: "Inconsistent — good nights and bad nights", score: 3 },
    { text: "Decent — I get enough most nights", score: 5 },
    { text: "Good — I prioritize sleep hygiene", score: 7 },
    { text: "Restorative — I wake up genuinely refreshed", score: 10 },
  ]},
  { id: 24, factor: "health", text: "What's your relationship to what you put in your body (food, substances, media)?", options: [
    { text: "Unconscious — I consume whatever's convenient", score: 1 },
    { text: "Aware but inconsistent — I know better than I do", score: 3 },
    { text: "Intentional about food, working on the rest", score: 5 },
    { text: "Mindful across all inputs — food, substances, information", score: 7 },
    { text: "Everything I consume is chosen with consciousness", score: 10 },
  ]},
  { id: 25, factor: "health", text: "How much vitality do you feel on a typical day?", options: [
    { text: "Running on empty — surviving, not thriving", score: 1 },
    { text: "Low energy — I push through", score: 3 },
    { text: "Moderate — enough to get things done", score: 5 },
    { text: "Good — I have energy for what matters", score: 7 },
    { text: "Abundant — I feel alive in my body", score: 10 },
  ]},
];

export const ACCENT = "#2E8B57";

export function getFactorScore(answers: Record<number, number>, factorKey: FactorKey): number {
  const factorQs = QUESTIONS.filter((q) => q.factor === factorKey);
  const scores = factorQs.map((q) => answers[q.id] || 0).filter((s) => s > 0);
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 10)) * 100);
}

export const FACTOR_INSIGHTS: Record<FactorKey, Record<"low" | "mid" | "high", string>> = {
  relationships: {
    low: "The Grant Study's most powerful finding: relationships are the single strongest predictor of health and happiness at age 80. This isn't about being social — it's about depth. Start with one relationship. Go deeper than you think is comfortable.",
    mid: "You have the foundation. The Grant Study found that it's not the number of relationships but the quality of attachment that matters. The invitation: choose one relationship and invest in it with the intensity you'd give a career goal.",
    high: "You're living the Grant Study's central finding. George Vaillant, who directed the study for 30 years, said: 'Happiness is love. Full stop.' Your relational wealth is your greatest asset.",
  },
  coping: {
    low: "The Grant Study identified 'mature defenses' as the key differentiator between those who thrived and those who didn't. Immature defenses (denial, projection, acting out) aren't character flaws — they're skills you haven't yet developed. Therapy, meditation, or a trusted mentor can accelerate this.",
    mid: "You're developing mature coping mechanisms. The Grant Study showed that the ability to metabolize difficulty — not avoid it — predicted long-term wellbeing. Keep building your toolkit.",
    high: "Your coping architecture is strong. The Grant Study found that those with mature defenses (humor, altruism, sublimation, anticipation) were healthier, happier, and more successful at every age measured.",
  },
  generativity: {
    low: "Erik Erikson called generativity 'the concern for establishing and guiding the next generation.' The Grant Study confirmed it: those who invested in others' growth reported the highest life satisfaction in their later years. It's never too late to start.",
    mid: "You're engaging with generativity. The Grant Study found that this factor becomes increasingly important after midlife — it's what transforms success into significance.",
    high: "You're living generatively. The Grant Study's longest-lived, happiest participants shared this quality: they saw their lives as instruments of something larger than personal achievement.",
  },
  career: {
    low: "The Grant Study found that career satisfaction wasn't about prestige or income — it was about 'the capacity to work' in a way that felt meaningful. If your work feels misaligned, that's not a personal failing — it's information about where your dharma actually lives.",
    mid: "You're in the zone of alignment. The Grant Study showed that those who found work that used their gifts and served others reported higher satisfaction across all life domains — not just professional ones.",
    high: "Your work-life integration mirrors the Grant Study's happiest participants. They didn't retire from their purpose — they deepened into it. Your work is your practice.",
  },
  health: {
    low: "The Grant Study tracked physical health across 85 years. The finding: it's not your health at 50 that predicts your quality of life at 80 — it's your habits. Small, consistent investments in your body compound over decades. Start anywhere.",
    mid: "You're investing in your physical foundation. The Grant Study found that those who maintained physical vitality had more energy for relationships, work, and generativity — it's the substrate everything else grows from.",
    high: "Your physical vitality is strong. The Grant Study's healthiest participants at 80 shared your approach: they treated the body not as a machine to maintain but as an instrument of consciousness to cultivate.",
  },
};

export function getFactorInsight(factorKey: FactorKey, score: number): string {
  const tier = score < 40 ? "low" : score < 70 ? "mid" : "high";
  return FACTOR_INSIGHTS[factorKey][tier];
}

export function barClassForScore(score: number): string {
  if (score >= 70) return "bg-linear-to-r from-[#2E8B57] to-[#4a7c3f]";
  if (score >= 40) return "bg-linear-to-r from-brand-gold to-brand-gold-light";
  return "bg-linear-to-r from-[#8B4513] to-[#996633]";
}

export const JOURNEY_CONTINUES = [
  { name: "Find Your Purpose", hook: "The Dharma Finder — what you can't stop doing.", url: "/dharma-finder", badge: "25 Qs" },
  { name: "Find Your Therapy", hook: "Matched to your wiring, not a waitlist.", url: "/find-your-therapy", badge: "25 Qs" },
  { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions.", url: "/find-your-spirit", badge: "35 Qs" },
  { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/consciousness-scale", badge: "25 Qs" },
  { name: "Find Your Me", hook: "The gateway to the whole ecosystem.", url: "/find-your-me", badge: "5 Qs" },
];


// UI copy. The question screen follows live (2026-10-06): no intro screen;
// the title block sits above question 1 only, and the credit line shows
// under every question.
export const grantStudyData = {
  intro: {
    eyebrow: "Based on 85 Years of Harvard Research",
    title: "The Grant Study Life Satisfaction Assessment",
    body: "The Harvard Grant Study is the longest-running study of human happiness. Beginning in 1938, it followed 724 participants across their entire lives. The findings are clear: five factors predict lifelong wellbeing. This assessment measures where you stand on each.",
  },
  questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
  previous: "Previous",
  next: "Next",
  finish: "See My Profile",
  credit: "Based on the Harvard Grant Study (1938–present) · Curated by Tony Greenberg",
};
