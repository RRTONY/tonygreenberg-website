import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Section, Divider, FadeIn } from "@/components/Editorial";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

const HERO_IMG = "/api/img/consciousness-scale-hero-v2_085e0746.jpg";

/* ── Hawkins Map of Consciousness Levels ── */
const LEVELS = [
  { level: 20,  name: "Shame",         emotion: "Humiliation", color: "#1a0a0a" },
  { level: 30,  name: "Guilt",         emotion: "Blame",       color: "#2d1515" },
  { level: 50,  name: "Apathy",        emotion: "Despair",     color: "#3d2020" },
  { level: 75,  name: "Grief",         emotion: "Regret",      color: "#4a2828" },
  { level: 100, name: "Fear",          emotion: "Anxiety",     color: "#5a3030" },
  { level: 125, name: "Desire",        emotion: "Craving",     color: "#6b3a1a" },
  { level: 150, name: "Anger",         emotion: "Hate",        color: "#7a4010" },
  { level: 175, name: "Pride",         emotion: "Scorn",       color: "#8b5a1a" },
  { level: 200, name: "Courage",       emotion: "Affirmation", color: "#3a6b30" },
  { level: 250, name: "Neutrality",    emotion: "Trust",       color: "#2e7a50" },
  { level: 310, name: "Willingness",   emotion: "Optimism",    color: "#268b5a" },
  { level: 350, name: "Acceptance",    emotion: "Forgiveness", color: "#1e9a6a" },
  { level: 400, name: "Reason",        emotion: "Understanding", color: "#3a6b9a" },
  { level: 500, name: "Love",          emotion: "Reverence",   color: "#5a4aaa" },
  { level: 540, name: "Joy",           emotion: "Serenity",    color: "#7a5acc" },
  { level: 600, name: "Peace",         emotion: "Bliss",       color: "#9a6aee" },
  { level: 700, name: "Enlightenment", emotion: "Ineffable",   color: "#d4b96a" },
];

