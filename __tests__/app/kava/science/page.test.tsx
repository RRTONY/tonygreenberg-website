import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/science/page";
import { KAVALACTONES } from "@/lib/content/kava-science";

describe("/kava/science", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava Science — Kavalactones and Effects");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/science");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kavalactone Science");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("shows all six kavalactones and the chemotype decoder", () => {
    render(<Page />);
    KAVALACTONES.forEach((k) => expect(screen.getAllByText(new RegExp(k.name)).length).toBeGreaterThan(0));
    expect(screen.getByRole("heading", { level: 2, name: "Chemotype Decoder" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. 4-2-6-5-3-1")).toBeInTheDocument();
  });
});
