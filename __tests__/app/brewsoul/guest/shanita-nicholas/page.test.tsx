import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/guest/shanita-nicholas/page";

describe("/brewsoul/guest/shanita-nicholas", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Shanita Nicholas Breaks the Coffee Industry's Comfortable Lies");
    expect(metadata.description).toMatch(/Guest Series interview/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/guest/shanita-nicholas");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/biodynamic",  "/brewsoul/decaf",  "/brewsoul/economics",  "/brewsoul/directory"]) expect(hrefs).toContain(href);
  });
});
