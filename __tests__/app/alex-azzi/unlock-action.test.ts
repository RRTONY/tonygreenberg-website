import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookieJar } from "@tests/helpers/next";
import { unlockReport } from "@/app/alex-azzi/unlock-action";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("unlockReport", () => {
  beforeEach(() => {
    vi.stubEnv("GATED_POST_PASSWORD", "open-sesame");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns an error and sets no cookie for a wrong password", async () => {
    await expect(unlockReport({ error: false }, form({ key: "alex-azzi", password: "nope" }))).resolves.toEqual({ error: true });
    expect(cookieJar.size).toBe(0);
  });

  it("refuses a page key that isn't gated, even with the right password", async () => {
    await expect(unlockReport({ error: false }, form({ key: "about", password: "open-sesame" }))).resolves.toEqual({ error: true });
    expect(cookieJar.size).toBe(0);
  });

  it("returns an error when the form is empty", async () => {
    await expect(unlockReport({ error: false }, new FormData())).resolves.toEqual({ error: true });
  });

  it("remembers the unlock and reloads the report page for the right password", async () => {
    await expect(unlockReport({ error: false }, form({ key: "alex-azzi", password: "open-sesame" }))).rejects.toThrow(
      "NEXT_REDIRECT:/alex-azzi",
    );
    expect(cookieJar.get("tg_unlocked_alex-azzi")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("stays locked for everyone when no password is configured", async () => {
    vi.stubEnv("GATED_POST_PASSWORD", "");
    await expect(unlockReport({ error: false }, form({ key: "alex-azzi", password: "" }))).resolves.toEqual({ error: true });
  });
});
