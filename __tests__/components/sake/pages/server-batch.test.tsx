import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { renderSake } from "@tests/components/sake/sake-test-utils";
import { SakeSubscription } from "@/components/sake/pages/subscription";
import { SakeMyReviews } from "@/components/sake/pages/my-reviews";
import { SakeDealAlerts } from "@/components/sake/pages/deal-alerts";
import { SakeScanner } from "@/components/sake/pages/sake-scanner";
import { SakeMenuAnalyzer } from "@/components/sake/pages/menu-analyzer";
import * as actions from "@/app/sake/actions";
import { navigation } from "@tests/helpers/next";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));
vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(),
  getMySubscription: vi.fn(async () => null),
  startSubscriptionCheckout: vi.fn(),
  getMyReviews: vi.fn(),
  getMyAlerts: vi.fn(),
  getMyNotifications: vi.fn(),
  getMyFavorites: vi.fn(),
  createAlert: vi.fn(),
  updateAlert: vi.fn(async () => ({ ok: true, data: null })),
  deleteAlert: vi.fn(async () => ({ ok: true, data: null })),
  markNotificationsRead: vi.fn(async () => ({ ok: true, data: null })),
  toggleFavorite: vi.fn(async () => ({ ok: true, data: { favorited: false } })),
}));

const SIGNED_OUT = { signedIn: false, id: null, email: null, name: null, isAdmin: false };
const SIGNED_IN = { signedIn: true, id: "u1", email: "mia@example.com", name: "Mia", isAdmin: false };
const sake = qprSakeDatabase[0];
const member = (m: typeof SIGNED_IN | typeof SIGNED_OUT) => vi.mocked(actions.getSakeMember).mockResolvedValue(m);

beforeEach(() => {
  vi.clearAllMocks();
  member(SIGNED_OUT);
});
afterEach(() => vi.unstubAllGlobals());

describe("SakeSubscription", () => {
  it("shows the three boxes and says Coming Soon while ordering is closed", async () => {
    renderSake(<SakeSubscription checkoutOpen={false} testMode={false} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Sake Subscription");
    expect(screen.getByText("Explorer Box")).toBeInTheDocument();
    expect(screen.getAllByText("Coming Soon")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: /Subscribe Now/ })).toBeNull();
    expect(screen.queryByText(/Test Mode/)).toBeNull();
  });

  it("sends signed-out visitors to sign in, and members to Stripe", async () => {
    const user = userEvent.setup();
    const { unmount } = renderSake(<SakeSubscription checkoutOpen testMode />);
    expect(screen.getByText(/Test Mode/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("button", { name: /Subscribe Now/ })[0]).toBeEnabled());
    await user.click(screen.getAllByRole("button", { name: /Subscribe Now/ })[0]);
    expect(navigation.router.push).toHaveBeenCalledWith("/login?next=%2Fsake%2Fsubscription");
    unmount();

    member(SIGNED_IN);
    vi.mocked(actions.getMySubscription).mockResolvedValue({ planTier: "explorer", status: "active", currentPeriodEnd: null, cancelAtPeriodEnd: false });
    vi.mocked(actions.startSubscriptionCheckout).mockResolvedValue({ ok: false, error: "You already have an active subscription." });
    renderSake(<SakeSubscription checkoutOpen testMode={false} />);
    expect(await screen.findByText(/You have an active subscription/)).toHaveTextContent("Explorer");
    await waitFor(() => expect(screen.getAllByRole("button", { name: /Subscribe Now/ })[1]).toBeEnabled());
    await user.click(screen.getAllByRole("button", { name: /Subscribe Now/ })[1]);
    expect(actions.startSubscriptionCheckout).toHaveBeenCalledWith("sub-connoisseur");
    expect(toast.error).toHaveBeenCalledWith("You already have an active subscription.");
  });

  it("toasts the return from Stripe", () => {
    window.history.pushState({}, "", "/sake/subscription?success=true");
    renderSake(<SakeSubscription checkoutOpen testMode={false} />);
    expect(toast.success).toHaveBeenCalled();
    window.history.pushState({}, "", "/");
  });
});

