import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CommunityPage, { metadata } from "@/app/community/page";

describe("/community", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Community");
    expect(metadata.description).toMatch(/Find your tribe, your partner, your collaborator/);
    expect(metadata.alternates?.canonical).toBe("/community");
  });

  it("renders one H1 and the real copy", () => {
    const { container } = render(<CommunityPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Tribe. Build What's Next.");
    expect(container).toHaveTextContent("Every great movement started with two people who shouldn't have met but did.");
    expect(container).toHaveTextContent("The best architecture is the one your community finishes for you.");
  });

  it("sends visitors to sign in and come back here", () => {
    render(<CommunityPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Sign In to Join the Community" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign In/ })).toHaveAttribute("href", "/login?next=/community");
  });

  it("links to the manifesto twice", () => {
    render(<CommunityPage />);
    expect(screen.getByRole("link", { name: /Read the Manifesto/ })).toHaveAttribute("href", "/living-declaration");
    expect(screen.getByRole("link", { name: /^The Manifesto/ })).toHaveAttribute("href", "/living-declaration");
  });
});
