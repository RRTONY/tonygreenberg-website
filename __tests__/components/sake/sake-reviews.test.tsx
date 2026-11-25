import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SakeReviews } from "@/components/sake/sake-reviews";
import { createReview, getReviewsBySake, getSakeMember, upvoteReview, type SakeReview } from "@/app/sake/actions";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(),
  getReviewsBySake: vi.fn(),
  createReview: vi.fn(),
  upvoteReview: vi.fn(),
}));

const SIGNED_OUT = { signedIn: false, id: null, email: null, name: null, isAdmin: false };
const SIGNED_IN = { signedIn: true, id: "u1", email: "me@example.com", name: "Mia", isAdmin: false };

const review = (over: Partial<SakeReview> = {}): SakeReview => ({
  id: 7,
  userName: "Ken",
  sakeId: "born-gold",
  sakeName: "Born Gold",
  rating: 4,
  tastingNote: "Melon and white peach.",
  flavorTags: ["Fruity", "Clean"],
  servingTemp: "chilled",
  purchaseLocation: "Tippsy",
  pricePaidCents: 4500,
  wouldBuyAgain: true,
  upvotes: 2,
  createdAt: "2026-11-20T10:00:00Z",
  upvotedByMe: false,
  mine: false,
  ...over,
});

const STATS = { avgRating: 4.2, totalReviews: 3, wouldBuyAgainPct: 67, avgPricePaid: 4200 };

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(getSakeMember).mockResolvedValue(SIGNED_OUT);
  vi.mocked(getReviewsBySake).mockResolvedValue({ reviews: [], stats: { avgRating: 0, totalReviews: 0, wouldBuyAgainPct: 0, avgPricePaid: 0 } });
});

