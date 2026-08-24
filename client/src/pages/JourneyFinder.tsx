import { useState } from "react";
import { Section, FadeIn, Eyebrow, Divider } from "@/components/Editorial";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

/* ─────────────────────────────────────────────
   THE FIVE QUESTIONS — NLP-driven, presuppositional
   Each question maps to weighted journey archetypes
   ───────────────────────────────────────────── */

interface Choice {
  label: string;
  weights: Record<string, number>;
}

interface Question {
  id: number;
  stem: string;         // NLP presuppositional stem
  prompt: string;       // the actual question
  choices: Choice[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    stem: "Show me the deepest insight about...",
    prompt: "What keeps you up at 2 a.m. — the question you can't stop circling?",
    choices: [
      { label: "Why the systems that run the world seem designed to break people", weights: { thinker: 3, operator: 1, impact: 2 } },
      { label: "How to build something that actually matters — and make it last", weights: { operator: 3, impact: 2, body: 1 } },
      { label: "Whether the person next to me really sees me — and whether I see them", weights: { relationship: 3, body: 1, thinker: 1 } },
      { label: "What's happening inside my own body and mind — and how to optimize it", weights: { body: 3, thinker: 1, relationship: 1 } },
      { label: "Why people with power keep getting away with things that offend my soul", weights: { crusade: 3, impact: 2, thinker: 1 } },
    ],
  },
  {
    id: 2,
    stem: "I want to become someone who...",
    prompt: "When you imagine the version of yourself that makes you proud — what are they doing?",
    choices: [
      { label: "Connecting ideas that nobody else sees are related — and changing the conversation", weights: { thinker: 3, operator: 1 } },
      { label: "Running an operation so clean it makes competitors nervous and partners loyal", weights: { operator: 3, crusade: 1 } },
      { label: "Loving fearlessly — building a partnership that's both sacred and scientific", weights: { relationship: 3, body: 1 } },
      { label: "Living in a body that's a temple — sharp mind, clean blood, radiant energy", weights: { body: 3, impact: 1 } },
      { label: "Holding the powerful accountable — being the person who says what everyone's thinking", weights: { crusade: 3, impact: 1 } },
    ],
  },
  {
    id: 3,
    stem: "The thing I wish someone had told me sooner is...",
    prompt: "Which of these would have changed everything if you'd understood it ten years ago?",
    choices: [
      { label: "That consciousness isn't woo-woo — it's the operating system underneath everything", weights: { thinker: 3, body: 2 } },
      { label: "That most businesses fail not from bad ideas but from bad vendor relationships and hidden fees", weights: { operator: 3, crusade: 2 } },
      { label: "That love has a science — attachment styles, communication patterns, the whole architecture", weights: { relationship: 3, thinker: 1 } },
      { label: "That what you eat, breathe, and absorb is literally rewriting your DNA every day", weights: { body: 3, crusade: 1 } },
      { label: "That profit and purpose were never supposed to be different departments", weights: { impact: 3, operator: 2 } },
    ],
  },
  {
    id: 4,
    stem: "Connect me to the people who...",
    prompt: "At a dinner party of extraordinary humans, which table are you drawn to?",
    choices: [
      { label: "The philosophers arguing about whether AI has a soul — and the neuroscientist who thinks they're both wrong", weights: { thinker: 3, body: 1 } },
      { label: "The founders swapping war stories about scaling, negotiating, and the deals that got away", weights: { operator: 3, impact: 1 } },
      { label: "The couple who've been together 30 years and still look at each other like it's the first date", weights: { relationship: 3, impact: 1 } },
      { label: "The biohacker, the breathwork coach, and the sommelier debating whether wine counts as medicine", weights: { body: 3, relationship: 1 } },
      { label: "The investigative journalist, the B Corp founder, and the person who just sued their gym", weights: { crusade: 3, operator: 1 } },
    ],
  },
  {
    id: 5,
    stem: "The legacy I'm building looks like...",
    prompt: "Fast-forward to the end. What do they say about you at the gathering?",
    choices: [
      { label: "\"They saw the pattern before anyone else — and had the courage to name it.\"", weights: { thinker: 3, impact: 1 } },
      { label: "\"They built something real — and everyone who worked with them was better for it.\"", weights: { operator: 3, relationship: 1 } },
      { label: "\"They loved deeply, and the people around them became more themselves because of it.\"", weights: { relationship: 3, body: 1 } },
      { label: "\"They treated their body like a sacred instrument — and the music showed.\"", weights: { body: 3, thinker: 1 } },
      { label: "\"They never looked away from injustice — and they made the bastards pay.\"", weights: { crusade: 3, impact: 2 } },
    ],
  },
];

