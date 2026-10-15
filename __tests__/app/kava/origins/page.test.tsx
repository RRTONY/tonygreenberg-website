import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/origins/page";


describe("/kava/origins", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava Origins — Pacific Island Traditions");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/origins");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Island Origins");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("has the migration timeline, the island explorer and the noble vs. tudei section", () => {
    render(<Page />);
    for (const h of ["Migration Timeline", "Explore Each Nation"]) expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Noble vs. Tudei/ })).toBeInTheDocument();
    expect(screen.getByText("Domestication from wild Piper wichmannii")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });
});
