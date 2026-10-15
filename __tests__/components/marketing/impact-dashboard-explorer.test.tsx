import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImpactDashboardExplorer } from "@/components/marketing/impact-dashboard-explorer";
import { TOKEN_ECOSYSTEMS } from "@/lib/content/impact-dashboard";

const TABS = ["Overview", "Project Pathways", "Portfolio Model", "SoulScore", "Accountability Model", "iRR Framework"];
const panel = (heading: string) => screen.getByRole("heading", { level: 2, name: heading }).closest("main > div")!;

function setup() {
  render(<ImpactDashboardExplorer charityCount={103} />);
  return { user: userEvent.setup(), nav: screen.getByRole("navigation") };
}

describe("ImpactDashboardExplorer", () => {
  it("has a button for every tab and keeps every tab's content in the HTML", () => {
    const { nav } = setup();
    expect(within(nav).getAllByRole("button").map((b) => b.textContent)).toEqual(TABS);
    expect(panel("Four Proposed Impact Pathways")).toHaveClass("hidden");
    expect(panel("Portfolio Model by Category")).toHaveClass("hidden");
    expect(panel("Accountability Model")).toHaveClass("hidden");
    expect(screen.getByText("Illustrative Operating Model").parentElement).not.toHaveClass("hidden");
  });

  it("switches tabs", async () => {
    const { user, nav } = setup();
    await user.click(within(nav).getByRole("button", { name: "Portfolio Model" }));
    expect(panel("Portfolio Model by Category")).not.toHaveClass("hidden");
    expect(screen.getByText("Illustrative Operating Model").parentElement).toHaveClass("hidden");
    await user.click(within(nav).getByRole("button", { name: "iRR Framework" }));
    expect(panel("Impact Rate of Return Model")).not.toHaveClass("hidden");
  });

  it("shows the charity count and links to the related tools", () => {
    const { container } = render(<ImpactDashboardExplorer charityCount={42} />);
    expect(screen.getByText("42 charities, 8 evaluators unified")).toBeInTheDocument();
    for (const href of ["/soulscore", "/charity-scorecard", "/intel", "/invest"]) {
      expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull();
    }
  });

  it("clicking a pathway on the Overview opens the Project Pathways tab", async () => {
    const { user } = setup();
    const overview = screen.getByText("Illustrative Operating Model").parentElement!;
    await user.click(within(overview).getByText(TOKEN_ECOSYSTEMS[0].name));
    expect(panel("Four Proposed Impact Pathways")).not.toHaveClass("hidden");
  });

  it("expands a pathway's details on the Project Pathways tab", async () => {
    const { user, nav } = setup();
    await user.click(within(nav).getByRole("button", { name: "Project Pathways" }));
    const token = TOKEN_ECOSYSTEMS[0];
    const pathways = panel("Four Proposed Impact Pathways") as HTMLElement;
    const detail = within(pathways).getAllByText("Potential Collaborator")[0].closest(".hidden, .mt-4")!;
    expect(detail).toHaveClass("hidden");
    await user.click(within(pathways).getByText(token.fullName));
    expect(within(pathways).getAllByText("Potential Collaborator")[0].closest("div.mt-4")).not.toBeNull();
  });
});
