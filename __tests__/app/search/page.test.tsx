import { describe, expect, it, vi } from "vitest";
import { pageProps } from "@tests/helpers/render";
import SearchPage, { metadata } from "@/app/search/page";
import { SiteSearch } from "@/components/search/site-search";
import { sanityFetch } from "@/lib/sanity/client";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHARITIES } from "@/lib/content/charity-data";

type Props = Parameters<typeof SearchPage>[0];
const props = (sp: Record<string, string | string[]> = {}) => pageProps({}, sp) as unknown as Props;

describe("/search", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Search");
    expect(metadata.description).toMatch(/Search everything/);
    expect(metadata.alternates?.canonical).toBe("/search");
  });

  it("passes the trimmed ?q= through and builds the empty-state line from real counts", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(120 as never);
    const el = await SearchPage(props({ q: "  coffee " }));
    expect(el.type).toBe(SiteSearch);
    expect(el.props.initialQuery).toBe("coffee");
    expect(el.props.essayCount).toBe(120);
    expect(el.props.emptyStateLine).toMatch(
      new RegExp(`^120 essays, ${BREWSOUL_COFFEES.length} coffees, ${CHARITIES.length} charities, \\d+ assessments`),
    );
  });

  it("ignores a repeated ?q= array", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(1 as never);
    expect((await SearchPage(props({ q: ["a", "b"] }))).props.initialQuery).toBe("");
  });
});
