import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RateThisThinking } from "@/components/blog/engagement/rate-this-thinking";
import { loadPostEngagement, rate, type PostEngagement } from "@/app/blog/[slug]/engagement-actions";

vi.mock("@/app/blog/[slug]/engagement-actions", () => ({ rate: vi.fn(), loadPostEngagement: vi.fn() }));
const save = vi.mocked(rate);
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
const nextSlug = () => `rate-test-${++n}`;

describe("RateThisThinking", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
    load.mockResolvedValue(empty);
  });

  it("asks about the topic and offers three choices", () => {
    render(<RateThisThinking slug={nextSlug()} topic="coffee" />);
    expect(screen.getByText("Did this change how you see coffee?")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("saves the rating and swaps the buttons for the matching reply", async () => {
    const user = userEvent.setup();
    const slug = nextSlug();
    render(<RateThisThinking slug={slug} topic="coffee" />);
    await user.click(screen.getByRole("button", { name: /shifted something/i }));
    expect(save).toHaveBeenCalledWith({ slug, rating: "partially" });
    expect(screen.getByRole("status")).toHaveTextContent("A crack in the lens");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("still shows the reply when saving fails", async () => {
    save.mockRejectedValue(new Error("down"));
    const user = userEvent.setup();
    render(<RateThisThinking slug={nextSlug()} topic="coffee" />);
    await user.click(screen.getByRole("button", { name: /not yet/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Some seeds take longer.");
  });

  it("shows the reply for a rating this browser already gave", async () => {
    load.mockResolvedValue({ ...empty, myRating: "completely" });
    render(<RateThisThinking slug={nextSlug()} topic="coffee" />);
    expect(await screen.findByRole("status")).toHaveTextContent("The best ideas don't inform");
  });
});
