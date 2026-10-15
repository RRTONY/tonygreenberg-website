import { describe, expect, it } from "vitest";
import { DAILY_PROVOCATIONS } from "@/lib/content/daily-provocations";

describe("daily-provocations", () => {
  it("shows the newest provocation first", () => {
    expect(DAILY_PROVOCATIONS[0].date).toBe("2026-10-07");
    expect(DAILY_PROVOCATIONS[0].text).toMatch(/^Only time buys trust/);
  });

  it("uses real ISO dates, unique and strictly newest first", () => {
    const dates = DAILY_PROVOCATIONS.map((p) => p.date);
    expect(new Set(dates).size).toBe(dates.length);
    for (const d of dates) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(d).getTime())).toBe(false);
    }
    for (let i = 1; i < dates.length; i++) expect(dates[i - 1] > dates[i]).toBe(true);
  });

  it("has non-empty text for every day", () => {
    for (const p of DAILY_PROVOCATIONS) expect(p.text.trim().length).toBeGreaterThan(10);
  });
});
