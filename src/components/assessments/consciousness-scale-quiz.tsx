"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";
import { writeVisitorState } from "@/lib/visitor-state-client";

// Ported from legacy client/src/pages/ConsciousnessScale.tsx — a real
// 25-question assessment where every answer is scored against David R.
// Hawkins' 17-level Map of Consciousness (Shame 20 through Enlightenment
// 700+), the final score being the average of all 25 answers. All 25
// questions with their real 5 scored options, all 17 real levels
// (name/emotion/threshold), `getLevel`'s exact threshold logic, and
// `getInsight`'s exact 6 tiers of real interpretive copy are ported
// unchanged and verbatim, as is the 6-month-reminder and X/LinkedIn/copy
// share functionality.
//
// Not ported: the `HERO_IMG` cinematic background
// (`/api/img/consciousness-scale-hero-v2_085e0746.jpg`) — a Manus-proxied
// asset, which CONTRIBUTING.md's Zero-Manus-Dependency rule forbids
// referencing even temporarily. No replacement image exists in Sanity yet
// and this page's scope doesn't include a Sanity upload, so the
// image-driven "60vh hero collapsing to a progress bar on question 1"
// treatment is dropped entirely in favor of the plain question-card layout
// every other assessment in this migration already uses — same
// decorative-flourish-requiring-an-unavailable-asset call already made for
// `AssessmentIntro`'s own hero-image treatment. A real hero image briefed
// for Sanity is one of this port's NEEDS.
//
// Since this assessment produces one composite score walked along a
// single 17-level scale rather than independent scored dimensions,
// `AssessmentRadarChart` doesn't apply (there's nothing to plot on
// multiple axes) — the real single-axis gauge/full-map visualization is
// ported as its own bespoke section instead. `AssessmentIntro`'s
// "Dimensions" stat is filled with the level count (17) as the closest
// honest structural analog, same kind of best-fit-under-a-fixed-label call
// as the one made on `/dharma-finder`.
//
// Every per-level color (17 known-at-build-time values) is precomposed as
// a literal Tailwind class on the level object itself (`textClass`,
// `dotClass`, `borderLeftClass`) rather than assembled from a hex fragment
// at the usage site, per this repo's "small known set of variants gets
// fully precomposed classes" rule. The scale gauge's static 5-stop
// gradient is a literal `bg-[linear-gradient(...)]` arbitrary-value class
// for the same reason. The two remaining `style={}` uses (the gauge
// marker's `left` position and the running-average dot's `background`)
// are genuinely runtime-computed values that can't be known at build
// time — the same documented exception `AssessmentIntro`'s `accentColor`
// and `nav-progress-bar.tsx`'s `width` already use.
interface Level {
  level: number;
  name: string;
  emotion: string;
  textClass: string;
  dotClass: string;
  borderLeftClass: string;
}

