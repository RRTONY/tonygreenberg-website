import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("BrewSoul encyclopedia cleanup", () => {
  it("does not retain the unreferenced legacy quiz export or sensory emoji fields", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/brewsoul-encyclopedia.ts"),
      "utf8",
    );

    expect(source).not.toContain("QUIZ_QUESTIONS");
    expect(source).not.toContain("emoji:");
  });
});
