import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Psychedelic Readiness content and persistence policy", () => {
  it("removes unsupported testimonials and describes cookie-backed state accurately", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/pri/psychedelic-readiness-index.tsx"),
      "utf8",
    );

    expect(source).not.toContain("const TESTIMONIALS");
    expect(source).not.toContain("From people who took it");
    expect(source).not.toContain("stored locally in your browser");
    expect(source).toContain("secure, server-managed visitor state");
    expect(source).toContain("cookie-backed");
  });
});
