import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage, { metadata } from "@/app/about/page";

describe("/about", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Story");
    expect(metadata.description).toMatch(/Systems thinker\. Impact builder\. Corporate accountability crusader\./);
    expect(metadata.alternates?.canonical).toBe("/about");
  });

  it("renders one H1 and the real opening", () => {
    const { container } = render(<AboutPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/The broken things\s*taught me everything\./);
    expect(container).toHaveTextContent("Wrong about the timing. Right about everything else. For 25 years.");
    expect(container).toHaveTextContent("Then came Exodus Communications. A $37 billion IPO.");
  });

  it("tells the story in its real chapters", () => {
    render(<AboutPage />);
    for (const h of ["Before the systems, there was the question.", "$10 billion in truth-telling.", "Consciousness expansion isn't optional anymore."]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
  });

  it("credits Clarisse Abelarde with a link to her site", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Clarisse Abelarde" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "clarisseartist.com" })).toHaveAttribute("href", "https://clarisseartist.com/");
  });

  it("ends with ways to reach out and keep reading", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: /Reach Out/ })).toHaveAttribute("href", "mailto:tony@tonygreenberg.com");
    expect(screen.getByRole("link", { name: /Join the Ecosystem/ })).toHaveAttribute("href", "/ecosystem");
    expect(screen.getByRole("link", { name: /Read the field note/ })).toHaveAttribute("href", "/blog/energy-is-money-money-is-memory");
  });

  it("gives every image real alt text or marks it decorative", () => {
    const { container } = render(<AboutPage />);
    for (const img of container.querySelectorAll("img")) expect(img.hasAttribute("alt")).toBe(true);
  });
});
