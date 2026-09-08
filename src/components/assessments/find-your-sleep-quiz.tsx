"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourSleep.tsx — the 15-
// question, 6-dimension (Circadian Alignment/Sleep Architecture/Dream
// Quality/Recovery Depth/Environment Sensitivity/Wind-Down Ritual) sleep-
// archetype assessment. Real questions, the 6 real archetypes (with
// descriptions), and the real cascading archetype-matching logic (a
// series of threshold checks with a highest-dimension fallback) all
// ported unchanged — including legacy's own real behavioral difference
// from the other quizzes: `JourneyTracker` renders unconditionally at
// the top of every phase here, not just on the results screen. Legacy's
// own "Journey Continues" block had one real distinct link (Find Your
// Diet → the already-built `/find-your-diet`) alongside two that were
// the identical-duplicate-destination bug already caught elsewhere
// ("Find Your Focus"/"Find Your Flow", both → `/find-my`, same as
// `WhatsNext` already offers) — kept the real one, dropped the 2 that add
// nothing `WhatsNext` doesn't already cover.
type Dimension = "Circadian Alignment" | "Sleep Architecture" | "Dream Quality" | "Recovery Depth" | "Environment Sensitivity" | "Wind-Down Ritual";
const DIMENSIONS: Dimension[] = ["Circadian Alignment", "Sleep Architecture", "Dream Quality", "Recovery Depth", "Environment Sensitivity", "Wind-Down Ritual"];
const INITIAL_SCORES: Record<Dimension, number> = { "Circadian Alignment": 0, "Sleep Architecture": 0, "Dream Quality": 0, "Recovery Depth": 0, "Environment Sensitivity": 0, "Wind-Down Ritual": 0 };
const ACCENT = "#7E57C2";

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  "The Dawn Walker": "You are an early chronotype, naturally rising with the sun and finding your peak energy in the morning. Your internal clock is well-aligned with the natural light-dark cycle.",
  "The Night Architect": 'You are a late chronotype, a classic "night owl" who finds their peak creativity and energy in the evening hours. Your internal clock is shifted later in the day.',
  "The Power Napper": "You thrive on polyphasic sleep, leveraging short, strategic bursts of rest to maintain high performance throughout the day. Your sleep is flexible and efficient.",
  "The Deep Diver": "Your sleep is dominated by deep, restorative slow-wave stages. You wake up feeling profoundly refreshed, having given your body the ultimate recovery time.",
  "The Dream Weaver": "You experience a rich and vivid dream life, indicating a dominance of REM sleep. Your mind is a canvas for creative, emotional, and memory-processing work during the night.",
  "The Zen Sleeper": "Your sleep quality is deeply connected to your state of mind. You have mastered the art of the wind-down, using mindfulness and relaxation to pave the way for peaceful rest.",
};

