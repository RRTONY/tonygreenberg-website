import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TapWater } from "@/components/aqueous/pages/tap-water/tap-water";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => <div data-testid="floating-share" /> }));

describe("TapWater", () => {
  it("renders the header, the search controls and the floating share", () => {
    render(<TapWater />);
    expect(screen.getByRole("heading", { level: 1, name: "Tap Water Lookup" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("floating-share")).toBeInTheDocument();
  });

  it("hides the search controls once a step other than search shows", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    await user.click(screen.getByRole("button", { name: /Take the Water Profile Survey/ }));
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("heading", { name: "Water Profile Survey" })).toBeInTheDocument();
    // The header itself stays.
    expect(screen.getByRole("heading", { level: 1, name: "Tap Water Lookup" })).toBeInTheDocument();
  });
});
