import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const RETIRED_SANITY_CDN = "cdn.sanity.io/images/a3q1cyqs";
const ACTIVE_SOURCE_ROOTS = ["src/app", "src/components", "src/lib"];
const RECOVERED_MEDIA_RENDERERS = [
  "src/app/about/page.tsx",
  "src/app/the-letter/page.tsx",
  "src/app/the-body/page.tsx",
  "src/app/the-nightstand/page.tsx",
  "src/app/the-web/page.tsx",
  "src/app/walk-through/page.tsx",
  "src/components/marketing/four-doors.tsx",
];

function findSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findSourceFiles(entryPath);
    return /\.(?:ts|tsx)$/u.test(entry.name) ? [entryPath] : [];
  });
}

describe("managed public media", () => {
  it("does not retain the retired Sanity CDN in active Next.js source", () => {
    const violations = ACTIVE_SOURCE_ROOTS.flatMap((root) =>
      findSourceFiles(path.join(process.cwd(), root)),
    )
      .filter((filePath) => fs.readFileSync(filePath, "utf8").includes(RETIRED_SANITY_CDN))
      .map((filePath) => path.relative(process.cwd(), filePath));

    expect(violations).toEqual([]);
  });

  it("bypasses the local Next.js optimizer for managed-storage images", () => {
    const violations = RECOVERED_MEDIA_RENDERERS.filter((filePath) => {
      const source = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");
      return !source.includes("unoptimized");
    });

    expect(violations).toEqual([]);
  });
});