/* ── 25 Deep Questions — each requires at least a minute of honest reflection ── */
const QUESTIONS = [
  { id: 1, text: "Someone you love is in pain you cannot fix. You sit with them. What is actually happening inside you?", options: [
    { text: "A quiet desperation — I need to do something or I'll fall apart", score: 100 },
    { text: "Frustration that I can't solve it, and guilt about the frustration", score: 150 },
    { text: "Discomfort I manage by staying busy, offering advice, changing the subject", score: 200 },
    { text: "I can be present with their pain without needing it to stop", score: 500 },
    { text: "Their pain and my presence become the same thing — there is no separation", score: 600 },
  ]},
  { id: 2, text: "You are given irrefutable evidence that a core belief you've held for 20 years is factually wrong. Your first honest response is:", options: [
    { text: "Find the flaw in the evidence — the belief must be right", score: 175 },
    { text: "Anger at whoever let me believe this for so long", score: 150 },
    { text: "Embarrassment, then reluctant acceptance", score: 250 },
    { text: "Genuine curiosity about what else might need updating", score: 400 },
    { text: "Relief — the map was never the territory anyway", score: 540 },
  ]},
  { id: 3, text: "You have done something you are genuinely ashamed of. No one will ever find out. What do you do with that?", options: [
    { text: "Bury it — what they don't know won't hurt them", score: 75 },
    { text: "Rationalize it until the shame dissolves", score: 175 },
    { text: "Carry it quietly and let it make me more careful", score: 250 },
    { text: "Find a way to make amends, even indirectly", score: 350 },
    { text: "Use it as a precise instrument for understanding my own shadow", score: 500 },
  ]},
  { id: 4, text: "You are at a dinner party. Someone says something confidently wrong about a topic you know deeply. You:", options: [
    { text: "Correct them immediately and thoroughly", score: 175 },
    { text: "Say nothing — conflict isn't worth it", score: 200 },
    { text: "Wait for the right moment and offer a gentle alternative", score: 310 },
    { text: "Ask a question that lets them discover the gap themselves", score: 400 },
    { text: "Get curious about what experience led them to that conclusion", score: 500 },
  ]},
  { id: 5, text: "Think of the person who has caused you the most harm in your life. Right now, what is the most honest thing you feel toward them?", options: [
    { text: "Rage, or a cold hatred I've learned to live with", score: 150 },
    { text: "Bitterness I've mostly suppressed but it surfaces sometimes", score: 175 },
    { text: "Indifference — I've moved on, they're irrelevant", score: 250 },
    { text: "Something like pity — they were clearly in pain themselves", score: 400 },
    { text: "Genuine compassion, and something close to gratitude for what it forced me to become", score: 540 },
  ]},
  { id: 6, text: "You have one hour completely alone with no obligations, no phone, no entertainment. What actually happens?", options: [
    { text: "Restlessness, then anxiety — I reach for something to fill it", score: 125 },
    { text: "I make a list, plan something, stay productive", score: 250 },
    { text: "I enjoy it but feel vaguely guilty about not being useful", score: 310 },
    { text: "I settle into it — stillness feels like home", score: 540 },
    { text: "The hour disappears into something I can't fully describe", score: 700 },
  ]},
  { id: 7, text: "A stranger is rude to you for no apparent reason. An hour later, what are you still doing with it?", options: [
    { text: "Replaying it, building the argument I should have made", score: 150 },
    { text: "Still irritated, trying to let it go", score: 175 },
    { text: "It's gone — I decided it wasn't about me", score: 250 },
    { text: "I found myself wondering what was happening in their day", score: 400 },
    { text: "It barely registered — I was more interested in what it revealed about my reaction", score: 500 },
  ]},
  { id: 8, text: "You are about to make a major decision. How do you know when you've found the right answer?", options: [
    { text: "When the fear of the wrong choice outweighs the fear of the right one", score: 100 },
    { text: "When I've consulted enough people that I feel covered", score: 200 },
    { text: "When I've analyzed every angle and the logic is airtight", score: 400 },
    { text: "When something in my body settles — a kind of quiet certainty", score: 500 },
    { text: "The question dissolves — the decision was always already made", score: 600 },
  ]},
  { id: 9, text: "You witness a system — a company, an institution, a government — doing something you believe is deeply wrong. What is your honest response?", options: [
    { text: "Helpless rage — what can one person do", score: 150 },
    { text: "Cynicism — they're all like that, nothing changes", score: 175 },
    { text: "I document it, tell people, try to create accountability", score: 310 },
    { text: "I look for the leverage point where a small action creates outsized change", score: 400 },
    { text: "I ask what in me is capable of the same thing, and start there", score: 540 },
  ]},
  { id: 10, text: "Someone you respect deeply disagrees with you on something you care about. The conversation ends without resolution. What stays with you?", options: [
    { text: "The need to convince them — I'll find the right argument eventually", score: 175 },
    { text: "Doubt about whether I'm actually right", score: 200 },
    { text: "Appreciation that they pushed me to think harder", score: 350 },
    { text: "Genuine curiosity about the experience that shaped their view", score: 400 },
    { text: "A kind of love for the fact that two people can see the same world so differently", score: 540 },
  ]},
  { id: 11, text: "You are given everything you have ever wanted. Six months later, what is the most honest thing you feel?", options: [
    { text: "Relief, then a creeping awareness that something is still missing", score: 250 },
    { text: "Happiness, but I'm already thinking about the next thing", score: 175 },
    { text: "Gratitude, and a growing desire to give some of it away", score: 400 },
    { text: "A quiet recognition that the wanting was always more interesting than the having", score: 500 },
    { text: "The question becomes irrelevant — wanting and having were never the point", score: 600 },
  ]},
  { id: 12, text: "You are dying. You have one week. The people around you are in grief. What is your primary concern?", options: [
    { text: "Terror — I'm not ready, there's too much undone", score: 100 },
    { text: "Regret about specific things I didn't do or say", score: 150 },
    { text: "Making sure the people I love will be okay without me", score: 310 },
    { text: "Being as present as possible for every remaining moment", score: 500 },
    { text: "Curiosity about what comes next, and gratitude for what was", score: 600 },
  ]},
  { id: 13, text: "A child asks you: 'Why do bad things happen to good people?' You answer honestly. What do you say?", options: [
    { text: "I don't know — and that uncertainty frightens me too", score: 200 },
    { text: "Because the world is unfair and you have to be tough", score: 150 },
    { text: "Because 'good' and 'bad' are categories we impose on what just is", score: 400 },
    { text: "Because suffering is often the only thing strong enough to open us", score: 500 },
    { text: "I sit with them in the question instead of answering it", score: 600 },
  ]},
  { id: 14, text: "You have worked on something for years. It fails completely and publicly. What is the first thing you do?", options: [
    { text: "Figure out who or what to blame", score: 150 },
    { text: "Disappear until the shame passes", score: 75 },
    { text: "Analyze what went wrong so I never repeat it", score: 350 },
    { text: "Grieve it properly, then ask what it was trying to teach me", score: 500 },
    { text: "Notice that my identity was never actually attached to the outcome", score: 600 },
  ]},
  { id: 15, text: "You are in a room with someone whose worldview you find genuinely repugnant. Not dangerous — just deeply wrong to you. What do you actually feel?", options: [
    { text: "Contempt I try to hide", score: 175 },
    { text: "Discomfort and a strong desire to leave or change the subject", score: 200 },
    { text: "Curiosity about how a person arrives at that view", score: 350 },
    { text: "Compassion for whatever fear or wound is underneath it", score: 500 },
    { text: "Recognition that I contain the same capacity — just differently expressed", score: 600 },
  ]},
  { id: 16, text: "You wake at 3am with a thought that won't let go. It's about something you can't control. What happens next?", options: [
    { text: "I spiral — one thought pulls the next until morning", score: 100 },
    { text: "I get up and do something productive to outrun it", score: 200 },
    { text: "I talk myself through it logically until it quiets", score: 350 },
    { text: "I breathe into it and watch it change shape", score: 500 },
    { text: "I notice the noticer — the one watching the thought — and rest there", score: 700 },
  ]},
  { id: 17, text: "Someone gives you a gift you don't want and will never use. They are watching your face. What actually happens?", options: [
    { text: "I perform gratitude convincingly — it's the kind thing to do", score: 200 },
    { text: "I feel irritated that they don't know me better", score: 150 },
    { text: "I feel genuine warmth for the intention, separate from the object", score: 400 },
    { text: "The gift becomes interesting — what does it reveal about how they see me?", score: 500 },
    { text: "The gap between what was given and what was received becomes a kind of koan", score: 600 },
  ]},
  { id: 18, text: "You are asked to describe yourself in three words to someone who will never meet you. What do you actually write?", options: [
    { text: "Words that make me sound good — I edit for impression", score: 175 },
    { text: "Words I aspire to, not necessarily what I am today", score: 200 },
    { text: "The most honest words I can find, even the unflattering ones", score: 350 },
    { text: "I notice I can't — the self that would choose the words keeps changing", score: 500 },
    { text: "I write nothing — the question assumes a fixed self that doesn't exist", score: 700 },
  ]},
  { id: 19, text: "You have been sitting in silence for 20 minutes. A thought arises: 'I'm wasting time.' What do you do with it?", options: [
    { text: "Agree with it and stop", score: 125 },
    { text: "Fight it — I'm supposed to be clearing my mind", score: 200 },
    { text: "Note it and return to the breath", score: 350 },
    { text: "Get curious about where the urgency comes from", score: 400 },
    { text: "Recognize it as just another cloud — and notice the sky it moves through", score: 700 },
  ]},
  { id: 20, text: "You are asked to help someone who has repeatedly refused your help before. What is the honest texture of your response?", options: [
    { text: "Resentment — why should I, after last time", score: 150 },
    { text: "Obligation mixed with exhaustion", score: 200 },
    { text: "Willingness, but I set a clear limit this time", score: 310 },
    { text: "Genuine care, with no attachment to whether they accept it", score: 500 },
    { text: "The history between us becomes irrelevant — this moment is its own thing", score: 600 },
  ]},
  { id: 21, text: "You are given proof that consciousness survives death. Your first honest reaction is:", options: [
    { text: "Relief — I was terrified of oblivion", score: 100 },
    { text: "Skepticism — I need more proof than that", score: 400 },
    { text: "Curiosity about what that means for how I live now", score: 350 },
    { text: "A quiet 'of course' — something in me already knew", score: 540 },
    { text: "The question loses its urgency — I was never fully identified with the body anyway", score: 700 },
  ]},
  { id: 22, text: "You are in a conversation and realize the other person isn't really listening — they're waiting to speak. What do you do?", options: [
    { text: "Match their energy — I stop really listening too", score: 175 },
    { text: "Feel hurt and withdraw", score: 100 },
    { text: "Finish my thought and let the conversation find its level", score: 250 },
    { text: "Get curious about what they're so eager to say", score: 400 },
    { text: "Slow down and create more space — sometimes people need to be heard before they can hear", score: 500 },
  ]},
  { id: 23, text: "You have achieved something significant. The recognition you receive is far less than you felt it deserved. What happens inside you?", options: [
    { text: "Bitterness — the world doesn't see what I actually did", score: 150 },
    { text: "Disappointment I try to reframe as 'it doesn't matter'", score: 200 },
    { text: "I note the gap and use it to recalibrate my expectations", score: 350 },
    { text: "The work was the point — the recognition was always secondary", score: 500 },
    { text: "I notice I was watching for recognition, and that observation is more interesting than the recognition itself", score: 600 },
  ]},
  { id: 24, text: "You are asked to describe what love is to someone who has never experienced it. You think for a moment. What do you say?", options: [
    { text: "A feeling of safety and being chosen", score: 175 },
    { text: "Wanting the best for someone even when it costs you", score: 310 },
    { text: "The complete absence of the need to change the other person", score: 500 },
    { text: "The recognition of yourself in another — and the dissolution of the boundary between you", score: 540 },
    { text: "You sit in silence for a while, then say: it's what's left when everything else is removed", score: 700 },
  ]},
  { id: 25, text: "If your life were a message — not what you intended it to be, but what it actually is — what would it say?", options: [
    { text: "I survived. I kept going. That's enough.", score: 200 },
    { text: "I built things. I left marks. I mattered.", score: 250 },
    { text: "I tried to understand. I kept asking questions.", score: 400 },
    { text: "I loved imperfectly and kept trying to love better.", score: 500 },
    { text: "I was here. Fully. And that was everything.", score: 600 },
  ]},
];

