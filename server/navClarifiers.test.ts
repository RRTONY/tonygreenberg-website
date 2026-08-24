/**
 * Tests for NavClarifiers data integrity and helper logic.
 * Verifies clarifier map, skip paths, and QA constraints.
 */
import { describe, it, expect } from "vitest";

// Import the clarifiers map and helper from the source
import { clarifiers, getClarifier } from "../client/src/components/NavClarifiers";

describe("NavClarifiers data map", () => {
  it("has clarifiers for all expected mega-menu abstract nav items", () => {
    const expectedPaths = [
      "/amplifier",
      "/diamond-cut",
      "/find-my",
      "/my-journey",
      "/self-portrait",
      "/ecosystem-map",
      "/the-letter",
      "/living-declaration",
      "/published",
      "/series",
      "/the-nightstand",
      "/walk-through",
      "/the-territory",
      "/the-index",
      "/the-web",
      "/framework",
      "/engine-room",
      "/under-nda",
      "/intel",
      "/clients",
      "/recent-creations",
      "/the-body",
      "/spirits",
      "/journeys",
      "/fauxtony",
    ];

    for (const path of expectedPaths) {
      expect(clarifiers[path], `Missing clarifier for ${path}`).toBeDefined();
    }
  });

  it("has clarifiers for Find Your Me assessment sub-items", () => {
    const assessmentPaths = [
      "/the-mirror",
      "/assessments/dharma-finder",
      "/assessments/consciousness-scale",
      "/assessments/grant-study",
      "/find-your-spirit",
      "/community",
      "/find-your-attachment-style",
      "/find-your-love-language",
      "/find-your-sexuality",
      "/find-your-diet",
      "/find-your-movement",
      "/find-your-sleep",
      "/find-your-sake",
      "/find-your-coffee",
      "/find-your-kitchen",
      "/find-your-peptide",
      "/find-your-therapy",
      "/find-your-religion",
      "/find-your-style",
    ];

    for (const path of assessmentPaths) {
      expect(clarifiers[path], `Missing clarifier for assessment ${path}`).toBeDefined();
    }
  });

  it("no clarifier exceeds 8 words", () => {
    for (const [path, text] of Object.entries(clarifiers)) {
      const wordCount = text.split(/\s+/).length;
      expect(wordCount, `Clarifier for ${path} has ${wordCount} words: "${text}"`).toBeLessThanOrEqual(8);
    }
  });

  it("all clarifier text is at least 3 words", () => {
    for (const [path, text] of Object.entries(clarifiers)) {
      const wordCount = text.split(/\s+/).length;
      expect(wordCount, `Clarifier for ${path} too short: "${text}"`).toBeGreaterThanOrEqual(3);
    }
  });

  it("uses exact user-specified wording for key items", () => {
    expect(clarifiers["/amplifier"]).toBe("Collaborate or expand this work");
    expect(clarifiers["/diamond-cut"]).toBe("Premium strategy and sharpening");
    expect(clarifiers["/my-journey"]).toBe("Track progress and next steps");
    expect(clarifiers["/self-portrait"]).toBe("Your traits, values, profile");
    expect(clarifiers["/the-letter"]).toBe("Simple overview of this project");
    expect(clarifiers["/living-declaration"]).toBe("Core worldview and principles");
    expect(clarifiers["/published"]).toBe("Finished public essays");
    expect(clarifiers["/the-nightstand"]).toBe("Books and influences");
    expect(clarifiers["/the-territory"]).toBe("Core ideas and how they connect");
    expect(clarifiers["/the-index"]).toBe("Everything organized in one place");
    expect(clarifiers["/the-web"]).toBe("Connected thinking across projects");
    expect(clarifiers["/framework"]).toBe("Models you can apply immediately");
    expect(clarifiers["/engine-room"]).toBe("Active builds and operations");
    expect(clarifiers["/under-nda"]).toBe("Restricted private work");
    expect(clarifiers["/intel"]).toBe("Research and strategic notes");
    expect(clarifiers["/clients"]).toBe("Trusted people and partners");
    expect(clarifiers["/recent-creations"]).toBe("Things Tony built");
    expect(clarifiers["/the-body"]).toBe("Health and performance protocols");
    expect(clarifiers["/spirits"]).toBe("Plant medicine resources and ceremony prep");
    expect(clarifiers["/journeys"]).toBe("Guided transformation paths");
    expect(clarifiers["/fauxtony"]).toBe("AI trained on Tony's thinking and work");
  });
});

describe("getClarifier skip logic", () => {
  it("returns undefined for obvious items that should be skipped", () => {
    const skipItems = ["/", "/blog", "/invest", "/shop", "/subscribe", "/pick-up-the-phone"];
    for (const path of skipItems) {
      expect(getClarifier(path), `Should skip ${path}`).toBeUndefined();
    }
  });

  it("returns a string for abstract items", () => {
    expect(getClarifier("/amplifier")).toBe("Collaborate or expand this work");
    expect(getClarifier("/diamond-cut")).toBe("Premium strategy and sharpening");
    expect(getClarifier("/fauxtony")).toBe("AI trained on Tony's thinking and work");
  });

  it("returns undefined for unknown paths", () => {
    expect(getClarifier("/some-random-page")).toBeUndefined();
  });
});

describe("QA constraints", () => {
  it("no clarifier text is empty", () => {
    for (const [path, text] of Object.entries(clarifiers)) {
      expect(text.trim().length, `Empty clarifier for ${path}`).toBeGreaterThan(0);
    }
  });

  it("clarifier map has at least 40 entries (mega-menu + assessments)", () => {
    expect(Object.keys(clarifiers).length).toBeGreaterThanOrEqual(40);
  });

  it("all paths start with /", () => {
    for (const path of Object.keys(clarifiers)) {
      expect(path.startsWith("/"), `Path ${path} doesn't start with /`).toBe(true);
    }
  });
});
