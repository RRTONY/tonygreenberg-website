"use client";

import { useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";

// Ported from legacy client/src/pages/FindYourLoveLanguage.tsx — the
// 15-question, 5-dimension (based on Dr. Gary Chapman's "The 5 Love
// Languages®" framework) assessment. Real questions, archetype
// descriptions/tips, and scoring (including the real negative-score
// "disconnect" question) all ported unchanged, plus the real attribution
// note. Legacy's own in-page "Journey Continues" block (3 links —
// "Find Your Chronotype"/"Find Your Ikigai"/"Find Your Learning Style" —
// all pointing at the identical `/find-my` URL, the same copy-paste bug
// already caught on `/find-your-diet`) isn't reproduced; the real shared
// `WhatsNext` block already covers that spot. Legacy's inline `RadarChart`
// replaced with the shared `AssessmentRadarChart` (same normalization —
// `max(scores, 10)` — just componentized). The dead
// `JourneyTracker`/`useJourneyProgress`/`markComplete` call and the
// `localStorage.setItem("lovelanguage_results", ...)` write (both for a
// journey-tracking system not built in this migration) aren't ported.
type Dimension = "Words of Affirmation" | "Acts of Service" | "Receiving Gifts" | "Quality Time" | "Physical Touch";
const INITIAL_SCORES: Record<Dimension, number> = { "Words of Affirmation": 0, "Acts of Service": 0, "Receiving Gifts": 0, "Quality Time": 0, "Physical Touch": 0 };
const ACCENT = "#C62828";

const ARCHETYPES: Record<Dimension, { name: string; description: string; tips: string }> = {
  "Words of Affirmation": {
    name: "The Encourager",
    description: "You feel love most deeply through spoken or written words. Compliments, encouragement, and heartfelt expressions of affection are your emotional currency. You value hearing 'I love you' and the reasons behind it.",
    tips: "Tell your partner specifically what you appreciate about them. Leave them a note. Verbally praise them in front of others.",
  },
  "Acts of Service": {
    name: "The Helper",
    description: "For you, actions speak louder than words. You feel loved when your partner does things for you, like taking care of chores, running errands, or helping you with a project. These gestures show you that they are on your team.",
    tips: "Ask your partner, 'What can I do to make your day easier?' Proactively take on a task you know they dislike. The key is to serve with a positive spirit.",
  },
  "Receiving Gifts": {
    name: "The Giver",
    description: "You see gifts as tangible, visual symbols of love. It's not about materialism, but the thought and effort behind the gift. A meaningful present shows you that you are known, cared for, and prized.",
    tips: "Pick up small, thoughtful items that remind you of your partner. The value is in the thought, not the price. Make a big deal out of birthdays and anniversaries.",
  },
  "Quality Time": {
    name: "The Companion",
    description: "You feel most loved when you have your partner's undivided attention. This means no phones, no TV, just focused, quality conversation and shared activities. It's about being present and connected.",
    tips: "Schedule daily time to talk without distractions. Plan a date night. Take a walk together. The goal is connection, not just proximity.",
  },
  "Physical Touch": {
    name: "The Cuddler",
    description: "You feel love through physical affection. Hugs, holding hands, a touch on the arm—these are your primary emotional connectors. Physical presence and accessibility are crucial for you to feel secure and loved.",
    tips: "Be intentional about physical contact. Greet with a hug. Hold hands while walking. Offer a back rub. Physical touch can be a powerful emotional bridge.",
  },
};

const QUESTIONS: { text: string; options: { text: string; scores: Partial<Record<Dimension, number>> }[] }[] = [
  { text: "Which of these makes you feel most loved?", options: [
    { text: "Someone telling you how much they appreciate you.", scores: { "Words of Affirmation": 3 } },
    { text: "Someone running an errand for you.", scores: { "Acts of Service": 3 } },
    { text: "Receiving a thoughtful present.", scores: { "Receiving Gifts": 3 } },
    { text: "Spending an uninterrupted evening together.", scores: { "Quality Time": 3 } },
  ] },
  { text: "You feel most valued when your partner:", options: [
    { text: "Gives you a hug or holds your hand.", scores: { "Physical Touch": 3 } },
    { text: 'Says "I love you" unexpectedly.', scores: { "Words of Affirmation": 3 } },
    { text: "Helps you with a difficult project.", scores: { "Acts of Service": 2, "Quality Time": 1 } },
    { text: "Surprises you with a small token of affection.", scores: { "Receiving Gifts": 3 } },
  ] },
  { text: "What would make a birthday feel special?", options: [
    { text: "A heartfelt card with a personal message.", scores: { "Words of Affirmation": 3, "Receiving Gifts": 1 } },
    { text: "Your partner taking care of all the planning for a celebration.", scores: { "Acts of Service": 3 } },
    { text: "A carefully chosen gift you mentioned wanting.", scores: { "Receiving Gifts": 3 } },
    { text: "A weekend getaway for just the two of you.", scores: { "Quality Time": 3, "Physical Touch": 1 } },
  ] },
  { text: "After a long, stressful day, you would most appreciate:", options: [
    { text: "A long hug.", scores: { "Physical Touch": 3 } },
    { text: 'Hearing your partner say, "You handled that so well."', scores: { "Words of Affirmation": 3 } },
    { text: "Coming home to a clean house and a prepared meal.", scores: { "Acts of Service": 3 } },
    { text: "Your partner listening intently as you talk about your day.", scores: { "Quality Time": 3 } },
  ] },
  { text: "Which is most important to you in a relationship?", options: [
    { text: "Feeling understood and listened to.", scores: { "Quality Time": 2, "Words of Affirmation": 1 } },
    { text: "Receiving tangible symbols of love.", scores: { "Receiving Gifts": 3 } },
    { text: "Feeling supported through practical help.", scores: { "Acts of Service": 3 } },
    { text: "Frequent physical intimacy and affection.", scores: { "Physical Touch": 3 } },
  ] },
  { text: "You know your partner is thinking of you when:", options: [
    { text: "They send you a text just to say they miss you.", scores: { "Words of Affirmation": 3 } },
    { text: "They pick up your favorite snack on their way home.", scores: { "Acts of Service": 1, "Receiving Gifts": 2 } },
    { text: "They bring you a souvenir from a trip.", scores: { "Receiving Gifts": 3 } },
    { text: "They make time for a video call when you are apart.", scores: { "Quality Time": 3 } },
  ] },
  { text: 'What does "I support you" mean to you?', options: [
    { text: '"I believe in you and your abilities."', scores: { "Words of Affirmation": 3 } },
    { text: '"I will help you in any way I can."', scores: { "Acts of Service": 3 } },
    { text: '"I am here to listen without judgment."', scores: { "Quality Time": 3 } },
    { text: '"I am your rock, you can lean on me."', scores: { "Physical Touch": 2, "Words of Affirmation": 1 } },
  ] },
  { text: "A perfect date night involves:", options: [
    { text: "Deep conversation and connection.", scores: { "Quality Time": 3 } },
    { text: "Lots of cuddling and closeness.", scores: { "Physical Touch": 3 } },
    { text: "Your partner planning the entire evening.", scores: { "Acts of Service": 2 } },
    { text: "Exchanging small, meaningful gifts.", scores: { "Receiving Gifts": 2 } },
  ] },
  { text: "You feel a disconnect when your partner:", options: [
    { text: "Is distracted by their phone when you are together.", scores: { "Quality Time": -3 } },
    { text: "Forgets an important anniversary or event.", scores: { "Receiving Gifts": -2, "Acts of Service": -1 } },
    { text: "Is not physically affectionate.", scores: { "Physical Touch": -3 } },
    { text: "Rarely offers praise or encouragement.", scores: { "Words of Affirmation": -3 } },
  ] },
  { text: "Which compliment would mean the most?", options: [
    { text: '"You are so incredibly talented."', scores: { "Words of Affirmation": 3 } },
    { text: '"I love how you take care of things."', scores: { "Acts of Service": 3 } },
    { text: '"You have the best taste." (in reference to a gift)', scores: { "Receiving Gifts": 3 } },
    { text: '"I love spending time with you."', scores: { "Quality Time": 3 } },
  ] },
  { text: "An apology is most meaningful when it includes:", options: [
    { text: "A promise to do better and a plan for how.", scores: { "Acts of Service": 3 } },
    { text: "A sincere expression of regret and empathy.", scores: { "Words of Affirmation": 3 } },
    { text: "Making up for it with a special gesture.", scores: { "Receiving Gifts": 2, "Quality Time": 1 } },
    { text: "A hug and reassurance.", scores: { "Physical Touch": 3 } },
  ] },
  { text: "You feel most secure in a relationship when:", options: [
    { text: "You have your partner's undivided attention.", scores: { "Quality Time": 3 } },
    { text: "You are physically close to your partner.", scores: { "Physical Touch": 3 } },
    { text: "You hear words of love and affirmation regularly.", scores: { "Words of Affirmation": 3 } },
    { text: "You know you can count on your partner for practical help.", scores: { "Acts of Service": 3 } },
  ] },
  { text: "What makes you feel cherished?", options: [
    { text: "A surprise gift that shows they know you well.", scores: { "Receiving Gifts": 3 } },
    { text: "Your partner doing a chore they know you hate.", scores: { "Acts of Service": 3 } },
    { text: "A spontaneous back rub.", scores: { "Physical Touch": 3 } },
    { text: "Your partner putting their phone away to talk to you.", scores: { "Quality Time": 3 } },
  ] },
  { text: "When you are away from your partner, you most like to:", options: [
    { text: 'Receive a "thinking of you" gift in the mail.', scores: { "Receiving Gifts": 3 } },
    { text: "Have long phone calls to catch up.", scores: { "Quality Time": 2, "Words of Affirmation": 1 } },
    { text: "Know they are handling things at home so you don't have to worry.", scores: { "Acts of Service": 3 } },
    { text: "Look forward to a big hug when you reunite.", scores: { "Physical Touch": 3 } },
  ] },
  { text: "Which of these feels like the ultimate romantic gesture?", options: [
    { text: "A surprise party planned with all your favorite people.", scores: { "Acts of Service": 2, "Quality Time": 1 } },
    { text: "A public declaration of love and admiration.", scores: { "Words of Affirmation": 3 } },
    { text: "An incredibly thoughtful and personal gift.", scores: { "Receiving Gifts": 3 } },
    { text: "A quiet, intimate moment of connection.", scores: { "Physical Touch": 2, "Quality Time": 1 } },
  ] },
];

export function FindYourLoveLanguageQuiz() {
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

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] as Dimension;
  const secondary = sorted[1]?.[0] as Dimension;
  const chartMax = Math.max(...Object.values(scores), 10);

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="love" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Love Language"
          subtitle="Love isn't one language. It's five — and you've been mistranslating."
          description="Based on the five love languages framework, this assessment goes deeper than the standard quiz. It maps not just how you give love, but how you need to receive it — and where the gap between those two creates the loneliness you can't explain."
          stats={{ questions: 15, dimensions: 5, minutes: 3 }}
          whatYouGet={[
            "Your primary and secondary love languages",
            "The gap between how you give and receive love",
            "Insight into your relationship communication patterns",
            "Practical steps for deeper connection",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="relative z-1 mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="mb-2 font-mono text-sm text-[#8B7B6B]">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h2 className="mb-10 font-heading text-4xl">{QUESTIONS[step].text}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.scores)}
                className="border border-brand-gold-light px-5 py-5 text-left text-lg transition-colors hover:bg-brand-gold-light/10"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && <EmailGate assessmentSlug="love-language" onUnlock={() => setEmailGated(true)} />}

      {phase === "results" && emailGated && (
        <div className="relative z-1 px-6 py-[clamp(6rem,10vw,8rem)] text-center">
          <h2 className="font-mono text-sm text-brand-gold uppercase">Your Love Language is</h2>
          <h1 className="font-heading text-6xl text-brand-gold">{ARCHETYPES[primary].name}</h1>
          <p className="mx-auto mt-5 mb-2.5 max-w-150 text-lg">{ARCHETYPES[primary].description}</p>
          <p className="mx-auto mb-12 max-w-150 text-base italic">{ARCHETYPES[primary].tips}</p>

          <div className="flex flex-wrap items-center justify-center gap-12">
            <AssessmentRadarChart scores={scores} max={chartMax} accentColor={ACCENT} />
            <div>
              <h3 className="mb-3 font-heading text-3xl">Your Languages</h3>
              <p>
                <strong>Primary:</strong> {primary}
              </p>
              <p>
                <strong>Secondary:</strong> {secondary}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl border-t border-brand-gold-light pt-8">
            <p className="mt-8 text-sm text-[#aaa]">
              This assessment is based on Dr. Gary Chapman&apos;s &quot;The 5 Love Languages®&quot; framework. It is
              intended for personal insight and is not a substitute for professional advice.
            </p>
          </div>
          <WhatsNext />
        </div>
      )}
    </div>
  );
}
