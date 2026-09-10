import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const RETIRED_SANITY_CDN = "cdn.sanity.io/images/a3q1cyqs";
const ACTIVE_SOURCE_ROOTS = ["src/app", "src/components", "src/lib"];
const RECOVERED_MEDIA_EXPECTATIONS = {
  "src/app/about/page.tsx": [
    "/manus-storage/about-walkthrough-portrait_f97955e3.webp",
    "/manus-storage/the-letter-hero_f831d229.webp",
    "unoptimized",
  ],
  "src/app/the-letter/page.tsx": [
    "/manus-storage/the-letter-hero_f831d229.webp",
    "/manus-storage/the-letter-feature-one_dd233ff1.webp",
    "/manus-storage/the-letter-feature-two_4f6cea31.webp",
    "/manus-storage/the-letter-feature-three_41e72f90.webp",
    "/manus-storage/the-letter-feature-four_f14845b3.webp",
    "unoptimized",
  ],
  "src/app/the-body/page.tsx": ["/manus-storage/the-body-hero_1ede8372.webp", "unoptimized"],
  "src/app/the-nightstand/page.tsx": [
    "/manus-storage/the-nightstand-hero_ffcf4739.webp",
    "unoptimized",
  ],
  "src/app/the-web/page.tsx": ["/manus-storage/the-web-hero_06f8b491.webp", "unoptimized"],
  "src/app/walk-through/page.tsx": [
    "/manus-storage/about-walkthrough-portrait_f97955e3.webp",
    "unoptimized",
  ],
  "src/components/marketing/four-doors.tsx": [
    'unoptimized={door.img.startsWith("/manus-storage/")}',
  ],
};

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
    const violations = Object.entries(RECOVERED_MEDIA_EXPECTATIONS).flatMap(
      ([filePath, expectedFragments]) => {
        const source = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");
        return expectedFragments
          .filter((fragment) => !source.includes(fragment))
          .map((fragment) => `${filePath}: missing ${fragment}`);
      },
    );

    expect(violations).toEqual([]);
  });
});
