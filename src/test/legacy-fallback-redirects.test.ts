import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const expectedHomepageFallbacks = [
  "/built-on-manus",
  "/connect",
  "/health",
  "/library",
  "/heroes",
  "/impact",
  "/projects",
  "/quiz",
  "/seven-doors",
];

describe("verified legacy homepage fallbacks", () => {
  it("uses canonical permanent redirects instead of duplicate or 404 pages", () => {
    const nextConfig = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");

    for (const source of expectedHomepageFallbacks) {
      expect(nextConfig).toContain(`source: "${source}", destination: "/", permanent: true`);
    }
  });
});
