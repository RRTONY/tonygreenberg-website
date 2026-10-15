import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "@/components/site-header";
import { primaryNavLinks, socialLinks } from "@/components/site-nav-data";
import { navigation } from "@tests/helpers/next";

describe("SiteHeader", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ posts: [] }))));
  });
  it("links home and to every primary nav link", () => {
    render(<SiteHeader essayCount={10} />);
    expect(screen.getAllByRole("link").some((a) => a.getAttribute("href") === "/")).toBe(true);
    for (const l of primaryNavLinks.filter((p) => p.href !== "/find-my")) {
      expect(screen.getByRole("link", { name: l.label })).toHaveAttribute("href", l.href);
    }
    expect(screen.getByRole("button", { name: "Fix Myself" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explore" })).toBeInTheDocument();
  });

  it("social links open in a new tab with safe rel", () => {
    render(<SiteHeader essayCount={10} />);
    for (const s of socialLinks) {
      const a = screen.getByRole("link", { name: `Tony Greenberg on ${s.label}` });
      expect(a).toHaveAttribute("href", s.href);
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
    }
  });

  it("marks the current page's link as active", () => {
    navigation.pathname = "/blog";
    render(<SiteHeader essayCount={10} />);
    expect(screen.getByRole("link", { name: "Read" })).toHaveClass("text-brand-gold");
    expect(screen.getByRole("link", { name: "Build With Me" })).not.toHaveClass("text-brand-gold");
  });

  it("the menu button opens the phone menu and Escape closes it, returning focus", async () => {
    const user = userEvent.setup();
    render(<SiteHeader essayCount={10} />);
    const btn = screen.getByRole("button", { name: "Open menu" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await user.click(btn);
    expect(await screen.findByRole("dialog", {}, { timeout: 5000 })).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(btn).toHaveFocus());
  });

  it("closes the phone menu when the route changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SiteHeader essayCount={10} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog", {}, { timeout: 5000 });
    navigation.pathname = "/blog";
    rerender(<SiteHeader essayCount={10} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("the search button and Cmd/Ctrl+K open the search window", async () => {
    const user = userEvent.setup();
    render(<SiteHeader essayCount={10} />);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByPlaceholderText(/search everything/i, {}, { timeout: 5000 })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByPlaceholderText(/search everything/i)).not.toBeInTheDocument());
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByPlaceholderText(/search everything/i, {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it("Ask Tony opens the search window", async () => {
    render(<SiteHeader essayCount={10} />);
    await userEvent.setup().click(screen.getByRole("button", { name: /ask tony/i }));
    expect(await screen.findByRole("dialog", {}, { timeout: 5000 })).toBeInTheDocument();
  });
});
