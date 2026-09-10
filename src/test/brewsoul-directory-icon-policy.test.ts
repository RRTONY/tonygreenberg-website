import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BREWSOUL_CATEGORIES } from "@/lib/content/brewsoul-directory";

describe("BrewSoul directory icon policy", () => {
  it("maps every rendered category and page entry to a Lucide component", () => {
    const component = fs.readFileSync(
      path.join(process.cwd(), "src/components/brewsoul/directory-explorer.tsx"),
      "utf8",
    );

    expect(component).toContain("const CATEGORY_ICONS");
    expect(component).toContain("const PAGE_ICONS");
    expect(component).not.toContain("{cat.emoji}");
    expect(component).not.toContain("{page.icon}");

    for (const category of BREWSOUL_CATEGORIES) {
      expect(component).toContain(`"${category.title}":`);

      for (const page of category.pages) {
        expect(component).toContain(`"${page.path}":`);
      }
    }
  });
});
