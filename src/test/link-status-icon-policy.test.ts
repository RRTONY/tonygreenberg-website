import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const sources = [
  "src/app/attention-theft/page.tsx",
  "src/app/living-declaration/page.tsx",
  "src/app/the-open-door/page.tsx",
  "src/components/marketing/path-subscribe-form.tsx",
  "src/app/brewsoul/mold-free/page.tsx",
  "src/app/brewsoul/coffee/[id]/page.tsx",
  "src/app/amplifier/page.tsx",
  "src/app/diamond-cut/page.tsx",
];

describe("public link and status icon policy", () => {
  it("uses existing shared or Lucide icon components instead of raw visual symbols", () => {
    for (const relativePath of sources) {
      const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
      expect(source, relativePath).not.toMatch(/[→↗✓✗⚠]/u);
    }

    expect(fs.readFileSync(path.join(process.cwd(), sources[0]), "utf8")).toContain("<ForwardIcon");
    expect(fs.readFileSync(path.join(process.cwd(), sources[3]), "utf8")).toContain("<Check");
    expect(fs.readFileSync(path.join(process.cwd(), sources[4]), "utf8")).toContain(
      "<AlertTriangle",
    );
    expect(fs.readFileSync(path.join(process.cwd(), sources[5]), "utf8")).toContain("<X");
    expect(fs.readFileSync(path.join(process.cwd(), sources[6]), "utf8")).toContain("<ForwardIcon");
    expect(fs.readFileSync(path.join(process.cwd(), sources[7]), "utf8")).toContain("<ForwardIcon");
  });
});
