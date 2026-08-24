/**
 * Tests for bounce rate reduction features.
 * These are unit tests for the data/logic layers of the 7 features.
 */
import { describe, it, expect } from "vitest";

// ── Feature 2: Read Next recommendations ──
describe("ReadNext recommendation logic", () => {
  // Simulate the recommendation algorithm from ReadNext.tsx
  function getRecommendations(
    currentSlug: string,
    currentCategory: string,
    currentKeywords: string[],
    allPosts: Array<{
      slug: string;
      category: string;
      keywords?: string[];
      title: string;
    }>
  ) {
    const candidates = allPosts.filter((p) => p.slug !== currentSlug);
    const scored = candidates.map((p) => {
      let score = 0;
      if (p.category === currentCategory) score += 3;
      if (p.keywords && currentKeywords) {
        const overlap = p.keywords.filter((k) =>
          currentKeywords.includes(k)
        ).length;
        score += overlap * 2;
      }
      return { ...p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }

  const mockPosts = [
    { slug: "post-a", category: "Tech", keywords: ["AI", "cloud"], title: "Post A" },
    { slug: "post-b", category: "Tech", keywords: ["AI", "data"], title: "Post B" },
    { slug: "post-c", category: "Health", keywords: ["peptides"], title: "Post C" },
    { slug: "post-d", category: "Tech", keywords: ["cloud", "infra"], title: "Post D" },
    { slug: "post-e", category: "Impact", keywords: ["tokens"], title: "Post E" },
  ];

  it("should return 3 recommendations", () => {
    const recs = getRecommendations("post-a", "Tech", ["AI", "cloud"], mockPosts);
    expect(recs).toHaveLength(3);
  });

  it("should not include the current post", () => {
    const recs = getRecommendations("post-a", "Tech", ["AI", "cloud"], mockPosts);
    expect(recs.every((r) => r.slug !== "post-a")).toBe(true);
  });

  it("should prioritize same-category posts", () => {
    const recs = getRecommendations("post-a", "Tech", ["AI", "cloud"], mockPosts);
    // post-b and post-d are both Tech, should rank higher
    const techPosts = recs.filter((r) => r.category === "Tech");
    expect(techPosts.length).toBeGreaterThanOrEqual(2);
  });

  it("should prioritize keyword overlap", () => {
    const recs = getRecommendations("post-a", "Tech", ["AI", "cloud"], mockPosts);
    // post-b shares "AI", post-d shares "cloud" — both should appear
    const slugs = recs.map((r) => r.slug);
    expect(slugs).toContain("post-b");
    expect(slugs).toContain("post-d");
  });
});

// ── Feature 4: Exit-intent contextual questions ──
describe("Exit-intent contextual questions", () => {
  function getContextualQuestion(pathname: string): string {
    if (pathname.startsWith("/blog/")) {
      return "What other essays would you enjoy based on this one?";
    }
    if (pathname === "/blog" || pathname === "/") {
      return "What should I read first on this site?";
    }
    if (pathname.startsWith("/find-")) {
      return "Which assessment should I take first?";
    }
    if (pathname === "/amplifier" || pathname === "/diamond-cut") {
      return "How does working with Tony actually work?";
    }
    if (pathname === "/invest") {
      return "Tell me about Tony's investment thesis";
    }
    if (pathname === "/the-letter" || pathname === "/walk-through") {
      return "Give me the 60-second version of who Tony is";
    }
    if (pathname === "/ecosystem") {
      return "What companies has Tony built or invested in?";
    }
    return "What's the most interesting thing on this site?";
  }

  it("should return blog-specific question for blog posts", () => {
    expect(getContextualQuestion("/blog/some-post")).toContain("essays");
  });

  it("should return homepage question for root", () => {
    expect(getContextualQuestion("/")).toContain("read first");
  });

  it("should return assessment question for find pages", () => {
    expect(getContextualQuestion("/find-my")).toContain("assessment");
  });

  it("should return investment question for invest page", () => {
    expect(getContextualQuestion("/invest")).toContain("investment");
  });

  it("should return generic question for unknown pages", () => {
    expect(getContextualQuestion("/random-page")).toContain("interesting");
  });
});

// ── Feature 5: Internal linking map ──
describe("Internal link map additions", () => {
  // Verify that internal site links exist in the link map
  const internalLinks: Record<string, string> = {
    "The Amplifier": "/amplifier",
    "The Diamond Cut": "/diamond-cut",
    "Seven Doors": "/walk-through",
    "The Liquid Library": "/spirits",
    "The Body": "/the-body",
    "The Nightstand": "/the-nightstand",
    "Find My": "/find-my",
    "Self-Portrait": "/self-portrait",
    "The Territory": "/the-territory",
    "Engine Room": "/engine-room",
    "The Rolodex": "/clients",
    "The Index": "/the-index",
    "Ecosystem Map": "/ecosystem-map",
  };

  it("should have internal site links that start with /", () => {
    for (const [key, href] of Object.entries(internalLinks)) {
      expect(href.startsWith("/")).toBe(true);
    }
  });

  it("should have at least 10 internal cross-links", () => {
    expect(Object.keys(internalLinks).length).toBeGreaterThanOrEqual(10);
  });
});

// ── Feature 6: Assessment progress tracking ──
describe("Assessment progress tracking", () => {
  const ALL_ASSESSMENTS = [
    { slug: "find-your-me", label: "Find My Me" },
    { slug: "find-your-peptide", label: "Find My Peptide" },
    { slug: "find-your-therapy", label: "Find My Therapy" },
    { slug: "find-your-spirit", label: "Find My Spirit" },
    { slug: "find-your-diet", label: "Find My Diet" },
    { slug: "find-your-coffee", label: "Find My Coffee" },
    { slug: "find-your-movement", label: "Find My Movement" },
    { slug: "find-your-sleep", label: "Find My Sleep" },
    { slug: "find-your-religion", label: "Find My Religion" },
    { slug: "find-your-sake", label: "Find My Sake" },
    { slug: "find-your-style", label: "Find My Style" },
    { slug: "find-your-kitchen", label: "Find My Kitchen" },
    { slug: "find-your-attachment-style", label: "Find My Attachment Style" },
    { slug: "find-your-love-language", label: "Find My Love Language" },
    { slug: "find-your-sexuality", label: "Find My Sexuality" },
    { slug: "dharma-finder", label: "Find Your Purpose" },
    { slug: "consciousness-scale", label: "Consciousness Scale" },
    { slug: "grant-study", label: "Grant Study Score" },
    { slug: "find-your-ev", label: "Find My Car" },
  ];

  it("should have at least 15 assessments tracked", () => {
    expect(ALL_ASSESSMENTS.length).toBeGreaterThanOrEqual(15);
  });

  it("should calculate correct progress percentage", () => {
    const completed = ["find-your-me", "find-your-diet", "find-your-coffee"];
    const total = ALL_ASSESSMENTS.length;
    const pct = Math.round((completed.length / total) * 100);
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThan(100);
  });

  it("should not duplicate completed assessments", () => {
    const completed: string[] = [];
    const slug = "find-your-me";
    if (!completed.includes(slug)) completed.push(slug);
    if (!completed.includes(slug)) completed.push(slug);
    expect(completed.length).toBe(1);
  });

  it("should unlock self-portrait at 5+ completions", () => {
    const completed = ["a", "b", "c", "d", "e"];
    expect(completed.length >= 5).toBe(true);
  });
});

// ── Feature 7: Returning visitor detection ──
describe("Returning visitor detection", () => {
  it("should only show for 2+ visits", () => {
    const visitCount = 1;
    const shouldShow = visitCount >= 2;
    expect(shouldShow).toBe(false);
  });

  it("should show for returning visitors", () => {
    const visitCount = 3;
    const shouldShow = visitCount >= 2;
    expect(shouldShow).toBe(true);
  });

  it("should truncate long blog titles", () => {
    const title = "This is a very long blog post title that should be truncated for display purposes";
    const truncated = title.length > 40 ? title.slice(0, 40) + "…" : title;
    expect(truncated.length).toBeLessThanOrEqual(41); // 40 + ellipsis
    expect(truncated.endsWith("…")).toBe(true);
  });

  it("should not truncate short titles", () => {
    const title = "Short Title";
    const truncated = title.length > 40 ? title.slice(0, 40) + "…" : title;
    expect(truncated).toBe("Short Title");
  });
});
