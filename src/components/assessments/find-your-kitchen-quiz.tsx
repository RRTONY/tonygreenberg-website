"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourKitchen.tsx — the
// 15-question culinary-identity assessment. Real questions, the 6 real
// archetypes (with descriptions), and the real dual-tracking scoring
// (each answer's score keys split into archetype tallies vs. the 6
// separate radar-chart dimensions, exactly as legacy's own
// `calculateResults` did) all ported unchanged. Legacy's own UX here is
// genuinely different from the other "Find Your X" quizzes — all 15
// questions render on one page at once rather than paginated one-at-a-
// time — kept as-is since that's a real (if unusual) legacy design
// choice, not a bug. Legacy's own "Journey Continues" links here are
// real, distinct destinations (unlike the broken duplicate-link pattern
// found and dropped on `/find-your-diet`/`/find-your-love-language`), so
// they're ported as-is, including the one to the not-yet-built
// `/find-your-style`.
type ArchetypeName =
  | "The Fermentation Alchemist"
  | "The Farm-to-Table Purist"
  | "The Fusion Explorer"
  | "The Pastry Architect"
  | "The Fire Master"
  | "The Communal Cook";

type Dimension =
  | "Technique Mastery"
  | "Ingredient Sourcing"
  | "Cultural Curiosity"
  | "Presentation"
  | "Improvisation"
  | "Hospitality";

const ACCENT = "#E65100";

const ARCHETYPE_DESCRIPTIONS: Record<ArchetypeName, string> = {
  "The Fermentation Alchemist":
    "You are a patient artist, transforming humble ingredients into complex flavors through the magic of time and microbes. Your kitchen is a laboratory of bubbling jars and earthy aromas.",
  "The Farm-to-Table Purist":
    "You are a storyteller, connecting people to the land through the freshest, most seasonal ingredients. Your cooking is a celebration of nature's bounty and the hands that cultivate it.",
  "The Fusion Explorer":
    "You are a culinary cartographer, charting new territories of taste by blending flavors, techniques, and traditions from around the globe. Your dishes are a delicious dialogue between cultures.",
  "The Pastry Architect":
    "You are a meticulous builder, constructing edible masterpieces with precision, creativity, and a deep understanding of structure and chemistry. Your creations are as beautiful as they are delicious.",
  "The Fire Master":
    "You are a primal force, harnessing the power of live fire to create smoky, soulful, and deeply satisfying food. Your cooking is a dance of heat, smoke, and intuition.",
  "The Communal Cook":
    "You are a gatherer, using food as a medium to build community, foster connection, and create lasting memories. Your table is a place of warmth, laughter, and abundance.",
};

const DIMENSIONS: Dimension[] = [
  "Technique Mastery",
  "Ingredient Sourcing",
  "Cultural Curiosity",
  "Presentation",
  "Improvisation",
  "Hospitality",
];

type ScoreMap = Partial<Record<ArchetypeName | Dimension, number>>;

