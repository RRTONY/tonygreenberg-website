import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { pageProps, renderServer } from "../../../../helpers/render";
import Page, { generateMetadata, generateStaticParams } from "@/app/brewsoul/coffee/[id]/page";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";

const gesha = BREWSOUL_COFFEES.find((c) => c.id === "gesha-village-lot-74")!;

describe("/brewsoul/coffee/[id]", () => {
  it("pre-builds a page for every coffee in the catalog", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(BREWSOUL_COFFEES.length);
    expect(new Set(params.map((p) => p.id)).size).toBe(BREWSOUL_COFFEES.length);
  });

  it("builds the title, description and canonical from the coffee", async () => {
    const meta = await generateMetadata(pageProps({ id: gesha.id }));
    expect(meta.title).toBe("Gesha Village Lot 74 — BrewSoul");
    expect(meta.description).toContain("by Gesha Village Coffee Estate: Ethiopia, Gesha 1931, Washed.");
    expect(meta.alternates?.canonical).toBe("/brewsoul/coffee/gesha-village-lot-74");
    expect(await generateMetadata(pageProps({ id: "no-such-coffee" }))).toEqual({});
  });

  it("returns a 404 for an unknown id, including a malformed escape", async () => {
    await expect(Page(pageProps({ id: "no-such-coffee" }))).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(Page(pageProps({ id: "%E0%A4%A" }))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("finds a coffee whose id arrives percent-encoded", async () => {
    const encoded = encodeURIComponent(gesha.id).replace("-", "%2D");
    await renderServer(Page(pageProps({ id: encoded })));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(gesha.name);
  });

  it("shows one H1, the producer, breadcrumbs and the buy links", async () => {
    await renderServer(Page(pageProps({ id: gesha.id })));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("by Gesha Village Coffee Estate")).toBeInTheDocument();
    const crumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" }));
    expect(crumbs.getByRole("link", { name: "Browse" })).toHaveAttribute("href", "/brewsoul/browse");
    const buy = screen.getByRole("link", { name: /Gesha Village Direct/ });
    expect(buy).toHaveAttribute("href", "https://geshacoffee.com");
    expect(buy).toHaveAttribute("target", "_blank");
  });

  it("suggests up to 3 similar coffees from the same country or region, never itself", async () => {
    await renderServer(Page(pageProps({ id: gesha.id })));
    const expected = BREWSOUL_COFFEES.filter(
      (c) => c.id !== gesha.id && (c.originCountry === gesha.originCountry || c.originRegion === gesha.originRegion),
    )
      .slice(0, 3)
      .map((c) => `/brewsoul/coffee/${c.id}`);
    const similar = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((h) => h?.startsWith("/brewsoul/coffee/"));
    expect(similar).toEqual(expected);
  });
});
