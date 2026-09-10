import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("shared assessment surface icon policy", () => {
  it("uses Lucide checks for shared, Dharma Finder, and Sake list markers", () => {
    const sources = [
      "src/components/assessments/assessment-intro.tsx",
      "src/components/assessments/dharma-finder-quiz.tsx",
      "src/components/assessments/find-your-sake-quiz.tsx",
    ];

    for (const relativePath of sources) {
      const source = readProjectFile(relativePath);
      expect(source, relativePath).toContain('from "lucide-react"');
      expect(source, relativePath).toContain("<Check");
    }
  });

  it("uses accurate cookie-backed privacy copy in the shared assessment introduction", () => {
    const source = readProjectFile("src/components/assessments/assessment-intro.tsx");

    expect(source).toContain("Results saved with a secure return cookie.");
    expect(source).not.toContain("Results stored locally.");
  });
});