const QUESTIONS: { id: number; text: string; options: { text: string; score: ScoreMap }[] }[] = [
  {
    id: 1,
    text: "When sourcing ingredients, you prioritize:",
    options: [
      {
        text: "Local, seasonal produce from the farmer's market.",
        score: { "The Farm-to-Table Purist": 3, "Ingredient Sourcing": 3 },
      },
      { text: "Perfecting a single, complex technique.", score: { "Technique Mastery": 3 } },
      {
        text: "Exploring international grocery stores for rare finds.",
        score: { "The Fusion Explorer": 3, "Cultural Curiosity": 2 },
      },
      {
        text: "Ingredients that can be preserved or fermented.",
        score: { "The Fermentation Alchemist": 3 },
      },
    ],
  },
  {
    id: 2,
    text: "A perfect meal for you is:",
    options: [
      {
        text: "A beautifully plated dish that looks like a work of art.",
        score: { "The Pastry Architect": 2, Presentation: 3 },
      },
      {
        text: "A communal feast where everyone shares and connects.",
        score: { "The Communal Cook": 3, Hospitality: 3 },
      },
      {
        text: "A dish that surprises with unexpected flavor combinations.",
        score: { "The Fusion Explorer": 3, Improvisation: 2 },
      },
      { text: "Something slow-cooked or smoked to perfection.", score: { "The Fire Master": 3 } },
    ],
  },
  {
    id: 3,
    text: "Your kitchen's most essential tool is:",
    options: [
      { text: "A high-quality chef's knife.", score: { "Technique Mastery": 3 } },
      {
        text: "A large, welcoming dining table.",
        score: { "The Communal Cook": 3, Hospitality: 2 },
      },
      {
        text: "A collection of spices from around the world.",
        score: { "The Fusion Explorer": 3, "Cultural Curiosity": 2 },
      },
      { text: "A smoker or a grill.", score: { "The Fire Master": 3 } },
    ],
  },
  {
    id: 4,
    text: "When you cook for others, your main goal is:",
    options: [
      {
        text: "To create a warm, inviting atmosphere.",
        score: { "The Communal Cook": 3, Hospitality: 3 },
      },
      {
        text: "To impress them with your technical skills.",
        score: { "Technique Mastery": 2, Presentation: 1 },
      },
      {
        text: "To introduce them to new flavors and cultures.",
        score: { "The Fusion Explorer": 3, "Cultural Curiosity": 2 },
      },
      {
        text: "To serve something deeply satisfying and soulful.",
        score: { "The Fire Master": 2, "The Farm-to-Table Purist": 1 },
      },
    ],
  },
  {
    id: 5,
    text: "You find joy in:",
    options: [
      { text: "The slow process of fermentation.", score: { "The Fermentation Alchemist": 3 } },
      {
        text: "The precision of pastry and baking.",
        score: { "The Pastry Architect": 3, "Technique Mastery": 1 },
      },
      {
        text: "The spontaneity of improvising a meal.",
        score: { Improvisation: 3, "The Fusion Explorer": 1 },
      },
      {
        text: "The connection to nature through ingredients.",
        score: { "The Farm-to-Table Purist": 3, "Ingredient Sourcing": 2 },
      },
    ],
  },
  {
    id: 6,
    text: "A kitchen mistake is:",
    options: [
      {
        text: "An opportunity to improvise and create something new.",
        score: { Improvisation: 3 },
      },
      {
        text: "A failure of technique that needs to be corrected.",
        score: { "Technique Mastery": 2 },
      },
      {
        text: "A sign to use better quality ingredients next time.",
        score: { "Ingredient Sourcing": 2 },
      },
      { text: "A moment to laugh and share with your guests.", score: { Hospitality: 2 } },
    ],
  },
  {
    id: 7,
    text: "The best part of a meal is:",
    options: [
      {
        text: "The conversation and connection around the table.",
        score: { "The Communal Cook": 3, Hospitality: 3 },
      },
      { text: "The perfect execution of a difficult dish.", score: { "Technique Mastery": 3 } },
      {
        text: "The story behind the ingredients.",
        score: { "The Farm-to-Table Purist": 2, "Ingredient Sourcing": 2 },
      },
      {
        text: "The visual appeal of the plated food.",
        score: { Presentation: 3, "The Pastry Architect": 1 },
      },
    ],
  },
  {
    id: 8,
    text: "You are most likely to cook:",
    options: [
      { text: "A multi-course tasting menu.", score: { "Technique Mastery": 2, Presentation: 2 } },
      { text: "A large, one-pot meal for a crowd.", score: { "The Communal Cook": 3 } },
      {
        text: "Something you've never made before.",
        score: { Improvisation: 3, "Cultural Curiosity": 1 },
      },
      { text: "A dish that requires hours of slow cooking.", score: { "The Fire Master": 3 } },
    ],
  },
  {
    id: 9,
    text: "Your cookbook collection is full of:",
    options: [
      {
        text: "Books on specific techniques like butchery or charcuterie.",
        score: { "Technique Mastery": 3, "The Fermentation Alchemist": 1 },
      },
      {
        text: "Travelogues with recipes from far-off lands.",
        score: { "The Fusion Explorer": 3, "Cultural Curiosity": 3 },
      },
      {
        text: "Books focused on a single ingredient or region.",
        score: { "The Farm-to-Table Purist": 3, "Ingredient Sourcing": 2 },
      },
      {
        text: "Handwritten notes and family recipes.",
        score: { "The Communal Cook": 2, Hospitality: 1 },
      },
    ],
  },
  {
    id: 10,
    text: "You feel most connected to your food when:",
    options: [
      {
        text: "You know the farmer who grew it.",
        score: { "The Farm-to-Table Purist": 3, "Ingredient Sourcing": 3 },
      },
      {
        text: "You are using a traditional cooking method.",
        score: { "The Fire Master": 2, "Cultural Curiosity": 1 },
      },
      {
        text: "You are creating a dish that is uniquely your own.",
        score: { Improvisation: 3, "The Fusion Explorer": 1 },
      },
      {
        text: "You are sharing it with people you love.",
        score: { "The Communal Cook": 3, Hospitality: 2 },
      },
    ],
  },
  {
    id: 11,
    text: "The most important aspect of a dish is:",
    options: [
      { text: "Flavor", score: { "The Fusion Explorer": 2, Improvisation: 1 } },
      { text: "Texture", score: { "Technique Mastery": 2, "The Pastry Architect": 1 } },
      { text: "Aroma", score: { "The Fire Master": 2 } },
      { text: "Appearance", score: { Presentation: 3 } },
    ],
  },
  {
    id: 12,
    text: "A kitchen should be:",
    options: [
      {
        text: "A laboratory for experimentation.",
        score: { "The Fermentation Alchemist": 2, "The Fusion Explorer": 2 },
      },
      {
        text: "A studio for creative expression.",
        score: { "The Pastry Architect": 2, Presentation: 2 },
      },
      {
        text: "A sanctuary for mindfulness and connection.",
        score: { "The Farm-to-Table Purist": 2 },
      },
      { text: "The heart of the home.", score: { "The Communal Cook": 3, Hospitality: 2 } },
    ],
  },
  {
    id: 13,
    text: "When you travel, you are most excited about:",
    options: [
      {
        text: "Trying street food and local delicacies.",
        score: { "Cultural Curiosity": 3, "The Fusion Explorer": 2 },
      },
      {
        text: "Visiting local markets and farms.",
        score: { "Ingredient Sourcing": 3, "The Farm-to-Table Purist": 2 },
      },
      {
        text: "Taking a cooking class to learn a new technique.",
        score: { "Technique Mastery": 3 },
      },
      { text: "Dining at a world-renowned restaurant.", score: { Presentation: 2 } },
    ],
  },
  {
    id: 14,
    text: "The ideal kitchen gadget is one that:",
    options: [
      { text: "Enhances a traditional cooking method.", score: { "The Fire Master": 2 } },
      {
        text: "Allows for precise and consistent results.",
        score: { "Technique Mastery": 2, "The Pastry Architect": 2 },
      },
      {
        text: "Opens up new possibilities for flavor combinations.",
        score: { "The Fusion Explorer": 2, Improvisation: 1 },
      },
      {
        text: "Helps you make food for a large group of people.",
        score: { "The Communal Cook": 2 },
      },
    ],
  },
  {
    id: 15,
    text: "Your cooking style is best described as:",
    options: [
      { text: "Intuitive and spontaneous.", score: { Improvisation: 3 } },
      { text: "Methodical and precise.", score: { "Technique Mastery": 3 } },
      {
        text: "Rooted in tradition and heritage.",
        score: { "Cultural Curiosity": 2, "The Communal Cook": 1 },
      },
      { text: "Constantly evolving and experimental.", score: { "The Fusion Explorer": 3 } },
    ],
  },
];

