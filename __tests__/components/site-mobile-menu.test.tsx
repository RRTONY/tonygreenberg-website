import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@/components/site-mobile-menu";
import { findYourMeGroups, navCategories, primaryNavLinks } from "@/components/site-nav-data";

function setup(pathname = "/") {
  const onOpenChange = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  render(<MobileMenu open onOpenChange={onOpenChange} pathname={pathname} returnFocusTo={ref} />);
  return { onOpenChange, user: userEvent.setup() };
}

describe("MobileMenu", () => {
  it("shows the primary links with their real hrefs", () => {
    setup();
    const dialog = screen.getByRole("dialog");
    for (const l of primaryNavLinks) {
      expect(within(dialog).getAllByRole("link", { name: l.label })[0]).toHaveAttribute("href", l.href);
    }
  });

  it("has an accordion section for Fix Myself and every category", () => {
    setup();
    expect(screen.getByRole("button", { name: "Fix Myself" })).toBeInTheDocument();
    for (const c of navCategories) expect(screen.getByRole("button", { name: c.title })).toBeInTheDocument();
  });

  it("opens a category to reveal its links", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Fix Myself" }));
    const first = findYourMeGroups[0].items[0];
    expect(screen.getAllByRole("link", { name: first.label }).some((a) => a.getAttribute("href") === first.href)).toBe(true);
    expect(screen.getByText(findYourMeGroups[0].category)).toBeInTheDocument();
  });

  it("closes when a link is clicked and when Escape is pressed", async () => {
    const { user, onOpenChange } = setup();
    await user.click(screen.getAllByRole("link", { name: "Read" })[0]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("highlights the link for the current page", () => {
    setup("/blog");
    expect(screen.getAllByRole("link", { name: "Read" })[0]).toHaveClass("text-brand-gold");
    expect(screen.getAllByRole("link", { name: "Build With Me" })[0]).toHaveClass("text-muted-foreground");
  });
});
