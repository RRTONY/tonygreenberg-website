import { describe, expect, it } from "vitest";
import * as w from "@/lib/content/peptide-watch";
import {
  HERO_STATS, MARKETS, TIMELINE, WALL_OF_SHAME, FRAUD_PATTERNS, BUYER_CHECKLIST, SCORECARD_CATEGORIES, SCORE_TIERS,
  WATCHDOG_PILLARS, REPORT_CHANNELS, MANUS_LAYERS, ROLE_CHECKLISTS,
} from "@/lib/content/peptide-watch";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function sortKey(date: string) {
  const year = Number(date.match(/\d{4}/)?.[0]);
  const month = MONTHS.findIndex((m) => date.toLowerCase().includes(m));
  return year * 100 + (month === -1 ? 0 : month + 1);
}

describe("peptide-watch", () => {
  it("numbers markets, patterns, checklist, scorecard and layers in order", () => {
    expect(MARKETS.map((m) => m.num)).toEqual(["01", "02", "03"]);
    expect(FRAUD_PATTERNS.map((p) => p.num)).toEqual(Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")));
    expect(BUYER_CHECKLIST.map((c) => c.num)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(SCORECARD_CATEGORIES.map((c) => c.letter).join("")).toBe("ABCDEFGHIJ");
    expect(MANUS_LAYERS.map((l) => l.num)).toEqual([1, 2, 3, 4, 5]);
  });

  it("has score tiers that fit the 10-category, 50-point scorecard", () => {
    expect(SCORECARD_CATEGORIES.length * 5).toBe(50);
    expect(SCORE_TIERS[0].range).toBe("45–50");
    expect(SCORE_TIERS.at(-1)?.range).toBe("Under 25");
  });

  it("has unique vendors on the Wall of Shame, each with a badge", () => {
    expect(new Set(WALL_OF_SHAME.map((v) => v.vendor)).size).toBe(WALL_OF_SHAME.length);
    for (const v of WALL_OF_SHAME) {
      expect(v.badges.length).toBeGreaterThan(0);
      expect(v.violation.trim() && v.status.trim()).toBeTruthy();
    }
  });

  it("links report channels to https sites and has no Manus URLs", () => {
    for (const r of REPORT_CHANNELS) expect(r.url).toMatch(/^https:\/\//);
    expect(JSON.stringify(w)).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
  });

  it("fills role checklists, pillars, stats and timeline entries", () => {
    for (const r of ROLE_CHECKLISTS) {
      expect(r.items.length).toBeGreaterThan(0);
      expect(r.color).toMatch(/^#[0-9A-F]{6}$/i);
    }
    expect(WATCHDOG_PILLARS).toHaveLength(6);
    expect(HERO_STATS).toHaveLength(4);
    for (const t of TIMELINE) expect(Number.isFinite(sortKey(t.date)) && t.title.trim() !== "").toBe(true);
  });

  // Peaks Curative's "February 2026" sits between February 2025 and June 2025.
  // Either the date is a typo or the entry is in the wrong place.
  it.fails("BUG: the enforcement timeline is not in date order", () => {
    const keys = TIMELINE.map((t) => sortKey(t.date));
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });
});
