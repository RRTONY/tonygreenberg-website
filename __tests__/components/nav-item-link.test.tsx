import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavItemLink } from "@/components/nav-item-link";

describe("NavItemLink", () => {
  it("links to the href with the label", () => {
    render(<NavItemLink href="/blog" label="Read" active={false} />);
    expect(screen.getByRole("link", { name: "Read" })).toHaveAttribute("href", "/blog");
  });

  it("uses the gold colour when active and muted otherwise", () => {
    const { rerender } = render(<NavItemLink href="/blog" label="Read" active />);
    expect(screen.getByRole("link")).toHaveClass("text-brand-gold");
    rerender(<NavItemLink href="/blog" label="Read" active={false} />);
    expect(screen.getByRole("link")).toHaveClass("text-muted-foreground");
  });

  it("uses the smaller size when compact", () => {
    render(<NavItemLink href="/a" label="A" active={false} compact />);
    expect(screen.getByRole("link").className).toContain("text-[0.68rem]");
  });

  it("calls onNavigate on click", async () => {
    const onNavigate = vi.fn();
    render(<NavItemLink href="/a" label="A" active={false} onNavigate={onNavigate} />);
    await userEvent.setup().click(screen.getByRole("link"));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
