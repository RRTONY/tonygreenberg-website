"use client";

import { useEffect, useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourAttachmentStyle.tsx — an
// 18-question (legacy's own `AssessmentIntro` stats prop under-reports it
// as "15," but the real `questions` array has 18 entries — ported the
// live `QUESTIONS.length` everywhere rather than repeating the stale
// number) attachment-theory assessment scoring 4 dimensions (security/
// anxiety/avoidance/disorganization). Real questions, the 4 real
// archetypes (with descriptions), the real scoring/archetype-selection
// logic, and the real closing note on attachment theory all ported
// unchanged. Legacy's own "Journey Continues" block (3 links — "Find
// Your Purpose"/"Find Your Archetype"/"Find Your Leadership Style" — all
// pointing at the identical `/find-my` URL, the same copy-paste bug
// already caught on `/find-your-diet`) isn't reproduced; `WhatsNext`
// already covers that spot.
type Dimension = "security" | "anxiety" | "avoidance" | "disorganization";
const DIMENSION_LABELS: Record<Dimension, string> = {
  security: "Security",
  anxiety: "Anxiety",
  avoidance: "Avoidance",
  disorganization: "Disorganization",
};
const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];
const INITIAL_SCORES: Record<Dimension, number> = { security: 0, anxiety: 0, avoidance: 0, disorganization: 0 };
const ACCENT = "#AD1457";

type ArchetypeKey = "Secure" | "Anxious-Preoccupied" | "Dismissive-Avoidant" | "Fearful-Avoidant";
const ARCHETYPES: Record<ArchetypeKey, { name: string; description: string }> = {
  Secure: {
    name: "The Anchor",
    description: "You are the bedrock of relationships—stable, trusting, and comfortable with intimacy. You navigate love with a steady hand, valuing both connection and autonomy. For you, love is a safe harbor, not a stormy sea.",
  },
  "Anxious-Preoccupied": {
    name: "The Seeker",
    description: "You crave deep connection and intimacy, but a fear of abandonment can create a current of anxiety in your relationships. Your heart is a passionate, hopeful vessel, always seeking reassurance that it has found a safe port.",
  },
  "Dismissive-Avoidant": {
    name: "The Fortress",
    description: "You are a self-sufficient island, valuing independence and autonomy above all. You protect your heart with high walls, finding it safer to rely on yourself than to let others in. Intimacy can feel like a threat to your cherished freedom.",
  },
  "Fearful-Avoidant": {
    name: "The Shapeshifter",
    description: "You are caught in a push-and-pull of wanting love and fearing it. You desire intimacy but are terrified of being hurt, leading to a confusing dance of approach and retreat. Your inner world is a complex landscape of conflicting desires.",
  },
};

function opt(text: string, score: Partial<Record<Dimension, number>>) {
  return { text, score };
}

