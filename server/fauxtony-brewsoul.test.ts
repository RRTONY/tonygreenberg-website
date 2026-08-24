/**
 * Tests for FauxTony BrewSoul integration.
 * Verifies that BrewSoul content is properly indexed in:
 * 1. FauxTony LINK_MAP (navigation)
 * 2. FauxTony system prompt (routing rules)
 * 3. Tony Knowledge Base (context for AI)
 * 4. TonyDiscovery search index (quick search)
 * 5. SearchPalette (Cmd+K search)
 * 6. NavClarifiers (tooltip descriptions)
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const routersContent = readFileSync(resolve(__dirname, "routers.ts"), "utf-8");
const knowledgeBase = readFileSync(resolve(__dirname, "tonyKnowledgeBase.ts"), "utf-8");
const discoveryContent = readFileSync(
  resolve(__dirname, "../client/src/components/TonyDiscovery.tsx"),
  "utf-8"
);
const searchPaletteContent = readFileSync(
  resolve(__dirname, "../client/src/components/SearchPalette.tsx"),
  "utf-8"
);
const navClarifiersContent = readFileSync(
  resolve(__dirname, "../client/src/components/NavClarifiers.tsx"),
  "utf-8"
);

describe("FauxTony LINK_MAP contains BrewSoul pages", () => {
  const brewsoulRoutes = [
    { name: "BrewSoul Home", path: "/brewsoul" },
    { name: "Browse Coffees", path: "/brewsoul/browse" },
    { name: "Chain Rankings", path: "/brewsoul/chains" },
    { name: "Prescription", path: "/brewsoul/prescription" },
    { name: "Wall of Shame", path: "/brewsoul/wall-of-shame" },
    { name: "Follow The Dollar", path: "/brewsoul/follow-the-dollar" },
    { name: "Coffee Health", path: "/brewsoul/health" },
    { name: "Farm Passports", path: "/brewsoul/farms" },
    { name: "Mold Free", path: "/brewsoul/mold-free" },
    { name: "Experiences", path: "/brewsoul/experiences" },
    { name: "Varieties", path: "/brewsoul/varieties" },
    { name: "Processing", path: "/brewsoul/processing" },
    { name: "Roasters", path: "/brewsoul/roasters" },
    { name: "Glossary", path: "/brewsoul/glossary" },
    { name: "Pairings", path: "/brewsoul/pairings" },
    { name: "Economics", path: "/brewsoul/economics" },
    { name: "Compare", path: "/brewsoul/compare" },
    { name: "Blend Builder", path: "/brewsoul/blend-builder" },
  ];

  for (const route of brewsoulRoutes) {
    it(`should contain link for ${route.name} (${route.path})`, () => {
      expect(routersContent).toContain(route.path);
    });
  }

  it("should have BREWSOUL section header in LINK_MAP", () => {
    expect(routersContent).toContain("BREWSOUL");
    expect(routersContent).toContain("COFFEE INTELLIGENCE PLATFORM");
  });

  it("should mention 103 coffees and 100 chains in LINK_MAP", () => {
    expect(routersContent).toContain("103 coffees");
    expect(routersContent).toContain("100 chains");
  });
});

describe("FauxTony system prompt has BrewSoul routing rules", () => {
  it("should route coffee questions to BrewSoul", () => {
    expect(routersContent).toContain("coffee, espresso, beans, roasters, brewing");
    expect(routersContent).toContain("[BrewSoul](/brewsoul)");
  });

  it("should route chain questions to Chain Rankings", () => {
    expect(routersContent).toContain("coffee chains, Starbucks, Dunkin");
    expect(routersContent).toContain("[Chain Rankings](/brewsoul/chains)");
  });

  it("should route recommendation questions to Prescription", () => {
    expect(routersContent).toContain("coffee recommendations");
    expect(routersContent).toContain("[Prescription](/brewsoul/prescription)");
  });

  it("should route fraud questions to Wall of Shame", () => {
    expect(routersContent).toContain("coffee fraud, greenwashing");
    expect(routersContent).toContain("[Wall of Shame](/brewsoul/wall-of-shame)");
  });

  it("should route sourcing questions to Follow The Dollar and Farms", () => {
    expect(routersContent).toContain("coffee sourcing, fair trade");
    expect(routersContent).toContain("[Follow The Dollar](/brewsoul/follow-the-dollar)");
    expect(routersContent).toContain("[Farm Passports](/brewsoul/farms)");
  });

  it("should route variety questions to Varieties page", () => {
    expect(routersContent).toContain("coffee varieties, gesha, bourbon");
    expect(routersContent).toContain("[Varieties](/brewsoul/varieties)");
  });

  it("should route processing questions to Processing page", () => {
    expect(routersContent).toContain("coffee processing, natural, washed");
    expect(routersContent).toContain("[Processing](/brewsoul/processing)");
  });

  it("should route health questions to Health and Mold Free pages", () => {
    expect(routersContent).toContain("coffee and health, mold, mycotoxins");
    expect(routersContent).toContain("[Health](/brewsoul/health)");
    expect(routersContent).toContain("[Mold Free](/brewsoul/mold-free)");
  });

  it("should route identity questions to BrewSoul Quiz", () => {
    expect(routersContent).toContain("coffee identity");
    expect(routersContent).toContain("6 archetypes");
  });
});

describe("Tony Knowledge Base contains BrewSoul content", () => {
  it("should have BrewSoul section header", () => {
    expect(knowledgeBase).toContain("BREWSOUL");
    expect(knowledgeBase).toContain("THE INTELLIGENCE OF COFFEE");
  });

  it("should describe all 6 identity archetypes", () => {
    expect(knowledgeBase).toContain("Terroir Purist");
    expect(knowledgeBase).toContain("Fermentation Explorer");
    expect(knowledgeBase).toContain("Ritual Architect");
    expect(knowledgeBase).toContain("Impact Alchemist");
    expect(knowledgeBase).toContain("Pressure Seeker");
    expect(knowledgeBase).toContain("The Awakening");
  });

  it("should have chain ranking highlights", () => {
    expect(knowledgeBase).toContain("S-Tier");
    expect(knowledgeBase).toContain("F-Tier");
    expect(knowledgeBase).toContain("Intelligentsia");
    expect(knowledgeBase).toContain("Counter Culture");
  });

  it("should describe scoring methodology", () => {
    expect(knowledgeBase).toContain("BREWSOUL SCORING METHODOLOGY");
    expect(knowledgeBase).toContain("Cupping Score");
    expect(knowledgeBase).toContain("QPR");
  });

  it("should list key BrewSoul pages", () => {
    expect(knowledgeBase).toContain("/brewsoul/chains");
    expect(knowledgeBase).toContain("/brewsoul/prescription");
    expect(knowledgeBase).toContain("/brewsoul/browse");
  });
});

describe("TonyDiscovery has BrewSoul search entries", () => {
  it("should have BrewSoul in PAGES array", () => {
    expect(discoveryContent).toContain('href: "/brewsoul"');
  });

  it("should have Chain Rankings in PAGES array", () => {
    expect(discoveryContent).toContain('href: "/brewsoul/chains"');
  });

  it("should have Prescription in PAGES array", () => {
    expect(discoveryContent).toContain('href: "/brewsoul/prescription"');
  });

  it("should have coffee-related tags for search", () => {
    expect(discoveryContent).toContain('"brewsoul"');
    expect(discoveryContent).toContain('"espresso"');
    expect(discoveryContent).toContain('"starbucks"');
  });

  it("should have coffee suggested questions", () => {
    expect(discoveryContent).toContain("best coffee in the world");
    expect(discoveryContent).toContain("BrewSoul identity");
    expect(discoveryContent).toContain("coffee chains");
  });
});

describe("SearchPalette has BrewSoul entries", () => {
  it("should have BrewSoul in PAGES array", () => {
    expect(searchPaletteContent).toContain('href: "/brewsoul"');
  });

  it("should have Chain Rankings in PAGES array", () => {
    expect(searchPaletteContent).toContain('href: "/brewsoul/chains"');
  });

  it("should have Prescription in PAGES array", () => {
    expect(searchPaletteContent).toContain('href: "/brewsoul/prescription"');
  });

  it("should have Browse Coffees in PAGES array", () => {
    expect(searchPaletteContent).toContain('href: "/brewsoul/browse"');
  });
});

describe("NavClarifiers has BrewSoul entries", () => {
  it("should have clarifier for /brewsoul", () => {
    expect(navClarifiersContent).toContain('"/brewsoul"');
  });

  it("should have clarifier for /brewsoul/chains", () => {
    expect(navClarifiersContent).toContain('"/brewsoul/chains"');
  });

  it("should have clarifier for /brewsoul/prescription", () => {
    expect(navClarifiersContent).toContain('"/brewsoul/prescription"');
  });

  it("should have clarifier for /brewsoul/browse", () => {
    expect(navClarifiersContent).toContain('"/brewsoul/browse"');
  });
});
