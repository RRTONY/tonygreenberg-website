import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LivingDeclarationPage, { metadata } from "@/app/living-declaration/page";

// A big page: give each render room on a busy machine.
vi.setConfig({ testTimeout: 45_000 });

// The shared next/font/google fake (a Proxy) doesn't report its named exports,
// so vitest refuses to import Fraunces etc. from it. Local fake for the faces
// src/lib/fonts/page-fonts.ts uses.
vi.mock("next/font/google", () => {
  const font = () => ({ className: "font-test", variable: "--font-test", style: { fontFamily: "test" } });
  return { Fraunces: font, Space_Grotesk: font, Cormorant_Garamond: font };
});

// The form posts through a server action; blueprint-form.test.tsx covers it.
vi.mock("@/app/forms/actions", () => ({ submitBlueprint: vi.fn() }));

describe("/living-declaration", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("A Living Declaration");
    expect(metadata.description).toMatch(/The Measurement of Becoming/);
    expect(metadata.alternates?.canonical).toBe("/living-declaration");
  });

  it("renders one H1 and the real premise", () => {
    const { container } = render(<LivingDeclarationPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Measurement of Becoming");
    expect(container).toHaveTextContent("This is a working declaration, not a new religion.");
    expect(container).toHaveTextContent("At a Humanity+ conference at Harvard in 2010, I shared a stage with Ray Kurzweil");
  });

  it("has its real sections", () => {
    render(<LivingDeclarationPage />);
    for (const h of ["The Talk That Started It All", "Not Commandments. Invitations.", "Are You a Conscious Satisficer?", "Tell Me Where I Have This Wrong", "Bring Your People Into the Room."]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
  });

  it("jumps to the blueprint form, which is on the page", () => {
    const { container } = render(<LivingDeclarationPage />);
    expect(screen.getByRole("link", { name: "Add Your Voice" })).toHaveAttribute("href", "#your-turn");
    const target = container.querySelector("#your-turn");
    expect(target?.querySelector("form")).not.toBeNull();
    expect(screen.getByRole("button", { name: /Submit My Blueprint/ })).toBeInTheDocument();
  });

  it("links to the essay that started it and the next steps", () => {
    render(<LivingDeclarationPage />);
    expect(screen.getByRole("link", { name: /Read the Original "Boiling the Human" Essay/ })).toHaveAttribute(
      "href",
      "/blog/boiling-the-human-summit-harvard-kurzweil",
    );
    expect(screen.getByRole("link", { name: "Take the Assessment" })).toHaveAttribute("href", "/assessment");
    expect(screen.getByRole("link", { name: "Enter the Community" })).toHaveAttribute("href", "/community");
    expect(screen.getByRole("link", { name: "All 11 Sites" })).toHaveAttribute("href", "/recent-creations");
  });
});
