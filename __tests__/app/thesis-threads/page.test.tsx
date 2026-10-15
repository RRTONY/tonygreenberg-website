import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderServer } from "@tests/helpers/render";
import ThesisThreadsPage, { metadata } from "@/app/thesis-threads/page";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { THESIS_THREADS } from "@/lib/content/thesis-threads";
import { postHref } from "@/lib/content/post-redirects";

const [opacity, trust] = THESIS_THREADS;
const POSTS = [
  { _id: "p1", title: "Mapped Opacity Essay", slug: opacity.articleSlugs[0], publishedAt: "2020-01-01" },
  { _id: "p2", title: "Mapped Trust Essay", slug: trust.articleSlugs[0], publishedAt: "2021-01-01" },
  { _id: "p3", title: "Stray Essay", slug: "a-post-on-no-thread", publishedAt: "2022-01-01" },
];

function stat(label: string) {
  return screen.getByText(label, { selector: "div" }).previousElementSibling!;
}

describe("/thesis-threads", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue(POSTS);
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Thesis Threads");
    expect(metadata.description).toMatch(/extractive-vs-regenerative thesis/);
    expect(metadata.alternates?.canonical).toBe("/thesis-threads");
  });

  it("reads every post from Sanity, tagged for revalidation", async () => {
    await renderServer(ThesisThreadsPage());
    expect(sanityFetch).toHaveBeenCalledWith({ query: allPostsForArchiveQuery, tags: ["post"] });
  });

  it("renders one H1, the core thesis, and counts mapped and unmapped essays", async () => {
    await renderServer(ThesisThreadsPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Thesis Threads");
    expect(screen.getByText(/Extractive capitalism is economically inefficient and morally bankrupt\./)).toBeInTheDocument();
    expect(stat("Essays")).toHaveTextContent("3");
    expect(stat("Mapped")).toHaveTextContent("2");
    expect(stat("Unmapped")).toHaveTextContent("1");
  });

  it("shows the first thread's essays and lists the unmapped one", async () => {
    await renderServer(ThesisThreadsPage());
    expect(screen.getByRole("heading", { level: 2, name: opacity.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mapped Opacity Essay/ })).toHaveAttribute("href", postHref(opacity.articleSlugs[0]));
    expect(screen.getByText("Unmapped Articles (1)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Stray Essay/ })).toHaveAttribute("href", postHref("a-post-on-no-thread"));
  });

  it("switches thread when a reader picks another one", async () => {
    const user = userEvent.setup();
    await renderServer(ThesisThreadsPage());
    await user.click(screen.getByRole("button", { name: new RegExp(trust.title) }));
    expect(screen.getByRole("heading", { level: 2, name: trust.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mapped Trust Essay/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Mapped Opacity Essay/ })).not.toBeInTheDocument();
  });

  it("says so when no essays are mapped to a thread", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([]);
    await renderServer(ThesisThreadsPage());
    expect(screen.getByText("No articles mapped to this thread yet.")).toBeInTheDocument();
  });
});
