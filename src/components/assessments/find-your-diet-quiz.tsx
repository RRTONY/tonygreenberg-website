"use client";

import { useEffect, useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourDiet.tsx — the 15-question,
// 6-dimension (Metabolic Type/Gut Health/Inflammation/Energy Patterns/
// Nutrient Density/Mindful Eating) diet-archetype assessment. Real
// questions, the 6 real archetypes (with real descriptions), and the
// real nearest-neighbor archetype-matching logic (sum of absolute
// per-dimension differences against each archetype's reference vector)
// all ported unchanged. Legacy's own in-page "Journey Continues" block
// (3 links labeled "Find Your Purpose"/"Find Your Calling"/"Find Your
// Truth" that all pointed at the identical `/find-my` URL — a real
// copy-paste bug, same class already caught elsewhere in this migration)
// wasn't reproduced; the page already renders the real shared
// `WhatsNext` block right after it with the same destination, so nothing
// is lost. Legacy's inline `RadarChart` (raw `score * 10` polar
// coordinates with no fixed max or reference rings) replaced with the
// shared `AssessmentRadarChart`. `JourneyTracker`/`useJourneyProgress`
// were dead imports on this legacy page (never rendered/called) — now
// wired in for real (see `journey-tracker.tsx`'s own port note on why).
// The `localStorage.setItem("diet_results", ...)` write was for a
// separate per-assessment result cache legacy's DB-sync code read back
// on login — not ported since there's no auth/DB sync in this migration
// yet, same honest-degradation call already made in `journey-tracker.tsx`.
type Dimension = "Metabolic Type" | "Gut Health" | "Inflammation" | "Energy Patterns" | "Nutrient Density" | "Mindful Eating";
const DIMENSIONS: Dimension[] = ["Metabolic Type", "Gut Health", "Inflammation", "Energy Patterns", "Nutrient Density", "Mindful Eating"];
const INITIAL_SCORES: Record<Dimension, number> = { "Metabolic Type": 0, "Gut Health": 0, Inflammation: 0, "Energy Patterns": 0, "Nutrient Density": 0, "Mindful Eating": 0 };
const ACCENT = "#7CB342";

const QUESTIONS: { text: string; options: { text: string; scores: Partial<Record<Dimension, number>> }[] }[] = [
  { text: "How do you feel after eating a high-carb meal?", options: [
    { text: "Energized and satisfied", scores: { "Metabolic Type": 4 } },
    { text: "A little sluggish", scores: { "Metabolic Type": 2 } },
    { text: "Sleepy and bloated", scores: { "Metabolic Type": 1 } },
    { text: "No significant change", scores: { "Metabolic Type": 3 } },
  ] },
  { text: "How often do you experience digestive discomfort (bloating, gas, etc.)?", options: [
    { text: "Rarely or never", scores: { "Gut Health": 4 } },
    { text: "Occasionally, after certain foods", scores: { "Gut Health": 3 } },
    { text: "Frequently, a few times a week", scores: { "Gut Health": 2 } },
    { text: "Almost daily", scores: { "Gut Health": 1 } },
  ] },
  { text: "How would you describe your energy levels throughout the day?", options: [
    { text: "Stable and consistent", scores: { "Energy Patterns": 4 } },
    { text: "I have a mid-day slump", scores: { "Energy Patterns": 2 } },
    { text: "Up and down like a rollercoaster", scores: { "Energy Patterns": 1 } },
    { text: "Generally low", scores: { "Energy Patterns": 0 } },
  ] },
  { text: "How often do you consume processed or packaged foods?", options: [
    { text: "Rarely, I prefer whole foods", scores: { "Nutrient Density": 4, Inflammation: 4 } },
    { text: "A few times a week", scores: { "Nutrient Density": 2, Inflammation: 2 } },
    { text: "It's a regular part of my diet", scores: { "Nutrient Density": 1, Inflammation: 1 } },
    { text: "I rely on them for most meals", scores: { "Nutrient Density": 0, Inflammation: 0 } },
  ] },
  { text: "When you eat, are you typically...", options: [
    { text: "Focused on the meal, savoring each bite", scores: { "Mindful Eating": 4 } },
    { text: "Distracted by my phone, TV, or work", scores: { "Mindful Eating": 1 } },
    { text: "Eating quickly on the go", scores: { "Mindful Eating": 0 } },
    { text: "A mix of focused and distracted eating", scores: { "Mindful Eating": 2 } },
  ] },
  { text: "How does your body feel when you wake up in the morning?", options: [
    { text: "Rested and refreshed", scores: { Inflammation: 4, "Energy Patterns": 4 } },
    { text: "A bit stiff, but it passes quickly", scores: { Inflammation: 3, "Energy Patterns": 3 } },
    { text: "Stiff and achy for a while", scores: { Inflammation: 2, "Energy Patterns": 2 } },
    { text: "Sore and exhausted", scores: { Inflammation: 1, "Energy Patterns": 1 } },
  ] },
  { text: "How many different types of vegetables do you eat in a typical week?", options: [
    { text: "A wide variety, 10+ types", scores: { "Nutrient Density": 4, "Gut Health": 4 } },
    { text: "A decent mix, 5-9 types", scores: { "Nutrient Density": 3, "Gut Health": 3 } },
    { text: "Just a few staples, 2-4 types", scores: { "Nutrient Density": 2, "Gut Health": 2 } },
    { text: "One or two, if any", scores: { "Nutrient Density": 1, "Gut Health": 1 } },
  ] },
  { text: "How do you respond to hunger cues?", options: [
    { text: "I eat when I feel gentle hunger and stop when satisfied", scores: { "Mindful Eating": 4, "Metabolic Type": 4 } },
    { text: "I often ignore hunger until I'm ravenous", scores: { "Mindful Eating": 1, "Metabolic Type": 1 } },
    { text: "I eat on a strict schedule, regardless of hunger", scores: { "Mindful Eating": 2, "Metabolic Type": 2 } },
    { text: "I tend to snack or graze throughout the day", scores: { "Mindful Eating": 3, "Metabolic Type": 3 } },
  ] },
  { text: "How often do you consume sugary drinks (soda, sweetened teas, fruit juice)?", options: [
    { text: "Almost never", scores: { Inflammation: 4, "Nutrient Density": 4 } },
    { text: "Once or twice a week", scores: { Inflammation: 3, "Nutrient Density": 2 } },
    { text: "A few times a week", scores: { Inflammation: 2, "Nutrient Density": 1 } },
    { text: "Daily", scores: { Inflammation: 1, "Nutrient Density": 0 } },
  ] },
  { text: "How would you describe your relationship with food?", options: [
    { text: "Positive and nourishing", scores: { "Mindful Eating": 4 } },
    { text: "It's complicated and sometimes stressful", scores: { "Mindful Eating": 2 } },
    { text: "Strictly functional, for fuel only", scores: { "Mindful Eating": 3 } },
    { text: "Often a source of guilt or anxiety", scores: { "Mindful Eating": 1 } },
  ] },
  { text: "How does your skin typically look and feel?", options: [
    { text: "Clear and calm", scores: { Inflammation: 4, "Gut Health": 4 } },
    { text: "Prone to dryness or oiliness", scores: { Inflammation: 3, "Gut Health": 3 } },
    { text: "Occasional breakouts or redness", scores: { Inflammation: 2, "Gut Health": 2 } },
    { text: "Consistently irritated, red, or broken out", scores: { Inflammation: 1, "Gut Health": 1 } },
  ] },
  { text: "How do you feel after eating a meal rich in healthy fats (avocado, nuts, olive oil)?", options: [
    { text: "Full, focused, and satiated for hours", scores: { "Metabolic Type": 4, "Energy Patterns": 4 } },
    { text: "Satisfied, but hungry again in a few hours", scores: { "Metabolic Type": 3, "Energy Patterns": 3 } },
    { text: "A bit heavy or sluggish", scores: { "Metabolic Type": 2, "Energy Patterns": 2 } },
    { text: "I don't typically eat high-fat meals", scores: { "Metabolic Type": 1, "Energy Patterns": 1 } },
  ] },
  { text: "How often do you incorporate fermented foods (yogurt, kefir, kimchi) into your diet?", options: [
    { text: "Daily or several times a week", scores: { "Gut Health": 4 } },
    { text: "Occasionally, once or twice a week", scores: { "Gut Health": 3 } },
    { text: "Rarely", scores: { "Gut Health": 2 } },
    { text: "Never", scores: { "Gut Health": 1 } },
  ] },
  { text: "How sensitive are you to caffeine?", options: [
    { text: "Very sensitive, a little goes a long way", scores: { "Metabolic Type": 2, "Energy Patterns": 2 } },
    { text: "I can have it in the morning but not afternoon", scores: { "Metabolic Type": 3, "Energy Patterns": 3 } },
    { text: "Not very sensitive, I can drink it any time", scores: { "Metabolic Type": 4, "Energy Patterns": 4 } },
    { text: "I avoid it completely", scores: { "Metabolic Type": 1, "Energy Patterns": 1 } },
  ] },
  { text: "When you feel stressed or emotional, how does it impact your eating habits?", options: [
    { text: "I tend to lose my appetite", scores: { "Mindful Eating": 2 } },
    { text: "I crave comfort foods or sweets", scores: { "Mindful Eating": 1 } },
    { text: "It doesn't really affect my eating habits", scores: { "Mindful Eating": 4 } },
    { text: "I might snack more, but on healthy things", scores: { "Mindful Eating": 3 } },
  ] },
];

const ARCHETYPES: Record<string, Record<Dimension, number>> = {
  "The Ancestral Eater": { "Metabolic Type": 4, "Gut Health": 3, Inflammation: 4, "Energy Patterns": 3, "Nutrient Density": 4, "Mindful Eating": 2 },
  "The Plant Alchemist": { "Metabolic Type": 2, "Gut Health": 4, Inflammation: 3, "Energy Patterns": 3, "Nutrient Density": 4, "Mindful Eating": 4 },
  "The Intuitive Grazer": { "Metabolic Type": 3, "Gut Health": 3, Inflammation: 2, "Energy Patterns": 4, "Nutrient Density": 3, "Mindful Eating": 4 },
  "The Performance Fueler": { "Metabolic Type": 4, "Gut Health": 2, Inflammation: 2, "Energy Patterns": 4, "Nutrient Density": 3, "Mindful Eating": 1 },
  "The Mediterranean Soul": { "Metabolic Type": 3, "Gut Health": 4, Inflammation: 4, "Energy Patterns": 3, "Nutrient Density": 4, "Mindful Eating": 3 },
  "The Fasting Philosopher": { "Metabolic Type": 1, "Gut Health": 2, Inflammation: 3, "Energy Patterns": 2, "Nutrient Density": 2, "Mindful Eating": 3 },
};

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  "The Ancestral Eater": "You thrive on a diet rich in whole, unprocessed foods, similar to what our ancestors ate. Think high-quality meats, fish, vegetables, fruits, and healthy fats. Grains, legumes, and dairy may not be your best friends.",
  "The Plant Alchemist": "Your body flourishes on a vibrant, plant-based diet. You have a knack for turning vegetables, fruits, legumes, and whole grains into delicious and nourishing meals. You may be more sensitive to animal products.",
  "The Intuitive Grazer": "You're in tune with your body's subtle cues, preferring to eat smaller, more frequent meals throughout the day. You do best when you listen to your hunger and fullness signals rather than sticking to a rigid schedule.",
  "The Performance Fueler": "You see food as fuel for your active lifestyle. You likely need a steady supply of complex carbohydrates and lean proteins to maintain your energy levels and support muscle recovery.",
  "The Mediterranean Soul": "Your body responds well to a diet inspired by the Mediterranean coast—rich in olive oil, fish, fresh vegetables, and whole grains. This anti-inflammatory way of eating supports your overall well-being.",
  "The Fasting Philosopher": "Your digestive system benefits from periods of rest. Intermittent fasting or time-restricted eating can help improve your energy, mental clarity, and metabolic health. You're not one for constant snacking.",
};

