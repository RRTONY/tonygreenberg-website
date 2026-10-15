import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BiodynamicRoasters } from "@/components/brewsoul/biodynamic-roasters";

describe("BiodynamicRoasters", () => {
  it("shows 6 roasters, each with a star rating and a price table", () => {
    render(<BiodynamicRoasters />);
    expect(screen.getAllByRole("img", { name: /out of 5 stars$/ })).toHaveLength(6);
    expect(screen.getAllByRole("table")).toHaveLength(6);
    expect(screen.getByText("Holistic Roasters (Biodynamic Coffee)")).toBeInTheDocument();
    expect(screen.getAllByText("$1.88").length).toBeGreaterThan(0);
  });

  it("opens one roaster's certifications and buy link at a time", async () => {
    const user = userEvent.setup();
    render(<BiodynamicRoasters />);
    expect(screen.queryByRole("link", { name: /Buy Direct/ })).not.toBeInTheDocument();
    await user.click(screen.getByText("Holistic Roasters (Biodynamic Coffee)"));
    const buy = screen.getByRole("link", { name: /Buy Direct/ });
    expect(buy).toHaveAttribute("href", "https://biodynamic.coffee?ref=brewsoul");
    expect(buy).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Demeter end-to-end · USDA Organic · EcoCert")).toBeInTheDocument();
    await user.click(screen.getByText("Holistic Roasters (Biodynamic Coffee)"));
    expect(screen.queryByRole("link", { name: /Buy Direct/ })).not.toBeInTheDocument();
  });

  it("clicking Buy Direct doesn't collapse the card", async () => {
    const user = userEvent.setup();
    render(<BiodynamicRoasters />);
    await user.click(screen.getByText("Holistic Roasters (Biodynamic Coffee)"));
    const buy = screen.getByRole("link", { name: /Buy Direct/ });
    buy.addEventListener("click", (e) => e.preventDefault());
    await user.click(buy);
    expect(screen.getByRole("link", { name: /Buy Direct/ })).toBeInTheDocument();
  });

  it.fails("BUG: a roaster card can be opened from the keyboard (it is a clickable <div> with no button role or tab stop)", async () => {
    const user = userEvent.setup();
    render(<BiodynamicRoasters />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("link", { name: /Buy Direct/ })).toBeInTheDocument();
  });
});