const LEVELS: Level[] = [
  {
    level: 20,
    name: "Shame",
    emotion: "Humiliation",
    textClass: "text-[#1a0a0a]",
    dotClass: "bg-[#1a0a0a]",
    borderLeftClass: "border-l-[#1a0a0a]",
  },
  {
    level: 30,
    name: "Guilt",
    emotion: "Blame",
    textClass: "text-[#2d1515]",
    dotClass: "bg-[#2d1515]",
    borderLeftClass: "border-l-[#2d1515]",
  },
  {
    level: 50,
    name: "Apathy",
    emotion: "Despair",
    textClass: "text-[#3d2020]",
    dotClass: "bg-[#3d2020]",
    borderLeftClass: "border-l-[#3d2020]",
  },
  {
    level: 75,
    name: "Grief",
    emotion: "Regret",
    textClass: "text-[#4a2828]",
    dotClass: "bg-[#4a2828]",
    borderLeftClass: "border-l-[#4a2828]",
  },
  {
    level: 100,
    name: "Fear",
    emotion: "Anxiety",
    textClass: "text-[#5a3030]",
    dotClass: "bg-[#5a3030]",
    borderLeftClass: "border-l-[#5a3030]",
  },
  {
    level: 125,
    name: "Desire",
    emotion: "Craving",
    textClass: "text-[#6b3a1a]",
    dotClass: "bg-[#6b3a1a]",
    borderLeftClass: "border-l-[#6b3a1a]",
  },
  {
    level: 150,
    name: "Anger",
    emotion: "Hate",
    textClass: "text-[#7a4010]",
    dotClass: "bg-[#7a4010]",
    borderLeftClass: "border-l-[#7a4010]",
  },
  {
    level: 175,
    name: "Pride",
    emotion: "Scorn",
    textClass: "text-[#8b5a1a]",
    dotClass: "bg-[#8b5a1a]",
    borderLeftClass: "border-l-[#8b5a1a]",
  },
  {
    level: 200,
    name: "Courage",
    emotion: "Affirmation",
    textClass: "text-[#3a6b30]",
    dotClass: "bg-[#3a6b30]",
    borderLeftClass: "border-l-[#3a6b30]",
  },
  {
    level: 250,
    name: "Neutrality",
    emotion: "Trust",
    textClass: "text-[#2e7a50]",
    dotClass: "bg-[#2e7a50]",
    borderLeftClass: "border-l-[#2e7a50]",
  },
  {
    level: 310,
    name: "Willingness",
    emotion: "Optimism",
    textClass: "text-[#268b5a]",
    dotClass: "bg-[#268b5a]",
    borderLeftClass: "border-l-[#268b5a]",
  },
  {
    level: 350,
    name: "Acceptance",
    emotion: "Forgiveness",
    textClass: "text-[#1e9a6a]",
    dotClass: "bg-[#1e9a6a]",
    borderLeftClass: "border-l-[#1e9a6a]",
  },
  {
    level: 400,
    name: "Reason",
    emotion: "Understanding",
    textClass: "text-[#3a6b9a]",
    dotClass: "bg-[#3a6b9a]",
    borderLeftClass: "border-l-[#3a6b9a]",
  },
  {
    level: 500,
    name: "Love",
    emotion: "Reverence",
    textClass: "text-[#5a4aaa]",
    dotClass: "bg-[#5a4aaa]",
    borderLeftClass: "border-l-[#5a4aaa]",
  },
  {
    level: 540,
    name: "Joy",
    emotion: "Serenity",
    textClass: "text-[#7a5acc]",
    dotClass: "bg-[#7a5acc]",
    borderLeftClass: "border-l-[#7a5acc]",
  },
  {
    level: 600,
    name: "Peace",
    emotion: "Bliss",
    textClass: "text-[#9a6aee]",
    dotClass: "bg-[#9a6aee]",
    borderLeftClass: "border-l-[#9a6aee]",
  },
  {
    level: 700,
    name: "Enlightenment",
    emotion: "Ineffable",
    textClass: "text-[#d4b96a]",
    dotClass: "bg-[#d4b96a]",
    borderLeftClass: "border-l-[#d4b96a]",
  },
];

