import { describe, expect, it } from "vitest";
import { BATCH2_SSR_ROUTES } from "./ssr-batch2";
import { renderBlogPostHTML } from "./ssr-blog-batch";

describe("Supplied Search Console peptide routes", () => {
  const targetPaths = [
    "/rip-peptide-sciences",
    "/test-your-peptides",
    "/price-tracker",
  ];

  for (const path of targetPaths) {
    it(`${path} has a substantive crawler-visible SSR page`, () => {
      const route = BATCH2_SSR_ROUTES.find((entry) => entry.path === path);
      expect(route).toBeDefined();

      const html = route!.render();
      expect(html).toMatch(/<meta name="robots" content="index, follow(?:, [^"]+)?"/);
      expect(html).toContain(`<link rel="canonical" href="https://tonygreenberg.com${path}"`);
      expect((html.match(/<h1>/g) || []).length).toBe(1);
      expect((html.match(/application\/ld\+json/g) || []).length).toBeGreaterThan(0);
      expect(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length).toBeGreaterThan(900);
    });
  }
});

describe("Supplied Search Console blog route", () => {
  it("renders one semantic H1 and a permanent image fallback for the audited speech article", () => {
    const html = renderBlogPostHTML("6-act-of-speech-speaking-as-a-tool");
    expect(html).not.toBeNull();
    expect((html!.match(/<h1\b/g) || []).length).toBe(1);
    expect(html).toContain('rel="canonical" href="https://tonygreenberg.com/blog/6-act-of-speech-speaking-as-a-tool"');
    expect(html).toContain('property="og:image" content="https://tonygreenberg.com/api/img/tony-headshot_2d63de23.jpg"');
  });
});