describe("SakeMyReviews", () => {
  it("asks signed-out visitors to sign in", async () => {
    renderSake(<SakeMyReviews />);
    expect(await screen.findByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login?next=%2Fsake%2Fmy-reviews");
  });

  it("lists, filters and sorts the member's reviews", async () => {
    member(SIGNED_IN);
    const base = { userName: "Mia", sakeId: sake.id, servingTemp: null, purchaseLocation: null, upvotedByMe: false, mine: true, flavorTags: [] as string[] };
    vi.mocked(actions.getMyReviews).mockResolvedValue({
      ok: true,
      data: [
        { ...base, id: 1, sakeName: "Older Five", rating: 5, tastingNote: "Lovely", flavorTags: ["pear"], pricePaidCents: 4200, wouldBuyAgain: true, upvotes: 3, createdAt: "2026-01-01T00:00:00Z", servingTemp: "Chilled", purchaseLocation: "Tippsy" },
        { ...base, id: 2, sakeName: "Newer Two", rating: 2, tastingNote: null, pricePaidCents: null, wouldBuyAgain: false, upvotes: 0, createdAt: "2026-06-01T00:00:00Z" },
      ],
    });
    const user = userEvent.setup();
    renderSake(<SakeMyReviews />);
    expect(await screen.findByText("Older Five")).toBeInTheDocument();
    expect(screen.getByText("Mia's sake journey")).toBeInTheDocument();
    expect(screen.getByText("3.5")).toBeInTheDocument();
    expect(screen.getByText("$42.00")).toBeInTheDocument();
    expect(screen.getAllByRole("article")[0]).toHaveTextContent("Newer Two");
    await user.selectOptions(screen.getByLabelText("Sort reviews"), "highest");
    expect(screen.getAllByRole("article")[0]).toHaveTextContent("Older Five");
    await user.selectOptions(screen.getByLabelText("Filter by rating"), "3");
    expect(screen.getByText("No reviews match this filter.")).toBeInTheDocument();
  });

  it("shows the empty journal", async () => {
    member(SIGNED_IN);
    vi.mocked(actions.getMyReviews).mockResolvedValue({ ok: false, error: "x" });
    renderSake(<SakeMyReviews />);
    expect(await screen.findByText("No Tasting Notes Yet")).toBeInTheDocument();
  });
});

describe("SakeDealAlerts", () => {
  it("previews the feature for signed-out visitors", async () => {
    renderSake(<SakeDealAlerts />);
    expect(await screen.findByRole("link", { name: "Sign In to Set Alerts" })).toHaveAttribute("href", "/login?next=%2Fsake%2Fdeal-alerts");
    expect(screen.getByText("Price Drop Alerts")).toBeInTheDocument();
  });

  it("creates, pauses and deletes alerts, and shows notices and tracked sakes", async () => {
    member(SIGNED_IN);
    const alert = { id: 1, alertType: "all" as const, sakeId: null, sakeName: null, sakeCategory: null, priceThreshold: "40.00", minDiscountPct: 10, notifyInApp: true, notifyEmail: false, isActive: true, zipCode: "10001", createdAt: "x" };
    vi.mocked(actions.getMyAlerts).mockResolvedValue({ ok: true, data: [alert] });
    vi.mocked(actions.getMyNotifications).mockResolvedValue({
      ok: true,
      data: { unreadCount: 1, notifications: [{ id: 4, sakeId: sake.id, sakeName: "Notice Sake", retailerName: "Tippsy", newPrice: "30.00", oldPrice: "40.00", discountPct: 25, isRead: false, createdAt: "x" }] },
    });
    vi.mocked(actions.getMyFavorites).mockResolvedValue({ ok: true, data: [{ id: 2, sakeId: sake.id, sakeName: "Tracked Sake", targetPrice: "25.00", createdAt: "x" }] });
    vi.mocked(actions.createAlert).mockResolvedValue({ ok: false, error: "Server said no." });
    const user = userEvent.setup();
    renderSake(<SakeDealAlerts />);

    expect(await screen.findByText("Max $40.00 · Min 10% off · ZIP: 10001")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Active" }));
    expect(actions.updateAlert).toHaveBeenCalledWith(1, { isActive: false });
    await user.click(screen.getByRole("button", { name: "Delete alert" }));
    expect(actions.deleteAlert).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: /New Alert/ }));
    await user.click(screen.getByRole("button", { name: "Specific Sake" }));
    await user.click(screen.getByRole("button", { name: /Create Alert/ }));
    expect(await screen.findByText("Please choose a sake.")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Select Sake"), sake.id);
    await user.click(screen.getByRole("button", { name: /Create Alert/ }));
    await waitFor(() => expect(actions.createAlert).toHaveBeenCalledWith(expect.objectContaining({ alertType: "specific", sakeId: sake.id })));
    expect(await screen.findByText("Server said no.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Notifications/ }));
    expect(screen.getByText("Notice Sake")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mark as read" }));
    expect(actions.markNotificationsRead).toHaveBeenCalledWith({ notificationIds: [4] });
    await user.click(screen.getByRole("button", { name: /Mark All Read/ }));
    expect(actions.markNotificationsRead).toHaveBeenCalledWith({ markAll: true });

    await user.click(screen.getByRole("tab", { name: /Favorites/ }));
    expect(screen.getByText("Target: $25.00")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View & Buy/ })).toHaveAttribute("href", `/sake/bottle/${sake.id}`);
    await user.click(screen.getByRole("button", { name: "Stop tracking" }));
    expect(actions.toggleFavorite).toHaveBeenCalledWith(sake.id);
  });
});

describe("SakeScanner", () => {
  it("rejects a non-image, then identifies a label photo", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ result: { name: sake.name, nameJa: sake.nameJa, brewery: "B", breweryJa: "B", prefecture: "P", type: "Junmai", ricePolishRatio: 50, abv: 16, estimatedRetailUS: 40, estimatedRetailJapan: 20, flavorNotes: ["melon"], servingTemp: "Chilled", pairings: ["Sushi"], description: "Good.", confidence: "high" } })),
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup({ applyAccept: false });
    const { container } = renderSake(<SakeScanner />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(["x"], "notes.txt", { type: "text/plain" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please upload an image file");
    await user.upload(input, new File(["x"], "label.png", { type: "image/png" }));
    await user.click(await screen.findByRole("button", { name: /Identify This Sake/ }));
    expect(await screen.findByText("QPR Database Match!")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/sake/scanner", expect.objectContaining({ method: "POST" }));
    expect(screen.getByRole("link", { name: "View & Buy" })).toHaveAttribute("href", `/sake/bottle/${sake.id}`);
    await user.click(screen.getByRole("button", { name: /New Scan/ }));
    expect(screen.getByRole("button", { name: /Upload a Sake Label Photo/ })).toBeInTheDocument();
  });

  it("shows the server's message when identification fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Too blurry." }), { status: 422 })));
    const user = userEvent.setup();
    const { container } = renderSake(<SakeScanner />);
    await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, new File(["x"], "l.png", { type: "image/png" }));
    await user.click(await screen.findByRole("button", { name: /Identify This Sake/ }));
    expect(await screen.findByText("Too blurry.")).toBeInTheDocument();
  });
});