function getLevel(score: number) {
  let result = LEVELS[0];
  for (const l of LEVELS) {
    if (score >= l.level) result = l;
  }
  return result;
}

function getInsight(score: number): string {
  if (score < 100) return "You are in the territory of Shame and Guilt — the densest, most contracted states on the map. This is not a verdict. It is a location. The fact that you answered honestly is itself an act of Courage (200), which is the first level where energy begins to expand rather than collapse. The distance from here to there is not as far as it feels. It begins with one honest conversation — usually with yourself.";
  if (score < 200) return "You are operating primarily from Fear, Desire, Anger, or Pride — states where energy is consumed by survival, craving, defense, or the need to be right. These are not character flaws. They are evolutionary programs running on hardware that hasn't been updated. The critical threshold is Courage (200), where you stop fighting life and start engaging it. You are close. The awareness you brought to this assessment is already moving you there.";
  if (score < 310) return "You have crossed the threshold of Courage (200) — the dividing line between energy that depletes and energy that empowers. You are in the zone of active engagement: managing, coping, building. The invitation from here is to move from managing your inner life to being curious about it. Willingness (310) is the next gate — the willingness to be changed by what you encounter, not just to survive it.";
  if (score < 500) return "You operate from Willingness, Acceptance, and Reason — the realm of genuine engagement, forgiveness, and intellectual clarity. You see systems, patterns, and root causes. You have learned to hold complexity without collapsing it. The invitation from here is to move from understanding to embodiment — from knowing about love to being it. The head has done extraordinary work. The heart is asking for the next shift.";
  if (score < 600) return "You are touching the frequencies of Love and Joy — states where the personal begins to dissolve into something larger. At this level, you don't just understand compassion, you radiate it. People feel different in your presence without knowing why. The Hawkins research suggests that one person calibrating at 500 counterbalances 750,000 people below 200. Your consciousness is not a private matter. It is a form of service.";
  return "You are accessing states of Peace and beyond — where the question of purpose becomes irrelevant because you are the answer. Where doing arises from being. Where the self that was asking the questions has become transparent to something larger. This is rare territory. The only instruction from here is to keep going — and to help others find their way to the threshold.";
}

