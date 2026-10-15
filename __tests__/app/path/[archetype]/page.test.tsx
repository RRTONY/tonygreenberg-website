import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import PathPage, { generateMetadata, generateStaticParams } from "@/app/path/[archetype]/page";
import { ARCHETYPES } from "@/lib/content/archetypes";
import { sanityFetch } from "@/lib/sanity/client";

type Props = Parameters<typeof PathPage>[0];
const props = (archetype: string) => pageProps({ archetype }) as unknown as Props;
const post = (n: number, category: string) => ({ _id: `p${n}`, title: `Essay ${n}`, slug: `essay-${n}`, category: { title: category, slug: "c" } });

describe("/path/[archetype]", () => {
  it("pre-builds the three archetypes", () => {
    expect(generateStaticParams()).toEqual([{ archetype: "builder" }, { archetype: "crusader" }, { archetype: "investor" }]);
  });

  it("has a per-archetype title, description and canonical; nothing for an unknown one", async () => {
    const meta = await generateMetadata(props("builder"));
    expect(meta.title).toBe("The Builder — Your Reading Path");
    expect(meta.description).toBe(ARCHETYPES.builder.description);
    expect(meta.alternates?.canonical).toBe("/path/builder");
    expect(await generateMetadata(props("wizard"))).toEqual({});
  });

  it("404s an unknown archetype", async () => {
    await expect(PathPage(props("wizard"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("lists at most 5 essays from the archetype's categories", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([
      post(1, "Living Well"),
      ...[2, 3, 4, 5, 6, 7].map((n) => post(n, "Systems & Innovation")),
    ] as never);
    await renderServer(PathPage(props("builder")));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/Essential Reading for the Builders/)).toBeInTheDocument();
    expect(screen.queryByText("Essay 1")).not.toBeInTheDocument();
    expect(screen.getByText("Essay 2")).toBeInTheDocument();
    expect(screen.getByText("Essay 6")).toBeInTheDocument();
    expect(screen.queryByText("Essay 7")).not.toBeInTheDocument();
  });

  it("links back to the assessment and out to ImpactSoul", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([] as never);
    await renderServer(PathPage(props("investor")));
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/assessment");
    expect(hrefs).toContain("https://impactsoul.is");
  });
});
