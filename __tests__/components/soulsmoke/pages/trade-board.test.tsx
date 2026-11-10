import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TradeBoard, toTradeListing } from "@/components/soulsmoke/pages/trade-board";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import type { PublicTradeListing } from "@/app/soul-smoke/actions";

const actions = vi.hoisted(() => ({
  listTradeListings: vi.fn(),
  createTradeListing: vi.fn(),
  deleteTradeListing: vi.fn(),
  sendTradeMessage: vi.fn(),
}));
vi.mock("@/app/soul-smoke/actions", () => actions);

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <TradeBoard />
    </SoulsmokeProviders>,
  );

const listing = (over: Partial<PublicTradeListing>): PublicTradeListing => ({
  id: "1",
  mezcalName: "Bottle",
  condition: "sealed",
  listingType: "both",
  createdAt: "2026-11-10T00:00:00Z",
  isMine: false,
  ...over,
});

const board = (listings: PublicTradeListing[], signedIn = true) =>
  actions.listTradeListings.mockResolvedValue({ ok: true, data: { listings, signedIn } });

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

// The page also has two static h3s ("For Sellers", "For Buyers") under the listings.
const listingNames = () =>
  screen
    .getAllByRole("heading", { level: 3 })
    .map((h) => h.textContent)
    .filter((t) => t !== "For Sellers" && t !== "For Buyers");

