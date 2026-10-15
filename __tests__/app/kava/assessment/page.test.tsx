import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/assessment/page";


describe("/kava/assessment", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("PRI Assessment — Kava Ceremony Readiness");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/assessment");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("PRI Assessment");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("mounts the five-domain quiz", () => {
    render(<Page />);
    expect(screen.getByText("Domain 1 of 5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Somatic Readiness" })).toBeInTheDocument();
  });
});
