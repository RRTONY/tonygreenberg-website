import { describe, expect, it } from "vitest";
import { IDENTITIES, PALATE_QUESTIONS, SCREENS, WEIRDNESS_LINES, welcomeQuizData } from "@/components/brewsoul/brewsoul-welcome-quiz/data/brewsoul-welcome-quiz.data";

describe("brewsoul-welcome-quiz data", () => {
  it("has the eight screens the intro promises", () => {
    expect(SCREENS).toHaveLength(8);
    expect(welcomeQuizData.intro.body).toContain("Eight questions.");
  });

  it("choice screens have options with unique tags and icons; palate and slider screens have none", () => {
    for (const s of SCREENS) {
      if ("type" in s && s.type) {
        expect(s.opts).toEqual([]);
        continue;
      }
      expect(s.opts.length).toBeGreaterThanOrEqual(4);
      expect(new Set(s.opts.map((o) => o.tag)).size).toBe(s.opts.length);
      for (const o of s.opts) expect(o.icon).toBeTruthy();
    }
    expect(SCREENS.filter((s) => "type" in s && s.type === "palate")).toHaveLength(1);
    expect(SCREENS.filter((s) => "type" in s && s.type === "slider")).toHaveLength(1);
  });

  it("puts the weirdness slider on screen 7, where the scoring reads it", () => {
    expect("type" in SCREENS[6] && SCREENS[6].type).toBe("slider");
  });

  it("has six identities with unique ids, a path and three starter-gear items", () => {
    expect(IDENTITIES).toHaveLength(6);
    expect(new Set(IDENTITIES.map((i) => i.id)).size).toBe(6);
    for (const i of IDENTITIES) {
      expect(i.desc.trim()).not.toBe("");
      expect(i.path.length).toBeGreaterThan(0);
      expect(i.gear).toHaveLength(3);
      for (const g of i.gear) expect(g.price).toMatch(/^\$\d+$/);
    }
  });

  it("has a weirdness line for every slider value 1 to 10 and unique palate dimensions", () => {
    for (let n = 1; n <= 10; n++) expect(WEIRDNESS_LINES[n]).toBeTruthy();
    expect(new Set(PALATE_QUESTIONS.map((p) => p.dim)).size).toBe(PALATE_QUESTIONS.length);
  });
});
