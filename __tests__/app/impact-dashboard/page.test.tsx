import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImpactDashboardPage, { metadata } from "@/app/impact-dashboard/page";

describe("/impact-dashboard", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("ImpactSoul Target Representation — Impact Dashboard");
    expect(metadata.description).toMatch(/30-day refinement process/);
    expect(metadata.alternates?.canonical).toBe("/impact-dashboard");
  });

  it("renders one H1 and the pro forma disclaimer up front", () => {
    const { container } = render(<ImpactDashboardPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Model We’re Building");
    expect(container).toHaveTextContent("It is not a current performance report, a token-sale page, or a claim that these outcomes have already happened.");
    expect(container).toHaveTextContent("Pro forma");
  });

  it("keeps every tab's section in the server HTML", () => {
    render(<ImpactDashboardPage />);
    for (const h of ["Four Proposed Impact Pathways", "Portfolio Model by Category", "SoulScore — 12-Dimension Design", "Accountability Model", "Impact Rate of Return Model"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
  });

  it("shows the chosen tab and hides the overview", async () => {
    const user = userEvent.setup();
    render(<ImpactDashboardPage />);
    const soulScore = screen.getByRole("heading", { level: 2, name: "SoulScore — 12-Dimension Design" });
    expect(soulScore.closest(".hidden")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "SoulScore" }));
    expect(soulScore.closest(".hidden")).toBeNull();
  });

  it("links to the related research pages", () => {
    render(<ImpactDashboardPage />);
    expect(screen.getAllByRole("link", { name: /SoulScore Engine/ })[0]).toHaveAttribute("href", "/soulscore");
    expect(screen.getAllByRole("link", { name: /Charity Scorecard/ })[0]).toHaveAttribute("href", "/charity-scorecard");
    expect(screen.getAllByRole("link", { name: /Portfolio Intel/ })[0]).toHaveAttribute("href", "/intel");
    expect(screen.getAllByRole("link", { name: /Invest in the Thesis/ })[0]).toHaveAttribute("href", "/invest");
  });
});
