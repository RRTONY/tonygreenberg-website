import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideWatchRoleChecklist } from "@/components/marketing/peptide-watch-role-checklist";
import { ROLE_CHECKLISTS } from "@/lib/content/peptide-watch";

const heading = (role: string) => screen.getByRole("heading", { level: 3, name: `${role} Checklist`, hidden: true });

describe("PeptideWatchRoleChecklist", () => {
  it("has one tab button per role and shows the first role's checklist", () => {
    render(<PeptideWatchRoleChecklist />);
    for (const rc of ROLE_CHECKLISTS) expect(screen.getByRole("button", { name: rc.role })).toBeInTheDocument();
    expect(heading(ROLE_CHECKLISTS[0].role).parentElement).not.toHaveClass("hidden");
    expect(heading(ROLE_CHECKLISTS[1].role).parentElement).toHaveClass("hidden");
  });

  it("switches checklists, keeping every item in the HTML", async () => {
    const { container } = render(<PeptideWatchRoleChecklist />);
    const second = ROLE_CHECKLISTS[1];
    await userEvent.setup().click(screen.getByRole("button", { name: second.role }));
    expect(heading(second.role).parentElement).not.toHaveClass("hidden");
    expect(heading(ROLE_CHECKLISTS[0].role).parentElement).toHaveClass("hidden");
    const totalItems = ROLE_CHECKLISTS.reduce((n, r) => n + r.items.length, 0);
    expect(container.querySelectorAll("ol > li")).toHaveLength(totalItems);
  });
});
