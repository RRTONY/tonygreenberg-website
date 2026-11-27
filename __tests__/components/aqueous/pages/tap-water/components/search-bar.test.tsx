import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TapWater } from "@/components/aqueous/pages/tap-water/tap-water";
import { tapWaterDatabase } from "@/lib/content/aqueous/water-data";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => null }));

afterEach(() => {
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
});

describe("SearchBar", () => {
  it("types a search and offers browse-all only while the box is empty", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    const browse = screen.getByRole("button", { name: `Browse all ${tapWaterDatabase.length} cities` });
    await user.type(screen.getByRole("textbox", { name: /Enter city, state, or ZIP code/ }), "Flint");
    expect(browse).not.toBeInTheDocument();
    expect(screen.getByText("1 city found")).toBeInTheDocument();
  });

  it("browse-all lists every city and then hides itself", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    await user.click(screen.getByRole("button", { name: /Browse all/ }));
    expect(screen.getByText(`${tapWaterDatabase.length} cities found`)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Browse all/ })).toBeNull();
  });

  it("spins the location icon while locating and shows a location error", async () => {
    let fail: () => void = () => {};
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: vi.fn((_ok, f: () => void) => (fail = f)) },
    });
    const user = userEvent.setup();
    const { container, rerender } = render(<TapWater />);
    const locate = screen.getByRole("button", { name: "Use my location" });
    await user.click(locate);
    expect(locate).toBeDisabled();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    fail();
    rerender(<TapWater />);
    expect(await screen.findByText(/Location access denied/)).toHaveClass("text-red-500");
    expect(locate).toBeEnabled();
  });
});