const ARCHETYPE_NAMES = new Set<string>(Object.keys(ARCHETYPE_DESCRIPTIONS));
const DIMENSION_NAMES = new Set<string>(DIMENSIONS);

function calculateResults(answers: Record<number, ScoreMap>) {
  const archetypeScores: Partial<Record<ArchetypeName, number>> = {};
  const dimensionScores: Partial<Record<Dimension, number>> = {};

  for (const answerScore of Object.values(answers)) {
    for (const key in answerScore) {
      const value = answerScore[key as keyof ScoreMap] ?? 0;
      if (ARCHETYPE_NAMES.has(key)) {
        const k = key as ArchetypeName;
        archetypeScores[k] = (archetypeScores[k] ?? 0) + value;
      } else if (DIMENSION_NAMES.has(key)) {
        const k = key as Dimension;
        dimensionScores[k] = (dimensionScores[k] ?? 0) + value;
      }
    }
  }

  const topArchetype = (Object.keys(archetypeScores) as ArchetypeName[]).reduce((a, b) =>
    (archetypeScores[a] ?? 0) > (archetypeScores[b] ?? 0) ? a : b,
  );

  return { archetype: topArchetype, scores: dimensionScores };
}

export function FindYourKitchenQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [answers, setAnswers] = useState<Record<number, ScoreMap>>({});
  const { markComplete } = useJourneyProgress();

  const handleAnswer = (questionId: number, score: ScoreMap) => {
    const next = { ...answers, [questionId]: score };
    setAnswers(next);
    if (Object.keys(next).length === QUESTIONS.length) setPhase("results");
  };

  useEffect(() => {
    if (phase === "results") markComplete("find-your-kitchen");
  }, [phase, markComplete]);

  const results = phase === "results" ? calculateResults(answers) : null;
  const chartMax = results ? Math.max(...Object.values(results.scores).map((v) => v ?? 0), 1) : 1;

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="kitchen" />
      <div className="flex flex-col items-center px-6 py-[clamp(4rem,6vw,6rem)]">
        {phase === "landing" && (
          <AssessmentIntro
            title="Find Your Kitchen"
            subtitle="The kitchen is the last honest room in the house."
            description="From fermentation alchemy to fire mastery, from farm-to-table purism to fusion exploration — this assessment maps your culinary identity across technique, sourcing, cultural curiosity, presentation, improvisation, and hospitality. Fifteen questions to find out who you really are when you cook."
            stats={{ questions: 15, dimensions: 6, minutes: 5 }}
            whatYouGet={[
              "Your kitchen archetype (Alchemist, Purist, Explorer, Architect, Fire Master, or Communal Cook)",
              "A radar chart of your culinary dimensions",
              "Understanding of your cooking philosophy",
              "Curated next steps in your culinary journey",
            ]}
            accentColor={ACCENT}
            onBegin={() => setPhase("questions")}
          />
        )}

        {phase === "questions" && (
          <div className="max-w-3xl text-center">
            {QUESTIONS.map((q, index) => (
              <div key={q.id} className="mb-[clamp(2rem,4vw,3rem)]">
                <h2 className="mb-8 font-heading text-2xl text-brand-gold">
                  {index + 1}. {q.text}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {q.options.map((option) => (
                    <button
                      key={option.text}
                      onClick={() => handleAnswer(q.id, option.score)}
                      className="h-full border border-brand-gold-light p-6 text-left text-base transition-colors hover:bg-brand-gold-light/10"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {phase === "results" && !emailGated && (
          <EmailGate assessmentSlug="kitchen" onUnlock={() => setEmailGated(true)} />
        )}

        {phase === "results" && emailGated && results && (
          <div className="max-w-3xl text-center">
            <h1 className="mb-4 font-heading text-5xl text-brand-gold">
              Your Archetype: {results.archetype}
            </h1>
            <p className="mx-auto mb-8 max-w-150 text-lg leading-relaxed">
              {ARCHETYPE_DESCRIPTIONS[results.archetype]}
            </p>

            <AssessmentRadarChart scores={results.scores} max={chartMax} accentColor={ACCENT} />

            <div className="my-8 flex flex-wrap justify-center gap-4">
              {DIMENSIONS.map((dim) => (
                <div key={dim} className="font-mono text-base">
                  <span className="mr-2 text-brand-gold">{dim}:</span>
                  <span>{results.scores[dim] ?? 0}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 border-t border-brand-gold-light pt-8">
              <h2 className="mb-4 font-heading text-2xl text-brand-gold">The Journey Continues</h2>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/find-your-diet" className="mx-4 font-mono text-brand-gold">
                  Find Your Diet
                </Link>
                <Link href="/find-my" className="mx-4 font-mono text-brand-gold">
                  Find Your Purpose
                </Link>
                <Link href="/find-your-style" className="mx-4 font-mono text-brand-gold">
                  Find Your Style
                </Link>
              </div>
            </div>
            <div className="mt-8">
              <JourneyTracker variant="light" currentAssessmentId="find-your-kitchen" />
            </div>
          </div>
        )}
      </div>

      <WhatsNext />
    </div>
  );
}
