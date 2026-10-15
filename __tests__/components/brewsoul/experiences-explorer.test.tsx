import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExperiencesExplorer } from "@/components/brewsoul/experiences-explorer";
import { EXPERIENCES } from "@/lib/content/brewsoul-encyclopedia";

const cards = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const countries = Array.from(new Set(EXPERIENCES.map((e) => e.country)));

describe("ExperiencesExplorer", () => {
  it("offers All plus one button per country, and starts on All", () => {
    render(<ExperiencesExplorer experiences={EXPERIENCES} />);
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["All", ...countries]);
    expect(cards()).toEqual(EXPERIENCES.map((e) => e.name));
  });

  it("narrows to one country, then back to all", async () => {
    const user = userEvent.setup();
    render(<ExperiencesExplorer experiences={EXPERIENCES} />);
    const country = countries[0];
    await user.click(screen.getByRole("button", { name: country }));
    expect(cards()).toEqual(EXPERIENCES.filter((e) => e.country === country).map((e) => e.name));
    expect(screen.getByRole("button", { name: country }).className).toContain("border-2");
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(cards()).toHaveLength(EXPERIENCES.length);
  });

  it("opens experience websites in a new tab", () => {
    render(<ExperiencesExplorer experiences={EXPERIENCES} />);
    const visits = screen.queryAllByRole("link", { name: /Visit/ });
    expect(visits).toHaveLength(EXPERIENCES.filter((e) => e.url).length);
    for (const a of visits) expect(a).toHaveAttribute("target", "_blank");
  });
});
