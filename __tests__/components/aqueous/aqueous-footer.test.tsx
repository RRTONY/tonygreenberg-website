import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AqueousFooter } from "@/components/aqueous/aqueous-footer";

describe("AqueousFooter", () => {
  it("shows the app's copy and section headings", () => {
    render(<AqueousFooter />);
    expect(screen.getByText(/100% open source\. Built to empower conscious water choices/)).toBeInTheDocument();
    expect(screen.getByText("Crafted for the era of conscious consumption. Spend less. Live more.")).toBeInTheDocument();
    for (const h of ["Explore", "Learn", "Ecosystem & Data"]) expect(screen.getByRole("heading", { name: h })).toBeInTheDocument();
  });

  it("keeps internal links under /aqueous, with Tony's name linking home", () => {
    render(<AqueousFooter />);
    expect(screen.getByRole("link", { name: "Water Explorer" })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: "QPR Methodology" })).toHaveAttribute("href", "/aqueous/methodology");
    expect(screen.getByRole("link", { name: "About Tony" })).toHaveAttribute("href", "/aqueous/about");
    expect(screen.getByRole("link", { name: "Site Directory" })).toHaveAttribute("href", "/aqueous/directory");
    expect(screen.getByRole("link", { name: "Tony Greenberg" })).toHaveAttribute("href", "/");

    const internal = screen.getAllByRole("link").filter((a) => a.getAttribute("href")!.startsWith("/"));
    expect(internal).toHaveLength(15);
    for (const a of internal) {
      if (a.textContent === "Tony Greenberg") continue;
      expect(a.getAttribute("href")).toMatch(/^\/aqueous\//);
    }
  });

  it("opens outside sources in a new tab, safely", () => {
    render(<AqueousFooter />);
    const external = screen.getAllByRole("link").filter((a) => /^https?:/.test(a.getAttribute("href")!));
    expect(external.map((a) => a.textContent)).toEqual([
      "The Great Simplification",
      "RampRate",
      "ImpactSoul",
      "Joy and Woe",
      "EPA SDWIS",
      "EWG Tap Water Database",
      "USGS Water APIs",
      "Water Quality Portal",
    ]);
    for (const a of external) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("has no Manus links and none of the removed entries", () => {
    const { container } = render(<AqueousFooter />);
    expect(container.innerHTML).not.toMatch(/manus|\/api\/img\//i);
    expect(screen.queryByText("The Way Out")).not.toBeInTheDocument();
    expect(screen.queryByText(/fauxTony/)).not.toBeInTheDocument();
  });
});
