import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TRADE_LISTINGS_KEY, TradeBoard, toTradeListing } from "@/components/soulsmoke/pages/trade-board";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <TradeBoard />
    </SoulsmokeProviders>,
  );
const saved = () => JSON.parse(window.localStorage.getItem(TRADE_LISTINGS_KEY) ?? "[]");

const base = {
  mezcalName: "X",
  producer: "",
  agaveType: "",
  abv: "",
  bottleSize: "750ml",
  condition: "sealed" as const,
  fillLevel: "100%",
  listingType: "both" as const,
  askingPrice: "",
  seekingBottles: "",
  description: "",
  location: "",
};

describe("toTradeListing", () => {
  it("mirrors the server checks", () => {
    expect(toTradeListing({ ...base, mezcalName: " " })).toBeNull();
    expect(toTradeListing({ ...base, condition: "broken" as never })).toBeNull();
    expect(toTradeListing({ ...base, listingType: "gift" as never })).toBeNull();
    expect(toTradeListing({ ...base, askingPrice: "150" })).toMatchObject({ askingPrice: 15000, producer: undefined });
    expect(toTradeListing({ ...base, askingPrice: "abc" })?.askingPrice).toBeUndefined();
  });
});

describe("TradeBoard", () => {
  it("shows the empty board, guidelines and no sign-in or messaging", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Trade Board" })).toBeInTheDocument();
    expect(screen.getByText("No listings yet")).toBeInTheDocument();
    expect(screen.getByText("0 listings")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trading Guidelines" })).toBeInTheDocument();
    expect(screen.queryByText(/Sign in/i)).toBeNull();
    expect(screen.queryByTitle("Contact seller")).toBeNull();
  });

  it("lists a bottle for sale or trade, filters, and deletes it", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "List a Bottle" }));
    expect(screen.getByRole("dialog", { name: "List a Bottle" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "Real Minero Largo" } });
    fireEvent.change(screen.getByLabelText("Producer"), { target: { value: "Real Minero" } });
    fireEvent.change(screen.getByLabelText("Agave Type"), { target: { value: "Largo" } });
    fireEvent.change(screen.getByLabelText("ABV"), { target: { value: "49%" } });
    fireEvent.change(screen.getByLabelText("Bottle Size"), { target: { value: "375ml" } });
    fireEvent.change(screen.getByLabelText("Condition"), { target: { value: "opened" } });
    fireEvent.change(screen.getByLabelText("Fill Level"), { target: { value: "90%" } });
    fireEvent.change(screen.getByLabelText("Asking Price ($)"), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText("What are you seeking?"), { target: { value: "Fane Kantsini" } });
    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Los Angeles, CA" } });
    fireEvent.change(screen.getByLabelText("Additional Notes"), { target: { value: "Stored cool and dark" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Listing" }));

    expect(saved()).toEqual([
      expect.objectContaining({ mezcalName: "Real Minero Largo", condition: "opened", askingPrice: 15000, fillLevel: "90%" }),
    ]);
    expect(screen.getByRole("heading", { level: 3, name: "Real Minero Largo" })).toBeInTheDocument();
    for (const t of ["Real Minero", "opened", "Trade or Sell", "$150", "Fane Kantsini", "Stored cool and dark", "Los Angeles, CA", "90%"]) {
      expect(screen.getAllByText(t, { exact: false }).length).toBeGreaterThan(0);
    }
    expect(screen.getByText("1 listing")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "For Trade" }));
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "For Sale" }));
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All Listings" }));

    fireEvent.click(screen.getByRole("button", { name: "Delete listing for Real Minero Largo" }));
    expect(saved()).toEqual([]);
  });

  it("filters trade-only and sell-only listings, and shows each condition and type", () => {
    window.localStorage.setItem(
      TRADE_LISTINGS_KEY,
      JSON.stringify([
        { id: "1", mezcalName: "Trader", condition: "sealed", listingType: "trade", askingPrice: 9900, createdAt: "" },
        { id: "2", mezcalName: "Seller", condition: "partial", listingType: "sell", seekingBottles: "x", createdAt: "" },
      ]),
    );
    // The page also has two static h3s ("For Sellers", "For Buyers") under the listings.
    const listingNames = () =>
      screen
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent)
        .filter((t) => t !== "For Sellers" && t !== "For Buyers");
    renderPage();
    expect(screen.getByText("Trade Only")).toBeInTheDocument();
    expect(screen.getByText("For Sale", { selector: "span" })).toBeInTheDocument();
    expect(screen.queryByText("$99")).toBeNull();
    expect(screen.queryByText("SEEKING")).toBeNull();
    expect(screen.getByText("partial")).toHaveClass("text-red-400");
    fireEvent.click(screen.getByRole("button", { name: "For Trade" }));
    expect(listingNames()).toEqual(["Trader"]);
    fireEvent.click(screen.getByRole("button", { name: "For Sale" }));
    expect(listingNames()).toEqual(["Seller"]);
  });

  it("hides fields that don't apply, closes with X or Escape, and won't save a blank name", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "List a Bottle" }));
    expect(screen.queryByLabelText("Fill Level")).toBeNull();
    fireEvent.change(screen.getByLabelText("Listing Type"), { target: { value: "trade" } });
    expect(screen.queryByLabelText("Asking Price ($)")).toBeNull();
    fireEvent.change(screen.getByLabelText("Listing Type"), { target: { value: "sell" } });
    expect(screen.queryByLabelText("What are you seeking?")).toBeNull();
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "  " } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Listing" }).closest("form")!);
    expect(saved()).toEqual([]);
    fireEvent.keyDown(window, { key: "a" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "List a Bottle" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
