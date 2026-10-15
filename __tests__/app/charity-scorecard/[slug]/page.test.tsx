import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import CharityProfilePage, { generateMetadata, generateStaticParams } from "@/app/charity-scorecard/[slug]/page";
import { CHARITIES } from "@/lib/content/charity-data";

type Props = Parameters<typeof CharityProfilePage>[0];
const props = (slug: string) => pageProps({ slug }) as unknown as Props;
const first = CHARITIES[0];

describe("/charity-scorecard/[slug]", () => {
  it("pre-builds one page per charity", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(CHARITIES.length);
    expect(params[0]).toEqual({ slug: first.slug });
  });

  it("has a per-charity title, description with the score, and canonical", async () => {
    const meta = await generateMetadata(props(first.slug));
    expect(meta.title).toBe(`${first.name} — Charity Scorecard`);
    expect(meta.description).toContain(`${first.totalScore}/100 (${first.grade})`);
    expect(meta.alternates?.canonical).toBe(`/charity-scorecard/${first.slug}`);
    expect(await generateMetadata(props("no-such-charity"))).toEqual({});
  });

  it("404s an unknown charity", async () => {
    await expect(CharityProfilePage(props("no-such-charity"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders the charity name as the one H1, its rank, back link and website", async () => {
    await renderServer(CharityProfilePage(props(first.slug)));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(first.name);
    expect(screen.getByText(`Rank #1 of ${CHARITIES.length}`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to index/i })).toHaveAttribute("href", "/charity-scorecard");
    const site = screen.getAllByRole("link").find((a) => a.getAttribute("href") === first.website);
    expect(site).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links only to other charities in the same sector", async () => {
    await renderServer(CharityProfilePage(props(first.slug)));
    const bySlug = new Map(CHARITIES.map((c) => [c.slug, c]));
    const others = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => h.startsWith("/charity-scorecard/"))
      .map((h) => h.split("/").pop()!);
    for (const s of others) {
      expect(s).not.toBe(first.slug);
      expect(bySlug.get(s)?.sector).toBe(first.sector);
    }
  });
});
