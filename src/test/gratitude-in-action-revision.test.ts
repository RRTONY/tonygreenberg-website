import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  GRATITUDE_IN_ACTION_MARKDOWN,
  GRATITUDE_IN_ACTION_REVISION,
} from "@/lib/content/gratitude-in-action-revision";

const articlePageSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/blog/[slug]/page.tsx"),
  "utf8",
);
const revisionScriptSource = fs.readFileSync(
  path.join(process.cwd(), "scripts/revise-gratitude-in-action.ts"),
  "utf8",
);

describe("Gratitude in Action editorial revision", () => {
  it("retains the archive date while replacing the orphaned 2014 reference with a real link", () => {
    expect(GRATITUDE_IN_ACTION_REVISION.title).toBe(
      "Gratitude in Action: A 2023 Field Note, Revisited",
    );
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain(
      "The publication date remains February 20, 2023.",
    );
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain(
      "https://tonygreenberg.com/blog/grateful-smuggest-sentiment-or-selfish-act",
    );
    expect(revisionScriptSource).toContain("publishedAt: contentPosts.publishedAt");
    expect(revisionScriptSource.match(/\.set\(\{([\s\S]*?)\}\)/)?.[1]).not.toContain("publishedAt");
  });

  it("centers ImpactSoul's current RampRate role instead of unsupported third-party impact claims", () => {
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain("https://ramprate.com/impactsoul");
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain(
      "impact-oriented advisory practice in RampRate's current portfolio",
    );
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain(
      "Dollar Donation Club remains a supporting example",
    );

    for (const removedClaim of [
      "Trees That End Hunger & Poverty",
      "Stop Ocean Plastic in Rivers",
      "Great Pacific Garbage Patch",
      "Fund Education to End Extreme Poverty",
      "HubSpot",
      "Patagonia",
      "Salesforce",
      "Airbnb",
      "Seth Blaustein",
      "2.8 trees",
      "2.2 pounds",
    ]) {
      expect(GRATITUDE_IN_ACTION_MARKDOWN).not.toContain(removedClaim);
    }
  });

  it("uses semantic headings, bold checklist leads, and a scoped readable layout", () => {
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain("## The gratitude checklist for businesses");
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain("1. **Celebrate contributions regularly.**");
    expect(GRATITUDE_IN_ACTION_MARKDOWN).toContain("7. **Measure learning, not virtue.**");
    expect(articlePageSource).toContain('post.slug.current === "gratitude-in-action"');
    expect(articlePageSource).toContain("sm:[&_h3]:text-4xl");
    expect(articlePageSource).toContain("[&_ol]:rounded-2xl");
  });
});
