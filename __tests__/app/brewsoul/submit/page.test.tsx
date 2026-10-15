import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/submit/page";

describe("/brewsoul/submit", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Submit or Appeal — BrewSoul");
    expect(metadata.description).toMatch(/appeal a score/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/submit");
  });

  it("renders exactly one H1 with the real heading", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Submit or Appeal");
  });
});
