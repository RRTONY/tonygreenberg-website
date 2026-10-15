import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SpeakingPage, { metadata } from "@/app/speaking/page";

describe("/speaking", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Speaking and Conversations");
    expect(metadata.description).toMatch(/^Keynotes, firesides, offsites, and working sessions with Tony Greenberg/);
    expect(metadata.alternates?.canonical).toBe("/speaking");
  });

  it("renders one H1 and the rooms Tony has spoken in", () => {
    render(<SpeakingPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "A room changes when someone names what everyone can already feel.",
    );
    for (const room of ["Davos", "Harvard H+ Summit", "UCLA", "Paris Blockchain Week"]) {
      expect(screen.getByText(room)).toBeInTheDocument();
    }
  });

  it("shows the themes", () => {
    render(<SpeakingPage />);
    expect(screen.getByRole("heading", { level: 2, name: "A serious point of view, with a pulse." })).toBeInTheDocument();
    expect(screen.getByText("Trust is infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Capital has a job to do")).toBeInTheDocument();
    expect(screen.getByText(/managing more than \$10 billion in transactions/)).toBeInTheDocument();
  });

  it("opens a pre-addressed speaking-invitation email", () => {
    render(<SpeakingPage />);
    expect(screen.getByRole("link", { name: /Start a conversation/ })).toHaveAttribute(
      "href",
      "mailto:tony@tonygreenberg.com?subject=Speaking%20Invitation",
    );
  });

  it("links to the story and the related pages", () => {
    render(<SpeakingPage />);
    expect(screen.getByRole("link", { name: /The Story/ })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /^Published Elsewhere/ })).toHaveAttribute("href", "/published");
    expect(screen.getByRole("link", { name: /H\+ Summit Transcript/ })).toHaveAttribute(
      "href",
      "/blog/boiling-the-human-summit-harvard-kurzweil",
    );
  });
});
