import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MicroCommitment } from "@/components/blog/engagement/micro-commitment";
import { commit, loadPostEngagement, type PostEngagement } from "@/app/blog/[slug]/engagement-actions";

vi.mock("@/app/blog/[slug]/engagement-actions", () => ({ commit: vi.fn(), loadPostEngagement: vi.fn() }));
const save = vi.mocked(commit);
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
const nextSlug = () => `commit-test-${++n}`;

describe("MicroCommitment", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
    load.mockResolvedValue(empty);
  });

  it("keeps the button disabled until something non-blank is typed", async () => {
    const user = userEvent.setup();
    render(<MicroCommitment slug={nextSlug()} />);
    const button = screen.getByRole("button", { name: /commit/i });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("I will..."), "   ");
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("I will..."), "call my mom");
    expect(button).toBeEnabled();
  });

  it("sends the commitment and shows the recorded message", async () => {
    const user = userEvent.setup();
    const slug = nextSlug();
    render(<MicroCommitment slug={slug} />);
    await user.type(screen.getByLabelText("I will..."), "walk daily");
    await user.click(screen.getByRole("button", { name: /commit/i }));
    expect(save).toHaveBeenCalledWith({ slug, commitment: "walk daily" });
    expect(await screen.findByRole("status")).toHaveTextContent("Commitment recorded.");
  });

  it("shows a spinner while saving and the error on failure", async () => {
    let resolve!: (v: { ok: boolean; error?: string }) => void;
    save.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<MicroCommitment slug={nextSlug()} />);
    await user.type(screen.getByLabelText("I will..."), "walk");
    await user.click(screen.getByRole("button", { name: /commit/i }));
    const button = screen.getByRole("button", { name: /commit/i });
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    resolve({ ok: false, error: "Not saved." });
    expect(await screen.findByRole("alert")).toHaveTextContent("Not saved.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("lists what others committed to", async () => {
    load.mockResolvedValue({ ...empty, commitments: ["Read more", "Sleep earlier"] });
    render(<MicroCommitment slug={nextSlug()} />);
    expect(await screen.findByText("Others committed to:")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getByText(/Sleep earlier/)).toBeInTheDocument();
  });
});
