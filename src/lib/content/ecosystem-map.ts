// Ported from legacy client/src/pages/EcosystemMap.tsx's `JOURNEY_PHASES`.
// Real copy, unchanged. Each experience's URL and internal/external status
// is not repeated here — it's resolved from JOURNEY_MAP in
// `components/assessments/journey-tracker.tsx` (the same source /my-journey
// uses), so the two can't drift apart.

export interface EcosystemExperience {
  id: string;
  name: string;
  time: string;
  description: string;
}

export interface EcosystemPhase {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  experiences: EcosystemExperience[];
}

export const ECOSYSTEM_PHASES: EcosystemPhase[] = [
  {
    number: 1,
    title: "The Foundation",
    subtitle: "Who are you when nobody's watching?",
    description: "Start with the core assessments that map your inner landscape. These create the baseline everything else builds on.",
    experiences: [
      { id: "find-your-me", name: "Find Your Me", time: "3 min", description: "The entry point. Five dimensions of self-discovery that set the compass for everything that follows." },
      { id: "find-your-mirror", name: "Find Your Mirror", time: "10 min", description: "Eighteen questions mapping where you actually are in life — not where you think you should be." },
      { id: "find-your-purpose", name: "Find Your Purpose", time: "12 min", description: "The Dharma Finder. Twenty-five questions that reveal the work you were built for." },
    ],
  },
  {
    number: 2,
    title: "The Depths",
    subtitle: "How deep does the rabbit hole go?",
    description: "Now that you know the terrain, go deeper. These assessments reveal the operating system underneath your personality.",
    experiences: [
      { id: "find-your-level", name: "Find Your Level", time: "12 min", description: "The Consciousness Scale. Where are you on the spectrum from survival to transcendence?" },
      { id: "find-your-score", name: "Find Your Score", time: "12 min", description: "The Grant Study assessment. Harvard's 75-year study of what actually makes a good life." },
      { id: "find-your-spirit", name: "Find Your Spirit", time: "18 min", description: "Thirty-five questions mapping your spiritual architecture — tradition, mysticism, or none of the above." },
    ],
  },
  {
    number: 3,
    title: "The Healing",
    subtitle: "The body keeps the score. Time to read it.",
    description: "Turn inward to the physical. Your chemistry, your water, your therapy modality — the infrastructure of wellness.",
    experiences: [
      { id: "find-your-therapy", name: "Find Your Therapy", time: "12 min", description: "CBT, IFS, somatic, psychedelic-assisted — matched to your wiring, not a waitlist." },
      { id: "find-your-chemistry", name: "Find Your Chemistry", time: "8 min", description: "Biomarkers, bloodwork, regenerative protocols. The science of your specific body." },
      { id: "find-your-water", name: "Find Your Water", time: "5 min", description: "Mineral content, pH, source — the most fundamental thing you put in your body." },
    ],
  },
  {
    number: 4,
    title: "The Connections",
    subtitle: "No one finds themselves alone.",
    description: "Relationships, teams, tribes. The people who reflect you back to yourself and the systems that hold you.",
    experiences: [
      { id: "find-your-partner", name: "Find Your Partner", time: "10 min", description: "Attachment style, love language, values alignment. The intimacy assessment." },
      { id: "find-your-team", name: "Find Your Team", time: "8 min", description: "Flow Circuit. How you collaborate, lead, and create with others." },
      { id: "find-your-tribe", name: "Find Your Tribe", time: "5 min", description: "The community that gets it. Where you belong without performing." },
      { id: "find-your-religion", name: "Find Your Religion", time: "20 min", description: "Not which one is right. Which one is yours — or none at all. 20 questions mapping your worldview to 8 spiritual archetypes." },
    ],
  },
  {
    number: 5,
    title: "The Rituals",
    subtitle: "What you consume consumes you.",
    description: "The daily practices, the things you drink, the food that feeds who you actually are. Ritual as self-knowledge.",
    experiences: [
      { id: "find-your-mezcal", name: "Find Your Mezcal", time: "5 min", description: "The agave that matches your soul — not your Instagram." },
      { id: "find-your-tequila", name: "Find Your Tequila", time: "5 min", description: "Highland or lowland. Blanco or añejo. A love letter in liquid form." },
      { id: "find-your-sake", name: "Find Your Sake", time: "8 min", description: "Rice, water, koji, time. The most honest drink on earth." },
    ],
  },
  {
    number: 6,
    title: "The Systems",
    subtitle: "Now build the architecture for what comes next.",
    description: "With self-knowledge as foundation, design the systems — financial, operational, strategic — that align with who you actually are.",
    experiences: [
      { id: "find-your-blueprint", name: "Find Your Blueprint", time: "8 min", description: "The operating system for what comes after extraction." },
      { id: "find-your-capital", name: "Find Your Capital", time: "5 min", description: "How aligned money actually moves." },
    ],
  },
];
