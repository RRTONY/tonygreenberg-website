import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TheStackPage, { metadata } from "@/app/the-stack/page";
import { STACK_CATEGORIES } from "@/lib/content/the-stack";

// The shared next/font/google fake is a Proxy with no `has` trap, so vitest
// reports named imports (Fraunces, ...) as missing. Stub the page-fonts module.
vi.mock("@/lib/fonts/page-fonts", () => ({ pageFontVariables: "page-fonts" }));

const SUPPLIERS = STACK_CATEGORIES.flatMap((c) => c.suppliers);

describe("/the-stack", () => {
  it("is a private review draft: own title, canonical, and kept out of search", () => {
    expect(metadata.title).toEqual({ absolute: "Private review draft" });
    expect(metadata.description).toBe("This page is being shared privately while the work is under review.");
    expect(metadata.alternates?.canonical).toBe("/the-stack");
    expect(metadata.robots).toEqual({ index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true });
  });

  it("renders one H1 and the not-medical-advice note", () => {
    const { container } = render(<TheStackPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Stack");
    expect(container.textContent).toContain("It is not a storefront and it is not a claim that one test can explain a life.");
    expect(container.textContent).toContain("This is educational context, not medical advice.");
  });

  it("has a section per category and a jump menu whose anchors all exist", () => {
    const { container } = render(<TheStackPage />);
    for (const c of STACK_CATEGORIES) {
      expect(screen.getByRole("heading", { level: 2, name: c.title })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: c.title })).toHaveAttribute("href", `#${c.id}`);
      expect(container.querySelector(`#${c.id}`)).not.toBeNull();
    }
    expect(container.querySelector("#contact")).not.toBeNull();
  });

  it("gives every supplier a direct link, marks referral links as sponsored and opens them in a new tab", () => {
    render(<TheStackPage />);
    const visits = screen.getAllByRole("link", { name: "Visit direct site" });
    expect(visits).toHaveLength(SUPPLIERS.length);
    SUPPLIERS.forEach((s, i) => {
      expect(visits[i]).toHaveAttribute("href", s.href);
      if (s.href.startsWith("http")) {
        expect(visits[i]).toHaveAttribute("target", "_blank");
        expect(visits[i]).toHaveAttribute("rel", s.referral ? "sponsored noopener noreferrer" : "noopener noreferrer");
      }
    });
  });

  it("shows QR codes from Sanity, never Manus, with real alt text", () => {
    render(<TheStackPage />);
    const withQr = SUPPLIERS.filter((s) => s.qr);
    expect(withQr).toHaveLength(5);
    for (const s of withQr) {
      const img = screen.getByAltText(`QR code for ${s.name}`);
      expect(img.getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
      expect(screen.getByRole("link", { name: `Open ${s.name} on your phone (QR code)` })).toHaveAttribute("href", s.href);
    }
  });

  it("links the contact email", () => {
    render(<TheStackPage />);
    expect(screen.getByRole("link", { name: "tony@impactsoul.is" })).toHaveAttribute("href", "mailto:tony@impactsoul.is");
  });
});
