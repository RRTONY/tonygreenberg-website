import { describe, expect, it } from "vitest";
import { CONNECTION_ERROR, reach } from "@/lib/content/soulsmoke/reach";

describe("reach", () => {
  it("passes a server answer through unchanged, success or failure", async () => {
    await expect(reach(Promise.resolve({ ok: true as const, data: [1, 2] }))).resolves.toEqual({ ok: true, data: [1, 2] });
    const signedOut = { ok: false as const, error: "Please sign in first.", signedOut: true };
    await expect(reach(Promise.resolve(signedOut))).resolves.toBe(signedOut);
  });

  it("turns a request that never reached the server into a plain error result", async () => {
    await expect(reach(Promise.reject(new TypeError("Failed to fetch")))).resolves.toEqual({ ok: false, error: CONNECTION_ERROR });
    expect(CONNECTION_ERROR).toMatch(/Couldn't reach the server/);
  });
});
