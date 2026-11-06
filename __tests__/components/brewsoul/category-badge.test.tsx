import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BADGE_LINK_SUFFIX, CategoryBadge } from "@/components/brewsoul/category-badge";
import { navigation } from "../../helpers/next";
import { BREWSOUL_CATEGORIES } from "@/lib/content/brewsoul-directory";

describe("CategoryBadge", () => {
  it("names the category of the current page and says where the link goes", () => {
    const cat = BREWSOUL_CATEGORIES[0];
    navigation.pathname = cat.pages[0].path;
    render(<CategoryBadge />);
    const link = screen.getByRole("link", { name: `${cat.title}: ${BADGE_LINK_SUFFIX}` });
    expect(link).toHaveAttribute("href", "/brewsoul/directory");
    expect(link).toHaveTextContent(cat.title);
  });

  it("gives every category its own literal colour class", () => {
    for (const cat of BREWSOUL_CATEGORIES) {
      navigation.pathname = cat.pages[0].path;
      const { unmount } = render(<CategoryBadge />);
      expect(screen.getByRole("link").className).toMatch(/bg-\[#[0-9A-F]{6}\]/i);
      expect(screen.getByRole("link").className).not.toContain("bg-[#6F4E37]");
      unmount();
    }
  });

  it("renders nothing on a page that isn't in the directory", () => {
    navigation.pathname = "/brewsoul/not-a-page";
    const { container } = render(<CategoryBadge />);
    expect(container).toBeEmptyDOMElement();
  });
});