function getArchetype(scores: Record<Dimension, number>): string {
  let bestMatch = "";
  let minDifference = Infinity;
  for (const archetype of Object.keys(ARCHETYPES)) {
    let difference = 0;
    for (const dim of DIMENSIONS) difference += Math.abs(scores[dim] - ARCHETYPES[archetype][dim]);
    if (difference < minDifference) {
      minDifference = difference;
      bestMatch = archetype;
    }
  }
  return bestMatch;
}

export function FindYourDietQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);

  const handleAnswer = (optionScores: Partial<Record<Dimension, number>>) => {
    const next = { ...scores };
    for (const dim in optionScores) next[dim as Dimension] += optionScores[dim as Dimension] ?? 0;
    setScores(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setPhase("results");
  };

  const archetype = getArchetype(scores);
  const chartMax = Math.max(...Object.values(scores), 1);
  const { markComplete } = useJourneyProgress();

  useEffect(() => {
    if (phase === "results") markComplete("find-your-diet");
  }, [phase, markComplete]);

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="diet" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Diet"
          subtitle="Your body has been trying to tell you what it needs. Time to listen."
          description="This isn't another meal plan quiz. It's a deep dive into your metabolic type, gut health patterns, inflammation markers, energy cycles, and relationship with food. Fifteen questions that decode the conversation your body's been having without you."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={[
            "Your unique dietary archetype (one of six)",
            "A personalized nutrition dimension map",
            "Insight into your metabolic type and energy patterns",
            "Actionable next steps for your body's actual needs",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="relative z-1 mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="mb-10 font-heading text-3xl text-brand-gold">{QUESTIONS[step].text}</h2>
          <div className="flex flex-col gap-4">
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.scores)}
                className="rounded-md bg-brand-gold-light px-8 py-4 text-lg text-[#0A0A10] transition-transform hover:-translate-y-0.5"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && <EmailGate assessmentSlug="diet" onUnlock={() => setEmailGated(true)} />}

      {phase === "results" && emailGated && (
        <div className="relative z-1 mx-auto max-w-2xl px-6 py-16 text-center">
          <h1 className="mb-4 font-heading text-5xl text-brand-gold">{archetype}</h1>
          <p className="mb-8 text-lg leading-relaxed">{ARCHETYPE_DESCRIPTIONS[archetype]}</p>
          <AssessmentRadarChart scores={scores} max={chartMax} accentColor={ACCENT} />
          <div className="mt-8 flex flex-col gap-1.5">
            {DIMENSIONS.map((dim) => (
              <div key={dim} className="flex justify-between border-b border-black/5 py-1.5 font-mono text-sm">
                <span>{dim}</span>
                <span>{scores[dim]}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <JourneyTracker variant="light" currentAssessmentId="find-your-diet" />
          </div>
        </div>
      )}

      <div className="relative z-1">
        <WhatsNext />
      </div>
    </div>
  );
}
