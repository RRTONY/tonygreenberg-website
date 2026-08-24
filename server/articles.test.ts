import { describe, it, expect } from "vitest";
import blogData from "../client/src/data/blogData.json";
import footerData from "../client/src/data/footerData.json";

describe("Article #89 - Restaurants Beware of Vegans", () => {
  const article = blogData.find(
    (a: any) => a.slug === "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants"
  ) as any;

  it("exists in blogData", () => {
    expect(article).toBeDefined();
  });

  it("has required fields", () => {
    expect(article.title).toBe("Restaurants Beware of Vegans and Vegans Beware of Lying Restaurants");
    expect(article.category).toBe("The Crusades");
    expect(article.formatTag).toBe("The Crusade");
    expect(article.date).toBe("February 2026");
    expect(article.readTime).toBe("8 min read");
    expect(article.image).toContain("https://");
    expect(article.heroImage).toContain("https://");
  });

  it("has full original content", () => {
    expect(article.originalContent.length).toBeGreaterThan(1000);
    expect(article.originalContent).toContain("Interrogation Protocol");
    expect(article.originalContent).toContain("Fryer Inquisition");
    expect(article.originalContent).toContain("HappyCow");
    expect(article.originalContent).toContain("KFC");
  });

  it("has keywords", () => {
    expect(article.keywords.length).toBeGreaterThan(5);
    expect(article.keywords).toContain("vegan");
    expect(article.keywords).toContain("restaurant transparency");
  });

  it("has relevant parties", () => {
    expect(article.relevantParties.length).toBe(3);
    expect(article.relevantParties[0].name).toContain("KFC");
  });

  it("has supporting news", () => {
    expect(article.supportingNews.headline).toBeTruthy();
    expect(article.supportingNews.source).toBeTruthy();
  });

  it("has lesson and next steps", () => {
    expect(article.lesson).toBeTruthy();
    expect(article.nextSteps.length).toBe(3);
  });

  it("has footer data", () => {
    const footer = (footerData as any)["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants"];
    expect(footer).toBeDefined();
    expect(footer.exercise.title).toBe("The Restaurant Truth Audit");
    expect(footer.related.length).toBe(3);
    expect(footer.riddle).toBeTruthy();
    expect(footer.furtherReading.length).toBe(3);
  });
});

describe("Article #90 - Dairy Tax", () => {
  const article = blogData.find(
    (a: any) => a.slug === "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet"
  ) as any;

  it("exists in blogData", () => {
    expect(article).toBeDefined();
  });

  it("has required fields", () => {
    expect(article.title).toBe("The Butcher's Daughter, the Carbon Toll, and the Cheese That Ate the Planet");
    expect(article.category).toBe("The Crusades");
    expect(article.formatTag).toBe("The Crusade");
    expect(article.date).toBe("February 2026");
    expect(article.readTime).toBe("6 min read");
    expect(article.image).toContain("https://");
    expect(article.heroImage).toContain("https://");
  });

  it("has full original content", () => {
    expect(article.originalContent.length).toBeGreaterThan(1000);
    expect(article.originalContent).toContain("Pigouvian");
    expect(article.originalContent).toContain("Butcher's Daughter");
    expect(article.originalContent).toContain("Butcher's Son");
    expect(article.originalContent).toContain("Gruyère");
    expect(article.originalContent).toContain("Carbon Reality Surcharge");
  });

  it("has keywords", () => {
    expect(article.keywords.length).toBeGreaterThan(5);
    expect(article.keywords).toContain("dairy tax");
    expect(article.keywords).toContain("Pigouvian tax");
  });

  it("has relevant parties", () => {
    expect(article.relevantParties.length).toBe(3);
    expect(article.relevantParties[0].name).toContain("Butcher's Daughter");
  });

  it("has supporting news", () => {
    expect(article.supportingNews.headline).toBeTruthy();
    expect(article.supportingNews.source).toBe("Nature Food");
  });

  it("has lesson and next steps", () => {
    expect(article.lesson).toBeTruthy();
    expect(article.nextSteps.length).toBe(3);
  });

  it("has footer data", () => {
    const footer = (footerData as any)["the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet"];
    expect(footer).toBeDefined();
    expect(footer.exercise.title).toBe("The Hidden Cost Calculator");
    expect(footer.related.length).toBe(3);
    expect(footer.riddle).toBeTruthy();
    expect(footer.furtherReading.length).toBe(3);
  });
});

describe("Essay count consistency", () => {
  it("total articles should match the current 121-essay archive", () => {
    expect(blogData.length).toBe(121);
  });

  it("footer data should have entries for all new articles", () => {
    const fd = footerData as Record<string, any>;
    expect(fd["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants"]).toBeDefined();
    expect(fd["the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet"]).toBeDefined();
  });

  it("the current newest articles should be at the top", () => {
    const first = (blogData as any[])[0];
    const second = (blogData as any[])[1];
    expect(first.slug).toBe("energy-is-money-money-is-memory");
    expect(second.slug).toBe("your-blood-lies-without-your-dna");
  });

  it("cross-references between the two articles are correct", () => {
    const fd = footerData as Record<string, any>;
    const veganFooter = fd["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants"];
    const dairyFooter = fd["the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet"];
    
    // Vegan article should reference dairy article
    const veganRelatedSlugs = veganFooter.related.map((r: any) => r.slug);
    expect(veganRelatedSlugs).toContain("the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet");
    
    // Dairy article should reference vegan article
    const dairyRelatedSlugs = dairyFooter.related.map((r: any) => r.slug);
    expect(dairyRelatedSlugs).toContain("restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants");
  });
});
