import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { pageProps, renderServer } from "../../../../helpers/render";
import Page, { generateMetadata, generateStaticParams } from "@/app/brewsoul/cities/[slug]/page";
import { CITIES } from "@/lib/content/brewsoul-cities";

const withData = CITIES.find((c) => c.bestShops.length > 0)!;
const withoutData = CITIES.find((c) => c.bestShops.length === 0)!;

describe("/brewsoul/cities/[slug]", () => {
  it("pre-builds a page for every one of the 25 real cities", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(25);
    expect(params).toEqual(CITIES.map((c) => ({ slug: c.slug })));
  });

  it("builds the title, description and canonical from the city", async () => {
    const meta = await generateMetadata(pageProps({ slug: "portland" }));
    expect(meta.title).toBe("Portland Coffee — BrewSoul");
    expect(meta.description).toMatch(/^Portland, OR: Where even the gas stations/);
    expect(meta.alternates?.canonical).toBe("/brewsoul/cities/portland");
    expect(await generateMetadata(pageProps({ slug: "atlantis" }))).toEqual({});
  });

  it("returns a 404 for an unknown city", async () => {
    await expect(Page(pageProps({ slug: "atlantis" }))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("shows one H1 with the city, its stats and the full breakdown when shop data exists", async () => {
    await renderServer(Page(pageProps({ slug: withData.slug })));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(withData.name);
    expect(screen.getByText(`#${withData.rank} in America`)).toBeInTheDocument();
    expect(screen.getAllByText(withData.stats.bestShop).length).toBeGreaterThan(0);
    expect(screen.queryByText("Full Data Coming Soon")).not.toBeInTheDocument();
  });

  it("says full data is coming soon for a city without shop data", async () => {
    await renderServer(Page(pageProps({ slug: withoutData.slug })));
    expect(screen.getByRole("heading", { level: 2, name: "Full Data Coming Soon" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to all cities/i })).toHaveAttribute("href", "/brewsoul/cities");
    expect(screen.getByRole("link", { name: "BrewSoul Home" })).toHaveAttribute("href", "/brewsoul/home");
  });

  // Live check 2026-11-14: four Unsplash photos (Seattle, Nashville, Minneapolis, Houston,
  // Raleigh-Durham) were deleted upstream and showed as broken images.
  it("shows the photo when a city has one, and just the banner (no broken image) when it doesn't", async () => {
    const DEAD = ["photo-1502175353174-a7a70e73b4c3", "photo-1545419913-775e4b1b4a38", "photo-1558618666-fcd25c85f82e", "photo-1548519853-a7c05d085e24"];
    expect(CITIES.filter((c) => DEAD.some((d) => c.heroImage?.includes(d)))).toEqual([]);

    const withPhoto = CITIES.find((c) => c.heroImage)!;
    const { container, unmount } = await renderServer(Page(pageProps({ slug: withPhoto.slug })));
    expect(container.querySelector("section img")).toHaveAttribute("src", expect.stringContaining("images.unsplash.com"));
    unmount();

    const noPhoto = CITIES.find((c) => !c.heroImage)!;
    const view = await renderServer(Page(pageProps({ slug: noPhoto.slug })));
    expect(view.container.querySelector("section img")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(noPhoto.name);
  });
});
