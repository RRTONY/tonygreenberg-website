import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Section, Divider, FadeIn } from "@/components/Editorial";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

/* ── The 5 Grant Study Factors ── */
const FACTORS = [
  { key: "relationships", name: "Warm Relationships", icon: "♡", description: "The single strongest predictor of life satisfaction. Not quantity — quality. The depth of your connections." },
  { key: "coping", name: "Adaptive Coping", icon: "◈", description: "How you metabolize difficulty. Mature defenses (humor, altruism, sublimation) vs. immature ones (denial, projection, passive aggression)." },
  { key: "generativity", name: "Generativity", icon: "❋", description: "Erikson's concept: the concern for establishing and guiding the next generation. Mentoring, creating, contributing beyond self." },
  { key: "career", name: "Career Satisfaction", icon: "△", description: "Not status or income — the sense that your work matters, uses your gifts, and aligns with your values." },
  { key: "health", name: "Physical Vitality", icon: "○", description: "Not the absence of disease — the active cultivation of the body as an instrument of consciousness." },
];

/* ── 25 Questions (5 per factor) ── */
const QUESTIONS = [
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

function getFactorScore(answers: Record<number, number>, factorKey: string): number {
  const factorQs = QUESTIONS.filter(q => q.factor === factorKey);
  const scores = factorQs.map(q => answers[q.id] || 0).filter(s => s > 0);
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 10)) * 100);
}

