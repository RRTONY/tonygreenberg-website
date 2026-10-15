import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/hawaii/page";


describe("/kava/hawaii", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Hawaii, Ice, and the 'Awa Bowl — Kava");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/hawaii");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hawaii, ICE, and the 'Awa Bowl");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("has the crisis numbers, the dual timeline and the recovery resources", () => {
    render(<Page />);
    for (const h of ["The ICE Crisis — By the Numbers", "Dual Timeline: Crisis and Revival", "Recovery Resources"])
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    expect(screen.getByText(/Crystal methamphetamine arrives in Hawaii from Southeast Asia/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "End Meth Coalition" })).toBeInTheDocument();
  });
});