/* ─────────────────────────────────────────────
   JOURNEY ARCHETYPES — each maps to a curated reading path
   ───────────────────────────────────────────── */

interface JourneyResult {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  articles: { slug: string; title: string; why: string }[];
  journeyLink: string;         // link to the full journey on /journeys
  externalLink?: string;       // optional link to external assessment
  externalLabel?: string;
}

const JOURNEYS: Record<string, JourneyResult> = {
  thinker: {
    key: "thinker",
    title: "The Thinker's Thread",
    subtitle: "For the philosophically restless",
    description: "You see patterns where others see noise. Your mind moves between consciousness research, decentralized governance, and the question of what it means to be human in a century that keeps redefining the term. Start here.",
    icon: "◉",
    accent: "#6B4C8A",
    articles: [
      { slug: "boiling-the-human-summit-harvard-kurzweil", title: "Boiling the Human — H+ Summit / Harvard-Kurzweil", why: "The talk that started it all — consciousness, technology, and the question nobody wanted to ask" },
      { slug: "psychedelics-could-become-extractive-capitalism", title: "Psychedelics Could Become Extractive Capitalism", why: "What happens when Wall Street discovers consciousness expansion" },
      { slug: "the-way-of-dao", title: "The Way of DAO", why: "Decentralized governance as a mirror for decentralized selfhood" },
      { slug: "human-operating-system", title: "Human Operating System", why: "The firmware update you didn't know you needed" },
      { slug: "the-molecule-as-mirror-from-substance-to-service", title: "The Molecule as Mirror", why: "From substance to service — the psychedelic thesis" },
      { slug: "a-historical-perspective-on-blockchain", title: "A Historical Perspective on Blockchain", why: "The long arc of decentralization — and why it matters to thinkers" },
    ],
    journeyLink: "/journeys",
  },
  operator: {
    key: "operator",
    title: "The Operator's Playbook",
    subtitle: "For builders who need the objective lever",
    description: "You run things. You build things. You've been burned by bad vendors and worse advice. You need someone who's sat across from Microsoft, Disney, and Goldman Sachs for 25 years. This path is the business case.",
    icon: "⬡",
    accent: "#8B6914",
    articles: [
      { slug: "customer-service-key-to-business-success", title: "Customer Service: The Key to Business Success", why: "The most-read business piece on the site — because everyone's been on the wrong end of bad service" },
      { slug: "davos-2022-world-economic-forum-here-we-come", title: "Davos 2022 — World Economic Forum", why: "What actually happens when the world's operators gather in one room" },
      { slug: "why-good-service-is-all-about-trust", title: "Why Good Service Is All About Trust", why: "The trust equation that separates operators from pretenders" },
      { slug: "profiling-the-public-cloud-buyer", title: "Profiling the Public Cloud Buyer", why: "25 years of benchmarking distilled into one framework" },
      { slug: "mastering-human-and-business-development", title: "Mastering Human & Business Development", why: "The intersection of personal growth and organizational scaling" },
      { slug: "from-supply-chain-to-the-blockchain-heal", title: "From Supply Chain to the Blockchain", why: "How infrastructure thinking applies to everything — including healing" },
    ],
    journeyLink: "/journeys",
  },
  relationship: {
    key: "relationship",
    title: "The Relationship Circuit",
    subtitle: "For anyone who suspects love has a science — and a sacred geometry",
    description: "A friend texted from Jerusalem asking about matchmaking. That text lit years of research on fire. This path traces the neuroscience of magnetic partnership, the arithmetic of mutual value, and the ties that bind us in a century trying to untie everything.",
    icon: "∞",
    accent: "#C4536A",
    articles: [
      { slug: "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", title: "Love as Dharma — A Science-Based Playbook", why: "The article that started with a text from Jerusalem and ended with a mirror" },
      { slug: "the-ties-that-bind-interpersonal-relationships", title: "The Ties That Bind", why: "Interpersonal relationships amended for a century that keeps trying to untie them" },
      { slug: "the-arithmetic-of-relationships", title: "The Arithmetic of Relationships", why: "The math of mutual value — because love deserves a spreadsheet too" },
      { slug: "the-decay-of-modern-day-communication", title: "The Decay of Modern Day Communication", why: "Why we stopped talking — and what it costs us" },
      { slug: "only-time-buys-trust", title: "Trust Us? Are You Really My Friend?", why: "The trust equation underneath every relationship that matters" },
      { slug: "apologize", title: "I Apologize. Nix 'I Am Sorry' From Our Lexicon", why: "The linguistics of repair — and why most apologies make things worse" },
    ],
    journeyLink: "/journeys",
    externalLink: "https://intimacyassess-tcir3hon.manus.space/assessment",
    externalLabel: "Take the Full Intimacy Intelligence Assessment",
  },
  body: {
    key: "body",
    title: "The Body Electric",
    subtitle: "For the biohacker who wants receipts",
    description: "You own an Oura Ring. You've Googled 'peptides' at 2am. You suspect your doctor knows less about your blood than you do. This path connects health investments, alt therapy scorecards, psychedelic medicine, and longevity protocols — with measurement that makes it science, not woo-woo.",
    icon: "◈",
    accent: "#2E8B57",
    articles: [
      { slug: "forever-chemicals-in-my-blood-pfas-and-microplastics", title: "Forever Chemicals in My Blood", why: "What happens when you actually test for what's inside you" },
      { slug: "elixir-of-life-device-and-journey", title: "Elixir of Life Device and Journey", why: "The longevity stack — devices, protocols, and the quest for more time" },
      { slug: "the-molecule-as-mirror-from-substance-to-service", title: "The Molecule as Mirror", why: "Psychedelic medicine as biochemistry optimization" },
      { slug: "india-my-virtual-soul-home", title: "India: My Virtual Soul & Home", why: "Where the body meets the spirit — and the food is medicine" },
      { slug: "an-ode-to-kusaki-where-plants-become-culinary-masterpieces", title: "An Ode to Kusaki", why: "When plants become culinary masterpieces — food as sacred practice" },
      { slug: "eco-vegan-realities-seriesethical-economic", title: "Eco Vegan Realities", why: "The ethical economics of what goes into your body" },
    ],
    journeyLink: "/journeys",
  },
  impact: {
    key: "impact",
    title: "The Impact Trail",
    subtitle: "For regenerative capitalists and reluctant optimists",
    description: "You believe profit and purpose shouldn't be different departments. You've heard about tokenization but aren't sure if it's real. This path walks through ImpactSoul's ABIT model, live token ecosystems, and why a dinosaur skeleton might fund a school in rural India.",
    icon: "◎",
    accent: "#D4B96A",
    articles: [
      { slug: "return-on-investment-going-green-going-green-2", title: "Return on Investment — Going Green", why: "The most-read impact piece — because ROI and regeneration aren't mutually exclusive" },
      { slug: "energy-as-impact", title: "Energy as Impact", why: "Reframing energy from consumption to contribution" },
      { slug: "would-you-hire-someone-who-led-a-rebellion", title: "Would You Hire Someone Who Led a Rebellion?", why: "The character test for impact-driven leadership" },
      { slug: "triple-bottom-line-of-soul-gregory-markel", title: "Triple Bottom Line of Soul", why: "Trust + Empathy = Business + Future" },
      { slug: "the-tug-of-war-ethical-vs-economic-decisions", title: "The Tug of War — Ethical vs. Economic", why: "The tension that defines every meaningful business decision" },
      { slug: "powering-purpose-driven-innovation", title: "Powering Purpose-Driven Innovation", why: "The engine room of impact at breakneck speed" },
    ],
    journeyLink: "/journeys",
  },
  crusade: {
    key: "crusade",
    title: "The Crusade Files",
    subtitle: "For the righteously pissed off",
    description: "You've been screwed by a company with dark patterns and fake reviews. You didn't write a Yelp review — you wanted to burn the building down (metaphorically). This path is for consumer advocates, whistleblowers, and anyone who believes the crusade IS the product.",
    icon: "⚔",
    accent: "#B22222",
    articles: [
      { slug: "hiding-fees-tips-in-the-transparent-age", title: "Hiding Fees & Tips in the Transparent Age", why: "The most-read crusade — because hidden fees are a moral failure" },
      { slug: "dmn8-the-most-beautiful-crooked-gym-in-the-world", title: "DMN8: The Most Beautiful Crooked Gym", why: "When aesthetics mask exploitation — the full investigation" },
      { slug: "how-to-alienate-a-loyal-vegan", title: "How to Alienate a Loyal Vegan", why: "Decades of loyalty destroyed by one act of corporate indifference" },
      { slug: "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", title: "Restaurants Beware of Vegans", why: "The deception economy in food — and why it matters" },
      { slug: "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", title: "The Butcher's Daughter — The Carbon Toll", why: "When your favorite restaurant is secretly destroying the planet" },
      { slug: "forward-health-is-a-sideway-step-at-best", title: "Forward Health Is a Sideways Step", why: "Healthcare disruption that disrupts nothing" },
    ],
    journeyLink: "/journeys",
  },
};

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */

