import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TapWater } from "@/components/aqueous/pages/tap-water/tap-water";
import { tapWaterDatabase } from "@/lib/content/aqueous/water-data";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => null }));

describe("StepSearch", () => {
  it("shows nothing before a search", () => {
    const { container } = render(<TapWater />);
    expect(container.querySelectorAll("section")[1].textContent).toBe("");
  });

  it("lists ZIP matches with violations and a score-coloured urgency bar", async () => {
    const user = userEvent.setup();
    const { container } = render(<TapWater />);
    await user.type(screen.getByRole("textbox"), "48502");
    expect(screen.getByText("1 city found")).toBeInTheDocument();
    expect(screen.getByText("— matched via ZIP code")).toBeInTheDocument();
    expect(screen.getByText("2 active violations")).toBeInTheDocument();
    const bar = container.querySelector(".bg-\\[\\#9B2335\\]") as HTMLElement;
    expect(bar.style.width).toBe("22%");
  });

  it("says singular for one active violation and staggers the cards", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    await user.type(screen.getByRole("textbox"), "California");
    expect(screen.getByText(/cities found/)).toBeInTheDocument();
    expect(screen.getAllByText("1 active violation").length).toBeGreaterThan(0);
    const cards = screen.getAllByRole("button", { name: /California/ });
    expect(cards[1].style.animationDelay).toBe("0.06s");
  });

  it("suggests cities when nothing matches, and a suggestion searches it", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    await user.type(screen.getByRole("textbox"), "Atlantis");
    expect(screen.getByText('No cities found matching "Atlantis"')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`cover ${tapWaterDatabase.length} major US cities`))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Chicago" }));
    expect(screen.getByRole("textbox")).toHaveValue("Chicago");
    expect(screen.getByText("1 city found")).toBeInTheDocument();
  });

  it("opens a city's report", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    await user.type(screen.getByRole("textbox"), "Seattle");
    await user.click(screen.getByRole("button", { name: /Seattle, Washington/ }));
    expect(screen.getByRole("heading", { level: 2, name: "Seattle, Washington" })).toBeInTheDocument();
  });
});
