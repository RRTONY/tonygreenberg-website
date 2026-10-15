import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JourneysAccordion, type Journey } from "@/components/marketing/journeys-accordion";

const JOURNEYS: Journey[] = [
  {
    id: "body",
    icon: <span>B</span>,
    title: "The Body Path",
    subtitle: "Flesh and ritual",
    description: "Start with the body.",
    duration: "45 min",
    mood: "Grounded",
    stops: [
      { page: "The Body", href: "/the-body", section: "Intro", teaser: "Begin here" },
      { page: "Kava", href: "/kava", section: "Roots", teaser: "Then this" },
    ],
  },
  {
    id: "out",
    icon: <span>O</span>,
    title: "Outward",
    subtitle: "Elsewhere",
    description: "Leave the site.",
    duration: "5 min",
    mood: "Curious",
    stops: [{ page: "RampRate", href: "https://ramprate.com", section: "Home", teaser: "Off-site" }],
  },
];

describe("JourneysAccordion", () => {
  it("shows each journey's title, duration and stop count", () => {
    render(<JourneysAccordion journeys={JOURNEYS} />);
    const trigger = screen.getByRole("button", { name: /The Body Path/ });
    expect(trigger).toHaveTextContent("45 min");
    expect(trigger).toHaveTextContent("2 stops");
  });

  it("keeps every stop link in the HTML while collapsed (forceMount)", () => {
    const { container } = render(<JourneysAccordion journeys={JOURNEYS} />);
    expect(container.querySelectorAll('a[href="/the-body"]')).toHaveLength(2);
    expect(container.querySelector('a[href="/kava"]')).toHaveTextContent("Stop 2 • Kava");
  });

  it("Begin This Journey goes to the first stop; external stops open in a new tab", () => {
    const { container } = render(<JourneysAccordion journeys={JOURNEYS} />);
    const begins = Array.from(container.querySelectorAll("a")).filter((a) => a.textContent === "Begin This Journey");
    expect(begins.map((a) => a.getAttribute("href"))).toEqual(["/the-body", "https://ramprate.com"]);
    expect(begins[1]).toHaveAttribute("target", "_blank");
  });

  it("expands a journey on click", async () => {
    render(<JourneysAccordion journeys={JOURNEYS} />);
    const trigger = screen.getByRole("button", { name: /Outward/ });
    await userEvent.setup().click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