interface Option {
  text: string;
  score: number;
}
interface Question {
  id: number;
  text: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Someone you love is in pain you cannot fix. You sit with them. What is actually happening inside you?",
    options: [
      { text: "A quiet desperation — I need to do something or I'll fall apart", score: 100 },
      { text: "Frustration that I can't solve it, and guilt about the frustration", score: 150 },
      {
        text: "Discomfort I manage by staying busy, offering advice, changing the subject",
        score: 200,
      },
      { text: "I can be present with their pain without needing it to stop", score: 500 },
      {
        text: "Their pain and my presence become the same thing — there is no separation",
        score: 600,
      },
    ],
  },
  {
    id: 2,
    text: "You are given irrefutable evidence that a core belief you've held for 20 years is factually wrong. Your first honest response is:",
    options: [
      { text: "Find the flaw in the evidence — the belief must be right", score: 175 },
      { text: "Anger at whoever let me believe this for so long", score: 150 },
      { text: "Embarrassment, then reluctant acceptance", score: 250 },
      { text: "Genuine curiosity about what else might need updating", score: 400 },
      { text: "Relief — the map was never the territory anyway", score: 540 },
    ],
  },
  {
    id: 3,
    text: "You have done something you are genuinely ashamed of. No one will ever find out. What do you do with that?",
    options: [
      { text: "Bury it — what they don't know won't hurt them", score: 75 },
      { text: "Rationalize it until the shame dissolves", score: 175 },
      { text: "Carry it quietly and let it make me more careful", score: 250 },
      { text: "Find a way to make amends, even indirectly", score: 350 },
      { text: "Use it as a precise instrument for understanding my own shadow", score: 500 },
    ],
  },
  {
    id: 4,
    text: "You are at a dinner party. Someone says something confidently wrong about a topic you know deeply. You:",
    options: [
      { text: "Correct them immediately and thoroughly", score: 175 },
      { text: "Say nothing — conflict isn't worth it", score: 200 },
      { text: "Wait for the right moment and offer a gentle alternative", score: 310 },
      { text: "Ask a question that lets them discover the gap themselves", score: 400 },
      { text: "Get curious about what experience led them to that conclusion", score: 500 },
    ],
  },
  {
    id: 5,
    text: "Think of the person who has caused you the most harm in your life. Right now, what is the most honest thing you feel toward them?",
    options: [
      { text: "Rage, or a cold hatred I've learned to live with", score: 150 },
      { text: "Bitterness I've mostly suppressed but it surfaces sometimes", score: 175 },
      { text: "Indifference — I've moved on, they're irrelevant", score: 250 },
      { text: "Something like pity — they were clearly in pain themselves", score: 400 },
      {
        text: "Genuine compassion, and something close to gratitude for what it forced me to become",
        score: 540,
      },
    ],
  },
  {
    id: 6,
    text: "You have one hour completely alone with no obligations, no phone, no entertainment. What actually happens?",
    options: [
      { text: "Restlessness, then anxiety — I reach for something to fill it", score: 125 },
      { text: "I make a list, plan something, stay productive", score: 250 },
      { text: "I enjoy it but feel vaguely guilty about not being useful", score: 310 },
      { text: "I settle into it — stillness feels like home", score: 540 },
      { text: "The hour disappears into something I can't fully describe", score: 700 },
    ],
  },
  {
    id: 7,
    text: "A stranger is rude to you for no apparent reason. An hour later, what are you still doing with it?",
    options: [
      { text: "Replaying it, building the argument I should have made", score: 150 },
      { text: "Still irritated, trying to let it go", score: 175 },
      { text: "It's gone — I decided it wasn't about me", score: 250 },
      { text: "I found myself wondering what was happening in their day", score: 400 },
      {
        text: "It barely registered — I was more interested in what it revealed about my reaction",
        score: 500,
      },
    ],
  },
  {
    id: 8,
    text: "You are about to make a major decision. How do you know when you've found the right answer?",
    options: [
      { text: "When the fear of the wrong choice outweighs the fear of the right one", score: 100 },
      { text: "When I've consulted enough people that I feel covered", score: 200 },
      { text: "When I've analyzed every angle and the logic is airtight", score: 400 },
      { text: "When something in my body settles — a kind of quiet certainty", score: 500 },
      { text: "The question dissolves — the decision was always already made", score: 600 },
    ],
  },
  {
    id: 9,
    text: "You witness a system — a company, an institution, a government — doing something you believe is deeply wrong. What is your honest response?",
    options: [
      { text: "Helpless rage — what can one person do", score: 150 },
      { text: "Cynicism — they're all like that, nothing changes", score: 175 },
      { text: "I document it, tell people, try to create accountability", score: 310 },
      {
        text: "I look for the leverage point where a small action creates outsized change",
        score: 400,
      },
      { text: "I ask what in me is capable of the same thing, and start there", score: 540 },
    ],
  },
  {
    id: 10,
    text: "Someone you respect deeply disagrees with you on something you care about. The conversation ends without resolution. What stays with you?",
    options: [
      { text: "The need to convince them — I'll find the right argument eventually", score: 175 },
      { text: "Doubt about whether I'm actually right", score: 200 },
      { text: "Appreciation that they pushed me to think harder", score: 350 },
      { text: "Genuine curiosity about the experience that shaped their view", score: 400 },
      {
        text: "A kind of love for the fact that two people can see the same world so differently",
        score: 540,
      },
    ],
  },
  {
    id: 11,
    text: "You are given everything you have ever wanted. Six months later, what is the most honest thing you feel?",
    options: [
      { text: "Relief, then a creeping awareness that something is still missing", score: 250 },
      { text: "Happiness, but I'm already thinking about the next thing", score: 175 },
      { text: "Gratitude, and a growing desire to give some of it away", score: 400 },
      {
        text: "A quiet recognition that the wanting was always more interesting than the having",
        score: 500,
      },
      {
        text: "The question becomes irrelevant — wanting and having were never the point",
        score: 600,
      },
    ],
  },
  {
    id: 12,
    text: "You are dying. You have one week. The people around you are in grief. What is your primary concern?",
    options: [
      { text: "Terror — I'm not ready, there's too much undone", score: 100 },
      { text: "Regret about specific things I didn't do or say", score: 150 },
      { text: "Making sure the people I love will be okay without me", score: 310 },
      { text: "Being as present as possible for every remaining moment", score: 500 },
      { text: "Curiosity about what comes next, and gratitude for what was", score: 600 },
    ],
  },
  {
    id: 13,
    text: "A child asks you: 'Why do bad things happen to good people?' You answer honestly. What do you say?",
    options: [
      { text: "I don't know — and that uncertainty frightens me too", score: 200 },
      { text: "Because the world is unfair and you have to be tough", score: 150 },
      { text: "Because 'good' and 'bad' are categories we impose on what just is", score: 400 },
      { text: "Because suffering is often the only thing strong enough to open us", score: 500 },
      { text: "I sit with them in the question instead of answering it", score: 600 },
    ],
  },
  {
    id: 14,
    text: "You have worked on something for years. It fails completely and publicly. What is the first thing you do?",
    options: [
      { text: "Figure out who or what to blame", score: 150 },
      { text: "Disappear until the shame passes", score: 75 },
      { text: "Analyze what went wrong so I never repeat it", score: 350 },
      { text: "Grieve it properly, then ask what it was trying to teach me", score: 500 },
      { text: "Notice that my identity was never actually attached to the outcome", score: 600 },
    ],
  },
  {
    id: 15,
    text: "You are in a room with someone whose worldview you find genuinely repugnant. Not dangerous — just deeply wrong to you. What do you actually feel?",
    options: [
      { text: "Contempt I try to hide", score: 175 },
      { text: "Discomfort and a strong desire to leave or change the subject", score: 200 },
      { text: "Curiosity about how a person arrives at that view", score: 350 },
      { text: "Compassion for whatever fear or wound is underneath it", score: 500 },
      {
        text: "Recognition that I contain the same capacity — just differently expressed",
        score: 600,
      },
    ],
  },
  {
    id: 16,
    text: "You wake at 3am with a thought that won't let go. It's about something you can't control. What happens next?",
    options: [
      { text: "I spiral — one thought pulls the next until morning", score: 100 },
      { text: "I get up and do something productive to outrun it", score: 200 },
      { text: "I talk myself through it logically until it quiets", score: 350 },
      { text: "I breathe into it and watch it change shape", score: 500 },
      { text: "I notice the noticer — the one watching the thought — and rest there", score: 700 },
    ],
  },
  {
    id: 17,
    text: "Someone gives you a gift you don't want and will never use. They are watching your face. What actually happens?",
    options: [
      { text: "I perform gratitude convincingly — it's the kind thing to do", score: 200 },
      { text: "I feel irritated that they don't know me better", score: 150 },
      { text: "I feel genuine warmth for the intention, separate from the object", score: 400 },
      {
        text: "The gift becomes interesting — what does it reveal about how they see me?",
        score: 500,
      },
      {
        text: "The gap between what was given and what was received becomes a kind of koan",
        score: 600,
      },
    ],
  },
  {
    id: 18,
    text: "You are asked to describe yourself in three words to someone who will never meet you. What do you actually write?",
    options: [
      { text: "Words that make me sound good — I edit for impression", score: 175 },
      { text: "Words I aspire to, not necessarily what I am today", score: 200 },
      { text: "The most honest words I can find, even the unflattering ones", score: 350 },
      {
        text: "I notice I can't — the self that would choose the words keeps changing",
        score: 500,
      },
      {
        text: "I write nothing — the question assumes a fixed self that doesn't exist",
        score: 700,
      },
    ],
  },
  {
    id: 19,
    text: "You have been sitting in silence for 20 minutes. A thought arises: 'I'm wasting time.' What do you do with it?",
    options: [
      { text: "Agree with it and stop", score: 125 },
      { text: "Fight it — I'm supposed to be clearing my mind", score: 200 },
      { text: "Note it and return to the breath", score: 350 },
      { text: "Get curious about where the urgency comes from", score: 400 },
      {
        text: "Recognize it as just another cloud — and notice the sky it moves through",
        score: 700,
      },
    ],
  },
  {
    id: 20,
    text: "You are asked to help someone who has repeatedly refused your help before. What is the honest texture of your response?",
    options: [
      { text: "Resentment — why should I, after last time", score: 150 },
      { text: "Obligation mixed with exhaustion", score: 200 },
      { text: "Willingness, but I set a clear limit this time", score: 310 },
      { text: "Genuine care, with no attachment to whether they accept it", score: 500 },
      {
        text: "The history between us becomes irrelevant — this moment is its own thing",
        score: 600,
      },
    ],
  },
  {
    id: 21,
    text: "You are given proof that consciousness survives death. Your first honest reaction is:",
    options: [
      { text: "Relief — I was terrified of oblivion", score: 100 },
      { text: "Skepticism — I need more proof than that", score: 400 },
      { text: "Curiosity about what that means for how I live now", score: 350 },
      { text: "A quiet 'of course' — something in me already knew", score: 540 },
      {
        text: "The question loses its urgency — I was never fully identified with the body anyway",
        score: 700,
      },
    ],
  },
  {
    id: 22,
    text: "You are in a conversation and realize the other person isn't really listening — they're waiting to speak. What do you do?",
    options: [
      { text: "Match their energy — I stop really listening too", score: 175 },
      { text: "Feel hurt and withdraw", score: 100 },
      { text: "Finish my thought and let the conversation find its level", score: 250 },
      { text: "Get curious about what they're so eager to say", score: 400 },
      {
        text: "Slow down and create more space — sometimes people need to be heard before they can hear",
        score: 500,
      },
    ],
  },
  {
    id: 23,
    text: "You have achieved something significant. The recognition you receive is far less than you felt it deserved. What happens inside you?",
    options: [
      { text: "Bitterness — the world doesn't see what I actually did", score: 150 },
      { text: "Disappointment I try to reframe as 'it doesn't matter'", score: 200 },
      { text: "I note the gap and use it to recalibrate my expectations", score: 350 },
      { text: "The work was the point — the recognition was always secondary", score: 500 },
      {
        text: "I notice I was watching for recognition, and that observation is more interesting than the recognition itself",
        score: 600,
      },
    ],
  },
  {
    id: 24,
    text: "You are asked to describe what love is to someone who has never experienced it. You think for a moment. What do you say?",
    options: [
      { text: "A feeling of safety and being chosen", score: 175 },
      { text: "Wanting the best for someone even when it costs you", score: 310 },
      { text: "The complete absence of the need to change the other person", score: 500 },
      {
        text: "The recognition of yourself in another — and the dissolution of the boundary between you",
        score: 540,
      },
      {
        text: "You sit in silence for a while, then say: it's what's left when everything else is removed",
        score: 700,
      },
    ],
  },
  {
    id: 25,
    text: "If your life were a message — not what you intended it to be, but what it actually is — what would it say?",
    options: [
      { text: "I survived. I kept going. That's enough.", score: 200 },
      { text: "I built things. I left marks. I mattered.", score: 250 },
      { text: "I tried to understand. I kept asking questions.", score: 400 },
      { text: "I loved imperfectly and kept trying to love better.", score: 500 },
      { text: "I was here. Fully. And that was everything.", score: 600 },
    ],
  },
];

