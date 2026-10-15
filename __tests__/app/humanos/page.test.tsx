import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/humanos/page";

describe("/humanos", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Human OS V2.0 — The Machine Is Perfect. Be The Glitch.");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/humanos");
  });

  it("has exactly one H1 and the Maximizer/Satisficer section", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("HumanOS V2.0");
    expect(screen.getByRole("heading", { level: 2, name: /Are you a Maximizer or a/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Take the Diagnostic/ })).toBeInTheDocument();
  });

  it("links the four system pages", () => {
    render(<Page />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const p of ["/humanos/philosophy", "/humanos/ecosystem", "/humanos/resources", "/humanos/path-to-here"]) expect(hrefs).toContain(p);
  });

  it("has no Manus-hosted images", () => {
    const { container } = render(<Page />);
    expect(container.innerHTML).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
    container.querySelectorAll("img").forEach((img) => expect(img).toHaveAttribute("alt"));
  });
});
