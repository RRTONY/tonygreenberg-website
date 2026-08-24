import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Section, Divider, FadeIn } from "@/components/Editorial";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

/* ── Questions: 25 distilled from Schmachtenberger's Dharma Inquiry ── */
const SECTIONS = [
  {
    title: "Capacities",
    subtitle: "Removing limitations to see what emerges",
    quote: {
      text: "Dharma roughly means: the path of right action; the path of greatest integrity; the path of choices that don't create suffering and optimally help heal it.",
      author: "Daniel Schmachtenberger",
    },
    questions: [
      { id: 1, text: "If your financial needs were already met for the rest of your life, what would you spend your days doing?", category: "capacities" },
      { id: 2, text: "If you had the resources of the world's wealthiest people, what cause or creation would you pour them into?", category: "capacities" },
      { id: 3, text: "If you could go back to school with no constraints, what would you study — and why?", category: "capacities" },
      { id: 4, text: "If you could instantly download any skill, which three would you choose?", category: "capacities" },
      { id: 5, text: "If fear and self-doubt vanished overnight, what would you do differently tomorrow morning?", category: "capacities" },
      { id: 6, text: "If your main character deficits were resolved — the patterns you know hold you back — what would become possible?", category: "capacities" },
      { id: 7, text: "If you had the perfect team supporting you, what would you build?", category: "capacities" },
      { id: 8, text: "If your life started over with a clean slate — no previous commitments, no baggage — what path would you walk?", category: "capacities" },
    ],
  },
  {
    title: "Values",
    subtitle: "What you care about, love, find meaningful",
    quote: {
      text: "The meaning of life is to find your gift. The purpose of life is to give it away.",
      author: "Pablo Picasso",
    },
    questions: [
      { id: 9, text: "Who are you most inspired by? What about them calls to something deep in you?", category: "values" },
      { id: 10, text: "What issues in the world upset you the most — the ones that make you want to act, not just scroll past?", category: "values" },
      { id: 11, text: "What do you see as most deeply wrong with or off in the world right now?", category: "values" },
      { id: 12, text: "What do you find the most beauty in? What moves you to tears or silence?", category: "values" },
      { id: 13, text: "Looking back from the end of your life, who would you be most proud to have been?", category: "values" },
      { id: 14, text: "What would you work on if you could succeed but no one would ever know you did it?", category: "values" },
      { id: 15, text: "What would you sacrifice personal benefit for? What matters more than comfort?", category: "values" },
      { id: 16, text: "What is sacred to you? Not what you've been told is sacred — what you actually hold as inviolable?", category: "values" },
      { id: 17, text: "If all your personal desires were already met, what would you then care about?", category: "values" },
    ],
  },
  {
    title: "Propensities",
    subtitle: "Your native gifts and intrinsic motivations",
    quote: {
      text: "Don't ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive.",
      author: "Howard Thurman",
    },
    questions: [
      { id: 18, text: "What are you naturally good at — the things that seem to come easy while others struggle?", category: "propensities" },
      { id: 19, text: "What types of activities leave you feeling replenished rather than drained?", category: "propensities" },
      { id: 20, text: "What are you willing to do even when it taxes you — the hard work that doesn't feel like punishment?", category: "propensities" },
      { id: 21, text: "What do you enjoy doing for its own sake, independent of results or recognition?", category: "propensities" },
      { id: 22, text: "What is your attention repeatedly called to? What can you not stop noticing?", category: "propensities" },
      { id: 23, text: "Where have you felt the most pride or satisfaction related to something you actually did?", category: "propensities" },
      { id: 24, text: "When have you felt most fully alive — not just happy, but alive?", category: "propensities" },
    ],
  },
  {
    title: "The Shadow Inquiry",
    subtitle: "What is not dharma — the honest reckoning",
    quote: {
      text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
      author: "Carl Jung",
    },
    questions: [
      { id: 25, text: "Where are you deceiving yourself? Where are you not living in alignment with your own values — and what would change if you stopped?", category: "shadow" },
    ],
  },
];

const ALL_QUESTIONS = SECTIONS.flatMap(s => s.questions);
const TOTAL = ALL_QUESTIONS.length;

/* ── Interstitial quotes between sections ── */
const INTERSTITIAL_QUOTES = [
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
];

