import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage, { metadata } from "@/app/contact/page";

describe("/contact", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Contact");
    expect(metadata.description).toMatch(/How to reach Tony Greenberg/);
    expect(metadata.alternates?.canonical).toBe("/contact");
  });

  it("renders one H1 and every way to get in touch, with the right links", () => {
    render(<ContactPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Get in touch");
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute("href", "mailto:t@ramprate.com");
    expect(screen.getByRole("link", { name: /book time/i })).toHaveAttribute("href", "https://linktr.ee/TonyG2");
    expect(screen.getByRole("link", { name: /work together/i })).toHaveAttribute("href", "/pick-up-the-phone");
    expect(screen.getByRole("link", { name: /suppliers/i })).toHaveAttribute("href", "https://ramprate.com/biochain");
    expect(screen.getByRole("link", { name: "@ThinkTony" })).toHaveAttribute("href", "https://x.com/ThinkTony");
    expect(screen.getByText("Santa Monica, CA")).toBeInTheDocument();
  });

  it("opens outside links safely in a new tab", () => {
    render(<ContactPage />);
    for (const a of screen.getAllByRole("link").filter((l) => l.getAttribute("target") === "_blank")) {
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
