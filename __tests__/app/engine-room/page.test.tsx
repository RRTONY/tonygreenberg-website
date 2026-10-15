import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EngineRoomPage, { metadata } from "@/app/engine-room/page";

describe("/engine-room", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Engine Room");
    expect(metadata.description).toMatch(/operational infrastructure behind Tony Greenberg's work/);
    expect(metadata.alternates?.canonical).toBe("/engine-room");
  });

  it("renders one H1 and the real ventures copy", () => {
    const { container } = render(<EngineRoomPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Projects & Ventures");
    expect(screen.getByRole("heading", { level: 2, name: "Active Ventures" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Active Engagements" })).toBeInTheDocument();
    expect(container).toHaveTextContent("$10B+ in enterprise contracts priced, audited, and renegotiated.");
    expect(container).toHaveTextContent("Four live token ecosystems: BEYOND, REX, SPACE, BEING.");
  });

  it("links each venture to its own site", () => {
    render(<EngineRoomPage />);
    expect(screen.getByRole("link", { name: "RampRate" })).toHaveAttribute("href", "https://ramprate.com");
    expect(screen.getByRole("link", { name: "ImpactSoul" })).toHaveAttribute("href", "https://impactsoul.is");
    expect(screen.getByRole("link", { name: "Homeaglow Exposed" })).toHaveAttribute("href", "https://homeaglowexposed.com");
  });

  it("continues to Under NDA and the related pages", () => {
    render(<EngineRoomPage />);
    expect(screen.getByRole("link", { name: /Continue to Under NDA/ })).toHaveAttribute("href", "/under-nda");
    expect(screen.getByRole("link", { name: /Invest in the Thesis/ })).toHaveAttribute("href", "/invest");
    expect(screen.getByRole("link", { name: /^Intel/ })).toHaveAttribute("href", "/intel");
  });
});
