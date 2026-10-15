import { describe, expectTypeOf, it } from "vitest";
import type { LucideIcon } from "lucide-react";
import type { CatalogItem, ComputedScores, ProducerEntry, ScoringWeights, TierIcon } from "@/lib/intelligence-engine/types";

describe("intelligence-engine types", () => {
  it("TierIcon holds a lucide icon and a count", () => {
    expectTypeOf<TierIcon>().toEqualTypeOf<{ icon: LucideIcon; count: number }>();
  });

  it("ScoringWeights has the four numeric weights", () => {
    expectTypeOf<ScoringWeights>().toEqualTypeOf<{ qpr: number; availability: number; wow: number; scarcity: number }>();
  });

  it("ComputedScores restricts tier and freshness to known values", () => {
    expectTypeOf<ComputedScores["tier"]>().toEqualTypeOf<1 | 2 | 3 | 4>();
    expectTypeOf<ComputedScores["freshness"]>().toEqualTypeOf<"green" | "yellow" | "red" | "unknown">();
  });

  it("CatalogItem requires prices and grades, scores are optional", () => {
    expectTypeOf<CatalogItem["priceUsd"]>().toEqualTypeOf<number>();
    expectTypeOf<CatalogItem["producerTransparencyGrade"]>().toEqualTypeOf<"A" | "B" | "C" | "D" | "F">();
    expectTypeOf<CatalogItem["scores"]>().toEqualTypeOf<ComputedScores | undefined>();
    expectTypeOf<ProducerEntry["overallGrade"]>().toEqualTypeOf<"A" | "B" | "C" | "D" | "F">();
  });
});