describe("SakeReviews", () => {
  it("shows a spinner, then the empty message, and a sign-in link back to the sake when signed out", async () => {
    renderSake(<SakeReviews sakeId="born-gold" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByText(/No tasting notes yet/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in to Review" })).toHaveAttribute("href", "/login?next=%2Fsake%2Fbottle%2Fborn-gold");
    expect(getReviewsBySake).toHaveBeenCalledWith("born-gold");
  });

  it("lists reviews with the stats, the temperature label and a disabled upvote when signed out", async () => {
    vi.mocked(getReviewsBySake).mockResolvedValue({ reviews: [review(), review({ id: 8, upvotes: 0, wouldBuyAgain: false, pricePaidCents: null, servingTemp: "odd", tastingNote: null, flavorTags: [], purchaseLocation: null, userName: "" })], stats: STATS });
    renderSake(<SakeReviews sakeId="born-gold" />);
    expect(await screen.findByText("Melon and white peach.")).toBeInTheDocument();
    expect(screen.getByText(/4\.2 \(3 reviews\)/)).toBeInTheDocument();
    expect(screen.getByText(/67% would buy again/)).toBeInTheDocument();
    expect(screen.getByText(/Avg paid: \$42/)).toBeInTheDocument();
    expect(screen.getByText("Chilled (8-12°C)")).toBeInTheDocument();
    expect(screen.getByText("odd")).toBeInTheDocument();
    expect(screen.getByText("Anonymous")).toBeInTheDocument();
    const up = screen.getByRole("button", { name: "Sign in to upvote (2)" });
    expect(up).toBeDisabled();
  });

  it("lets a member write a tasting note, sending cents and the chosen fields", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(createReview).mockResolvedValue({ ok: true, data: { id: 9 } });
    renderSake(<SakeReviews sakeId="born-gold" />);
    const open = await screen.findByRole("button", { name: "Write a Tasting Note" });
    await user.click(open);
    const submit = screen.getByRole("button", { name: /Submit Tasting Note/ });
    expect(submit).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "4 / 5" }));
    await user.type(screen.getByLabelText("Tasting Note"), "Pear and snow.");
    await user.click(screen.getByRole("button", { name: "Fruity" }));
    await user.click(screen.getByRole("button", { name: "Mineral" }));
    await user.click(screen.getByRole("button", { name: "Mineral" }));
    await user.selectOptions(screen.getByLabelText(/Serving Temp/), "chilled");
    await user.type(screen.getByLabelText(/Where Purchased/), "True Sake");
    await user.type(screen.getByLabelText(/Price Paid/), "45.50");
    await user.click(screen.getByRole("button", { name: "Would buy again" }));
    await user.click(submit);
    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith({
        sakeId: "born-gold",
        rating: 4,
        tastingNote: "Pear and snow.",
        flavorTags: ["Fruity"],
        servingTemp: "chilled",
        purchaseLocation: "True Sake",
        pricePaidCents: 4550,
        wouldBuyAgain: false,
      }),
    );
    await waitFor(() => expect(getReviewsBySake).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole("button", { name: /Submit Tasting Note/ })).not.toBeInTheDocument();
  });

  it("sends only the rating when nothing else is filled, caps tags at 8, and shows a server error", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(createReview).mockResolvedValue({ ok: false, error: "That's a lot at once. Please wait a few minutes." });
    renderSake(<SakeReviews sakeId="born-gold" />);
    await user.click(await screen.findByRole("button", { name: "Write a Tasting Note" }));
    for (const tag of ["Fruity", "Floral", "Umami", "Dry", "Sweet", "Mineral", "Earthy", "Creamy", "Citrus"]) {
      await user.click(screen.getByRole("button", { name: tag }));
    }
    expect(screen.getByRole("button", { name: "Citrus" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(/\(8\/8\)/)).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "5 / 5" }));
    await user.click(screen.getByRole("button", { name: /Submit Tasting Note/ }));
    expect(await screen.findByText("That's a lot at once. Please wait a few minutes.")).toBeInTheDocument();
    expect(vi.mocked(createReview).mock.calls[0][0]).toMatchObject({ rating: 5, tastingNote: undefined, pricePaidCents: undefined, servingTemp: undefined });
  });

  it("rejects a price that isn't a dollar amount", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    renderSake(<SakeReviews sakeId="born-gold" />);
    await user.click(await screen.findByRole("button", { name: "Write a Tasting Note" }));
    await user.click(screen.getByRole("radio", { name: "3 / 5" }));
    await user.type(screen.getByLabelText(/Price Paid/), "lots");
    await user.click(screen.getByRole("button", { name: /Submit Tasting Note/ }));
    expect(await screen.findByText("Please enter a price between 0 and 1,000.")).toBeInTheDocument();
    expect(createReview).not.toHaveBeenCalled();
  });

  it("upvotes once and shows the new count", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getReviewsBySake).mockResolvedValue({ reviews: [review()], stats: STATS });
    vi.mocked(upvoteReview).mockResolvedValue({ ok: true, data: { upvotes: 3 } });
    renderSake(<SakeReviews sakeId="born-gold" />);
    const up = await screen.findByRole("button", { name: "Helpful (2)" });
    await waitFor(() => expect(up).toBeEnabled());
    await user.click(up);
    const voted = await screen.findByRole("button", { name: "Helpful (3)" });
    expect(voted).toHaveAttribute("aria-pressed", "true");
    expect(voted).toBeDisabled();
    expect(upvoteReview).toHaveBeenCalledWith(7);
  });

  it("closes the form again with Cancel, and keeps the count when an upvote fails", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getReviewsBySake).mockResolvedValue({ reviews: [review()], stats: STATS });
    vi.mocked(upvoteReview).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderSake(<SakeReviews sakeId="born-gold" />);
    await user.click(await screen.findByRole("button", { name: "Write a Tasting Note" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByLabelText("Tasting Note")).not.toBeInTheDocument();
    const up = screen.getByRole("button", { name: "Helpful (2)" });
    await user.click(up);
    await waitFor(() => expect(screen.getByRole("button", { name: "Helpful (2)" })).toHaveAttribute("aria-pressed", "false"));
  });

  it("still shows the empty state when loading fails", async () => {
    vi.mocked(getReviewsBySake).mockRejectedValue(new Error("down"));
    renderSake(<SakeReviews sakeId="born-gold" />);
    expect(await screen.findByText(/No tasting notes yet/)).toBeInTheDocument();
  });
});
