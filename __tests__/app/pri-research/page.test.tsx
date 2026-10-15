import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import PriResearchPage, { metadata } from "@/app/pri-research/page";
import { fakeSupabase } from "@tests/helpers/supabase";
import { getPriResearch } from "@/lib/pri-research";

vi.mock("@/lib/pri-research", () => ({ getPriResearch: vi.fn() }));
const asUser = (email: string) => fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u", email } }, error: null } as never);

beforeEach(() => {

  vi.stubEnv("ADMIN_EMAILS", "boss@example.com");

});
afterEach(() => {
  vi.unstubAllEnvs();
});
describe("/pri-research", () => {
  it("is noindex", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/pri-research");
  });

  it("shows Access Denied with a sign-in link to a signed-out visitor, and no data", async () => {
    await renderServer(PriResearchPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Access Denied");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login?next=/pri-research");
    expect(getPriResearch).not.toHaveBeenCalled();
  });

  it("shows Access Denied without a sign-in link to a non-admin", async () => {
    asUser("someone@example.com");
    await renderServer(PriResearchPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Access Denied");
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
    expect(getPriResearch).not.toHaveBeenCalled();
  });

  it("shows an admin the totals, opt-in rate, rows and CSV export", async () => {
    asUser("boss@example.com");
    vi.mocked(getPriResearch).mockResolvedValue({
      total: 4,
      optIn: 1,
      rows: [{ id: 9, created_at: "2026-10-01T00:00:00Z", rankings: ["a", "b"], dim_scores: { x: 3 }, pairwise_choices: [1, 2] }],
    });
    await renderServer(PriResearchPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("PRI Research Data");
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("#9")).toBeInTheDocument();
    expect(screen.getByText("a > b")).toBeInTheDocument();
    expect(screen.getByText("2 pairs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /export csv/i })).toHaveAttribute("href", "/pri-research/export");
  });

  it("shows the empty state and a dash for the rate when there's no data", async () => {
    asUser("boss@example.com");
    vi.mocked(getPriResearch).mockResolvedValue({ total: 0, optIn: 0, rows: [] });
    await renderServer(PriResearchPage());
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText(/No research opt-in data available yet/)).toBeInTheDocument();
  });
});
