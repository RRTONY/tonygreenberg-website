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
});
