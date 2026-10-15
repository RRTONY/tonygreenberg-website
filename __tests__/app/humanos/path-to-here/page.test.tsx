import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/humanos/path-to-here/page";
import { PATH_TIMELINE } from "@/lib/content/humanos-content";

describe("/humanos/path-to-here", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Path to Here — HumanOS");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/humanos/path-to-here");
  });

  it("has one H1 and every timeline entry in order", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Path to Here");
    const text = document.body.textContent!;
    const positions = PATH_TIMELINE.map((t) => text.indexOf(t.title));
    positions.forEach((p) => expect(p).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(screen.getByText(/Shared the stage with Ray Kurzweil/)).toBeInTheDocument();
  });

  it("links on to the diagnostic", () => {
    render(<Page />);
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toContain("/humanos/philosophy");
  });
});
