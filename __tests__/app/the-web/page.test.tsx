import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TheWebPage, { metadata } from "@/app/the-web/page";

// The shared next/font/google fake is a Proxy with no `has` trap, so vitest
// reports named imports (Fraunces, ...) as missing. Stub the page-fonts module.
vi.mock("@/lib/fonts/page-fonts", () => ({ pageFontVariables: "page-fonts" }));

describe("/the-web", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Web");
    expect(metadata.description).toMatch(/Disney, Microsoft, Goldman Sachs, Nike, and more\./);
    expect(metadata.alternates?.canonical).toBe("/the-web");
  });

  it("renders one H1 and the network thesis", () => {
    render(<TheWebPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ecosystem");
    expect(screen.getByText(/The real value isn't in any single company — it's in the connections between them\./)).toBeInTheDocument();
  });

  it("lists clients and key partnerships", () => {
    render(<TheWebPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Select Clients & Relationships" })).toBeInTheDocument();
    for (const c of ["Microsoft", "Disney", "Goldman Sachs", "Nike"]) expect(screen.getByText(c)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Key Partnerships" })).toBeInTheDocument();
    expect(screen.getByText("MAPS / Rick Doblin")).toBeInTheDocument();
    expect(screen.getByText("B Corp Certification")).toBeInTheDocument();
  });

  it("links to clients, the ecosystem and the next door", () => {
    render(<TheWebPage />);
    expect(screen.getByRole("link", { name: /^Clients/ })).toHaveAttribute("href", "/clients");
    expect(screen.getByRole("link", { name: /^The Ecosystem/ })).toHaveAttribute("href", "/ecosystem");
    expect(screen.getByRole("link", { name: /Pick Up the Phone/ })).toHaveAttribute("href", "/pick-up-the-phone");
  });
});
