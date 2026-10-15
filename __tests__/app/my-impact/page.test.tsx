import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import MyImpactPage, { metadata } from "@/app/my-impact/page";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { getOrCreateReferralCode } from "@/lib/referrals";
import { headerJar } from "@tests/helpers/next";

vi.mock("@/lib/referrals", () => ({ getOrCreateReferralCode: vi.fn() }));
const signIn = () => fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null } as never);

describe("/my-impact", () => {
  it("is a private, noindex page", () => {
    expect(metadata.title).toBe("Your Impact");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/my-impact");
  });

  it("asks a signed-out visitor to sign in, showing no data", async () => {
    await renderServer(MyImpactPage());
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login?next=/my-impact");
    expect(getOrCreateReferralCode).not.toHaveBeenCalled();
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("shows the member's invite link on this site", async () => {
    signIn();
    headerJar.set("host", "tonygreenberg.com");
    vi.mocked(getOrCreateReferralCode).mockResolvedValue("abc123");
    supabaseResult.data = [];
    await renderServer(MyImpactPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Who Came Through Your Door");
    expect(screen.getByText("https://tonygreenberg.com/signup?ref=abc123")).toBeInTheDocument();
    expect(getOrCreateReferralCode).toHaveBeenCalledWith("u1");
    expect(screen.queryByText("Your Referrals")).not.toBeInTheDocument();
  });

  it("lists referrals with their depth (saved passages)", async () => {
    signIn();
    vi.mocked(getOrCreateReferralCode).mockResolvedValue("abc");
    // One shared fake result: rows double as referrals and highlights.
    supabaseResult.data = [
      { referred_user_id: "r1", user_id: "r1", created_at: "2026-01-01" },
      { referred_user_id: "r2", user_id: "r1", created_at: "2026-01-02" },
    ];
    await renderServer(MyImpactPage());
    expect(screen.getByText("People Referred").previousSibling).toHaveTextContent("2");
    expect(screen.getByText("Depth Score").previousSibling).toHaveTextContent("2");
    expect(screen.getByText("Avg Depth").previousSibling).toHaveTextContent("1");
    expect(screen.getByText("Member 1").nextSibling).toHaveTextContent("Depth: 2");
    expect(screen.getByText("Member 2").nextSibling).toHaveTextContent("Depth: 0");
  });
});
