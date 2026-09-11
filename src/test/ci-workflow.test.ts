import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/pr-lint.yml"), "utf8");

describe("GitHub Actions quality workflow", () => {
  it("installs pnpm before requesting a pnpm dependency cache", () => {
    const pnpmSetupIndex = workflow.indexOf("uses: pnpm/action-setup@v4");
    const pnpmCacheIndex = workflow.indexOf("cache: pnpm");

    expect(pnpmSetupIndex).toBeGreaterThan(-1);
    expect(pnpmCacheIndex).toBeGreaterThan(-1);
    expect(pnpmSetupIndex).toBeLessThan(pnpmCacheIndex);
    expect(workflow).toContain("pnpm install --frozen-lockfile");
    expect(workflow).toContain("pnpm run quality");
  });
});
