import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import GemSparkPage, { metadata, revalidate } from "@/app/gem-spark/page";
import { getFeaturedSparks } from "@/app/gem-spark/actions";

vi.mock("@/app/gem-spark/actions", () => ({
  getFeaturedSparks: vi.fn(async () => []),
  getGemSparkCounts: vi.fn(async () => ({ longForm: 0, shortForm: 0 })),
  trackGemSparkView: vi.fn(async () => {}),
  submitGemSparkStory: vi.fn(async () => ({ ok: true })),
}));

describe("/gem-spark", () => {
  beforeEach(() => {
    vi.mocked(getFeaturedSparks).mockResolvedValue([]);
  });

  it("uses the GemSpark app's own title and description, with a canonical and share image", () => {
    // Too long for the " | Tony Greenberg" suffix, so the shared helper sets it as an absolute title.
    expect(metadata.title).toEqual({ absolute: "The GemSpark | The Fusion of Serendipity and Synchronicity" });
    expect(metadata.description).toMatch(/^A story about what happens when you stop sweeping up the glass/);
    expect(metadata.alternates?.canonical).toBe("/gem-spark");
    expect(JSON.stringify(metadata.openGraph)).toContain("cdn.sanity.io");
    expect(revalidate).toBe(300);
  });

  it("renders the story with one H1, Sanity images and same-site links to Tony's pages", async () => {
    await renderServer(GemSparkPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The GemSpark");
    for (const heading of ["The Setup", "The Signal in the Noise", "The Collision", "The Framework", "Glossary of Terms"]) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
    }
    const images = screen.getAllByRole("img").filter((img) => img.tagName === "IMG");
    expect(images).toHaveLength(4);
    for (const img of images) expect(img.getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    expect(document.body.innerHTML).not.toMatch(/manus/i);
    expect(screen.getByRole("link", { name: '"High Hells"' })).toHaveAttribute(
      "href",
      "/blog/high-hells-demise-of-powerful-femininity",
    );
    expect(screen.getByRole("link", { name: "Human OS 2.0" })).toHaveAttribute("href", "/humanos");
    expect(screen.getByRole("link", { name: "Explore Tony Greenberg’s work" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "David Fenton" })).toHaveAttribute("target", "_blank");
  });

  it("shows the 'Coming Soon' invitation with no featured sparks, and the featured ones when there are", async () => {
    await renderServer(GemSparkPage());
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();

    vi.mocked(getFeaturedSparks).mockResolvedValue([
      { id: "1", name: "Ana", story: "The wrong train took me to my next job.", tagline: "Detour", location: "Lisbon" },
    ]);
    await renderServer(GemSparkPage());
    const featured = screen.getByText("Founding GemSpark Spotters").closest("section")!;
    expect(within(featured).getByText("The wrong train took me to my next job.")).toBeInTheDocument();
  });
});
