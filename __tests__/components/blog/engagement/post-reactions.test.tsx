import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostVerdict, QuickReaction } from "@/components/blog/engagement/post-reactions";
import { loadPostEngagement, react, type PostEngagement } from "@/app/blog/[slug]/engagement-actions";

vi.mock("@/app/blog/[slug]/engagement-actions", () => ({ react: vi.fn(), loadPostEngagement: vi.fn() }));
const save = vi.mocked(react);
const load = vi.mocked(loadPostEngagement);

const empty: PostEngagement = {
  available: true,
  comments: [],
  reactions: { up: 0, neutral: 0, down: 0, notes: [] },
  myReaction: null,
  myRating: null,
  commitments: [],
  myCommitment: false,
};
let n = 0;
const nextSlug = () => `react-test-${++n}`;

describe("QuickReaction", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
    load.mockResolvedValue(empty);
  });

  it("sends the clicked reaction", async () => {
    const user = userEvent.setup();
    const slug = nextSlug();
    render(<QuickReaction slug={slug} />);
    await user.click(screen.getByRole("button", { name: "Meh" }));
    expect(save).toHaveBeenCalledWith({ slug, reaction: "neutral", comment: undefined });
  });

  it("shows counts and locks the buttons once this browser has reacted", async () => {
    load.mockResolvedValue({ ...empty, myReaction: "up", reactions: { up: 3, neutral: 0, down: 1, notes: [] } });
    render(<QuickReaction slug={nextSlug()} />);
    const up = screen.getByRole("button", { name: "This hit" });
    await waitFor(() => expect(up).toHaveAttribute("aria-pressed", "true"));
    expect(up).toHaveTextContent("3");
    expect(up).toBeDisabled();
    expect(screen.getByRole("button", { name: "Nah" })).toHaveTextContent("1");
  });
});

describe("PostVerdict", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
    load.mockResolvedValue(empty);
  });

  it("invites the first reaction, then opens the note box after a pick", async () => {
    const user = userEvent.setup();
    render(<PostVerdict slug={nextSlug()} />);
    expect(screen.getByText("Be the first to react")).toBeInTheDocument();
    expect(screen.queryByLabelText(/a quick thought/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /this hit/i }));
    expect(screen.getByRole("button", { name: /this hit/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText(/a quick thought/i)).toBeInTheDocument();
  });

  it("sends the trimmed note with Send, and no note with Skip", async () => {
    const user = userEvent.setup();
    const slug = nextSlug();
    render(<PostVerdict slug={slug} />);
    await user.click(screen.getByRole("button", { name: /nah/i }));
    await user.type(screen.getByLabelText(/a quick thought/i), "  too long  ");
    expect(screen.getByText("12/500")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(save).toHaveBeenCalledWith({ slug, reaction: "down", comment: "too long" });

    await user.click(screen.getByRole("button", { name: /skip/i }));
    expect(save).toHaveBeenLastCalledWith({ slug, reaction: "down", comment: undefined });
  });

  it("shows the server error", async () => {
    save.mockResolvedValue({ ok: false, error: "Already reacted." });
    const user = userEvent.setup();
    render(<PostVerdict slug={nextSlug()} />);
    await user.click(screen.getByRole("button", { name: /meh/i }));
    await user.click(screen.getByRole("button", { name: /skip/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Already reacted.");
  });

  it("shows totals and reader notes, and thanks the reader after saving", async () => {
    const slug = nextSlug();
    const user = userEvent.setup();
    render(<PostVerdict slug={slug} />);
    load.mockResolvedValue({
      ...empty,
      myReaction: "up",
      reactions: { up: 2, neutral: 1, down: 0, notes: [{ reaction: "up", comment: "Loved it" }] },
    });
    await user.click(screen.getByRole("button", { name: /this hit/i }));
    await user.click(screen.getByRole("button", { name: /skip/i }));
    expect(await screen.findByRole("heading", { name: "You've weighed in." })).toBeInTheDocument();
    expect(screen.getByText("3 readers reacted")).toBeInTheDocument();
    expect(screen.getByText("Loved it")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Noted. Your take matters.");
  });
});
