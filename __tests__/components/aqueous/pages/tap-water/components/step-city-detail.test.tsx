import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TapWater } from "@/components/aqueous/pages/tap-water/tap-water";
import { StepCityDetail } from "@/components/aqueous/pages/tap-water/components/step-city-detail";
import { useTapWater } from "@/components/aqueous/pages/tap-water/hook/use-tap-water";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => null }));

async function openCity(query: string, name: RegExp) {
  const user = userEvent.setup();
  render(<TapWater />);
  await user.type(screen.getByRole("textbox"), query);
  await user.click(screen.getByRole("button", { name }));
  return user;
}

describe("StepCityDetail", () => {
  it("shows a critical city's banner, violations, contaminants, filters and report link", async () => {
    await openCity("Flint", /Flint, Michigan/);
    expect(screen.getByText(/CRITICAL: A reverse osmosis filter is essential/)).toHaveClass("text-red-800");
    expect(screen.getByText("Active Violations")).toBeInTheDocument();
    expect(screen.getByText(/Population served:/)).toHaveTextContent("ZIP: 48502");
    expect(screen.getByRole("heading", { name: "Contaminants Found" })).toBeInTheDocument();
    expect(screen.getAllByText("danger").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /Recommended Filters/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Consumer Confidence Report/ })).toHaveAttribute("target", "_blank");
  });

  it("uses the high and moderate banners, and none for a good score", async () => {
    const user = await openCity("Los Angeles", /Los Angeles, California/);
    expect(screen.getByText(/HIGH PRIORITY/)).toHaveClass("text-orange-800");
    await user.click(screen.getByRole("button", { name: "Back to results" }));
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Santa Monica");
    await user.click(screen.getByRole("button", { name: /Santa Monica, California/ }));
    expect(screen.getByText(/MODERATE:/)).toHaveClass("text-amber-800");
    await user.click(screen.getByRole("button", { name: "Back to results" }));
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Seattle");
    await user.click(screen.getByRole("button", { name: /Seattle, Washington/ }));
    expect(screen.queryByText(/CRITICAL|HIGH PRIORITY|MODERATE/)).toBeNull();
    expect(screen.getAllByText("caution").length).toBeGreaterThan(0);
  });

  it("prints missing EPA and EWG limits", async () => {
    await openCity("Fresno", /Fresno, California/);
    expect(screen.getByText("No limit")).toBeInTheDocument();
  });

  it("prints a missing EWG guideline", async () => {
    await openCity("Pittsburgh", /Pittsburgh, Pennsylvania/);
    expect(screen.getByText("No guideline")).toBeInTheDocument();
  });

  it("starts the survey personalised for the city", async () => {
    const user = await openCity("Flint", /Flint, Michigan/);
    await user.click(screen.getByRole("button", { name: /Take the Water Profile Survey/ }));
    expect(screen.getByText("Personalized for Flint, Michigan")).toBeInTheDocument();
  });

  it("falls back to the results when no city is selected", () => {
    function Harness() {
      const tap = useTapWater();
      return <StepCityDetail tap={tap} />;
    }
    const { container } = render(<Harness />);
    expect(container).toBeEmptyDOMElement();
  });
});
