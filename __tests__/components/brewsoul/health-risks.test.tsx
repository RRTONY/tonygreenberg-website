import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HealthRisks } from "@/components/brewsoul/health-risks";

const risks = [
  { title: "Sleep Disruption", detail: "Half-life 5-6 hours", citation: "Drake 2013", severity: "HIGH" as const },
  { title: "Bone Density", detail: "Minor", citation: "Heaney 2002", severity: "LOW" as const },
];

describe("HealthRisks", () => {
  it("keeps the risks collapsed behind a count button", () => {
    render(<HealthRisks risks={risks} />);
    expect(screen.getByRole("button", { name: "Show All 2 Risks ▼" })).toBeInTheDocument();
    expect(screen.queryByText("Sleep Disruption")).not.toBeInTheDocument();
  });

  it("expands to show every risk with its severity and citation, then collapses", async () => {
    const user = userEvent.setup();
    render(<HealthRisks risks={risks} />);
    await user.click(screen.getByRole("button", { name: /Show All/ }));
    expect(screen.getByText("Sleep Disruption")).toBeInTheDocument();
    expect(screen.getByText("HIGH").className).toContain("bg-[#8b4c2a]");
    expect(screen.getByText("LOW").className).toContain("bg-[#5a6a50]");
    expect(screen.getByText("Heaney 2002")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Collapse Risks ▲" }));
    expect(screen.queryByText("Sleep Disruption")).not.toBeInTheDocument();
  });
});