function getLevel(score: number): Level {
  let result = LEVELS[0];
  for (const l of LEVELS) {
    if (score >= l.level) result = l;
  }
  return result;
}

function getInsight(score: number): string {
  if (score < 100)
    return "You are in the territory of Shame and Guilt — the densest, most contracted states on the map. This is not a verdict. It is a location. The fact that you answered honestly is itself an act of Courage (200), which is the first level where energy begins to expand rather than collapse. The distance from here to there is not as far as it feels. It begins with one honest conversation — usually with yourself.";
  if (score < 200)
    return "You are operating primarily from Fear, Desire, Anger, or Pride — states where energy is consumed by survival, craving, defense, or the need to be right. These are not character flaws. They are evolutionary programs running on hardware that hasn't been updated. The critical threshold is Courage (200), where you stop fighting life and start engaging it. You are close. The awareness you brought to this assessment is already moving you there.";
  if (score < 310)
    return "You have crossed the threshold of Courage (200) — the dividing line between energy that depletes and energy that empowers. You are in the zone of active engagement: managing, coping, building. The invitation from here is to move from managing your inner life to being curious about it. Willingness (310) is the next gate — the willingness to be changed by what you encounter, not just to survive it.";
  if (score < 500)
    return "You operate from Willingness, Acceptance, and Reason — the realm of genuine engagement, forgiveness, and intellectual clarity. You see systems, patterns, and root causes. You have learned to hold complexity without collapsing it. The invitation from here is to move from understanding to embodiment — from knowing about love to being it. The head has done extraordinary work. The heart is asking for the next shift.";
  if (score < 600)
    return "You are touching the frequencies of Love and Joy — states where the personal begins to dissolve into something larger. At this level, you don't just understand compassion, you radiate it. People feel different in your presence without knowing why. The Hawkins research suggests that one person calibrating at 500 counterbalances 750,000 people below 200. Your consciousness is not a private matter. It is a form of service.";
  return "You are accessing states of Peace and beyond — where the question of purpose becomes irrelevant because you are the answer. Where doing arises from being. Where the self that was asking the questions has become transparent to something larger. This is rare territory. The only instruction from here is to keep going — and to help others find their way to the threshold.";
}

