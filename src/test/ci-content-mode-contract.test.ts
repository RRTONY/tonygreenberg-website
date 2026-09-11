import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("CI-only editorial content mode", () => {
  it("keeps the empty content mode explicit and guards every database-backed query", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/post-repository.ts"),
      "utf8",
    );

    expect(source).toContain('process.env.TONY_CI_CONTENT_MODE === "empty"');
    expect((source.match(/if \(usesCiEmptyContentMode\(\)\)/g) ?? []).length).toBe(11);
    expect(source).toContain("if (usesCiEmptyContentMode()) return { posts: [], total: 0 };");
  });
});
