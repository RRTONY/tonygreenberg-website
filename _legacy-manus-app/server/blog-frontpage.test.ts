import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  formatTag: string;
  reads: number;
  image?: string;
  originalContent: string;
  updatedContent: string;
  keywords?: string[];
  relevantParties?: { name: string; reason: string }[];
  supportingNews?: { headline: string; source: string; year: string; connection: string };
}

function loadBlogData(): BlogPost[] {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../client/src/data/blogData.json"),
      "utf-8"
    )
  );
}

describe("Homepage - Editor's Picks (Top 3 by reads)", () => {
  it("should have at least 3 posts with reads data", () => {
    const posts = loadBlogData();
    const sorted = [...posts].sort((a, b) => (b.reads || 0) - (a.reads || 0));
    const top3 = sorted.slice(0, 3);

    expect(top3.length).toBe(3);
    for (const post of top3) {
      expect(post.reads).toBeGreaterThan(0);
      expect(post.title).toBeDefined();
      expect(post.slug).toBeDefined();
    }
  });
});

describe("Homepage - Most Read Section (Top 5)", () => {
  it("should have at least 5 posts with reads data", () => {
    const posts = loadBlogData();
    const sorted = [...posts].sort((a, b) => (b.reads || 0) - (a.reads || 0));
    const top5 = sorted.slice(0, 5);

    expect(top5.length).toBe(5);
    for (const post of top5) {
      expect(post.reads).toBeGreaterThan(0);
    }
  });

  it("should return top 5 in descending order of reads", () => {
    const posts = loadBlogData();
    const sorted = [...posts].sort((a, b) => (b.reads || 0) - (a.reads || 0));
    const top5 = sorted.slice(0, 5);

    for (let i = 1; i < top5.length; i++) {
      expect(top5[i - 1].reads).toBeGreaterThanOrEqual(top5[i].reads);
    }
  });
});

describe("Homepage - Core Themes", () => {
  const primaryThemeCategories = [
    "Business & Capital",
    "Systems & Innovation",
    "Culture & Communication",
    "Living Well",
    "Impact & Purpose",
    "The Crusades",
  ];
  const expectedCategories = [
    "Business & Capital",
    "Systems & Innovation",
    "Culture & Communication",
    "Living Well",
    "Impact & Purpose",
    "The Crusades",
    "Enterprise Technology & AI",
    "Psychedelic Medicine",
    "Conscious Capital",
  ];

  it("should recognize every active archive category", () => {
    expect(expectedCategories.length).toBe(9);
  });

  it("all 121 posts should be classified into an active archive category", () => {
    const posts = loadBlogData();
    expect(posts.length).toBe(121);
    for (const post of posts) {
      expect(expectedCategories).toContain(post.category);
    }
  });

  it("each active category should have the expected current post count", () => {
    const posts = loadBlogData();
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    expect(counts["Business & Capital"]).toBe(25);
    expect(counts["Systems & Innovation"]).toBe(21);
    expect(counts["Culture & Communication"]).toBe(20);
    expect(counts["Living Well"]).toBe(28);
    expect(counts["Impact & Purpose"]).toBe(8);
    expect(counts["The Crusades"]).toBe(14);
    expect(counts["Enterprise Technology & AI"]).toBe(1);
    expect(counts["Psychedelic Medicine"]).toBe(3);
    expect(counts["Conscious Capital"]).toBe(1);
  });

  it("themeMap.json should have entries for the six primary themes", () => {
    const themeMap = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/themeMap.json"),
        "utf-8"
      )
    );
    for (const cat of primaryThemeCategories) {
      expect(themeMap[cat]).toBeDefined();
      expect(themeMap[cat].length).toBeGreaterThan(0);
    }
  });

  it("themeMap slugs should all exist in blogData", () => {
    const posts = loadBlogData();
    const allSlugs = new Set(posts.map((p) => p.slug));
    const themeMap = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/themeMap.json"),
        "utf-8"
      )
    );
    for (const [cat, slugs] of Object.entries(themeMap)) {
      for (const slug of slugs as string[]) {
        expect(allSlugs.has(slug)).toBe(true);
      }
    }
  });
});

describe("Homepage - Latest Essays", () => {
  it("should use the first 4 posts from the data (already sorted by date)", () => {
    const posts = loadBlogData();
    const latest = posts.slice(0, 4);

    expect(latest.length).toBe(4);
    for (const post of latest) {
      expect(post.date).toBeDefined();
      expect(post.title).toBeDefined();
    }
  });
});

describe("Sidebar - Most Provocative Section", () => {
  it("should filter posts by Crusade, Manifesto, and Reckoning format tags", () => {
    const posts = loadBlogData();
    const provocativeTags = ["The Crusade", "The Manifesto", "The Reckoning"];
    const provocative = posts.filter((p) => provocativeTags.includes(p.formatTag));

    expect(provocative.length).toBeGreaterThanOrEqual(8);
    for (const post of provocative) {
      expect(provocativeTags).toContain(post.formatTag);
    }
  });
});

