import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";
import ClockKeeperPartTwoPage, { metadata, revalidate } from "@/app/clock-keeper-part-2/page";

describe("/clock-keeper-part-2", () => {
  it("has its own title, description and canonical, and refreshes every 10 minutes", () => {
    expect(metadata.title).toBe("The Clock Keeper Chronicles: Part II — Your Response");
    expect(metadata.description).toMatch(/A form for the offering/);
    expect(metadata.alternates?.canonical).toBe("/clock-keeper-part-2");
    expect(revalidate).toBe(600);
  });

  it("renders one H1, the real copy and the response form", async () => {
    const { container } = await renderServer(ClockKeeperPartTwoPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Part II: The Offering");
    expect(container).toHaveTextContent("The form doesn't matter. The trace does.");
    expect(container).toHaveTextContent("The container adapts to whatever shape the offering takes.");
    expect(container.querySelector("form")).not.toBeNull();
  });

  it("links to Part I, the form anchor and Human OS", async () => {
    await renderServer(ClockKeeperPartTwoPage());
    expect(screen.getByRole("link", { name: "Begin Your Response" })).toHaveAttribute("href", "#response");
    expect(screen.getByRole("link", { name: "Read Part I First" })).toHaveAttribute("href", "/blog/the-clock-keeper-chronicles-part-1");
    expect(screen.getByRole("link", { name: /Back to Part I/ })).toHaveAttribute("href", "/blog/the-clock-keeper-chronicles-part-1");
    expect(screen.getByRole("link", { name: /Human OS/ })).toHaveAttribute("href", "/humanos");
  });

  it("shows how many responses have come in", async () => {
    supabaseResult.count = 12;
    await renderServer(ClockKeeperPartTwoPage());
    expect(screen.getByText("12 responses received")).toBeInTheDocument();
    expect(fakeSupabase.from).toHaveBeenCalledWith("clock_keeper_responses");
  });

  it("uses the singular for one response", async () => {
    supabaseResult.count = 1;
    await renderServer(ClockKeeperPartTwoPage());
    expect(screen.getByText("1 response received")).toBeInTheDocument();
  });

  it("hides the count when there are none, the read fails, or the database isn't set up", async () => {
    supabaseResult.count = 5;
    supabaseResult.error = { message: "down" };
    const { container, unmount } = await renderServer(ClockKeeperPartTwoPage());
    expect(container).not.toHaveTextContent(/received/);
    unmount();
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    const second = await renderServer(ClockKeeperPartTwoPage());
    expect(second.container).not.toHaveTextContent(/received/);
  });
});
