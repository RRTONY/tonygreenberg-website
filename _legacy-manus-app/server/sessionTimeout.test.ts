import { describe, it, expect } from "vitest";
import { THIRTY_MIN_MS, ONE_YEAR_MS } from "@shared/const";

describe("Session timeout configuration", () => {
  it("THIRTY_MIN_MS should equal exactly 30 minutes in milliseconds", () => {
    expect(THIRTY_MIN_MS).toBe(1000 * 60 * 30);
    expect(THIRTY_MIN_MS).toBe(1_800_000);
  });

  it("THIRTY_MIN_MS should be much shorter than ONE_YEAR_MS", () => {
    expect(THIRTY_MIN_MS).toBeLessThan(ONE_YEAR_MS);
    expect(THIRTY_MIN_MS / ONE_YEAR_MS).toBeLessThan(0.001);
  });

  it("oauth.ts should use THIRTY_MIN_MS for session token", async () => {
    const fs = await import("fs");
    const oauthSource = fs.readFileSync("server/_core/oauth.ts", "utf-8");
    
    // Should import THIRTY_MIN_MS, not ONE_YEAR_MS
    expect(oauthSource).toContain("THIRTY_MIN_MS");
    expect(oauthSource).not.toContain("ONE_YEAR_MS");
    
    // Should use THIRTY_MIN_MS for both token creation and cookie maxAge
    expect(oauthSource).toContain("expiresInMs: THIRTY_MIN_MS");
    expect(oauthSource).toContain("maxAge: THIRTY_MIN_MS");
  });
});
