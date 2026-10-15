import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/products/page";


describe("/kava/products", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava Product Index — Sourcing Guide");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/products");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Product Index");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("shows the real product index, starting on ceremonial powders", () => {
    render(<Page />);
    expect(screen.getByText("Module 9")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Ceremonial Grade Traditional Powder" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Buy Now" })[0]).toHaveAttribute("href", "https://kalmwithkava.com");
  });
});
