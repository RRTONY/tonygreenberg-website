import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import SeriesPage, { metadata } from "@/app/series/page";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { SERIES } from "@/lib/content/essay-series";
import { postHref } from "@/lib/content/post-redirects";

const trust = SERIES.find((s) => s.title === "The Trust Trilogy")!;
const POSTS = [
  { slug: trust.posts[0], title: "Only Time Buys Trust" },
  { slug: trust.posts[2], title: "The Arithmetic of Relationships" },
  { slug: trust.posts[1], title: "Why Good Service Is All About Trust" },
];

function seriesCard(title: string) {
  return screen.getByRole("heading", { level: 2, name: title }).closest("div.flex-col") as HTMLElement;
}

describe("/series", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue(POSTS);
  });
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Series");
    expect(metadata.description).toMatch(/^Curated essay collections/);
    expect(metadata.alternates?.canonical).toBe("/series");
  });

  it("asks Sanity once for every series post, tagged for revalidation", async () => {
    await renderServer(SeriesPage());
    expect(sanityFetch).toHaveBeenCalledTimes(1);
    const arg = vi.mocked(sanityFetch).mock.calls[0][0];
    expect(arg.query).toBe(postsBySlugsQuery);
    expect(arg.tags).toEqual(["post"]);
    const slugs = (arg.params as { slugs: string[] }).slugs;
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(expect.arrayContaining(SERIES.flatMap((s) => s.posts)));
  });

  it("renders one H1 and a card per series with its part count", async () => {
    await renderServer(SeriesPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Essay Series");
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(SERIES.length);
    expect(screen.getByText("Culture & Communication · 3 Parts", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Why trust is the only currency that compounds")).toBeInTheDocument();
  });

  it("lists the found episodes in series order and starts reading at part one", async () => {
    await renderServer(SeriesPage());
    const card = seriesCard("The Trust Trilogy");
    const episodes = within(card).getAllByRole("link").filter((a) => !/Start Reading/.test(a.textContent ?? ""));
    expect(episodes.map((a) => a.textContent)).toEqual([
      "1.Only Time Buys Trust",
      "2.Why Good Service Is All About Trust",
      "3.The Arithmetic of Relationships",
    ]);
    expect(episodes[0]).toHaveAttribute("href", postHref(trust.posts[0]));
    expect(within(card).getByRole("link", { name: /Start Reading/ })).toHaveAttribute("href", postHref(trust.posts[0]));
  });

  it("still shows a series with no posts found, just without episode links", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([]);
    await renderServer(SeriesPage());
    const card = seriesCard("The Blockchain Papers");
    expect(within(card).queryAllByRole("link")).toHaveLength(0);
    expect(within(card).getByText(/A five-part investigation into blockchain/)).toBeInTheDocument();
  });

  it("links back to the blog and on to the essay index", async () => {
    await renderServer(SeriesPage());
    expect(screen.getByRole("link", { name: /Back to The Blog/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Search All Essays/ })).toHaveAttribute("href", "/the-index");
  });
});
