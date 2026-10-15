import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { cookieJar, headerJar } from "@tests/helpers/next";
import { gatedPath, hasUnlocked, isGatedPage, isGatedPost, passwordMatches, rememberUnlock } from "@/lib/gated-posts";

const token = (slug: string, pw: string) => createHash("sha256").update(`${slug}:${pw}`).digest("hex");

describe("gated post lookups", () => {
  it("knows which posts and pages are gated", () => {
    expect(isGatedPost("you-are-the-moat")).toBe(true);
    expect(isGatedPost("five-cups")).toBe(false);
    expect(isGatedPage("alex-azzi")).toBe(true);
    expect(isGatedPage("you-are-the-moat")).toBe(false);
  });

  it("gatedPath maps pages to their path and posts to /blog/<slug>", () => {
    expect(gatedPath("alex-azzi")).toBe("/alex-azzi");
    expect(gatedPath("you-are-the-moat")).toBe("/blog/you-are-the-moat");
  });
});

describe("password and unlock cookie", () => {
  beforeEach(() => {
    vi.stubEnv("GATED_POST_PASSWORD", "open-sesame");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("passwordMatches only the exact password", () => {
    expect(passwordMatches("open-sesame")).toBe(true);
    expect(passwordMatches("Open-sesame")).toBe(false);
    expect(passwordMatches("")).toBe(false);
  });

  it("stays locked for everyone when no password is set", async () => {
    vi.stubEnv("GATED_POST_PASSWORD", "");
    expect(passwordMatches("")).toBe(false);
    expect(passwordMatches("anything")).toBe(false);
    cookieJar.set("tg_unlocked_you-are-the-moat", token("you-are-the-moat", ""));
    await expect(hasUnlocked("you-are-the-moat")).resolves.toBe(false);
    await rememberUnlock("you-are-the-moat");
    expect((await cookies()).set).not.toHaveBeenCalled();
  });

  it("hasUnlocked accepts only the hash of slug + current password", async () => {
    await expect(hasUnlocked("you-are-the-moat")).resolves.toBe(false);
    cookieJar.set("tg_unlocked_you-are-the-moat", "forged");
    await expect(hasUnlocked("you-are-the-moat")).resolves.toBe(false);
    cookieJar.set("tg_unlocked_you-are-the-moat", token("alex-azzi", "open-sesame"));
    await expect(hasUnlocked("you-are-the-moat")).resolves.toBe(false);
    cookieJar.set("tg_unlocked_you-are-the-moat", token("you-are-the-moat", "open-sesame"));
    await expect(hasUnlocked("you-are-the-moat")).resolves.toBe(true);
  });

  it("a password change locks old cookies out", async () => {
    cookieJar.set("tg_unlocked_you-are-the-moat", token("you-are-the-moat", "open-sesame"));
    vi.stubEnv("GATED_POST_PASSWORD", "new-password");
    await expect(hasUnlocked("you-are-the-moat")).resolves.toBe(false);
  });

  it("rememberUnlock sets an httpOnly cookie scoped to the gated path", async () => {
    headerJar.set("x-forwarded-proto", "https");
    await rememberUnlock("alex-azzi");
    expect((await cookies()).set).toHaveBeenCalledWith("tg_unlocked_alex-azzi", token("alex-azzi", "open-sesame"), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/alex-azzi",
      maxAge: 2592000,
    });
  });

  it("rememberUnlock isn't Secure over plain http", async () => {
    await rememberUnlock("you-are-the-moat");
    expect((await cookies()).set).toHaveBeenCalledWith(
      "tg_unlocked_you-are-the-moat",
      expect.any(String),
      expect.objectContaining({ secure: false, path: "/blog/you-are-the-moat" }),
    );
  });
});
