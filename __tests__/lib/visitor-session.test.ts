import { describe, expect, it } from "vitest";
import { cookieJar } from "@tests/helpers/next";
import { cookies } from "next/headers";
import { visitorSessionId } from "@/lib/visitor-session";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("visitorSessionId", () => {
  it("returns the existing valid session id without setting a cookie", async () => {
    cookieJar.set("tg_sid", UUID);
    await expect(visitorSessionId(true)).resolves.toBe(UUID);
    expect((await cookies()).set).not.toHaveBeenCalled();
  });

  it("returns null when there is none and create is false", async () => {
    await expect(visitorSessionId(false)).resolves.toBeNull();
  });

  it("creates a new httpOnly cookie when asked", async () => {
    const id = await visitorSessionId(true);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect((await cookies()).set).toHaveBeenCalledWith(
      "tg_sid",
      id,
      expect.objectContaining({ httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 31536000 }),
    );
  });

  it("replaces a tampered cookie value instead of trusting it", async () => {
    cookieJar.set("tg_sid", "<script>");
    await expect(visitorSessionId(false)).resolves.toBeNull();
    const id = await visitorSessionId(true);
    expect(id).not.toBe("<script>");
  });
});
