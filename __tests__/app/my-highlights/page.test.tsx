import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import MyHighlightsPage, { metadata } from "@/app/my-highlights/page";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { sanityFetch } from "@/lib/sanity/client";

const signIn = () => fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null } as never);

describe("/my-highlights", () => {
  it("is a private, noindex page", () => {
    expect(metadata.title).toBe("Your Commonplace Book");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/my-highlights");
  });

  it("asks a signed-out visitor to sign in (and comes back here), showing no data", async () => {
    await renderServer(MyHighlightsPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your Commonplace Book");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login?next=/my-highlights");
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("shows the empty state for a member with nothing saved", async () => {
    signIn();
    supabaseResult.data = [];
    await renderServer(MyHighlightsPage());
    expect(screen.getByText("0 passages saved from 0 essays")).toBeInTheDocument();
    expect(screen.getByText(/No highlights yet/)).toBeInTheDocument();
    expect(sanityFetch).not.toHaveBeenCalled();
  });

  it("groups passages by essay with the real titles and a remove button each", async () => {
    signIn();
    supabaseResult.data = [
      { id: 1, post_slug: "five-cups", text: "First passage", created_at: "2026-10-02" },
      { id: 2, post_slug: "five-cups", text: "Second passage", created_at: "2026-10-01" },
      { id: 3, post_slug: "no-title-yet", text: "Third passage", created_at: "2026-09-01" },
    ];
    vi.mocked(sanityFetch).mockResolvedValue([{ slug: "five-cups", title: "Five Cups of Trust" }] as never);
    await renderServer(MyHighlightsPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("3 passages saved from 2 essays")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Five Cups of Trust" })).toHaveAttribute("href", expect.stringContaining("five-cups"));
    expect(screen.getByRole("link", { name: "no title yet" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Remove highlight" })).toHaveLength(3);
  });
});
