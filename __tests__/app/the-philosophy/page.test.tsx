import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ThePhilosophyPage, { metadata } from "@/app/the-philosophy/page";
import { MEDICINES } from "@/lib/content/pri-data";

describe("/the-philosophy", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Philosophy — The Diode of Perception");
    expect(metadata.description).toMatch(/passage on perception, intention, and the sharpening of will/);
    expect(metadata.alternates?.canonical).toBe("/the-philosophy");
  });

  it("renders one H1 and Tony's passage", () => {
    const { container } = render(<ThePhilosophyPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Diode of Perception");
    expect(container.textContent).toContain(
      "The diode of perception tethering movement to bone accelerates the other fundamental processes of life.",
    );
    expect(container.textContent).toContain("The sharpening of will takes place as the simplicity of life");
  });

  it("explains what the passage means for the readiness instruments", () => {
    render(<ThePhilosophyPage />);
    expect(screen.getByRole("heading", { level: 2, name: "What This Means" })).toBeInTheDocument();
    expect(screen.getByText("You are the instrument")).toBeInTheDocument();
    expect(screen.getByText(/the medicine does not change you\. It reveals the condition of the instrument/)).toBeInTheDocument();
  });

  it("links to the three instruments", () => {
    render(<ThePhilosophyPage />);
    expect(screen.getByRole("link", { name: /^Psychedelic Readiness Index/ })).toHaveAttribute("href", "/psychedelic-readiness-index");
    expect(screen.getByRole("link", { name: /^Facilitator Index/ })).toHaveAttribute("href", "/facilitator-index");
    expect(screen.getByRole("link", { name: /^Medicine Sequencing/ })).toHaveAttribute("href", "/medicine-sequencing");
  });

  it("the PRI card's medicine count comes from the PRI dataset", () => {
    render(<ThePhilosophyPage />);
    const card = screen.getByRole("link", { name: /^Psychedelic Readiness Index/ });
    expect(card).toHaveTextContent(`${MEDICINES.length} medicines.`);
  });
});