describe("SakeMenuAnalyzer", () => {
  it("looks up retail prices, analyses rows and names the best value", async () => {
    const analysis = (markupMultiple: number) => ({ retailPriceUS: 40, retailPriceJapan: 20, servingSizeML: 300, pricePerML: 0.2, retailPerML: 0.05, markupMultiple, verdict: "great_value", explanation: "Fair.", sakeType: "Junmai", qualityTier: "mid" });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ analysis: analysis(3.1) })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ analysis: analysis(1.8) })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "Nope." }), { status: 502 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderSake(<SakeMenuAnalyzer />);

    await user.type(screen.getByLabelText("Quick Retail Price Lookup"), sake.name.slice(0, 6));
    expect(screen.getAllByRole("link", { name: new RegExp(sake.name.slice(0, 6)) })[0]).toHaveAttribute("href", expect.stringContaining("/sake/bottle/"));

    expect(screen.getByText(/Restaurants typically mark up sake/)).not.toBeVisible();
    await user.click(screen.getByRole("button", { name: "Markup Guide" }));
    expect(screen.getByText(/Restaurants typically mark up sake/)).toBeVisible();

    await user.type(screen.getAllByLabelText("Sake name")[0], "Dassai 45");
    await user.type(screen.getAllByLabelText("Menu price")[0], "60");
    await user.click(screen.getByRole("button", { name: /Add Item/ }));
    await user.type(screen.getAllByLabelText("Sake name")[1], "House");
    await user.type(screen.getAllByLabelText("Menu price")[1], "20");
    await user.click(screen.getByRole("button", { name: /Analyze All/ }));
    expect(await screen.findByText("BEST VALUE ON THIS MENU")).toBeInTheDocument();
    expect(screen.getAllByText("GREAT VALUE")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /Add Item/ }));
    await user.type(screen.getAllByLabelText("Sake name")[2], "X");
    await user.type(screen.getAllByLabelText("Menu price")[2], "9");
    await user.click(screen.getAllByRole("button", { name: /^Analyze$/ })[2]);
    expect(await screen.findByText("Nope.")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Remove item" })[2]);
    expect(screen.getAllByLabelText("Sake name")).toHaveLength(2);
  });
});

