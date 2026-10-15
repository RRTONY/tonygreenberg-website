import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/humanos/philosophy/page";

describe("/humanos/philosophy", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("HumanOS Philosophy");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/humanos/philosophy");
  });

  it("has one H1 and the three framework sections", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Philosophy");
    for (const h of ["The Maximizer Trap", "The Conscious Satisficer", "The Shift"]) expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
  });

  it("links to the Living Declaration and Path to Here", () => {
    render(<Page />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/living-declaration");
    expect(hrefs).toContain("/humanos/path-to-here");
  });

  it("images have alt text and no Manus host", () => {
    const { container } = render(<Page />);
    container.querySelectorAll("img").forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("src")).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
    });
  });
});
