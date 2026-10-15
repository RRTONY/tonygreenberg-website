import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/interactions/page";


describe("/kava/interactions", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava Drug Interactions — Safety Guide");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/interactions");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Drug Interaction Checker");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("has the interaction checker and the CYP450 profile", () => {
    render(<Page />);
    expect(screen.getByPlaceholderText("Search medications or substances...")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "CYP450 Enzyme Inhibition Profile" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Alcohol" })).toBeInTheDocument();
  });
});
