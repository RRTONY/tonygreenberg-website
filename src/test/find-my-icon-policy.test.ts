import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("Find My directory icon policy", () => {
  it("stores semantic Lucide components rather than emoji or Unicode symbols", () => {
    const source = readProjectFile("src/lib/content/find-my-directory.ts");

    expect(source).toContain('from "lucide-react"');
    expect(source).toContain("Icon: LucideIcon");
    expect(source).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
    expect(source).not.toMatch(/[◎△♡◉]/u);
  });

  it("renders each Find My directory icon as an accessible decorative Lucide component", () => {
    const source = readProjectFile("src/app/find-my/page.tsx");

    expect(source).toContain("const Icon = item.Icon");
    expect(source).toContain('<Icon aria-hidden="true" className="size-5" />');
    expect(source).not.toContain("{item.icon}");
  });
});
