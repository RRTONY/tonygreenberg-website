import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MirrorReflection } from "@/components/blog/mirror-reflection";
import { MIRROR_ARTICLES, MIRROR_DIMENSIONS } from "@/lib/content/mirror-data";

describe("MirrorReflection", () => {
  it("renders nothing for an essay that isn't mapped", () => {
    const { container } = render(<MirrorReflection slug="not-a-mirror-essay" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the reflection, prompt, dimension and assessment link for a mapped essay", () => {
    const [slug, entry] = Object.entries(MIRROR_ARTICLES)[0];
    const dimension = MIRROR_DIMENSIONS.find((d) => d.id === entry.dimension)!;
    render(<MirrorReflection slug={slug} />);
    expect(screen.getByText(`This article is a mirror for ${entry.reflection}`)).toBeInTheDocument();
    expect(screen.getByText(entry.prompt)).toBeInTheDocument();
    expect(screen.getByText(dimension.name)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /take the full assessment/i })).toHaveAttribute("href", "/the-mirror");
  });
});
