import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PublishedPage, { metadata } from "@/app/published/page";

describe("/published", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Published Elsewhere");
    expect(metadata.description).toMatch(/Bylines across HuffPost, Medium, MediaVillage/);
    expect(metadata.alternates?.canonical).toBe("/published");
  });

  it("renders one H1 and the outlet summary", () => {
    render(<PublishedPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("PublishedElsewhere");
    expect(screen.getByText("Contributor, 2010–2012", { exact: false })).toBeInTheDocument();
  });

  it("groups the articles by topic", () => {
    render(<PublishedPage />);
    for (const h of ["Technology & Markets", "Trust & Philosophy", "Blockchain & Web3", "Speaking & Podcast"]) {
      expect(screen.getByRole("heading", { level: 2, name: new RegExp(`^${h}`) })).toBeInTheDocument();
    }
  });

  it("links each byline to the real article and opens it outside the site", () => {
    render(<PublishedPage />);
    const article = screen.getByRole("link", { name: /Building a Services Market for the Transhuman Era/ });
    expect(article).toHaveAttribute("href", "https://www.huffpost.com/entry/building-a-services-marke_b_569378");
    expect(screen.getByRole("link", { name: /Microsoft's Underwater Data Centers/ })).toHaveAttribute(
      "href",
      "https://medium.com/@ramprate/microsofts-underwater-data-centers-really-3c39ff010483",
    );
    const external = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("http"));
    expect(external.length).toBeGreaterThan(20);
  });

  it("links back to the homepage", () => {
    render(<PublishedPage />);
    expect(screen.getByRole("link", { name: /Back to the Broadsheet/ })).toHaveAttribute("href", "/");
  });
});
