import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("public engagement pricing removal", () => {
  it("keeps the requested scoping-conversation sentence in both homepage engagement cards", () => {
    const home = read("client/src/pages/Home.tsx");
    const phrase = "Engagements begin with a scoping conversation.";

    expect(home.split(phrase)).toHaveLength(3);
    expect(home).not.toMatch(/\$5K minimum|\$5,000 minimum|minim(?:um)? engagement/i);
  });

  it("preserves the guarantee and emphasizes the domain-expert promise", () => {
    const home = read("client/src/pages/Home.tsx");

    expect(home).toContain("2X RETURN GUARANTEE");
    expect(home).toContain("Both engagements include a handpicked vertical domain expert. Tony does not show up alone.");
    expect(home).toContain('fontWeight: 800');
  });

  it("keeps public SEO, structured-page, and AI-discovery engagement surfaces free of fixed minimum pricing", () => {
    const surfaces = [
      "server/seo-meta.ts",
      "server/ssr-pages.ts",
      "server/ssr-batch2.ts",
      "client/public/llms.txt",
    ].map(read).join("\n");

    expect(surfaces).not.toMatch(/\$5K minimum|\$5,000 minimum|minim(?:um)? engagement|"priceRange"\s*:/i);
  });
});
