import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HealthTicker } from "@/components/brewsoul/health-ticker";

const fact = () => screen.getByText(/^“.*”$/).textContent;

describe("HealthTicker", () => {
  it("starts on the mortality fact", () => {
    render(<HealthTicker />);
    expect(fact()).toContain("3-5 cups/day = 12-15% lower all-cause mortality");
  });

  it("steps through all 8 facts and wraps back to the first", async () => {
    const user = userEvent.setup();
    render(<HealthTicker />);
    const first = fact();
    const seen = new Set([first]);
    for (let i = 0; i < 7; i++) {
      await user.click(screen.getByRole("button", { name: /Next Fact/ }));
      seen.add(fact());
    }
    expect(seen.size).toBe(8);
    expect(fact()).toContain("25% lower risk of Type 2 diabetes");
    await user.click(screen.getByRole("button", { name: /Next Fact/ }));
    expect(fact()).toBe(first);
  });
});
