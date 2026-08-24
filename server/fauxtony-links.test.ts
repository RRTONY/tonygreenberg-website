/**
 * Tests for FauxTony link map and assessment routing.
 * Verifies that the system prompt contains correct URLs for all assessments
 * and that the link injection rules push users toward assessments.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read the routers.ts file to extract the LINK_MAP and system prompt
const routersContent = readFileSync(resolve(__dirname, "routers.ts"), "utf-8");

describe("FauxTony LINK_MAP contains correct assessment URLs", () => {
  const assessmentRoutes = [
    { name: "Find Your Me", path: "/find-your-me" },
    { name: "Dharma Finder", path: "/assessments/dharma-finder" },
    { name: "Consciousness Scale", path: "/assessments/consciousness-scale" },
    { name: "Grant Study Score", path: "/assessments/grant-study" },
    { name: "The Mirror", path: "/the-mirror" },
    { name: "Find Your Therapy", path: "/find-your-therapy" },
    { name: "Find Your Spirit", path: "/find-your-spirit" },
    { name: "Find Your Religion", path: "/find-your-religion" },
    { name: "Find Your Diet", path: "/find-your-diet" },
    { name: "Find Your Movement", path: "/find-your-movement" },
    { name: "Find Your Sleep", path: "/find-your-sleep" },
    { name: "Find Your Coffee", path: "/find-your-coffee" },
    { name: "Find Your Kitchen", path: "/find-your-kitchen" },
    { name: "Find Your Style", path: "/find-your-style" },
    { name: "Find Your Attachment Style", path: "/find-your-attachment-style" },
    { name: "Find Your Love Language", path: "/find-your-love-language" },
    { name: "Find Your Sake", path: "/find-your-sake" },
  ];

  for (const route of assessmentRoutes) {
    it(`should contain correct link for ${route.name} (${route.path})`, () => {
      expect(routersContent).toContain(route.path);
    });
  }

  it("should contain Find My hub link", () => {
    expect(routersContent).toContain("[Find My](/find-my)");
  });

  it("should have at least 17 assessment routes in the LINK_MAP", () => {
    const assessmentCount = assessmentRoutes.filter(r => 
      routersContent.includes(r.path)
    ).length;
    expect(assessmentCount).toBeGreaterThanOrEqual(17);
  });
});

describe("FauxTony system prompt assessment push rules", () => {
  it("should instruct to push Find Your Me as gateway assessment", () => {
    expect(routersContent).toContain("Find Your Me");
    expect(routersContent).toContain("GATEWAY");
  });

  it("should instruct to push Grant Study for happiness questions", () => {
    expect(routersContent).toContain("Grant Study Score");
    expect(routersContent).toContain("happiness");
  });

  it("should instruct to never say blocked or unavailable", () => {
    expect(routersContent).toContain('Never say "blocked" or "unavailable"');
  });

  it("should instruct to end responses with assessment nudges", () => {
    expect(routersContent).toContain("ASSESSMENT PUSH RULES");
  });

  it("should state assessments are LIVE and WORKING", () => {
    expect(routersContent).toContain("LIVE and WORKING");
  });

  it("should have correct Grant Study URL (/assessments/grant-study)", () => {
    expect(routersContent).toContain("(/assessments/grant-study)");
  });

  it("should have correct Dharma Finder URL (/assessments/dharma-finder)", () => {
    expect(routersContent).toContain("(/assessments/dharma-finder)");
  });

  it("should have correct Consciousness Scale URL (/assessments/consciousness-scale)", () => {
    expect(routersContent).toContain("(/assessments/consciousness-scale)");
  });
});

describe("FauxTony suggested questions include assessment topics", () => {
  // Read TonyDiscovery.tsx
  const discoveryContent = readFileSync(
    resolve(__dirname, "../client/src/components/TonyDiscovery.tsx"),
    "utf-8"
  );

  it("should include Grant Study question", () => {
    expect(discoveryContent).toContain("Grant Study");
  });

  it("should include Find My Me question", () => {
    expect(discoveryContent).toContain("Find My Me");
  });

  it("should include assessment-first question", () => {
    expect(discoveryContent).toContain("What assessment should I take first?");
  });

  it("should include self-understanding question", () => {
    expect(discoveryContent).toContain("understand myself better");
  });

  it("should include love language question", () => {
    expect(discoveryContent).toContain("love language");
  });

  it("should include attachment style question", () => {
    expect(discoveryContent).toContain("attachment style");
  });
});
