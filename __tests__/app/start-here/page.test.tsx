import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StartHerePage, { metadata } from "@/app/start-here/page";
import { postHref } from "@/lib/content/post-redirects";

const ESSAYS: [RegExp, string][] = [
  [/Boiling the Human/, "boiling-the-human-summit-harvard-kurzweil"],
  [/Trust Us\? Are You Really My Friend\?/, "only-time-buys-trust"],
  [/Psychedelics Could Become Extractive Capitalism/, "psychedelics-could-become-extractive-capitalism"],
  [/The Ball and Blockchain/, "the-ball-and-blockchain-decentralization"],
  [/Return on Investment — Are You Going Green\?/, "return-on-investment-going-green-going-green-2"],
];

describe("/start-here", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Start Here");
    expect(metadata.description).toBe("Five essays that define the worldview. Start with the thinking that started everything.");
    expect(metadata.alternates?.canonical).toBe("/start-here");
  });

  it("renders one H1 and the intro", () => {
    render(<StartHerePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Five essays.One worldview.");
    expect(screen.getByText(/They're the load-bearing walls\./)).toBeInTheDocument();
  });

  it("shows each essay with its pull quote and reason to read it", () => {
    render(<StartHerePage />);
    expect(screen.getByText(/In a world optimized for speed, the most radical act is patience\./)).toBeInTheDocument();
    expect(screen.getByText(/Because trust is the only currency that compounds\./)).toBeInTheDocument();
    expect(screen.getAllByText("Read this essay")).toHaveLength(5);
  });

  it("links all five essays to their real posts", () => {
    render(<StartHerePage />);
    for (const [name, slug] of ESSAYS) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", postHref(slug));
    }
  });

  it("links on to all essays and the ecosystem", () => {
    render(<StartHerePage />);
    expect(screen.getByRole("link", { name: /Explore All Essays/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Join the Ecosystem/ })).toHaveAttribute("href", "/ecosystem");
  });
});