const ACCENT = "#8B6914";

type Phase = "landing" | "quiz" | "results";

export function ConsciousnessScaleQuiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reminderSet, setReminderSet] = useState(false);
  const { markComplete } = useJourneyProgress();

  const currentQ = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  // Running average of every answer given so far — doubles as the live
  // in-quiz indicator and, once all 25 are answered, the final score.
  const runningScore = useMemo(() => {
    const scores = Object.values(answers);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [answers]);
  const liveLevel = runningScore > 0 ? getLevel(runningScore) : null;

  const handleSelect = useCallback(
    (score: number) => {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: score }));
    },
    [currentQ],
  );

  const goNext = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setPhase("results");
      markComplete("find-your-level");
    }
  }, [currentQuestion, markComplete]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
  }, [currentQuestion]);

  const handleSetReminder = useCallback(() => {
    const sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    void writeVisitorState("assessment-results", {
      consciousnessReminderAt: sixMonths.toISOString(),
    })
      .then(() => setReminderSet(true))
      .catch(() => undefined);
  }, []);

  const handleShare = useCallback(
    (platform: "x" | "linkedin" | "copy") => {
      const level = getLevel(runningScore);
      const url = "https://tonygreenberg.com/consciousness-scale";
      const text = `I calibrated at ${runningScore} on the Hawkins Map of Consciousness — ${level.name}. Where do you land?`;
      if (platform === "x") {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
      } else if (platform === "linkedin") {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
      } else {
        navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
      }
    },
    [runningScore],
  );

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="ecosystem" />
        <AssessmentIntro
          title="Consciousness Scale"
          subtitle="Where you are on a Tuesday at 2pm — not who you aspire to be."
          description="25 questions inspired by David R. Hawkins' Map of Consciousness. Each one requires at least a minute of honest reflection. This isn't a personality test — it's a calibration of how you actually show up under pressure, in grief, in silence, and in the ordinary moments nobody's watching."
          stats={{ questions: QUESTIONS.length, dimensions: LEVELS.length, minutes: 12 }}
          whatYouGet={[
            "Your calibrated score on the 20–700+ Hawkins scale",
            "Your current level, from Shame to Enlightenment",
            "A real, level-specific reading of what it means and what's next",
            "The full 17-level map, with your position marked",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("quiz")}
        />
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="relative z-1 flex min-h-screen flex-col font-sans text-[#2C1810]">
        <ThemedBackground theme="ecosystem" />

        <div className="fixed inset-x-0 top-0 z-50">
          <div className="h-[3px] bg-brand-gold/10">
            <div
              className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between px-6 py-3 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
            <button onClick={() => setPhase("landing")}>
              <BackIcon aria-hidden="true" /> EXIT
            </button>
            <span>
              {currentQuestion + 1} / {QUESTIONS.length}
            </span>
          </div>
          {liveLevel && Object.keys(answers).length > 0 && (
            <div className="flex flex-wrap items-center gap-3 bg-[#0A0A10] px-6 py-2 sm:px-10">
              <span className="font-mono text-[0.55rem] tracking-[0.15em] text-[#888] uppercase">
                Running average
              </span>
              <span className={`inline-block size-2 rounded-full ${liveLevel.dotClass}`} />
              <span className="font-mono text-[0.7rem] text-brand-gold-light">
                {runningScore} — {liveLevel.name}
              </span>
              <span className="font-mono text-[0.55rem] text-[#666]">
                {Object.keys(answers).length} of {QUESTIONS.length} answered
              </span>
            </div>
          )}
        </div>

        <div className="relative z-1 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pt-28 pb-12">
          <p className="mb-6 font-mono text-[0.65rem] tracking-[0.2em] text-[#8B7B6B] uppercase">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
          <h3 className="mb-8 font-heading text-[clamp(1.2rem,2.2vw,1.6rem)] leading-[1.5] font-normal">
            {currentQ.text}
          </h3>

          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt.score;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.score)}
                  className={`rounded-sm border border-l-4 px-5 py-4 text-left text-[1rem] leading-relaxed transition-all ${
                    isSelected
                      ? "border-[#0A0A10] border-l-brand-gold-light bg-[#0A0A10] text-[#F5F0E0]"
                      : "border-black/10 border-l-transparent bg-white/50 text-[#333]"
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentQuestion === 0}
              className="font-mono text-[0.7rem] tracking-[0.15em] text-[#4A3A2A] uppercase disabled:cursor-default disabled:text-[#B8A898]"
            >
              Previous
            </button>
            <button
              onClick={goNext}
              disabled={!answers[currentQ.id]}
              className={`rounded-sm px-7 py-2.5 font-mono text-[0.7rem] tracking-[0.15em] uppercase transition-colors ${
                answers[currentQ.id]
                  ? "bg-brand-gold text-[#F5F0E0]"
                  : "cursor-default bg-black/10 text-[#aaa]"
              }`}
            >
              {currentQuestion === QUESTIONS.length - 1 ? "See My Level" : "Next"}
            </button>
          </div>
        </div>

        <div className="border-t border-brand-gold/10 px-6 py-6 text-center">
          <p className="font-mono text-[0.65rem] tracking-[0.1em] text-[#9B8B7B]">
            Based on David R. Hawkins&apos; <em>Power vs. Force</em> (1995) · Curated by Tony
            Greenberg
          </p>
        </div>
      </div>
    );
  }

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="ecosystem" />
        <EmailGate assessmentSlug="consciousness-scale" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  const totalScore = runningScore;
  const level = getLevel(totalScore);
  const scalePercent = Math.min(100, (totalScore / 700) * 100);

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="ecosystem" />

      <div className="bg-[#0A0A10] px-6 pt-12 pb-8 text-center sm:px-16">
        <p className="mb-2 font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold-light uppercase">
          Your Calibration
        </p>
        <div
          className={`font-heading text-[clamp(4rem,10vw,7rem)] leading-none ${level.textClass}`}
        >
          {totalScore}
        </div>
        <div className="mt-2 font-heading text-[clamp(1.5rem,3vw,2rem)] text-[#F5F0E0]">
          {level.name}
        </div>
        <div className="mt-1 font-mono text-[0.75rem] tracking-[0.15em] text-[#999]">
          {level.emotion}
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-2 flex justify-between font-mono text-[0.6rem] text-[#8B7B6B]">
          <span>20</span>
          <span className="font-semibold text-brand-gold">You: {totalScore}</span>
          <span>700+</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,#2d1515,#7a4010,#3a6b30,#5a4aaa,#d4b96a)]">
          <div
            className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#0A0A10] bg-[#FAFAF7] shadow-[0_0_0_2px_#D4B96A]"
            style={{ left: `${scalePercent}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[0.55rem] text-[#9B8B7B]">
          <span>Shame</span>
          <span>Courage 200</span>
          <span>Love 500</span>
          <span>Enlightenment</span>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-4 font-heading text-2xl font-normal">What This Means</h2>
        <p className="text-[1.05rem] leading-[1.85] text-[#333]">{getInsight(totalScore)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-sm bg-brand-gold/8 p-6">
          <p className="mb-4 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold uppercase">
            Share Your Level
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleShare("x")}
              className="rounded-sm bg-[#0A0A10] px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-[#F5F0E0]"
            >
              Post on X
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="rounded-sm bg-[#0077b5] px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-[#F5F0E0]"
            >
              Share on LinkedIn
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="rounded-sm border border-brand-gold px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-brand-gold"
            >
              Copy Link
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-sm bg-[#0A0A10] p-6 text-[#F5F0E0]">
          <p className="mb-3 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold-light uppercase">
            Take It Again in 6 Months
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.7] text-[#ccc]">
            David Hawkins noted that consciousness levels rarely shift quickly — but they do shift.
            The movement matters more than the number. Save your score today and return in six
            months to see what has changed.
          </p>
          {reminderSet ? (
            <p className="font-mono text-[0.75rem] text-brand-gold-light">
              Reminder saved. Come back in 6 months.
            </p>
          ) : (
            <button
              onClick={handleSetReminder}
              className="rounded-sm bg-brand-gold px-6 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-[#F5F0E0]"
            >
              Save My Score ({totalScore} — {level.name})
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-4 font-heading text-2xl font-normal">The Full Map</h2>
        <div className="grid gap-0.5">
          {[...LEVELS].reverse().map((l) => {
            const isYou = l.name === level.name;
            return (
              <div
                key={l.level}
                className={`flex items-center gap-3 rounded-sm border-l-[3px] px-3 py-2.5 ${isYou ? `bg-[#0A0A10] ${l.borderLeftClass}` : "border-l-transparent"}`}
              >
                <span
                  className={`w-12 shrink-0 font-mono text-[0.7rem] ${isYou ? "text-brand-gold-light" : "text-[#999]"}`}
                >
                  {l.level}
                </span>
                <span
                  className={`flex-1 text-[0.95rem] ${isYou ? "font-semibold text-[#F5F0E0]" : "text-[#555]"}`}
                >
                  {l.name}
                </span>
                <span
                  className={`font-mono text-[0.7rem] ${isYou ? "text-brand-gold-light" : "text-[#aaa]"}`}
                >
                  {l.emotion}
                </span>
                {isYou && (
                  <span className="font-mono text-[0.6rem] text-brand-gold-light">
                    <BackIcon aria-hidden="true" /> you
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-sm bg-[#0A0A10] p-8 text-[#F5F0E0]">
          <p className="mb-4 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold-light uppercase">
            Tony&apos;s Note
          </p>
          <p className="text-[1.05rem] leading-[1.85] text-[#ccc]">
            David R. Hawkins spent decades mapping human consciousness using applied kinesiology and
            clinical observation. His scale is logarithmic — the difference between 200 and 300 is
            not 100 points, it is an order of magnitude of energetic force. Most of humanity
            calibrates between 150 and 250. The critical threshold is 200 (Courage), where you shift
            from force to power, from taking to giving, from contraction to expansion. The questions
            in this assessment are designed to reveal your actual operating level, not your
            aspirational one. The most common mistake is answering who you want to be. The most
            useful thing is answering who you are on a Tuesday at 2pm when nothing is going your
            way.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <JourneyTracker variant="light" currentAssessmentId="find-your-level" />
      </section>

      <section className="mx-auto flex max-w-3xl flex-wrap gap-4 px-6 pb-12">
        <Link
          href="/psychedelic-readiness-index"
          className="rounded-sm border border-brand-gold px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.12em] text-brand-gold uppercase"
        >
          Psychedelic Readiness Index <ForwardIcon aria-hidden="true" />
        </Link>
        <Link
          href="/facilitator-index"
          className="rounded-sm border border-black/20 px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.12em] text-[#666] uppercase"
        >
          Find a Facilitator <ForwardIcon aria-hidden="true" />
        </Link>
        <Link
          href="/start-here"
          className="rounded-sm border border-black/20 px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.12em] text-[#666] uppercase"
        >
          Start Here <ForwardIcon aria-hidden="true" />
        </Link>
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <AssessmentResultActions accentColor={ACCENT} resultSlug="consciousness-scale" />
        <button
          onClick={() => {
            setPhase("landing");
            setEmailGated(false);
            setCurrentQuestion(0);
            setAnswers({});
            setReminderSet(false);
          }}
          className="rounded-sm border border-brand-gold/40 px-8 py-3 font-mono text-[0.75rem] tracking-[0.15em] text-brand-gold uppercase"
        >
          Retake Assessment
        </button>
      </section>

      <footer className="border-t border-brand-gold/8 px-6 py-8 text-center">
        <p className="font-mono text-[0.65rem] tracking-[0.1em] text-[#8B7B6B]">
          Based on David R. Hawkins&apos; <em>Power vs. Force</em> (1995) · Curated by Tony
          Greenberg
        </p>
      </footer>
    </div>
  );
}
