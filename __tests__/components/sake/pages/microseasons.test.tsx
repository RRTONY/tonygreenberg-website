import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeMicroseasons } from "@/components/sake/pages/microseasons";
import { microseasons } from "@/lib/content/sake/culture-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeMicroseasons", () => {
  it("lists all seasons, marks the current one and filters", async () => {
    const user = userEvent.setup();
    renderSake(<SakeMicroseasons />);
    expect(screen.getByRole("heading", { level: 1, name: /What to Drink/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(microseasons.length);
    expect(screen.getByLabelText("Now")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Winter/ }));
    const winter = microseasons.filter((m) => m.season === "winter");
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(winter.length);
    await user.click(screen.getByRole("button", { name: "All Seasons" }));
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(microseasons.length);
  });

  it("keeps each card's details in the HTML and opens them", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeMicroseasons />);
    const first = microseasons[0];
    const panel = container.querySelector(`#microseason-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.sake);
    const btn = screen.getAllByRole("button").find((b) => b.getAttribute("aria-controls") === panel.id)!;
    await user.click(btn);
    expect(panel).not.toHaveAttribute("hidden");
    await user.click(btn);
    expect(panel).toHaveAttribute("hidden");
  });
});