const QUESTIONS: { question: string; options: { text: string; scores: Partial<Record<Dimension, number>> }[] }[] = [
  { question: "When do you feel most naturally alert and energetic?", options: [
    { text: "Early morning, as the sun rises.", scores: { "Circadian Alignment": 2 } },
    { text: "Mid-day, after I've had some time to wake up.", scores: { "Circadian Alignment": 1 } },
    { text: "Late afternoon or early evening.", scores: { "Circadian Alignment": -1 } },
    { text: "Late at night, when the world is quiet.", scores: { "Circadian Alignment": -2 } },
  ] },
  { question: "How would you describe your typical night's sleep?", options: [
    { text: "Deep and uninterrupted.", scores: { "Sleep Architecture": 2, "Recovery Depth": 1 } },
    { text: "I wake up a few times, but fall back asleep easily.", scores: { "Sleep Architecture": -1 } },
    { text: "Restless and light; I toss and turn a lot.", scores: { "Sleep Architecture": -2, "Recovery Depth": -1 } },
    { text: "A wild ride of vivid dreams.", scores: { "Dream Quality": 2 } },
  ] },
  { question: "How often do you remember your dreams?", options: [
    { text: "Almost every night, in vivid detail.", scores: { "Dream Quality": 2 } },
    { text: "Frequently, but the details are often hazy.", scores: { "Dream Quality": 1 } },
    { text: "Occasionally, maybe once or twice a week.", scores: { "Dream Quality": -1 } },
    { text: "Rarely, if ever.", scores: { "Dream Quality": -2 } },
  ] },
  { question: "How do you feel upon waking up most mornings?", options: [
    { text: "Refreshed, energized, and ready for the day.", scores: { "Recovery Depth": 2 } },
    { text: "Generally okay, but I need coffee to get started.", scores: { "Recovery Depth": 1 } },
    { text: "Slightly groggy and slow to start.", scores: { "Recovery Depth": -1 } },
    { text: "Tired, as if I haven't slept at all.", scores: { "Recovery Depth": -2 } },
  ] },
  { question: "How sensitive are you to your sleep environment (light, noise, temperature)?", options: [
    { text: "Extremely sensitive. Everything needs to be perfect.", scores: { "Environment Sensitivity": 2 } },
    { text: "Moderately sensitive. Minor disturbances can wake me.", scores: { "Environment Sensitivity": 1 } },
    { text: "Not very sensitive. I can sleep through most things.", scores: { "Environment Sensitivity": -1 } },
    { text: "I could sleep through a rock concert.", scores: { "Environment Sensitivity": -2 } },
  ] },
  { question: "What does your hour before bed typically look like?", options: [
    { text: "A consistent, relaxing routine: reading, stretching, etc.", scores: { "Wind-Down Ritual": 2 } },
    { text: "I try to wind down, but often get distracted by screens.", scores: { "Wind-Down Ritual": -1 } },
    { text: "It varies wildly depending on the day.", scores: { "Wind-Down Ritual": -1 } },
    { text: "Working or watching stimulating TV until the last minute.", scores: { "Wind-Down Ritual": -2 } },
  ] },
  { question: "Do you use any aids to help you sleep (e.g., meditation, white noise, supplements)?", options: [
    { text: "Yes, I have a well-established meditation or mindfulness practice.", scores: { "Wind-Down Ritual": 2 } },
    { text: "I use a white noise machine or app.", scores: { "Environment Sensitivity": 1 } },
    { text: "Occasionally, I'll take something like melatonin.", scores: { "Sleep Architecture": 1 } },
    { text: "No, I just try to power through.", scores: { "Wind-Down Ritual": -1 } },
  ] },
  { question: "How do you feel about napping?", options: [
    { text: "I love a good power nap; it's a key part of my routine.", scores: { "Circadian Alignment": 1, "Sleep Architecture": 1 } },
    { text: "I nap occasionally on weekends.", scores: {} },
    { text: "Naps make me feel groggy and worse off.", scores: { "Sleep Architecture": -1 } },
    { text: "I never have time to nap.", scores: { "Circadian Alignment": -1 } },
  ] },
  { question: "The content of your dreams is typically...", options: [
    { text: "Creative, bizarre, and story-like.", scores: { "Dream Quality": 2 } },
    { text: "Related to my daily life and anxieties.", scores: { "Dream Quality": -1, "Recovery Depth": -1 } },
    { text: "Mostly positive and pleasant.", scores: { "Dream Quality": 1 } },
    { text: "I don't remember them enough to say.", scores: {} },
  ] },
  { question: "How consistent is your sleep schedule, even on weekends?", options: [
    { text: "Very consistent. I go to bed and wake up at the same time every day.", scores: { "Circadian Alignment": 2 } },
    { text: "Fairly consistent, but I allow for some flexibility on weekends.", scores: { "Circadian Alignment": 1 } },
    { text: "It's a bit chaotic; my schedule is all over the place.", scores: { "Circadian Alignment": -2 } },
    { text: "I have a different schedule for weekdays and weekends.", scores: { "Circadian Alignment": -1 } },
  ] },
  { question: "How important is a cool, dark, and quiet room for your sleep?", options: [
    { text: "Absolutely essential. I've optimized my bedroom for it.", scores: { "Environment Sensitivity": 2 } },
    { text: "Very important, but I can manage without it for a night or two.", scores: { "Environment Sensitivity": 1 } },
    { text: "It helps, but it's not a deal-breaker.", scores: { "Environment Sensitivity": -1 } },
    { text: "I don't really notice a difference.", scores: { "Environment Sensitivity": -2 } },
  ] },
  { question: "How long does it typically take you to fall asleep?", options: [
    { text: "Less than 15 minutes.", scores: { "Sleep Architecture": 2 } },
    { text: "15-30 minutes.", scores: { "Sleep Architecture": 1 } },
    { text: "30-60 minutes.", scores: { "Sleep Architecture": -1 } },
    { text: "More than an hour.", scores: { "Sleep Architecture": -2 } },
  ] },
  { question: "Do you feel your sleep quality has a significant impact on your mood and productivity?", options: [
    { text: "Absolutely, it's the foundation of my well-being.", scores: { "Recovery Depth": 2 } },
    { text: "Yes, a bad night's sleep definitely affects me.", scores: { "Recovery Depth": 1 } },
    { text: "Somewhat, but I can usually push through.", scores: { "Recovery Depth": -1 } },
    { text: "Not really, I seem to function the same regardless.", scores: { "Recovery Depth": -2 } },
  ] },
  { question: "Which statement best describes your relationship with technology before bed?", options: [
    { text: "I have a strict 'no screens' rule for at least an hour before sleep.", scores: { "Wind-Down Ritual": 2 } },
    { text: "I use blue-light filters and try to limit my usage.", scores: { "Wind-Down Ritual": 1 } },
    { text: "I often fall asleep while scrolling on my phone or watching something.", scores: { "Wind-Down Ritual": -2 } },
    { text: "I need it to help me fall asleep, like listening to a podcast.", scores: { "Wind-Down Ritual": -1, "Environment Sensitivity": 1 } },
  ] },
  { question: "If you wake up in the middle of the night, what is your typical reaction?", options: [
    { text: "I practice a breathing exercise or meditation to fall back asleep.", scores: { "Wind-Down Ritual": 2, "Sleep Architecture": 1 } },
    { text: "I lie in bed and try to force myself back to sleep, often getting frustrated.", scores: { "Sleep Architecture": -2 } },
    { text: "I get up for a little while and do something relaxing until I feel sleepy again.", scores: { "Sleep Architecture": 1 } },
    { text: "I check my phone.", scores: { "Wind-Down Ritual": -2 } },
  ] },
];

