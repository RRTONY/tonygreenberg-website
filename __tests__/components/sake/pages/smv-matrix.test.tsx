import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeSmvMatrix } from "@/components/sake/pages/smv-matrix";
import { smvData } from "@/lib/content/sake/deep-data2";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeSmvMatrix", () => {
  it("plots every sake and opens its detail panel", async () => {
    const user = userEvent.setup();
    renderSake(<SakeSmvMatrix />);
    expect(screen.getByRole("heading", { level: 1, name: /SMV × Acidity Matrix/ })).toBeInTheDocument();
    const first = smvData[0];
    const dot = screen.getAllByRole("button", { name: first.name })[0];
    await user.click(dot);
    expect(dot).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { level: 3, name: first.name })).toBeInTheDocument();
    expect(screen.getByText(first.style)).toBeInTheDocument();
    expect(screen.queryByText("Connoisseur Note")).toBeNull();
    await user.click(screen.getByTestId("toggle-mode"));
    expect(screen.getByText("Connoisseur Note")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("heading", { level: 3, name: first.name })).toBeNull();
  });

  it("highlights a category from the legend and dims the rest", async () => {
    const user = userEvent.setup();
    renderSake(<SakeSmvMatrix />);
    const legend = screen.getByRole("button", { name: "Yamahai" });
    await user.click(legend);
    expect(legend).toHaveAttribute("aria-pressed", "true");
    const other = smvData.find((d) => d.category !== "yamahai")!;
    expect(screen.getAllByRole("button", { name: other.name })[0].className).toContain("opacity-15");
    await user.unhover(legend);
    expect(screen.getAllByRole("button", { name: other.name })[0].className).toContain("opacity-15");
    await user.click(legend);
    expect(legend).toHaveAttribute("aria-pressed", "false");
    await user.unhover(legend);
    expect(screen.getAllByRole("button", { name: other.name })[0].className).toContain("opacity-100");
    await user.hover(screen.getByRole("button", { name: "Ginjo" }));
    expect(screen.getAllByRole("button", { name: other.name })[0].className).toMatch(/opacity-(15|100)/);
  });
});
