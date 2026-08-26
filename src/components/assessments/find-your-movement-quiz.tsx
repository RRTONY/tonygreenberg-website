"use client";

import { useEffect, useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourMovement.tsx — the 15-
// question, 6-dimension (Strength/Flexibility/Endurance/Mindfulness/
// Community/Adventure) movement-archetype assessment. Real
// questions/scoring/result copy unchanged (legacy's own result text is
// generic across dimensions — "Your body wants to move with purpose..." —
// not per-archetype rich copy, so that's ported as-is rather than
// invented). Legacy imported `JourneyTracker`/`useJourneyProgress` but
// never actually rendered/called them on this particular page (dead
// import) — since `JourneyTracker`'s own doc comment says it's meant to
// "appear on every assessment results page," and it's now a real,
// working, backend-free component (see journey-tracker.tsx), this port
// wires it in for real rather than reproducing the gap.
const QUESTIONS: { question: string; options: { text: string; scores: Partial<Record<Dimension, number>> }[] }[] = [
  { question: "What kind of physical challenge excites you most?", options: [
    { text: "Lifting heavy weights", scores: { Strength: 3 } },
    { text: "Flowing through a series of complex poses", scores: { Flexibility: 3 } },
    { text: "Running a long-distance race", scores: { Endurance: 3 } },
    { text: "Mastering a new, intricate technique", scores: { Mindfulness: 3 } },
  ] },
  { question: "When you work out, you prefer to be:", options: [
    { text: "Alone, focused on my own progress", scores: { Strength: 2, Mindfulness: 1 } },
    { text: "In a class, feeding off the group energy", scores: { Community: 3 } },
    { text: "Outdoors, surrounded by nature", scores: { Adventure: 3 } },
    { text: "With a partner or small group", scores: { Community: 2, Adventure: 1 } },
  ] },
  { question: "What's your ideal post-workout feeling?", options: [
    { text: "Powerful and accomplished", scores: { Strength: 3 } },
    { text: "Centered and serene", scores: { Mindfulness: 3, Flexibility: 1 } },
    { text: "Exhausted but exhilarated", scores: { Endurance: 3 } },
    { text: "Connected with my training partners", scores: { Community: 3 } },
  ] },
  { question: "Which environment calls to you for movement?", options: [
    { text: "A well-equipped gym", scores: { Strength: 2 } },
    { text: "A peaceful, open studio", scores: { Flexibility: 2, Mindfulness: 1 } },
    { text: "A sprawling natural landscape", scores: { Adventure: 3, Endurance: 1 } },
    { text: "A martial arts dojo or boxing ring", scores: { Mindfulness: 2, Strength: 1 } },
  ] },
  { question: "Your fitness goal is more about:", options: [
    { text: "Building visible muscle and raw power", scores: { Strength: 3 } },
    { text: "Improving mobility and grace", scores: { Flexibility: 3 } },
    { text: "Pushing your physical limits over time", scores: { Endurance: 3 } },
    { text: "Achieving a mind-body connection", scores: { Mindfulness: 3 } },
  ] },
  { question: "What sounds like a perfect weekend activity?", options: [
    { text: "A long hike in the mountains", scores: { Adventure: 3, Endurance: 1 } },
    { text: "A competitive game of soccer or basketball", scores: { Community: 3, Endurance: 1 } },
    { text: "A silent retreat with meditation and yoga", scores: { Mindfulness: 3, Flexibility: 1 } },
    { text: "A weightlifting competition", scores: { Strength: 3, Community: 1 } },
  ] },
  { question: "When facing a physical barrier, you:", options: [
    { text: "Power through it with sheer force", scores: { Strength: 3 } },
    { text: "Find a way to move around it gracefully", scores: { Flexibility: 2, Mindfulness: 1 } },
    { text: "Pace yourself and wear it down over time", scores: { Endurance: 3 } },
    { text: "Analyze it and find a technical solution", scores: { Mindfulness: 2 } },
  ] },
  { question: "You feel most alive when you are:", options: [
    { text: "Exploring a new trail or path", scores: { Adventure: 3 } },
    { text: "Working in sync with a team", scores: { Community: 3 } },
    { text: "In deep focus, perfecting a single movement", scores: { Mindfulness: 3 } },
    { text: "Pushing your body to its absolute peak", scores: { Strength: 2, Endurance: 1 } },
  ] },
  { question: "Which of these best describes your approach to fitness?", options: [
    { text: "A spiritual practice", scores: { Mindfulness: 3, Flexibility: 1 } },
    { text: "A competitive sport", scores: { Community: 2, Strength: 1 } },
    { text: "A personal journey of discovery", scores: { Adventure: 2, Endurance: 1 } },
    { text: "A disciplined routine", scores: { Strength: 2, Mindfulness: 1 } },
  ] },
  { question: "The most rewarding part of physical activity for you is:", options: [
    { text: "Seeing measurable gains in strength or speed", scores: { Strength: 2, Endurance: 1 } },
    { text: "The feeling of belonging to a community", scores: { Community: 3 } },
    { text: "The sense of peace and mental clarity it brings", scores: { Mindfulness: 3 } },
    { text: "The beauty of the natural world around you", scores: { Adventure: 3 } },
  ] },
  { question: "What role does equipment play in your ideal workout?", options: [
    { text: "It's essential for my training (weights, machines)", scores: { Strength: 3 } },
    { text: "Minimal and functional (yoga mat, resistance bands)", scores: { Flexibility: 2, Strength: 1 } },
    { text: "Just my own body and the ground beneath me", scores: { Endurance: 2, Adventure: 1 } },
    { text: "Specialized gear for a specific sport or art", scores: { Mindfulness: 2, Community: 1 } },
  ] },
  { question: "You are most drawn to movements that are:", options: [
    { text: "Explosive and powerful", scores: { Strength: 3 } },
    { text: "Fluid and controlled", scores: { Flexibility: 3, Mindfulness: 1 } },
    { text: "Repetitive and meditative", scores: { Endurance: 3, Mindfulness: 1 } },
    { text: "Unpredictable and adventurous", scores: { Adventure: 3 } },
  ] },
  { question: "Which phrase resonates most with you?", options: [
    { text: "Stronger than yesterday", scores: { Strength: 3 } },
    { text: "Go with the flow", scores: { Flexibility: 2, Mindfulness: 1 } },
    { text: "The journey is the destination", scores: { Adventure: 2, Endurance: 1 } },
    { text: "One team, one dream", scores: { Community: 3 } },
  ] },
  { question: "Your ideal workout space has:", options: [
    { text: "Mirrors to check your form", scores: { Strength: 2, Mindfulness: 1 } },
    { text: "An open floor and calming music", scores: { Flexibility: 3 } },
    { text: "A finish line and a cheering crowd", scores: { Endurance: 2, Community: 1 } },
    { text: "A rugged, natural terrain", scores: { Adventure: 3 } },
  ] },
  { question: "How do you measure progress?", options: [
    { text: "By how much weight I can lift or how fast I can run", scores: { Strength: 2, Endurance: 1 } },
    { text: "By how connected I feel to my body and mind", scores: { Mindfulness: 3, Flexibility: 1 } },
    { text: "By the new places I've explored", scores: { Adventure: 3 } },
    { text: "By how well I work with my teammates", scores: { Community: 3 } },
  ] },
];

type Dimension = "Strength" | "Flexibility" | "Endurance" | "Mindfulness" | "Community" | "Adventure";
const INITIAL_SCORES: Record<Dimension, number> = { Strength: 0, Flexibility: 0, Endurance: 0, Mindfulness: 0, Community: 0, Adventure: 0 };
const ACCENT = "#E65100";

export function FindYourMovementQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);

  const handleAnswer = (answerScores: Partial<Record<Dimension, number>>) => {
    const next = { ...scores };
    for (const dim in answerScores) {
      next[dim as Dimension] += answerScores[dim as Dimension] ?? 0;
    }
    setScores(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setPhase("results");
  };

  const topDimension = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const { markComplete } = useJourneyProgress();

  useEffect(() => {
    if (phase === "results") markComplete("find-your-movement");
  }, [phase, markComplete]);

  return (
    <div className="relative z-1 flex min-h-screen flex-col items-center justify-center font-sans text-[#2C1810]">
      <ThemedBackground theme="movement" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Movement"
          subtitle="The body moves the way the soul needs to go."
          description="Not a fitness quiz. A movement philosophy assessment. Fifteen questions that map how your body wants to express itself — through strength, flow, endurance, play, stillness, or rhythm. Your movement archetype reveals the practice that will actually stick."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={[
            "Your movement archetype and primary dimension",
            "Understanding of your body's natural movement language",
            "Personalized practice recommendations",
            "Connection to deeper movement resources",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="relative z-1 px-6 text-center">
          <p className="mb-12 font-heading text-3xl">{QUESTIONS[step].question}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.scores)}
                className="border border-brand-gold-light bg-transparent p-6 text-base text-brand-gold transition-colors hover:bg-brand-gold-light/10"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && (
        <EmailGate assessmentSlug="movement" onUnlock={() => setEmailGated(true)} />
      )}

      {phase === "results" && emailGated && (
        <div className="relative z-1 max-w-150 px-6 text-center">
          <h1 className="mb-4 font-heading text-5xl text-brand-gold">Your Movement Archetype</h1>
          <h2 className="mb-6 font-heading text-3xl text-brand-gold italic">The {topDimension?.[0] ?? "Explorer"} Path</h2>
          <p className="mb-8 text-[1.1rem] leading-loose text-[#2C1810]">
            Your body wants to move with purpose. Your highest dimension is {topDimension?.[0]}, suggesting a
            movement practice that honors both physical capacity and inner alignment.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {Object.entries(scores).map(([dim, val]) => (
              <div key={dim} className="rounded-md border border-brand-gold/20 bg-brand-gold-light/10 px-4 py-2.5 font-mono text-[0.8rem]">
                {dim}: {val}
              </div>
            ))}
          </div>
          <JourneyTracker variant="light" currentAssessmentId="find-your-movement" />
        </div>
      )}

      <div className="relative z-1 w-full">
        <WhatsNext />
      </div>
    </div>
  );
}
