import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cocktails } from "@/components/soulsmoke/pages/cocktails";

describe("Cocktails", () => {
  it("lists all twelve cocktails with their recipes in the HTML but hidden until opened", async () => {
    render(<Cocktails />);
    expect(screen.getByRole("heading", { level: 1, name: "The Cocktail Codex" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(13); // 12 cocktails + The Philosophy
    const story = screen.getByText(/Created by Phil Ward at Death & Co/);
    expect(story.closest("[hidden]")).not.toBeNull();
    const header = screen.getByRole("button", { name: /Oaxaca Old Fashioned/ });
    expect(header).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(story.closest("[hidden]")).toBeNull();
    expect(header.parentElement).toHaveClass("md:col-span-2");
    await userEvent.click(header);
    expect(story.closest("[hidden]")).not.toBeNull();
  });

  it("filters by category", async () => {
    render(<Cocktails />);
    await userEvent.click(screen.getByRole("button", { name: "Refreshing" }));
    expect(screen.getByRole("button", { name: "Refreshing" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Paloma Negra/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /El Diablo Verde/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mezcal Negroni/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByRole("button", { name: /Mezcal Negroni/ })).toBeInTheDocument();
  });
});
