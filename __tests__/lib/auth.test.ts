import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "@tests/helpers/supabase";
import { headerJar } from "@tests/helpers/next";
import { getUser, isAdmin, requestOrigin, requireUser, safeNext } from "@/lib/auth";

afterEach(() => {

  vi.unstubAllEnvs();

});
describe("getUser / requireUser", () => {
  it("returns null when Supabase isn't configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    await expect(getUser()).resolves.toBeNull();
    expect(fakeSupabase.auth.getUser).not.toHaveBeenCalled();
  });

  it("returns the signed-in user", async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null } as never);
    await expect(getUser()).resolves.toEqual({ id: "u1" });
    await expect(requireUser("/x")).resolves.toEqual({ id: "u1" });
  });

  it("redirects a signed-out visitor to /login with the return path", async () => {
    await expect(requireUser("/my-impact?tab=1")).rejects.toThrow("NEXT_REDIRECT:/login?next=%2Fmy-impact%3Ftab%3D1");
  });
});

describe("isAdmin", () => {
  it("matches ADMIN_EMAILS case-insensitively, trimming spaces", () => {
    vi.stubEnv("ADMIN_EMAILS", " Tony@Example.com , kim@example.com,");
    expect(isAdmin("tony@example.com")).toBe(true);
    expect(isAdmin("KIM@example.com")).toBe(true);
    expect(isAdmin("someone@example.com")).toBe(false);
  });

  it("refuses empty emails and an unset list", () => {
    vi.stubEnv("ADMIN_EMAILS", "");
    expect(isAdmin("tony@example.com")).toBe(false);
    expect(isAdmin("")).toBe(false);
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});

describe("safeNext", () => {
  it("allows same-site paths", () => {
    expect(safeNext("/blog/x?y=1")).toBe("/blog/x?y=1");
  });

  it("falls back for absolute URLs, protocol-relative URLs and non-strings", () => {
    expect(safeNext("https://evil.com")).toBe("/my-highlights");
    expect(safeNext("//evil.com")).toBe("/my-highlights");
    expect(safeNext(42)).toBe("/my-highlights");
    expect(safeNext(undefined, "/home")).toBe("/home");
  });

  it.fails("BUG: allows '/\\evil.com', which browsers treat as //evil.com (open redirect)", () => {
    expect(safeNext("/\\evil.com")).toBe("/my-highlights");
  });
});

describe("requestOrigin", () => {
  it("prefers the forwarded host and protocol", async () => {
    headerJar.set("x-forwarded-host", "deploy-preview-3--site.netlify.app");
    headerJar.set("x-forwarded-proto", "https");
    headerJar.set("host", "internal");
    await expect(requestOrigin()).resolves.toBe("https://deploy-preview-3--site.netlify.app");
  });

  it("uses host with https by default, else the site URL", async () => {
    headerJar.set("host", "localhost:3000");
    await expect(requestOrigin()).resolves.toBe("https://localhost:3000");
    headerJar.clear();
    await expect(requestOrigin()).resolves.toBe("https://tonygreenberg.com");
  });
});