function generateDharmaProfile(answers: Record<number, string>) {
  const filled = Object.values(answers).filter(a => a.trim().length > 0);
  const themes: string[] = [];
  const patterns: string[] = [];

  // Analyze capacities answers for themes
  const capacityAnswers = [1, 2, 3, 4, 5, 6, 7, 8].map(id => answers[id] || "").join(" ").toLowerCase();
  if (capacityAnswers.includes("creat") || capacityAnswers.includes("build") || capacityAnswers.includes("design") || capacityAnswers.includes("art")) themes.push("Creator / Builder");
  if (capacityAnswers.includes("teach") || capacityAnswers.includes("mentor") || capacityAnswers.includes("guide") || capacityAnswers.includes("help")) themes.push("Guide / Teacher");
  if (capacityAnswers.includes("heal") || capacityAnswers.includes("therap") || capacityAnswers.includes("care") || capacityAnswers.includes("support")) themes.push("Healer / Caretaker");
  if (capacityAnswers.includes("lead") || capacityAnswers.includes("organiz") || capacityAnswers.includes("manag") || capacityAnswers.includes("direct")) themes.push("Leader / Organizer");
  if (capacityAnswers.includes("research") || capacityAnswers.includes("discover") || capacityAnswers.includes("learn") || capacityAnswers.includes("study")) themes.push("Explorer / Researcher");
  if (capacityAnswers.includes("connect") || capacityAnswers.includes("communit") || capacityAnswers.includes("people") || capacityAnswers.includes("together")) themes.push("Connector / Community Builder");

  // Analyze values answers for patterns
  const valueAnswers = [9, 10, 11, 12, 13, 14, 15, 16, 17].map(id => answers[id] || "").join(" ").toLowerCase();
  if (valueAnswers.includes("justice") || valueAnswers.includes("equal") || valueAnswers.includes("fair")) patterns.push("Justice & Equity");
  if (valueAnswers.includes("nature") || valueAnswers.includes("environment") || valueAnswers.includes("earth") || valueAnswers.includes("planet")) patterns.push("Ecological Stewardship");
  if (valueAnswers.includes("truth") || valueAnswers.includes("honest") || valueAnswers.includes("authentic")) patterns.push("Truth & Authenticity");
  if (valueAnswers.includes("love") || valueAnswers.includes("compassion") || valueAnswers.includes("kind")) patterns.push("Love & Compassion");
  if (valueAnswers.includes("freedom") || valueAnswers.includes("libert") || valueAnswers.includes("autonomy")) patterns.push("Freedom & Sovereignty");
  if (valueAnswers.includes("beauty") || valueAnswers.includes("art") || valueAnswers.includes("music") || valueAnswers.includes("creat")) patterns.push("Beauty & Creative Expression");
  if (valueAnswers.includes("conscious") || valueAnswers.includes("spirit") || valueAnswers.includes("sacred") || valueAnswers.includes("soul")) patterns.push("Consciousness & Spiritual Growth");

  if (themes.length === 0) themes.push("Seeker — your path is still crystallizing");
  if (patterns.length === 0) patterns.push("Your values run deep — they may resist easy categorization");

  return {
    archetypes: themes.slice(0, 3),
    coreValues: patterns.slice(0, 4),
    completionDepth: Math.round((filled.length / TOTAL) * 100),
    totalAnswered: filled.length,
  };
}

