import { describe, expect, it } from "vitest";
import {
  agaveDatabase,
  matchAgaves,
  scentCategories,
  scentFinderData,
  scentNotes,
} from "@/components/soulsmoke/pages/scent-finder/data/scent-finder.data";

describe("scent-finder data", () => {
  it("every agave's notes are real scent notes, and every note has a category", () => {
    const names = new Set(scentNotes.map((n) => n.name));
    for (const agave of agaveDatabase) for (const note of agave.notes) expect(names.has(note)).toBe(true);
    for (const note of scentNotes) expect(scentCategories).toContain(note.category);
    expect(agaveDatabase.every((a) => a.image.src.startsWith("https://cdn.sanity.io/"))).toBe(true);
  });

  it("matchAgaves ranks by shared notes and drops agaves with none", () => {
    expect(matchAgaves([])).toEqual([]);
    expect(matchAgaves(["Pineapple"])).toEqual([]);
    const ranked = matchAgaves(["Mineral", "Pine", "Lavender"]).map((a) => a.name);
    expect(ranked[0]).toBe("Tepeztate");
    expect(ranked).toContain("Cuishe");
  });

  it("has English and Spanish copy", () => {
    expect(scentFinderData.en.find(3)).toBe("Find My Agave (3 notes selected)");
    expect(scentFinderData.es.find(3)).toBe("Encuentra Mi Agave (3 notas)");
    expect(scentFinderData.matchBadge(2)).toBe("MATCH #2");
  });
});