describe("server batch: remaining branches", () => {
  it("scanner: drag and drop, the size limit and photo shrinking", async () => {
    const bitmap = { width: 3000, height: 1500, close: vi.fn() };
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));
    const ctx = { drawImage: vi.fn() };
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as never);
    const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,SMALL");
    const fetchMock = vi.fn().mockRejectedValue(new Error(""));
    vi.stubGlobal("fetch", fetchMock);
    const { fireEvent } = await import("@testing-library/react");
    renderSake(<SakeScanner />);
    const zone = screen.getByRole("button", { name: /Upload a Sake Label Photo/ });
    fireEvent.dragOver(zone);
    expect(zone.className).toContain("border-[#c9a227]/30");
    fireEvent.dragLeave(zone);
    const big = new File(["x"], "big.png", { type: "image/png" });
    Object.defineProperty(big, "size", { value: 11 * 1024 * 1024 });
    fireEvent.drop(zone, { dataTransfer: { files: [big] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Image must be under 10MB");
    fireEvent.drop(zone, { dataTransfer: { files: [new File(["x"], "ok.png", { type: "image/png" })] } });
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Identify This Sake/ }));
    expect(await screen.findByText("Failed to identify sake. Please try again.")).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ imageBase64: "data:image/jpeg;base64,SMALL" });
    expect(bitmap.close).toHaveBeenCalled();
    getContext.mockRestore();
    toDataURL.mockRestore();
  });

  it("subscription: goes to Stripe on success and reports a thrown error", async () => {
    member(SIGNED_IN);
    const assign = vi.fn();
    const original = window.location;
    Object.defineProperty(window, "location", { configurable: true, value: { ...original, assign, search: "?cancelled=true" } });
    vi.mocked(actions.startSubscriptionCheckout).mockResolvedValueOnce({ ok: true, data: { url: "https://checkout.stripe.com/x" } }).mockRejectedValueOnce(new Error("x"));
    const user = userEvent.setup();
    const first = renderSake(<SakeSubscription checkoutOpen testMode={false} />);
    expect(toast.info).toHaveBeenCalledWith("Subscription checkout cancelled.");
    await waitFor(() => expect(screen.getAllByRole("button", { name: /Subscribe Now/ })[0]).toBeEnabled());
    await user.click(screen.getAllByRole("button", { name: /Subscribe Now/ })[0]);
    expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/x");
    // Leaving for Stripe keeps the buttons disabled; a fresh visit tries again and fails.
    first.unmount();
    renderSake(<SakeSubscription checkoutOpen testMode={false} />);
    await waitFor(() => expect(screen.getAllByRole("button", { name: /Subscribe Now/ })[2]).toBeEnabled());
    await user.click(screen.getAllByRole("button", { name: /Subscribe Now/ })[2]);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Failed to create checkout"));
    Object.defineProperty(window, "location", { configurable: true, value: original });
  });

  it("subscription: a signed-out reply from the server goes to sign in", async () => {
    member(SIGNED_IN);
    vi.mocked(actions.startSubscriptionCheckout).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    const user = userEvent.setup();
    renderSake(<SakeSubscription checkoutOpen testMode={false} />);
    await waitFor(() => expect(screen.getAllByRole("button", { name: /Subscribe Now/ })[0]).toBeEnabled());
    await user.click(screen.getAllByRole("button", { name: /Subscribe Now/ })[0]);
    expect(navigation.router.push).toHaveBeenCalledWith("/login?next=%2Fsake%2Fsubscription");
  });

  it("my reviews: oldest and lowest sorting", async () => {
    member(SIGNED_IN);
    const base = { userName: "Mia", sakeId: sake.id, servingTemp: null, purchaseLocation: null, upvotedByMe: false, mine: true, flavorTags: [] as string[], tastingNote: null, pricePaidCents: null, wouldBuyAgain: false, upvotes: 0 };
    vi.mocked(actions.getMyReviews).mockResolvedValue({
      ok: true,
      data: [
        { ...base, id: 1, sakeName: "Early High", rating: 5, createdAt: "2026-01-01T00:00:00Z" },
        { ...base, id: 2, sakeName: "Late Low", rating: 1, createdAt: "2026-06-01T00:00:00Z" },
      ],
    });
    const user = userEvent.setup();
    renderSake(<SakeMyReviews />);
    await screen.findByText("Early High");
    await user.selectOptions(screen.getByLabelText("Sort reviews"), "oldest");
    expect(screen.getAllByRole("article")[0]).toHaveTextContent("Early High");
    await user.selectOptions(screen.getByLabelText("Sort reviews"), "lowest");
    expect(screen.getAllByRole("article")[0]).toHaveTextContent("Late Low");
    expect(screen.getByText("2 reviews")).toBeInTheDocument();
  });
});
