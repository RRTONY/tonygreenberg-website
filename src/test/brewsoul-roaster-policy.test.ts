import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("BrewSoul biodynamic roaster policy", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/components/brewsoul/biodynamic-roasters.tsx"),
    "utf8",
  );

  it("does not present unsupported hard-coded coffee ratings", () => {
    expect(source).not.toContain("rating:");
    expect(source).not.toContain("★★★★★");
    expect(source).not.toContain("★★★★☆");
    expect(source).not.toContain("★★★☆☆");
  });

  it("uses Lucide disclosure controls rather than Unicode arrows", () => {
    expect(source).toContain('from "lucide-react"');
    expect(source).toContain("<ChevronUp");
    expect(source).toContain("<ChevronDown");
    expect(source).not.toMatch(/[▲▼]/u);
  });
});
