import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { SakeDetail, deriveFlavorScores } from "@/components/sake/pages/sake-detail";
import { getSakeMember, startOrderCheckout } from "@/app/sake/actions";
import { qprSakeDatabase, type QPRSake } from "@/lib/content/sake/qpr-data";
import { sakeSupplyChains } from "@/lib/content/sake/supply-chain-engine";
import { renderSake } from "@tests/components/sake/sake-test-utils";
import { navigation } from "@tests/helpers/next";

vi.mock("@/app/sake/actions", () => ({ getSakeMember: vi.fn(), startOrderCheckout: vi.fn() }));
vi.mock("@/components/sake/sake-reviews", () => ({ SakeReviews: ({ sakeId }: { sakeId: string }) => <div data-testid="reviews">{sakeId}</div> }));
vi.mock("sonner", () => ({ toast: vi.fn() }));

const SIGNED_OUT = { signedIn: false, id: null, email: null, name: null, isAdmin: false };
const SIGNED_IN = { signedIn: true, id: "u1", email: "me@example.com", name: "Mia", isAdmin: false };

// A sake with a supply chain (carbon card) and one without.
const withChain = qprSakeDatabase.find((s) => sakeSupplyChains.some((c) => c.sakeId === s.id))!;
const withoutChain = qprSakeDatabase.find((s) => !sakeSupplyChains.some((c) => c.sakeId === s.id)) ?? withChain;

const assign = vi.fn();

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(getSakeMember).mockResolvedValue(SIGNED_OUT);
  navigation.searchParams = new URLSearchParams();
  Object.defineProperty(window, "location", { configurable: true, value: { ...window.location, assign, origin: "https://tonygreenberg.com" } });
});

afterEach(() => {
  assign.mockReset();
});

describe("deriveFlavorScores", () => {
  it("keeps the app's formula", () => {
    const base = { ...withChain, smv: 5, acidity: 1.2, aminoAcid: undefined, type: "Junmai Daiginjo" } as QPRSake;
    expect(deriveFlavorScores(base)).toEqual({ sweetness: 35, umami: 45, acidity: 66, body: 56, aroma: 85, dryness: 65 });
    expect(deriveFlavorScores({ ...base, aminoAcid: 1, type: "Junmai Ginjo", smv: -30 }).aroma).toBe(72);
    expect(deriveFlavorScores({ ...base, type: "Junmai" }).aroma).toBe(55);
  });
});

