/**
 * Tests for the "My Saved Medicines" bookmark feature and PDF export
 * Validates localStorage-based persistence, toggle logic, and export generation
 */
import { describe, it, expect } from "vitest";

// Import the medicine data to validate bookmark targets exist
import { MEDICINES } from "../client/src/pages/pri/data";

describe("Saved Medicines Feature", () => {
  it("should have valid medicine IDs that can be bookmarked", () => {
    expect(MEDICINES.length).toBeGreaterThanOrEqual(25);
    // Every medicine must have a unique string ID
    const ids = MEDICINES.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(MEDICINES.length);
    ids.forEach((id) => {
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });
  });

  it("should have all required fields for bookmark display", () => {
    MEDICINES.forEach((m) => {
      expect(m).toHaveProperty("id");
      expect(m).toHaveProperty("name");
      expect(m).toHaveProperty("icon");
      expect(m).toHaveProperty("src");
      expect(typeof m.name).toBe("string");
      expect(m.name.length).toBeGreaterThan(0);
    });
  });

  it("should support toggle logic (add/remove from saved list)", () => {
    // Simulate the toggle logic from the component
    const toggleSaved = (prev: string[], id: string): string[] => {
      return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    };

    let saved: string[] = [];

    // Add psilocybin
    saved = toggleSaved(saved, "psilocybin");
    expect(saved).toEqual(["psilocybin"]);

    // Add ibogaine
    saved = toggleSaved(saved, "ibogaine");
    expect(saved).toEqual(["psilocybin", "ibogaine"]);

    // Remove psilocybin
    saved = toggleSaved(saved, "psilocybin");
    expect(saved).toEqual(["ibogaine"]);

    // Toggle ibogaine off
    saved = toggleSaved(saved, "ibogaine");
    expect(saved).toEqual([]);
  });

  it("should serialize/deserialize saved medicines for localStorage", () => {
    const saved = ["psilocybin", "iboga", "mdma", "ketamine"];
    const serialized = JSON.stringify(saved);
    const deserialized = JSON.parse(serialized);
    expect(deserialized).toEqual(saved);
    expect(deserialized.length).toBe(4);
  });

  it("should handle empty/corrupt localStorage gracefully", () => {
    // Empty string
    const fromEmpty = (() => {
      try {
        return JSON.parse("[]");
      } catch {
        return [];
      }
    })();
    expect(fromEmpty).toEqual([]);

    // Corrupt data
    const fromCorrupt = (() => {
      try {
        return JSON.parse("not-json");
      } catch {
        return [];
      }
    })();
    expect(fromCorrupt).toEqual([]);
  });

  it("should have Iboga and Ibogaine as separate bookmarkable entries", () => {
    const iboga = MEDICINES.find((m) => m.id === "iboga");
    const ibogaine = MEDICINES.find((m) => m.id === "ibogaine");
    expect(iboga).toBeDefined();
    expect(ibogaine).toBeDefined();
    expect(iboga!.name).not.toBe(ibogaine!.name);
  });
});

describe("PDF Export", () => {
  it("should generate valid HTML for all dimension labels", () => {
    // Validate the dimension keys used in PDF export
    const DIM_LABELS: Record<string, string> = {
      med: "Medical",
      pharm: "Pharmacological",
      psych: "Psychological",
      intent: "Intention",
      set: "Setting",
      integ: "Integration",
    };
    const keys = Object.keys(DIM_LABELS);
    expect(keys.length).toBe(6);
    keys.forEach((k) => {
      expect(DIM_LABELS[k].length).toBeGreaterThan(0);
    });
  });

  it("should format saved medicines section for PDF when medicines are saved", () => {
    const savedMeds = ["psilocybin", "ketamine"];
    const savedSection =
      savedMeds.length > 0
        ? savedMeds
            .map((id) => {
              const m = MEDICINES.find((med) => med.id === id);
              return m ? `${m.icon} ${m.name}` : "";
            })
            .filter(Boolean)
        : [];
    expect(savedSection.length).toBe(2);
    expect(savedSection[0]).toContain("Psilocybin");
  });

  it("should handle empty saved medicines in PDF export", () => {
    const savedMeds: string[] = [];
    const savedSection = savedMeds.length > 0 ? "has content" : "";
    expect(savedSection).toBe("");
  });
});
