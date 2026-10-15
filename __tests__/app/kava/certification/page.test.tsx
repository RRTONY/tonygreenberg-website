import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/certification/page";


describe("/kava/certification", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava Facilitator Certification");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/certification");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Facilitator Certification");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("lists three tiers and twelve modules adding up to 80 hours", () => {
    render(<Page />);
    expect(screen.getByText(/12-module, 80-hour certification program/)).toBeInTheDocument();
    expect(screen.getByText("Level 1 — Kava Practitioner")).toBeInTheDocument();
    expect(screen.getByText("Level 3 — Master Facilitator")).toBeInTheDocument();
    expect(screen.getByText("Kava Botany and Taxonomy")).toBeInTheDocument();
    expect(screen.getByText("Practicum and Certification")).toBeInTheDocument();
  });

  it("links on to the Kava home, the assessment and the interaction checker", () => {
    render(<Page />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const p of ["/kava", "/kava/assessment", "/kava/interactions"]) expect(hrefs).toContain(p);
  });
});
