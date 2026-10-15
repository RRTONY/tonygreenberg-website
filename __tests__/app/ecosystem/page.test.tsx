import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EcosystemPage, { metadata } from "@/app/ecosystem/page";

describe("/ecosystem", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Ecosystem");
    expect(metadata.description).toBe("A curated network for people building what replaces what's broken.");
    expect(metadata.alternates?.canonical).toBe("/ecosystem");
  });

  it("renders one H1 and the real section headings and copy", () => {
    const { container } = render(<EcosystemPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Ecosystem");
    for (const h of ["What It Is", "Who It's For", "What Members Receive"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(container).toHaveTextContent("This isn't a community — it's a collaboration engine.");
    expect(container).toHaveTextContent("Founders building regenerative businesses");
    expect(container).toHaveTextContent("Monthly office hours with Tony for decision support");
  });

  it("requests an invitation by email with a pre-filled subject", () => {
    render(<EcosystemPage />);
    const href = screen.getByRole("link", { name: "Request an Invitation" }).getAttribute("href")!;
    expect(href.startsWith("mailto:tony@tonygreenberg.com")).toBe(true);
    expect(decodeURIComponent(href)).toContain("subject=Ecosystem — Request an Invitation");
  });

  it("links on to the assessments", () => {
    render(<EcosystemPage />);
    expect(screen.getByRole("link", { name: /Explore the Assessments/ })).toHaveAttribute("href", "/find-my");
  });
});
