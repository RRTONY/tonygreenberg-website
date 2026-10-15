import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { refreshPostEngagement, usePostEngagement } from "@/components/blog/engagement/use-post-engagement";
import { loadPostEngagement, type PostEngagement } from "@/app/blog/[slug]/engagement-actions";

vi.mock("@/app/blog/[slug]/engagement-actions", () => ({ loadPostEngagement: vi.fn() }));
const load = vi.mocked(loadPostEngagement);

const data = (commitments: string[]): PostEngagement => ({
  available: true,
  comments: [],
  reactions: { up: 0, neutral: 0, down: 0, notes: [] },
  myReaction: null,
  myRating: null,
  commitments,
  myCommitment: false,
});

function Probe({ slug, label }: { slug: string; label: string }) {
  const d = usePostEngagement(slug);
  return <p data-testid={label}>{d ? d.commitments.join(",") : "loading"}</p>;
}

let n = 0;
const nextSlug = () => `hook-test-${++n}`;
// What the fake server returns; null means the load fails.
let serverData: PostEngagement | null;

describe("usePostEngagement", () => {
  beforeEach(() => {
    serverData = data(["a"]);
    load.mockImplementation(async () => {
      if (!serverData) throw new Error("down");
      return serverData;
    });
  });

  it("loads once per essay and shares the result with every block", async () => {
    const slug = nextSlug();
    render(
      <>
        <Probe slug={slug} label="one" />
        <Probe slug={slug} label="two" />
      </>,
    );
    expect(screen.getByTestId("one")).toHaveTextContent("loading");
    await waitFor(() => expect(screen.getByTestId("one")).toHaveTextContent("a"));
    expect(screen.getByTestId("two")).toHaveTextContent("a");
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(slug);
  });

  it("refreshPostEngagement reloads and updates every subscriber", async () => {
    const slug = nextSlug();
    render(<Probe slug={slug} label="p" />);
    await waitFor(() => expect(screen.getByTestId("p")).toHaveTextContent("a"));
    serverData = data(["a", "b"]);
    await act(async () => refreshPostEngagement(slug));
    await waitFor(() => expect(screen.getByTestId("p")).toHaveTextContent("a,b"));
  });

  it("keeps the last good data when a reload fails", async () => {
    const slug = nextSlug();
    render(<Probe slug={slug} label="p" />);
    await waitFor(() => expect(screen.getByTestId("p")).toHaveTextContent("a"));
    serverData = null;
    await act(async () => refreshPostEngagement(slug));
    await waitFor(() => expect(load).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId("p")).toHaveTextContent("a");
  });
});
