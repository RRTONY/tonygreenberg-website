import { describe, expect, it } from "vitest";
import { AQUEOUS_BASE, aq, aqueousMainLinks, aqueousMoreLinks, aqueousRoutes, aqueousUnlistedRoutes } from "@/lib/content/aqueous/nav";

describe("aq", () => {
  it("puts every app path under /aqueous", () => {
    expect(AQUEOUS_BASE).toBe("/aqueous");
    expect(aq("/")).toBe("/aqueous");
    expect(aq("")).toBe("/aqueous");
    expect(aq("/explore")).toBe("/aqueous/explore");
    expect(aq("explore")).toBe("/aqueous/explore");
    expect(aq("/report/5?x=1#top")).toBe("/aqueous/report/5?x=1#top");
    expect(aq("?ref=AQ-ABC234")).toBe("/aqueous?ref=AQ-ABC234");
    expect(aq("#faq")).toBe("/aqueous#faq");
  });
});

describe("menu and routes", () => {
  const links = [...aqueousMainLinks, ...aqueousMoreLinks];

  it("has the app's 8 main links and 9 in More, each once, with labels", () => {
    expect(aqueousMainLinks.map((l) => l.label)).toEqual([
      "Home",
      "AWI Index",
      "Explorer",
      "Tap Water",
      "Compare",
      "Wall of Shame",
      "Gem Spark",
      "About",
    ]);
    expect(aqueousMoreLinks).toHaveLength(9);
    expect(new Set(links.map((l) => l.href)).size).toBe(links.length);
    for (const l of links) {
      expect(l.label.trim()).not.toBe("");
      expect(l.href.startsWith("/")).toBe(true);
    }
  });

  it("only links to real Aqueous routes", () => {
    for (const l of links) expect(aqueousRoutes).toContain(l.href);
  });

  it("lists every static route once; the unlisted ones are among them", () => {
    expect(new Set(aqueousRoutes).size).toBe(aqueousRoutes.length);
    expect(aqueousRoutes).toHaveLength(18);
    for (const r of aqueousUnlistedRoutes) expect(aqueousRoutes).toContain(r);
    for (const r of aqueousRoutes) expect(r).not.toMatch(/manus|\/api\/img\//);
  });
});