const QUESTIONS: { question: string; options: { text: string; score: Partial<Record<Dimension, number>> }[] }[] = [
  { question: "When a partner is distant, my immediate reaction is to...", options: [
    opt("Give them space, trusting they'll return.", { security: 3 }),
    opt("Feel a surge of anxiety and try to close the distance.", { anxiety: 3 }),
    opt("Retreat myself, feeling they don't really need me.", { avoidance: 3 }),
    opt("Feel a confusing mix of wanting them close and pushing them away.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "In moments of conflict, I tend to...", options: [
    opt("Stay present and work towards a resolution.", { security: 3 }),
    opt("Worry excessively about the relationship ending.", { anxiety: 3 }),
    opt("Shut down and withdraw to avoid more conflict.", { avoidance: 3 }),
    opt("Alternate between angry outbursts and fearful withdrawal.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "I believe that in a relationship, emotional intimacy is...", options: [
    opt("A source of comfort and strength.", { security: 3 }),
    opt("Something I crave, but I worry I want it more than my partner.", { anxiety: 3 }),
    opt("Often overwhelming and I prefer to keep some emotional distance.", { avoidance: 3 }),
    opt("Both deeply desired and frightening.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "When I think about my need for affection, I feel...", options: [
    opt("Comfortable expressing my needs and receiving affection.", { security: 3 }),
    opt("Anxious that my needs might be too much for others.", { anxiety: 3 }),
    opt("Independent and self-reliant, not needing much affection.", { avoidance: 3 }),
    opt("Confused; I want affection but also feel uncomfortable with it.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "A partner telling me they need space makes me feel...", options: [
    opt("Understanding and I respect their need.", { security: 3 }),
    opt("Rejected and fearful of abandonment.", { anxiety: 3 }),
    opt("Relieved, as I also value my independence.", { avoidance: 3 }),
    opt("Suspicious and worried, but I might not show it.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "My past relationships have often ended because...", options: [
    opt("We grew apart, but the endings were generally amicable.", { security: 3 }),
    opt("Of my intense emotional needs and fear of being left.", { anxiety: 3 }),
    opt("I felt suffocated and needed more freedom.", { avoidance: 3 }),
    opt("They were tumultuous and chaotic.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "When I am single, I generally feel...", options: [
    opt("Content and open to a new relationship when the time is right.", { security: 3 }),
    opt("Incomplete and anxious to find a partner.", { anxiety: 3 }),
    opt("Self-sufficient and comfortable on my own.", { avoidance: 3 }),
    opt("A mix of loneliness and relief.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "Relying on a partner for support is...", options: [
    opt("A natural part of a healthy relationship.", { security: 3 }),
    opt("Something I do, but I worry about being a burden.", { anxiety: 3 }),
    opt("Difficult for me; I prefer to handle things myself.", { avoidance: 3 }),
    opt("Something I want, but I find it hard to trust.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "When a relationship gets serious, I feel...", options: [
    opt("Excited and ready to build a future together.", { security: 3 }),
    opt("A mix of excitement and fear that it might not last.", { anxiety: 3 }),
    opt("A need to pull back and maintain my independence.", { avoidance: 3 }),
    opt("Scared and may look for reasons to end it.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "My view of love is that it is...", options: [
    opt("A partnership based on mutual respect and support.", { security: 3 }),
    opt("An all-consuming and sometimes painful experience.", { anxiety: 3 }),
    opt("Something that can compromise my freedom.", { avoidance: 3 }),
    opt("Often confusing and unpredictable.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "I express affection through...", options: [
    opt("Words, actions, and physical touch comfortably.", { security: 3 }),
    opt("Grand gestures, hoping to secure the relationship.", { anxiety: 3 }),
    opt("Practical acts of service more than emotional expression.", { avoidance: 3 }),
    opt("Inconsistent bursts of affection.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "When a partner is upset with me, I...", options: [
    opt("Listen to their concerns and try to understand their perspective.", { security: 3 }),
    opt("Immediately feel guilty and try to fix things, even if it's not my fault.", { anxiety: 3 }),
    opt("Feel criticized and withdraw to protect myself.", { avoidance: 3 }),
    opt("Can become defensive or blame them back.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "The thought of being vulnerable with a partner makes me feel...", options: [
    opt("It's a necessary part of a deep connection.", { security: 3 }),
    opt("Eager, but also terrified of being hurt.", { anxiety: 3 }),
    opt("Uncomfortable and I avoid it as much as possible.", { avoidance: 3 }),
    opt("Deeply conflicted; I want to but I can't seem to let my guard down.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "I believe my partner's role is to...", options: [
    opt("Be a companion with whom I can share my life.", { security: 3 }),
    opt("Complete me and make me feel whole.", { anxiety: 3 }),
    opt("Respect my independence and not make too many demands.", { avoidance: 3 }),
    opt("I'm not sure what to expect from a partner.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "When I feel insecure in a relationship, I am most likely to...", options: [
    opt("Communicate my feelings to my partner.", { security: 3 }),
    opt("Seek constant reassurance from my partner.", { anxiety: 3 }),
    opt("Create distance to show that I am not needy.", { avoidance: 3 }),
    opt("Start a fight or act out to get a reaction.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "My ideal relationship provides a balance of...", options: [
    opt("Intimacy and independence.", { security: 3 }),
    opt("Constant connection and reassurance.", { anxiety: 3 }),
    opt("Personal space and autonomy.", { avoidance: 3 }),
    opt("Passion and drama, even if it's unstable.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "I handle my emotions in a relationship by...", options: [
    opt("Processing them and expressing them constructively.", { security: 3 }),
    opt("Feeling them very intensely and sometimes being overwhelmed by them.", { anxiety: 3 }),
    opt("Suppressing them to maintain peace and control.", { avoidance: 3 }),
    opt("Experiencing them in a chaotic and unpredictable way.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
  { question: "Reflecting on my childhood, my relationship with my caregivers was...", options: [
    opt("Generally stable and supportive.", { security: 3 }),
    opt("Inconsistent; sometimes they were available, sometimes not.", { anxiety: 3 }),
    opt("Emotionally distant or they encouraged self-reliance.", { avoidance: 3 }),
    opt("Frightening or unpredictable.", { anxiety: 1, avoidance: 1, disorganization: 3 }),
  ] },
];

function calculateArchetype(scores: Record<Dimension, number>): ArchetypeKey {
  const primary = DIMENSIONS.reduce((a, b) => (scores[a] > scores[b] ? a : b));
  if (primary === "security") return "Secure";
  if (primary === "anxiety") return "Anxious-Preoccupied";
  if (primary === "avoidance") return "Dismissive-Avoidant";
  return "Fearful-Avoidant";
}

export function FindYourAttachmentStyleQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const { markComplete } = useJourneyProgress();

  const handleAnswer = (score: Partial<Record<Dimension, number>>) => {
    const next = { ...scores };
    for (const dim in score) next[dim as Dimension] += score[dim as Dimension] ?? 0;
    setScores(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setPhase("results");
  };

  useEffect(() => {
    if (phase === "results") markComplete("find-your-attachment");
  }, [phase, markComplete]);

  const archetypeKey = calculateArchetype(scores);
  const archetype = ARCHETYPES[archetypeKey];
  const chartMax = Math.max(...Object.values(scores), 1);

  return (
    <div className="relative z-1 flex min-h-screen flex-col items-center justify-center px-8 py-8 text-center font-sans text-[#2C1810]">
      <ThemedBackground theme="attachment" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Attachment Style"
          subtitle="How you love is how you were loved. Until you choose differently."
          description="Rooted in attachment theory, this assessment maps the invisible architecture of your relationships. Secure, anxious, avoidant, or disorganized — and more importantly, the specific patterns that keep you repeating what you swore you'd never repeat."
          stats={{ questions: QUESTIONS.length, dimensions: 4, minutes: 5 }}
          whatYouGet={[
            "Your attachment style profile across four dimensions",
            "Understanding of your relationship patterns",
            "Insight into your triggers and defense mechanisms",
            "A path toward earned secure attachment",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="relative z-1 w-full max-w-2xl">
          <p className="mb-8 text-2xl">{QUESTIONS[step].question}</p>
          <div>
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.score)}
                className="mb-4 block w-full border border-brand-gold-light bg-transparent p-4 text-left transition-colors hover:bg-brand-gold-light/10"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && (
        <EmailGate assessmentSlug="attachment-style" onUnlock={() => setEmailGated(true)} />
      )}

      {phase === "results" && emailGated && (
        <div className="relative z-1 max-w-150">
          <h2 className="mb-4 font-heading text-4xl text-brand-gold">{archetype.name}</h2>
          <p className="mb-8">{archetype.description}</p>
          <AssessmentRadarChart scores={scores} max={chartMax} accentColor={ACCENT} />
          <div className="mt-8 flex flex-wrap justify-center gap-4 font-mono uppercase">
            {DIMENSIONS.map((dim) => (
              <span key={dim}>
                {DIMENSION_LABELS[dim]}: {scores[dim]}
              </span>
            ))}
          </div>
          <p className="mx-auto my-8 max-w-125 text-sm italic opacity-80">
            A note on attachment: Your attachment style is a map of your past, not a blueprint for your future. It
            reflects how you learned to connect, but it is not a fixed identity. With awareness and therapeutic
            work, a secure attachment style can be earned at any stage of life.
          </p>
          <JourneyTracker variant="light" currentAssessmentId="find-your-attachment" />
        </div>
      )}
      <WhatsNext />
    </div>
  );
}
