import { describe, expect, it } from "vitest";
import { BLOOD_DNA_REVISED_CONTENT } from "../client/src/data/bloodDnaContent";
import { renderBlogPostHTML } from "./ssr-blog-batch";

describe("blood and DNA article rewrite", () => {
  it("uses one essay structure with a separate operating memo and receipts section", () => {
    expect(BLOOD_DNA_REVISED_CONTENT).toContain("## Blood Is a Signal. DNA Is Context.");
    expect(BLOOD_DNA_REVISED_CONTENT).toContain("## What Quest Could Fix in 18 Months");
    expect(BLOOD_DNA_REVISED_CONTENT).toContain("## For the Record: The Receipts");
    expect(BLOOD_DNA_REVISED_CONTENT).not.toContain("The Scoreboard Nobody Hangs in the Lobby");
  });

  it("provides direct reader paths for every core provider and public source category", () => {
    [
      "https://www.functionhealth.com/",
      "https://www.bodyspec.com/",
      "https://www.dexafit.com/",
      "https://dutchtest.com/",
      "https://omegaquant.com/",
      "https://www.nekohealth.com/",
      "https://www.trustpilot.com/review/www.questdiagnostics.com",
      "https://oag.ca.gov/news/press-releases/attorney-general-bonta-announces-nearly-5-million-settlement-quest-diagnostics",
      "https://pubmed.ncbi.nlm.nih.gov/33367884/",
      "https://www.cdc.gov/folic-acid/hcp/clinical-overview/index.html",
    ].forEach((url) => expect(BLOOD_DNA_REVISED_CONTENT).toContain(url));
  });

  it("frames DNA as supplement-decision context rather than a universal dosing command", () => {
    expect(BLOOD_DNA_REVISED_CONTENT).toContain("## Your Supplement Stack Is a Hypothesis, Not a Subscription");
    expect(BLOOD_DNA_REVISED_CONTENT).toContain("DNA is context, not a command.");
    expect(BLOOD_DNA_REVISED_CONTENT).toContain("costly guesswork on the table");
  });

  it("preserves the asterisked referral disclosure in crawler-visible output", () => {
    const html = renderBlogPostHTML("your-blood-lies-without-your-dna");

    expect(html).toContain("I get a referral credit.*");
    expect(html).toContain("All proceeds I receive from this referral code are donated to my foundation.");
    expect(html).toContain("For the Record: The Receipts");
    expect(html.match(/<h1\b/gi) || []).toHaveLength(1);
  });
});
