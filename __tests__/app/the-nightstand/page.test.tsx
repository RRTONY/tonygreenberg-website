import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TheNightstandPage, { metadata } from "@/app/the-nightstand/page";

describe("/the-nightstand", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Nightstand");
    expect(metadata.description).toMatch(/^What Tony Greenberg is reading, watching, and thinking about\./);
    expect(metadata.alternates?.canonical).toBe("/the-nightstand");
  });

  it("renders one H1 and the intro", () => {
    render(<TheNightstandPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Library");
    expect(screen.getByText(/The books and ideas that built my operating system\./)).toBeInTheDocument();
  });

  it("lists the books with their authors and Tony's notes", () => {
    render(<TheNightstandPage />);
    for (const [book, author] of [
      ["Operating Manual for Spaceship Earth", "Buckminster Fuller"],
      ["Finite and Infinite Games", "James P. Carse"],
      ["The Tao Te Ching", "Lao Tzu"],
    ]) {
      expect(screen.getByText(book)).toBeInTheDocument();
      expect(screen.getByText(author)).toBeInTheDocument();
    }
    expect(screen.getByText(/We're all crew on this ship — there are no passengers\./)).toBeInTheDocument();
  });

  it("explains the key concepts", () => {
    const { container } = render(<TheNightstandPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Key Concepts" })).toBeInTheDocument();
    expect(container.textContent).toContain("Choosing the first option that meets your criteria");
  });

  it("links to the related pages and the next door", () => {
    render(<TheNightstandPage />);
    expect(screen.getByRole("link", { name: /^The Territory/ })).toHaveAttribute("href", "/the-territory");
    expect(screen.getByRole("link", { name: /2 Great Books on a Mountain/ })).toHaveAttribute(
      "href",
      "/blog/transforming-tony-2-books-mountain-life-strife",
    );
    expect(screen.getByRole("link", { name: /Continue to The Web/ })).toHaveAttribute("href", "/the-web");
  });
});
