"use client";

import { useEffect, useMemo, useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourStyle.tsx — the 15-
// question aesthetic-identity assessment across 6 dimensions (Silhouette/
// Color Philosophy/Texture Sensitivity/Cultural Reference/
// Sustainability/Self-Expression). Real questions, the 6 real archetypes
// (with descriptions), and the real archetype-matching logic (a simple
// threshold cascade — legacy's own code comment admits "Simple mapping
// for demonstration," not a sophisticated match; ported as-is, crude but
// real) all unchanged. Two real inconsistencies found and normalized:
// (1) legacy's own inline styles used light/cream text (`#E8E4DC`) on a
// "transparent" background over `ThemedBackground`'s real `style` theme,
// which is a light warm-pink pastel gradient — nearly illegible text-on-
// background, and inconsistent with every other "Find Your X" page in
// this migration (all dark text on the light themed background). Ported
// using this migration's established light/dark-text convention instead.
// (2) legacy rendered `<JourneyTracker />` with no `variant` prop (so it
// defaulted to "dark"), while this page's own results screen is
// light-background — every other assessment in this migration explicitly
// passes `variant="light"` to match its own light results screen; done
// the same way here for consistency. Legacy's own "Journey Continues"
// block (3 links — "Find Your Signature Scent"/"Find Your Perfect Pen"/
// "Find Your Ideal Workspace" — all pointing at the identical `/find-my`
// URL, the same copy-paste bug already caught on `/find-your-diet`) isn't
// reproduced; `WhatsNext` already covers that spot.
type Dimension = "silhouette" | "colorPhilosophy" | "textureSensitivity" | "culturalReference" | "sustainability" | "selfExpression";

const DIMENSION_LABELS: Record<Dimension, string> = {
  silhouette: "Silhouette",
  colorPhilosophy: "Color Philosophy",
  textureSensitivity: "Texture Sensitivity",
  culturalReference: "Cultural Reference",
  sustainability: "Sustainability",
  selfExpression: "Self-Expression",
};

const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];
const INITIAL_SCORES: Record<Dimension, number> = { silhouette: 0, colorPhilosophy: 0, textureSensitivity: 0, culturalReference: 0, sustainability: 0, selfExpression: 0 };
const ACCENT = "#AD1457";

const ARCHETYPES = {
  minimalist: { name: "The Minimalist", description: "Purity of form, clarity of purpose. You appreciate clean lines, muted palettes, and the power of reduction." },
  maximalist: { name: "The Maximalist", description: "More is more. Life is a canvas, and you paint it with bold colors, vibrant patterns, and expressive layers." },
  vintageCurator: { name: "The Vintage Curator", description: "Every piece tells a story. You are drawn to the history, craftsmanship, and soul of secondhand and heritage garments." },
  streetwearArchitect: { name: "The Streetwear Architect", description: "The city is your runway. You build your identity from the ground up with iconic brands, cultural codes, and urban functionality." },
  tailoredClassic: { name: "The Tailored Classic", description: "Enduring elegance, crafted to last. You invest in timeless silhouettes, impeccable tailoring, and the quiet confidence of quality." },
  avantGarde: { name: "The Avant-Garde", description: "Dress to challenge, not to conform. You use clothing as a medium for artistic experimentation, pushing boundaries of form and function." },
} as const;