beforeEach(() => {
  for (const fn of Object.values(actions)) fn.mockReset();
});

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
  it("shows a spinner while loading, then the sign-in box for visitors who aren't signed in", async () => {
    let resolve!: (v: unknown) => void;
    actions.listTradeListings.mockReturnValue(new Promise((r) => (resolve = r)));
    renderPage();
    expect(screen.getByRole("status", { name: "Loading listings" })).toBeInTheDocument();
    expect(screen.queryByText(/Loading\.\.\./)).toBeNull();
    resolve({ ok: true, data: { listings: [listing({ mezcalName: "Theirs" })], signedIn: false } });

    expect(await screen.findByText("Sign in to list your bottles or contact sellers")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In to Trade" })).toHaveAttribute(
      "href",
      "/login?next=%2Fsoul-smoke%2Ftrade-board",
    );
    expect(screen.queryByRole("button", { name: "List a Bottle" })).toBeNull();
    expect(screen.queryByTitle("Contact seller")).toBeNull();
    expect(screen.queryByTitle("Delete listing")).toBeNull();
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trading Guidelines" })).toBeInTheDocument();
  });

  it("shows the board's error when it can't load", async () => {
    actions.listTradeListings.mockResolvedValue({ ok: false, error: "Try again" });
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("Try again");
    expect(screen.queryByText("Sign in to list your bottles or contact sellers")).toBeNull();
  });

  it("ignores a board answer that arrives after the page closed", async () => {
    let resolve!: (v: unknown) => void;
    actions.listTradeListings.mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = renderPage();
    unmount();
    resolve({ ok: true, data: { listings: [], signedIn: true } });
    await Promise.resolve();
    expect(actions.listTradeListings).toHaveBeenCalledTimes(1);
  });

  it("lets a member list a bottle, filter, and delete their own listing", async () => {
    board([]);
    renderPage();
    expect(await screen.findByText("No listings yet")).toBeInTheDocument();
    expect(screen.queryByText("Sign in to list your bottles or contact sellers")).toBeNull();

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

    const saved = listing({
      id: "7",
      mezcalName: "Real Minero Largo",
      producer: "Real Minero",
      agaveType: "Largo",
      abv: "49%",
      bottleSize: "375ml",
      condition: "opened",
      fillLevel: "90%",
      askingPrice: 15000,
      seekingBottles: "Fane Kantsini",
      description: "Stored cool and dark",
      location: "Los Angeles, CA",
      isMine: true,
    });
    let finish!: (v: unknown) => void;
    actions.createTradeListing.mockReturnValue(new Promise((r) => (finish = r)));
    fireEvent.click(screen.getByRole("button", { name: "Create Listing" }));
    expect(screen.getByRole("button", { name: "Create Listing" })).toBeDisabled();
    // A second submit while saving does nothing.
    fireEvent.submit(screen.getByRole("button", { name: "Create Listing" }).closest("form")!);
    expect(actions.createTradeListing).toHaveBeenCalledTimes(1);
    expect(actions.createTradeListing).toHaveBeenCalledWith(
      expect.objectContaining({ mezcalName: "Real Minero Largo", condition: "opened", askingPrice: 15000, fillLevel: "90%" }),
    );
    expect(actions.createTradeListing.mock.calls[0][0]).not.toHaveProperty("id");
    finish({ ok: true, data: saved });

    expect(await screen.findByRole("heading", { level: 3, name: "Real Minero Largo" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
    for (const t of ["Real Minero", "opened", "Trade or Sell", "$150", "Fane Kantsini", "Stored cool and dark", "Los Angeles, CA", "90%", "You"]) {
      expect(screen.getAllByText(t, { exact: false }).length).toBeGreaterThan(0);
    }
    expect(screen.queryByTitle("Contact seller")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "For Trade" }));
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "For Sale" }));
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All Listings" }));

    actions.deleteTradeListing.mockResolvedValue({ ok: true, data: null });
    fireEvent.click(screen.getByRole("button", { name: "Delete listing for Real Minero Largo" }));
    expect(await screen.findByText("No listings yet")).toBeInTheDocument();
    expect(actions.deleteTradeListing).toHaveBeenCalledWith("7");
  });

  it("shows a save error in the form, and a delete error on the board", async () => {
    board([listing({ id: "3", mezcalName: "Mine", isMine: true })]);
    renderPage();
    await screen.findByRole("heading", { level: 3, name: "Mine" });

    fireEvent.click(screen.getByRole("button", { name: "List a Bottle" }));
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "Another" } });
    actions.createTradeListing.mockResolvedValue({ ok: false, error: "Too many" });
    fireEvent.click(screen.getByRole("button", { name: "Create Listing" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    actions.deleteTradeListing.mockResolvedValue({ ok: false, error: "Could not delete" });
    fireEvent.click(screen.getByRole("button", { name: "Delete listing for Mine" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not delete");
    expect(screen.getByRole("heading", { level: 3, name: "Mine" })).toBeInTheDocument();
  });

  it("goes back to the sign-in box when the session has ended", async () => {
    board([listing({ id: "3", mezcalName: "Mine", isMine: true })]);
    renderPage();
    await screen.findByRole("heading", { level: 3, name: "Mine" });
    fireEvent.click(screen.getByRole("button", { name: "List a Bottle" }));
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "Another" } });
    actions.createTradeListing.mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    fireEvent.click(screen.getByRole("button", { name: "Create Listing" }));
    expect(await screen.findByText("Sign in to list your bottles or contact sellers")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByRole("button", { name: "List a Bottle" })).toBeNull();
  });

  it("signs out on a delete answer that says so", async () => {
    board([listing({ id: "3", mezcalName: "Mine", isMine: true })]);
    renderPage();
    await screen.findByRole("heading", { level: 3, name: "Mine" });
    actions.deleteTradeListing.mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    fireEvent.click(screen.getByRole("button", { name: "Delete listing for Mine" }));
    expect(await screen.findByText("Sign in to list your bottles or contact sellers")).toBeInTheDocument();
  });

  it("lets a member message another member's listing", async () => {
    board([listing({ id: "5", mezcalName: "Theirs" })]);
    renderPage();
    await screen.findByRole("heading", { level: 3, name: "Theirs" });
    expect(screen.queryByTitle("Delete listing")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Contact seller about Theirs" }));
    const dialog = screen.getByRole("dialog", { name: "Contact Seller" });
    expect(dialog).toHaveTextContent("About: Theirs");
    expect(dialog).toHaveTextContent("The seller gets your message and your email address so they can reply.");
    const send = screen.getByRole("button", { name: "Send Message" });
    expect(send).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "  Still have it?  " } });
    actions.sendTradeMessage.mockResolvedValueOnce({ ok: false, error: "This listing is no longer available." });
    fireEvent.click(send);
    expect(await screen.findByRole("alert")).toHaveTextContent("This listing is no longer available.");
    expect(actions.sendTradeMessage).toHaveBeenCalledWith({ listingId: "5", message: "Still have it?" });

    let finish!: (v: unknown) => void;
    actions.sendTradeMessage.mockReturnValueOnce(new Promise((r) => (finish = r)));
    fireEvent.click(send);
    expect(send).toBeDisabled();
    finish({ ok: true, data: null });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    // Reopening starts with an empty message; X and Escape close it.
    fireEvent.click(screen.getByRole("button", { name: "Contact seller about Theirs" }));
    expect(screen.getByLabelText("Message")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Contact seller about Theirs" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("returns to the sign-in box when a message answer says the session ended", async () => {
    board([listing({ id: "5", mezcalName: "Theirs" })]);
    renderPage();
    await screen.findByRole("heading", { level: 3, name: "Theirs" });
    fireEvent.click(screen.getByRole("button", { name: "Contact seller about Theirs" }));
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hi" } });
    actions.sendTradeMessage.mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByText("Sign in to list your bottles or contact sellers")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("filters trade-only and sell-only listings, and shows each condition and type", async () => {
    board(
      [
        listing({ id: "1", mezcalName: "Trader", condition: "sealed", listingType: "trade", askingPrice: 9900 }),
        listing({ id: "2", mezcalName: "Seller", condition: "partial", listingType: "sell", seekingBottles: "x" }),
      ],
      false,
    );
    renderPage();
    expect(await screen.findByText("Trade Only")).toBeInTheDocument();
    expect(screen.getByText("For Sale", { selector: "span" })).toBeInTheDocument();
    expect(screen.queryByText("$99")).toBeNull();
    expect(screen.queryByText("SEEKING")).toBeNull();
    expect(screen.getByText("partial")).toHaveClass("text-red-400");
    fireEvent.click(screen.getByRole("button", { name: "For Trade" }));
    expect(listingNames()).toEqual(["Trader"]);
    fireEvent.click(screen.getByRole("button", { name: "For Sale" }));
    expect(listingNames()).toEqual(["Seller"]);
  });

  it("hides fields that don't apply, closes with X or Escape, and won't save a blank name", async () => {
    board([]);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "List a Bottle" }));
    expect(screen.queryByLabelText("Fill Level")).toBeNull();
    fireEvent.change(screen.getByLabelText("Listing Type"), { target: { value: "trade" } });
    expect(screen.queryByLabelText("Asking Price ($)")).toBeNull();
    fireEvent.change(screen.getByLabelText("Listing Type"), { target: { value: "sell" } });
    expect(screen.queryByLabelText("What are you seeking?")).toBeNull();
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "  " } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Listing" }).closest("form")!);
    expect(actions.createTradeListing).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: "a" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "List a Bottle" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
