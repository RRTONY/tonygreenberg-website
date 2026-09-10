import { describe, expect, it } from "vitest";
import { JOURNEY_MAP } from "@/components/assessments/journey-tracker";
import {
  ECOSYSTEM_PHASES,
  getEcosystemDurationMinutes,
  resolveEcosystemPhase,
} from "@/lib/content/ecosystem-map";

describe("ecosystem map", () => {
  it("resolves every planned phase experience against the active journey map", () => {
    const resolvedPhases = ECOSYSTEM_PHASES.map((phase) =>
      resolveEcosystemPhase(phase, JOURNEY_MAP),
    );

    expect(resolvedPhases.flatMap((phase) => phase.unresolvedIds)).toEqual([]);
    expect(resolvedPhases.flatMap((phase) => phase.experiences)).toHaveLength(
      ECOSYSTEM_PHASES.reduce((total, phase) => total + phase.experienceIds.length, 0),
    );
  });

  it("derives a positive total duration from the active journey records", () => {
    const resolvedPhases = ECOSYSTEM_PHASES.map((phase) =>
      resolveEcosystemPhase(phase, JOURNEY_MAP),
    );

    expect(getEcosystemDurationMinutes(resolvedPhases)).toBeGreaterThan(0);
  });
});
