import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostComments } from "@/components/blog/engagement/post-comments";
import { addComment, loadPostEngagement, type PostEngagement } from "@/app/blog/[slug]/engagement-actions";

vi.mock("@/app/blog/[slug]/engagement-actions", () => ({
  addComment: vi.fn(),
  loadPostEngagement: vi.fn(),
}));
const add = vi.mocked(addComment);
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

// The engagement store caches per slug, so every test uses its own slug.
let n = 0;
const nextSlug = () => `comments-test-${++n}`;

describe("PostComments", () => {
  beforeEach(() => {
    add.mockResolvedValue({ ok: true });
    load.mockResolvedValue(empty);
  });

  it("shows the empty prompt once loaded and requires a name and a thought", async () => {
    const user = userEvent.setup();
    render(<PostComments slug={nextSlug()} title="Five Cups" />);
    expect(await screen.findByText("Be the first to add to this conversation.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /leave your thought/i }));
    expect(await screen.findByText("Add your name.")).toBeInTheDocument();
    expect(screen.getByText("Write your thought first.")).toBeInTheDocument();
    expect(add).not.toHaveBeenCalled();
  });

  it("rejects a malformed email but accepts an empty one", async () => {
    const user = userEvent.setup();
    const slug = nextSlug();
    render(<PostComments slug={slug} title="Five Cups" />);
    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/email/i), "nope");
    await user.type(screen.getByLabelText(/your thought/i), "Lovely essay.");
    await user.click(screen.getByRole("button", { name: /leave your thought/i }));
    expect(await screen.findByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(add).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText(/email/i));
    await user.click(screen.getByRole("button", { name: /leave your thought/i }));
    await waitFor(() =>
      expect(add).toHaveBeenCalledWith({ slug, postTitle: "Five Cups", name: "Ada", email: "", content: "Lovely essay.", website: "" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Your thought has been received.");
  });

  it("shows a spinner while saving", async () => {
    let resolve!: (v: { ok: boolean }) => void;
    add.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<PostComments slug={nextSlug()} title="T" />);
    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/your thought/i), "Hi");
    await user.click(screen.getByRole("button", { name: /leave your thought/i }));
    const button = screen.getByRole("button", { name: /leave your thought/i });
    await waitFor(() => expect(button).toBeDisabled());
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    resolve({ ok: true });
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("shows the server's error and keeps the form", async () => {
    add.mockResolvedValue({ ok: false, error: "Comments are paused." });
    const user = userEvent.setup();
    render(<PostComments slug={nextSlug()} title="T" />);
    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/your thought/i), "Hi");
    await user.click(screen.getByRole("button", { name: /leave your thought/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Comments are paused.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("lists the loaded comments with a count in the heading", async () => {
    load.mockResolvedValue({
      ...empty,
      comments: [
        { id: 1, name: "Ada", content: "First!", createdAt: "2026-01-05T12:00:00Z" },
        { id: 2, name: "Bo", content: "Second.", createdAt: "2026-02-05T12:00:00Z" },
      ],
    });
    render(<PostComments slug={nextSlug()} title="T" />);
    expect(await screen.findByText("First!")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /discourse · 2/i })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Jan 5, 2026")).toBeInTheDocument();
  });
});