export default function DharmaFinder() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const { markComplete } = useJourneyProgress();
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [interstitialIdx, setInterstitialIdx] = useState(0);
  const [sessionId] = useState(() => `dharma-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const submitMutation = trpc.assessments.submit.useMutation();

  const currentQ = ALL_QUESTIONS[currentQuestion];
  const currentSectionIdx = useMemo(() => {
    let count = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      count += SECTIONS[i].questions.length;
      if (currentQuestion < count) return i;
    }
    return SECTIONS.length - 1;
  }, [currentQuestion]);

  const sectionStartIdx = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentSectionIdx; i++) {
      count += SECTIONS[i].questions.length;
    }
    return count;
  }, [currentSectionIdx]);

  const isFirstInSection = currentQuestion === sectionStartIdx;

  const handleAnswer = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  }, [currentQ]);

  const goNext = useCallback(() => {
    if (currentQuestion < TOTAL - 1) {
      const nextQ = currentQuestion + 1;
      // Check if we're crossing into a new section
      let count = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        count += SECTIONS[i].questions.length;
        if (nextQ === count && i < SECTIONS.length - 1) {
          // Show interstitial
          setInterstitialIdx(i);
          setShowInterstitial(true);
          setTimeout(() => {
            setShowInterstitial(false);
            setCurrentQuestion(nextQ);
          }, 4000);
          return;
        }
      }
      setCurrentQuestion(nextQ);
    } else {
      // Done — generate result
      const profile = generateDharmaProfile(answers);
      submitMutation.mutate({
        assessmentType: "dharma",
        sessionId,
        answers: JSON.stringify(answers),
        resultSummary: JSON.stringify(profile),
        totalScore: profile.completionDepth,
      });
      setShowResult(true);
      markComplete("find-your-purpose");
      try {
        const p = generateDharmaProfile(answers);
        localStorage.setItem("dharma_results", JSON.stringify({ archetype: p.archetypes[0] || "Unknown", primaryPath: p.archetypes[0] || "Unknown", scores: {}, timestamp: Date.now() }));
      } catch {}
    }
  }, [currentQuestion, answers, sessionId, submitMutation]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  }, [currentQuestion]);

  const profile = useMemo(() => generateDharmaProfile(answers), [answers]);

  /* ── RESULT SCREEN ── */
  if (showResult) {
    return (
      <>
        <SEO title="Your Dharma Profile — Tony Greenberg" description="Your personalized dharma profile based on Daniel Schmachtenberger's inquiry."
        indexable={true} />
        <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
          <Section>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Your Dharma Profile
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "#0A0A10", lineHeight: 1.2, marginBottom: "1rem" }}>
                  The Threads of Your Purpose
                </h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.1rem", color: "#555", maxWidth: "600px", margin: "0 auto" }}>
                  Based on your {profile.totalAnswered} responses, here's what the inquiry reveals about the shape of your dharma.
                </p>
              </div>

              <Divider />

              <div style={{ marginTop: "2.5rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, color: "#0A0A10", marginBottom: "1.5rem" }}>
                  Your Archetypal Roles
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                  {profile.archetypes.map((a, i) => (
                    <span key={i} style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.85rem",
                      padding: "0.5rem 1.2rem",
                      background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                      color: "#fff",
                      borderRadius: "2px",
                      letterSpacing: "0.05em",
                    }}>
                      {a}
                    </span>
                  ))}
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, color: "#0A0A10", marginBottom: "1.5rem" }}>
                  Core Values Detected
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {profile.coreValues.map((v, i) => (
                    <div key={i} style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.05rem",
                      padding: "0.75rem 1.2rem",
                      background: "#fff",
                      border: "1px solid #e5e0d5",
                      color: "#333",
                    }}>
                      <span style={{ color: "#8B6914", fontWeight: 600, marginRight: "0.5rem" }}>◆</span>
                      {v}
                    </div>
                  ))}
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, color: "#0A0A10", marginBottom: "1rem" }}>
                  Depth of Inquiry
                </h2>
                <div style={{ background: "#f0ede5", borderRadius: "2px", height: "8px", marginBottom: "0.5rem" }}>
                  <div style={{
                    background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                    height: "100%",
                    width: `${profile.completionDepth}%`,
                    borderRadius: "2px",
                    transition: "width 1s ease",
                  }} />
                </div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#888" }}>
                  {profile.completionDepth}% of questions explored
                </p>
              </div>

              <Divider />

              <div style={{ marginTop: "2.5rem", padding: "2rem", background: "#0A0A10", color: "#FAFAF7" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", color: "#D4B96A", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Tony's Note
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.8, color: "#ccc" }}>
                  This 25-question version is a doorway. Daniel Schmachtenberger's full Dharma Inquiry contains 200-300 questions and takes roughly three hours of deep, honest reflection. Having shared it with over 100 people across two decades, it remains the most transformative self-inquiry exercise encountered in a lifetime of searching. The full version lives at{" "}
                  <a href="https://civilizationemerging.com/dharma-inquiry-original-version/" target="_blank" rel="noopener noreferrer" style={{ color: "#D4B96A", textDecoration: "underline" }}>
                    civilizationemerging.com
                  </a>.
                </p>
              </div>

              {/* ── Journey Progress Tracker ── */}
              <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
                <JourneyTracker variant="light" currentAssessmentId="find-your-purpose" />
              </div>

              {/* ── Journey Flow ── */}
              <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem", textAlign: "center" }}>The Journey Continues</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#666", textAlign: "center", marginBottom: "1.5rem" }}>You've found your dharma. Now explore the dimensions that shape it.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                  {[
                    { name: "Find Your Therapy", hook: "Matched to your wiring, not a waitlist.", url: "/find-your-therapy", badge: "25 Qs" },
                    { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions.", url: "/find-your-spirit", badge: "35 Qs" },
                    { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/assessments/consciousness-scale", badge: "25 Qs" },
                    { name: "Find Your Score", hook: "85 years of Harvard data, one assessment.", url: "/assessments/grant-study", badge: "25 Qs" },
                    { name: "Find Your Mirror", hook: "A radar chart that doesn't care about your feelings.", url: "/the-mirror", badge: "18 Qs" },
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
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.75rem 2rem",
                    background: "transparent",
                    border: "1px solid #8B6914",
                    color: "#8B6914",
                    cursor: "pointer",
                  }}
                >
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="dharma"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ archetypes: profile.archetypes, values: profile.coreValues })}
              totalScore={null}
            />

                  Retake Assessment
                </button>
                <Link href="/find-your-me">
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.75rem 2rem",
                    background: "#8B6914",
                    color: "#fff",
                    cursor: "pointer",
                    display: "inline-block",
                  }}>
                    Explore All Assessments
                  </span>
                </Link>
                <Link href="/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership">
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.75rem 2rem",
                    background: "transparent",
                    border: "1px solid #333",
                    color: "#333",
                    cursor: "pointer",
                    display: "inline-block",
                  }}>
                    Read: Love as Dharma
                  </span>
                </Link>
              </div>
            </FadeIn>
          </Section>
        </div>
      </>
    );
  }

  /* ── INTERSTITIAL QUOTE ── */
  if (showInterstitial) {
    const q = INTERSTITIAL_QUOTES[interstitialIdx % INTERSTITIAL_QUOTES.length];
    return (
      <div style={{
        background: "#0A0A10",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <FadeIn>
          <div style={{ maxWidth: "640px", textAlign: "center" }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontStyle: "italic",
              color: "#FAFAF7",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}>
              "{q.text}"
            </p>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "#D4B96A",
              textTransform: "uppercase",
            }}>
              — {q.author}
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  /* ── QUESTION SCREEN ── */
  const section = SECTIONS[currentSectionIdx];
  const progress = ((currentQuestion + 1) / TOTAL) * 100;

  return (
    <>
      <SEO title="Dharma Finder — Tony Greenberg" description="A 25-question inquiry based on Daniel Schmachtenberger's Dharma framework. Discover your purpose, your values, and your path of service."
        indexable={true} />
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "#e5e0d5", zIndex: 50 }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #8B6914, #D4B96A)",
            width: `${progress}%`,
            transition: "width 0.5s ease",
          }} />
        </div>

        <Section>
          {/* Section header — show only at first question of each section */}
          {isFirstInSection && (
            <FadeIn>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  color: "#8B6914",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}>
                  Part {currentSectionIdx + 1} of {SECTIONS.length} · {section.title}
                </p>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  fontWeight: 400,
                  color: "#0A0A10",
                  marginBottom: "0.5rem",
                }}>
                  {section.subtitle}
                </h2>
                {section.quote && (
                  <blockquote style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    fontStyle: "italic",
                    color: "#666",
                    borderLeft: "2px solid #D4B96A",
                    paddingLeft: "1rem",
                    marginTop: "1rem",
                  }}>
                    "{section.quote.text}"
                    <br />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#8B6914" }}>
                      — {section.quote.author}
                    </span>
                  </blockquote>
                )}
                <Divider />
              </div>
            </FadeIn>
          )}

          {/* Question */}
          <FadeIn key={currentQuestion}>
            <div style={{ minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "#999",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}>
                Question {currentQuestion + 1} of {TOTAL}
              </p>

              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
                fontWeight: 400,
                color: "#0A0A10",
                lineHeight: 1.4,
                marginBottom: "2rem",
              }}>
                {currentQ.text}
              </h3>

              <textarea
                value={answers[currentQ.id] || ""}
                onChange={e => handleAnswer(e.target.value)}
                placeholder="Take your time. There are no wrong answers — only honest ones..."
                rows={5}
                style={{
                  width: "100%",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  padding: "1.2rem",
                  border: "1px solid #d5d0c5",
                  borderRadius: "2px",
                  background: "#fff",
                  color: "#333",
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={e => { e.target.style.borderColor = "#8B6914"; }}
                onBlur={e => { e.target.style.borderColor = "#d5d0c5"; }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
                <button
                  onClick={goPrev}
                  disabled={currentQuestion === 0}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.6rem 1.5rem",
                    background: "transparent",
                    border: "1px solid #ccc",
                    color: currentQuestion === 0 ? "#ccc" : "#666",
                    cursor: currentQuestion === 0 ? "default" : "pointer",
                  }}
                >
                  ← Previous
                </button>

                <button
                  onClick={goNext}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.6rem 1.5rem",
                    background: "#8B6914",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {currentQuestion === TOTAL - 1 ? "See My Dharma Profile →" : "Next →"}
                </button>
              </div>

              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "#aaa",
                textAlign: "center",
                marginTop: "1.5rem",
              }}>
                You can skip questions and come back — or leave them blank. The inquiry honors your pace.
              </p>
            </div>
          </FadeIn>
        </Section>

        {/* Footer credit */}
        <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #e5e0d5" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.1em" }}>
            Based on{" "}
            <a href="https://civilizationemerging.com/dharma-inquiry-original-version/" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>
              Daniel Schmachtenberger's Dharma Inquiry
            </a>
            {" "}· Curated by Tony Greenberg
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#bbb", marginTop: "0.5rem" }}>
            Full 3-hour version (200+ questions) available at civilizationemerging.com
          </p>
        </div>
      </div>
    </>
  );
}
