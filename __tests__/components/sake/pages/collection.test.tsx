import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NO_FILTERS, SakeCollection, filterCollection, hasSakePage } from "@/components/sake/pages/collection";
import { SakeProviders, useAesthetic } from "@/components/sake/sake-providers";
import { unifiedSakeDatabase } from "@/lib/content/sake/unified-sake-data";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function AustereToggle() {
  const { toggleAesthetic } = useAesthetic();
  return (
    <button type="button" onClick={toggleAesthetic}>
      toggle look
    </button>
  );
}

const renderPage = () =>
  render(
    <SakeProviders>
      <AustereToggle />
      <SakeCollection />
    </SakeProviders>,
  );

describe("filterCollection", () => {
  it("filters and sorts like the app", () => {
    const all = filterCollection(unifiedSakeDatabase, NO_FILTERS);
    expect(all).toHaveLength(unifiedSakeDatabase.length);
    expect(all[0].eei).toBeGreaterThanOrEqual(all[all.length - 1].eei);
    const byName = filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, sortBy: "name" });
    expect(byName[0].name.localeCompare(byName[1].name)).toBeLessThanOrEqual(0);
    const first = unifiedSakeDatabase[0];
    expect(filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, search: first.name }).some((b) => b.id === first.id)).toBe(true);
    for (const abv of ["low", "standard", "high"]) {
      const r = filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, abv });
      expect(r.every((b) => (abv === "low" ? b.abv < 14 : abv === "high" ? b.abv > 16 : b.abv >= 14 && b.abv <= 16))).toBe(true);
    }
    for (const temp of ["Chilled", "Room Temp", "Warm"]) filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, temp });
    for (const sortBy of ["evi", "price-low", "price-high", "polish", "abv", "qpr"] as const) {
      expect(filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, sortBy })).toHaveLength(unifiedSakeDatabase.length);
    }
    expect(filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, source: "curated" }).every((b) => b.source !== "qpr")).toBe(true);
    expect(filterCollection(unifiedSakeDatabase, { ...NO_FILTERS, source: "qpr" }).every((b) => b.source !== "curated")).toBe(true);
    expect(hasSakePage(qprSakeDatabase[0].id)).toBe(true);
    expect(hasSakePage("no-such-sake")).toBe(false);
  });
});

describe("SakeCollection", () => {
  it("lists 30 bottles, loads more, filters, and opens a bottle's details", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The\s+Collection/ })).toBeInTheDocument();
    expect(screen.getByText(`Showing 30 of ${unifiedSakeDatabase.length} sake (${unifiedSakeDatabase.length} total)`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Compare sakes side-by-side/ })).toHaveAttribute("href", "/sake/compare");

    await user.click(screen.getByRole("button", { name: /Load More/ }));
    expect(screen.getByText(new RegExp(`Showing ${Math.min(60, unifiedSakeDatabase.length)} of`))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Filters & Sort/ }));
    await user.selectOptions(screen.getByLabelText(/ABV Range/), "high");
    const high = unifiedSakeDatabase.filter((b) => b.abv > 16).length;
    expect(screen.getByText(new RegExp(`of ${high} sake`))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear All Filters" }));
    expect(screen.getByText(new RegExp(`of ${unifiedSakeDatabase.length} sake`))).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search" }), "zzzz-nothing");
    expect(screen.getByText("No sake match your filters.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    const qprBottle = filterCollection(unifiedSakeDatabase, NO_FILTERS).find((b) => hasSakePage(b.id))!;
    await user.type(screen.getByRole("textbox", { name: "Search" }), qprBottle.name);
    await user.click(screen.getByText(qprBottle.name, { selector: "span" }).closest("button")!);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: qprBottle.name })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /View Full Details/ })).toHaveAttribute("href", `/sake/bottle/${qprBottle.id}`);
    expect(within(dialog).getByRole("link", { name: /Add to Compare/ })).toHaveAttribute("href", `/sake/compare?ids=${encodeURIComponent(qprBottle.id)}`);
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("hides the sake-page link for curated-only bottles and works in the Austere look", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "toggle look" }));
    expect(screen.getByRole("heading", { level: 2, name: "Sake Classification Guide" })).toBeInTheDocument();
    const curated = unifiedSakeDatabase.find(
      (b) => !hasSakePage(b.id) && unifiedSakeDatabase.filter((o) => o.name === b.name).length === 1,
    );
    if (!curated) return;
    await user.type(screen.getByRole("textbox", { name: "Search" }), curated.name);
    await user.click(screen.getByText(curated.name, { selector: "span" }).closest("button")!);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).queryByRole("link", { name: /View Full Details/ })).toBeNull();
  });
});
