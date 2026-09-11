import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("safe public parity closure matrix", () => {
  it("documents every safe candidate and every restored-route validation boundary", () => {
    const audit = fs.readFileSync(
      path.join(process.cwd(), "docs/live-site-full-parity-audit.md"),
      "utf8",
    );

    expect(audit).toContain("## Safe Public Parity Closure Table");
    expect(audit).toContain("## Restored Route Validation Matrix");

    for (const candidate of [
      "/medicine-sequencing",
      "/ecosystem-map",
      "/skippy",
      "/subscribe",
      "/clock-keeper-part-2",
      "/fauxtony",
      "/shop",
      "/supplier-intake",
      "/cheshire-grin",
    ]) {
      expect(audit).toContain(candidate);
    }

    for (const route of [
      "/humanos",
      "/facilitator-index",
      "/attention-theft",
      "/about",
      "/the-letter",
      "/the-body",
      "/the-nightstand",
      "/the-web",
      "/walk-through",
    ]) {
      expect(audit).toContain(route);
    }
  });
});
