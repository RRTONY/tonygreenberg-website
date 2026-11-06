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

  it("adds the roaster to a name two coffees share, so every title is different", async () => {
    expect((await generateMetadata(pageProps({ id: "dunkin-original-blend" }))).title).toMatch(/^Original Blend by .+ — BrewSoul$/);
    const titles = await Promise.all(BREWSOUL_COFFEES.map(async (c) => JSON.stringify((await generateMetadata(pageProps({ id: c.id }))).title)));
    expect(new Set(titles).size).toBe(titles.length);
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
  it("shows the coffee's own note, brew methods, pairings and farm details", async () => {
    await renderServer(Page(pageProps({ id: gesha.id })));
    expect(screen.getByText(gesha.connoisseurNote!)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to Brew It" })).toBeInTheDocument();
    for (const m of gesha.recommendedBrewMethods!) expect(screen.getByText(m)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pairs Well With" })).toBeInTheDocument();
    for (const f of gesha.foodPairingSuggestions!) expect(screen.getByText(f)).toBeInTheDocument();
    expect(screen.getByText(gesha.originFarm!)).toBeInTheDocument();
    expect(screen.getByText("50 kg, limited release")).toBeInTheDocument();
  });

  it("leaves out the pairings heading and farm rows when a coffee has none", async () => {
    const plain = BREWSOUL_COFFEES.find((c) => !c.foodPairingSuggestions?.length && !c.originFarm)!;
    await renderServer(Page(pageProps({ id: plain.id })));
    expect(screen.queryByRole("heading", { name: "Pairs Well With" })).toBeNull();
    expect(screen.queryByText("Farm")).toBeNull();
  });

  it("every coffee page carries its own note, so no two pages read the same", () => {
    const notes = BREWSOUL_COFFEES.map((c) => c.connoisseurNote?.trim() ?? "");
    expect(notes.every((n) => n.split(/\s+/).length >= 20)).toBe(true);
    expect(new Set(notes).size).toBe(notes.length);
  });
});
