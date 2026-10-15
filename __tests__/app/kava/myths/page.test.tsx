import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/myths/page";


describe("/kava/myths", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava Myths — Fact vs. Fiction");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/myths");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Myths Debunked");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("lists the seven myths and the closing takeaway", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
    expect(screen.getByText(/3,000-year safety record that no pharmaceutical on earth/)).toBeInTheDocument();
  });
});