const QUESTIONS: { question: string; options: { text: string; scores: Partial<Record<Dimension, number>> }[] }[] = [
  { question: "When you enter a clothing store, what are you first drawn to?", options: [
    { text: "The overall color story and palette.", scores: { colorPhilosophy: 2 } },
    { text: "The unique shapes and cuts of the garments.", scores: { silhouette: 2 } },
    { text: "The feel of the fabrics on the rack.", scores: { textureSensitivity: 2 } },
    { text: "Pieces that evoke a specific era or film.", scores: { culturalReference: 2 } },
  ] },
  { question: "Your ideal weekend outfit is...", options: [
    { text: "Perfectly tailored trousers and a crisp shirt.", scores: { silhouette: 1, sustainability: 1 } },
    { text: "A rare band t-shirt and worn-in jeans.", scores: { culturalReference: 2, sustainability: 1 } },
    { text: "A deconstructed jacket that plays with proportion.", scores: { selfExpression: 2, silhouette: 1 } },
    { text: "A monochrome sweatsuit in luxurious cotton.", scores: { textureSensitivity: 1, colorPhilosophy: -1 } },
  ] },
  { question: "How do you approach color in your wardrobe?", options: [
    { text: "A strict, curated palette of neutrals.", scores: { colorPhilosophy: -2, silhouette: 1 } },
    { text: "Bold, unexpected color combinations.", scores: { colorPhilosophy: 2, selfExpression: 1 } },
    { text: "Colors with a vintage or faded quality.", scores: { culturalReference: 1, sustainability: 1 } },
    { text: "Color is secondary to texture and material.", scores: { textureSensitivity: 2, colorPhilosophy: -1 } },
  ] },
  { question: "The most important factor when buying a new piece is...", options: [
    { text: "Will I be able to wear this in 10 years?", scores: { sustainability: 2 } },
    { text: "Does this piece feel like a work of art?", scores: { selfExpression: 2 } },
    { text: "Is it made from a natural, interesting material?", scores: { textureSensitivity: 2 } },
    { text: "Does it fit a specific aesthetic I love?", scores: { culturalReference: 2 } },
  ] },
  { question: "A friend asks for your style advice. You tell them...", options: [
    { text: "'Invest in classics. Quality over quantity.'", scores: { sustainability: 2, silhouette: 1 } },
    { text: "'Don't be afraid to clash patterns and colors.'", scores: { selfExpression: 1, colorPhilosophy: 2 } },
    { text: "'Your clothes should be a conversation starter.'", scores: { selfExpression: 2 } },
    { text: "'Find a uniform and perfect it.'", scores: { silhouette: 2, colorPhilosophy: -1 } },
  ] },
  { question: "Which accessory resonates most with you?", options: [
    { text: "A single, beautifully crafted leather belt.", scores: { silhouette: 1, sustainability: 1 } },
    { text: "A stack of mismatched, colorful bracelets.", scores: { colorPhilosophy: 1, selfExpression: 1 } },
    { text: "A vintage silk scarf with a story.", scores: { culturalReference: 2, sustainability: 1 } },
    { text: "An architecturally interesting piece of jewelry.", scores: { silhouette: 2, selfExpression: 1 } },
  ] },
  { question: "Your closet is organized by...", options: [
    { text: "Color, creating a visual rainbow.", scores: { colorPhilosophy: 2 } },
    { text: "Garment type, then by neutral shade.", scores: { silhouette: 1 } },
    { text: "Era or aesthetic.", scores: { culturalReference: 2 } },
    { text: "It's a creative chaos I understand.", scores: { selfExpression: 1 } },
  ] },
  { question: "What's your opinion on logos?", options: [
    { text: "I prefer them to be invisible or non-existent.", scores: { silhouette: 1 } },
    { text: "I appreciate them as part of a design's history.", scores: { culturalReference: 1, selfExpression: 1 } },
    { text: "I like them big and bold, as a graphic element.", scores: { colorPhilosophy: 1, selfExpression: 1 } },
    { text: "The only name that matters is the tailor's.", scores: { sustainability: 1, silhouette: 1 } },
  ] },
  { question: "The texture you love most is...", options: [
    { text: "Smooth, crisp, cool-to-the-touch cotton.", scores: { textureSensitivity: 2, silhouette: 1 } },
    { text: "Chunky, hand-knit wool or complex jacquard.", scores: { textureSensitivity: 2, colorPhilosophy: 1 } },
    { text: "Soft, worn-in denim or buttery, aged leather.", scores: { sustainability: 2, culturalReference: 1 } },
    { text: "Unconventional materials like neoprene or vinyl.", scores: { selfExpression: 2, silhouette: 1 } },
  ] },
  { question: "When you think of an 'investment piece,' you think of...", options: [
    { text: "A perfectly tailored wool coat.", scores: { sustainability: 2, silhouette: 2 } },
    { text: "A rare, archival designer piece.", scores: { culturalReference: 2, sustainability: 1 } },
    { text: "A piece of wearable art from a new designer.", scores: { selfExpression: 2 } },
    { text: "The most comfortable, high-quality cashmere.", scores: { textureSensitivity: 2 } },
  ] },
  { question: "Your style icon is likely...", options: [
    { text: "An old Hollywood star or a historical figure.", scores: { culturalReference: 2 } },
    { text: "A modern artist or architect.", scores: { selfExpression: 2 } },
    { text: "A fashion editor known for timeless taste.", scores: { silhouette: 2 } },
    { text: "Someone anonymous who looks amazing.", scores: { selfExpression: 1 } },
  ] },
  { question: "How do you feel about trends?", options: [
    { text: "I follow them and enjoy interpreting them.", scores: { culturalReference: 1, selfExpression: 1 } },
    { text: "I'm more interested in timeless pieces.", scores: { sustainability: 2, silhouette: 1 } },
    { text: "I'm usually ahead of them or ignoring them.", scores: { selfExpression: 2 } },
    { text: "I prefer styles from the past over what's current.", scores: { culturalReference: 2, sustainability: 1 } },
  ] },
  { question: "The silhouette that appeals most is...", options: [
    { text: "Sharp, clean lines and structured shapes.", scores: { silhouette: 2 } },
    { text: "Flowing, draped, and voluminous.", scores: { silhouette: 1, selfExpression: 1 } },
    { text: "Asymmetrical, deconstructed, and unexpected.", scores: { silhouette: 2, selfExpression: 2 } },
    { text: "A comfortable, functional, utilitarian shape.", scores: { silhouette: 1, sustainability: 1 } },
  ] },
  { question: "You're shopping for a special occasion. You choose...", options: [
    { text: "A stunning vintage gown no one else will have.", scores: { culturalReference: 2, sustainability: 2 } },
    { text: "A sleek, minimalist jumpsuit in a bold color.", scores: { silhouette: 2, colorPhilosophy: 1 } },
    { text: "A custom-tailored suit that fits like a glove.", scores: { silhouette: 2, sustainability: 1 } },
    { text: "A riot of color, pattern, and texture.", scores: { colorPhilosophy: 2, selfExpression: 2 } },
  ] },
  { question: "Your philosophy on getting dressed is:", options: [
    { text: "'Less is more.'", scores: { silhouette: 1, colorPhilosophy: -1 } },
    { text: "'Dress for the job you want.'", scores: { silhouette: 1, sustainability: 1 } },
    { text: "'Why blend in when you were born to stand out?'", scores: { selfExpression: 2, colorPhilosophy: 1 } },
    { text: "'My clothes are my armor and my biography.'", scores: { culturalReference: 2, selfExpression: 1 } },
  ] },
];