function getFactorInsight(factorKey: string, score: number): string {
  const insights: Record<string, Record<string, string>> = {
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
  const tier = score < 40 ? "low" : score < 70 ? "mid" : "high";
  return insights[factorKey]?.[tier] || "";
}

export default function GrantStudy() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const { markComplete } = useJourneyProgress();
  const [sessionId] = useState(() => `grant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const submitMutation = trpc.assessments.submit.useMutation();

  const currentQ = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleSelect = useCallback((score: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: score }));
  }, [currentQ]);

  const goNext = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const factorScores = FACTORS.map(f => ({ key: f.key, score: getFactorScore(answers, f.key) }));
      const overall = Math.round(factorScores.reduce((a, b) => a + b.score, 0) / factorScores.length);
      submitMutation.mutate({
        assessmentType: "grant-study",
        sessionId,
        answers: JSON.stringify(answers),
        resultSummary: JSON.stringify({ factorScores, overall }),
        totalScore: overall,
      });
      setShowResult(true);
      markComplete("find-your-score");
      try {
        const scoresObj: Record<string, number> = {};
        factorScores.forEach(f => { scoresObj[f.key] = f.score; });
        localStorage.setItem("grant_results", JSON.stringify({ archetype: `${overall}% Flourishing`, scores: scoresObj, timestamp: Date.now() }));
      } catch {}
    }
  }, [currentQuestion, answers, sessionId, submitMutation]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  }, [currentQuestion]);

  const factorScores = useMemo(() => FACTORS.map(f => ({
    ...f,
    score: getFactorScore(answers, f.key),
  })), [answers]);

  const overall = useMemo(() => {
    const scores = factorScores.map(f => f.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [factorScores]);

  /* ── RESULT SCREEN ── */
  if (showResult) {
    const sorted = [...factorScores].sort((a, b) => b.score - a.score);
    const strongest = sorted[0];
    const growthEdge = sorted[sorted.length - 1];

    return (
      <>
        <SEO title="Your Grant Study Profile — Tony Greenberg" description="Your life satisfaction assessment based on the Harvard Grant Study's 85-year findings."
        indexable={true} />
        <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
          <Section>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Your Life Satisfaction Profile
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "#0A0A10", lineHeight: 1.2, marginBottom: "0.5rem" }}>
                  Overall: {overall}%
                </h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.1rem", color: "#666" }}>
                  Based on the five factors the Harvard Grant Study identified as predictive of lifelong wellbeing
                </p>
              </div>

              <Divider />

              {/* Factor bars */}
              <div style={{ marginTop: "2rem" }}>
                {factorScores.map(f => (
                  <div key={f.key} style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#0A0A10" }}>
                        {f.icon} {f.name}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#8B6914", fontWeight: 600 }}>
                        {f.score}%
                      </span>
                    </div>
                    <div style={{ background: "#f0ede5", borderRadius: "2px", height: "8px" }}>
                      <div style={{
                        background: f.score >= 70 ? "linear-gradient(90deg, #2E8B57, #4a7c3f)" : f.score >= 40 ? "linear-gradient(90deg, #8B6914, #D4B96A)" : "linear-gradient(90deg, #8B4513, #996633)",
                        height: "100%",
                        width: `${f.score}%`,
                        borderRadius: "2px",
                        transition: "width 1s ease",
                      }} />
                    </div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#666", lineHeight: 1.7, marginTop: "0.75rem" }}>
                      {getFactorInsight(f.key, f.score)}
                    </p>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Summary */}
              <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ padding: "1.5rem", background: "#fff", border: "1px solid #e5e0d5" }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#2E8B57", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Your Strength
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#0A0A10" }}>
                    {strongest.icon} {strongest.name}
                  </p>
                </div>
                <div style={{ padding: "1.5rem", background: "#fff", border: "1px solid #e5e0d5" }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Your Growth Edge
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#0A0A10" }}>
                    {growthEdge.icon} {growthEdge.name}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "2rem", padding: "2rem", background: "#0A0A10", color: "#FAFAF7" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", color: "#D4B96A", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Tony's Note
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.8, color: "#ccc" }}>
                  The Harvard Grant Study began in 1938 and followed 724 men for over 85 years — making it the longest study of human happiness ever conducted. George Vaillant, who directed it for three decades, distilled the findings into one sentence: "Happiness is love. Full stop." Robert Waldinger, the current director, adds: "The clearest message we get from this study is: good relationships keep us happier and healthier." Your scores above aren't grades — they're a map. The factor with the lowest score isn't your weakness. It's your invitation.
                </p>
              </div>

              {/* ── Journey Progress Tracker ── */}
              <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
                <JourneyTracker variant="light" currentAssessmentId="find-your-score" />
              </div>

              {/* ── Journey Flow ── */}
              <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem", textAlign: "center" }}>The Journey Continues</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#666", textAlign: "center", marginBottom: "1.5rem" }}>You've measured what matters most. Now explore the dimensions underneath.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                  {[
                    { name: "Find Your Purpose", hook: "The Dharma Finder — what you can't stop doing.", url: "/assessments/dharma-finder", badge: "25 Qs" },
                    { name: "Find Your Therapy", hook: "Matched to your wiring, not a waitlist.", url: "/find-your-therapy", badge: "25 Qs" },
                    { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions.", url: "https://findmyassess-9eekxcob.manus.space/find-my-spirituality", badge: "35 Qs" },
                    { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/assessments/consciousness-scale", badge: "25 Qs" },
                    { name: "Find Your Partner", hook: "15 questions mapping the architecture of your intimacy.", url: "https://intimacyassess-tcir3hon.manus.space", badge: "15 Qs" },
                    { name: "Find Your Me", hook: "The gateway to the whole ecosystem.", url: "/find-your-me", badge: "5 Qs" },
                  ].map((next) => (
                    <a key={next.name} href={next.url} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "1rem", border: "1px solid #e5e0d5", background: "#FAFAF7", cursor: "pointer", transition: "all 0.3s ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#8B6914"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e0d5"; }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.9rem", color: "#0A0A10" }}>{next.name}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", color: "#8B6914", border: "1px solid #e5e0d5", padding: "2px 6px" }}>{next.badge}</span>
                        </div>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: 0 }}>{next.hook}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                <button
                  onClick={() => { setShowResult(false); setCurrentQuestion(0); setAnswers({}); }}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.75rem 2rem", background: "transparent", border: "1px solid #8B6914", color: "#8B6914", cursor: "pointer",
                  }}
                >
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="grant-study"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ scores: answers })}
              totalScore={null}
            />

                  Retake Assessment
                </button>
                <Link href="/find-your-me">
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.75rem 2rem", background: "#8B6914", color: "#fff", cursor: "pointer", display: "inline-block",
                  }}>
                    Explore All Assessments
                  </span>
                </Link>
              </div>
            </FadeIn>
          </Section>
        </div>
      </>
    );
  }

  /* ── QUESTION SCREEN ── */
  const currentFactor = FACTORS.find(f => f.key === currentQ.factor);

  return (
    <>
      <SEO title="Grant Study Assessment — Tony Greenberg" description="Measure your life satisfaction across the five factors the Harvard Grant Study identified as predictive of lifelong wellbeing."
        indexable={true} />
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "#e5e0d5", zIndex: 50 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #2E8B57, #D4B96A)", width: `${progress}%`, transition: "width 0.5s ease" }} />
        </div>

        <Section>
          {currentQuestion === 0 && (
            <FadeIn>
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.25em", color: "#8B6914", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Based on 85 Years of Harvard Research
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, color: "#0A0A10", marginBottom: "0.75rem" }}>
                  The Grant Study Life Satisfaction Assessment
                </h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#666", lineHeight: 1.7 }}>
                  The Harvard Grant Study is the longest-running study of human happiness. Beginning in 1938, it followed 724 participants across their entire lives. The findings are clear: five factors predict lifelong wellbeing. This assessment measures where you stand on each.
                </p>
                <Divider />
              </div>
            </FadeIn>
          )}

          {/* Factor indicator */}
          {currentFactor && (
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase" }}>
                {currentFactor.icon} {currentFactor.name}
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#999", marginTop: "0.25rem" }}>
                {currentFactor.description}
              </p>
            </div>
          )}

          <FadeIn key={currentQuestion}>
            <div style={{ minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#999", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </p>

              <h3 style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)", fontWeight: 400,
                color: "#0A0A10", lineHeight: 1.4, marginBottom: "2rem",
              }}>
                {currentQ.text}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt.score;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt.score)}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", lineHeight: 1.5,
                        padding: "1rem 1.2rem", textAlign: "left",
                        background: isSelected ? "#0A0A10" : "#fff",
                        color: isSelected ? "#FAFAF7" : "#333",
                        border: isSelected ? "1px solid #0A0A10" : "1px solid #d5d0c5",
                        borderRadius: "2px", cursor: "pointer", transition: "all 0.2s ease",
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
                <button
                  onClick={goPrev}
                  disabled={currentQuestion === 0}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.6rem 1.5rem", background: "transparent", border: "1px solid #ccc",
                    color: currentQuestion === 0 ? "#ccc" : "#666", cursor: currentQuestion === 0 ? "default" : "pointer",
                  }}
                >
                  ← Previous
                </button>

                <button
                  onClick={goNext}
                  disabled={!answers[currentQ.id]}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.6rem 1.5rem", background: answers[currentQ.id] ? "#8B6914" : "#ccc",
                    border: "none", color: "#fff", cursor: answers[currentQ.id] ? "pointer" : "default",
                  }}
                >
                  {currentQuestion === QUESTIONS.length - 1 ? "See My Profile →" : "Next →"}
                </button>
              </div>
            </div>
          </FadeIn>
        </Section>

        <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #e5e0d5" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.1em" }}>
            Based on the Harvard Grant Study (1938–present) · Curated by Tony Greenberg
          </p>
        </div>
      </div>
    </>
  );
}
