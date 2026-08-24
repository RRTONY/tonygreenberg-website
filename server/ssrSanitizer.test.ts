import { describe, expect, it } from "vitest";
import { sanitizeCrawlerHtml } from "./ssrSanitizer";

describe("sanitizeCrawlerHtml", () => {
  it("preserves dollar amounts while normalizing short metadata and duplicate H1s", () => {
    const html = `<!doctype html><html><head>
      <title>Example Page</title>
      <meta name="description" content="A $12 note about the real price of trust, responsibility, and the public systems that shape a life." />
    </head><body><h1>Example Page</h1><h1>Repeated source heading</h1><p>Short visible copy.</p></body></html>`;

    const result = sanitizeCrawlerHtml(html, "https://tonygreenberg.com/example");

    expect(result).toContain("$12");
    expect((result.match(/<h1\b/gi) || []).length).toBe(1);
    expect(result).toContain("<h2>Repeated source heading</h2>");
    expect(result).toContain('application/ld+json');
    expect(result).toContain('og:image');
    expect(result).toContain("data-crawler-context");
  });

  it("replaces session-scoped image URLs with the permanent mobile-safe fallback", () => {
    const html = `<!doctype html><html><head><title>Image Test</title></head><body>
      <img src="https://private-us-east-1.manuscdn.com/sessionFile/example.jpg" alt="expired" />
    </body></html>`;

    const result = sanitizeCrawlerHtml(html, "https://tonygreenberg.com/image-test");

    expect(result).not.toContain("private-us-east-1.manuscdn.com");
    expect(result).toContain("/api/img/tony-headshot_2d63de23.jpg");
  });
});
