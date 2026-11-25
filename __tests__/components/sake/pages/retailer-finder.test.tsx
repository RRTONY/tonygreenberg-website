import { afterEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeRetailerFinder, getStatesFromZip } from "@/components/sake/pages/retailer-finder";
import { usRetailers } from "@/lib/content/sake/qpr-data";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("getStatesFromZip", () => {
  it("uses the most specific prefix", () => {
    expect(getStatesFromZip("")).toEqual([]);
    expect(getStatesFromZip("10001")).toEqual(["NY"]);
    expect(getStatesFromZip("94110")).toEqual(["CA"]);
    expect(getStatesFromZip("60601")).toEqual(["IL", "KS", "MO", "NE"]);
  });
});

describe("SakeRetailerFinder", () => {
  afterEach(() => window.history.replaceState({}, "", "/"));

  it("filters retailers by ZIP, type and price and expands one", async () => {
    const user = userEvent.setup();
    renderSake(<SakeRetailerFinder />);
    expect(screen.getByRole("heading", { level: 1, name: /Retailer\s*Finder/ })).toBeInTheDocument();
    expect(screen.getByText(`${usRetailers.length} retailers`)).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "ZIP code" }), "100ab01{Enter}");
    expect(screen.getByRole("textbox", { name: "ZIP code" })).toHaveValue("10001");
    expect(screen.getByText("Showing retailers serving: NY")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Search" }));

    const group = screen.getByRole("group", { name: "Store type" });
    await user.click(within(group).getByRole("button", { name: /^Online$/ }));
    expect(within(group).getByRole("button", { name: /^Online$/ })).toHaveAttribute("aria-pressed", "true");
    const online = usRetailers.filter((r) => r.type === "online").length;
    expect(screen.getByText(`${online} retailers`)).toBeInTheDocument();
    await user.click(within(group).getByRole("button", { name: "All" }));

    await user.click(screen.getByRole("button", { name: "Luxury" }));
    await user.click(screen.getByRole("button", { name: "All Prices" }));

    const first = screen.getAllByRole("button", { expanded: false })[0];
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Serves:")).toBeInTheDocument();
    await user.click(first);

    await user.clear(screen.getByRole("textbox", { name: "ZIP code" }));
    expect(screen.queryByText(/Showing retailers serving/)).toBeNull();
  });

  it("shows the empty state and its online button", async () => {
    const user = userEvent.setup();
    renderSake(<SakeRetailerFinder />);
    const group = screen.getByRole("group", { name: "Store type" });
    const types = new Set(usRetailers.map((r) => `${r.type}|${r.priceLevel}`));
    const levels = ["budget", "mid", "premium", "luxury"];
    const kinds = ["online", "physical", "both"] as const;
    const empty = kinds.flatMap((k) => levels.map((l) => [k, l] as const)).find(([k, l]) => !types.has(`${k}|${l}`));
    if (!empty) return;
    const labels: Record<string, RegExp> = { online: /^Online$/, physical: /^Physical Store$/, both: /^Online \+ Store$/ };
    const priceNames: Record<string, string> = { budget: "Budget-Friendly", mid: "Mid-Range", premium: "Premium", luxury: "Luxury" };
    await user.click(within(group).getByRole("button", { name: labels[empty[0]] }));
    await user.click(screen.getByRole("button", { name: priceNames[empty[1]] }));
    expect(screen.getByText("No retailers found for this area")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show Online Retailers" }));
  });

  it("shows the ?sake= banner and clears it", async () => {
    window.history.replaceState({}, "", "/sake/retailer-finder?sake=Dassai%2023");
    const user = userEvent.setup();
    renderSake(<SakeRetailerFinder />);
    expect(screen.getByText("Dassai 23")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.queryByText("Dassai 23")).toBeNull();
    expect(window.location.search).toBe("");
  });

  it("uses the Austere look", async () => {
    const user = userEvent.setup();
    renderSake(<SakeRetailerFinder />);
    await user.click(screen.getByTestId("toggle-austere"));
    expect(screen.getByText("Find Sake Near You").className).toContain("text-red-800");
  });
});
