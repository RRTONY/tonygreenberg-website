import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { FlavorFinder, flavorProfiles } from "@/components/liquidsun/pages/flavor-finder";

vi.mock("@/app/liquid-sun/actions", () => ({ getLiquidsunMember: vi.fn() }));

describe("FlavorFinder", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("spins the wheel a quarter turn per click and swaps the profile card after it slides out", () => {
    render(<FlavorFinder />);
    expect(screen.getByRole("heading", { level: 1, name: "The Compass" })).toBeInTheDocument();
    expect(screen.getByText(flavorProfiles[0].description)).toBeInTheDocument();
    const spin = screen.getByRole("button", { name: "Spin the wheel" });

    fireEvent.click(spin);
    expect(screen.getByTestId("compass-wheel").style.transform).toBe("rotate(90deg)");
    expect(screen.getByText(flavorProfiles[0].description).closest("[aria-live]")).toHaveClass("animate-out");
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText(flavorProfiles[1].description)).toBeInTheDocument();
    for (const bottle of flavorProfiles[1].bottles) expect(screen.getByText(bottle)).toBeInTheDocument();

    for (let i = 0; i < 3; i++) {
      fireEvent.click(spin);
      act(() => vi.advanceTimersByTime(300));
    }
    expect(screen.getByTestId("compass-wheel").style.transform).toBe("rotate(360deg)");
    expect(screen.getByText(flavorProfiles[0].description)).toBeInTheDocument();
  });
});