function calculateArchetype(scores: Record<Dimension, number>): string {
  const primaryDimension = DIMENSIONS.reduce((a, b) => (scores[a] > scores[b] ? a : b));

  if (scores["Circadian Alignment"] >= 3) return "The Dawn Walker";
  if (scores["Circadian Alignment"] <= -3) return "The Night Architect";
  if (scores["Wind-Down Ritual"] >= 4) return "The Zen Sleeper";
  if (scores["Dream Quality"] >= 4) return "The Dream Weaver";
  if (scores["Recovery Depth"] >= 4) return "The Deep Diver";
  if (scores["Sleep Architecture"] >= 3 && scores["Circadian Alignment"] >= 1) return "The Power Napper";

  switch (primaryDimension) {
    case "Circadian Alignment":
      return scores["Circadian Alignment"] > 0 ? "The Dawn Walker" : "The Night Architect";
    case "Sleep Architecture":
      return "The Power Napper";
    case "Dream Quality":
      return "The Dream Weaver";
    case "Recovery Depth":
      return "The Deep Diver";
    default:
      return "The Zen Sleeper";
  }
}

export function FindYourSleepQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const { markComplete } = useJourneyProgress();

  const archetype = useMemo(() => calculateArchetype(scores), [scores]);

  useEffect(() => {
    if (phase === "results") markComplete("find-your-sleep");
  }, [phase, archetype, markComplete]);

  const handleAnswer = (optionScores: Partial<Record<Dimension, number>>) => {
    const next = { ...scores };
    for (const dim in optionScores) next[dim as Dimension] += optionScores[dim as Dimension] ?? 0;
    setScores(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setPhase("results");
  };

  const progress = (step / QUESTIONS.length) * 100;
  const chartMax = Math.max(...Object.values(scores).map(Math.abs), 4);

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="sleep" />
      <JourneyTracker variant="light" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Sleep"
          subtitle="The night knows things the day refuses to admit."
          description="Your sleep architecture is as unique as your fingerprint. This assessment maps your chronotype, sleep environment needs, dream patterns, wind-down rituals, and the hidden anxieties that keep you staring at the ceiling. Fifteen questions to decode your relationship with the dark."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={[
            "Your sleep archetype and chronotype profile",
            "A map of your sleep dimensions",
            "Personalized sleep environment recommendations",
            "Insight into your circadian rhythm patterns",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="mx-auto max-w-3xl px-6 py-[clamp(3rem,5vw,4rem)]">
          <div className="mb-8">
            <div className="mb-2 font-mono text-brand-gold">
              Question {step + 1} of {QUESTIONS.length}
            </div>
            <div className="h-1 w-full bg-brand-gold/15">
              <div className="h-1 bg-brand-gold-light transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <h2 className="mb-12 font-heading text-4xl">{QUESTIONS[step].question}</h2>
          <div className="grid grid-cols-1 gap-4">
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.scores)}
                className="border border-brand-gold/30 p-6 text-left text-lg transition-colors hover:bg-brand-gold-light/15"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && <EmailGate assessmentSlug="sleep" onUnlock={() => setEmailGated(true)} />}

      {phase === "results" && emailGated && (
        <div className="mx-auto max-w-4xl px-6 py-[clamp(4rem,6vw,6rem)] text-center">
          <h2 className="mb-4 font-mono text-xl text-brand-gold">Your Sleep Archetype is...</h2>
          <h1 className="mb-4 font-heading text-6xl text-brand-gold">{archetype}</h1>
          <p className="mx-auto mb-8 max-w-150 text-lg">{ARCHETYPE_DESCRIPTIONS[archetype]}</p>

          <div className="flex flex-wrap items-center justify-center gap-16">
            <AssessmentRadarChart scores={scores} max={chartMax} accentColor={ACCENT} />
            <div className="text-left font-mono">
              <h3 className="mb-4 font-heading text-brand-gold">Dimension Scores</h3>
              {DIMENSIONS.map((dim) => (
                <div key={dim} className="mb-2">
                  <span className="text-brand-gold">{dim}:</span> {scores[dim]}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 border-t border-brand-gold-light/25 pt-8">
            <h3 className="mb-6 font-heading text-3xl text-brand-gold">The Journey Continues</h3>
            <div className="flex justify-center gap-4">
              <Link href="/find-your-diet" className="border border-brand-gold/30 px-6 py-3 font-mono">
                Find Your Diet
              </Link>
            </div>
          </div>
        </div>
      )}
      <WhatsNext />
    </div>
  );
}
