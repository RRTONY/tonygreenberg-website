export type EcosystemJourneyEntry = {
  id: string;
  name: string;
  url: string;
  estimatedMinutes: number;
  isExternal: boolean;
};

export const ECOSYSTEM_PHASES = [
  {
    number: 1,
    title: "The Foundation",
    subtitle: "Who are you when nobody is watching?",
    description:
      "Start with the core assessments that map your inner landscape. These create the baseline that everything else builds on.",
    experienceIds: ["find-your-me", "find-your-mirror", "find-your-purpose"],
  },
  {
    number: 2,
    title: "The Depths",
    subtitle: "How deep does the rabbit hole go?",
    description:
      "Once you know the terrain, go deeper. These assessments explore the operating system beneath personality and preference.",
    experienceIds: ["find-your-level", "find-your-score", "find-your-spirit"],
  },
  {
    number: 3,
    title: "The Healing",
    subtitle: "The body keeps the score. Time to read it.",
    description:
      "Turn inward to the physical: therapy, chemistry, and water. This phase focuses on the infrastructure of individual wellbeing.",
    experienceIds: ["find-your-therapy", "find-your-chemistry", "find-your-water"],
  },
  {
    number: 4,
    title: "The Connections",
    subtitle: "No one finds themselves alone.",
    description:
      "Relationships, teams, communities, and belief systems reveal how people reflect one another and build the structures that hold them.",
    experienceIds: ["find-your-partner", "find-your-team", "find-your-tribe", "find-your-religion"],
  },
  {
    number: 5,
    title: "The Rituals",
    subtitle: "What you consume consumes you.",
    description:
      "Explore the practices and tastes that shape everyday life. Ritual is treated here as a form of self-knowledge.",
    experienceIds: ["find-your-mezcal", "find-your-tequila", "find-your-sake"],
  },
  {
    number: 6,
    title: "The Systems",
    subtitle: "Build the architecture for what comes next.",
    description:
      "With self-knowledge as a foundation, consider the strategic and financial systems that can align with it.",
    experienceIds: ["find-your-blueprint", "find-your-capital"],
  },
] as const;

export type EcosystemPhase = (typeof ECOSYSTEM_PHASES)[number];

export function resolveEcosystemPhase(
  phase: EcosystemPhase,
  journeyEntries: readonly EcosystemJourneyEntry[],
) {
  const entryById = new Map(journeyEntries.map((entry) => [entry.id, entry]));
  const experiences = phase.experienceIds.flatMap((id) => {
    const entry = entryById.get(id);
    return entry ? [entry] : [];
  });

  return {
    ...phase,
    experiences,
    unresolvedIds: phase.experienceIds.filter((id) => !entryById.has(id)),
  };
}

export function getEcosystemDurationMinutes(phases: ReturnType<typeof resolveEcosystemPhase>[]) {
  return phases
    .flatMap((phase) => phase.experiences)
    .reduce((total, entry) => total + entry.estimatedMinutes, 0);
}