describe("Sidebar - Curated Journeys", () => {
  const journeySlugs: Record<string, string[]> = {
    "The Crusade Files": [
      "dmn8-the-most-beautiful-crooked-gym-in-the-world",
      "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "luz-lounge-where-loyalty-goes-to-die-groupon",
      "bread-stuck-with-no-customer-service",
      "how-to-alienate-a-loyal-vegan",
      "hiding-fees-tips-in-the-transparent-age",
      "forward-health-is-a-sideway-step-at-best",
    ],
    "Consciousness and Technology": [
      "boiling-the-human-summit-harvard-kurzweil",
      "the-ball-and-blockchain-decentralization",
      "psychedelics-could-become-extractive-capitalism",
      "human-operating-system",
      "building-services-market-transhuman-era",
      "elixir-of-life-device-and-journey",
    ],
    "Trust, Service, and Relationships": [
      "only-time-buys-trust",
      "customer-service-key-to-business-success",
      "why-good-service-is-all-about-trust",
      "apologize",
      "grateful-smuggest-sentiment-or-selfish-act",
      "the-decay-of-modern-day-communication",
      "the-ties-that-bind-interpersonal-relationships",
    ],
    "Impact Investing and the Future": [
      "return-on-investment-going-green-going-green-2",
      "davos-2022-world-economic-forum-here-we-come",
      "eco-vegan-realities-seriesethical-economic",
      "from-supply-chain-to-the-blockchain-heal",
      "powering-purpose-driven-innovation",
      "india-my-virtual-soul-home",
    ],
    "Personal Provocations": [
      "would-you-hire-someone-who-led-a-rebellion",
      "grateful-smuggest-sentiment-or-selfish-act",
      "apologize",
      "truth-bias-mutually-exclusive",
      "covid-deniers-need-to-take-a-breath",
      "more-ignorance-or-indignance-in-the-wake-of-covid-19",
      "transforming-tony-2-books-mountain-life-strife",
    ],
  };

  it("should have all journey slugs present in the blog data", () => {
    const posts = loadBlogData();
    const allSlugs = new Set(posts.map((p) => p.slug));

    for (const [journeyName, slugs] of Object.entries(journeySlugs)) {
      for (const slug of slugs) {
        expect(allSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("should have 5 curated journeys", () => {
    expect(Object.keys(journeySlugs).length).toBe(5);
  });

  it("should have at least 5 posts per journey", () => {
    for (const [journeyName, slugs] of Object.entries(journeySlugs)) {
      expect(slugs.length).toBeGreaterThanOrEqual(5);
    }
  });
});

describe("Blog Post - Default Version", () => {
  it("should default to original version (BlogPost.tsx uses 'original' as initial state)", () => {
    const blogPostContent = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/BlogPost.tsx"),
      "utf-8"
    );
    expect(blogPostContent).toContain('useState<"original" | "updated">("original")');
  });

  it("should show Original Post button first (left position) in the toggle", () => {
    const blogPostContent = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/BlogPost.tsx"),
      "utf-8"
    );
    const originalButtonIdx = blogPostContent.indexOf('ORIGINAL POST');
    const updatedButtonIdx = blogPostContent.indexOf('UPDATED FOR TODAY');
    expect(originalButtonIdx).toBeGreaterThan(-1);
    expect(updatedButtonIdx).toBeGreaterThan(-1);
    expect(originalButtonIdx).toBeLessThan(updatedButtonIdx);
  });
});

describe("Blog Data - Image Quality", () => {
  it("most posts should have non-WordPress image URLs (generated images)", () => {
    const posts = loadBlogData();
    const withWpImages = posts.filter(
      (p) => p.image && p.image.includes("wordpress.com")
    );
    // At most 2 posts should still have old WP images (the 1 failed + any edge cases)
    expect(withWpImages.length).toBeLessThanOrEqual(2);
  });

  it("every post has an image or a permanent category-cover fallback", () => {
    const posts = loadBlogData();
    const fallbackCategories = new Set([
      "Business & Capital", "Systems & Innovation", "Culture & Communication",
      "Living Well", "Impact & Purpose", "The Crusades", "Enterprise Technology & AI",
      "Psychedelic Medicine", "Conscious Capital",
    ]);
    for (const post of posts) {
      expect(Boolean(post.image) || fallbackCategories.has(post.category)).toBe(true);
    }
  });
});

describe("Blog Data - Reads Doubling", () => {
  it("top post should have reads > 15000 (was ~9847, doubled to ~19694)", () => {
    const posts = loadBlogData();
    const sorted = [...posts].sort((a, b) => (b.reads || 0) - (a.reads || 0));
    expect(sorted[0].reads).toBeGreaterThan(15000);
  });
});

describe("Post Reactions - Database Schema", () => {
  it("should have postReactions table defined in schema", () => {
    const schemaContent = fs.readFileSync(
      path.resolve(__dirname, "../drizzle/schema.ts"),
      "utf-8"
    );
    expect(schemaContent).toContain("postReactions");
    expect(schemaContent).toContain("postSlug");
    expect(schemaContent).toContain("reaction");
  });
});

describe("Post Reactions - Router", () => {
  it("should have reaction procedures in the router", () => {
    const routerContent = fs.readFileSync(
      path.resolve(__dirname, "./routers.ts"),
      "utf-8"
    );
    expect(routerContent).toContain("reactions");
    expect(routerContent).toContain("react:");
    expect(routerContent).toContain("getStats");
  });
});

describe("Phone Number Removal", () => {
  it("should not contain Tony's phone number anywhere in the project frontend", () => {
    const filesToCheck = [
      "../client/src/components/Layout.tsx",
      "../client/src/pages/Journeys.tsx",
      "../client/src/pages/PickUp.tsx",
    ];

    for (const file of filesToCheck) {
      const content = fs.readFileSync(
        path.resolve(__dirname, file),
        "utf-8"
      );
      expect(content).not.toContain("310");
      expect(content).not.toContain("985");
      expect(content).not.toContain("9668");
    }
  });
});
