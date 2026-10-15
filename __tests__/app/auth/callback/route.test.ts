// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/auth/callback/route";
import { fakeSupabase } from "@tests/helpers/supabase";
import { recordReferral } from "@/lib/referrals";

vi.mock("@/lib/referrals", () => ({ recordReferral: vi.fn() }));

const call = (qs: string) => GET(new NextRequest(`https://tonygreenberg.com/auth/callback?${qs}`));

describe("GET /auth/callback", () => {
  it("swaps the code for a session and continues to the safe next page", async () => {
    fakeSupabase.auth.exchangeCodeForSession.mockResolvedValue({ data: { user: { id: "u1", user_metadata: {} } }, error: null } as never);
    const res = await call("code=abc&next=/reset-password");
    expect(fakeSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith("abc");
    expect(res.headers.get("location")).toBe("https://tonygreenberg.com/reset-password");
    expect(recordReferral).not.toHaveBeenCalled();
  });

  it("records the invite when the member signed up through one", async () => {
    fakeSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { user: { id: "u1", user_metadata: { referral_code: "friend42" } } },
      error: null,
    } as never);
    await call("code=abc");
    expect(recordReferral).toHaveBeenCalledWith("u1", "friend42");
  });

  it("never sends the member off-site", async () => {
    fakeSupabase.auth.exchangeCodeForSession.mockResolvedValue({ data: { user: null }, error: null } as never);
    const res = await call("code=abc&next=//evil.com");
    expect(res.headers.get("location")).toBe("https://tonygreenberg.com/my-highlights");
  });

  it("sends a missing or used code to sign-in with an explanation", async () => {
    expect((await call("")).headers.get("location")).toBe("https://tonygreenberg.com/login?error=link");
    fakeSupabase.auth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: { message: "expired" } } as never);
    expect((await call("code=old")).headers.get("location")).toBe("https://tonygreenberg.com/login?error=link");
  });
});
