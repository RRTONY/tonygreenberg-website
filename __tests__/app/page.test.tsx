import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import Home, { generateMetadata } from "@/app/page";
import { sanityFetch } from "@/lib/sanity/client";
import { getMostRead } from "@/lib/content/most-read";

// Two sections are async Server Components (they fetch their own data), which
// a browser-side render can't run; they're stubbed here and tested on their own.
vi.mock("@/components/marketing/editor-picks-section", () => ({ EditorPicksSection: () => <section>Editor picks</section> }));
vi.mock("@/components/marketing/gem-spark-strip", () => ({ GemSparkStrip: () => <section>Gem spark</section> }));
vi.mock("@/lib/content/most-read", () => ({ getMostRead: vi.fn() }));

const posts = [
  { _id: "1", title: "Five Cups of Trust", slug: "five-cups", publishedAt: "2026-01-01", excerpt: "Trust.", category: { title: "Business", slug: "business" } },
  { _id: "2", title: "The Index", slug: "the-index", publishedAt: "2026-02-01", excerpt: "Signals.", category: { title: "AI", slug: "ai" } },
  { _id: "3", title: "Coffee Notes", slug: "coffee-notes", publishedAt: "2026-03-01", excerpt: "Beans.", category: { title: "Business", slug: "business" } },
];

describe("/ (home)", () => {
  it("uses the approved title, the real essay count in the description, and canonical /", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(posts as never);
    const meta = await generateMetadata();
    expect(meta.title).toBe("Tony Greenberg | Strategist, Author & CEO of RampRate");
    expect(meta.description).toContain("3 essays on enterprise tech");
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.openGraph).toMatchObject({ type: "website", siteName: "Tony Greenberg", url: "/" });
  });

  it("never points the share image at a Manus host", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([] as never);
    const meta = await generateMetadata();
    expect(JSON.stringify(meta.openGraph)).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
  });

  it("renders one H1, the Four Doors, the case file link and the essay archive", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(posts as never);
    vi.mocked(getMostRead).mockResolvedValue({ posts: [], fromAnalytics: false } as never);
    await renderServer(Home());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: /choose how you want to begin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Case File/ })).toHaveAttribute("href", "/protecting-your-business");
    expect(screen.getAllByText("Five Cups of Trust").length).toBeGreaterThan(0);
    expect(getMostRead).toHaveBeenCalledWith(posts);
  });
});
