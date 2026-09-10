import { describe, expect, it } from "vitest";

import { parseAssessmentResults } from "./result-log";

describe("parseAssessmentResults", () => {
  it("keeps well-formed completed assessment entries", () => {
    const result = parseAssessmentResults([
      { completedAt: "2026-09-09T20:00:00.000Z", slug: "find-your-me" },
      { completedAt: "2026-09-09T20:01:00.000Z", slug: "find-your-purpose" },
    ]);

    expect(result).toEqual([
      { completedAt: "2026-09-09T20:00:00.000Z", slug: "find-your-me" },
      { completedAt: "2026-09-09T20:01:00.000Z", slug: "find-your-purpose" },
    ]);
  });

  it("rejects malformed, missing, and non-array state values", () => {
    expect(parseAssessmentResults({ slug: "find-your-me" })).toEqual([]);
    expect(
      parseAssessmentResults([{ slug: "find-your-me" }, { completedAt: 123, slug: "invalid" }]),
    ).toEqual([]);
  });
});
