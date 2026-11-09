import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MezcalQuadrant, accessibilityScore } from "@/components/soulsmoke/pages/mezcal-quadrant";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals, type Mezcal } from "@/lib/content/soulsmoke/mezcal-data";
import { navigation } from "../../../helpers/next";

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <MezcalQuadrant />
    </SoulsmokeProviders>,
  );
}

afterEach(() => window.localStorage.clear());

const first = allMezcals[0];

describe("MezcalQuadrant", () => {
  it("plots every bottle and lists the top 10", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Mezcal Quadrant");
    expect(container.querySelectorAll("button[style]")).toHaveLength(allMezcals.length);
    expect(screen.getByText("THE GRAIL (Top Right)")).toBeInTheDocument();
    expect(screen.getByText("LOWER VALUE")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Save$/ })).toHaveLength(10);
    expect(screen.getByText("Value vs Experience Index")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Home/ })).toHaveAttribute("href", "/soul-smoke");
    expect(container.innerHTML).not.toMatch(/manus/i);
  });

  it("switches views and flavor axes", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Price vs Accessibility/ }));
    expect(screen.getByText("EASY & EXPENSIVE (Top Right)")).toBeInTheDocument();
    expect(screen.getByText("$250+")).toBeInTheDocument();
    expect(screen.getByText("Price vs Accessibility", { selector: "h3" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Flavor Matrix/ }));
    expect(screen.getByText("High smoke / High funk (Top Right)")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("X-Axis:"), { target: { value: "fruit" } });
    fireEvent.change(screen.getByLabelText("Y-Axis:"), { target: { value: "mineral" } });
    expect(screen.getByText("High fruit / High mineral (Top Right)")).toBeInTheDocument();
    expect(screen.getByText("Low fruit + Low mineral")).toBeInTheDocument();
    expect(screen.getByText("TROPICAL")).toBeInTheDocument();
    expect(screen.getByText("Flavor Profile Matrix")).toBeInTheDocument();
  });

  it("filters by market, method and agave", () => {
    const { container } = renderPage();
    const points = () => container.querySelectorAll("button[style]").length;
    fireEvent.change(screen.getByLabelText("Market"), { target: { value: "us" } });
    expect(points()).toBe(allMezcals.filter((m) => m.market === "us" || m.market === "both").length);
    fireEvent.change(screen.getByLabelText("Market"), { target: { value: "all" } });
    fireEvent.change(screen.getByLabelText("Method"), { target: { value: "ancestral" } });
    expect(points()).toBe(allMezcals.filter((m) => m.method === "ancestral").length);
    fireEvent.change(screen.getByLabelText("Method"), { target: { value: "all" } });
    fireEvent.change(screen.getByLabelText("Agave"), { target: { value: first.agave } });
    expect(points()).toBe(allMezcals.filter((m) => m.agave === first.agave).length);
  });

  it("opens a bottle's details from the chart, saves it and closes", () => {
    renderPage();
    const point = screen.getAllByRole("button", { name: `${first.brand} ${first.name}` })[0];
    fireEvent.mouseEnter(point);
    expect(within(point).getByText(first.agave)).toBeInTheDocument();
    fireEvent.mouseLeave(point);
    fireEvent.click(point);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { level: 2 })).toHaveTextContent(first.name);
    expect(within(dialog).getByText("Flavor Profile")).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /Add to Hunt List/ }));
    expect(within(dialog).getByRole("button", { name: /In My Hunt List/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /My List \(1\)/ })).toHaveAttribute("href", "/soul-smoke/my-hunt-list");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the popup with Escape or a click outside", () => {
    renderPage();
    fireEvent.click(screen.getAllByRole("button", { name: `${first.brand} ${first.name}` })[0]);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: `${first.brand} ${first.name}` })[0]);
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("saves from the top-10 list and opens a bottle from it", () => {
    renderPage();
    fireEvent.click(screen.getAllByRole("button", { name: /^Save$/ })[0]);
    expect(screen.getByRole("button", { name: /^Saved$/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("link", { name: /Buy Now/ }).length).toBeGreaterThan(0);
    const buy = screen.getAllByRole("link", { name: /Buy Now/ })[0];
    fireEvent.click(buy);
    expect(screen.queryByRole("dialog")).toBeNull();
    const titleButtons = screen.getAllByRole("heading", { level: 3 }).map((h) => h.querySelector("button")).filter(Boolean);
    fireEvent.click(titleButtons[0]!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getAllByText(/^\$\d+$/)[0].closest(".cursor-pointer")!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("deep-links ?agave= and ?bottle=", () => {
    const withQuote = allMezcals.find((m) => m.expertQuote && m.expertSource && m.whereToBuy?.length)!;
    navigation.searchParams = new URLSearchParams(`agave=${encodeURIComponent(withQuote.agave)}&bottle=${withQuote.id}`);
    renderPage();
    expect(screen.getByLabelText("Agave")).toHaveValue(withQuote.agave);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(withQuote.expertQuote!)).toBeInTheDocument();
    expect(within(dialog).getByText("Where to Find")).toBeInTheDocument();
  });

  it("ignores an unknown ?bottle=", () => {
    navigation.searchParams = new URLSearchParams("bottle=nope");
    renderPage();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("scores accessibility by availability", () => {
    const base = { ...first, price: 40 } as Mezcal;
    expect(accessibilityScore({ ...base, availability: "easy" })).toBe(88);
    expect(accessibilityScore({ ...base, availability: "unicorn" })).toBe(2);
    expect(accessibilityScore({ ...base, availability: "x" as Mezcal["availability"] })).toBe(43);
  });
});