export default function ConsciousnessScale() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const { markComplete } = useJourneyProgress();
  const [sessionId] = useState(() => `consciousness-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const submitMutation = trpc.assessments.submit.useMutation();

  const totalScore = useMemo(() => {
    const scores = Object.values(answers);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [answers]);

  const currentQ = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  // Live map: running average of answered questions so far
  const liveScore = useMemo(() => {
    const scores = Object.values(answers);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [answers]);
  const liveLevel = liveScore > 0 ? getLevel(liveScore) : null;

  const handleSelect = useCallback((score: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: score }));
  }, [currentQ]);

  const goNext = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const level = getLevel(totalScore);
      submitMutation.mutate({
        assessmentType: "consciousness",
        sessionId,
        answers: JSON.stringify(answers),
        resultSummary: JSON.stringify({ score: totalScore, level: level.name, emotion: level.emotion }),
        totalScore,
      });
      setShowResult(true);
      markComplete("find-your-level");
      try {
        const lvl = getLevel(totalScore);
        localStorage.setItem("consciousness_results", JSON.stringify({ archetype: lvl.name, scores: { consciousness: totalScore }, timestamp: Date.now() }));
      } catch {}
    }
  }, [currentQuestion, totalScore, answers, sessionId, submitMutation, markComplete]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  }, [currentQuestion]);

  const handleSetReminder = useCallback(() => {
    const sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    try {
      localStorage.setItem("consciousness_reminder", sixMonths.toISOString());
      setReminderSet(true);
    } catch {}
  }, []);

  const handleShare = useCallback((platform: string) => {
    const level = getLevel(totalScore);
    const url = `https://tonygreenberg.com/consciousness-scale`;
    const text = `I calibrated at ${totalScore} on the Hawkins Map of Consciousness — ${level.name}. Where do you land?`;
    if (platform === "x") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
    }
  }, [totalScore]);

  /* ── RESULT SCREEN ── */
  if (showResult) {
    const level = getLevel(totalScore);
    const levelIdx = LEVELS.findIndex(l => l.name === level.name);
    const scalePercent = Math.min(100, (totalScore / 700) * 100);
    return (
      <>
        <SEO title={`${level.name} (${totalScore}) — Your Consciousness Level`} description={`You calibrated at ${totalScore} on the Hawkins Map of Consciousness. Level: ${level.name}. Emotion: ${level.emotion}.`} path="/consciousness-scale" indexable={false} />
        <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
          {/* Result hero */}
          <div style={{ background: "#0A0A10", padding: "3rem clamp(1.5rem, 5vw, 4rem) 2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#D4B96A", textTransform: "uppercase", marginBottom: "0.5rem" }}>Your Calibration</p>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(4rem, 10vw, 7rem)", fontWeight: 400, color: level.color || "#D4B96A", lineHeight: 1 }}>{totalScore}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FAFAF7", marginTop: "0.5rem" }}>{level.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#999", letterSpacing: "0.15em", marginTop: "0.25rem" }}>{level.emotion}</div>
          </div>

          <Section>
            {/* Visual scale */}
            <div style={{ margin: "2rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999" }}>20</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#D4B96A", fontWeight: 600 }}>You: {totalScore}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999" }}>700+</span>
              </div>
              <div style={{ height: "12px", background: "#e5e0d5", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", background: `linear-gradient(90deg, #2d1515, #7a4010, #3a6b30, #5a4aaa, #d4b96a)`, width: "100%" }} />
                <div style={{
                  position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                  left: `${scalePercent}%`,
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#FAFAF7", border: "3px solid #0A0A10",
                  boxShadow: "0 0 0 2px #D4B96A",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#aaa" }}>Shame</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#aaa" }}>Courage 200</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#aaa" }}>Love 500</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#aaa" }}>Enlightenment</span>
              </div>
            </div>

            <Divider />

            {/* Insight */}
            <div style={{ margin: "2rem 0" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#0A0A10", marginBottom: "1rem" }}>What This Means</h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.85, color: "#333" }}>{getInsight(totalScore)}</p>
            </div>

            {/* Share buttons */}
            <div style={{ margin: "2rem 0", padding: "1.5rem", background: "#f5f0e8", borderRadius: "2px" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>Share Your Level</p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button onClick={() => handleShare("x")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", padding: "0.6rem 1.25rem", background: "#0A0A10", color: "#FAFAF7", border: "none", cursor: "pointer", borderRadius: "2px" }}>Post on X</button>
                <button onClick={() => handleShare("linkedin")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", padding: "0.6rem 1.25rem", background: "#0077b5", color: "#FAFAF7", border: "none", cursor: "pointer", borderRadius: "2px" }}>Share on LinkedIn</button>
                <button onClick={() => handleShare("copy")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", padding: "0.6rem 1.25rem", background: "transparent", color: "#8B6914", border: "1px solid #8B6914", cursor: "pointer", borderRadius: "2px" }}>Copy Link</button>
              </div>
            </div>

            {/* 6-month reminder */}
            <div style={{ margin: "2rem 0", padding: "1.5rem", background: "#0A0A10", color: "#FAFAF7", borderRadius: "2px" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#D4B96A", textTransform: "uppercase", marginBottom: "0.75rem" }}>Take It Again in 6 Months</p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "#ccc", marginBottom: "1rem" }}>
                David Hawkins noted that consciousness levels rarely shift quickly — but they do shift. The movement matters more than the number. Save your score today and return in six months to see what has changed.
              </p>
              {reminderSet ? (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#D4B96A" }}>Reminder saved. Come back in 6 months.</p>
              ) : (
                <button onClick={handleSetReminder} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", padding: "0.6rem 1.5rem", background: "#8B6914", color: "#FAFAF7", border: "none", cursor: "pointer", borderRadius: "2px" }}>
                  Save My Score ({totalScore} — {level.name})
                </button>
              )}
            </div>

            {/* Full map */}
            <div style={{ margin: "2.5rem 0" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#0A0A10", marginBottom: "1rem" }}>The Full Map</h2>
              <div style={{ display: "grid", gap: "0.2rem" }}>
                {[...LEVELS].reverse().map((l, i) => {
                  const isYou = l.name === level.name;
                  return (
                    <div key={l.level} style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.6rem 0.75rem",
                      background: isYou ? "#0A0A10" : "transparent",
                      color: isYou ? "#FAFAF7" : "#555",
                      borderRadius: "2px",
                      borderLeft: isYou ? `3px solid ${l.color}` : "3px solid transparent",
                    }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", width: "3rem", color: isYou ? "#D4B96A" : "#999", flexShrink: 0 }}>{l.level}</span>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: isYou ? 600 : 400, flex: 1 }}>{l.name}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: isYou ? "#D4B96A" : "#aaa" }}>{l.emotion}</span>
                      {isYou && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#D4B96A" }}>← you</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <Divider />

            {/* Tony's note */}
            <div style={{ margin: "2rem 0", padding: "2rem", background: "#0A0A10", color: "#FAFAF7", borderRadius: "2px" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#D4B96A", textTransform: "uppercase", marginBottom: "1rem" }}>Tony's Note</p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.85, color: "#ccc" }}>
                David R. Hawkins spent decades mapping human consciousness using applied kinesiology and clinical observation. His scale is logarithmic — the difference between 200 and 300 is not 100 points, it is an order of magnitude of energetic force. Most of humanity calibrates between 150 and 250. The critical threshold is 200 (Courage), where you shift from force to power, from taking to giving, from contraction to expansion. The questions in this assessment are designed to reveal your actual operating level, not your aspirational one. The most common mistake is answering who you want to be. The most useful thing is answering who you are on a Tuesday at 2pm when nothing is going your way.
              </p>
            </div>

            <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
              <JourneyTracker variant="light" currentAssessmentId="find-your-level" />
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/psychedelic-readiness-index" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B6914", textDecoration: "none", padding: "0.6rem 1.25rem", border: "1px solid #8B6914", borderRadius: "2px" }}>Psychedelic Readiness Index →</Link>
              <Link href="/facilitator-index" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", textDecoration: "none", padding: "0.6rem 1.25rem", border: "1px solid #ccc", borderRadius: "2px" }}>Find a Facilitator →</Link>
              <Link href="/start-here" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", textDecoration: "none", padding: "0.6rem 1.25rem", border: "1px solid #ccc", borderRadius: "2px" }}>Start Here →</Link>
            </div>
          </Section>
        </div>
      </>
    );
  }

  /* ── ASSESSMENT SCREEN ── */
  return (
    <>
      <SEO title="Map of Consciousness Assessment — Tony Greenberg" description="25 questions that reveal where you actually operate on the Hawkins Map of Consciousness. Not where you aspire to be — where you are." path="/consciousness-scale" indexable={true} />
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        {/* Cinematic hero */}
        <div style={{
          position: "relative",
          height: currentQuestion === 0 ? "60vh" : "8px",
          overflow: "hidden",
          transition: "height 0.8s ease",
          background: "#0A0A10",
        }}>
          {currentQuestion === 0 && (
            <>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${HERO_IMG})`,
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
                filter: "brightness(0.45)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 40%, #FAFAF7 100%)",
              }} />
              <div style={{
                position: "absolute", bottom: "2rem", left: "clamp(1.5rem, 5vw, 4rem)",
                maxWidth: "700px",
              }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#D4B96A", textTransform: "uppercase", marginBottom: "0.5rem" }}>Inspired by David R. Hawkins</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#FAFAF7", lineHeight: 1.2, marginBottom: "0.75rem" }}>
                  Where Does Your Consciousness Actually Calibrate?
                </h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "clamp(0.9rem, 1.5vw, 1rem)", color: "rgba(250,240,224,0.75)", lineHeight: 1.7, maxWidth: "560px" }}>
                  25 questions. Each one requires at least a minute of honest reflection. Answer who you are on a Tuesday at 2pm — not who you aspire to be.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "#e5e0d5" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #8B6914, #D4B96A)", width: `${progress}%`, transition: "width 0.5s ease" }} />
        </div>

        {/* Live map indicator — shows after first answer */}
        {liveLevel && Object.keys(answers).length > 0 && (
          <div style={{ background: "#0A0A10", padding: "0.6rem clamp(1.5rem, 5vw, 4rem)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#666", textTransform: "uppercase" }}>Running average</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: liveLevel.color || "#D4B96A" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#D4B96A" }}>{liveScore} — {liveLevel.name}</span>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>{Object.keys(answers).length} of {QUESTIONS.length} answered</span>
          </div>
        )}

        <Section>
          <FadeIn key={currentQuestion}>
            <div style={{ minHeight: "55vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "2rem", paddingBottom: "2rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#999", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </p>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
                fontWeight: 400,
                color: "#0A0A10",
                lineHeight: 1.5,
                marginBottom: "2.5rem",
                maxWidth: "680px",
              }}>
                {currentQ.text}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "680px" }}>
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt.score;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt.score)}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        padding: "1rem 1.25rem",
                        textAlign: "left",
                        background: isSelected ? "#0A0A10" : "#fff",
                        color: isSelected ? "#FAFAF7" : "#333",
                        border: isSelected ? "1px solid #0A0A10" : "1px solid #d5d0c5",
                        borderRadius: "2px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        borderLeft: isSelected ? "3px solid #D4B96A" : "3px solid transparent",
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2.5rem", maxWidth: "680px" }}>
                <button
                  onClick={goPrev}
                  disabled={currentQuestion === 0}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.6rem 1.5rem", background: "transparent", border: "1px solid #ccc",
                    color: currentQuestion === 0 ? "#ccc" : "#666", cursor: currentQuestion === 0 ? "default" : "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={!answers[currentQ.id]}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.6rem 1.75rem",
                    background: answers[currentQ.id] ? "#8B6914" : "#e5e0d5",
                    border: "none",
                    color: answers[currentQ.id] ? "#fff" : "#aaa",
                    cursor: answers[currentQ.id] ? "pointer" : "default",
                    borderRadius: "2px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {currentQuestion === QUESTIONS.length - 1 ? "See My Level" : "Next"}
                </button>
              </div>
            </div>
          </FadeIn>
        </Section>

        <div style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid #e5e0d5" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.1em" }}>
            Based on David R. Hawkins' <em>Power vs. Force</em> (1995) · Curated by Tony Greenberg
          </p>
        </div>
      </div>
    </>
  );
}
