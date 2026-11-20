import { describe, expect, it } from "vitest";
import { bottles, BOTTLE_TYPES, isRare, quadrants, quizQuestions, toPercent } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";

describe("Flavor Matrix data", () => {
  it("keeps the app's 26 bottles across the four tabs, each with quadrant names", () => {
    expect(bottles).toHaveLength(26);
    for (const t of BOTTLE_TYPES) {
      expect(bottles.some((b) => b.type === t)).toBe(true);
      expect(Object.keys(quadrants[t])).toEqual(["tl", "tr", "bl", "br"]);
    }
    expect(quizQuestions).toHaveLength(3);
  });

  it("uses a rescued photo for the six bottles that had one and none for the rest", () => {
    const withPhoto = bottles.filter((b) => b.image);
    expect(withPhoto).toHaveLength(11);
    expect(withPhoto.every((b) => b.image!.src.startsWith("https://cdn.sanity.io/"))).toBe(true);
    expect(bottles.find((b) => b.id === "cascahuin-tahona")!.image).toBeNull();
  });

  it("maps axis values to percentages and flags Unicorn/Legendary bottles", () => {
    expect(toPercent(-100)).toBe(0);
    expect(toPercent(0)).toBe(50);
    expect(toPercent(100)).toBe(100);
    expect(isRare(bottles.find((b) => b.id === "g4-madera")!)).toBe(true);
    expect(isRare(bottles.find((b) => b.id === "ocho-plata")!)).toBe(false);
  });
});
