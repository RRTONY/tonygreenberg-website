import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CAPITAL_PATHWAYS,
  DASHBOARD_STATUS,
  REX_LIGHT_CENTER,
  SAFEGUARD_MESSAGES,
  TARGET_SIGNALS,
  THIRTY_DAY_PLAN,
} from "@/lib/content/impact-dashboard";

const pageSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/impact-dashboard/page.tsx"),
  "utf8",
);
const explorerSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/marketing/impact-dashboard-explorer.tsx"),
  "utf8",
);

describe("Impact Dashboard target-model framing", () => {
  it("defines a clearly labeled 30-day target representation instead of operating results", () => {
    expect(DASHBOARD_STATUS.reviewHorizonDays).toBe(30);
    expect(DASHBOARD_STATUS.label).toContain("Target representation");
    expect(DASHBOARD_STATUS.disclosure).toContain("represents current capital deployed");
    expect(TARGET_SIGNALS.map((signal) => signal.value)).toContain("30 days");
    expect(THIRTY_DAY_PLAN).toHaveLength(4);
    expect(pageSource).toContain("not a live performance dashboard");
    expect(explorerSource).toContain("This is a target representation");
  });

  it("keeps the REX Light Center as a proposed and unaffiliated concept", () => {
    expect(REX_LIGHT_CENTER.status).toContain("Proposed");
    expect(REX_LIGHT_CENTER.artReference).toContain("not a James Turrell project");
    expect(REX_LIGHT_CENTER.sourceUrl).toBe("https://turrell.utexas.edu/");
    expect(SAFEGUARD_MESSAGES.join(" ")).toContain("no physical site");
  });

  it("makes regenerative capital primary and digital participation conditional", () => {
    expect(CAPITAL_PATHWAYS.map((pathway) => pathway.name)).toEqual(
      expect.arrayContaining([
        "Philanthropy and grants",
        "Mission-aligned partnerships",
        "Earned cultural revenue",
        "Long-term stewardship capital",
        "Digital participation, if useful",
      ]),
    );
    expect(CAPITAL_PATHWAYS.at(-1)?.guardrail).toContain("No token");
  });
});
