import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ElixirCollection } from "@/components/blog/elixir-collection";

describe("ElixirCollection", () => {
  it("shows both products linking out to the maker in a new tab", () => {
    render(<ElixirCollection />);
    expect(screen.getByRole("heading", { level: 2, name: "The Elixir of Life Collection" })).toBeInTheDocument();
    const pendant = screen.getByRole("link", { name: /golden rudraksha pendant/i });
    expect(pendant).toHaveAttribute("href", "https://www.elixiroflife.fr/en/product-page/golden-rudraksha");
    expect(pendant).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("heading", { name: "Alchemy Meditation Therapy Set" })).toBeInTheDocument();
  });

  it("every image has alt text and is hosted in Sanity, never Manus", () => {
    render(<ElixirCollection />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(4);
    for (const img of imgs) {
      expect(img.getAttribute("alt")).toBeTruthy();
      expect(img.getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    }
  });

  it("offers a pre-filled order email to Tony", () => {
    render(<ElixirCollection />);
    const mail = screen.getByRole("link", { name: /contact tony for special pricing/i }).getAttribute("href")!;
    expect(mail.startsWith("mailto:tony@tonygreenberg.com")).toBe(true);
    expect(decodeURIComponent(mail)).toContain("Bulk Order Inquiry");
  });
});