export default function JourneyFinder() {
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = result
  const [sessionId] = useState(() => crypto.randomUUID());
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const totalQuestions = QUESTIONS.length;

  function handleSelect(choiceIndex: number) {
    setSelectedChoice(choiceIndex);
  }

  function handleNext() {
    if (selectedChoice === null) return;
    setAnswers(prev => ({ ...prev, [step]: selectedChoice }));
    setSelectedChoice(null);
    setStep(step + 1);
  }

  function handleBack() {
    if (step <= 1) return;
    setSelectedChoice(answers[step - 1] ?? null);
    setStep(step - 1);
  }

  function getResult(): JourneyResult {
    const scores: Record<string, number> = {};
    Object.entries(answers).forEach(([qStep, choiceIdx]) => {
      const q = QUESTIONS[parseInt(qStep) - 1];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.weights).forEach(([key, weight]) => {
        scores[key] = (scores[key] || 0) + weight;
      });
    });
    // Find the top journey
    let topKey = "thinker";
    let topScore = 0;
    Object.entries(scores).forEach(([key, score]) => {
      if (score > topScore) { topKey = key; topScore = score; }
    });
    return JOURNEYS[topKey];
  }

  function getAllScores(): { key: string; score: number; journey: JourneyResult }[] {
    const scores: Record<string, number> = {};
    Object.entries(answers).forEach(([qStep, choiceIdx]) => {
      const q = QUESTIONS[parseInt(qStep) - 1];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.weights).forEach(([key, weight]) => {
        scores[key] = (scores[key] || 0) + weight;
      });
    });
    return Object.entries(JOURNEYS)
      .map(([key, journey]) => ({ key, score: scores[key] || 0, journey }))
      .sort((a, b) => b.score - a.score);
  }

  // ── INTRO ──
  if (step === 0) {
    return (
      <>
        <SEO
          title="Find Your Journey — Tony Greenberg"
          description="Five questions. Your personalized reading path through 91 essays on consciousness, business, relationships, health, impact, and justice."
        indexable={true}
        />
        <div style={{ background: "#0A0A10", minHeight: "100vh" }}>
          <div style={{ padding: "clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 6vw, 5rem)" }}>
            <Section>
              <FadeIn>
                <Eyebrow>5 Questions. Your Path.</Eyebrow>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                  fontWeight: 400,
                  color: "#FAFAF7",
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                  maxWidth: "700px",
                }}>
                  Not what you <em style={{ color: "#D4B96A", fontStyle: "italic" }}>should</em> read.<br />
                  What you <em style={{ color: "#D4B96A", fontStyle: "italic" }}>can't stop</em> thinking about.
                </h1>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1.15rem",
                  color: "#999",
                  lineHeight: 1.8,
                  maxWidth: "580px",
                  marginBottom: "2.5rem",
                }}>
                  Ninety-one essays. Six territories. One question: where does your mind go when nobody's watching?
                  Answer five questions — honestly, not aspirationally — and we'll map you to the reading journey
                  that matches where you actually are. Not where you think you should be.
                </p>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                  {["2 minutes", "5 questions", "Your path"].map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#D4B96A",
                      border: "1px solid rgba(212,185,106,0.3)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "2px",
                    }}>{tag}</span>
                  ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#0A0A10",
                    background: "#D4B96A",
                    border: "none",
                    padding: "1rem 2.5rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#E8D08E"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#D4B96A"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Begin →
                </button>
              </FadeIn>
            </Section>
          </div>

          {/* How it works */}
          <div style={{ borderTop: "1px solid rgba(212,185,106,0.15)", padding: "3rem 0" }}>
            <Section>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                {[
                  { num: "01", label: "Answer honestly", desc: "Not who you want to be. Who you are at 2 a.m." },
                  { num: "02", label: "Get your map", desc: "We score across six territories and find your primary path." },
                  { num: "03", label: "Start reading", desc: "Six curated articles — the ones that'll hit hardest for you." },
                ].map(s => (
                  <div key={s.num}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#D4B96A", letterSpacing: "0.15em" }}>{s.num}</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#FAFAF7", margin: "0.5rem 0 0.3rem", fontWeight: 400 }}>{s.label}</h3>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#777", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </>
    );
  }

  // ── QUESTIONS ──
  if (step >= 1 && step <= totalQuestions) {
    const q = QUESTIONS[step - 1];
    const progress = (step / totalQuestions) * 100;

    return (
      <div style={{ background: "#0A0A10", minHeight: "100vh" }}>
        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "rgba(212,185,106,0.15)", zIndex: 50 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#D4B96A", transition: "width 0.5s ease" }} />
        </div>

        <div style={{ padding: "clamp(4rem, 8vw, 7rem) 0 3rem" }}>
          <Section>
            <FadeIn key={step}>
              {/* Question counter */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#D4B96A",
                }}>{q.stem}</span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#555",
                }}>{step} / {totalQuestions}</span>
              </div>

              {/* Question */}
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                fontWeight: 400,
                color: "#FAFAF7",
                lineHeight: 1.2,
                marginBottom: "2.5rem",
                maxWidth: "650px",
              }}>
                {q.prompt}
              </h2>

              {/* Choices */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "650px" }}>
                {q.choices.map((choice, i) => {
                  const isSelected = selectedChoice === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        padding: "1.2rem 1.5rem",
                        background: isSelected ? "rgba(212,185,106,0.12)" : "rgba(255,255,255,0.03)",
                        border: isSelected ? "1px solid rgba(212,185,106,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }
                      }}
                    >
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        color: isSelected ? "#D4B96A" : "#555",
                        marginTop: "0.15rem",
                        flexShrink: 0,
                        width: "1.5rem",
                        height: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isSelected ? "1px solid #D4B96A" : "1px solid #333",
                        borderRadius: "50%",
                        transition: "all 0.25s ease",
                      }}>
                        {isSelected ? "✓" : String.fromCharCode(65 + i)}
                      </span>
                      <span style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        color: isSelected ? "#FAFAF7" : "#AAA",
                        lineHeight: 1.5,
                        transition: "color 0.25s ease",
                      }}>
                        {choice.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem", maxWidth: "650px" }}>
                <button
                  onClick={handleBack}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: step > 1 ? "#777" : "transparent",
                    background: "none",
                    border: "none",
                    cursor: step > 1 ? "pointer" : "default",
                    padding: "0.5rem 0",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedChoice === null}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: selectedChoice !== null ? "#0A0A10" : "#555",
                    background: selectedChoice !== null ? "#D4B96A" : "rgba(255,255,255,0.05)",
                    border: "none",
                    padding: "0.8rem 2rem",
                    cursor: selectedChoice !== null ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                  }}
                >
                  {step === totalQuestions ? "See My Path →" : "Next →"}
                </button>
              </div>
            </FadeIn>
          </Section>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  const result = getResult();
  const allScores = getAllScores();
  const maxScore = allScores[0]?.score || 1;

  return (
    <>
      <SEO
        title={`Your Journey: ${result.title} — Tony Greenberg`}
        description={result.description}
        indexable={true}
      />
      <div style={{ background: "#0A0A10", minHeight: "100vh" }}>
        {/* Hero result */}
        <div style={{ padding: "clamp(4rem, 8vw, 7rem) 0 3rem" }}>
          <Section>
            <FadeIn>
              <Eyebrow>Your Path Has Been Mapped</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2.5rem", color: result.accent }}>{result.icon}</span>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 400,
                  color: "#FAFAF7",
                  lineHeight: 1.1,
                }}>
                  {result.title}
                </h1>
              </div>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: result.accent,
                marginBottom: "1.5rem",
              }}>
                {result.subtitle}
              </p>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.15rem",
                color: "#999",
                lineHeight: 1.8,
                maxWidth: "600px",
                marginBottom: "2rem",
              }}>
                {result.description}
              </p>
            </FadeIn>
          </Section>
        </div>

        {/* Score breakdown */}
        <div style={{ borderTop: "1px solid rgba(212,185,106,0.1)", padding: "2.5rem 0" }}>
          <Section>
            <FadeIn>
              <h3 style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "1.5rem",
              }}>Your Territory Map</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxWidth: "500px" }}>
                {allScores.map(({ journey, score }) => (
                  <div key={journey.key} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.85rem",
                      color: score === maxScore ? "#FAFAF7" : "#666",
                      width: "140px",
                      flexShrink: 0,
                    }}>
                      {journey.icon} {journey.title.replace("The ", "")}
                    </span>
                    <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${maxScore > 0 ? (score / maxScore) * 100 : 0}%`,
                        background: journey.accent,
                        borderRadius: "2px",
                        transition: "width 1s ease",
                      }} />
                    </div>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      color: "#555",
                      width: "30px",
                      textAlign: "right",
                    }}>{score}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </Section>
        </div>

        <Divider />

        {/* Curated articles */}
        <div style={{ padding: "2.5rem 0" }}>
          <Section>
            <FadeIn>
              <h3 style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "2rem",
              }}>Your Reading Path — Start Here</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "650px" }}>
                {result.articles.map((article, i) => (
                  <Link key={article.slug} href={`/blog/${article.slug}`}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2rem 1fr",
                        gap: "1rem",
                        padding: "1.2rem 1.5rem",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(212,185,106,0.06)";
                        e.currentTarget.style.borderColor = "rgba(212,185,106,0.2)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      }}
                    >
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        color: result.accent,
                        marginTop: "0.2rem",
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.05rem",
                          fontWeight: 400,
                          color: "#FAFAF7",
                          marginBottom: "0.3rem",
                        }}>{article.title}</h4>
                        <p style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.85rem",
                          color: "#777",
                          lineHeight: 1.5,
                        }}>{article.why}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </Section>
        </div>

        {/* External assessment link */}
        {result.externalLink && (
          <div style={{ borderTop: "1px solid rgba(212,185,106,0.1)", padding: "2.5rem 0" }}>
            <Section>
              <FadeIn>
                <div style={{
                  padding: "2rem",
                  background: `linear-gradient(135deg, ${result.accent}11, transparent)`,
                  border: `1px solid ${result.accent}33`,
                  borderRadius: "4px",
                  maxWidth: "650px",
                }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    color: "#FAFAF7",
                    marginBottom: "0.8rem",
                  }}>Go Deeper</h3>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    color: "#999",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}>
                    This 5-question finder mapped your territory. The full assessment maps your terrain —
                    15 questions across attachment, communication, erotic alignment, values, and emotional intelligence.
                  </p>
                  <a
                    href={result.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.8rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#0A0A10",
                      background: result.accent,
                      padding: "0.8rem 2rem",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {result.externalLabel} →
                  </a>
                </div>
              </FadeIn>
            </Section>
          </div>
        )}

        {/* CTA: Explore other journeys */}
        <div style={{ borderTop: "1px solid rgba(212,185,106,0.1)", padding: "3rem 0" }}>
          <Section>
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "#FAFAF7",
                  marginBottom: "1rem",
                }}>
                  Curious about the other paths?
                </h3>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1rem",
                  color: "#777",
                  marginBottom: "2rem",
                }}>
                  Your secondary scores suggest you'd also resonate with{" "}
                  <strong style={{ color: allScores[1]?.journey.accent }}>{allScores[1]?.journey.title}</strong>
                  {allScores[2]?.score > 0 && (
                    <> and <strong style={{ color: allScores[2]?.journey.accent }}>{allScores[2]?.journey.title}</strong></>
                  )}.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/journeys">
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.8rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#D4B96A",
                      border: "1px solid rgba(212,185,106,0.3)",
                      padding: "0.8rem 2rem",
                      cursor: "pointer",
                      display: "inline-block",
                      transition: "all 0.3s ease",
                    }}>
                      Explore All Journeys
                    </span>
                  </Link>
                  <Link href="/living-declaration">
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.8rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#999",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "0.8rem 2rem",
                      cursor: "pointer",
                      display: "inline-block",
                      transition: "all 0.3s ease",
                    }}>
                      Read the Manifesto
                    </span>
                  </Link>
                  <Link href="/community">
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.8rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#999",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "0.8rem 2rem",
                      cursor: "pointer",
                      display: "inline-block",
                      transition: "all 0.3s ease",
                    }}>
                      Join the Community
                    </span>
                  </Link>
                </div>

                {/* Retake */}
                <button
                  onClick={() => { setStep(0); setAnswers({}); setSelectedChoice(null); }}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#555",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "2rem",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="find-your-me"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ result: result })}
              totalScore={null}
            />

                  ↻ Retake Assessment
                </button>
              </div>
            </FadeIn>
          </Section>
        </div>
      </div>
    </>
  );
}
