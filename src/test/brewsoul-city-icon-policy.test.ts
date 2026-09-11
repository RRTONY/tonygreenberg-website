import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("BrewSoul city explorer icon policy", () => {
  it("uses Lucide mappings for methodology dimensions and close controls", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/brewsoul/cities-explorer.tsx"),
      "utf8",
    );

    expect(source).toContain("const DIMENSION_ICONS");
    expect(source).toContain("<X");
    expect(source).toContain('aria-label="Close scoring methodology"');
    expect(source).not.toContain("{dim.icon}");
    expect(source).not.toContain(">×<");
  });
});
