import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AkbarPage, { metadata } from "@/app/akbar/page";

// A big page: give each render room on a busy machine.
vi.setConfig({ testTimeout: 45_000 });

// The shared next/font/google fake (a Proxy) doesn't report its named exports,
// so vitest refuses to import Fraunces etc. from it. Local fake for the faces
// src/lib/fonts/page-fonts.ts uses.
vi.mock("next/font/google", () => {
  const font = () => ({ className: "font-test", variable: "--font-test", style: { fontFamily: "test" } });
  return { Fraunces: font, Space_Grotesk: font, Cormorant_Garamond: font };
});

describe("/akbar", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget");
    expect(metadata.description).toMatch(/cultural memory, food, and what it means to preserve identity/);
    expect(metadata.alternates?.canonical).toBe("/akbar");
  });

  it("renders one H1 and the real opening", () => {
    const { container } = render(<AkbarPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget");
    expect(container).toHaveTextContent("It does not want your content. It wants your nervous system.");
    expect(container).toHaveTextContent("Tony Greenberg · May 2026 · 7 min read");
  });

  it("tells the essay in its real sections", () => {
    const { container } = render(<AkbarPage />);
    for (const h of ["The Nervous System", "3.8 Stars and the Death of Memory", "The Night the eBay Deal Almost Killed Us", "The Liquid Treasure Chest", "What Akbar Could Become", "The Question That Remains"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(container).toHaveTextContent("Human memory. Not database memory.");
  });

  it("gives every image an alt attribute", () => {
    const { container } = render(<AkbarPage />);
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) expect(img.hasAttribute("alt")).toBe(true);
  });

  it("links to related food essays and back to the essays", () => {
    render(<AkbarPage />);
    expect(screen.getByRole("link", { name: /Origen Restaurant/ })).toHaveAttribute("href", "/blog/origen-restaurant");
    expect(screen.getByRole("link", { name: /Wine, Sake, Spirits & Mezcal/ })).toHaveAttribute("href", "/spirits");
    expect(screen.getByRole("link", { name: /Back to the Essays/ })).toHaveAttribute("href", "/");
  });
});
