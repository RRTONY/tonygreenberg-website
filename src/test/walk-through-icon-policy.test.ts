import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Walk Through deep-link icon policy", () => {
  it("keeps labels textual and renders the shared forward icon", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/app/walk-through/page.tsx"),
      "utf8",
    );

    expect(source).not.toMatch(/deeperLabel: .*→/u);
    expect(source).toContain("<ForwardIcon");
    expect(source).toContain("href={door.deeperLink}");
  });
});