describe("SakeDetail", () => {
  it("shows the sake, its radar, stats, notes, retailers, carbon card and reviews", () => {
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    expect(screen.getByRole("heading", { level: 1, name: withChain.name })).toBeInTheDocument();
    expect(screen.getByText(withChain.description)).toBeInTheDocument();
    expect(screen.getByText(withChain.labelKanji)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Sweet \d+, Umami/ })).toBeInTheDocument();
    expect(screen.getByText(`QPR ${withChain.qprUS} — ${withChain.qprTier.charAt(0).toUpperCase()}${withChain.qprTier.slice(1)}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Carbon Footprint" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Full Supply Chain/ })).toHaveAttribute("href", `/sake/supply-chain?sake=${withChain.id}`);
    expect(screen.getByRole("link", { name: /Find Nearby Retailers/ })).toHaveAttribute(
      "href",
      `/sake/retailer-finder?sake=${encodeURIComponent(withChain.name)}`,
    );
    expect(screen.getByRole("link", { name: "QPR Rankings" })).toHaveAttribute("href", "/sake/qpr");
    expect(screen.getByTestId("reviews")).toHaveTextContent(withChain.id);
  });

  it("switches to Japanese", async () => {
    const user = userEvent.setup();
    renderSake(<SakeDetail sake={withoutChain} checkoutOpen={false} />);
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByRole("heading", { level: 1, name: withoutChain.nameJa })).toBeInTheDocument();
    expect(screen.getByText("ご注文の受付はまもなく開始します。またお越しください。")).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(screen.getByRole("img", { name: /甘い/ })).toBeInTheDocument();
  });

  it("says ordering opens soon instead of Buy Now while checkout is off", () => {
    renderSake(<SakeDetail sake={withChain} checkoutOpen={false} />);
    expect(screen.getByText("Ordering opens soon. Please check back.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Buy Now/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Buy Now/ })).not.toBeInTheDocument();
  });

  it("sends signed-out buyers to sign in and back", () => {
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    expect(screen.getByRole("link", { name: /Buy Now/ })).toHaveAttribute(
      "href",
      `/login?next=${encodeURIComponent(`/sake/bottle/${withChain.id}`)}`,
    );
  });

  it("starts checkout for the chosen quantity and goes to Stripe", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(startOrderCheckout).mockResolvedValue({ ok: true, data: { url: "https://checkout.stripe.com/x" } });
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    const buy = await screen.findByRole("button", { name: /Buy Now/ });
    await user.click(screen.getByRole("button", { name: "More" }));
    await user.click(screen.getByRole("button", { name: "More" }));
    await user.click(screen.getByRole("button", { name: "Fewer" }));
    await user.click(buy);
    expect(startOrderCheckout).toHaveBeenCalledWith([{ productId: withChain.id, quantity: 2 }]);
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/x"));
  });

  it("shows the server's error, or goes to sign-in when the session ran out", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(startOrderCheckout).mockResolvedValueOnce({ ok: false, error: "Ordering opens soon. Please check back." });
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    await user.click(await screen.findByRole("button", { name: /Buy Now/ }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Ordering opens soon. Please check back."));

    vi.mocked(startOrderCheckout).mockResolvedValueOnce({ ok: false, error: "Please sign in first.", signedOut: true });
    await user.click(screen.getByRole("button", { name: /Buy Now/ }));
    await waitFor(() =>
      expect(navigation.router.push).toHaveBeenCalledWith(`/login?next=${encodeURIComponent(`/sake/bottle/${withChain.id}`)}`),
    );
  });

  it("adds to the browser cart (max 12) and confirms", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("sake-cart", JSON.stringify([{ productId: withChain.id, quantity: 11 }, { productId: "other", quantity: 1 }]));
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    for (let i = 0; i < 15; i++) await user.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByText("12")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cart" }));
    expect(screen.getByRole("button", { name: "Added" })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("sake-cart")!)).toEqual([
      { productId: withChain.id, quantity: 12 },
      { productId: "other", quantity: 1 },
    ]);
  });

  it("adds a new sake to an empty cart", async () => {
    const user = userEvent.setup();
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    await user.click(screen.getByRole("button", { name: "Cart" }));
    expect(JSON.parse(window.localStorage.getItem("sake-cart")!)).toEqual([{ productId: withChain.id, quantity: 1 }]);
  });

  it("saves to Favorites, shares by copying the link, and goes back", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    await user.click(screen.getByRole("button", { name: "Save to favorites" }));
    expect(screen.getByRole("button", { name: "Remove from favorites" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(window.localStorage.getItem("sake-favorites-v1")!)[0]).toMatchObject({ id: withChain.id, type: "sake" });

    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(writeText).toHaveBeenCalledWith(`https://tonygreenberg.com/sake/bottle/${withChain.id}`);
    expect(toast).toHaveBeenCalledWith("Link copied");

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(window.history.length > 1 ? navigation.router.back : navigation.router.push).toHaveBeenCalled();
  });

  it("uses the phone's share sheet when there is one", async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockRejectedValue(new Error("closed"));
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(share).toHaveBeenCalledWith({ title: withChain.name, url: `https://tonygreenberg.com/sake/bottle/${withChain.id}` });
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
  });

  it("shows Stripe's return notices", () => {
    navigation.searchParams = new URLSearchParams("order=success");
    const { unmount } = renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    expect(screen.getByText(/Your order is confirmed/)).toBeInTheDocument();
    unmount();
    navigation.searchParams = new URLSearchParams("order=cancelled");
    renderSake(<SakeDetail sake={withChain} checkoutOpen />);
    expect(screen.getByText("Checkout was cancelled. Nothing was charged.")).toBeInTheDocument();
  });
});
