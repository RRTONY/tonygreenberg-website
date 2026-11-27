import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AqueousNav } from "@/components/aqueous/aqueous-nav";
import { navigation } from "@tests/helpers/next";

const more = () => screen.getByRole("button", { name: /More/ });
const menuToggle = () => screen.getByRole("button", { name: "Toggle menu" });

describe("AqueousNav", () => {
  it("links the logo and the 8 main links under /aqueous, marking the current page", () => {
    navigation.pathname = "/aqueous/explore";
    render(<AqueousNav />);
    expect(screen.getByRole("link", { name: "Aqueous" })).toHaveAttribute("href", "/aqueous");
    const explorer = screen.getByRole("link", { name: "Explorer" });
    expect(explorer).toHaveAttribute("href", "/aqueous/explore");
    expect(explorer).toHaveAttribute("aria-current", "page");
    expect(explorer).toHaveClass("text-primary");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/aqueous");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Wall of Shame" })).toHaveAttribute("href", "/aqueous/wall-of-shame");
    // More is closed, and not highlighted on a main page.
    expect(more()).toHaveAttribute("aria-expanded", "false");
    expect(more()).toHaveClass("text-muted-foreground");
    expect(screen.queryByRole("link", { name: "Pricing" })).not.toBeInTheDocument();
  });

  it("opens More on hover and closes it when the pointer leaves", async () => {
    render(<AqueousNav />);
    const wrapper = more().parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(more()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/aqueous/pricing");
    expect(screen.getByRole("link", { name: "My Dashboard" })).toHaveAttribute("href", "/aqueous/dashboard");
    fireEvent.mouseLeave(wrapper);
    expect(more()).toHaveAttribute("aria-expanded", "false");
  });

  it("opens More on keyboard focus, keeps it open while focus is inside, and closes on Escape or leaving", async () => {
    render(<AqueousNav />);
    act(() => more().focus());
    expect(more()).toHaveAttribute("aria-expanded", "true");
    const pricing = screen.getByRole("link", { name: "Pricing" });
    fireEvent.blur(more(), { relatedTarget: pricing });
    expect(more()).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(pricing, { key: "Enter" });
    expect(more()).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(pricing, { key: "Escape" });
    expect(more()).toHaveAttribute("aria-expanded", "false");

    fireEvent.focus(more());
    expect(more()).toHaveAttribute("aria-expanded", "true");
    fireEvent.blur(more(), { relatedTarget: menuToggle() });
    expect(more()).toHaveAttribute("aria-expanded", "false");
  });

  it("opens More on click, and a second click keeps it open", () => {
    render(<AqueousNav />);
    fireEvent.click(more());
    expect(more()).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(more());
    expect(more()).toHaveAttribute("aria-expanded", "true");
  });

  it("highlights More and the current page inside it", () => {
    navigation.pathname = "/aqueous/pricing";
    render(<AqueousNav />);
    expect(more()).toHaveClass("text-primary");
    fireEvent.click(more());
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveClass("bg-primary/5");
    expect(screen.getByRole("link", { name: "Filter Guide" })).not.toHaveAttribute("aria-current");
  });

  it("opens the mobile menu with every link and closes it when one is tapped", async () => {
    navigation.pathname = "/aqueous/about";
    const { container } = render(<AqueousNav />);
    expect(menuToggle()).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(menuToggle());
    expect(menuToggle()).toHaveAttribute("aria-expanded", "true");
    const mobile = container.querySelector("nav > div.lg\\:hidden") as HTMLElement;
    const links = within(mobile).getAllByRole("link");
    expect(links).toHaveLength(17);
    for (const l of links) expect(l.getAttribute("href")).toMatch(/^\/aqueous/);
    expect(within(mobile).getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    expect(within(mobile).getByRole("link", { name: "About" })).toHaveClass("bg-primary/10");

    await userEvent.click(within(mobile).getByRole("link", { name: "Compare" }));
    expect(menuToggle()).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("nav > div.lg\\:hidden")).toBeNull();

    await userEvent.click(menuToggle());
    await userEvent.click(menuToggle());
    expect(menuToggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes both menus on a new page", async () => {
    navigation.pathname = "/aqueous";
    const { rerender } = render(<AqueousNav />);
    await userEvent.click(menuToggle());
    fireEvent.click(more());
    expect(menuToggle()).toHaveAttribute("aria-expanded", "true");
    expect(more()).toHaveAttribute("aria-expanded", "true");

    navigation.pathname = "/aqueous/awi";
    rerender(<AqueousNav />);
    expect(menuToggle()).toHaveAttribute("aria-expanded", "false");
    expect(more()).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("link", { name: "AWI Index" })[0]).toHaveAttribute("aria-current", "page");
  });

  it("stays open when a pointer user hovers then clicks More, and closes on leave, Escape or focus leaving", async () => {
    render(<AqueousNav />);
    const wrapper = more().parentElement!;
    await userEvent.click(more());
    expect(more()).toHaveAttribute("aria-expanded", "true");
    await userEvent.unhover(wrapper);
    expect(more()).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(more());
    expect(more()).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(more()).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(more());
    expect(more()).toHaveAttribute("aria-expanded", "true");
    fireEvent.blur(more(), { relatedTarget: menuToggle() });
    expect(more()).toHaveAttribute("aria-expanded", "false");
  });
});
