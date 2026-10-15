import { afterEach, describe, expect, it, vi } from "vitest";
import { unlockPost } from "@/app/blog/[slug]/unlock-action";
import { cookieJar } from "@tests/helpers/next";

const form = (slug: string, password: string) => {
  const fd = new FormData();
  fd.set("slug", slug);
  fd.set("password", password);
  return fd;
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("unlockPost", () => {
  it("refuses a wrong password and sets no cookie", async () => {
    vi.stubEnv("GATED_POST_PASSWORD", "open-sesame");
    await expect(unlockPost({ error: false }, form("you-are-the-moat", "guess"))).resolves.toEqual({ error: true });
    expect(cookieJar.size).toBe(0);
  });

  it("refuses a post that isn't password-protected", async () => {
    vi.stubEnv("GATED_POST_PASSWORD", "open-sesame");
    await expect(unlockPost({ error: false }, form("five-cups", "open-sesame"))).resolves.toEqual({ error: true });
  });

  it("stays locked for everyone when no password is configured", async () => {
    vi.stubEnv("GATED_POST_PASSWORD", "");
    await expect(unlockPost({ error: false }, form("you-are-the-moat", ""))).resolves.toEqual({ error: true });
  });

  it("remembers the unlock and reloads the essay on the right password", async () => {
    vi.stubEnv("GATED_POST_PASSWORD", "open-sesame");
    await expect(unlockPost({ error: false }, form("you-are-the-moat", "open-sesame"))).rejects.toThrow(
      "NEXT_REDIRECT:/blog/you-are-the-moat",
    );
    expect(cookieJar.get("tg_unlocked_you-are-the-moat")).toMatch(/^[0-9a-f]{64}$/);
  });
});
