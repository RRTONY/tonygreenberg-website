import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigation } from "../../helpers/next";
import { HumanosNav } from "@/components/humanos/humanos-nav";
import { HUMANOS_NAV_ITEMS } from "@/lib/content/humanos-content";

describe("HumanosNav", () => {
  it("links the four sections, the manifesto and home, with a Sanity logo", () => {
    render(<HumanosNav />);
    for (const item of HUMANOS_NAV_ITEMS) expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    expect(screen.getByRole("link", { name: "Manifesto" })).toHaveAttribute("href", "/living-declaration");
    expect(screen.getByRole("link", { name: /Human OS/ })).toHaveAttribute("href", "/humanos");
    expect(document.querySelector("img")?.getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });

  it("highlights the current page", () => {
    navigation.pathname = "/humanos/resources";
    render(<HumanosNav />);
    expect(screen.getByRole("link", { name: "Resources" }).className).toContain("text-violet-400");
    expect(screen.getByRole("link", { name: "Philosophy" }).className).not.toContain("text-violet-400");
  });

  it("toggles the mobile menu and says whether it's open", async () => {
    render(<HumanosNav />);
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("navigation");
    expect(within(menu).getAllByRole("link")).toHaveLength(HUMANOS_NAV_ITEMS.length + 1);
    await userEvent.click(within(menu).getByRole("link", { name: "Connect" }));
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("closes the mobile menu when the page changes", async () => {
    const { rerender } = render(<HumanosNav />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    navigation.pathname = "/humanos/connect";
    rerender(<HumanosNav />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
