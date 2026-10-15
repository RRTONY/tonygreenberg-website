import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JourneysPage, { metadata } from "@/app/journeys/page";

const JOURNEYS = ["The Thinker's Thread", "The Operator's Playbook", "The Impact Trail", "The Body Electric", "The Crusade Files", "The Relationship Circuit", "The Whole Catastrophe"];

describe("/journeys", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Journeys");
    expect(metadata.description).toMatch(/Guided paths through Tony Greenberg's site/);
    expect(metadata.alternates?.canonical).toBe("/journeys");
  });

  it("renders one H1 and the real intro", () => {
    const { container } = render(<JourneysPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Guided Journeys");
    expect(container).toHaveTextContent("Think of these as curated playlists for your attention. Some are short. One is everything.");
  });

  it("lists all seven journeys as accordion triggers", () => {
    render(<JourneysPage />);
    for (const j of JOURNEYS) expect(screen.getByRole("button", { name: new RegExp(j) })).toBeInTheDocument();
  });

  it("keeps every journey's stops and links in the HTML while collapsed", () => {
    render(<JourneysPage />);
    expect(screen.getAllByRole("link", { name: /Stop 1 • The Letter/ })[0]).toHaveAttribute("href", "/the-letter");
    expect(screen.getAllByRole("link", { name: /The Corridor/ })[0]).toHaveAttribute("href", "/under-nda");
    expect(screen.getAllByRole("link", { name: /DMN8 Gym Exposé/ })[0]).toHaveAttribute(
      "href",
      "/blog/trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
    );
    expect(screen.getAllByRole("link", { name: /Begin This Journey/ })[0]).toHaveAttribute("href", "/the-letter");
  });

  it("opens a journey when its header is clicked", async () => {
    const user = userEvent.setup();
    render(<JourneysPage />);
    const trigger = screen.getByRole("button", { name: /The Impact Trail/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
