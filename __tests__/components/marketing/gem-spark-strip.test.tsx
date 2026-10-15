import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { GemSparkStrip } from "@/components/marketing/gem-spark-strip";
import { sanityFetch } from "@/lib/sanity/client";
import { GEM_SPARK_SUBTITLES } from "@/lib/content/gem-sparks";

describe("GemSparkStrip", () => {
  it("renders nothing when Sanity has no posts", async () => {
    const { container } = await renderServer(GemSparkStrip());
    expect(container).toBeEmptyDOMElement();
  });

  it("lists the posts with their links and GemSpark subtitles", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([
      { title: "Five Cups", slug: "five-cups" },
      { title: "Other Post", slug: "other-post-zz" },
    ]);
    await renderServer(GemSparkStrip());
    expect(screen.getByText(/A GemSpark is a real moment/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Five Cups/ })).toHaveTextContent(GEM_SPARK_SUBTITLES["five-cups"]);
    expect(screen.getByRole("link", { name: /Other Post/ })).toHaveAttribute("href", "/blog/other-post-zz");
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ tags: ["post"] }));
  });
});