function pickArchetype(scores: Record<Dimension, number>) {
  if (scores.silhouette > 5 && scores.sustainability > 4) return ARCHETYPES.tailoredClassic;
  if (scores.culturalReference > 5 && scores.sustainability > 4) return ARCHETYPES.vintageCurator;
  if (scores.selfExpression > 5 && scores.silhouette > 4) return ARCHETYPES.avantGarde;
  if (scores.colorPhilosophy > 4 && scores.selfExpression > 4) return ARCHETYPES.maximalist;
  if (scores.culturalReference > 4 && scores.selfExpression > 3) return ARCHETYPES.streetwearArchitect;
  return ARCHETYPES.minimalist;
}

export function FindYourStyleQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const { markComplete } = useJourneyProgress();

  const handleAnswer = (answerScores: Partial<Record<Dimension, number>>) => {
    const next = { ...scores };
    for (const dim in answerScores) next[dim as Dimension] += answerScores[dim as Dimension] ?? 0;
    setScores(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setPhase("results");
  };

  const archetype = useMemo(() => (phase === "results" ? pickArchetype(scores) : null), [phase, scores]);

  useEffect(() => {
    if (phase === "results") markComplete("find-your-style");
  }, [phase, markComplete]);

  const chartMax = Math.max(...Object.values(scores), 1);

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="style" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Style"
          subtitle="Style isn't what you wear. It's what you can't hide."
          description="Beyond trends, beyond brands, beyond what the algorithm thinks you should buy. This assessment maps your aesthetic identity across six dimensions — revealing the visual language that's authentically yours. Fifteen questions to find the style that was always there."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={[
            "Your style archetype and aesthetic DNA",
            "A dimensional map of your visual identity",
            "Understanding of your relationship with self-expression",
            "Curated style direction that actually fits who you are",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="relative z-1 mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="mb-2 font-mono text-sm text-[#8B7B6B]">
            Question {step + 1} / {QUESTIONS.length}
          </p>
          <h2 className="mb-10 font-heading text-4xl">{QUESTIONS[step].question}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.scores)}
                className="border border-black/10 p-8 text-left text-lg transition-colors hover:bg-black/5"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && <EmailGate assessmentSlug="style" onUnlock={() => setEmailGated(true)} />}

      {phase === "results" && emailGated && archetype && (
        <div className="relative z-1 mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-mono text-sm text-[#8B7B6B] uppercase">Your Style Archetype is</h2>
          <h1 className="my-2 font-heading text-6xl text-brand-gold">{archetype.name}</h1>
          <p className="mx-auto mb-12 max-w-150 text-lg text-[#8B7B6B]">{archetype.description}</p>

          <div className="flex flex-wrap items-center justify-center gap-16">
            <AssessmentRadarChart scores={scores} max={chartMax} accentColor={ACCENT} />
            <div>
              <h3 className="mb-4 text-left font-heading text-2xl text-brand-gold">Dimension Scores</h3>
              <ul className="list-none p-0 text-left font-mono">
                {DIMENSIONS.map((dim) => (
                  <li key={dim} className="mb-2">
                    <span className="text-[#8B7B6B]">{DIMENSION_LABELS[dim]}:</span> {scores[dim]}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <JourneyTracker variant="light" currentAssessmentId="find-your-style" />
          </div>
        </div>
      )}

      <WhatsNext />
    </div>
  );
}
