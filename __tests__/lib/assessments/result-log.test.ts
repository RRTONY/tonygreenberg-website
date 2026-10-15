import { describe, expect, it, vi } from "vitest";
import { recordFinish } from "@/lib/assessments/record-finish";
import { parseResultLogCookie, RESULT_LOG_COOKIE, saveAssessmentResult } from "@/lib/assessments/result-log";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));

function readCookie() {
  const m = document.cookie.match(/(?:^|; )tg_assessment_results=([^;]*)/);
  return parseResultLogCookie(m ? decodeURIComponent(m[1]) : null);
}

describe("parseResultLogCookie", () => {
  it("returns [] for empty, bad JSON or a non-array", () => {
    expect(parseResultLogCookie(undefined)).toEqual([]);
    expect(parseResultLogCookie("")).toEqual([]);
    expect(parseResultLogCookie("{nope")).toEqual([]);
    expect(parseResultLogCookie('{"slug":"a"}')).toEqual([]);
  });

  it("keeps only well-formed entries", () => {
    const raw = JSON.stringify([{ slug: "a", completedAt: "2026-01-01" }, { slug: 1 }, null, { slug: "b" }]);
    expect(parseResultLogCookie(raw)).toEqual([{ slug: "a", completedAt: "2026-01-01" }]);
  });
});

describe("saveAssessmentResult", () => {
  it("adds an entry to the cookie and records the finish", () => {
    saveAssessmentResult("brewsoul", { summary: "Bold", score: 4 });
    expect(RESULT_LOG_COOKIE).toBe("tg_assessment_results");
    expect(readCookie()).toEqual([{ slug: "brewsoul", completedAt: expect.any(String) }]);
    expect(recordFinish).toHaveBeenCalledWith({ assessment: "brewsoul", summary: "Bold", score: 4 });
  });

  it("a retake replaces its entry rather than duplicating", () => {
    saveAssessmentResult("a");
    saveAssessmentResult("b");
    saveAssessmentResult("a");
    expect(readCookie().map((e) => e.slug)).toEqual(["b", "a"]);
  });

  it("can skip the database save", () => {
    saveAssessmentResult("c", undefined, { saveToDatabase: false });
    expect(recordFinish).not.toHaveBeenCalled();
    expect(readCookie()).toHaveLength(1);
  });
});
