import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/humanos/connect/page";

describe("/humanos/connect", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Connect — HumanOS");
    expect(metadata.description).toMatch(/Join the HumanOS community/);
    expect(metadata.alternates?.canonical).toBe("/humanos/connect");
  });

  it("has one H1 and the real intro line", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Connect");
    expect(screen.getByText("Human OS 2.0 is not a spectator sport. Choose your entry point.")).toBeInTheDocument();
  });

  it("links the four entry points to real pages (no dead /assessment or /manifesto)", () => {
    render(<Page />);
    const href = (name: RegExp) => screen.getByRole("link", { name }).getAttribute("href");
    expect(href(/Take the Diagnostic/)).toBe("/humanos/philosophy");
    expect(href(/Read the Living Declaration/)).toBe("/living-declaration");
    expect(href(/Explore the Ecosystem/)).toBe("/humanos/ecosystem");
    expect(href(/Pick Up the Phone/)).toBe("/pick-up-the-phone");
    expect(document.querySelector('a[href="/assessment"], a[href="/manifesto"]')).toBeNull();
  });
});
